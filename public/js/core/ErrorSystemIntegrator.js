/**
 * HAQEIアナライザー エラーシステム統合管理
 * ErrorSystemIntegrator.js
 * 
 * bunenjin哲学に基づく全エラーシステム統合・オーケストレーション
 * 易経の統合原理とTriple OS Architectureによる調和システム
 * 
 * 設計思想:
 * - すべてのエラーシステムの統一管理
 * - 分人に応じた適応的エラー対応
 * - Triple OS間の調和的連携
 * - 自己進化する知的エラー処理
 * - ユーザー体験の最適化
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0-unified-orchestration
 * Created: 2025-08-05
 */

class ErrorSystemIntegrator {
  constructor(options = {}) {
    this.version = "1.0.0-unified-orchestration";
    this.philosophyAlignment = "bunenjin-total-harmony";
    
    // 設定
    this.config = {
      enableUnifiedErrorHandler: options.enableUnifiedErrorHandler !== false,
      enableGracefulDegradation: options.enableGracefulDegradation !== false,
      enableUserFriendlyUI: options.enableUserFriendlyUI !== false,
      enableStructuredLogging: options.enableStructuredLogging !== false,
      enableTestSuite: options.enableTestSuite || false,
      enableAutoIntegration: options.enableAutoIntegration !== false,
      enablePerformanceOptimization: options.enablePerformanceOptimization !== false,
      enableBunenjinAdaptation: options.enableBunenjinAdaptation !== false,
      enableTripleOSIntegration: options.enableTripleOSIntegration !== false,
      enableSelfHealing: options.enableSelfHealing || false,
      debugMode: options.debugMode || false,
      ...options
    };
    
    // コンポーネント管理
    this.components = {
      unifiedErrorHandler: null,
      gracefulDegradationManager: null,
      userFriendlyErrorUI: null,
      structuredLogger: null,
      errorTestSuite: null
    };
    
    // 統合状態
    this.integrationStatus = {
      initialized: false,
      componentsLoaded: 0,
      totalComponents: 5,
      errors: [],
      warnings: []
    };
    
    // bunenjin統合
    this.bunenjinIntegration = {
      currentPersona: 'pragmatic',
      personaHistory: [],
      adaptationRules: new Map(),
      learningData: new Map()
    };
    
    // Triple OS統合
    this.tripleOSIntegration = {
      engineOS: { status: 'unknown', errorHandler: null },
      interfaceOS: { status: 'unknown', errorHandler: null },
      safeModeOS: { status: 'unknown', errorHandler: null }
    };
    
    // パフォーマンス監視
    this.performanceMetrics = {
      initializationTime: 0,
      errorHandlingTime: 0,
      memoryUsage: 0,
      componentResponseTimes: new Map(),
      systemHealth: 100
    };
    
    // 自己修復機能
    this.selfHealingSystem = {
      enabled: this.config.enableSelfHealing,
      healingAttempts: 0,
      healingStrategies: new Map(),
      healingHistory: []
    };
    
    // イベントエミッター
    this.eventListeners = new Map();
    
    this.initialize();
    
    console.log(`🌟 ErrorSystemIntegrator v${this.version} initialized`);
  }
  
