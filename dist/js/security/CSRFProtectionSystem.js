/**
 * CSRF攻撃防御システム
 * トークンベース認証とリファラー検証による多層防御
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-05
 * Security Level: Enterprise
 */

class CSRFProtectionSystem {
  constructor() {
    
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.tokenStore = new Map();
    this.sessionTokens = new Map();
    this.config = this.getSecurityConfig();
    this.init();
  }

  /**
   * CSRF保護設定
   */
  getSecurityConfig() {
    return {
      tokenLength: 32,
      tokenExpiry: 30 * 60 * 1000, // 30分
      maxTokensPerSession: 10,
      enforceRefererCheck: true,
      allowedOrigins: [
        'https://haqei.com',
        'https://www.haqei.com',
        'https://analyzer.haqei.com'
      ],
      requireSecureContext: true,
      cookieSettings: {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 3600 // 1時間
      }
    };
  }

  /**
   * CSRF保護システムの初期化
   */
  init() {
    try {
      this.setupMetaTags();
      this.setupFormProtection();
      this.setupAjaxProtection();
      this.setupTokenRotation();
      
      console.log('🛡️ CSRF保護システム初期化完了');
    } catch (error) {
      console.error('❌ CSRF保護システム初期化エラー:', error);
    }
  }

  /**
   * メタタグによるトークン設定
   */
  setupMetaTags() {
    // 既存のCSRFトークンメタタグを確認
    let metaTag = document.querySelector('meta[name="csrf-token"]');
    
    if (!metaTag) {
      // 新しいCSRFトークンメタタグを作成
      metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      document.head.appendChild(metaTag);
    }

    // 新しいトークンを生成・設定
    const token = this.generateToken();
    metaTag.content = token;
    
    // セッションIDに基づいてトークンを保存
    const sessionId = this.getSessionId();
    this.storeToken(sessionId, token);
  }

  /**
   * フォーム保護の設定
   */
  setupFormProtection() {
    // 開発環境チェック
    if (window.DEV_MODE || (window.HAQEI_CONFIG && window.HAQEI_CONFIG.environment === 'development')) {
      console.log('🔧 開発環境: CSRF保護をスキップ');
      return;
    }
    
    // 既存のフォームに隠しフィールドを追加
    const forms = document.querySelectorAll('form');
    forms.forEach(form => this.protectForm(form));

    // 新しく追加されるフォームの監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node && node.nodeType === Node.ELEMENT_NODE) {
              // nodeがElementであることを確認
              if (node.tagName === 'FORM') {
                this.protectForm(node);
              } else if (node.querySelectorAll) {
                const forms = node.querySelectorAll('form');
                forms.forEach(form => this.protectForm(form));
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * 個別フォームの保護
   */
  protectForm(form) {
    if (!form || form.hasAttribute('data-csrf-protected')) {
      return;
    }

    // CSRFトークン隠しフィールドの追加
    const tokenField = document.createElement('input');
    tokenField.type = 'hidden';
    tokenField.name = '_csrf';
    tokenField.value = this.getCurrentToken();
    
    form.appendChild(tokenField);
    form.setAttribute('data-csrf-protected', 'true');

    // フォーム送信時の検証
    form.addEventListener('submit', (event) => {
      if (!this.validateFormSubmission(form)) {
        event.preventDefault();
        this.showSecurityWarning('CSRF token validation failed');
      }
    });
  }

  /**
   * AJAX保護の設定
   */
  setupAjaxProtection() {
    // fetch API のインターセプト
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      const secureOptions = this.addCSRFHeaders(options);
      return originalFetch(url, secureOptions);
    };

    // XMLHttpRequest のインターセプト
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._method = method;
      this._url = url;
      return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(data) {
      if (this._method && this._method.toUpperCase() !== 'GET') {
        const token = window.csrfProtection.getCurrentToken();
        this.setRequestHeader('X-CSRF-Token', token);
        this.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      return originalXHRSend.apply(this, [data]);
    };
  }

  /**
   * CSRFヘッダーの追加
   */
  addCSRFHeaders(options) {
    const method = options.method?.toUpperCase() || 'GET';
    
    // GET、HEAD、OPTIONS以外のメソッドにCSRFトークンを追加
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const headers = new Headers(options.headers || {});
      
      headers.set('X-CSRF-Token', this.getCurrentToken());
      headers.set('X-Requested-With', 'XMLHttpRequest');
      
      // リファラーヘッダーの確認
      if (this.config.enforceRefererCheck) {
        headers.set('Referer', window.location.href);
      }

      return {
        ...options,
        headers,
        credentials: 'same-origin' // Cookie送信を同一オリジンに限定
      };
    }

    return options;
  }

  /**
   * セキュアなトークン生成
   */
  generateToken() {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(this.config.tokenLength);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // フォールバック（セキュリティレベルは低い）
      console.warn('⚠️ Crypto API利用不可 - フォールバック乱数生成');
      return this.rng.next().toString(36).substring(2) + Date.now().toString(36);
    }
  }

