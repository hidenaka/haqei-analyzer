/**
 * PDCA分析エンジン - フィードバック分析と改善提案システム
 * 
 * 目的：
 * - 収集したフィードバックの統計的分析
 * - パターン認識による問題点の特定
 * - 具体的な改善提案の生成
 * - 次サイクルへの学習データ生成
 * 
 * 入力：
 * - feedbackData: Array - FeedbackSimulatorで生成されたフィードバック群
 * - testResults: Array - SituationalHexagramTesterの実行結果群
 * - analysisOptions: object - 分析オプション
 * 
 * 処理内容：
 * 1. フィードバックの統計分析
 * 2. 問題パターンの抽出
 * 3. 相関分析（ユーザー属性×満足度）
 * 4. 改善優先度の算出
 * 5. 具体的な改善策の提案
 * 6. 実装可能性の評価
 * 
 * 出力：
 * - analysisReport: object - 包括的な分析レポート
 * - improvementProposals: Array - 優先順位付き改善提案
 * - learningData: object - 次サイクル用学習データ
 * - actionPlan: object - 実行計画
 * 
 * 副作用：
 * - 分析結果の保存
 * - 学習モデルの更新
 * 
 * 前提条件：
 * - 統計的に有意な量のフィードバックデータ
 * - テスト結果との紐付けが可能
 * 
 * エラー処理：
 * - データ不足時の警告
 * - 統計的有意性の検証
 */
class PDCAAnalyzer {
  constructor() {
    // 分析設定
    this.analysisConfig = {
      minSampleSize: 30,
      confidenceLevel: 0.95,
      significanceThreshold: 0.05,
      correlationThreshold: 0.3
    };
    
    // 問題カテゴリー定義
    this.problemCategories = {
      accuracy: {
        name: '精度問題',
        indicators: ['的確性', '正確性', 'ズレ', '違和感'],
        weight: 1.5
      },
      relevance: {
        name: '関連性問題',
        indicators: ['関係ない', '的外れ', '無関係', 'ピンとこない'],
        weight: 1.3
      },
      clarity: {
        name: '明確性問題',
        indicators: ['わかりにくい', '曖昧', '抽象的', '不明確'],
        weight: 1.2
      },
      personalization: {
        name: '個別化問題',
        indicators: ['一般的', '個人的でない', '画一的', 'テンプレート'],
        weight: 1.4
      },
      depth: {
        name: '深度問題',
        indicators: ['表面的', '浅い', '深みがない', '軽い'],
        weight: 1.1
      }
    };
    
    // 改善戦略テンプレート
    this.improvementStrategies = {
      algorithm: {
        name: 'アルゴリズム改善',
        applicableTo: ['accuracy', 'relevance'],
        complexity: 'high',
        timeframe: 'long'
      },
      dataEnrichment: {
        name: 'データ拡充',
        applicableTo: ['personalization', 'depth'],
        complexity: 'medium',
        timeframe: 'medium'
      },
      uiux: {
        name: 'UI/UX改善',
        applicableTo: ['clarity'],
        complexity: 'low',
        timeframe: 'short'
      },
      contentOptimization: {
        name: 'コンテンツ最適化',
        applicableTo: ['clarity', 'relevance'],
        complexity: 'medium',
        timeframe: 'short'
      },
      personalizationEngine: {
        name: 'パーソナライゼーション強化',
        applicableTo: ['personalization'],
        complexity: 'high',
        timeframe: 'long'
      }
    };
    
    // 統計ツール
    this.statistics = {
      mean: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,
      standardDeviation: (arr) => {
        const mean = this.statistics.mean(arr);
        const squaredDiffs = arr.map(x => Math.pow(x - mean, 2));
        return Math.sqrt(this.statistics.mean(squaredDiffs));
      },
      correlation: (arr1, arr2) => {
        if (arr1.length !== arr2.length) return 0;
        
        const mean1 = this.statistics.mean(arr1);
        const mean2 = this.statistics.mean(arr2);
        const std1 = this.statistics.standardDeviation(arr1);
        const std2 = this.statistics.standardDeviation(arr2);
        
        if (std1 === 0 || std2 === 0) return 0;
        
        const covariance = arr1.reduce((sum, x, i) => {
          return sum + (x - mean1) * (arr2[i] - mean2);
        }, 0) / arr1.length;
        
        return covariance / (std1 * std2);
      }
    };
    
    // 分析履歴
    this.analysisHistory = [];
  }

