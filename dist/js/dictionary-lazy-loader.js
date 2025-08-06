/**
 * Dictionary Lazy Loader for HAQEI Analyzer
 * 辞書ファイルの遅延読み込みとキャッシュ最適化
 * 目標: 初期ロード時の辞書ファイル除外、必要時のみロード
 */

class DictionaryLazyLoader {
  constructor() {
    this.loadedDictionaries = new Map();
    this.loadingPromises = new Map();
    this.compressionSupport = this._checkCompressionSupport();
    this.cachePrefix = 'haqei-dict-';
    this.cacheVersion = '1.0.0';
  }

  /**
   * 辞書ファイルの遅延ロード
   * @param {string} dictType - 辞書タイプ ('base', 'check', 'tid' etc.)
   * @param {Object} options - ロードオプション
   * @returns {Promise<ArrayBuffer>} 辞書データ
   */
  async loadDictionary(dictType, options = {}) {
    const {
      useCache = true,
      timeout = 15000,
      retryCount = 2,
      priority = 'normal' // 'high', 'normal', 'low'
    } = options;

    // キャッシュから確認
    if (useCache && this.loadedDictionaries.has(dictType)) {
      console.log(`📚 Dictionary loaded from memory cache: ${dictType}`);
      return this.loadedDictionaries.get(dictType);
    }

    // 既にロード中の場合
    if (this.loadingPromises.has(dictType)) {
      console.log(`⏳ Dictionary loading in progress: ${dictType}`);
      return this.loadingPromises.get(dictType);
    }

    // IndexedDB キャッシュから確認
    if (useCache) {
      try {
        const cachedData = await this._loadFromIndexedDB(dictType);
        if (cachedData) {
          this.loadedDictionaries.set(dictType, cachedData);
          console.log(`💾 Dictionary loaded from IndexedDB: ${dictType}`);
          return cachedData;
        }
      } catch (error) {
        console.warn(`IndexedDB cache miss for ${dictType}:`, error);
      }
    }

    // 新規ダウンロード
    const loadPromise = this._downloadAndCacheDictionary(dictType, { timeout, retryCount, priority });
    this.loadingPromises.set(dictType, loadPromise);

    try {
      const data = await loadPromise;
      this.loadedDictionaries.set(dictType, data);
      this.loadingPromises.delete(dictType);
      
      // IndexedDBにキャッシュ
      if (useCache) {
        this._saveToIndexedDB(dictType, data).catch(console.warn);
      }
      
      return data;
    } catch (error) {
      this.loadingPromises.delete(dictType);
      throw error;
    }
  }

  /**
   * 複数辞書の並列ロード
   * @param {Array<string>} dictTypes - ロードする辞書タイプ配列
   * @param {Object} options - ロードオプション
   * @returns {Promise<Map>} ロード結果のMap
   */
  async loadMultipleDictionaries(dictTypes, options = {}) {
    const { concurrency = 3 } = options;
    
    // 同時実行数制限付きの並列ロード
    const results = new Map();
    const chunks = this._chunkArray(dictTypes, concurrency);
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async dictType => {
        try {
          const data = await this.loadDictionary(dictType, options);
          return { dictType, data, success: true };
        } catch (error) {
          console.error(`Failed to load dictionary ${dictType}:`, error);
          return { dictType, error, success: false };
        }
      });
      
