/**
 * User-Friendly Error Handler - ユーザーフレンドリーなエラーハンドリング
 * 一般ユーザーにとって分かりやすいエラーメッセージと解決策を提供
 */

class UserFriendlyErrorHandler {
  constructor() {
    this.errorTranslations = new Map();
    this.userSuggestions = new Map();
    this.init();
  }

  init() {
    this.setupErrorTranslations();
    this.setupUserSuggestions();
    this.enhanceExistingErrorHandler();
  }

  /**
   * 一般的なエラーメッセージの日本語化
   */
  setupErrorTranslations() {
    this.errorTranslations.set(/failed to load script/i, '必要なファイルの読み込みに失敗しました');
    this.errorTranslations.set(/network error/i, 'インターネット接続に問題があります');
    this.errorTranslations.set(/404/i, '必要なファイルが見つかりません');
    this.errorTranslations.set(/500/i, 'サーバーで一時的な問題が発生しています');
    this.errorTranslations.set(/timeout/i, '処理に時間がかかりすぎています');
    this.errorTranslations.set(/cors/i, 'セキュリティ制限により処理できません');
    this.errorTranslations.set(/permission denied/i, 'アクセス権限がありません');
    this.errorTranslations.set(/datamanager/i, 'データ処理システムで問題が発生しました');
    this.errorTranslations.set(/undefined/i, 'システムの初期化でエラーが発生しました');
    this.errorTranslations.set(/cannot read property/i, 'データの読み込みでエラーが発生しました');
  }

  /**
   * ユーザー向け解決策の提案
   */
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

    this.userSuggestions.set(/permission|cors/i, [
      '🔒 ブラウザの設定でJavaScriptが有効になっているか確認してください',
      '🚫 広告ブロッカーを一時的に無効にしてください',
      '🔄 プライベートブラウジングモードをお試しください'
    ]);
  }

  /**
   * エラーメッセージをユーザーフレンドリーに変換
   */
  translateErrorMessage(originalMessage) {
    if (!originalMessage) return 'システムで予期しない問題が発生しました';

    for (const [pattern, translation] of this.errorTranslations) {
      if (pattern.test(originalMessage)) {
        return translation;
      }
    }

    // デフォルトのユーザーフレンドリーメッセージ
    return 'システムで一時的な問題が発生しました。ご不便をおかけして申し訳ありません。';
  }

  /**
   * ユーザー向け解決策を生成
   */
  generateUserSuggestions(errorMessage) {
    if (!errorMessage) return this.getDefaultSuggestions();

    for (const [pattern, suggestions] of this.userSuggestions) {
      if (pattern.test(errorMessage)) {
        return suggestions;
      }
    }

    return this.getDefaultSuggestions();
  }

  /**
   * デフォルトの解決策
   */
  getDefaultSuggestions() {
    return [
      '🔄 ページを再読み込みしてください',
      '📧 問題が続く場合はサポートにお問い合わせください'
    ];
  }

  /**
   * ユーザーフレンドリーなエラーダイアログを表示
   */
  showUserFriendlyError(originalError) {
    const friendlyMessage = this.translateErrorMessage(originalError.message);
    const suggestions = this.generateUserSuggestions(originalError.message);

    const errorDialog = document.createElement('div');
    errorDialog.className = 'user-friendly-error-modal';
    errorDialog.innerHTML = `
      <div class="error-backdrop" onclick="this.parentElement.remove()"></div>
      <div class="error-dialog">
        <div class="error-header">
          <div class="error-icon">💡</div>
          <h3>ちょっとした問題が発生しました</h3>
          <button class="error-close" onclick="this.closest('.user-friendly-error-modal').remove()">×</button>
        </div>
        <div class="error-body">
          <p class="error-message">${friendlyMessage}</p>
          <div class="error-suggestions">
            <h4>👉 試してみてください：</h4>
            <ul>
              ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
          </div>
          <details class="error-technical-details">
            <summary>技術的な詳細（必要に応じて開発者にお伝えください）</summary>
            <pre>${originalError.message}</pre>
            ${originalError.stack ? `<pre>${originalError.stack}</pre>` : ''}
          </details>
        </div>
        <div class="error-footer">
          <button class="btn btn-primary" onclick="location.reload()">ページを再読み込み</button>
          <button class="btn btn-secondary" onclick="this.closest('.user-friendly-error-modal').remove()">続ける</button>
        </div>
      </div>
    `;

    // エラーダイアログのスタイル
    if (!document.getElementById('user-friendly-error-styles')) {
      const styles = document.createElement('style');
      styles.id = 'user-friendly-error-styles';
      styles.textContent = `
        .user-friendly-error-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .error-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        .error-dialog {
          position: relative;
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .error-header {
          display: flex;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
          border-radius: 12px 12px 0 0;
        }
        .error-icon {
          font-size: 24px;
          margin-right: 12px;
        }
        .error-header h3 {
          flex: 1;
          margin: 0;
          color: #1f2937;
          font-size: 18px;
        }
        .error-close {
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
        .error-close:hover {
          background: #e5e7eb;
        }
        .error-body {
          padding: 20px;
        }
        .error-message {
          margin: 0 0 20px 0;
          color: #374151;
          font-size: 16px;
          line-height: 1.6;
        }
        .error-suggestions h4 {
          margin: 0 0 12px 0;
          color: #059669;
          font-size: 14px;
        }
        .error-suggestions ul {
          margin: 0;
          padding-left: 20px;
        }
        .error-suggestions li {
          margin-bottom: 8px;
          color: #374151;
          font-size: 14px;
        }
        .error-technical-details {
          margin-top: 20px;
        }
        .error-technical-details summary {
          cursor: pointer;
          color: #6b7280;
          font-size: 12px;
        }
        .error-technical-details pre {
          background: #f3f4f6;
          padding: 10px;
          border-radius: 6px;
          font-size: 11px;
          overflow-x: auto;
          margin: 10px 0 0 0;
        }
        .error-footer {
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
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }
        .btn-secondary:hover {
          background: #d1d5db;
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(errorDialog);
  }

  /**
   * 既存のエラーハンドラーを拡張
   */
  enhanceExistingErrorHandler() {
    // グローバルエラーイベントを拡張
    const originalErrorHandler = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // 重要なエラーのみユーザーに表示
      if (this.shouldShowToUser(error || { message })) {
        this.showUserFriendlyError(error || { message });
      }
      
      // 元のハンドラーも実行
      if (originalErrorHandler) {
        return originalErrorHandler(message, source, lineno, colno, error);
      }
    };

    // Promise rejection も拡張
    window.addEventListener('unhandledrejection', (event) => {
      if (this.shouldShowToUser(event.reason)) {
        this.showUserFriendlyError(event.reason);
      }
    });
  }

  /**
   * ユーザーに表示すべきエラーかどうかを判定
   */
  shouldShowToUser(error) {
    if (!error) return false;
    
    const message = error.message || '';
    
    // 重要なエラーのみ表示
    const criticalPatterns = [
      /failed to load script/i,
      /network error/i,
      /datamanager/i,
      /404/i,
      /500/i,
      /timeout/i
    ];

    return criticalPatterns.some(pattern => pattern.test(message));
  }
}

// グローバルに公開
window.UserFriendlyErrorHandler = UserFriendlyErrorHandler;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.userFriendlyErrorHandler = new UserFriendlyErrorHandler();
  });
} else {
  window.userFriendlyErrorHandler = new UserFriendlyErrorHandler();
}

console.log('💡 User-Friendly Error Handler loaded - ユーザーフレンドリーなエラー対応が有効になりました');