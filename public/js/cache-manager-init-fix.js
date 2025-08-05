/**
 * CacheManager初期化修正スクリプト
 * グローバルに必要なクラスを確実に定義する
 */

// CacheManagerのフォールバック定義
if (typeof window.CacheManager === 'undefined') {
  console.warn('CacheManager not found, creating fallback');
  window.CacheManager = class CacheManager {
    constructor(options = {}) {
      this.cache = new Map();
      this.options = options;
      console.log('Using CacheManager fallback');
    }
    
    get(key) { return this.cache.get(key); }
    set(key, value) { this.cache.set(key, value); }
    has(key) { return this.cache.has(key); }
    clear() { this.cache.clear(); }
    init() { return Promise.resolve(); }
  };
}

// PerformanceOptimizerのフォールバック定義
if (typeof window.PerformanceOptimizer === 'undefined') {
  console.warn('PerformanceOptimizer not found, creating fallback');
  window.PerformanceOptimizer = class PerformanceOptimizer {
    constructor(options = {}) {
      this.options = options;
      console.log('Using PerformanceOptimizer fallback');
    }
    
    optimize() {}
    monitor() {}
    getMetrics() { return {}; }
  };
}

console.log('✅ Cache Manager init fix loaded');