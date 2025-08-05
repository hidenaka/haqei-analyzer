/**
 * Performance Optimizer for os_analyzer
 * パフォーマンス最適化とキャッシュ管理
 */

class PerformanceOptimizer {
  constructor() {
    this.performanceMetrics = {
      startTime: performance.now(),
      loadEvents: [],
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.cacheManager = new Map();
    this.init();
  }

  init() {
    this.setupPerformanceMonitoring();
    this.optimizeImageLoading();
    this.setupIntelligentCaching();
    this.preventMemoryLeaks();
  }

  /**
   * パフォーマンス監視設定
   */
  setupPerformanceMonitoring() {
    // Core Web Vitals測定
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.performanceMetrics.lcp = lastEntry.startTime;
          console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            console.log(`📊 FID: ${this.performanceMetrics.fid.toFixed(2)}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let clsValue = 0;
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.performanceMetrics.cls = clsValue;
          console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('⚠️ PerformanceObserver not fully supported:', error);
      }
    }

    // ページロード完了時の総合評価
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.generatePerformanceReport();
      }, 1000);
    });
  }

  /**
   * 画像読み込み最適化
   */
  optimizeImageLoading() {
    // Intersection Observer による遅延読み込み
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // data-src 属性を持つ画像を監視
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * インテリジェントキャッシング
   */
  setupIntelligentCaching() {
    // 質問データのキャッシュ
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;
      const cacheKey = `${url}_${JSON.stringify(options || {})}`;
      
      // キャッシュヒットチェック
      if (this.cacheManager.has(cacheKey)) {
        this.performanceMetrics.cacheHits++;
        const cachedData = this.cacheManager.get(cacheKey);
        console.log(`💾 Cache Hit: ${url}`);
        return Promise.resolve(new Response(JSON.stringify(cachedData.data), {
          status: cachedData.status,
          headers: cachedData.headers
        }));
      }

      // キャッシュミス
      this.performanceMetrics.cacheMisses++;
      
      try {
        const response = await originalFetch(...args);
        
        // 成功レスポンスのみキャッシュ
        if (response.ok && response.headers.get('content-type')?.includes('json')) {
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          
          this.cacheManager.set(cacheKey, {
            data: data,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            timestamp: Date.now()
          });
          
          console.log(`💾 Cached: ${url}`);
        }
        
        return response;
      } catch (error) {
        console.error(`❌ Fetch Error: ${url}`, error);
        throw error;
      }
    };
  }

  /**
   * メモリリーク防止
   */
  preventMemoryLeaks() {
    // イベントリスナーの適切な削除
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const eventListeners = new WeakMap();
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!eventListeners.has(this)) {
        eventListeners.set(this, new Map());
      }
      
      const listeners = eventListeners.get(this);
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      
      listeners.get(type).add(listener);
      return originalAddEventListener.call(this, type, listener, options);
    };

    // ページ離脱時のクリーンアップ
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // 定期的なメモリ最適化
    setInterval(() => {
      this.optimizeMemoryUsage();
    }, 30000); // 30秒ごと
  }

  /**
   * メモリ使用量最適化
   */
  optimizeMemoryUsage() {
    // 古いキャッシュエントリの削除
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5分

    for (const [key, value] of this.cacheManager.entries()) {
      if (now - value.timestamp > maxAge) {
        this.cacheManager.delete(key);
      }
    }

    // ガベージコレクション促進（可能な場合）
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }

  /**
   * パフォーマンスレポート生成
   */
  generatePerformanceReport() {
    const loadTime = performance.now() - this.performanceMetrics.startTime;
    const navigation = performance.getEntriesByType('navigation')[0];
    
    const report = {
      timestamp: new Date().toISOString(),
      loadTime: Math.round(loadTime),
      lcp: Math.round(this.performanceMetrics.lcp || 0),
      fid: Math.round(this.performanceMetrics.fid || 0),
      cls: parseFloat((this.performanceMetrics.cls || 0).toFixed(4)),
      cacheHitRate: this.performanceMetrics.cacheHits / (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) * 100,
      navigation: navigation ? {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        domComplete: Math.round(navigation.domComplete - navigation.domLoading),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart)
      } : null
    };

    console.log('📊 OS Analyzer Performance Report:', report);
    
    // パフォーマンス評価
    this.evaluatePerformance(report);
    
    // レポートをローカルストレージに保存
    try {
      const reports = JSON.parse(localStorage.getItem('haqei_performance_reports') || '[]');
      reports.push(report);
      
      // 最新10件のみ保持
      if (reports.length > 10) {
        reports.splice(0, reports.length - 10);
      }
      
      localStorage.setItem('haqei_performance_reports', JSON.stringify(reports));
    } catch (error) {
      console.warn('⚠️ Could not save performance report:', error);
    }

    return report;
  }

  /**
   * パフォーマンス評価
   */
  evaluatePerformance(report) {
    const evaluations = [];
    
    // Load Time評価
    if (report.loadTime < 2000) {
      evaluations.push('✅ 読み込み速度: 優秀 (2秒未満)');
    } else if (report.loadTime < 4000) {
      evaluations.push('⚠️ 読み込み速度: 要改善 (2-4秒)');
    } else {
      evaluations.push('❌ 読み込み速度: 要最適化 (4秒以上)');
    }

    // LCP評価
    if (report.lcp < 2500) {
      evaluations.push('✅ LCP: 良好');
    } else if (report.lcp < 4000) {
      evaluations.push('⚠️ LCP: 要改善');
    } else {
      evaluations.push('❌ LCP: 要最適化');
    }

    // CLS評価
    if (report.cls < 0.1) {
      evaluations.push('✅ CLS: 安定');
    } else if (report.cls < 0.25) {
      evaluations.push('⚠️ CLS: 要改善');
    } else {
      evaluations.push('❌ CLS: 要最適化');
    }

    // キャッシュ効率評価
    if (report.cacheHitRate > 80) {
      evaluations.push('✅ キャッシュ効率: 優秀');
    } else if (report.cacheHitRate > 60) {
      evaluations.push('⚠️ キャッシュ効率: 良好');
    } else {
      evaluations.push('❌ キャッシュ効率: 要改善');
    }

    console.log('📈 パフォーマンス評価:', evaluations);
    
    // UIに評価結果を表示（可能な場合）
    this.displayPerformanceStatus(evaluations);
  }

  /**
   * パフォーマンス状況をUIに表示
   */
  displayPerformanceStatus(evaluations) {
    if (window.showNotification && typeof window.showNotification === 'function') {
      const summary = evaluations.filter(e => e.includes('✅')).length;
      const total = evaluations.length;
      
      if (summary === total) {
        window.showNotification('🚀 パフォーマンス最適化完了', 'すべての指標が良好です', 'success');
      } else if (summary >= total * 0.7) {
        window.showNotification('⚡ パフォーマンス良好', '一部改善余地があります', 'info');
      } else {
        window.showNotification('🔧 パフォーマンス要改善', '最適化が必要です', 'warning');
      }
    }
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    // キャッシュクリア
    this.cacheManager.clear();
    
    // Performance Observer停止
    if (this.performanceObservers) {
      this.performanceObservers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn('Observer cleanup error:', error);
        }
      });
    }
  }

  /**
   * 手動パフォーマンス測定開始
   */
  startMeasurement(name) {
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * 手動パフォーマンス測定終了
   */
  endMeasurement(name) {
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measurement = performance.getEntriesByName(name)[0];
      console.log(`⏱️ ${name}: ${measurement.duration.toFixed(2)}ms`);
      
      return measurement.duration;
    }
    return 0;
  }
}

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.performanceOptimizer = new PerformanceOptimizer();
  console.log('🚀 Performance Optimizer initialized');
});

// グローバル公開
window.PerformanceOptimizer = PerformanceOptimizer;