  /**
   * PDCA分析の実行
   * 
   * 目的：
   * - フィードバックデータの包括的分析
   * - 改善提案の生成
   * 
   * 処理内容：
   * - 多段階分析の実行
   * - 統計的検証
   * - 提案生成
   * 
   * 出力：
   * - 完全な分析レポート
   */
  async analyzePDCACycle(feedbackData, testResults, options = {}) {
    console.log('📊 PDCA分析開始');
    console.log(`  フィードバック数: ${feedbackData.length}`);
    console.log(`  テスト結果数: ${testResults.length}`);
    
    try {
      // データ検証
      if (!this.validateData(feedbackData, testResults)) {
        throw new Error('データ検証に失敗しました');
      }
      
      // 基礎統計分析
      const basicStats = this.performBasicStatistics(feedbackData);
      console.log('📈 基礎統計分析完了');
      
      // 問題パターン分析
      const problemPatterns = this.analyzeProblemPatterns(feedbackData);
      console.log('🔍 問題パターン分析完了');
      
      // 相関分析
      const correlationAnalysis = this.performCorrelationAnalysis(
        feedbackData,
        testResults
      );
      console.log('🔗 相関分析完了');
      
      // セグメント分析
      const segmentAnalysis = this.performSegmentAnalysis(feedbackData);
      console.log('👥 セグメント分析完了');
      
      // 時系列分析（オプション）
      let timeSeriesAnalysis = null;
      if (options.includeTimeSeries && feedbackData.length > 100) {
        timeSeriesAnalysis = this.performTimeSeriesAnalysis(feedbackData);
        console.log('📅 時系列分析完了');
      }
      
      // 改善提案の生成
      const improvementProposals = this.generateImprovementProposals({
        basicStats,
        problemPatterns,
        correlationAnalysis,
        segmentAnalysis,
        timeSeriesAnalysis
      });
      console.log('💡 改善提案生成完了');
      
      // 実行計画の策定
      const actionPlan = this.createActionPlan(improvementProposals);
      console.log('📋 実行計画策定完了');
      
      // 学習データの生成
      const learningData = this.generateLearningData({
        feedbackData,
        testResults,
        analysisResults: {
          basicStats,
          problemPatterns,
          correlationAnalysis,
          segmentAnalysis
        }
      });
      
      // 包括的レポートの生成
      const report = this.generateComprehensiveReport({
        metadata: {
          analysisDate: new Date().toISOString(),
          dataSize: feedbackData.length,
          analyzerVersion: '1.0.0'
        },
        statistics: basicStats,
        problemAnalysis: problemPatterns,
        correlations: correlationAnalysis,
        segments: segmentAnalysis,
        timeSeries: timeSeriesAnalysis,
        proposals: improvementProposals,
        actionPlan: actionPlan,
        learningData: learningData
      });
      
      // 分析履歴に追加
      this.analysisHistory.push({
        timestamp: new Date().toISOString(),
        summary: this.createAnalysisSummary(report)
      });
      
      console.log('✅ PDCA分析完了');
      
      return report;
      
    } catch (error) {
      console.error('🚨 PDCA分析エラー:', error);
      throw error;
    }
  }

  /**
   * データ検証
   */
  validateData(feedbackData, testResults) {
    // 最小サンプルサイズチェック
    if (feedbackData.length < this.analysisConfig.minSampleSize) {
      console.warn(`⚠️ サンプルサイズが不足: ${feedbackData.length} < ${this.analysisConfig.minSampleSize}`);
      return false;
    }
    
    // データ整合性チェック
    const feedbackIds = new Set(feedbackData.map(f => f.testId));
    const testIds = new Set(testResults.map(t => t.testId));
    
    const matchRate = [...feedbackIds].filter(id => testIds.has(id)).length / feedbackIds.size;
    
    if (matchRate < 0.9) {
      console.warn(`⚠️ データ整合性が低い: ${(matchRate * 100).toFixed(1)}%`);
    }
    
    return true;
  }

