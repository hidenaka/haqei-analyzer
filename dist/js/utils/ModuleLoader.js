/**
 * ModuleLoader.js - Dynamic Module Loading System
 * 
 * High-performance dynamic import management system for HAQEI analyzer
 * Implements aggressive code splitting and lazy loading for optimal bundle size
 * 
 * Features:
 * - Dynamic import with caching
 * - Bundle management and dependency resolution
 * - Predictive preloading
 * - Memory optimization
 * - Error handling and fallbacks
 * 
 * Target: Reduce JavaScript bundle from 4.76MB to 3MB
 */

class ModuleLoader {
  constructor(options = {}) {
    this.options = {
      enableCaching: true,
      enablePreloading: true,
      enableAnalytics: true,
      maxCacheSize: 50,
      preloadDelay: 1000,
      retryAttempts: 3,
      ...options
    };
    
    // Module cache management
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
    this.moduleMetadata = new Map();
    
    // Preloading and optimization
    this.preloadQueue = [];
    this.loadingHistory = [];
    this.predictiveCache = new Map();
    
    // Performance tracking
    this.stats = {
      totalLoads: 0,
      cacheHits: 0,
      loadErrors: 0,
      totalLoadTime: 0,
      bundlesSaved: 0
    };
    
    // Module bundles configuration
    this.bundles = this.initializeBundles();
    
    console.log('🚀 ModuleLoader initialized - Dynamic import system ready');
  }
  
  /**
   * Initialize bundle configurations for optimal loading
   */
  initializeBundles() {
    return {
      core: {
        name: 'Core Bundle',
        priority: 1,
        modules: [
          '/js/shared/core/BaseComponent.js',
          '/js/shared/core/MicroStorageManager.js',
          '/js/shared/core/MicroDataManager.js',
          '/js/shared/utils/SecurityValidator.js'
        ],
        preload: true,
        estimatedSize: '800KB'
      },
      
      questions: {
        name: 'Question Flow Bundle',
        priority: 2,
        modules: [
          '/js/os-analyzer/components/VirtualQuestionFlow-core.js',
          '/js/os-analyzer/components/VirtualQuestionFlow-renderer.js',
          '/js/os-analyzer/components/VirtualQuestionFlow-navigator.js',
          '/js/shared/data/questions.js',
          '/js/os-analyzer/core/PrecompiledQuestions.js'
        ],
        preload: false,
        estimatedSize: '600KB'
      },
      
      analysis: {
        name: 'Analysis Engine Bundle',
        priority: 3,
        modules: [
          '/js/os-analyzer/core/TripleOSEngine.js',
          '/js/os-analyzer/core/UltraAnalysisEngine.js',
          '/js/os-analyzer/core/IChingUltraSyncLogic.js',
          '/js/core/H384_DATABASE.js',
          '/js/os-analyzer/core/StatisticalEngine.js',
          '/js/shared/core/DataManager.js'
        ],
        preload: false,
        estimatedSize: '1200KB'
      },
      
      results: {
        name: 'Results Display Bundle',
        priority: 4,
        modules: [
          '/js/components/TripleOSResultsView.js',
          '/js/os-analyzer/components/ResultsView.js',
          '/js/lib/chart.min.js',
          '/js/lib/chartjs-plugin-annotation.min.js',
          '/js/data/hexagram_details.js'
        ],
        preload: false,
        estimatedSize: '800KB'
      },
      
      optional: {
        name: 'Optional Features Bundle',
        priority: 5,
        modules: [
          '/js/help-system/core/HelpSystemCore.js',
          '/js/help-system/ui/HelpSystemUI.js',
          '/js/shared/utils/AccessibilityManager.js',
          '/js/utils/HexagramSVGGenerator.js'
        ],
        preload: false,
        estimatedSize: '400KB'
      }
    };
  }
  
