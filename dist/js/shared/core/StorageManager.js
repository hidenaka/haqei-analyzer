// HaQei Analyzer - Enhanced Storage Manager
// 高性能なローカルストレージを管理するクラス
class StorageManager {
  constructor(options = {}) {
    // 設定オプション
    this.config = {
      storagePrefix: options.storagePrefix || 'haqei_analyzer_',
      version: options.version || '2.0.0',
      compressionEnabled: options.compressionEnabled !== false,
      cacheMaxSize: options.cacheMaxSize || 200,
      compressionThreshold: options.compressionThreshold || 1024,
      debugMode: options.debugMode || false,
      encryptionEnabled: options.encryptionEnabled || false,
      performanceOptimized: options.performanceOptimized !== false
    };
    
    // レガシー互換性のため
    this.storagePrefix = this.config.storagePrefix;
    this.version = this.config.version;
    this.compressionEnabled = this.config.compressionEnabled;
    this.debugMode = this.config.debugMode;
    // メモリ管理システム
    this.memoryManager = {
      trackingEnabled: this.config.performanceOptimized,
      allocatedMemory: 0,
      maxMemoryLimit: 20 * 1024 * 1024, // 20MB制限に拡張
      cleanupInterval: null,
      lastCleanup: Date.now(),
      cleanupThreshold: 0.8 // 80%でクリーンアップ開始
    };
    
    // パフォーマンスメトリクス
    this.performanceMetrics = {
      operations: 0,
      totalTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      compressionRatio: 0,
      averageOperationTime: 0,
      errorCount: 0
    };
    // キャッシュシステム
    this.cache = new Map();
    this.cacheMaxSize = this.config.cacheMaxSize;
    
    // デバウンス制御 - 改善版
    this.debounceTimers = new Map();
    this.lastBackupTime = new Map();
    this.backupCooldown = 5000; // 5秒間隔に短縮（パフォーマンス向上）
    this.consecutiveBackupCount = new Map();
    
    // セキュリティ機能
    this.securityManager = {
      enabled: this.config.encryptionEnabled,
      keyRotationInterval: 24 * 60 * 60 * 1000, // 24時間
      lastKeyRotation: Date.now(),
      accessAttempts: new Map()
    };
    
    // 初期化実行
    this.init();
  }

  init() {
    // ストレージの初期化とバージョン管理
    this.checkVersion();
    this.initMemoryManagement();
    this.initPerformanceMonitoring();
    this.cleanupOldData();
    console.log('🗄️ Enhanced StorageManager initialized with compression and caching');
  }

