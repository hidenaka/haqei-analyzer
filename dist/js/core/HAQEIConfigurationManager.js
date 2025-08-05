/**
 * HAQEI統一エラーハンドリングシステム - 設定管理システム
 * 
 * 目的：
 * - 動的設定変更とリアルタイム適用
 * - 環境別設定の自動切り替え
 * - デバッグモードとログレベル管理
 * - パフォーマンス設定の最適化
 * 
 * Features:
 * - Hot configuration reload
 * - Environment-specific profiles
 * - Runtime configuration validation
 * - Performance tuning controls
 * 
 * @author HAQEI System Architect
 * @date 2025-08-05
 */

class HAQEIConfigurationManager {
  constructor(options = {}) {
    this.version = "1.0.0-config-manager";
    this.initialized = false;
    
    // デフォルト設定
    this.defaultConfig = {
      // システム設定
      system: {
        environment: 'production', // development, staging, production
        debugMode: false,
        verboseLogging: false,
        performanceMode: 'balanced', // fast, balanced, thorough
        memoryOptimization: true
      },
      
      // エラーハンドリング設定
      errorHandling: {
        maxErrorHistory: 200,
        maxRetryAttempts: 3,
        gracefulDegradationEnabled: true,
        bunenjinModeEnabled: true,
        tripleOSIntegrationEnabled: true,
        userFriendlyMessages: true,
        autoRecoveryEnabled: true,
        logLevel: 'info' // debug, info, warn, error, silent
      },
      
      // 統合設定
      integration: {
        backwardCompatibility: true,
        autoDiscovery: true,
        migrationStrategy: 'gradual', // immediate, gradual, manual
        integrationTimeout: 10000,
        retryFailedIntegrations: true
      },
      
      // パフォーマンス設定
      performance: {
        enableLazyLoading: true,
        enableCodeSplitting: true,
        enableCaching: true,
        cacheTimeout: 300000, // 5 minutes
        memoryCleanupInterval: 60000, // 1 minute
        metricsCollectionInterval: 30000 // 30 seconds
      },
      
      // UI設定
      ui: {
        showNotifications: true,
        notificationDuration: 5000,
        showDebugPanel: false,
        showPerformanceMetrics: false,
        theme: 'auto', // light, dark, auto
        animations: true
      },
      
      // 開発者設定
      developer: {
        enableConsoleLogging: true,
        enableSourceMaps: false,
        enableProfiling: false,
        enableDetailedErrors: false,
        mockMode: false
      }
    };
    
    // 現在の設定
    this.currentConfig = {};
    
    // 環境プロファイル
    this.environmentProfiles = {
      development: {
        system: { debugMode: true, verboseLogging: true },
        errorHandling: { logLevel: 'debug' },
        ui: { showDebugPanel: true, showPerformanceMetrics: true },
        developer: { enableConsoleLogging: true, enableDetailedErrors: true }
      },
      
      staging: {
        system: { debugMode: false, verboseLogging: false },
        errorHandling: { logLevel: 'info' },
        ui: { showDebugPanel: false, showPerformanceMetrics: true },
        developer: { enableConsoleLogging: true, enableDetailedErrors: false }
      },
      
      production: {
        system: { debugMode: false, verboseLogging: false },
        errorHandling: { logLevel: 'warn' },
        ui: { showDebugPanel: false, showPerformanceMetrics: false },
        developer: { enableConsoleLogging: false, enableDetailedErrors: false }
      }
    };
    
    // 設定変更リスナー
    this.configChangeListeners = new Map();
    
    // 検証ルール
    this.validationRules = new Map();
    
    // 設定履歴
    this.configHistory = [];
    this.maxHistorySize = 10;
    
    // 初期化
    this.initialize(options);
    
    console.log(`⚙️ HAQEIConfigurationManager v${this.version} initialized`);
  }
  