  /**
   * Load a single module with caching and error handling
   */
  async loadModule(modulePath, options = {}) {
    const startTime = performance.now();
    
    try {
      // Check cache first
      if (this.options.enableCaching && this.loadedModules.has(modulePath)) {
        this.stats.cacheHits++;
        console.log(`📦 Module loaded from cache: ${modulePath}`);
        return this.loadedModules.get(modulePath);
      }
      
      // Check if already loading
      if (this.loadingPromises.has(modulePath)) {
        return await this.loadingPromises.get(modulePath);
      }
      
      // Start loading with retry logic
      const loadPromise = this.loadModuleWithRetry(modulePath, options);
      this.loadingPromises.set(modulePath, loadPromise);
      
      const module = await loadPromise;
      
      // Cache the loaded module
      if (this.options.enableCaching) {
        this.loadedModules.set(modulePath, module);
        this.pruneCache();
      }
      
      // Update statistics
      const loadTime = performance.now() - startTime;
      this.updateLoadStats(modulePath, loadTime, true);
      
      console.log(`✅ Module loaded: ${modulePath} (${loadTime.toFixed(0)}ms)`);
      return module;
      
    } catch (error) {
      this.stats.loadErrors++;
      console.error(`❌ Failed to load module: ${modulePath}`, error);
      
      // Try fallback if available
      const fallback = options.fallback;
      if (fallback && typeof fallback === 'function') {
        console.log(`🔄 Using fallback for: ${modulePath}`);
        return fallback();
      }
      
      throw error;
    } finally {
      this.loadingPromises.delete(modulePath);
    }
  }
  
