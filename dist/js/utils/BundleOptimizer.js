/**
 * BundleOptimizer.js - JavaScript Bundle Size Optimization Utility
 * 
 * Phase 2 Implementation: Advanced code splitting and bundle analysis
 * Provides runtime bundle size monitoring and optimization recommendations
 * 
 * Key Features:
 * - Real-time bundle size monitoring
 * - Dead code detection
 * - Duplicate code analysis
 * - Memory usage optimization
 * - Loading performance tracking
 */

class BundleOptimizer {
  constructor(options = {}) {
    this.options = {
      enableMonitoring: true,
      enableAnalysis: true,
      enableReporting: true,
      analysisInterval: 30000, // 30 seconds
      maxBundleSize: 3 * 1024 * 1024, // 3MB target
      warningThreshold: 2.5 * 1024 * 1024, // 2.5MB warning
      ...options
    };
    
    // Bundle tracking
    this.bundleMetrics = {
      totalSize: 0,
      loadedModules: new Map(),
      loadTimes: new Map(),
      memoryUsage: new Map(),
      duplicateDetection: new Map()
    };
    
    // Performance monitoring
    this.performanceObserver = null;
    this.memoryObserver = null;
    
    // Analysis results
    this.analysisResults = {
      bundleSize: 0,
      optimization: {
        duplicates: [],
        unused: [],
        heavyModules: [],
        suggestions: []
      },
      performance: {
        loadTimes: {},
        memoryImpact: {},
        cacheEfficiency: 0
      }
    };
    
    console.log('🔧 BundleOptimizer initialized - Phase 2 monitoring active');
    
    if (this.options.enableMonitoring) {
      this.startMonitoring();
    }
  }
  
