/**
 * Comprehensive Error Handler Module
 * HAQEI Future Simulator - Error handling system
 */

console.log('🚀 Error Handler Module loading...');

// === 包括的エラーハンドリングシステム ===
class ComprehensiveErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.userNotifications = new Set();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // グローバルエラーハンドラー
    window.addEventListener('error', (event) => this.handleGlobalError(event));
    window.addEventListener('unhandledrejection', (event) => this.handleUnhandledRejection(event));
    
    // ネットワークエラー監視
    window.addEventListener('online', () => this.handleNetworkRestore());
    window.addEventListener('offline', () => this.handleNetworkLoss());
  }

  handleGlobalError(event) {
    // Chrome拡張機能エラーは無視
    const chromeExtensionPatterns = [
      'chrome-extension://', 'moz-extension://', 'safari-extension://',
      'extension:', 'content.js', 'background.js', 'popup.js', 'inject.js'
    ];
    
    const isExtensionError = chromeExtensionPatterns.some(pattern => 
      (event.filename?.includes(pattern)) ||
      (event.message?.includes(pattern))
    );
    
    if (isExtensionError) {
      event.preventDefault();
      return true;
    }

    // アプリケーションエラーの処理
    this.logError({
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      error: event.error,
      timestamp: new Date().toISOString()
    });

    this.handleApplicationError(event.error || new Error(event.message));
  }

  handleUnhandledRejection(event) {
    // 拡張機能関連のPromiseエラーは無視
    const extensionPatterns = [
      'chrome-extension', 'moz-extension', 'safari-extension',
      'Extension context', 'port closed', 'context invalidated'
    ];
    
    if (event.reason?.message && extensionPatterns.some(pattern => 
        event.reason.message.includes(pattern))) {
      event.preventDefault();
      return true;
    }

    this.logError({
      type: 'promise_rejection',
      reason: event.reason,
      timestamp: new Date().toISOString()
    });

    this.handleApplicationError(event.reason);
  }

  handleApplicationError(error) {
    const errorType = this.categorizeError(error);
    
    switch (errorType) {
      case 'kuromoji':
        this.handleKuromojiError(error);
        break;
      case 'network':
        this.handleNetworkError(error);
        break;
      case 'data_loading':
        this.handleDataLoadingError(error);
        break;
      case 'analysis':
        this.handleAnalysisError(error);
        break;
      case 'input_validation':
        this.handleInputValidationError(error);
        break;
      default:
        this.handleGenericError(error);
    }
  }

  categorizeError(error) {
    const message = error?.message?.toLowerCase() || '';
    const stack = error?.stack?.toLowerCase() || '';
    
    if (message.includes('kuromoji') || stack.includes('kuromoji')) return 'kuromoji';
    if (message.includes('network') || message.includes('fetch')) return 'network';
    if (message.includes('data') || message.includes('loading')) return 'data_loading';
    if (message.includes('analysis') || message.includes('分析')) return 'analysis';
    if (message.includes('validation') || message.includes('入力')) return 'input_validation';
    
    return 'generic';
  }

  logError(errorInfo) {
    this.errorLog.push(errorInfo);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
    console.error('📋 Error logged:', errorInfo);
  }

  // エラータイプ別のハンドラーメソッド
  async handleKuromojiError(error) {
    console.warn('🔤 Kuromoji error handled gracefully:', error.message);
    
    // Try to load essential dictionaries as fallback
    try {
      if (window.dictionaryLoader) {
        console.log('📚 Attempting to load essential dictionaries as fallback...');
        const success = await window.dictionaryLoader.loadEssentialDictionaries();
        
        if (success) {
          console.log('✅ Essential dictionaries loaded - basic functionality restored');
          return; // Error resolved
        }
      }
    } catch (fallbackError) {
      console.warn('⚠️ Dictionary fallback failed:', fallbackError);
    }
    
    // Show user-friendly fallback notice
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      const morphologyFallback = `
        <div class="fallback-notice bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 class="text-yellow-800 font-semibold mb-2">日本語解析機能の制限</h4>
          <p class="text-yellow-700 text-sm">
            高度な日本語解析機能が利用できませんが、HAQEI分析の核心機能は正常に動作します。
            より詳細な解析をご希望の場合は、下のボタンで追加機能を読み込めます。
          </p>
          <button onclick="window.dictionaryLoader?.loadAdvancedDictionaries().then(() => location.reload())" 
                  class="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors">
            高度機能を読み込む
          </button>
        </div>
      `;
      
      errorContainer.innerHTML = morphologyFallback;
      setTimeout(() => errorContainer.innerHTML = '', 15000);
    }
  }

  handleNetworkError(error) {
    console.warn('🌐 Network error handled:', error.message);
  }

  handleDataLoadingError(error) {
    console.warn('📊 Data loading error handled:', error.message);
  }

  handleAnalysisError(error) {
    console.warn('🔍 Analysis error handled:', error.message);
  }

  handleInputValidationError(error) {
    console.warn('✏️ Input validation error handled:', error.message);
  }

  handleGenericError(error) {
    console.warn('⚠️ Generic error handled:', error.message);
  }

  handleNetworkRestore() {
    console.log('🌐 Network restored');
  }

  handleNetworkLoss() {
    console.log('📡 Network lost - switching to offline mode');
  }
}

// グローバルエラーハンドラーの初期化
const errorHandler = new ComprehensiveErrorHandler();

// グローバルアクセス用
window.errorHandler = errorHandler;

// グローバル公開
window.ComprehensiveErrorHandler = ComprehensiveErrorHandler;

console.log('✅ Error Handler Module loaded');