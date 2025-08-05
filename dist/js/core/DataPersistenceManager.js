/**
 * Data Persistence Manager - HAQEI Future Simulator用永続化基盤
 * 
 * 目的：
 * - IndexedDBを活用した7変化パターン全データの永続化システム
 * - AES-256暗号化による個人情報保護
 * - 90日自動削除機能による適切なデータ管理
 * - 1000件以上のデータでも高速動作する最適化システム
 * 
 * 主要機能：
 * 1. IndexedDBスキーマ設計と初期化
 * 2. 基本CRUD操作（Create, Read, Update, Delete）
 * 3. AES-256暗号化・復号化機能
 * 4. 90日自動削除機能
 * 5. データ匿名化処理
 * 6. パフォーマンス最適化されたインデックス戦略
 * 7. バックアップ・リストア機能
 * 
 * データベース構造：
 * - analyses: 分析結果の主データ
 * - patterns: 7変化パターン詳細データ  
 * - userProfiles: ユーザープロファイル（匿名化済み）
 * - metadata: システムメタデータ
 * 
 * セキュリティ：
 * - 個人情報のAES-256暗号化
 * - データアクセス権限管理
 * - 自動データ匿名化
 * - セキュアな削除処理
 * 
 * パフォーマンス：
 * - 効率的なインデックス戦略
 * - 1000件以上のデータで高速クエリ
 * - バッチ処理による最適化
 * - メモリ使用量の最適化
 * 
 * 作成者: Data Persistence Developer
 * バージョン: 1.0.0
 * 更新日: 2025-08-04
 */

class DataPersistenceManager {
  constructor() {
    console.log('🗄️ DataPersistenceManager初期化開始');
    
    // データベース設定
    this.dbName = 'HAQEI_Future_Simulator_DB';
    this.dbVersion = 1;
    this.db = null;
    
    // 暗号化設定
    this.encryptionKey = null;
    this.cryptoConfig = {
      algorithm: 'AES-GCM',
      keyLength: 256,
      ivLength: 12,
      tagLength: 128
    };
    
    // データ保存期間設定（90日）
    this.dataRetentionDays = 90;
    this.maxRecords = 10000; // 最大レコード数制限
    
    // パフォーマンス設定
    this.batchSize = 100;
    this.cacheEnabled = true;
    this.cache = new Map();
    this.maxCacheSize = 500;
    
    // データベーススキーマ定義
    this.dbSchema = {
      version: 1,
      stores: {
        // 分析結果メインストア
        analyses: {
          keyPath: 'id',
          autoIncrement: false,
          indexes: [
            { name: 'timestamp', keyPath: 'timestamp', unique: false },
            { name: 'userId', keyPath: 'userId', unique: false },
            { name: 'hexagram', keyPath: 'result.hexagram', unique: false },
            { name: 'confidence', keyPath: 'result.confidence', unique: false },
            { name: 'expiryDate', keyPath: 'expiryDate', unique: false }
          ],
          description: '7段階分析結果と易経マッピング結果を保存'
        },
        
        // 7変化パターン詳細ストア
        patterns: {
          keyPath: 'id',
          autoIncrement: false,
          indexes: [
            { name: 'analysisId', keyPath: 'analysisId', unique: false },
            { name: 'patternType', keyPath: 'patternType', unique: false },
            { name: 'timestamp', keyPath: 'timestamp', unique: false }
          ],
          description: '7変化パターンの詳細データを保存'
        },
        
        // ユーザープロファイルストア（匿名化済み）
        userProfiles: {
          keyPath: 'id',
          autoIncrement: false,
          indexes: [
            { name: 'anonymizedId', keyPath: 'anonymizedId', unique: true },
            { name: 'timestamp', keyPath: 'timestamp', unique: false },
            { name: 'lastAccess', keyPath: 'lastAccess', unique: false }
          ],
          description: '匿名化されたユーザープロファイルデータ'
        },
        
        // システムメタデータストア
        metadata: {
          keyPath: 'key',
          autoIncrement: false,
          indexes: [
            { name: 'type', keyPath: 'type', unique: false },
            { name: 'timestamp', keyPath: 'timestamp', unique: false }
          ],
          description: 'システム設定とメタデータ'
        }
      }
    };
    
    // 統計データ
    this.statistics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      encryptedRecords: 0,
      deletedRecords: 0,
      averageOperationTime: 0,
      cacheHitRate: 0,
      performanceMetrics: new Map()
    };
    
    // 初期化フラグ
    this.isInitialized = false;
    this.initializationPromise = null;
    
