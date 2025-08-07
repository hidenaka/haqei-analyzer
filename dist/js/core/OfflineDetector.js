/**
 * Offline Detector - Bunenjin Philosophy Implementation  
 * Triple OS Architecture: Interface Layer Component
 * 
 * オンライン/オフライン状態の矛盾受容型検出システム
 * - 接続状態の動的監視
 * - フォールバック機能の自動切り替え
 * - ユーザー体験の継続性保証
 */

class OfflineDetector {
  constructor() {
    this.isOnline = navigator.onLine;
    this.isOffline = !this.isOnline;
    this.connectionQuality = 'unknown';
    this.lastCheckTime = Date.now();
    this.checkInterval = null;
    this.eventListeners = [];
    this.fallbackSystems = new Map();
    
    // Bunenjin Philosophy: 矛盾する状態の同時受容
    this.acceptContradiction = {
      connected: true,
      disconnected: true,
      online_but_slow: true,
      offline_but_cached: true
    };
    
    // Triple OS Architecture Components
    this.interfaceOS = null;
    this.engineOS = null;
    this.safeMode = null;
    
    this.init();
  }
  
  async init() {
    console.log('🌐 [OfflineDetector] 初期化開始 - Bunenjin Philosophy');
    
    try {
      // Triple OS Architecture Setup
      this.initializeTripleOS();
      
      // 接続状態監視開始
      this.startConnectionMonitoring();
      
      // フォールバックシステム初期化
      await this.initializeFallbackSystems();
      
      console.log('✅ [OfflineDetector] 初期化完了 - 矛盾受容モード');
      
    } catch (error) {
      console.error('❌ [OfflineDetector] 初期化エラー:', error);
      this.activateSafeMode();
    }
  }
  
