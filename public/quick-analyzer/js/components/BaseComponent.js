/**
 * BaseComponent - 全UIコンポーネントの基底クラス
 * 共通のライフサイクルメソッドとユーティリティを提供
 */
class BaseComponent {
  /**
   * @param {string} containerId - コンテナ要素のID
   * @param {Object} options - 初期化オプション
   */
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = { ...this.getDefaultOptions(), ...options };
    this.initialized = false;
    this.destroyed = false;
    this.eventListeners = [];
    this.childComponents = [];
    
    // エラーハンドリング
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    
    // 初期化状態をログ
    this.log('info', 'constructor', `Initializing ${this.constructor.name}`, {
      containerId,
      options: this.options
    });
  }

  /**
   * デフォルトオプションを取得
   * @returns {Object}
   */
  getDefaultOptions() {
    return {
      debug: false,
      autoRender: true,
      animations: true,
      accessibility: true
    };
  }

  /**
   * コンポーネントを初期化
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) {
      this.log('warn', 'init', 'Component already initialized');
      return;
    }

    try {
      this.log('info', 'init', 'Starting initialization');
      
      // 初期化前の処理
      await this.beforeInit();
      
      // データの読み込み
      await this.loadData();
      
      // イベントリスナーの設定
      this.bindEvents();
      
      // 自動レンダリングが有効な場合
      if (this.options.autoRender) {
        await this.render();
      }
      
      // 初期化後の処理
      await this.afterInit();
      
      this.initialized = true;
      this.log('info', 'init', 'Initialization completed');
      
      // 初期化完了イベントを発火
      this.emit('initialized');
      
    } catch (error) {
      this.log('error', 'init', 'Initialization failed', error);
      this.handleError(error, 'initialization');
      throw error;
    }
  }

  /**
   * 初期化前の処理（サブクラスでオーバーライド）
   * @returns {Promise<void>}
   */
  async beforeInit() {
    // サブクラスで実装
  }

  /**
   * データ読み込み（サブクラスでオーバーライド）
   * @returns {Promise<void>}
   */
  async loadData() {
    // サブクラスで実装
  }

  /**
   * 初期化後の処理（サブクラスでオーバーライド）
   * @returns {Promise<void>}
   */
  async afterInit() {
    // サブクラスで実装
  }

  /**
   * コンポーネントをレンダリング
   * @returns {Promise<void>}
   */
  async render() {
    if (this.destroyed) {
      this.log('warn', 'render', 'Cannot render destroyed component');
      return;
    }

    try {
      this.log('info', 'render', 'Starting render');
      
      // レンダリング前の処理
      await this.beforeRender();
      
      // メインコンテンツのレンダリング
      const content = await this.renderContent();
      if (content) {
        this.container.innerHTML = content;
      }
      
      // DOM更新後の処理
      await this.afterRender();
      
      // アニメーションの適用
      if (this.options.animations) {
        this.applyEnterAnimations();
      }
      
      // アクセシビリティの設定
      if (this.options.accessibility) {
        this.setupAccessibility();
      }
      
      this.log('info', 'render', 'Render completed');
      
      // レンダリング完了イベントを発火
      this.emit('rendered');
      
    } catch (error) {
      this.log('error', 'render', 'Render failed', error);
      this.handleError(error, 'rendering');
      throw error;
    }
  }

  /**
   * レンダリング前の処理（サブクラスでオーバーライド）
   * @returns {Promise<void>}
   */
  async beforeRender() {
    // サブクラスで実装
  }

  /**
   * メインコンテンツのレンダリング（サブクラスで実装）
   * @returns {Promise<string>}
   */
  async renderContent() {
    throw new Error('renderContent method must be implemented by subclass');
  }

  /**
   * レンダリング後の処理（サブクラスでオーバーライド）
   * @returns {Promise<void>}
   */
  async afterRender() {
    // サブクラスで実装
  }

  /**
   * イベントリスナーをバインド
   */
  bindEvents() {
    // サブクラスで実装
  }

  /**
   * イベントリスナーを追加（自動管理）
   * @param {Element} element - 対象要素
   * @param {string} event - イベント名
   * @param {Function} handler - ハンドラー関数
   * @param {Object} options - イベントオプション
   */
  addEventListener(element, event, handler, options = {}) {
    const boundHandler = handler.bind(this);
    element.addEventListener(event, boundHandler, options);
    
    // 後でクリーンアップできるように記録
    this.eventListeners.push({
      element,
      event,
      handler: boundHandler,
      options
    });
  }

  /**
   * エンターアニメーションを適用
   */
  applyEnterAnimations() {
    if (!this.options.animations) return;
    
    // コンテナにアニメーションクラスを追加
    this.container.classList.add('animate-fadeIn');
    
    // 子要素に段階的アニメーションを適用
    const animatableElements = this.container.querySelectorAll('[data-animate]');
    animatableElements.forEach((element, index) => {
      element.style.setProperty('--index', index);
      element.classList.add('animate-slideInFromRight', 'stagger-children');
    });
  }

  /**
   * エグジットアニメーションを適用
   * @returns {Promise<void>}
   */
  async applyExitAnimations() {
    if (!this.options.animations) return;
    
    return new Promise((resolve) => {
      this.container.classList.add('animate-fadeOut');
      
      // アニメーション完了を待つ
      setTimeout(() => {
        resolve();
      }, 400); // animation duration
    });
  }

  /**
   * アクセシビリティ設定
   */
  setupAccessibility() {
    if (!this.options.accessibility) return;
    
    // フォーカス管理
    this.setupFocusManagement();
    
    // ARIA属性の設定
    this.setupAriaAttributes();
    
    // キーボードナビゲーション
    this.setupKeyboardNavigation();
  }

  /**
   * フォーカス管理のセットアップ
   */
  setupFocusManagement() {
    // フォーカス可能な要素を特定
    const focusableElements = this.container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // フォーカストラップの設定（モーダル等で使用）
    if (this.options.focusTrap && focusableElements.length > 0) {
      this.setupFocusTrap(focusableElements);
    }
  }

  /**
   * ARIA属性のセットアップ
   */
  setupAriaAttributes() {
    // コンポーネントのroleを設定
    if (this.options.role) {
      this.container.setAttribute('role', this.options.role);
    }
    
    // ライブリージョンの設定
    if (this.options.liveRegion) {
      this.container.setAttribute('aria-live', this.options.liveRegion);
    }
  }

  /**
   * キーボードナビゲーションのセットアップ
   */
  setupKeyboardNavigation() {
    // Escapeキーでコンポーネントを閉じる
    if (this.options.escapeToClose) {
      this.addEventListener(document, 'keydown', (e) => {
        if (e.key === 'Escape') {
          this.close();
        }
      });
    }
  }

  /**
   * フォーカストラップのセットアップ
   * @param {NodeList} focusableElements - フォーカス可能な要素
   */
  setupFocusTrap(focusableElements) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    this.addEventListener(this.container, 'keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  /**
   * 子コンポーネントを追加
   * @param {BaseComponent} component - 子コンポーネント
   */
  addChildComponent(component) {
    this.childComponents.push(component);
  }

  /**
   * コンポーネントを表示
   * @returns {Promise<void>}
   */
  async show() {
    if (this.destroyed) return;
    
    this.container.style.display = 'block';
    
    if (this.options.animations) {
      this.applyEnterAnimations();
    }
    
    this.emit('shown');
  }

  /**
   * コンポーネントを非表示
   * @returns {Promise<void>}
   */
  async hide() {
    if (this.destroyed) return;
    
    if (this.options.animations) {
      await this.applyExitAnimations();
    }
    
    this.container.style.display = 'none';
    this.emit('hidden');
  }

  /**
   * コンポーネントを破棄
   */
  destroy() {
    if (this.destroyed) return;
    
    this.log('info', 'destroy', 'Destroying component');
    
    // 子コンポーネントを破棄
    this.childComponents.forEach(child => {
      if (child && typeof child.destroy === 'function') {
        child.destroy();
      }
    });
    
    // イベントリスナーを削除
    this.eventListeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    
    // コンテナをクリア
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // 破棄完了イベントを発火
    this.emit('destroyed');
    
    this.destroyed = true;
    this.initialized = false;
    
    this.log('info', 'destroy', 'Component destroyed');
  }

  /**
   * カスタムイベントを発火
   * @param {string} eventName - イベント名
   * @param {*} detail - イベントの詳細データ
   */
  emit(eventName, detail = null) {
    const event = new CustomEvent(`${this.constructor.name.toLowerCase()}:${eventName}`, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    this.container.dispatchEvent(event);
    this.log('debug', 'emit', `Event emitted: ${eventName}`, detail);
  }

  /**
   * エラーハンドリング
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - エラーが発生したコンテキスト
   */
  handleError(error, context = 'unknown') {
    this.log('error', 'handleError', `Error in ${context}`, error);
    
    // エラーイベントを発火
    this.emit('error', { error, context });
    
    // グローバルエラーハンドラーが存在する場合は通知
    if (window.ErrorHandler && typeof window.ErrorHandler.handleError === 'function') {
      window.ErrorHandler.handleError(error, {
        component: this.constructor.name,
        context,
        containerId: this.containerId
      });
    }
  }

  /**
   * ログ出力
   * @param {string} level - ログレベル
   * @param {string} method - メソッド名
   * @param {string} message - メッセージ
   * @param {*} data - 追加データ
   */
  log(level, method, message, data = null) {
    if (!this.options.debug && level === 'debug') return;
    
    const logData = {
      component: this.constructor.name,
      method,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    
    console[level](`[${this.constructor.name}] ${message}`, logData);
  }

  /**
   * ユーティリティ: 要素を取得
   * @param {string} selector - セレクター
   * @returns {Element|null}
   */
  $(selector) {
    return this.container.querySelector(selector);
  }

  /**
   * ユーティリティ: 複数の要素を取得
   * @param {string} selector - セレクター
   * @returns {NodeList}
   */
  $$(selector) {
    return this.container.querySelectorAll(selector);
  }

  /**
   * ユーティリティ: 非同期処理の待機
   * @param {number} ms - 待機時間（ミリ秒）
   * @returns {Promise<void>}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ユーティリティ: 安全なHTML文字列作成
   * @param {string} text - テキスト
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// グローバルに公開
window.BaseComponent = BaseComponent;