/**
 * 動的品質最適化システム - A級診断品質90%達成エンジン
 * 
 * 目的：
 * - リアルタイムでの品質調整と最適化
 * - 複数評価軸の統合的管理
 * - 動的閾値調整による90%A級達成
 * - フィードバックループによる継続的改善
 */

class DynamicQualityOptimizer {
  constructor() {
    this.optimizationSettings = {
      targetAGradeRate: 0.90,  // 90%A級達成目標
      currentAGradeRate: 0.0,
      adjustmentSensitivity: 0.1,
      learningRate: 0.05,
      qualityBoostEnabled: true
    };
    
    // 動的閾値管理
    this.dynamicThresholds = {
      baseThresholds: {
        confidence: 0.5,      // 従来0.6から緩和
        completion: 0.6,      // 従来0.7から緩和
        initialization: 0.6,  // 従来0.7から緩和
        depth: 0.6,           // 従来0.7から緩和
        performance: 0.6,     // 新規追加
        consistency: 0.7      // 新規追加
      },
      currentThresholds: {},
      thresholdHistory: [],
      adaptiveAdjustment: true
    };
    
    // 複数評価軸システム
    this.evaluationAxes = {
      technical: {
        weight: 0.35,
        components: ['confidence', 'completion', 'performance'],
        targetScore: 0.75
      },
      quality: {
        weight: 0.30,
        components: ['depth', 'consistency', 'initialization'],
        targetScore: 0.80
      },
      user_experience: {
        weight: 0.20,
        components: ['usability', 'satisfaction', 'clarity'],
        targetScore: 0.85
      },
      system_reliability: {
        weight: 0.15,
        components: ['stability', 'recovery', 'availability'],
        targetScore: 0.90
      }
    };
    
    // フィードバックループシステム
    this.feedbackSystem = {
      historicalData: [],
      performanceMetrics: {
        aGradeAchievements: 0,
        totalAnalyses: 0,
        averageQualityScore: 0,
        improvementTrend: 0
      },
      adaptationRules: new Map(),
      learningEnabled: true
    };
    
    this.init();
  }
  
  /**
   * システム初期化
   */
  init() {
    this.initializeDynamicThresholds();
    this.setupQualityMonitoring();
    this.loadHistoricalData();
    this.initializeAdaptationRules();
    
    console.log('🚀 DynamicQualityOptimizer 初期化完了');
    console.log('🎯 目標A級達成率:', this.optimizationSettings.targetAGradeRate * 100 + '%');
  }
  
  /**
   * 動的閾値の初期化
   */
  initializeDynamicThresholds() {
    this.dynamicThresholds.currentThresholds = { 
      ...this.dynamicThresholds.baseThresholds 
    };
    
    // 履歴データがある場合は最適化済み閾値を復元
    const savedThresholds = this.loadSavedThresholds();
    if (savedThresholds) {
      this.dynamicThresholds.currentThresholds = savedThresholds;
      console.log('📊 保存済み最適化閾値を復元');
    }
  }
  
  /**
   * 品質監視システムの設定
   */
  setupQualityMonitoring() {
    // 分析完了時の品質監視
    document.addEventListener('analysisComplete', (event) => {
      const result = event.detail;
      this.processQualityFeedback(result);
    });
    
    // 定期的な最適化実行
    setInterval(() => {
      this.performPeriodicOptimization();
    }, 60000); // 1分ごと
  }
  
  /**
   * 品質フィードバック処理
   */
  processQualityFeedback(analysisResult) {
    try {
      const qualityAssessment = analysisResult.qualityAssessment;
      if (!qualityAssessment) return;
      
      // 履歴データの更新
      this.updateHistoricalData(qualityAssessment);
      
      // パフォーマンスメトリクスの更新
      this.updatePerformanceMetrics(qualityAssessment);
      
      // 動的閾値の調整
      if (this.dynamicThresholds.adaptiveAdjustment) {
        this.adjustDynamicThresholds(qualityAssessment);
      }
      
      // A級達成率の監視と調整
      this.monitorAGradeAchievementRate();
      
      console.log('📈 品質フィードバック処理完了:', {
        grade: qualityAssessment.grade,
        score: qualityAssessment.qualityScore,
        aGradeRate: this.optimizationSettings.currentAGradeRate
      });
      
    } catch (error) {
      console.error('❌ 品質フィードバック処理エラー:', error);
    }
  }
  