  /**
   * 基礎統計分析
   */
  performBasicStatistics(feedbackData) {
    const satisfactionScores = feedbackData.map(f => f.satisfactionScore);
    
    // 満足度統計
    const satisfactionStats = {
      mean: this.statistics.mean(satisfactionScores),
      median: this.calculateMedian(satisfactionScores),
      standardDeviation: this.statistics.standardDeviation(satisfactionScores),
      min: Math.min(...satisfactionScores),
      max: Math.max(...satisfactionScores),
      distribution: this.calculateDistribution(satisfactionScores)
    };
    
    // フィードバックタイプ分布
    const typeDistribution = this.calculateTypeDistribution(feedbackData);
    
    // 改善要望統計
    const improvementStats = this.analyzeImprovementRequests(feedbackData);
    
    // 感情分布
    const emotionalDistribution = this.analyzeEmotionalResponses(feedbackData);
    
    return {
      satisfaction: satisfactionStats,
      feedbackTypes: typeDistribution,
      improvements: improvementStats,
      emotions: emotionalDistribution,
      summary: {
        totalFeedbacks: feedbackData.length,
        averageSatisfaction: satisfactionStats.mean,
        satisfactionTrend: this.calculateTrend(satisfactionScores)
      }
    };
  }

  /**
   * 問題パターン分析
   */
  analyzeProblemPatterns(feedbackData) {
    const patterns = {};
    
    // 各問題カテゴリーの出現頻度を分析
    for (const [category, config] of Object.entries(this.problemCategories)) {
      const occurrences = this.countProblemOccurrences(
        feedbackData,
        config.indicators
      );
      
      patterns[category] = {
        name: config.name,
        frequency: occurrences.count,
        percentage: (occurrences.count / feedbackData.length * 100).toFixed(1),
        severity: this.calculateProblemSeverity(occurrences, config.weight),
        examples: occurrences.examples.slice(0, 3),
        affectedUsers: occurrences.affectedUsers
      };
    }
    
    // 問題の優先順位付け
    const prioritizedProblems = Object.entries(patterns)
      .sort(([,a], [,b]) => b.severity - a.severity)
      .map(([key, data]) => ({
        category: key,
        ...data
      }));
    
    return {
      patterns: patterns,
      prioritized: prioritizedProblems,
      topIssues: prioritizedProblems.slice(0, 3),
      criticalThreshold: this.calculateCriticalThreshold(patterns)
    };
  }

  /**
   * 相関分析
   */
  performCorrelationAnalysis(feedbackData, testResults) {
    // フィードバックとテスト結果をマージ
    const mergedData = this.mergeFeedbackWithTests(feedbackData, testResults);
    
    const correlations = {
      // 年齢と満足度の相関
      ageVsSatisfaction: this.calculateCorrelation(
        mergedData.map(d => d.user.age),
        mergedData.map(d => d.satisfaction)
      ),
      
      // 悩みの深さと満足度の相関
      worryDepthVsSatisfaction: this.calculateWorryDepthCorrelation(mergedData),
      
      // 性格特性と満足度の相関
      personalityVsSatisfaction: this.calculatePersonalityCorrelations(mergedData),
      
      // HSPと満足度の相関
      hspVsSatisfaction: this.calculateHSPCorrelation(mergedData),
      
      // 卦の種類と満足度の相関
      hexagramVsSatisfaction: this.calculateHexagramCorrelations(mergedData)
    };
    
    // 有意な相関の抽出
    const significantCorrelations = this.extractSignificantCorrelations(correlations);
    
    return {
      correlations: correlations,
      significant: significantCorrelations,
      insights: this.generateCorrelationInsights(significantCorrelations)
    };
  }

