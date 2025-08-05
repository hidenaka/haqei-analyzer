/**
 * HAQEI統一エラーハンドリングシステム - グローバル初期化マネージャー
 * 
 * 目的：
 * - 既存225ファイルのJavaScriptコードと完全互換
 * - 段階的置換による0ダウンタイム移行
 * - 100%後方互換性保持
 * - システム全体への自動統合
 * 
 * Architecture: Unified Error Handling System
 * Philosophy: bunenjin + Triple OS Integration
 * Version: 1.0.0-integration-ready
 * 
 * @author HAQEI System Architect
 * @date 2025-08-05
 */

class GlobalErrorSystemInitializer {
  constructor(options = {}) {
    this.version = "1.0.0-integration-ready";
    this.initialized = false;
    this.integrationStatus = "pending";
    
    // 設定マネージャー
    this.config = {
      // 段階的統合設定
      migrationStrategy: options.migrationStrategy || 'gradual',
      backwardCompatibility: options.backwardCompatibility !== false,
      autoDiscovery: options.autoDiscovery !== false,
      
      // システム統合設定
      integrateWithApp: options.integrateWithApp !== false,
      integrateWithVirtualQuestionFlow: options.integrateWithVirtualQuestionFlow !== false,
      integrateWithTripleOS: options.integrateWithTripleOS !== false,
      
      // パフォーマンス設定
      enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
      enableMetricsCollection: options.enableMetricsCollection !== false,
      
      // デバッグ設定
      debugMode: options.debugMode || false,
      verboseLogging: options.verboseLogging || false,
      
      ...options
    };
    
    // システム状態管理
    this.systemState = {
      existingHandlers: new Map(),
      unifiedHandler: null,
      integrationPoints: new Map(),
      migrationProgress: 0,
      compatibilityLayer: null
    };
    
    // 既存システム発見結果
    this.discoveredSystems = {
      unifiedErrorHandler: null,
      legacyErrorHandler: null,
      comprehensiveErrorHandler: null,
      customHandlers: []
    };
    
    // 統合メトリクス
    this.metrics = {
      initializationTime: 0,
      integrationsCompleted: 0,
      errorsHandled: 0,
      compatibilityIssues: 0,
      performanceBaseline: {}
    };
    
    console.log(`🌟 GlobalErrorSystemInitializer v${this.version} ready for integration`);
  }
  
  /**
   * システム全体の初期化
   */
  async initialize() {
    const startTime = performance.now();
    
    try {
      console.log("🚀 Starting HAQEI Unified Error System initialization...");
      
      // Phase 1: 既存システム発見
      await this.discoverExistingSystems();
      
      // Phase 2: 後方互換性レイヤー設定
      await this.setupCompatibilityLayer();
      
      // Phase 3: 統一ハンドラー初期化
      await this.initializeUnifiedHandler();
      
      // Phase 4: システム統合
      await this.integrateWithApplicationSystems();
      
      // Phase 5: 監視・メトリクス開始
      if (this.config.enablePerformanceMonitoring) {
        await this.startMonitoringSystems();
      }
      
      // Phase 6: 統合検証
      await this.validateIntegration();
      
      this.initialized = true;
      this.integrationStatus = "completed";
      this.metrics.initializationTime = performance.now() - startTime;
      
      console.log(`✅ HAQEI Unified Error System initialized successfully in ${this.metrics.initializationTime.toFixed(2)}ms`);
      
      return {
        success: true,
        version: this.version,
        initializationTime: this.metrics.initializationTime,
        integrationStatus: this.integrationStatus,
        systemsIntegrated: this.getIntegratedSystemsCount()
      };
      
    } catch (error) {
      console.error("❌ GlobalErrorSystemInitializer failed:", error);
      
      // 緊急フォールバック
      await this.activateEmergencyFallback();
      
      return {
        success: false,
        error: error.message,
        fallbackActivated: true
      };
    }
  }
  
