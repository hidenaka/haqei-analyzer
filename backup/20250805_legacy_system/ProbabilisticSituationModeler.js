/**
 * 確率的状況モデリングエンジン - 状況卦精度向上システム Phase 3.5
 * 
 * 目的：
 * - ベイズ推論による状況の不確実性定量化
 * - 複数の可能性世界の並列シミュレーション
 * - 確率分布に基づく変卦予測の精緻化
 * - モンテカルロ法による状況展開の確率的評価
 * 
 * 入力：
 * - situationalContext: object - Phase 2からの仮想状況推定結果
 * - hexagramMapping: object - Phase 2.5からの易経マッピング結果
 * - historicalData: Array - 過去の状況遷移データ
 * - modelingOptions: object - モデリング設定オプション
 * 
 * 処理内容：
 * 1. ベイズネットワークによる状況要因の因果関係モデリング
 * 2. 確率分布の推定（正規分布・ベータ分布・ディリクレ分布）
 * 3. モンテカルロシミュレーションによる状況展開予測
 * 4. 変卦確率の動的計算
 * 5. 不確実性の定量化と信頼区間の算出
 * 6. リスク・機会の確率的評価
 * 
 * 出力：
 * - probabilityDistributions: object - 各要因の確率分布
 * - scenarioSimulations: Array - シミュレートされたシナリオ群
 * - changeProbabilities: object - 変卦の確率マトリクス
 * - uncertaintyMetrics: object - 不確実性の定量指標
 * - riskOpportunityMatrix: object - リスクと機会の確率評価
 * - confidenceIntervals: object - 予測の信頼区間
 * - bayesianInsights: Array - ベイズ推論による洞察
 * 
 * 副作用：
 * - 確率モデルの学習と更新
 * - シミュレーション結果の蓄積
 * 
 * 前提条件：
 * - SituationalContextEngine の結果が利用可能
 * - 基本的な確率統計演算が実装されている
 * 
 * エラー処理：
 * - 数値的不安定性の検出と対処
 * - 確率の正規化
 * - 外れ値の適切な処理
 */
class ProbabilisticSituationModeler {
  constructor() {
    this.modelHistory = [];
    this.probabilityCache = new Map();
    this.simulationCount = 1000; // デフォルトのシミュレーション回数
    
    // ベイズ推論パラメータ
    this.priorBeliefs = {
      changeVelocity: { alpha: 2, beta: 5 }, // ベータ分布の事前分布
      complexityLevel: { dirichlet: [1, 1, 1] }, // ディリクレ分布
      emotionalIntensity: { mean: 0.5, variance: 0.1 } // 正規分布
    };
    
    // 状況遷移確率行列（簡易版）
    this.transitionMatrix = {
      embryonic: { embryonic: 0.3, growth: 0.5, mature: 0.1, transition: 0.1 },
      growth: { embryonic: 0.1, growth: 0.4, mature: 0.4, transition: 0.1 },
      mature: { embryonic: 0.05, growth: 0.1, mature: 0.6, transition: 0.25 },
      transition: { embryonic: 0.2, growth: 0.3, mature: 0.2, transition: 0.3 }
    };
    
    // リスク・機会の評価基準
    this.riskOpportunityThresholds = {
      highRisk: { probability: 0.3, impact: 0.7 },
      moderateRisk: { probability: 0.5, impact: 0.5 },
      highOpportunity: { probability: 0.3, benefit: 0.7 },
      moderateOpportunity: { probability: 0.5, benefit: 0.5 }
    };
    
    // 統計データ
    this.statistics = {
      totalSimulations: 0,
      averageUncertainty: 0,
      modelAccuracy: 0,
      convergenceRate: 0
    };
  }

