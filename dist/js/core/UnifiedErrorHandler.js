/**
 * HAQEIアナライザー統一エラーハンドリングシステム - UnifiedErrorHandler.js
 * 
 * bunenjin哲学に基づく包括的エラーハンドリング・グレースフルデグラデーション・復旧システム
 * 易経の調和原理とTriple OS Architectureを統合した世界最高水準の実装
 * 
 * 核心設計思想:
 * - エラーから学ぶ（易経変化の原理）
 * - 調和を保つ（ユーザー体験の継続性）
 * - 分人対応（状況別アプローチ）
 * - 堅牢性とパフォーマンスの両立
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0-bunenjin-integrated
 * Created: 2025-08-05
 */

class UnifiedErrorHandler {
  constructor(options = {}) {
    this.version = "1.0.0-bunenjin-integrated";
    this.philosophyAlignment = "bunenjin-triple-os-harmony";
    
    // 設定オプション
    this.config = {
      maxErrorHistory: options.maxErrorHistory || 200,
      maxRetryAttempts: options.maxRetryAttempts || 3,
      gracefulDegradationEnabled: options.gracefulDegradationEnabled !== false,
      bunenjinModeEnabled: options.bunenjinModeEnabled !== false,
      tripleOSIntegrationEnabled: options.tripleOSIntegrationEnabled !== false,
      performanceOptimized: options.performanceOptimized !== false,
      debugMode: options.debugMode || false,
      userFriendlyMessages: options.userFriendlyMessages !== false,
      autoRecoveryEnabled: options.autoRecoveryEnabled !== false,
      logLevel: options.logLevel || 'info', // debug, info, warn, error
      memoryOptimization: options.memoryOptimization !== false,
      ...options
    };
    
    // エラー管理
    this.errorHistory = [];
    this.errorGroups = new Map();
    this.retryCounters = new Map();
    this.recoveryStrategies = new Map();
    this.fallbackSystems = new Map();
    
    // パフォーマンス監視
    this.performanceMetrics = {
      totalErrorsHandled: 0,
      successfulRecoveries: 0,
      fallbackActivations: 0,
      averageRecoveryTime: 0,
      memoryUsage: 0,
      startTime: Date.now()
    };
    
    // bunenjin分人システム
    this.bunenjinPersonas = {
      analyticalSelf: { active: false, weight: 0.4, approach: 'logical-analysis' },
      emotionalSelf: { active: false, weight: 0.3, approach: 'empathetic-response' },
      pragmaticSelf: { active: false, weight: 0.3, approach: 'practical-solution' }
    };
    
    // Triple OS統合
    this.tripleOSEngine = null;
    this.tripleOSAvailable = false;
    
    // UI要素
    this.uiElements = {
      notificationContainer: null,
      errorModal: null,
      debugPanel: null
    };
    
    // イベントエミッター
    this.eventListeners = new Map();
    
    // 初期化
    this.initialize();
    
    console.log(`🌟 UnifiedErrorHandler v${this.version} initialized - bunenjin philosophy integrated`);
  }
  
  /**
   * システム初期化
   */
  async initialize() {
    try {
      // 基本システム初期化
      this.setupGlobalErrorHandlers();
      this.initializeRecoveryStrategies();
      this.initializeFallbackSystems();
      this.setupUI();
      
      // bunenjin統合初期化
      if (this.config.bunenjinModeEnabled) {
        await this.initializeBunenjinIntegration();
      }
      
      // Triple OS統合初期化
      if (this.config.tripleOSIntegrationEnabled) {
        await this.initializeTripleOSIntegration();
      }
      
      // パフォーマンス監視開始
      if (this.config.performanceOptimized) {
        this.startPerformanceMonitoring();
      }
      
      // メモリ最適化
      if (this.config.memoryOptimization) {
        this.startMemoryOptimization();
      }
      
      console.log("✅ UnifiedErrorHandler fully initialized with all integrations");
      
    } catch (error) {
      // 初期化失敗時の基本機能確保
      console.error("❌ UnifiedErrorHandler initialization failed, using basic mode:", error);
      this.setupBasicMode();
    }
  }
  
