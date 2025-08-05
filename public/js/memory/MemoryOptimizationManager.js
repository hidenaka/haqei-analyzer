/**
 * MemoryOptimizationManager.js - メモリ最適化管理システム
 * HAQEI Analyzer Memory Leak Prevention & Optimization
 * 
 * 目的:
 * - メモリリーク防止とガベージコレクション最適化
 * - WeakMap/WeakSetによる効率的な参照管理
 * - 自動メモリクリーンアップ
 * - メモリ使用量監視とアラート
 * 
 * 機能:
 * - 弱参照によるオブジェクト管理
 * - 定期的なメモリ監視
 * - 自動クリーンアップタスク
 * - メモリリーク検出
 * 
 * バージョン: v1.0.0-memory-optimization
 * 作成日: 2025-08-06
 */

class MemoryOptimizationManager {
  constructor(options = {}) {
    this.options = {
      monitoringInterval: 5000,      // 5秒ごとに監視
      warningThreshold: 50 * 1024 * 1024,   // 50MB警告
      criticalThreshold: 100 * 1024 * 1024, // 100MB危険
      enableAutoCleanup: true,
      enableLeakDetection: true,
      maxHistorySize: 100,
      ...options
    };
    
    // 弱参照マップ（DOMノードやイベントリスナー管理用）
    this.domReferences = new WeakMap();
    this.eventListeners = new WeakMap();
    this.componentCache = new WeakMap();
    
    // 弱参照セット（一時的なオブジェクト追跡用）
    this.temporaryObjects = new WeakSet();
    this.disposableResources = new WeakSet();
    
    // 通常のマップ（メトリクス用）
    this.memoryMetrics = new Map();
    this.leakSuspects = new Map();
    this.cleanupTasks = new Map();
    
    // メモリ履歴
    this.memoryHistory = [];
    this.leakHistory = [];
    
    // 監視インターバル
    this.monitoringTimer = null;
    this.isMonitoring = false;
    
    console.log('🧠 MemoryOptimizationManager initialized');
  }
  
  /**
   * メモリ最適化の開始
   */
  start() {
    if (this.isMonitoring) {
      console.warn('⚠️ Memory monitoring already started');
      return;
    }
    
    console.log('🚀 Starting memory optimization...');
    
    // イベントリスナー管理の強化
    this.enhanceEventListenerManagement();
    
    // DOM観測の開始
    this.startDOMObservation();
    
    // 定期監視の開始
    this.startMonitoring();
    
    // グローバルエラーハンドラー設定
    this.setupErrorHandlers();
    
    this.isMonitoring = true;
    console.log('✅ Memory optimization started');
  }
  
  /**
   * イベントリスナー管理の強化
   */
  enhanceEventListenerManagement() {
    // addEventListener のラップ
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // WeakMapに登録
      if (!this._memoryManager) {
        Object.defineProperty(this, '_memoryManager', {
          value: new WeakMap(),
          configurable: true
        });
      }
      
      if (!this._memoryManager.has(this)) {
        this._memoryManager.set(this, new Map());
      }
      
      const listenersMap = this._memoryManager.get(this);
      if (!listenersMap.has(type)) {
        listenersMap.set(type, new Set());
      }
      
      listenersMap.get(type).add(listener);
      
      // オリジナルのaddEventListenerを呼び出し
      return originalAddEventListener.call(this, type, listener, options);
    };
    
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      // WeakMapから削除
      if (this._memoryManager && this._memoryManager.has(this)) {
        const listenersMap = this._memoryManager.get(this);
        if (listenersMap.has(type)) {
          listenersMap.get(type).delete(listener);
          
          if (listenersMap.get(type).size === 0) {
            listenersMap.delete(type);
          }
        }
      }
      
