/**
 * HAQEIアナライザー ユーザーフレンドリーエラーUI
 * UserFriendlyErrorUI.js
 * 
 * bunenjin哲学に基づく共感的エラー表示・ガイダンスシステム
 * 易経の調和原理を活用したユーザー体験向上システム
 * 
 * 設計思想:
 * - エラーを恐怖でなく学習機会に変換
 * - 分人に応じた適応的メッセージング
 * - 段階的ガイダンスによる問題解決支援
 * - 美しく調和のとれたインターフェース
 * 
 * Author: HAQEI Programmer Agent
 * Version: 1.0.0-empathetic-ui
 * Created: 2025-08-05
 */

class UserFriendlyErrorUI {
  constructor(options = {}) {
    this.version = "1.0.0-empathetic-ui";
    this.philosophyAlignment = "bunenjin-empathetic-harmony";
    
    // 設定
    this.config = {
      theme: options.theme || 'harmony', // harmony, minimal, technical
      language: options.language || 'ja',
      animationsEnabled: options.animationsEnabled !== false,
      soundEnabled: options.soundEnabled || false,
      hapticEnabled: options.hapticEnabled || false,
      accessibilityMode: options.accessibilityMode || false,
      bunenjinPersonalization: options.bunenjinPersonalization !== false,
      autoHideTimeout: options.autoHideTimeout || 8000,
      maxConcurrentNotifications: options.maxConcurrentNotifications || 3,
      ...options
    };
    
    // UI状態管理
    this.activeNotifications = new Map();
    this.notificationQueue = [];
    this.currentTheme = this.config.theme;
    this.isInitialized = false;
    
    // bunenjin分人別UI設定
    this.bunenjinUIProfiles = {
      analytical: {
        tone: 'informative',
        detailLevel: 'high',
        colorScheme: 'blue',
        iconStyle: 'technical'
      },
      empathetic: {
        tone: 'reassuring',
        detailLevel: 'medium',
        colorScheme: 'warm',
        iconStyle: 'friendly'
      },
      pragmatic: {
        tone: 'solution-focused',
        detailLevel: 'low',
        colorScheme: 'green',
        iconStyle: 'action'
      }
    };
    
    // メッセージテンプレート
    this.messageTemplates = new Map();
    this.initializeMessageTemplates();
    
    // アニメーション設定
    this.animations = {
      slideIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      fadeIn: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    };
    
    this.initialize();
    
    console.log(`🎨 UserFriendlyErrorUI v${this.version} initialized`);
  }
  
  /**
   * システム初期化
   */
  async initialize() {
    try {
      // スタイルシートの注入
      await this.injectStyles();
      
      // アクセシビリティ設定
      if (this.config.accessibilityMode) {
        await this.setupAccessibility();
      }
      
      // 音声設定
      if (this.config.soundEnabled) {
        await this.setupAudioSystem();
      }
      
      // ハプティック設定
      if (this.config.hapticEnabled) {
        this.setupHapticFeedback();
      }
      
      this.isInitialized = true;
      console.log("✅ UserFriendlyErrorUI initialized");
      
    } catch (error) {
      console.error("❌ UserFriendlyErrorUI initialization failed:", error);
      this.isInitialized = false;
    }
  }
  
