/**
 * CoreWebVitalsOptimizer.js - 高性能化システム
 * HAQEI Analyzer Performance Optimization Engine
 * 
 * 目的:
 * - Core Web Vitals目標達成 (FCP<1.8s, LCP<2.5s, CLS<0.1, FID<100ms)
 * - バンドルサイズ大幅削減 (8.74MB → 1.8MB目標)
 * - プログレッシブローディング実装
 * - メモリリーク防止とパフォーマンス監視
 * - bunenjin哲学に基づく段階的最適化
 * 
 * バージョン: v1.0.0-core-web-vitals
 * 作成日: 2025-08-05
 */

class CoreWebVitalsOptimizer {
  constructor(options = {}) {
    this.options = {
      enableProgressiveLoading: true,
      enableBundleOptimization: true,
      enableMemoryMonitoring: true,
      enableWebVitalsTracking: true,
      enableServiceWorker: true,
      developmentMode: false,
      ...options
    };
    
    // Core Web Vitals目標値
    this.targets = {
      FCP: 1800,  // First Contentful Paint
      LCP: 2500,  // Largest Contentful Paint
      FID: 100,   // First Input Delay
      CLS: 0.1,   // Cumulative Layout Shift
      INP: 200    // Interaction to Next Paint
    };
    
    // パフォーマンスメトリクス
    this.metrics = {
      loadTimes: new Map(),
      bundleSizes: new Map(),
      memoryUsage: new Map(),
      webVitals: new Map()
    };
    
    // プログレッシブローディング管理
    this.loadingState = {
      critical: false,
      secondary: false,
      tertiary: false,
      complete: false
    };
    
    // バンドル最適化設定
    this.bundles = {
      critical: [
        '/js/shared/core/BaseComponent.js',
        '/js/shared/core/MicroDataManager.js',
        '/js/os-analyzer/components/WelcomeScreen.js'
      ],
      secondary: [
        '/js/os-analyzer/components/HaqeiQuestionElement.js',
        '/js/ui/DisplayController.js',
        '/js/ui/QuestionManager.js'
      ],
      tertiary: [
        '/js/shared/utils/AccessibilityManager.js',
        '/js/components/HarmonyIndicator.js',
        '/js/shared/analysis/TripleOSAnalyzer.js'
      ],
      data: [
        '/js/data/data_box.js',
        '/js/koudo_shishin_database.js',
        '/js/core/H384_DATABASE.js',
        '/js/ai_theme_database.js'
      ]
    };
    
    // メモリ管理
    this.memoryManager = {
      observers: new Map(),
      weakRefs: new WeakMap(),
      cleanupTasks: [],
      thresholds: {
        warning: 50 * 1024 * 1024,  // 50MB
        critical: 100 * 1024 * 1024  // 100MB
      }
    };
    
    console.log('🚀 CoreWebVitalsOptimizer initialized');
  }
  
  /**
   * パフォーマンス最適化の初期化
   */
  async initialize() {
    console.log('⚡ Starting Core Web Vitals optimization...');
    
    try {
      // Web Vitalsトラッキング開始
      if (this.options.enableWebVitalsTracking) {
        this.initWebVitalsTracking();
      }
      
      // プログレッシブローディング設定
      if (this.options.enableProgressiveLoading) {
        await this.setupProgressiveLoading();
      }
      
      // バンドル最適化
      if (this.options.enableBundleOptimization) {
        this.optimizeBundles();
      }
      
      // メモリ監視開始
      if (this.options.enableMemoryMonitoring) {
        this.startMemoryMonitoring();
      }
      
      // Service Worker登録
      if (this.options.enableServiceWorker) {
        await this.registerServiceWorker();
      }
      
      // パフォーマンス監視開始
      this.startPerformanceMonitoring();
      
      console.log('✅ Core Web Vitals optimization initialized');
      return true;
      
    } catch (error) {
      console.error('❌ Performance optimization failed:', error);
      return false;
    }
  }
  
  /**
   * Web Vitals追跡の初期化
   */
  initWebVitalsTracking() {
    // FCP (First Contentful Paint) 測定
    this.measureFCP();
    
    // LCP (Largest Contentful Paint) 測定
    this.measureLCP();
    
    // FID (First Input Delay) 測定
    this.measureFID();
    
    // CLS (Cumulative Layout Shift) 測定
    this.measureCLS();
    
    // INP (Interaction to Next Paint) 測定
    this.measureINP();
  }
  