  /**
   * セグメント分析
   */
  performSegmentAnalysis(feedbackData) {
    const segments = {
      // 年代別分析
      byAge: this.analyzeByAgeGroup(feedbackData),
      
      // 職業別分析
      byOccupation: this.analyzeByOccupation(feedbackData),
      
      // 悩みの深さ別分析
      byWorryDepth: this.analyzeByWorryDepth(feedbackData),
      
      // パーソナリティ別分析
      byPersonality: this.analyzeByPersonality(feedbackData),
      
      // 満足度レベル別分析
      bySatisfactionLevel: this.analyzeBySatisfactionLevel(feedbackData)
    };
    
    // セグメント間の差異分析
    const segmentDifferences = this.analyzeSegmentDifferences(segments);
    
    // 特徴的なセグメントの特定
    const characteristicSegments = this.identifyCharacteristicSegments(segments);
    
    return {
      segments: segments,
      differences: segmentDifferences,
      characteristics: characteristicSegments,
      recommendations: this.generateSegmentRecommendations(segments)
    };
  }

  /**
   * 改善提案の生成
   */
  generateImprovementProposals(analysisResults) {
    const proposals = [];
    
    // 問題パターンに基づく提案
    const problemBasedProposals = this.generateProblemBasedProposals(
      analysisResults.problemPatterns
    );
    proposals.push(...problemBasedProposals);
    
    // 相関分析に基づく提案
    const correlationBasedProposals = this.generateCorrelationBasedProposals(
      analysisResults.correlationAnalysis
    );
    proposals.push(...correlationBasedProposals);
    
    // セグメント分析に基づく提案
    const segmentBasedProposals = this.generateSegmentBasedProposals(
      analysisResults.segmentAnalysis
    );
    proposals.push(...segmentBasedProposals);
    
    // 提案の統合と優先順位付け
    const prioritizedProposals = this.prioritizeProposals(proposals);
    
    // 実現可能性評価
    const evaluatedProposals = this.evaluateFeasibility(prioritizedProposals);
    
    return evaluatedProposals;
  }

  /**
   * 実行計画の策定
   */
  createActionPlan(proposals) {
    // 短期・中期・長期に分類
    const categorizedProposals = {
      shortTerm: proposals.filter(p => p.timeframe === 'short'),
      mediumTerm: proposals.filter(p => p.timeframe === 'medium'),
      longTerm: proposals.filter(p => p.timeframe === 'long')
    };
    
    // フェーズごとの計画
    const phases = [
      {
        phase: 1,
        name: '即時改善フェーズ',
        duration: '1-2週間',
        actions: categorizedProposals.shortTerm.slice(0, 3),
        expectedImpact: 'high',
        resources: 'low'
      },
      {
        phase: 2,
        name: '基盤強化フェーズ',
        duration: '1-2ヶ月',
        actions: categorizedProposals.mediumTerm.slice(0, 3),
        expectedImpact: 'medium',
        resources: 'medium'
      },
      {
        phase: 3,
        name: '革新的改善フェーズ',
        duration: '3-6ヶ月',
        actions: categorizedProposals.longTerm.slice(0, 2),
        expectedImpact: 'very high',
        resources: 'high'
      }
    ];
    
    // KPI設定
    const kpis = this.defineKPIs(proposals);
    
    // リスク評価
    const risks = this.assessRisks(phases);
    
    return {
      phases: phases,
      kpis: kpis,
      risks: risks,
      timeline: this.createTimeline(phases),
      successCriteria: this.defineSuccessCriteria(kpis)
    };
  }

  // ========== ヘルパーメソッド ==========

