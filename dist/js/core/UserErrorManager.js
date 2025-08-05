/**
 * User Error Manager - ユーザーフレンドリーなエラー管理システム
 * bunenjin哲学: エラーを学習と成長の機会に変える
 */

class UserErrorManager {
  constructor() {
    this.errorHistory = [];
    this.errorTemplates = this.initializeErrorTemplates();
    this.recoveryStrategies = this.initializeRecoveryStrategies();
    this.userContext = {
      language: 'ja',
      experience: 'beginner', // beginner, intermediate, advanced
      preferences: {}
    };
    
    this.initializeErrorUI();
  }

  /**
   * エラーテンプレートの初期化
   */
  initializeErrorTemplates() {
    return {
      network: {
        title: 'ネットワークエラー',
        icon: '🌐',
        severity: 'warning',
        categories: {
          offline: {
            message: 'インターネット接続が切断されています',
            suggestion: 'ネットワーク接続を確認してください',
            actions: ['retry', 'offline_mode']
          },
          timeout: {
            message: '通信がタイムアウトしました',
            suggestion: '時間をおいて再度お試しください',
            actions: ['retry', 'reduce_load']
          },
          server_error: {
            message: 'サーバーに一時的な問題が発生しています',
            suggestion: 'しばらく時間をおいて再度お試しください',
            actions: ['retry', 'contact_support']
          }
        }
      },
      
      data: {
        title: 'データエラー',
        icon: '📊',
        severity: 'error',
        categories: {
          invalid_input: {
            message: '入力データに問題があります',
            suggestion: '入力内容を確認して修正してください',
            actions: ['fix_input', 'reset_form']
          },
          missing_data: {
            message: '必要なデータが不足しています',
            suggestion: 'すべての必須項目を入力してください',
            actions: ['complete_form', 'load_sample']
          },
          corrupted_data: {
            message: 'データが破損している可能性があります',
            suggestion: '初期状態に戻して再度お試しください',
            actions: ['reset_data', 'contact_support']
          }
        }
      },
      
      analysis: {
        title: '分析エラー',
        icon: '🔍',
        severity: 'warning',
        categories: {
          insufficient_answers: {
            message: '回答数が不足しています',
            suggestion: 'より多くの質問に回答することで、より正確な分析が可能になります',
            actions: ['continue_answering', 'partial_analysis']
          },
          conflicting_data: {
            message: '矛盾する回答が検出されました',
            suggestion: '一貫性のある回答をお願いします',
            actions: ['review_answers', 'guided_review']
          },
          calculation_error: {
            message: '分析計算でエラーが発生しました',
            suggestion: '一度リセットして再度お試しください',
            actions: ['retry_analysis', 'reset_session']
          }
        }
      },
      
      ui: {
        title: 'インターフェースエラー',
        icon: '🖼️',
        severity: 'info',
        categories: {
          render_error: {
            message: '画面表示に問題が発生しました',
            suggestion: 'ページを更新するか、ブラウザを変更してお試しください',
            actions: ['refresh_page', 'switch_browser']
          },
          interaction_error: {
            message: '操作が正常に実行されませんでした',
            suggestion: 'もう一度操作をお試しください',
            actions: ['retry_action', 'alternative_method']
          }
        }
      }
    };
  }

  /**
   * 回復戦略の初期化
   */
  initializeRecoveryStrategies() {
    return {
      retry: {
        label: '再試行',
        icon: '🔄',
        action: (context) => {
          if (context.retryCallback) {
            context.retryCallback();
          }
        }
      },
      
      offline_mode: {
        label: 'オフラインモードに切り替え',
        icon: '📱',
        action: (context) => {
          this.enableOfflineMode();
        }
      },
      
      reset_data: {
        label: 'データをリセット',
        icon: '🔄',
        action: (context) => {
          if (confirm('データをリセットしてもよろしいですか？')) {
            localStorage.clear();
            location.reload();
          }
        }
      },
      
      contact_support: {
        label: 'サポートに連絡',
        icon: '💬',
        action: (context) => {
          this.showSupportModal(context.error);
        }
      },
      
      guided_review: {
        label: 'ガイド付き見直し',
        icon: '🧭',
        action: (context) => {
          this.startGuidedReview();
        }
      }
    };
  }

