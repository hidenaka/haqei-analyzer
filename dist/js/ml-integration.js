/**
 * ML Integration - Bunenjin Philosophy Implementation
 * Triple OS Architecture: Engine Layer Component
 * 
 * 機械学習統合システム
 * - 軽量なML機能の統合
 * - 予測モデルの実装
 * - 矛盾受容型学習システム
 */

class MLIntegration {
  constructor() {
    this.initialized = false;
    this.models = new Map();
    this.trainingData = new Map();
    this.predictions = new Map();
    
    // Bunenjin Philosophy: 不完全な予測も価値がある
    this.acceptContradiction = {
      accurate_inaccurate: true,    // 正確でない正確性
      simple_complex: true,         // 単純な複雑性
      predictable_unpredictable: true, // 予測可能な不予測性
      certain_uncertain: true       // 確実な不確実性
    };
    
    // Triple OS Architecture Components
    this.engineOS = null;
    this.interfaceOS = null;
    this.safeMode = null;
    
    this.init();
  }
  
  async init() {
    console.log('🤖 [MLIntegration] 初期化開始 - Bunenjin ML System');
    
    try {
      // Triple OS Architecture Setup
      this.initializeTripleOS();
      
      // Basic ML models initialization
      await this.initializeModels();
      
      // Training data setup
      await this.setupTrainingData();
      
      this.initialized = true;
      console.log('✅ [MLIntegration] ML システム準備完了');
      
    } catch (error) {
      console.error('❌ [MLIntegration] 初期化エラー:', error);
      this.activateSafeMode();
    }
  }
  
