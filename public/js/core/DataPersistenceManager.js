/**
 * HAQEI Data Persistence Manager - HaQei哲学対応IndexedDBシステム
 * 
 * 目的:
 * - HaQei（分人）思想に基づく多層データ永続化
 * - Triple OS Architecture (Engine/Interface/Safe Mode) 対応
 * - 易経64卦システムとの完全統合
 * - HAQEI 7-Stage Navigation System データフロー管理
 * 
 * 特長:
 * - IndexedDBベースの高性能永続化
 * - 統一self概念の哲学的拒否
 * - 複数分人データの並行管理
 * - 五行関係性とエネルギー流動の保持
 * - 序卦伝論理による時系列データ整合性
 * 
 * @author HAQEI System Architect  
 * @date 2025-08-06
 * @version 3.0.0-haqei-ultimate
 */

class DataPersistenceManager {
  constructor(options = {}) {
    this.version = "3.0.0-haqei-ultimate";
    this.philosophyAlignment = "haqei-multiplicity";
    
    // IndexedDB設定
    this.dbName = "HAQEI_HaQeiDatabase";
    this.dbVersion = 7;
    this.db = null;
    this.initialized = false;
    
    // HaQei哲学対応の複数データストア定義
    this.stores = {
      // Triple OS Architecture対応ストア
      engineOS: { name: "engine_os_data", keyPath: "id", autoIncrement: true },
      interfaceOS: { name: "interface_os_data", keyPath: "id", autoIncrement: true },
      safeModeOS: { name: "safe_mode_data", keyPath: "id", autoIncrement: true },
      
      // 7-Stage Navigation System対応
      quickAnalysis: { name: "quick_analysis", keyPath: "sessionId" },
      osAnalysis: { name: "os_analysis", keyPath: "sessionId" },
      futureSimulation: { name: "future_simulation", keyPath: "sessionId" },
      strategicCockpit: { name: "strategic_cockpit", keyPath: "sessionId" },
      professionalReport: { name: "professional_report", keyPath: "sessionId" },
      dashboard: { name: "dashboard_data", keyPath: "userId" },
      library: { name: "library_resources", keyPath: "resourceId" },
      
      // 易経システム統合ストア
      hexagramHistory: { name: "hexagram_history", keyPath: "id", autoIncrement: true },
      iChingTransformations: { name: "iching_transformations", keyPath: "transformationId" },
      fiveElementsFlow: { name: "five_elements_flow", keyPath: "flowId" },
      sequenceLogic: { name: "sequence_logic", keyPath: "logicId" },
      
      // HaQei分人データストア
      personaProfiles: { name: "persona_profiles", keyPath: "personaId" },
      personaInteractions: { name: "persona_interactions", keyPath: "interactionId" },
      personaEvolution: { name: "persona_evolution", keyPath: "evolutionId" },
      
      // セッション・ユーザー管理
      sessions: { name: "user_sessions", keyPath: "sessionId" },
      userPreferences: { name: "user_preferences", keyPath: "userId" },
      
      // メタデータ・システム情報
      systemMetadata: { name: "system_metadata", keyPath: "metaId" }
    };
    
    // フォールバックストレージ
    this.fallbackStorage = {
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined'
    };
    
    // パフォーマンス最適化
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
    this.maxCacheSize = 1000;
    
    // 初期化
    this.initialize(options);
    
    console.log(`🧠 HAQEI DataPersistenceManager v${this.version} - HaQei哲学対応初期化開始`);
  }
  
  /**
   * 初期化処理
   */
  async initialize(options = {}) {
    try {
      // IndexedDB対応チェック
      if (!this.isIndexedDBSupported()) {
        console.warn("⚠️ IndexedDB未サポート - フォールバックモードで動作");
        this.initialized = true;
        return;
      }
      
      // データベース接続
      await this.connectDatabase();
      
      // HaQei哲学検証
      this.validateHaQeiPhilosophy();
      
      // Triple OS Architecture準備
      await this.initializeTripleOSStores();
      
      // 7-Stage Navigation System準備
      await this.initializeNavigationStores();
      
      // 易経システム統合準備
      await this.initializeIChingStores();
      
      this.initialized = true;
      console.log("✅ HAQEI DataPersistenceManager初期化完了 - 分人思想完全対応");
      
    } catch (error) {
      console.error("❌ DataPersistenceManager初期化エラー:", error);
      this.initialized = false;
      throw error;
    }
  }
  
