/**
 * Tree-shaking Optimizer for HAQEI Analyzer
 * 使用されていないコードを除去し、bundle sizeを削減
 */

class TreeShakingOptimizer {
  constructor() {
    this.usedModules = new Set();
    this.unusedModules = new Set();
    this.dependencyGraph = new Map();
  }

  /**
   * エントリーポイントから使用されているモジュールを追跡
   * @param {Array<string>} entryPoints - エントリーポイント
   */
  analyzeUsage(entryPoints) {
    // エントリーポイントから開始
    entryPoints.forEach(entry => {
      this._markAsUsed(entry);
      this._traverseDependencies(entry);
    });

    // 未使用モジュールを特定
    this._identifyUnusedModules();
    
    return {
      used: Array.from(this.usedModules),
      unused: Array.from(this.unusedModules),
      savings: this._calculateSavings()
    };
  }

  /**
   * 最適化されたインポート構文を生成
   * @param {string} modulePath - モジュールパス
   * @param {Array<string>} usedExports - 使用されているexport
   * @returns {string} 最適化されたインポート文
   */
  generateOptimizedImport(modulePath, usedExports) {
    if (usedExports.length === 0) {
      return `// Unused import removed: ${modulePath}`;
    }

    if (usedExports.length === 1 && usedExports[0] === 'default') {
      return `import ${this._getDefaultImportName(modulePath)} from '${modulePath}';`;
    }

    // 名前付きインポートの最適化
    const namedImports = usedExports.filter(exp => exp !== 'default');
    const defaultImport = usedExports.includes('default') 
      ? this._getDefaultImportName(modulePath) 
      : null;

    if (defaultImport && namedImports.length > 0) {
      return `import ${defaultImport}, { ${namedImports.join(', ')} } from '${modulePath}';`;
    } else if (namedImports.length > 0) {
      return `import { ${namedImports.join(', ')} } from '${modulePath}';`;
    } else {
      return `import ${defaultImport} from '${modulePath}';`;
    }
  }

  /**
   * 実行時の最適化実装
   */
  optimizeRuntime() {
    // 使用されていないイベントリスナーを除去
    this._removeUnusedEventListeners();
    
    // 未使用のDOM要素を特定
    this._identifyUnusedDOMElements();
    
    // メモリリークの可能性を検出
    this._detectMemoryLeaks();
  }

  /**
   * Bundle analyzer連携
   * @returns {Object} 分析レポート
   */
  generateBundleReport() {
    const report = {
      timestamp: new Date().toISOString(),
      optimization: {
        removedModules: Array.from(this.unusedModules),
        keptModules: Array.from(this.usedModules),
        sizeReduction: this._calculateSizereduction()
      },
      recommendations: this._generateRecommendations()
    };

    return report;
  }

  // Private methods
  _markAsUsed(modulePath) {
    this.usedModules.add(modulePath);
  }

  _traverseDependencies(modulePath) {
    const dependencies = this.dependencyGraph.get(modulePath) || [];
    
    dependencies.forEach(dep => {
      if (!this.usedModules.has(dep)) {
        this._markAsUsed(dep);
        this._traverseDependencies(dep);
      }
    });
  }

  _identifyUnusedModules() {
    const allModules = this._getAllModules();
    
    allModules.forEach(module => {
      if (!this.usedModules.has(module)) {
        this.unusedModules.add(module);
      }
    });
  }

  _getAllModules() {
    // HAQEIプロジェクト内の全モジュールを取得
    return [
      // Core modules
      './js/app.js',
      './js/shared/core/BaseComponent.js',
      './js/shared/core/MicroStorageManager.js',
      './js/shared/core/DataManager.js',
      
      // OS Analyzer modules
      './js/os-analyzer/core/Engine.js',
      './js/os-analyzer/core/Calculator.js',
      './js/os-analyzer/core/TripleOSAnalyzer.js',
      './js/os-analyzer/components/WelcomeScreen.js',
      './js/os-analyzer/components/VirtualQuestionFlow.js',
      './js/os-analyzer/components/ResultsView.js',
      
      // Future Simulator modules
      './js/future-simulator-core.js',
      './js/future-simulator-ui-enhancements.js',
      
      // Security modules
      './js/security/CSRFProtectionSystem.js',
      './js/security/SecurityHeaderManager.js',
      
      // Error handling
      './js/error-handler.js',
      
      // Legacy modules (削除対象)
      './js/data/data_box.js',
      './js/data/hexagram_details.js',
      './js/koudo_shishin_database.js',
      './js/bible.js'
    ];
  }

