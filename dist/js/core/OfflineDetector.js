/**
 * OfflineDetector - HaQei Philosophy Offline Detection System
 * オフライン検出システム - HaQei哲学統合
 * Triple OS Architecture: Safe Mode Layer
 */

console.log('📡 OfflineDetector Loading with HaQei Philosophy...');

window.OfflineDetector = {
  // 初期化状態
  initialized: false,
  
  // 現在の接続状態
  connectionStatus: {
    online: navigator.onLine,
    lastCheck: Date.now(),
    reliability: 1.0,
    speed: 'unknown',
    quality: 'unknown'
  },
  
  // HaQei哲学適応戦略
  haqeiAdaptation: {
    // 調和原理：オンライン/オフライン状態の調和
    harmony: {
      graceful_degradation: true,
      smooth_transitions: true,
      user_notification: 'gentle'
    },
    
    // 慈悲原理：ユーザー体験への思いやり
    compassion: {
      preserve_user_work: true,
      minimize_disruption: true,
      provide_alternatives: true
    },
    
    // 智慧原理：適応的な対応
    wisdom: {
      learn_from_patterns: true,
      predictive_preparation: true,
      contextual_adaptation: true
    },
    
    // 真実原理：正確な状態報告
    authenticity: {
      honest_status: true,
      transparent_limitations: true,
      accurate_feedback: true
    }
  },
  
  // イベントリスナー
  listeners: new Set(),
  
  // 初期化
  async init() {
    console.log('🚀 OfflineDetector initializing with HaQei principles...');
    
    try {
      this.setupEventListeners();
      this.setupPeriodicChecks();
      this.initializeAdaptationStrategies();
      await this.performInitialConnectivityTest();
      
      this.initialized = true;
      console.log('✅ OfflineDetector initialized with HaQei philosophy');
    } catch (error) {
      console.error('❌ OfflineDetector initialization failed:', error);
      this.handleInitializationFailure(error);
    }
  },
  
  // イベントリスナー設定
  setupEventListeners() {
    console.log('🔧 Setting up connectivity event listeners...');
    
    // ブラウザのオンライン/オフラインイベント
    window.addEventListener('online', this.handleOnlineEvent.bind(this));
    window.addEventListener('offline', this.handleOfflineEvent.bind(this));
    
    // ページ可視性変更イベント
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // ネットワーク情報API（対応ブラウザのみ）
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', this.handleConnectionChange.bind(this));
    }
    
    console.log('✅ Event listeners setup complete');
  },
  
  // 定期チェック設定
  setupPeriodicChecks() {
    console.log('⏰ Setting up periodic connectivity checks...');
    
    // 定期的な接続チェック（30秒間隔）
    this.periodicCheckInterval = setInterval(() => {
      this.performConnectivityCheck();
    }, 30000);
    
    // 品質チェック（5分間隔）
    this.qualityCheckInterval = setInterval(() => {
      this.performQualityCheck();
    }, 300000);
    
    console.log('✅ Periodic checks setup complete');
  },
  
  // 適応戦略初期化
  initializeAdaptationStrategies() {
    console.log('🧠 Initializing HaQei adaptation strategies...');
    
    this.adaptationStrategies = {
      // 調和的グレースフル・デグラデーション
      harmoniousDegradation: {
        enabled: true,
        preserveCore: true,
        maintainUX: true,
        smoothTransition: true
      },
      
      // 慈悲的ユーザー配慮
      compassionateHandling: {
        preserveWork: true,
        gentleNotifications: true,
        provideAlternatives: true,
        minimizeAnxiety: true
      },
      
      // 智慧的予測対応
      wisdomBasedPrediction: {
        patternLearning: true,
        proactivePreparation: true,
        contextualAdaptation: true,
        intelligentRetry: true
      },
      
      // 真実の状態報告
      authenticCommunication: {
        honestFeedback: true,
        accurateStatus: true,
        transparentLimitations: true,
        reliableUpdates: true
      }
    };
    
    console.log('✅ Adaptation strategies initialized');
  },
  
  // 初期接続テスト
  async performInitialConnectivityTest() {
    console.log('🔍 Performing initial connectivity test...');
    
    try {
      const testResult = await this.testConnectivity();
      this.updateConnectionStatus(testResult);
      
      console.log(`✅ Initial connectivity test complete: ${testResult.online ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
      console.warn('⚠️ Initial connectivity test failed:', error);
      this.connectionStatus.reliability = 0.5;
    }
  },
  
  // 接続テスト実行
  async testConnectivity(timeout = 5000) {
    const testPromises = [
      this.testWithFetch(),
      this.testWithImage(),
      this.testWithPing()
    ];
    
    try {
      const results = await Promise.allSettled(
        testPromises.map(promise => this.withTimeout(promise, timeout))
      );
      
      const successCount = results.filter(result => result.status === 'fulfilled').length;
      const online = successCount > 0;
      
      return {
        online: online,
        reliability: successCount / testPromises.length,
        timestamp: Date.now(),
        method: 'comprehensive_test'
      };
      
    } catch (error) {
      return {
        online: false,
        reliability: 0,
        timestamp: Date.now(),
        method: 'test_failed',
        error: error.message
      };
    }
  },
  
  // Fetchベースのテスト
  async testWithFetch() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },
  
  // Imageベースのテスト
  async testWithImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 3000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Image load failed'));
      };
      
      // ランダムパラメータでキャッシュ回避
      img.src = `/favicon.ico?t=${Date.now()}`;
    });
  },
  
  // Pingテスト（利用可能な場合）
  async testWithPing() {
    if ('connection' in navigator && navigator.connection.rtt) {
      // ネットワーク情報APIのRTTを使用
      return navigator.connection.rtt < 2000; // 2秒以下なら良好
    }
    
    // フォールバック：簡単な接続テスト
    const startTime = performance.now();
    await this.testWithFetch();
    const endTime = performance.now();
    
    return (endTime - startTime) < 5000; // 5秒以下なら良好
  },
  
  // タイムアウト付きPromise実行
  withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      )
    ]);
  },
  
  // 接続状態更新
  updateConnectionStatus(testResult) {
    const previousStatus = this.connectionStatus.online;
    
    this.connectionStatus = {
      ...this.connectionStatus,
      online: testResult.online,
      lastCheck: testResult.timestamp,
      reliability: testResult.reliability,
      method: testResult.method
    };
    
    // 状態変更時の処理
    if (previousStatus !== testResult.online) {
      this.handleStatusChange(previousStatus, testResult.online);
    }
    
    // 品質情報の更新
    this.updateQualityMetrics();
  },
  
  // 品質メトリクス更新
  updateQualityMetrics() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      this.connectionStatus.speed = conn.effectiveType || 'unknown';
      
      // 品質分類
      if (conn.effectiveType === '4g' || conn.effectiveType === '3g') {
        this.connectionStatus.quality = 'good';
      } else if (conn.effectiveType === '2g') {
        this.connectionStatus.quality = 'poor';
      } else {
        this.connectionStatus.quality = 'unknown';
      }
    }
  },
  
  // オンラインイベント処理
  handleOnlineEvent(event) {
    console.log('🌐 Browser reported ONLINE status');
    
    // HaQei慈悲原理：ユーザーに優しい復帰
    this.performConnectivityCheck().then(() => {
      if (this.connectionStatus.online) {
        this.notifyListeners('online', {
          gentle: true,
          message: '接続が復旧しました',
          haqei_principle: 'compassion'
        });
      }
    });
  },
  
  // オフラインイベント処理
  handleOfflineEvent(event) {
    console.log('📵 Browser reported OFFLINE status');
    
    this.connectionStatus.online = false;
    this.connectionStatus.lastCheck = Date.now();
    
    // HaQei調和原理：グレースフルな機能縮退
    this.notifyListeners('offline', {
      graceful: true,
      message: 'オフラインモードに移行しました',
      haqei_principle: 'harmony'
    });
  },
  
  // 可視性変更処理
  handleVisibilityChange(event) {
    if (!document.hidden && this.initialized) {
      // ページが再び表示された時に接続チェック
      setTimeout(() => {
        this.performConnectivityCheck();
      }, 1000);
    }
  },
  
  // 接続情報変更処理
  handleConnectionChange(event) {
    console.log('📶 Network connection info changed');
    this.updateQualityMetrics();
    
    // 接続品質に基づく適応
    this.adaptToConnectionQuality();
  },
  
  // 状態変更処理
  handleStatusChange(previousOnline, currentOnline) {
    const changeType = currentOnline ? 'online' : 'offline';
    
    console.log(`🔄 Connection status changed: ${previousOnline ? 'ONLINE' : 'OFFLINE'} → ${currentOnline ? 'ONLINE' : 'OFFLINE'}`);
    
    // HaQei智慧原理：変化から学習
    this.learnFromStatusChange(previousOnline, currentOnline);
    
    // リスナーに通知
    this.notifyListeners('statuschange', {
      previous: previousOnline,
      current: currentOnline,
      timestamp: Date.now(),
      haqei_adaptation: this.getAdaptationStrategy(changeType)
    });
  },
  
  // 状態変化からの学習
  learnFromStatusChange(previous, current) {
    // パターン学習のためのデータ収集
    if (!this.connectionHistory) {
      this.connectionHistory = [];
    }
    
    this.connectionHistory.push({
      timestamp: Date.now(),
      previous: previous,
      current: current,
      context: this.getCurrentContext()
    });
    
    // 履歴のサイズ制限
    if (this.connectionHistory.length > 100) {
      this.connectionHistory = this.connectionHistory.slice(-50);
    }
  },
  
  // 現在のコンテキスト取得
  getCurrentContext() {
    return {
      page_visible: !document.hidden,
      time_of_day: new Date().getHours(),
      connection_quality: this.connectionStatus.quality,
      user_activity: this.estimateUserActivity()
    };
  },
  
  // ユーザーアクティビティ推定
  estimateUserActivity() {
    const now = Date.now();
    const timeSinceLastCheck = now - this.connectionStatus.lastCheck;
    
    if (timeSinceLastCheck < 60000) { // 1分以内
      return 'active';
    } else if (timeSinceLastCheck < 300000) { // 5分以内
      return 'moderate';
    } else {
      return 'idle';
    }
  },
  
  // 接続品質適応
  adaptToConnectionQuality() {
    const quality = this.connectionStatus.quality;
    
    const adaptationMessage = {
      good: 'high_performance_mode',
      poor: 'conservation_mode',
      unknown: 'balanced_mode'
    };
    
    this.notifyListeners('quality_adaptation', {
      quality: quality,
      adaptation: adaptationMessage[quality] || 'balanced_mode',
      haqei_principle: 'wisdom'
    });
  },
  
  // 適応戦略取得
  getAdaptationStrategy(changeType) {
    if (changeType === 'offline') {
      return {
        principle: 'harmony',
        strategy: 'graceful_degradation',
        actions: [
          'preserve_user_data',
          'enable_offline_features',
          'queue_pending_operations',
          'provide_gentle_notification'
        ]
      };
    } else {
      return {
        principle: 'compassion',
        strategy: 'smooth_restoration',
        actions: [
          'restore_online_features',
          'sync_offline_changes',
          'resume_operations',
          'confirm_restoration'
        ]
      };
    }
  },
  
  // 定期的接続チェック
  async performConnectivityCheck() {
    if (!this.initialized) return;
    
    try {
      const testResult = await this.testConnectivity();
      this.updateConnectionStatus(testResult);
    } catch (error) {
      console.warn('⚠️ Periodic connectivity check failed:', error);
    }
  },
  
  // 品質チェック実行
  async performQualityCheck() {
    if (!this.connectionStatus.online) return;
    
    try {
      const qualityResult = await this.assessConnectionQuality();
      this.updateQualityMetrics();
      
      this.notifyListeners('quality_check', {
        result: qualityResult,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('⚠️ Quality check failed:', error);
    }
  },
  
  // 接続品質評価
  async assessConnectionQuality() {
    const startTime = performance.now();
    
    try {
      await this.testWithFetch();
      const endTime = performance.now();
      const latency = endTime - startTime;
      
      let quality = 'good';
      if (latency > 2000) quality = 'poor';
      else if (latency > 1000) quality = 'moderate';
      
      return {
        latency: latency,
        quality: quality,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        latency: -1,
        quality: 'poor',
        error: error.message,
        timestamp: Date.now()
      };
    }
  },
  
  // 初期化失敗処理
  handleInitializationFailure(error) {
    console.error('💥 OfflineDetector initialization failed:', error);
    
    // 最低限の機能で動作
    this.connectionStatus = {
      online: navigator.onLine,
      lastCheck: Date.now(),
      reliability: 0.3,
      speed: 'unknown',
      quality: 'unknown',
      fallback_mode: true
    };
    
    this.initialized = true;
  },
  
  // リスナー追加
  addListener(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
  },
  
  // リスナー削除
  removeListener(callback) {
    this.listeners.delete(callback);
  },
  
  // リスナーに通知
  notifyListeners(eventType, data) {
    this.listeners.forEach(listener => {
      try {
        listener({
          type: eventType,
          data: data,
          timestamp: Date.now(),
          philosophy: 'haqei'
        });
      } catch (error) {
        console.error('⚠️ Listener notification failed:', error);
      }
    });
  },
  
  // 公開API - 現在の接続状態取得
  isOnline() {
    return this.connectionStatus.online;
  },
  
  // 公開API - 接続品質取得
  getConnectionQuality() {
    return {
      online: this.connectionStatus.online,
      quality: this.connectionStatus.quality,
      speed: this.connectionStatus.speed,
      reliability: this.connectionStatus.reliability,
      lastCheck: this.connectionStatus.lastCheck
    };
  },
  
  // 公開API - 強制接続チェック
  async forceCheck() {
    console.log('🔍 Forced connectivity check requested');
    return await this.performConnectivityCheck();
  },
  
  // 公開API - HaQei適応状態取得
  getHaQeiAdaptation() {
    return {
      philosophy: this.haqeiAdaptation,
      current_strategy: this.getAdaptationStrategy(this.connectionStatus.online ? 'online' : 'offline'),
      connection_history: this.connectionHistory?.slice(-10) || []
    };
  },
  
  // クリーンアップ
  cleanup() {
    if (this.periodicCheckInterval) {
      clearInterval(this.periodicCheckInterval);
    }
    
    if (this.qualityCheckInterval) {
      clearInterval(this.qualityCheckInterval);
    }
    
    // イベントリスナーの削除
    window.removeEventListener('online', this.handleOnlineEvent.bind(this));
    window.removeEventListener('offline', this.handleOfflineEvent.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    if ('connection' in navigator) {
      navigator.connection.removeEventListener('change', this.handleConnectionChange.bind(this));
    }
    
    this.listeners.clear();
    console.log('🧹 OfflineDetector cleanup complete');
  }
};

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  window.OfflineDetector.init();
});

// ページアンロード時のクリーンアップ
window.addEventListener('beforeunload', () => {
  if (window.OfflineDetector) {
    window.OfflineDetector.cleanup();
  }
});

console.log('✅ OfflineDetector loaded with HaQei Philosophy');