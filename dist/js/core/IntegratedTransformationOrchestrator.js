/**
 * 統合変化オーケストレーター - HAQEI Future Simulator 中核統合システム
 * 
 * 目的：
 * - AdaptiveIChingEngine、ComprehensiveTransformationPatterns、EnhancedMetaphorEngineの完全統合
 * - ConcernClassifierとAdaptiveDisplayManagerとの連携
 * - bunenjin哲学に基づく一貫したシステム運用
 * - 1秒以内のパフォーマンス目標達成
 * 
 * アーキテクチャ：
 * - 非同期並列処理パイプライン
 * - エラー処理とフォールバック機能
 * - キャッシュシステムとパフォーマンス最適化
 * - 品質保証とテスタビリティ
 * 
 * Author: System Architecture Team
 * Created: 2025-08-04
 * Philosophy: bunenjin分人間調和理論 + システム統合
 */

class IntegratedTransformationOrchestrator {
  constructor() {
    console.log('🏗️ 統合変化オーケストレーター初期化開始');
    
    this.version = "1.0.0-integrated";
    this.philosophy = "bunenjin-integrated-transformation";
    this.systemStatus = "initializing";
    
    // システム状態管理
    this.systemHealth = {
      adaptiveEngine: false,
      patternEngine: false,
      metaphorEngine: false,
      concernClassifier: false,
      displayManager: false,
      overallStatus: 'initializing'
    };
    
    // パフォーマンス監視
    this.performanceMetrics = {
      totalOperations: 0,
      successfulOperations: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      componentPerformance: {}
    };
    
    // 統合キャッシュシステム
    this.integratedCache = new Map();
    this.cacheTimeout = 1800000; // 30分TTL
    this.maxCacheSize = 150;
    
    // エラー追跡システム
    this.errorTracking = {
      recentErrors: [],
      errorTypes: new Map(),
      maxErrorHistory: 100
    };
    
    // 統合設定
    this.integrationConfig = {
      maxResponseTime: 1000, // 1秒目標
      enableParallelProcessing: true,
      enableAdvancedCaching: true,
      enableQualityAssurance: true,
      fallbackStrategies: ['partial', 'simplified', 'basic']
    };
    
    // コンポーネント初期化
    this.components = {};
    this.initializeComponents();
    
    console.log('✅ 統合変化オーケストレーター基本初期化完了');
  }

  /**
   * コンポーネント初期化
   */
  async initializeComponents() {
    console.log('🔧 システムコンポーネント初期化開始');
    
    try {
      // 並列初期化で高速化
      const initPromises = [
        this.initializeAdaptiveEngine(),
        this.initializePatternEngine(),
        this.initializeMetaphorEngine(),
        this.initializeConcernClassifier(),
        this.initializeDisplayManager()
      ];
      
      const results = await Promise.allSettled(initPromises);
      
      // 初期化結果の評価
      this.evaluateInitializationResults(results);
      
      // システム状態更新
      this.updateSystemStatus();
      
      console.log('✅ システムコンポーネント初期化完了');
      console.log('📊 システム健全性:', this.systemHealth);
      
    } catch (error) {
      console.error('❌ コンポーネント初期化エラー:', error);
      this.systemStatus = 'partial';
    }
  }

  /**
   * AdaptiveIChingEngine初期化
   */
  async initializeAdaptiveEngine() {
    try {
      if (typeof AdaptiveIChingEngine !== 'undefined') {
        this.components.adaptiveEngine = new AdaptiveIChingEngine();
        this.systemHealth.adaptiveEngine = true;
        console.log('✅ AdaptiveIChingEngine統合完了');
      } else {
        throw new Error('AdaptiveIChingEngine未利用可能');
      }
    } catch (error) {
      console.warn('⚠️ AdaptiveIChingEngine初期化失敗:', error.message);
      this.components.adaptiveEngine = this.createAdaptiveFallback();
      this.systemHealth.adaptiveEngine = 'fallback';
    }
  }

