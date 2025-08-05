/**
 * Responsive Enhancement Manager - レスポンシブ対応強化システム
 * bunenjin哲学: あらゆるデバイスでの調和した体験
 */

class ResponsiveEnhancementManager {
  constructor() {
    this.breakpoints = {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1440,
      xxl: 2560
    };
    
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.deviceInfo = this.detectDeviceInfo();
    this.touchCapability = this.detectTouchCapability();
    this.preferredMotion = this.detectMotionPreference();
    
    this.observers = {
      resize: [],
      orientation: [],
      breakpoint: []
    };
    
    this.initializeResponsiveSystem();
  }

  /**
   * レスポンシブシステムの初期化
   */
  initializeResponsiveSystem() {
    this.setupViewportMeta();
    this.injectResponsiveStyles();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.applyDeviceSpecificOptimizations();
    this.setupAccessibilityEnhancements();
  }

  /**
   * ビューポートメタタグの設定
   */
  setupViewportMeta() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    // デバイス別の最適化されたビューポート設定
    const viewportContent = [
      'width=device-width',
      'initial-scale=1.0',
      'minimum-scale=1.0',
      'maximum-scale=5.0',
      'user-scalable=yes',
      'viewport-fit=cover'  // iPhone X以降のセーフエリア対応
    ].join(', ');
    