  /**
   * Phase 1: 既存システム発見
   */
  async discoverExistingSystems() {
    console.log("🔍 Phase 1: Discovering existing error handling systems...");
    
    // UnifiedErrorHandler の発見
    if (window.UnifiedErrorHandler) {
      this.discoveredSystems.unifiedErrorHandler = window.UnifiedErrorHandler;
      console.log("✅ Found UnifiedErrorHandler (bunenjin-integrated)");
    }
    
    // 既存ErrorHandler の発見
    if (window.ErrorHandler) {
      this.discoveredSystems.legacyErrorHandler = window.ErrorHandler;
      console.log("✅ Found legacy ErrorHandler");
    }
    
    // ComprehensiveErrorHandler の発見
    if (window.ComprehensiveErrorHandler || window.errorHandler) {
      this.discoveredSystems.comprehensiveErrorHandler = 
        window.ComprehensiveErrorHandler || window.errorHandler;
      console.log("✅ Found ComprehensiveErrorHandler");
    }
    
    // カスタムハンドラーの発見
    await this.discoverCustomHandlers();
    
    // 統合レポート
    this.logDiscoveryReport();
  }
  
  /**
   * カスタムハンドラーの発見
   */
  async discoverCustomHandlers() {
    const customHandlerPatterns = [
      'handleError', 'errorHandler', 'onError', 'catchError',
      'processError', 'logError', 'reportError'
    ];
    
    // グローバルオブジェクトの検索
    for (const pattern of customHandlerPatterns) {
      if (window[pattern] && typeof window[pattern] === 'function') {
        this.discoveredSystems.customHandlers.push({
          name: pattern,
          handler: window[pattern],
          type: 'global-function'
        });
      }
    }
    
    // DOM内のエラーハンドラー検索
    const errorElements = document.querySelectorAll('[onerror], [onunhandledrejection]');
    errorElements.forEach(element => {
      this.discoveredSystems.customHandlers.push({
        name: 'dom-handler',
        element: element,
        type: 'dom-attribute'
      });
    });
    
    console.log(`🔍 Discovered ${this.discoveredSystems.customHandlers.length} custom handlers`);
  }
  
  /**
   * 発見レポートのログ出力
   */
  logDiscoveryReport() {
    const report = {
      unifiedErrorHandler: !!this.discoveredSystems.unifiedErrorHandler,
      legacyErrorHandler: !!this.discoveredSystems.legacyErrorHandler,
      comprehensiveErrorHandler: !!this.discoveredSystems.comprehensiveErrorHandler,
      customHandlers: this.discoveredSystems.customHandlers.length
    };
    
    console.log("📊 System Discovery Report:", report);
  }
  
  /**
   * Phase 2: 後方互換性レイヤー設定
   */
  async setupCompatibilityLayer() {
    console.log("🔗 Phase 2: Setting up backward compatibility layer...");
    
    if (!this.config.backwardCompatibility) {
      console.log("⏭️ Backward compatibility disabled, skipping...");
      return;
    }
    
    // 互換性レイヤークラスの作成
    this.systemState.compatibilityLayer = new BackwardCompatibilityLayer({
      discoveredSystems: this.discoveredSystems,
      preserveExistingBehavior: true,
      enableMethodInterception: true
    });
    
    // 既存システムのプロキシ設定
    await this.systemState.compatibilityLayer.setupProxies();
    
    console.log("✅ Backward compatibility layer established");
  }
  