  /**
   * 初期化
   */
  initialize(options = {}) {
    // 環境検出
    const detectedEnvironment = this.detectEnvironment();
    
    // 基本設定のマージ
    this.currentConfig = this.mergeConfigurations(
      this.defaultConfig,
      this.environmentProfiles[detectedEnvironment] || {},
      options
    );
    
    // 環境設定の適用
    this.currentConfig.system.environment = detectedEnvironment;
    
    // 検証ルールの設定
    this.setupValidationRules();
    
    // ローカルストレージから設定読み込み
    this.loadFromStorage();
    
    // 設定検証
    this.validateConfiguration();
    
    // URL パラメータからの設定読み込み
    this.loadFromURLParams();
    
    this.initialized = true;
    
    console.log(`⚙️ Configuration initialized for environment: ${this.currentConfig.system.environment}`);
  }
  
  /**
   * 環境検出
   */
  detectEnvironment() {
    // URL ベースの検出
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.')) {
      return 'development';
    }
    
    if (hostname.includes('staging') || hostname.includes('test')) {
      return 'staging';
    }
    
    // ファイルプロトコルでの実行
    if (window.location.protocol === 'file:') {
      return 'development';
    }
    
    // その他のチェック
    if (window.location.search.includes('debug=true') || window.location.hash.includes('debug')) {
      return 'development';
    }
    