    viewport.content = viewportContent;
  }

  /**
   * レスポンシブスタイルの動的注入
   */
  injectResponsiveStyles() {
    if (document.getElementById('responsive-enhancement-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-enhancement-styles';
    style.textContent = `
      /* デバイス対応基盤 */
      :root {
        --vh: 1vh;
        --safe-area-inset-top: env(safe-area-inset-top, 0px);
        --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        --safe-area-inset-left: env(safe-area-inset-left, 0px);
        --safe-area-inset-right: env(safe-area-inset-right, 0px);
        --tap-size: max(44px, 2.75rem);
        --tap-spacing: max(8px, 0.5rem);
      }
      
      /* iOS Safari対応 */
      @supports (-webkit-touch-callout: none) {
        .full-height {
          height: calc(100vh - var(--safe-area-inset-top) - var(--safe-area-inset-bottom));
        }
      }
      
      /* Android Chrome対応 */
      @supports not (-webkit-touch-callout: none) {
        .full-height {
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
        }
      }
      
      /* タッチデバイス最適化 */
      @media (hover: none) and (pointer: coarse) {
        .touch-optimized {
          min-height: var(--tap-size);
          min-width: var(--tap-size);
          padding: var(--tap-spacing);
        }
        
        .scrollable-area {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* タッチフィードバック */
        .interactive:active {
          transform: scale(0.95);
          transition: transform 0.1s ease;
        }
      }
      
      /* 高DPIディスプレイ対応 */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .high-dpi-optimized {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      }
      
      /* 折りたたみデバイス対応 */
      @media (max-width: 280px) {
        .ultra-narrow {
          font-size: 0.75rem;
          padding: 0.25rem;
        }
      }
      
      /* 超大型ディスプレイ対応 */
      @media (min-width: 2560px) {
        .ultra-wide-container {
          max-width: 1800px;
          margin: 0 auto;
        }
      }
      
      /* プログレッシブエンハンスメント */
      .no-js .js-enhanced {
        display: none;
      }
      
      .js .no-js-fallback {
        display: none;
      }
      
      /* ローディング中のレイアウトシフト防止 */
      .layout-stable {
        contain: layout style paint;
      }
      
      /* フォーカス管理 */
      .focus-visible:focus-visible {
        outline: 3px solid var(--accent-500);
        outline-offset: 2px;
      }
      
      /* モーション設定を尊重 */
      @media (prefers-reduced-motion: reduce) {
        .respect-motion-preference {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* 印刷最適化 */
      @media print {
        .print-hidden {
          display: none !important;
        }
        
        .print-visible {
          display: block !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // リサイズイベント（デバウンス処理付き）
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 100);
    });
    
    // 画面回転イベント
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
    
    // フォーカス管理
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
    
    // 100vh問題対応（モバイル）
    this.setupVHFix();
  }

  /**
   * インターセクションオブザーバーの設定
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
          // パフォーマンス最適化のため、一度表示されたら監視終了
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '10px'
    });
    
    // 遅延読み込み対象要素の監視
    document.querySelectorAll('[data-lazy-load]').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * デバイス情報の検出
   */
  detectDeviceInfo() {
    const ua = navigator.userAgent;
    
    return {
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      isTablet: /iPad|Android.*(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=(?!.*\bMobile\b).*\bSafari\b)/i.test(ua),
      isIOS: /iPad|iPhone|iPod/.test(ua),
      isAndroid: /Android/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      isChrome: /Chrome/.test(ua),
      isFirefox: /Firefox/.test(ua),
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }

  /**
   * タッチ機能の検出
   */
  detectTouchCapability() {
    return {
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasHover: window.matchMedia('(hover: hover)').matches,
      hasPointerFine: window.matchMedia('(pointer: fine)').matches,
      hasPointerCoarse: window.matchMedia('(pointer: coarse)').matches
    };
  }

  /**
   * モーション設定の検出
   */
  detectMotionPreference() {
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      reducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches
    };
  }

  /**
   * 現在のブレークポイント取得
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width >= this.breakpoints.xxl) return 'xxl';
    if (width >= this.breakpoints.xl) return 'xl';
    if (width >= this.breakpoints.lg) return 'lg';
    if (width >= this.breakpoints.md) return 'md';
    if (width >= this.breakpoints.sm) return 'sm';
    return 'xs';
  }

  /**
   * リサイズハンドリング
   */
  handleResize() {
    const newBreakpoint = this.getCurrentBreakpoint();
    
    // ブレークポイント変更時の処理
    if (newBreakpoint !== this.currentBreakpoint) {
      const oldBreakpoint = this.currentBreakpoint;
      this.currentBreakpoint = newBreakpoint;
      
      this.notifyBreakpointChange(oldBreakpoint, newBreakpoint);
      this.applyBreakpointSpecificStyles(newBreakpoint);
    }
    
    // リサイズオブザーバーに通知
    this.observers.resize.forEach(callback => callback());
    
    // VH値の更新
    this.updateVHValue();
  }

  /**
   * 画面回転ハンドリング
   */
  handleOrientationChange() {
    const orientation = screen.orientation?.angle || window.orientation || 0;
    const isLandscape = Math.abs(orientation) === 90;
    
    document.body.classList.toggle('landscape', isLandscape);
    document.body.classList.toggle('portrait', !isLandscape);
    
    // VH値の更新（モバイルブラウザのアドレスバー問題対応）
    setTimeout(() => {
      this.updateVHValue();
    }, 500);
    
    this.observers.orientation.forEach(callback => callback(isLandscape, orientation));
  }

  /**
   * VH問題の修正
   */
  setupVHFix() {
    this.updateVHValue();
    
    // モバイルブラウザのアドレスバー表示/非表示による高さ変更に対応
    let ticking = false;
    const updateVH = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateVHValue();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateVH, 100);
    });
  }

  updateVHValue() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * デバイス固有の最適化適用
   */
  applyDeviceSpecificOptimizations() {
    const body = document.body;
    
    // デバイス情報をクラスとして追加
    if (this.deviceInfo.isMobile) body.classList.add('is-mobile');
    if (this.deviceInfo.isTablet) body.classList.add('is-tablet');
    if (this.deviceInfo.isIOS) body.classList.add('is-ios');
    if (this.deviceInfo.isAndroid) body.classList.add('is-android');
    
    // タッチ機能をクラスとして追加
    if (this.touchCapability.hasTouch) body.classList.add('has-touch');
    if (this.touchCapability.hasHover) body.classList.add('has-hover');
    
    // モーション設定をクラスとして追加
    if (this.preferredMotion.reducedMotion) body.classList.add('reduced-motion');
    if (this.preferredMotion.highContrast) body.classList.add('high-contrast');
    
    // iOS Safari特有の問題への対応
    if (this.deviceInfo.isIOS && this.deviceInfo.isSafari) {
      this.applyIOSSafariOptimizations();
    }
    
    // Android Chrome特有の問題への対応
    if (this.deviceInfo.isAndroid && this.deviceInfo.isChrome) {
      this.applyAndroidChromeOptimizations();
    }
  }

  /**
   * iOS Safari最適化
   */
  applyIOSSafariOptimizations() {
    // スクロールの慣性を有効化
    document.documentElement.style.webkitOverflowScrolling = 'touch';
    
    // セーフエリア対応
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !meta.content.includes('viewport-fit=cover')) {
      meta.content += ', viewport-fit=cover';
    }
    
    // iOS 15以降のスクロール問題対応
    if (parseFloat(navigator.userAgent.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.')) >= 15) {
      document.body.style.position = 'relative';
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Android Chrome最適化
   */
  applyAndroidChromeOptimizations() {
    // アドレスバーの高さ変更に対応
    const updateHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    
    window.addEventListener('resize', updateHeight);
    updateHeight();
    
    // 300msタップ遅延の除去
    document.addEventListener('touchstart', () => {}, { passive: true });
  }

  /**
   * アクセシビリティ強化の設定
   */
  setupAccessibilityEnhancements() {
    // ARIAライブリージョンの設定
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
    }
    
    // フォーカス管理の強化
    this.setupFocusManagement();
    
    // キーボードナビゲーションの強化
    this.setupKeyboardNavigation();
  }

  /**
   * フォーカス管理の設定
   */
  setupFocusManagement() {
    // フォーカス可能要素の特定
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    // モーダル内でのフォーカストラップ
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal:not([hidden])');
        if (modal) {
          this.trapFocus(e, modal, focusableSelector);
        }
      }
    });
  }

  /**
   * フォーカストラップの実装
   */
  trapFocus(event, container, focusableSelector) {
    const focusableElements = container.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * キーボードナビゲーションの設定
   */
  setupKeyboardNavigation() {
    // Escapeキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal:not([hidden])');
        if (modal) {
          const closeBtn = modal.querySelector('[data-dismiss="modal"]') || 
                          modal.querySelector('.modal-close');
          if (closeBtn) {
            closeBtn.click();
          }
        }
      }
    });
    
    // Enterキーでボタンを活性化
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('[role="button"]')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  /**
   * ブレークポイント変更の通知
   */
  notifyBreakpointChange(oldBreakpoint, newBreakpoint) {
    this.observers.breakpoint.forEach(callback => {
      callback(newBreakpoint, oldBreakpoint);
    });
    
    // カスタムイベントの発火
    window.dispatchEvent(new CustomEvent('breakpointChange', {
      detail: { old: oldBreakpoint, new: newBreakpoint }
    }));
  }

  /**
   * ブレークポイント固有スタイルの適用
   */
  applyBreakpointSpecificStyles(breakpoint) {
    // 既存のブレークポイントクラスを削除
    Object.keys(this.breakpoints).forEach(bp => {
      document.body.classList.remove(`bp-${bp}`);
    });
    
    // 新しいブレークポイントクラスを追加
    document.body.classList.add(`bp-${breakpoint}`);
  }

  /**
   * オブザーバーの登録
   */
  onResize(callback) {
    this.observers.resize.push(callback);
  }

  onOrientationChange(callback) {
    this.observers.orientation.push(callback);
  }

  onBreakpointChange(callback) {
    this.observers.breakpoint.push(callback);
  }

  /**
   * ARIAライブリージョンへのメッセージ送信
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * 現在のデバイス情報取得
   */
  getDeviceInfo() {
    return {
      breakpoint: this.currentBreakpoint,
      device: this.deviceInfo,
      touch: this.touchCapability,
      motion: this.preferredMotion,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      }
    };
  }
}

// グローバル利用のためのエクスポート
window.ResponsiveEnhancementManager = ResponsiveEnhancementManager;

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  if (!window.responsiveManager) {
    window.responsiveManager = new ResponsiveEnhancementManager();
  }
});