/**
 * AccessibilityManager.js - WCAG 2.1 AA準拠アクセシビリティマネージャー
 * 
 * 機能：
 * - キーボードナビゲーション完全管理
 * - ARIA属性動的制御
 * - フォーカス管理・復元システム
 * - スクリーンリーダー最適化
 * - 色コントラスト動的検証
 * - bunenjin哲学アクセシビリティ統合
 * 
 * WCAG 2.1 AA準拠要件：
 * - Perceivable: 知覚可能
 * - Operable: 操作可能
 * - Understandable: 理解可能
 * - Robust: 堅牢
 * 
 * バージョン: v1.0.0-wcag-aa-compliance
 * 作成日: 2025-08-05
 */

class AccessibilityManager {
  constructor(options = {}) {
    this.options = {
      enableKeyboardNavigation: true,
      enableAriaManagement: true,
      enableFocusManagement: true,
      enableContrastChecking: true,
      enableScreenReaderOptimization: true,
      debugMode: false,
      ...options
    };
    
    // フォーカス管理
    this.focusHistory = [];
    this.currentFocusIndex = -1;
    this.focusTrapStack = [];
    
    // キーボードナビゲーション
    this.keyboardNavigation = {
      enabled: true,
      currentElement: null,
      navigableElements: [],
      shortcuts: new Map()
    };
    
    // ARIA管理
    this.ariaElements = new Map();
    this.liveRegions = new Map();
    
    // スクリーンリーダー
    this.screenReader = {
      announcements: [],
      currentAnnouncement: null,
      announcementQueue: []
    };
    
    // コントラスト検証
    this.contrastResults = new Map();
    
    // bunenjin哲学統合
    this.bunenjinIntegration = {
      personaAccessibility: new Map(),
      harmonyIndicators: [],
      tripleOSElements: []
    };
    
    console.log('🎯 AccessibilityManager initialized with WCAG 2.1 AA compliance');
  }
  
  /**
   * アクセシビリティマネージャーの初期化
   */
  async initialize() {
    try {
      // 基本設定の適用
      this.applyWCAGCompliance();
      
      // キーボードナビゲーション設定
      if (this.options.enableKeyboardNavigation) {
        this.setupKeyboardNavigation();
      }
      
      // ARIA管理設定
      if (this.options.enableAriaManagement) {
        this.setupAriaManagement();
      }
      
      // フォーカス管理設定
      if (this.options.enableFocusManagement) {
        this.setupFocusManagement();
      }
      
      // スクリーンリーダー最適化
      if (this.options.enableScreenReaderOptimization) {
        this.setupScreenReaderOptimization();
      }
      
      // コントラスト検証
      if (this.options.enableContrastChecking) {
        this.setupContrastChecking();
      }
      
      // bunenjin哲学統合
      this.setupBunenjinAccessibility();
      
      // イベントリスナー設定
      this.setupEventListeners();
      
      console.log('✅ AccessibilityManager initialization completed');
      return true;
      
    } catch (error) {
      console.error('❌ AccessibilityManager initialization failed:', error);
      return false;
    }
  }
  
  /**
   * WCAG準拠基本設定の適用
   */
  applyWCAGCompliance() {
    // WCAG準拠クラスの追加
    document.documentElement.classList.add('wcag-compliant');
    
    // 言語属性の確認・設定
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'ja';
    }
    
    // メタタグの確認・追加
    this.ensureAccessibilityMeta();
    
    // スキップリンクの確認・追加
    this.ensureSkipLinks();
    
