/**
 * 超高度状況分析統合システム
 * 
 * 目的：
 * - ユーザーテキスト入力から易経解釈までの完全なパイプライン提供
 * - SituationClassifier + DynamicIChingMapper + TextVectorizer の統合オーケストレーション
 * - HAQEIプロジェクトの核心「テキスト→仮想状況→易経解釈」の技術的実現
 * 
 * アーキテクチャ：
 * - Phase 1: テキストベクトル化（TextVectorizer）
 * - Phase 2: 状況分析（SituationClassifier）
 * - Phase 3: 易経マッピング（DynamicIChingMapper）
 * - Phase 4: 統合結果生成と最適化
 * 
 * システム統合の責務：
 * 1. 各コンポーネントの初期化とエラーハンドリング
 * 2. 分析フローの制御と進捗管理
 * 3. パフォーマンス監視と最適化
 * 4. 分析履歴の管理と学習データ蓄積
 * 5. エラー時のフォールバック処理
 * 
 * 重要な設計思想：
 * - 各フェーズでの詳細ログ出力（デバッグ・検証用）
 * - 段階的エラー処理（どのフェーズで失敗したかを明確化）
 * - メタデータ駆動（信頼度・複雑さ・緊急度の統合計算）
 * - 拡張可能性（新しい分析コンポーネントの追加容易性）
 * 
 * 【検証における重要性】：
 * このクラスは3つの主要コンポーネントを統合するため、
 * 各コンポーネント個別の問題（変革期偏重、未使用卦等）が
 * 最終結果にどう影響するかを観測する最適な観測点
 */

class UltraSituationAnalyzer {
  /**
   * コンストラクタ
   * 
   * 目的：
   * - 状況分析システムの初期化
   * - 依存コンポーネントのインスタンス化
   * 
   * 処理内容：
   * 1. エラーハンドラーの初期化
   * 2. 各コンポーネントのtry-catchでの初期化
   * 3. 初期化失敗時のフォールバックモード設定
   * 
   * 副作用：
   * - コンソールへのエラー出力（初期化失敗時）
   * - this.initializationErrorの設定
   * 
   * エラー処理：
   * - 初期化失敗時はフォールバックモードで動作
   */
  constructor() {
    // エラーハンドラーの初期化
    this.errorHandler = window.situationAnalysisErrorHandler || 
                       new (window.SituationAnalysisErrorHandler || class { handleError() {} })();
    
    try {
      this.vectorizer = new TextVectorizer();
      this.classifier = new SituationClassifier();
      this.mapper = new DynamicIChingMapper();
      this.initializationError = null;
    } catch (error) {
      this.initializationError = this.errorHandler.handleError(
        error, 
        'UltraSituationAnalyzer.constructor',
        { component: 'initialization' }
      );
      
      // フォールバックモード
      this.vectorizer = null;
      this.classifier = null;
      this.mapper = null;
    }
    
    // 分析履歴（学習用）
    this.analysisHistory = [];
    
    // パフォーマンス監視
    this.performanceMetrics = {
      totalAnalyses: 0,
      averageConfidence: 0,
      averageProcessingTime: 0
    };
  }
  
