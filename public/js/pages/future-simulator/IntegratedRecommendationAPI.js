// IntegratedRecommendationAPI.js - 統合推奨API
// 行動主導型変化システムの全コンポーネントを統合

/**
 * 統合推奨API
 * 
 * 目的：
 * - 全コンポーネントの統合的活用
 * - 最適な行動推奨の生成
 * - ユーザーフレンドリーな結果提供
 * 
 * 入力：
 * - userContext: ユーザーの現在状況
 * - proposedActions: 検討中の行動リスト
 * - preferences: ユーザー設定
 * 
 * 処理内容：
 * 1. 状況分析
 * 2. 行動評価
 * 3. 変化予測
 * 4. 調和性分析
 * 5. 統合推奨生成
 * 
 * 出力：
 * - recommendations: 統合推奨
 * - visualizationData: 可視化用データ
 * - actionPlan: 実行計画
 * 
 * 副作用：
 * - ログ出力
 * - メトリクス記録
 * - キャッシュ更新
 * 
 * 前提条件：
 * - 全コンポーネントがロード済み
 * - localStorageアクセス可能
 * 
 * エラー処理：
 * - コンポーネント不在：グレースフルデグレード
 * - 計算エラー：フォールバック推奨
 */

class IntegratedRecommendationAPI {
  constructor() {
    this.initializeAPI();
  }

  initializeAPI() {
    console.log("🚀 Initializing Integrated Recommendation API...");
    
    // コンポーネントの初期化
    this.initializeComponents();
    
    // APIエンドポイントの定義
    this.endpoints = this.defineEndpoints();
    
    // キャッシュシステムの初期化
    this.cache = this.initializeCache();
    
    // メトリクスシステムの初期化
    this.metrics = this.initializeMetrics();
    
    // デフォルト設定
    this.defaultSettings = this.defineDefaultSettings();
    
    console.log("✅ Integrated Recommendation API initialized successfully");
  }

  /**
   * コンポーネントの初期化
   */
  initializeComponents() {
    this.components = {};
    
    // 必須コンポーネント
    const requiredComponents = [
      'HexagramActionThemeCatalog',
      'YaoActionDefinitionEngine',
      'UnifiedTransformationEngine',
      'MultiDimensionalPathVisualizer',
      'PersonalityActionHarmonizer'
    ];
    
    // 利用可能なコンポーネントを動的にロード
    for (const componentName of requiredComponents) {
      try {
        if (typeof window !== "undefined" && window[componentName]) {
          this.components[componentName] = new window[componentName]();
          console.log(`✅ Loaded: ${componentName}`);
        } else {
          console.warn(`⚠️ Component not available: ${componentName}`);
        }
      } catch (error) {
        console.error(`❌ Failed to initialize ${componentName}:`, error);
      }
    }
    
    // 利用可能なコンポーネント数をチェック
    const loadedCount = Object.keys(this.components).length;
    console.log(`📊 Loaded ${loadedCount}/${requiredComponents.length} components`);
    
    if (loadedCount === 0) {
      throw new Error("No components available. API cannot function.");
    }
  }

  /**
   * APIエンドポイントの定義
   */
  defineEndpoints() {
    return {
      // メイン推奨エンドポイント
      getRecommendations: {
        method: 'POST',
        path: '/api/recommendations',
        handler: this.getRecommendations.bind(this)
      },
      
      // 行動評価エンドポイント
      evaluateAction: {
        method: 'POST',
        path: '/api/evaluate-action',
        handler: this.evaluateAction.bind(this)
      },
      
      // 変化予測エンドポイント
      predictTransformations: {
        method: 'POST',
        path: '/api/predict-transformations',
        handler: this.predictTransformations.bind(this)
      },
      
      // 調和性分析エンドポイント
      analyzeHarmony: {
        method: 'POST',
        path: '/api/analyze-harmony',
        handler: this.analyzeHarmony.bind(this)
      },
      
      // 可視化データエンドポイント
      getVisualizationData: {
        method: 'POST',
        path: '/api/visualization-data',
        handler: this.getVisualizationData.bind(this)
      },
      
      // 実行計画生成エンドポイント
      generateActionPlan: {
        method: 'POST',
        path: '/api/action-plan',
        handler: this.generateActionPlan.bind(this)
      }
    };
  }

