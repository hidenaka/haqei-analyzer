/**
 * Future Simulator UI Enhancement System
 * 
 * 統合されたUI強化システム - Future Simulatorの使いやすさと視覚的魅力を向上
 * 
 * 機能:
 * - レスポンシブデザイン強化
 * - アニメーション効果システム
 * - ユーザビリティ改善
 * - アクセシビリティ対応
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 1.0.0-stable
 */

class FutureSimulatorUIEnhancements {
  constructor() {
    this.version = "1.0.0-stable";
    this.initialized = false;
    this.animationDuration = 300;
    this.observers = new Map();
    
    console.log('🎨 Future Simulator UI Enhancement System initializing...');
  }

  /**
   * システム初期化
   */
  async initialize() {
    if (this.initialized) {
      console.log('✅ UI Enhancement System already initialized');
      return;
    }

    try {
      // 基本UIエンハンスメント
      await this.initializeBasicEnhancements();
      
      // アニメーションシステム
      this.initializeAnimationSystem();
      
      // レスポンシブ強化
      this.initializeResponsiveEnhancements();
      
      // アクセシビリティ強化
      this.initializeAccessibilityEnhancements();
      
      // ユーザビリティ改善
      this.initializeUsabilityImprovements();
      
      this.initialized = true;
      console.log('✅ Future Simulator UI Enhancement System ready');
      
    } catch (error) {
      console.error('❌ UI Enhancement System initialization failed:', error);
      throw error;
    }
  }

  /**
   * 基本UIエンハンスメント
   */
  async initializeBasicEnhancements() {
    // カードホバー効果の強化
    this.enhanceCardInteractions();
    
    // ボタンアニメーション改善
    this.enhanceButtonAnimations();
    
    // フォーム要素の改善
    this.enhanceFormElements();
    
    console.log('✅ Basic UI enhancements applied');
  }

  /**
   * カードインタラクション強化
   */
  enhanceCardInteractions() {
    const cards = document.querySelectorAll('.card, .scenario-card, .choice-card');
    
    cards.forEach(card => {
      // ホバー効果の改善
      card.addEventListener('mouseenter', (e) => {
        this.animateCardHover(e.target, true);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.animateCardHover(e.target, false);
      });
      
      // クリック効果
      card.addEventListener('click', (e) => {
        this.animateCardClick(e.target);
      });
    });
  }

  /**
   * カードホバーアニメーション
   */
  animateCardHover(card, isHover) {
    const transform = isHover ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)';
    const boxShadow = isHover 
      ? '0 8px 32px rgba(99, 102, 241, 0.3)' 
      : '0 4px 16px rgba(0, 0, 0, 0.1)';
    