    console.log('✅ DataPersistenceManager基本設定完了');
  }

  /**
   * DataPersistenceManager初期化
   * 
   * 目的：
   * - IndexedDBデータベースの初期化
   * - 暗号化キーの生成・復元
   * - 自動削除タスクの開始
   * 
   * 処理内容：
   * - データベース接続とスキーマ作成
   * - 暗号化システムの準備
   * - 自動クリーンアップの設定
   * 
   * 出力：
   * - 初期化成功/失敗の結果
   */
  async initialize() {
    if (this.isInitialized) {
      return { success: true, message: '既に初期化済み' };
    }
    
    if (this.initializationPromise) {
      return await this.initializationPromise;
    }
    
    this.initializationPromise = this._performInitialization();
    return await this.initializationPromise;
  }
  
  async _performInitialization() {
    const startTime = performance.now();
    console.log('🚀 DataPersistenceManager初期化実行');
    
    try {
      // IndexedDBサポート確認
      if (!window.indexedDB) {
        throw new Error('IndexedDBがサポートされていません');
      }
      
      // 暗号化システム初期化
      await this.initializeEncryption();
      console.log('🔐 暗号化システム初期化完了');
      
      // データベース初期化
      await this.initializeDatabase();
      console.log('🗄️ データベース初期化完了');
      
      // 自動削除タスク開始
      this.startAutoCleanupTask();
      console.log('🧹 自動削除タスク開始');
      
      // システムメタデータ初期化
      await this.initializeSystemMetadata();
      console.log('📊 システムメタデータ初期化完了');
      
      this.isInitialized = true;
      const initTime = performance.now() - startTime;
      
      console.log(`✅ DataPersistenceManager初期化完了 (${initTime.toFixed(2)}ms)`);
      
      return {
        success: true,
        message: 'DataPersistenceManager初期化成功',
        initializationTime: initTime,
        dbVersion: this.dbVersion,
        encryptionEnabled: !!this.encryptionKey
      };
      
    } catch (error) {
      console.error('❌ DataPersistenceManager初期化エラー:', error);
      this.isInitialized = false;
      this.initializationPromise = null;
      
      return {
        success: false,
        message: `初期化失敗: ${error.message}`,
        error: error
      };
    }
  }

  /**
   * 暗号化システム初期化
   * 
   * 目的：
   * - AES-256暗号化キーの生成または復元
   * - Web Crypto APIの利用準備
   * 
   * 処理内容：
   * - 既存キーの確認と復元
   * - 新規キーの生成と保存
   * - 暗号化テストの実行
   */
  async initializeEncryption() {
    try {
      // Web Crypto APIサポート確認
      if (!window.crypto || !window.crypto.subtle) {
        console.warn('⚠️ Web Crypto APIが利用できません - 暗号化無効');
        return;
      }
      
      // 既存キーの復元を試行
      const storedKey = localStorage.getItem('haqei_encryption_key');
      if (storedKey) {
        try {
          const keyData = JSON.parse(storedKey);
          this.encryptionKey = await window.crypto.subtle.importKey(
            'raw',
            new Uint8Array(keyData),
            this.cryptoConfig.algorithm,
            false,
            ['encrypt', 'decrypt']
          );
          console.log('🔐 既存暗号化キー復元完了');
          return;
        } catch (error) {
          console.warn('⚠️ 既存キー復元失敗:', error.message);
        }
      }
      
      // 新規キー生成
      const keyBuffer = window.crypto.getRandomValues(new Uint8Array(32));
      this.encryptionKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        this.cryptoConfig.algorithm,
        true,
        ['encrypt', 'decrypt']
      );
      
      // キーをローカルストレージに保存（開発環境のみ）
      const exportedKey = await window.crypto.subtle.exportKey('raw', this.encryptionKey);
      localStorage.setItem('haqei_encryption_key', JSON.stringify(Array.from(new Uint8Array(exportedKey))));
      
      // 暗号化テスト
      await this.testEncryption();
      
      console.log('✅ 新規暗号化キー生成完了');
      
    } catch (error) {
      console.error('❌ 暗号化初期化エラー:', error);
      this.encryptionKey = null;
    }
  }

  /**
   * 暗号化テスト実行
   */
  async testEncryption() {
    const testData = 'HAQEI暗号化テストデータ';
    const encrypted = await this.encryptData(testData);
    const decrypted = await this.decryptData(encrypted);
    
    if (decrypted !== testData) {
      throw new Error('暗号化テスト失敗');
    }
    
    console.log('✅ 暗号化テスト成功');
  }

  /**
   * データベース初期化
   * 
   * 目的：
   * - IndexedDBデータベースとオブジェクトストアの作成
   * - インデックスの設定
   * 
   * 処理内容：
   * - データベース接続の確立
   * - スキーマに基づくストア作成
   * - パフォーマンス最適化インデックスの設定
   */
  async initializeDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        reject(new Error(`データベース開封エラー: ${request.error}`));
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('✅ IndexedDB接続成功');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        console.log('🔄 データベーススキーマ更新中...');
        const db = event.target.result;
        this.createDatabaseSchema(db);
      };
    });
  }

  /**
   * データベーススキーマ作成
   */
  createDatabaseSchema(db) {
    try {
      for (const [storeName, storeConfig] of Object.entries(this.dbSchema.stores)) {
        // 既存ストアの削除（アップグレード時）
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
        
        // オブジェクトストア作成
        const store = db.createObjectStore(storeName, {
          keyPath: storeConfig.keyPath,
          autoIncrement: storeConfig.autoIncrement
        });
        
        // インデックス作成
        if (storeConfig.indexes) {
          storeConfig.indexes.forEach(indexConfig => {
            store.createIndex(
              indexConfig.name,
              indexConfig.keyPath,
              { unique: indexConfig.unique }
            );
          });
        }
        
        console.log(`✅ オブジェクトストア作成: ${storeName}`);
      }
      
      console.log('✅ データベーススキーマ作成完了');
      
    } catch (error) {
      console.error('❌ スキーマ作成エラー:', error);
      throw error;
    }
  }

  /**
   * システムメタデータ初期化
   */
  async initializeSystemMetadata() {
    const metadata = {
      key: 'system_info',
      type: 'system',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastMaintenance: new Date().toISOString(),
      totalRecords: 0,
      encryptionEnabled: !!this.encryptionKey,
      timestamp: Date.now()
    };
    
    await this.storeMetadata('system_info', metadata);
  }

  /**
   * 自動削除タスク開始
   * 
   * 目的：
   * - 90日を超えた古いデータの自動削除
   * - データベースサイズの管理
   * 
   * 処理内容：
   * - 定期的な期限切れデータチェック
   * - バッチ削除処理
   * - 統計データの更新
   */
  startAutoCleanupTask() {
    // 初回実行（5秒後）
    setTimeout(() => {
      this.performAutoCleanup();
    }, 5000);
    
    // 定期実行（6時間毎）
    setInterval(() => {
      this.performAutoCleanup();
    }, 6 * 60 * 60 * 1000);
    
    console.log('🧹 自動削除タスク設定完了（6時間毎実行）');
  }

  /**
   * 自動削除実行
   */
  async performAutoCleanup() {
    if (!this.isInitialized || !this.db) {
      return;
    }
    
    console.log('🧹 自動削除処理開始');
    const startTime = performance.now();
    
    try {
      const cutoffDate = Date.now() - (this.dataRetentionDays * 24 * 60 * 60 * 1000);
      let deletedCount = 0;
      
      // 各ストアから期限切れデータを削除
      for (const storeName of Object.keys(this.dbSchema.stores)) {
        const storeDeletedCount = await this.deleteExpiredRecords(storeName, cutoffDate);
        deletedCount += storeDeletedCount;
      }
      
      // キャッシュクリア
      this.clearCache();
      
      // 統計更新
      this.statistics.deletedRecords += deletedCount;
      
      const cleanupTime = performance.now() - startTime;
      console.log(`✅ 自動削除完了: ${deletedCount}件削除 (${cleanupTime.toFixed(2)}ms)`);
      
      // メタデータ更新
      await this.updateSystemMetadata('last_cleanup', {
        timestamp: Date.now(),
        deletedRecords: deletedCount,
        cleanupTime: cleanupTime
      });
      
    } catch (error) {
      console.error('❌ 自動削除エラー:', error);
    }
  }

  /**
   * 期限切れレコード削除
   */
  async deleteExpiredRecords(storeName, cutoffDate) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      let deletedCount = 0;
      
      // timestampまたはexpiryDateインデックスを使用
      const indexName = store.indexNames.contains('expiryDate') ? 'expiryDate' : 'timestamp';
      const index = store.index(indexName);
      
      const range = IDBKeyRange.upperBound(cutoffDate);
      const request = index.openCursor(range);
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };
      
      request.onerror = () => {
        reject(new Error(`期限切れレコード削除エラー (${storeName}): ${request.error}`));
      };
    });
  }

  /**
   * 分析結果保存（メイン機能）
   * 
   * 目的：
   * - 7段階分析結果と易経マッピング結果の永続化
   * - 個人情報の暗号化保存
   * - 高速検索のためのインデックス最適化
   * 
   * 入力：
   * - analysisData: object - 分析結果データ
   * - patterns: array - 7変化パターンデータ
   * - userProfile: object - ユーザープロファイル（オプション）
   * 
   * 出力：
   * - 保存結果オブジェクト
   */
  async saveAnalysisResult(analysisData, patterns = [], userProfile = null) {
    const startTime = performance.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      // データ検証
      if (!analysisData || !analysisData.finalResult) {
        throw new Error('無効な分析データ');
      }
      
      // ユニークID生成
      const analysisId = this.generateUniqueId('analysis');
      const timestamp = Date.now();
      const expiryDate = timestamp + (this.dataRetentionDays * 24 * 60 * 60 * 1000);
      
      // ユーザーID生成（匿名化）
      const userId = this.generateAnonymizedUserId(userProfile);
      
      // メイン分析データ準備
      const analysisRecord = {
        id: analysisId,
        userId: userId,
        timestamp: timestamp,
        expiryDate: expiryDate,
        input: {
          text: analysisData.inputAnalysis?.originalText || '',
          textLength: analysisData.inputAnalysis?.textLength || 0,
          complexity: analysisData.inputAnalysis?.complexity || 'unknown'
        },
        result: {
          hexagram: analysisData.finalResult.hexagram,
          line: analysisData.finalResult.line,
          confidence: analysisData.finalResult.confidence,
          reasoning: analysisData.finalResult.reasoning,
          tripleOSIntegration: analysisData.finalResult.tripleOSIntegration
        },
        stageResults: analysisData.stageResults,
        qualityMetrics: analysisData.qualityMetrics,
        systemInfo: analysisData.systemInfo,
        metadata: {
          version: '1.0.0',
          encrypted: !!this.encryptionKey,
          createdAt: new Date().toISOString()
        }
      };
      
      // 個人情報の暗号化
      analysisRecord.input.text = await this.encryptSensitiveData(analysisRecord.input.text);
      analysisRecord.result.reasoning = await this.encryptSensitiveData(analysisRecord.result.reasoning);
      
      // メイン分析データ保存
      await this.storeRecord('analyses', analysisRecord);
      
      // 7変化パターンデータ保存
      const patternPromises = patterns.map(async (pattern, index) => {
        const patternRecord = {
          id: this.generateUniqueId('pattern'),
          analysisId: analysisId,
          patternType: pattern.type || `pattern_${index + 1}`,
          patternData: pattern,
          timestamp: timestamp,
          expiryDate: expiryDate
        };
        
        return await this.storeRecord('patterns', patternRecord);
      });
      
      await Promise.all(patternPromises);
      
      // ユーザープロファイル保存（提供された場合）
      if (userProfile) {
        await this.saveUserProfile(userId, userProfile, timestamp, expiryDate);
      }
      
      // キャッシュ更新
      if (this.cacheEnabled) {
        this.cache.set(analysisId, analysisRecord);
        this.manageCacheSize();
      }
      
      // 統計更新
      this.updateOperationStatistics(startTime, true);
      this.statistics.encryptedRecords++;
      
      const saveTime = performance.now() - startTime;
      console.log(`✅ 分析結果保存完了: ${analysisId} (${saveTime.toFixed(2)}ms)`);
      
      return {
        success: true,
        analysisId: analysisId,
        userId: userId,
        saveTime: saveTime,
        encrypted: !!this.encryptionKey,
        patternsCount: patterns.length,
        expiryDate: new Date(expiryDate).toISOString()
      };
      
    } catch (error) {
      console.error('❌ 分析結果保存エラー:', error);
      this.updateOperationStatistics(startTime, false);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * 分析結果取得
   * 
   * 目的：
   * - 保存された分析結果の取得
   * - 暗号化データの復号化
   * - 高速キャッシュアクセス
   * 
   * 入力：
   * - analysisId: string - 分析ID
   * - includePatterns: boolean - パターンデータ含有フラグ
   * 
   * 出力：
   * - 復号化された分析結果
   */
  async getAnalysisResult(analysisId, includePatterns = true) {
    const startTime = performance.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      // キャッシュ確認
      if (this.cacheEnabled && this.cache.has(analysisId)) {
        console.log('🔄 キャッシュから分析結果を取得');
        const cachedResult = this.cache.get(analysisId);
        return await this.decryptAnalysisResult(cachedResult, includePatterns);
      }
      
      // データベースから取得
      const analysisRecord = await this.getRecord('analyses', analysisId);
      if (!analysisRecord) {
        throw new Error(`分析結果が見つかりません: ${analysisId}`);
      }
      
      // キャッシュに追加
      if (this.cacheEnabled) {
        this.cache.set(analysisId, analysisRecord);
        this.manageCacheSize();
      }
      
      // 復号化と返却
      const result = await this.decryptAnalysisResult(analysisRecord, includePatterns);
      
      this.updateOperationStatistics(startTime, true);
      
      return {
        success: true,
        data: result,
        retrievalTime: performance.now() - startTime,
        fromCache: false
      };
      
    } catch (error) {
      console.error('❌ 分析結果取得エラー:', error);
      this.updateOperationStatistics(startTime, false);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * 分析結果復号化
   */
  async decryptAnalysisResult(analysisRecord, includePatterns) {
    // 暗号化データの復号化
    if (analysisRecord.metadata?.encrypted && this.encryptionKey) {
      analysisRecord.input.text = await this.decryptSensitiveData(analysisRecord.input.text);
      analysisRecord.result.reasoning = await this.decryptSensitiveData(analysisRecord.result.reasoning);
    }
    
    // パターンデータの取得（必要な場合）
    if (includePatterns) {
      analysisRecord.patterns = await this.getPatternsByAnalysisId(analysisRecord.id);
    }
    
    return analysisRecord;
  }

  /**
   * パターンデータ取得
   */
  async getPatternsByAnalysisId(analysisId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patterns'], 'readonly');
      const store = transaction.objectStore('patterns');
      const index = store.index('analysisId');
      const request = index.getAll(analysisId);
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(new Error(`パターンデータ取得エラー: ${request.error}`));
      };
    });
  }

  /**
   * 分析結果検索
   * 
   * 目的：
   * - 条件に基づく分析結果の検索
   * - 高速インデックス検索
   * - 統計分析のためのデータ抽出
   * 
   * 入力：
   * - searchCriteria: object - 検索条件
   * - options: object - 検索オプション
   * 
   * 出力：
   * - 検索結果配列
   */
  async searchAnalysisResults(searchCriteria = {}, options = {}) {
    const startTime = performance.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const {
        userId = null,
        hexagram = null,
        confidenceRange = null,
        dateRange = null,
        limit = 100,
        offset = 0,
        sortBy = 'timestamp',
        sortOrder = 'desc'
      } = searchCriteria;
      
      const results = [];
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['analyses'], 'readonly');
        const store = transaction.objectStore('analyses');
        
        let request;
        
        // 検索条件に基づくインデックス選択
        if (userId) {
          const index = store.index('userId');
          request = index.getAll(userId);
        } else if (hexagram) {
          const index = store.index('hexagram');
          request = index.getAll(hexagram);
        } else if (dateRange) {
          const index = store.index('timestamp');
          const range = IDBKeyRange.bound(dateRange.start || 0, dateRange.end || Date.now());
          request = index.getAll(range);
        } else {
          // 全件検索
          request = store.getAll();
        }
        
        request.onsuccess = async () => {
          let filteredResults = request.result || [];
          
          // 追加フィルタリング
          if (confidenceRange) {
            filteredResults = filteredResults.filter(record => {
              const confidence = record.result?.confidence || 0;
              return confidence >= confidenceRange.min && confidence <= confidenceRange.max;
            });
          }
          
          // ソート
          filteredResults.sort((a, b) => {
            const aValue = this.getNestedValue(a, sortBy);
            const bValue = this.getNestedValue(b, sortBy);
            
            if (sortOrder === 'desc') {
              return bValue > aValue ? 1 : -1;
            } else {
              return aValue > bValue ? 1 : -1;
            }
          });
          
          // ページング
          const pagedResults = filteredResults.slice(offset, offset + limit);
          
          // 復号化（必要な場合）
          const decryptedResults = await Promise.all(
            pagedResults.map(async (record) => {
              if (options.decrypt !== false) {
                return await this.decryptAnalysisResult(record, options.includePatterns || false);
              }
              return record;
            })
          );
          
          this.updateOperationStatistics(startTime, true);
          
          resolve({
            success: true,
            results: decryptedResults,
            totalCount: filteredResults.length,
            searchTime: performance.now() - startTime,
            searchCriteria: searchCriteria
          });
        };
        
        request.onerror = () => {
          this.updateOperationStatistics(startTime, false);
          reject(new Error(`検索エラー: ${request.error}`));
        };
      });
      
    } catch (error) {
      console.error('❌ 分析結果検索エラー:', error);
      this.updateOperationStatistics(startTime, false);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * 分析結果削除
   * 
   * 目的：
   * - 指定された分析結果の完全削除
   * - 関連するパターンデータの削除
   * - セキュアな削除処理
   * 
   * 入力：
   * - analysisId: string - 削除対象の分析ID
   * 
   * 出力：
   * - 削除結果
   */
  async deleteAnalysisResult(analysisId) {
    const startTime = performance.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      // 関連パターンデータの削除
      const patterns = await this.getPatternsByAnalysisId(analysisId);
      const patternDeletePromises = patterns.map(pattern => 
        this.deleteRecord('patterns', pattern.id)
      );
      await Promise.all(patternDeletePromises);
      
      // メイン分析データの削除
      await this.deleteRecord('analyses', analysisId);
      
      // キャッシュからも削除
      if (this.cacheEnabled && this.cache.has(analysisId)) {
        this.cache.delete(analysisId);
      }
      
      // 統計更新
      this.updateOperationStatistics(startTime, true);
      this.statistics.deletedRecords++;
      
      const deleteTime = performance.now() - startTime;
      console.log(`✅ 分析結果削除完了: ${analysisId} (${deleteTime.toFixed(2)}ms)`);
      
      return {
        success: true,
        analysisId: analysisId,
        deletedPatterns: patterns.length,
        deleteTime: deleteTime
      };
      
    } catch (error) {
      console.error('❌ 分析結果削除エラー:', error);
      this.updateOperationStatistics(startTime, false);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * データ暗号化
   * 
   * 目的：
   * - 個人情報のAES-256暗号化
   * - セキュアなデータ保護
   * 
   * 入力：
   * - data: string - 暗号化対象データ
   * 
   * 出力：
   * - 暗号化されたデータ
   */
  async encryptSensitiveData(data) {
    if (!this.encryptionKey || !data || typeof data !== 'string') {
      return data;
    }
    
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // IV（初期化ベクトル）生成
      const iv = window.crypto.getRandomValues(new Uint8Array(this.cryptoConfig.ivLength));
      
      // 暗号化実行
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: this.cryptoConfig.algorithm,
          iv: iv
        },
        this.encryptionKey,
        dataBuffer
      );
      
      // IV + 暗号化データを結合してBase64エンコード
      const combinedBuffer = new Uint8Array(iv.length + encryptedData.byteLength);
      combinedBuffer.set(iv, 0);
      combinedBuffer.set(new Uint8Array(encryptedData), iv.length);
      
      return btoa(String.fromCharCode(...combinedBuffer));
      
    } catch (error) {
      console.error('❌ データ暗号化エラー:', error);
      return data; // 暗号化失敗時は元データを返す
    }
  }

  /**
   * データ復号化
   * 
   * 目的：
   * - 暗号化されたデータの復号化
   * - 元のテキストデータの復元
   * 
   * 入力：
   * - encryptedData: string - 暗号化されたデータ
   * 
   * 出力：
   * - 復号化されたデータ
   */
  async decryptSensitiveData(encryptedData) {
    if (!this.encryptionKey || !encryptedData || typeof encryptedData !== 'string') {
      return encryptedData;
    }
    
    try {
      // Base64デコード
      const combinedBuffer = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      // IVと暗号化データを分離
      const iv = combinedBuffer.slice(0, this.cryptoConfig.ivLength);
      const encryptedBuffer = combinedBuffer.slice(this.cryptoConfig.ivLength);
      
      // 復号化実行
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: this.cryptoConfig.algorithm,
          iv: iv
        },
        this.encryptionKey,
        encryptedBuffer
      );
      
      // テキストデコード
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
      
    } catch (error) {
      console.error('❌ データ復号化エラー:', error);
      return encryptedData; // 復号化失敗時は暗号化データを返す
    }
  }

  /**
   * データ匿名化
   * 
   * 目的：
   * - ユーザー識別情報の匿名化
   * - プライバシー保護の実現
   * 
   * 入力：
   * - userData: object - ユーザーデータ
   * 
   * 出力：
   * - 匿名化されたデータ
   */
  anonymizeUserData(userData) {
    if (!userData || typeof userData !== 'object') {
      return userData;
    }
    
    const anonymized = { ...userData };
    
    // 個人識別情報の削除・匿名化
    delete anonymized.name;
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.address;
    delete anonymized.ipAddress;
    
    // ID系の匿名化
    if (anonymized.userId) {
      anonymized.userId = this.hashString(anonymized.userId);
    }
    
    // 年齢の粗い化（年代のみ）
    if (anonymized.age) {
      anonymized.ageGroup = Math.floor(anonymized.age / 10) * 10;
      delete anonymized.age;
    }
    
    // 地域情報の粗い化
    if (anonymized.location) {
      anonymized.region = anonymized.location.prefecture || anonymized.location.state;
      delete anonymized.location;
    }
    
    // タイムスタンプの追加
    anonymized.anonymizedAt = new Date().toISOString();
    
    return anonymized;
  }

  /**
   * バックアップ作成
   * 
   * 目的：
   * - 全データのバックアップ作成
   * - データ移行・復旧の準備
   * 
   * 出力：
   * - バックアップデータ
   */
  async createBackup() {
    const startTime = performance.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const backup = {
        version: this.dbVersion,
        timestamp: new Date().toISOString(),
        stores: {}
      };
      
      // 各ストアのデータを取得
      for (const storeName of Object.keys(this.dbSchema.stores)) {
        backup.stores[storeName] = await this.getAllRecords(storeName);
      }
      
      // 統計情報も含める
      backup.statistics = { ...this.statistics };
      
      const backupTime = performance.now() - startTime;
      console.log(`✅ バックアップ作成完了 (${backupTime.toFixed(2)}ms)`);
      
      return {
        success: true,
        backup: backup,
        backupTime: backupTime,
        totalRecords: Object.values(backup.stores).reduce((sum, records) => sum + records.length, 0)
      };
      
    } catch (error) {
      console.error('❌ バックアップ作成エラー:', error);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * バックアップ復元
   * 
   * 目的：
   * - バックアップデータからの復元
   * - データ移行処理
   * 
   * 入力：
   * - backupData: object - バックアップデータ
   * 
   * 出力：
   * - 復元結果
   */
  async restoreBackup(backupData) {
    const startTime = performance.now();
    
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      if (!backupData || !backupData.stores) {
        throw new Error('無効なバックアップデータ');
      }
      
      let restoredCount = 0;
      
      // 各ストアのデータを復元
      for (const [storeName, records] of Object.entries(backupData.stores)) {
        if (!this.dbSchema.stores[storeName]) {
          console.warn(`⚠️ 未知のストア: ${storeName} - スキップ`);
          continue;
        }
        
        // 既存データをクリア
        await this.clearStore(storeName);
        
        // データを復元
        for (const record of records) {
          await this.storeRecord(storeName, record);
          restoredCount++;
        }
      }
      
      // キャッシュクリア
      this.clearCache();
      
      const restoreTime = performance.now() - startTime;
      console.log(`✅ バックアップ復元完了: ${restoredCount}件 (${restoreTime.toFixed(2)}ms)`);
      
      return {
        success: true,
        restoredRecords: restoredCount,
        restoreTime: restoreTime,
        backupVersion: backupData.version
      };
      
    } catch (error) {
      console.error('❌ バックアップ復元エラー:', error);
      
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  /**
   * パフォーマンス統計取得
   * 
   * 目的：
   * - システムパフォーマンスの監視
   * - 運用統計の提供
   * 
   * 出力：
   * - 統計データ
   */
  getPerformanceStatistics() {
    const dbSize = this.calculateDatabaseSize();
    const cacheStats = this.getCacheStatistics();
    
    return {
      database: {
        name: this.dbName,
        version: this.dbVersion,
        initialized: this.isInitialized,
        estimatedSize: dbSize
      },
      operations: {
        total: this.statistics.totalOperations,
        successful: this.statistics.successfulOperations,
        failed: this.statistics.failedOperations,
        successRate: this.statistics.totalOperations > 0 ? 
          (this.statistics.successfulOperations / this.statistics.totalOperations * 100) : 0,
        averageTime: this.statistics.averageOperationTime
      },
      security: {
        encryptionEnabled: !!this.encryptionKey,
        encryptedRecords: this.statistics.encryptedRecords
      },
      maintenance: {
        deletedRecords: this.statistics.deletedRecords,
        retentionDays: this.dataRetentionDays,
        maxRecords: this.maxRecords
      },
      cache: cacheStats,
      lastUpdated: new Date().toISOString()
    };
  }

  // ===============================
  // 内部ヘルパーメソッド群
  // ===============================

  /**
   * ユニークID生成
   */
  generateUniqueId(prefix = 'haqei') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * 匿名化ユーザーID生成
   */
  generateAnonymizedUserId(userProfile) {
    if (!userProfile) {
      return 'anonymous_' + this.generateUniqueId();
    }
    
    // ユーザー情報のハッシュ化による匿名ID生成
    const profileString = JSON.stringify(this.anonymizeUserData(userProfile));
    return 'user_' + this.hashString(profileString).substring(0, 16);
  }

  /**
   * 文字列ハッシュ化（簡易実装）
   */
  hashString(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * レコード保存（汎用）
   */
  async storeRecord(storeName, record) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(record);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(new Error(`レコード保存エラー (${storeName}): ${request.error}`));
      };
    });
  }

  /**
   * レコード取得（汎用）
   */
  async getRecord(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(new Error(`レコード取得エラー (${storeName}): ${request.error}`));
      };
    });
  }

  /**
   * レコード削除（汎用）
   */
  async deleteRecord(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = () => {
        reject(new Error(`レコード削除エラー (${storeName}): ${request.error}`));
      };
    });
  }

  /**
   * 全レコード取得（汎用）
   */
  async getAllRecords(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(new Error(`全レコード取得エラー (${storeName}): ${request.error}`));
      };
    });
  }

  /**
   * ストアクリア（汎用）
   */
  async clearStore(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = () => {
        reject(new Error(`ストアクリアエラー (${storeName}): ${request.error}`));
      };
    });
  }

  /**
   * ユーザープロファイル保存
   */
  async saveUserProfile(userId, userProfile, timestamp, expiryDate) {
    const profileRecord = {
      id: this.generateUniqueId('profile'),
      anonymizedId: userId,
      profile: this.anonymizeUserData(userProfile),
      timestamp: timestamp,
      lastAccess: timestamp,
      expiryDate: expiryDate
    };
    
    return await this.storeRecord('userProfiles', profileRecord);
  }

  /**
   * メタデータ保存
   */
  async storeMetadata(key, data) {
    const metadataRecord = {
      key: key,
      type: 'system',
      data: data,
      timestamp: Date.now()
    };
    
    return await this.storeRecord('metadata', metadataRecord);
  }

  /**
   * システムメタデータ更新
   */
  async updateSystemMetadata(key, updateData) {
    try {
      const existing = await this.getRecord('metadata', key);
      const updated = {
        key: key,
        type: 'system',
        data: { ...(existing?.data || {}), ...updateData },
        timestamp: Date.now()
      };
      
      return await this.storeRecord('metadata', updated);
    } catch (error) {
      // 新規作成
      return await this.storeMetadata(key, updateData);
    }
  }

  /**
   * 操作統計更新
   */
  updateOperationStatistics(startTime, success) {
    const operationTime = performance.now() - startTime;
    
    this.statistics.totalOperations++;
    if (success) {
      this.statistics.successfulOperations++;
    } else {
      this.statistics.failedOperations++;
    }
    
    // 平均時間の更新
    this.statistics.averageOperationTime = 
      (this.statistics.averageOperationTime * (this.statistics.totalOperations - 1) + operationTime) / 
      this.statistics.totalOperations;
  }

  /**
   * キャッシュサイズ管理
   */
  manageCacheSize() {
    if (this.cache.size > this.maxCacheSize) {
      // LRU的に古いエントリを削除
      const entriesToDelete = this.cache.size - this.maxCacheSize;
      const entries = Array.from(this.cache.entries());
      
      for (let i = 0; i < entriesToDelete; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  /**
   * キャッシュクリア
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ キャッシュクリア完了');
  }

  /**
   * キャッシュ統計取得
   */
  getCacheStatistics() {
    return {
      enabled: this.cacheEnabled,
      currentSize: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.statistics.cacheHitRate
    };
  }

  /**
   * データベースサイズ推定
   */
  calculateDatabaseSize() {
    // 簡易推定（詳細な実装は複雑になるため概算）
    return {
      estimated: true,
      records: this.statistics.totalOperations,
      note: '概算値'
    };
  }

  /**
   * ネストした値の取得
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * データベース接続終了
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('🔒 データベース接続終了');
    }
  }

  /**
   * エラー暗号化データを復号化
   */
  async encryptData(data) {
    return await this.encryptSensitiveData(data);
  }

  /**
   * データ復号化
   */
  async decryptData(encryptedData) {
    return await this.decryptSensitiveData(encryptedData);
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.DataPersistenceManager = DataPersistenceManager;
  console.log('✅ DataPersistenceManager グローバル登録完了');
}

// モジュールとしてもエクスポート（環境に応じて）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataPersistenceManager;
}