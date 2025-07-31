// ExperimentTracker.js - 実験追跡・振り返りシステム
// HaQei Analyzer - Phase 5.3: 実践行動ブリッジ強化

class ExperimentTracker {
  constructor(storageManager, statisticalEngine) {
    this.storageManager = storageManager;
    this.statisticalEngine = statisticalEngine;
    this.scientificFormatter = new ScientificFormatter();
    
    // 実験データの構造定義
    this.experimentSchema = {
      id: 'string',
      title: 'string',
      description: 'string',
      startDate: 'date',
      endDate: 'date',
      status: 'enum', // planned, active, completed, abandoned
      difficulty: 'enum', // micro, mini, light, moderate, intensive
      osTarget: 'enum', // engine, interface, safemode
      results: 'object',
      reflections: 'array',
      metadata: 'object'
    };
    
    // 振り返りプロンプトのテンプレート
    this.reflectionTemplates = this.initializeReflectionTemplates();
    
    // 成長可視化の設定
    this.visualizationConfig = {
      chartType: 'line',
      timeRange: 30, // 30日間
      metrics: ['completion_rate', 'satisfaction', 'growth_perception', 'os_balance'],
      colors: {
        engine: '#FF6B6B',
        interface: '#4ECDC4', 
        safemode: '#45B7D1'
      }
    };
    
    console.log("📊 ExperimentTracker initialized with bunenjin philosophy integration");
  }
  
  /**
   * 実験の追跡開始
   * @param {Object} experimentData - 実験データ
   * @returns {string} 実験ID
   */
  trackExperiment(experimentData) {
    const experiment = this.validateAndNormalizeExperiment(experimentData);
    const experimentId = this.generateExperimentId(experiment);
    
    experiment.id = experimentId;
    experiment.status = 'active';
    experiment.startDate = new Date().toISOString();
    experiment.metadata = {
      ...experiment.metadata,
      createdAt: new Date().toISOString(),
      bunenjinCompliance: this.checkBunenjinCompliance(experiment),
      trackingVersion: '5.3.0'
    };
    
    // StorageManagerを使用してローカル保存
    this.storageManager.set(`experiment_${experimentId}`, experiment);
    
    // 実験履歴の更新
    this.updateExperimentHistory(experimentId, 'started');
    
    console.log(`🧪 Experiment tracking started: ${experiment.title}`);
    return experimentId;
  }
  
  /**
   * 実験結果の記録
   * @param {string} experimentId - 実験ID
   * @param {Object} results - 実験結果
   * @returns {Object} 更新された実験データ
   */
  recordExperimentResults(experimentId, results) {
    const experiment = this.storageManager.get(`experiment_${experimentId}`);
    
    if (!experiment) {
      throw new Error(`Experiment not found: ${experimentId}`);
    }
    
    // 結果の統計的検証
    const validatedResults = this.validateResults(results);
    
    experiment.results = {
      ...experiment.results,
      ...validatedResults,
      recordedAt: new Date().toISOString()
    };
    
    experiment.status = 'completed';
    experiment.endDate = new Date().toISOString();
    
    // 自動振り返りプロンプトの生成
    const reflectionPrompts = this.generateReflectionPrompts(experiment);
    experiment.reflections = experiment.reflections || [];
    experiment.reflections.push({
      type: 'auto_generated',
      prompts: reflectionPrompts,
      generatedAt: new Date().toISOString()
    });
    
    this.storageManager.set(`experiment_${experimentId}`, experiment);
    this.updateExperimentHistory(experimentId, 'completed');
    
    console.log(`✅ Experiment results recorded: ${experiment.title}`);
    return experiment;
  }
  
