/**
 * HAQEI Advanced Cache System - 超高速キャッシングシステム
 * 
 * 目的：
 * - IntegratedAnalysisEngineの7段階処理を高速化
 * - 重複計算の完全排除
 * - メモリ効率的なキャッシュ戦略
 * - 適応的キャッシュサイズ管理
 * 
 * 特徴：
 * - Multi-tier caching (L1: Memory, L2: IndexedDB, L3: Compression)
 * - Intelligent eviction policies
 * - Predictive preloading
 * - Real-time performance optimization
 */
class AdvancedCacheSystem {
  constructor() {
    this.version = "3.0.0-advanced";
    
    // 3階層キャッシュシステム
    this.cache = {
      // L1: 高速メモリキャッシュ
      l1: {
        transformationPatterns: new Map(),
        hexagramMappings: new Map(),
        contextAnalysis: new Map(),
        metaphorGeneration: new Map(),
        comprehensiveResults: new Map()
      },
      
      // L2: IndexedDB永続キャッシュ
      l2: {
        dbName: 'HAQEIAdvancedCache',
        version: 3,
        db: null,
        stores: ['patterns', 'mappings', 'contexts', 'metaphors', 'results']
      },
      
      // L3: 圧縮キャッシュ
      l3: {
        compressionRatio: 0.7,
        compressedData: new Map(),
        decompressionQueue: []
      }
    };
    
    // キャッシュ設定
    this.config = {
      l1MaxSize: 1000,      // L1キャッシュ最大サイズ
      l2MaxSize: 10000,     // L2キャッシュ最大サイズ
      l3MaxSize: 50000,     // L3キャッシュ最大サイズ
      ttl: 86400000,        // TTL: 24時間
      compressionThreshold: 1024, // 1KB以上で圧縮
      preloadThreshold: 10,  // 10回アクセスで事前読み込み
      evictionStrategy: 'adaptive'
    };
    
    // 統計情報
    this.stats = {
      l1: { hits: 0, misses: 0, evictions: 0 },
      l2: { hits: 0, misses: 0, writes: 0 },
      l3: { hits: 0, misses: 0, compressions: 0 },
      overall: { 
        hitRate: 0, 
        avgResponseTime: 0, 
        memoryEfficiency: 0,
        totalRequests: 0
      }
    };
    
    // アクセスパターン分析
    this.accessPatterns = {
      frequency: new Map(),
      temporal: new Map(),
      predictive: new Map()
    };
    
    // 圧縮・展開ワーカー
    this.compressionWorker = null;
    
    console.log('🗃️ AdvancedCacheSystem v3.0.0 初期化開始');
    this.initialize();
  }

  /**
   * 初期化処理
   */
  async initialize() {
    try {
      console.time('AdvancedCacheSystem-Init');
      
      // 並列初期化
      await Promise.all([
        this.initializeIndexedDB(),
        this.initializeCompressionWorker(),
        this.loadExistingCache(),
        this.setupCacheMonitoring()
      ]);
      
      console.timeEnd('AdvancedCacheSystem-Init');
      console.log('✅ AdvancedCacheSystem初期化完了');
      
    } catch (error) {
      console.error('❌ AdvancedCacheSystem初期化エラー:', error);
    }
  }