  /**
   * ComprehensiveTransformationPatterns初期化
   */
  async initializePatternEngine() {
    try {
      if (typeof ComprehensiveTransformationPatterns !== 'undefined') {
        this.components.patternEngine = new ComprehensiveTransformationPatterns();
        this.systemHealth.patternEngine = true;
        console.log('✅ ComprehensiveTransformationPatterns統合完了');
      } else {
        throw new Error('ComprehensiveTransformationPatterns未利用可能');
      }
    } catch (error) {
      console.warn('⚠️ PatternEngine初期化失敗:', error.message);
      this.components.patternEngine = this.createPatternFallback();
      this.systemHealth.patternEngine = 'fallback';
    }
  }

  /**
   * EnhancedMetaphorEngine初期化
   */
  async initializeMetaphorEngine() {
    try {
      if (typeof EnhancedMetaphorEngine !== 'undefined') {
        this.components.metaphorEngine = new EnhancedMetaphorEngine();
        this.systemHealth.metaphorEngine = true;
        console.log('✅ EnhancedMetaphorEngine統合完了');
      } else {
        throw new Error('EnhancedMetaphorEngine未利用可能');
      }
    } catch (error) {
      console.warn('⚠️ MetaphorEngine初期化失敗:', error.message);
      this.components.metaphorEngine = this.createMetaphorFallback();
      this.systemHealth.metaphorEngine = 'fallback';
    }
  }

  /**
   * ConcernClassifier初期化
   */
  async initializeConcernClassifier() {
    try {
      if (typeof ConcernClassifier !== 'undefined') {
        this.components.concernClassifier = new ConcernClassifier();
        this.systemHealth.concernClassifier = true;
        console.log('✅ ConcernClassifier統合完了');
      } else {
        throw new Error('ConcernClassifier未利用可能');
      }
    } catch (error) {
      console.warn('⚠️ ConcernClassifier初期化失敗:', error.message);
      this.components.concernClassifier = this.createConcernFallback();
      this.systemHealth.concernClassifier = 'fallback';
    }
  }

  /**
   * AdaptiveDisplayManager初期化
   */
  async initializeDisplayManager() {
    try {
      if (typeof AdaptiveDisplayManager !== 'undefined') {
        this.components.displayManager = new AdaptiveDisplayManager();
        this.systemHealth.displayManager = true;
        console.log('✅ AdaptiveDisplayManager統合完了');
      } else {
        throw new Error('AdaptiveDisplayManager未利用可能');
      }
    } catch (error) {
      console.warn('⚠️ DisplayManager初期化失敗:', error.message);
      this.components.displayManager = this.createDisplayFallback();
      this.systemHealth.displayManager = 'fallback';
    }
  }