      const chunkResults = await Promise.all(chunkPromises);
      chunkResults.forEach(result => {
        if (result.success) {
          results.set(result.dictType, result.data);
        }
      });
    }
    
    console.log(`📚 Loaded ${results.size}/${dictTypes.length} dictionaries`);
    return results;
  }

  /**
   * プリロード機能（バックグラウンドでロード）
   * @param {Array<string>} dictTypes - プリロード対象
   */
  async preloadDictionaries(dictTypes) {
    console.log(`🚀 Starting preload for ${dictTypes.length} dictionaries`);
    
    // 優先度低でバックグラウンドロード
    const preloadPromises = dictTypes.map(dictType =>
      this.loadDictionary(dictType, { priority: 'low' })
        .catch(error => {
          console.warn(`Preload failed for ${dictType}:`, error);
          return null;
        })
    );

    // 結果を待たずに即座にreturn（バックグラウンド実行）
    Promise.all(preloadPromises).then(results => {
      const successCount = results.filter(r => r !== null).length;
      console.log(`✅ Preload completed: ${successCount}/${dictTypes.length}`);
    });
  }

  /**
   * メモリクリーンアップ
   * @param {Array<string>} keepDictionaries - 保持する辞書
   */
  cleanup(keepDictionaries = []) {
    const before = this.loadedDictionaries.size;
    
    for (const [dictType] of this.loadedDictionaries) {
      if (!keepDictionaries.includes(dictType)) {
        this.loadedDictionaries.delete(dictType);
      }
    }
    
    const after = this.loadedDictionaries.size;
    const cleaned = before - after;
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} dictionaries from memory`);
    }

    // Garbage collection hint
    if (window.gc) {
      window.gc();
    }
  }

  /**
   * 使用統計取得
   * @returns {Object} 統計情報
   */
  getStats() {
    const totalSize = Array.from(this.loadedDictionaries.values())
      .reduce((sum, data) => sum + data.byteLength, 0);

    return {
      loadedCount: this.loadedDictionaries.size,
      loadingCount: this.loadingPromises.size,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      loadedDictionaries: Array.from(this.loadedDictionaries.keys()),
      memoryUsage: this._getMemoryUsage()
    };
  }

  // Private methods
  async _downloadAndCacheDictionary(dictType, options) {
    const { timeout, retryCount, priority } = options;
    
    const dictConfig = this._getDictionaryConfig(dictType);
    if (!dictConfig) {
      throw new Error(`Unknown dictionary type: ${dictType}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // 優先度に基づくfetch設定
      const fetchOptions = {
        signal: controller.signal,
        headers: {
          'Accept-Encoding': this.compressionSupport.join(', ')
        }
      };

      if (priority === 'low') {
        fetchOptions.priority = 'low'; // Fetch Priority API
      }

      const response = await fetch(dictConfig.url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.arrayBuffer();
      
      console.log(`📥 Downloaded dictionary: ${dictType} (${this._formatBytes(data.byteLength)})`);
      
      // 解凍が必要な場合
      if (dictConfig.compressed && this.compressionSupport.includes('gzip')) {
        return this._decompressData(data);
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retryCount > 0) {
        console.warn(`Retrying download for ${dictType}... (${retryCount} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
        return this._downloadAndCacheDictionary(dictType, { 
          ...options, 
          retryCount: retryCount - 1 
        });
      }
      
      throw new Error(`Failed to download dictionary ${dictType}: ${error.message}`);
    }
  }

  _getDictionaryConfig(dictType) {
    const configs = {
      'base': {
        url: './dict/base.dat.gz',
        size: 1500000, // 約1.5MB
        compressed: true,
        essential: false
      },
      'check': {
        url: './dict/check.dat.gz',
        size: 850000, // 約850KB
        compressed: true,
        essential: false
      },
      'tid': {
        url: './dict/tid.dat.gz',
        size: 1200000, // 約1.2MB
        compressed: true,
        essential: false
      },
      'tid_map': {
        url: './dict/tid_map.dat.gz',
        size: 45000, // 約45KB
        compressed: true,
        essential: true
      },
      'tid_pos': {
        url: './dict/tid_pos.dat.gz',
        size: 65000, // 約65KB
        compressed: true,
        essential: true
      },
      'unk': {
        url: './dict/unk.dat.gz',
        size: 12000, // 約12KB
        compressed: true,
        essential: true
      }
    };

    return configs[dictType];
  }

  async _loadFromIndexedDB(dictType) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('haqei-dict-cache', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('dictionaries')) {
          db.createObjectStore('dictionaries', { keyPath: 'type' });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('dictionaries', 'readonly');
        const store = transaction.objectStore('dictionaries');
        const getRequest = store.get(dictType);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result && result.version === this.cacheVersion) {
            resolve(result.data);
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }

  async _saveToIndexedDB(dictType, data) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('haqei-dict-cache', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('dictionaries', 'readwrite');
        const store = transaction.objectStore('dictionaries');
        
        const record = {
          type: dictType,
          data: data,
          version: this.cacheVersion,
          timestamp: Date.now()
        };
        
        const putRequest = store.put(record);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  _checkCompressionSupport() {
    const supported = [];
    
    // gzip サポート確認
    if (typeof CompressionStream !== 'undefined') {
      supported.push('gzip');
    }
    
    // brotli サポート確認
    if (typeof CompressionStream !== 'undefined') {
      supported.push('br');
    }
    
    return supported.length > 0 ? supported : ['identity'];
  }

  _decompressData(data) {
    // 実際の解凍実装はライブラリに依存
    // ここではプレースホルダー
    console.log('🗜️ Decompressing dictionary data...');
    return data;
  }

  _chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  _formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  _getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }
}

// グローバルインスタンス
window.dictionaryLoader = window.dictionaryLoader || new DictionaryLazyLoader();

// 使用例
const loader = window.dictionaryLoader;

// 必要な辞書のみ遅延ロード
export default DictionaryLazyLoader;