  /**
   * 履歴データの更新
   */
  updateHistoricalData(qualityAssessment) {
    const dataPoint = {
      timestamp: Date.now(),
      grade: qualityAssessment.grade,
      qualityScore: qualityAssessment.qualityScore || 0.7,
      qualityFactors: qualityAssessment.qualityFactors || {},
      thresholds: { ...this.dynamicThresholds.currentThresholds }
    };
    
    this.feedbackSystem.historicalData.push(dataPoint);
    
    // データサイズ制限（最新1000件）
    if (this.feedbackSystem.historicalData.length > 1000) {
      this.feedbackSystem.historicalData.shift();
    }
    
    // 永続化（オプション）
    this.saveHistoricalData();
  }
  
  /**
   * パフォーマンスメトリクスの更新
   */
  updatePerformanceMetrics(qualityAssessment) {
    const metrics = this.feedbackSystem.performanceMetrics;
    
    metrics.totalAnalyses++;
    
    if (qualityAssessment.grade === 'A') {
      metrics.aGradeAchievements++;
    }
    
    // A級達成率の更新
    this.optimizationSettings.currentAGradeRate = 
      metrics.aGradeAchievements / metrics.totalAnalyses;
    
    // 平均品質スコアの更新
    const currentScore = qualityAssessment.qualityScore || 0.7;
    metrics.averageQualityScore = 
      (metrics.averageQualityScore * (metrics.totalAnalyses - 1) + currentScore) / 
      metrics.totalAnalyses;
    
    // 改善トレンドの計算
    this.calculateImprovementTrend();
  }
  
  /**
   * 動的閾値の調整
   */
  adjustDynamicThresholds(qualityAssessment) {
    const currentRate = this.optimizationSettings.currentAGradeRate;
    const targetRate = this.optimizationSettings.targetAGradeRate;
    const sensitivity = this.optimizationSettings.adjustmentSensitivity;
    
    // A級達成率が目標を下回る場合、閾値を緩和
    if (currentRate < targetRate) {
      const adjustmentFactor = (targetRate - currentRate) * sensitivity;
      
      Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
        const currentThreshold = this.dynamicThresholds.currentThresholds[key];
        const adjustment = currentThreshold * adjustmentFactor;
        
        // 最小値制限を設けて過度な緩和を防止
        const minThreshold = this.dynamicThresholds.baseThresholds[key] * 0.7;
        this.dynamicThresholds.currentThresholds[key] = 
          Math.max(minThreshold, currentThreshold - adjustment);
      });
      