    card.style.transition = `transform ${this.animationDuration}ms ease, box-shadow ${this.animationDuration}ms ease`;
    card.style.transform = transform;
    card.style.boxShadow = boxShadow;
  }

  /**
   * カードクリックアニメーション
   */
  animateCardClick(card) {
    // 短いスケールダウン効果
    card.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      card.style.transform = 'scale(1.02) translateY(-2px)';
    }, 100);
  }

  /**
   * ボタンアニメーション強化
   */
  enhanceButtonAnimations() {
    const buttons = document.querySelectorAll('button, .export-button');
    
    buttons.forEach(button => {
      // リップル効果の追加
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e);
      });
      
      // ホバー効果の改善
      button.addEventListener('mouseenter', (e) => {
        this.animateButtonHover(e.target, true);
      });
      
      button.addEventListener('mouseleave', (e) => {
        this.animateButtonHover(e.target, false);
      });
    });
  }

  /**
   * リップル効果の作成
   */
  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 600ms linear';
    ripple.style.pointerEvents = 'none';
    
    // アニメーションキーフレームを動的追加
    this.addRippleKeyframes();
    
    // ボタンの相対位置設定
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    
    button.appendChild(ripple);
    
    // アニメーション終了後に削除
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * リップルアニメーションキーフレーム追加
   */
  addRippleKeyframes() {
    if (document.getElementById('ripple-keyframes')) return;
    
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * ボタンホバーアニメーション
   */
  animateButtonHover(button, isHover) {
    const transform = isHover ? 'translateY(-1px)' : 'translateY(0)';
    const boxShadow = isHover 
      ? '0 6px 20px rgba(99, 102, 241, 0.4)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)';
    
    button.style.transition = `transform ${this.animationDuration}ms ease, box-shadow ${this.animationDuration}ms ease`;
    button.style.transform = transform;
    button.style.boxShadow = boxShadow;
  }

  /**
   * フォーム要素の改善
   */
  enhanceFormElements() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // フォーカス効果の改善
      input.addEventListener('focus', (e) => {
        this.animateInputFocus(e.target, true);
      });
      
      input.addEventListener('blur', (e) => {
        this.animateInputFocus(e.target, false);
      });
    });
  }

  /**
   * 入力フィールドフォーカスアニメーション
   */
  animateInputFocus(input, isFocus) {
    const borderColor = isFocus ? '#6366f1' : '#374151';
    const boxShadow = isFocus 
      ? '0 0 0 3px rgba(99, 102, 241, 0.1)' 
      : 'none';
    
    input.style.transition = `border-color ${this.animationDuration}ms ease, box-shadow ${this.animationDuration}ms ease`;
    input.style.borderColor = borderColor;
    input.style.boxShadow = boxShadow;
  }

  /**
   * アニメーションシステム初期化
   */
  initializeAnimationSystem() {
    // Intersection Observer for scroll animations
    this.setupScrollAnimations();
    
    // Staggered animations for lists
    this.setupStaggeredAnimations();
    
    console.log('✅ Animation system initialized');
  }

  /**
   * スクロールアニメーション設定
   */
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.progressive-load, .card, .scenario-card');
    animateElements.forEach(el => {
      observer.observe(el);
    });

    this.observers.set('scroll', observer);
  }

  /**
   * 段階的アニメーション設定
   */
  setupStaggeredAnimations() {
    const lists = document.querySelectorAll('.grid, .scenario-grid');
    
    lists.forEach(list => {
      const items = list.children;
      Array.from(items).forEach((item, index) => {
        item.style.animationDelay = `${index * 100}ms`;
        item.classList.add('stagger-animation');
      });
    });
  }

  /**
   * レスポンシブ強化初期化
   */
  initializeResponsiveEnhancements() {
    // ビューポート変更の監視
    this.setupViewportHandling();
    
    // タッチデバイスの最適化
    this.setupTouchOptimizations();
    
    console.log('✅ Responsive enhancements initialized');
  }

  /**
   * ビューポート処理設定
   */
  setupViewportHandling() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleViewportChange();
      }, 150);
    });
    
    // 初期設定
    this.handleViewportChange();
  }

  /**
   * ビューポート変更処理
   */
  handleViewportChange() {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    
    document.body.classList.toggle('mobile-layout', isMobile);
    document.body.classList.toggle('tablet-layout', isTablet);
    
    // モバイルレイアウトの調整
    if (isMobile) {
      this.applyMobileOptimizations();
    }
  }

  /**
   * モバイル最適化適用
   */
  applyMobileOptimizations() {
    // カードのマージン調整
    const cards = document.querySelectorAll('.card, .scenario-card, .choice-card');
    cards.forEach(card => {
      card.style.margin = '0.5rem 0';
    });
    
    // ボタンサイズの調整
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.minHeight = '44px'; // タッチに適したサイズ
    });
  }

  /**
   * タッチ最適化設定
   */
  setupTouchOptimizations() {
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
      
      // タッチ開始・終了イベントの処理
      document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }
  }

  /**
   * タッチ開始処理
   */
  handleTouchStart(event) {
    const target = event.target.closest('.card, button');
    if (target) {
      target.classList.add('touch-active');
    }
  }

  /**
   * タッチ終了処理
   */
  handleTouchEnd(event) {
    setTimeout(() => {
      const activeElements = document.querySelectorAll('.touch-active');
      activeElements.forEach(el => {
        el.classList.remove('touch-active');
      });
    }, 150);
  }

  /**
   * アクセシビリティ強化初期化
   */
  initializeAccessibilityEnhancements() {
    // フォーカス管理
    this.setupFocusManagement();
    
    // ARIA属性の動的更新
    this.setupARIAEnhancements();
    
    // キーボードナビゲーション
    this.setupKeyboardNavigation();
    
    console.log('✅ Accessibility enhancements initialized');
  }

  /**
   * フォーカス管理設定
   */
  setupFocusManagement() {
    // フォーカス可能要素のスタイル改善
    const focusableElements = document.querySelectorAll('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', (e) => {
        e.target.classList.add('focus-visible');
      });
      
      element.addEventListener('blur', (e) => {
        e.target.classList.remove('focus-visible');
      });
    });
  }

  /**
   * ARIA属性強化設定
   */
  setupARIAEnhancements() {
    // 動的コンテンツのaria-live設定
    const resultArea = document.getElementById('resultArea');
    if (resultArea) {
      resultArea.setAttribute('aria-live', 'polite');
      resultArea.setAttribute('aria-relevant', 'additions text');
    }
    
    // カードの役割設定
    const cards = document.querySelectorAll('.card, .scenario-card, .choice-card');
    cards.forEach((card, index) => {
      if (!card.getAttribute('role')) {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-describedby', `card-description-${index}`);
      }
    });
  }

  /**
   * キーボードナビゲーション設定
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Escキーでモーダルを閉じる
      if (event.key === 'Escape') {
        this.closeModals();
      }
      
      // Enterキーでカードを選択
      if (event.key === 'Enter' && event.target.classList.contains('card')) {
        event.target.click();
      }
    });
  }

  /**
   * モーダル閉じる処理
   */
  closeModals() {
    const modals = document.querySelectorAll('.modal, .overlay');
    modals.forEach(modal => {
      if (modal.style.display !== 'none') {
        modal.style.display = 'none';
      }
    });
  }

  /**
   * ユーザビリティ改善初期化
   */
  initializeUsabilityImprovements() {
    // ローディング状態の改善
    this.setupLoadingStateImprovements();
    
    // エラー状態の改善
    this.setupErrorStateImprovements();
    
    // プログレス表示の改善
    this.setupProgressIndicators();
    
    console.log('✅ Usability improvements initialized');
  }

  /**
   * ローディング状態改善設定
   */
  setupLoadingStateImprovements() {
    // 分析ボタンのローディング状態
    const analyzeButton = document.getElementById('aiGuessBtn');
    if (analyzeButton) {
      const originalClick = analyzeButton.onclick;
      analyzeButton.onclick = (event) => {
        this.setButtonLoadingState(analyzeButton, true);
        
        if (originalClick) {
          originalClick.call(analyzeButton, event);
        }
        
        // 3秒後にローディング状態を解除（フォールバック）
        setTimeout(() => {
          this.setButtonLoadingState(analyzeButton, false);
        }, 3000);
      };
    }
  }

  /**
   * ボタンローディング状態設定
   */
  setButtonLoadingState(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.classList.add('loading');
      const originalText = button.textContent;
      button.dataset.originalText = originalText;
      button.innerHTML = `
        <span class="loading-spinner"></span>
        分析中...
      `;
    } else {
      button.disabled = false;
      button.classList.remove('loading');
      button.textContent = button.dataset.originalText || '未来を分析';
    }
  }

  /**
   * エラー状態改善設定
   */
  setupErrorStateImprovements() {
    // グローバルエラーハンドラーの改善
    window.addEventListener('error', (event) => {
      this.showUserFriendlyError(event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.showUserFriendlyError(event.reason);
    });
  }

  /**
   * ユーザーフレンドリーなエラー表示
   */
  showUserFriendlyError(error) {
    console.error('UI Enhancement System caught error:', error);
    
    // 既存のエラー表示を確認
    let errorContainer = document.getElementById('ui-error-container');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'ui-error-container';
      errorContainer.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
      errorContainer.style.display = 'none';
      document.body.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">エラーが発生しました</p>
          <p class="text-sm opacity-90">しばらく経ってから再試行してください</p>
        </div>
        <button class="ml-auto flex-shrink-0 rounded-md p-1.5 hover:bg-red-600 focus:outline-none" onclick="this.parentElement.parentElement.style.display='none'">
          <span class="sr-only">閉じる</span>
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;
    
    errorContainer.style.display = 'block';
    
    // 5秒後に自動的に閉じる
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 5000);
  }

  /**
   * プログレス表示改善設定
   */
  setupProgressIndicators() {
    // 既存のプログレスバーを強化
    const progressBars = document.querySelectorAll('.progress-bar, .progress-fill');
    progressBars.forEach(bar => {
      bar.style.transition = 'width 0.3s ease-in-out';
    });
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    // Observerの削除
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    
    console.log('✅ UI Enhancement System cleanup completed');
  }
}