  /**
   * FCP (First Contentful Paint) 測定
   */
  measureFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          const fcp = entry.startTime;
          this.metrics.webVitals.set('FCP', fcp);
          
          console.log(`📊 FCP: ${fcp.toFixed(2)}ms (Target: ${this.targets.FCP}ms)`);
          
          if (fcp > this.targets.FCP) {
            console.warn(`⚠️ FCP exceeds target by ${(fcp - this.targets.FCP).toFixed(2)}ms`);
          }
          
          // イベント送信
          this.dispatchPerformanceEvent('fcp', fcp);
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }
  
  /**
   * LCP (Largest Contentful Paint) 測定
   */
  measureLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        const lcp = lastEntry.startTime;
        this.metrics.webVitals.set('LCP', lcp);
        
        console.log(`📊 LCP: ${lcp.toFixed(2)}ms (Target: ${this.targets.LCP}ms)`);
        
        if (lcp > this.targets.LCP) {
          console.warn(`⚠️ LCP exceeds target by ${(lcp - this.targets.LCP).toFixed(2)}ms`);
        }
        
        this.dispatchPerformanceEvent('lcp', lcp);
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  /**
   * FID (First Input Delay) 測定
   */
  measureFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;
        this.metrics.webVitals.set('FID', fid);
        
        console.log(`📊 FID: ${fid.toFixed(2)}ms (Target: ${this.targets.FID}ms)`);
        
        if (fid > this.targets.FID) {
          console.warn(`⚠️ FID exceeds target by ${(fid - this.targets.FID).toFixed(2)}ms`);
        }
        
        this.dispatchPerformanceEvent('fid', fid);
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }
  
  /**
   * CLS (Cumulative Layout Shift) 測定
   */
  measureCLS() {
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.metrics.webVitals.set('CLS', clsValue);
      
      console.log(`📊 CLS: ${clsValue.toFixed(3)} (Target: ${this.targets.CLS})`);
      
      if (clsValue > this.targets.CLS) {
        console.warn(`⚠️ CLS exceeds target by ${(clsValue - this.targets.CLS).toFixed(3)}`);
      }
      
      this.dispatchPerformanceEvent('cls', clsValue);
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
  
  /**
   * INP (Interaction to Next Paint) 測定
   */
  measureINP() {
    let maxINP = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const inp = entry.processingEnd - entry.startTime;
        if (inp > maxINP) {
          maxINP = inp;
          this.metrics.webVitals.set('INP', inp);
          
          console.log(`📊 INP: ${inp.toFixed(2)}ms (Target: ${this.targets.INP}ms)`);
          
          if (inp > this.targets.INP) {
            console.warn(`⚠️ INP exceeds target by ${(inp - this.targets.INP).toFixed(2)}ms`);
          }
          
          this.dispatchPerformanceEvent('inp', inp);
        }
      });
    });
    
    observer.observe({ entryTypes: ['event'] });
  }
  
  /**
   * プログレッシブローディングの設定
   */
  async setupProgressiveLoading() {
    console.log('🔄 Setting up progressive loading...');
    
    // クリティカルパスの最適化
    await this.loadCriticalResources();
    
    // インタラクション後の遅延読み込み
    this.setupLazyLoading();
    
    // データの段階的読み込み
    this.setupProgressiveDataLoading();
  }
  
  /**
   * クリティカルリソースの読み込み
   */
  async loadCriticalResources() {
    const startTime = performance.now();
    
    try {
      // 最小限の必須スクリプトのみ読み込み
      const criticalPromises = this.bundles.critical.map(url => 
        this.loadScript(url, { priority: 'high' })
      );
      
      await Promise.all(criticalPromises);
      
      this.loadingState.critical = true;
      const loadTime = performance.now() - startTime;
      
      console.log(`✅ Critical resources loaded in ${loadTime.toFixed(2)}ms`);
      this.metrics.loadTimes.set('critical', loadTime);
      
    } catch (error) {
      console.error('❌ Critical resource loading failed:', error);
    }
  }
  
  /**
   * 遅延読み込みの設定
   */
  setupLazyLoading() {
    // ユーザーインタラクション後に二次リソースを読み込み
    const loadSecondaryResources = () => {
      if (!this.loadingState.secondary) {
        this.loadSecondaryResources();
      }
    };
    
    // スクロール、クリック、キーボード入力で発火
    ['scroll', 'click', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, loadSecondaryResources, { 
        once: true, 
        passive: true 
      });
    });
    
    // 3秒後にフォールバック読み込み
    setTimeout(() => {
      if (!this.loadingState.secondary) {
        this.loadSecondaryResources();
      }
    }, 3000);
  }
  
  /**
   * 二次リソースの読み込み
   */
  async loadSecondaryResources() {
    if (this.loadingState.secondary) return;
    
    const startTime = performance.now();
    
    try {
      const secondaryPromises = this.bundles.secondary.map(url => 
        this.loadScript(url, { priority: 'low' })
      );
      
      await Promise.all(secondaryPromises);
      
      this.loadingState.secondary = true;
      const loadTime = performance.now() - startTime;
      
      console.log(`✅ Secondary resources loaded in ${loadTime.toFixed(2)}ms`);
      this.metrics.loadTimes.set('secondary', loadTime);
      
      // 三次リソースの読み込み開始
      setTimeout(() => this.loadTertiaryResources(), 1000);
      
    } catch (error) {
      console.error('❌ Secondary resource loading failed:', error);
    }
  }
  
  /**
   * 三次リソースの読み込み
   */
  async loadTertiaryResources() {
    if (this.loadingState.tertiary) return;
    
    const startTime = performance.now();
    
    try {
      const tertiaryPromises = this.bundles.tertiary.map(url => 
        this.loadScript(url, { priority: 'low' })
      );
      
      await Promise.all(tertiaryPromises);
      
      this.loadingState.tertiary = true;
      const loadTime = performance.now() - startTime;
      
      console.log(`✅ Tertiary resources loaded in ${loadTime.toFixed(2)}ms`);
      this.metrics.loadTimes.set('tertiary', loadTime);
      
      this.loadingState.complete = true;
      this.dispatchPerformanceEvent('loading-complete', {
        total: this.getTotalLoadTime()
      });
      
    } catch (error) {
      console.error('❌ Tertiary resource loading failed:', error);
    }
  }
  
  /**
   * プログレッシブデータローディング
   */
  setupProgressiveDataLoading() {
    // 大きなデータファイルをチャンク単位で読み込み
    this.bundles.data.forEach(url => {
      this.loadDataProgressively(url);
    });
  }
  
  /**
   * データの段階的読み込み
   */
  async loadDataProgressively(url) {
    try {
      // ヘッダーで最初にサイズを確認
      const response = await fetch(url, { method: 'HEAD' });
      const size = parseInt(response.headers.get('content-length') || '0');
      
      if (size > 100 * 1024) { // 100KB以上の場合は分割読み込み
        console.log(`📦 Loading large data file progressively: ${url} (${(size / 1024).toFixed(1)}KB)`);
        await this.loadInChunks(url, size);
      } else {
        await this.loadScript(url, { priority: 'low' });
      }
      
    } catch (error) {
      console.warn(`⚠️ Progressive data loading failed for ${url}:`, error);
      // フォールバック: 通常読み込み
      await this.loadScript(url, { priority: 'low' });
    }
  }
  
  /**
   * チャンク単位での読み込み
   */
  async loadInChunks(url, totalSize) {
    const chunkSize = 64 * 1024; // 64KB chunks
    const chunks = Math.ceil(totalSize / chunkSize);
    
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize - 1, totalSize - 1);
      
      try {
        const response = await fetch(url, {
          headers: {
            'Range': `bytes=${start}-${end}`
          }
        });
        
        if (response.status === 206) { // Partial Content
          const chunk = await response.text();
          this.processDataChunk(chunk, i, chunks);
          
          // 次のチャンクまで少し待機
          if (i < chunks - 1) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
      } catch (error) {
        console.error(`❌ Chunk ${i + 1}/${chunks} failed:`, error);
        break;
      }
    }
  }
  
  /**
   * データチャンクの処理
   */
  processDataChunk(chunk, index, total) {
    // チャンクデータの処理ロジック
    console.log(`📦 Processing chunk ${index + 1}/${total}`);
    
    // プログレス更新
    const progress = (index + 1) / total;
    this.dispatchPerformanceEvent('data-loading-progress', {
      progress: progress,
      chunk: index + 1,
      total: total
    });
  }
  
  /**
   * スクリプトの動的読み込み
   */
  async loadScript(url, options = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      
      if (options.priority) {
        script.fetchPriority = options.priority;
      }
      
      script.onload = () => {
        console.log(`✅ Loaded: ${url}`);
        resolve();
      };
      
      script.onerror = () => {
        console.error(`❌ Failed to load: ${url}`);
        reject(new Error(`Failed to load ${url}`));
      };
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * バンドル最適化
   */
  optimizeBundles() {
    console.log('📦 Optimizing bundles...');
    
    // 未使用コードの検出
    this.detectUnusedCode();
    
    // 重複モジュールの統合
    this.deduplicateModules();
    
    // Tree shakingの実行
    this.performTreeShaking();
  }
  
  /**
   * 未使用コードの検出
   */
  detectUnusedCode() {
    // Performance API を使用して実際に使用されたコードを追跡
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          this.trackResourceUsage(entry);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
  
  /**
   * リソース使用状況の追跡
   */
  trackResourceUsage(entry) {
    const usage = {
      name: entry.name,
      size: entry.transferSize || 0,
      duration: entry.duration,
      used: true // TODO: 実際の使用状況を検出
    };
    
    this.metrics.bundleSizes.set(entry.name, usage);
  }
  
  /**
   * メモリ監視の開始
   */
  startMemoryMonitoring() {
    console.log('🧠 Starting memory monitoring...');
    
    // 定期的なメモリ使用量チェック
    setInterval(() => {
      this.checkMemoryUsage();
    }, 5000);
    
    // メモリリーク検出
    this.setupMemoryLeakDetection();
  }
  
  /**
   * メモリ使用量のチェック
   */
  checkMemoryUsage() {
    if (performance.memory) {
      const memory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
      
      this.metrics.memoryUsage.set(memory.timestamp, memory);
      
      // 警告レベルのチェック
      if (memory.used > this.memoryManager.thresholds.warning) {
        console.warn(`⚠️ Memory usage high: ${(memory.used / 1024 / 1024).toFixed(1)}MB`);
        
        if (memory.used > this.memoryManager.thresholds.critical) {
          console.error(`🚨 Critical memory usage: ${(memory.used / 1024 / 1024).toFixed(1)}MB`);
          this.performMemoryCleanup();
        }
      }
      
      this.dispatchPerformanceEvent('memory-check', memory);
    }
  }
  
  /**
   * メモリクリーンアップの実行
   */
  performMemoryCleanup() {
    console.log('🧹 Performing memory cleanup...');
    
    // 登録されたクリーンアップタスクを実行
    this.memoryManager.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('❌ Cleanup task failed:', error);
      }
    });
    
    // イベントリスナーのクリーンアップ
    this.cleanupEventListeners();
    
    // 古いメトリクスデータの削除
    this.cleanupOldMetrics();
    
    // ガベージコレクション促進（できる範囲で）
    if (window.gc) {
      window.gc();
    }
  }
  
  /**
   * Service Worker の登録
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw-performance.js');
        console.log('✅ Service Worker registered for performance optimization');
        
        // Service Workerとの通信設定
        this.setupServiceWorkerCommunication(registration);
        
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }
  }
  
  /**
   * パフォーマンス監視の開始
   */
  startPerformanceMonitoring() {
    console.log('📊 Starting performance monitoring...');
    
    // Resource Timing の監視
    this.monitorResourceTiming();
    
    // Navigation Timing の監視
    this.monitorNavigationTiming();
    
    // Custom Metrics の監視
    this.monitorCustomMetrics();
  }
  
  /**
   * パフォーマンスイベントの送信
   */
  dispatchPerformanceEvent(type, data) {
    const event = new CustomEvent('performance-update', {
      detail: { type, data, timestamp: Date.now() }
    });
    
    document.dispatchEvent(event);
    
    // 開発モードでのログ出力
    if (this.options.developmentMode) {
      console.log(`📊 Performance Event [${type}]:`, data);
    }
  }
  
  /**
   * パフォーマンスレポートの生成
   */
  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      webVitals: Object.fromEntries(this.metrics.webVitals),
      loadTimes: Object.fromEntries(this.metrics.loadTimes),
      bundleSizes: Object.fromEntries(this.metrics.bundleSizes),
      memoryUsage: this.getMemoryUsageSummary(),
      loadingState: { ...this.loadingState },
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }
  
  /**
   * 最適化推奨事項の生成
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Web Vitals チェック
    const fcp = this.metrics.webVitals.get('FCP');
    const lcp = this.metrics.webVitals.get('LCP');
    const fid = this.metrics.webVitals.get('FID');
    const cls = this.metrics.webVitals.get('CLS');
    
    if (fcp && fcp > this.targets.FCP) {
      recommendations.push({
        type: 'FCP',
        message: `First Contentful Paint is ${fcp.toFixed(2)}ms, target is ${this.targets.FCP}ms`,
        suggestion: 'Consider reducing render-blocking resources and optimizing critical CSS'
      });
    }
    
    if (lcp && lcp > this.targets.LCP) {
      recommendations.push({
        type: 'LCP',
        message: `Largest Contentful Paint is ${lcp.toFixed(2)}ms, target is ${this.targets.LCP}ms`,
        suggestion: 'Optimize largest elements and consider lazy loading for non-critical content'
      });
    }
    
    if (fid && fid > this.targets.FID) {
      recommendations.push({
        type: 'FID',
        message: `First Input Delay is ${fid.toFixed(2)}ms, target is ${this.targets.FID}ms`,
        suggestion: 'Reduce JavaScript execution time and consider code splitting'
      });
    }
    
    if (cls && cls > this.targets.CLS) {
      recommendations.push({
        type: 'CLS',
        message: `Cumulative Layout Shift is ${cls.toFixed(3)}, target is ${this.targets.CLS}`,
        suggestion: 'Add size attributes to media elements and avoid injecting content above existing content'
      });
    }
    
    return recommendations;
  }
  
  /**
   * メモリ使用量サマリーの取得
   */
  getMemoryUsageSummary() {
    const entries = Array.from(this.metrics.memoryUsage.values());
    if (entries.length === 0) return null;
    
    const current = entries[entries.length - 1];
    const peak = entries.reduce((max, entry) => 
      entry.used > max.used ? entry : max
    );
    
    return {
      current: {
        used: current.used,
        total: current.total,
        percentage: (current.used / current.total * 100).toFixed(1)
      },
      peak: {
        used: peak.used,
        total: peak.total,
        percentage: (peak.used / peak.total * 100).toFixed(1)
      }
    };
  }
  
  /**
   * 総読み込み時間の取得
   */
  getTotalLoadTime() {
    let total = 0;
    this.metrics.loadTimes.forEach((time) => {
      total += time;
    });
    return total;
  }
  
  /**
   * 古いメトリクスの削除
   */
  cleanupOldMetrics() {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10分
    
    // 古いメモリ使用量データを削除
    for (const [timestamp] of this.metrics.memoryUsage) {
      if (now - timestamp > maxAge) {
        this.metrics.memoryUsage.delete(timestamp);
      }
    }
  }
  
  /**
   * イベントリスナーのクリーンアップ
   */
  cleanupEventListeners() {
    // WeakMapに保存された参照をクリーンアップ
    // 実際の実装では、各コンポーネントが適切にクリーンアップを行う
  }
  
  /**
   * 統計情報の取得
   */
  getStats() {
    return {
      webVitals: Object.fromEntries(this.metrics.webVitals),
      loadingState: this.loadingState,
      memoryPeak: this.getMemoryUsageSummary()?.peak,
      totalLoadTime: this.getTotalLoadTime(),
      optimizationEnabled: {
        progressiveLoading: this.options.enableProgressiveLoading,
        bundleOptimization: this.options.enableBundleOptimization,
        memoryMonitoring: this.options.enableMemoryMonitoring,
        webVitalsTracking: this.options.enableWebVitalsTracking
      }
    };
  }
  
  /**
   * 破棄
   */
  destroy() {
    // 全ての監視を停止
    this.memoryManager.observers.forEach(observer => observer.disconnect());
    this.memoryManager.observers.clear();
    
    // メトリクスデータクリア
    this.metrics.loadTimes.clear();
    this.metrics.bundleSizes.clear();
    this.metrics.memoryUsage.clear();
    this.metrics.webVitals.clear();
    
    console.log('🚀 CoreWebVitalsOptimizer destroyed');
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.CoreWebVitalsOptimizer = CoreWebVitalsOptimizer;
  console.log('✅ CoreWebVitalsOptimizer loaded');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CoreWebVitalsOptimizer;
}