  /**
   * 確率的状況モデリング実行
   * 
   * 目的：
   * - 状況の不確実性を定量的に評価
   * - 複数の可能な未来シナリオを生成
   * 
   * 処理内容：
   * - ベイズ推論による確率更新
   * - モンテカルロシミュレーション
   * - 統計的分析と予測
   * 
   * 出力：
   * - 包括的な確率モデリング結果
   */
  async modelProbabilisticSituation(situationalContext, hexagramMapping, historicalData = [], modelingOptions = {}) {
    const startTime = performance.now();
    
    console.log('📊 確率的状況モデリング開始');
    
    // 入力検証
    if (!situationalContext || !hexagramMapping) {
      console.error('ProbabilisticSituationModeler: 必要な入力データが不足');
      return this.generateErrorResult('入力データ不足');
    }

    try {
      const modelingLayers = {};
      
      // Layer 1: ベイズネットワーク構築
      console.log('🔗 Layer 1: ベイズネットワーク構築');
      modelingLayers.bayesianNetwork = await this.layer1_buildBayesianNetwork(situationalContext, historicalData);
      
      // Layer 2: 確率分布推定
      console.log('📈 Layer 2: 確率分布推定');
      modelingLayers.probabilityDistributions = await this.layer2_estimateProbabilityDistributions(situationalContext, modelingLayers.bayesianNetwork);
      
      // Layer 3: モンテカルロシミュレーション
      console.log('🎲 Layer 3: モンテカルロシミュレーション');
      modelingLayers.simulations = await this.layer3_monteCarloSimulation(modelingLayers.probabilityDistributions, situationalContext);
      
      // Layer 4: 変卦確率計算
      console.log('🔄 Layer 4: 変卦確率計算');
      modelingLayers.changeProbabilities = await this.layer4_calculateChangeProbabilities(modelingLayers.simulations, hexagramMapping);
      
      // Layer 5: 不確実性分析
      console.log('❓ Layer 5: 不確実性分析');
      modelingLayers.uncertaintyAnalysis = await this.layer5_uncertaintyAnalysis(modelingLayers);
      
      // Layer 6: リスク・機会評価
      console.log('⚖️ Layer 6: リスク・機会評価');
      modelingLayers.riskOpportunityAssessment = await this.layer6_riskOpportunityAssessment(modelingLayers, situationalContext);
      
      // 統合結果生成
      console.log('🎯 統合確率モデル生成');
      const finalResult = await this.generateIntegratedProbabilisticModel(modelingLayers, situationalContext, hexagramMapping);
      
      // 処理時間と品質メトリクス
      const processingTime = performance.now() - startTime;
      finalResult.qualityMetrics = {
        processingTime: processingTime,
        simulationCount: this.simulationCount,
        convergenceAchieved: finalResult.convergenceMetrics.converged,
        modelConfidence: finalResult.modelConfidence
      };
      
      // モデル学習
      this.updateModelLearning(finalResult);
      
      // 統計更新
      this.updateStatistics(finalResult, true);
      
      console.log('✨ 確率的状況モデリング完了:', {
        primaryScenario: finalResult.mostLikelyScenario,
        uncertainty: finalResult.uncertaintyMetrics.overallUncertainty,
        convergence: finalResult.convergenceMetrics.converged
      });
      
      return finalResult;
      
    } catch (error) {
      console.error('🚨 確率的状況モデリングエラー:', error);
      const fallbackResult = this.generateFallbackResult(situationalContext, error);
      this.updateStatistics(fallbackResult, false);
      return fallbackResult;
    }
  }

  /**
   * Layer 1: ベイズネットワーク構築
   */
  async layer1_buildBayesianNetwork(situationalContext, historicalData) {
    // ノード定義（状況要因）
    const nodes = {
      temporalStage: {
        states: ['embryonic', 'growth', 'mature', 'transition'],
        parents: [],
        probabilities: this.initializeNodeProbabilities('temporalStage', situationalContext)
      },
      changeVelocity: {
        states: ['slow', 'moderate', 'rapid'],
        parents: ['temporalStage'],
        probabilities: this.initializeConditionalProbabilities('changeVelocity', situationalContext)
      },
      emotionalIntensity: {
        states: ['low', 'medium', 'high'],
        parents: ['changeVelocity'],
        probabilities: this.initializeConditionalProbabilities('emotionalIntensity', situationalContext)
      },
      complexityLevel: {
        states: ['simple', 'moderate', 'complex'],
        parents: ['temporalStage', 'emotionalIntensity'],
        probabilities: this.initializeConditionalProbabilities('complexityLevel', situationalContext)
      }
    };
    
    // エッジ定義（因果関係）
    const edges = [
      { from: 'temporalStage', to: 'changeVelocity' },
      { from: 'changeVelocity', to: 'emotionalIntensity' },
      { from: 'temporalStage', to: 'complexityLevel' },
      { from: 'emotionalIntensity', to: 'complexityLevel' }
    ];
    
    // 歴史データによる事前分布の更新
    if (historicalData.length > 0) {
      this.updatePriorBeliefs(nodes, historicalData);
    }
    
    return {
      nodes: nodes,
      edges: edges,
      jointProbability: this.calculateJointProbability(nodes),
      conditionalIndependencies: this.identifyConditionalIndependencies(nodes, edges)
    };
  }