// CSS拡張スタイルの追加
const uiEnhancementStyles = `
  /* UI Enhancement System Styles */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .stagger-animation {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .focus-visible {
    outline: 2px solid #6366f1 !important;
    outline-offset: 2px;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
  
  .touch-active {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  .mobile-layout .card,
  .mobile-layout .scenario-card,
  .mobile-layout .choice-card {
    margin: 0.5rem 0 !important;
  }
  
  .tablet-layout {
    font-size: 16px;
  }
  
  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up,
    .stagger-animation,
    .loading-spinner {
      animation: none !important;
      transition: none !important;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .card,
    .scenario-card,
    .choice-card {
      border-width: 2px !important;
    }
  }
`;

// スタイルをDOMに追加
function addUIEnhancementStyles() {
  if (document.getElementById('ui-enhancement-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'ui-enhancement-styles';
  style.textContent = uiEnhancementStyles;
  document.head.appendChild(style);
}

// 自動初期化
document.addEventListener('DOMContentLoaded', async () => {
  try {
    addUIEnhancementStyles();
    
    const uiEnhancements = new FutureSimulatorUIEnhancements();
    await uiEnhancements.initialize();
    
    // グローバルに公開
    window.FutureSimulatorUIEnhancements = uiEnhancements;
    
  } catch (error) {
    console.error('❌ Failed to initialize UI Enhancement System:', error);
  }
});

// Node.js環境での対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FutureSimulatorUIEnhancements;
}