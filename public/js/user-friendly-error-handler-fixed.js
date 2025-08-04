/**
 * User-Friendly Error Handler - Fixed Version
 * 適切なタイミングでのみエラーを表示
 */

class UserFriendlyErrorHandlerFixed {
  constructor() {
    this.errorTranslations = new Map();
    this.userSuggestions = new Map();
    this.errorCooldown = new Map(); // エラー表示のクールダウン管理
    this.init();
  }

  init() {
    this.setupErrorTranslations();
    this.setupUserSuggestions();
    this.enhanceExistingErrorHandler();
  }

  setupErrorTranslations() {
    this.errorTranslations.set(/failed to load script/i, '必要なファイルの読み込みに失敗しました');
    this.errorTranslations.set(/network error/i, 'インターネット接続に問題があります');
    this.errorTranslations.set(/404/i, '必要なファイルが見つかりません');
    this.errorTranslations.set(/500/i, 'サーバーで一時的な問題が発生しています');
    this.errorTranslations.set(/timeout/i, '処理に時間がかかりすぎています');
    this.errorTranslations.set(/datamanager/i, 'データ処理システムで問題が発生しました');
    this.errorTranslations.set(/undefined/i, 'システムの初期化でエラーが発生しました');
    this.errorTranslations.set(/cannot read property/i, 'データの読み込みでエラーが発生しました');
  }

  setupUserSuggestions() {
    this.userSuggestions.set(/network|404|timeout/i, [
      '🔄 ページを再読み込みしてください',
      '📶 インターネット接続を確認してください',
      '⏱️ 少し時間をおいてから再度お試しください'
    ]);

    this.userSuggestions.set(/script|datamanager|undefined/i, [
      '🔄 ページを再読み込みしてください',
      '🧹 ブラウザのキャッシュをクリアしてください',
      '🔧 ブラウザを最新版に更新してください'
    ]);
  }

  translateErrorMessage(originalMessage) {
    if (!originalMessage) return 'システムで予期しない問題が発生しました';

    for (const [pattern, translation] of this.errorTranslations) {
      if (pattern.test(originalMessage)) {
        return translation;
      }
    }

    return 'システムで一時的な問題が発生しました。ご不便をおかけして申し訳ありません。';
  }

  generateUserSuggestions(errorMessage) {
    if (!errorMessage) return this.getDefaultSuggestions();

    for (const [pattern, suggestions] of this.userSuggestions) {
      if (pattern.test(errorMessage)) {
        return suggestions;
      }
    }

    return this.getDefaultSuggestions();
  }

  getDefaultSuggestions() {
    return [
      '🔄 ページを再読み込みしてください',
      '📧 問題が続く場合はサポートにお問い合わせください'
    ];
  }

  /**
   * エラー表示の必要性を判定（より厳格に）
   */
  shouldShowToUser(error) {
    if (!error) return false;
    
    const message = error.message || '';
    
    // ユーザーが実際に困る重要なエラーのみ表示
    const criticalPatterns = [
      /failed to load.*main|core|essential/i, // 重要なファイルの読み込み失敗のみ
      /network.*timeout/i, // ネットワークタイムアウト
      /server.*error.*5\d\d/i // サーバーエラー
    ];

    // 以下のパターンは表示しない（ユーザーに見せる必要がない）
    const ignoredPatterns = [
      /performance/i,
      /observer/i,
      /analytics/i,
      /metrics/i,
      /debug/i,
      /development/i
    ];

    // 無視すべきエラーかチェック
    if (ignoredPatterns.some(pattern => pattern.test(message))) {
      return false;
    }

    // クールダウン中かチェック
    const errorKey = message.substring(0, 50);
    const now = Date.now();
    const lastShown = this.errorCooldown.get(errorKey);
    
    if (lastShown && (now - lastShown) < 30000) { // 30秒のクールダウン
      return false;
    }

    // 重要なエラーのみ表示
    const shouldShow = criticalPatterns.some(pattern => pattern.test(message));
    
    if (shouldShow) {
      this.errorCooldown.set(errorKey, now);
    }
    
    return shouldShow;
  }