  /**
   * Load module with retry logic
   */
  async loadModuleWithRetry(modulePath, options) {
    let lastError;
    const maxRetries = options.retries || this.options.retryAttempts;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add cache busting for retries
        const cacheBuster = attempt > 1 ? `?retry=${attempt}&t=${Date.now()}` : '';
        const fullPath = modulePath + cacheBuster;
        
        const module = await import(fullPath);
        
        if (attempt > 1) {
          console.log(`🔄 Module loaded after ${attempt} attempts: ${modulePath}`);
        }
        
        return module;
        
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.warn(`⚠️ Module load attempt ${attempt} failed, retrying in ${delay}ms: ${modulePath}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Load a complete bundle of modules
   */
  async loadBundle(bundleName, options = {}) {
    const bundle = this.bundles[bundleName];
    if (!bundle) {
      throw new Error(`Bundle not found: ${bundleName}`);
    }
    
    const startTime = performance.now();
    console.log(`📦 Loading bundle: ${bundle.name} (${bundle.estimatedSize})`);
    
    try {
      // Load modules in parallel with dependency resolution
      const modulePromises = bundle.modules.map(modulePath => 
        this.loadModule(modulePath, options)
      );
      
      const modules = await Promise.all(modulePromises);
      
      const loadTime = performance.now() - startTime;
      console.log(`✅ Bundle loaded: ${bundle.name} (${loadTime.toFixed(0)}ms)`);
      
      // Update bundle statistics
      this.stats.bundlesSaved += this.estimateBundleSavings(bundle);
      
      return modules;
      
    } catch (error) {
      console.error(`❌ Bundle load failed: ${bundle.name}`, error);
      throw error;
    }
  }
  
  /**
   * Preload modules based on predicted usage
   */
  async preloadModule(modulePath, priority = 'normal') {
    if (!this.options.enablePreloading) return;
    
    // Add to preload queue
    this.preloadQueue.push({
      modulePath,
      priority,
      timestamp: Date.now()
    });
    
    // Process queue after delay
    setTimeout(() => this.processPreloadQueue(), this.options.preloadDelay);
  }
  
  /**
   * Process preload queue with priority handling
   */
  async processPreloadQueue() {
    if (this.preloadQueue.length === 0) return;
    
    // Sort by priority and timestamp
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority] || a.timestamp - b.timestamp;
    });
    
    // Process high priority items first
    const toProcess = this.preloadQueue.splice(0, 3); // Limit concurrent preloads
    
    for (const item of toProcess) {
      try {
        await this.loadModule(item.modulePath, { isPreload: true });
        console.log(`🔄 Preloaded: ${item.modulePath}`);
      } catch (error) {
        console.warn(`⚠️ Preload failed: ${item.modulePath}`, error);
      }
    }
  }
  
  /**
   * Predictive module loading based on user behavior
   */
  predictNextModules(currentContext) {
    const predictions = [];
    
    // Analyze loading history for patterns
    const recentLoads = this.loadingHistory.slice(-10);
    
    // Common loading patterns
    const patterns = {
      'welcome-screen': ['questions'],
      'questions': ['analysis'],
      'analysis': ['results'],
      'results': ['optional']
    };
    
    if (patterns[currentContext]) {
      predictions.push(...patterns[currentContext]);
    }
    
    // Preload predicted modules
    predictions.forEach(bundleName => {
      if (this.bundles[bundleName]) {
        this.bundles[bundleName].modules.forEach(modulePath => {
          this.preloadModule(modulePath, 'high');
        });
      }
    });
    
    return predictions;
  }
  
  /**
   * Cache management and pruning
   */
  pruneCache() {
    if (this.loadedModules.size <= this.options.maxCacheSize) return;
    
    // Remove oldest cached modules
    const entries = Array.from(this.loadedModules.entries());
    const toRemove = entries.slice(0, entries.length - this.options.maxCacheSize);
    
    toRemove.forEach(([modulePath]) => {
      this.loadedModules.delete(modulePath);
      console.log(`🗑️ Pruned from cache: ${modulePath}`);
    });
  }
  
  /**
   * Memory cleanup for unused modules
   */
  cleanupUnusedModules() {
    const unusedThreshold = 300000; // 5 minutes
    const now = Date.now();
    
    for (const [modulePath, metadata] of this.moduleMetadata.entries()) {
      if (now - metadata.lastAccessed > unusedThreshold) {
        this.loadedModules.delete(modulePath);
        this.moduleMetadata.delete(modulePath);
        console.log(`🧹 Cleaned up unused module: ${modulePath}`);
      }
    }
  }
  
  /**
   * Update loading statistics
   */
  updateLoadStats(modulePath, loadTime, success) {
    this.stats.totalLoads++;
    if (success) {
      this.stats.totalLoadTime += loadTime;
      this.loadingHistory.push({
        modulePath,
        loadTime,
        timestamp: Date.now()
      });
      
      // Keep history bounded
      if (this.loadingHistory.length > 100) {
        this.loadingHistory = this.loadingHistory.slice(-50);
      }
    }
  }
  
  /**
   * Estimate bundle savings from code splitting
   */
  estimateBundleSavings(bundle) {
    // Estimate based on bundle size and loading patterns
    const sizeKB = parseInt(bundle.estimatedSize) || 0;
    return sizeKB * 1024; // Convert to bytes
  }
  
  /**
   * Get performance statistics
   */
  getStats() {
    const avgLoadTime = this.stats.totalLoads > 0 
      ? this.stats.totalLoadTime / this.stats.totalLoads 
      : 0;
    
    return {
      ...this.stats,
      averageLoadTime: avgLoadTime,
      cacheHitRatio: this.stats.totalLoads > 0 
        ? (this.stats.cacheHits / this.stats.totalLoads * 100).toFixed(1) + '%'
        : '0%',
      modulesInCache: this.loadedModules.size,
      estimatedSavings: this.formatBytes(this.stats.bundlesSaved)
    };
  }
  
  /**
   * Format bytes for display
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Debug and monitoring functions
   */
  debugLoadedModules() {
    console.log('📊 ModuleLoader Debug Info:');
    console.log('Loaded modules:', Array.from(this.loadedModules.keys()));
    console.log('Statistics:', this.getStats());
    console.log('Bundle configuration:', this.bundles);
  }
  
  /**
   * Export configuration for external optimization tools
   */
  exportConfiguration() {
    return {
      bundles: this.bundles,
      options: this.options,
      stats: this.getStats(),
      loadingHistory: this.loadingHistory.slice(-20)
    };
  }
}

// Global instance
window.ModuleLoader = ModuleLoader;

// Auto-initialize if not already done
if (!window.moduleLoader) {
  window.moduleLoader = new ModuleLoader({
    enableAnalytics: true,
    enablePreloading: true,
    maxCacheSize: 30
  });
  
  console.log('🎯 Global ModuleLoader initialized for HAQEI optimizer');
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModuleLoader;
}