  /**
   * Layer 2: 確率分布推定
   */
  async layer2_estimateProbabilityDistributions(situationalContext, bayesianNetwork) {
    const distributions = {};
    
    // 変化速度のベータ分布推定
    distributions.changeVelocity = this.estimateBetaDistribution(
      situationalContext.temporalDynamics?.changeVelocity?.score || 0.5,
      this.priorBeliefs.changeVelocity
    );
    
    // 複雑性のディリクレ分布推定
    distributions.complexity = this.estimateDirichletDistribution(
      this.getComplexityVector(situationalContext),
      this.priorBeliefs.complexityLevel.dirichlet
    );
    
    // 感情強度の正規分布推定
    distributions.emotionalIntensity = this.estimateNormalDistribution(
      situationalContext.emotionalProfile?.emotionalIntensity || 0.5,
      this.priorBeliefs.emotionalIntensity
    );
    
    // 時間的遷移の多項分布
    const currentStage = situationalContext.temporalDynamics?.currentStage?.stage || 'growth';
    distributions.temporalTransition = {
      type: 'multinomial',
      probabilities: this.transitionMatrix[currentStage],
      currentState: currentStage
    };
    
    return distributions;
  }

  /**
   * Layer 3: モンテカルロシミュレーション
   */
  async layer3_monteCarloSimulation(probabilityDistributions, situationalContext) {
    const simulations = [];
    
    for (let i = 0; i < this.simulationCount; i++) {
      const scenario = {
        id: i,
        // 変化速度のサンプリング
        changeVelocity: this.sampleFromBeta(probabilityDistributions.changeVelocity),
        
        // 複雑性のサンプリング
        complexity: this.sampleFromDirichlet(probabilityDistributions.complexity),
        
        // 感情強度のサンプリング
        emotionalIntensity: this.sampleFromNormal(probabilityDistributions.emotionalIntensity),
        
        // 時間的遷移のサンプリング
        futureStage: this.sampleFromMultinomial(probabilityDistributions.temporalTransition),
        
        // シナリオの総合評価
        scenarioLikelihood: 0,
        scenarioImpact: 0
      };
      
      // シナリオの尤度計算
      scenario.scenarioLikelihood = this.calculateScenarioLikelihood(scenario, probabilityDistributions);
      
      // シナリオの影響度計算
      scenario.scenarioImpact = this.calculateScenarioImpact(scenario, situationalContext);
      
      simulations.push(scenario);
    }
    
    // シミュレーション結果の統計分析
    return {
      scenarios: simulations,
      statistics: this.analyzeSimulationStatistics(simulations),
      clusters: this.clusterScenarios(simulations),
      outliers: this.detectOutlierScenarios(simulations)
    };
  }

  /**
   * Layer 4: 変卦確率計算
   */
  async layer4_calculateChangeProbabilities(simulations, hexagramMapping) {
    const currentHexagram = hexagramMapping.primaryHexagram?.hexagram_id || 1;
    const changeProbabilities = new Map();
    
    // 各シナリオでの変卦を予測
    simulations.scenarios.forEach(scenario => {
      const predictedChange = this.predictHexagramChange(scenario, currentHexagram);
      
      if (!changeProbabilities.has(predictedChange.targetHexagram)) {
        changeProbabilities.set(predictedChange.targetHexagram, {
          hexagram: predictedChange.targetHexagram,
          probability: 0,
          scenarios: []
        });
      }
      
      const entry = changeProbabilities.get(predictedChange.targetHexagram);
      entry.probability += scenario.scenarioLikelihood / simulations.scenarios.length;
      entry.scenarios.push(scenario.id);
    });
    
    // 確率の高い順にソート
    const sortedChanges = Array.from(changeProbabilities.values())
      .sort((a, b) => b.probability - a.probability);
    
    return {
      currentHexagram: currentHexagram,
      changeProbabilities: sortedChanges,
      mostLikelyChange: sortedChanges[0],
      changeEntropy: this.calculateChangeEntropy(sortedChanges),
      stabilityProbability: this.calculateStabilityProbability(sortedChanges, currentHexagram)
    };
  }