  /**
   * ユーザーフレンドリーなエラーダイアログを表示（改善版）
   */
  showUserFriendlyError(originalError) {
    // 既存のエラーダイアログがあれば削除
    const existingDialog = document.querySelector('.user-friendly-error-modal-fixed');
    if (existingDialog) {
      existingDialog.remove();
    }

    const friendlyMessage = this.translateErrorMessage(originalError.message);
    const suggestions = this.generateUserSuggestions(originalError.message);

    const errorDialog = document.createElement('div');
    errorDialog.className = 'user-friendly-error-modal-fixed';
    errorDialog.innerHTML = `
      <div class="error-backdrop-fixed" onclick="this.parentElement.remove()"></div>
      <div class="error-dialog-fixed">
        <div class="error-header-fixed">
          <div class="error-icon-fixed">💡</div>
          <h3>ちょっとした問題が発生しました</h3>
          <button class="error-close-fixed" onclick="this.closest('.user-friendly-error-modal-fixed').remove()">×</button>
        </div>
        <div class="error-body-fixed">
          <p class="error-message-fixed">${friendlyMessage}</p>
          <div class="error-suggestions-fixed">
            <h4>👉 試してみてください：</h4>
            <ul>
              ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
          <details class="error-technical-details-fixed">
            <summary>技術的な詳細（必要に応じて開発者にお伝えください）</summary>
            <pre>${originalError.message}</pre>
            ${originalError.stack ? `<pre>${originalError.stack}</pre>` : ''}
          </details>
        </div>
        <div class="error-footer-fixed">
          <button class="btn btn-primary-fixed" onclick="location.reload()">ページを再読み込み</button>
          <button class="btn btn-secondary-fixed" onclick="this.closest('.user-friendly-error-modal-fixed').remove()">続ける</button>
        </div>
      </div>
    `;

    this.addErrorDialogStyles();
    document.body.appendChild(errorDialog);

    // 10秒後に自動で閉じる
    setTimeout(() => {
      if (errorDialog.parentNode) {
        errorDialog.remove();
      }
    }, 10000);
  }

  /**
   * 既存のエラーハンドラーを拡張（改善版）
   */
  enhanceExistingErrorHandler() {
    // 既存のハンドラーを保存
    const originalErrorHandler = window.onerror;
    const originalUnhandledRejection = window.onunhandledrejection;

    // より慎重なグローバルエラーハンドリング
    window.onerror = (message, source, lineno, colno, error) => {
      const errorObj = error || { message };
      
      // 重要なエラーのみユーザーに表示
      if (this.shouldShowToUser(errorObj)) {
        // 少し遅延させてページが安定してから表示
        setTimeout(() => {
          this.showUserFriendlyError(errorObj);
        }, 500);
      }
      
      // 元のハンドラーも実行
      if (originalErrorHandler) {
        return originalErrorHandler(message, source, lineno, colno, error);
      }
    };

    // Promise rejection も同様に改善
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason || { message: 'Unknown error' };
      
      if (this.shouldShowToUser(error)) {
        setTimeout(() => {
          this.showUserFriendlyError(error);
        }, 500);
      }
      
      if (originalUnhandledRejection) {
        originalUnhandledRejection.call(window, event);
      }
    });
  }

  addErrorDialogStyles() {
    if (document.getElementById('user-friendly-error-styles-fixed')) return;

    const styles = document.createElement('style');
    styles.id = 'user-friendly-error-styles-fixed';
    styles.textContent = `
      .user-friendly-error-modal-fixed {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .error-backdrop-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }
      .error-dialog-fixed {
        position: relative;
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      .error-header-fixed {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        background: #f8fafc;
        border-radius: 12px 12px 0 0;
      }
      .error-icon-fixed {
        font-size: 24px;
        margin-right: 12px;
      }
      .error-header-fixed h3 {
        flex: 1;
        margin: 0;
        color: #1f2937;
        font-size: 18px;
      }
      .error-close-fixed {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .error-close-fixed:hover {
        background: #e5e7eb;
      }
      .error-body-fixed {
        padding: 20px;
      }
      .error-message-fixed {
        margin: 0 0 20px 0;
        color: #374151;
        font-size: 16px;
        line-height: 1.6;
      }
      .error-suggestions-fixed h4 {
        margin: 0 0 12px 0;
        color: #059669;
        font-size: 14px;
      }
      .error-suggestions-fixed ul {
        margin: 0;
        padding-left: 20px;
      }
      .error-suggestions-fixed li {
        margin-bottom: 8px;
        color: #374151;
        font-size: 14px;
      }
      .error-technical-details-fixed {
        margin-top: 20px;
      }
      .error-technical-details-fixed summary {
        cursor: pointer;
        color: #6b7280;
        font-size: 12px;
      }
      .error-technical-details-fixed pre {
        background: #f3f4f6;
        padding: 10px;
        border-radius: 6px;
        font-size: 11px;
        overflow-x: auto;
        margin: 10px 0 0 0;
      }
      .error-footer-fixed {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      .btn {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }
      .btn-primary-fixed {
        background: #3b82f6;
        color: white;
      }
      .btn-primary-fixed:hover {
        background: #2563eb;
      }
      .btn-secondary-fixed {
        background: #e5e7eb;
        color: #374151;
      }
      .btn-secondary-fixed:hover {
        background: #d1d5db;
      }
    `;
    document.head.appendChild(styles);
  }
}

// グローバルに公開
window.UserFriendlyErrorHandlerFixed = UserFriendlyErrorHandlerFixed;

// 既存のエラーハンドラーを無効化してから新しいものを初期化
if (window.userFriendlyErrorHandler) {
  window.userFriendlyErrorHandler = null;
}

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.userFriendlyErrorHandlerFixed = new UserFriendlyErrorHandlerFixed();
  });
} else {
  window.userFriendlyErrorHandlerFixed = new UserFriendlyErrorHandlerFixed();
}

console.log('💡 User-Friendly Error Handler Fixed loaded - 適切なタイミングでのエラー表示に修正しました');