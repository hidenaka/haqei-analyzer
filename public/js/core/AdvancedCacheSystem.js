/**
 * HAQEIアナライザー 高度キャッシュシステム - AdvancedCacheSystem.js
 * 
 * マルチレイヤーキャッシング実装
 * L1(メモリ) + L2(SessionStorage) + L3(IndexedDB) の3層構造
 * 
 * パフォーマンス目標:
 * - L1キャッシュヒット: <1ms
 * - L2キャッシュヒット: <5ms
 * - L3キャッシュヒット: <20ms
 * - キャッシュヒット率: >95%
 * 
 * Author: Performance Engineer + System Architect
 * Created: 2025-08-05
 * Version: 1.0.0-multi-layer
 */

class AdvancedCacheSystem {
  constructor(options = {}) {
    this.version = "1.0.0-multi-layer";
    this.initialized = false;
    
    // キャッシュ設定
    this.config = {
      // L1: メモリキャッシュ
      l1: {
        maxSize: options.l1MaxSize || 1000,
        ttl: options.l1TTL || 300000 // 5分
      },
      // L2: SessionStorage
      l2: {
        maxSize: options.l2MaxSize || 5000,
        ttl: options.l2TTL || 1800000, // 30分
        prefix: 'haqei_l2_'
      },
      // L3: IndexedDB
      l3: {
        maxSize: options.l3MaxSize || 50000,
        ttl: options.l3TTL || 86400000, // 24時間
        dbName: 'haqei_cache_db',
        storeName: 'cache_store'
      },
      // 全般設定
      enableCompression: options.enableCompression !== false,
      enablePrefetch: options.enablePrefetch !== false,
      warmupOnInit: options.warmupOnInit !== false
    };
    
    // L1: メモリキャッシュ (LRU実装)
    this.l1Cache = new Map();
    this.l1AccessOrder = new Map();
    
    // L2: SessionStorage
    this.l2Available = this.checkSessionStorageAvailability();
    
    // L3: IndexedDB
    this.l3Available = false;
    this.l3DB = null;
    
    // 統計情報
    this.stats = {
      l1: { hits: 0, misses: 0, evictions: 0 },
      l2: { hits: 0, misses: 0, evictions: 0 },
      l3: { hits: 0, misses: 0, evictions: 0 },
      totalRequests: 0,
      totalHits: 0,
      totalMisses: 0,
      averageLatency: 0
    };
    
    // プリフェッチキュー
    this.prefetchQueue = new Set();
    this.prefetchInProgress = false;
    
    // 特化キャッシュカテゴリ
    this.categories = {
      'hexagram': { priority: 10, ttlMultiplier: 2 },      // 卦データ
      'calculation': { priority: 8, ttlMultiplier: 1.5 },  // 計算結果
      'graph': { priority: 6, ttlMultiplier: 1 },          // グラフデータ
      'analysis': { priority: 7, ttlMultiplier: 1.5 },     // 分析結果
      'user': { priority: 9, ttlMultiplier: 0.5 }          // ユーザーデータ
    };
    
    console.log("🚀 AdvancedCacheSystem initializing - Multi-layer caching");
  }
  