  /**
   * システム初期化
   */
  async initialize() {
    const startTime = performance.now();
    
    try {
      console.log("🚀 Initializing unified error handling system...");
      
      // コンポーネントの検出・初期化
      await this.detectAndInitializeComponents();
      
      // システム統合
      await this.integrateComponents();
      
      // bunenjin統合
      if (this.config.enableBunenjinAdaptation) {
        await this.initializeBunenjinIntegration();
      }
      
      // Triple OS統合
      if (this.config.enableTripleOSIntegration) {
        await this.initializeTripleOSIntegration();
      }
      
      // 自己修復システム
      if (this.config.enableSelfHealing) {
        await this.initializeSelfHealingSystem();
      }
      
      // パフォーマンス最適化
      if (this.config.enablePerformanceOptimization) {
        await this.optimizePerformance();
      }
      
      // 自動テスト実行
      if (this.config.enableTestSuite) {
        await this.runIntegrationTests();
      }
      
      this.performanceMetrics.initializationTime = performance.now() - startTime;
      this.integrationStatus.initialized = true;
      
      console.log(`✅ ErrorSystemIntegrator fully initialized (${this.performanceMetrics.initializationTime.toFixed(2)}ms)`);
      
      // 初期化完了イベント
      this.emitEvent('initialization-complete', {
        duration: this.performanceMetrics.initializationTime,
        componentsLoaded: this.integrationStatus.componentsLoaded,
        status: this.integrationStatus
      });
      
    } catch (error) {
      console.error("❌ ErrorSystemIntegrator initialization failed:", error);
      this.integrationStatus.errors.push({
        type: 'initialization-error',
        message: error.message,
        timestamp: Date.now()
      });
      
      // フォールバック初期化
      await this.initializeFallbackMode();
    }
  }
  
  /**
   * コンポーネント検出・初期化
   */
  async detectAndInitializeComponents() {
    const componentConfigs = [
      {
        name: 'unifiedErrorHandler',
        className: 'UnifiedErrorHandler',
        required: true,
        options: {
          bunenjinModeEnabled: this.config.enableBunenjinAdaptation,
          tripleOSIntegrationEnabled: this.config.enableTripleOSIntegration,
          performanceOptimized: this.config.enablePerformanceOptimization
        }
      },
      {
        name: 'gracefulDegradationManager',
        className: 'GracefulDegradationManager',
        required: true,
        options: {
          bunenjinAdaptation: this.config.enableBunenjinAdaptation,
          performanceMonitoring: this.config.enablePerformanceOptimization
        }
      },
      {
        name: 'userFriendlyErrorUI',
        className: 'UserFriendlyErrorUI',
        required: true,
        options: {
          bunenjinPersonalization: this.config.enableBunenjinAdaptation,
          accessibilityMode: true
        }
      },
      {
        name: 'structuredLogger',
        className: 'StructuredLogger',
        required: false,
        options: {
          enableMetrics: this.config.enablePerformanceOptimization,
          enablePerformanceLogging: this.config.enablePerformanceOptimization
        }
      },
      {
        name: 'errorTestSuite',
        className: 'ErrorTestSuite',
        required: false,
        options: {
          bunenjinPersonaTesting: this.config.enableBunenjinAdaptation,
          tripleOSIntegrationTesting: this.config.enableTripleOSIntegration
        }
      }
    ];
    
    for (const config of componentConfigs) {
      try {
        await this.initializeComponent(config);
      } catch (error) {
        const errorInfo = {
          component: config.name,
          error: error.message,
          timestamp: Date.now()
        };
        
        if (config.required) {
          this.integrationStatus.errors.push(errorInfo);
          throw new Error(`Required component ${config.name} failed to initialize: ${error.message}`);
        } else {
          this.integrationStatus.warnings.push(errorInfo);
          console.warn(`⚠️ Optional component ${config.name} failed to initialize:`, error);
        }
      }
    }
  }
  
  /**
   * 個別コンポーネント初期化
   */
  async initializeComponent(config) {
    const ComponentClass = window[config.className];
    
    if (!ComponentClass) {
      throw new Error(`Component class ${config.className} not found`);
    }
    
    console.log(`🔧 Initializing ${config.name}...`);
    
    const startTime = performance.now();
    const instance = new ComponentClass(config.options);
    
    // 初期化待機（非同期初期化の場合）
    if (instance.initialize && typeof instance.initialize === 'function') {
      await instance.initialize();
    }
    
    const initTime = performance.now() - startTime;
    this.performanceMetrics.componentResponseTimes.set(config.name, initTime);
    
    this.components[config.name] = instance;
    this.integrationStatus.componentsLoaded++;
    
    console.log(`✅ ${config.name} initialized (${initTime.toFixed(2)}ms)`);
  }
  
