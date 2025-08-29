/**
 * 384爻データサービス
 * D1データベースアクセスとキャッシュ管理
 * Edge制約対応の軽量実装
 */

class DataService384 {
    constructor() {
        // メモリキャッシュ (L1)
        this.memoryCache = new Map();
        
        // API設定
        this.apiEndpoint = '/api/384-lines';
        this.fallbackDataPath = './data/koudo_shishin.json';
        
        // キャッシュ設定
        this.cacheExpiry = 3600000; // 1時間
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1秒
        
        // 初期化フラグ
        this.initialized = false;
        this.initPromise = null;
    }
    
    /**
     * 初期化処理
     */
    async initialize() {
        if (this.initialized) return true;
        if (this.initPromise) return this.initPromise;
        
        this.initPromise = this._performInitialization();
        return this.initPromise;
    }
    
    async _performInitialization() {
        try {
            console.log('🔄 DataService384 初期化開始...');
            
            // LocalStorageからキャッシュを復元
        this._restoreFromLocalStorage();
            
            // バックグラウンドでデータをプリフェッチ
            this._prefetchData();
            
            this.initialized = true;
            console.log('✅ DataService384 初期化完了');
            return true;
            
        } catch (error) {
            console.error('❌ DataService384 初期化エラー:', error);
            this.initialized = false;
            return false;
        }
    }
    
    /**
     * 384爻データ取得
     */
    async fetchLines(options = {}) {
        const cacheKey = 'lines_all';
        
        // L1: メモリキャッシュチェック
        const memoryCached = this._getFromMemoryCache(cacheKey);
        if (memoryCached) {
            console.log('💾 Memory cache hit');
            return memoryCached;
        }
        
        // L2: LocalStorageキャッシュチェック
        const localCached = this._getFromLocalStorage(cacheKey);
        if (localCached) {
            console.log('📦 LocalStorage cache hit');
            this._setMemoryCache(cacheKey, localCached);
            return localCached;
        }
        
        // L3: API呼び出し
        try {
            const data = await this._fetchFromAPI('koudo', options);
            this._setCaches(cacheKey, data.lines);
            return data.lines;
            
        } catch (error) {
            console.error('❌ API fetch failed:', error);
            
            // L4: フォールバック
            return this._loadFallbackData();
        }
    }
    
    /**
     * 卦データ取得
     */
    async fetchHexagrams() {
        const cacheKey = 'hexagrams_all';
        
        // キャッシュチェック
        const cached = this._getFromMemoryCache(cacheKey);
        if (cached) return cached;
        
        try {
            const data = await this._fetchFromAPI('hexagrams');
            this._setCaches(cacheKey, data.hexagrams);
            return data.hexagrams;
            
        } catch (error) {
            console.error('❌ Hexagrams fetch failed:', error);
            return [];
        }
    }
    
    /**
     * 爻辞データ取得
     */
    async fetchYaoci() {
        const cacheKey = 'yaoci_all';
        
        // キャッシュチェック
        const cached = this._getFromMemoryCache(cacheKey);
        if (cached) return cached;
        
        try {
            const data = await this._fetchFromAPI('yaoci');
            this._setCaches(cacheKey, data.yaoci);
            return data.yaoci;
            
        } catch (error) {
            console.error('❌ Yaoci fetch failed:', error);
            return [];
        }
    }
    
    /**
     * 特定の爻を検索
     */
    async searchLine(query) {
        const lines = await this.fetchLines();
        
        if (!lines || lines.length === 0) {
            return null;
        }
        
        // テキスト検索
        const lowerQuery = query.toLowerCase();
        return lines.find(line => 
            line.title?.toLowerCase().includes(lowerQuery) ||
            line.description?.toLowerCase().includes(lowerQuery) ||
            line.category?.toLowerCase().includes(lowerQuery)
        );
    }
    
    /**
     * IDで爻を取得
     */
    async getLineById(id) {
        const lines = await this.fetchLines();
        return lines?.find(line => line.shishin_id === id);
    }
    
    // ================ Private Methods ================
    