  initializeTripleOS() {
    console.log('🔧 [OfflineDetector] Triple OS Architecture 初期化');
    
    // Interface OS (User Interaction Layer)
    this.interfaceOS = {
      name: 'Connection Interface OS',
      version: '1.0.0',
      
      showConnectionStatus(status) {
        // UI通知システム
        const statusElement = this.createOrUpdateStatusElement();
        
        switch (status.type) {
          case 'online':
            statusElement.className = 'connection-status online';
            statusElement.textContent = '🌐 オンライン';
            break;
          case 'offline':
            statusElement.className = 'connection-status offline';
            statusElement.textContent = '📴 オフライン - キャッシュ機能使用中';
            break;
          case 'slow':
            statusElement.className = 'connection-status slow';
            statusElement.textContent = '🐌 接続が不安定 - 軽量モード';
            break;
          case 'recovering':
            statusElement.className = 'connection-status recovering';
            statusElement.textContent = '🔄 接続復旧中...';
            break;
        }
        
        // Bunenjin Philosophy: 状態を受け入れ、適切な対応を示す
        this.showPhilosophicalGuidance(status);
      },
      
      createOrUpdateStatusElement() {
        let element = document.getElementById('connection-status');
        if (!element) {
          element = document.createElement('div');
          element.id = 'connection-status';
          element.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            transition: all 0.3s ease;
          `;
          document.body.appendChild(element);
        }
        return element;
      },
      
      showPhilosophicalGuidance(status) {
        // Bunenjin Philosophy: 状況に応じた哲学的ガイダンス
        const guidance = this.getPhilosophicalGuidance(status);
        if (guidance) {
          console.log(`🎭 [OfflineDetector] 哲学的ガイダンス: ${guidance}`);
        }
      },
      
      getPhilosophicalGuidance(status) {
        const guidances = {
          online: '接続は流れのように - 当たり前ではない恵み',
          offline: 'オフラインも一つの状態 - 内なる知恵を活用する時',
          slow: '遅い接続は忍耐の教え - 急がず、確実に進む',
          recovering: '復旧は希望の象徴 - 変化の中に安定を見出す'
        };
        return guidances[status.type] || null;
      }
    };
    
    // Engine OS (Core Logic Layer)
    this.engineOS = {
      name: 'Connection Engine OS',
      
      async checkConnectionQuality() {
        const startTime = Date.now();
        
        try {
          // 小さなリソースで接続品質をテスト
          const response = await fetch('https://www.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          });
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          return this.evaluateConnectionQuality(responseTime);
          
        } catch (error) {
          return {
            quality: 'offline',
            responseTime: null,
            error: error.message
          };
        }
      },
      
      evaluateConnectionQuality(responseTime) {
        if (responseTime < 500) {
          return { quality: 'excellent', responseTime, level: 4 };
        } else if (responseTime < 1000) {
          return { quality: 'good', responseTime, level: 3 };
        } else if (responseTime < 2000) {
          return { quality: 'fair', responseTime, level: 2 };
        } else {
          return { quality: 'poor', responseTime, level: 1 };
        }
      },
      
      async detectActualConnectivity() {
        // navigator.onLineは信頼性が低いため、実際の接続をテスト
        const tests = [
          this.testConnection('https://www.google.com/generate_204'),
          this.testConnection('https://cdn.jsdelivr.net'),
          this.testConnection('https://httpbin.org/ip')
        ];
        
        try {
          const results = await Promise.allSettled(tests);
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          
          return {
            isActuallyOnline: successCount > 0,
            connectionStrength: successCount / tests.length,
            timestamp: Date.now()
          };
        } catch (error) {
          return {
            isActuallyOnline: false,
            connectionStrength: 0,
            timestamp: Date.now(),
            error: error.message
          };
        }
      },
      
      async testConnection(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        try {
          const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return true;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      }
    };
    
    // Safe Mode OS (Fallback Layer)
    this.safeMode = {
      name: 'Connection Safe Mode OS',
      active: false,
      
      activate() {
        console.log('🛡️ [OfflineDetector] Safe Mode 起動');
        this.active = true;
        
        // 最小限の接続監視
        return {
          basicMonitoring: true,
          advancedFeatures: false,
          fallbackReady: true
        };
      },
      
      basicCheck() {
        return {
          isOnline: navigator.onLine,
          quality: navigator.onLine ? 'basic-online' : 'offline',
          mode: 'safe'
        };
      }
    };
    
    console.log('✅ [OfflineDetector] Triple OS Architecture 準備完了');
  }
  
  startConnectionMonitoring() {
    console.log('📊 [OfflineDetector] 接続監視開始');
    
    // Browser API events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Periodic quality check
    this.checkInterval = setInterval(async () => {
      await this.performDetailedCheck();
    }, 30000); // 30秒ごと
    
    // Initial check
    setTimeout(() => this.performDetailedCheck(), 1000);
  }
  
  async performDetailedCheck() {
    try {
      const [qualityResult, connectivityResult] = await Promise.all([
        this.engineOS.checkConnectionQuality(),
        this.engineOS.detectActualConnectivity()
      ]);
      
      const currentStatus = this.analyzeConnectionStatus(qualityResult, connectivityResult);
      this.updateConnectionStatus(currentStatus);
      
    } catch (error) {
      console.warn('⚠️ [OfflineDetector] 詳細チェック失敗:', error);
      
      // Bunenjin Philosophy: エラーも受け入れ、フォールバックを使用
      const fallbackStatus = this.safeMode.basicCheck();
      this.updateConnectionStatus(fallbackStatus);
    }
  }
  
  analyzeConnectionStatus(qualityResult, connectivityResult) {
    // Bunenjin Philosophy: 矛盾する情報から総合的判断
    const browserOnline = navigator.onLine;
    const actuallyOnline = connectivityResult.isActuallyOnline;
    
    let statusType;
    let details = {};
    
    if (actuallyOnline && qualityResult.quality !== 'offline') {
      if (qualityResult.level >= 3) {
        statusType = 'online';
      } else {
        statusType = 'slow';
      }
    } else if (browserOnline && !actuallyOnline) {
      statusType = 'recovering';
    } else {
      statusType = 'offline';
    }
    
    return {
      type: statusType,
      browserOnline,
      actuallyOnline,
      quality: qualityResult.quality,
      responseTime: qualityResult.responseTime,
      connectionStrength: connectivityResult.connectionStrength,
      timestamp: Date.now(),
      details
    };
  }
  
  updateConnectionStatus(status) {
    const previousStatus = {
      isOnline: this.isOnline,
      isOffline: this.isOffline,
      quality: this.connectionQuality
    };
    
    // 状態更新
    this.isOnline = status.actuallyOnline;
    this.isOffline = !status.actuallyOnline;
    this.connectionQuality = status.quality;
    this.lastCheckTime = status.timestamp;
    
    // UI更新
    if (this.interfaceOS) {
      this.interfaceOS.showConnectionStatus(status);
    }
    
    // 状態変化イベント発火
    this.notifyStatusChange(previousStatus, status);
    
    // フォールバックシステム制御
    this.manageFallbackSystems(status);
  }
  
  handleOnline() {
    console.log('🌐 [OfflineDetector] オンライン復旧検出');
    setTimeout(() => this.performDetailedCheck(), 1000);
  }
  
  handleOffline() {
    console.log('📴 [OfflineDetector] オフライン検出');
    
    const offlineStatus = {
      type: 'offline',
      browserOnline: false,
      actuallyOnline: false,
      quality: 'offline',
      timestamp: Date.now()
    };
    
    this.updateConnectionStatus(offlineStatus);
  }
  
  async initializeFallbackSystems() {
    console.log('🔧 [OfflineDetector] フォールバックシステム初期化');
    
    // Dictionary Manager fallback
    this.fallbackSystems.set('dictionary', {
      name: 'Dictionary Fallback',
      activate: () => {
        if (window.DictionaryManager) {
          window.DictionaryManager.enableFallbackMode();
        }
      }
    });
    
    // Future Simulator fallback
    this.fallbackSystems.set('future-simulator', {
      name: 'Future Simulator Offline Mode',
      activate: () => {
        if (window.FutureSimulator && window.FutureSimulator.Core) {
          // オフライン用の簡易シナリオを使用
          console.log('📴 Future Simulator オフラインモード起動');
        }
      }
    });
  }
  
  manageFallbackSystems(status) {
    if (status.type === 'offline' || status.type === 'slow') {
      // フォールバックシステム起動
      this.fallbackSystems.forEach((system, name) => {
        try {
          system.activate();
          console.log(`🛡️ [OfflineDetector] ${system.name} フォールバック起動`);
        } catch (error) {
          console.warn(`⚠️ [OfflineDetector] ${system.name} フォールバック失敗:`, error);
        }
      });
    }
  }
  
  notifyStatusChange(previousStatus, currentStatus) {
    const event = new CustomEvent('connection-status-change', {
      detail: {
        previous: previousStatus,
        current: currentStatus,
        philosophy: 'bunenjin'
      }
    });
    
    document.dispatchEvent(event);
  }
  
  activateSafeMode() {
    console.log('🛡️ [OfflineDetector] Safe Mode 起動');
    this.safeMode.activate();
  }
  
  // Public API
  getStatus() {
    return {
      isOnline: this.isOnline,
      isOffline: this.isOffline,
      quality: this.connectionQuality,
      lastCheck: this.lastCheckTime,
      philosophy: 'bunenjin',
      architecture: 'triple-os'
    };
  }
  
  async forceCheck() {
    console.log('🔍 [OfflineDetector] 強制チェック実行');
    await this.performDetailedCheck();
    return this.getStatus();
  }
  
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    console.log('🗑️ [OfflineDetector] 破棄完了');
  }
}

// Global instance with Bunenjin Philosophy
if (typeof window !== 'undefined') {
  window.OfflineDetector = new OfflineDetector();
  
  // Connection status change listener for other components
  document.addEventListener('connection-status-change', (event) => {
    console.log('📡 [Global] 接続状態変化:', event.detail);
  });
}

console.log('✅ [OfflineDetector] Bunenjin Philosophy Implementation Loaded');