  /**
   * メイン統合処理実行
   * 全システムを統合した包括的変化分析
   */
  async executeIntegratedTransformation(inputData) {
    const startTime = performance.now();
    
    try {
      console.log('🚀 統合変化分析開始 - HAQEI統合システム');
      
      // 入力検証
      const validationResult = this.validateIntegratedInput(inputData);
      if (!validationResult.isValid) {
        throw new Error(`統合入力検証エラー: ${validationResult.errors.join(', ')}`);
      }
      
      // キャッシュチェック
      const cacheKey = this.generateIntegratedCacheKey(inputData);
      const cachedResult = this.getIntegratedCache(cacheKey);
      if (cachedResult) {
        console.log('🔄 統合キャッシュヒット - 結果返却');
        this.updatePerformanceMetrics(performance.now() - startTime, true, true);
        return cachedResult;
      }
      
      // Stage 1: 悩み分類（ConcernClassifier）
      console.log('📋 Stage 1: 悩み分類システム実行');
      const concernAnalysis = await this.executeConcernClassification(inputData);
      
      // Stage 2: 7変化パターン計算（ComprehensiveTransformationPatterns）
      console.log('☯️ Stage 2: 7変化パターン計算実行');
      const patternResults = await this.executePatternCalculation(inputData, concernAnalysis);
      
      // Stage 3: 適応的易経分析（AdaptiveIChingEngine）
      console.log('🎯 Stage 3: 適応的易経分析実行');
      const adaptiveResults = await this.executeAdaptiveAnalysis(inputData, concernAnalysis, patternResults);
      
      // Stage 4: 高品質メタファー生成（EnhancedMetaphorEngine）
      console.log('✨ Stage 4: 高品質メタファー生成実行');
      const metaphorResults = await this.executeMetaphorGeneration(inputData, concernAnalysis, patternResults);
      
      // Stage 5: 結果統合とbunenjin哲学適用
      console.log('🧘 Stage 5: bunenjin哲学統合実行');
      const integratedResults = await this.integrateResults(
        concernAnalysis,
        patternResults,
        adaptiveResults,
        metaphorResults,
        inputData
      );
      
      // Stage 6: 適応的表示生成（AdaptiveDisplayManager）
      console.log('🎨 Stage 6: 適応的表示生成実行');
      const finalDisplay = await this.generateAdaptiveDisplay(integratedResults, inputData);
      
      // パフォーマンス計算
      const totalTime = performance.now() - startTime;
      const performanceResult = this.evaluatePerformance(totalTime);
      
      // 最終結果構築
      const finalResult = {
        ...finalDisplay,
        systemInfo: {
          version: this.version,
          philosophy: this.philosophy,
          processingTime: totalTime,
          performanceGrade: performanceResult.grade,
          systemHealth: this.systemHealth,
          bunenjinIntegration: true
        },
        metadata: {
          timestamp: new Date().toISOString(),
          inputHash: this.hashInput(inputData),
          cacheKey: cacheKey
        }
      };
      
      // キャッシュ保存
      this.saveIntegratedCache(cacheKey, finalResult);
      
      // メトリクス更新
      this.updatePerformanceMetrics(totalTime, true, false);
      
      console.log(`✅ 統合変化分析完了 (${totalTime.toFixed(2)}ms)`);
      console.log('🎯 システム性能:', performanceResult.grade);
      
      return finalResult;
      
    } catch (error) {
      console.error('❌ 統合変化分析エラー:', error);
      this.trackError(error);
      
      const fallbackResult = await this.generateIntegratedFallback(inputData, error);
      this.updatePerformanceMetrics(performance.now() - startTime, false, false);
      
      return fallbackResult;
    }
  }

  /**
   * 悩み分類実行
   */
  async executeConcernClassification(inputData) {
    try {
      const { userInput, emotionalContext, contextualAnalysis } = inputData;
      
      const concernResult = await this.components.concernClassifier.classifyConcern(
        userInput,
        emotionalContext,
        contextualAnalysis
      );
      
      return {
        ...concernResult,
        componentStatus: 'success',
        processingTime: performance.now()
      };
      
    } catch (error) {
      console.warn('⚠️ 悩み分類エラー:', error.message);
      return this.getConcernFallback(inputData);
    }
  }

  /**
   * パターン計算実行
   */
  async executePatternCalculation(inputData, concernAnalysis) {
    try {
      const patternInput = {
        hexagram: inputData.hexagram || this.deriveHexagramFromConcern(concernAnalysis),
        changingLines: inputData.changingLines || this.deriveChangingLines(concernAnalysis),
        userType: inputData.userType || 'free',
        context: {
          ...concernAnalysis,
          ...inputData.context
        }
      };
      
      const patternResult = await this.components.patternEngine.calculateAllPatterns(patternInput);
      
      return {
        ...patternResult,
        componentStatus: 'success',
        derivedParameters: {
          hexagram: patternInput.hexagram,
          changingLines: patternInput.changingLines
        }
      };
      
    } catch (error) {
      console.warn('⚠️ パターン計算エラー:', error.message);
      return this.getPatternFallback(inputData, concernAnalysis);
    }
  }