    /**
     * APIからデータ取得
     */
    async _fetchFromAPI(type = 'all', options = {}) {
        const url = new URL(this.apiEndpoint, window.location.origin);
        url.searchParams.set('type', type);
        
        if (options.limit) {
            url.searchParams.set('limit', options.limit);
        }
        
        let retries = 0;
        
        while (retries < this.maxRetries) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Edge環境での高速化
                    cache: 'force-cache',
                    signal: AbortSignal.timeout(5000) // 5秒タイムアウト
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const json = await response.json();
                
                if (!json.success) {
                    throw new Error(json.error || 'API returned unsuccessful');
                }
                
                return json.data;
                
            } catch (error) {
                retries++;
                console.warn(`⚠️ API retry ${retries}/${this.maxRetries}:`, error.message);
                
                if (retries < this.maxRetries) {
                    await this._delay(this.retryDelay * retries);
                } else {
                    throw error;
                }
            }
        }
    }
    
    /**
     * フォールバックデータ読み込み
     */
    async _loadFallbackData() {
        console.log('📂 Loading fallback data...');
        
        try {
            const response = await fetch(this.fallbackDataPath);
            if (!response.ok) {
                throw new Error('Fallback data not found');
            }
            
            const data = await response.json();
            console.log('✅ Fallback data loaded:', data.length, 'items');
            
            // フォールバックデータもキャッシュする
            this._setCaches('lines_all', data);
            
            return data;
            
        } catch (error) {
            console.error('❌ Fallback load failed:', error);
            return [];
        }
    }
    
    /**
     * メモリキャッシュ取得
     */
    _getFromMemoryCache(key) {
        if (!this.memoryCache.has(key)) return null;
        
        const cached = this.memoryCache.get(key);
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.memoryCache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    /**
     * メモリキャッシュ設定
     */
    _setMemoryCache(key, data) {
        this.memoryCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    /**
     * LocalStorage取得
     */
    _getFromLocalStorage(key) {
        try {
            const stored = localStorage.getItem(`384_${key}`);
            if (!stored) return null;
            
            const parsed = JSON.parse(stored);
            if (Date.now() - parsed.timestamp > this.cacheExpiry) {
                localStorage.removeItem(`384_${key}`);
                return null;
            }
            
            return parsed.data;
        } catch (error) {
            console.warn('LocalStorage read error:', error);
            return null;
        }
    }
    
    /**
     * LocalStorage設定
     */
    _setToLocalStorage(key, data) {
        try {
            const value = JSON.stringify({
                data,
                timestamp: Date.now()
            });
            localStorage.setItem(`384_${key}`, value);
        } catch (error) {
            console.warn('LocalStorage write error:', error);
            // 容量超過時は古いデータを削除
            if (error.name === 'QuotaExceededError') {
                this._cleanupLocalStorage();
                // リトライ
                try {
                    localStorage.setItem(`384_${key}`, value);
                } catch (retryError) {
                    console.error('LocalStorage retry failed:', retryError);
                }
            }
        }
    }
    
    /**
     * 複数キャッシュに設定
     */
    _setCaches(key, data) {
        this._setMemoryCache(key, data);
        this._setToLocalStorage(key, data);
    }
    
    /**
     * LocalStorageから復元
     */
    _restoreFromLocalStorage() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('384_')) {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        try {
                            const parsed = JSON.parse(stored);
                            if (Date.now() - parsed.timestamp < this.cacheExpiry) {
                                const cacheKey = key.replace('384_', '');
                                this._setMemoryCache(cacheKey, parsed.data);
                                console.log(`📦 Restored ${cacheKey} from LocalStorage`);
                            }
                        } catch (e) {
                            console.warn(`Failed to parse ${key}:`, e);
                        }
                    }
                }
            });
        } catch (error) {
            console.error('❌ LocalStorage restore failed:', error);
        }
    }
    
    /**
     * バックグラウンドプリフェッチ
     */
    async _prefetchData() {
        // 非同期でデータを事前取得
        setTimeout(async () => {
            try {
                console.log('🔄 Background prefetch starting...');
                await Promise.all([
                    this.fetchLines({ limit: 50 }), // 最初の50件のみ
                    this.fetchHexagrams()
                ]);
                console.log('✅ Background prefetch complete');
            } catch (error) {
                console.warn('Background prefetch failed:', error);
            }
        }, 1000);
    }
    
    /**
     * LocalStorageクリーンアップ
     */
    _cleanupLocalStorage() {
        const keys = Object.keys(localStorage);
        const oldestKey = keys
            .filter(k => k.startsWith('384_'))
            .sort((a, b) => {
                const aData = JSON.parse(localStorage.getItem(a) || '{}');
                const bData = JSON.parse(localStorage.getItem(b) || '{}');
                return (aData.timestamp || 0) - (bData.timestamp || 0);
            })[0];
        
        if (oldestKey) {
            localStorage.removeItem(oldestKey);
            console.log(`🧹 Cleaned up ${oldestKey}`);
        }
    }
    
    /**
     * 遅延処理
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * キャッシュクリア
     */
    clearCache() {
        this.memoryCache.clear();
        
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('384_')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('🧹 All caches cleared');
    }
    
    /**
     * デバッグ情報取得
     */
    getDebugInfo() {
        return {
            initialized: this.initialized,
            memoryCacheSize: this.memoryCache.size,
            memoryCacheKeys: Array.from(this.memoryCache.keys()),
            localStorageKeys: Object.keys(localStorage)
                .filter(k => k.startsWith('384_')),
            apiEndpoint: this.apiEndpoint
        };
    }
}

// グローバルシングルトンインスタンス
window.dataService384 = window.dataService384 || new DataService384();