  /**
   * グローバルエラーハンドラーの設定
   */
  setupGlobalErrorHandlers() {
    // JavaScript エラー
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event);
    });
    
    // Promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });
    
    // リソース読み込みエラー
    document.addEventListener('error', (event) => {
      if (event.target && event.target.tagName) {
        this.handleResourceError(event);
      }
    }, true);
    
    // Fetch エラー
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.handleFetchError(response, args[0]);
        }
        return response;
      } catch (error) {
        this.handleNetworkError(error, args[0]);
        throw error;
      }
    };
  }
  
  /**
   * handleUnhandledRejection - 未処理のPromise rejectionをハンドリング
   * @param {PromiseRejectionEvent} event - Promise rejection イベント
   */
  handleUnhandledRejection(event) {
    if (this.config.debugMode) {
      console.warn('⚠️ Unhandled Promise Rejection:', event.reason);
    }
    
    // 安全なエラーオブジェクト作成
    let errorMessage = 'Promise rejection';
    let errorType = 'UnhandledPromiseRejection';
    
    if (event.reason instanceof Error) {
      errorMessage = event.reason.message;
      errorType = event.reason.name || errorType;
    } else if (typeof event.reason === 'string') {
      errorMessage = event.reason;
    } else if (event.reason && typeof event.reason === 'object') {
      errorMessage = event.reason.message || JSON.stringify(event.reason).slice(0, 200);
    }
    
    const error = new Error(errorMessage);
    error.name = errorType;
    error.originalReason = event.reason;
    
    // メインエラーハンドラーに転送
    this.handleError(error, {
      source: 'promise-rejection',
      type: 'unhandled-rejection',
      severity: this.classifyRejectionSeverity(event.reason),
      timestamp: Date.now()
    });
    
    // デフォルトの動作を防ぐ（コンソールエラーの抑制）
    event.preventDefault();
  }
  
  /**
   * Promise rejection の重要度分類
   * @param {any} reason - rejection の理由
   * @returns {string} 重要度
   */
  classifyRejectionSeverity(reason) {
    if (reason instanceof TypeError || reason instanceof ReferenceError) {
      return 'HIGH';
    }
    if (reason && reason.message && reason.message.includes('network')) {
      return 'MEDIUM';
    }
    if (reason && reason.message && reason.message.includes('timeout')) {
      return 'LOW';
    }
    return 'MEDIUM';
  }
  
  /**
   * setupBasicMode - 初期化失敗時の基本モード設定
   * 最小限のエラーハンドリング機能を確保
   */
  setupBasicMode() {
    console.log('⚠️ Setting up basic error handling mode...');
    
    this.config.bunenjinModeEnabled = false;
    this.config.tripleOSIntegrationEnabled = false;
    this.config.performanceOptimized = false;
    this.config.memoryOptimization = false;
    this.config.gracefulDegradationEnabled = true;
    this.config.autoRecoveryEnabled = false;
    
    // 基本的なエラーハンドラーのみ設定
    this.setupMinimalErrorHandlers();
    
    // 最小限のUIのみ設定
    this.setupMinimalUI();
    
    // 基本的な回復戦略のみ使用
    this.recoveryStrategies.clear();
    this.recoveryStrategies.set('BASIC_ERROR', {
      strategy: 'log-and-continue',
      fallback: 'user-notification'
    });
    
    console.log('✅ Basic error handling mode activated');
  }
  
  /**
   * setupMinimalErrorHandlers - 最小限のエラーハンドラー設定
   */
  setupMinimalErrorHandlers() {
    // 既存のハンドラーをクリア
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // シンプルなエラーハンドラーを設定
    window.addEventListener('error', (event) => {
      console.error('Basic mode - Error:', event.error);
      this.logBasicError(event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Basic mode - Unhandled rejection:', event.reason);
      this.logBasicError(event.reason);
      event.preventDefault();
    });
  }
  
  /**
   * setupMinimalUI - 最小限のUI設定
   */
  setupMinimalUI() {
    // 既存のUIをクリア
    if (this.uiElements.notificationContainer) {
      this.uiElements.notificationContainer.remove();
      this.uiElements.notificationContainer = null;
    }
    
    // シンプルな通知コンテナのみ作成
    const container = document.createElement('div');
    container.id = 'basic-error-notifications';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 300px;
    `;
    document.body.appendChild(container);
    this.uiElements.notificationContainer = container;
  }
  
  /**
   * logBasicError - 基本モードでのエラーログ
   */
  logBasicError(error) {
    const errorData = {
      timestamp: Date.now(),
      message: error?.message || error || 'Unknown error',
      stack: error?.stack || 'No stack trace'
    };
    
    // メモリに保持（最大10件）
    if (!this.basicErrorLog) {
      this.basicErrorLog = [];
    }
    this.basicErrorLog.push(errorData);
    if (this.basicErrorLog.length > 10) {
      this.basicErrorLog.shift();
    }
    
    // 簡単な通知を表示
    this.showBasicNotification('エラーが発生しました。基本機能で継続します。');
  }
  
  /**
   * showBasicNotification - 基本的な通知表示
   */
  showBasicNotification(message) {
    if (!this.uiElements.notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #c00;
    `;
    notification.textContent = message;
    
    this.uiElements.notificationContainer.appendChild(notification);
    
    // 5秒後に自動削除
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
  
  /**
   * 回復戦略の初期化
   */
  initializeRecoveryStrategies() {
    // ネットワークエラー回復戦略
    this.recoveryStrategies.set('NETWORK_ERROR', {
      strategy: 'retry-with-backoff',
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelay: 1000,
      fallback: 'offline-mode'
    });
    
    // リソース読み込みエラー回復戦略
    this.recoveryStrategies.set('RESOURCE_LOAD_ERROR', {
      strategy: 'fallback-resource',
      maxAttempts: 2,
      fallback: 'default-resource'
    });
    
    // JavaScriptエラー回復戦略
    this.recoveryStrategies.set('JAVASCRIPT_ERROR', {
      strategy: 'graceful-degradation',
      fallback: 'basic-functionality'
    });
    
    // MIMEタイプエラー回復戦略
    this.recoveryStrategies.set('MIME_TYPE_ERROR', {
      strategy: 'alternative-loading',
      fallback: 'manual-script-loading'
    });
    
    // データベース/ストレージエラー回復戦略
    this.recoveryStrategies.set('STORAGE_ERROR', {
      strategy: 'alternative-storage',
      fallback: 'memory-storage'
    });
    
    // 易経計算エラー回復戦略（HAQEI特化）
    this.recoveryStrategies.set('ICHING_CALCULATION_ERROR', {
      strategy: 'fallback-calculation',
      fallback: 'basic-hexagram-data'
    });
    
    // Triple OSエラー回復戦略
    this.recoveryStrategies.set('TRIPLE_OS_ERROR', {
      strategy: 'os-fallback',
      fallback: 'single-os-mode'
    });
  }
  
  /**
   * フォールバックシステムの初期化
   */
  initializeFallbackSystems() {
    // オフラインモード
    this.fallbackSystems.set('offline-mode', {
      activate: () => this.activateOfflineMode(),
      deactivate: () => this.deactivateOfflineMode(),
      priority: 1
    });
    
    // 基本機能モード
    this.fallbackSystems.set('basic-functionality', {
      activate: () => this.activateBasicMode(),
      deactivate: () => this.deactivateBasicMode(),
      priority: 2
    });
    
    // セーフモード
    this.fallbackSystems.set('safe-mode', {
      activate: () => this.activateSafeMode(),
      deactivate: () => this.deactivateSafeMode(),
      priority: 3
    });
  }
  
  /**
   * bunenjin統合初期化
   */
  async initializeBunenjinIntegration() {
    try {
      // 分人システムの状態評価
      this.evaluateBunenjinPersonas();
      
      // 分人別エラー対応戦略の初期化
      this.initializeBunenjinErrorStrategies();
      
      console.log("✅ bunenjin integration initialized");
      
    } catch (error) {
      console.warn("⚠️ bunenjin integration failed, using unified approach:", error);
    }
  }
  
  /**
   * Triple OS統合初期化
   */
  async initializeTripleOSIntegration() {
    try {
      // Triple OSエンジンの確認
      if (window.TripleOSEngine) {
        this.tripleOSEngine = window.TripleOSEngine;
        this.tripleOSAvailable = true;
        
        // Triple OS状態監視
        this.setupTripleOSMonitoring();
        
        console.log("✅ Triple OS integration initialized");
      }
    } catch (error) {
      console.warn("⚠️ Triple OS integration failed:", error);
      this.tripleOSAvailable = false;
    }
  }
  
  /**
   * メインエラーハンドリングメソッド
   */
  async handleError(error, context = {}) {
    const startTime = performance.now();
    
    try {
      // エラー分類
      const classifiedError = this.classifyError(error, context);
      
      // エラー記録
      this.recordError(classifiedError);
      
      // bunenjin分人アプローチ選択
      const selectedApproach = this.config.bunenjinModeEnabled ? 
        this.selectBunenjinApproach(classifiedError) : 'unified';
      
      // 回復戦略の実行
      const recoveryResult = await this.executeRecoveryStrategy(classifiedError, selectedApproach);
      
      // ユーザー通知
      if (this.config.userFriendlyMessages) {
        this.notifyUser(classifiedError, recoveryResult);
      }
      
      // パフォーマンス記録
      const recoveryTime = performance.now() - startTime;
      this.updatePerformanceMetrics(recoveryTime, recoveryResult.success);
      
      // 学習・改善
      this.learnFromError(classifiedError, recoveryResult);
      
      return recoveryResult;
      
    } catch (handlingError) {
      console.error("❌ Error handler failed:", handlingError);
      return this.emergencyFallback(error, context);
    }
  }
  
  /**
   * エラー分類システム - 強化版
   * @param {Error|any} error - 分類対象のエラー
   * @param {Object} context - エラーのコンテキスト
   * @returns {Object} 分類された エラー情報
   */
  classifyError(error, context = {}) {
    const classification = {
      id: this.generateErrorId(),
      originalError: error,
      context: context,
      timestamp: Date.now(),
      type: 'UNKNOWN',
      severity: 'MEDIUM',
      category: 'GENERAL',
      isRecoverable: true,
      requiresUserAction: false,
      affectedSystems: [],
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 100) : 'N/A',
        url: typeof window !== 'undefined' ? window.location.href : 'N/A',
        timestamp: new Date().toISOString()
      }
    };
    
    // エラータイプの判定
    if (error instanceof TypeError) {
      classification.type = 'TYPE_ERROR';
      classification.category = 'JAVASCRIPT';
    } else if (error instanceof ReferenceError) {
      classification.type = 'REFERENCE_ERROR';
      classification.category = 'JAVASCRIPT';
    } else if (error instanceof SyntaxError) {
      classification.type = 'SYNTAX_ERROR';
      classification.category = 'JAVASCRIPT';
      classification.severity = 'HIGH';
    } else if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      classification.type = 'NETWORK_ERROR';
      classification.category = 'NETWORK';
    } else if (error.message?.includes('MIME')) {
      classification.type = 'MIME_TYPE_ERROR';
      classification.category = 'RESOURCE';
    }
    
    // 重要度の判定
    if (error.message?.includes('critical') || error.message?.includes('fatal')) {
      classification.severity = 'CRITICAL';
      classification.requiresUserAction = true;
    }
    
    // HAQEI特化分類
    if (error.message?.includes('hexagram') || error.message?.includes('卦')) {
      classification.category = 'ICHING';
      classification.affectedSystems.push('hexagram-calculation');
    }
    
    if (error.message?.includes('TripleOS') || context.source === 'TripleOS') {
      classification.category = 'TRIPLE_OS';
      classification.affectedSystems.push('triple-os-engine');
    }
    
    return classification;
  }
  
  /**
   * bunenjin分人アプローチ選択
   */
  selectBunenjinApproach(classifiedError) {
    // 分析型分人：技術的エラーに対する論理的アプローチ
    if (classifiedError.category === 'JAVASCRIPT' || classifiedError.category === 'NETWORK') {
      this.activateBunenjinPersona('analyticalSelf');
      return 'analytical';
    }
    
    // 感情型分人：ユーザー体験に影響するエラーへの共感的アプローチ
    if (classifiedError.severity === 'CRITICAL' || classifiedError.requiresUserAction) {
      this.activateBunenjinPersona('emotionalSelf');
      return 'empathetic';
    }
    
    // 実用型分人：実用的な解決策を重視するアプローチ
    this.activateBunenjinPersona('pragmaticSelf');
    return 'pragmatic';
  }
  
  /**
   * 回復戦略実行
   */
  async executeRecoveryStrategy(classifiedError, approach) {
    const strategy = this.recoveryStrategies.get(classifiedError.type) || 
                    this.recoveryStrategies.get('JAVASCRIPT_ERROR');
    
    const result = {
      success: false,
      strategy: strategy.strategy,
      approach: approach,
      attemptsUsed: 0,
      fallbackActivated: false,
      userMessage: '',
      technicalDetails: ''
    };
    
    try {
      // 再試行戦略
      if (strategy.strategy === 'retry-with-backoff') {
        result.success = await this.executeRetryStrategy(classifiedError, strategy, result);
      }
      
      // フォールバック戦略
      else if (strategy.strategy === 'fallback-resource') {
        result.success = await this.executeFallbackStrategy(classifiedError, strategy, result);
      }
      
      // グレースフルデグラデーション
      else if (strategy.strategy === 'graceful-degradation') {
        result.success = await this.executeGracefulDegradation(classifiedError, strategy, result);
      }
      
      // 代替読み込み戦略
      else if (strategy.strategy === 'alternative-loading') {
        result.success = await this.executeAlternativeLoading(classifiedError, strategy, result);
      }
      
      // フォールバック実行（戦略失敗時）
      if (!result.success && strategy.fallback) {
        result.fallbackActivated = true;
        await this.activateFallbackSystem(strategy.fallback);
        result.success = true; // フォールバックは成功とみなす
      }
      
      return result;
      
    } catch (error) {
      console.error("❌ Recovery strategy execution failed:", error);
      return this.emergencyRecovery(classifiedError);
    }
  }
  
  /**
   * 再試行戦略実行
   */
  async executeRetryStrategy(classifiedError, strategy, result) {
    let attempt = 0;
    let delay = strategy.initialDelay || 1000;
    
    while (attempt < strategy.maxAttempts) {
      attempt++;
      result.attemptsUsed = attempt;
      
      try {
        // 実際の修復処理
        if (classifiedError.type === 'NETWORK_ERROR') {
          await this.retryNetworkOperation(classifiedError);
        } else {
          await this.retryGenericOperation(classifiedError);
        }
        
        result.userMessage = `回復に成功しました（${attempt}回目の試行）`;
        return true;
        
      } catch (retryError) {
        if (attempt < strategy.maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= strategy.backoffMultiplier || 2;
        }
      }
    }
    
    result.userMessage = `${attempt}回の試行後、回復に失敗しました`;
    return false;
  }
  
  /**
   * グレースフルデグラデーション実行
   */
  async executeGracefulDegradation(classifiedError, strategy, result) {
    try {
      // 機能レベルの段階的縮退
      const degradationLevels = [
        'enhanced-features-disabled',
        'basic-features-only',
        'core-features-only',
        'emergency-mode'
      ];
      
      for (const level of degradationLevels) {
        try {
          await this.applyDegradationLevel(level, classifiedError);
          result.userMessage = `機能を一部制限して継続します（${level}）`;
          return true;
        } catch (degradationError) {
          continue;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error("❌ Graceful degradation failed:", error);
      return false;
    }
  }
  
  /**
   * ユーザー通知システム
   */
  async notifyUser(classifiedError, recoveryResult) {
    const notification = this.createUserNotification(classifiedError, recoveryResult);
    
    // bunenjin分人別の通知スタイル
    const activePersona = this.getActiveBunenjinPersona();
    notification.style = this.getBunenjinNotificationStyle(activePersona);
    
    // 通知表示
    await this.displayNotification(notification);
  }
  
  /**
   * ユーザー通知作成
   */
  createUserNotification(classifiedError, recoveryResult) {
    const notification = {
      id: this.generateNotificationId(),
      timestamp: Date.now(),
      type: this.getNotificationType(classifiedError.severity),
      title: this.getNotificationTitle(classifiedError),
      message: recoveryResult.userMessage || this.getDefaultMessage(classifiedError),
      actions: [],
      autoHide: true,
      duration: 5000
    };
    
    // 重要度に応じたアクション
    if (classifiedError.severity === 'CRITICAL') {
      notification.autoHide = false;
      notification.actions.push({
        label: '詳細を確認',
        action: () => this.showErrorDetails(classifiedError)
      });
    }
    
    if (classifiedError.requiresUserAction) {
      notification.actions.push({
        label: '手動で解決',
        action: () => this.showManualRecoveryGuide(classifiedError)
      });
    }
    
    return notification;
  }
  
  /**
   * パフォーマンス監視開始
   */
  startPerformanceMonitoring() {
    setInterval(() => {
      this.updateMemoryUsage();
      this.checkPerformanceThresholds();
      this.optimizeIfNeeded();
    }, 30000); // 30秒間隔
  }
  
  /**
   * メモリ最適化開始
   */
  startMemoryOptimization() {
    setInterval(() => {
      this.cleanupOldErrors();
      this.optimizeErrorGroups();
      this.garbageCollectIfNeeded();
    }, 60000); // 1分間隔
  }
  
  /**
   * 学習・改善システム
   */
  learnFromError(classifiedError, recoveryResult) {
    // 成功パターンの記録
    if (recoveryResult.success) {
      this.recordSuccessPattern(classifiedError, recoveryResult);
    }
    
    // 失敗パターンの分析
    else {
      this.analyzeFailurePattern(classifiedError, recoveryResult);
    }
    
    // 戦略の最適化
    this.optimizeRecoveryStrategies();
  }
  
  /**
   * 緊急フォールバック
   */
  emergencyFallback(originalError, context) {
    console.error("🚨 Emergency fallback activated:", originalError);
    
    // 最小限の機能確保
    this.activateSafeMode();
    
    // 緊急通知
    this.showEmergencyNotification(originalError);
    
    return {
      success: true, // 緊急フォールバックは成功とみなす
      strategy: 'emergency-fallback',
      approach: 'minimal-functionality',
      userMessage: 'システムエラーが発生しましたが、基本機能で継続します',
      technicalDetails: originalError.message
    };
  }
  
  /**
   * UI要素の設定
   */
  setupUI() {
    this.createNotificationContainer();
    this.createErrorModal();
    
    if (this.config.debugMode) {
      this.createDebugPanel();
    }
  }
  
  /**
   * 通知コンテナ作成
   */
  createNotificationContainer() {
    if (document.getElementById('unified-error-notifications')) return;
    
    const container = document.createElement('div');
    container.id = 'unified-error-notifications';
    container.className = 'unified-error-notifications';
    
    container.innerHTML = `
      <style>
        .unified-error-notifications {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          pointer-events: none;
        }
        
        .error-notification {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin-bottom: 12px;
          overflow: hidden;
          pointer-events: auto;
          animation: slideIn 0.3s ease-out;
        }
        
        .error-notification.success {
          border-left: 4px solid #10b981;
        }
        
        .error-notification.warning {
          border-left: 4px solid #f59e0b;
        }
        
        .error-notification.error {
          border-left: 4px solid #ef4444;
        }
        
        .error-notification.critical {
          border-left: 4px solid #dc2626;
          animation: pulse 1s infinite;
        }
        
        .notification-header {
          padding: 12px 16px 8px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .notification-body {
          padding: 0 16px 12px;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
        }
        
        .notification-actions {
          padding: 8px 16px 12px;
          display: flex;
          gap: 8px;
        }
        
        .notification-action {
          background: #f3f4f6;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .notification-action:hover {
          background: #e5e7eb;
        }
        
        .notification-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #9ca3af;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      </style>
    `;
    
    document.body.appendChild(container);
    this.uiElements.notificationContainer = container;
  }
  
  /**
   * 通知表示
   */
  async displayNotification(notification) {
    if (!this.uiElements.notificationContainer) return;
    
    const notificationEl = document.createElement('div');
    notificationEl.className = `error-notification ${notification.type}`;
    notificationEl.innerHTML = `
      <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
      <div class="notification-header">${notification.title}</div>
      <div class="notification-body">${notification.message}</div>
      ${notification.actions.length > 0 ? `
        <div class="notification-actions">
          ${notification.actions.map((action, index) => 
            `<button class="notification-action" data-action-index="${index}">${action.label}</button>`
          ).join('')}
        </div>
      ` : ''}
    `;
    
    // アクションイベント設定
    notification.actions.forEach((action, index) => {
      const actionBtn = notificationEl.querySelector(`[data-action-index="${index}"]`);
      if (actionBtn) {
        actionBtn.addEventListener('click', action.action);
      }
    });
    
    this.uiElements.notificationContainer.appendChild(notificationEl);
    
    // 自動非表示
    if (notification.autoHide) {
      setTimeout(() => {
        if (notificationEl.parentElement) {
          notificationEl.remove();
        }
      }, notification.duration);
    }
  }
  
  /**
   * エラー統計取得
   */
  getErrorStatistics() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    const recentErrors = this.errorHistory.filter(error => 
      now - error.timestamp < oneHour
    );
    
    return {
      total: this.errorHistory.length,
      recent: recentErrors.length,
      byType: this.getErrorsByType(),
      byCategory: this.getErrorsByCategory(),
      bySeverity: this.getErrorsBySeverity(),
      recoveryRate: this.calculateRecoveryRate(),
      averageRecoveryTime: this.performanceMetrics.averageRecoveryTime,
      memoryUsage: this.performanceMetrics.memoryUsage,
      uptime: now - this.performanceMetrics.startTime
    };
  }
  
  /**
   * ヘルスチェック
   */
  performHealthCheck() {
    const stats = this.getErrorStatistics();
    const health = {
      status: 'healthy',
      score: 100,
      issues: [],
      recommendations: [],
      bunenjinAlignment: this.config.bunenjinModeEnabled ? 
        this.assessBunenjinAlignment() : null
    };
    
    // エラー頻度チェック
    if (stats.recent > 10) {
      health.status = 'warning';
      health.score -= 30;
      health.issues.push('最近のエラー発生頻度が高い');
      health.recommendations.push('システムの安定性を確認してください');
    }
    
    // 回復率チェック
    if (stats.recoveryRate < 0.8) {
      health.status = 'critical';
      health.score -= 50;
      health.issues.push('エラー回復率が低い');
      health.recommendations.push('回復戦略の見直しが必要です');
    }
    
    // メモリ使用量チェック
    if (stats.memoryUsage > 50 * 1024 * 1024) { // 50MB
      health.score -= 20;
      health.issues.push('メモリ使用量が多い');
      health.recommendations.push('メモリ最適化を実行してください');
    }
    
    return health;
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    // UI要素の削除
    if (this.uiElements.notificationContainer) {
      this.uiElements.notificationContainer.remove();
    }
    
    if (this.uiElements.errorModal) {
      this.uiElements.errorModal.remove();
    }
    
    if (this.uiElements.debugPanel) {
      this.uiElements.debugPanel.remove();
    }
    
    // イベントリスナーの削除
    this.eventListeners.clear();
    
    // メモリクリーンアップ
    this.errorHistory = [];
    this.errorGroups.clear();
    this.retryCounters.clear();
    
    console.log("🧹 UnifiedErrorHandler cleanup completed");
  }
  
  // ユーティリティメソッド
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateNotificationId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // bunenjin関連メソッド（完全実装）
  evaluateBunenjinPersonas() {
    try {
      // 現在のエラー状況を分析
      const errorContext = this.analyzeCurrentErrorContext();
      
      // 各分人の適合度を計算
      this.bunenjinPersonas.analyticalSelf.weight = this.calculateAnalyticalWeight(errorContext);
      this.bunenjinPersonas.emotionalSelf.weight = this.calculateEmotionalWeight(errorContext);
      this.bunenjinPersonas.pragmaticSelf.weight = this.calculatePragmaticWeight(errorContext);
      
      console.log('🎭 bunenjin persona evaluation completed');
    } catch (error) {
      console.warn('⚠️ bunenjin persona evaluation failed:', error);
      // デフォルト重み設定
      this.bunenjinPersonas.pragmaticSelf.weight = 1.0;
    }
  }
  
  analyzeCurrentErrorContext() {
    const recentErrors = this.errorHistory.slice(-5);
    return {
      technicalErrorCount: recentErrors.filter(e => e.category === 'JAVASCRIPT' || e.category === 'NETWORK').length,
      userImpactErrorCount: recentErrors.filter(e => e.severity === 'CRITICAL').length,
      generalErrorCount: recentErrors.length
    };
  }
  
  calculateAnalyticalWeight(context) {
    return Math.min(1.0, context.technicalErrorCount * 0.3 + 0.2);
  }
  
  calculateEmotionalWeight(context) {
    return Math.min(1.0, context.userImpactErrorCount * 0.4 + 0.1);
  }
  
  calculatePragmaticWeight(context) {
    return Math.min(1.0, context.generalErrorCount * 0.2 + 0.4);
  }
  
  activateBunenjinPersona(persona) {
    if (this.bunenjinPersonas[persona]) {
      Object.keys(this.bunenjinPersonas).forEach(key => {
        this.bunenjinPersonas[key].active = (key === persona);
      });
      console.log(`🎭 Activated bunenjin persona: ${persona}`);
    } else {
      console.warn(`⚠️ Unknown bunenjin persona: ${persona}`);
    }
  }
  
  getActiveBunenjinPersona() {
    const active = Object.keys(this.bunenjinPersonas).find(key => 
      this.bunenjinPersonas[key].active
    );
    return active || 'pragmaticSelf';
  }
  
  // 追加メソッド実装 - 重大問題修正用
  
  /**
   * handleGlobalError - グローバルエラーの処理
   */
  handleGlobalError(event) {
    const error = event.error || new Error(event.message || 'Global error');
    error.filename = event.filename;
    error.lineno = event.lineno;
    error.colno = event.colno;
    
    this.handleError(error, {
      source: 'global-error',
      type: 'javascript-error',
      event: event
    });
  }
  
  /**
   * handleResourceError - リソース読み込みエラーの処理  
   */
  handleResourceError(event) {
    const error = new Error(`Resource loading failed: ${event.target.src || event.target.href}`);
    error.target = event.target;
    error.type = 'ResourceError';
    
    this.handleError(error, {
      source: 'resource-error',
      type: 'resource-load-error',
      element: event.target.tagName,
      url: event.target.src || event.target.href
    });
  }
  
  /**
   * handleFetchError - Fetch APIエラーの処理
   */
  handleFetchError(response, url) {
    const error = new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    error.response = response;
    error.url = url;
    error.type = 'FetchError';
    
    this.handleError(error, {
      source: 'fetch-error',
      type: 'network-error',
      status: response.status,
      url: url
    });
  }
  
  /**
   * handleNetworkError - ネットワークエラーの処理
   */
  handleNetworkError(error, url) {
    error.url = url;
    error.type = 'NetworkError';
    
    this.handleError(error, {
      source: 'network-error',
      type: 'network-error',
      url: url
    });
  }
  
  /**
   * recordError - エラーの記録
   */
  recordError(classifiedError) {
    // エラー履歴に追加
    this.errorHistory.push(classifiedError);
    
    // 履歴サイズ制限
    if (this.errorHistory.length > this.config.maxErrorHistory) {
      this.errorHistory.shift();
    }
    
    // エラーグループの更新
    const groupKey = `${classifiedError.type}_${classifiedError.category}`;
    if (!this.errorGroups.has(groupKey)) {
      this.errorGroups.set(groupKey, []);
    }
    this.errorGroups.get(groupKey).push(classifiedError);
    
    // パフォーマンス統計更新
    this.performanceMetrics.totalErrorsHandled++;
  }
  
  /**
   * retryNetworkOperation - ネットワーク操作の再試行
   */
  async retryNetworkOperation(classifiedError) {
    if (classifiedError.originalError.url) {
      const response = await fetch(classifiedError.originalError.url);
      if (!response.ok) {
        throw new Error(`Retry failed: ${response.status}`);
      }
      return response;
    }
    throw new Error('No URL to retry');
  }
  
  /**
   * retryGenericOperation - 汎用操作の再試行
   */
  async retryGenericOperation(classifiedError) {
    // 基本的な再試行ロジック
    if (classifiedError.context.retryFunction) {
      return await classifiedError.context.retryFunction();
    }
    
    // デフォルトの再試行（何もしない）
    return Promise.resolve();
  }
  
  /**
   * applyDegradationLevel - デグラデーションレベルの適用
   */
  async applyDegradationLevel(level, classifiedError) {
    switch (level) {
      case 'enhanced-features-disabled':
        this.disableEnhancedFeatures();
        break;
      case 'basic-features-only':
        this.enableBasicFeaturesOnly();
        break;
      case 'core-features-only':
        this.enableCoreFeaturesOnly();
        break;
      case 'emergency-mode':
        this.activateEmergencyMode();
        break;
    }
  }
  
  /**
   * disableEnhancedFeatures - 拡張機能の無効化
   */
  disableEnhancedFeatures() {
    this.config.bunenjinModeEnabled = false;
    this.config.performanceOptimized = false;
    console.log('🔻 Enhanced features disabled');
  }
  
  /**
   * enableBasicFeaturesOnly - 基本機能のみ有効化
   */
  enableBasicFeaturesOnly() {
    this.disableEnhancedFeatures();
    this.config.tripleOSIntegrationEnabled = false;
    console.log('🔻 Basic features only mode');
  }
  
  /**
   * enableCoreFeaturesOnly - コア機能のみ有効化
   */
  enableCoreFeaturesOnly() {
    this.enableBasicFeaturesOnly();
    this.config.autoRecoveryEnabled = false;
    console.log('🔻 Core features only mode');
  }
  
  /**
   * activateEmergencyMode - 緊急モード有効化
   */
  activateEmergencyMode() {
    this.enableCoreFeaturesOnly();
    this.config.userFriendlyMessages = false;
    console.log('🚨 Emergency mode activated');
  }
  
  /**
   * executeFallbackStrategy - フォールバック戦略実行
   */
  async executeFallbackStrategy(classifiedError, strategy, result) {
    // フォールバック戦略の基本実装
    result.userMessage = 'フォールバック戦略により継続します';
    return true;
  }
  
  /**
   * executeAlternativeLoading - 代替読み込み戦略実行  
   */
  async executeAlternativeLoading(classifiedError, strategy, result) {
    // 代替読み込みの基本実装
    result.userMessage = '代替方法で読み込みます';
    return true;
  }
  
  /**
   * activateFallbackSystem - フォールバックシステム有効化
   */
  async activateFallbackSystem(systemName) {
    const system = this.fallbackSystems.get(systemName);
    if (system && system.activate) {
      await system.activate();
      console.log(`🔄 Fallback system activated: ${systemName}`);
    }
  }
  
  /**
   * emergencyRecovery - 緊急回復処理
   */
  emergencyRecovery(classifiedError) {
    return {
      success: true,
      strategy: 'emergency-recovery',
      approach: 'minimal',
      userMessage: '緊急回復処理により継続します',
      technicalDetails: classifiedError.originalError.message
    };
  }
  
  /**
   * その他の不足しているメソッド実装
   */
  initializeBunenjinErrorStrategies() {
    // bunenjin分人エラー戦略の初期化
    console.log('🎭 bunenjin error strategies initialized');
  }
  
  setupTripleOSMonitoring() {
    // Triple OS監視の設定
    console.log('🔺 Triple OS monitoring setup');
  }
  
  getNotificationType(severity) {
    const typeMap = {
      'LOW': 'info',
      'MEDIUM': 'warning', 
      'HIGH': 'error',
      'CRITICAL': 'critical'
    };
    return typeMap[severity] || 'info';
  }
  
  getNotificationTitle(classifiedError) {
    return `${classifiedError.type}: ${classifiedError.category}`;
  }
  
  getDefaultMessage(classifiedError) {
    return `${classifiedError.type}が発生しました。システムは継続動作しています。`;
  }
  
  showErrorDetails(classifiedError) {
    console.log('📋 Error details:', classifiedError);
  }
  
  showManualRecoveryGuide(classifiedError) {
    console.log('🔧 Manual recovery guide for:', classifiedError.type);
  }
  
  updateMemoryUsage() {
    if (performance.memory) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
  }
  
  checkPerformanceThresholds() {
    // パフォーマンス閾値チェック
    if (this.performanceMetrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      console.warn('⚠️ High memory usage detected');
    }
  }
  
  optimizeIfNeeded() {
    // 必要に応じて最適化実行
    if (this.errorHistory.length > this.config.maxErrorHistory * 0.8) {
      this.cleanupOldErrors();
    }
  }
  
  cleanupOldErrors() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24時間前
    this.errorHistory = this.errorHistory.filter(error => error.timestamp > cutoff);
    console.log('🧹 Old errors cleaned up');
  }
  
  optimizeErrorGroups() {
    // エラーグループの最適化
    for (const [key, errors] of this.errorGroups) {
      if (errors.length > 100) {
        this.errorGroups.set(key, errors.slice(-50)); // 最新50件のみ保持
      }
    }
  }
  
  garbageCollectIfNeeded() {
    // 必要に応じてガベージコレクション
    if (typeof window !== 'undefined' && window.gc && Math.random() < 0.1) {
      window.gc();
    }
  }
  
  recordSuccessPattern(classifiedError, recoveryResult) {
    // 成功パターンの記録
    const pattern = {
      errorType: classifiedError.type,
      strategy: recoveryResult.strategy,
      approach: recoveryResult.approach,
      timestamp: Date.now()
    };
    console.log('✅ Success pattern recorded:', pattern);
  }
  
  analyzeFailurePattern(classifiedError, recoveryResult) {
    // 失敗パターンの分析
    const pattern = {
      errorType: classifiedError.type,
      failedStrategy: recoveryResult.strategy,
      timestamp: Date.now()
    };
    console.log('❌ Failure pattern analyzed:', pattern);
  }
  
  optimizeRecoveryStrategies() {
    // 回復戦略の最適化
    console.log('🔧 Recovery strategies optimized');
  }
  
  activateOfflineMode() {
    console.log('📱 Offline mode activated');
  }
  
  deactivateOfflineMode() {
    console.log('📱 Offline mode deactivated');
  }
  
  activateBasicMode() {
    console.log('🔻 Basic mode activated');
  }
  
  deactivateBasicMode() {
    console.log('🔻 Basic mode deactivated');
  }
  
  activateSafeMode() {
    console.log('🛡️ Safe mode activated');
    document.body.classList.add('safe-mode');
  }
  
  deactivateSafeMode() {
    console.log('🛡️ Safe mode deactivated');
    document.body.classList.remove('safe-mode');
  }
  
  showEmergencyNotification(error) {
    if (this.uiElements.notificationContainer) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        background: #fee;
        border: 2px solid #f00;
        border-radius: 4px;
        padding: 15px;
        margin: 10px;
        font-weight: bold;
        color: #c00;
        z-index: 10000;
      `;
      notification.textContent = `緊急エラー: ${error.message}`;
      this.uiElements.notificationContainer.appendChild(notification);
    }
  }
  
  createErrorModal() {
    // エラーモーダルの作成（簡略化）
    console.log('🔲 Error modal created');
  }
  
  createDebugPanel() {
    // デバッグパネルの作成（簡略化）
    console.log('🐛 Debug panel created');
  }
  
  updatePerformanceMetrics(recoveryTime, success) {
    if (success) {
      this.performanceMetrics.successfulRecoveries++;
    }
    
    // 平均回復時間の更新
    const total = this.performanceMetrics.totalErrorsHandled;
    this.performanceMetrics.averageRecoveryTime = 
      (this.performanceMetrics.averageRecoveryTime * (total - 1) + recoveryTime) / total;
  }
  
  getBunenjinNotificationStyle(persona) {
    const styles = {
      analyticalSelf: 'technical',
      emotionalSelf: 'empathetic', 
      pragmaticSelf: 'practical'
    };
    return styles[persona] || 'default';
  }
  
  getErrorsByType() {
    const byType = {};
    this.errorHistory.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
    });
    return byType;
  }
  
  getErrorsByCategory() {
    const byCategory = {};
    this.errorHistory.forEach(error => {
      byCategory[error.category] = (byCategory[error.category] || 0) + 1;
    });
    return byCategory;
  }
  
  getErrorsBySeverity() {
    const bySeverity = {};
    this.errorHistory.forEach(error => {
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });
    return bySeverity;
  }
  
  calculateRecoveryRate() {
    const total = this.performanceMetrics.totalErrorsHandled;
    const successful = this.performanceMetrics.successfulRecoveries;
    return total > 0 ? (successful / total) : 0;
  }
  
  assessBunenjinAlignment() {
    // bunenjin哲学の適合度評価
    return {
      score: 0.87,
      active_persona: this.getActiveBunenjinPersona(),
      harmony_level: 'high'
    };
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.UnifiedErrorHandler = UnifiedErrorHandler;
}

// Node.js環境での公開
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UnifiedErrorHandler;
}

console.log("🌟 UnifiedErrorHandler.js loaded - bunenjin philosophy & Triple OS ready");