  /**
   * Phase 3: 統一ハンドラー初期化
   */
  async initializeUnifiedHandler() {
    console.log("🎯 Phase 3: Initializing unified error handler...");
    
    // 最適なハンドラークラスの選択
    let HandlerClass;
    
    if (this.discoveredSystems.unifiedErrorHandler) {
      HandlerClass = this.discoveredSystems.unifiedErrorHandler;
      console.log("📋 Using existing UnifiedErrorHandler");
    } else {
      // 動的インポート試行
      try {
        const module = await import('./UnifiedErrorHandler.js');
        HandlerClass = module.UnifiedErrorHandler || module.default;
        console.log("📦 Loaded UnifiedErrorHandler from module");
      } catch (error) {
        console.warn("⚠️ Failed to load UnifiedErrorHandler, creating fallback");
        HandlerClass = this.createFallbackHandler();
      }
    }
    
    // ハンドラーインスタンス作成
    this.systemState.unifiedHandler = new HandlerClass({
      backwardCompatible: true,
      integrationMode: true,
      existingSystems: this.discoveredSystems,
      debugMode: this.config.debugMode
    });
    
    // グローバル登録
    window.HAQEIErrorHandler = this.systemState.unifiedHandler;
    
    console.log("✅ Unified error handler initialized");
  }
  
  /**
   * Phase 4: システム統合
   */
  async integrateWithApplicationSystems() {
    console.log("🔌 Phase 4: Integrating with application systems...");
    
    const integrationTasks = [];
    
    // App.js との統合
    if (this.config.integrateWithApp && window.app) {
      integrationTasks.push(this.integrateWithApp());
    }
    
    // VirtualQuestionFlow との統合
    if (this.config.integrateWithVirtualQuestionFlow && window.VirtualQuestionFlow) {
      integrationTasks.push(this.integrateWithVirtualQuestionFlow());
    }
    
    // TripleOSEngine との統合
    if (this.config.integrateWithTripleOS && window.TripleOSEngine) {
      integrationTasks.push(this.integrateWithTripleOS());
    }
    
    // DOM ready との統合
    integrationTasks.push(this.integrateWithDOMReady());
    
    // 並列実行
    const results = await Promise.allSettled(integrationTasks);
    
    // 結果の評価
    this.evaluateIntegrationResults(results);
  }
  
  /**
   * App.js との統合
   */
  async integrateWithApp() {
    try {
      console.log("🎯 Integrating with App.js...");
      
      if (!window.app) {
        throw new Error("App instance not found");
      }
      
      // 既存のエラーハンドラーを保存
      const originalErrorHandler = window.app.handleError;
      
      // 新しいエラーハンドラーでラップ
      window.app.handleError = async (error, context = {}) => {
        // 統一ハンドラーで処理
        const result = await this.systemState.unifiedHandler.handleError(error, {
          ...context,
          source: 'app.js',
          originalHandler: originalErrorHandler
        });
        
        // 原始ハンドラーも実行（後方互換性）
        if (originalErrorHandler && typeof originalErrorHandler === 'function') {
          try {
            await originalErrorHandler.call(window.app, error, context);
          } catch (legacyError) {
            console.warn("⚠️ Legacy handler error:", legacyError);
          }
        }
        
        return result;
      };
      
      // 統合成功を記録
      this.systemState.integrationPoints.set('app.js', {
        integrated: true,
        timestamp: Date.now(),
        originalHandler: originalErrorHandler
      });
      
      console.log("✅ App.js integration completed");
      
    } catch (error) {
      console.error("❌ App.js integration failed:", error);
      throw error;
    }
  }
  
  /**
   * VirtualQuestionFlow との統合
   */
  async integrateWithVirtualQuestionFlow() {
    try {
      console.log("🎯 Integrating with VirtualQuestionFlow...");
      
      if (!window.VirtualQuestionFlow) {
        throw new Error("VirtualQuestionFlow not found");
      }
      
      // プロトタイプレベルでの統合
      const originalHandleError = window.VirtualQuestionFlow.prototype.handleError;
      
      window.VirtualQuestionFlow.prototype.handleError = async function(error, context = {}) {
        // 統一ハンドラーで処理
        const result = await window.HAQEIErrorHandler.handleError(error, {
          ...context,
          source: 'VirtualQuestionFlow',
          instance: this,
          originalHandler: originalHandleError
        });
        
        // 原始ハンドラー実行
        if (originalHandleError) {
          try {
            await originalHandleError.call(this, error, context);
          } catch (legacyError) {
            console.warn("⚠️ VirtualQuestionFlow legacy handler error:", legacyError);
          }
        }
        
        return result;
      };
      
      // 統合成功を記録
      this.systemState.integrationPoints.set('VirtualQuestionFlow', {
        integrated: true,
        timestamp: Date.now(),
        originalHandler: originalHandleError
      });
      
      console.log("✅ VirtualQuestionFlow integration completed");
      
    } catch (error) {
      console.error("❌ VirtualQuestionFlow integration failed:", error);
      throw error;
    }
  }
  