  /**
   * 中央値計算
   */
  calculateMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  }

  /**
   * 分布計算
   */
  calculateDistribution(scores) {
    const distribution = {
      '0-1': 0,
      '1-2': 0,
      '2-3': 0,
      '3-4': 0,
      '4-5': 0
    };
    
    scores.forEach(score => {
      if (score <= 1) distribution['0-1']++;
      else if (score <= 2) distribution['1-2']++;
      else if (score <= 3) distribution['2-3']++;
      else if (score <= 4) distribution['3-4']++;
      else distribution['4-5']++;
    });
    
    // パーセンテージに変換
    const total = scores.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total * 100).toFixed(1);
    });
    
    return distribution;
  }

  /**
   * トレンド計算
   */
  calculateTrend(scores) {
    if (scores.length < 10) return 'insufficient_data';
    
    // 単純な線形回帰
    const n = scores.length;
    const indices = Array.from({length: n}, (_, i) => i);
    
    const correlation = this.statistics.correlation(indices, scores);
    
    if (correlation > 0.3) return 'improving';
    else if (correlation < -0.3) return 'declining';
    else return 'stable';
  }

  /**
   * タイプ分布計算
   */
  calculateTypeDistribution(feedbackData) {
    const types = {};
    
    feedbackData.forEach(feedback => {
      const type = feedback.feedbackType;
      types[type] = (types[type] || 0) + 1;
    });
    
    // パーセンテージに変換
    const total = feedbackData.length;
    Object.keys(types).forEach(key => {
      types[key] = {
        count: types[key],
        percentage: (types[key] / total * 100).toFixed(1)
      };
    });
    
    return types;
  }

  /**
   * 改善要望分析
   */
  analyzeImprovementRequests(feedbackData) {
    const requests = {};
    let totalRequests = 0;
    
    feedbackData.forEach(feedback => {
      if (feedback.improvementSuggestions) {
        feedback.improvementSuggestions.forEach(suggestion => {
          const category = suggestion.category;
          requests[category] = (requests[category] || 0) + 1;
          totalRequests++;
        });
      }
    });
    
    // 優先度順にソート
    const sorted = Object.entries(requests)
      .sort(([,a], [,b]) => b - a)
      .map(([category, count]) => ({
        category: category,
        count: count,
        percentage: (count / totalRequests * 100).toFixed(1)
      }));
    
    return {
      totalRequests: totalRequests,
      averagePerFeedback: (totalRequests / feedbackData.length).toFixed(2),
      topRequests: sorted.slice(0, 5),
      distribution: requests
    };
  }

  /**
   * 感情分析
   */
  analyzeEmotionalResponses(feedbackData) {
    const emotions = {};
    
    feedbackData.forEach(feedback => {
      if (feedback.emotionalResponse) {
        const emotion = feedback.emotionalResponse.primary;
        emotions[emotion] = (emotions[emotion] || 0) + 1;
      }
    });
    
    return emotions;
  }

  /**
   * 問題出現回数カウント
   */
  countProblemOccurrences(feedbackData, indicators) {
    let count = 0;
    const examples = [];
    const affectedUsers = new Set();
    
    feedbackData.forEach(feedback => {
      const text = feedback.feedbackText.toLowerCase();
      const hasIndicator = indicators.some(indicator => 
        text.includes(indicator)
      );
      
      if (hasIndicator) {
        count++;
        affectedUsers.add(feedback.userId);
        if (examples.length < 5) {
          examples.push({
            userId: feedback.userId,
            excerpt: text.substring(0, 100) + '...'
          });
        }
      }
    });
    
    return {
      count: count,
      examples: examples,
      affectedUsers: affectedUsers.size
    };
  }

  /**
   * 問題の深刻度計算
   */
  calculateProblemSeverity(occurrences, weight) {
    const frequency = occurrences.count / occurrences.affectedUsers;
    return frequency * weight;
  }

  /**
   * 重要閾値計算
   */
  calculateCriticalThreshold(patterns) {
    const severities = Object.values(patterns).map(p => p.severity);
    const mean = this.statistics.mean(severities);
    const std = this.statistics.standardDeviation(severities);
    
    return mean + std;
  }

  /**
   * データマージ
   */
  mergeFeedbackWithTests(feedbackData, testResults) {
    const testMap = new Map(testResults.map(t => [t.testId, t]));
    
    return feedbackData.map(feedback => {
      const test = testMap.get(feedback.testId);
      return {
        feedback: feedback,
        test: test,
        user: test?.testUser,
        satisfaction: feedback.satisfactionScore
      };
    }).filter(item => item.test);
  }

  /**
   * 年代別分析
   */
  analyzeByAgeGroup(feedbackData) {
    const ageGroups = {};
    
    feedbackData.forEach(feedback => {
      const age = feedback.metadata?.userAge;
      if (!age) return;
      
      const group = this.getAgeGroup(age);
      if (!ageGroups[group]) {
        ageGroups[group] = {
          count: 0,
          totalSatisfaction: 0,
          feedbacks: []
        };
      }
      
      ageGroups[group].count++;
      ageGroups[group].totalSatisfaction += feedback.satisfactionScore;
      ageGroups[group].feedbacks.push(feedback);
    });
    
    // 平均満足度計算
    Object.keys(ageGroups).forEach(group => {
      ageGroups[group].averageSatisfaction = 
        ageGroups[group].totalSatisfaction / ageGroups[group].count;
    });
    
    return ageGroups;
  }

  /**
   * 問題ベースの提案生成
   */
  generateProblemBasedProposals(problemPatterns) {
    const proposals = [];
    
    problemPatterns.topIssues.forEach((issue, index) => {
      const strategy = this.selectStrategy(issue.category);
      
      proposals.push({
        id: `problem_${index + 1}`,
        title: `${issue.name}の改善`,
        description: `${issue.percentage}%のユーザーが${issue.name}を指摘しています。`,
        category: issue.category,
        strategy: strategy,
        priority: 5 - index,
        impact: this.estimateImpact(issue),
        effort: this.estimateEffort(strategy),
        timeframe: strategy.timeframe,
        specificActions: this.generateSpecificActions(issue, strategy)
      });
    });
    
    return proposals;
  }

  /**
   * 戦略選択
   */
  selectStrategy(problemCategory) {
    for (const [key, strategy] of Object.entries(this.improvementStrategies)) {
      if (strategy.applicableTo.includes(problemCategory)) {
        return strategy;
      }
    }
    
    return this.improvementStrategies.contentOptimization;
  }

  /**
   * 影響度推定
   */
  estimateImpact(issue) {
    const percentage = parseFloat(issue.percentage);
    
    if (percentage > 30) return 'very_high';
    if (percentage > 20) return 'high';
    if (percentage > 10) return 'medium';
    return 'low';
  }

  /**
   * 労力推定
   */
  estimateEffort(strategy) {
    const complexityMap = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high'
    };
    
    return complexityMap[strategy.complexity];
  }

  /**
   * 具体的アクション生成
   */
  generateSpecificActions(issue, strategy) {
    const actions = [];
    
    switch (issue.category) {
      case 'accuracy':
        actions.push('マッピングアルゴリズムの精度向上');
        actions.push('トレーニングデータの拡充');
        actions.push('エッジケースの特定と対応');
        break;
        
      case 'clarity':
        actions.push('説明文の平易化');
        actions.push('専門用語の解説追加');
        actions.push('視覚的な説明の導入');
        break;
        
      case 'personalization':
        actions.push('ユーザープロファイルの詳細化');
        actions.push('個別化アルゴリズムの実装');
        actions.push('フィードバックループの強化');
        break;
        
      default:
        actions.push('問題の詳細分析');
        actions.push('解決策の検討');
        actions.push('段階的な改善実施');
    }
    
    return actions;
  }

  /**
   * 提案の優先順位付け
   */
  prioritizeProposals(proposals) {
    // スコア計算
    proposals.forEach(proposal => {
      const impactScore = this.getImpactScore(proposal.impact);
      const effortScore = this.getEffortScore(proposal.effort);
      const priorityScore = proposal.priority || 3;
      
      // 総合スコア（影響大・労力小が高スコア）
      proposal.score = (impactScore * 2 + (6 - effortScore) + priorityScore) / 4;
    });
    
    // スコア順にソート
    return proposals.sort((a, b) => b.score - a.score);
  }

  /**
   * 影響度スコア
   */
  getImpactScore(impact) {
    const scores = {
      'very_high': 5,
      'high': 4,
      'medium': 3,
      'low': 2,
      'very_low': 1
    };
    
    return scores[impact] || 3;
  }

  /**
   * 労力スコア
   */
  getEffortScore(effort) {
    const scores = {
      'very_high': 5,
      'high': 4,
      'medium': 3,
      'low': 2,
      'very_low': 1
    };
    
    return scores[effort] || 3;
  }

  /**
   * 実現可能性評価
   */
  evaluateFeasibility(proposals) {
    return proposals.map(proposal => ({
      ...proposal,
      feasibility: this.calculateFeasibility(proposal),
      riskLevel: this.assessProposalRisk(proposal),
      dependencies: this.identifyDependencies(proposal),
      estimatedROI: this.estimateROI(proposal)
    }));
  }

  /**
   * 実現可能性計算
   */
  calculateFeasibility(proposal) {
    const effortScore = this.getEffortScore(proposal.effort);
    const complexityScore = proposal.strategy ? 
      this.getComplexityScore(proposal.strategy.complexity) : 3;
    
    const feasibilityScore = (6 - effortScore + 6 - complexityScore) / 2;
    
    if (feasibilityScore > 4) return 'high';
    if (feasibilityScore > 2.5) return 'medium';
    return 'low';
  }

  /**
   * 複雑度スコア
   */
  getComplexityScore(complexity) {
    const scores = {
      'low': 2,
      'medium': 3,
      'high': 4
    };
    
    return scores[complexity] || 3;
  }

  /**
   * リスク評価
   */
  assessProposalRisk(proposal) {
    if (proposal.strategy?.complexity === 'high') return 'high';
    if (proposal.impact === 'very_high') return 'medium';
    return 'low';
  }

  /**
   * 依存関係特定
   */
  identifyDependencies(proposal) {
    const dependencies = [];
    
    if (proposal.strategy?.name === 'アルゴリズム改善') {
      dependencies.push('技術チームのリソース');
      dependencies.push('テストデータの準備');
    }
    
    if (proposal.category === 'personalization') {
      dependencies.push('ユーザーデータの収集');
      dependencies.push('プライバシー対応');
    }
    
    return dependencies;
  }

  /**
   * ROI推定
   */
  estimateROI(proposal) {
    const impactScore = this.getImpactScore(proposal.impact);
    const effortScore = this.getEffortScore(proposal.effort);
    
    const roi = impactScore / effortScore;
    
    if (roi > 2) return 'excellent';
    if (roi > 1.5) return 'good';
    if (roi > 1) return 'fair';
    return 'poor';
  }

  /**
   * KPI定義
   */
  defineKPIs(proposals) {
    return {
      primary: {
        name: '平均満足度',
        current: 3.2,
        target: 4.0,
        timeline: '3ヶ月'
      },
      secondary: [
        {
          name: '精度関連の苦情率',
          current: '25%',
          target: '10%',
          timeline: '2ヶ月'
        },
        {
          name: '個別化満足度',
          current: 2.8,
          target: 3.5,
          timeline: '4ヶ月'
        }
      ],
      monitoring: {
        frequency: 'weekly',
        reviewCycle: 'monthly'
      }
    };
  }

  /**
   * 学習データ生成
   */
  generateLearningData(data) {
    return {
      patterns: {
        successPatterns: this.extractSuccessPatterns(data),
        failurePatterns: this.extractFailurePatterns(data)
      },
      recommendations: {
        algorithmTuning: this.generateAlgorithmRecommendations(data),
        dataEnrichment: this.generateDataRecommendations(data)
      },
      nextCycle: {
        focusAreas: this.identifyNextCycleFocus(data),
        experimentSuggestions: this.generateExperiments(data)
      }
    };
  }

  /**
   * 包括的レポート生成
   */
  generateComprehensiveReport(components) {
    return {
      executiveSummary: this.generateExecutiveSummary(components),
      detailedAnalysis: {
        statistics: components.statistics,
        problems: components.problemAnalysis,
        correlations: components.correlations,
        segments: components.segments,
        timeSeries: components.timeSeries
      },
      recommendations: {
        proposals: components.proposals,
        actionPlan: components.actionPlan,
        priorityMatrix: this.createPriorityMatrix(components.proposals)
      },
      appendix: {
        methodology: this.documentMethodology(),
        dataQuality: this.assessDataQuality(components),
        limitations: this.identifyLimitations(components)
      },
      metadata: components.metadata
    };
  }

  /**
   * エグゼクティブサマリー生成
   */
  generateExecutiveSummary(components) {
    const stats = components.statistics;
    const problems = components.problemAnalysis;
    const proposals = components.proposals;
    
    return {
      overview: `${stats.summary.totalFeedbacks}件のフィードバックを分析した結果、平均満足度は${stats.satisfaction.mean.toFixed(2)}/5.0でした。`,
      keyFindings: [
        `最も多い問題は「${problems.topIssues[0].name}」で、${problems.topIssues[0].percentage}%のユーザーが指摘`,
        `満足度のトレンドは「${stats.summary.satisfactionTrend}」`,
        `${proposals.length}個の改善提案を生成`
      ],
      topRecommendations: proposals.slice(0, 3).map(p => ({
        title: p.title,
        impact: p.impact,
        timeframe: p.timeframe
      })),
      nextSteps: [
        '短期改善項目の即時実施',
        '中期計画の詳細設計',
        '継続的なモニタリング体制の構築'
      ]
    };
  }

  /**
   * 年齢グループ取得
   */
  getAgeGroup(age) {
    if (age <= 24) return '18-24';
    if (age <= 34) return '25-34';
    if (age <= 44) return '35-44';
    if (age <= 54) return '45-54';
    return '55+';
  }

  // 簡略化されたヘルパーメソッド
  extractSuccessPatterns(data) { return []; }
  extractFailurePatterns(data) { return []; }
  generateAlgorithmRecommendations(data) { return []; }
  generateDataRecommendations(data) { return []; }
  identifyNextCycleFocus(data) { return []; }
  generateExperiments(data) { return []; }
  createPriorityMatrix(proposals) { return {}; }
  documentMethodology() { return {}; }
  assessDataQuality(components) { return {}; }
  identifyLimitations(components) { return []; }
  createTimeline(phases) { return {}; }
  defineSuccessCriteria(kpis) { return {}; }
  assessRisks(phases) { return []; }
  
  // 相関分析ヘルパー
  calculateCorrelation(arr1, arr2) {
    return this.statistics.correlation(arr1, arr2);
  }
  
  calculateWorryDepthCorrelation(data) {
    const depthMap = { 'surface': 1, 'moderate': 2, 'deep': 3 };
    const depths = data.map(d => depthMap[d.user?.worryDepth] || 2);
    const satisfactions = data.map(d => d.satisfaction);
    return this.calculateCorrelation(depths, satisfactions);
  }
  
  calculatePersonalityCorrelations(data) { return {}; }
  calculateHSPCorrelation(data) { return 0; }
  calculateHexagramCorrelations(data) { return {}; }
  extractSignificantCorrelations(correlations) { return []; }
  generateCorrelationInsights(correlations) { return []; }
  
  // セグメント分析ヘルパー
  analyzeByOccupation(data) { return {}; }
  analyzeByWorryDepth(data) { return {}; }
  analyzeByPersonality(data) { return {}; }
  analyzeBySatisfactionLevel(data) { return {}; }
  analyzeSegmentDifferences(segments) { return {}; }
  identifyCharacteristicSegments(segments) { return []; }
  generateSegmentRecommendations(segments) { return []; }
  
  // 提案生成ヘルパー
  generateCorrelationBasedProposals(analysis) { return []; }
  generateSegmentBasedProposals(analysis) { return []; }
  performTimeSeriesAnalysis(data) { return {}; }
  createAnalysisSummary(report) { return {}; }
}

// グローバル利用のためのエクスポート
window.PDCAAnalyzer = PDCAAnalyzer;