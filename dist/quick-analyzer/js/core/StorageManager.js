/**
 * StorageManager - ローカルストレージ管理クラス
 * データの保存、読み込み、検証、暗号化機能を提供
 */
class StorageManager {
  constructor(prefix = 'haqei_quick_') {
    this.prefix = prefix;
    this.encryptionKey = null;
    this.initialized = false;
    this.supportedStorage = this.checkStorageSupport();
    
    // ストレージタイプの定義
    this.STORAGE_TYPES = {
      LOCAL: 'localStorage',
      SESSION: 'sessionStorage',
      MEMORY: 'memoryStorage'
    };
    
    // データタイプの定義
    this.DATA_TYPES = {
      USER_ANSWERS: 'user_answers',
      ANALYSIS_RESULTS: 'analysis_results',
      USER_PREFERENCES: 'user_preferences',
      SESSION_DATA: 'session_data',
      ERROR_LOGS: 'error_logs',
      USAGE_STATS: 'usage_stats'
    };
    
    // メモリストレージ（フォールバック用）
    this.memoryStorage = new Map();
    
    this.init();
  }

  /**
   * StorageManagerを初期化
   */
  init() {
    if (this.initialized) return;
    
    try {
      // 暗号化キーの設定
      this.setupEncryption();
      
      // ストレージの整合性チェック
      this.validateStorageIntegrity();
      
      // 古いデータのクリーンアップ
      this.cleanupExpiredData();
      
      this.initialized = true;
      this.log('info', 'init', 'StorageManager initialized', {
        supportedStorage: this.supportedStorage,
        hasEncryption: !!this.encryptionKey
      });
      
    } catch (error) {
      this.handleError(error, 'initialization');
    }
  }

  /**
   * ストレージサポートをチェック
   * @returns {Object}
   */
  checkStorageSupport() {
    const support = {
      localStorage: false,
      sessionStorage: false,
      memoryStorage: true // 常にサポート
    };

    try {
      // localStorage のテスト
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      support.localStorage = true;
    } catch (e) {
      this.log('warn', 'checkStorageSupport', 'localStorage not supported');
    }

    try {
      // sessionStorage のテスト
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      support.sessionStorage = true;
    } catch (e) {
      this.log('warn', 'checkStorageSupport', 'sessionStorage not supported');
    }

    return support;
  }

  /**
   * 暗号化の設定
   */
  setupEncryption() {
    // 簡単な暗号化キーを生成（実際のプロダクションではより強固な暗号化を使用）
    this.encryptionKey = this.generateEncryptionKey();
  }

  /**
   * 暗号化キーを生成
   * @returns {string}
   */
  generateEncryptionKey() {
    // ブラウザのfingerprint要素を組み合わせてキーを生成
    const factors = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      'haqei_salt_2024'
    ];
    