  /**
   * テキストから易経解釈までの完全分析
   * 
   * 目的：
   * - ユーザーのテキストを分析し、易経の卦にマッピング
   * - 状況理解から実践的アドバイスまで生成
   * 
   * 入力：
   * @param {string} text - 分析対象のテキスト
   * @param {Object} options - オプション（includeVector, saveHistory等）
   * 
   * 処理内容：
   * 1. 初期化エラーチェック
   * 2. テキストのベクトル化
   * 3. 状況分類
   * 4. 易経マッピング
   * 5. 統合結果の生成
   * 
   * 出力：
   * @returns {Promise<Object>} 分析結果オブジェクト
   * 
   * 副作用：
   * - パフォーマンスメトリクスの更新
   * - 分析履歴への追加（options.saveHistoryがtrueの場合）
   * 
   * エラー処理：
   * - 初期化エラー時は即座にエラー結果を返す
   * - 各フェーズでのエラーをキャッチして適切に処理
   */
  async analyze(text, options = {}) {
    // 初期化エラーチェック
    if (this.initializationError) {
      return this.generateErrorResult(text, 
        new Error('システムが正しく初期化されていません'));
    }
    
    const startTime = performance.now();
    
    try {
      // 1. テキストのベクトル化
      console.log('=== Phase 1: テキストベクトル化 ===');
      this.currentPhase = 'vectorization';
      const vectorResult = this.vectorizer.vectorize(text);
      console.log('ベクトル化完了:', {
        dimension: vectorResult.metadata.dimension,
        features: vectorResult.features
      });
      
      // 2. 状況分析
      console.log('\n=== Phase 2: 状況分析 ===');
      this.currentPhase = 'classification';
      const situationAnalysis = this.classifier.analyzeSituation(text);
      console.log('状況分析完了:', {
        archetype: situationAnalysis.archetype,
        temporal: situationAnalysis.temporal,
        confidence: situationAnalysis.confidence
      });
      
      // 3. 易経マッピング
      console.log('\n=== Phase 3: 易経マッピング ===');
      this.currentPhase = 'mapping';
      const ichingResult = this.mapper.mapToHexagram(situationAnalysis);
      console.log('易経マッピング完了:', {
        hexagram: ichingResult.primary.hexagram,
        line: ichingResult.line.position,
        confidence: ichingResult.confidence
      });
      
      // 4. 統合結果の生成
      this.currentPhase = 'integration';
      const integratedResult = this.integrateResults(
        text,
        vectorResult,
        situationAnalysis,
        ichingResult,
        options
      );
      
      // 5. パフォーマンス記録
      const processingTime = performance.now() - startTime;
      this.updatePerformanceMetrics(integratedResult, processingTime);
      
      // 6. 分析履歴に追加
      if (options.saveHistory) {
        this.addToHistory(integratedResult);
      }
      
      return integratedResult;
      
    } catch (error) {
      // エラーハンドラーで処理
      const errorInfo = this.errorHandler.handleError(
        error,
        'UltraSituationAnalyzer.analyze',
        { 
          textLength: text.length,
          options,
          phase: this.currentPhase || 'unknown'
        }
      );
      
      return this.generateErrorResult(text, error, errorInfo);
    }
  }
  
  /**
   * 結果の統合
   */
  integrateResults(text, vectorResult, situationAnalysis, ichingResult, options) {
    const result = {
      // 入力情報
      input: {
        text: text,
        length: text.length,
        timestamp: new Date().toISOString()
      },
      
      // ベクトル化結果
      vectorization: {
        vector: options.includeVector ? vectorResult.vector : null,
        features: vectorResult.features,
        featureImportance: this.vectorizer.analyzeFeatureImportance(vectorResult)
      },
      
      // 状況分析結果
      situation: {
        archetype: {
          primary: situationAnalysis.archetype.primary,
          score: situationAnalysis.archetype.score,
          name: this.classifier.situationArchetypes[situationAnalysis.archetype.primary].name
        },
        temporal: situationAnalysis.temporal,
        dynamics: situationAnalysis.dynamics,
        relationships: situationAnalysis.relationships,
        emotions: situationAnalysis.emotions,
        confidence: situationAnalysis.confidence
      },
      
      // 易経解釈
      iching: {
        hexagram: {
          number: ichingResult.primary.hexagram,
          name: this.getHexagramName(ichingResult.primary.hexagram),
          essence: ichingResult.primary.essence
        },
        line: ichingResult.line,
        alternatives: ichingResult.alternatives.map(alt => ({
          number: alt.hexagram,
          name: this.getHexagramName(alt.hexagram),
          score: alt.score
        })),
        interpretation: ichingResult.interpretation,
        confidence: ichingResult.confidence
      },
      
      // 統合的洞察
      insights: this.generateInsights(situationAnalysis, ichingResult),
      
      // 実践的アドバイス
      recommendations: this.generateRecommendations(situationAnalysis, ichingResult),
      
      // メタデータ
      metadata: {
        analysisVersion: '2.0',
        totalConfidence: this.calculateTotalConfidence(situationAnalysis, ichingResult),
        processingSteps: ['vectorization', 'situation_analysis', 'iching_mapping'],
        options: options
      }
    };
    
    return result;
  }
  