  /**
   * キャッシュシステムの初期化
   */
  initializeCache() {
    return {
      recommendations: new Map(),
      transformations: new Map(),
      harmonyAnalysis: new Map(),
      ttl: 3600000, // 1時間
      maxSize: 100,
      
      get: (key) => {
        const cached = this.cache.recommendations.get(key);
        if (cached && Date.now() - cached.timestamp < this.cache.ttl) {
          return cached.data;
        }
        return null;
      },
      
      set: (key, data) => {
        // サイズ制限チェック
        if (this.cache.recommendations.size >= this.cache.maxSize) {
          const firstKey = this.cache.recommendations.keys().next().value;
          this.cache.recommendations.delete(firstKey);
        }
        
        this.cache.recommendations.set(key, {
          data,
          timestamp: Date.now()
        });
      },
      
      clear: () => {
        this.cache.recommendations.clear();
        this.cache.transformations.clear();
        this.cache.harmonyAnalysis.clear();
      }
    };
  }

  /**
   * メトリクスシステムの初期化
   */
  initializeMetrics() {
    return {
      apiCalls: 0,
      successfulRecommendations: 0,
      errors: 0,
      avgResponseTime: 0,
      userSatisfaction: [],
      
      record: (metric, value) => {
        this.metrics[metric] = value;
        this.saveMetricsToStorage();
      },
      
      increment: (metric) => {
        this.metrics[metric]++;
        this.saveMetricsToStorage();
      },
      
      getReport: () => {
        return {
          totalCalls: this.metrics.apiCalls,
          successRate: this.metrics.apiCalls > 0 
            ? this.metrics.successfulRecommendations / this.metrics.apiCalls 
            : 0,
          avgResponseTime: this.metrics.avgResponseTime,
          avgSatisfaction: this.metrics.userSatisfaction.length > 0
            ? this.metrics.userSatisfaction.reduce((a, b) => a + b, 0) / this.metrics.userSatisfaction.length
            : 0
        };
      }
    };
  }

  /**
   * デフォルト設定の定義
   */
  defineDefaultSettings() {
    return {
      // 推奨設定
      recommendation: {
        maxActions: 5,          // 最大推奨行動数
        minConfidence: 0.3,     // 最小信頼度
        includeAlternatives: true,
        personalityWeight: 0.7,
        contextWeight: 0.3
      },
      
      // 変化予測設定
      transformation: {
        includeAllTypes: true,
        minProbability: 0.05,
        timeHorizon: "medium",  // short, medium, long
        simulationRuns: 100
      },
      
      // 可視化設定
      visualization: {
        defaultMode: "tree",
        animated: true,
        showProbabilities: true,
        showDescriptions: true,
        highlightTopPath: true
      },
      
      // パフォーマンス設定
      performance: {
        enableCache: true,
        cacheTimeout: 3600000,
        maxConcurrentRequests: 3,
        timeout: 30000
      }
    };
  }

  // =============== メインAPIメソッド ===============

  /**
   * 統合推奨の取得
   */
  async getRecommendations(request) {
    const startTime = Date.now();
    this.metrics.increment('apiCalls');
    
    try {
      console.log("📋 Processing recommendation request...");
      
      // リクエストの検証
      const validatedRequest = this.validateRequest(request);
      
      // キャッシュチェック
      const cacheKey = this.generateCacheKey(validatedRequest);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log("📦 Returning cached recommendation");
        return cached;
      }
      
      // 1. 現在状況の分析
      const situationAnalysis = await this.analyzeSituation(validatedRequest.userContext);
      
      // 2. 提案された行動の評価
      const actionEvaluations = await this.evaluateProposedActions(
        validatedRequest.proposedActions,
        situationAnalysis
      );
      
      // 3. 変化予測の実行
      const transformationPredictions = await this.predictAllTransformations(
        situationAnalysis,
        actionEvaluations
      );
      
      // 4. 人格との調和性分析
      const harmonyAnalyses = await this.analyzeAllHarmony(
        validatedRequest.userContext.personalityProfile,
        actionEvaluations
      );
      
      // 5. 統合推奨の生成
      const integratedRecommendations = this.generateIntegratedRecommendations(
        situationAnalysis,
        actionEvaluations,
        transformationPredictions,
        harmonyAnalyses,
        validatedRequest.preferences
      );
      
      // 6. 可視化データの準備
      const visualizationData = this.prepareVisualizationData(
        integratedRecommendations,
        transformationPredictions
      );
      
      // 7. 実行計画の生成
      const actionPlan = this.createActionPlan(
        integratedRecommendations,
        validatedRequest.userContext
      );
      
      // 結果の構築
      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        recommendations: integratedRecommendations,
        visualizationData: visualizationData,
        actionPlan: actionPlan,
        metadata: {
          processingTime: Date.now() - startTime,
          componentsUsed: Object.keys(this.components),
          confidence: this.calculateOverallConfidence(integratedRecommendations)
        }
      };
      
