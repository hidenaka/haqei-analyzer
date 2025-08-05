/**
 * DataManager Helper Methods
 * 技術的負債解消とパフォーマンス向上のための拡張実装
 * 
 * Author: HAQEI Programmer Agent
 * Version: 2.0.0-enhanced
 * Created: 2025-08-05
 */

// DataManager クラスの拡張メソッド
if (typeof DataManager !== 'undefined') {
  
  /**
   * デバッグモード検出 - セキュリティ強化版
   * @returns {boolean} デバッグモードフラグ
   */
  DataManager.prototype.detectDebugMode = function() {
    if (typeof window === 'undefined') return false;
    
    try {
      // URLパラメータチェック
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true') return true;
      
      // 開発環境チェック
      const isDevelopment = 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('dev') ||
        window.location.port !== '';
        
      // コンソールでの手動有効化チェック
      const manualDebug = window.localStorage?.getItem('haqei_debug_mode') === 'true';
      
      return isDevelopment || manualDebug;
      
    } catch (error) {
      console.warn('⚠️ Debug mode detection failed:', error);
      return false;
    }
  };
  
  /**
   * エラーハンドラー初期化 - 改善版
   */
  DataManager.prototype.initializeErrorHandler = function() {
    this.errorHandler = {
      maxErrors: 10,
      errors: [],
      
      record: (error, context = {}) => {
        const errorRecord = {
          timestamp: Date.now(),
          message: error.message || error,
          stack: error.stack,
          context: context,
          id: `dm_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        this.errorHandler.errors.push(errorRecord);
        
        // エラー数制限
        if (this.errorHandler.errors.length > this.errorHandler.maxErrors) {
          this.errorHandler.errors.shift();
        }
        
        // 統一エラーハンドラーに転送
        if (window.UnifiedErrorHandler) {
          window.UnifiedErrorHandler.handleError(error, {
            source: 'data-manager',
            component: 'DataManager',
            ...context
          });
        }
        
        // デバッグモードでのログ出力
        if (this.debugMode) {
          console.error('❌ DataManager Error:', errorRecord);
        }
      },
      
      getRecentErrors: (count = 5) => {
        return this.errorHandler.errors.slice(-count);
      },
      
      clear: () => {
        this.errorHandler.errors = [];
      }
    };
  };
  
  /**
   * キャッシュ統計取得
   * @returns {Object} キャッシュ統計情報
   */
  DataManager.prototype.getCacheStats = function() {
    return {
      size: this.cache.size,
      hexagramIndexSize: this.hexagramIndex.size,
      hexagramNameIndexSize: this.hexagramNameIndex.size,
      metrics: { ...this.cacheMetrics },
      hitRate: this.cacheMetrics.totalRequests > 0 ? 
        (this.cacheMetrics.hits / this.cacheMetrics.totalRequests * 100).toFixed(2) + '%' : '0%',
      memoryUsage: this.estimateMemoryUsage()
    };
  };
  
  /**
   * メモリ使用量推定
   * @returns {number} 推定メモリ使用量（バイト）
   */
  DataManager.prototype.estimateMemoryUsage = function() {
    let totalSize = 0;
    
    try {
      // キャッシュサイズ計算
      for (const [key, value] of this.cache) {
        totalSize += JSON.stringify(key).length;
        totalSize += JSON.stringify(value).length;
      }
      
      // インデックスサイズ計算
      for (const [key, value] of this.hexagramIndex) {
        totalSize += JSON.stringify(key).length;
        totalSize += JSON.stringify(value).length;
      }
      
      // その他のデータサイズ
      totalSize += JSON.stringify(this.data).length;
      
    } catch (error) {
      console.warn('⚠️ Memory estimation failed:', error);
      return 0;
    }
    
    return totalSize;
  };
  
  /**
   * データ検証 - 強化版
   * @param {Object} data - 検証対象データ
   * @returns {Object} 検証結果
   */
  DataManager.prototype.validateData = function(data = this.data) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      stats: {
        totalHexagrams: 0,
        validHexagrams: 0,
        missingFields: [],
        duplicateIds: []
      }
    };
    
    try {
      // 基本構造チェック
      if (!data || typeof data !== 'object') {
        validation.isValid = false;
        validation.errors.push('Invalid data structure');
        return validation;
      }
      
      // 64卦データの検証
      if (data.HEXAGRAMS && Array.isArray(data.HEXAGRAMS)) {
        validation.stats.totalHexagrams = data.HEXAGRAMS.length;
        const seenIds = new Set();
        
        data.HEXAGRAMS.forEach((hexagram, index) => {
          // ID重複チェック
          if (seenIds.has(hexagram.id)) {
            validation.stats.duplicateIds.push(hexagram.id);
            validation.warnings.push(`Duplicate hexagram ID: ${hexagram.id}`);
          } else {
            seenIds.add(hexagram.id);
          }
          
          // 必須フィールドチェック
          const requiredFields = ['id', 'name', 'binary', 'element'];
          const missingFields = requiredFields.filter(field => !hexagram[field]);
          
          if (missingFields.length > 0) {
            validation.stats.missingFields.push({
              index: index,
              id: hexagram.id,
              missing: missingFields
            });
            validation.warnings.push(`Hexagram ${hexagram.id} missing fields: ${missingFields.join(', ')}`);
          } else {
            validation.stats.validHexagrams++;
          }
        });
        
        // 64卦完全性チェック
        if (validation.stats.totalHexagrams !== 64) {
          validation.warnings.push(`Expected 64 hexagrams, found ${validation.stats.totalHexagrams}`);
        }
      } else {
        validation.isValid = false;
        validation.errors.push('HEXAGRAMS data not found or invalid');
      }
      
      // その他のデータ構造チェック
      const expectedStructures = ['WORLDVIEW_QUESTIONS', 'SCENARIO_QUESTIONS', 'H64_8D_VECTORS'];
      expectedStructures.forEach(structure => {
        if (!data[structure]) {
          validation.warnings.push(`${structure} data not found`);
        }
      });
      
    } catch (error) {
      validation.isValid = false;
      validation.errors.push(`Validation error: ${error.message}`);
      this.errorHandler?.record(error, { context: 'data-validation' });
    }
    
    return validation;
  };
  
  /**
   * パフォーマンス監視開始
   */
  DataManager.prototype.startPerformanceMonitoring = function() {
    if (!this.config.performanceOptimized) return;
    
    // 5秒間隔でメトリクス更新
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 5000);
    
    // メモリ使用量の定期チェック
    setInterval(() => {
      this.performanceMetrics.memoryUsage = this.estimateMemoryUsage();
      
      // メモリ使用量が閾値を超えた場合の警告
      const memoryLimitMB = 50; // 50MB
      if (this.performanceMetrics.memoryUsage > memoryLimitMB * 1024 * 1024) {
        console.warn('⚠️ DataManager memory usage high:', 
          (this.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2) + 'MB');
        this.performMemoryCleanup();
      }
    }, 30000); // 30秒間隔
  };
  
  /**
   * パフォーマンスメトリクス更新
   */
  DataManager.prototype.updatePerformanceMetrics = function() {
    const now = Date.now();
    const totalOperations = this.performanceMetrics.operationCount;
    
    if (totalOperations > 0) {
      this.performanceMetrics.averageOperationTime = 
        this.performanceMetrics.totalOperationTime / totalOperations;
    }
    
    // キャッシュ統計の更新
    const cacheStats = this.getCacheStats();
    this.performanceMetrics.cacheHitRate = parseFloat(cacheStats.hitRate) || 0;
    
    if (this.debugMode) {
      console.log('📊 DataManager Performance:', {
        operations: totalOperations,
        avgTime: this.performanceMetrics.averageOperationTime.toFixed(2) + 'ms',
        cacheHitRate: cacheStats.hitRate,
        memoryUsage: (this.performanceMetrics.memoryUsage / 1024).toFixed(2) + 'KB'
      });
    }
  };
  
  /**
   * メモリクリーンアップ実行
   */
  DataManager.prototype.performMemoryCleanup = function() {
    console.log('🧹 DataManager performing memory cleanup...');
    
    const beforeSize = this.cache.size;
    let cleanedCount = 0;
    
    // 古いキャッシュエントリの削除
    const now = Date.now();
    const expiredEntries = [];
    
    for (const [key, entry] of this.cache) {
      if (entry.timestamp && (now - entry.timestamp) > this.cacheTimeout) {
        expiredEntries.push(key);
      }
    }
    
    expiredEntries.forEach(key => {
      this.cache.delete(key);
      cleanedCount++;
    });
    
    // LRU方式での追加クリーンアップ（キャッシュサイズが大きい場合）
    if (this.cache.size > 500) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort((a, b) => (a[1].lastAccess || 0) - (b[1].lastAccess || 0));
        
      const toRemove = sortedEntries.slice(0, 100); // 古い100エントリを削除
      toRemove.forEach(([key]) => {
        this.cache.delete(key);
        cleanedCount++;
      });
    }
    
    console.log(`🧹 Memory cleanup completed: ${cleanedCount} entries removed (${beforeSize} → ${this.cache.size})`);
    
    // メトリクス更新
    this.cacheMetrics.evictions += cleanedCount;
  };
  
  /**
   * データリロード（エラー回復用）
   * @returns {Promise<boolean>} リロード成功フラグ
   */
  DataManager.prototype.reloadData = function() {
    console.log('🔄 DataManager reloading data...');
    
    // 現在の状態をクリア
    this.loaded = false;
    this.loading = false;
    this.data = {};
    this.cache.clear();
    this.hexagramIndex.clear();
    this.hexagramNameIndex.clear();
    this.hexagramArray = null;
    
    // 再読み込み実行
    return this.loadData();
  };
  
  /**
   * ヘルスチェック実行
   * @returns {Object} ヘルスチェック結果
   */
  DataManager.prototype.performHealthCheck = function() {
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      checks: {
        dataLoaded: this.loaded,
        cacheHealthy: this.cache.size > 0,
        noRecentErrors: this.errorHandler?.errors.length === 0,
        memoryWithinLimits: this.performanceMetrics.memoryUsage < 50 * 1024 * 1024
      },
      metrics: {
        ...this.performanceMetrics,
        cacheStats: this.getCacheStats()
      },
      recommendations: []
    };
    
    // ステータス判定
    const failedChecks = Object.entries(health.checks)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
      
    if (failedChecks.length > 0) {
      health.status = failedChecks.length > 2 ? 'critical' : 'warning';
      health.failedChecks = failedChecks;
    }
    
    // 推奨事項生成
    if (!health.checks.dataLoaded) {
      health.recommendations.push('データの再読み込みが必要です');
    }
    if (!health.checks.memoryWithinLimits) {
      health.recommendations.push('メモリクリーンアップを実行してください');
    }
    if (this.cacheMetrics.hits / this.cacheMetrics.totalRequests < 0.7) {
      health.recommendations.push('キャッシュ効率が低下しています');
    }
    
    return health;
  };
  
  /**
   * 設定の動的更新
   * @param {Object} newConfig - 新しい設定
   */
  DataManager.prototype.updateConfig = function(newConfig) {
    console.log('⚙️ Updating DataManager configuration...');
    
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...newConfig };
    
    // 設定変更に応じた処理
    if (newConfig.debugMode !== undefined) {
      this.debugMode = newConfig.debugMode;
    }
    
    if (newConfig.performanceOptimized !== undefined && 
        newConfig.performanceOptimized !== oldConfig.performanceOptimized) {
      if (newConfig.performanceOptimized) {
        this.startPerformanceMonitoring();
      }
    }
    
    console.log('✅ Configuration updated:', this.config);
  };
  
  /**
   * データのエクスポート（デバッグ用）
   * @returns {Object} エクスポートデータ
   */
  DataManager.prototype.exportDebugData = function() {
    if (!this.debugMode) {
      console.warn('⚠️ Debug mode not enabled');
      return null;
    }
    
    return {
      timestamp: Date.now(),
      config: this.config,
      loaded: this.loaded,
      dataKeys: Object.keys(this.data),
      cacheStats: this.getCacheStats(),
      performanceMetrics: this.performanceMetrics,
      recentErrors: this.errorHandler?.getRecentErrors(),
      healthCheck: this.performHealthCheck()
    };
  };
  
  console.log('🔧 DataManager helper methods loaded');
}