  /**
   * 適応的分析実行
   */
  async executeAdaptiveAnalysis(inputData, concernAnalysis, patternResults) {
    try {
      const adaptiveInput = {
        text: inputData.userInput,
        emotionalContext: inputData.emotionalContext,
        contextualAnalysis: concernAnalysis,
        patternResults: patternResults
      };
      
      const adaptiveResult = await this.components.adaptiveEngine.performAdaptiveAnalysis(
        adaptiveInput,
        inputData.userProfile
      );
      
      return {
        ...adaptiveResult,
        componentStatus: 'success'
      };
      
    } catch (error) {
      console.warn('⚠️ 適応的分析エラー:', error.message);
      return this.getAdaptiveFallback(inputData, concernAnalysis);
    }
  }

  /**
   * メタファー生成実行
   */
  async executeMetaphorGeneration(inputData, concernAnalysis, patternResults) {
    try {
      const metaphorInput = {
        userInput: inputData.userInput,
        userProfile: inputData.userProfile,
        contextType: concernAnalysis.nature?.primary || 'general',
        hexagram: patternResults.inputHexagram || 1,
        changingLines: patternResults.changingLines || [1],
        patterns: patternResults.patterns || []
      };
      
      const metaphorResult = await this.components.metaphorEngine.generateEnhancedMetaphor(metaphorInput);
      
      return {
        ...metaphorResult,
        componentStatus: 'success'
      };
      
    } catch (error) {
      console.warn('⚠️ メタファー生成エラー:', error.message);
      return this.getMetaphorFallback(inputData, concernAnalysis);
    }
  }

  /**
   * 結果統合とbunenjin哲学適用
   */
  async integrateResults(concernAnalysis, patternResults, adaptiveResults, metaphorResults, inputData) {
    console.log('🔗 システム結果統合開始');
    
    // bunenjin哲学に基づく複数視点統合
    const bunenjinPerspectives = this.generateBunenjinPerspectives(
      concernAnalysis,
      patternResults,
      adaptiveResults,
      metaphorResults
    );
    
    // 品質評価統合
    const qualityAssessment = this.integrateQualityAssessments([
      concernAnalysis.confidence || 0.7,
      patternResults.confidence || 0.8,
      adaptiveResults.metadata?.confidence || 0.7,
      metaphorResults.qualityMetrics?.overallGrade === 'A' ? 0.9 : 0.7
    ]);
    
    // 行動指針統合
    const integratedGuidance = this.synthesizeActionGuidance(
      adaptiveResults.integratedResult,
      metaphorResults.primaryMetaphor,
      concernAnalysis
    );
    
    return {
      concernAnalysis,
      patternResults,
      adaptiveResults,
      metaphorResults,
      bunenjinIntegration: bunenjinPerspectives,
      qualityAssessment,
      integratedGuidance,
      systemSynergy: this.calculateSystemSynergy([
        concernAnalysis,
        patternResults,
        adaptiveResults,
        metaphorResults
      ])
    };
  }

  /**
   * 適応的表示生成
   */
  async generateAdaptiveDisplay(integratedResults, inputData) {
    try {
      const displayResult = await this.components.displayManager.generateAdaptiveDisplay(
        integratedResults.adaptiveResults,
        inputData.userProfile,
        integratedResults.concernAnalysis
      );
      
      // 統合結果をdisplay形式に追加
      const enhancedDisplay = {
        ...displayResult,
        integratedContent: {
          primaryInsight: integratedResults.metaphorResults.primaryMetaphor,
          patternSummary: this.createPatternSummary(integratedResults.patternResults),
          bunenjinWisdom: integratedResults.bunenjinIntegration,
          actionPlan: integratedResults.integratedGuidance
        },
        qualityMetrics: integratedResults.qualityAssessment,
        systemPerformance: integratedResults.systemSynergy
      };
      
      return enhancedDisplay;
      
    } catch (error) {
      console.warn('⚠️ 表示生成エラー:', error.message);
      return this.getDisplayFallback(integratedResults);
    }
  }