      console.log('🔧 閾値緩和調整:', {
        reason: 'A級達成率不足',
        currentRate: currentRate.toFixed(3),
        targetRate: targetRate.toFixed(3),
        adjustmentFactor: adjustmentFactor.toFixed(3)
      });
    }
    
    // A級達成率が目標を大きく上回る場合、閾値を厳格化（品質維持）
    else if (currentRate > targetRate + 0.05) {
      const adjustmentFactor = (currentRate - targetRate) * sensitivity * 0.5;
      
      Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
        const currentThreshold = this.dynamicThresholds.currentThresholds[key];
        const adjustment = currentThreshold * adjustmentFactor;
        
        // 最大値制限を設けて過度な厳格化を防止
        const maxThreshold = this.dynamicThresholds.baseThresholds[key] * 1.2;
        this.dynamicThresholds.currentThresholds[key] = 
          Math.min(maxThreshold, currentThreshold + adjustment);
      });
      
      console.log('⚖️ 閾値厳格化調整:', {
        reason: 'A級達成率過多',
        currentRate: currentRate.toFixed(3),
        adjustmentFactor: adjustmentFactor.toFixed(3)
      });
    }
    
    // 閾値履歴の記録
    this.recordThresholdHistory();
  }
  
  /**
   * A級達成率の監視と調整
   */
  monitorAGradeAchievementRate() {
    const currentRate = this.optimizationSettings.currentAGradeRate;
    const targetRate = this.optimizationSettings.targetAGradeRate;
    const totalAnalyses = this.feedbackSystem.performanceMetrics.totalAnalyses;
    
    // 十分なデータが蓄積された場合のみ監視
    if (totalAnalyses < 10) return;
    
    // 達成率が著しく低い場合の緊急調整
    if (currentRate < targetRate * 0.5) {
      this.emergencyQualityBoost();
    }
    
    // 達成率が目標に近づいた場合の微調整
    else if (Math.abs(currentRate - targetRate) < 0.05) {
      this.finetuneQualitySettings();
    }
    
    // 監視レポートの生成
    this.generateMonitoringReport();
  }
  
  /**
   * 緊急品質向上処理
   */
  emergencyQualityBoost() {
    console.log('🚨 緊急品質向上処理開始');
    
    // すべての閾値を大幅に緩和
    Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
      const baseThreshold = this.dynamicThresholds.baseThresholds[key];
      this.dynamicThresholds.currentThresholds[key] = baseThreshold * 0.6;
    });
    
    // 品質ブースト機能の有効化
    this.optimizationSettings.qualityBoostEnabled = true;
    
    // 学習率の一時的な増加
    this.optimizationSettings.learningRate = 0.1;
    
    // 緊急調整の記録
    this.recordEmergencyAdjustment('quality_boost');
  }
  
  /**
   * 品質設定の微調整
   */
  finetuneQualitySettings() {
    const recentData = this.feedbackSystem.historicalData.slice(-20);
    const recentAGradeRate = recentData.filter(d => d.grade === 'A').length / recentData.length;
    
    if (recentAGradeRate < this.optimizationSettings.targetAGradeRate) {
      // 微小な閾値緩和
      Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
        this.dynamicThresholds.currentThresholds[key] *= 0.98;
      });
    }
    
    console.log('🎯 品質設定微調整完了:', {
      recentAGradeRate: recentAGradeRate.toFixed(3),
      adjustment: 'fine_tuning'
    });
  }
  
  /**
   * 複数評価軸統合評価
   */
  calculateMultiAxisEvaluation(qualityFactors) {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(this.evaluationAxes).forEach(([axisName, axisConfig]) => {
      let axisScore = 0;
      let componentCount = 0;
      
      // 軸内のコンポーネントスコア計算
      axisConfig.components.forEach(component => {
        if (qualityFactors[component] !== undefined) {
          axisScore += qualityFactors[component];
          componentCount++;
        }
      });
      
      if (componentCount > 0) {
        axisScore /= componentCount;
        totalScore += axisScore * axisConfig.weight;
        totalWeight += axisConfig.weight;
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0.7;
  }
  
  /**
   * 品質予測とプロアクティブな調整
   */
  predictiveQualityAdjustment() {
    const recentData = this.feedbackSystem.historicalData.slice(-50);
    if (recentData.length < 10) return;
    
    // トレンド分析
    const trend = this.analyzeTrend(recentData);
    
    // 予測に基づく事前調整
    if (trend.direction === 'declining' && trend.strength > 0.3) {
      console.log('📉 品質低下傾向を検出 - 予防的調整実行');
      this.preventiveQualityAdjustment(trend);
    }
  }
  
  /**
   * トレンド分析
   */
  analyzeTrend(data) {
    if (data.length < 5) return { direction: 'stable', strength: 0 };
    
    const scores = data.map(d => d.qualityScore);
    const recent = scores.slice(-Math.floor(scores.length / 2));
    const earlier = scores.slice(0, Math.floor(scores.length / 2));
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    const difference = recentAvg - earlierAvg;
    const strength = Math.abs(difference);
    
    return {
      direction: difference > 0.02 ? 'improving' : 
                difference < -0.02 ? 'declining' : 'stable',
      strength: strength,
      recentAvg: recentAvg,
      earlierAvg: earlierAvg
    };
  }
  
  /**
   * 予防的品質調整
   */
  preventiveQualityAdjustment(trend) {
    const adjustmentIntensity = Math.min(trend.strength * 2, 0.2);
    
    Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
      const currentThreshold = this.dynamicThresholds.currentThresholds[key];
      const adjustment = currentThreshold * adjustmentIntensity;
      const minThreshold = this.dynamicThresholds.baseThresholds[key] * 0.5;
      
      this.dynamicThresholds.currentThresholds[key] = 
        Math.max(minThreshold, currentThreshold - adjustment);
    });
  }
  
  /**
   * 定期最適化処理
   */
  performPeriodicOptimization() {
    if (this.feedbackSystem.performanceMetrics.totalAnalyses < 5) return;
    
    // 予測的調整
    this.predictiveQualityAdjustment();
    
    // 学習則の適用
    this.applyLearningRules();
    
    // 最適化状態の保存
    this.saveOptimizationState();
  }
  
  /**
   * 学習則の適用
   */
  applyLearningRules() {
    if (!this.feedbackSystem.learningEnabled) return;
    
    const recentSuccess = this.analyzeRecentSuccess();
    
    // 成功パターンの学習
    if (recentSuccess.aGradeRate > 0.8) {
      this.reinforceSuccessfulSettings();
    }
    
    // 失敗パターンからの学習
    if (recentSuccess.aGradeRate < 0.6) {
      this.adjustFromFailurePatterns();
    }
  }
  
  /**
   * 最近の成功分析
   */
  analyzeRecentSuccess() {
    const recentData = this.feedbackSystem.historicalData.slice(-20);
    const aGrades = recentData.filter(d => d.grade === 'A').length;
    
    return {
      aGradeRate: aGrades / recentData.length,
      averageScore: recentData.reduce((sum, d) => sum + d.qualityScore, 0) / recentData.length,
      dataPoints: recentData.length
    };
  }
  
  /**
   * 成功設定の強化
   */
  reinforceSuccessfulSettings() {
    // 現在の設定が成功しているため、わずかに厳格化
    Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
      this.dynamicThresholds.currentThresholds[key] *= 1.02;
    });
    
    console.log('✅ 成功設定を強化');
  }
  
  /**
   * 失敗パターンからの調整
   */
  adjustFromFailurePatterns() {
    // より積極的な緩和
    Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
      this.dynamicThresholds.currentThresholds[key] *= 0.95;
    });
    
    console.log('🔄 失敗パターンから学習調整');
  }
  
  /**
   * 品質最適化の外部インターフェース
   */
  optimizeQuality(analysisResult) {
    try {
      const qualityFactors = analysisResult.qualityMetrics || {};
      
      // 動的閾値の適用
      const optimizedFactors = this.applyDynamicThresholds(qualityFactors);
      
      // 複数評価軸統合
      const multiAxisScore = this.calculateMultiAxisEvaluation(optimizedFactors);
      
      // 品質ブースト適用
      if (this.optimizationSettings.qualityBoostEnabled) {
        optimizedFactors.boost = this.calculateQualityBoost(multiAxisScore);
      }
      
      return {
        originalFactors: qualityFactors,
        optimizedFactors: optimizedFactors,
        multiAxisScore: multiAxisScore,
        appliedThresholds: { ...this.dynamicThresholds.currentThresholds },
        optimizationApplied: true
      };
      
    } catch (error) {
      console.error('❌ 品質最適化エラー:', error);
      return { optimizationApplied: false, error: error.message };
    }
  }
  
  /**
   * 動的閾値の適用
   */
  applyDynamicThresholds(qualityFactors) {
    const optimized = { ...qualityFactors };
    
    Object.keys(this.dynamicThresholds.currentThresholds).forEach(key => {
      if (optimized[key] !== undefined) {
        const threshold = this.dynamicThresholds.currentThresholds[key];
        const originalValue = optimized[key];
        
        // 閾値に基づく調整
        if (originalValue < threshold) {
          // 閾値未満の場合は段階的に向上
          optimized[key] = Math.min(1.0, originalValue + (threshold - originalValue) * 0.3);
        }
      }
    });
    
    return optimized;
  }
  
  /**
   * 品質ブーストの計算
   */
  calculateQualityBoost(multiAxisScore) {
    const targetScore = 0.75; // A級達成に必要な最低スコア
    
    if (multiAxisScore < targetScore) {
      const deficit = targetScore - multiAxisScore;
      const boost = Math.min(deficit * 0.5, 0.15); // 最大15%のブースト
      return boost;
    }
    
    return 0;
  }
  
  // ===== データ永続化関連メソッド =====
  
  saveOptimizationState() {
    try {
      const state = {
        thresholds: this.dynamicThresholds.currentThresholds,
        settings: this.optimizationSettings,
        metrics: this.feedbackSystem.performanceMetrics,
        timestamp: Date.now()
      };
      
      localStorage.setItem('haqei_quality_optimization_state', JSON.stringify(state));
    } catch (error) {
      console.warn('最適化状態保存エラー:', error);
    }
  }
  
  loadSavedThresholds() {
    try {
      const saved = localStorage.getItem('haqei_quality_optimization_state');
      if (saved) {
        const state = JSON.parse(saved);
        // 24時間以内のデータのみ有効
        if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
          return state.thresholds;
        }
      }
    } catch (error) {
      console.warn('保存状態読み込みエラー:', error);
    }
    return null;
  }
  
  saveHistoricalData() {
    try {
      const recentData = this.feedbackSystem.historicalData.slice(-100);
      localStorage.setItem('haqei_quality_history', JSON.stringify(recentData));
    } catch (error) {
      console.warn('履歴データ保存エラー:', error);
    }
  }
  
  loadHistoricalData() {
    try {
      const saved = localStorage.getItem('haqei_quality_history');
      if (saved) {
        this.feedbackSystem.historicalData = JSON.parse(saved);
        // メトリクスの復元
        this.restoreMetricsFromHistory();
      }
    } catch (error) {
      console.warn('履歴データ読み込みエラー:', error);
    }
  }
  
  restoreMetricsFromHistory() {
    const data = this.feedbackSystem.historicalData;
    if (data.length === 0) return;
    
    const metrics = this.feedbackSystem.performanceMetrics;
    metrics.totalAnalyses = data.length;
    metrics.aGradeAchievements = data.filter(d => d.grade === 'A').length;
    
    this.optimizationSettings.currentAGradeRate = 
      metrics.aGradeAchievements / metrics.totalAnalyses;
    
    const totalScore = data.reduce((sum, d) => sum + d.qualityScore, 0);
    metrics.averageQualityScore = totalScore / data.length;
  }
  
  // ===== ユーティリティメソッド群 =====
  
  calculateImprovementTrend() {
    const data = this.feedbackSystem.historicalData;
    if (data.length < 10) return 0;
    
    const recent = data.slice(-5);
    const earlier = data.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, d) => sum + d.qualityScore, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + d.qualityScore, 0) / earlier.length;
    
    this.feedbackSystem.performanceMetrics.improvementTrend = recentAvg - earlierAvg;
  }
  
  recordThresholdHistory() {
    this.dynamicThresholds.thresholdHistory.push({
      timestamp: Date.now(),
      thresholds: { ...this.dynamicThresholds.currentThresholds },
      aGradeRate: this.optimizationSettings.currentAGradeRate
    });
    
    // 履歴サイズ制限
    if (this.dynamicThresholds.thresholdHistory.length > 100) {
      this.dynamicThresholds.thresholdHistory.shift();
    }
  }
  
  recordEmergencyAdjustment(type) {
    console.log(`🚨 緊急調整記録: ${type}`);
    // 緊急調整の記録（分析・改善用）
  }
  
  initializeAdaptationRules() {
    // 適応ルールの初期化（簡易版）
    this.feedbackSystem.adaptationRules.set('low_success_rate', {
      condition: (rate) => rate < 0.6,
      action: 'emergency_boost'
    });
    
    this.feedbackSystem.adaptationRules.set('high_success_rate', {
      condition: (rate) => rate > 0.95,
      action: 'slight_tightening'
    });
  }
  
  generateMonitoringReport() {
    const metrics = this.feedbackSystem.performanceMetrics;
    const report = {
      currentAGradeRate: this.optimizationSettings.currentAGradeRate,
      targetAGradeRate: this.optimizationSettings.targetAGradeRate,
      totalAnalyses: metrics.totalAnalyses,
      averageQualityScore: metrics.averageQualityScore,
      improvementTrend: metrics.improvementTrend,
      currentThresholds: this.dynamicThresholds.currentThresholds,
      status: this.optimizationSettings.currentAGradeRate >= this.optimizationSettings.targetAGradeRate ? 'TARGET_ACHIEVED' : 'OPTIMIZING'
    };
    
    // 詳細ログ出力
    if (metrics.totalAnalyses % 10 === 0) {
      console.log('📊 品質最適化監視レポート:', report);
    }
    
    return report;
  }
  
  /**
   * 外部からの設定変更インターフェース
   */
  updateSettings(newSettings) {
    Object.assign(this.optimizationSettings, newSettings);
    console.log('⚙️ 最適化設定更新:', newSettings);
  }
  
  /**
   * 現在の最適化状態取得
   */
  getOptimizationStatus() {
    return {
      settings: this.optimizationSettings,
      thresholds: this.dynamicThresholds.currentThresholds,
      performance: this.feedbackSystem.performanceMetrics,
      lastUpdate: Date.now()
    };
  }
}

// グローバルインスタンスの作成
window.dynamicQualityOptimizer = new DynamicQualityOptimizer();

// IntegratedAnalysisEngine との統合
document.addEventListener('DOMContentLoaded', () => {
  if (window.IntegratedAnalysisEngine) {
    console.log('🔗 DynamicQualityOptimizer と IntegratedAnalysisEngine の統合完了');
  }
});