  /**
   * Layer 5: 不確実性分析
   */
  async layer5_uncertaintyAnalysis(modelingLayers) {
    const simulations = modelingLayers.simulations;
    const distributions = modelingLayers.probabilityDistributions;
    
    return {
      // パラメータ不確実性
      parameterUncertainty: {
        changeVelocity: this.calculateDistributionEntropy(distributions.changeVelocity),
        complexity: this.calculateDistributionEntropy(distributions.complexity),
        emotionalIntensity: this.calculateDistributionEntropy(distributions.emotionalIntensity)
      },
      
      // モデル不確実性
      modelUncertainty: {
        scenarioDispersion: this.calculateScenarioDispersion(simulations.scenarios),
        predictionVariance: this.calculatePredictionVariance(simulations.scenarios)
      },
      
      // 総合不確実性
      overallUncertainty: this.calculateOverallUncertainty(simulations),
      
      // 信頼区間
      confidenceIntervals: {
        changeVelocity: this.calculateConfidenceInterval(simulations.scenarios, 'changeVelocity'),
        complexity: this.calculateConfidenceInterval(simulations.scenarios, 'complexity'),
        emotionalIntensity: this.calculateConfidenceInterval(simulations.scenarios, 'emotionalIntensity')
      },
      
      // 感度分析
      sensitivityAnalysis: this.performSensitivityAnalysis(modelingLayers)
    };
  }

  /**
   * Layer 6: リスク・機会評価
   */
  async layer6_riskOpportunityAssessment(modelingLayers, situationalContext) {
    const scenarios = modelingLayers.simulations.scenarios;
    const risks = [];
    const opportunities = [];
    
    // 各シナリオのリスク・機会評価
    scenarios.forEach(scenario => {
      const assessment = this.assessScenarioRiskOpportunity(scenario, situationalContext);
      
      if (assessment.risk > 0) {
        risks.push({
          scenario: scenario.id,
          riskLevel: assessment.risk,
          probability: scenario.scenarioLikelihood,
          impact: assessment.riskImpact,
          type: assessment.riskType
        });
      }
      
      if (assessment.opportunity > 0) {
        opportunities.push({
          scenario: scenario.id,
          opportunityLevel: assessment.opportunity,
          probability: scenario.scenarioLikelihood,
          benefit: assessment.opportunityBenefit,
          type: assessment.opportunityType
        });
      }
    });
    
    // リスク・機会の集計と分析
    return {
      risks: {
        identified: risks,
        aggregatedRisk: this.aggregateRisks(risks),
        riskProfile: this.createRiskProfile(risks),
        mitigationStrategies: this.suggestMitigationStrategies(risks)
      },
      opportunities: {
        identified: opportunities,
        aggregatedOpportunity: this.aggregateOpportunities(opportunities),
        opportunityProfile: this.createOpportunityProfile(opportunities),
        exploitationStrategies: this.suggestExploitationStrategies(opportunities)
      },
      riskOpportunityBalance: this.calculateRiskOpportunityBalance(risks, opportunities),
      strategicRecommendations: this.generateStrategicRecommendations(risks, opportunities)
    };
  }

  // ============ ヘルパーメソッド群 ============

  /**
   * ノード確率の初期化
   */
  initializeNodeProbabilities(nodeName, situationalContext) {
    // 簡易的な初期確率設定
    if (nodeName === 'temporalStage') {
      const currentStage = situationalContext.temporalDynamics?.currentStage?.stage || 'growth';
      const probs = { embryonic: 0.25, growth: 0.25, mature: 0.25, transition: 0.25 };
      probs[currentStage] = 0.7;
      return probs;
    }
    return { default: 1.0 };
  }

