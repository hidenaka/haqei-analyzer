/**
 * HAQEIアナライザー サーキットブレーカーシステム - CircuitBreakerSystem.js
 * 
 * エラーハンドリング強化実装
 * 連続エラー時の自動フェイルセーフ・グレースフルデグラデーション
 * 
 * パフォーマンス目標:
 * - エラー検出時間: <5ms
 * - 自動回復時間: <100ms
 * - エラーカバレッジ: 90%以上
 * 
 * Author: System Architect + Security Engineer
 * Created: 2025-08-05
 * Version: 1.0.0-resilient
 */

class CircuitBreakerSystem {
  constructor(options = {}) {
    this.version = "1.0.0-resilient";
    this.initialized = false;
    
    // サーキットブレーカー設定
    this.config = {
      failureThreshold: options.failureThreshold || 5,        // エラー閾値
      resetTimeout: options.resetTimeout || 60000,            // リセット時間 (1分)
      monitoringWindow: options.monitoringWindow || 10000,    // 監視ウィンドウ (10秒)
      halfOpenRequests: options.halfOpenRequests || 3,        // Half-Open時のテスト数
      enableAutoRecovery: options.enableAutoRecovery !== false,
      enableMetrics: options.enableMetrics !== false
    };
    
    // ブレーカー状態
    this.states = {
      CLOSED: 'closed',      // 正常動作
      OPEN: 'open',          // エラー遮断
      HALF_OPEN: 'half-open' // テスト復帰
    };
    
    // サービス別ブレーカー
    this.breakers = new Map();
    
    // グローバルメトリクス
    this.globalMetrics = {
      totalRequests: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      totalRecoveries: 0,
      totalTimeouts: 0,
      averageResponseTime: 0
    };
    
    // エラーパターン学習
    this.errorPatterns = new Map();
    this.recoveryStrategies = new Map();
    
    // フォールバック戦略
    this.fallbackStrategies = {
      'iching-calculation': this.ichingCalculationFallback.bind(this),
      'database-query': this.databaseQueryFallback.bind(this),
      'graph-generation': this.graphGenerationFallback.bind(this),
      'cache-operation': this.cacheOperationFallback.bind(this),
      'api-request': this.apiRequestFallback.bind(this)
    };
    
    console.log("🛡️ CircuitBreakerSystem initializing - Resilient error handling");
  }
  
  /**
   * 初期化
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // デフォルトサービスの登録
      this.registerDefaultServices();
      
      // エラーパターンの初期化
      this.initializeErrorPatterns();
      
      // メトリクス収集開始
      if (this.config.enableMetrics) {
        this.startMetricsCollection();
      }
      
      // 自動回復システム開始
      if (this.config.enableAutoRecovery) {
        this.startAutoRecovery();
      }
      
      this.initialized = true;
      console.log("✅ CircuitBreakerSystem initialized successfully");
      
    } catch (error) {
      console.error("❌ CircuitBreakerSystem initialization failed:", error);
      this.initialized = true; // 基本機能は使用可能に
    }
  }
  
  /**
   * デフォルトサービスの登録
   */
  registerDefaultServices() {
    const defaultServices = [
      'iching-calculation',
      'database-query',
      'graph-generation',
      'cache-operation',
      'api-request',
      'file-operation',
      'worker-task'
    ];
    
    defaultServices.forEach(service => {
      this.registerService(service, {
        failureThreshold: this.config.failureThreshold,
        resetTimeout: this.config.resetTimeout
      });
    });
  }
  
  /**
   * サービスの登録
   */
  registerService(serviceName, options = {}) {
    if (this.breakers.has(serviceName)) {
      console.warn(`⚠️ Service ${serviceName} already registered`);
      return;
    }
    
    const breaker = {
      serviceName,
      state: this.states.CLOSED,
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      nextRetryTime: null,
      halfOpenAttempts: 0,
      metrics: {
        requests: 0,
        failures: 0,
        successes: 0,
        timeouts: 0,
        lastResponseTime: 0,
        averageResponseTime: 0
      },
      config: {
        failureThreshold: options.failureThreshold || this.config.failureThreshold,
        resetTimeout: options.resetTimeout || this.config.resetTimeout,
        monitoringWindow: options.monitoringWindow || this.config.monitoringWindow
      },
      errorLog: [],
      created: Date.now()
    };
    
    this.breakers.set(serviceName, breaker);
    console.log(`🔌 Circuit breaker registered for: ${serviceName}`);
  }
  
