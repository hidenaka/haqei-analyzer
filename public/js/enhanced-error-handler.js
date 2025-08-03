/**
 * Enhanced Error Handler for os_analyzer
 * 強化されたエラーハンドリングとユーザーフレンドリーな復旧機能
 */

class EnhancedErrorHandler {
  constructor() {
    this.errorLog = [];
    this.recoveryStrategies = new Map();
    this.userFriendlyMessages = new Map();
    this.init();
  }

  init() {
    this.setupGlobalErrorHandling();
    this.setupRecoveryStrategies();
    this.setupUserFriendlyMessages();
    this.setupErrorReporting();
    this.setupAutoRecovery();
  }

  /**
   * グローバルエラーハンドリング設定
   */
  setupGlobalErrorHandling() {
    // JavaScript runtime errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });

    // Promise rejection errors
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandled_promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          target: event.target.tagName,
          src: event.target.src || event.target.href
        });
      }
    }, true);

    // Network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.handleError({
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0],
            status: response.status,
            statusText: response.statusText
          });
        }
        return response;
      } catch (error) {
        this.handleError({
          type: 'network',
          message: `Network error: ${error.message}`,
          url: args[0],
          error: error
        });
        throw error;
      }
    };
  }

  /**
   * 復旧戦略の設定
   */
  setupRecoveryStrategies() {
    // スクリプト読み込み失敗時の復旧
    this.recoveryStrategies.set('script_load_failure', async (error) => {
      console.log('🔄 Attempting script recovery...');
      
      // CDNからの代替読み込み
      if (error.src && error.src.includes('/js/')) {
        const fileName = error.src.split('/').pop();
        const fallbackUrl = `https://cdn.jsdelivr.net/gh/yourusername/haqei-analyzer@main/public/js/${fileName}`;
        
        try {
          await this.loadScriptWithFallback(fallbackUrl);
          this.showUserMessage('✅ スクリプトの代替読み込みが完了しました', 'success');
          return true;
        } catch (fallbackError) {
          console.error('Fallback script loading failed:', fallbackError);
        }
      }
      
      return false;
    });

    // データ読み込み失敗時の復旧
    this.recoveryStrategies.set('data_load_failure', async (error) => {
      console.log('🔄 Attempting data recovery...');
      
      // ローカルストレージからのバックアップ読み込み
      const backupData = localStorage.getItem('haqei_data_backup');
      if (backupData) {
        try {
          const data = JSON.parse(backupData);
          this.showUserMessage('📦 バックアップデータから復旧しました', 'info');
          return data;
        } catch (parseError) {
          console.error('Backup data parsing failed:', parseError);
        }
      }
      
      // デフォルトデータの提供
      const defaultData = this.getDefaultData();
      this.showUserMessage('🔧 デフォルトデータを使用します', 'warning');
      return defaultData;
    });

    // 分析エラー時の復旧
    this.recoveryStrategies.set('analysis_failure', async (error) => {
      console.log('🔄 Attempting analysis recovery...');
      
      // 保存された回答の確認
      const savedAnswers = localStorage.getItem('haqei_answers');
      if (savedAnswers) {
        try {
          const answers = JSON.parse(savedAnswers);
          
          // 簡易分析の実行
          const simpleResult = this.performSimpleAnalysis(answers);
          this.showUserMessage('🧠 簡易分析を実行しました', 'info');
          return simpleResult;
        } catch (parseError) {
          console.error('Saved answers parsing failed:', parseError);
        }
      }
      
      return null;
    });

    // セッション復旧
    this.recoveryStrategies.set('session_recovery', async (error) => {
      console.log('🔄 Attempting session recovery...');
      
      const sessionData = localStorage.getItem('haqei_session');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          
          // セッション状態の復元
          this.restoreSession(session);
          this.showUserMessage('🔄 前回のセッションを復元しました', 'success');
          return true;
        } catch (parseError) {
          console.error('Session data parsing failed:', parseError);
        }
      }
      
      return false;
    });
  }

  /**
   * ユーザーフレンドリーメッセージの設定
   */
  setupUserFriendlyMessages() {
    this.userFriendlyMessages.set('javascript', {
      title: '処理エラーが発生しました',
      message: 'ページを再読み込みしてみてください。問題が続く場合は、ブラウザのキャッシュをクリアしてください。',
      action: 'ページを再読み込み',
      actionCallback: () => window.location.reload()
    });

    this.userFriendlyMessages.set('network', {
      title: 'ネットワークエラー',
      message: 'インターネット接続を確認してください。接続が安定している場合は、しばらく待ってから再試行してください。',
      action: '再試行',
      actionCallback: () => window.location.reload()
    });

    this.userFriendlyMessages.set('resource', {
      title: 'リソース読み込みエラー',
      message: 'システムファイルの読み込みに失敗しました。ブラウザを更新するか、少し時間をおいて再度お試しください。',
      action: 'ブラウザを更新',
      actionCallback: () => window.location.reload()
    });

    this.userFriendlyMessages.set('analysis', {
      title: '分析処理エラー',
      message: '分析中に問題が発生しました。入力内容を確認して再度お試しください。',
      action: '前の画面に戻る',
      actionCallback: () => this.goBackToPreviousStep()
    });

    this.userFriendlyMessages.set('storage', {
      title: 'データ保存エラー',
      message: 'ブラウザのストレージ容量が不足している可能性があります。不要なデータを削除してください。',
      action: 'データをクリア',
      actionCallback: () => this.clearStorageData()
    });
  }

  /**
   * エラーレポート機能の設定
   */
  setupErrorReporting() {
    // 定期的なエラーレポート送信（プライバシーに配慮）
    setInterval(() => {
      this.generateErrorReport();
    }, 300000); // 5分ごと

    // ページ離脱時のレポート送信
    window.addEventListener('beforeunload', () => {
      this.sendErrorReport();
    });
  }

  /**
   * 自動復旧機能の設定
   */
  setupAutoRecovery() {
    // 定期的なヘルスチェック
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // 1分ごと

    // 自動セッション保存
    setInterval(() => {
      this.saveSessionData();
    }, 30000); // 30秒ごと
  }

  /**
   * エラーハンドリングのメイン処理
   */
  async handleError(errorInfo) {
    // エラーログに記録
    const errorEntry = {
      ...errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId()
    };
    
    this.errorLog.push(errorEntry);
    console.error('📛 Error handled:', errorEntry);

    // エラータイプに応じた復旧試行
    const recoveryKey = this.getRecoveryKey(errorInfo);
    const recoveryStrategy = this.recoveryStrategies.get(recoveryKey);
    
    let recoverySuccessful = false;
    if (recoveryStrategy) {
      try {
        const result = await recoveryStrategy(errorInfo);
        recoverySuccessful = !!result;
      } catch (recoveryError) {
        console.error('Recovery strategy failed:', recoveryError);
      }
    }

    // ユーザーへの通知
    if (!recoverySuccessful) {
      this.showErrorToUser(errorInfo);
    }

    // 重要なエラーの場合は即座にレポート
    if (this.isCriticalError(errorInfo)) {
      this.sendErrorReport();
    }
  }

  /**
   * ユーザーにエラーメッセージを表示
   */
  showErrorToUser(errorInfo) {
    const messageConfig = this.userFriendlyMessages.get(errorInfo.type) || {
      title: '予期しないエラー',
      message: '問題が発生しました。ページを再読み込みしてみてください。',
      action: 'ページを再読み込み',
      actionCallback: () => window.location.reload()
    };

    // エラーダイアログの表示
    this.showErrorDialog(messageConfig);
  }

  /**
   * エラーダイアログの表示
   */
  showErrorDialog(config) {
    // 既存のエラーダイアログを削除
    const existingDialog = document.getElementById('error-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // エラーダイアログのHTML作成
    const dialogHTML = `
      <div id="error-dialog" class="error-dialog-overlay">
        <div class="error-dialog">
          <div class="error-dialog-header">
            <h3>${config.title}</h3>
            <button class="error-dialog-close" onclick="this.closest('.error-dialog-overlay').remove()">×</button>
          </div>
          <div class="error-dialog-body">
            <p>${config.message}</p>
          </div>
          <div class="error-dialog-footer">
            <button class="btn btn-primary" onclick="window.enhancedErrorHandler.executeAction('${config.action}', ${config.actionCallback})">${config.action}</button>
            <button class="btn btn-secondary" onclick="this.closest('.error-dialog-overlay').remove()">閉じる</button>
          </div>
        </div>
      </div>
    `;

    // エラーダイアログのCSS
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .error-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .error-dialog {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      .error-dialog-header {
        padding: 20px 20px 10px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .error-dialog-body {
        padding: 20px;
        line-height: 1.6;
      }
      .error-dialog-footer {
        padding: 10px 20px 20px;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
      .error-dialog-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
    `;

    // ダイアログを追加
    document.head.appendChild(styleElement);
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
  }

  /**
   * 簡単なメッセージ表示
   */
  showUserMessage(message, type = 'info') {
    // 既存の通知システムを使用するか、独自の通知を作成
    if (window.showNotification && typeof window.showNotification === 'function') {
      window.showNotification('システム通知', message, type);
    } else {
      // 簡易通知の作成
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
        border-radius: 8px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;

      document.body.appendChild(notification);

      // 3秒後に自動削除
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  }

  /**
   * ヘルスチェック実行
   */
  performHealthCheck() {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      } : null,
      storageAvailable: this.checkStorageAvailability(),
      scriptErrors: this.errorLog.filter(e => e.type === 'javascript').length,
      networkErrors: this.errorLog.filter(e => e.type === 'network').length
    };

    // 問題があれば警告
    if (healthStatus.memoryUsage && healthStatus.memoryUsage.used > healthStatus.memoryUsage.limit * 0.9) {
      console.warn('⚠️ High memory usage detected');
      this.showUserMessage('メモリ使用量が高くなっています。ページを再読み込みすることをお勧めします。', 'warning');
    }

    if (healthStatus.scriptErrors > 5) {
      console.warn('⚠️ High error rate detected');
    }

    return healthStatus;
  }

  /**
   * セッションデータの保存
   */
  saveSessionData() {
    try {
      const sessionData = {
        timestamp: new Date().toISOString(),
        currentStep: this.getCurrentStep(),
        formData: this.getCurrentFormData(),
        progress: this.getCurrentProgress()
      };

      localStorage.setItem('haqei_session', JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Session save failed:', error);
    }
  }

  /**
   * ユーティリティメソッド
   */
  getRecoveryKey(errorInfo) {
    if (errorInfo.type === 'resource' && errorInfo.src?.includes('.js')) {
      return 'script_load_failure';
    }
    if (errorInfo.message?.includes('analysis') || errorInfo.message?.includes('分析')) {
      return 'analysis_failure';
    }
    if (errorInfo.type === 'network') {
      return 'data_load_failure';
    }
    return errorInfo.type;
  }

  isCriticalError(errorInfo) {
    return errorInfo.type === 'javascript' || 
           (errorInfo.type === 'network' && errorInfo.status >= 500) ||
           errorInfo.message?.includes('分析');
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('haqei_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('haqei_session_id', sessionId);
    }
    return sessionId;
  }

  checkStorageAvailability() {
    try {
      const testKey = 'test_storage_' + Date.now();
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  getCurrentStep() {
    // 現在のステップを取得するロジック
    return document.querySelector('.screen-container:not([style*="display: none"])')?.id || 'welcome';
  }

  getCurrentFormData() {
    // 現在のフォームデータを取得
    const answers = localStorage.getItem('haqei_answers');
    return answers ? JSON.parse(answers) : [];
  }

  getCurrentProgress() {
    // 現在の進捗状況を取得
    const answers = this.getCurrentFormData();
    return answers.length;
  }

  executeAction(actionName, callback) {
    try {
      if (typeof callback === 'function') {
        callback();
      }
    } catch (error) {
      console.error('Action execution failed:', error);
    }
  }
}

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedErrorHandler = new EnhancedErrorHandler();
  console.log('🛡️ Enhanced Error Handler initialized');
});

// グローバル公開
window.EnhancedErrorHandler = EnhancedErrorHandler;