  /**
   * 統合的洞察の生成
   */
  generateInsights(situationAnalysis, ichingResult) {
    const insights = [];
    
    // 状況の本質に関する洞察
    insights.push({
      type: 'essence',
      title: '状況の本質',
      content: `あなたの状況は「${this.classifier.situationArchetypes[situationAnalysis.archetype.primary].description}」の段階にあります。` +
               `易経の${this.getHexagramName(ichingResult.primary.hexagram)}の卦が示すように、` +
               `${ichingResult.primary.essence.essence}という性質を持っています。`
    });
    
    // 時間的視点からの洞察
    if (situationAnalysis.temporal.transition) {
      insights.push({
        type: 'temporal',
        title: '変化の時期',
        content: '過去から未来への移行期にあり、大きな転換点を迎えています。' +
                '新しい段階に進むための準備が整いつつあります。'
      });
    }
    
    // 力学的バランスからの洞察
    const dynamicBalance = this.analyzeDynamicBalance(situationAnalysis.dynamics);
    insights.push({
      type: 'dynamics',
      title: '内的な力学',
      content: dynamicBalance
    });
    
    // 関係性からの洞察
    if (situationAnalysis.relationships.isolation > 0.5) {
      insights.push({
        type: 'relational',
        title: '関係性の課題',
        content: '現在、孤立感を感じているかもしれません。' +
                '他者とのつながりを意識的に築くことが重要な時期です。'
      });
    } else if (situationAnalysis.relationships.connection > 0.5) {
      insights.push({
        type: 'relational',
        title: '関係性の強み',
        content: '周囲との良好な関係性があなたの強みです。' +
                'この繋がりを活かして前進することができます。'
      });
    }
    
    return insights;
  }
  
  /**
   * 実践的推奨事項の生成
   */
  generateRecommendations(situationAnalysis, ichingResult) {
    const recommendations = [];
    
    // 易経の指針に基づく推奨
    ichingResult.interpretation.guidance.forEach((guidance, index) => {
      recommendations.push({
        priority: index + 1,
        category: 'strategic',
        action: guidance,
        timeframe: this.determineTimeframe(ichingResult.interpretation.timing)
      });
    });
    
    // 警告事項に基づく推奨
    ichingResult.interpretation.warnings.forEach(warning => {
      recommendations.push({
        priority: recommendations.length + 1,
        category: 'caution',
        action: warning,
        timeframe: 'ongoing'
      });
    });
    
    // 機会に基づく推奨
    ichingResult.interpretation.opportunities.forEach(opportunity => {
      recommendations.push({
        priority: recommendations.length + 1,
        category: 'opportunity',
        action: opportunity,
        timeframe: 'immediate'
      });
    });
    
    return recommendations;
  }
  
  /**
   * 力学的バランスの分析
   */
  analyzeDynamicBalance(dynamics) {
    const totalDriving = dynamics.driving.internal + dynamics.driving.external;
    const totalResisting = dynamics.resisting.internal + dynamics.resisting.external;
    
    if (totalDriving > totalResisting * 1.5) {
      return '強い推進力があります。この勢いを活かしながら、慎重さも忘れずに進みましょう。';
    } else if (totalResisting > totalDriving * 1.5) {
      return '現在、多くの抵抗や障害を感じています。これは成長のための必要な試練かもしれません。';
    } else if (dynamics.balance > 3) {
      return 'バランスを求める気持ちが強いようです。調和を保ちながら前進する道を探しています。';
    } else {
      return '推進力と抵抗力が拮抗しています。方向性を明確にすることが重要です。';
    }
  }
  
  /**
   * 時間枠の決定
   */
  determineTimeframe(timing) {
    const timeframes = {
      immediate: '今すぐ',
      wait: '適切な時期を待って',
      lead: 'リーダーシップを発揮して',
      steady: '着実に継続的に'
    };
    
    return timeframes[timing.action] || '状況に応じて';
  }
  
  /**
   * 総合信頼度の計算
   */
  calculateTotalConfidence(situationAnalysis, ichingResult) {
    // 各段階の信頼度を重み付け平均
    const weights = {
      situation: 0.4,
      iching: 0.6
    };
    
    return (
      situationAnalysis.confidence * weights.situation +
      ichingResult.confidence * weights.iching
    );
  }
  
