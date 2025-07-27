// HaQei Analyzer - Enhanced Storage Manager
// 高性能なローカルストレージを管理するクラス
class StorageManager {
  constructor() {
    this.storagePrefix = 'haqei_analyzer_';
    this.version = '1.0.0';
    this.compressionEnabled = true;
    this.cache = new Map();
    this.cacheMaxSize = 50; // メモリキャッシュの最大サイズ
    this.compressionThreshold = 1024; // 1KB以上のデータを圧縮
    this.memoryManager = {
      trackingEnabled: true,
      allocatedMemory: 0,
      maxMemoryLimit: 10 * 1024 * 1024, // 10MB制限
      cleanupInterval: null
    };
    this.performanceMetrics = {
      operations: 0,
      totalTime: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
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

  // パフォーマンス監視の初期化
  initPerformanceMonitoring() {
    // パフォーマンス統計の定期リセット
    setInterval(() => {
      if (this.performanceMetrics.operations > 1000) {
        this.resetPerformanceMetrics();
      }
    }, 600000); // 10分ごと
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

  // データ破損検証
  isCorruptedData(item) {
    try {
      // Check for string-index corruption pattern
      if (typeof item === 'object' && item !== null) {
        const keys = Object.keys(item);
        // If more than 50% of keys are numeric strings, likely corrupted
        const numericKeys = keys.filter(key => /^\d+$/.test(key));
        if (numericKeys.length > keys.length * 0.5 && keys.length > 10) {
          return true;
        }
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(item);
      
      // Check for expected structure
      if (parsed && typeof parsed === 'object') {
        // Valid HaQei data should have some expected properties
        const hasValidStructure = parsed.hasOwnProperty('value') || 
                                 parsed.hasOwnProperty('timestamp') ||
                                 parsed.hasOwnProperty('version') ||
                                 Array.isArray(parsed) ||
                                 typeof parsed === 'string' ||
                                 typeof parsed === 'number' ||
                                 typeof parsed === 'boolean';
        return !hasValidStructure;
      }
      
      return false;
    } catch (error) {
      return true; // Cannot parse = corrupted
    }
  }

  // バージョン確認と必要に応じてデータクリア
  checkVersion() {
    const storedVersion = this.getItem('version');
    
    // バージョン比較の改善 - 文字列として正規化して比較
    const normalizedStoredVersion = storedVersion ? String(storedVersion).trim() : null;
    const normalizedCurrentVersion = String(this.version).trim();
    
    if (!normalizedStoredVersion) {
      // バージョン情報がない場合は新規セットアップ
      console.log(`📦 No version found, setting version to ${normalizedCurrentVersion}`);
      this.setItem('version', this.version);
      return;
    }
    
    // メジャーバージョンのみチェック（マイナーバージョン変更では削除しない）
    const storedMajor = this.extractMajorVersion(normalizedStoredVersion);
    const currentMajor = this.extractMajorVersion(normalizedCurrentVersion);
    
    if (storedMajor !== currentMajor) {
      console.log(`📦 Major version changed from ${normalizedStoredVersion} to ${normalizedCurrentVersion}, clearing storage`);
      this.clearAll();
      this.setItem('version', this.version);
    } else if (normalizedStoredVersion !== normalizedCurrentVersion) {
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

  // アイテムの保存（強化版）
  setItem(key, value) {
    const startTime = performance.now();
    
    try {
      // メモリ使用量チェック
      if (this.memoryManager.allocatedMemory > this.memoryManager.maxMemoryLimit) {
        this.performMemoryCleanup();
      }
      
      const jsonString = JSON.stringify(value);
      const compressed = this.compressData(jsonString);
      
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
      
      console.log(`💾 Saved to storage: ${key} (${this.formatBytes(finalData.length)})`);
      
      if (compressed.compressed) {
        const ratio = ((1 - compressed.data.length / compressed.originalSize) * 100).toFixed(1);
        console.log(`🗜️ Compressed: ${ratio}% reduction`);
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
        
        console.log(`🚀 Cache hit: ${key}`);
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
      
      console.log(`🧹 Memory cleanup completed: ${cleanedCount} items removed, memory usage: ${(this.memoryManager.allocatedMemory / this.memoryManager.maxMemoryLimit * 100).toFixed(1)}%`);
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

  // 進行状況の保存
  saveProgress(progress) {
    const progressData = {
      currentQuestionIndex: progress.currentQuestionIndex || 0,
      totalQuestions: progress.totalQuestions || 0,
      completedQuestions: progress.completedQuestions || 0,
      lastUpdated: Date.now()
    };
    return this.setItem('progress', progressData);
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
      
      // 3. セッション履歴からの復旧を試行
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
      
      console.log('⚠️ No analysis result found after all recovery attempts');
      return null;
      
    } catch (error) {
      console.error('❌ Error retrieving analysis result:', error);
      return null;
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

  // セッション情報の保存
  saveSession(sessionData) {
    const session = {
      sessionId: sessionData.sessionId || this.generateSessionId(),
      startTime: sessionData.startTime || Date.now(),
      lastActivity: Date.now(),
      stage: sessionData.stage || 'welcome', // welcome, questions, analysis, results, insights
      ...sessionData
    };
    return this.setItem('session', session);
  }

  // セッション情報の取得
  getSession() {
    try {
      const sessionData = this.getItem('session');
      // セッションデータが破損している場合の対処
      if (sessionData && typeof sessionData === 'string') {
        console.warn('🚨 Session data is corrupted (string format), clearing...');
        this.removeItem('session');
        return null;
      }
      return sessionData;
    } catch (error) {
      console.warn('🚨 Session retrieval error, clearing session:', error);
      this.removeItem('session');
      return null;
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
        engineOS: { hexagramId: 1, name: '要分析', description: 'レガシーデータから変換' },
        interfaceOS: { hexagramId: 1, name: '要分析', description: 'レガシーデータから変換' },
        safeModeOS: { hexagramId: 1, name: '要分析', description: 'レガシーデータから変換' },
        consistencyScore: 0,
        integration: { summary: 'レガシーデータから変換されました', keyInsights: [], recommendations: [], strategicAdvice: '' }
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
    
    // 異常に遅い操作を検出
    if (duration > 100) {
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
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}

console.log('✅ Enhanced StorageManager loaded with compression, caching, and performance monitoring');