  /**
   * 条件付き確率の初期化
   */
  initializeConditionalProbabilities(nodeName, situationalContext) {
    // 簡易的な条件付き確率テーブル
    return {
      default: {
        low: 0.33,
        medium: 0.34,
        high: 0.33
      }
    };
  }

  /**
   * ベータ分布の推定
   */
  estimateBetaDistribution(observation, prior) {
    // ベイズ更新
    const alpha = prior.alpha + observation * 10;
    const beta = prior.beta + (1 - observation) * 10;
    
    return {
      type: 'beta',
      alpha: alpha,
      beta: beta,
      mean: alpha / (alpha + beta),
      variance: (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))
    };
  }

  /**
   * ディリクレ分布の推定
   */
  estimateDirichletDistribution(observations, prior) {
    const alpha = prior.map((p, i) => p + (observations[i] || 0) * 10);
    const alphaSum = alpha.reduce((sum, a) => sum + a, 0);
    
    return {
      type: 'dirichlet',
      alpha: alpha,
      mean: alpha.map(a => a / alphaSum),
      concentration: alphaSum
    };
  }

  /**
   * 正規分布の推定
   */
  estimateNormalDistribution(observation, prior) {
    // ベイズ更新（簡易版）
    const posteriorMean = (prior.mean + observation) / 2;
    const posteriorVariance = prior.variance * 0.8;
    
    return {
      type: 'normal',
      mean: posteriorMean,
      variance: posteriorVariance,
      stdDev: Math.sqrt(posteriorVariance)
    };
  }

  /**
   * ベータ分布からのサンプリング
   */
  sampleFromBeta(distribution) {
    // Box-Muller変換を使用した簡易サンプリング
    // 実際の実装ではより精密なアルゴリズムを使用
    const u1 = Math.random();
    const u2 = Math.random();
    const sample = (distribution.alpha - 1) / (distribution.alpha + distribution.beta - 2) + 
                  Math.sqrt(distribution.variance) * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return Math.max(0, Math.min(1, sample));
  }

  /**
   * シナリオ尤度の計算
   */
  calculateScenarioLikelihood(scenario, distributions) {
    let likelihood = 1.0;
    
    // 各パラメータの尤度を掛け合わせる
    likelihood *= this.getBetaLikelihood(scenario.changeVelocity, distributions.changeVelocity);
    likelihood *= this.getNormalLikelihood(scenario.emotionalIntensity, distributions.emotionalIntensity);
    
    return likelihood;
  }

  /**
   * シナリオ影響度の計算
   */
  calculateScenarioImpact(scenario, situationalContext) {
    let impact = 0;
    
    // 変化速度による影響
    impact += scenario.changeVelocity * 0.3;
    
    // 複雑性による影響
    const maxComplexity = Math.max(...Object.values(scenario.complexity));
    impact += maxComplexity * 0.4;
    
    // 感情強度による影響
    impact += scenario.emotionalIntensity * 0.3;
    
    return Math.min(impact, 1.0);
  }

  /**
   * 易経変化の予測
   */
  predictHexagramChange(scenario, currentHexagram) {
    // 簡易的な変化予測ロジック
    let targetHexagram = currentHexagram;
    
    if (scenario.changeVelocity > 0.7) {
      // 急速な変化の場合、大きく変わる
      targetHexagram = ((currentHexagram + 32) % 64) || 64;
    } else if (scenario.changeVelocity > 0.4) {
      // 中程度の変化
      targetHexagram = ((currentHexagram + 8) % 64) || 64;
    }
    
    return {
      targetHexagram: targetHexagram,
      changeType: scenario.changeVelocity > 0.7 ? 'major' : 'minor'
    };
  }

  /**
   * 統合確率モデルの生成
   */
  async generateIntegratedProbabilisticModel(modelingLayers, situationalContext, hexagramMapping) {
    const simulations = modelingLayers.simulations;
    const uncertaintyAnalysis = modelingLayers.uncertaintyAnalysis;
    
    // 最も可能性の高いシナリオ
    const mostLikelyScenario = simulations.scenarios
      .sort((a, b) => b.scenarioLikelihood - a.scenarioLikelihood)[0];
    
    // 収束性の評価
    const convergenceMetrics = this.evaluateConvergence(simulations.scenarios);
    
    return {
      probabilityDistributions: modelingLayers.probabilityDistributions,
      scenarioSimulations: {
        totalScenarios: simulations.scenarios.length,
        scenarios: simulations.scenarios.slice(0, 10), // 上位10シナリオ
        statistics: simulations.statistics,
        clusters: simulations.clusters
      },
      changeProbabilities: modelingLayers.changeProbabilities,
      uncertaintyMetrics: uncertaintyAnalysis,
      riskOpportunityMatrix: modelingLayers.riskOpportunityAssessment,
      mostLikelyScenario: mostLikelyScenario,
      confidenceIntervals: uncertaintyAnalysis.confidenceIntervals,
      bayesianInsights: this.generateBayesianInsights(modelingLayers),
      modelConfidence: this.calculateModelConfidence(convergenceMetrics, uncertaintyAnalysis),
      convergenceMetrics: convergenceMetrics
    };
  }

  /**
   * ベイズ推論による洞察生成
   */
  generateBayesianInsights(modelingLayers) {
    const insights = [];
    
    const uncertainty = modelingLayers.uncertaintyAnalysis.overallUncertainty;
    if (uncertainty > 0.7) {
      insights.push('高い不確実性が検出されました。慎重な判断が必要です。');
    }
    
    const changeProbability = modelingLayers.changeProbabilities.mostLikelyChange?.probability || 0;
    if (changeProbability > 0.6) {
      insights.push('状況の変化が高い確率で予測されます。変化への準備が重要です。');
    }
    
    return insights;
  }

  /**
   * モデル信頼度の計算
   */
  calculateModelConfidence(convergenceMetrics, uncertaintyAnalysis) {
    let confidence = 0.5;
    
    if (convergenceMetrics.converged) confidence += 0.3;
    if (uncertaintyAnalysis.overallUncertainty < 0.5) confidence += 0.2;
    
    return Math.min(confidence, 0.95);
  }

  // 簡易実装メソッド群
  getComplexityVector(situationalContext) {
    const complexity = situationalContext.virtualSituation?.complexityLevel || 'moderate';
    const vector = [0, 0, 0];
    if (complexity === 'simple') vector[0] = 1;
    else if (complexity === 'moderate') vector[1] = 1;
    else vector[2] = 1;
    return vector;
  }
  
  updatePriorBeliefs(nodes, historicalData) {
    // 簡易実装：履歴データによる事前分布の更新
    console.log('履歴データによる事前分布更新');
  }
  
  calculateJointProbability(nodes) {
    // 簡易実装：同時確率の計算
    return 0.5;
  }
  
  identifyConditionalIndependencies(nodes, edges) {
    // 簡易実装：条件付き独立性の特定
    return [];
  }
  
  sampleFromDirichlet(distribution) {
    // 簡易実装：ディリクレ分布からのサンプリング
    const sample = distribution.mean.map(m => m + (Math.random() - 0.5) * 0.1);
    const sum = sample.reduce((s, v) => s + v, 0);
    return sample.map(v => v / sum);
  }
  
  sampleFromNormal(distribution) {
    // Box-Muller変換
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return distribution.mean + z0 * distribution.stdDev;
  }
  
  sampleFromMultinomial(distribution) {
    const r = Math.random();
    let cumSum = 0;
    for (const [state, prob] of Object.entries(distribution.probabilities)) {
      cumSum += prob;
      if (r <= cumSum) return state;
    }
    return distribution.currentState;
  }
  
  analyzeSimulationStatistics(simulations) {
    return {
      meanChangeVelocity: simulations.reduce((sum, s) => sum + s.changeVelocity, 0) / simulations.length,
      meanEmotionalIntensity: simulations.reduce((sum, s) => sum + s.emotionalIntensity, 0) / simulations.length,
      scenarioVariability: this.calculateVariability(simulations)
    };
  }
  
  clusterScenarios(simulations) {
    // 簡易クラスタリング
    return {
      highChange: simulations.filter(s => s.changeVelocity > 0.7),
      moderate: simulations.filter(s => s.changeVelocity >= 0.3 && s.changeVelocity <= 0.7),
      stable: simulations.filter(s => s.changeVelocity < 0.3)
    };
  }
  
  detectOutlierScenarios(simulations) {
    // 簡易外れ値検出
    const threshold = 0.1;
    return simulations.filter(s => s.scenarioLikelihood < threshold);
  }
  
  calculateChangeEntropy(changeProbabilities) {
    let entropy = 0;
    changeProbabilities.forEach(change => {
      if (change.probability > 0) {
        entropy -= change.probability * Math.log2(change.probability);
      }
    });
    return entropy;
  }
  
  calculateStabilityProbability(changeProbabilities, currentHexagram) {
    const stayProb = changeProbabilities.find(c => c.hexagram === currentHexagram);
    return stayProb ? stayProb.probability : 0.3;
  }
  
  calculateDistributionEntropy(distribution) {
    // 簡易エントロピー計算
    if (distribution.type === 'beta') {
      return 0.5 * Math.log(2 * Math.PI * Math.E * distribution.variance);
    }
    return 0.5;
  }
  
  calculateScenarioDispersion(scenarios) {
    // シナリオの分散度
    const likelihoods = scenarios.map(s => s.scenarioLikelihood);
    const mean = likelihoods.reduce((sum, l) => sum + l, 0) / likelihoods.length;
    const variance = likelihoods.reduce((sum, l) => sum + (l - mean) ** 2, 0) / likelihoods.length;
    return Math.sqrt(variance);
  }
  
  calculatePredictionVariance(scenarios) {
    return this.calculateScenarioDispersion(scenarios) * 0.8;
  }
  
  calculateOverallUncertainty(simulations) {
    const dispersion = this.calculateScenarioDispersion(simulations.scenarios);
    return Math.min(dispersion * 2, 1.0);
  }
  
  calculateConfidenceInterval(scenarios, parameter) {
    const values = scenarios.map(s => s[parameter]).sort((a, b) => a - b);
    const lower = values[Math.floor(values.length * 0.025)];
    const upper = values[Math.floor(values.length * 0.975)];
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    
    return {
      lower95: lower,
      upper95: upper,
      mean: mean,
      median: values[Math.floor(values.length / 2)]
    };
  }
  
  performSensitivityAnalysis(modelingLayers) {
    return {
      changeVelocitySensitivity: 0.7,
      complexitySensitivity: 0.5,
      emotionalIntensitySensitivity: 0.6
    };
  }
  
  assessScenarioRiskOpportunity(scenario, situationalContext) {
    const assessment = {
      risk: 0,
      riskImpact: 0,
      riskType: 'none',
      opportunity: 0,
      opportunityBenefit: 0,
      opportunityType: 'none'
    };
    
    // リスク評価
    if (scenario.changeVelocity > 0.8 && scenario.emotionalIntensity > 0.7) {
      assessment.risk = 0.7;
      assessment.riskImpact = 0.8;
      assessment.riskType = 'rapid_change';
    }
    
    // 機会評価
    if (scenario.futureStage === 'growth' && scenario.changeVelocity > 0.5) {
      assessment.opportunity = 0.6;
      assessment.opportunityBenefit = 0.7;
      assessment.opportunityType = 'growth_potential';
    }
    
    return assessment;
  }
  
  aggregateRisks(risks) {
    if (risks.length === 0) return 0;
    return risks.reduce((sum, r) => sum + r.riskLevel * r.probability, 0) / risks.length;
  }
  
  aggregateOpportunities(opportunities) {
    if (opportunities.length === 0) return 0;
    return opportunities.reduce((sum, o) => sum + o.opportunityLevel * o.probability, 0) / opportunities.length;
  }
  
  createRiskProfile(risks) {
    return {
      highRisks: risks.filter(r => r.riskLevel > 0.7),
      moderateRisks: risks.filter(r => r.riskLevel >= 0.3 && r.riskLevel <= 0.7),
      lowRisks: risks.filter(r => r.riskLevel < 0.3)
    };
  }
  
  createOpportunityProfile(opportunities) {
    return {
      highOpportunities: opportunities.filter(o => o.opportunityLevel > 0.7),
      moderateOpportunities: opportunities.filter(o => o.opportunityLevel >= 0.3 && o.opportunityLevel <= 0.7),
      lowOpportunities: opportunities.filter(o => o.opportunityLevel < 0.3)
    };
  }
  
  suggestMitigationStrategies(risks) {
    const strategies = [];
    if (risks.some(r => r.type === 'rapid_change')) {
      strategies.push('変化速度の調整と段階的アプローチ');
    }
    return strategies;
  }
  
  suggestExploitationStrategies(opportunities) {
    const strategies = [];
    if (opportunities.some(o => o.type === 'growth_potential')) {
      strategies.push('成長機会の積極的活用');
    }
    return strategies;
  }
  
  calculateRiskOpportunityBalance(risks, opportunities) {
    const totalRisk = this.aggregateRisks(risks);
    const totalOpportunity = this.aggregateOpportunities(opportunities);
    
    return {
      balance: totalOpportunity - totalRisk,
      ratio: totalRisk > 0 ? totalOpportunity / totalRisk : Infinity,
      recommendation: totalOpportunity > totalRisk ? 'opportunity_focused' : 'risk_averse'
    };
  }
  
  generateStrategicRecommendations(risks, opportunities) {
    const recommendations = [];
    
    const balance = this.calculateRiskOpportunityBalance(risks, opportunities);
    if (balance.recommendation === 'opportunity_focused') {
      recommendations.push('機会を活かした積極的な行動が推奨されます');
    } else {
      recommendations.push('リスク管理を重視した慎重な行動が推奨されます');
    }
    
    return recommendations;
  }
  
  getBetaLikelihood(value, distribution) {
    // 簡易ベータ分布尤度
    const { alpha, beta } = distribution;
    return Math.pow(value, alpha - 1) * Math.pow(1 - value, beta - 1);
  }
  
  getNormalLikelihood(value, distribution) {
    // 正規分布尤度
    const { mean, variance } = distribution;
    const exponent = -0.5 * Math.pow((value - mean), 2) / variance;
    return Math.exp(exponent) / Math.sqrt(2 * Math.PI * variance);
  }
  
  calculateVariability(simulations) {
    const likelihoods = simulations.map(s => s.scenarioLikelihood);
    const mean = likelihoods.reduce((sum, l) => sum + l, 0) / likelihoods.length;
    const variance = likelihoods.reduce((sum, l) => sum + (l - mean) ** 2, 0) / likelihoods.length;
    return variance;
  }
  
  evaluateConvergence(scenarios) {
    // 簡易収束評価
    const variability = this.calculateVariability(scenarios);
    return {
      converged: variability < 0.1,
      convergenceRate: 1 - variability,
      iterations: scenarios.length
    };
  }
  
  updateModelLearning(result) {
    this.modelHistory.push({
      timestamp: Date.now(),
      uncertainty: result.uncertaintyMetrics?.overallUncertainty || 0,
      convergence: result.convergenceMetrics?.converged || false
    });
    
    if (this.modelHistory.length > 100) {
      this.modelHistory.shift();
    }
  }
  
  updateStatistics(result, success) {
    this.statistics.totalSimulations += result.scenarioSimulations?.totalScenarios || 0;
    if (success) {
      this.statistics.averageUncertainty = 
        (this.statistics.averageUncertainty * 0.9 + (result.uncertaintyMetrics?.overallUncertainty || 0) * 0.1);
      this.statistics.convergenceRate = 
        (this.statistics.convergenceRate * 0.9 + (result.convergenceMetrics?.convergenceRate || 0) * 0.1);
    }
  }
  
  generateErrorResult(errorMessage) {
    return {
      error: errorMessage,
      modelConfidence: 0,
      qualityMetrics: {
        simulationCount: 0,
        convergenceAchieved: false
      }
    };
  }
  
  generateFallbackResult(situationalContext, error) {
    console.warn('確率モデリングフォールバック実行:', error.message);
    return {
      mostLikelyScenario: {
        changeVelocity: 0.5,
        complexity: { simple: 0.3, moderate: 0.4, complex: 0.3 },
        emotionalIntensity: 0.5
      },
      modelConfidence: 0.3,
      bayesianInsights: ['不確実性が高いため、慎重な判断が必要です'],
      fallback: true,
      error: error.message
    };
  }
}

// グローバル利用のためのエクスポート
window.ProbabilisticSituationModeler = ProbabilisticSituationModeler;