  /**
   * 振り返りプロンプトの生成
   * @param {Object} experiment - 実験データ
   * @returns {Array} 振り返りプロンプト
   */
  generateReflectionPrompts(experiment) {
    const prompts = [];
    const osTarget = experiment.osTarget;
    const baseTemplate = this.reflectionTemplates[osTarget] || this.reflectionTemplates.general;
    
    // bunenjin哲学に基づく基本振り返り
    prompts.push({
      category: 'bunenjin_awareness',
      question: baseTemplate.bunenjin_question,
      purpose: '分人の多様性認識',
      reflection_time: '3-5分'
    });
    
    // 実験特有の振り返り
    if (experiment.difficulty === 'micro') {
      prompts.push({
        category: 'micro_impact',
        question: 'この小さな実験で、どの分人が活動しましたか？その分人はどんな感覚を味わいましたか？',
        purpose: 'micro-experiment の分人への影響確認',
        reflection_time: '2-3分'
      });
    }
    
    // OS別詳細振り返り
    prompts.push(...this.generateOSSpecificPrompts(experiment));
    
    // 統合的振り返り
    prompts.push({
      category: 'integration',
      question: '今回の実験を通じて、あなたの複数の分人はどのように協力しましたか？',
      purpose: '分人間の協調関係の確認',
      reflection_time: '5-7分'
    });
    
    return prompts;
  }
  
  /**
   * 成長可視化グラフの生成
   * @param {string} userId - ユーザーID
   * @param {Object} options - 可視化オプション
   * @returns {Object} Chart.js用データ
   */
  generateGrowthVisualization(userId, options = {}) {
    const experiments = this.getUserExperiments(userId);
    const timeRange = options.timeRange || this.visualizationConfig.timeRange;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    // 期間内の実験をフィルタ
    const recentExperiments = experiments.filter(exp => 
      new Date(exp.startDate) >= startDate
    );
    
    // メトリクス計算
    const metrics = this.calculateGrowthMetrics(recentExperiments);
    
    // Chart.js用データの構築
    const chartData = {
      type: 'line',
      data: {
        labels: this.generateTimeLabels(startDate, timeRange),
        datasets: [
          {
            label: 'Engine OS 成長',
            data: metrics.engine_growth,
            borderColor: this.visualizationConfig.colors.engine,
            backgroundColor: this.visualizationConfig.colors.engine + '20',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Interface OS 成長',
            data: metrics.interface_growth,
            borderColor: this.visualizationConfig.colors.interface,
            backgroundColor: this.visualizationConfig.colors.interface + '20',
            tension: 0.4,
            fill: true
          },
          {
            label: 'SafeMode OS 成長',
            data: metrics.safemode_growth,
            borderColor: this.visualizationConfig.colors.safemode,
            backgroundColor: this.visualizationConfig.colors.safemode + '20',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '分人成長トラッキング (過去30日)',
            font: { size: 16 }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            title: {
              display: true,
              text: '成長実感度'
            },
            ticks: {
              callback: function(value) {
                return (value * 100).toFixed(0) + '%';
              }
            }
          },
          x: {
            title: {
              display: true,
              text: '日付'
            }
          }
        }
      }
    };
    
    return {
      chartData,
      statistics: this.generateGrowthStatistics(metrics),
      insights: this.generateGrowthInsights(metrics, recentExperiments)
    };
  }
  
  /**
   * 実験履歴の分析
   * @param {string} userId - ユーザーID
   * @returns {Object} 分析結果
   */
  analyzeExperimentHistory(userId) {
    const experiments = this.getUserExperiments(userId);
    const completedExperiments = experiments.filter(exp => exp.status === 'completed');
    
    const analysis = {
      overview: {
        totalExperiments: experiments.length,
        completedExperiments: completedExperiments.length,
        completionRate: this.scientificFormatter.formatPercentage(
          completedExperiments.length / Math.max(experiments.length, 1)
        ),
        averageDuration: this.calculateAverageDuration(completedExperiments),
        preferredDifficulty: this.findPreferredDifficulty(completedExperiments)
      },
      osAnalysis: this.analyzeOSEngagement(completedExperiments),
      patterns: this.identifyExperimentPatterns(completedExperiments),
      recommendations: this.generateRecommendations(completedExperiments),
      bunenjinInsights: this.generateBunenjinInsights(completedExperiments)
    };
    
    return analysis;
  }
  
