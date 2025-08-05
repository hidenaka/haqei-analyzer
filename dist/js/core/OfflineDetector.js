/**
 * OfflineDetector.js - Advanced Offline Detection System
 * HAQEI Future Simulator - Network Status Management
 * 
 * 目的:
 * - 高精度なオフライン状態の検出
 * - 段階的接続状態の判定
 * - 辞書システムとの連携
 * - ユーザー体験の最適化
 * 
 * 機能:
 * 1. リアルタイムオフライン検出
 * 2. 接続品質の評価
 * 3. CDN到達性テスト
 * 4. フォールバック戦略の提案
 */

class OfflineDetector {
  constructor() {
    this.isOnline = navigator.onLine;
    this.connectionQuality = 'unknown';
    this.lastOnlineTime = Date.now();
    this.lastOfflineTime = null;
    this.callbacks = new Set();
    
    // 接続テスト用エンドポイント
    this.testEndpoints = [
      { name: 'jsdelivr', url: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/package.json', timeout: 3000 },
      { name: 'unpkg', url: 'https://unpkg.com/kuromoji@0.1.2/package.json', timeout: 3000 },
      { name: 'google', url: 'https://www.google.com/favicon.ico', timeout: 2000 }
    ];
    
    this.setupEventListeners();
    this.startPeriodicCheck();
    
    console.log('🔍 OfflineDetector initialized');
  }
  
  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Browser online event detected');
      this.handleOnlineEvent();
    });
    
    window.addEventListener('offline', () => {
      console.log('📴 Browser offline event detected');
      this.handleOfflineEvent();
    });
    
    // ページの可視性変更時にチェック
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkConnection();
      }
    });
    
    // フォーカス時にチェック
    window.addEventListener('focus', () => {
      this.checkConnection();
    });
  }
  
  /**
   * オンラインイベントの処理
   */
  async handleOnlineEvent() {
    this.lastOnlineTime = Date.now();
    
    // 実際の接続を確認
    const actuallyOnline = await this.verifyConnection();
    
    if (actuallyOnline && !this.isOnline) {
      this.isOnline = true;
      this.notifyCallbacks({ type: 'online', timestamp: Date.now() });
    }
  }
  
  /**
   * オフラインイベントの処理
   */
  handleOfflineEvent() {
    this.lastOfflineTime = Date.now();
    
    if (this.isOnline) {
      this.isOnline = false;
      this.connectionQuality = 'offline';
      this.notifyCallbacks({ type: 'offline', timestamp: Date.now() });
    }
  }
  
  /**
   * 定期的な接続チェック
   */
  startPeriodicCheck() {
    // 30秒ごとにチェック
    setInterval(() => {
      this.checkConnection();
    }, 30000);
    
    // 初回チェック
    this.checkConnection();
  }
  
  /**
   * 接続状態のチェック
   */
  async checkConnection() {
    const wasOnline = this.isOnline;
    const currentlyOnline = await this.verifyConnection();
    
    if (currentlyOnline !== wasOnline) {
      this.isOnline = currentlyOnline;
      
      if (currentlyOnline) {
        this.lastOnlineTime = Date.now();
        this.notifyCallbacks({ type: 'online', timestamp: Date.now() });
      } else {
        this.lastOfflineTime = Date.now();
        this.connectionQuality = 'offline';
        this.notifyCallbacks({ type: 'offline', timestamp: Date.now() });
      }
    }
    
    // 接続品質の評価
    if (currentlyOnline) {
      this.evaluateConnectionQuality();
    }
  }
  
  /**
   * 実際の接続を確認
   */
  async verifyConnection() {
    if (!navigator.onLine) {
      return false;
    }
    
    try {
      // 複数のエンドポイントで並行テスト
      const testPromises = this.testEndpoints.map(endpoint => 
        this.testEndpoint(endpoint)
      );
      
      const results = await Promise.allSettled(testPromises);
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value
      ).length;
      
      // 50%以上のエンドポイントに接続できればオンライン
      return successCount >= Math.ceil(this.testEndpoints.length / 2);
      
    } catch (error) {
      console.warn('⚠️ Connection verification failed:', error.message);
      return false;
    }
  }
  
  /**
   * 個別エンドポイントのテスト
   */
  async testEndpoint(endpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout);
      
      const response = await fetch(endpoint.url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      return true;
      
    } catch (error) {
      return false;
    }
  }
  
  /**
   * 接続品質の評価
   */
  async evaluateConnectionQuality() {
    const startTime = Date.now();
    
    try {
      // 小さなファイルでレスポンス時間を測定
      const testUrl = 'https://www.google.com/favicon.ico';
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      const responseTime = Date.now() - startTime;
      
      if (responseTime < 500) {
        this.connectionQuality = 'excellent';
      } else if (responseTime < 1000) {
        this.connectionQuality = 'good';
      } else if (responseTime < 2000) {
        this.connectionQuality = 'fair';
      } else {
        this.connectionQuality = 'poor';
      }
      
      console.log(`🌐 Connection quality: ${this.connectionQuality} (${responseTime}ms)`);
      
    } catch (error) {
      this.connectionQuality = 'poor';
    }
  }
  
  /**
   * CDN到達性テスト
   */
  async testCDNReachability() {
    const cdnTests = [
      { name: 'jsdelivr', url: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/package.json' },
      { name: 'unpkg', url: 'https://unpkg.com/kuromoji@0.1.2/package.json' },
      { name: 'cdnjs', url: 'https://cdnjs.cloudflare.com/ajax/libs/kuromoji/0.1.2/package.json' }
    ];
    
    const results = {};
    
    for (const cdn of cdnTests) {
      try {
        const startTime = Date.now();
        const response = await fetch(cdn.url, {
          method: 'HEAD',
          mode: 'cors',
          cache: 'no-cache'
        });
        
        const responseTime = Date.now() - startTime;
        
        results[cdn.name] = {
          reachable: response.ok,
          responseTime,
          status: response.status
        };
        
      } catch (error) {
        results[cdn.name] = {
          reachable: false,
          error: error.message
        };
      }
    }
    
    console.log('🔍 CDN reachability test results:', results);
    return results;
  }
  
  /**
   * コールバックの登録
   */
  onStatusChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.add(callback);
    }
  }
  
  /**
   * コールバックの削除
   */
  offStatusChange(callback) {
    this.callbacks.delete(callback);
  }
  
  /**
   * コールバックの通知
   */
  notifyCallbacks(event) {
    this.callbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ Callback error:', error);
      }
    });
  }
  
  /**
   * 現在の状態を取得
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastOnlineTime: this.lastOnlineTime,
      lastOfflineTime: this.lastOfflineTime,
      offlineDuration: this.lastOfflineTime ? Date.now() - this.lastOfflineTime : 0
    };
  }
  
  /**
   * 辞書システム用の推奨戦略を取得
   */
  getDictionaryStrategy() {
    const status = this.getStatus();
    
    if (!status.isOnline) {
      return {
        strategy: 'local-only',
        reason: 'Offline detected',
        fallbackToSimple: true
      };
    }
    
    switch (status.connectionQuality) {
      case 'excellent':
      case 'good':
        return {
          strategy: 'cdn-preferred',
          reason: 'Good connection quality',
          allowCDN: true,
          fallbackToLocal: true
        };
        
      case 'fair':
        return {
          strategy: 'local-preferred',
          reason: 'Fair connection quality',
          allowCDN: false,
          fallbackToLocal: true
        };
        
      case 'poor':
      default:
        return {
          strategy: 'local-only',
          reason: 'Poor connection quality',
          allowCDN: false,
          fallbackToSimple: true
        };
    }
  }
  
  /**
   * ユーザー通知用のメッセージ生成
   */
  getStatusMessage() {
    const status = this.getStatus();
    
    if (!status.isOnline) {
      return {
        type: 'offline',
        message: 'オフライン モードで動作しています',
        detail: 'ローカル辞書を使用して分析を継続します',
        icon: '📴'
      };
    }
    
    switch (status.connectionQuality) {
      case 'excellent':
        return {
          type: 'online-excellent',
          message: '高速接続で動作中',
          detail: '最新の辞書データを使用できます',
          icon: '🚀'
        };
        
      case 'good':
        return {
          type: 'online-good',
          message: '安定した接続で動作中',
          detail: '辞書の更新が利用可能です',
          icon: '🌐'
        };
        
      case 'fair':
        return {
          type: 'online-fair',
          message: '接続が不安定です',
          detail: 'ローカル辞書を使用することをお勧めします',
          icon: '⚠️'
        };
        
      case 'poor':
      default:
        return {
          type: 'online-poor',
          message: '接続が非常に遅いです',
          detail: 'オフラインモードに切り替えることをお勧めします',
          icon: '🐌'
        };
    }
  }
}

// グローバルエクスポート
window.OfflineDetector = OfflineDetector;

console.log('🔍 OfflineDetector module loaded');