  /**
   * コンポーネント統合
   */
  async integrateComponents() {
    console.log("🔗 Integrating error handling components...");
    
    // UnifiedErrorHandlerとの統合
    if (this.components.unifiedErrorHandler) {
      await this.integrateUnifiedErrorHandler();
    }
    
    // GracefulDegradationManagerとの統合
    if (this.components.gracefulDegradationManager) {
      await this.integrateGracefulDegradationManager();
    }
    
    // UserFriendlyErrorUIとの統合
    if (this.components.userFriendlyErrorUI) {
      await this.integrateUserFriendlyErrorUI();
    }
    
    // StructuredLoggerとの統合
    if (this.components.structuredLogger) {
      await this.integrateStructuredLogger();
    }
    
    // 相互連携の設定
    await this.setupComponentInterconnections();
  }
  
  /**
   * UnifiedErrorHandler統合
   */
  async integrateUnifiedErrorHandler() {
    const handler = this.components.unifiedErrorHandler;
    
    // グローバルエラーハンドラーとして設定
    window.unifiedErrorHandler = handler;
    
    // 他コンポーネントとの連携設定
    if (this.components.gracefulDegradationManager) {
      handler.setDegradationManager(this.components.gracefulDegradationManager);
    }
    
    if (this.components.userFriendlyErrorUI) {
      handler.setErrorUI(this.components.userFriendlyErrorUI);
    }
    
    if (this.components.structuredLogger) {
      handler.setLogger(this.components.structuredLogger);
    }
    
    // エラーハンドリングイベントの監視
    handler.addEventListener('error-handled', (data) => {
      this.onErrorHandled(data);
    });
    
    console.log("✅ UnifiedErrorHandler integrated");
  }
  
  /**
   * bunenjin統合初期化
   */
  async initializeBunenjinIntegration() {
    console.log("🧠 Initializing bunenjin integration...");
    
    // 分人適応ルールの設定
    this.setupBunenjinAdaptationRules();
    
    // 分人切り替え監視
    this.setupBunenjinPersonaMonitoring();
    
    // 学習データの初期化
    this.initializeBunenjinLearning();
    
    console.log("✅ Bunenjin integration initialized");
  }
  
  /**
   * 分人適応ルール設定
   */
  setupBunenjinAdaptationRules() {
    // 分析型分人ルール
    this.bunenjinIntegration.adaptationRules.set('analytical', {
      errorUIStyle: 'technical',
      logLevel: 'debug',
      degradationThreshold: 0.8,
      notificationDetail: 'high',
      recoveryStrategy: 'thorough-analysis'
    });
    
    // 共感型分人ルール
    this.bunenjinIntegration.adaptationRules.set('empathetic', {
      errorUIStyle: 'friendly',
      logLevel: 'info',
      degradationThreshold: 0.6,
      notificationDetail: 'medium',
      recoveryStrategy: 'user-comfort-first'
    });
    
    // 実用型分人ルール
    this.bunenjinIntegration.adaptationRules.set('pragmatic', {
      errorUIStyle: 'action-oriented',
      logLevel: 'warn',
      degradationThreshold: 0.7,
      notificationDetail: 'low',
      recoveryStrategy: 'quick-recovery'
    });
  }
  
