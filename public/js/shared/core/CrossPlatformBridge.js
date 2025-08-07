// CrossPlatformBridge.js - クロスプラットフォーム橋渡しシステム
// HAQEI HaQei哲学：プラットフォーム間の調和的連携

/**
 * クロスプラットフォーム橋渡しクラス
 */
class CrossPlatformBridge {
  constructor() {
    this.platform = this.detectPlatform();
    this.features = this.detectFeatures();
    this.initialized = false;
    this.init();
  }

  /**
   * プラットフォーム検出
   * @returns {string} プラットフォーム名
   */
  detectPlatform() {
    if (typeof window === 'undefined') return 'server';
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile';
    if (userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  }

  /**
   * 機能検出
   * @returns {Object} 利用可能機能
   */
  detectFeatures() {
    if (typeof window === 'undefined') return {};

    return {
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window,
      indexedDB: 'indexedDB' in window,
      webWorker: 'Worker' in window,
      serviceWorker: 'serviceWorker' in navigator,
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      webSocket: 'WebSocket' in window
    };
  }

  /**
   * 初期化
   */
  init() {
    try {
      console.log('🔍 CrossPlatformBridge initializing...', {
        platform: this.platform,
        features: this.features
      });

      // プラットフォーム固有の初期化
      this.setupPlatformSpecific();
      
      this.initialized = true;
      console.log('🔍 CrossPlatformBridge initialized successfully');
    } catch (error) {
      console.error('🔍 CrossPlatformBridge initialization error:', error);
    }
  }

  /**
   * プラットフォーム固有セットアップ
   */
  setupPlatformSpecific() {
    switch (this.platform) {
      case 'mobile':
        this.setupMobile();
        break;
      case 'tablet':
        this.setupTablet();
        break;
      case 'desktop':
        this.setupDesktop();
        break;
      default:
        console.log('🔍 Unknown platform, using default setup');
    }
  }

  /**
   * モバイル用セットアップ
   */
  setupMobile() {
    console.log('🔍 Setting up for mobile platform');
    // モバイル固有の設定
  }

  /**
   * タブレット用セットアップ
   */
  setupTablet() {
    console.log('🔍 Setting up for tablet platform');
    // タブレット固有の設定
  }

  /**
   * デスクトップ用セットアップ
   */
  setupDesktop() {
    console.log('🔍 Setting up for desktop platform');
    // デスクトップ固有の設定
  }

  /**
   * 機能利用可能性チェック
   * @param {string} feature - 機能名
   * @returns {boolean} 利用可能かどうか
   */
  isFeatureAvailable(feature) {
    return this.features[feature] || false;
  }

  /**
   * プラットフォーム情報取得
   * @returns {Object} プラットフォーム情報
   */
  getPlatformInfo() {
    return {
      platform: this.platform,
      features: this.features,
      initialized: this.initialized,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.CrossPlatformBridge = CrossPlatformBridge;
}

export { CrossPlatformBridge };