  /**
   * メインエラー表示メソッド
   */
  async displayError(errorData, options = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // エラーデータの正規化
      const normalizedError = this.normalizeErrorData(errorData);
      
      // bunenjin分人プロファイルの選択
      const personalityProfile = this.config.bunenjinPersonalization ? 
        this.selectPersonalityProfile(normalizedError) : 'pragmatic';
      
      // 通知の作成
      const notification = await this.createNotification(normalizedError, personalityProfile, options);
      
      // 表示制限チェック
      if (this.activeNotifications.size >= this.config.maxConcurrentNotifications) {
        this.queueNotification(notification);
        return;
      }
      
      // 通知の表示
      await this.renderNotification(notification);
      
      // 音声・ハプティックフィードバック
      await this.provideMultimodalFeedback(notification);
      
      return notification.id;
      
    } catch (error) {
      console.error("❌ Failed to display error:", error);
      this.displayFallbackError(errorData);
    }
  }
  
  /**
   * エラーデータ正規化
   */
  normalizeErrorData(errorData) {
    return {
      id: errorData.id || this.generateId(),
      type: errorData.type || 'general',
      severity: errorData.severity || 'medium',
      title: errorData.title || 'エラーが発生しました',
      message: errorData.message || 'システムエラーが発生しました',
      details: errorData.details || '',
      timestamp: errorData.timestamp || Date.now(),
      source: errorData.source || 'system',
      recoverable: errorData.recoverable !== false,
      userActions: errorData.userActions || [],
      technicalInfo: errorData.technicalInfo || {},
      context: errorData.context || {}
    };
  }
  
  /**
   * 分人プロファイル選択
   */
  selectPersonalityProfile(errorData) {
    // エラーの性質に基づく分人選択
    if (errorData.severity === 'critical' || !errorData.recoverable) {
      return 'empathetic'; // 共感的アプローチ
    }
    
    if (errorData.type === 'technical' || errorData.details) {
      return 'analytical'; // 分析的アプローチ
    }
    
    return 'pragmatic'; // 実用的アプローチ
  }
  
  /**
   * 通知作成
   */
  async createNotification(errorData, personalityProfile, options) {
    const uiProfile = this.bunenjinUIProfiles[personalityProfile];
    
    const notification = {
      id: errorData.id,
      type: 'error',
      severity: errorData.severity,
      personalityProfile: personalityProfile,
      uiProfile: uiProfile,
      timestamp: Date.now(),
      
      // コンテンツ
      title: await this.generateTitle(errorData, personalityProfile),
      message: await this.generateMessage(errorData, personalityProfile),
      actions: await this.generateActions(errorData, personalityProfile),
      
      // 表示設定
      autoHide: options.autoHide !== false && errorData.severity !== 'critical',
      hideTimeout: options.hideTimeout || this.config.autoHideTimeout,
      position: options.position || 'top-right',
      
      // 視覚設定
      icon: this.getIcon(errorData.type, uiProfile.iconStyle),
      color: this.getColor(errorData.severity, uiProfile.colorScheme),
      animation: this.config.animationsEnabled ? 'slideIn' : null,
      
      // アクセシビリティ
      ariaLabel: this.generateAriaLabel(errorData),
      role: 'alert',
      
      // イベント
      onShow: options.onShow,
      onHide: options.onHide,
      onAction: options.onAction
    };
    
    return notification;
  }
  
  /**
   * タイトル生成
   */
  async generateTitle(errorData, personalityProfile) {
    const template = this.messageTemplates.get(`${personalityProfile}_title`);
    
    switch (personalityProfile) {
      case 'analytical':
        return `分析中にエラーを検出: ${errorData.type}`;
        
      case 'empathetic':
        return errorData.severity === 'critical' ? 
          'お困りですね。一緒に解決しましょう' : 
          '小さな問題が発生しました';
          
      case 'pragmatic':
        return errorData.recoverable ? 
          '解決可能な問題です' : 
          '対処が必要です';
          
      default:
        return errorData.title;
    }
  }
  
  /**
   * メッセージ生成
   */
  async generateMessage(errorData, personalityProfile) {
    let baseMessage = errorData.message;
    
    switch (personalityProfile) {
      case 'analytical':
        return `${baseMessage}${errorData.details ? '\n\n詳細: ' + errorData.details : ''}`;
        
      case 'empathetic':
        const reassuringPrefix = errorData.severity === 'critical' ? 
          'ご心配をおかけして申し訳ありません。' : 
          '大丈夫です。';
        return `${reassuringPrefix}${baseMessage}`;
        
      case 'pragmatic':
        const solutionHint = errorData.userActions.length > 0 ? 
          '\n\n解決方法が利用可能です。' : '';
        return `${baseMessage}${solutionHint}`;
        
      default:
        return baseMessage;
    }
  }
  
  /**
   * アクション生成
   */
  async generateActions(errorData, personalityProfile) {
    const actions = [];
    
    // 基本アクション
    if (errorData.recoverable) {
      actions.push({
        id: 'retry',
        label: '再試行',
        type: 'primary',
        icon: '🔄',
        action: 'retry'
      });
    }
    
    // 詳細表示（分析的分人用）
    if (personalityProfile === 'analytical' && errorData.technicalInfo) {
      actions.push({
        id: 'details',
        label: '詳細情報',
        type: 'secondary',
        icon: '📋',
        action: 'show-details'
      });
    }
    
    // ヘルプ（共感的分人用）
    if (personalityProfile === 'empathetic') {
      actions.push({
        id: 'help',
        label: 'サポート',
        type: 'secondary',
        icon: '🆘',
        action: 'show-help'
      });
    }
    
    // 報告（実用的分人用）
    if (personalityProfile === 'pragmatic' && errorData.severity !== 'low') {
      actions.push({
        id: 'report',
        label: '報告',
        type: 'tertiary',
        icon: '📤',
        action: 'report-error'
      });
    }
    
    // ユーザー定義アクション
    errorData.userActions.forEach(userAction => {
      actions.push({
        id: userAction.id || 'user-action',
        label: userAction.label,
        type: userAction.type || 'secondary',
        icon: userAction.icon || '⚡',
        action: userAction.action
      });
    });
    
    // 共通アクション
    actions.push({
      id: 'dismiss',
      label: '閉じる',
      type: 'tertiary',
      icon: '✕',
      action: 'dismiss'
    });
    
    return actions;
  }
  
  /**
   * 通知レンダリング
   */
  async renderNotification(notification) {
    const container = this.getOrCreateContainer();
    const element = this.createNotificationElement(notification);
    
    // DOM挿入
    container.appendChild(element);
    this.activeNotifications.set(notification.id, {
      notification,
      element,
      showTime: Date.now()
    });
    
    // アニメーション開始
    if (notification.animation && this.config.animationsEnabled) {
      await this.animateIn(element, notification.animation);
    }
    
    // 自動非表示設定
    if (notification.autoHide) {
      setTimeout(() => {
        this.hideNotification(notification.id);
      }, notification.hideTimeout);
    }
    
    // イベント発火
    if (notification.onShow) {
      notification.onShow(notification);
    }
  }
  
  /**
   * 通知要素作成
   */
  createNotificationElement(notification) {
    const element = document.createElement('div');
    element.className = `haqei-error-notification ${notification.severity} ${notification.personalityProfile}`;
    element.id = `haqei-notification-${notification.id}`;
    element.setAttribute('role', notification.role);
    element.setAttribute('aria-label', notification.ariaLabel);
    
    element.innerHTML = `
      <div class="notification-icon">
        ${notification.icon}
      </div>
      <div class="notification-content">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
        ${notification.actions.length > 0 ? `
          <div class="notification-actions">
            ${notification.actions.map(action => `
              <button 
                class="notification-action ${action.type}" 
                data-action="${action.action}"
                data-id="${action.id}"
              >
                <span class="action-icon">${action.icon}</span>
                <span class="action-label">${action.label}</span>
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="notification-progress" style="display: ${notification.autoHide ? 'block' : 'none'}">
        <div class="progress-bar" style="animation-duration: ${notification.hideTimeout}ms"></div>
      </div>
    `;
    
    // イベントリスナー設定
    this.setupNotificationEvents(element, notification);
    
    return element;
  }
  
  /**
   * 通知イベント設定
   */
  setupNotificationEvents(element, notification) {
    // アクションボタンのイベント
    element.querySelectorAll('.notification-action').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        const id = e.currentTarget.getAttribute('data-id');
        
        this.handleNotificationAction(notification.id, action, id);
        
        if (notification.onAction) {
          notification.onAction(action, id, notification);
        }
      });
    });
    
    // ホバー時の自動非表示停止
    if (notification.autoHide) {
      element.addEventListener('mouseenter', () => {
        this.pauseAutoHide(notification.id);
      });
      
      element.addEventListener('mouseleave', () => {
        this.resumeAutoHide(notification.id);
      });
    }
  }
  
  /**
   * 通知アクション処理
   */
  async handleNotificationAction(notificationId, action, actionId) {
    const notificationData = this.activeNotifications.get(notificationId);
    if (!notificationData) return;
    
    switch (action) {
      case 'retry':
        await this.handleRetryAction(notificationData);
        break;
        
      case 'show-details':
        await this.showDetailModal(notificationData);
        break;
        
      case 'show-help':
        await this.showHelpModal(notificationData);
        break;
        
      case 'report-error':
        await this.showReportModal(notificationData);
        break;
        
      case 'dismiss':
        this.hideNotification(notificationId);
        break;
        
      default:
        console.log(`Custom action: ${action} for notification ${notificationId}`);
    }
  }
  
  /**
   * 詳細モーダル表示
   */
  async showDetailModal(notificationData) {
    const { notification } = notificationData;
    const errorData = notification.technicalInfo || {};
    
    const modal = this.createModal({
      title: 'エラー詳細情報',
      content: `
        <div class="error-details">
          <div class="detail-section">
            <h4>基本情報</h4>
            <ul>
              <li><strong>エラーID:</strong> ${notification.id}</li>
              <li><strong>発生時刻:</strong> ${new Date(notification.timestamp).toLocaleString()}</li>
              <li><strong>重要度:</strong> ${notification.severity}</li>
              <li><strong>ソース:</strong> ${errorData.source || 'unknown'}</li>
            </ul>
          </div>
          
          ${errorData.stack ? `
            <div class="detail-section">
              <h4>スタックトレース</h4>
              <pre class="stack-trace">${errorData.stack}</pre>
            </div>
          ` : ''}
          
          ${errorData.context ? `
            <div class="detail-section">
              <h4>コンテキスト</h4>
              <pre class="context-info">${JSON.stringify(errorData.context, null, 2)}</pre>
            </div>
          ` : ''}
        </div>
      `,
      actions: [
        { label: 'コピー', action: () => this.copyErrorDetails(notification) },
        { label: '閉じる', action: 'close', primary: true }
      ]
    });
    
    this.showModal(modal);
  }
  
  /**
   * スタイルシート注入
   */
  async injectStyles() {
    if (document.getElementById('haqei-error-ui-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'haqei-error-ui-styles';
    style.textContent = `
      .haqei-error-notifications {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 420px;
        pointer-events: none;
      }
      
      .haqei-error-notification {
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        margin-bottom: 16px;
        overflow: hidden;
        pointer-events: auto;
        position: relative;
        display: flex;
        min-height: 80px;
        transition: all 0.3s ease;
      }
      
      .haqei-error-notification:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
      }
      
      /* 重要度別スタイル */
      .haqei-error-notification.low {
        border-left: 4px solid #10b981;
      }
      
      .haqei-error-notification.medium {
        border-left: 4px solid #f59e0b;
      }
      
      .haqei-error-notification.high {
        border-left: 4px solid #ef4444;
      }
      
      .haqei-error-notification.critical {
        border-left: 4px solid #dc2626;
        animation: criticalPulse 2s infinite;
      }
      
      /* 分人別スタイル */
      .haqei-error-notification.analytical {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      }
      
      .haqei-error-notification.empathetic {
        background: linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%);
      }
      
      .haqei-error-notification.pragmatic {
        background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%);
      }
      
      .notification-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        font-size: 24px;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
      }
      
      .notification-content {
        flex: 1;
        padding: 16px;
      }
      
      .notification-title {
        font-weight: 600;
        font-size: 16px;
        color: #1f2937;
        margin-bottom: 8px;
        line-height: 1.4;
      }
      
      .notification-message {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
        margin-bottom: 12px;
      }
      
      .notification-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .notification-action {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 500;
      }
      
      .notification-action.primary {
        background: #3b82f6;
        color: white;
      }
      
      .notification-action.primary:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }
      
      .notification-action.secondary {
        background: #f3f4f6;
        color: #374151;
      }
      
      .notification-action.secondary:hover {
        background: #e5e7eb;
      }
      
      .notification-action.tertiary {
        background: transparent;
        color: #6b7280;
        border: 1px solid #d1d5db;
      }
      
      .notification-action.tertiary:hover {
        background: #f9fafb;
        color: #374151;
      }
      
      .action-icon {
        font-size: 12px;
      }
      
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
      }
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        animation: progressShrink linear forwards;
        transform-origin: left;
      }
      
      /* アニメーション */
      @keyframes criticalPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes progressShrink {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
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
      
      .notification-slide-in {
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      /* モーダル */
      .haqei-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      
      .haqei-modal {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .modal-header {
        padding: 24px 24px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .modal-title {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 16px;
      }
      
      .modal-content {
        padding: 24px;
      }
      
      .modal-actions {
        padding: 0 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      
      /* レスポンシブ */
      @media (max-width: 480px) {
        .haqei-error-notifications {
          left: 20px;
          right: 20px;
          max-width: none;
        }
        
        .notification-actions {
          flex-direction: column;
        }
        
        .notification-action {
          justify-content: center;
        }
      }
      
      /* ダークモード対応 */
      @media (prefers-color-scheme: dark) {
        .haqei-error-notification {
          background: #1f2937;
          color: #f9fafb;
        }
        
        .notification-title {
          color: #f9fafb;
        }
        
        .notification-message {
          color: #d1d5db;
        }
        
        .haqei-modal {
          background: #1f2937;
          color: #f9fafb;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * コンテナ取得または作成
   */
  getOrCreateContainer() {
    let container = document.getElementById('haqei-error-notifications');
    if (!container) {
      container = document.createElement('div');
      container.id = 'haqei-error-notifications';
      container.className = 'haqei-error-notifications';
      document.body.appendChild(container);
    }
    return container;
  }
  
  /**
   * 通知非表示
   */
  async hideNotification(notificationId) {
    const notificationData = this.activeNotifications.get(notificationId);
    if (!notificationData) return;
    
    const { element, notification } = notificationData;
    
    // アニメーション
    if (this.config.animationsEnabled) {
      await this.animateOut(element);
    }
    
    // DOM削除
    element.remove();
    this.activeNotifications.delete(notificationId);
    
    // キューからの表示
    this.processNotificationQueue();
    
    // イベント発火
    if (notification.onHide) {
      notification.onHide(notification);
    }
  }
  
  /**
   * フォールバック表示
   */
  displayFallbackError(errorData) {
    const message = errorData.message || 'システムエラーが発生しました';
    
    // ブラウザのネイティブ確認ダイアログ
    const userResponse = confirm(`${message}\n\n再試行しますか？`);
    
    if (userResponse && errorData.onRetry) {
      errorData.onRetry();
    }
  }
  
  // ユーティリティメソッド
  generateId() {
    return `haqei-err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getIcon(type, style = 'friendly') {
    const icons = {
      friendly: {
        error: '😔',
        warning: '😟',
        info: '💡',
        success: '😊',
        network: '🌐',
        technical: '⚙️'
      },
      technical: {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        success: '✅',
        network: '🔗',
        technical: '🔧'
      },
      action: {
        error: '🔴',
        warning: '🟡',
        info: '🔵',
        success: '🟢',
        network: '📡',
        technical: '⚡'
      }
    };
    
    return icons[style]?.[type] || icons.friendly.error;
  }
  
  getColor(severity, scheme = 'blue') {
    const colors = {
      blue: { low: '#3b82f6', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626' },
      warm: { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#dc2626' },
      green: { low: '#10b981', medium: '#84cc16', high: '#f59e0b', critical: '#ef4444' }
    };
    
    return colors[scheme]?.[severity] || colors.blue.medium;
  }
  
  generateAriaLabel(errorData) {
    return `エラー通知: ${errorData.title}. ${errorData.message}`;
  }
  
  initializeMessageTemplates() {
    // 各分人別メッセージテンプレートの初期化
    this.messageTemplates.set('analytical_title', 'システム分析結果');
    this.messageTemplates.set('empathetic_title', 'お知らせ');
    this.messageTemplates.set('pragmatic_title', '状況報告');
  }
  
  // プレースホルダーメソッド（簡略化）
  async setupAccessibility() { console.log("♿ Accessibility features enabled"); }
  async setupAudioSystem() { console.log("🔊 Audio system ready"); }
  setupHapticFeedback() { console.log("📳 Haptic feedback enabled"); }
  async provideMultimodalFeedback(notification) { /* 音声・触覚フィードバック */ }
  async animateIn(element, animation) { element.classList.add(`notification-${animation}`); }
  async animateOut(element) { element.style.opacity = '0'; element.style.transform = 'translateX(100%)'; }
  queueNotification(notification) { this.notificationQueue.push(notification); }
  processNotificationQueue() { /* キューからの次の通知表示 */ }
  pauseAutoHide(id) { /* 自動非表示の一時停止 */ }
  resumeAutoHide(id) { /* 自動非表示の再開 */ }
  async handleRetryAction(notificationData) { console.log("🔄 Retry action triggered"); }
  async showHelpModal(notificationData) { console.log("🆘 Help modal displayed"); }
  async showReportModal(notificationData) { console.log("📤 Report modal displayed"); }
  createModal(options) { return { id: 'modal-' + Date.now(), ...options }; }
  showModal(modal) { console.log("🎭 Modal displayed:", modal.title); }
  copyErrorDetails(notification) { console.log("📋 Error details copied"); }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.UserFriendlyErrorUI = UserFriendlyErrorUI;
}

console.log("🎨 UserFriendlyErrorUI.js loaded - empathetic user experience ready");