  initializeTripleOS() {
    console.log('🔧 [MLIntegration] Triple OS Architecture 初期化');
    
    // Engine OS (Core ML Logic)
    this.engineOS = {
      name: 'ML Engine OS',
      version: '1.0.0',
      philosophy: 'bunenjin-ml',
      
      // Simple linear regression for trend prediction
      async predictTrend(dataPoints, options = {}) {
        try {
          if (!dataPoints || dataPoints.length < 2) {
            return this.createEmptyPrediction('insufficient_data');
          }
          
          const { slope, intercept, correlation } = this.calculateLinearRegression(dataPoints);
          
          const futurePoints = options.steps || 3;
          const predictions = [];
          
          for (let i = 1; i <= futurePoints; i++) {
            const x = dataPoints.length + i;
            const y = slope * x + intercept;
            
            predictions.push({
              x: x,
              y: y,
              confidence: Math.max(0.1, correlation * 0.8), // Bunenjin: 低信頼度も受容
              method: 'linear_regression'
            });
          }
          
          return {
            predictions: predictions,
            model: { slope, intercept, correlation },
            quality: this.assessPredictionQuality(correlation),
            philosophy: 'bunenjin-trend'
          };
          
        } catch (error) {
          console.warn('⚠️ トレンド予測エラー:', error);
          return this.createEmptyPrediction('calculation_error');
        }
      },
      
      calculateLinearRegression(points) {
        const n = points.length;
        if (n < 2) return { slope: 0, intercept: 0, correlation: 0 };
        
        const sumX = points.reduce((sum, p, i) => sum + i, 0);
        const sumY = points.reduce((sum, p) => sum + p.value, 0);
        const sumXY = points.reduce((sum, p, i) => sum + i * p.value, 0);
        const sumXX = points.reduce((sum, p, i) => sum + i * i, 0);
        const sumYY = points.reduce((sum, p) => sum + p.value * p.value, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Calculate correlation coefficient
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        const correlation = denominator === 0 ? 0 : Math.abs(numerator / denominator);
        
        return { slope, intercept, correlation };
      },
      
      // Simple pattern recognition for scenario classification
      async classifyScenario(scenarioData, options = {}) {
        try {
          const features = this.extractFeatures(scenarioData);
          const classification = this.performBasicClassification(features);
          
          return {
            classification: classification,
            features: features,
            confidence: classification.confidence,
            method: 'pattern_matching',
            philosophy: 'bunenjin-classification'
          };
          
        } catch (error) {
          console.warn('⚠️ シナリオ分類エラー:', error);
          return this.createBasicClassification(scenarioData);
        }
      },
      
      extractFeatures(scenarioData) {
        const features = {};
        
        // Text-based features
        if (scenarioData.text) {
          features.textLength = scenarioData.text.length;
          features.wordCount = scenarioData.text.split(/\s+/).length;
          features.sentenceCount = (scenarioData.text.match(/[.!?]+/g) || []).length;
        }
        
        // Keyword-based features
        if (scenarioData.keywords) {
          features.keywordCount = scenarioData.keywords.length;
          features.emotionalWords = this.countEmotionalWords(scenarioData.keywords);
          features.actionWords = this.countActionWords(scenarioData.keywords);
          features.timeWords = this.countTimeWords(scenarioData.keywords);
        }
        
        // Metadata features
        if (scenarioData.metadata) {
          features.urgency = scenarioData.metadata.urgency || 0.5;
          features.complexity = scenarioData.metadata.complexity || 0.5;
          features.uncertainty = scenarioData.metadata.uncertainty || 0.5;
        }
        
        return features;
      },
      
      countEmotionalWords(keywords) {
        const emotionalWords = ['感情', '気持ち', '心', '愛', '怒り', '悲しい', '嬉しい', '不安'];
        return keywords.filter(k => emotionalWords.some(ew => k.includes(ew))).length;
      },
      
      countActionWords(keywords) {
        const actionWords = ['する', 'やる', '行く', '来る', '作る', '変える', '始める', '終わる'];
        return keywords.filter(k => actionWords.some(aw => k.includes(aw))).length;
      },
      
      countTimeWords(keywords) {
        const timeWords = ['今', '明日', '昨日', '未来', '過去', '現在', 'いつ', 'まもなく'];
        return keywords.filter(k => timeWords.some(tw => k.includes(tw))).length;
      },
      
      performBasicClassification(features) {
        // Simple rule-based classification
        let category = 'general';
        let confidence = 0.5;
        
        // Emotional scenario detection
        if (features.emotionalWords > 2) {
          category = 'emotional';
          confidence = Math.min(0.8, 0.5 + features.emotionalWords * 0.1);
        }
        
        // Action-oriented scenario detection
        else if (features.actionWords > 3) {
          category = 'action_oriented';
          confidence = Math.min(0.8, 0.5 + features.actionWords * 0.08);
        }
        
        // Time-sensitive scenario detection
        else if (features.timeWords > 1 && features.urgency > 0.7) {
          category = 'time_sensitive';
          confidence = Math.min(0.8, 0.5 + features.timeWords * 0.1 + features.urgency * 0.2);
        }
        
        // Complex scenario detection
        else if (features.complexity > 0.7) {
          category = 'complex';
          confidence = Math.min(0.8, 0.5 + features.complexity * 0.3);
        }
        
        return {
          category: category,
          confidence: confidence,
          reasoning: this.generateClassificationReasoning(category, features)
        };
      },
      
      generateClassificationReasoning(category, features) {
        const reasonings = {
          emotional: `感情的なキーワードが${features.emotionalWords}個検出されました`,
          action_oriented: `行動指向のキーワードが${features.actionWords}個検出されました`,
          time_sensitive: `時間関連のキーワードと高い緊急性が検出されました`,
          complex: `高い複雑性レベル（${features.complexity}）が検出されました`,
          general: ' 一般的なシナリオとして分類されました'
        };
        
        return reasonings[category] || '分類理由が特定できませんでした';
      },
      
      // Simple clustering for grouping similar scenarios
      async clusterSimilarScenarios(scenarios, options = {}) {
        try {
          const clusters = this.performSimpleClustering(scenarios, options.maxClusters || 3);
          
          return {
            clusters: clusters,
            method: 'distance_based',
            totalScenarios: scenarios.length,
            philosophy: 'bunenjin-clustering'
          };
          
        } catch (error) {
          console.warn('⚠️ クラスタリングエラー:', error);
          return this.createBasicClusters(scenarios);
        }
      },
      
      performSimpleClustering(scenarios, maxClusters) {
        if (scenarios.length <= maxClusters) {
          // Each scenario becomes its own cluster
          return scenarios.map((scenario, index) => ({
            id: index,
            scenarios: [scenario],
            centroid: this.extractFeatures(scenario),
            size: 1
          }));
        }
        
        // Simple k-means style clustering
        const clusters = [];
        const clusterSize = Math.ceil(scenarios.length / maxClusters);
        
        for (let i = 0; i < maxClusters; i++) {
          const start = i * clusterSize;
          const end = Math.min(start + clusterSize, scenarios.length);
          const clusterScenarios = scenarios.slice(start, end);
          
          if (clusterScenarios.length > 0) {
            clusters.push({
              id: i,
              scenarios: clusterScenarios,
              centroid: this.calculateClusterCentroid(clusterScenarios),
              size: clusterScenarios.length
            });
          }
        }
        
        return clusters;
      },
      
      calculateClusterCentroid(scenarios) {
        if (scenarios.length === 0) return {};
        
        const allFeatures = scenarios.map(s => this.extractFeatures(s));
        const centroid = {};
        
        // Average all numeric features
        const featureKeys = Object.keys(allFeatures[0] || {});
        
        featureKeys.forEach(key => {
          const values = allFeatures
            .map(f => f[key])
            .filter(v => typeof v === 'number');
          
          if (values.length > 0) {
            centroid[key] = values.reduce((sum, v) => sum + v, 0) / values.length;
          }
        });
        
        return centroid;
      },
      
      assessPredictionQuality(correlation) {
        if (correlation > 0.8) return 'high';
        if (correlation > 0.6) return 'medium';
        if (correlation > 0.4) return 'low';
        return 'very_low'; // Bunenjin: 低品質も価値がある
      },
      
      createEmptyPrediction(reason) {
        return {
          predictions: [],
          model: null,
          quality: 'none',
          reason: reason,
          philosophy: 'bunenjin-empty'
        };
      },
      
      createBasicClassification(scenarioData) {
        return {
          classification: {
            category: 'unknown',
            confidence: 0.3,
            reasoning: '基本分類を使用'
          },
          features: {},
          method: 'fallback',
          philosophy: 'bunenjin-basic'
        };
      },
      
      createBasicClusters(scenarios) {
        return {
          clusters: [{
            id: 0,
            scenarios: scenarios,
            centroid: {},
            size: scenarios.length
          }],
          method: 'single_cluster',
          totalScenarios: scenarios.length,
          philosophy: 'bunenjin-basic'
        };
      }
    };
    
    // Interface OS (User Interaction Layer)
    this.interfaceOS = {
      name: 'ML Interface OS',
      
      formatPredictionResult(result) {
        return {
          display: {
            predictions: result.predictions.map(p => ({
              step: p.x,
              value: this.formatNumber(p.y),
              confidence: this.formatPercentage(p.confidence),
              reliability: this.getReliabilityLabel(p.confidence)
            })),
            quality: this.getQualityLabel(result.quality),
            model: result.model ? {
              trend: result.model.slope > 0 ? '上昇傾向' : 
                    result.model.slope < 0 ? '下降傾向' : '横ばい',
              strength: this.formatPercentage(result.model.correlation)
            } : null
          },
          philosophy: result.philosophy
        };
      },
      
      formatClassificationResult(result) {
        return {
          display: {
            category: this.getCategoryLabel(result.classification.category),
            confidence: this.formatPercentage(result.classification.confidence),
            reasoning: result.classification.reasoning,
            features: this.formatFeatures(result.features)
          },
          method: result.method,
          philosophy: result.philosophy
        };
      },
      
      formatClusteringResult(result) {
        return {
          display: {
            totalClusters: result.clusters.length,
            clusters: result.clusters.map(cluster => ({
              id: cluster.id,
              size: cluster.size,
              description: this.generateClusterDescription(cluster)
            })),
            distribution: this.calculateClusterDistribution(result.clusters)
          },
          method: result.method,
          philosophy: result.philosophy
        };
      },
      
      formatNumber(num) {
        return Math.round(num * 100) / 100;
      },
      
      formatPercentage(ratio) {
        return Math.round(ratio * 100) + '%';
      },
      
      getReliabilityLabel(confidence) {
        if (confidence > 0.8) return '高信頼';
        if (confidence > 0.6) return '中信頼';
        if (confidence > 0.4) return '低信頼';
        return '参考程度'; // Bunenjin: 低信頼度も価値
      },
      
      getQualityLabel(quality) {
        const labels = {
          high: '🎯 高品質',
          medium: '⚡ 中品質',
          low: '📊 低品質',
          very_low: '🛡️ 参考品質',
          none: '📝 データ不足'
        };
        
        return labels[quality] || quality;
      },
      
      getCategoryLabel(category) {
        const labels = {
          emotional: '🎭 感情的',
          action_oriented: '🎬 行動指向',
          time_sensitive: '⏰ 時間重要',
          complex: '🧩 複雑',
          general: '📋 一般的',
          unknown: '❓ 未分類'
        };
        
        return labels[category] || category;
      },
      
      formatFeatures(features) {
        const formatted = {};
        
        Object.entries(features).forEach(([key, value]) => {
          if (typeof value === 'number') {
            formatted[key] = this.formatNumber(value);
          } else {
            formatted[key] = value;
          }
        });
        
        return formatted;
      },
      
      generateClusterDescription(cluster) {
        const size = cluster.size;
        
        if (size === 1) {
          return '単独シナリオ';
        } else if (size <= 3) {
          return '小グループ';
        } else if (size <= 7) {
          return '中グループ';
        } else {
          return '大グループ';
        }
      },
      
      calculateClusterDistribution(clusters) {
        const total = clusters.reduce((sum, c) => sum + c.size, 0);
        
        return clusters.map(cluster => ({
          clusterId: cluster.id,
          percentage: this.formatPercentage(cluster.size / total)
        }));
      }
    };
    
    // Safe Mode OS (Fallback Layer)
    this.safeMode = {
      name: 'ML Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ [MLIntegration] Safe Mode 起動');
        this.active = true;
        
        return {
          basicML: true,
          advancedFeatures: false,
          philosophy: 'bunenjin-safe'
        };
      },
      
      generateSafePrediction(data) {
        // 安全な基本予測
        return {
          predictions: [{
            x: 1,
            y: 0.5,
            confidence: 0.3,
            method: 'safe_mode'
          }],
          quality: 'safe',
          philosophy: 'bunenjin-safe'
        };
      },
      
      generateSafeClassification(data) {
        return {
          classification: {
            category: 'general',
            confidence: 0.5,
            reasoning: 'Safe Mode分類'
          },
          method: 'safe_mode',
          philosophy: 'bunenjin-safe'
        };
      },
      
      generateSafeClusters(scenarios) {
        return {
          clusters: [{
            id: 0,
            scenarios: scenarios,
            centroid: {},
            size: scenarios.length
          }],
          method: 'safe_mode',
          philosophy: 'bunenjin-safe'
        };
      }
    };
    