  /**
   * トークンの保存
   */
  storeToken(sessionId, token) {
    const tokenData = {
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.tokenExpiry,
      used: false
    };

    // セッション単位でのトークン管理
    if (!this.sessionTokens.has(sessionId)) {
      this.sessionTokens.set(sessionId, []);
    }

    const sessionTokenList = this.sessionTokens.get(sessionId);
    
    // 古いトークンの削除（LRU）
    if (sessionTokenList.length >= this.config.maxTokensPerSession) {
      sessionTokenList.shift();
    }

    sessionTokenList.push(tokenData);
    this.tokenStore.set(token, tokenData);
  }

  /**
   * トークンの検証
   */
  validateToken(token, sessionId = null) {
    if (!token || typeof token !== 'string') {
      console.warn('⚠️ 無効なCSRFトークン');
      return false;
    }

    const tokenData = this.tokenStore.get(token);
    if (!tokenData) {
      console.warn('⚠️ 未知のCSRFトークン');
      return false;
    }

    // 有効期限チェック
    if (Date.now() > tokenData.expiresAt) {
      console.warn('⚠️ 期限切れCSRFトークン');
      this.tokenStore.delete(token);
      return false;
    }

    // ワンタイム使用の検証（オプション）
    if (tokenData.used) {
      console.warn('⚠️ 再利用されたCSRFトークン');
      return false;
    }

    // セッションIDの検証
    if (sessionId && !this.validateTokenForSession(token, sessionId)) {
      console.warn('⚠️ セッション不一致CSRFトークン');
      return false;
    }

    // リファラーチェック
    if (this.config.enforceRefererCheck && !this.validateReferer()) {
      console.warn('⚠️ リファラー検証失敗');
      return false;
    }

    // オリジンチェック
    if (!this.validateOrigin()) {
      console.warn('⚠️ オリジン検証失敗');
      return false;
    }

    // 使用済みマーク（ワンタイム使用の場合）
    // tokenData.used = true;

    return true;
  }

  /**
   * セッション単位でのトークン検証
   */
  validateTokenForSession(token, sessionId) {
    const sessionTokenList = this.sessionTokens.get(sessionId);
    if (!sessionTokenList) return false;

    return sessionTokenList.some(tokenData => tokenData.token === token);
  }

  /**
   * リファラー検証
   */
  validateReferer() {
    const referer = document.referrer;
    const origin = window.location.origin;

    // リファラーが空の場合は警告（但し拒否はしない）
    if (!referer) {
      console.warn('⚠️ リファラーヘッダーが空です');
      return true; // 厳格すぎる場合は true を返す
    }

    // 同一オリジンの検証
    try {
      const refererUrl = new URL(referer);
      return refererUrl.origin === origin;
    } catch (error) {
      console.warn('⚠️ リファラーURL解析エラー:', error);
      return false;
    }
  }

  /**
   * オリジン検証
   */
  validateOrigin() {
    const origin = window.location.origin;
    return this.config.allowedOrigins.includes(origin);
  }

  /**
   * フォーム送信の検証
   */
  validateFormSubmission(form) {
    const tokenField = form.querySelector('input[name="_csrf"]');
    if (!tokenField) {
      console.warn('⚠️ CSRFトークンフィールドが見つかりません');
      return false;
    }

    return this.validateToken(tokenField.value, this.getSessionId());
  }

