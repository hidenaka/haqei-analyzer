/**
 * PortManager - ポート管理システム
 * 
 * 機能:
 * - アプリケーション別ポート自動検出
 * - フォールバック機能
 * - 環境別設定対応
 */

class PortManager {
  constructor(configPath = '/config/port-config.json') {
    this.configPath = configPath;
    this.config = null;
    this.currentPorts = new Map();
  }

  /**
   * 設定ファイル読み込み
   */
  async loadConfig() {
    try {
      const response = await fetch(this.configPath);
      this.config = await response.json();
      console.log('✅ Port configuration loaded');
      return this.config;
    } catch (error) {
      console.warn('⚠️ Port config load failed, using defaults');
      this.config = this.getDefaultConfig();
      return this.config;
    }
  }

  /**
   * デフォルト設定
   */
  getDefaultConfig() {
    return {
      applications: {
        'os-analyzer': {
          defaultPort: 8001,
          fallbackPorts: [8002, 8003, 8004],
          description: 'OS Analyzer'
        },
        'future-simulator': {
          defaultPort: 8788,
          fallbackPorts: [8789, 8790, 8791],
          description: 'Future Simulator'
        }
      },
      environment: {
        development: {
          autoPortDetection: true,
          portRange: [8000, 9000]
        }
      }
    };
  }

  /**
   * 利用可能ポート検出
   */
  async findAvailablePort(appName) {
    if (!this.config) {
      await this.loadConfig();
    }

    const appConfig = this.config.applications[appName];
    if (!appConfig) {
      throw new Error(`Application ${appName} not found in config`);
    }

    // デフォルトポート確認
    const defaultPort = appConfig.defaultPort;
    if (await this.isPortAvailable(defaultPort)) {
      this.currentPorts.set(appName, defaultPort);
      return defaultPort;
    }

    // フォールバックポート確認
    for (const port of appConfig.fallbackPorts) {
      if (await this.isPortAvailable(port)) {
        this.currentPorts.set(appName, port);
        console.log(`🔄 Using fallback port ${port} for ${appName}`);
        return port;
      }
    }

    throw new Error(`No available ports found for ${appName}`);
  }

  /**
   * ポート利用可能性確認
   */
  async isPortAvailable(port) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        method: 'GET',
        timeout: 1000
      });
      return false; // レスポンスがある = ポート使用中
    } catch (error) {
      return true; // エラー = ポート利用可能
    }
  }

  /**
   * 現在のポート設定取得
   */
  getCurrentPort(appName) {
    return this.currentPorts.get(appName) || null;
  }

  /**
   * 全アプリケーションのポート状況
   */
  async getPortStatus() {
    if (!this.config) {
      await this.loadConfig();
    }

    const status = {};
    for (const [appName, appConfig] of Object.entries(this.config.applications)) {
      const currentPort = this.getCurrentPort(appName);
      const isActive = currentPort ? await !this.isPortAvailable(currentPort) : false;

      status[appName] = {
        description: appConfig.description,
        defaultPort: appConfig.defaultPort,
        currentPort: currentPort,
        isActive: isActive,
        url: currentPort ? `http://localhost:${currentPort}` : null
      };
    }

    return status;
  }

  /**
   * アプリケーション用URL生成
   */
  getAppUrl(appName, path = '') {
    const port = this.getCurrentPort(appName);
    if (!port) {
      throw new Error(`Port not assigned for ${appName}`);
    }
    return `http://localhost:${port}${path}`;
  }

  /**
   * OS Analyzer用URL取得
   */
  async getOSAnalyzerUrl(path = '') {
    const port = await this.findAvailablePort('os-analyzer');
    return `http://localhost:${port}${path}`;
  }

  /**
   * 動的ポート割り当て
   */
  async assignDynamicPort(appName, preferredPort = null) {
    if (preferredPort && await this.isPortAvailable(preferredPort)) {
      this.currentPorts.set(appName, preferredPort);
      return preferredPort;
    }

    return await this.findAvailablePort(appName);
  }
}

// グローバルインスタンス
if (typeof window !== 'undefined') {
  window.PortManager = PortManager;
  window.portManager = new PortManager();
}

console.log('✅ PortManager loaded');