      // オリジナルのremoveEventListenerを呼び出し
      return originalRemoveEventListener.call(this, type, listener, options);
    };
    
    console.log('✅ Event listener management enhanced');
  }
  
  /**
   * DOM観測の開始
   */
  startDOMObservation() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // 削除されたノードのクリーンアップ
        mutation.removedNodes.forEach((node) => {
          this.cleanupNode(node);
        });
        
        // 追加されたノードの追跡
        mutation.addedNodes.forEach((node) => {
          this.trackNode(node);
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    this.domObserver = observer;
    console.log('✅ DOM observation started');
  }
  
  /**
   * ノードのクリーンアップ
   */
  cleanupNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    // イベントリスナーの削除
    if (node._memoryManager && node._memoryManager.has(node)) {
      const listenersMap = node._memoryManager.get(node);
      listenersMap.clear();
      node._memoryManager.delete(node);
    }
    
    // 子ノードも再帰的にクリーンアップ
    if (node.children) {
      Array.from(node.children).forEach(child => {
        this.cleanupNode(child);
      });
    }
    
    // WeakMapからの削除
    this.domReferences.delete(node);
    this.eventListeners.delete(node);
  }
  
  /**
   * ノードの追跡
   */
  trackNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    // 重要な要素のみ追跡
    if (node.id || node.className || node.tagName.includes('-')) {
      this.domReferences.set(node, {
        addedAt: Date.now(),
        tagName: node.tagName,
        id: node.id,
        className: node.className
      });
    }
  }
  
  /**
   * 定期監視の開始
   */
  startMonitoring() {
    this.monitoringTimer = setInterval(() => {
      this.performMemoryCheck();
    }, this.options.monitoringInterval);
    
    // 初回チェック
    this.performMemoryCheck();
  }
  
  /**
   * メモリチェックの実行
   */
  performMemoryCheck() {
    const memoryInfo = this.getMemoryInfo();
    
    if (!memoryInfo) return;
    
    // メトリクスの記録
    this.recordMetrics(memoryInfo);
    
    // 閾値チェック
    this.checkThresholds(memoryInfo);
    
    // リーク検出
    if (this.options.enableLeakDetection) {
      this.detectMemoryLeaks(memoryInfo);
    }
    
    // 自動クリーンアップ
    if (this.options.enableAutoCleanup && memoryInfo.usedJSHeapSize > this.options.warningThreshold) {
      this.performAutoCleanup();
    }
  }
  
  /**
   * メモリ情報の取得
   */
  getMemoryInfo() {
    if (!performance.memory) {
      console.warn('⚠️ Performance.memory API not available');
      return null;
    }
    
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      timestamp: Date.now()
    };
  }
  
  /**
   * メトリクスの記録
   */
  recordMetrics(memoryInfo) {
    // 履歴に追加
    this.memoryHistory.push(memoryInfo);
    
    // 最大履歴サイズを超えたら古いものを削除
    if (this.memoryHistory.length > this.options.maxHistorySize) {
      this.memoryHistory.shift();
    }
    
    // 使用率の計算
    const usagePercentage = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
    
    this.memoryMetrics.set('currentUsage', {
      bytes: memoryInfo.usedJSHeapSize,
      percentage: usagePercentage,
      timestamp: memoryInfo.timestamp
    });
    
    // 成長率の計算
    if (this.memoryHistory.length > 1) {
      const previousMemory = this.memoryHistory[this.memoryHistory.length - 2];
      const growthRate = ((memoryInfo.usedJSHeapSize - previousMemory.usedJSHeapSize) / previousMemory.usedJSHeapSize) * 100;
      
      this.memoryMetrics.set('growthRate', {
        percentage: growthRate,
        interval: memoryInfo.timestamp - previousMemory.timestamp
      });
    }
  }
  
  /**
   * 閾値チェック
   */
  checkThresholds(memoryInfo) {
    const used = memoryInfo.usedJSHeapSize;
    
    if (used > this.options.criticalThreshold) {
      console.error(`🚨 Critical memory usage: ${(used / 1024 / 1024).toFixed(1)}MB`);
      this.dispatchMemoryEvent('critical', memoryInfo);
      
      // 緊急クリーンアップ
      this.performEmergencyCleanup();
      
    } else if (used > this.options.warningThreshold) {
      console.warn(`⚠️ High memory usage: ${(used / 1024 / 1024).toFixed(1)}MB`);
      this.dispatchMemoryEvent('warning', memoryInfo);
    }
  }
  
  /**
   * メモリリーク検出
   */
  detectMemoryLeaks(memoryInfo) {
    if (this.memoryHistory.length < 10) return;
    
    // 直近10回の測定値から傾向を分析
    const recentHistory = this.memoryHistory.slice(-10);
    const avgGrowth = this.calculateAverageGrowth(recentHistory);
    
    // 継続的な成長を検出
    if (avgGrowth > 1) { // 1%以上の継続的成長
      const suspectId = `leak_${Date.now()}`;
      
      this.leakSuspects.set(suspectId, {
        detectedAt: Date.now(),
        avgGrowth: avgGrowth,
        memoryTrend: recentHistory.map(m => m.usedJSHeapSize)
      });
      
      console.warn(`⚠️ Potential memory leak detected: ${avgGrowth.toFixed(2)}% average growth`);
      
      // リーク候補の分析
      this.analyzeLeakSources();
    }
  }
  
  /**
   * 平均成長率の計算
   */
  calculateAverageGrowth(history) {
    if (history.length < 2) return 0;
    
    let totalGrowth = 0;
    
    for (let i = 1; i < history.length; i++) {
      const growth = ((history[i].usedJSHeapSize - history[i-1].usedJSHeapSize) / history[i-1].usedJSHeapSize) * 100;
      totalGrowth += growth;
    }
    
    return totalGrowth / (history.length - 1);
  }
  
  /**
   * リークソースの分析
   */
  analyzeLeakSources() {
    const analysis = {
      domNodeCount: document.getElementsByTagName('*').length,
      eventListenerEstimate: this.estimateEventListeners(),
      globalVariables: this.countGlobalVariables(),
      timestamp: Date.now()
    };
    
    this.leakHistory.push(analysis);
    
    // パターン分析
    if (this.leakHistory.length > 2) {
      const growth = {
        domNodes: this.calculateGrowthTrend(this.leakHistory, 'domNodeCount'),
        listeners: this.calculateGrowthTrend(this.leakHistory, 'eventListenerEstimate'),
        globals: this.calculateGrowthTrend(this.leakHistory, 'globalVariables')
      };
      
      // 最も成長率が高いものを特定
      const maxGrowth = Math.max(growth.domNodes, growth.listeners, growth.globals);
      
      if (maxGrowth > 5) { // 5%以上の成長
        let source = 'Unknown';
        if (growth.domNodes === maxGrowth) source = 'DOM Nodes';
        else if (growth.listeners === maxGrowth) source = 'Event Listeners';
        else if (growth.globals === maxGrowth) source = 'Global Variables';
        
        console.warn(`🔍 Likely leak source: ${source} (${maxGrowth.toFixed(1)}% growth)`);
      }
    }
  }
  
  /**
   * イベントリスナー数の推定
   */
  estimateEventListeners() {
    let count = 0;
    
    document.querySelectorAll('*').forEach(element => {
      if (element._memoryManager && element._memoryManager.has(element)) {
        const listenersMap = element._memoryManager.get(element);
        listenersMap.forEach(listeners => {
          count += listeners.size;
        });
      }
    });
    
    return count;
  }
  
  /**
   * グローバル変数数のカウント
   */
  countGlobalVariables() {
    const standardGlobals = new Set([
      'window', 'document', 'console', 'navigator', 'location',
      'history', 'screen', 'alert', 'confirm', 'prompt',
      'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
      'requestAnimationFrame', 'cancelAnimationFrame',
      'fetch', 'XMLHttpRequest', 'WebSocket',
      'localStorage', 'sessionStorage', 'indexedDB',
      'performance', 'crypto', 'JSON', 'Math', 'Date'
    ]);
    
    let count = 0;
    for (const key in window) {
      if (!standardGlobals.has(key) && !key.startsWith('webkit')) {
        count++;
      }
    }
    
    return count;
  }
  
  /**
   * 成長トレンドの計算
   */
  calculateGrowthTrend(history, property) {
    if (history.length < 2) return 0;
    
    const recent = history[history.length - 1][property];
    const previous = history[history.length - 2][property];
    
    return ((recent - previous) / previous) * 100;
  }
  
  /**
   * 自動クリーンアップ
   */
  performAutoCleanup() {
    console.log('🧹 Performing auto cleanup...');
    
    let cleaned = 0;
    
    // 登録されたクリーンアップタスクを実行
    this.cleanupTasks.forEach((task, id) => {
      try {
        task();
        cleaned++;
      } catch (error) {
        console.error(`❌ Cleanup task ${id} failed:`, error);
      }
    });
    
    // DOM要素のクリーンアップ
    cleaned += this.cleanupDetachedNodes();
    
    // イベントリスナーのクリーンアップ
    cleaned += this.cleanupUnusedListeners();
    
    // キャッシュのクリーンアップ
    cleaned += this.cleanupCaches();
    
    console.log(`✅ Auto cleanup completed: ${cleaned} items cleaned`);
    
    // ガベージコレクションのヒント
    if (window.gc) {
      window.gc();
      console.log('🗑️ Manual garbage collection triggered');
    }
  }
  
  /**
   * 緊急クリーンアップ
   */
  performEmergencyCleanup() {
    console.log('🚨 Performing emergency cleanup...');
    
    // 全てのキャッシュをクリア
    this.componentCache = new WeakMap();
    
    // 一時オブジェクトをクリア
    this.temporaryObjects = new WeakSet();
    this.disposableResources = new WeakSet();
    
    // グローバルなクリーンアップイベントを発火
    this.dispatchMemoryEvent('emergency-cleanup', {
      timestamp: Date.now()
    });
    
    // 強制的なガベージコレクション
    if (window.gc) {
      window.gc();
      window.gc(); // 2回実行で確実に
    }
  }
  
  /**
   * 切り離されたノードのクリーンアップ
   */
  cleanupDetachedNodes() {
    let cleaned = 0;
    
    // 切り離されたノードを検出（実装は簡略化）
    // 実際の実装では、WeakMapを使って追跡する
    
    return cleaned;
  }
  
  /**
   * 未使用リスナーのクリーンアップ
   */
  cleanupUnusedListeners() {
    let cleaned = 0;
    
    // 存在しないDOM要素のリスナーを削除
    // 実装は簡略化
    
    return cleaned;
  }
  
  /**
   * キャッシュのクリーンアップ
   */
  cleanupCaches() {
    let cleaned = 0;
    
    // 古いメトリクスデータを削除
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1時間
    
    this.memoryMetrics.forEach((value, key) => {
      if (value.timestamp && now - value.timestamp > maxAge) {
        this.memoryMetrics.delete(key);
        cleaned++;
      }
    });
    
    return cleaned;
  }
  
  /**
   * クリーンアップタスクの登録
   */
  registerCleanupTask(id, task) {
    if (typeof task !== 'function') {
      throw new Error('Cleanup task must be a function');
    }
    
    this.cleanupTasks.set(id, task);
    console.log(`✅ Cleanup task registered: ${id}`);
  }
  
  /**
   * クリーンアップタスクの削除
   */
  unregisterCleanupTask(id) {
    this.cleanupTasks.delete(id);
  }
  
  /**
   * コンポーネントキャッシュの設定
   */
  cacheComponent(component, data) {
    this.componentCache.set(component, data);
  }
  
  /**
   * コンポーネントキャッシュの取得
   */
  getCachedComponent(component) {
    return this.componentCache.get(component);
  }
  
  /**
   * 一時オブジェクトの追加
   */
  addTemporaryObject(obj) {
    this.temporaryObjects.add(obj);
  }
  
  /**
   * 一時オブジェクトかどうかの確認
   */
  isTemporaryObject(obj) {
    return this.temporaryObjects.has(obj);
  }
  
  /**
   * メモリイベントの発火
   */
  dispatchMemoryEvent(type, detail) {
    const event = new CustomEvent('memory-status', {
      detail: {
        type,
        ...detail
      }
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * エラーハンドラーの設定
   */
  setupErrorHandlers() {
    // メモリ不足エラーのキャッチ
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('out of memory')) {
        console.error('🚨 Out of memory error detected');
        this.performEmergencyCleanup();
      }
    });
  }
  
  /**
   * 現在のメモリ状態を取得
   */
  getMemoryStatus() {
    const current = this.memoryMetrics.get('currentUsage');
    const growthRate = this.memoryMetrics.get('growthRate');
    
    return {
      current: current || { bytes: 0, percentage: 0 },
      growthRate: growthRate || { percentage: 0 },
      history: this.memoryHistory.slice(-10),
      leakSuspects: Array.from(this.leakSuspects.values()),
      thresholds: {
        warning: this.options.warningThreshold,
        critical: this.options.criticalThreshold
      }
    };
  }
  
  /**
   * メモリ最適化の停止
   */
  stop() {
    if (!this.isMonitoring) {
      console.warn('⚠️ Memory monitoring not started');
      return;
    }
    
    // 監視タイマーの停止
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }
    
    // DOM観測の停止
    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }
    
    this.isMonitoring = false;
    console.log('🛑 Memory optimization stopped');
  }
  
  /**
   * 破棄処理
   */
  destroy() {
    this.stop();
    
    // 全てのマップをクリア
    this.domReferences = new WeakMap();
    this.eventListeners = new WeakMap();
    this.componentCache = new WeakMap();
    this.temporaryObjects = new WeakSet();
    this.disposableResources = new WeakSet();
    
    this.memoryMetrics.clear();
    this.leakSuspects.clear();
    this.cleanupTasks.clear();
    
    this.memoryHistory = [];
    this.leakHistory = [];
    
    console.log('💥 MemoryOptimizationManager destroyed');
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.MemoryOptimizationManager = MemoryOptimizationManager;
  console.log('✅ MemoryOptimizationManager loaded');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryOptimizationManager;
}