  /**
   * bunenjin哲学的視点生成
   */
  generateBunenjinPerspectives(concernAnalysis, patternResults, adaptiveResults, metaphorResults) {
    return {
      multipleViews: {
        description: "複数の視点から状況を理解することで、より豊かな洞察を得られます",
        perspectives: [
          {
            name: "内面的視点",
            source: "adaptiveEngine",
            insight: adaptiveResults.integratedResult?.primaryMessage || "内なる成長に焦点を当てましょう"
          },
          {
            name: "変化の視点", 
            source: "patternEngine",
            insight: this.extractPatternInsight(patternResults) || "変化の流れを理解しましょう"
          },
          {
            name: "智慧の視点",
            source: "metaphorEngine", 
            insight: metaphorResults.primaryMetaphor?.essence || "深い智慧を日常に活かしましょう"
          }
        ]
      },
      dividedPerformance: {
        description: "矛盾する解釈も同時に受け入れることで、新たな洞察が生まれます",
        paradoxes: this.identifySystemParadoxes([patternResults, adaptiveResults, metaphorResults])
      },
      tripleOSIntegration: {
        engineOS: {
          focus: "内的変化と個人的成長",
          guidance: adaptiveResults.integratedResult?.actionSteps || ["内なる力を信じる"]
        },
        interfaceOS: {
          focus: "他者との関係性と調和",
          guidance: concernAnalysis.nature?.primary === 'relationship' ? 
            ["相手の立場を理解する", "コミュニケーションを重視する"] : 
            ["周囲との調和を大切にする"]
        },
        safeModeOS: {
          focus: "リスク回避と安定性確保",
          guidance: ["慎重に行動する", "リスクを適切に評価する"]
        }
      }
    };
  }

  /**
   * パフォーマンス評価
   */
  evaluatePerformance(totalTime) {
    const target = this.integrationConfig.maxResponseTime;
    
    let grade = 'C';
    if (totalTime <= target * 0.5) grade = 'A+';
    else if (totalTime <= target * 0.7) grade = 'A';
    else if (totalTime <= target) grade = 'B';
    else if (totalTime <= target * 1.5) grade = 'C';
    else grade = 'D';
    
    return {
      grade,
      actualTime: totalTime,
      targetTime: target,
      efficiency: (target / totalTime * 100).toFixed(1) + '%',
      recommendation: totalTime > target ? 
        '性能最適化が推奨されます' : 
        '優秀な性能です'
    };
  }