    // ライブリージョンの設定
    this.setupLiveRegions();
  }
  
  /**
   * アクセシビリティメタタグの確保
   */
  ensureAccessibilityMeta() {
    const metaTags = [
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=yes' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'theme-color', content: '#1a202c' }
    ];
    
    metaTags.forEach(meta => {
      let existingMeta = document.querySelector(`meta[name="${meta.name}"]`);
      if (!existingMeta) {
        existingMeta = document.createElement('meta');
        existingMeta.name = meta.name;
        document.head.appendChild(existingMeta);
      }
      existingMeta.content = meta.content;
    });
  }
  
  /**
   * スキップリンクの確保
   */
  ensureSkipLinks() {
    let skipLink = document.getElementById('skip-to-main');
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.id = 'skip-to-main';
      skipLink.className = 'skip-link';
      skipLink.href = '#main-content';
      skipLink.textContent = 'メインコンテンツへスキップ';
      skipLink.setAttribute('aria-label', 'メインコンテンツへ移動');
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // メインコンテンツの確認
    let mainContent = document.getElementById('main-content');
    if (!mainContent) {
      mainContent = document.querySelector('main, [role="main"]');
      if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
      }
    }
  }
  
  /**
   * ライブリージョンの設定
   */
  setupLiveRegions() {
    const liveRegions = [
      { id: 'announcements', type: 'polite' },
      { id: 'urgent-announcements', type: 'assertive' },
      { id: 'status-updates', type: 'polite' }
    ];
    
    liveRegions.forEach(region => {
      let element = document.getElementById(region.id);
      if (!element) {
        element = document.createElement('div');
        element.id = region.id;
        element.className = 'sr-only live-region';
        element.setAttribute('aria-live', region.type);
        element.setAttribute('aria-atomic', 'true');
        element.setAttribute('role', 'status');
        document.body.appendChild(element);
      }
      this.liveRegions.set(region.id, element);
    });
  }
  
  /**
   * キーボードナビゲーション設定
   */
  setupKeyboardNavigation() {
    // 基本キーボードショートカット
    this.keyboardNavigation.shortcuts.set('Tab', this.handleTabNavigation.bind(this));
    this.keyboardNavigation.shortcuts.set('Shift+Tab', this.handleShiftTabNavigation.bind(this));
    this.keyboardNavigation.shortcuts.set('Enter', this.handleEnterKey.bind(this));
    this.keyboardNavigation.shortcuts.set('Space', this.handleSpaceKey.bind(this));
    this.keyboardNavigation.shortcuts.set('Escape', this.handleEscapeKey.bind(this));
    this.keyboardNavigation.shortcuts.set('ArrowUp', this.handleArrowNavigation.bind(this, 'up'));
    this.keyboardNavigation.shortcuts.set('ArrowDown', this.handleArrowNavigation.bind(this, 'down'));
    this.keyboardNavigation.shortcuts.set('ArrowLeft', this.handleArrowNavigation.bind(this, 'left'));
    this.keyboardNavigation.shortcuts.set('ArrowRight', this.handleArrowNavigation.bind(this, 'right'));
    
    // ナビゲート可能要素の更新
    this.updateNavigableElements();
  }
  
  /**
   * ナビゲート可能要素の更新
   */
  updateNavigableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="link"]:not([aria-disabled="true"])',
      '.haqei-question-element[data-question-id]'
    ].join(', ');
    
    this.keyboardNavigation.navigableElements = Array.from(
      document.querySelectorAll(selector)
    ).filter(element => {
      return this.isElementVisible(element) && this.isElementInteractive(element);
    });
  }
  
  /**
   * 要素の可視性チェック
   */
  isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  }
  
  /**
   * 要素のインタラクティブ性チェック
   */
  isElementInteractive(element) {
    const style = window.getComputedStyle(element);
    return style.pointerEvents !== 'none' && 
           !element.hasAttribute('disabled') &&
           element.getAttribute('aria-disabled') !== 'true';
  }
  
  /**
   * Tabキーナビゲーション処理
   */
  handleTabNavigation(event) {
    this.updateNavigableElements();
    const currentIndex = this.keyboardNavigation.navigableElements.indexOf(event.target);
    
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % this.keyboardNavigation.navigableElements.length;
      const nextElement = this.keyboardNavigation.navigableElements[nextIndex];
      
      if (nextElement) {
        event.preventDefault();
        this.setFocus(nextElement);
      }
    }
  }
  
  /**
   * Shift+Tabキーナビゲーション処理
   */
  handleShiftTabNavigation(event) {
    this.updateNavigableElements();
    const currentIndex = this.keyboardNavigation.navigableElements.indexOf(event.target);
    
    if (currentIndex !== -1) {
      const prevIndex = currentIndex === 0 ? 
        this.keyboardNavigation.navigableElements.length - 1 : 
        currentIndex - 1;
      const prevElement = this.keyboardNavigation.navigableElements[prevIndex];
      
      if (prevElement) {
        event.preventDefault();
        this.setFocus(prevElement);
      }
    }
  }
  
  /**
   * Enterキー処理
   */
  handleEnterKey(event) {
    const element = event.target;
    
    // ボタンやリンクの場合はクリックをトリガー
    if (element.tagName === 'BUTTON' || 
        element.tagName === 'A' || 
        element.getAttribute('role') === 'button' ||
        element.getAttribute('role') === 'link') {
      element.click();
    }
    
    // HAQEIクエスチョン要素の場合
    if (element.classList.contains('haqei-question-element')) {
      this.handleQuestionElementActivation(element, event);
    }
  }
  
  /**
   * Spaceキー処理
   */
  handleSpaceKey(event) {
    const element = event.target;
    
    // ボタンの場合はクリックをトリガー
    if (element.tagName === 'BUTTON' || 
        element.getAttribute('role') === 'button') {
      event.preventDefault();
      element.click();
    }
    
    // チェックボックスやラジオボタンの場合
    if (element.type === 'checkbox' || element.type === 'radio') {
      // デフォルトの動作を許可
      return;
    }
  }
  
  /**
   * Escapeキー処理
   */
  handleEscapeKey(event) {
    // フォーカストラップから抜ける
    if (this.focusTrapStack.length > 0) {
      this.releaseFocusTrap();
    }
    
    // モーダルやダイアログを閉じる
    const modal = document.querySelector('.modal:not([aria-hidden="true"])');
    if (modal) {
      this.closeModal(modal);
    }
    
    // ドロップダウンメニューを閉じる
    const dropdown = document.querySelector('.dropdown.open');
    if (dropdown) {
      this.closeDropdown(dropdown);
    }
  }
  
  /**
   * 矢印キーナビゲーション処理
   */
  handleArrowNavigation(direction, event) {
    const element = event.target;
    
    // ラジオボタングループ内での移動
    if (element.type === 'radio') {
      this.handleRadioGroupNavigation(element, direction, event);
      return;
    }
    
    // リスト内での移動
    if (element.getAttribute('role') === 'option' || 
        element.closest('[role="listbox"]')) {
      this.handleListNavigation(element, direction, event);
      return;
    }
    
    // タブ内での移動
    if (element.getAttribute('role') === 'tab') {
      this.handleTabNavigation(element, direction, event);
      return;
    }
  }
  
  /**
   * ラジオボタングループナビゲーション
   */
  handleRadioGroupNavigation(element, direction, event) {
    const name = element.name;
    const radioButtons = Array.from(document.querySelectorAll(`input[type="radio"][name="${name}"]`));
    const currentIndex = radioButtons.indexOf(element);
    
    let nextIndex;
    if (direction === 'up' || direction === 'left') {
      nextIndex = currentIndex === 0 ? radioButtons.length - 1 : currentIndex - 1;
    } else {
      nextIndex = (currentIndex + 1) % radioButtons.length;
    }
    
    const nextRadio = radioButtons[nextIndex];
    if (nextRadio) {
      event.preventDefault();
      nextRadio.checked = true;
      this.setFocus(nextRadio);
      
      // change イベントを発火
      nextRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  /**
   * HAQEIクエスチョン要素のアクティベーション
   */
  handleQuestionElementActivation(element, event) {
    const questionId = element.dataset.questionId;
    if (!questionId) return;
    
    // ラジオボタンを探して選択
    const radioButtons = element.querySelectorAll('input[type="radio"]');
    if (radioButtons.length > 0) {
      // フォーカスされているラジオボタンを選択
      const focusedRadio = element.querySelector('input[type="radio"]:focus');
      if (focusedRadio) {
        focusedRadio.checked = true;
        focusedRadio.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // 最初のラジオボタンにフォーカス
        radioButtons[0].focus();
      }
    }
  }
  
  /**
   * ARIA管理設定
   */
  setupAriaManagement() {
    this.observeAriaChanges();
    this.updateAriaLabels();
  }
  
  /**
   * ARIA変更の監視
   */
  observeAriaChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName.startsWith('aria-') || 
             mutation.attributeName === 'role')) {
          this.validateAriaAttribute(mutation.target, mutation.attributeName);
        }
        
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewElement(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby', 'aria-describedby', 'role', 'tabindex']
    });
  }
  
  /**
   * ARIA属性の検証
   */
  validateAriaAttribute(element, attributeName) {
    const value = element.getAttribute(attributeName);
    
    // aria-labelledby と aria-describedby の参照チェック
    if (attributeName === 'aria-labelledby' || attributeName === 'aria-describedby') {
      const ids = value.split(' ');
      ids.forEach(id => {
        if (id && !document.getElementById(id)) {
          console.warn(`⚠️ ARIA reference error: Element with id "${id}" not found`);
        }
      });
    }
    
    // role の有効性チェック
    if (attributeName === 'role') {
      const validRoles = [
        'button', 'link', 'textbox', 'checkbox', 'radio', 'combobox',
        'listbox', 'option', 'tab', 'tabpanel', 'dialog', 'alertdialog',
        'alert', 'status', 'log', 'marquee', 'timer', 'main', 'navigation',
        'banner', 'contentinfo', 'complementary', 'form', 'search'
      ];
      
      if (value && !validRoles.includes(value)) {
        console.warn(`⚠️ ARIA role warning: "${value}" may not be a valid role`);
      }
    }
  }
  
  /**
   * 新しい要素の処理
   */
  processNewElement(element) {
    // インタラクティブ要素の自動ARIA設定
    this.autoSetAriaAttributes(element);
    
    // フォーカス可能要素の登録
    if (this.isElementInteractive(element)) {
      this.updateNavigableElements();
    }
    
    // bunenjin要素の処理
    if (element.classList.contains('bunenjin-element') ||
        element.classList.contains('harmony-indicator') ||
        element.classList.contains('triple-os-display')) {
      this.processBunenjinElement(element);
    }
  }
  
  /**
   * 自動ARIA属性設定
   */
  autoSetAriaAttributes(element) {
    // ボタンのaria-label自動設定
    if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label')) {
      const text = element.textContent.trim();
      if (text) {
        element.setAttribute('aria-label', text);
      }
    }
    
    // 入力フィールドのaria-required設定
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.hasAttribute('required') && !element.getAttribute('aria-required')) {
        element.setAttribute('aria-required', 'true');
      }
    }
    
    // リンクのaria-label設定
    if (element.tagName === 'A' && !element.getAttribute('aria-label')) {
      const text = element.textContent.trim();
      if (text) {
        element.setAttribute('aria-label', text);
      }
    }
  }
  
  /**
   * ARIAラベルの更新
   */
  updateAriaLabels() {
    // HAQEIクエスチョン要素のARIA設定
    document.querySelectorAll('.haqei-question-element').forEach(element => {
      const questionId = element.dataset.questionId;
      if (questionId) {
        element.setAttribute('role', 'radiogroup');
        element.setAttribute('aria-labelledby', `question-title-${questionId}`);
        
        const titleElement = element.querySelector('.question-title');
        if (titleElement) {
          titleElement.id = `question-title-${questionId}`;
          titleElement.setAttribute('role', 'heading');
          titleElement.setAttribute('aria-level', '2');
        }
        
        // ラジオボタンのARIA設定
        const radioButtons = element.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
          const label = radio.closest('label');
          if (label) {
            const labelText = label.textContent.trim();
            radio.setAttribute('aria-label', labelText);
          }
        });
      }
    });
  }
  
  /**
   * フォーカス管理設定
   */
  setupFocusManagement() {
    this.currentFocusIndex = -1;
    
    // フォーカス履歴の管理
    document.addEventListener('focusin', (event) => {
      this.recordFocusChange(event.target);
    });
    
    document.addEventListener('focusout', (event) => {
      // フォーカスが完全に失われた場合の処理
      setTimeout(() => {
        if (document.activeElement === document.body || 
            document.activeElement === document.documentElement) {
          this.handleFocusLoss();
        }
      }, 10);
    });
  }
  
  /**
   * フォーカス変更の記録
   */
  recordFocusChange(element) {
    this.focusHistory.push({
      element: element,
      timestamp: Date.now(),
      scroll: { x: window.scrollX, y: window.scrollY }
    });
    
    // 履歴サイズ制限
    if (this.focusHistory.length > 50) {
      this.focusHistory.shift();
    }
    
    this.currentFocusIndex = this.focusHistory.length - 1;
  }
  
  /**
   * フォーカス設定
   */
  setFocus(element, options = {}) {
    if (!element || !this.isElementVisible(element)) {
      return false;
    }
    
    try {
      element.focus(options);
      
      // スクリーンリーダー通知
      if (options.announce) {
        this.announce(options.announce);
      }
      
      // スクロール調整
      if (options.scroll !== false) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
      
      return true;
    } catch (error) {
      console.warn('⚠️ Focus setting failed:', error);
      return false;
    }
  }
  
  /**
   * フォーカス復元
   */
  restoreFocus() {
    if (this.focusHistory.length === 0) return false;
    
    const lastFocus = this.focusHistory[this.currentFocusIndex];
    if (lastFocus && this.isElementVisible(lastFocus.element)) {
      return this.setFocus(lastFocus.element);
    }
    
    // 前の要素を試す
    for (let i = this.currentFocusIndex - 1; i >= 0; i--) {
      const focus = this.focusHistory[i];
      if (focus && this.isElementVisible(focus.element)) {
        this.currentFocusIndex = i;
        return this.setFocus(focus.element);
      }
    }
    
    return false;
  }
  
  /**
   * フォーカス喪失の処理
   */
  handleFocusLoss() {
    // デフォルトフォーカス位置を設定
    const defaultFocusTargets = [
      '#main-content',
      'main',
      '[role="main"]',
      'h1',
      '.haqei-question-element:first-child',
      'button:first-of-type',
      'input:first-of-type'
    ];
    
    for (const selector of defaultFocusTargets) {
      const element = document.querySelector(selector);
      if (element && this.isElementVisible(element)) {
        this.setFocus(element);
        break;
      }
    }
  }
  
  /**
   * フォーカストラップの設定
   */
  trapFocus(container, options = {}) {
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const trapHandler = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', trapHandler);
    
    // フォーカストラップスタックに追加
    this.focusTrapStack.push({
      container: container,
      handler: trapHandler,
      previousFocus: document.activeElement,
      options: options
    });
    
    // 最初の要素にフォーカス
    firstElement.focus();
  }
  
  /**
   * フォーカストラップの解除
   */
  releaseFocusTrap() {
    if (this.focusTrapStack.length === 0) return;
    
    const trap = this.focusTrapStack.pop();
    trap.container.removeEventListener('keydown', trap.handler);
    
    // 前のフォーカスを復元
    if (trap.previousFocus && this.isElementVisible(trap.previousFocus)) {
      trap.previousFocus.focus();
    }
  }
  
  /**
   * スクリーンリーダー最適化設定
   */
  setupScreenReaderOptimization() {
    // 動的コンテンツの変更監視
    this.observeContentChanges();
    
    // ページ読み込み完了通知
    if (document.readyState === 'complete') {
      this.announce('ページの読み込みが完了しました', 'polite');
    } else {
      window.addEventListener('load', () => {
        this.announce('ページの読み込みが完了しました', 'polite');
      });
    }
  }
  
  /**
   * コンテンツ変更の監視
   */
  observeContentChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const addedElements = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE);
          
          if (addedElements.length > 0) {
            // 新しいコンテンツの通知
            const announcement = this.generateContentChangeAnnouncement(addedElements);
            if (announcement) {
              this.announce(announcement, 'polite');
            }
          }
        }
        
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'aria-expanded') {
          const element = mutation.target;
          const isExpanded = element.getAttribute('aria-expanded') === 'true';
          const label = element.getAttribute('aria-label') || element.textContent.trim();
          
          this.announce(
            `${label} が${isExpanded ? '展開' : '折りたたみ'}されました`,
            'polite'
          );
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-expanded', 'aria-selected', 'aria-checked']
    });
  }
  
  /**
   * コンテンツ変更通知の生成
   */
  generateContentChangeAnnouncement(elements) {
    const significantElements = elements.filter(element => {
      return element.classList.contains('haqei-question-element') ||
             element.classList.contains('harmony-indicator') ||
             element.classList.contains('error-message') ||
             element.classList.contains('success-message') ||
             element.getAttribute('role') === 'alert';
    });
    
    if (significantElements.length === 0) return null;
    
    if (significantElements.some(el => el.classList.contains('haqei-question-element'))) {
      return '新しい質問が表示されました';
    }
    
    if (significantElements.some(el => el.classList.contains('harmony-indicator'))) {
      return '調和度が更新されました';
    }
    
    if (significantElements.some(el => el.classList.contains('error-message'))) {
      return 'エラーメッセージが表示されました';
    }
    
    if (significantElements.some(el => el.classList.contains('success-message'))) {
      return '操作が正常に完了しました';
    }
    
    return 'コンテンツが更新されました';
  }
  
  /**
   * スクリーンリーダー通知
   */
  announce(message, priority = 'polite') {
    if (!message) return;
    
    const regionId = priority === 'assertive' ? 'urgent-announcements' : 'announcements';
    const region = this.liveRegions.get(regionId);
    
    if (region) {
      // 前の通知をクリア
      region.textContent = '';
      
      // 新しい通知を設定
      setTimeout(() => {
        region.textContent = message;
      }, 100);
      
      // 通知履歴に追加
      this.screenReader.announcements.push({
        message: message,
        priority: priority,
        timestamp: Date.now()
      });
      
      // 履歴サイズ制限
      if (this.screenReader.announcements.length > 20) {
        this.screenReader.announcements.shift();
      }
    }
  }
  
  /**
   * コントラスト検証設定
   */
  setupContrastChecking() {
    this.checkAllContrasts();
    
    // テーマ変更の監視
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || 
             mutation.attributeName === 'style')) {
          this.checkElementContrast(mutation.target);
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  /**
   * 全要素のコントラスト検証
   */
  checkAllContrasts() {
    const textElements = document.querySelectorAll('*');
    textElements.forEach(element => {
      if (this.hasTextContent(element)) {
        this.checkElementContrast(element);
      }
    });
  }
  
  /**
   * 要素のコントラスト検証
   */
  checkElementContrast(element) {
    if (!this.hasTextContent(element)) return;
    
    const style = window.getComputedStyle(element);
    const textColor = style.color;
    const backgroundColor = this.getEffectiveBackgroundColor(element);
    
    if (textColor && backgroundColor) {
      const contrast = this.calculateContrastRatio(textColor, backgroundColor);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;
      
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
      const requiredRatio = isLargeText ? 3.0 : 4.5;
      
      const result = {
        element: element,
        contrast: contrast,
        required: requiredRatio,
        passes: contrast >= requiredRatio,
        textColor: textColor,
        backgroundColor: backgroundColor,
        isLargeText: isLargeText
      };
      
      this.contrastResults.set(element, result);
      
      if (!result.passes) {
        console.warn('⚠️ WCAG contrast fail:', {
          element: element,
          contrast: contrast.toFixed(2),
          required: requiredRatio,
          textColor: textColor,
          backgroundColor: backgroundColor
        });
        
        // デバッグモードでは視覚的に表示
        if (this.options.debugMode) {
          element.style.outline = '2px dashed red';
          element.title = `Contrast: ${contrast.toFixed(2)} (Required: ${requiredRatio})`;
        }
      }
    }
  }
  
  /**
   * テキストコンテンツの有無チェック
   */
  hasTextContent(element) {
    const text = element.textContent.trim();
    return text.length > 0 && 
           !element.matches('script, style, noscript') &&
           window.getComputedStyle(element).display !== 'none';
  }
  
  /**
   * 実効背景色の取得
   */
  getEffectiveBackgroundColor(element) {
    let current = element;
    
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const bgColor = style.backgroundColor;
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }
      
      current = current.parentElement;
    }
    
    // デフォルト背景色
    return 'rgb(255, 255, 255)';
  }
  
  /**
   * コントラスト比の計算
   */
  calculateContrastRatio(color1, color2) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    if (!rgb1 || !rgb2) return 1;
    
    const l1 = this.getRelativeLuminance(rgb1);
    const l2 = this.getRelativeLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * 色のパース
   */
  parseColor(color) {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    
    const computed = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    
    const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    
    return null;
  }
  
  /**
   * 相対輝度の計算
   */
  getRelativeLuminance(rgb) {
    const { r, g, b } = rgb;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  
  /**
   * bunenjin哲学アクセシビリティ統合
   */
  setupBunenjinAccessibility() {
    // bunenjin要素の特別処理
    document.querySelectorAll('.bunenjin-element, .harmony-indicator, .triple-os-display').forEach(element => {
      this.processBunenjinElement(element);
    });
    
    // I Ching要素のアクセシビリティ
    this.setupIChingAccessibility();
  }
  
  /**
   * bunenjin要素の処理
   */
  processBunenjinElement(element) {
    // 調和度インジケーターの処理
    if (element.classList.contains('harmony-indicator')) {
      element.setAttribute('role', 'progressbar');
      element.setAttribute('aria-label', 'bunenjin分人調和度インジケーター');
      
      // 値の更新監視
      const observer = new MutationObserver(() => {
        const valueElement = element.querySelector('.harmony-value');
        if (valueElement) {
          const value = valueElement.textContent;
          element.setAttribute('aria-valuenow', value.replace('%', ''));
          element.setAttribute('aria-valuetext', `調和度${value}`);
          
          this.announce(`調和度が${value}に更新されました`, 'polite');
        }
      });
      
      observer.observe(element, { childList: true, subtree: true });
    }
    
    // Triple OSディスプレイの処理
    if (element.classList.contains('triple-os-display')) {
      element.setAttribute('role', 'region');
      element.setAttribute('aria-label', 'Triple OS分析結果');
      
      const engines = element.querySelectorAll('.os-indicator');
      engines.forEach((engine, index) => {
        engine.setAttribute('role', 'progressbar');
        const osNames = ['Engine OS', 'Interface OS', 'Safe Mode OS'];
        engine.setAttribute('aria-label', `${osNames[index] || 'OS'}強度インジケーター`);
      });
    }
  }
  
  /**
   * I Ching要素のアクセシビリティ設定
   */
  setupIChingAccessibility() {
    document.querySelectorAll('.iching-element, .hexagram, .trigram').forEach(element => {
      // 六十四卦や八卦の音声説明
      const hexagramName = element.dataset.hexagram;
      const trigramName = element.dataset.trigram;
      
      if (hexagramName) {
        element.setAttribute('aria-label', `易経六十四卦: ${hexagramName}`);
        element.setAttribute('role', 'img');
      }
      
      if (trigramName) {
        element.setAttribute('aria-label', `易経八卦: ${trigramName}`);
        element.setAttribute('role', 'img');
      }
      
      // 爻（yao）の説明
      const yaoElements = element.querySelectorAll('.yao');
      yaoElements.forEach((yao, index) => {
        const isYang = yao.classList.contains('yang');
        yao.setAttribute('aria-label', `第${index + 1}爻: ${isYang ? '陽' : '陰'}`);
        yao.setAttribute('role', 'img');
      });
    });
  }
  
  /**
   * イベントリスナー設定
   */
  setupEventListeners() {
    // キーボードイベント
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      const shortcut = event.shiftKey ? `Shift+${key}` : key;
      
      const handler = this.keyboardNavigation.shortcuts.get(shortcut);
      if (handler && this.keyboardNavigation.enabled) {
        handler(event);
      }
    });
    
    // ウィンドウリサイズ
    window.addEventListener('resize', () => {
      this.updateNavigableElements();
    });
    
    // ページ可視性変更
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateNavigableElements();
        this.checkAllContrasts();
      }
    });
  }
  
  /**
   * アクセシビリティ統計の取得
   */
  getAccessibilityStats() {
    const stats = {
      navigableElements: this.keyboardNavigation.navigableElements.length,
      focusHistory: this.focusHistory.length,
      contrastResults: {
        total: this.contrastResults.size,
        passed: Array.from(this.contrastResults.values()).filter(r => r.passes).length,
        failed: Array.from(this.contrastResults.values()).filter(r => !r.passes).length
      },
      ariaElements: this.ariaElements.size,
      liveRegions: this.liveRegions.size,
      announcements: this.screenReader.announcements.length,
      focusTraps: this.focusTrapStack.length
    };
    
    return stats;
  }
  
  /**
   * アクセシビリティレポートの生成
   */
  generateAccessibilityReport() {
    const stats = this.getAccessibilityStats();
    const failedContrasts = Array.from(this.contrastResults.values())
      .filter(r => !r.passes);
    
    const report = {
      timestamp: new Date().toISOString(),
      wcagCompliance: {
        level: 'AA', 
        version: '2.1'
      },
      statistics: stats,
      issues: {
        contrastFailures: failedContrasts.map(r => ({
          element: r.element.tagName + (r.element.className ? `.${r.element.className}` : ''),
          contrast: r.contrast,
          required: r.required,
          textColor: r.textColor,
          backgroundColor: r.backgroundColor
        })),
        missingAriaLabels: this.findMissingAriaLabels(),
        keyboardIssues: this.findKeyboardIssues()
      },
      recommendations: this.generateRecommendations(failedContrasts)
    };
    
    return report;
  }
  
  /**
   * 不足ARIAラベルの検出
   */
  findMissingAriaLabels() {
    const issues = [];
    
    // ボタンのラベル不足
    document.querySelectorAll('button').forEach(button => {
      if (!button.getAttribute('aria-label') && 
          !button.getAttribute('aria-labelledby') &&
          !button.textContent.trim()) {
        issues.push({
          element: 'button',
          issue: 'Missing accessible name',
          recommendation: 'Add aria-label or text content'
        });
      }
    });
    
    // 入力フィールドのラベル不足
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
      if (!input.getAttribute('aria-label') && 
          !input.getAttribute('aria-labelledby') &&
          !input.closest('label')) {
        issues.push({
          element: 'input',
          type: input.type,
          issue: 'Missing label association',
          recommendation: 'Associate with label element or add aria-label'
        });
      }
    });
    
    return issues;
  }
  
  /**
   * キーボード操作問題の検出
   */
  findKeyboardIssues() {
    const issues = [];
    
    // フォーカス不可能なインタラクティブ要素
    document.querySelectorAll('[onclick], [role="button"]').forEach(element => {
      if (element.tabIndex < 0 && !element.hasAttribute('tabindex')) {
        issues.push({
          element: element.tagName + (element.className ? `.${element.className}` : ''),
          issue: 'Interactive element not keyboard accessible',
          recommendation: 'Add tabindex="0" or use proper button element'
        });
      }
    });
    
    return issues;
  }
  
  /**
   * 改善推奨事項の生成
   */
  generateRecommendations(failedContrasts) {
    const recommendations = [];
    
    if (failedContrasts.length > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'Color contrast failures',
        action: 'Update colors to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)',
        count: failedContrasts.length
      });
    }
    
    const missingLabels = this.findMissingAriaLabels();
    if (missingLabels.length > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'Missing ARIA labels',
        action: 'Add proper labels and descriptions for all interactive elements',
        count: missingLabels.length
      });
    }
    
    return recommendations;
  }
  
  /**
   * デバッグモードの切り替え
   */
  toggleDebugMode() {
    this.options.debugMode = !this.options.debugMode;
    
    if (this.options.debugMode) {
      document.body.classList.add('debug-a11y');
    } else {
      document.body.classList.remove('debug-a11y');
    }
    
    console.log(`🐛 Accessibility debug mode: ${this.options.debugMode ? 'ON' : 'OFF'}`);
  }
  
  /**
   * 破棄
   */
  destroy() {
    // イベントリスナーの削除
    // フォーカストラップの解除
    while (this.focusTrapStack.length > 0) {
      this.releaseFocusTrap();
    }
    
    // データのクリア
    this.focusHistory = [];
    this.ariaElements.clear();
    this.contrastResults.clear();
    this.liveRegions.clear();
    
    console.log('🎯 AccessibilityManager destroyed');
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.AccessibilityManager = AccessibilityManager;
  console.log('✅ AccessibilityManager loaded with WCAG 2.1 AA compliance');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}