  /**
   * Start bundle monitoring and analysis
   */
  startMonitoring() {
    if (!this.options.enableMonitoring) return;
    
    console.log('📊 Starting bundle optimization monitoring...');
    
    // Monitor script loading
    this.monitorScriptLoading();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Periodic analysis
    setInterval(() => {
      this.performAnalysis();
    }, this.options.analysisInterval);
    
    // Monitor Performance API
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObserver();
    }
  }
  
  /**
   * Monitor script loading and track bundle size
   */
  monitorScriptLoading() {
    // Override dynamic import to track module loading
    const originalImport = window.import || (async (path) => import(path));
    
    window.import = async (modulePath) => {
      const startTime = performance.now();
      
      try {
        const module = await originalImport(modulePath);
        const loadTime = performance.now() - startTime;
        
        // Track module loading
        this.trackModuleLoad(modulePath, loadTime, module);
        
        return module;
      } catch (error) {
        this.trackLoadError(modulePath, error);
        throw error;
      }
    };
    
    // Monitor static script tags
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      this.estimateScriptSize(script.src);
    });
  }
  
  /**
   * Track individual module loading
   */
  trackModuleLoad(modulePath, loadTime, module) {
    // Estimate module size
    const estimatedSize = this.estimateModuleSize(module);
    
    this.bundleMetrics.loadedModules.set(modulePath, {
      loadTime,
      estimatedSize,
      timestamp: Date.now(),
      module
    });
    
    this.bundleMetrics.loadTimes.set(modulePath, loadTime);
    this.bundleMetrics.totalSize += estimatedSize;
    
    // Check bundle size warning
    if (this.bundleMetrics.totalSize > this.options.warningThreshold) {
      console.warn(`⚠️ Bundle size approaching limit: ${this.formatBytes(this.bundleMetrics.totalSize)}`);
    }
    
    console.log(`📦 Module tracked: ${modulePath} (${this.formatBytes(estimatedSize)}, ${loadTime.toFixed(0)}ms)`);
  }
  
  /**
   * Estimate module size from content
   */
  estimateModuleSize(module) {
    try {
      // Estimate based on module content
      const moduleString = JSON.stringify(module);
      return new Blob([moduleString]).size;
    } catch (error) {
      // Fallback estimation
      return 10240; // 10KB default estimate
    }
  }
  
  /**
   * Estimate script size from URL
   */
  async estimateScriptSize(scriptUrl) {
    try {
      const response = await fetch(scriptUrl, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      
      if (contentLength) {
        const size = parseInt(contentLength);
        this.bundleMetrics.totalSize += size;
        console.log(`📜 Script size estimated: ${scriptUrl} (${this.formatBytes(size)})`);\n        return size;
      }
    } catch (error) {\n      console.warn(`⚠️ Could not estimate size for: ${scriptUrl}`);\n    }\n    \n    return 0;\n  }\n  \n  /**\n   * Monitor memory usage impact\n   */\n  monitorMemoryUsage() {\n    if (!('memory' in performance)) {\n      console.warn('⚠️ Memory monitoring not available in this browser');\n      return;\n    }\n    \n    const trackMemory = () => {\n      const memory = performance.memory;\n      \n      this.bundleMetrics.memoryUsage.set(Date.now(), {\n        used: memory.usedJSHeapSize,\n        total: memory.totalJSHeapSize,\n        limit: memory.jsHeapSizeLimit\n      });\n      \n      // Keep only last 100 entries\n      if (this.bundleMetrics.memoryUsage.size > 100) {\n        const entries = Array.from(this.bundleMetrics.memoryUsage.entries());\n        const toKeep = entries.slice(-50);\n        this.bundleMetrics.memoryUsage.clear();\n        toKeep.forEach(([time, data]) => {\n          this.bundleMetrics.memoryUsage.set(time, data);\n        });\n      }\n    };\n    \n    // Track memory every 5 seconds\n    setInterval(trackMemory, 5000);\n    trackMemory(); // Initial measurement\n  }\n  \n  /**\n   * Setup Performance Observer for detailed metrics\n   */\n  setupPerformanceObserver() {\n    try {\n      this.performanceObserver = new PerformanceObserver((list) => {\n        const entries = list.getEntries();\n        \n        entries.forEach(entry => {\n          if (entry.entryType === 'resource' && entry.name.includes('.js')) {\n            this.trackResourcePerformance(entry);\n          }\n        });\n      });\n      \n      this.performanceObserver.observe({ entryTypes: ['resource', 'navigation'] });\n      console.log('📊 PerformanceObserver setup complete');\n      \n    } catch (error) {\n      console.warn('⚠️ PerformanceObserver setup failed:', error);\n    }\n  }\n  \n  /**\n   * Track resource performance metrics\n   */\n  trackResourcePerformance(entry) {\n    const metrics = {\n      url: entry.name,\n      duration: entry.duration,\n      transferSize: entry.transferSize || 0,\n      encodedBodySize: entry.encodedBodySize || 0,\n      decodedBodySize: entry.decodedBodySize || 0,\n      startTime: entry.startTime,\n      responseEnd: entry.responseEnd\n    };\n    \n    this.analysisResults.performance.loadTimes[entry.name] = metrics;\n    \n    // Update total bundle size with actual transfer size\n    if (metrics.transferSize > 0) {\n      this.bundleMetrics.totalSize += metrics.transferSize;\n    }\n  }\n  \n  /**\n   * Perform comprehensive bundle analysis\n   */\n  performAnalysis() {\n    console.log('🔍 Performing bundle optimization analysis...');\n    \n    const analysis = {\n      timestamp: Date.now(),\n      bundleSize: this.bundleMetrics.totalSize,\n      moduleCount: this.bundleMetrics.loadedModules.size,\n      optimization: this.analyzeOptimizations(),\n      performance: this.analyzePerformance(),\n      recommendations: []\n    };\n    \n    // Generate recommendations\n    analysis.recommendations = this.generateRecommendations(analysis);\n    \n    this.analysisResults = analysis;\n    \n    if (this.options.enableReporting) {\n      this.generateReport(analysis);\n    }\n    \n    return analysis;\n  }\n  \n  /**\n   * Analyze potential optimizations\n   */\n  analyzeOptimizations() {\n    const duplicates = this.findDuplicateCode();\n    const unused = this.findUnusedModules();\n    const heavyModules = this.findHeavyModules();\n    \n    return {\n      duplicates,\n      unused,\n      heavyModules,\n      totalWaste: duplicates.totalSize + unused.totalSize\n    };\n  }\n  \n  /**\n   * Find duplicate code across modules\n   */\n  findDuplicateCode() {\n    const duplicates = [];\n    let totalSize = 0;\n    \n    // This is a simplified duplicate detection\n    // In a real implementation, you'd use AST analysis\n    const modules = Array.from(this.bundleMetrics.loadedModules.entries());\n    \n    for (let i = 0; i < modules.length; i++) {\n      for (let j = i + 1; j < modules.length; j++) {\n        const [path1, data1] = modules[i];\n        const [path2, data2] = modules[j];\n        \n        // Simple heuristic: similar file sizes might indicate duplicates\n        if (Math.abs(data1.estimatedSize - data2.estimatedSize) < 1024 && \n            data1.estimatedSize > 5120) { // Only check files > 5KB\n          duplicates.push({\n            modules: [path1, path2],\n            estimatedDuplication: Math.min(data1.estimatedSize, data2.estimatedSize) * 0.3,\n            confidence: 'low'\n          });\n          \n          totalSize += Math.min(data1.estimatedSize, data2.estimatedSize) * 0.3;\n        }\n      }\n    }\n    \n    return { duplicates, totalSize };\n  }\n  \n  /**\n   * Find potentially unused modules\n   */\n  findUnusedModules() {\n    const unused = [];\n    let totalSize = 0;\n    const currentTime = Date.now();\n    const unusedThreshold = 300000; // 5 minutes\n    \n    this.bundleMetrics.loadedModules.forEach((data, path) => {\n      if (currentTime - data.timestamp > unusedThreshold) {\n        // Check if module has been accessed recently\n        // This is a simplified check - real implementation would track usage\n        unused.push({\n          path,\n          size: data.estimatedSize,\n          lastAccessed: data.timestamp,\n          reason: 'Not accessed in 5+ minutes'\n        });\n        \n        totalSize += data.estimatedSize;\n      }\n    });\n    \n    return { unused, totalSize };\n  }\n  \n  /**\n   * Find heavy modules that impact performance\n   */\n  findHeavyModules() {\n    const heavyThreshold = 100 * 1024; // 100KB\n    const heavy = [];\n    \n    this.bundleMetrics.loadedModules.forEach((data, path) => {\n      if (data.estimatedSize > heavyThreshold) {\n        heavy.push({\n          path,\n          size: data.estimatedSize,\n          loadTime: data.loadTime,\n          impactScore: (data.estimatedSize / 1024) + (data.loadTime / 10)\n        });\n      }\n    });\n    \n    // Sort by impact score\n    heavy.sort((a, b) => b.impactScore - a.impactScore);\n    \n    return heavy;\n  }\n  \n  /**\n   * Analyze performance metrics\n   */\n  analyzePerformance() {\n    const loadTimes = Array.from(this.bundleMetrics.loadTimes.values());\n    const memoryEntries = Array.from(this.bundleMetrics.memoryUsage.values());\n    \n    return {\n      averageLoadTime: loadTimes.length > 0 ? \n        loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,\n      slowestLoad: loadTimes.length > 0 ? Math.max(...loadTimes) : 0,\n      fastestLoad: loadTimes.length > 0 ? Math.min(...loadTimes) : 0,\n      currentMemoryUsage: memoryEntries.length > 0 ? \n        memoryEntries[memoryEntries.length - 1].used : 0,\n      memoryGrowthRate: this.calculateMemoryGrowthRate(memoryEntries)\n    };\n  }\n  \n  /**\n   * Calculate memory growth rate\n   */\n  calculateMemoryGrowthRate(entries) {\n    if (entries.length < 2) return 0;\n    \n    const first = entries[0];\n    const last = entries[entries.length - 1];\n    const timeDiff = (entries.length - 1) * 5000; // 5 second intervals\n    \n    return ((last.used - first.used) / timeDiff) * 1000; // bytes per second\n  }\n  \n  /**\n   * Generate optimization recommendations\n   */\n  generateRecommendations(analysis) {\n    const recommendations = [];\n    \n    // Bundle size recommendations\n    if (analysis.bundleSize > this.options.maxBundleSize) {\n      recommendations.push({\n        type: 'size',\n        priority: 'high',\n        message: `Bundle size (${this.formatBytes(analysis.bundleSize)}) exceeds target (${this.formatBytes(this.options.maxBundleSize)})`,\n        suggestion: 'Consider additional code splitting or removing unused modules'\n      });\n    }\n    \n    // Heavy modules recommendations\n    if (analysis.optimization.heavyModules.length > 0) {\n      const heaviest = analysis.optimization.heavyModules[0];\n      recommendations.push({\n        type: 'performance',\n        priority: 'medium',\n        message: `Heavy module detected: ${heaviest.path} (${this.formatBytes(heaviest.size)})`,\n        suggestion: 'Consider lazy loading or splitting this module'\n      });\n    }\n    \n    // Duplicate code recommendations\n    if (analysis.optimization.duplicates.totalSize > 50 * 1024) {\n      recommendations.push({\n        type: 'optimization',\n        priority: 'medium',\n        message: `Potential duplicate code: ${this.formatBytes(analysis.optimization.duplicates.totalSize)} wasted`,\n        suggestion: 'Review modules for shared utilities that can be extracted'\n      });\n    }\n    \n    // Memory usage recommendations\n    if (analysis.performance.memoryGrowthRate > 1024) { // 1KB/sec growth\n      recommendations.push({\n        type: 'memory',\n        priority: 'high',\n        message: `High memory growth rate: ${this.formatBytes(analysis.performance.memoryGrowthRate)}/sec`,\n        suggestion: 'Check for memory leaks and implement cleanup'\n      });\n    }\n    \n    return recommendations;\n  }\n  \n  /**\n   * Generate comprehensive report\n   */\n  generateReport(analysis) {\n    console.log('📊 Bundle Optimization Report - Phase 2');\n    console.log('='.repeat(50));\n    console.log(`📦 Total Bundle Size: ${this.formatBytes(analysis.bundleSize)}`);\n    console.log(`📄 Loaded Modules: ${analysis.moduleCount}`);\n    console.log(`⚡ Average Load Time: ${analysis.performance.averageLoadTime.toFixed(0)}ms`);\n    console.log(`🧠 Memory Usage: ${this.formatBytes(analysis.performance.currentMemoryUsage)}`);\n    \n    if (analysis.optimization.totalWaste > 0) {\n      console.log(`♻️ Potential Savings: ${this.formatBytes(analysis.optimization.totalWaste)}`);\n    }\n    \n    if (analysis.recommendations.length > 0) {\n      console.log('\\n🎯 Recommendations:');\n      analysis.recommendations.forEach((rec, index) => {\n        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);\n        console.log(`   💡 ${rec.suggestion}`);\n      });\n    }\n    \n    console.log('='.repeat(50));\n    \n    // Store report for external access\n    window.bundleOptimizationReport = analysis;\n  }\n  \n  /**\n   * Get current optimization status\n   */\n  getOptimizationStatus() {\n    const currentSize = this.bundleMetrics.totalSize;\n    const targetSize = this.options.maxBundleSize;\n    const savings = Math.max(0, currentSize - targetSize);\n    \n    return {\n      currentSize: this.formatBytes(currentSize),\n      targetSize: this.formatBytes(targetSize),\n      isOptimized: currentSize <= targetSize,\n      potentialSavings: this.formatBytes(savings),\n      optimizationPercentage: targetSize > 0 ? \n        Math.max(0, ((targetSize - currentSize) / targetSize * 100)).toFixed(1) + '%' : '0%'\n    };\n  }\n  \n  /**\n   * Format bytes for display\n   */\n  formatBytes(bytes) {\n    if (bytes === 0) return '0 B';\n    const k = 1024;\n    const sizes = ['B', 'KB', 'MB', 'GB'];\n    const i = Math.floor(Math.log(bytes) / Math.log(k));\n    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];\n  }\n  \n  /**\n   * Export optimization data\n   */\n  exportData() {\n    return {\n      metrics: {\n        totalSize: this.bundleMetrics.totalSize,\n        moduleCount: this.bundleMetrics.loadedModules.size,\n        loadedModules: Array.from(this.bundleMetrics.loadedModules.entries())\n      },\n      analysis: this.analysisResults,\n      status: this.getOptimizationStatus(),\n      timestamp: Date.now()\n    };\n  }\n}\n\n// Global initialization\nif (!window.bundleOptimizer) {\n  window.bundleOptimizer = new BundleOptimizer({\n    enableMonitoring: true,\n    enableAnalysis: true,\n    enableReporting: true\n  });\n  \n  console.log('🎯 BundleOptimizer initialized for Phase 2 monitoring');\n  \n  // Debug functions\n  window.getBundleReport = () => window.bundleOptimizer.performAnalysis();\n  window.getBundleStatus = () => window.bundleOptimizer.getOptimizationStatus();\n  window.exportBundleData = () => window.bundleOptimizer.exportData();\n}\n\n// Export for ES6 modules\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = BundleOptimizer;\n}\n