  /**
   * 継続的な実験提案
   * @param {string} userId - ユーザーID
   * @param {Object} osProfile - 現在のOSプロファイル
   * @returns {Array} 提案される実験
   */
  suggestNextExperiments(userId, osProfile) {
    const history = this.analyzeExperimentHistory(userId);
    const suggestions = [];
    
    // 成功パターンに基づく提案
    if (history.patterns.successfulPatterns.length > 0) {
      const pattern = history.patterns.successfulPatterns[0];
      suggestions.push({
        type: 'pattern_based',
        title: `${pattern.osTarget} OS 強化実験（成功パターン）`,
        description: `過去の成功実験と類似したアプローチで ${this.getOSDisplayName(pattern.osTarget)} を育成`,
        difficulty: pattern.difficulty,
        estimatedSuccess: pattern.successRate,
        bunenjinNote: `この分人は過去に良い成果を上げています。自然な成長を促進しましょう`
      });
    }
    
    // 不足OS補強提案
    const leastEngagedOS = history.osAnalysis.leastEngaged;
    if (leastEngagedOS) {
      suggestions.push({
        type: 'balance_improvement',
        title: `${this.getOSDisplayName(leastEngagedOS)} 育成実験`,
        description: `活用頻度の低い${this.getOSDisplayName(leastEngagedOS)}を gentle に育成`,
        difficulty: 'micro',
        estimatedSuccess: 0.7,
        bunenjinNote: `眠っている分人も大切な一部です。無理強いではなく、その分人が喜ぶ環境を探しましょう`
      });
    }
    
    // 革新的挑戦提案
    if (history.overview.completionRate > 0.8) {
      suggestions.push({
        type: 'innovation_challenge',
        title: '新領域チャレンジ実験',
        description: '未経験の難易度・OS組み合わせに挑戦',
        difficulty: this.getNextDifficultyLevel(history.overview.preferredDifficulty),
        estimatedSuccess: 0.6,
        bunenjinNote: '分人の新しい可能性を探索する冒険です'
      });
    }
    
    return suggestions.slice(0, 3); // 最大3つまで提案
  }
  
  /**
   * 実験データの検証と正規化
   * @param {Object} experimentData - 実験データ
   * @returns {Object} 検証済み実験データ
   */
  validateAndNormalizeExperiment(experimentData) {
    const experiment = {
      title: experimentData.title || '無題の実験',
      description: experimentData.description || '',
      difficulty: experimentData.difficulty || 'micro',
      osTarget: experimentData.osTarget || 'general',
      expectedDuration: experimentData.expectedDuration || '5分',
      metadata: experimentData.metadata || {},
      results: {},
      reflections: []
    };
    
    // bunenjin哲学準拠性チェック
    if (this.hasUnifiedSelfLanguage(experiment)) {
      console.warn("⚠️ Unified self language detected, applying bunenjin corrections");
      experiment.description = this.applyBunenjinCorrections(experiment.description);
    }
    
    return experiment;
  }
  
  /**
   * 実験IDの生成
   * @param {Object} experiment - 実験データ
   * @returns {string} ユニークな実験ID
   */
  generateExperimentId(experiment) {
    const timestamp = Date.now();
    const titleHash = this.generateSimpleHash(experiment.title);
    return `exp_${timestamp}_${titleHash}`;
  }
  
  /**
   * 実験履歴の更新
   * @param {string} experimentId - 実験ID
   * @param {string} action - アクション種別
   */
  updateExperimentHistory(experimentId, action) {
    let history = this.storageManager.get('experiment_history') || [];
    
    history.push({
      experimentId,
      action,
      timestamp: new Date().toISOString()
    });
    
    // 最新100件のみ保持
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    this.storageManager.set('experiment_history', history);
  }
  
  /**
   * ユーザーの実験リストを取得
   * @param {string} userId - ユーザーID
   * @returns {Array} 実験リスト
   */
  getUserExperiments(userId) {
    const keys = this.storageManager.getAllKeys();
    const experimentKeys = keys.filter(key => key.startsWith('experiment_'));
    
    const experiments = [];
    experimentKeys.forEach(key => {
      const experiment = this.storageManager.get(key);
      if (experiment && (!userId || experiment.metadata?.userId === userId)) {
        experiments.push(experiment);
      }
    });
    
    return experiments.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }
  
