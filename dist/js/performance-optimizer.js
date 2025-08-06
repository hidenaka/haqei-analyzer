/**
 * Performance Optimizer for Future Simulator
 * 
 * 初回読み込み最適化とパフォーマンス改善
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 1.0.0-stable
 */

class PerformanceOptimizer {
  constructor() {
    this.version = "1.0.0-stable";
    this.initialized = false;
    this.loadedResources = new Set();
    this.deferredResources = [];
    
    console.log('⚡ Performance Optimizer initializing...');
  }

  /**
   * システム初期化
   */
  async initialize() {
    if (this.initialized) {
      console.log('✅ Performance Optimizer already initialized');
      return;
    }

    try {
      // Critical CSS インライン化
      this.inlineCriticalCSS();
      
      // リソース遅延読み込み設定
      this.setupDeferredLoading();
      
      // パフォーマンス監視
      this.setupPerformanceMonitoring();
      
      // メモリ最適化
      this.setupMemoryOptimization();
      
      this.initialized = true;
      console.log('✅ Performance Optimizer ready');
      
    } catch (error) {
      console.error('❌ Performance Optimizer initialization failed:', error);
      throw error;
    }
  }

  /**
   * Critical CSS インライン化
   */
  inlineCriticalCSS() {
    const criticalStyles = `
      /* Critical CSS - Inline for fastest loading */
      body{background:linear-gradient(135deg,#1e293b 0%,#334155 100%);font-family:'Noto Sans JP',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;margin:0;padding:0;min-height:100vh}
      .container{max-width:1200px;margin:0 auto;padding:1rem}
      .card{background:rgba(15,23,42,0.8);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:1.5rem;backdrop-filter:blur(10px);transition:all 0.3s ease}
      .card:hover{border-color:rgba(99,102,241,0.4);box-shadow:0 8px 25px rgba(99,102,241,0.1)}
      .btn{background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;border-radius:8px;padding:0.75rem 1.5rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;display:inline-flex;align-items:center;justify-content:center}
      .btn:hover{background:linear-gradient(135deg,#5b5aec,#4338ca);transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,0.3)}
      #worryInput{background:#374151;border:2px solid #4b5563;color:white;border-radius:8px;padding:1rem;width:100%;font-size:1rem;line-height:1.6;transition:border-color 0.3s ease,box-shadow 0.3s ease,background-color 0.3s ease;resize:none;font-family:inherit}
      #worryInput:focus{background-color:rgba(55,65,81,0.8);border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.1),0 4px 12px rgba(0,0,0,0.1);outline:none}
      #worryInput::placeholder{color:rgba(156,163,175,0.7);font-style:italic}
      .brand-text{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700}
      .loading-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1000}
      .loading-spinner{width:2rem;height:2rem;border:3px solid rgba(255,255,255,0.3);border-radius:50%;border-top-color:white;animation:spin 1s linear infinite}
      @keyframes spin{to{transform:rotate(360deg)}}
      .progressive-load{opacity:0;animation:fadeInUp 0.6s ease-out forwards}
      @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      .hidden{display:none!important}
      .text-center{text-align:center}
      .mb-4{margin-bottom:1rem}
      .mb-6{margin-bottom:1.5rem}
      .text-lg{font-size:1.125rem}
      .text-xl{font-size:1.25rem}
      .font-bold{font-weight:700}
      .text-indigo-300{color:#a5b4fc}
      .text-gray-400{color:#9ca3af}
      @media(max-width:768px){.container{padding:0.5rem}.card{padding:1rem}#worryInput{font-size:16px}}
    `;
    
    // インラインスタイルとして追加（最高優先度）
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalStyles;
    document.head.insertBefore(style, document.head.firstChild);
    
    console.log('✅ Critical CSS inlined');
  }