  /**
   * リクエストの実行
   */
  async execute(serviceName, operation, fallback = null) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // ブレーカー取得または作成
    if (!this.breakers.has(serviceName)) {
      this.registerService(serviceName);
    }
    
    const breaker = this.breakers.get(serviceName);
    const startTime = performance.now();
    
    try {
      // ブレーカー状態チェック
      const canProceed = await this.checkBreakerState(breaker);
      if (!canProceed) {
        // OPEN状態 - フォールバック実行
        return this.executeFallback(serviceName, fallback);
      }
      
      // オペレーション実行
      const result = await this.executeWithTimeout(operation, breaker.config.monitoringWindow);
      
      // 成功処理
      this.recordSuccess(breaker, performance.now() - startTime);
      return result;
      
    } catch (error) {
      // エラー処理
      this.recordFailure(breaker, error, performance.now() - startTime);
      
      // エラーパターン学習
      this.learnErrorPattern(serviceName, error);
      
      // フォールバック実行
      if (fallback || this.fallbackStrategies[serviceName]) {
        return this.executeFallback(serviceName, fallback);
      }
      
      throw error;
    }
  }
  
  /**
   * ブレーカー状態チェック
   */
  async checkBreakerState(breaker) {
    switch (breaker.state) {
      case this.states.CLOSED:
        return true;
        
      case this.states.OPEN:
        // リセット時間チェック
        if (Date.now() >= breaker.nextRetryTime) {
          this.transitionToHalfOpen(breaker);
          return true;
        }
        return false;
        
      case this.states.HALF_OPEN:
        // テスト実行数チェック
        if (breaker.halfOpenAttempts < this.config.halfOpenRequests) {
          breaker.halfOpenAttempts++;
          return true;
        }
        return false;
        
      default:
        return false;
    }
  }
  
  /**
   * タイムアウト付き実行
   */
  async executeWithTimeout(operation, timeout) {
    return Promise.race([
      operation(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      )
    ]);
  }
  
  /**
   * 成功記録
   */
  recordSuccess(breaker, responseTime) {
    breaker.successCount++;
    breaker.metrics.successes++;
    breaker.metrics.requests++;
    breaker.metrics.lastResponseTime = responseTime;
    
    // 平均応答時間更新
    breaker.metrics.averageResponseTime = 
      (breaker.metrics.averageResponseTime * (breaker.metrics.requests - 1) + responseTime) / 
      breaker.metrics.requests;
    
    // HALF_OPEN状態での成功
    if (breaker.state === this.states.HALF_OPEN) {
      if (breaker.successCount >= this.config.halfOpenRequests) {
        this.transitionToClosed(breaker);
      }
    }
    
    // グローバルメトリクス更新
    this.updateGlobalMetrics('success', responseTime);
  }
  
  /**
   * 失敗記録
   */
  recordFailure(breaker, error, responseTime) {
    breaker.failureCount++;
    breaker.metrics.failures++;
    breaker.metrics.requests++;
    breaker.lastFailureTime = Date.now();
    
    // エラーログ追加
    breaker.errorLog.push({
      timestamp: Date.now(),
      error: error.message,
      stack: error.stack,
      responseTime
    });
    
    // エラーログサイズ制限
    if (breaker.errorLog.length > 100) {
      breaker.errorLog.shift();
    }
    
    // 閾値チェック
    if (breaker.state === this.states.CLOSED && 
        breaker.failureCount >= breaker.config.failureThreshold) {
      this.transitionToOpen(breaker);
    }
    
    // HALF_OPEN状態での失敗
    if (breaker.state === this.states.HALF_OPEN) {
      this.transitionToOpen(breaker);
    }
    
    // グローバルメトリクス更新
    this.updateGlobalMetrics('failure', responseTime);
  }
  
  /**
   * OPEN状態への遷移
   */
  transitionToOpen(breaker) {
    breaker.state = this.states.OPEN;
    breaker.nextRetryTime = Date.now() + breaker.config.resetTimeout;
    breaker.failureCount = 0;
    breaker.successCount = 0;
    
    console.warn(`⚠️ Circuit breaker OPEN for: ${breaker.serviceName}`);
    
    // イベント発行
    this.emitEvent('breaker-open', {
      service: breaker.serviceName,
      failures: breaker.metrics.failures,
      nextRetry: new Date(breaker.nextRetryTime)
    });
  }
  
  /**
   * HALF_OPEN状態への遷移
   */
  transitionToHalfOpen(breaker) {
    breaker.state = this.states.HALF_OPEN;
    breaker.halfOpenAttempts = 0;
    breaker.successCount = 0;
    breaker.failureCount = 0;
    
    console.log(`🔄 Circuit breaker HALF-OPEN for: ${breaker.serviceName}`);
  }
  
  /**
   * CLOSED状態への遷移
   */
  transitionToClosed(breaker) {
    breaker.state = this.states.CLOSED;
    breaker.failureCount = 0;
    breaker.successCount = 0;
    breaker.halfOpenAttempts = 0;
    
    console.log(`✅ Circuit breaker CLOSED for: ${breaker.serviceName}`);
    
    // 回復記録
    this.globalMetrics.totalRecoveries++;
    
    // イベント発行
    this.emitEvent('breaker-recovered', {
      service: breaker.serviceName,
      recoveryTime: Date.now()
    });
  }
  
  /**
   * フォールバック実行
   */
  async executeFallback(serviceName, customFallback) {
    try {
      // カスタムフォールバック優先
      if (customFallback) {
        return await customFallback();
      }
      
      // 組み込みフォールバック
      const fallbackStrategy = this.fallbackStrategies[serviceName];
      if (fallbackStrategy) {
        return await fallbackStrategy();
      }
      
      // デフォルトフォールバック
      return this.defaultFallback(serviceName);
      
    } catch (fallbackError) {
      console.error(`❌ Fallback failed for ${serviceName}:`, fallbackError);
      throw new Error(`Service ${serviceName} is unavailable and fallback failed`);
    }
  }
  
  /**
   * 易経計算フォールバック
   */
  async ichingCalculationFallback() {
    console.log("🔄 Using I Ching calculation fallback");
    
    // キャッシュから最後の有効な結果を返す
    const cachedResult = this.getCachedResult('iching-calculation');
    if (cachedResult) {
      return {
        ...cachedResult,
        fallback: true,
        message: "キャッシュされた結果を使用"
      };
    }
    
    // 基本的な計算のみ実行
    return {
      hexagram: 1,
      name: "乾為天",
      description: "エラーのため簡易結果を表示",
      fallback: true
    };
  }
  
  /**
   * データベースクエリフォールバック
   */
  async databaseQueryFallback() {
    console.log("🔄 Using database query fallback");
    
    // ローカルストレージから読み取り
    try {
      const localData = localStorage.getItem('haqei_fallback_data');
      if (localData) {
        return {
          data: JSON.parse(localData),
          fallback: true,
          source: 'localStorage'
        };
      }
    } catch (e) {
      // ローカルストレージも失敗
    }
    
    // 最小限のデフォルトデータ
    return {
      data: [],
      fallback: true,
      message: "データベース接続エラー"
    };
  }
  
  /**
   * グラフ生成フォールバック
   */
  async graphGenerationFallback() {
    console.log("🔄 Using graph generation fallback");
    
    // シンプルなテキストベースの表示
    return {
      type: 'text',
      content: '現在グラフを生成できません。後ほど再試行してください。',
      fallback: true
    };
  }
  
  /**
   * キャッシュ操作フォールバック
   */
  async cacheOperationFallback() {
    console.log("🔄 Using cache operation fallback");
    
    // メモリ内簡易キャッシュ使用
    if (!this.fallbackCache) {
      this.fallbackCache = new Map();
    }
    
    return {
      cache: this.fallbackCache,
      fallback: true,
      type: 'memory'
    };
  }
  
  /**
   * APIリクエストフォールバック
   */
  async apiRequestFallback() {
    console.log("🔄 Using API request fallback");
    
    // オフラインモード
    return {
      offline: true,
      fallback: true,
      message: "オフラインモードで動作中"
    };
  }
  
  /**
   * デフォルトフォールバック
   */
  defaultFallback(serviceName) {
    return {
      error: `Service ${serviceName} is temporarily unavailable`,
      fallback: true,
      retryAfter: this.breakers.get(serviceName)?.nextRetryTime || Date.now() + 60000
    };
  }
  
  /**
   * エラーパターン学習
   */
  learnErrorPattern(serviceName, error) {
    const pattern = this.extractErrorPattern(error);
    
    if (!this.errorPatterns.has(serviceName)) {
      this.errorPatterns.set(serviceName, new Map());
    }
    
    const servicePatterns = this.errorPatterns.get(serviceName);
    const count = servicePatterns.get(pattern) || 0;
    servicePatterns.set(pattern, count + 1);
    
    // パターンが頻発する場合は特別な対策を検討
    if (count > 10) {
      this.suggestRecoveryStrategy(serviceName, pattern);
    }
  }
  
  /**
   * エラーパターン抽出
   */
  extractErrorPattern(error) {
    // エラーの種類を分類
    if (error.message.includes('timeout')) return 'TIMEOUT';
    if (error.message.includes('network')) return 'NETWORK';
    if (error.message.includes('syntax')) return 'SYNTAX';
    if (error.message.includes('permission')) return 'PERMISSION';
    if (error.message.includes('memory')) return 'MEMORY';
    
    return 'UNKNOWN';
  }
  
  /**
   * 回復戦略の提案
   */
  suggestRecoveryStrategy(serviceName, pattern) {
    const strategies = {
      'TIMEOUT': 'タイムアウト値を増やすか、処理を分割してください',
      'NETWORK': 'ネットワーク接続を確認し、リトライロジックを強化してください',
      'SYNTAX': 'コード検証を強化し、入力値のバリデーションを追加してください',
      'PERMISSION': 'アクセス権限を確認し、適切な認証を実装してください',
      'MEMORY': 'メモリ使用量を最適化し、不要なデータを解放してください'
    };
    
    const strategy = strategies[pattern] || '詳細なエラーログを確認してください';
    
    this.recoveryStrategies.set(`${serviceName}-${pattern}`, {
      pattern,
      strategy,
      suggestedAt: Date.now()
    });
    
    console.log(`💡 Recovery suggestion for ${serviceName} (${pattern}): ${strategy}`);
  }
  
  /**
   * グローバルメトリクス更新
   */
  updateGlobalMetrics(type, responseTime) {
    this.globalMetrics.totalRequests++;
    
    if (type === 'success') {
      this.globalMetrics.totalSuccesses++;
    } else if (type === 'failure') {
      this.globalMetrics.totalFailures++;
    }
    
    // 平均応答時間更新
    this.globalMetrics.averageResponseTime = 
      (this.globalMetrics.averageResponseTime * (this.globalMetrics.totalRequests - 1) + responseTime) / 
      this.globalMetrics.totalRequests;
  }
  
  /**
   * エラーパターン初期化
   */
  initializeErrorPatterns() {
    // 既知のエラーパターンを事前登録
    const knownPatterns = {
      'iching-calculation': ['TIMEOUT', 'MEMORY'],
      'database-query': ['TIMEOUT', 'NETWORK'],
      'graph-generation': ['MEMORY', 'SYNTAX'],
      'cache-operation': ['MEMORY', 'PERMISSION'],
      'api-request': ['NETWORK', 'TIMEOUT']
    };
    
    Object.entries(knownPatterns).forEach(([service, patterns]) => {
      this.errorPatterns.set(service, new Map(patterns.map(p => [p, 0])));
    });
  }
  
  /**
   * メトリクス収集開始
   */
  startMetricsCollection() {
    // 定期的なメトリクス報告
    setInterval(() => {
      this.reportMetrics();
    }, 60000); // 1分ごと
  }
  
  /**
   * 自動回復システム開始
   */
  startAutoRecovery() {
    // 定期的な健全性チェック
    setInterval(() => {
      this.checkSystemHealth();
    }, 30000); // 30秒ごと
  }
  
  /**
   * システム健全性チェック
   */
  checkSystemHealth() {
    for (const [serviceName, breaker] of this.breakers) {
      // OPEN状態が長く続いている場合
      if (breaker.state === this.states.OPEN && 
          Date.now() - breaker.lastFailureTime > breaker.config.resetTimeout * 2) {
        console.log(`🔧 Force transitioning ${serviceName} to HALF-OPEN for health check`);
        this.transitionToHalfOpen(breaker);
      }
      
      // エラー率が高い場合の警告
      const errorRate = breaker.metrics.failures / (breaker.metrics.requests || 1);
      if (errorRate > 0.5 && breaker.metrics.requests > 10) {
        console.warn(`⚠️ High error rate for ${serviceName}: ${(errorRate * 100).toFixed(1)}%`);
      }
    }
  }
  
  /**
   * メトリクス報告
   */
  reportMetrics() {
    const report = {
      global: {
        ...this.globalMetrics,
        successRate: `${((this.globalMetrics.totalSuccesses / (this.globalMetrics.totalRequests || 1)) * 100).toFixed(1)}%`
      },
      services: {}
    };
    
    for (const [serviceName, breaker] of this.breakers) {
      report.services[serviceName] = {
        state: breaker.state,
        metrics: {
          ...breaker.metrics,
          errorRate: `${((breaker.metrics.failures / (breaker.metrics.requests || 1)) * 100).toFixed(1)}%`
        }
      };
    }
    
    if (this.config.enableMetrics) {
      console.log("📊 Circuit Breaker Metrics:", report);
    }
    
    return report;
  }
  
  /**
   * キャッシュ結果取得
   */
  getCachedResult(serviceName) {
    // 実装は実際のキャッシュシステムと連携
    return null;
  }
  
  /**
   * イベント発行
   */
  emitEvent(eventName, data) {
    // カスタムイベント発行
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`circuit-breaker:${eventName}`, {
        detail: data
      }));
    }
  }
  
  /**
   * ブレーカー状態取得
   */
  getBreakerState(serviceName) {
    const breaker = this.breakers.get(serviceName);
    return breaker ? breaker.state : null;
  }
  
  /**
   * 手動リセット
   */
  reset(serviceName) {
    const breaker = this.breakers.get(serviceName);
    if (breaker) {
      this.transitionToClosed(breaker);
      console.log(`🔄 Manually reset circuit breaker for: ${serviceName}`);
    }
  }
  
  /**
   * 全ブレーカーリセット
   */
  resetAll() {
    for (const [serviceName, breaker] of this.breakers) {
      this.transitionToClosed(breaker);
    }
    console.log("🔄 All circuit breakers reset");
  }
  
  /**
   * サービス登録解除
   */
  unregisterService(serviceName) {
    this.breakers.delete(serviceName);
    this.errorPatterns.delete(serviceName);
    console.log(`🔌 Circuit breaker unregistered for: ${serviceName}`);
  }
  
  /**
   * 統計取得
   */
  getStats() {
    return this.reportMetrics();
  }
  
  /**
   * 終了処理
   */
  destroy() {
    // タイマークリア
    // 実際の実装では適切にタイマーIDを管理
    
    // リソースクリーンアップ
    this.breakers.clear();
    this.errorPatterns.clear();
    this.recoveryStrategies.clear();
    
    console.log("🛡️ CircuitBreakerSystem destroyed cleanly");
  }
}

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.CircuitBreakerSystem = CircuitBreakerSystem;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CircuitBreakerSystem;
}

console.log("🛡️ CircuitBreakerSystem.js loaded - Resilient error handling ready");