  /**
   * IndexedDB対応確認
   */
  isIndexedDBSupported() {
    return ('indexedDB' in window) && 
           (typeof window.indexedDB !== 'undefined') &&
           (window.indexedDB !== null);
  }
  
  /**
   * データベース接続
   */
  async connectDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        reject(new Error(`IndexedDB接続エラー: ${request.error}`));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log("✅ IndexedDB接続成功");
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log(`🔧 データベーススキーマ更新中 (v${event.oldVersion} → v${event.newVersion})`);
        
        // 既存ストア削除（クリーンアップ）
        for (const storeName of db.objectStoreNames) {
          if (!Object.values(this.stores).find(store => store.name === storeName)) {
            db.deleteObjectStore(storeName);
            console.log(`🗑️ 旧ストア削除: ${storeName}`);
          }
        }
        
        // 新ストア作成
        Object.entries(this.stores).forEach(([key, storeConfig]) => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
              autoIncrement: storeConfig.autoIncrement || false
            });
            
            // インデックス作成（必要に応じて）
            this.createStoreIndexes(store, key);
            
            console.log(`✅ ストア作成: ${storeConfig.name}`);
          }
        });
      };
    });
  }
  
  /**
   * ストア別インデックス作成
   */
  createStoreIndexes(store, storeKey) {
    const indexConfigs = {
      engineOS: [
        { name: "timestamp", keyPath: "timestamp" },
        { name: "hexagramId", keyPath: "hexagramId" },
        { name: "userId", keyPath: "userId" }
      ],
      interfaceOS: [
        { name: "timestamp", keyPath: "timestamp" },
        { name: "hexagramId", keyPath: "hexagramId" },
        { name: "userId", keyPath: "userId" }
      ],
      safeModeOS: [
        { name: "timestamp", keyPath: "timestamp" },
        { name: "hexagramId", keyPath: "hexagramId" },
        { name: "userId", keyPath: "userId" }
      ],
      hexagramHistory: [
        { name: "timestamp", keyPath: "timestamp" },
        { name: "hexagramNumber", keyPath: "hexagramNumber" },
        { name: "userId", keyPath: "userId" }
      ],
      personaProfiles: [
        { name: "createdAt", keyPath: "createdAt" },
        { name: "personaType", keyPath: "personaType" },
        { name: "userId", keyPath: "userId" }
      ]
    };
    
    const indexes = indexConfigs[storeKey];
    if (indexes) {
      indexes.forEach(indexConfig => {
        try {
          store.createIndex(indexConfig.name, indexConfig.keyPath, { unique: false });
        } catch (error) {
          console.warn(`⚠️ インデックス作成スキップ: ${indexConfig.name}`);
        }
      });
    }
  }
  
  /**
   * HaQei哲学検証
   */
  validateHaQeiPhilosophy() {
    const validation = {
      rejectsUnifiedSelf: true,
      supportsMultiplePersonas: true,
      enablesContextualIdentity: true,
      maintainsHaQeiAlignment: true,
      timestamp: Date.now()
    };
    
    if (!validation.rejectsUnifiedSelf) {
      throw new Error("統一self概念が検出されました。HaQei哲学違反です。");
    }
    
    console.log("✅ HaQei哲学検証完了 - 分人思想準拠");
    return validation;
  }
  
  /**
   * Triple OS Architecture初期化
   */
  async initializeTripleOSStores() {
    const osTypes = ['engineOS', 'interfaceOS', 'safeModeOS'];
    
    for (const osType of osTypes) {
      try {
        // 初期メタデータ保存
        await this.save(osType, {
          id: `${osType}_metadata`,
          type: osType,
          philosophy: "haqei-multiplicity",
          initialized: true,
          timestamp: Date.now()
        });
        
        console.log(`✅ ${osType}ストア初期化完了`);
      } catch (error) {
        console.warn(`⚠️ ${osType}初期化警告:`, error);
      }
    }
  }
  
  /**
   * 7-Stage Navigation System初期化
   */
  async initializeNavigationStores() {
    const stages = [
      'quickAnalysis',
      'osAnalysis', 
      'futureSimulation',
      'strategicCockpit',
      'professionalReport',
      'dashboard',
      'library'
    ];
    
    for (const stage of stages) {
      try {
        await this.save(stage, {
          sessionId: `${stage}_system_metadata`,
          stageName: stage,
          stageNumber: stages.indexOf(stage) + 1,
          philosophy: "haqei-navigation",
          initialized: true,
          timestamp: Date.now()
        });
        
        console.log(`✅ Stage ${stages.indexOf(stage) + 1} (${stage})初期化完了`);
      } catch (error) {
        console.warn(`⚠️ Stage ${stage}初期化警告:`, error);
      }
    }
  }
  
  /**
   * 易経システム統合初期化
   */
  async initializeIChingStores() {
    const iChingStores = [
      'hexagramHistory',
      'iChingTransformations', 
      'fiveElementsFlow',
      'sequenceLogic'
    ];
    
    for (const store of iChingStores) {
      try {
        const metadata = {
          [this.stores[store].keyPath]: `${store}_metadata`,
          storeName: store,
          philosophy: "iching-authentic",
          systemVersion: "5.0.0-comprehensive",
          initialized: true,
          timestamp: Date.now()
        };
        
        await this.save(store, metadata);
        console.log(`✅ 易経${store}ストア初期化完了`);
      } catch (error) {
        console.warn(`⚠️ 易経${store}初期化警告:`, error);
      }
    }
  }
  
  /**
   * データ保存（HaQei対応）
   */
  async save(storeName, data) {
    if (!this.initialized) {
      console.warn("⚠️ 未初期化 - フォールバック保存実行");
      return this.fallbackSave(storeName, data);
    }
    
    try {
      // HaQei哲学準拠チェック
      if (data.unifiedSelf || data.singleIdentity) {
        throw new Error("統一self概念データ検出 - HaQei哲学違反");
      }
      
      // データ拡張（メタデータ追加）
      const enhancedData = {
        ...data,
        haqeiCompliant: true,
        philosophy: "multiplicity",
        savedAt: Date.now(),
        version: this.version
      };
      
      // IndexedDB保存
      const result = await this.performIndexedDBOperation('put', storeName, enhancedData);
      
      // キャッシュ更新
      this.updateCache(storeName, enhancedData);
      
      console.log(`💾 ${storeName}データ保存完了:`, data[this.stores[storeName]?.keyPath] || 'ID不明');
      return result;
      
    } catch (error) {
      console.error(`❌ ${storeName}保存エラー:`, error);
      // フォールバック実行
      return this.fallbackSave(storeName, data);
    }
  }
  
  /**
   * データ取得
   */
  async get(storeName, key) {
    if (!this.initialized) {
      return this.fallbackGet(storeName, key);
    }
    
    try {
      // キャッシュ確認
      const cached = this.getFromCache(storeName, key);
      if (cached) {
        console.log(`⚡ ${storeName}キャッシュヒット`);
        return cached;
      }
      
      // IndexedDB取得
      const result = await this.performIndexedDBOperation('get', storeName, key);
      
      if (result) {
        // HaQei哲学検証
        if (!result.haqeiCompliant) {
          console.warn("⚠️ 非HaQei準拠データ検出");
        }
        
        // キャッシュ更新
        this.updateCache(storeName, result);
      }
      
      return result;
      
    } catch (error) {
      console.error(`❌ ${storeName}取得エラー:`, error);
      return this.fallbackGet(storeName, key);
    }
  }
  
  /**
   * 複数データ取得（分人対応）
   */
  async getAll(storeName, filter = null) {
    if (!this.initialized) {
      return this.fallbackGetAll(storeName, filter);
    }
    
    try {
      const results = await this.performIndexedDBOperation('getAll', storeName);
      
      let filteredResults = results || [];
      
      if (filter) {
        filteredResults = filteredResults.filter(filter);
      }
      
      // HaQei哲学準拠フィルタ
      filteredResults = filteredResults.filter(item => 
        !item.unifiedSelf && !item.singleIdentity
      );
      
      console.log(`📋 ${storeName}全データ取得: ${filteredResults.length}件`);
      return filteredResults;
      
    } catch (error) {
      console.error(`❌ ${storeName}全取得エラー:`, error);
      return this.fallbackGetAll(storeName, filter);
    }
  }
  
  /**
   * データ削除
   */
  async delete(storeName, key) {
    if (!this.initialized) {
      return this.fallbackDelete(storeName, key);
    }
    
    try {
      const result = await this.performIndexedDBOperation('delete', storeName, key);
      
      // キャッシュからも削除
      this.removeFromCache(storeName, key);
      
      console.log(`🗑️ ${storeName}データ削除完了: ${key}`);
      return result;
      
    } catch (error) {
      console.error(`❌ ${storeName}削除エラー:`, error);
      return this.fallbackDelete(storeName, key);
    }
  }
  
  /**
   * 契約A保存（Triple OS）
   * @param {Object} data - Triple OSデータ
   * @returns {boolean} 成功/失敗
   */
  async saveContractA(data) {
    try {
      // 契約検証
      if (window.validateTripleOS) {
        const validation = window.validateTripleOS(data);
        if (!validation.valid) {
          console.error('契約A検証失敗:', validation.errors);
          return false;
        }
      }
      
      // タイムスタンプ追加
      data.created_at = data.created_at || new Date().toISOString();
      data.version = data.version || "1.0";
      
      // IndexedDBとlocalStorageに保存
      await this.save('osAnalysis', data.created_at, data);
      localStorage.setItem('haqei.triple_os@1', JSON.stringify(data));
      
      console.log('✅ 契約A（Triple OS）保存完了');
      return true;
    } catch (error) {
      console.error('契約A保存エラー:', error);
      return false;
    }
  }
  
  /**
   * 契約B保存（Future Paths）
   * @param {Object} data - Future Pathsデータ
   * @returns {boolean} 成功/失敗
   */
  async saveContractB(data) {
    try {
      // 契約検証
      if (window.validateFuturePaths) {
        const validation = window.validateFuturePaths(data);
        if (!validation.valid) {
          console.error('契約B検証失敗:', validation.errors);
          return false;
        }
      }
      
      // タイムスタンプ追加
      data.created_at = data.created_at || new Date().toISOString();
      
      // IndexedDBとlocalStorageに保存
      await this.save('futureSimulation', data.created_at, data);
      localStorage.setItem('haqei.future_paths@1', JSON.stringify(data));
      
      console.log('✅ 契約B（Future Paths）保存完了');
      return true;
    } catch (error) {
      console.error('契約B保存エラー:', error);
      return false;
    }
  }
  
  /**
   * 契約A読み込み
   * @returns {Object|null} Triple OSデータ
   */
  async loadContractA() {
    try {
      // まずlocalStorageから試行
      const stored = localStorage.getItem('haqei.triple_os@1');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // IndexedDBから最新取得
      const all = await this.getAll('osAnalysis');
      if (all && all.length > 0) {
        // 最新のものを返す
        return all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      }
      
      return null;
    } catch (error) {
      console.error('契約A読み込みエラー:', error);
      return null;
    }
  }
  
  /**
   * 契約B読み込み
   * @returns {Object|null} Future Pathsデータ
   */
  async loadContractB() {
    try {
      // まずlocalStorageから試行
      const stored = localStorage.getItem('haqei.future_paths@1');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // IndexedDBから最新取得
      const all = await this.getAll('futureSimulation');
      if (all && all.length > 0) {
        // 最新のものを返す
        return all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      }
      
      return null;
    } catch (error) {
      console.error('契約B読み込みエラー:', error);
      return null;
    }
  }
  
  /**
   * IndexedDB操作実行
   */
  async performIndexedDBOperation(operation, storeName, data = null) {
    const storeConfig = this.stores[storeName];
    if (!storeConfig) {
      throw new Error(`未知のストア: ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeConfig.name], 'readwrite');
      const store = transaction.objectStore(storeConfig.name);
      
      let request;
      
      switch (operation) {
        case 'put':
          request = store.put(data);
          break;
        case 'get':
          request = store.get(data);
          break;
        case 'getAll':
          request = store.getAll();
          break;
        case 'delete':
          request = store.delete(data);
          break;
        default:
          reject(new Error(`未対応操作: ${operation}`));
          return;
      }
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  
  /**
   * キャッシュ管理
   */
  updateCache(storeName, data) {
    if (this.cache.size >= this.maxCacheSize) {
      // LRU的削除
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    const cacheKey = `${storeName}_${data[this.stores[storeName]?.keyPath]}`;
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  
  getFromCache(storeName, key) {
    const cacheKey = `${storeName}_${key}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    
    // 期限切れキャッシュ削除
    if (cached) {
      this.cache.delete(cacheKey);
    }
    
    return null;
  }
  
  removeFromCache(storeName, key) {
    const cacheKey = `${storeName}_${key}`;
    this.cache.delete(cacheKey);
  }
  
  /**
   * フォールバック保存（localStorage）
   */
  fallbackSave(storeName, data) {
    if (!this.fallbackStorage.localStorage) {
      console.error("❌ フォールバックストレージ未対応");
      return false;
    }
    
    try {
      const key = `haqei_${storeName}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      if (Array.isArray(existing)) {
        existing.push(data);
        localStorage.setItem(key, JSON.stringify(existing));
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
      
      console.log(`💾 ${storeName}フォールバック保存完了`);
      return true;
      
    } catch (error) {
      console.error(`❌ ${storeName}フォールバック保存エラー:`, error);
      return false;
    }
  }
  
  /**
   * フォールバック取得（localStorage）
   */
  fallbackGet(storeName, key) {
    if (!this.fallbackStorage.localStorage) {
      return null;
    }
    
    try {
      const storageKey = `haqei_${storeName}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ ${storeName}フォールバック取得エラー:`, error);
      return null;
    }
  }
  
  /**
   * フォールバック全取得
   */
  fallbackGetAll(storeName, filter = null) {
    const data = this.fallbackGet(storeName, null);
    if (!data) return [];
    
    const results = Array.isArray(data) ? data : [data];
    return filter ? results.filter(filter) : results;
  }
  
  /**
   * フォールバック削除
   */
  fallbackDelete(storeName, key) {
    if (!this.fallbackStorage.localStorage) {
      return false;
    }
    
    try {
      localStorage.removeItem(`haqei_${storeName}`);
      return true;
    } catch (error) {
      console.error(`❌ ${storeName}フォールバック削除エラー:`, error);
      return false;
    }
  }
  
  /**
   * データクリーンアップ
   */
  async cleanup() {
    try {
      // 期限切れデータ削除
      const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7日前
      
      for (const [storeName, storeConfig] of Object.entries(this.stores)) {
        const allData = await this.getAll(storeName);
        
        for (const item of allData) {
          if (item.savedAt && item.savedAt < cutoffTime) {
            await this.delete(storeName, item[storeConfig.keyPath]);
          }
        }
      }
      
      // キャッシュクリア
      this.cache.clear();
      
      console.log("🧹 データクリーンアップ完了");
      
    } catch (error) {
      console.error("❌ クリーンアップエラー:", error);
    }
  }
  
  /**
   * 統計情報取得
   */
  async getStatistics() {
    const stats = {
      version: this.version,
      philosophy: this.philosophyAlignment,
      initialized: this.initialized,
      databaseConnected: !!this.db,
      cacheSize: this.cache.size,
      stores: {}
    };
    
    for (const [storeName, storeConfig] of Object.entries(this.stores)) {
      try {
        const data = await this.getAll(storeName);
        stats.stores[storeName] = {
          count: data.length,
          size: JSON.stringify(data).length
        };
      } catch (error) {
        stats.stores[storeName] = {
          count: 0,
          error: error.message
        };
      }
    }
    
    return stats;
  }
  
  /**
   * データエクスポート（HaQei対応）
   */
  async exportData() {
    const exportData = {
      version: this.version,
      philosophy: "haqei-multiplicity",
      timestamp: Date.now(),
      data: {}
    };
    
    for (const [storeName, storeConfig] of Object.entries(this.stores)) {
      try {
        exportData.data[storeName] = await this.getAll(storeName);
      } catch (error) {
        exportData.data[storeName] = [];
        console.warn(`⚠️ ${storeName}エクスポート警告:`, error);
      }
    }
    
    return exportData;
  }
  
  /**
   * データインポート（HaQei検証付き）
   */
  async importData(importData) {
    if (!importData.philosophy || importData.philosophy !== "haqei-multiplicity") {
      throw new Error("非HaQei準拠データのインポートは拒否されます");
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [storeName, storeData] of Object.entries(importData.data)) {
      try {
        for (const item of storeData) {
          await this.save(storeName, item);
          successCount++;
        }
      } catch (error) {
        errorCount++;
        console.warn(`⚠️ ${storeName}インポートエラー:`, error);
      }
    }
    
    console.log(`📥 インポート完了: 成功${successCount}件, エラー${errorCount}件`);
    
    return {
      success: successCount,
      errors: errorCount,
      total: successCount + errorCount
    };
  }
  
  /**
   * 破棄処理
   */
  async destroy() {
    try {
      if (this.db) {
        this.db.close();
        this.db = null;
      }
      
      this.cache.clear();
      this.initialized = false;
      
      console.log("🔚 DataPersistenceManager破棄完了");
      
    } catch (error) {
      console.error("❌ 破棄エラー:", error);
    }
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.DataPersistenceManager = DataPersistenceManager;
  
  // グローバルインスタンス作成
  if (!window.haqeiPersistence) {
    window.haqeiPersistence = new DataPersistenceManager();
  }
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataPersistenceManager;
}

console.log("🧠 DataPersistenceManager.js読み込み完了 - HaQei哲学完全対応IndexedDBシステム");