      // キャッシュに保存
      this.cache.set(cacheKey, result);
      
      // メトリクス更新
      this.metrics.increment('successfulRecommendations');
      this.updateResponseTime(Date.now() - startTime);
      
      console.log(`✅ Recommendations generated in ${Date.now() - startTime}ms`);
      return result;
      
    } catch (error) {
      console.error("❌ Error generating recommendations:", error);
      this.metrics.increment('errors');
      
      return {
        success: false,
        error: error.message,
        recommendations: this.generateFallbackRecommendations(request),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 単一行動の評価
   */
  async evaluateAction(request) {
    try {
      const { action, context } = request;
      
      // 行動テーマの取得
      const actionTheme = this.getActionTheme(context.currentState);
      
      // 爻の行動定義取得
      const yaoDefinition = this.getYaoDefinition(context.currentState);
      
      // 行動との適合度計算
      const compatibility = this.calculateActionCompatibility(
        action,
        actionTheme,
        yaoDefinition
      );
      
      return {
        success: true,
        action: action,
        evaluation: {
          compatibility: compatibility,
          recommendationLevel: this.getRecommendationLevel(compatibility),
          strengths: this.identifyActionStrengths(action, context),
          weaknesses: this.identifyActionWeaknesses(action, context),
          suggestions: this.generateActionSuggestions(action, compatibility)
        }
      };
      
    } catch (error) {
      console.error("❌ Error evaluating action:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 変化予測の実行
   */
  async predictTransformations(request) {
    try {
      const { currentState, selectedAction, personalityProfile, contextData } = request;
      
      if (!this.components.UnifiedTransformationEngine) {
        throw new Error("Transformation engine not available");
      }
      
      const predictions = this.components.UnifiedTransformationEngine.predictTransformations(
        currentState,
        selectedAction,
        personalityProfile,
        contextData
      );
      
      return {
        success: true,
        predictions: predictions,
        summary: this.summarizeTransformations(predictions)
      };
      
    } catch (error) {
      console.error("❌ Error predicting transformations:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 調和性分析の実行
   */
  async analyzeHarmony(request) {
    try {
      const { personalityProfile, proposedAction, contextualFactors } = request;
      
      if (!this.components.PersonalityActionHarmonizer) {
        throw new Error("Harmony analyzer not available");
      }
      
      const analysis = this.components.PersonalityActionHarmonizer.analyzeHarmony(
        personalityProfile,
        proposedAction,
        contextualFactors
      );
      
      return {
        success: true,
        analysis: analysis,
        summary: this.summarizeHarmonyAnalysis(analysis)
      };
      
    } catch (error) {
      console.error("❌ Error analyzing harmony:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 可視化データの取得
   */
  async getVisualizationData(request) {
    try {
      const { transformationResult, options } = request;
      
      const visualizationData = {
        nodes: this.extractNodes(transformationResult),
        edges: this.extractEdges(transformationResult),
        layout: this.calculateLayout(transformationResult, options),
        styles: this.generateStyles(transformationResult, options),
        interactions: this.defineInteractions(options)
      };
      
      return {
        success: true,
        data: visualizationData,
        recommendedView: this.recommendVisualizationMode(transformationResult)
      };
      
    } catch (error) {
      console.error("❌ Error generating visualization data:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 実行計画の生成
   */
  async generateActionPlan(request) {
    try {
      const { recommendation, context, timeline } = request;
      
      const actionPlan = {
        overview: this.createPlanOverview(recommendation, timeline),
        phases: this.definePlanPhases(recommendation, context),
        milestones: this.setMilestones(recommendation, timeline),
        riskMitigation: this.identifyRisks(recommendation, context),
        successCriteria: this.defineSuccessCriteria(recommendation),
        monitoringPlan: this.createMonitoringPlan(recommendation, timeline)
      };
      
      return {
        success: true,
        plan: actionPlan,
        exportFormats: ["pdf", "json", "markdown"]
      };
      
    } catch (error) {
      console.error("❌ Error generating action plan:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =============== 内部処理メソッド ===============

  /**
   * リクエストの検証
   */
  validateRequest(request) {
    if (!request.userContext) {
      throw new Error("User context is required");
    }
    
    if (!request.proposedActions || request.proposedActions.length === 0) {
      throw new Error("At least one proposed action is required");
    }
    
    // デフォルト値の設定
    return {
      userContext: {
        currentState: request.userContext.currentState || { hexagram: 1, yao: 1 },
        personalityProfile: request.userContext.personalityProfile || this.getDefaultPersonality(),
        contextualFactors: request.userContext.contextualFactors || {}
      },
      proposedActions: request.proposedActions.slice(0, this.defaultSettings.recommendation.maxActions),
      preferences: {
        ...this.defaultSettings,
        ...request.preferences
      }
    };
  }

  /**
   * 状況分析
   */
  async analyzeSituation(userContext) {
    const { currentState, contextualFactors } = userContext;
    
    // 現在の卦と爻の意味
    const hexagramMeaning = this.getHexagramMeaning(currentState.hexagram);
    const yaoMeaning = this.getYaoMeaning(currentState.hexagram, currentState.yao);
    
    // 状況の分類
    const situationType = this.classifySituation(contextualFactors);
    
    // 変化の必要性
    const changeNeed = this.assessChangeNeed(currentState, contextualFactors);
    
    return {
      currentState,
      hexagramMeaning,
      yaoMeaning,
      situationType,
      changeNeed,
      opportunities: this.identifyOpportunities(currentState, contextualFactors),
      challenges: this.identifyChallenges(currentState, contextualFactors)
    };
  }

  /**
   * 提案行動の評価
   */
  async evaluateProposedActions(proposedActions, situationAnalysis) {
    const evaluations = [];
    
    for (const action of proposedActions) {
      const evaluation = {
        action: action,
        compatibility: this.evaluateActionCompatibility(action, situationAnalysis),
        transformationPotential: this.assessTransformationPotential(action, situationAnalysis),
        riskLevel: this.assessActionRisk(action, situationAnalysis),
        effortRequired: this.estimateEffort(action),
        timeline: this.estimateTimeline(action)
      };
      
      evaluation.overallScore = this.calculateActionScore(evaluation);
      evaluations.push(evaluation);
    }
    
    // スコア順にソート
    evaluations.sort((a, b) => b.overallScore - a.overallScore);
    
    return evaluations;
  }

  /**
   * 全変化予測の実行
   */
  async predictAllTransformations(situationAnalysis, actionEvaluations) {
    if (!this.components.UnifiedTransformationEngine) {
      return [];
    }
    
    const predictions = [];
    
    for (const evaluation of actionEvaluations) {
      try {
        const prediction = this.components.UnifiedTransformationEngine.predictTransformations(
          situationAnalysis.currentState,
          evaluation.action,
          situationAnalysis.personalityProfile,
          situationAnalysis.contextualFactors
        );
        
        predictions.push({
          action: evaluation.action,
          prediction: prediction,
          confidence: this.calculatePredictionConfidence(prediction)
        });
      } catch (error) {
        console.warn(`Failed to predict transformation for action: ${evaluation.action}`, error);
      }
    }
    
    return predictions;
  }

  /**
   * 全調和性分析の実行
   */
  async analyzeAllHarmony(personalityProfile, actionEvaluations) {
    if (!this.components.PersonalityActionHarmonizer) {
      return [];
    }
    
    const analyses = [];
    
    for (const evaluation of actionEvaluations) {
      try {
        const analysis = this.components.PersonalityActionHarmonizer.analyzeHarmony(
          personalityProfile,
          evaluation.action,
          evaluation.contextualFactors
        );
        
        analyses.push({
          action: evaluation.action,
          harmony: analysis,
          isHarmonious: analysis.harmonyScore.overall >= 0.6
        });
      } catch (error) {
        console.warn(`Failed to analyze harmony for action: ${evaluation.action}`, error);
      }
    }
    
    return analyses;
  }

  /**
   * 統合推奨の生成
   */
  generateIntegratedRecommendations(
    situationAnalysis,
    actionEvaluations,
    transformationPredictions,
    harmonyAnalyses,
    preferences
  ) {
    const recommendations = [];
    
    // 各行動について統合評価
    for (const evaluation of actionEvaluations) {
      const transformation = transformationPredictions.find(p => p.action === evaluation.action);
      const harmony = harmonyAnalyses.find(h => h.action === evaluation.action);
      
      const integratedScore = this.calculateIntegratedScore(
        evaluation,
        transformation,
        harmony,
        preferences
      );
      
      if (integratedScore >= preferences.recommendation.minConfidence) {
        recommendations.push({
          action: evaluation.action,
          score: integratedScore,
          reasoning: this.generateRecommendationReasoning(
            evaluation,
            transformation,
            harmony,
            situationAnalysis
          ),
          benefits: this.identifyBenefits(evaluation, transformation, harmony),
          risks: this.identifyRisks(evaluation, transformation, harmony),
          implementation: this.generateImplementationGuide(
            evaluation.action,
            harmony?.harmony.harmonizedActions
          ),
          alternativeApproaches: harmony?.harmony.harmonizedActions || [],
          transformationPaths: transformation?.prediction.transformationPaths || [],
          confidence: integratedScore
        });
      }
    }
    
    // 信頼度順にソート
    recommendations.sort((a, b) => b.score - a.score);
    
    // 上位N件を返す
    return recommendations.slice(0, preferences.recommendation.maxActions);
  }

  /**
   * 可視化データの準備
   */
  prepareVisualizationData(recommendations, transformationPredictions) {
    const visualizationData = {
      primaryRecommendation: null,
      alternativeViews: [],
      interactiveElements: []
    };
    
    if (recommendations.length > 0) {
      const topRecommendation = recommendations[0];
      const topTransformation = transformationPredictions.find(
        p => p.action === topRecommendation.action
      );
      
      if (topTransformation) {
        visualizationData.primaryRecommendation = {
          transformationResult: topTransformation.prediction,
          displayOptions: this.defaultSettings.visualization,
          focusElements: this.identifyFocusElements(topTransformation.prediction)
        };
      }
    }
    
    // 代替ビューの準備
    visualizationData.alternativeViews = [
      {
        name: "比較ビュー",
        type: "comparison",
        data: this.prepareComparisonView(recommendations)
      },
      {
        name: "タイムラインビュー",
        type: "timeline",
        data: this.prepareTimelineView(recommendations)
      },
      {
        name: "インパクトマトリックス",
        type: "matrix",
        data: this.prepareImpactMatrix(recommendations)
      }
    ];
    
    return visualizationData;
  }

  /**
   * 実行計画の作成
   */
  createActionPlan(recommendations, userContext) {
    if (recommendations.length === 0) {
      return {
        status: "no_recommendations",
        message: "実行可能な推奨事項がありません"
      };
    }
    
    const primaryRecommendation = recommendations[0];
    
    return {
      executive_summary: this.createExecutiveSummary(primaryRecommendation, userContext),
      
      immediate_actions: this.defineImmediateActions(primaryRecommendation),
      
      phased_implementation: this.createPhasedImplementation(
        primaryRecommendation,
        userContext
      ),
      
      success_metrics: this.defineSuccessMetrics(primaryRecommendation),
      
      risk_management: this.createRiskManagementPlan(
        primaryRecommendation.risks,
        userContext
      ),
      
      support_resources: this.identifySupportResources(
        primaryRecommendation,
        userContext
      ),
      
      review_schedule: this.createReviewSchedule(primaryRecommendation.timeline),
      
      contingency_plans: this.createContingencyPlans(
        primaryRecommendation,
        recommendations.slice(1, 3) // 代替案
      )
    };
  }

  // =============== ユーティリティメソッド ===============

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(request) {
    const key = JSON.stringify({
      currentState: request.userContext.currentState,
      actions: request.proposedActions.sort(),
      personality: request.userContext.personalityProfile.tripleOS
    });
    
    // 簡易ハッシュ
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return `rec_${Math.abs(hash)}`;
  }

  /**
   * レスポンスタイムの更新
   */
  updateResponseTime(responseTime) {
    const current = this.metrics.avgResponseTime;
    const count = this.metrics.apiCalls;
    
    this.metrics.avgResponseTime = (current * (count - 1) + responseTime) / count;
  }

  /**
   * 全体的な信頼度の計算
   */
  calculateOverallConfidence(recommendations) {
    if (recommendations.length === 0) return 0;
    
    const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;
    const topConfidence = recommendations[0].confidence;
    
    return topConfidence * 0.7 + avgConfidence * 0.3;
  }

  /**
   * フォールバック推奨の生成
   */
  generateFallbackRecommendations(request) {
    return [{
      action: "現状維持と観察",
      score: 0.5,
      reasoning: "システムエラーのため、慎重なアプローチを推奨",
      benefits: ["リスク最小化", "状況の明確化"],
      risks: ["機会損失の可能性"],
      implementation: {
        steps: ["状況の記録", "小さな実験", "フィードバック収集"]
      },
      confidence: 0.3
    }];
  }

  /**
   * デフォルト人格プロファイル
   */
  getDefaultPersonality() {
    return {
      tripleOS: {
        engineOS: 0.33,
        interfaceOS: 0.33,
        safeModeOS: 0.34
      },
      coreValues: ["成長", "調和", "安定"],
      behaviorHistory: []
    };
  }

  /**
   * 統合スコアの計算
   */
  calculateIntegratedScore(evaluation, transformation, harmony, preferences) {
    let score = 0;
    let weights = 0;
    
    // 基本評価スコア
    if (evaluation) {
      score += evaluation.overallScore * 0.3;
      weights += 0.3;
    }
    
    // 変化予測の信頼度
    if (transformation && transformation.confidence) {
      score += transformation.confidence * 0.3;
      weights += 0.3;
    }
    
    // 調和性スコア
    if (harmony && harmony.harmony) {
      const harmonyWeight = preferences.personalityWeight || 0.4;
      score += harmony.harmony.harmonyScore.overall * harmonyWeight;
      weights += harmonyWeight;
    }
    
    return weights > 0 ? score / weights : 0;
  }

  /**
   * 推奨理由の生成
   */
  generateRecommendationReasoning(evaluation, transformation, harmony, situation) {
    const reasons = [];
    
    // 状況適合性
    if (evaluation.compatibility > 0.7) {
      reasons.push(`現在の状況（${situation.hexagramMeaning.brief}）に適した行動`);
    }
    
    // 変化の可能性
    if (transformation && transformation.prediction.transformationPaths.length > 0) {
      const topPath = transformation.prediction.transformationPaths[0];
      reasons.push(`${topPath.type}による${topPath.description}が期待可能`);
    }
    
    // 人格との調和
    if (harmony && harmony.isHarmonious) {
      reasons.push("個人の特性と調和した自然な行動");
    }
    
    return reasons.join("。");
  }

  /**
   * 実装ガイドの生成
   */
  generateImplementationGuide(action, harmonizedActions) {
    const guide = {
      primaryApproach: {
        action: action,
        steps: this.breakDownActionSteps(action),
        timeline: this.estimateStepTimeline(action),
        keyPoints: this.identifyKeyImplementationPoints(action)
      }
    };
    
    if (harmonizedActions && harmonizedActions.length > 0) {
      guide.alternativeApproaches = harmonizedActions.map(ha => ({
        action: ha.action,
        benefit: ha.description,
        steps: this.breakDownActionSteps(ha.action)
      }));
    }
    
    return guide;
  }

  /**
   * メトリクスの保存
   */
  saveMetricsToStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('haqei_api_metrics', JSON.stringify(this.metrics));
      }
    } catch (error) {
      console.warn("Failed to save metrics:", error);
    }
  }

  /**
   * 公開API: ユーザー満足度の記録
   */
  recordUserSatisfaction(recommendationId, satisfaction) {
    if (satisfaction >= 1 && satisfaction <= 5) {
      this.metrics.userSatisfaction.push(satisfaction);
      
      // 最新100件のみ保持
      if (this.metrics.userSatisfaction.length > 100) {
        this.metrics.userSatisfaction.shift();
      }
      
      this.saveMetricsToStorage();
    }
  }

  /**
   * 公開API: システムステータス
   */
  getSystemStatus() {
    return {
      operational: true,
      componentsStatus: Object.keys(this.components).map(name => ({
        name: name,
        status: "active"
      })),
      metrics: this.metrics.getReport(),
      cacheStatus: {
        size: this.cache.recommendations.size,
        maxSize: this.cache.maxSize
      },
      version: "1.0.0"
    };
  }

  // ヘルパーメソッド（簡易実装）
  getHexagramMeaning(hexagramNumber) {
    return { brief: `卦${hexagramNumber}の意味`, detailed: "詳細な説明" };
  }
  
  getYaoMeaning(hexagramNumber, yaoPosition) {
    return { brief: `${yaoPosition}爻の意味`, detailed: "詳細な説明" };
  }
  
  classifySituation(factors) {
    return factors.urgency > 0.7 ? "urgent" : "normal";
  }
  
  assessChangeNeed(state, factors) {
    return { level: "moderate", reasons: ["成長の機会"] };
  }
  
  identifyOpportunities(state, factors) {
    return ["新しい可能性", "学習機会"];
  }
  
  identifyChallenges(state, factors) {
    return ["リスク管理", "時間制約"];
  }
  
  evaluateActionCompatibility(action, situation) {
    return 0.7 + Math.random() * 0.3;
  }
  
  assessTransformationPotential(action, situation) {
    return 0.6 + Math.random() * 0.4;
  }
  
  assessActionRisk(action, situation) {
    return Math.random() * 0.5;
  }
  
  estimateEffort(action) {
    return { level: "medium", hours: 10 };
  }
  
  estimateTimeline(action) {
    return { duration: "2-4 weeks", phases: 3 };
  }
  
  calculateActionScore(evaluation) {
    return evaluation.compatibility * 0.4 + 
           evaluation.transformationPotential * 0.3 + 
           (1 - evaluation.riskLevel) * 0.3;
  }
  
  calculatePredictionConfidence(prediction) {
    return prediction.metadata ? 0.8 : 0.5;
  }
  
  identifyBenefits(evaluation, transformation, harmony) {
    return ["成長機会", "スキル向上", "満足感向上"];
  }
  
  identifyRisks(evaluation, transformation, harmony) {
    return evaluation.riskLevel > 0.5 ? ["高リスク"] : ["低リスク"];
  }
  
  identifyFocusElements(prediction) {
    return prediction.transformationPaths.slice(0, 3);
  }
  
  prepareComparisonView(recommendations) {
    return recommendations.map(r => ({
      action: r.action,
      score: r.score,
      benefits: r.benefits.length,
      risks: r.risks.length
    }));
  }
  
  prepareTimelineView(recommendations) {
    return recommendations.map(r => ({
      action: r.action,
      phases: r.implementation.steps || []
    }));
  }
  
  prepareImpactMatrix(recommendations) {
    return recommendations.map(r => ({
      action: r.action,
      effort: Math.random(),
      impact: r.score
    }));
  }
  
  createExecutiveSummary(recommendation, context) {
    return `${recommendation.action}を推奨。信頼度: ${(recommendation.confidence * 100).toFixed(0)}%`;
  }
  
  defineImmediateActions(recommendation) {
    return recommendation.implementation.steps.slice(0, 3);
  }
  
  createPhasedImplementation(recommendation, context) {
    return {
      phase1: "準備",
      phase2: "実行",
      phase3: "評価"
    };
  }
  
  defineSuccessMetrics(recommendation) {
    return ["達成度", "満足度", "学習度"];
  }
  
  createRiskManagementPlan(risks, context) {
    return risks.map(risk => ({
      risk: risk,
      mitigation: "リスク軽減策"
    }));
  }
  
  identifySupportResources(recommendation, context) {
    return ["メンター", "学習リソース", "コミュニティ"];
  }
  
  createReviewSchedule(timeline) {
    return ["1週間後", "2週間後", "1ヶ月後"];
  }
  
  createContingencyPlans(primary, alternatives) {
    return alternatives.map(alt => ({
      trigger: "プランBの条件",
      action: alt.action
    }));
  }
  
  breakDownActionSteps(action) {
    return ["準備", "実行", "評価"];
  }
  
  estimateStepTimeline(action) {
    return "1-2週間";
  }
  
  identifyKeyImplementationPoints(action) {
    return ["重要ポイント1", "重要ポイント2"];
  }
  
  getActionTheme(currentState) {
    if (this.components.HexagramActionThemeCatalog) {
      return this.components.HexagramActionThemeCatalog.getActionTheme(currentState.hexagram);
    }
    return null;
  }
  
  getYaoDefinition(currentState) {
    if (this.components.YaoActionDefinitionEngine) {
      return this.components.YaoActionDefinitionEngine.getYaoActionDefinition(
        currentState.hexagram,
        currentState.yao
      );
    }
    return null;
  }
  
  calculateActionCompatibility(action, theme, yaoDef) {
    if (!theme || !yaoDef) return 0.5;
    
    // 簡易的な適合度計算
    let compatibility = 0.5;
    
    if (theme && action.toLowerCase().includes(theme.coreTheme.toLowerCase())) {
      compatibility += 0.2;
    }
    
    if (yaoDef && yaoDef.actions) {
      if (action.includes(yaoDef.actions.shin.description)) {
        compatibility += 0.3;
      }
    }
    
    return Math.min(compatibility, 1.0);
  }
  
  getRecommendationLevel(compatibility) {
    if (compatibility >= 0.8) return "highly_recommended";
    if (compatibility >= 0.6) return "recommended";
    if (compatibility >= 0.4) return "possible";
    return "not_recommended";
  }
  
  identifyActionStrengths(action, context) {
    return ["明確な方向性", "実行可能性"];
  }
  
  identifyActionWeaknesses(action, context) {
    return ["リソース要求", "時間制約"];
  }
  
  generateActionSuggestions(action, compatibility) {
    if (compatibility < 0.6) {
      return ["より具体的な計画が必要", "段階的アプローチを検討"];
    }
    return ["現状のまま進行可能"];
  }
  
  summarizeTransformations(predictions) {
    return {
      primaryPath: predictions.transformationPaths[0]?.type || "不明",
      pathCount: predictions.transformationPaths.length,
      confidence: predictions.metadata?.confidence || 0.5
    };
  }
  
  summarizeHarmonyAnalysis(analysis) {
    return {
      harmonyLevel: analysis.harmonyScore.category,
      primaryConflict: analysis.conflicts.primaryConflict?.name || "なし",
      recommendation: analysis.recommendations.primaryRecommendation.action
    };
  }
  
  extractNodes(transformationResult) {
    return [
      {
        id: "current",
        data: transformationResult.currentState,
        type: "current"
      },
      ...transformationResult.transformationPaths.map((path, i) => ({
        id: `target_${i}`,
        data: path.targetState,
        type: path.type
      }))
    ];
  }
  
  extractEdges(transformationResult) {
    return transformationResult.transformationPaths.map((path, i) => ({
      source: "current",
      target: `target_${i}`,
      data: path,
      weight: path.probability
    }));
  }
  
  calculateLayout(transformationResult, options) {
    return {
      type: options.layoutType || "hierarchical",
      spacing: options.spacing || 100
    };
  }
  
  generateStyles(transformationResult, options) {
    return {
      nodes: {
        current: { fill: "#333", stroke: "#000" },
        target: { fill: "#666", stroke: "#333" }
      },
      edges: {
        stroke: "#999",
        strokeWidth: 2
      }
    };
  }
  
  defineInteractions(options) {
    return {
      click: options.onClick || (() => {}),
      hover: options.onHover || (() => {})
    };
  }
  
  recommendVisualizationMode(transformationResult) {
    const pathCount = transformationResult.transformationPaths.length;
    
    if (pathCount <= 3) return "tree";
    if (pathCount <= 6) return "radial";
    return "matrix";
  }
  
  createPlanOverview(recommendation, timeline) {
    return {
      action: recommendation.action,
      duration: timeline || "4 weeks",
      confidence: recommendation.confidence
    };
  }
  
  definePlanPhases(recommendation, context) {
    return [
      { name: "準備", duration: "1 week", tasks: ["リソース確保", "計画詳細化"] },
      { name: "実行", duration: "2 weeks", tasks: ["段階的実施", "調整"] },
      { name: "評価", duration: "1 week", tasks: ["結果測定", "学習抽出"] }
    ];
  }
  
  setMilestones(recommendation, timeline) {
    return [
      { name: "開始", date: "Day 1" },
      { name: "中間レビュー", date: "Day 14" },
      { name: "完了", date: "Day 28" }
    ];
  }
  
  defineSuccessCriteria(recommendation) {
    return [
      "目標の80%以上達成",
      "満足度スコア4以上",
      "新スキル習得"
    ];
  }
  
  createMonitoringPlan(recommendation, timeline) {
    return {
      frequency: "weekly",
      metrics: ["進捗率", "課題数", "満足度"],
      reviewers: ["self", "mentor"]
    };
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.IntegratedRecommendationAPI = IntegratedRecommendationAPI;
  console.log("✅ Integrated Recommendation API loaded successfully");
  
  // 簡易的なAPIインスタンスの作成
  window.haqeiRecommendationAPI = new IntegratedRecommendationAPI();
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = IntegratedRecommendationAPI;
}