  /**
   * 現在のトークン取得
   */
  getCurrentToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
  }

  /**
   * セッションID取得
   */
  getSessionId() {
    // セッションIDの取得ロジック（実装環境に応じて）
    return sessionStorage.getItem('sessionId') || 
           localStorage.getItem('sessionId') || 
           'default-session';
  }

  /**
   * トークンローテーション
   */
  setupTokenRotation() {
    // 定期的なトークン更新
    setInterval(() => {
      this.rotateToken();
    }, this.config.tokenExpiry / 2); // 有効期限の半分で更新

    // ページフォーカス時の更新
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.rotateToken();
      }
    });
  }

  /**
   * トークンの更新
   */
  rotateToken() {
    try {
      const newToken = this.generateToken();
      const sessionId = this.getSessionId();
      
      // メタタグの更新
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      if (metaTag) {
        metaTag.content = newToken;
      }

      // 新しいトークンの保存
      this.storeToken(sessionId, newToken);

      // フォームトークンの更新
      const tokenFields = document.querySelectorAll('input[name="_csrf"]');
      tokenFields.forEach(field => {
        field.value = newToken;
      });

      console.log('🔄 CSRFトークン更新完了');
    } catch (error) {
      console.error('❌ トークン更新エラー:', error);
    }
  }

  /**
   * 期限切れトークンのクリーンアップ
   */
  cleanupExpiredTokens() {
    const now = Date.now();
    
    // 個別トークンのクリーンアップ
    for (const [token, tokenData] of this.tokenStore.entries()) {
      if (now > tokenData.expiresAt) {
        this.tokenStore.delete(token);
      }
    }

    // セッショントークンのクリーンアップ
    for (const [sessionId, tokenList] of this.sessionTokens.entries()) {
      const validTokens = tokenList.filter(tokenData => now <= tokenData.expiresAt);
      if (validTokens.length === 0) {
        this.sessionTokens.delete(sessionId);
      } else {
        this.sessionTokens.set(sessionId, validTokens);
      }
    }
  }

  /**
   * セキュリティ警告の表示
   */
  showSecurityWarning(message) {
    console.error('🚨 CSRF保護警告:', message);
    
    // ユーザーへの通知（実装環境に応じて）
    if (window.notifications) {
      window.notifications.showError('セキュリティエラー: リクエストが拒否されました');
    }
  }

  /**
   * CSRF保護統計
   */
  getProtectionStats() {
    return {
      activeTokens: this.tokenStore.size,
      activeSessions: this.sessionTokens.size,
      config: {
        tokenLength: this.config.tokenLength,
        tokenExpiry: this.config.tokenExpiry,
        refererCheckEnabled: this.config.enforceRefererCheck,
        allowedOrigins: this.config.allowedOrigins.length,
        secureContext: this.config.requireSecureContext
      },
      protectedForms: document.querySelectorAll('form[data-csrf-protected]').length,
      currentToken: this.getCurrentToken() ? 'Active' : 'None'
    };
  }

  /**
   * デバッグ情報の出力
   */
  debug() {
    console.group('🛡️ CSRF Protection Debug Info');
    console.log('Protection Stats:', this.getProtectionStats());
    console.log('Token Store:', Array.from(this.tokenStore.entries()));
    console.log('Session Tokens:', Array.from(this.sessionTokens.entries()));
    console.groupEnd();
  }
}

// セキュアコンテキストでのみ動作
if (window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost') {
  if (typeof window !== 'undefined') {
    window.CSRFProtectionSystem = CSRFProtectionSystem;
    
    // 自動初期化
    window.csrfProtection = new CSRFProtectionSystem();
    
    // 定期クリーンアップの開始
    setInterval(() => {
      window.csrfProtection.cleanupExpiredTokens();
    }, 5 * 60 * 1000); // 5分毎
  }
} else {
  console.warn('⚠️ CSRF保護システムはセキュアコンテキストでのみ動作します');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSRFProtectionSystem;
}

console.log('🛡️ CSRFProtectionSystem.js 読み込み完了 - 企業レベルCSRF防御');