    console.log('✅ [MLIntegration] Triple OS Architecture 準備完了');
  }
  
  async initializeModels() {
    console.log('🧠 [MLIntegration] ML モデル初期化');
    
    // Basic regression model
    this.models.set('trend_predictor', {
      name: 'Trend Predictor',
      type: 'linear_regression',
      trained: false,
      parameters: {},
      philosophy: 'bunenjin-simple'
    });
    
    // Basic classifier
    this.models.set('scenario_classifier', {
      name: 'Scenario Classifier',
      type: 'rule_based',
      trained: true, // Rule-based doesn't need training
      rules: this.createClassificationRules(),
      philosophy: 'bunenjin-adaptive'
    });
    
    // Basic clustering
    this.models.set('scenario_clusterer', {
      name: 'Scenario Clusterer',
      type: 'distance_based',
      trained: true,
      parameters: { maxClusters: 5 },
      philosophy: 'bunenjin-grouping'
    });
  }
  
  createClassificationRules() {
    return {
      emotional: {
        keywords: ['感情', '気持ち', '心配', '不安', '喜び', '悲しい'],
        threshold: 2,
        weight: 0.8
      },
      
      action: {
        keywords: ['する', 'やる', '実行', '行動', '取り組む', '始める'],
        threshold: 2,
        weight: 0.7
      },
      
      time: {
        keywords: ['急ぎ', '締切', 'すぐに', '今すぐ', '明日', '来週'],
        threshold: 1,
        weight: 0.9
      },
      
      complex: {
        textLength: 200,
        keywordCount: 5,
        weight: 0.6
      }
    };
  }
  
  async setupTrainingData() {
    console.log('📊 [MLIntegration] 訓練データ設定');
    
    // Sample training data for demonstration
    this.trainingData.set('scenarios', [
      {
        text: '今後の人生について真剣に考えている',
        keywords: ['人生', '真剣', '考える'],
        category: 'philosophical',
        features: { emotional: 1, action: 1, complexity: 0.7 }
      },
      {
        text: '明日までに重要な決断をしなければならない',
        keywords: ['明日', '決断', '重要'],
        category: 'time_sensitive',
        features: { time: 2, urgency: 0.9, action: 1 }
      },
      {
        text: '新しい仕事を始めることになった',
        keywords: ['新しい', '仕事', '始める'],
        category: 'action_oriented',
        features: { action: 2, change: 1, complexity: 0.5 }
      }
    ]);
    
    // Trend data for prediction models
    this.trainingData.set('trends', [
      { time: 1, value: 10 },
      { time: 2, value: 15 },
      { time: 3, value: 12 },
      { time: 4, value: 18 },
      { time: 5, value: 20 }
    ]);
  }
  
  activateSafeMode() {
    console.log('🛡️ [MLIntegration] Safe Mode 起動');
    this.safeMode.activate();
    this.initialized = true;
  }
  
  // Public API
  async predictTrend(dataPoints, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.generateSafePrediction(dataPoints);
      }
      
      const result = await this.engineOS.predictTrend(dataPoints, options);
      return this.interfaceOS.formatPredictionResult(result);
      
    } catch (error) {
      console.error('❌ [MLIntegration] トレンド予測エラー:', error);
      return this.safeMode.generateSafePrediction(dataPoints);
    }
  }
  
  async classifyScenario(scenarioData, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.generateSafeClassification(scenarioData);
      }
      
      const result = await this.engineOS.classifyScenario(scenarioData, options);
      return this.interfaceOS.formatClassificationResult(result);
      
    } catch (error) {
      console.error('❌ [MLIntegration] シナリオ分類エラー:', error);
      return this.safeMode.generateSafeClassification(scenarioData);
    }
  }
  
  async clusterScenarios(scenarios, options = {}) {
    if (!this.initialized) {
      await this.init();
    }
    
    try {
      if (this.safeMode.active) {
        return this.safeMode.generateSafeClusters(scenarios);
      }
      
      const result = await this.engineOS.clusterSimilarScenarios(scenarios, options);
      return this.interfaceOS.formatClusteringResult(result);
      
    } catch (error) {
      console.error('❌ [MLIntegration] クラスタリングエラー:', error);
      return this.safeMode.generateSafeClusters(scenarios);
    }
  }
  
  getStatus() {
    return {
      initialized: this.initialized,
      safeModeActive: this.safeMode?.active || false,
      modelsCount: this.models.size,
      trainingDataSets: this.trainingData.size,
      philosophy: 'bunenjin',
      architecture: 'triple-os'
    };
  }
  
  getAvailableModels() {
    const modelList = [];
    
    this.models.forEach((model, key) => {
      modelList.push({
        id: key,
        name: model.name,
        type: model.type,
        trained: model.trained,
        philosophy: model.philosophy
      });
    });
    
    return modelList;
  }
}

// Global instance with Bunenjin Philosophy
if (typeof window !== 'undefined') {
  window.MLIntegration = new MLIntegration();
  
  // Convenience functions for other systems
  window.predictTrend = async function(dataPoints, options) {
    return await window.MLIntegration.predictTrend(dataPoints, options);
  };
  
  window.classifyScenario = async function(scenarioData, options) {
    return await window.MLIntegration.classifyScenario(scenarioData, options);
  };
  
  window.clusterScenarios = async function(scenarios, options) {
    return await window.MLIntegration.clusterScenarios(scenarios, options);
  };
}

console.log('✅ [MLIntegration] Bunenjin Philosophy Implementation Loaded');