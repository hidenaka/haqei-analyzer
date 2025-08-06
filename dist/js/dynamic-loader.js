/**
 * Dynamic Loader System for HAQEI Analyzer
 * Bundle size削減のための動的インポートシステム
 * 目標: 初期ロード3MB以下、必要時のみロード
 */

class DynamicLoader {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
    this.errorRetryCount = new Map();
    this.maxRetries = 3;
  }

  /**
   * コンポーネントの動的ロード
   * @param {string} componentName - コンポーネント名
   * @param {Object} options - ロードオプション
   * @returns {Promise<Object>} ロードされたコンポーネント
   */
  async loadComponent(componentName, options = {}) {
    const {
      timeout = 10000,
      retryOnError = true,
      preload = false
    } = options;

    // 既にロード済みの場合
    if (this.loadedModules.has(componentName)) {
      return this.loadedModules.get(componentName);
    }

    // ロード中の場合は既存のPromiseを返す
    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName);
    }

    // 新規ロード開始
    const loadPromise = this._loadWithRetry(componentName, timeout, retryOnError);
    this.loadingPromises.set(componentName, loadPromise);

    try {
      const module = await loadPromise;
      this.loadedModules.set(componentName, module);
      this.loadingPromises.delete(componentName);
      return module;
    } catch (error) {
      this.loadingPromises.delete(componentName);
      throw error;
    }
  }

  /**
   * Route-based code splitting実装
   * @param {string} route - ルート名
   * @returns {Promise<Object>} ルートコンポーネント
   */
  async loadRoute(route) {
    const routeMap = {
      'os-analyzer': () => this._loadAnalysisComponents(),
      'future-simulator': () => this._loadFutureSimulatorComponents(),
      'results': () => this._loadResultsComponents(),
      'cockpit': () => this._loadCockpitComponents()
    };

    const loader = routeMap[route];
    if (!loader) {
      throw new Error(`Unknown route: ${route}`);
    }

    return loader();
  }

  /**
   * 辞書ファイルの動的ロード
   * @param {string} dictType - 辞書タイプ
   * @returns {Promise<ArrayBuffer>} 辞書データ
   */
  async loadDictionary(dictType) {
    const dictMap = {
      'base': './dict/base.dat.gz',
      'check': './dict/check.dat.gz',
      'tid': './dict/tid.dat.gz',
      'tid_map': './dict/tid_map.dat.gz',
      'tid_pos': './dict/tid_pos.dat.gz'
    };

    const url = dictMap[dictType];
    if (!url) {
      throw new Error(`Unknown dictionary type: ${dictType}`);
    }

    const cacheKey = `dict-${dictType}`;
    
    // キャッシュ確認
    if (this.loadedModules.has(cacheKey)) {
      return this.loadedModules.get(cacheKey);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load dictionary: ${response.status}`);
      }

      const data = await response.arrayBuffer();
      this.loadedModules.set(cacheKey, data);
      
      console.log(`✅ Dictionary loaded: ${dictType} (${(data.byteLength / 1024).toFixed(1)}KB)`);
      return data;
    } catch (error) {
      console.error(`❌ Dictionary load failed: ${dictType}`, error);
      throw error;
    }
  }

  /**
   * プリロード実装
   * @param {Array<string>} components - プリロード対象コンポーネント
   */
  async preloadComponents(components) {
    const preloadPromises = components.map(componentName => 
      this.loadComponent(componentName, { preload: true })
        .catch(error => {
          console.warn(`Preload failed for ${componentName}:`, error);
          return null;
        })
    );

    await Promise.allSettled(preloadPromises);
    console.log(`📦 Preloaded ${components.length} components`);
  }

  /**
   * メモリ使用量最適化
   */
  cleanup() {
    // 使用頻度の低いモジュールをアンロード
    const threshold = Date.now() - (30 * 60 * 1000); // 30分
    
    for (const [key, module] of this.loadedModules.entries()) {
      if (module.lastAccessed && module.lastAccessed < threshold) {
        this.loadedModules.delete(key);
        console.log(`🗑️ Unloaded module: ${key}`);
      }
    }
  }

  // Private methods
  async _loadWithRetry(componentName, timeout, retryOnError) {
    const retryCount = this.errorRetryCount.get(componentName) || 0;

    try {
      return await this._loadModule(componentName, timeout);
    } catch (error) {
      if (retryOnError && retryCount < this.maxRetries) {
        this.errorRetryCount.set(componentName, retryCount + 1);
        console.warn(`Retrying load for ${componentName} (${retryCount + 1}/${this.maxRetries})`);
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        
        return this._loadWithRetry(componentName, timeout, retryOnError);
      }
      throw error;
    }
  }

  async _loadModule(componentName, timeout) {
    const moduleMap = {
      // Analysis components
      'TripleOSAnalyzer': () => import('./os-analyzer/core/TripleOSAnalyzer.js'),
      'Calculator': () => import('./os-analyzer/core/Calculator.js'),
      'Engine': () => import('./os-analyzer/core/Engine.js'),
      
      // UI components
      'VirtualQuestionFlow': () => import('./os-analyzer/components/VirtualQuestionFlow.js'),
      'ResultsView': () => import('./os-analyzer/components/ResultsView.js'),
      'WelcomeScreen': () => import('./os-analyzer/components/WelcomeScreen.js'),
      
      // Future Simulator
      'FutureSimulatorCore': () => import('./future-simulator-core.js'),
      'FutureSimulatorUI': () => import('./future-simulator-ui-enhancements.js'),
      
      // Security
      'CSRFProtection': () => import('./security/CSRFProtectionSystem.js'),
      'SecurityHeaders': () => import('./security/SecurityHeaderManager.js'),
      
      // Error handling
      'ErrorHandler': () => import('./error-handler.js')
    };

    const moduleLoader = moduleMap[componentName];
    if (!moduleLoader) {
      throw new Error(`Unknown component: ${componentName}`);
    }

    // Timeout処理
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Load timeout: ${componentName}`)), timeout);
    });

    try {
      const module = await Promise.race([moduleLoader(), timeoutPromise]);
      
      // アクセス時刻記録
      if (module.default) {
        module.default.lastAccessed = Date.now();
      }
      
      console.log(`✅ Module loaded: ${componentName}`);
      return module;
    } catch (error) {
      console.error(`❌ Module load failed: ${componentName}`, error);
      throw error;
    }
  }

  async _loadAnalysisComponents() {
    const [analyzer, calculator, engine] = await Promise.all([
      this.loadComponent('TripleOSAnalyzer'),
      this.loadComponent('Calculator'),
      this.loadComponent('Engine')
    ]);

    return { analyzer, calculator, engine };
  }

  async _loadFutureSimulatorComponents() {
    const [core, ui] = await Promise.all([
      this.loadComponent('FutureSimulatorCore'),
      this.loadComponent('FutureSimulatorUI')
    ]);

    return { core, ui };
  }

  async _loadResultsComponents() {
    const [resultsView] = await Promise.all([
      this.loadComponent('ResultsView')
    ]);

    return { resultsView };
  }

  async _loadCockpitComponents() {
    // Cockpit用のコンポーネントをロード
    return {};
  }
}

// グローバルインスタンス
window.dynamicLoader = new window.dynamicLoader || new DynamicLoader();

// 自動クリーンアップ
setInterval(() => {
  window.dynamicLoader.cleanup();
}, 30 * 60 * 1000); // 30分ごと

export default DynamicLoader;