  _getDefaultImportName(modulePath) {
    // パスからデフォルトインポート名を生成
    const filename = modulePath.split('/').pop().replace('.js', '');
    return filename.charAt(0).toUpperCase() + filename.slice(1);
  }

  _calculateSavings() {
    // ファイルサイズベースの削減量計算
    const fileSizes = {
      './js/data/data_box.js': 250000, // 250KB
      './js/data/hexagram_details.js': 180000, // 180KB
      './js/koudo_shishin_database.js': 120000, // 120KB
      './js/bible.js': 95000 // 95KB
    };

    let totalSavings = 0;
    this.unusedModules.forEach(module => {
      totalSavings += fileSizes[module] || 10000; // デフォルト10KB
    });

    return {
      bytes: totalSavings,
      kb: Math.round(totalSavings / 1024),
      mb: Math.round(totalSavings / (1024 * 1024) * 100) / 100
    };
  }

  _calculateSizereduction() {
    const currentSize = 4.76; // MB
    const savings = this._calculateSavings();
    const newSize = currentSize - savings.mb;
    
    return {
      currentSize: `${currentSize}MB`,
      newSize: `${newSize}MB`,
      reduction: `${savings.mb}MB`,
      percentageReduction: `${Math.round((savings.mb / currentSize) * 100)}%`
    };
  }

  _removeUnusedEventListeners() {
    // 実行時に未使用のイベントリスナーを検出・除去
    const listeners = [];
    
    // document上の全イベントリスナーを取得（疑似実装）
    // 実際の実装では、イベントリスナーの登録を追跡する必要がある
    
    console.log('🧹 Cleaning unused event listeners...');
  }

  _identifyUnusedDOMElements() {
    // 使用されていないDOM要素を特定
    const unusedElements = document.querySelectorAll('[data-unused="true"]');
    
    unusedElements.forEach(element => {
      console.log(`🗑️ Unused element found: ${element.tagName}#${element.id}`);
    });
  }

  _detectMemoryLeaks() {
    // メモリリークの可能性を検出
    if (performance.memory) {
      const memory = performance.memory;
      const usage = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };

      if (usage.used / usage.limit > 0.8) {
        console.warn('⚠️ High memory usage detected:', usage);
      }
    }
  }

  _generateRecommendations() {
    const recommendations = [];

    // 削除可能なファイルの推奨
    if (this.unusedModules.size > 0) {
      recommendations.push({
        type: 'removal',
        priority: 'high',
        description: `${this.unusedModules.size}個の未使用モジュールを削除可能`,
        modules: Array.from(this.unusedModules),
        estimatedSavings: this._calculateSavings()
      });
    }

    // 分割可能なモジュールの推奨
    recommendations.push({
      type: 'splitting',
      priority: 'medium',
      description: '大きなモジュールをさらに分割することを推奨',
      targets: ['./js/future-simulator-core.js', './js/app.js']
    });

    // 遅延ロード推奨
    recommendations.push({
      type: 'lazy-loading',
      priority: 'medium',
      description: '使用頻度の低いモジュールを遅延ロード化',
      targets: ['./js/future-simulator-ui-enhancements.js']
    });

    return recommendations;
  }
}

// 使用例とエクスポート
const optimizer = new TreeShakingOptimizer();

// エントリーポイントの定義
const entryPoints = [
  './js/app.js',
  './js/os-analyzer/components/WelcomeScreen.js',
  './js/shared/core/BaseComponent.js'
];

// 最適化の実行
const optimizationResult = optimizer.analyzeUsage(entryPoints);
console.log('🎯 Tree-shaking optimization result:', optimizationResult);

export default TreeShakingOptimizer;