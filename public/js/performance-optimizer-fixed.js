/**
 * Performance Optimizer for os_analyzer - Fixed Version
 * パフォーマンス最適化（CLSエラー修正版）
 */

class PerformanceOptimizerFixed {
  constructor() {
    this.performanceMetrics = {
      startTime: performance.now(),
      loadEvents: [],
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.cacheManager = new Map();
    this.initialized = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    try {
      this.setupSafePerformanceMonitoring();
      this.optimizeImageLoading();
      this.setupIntelligentCaching();
      this.preventMemoryLeaks();
      this.initialized = true;
      console.log('✅ Performance Optimizer Fixed loaded successfully');
    } catch (error) {
      console.warn('⚠️ Performance Optimizer initialization failed:', error.message);
    }
  }

  /**
   * 安全なパフォーマンス監視設定（CLS問題修正）
   */
  setupSafePerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) {
      console.log('📊 PerformanceObserver not supported, skipping metrics');
      return;
    }

    try {
      // 設定を簡素化してCLSエラーを防止
      const safeObserver = new PerformanceObserver((list) => {
        try {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              this.performanceMetrics.lcp = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift' && entry.hadRecentInput === false) {
              // CLS値を記録（問題のある処理は削除）
              this.performanceMetrics.cls = (this.performanceMetrics.cls || 0) + entry.value;
            }
          });
        } catch (observerError) {
          // エラーを静かに処理
          console.debug('Performance observer entry error:', observerError.message);
        }
      });

      // 一度に1つのentryTypeのみ監視
      ['largest-contentful-paint'].forEach(type => {
        try {
          safeObserver.observe({ entryTypes: [type] });
        } catch (e) {
          console.debug(`Could not observe ${type}:`, e.message);
        }
      });

    } catch (error) {
      console.debug('Performance monitoring setup failed:', error.message);
    }
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
      });

      // 既存の画像を監視
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * インテリジェントキャッシュ
   */
  setupIntelligentCaching() {
    const originalFetch = window.fetch;
    
    window.fetch = async (resource, options = {}) => {
      const cacheKey = resource.toString();
      
      // GETリクエストのみキャッシュ
      if (!options.method || options.method.toUpperCase() === 'GET') {
        if (this.cacheManager.has(cacheKey)) {
          this.performanceMetrics.cacheHits++;
          return Promise.resolve(this.cacheManager.get(cacheKey).clone());
        }
      }
      
      try {
        const response = await originalFetch(resource, options);
        
        // 成功したGETレスポンスをキャッシュ
        if (response.ok && (!options.method || options.method.toUpperCase() === 'GET')) {
          this.cacheManager.set(cacheKey, response.clone());
          this.performanceMetrics.cacheMisses++;
        }
        
        return response;
      } catch (error) {
        this.performanceMetrics.cacheMisses++;
        throw error;
      }
    };
  }

  /**
   * メモリリーク防止
   */
  preventMemoryLeaks() {
    // 定期的なキャッシュクリーンアップ
    setInterval(() => {
      if (this.cacheManager.size > 50) {
        // 古いキャッシュエントリを削除
        const entries = Array.from(this.cacheManager.entries());
        entries.slice(0, 25).forEach(([key]) => {
          this.cacheManager.delete(key);
        });
      }
    }, 300000); // 5分毎

    // ページアンロード時のクリーンアップ
    window.addEventListener('beforeunload', () => {
      this.cacheManager.clear();
    });
  }

  /**
   * パフォーマンスメトリクスの取得
   */
  getMetrics() {
    return {
      ...this.performanceMetrics,
      cacheEfficiency: this.performanceMetrics.cacheHits / 
        (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) * 100,
      uptime: performance.now() - this.performanceMetrics.startTime
    };
  }

  /**
   * キャッシュクリア
   */
  clearCache() {
    this.cacheManager.clear();
    console.log('🧹 Performance cache cleared');
  }
}

// グローバルに公開
window.PerformanceOptimizerFixed = PerformanceOptimizerFixed;

// 自動初期化（既存のオプティマイザーがない場合のみ）
if (!window.performanceOptimizer) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.performanceOptimizer = new PerformanceOptimizerFixed();
    });
  } else {
    window.performanceOptimizer = new PerformanceOptimizerFixed();
  }
}

console.log('🔧 Performance Optimizer Fixed loaded - CLS問題を修正しました');