  /**
   * メインエラーハンドリングエントリーポイント
   */
  async handleError(error, context = {}) {
    const startTime = performance.now();
    
    try {
      // bunenjin分人による適応的処理
      const currentPersona = this.getCurrentBunenjinPersona();
      const adaptationRule = this.bunenjinIntegration.adaptationRules.get(currentPersona);
      
      // コンテキストの拡張
      const extendedContext = {
        ...context,
        bunenjinPersona: currentPersona,
        adaptationRule: adaptationRule,
        integrationVersion: this.version,
        systemHealth: this.performanceMetrics.systemHealth
      };
      
      // 統合エラーハンドリング実行
      const result = await this.executeIntegratedErrorHandling(error, extendedContext);
      
      // パフォーマンス記録
      this.performanceMetrics.errorHandlingTime = performance.now() - startTime;
      
      // 学習データ更新
      this.updateBunenjinLearning(currentPersona, error, result);
      
      // システム健全性更新
      this.updateSystemHealth(result);
      
      return result;
      
    } catch (handlingError) {
      console.error("❌ Integrated error handling failed:", handlingError);
      return this.executeEmergencyFallback(error, context);
    }
  }
  
  /**
   * 統合エラーハンドリング実行
   */
  async executeIntegratedErrorHandling(error, context) {
    const results = {};
    
    // 1. 統一エラーハンドラーによる処理
    if (this.components.unifiedErrorHandler) {
      try {
        results.errorHandler = await this.components.unifiedErrorHandler.handleError(error, context);
      } catch (e) {
        console.warn("⚠️ UnifiedErrorHandler failed:", e);
      }
    }
    
    // 2. 必要に応じたグレースフルデグラデーション
    if (this.shouldDegradeSystem(error, context)) {
      try {
        const degradationLevel = this.calculateDegradationLevel(error, context);
        results.degradation = await this.components.gracefulDegradationManager.degradeToLevel(
          degradationLevel, 
          `Error-triggered degradation: ${error.message}`
        );
      } catch (e) {
        console.warn("⚠️ Graceful degradation failed:", e);
      }
    }
    
    // 3. ユーザーフレンドリーUI表示
    if (this.components.userFriendlyErrorUI && context.showUI !== false) {
      try {
        results.ui = await this.components.userFriendlyErrorUI.displayError(error, {
          bunenjinPersona: context.bunenjinPersona
        });
      } catch (e) {
        console.warn("⚠️ User-friendly UI failed:", e);
      }
    }
    
    // 4. 構造化ログ記録
    if (this.components.structuredLogger) {
      try {
        results.logging = this.components.structuredLogger.error(error.message, {
          error: error,
          context: context,
          integrationResults: results
        });
      } catch (e) {
        console.warn("⚠️ Structured logging failed:", e);
      }
    }
    
    // 5. 自己修復試行
    if (this.selfHealingSystem.enabled && this.shouldAttemptSelfHealing(error, context)) {
      try {
        results.selfHealing = await this.attemptSelfHealing(error, context);
      } catch (e) {
        console.warn("⚠️ Self-healing failed:", e);
      }
    }
    
    return {
      success: this.evaluateOverallSuccess(results),
      timestamp: Date.now(),
      bunenjinPersona: context.bunenjinPersona,
      components: results,
      metadata: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        contextKeys: Object.keys(context),
        systemVersion: this.version
      }
    };
  }
  
  /**
   * システム健全性チェック
   */
  async performSystemHealthCheck() {
    const healthData = {
      timestamp: Date.now(),
      overall: 100,
      components: {},
      issues: [],
      recommendations: []
    };
    
    // 各コンポーネントのヘルスチェック
    for (const [name, component] of Object.entries(this.components)) {
      if (component && typeof component.performHealthCheck === 'function') {
        try {
          const componentHealth = await component.performHealthCheck();
          healthData.components[name] = componentHealth;
          
          if (componentHealth.score < 80) {
            healthData.overall -= (100 - componentHealth.score) * 0.2;
            healthData.issues.push({
              component: name,
              score: componentHealth.score,
              issues: componentHealth.issues
            });
          }
        } catch (error) {
          healthData.components[name] = { score: 0, error: error.message };
          healthData.overall -= 20;
          healthData.issues.push({
            component: name,
            error: error.message
          });
        }
      }
    }
    
    // bunenjin統合健全性
    if (this.config.enableBunenjinAdaptation) {
      const bunenjinHealth = this.assessBunenjinHealth();
      healthData.bunenjin = bunenjinHealth;
      
      if (bunenjinHealth.score < 80) {
        healthData.overall -= (100 - bunenjinHealth.score) * 0.1;
      }
    }
    
    // 推奨事項生成
    healthData.recommendations = this.generateHealthRecommendations(healthData);
    
    // システム健全性更新
    this.performanceMetrics.systemHealth = Math.max(0, healthData.overall);
    
    return healthData;
  }
  
  /**
   * パフォーマンス最適化
   */
  async optimizePerformance() {
    console.log("⚡ Optimizing integrated error system performance...");
    
    // メモリ使用量最適化
    await this.optimizeMemoryUsage();
    
    // コンポーネント間通信最適化
    await this.optimizeComponentCommunication();
    
    // キャッシュ最適化
    await this.optimizeCaching();
    
    // ガベージコレクション最適化
    await this.optimizeGarbageCollection();
    
    console.log("✅ Performance optimization completed");
  }
  
  /**
   * 統計情報取得
   */
  getSystemStatistics() {
    const stats = {
      integration: {
        version: this.version,
        initializationTime: this.performanceMetrics.initializationTime,
        componentsLoaded: this.integrationStatus.componentsLoaded,
        totalComponents: this.integrationStatus.totalComponents,
        initialized: this.integrationStatus.initialized
      },
      performance: {
        systemHealth: this.performanceMetrics.systemHealth,
        errorHandlingTime: this.performanceMetrics.errorHandlingTime,
        memoryUsage: this.performanceMetrics.memoryUsage,
        componentResponseTimes: Object.fromEntries(this.performanceMetrics.componentResponseTimes)
      },
      bunenjin: {
        enabled: this.config.enableBunenjinAdaptation,
        currentPersona: this.bunenjinIntegration.currentPersona,
        personaHistory: this.bunenjinIntegration.personaHistory.slice(-10),
        learningDataSize: this.bunenjinIntegration.learningData.size
      },
      components: {}
    };
    
    // 各コンポーネントの統計
    for (const [name, component] of Object.entries(this.components)) {
      if (component && typeof component.getStatistics === 'function') {
        try {
          stats.components[name] = component.getStatistics();
        } catch (error) {
          stats.components[name] = { error: error.message };
        }
      }
    }
    
    return stats;
  }
  
  /**
   * クリーンアップ
   */
  async cleanup() {
    console.log("🧹 Cleaning up ErrorSystemIntegrator...");
    
    // 各コンポーネントのクリーンアップ
    for (const [name, component] of Object.entries(this.components)) {
      if (component && typeof component.cleanup === 'function') {
        try {
          await component.cleanup();
          console.log(`✅ ${name} cleaned up`);
        } catch (error) {
          console.warn(`⚠️ ${name} cleanup failed:`, error);
        }
      }
    }
    
    // イベントリスナーのクリア
    this.eventListeners.clear();
    
    // グローバル参照のクリア
    if (window.unifiedErrorHandler === this.components.unifiedErrorHandler) {
      delete window.unifiedErrorHandler;
    }
    
    console.log("✅ ErrorSystemIntegrator cleanup completed");
  }
  
  // ユーティリティメソッド
  getCurrentBunenjinPersona() {
    if (window.bunenjinPersona && window.bunenjinPersona.getActivePersona) {
      return window.bunenjinPersona.getActivePersona();
    }
    return this.bunenjinIntegration.currentPersona;
  }
  
  shouldDegradeSystem(error, context) {
    const severity = this.assessErrorSeverity(error, context);
    const threshold = this.getCurrentDegradationThreshold();
    return severity >= threshold;
  }
  
  calculateDegradationLevel(error, context) {
    const severity = this.assessErrorSeverity(error, context);
    
    if (severity >= 0.9) return 4; // セーフモード
    if (severity >= 0.7) return 3; // 基本機能モード
    if (severity >= 0.5) return 2; // 中程度制限
    return 1; // 軽微制限
  }
  
  assessErrorSeverity(error, context) {
    let severity = 0.5; // 基本重要度
    
    // エラータイプによる重要度
    if (error instanceof SyntaxError) severity += 0.3;
    if (error instanceof ReferenceError) severity += 0.2;
    if (error.message?.includes('critical')) severity += 0.4;
    
    // コンテキストによる重要度
    if (context.userInitiated) severity -= 0.1;
    if (context.systemCritical) severity += 0.3;
    
    return Math.min(1.0, Math.max(0.0, severity));
  }
  
  getCurrentDegradationThreshold() {
    const persona = this.getCurrentBunenjinPersona();
    const rule = this.bunenjinIntegration.adaptationRules.get(persona);
    return rule ? rule.degradationThreshold : 0.7;
  }
  
  evaluateOverallSuccess(results) {
    const successCount = Object.values(results).filter(result => 
      result && (result.success === true || result.success !== false)
    ).length;
    
    return successCount > 0;
  }
  
  updateSystemHealth(result) {
    if (result.success) {
      this.performanceMetrics.systemHealth = Math.min(100, this.performanceMetrics.systemHealth + 1);
    } else {
      this.performanceMetrics.systemHealth = Math.max(0, this.performanceMetrics.systemHealth - 5);
    }
  }
  
  emitEvent(eventType, data) {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Event listener error for ${eventType}:`, error);
      }
    });
  }
  
  // プレースホルダーメソッド（簡略化）
  onErrorHandled(data) { /* エラーハンドリング完了時の処理 */ }
  setupBunenjinPersonaMonitoring() { /* 分人監視設定 */ }
  initializeBunenjinLearning() { /* 学習データ初期化 */ }
  updateBunenjinLearning(persona, error, result) { /* 学習データ更新 */ }
  initializeTripleOSIntegration() { /* Triple OS統合初期化 */ }
  initializeSelfHealingSystem() { /* 自己修復システム初期化 */ }
  runIntegrationTests() { /* 統合テスト実行 */ }
  initializeFallbackMode() { /* フォールバックモード初期化 */ }
  setupComponentInterconnections() { /* コンポーネント相互連携設定 */ }
  integrateGracefulDegradationManager() { /* グレースフルデグラデーション統合 */ }
  integrateUserFriendlyErrorUI() { /* UI統合 */ }
  integrateStructuredLogger() { /* ログ統合 */ }
  shouldAttemptSelfHealing(error, context) { return false; }
  attemptSelfHealing(error, context) { return { success: false }; }
  assessBunenjinHealth() { return { score: 100 }; }
  generateHealthRecommendations(healthData) { return []; }
  optimizeMemoryUsage() { /* メモリ最適化 */ }
  optimizeComponentCommunication() { /* 通信最適化 */ }
  optimizeCaching() { /* キャッシュ最適化 */ }
  optimizeGarbageCollection() { /* GC最適化 */ }
  executeEmergencyFallback(error, context) { 
    return { 
      success: false, 
      fallback: true, 
      message: 'Emergency fallback activated' 
    }; 
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.ErrorSystemIntegrator = ErrorSystemIntegrator;
  
  // 自動初期化（オプション）
  if (window.HAQEI_AUTO_INIT_ERROR_SYSTEM) {
    window.addEventListener('DOMContentLoaded', () => {
      window.haqeiErrorSystemIntegrator = new ErrorSystemIntegrator({
        enableAutoIntegration: true,
        enableBunenjinAdaptation: true,
        enableTripleOSIntegration: true,
        enablePerformanceOptimization: true
      });
    });
  }
}

console.log("🌟 ErrorSystemIntegrator.js loaded - unified orchestration ready");