  /**
   * 振り返りテンプレートの初期化
   * @returns {Object} テンプレート集
   */
  initializeReflectionTemplates() {
    return {
      engine: {
        bunenjin_question: 'この実験で、あなたの内なる価値観分人はどんな発見をしましたか？他の分人との違いを感じましたか？',
        specific_prompts: [
          'どの価値観が最も強く反応しましたか？',
          'その価値観分人は普段どんな時に活動しますか？',
          '他の状況でもこの価値観分人を活かせそうですか？'
        ]
      },
      interface: {
        bunenjin_question: 'この実験で、あなたの関係性分人はどんな体験をしましたか？一人の時とは違う感覚がありましたか？',
        specific_prompts: [
          'どんな関係性の側面が活性化されましたか？',
          'その関係性分人は相手によって変化しますか？',
          'この分人が最も生き生きとする関係性はどんなものですか？'
        ]
      },
      safemode: {
        bunenjin_question: 'この実験で、あなたの安全確保分人はどう反応しましたか？この分人の知恵に気づくことはありましたか？',
        specific_prompts: [
          'どんな不安や懸念が生じましたか？',
          'その安全確保分人はどんな配慮を提供してくれましたか？',
          'この分人の保護的な役割をどう評価しますか？'
        ]
      },
      general: {
        bunenjin_question: 'この実験を通じて、どの分人が活動し、それぞれどんな体験をしましたか？',
        specific_prompts: [
          '複数の分人が関わった場合、どのように協力しましたか？',
          '状況によって異なる分人が現れましたか？',
          'どの分人が最も成長したと感じますか？'
        ]
      }
    };
  }
  
  /**
   * OS別振り返りプロンプトの生成
   * @param {Object} experiment - 実験データ
   * @returns {Array} OS別プロンプト
   */
  generateOSSpecificPrompts(experiment) {
    const osTarget = experiment.osTarget;
    const template = this.reflectionTemplates[osTarget];
    
    if (!template) return [];
    
    return template.specific_prompts.map((prompt, index) => ({
      category: `${osTarget}_specific_${index}`,
      question: prompt,
      purpose: `${osTarget} OS の詳細分析`,
      reflection_time: '3-4分'
    }));
  }
  
  /**
   * 結果の統計的検証
   * @param {Object} results - 結果データ
   * @returns {Object} 検証済み結果
   */
  validateResults(results) {
    const validatedResults = {};
    
    Object.keys(results).forEach(key => {
      if (typeof results[key] === 'number') {
        // 数値データの統計的検証
        const validation = this.statisticalEngine.validateScore(results[key]);
        validatedResults[key] = validation.correctedScore;
        
        if (!validation.isValid) {
          validatedResults[`${key}_validation_note`] = validation.warnings.join(', ');
        }
      } else {
        validatedResults[key] = results[key];
      }
    });
    
    return validatedResults;
  }
  