    return 'production';
  }
  
  /**
   * 設定のマージ
   */
  mergeConfigurations(...configs) {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config);
    }, {});
  }
  
  /**
   * 深いマージ
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  /**
   * 検証ルールの設定
   */
  setupValidationRules() {
    // システム設定の検証
    this.validationRules.set('system.environment', (value) => {
      return ['development', 'staging', 'production'].includes(value);
    });
    
    this.validationRules.set('system.performanceMode', (value) => {
      return ['fast', 'balanced', 'thorough'].includes(value);
    });
    
    // エラーハンドリング設定の検証
    this.validationRules.set('errorHandling.maxErrorHistory', (value) => {
      return typeof value === 'number' && value > 0 && value <= 1000;
    });
    
    this.validationRules.set('errorHandling.maxRetryAttempts', (value) => {
      return typeof value === 'number' && value >= 0 && value <= 10;
    });
    
    this.validationRules.set('errorHandling.logLevel', (value) => {
      return ['debug', 'info', 'warn', 'error', 'silent'].includes(value);
    });
    
    // パフォーマンス設定の検証
    this.validationRules.set('performance.cacheTimeout', (value) => {
      return typeof value === 'number' && value >= 0;
    });
    
    this.validationRules.set('performance.memoryCleanupInterval', (value) => {
      return typeof value === 'number' && value >= 1000;
    });
  }
  
  /**
   * 設定検証
   */
  validateConfiguration(config = this.currentConfig) {
    const errors = [];
    
    this.validationRules.forEach((validator, key) => {
      const value = this.getNestedValue(config, key);
      
      if (value !== undefined && !validator(value)) {
        errors.push(`Invalid configuration value for ${key}: ${value}`);
      }
    });
    
    if (errors.length > 0) {
      console.warn("⚠️ Configuration validation errors:", errors);
      
      if (this.currentConfig.system.debugMode) {
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
      }
    }
    
    return errors;
  }
  
  /**
   * ネストした値の取得
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
  
  /**
   * ネストした値の設定
   */
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }
  
  /**
   * ローカルストレージから設定読み込み
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('haqei_error_config');
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        this.currentConfig = this.mergeConfigurations(this.currentConfig, parsedConfig);
        console.log("⚙️ Configuration loaded from localStorage");
      }
    } catch (error) {
      console.warn("⚠️ Failed to load configuration from localStorage:", error);
    }
  }
  
  /**
   * ローカルストレージに設定保存
   */
  saveToStorage() {
    try {
      localStorage.setItem('haqei_error_config', JSON.stringify(this.currentConfig));
      console.log("⚙️ Configuration saved to localStorage");
    } catch (error) {
      console.warn("⚠️ Failed to save configuration to localStorage:", error);
    }
  }
  
  /**
   * URL パラメータから設定読み込み
   */
  loadFromURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // デバッグモード
    if (urlParams.has('debug')) {
      this.set('system.debugMode', urlParams.get('debug') === 'true');
      this.set('system.verboseLogging', urlParams.get('debug') === 'true');
      this.set('ui.showDebugPanel', urlParams.get('debug') === 'true');
    }
    
    // ログレベル
    if (urlParams.has('logLevel')) {
      this.set('errorHandling.logLevel', urlParams.get('logLevel'));
    }
    
    // パフォーマンスモード
    if (urlParams.has('performance')) {
      this.set('system.performanceMode', urlParams.get('performance'));
    }
    
    // 環境設定
    if (urlParams.has('env')) {
      this.set('system.environment', urlParams.get('env'));
    }
  }
  
  /**
   * 設定値の取得
   */
  get(key, defaultValue = undefined) {
    const value = this.getNestedValue(this.currentConfig, key);
    return value !== undefined ? value : defaultValue;
  }
  
  /**
   * 設定値の設定
   */
  set(key, value, options = {}) {
    const { save = true, notify = true, validate = true } = options;
    
    // 履歴に現在の設定を保存
    this.addToHistory();
    
    // 値の設定
    this.setNestedValue(this.currentConfig, key, value);
    
    // 検証
    if (validate) {
      const errors = this.validateConfiguration();
      if (errors.length > 0 && this.currentConfig.system.debugMode) {
        // 値を元に戻す
        this.rollback();
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
      }
    }
    
    // 保存
    if (save) {
      this.saveToStorage();
    }
    
    // 通知
    if (notify) {
      this.notifyConfigChange(key, value);
    }
    
    console.log(`⚙️ Configuration set: ${key} = ${JSON.stringify(value)}`);
  }
  
  /**
   * 複数設定の一括設定
   */
  setMultiple(configs, options = {}) {
    const { save = true, notify = true, validate = true } = options;
    
    // 履歴に現在の設定を保存
    this.addToHistory();
    
    // 値の設定
    Object.entries(configs).forEach(([key, value]) => {
      this.setNestedValue(this.currentConfig, key, value);
    });
    
    // 検証
    if (validate) {
      const errors = this.validateConfiguration();
      if (errors.length > 0 && this.currentConfig.system.debugMode) {
        // 値を元に戻す
        this.rollback();
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
      }
    }
    
    // 保存
    if (save) {
      this.saveToStorage();
    }
    
    // 通知
    if (notify) {
      Object.entries(configs).forEach(([key, value]) => {
        this.notifyConfigChange(key, value);
      });
    }
    
    console.log(`⚙️ Multiple configurations set:`, configs);
  }
  
  /**
   * 環境プロファイル適用
   */
  applyEnvironmentProfile(environment) {
    if (!this.environmentProfiles[environment]) {
      throw new Error(`Unknown environment profile: ${environment}`);
    }
    
    const profile = this.environmentProfiles[environment];
    this.setMultiple(profile, { validate: true });
    this.set('system.environment', environment);
    
    console.log(`⚙️ Applied environment profile: ${environment}`);
  }
  
  /**
   * 設定リセット
   */
  reset(section = null) {
    this.addToHistory();
    
    if (section) {
      // 特定セクションのリセット
      if (this.defaultConfig[section]) {
        this.currentConfig[section] = { ...this.defaultConfig[section] };
        console.log(`⚙️ Configuration section reset: ${section}`);
      }
    } else {
      // 全体リセット
      this.currentConfig = { ...this.defaultConfig };
      console.log("⚙️ All configuration reset to defaults");
    }
    
    this.saveToStorage();
    this.notifyConfigChange('reset', section);
  }
  
  /**
   * 設定変更リスナーの追加
   */
  onChange(key, callback) {
    if (!this.configChangeListeners.has(key)) {
      this.configChangeListeners.set(key, []);
    }
    
    this.configChangeListeners.get(key).push(callback);
    
    console.log(`⚙️ Change listener added for: ${key}`);
  }
  
  /**
   * 設定変更リスナーの削除
   */
  offChange(key, callback) {
    if (this.configChangeListeners.has(key)) {
      const listeners = this.configChangeListeners.get(key);
      const index = listeners.indexOf(callback);
      
      if (index > -1) {
        listeners.splice(index, 1);
        console.log(`⚙️ Change listener removed for: ${key}`);
      }
    }
  }
  
  /**
   * 設定変更通知
   */
  notifyConfigChange(key, value) {
    // 特定キーのリスナー
    if (this.configChangeListeners.has(key)) {
      this.configChangeListeners.get(key).forEach(callback => {
        try {
          callback(value, key);
        } catch (error) {
          console.error(`⚠️ Configuration change listener error for ${key}:`, error);
        }
      });
    }
    
    // 全体リスナー
    if (this.configChangeListeners.has('*')) {
      this.configChangeListeners.get('*').forEach(callback => {
        try {
          callback(value, key);
        } catch (error) {
          console.error("⚠️ Global configuration change listener error:", error);
        }
      });
    }
  }
  
  /**
   * 履歴に追加
   */
  addToHistory() {
    this.configHistory.unshift({
      timestamp: Date.now(),
      config: JSON.parse(JSON.stringify(this.currentConfig))
    });
    
    if (this.configHistory.length > this.maxHistorySize) {
      this.configHistory = this.configHistory.slice(0, this.maxHistorySize);
    }
  }
  
  /**
   * ロールバック
   */
  rollback(steps = 1) {
    if (this.configHistory.length === 0) {
      console.warn("⚠️ No configuration history available for rollback");
      return false;
    }
    
    const targetIndex = Math.min(steps - 1, this.configHistory.length - 1);
    const targetConfig = this.configHistory[targetIndex];
    
    this.currentConfig = JSON.parse(JSON.stringify(targetConfig.config));
    this.saveToStorage();
    
    console.log(`⚙️ Configuration rolled back ${steps} step(s)`);
    return true;
  }
  
  /**
   * 設定エクスポート
   */
  export() {
    return {
      version: this.version,
      timestamp: Date.now(),
      environment: this.currentConfig.system.environment,
      config: JSON.parse(JSON.stringify(this.currentConfig))
    };
  }
  
  /**
   * 設定インポート
   */
  import(exportedConfig) {
    try {
      if (!exportedConfig.config) {
        throw new Error("Invalid configuration format");
      }
      
      this.addToHistory();
      this.currentConfig = this.mergeConfigurations(this.defaultConfig, exportedConfig.config);
      
      // 検証
      const errors = this.validateConfiguration();
      if (errors.length > 0) {
        this.rollback();
        throw new Error(`Imported configuration validation failed: ${errors.join(', ')}`);
      }
      
      this.saveToStorage();
      this.notifyConfigChange('import', exportedConfig);
      
      console.log("⚙️ Configuration imported successfully");
      return true;
      
    } catch (error) {
      console.error("❌ Configuration import failed:", error);
      return false;
    }
  }
  
  /**
   * 設定情報の取得
   */
  getInfo() {
    return {
      version: this.version,
      initialized: this.initialized,
      environment: this.currentConfig.system.environment,
      debugMode: this.currentConfig.system.debugMode,
      configSize: JSON.stringify(this.currentConfig).length,
      historySize: this.configHistory.length,
      listenerCount: Array.from(this.configChangeListeners.values()).flat().length
    };
  }
  
  /**
   * デバッグ情報の出力
   */
  debug() {
    if (!this.currentConfig.system.debugMode) {
      console.warn("⚠️ Debug mode is disabled");
      return;
    }
    
    console.group("🔧 HAQEI Configuration Debug");
    console.log("Version:", this.version);
    console.log("Environment:", this.currentConfig.system.environment);
    console.log("Current Config:", this.currentConfig);
    console.log("Config History:", this.configHistory);
    console.log("Change Listeners:", this.configChangeListeners);
    console.log("Validation Rules:", this.validationRules);
    console.groupEnd();
  }
  
  /**
   * クリーンアップ
   */
  cleanup() {
    this.configChangeListeners.clear();
    this.configHistory = [];
    
    console.log("🧹 HAQEIConfigurationManager cleanup completed");
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.HAQEIConfigurationManager = HAQEIConfigurationManager;
  
  // グローバル設定マネージャーのインスタンス作成
  if (!window.haqeiConfig) {
    window.haqeiConfig = new HAQEIConfigurationManager();
  }
}

// Node.js環境での公開
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HAQEIConfigurationManager;
}

console.log("⚙️ HAQEIConfigurationManager.js loaded - Dynamic configuration management ready");