  /**
   * 初期化
   */
  async initialize() {
    if (this.initialized) return;
    
    const startTime = performance.now();
    
    try {
      // L3 (IndexedDB) の初期化
      await this.initializeL3Cache();
      
      // L2 (SessionStorage) のクリーンアップ
      this.cleanupL2Cache();
      
      // ウォームアップ（重要データの事前読み込み）
      if (this.config.warmupOnInit) {
        await this.warmupCache();
      }
      
      // 定期クリーンアップの開始
      this.startPeriodicCleanup();
      
      // プリフェッチシステムの開始
      if (this.config.enablePrefetch) {
        this.startPrefetchSystem();
      }
      
      this.initialized = true;
      const initTime = performance.now() - startTime;
      console.log(`✅ AdvancedCacheSystem initialized in ${initTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.error("❌ AdvancedCacheSystem initialization failed:", error);
      this.initialized = true; // 基本機能は使用可能に
    }
  }
  
  /**
   * キャッシュ取得（マルチレイヤー）
   */
  async get(key, options = {}) {
    const startTime = performance.now();
    this.stats.totalRequests++;
    
    try {
      // カテゴリとプライオリティの判定
      const category = this.detectCategory(key, options);
      
      // L1キャッシュチェック
      const l1Result = this.getFromL1(key);
      if (l1Result !== null) {
        this.recordHit('l1', performance.now() - startTime);
        return l1Result;
      }
      
      // L2キャッシュチェック
      const l2Result = await this.getFromL2(key);
      if (l2Result !== null) {
        this.recordHit('l2', performance.now() - startTime);
        // L1にプロモート
        this.setInL1(key, l2Result, category);
        return l2Result;
      }
      
      // L3キャッシュチェック
      const l3Result = await this.getFromL3(key);
      if (l3Result !== null) {
        this.recordHit('l3', performance.now() - startTime);
        // L1とL2にプロモート
        this.setInL1(key, l3Result, category);
        await this.setInL2(key, l3Result, category);
        return l3Result;
      }
      
      // キャッシュミス
      this.recordMiss(performance.now() - startTime);
      return null;
      
    } catch (error) {
      console.error(`❌ Cache get error for ${key}:`, error);
      this.recordMiss(performance.now() - startTime);
      return null;
    }
  }
  
  /**
   * キャッシュ設定（マルチレイヤー）
   */
  async set(key, value, options = {}) {
    const startTime = performance.now();
    
    try {
      // カテゴリとプライオリティの判定
      const category = this.detectCategory(key, options);
      const priority = options.priority || this.categories[category]?.priority || 5;
      
      // サイズチェック
      const size = this.calculateSize(value);
      
      // 各レイヤーに適切に保存
      if (size < 10000) { // 10KB未満はL1
        this.setInL1(key, value, category);
      }
      
      if (size < 100000 && this.l2Available) { // 100KB未満はL2
        await this.setInL2(key, value, category);
      }
      
      if (this.l3Available) { // すべてL3に保存
        await this.setInL3(key, value, category);
      }
      
      // プリフェッチトリガー
      if (this.config.enablePrefetch) {
        this.triggerPrefetch(key, value, category);
      }
      
      const setTime = performance.now() - startTime;
      console.log(`💾 Cached ${key} (${category}) in ${setTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.error(`❌ Cache set error for ${key}:`, error);
    }
  }
  
  /**
   * L1キャッシュ取得
   */
  getFromL1(key) {
    if (this.l1Cache.has(key)) {
      const entry = this.l1Cache.get(key);
      
      // TTLチェック
      if (Date.now() > entry.expiry) {
        this.l1Cache.delete(key);
        this.l1AccessOrder.delete(key);
        return null;
      }
      
      // アクセス順序更新
      this.l1AccessOrder.delete(key);
      this.l1AccessOrder.set(key, Date.now());
      
      this.stats.l1.hits++;
      return entry.value;
    }
    
    this.stats.l1.misses++;
    return null;
  }
  
  /**
   * L1キャッシュ設定
   */
  setInL1(key, value, category) {
    // サイズ制限チェック
    if (this.l1Cache.size >= this.config.l1.maxSize) {
      this.evictFromL1();
    }
    
    const ttlMultiplier = this.categories[category]?.ttlMultiplier || 1;
    const expiry = Date.now() + (this.config.l1.ttl * ttlMultiplier);
    
    this.l1Cache.set(key, {
      value,
      expiry,
      category,
      size: this.calculateSize(value),
      created: Date.now()
    });
    
    this.l1AccessOrder.set(key, Date.now());
  }
  
  /**
   * L1キャッシュエビクション（LRU）
   */
  evictFromL1() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, time] of this.l1AccessOrder) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      const evictedEntry = this.l1Cache.get(oldestKey);
      this.l1Cache.delete(oldestKey);
      this.l1AccessOrder.delete(oldestKey);
      this.stats.l1.evictions++;
      