  /**
   * 遅延読み込み設定
   */
  setupDeferredLoading() {
    // 非Critical CSSの遅延読み込み
    this.deferredResources.push({
      type: 'css',
      href: './css/interactive.css',
      priority: 'low'
    });

    this.deferredResources.push({
      type: 'css',
      href: './css/themes.css',
      priority: 'low'
    });

    // 非Critical JSの遅延読み込み
    this.deferredResources.push({
      type: 'js',
      src: './js/app.js',
      priority: 'medium'
    });

    // ページ読み込み完了後に遅延リソースを読み込み
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.loadDeferredResources(), 500);
      });
    } else {
      setTimeout(() => this.loadDeferredResources(), 500);
    }
  }

  /**
   * 遅延リソースの読み込み
   */
  loadDeferredResources() {
    // 優先度順にソート
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    this.deferredResources.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    this.deferredResources.forEach((resource, index) => {
      setTimeout(() => {
        this.loadResource(resource);
      }, index * 100); // 100ms間隔で読み込み
    });
  }

  /**
   * 個別リソース読み込み
   */
  loadResource(resource) {
    if (this.loadedResources.has(resource.href || resource.src)) {
      return; // 既に読み込み済み
    }

    if (resource.type === 'css') {
      this.loadCSS(resource.href);
    } else if (resource.type === 'js') {
      this.loadJS(resource.src);
    }

    this.loadedResources.add(resource.href || resource.src);
  }

  /**
   * CSS遅延読み込み
   */
  loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // 最初は print メディアで読み込み
    link.onload = function() {
      this.media = 'all'; // 読み込み完了後に all に変更
    };
    
    // noscript フォールバック
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<link rel="stylesheet" href="${href}">`;
    
    document.head.appendChild(link);
    document.head.appendChild(noscript);
    
    console.log(`✅ CSS loaded (deferred): ${href}`);
  }

  /**
   * JavaScript遅延読み込み
   */
  loadJS(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log(`✅ JS loaded (deferred): ${src}`);
    };
    
    script.onerror = () => {
      console.error(`❌ Failed to load JS: ${src}`);
    };
    
    document.body.appendChild(script);
  }

  /**
   * パフォーマンス監視設定
   */
  setupPerformanceMonitoring() {
    // Web Vitals の監視
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint) 監視
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }

      // FID (First Input Delay) 監視
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('📊 FID:', entry.processingStart - entry.startTime);
        });
      });
      
      try {
        fidObserver.observe({entryTypes: ['first-input']});
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
    }

    // ページ読み込み時間の測定
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('📊 Page Load Time:', loadTime, 'ms');
    });
  }

  /**
   * メモリ最適化設定
   */
  setupMemoryOptimization() {
    // 不要なイベントリスナーのクリーンアップ
    this.setupEventListenerCleanup();
    
    // 画像の遅延読み込み
    this.setupLazyImageLoading();
    
    // メモリリークの監視
    this.setupMemoryLeakDetection();
  }

  /**
   * イベントリスナークリーンアップ
   */
  setupEventListenerCleanup() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    const listeners = new Map();

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!listeners.has(this)) {
        listeners.set(this, []);
      }
      listeners.get(this).push({ type, listener, options });
      return originalAddEventListener.call(this, type, listener, options);
    };

    // ページアンロード時にクリーンアップ
    window.addEventListener('beforeunload', () => {
      listeners.forEach((elementListeners, element) => {
        elementListeners.forEach(({ type, listener, options }) => {
          element.removeEventListener(type, listener, options);
        });
      });
      listeners.clear();
    });
  }

  /**
   * 画像遅延読み込み
   */
  setupLazyImageLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * メモリリーク検出
   */
  setupMemoryLeakDetection() {
    if ('performance' in window && 'memory' in performance) {
      let lastMemoryUsage = performance.memory.usedJSHeapSize;
      
      setInterval(() => {
        const currentMemoryUsage = performance.memory.usedJSHeapSize;
        const memoryIncrease = currentMemoryUsage - lastMemoryUsage;
        
        if (memoryIncrease > 10 * 1024 * 1024) { // 10MB増加
          console.warn('⚠️ Potential memory leak detected:', memoryIncrease / 1024 / 1024, 'MB');
        }
        
        lastMemoryUsage = currentMemoryUsage;
      }, 30000); // 30秒ごとにチェック
    }
  }

  /**
   * パフォーマンス最適化の適用
   */
  applyOptimizations() {
    // DOM操作の最適化
    this.optimizeDOMOperations();
    
    // CSSアニメーションの最適化
    this.optimizeAnimations();
    
    // スクロールイベントの最適化
    this.optimizeScrollEvents();
  }

  /**
   * DOM操作最適化
   */
  optimizeDOMOperations() {
    // DocumentFragment使用の推奨
    window.createOptimizedFragment = function() {
      return document.createDocumentFragment();
    };

    // バッチDOM更新
    window.batchDOMUpdate = function(callback) {
      requestAnimationFrame(() => {
        callback();
      });
    };
  }

  /**
   * アニメーション最適化
   */
  optimizeAnimations() {
    // will-change プロパティの動的設定
    const animatedElements = document.querySelectorAll('.card, .btn, .dialogue-line');
    
    animatedElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.willChange = 'transform, box-shadow';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.willChange = 'auto';
      });
    });
  }

  /**
   * スクロールイベント最適化
   */
  optimizeScrollEvents() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      
      scrollTimeout = requestAnimationFrame(() => {
        // スクロール処理をここに記述
        this.handleOptimizedScroll();
      });
    }, { passive: true });
  }

  /**
   * 最適化されたスクロール処理
   */
  handleOptimizedScroll() {
    // スクロール位置に基づく処理
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // ビューポートに入った要素のアニメーション
    const elements = document.querySelectorAll('.progressive-load:not(.loaded)');
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        element.classList.add('loaded');
      }
    });
  }

  /**
   * パフォーマンス統計の取得
   */
  getPerformanceStats() {
    if (!('performance' in window)) {
      return null;
    }

    const timing = performance.timing;
    const navigation = performance.navigation;
    
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint'),
      memoryUsage: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      navigationTiming: {
        redirects: timing.redirectEnd - timing.redirectStart,
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        connect: timing.connectEnd - timing.connectStart,
        response: timing.responseEnd - timing.responseStart,
        dom: timing.domComplete - timing.domLoading
      }
    };
  }
}

// 自動初期化（最高優先度）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const optimizer = new PerformanceOptimizer();
      await optimizer.initialize();
      optimizer.applyOptimizations();
      
      // グローバルに公開
      window.PerformanceOptimizer = optimizer;
      
      // 3秒後にパフォーマンス統計を出力
      setTimeout(() => {
        const stats = optimizer.getPerformanceStats();
        if (stats) {
          console.log('📊 Performance Stats:', stats);
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ Failed to initialize Performance Optimizer:', error);
    }
  });
} else {
  // DOMContentLoaded後の場合は即座に実行
  const optimizer = new PerformanceOptimizer();
  optimizer.initialize();
  optimizer.applyOptimizations();
  window.PerformanceOptimizer = optimizer;
}

// Node.js環境での対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}