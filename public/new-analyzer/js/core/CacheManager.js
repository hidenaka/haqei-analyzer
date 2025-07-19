// CacheManager.js - キャッシュ管理システム
// HaQei Analyzer - Cache Management System

class CacheManager {
    constructor(options = {}) {
        this.options = {
            defaultTTL: 30 * 60 * 1000, // 30分
            maxSize: 50 * 1024 * 1024, // 50MB
            maxEntries: 1000,
            enableCompression: true,
            enableEncryption: false,
            storageType: 'memory', // 'memory', 'localStorage', 'indexedDB'
            keyPrefix: 'haqei_cache_',
            autoCleanup: true,
            cleanupInterval: 10 * 60 * 1000, // 10分
            enableMetrics: true,
            ...options
        };
        
        this.memoryCache = new Map();
        this.cacheMetrics = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            evictions: 0,
            totalSize: 0
        };
        
        this.compressionWorker = null;
        this.cleanupInterval = null;
        
        this.initialize();
    }

    /**
     * 初期化
     */
    async initialize() {
        try {
            // 圧縮ワーカーの初期化
            if (this.options.enableCompression) {
                await this.initializeCompressionWorker();
            }
            
            // IndexedDBの初期化
            if (this.options.storageType === 'indexedDB') {
                await this.initializeIndexedDB();
            }
            
            // 自動クリーンアップの開始
            if (this.options.autoCleanup) {
                this.startAutoCleanup();
            }
            
            // 既存キャッシュの復元
            await this.restoreCache();
            
            console.log("✅ CacheManager initialized");
            
        } catch (error) {
            console.error("❌ Failed to initialize CacheManager:", error);
        }
    }

    /**
     * 圧縮ワーカーを初期化
     */
    async initializeCompressionWorker() {
        try {
            // Web Worker用のスクリプトを作成
            const workerScript = `
                // LZ-string like compression
                function compress(str) {
                    return btoa(unescape(encodeURIComponent(str)));
                }
                
                function decompress(str) {
                    return decodeURIComponent(escape(atob(str)));
                }
                
                self.onmessage = function(e) {
                    const { action, data, id } = e.data;
                    
                    try {
                        let result;
                        if (action === 'compress') {
                            result = compress(data);
                        } else if (action === 'decompress') {
                            result = decompress(data);
                        }
                        
                        self.postMessage({ id, result, success: true });
                    } catch (error) {
                        self.postMessage({ id, error: error.message, success: false });
                    }
                };
            `;
            
            const blob = new Blob([workerScript], { type: 'application/javascript' });
            this.compressionWorker = new Worker(URL.createObjectURL(blob));
            
        } catch (error) {
            console.warn("⚠️ Failed to initialize compression worker:", error);
            this.options.enableCompression = false;
        }
    }

    /**
     * IndexedDBを初期化
     */
    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('HaQeiCache', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.indexedDB = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('cache')) {
                    const store = db.createObjectStore('cache', { keyPath: 'key' });
                    store.createIndex('expiry', 'expiry', { unique: false });
                    store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                }
            };
        });
    }

    /**
     * 値をキャッシュに設定
     * @param {string} key - キー
     * @param {any} value - 値
     * @param {number} ttl - TTL（ミリ秒）
     * @param {Object} options - オプション
     */
    async set(key, value, ttl = null, options = {}) {
        try {
            const finalTTL = ttl || this.options.defaultTTL;
            const expiry = Date.now() + finalTTL;
            
            // 値をシリアライズ
            let serializedValue = JSON.stringify(value);
            
            // 圧縮
            if (this.options.enableCompression && serializedValue.length > 1024) {
                serializedValue = await this.compress(serializedValue);
                options.compressed = true;
            }
            
            // 暗号化
            if (this.options.enableEncryption) {
                serializedValue = this.encrypt(serializedValue);
                options.encrypted = true;
            }
            
            const cacheEntry = {
                key: key,
                value: serializedValue,
                expiry: expiry,
                size: serializedValue.length,
                lastAccessed: Date.now(),
                accessCount: 0,
                metadata: options
            };
            
            // サイズチェック
            if (cacheEntry.size > this.options.maxSize / 10) {
                throw new Error('Entry too large for cache');
            }
            
            // 容量チェックとクリーンアップ
            await this.ensureCapacity(cacheEntry.size);
            
            // ストレージに保存
            await this.storeEntry(key, cacheEntry);
            
            // メトリクス更新
            this.updateMetrics('set', cacheEntry.size);
            
            console.log(`💾 Cached: ${key} (${cacheEntry.size} bytes, TTL: ${finalTTL}ms)`);
            
        } catch (error) {
            console.error(`❌ Failed to cache ${key}:`, error);
            throw error;
        }
    }

    /**
     * キャッシュから値を取得
     * @param {string} key - キー
     * @returns {any} キャッシュされた値またはnull
     */
    async get(key) {
        try {
            const entry = await this.getEntry(key);
            
            if (!entry) {
                this.updateMetrics('miss');
                return null;
            }
            
            // 有効期限チェック
            if (entry.expiry < Date.now()) {
                await this.delete(key);
                this.updateMetrics('miss');
                return null;
            }
            
            // アクセス情報更新
            entry.lastAccessed = Date.now();
            entry.accessCount++;
            await this.storeEntry(key, entry);
            
            // 値をデシリアライズ
            let value = entry.value;
            
            // 復号化
            if (entry.metadata.encrypted) {
                value = this.decrypt(value);
            }
            
            // 解凍
            if (entry.metadata.compressed) {
                value = await this.decompress(value);
            }
            
            const deserializedValue = JSON.parse(value);
            
            this.updateMetrics('hit');
            return deserializedValue;
            
        } catch (error) {
            console.error(`❌ Failed to get ${key} from cache:`, error);
            this.updateMetrics('miss');
            return null;
        }
    }

    /**
     * キャッシュから削除
     * @param {string} key - キー
     */
    async delete(key) {
        try {
            const entry = await this.getEntry(key);
            
            if (entry) {
                await this.removeEntry(key);
                this.updateMetrics('delete', -entry.size);
            }
            
        } catch (error) {
            console.error(`❌ Failed to delete ${key} from cache:`, error);
        }
    }

    /**
     * キャッシュをクリア
     */
    async clear() {
        try {
            switch (this.options.storageType) {
                case 'memory':
                    this.memoryCache.clear();
                    break;
                    
                case 'localStorage':
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(this.options.keyPrefix)) {
                            localStorage.removeItem(key);
                        }
                    });
                    break;
                    
                case 'indexedDB':
                    if (this.indexedDB) {
                        const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
                        const store = transaction.objectStore('cache');
                        await new Promise((resolve, reject) => {
                            const request = store.clear();
                            request.onsuccess = () => resolve();
                            request.onerror = () => reject(request.error);
                        });
                    }
                    break;
            }
            
            this.resetMetrics();
            console.log("🗑️ Cache cleared");
            
        } catch (error) {
            console.error("❌ Failed to clear cache:", error);
        }
    }

    /**
     * キャッシュ統計を取得
     */
    getStats() {
        const hitRate = this.cacheMetrics.hits + this.cacheMetrics.misses > 0 ? 
            this.cacheMetrics.hits / (this.cacheMetrics.hits + this.cacheMetrics.misses) : 0;
        
        return {
            ...this.cacheMetrics,
            hitRate: Math.round(hitRate * 100),
            totalSizeMB: Math.round(this.cacheMetrics.totalSize / 1024 / 1024 * 100) / 100,
            entryCount: this.getEntryCount()
        };
    }

    /**
     * 期限切れエントリをクリーンアップ
     */
    async cleanup() {
        try {
            const now = Date.now();
            let cleanedCount = 0;
            let cleanedSize = 0;
            
            switch (this.options.storageType) {
                case 'memory':
                    for (const [key, entry] of this.memoryCache) {
                        if (entry.expiry < now) {
                            this.memoryCache.delete(key);
                            cleanedCount++;
                            cleanedSize += entry.size;
                        }
                    }
                    break;
                    
                case 'localStorage':
                    Object.keys(localStorage).forEach(storageKey => {
                        if (storageKey.startsWith(this.options.keyPrefix)) {
                            try {
                                const entry = JSON.parse(localStorage.getItem(storageKey));
                                if (entry.expiry < now) {
                                    localStorage.removeItem(storageKey);
                                    cleanedCount++;
                                    cleanedSize += entry.size;
                                }
                            } catch (error) {
                                // 破損エントリを削除
                                localStorage.removeItem(storageKey);
                                cleanedCount++;
                            }
                        }
                    });
                    break;
                    
                case 'indexedDB':
                    if (this.indexedDB) {
                        const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
                        const store = transaction.objectStore('cache');
                        const index = store.index('expiry');
                        const range = IDBKeyRange.upperBound(now);
                        
                        const request = index.openCursor(range);
                        request.onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                cleanedCount++;
                                cleanedSize += cursor.value.size;
                                cursor.delete();
                                cursor.continue();
                            }
                        };
                    }
                    break;
            }
            
            this.updateMetrics('eviction', -cleanedSize);
            this.cacheMetrics.evictions += cleanedCount;
            
            if (cleanedCount > 0) {
                console.log(`🧹 Cleaned up ${cleanedCount} expired entries (${cleanedSize} bytes)`);
            }
            
        } catch (error) {
            console.error("❌ Failed to cleanup cache:", error);
        }
    }

    /**
     * LRU（Least Recently Used）に基づく退避
     */
    async evictLRU(requiredSize) {
        try {
            const entries = await this.getAllEntries();
            
            // 最後のアクセス時間でソート
            entries.sort((a, b) => a.lastAccessed - b.lastAccessed);
            
            let evictedSize = 0;
            let evictedCount = 0;
            
            for (const entry of entries) {
                if (evictedSize >= requiredSize) break;
                
                await this.removeEntry(entry.key);
                evictedSize += entry.size;
                evictedCount++;
            }
            
            this.updateMetrics('eviction', -evictedSize);
            this.cacheMetrics.evictions += evictedCount;
            
            console.log(`📤 Evicted ${evictedCount} LRU entries (${evictedSize} bytes)`);
            
        } catch (error) {
            console.error("❌ Failed to evict LRU entries:", error);
        }
    }

    /**
     * 容量を確保
     */
    async ensureCapacity(requiredSize) {
        const currentSize = this.cacheMetrics.totalSize;
        const entryCount = this.getEntryCount();
        
        // サイズ制限チェック
        if (currentSize + requiredSize > this.options.maxSize) {
            const targetEvictSize = currentSize + requiredSize - this.options.maxSize + (this.options.maxSize * 0.1);
            await this.evictLRU(targetEvictSize);
        }
        
        // エントリ数制限チェック
        if (entryCount >= this.options.maxEntries) {
            const targetEvictCount = entryCount - this.options.maxEntries + Math.floor(this.options.maxEntries * 0.1);
            await this.evictLRU(targetEvictCount * 1024); // 概算
        }
    }

    /**
     * 圧縮
     */
    async compress(data) {
        if (!this.compressionWorker) {
            // フォールバック: 簡易圧縮
            return btoa(unescape(encodeURIComponent(data)));
        }
        
        return new Promise((resolve, reject) => {
            const id = Math.random().toString(36);
            
            const handleMessage = (event) => {
                if (event.data.id === id) {
                    this.compressionWorker.removeEventListener('message', handleMessage);
                    
                    if (event.data.success) {
                        resolve(event.data.result);
                    } else {
                        reject(new Error(event.data.error));
                    }
                }
            };
            
            this.compressionWorker.addEventListener('message', handleMessage);
            this.compressionWorker.postMessage({ action: 'compress', data, id });
        });
    }

    /**
     * 解凍
     */
    async decompress(data) {
        if (!this.compressionWorker) {
            // フォールバック: 簡易解凍
            return decodeURIComponent(escape(atob(data)));
        }
        
        return new Promise((resolve, reject) => {
            const id = Math.random().toString(36);
            
            const handleMessage = (event) => {
                if (event.data.id === id) {
                    this.compressionWorker.removeEventListener('message', handleMessage);
                    
                    if (event.data.success) {
                        resolve(event.data.result);
                    } else {
                        reject(new Error(event.data.error));
                    }
                }
            };
            
            this.compressionWorker.addEventListener('message', handleMessage);
            this.compressionWorker.postMessage({ action: 'decompress', data, id });
        });
    }

    /**
     * 暗号化（簡易実装）
     */
    encrypt(data) {
        // 実際の実装では適切な暗号化ライブラリを使用
        return btoa(data);
    }

    /**
     * 復号化（簡易実装）
     */
    decrypt(data) {
        return atob(data);
    }

    /**
     * エントリを保存
     */
    async storeEntry(key, entry) {
        switch (this.options.storageType) {
            case 'memory':
                this.memoryCache.set(key, entry);
                break;
                
            case 'localStorage':
                localStorage.setItem(
                    this.options.keyPrefix + key, 
                    JSON.stringify(entry)
                );
                break;
                
            case 'indexedDB':
                if (this.indexedDB) {
                    const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
                    const store = transaction.objectStore('cache');
                    
                    await new Promise((resolve, reject) => {
                        const request = store.put(entry);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
                break;
        }
    }

    /**
     * エントリを取得
     */
    async getEntry(key) {
        switch (this.options.storageType) {
            case 'memory':
                return this.memoryCache.get(key) || null;
                
            case 'localStorage':
                const data = localStorage.getItem(this.options.keyPrefix + key);
                return data ? JSON.parse(data) : null;
                
            case 'indexedDB':
                if (this.indexedDB) {
                    const transaction = this.indexedDB.transaction(['cache'], 'readonly');
                    const store = transaction.objectStore('cache');
                    
                    return new Promise((resolve, reject) => {
                        const request = store.get(key);
                        request.onsuccess = () => resolve(request.result || null);
                        request.onerror = () => reject(request.error);
                    });
                }
                return null;
        }
    }

    /**
     * エントリを削除
     */
    async removeEntry(key) {
        switch (this.options.storageType) {
            case 'memory':
                this.memoryCache.delete(key);
                break;
                
            case 'localStorage':
                localStorage.removeItem(this.options.keyPrefix + key);
                break;
                
            case 'indexedDB':
                if (this.indexedDB) {
                    const transaction = this.indexedDB.transaction(['cache'], 'readwrite');
                    const store = transaction.objectStore('cache');
                    
                    await new Promise((resolve, reject) => {
                        const request = store.delete(key);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                }
                break;
        }
    }

    /**
     * 全エントリを取得
     */
    async getAllEntries() {
        switch (this.options.storageType) {
            case 'memory':
                return Array.from(this.memoryCache.values());
                
            case 'localStorage':
                const entries = [];
                Object.keys(localStorage).forEach(storageKey => {
                    if (storageKey.startsWith(this.options.keyPrefix)) {
                        try {
                            const entry = JSON.parse(localStorage.getItem(storageKey));
                            entries.push(entry);
                        } catch (error) {
                            // スキップ
                        }
                    }
                });
                return entries;
                
            case 'indexedDB':
                if (this.indexedDB) {
                    const transaction = this.indexedDB.transaction(['cache'], 'readonly');
                    const store = transaction.objectStore('cache');
                    
                    return new Promise((resolve, reject) => {
                        const request = store.getAll();
                        request.onsuccess = () => resolve(request.result || []);
                        request.onerror = () => reject(request.error);
                    });
                }
                return [];
        }
    }

    /**
     * エントリ数を取得
     */
    getEntryCount() {
        switch (this.options.storageType) {
            case 'memory':
                return this.memoryCache.size;
                
            case 'localStorage':
                return Object.keys(localStorage).filter(key => 
                    key.startsWith(this.options.keyPrefix)
                ).length;
                
            case 'indexedDB':
                // 非同期なので概算値を返す
                return this.cacheMetrics.sets - this.cacheMetrics.deletes;
        }
    }

    /**
     * メトリクスを更新
     */
    updateMetrics(action, sizeChange = 0) {
        if (!this.options.enableMetrics) return;
        
        switch (action) {
            case 'hit':
                this.cacheMetrics.hits++;
                break;
            case 'miss':
                this.cacheMetrics.misses++;
                break;
            case 'set':
                this.cacheMetrics.sets++;
                this.cacheMetrics.totalSize += sizeChange;
                break;
            case 'delete':
                this.cacheMetrics.deletes++;
                this.cacheMetrics.totalSize += sizeChange;
                break;
            case 'eviction':
                this.cacheMetrics.totalSize += sizeChange;
                break;
        }
        
        // 負の値を防ぐ
        this.cacheMetrics.totalSize = Math.max(0, this.cacheMetrics.totalSize);
    }

    /**
     * メトリクスをリセット
     */
    resetMetrics() {
        this.cacheMetrics = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            evictions: 0,
            totalSize: 0
        };
    }

    /**
     * 既存キャッシュを復元
     */
    async restoreCache() {
        try {
            const entries = await this.getAllEntries();
            let restoredSize = 0;
            
            entries.forEach(entry => {
                restoredSize += entry.size || 0;
            });
            
            this.cacheMetrics.totalSize = restoredSize;
            
            if (entries.length > 0) {
                console.log(`🔄 Restored ${entries.length} cache entries (${restoredSize} bytes)`);
            }
            
        } catch (error) {
            console.error("❌ Failed to restore cache:", error);
        }
    }

    /**
     * 自動クリーンアップを開始
     */
    startAutoCleanup() {
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.options.cleanupInterval);
    }

    /**
     * システム破棄
     */
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        
        if (this.compressionWorker) {
            this.compressionWorker.terminate();
        }
        
        if (this.indexedDB) {
            this.indexedDB.close();
        }
        
        this.memoryCache.clear();
        
        console.log("💾 CacheManager destroyed");
    }
}

export default CacheManager;