  /**
   * 簡易ハッシュ関数
   * @param {string} str - ハッシュ対象文字列
   * @returns {string} ハッシュ値
   */
  generateSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 6);
  }
  
  /**
   * bunenjin準拠性チェック
   * @param {Object} experiment - 実験データ
   * @returns {boolean} 準拠性
   */
  checkBunenjinCompliance(experiment) {
    const text = JSON.stringify(experiment).toLowerCase();
    
    // 統一自己概念の検出
    const unifiedSelfTerms = ['本当の自分', '真の自分', '本来の姿', '真実の姿'];
    const hasUnifiedSelfLanguage = unifiedSelfTerms.some(term => text.includes(term));
    
    // 分人思想の検出
    const bunenjinTerms = ['分人', '複数', '多様', '状況的', '使い分け'];
    const hasBunenjinLanguage = bunenjinTerms.some(term => text.includes(term));
    
    return !hasUnifiedSelfLanguage && hasBunenjinLanguage;
  }
  
  /**
   * 統一自己言語のチェック
   * @param {Object} experiment - 実験データ
   * @returns {boolean} 統一自己言語の有無
   */
  hasUnifiedSelfLanguage(experiment) {
    const text = JSON.stringify(experiment);
    return text.includes('本当の自分') || text.includes('真の自分');
  }
  
  /**
   * bunenjin修正の適用
   * @param {string} text - 修正対象テキスト
   * @returns {string} 修正済みテキスト
   */
  applyBunenjinCorrections(text) {
    return text
      .replace(/本当の自分/g, 'あなたの多様な分人')
      .replace(/真の自分/g, 'あなたの状況別の分人');
  }
  
  /**
   * OS表示名取得
   * @param {string} osType - OS種別
   * @returns {string} 表示名
   */
  getOSDisplayName(osType) {
    const names = {
      engine: 'Engine OS（内なる価値観）',
      interface: 'Interface OS（他者との関係性）',
      safemode: 'SafeMode OS（安全確保）'
    };
    return names[osType] || osType;
  }
  
  /**
   * 次の難易度レベル取得
   * @param {string} currentLevel - 現在レベル
   * @returns {string} 次のレベル
   */
  getNextDifficultyLevel(currentLevel) {
    const levels = ['micro', 'mini', 'light', 'moderate', 'intensive'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentLevel;
  }
  
  /**
   * 成長メトリクスの計算
   * @param {Array} experiments - 実験リスト
   * @returns {Object} メトリクス
   */
  calculateGrowthMetrics(experiments) {
    // 実装の簡略化 - 実際の成長データを時系列で計算
    const metrics = {
      engine_growth: [],
      interface_growth: [],
      safemode_growth: []
    };
    
    // 30日分のダミーデータ（実際は実験結果から算出）
    for (let i = 0; i < 30; i++) {
      metrics.engine_growth.push(Math.random() * 0.8 + 0.2);
      metrics.interface_growth.push(Math.random() * 0.8 + 0.2);
      metrics.safemode_growth.push(Math.random() * 0.8 + 0.2);
    }
    
    return metrics;
  }
  
  /**
   * 時間ラベルの生成
   * @param {Date} startDate - 開始日
   * @param {number} days - 日数
   * @returns {Array} ラベル配列
   */
  generateTimeLabels(startDate, days) {
    const labels = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      labels.push(date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }));
    }
    return labels;
  }
  
  /**
   * 成長統計の生成
   * @param {Object} metrics - メトリクス
   * @returns {Object} 統計情報
   */
  generateGrowthStatistics(metrics) {
    return {
      engine: this.statisticalEngine.generateStatisticalSummary(metrics.engine_growth),
      interface: this.statisticalEngine.generateStatisticalSummary(metrics.interface_growth),
      safemode: this.statisticalEngine.generateStatisticalSummary(metrics.safemode_growth)
    };
  }
  
  /**
   * 成長インサイトの生成
   * @param {Object} metrics - メトリクス
   * @param {Array} experiments - 実験リスト
   * @returns {Array} インサイト
   */
  generateGrowthInsights(metrics, experiments) {
    const insights = [];
    
    // 最も成長したOSの特定
    const avgGrowth = {
      engine: metrics.engine_growth.reduce((a, b) => a + b) / metrics.engine_growth.length,
      interface: metrics.interface_growth.reduce((a, b) => a + b) / metrics.interface_growth.length,
      safemode: metrics.safemode_growth.reduce((a, b) => a + b) / metrics.safemode_growth.length
    };
    
    const topGrowthOS = Object.keys(avgGrowth).reduce((a, b) => 
      avgGrowth[a] > avgGrowth[b] ? a : b
    );
    
    insights.push({
      type: 'growth_leader',
      message: `${this.getOSDisplayName(topGrowthOS)}が最も活発に成長しています`,
      bunenjinNote: 'この分人の成長を他の分人が支えているかもしれません'
    });
    
    return insights;
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
  window.ExperimentTracker = ExperimentTracker;
}

// Node.js環境での利用
if (typeof module !== "undefined" && module.exports) {
  module.exports = ExperimentTracker;
}