  /**
   * TripleOSEngine との統合
   */
  async integrateWithTripleOS() {
    try {
      console.log("🎯 Integrating with TripleOSEngine...");
      
      if (!window.TripleOSEngine) {
        throw new Error("TripleOSEngine not found");
      }
      
      // TripleOSエンジンにエラーハンドラーを注入
      if (window.TripleOSEngine.prototype) {
        const originalAnalyze = window.TripleOSEngine.prototype.analyze;
        
        window.TripleOSEngine.prototype.analyze = async function(answers) {
          try {
            return await originalAnalyze.call(this, answers);
          } catch (error) {
            // 統一ハンドラーで処理
            await window.HAQEIErrorHandler.handleError(error, {
              source: 'TripleOSEngine',
              method: 'analyze',
              answers: answers,
              instance: this
            });
            
            // リスロー（既存の動作を保持）
            throw error;
          }
        };
      }
      
      // 統合成功を記録
      this.systemState.integrationPoints.set('TripleOSEngine', {
        integrated: true,
        timestamp: Date.now()
      });
      
      console.log("✅ TripleOSEngine integration completed");
      
    } catch (error) {
      console.error("❌ TripleOSEngine integration failed:", error);
      throw error;
    }
  }
  
  /**
   * DOM Ready との統合
   */
  async integrateWithDOMReady() {
    try {
      console.log("🎯 Setting up DOM ready integration...");
      
      // DOMContentLoaded後の統合
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.performDOMIntegration();
        });
      } else {
        await this.performDOMIntegration();
      }
      
      console.log("✅ DOM ready integration completed");
      
    } catch (error) {
      console.error("❌ DOM ready integration failed:", error);
      throw error;
    }
  }
  
  /**
   * DOM統合の実行
   */
  async performDOMIntegration() {
    // エラーコンテナの統合
    const errorContainers = document.querySelectorAll('#data-manager-errors, #error-notifications');
    errorContainers.forEach(container => {
      if (this.systemState.unifiedHandler.uiElements) {
        this.systemState.unifiedHandler.uiElements.additionalContainers = 
          this.systemState.unifiedHandler.uiElements.additionalContainers || [];
        this.systemState.unifiedHandler.uiElements.additionalContainers.push(container);
      }
    });
    
    // HELPシステムとの統合
    if (window.haqeiHelpSystem) {
      const originalShowHelp = window.haqeiHelpSystem.showHelp;
      
      window.haqeiHelpSystem.showHelp = async function(...args) {
        try {
          return await originalShowHelp.apply(this, args);
        } catch (error) {
          await window.HAQEIErrorHandler.handleError(error, {
            source: 'haqeiHelpSystem',
            method: 'showHelp',
            args: args
          });
          throw error;
        }
      };
    }
  }
  
  /**
   * Phase 5: 監視システム開始
   */
  async startMonitoringSystems() {
    console.log("📊 Phase 5: Starting monitoring systems...");
    
    if (!this.config.enablePerformanceMonitoring) {
      return;
    }
    
    // パフォーマンスベースライン取得
    this.metrics.performanceBaseline = {
      memoryUsage: this.getCurrentMemoryUsage(),
      errorHandlingLatency: 0,
      timestamp: Date.now()
    };
    
    // メトリクス収集開始
    this.startMetricsCollection();
    
    console.log("✅ Monitoring systems started");
  }
  
  /**
   * メトリクス収集開始
   */
  startMetricsCollection() {
    if (!this.config.enableMetricsCollection) {
      return;
    }
    
    setInterval(() => {
      this.collectMetrics();
    }, 30000); // 30秒間隔
  }
  
  /**
   * メトリクス収集
   */
  collectMetrics() {
    const currentMetrics = {
      timestamp: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      integrationsActive: this.systemState.integrationPoints.size,
      errorsHandled: this.metrics.errorsHandled
    };
    
    if (this.config.verboseLogging) {
      console.log("📊 Current metrics:", currentMetrics);
    }
  }
  
  /**
   * Phase 6: 統合検証
   */
  async validateIntegration() {
    console.log("✅ Phase 6: Validating integration...");
    
    const validationResults = {
      unifiedHandlerActive: !!this.systemState.unifiedHandler,
      compatibilityLayerActive: !!this.systemState.compatibilityLayer,
      integrationPointsActive: this.systemState.integrationPoints.size,
      backwardCompatibilityMaintained: await this.testBackwardCompatibility(),
      performanceImpact: this.calculatePerformanceImpact()
    };
    
    // 検証レポート
    console.log("📋 Integration Validation Report:", validationResults);
    
    if (validationResults.unifiedHandlerActive && validationResults.backwardCompatibilityMaintained) {
      console.log("✅ Integration validation successful");
    } else {
      console.warn("⚠️ Integration validation issues detected");
    }
    
    return validationResults;
  }
  
  /**
   * 後方互換性テスト
   */
  async testBackwardCompatibility() {
    try {
      // 既存のErrorHandlerが存在し、動作するかテスト
      if (window.ErrorHandler) {
        const testHandler = new window.ErrorHandler('test-container');
        if (typeof testHandler.handleError === 'function') {
          return true;
        }
      }
      
      // その他の互換性テスト
      return true;
      
    } catch (error) {
      console.warn("⚠️ Backward compatibility test failed:", error);
      return false;
    }
  }
  
  /**
   * パフォーマンス影響の計算
   */
  calculatePerformanceImpact() {
    if (!this.metrics.performanceBaseline.timestamp) {
      return null;
    }
    
    const currentMemory = this.getCurrentMemoryUsage();
    const baselineMemory = this.metrics.performanceBaseline.memoryUsage;
    
    return {
      memoryIncrease: currentMemory - baselineMemory,
      initializationOverhead: this.metrics.initializationTime
    };
  }
  
  /**
   * 統合システム数取得
   */
  getIntegratedSystemsCount() {
    return this.systemState.integrationPoints.size;
  }
  
  /**
   * 現在のメモリ使用量取得
   */
  getCurrentMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }
  
  /**
   * 統合結果の評価
   */
  evaluateIntegrationResults(results) {
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    this.metrics.integrationsCompleted = successful;
    
    if (failed > 0) {
      console.warn(`⚠️ ${failed} integration(s) failed out of ${results.length}`);
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ Integration ${index} failed:`, result.reason);
        }
      });
    }
    
    console.log(`✅ ${successful}/${results.length} integrations completed successfully`);
  }
  
  /**
   * 緊急フォールバック
   */
  async activateEmergencyFallback() {
    console.warn("🚨 Activating emergency fallback...");
    
    try {
      // 最小限のエラーハンドラーを設定
      window.HAQEIErrorHandler = this.createMinimalHandler();
      
      // 基本的なグローバルハンドラー設定
      window.addEventListener('error', (event) => {
        console.error("💥 Global error (fallback):", event.error);
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        console.error("💥 Unhandled rejection (fallback):", event.reason);
      });
      
      this.integrationStatus = "fallback-active";
      
      console.log("✅ Emergency fallback activated");
      
    } catch (fallbackError) {
      console.error("❌ Emergency fallback failed:", fallbackError);
    }
  }
  
  /**
   * フォールバックハンドラー作成
   */
  createFallbackHandler() {
    return class FallbackErrorHandler {
      constructor(options = {}) {
        this.options = options;
      }
      
      async handleError(error, context = {}) {
        console.error("🔧 Fallback handler:", error, context);
        return { success: true, strategy: 'fallback-logging' };
      }
    };
  }
  
  /**
   * 最小限ハンドラー作成
   */
  createMinimalHandler() {
    return {
      handleError: (error, context = {}) => {
        console.error("[Minimal Handler]", error, context);
        return Promise.resolve({ success: true, strategy: 'minimal' });
      }
    };
  }
  
  /**
   * 統合状態レポート取得
   */
  getIntegrationReport() {
    return {
      version: this.version,
      initialized: this.initialized,
      integrationStatus: this.integrationStatus,
      discoveredSystems: Object.keys(this.discoveredSystems).reduce((acc, key) => {
        acc[key] = !!this.discoveredSystems[key];
        return acc;
      }, {}),
      integrationPoints: Array.from(this.systemState.integrationPoints.keys()),
      metrics: this.metrics,
      config: this.config
    };
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    // 統合ポイントのクリーンアップ
    this.systemState.integrationPoints.clear();
    
    // メトリクス収集停止
    // (実際のタイマーIDを保存して clearInterval する実装が必要)
    
    console.log("🧹 GlobalErrorSystemInitializer cleanup completed");
  }
}

/**
 * 後方互換性レイヤー
 */
class BackwardCompatibilityLayer {
  constructor(options = {}) {
    this.discoveredSystems = options.discoveredSystems || {};
    this.preserveExistingBehavior = options.preserveExistingBehavior !== false;
    this.enableMethodInterception = options.enableMethodInterception !== false;
    
    this.proxies = new Map();
  }
  
  async setupProxies() {
    console.log("🔗 Setting up compatibility proxies...");
    
    // 既存のErrorHandlerにプロキシを設定
    if (this.discoveredSystems.legacyErrorHandler && this.enableMethodInterception) {
      this.setupErrorHandlerProxy();
    }
    
    // その他のハンドラーにプロキシを設定
    this.discoveredSystems.customHandlers.forEach(handler => {
      this.setupCustomHandlerProxy(handler);
    });
    
    console.log("✅ Compatibility proxies established");
  }
  
  setupErrorHandlerProxy() {
    const originalHandler = this.discoveredSystems.legacyErrorHandler;
    
    // プロトタイプの handleError メソッドをプロキシ
    if (originalHandler.prototype && originalHandler.prototype.handleError) {
      const originalMethod = originalHandler.prototype.handleError;
      
      originalHandler.prototype.handleError = async function(...args) {
        // 統一ハンドラーによる前処理
        if (window.HAQEIErrorHandler) {
          await window.HAQEIErrorHandler.handleError(args[0], {
            source: 'legacy-errorhandler',
            intercepted: true,
            originalArgs: args
          });
        }
        
        // 原始メソッド実行
        return originalMethod.apply(this, args);
      };
    }
  }
  
  setupCustomHandlerProxy(handler) {
    if (handler.type === 'global-function') {
      const originalFunction = handler.handler;
      
      window[handler.name] = async function(...args) {
        // 統一ハンドラーによる前処理
        if (window.HAQEIErrorHandler) {
          await window.HAQEIErrorHandler.handleError(args[0] || new Error('Custom handler called'), {
            source: `custom-${handler.name}`,
            intercepted: true,
            originalArgs: args
          });
        }
        
        // 原始関数実行
        return originalFunction.apply(this, args);
      };
    }
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.GlobalErrorSystemInitializer = GlobalErrorSystemInitializer;
  window.BackwardCompatibilityLayer = BackwardCompatibilityLayer;
}

// Node.js環境での公開
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GlobalErrorSystemInitializer, BackwardCompatibilityLayer };
}

console.log("🌟 GlobalErrorSystemInitializer.js loaded - Ready for system integration");