  /**
   * エラーUI要素の初期化
   */
  initializeErrorUI() {
    if (!document.getElementById('error-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'error-notification-styles';
      style.textContent = `
        .error-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 400px;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
          border-left: 4px solid;
        }
        
        .error-notification.severity-error {
          border-left-color: #ef4444;
        }
        
        .error-notification.severity-warning {
          border-left-color: #f59e0b;
        }
        
        .error-notification.severity-info {
          border-left-color: #3b82f6;
        }
        
        .error-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 16px 8px 16px;
          font-weight: 600;
          color: #f1f5f9;
        }
        
        .error-icon {
          font-size: 1.25rem;
        }
        
        .error-content {
          padding: 0 16px 16px 16px;
        }
        
        .error-message {
          color: #cbd5e1;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        .error-suggestion {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 12px;
          font-style: italic;
        }
        
        .error-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .error-action-btn {
          padding: 6px 12px;
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 6px;
          background: rgba(99, 102, 241, 0.1);
          color: #a5b4fc;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .error-action-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.5);
        }
        
        .error-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 1.125rem;
          transition: color 0.2s ease;
        }
        
        .error-close:hover {
          color: #f1f5f9;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .error-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }
        }
        
        .support-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        
        .support-modal-content {
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: 12px;
          padding: 24px;
          max-width: 500px;
          width: 90%;
          color: #f1f5f9;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * エラー表示
   */
  displayError(error, options = {}) {
    const errorInfo = this.categorizeError(error);
    const notification = this.createErrorNotification(errorInfo, options);
    
    document.body.appendChild(notification);
    
    // エラー履歴に追加
    this.errorHistory.push({
      timestamp: new Date().toISOString(),
      error: errorInfo,
      userAction: null
    });
    
    // 自動削除タイマー
    const autoRemoveDelay = this.getSeverityTimeout(errorInfo.severity);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, autoRemoveDelay);
    
    return notification;
  }

  /**
   * エラーの分類
   */
  categorizeError(error) {
    let category = 'ui';
    let subcategory = 'render_error';
    
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      category = 'network';
      if (error.message?.includes('timeout')) {
        subcategory = 'timeout';
      } else if (!navigator.onLine) {
        subcategory = 'offline';
      } else {
        subcategory = 'server_error';
      }
    } else if (error.name === 'TypeError' || error.message?.includes('data')) {
      category = 'data';
      if (error.message?.includes('invalid')) {
        subcategory = 'invalid_input';
      } else if (error.message?.includes('missing')) {
        subcategory = 'missing_data';
      } else {
        subcategory = 'corrupted_data';
      }
    } else if (error.message?.includes('analysis') || error.message?.includes('calculation')) {
      category = 'analysis';
      subcategory = 'calculation_error';
    }
    
    const template = this.errorTemplates[category];
    const details = template.categories[subcategory];
    
    return {
      category,
      subcategory,
      title: template.title,
      icon: template.icon,
      severity: template.severity,
      message: details.message,
      suggestion: details.suggestion,
      actions: details.actions,
      originalError: error
    };
  }

  /**
   * エラー通知の作成
   */
  createErrorNotification(errorInfo, options) {
    const notification = document.createElement('div');
    notification.className = `error-notification severity-${errorInfo.severity}`;
    
    const actionsHTML = errorInfo.actions.map(actionId => {
      const strategy = this.recoveryStrategies[actionId];
      if (!strategy) return '';
      
      return `
        <button class="error-action-btn" data-action="${actionId}">
          <span>${strategy.icon}</span>
          <span>${strategy.label}</span>
        </button>
      `;
    }).join('');
    
    notification.innerHTML = `
      <button class="error-close" aria-label="エラーを閉じる">×</button>
      <div class="error-header">
        <span class="error-icon">${errorInfo.icon}</span>
        <span class="error-title">${errorInfo.title}</span>
      </div>
      <div class="error-content">
        <div class="error-message">${errorInfo.message}</div>
        <div class="error-suggestion">${errorInfo.suggestion}</div>
        <div class="error-actions">
          ${actionsHTML}
        </div>
      </div>
    `;
    
    // イベントリスナーの設定
    this.setupNotificationEvents(notification, errorInfo, options);
    
    return notification;
  }

  /**
   * 通知イベントの設定
   */
  setupNotificationEvents(notification, errorInfo, options) {
    // 閉じるボタン
    const closeBtn = notification.querySelector('.error-close');
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });
    
    // アクションボタン
    const actionBtns = notification.querySelectorAll('.error-action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const actionId = e.currentTarget.dataset.action;
        const strategy = this.recoveryStrategies[actionId];
        
        if (strategy) {
          strategy.action({
            error: errorInfo,
            retryCallback: options.retryCallback,
            context: options.context
          });
          
          // ユーザーアクションを履歴に記録
          const lastError = this.errorHistory[this.errorHistory.length - 1];
          if (lastError) {
            lastError.userAction = actionId;
          }
          
          notification.remove();
        }
      });
    });
  }

  /**
   * 重要度別のタイムアウト時間取得
   */
  getSeverityTimeout(severity) {
    const timeouts = {
      error: 10000,    // 10秒
      warning: 7000,   // 7秒
      info: 5000       // 5秒
    };
    return timeouts[severity] || 5000;
  }

  /**
   * オフラインモードの有効化
   */
  enableOfflineMode() {
    console.log('オフラインモードを有効化しました');
    // オフライン機能の実装
  }

  /**
   * サポートモーダルの表示
   */
  showSupportModal(errorInfo) {
    const modal = document.createElement('div');
    modal.className = 'support-modal';
    
    modal.innerHTML = `
      <div class="support-modal-content">
        <h3>サポートにお問い合わせ</h3>
        <p>以下の情報がサポートチームに送信されます：</p>
        <ul>
          <li>エラーの種類: ${errorInfo.title}</li>
          <li>発生時刻: ${new Date().toLocaleString('ja-JP')}</li>
          <li>ブラウザ: ${navigator.userAgent}</li>
        </ul>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="this.closest('.support-modal').remove()">
            キャンセル
          </button>
          <button class="btn" onclick="alert('サポートに連絡しました'); this.closest('.support-modal').remove()">
            送信
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  /**
   * ガイド付きレビューの開始
   */
  startGuidedReview() {
    console.log('ガイド付きレビューを開始します');
    // ガイド機能の実装
  }

  /**
   * エラー履歴の取得
   */
  getErrorHistory() {
    return this.errorHistory;
  }

  /**
   * エラー統計の取得
   */
  getErrorStatistics() {
    const stats = {
      total: this.errorHistory.length,
      byCategory: {},
      bySeverity: {},
      resolved: 0
    };
    
    this.errorHistory.forEach(entry => {
      const category = entry.error.category;
      const severity = entry.error.severity;
      
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;
      
      if (entry.userAction) {
        stats.resolved++;
      }
    });
    
    return stats;
  }
}

// グローバル利用のためのエクスポート
window.UserErrorManager = UserErrorManager;

// デフォルトのグローバルエラーハンドラーとして設定
const globalErrorManager = new UserErrorManager();

window.addEventListener('error', (event) => {
  globalErrorManager.displayError(event.error || new Error(event.message));
});

window.addEventListener('unhandledrejection', (event) => {
  globalErrorManager.displayError(new Error(`Promise拒否: ${event.reason}`));
});