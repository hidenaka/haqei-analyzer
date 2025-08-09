/**
 * HAQEI統一エラーハンドリングシステム - ブートストラップローダー
 * 
 * 目的：
 * - アプリケーション起動時の自動初期化
 * - 依存関係の解決と順序付けされた読み込み
 * - 設定管理とカスタマイゼーション
 * - パフォーマンス最適化とメモリ管理
 * 
 * Integration Points:
 * - os_analyzer.html の <head> セクション
 * - app.js 初期化前の早期実行
 * - 全JSモジュールとの自動統合
 * 
 * Architecture: Bootstrap → Initialize → Integrate → Monitor
 * 
 * @author HAQEI System Architect
 * @date 2025-08-05
 */

(function(global) {
  'use strict';
  
  // Bootstrap設定
  const BOOTSTRAP_CONFIG = {
    version: '1.0.0-bootstrap',
    autoInitialize: true,
    loadTimeout: 10000, // 10秒
    retryAttempts: 3,
    verboseLogging: false,
    
    // 依存関係設定
    dependencies: [
      'UnifiedErrorHandler.js',
      'GlobalErrorSystemInitializer.js'
    ],
    
    // 統合対象システム
    integrationTargets: [
      'app.js',
      'VirtualQuestionFlow',
      'TripleOSEngine',
      'CacheManager',
      'PerformanceOptimizer'
    ],
    
    // パフォーマンス設定
    performance: {
      enableLazyLoading: true,
      enableCodeSplitting: true,
      enableCaching: true,
      memoryOptimization: true
    }
  };
  
  /**
   * HAQEIエラーシステムブートストラップ
   */
  class HAQEIErrorSystemBootstrap {
    constructor() {
      this.initialized = false;
      this.loading = false;
      this.loadAttempts = 0;
      this.startTime = performance.now();
      
      // 状態管理
      this.state = {
        dependenciesLoaded: new Set(),
        systemsIntegrated: new Set(),
        errors: [],
        metrics: {
          loadTime: 0,
          memoryBaseline: 0,
          initializationTime: 0
        }
      };
      
      // 設定のマージ
      this.config = { ...BOOTSTRAP_CONFIG };
      
      // イベントエミッター
      this.events = new Map();
      
      console.log(`🚀 HAQEI Error System Bootstrap v${this.config.version} ready`);
    }
    
    /**
     * ブートストラップ開始
     */
    async bootstrap(customConfig = {}) {
      if (this.loading || this.initialized) {
        console.warn("⚠️ Bootstrap already in progress or completed");
        return;
      }
      
      this.loading = true;
      this.state.metrics.memoryBaseline = this.getMemoryUsage();
      
      try {
        // 設定マージ
        this.config = { ...this.config, ...customConfig };
        
        console.log("🚀 Starting HAQEI Error System Bootstrap...");
        
        // Phase 1: 環境検証
        this.validateEnvironment();
        
        // Phase 2: 依存関係読み込み
        this.loadDependencies();
        
        // Phase 3: システム初期化
        this.initializeSystem();
        
        // Phase 4: 統合実行
        this.performIntegration();
        
        // Phase 5: 最終検証
        this.validateBootstrap();
        
        this.initialized = true;
        this.loading = false;
        
        const totalTime = performance.now() - this.startTime;
        this.state.metrics.loadTime = totalTime;
        
        console.log(`✅ HAQEI Error System Bootstrap completed in ${totalTime.toFixed(2)}ms`);
        
        // 成功イベント発火
        this.emit('bootstrap:complete', {
          success: true,
          metrics: this.state.metrics,
          config: this.config
        });
        
        return { success: true, metrics: this.state.metrics };
        
      } catch (error) {
        console.error("❌ Bootstrap failed:", error);
        this.state.errors.push(error);
        this.loading = false;
        
        // エラーイベント発火
        this.emit('bootstrap:error', { error, attempts: this.loadAttempts });
        
        // リトライ処理
        if (this.loadAttempts < this.config.retryAttempts) {
          this.loadAttempts++;
          console.log(`🔄 Retrying bootstrap (attempt ${this.loadAttempts}/${this.config.retryAttempts})...`);
          
          // await new Promise(resolve => setTimeout(resolve, 1000 * this.loadAttempts));
          return this.bootstrap(customConfig);
        }
        
        // 最終的な失敗処理
        await this.handleBootstrapFailure(error);
        return { success: false, error: error.message };
      }
    }
    
    /**
     * Phase 1: 環境検証
     */
    async validateEnvironment() {
      console.log("🔍 Phase 1: Validating environment...");
      
      // ブラウザサポートチェック
      if (!window.Promise || !window.fetch) {
        throw new Error("Browser does not support required features (Promise, fetch)");
      }
      
      // DOMの準備状態チェック
      if (document.readyState === 'loading') {
        // await new Promise(resolve => {
        //   document.addEventListener('DOMContentLoaded', resolve, { once: true });
        // });
      }
      
      // 既存システムの競合チェック
      this.checkForConflicts();
      
      console.log("✅ Environment validation passed");
    }
    
    /**
     * 競合チェック
     */
    checkForConflicts() {
      const conflicts = [];
      
      // 既存のグローバルハンドラーをチェック
      if (window.onerror && typeof window.onerror === 'function') {
        conflicts.push('Global onerror handler detected');
      }
      
      if (window.onunhandledrejection && typeof window.onunhandledrejection === 'function') {
        conflicts.push('Global unhandledrejection handler detected');
      }
      
      // 既存のエラーハンドラーライブラリをチェック
      const knownLibraries = ['Sentry', 'Bugsnag', 'LogRocket', 'Rollbar'];
      knownLibraries.forEach(lib => {
        if (window[lib]) {
          conflicts.push(`${lib} error tracking library detected`);
        }
      });
      
      if (conflicts.length > 0) {
        console.warn("⚠️ Potential conflicts detected:", conflicts);
      }
    }
    
    /**
     * Phase 2: 依存関係読み込み
     */
    async loadDependencies() {
      console.log("📦 Phase 2: Loading dependencies...");
      
      const loadPromises = this.config.dependencies.map(dependency => {
        return this.loadDependency(dependency);
      });
      
      const results = await Promise.allSettled(loadPromises);
      
      // 結果の評価
      results.forEach((result, index) => {
        const dependency = this.config.dependencies[index];
        
        if (result.status === 'fulfilled') {
          this.state.dependenciesLoaded.add(dependency);
          console.log(`✅ Loaded: ${dependency}`);
        } else {
          console.error(`❌ Failed to load: ${dependency}`, result.reason);
          this.state.errors.push(result.reason);
        }
      });
      
      // 必須依存関係のチェック
      if (this.state.dependenciesLoaded.size === 0) {
        throw new Error("No dependencies could be loaded");
      }
      
      console.log(`✅ Dependencies loaded: ${this.state.dependenciesLoaded.size}/${this.config.dependencies.length}`);
    }
    
    /**
     * 個別依存関係の読み込み
     */
    async loadDependency(dependency) {
      try {
        // 既に読み込まれているかチェック
        if (this.isDependencyLoaded(dependency)) {
          console.log(`⏭️ Already loaded: ${dependency}`);
          return;
        }
        
        // スクリプトパスの構築
        const scriptPath = this.buildScriptPath(dependency);
        
        // 動的読み込み試行
        if (this.config.performance.enableLazyLoading) {
          await this.loadScriptAsync(scriptPath);
        } else {
          await this.loadScriptSync(scriptPath);
        }
        
        // 読み込み確認
        if (!this.isDependencyLoaded(dependency)) {
          throw new Error(`Dependency ${dependency} loaded but not available`);
        }
        
      } catch (error) {
        throw new Error(`Failed to load dependency ${dependency}: ${error.message}`);
      }
    }
    
    /**
     * 依存関係の読み込み状態チェック
     */
    isDependencyLoaded(dependency) {
      switch (dependency) {
        case 'UnifiedErrorHandler.js':
          return !!(window.UnifiedErrorHandler);
        case 'GlobalErrorSystemInitializer.js':
          return !!(window.GlobalErrorSystemInitializer);
        default:
          return false;
      }
    }
    
    /**
     * スクリプトパスの構築
     */
    buildScriptPath(dependency) {
      const basePath = '/js/core/';
      return basePath + dependency;
    }
    
    /**
     * 非同期スクリプト読み込み
     */
    async loadScriptAsync(scriptPath) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.async = true;
        
        script.onload = () => {
          console.log(`📦 Script loaded: ${scriptPath}`);
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error(`Failed to load script: ${scriptPath}`));
        };
        
        // タイムアウト設定
        const timeout = setTimeout(() => {
          reject(new Error(`Script load timeout: ${scriptPath}`));
        }, this.config.loadTimeout);
        
        script.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        document.head.appendChild(script);
      });
    }
    
    /**
     * 同期スクリプト読み込み（フォールバック）
     */
    async loadScriptSync(scriptPath) {
      try {
        const response = await fetch(scriptPath);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const scriptContent = await response.text();
        
        // スクリプト実行
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.head.appendChild(script);
        
      } catch (error) {
        throw new Error(`Sync load failed for ${scriptPath}: ${error.message}`);
      }
    }
    
    /**
     * Phase 3: システム初期化
     */
    async initializeSystem() {
      console.log("🎯 Phase 3: Initializing system...");
      
      const initStartTime = performance.now();
      
      // GlobalErrorSystemInitializer の作成
      if (!window.GlobalErrorSystemInitializer) {
        throw new Error("GlobalErrorSystemInitializer not available");
      }
      
      this.systemInitializer = new window.GlobalErrorSystemInitializer({
        migrationStrategy: 'gradual',
        backwardCompatibility: true,
        autoDiscovery: true,
        debugMode: this.config.verboseLogging,
        
        // 統合設定
        integrateWithApp: true,
        integrateWithVirtualQuestionFlow: true,
        integrateWithTripleOS: true,
        
        // パフォーマンス設定
        enablePerformanceMonitoring: true,
        enableMetricsCollection: true
      });
      
      // システム初期化実行
      const initResult = await this.systemInitializer.initialize();
      
      if (!initResult.success) {
        throw new Error(`System initialization failed: ${initResult.error}`);
      }
      
      this.state.metrics.initializationTime = performance.now() - initStartTime;
      
      console.log(`✅ System initialized in ${this.state.metrics.initializationTime.toFixed(2)}ms`);
    }
    
    /**
     * Phase 4: 統合実行
     */
    async performIntegration() {
      console.log("🔌 Phase 4: Performing integration...");
      
      // 統合対象の自動発見
      const availableTargets = this.discoverIntegrationTargets();
      
      // 統合実行
      for (const target of availableTargets) {
        try {
          await this.integrateWithTarget(target);
          this.state.systemsIntegrated.add(target);
          console.log(`✅ Integrated with: ${target}`);
        } catch (error) {
          console.warn(`⚠️ Integration failed with ${target}:`, error);
          this.state.errors.push(error);
        }
      }
      
      console.log(`✅ Integration completed: ${this.state.systemsIntegrated.size} systems`);
    }
    
    /**
     * 統合対象の発見
     */
    discoverIntegrationTargets() {
      const targets = [];
      
      this.config.integrationTargets.forEach(target => {
        if (this.isTargetAvailable(target)) {
          targets.push(target);
        }
      });
      
      return targets;
    }
    
    /**
     * 統合対象の利用可能性チェック
     */
    isTargetAvailable(target) {
      switch (target) {
        case 'app.js':
          return !!(window.app);
        case 'VirtualQuestionFlow':
          return !!(window.VirtualQuestionFlow);
        case 'TripleOSEngine':
          return !!(window.TripleOSEngine);
        case 'CacheManager':
          return !!(window.CacheManager);
        case 'PerformanceOptimizer':
          return !!(window.PerformanceOptimizer);
        default:
          return !!(window[target]);
      }
    }
    
    /**
     * 個別統合実行
     */
    async integrateWithTarget(target) {
      // SystemInitializer が既に統合処理を行っているため、
      // ここでは追加的な統合処理のみ実行
      
      switch (target) {
        case 'CacheManager':
          await this.integrateCacheManager();
          break;
        case 'PerformanceOptimizer':
          await this.integratePerformanceOptimizer();
          break;
        default:
          // デフォルトは SystemInitializer に委任
          break;
      }
    }
    
    /**
     * CacheManager統合
     */
    async integrateCacheManager() {
      if (window.CacheManager) {
        const originalInit = window.CacheManager.prototype.init;
        
        window.CacheManager.prototype.init = async function() {
          try {
            return await originalInit.call(this);
          } catch (error) {
            if (window.HAQEIErrorHandler) {
              await window.HAQEIErrorHandler.handleError(error, {
                source: 'CacheManager',
                method: 'init'
              });
            }
            throw error;
          }
        };
      }
    }
    
    /**
     * PerformanceOptimizer統合
     */
    async integratePerformanceOptimizer() {
      if (window.PerformanceOptimizer) {
        const originalOptimize = window.PerformanceOptimizer.prototype.optimize;
        
        window.PerformanceOptimizer.prototype.optimize = async function() {
          try {
            return await originalOptimize.call(this);
          } catch (error) {
            if (window.HAQEIErrorHandler) {
              await window.HAQEIErrorHandler.handleError(error, {
                source: 'PerformanceOptimizer',
                method: 'optimize'
              });
            }
            throw error;
          }
        };
      }
    }
    
    /**
     * Phase 5: 最終検証
     */
    async validateBootstrap() {
      console.log("✅ Phase 5: Validating bootstrap...");
      
      // 統一ハンドラーの動作確認
      if (!window.HAQEIErrorHandler) {
        throw new Error("Unified error handler not available");
      }
      
      // テストエラーで動作確認
      try {
        const testResult = await window.HAQEIErrorHandler.handleError(
          new Error("Bootstrap validation test"),
          { source: 'bootstrap-validation', test: true }
        );
        
        if (!testResult.success) {
          throw new Error("Error handler validation failed");
        }
      } catch (error) {
        throw new Error(`Error handler test failed: ${error.message}`);
      }
      
      // メモリ使用量チェック
      const currentMemory = this.getMemoryUsage();
      const memoryIncrease = currentMemory - this.state.metrics.memoryBaseline;
      
      if (memoryIncrease > 50 * 1024 * 1024) { // 50MB以上の増加
        console.warn(`⚠️ Significant memory increase detected: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
      }
      
      console.log("✅ Bootstrap validation passed");
    }
    
    /**
     * ブートストラップ失敗処理
     */
    async handleBootstrapFailure(error) {
      console.error("🚨 Bootstrap failed, activating fallback mode...");
      
      try {
        // 最小限のエラーハンドラーを設定
        window.HAQEIErrorHandler = {
          handleError: (error, context = {}) => {
            console.error("[Fallback Handler]", error, context);
            return Promise.resolve({ success: true, strategy: 'fallback' });
          }
        };
        
        // 基本的なグローバルハンドラー
        window.addEventListener('error', (event) => {
          console.error("[Fallback] Global error:", event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
          console.error("[Fallback] Unhandled rejection:", event.reason);
        });
        
        console.log("✅ Fallback mode activated");
        
      } catch (fallbackError) {
        console.error("❌ Fallback activation failed:", fallbackError);
      }
    }
    
    /**
     * メモリ使用量取得
     */
    getMemoryUsage() {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    }
    
    /**
     * イベントエミッター機能
     */
    on(event, callback) {
      if (!this.events.has(event)) {
        this.events.set(event, []);
      }
      this.events.get(event).push(callback);
    }
    
    emit(event, data) {
      if (this.events.has(event)) {
        this.events.get(event).forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Event callback error for ${event}:`, error);
          }
        });
      }
    }
    
    /**
     * ブートストラップ状態取得
     */
    getBootstrapStatus() {
      return {
        version: this.config.version,
        initialized: this.initialized,
        loading: this.loading,
        loadAttempts: this.loadAttempts,
        dependenciesLoaded: Array.from(this.state.dependenciesLoaded),
        systemsIntegrated: Array.from(this.state.systemsIntegrated),
        errors: this.state.errors.length,
        metrics: this.state.metrics
      };
    }
  }
  
  // グローバル公開
  global.HAQEIErrorSystemBootstrap = HAQEIErrorSystemBootstrap;
  
  // 自動初期化
  if (BOOTSTRAP_CONFIG.autoInitialize) {
    // DOM準備完了後またはすぐに実行
    const autoBootstrap = async () => {
      try {
        const bootstrap = new HAQEIErrorSystemBootstrap();
        await bootstrap.bootstrap();
        global.haqeiErrorBootstrap = bootstrap;
      } catch (error) {
        console.error("❌ Auto-bootstrap failed:", error);
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoBootstrap, { once: true });
    } else {
      // 少し遅延して実行（他のスクリプトの読み込みを待つ）
      setTimeout(autoBootstrap, 100);
    }
  }
  
  console.log("🌟 HAQEI Error System Bootstrap ready for auto-initialization");
  
})(typeof window !== 'undefined' ? window : global);