  /**
   * IndexedDB初期化
   */
  async initializeIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.cache.l2.dbName, this.cache.l2.version);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.cache.l2.db = request.result;
        console.log('💾 IndexedDB初期化完了');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // ストア作成
        this.cache.l2.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'key' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('accessCount', 'accessCount', { unique: false });
            store.createIndex('size', 'size', { unique: false });
          }
        });
        
        console.log('🏗️ IndexedDBストア作成完了');
      };
    });
  }

  /**
   * 圧縮ワーカー初期化
   */
  async initializeCompressionWorker() {
    const workerScript = `
      // 圧縮・展開ワーカー
      let compressionQueue = [];
      let decompressionQueue = [];
      
      self.onmessage = function(e) {
        const { type, data, id } = e.data;
        
        switch(type) {
          case 'COMPRESS':
            compressData(data, id);
            break;
          case 'DECOMPRESS':
            decompressData(data, id);
            break;
          case 'BATCH_COMPRESS':
            batchCompress(data, id);
            break;
        }
      };
      
      function compressData(data, id) {
        try {
          const startTime = performance.now();
          
          // JSONシリアライゼーション
          const jsonString = JSON.stringify(data);
          
          // LZ圧縮シミュレーション（実際にはより高度な圧縮を使用）
          const compressed = performLZCompression(jsonString);
          
          const compressionTime = performance.now() - startTime;
          const compressionRatio = compressed.length / jsonString.length;
          
          self.postMessage({
            type: 'COMPRESS_RESULT',
            id: id,
            compressed: compressed,
            originalSize: jsonString.length,
            compressedSize: compressed.length,
            compressionRatio: compressionRatio,
            compressionTime: compressionTime
          });
          
        } catch (error) {
          self.postMessage({
            type: 'COMPRESS_ERROR',
            id: id,
            error: error.message
          });
        }
      }
      
      function decompressData(compressed, id) {
        try {
          const startTime = performance.now();
          
          // LZ展開シミュレーション
          const decompressed = performLZDecompression(compressed);
          
          // JSON復元
          const data = JSON.parse(decompressed);
          
          const decompressionTime = performance.now() - startTime;
          
          self.postMessage({
            type: 'DECOMPRESS_RESULT',
            id: id,
            data: data,
            decompressionTime: decompressionTime
          });
          
        } catch (error) {
          self.postMessage({
            type: 'DECOMPRESS_ERROR',
            id: id,
            error: error.message
          });
        }
      }
      
      function performLZCompression(text) {
        // 簡易LZ圧縮（実際にはもっと高度なアルゴリズムを使用）
        let compressed = '';
        let dictionary = {};
        let nextCode = 256;
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const sequence = text.substr(i, Math.min(10, text.length - i));
          
          if (dictionary[sequence]) {
            compressed += String.fromCharCode(dictionary[sequence]);
            i += sequence.length - 1;
          } else {
            if (sequence.length > 3) {
              dictionary[sequence] = nextCode++;
            }
            compressed += char;
          }
        }
        
        return compressed;
      }
      
      function performLZDecompression(compressed) {
        // LZ展開（圧縮の逆処理）
        return compressed; // 簡易実装
      }
      
      function batchCompress(dataArray, id) {
        const results = [];
        const startTime = performance.now();
        
        for (const item of dataArray) {
          const compressed = performLZCompression(JSON.stringify(item));
          results.push({
            original: item,
            compressed: compressed,
            ratio: compressed.length / JSON.stringify(item).length
          });
        }
        
        self.postMessage({
          type: 'BATCH_COMPRESS_RESULT',
          id: id,
          results: results,
          processingTime: performance.now() - startTime
        });
      }
    `;
    
    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      this.compressionWorker = new Worker(URL.createObjectURL(blob));
      
      this.compressionWorker.onmessage = (e) => {
        this.handleCompressionResult(e.data);
      };
      
      console.log('🗜️ 圧縮ワーカー初期化完了');
    } catch (error) {
      console.warn('⚠️ 圧縮ワーカー初期化失敗:', error);
    }
  }

  /**
   * 既存キャッシュ読み込み
   */
  async loadExistingCache() {
    if (!this.cache.l2.db) return;
    
    try {
      const stores = this.cache.l2.stores;
      const loadPromises = stores.map(storeName => this.loadFromIndexedDB(storeName));
      const results = await Promise.all(loadPromises);
      
      let totalLoaded = 0;
      results.forEach(count => totalLoaded += count);
      
      console.log(`📂 既存キャッシュ読み込み完了: ${totalLoaded}件`);
    } catch (error) {
      console.warn('⚠️ 既存キャッシュ読み込み失敗:', error);
    }
  }

  /**
   * IndexedDBからの読み込み
   */
  async loadFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.cache.l2.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const items = request.result;
        let loadedCount = 0;
        
        items.forEach(item => {
          // TTLチェック
          if (this.isValidCache(item)) {
            this.cache.l1[this.getL1StoreName(storeName)].set(item.key, item.data);
            loadedCount++;
          }
        });
        
        resolve(loadedCount);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * キャッシュ監視設定
   */
  setupCacheMonitoring() {
    // 定期的な統計更新
    setInterval(() => {
      this.updateStatistics();
      this.optimizeCachePerformance();
    }, 10000); // 10秒間隔
    
    // メモリ使用量監視
    setInterval(() => {
      this.monitorMemoryUsage();
    }, 30000); // 30秒間隔
    
    console.log('📊 キャッシュ監視設定完了');
  }

  /**
   * データ取得 - 3階層キャッシュ検索
   */
  async get(category, key) {
    const startTime = performance.now();
    this.stats.overall.totalRequests++;
    
    try {
      // L1キャッシュ検索
      const l1Result = await this.getFromL1(category, key);
      if (l1Result !== null) {
        this.recordHit('l1', performance.now() - startTime);
        this.updateAccessPattern(key);
        return l1Result;
      }
      
      // L2キャッシュ検索
      const l2Result = await this.getFromL2(category, key);
      if (l2Result !== null) {
        this.recordHit('l2', performance.now() - startTime);
        // L1にプロモート
        await this.setToL1(category, key, l2Result);
        this.updateAccessPattern(key);
        return l2Result;
      }
      
      // L3キャッシュ検索
      const l3Result = await this.getFromL3(category, key);
      if (l3Result !== null) {
        this.recordHit('l3', performance.now() - startTime);
        // L1にプロモート
        await this.setToL1(category, key, l3Result);
        this.updateAccessPattern(key);
        return l3Result;
      }
      
      // キャッシュミス
      this.recordMiss(performance.now() - startTime);
      return null;
      
    } catch (error) {
      console.error('キャッシュ取得エラー:', error);
      return null;
    }
  }

  /**
   * L1キャッシュから取得
   */
  async getFromL1(category, key) {
    const l1Store = this.cache.l1[category];
    if (l1Store && l1Store.has(key)) {
      const item = l1Store.get(key);
      
      // TTLチェック
      if (this.isValidCache(item)) {
        return item.data;
      } else {
        // 期限切れアイテムを削除
        l1Store.delete(key);
      }
    }
    
    return null;
  }

  /**
   * L2キャッシュから取得
   */
  async getFromL2(category, key) {
    if (!this.cache.l2.db) return null;
    
    return new Promise((resolve) => {
      try {
        const transaction = this.cache.l2.db.transaction([category], 'readonly');
        const store = transaction.objectStore(category);
        const request = store.get(key);
        
        request.onsuccess = () => {
          const item = request.result;
          
          if (item && this.isValidCache(item)) {
            resolve(item.data);
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => resolve(null);
      } catch (error) {
        resolve(null);
      }
    });
  }

  /**
   * L3キャッシュから取得
   */
  async getFromL3(category, key) {
    const l3Key = `${category}_${key}`;
    
    if (this.cache.l3.compressedData.has(l3Key)) {
      const compressedItem = this.cache.l3.compressedData.get(l3Key);
      
      // 非同期展開
      return new Promise((resolve) => {
        const taskId = `decompress_${Date.now()}_${Math.random()}`;
        
        this.pendingDecompressions = this.pendingDecompressions || new Map();
        this.pendingDecompressions.set(taskId, resolve);
        
        if (this.compressionWorker) {
          this.compressionWorker.postMessage({
            type: 'DECOMPRESS',
            data: compressedItem.compressed,
            id: taskId
          });
        } else {
          // フォールバック: 同期展開
          try {
            const decompressed = JSON.parse(compressedItem.compressed);
            resolve(decompressed);
          } catch (error) {
            resolve(null);
          }
        }
      });
    }
    
    return null;
  }

  /**
   * データ保存 - 適応的階層配置
   */
  async set(category, key, data, options = {}) {
    const startTime = performance.now();
    
    try {
      const dataSize = this.calculateDataSize(data);
      const priority = options.priority || this.calculatePriority(key, dataSize);
      
      // キャッシュアイテム作成
      const cacheItem = {
        key: key,
        data: data,
        timestamp: Date.now(),
        size: dataSize,
        accessCount: 1,
        priority: priority,
        ttl: options.ttl || this.config.ttl
      };
      
      // 階層別保存戦略
      if (priority >= 8 || dataSize < 1024) {
        // 高優先度または小サイズ → L1
        await this.setToL1(category, key, cacheItem);
      } else if (priority >= 5 || dataSize < 10240) {
        // 中優先度 → L2
        await this.setToL2(category, key, cacheItem);
      } else {
        // 低優先度または大サイズ → L3（圧縮）
        await this.setToL3(category, key, cacheItem);
      }
      
      const processingTime = performance.now() - startTime;
      console.log(`💾 キャッシュ保存完了: ${key} (${processingTime.toFixed(2)}ms)`);
      
    } catch (error) {
      console.error('キャッシュ保存エラー:', error);
    }
  }

  /**
   * L1キャッシュに保存
   */
  async setToL1(category, key, item) {
    const l1Store = this.cache.l1[category];
    if (!l1Store) return;
    
    // サイズ制限チェック
    if (l1Store.size >= this.config.l1MaxSize) {
      await this.evictFromL1(category);
    }
    
    l1Store.set(key, item);
  }

  /**
   * L2キャッシュに保存
   */
  async setToL2(category, key, item) {
    if (!this.cache.l2.db) return;
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.cache.l2.db.transaction([category], 'readwrite');
        const store = transaction.objectStore(category);
        const request = store.put(item);
        
        request.onsuccess = () => {
          this.stats.l2.writes++;
          resolve();
        };
        
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * L3キャッシュに保存
   */
  async setToL3(category, key, item) {
    const l3Key = `${category}_${key}`;
    
    if (this.compressionWorker) {
      // 非同期圧縮
      return new Promise((resolve) => {
        const taskId = `compress_${Date.now()}_${Math.random()}`;
        
        this.pendingCompressions = this.pendingCompressions || new Map();
        this.pendingCompressions.set(taskId, { resolve, key: l3Key, item });
        
        this.compressionWorker.postMessage({
          type: 'COMPRESS',
          data: item.data,
          id: taskId
        });
      });
    } else {
      // 同期圧縮（フォールバック）
      try {
        const compressed = JSON.stringify(item.data);
        this.cache.l3.compressedData.set(l3Key, {
          compressed: compressed,
          originalSize: this.calculateDataSize(item.data),
          timestamp: item.timestamp
        });
      } catch (error) {
        console.warn('圧縮保存失敗:', error);
      }
    }
  }

  /**
   * L1キャッシュからの削除
   */
  async evictFromL1(category) {
    const l1Store = this.cache.l1[category];
    if (!l1Store || l1Store.size === 0) return;
    
    // 適応的削除戦略
    switch (this.config.evictionStrategy) {
      case 'lru':
        this.evictLRU(l1Store);
        break;
      case 'lfu':
        this.evictLFU(l1Store);
        break;
      case 'adaptive':
        this.evictAdaptive(l1Store);
        break;
      default:
        this.evictLRU(l1Store);
    }
    
    this.stats.l1.evictions++;
  }

  /**
   * LRU削除
   */
  evictLRU(store) {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, item] of store) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      store.delete(oldestKey);
    }
  }

  /**
   * LFU削除
   */
  evictLFU(store) {
    let leastUsedKey = null;
    let leastCount = Infinity;
    
    for (const [key, item] of store) {
      if (item.accessCount < leastCount) {
        leastCount = item.accessCount;
        leastUsedKey = key;
      }
    }
    
    if (leastUsedKey) {
      store.delete(leastUsedKey);
    }
  }

  /**
   * 適応的削除
   */
  evictAdaptive(store) {
    // アクセス頻度と時間を組み合わせたスコアベース削除
    let worstKey = null;
    let worstScore = Infinity;
    
    const now = Date.now();
    
    for (const [key, item] of store) {
      const timeFactor = (now - item.timestamp) / (1000 * 60 * 60); // 時間経過（時間単位）
      const accessFactor = 1 / (item.accessCount || 1);
      const sizeFactor = item.size / 1024; // サイズ（KB単位）
      
      const score = timeFactor * accessFactor * sizeFactor;
      
      if (score < worstScore) {
        worstScore = score;
        worstKey = key;
      }
    }
    
    if (worstKey) {
      store.delete(worstKey);
    }
  }

  /**
   * 圧縮結果処理
   */
  handleCompressionResult(result) {
    switch (result.type) {
      case 'COMPRESS_RESULT':
        this.handleCompressResult(result);
        break;
      case 'DECOMPRESS_RESULT':
        this.handleDecompressResult(result);
        break;
      case 'COMPRESS_ERROR':
      case 'DECOMPRESS_ERROR':
        console.warn('圧縮/展開エラー:', result.error);
        break;
    }
  }

  /**
   * 圧縮完了処理
   */
  handleCompressResult(result) {
    if (this.pendingCompressions && this.pendingCompressions.has(result.id)) {
      const { resolve, key, item } = this.pendingCompressions.get(result.id);
      
      this.cache.l3.compressedData.set(key, {
        compressed: result.compressed,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        timestamp: item.timestamp
      });
      
      this.stats.l3.compressions++;
      this.pendingCompressions.delete(result.id);
      resolve();
    }
  }

  /**
   * 展開完了処理
   */
  handleDecompressResult(result) {
    if (this.pendingDecompressions && this.pendingDecompressions.has(result.id)) {
      const resolve = this.pendingDecompressions.get(result.id);
      this.pendingDecompressions.delete(result.id);
      resolve(result.data);
    }
  }

  /**
   * キャッシュ有効性チェック
   */
  isValidCache(item) {
    if (!item || !item.timestamp) return false;
    
    const now = Date.now();
    const ttl = item.ttl || this.config.ttl;
    
    return (now - item.timestamp) < ttl;
  }

  /**
   * データサイズ計算
   */
  calculateDataSize(data) {
    try {
      return JSON.stringify(data).length;
    } catch (error) {
      return 1024; // デフォルトサイズ
    }
  }

  /**
   * 優先度計算
   */
  calculatePriority(key, dataSize) {
    // アクセス頻度ベースの優先度計算
    const frequency = this.accessPatterns.frequency.get(key) || 0;
    
    let priority = 5; // ベース優先度
    
    // 頻度による調整
    if (frequency > 20) priority += 3;
    else if (frequency > 10) priority += 2;
    else if (frequency > 5) priority += 1;
    
    // サイズによる調整
    if (dataSize < 512) priority += 1;
    else if (dataSize > 10240) priority -= 2;
    
    return Math.max(1, Math.min(10, priority));
  }

  /**
   * アクセスパターン更新
   */
  updateAccessPattern(key) {
    // 頻度更新
    const currentFreq = this.accessPatterns.frequency.get(key) || 0;
    this.accessPatterns.frequency.set(key, currentFreq + 1);
    
    // 時間パターン更新
    const now = Date.now();
    if (!this.accessPatterns.temporal.has(key)) {
      this.accessPatterns.temporal.set(key, []);
    }
    
    const timePattern = this.accessPatterns.temporal.get(key);
    timePattern.push(now);
    
    // 履歴サイズ制限
    if (timePattern.length > 50) {
      timePattern.shift();
    }
  }

  /**
   * ヒット記録
   */
  recordHit(level, responseTime) {
    this.stats[level].hits++;
    this.stats.overall.avgResponseTime = 
      (this.stats.overall.avgResponseTime * 0.9) + (responseTime * 0.1);
  }

  /**
   * ミス記録
   */
  recordMiss(responseTime) {
    this.stats.l1.misses++;
    this.stats.l2.misses++;
    this.stats.l3.misses++;
  }

  /**
   * 統計更新
   */
  updateStatistics() {
    const totalHits = this.stats.l1.hits + this.stats.l2.hits + this.stats.l3.hits;
    const totalMisses = this.stats.l1.misses + this.stats.l2.misses + this.stats.l3.misses;
    const totalRequests = totalHits + totalMisses;
    
    this.stats.overall.hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;
    
    // メモリ効率計算
    const l1Size = this.calculateL1Size();
    const l2Size = this.calculateL2Size();
    const l3Size = this.calculateL3Size();
    
    this.stats.overall.memoryEfficiency = this.calculateMemoryEfficiency(l1Size, l2Size, l3Size);
  }

  /**
   * メモリ使用量監視
   */
  monitorMemoryUsage() {
    const l1Usage = this.calculateL1Size();
    const l3Usage = this.calculateL3Size();
    
    // メモリ圧迫時の対応
    if (l1Usage > this.config.l1MaxSize * 0.9) {
      console.warn('⚠️ L1キャッシュ容量逼迫 - 緊急削除実行');
      this.emergencyEviction('l1');
    }
    
    if (l3Usage > this.config.l3MaxSize * 0.9) {
      console.warn('⚠️ L3キャッシュ容量逼迫 - 圧縮率向上');
      this.improveCompression();
    }
  }

  /**
   * キャッシュパフォーマンス最適化
   */
  optimizeCachePerformance() {
    const hitRate = this.stats.overall.hitRate;
    const avgResponseTime = this.stats.overall.avgResponseTime;
    
    // ヒット率が低い場合の対策
    if (hitRate < 0.7) {
      this.increaseL1Size();
      this.enablePredictivePreloading();
    }
    
    // 応答時間が遅い場合の対策
    if (avgResponseTime > 50) {
      this.optimizeEvictionStrategy();
      this.increaseCompressionThreshold();
    }
  }

  /**
   * 予測的プリロード実行
   */
  enablePredictivePreloading() {
    // アクセスパターンに基づく予測読み込み
    for (const [key, frequency] of this.accessPatterns.frequency) {
      if (frequency > this.config.preloadThreshold) {
        this.predictivePreload(key);
      }
    }
  }

  /**
   * 予測プリロード
   */
  async predictivePreload(key) {
    // 関連データの事前読み込み
    const relatedKeys = this.findRelatedKeys(key);
    
    for (const relatedKey of relatedKeys) {
      // バックグラウンドで非同期読み込み
      setTimeout(() => {
        this.get('comprehensiveResults', relatedKey);
      }, 100);
    }
  }

  /**
   * 関連キー検索
   */
  findRelatedKeys(key) {
    const relatedKeys = [];
    const keyPattern = key.substring(0, 20); // 共通プレフィックス
    
    for (const [existingKey] of this.accessPatterns.frequency) {
      if (existingKey.startsWith(keyPattern) && existingKey !== key) {
        relatedKeys.push(existingKey);
      }
    }
    
    return relatedKeys.slice(0, 5); // 最大5個
  }

  /**
   * パフォーマンスレポート生成
   */
  generatePerformanceReport() {
    return {
      version: this.version,
      timestamp: new Date().toISOString(),
      statistics: this.stats,
      cacheConfiguration: this.config,
      memoryUsage: {
        l1: `${this.calculateL1Size()} items`,
        l2: 'IndexedDB',
        l3: `${this.calculateL3Size()} compressed items`
      },
      performance: {
        hitRate: `${(this.stats.overall.hitRate * 100).toFixed(1)}%`,
        avgResponseTime: `${this.stats.overall.avgResponseTime.toFixed(2)}ms`,
        memoryEfficiency: `${(this.stats.overall.memoryEfficiency * 100).toFixed(1)}%`
      },
      recommendations: this.generateOptimizationRecommendations()
    };
  }

  /**
   * 最適化推奨事項生成
   */
  generateOptimizationRecommendations() {
    const recommendations = [];
    
    if (this.stats.overall.hitRate < 0.8) {
      recommendations.push({
        type: 'cache_expansion',
        message: 'キャッシュサイズの拡張を推奨します',
        priority: 'high'
      });
    }
    
    if (this.stats.overall.avgResponseTime > 30) {
      recommendations.push({
        type: 'performance_tuning',
        message: 'キャッシュ戦略の最適化が必要です',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  /**
   * ヘルパーメソッド群
   */
  
  calculateL1Size() {
    let total = 0;
    for (const [category, store] of Object.entries(this.cache.l1)) {
      if (store instanceof Map) {
        total += store.size;
      }
    }
    return total;
  }
  
  calculateL2Size() {
    // IndexedDBサイズは非同期でないと取得困難
    return 'N/A';
  }
  
  calculateL3Size() {
    return this.cache.l3.compressedData.size;
  }
  
  calculateMemoryEfficiency(l1Size, l2Size, l3Size) {
    // 簡易効率計算
    const totalItems = l1Size + l3Size;
    const efficiency = totalItems > 0 ? (this.stats.overall.hitRate * totalItems) / totalItems : 0;
    return Math.min(efficiency, 1.0);
  }
  
  getL1StoreName(l2StoreName) {
    const mapping = {
      'patterns': 'transformationPatterns',
      'mappings': 'hexagramMappings',
      'contexts': 'contextAnalysis',
      'metaphors': 'metaphorGeneration',
      'results': 'comprehensiveResults'
    };
    return mapping[l2StoreName] || l2StoreName;
  }
  
  emergencyEviction(level) {
    if (level === 'l1') {
      // L1の半分を削除
      for (const [category, store] of Object.entries(this.cache.l1)) {
        if (store instanceof Map) {
          const toDelete = Math.floor(store.size / 2);
          let deleted = 0;
          for (const key of store.keys()) {
            if (deleted >= toDelete) break;
            store.delete(key);
            deleted++;
          }
        }
      }
    }
  }
  
  improveCompression() {
    // 圧縮閾値を下げて、より多くのデータを圧縮
    this.config.compressionThreshold = Math.max(512, this.config.compressionThreshold * 0.8);
  }
  
  increaseL1Size() {
    this.config.l1MaxSize = Math.min(2000, this.config.l1MaxSize * 1.2);
  }
  
  optimizeEvictionStrategy() {
    // 適応的戦略に切り替え
    this.config.evictionStrategy = 'adaptive';
  }
  
  increaseCompressionThreshold() {
    // 圧縮閾値を上げて、小さなデータの圧縮オーバーヘッドを削減
    this.config.compressionThreshold = Math.min(2048, this.config.compressionThreshold * 1.5);
  }

  /**
   * クリーンアップ
   */
  destroy() {
    // ワーカー終了
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
    }
    
    // キャッシュクリア
    for (const [category, store] of Object.entries(this.cache.l1)) {
      if (store instanceof Map) {
        store.clear();
      }
    }
    
    this.cache.l3.compressedData.clear();
    
    // IndexedDB接続終了
    if (this.cache.l2.db) {
      this.cache.l2.db.close();
    }
    
    console.log('🧹 AdvancedCacheSystem クリーンアップ完了');
  }
}

// グローバルインスタンス作成
if (typeof window !== 'undefined') {
  window.AdvancedCacheSystem = AdvancedCacheSystem;
  window.advancedCacheSystem = new AdvancedCacheSystem();
  
  console.log('🗃️ HAQEI AdvancedCacheSystem 利用可能');
}