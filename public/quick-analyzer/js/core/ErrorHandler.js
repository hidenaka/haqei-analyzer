/**
 * ErrorHandler - アプリケーション全体のエラーハンドリングクラス
 * ユーザーフレンドリーなエラー表示と開発者向けデバッグ機能を提供
 */
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.debugMode = false;
    this.maxErrorHistory = 50;
    this.errorContainer = null;
    this.initialized = false;
    
    // エラータイプの定義
    this.ERROR_TYPES = {
      VALIDATION: 'validation',
      NETWORK: 'network',
      DATA: 'data',
      STORAGE: 'storage',
      CALCULATION: 'calculation',
      RENDERING: 'rendering',
      COMPONENT: 'component',
      SYSTEM: 'system'
    };
    
    // エラーレベルの定義
    this.ERROR_LEVELS = {
      DEBUG: 'debug',
      INFO: 'info',
      WARN: 'warn',
      ERROR: 'error',
      CRITICAL: 'critical'
    };
    
    // ユーザーメッセージの定義
    this.USER_MESSAGES = {
      [this.ERROR_TYPES.VALIDATION]: '入力された内容に問題があります。もう一度お試しください。',
      [this.ERROR_TYPES.NETWORK]: 'ネットワークに問題が発生しました。接続を確認してもう一度お試しください。',
      [this.ERROR_TYPES.DATA]: 'データの読み込みに失敗しました。ページを再読み込みしてお試しください。',
      [this.ERROR_TYPES.STORAGE]: 'データの保存に失敗しました。ブラウザの設定を確認してお試しください。',
      [this.ERROR_TYPES.CALCULATION]: '診断の計算中にエラーが発生しました。もう一度お試しください。',
      [this.ERROR_TYPES.RENDERING]: '画面の表示に問題が発生しました。ページを再読み込みしてお試しください。',
      [this.ERROR_TYPES.COMPONENT]: 'システムの初期化に失敗しました。ページを再読み込みしてお試しください。',
      [this.ERROR_TYPES.SYSTEM]: 'システムエラーが発生しました。しばらく時間をおいてもう一度お試しください。'
    };
    
    this.init();
  }

  /**
   * エラーハンドラーを初期化
   */
  init() {
    if (this.initialized) return;
    
    // デバッグモードの設定
    this.debugMode = this.isDebugMode();
    
    // グローバルエラーハンドラーの設定
    this.setupGlobalHandlers();
    
    // エラー表示コンテナの取得
    this.errorContainer = document.getElementById('error-container');
    
    this.initialized = true;
    this.log('info', 'init', 'ErrorHandler initialized', {
      debugMode: this.debugMode,
      hasErrorContainer: !!this.errorContainer
    });
  }

  /**
   * デバッグモードかどうかを判定
   * @returns {boolean}
   */
  isDebugMode() {
    return window.location.hostname === 'localhost' || 
           window.location.search.includes('debug=true') ||
           localStorage.getItem('haqei_debug') === 'true';
  }

  /**
   * グローバルエラーハンドラーの設定
   */
  setupGlobalHandlers() {
    // 未処理のエラーをキャッチ
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        type: this.ERROR_TYPES.SYSTEM,
        context: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // 未処理のPromise拒否をキャッチ
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: this.ERROR_TYPES.SYSTEM,
        context: 'unhandled_promise_rejection'
      });
    });
  }

  /**
   * メインのエラーハンドリングメソッド
   * @param {Error|string} error - エラーオブジェクトまたはメッセージ
   * @param {Object} context - エラーのコンテキスト情報
   */
  handleError(error, context = {}) {
    // エラーオブジェクトの正規化
    const normalizedError = this.normalizeError(error);
    
    // コンテキストの正規化
    const normalizedContext = this.normalizeContext(context);
    
    // エラー情報の作成
    const errorInfo = this.createErrorInfo(normalizedError, normalizedContext);
    
    // エラーの記録
    this.recordError(errorInfo);
    
    // ログ出力
    this.logError(errorInfo);
    
    // ユーザーへの通知
    this.notifyUser(errorInfo);
    
    // 開発者向け通知（デバッグモード時）
    if (this.debugMode) {
      this.notifyDeveloper(errorInfo);
    }
    
    // エラー統計の更新
    this.updateErrorStats(errorInfo);
  }

  /**
   * エラーオブジェクトを正規化
   * @param {Error|string} error - エラー
   * @returns {Error}
   */
  normalizeError(error) {
    if (error instanceof Error) {
      return error;
    } else if (typeof error === 'string') {
      return new Error(error);
    } else {
      return new Error('Unknown error occurred');
    }
  }

  /**
   * コンテキストを正規化
   * @param {Object} context - コンテキスト
   * @returns {Object}
   */
  normalizeContext(context) {
    return {
      type: context.type || this.ERROR_TYPES.SYSTEM,
      level: context.level || this.ERROR_LEVELS.ERROR,
      component: context.component || 'unknown',
      method: context.method || 'unknown',
      context: context.context || 'unknown',
      userId: context.userId || this.getUserId(),
      sessionId: context.sessionId || this.getSessionId(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context
    };
  }

  /**
   * エラー情報オブジェクトを作成
   * @param {Error} error - エラーオブジェクト
   * @param {Object} context - コンテキスト
   * @returns {Object}
   */
  createErrorInfo(error, context) {
    return {
      id: this.generateErrorId(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      timestamp: new Date().toISOString(),
      resolved: false
    };
  }

  /**
   * エラーIDを生成
   * @returns {string}
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * ユーザーIDを取得
   * @returns {string}
   */
  getUserId() {
    // セッションストレージからユーザーIDを取得、なければ生成
    let userId = sessionStorage.getItem('haqei_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('haqei_user_id', userId);
    }
    return userId;
  }

  /**
   * セッションIDを取得
   * @returns {string}
   */
  getSessionId() {
    // セッションストレージからセッションIDを取得、なければ生成
    let sessionId = sessionStorage.getItem('haqei_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('haqei_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * エラーを記録
   * @param {Object} errorInfo - エラー情報
   */
  recordError(errorInfo) {
    this.errors.push(errorInfo);
    
    // 履歴サイズの制限
    if (this.errors.length > this.maxErrorHistory) {
      this.errors = this.errors.slice(-this.maxErrorHistory);
    }
    
    // ローカルストレージにも保存（デバッグ用）
    if (this.debugMode) {
      try {
        const errorHistory = JSON.parse(localStorage.getItem('haqei_error_history') || '[]');
        errorHistory.push(errorInfo);
        localStorage.setItem('haqei_error_history', JSON.stringify(errorHistory.slice(-20)));
      } catch (e) {
        // ストレージエラーは無視
      }
    }
  }

  /**
   * エラーをログ出力
   * @param {Object} errorInfo - エラー情報
   */
  logError(errorInfo) {
    const { error, context } = errorInfo;
    
    switch (context.level) {
      case this.ERROR_LEVELS.DEBUG:
        console.debug(`[${context.component}] ${error.message}`, errorInfo);
        break;
      case this.ERROR_LEVELS.INFO:
        console.info(`[${context.component}] ${error.message}`, errorInfo);
        break;
      case this.ERROR_LEVELS.WARN:
        console.warn(`[${context.component}] ${error.message}`, errorInfo);
        break;
      case this.ERROR_LEVELS.ERROR:
        console.error(`[${context.component}] ${error.message}`, errorInfo);
        break;
      case this.ERROR_LEVELS.CRITICAL:
        console.error(`[CRITICAL] [${context.component}] ${error.message}`, errorInfo);
        break;
      default:
        console.log(`[${context.component}] ${error.message}`, errorInfo);
    }
  }

  /**
   * ユーザーにエラーを通知
   * @param {Object} errorInfo - エラー情報
   */
  notifyUser(errorInfo) {
    const { context } = errorInfo;
    
    // クリティカルレベル以下では通知しない
    if (context.level === this.ERROR_LEVELS.DEBUG || context.level === this.ERROR_LEVELS.INFO) {
      return;
    }
    
    const userMessage = this.getUserMessage(context.type);
    const shouldShowRetry = this.shouldShowRetryButton(context.type);
    
    this.showUserMessage(userMessage, context.level, shouldShowRetry, errorInfo.id);
  }

  /**
   * ユーザーメッセージを取得
   * @param {string} errorType - エラータイプ
   * @returns {string}
   */
  getUserMessage(errorType) {
    return this.USER_MESSAGES[errorType] || this.USER_MESSAGES[this.ERROR_TYPES.SYSTEM];
  }

  /**
   * 再試行ボタンを表示すべきかどうか
   * @param {string} errorType - エラータイプ
   * @returns {boolean}
   */
  shouldShowRetryButton(errorType) {
    return [
      this.ERROR_TYPES.NETWORK,
      this.ERROR_TYPES.DATA,
      this.ERROR_TYPES.CALCULATION,
      this.ERROR_TYPES.RENDERING
    ].includes(errorType);
  }

  /**
   * ユーザーメッセージを表示
   * @param {string} message - メッセージ
   * @param {string} level - エラーレベル
   * @param {boolean} showRetry - 再試行ボタンを表示するか
   * @param {string} errorId - エラーID
   */
  showUserMessage(message, level, showRetry, errorId) {
    if (!this.errorContainer) {
      // フォールバック: アラートを表示
      alert(message);
      return;
    }

    // エラーメッセージを設定
    const errorMessage = this.errorContainer.querySelector('#error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
    }

    // 再試行ボタンの表示/非表示
    const retryButton = this.errorContainer.querySelector('#retry-button');
    if (retryButton) {
      if (showRetry) {
        retryButton.style.display = 'block';
        retryButton.onclick = () => this.handleRetry(errorId);
      } else {
        retryButton.style.display = 'none';
      }
    }

    // エラーコンテナを表示
    this.errorContainer.style.display = 'flex';

    // 自動非表示（警告レベル以下の場合）
    if (level === this.ERROR_LEVELS.WARN) {
      setTimeout(() => {
        this.hideUserMessage();
      }, 5000);
    }
  }

  /**
   * ユーザーメッセージを非表示
   */
  hideUserMessage() {
    if (this.errorContainer) {
      this.errorContainer.style.display = 'none';
    }
  }

  /**
   * 再試行処理
   * @param {string} errorId - エラーID
   */
  handleRetry(errorId) {
    this.hideUserMessage();
    
    // 再試行イベントを発火
    const retryEvent = new CustomEvent('error:retry', {
      detail: { errorId },
      bubbles: true
    });
    document.dispatchEvent(retryEvent);
    
    this.log('info', 'handleRetry', 'User initiated retry', { errorId });
  }

  /**
   * 開発者向け通知
   * @param {Object} errorInfo - エラー情報
   */
  notifyDeveloper(errorInfo) {
    // 開発者ツールの拡張通知
    if (window.console && window.console.table) {
      console.group(`🚨 Error Details [${errorInfo.id}]`);
      console.table({
        'Error ID': errorInfo.id,
        'Type': errorInfo.context.type,
        'Level': errorInfo.context.level,
        'Component': errorInfo.context.component,
        'Message': errorInfo.error.message,
        'Timestamp': errorInfo.timestamp
      });
      if (errorInfo.error.stack) {
        console.groupCollapsed('Stack Trace');
        console.log(errorInfo.error.stack);
        console.groupEnd();
      }
      console.groupCollapsed('Full Context');
      console.log(errorInfo.context);
      console.groupEnd();
      console.groupEnd();
    }
  }

  /**
   * エラー統計を更新
   * @param {Object} errorInfo - エラー情報
   */
  updateErrorStats(errorInfo) {
    const stats = this.getErrorStats();
    const type = errorInfo.context.type;
    
    stats.total++;
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    stats.lastError = errorInfo.timestamp;
    
    // 統計をローカルストレージに保存
    try {
      localStorage.setItem('haqei_error_stats', JSON.stringify(stats));
    } catch (e) {
      // ストレージエラーは無視
    }
  }

  /**
   * エラー統計を取得
   * @returns {Object}
   */
  getErrorStats() {
    try {
      return JSON.parse(localStorage.getItem('haqei_error_stats') || '{}');
    } catch (e) {
      return {};
    }
  }

  /**
   * 特定のエラータイプでエラーを作成して処理
   * @param {string} type - エラータイプ
   * @param {string} message - エラーメッセージ
   * @param {Object} context - 追加コンテキスト
   */
  createError(type, message, context = {}) {
    const error = new Error(message);
    this.handleError(error, { type, ...context });
  }

  /**
   * バリデーションエラーを処理
   * @param {string} message - エラーメッセージ
   * @param {Object} context - コンテキスト
   */
  validationError(message, context = {}) {
    this.createError(this.ERROR_TYPES.VALIDATION, message, {
      level: this.ERROR_LEVELS.WARN,
      ...context
    });
  }

  /**
   * ネットワークエラーを処理
   * @param {string} message - エラーメッセージ
   * @param {Object} context - コンテキスト
   */
  networkError(message, context = {}) {
    this.createError(this.ERROR_TYPES.NETWORK, message, context);
  }

  /**
   * データエラーを処理
   * @param {string} message - エラーメッセージ
   * @param {Object} context - コンテキスト
   */
  dataError(message, context = {}) {
    this.createError(this.ERROR_TYPES.DATA, message, context);
  }

  /**
   * ストレージエラーを処理
   * @param {string} message - エラーメッセージ
   * @param {Object} context - コンテキスト
   */
  storageError(message, context = {}) {
    this.createError(this.ERROR_TYPES.STORAGE, message, context);
  }

  /**
   * すべてのエラーを取得
   * @returns {Array}
   */
  getAllErrors() {
    return [...this.errors];
  }

  /**
   * エラーをクリア
   */
  clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem('haqei_error_history');
      localStorage.removeItem('haqei_error_stats');
    } catch (e) {
      // ストレージエラーは無視
    }
  }

  /**
   * ログ出力ユーティリティ
   * @param {string} level - ログレベル
   * @param {string} method - メソッド名
   * @param {string} message - メッセージ
   * @param {*} data - データ
   */
  log(level, method, message, data = null) {
    const logData = {
      component: 'ErrorHandler',
      method,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    
    console[level](`[ErrorHandler] ${message}`, logData);
  }
}

// グローバルに公開
window.ErrorHandler = new ErrorHandler();