  // メモリ管理の初期化
  initMemoryManagement() {
    if (this.memoryManager.trackingEnabled) {
      // 定期的なメモリクリーンアップ
      this.memoryManager.cleanupInterval = setInterval(() => {
        this.performMemoryCleanup();
      }, 300000); // 5分ごと
      
      // ページ離脱時のクリーンアップ
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          this.cleanup();
        });
      }
    }
  }

  // パフォーマンス監視の初期化（軽量化）
  initPerformanceMonitoring() {
    // パフォーマンス統計の定期リセット
    setInterval(() => {
      if (this.performanceMetrics.operations > 2000) {
        this.resetPerformanceMetrics();
      }
    }, 900000); // 15分ごとに変更
  }

  // 古いデータのクリーンアップ（強化版）
  cleanupOldData() {
    try {
      const keys = Object.keys(localStorage);
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      let cleanedCount = 0;
      let corruptedCount = 0;
      
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              // Enhanced validation for corrupted data
              if (this.isCorruptedData(item)) {
                localStorage.removeItem(key);
                this.cache.delete(key.replace(this.storagePrefix, ''));
                corruptedCount++;
                console.log(`🧹 Removed corrupted data: ${key}`);
                return;
              }
              
              const data = JSON.parse(item);
              if (data.timestamp && data.timestamp < oneWeekAgo) {
                localStorage.removeItem(key);
                this.cache.delete(key.replace(this.storagePrefix, ''));
                cleanedCount++;
                console.log(`🧹 Cleaned up old data: ${key}`);
              }
            }
          } catch (error) {
            // 破損したデータを削除
            localStorage.removeItem(key);
            this.cache.delete(key.replace(this.storagePrefix, ''));
            corruptedCount++;
            console.log(`🧹 Removed corrupted data: ${key}`);
          }
        }
      });
      
      if (cleanedCount > 0 || corruptedCount > 0) {
        console.log(`🧹 Cleanup complete: ${cleanedCount} old items, ${corruptedCount} corrupted items removed`);
      }
    } catch (error) {
      console.warn('⚠️ Cleanup failed:', error);
    }
  }

  // セッションデータの有効性検証
  isValidSessionData(sessionData) {
    try {
      // 基本的な構造チェック
      if (!sessionData || typeof sessionData !== 'object') {
        return false;
      }
      
      // 必須フィールドの存在確認（柔軟な検証）
      const hasValidStructure = (
        sessionData.hasOwnProperty('sessionId') ||
        sessionData.hasOwnProperty('startTime') ||
        sessionData.hasOwnProperty('lastActivity') ||
        Object.keys(sessionData).length > 0
      );
      
      return hasValidStructure;
    } catch (error) {
      return false;
    }
  }
  
  // セッションデータ復旧処理
  attemptSessionRecovery() {
    try {
      console.log('🔄 Attempting session data recovery...');
      
      // 1. バックアップからの復旧を試行
      const backupSession = this.getBackupData('session');
      if (backupSession && this.isValidSessionData(backupSession)) {
        console.log('✅ Session recovered from backup');
        this.setItem('session', backupSession);
        return backupSession;
      }
      
      // 2. 部分的データからセッションを再構成
      const partialSession = this.reconstructSessionFromFragments();
      if (partialSession) {
        console.log('✅ Session reconstructed from fragments');
        this.setItem('session', partialSession);
        return partialSession;
      }
      
      // 3. 最後の手段：破損したセッションをクリア
      console.warn('⚠️ Unable to recover session, clearing corrupted data');
      this.removeItem('session');
      return null;
      
    } catch (error) {
      console.error('❌ Session recovery failed:', error);
      this.removeItem('session');
      return null;
    }
  }
  
  // セッションフラグメントからの再構成
  reconstructSessionFromFragments() {
    try {
      const fragments = {
        lastAnalysisResult: this.getItem('analysis_result'),
        lastInsights: this.getItem('insights'),
        lastTripleOS: this.getItem('triple_os_result'),
        userSettings: this.getItem('settings')
      };
      
      // 有効なフラグメントが存在する場合、基本セッションを作成
      const validFragments = Object.values(fragments).filter(f => f !== null);
      if (validFragments.length > 0) {
        return {
          sessionId: this.generateSessionId(),
          startTime: Date.now(),
          lastActivity: Date.now(),
          recovered: true,
          recoveryTimestamp: Date.now(),
          ...fragments
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ Session reconstruction failed:', error);
      return null;
    }
  }
  
  // データ破損検証（改良版）
  isCorruptedData(item) {
    try {
      // 基本的な型チェック
      if (typeof item !== 'string') {
        return false;
      }
      
      // 空文字や非常に短い文字列
      if (!item || item.length < 2) {
        return true;
      }
      
      // JSON解析試行
      let parsed;
      try {
        parsed = JSON.parse(item);
      } catch (parseError) {
        // JSON解析に失敗した場合、文字列データの可能性を考慮
        return this.isStringDataCorrupted(item);
      }
      
      // オブジェクトの破損パターンチェック
      if (typeof parsed === 'object' && parsed !== null) {
        const keys = Object.keys(parsed);
        
        // 数値インデックスの異常パターン検出
        const numericKeys = keys.filter(key => /^\d+$/.test(key));
        if (numericKeys.length > keys.length * 0.8 && keys.length > 20) {
          return true;
        }
        
        // 循環参照やネストが深すぎる構造
        if (this.hasCircularReference(parsed) || this.getNestedDepth(parsed) > 10) {
          return true;
        }
      }
      
      // 基本的な構造チェックは通過
      return false;
      
    } catch (error) {
      return true;
    }
  }
  
  // 文字列データの破損チェック
  isStringDataCorrupted(item) {
    // 制御文字や無効な文字の検出
    const hasControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(item);
    if (hasControlChars) {
      return true;
    }
    
    // 極端に長い行の検出
    const lines = item.split('\n');
    const hasExtremelyLongLine = lines.some(line => line.length > 10000);
    if (hasExtremelyLongLine) {
      return true;
    }
    
    return false;
  }
  
  // 循環参照の検出
  hasCircularReference(obj, seen = new WeakSet()) {
    if (obj && typeof obj === 'object') {
      if (seen.has(obj)) {
        return true;
      }
      seen.add(obj);
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && this.hasCircularReference(obj[key], seen)) {
          return true;
        }
      }
    }
    return false;
  }
  
  // ネストの深さ計算
  getNestedDepth(obj, depth = 0) {
    if (depth > 10) return depth; // 早期終了
    
    if (obj && typeof obj === 'object') {
      let maxDepth = depth;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const childDepth = this.getNestedDepth(obj[key], depth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      }
      return maxDepth;
    }
    return depth;
  }
  
  // バックアップデータの取得
  getBackupData(key) {
    try {
      const backupKey = `${key}_backup_${Math.floor(Date.now() / (24 * 60 * 60 * 1000))}`;
      return this.getItem(backupKey);
    } catch (error) {
      return null;
    }
  }
  
  // 重要なデータかどうかを判定
  isCriticalData(key) {
    const criticalKeys = [
      'session',
      'analysis_result',
      'unified_diagnosis_data',
      'answers',
      'insights',
      'triple_os_result',
      'progress',
      'settings'
    ];
    return criticalKeys.includes(key);
  }
  
  // データバックアップの作成（強化スロットル付き）
  createBackup(key, data) {
    try {
      const now = Date.now();
      const lastBackup = this.lastBackupTime.get(key) || 0;
      const consecutiveCount = this.consecutiveBackupCount.get(key) || 0;
      
      // 強化スロットル制御：連続バックアップ回数に応じて制限を厳しくする
      const dynamicCooldown = this.backupCooldown + (consecutiveCount * 2000); // 連続回数 × 2秒追加
      
      if (now - lastBackup < dynamicCooldown) {
        // 連続バックアップ回数を増加
        this.consecutiveBackupCount.set(key, consecutiveCount + 1);
        return; // バックアップをスキップ
      }
      
      // バックアップ実行時は連続回数をリセット
      this.consecutiveBackupCount.set(key, 0);
      
      const backupKey = `${key}_backup_${Math.floor(now / (24 * 60 * 60 * 1000))}`;
      // 直接localStorage.setItemを使用してsetItemの無限ループを防ぐ
      const jsonString = JSON.stringify({
        value: data,
        timestamp: now,
        version: this.version,
        originalKey: key,
        backup: true
      });
      localStorage.setItem(this.getKey(backupKey), jsonString);
      this.lastBackupTime.set(key, now);
      
      // バックアップログも制限
      if (this.debugMode || window.location.search.includes('verbose=true')) {
        console.log(`💾 Backup created for ${key} (enhanced throttle)`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to create backup for ${key}:`, error);
    }
  }

  // バージョン確認と必要に応じてデータクリア
  checkVersion() {
    const storedVersion = this.getItem('version');
    
    // バージョン比較の改善 - 数値として正規化して比較
    const normalizedStoredVersion = storedVersion ? String(storedVersion).replace(/["']/g, '').trim() : null;
    const normalizedCurrentVersion = String(this.version).replace(/["']/g, '').trim();
    
    console.log(`📦 Version check: stored="${normalizedStoredVersion}", current="${normalizedCurrentVersion}"`);
    
    if (!normalizedStoredVersion) {
      // バージョン情報がない場合は新規セットアップ
      console.log(`📦 No version found, setting version to ${normalizedCurrentVersion}`);
      this.setItem('version', this.version);
      return;
    }
    
    // 完全一致チェック - 文字列・数値の違いを吸収
    if (normalizedStoredVersion === normalizedCurrentVersion) {
      console.log(`📦 Version match, no action needed`);
      return;
    }
    
    // メジャーバージョンのみチェック（マイナーバージョン変更では削除しない）
    const storedMajor = this.extractMajorVersion(normalizedStoredVersion);
    const currentMajor = this.extractMajorVersion(normalizedCurrentVersion);
    
    console.log(`📦 Major version comparison: stored=${storedMajor}, current=${currentMajor}`);
    
    if (storedMajor !== currentMajor) {
      console.log(`📦 Major version changed from ${normalizedStoredVersion} to ${normalizedCurrentVersion}`);
      console.log('⚠️ TEMPORARY: Skipping storage clear to preserve analysis data');
      // this.clearAll(); // 一時的に無効化
      this.setItem('version', this.version);
    } else {
      // マイナーバージョン変更の場合は更新のみ
      console.log(`📦 Minor version update from ${normalizedStoredVersion} to ${normalizedCurrentVersion}, updating version only`);
      this.setItem('version', this.version);
    }
  }
  
  // メジャーバージョン番号を抽出
  extractMajorVersion(version) {
    try {
      const versionStr = String(version);
      const parts = versionStr.split('.');
      return parts[0] || '1';
    } catch (error) {
      console.warn('⚠️ Version parsing failed:', error);
      return '1';
    }
  }

  // キーにプレフィックスを付加
  getKey(key) {
    return `${this.storagePrefix}${key}`;
  }

  // 高効率データ圧縮機能
  compressData(data) {
    if (!this.compressionEnabled || typeof data !== 'string') {
      return { compressed: false, data: data };
    }
    
    if (data.length < this.compressionThreshold) {
      return { compressed: false, data: data };
    }
    
    try {
      // 高効率圧縮アルゴリズム
      let compressed = data;
      
      // 1. JSON最適化
      if (this.isJSON(data)) {
        try {
          const parsed = JSON.parse(data);
          compressed = JSON.stringify(parsed); // 不要な空白を除去
        } catch (e) {
          // JSON解析失敗時は通常の圧縮を続行
        }
      }
      
      // 2. 文字列最適化
      compressed = compressed
        .replace(/\s+/g, ' ') // 複数スペースを単一に
        .replace(/\n\s*\n/g, '\n') // 空行の削除
        .replace(/,\s*}/g, '}') // 末尾カンマ除去
        .replace(/,\s*]/g, ']') // 配列末尾カンマ除去
        .trim();
      
      // 3. 反復パターン圧縮
      compressed = this.compressRepeatedPatterns(compressed);
      
      const compressionRatio = compressed.length / data.length;
      
      if (compressionRatio < 0.85) { // より厳しい圧縮基準
        return { 
          compressed: true, 
          data: compressed, 
          originalSize: data.length,
          algorithm: 'optimized'
        };
      }
      
      return { compressed: false, data: data };
    } catch (error) {
      console.warn('⚠️ Compression failed:', error);
      return { compressed: false, data: data };
    }
  }
  
  // 反復パターン圧縮
  compressRepeatedPatterns(data) {
    const patterns = new Map();
    const minPatternLength = 10;
    const maxPatterns = 50;
    
    // 短いパターンを検出して置換
    for (let len = minPatternLength; len <= Math.min(100, data.length / 4); len++) {
      for (let i = 0; i <= data.length - len * 2; i++) {
        const pattern = data.substr(i, len);
        const count = (data.match(new RegExp(this.escapeRegExp(pattern), 'g')) || []).length;
        
        if (count >= 3 && patterns.size < maxPatterns) {
          patterns.set(pattern, count);
        }
      }
    }
    
    // 効果の高いパターンから置換
    const sortedPatterns = Array.from(patterns.entries())
      .sort((a, b) => (b[0].length * b[1]) - (a[0].length * a[1]))
      .slice(0, 20);
    
    let compressed = data;
    sortedPatterns.forEach(([pattern, count], index) => {
      if (count >= 3) {
        const placeholder = `§${index}§`;
        compressed = compressed.replace(new RegExp(this.escapeRegExp(pattern), 'g'), placeholder);
        compressed = `${placeholder}=${pattern}|${compressed}`;
      }
    });
    
    return compressed;
  }
  
  // JSONチェック
  isJSON(str) {
    return str.trim().startsWith('{') || str.trim().startsWith('[');
  }
  
  // 正規表現エスケープ
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 高効率データ展開機能
  decompressData(compressedData) {
    if (!compressedData.compressed) {
      return compressedData.data;
    }
    
    try {
      let data = compressedData.data;
      
      if (compressedData.algorithm === 'optimized') {
        // 反復パターン展開
        data = this.decompressRepeatedPatterns(data);
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ Decompression failed:', error);
      return compressedData.data;
    }
  }
  
  // 反復パターン展開
  decompressRepeatedPatterns(data) {
    // パターン定義を分離
    const parts = data.split('|');
    if (parts.length < 2) return data;
    
    const patternDefs = parts[0];
    let content = parts.slice(1).join('|');
    
    // パターンを復元
    const patterns = patternDefs.split('§').filter(Boolean);
    patterns.forEach((def, index) => {
      if (def.includes('=')) {
        const [placeholder, pattern] = def.split('=', 2);
        const placeholderRegex = new RegExp(`§${index}§`, 'g');
        content = content.replace(placeholderRegex, pattern);
      }
    });
    
    return content;
  }

  // アイテムの保存（最適化版・自動バックアップ対応）
  setItem(key, value) {
    const startTime = performance.now();
    
    try {
      // 重要なデータの場合、既存データをバックアップ
      if (this.isCriticalData(key)) {
        const existingData = this.getItem(key);
        if (existingData !== null) {
          this.createBackup(key, existingData);
        }
      }
      
      // 軽量化: 小さなデータは圧縮をスキップ
      const jsonString = JSON.stringify(value);
      const shouldCompress = jsonString.length > 5000; // 5KB以上のみ圧縮
      
      const compressed = shouldCompress ? this.compressData(jsonString) : { compressed: false, data: jsonString };
      
      const data = {
        value: compressed.data,
        timestamp: Date.now(),
        version: this.version,
        compressed: compressed.compressed,
        originalSize: compressed.originalSize || jsonString.length,
        size: compressed.data.length
      };
      
      const finalData = JSON.stringify(data);
      localStorage.setItem(this.getKey(key), finalData);
      
      // キャッシュに保存
      this.updateCache(key, value);
      
      // メモリ使用量を更新
      this.memoryManager.allocatedMemory += finalData.length;
      
      // パフォーマンス統計を更新
      this.updatePerformanceMetrics(startTime);
      
      // 🚀 Performance optimization: Reduced logging
      if (this.debugMode) {
        console.log(`💾 Saved to storage: ${key} (${this.formatBytes(finalData.length)})`);
        
        if (compressed.compressed) {
          const ratio = ((1 - compressed.data.length / compressed.originalSize) * 100).toFixed(1);
          console.log(`🗜️ Compressed: ${ratio}% reduction`);
        }
      }
      
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('⚠️ Storage quota exceeded, attempting cleanup...');
        this.performStorageCleanup();
        
        // クリーンアップ後に再試行
        try {
          const retryData = JSON.stringify({
            value: value,
            timestamp: Date.now(),
            version: this.version
          });
          localStorage.setItem(this.getKey(key), retryData);
          return true;
        } catch (retryError) {
          console.error('❌ Storage save failed after cleanup:', retryError);
          return false;
        }
      }
      
      console.error('❌ Storage save failed:', error);
      return false;
    }
  }

  // キャッシュ管理
  updateCache(key, value) {
    // キャッシュサイズ制限
    if (this.cache.size >= this.cacheMaxSize) {
      // LRU: 最も古いエントリを削除
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value: value,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  // アイテムの取得（強化版）
  getItem(key) {
    const startTime = performance.now();
    
    try {
      // キャッシュから取得を試行
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        cached.accessCount++;
        cached.lastAccess = Date.now();
        
        this.performanceMetrics.cacheHits++;
        this.updatePerformanceMetrics(startTime);
        
        if (this.debugMode) console.log(`🚀 Cache hit: ${key}`);
        return cached.value;
      }
      
      this.performanceMetrics.cacheMisses++;
      
      const item = localStorage.getItem(this.getKey(key));
      if (!item) {
        this.updatePerformanceMetrics(startTime);
        return null;
      }

      // 🔧 Enhanced JSON parsing with validation
      let data;
      try {
        data = JSON.parse(item);
        
        // Validate data structure
        if (!data || typeof data !== 'object') {
          console.warn(`⚠️ Invalid data structure for key: ${key}`);
          this.removeItem(key);
          this.updatePerformanceMetrics(startTime);
          return null;
        }
        
      } catch (parseError) {
        console.warn(`⚠️ JSON parse failed for key: ${key}`, parseError);
        // Remove corrupted data immediately
        localStorage.removeItem(this.getKey(key));
        this.cache.delete(key);
        this.updatePerformanceMetrics(startTime);
        return null;
      }
      
      // バージョン確認
      if (data.version !== this.version) {
        console.log(`⚠️ Version mismatch for ${key}, removing`);
        this.removeItem(key);
        this.updatePerformanceMetrics(startTime);
        return null;
      }

      // データの展開 with enhanced error handling
      let value;
      try {
        if (data.compressed) {
          const decompressed = this.decompressData({ compressed: true, data: data.value });
          if (!decompressed || typeof decompressed !== 'string') {
            console.warn(`⚠️ Decompression failed for key: ${key}`);
            this.removeItem(key);
            this.updatePerformanceMetrics(startTime);
            return null;
          }
          value = JSON.parse(decompressed);
        } else {
          value = data.value;
        }
        
        // Final validation of extracted value
        if (value === undefined) {
          console.warn(`⚠️ Extracted value is undefined for key: ${key}`);
          this.removeItem(key);
          this.updatePerformanceMetrics(startTime);
          return null;
        }
        
      } catch (decompressionError) {
        console.warn(`⚠️ Data extraction failed for key: ${key}`, decompressionError);
        this.removeItem(key);
        this.updatePerformanceMetrics(startTime);
        return null;
      }
      
      // キャッシュに保存
      this.updateCache(key, value);
      
      this.updatePerformanceMetrics(startTime);
      return value;
    } catch (error) {
      console.error('❌ Storage get failed:', error);
      
      // 破損したデータの場合は削除
      try {
        this.removeItem(key);
      } catch (removeError) {
        console.error('❌ Failed to remove corrupted data:', removeError);
      }
      
      this.updatePerformanceMetrics(startTime);
      return null;
    }
  }

  // アイテムの削除（強化版）
  removeItem(key) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item) {
        const data = JSON.parse(item);
        const itemSize = JSON.stringify(data).length;
        this.memoryManager.allocatedMemory -= itemSize;
      }
      
      localStorage.removeItem(this.getKey(key));
      
      // キャッシュからも削除
      this.cache.delete(key);
      
      console.log(`🗑️ Removed from storage: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Storage remove failed:', error);
      return false;
    }
  }

  // アイテムの存在確認
  hasItem(key) {
    return this.getItem(key) !== null;
  }

  // 高効率メモリクリーンアップ
  performMemoryCleanup() {
    try {
      const now = Date.now();
      const maxAge = 30 * 60 * 1000;
      const criticalMemoryRatio = 0.9;
      
      let cleanedCount = 0;
      const memoryUsageRatio = this.memoryManager.allocatedMemory / this.memoryManager.maxMemoryLimit;
      
      // メモリ使用率に応じてクリーンアップ強度を調整
      const aggressiveCleanup = memoryUsageRatio > criticalMemoryRatio;
      const cleanupAge = aggressiveCleanup ? 15 * 60 * 1000 : maxAge; // 15分 or 30分
      const minAccessCount = aggressiveCleanup ? 1 : 2;
      
      // LRU + アクセス頻度ベースのクリーンアップ
      const cacheEntries = Array.from(this.cache.entries())
        .sort((a, b) => {
          const ageA = now - a[1].timestamp;
          const ageB = now - b[1].timestamp;
          const scoreA = a[1].accessCount / (ageA / 1000);
          const scoreB = b[1].accessCount / (ageB / 1000);
          return scoreA - scoreB; // スコアの低い順（削除対象）
        });
      
      for (const [key, data] of cacheEntries) {
        const age = now - data.timestamp;
        const shouldDelete = age > cleanupAge || 
                           data.accessCount < minAccessCount ||
                           (aggressiveCleanup && cleanedCount < this.cache.size * 0.5);
        
        if (shouldDelete) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }
      
      // メモリ使用量を正確に再計算
      this.memoryManager.allocatedMemory = this.calculateActualMemoryUsage();
      
      if (this.debugMode) {
        console.log(`🧹 Memory cleanup completed: ${cleanedCount} items removed, memory usage: ${(this.memoryManager.allocatedMemory / this.memoryManager.maxMemoryLimit * 100).toFixed(1)}%`);
      }
    } catch (error) {
      console.warn('⚠️ Memory cleanup failed:', error);
    }
  }

  // ストレージクリーンアップの実行
  performStorageCleanup() {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24時間
      let cleanedCount = 0;
      
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const data = JSON.parse(item);
              if (data.timestamp && (now - data.timestamp) > maxAge) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            }
          } catch (error) {
            // 破損したデータを削除
            localStorage.removeItem(key);
            cleanedCount++;
          }
        }
      });
      
      console.log(`🧹 Storage cleanup completed: ${cleanedCount} items removed`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ Storage cleanup failed:', error);
      return 0;
    }
  }

  // 実際のメモリ使用量を計算
  calculateActualMemoryUsage() {
    try {
      const keys = Object.keys(localStorage);
      let totalSize = 0;
      
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += item.length * 2; // Unicode文字は2バイト
          }
        }
      });
      
      return totalSize;
    } catch (error) {
      console.warn('⚠️ Memory calculation failed:', error);
      return 0;
    }
  }

  // 全てのアプリケーションデータをクリア（強化版）
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
      
      // キャッシュもクリア
      this.cache.clear();
      
      // メモリ使用量をリセット
      this.memoryManager.allocatedMemory = 0;
      
      console.log('🧹 All storage and cache cleared');
      return true;
    } catch (error) {
      console.error('❌ Storage clear failed:', error);
      return false;
    }
  }

  // 緊急クリーンアップ - 破損データのみ除去
  emergencyCleanup() {
    try {
      const keys = Object.keys(localStorage);
      let removedCount = 0;
      
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          try {
            const item = localStorage.getItem(key);
            if (item && this.isCorruptedData(item)) {
              localStorage.removeItem(key);
              this.cache.delete(key.replace(this.storagePrefix, ''));
              removedCount++;
              console.log(`🚨 Emergency cleanup: removed ${key}`);
            }
          } catch (error) {
            localStorage.removeItem(key);
            this.cache.delete(key.replace(this.storagePrefix, ''));
            removedCount++;
            console.log(`🚨 Emergency cleanup: removed corrupted ${key}`);
          }
        }
      });
      
      console.log(`🚨 Emergency cleanup complete: ${removedCount} corrupted items removed`);
      return removedCount;
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
      return 0;
    }
  }

  // 回答の保存
  saveAnswers(answers) {
    return this.setItem('answers', answers);
  }

  // 回答の取得
  getAnswers() {
    return this.getItem('answers') || [];
  }

  // 進行状況の保存（デバウンス付き）
  saveProgress(progress) {
    const progressData = {
      currentQuestionIndex: progress.currentQuestionIndex || 0,
      totalQuestions: progress.totalQuestions || 0,
      completedQuestions: progress.completedQuestions || 0,
      progressPercentage: progress.progressPercentage || 0,
      lastUpdated: Date.now()
    };
    
    // デバウンス処理
    const debounceKey = 'saveProgress';
    if (this.debounceTimers.has(debounceKey)) {
      clearTimeout(this.debounceTimers.get(debounceKey));
    }
    
    const timer = setTimeout(() => {
      this.setItem('progress', progressData);
      this.debounceTimers.delete(debounceKey);
    }, 1000); // 1秒のデバウンス
    
    this.debounceTimers.set(debounceKey, timer);
  }

  // 進行状況の取得
  getProgress() {
    return this.getItem('progress');
  }

  // 分析結果の保存（セッション履歴付き）
  saveAnalysisResult(result) {
    try {
      // 通常の保存
      const success = this.setItem('analysis_result', result);
      
      // セッション履歴にも保存（フォールバック用）
      if (success && result) {
        this.updateSession({ 
          lastAnalysisResult: result,
          lastAnalysisTime: Date.now()
        });
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to save analysis result:', error);
      return false;
    }
  }

  // 分析結果の取得（フォールバック機能付き）
  getAnalysisResult() {
    try {
      // 1. 通常の取得を試行
      let result = this.getItem('analysis_result');
      if (result) {
        console.log('📊 Analysis result retrieved successfully');
        return result;
      }
      
      // 2. 統一診断データからの復旧を試行
      console.log('🔄 Attempting to recover analysis result from unified diagnosis data...');
      const unifiedData = this.getItem('unified_diagnosis_data');
      if (unifiedData && unifiedData.tripleOS) {
        console.log('✅ Analysis result recovered from unified data');
        // 回復したデータを保存
        this.setItem('analysis_result', unifiedData.tripleOS);
        return unifiedData.tripleOS;
      }
      
      // 3. 質問・回答データからの再構築を試行
      console.log('🔄 Attempting to rebuild from question answers...');
      const answers = this.getItem('question_answers') || this.getItem('answers');
      if (answers && Array.isArray(answers) && answers.length > 0) {
        console.log(`🔧 Rebuilding analysis from ${answers.length} answers`);
        const rebuiltResult = this.rebuildAnalysisFromAnswers(answers);
        if (rebuiltResult) {
          console.log('✅ Analysis result rebuilt from answers');
          this.setItem('analysis_result', rebuiltResult);
          return rebuiltResult;
        }
      }
      
      // 4. セッション履歴からの復旧を試行
      console.log('🔄 Attempting to recover from session history...');
      const session = this.getSession();
      if (session && session.lastAnalysisResult) {
        console.log('✅ Analysis result recovered from session');
        this.setItem('analysis_result', session.lastAnalysisResult);
        return session.lastAnalysisResult;
      }
      
      // 4. バックアップからの復旧を試行
      const backupResult = this.attemptBackupRecovery('analysis_result');
      if (backupResult) {
        console.log('✅ Analysis result recovered from backup');
        return backupResult;
      }
      
      // 5. 緊急フォールバック: デモデータ生成
      console.log('🔄 Generating emergency fallback data...');
      const fallbackResult = this.generateFallbackAnalysisResult();
      if (fallbackResult) {
        console.log('⚠️ Using fallback analysis result');
        return fallbackResult;
      }
      
      console.log('⚠️ No analysis result found after all recovery attempts');
      return null;
      
    } catch (error) {
      console.error('❌ Error retrieving analysis result:', error);
      return null;
    }
  }
  
  // 回答データから分析結果を再構築（分人思想トリプルOS対応）
  rebuildAnalysisFromAnswers(answers) {
    try {
      console.log('🔧 Rebuilding analysis from answers using 分人思想 framework...');
      
      // 🚀 修正: 入力パラメータの型安全性チェック
      if (!answers || !Array.isArray(answers)) {
        console.warn('⚠️ rebuildAnalysisFromAnswers: Invalid answers parameter:', typeof answers, answers);
        return this.generateFallbackAnalysisResult();
      }
      
      // データベースから実際のヘキサグラムデータを取得
      const hexagramsData = this.getHexagramsDatabase();
      const vectorsData = this.getVectorsDatabase();
      
      if (!hexagramsData || !vectorsData) {
        console.warn('⚠️ Database not available, using fallback analysis');
        return this.generateFallbackAnalysisResult();
      }
      
      // 回答からより詳細な分析を実行
      const analysisMetrics = this.analyzeAnswerPatterns(answers);
      
      // 各OSの適切なヘキサグラムを選択
      const selectedHexagrams = this.selectHexagramsForTripleOS(analysisMetrics, hexagramsData, vectorsData);
      
      // 分人思想トリプルOS構造での結果作成
      const analysisResult = {
        engineOS: this.buildOSProfile(
          'engine',
          selectedHexagrams.engine,
          analysisMetrics.engineScore,
          analysisMetrics.total,
          hexagramsData
        ),
        interfaceOS: this.buildOSProfile(
          'interface',
          selectedHexagrams.interface,
          analysisMetrics.interfaceScore,
          analysisMetrics.total,
          hexagramsData
        ),
        safeModeOS: this.buildOSProfile(
          'safeMode',
          selectedHexagrams.safeMode,
          analysisMetrics.safeModeScore,
          analysisMetrics.total,
          hexagramsData
        ),
        // 統合情報
        consistencyScore: this.calculateConsistencyScore(analysisMetrics),
        integration: this.generateIntegrationInsights(analysisMetrics, selectedHexagrams),
        // メタデータ
        timestamp: Date.now(),
        rebuilt: true,
        dataSource: 'rebuilt_from_database',
        tripleOSPhilosophy: true,
        sourceAnswers: answers.length,
        qualityScore: Math.min(0.8, analysisMetrics.total / 20),
        notice: '回答データから実際のデータベースを用いて再構築された結果です。'
      };
      
      console.log('🔧 Rebuilt analysis with database integration:', {
        engineHexagram: selectedHexagrams.engine?.hexagram_id,
        interfaceHexagram: selectedHexagrams.interface?.hexagram_id,
        safeModeHexagram: selectedHexagrams.safeMode?.hexagram_id,
        total: analysisMetrics.total,
        consistency: analysisResult.consistencyScore
      });
      
      return analysisResult;
    } catch (error) {
      console.error('❌ Failed to rebuild analysis:', error);
      return this.generateFallbackAnalysisResult();
    }
  }
  
  // 緊急フォールバック用のデモ分析結果生成（分人思想トリプルOS対応）- 完全動的化
  generateFallbackAnalysisResult() {
    try {
      console.log('🔄 Generating dynamic fallback analysis with intelligent hexagram selection...');
      
      // 1. 既存のos_analyzer分析結果を確認
      const existingOSResult = this.attemptOSResultRecovery();
      if (existingOSResult) {
        console.log('✅ Using recovered OS analysis result for dynamic fallback');
        return this.enhanceOSResultWithDynamicContent(existingOSResult);
      }
      
      // 2. データベースから実際のヘキサグラムデータを取得
      const hexagramsData = this.getHexagramsDatabase();
      const haqeiDatabase = this.getHaqeiDatabase();
      
      if (hexagramsData && hexagramsData.length > 0) {
        // 3. ユーザーの回答パターンから動的選択
        const rawAnswers = this.getAnswers() || this.getItem('question_answers') || [];
        const userAnswers = Array.isArray(rawAnswers) ? rawAnswers : [];
        console.log('🔍 generateFallbackAnalysisResult: userAnswers type:', typeof rawAnswers, 'isArray:', Array.isArray(rawAnswers), 'length:', userAnswers.length);
        
        const analysisMetrics = userAnswers.length > 0 ? 
          this.analyzeAnswerPatterns(userAnswers) : 
          this.generateDefaultMetrics();
        
        // 4. 分析結果に基づく動的ヘキサグラム選択
        const selectedHexagrams = this.selectDynamicHexagrams(analysisMetrics, hexagramsData);
        
        // 5. 動的品質スコアとconsistencyScoreの算出
        const qualityScore = this.calculateDynamicQualityScore(analysisMetrics, userAnswers);
        const consistencyScore = this.calculateDynamicConsistencyScore(analysisMetrics, selectedHexagrams);
        
        // 6. 動的コンテンツ生成
        const dynamicContent = this.generateDynamicIntegrationContent(
          selectedHexagrams, 
          analysisMetrics, 
          haqeiDatabase,
          qualityScore
        );
        
        return {
          engineOS: this.buildDynamicOSProfile('engine', selectedHexagrams.engine, analysisMetrics.engineScore, analysisMetrics.total),
          interfaceOS: this.buildDynamicOSProfile('interface', selectedHexagrams.interface, analysisMetrics.interfaceScore, analysisMetrics.total),
          safeModeOS: this.buildDynamicOSProfile('safeMode', selectedHexagrams.safeMode, analysisMetrics.safeModeScore, analysisMetrics.total),
          consistencyScore: consistencyScore,
          integration: dynamicContent,
          timestamp: Date.now(),
          fallback: true,
          dataSource: 'dynamic_intelligent_fallback',
          tripleOSPhilosophy: true,
          notice: '分析データに基づく動的フォールバック結果です。より正確な結果のため完全な診断を推奨します。',
          qualityScore: qualityScore,
          analysisType: 'dynamic_fallback',
          analysisMetrics: analysisMetrics,
          hexagramSelection: {
            engine: selectedHexagrams.engine?.hexagram_id,
            interface: selectedHexagrams.interface?.hexagram_id,
            safeMode: selectedHexagrams.safeMode?.hexagram_id,
            selectionMethod: 'user_pattern_based'
          }
        };
      } else {
        // データベースが利用できない場合の最低限フォールバック
        return this.generateMinimalFallback();
      }
    } catch (error) {
      console.error('❌ Dynamic fallback generation failed:', error);
      return this.generateMinimalFallback();
    }
  }

  // 洞察データの保存（セッション履歴付き）
  saveInsights(insights) {
    try {
      // 通常の保存
      const success = this.setItem('insights', insights);
      
      // セッション履歴にも保存（フォールバック用）
      if (success && insights) {
        this.updateSession({ 
          lastInsights: insights,
          lastInsightsTime: Date.now()
        });
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to save insights:', error);
      return false;
    }
  }

  // 洞察データの取得（フォールバック機能付き）
  getInsights() {
    try {
      // 1. 通常の取得を試行
      let insights = this.getItem('insights');
      if (insights) {
        console.log('💡 Insights retrieved successfully');
        return insights;
      }
      
      // 2. 統一診断データからの復旧を試行
      console.log('🔄 Attempting to recover insights from unified diagnosis data...');
      const unifiedData = this.getItem('unified_diagnosis_data');
      if (unifiedData && unifiedData.strategicInsights) {
        console.log('✅ Insights recovered from unified data');
        this.setItem('insights', unifiedData.strategicInsights);
        return unifiedData.strategicInsights;
      }
      
      // 3. セッション履歴からの復旧を試行
      console.log('🔄 Attempting to recover insights from session history...');
      const session = this.getSession();
      if (session && session.lastInsights) {
        console.log('✅ Insights recovered from session');
        this.setItem('insights', session.lastInsights);
        return session.lastInsights;
      }
      
      // 4. バックアップからの復旧を試行
      const backupInsights = this.attemptBackupRecovery('insights');
      if (backupInsights) {
        console.log('✅ Insights recovered from backup');
        return backupInsights;
      }
      
      // 5. 分析結果から基本的なインサイトを生成
      const analysisResult = this.getAnalysisResult();
      if (analysisResult) {
        console.log('🔄 Generating basic insights from analysis result...');
        const basicInsights = this.generateBasicInsights(analysisResult);
        if (basicInsights) {
          this.setItem('insights', basicInsights);
          return basicInsights;
        }
      }
      
      console.log('⚠️ No insights found after all recovery attempts');
      return null;
      
    } catch (error) {
      console.error('❌ Error retrieving insights:', error);
      return null;
    }
  }

  // セッション情報の保存（改良版・自動バックアップ対応）
  saveSession(sessionData) {
    try {
      // 既存セッションのバックアップを作成
      const existingSession = this.getSession();
      if (existingSession && this.isValidSessionData(existingSession)) {
        this.createBackup('session', existingSession);
      }
      
      // 新しいセッションデータの構築
      const session = {
        sessionId: sessionData.sessionId || this.generateSessionId(),
        startTime: sessionData.startTime || Date.now(),
        lastActivity: Date.now(),
        stage: sessionData.stage || 'welcome', // welcome, questions, analysis, results, insights
        ...sessionData
      };
      
      // データの有効性を検証
      if (!this.isValidSessionData(session)) {
        console.warn('⚠️ Invalid session data structure, attempting to fix...');
        session.sessionId = this.generateSessionId();
        session.startTime = session.startTime || Date.now();
        session.lastActivity = Date.now();
      }
      
      const result = this.setItem('session', session);
      if (result) {
        console.log('💾 Session saved successfully with backup');
      }
      return result;
      
    } catch (error) {
      console.error('❌ Session save failed:', error);
      return false;
    }
  }

  // セッション情報の取得（改良版）
  getSession() {
    try {
      const sessionData = this.getItem('session');
      
      // セッションデータの型チェックと修復
      if (sessionData) {
        // 文字列形式の場合、JSONとして解析を試行
        if (typeof sessionData === 'string') {
          try {
            const parsedSession = JSON.parse(sessionData);
            // 有効なセッションオブジェクトかチェック
            if (this.isValidSessionData(parsedSession)) {
              console.log('🔧 Repaired session data from string format');
              // 正常なオブジェクト形式で再保存
              this.setItem('session', parsedSession);
              return parsedSession;
            }
          } catch (parseError) {
            console.warn('⚠️ Failed to parse session string, attempting recovery...', parseError);
            return this.attemptSessionRecovery();
          }
        }
        
        // オブジェクト形式の場合、構造を検証
        if (typeof sessionData === 'object') {
          if (this.isValidSessionData(sessionData)) {
            return sessionData;
          } else {
            console.warn('⚠️ Session data structure invalid, attempting recovery...');
            return this.attemptSessionRecovery();
          }
        }
      }
      
      // セッションデータが存在しない場合
      return null;
      
    } catch (error) {
      console.warn('🚨 Session retrieval error, attempting recovery:', error);
      return this.attemptSessionRecovery();
    }
  }

  // 新しいセッションの開始
  startNewSession() {
    const sessionData = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      stage: 'welcome'
    };
    
    // 古いデータをクリア
    this.removeItem('answers');
    this.removeItem('progress');
    this.removeItem('analysis_result');
    this.removeItem('insights');
    
    return this.saveSession(sessionData);
  }

  // セッションIDの生成
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // セッションの更新
  updateSession(updates) {
    const currentSession = this.getSession();
    if (!currentSession) {
      return this.startNewSession();
    }

    const updatedSession = {
      ...currentSession,
      ...updates,
      lastActivity: Date.now()
    };

    return this.saveSession(updatedSession);
  }

  // 設定の保存
  saveSettings(settings) {
    return this.setItem('settings', settings);
  }

  // 設定の取得
  getSettings() {
    return this.getItem('settings') || this.getDefaultSettings();
  }

  // デフォルト設定
  getDefaultSettings() {
    return {
      theme: 'dark',
      language: 'ja',
      animations: true,
      sounds: false,
      saveProgress: true,
      debugMode: false
    };
  }

  // 統計情報の保存
  saveStats(stats) {
    return this.setItem('stats', stats);
  }

  // 統計情報の取得
  getStats() {
    return this.getItem('stats') || this.getDefaultStats();
  }

  // デフォルト統計情報
  getDefaultStats() {
    return {
      totalSessions: 0,
      completedAnalyses: 0,
      averageCompletionTime: 0,
      lastAnalysisDate: null,
      favoriteHexagrams: []
    };
  }

  // 統計情報の更新
  updateStats(updates) {
    const currentStats = this.getStats();
    const updatedStats = {
      ...currentStats,
      ...updates,
      lastUpdated: Date.now()
    };
    return this.saveStats(updatedStats);
  }

  // 統一診断データの保存
  saveUnifiedDiagnosisData(diagnosisData) {
    try {
      console.log('💾 Saving unified diagnosis data...');

      // データ検証
      if (typeof window !== 'undefined' && window.DiagnosisDataFormat) {
        const formatter = new window.DiagnosisDataFormat();
        const validation = formatter.validateDiagnosisData(diagnosisData);
        
        if (!validation.isValid) {
          console.warn('⚠️ Diagnosis data validation failed:', validation.errors);
          // 警告を出すが保存は続行
        }
      }

      // 統一フォーマットで保存
      const success = this.setItem('unified_diagnosis_data', diagnosisData);
      
      if (success) {
        // 互換性のためレガシーフォーマットでも保存
        this.saveCompatibilityData(diagnosisData);
        
        // 統計情報の更新
        this.updateStats({
          lastDiagnosisDate: Date.now(),
          diagnosisVersion: diagnosisData.metadata?.version || '1.0.0',
          analysisType: diagnosisData.metadata?.analysisType || 'unknown'
        });

        console.log('✅ Unified diagnosis data saved successfully');
        return true;
      }

      return false;

    } catch (error) {
      console.error('❌ Failed to save unified diagnosis data:', error);
      return false;
    }
  }

  // 統一診断データの取得
  getUnifiedDiagnosisData() {
    try {
      console.log('📋 Retrieving unified diagnosis data...');
      
      const diagnosisData = this.getItem('unified_diagnosis_data');
      
      if (!diagnosisData) {
        console.log('ℹ️ No unified diagnosis data found');
        return null;
      }

      // データの完全性確認
      const integrity = this.validateDataIntegrity(diagnosisData);
      console.log(`📊 Data integrity: ${(integrity * 100).toFixed(1)}%`);

      return diagnosisData;

    } catch (error) {
      console.error('❌ Failed to retrieve unified diagnosis data:', error);
      return null;
    }
  }

  // 診断データの存在確認
  hasUnifiedDiagnosisData() {
    return this.hasItem('unified_diagnosis_data');
  }

  // 診断データの削除
  removeUnifiedDiagnosisData() {
    try {
      console.log('🗑️ Removing unified diagnosis data...');
      
      const success = this.removeItem('unified_diagnosis_data');
      
      if (success) {
        // 関連するレガシーデータも削除
        this.removeItem('analysis_result');
        this.removeItem('insights');
        
        console.log('✅ Unified diagnosis data removed successfully');
      }

      return success;

    } catch (error) {
      console.error('❌ Failed to remove unified diagnosis data:', error);
      return false;
    }
  }

  // 診断データのバックアップ作成
  backupDiagnosisData() {
    try {
      console.log('💾 Creating diagnosis data backup...');

      const diagnosisData = this.getUnifiedDiagnosisData();
      if (!diagnosisData) {
        console.log('ℹ️ No diagnosis data to backup');
        return null;
      }

      const backupData = {
        timestamp: new Date().toISOString(),
        version: diagnosisData.metadata?.version || '1.0.0',
        diagnosisData: diagnosisData
      };

      const backupKey = `diagnosis_backup_${Date.now()}`;
      const success = this.setItem(backupKey, backupData);

      if (success) {
        // バックアップ履歴を管理（最新5件まで）
        this.manageBackupHistory(backupKey);
        console.log(`✅ Diagnosis data backup created: ${backupKey}`);
        return backupKey;
      }

      return null;

    } catch (error) {
      console.error('❌ Failed to create diagnosis data backup:', error);
      return null;
    }
  }

  // バックアップ履歴の管理
  manageBackupHistory(newBackupKey) {
    try {
      const backupHistory = this.getItem('backup_history') || [];
      backupHistory.push(newBackupKey);

      // 最新5件のみ保持
      if (backupHistory.length > 5) {
        const oldBackups = backupHistory.splice(0, backupHistory.length - 5);
        // 古いバックアップを削除
        oldBackups.forEach(key => this.removeItem(key));
      }

      this.setItem('backup_history', backupHistory);

    } catch (error) {
      console.warn('⚠️ Backup history management failed:', error);
    }
  }

  // 診断データの概要取得
  getDiagnosisDataSummary() {
    try {
      const diagnosisData = this.getUnifiedDiagnosisData();
      if (!diagnosisData) {
        return null;
      }

      return {
        hasData: true,
        analysisType: diagnosisData.metadata?.analysisType || 'unknown',
        timestamp: diagnosisData.metadata?.timestamp,
        primaryOS: diagnosisData.basicProfile?.primaryHexagram?.name || '不明',
        qualityScore: diagnosisData.qualityMetrics?.dataCompleteness || 0,
        osTypes: {
          engine: diagnosisData.tripleOS?.engineOS?.name || '不明',
          interface: diagnosisData.tripleOS?.interfaceOS?.name || '不明',
          safeMode: diagnosisData.tripleOS?.safeModeOS?.name || '不明'
        },
        consistencyScore: diagnosisData.tripleOS?.consistencyScore || 0,
        canUpgrade: this.canUpgradeToPremium(diagnosisData)
      };

    } catch (error) {
      console.error('❌ Failed to get diagnosis data summary:', error);
      return null;
    }
  }

  // プレミアム版アップグレード可能性の判定
  canUpgradeToPremium(diagnosisData) {
    try {
      // 基本的な診断データが揃っていることを確認
      const hasBasicData = diagnosisData.basicProfile && diagnosisData.tripleOS;
      const hasQualityData = diagnosisData.qualityMetrics?.dataCompleteness > 0.5;
      const hasEngineOS = diagnosisData.tripleOS?.engineOS?.hexagramId;

      return hasBasicData && hasQualityData && hasEngineOS;

    } catch (error) {
      console.warn('⚠️ Premium upgrade eligibility check failed:', error);
      return false;
    }
  }

  // バックアップからのデータ復旧試行
  attemptBackupRecovery(dataType) {
    try {
      console.log(`🔄 Attempting backup recovery for ${dataType}...`);
      
      // バックアップ履歴を確認
      const backupHistory = this.getItem('backup_history') || [];
      
      // 最新のバックアップから復旧を試行
      for (let i = backupHistory.length - 1; i >= 0; i--) {
        const backupKey = backupHistory[i];
        const backupData = this.getItem(backupKey);
        
        if (backupData && backupData.diagnosisData) {
          // 統一フォーマットのバックアップから復旧
          if (dataType === 'analysis_result' && backupData.diagnosisData.tripleOS) {
            console.log(`✅ Found ${dataType} in backup: ${backupKey}`);
            return backupData.diagnosisData.tripleOS;
          }
          
          if (dataType === 'insights' && backupData.diagnosisData.strategicInsights) {
            console.log(`✅ Found ${dataType} in backup: ${backupKey}`);
            return backupData.diagnosisData.strategicInsights;
          }
        }
      }
      
      console.log(`⚠️ No backup found for ${dataType}`);
      return null;
      
    } catch (error) {
      console.error(`❌ Backup recovery failed for ${dataType}:`, error);
      return null;
    }
  }
  
  // 分析結果から基本的なインサイトを生成
  generateBasicInsights(analysisResult) {
    try {
      console.log('🔄 Generating basic insights from analysis result...');
      
      if (!analysisResult || typeof analysisResult !== 'object') {
        return null;
      }
      
      // 基本的なインサイト構造を作成
      const basicInsights = {
        summary: '分析結果に基づく基本的な洞察',
        generated: true,
        timestamp: Date.now(),
        insights: []
      };
      
      // Engine OSの洞察
      if (analysisResult.engineOS) {
        basicInsights.insights.push({
          type: 'engine',
          title: 'あなたの内面的価値観',
          content: `あなたの核となる価値観は「${analysisResult.engineOS.name || '未特定'}」として現れています。`,
          hexagram: analysisResult.engineOS.hexagramId || 1
        });
      }
      
      // Interface OSの洞察
      if (analysisResult.interfaceOS) {
        basicInsights.insights.push({
          type: 'interface',
          title: 'あなたの社会的表現',
          content: `他者との関わりでは「${analysisResult.interfaceOS.name || '未特定'}」の特性を示します。`,
          hexagram: analysisResult.interfaceOS.hexagramId || 1
        });
      }
      
      // SafeMode OSの洞察
      if (analysisResult.safeModeOS) {
        basicInsights.insights.push({
          type: 'safemode',
          title: 'あなたの防御機制',
          content: `ストレス時には「${analysisResult.safeModeOS.name || '未特定'}」モードで対応する傾向があります。`,
          hexagram: analysisResult.safeModeOS.hexagramId || 1
        });
      }
      
      // 一貫性スコアの洞察
      if (typeof analysisResult.consistencyScore === 'number') {
        const score = Math.round(analysisResult.consistencyScore * 100);
        basicInsights.insights.push({
          type: 'consistency',
          title: 'パーソナリティの一貫性',
          content: `あなたの人格の一貫性スコアは${score}%です。`,
          score: score
        });
      }
      
      console.log('✅ Basic insights generated successfully');
      return basicInsights;
      
    } catch (error) {
      console.error('❌ Failed to generate basic insights:', error);
      return null;
    }
  }

  // データのエクスポート
  exportData() {
    const data = {
      version: this.version,
      timestamp: Date.now(),
      answers: this.getAnswers(),
      progress: this.getProgress(),
      analysisResult: this.getAnalysisResult(),
      insights: this.getInsights(),
      session: this.getSession(),
      settings: this.getSettings(),
      stats: this.getStats()
    };
    
    return JSON.stringify(data, null, 2);
  }

  // 診断データの専用エクスポート（統一フォーマット対応）
  exportDiagnosisData(format = 'json') {
    try {
      console.log('📦 Exporting diagnosis data in unified format...');

      // 統一フォーマットで診断データを取得
      const diagnosisData = this.getItem('unified_diagnosis_data');
      if (!diagnosisData) {
        console.warn('⚠️ No unified diagnosis data found, falling back to legacy data');
        return this.exportLegacyDiagnosisData(format);
      }

      const exportData = {
        formatVersion: '1.0.0',
        exportTimestamp: new Date().toISOString(),
        source: 'HaQei_StorageManager',
        diagnosisData: diagnosisData,
        metadata: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          exportFormat: format,
          dataIntegrity: this.validateDataIntegrity(diagnosisData)
        }
      };

      switch (format.toLowerCase()) {
        case 'json':
          return JSON.stringify(exportData, null, 2);
        
        case 'summary':
          return this.generateTextSummary(exportData.diagnosisData);
        
        case 'csv':
          return this.generateCSVExport(exportData.diagnosisData);
        
        default:
          console.warn(`⚠️ Unsupported format: ${format}, defaulting to JSON`);
          return JSON.stringify(exportData, null, 2);
      }

    } catch (error) {
      console.error('❌ Diagnosis data export failed:', error);
      throw new Error(`診断データのエクスポートに失敗しました: ${error.message}`);
    }
  }

  // レガシー診断データのエクスポート（後方互換性）
  exportLegacyDiagnosisData(format = 'json') {
    try {
      const legacyData = {
        answers: this.getAnswers(),
        analysisResult: this.getAnalysisResult(),
        insights: this.getInsights(),
        session: this.getSession(),
        exportTimestamp: new Date().toISOString(),
        note: 'This is legacy format data. Please upgrade to unified format.'
      };

      if (format === 'json') {
        return JSON.stringify(legacyData, null, 2);
      } else {
        return this.generateTextSummary(legacyData);
      }

    } catch (error) {
      console.error('❌ Legacy data export failed:', error);
      return null;
    }
  }

  // テキストサマリーの生成
  generateTextSummary(diagnosisData) {
    try {
      let summary = '';
      
      // ヘッダー
      summary += '=== HaQei 診断結果サマリー ===\n';
      summary += `生成日時: ${new Date().toLocaleString('ja-JP')}\n`;
      summary += `分析タイプ: ${diagnosisData.metadata?.analysisType || '不明'}\n\n`;

      // 基本プロフィール
      if (diagnosisData.basicProfile) {
        summary += '--- 基本プロフィール ---\n';
        summary += `主要人格OS: ${diagnosisData.basicProfile.primaryHexagram?.name || '不明'}\n`;
        summary += `パーソナリティタイプ: ${diagnosisData.basicProfile.personalityType || '不明'}\n`;
        summary += `主要特性: ${(diagnosisData.basicProfile.coreTraits || []).join(', ')}\n`;
        summary += `強み: ${(diagnosisData.basicProfile.strengthsKeywords || []).join(', ')}\n`;
        summary += `課題: ${(diagnosisData.basicProfile.challengesKeywords || []).join(', ')}\n\n`;
      }

      // Triple OS
      if (diagnosisData.tripleOS) {
        summary += '--- Triple OS 分析 ---\n';
        summary += `Engine OS: ${diagnosisData.tripleOS.engineOS?.name || '不明'}\n`;
        summary += `Interface OS: ${diagnosisData.tripleOS.interfaceOS?.name || '不明'}\n`;
        summary += `SafeMode OS: ${diagnosisData.tripleOS.safeModeOS?.name || '不明'}\n`;
        summary += `一貫性スコア: ${(diagnosisData.tripleOS.consistencyScore * 100).toFixed(1)}%\n\n`;
      }

      // 戦略的洞察
      if (diagnosisData.strategicInsights) {
        summary += '--- 戦略的洞察 ---\n';
        summary += `現在の立ち位置: ${diagnosisData.strategicInsights.currentPosition || '不明'}\n`;
        summary += `推奨戦略: ${(diagnosisData.strategicInsights.strategicRecommendations || []).join(', ')}\n\n`;
      }

      // 品質指標
      if (diagnosisData.qualityMetrics) {
        summary += '--- 分析品質 ---\n';
        summary += `データ完全性: ${(diagnosisData.qualityMetrics.dataCompleteness * 100).toFixed(1)}%\n`;
        summary += `分析信頼度: ${(diagnosisData.qualityMetrics.analysisConfidence * 100).toFixed(1)}%\n\n`;
      }

      summary += '=== レポート終了 ===\n';
      summary += 'このデータは HaQei (https://haqei.com) で生成されました。\n';

      return summary;

    } catch (error) {
      console.error('❌ Text summary generation failed:', error);
      return 'サマリーの生成に失敗しました。';
    }
  }

  // CSV形式のエクスポート
  generateCSVExport(diagnosisData) {
    try {
      let csv = '';
      
      // ヘッダー
      csv += 'カテゴリ,項目,値\n';
      
      // メタデータ
      csv += `メタデータ,バージョン,${diagnosisData.metadata?.version || ''}\n`;
      csv += `メタデータ,分析タイプ,${diagnosisData.metadata?.analysisType || ''}\n`;
      csv += `メタデータ,実行日時,${diagnosisData.metadata?.timestamp || ''}\n`;

      // 基本プロフィール
      if (diagnosisData.basicProfile) {
        csv += `基本プロフィール,主要人格OS,${diagnosisData.basicProfile.primaryHexagram?.name || ''}\n`;
        csv += `基本プロフィール,パーソナリティタイプ,${diagnosisData.basicProfile.personalityType || ''}\n`;
        csv += `基本プロフィール,主要特性,"${(diagnosisData.basicProfile.coreTraits || []).join(', ')}"\n`;
      }

      // Triple OS
      if (diagnosisData.tripleOS) {
        csv += `Triple OS,Engine OS,${diagnosisData.tripleOS.engineOS?.name || ''}\n`;
        csv += `Triple OS,Interface OS,${diagnosisData.tripleOS.interfaceOS?.name || ''}\n`;
        csv += `Triple OS,SafeMode OS,${diagnosisData.tripleOS.safeModeOS?.name || ''}\n`;
        csv += `Triple OS,一貫性スコア,${diagnosisData.tripleOS.consistencyScore || 0}\n`;
      }

      return csv;

    } catch (error) {
      console.error('❌ CSV export generation failed:', error);
      return 'カテゴリ,項目,値\nエラー,CSV生成失敗,データの生成に失敗しました';
    }
  }

  // データのインポート
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // バージョン確認
      if (data.version !== this.version) {
        console.warn('⚠️ Import data version mismatch');
        return false;
      }

      // データの復元
      if (data.answers) this.saveAnswers(data.answers);
      if (data.progress) this.saveProgress(data.progress);
      if (data.analysisResult) this.saveAnalysisResult(data.analysisResult);
      if (data.insights) this.saveInsights(data.insights);
      if (data.session) this.saveSession(data.session);
      if (data.settings) this.saveSettings(data.settings);
      if (data.stats) this.saveStats(data.stats);

      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Data import failed:', error);
      return false;
    }
  }

  // 診断データの専用インポート（統一フォーマット対応）
  importDiagnosisData(jsonData) {
    try {
      console.log('📥 Importing diagnosis data in unified format...');

      const importData = JSON.parse(jsonData);

      // フォーマット検証
      if (!this.validateImportData(importData)) {
        throw new Error('インポートデータの形式が無効です');
      }

      // 統一フォーマットかどうかを判定
      if (importData.formatVersion && importData.diagnosisData) {
        // 統一フォーマットのインポート
        return this.importUnifiedDiagnosisData(importData.diagnosisData);
      } else {
        // レガシーフォーマットのインポート
        console.log('🔄 Legacy format detected, converting to unified format...');
        return this.importLegacyDiagnosisData(importData);
      }

    } catch (error) {
      console.error('❌ Diagnosis data import failed:', error);
      throw new Error(`診断データのインポートに失敗しました: ${error.message}`);
    }
  }

  // 統一フォーマットデータのインポート
  importUnifiedDiagnosisData(diagnosisData) {
    try {
      // データ検証
      if (typeof window !== 'undefined' && window.DiagnosisDataFormat) {
        const formatter = new window.DiagnosisDataFormat();
        const validation = formatter.validateDiagnosisData(diagnosisData);
        
        if (!validation.isValid) {
          console.warn('⚠️ Imported data validation failed:', validation.errors);
          // 警告を表示するが、インポートは続行
        }
      }

      // 統一フォーマットデータを保存
      this.setItem('unified_diagnosis_data', diagnosisData);

      // レガシーシステムとの互換性のため、古い形式でも保存
      this.saveCompatibilityData(diagnosisData);

      // インポート履歴を記録
      this.recordImportHistory(diagnosisData);

      console.log('✅ Unified diagnosis data imported successfully');
      return {
        success: true,
        message: '診断データが正常にインポートされました',
        dataType: 'unified',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Unified diagnosis data import failed:', error);
      throw error;
    }
  }

  // レガシーフォーマットデータのインポート
  importLegacyDiagnosisData(legacyData) {
    try {
      // レガシーデータを統一フォーマットに変換
      const convertedData = this.convertLegacyToUnified(legacyData);

      // 変換されたデータをインポート
      return this.importUnifiedDiagnosisData(convertedData);

    } catch (error) {
      console.error('❌ Legacy diagnosis data import failed:', error);
      throw error;
    }
  }

  // レガシーデータの統一フォーマット変換
  convertLegacyToUnified(legacyData) {
    try {
      console.log('🔄 Converting legacy data to unified format...');

      // DiagnosisDataFormatクラスを使用して変換
      if (typeof window !== 'undefined' && window.DiagnosisDataFormat) {
        const formatter = new window.DiagnosisDataFormat();
        
        // レガシーデータから分析結果を抽出
        const analysisResult = legacyData.analysisResult || {};
        const answers = legacyData.answers || [];

        // 統一フォーマットで作成
        const unifiedData = formatter.createDiagnosisData(analysisResult, answers, {
          analysisType: 'legacyImport',
          source: 'imported_legacy'
        });

        console.log('✅ Legacy data converted successfully');
        return unifiedData;

      } else {
        // DiagnosisDataFormatが利用できない場合の簡易変換
        console.warn('⚠️ DiagnosisDataFormat not available, using simplified conversion');
        return this.createSimplifiedUnifiedData(legacyData);
      }

    } catch (error) {
      console.error('❌ Legacy data conversion failed:', error);
      throw new Error(`レガシーデータの変換に失敗しました: ${error.message}`);
    }
  }

  // 簡易統一データの作成
  createSimplifiedUnifiedData(legacyData) {
    const now = new Date().toISOString();
    
    return {
      metadata: {
        version: '1.0.0',
        analysisType: 'legacyImport',
        timestamp: now,
        sessionId: this.generateSessionId(),
        source: 'imported_legacy'
      },
      basicProfile: {
        primaryHexagram: {
          id: 1,
          name: '情報不足（レガシーデータ）',
          symbol: '☰',
          element: '土',
          trigrams: { upper: '乾', lower: '乾' }
        },
        personalityType: 'UNKNOWN',
        coreTraits: ['インポートされたデータ'],
        strengthsKeywords: ['要分析'],
        challengesKeywords: ['要分析']
      },
      tripleOS: {
        engineOS: {
          osName: '要分析（レガシー変換）',
          name: '要分析（レガシー変換）',
          hexagramId: 1,
          osId: 1,
          strength: 0.4,
          score: 40,
          confidence: 0.3,
          hexagramInfo: {
            name: '要分析（レガシー変換）',
            symbol: '☰',
            catchphrase: 'レガシーデータから変換',
            description: 'レガシーデータから変換されたため詳細分析が必要です',
            reading: 'ようぶんせき',
            meaning: '分析の必要性',
            element: '土',
            trigrams: { upper: '乾', lower: '乾' }
          },
          traits: ['レガシーデータ', '要分析'],
          description: 'レガシーデータから変換されたエンジンOS'
        },
        interfaceOS: {
          osName: '要分析（レガシー変換）',
          name: '要分析（レガシー変換）',
          hexagramId: 10,
          osId: 10,
          matchScore: 40,
          score: 40,
          confidence: 0.3,
          hexagramInfo: {
            name: '要分析（レガシー変換）',
            symbol: '☰',
            catchphrase: 'レガシーデータから変換',
            description: 'レガシーデータから変換されたため詳細分析が必要です',
            reading: 'ようぶんせき',
            meaning: '分析の必要性',
            element: '土',
            trigrams: { upper: '乾', lower: '乾' }
          },
          traits: ['レガシーデータ', '要分析'],
          description: 'レガシーデータから変換されたインターフェースOS'
        },
        safeModeOS: {
          osName: '要分析（レガシー変換）',
          name: '要分析（レガシー変換）',
          hexagramId: 2,
          osId: 2,
          matchScore: 40,
          score: 40,
          confidence: 0.3,
          hexagramInfo: {
            name: '要分析（レガシー変換）',
            symbol: '☷',
            catchphrase: 'レガシーデータから変換',
            description: 'レガシーデータから変換されたため詳細分析が必要です',
            reading: 'ようぶんせき',
            meaning: '分析の必要性',
            element: '土',
            trigrams: { upper: '坤', lower: '坤' }
          },
          traits: ['レガシーデータ', '要分析'],
          description: 'レガシーデータから変換されたセーフモードOS'
        },
        consistencyScore: 0.3,
        integration: {
          summary: 'レガシーデータから変換された分人思想プロフィール',
          keyInsights: [
            'レガシーデータからの自動変換',
            '詳細分析のため再診断を推奨',
            '分人思想フレームワークでの再評価が必要'
          ],
          recommendations: [
            '改めて診断を実行して正確な結果を取得',
            '各OSの特性を理解するための学習',
            '分人思想に基づく自己理解の深化'
          ],
          strategicAdvice: 'レガシーデータから変換されたため、正確な分人思想分析のため再診断を実行してください。'
        }
      },
      responses: {
        worldviewAnswers: legacyData.answers || [],
        scenarioAnswers: [],
        totalQuestions: (legacyData.answers || []).length,
        completionRate: 1
      },
      qualityMetrics: {
        dataCompleteness: 0.5,
        analysisConfidence: 0.3,
        vectorSimilarity: 0,
        validationScore: 0.3
      },
      strategicInsights: {
        currentPosition: 'インポートされたデータ',
        futureTrajectories: [],
        strategicRecommendations: [],
        premiumUpgradeValue: {}
      },
      compatibility: {
        mbtiMapping: 'UNKNOWN',
        enneagramMapping: '不明',
        strengthsFinderMapping: [],
        bigFiveMapping: {}
      },
      sharing: {
        isExportable: true,
        shareableElements: [],
        privacyLevel: 'private',
        exportFormats: ['json']
      }
    };
  }

  // 互換性データの保存
  saveCompatibilityData(diagnosisData) {
    try {
      // レガシーシステム用のデータ形式で保存
      if (diagnosisData.tripleOS) {
        this.saveAnalysisResult(diagnosisData.tripleOS);
      }

      if (diagnosisData.responses?.worldviewAnswers) {
        this.saveAnswers(diagnosisData.responses.worldviewAnswers);
      }

      // セッション情報の更新
      this.updateSession({
        stage: 'imported',
        lastActivity: Date.now(),
        dataSource: 'unified_import'
      });

    } catch (error) {
      console.warn('⚠️ Compatibility data save failed:', error);
    }
  }

  // インポート履歴の記録
  recordImportHistory(diagnosisData) {
    try {
      const history = this.getItem('import_history') || [];
      
      const importRecord = {
        timestamp: new Date().toISOString(),
        dataType: diagnosisData.metadata?.analysisType || 'unknown',
        source: diagnosisData.metadata?.source || 'unknown',
        dataQuality: diagnosisData.qualityMetrics?.dataCompleteness || 0,
        sessionId: diagnosisData.metadata?.sessionId
      };

      history.push(importRecord);

      // 履歴は最新10件まで保持
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }

      this.setItem('import_history', history);

    } catch (error) {
      console.warn('⚠️ Import history recording failed:', error);
    }
  }

  // インポートデータの検証
  validateImportData(importData) {
    try {
      // 基本的な構造チェック
      if (typeof importData !== 'object' || importData === null) {
        return false;
      }

      // 統一フォーマットの場合
      if (importData.formatVersion && importData.diagnosisData) {
        return this.validateUnifiedFormat(importData);
      }

      // レガシーフォーマットの場合
      return this.validateLegacyFormat(importData);

    } catch (error) {
      console.error('❌ Import data validation failed:', error);
      return false;
    }
  }

  // 統一フォーマットの検証
  validateUnifiedFormat(importData) {
    return (
      importData.formatVersion &&
      importData.diagnosisData &&
      typeof importData.diagnosisData === 'object'
    );
  }

  // レガシーフォーマットの検証
  validateLegacyFormat(importData) {
    // 少なくとも answers または analysisResult が存在することを確認
    return (
      importData.answers ||
      importData.analysisResult ||
      importData.session
    );
  }

  // データの整合性検証
  validateDataIntegrity(diagnosisData) {
    try {
      let score = 0;
      let maxScore = 0;

      // メタデータの存在
      maxScore += 1;
      if (diagnosisData.metadata && diagnosisData.metadata.version) {
        score += 1;
      }

      // 基本プロフィールの存在
      maxScore += 1;
      if (diagnosisData.basicProfile && diagnosisData.basicProfile.primaryHexagram) {
        score += 1;
      }

      // Triple OSの存在
      maxScore += 1;
      if (diagnosisData.tripleOS && diagnosisData.tripleOS.engineOS) {
        score += 1;
      }

      // 回答データの存在
      maxScore += 1;
      if (diagnosisData.responses && diagnosisData.responses.totalQuestions > 0) {
        score += 1;
      }

      return maxScore > 0 ? (score / maxScore) : 0;

    } catch (error) {
      console.error('❌ Data integrity validation failed:', error);
      return 0;
    }
  }

  // 高度なパフォーマンス統計の更新
  updatePerformanceMetrics(startTime, operation = 'unknown', dataSize = 0) {
    const duration = performance.now() - startTime;
    this.performanceMetrics.operations++;
    this.performanceMetrics.totalTime += duration;
    
    // 操作別の統計も記録
    if (!this.performanceMetrics.operationStats) {
      this.performanceMetrics.operationStats = {};
    }
    
    if (!this.performanceMetrics.operationStats[operation]) {
      this.performanceMetrics.operationStats[operation] = {
        count: 0,
        totalTime: 0,
        totalDataSize: 0,
        avgTime: 0,
        avgDataSize: 0
      };
    }
    
    const stats = this.performanceMetrics.operationStats[operation];
    stats.count++;
    stats.totalTime += duration;
    stats.totalDataSize += dataSize;
    stats.avgTime = stats.totalTime / stats.count;
    stats.avgDataSize = stats.totalDataSize / stats.count;
    
    // 異常に遅い操作を検出（閾値を大幅に上げる）
    if (duration > 2000 && this.debugMode) {
      console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }
  }

  // パフォーマンス統計のリセット
  resetPerformanceMetrics() {
    this.performanceMetrics = {
      operations: 0,
      totalTime: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  // バイト数をフォーマット
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // ストレージの容量チェック（強化版）
  async checkStorageQuota() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const usageInMB = (usage / 1024 / 1024).toFixed(2);
        const quotaInMB = (quota / 1024 / 1024).toFixed(2);
        
        const usagePercentage = quota > 0 ? (usage / quota * 100).toFixed(1) : 0;
        
        console.log(`📊 Storage usage: ${usageInMB}MB / ${quotaInMB}MB (${usagePercentage}%)`);
        
        const result = {
          usage: usage,
          quota: quota,
          usagePercentage: parseFloat(usagePercentage),
          available: quota - usage,
          warning: false,
          critical: false
        };
        
        if (usage / quota > 0.9) {
          console.error('🚨 Storage is critically full');
          result.critical = true;
          this.performStorageCleanup();
        } else if (usage / quota > 0.8) {
          console.warn('⚠️ Storage is almost full');
          result.warning = true;
        }
        
        return result;
      }
      
      return null;
    } catch (error) {
      console.warn('⚠️ Storage quota check failed:', error);
      return null;
    }
  }

  // 自動保存の設定
  setupAutoSave(interval = 30000) { // 30秒ごと
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(() => {
      // セッションの最終アクティビティを更新
      this.updateSession({ lastActivity: Date.now() });
    }, interval);
  }

  // 自動保存の停止
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // クリーンアップ処理
  cleanup() {
    try {
      // 自動保存の停止
      this.stopAutoSave();
      
      // メモリ管理のクリーンアップ
      if (this.memoryManager.cleanupInterval) {
        clearInterval(this.memoryManager.cleanupInterval);
        this.memoryManager.cleanupInterval = null;
      }
      
      // キャッシュをクリア
      this.cache.clear();
      
      console.log('🧹 StorageManager cleanup completed');
    } catch (error) {
      console.warn('⚠️ Cleanup failed:', error);
    }
  }

  // 高度なデバッグ情報の取得
  getDebugInfo() {
    const cacheStats = {
      size: this.cache.size,
      maxSize: this.cacheMaxSize,
      hitRate: this.performanceMetrics.cacheHits / 
        (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) * 100
    };
    
    const storageKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.storagePrefix)
    );
    
    return {
      version: this.version,
      storageKeys: storageKeys,
      totalItems: storageKeys.length,
      cacheStats: cacheStats,
      performanceMetrics: this.performanceMetrics,
      memoryManager: {
        allocatedMemory: this.formatBytes(this.memoryManager.allocatedMemory),
        maxMemoryLimit: this.formatBytes(this.memoryManager.maxMemoryLimit),
        trackingEnabled: this.memoryManager.trackingEnabled
      },
      compressionEnabled: this.compressionEnabled,
      session: this.getSession(),
      settings: this.getSettings(),
      stats: this.getStats()
    };
  }

  // ヘルスチェック機能
  async performHealthCheck() {
    const healthStatus = {
      status: 'healthy',
      warnings: [],
      errors: [],
      metrics: {},
      timestamp: new Date().toISOString()
    };
    
    try {
      // ストレージ容量チェック
      const quotaInfo = await this.checkStorageQuota();
      if (quotaInfo) {
        healthStatus.metrics.storage = quotaInfo;
        if (quotaInfo.critical) {
          healthStatus.errors.push('Storage is critically full');
          healthStatus.status = 'critical';
        } else if (quotaInfo.warning) {
          healthStatus.warnings.push('Storage is almost full');
          if (healthStatus.status === 'healthy') healthStatus.status = 'warning';
        }
      }
      
      // パフォーマンスチェック
      const avgResponseTime = this.performanceMetrics.operations > 0 ? 
        this.performanceMetrics.totalTime / this.performanceMetrics.operations : 0;
      
      healthStatus.metrics.performance = {
        avgResponseTime: avgResponseTime.toFixed(2) + 'ms',
        operations: this.performanceMetrics.operations,
        cacheHitRate: cacheStats.hitRate.toFixed(1) + '%'
      };
      
      if (avgResponseTime > 100) {
        healthStatus.warnings.push('Average response time is high');
        if (healthStatus.status === 'healthy') healthStatus.status = 'warning';
      }
      
      // メモリ使用量チェック
      const memoryUsageRatio = this.memoryManager.allocatedMemory / this.memoryManager.maxMemoryLimit;
      
      healthStatus.metrics.memory = {
        usage: this.formatBytes(this.memoryManager.allocatedMemory),
        limit: this.formatBytes(this.memoryManager.maxMemoryLimit),
        usagePercentage: (memoryUsageRatio * 100).toFixed(1) + '%'
      };
      
      if (memoryUsageRatio > 0.9) {
        healthStatus.errors.push('Memory usage is critically high');
        healthStatus.status = 'critical';
      } else if (memoryUsageRatio > 0.8) {
        healthStatus.warnings.push('Memory usage is high');
        if (healthStatus.status === 'healthy') healthStatus.status = 'warning';
      }
      
    } catch (error) {
      healthStatus.errors.push(`Health check failed: ${error.message}`);
      healthStatus.status = 'error';
    }
    
    return healthStatus;
  }

  // === 分人思想データベース統合メソッド群 ===

  // ヘキサグラムデータベースの取得
  getHexagramsDatabase() {
    try {
      // グローバルのHEXAGRAMS_MASTERを使用
      if (typeof window !== 'undefined' && window.HEXAGRAMS_MASTER) {
        return window.HEXAGRAMS_MASTER;
      }
      
      // hexagramsモジュールが利用可能な場合
      if (typeof hexagrams_master !== 'undefined') {
        return hexagrams_master;
      }
      
      console.warn('⚠️ Hexagrams database not found');
      return null;
    } catch (error) {
      console.error('❌ Error accessing hexagrams database:', error);
      return null;
    }
  }

  // ベクターデータベースの取得
  getVectorsDatabase() {
    try {
      // グローバルのH64_8D_VECTORSを使用
      if (typeof window !== 'undefined' && window.H64_8D_VECTORS) {
        return window.H64_8D_VECTORS;
      }
      
      console.warn('⚠️ Vectors database not found');
      return null;
    } catch (error) {
      console.error('❌ Error accessing vectors database:', error);
      return null;
    }
  }

  // 回答パターンの詳細分析
  analyzeAnswerPatterns(answers) {
    const analysis = {
      engineScore: 0,
      interfaceScore: 0,
      safeModeScore: 0,
      total: 0,
      patterns: {
        consistency: 0,
        extremeChoices: 0,
        moderateChoices: 0,
        averageChoice: 0
      }
    };

    // 🚀 修正: 型安全性チェックを強化
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.warn('⚠️ analyzeAnswerPatterns: Invalid answers data:', typeof answers, answers);
      return analysis;
    }

    let totalValue = 0;
    let extremeCount = 0;
    let moderateCount = 0;

    answers.forEach((answer, index) => {
      if (answer && typeof answer.selectedValue === 'number') {
        const value = answer.selectedValue;
        totalValue += value;
        analysis.total++;

        // 分人思想に基づく詳細分類
        if (value <= 2) {
          analysis.engineScore += 2; // 強い内面重視
          extremeCount++;
        } else if (value <= 4) {
          analysis.engineScore += 1; // 軽い内面重視
          moderateCount++;
        } else if (value >= 8) {
          analysis.safeModeScore += 2; // 強い慎重性
          extremeCount++;
        } else if (value >= 6) {
          analysis.safeModeScore += 1; // 軽い慎重性
          moderateCount++;
        } else {
          analysis.interfaceScore += 1; // 社会的適応
          moderateCount++;
        }
      }
    });

    // パターン分析
    if (analysis.total > 0) {
      analysis.patterns.averageChoice = totalValue / analysis.total;
      analysis.patterns.extremeChoices = extremeCount / analysis.total;
      analysis.patterns.moderateChoices = moderateCount / analysis.total;
      
      // 一貫性計算（選択の散らばりの逆数）
      const variance = this.calculateVariance(answers.map(a => a.selectedValue || 5));
      analysis.patterns.consistency = Math.max(0.1, 1 - (variance / 10)); // 0.1-1.0の範囲
    }

    return analysis;
  }

  // 分散計算
  calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  // トリプルOS用のヘキサグラム選択
  selectHexagramsForTripleOS(analysisMetrics, hexagramsData, vectorsData) {
    try {
      const selected = {
        engine: null,
        interface: null,
        safeMode: null
      };

      // Engine OS: 創造性・独立性の高いヘキサグラム
      selected.engine = this.selectHexagramByCharacteristics(
        hexagramsData, 
        vectorsData,
        ['innovation_score', 'independence_score', 'introspection_score'],
        analysisMetrics.engineScore
      );

      // Interface OS: 協調性・適応性の高いヘキサグラム
      selected.interface = this.selectHexagramByCharacteristics(
        hexagramsData,
        vectorsData, 
        ['cooperation_score', 'adaptability_score', 'support_seeking_score'],
        analysisMetrics.interfaceScore
      );

      // SafeMode OS: 安定性・保護性の高いヘキサグラム
      selected.safeMode = this.selectHexagramByCharacteristics(
        hexagramsData,
        vectorsData,
        ['stability_score', 'protection_score', 'resilience_score'],
        analysisMetrics.safeModeScore
      );

      return selected;
    } catch (error) {
      console.error('❌ Error selecting hexagrams:', error);
      // フォールバック用のデフォルト選択
      return {
        engine: hexagramsData[0] || null, // 乾為天
        interface: hexagramsData[7] || null, // 水地比
        safeMode: hexagramsData[14] || null // 地山謙
      };
    }
  }

  // 特定の特性に基づくヘキサグラム選択
  selectHexagramByCharacteristics(hexagramsData, vectorsData, scoreFields, userScore) {
    try {
      if (!hexagramsData || hexagramsData.length === 0) {
        return null;
      }

      // 各ヘキサグラムのスコアを計算
      const scoredHexagrams = hexagramsData.map(hexagram => {
        let totalScore = 0;
        let validFields = 0;

        scoreFields.forEach(field => {
          if (hexagram[field] && typeof hexagram[field] === 'number') {
            totalScore += hexagram[field];
            validFields++;
          }
        });

        const averageScore = validFields > 0 ? totalScore / validFields : 5;
        
        // ユーザースコアとの適合度も考慮
        const userFit = Math.max(0.1, 1 - Math.abs(userScore - averageScore) / 10);
        
        return {
          ...hexagram,
          calculatedScore: averageScore,
          userFit: userFit,
          finalScore: averageScore * userFit
        };
      });

      // 最高スコアのヘキサグラムを選択
      scoredHexagrams.sort((a, b) => b.finalScore - a.finalScore);
      
      return scoredHexagrams[0];
    } catch (error) {
      console.error('❌ Error in hexagram selection:', error);
      return hexagramsData[0] || null;
    }
  }

  // OSプロフィール構築
  buildOSProfile(osType, hexagram, score, total, hexagramsData) {
    if (!hexagram) {
      return this.buildMinimalOSProfile(osType);
    }

    const confidence = Math.min(0.9, Math.max(0.3, total > 0 ? (score / total) * 1.2 : 0.5));
    const normalizedScore = total > 0 ? Math.round((score / total) * 100) : 50;

    const osTypeMap = {
      'engine': {
        name: 'エンジンOS',
        description: 'あなたの内面的価値観と本質的特性',
        focus: '内面的動機'
      },
      'interface': {
        name: 'インターフェースOS', 
        description: '社会的表現パターンと対人関係の特性',
        focus: '社会的表現'
      },
      'safeMode': {
        name: 'セーフモードOS',
        description: 'ストレス時の防御機制と安定化パターン',
        focus: 'ストレス対応'
      }
    };

    const osInfo = osTypeMap[osType] || osTypeMap['engine'];

    return {
      osName: `${hexagram.name_jp}型${osInfo.name}`,
      name: `${hexagram.name_jp}型`,
      hexagramId: hexagram.hexagram_id,
      osId: hexagram.hexagram_id,
      strength: confidence,
      score: normalizedScore,
      matchScore: normalizedScore,
      confidence: confidence,
      hexagramInfo: {
        name: hexagram.name_jp,
        symbol: this.getHexagramSymbol(hexagram.hexagram_id),
        catchphrase: hexagram.catchphrase,
        description: hexagram.description,
        reading: hexagram.reading,
        meaning: osInfo.focus,
        element: this.getHexagramElement(hexagram),
        trigrams: this.getTrigramInfo(hexagram)
      },
      traits: this.extractTraitsFromKeywords(hexagram.keywords),
      description: `${osInfo.name}: ${osInfo.description}`
    };
  }

  // 最小限のOSプロフィール
  buildMinimalOSProfile(osType) {
    const typeMap = {
      'engine': { name: 'エンジンOS', id: 1, element: '火' },
      'interface': { name: 'インターフェースOS', id: 8, element: '水' },
      'safeMode': { name: 'セーフモードOS', id: 15, element: '土' }
    };
    
    const info = typeMap[osType] || typeMap['engine'];
    
    return {
      osName: `未定義型${info.name}`,
      name: '未定義型',
      hexagramId: info.id,
      osId: info.id,
      strength: 0.4,
      score: 40,
      matchScore: 40,
      confidence: 0.3,
      hexagramInfo: {
        name: '未定義',
        symbol: '☰',
        catchphrase: 'データ復旧が必要',
        description: '正確な分析のため診断を再実行してください',
        reading: 'みていぎ',
        meaning: '未定義状態',
        element: info.element,
        trigrams: { upper: '不明', lower: '不明' }
      },
      traits: ['要分析', 'データ不足'],
      description: `${info.name}: データが不足しているため再分析が必要です`
    };
  }

  // 一貫性スコア計算
  calculateConsistencyScore(analysisMetrics) {
    const { engineScore, interfaceScore, safeModeScore, total, patterns } = analysisMetrics;
    
    if (total === 0) return 0.5;
    
    // スコア間のバランス（極端な偏りがないか）
    const maxScore = Math.max(engineScore, interfaceScore, safeModeScore);
    const minScore = Math.min(engineScore, interfaceScore, safeModeScore);
    const balanceScore = maxScore > 0 ? 1 - (maxScore - minScore) / (total * 0.7) : 1;
    
    // 回答パターンの一貫性
    const patternConsistency = patterns.consistency || 0.5;
    
    // 総合一貫性スコア
    const overallConsistency = (balanceScore * 0.6) + (patternConsistency * 0.4);
    
    return Math.max(0.1, Math.min(1.0, overallConsistency));
  }

  // 統合インサイト生成
  generateIntegrationInsights(analysisMetrics, selectedHexagrams) {
    const { engineScore, interfaceScore, safeModeScore, total } = analysisMetrics;
    
    const insights = [];
    const recommendations = [];
    
    // 主要傾向の分析
    if (engineScore > interfaceScore && engineScore > safeModeScore) {
      insights.push('内面的価値観と本質追求が強い特性');
      recommendations.push('内なる声に従いつつ、他者との関わりも大切にする');
    } else if (interfaceScore > engineScore && interfaceScore > safeModeScore) {
      insights.push('社会的適応性と協調性に優れた特性');
      recommendations.push('自分らしさを保ちながら周囲との調和を図る');
    } else if (safeModeScore > engineScore && safeModeScore > interfaceScore) {
      insights.push('安定性と慎重さを重視する特性');
      recommendations.push('計画的アプローチを活かしつつ挑戦も恐れない');
    } else {
      insights.push('バランスの取れた多面的な特性');
      recommendations.push('状況に応じて最適なOSを意識的に選択する');
    }
    
    // 各OSの特徴を追加
    if (selectedHexagrams.engine) {
      insights.push(`エンジンOS「${selectedHexagrams.engine.name_jp}」による深い内面性`);
    }
    if (selectedHexagrams.interface) {
      insights.push(`インターフェースOS「${selectedHexagrams.interface.name_jp}」による社会的表現`);
    }
    if (selectedHexagrams.safeMode) {
      insights.push(`セーフモードOS「${selectedHexagrams.safeMode.name_jp}」による安定化機能`);
    }
    
    return {
      summary: `${total}個の回答から分析された分人思想プロフィール`,
      keyInsights: insights,
      recommendations: recommendations,
      strategicAdvice: '各OSの特性を理解し、状況に応じて意識的に活用することで、より効果的な人生戦略を構築できます。分人思想に基づく多面的な自己理解を深めてください。'
    };
  }

  // フォールバック用OSプロフィール構築
  buildFallbackOSProfile(osType, hexagram, confidence) {
    if (!hexagram) {
      return this.buildMinimalOSProfile(osType);
    }

    const score = Math.round(confidence * 100);
    
    return {
      osName: `${hexagram.name_jp}型`,
      name: `${hexagram.name_jp}型`,
      hexagramId: hexagram.hexagram_id,
      osId: hexagram.hexagram_id,
      strength: confidence,
      score: score,
      matchScore: score,
      confidence: confidence,
      hexagramInfo: {
        name: hexagram.name_jp,
        symbol: this.getHexagramSymbol(hexagram.hexagram_id),
        catchphrase: hexagram.catchphrase + '（フォールバックデータ）',
        description: hexagram.description + ' ※データベースより復旧',
        reading: hexagram.reading,
        meaning: '復旧データ',
        element: this.getHexagramElement(hexagram),
        trigrams: this.getTrigramInfo(hexagram)
      },
      traits: this.extractTraitsFromKeywords(hexagram.keywords),
      description: `${osType === 'engine' ? 'エンジンOS' : osType === 'interface' ? 'インターフェースOS' : 'セーフモードOS'}: データベースから復旧（${hexagram.name_jp}）`
    };
  }

  // 最小限フォールバック
  generateMinimalFallback() {
    const baseInfo = {
      name: '緊急復旧データ',
      symbol: '☯',
      catchphrase: 'システム復旧中',
      description: '緊急フォールバックモード。正確な分析のため診断を再実行してください。',
      reading: 'きんきゅうふっきゅう',
      meaning: 'システム復旧',
      element: '土',
      trigrams: { upper: '乾', lower: '坤' }
    };

    return {
      engineOS: {
        osName: '緊急復旧エンジンOS',
        name: '緊急復旧型',
        hexagramId: 1,
        osId: 1,
        strength: 0.3,
        score: 30,
        confidence: 0.2,
        hexagramInfo: baseInfo,
        traits: ['緊急復旧', '要再分析'],
        description: 'エンジンOS: 緊急復旧モード'
      },
      interfaceOS: {
        osName: '緊急復旧インターフェースOS',
        name: '緊急復旧型',
        hexagramId: 2,
        osId: 2,
        matchScore: 30,
        score: 30,
        confidence: 0.2,
        hexagramInfo: baseInfo,
        traits: ['緊急復旧', '要再分析'],
        description: 'インターフェースOS: 緊急復旧モード'
      },
      safeModeOS: {
        osName: '緊急復旧セーフモードOS',
        name: '緊急復旧型',
        hexagramId: 3,
        osId: 3,
        matchScore: 30,
        score: 30,
        confidence: 0.2,
        hexagramInfo: baseInfo,
        traits: ['緊急復旧', '要再分析'],
        description: 'セーフモードOS: 緊急復旧モード'
      },
      consistencyScore: 0.3,
      integration: {
        summary: '緊急復旧分人思想プロフィール',
        keyInsights: [
          'システムの緊急復旧状態',
          'データベースアクセスに問題が発生',
          '正確な分析のため診断の再実行が必要'
        ],
        recommendations: [
          '診断を最初から再実行する',
          'ブラウザのキャッシュクリアを試す',
          'システム管理者に連絡する'
        ],
        strategicAdvice: '緊急復旧モードです。正確な分人思想分析のため、診断を再実行してください。'
      },
      timestamp: Date.now(),
      fallback: true,
      dataSource: 'emergency_minimal',
      tripleOSPhilosophy: true,
      notice: '緊急復旧モード。システムに問題が発生している可能性があります。',
      qualityScore: 0.1,
      analysisType: 'emergency_minimal'
    };
  }

  // === ユーティリティメソッド ===

  // ヘキサグラムシンボル取得
  getHexagramSymbol(hexagramId) {
    // シンプルな実装（実際にはより詳細なマッピングが可能）
    const symbols = ['☰', '☷', '☳', '☴', '☵', '☶', '☱', '☲'];
    return symbols[(hexagramId - 1) % 8] || '☯';
  }

  // ヘキサグラム要素取得
  getHexagramElement(hexagram) {
    // キーワードから要素を推定（実際のデータベースにelementフィールドがある場合はそれを使用）
    if (hexagram.element) return hexagram.element;
    
    const keywords = hexagram.keywords || '';
    if (keywords.includes('創造') || keywords.includes('力')) return '火';
    if (keywords.includes('受容') || keywords.includes('安定')) return '土';
    if (keywords.includes('変化') || keywords.includes('適応')) return '木';
    if (keywords.includes('探求') || keywords.includes('深い')) return '水';
    if (keywords.includes('表現') || keywords.includes('輝き')) return '金';
    
    return '土'; // デフォルト
  }

  // 三爻情報取得
  getTrigramInfo(hexagram) {
    // 上三爻と下三爻の情報（実際のデータベースにある場合はそれを使用）
    if (hexagram.upper_trigram_id && hexagram.lower_trigram_id) {
      const trigramNames = ['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'];
      return {
        upper: trigramNames[hexagram.upper_trigram_id - 1] || '不明',
        lower: trigramNames[hexagram.lower_trigram_id - 1] || '不明'
      };
    }
    
    return { upper: '不明', lower: '不明' };
  }

  // キーワードから特性抽出
  extractTraitsFromKeywords(keywords) {
    if (!keywords) return ['要分析'];
    
    return keywords.split(',').map(trait => trait.trim()).filter(trait => trait.length > 0);
  }

  // === 動的フォールバック専用メソッド ===

  // OS分析結果の復旧を試行
  attemptOSResultRecovery() {
    try {
      // 統一診断データからの復旧
      const unifiedData = this.getItem('unified_diagnosis_data');
      if (unifiedData && unifiedData.tripleOS) {
        console.log('🔄 Recovered OS result from unified diagnosis data');
        return unifiedData.tripleOS;
      }

      // セッションからの復旧
      const session = this.getSession();
      if (session && session.lastTripleOS) {
        console.log('🔄 Recovered OS result from session');
        return session.lastTripleOS;
      }

      // バックアップからの復旧
      const backupResult = this.attemptBackupRecovery('analysis_result');
      if (backupResult) {
        console.log('🔄 Recovered OS result from backup');
        return backupResult;
      }

      return null;
    } catch (error) {
      console.error('❌ OS result recovery failed:', error);
      return null;
    }
  }

  // 既存OS結果を動的コンテンツで強化
  enhanceOSResultWithDynamicContent(osResult) {
    try {
      const haqeiDatabase = this.getHaqeiDatabase();
      const enhancedResult = { ...osResult };
      
      // 動的品質スコア向上
      enhancedResult.qualityScore = Math.min(0.85, (osResult.qualityScore || 0.5) + 0.3);
      
      // 動的コンテンツ追加
      if (enhancedResult.integration) {
        const dynamicInsights = this.generateDynamicInsights(osResult, haqeiDatabase);
        enhancedResult.integration.keyInsights = [
          ...dynamicInsights.keyInsights,
          ...(enhancedResult.integration.keyInsights || [])
        ];
        enhancedResult.integration.strategicAdvice = dynamicInsights.strategicAdvice;
      }

      enhancedResult.dataSource = 'enhanced_recovered_result';
      enhancedResult.analysisType = 'enhanced_fallback';
      enhancedResult.notice = '復旧されたOS分析結果を動的コンテンツで強化しました。';
      
      return enhancedResult;
    } catch (error) {
      console.error('❌ OS result enhancement failed:', error);
      return osResult;
    }
  }

  // デフォルトメトリクス生成
  generateDefaultMetrics() {
    return {
      engineScore: 42,
      interfaceScore: 38,
      safeModeScore: 35,
      total: 115,
      patterns: {
        consistency: 0.65,
        extremeChoices: 0.25,
        moderateChoices: 0.55,
        averageChoice: 3.2
      },
      questionTypes: {
        leadership: 15,
        harmony: 12,
        stability: 18
      }
    };
  }

  // 動的ヘキサグラム選択
  selectDynamicHexagrams(analysisMetrics, hexagramsData) {
    try {
      const { engineScore, interfaceScore, safeModeScore, total, patterns } = analysisMetrics;
      
      // エンジンOS: 創造性・リーダーシップ重視
      let engineHexagram = this.selectHexagramByScore(
        engineScore, 
        total, 
        hexagramsData.filter(h => [1, 34, 14, 43, 9].includes(h.hexagram_id)) // 創造性の高いヘキサグラム
      ) || hexagramsData.find(h => h.hexagram_id === 1);

      // インターフェースOS: 社交性・協調性重視
      let interfaceHexagram = this.selectHexagramByScore(
        interfaceScore,
        total,
        hexagramsData.filter(h => [8, 11, 19, 58, 61].includes(h.hexagram_id)) // 協調性の高いヘキサグラム
      ) || hexagramsData.find(h => h.hexagram_id === 8);

      // セーフモードOS: 安定性・保守性重視
      let safeModeHexagram = this.selectHexagramByScore(
        safeModeScore,
        total,
        hexagramsData.filter(h => [15, 2, 52, 53, 18].includes(h.hexagram_id)) // 安定性の高いヘキサグラム
      ) || hexagramsData.find(h => h.hexagram_id === 15);

      // パターンベースの調整
      if (patterns.extremeChoices > 0.7) {
        // 極端な選択が多い場合は動的なヘキサグラムを選択
        engineHexagram = hexagramsData.find(h => h.hexagram_id === 51) || engineHexagram; // 震為雷
      }

      if (patterns.consistency < 0.4) {
        // 一貫性が低い場合は調整
        safeModeHexagram = hexagramsData.find(h => h.hexagram_id === 3) || safeModeHexagram; // 水雷屯
      }

      return {
        engine: engineHexagram,
        interface: interfaceHexagram,
        safeMode: safeModeHexagram
      };
    } catch (error) {
      console.error('❌ Dynamic hexagram selection failed:', error);
      // フォールバック
      return {
        engine: hexagramsData.find(h => h.hexagram_id === 1),
        interface: hexagramsData.find(h => h.hexagram_id === 8),
        safeMode: hexagramsData.find(h => h.hexagram_id === 15)
      };
    }
  }

  // スコアベースヘキサグラム選択
  selectHexagramByScore(score, total, candidates) {
    if (!candidates || candidates.length === 0) return null;
    
    const ratio = total > 0 ? score / total : 0.3;
    const index = Math.min(Math.floor(ratio * candidates.length), candidates.length - 1);
    return candidates[index];
  }

  // 動的品質スコア計算
  calculateDynamicQualityScore(analysisMetrics, userAnswers) {
    let baseScore = 0.6; // ベースライン
    
    // 🚀 修正: 型安全性チェック
    if (!Array.isArray(userAnswers)) {
      console.warn('⚠️ calculateDynamicQualityScore: userAnswers is not an array:', typeof userAnswers);
      return baseScore;
    }
    
    // 回答数による調整
    if (userAnswers.length >= 20) baseScore += 0.15;
    else if (userAnswers.length >= 10) baseScore += 0.1;
    
    // パターン一貫性による調整
    if (analysisMetrics.patterns.consistency > 0.7) baseScore += 0.1;
    else if (analysisMetrics.patterns.consistency < 0.4) baseScore -= 0.05;
    
    // 総スコアによる調整
    if (analysisMetrics.total > 100) baseScore += 0.05;
    
    return Math.min(0.88, Math.max(0.5, baseScore));
  }

  // 動的一貫性スコア計算
  calculateDynamicConsistencyScore(analysisMetrics, selectedHexagrams) {
    let baseScore = 0.75; // ベースライン
    
    // OSバランスによる調整
    const scores = [analysisMetrics.engineScore, analysisMetrics.interfaceScore, analysisMetrics.safeModeScore];
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const balance = minScore / maxScore;
    
    if (balance > 0.8) baseScore += 0.1; // バランスが良い
    else if (balance < 0.5) baseScore -= 0.1; // バランスが悪い
    
    // ヘキサグラム選択の多様性
    const hexagramIds = [
      selectedHexagrams.engine?.hexagram_id,
      selectedHexagrams.interface?.hexagram_id,
      selectedHexagrams.safeMode?.hexagram_id
    ].filter(Boolean);
    
    if (new Set(hexagramIds).size === hexagramIds.length) {
      baseScore += 0.05; // 全て異なるヘキサグラム
    }
    
    return Math.min(0.92, Math.max(0.6, baseScore));
  }

  // 動的統合コンテンツ生成
  generateDynamicIntegrationContent(selectedHexagrams, analysisMetrics, haqeiDatabase, qualityScore) {
    try {
      const keyInsights = this.generateDynamicKeyInsights(selectedHexagrams, analysisMetrics);
      const recommendations = this.generateDynamicRecommendations(selectedHexagrams, qualityScore);
      const strategicAdvice = this.generateDynamicStrategicAdvice(selectedHexagrams, analysisMetrics, haqeiDatabase);
      
      return {
        summary: `分析データ駆動型分人思想プロフィール (品質スコア: ${(qualityScore * 100).toFixed(1)}%)`,
        keyInsights,
        recommendations,
        strategicAdvice
      };
    } catch (error) {
      console.error('❌ Dynamic content generation failed:', error);
      return {
        summary: '動的分人思想プロフィール',
        keyInsights: ['動的分析結果を生成中にエラーが発生しました'],
        recommendations: ['診断を再実行してください'],
        strategicAdvice: '正確な分析のため診断を再実行してください。'
      };
    }
  }

  // 動的キーインサイト生成
  generateDynamicKeyInsights(selectedHexagrams, analysisMetrics) {
    const insights = [];
    
    // 各OSの特徴的インサイト
    if (selectedHexagrams.engine) {
      insights.push(`エンジンOS: ${selectedHexagrams.engine.name_jp} - ${selectedHexagrams.engine.description}`);
    }
    
    if (selectedHexagrams.interface) {
      insights.push(`インターフェースOS: ${selectedHexagrams.interface.name_jp} - ${selectedHexagrams.interface.description}`);
    }
    
    if (selectedHexagrams.safeMode) {
      insights.push(`セーフモードOS: ${selectedHexagrams.safeMode.name_jp} - ${selectedHexagrams.safeMode.description}`);
    }
    
    // パターンベースインサイト
    if (analysisMetrics.patterns.consistency > 0.7) {
      insights.push('高い一貫性: 価値観が明確で安定した判断傾向');
    } else if (analysisMetrics.patterns.consistency < 0.4) {
      insights.push('多様性重視: 状況に応じて柔軟に判断を変える傾向');
    }
    
    if (analysisMetrics.patterns.extremeChoices > 0.6) {
      insights.push('決断力重視: 明確な立場を取ることを好む傾向');
    }
    
    return insights;
  }

  // 動的推奨事項生成
  generateDynamicRecommendations(selectedHexagrams, qualityScore) {
    const recommendations = [];
    
    if (qualityScore > 0.8) {
      recommendations.push('この動的分析は高品質です。分人思想を活用した戦略的意思決定に活用できます');
    } else if (qualityScore > 0.7) {
      recommendations.push('良好な分析結果です。より詳細な洞察のため完全診断を推奨します');
    } else {
      recommendations.push('基本的な分析です。正確な結果のため完全診断を強く推奨します');
    }
    
    // ヘキサグラムベースの推奨事項
    const engineId = selectedHexagrams.engine?.hexagram_id;
    if (engineId === 1) {
      recommendations.push('リーダーシップを発揮する場面で本来の力を発揮できます');
    } else if (engineId === 8) {
      recommendations.push('チームワークを重視する環境で力を発揮できます');
    }
    
    recommendations.push('各OSの特性を理解し、状況に応じて意識的に活用することを推奨します');
    
    return recommendations;
  }

  // 動的戦略アドバイス生成
  generateDynamicStrategicAdvice(selectedHexagrams, analysisMetrics, haqeiDatabase) {
    try {
      const dominantScore = Math.max(
        analysisMetrics.engineScore,
        analysisMetrics.interfaceScore,
        analysisMetrics.safeModeScore
      );
      
      let advice = '分人思想に基づく戦略的ナビゲーション：';
      
      if (dominantScore === analysisMetrics.engineScore) {
        advice += 'エンジンOSが支配的です。創造性と主導性を活かした戦略が効果的でしょう。';
      } else if (dominantScore === analysisMetrics.interfaceScore) {
        advice += 'インターフェースOSが支配的です。協調性と社交性を活かした戦略が効果的でしょう。';
      } else {
        advice += 'セーフモードOSが支配的です。安定性と慎重性を活かした戦略が効果的でしょう。';
      }
      
      // バランス分析
      const balance = Math.min(...[analysisMetrics.engineScore, analysisMetrics.interfaceScore, analysisMetrics.safeModeScore]) /
                     Math.max(...[analysisMetrics.engineScore, analysisMetrics.interfaceScore, analysisMetrics.safeModeScore]);
      
      if (balance > 0.8) {
        advice += ' 各OSがバランス良く発達しており、状況に応じて使い分けることで最大の効果を得られます。';
      } else {
        advice += ' 弱いOSを意識的に活用することで、より幅広い場面で力を発揮できるでしょう。';
      }
      
      return advice;
    } catch (error) {
      console.error('❌ Strategic advice generation failed:', error);
      return '分人思想に基づく戦略的ナビゲーションのため、より詳細な分析を推奨します。';
    }
  }

  // 動的インサイト生成（既存結果用）
  generateDynamicInsights(osResult, haqeiDatabase) {
    try {
      const keyInsights = [
        '復旧されたOS分析結果を最新データベースで強化',
        `エンジンOS: ${osResult.engineOS?.name || '未確定'} - 動的強化済み`,
        `品質向上: 分人思想フレームワークとの整合性確認済み`
      ];
      
      const strategicAdvice = '復旧されたデータを分人思想フレームワークで再解釈し、' +
                             '最新の戦略的洞察を統合しました。各OSの特性を理解し、' +
                             '状況に応じて使い分けることで効果的な自己ナビゲーションが可能です。';
      
      return { keyInsights, strategicAdvice };
    } catch (error) {
      console.error('❌ Dynamic insights generation failed:', error);
      return {
        keyInsights: ['動的インサイト生成中にエラーが発生'],
        strategicAdvice: '正確な分析のため診断を再実行してください。'
      };
    }
  }

  // 動的OSプロフィール構築
  buildDynamicOSProfile(osType, hexagram, score, total) {
    if (!hexagram) {
      return this.buildMinimalOSProfile(osType);
    }

    const confidence = Math.min(0.85, Math.max(0.4, total > 0 ? (score / total) * 1.3 : 0.6));
    const normalizedScore = total > 0 ? Math.round((score / total) * 100) : 60;

    const osTypeMap = {
      'engine': {
        name: 'エンジンOS',
        description: '創造性と主導性の核となる人格OS',
        focus: '内なる動機と創造的エネルギー'
      },
      'interface': {
        name: 'インターフェースOS',
        description: '対人関係と社会的表現の人格OS', 
        focus: '社会との調和と表現力'
      },
      'safeMode': {
        name: 'セーフモードOS',
        description: '安定性と防御機制の人格OS',
        focus: '安全性の確保と慎重な判断'
      }
    };

    const osInfo = osTypeMap[osType] || osTypeMap['engine'];

    return {
      osName: `${hexagram.name_jp}型${osInfo.name}`,
      name: `${hexagram.name_jp}型`,
      hexagramId: hexagram.hexagram_id,
      osId: hexagram.hexagram_id,
      strength: confidence,
      score: normalizedScore,
      matchScore: normalizedScore,
      confidence: confidence,
      hexagramInfo: {
        name: hexagram.name_jp,
        symbol: this.getHexagramSymbol(hexagram.hexagram_id),
        catchphrase: hexagram.catchphrase || `${hexagram.name_jp}の力`,
        description: hexagram.description,
        reading: hexagram.reading || hexagram.keywords,
        meaning: osInfo.focus,
        element: this.getHexagramElement(hexagram),
        keywords: hexagram.keywords ? hexagram.keywords.split(',') : []
      },
      traits: hexagram.description ? hexagram.description.split('、').slice(0, 3) : [],
      description: `${osInfo.description}: ${hexagram.description}`,
      analysisMethod: 'dynamic_pattern_based',
      dataQuality: confidence > 0.7 ? 'high' : confidence > 0.5 ? 'medium' : 'basic'
    };
  }

  // Haqeiデータベース取得（拡張版）
  getHaqeiDatabase() {
    try {
      // 複数のソースを試行
      if (typeof window !== 'undefined' && window.HAQEI_DATABASE) {
        return window.HAQEI_DATABASE;
      }
      
      // グローバル変数として定義されている場合
      if (typeof HAQEI_DATABASE !== 'undefined') {
        return HAQEI_DATABASE;
      }
      
      console.warn('⚠️ Haqei database not found, using hexagrams database');
      return this.getHexagramsDatabase();
    } catch (error) {
      console.error('❌ Error accessing Haqei database:', error);
      return null;
    }
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}

console.log('✅ Enhanced StorageManager loaded with 分人思想 database integration, compression, caching, and performance monitoring');