    return btoa(factors.join('|')).substring(0, 16);
  }

  /**
   * データを保存
   * @param {string} key - キー
   * @param {*} data - 保存するデータ
   * @param {Object} options - オプション
   * @returns {boolean} 保存成功か
   */
  save(key, data, options = {}) {
    try {
      const normalizedKey = this.normalizeKey(key);
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      const encrypt = options.encrypt || false;
      const expiry = options.expiry || null;
      
      // データオブジェクトの作成
      const dataObject = {
        value: data,
        timestamp: new Date().toISOString(),
        type: typeof data,
        encrypted: encrypt,
        expiry: expiry,
        version: '1.0'
      };
      
      // データの暗号化
      let serializedData;
      if (encrypt && this.encryptionKey) {
        serializedData = this.encrypt(JSON.stringify(dataObject));
      } else {
        serializedData = JSON.stringify(dataObject);
      }
      
      // ストレージに保存
      const success = this.writeToStorage(normalizedKey, serializedData, storageType);
      
      if (success) {
        this.log('debug', 'save', `Data saved: ${key}`, {
          key: normalizedKey,
          storageType,
          encrypted: encrypt,
          size: serializedData.length
        });
      }
      
      return success;
      
    } catch (error) {
      this.handleError(error, `save:${key}`);
      return false;
    }
  }

  /**
   * データを読み込み
   * @param {string} key - キー
   * @param {Object} options - オプション
   * @returns {*} 読み込んだデータ
   */
  load(key, options = {}) {
    try {
      const normalizedKey = this.normalizeKey(key);
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      const defaultValue = options.defaultValue || null;
      
      // ストレージから読み込み
      const serializedData = this.readFromStorage(normalizedKey, storageType);
      
      if (!serializedData) {
        this.log('debug', 'load', `No data found: ${key}`);
        return defaultValue;
      }
      
      // データの復号化とパース
      let dataObject;
      try {
        // 暗号化されている可能性を考慮して復号化を試行
        const decryptedData = this.decrypt(serializedData);
        dataObject = JSON.parse(decryptedData || serializedData);
      } catch (e) {
        // 復号化に失敗した場合は平文としてパース
        dataObject = JSON.parse(serializedData);
      }
      
      // データの検証
      if (!this.validateDataObject(dataObject)) {
        this.log('warn', 'load', `Invalid data object: ${key}`);
        return defaultValue;
      }
      
      // 有効期限のチェック
      if (dataObject.expiry && new Date(dataObject.expiry) < new Date()) {
        this.log('debug', 'load', `Expired data: ${key}`);
        this.remove(key, { storageType });
        return defaultValue;
      }
      
      this.log('debug', 'load', `Data loaded: ${key}`, {
        key: normalizedKey,
        storageType,
        encrypted: dataObject.encrypted,
        timestamp: dataObject.timestamp
      });
      
      return dataObject.value;
      
    } catch (error) {
      this.handleError(error, `load:${key}`);
      return options.defaultValue || null;
    }
  }

  /**
   * データを削除
   * @param {string} key - キー
   * @param {Object} options - オプション
   * @returns {boolean} 削除成功か
   */
  remove(key, options = {}) {
    try {
      const normalizedKey = this.normalizeKey(key);
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      
      const success = this.removeFromStorage(normalizedKey, storageType);
      
      if (success) {
        this.log('debug', 'remove', `Data removed: ${key}`, {
          key: normalizedKey,
          storageType
        });
      }
      
      return success;
      
    } catch (error) {
      this.handleError(error, `remove:${key}`);
      return false;
    }
  }

  /**
   * キーの存在確認
   * @param {string} key - キー
   * @param {Object} options - オプション
   * @returns {boolean}
   */
  exists(key, options = {}) {
    try {
      const normalizedKey = this.normalizeKey(key);
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      
      const data = this.readFromStorage(normalizedKey, storageType);
      return data !== null;
      
    } catch (error) {
      this.handleError(error, `exists:${key}`);
      return false;
    }
  }

  /**
   * すべてのキーを取得
   * @param {Object} options - オプション
   * @returns {Array<string>}
   */
  getAllKeys(options = {}) {
    try {
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      const keys = [];
      
      if (storageType === this.STORAGE_TYPES.MEMORY) {
        return Array.from(this.memoryStorage.keys())
          .filter(key => key.startsWith(this.prefix))
          .map(key => key.substring(this.prefix.length));
      }
      
      const storage = storageType === this.STORAGE_TYPES.SESSION ? sessionStorage : localStorage;
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
      
      return keys;
      
    } catch (error) {
      this.handleError(error, 'getAllKeys');
      return [];
    }
  }

  /**
   * ストレージをクリア
   * @param {Object} options - オプション
   */
  clear(options = {}) {
    try {
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      const pattern = options.pattern || null;
      
      const keys = this.getAllKeys({ storageType });
      
      keys.forEach(key => {
        if (!pattern || key.includes(pattern)) {
          this.remove(key, { storageType });
        }
      });
      
      this.log('info', 'clear', 'Storage cleared', {
        storageType,
        pattern,
        clearedCount: keys.length
      });
      
    } catch (error) {
      this.handleError(error, 'clear');
    }
  }

  /**
   * ストレージサイズを取得
   * @param {Object} options - オプション
   * @returns {Object}
   */
  getStorageSize(options = {}) {
    try {
      const storageType = options.storageType || this.STORAGE_TYPES.LOCAL;
      let totalSize = 0;
      let itemCount = 0;
      
      if (storageType === this.STORAGE_TYPES.MEMORY) {
        this.memoryStorage.forEach((value, key) => {
          if (key.startsWith(this.prefix)) {
            totalSize += key.length + JSON.stringify(value).length;
            itemCount++;
          }
        });
      } else {
        const storage = storageType === this.STORAGE_TYPES.SESSION ? sessionStorage : localStorage;
        
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith(this.prefix)) {
            const value = storage.getItem(key);
            totalSize += key.length + (value ? value.length : 0);
            itemCount++;
          }
        }
      }
      
      return {
        totalSize,
        itemCount,
        averageSize: itemCount > 0 ? Math.round(totalSize / itemCount) : 0,
        sizeInKB: Math.round(totalSize / 1024 * 100) / 100
      };
      
    } catch (error) {
      this.handleError(error, 'getStorageSize');
      return { totalSize: 0, itemCount: 0, averageSize: 0, sizeInKB: 0 };
    }
  }

  /**
   * キーを正規化
   * @param {string} key - 元のキー
   * @returns {string}
   */
  normalizeKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * ストレージに書き込み
   * @param {string} key - キー
   * @param {string} data - データ
   * @param {string} storageType - ストレージタイプ
   * @returns {boolean}
   */
  writeToStorage(key, data, storageType) {
    try {
      switch (storageType) {
        case this.STORAGE_TYPES.LOCAL:
          if (this.supportedStorage.localStorage) {
            localStorage.setItem(key, data);
            return true;
          }
          break;
          
        case this.STORAGE_TYPES.SESSION:
          if (this.supportedStorage.sessionStorage) {
            sessionStorage.setItem(key, data);
            return true;
          }
          break;
          
        case this.STORAGE_TYPES.MEMORY:
          this.memoryStorage.set(key, data);
          return true;
      }
      
      // フォールバック: メモリストレージ
      this.memoryStorage.set(key, data);
      return true;
      
    } catch (error) {
      // ストレージ容量超過等のエラー
      if (error.name === 'QuotaExceededError') {
        this.handleStorageQuotaExceeded(storageType);
      }
      throw error;
    }
  }

  /**
   * ストレージから読み込み
   * @param {string} key - キー
   * @param {string} storageType - ストレージタイプ
   * @returns {string|null}
   */
  readFromStorage(key, storageType) {
    try {
      switch (storageType) {
        case this.STORAGE_TYPES.LOCAL:
          if (this.supportedStorage.localStorage) {
            return localStorage.getItem(key);
          }
          break;
          
        case this.STORAGE_TYPES.SESSION:
          if (this.supportedStorage.sessionStorage) {
            return sessionStorage.getItem(key);
          }
          break;
          
        case this.STORAGE_TYPES.MEMORY:
          return this.memoryStorage.get(key) || null;
      }
      
      // フォールバック: メモリストレージ
      return this.memoryStorage.get(key) || null;
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * ストレージから削除
   * @param {string} key - キー
   * @param {string} storageType - ストレージタイプ
   * @returns {boolean}
   */
  removeFromStorage(key, storageType) {
    try {
      switch (storageType) {
        case this.STORAGE_TYPES.LOCAL:
          if (this.supportedStorage.localStorage) {
            localStorage.removeItem(key);
            return true;
          }
          break;
          
        case this.STORAGE_TYPES.SESSION:
          if (this.supportedStorage.sessionStorage) {
            sessionStorage.removeItem(key);
            return true;
          }
          break;
          
        case this.STORAGE_TYPES.MEMORY:
          return this.memoryStorage.delete(key);
      }
      
      // フォールバック: メモリストレージ
      return this.memoryStorage.delete(key);
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * データオブジェクトを検証
   * @param {Object} dataObject - データオブジェクト
   * @returns {boolean}
   */
  validateDataObject(dataObject) {
    return dataObject &&
           typeof dataObject === 'object' &&
           'value' in dataObject &&
           'timestamp' in dataObject;
  }

  /**
   * データを暗号化
   * @param {string} data - 平文データ
   * @returns {string}
   */
  encrypt(data) {
    if (!this.encryptionKey) return data;
    
    try {
      // 簡単なXOR暗号化（実際のプロダクションではより強固な暗号化を使用）
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted);
    } catch (error) {
      this.log('warn', 'encrypt', 'Encryption failed');
      return data;
    }
  }

  /**
   * データを復号化
   * @param {string} encryptedData - 暗号化されたデータ
   * @returns {string}
   */
  decrypt(encryptedData) {
    if (!this.encryptionKey || !encryptedData) return encryptedData;
    
    try {
      // Base64かどうかをチェック
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encryptedData)) {
        // Base64でない場合は平文として返す
        return encryptedData;
      }
      
      const encrypted = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      // 復号化に失敗した場合は元のデータを返す（警告は出さない）
      return encryptedData;
    }
  }

  /**
   * ストレージの整合性を検証
   */
  validateStorageIntegrity() {
    const keys = this.getAllKeys();
    let corruptedCount = 0;
    
    keys.forEach(key => {
      try {
        this.load(key);
      } catch (error) {
        this.log('warn', 'validateStorageIntegrity', `Corrupted data: ${key}`);
        this.remove(key);
        corruptedCount++;
      }
    });
    
    if (corruptedCount > 0) {
      this.log('info', 'validateStorageIntegrity', `Cleaned ${corruptedCount} corrupted entries`);
    }
  }

  /**
   * 期限切れデータのクリーンアップ
   */
  cleanupExpiredData() {
    const keys = this.getAllKeys();
    let cleanedCount = 0;
    
    keys.forEach(key => {
      const data = this.load(key);
      if (data === null) {
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      this.log('info', 'cleanupExpiredData', `Cleaned ${cleanedCount} expired entries`);
    }
  }

  /**
   * ストレージ容量超過の処理
   * @param {string} storageType - ストレージタイプ
   */
  handleStorageQuotaExceeded(storageType) {
    this.log('warn', 'handleStorageQuotaExceeded', 'Storage quota exceeded, cleaning up');
    
    // 古いデータから順に削除
    const keys = this.getAllKeys({ storageType });
    const dataWithTimestamps = keys.map(key => {
      const data = this.load(key, { storageType });
      return { key, timestamp: new Date(data?.timestamp || 0) };
    }).sort((a, b) => a.timestamp - b.timestamp);
    
    // 半分のデータを削除
    const deleteCount = Math.ceil(dataWithTimestamps.length / 2);
    for (let i = 0; i < deleteCount; i++) {
      this.remove(dataWithTimestamps[i].key, { storageType });
    }
    
    this.log('info', 'handleStorageQuotaExceeded', `Cleaned ${deleteCount} old entries`);
  }

  /**
   * エラーハンドリング
   * @param {Error} error - エラーオブジェクト
   * @param {string} context - コンテキスト
   */
  handleError(error, context) {
    this.log('error', 'handleError', `Error in ${context}`, error);
    
    // ErrorHandlerが利用可能な場合は通知
    if (window.ErrorHandler && typeof window.ErrorHandler.storageError === 'function') {
      window.ErrorHandler.storageError(error.message, { context });
    }
  }

  /**
   * ログ出力
   * @param {string} level - ログレベル
   * @param {string} method - メソッド名
   * @param {string} message - メッセージ
   * @param {*} data - データ
   */
  log(level, method, message, data = null) {
    const logData = {
      component: 'StorageManager',
      method,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    
    console[level](`[StorageManager] ${message}`, logData);
  }
}

// グローバルに公開
window.StorageManager = StorageManager;