      // L2にデモート（可能な場合）
      if (evictedEntry && this.l2Available) {
        this.setInL2(oldestKey, evictedEntry.value, evictedEntry.category);
      }
    }
  }
  
  /**
   * L2キャッシュ取得
   */
  async getFromL2(key) {
    if (!this.l2Available) return null;
    
    try {
      const stored = sessionStorage.getItem(this.config.l2.prefix + key);
      if (stored) {
        const entry = JSON.parse(stored);
        
        // TTLチェック
        if (Date.now() > entry.expiry) {
          sessionStorage.removeItem(this.config.l2.prefix + key);
          return null;
        }
        
        this.stats.l2.hits++;
        return entry.value;
      }
    } catch (error) {
      console.warn("⚠️ L2 cache read error:", error);
    }
    
    this.stats.l2.misses++;
    return null;
  }
  
  /**
   * L2キャッシュ設定
   */
  async setInL2(key, value, category) {
    if (!this.l2Available) return;
    
    try {
      const ttlMultiplier = this.categories[category]?.ttlMultiplier || 1;
      const expiry = Date.now() + (this.config.l2.ttl * ttlMultiplier);
      
      const entry = {
        value,
        expiry,
        category,
        created: Date.now()
      };
      
      // 圧縮（必要な場合）
      const data = this.config.enableCompression ? 
        await this.compress(entry) : JSON.stringify(entry);
      
      sessionStorage.setItem(this.config.l2.prefix + key, data);
      
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        // ストレージ満杯時のクリーンアップ
        this.cleanupL2Cache();
        try {
          sessionStorage.setItem(this.config.l2.prefix + key, data);
        } catch (retryError) {
          console.warn("⚠️ L2 cache full, cannot store:", key);
        }
      } else {
        console.error("❌ L2 cache write error:", error);
      }
    }
  }
  
  /**
   * L2キャッシュクリーンアップ
   */
  cleanupL2Cache() {
    if (!this.l2Available) return;
    
    const now = Date.now();
    const keysToRemove = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.config.l2.prefix)) {
        try {
          const entry = JSON.parse(sessionStorage.getItem(key));
          if (entry.expiry < now) {
            keysToRemove.push(key);
          }
        } catch (error) {
          keysToRemove.push(key); // 破損データも削除
        }
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`🧹 L2 cache cleanup: removed ${keysToRemove.length} expired entries`);
    }
  }
  
  /**
   * L3キャッシュ初期化（IndexedDB）
   */
  async initializeL3Cache() {
    if (!('indexedDB' in window)) {
      console.warn("⚠️ IndexedDB not available");
      return;
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.l3.dbName, 1);
      
      request.onerror = () => {
        console.error("❌ IndexedDB open error:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.l3DB = request.result;
        this.l3Available = true;
        console.log("✅ L3 cache (IndexedDB) initialized");
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(this.config.l3.storeName)) {
          const store = db.createObjectStore(this.config.l3.storeName, { keyPath: 'key' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('expiry', 'expiry', { unique: false });
          store.createIndex('created', 'created', { unique: false });
        }
      };
    });
  }
  
  /**
   * L3キャッシュ取得
   */
  async getFromL3(key) {
    if (!this.l3Available || !this.l3DB) return null;
    
    return new Promise((resolve) => {
      try {
        const transaction = this.l3DB.transaction([this.config.l3.storeName], 'readonly');
        const store = transaction.objectStore(this.config.l3.storeName);
        const request = store.get(key);
        
        request.onsuccess = () => {
          const entry = request.result;
          if (entry) {
            // TTLチェック
            if (Date.now() > entry.expiry) {
              this.deleteFromL3(key);
              resolve(null);
            } else {
              this.stats.l3.hits++;
              resolve(entry.value);
            }
          } else {
            this.stats.l3.misses++;
            resolve(null);
          }
        };
        
        request.onerror = () => {
          console.error("❌ L3 cache read error:", request.error);
          resolve(null);
        };
        
      } catch (error) {
        console.error("❌ L3 transaction error:", error);
        resolve(null);
      }
    });
  }
  
  /**
   * L3キャッシュ設定
   */
  async setInL3(key, value, category) {
    if (!this.l3Available || !this.l3DB) return;
    
    return new Promise((resolve) => {
      try {
        const transaction = this.l3DB.transaction([this.config.l3.storeName], 'readwrite');
        const store = transaction.objectStore(this.config.l3.storeName);
        
        const ttlMultiplier = this.categories[category]?.ttlMultiplier || 1;
        const expiry = Date.now() + (this.config.l3.ttl * ttlMultiplier);
        
        const entry = {
          key,
          value,
          category,
          expiry,
          created: Date.now(),
          size: this.calculateSize(value)
        };
        
        const request = store.put(entry);
        
        request.onsuccess = () => {
          resolve();
        };
        
        request.onerror = () => {
          console.error("❌ L3 cache write error:", request.error);
          resolve();
        };
        
        // サイズ制限チェック（非同期）
        this.checkL3Size();
        
      } catch (error) {
        console.error("❌ L3 transaction error:", error);
        resolve();
      }
    });
  }
  
  /**
   * L3キャッシュサイズチェック
   */
  async checkL3Size() {
    if (!this.l3Available || !this.l3DB) return;
    
    const transaction = this.l3DB.transaction([this.config.l3.storeName], 'readonly');
    const store = transaction.objectStore(this.config.l3.storeName);
    const countRequest = store.count();
    
    countRequest.onsuccess = () => {
      if (countRequest.result > this.config.l3.maxSize) {
        this.cleanupL3Cache();
      }
    };
  }
  
  /**
   * L3キャッシュクリーンアップ
   */
  async cleanupL3Cache() {
    if (!this.l3Available || !this.l3DB) return;
    
    return new Promise((resolve) => {
      const transaction = this.l3DB.transaction([this.config.l3.storeName], 'readwrite');
      const store = transaction.objectStore(this.config.l3.storeName);
      const index = store.index('expiry');
      
      const now = Date.now();
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);
      
      let deletedCount = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          deletedCount++;
          cursor.continue();
        } else {
          if (deletedCount > 0) {
            console.log(`🧹 L3 cache cleanup: removed ${deletedCount} expired entries`);
          }
          resolve();
        }
      };
      
      request.onerror = () => {
        console.error("❌ L3 cleanup error:", request.error);
        resolve();
      };
    });
  }
  
  /**
   * L3から削除
   */
  async deleteFromL3(key) {
    if (!this.l3Available || !this.l3DB) return;
    
    const transaction = this.l3DB.transaction([this.config.l3.storeName], 'readwrite');
    const store = transaction.objectStore(this.config.l3.storeName);
    store.delete(key);
  }
  
  /**
   * カテゴリ検出
   */
  detectCategory(key, options) {
    if (options.category) return options.category;
    
    if (key.startsWith('hex_')) return 'hexagram';
    if (key.startsWith('calc_')) return 'calculation';
    if (key.startsWith('graph_')) return 'graph';
    if (key.startsWith('analysis_')) return 'analysis';
    if (key.startsWith('user_')) return 'user';
    
    return 'general';
  }
  
  /**
   * サイズ計算
   */
  calculateSize(value) {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 1000; // デフォルト
    }
  }
  
  /**
   * SessionStorage利用可能チェック
   */
  checkSessionStorageAvailability() {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * データ圧縮
   */
  async compress(data) {
    // 簡易圧縮実装（実際にはより高度な圧縮アルゴリズムを使用）
    const jsonStr = JSON.stringify(data);
    return btoa(jsonStr);
  }
  
  /**
   * データ展開
   */
  async decompress(compressed) {
    try {
      const jsonStr = atob(compressed);
      return JSON.parse(jsonStr);
    } catch {
      return compressed; // 圧縮されていない場合はそのまま返す
    }
  }
  
  /**
   * ヒット記録
   */
  recordHit(layer, latency) {
    this.stats[layer].hits++;
    this.stats.totalHits++;
    this.updateAverageLatency(latency);
  }
  
  /**
   * ミス記録
   */
  recordMiss(latency) {
    this.stats.totalMisses++;
    this.updateAverageLatency(latency);
  }
  
  /**
   * 平均レイテンシ更新
   */
  updateAverageLatency(latency) {
    const total = this.stats.totalHits + this.stats.totalMisses;
    this.stats.averageLatency = 
      (this.stats.averageLatency * (total - 1) + latency) / total;
  }
  
  /**
   * キャッシュウォームアップ
   */
  async warmupCache() {
    console.log("🔥 Cache warmup starting...");
    
    // 重要な卦データをプリロード
    const importantHexagrams = [1, 2, 11, 12, 63, 64]; // 主要卦
    
    for (const hex of importantHexagrams) {
      const key = `hex_${hex}`;
      const cachedData = await this.get(key);
      if (!cachedData) {
        // 実際のデータ取得は呼び出し側で実装
        console.log(`📦 Warmup: ${key} needs loading`);
      }
    }
  }
  
  /**
   * 定期クリーンアップ開始
   */
  startPeriodicCleanup() {
    // 5分ごとにクリーンアップ
    setInterval(() => {
      this.performCleanup();
    }, 300000);
  }
  
  /**
   * クリーンアップ実行
   */
  async performCleanup() {
    const startTime = performance.now();
    
    // L1クリーンアップ
    const now = Date.now();
    const l1ToRemove = [];
    
    for (const [key, entry] of this.l1Cache) {
      if (entry.expiry < now) {
        l1ToRemove.push(key);
      }
    }
    
    l1ToRemove.forEach(key => {
      this.l1Cache.delete(key);
      this.l1AccessOrder.delete(key);
    });
    
    // L2クリーンアップ
    this.cleanupL2Cache();
    
    // L3クリーンアップ
    await this.cleanupL3Cache();
    
    const cleanupTime = performance.now() - startTime;
    console.log(`🧹 Cache cleanup completed in ${cleanupTime.toFixed(2)}ms`);
  }
  
  /**
   * プリフェッチシステム開始
   */
  startPrefetchSystem() {
    console.log("🔮 Prefetch system started");
    
    // プリフェッチ処理（100msごと）
    setInterval(() => {
      if (this.prefetchQueue.size > 0 && !this.prefetchInProgress) {
        this.processPrefetchQueue();
      }
    }, 100);
  }
  
  /**
   * プリフェッチトリガー
   */
  triggerPrefetch(key, value, category) {
    if (category === 'hexagram') {
      // 関連する卦をプリフェッチ対象に追加
      const hexNumber = parseInt(key.replace('hex_', ''));
      const related = [
        `hex_${((hexNumber + 31) % 64) + 1}`, // 互卦
        `hex_${65 - hexNumber}`,              // 綜卦
        `hex_${((hexNumber + 32) % 64) + 1}`  // 錯卦
      ];
      
      related.forEach(relKey => this.prefetchQueue.add(relKey));
    }
  }
  
  /**
   * プリフェッチキュー処理
   */
  async processPrefetchQueue() {
    if (this.prefetchQueue.size === 0) return;
    
    this.prefetchInProgress = true;
    const batch = Array.from(this.prefetchQueue).slice(0, 5);
    
    for (const key of batch) {
      this.prefetchQueue.delete(key);
      
      // すでにキャッシュされているかチェック
      const cached = await this.get(key);
      if (!cached) {
        console.log(`🔮 Prefetch needed for: ${key}`);
        // 実際のプリフェッチは呼び出し側で実装
      }
    }
    
    this.prefetchInProgress = false;
  }
  
  /**
   * キャッシュクリア
   */
  async clear(layer = 'all') {
    if (layer === 'all' || layer === 'l1') {
      this.l1Cache.clear();
      this.l1AccessOrder.clear();
      console.log("🧹 L1 cache cleared");
    }
    
    if (layer === 'all' || layer === 'l2') {
      if (this.l2Available) {
        const keys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(this.config.l2.prefix)) {
            keys.push(key);
          }
        }
        keys.forEach(key => sessionStorage.removeItem(key));
        console.log("🧹 L2 cache cleared");
      }
    }
    
    if (layer === 'all' || layer === 'l3') {
      if (this.l3Available && this.l3DB) {
        const transaction = this.l3DB.transaction([this.config.l3.storeName], 'readwrite');
        const store = transaction.objectStore(this.config.l3.storeName);
        store.clear();
        console.log("🧹 L3 cache cleared");
      }
    }
  }
  
  /**
   * 統計情報取得
   */
  getStats() {
    const totalHits = this.stats.totalHits;
    const totalRequests = this.stats.totalRequests || 1;
    
    return {
      ...this.stats,
      hitRate: `${((totalHits / totalRequests) * 100).toFixed(2)}%`,
      l1HitRate: `${((this.stats.l1.hits / (this.stats.l1.hits + this.stats.l1.misses || 1)) * 100).toFixed(2)}%`,
      l2HitRate: `${((this.stats.l2.hits / (this.stats.l2.hits + this.stats.l2.misses || 1)) * 100).toFixed(2)}%`,
      l3HitRate: `${((this.stats.l3.hits / (this.stats.l3.hits + this.stats.l3.misses || 1)) * 100).toFixed(2)}%`,
      averageLatency: `${this.stats.averageLatency.toFixed(2)}ms`,
      l1Size: this.l1Cache.size,
      l2Available: this.l2Available,
      l3Available: this.l3Available
    };
  }
  
  /**
   * 終了処理
   */
  async destroy() {
    // タイマークリア（実際の実装では適切に管理）
    
    // L3接続クローズ
    if (this.l3DB) {
      this.l3DB.close();
    }
    
    // キャッシュクリア
    await this.clear();
    
    console.log("🚀 AdvancedCacheSystem destroyed cleanly");
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.AdvancedCacheSystem = AdvancedCacheSystem;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedCacheSystem;
}

console.log("💾 AdvancedCacheSystem.js loaded - Multi-layer caching ready");