  /**
   * 統合フォールバック生成
   */
  async generateIntegratedFallback(inputData, error) {
    console.log('🔄 統合フォールバック実行');
    
    return {
      primaryMetaphor: {
        essence: "人生という大河の流れ中で",
        fullText: "今のあなたの状況は、人生という大きな河の流れの一部です。時には急流、時には静かな流れがありますが、河は必ず海に向かって進んでいます。",
        actionGuidance: "現在の状況を受け入れながら、一歩ずつ前進してください"
      },
      integratedContent: {
        primaryInsight: {
          essence: "変化への適応",
          fullText: "困難な状況も成長の機会となります"
        },
        actionPlan: [
          "現状を冷静に受け入れる",
          "小さな一歩から始める",
          "内なる智慧を信頼する"
        ]
      },
      qualityMetrics: {
        overallGrade: 'C',
        systemHealth: this.systemHealth,
        fallbackReason: error.message
      },
      systemInfo: {
        version: this.version,
        fallbackMode: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * ヘルパーメソッド群
   */

  // システム状態更新
  updateSystemStatus() {
    const healthValues = Object.values(this.systemHealth);
    const healthyCount = healthValues.filter(h => h === true).length;
    const fallbackCount = healthValues.filter(h => h === 'fallback').length;
    
    if (healthyCount >= 4) {
      this.systemHealth.overallStatus = 'healthy';
      this.systemStatus = 'operational';
    } else if (healthyCount + fallbackCount >= 4) {
      this.systemHealth.overallStatus = 'degraded';  
      this.systemStatus = 'partial';
    } else {
      this.systemHealth.overallStatus = 'critical';
      this.systemStatus = 'limited';
    }
  }

  // 統合入力検証
  validateIntegratedInput(inputData) {
    const errors = [];
    
    if (!inputData || typeof inputData !== 'object') {
      errors.push('無効な入力データ');
    }
    
    if (!inputData.userInput || inputData.userInput.trim().length === 0) {
      errors.push('ユーザー入力が必要です');
    }
    
    if (inputData.userInput && inputData.userInput.length > 2000) {
      errors.push('入力テキストが長すぎます（2000文字以内）');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 悩みから卦の導出
  deriveHexagramFromConcern(concernAnalysis) {
    const natureToHexagram = {
      'work': 1,      // 乾為天
      'love': 31,     // 沢山咸  
      'health': 27,   // 山雷頤
      'relationship': 13, // 天火同人
      'growth': 46,   // 地風升
      'decision': 47, // 沢水困
      'anxiety': 29   // 坎為水
    };
    
    return natureToHexagram[concernAnalysis.nature?.primary] || 1;
  }

  // 変爻の導出
  deriveChangingLines(concernAnalysis) {
    const urgencyToLines = {
      'high': [1, 4],
      'medium': [2, 5],
      'low': [3, 6]
    };
    
    return urgencyToLines[concernAnalysis.urgency?.level] || [1];
  }

  // キャッシュ関連
  generateIntegratedCacheKey(inputData) {
    const keyData = {
      input: inputData.userInput?.substring(0, 100) || '',
      profile: inputData.userProfile?.experienceLevel || 'default',
      context: inputData.contextType || 'general'
    };
    return btoa(JSON.stringify(keyData)).substring(0, 32);
  }

  getIntegratedCache(key) {
    const cached = this.integratedCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.integratedCache.delete(key);
    return null;
  }

  saveIntegratedCache(key, data) {
    if (this.integratedCache.size >= this.maxCacheSize) {
      const firstKey = this.integratedCache.keys().next().value;
      this.integratedCache.delete(firstKey);
    }
    this.integratedCache.set(key, { data, timestamp: Date.now() });
  }

  // パフォーマンス監視
  updatePerformanceMetrics(responseTime, success, cacheHit) {
    this.performanceMetrics.totalOperations++;
    
    if (success) {
      this.performanceMetrics.successfulOperations++;
    }
    
    if (cacheHit) {
      this.performanceMetrics.cacheHitRate = 
        (this.performanceMetrics.cacheHitRate * 0.9) + (1 * 0.1);
    }
    
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime * 0.9) + (responseTime * 0.1);
  }

  // エラー追跡
  trackError(error) {
    this.errorTracking.recentErrors.push({
      message: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });
    
    if (this.errorTracking.recentErrors.length > this.errorTracking.maxErrorHistory) {
      this.errorTracking.recentErrors.shift();
    }
    
    const errorType = error.constructor.name;
    const count = this.errorTracking.errorTypes.get(errorType) || 0;
    this.errorTracking.errorTypes.set(errorType, count + 1);
  }

  // フォールバック作成メソッド群
  createAdaptiveFallback() {
    return {
      performAdaptiveAnalysis: () => ({
        integratedResult: {
          primaryMessage: '基本的な易経の智慧をお伝えします',
          actionSteps: ['現状を受け入れる', '内省の時間を作る']
        },
        metadata: { confidence: 0.5, fallback: true }
      })
    };
  }

  createPatternFallback() {
    return {
      calculateAllPatterns: () => ({
        patterns: [
          { pattern: 'progress', name: '進', displayInFree: true },
          { pattern: 'change', name: '変', displayInFree: true }
        ],
        confidence: 0.5,
        fallback: true
      })
    };
  }

  createMetaphorFallback() {
    return {
      generateEnhancedMetaphor: () => ({
        primaryMetaphor: {
          essence: '人生の道のり',
          fullText: '一歩一歩の積み重ねが、やがて大きな変化となります',
          actionGuidance: '焦らず着実に進んでください'
        },
        qualityMetrics: { overallGrade: 'C' },
        fallback: true
      })
    };
  }

  createConcernFallback() {
    return {
      classifyConcern: () => ({
        urgency: { level: 'medium', score: 0.5 },
        importance: { level: 'medium', score: 0.5 },
        nature: { primary: 'general', confidence: 0.5 },
        confidence: 0.5,
        fallback: true
      })
    };
  }

  createDisplayFallback() {
    return {
      generateAdaptiveDisplay: () => ({
        displaySettings: { adaptationLevel: 'basic' },
        integratedDisplay: { summary: '基本的な指導を提供します' },
        fallback: true
      })
    };
  }

  // ユーティリティメソッド群
  hashInput(inputData) {
    return btoa(JSON.stringify(inputData)).substring(0, 16);
  }

  extractPatternInsight(patternResults) {
    const patterns = patternResults.patterns || [];
    const displayablePattern = patterns.find(p => p.displayInFree);
    return displayablePattern?.guidance || displayablePattern?.description || null;
  }

  identifySystemParadoxes(results) {
    return [
      "急ぐことと待つことの両方が必要",
      "変化を求めながら安定を望む",
      "個人の成長と他者との調和"
    ];
  }

  integrateQualityAssessments(scores) {
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return {
      overallScore: averageScore,
      grade: averageScore >= 0.8 ? 'A' : averageScore >= 0.6 ? 'B' : 'C',
      componentScores: scores,
      reliability: 'high'
    };
  }

  synthesizeActionGuidance(adaptiveResult, metaphorResult, concernAnalysis) {
    const actions = [];
    
    if (adaptiveResult?.actionSteps) {
      actions.push(...adaptiveResult.actionSteps);
    }
    
    if (metaphorResult?.actionGuidance) {
      actions.push(metaphorResult.actionGuidance);
    }
    
    // 緊急度に応じた調整
    if (concernAnalysis.urgency?.level === 'high') {
      actions.unshift('まず現状を冷静に把握する');
    }
    
    return actions.slice(0, 5); // 最大5つの指針
  }

  createPatternSummary(patternResults) {
    const patterns = patternResults.patterns || [];
    const displayable = patterns.filter(p => p.displayInFree);
    
    return {
      totalPatterns: patterns.length,
      displayablePatterns: displayable.length,
      hiddenPatterns: patterns.length - displayable.length,
      mainPattern: displayable[0]?.name || '進',
      confidence: patternResults.confidence || 0.7
    };
  }

  calculateSystemSynergy(results) {
    const healthyComponents = Object.values(this.systemHealth).filter(h => h === true).length;
    const totalComponents = Object.keys(this.systemHealth).length - 1; // overallStatusを除く
    
    return {
      componentIntegration: healthyComponents / totalComponents,
      dataConsistency: 0.8, // 実装例
      performanceOptimization: this.performanceMetrics.averageResponseTime <= 1000 ? 0.9 : 0.6,
      userExperience: 0.85, // 実装例
      overallSynergy: (healthyComponents / totalComponents + 0.8 + 0.85) / 3
    };
  }

  evaluateInitializationResults(results) {
    results.forEach((result, index) => {
      const componentNames = ['adaptiveEngine', 'patternEngine', 'metaphorEngine', 'concernClassifier', 'displayManager'];
      const componentName = componentNames[index];
      
      if (result.status === 'rejected') {
        console.warn(`⚠️ ${componentName}初期化失敗:`, result.reason);
      }
    });
  }

  // システム診断
  async runSystemDiagnostics() {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      systemVersion: this.version,
      overallHealth: this.systemHealth.overallStatus,
      componentHealth: { ...this.systemHealth },
      performance: {
        averageResponseTime: this.performanceMetrics.averageResponseTime,
        successRate: this.performanceMetrics.successfulOperations / Math.max(this.performanceMetrics.totalOperations, 1),
        cacheHitRate: this.performanceMetrics.cacheHitRate
      },
      errors: {
        recentErrorCount: this.errorTracking.recentErrors.length,
        errorTypes: Object.fromEntries(this.errorTracking.errorTypes)
      },
      recommendations: []
    };
    
    // 推奨事項生成
    if (diagnostics.performance.averageResponseTime > 1000) {
      diagnostics.recommendations.push('パフォーマンス最適化が必要');
    }
    
    if (diagnostics.performance.successRate < 0.9) {
      diagnostics.recommendations.push('エラー処理の改善が必要');
    }
    
    if (Object.values(this.systemHealth).includes('fallback')) {
      diagnostics.recommendations.push('フォールバックコンポーネントの確認が必要');
    }
    
    return diagnostics;
  }

  // API互換性メソッド
  getConcernFallback(inputData) {
    return {
      urgency: { level: 'medium', score: 0.5, indicators: ['フォールバック'] },
      importance: { level: 'medium', score: 0.5, indicators: ['フォールバック'] },
      nature: { primary: 'general', secondary: 'growth', confidence: 0.5 },
      scope: { level: 'personal', breadth: 1, affectedAreas: ['個人'] },
      confidence: 0.5,
      componentStatus: 'fallback'
    };
  }

  getPatternFallback(inputData, concernAnalysis) {
    return {
      patterns: [
        { pattern: 'progress', name: '進', displayInFree: true, componentStatus: 'fallback' },
        { pattern: 'change', name: '変', displayInFree: true, componentStatus: 'fallback' }
      ],
      inputHexagram: 1,
      changingLines: [1],
      confidence: 0.5,
      componentStatus: 'fallback'
    };
  }

  getAdaptiveFallback(inputData, concernAnalysis) {
    return {
      integratedResult: {
        primaryMessage: '基本的な易経の智慧をお伝えします',
        actionSteps: ['現状を受け入れる', '内省の時間を作る', '次の行動を慎重に考える'],
        timeframe: '不明',
        overallConfidence: 0.5
      },
      metadata: { confidence: 0.5, fallback: true },
      componentStatus: 'fallback'
    };
  }

  getMetaphorFallback(inputData, concernAnalysis) {
    return {
      primaryMetaphor: {
        essence: '人生の道のり',
        fullText: '一歩一歩の積み重ねが、やがて大きな変化となります',
        actionGuidance: '焦らず着実に進んでください'
      },
      qualityMetrics: { overallGrade: 'C', insightDepth: 0.5 },
      componentStatus: 'fallback'
    };
  }

  getDisplayFallback(integratedResults) {
    return {
      displaySettings: { adaptationLevel: 'basic' },
      integratedDisplay: { summary: '基本的な指導を提供します' },
      integratedContent: {
        primaryInsight: integratedResults.metaphorResults.primaryMetaphor || { essence: '基本的な智慧' },
        actionPlan: ['現状を受け入れる', '一歩ずつ進む']
      },
      componentStatus: 'fallback'
    };
  }
}

// グローバルスコープに登録  
if (typeof window !== 'undefined') {
  window.IntegratedTransformationOrchestrator = IntegratedTransformationOrchestrator;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntegratedTransformationOrchestrator;
}

console.log('🌟 IntegratedTransformationOrchestrator.js 読み込み完了 - HAQEI統合システム');