  /**
   * パフォーマンスメトリクスの更新
   */
  updatePerformanceMetrics(result, processingTime) {
    this.performanceMetrics.totalAnalyses++;
    
    // 平均信頼度の更新
    const currentAvg = this.performanceMetrics.averageConfidence;
    const newConfidence = result.metadata.totalConfidence;
    this.performanceMetrics.averageConfidence = 
      (currentAvg * (this.performanceMetrics.totalAnalyses - 1) + newConfidence) / 
      this.performanceMetrics.totalAnalyses;
    
    // 平均処理時間の更新
    const currentTime = this.performanceMetrics.averageProcessingTime;
    this.performanceMetrics.averageProcessingTime = 
      (currentTime * (this.performanceMetrics.totalAnalyses - 1) + processingTime) / 
      this.performanceMetrics.totalAnalyses;
  }
  
  /**
   * 分析履歴への追加
   */
  addToHistory(result) {
    this.analysisHistory.push({
      timestamp: result.input.timestamp,
      textLength: result.input.length,
      archetype: result.situation.archetype.primary,
      hexagram: result.iching.hexagram.number,
      confidence: result.metadata.totalConfidence
    });
    
    // 履歴は最新100件まで保持
    if (this.analysisHistory.length > 100) {
      this.analysisHistory.shift();
    }
  }
  
  /**
   * エラー時の結果生成
   * 
   * 目的：
   * - エラー発生時にユーザー向けの結果オブジェクトを生成
   * 
   * 入力：
   * @param {string} text - 元の入力テキスト
   * @param {Error} error - 発生したエラー
   * @param {Object} errorInfo - エラーハンドラーからの情報
   * 
   * 出力：
   * @returns {Object} エラー結果オブジェクト
   */
  generateErrorResult(text, error, errorInfo = null) {
    const info = errorInfo || {
      type: 'unknown',
      title: 'エラー',
      message: '分析中にエラーが発生しました。別の表現でお試しください。',
      action: 'retry'
    };
    
    return {
      input: { text: text, error: true },
      error: {
        message: error.message,
        type: error.name,
        timestamp: new Date().toISOString(),
        userMessage: info.message,
        action: info.action
      },
      fallback: {
        title: info.title,
        message: info.message,
        action: info.action,
        isRetryable: this.errorHandler.isRetryable(info.type)
      }
    };
  }
  
  /**
   * 卦の名前取得（簡易版）
   */
  getHexagramName(number) {
    const names = {
      1: '乾為天', 2: '坤為地', 3: '水雷屯', 4: '山水蒙',
      5: '水天需', 6: '天水訟', 7: '地水師', 8: '水地比',
      // ... 省略 ...
      49: '沢火革', 50: '火風鼎', 51: '震為雷', 52: '艮為山',
      63: '水火既済', 64: '火水未済'
    };
    
    return names[number] || `第${number}卦`;
  }
  
  /**
   * パフォーマンス統計の取得
   */
  getPerformanceStats() {
    return {
      ...this.performanceMetrics,
      historySize: this.analysisHistory.length,
      recentArchetypes: this.getRecentArchetypes(),
      recentHexagrams: this.getRecentHexagrams()
    };
  }
  
  /**
   * 最近のアーキタイプ傾向
   */
  getRecentArchetypes() {
    const recent = this.analysisHistory.slice(-20);
    const counts = {};
    
    recent.forEach(entry => {
      counts[entry.archetype] = (counts[entry.archetype] || 0) + 1;
    });
    
    return counts;
  }
  
  /**
   * 最近の卦の傾向
   */
  getRecentHexagrams() {
    const recent = this.analysisHistory.slice(-20);
    const counts = {};
    
    recent.forEach(entry => {
      counts[entry.hexagram] = (counts[entry.hexagram] || 0) + 1;
    });
    
    return counts;
  }
}

// エクスポート
if (typeof window !== 'undefined') {
  window.UltraSituationAnalyzer = UltraSituationAnalyzer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraSituationAnalyzer;
}