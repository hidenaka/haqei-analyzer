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
        console.log(`📜 Script size estimated: ${scriptUrl} (${this.formatBytes(size)})`);
        return size;
      }
    } catch (error) {
      console.warn(`⚠️ Could not estimate size for: ${scriptUrl}`);
    }
    
    return 0;
  }
  
  /**
   * Monitor memory usage impact
   */
  monitorMemoryUsage() {
    if (!('memory' in performance)) {
      console.warn('⚠️ Memory monitoring not available in this browser');
      return;
    }
    
    const trackMemory = () => {
      const memory = performance.memory;
      
      this.bundleMetrics.memoryUsage.set(Date.now(), {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });
      
      // Keep only last 100 entries
      if (this.bundleMetrics.memoryUsage.size > 100) {
        const entries = Array.from(this.bundleMetrics.memoryUsage.entries());
        const toKeep = entries.slice(-50);
        this.bundleMetrics.memoryUsage.clear();
        toKeep.forEach(([time, data]) => {
          this.bundleMetrics.memoryUsage.set(time, data);
        });
      }
    };
    
    // Track memory every 5 seconds
    setInterval(trackMemory, 5000);
    trackMemory(); // Initial measurement
  }
  
  /**
   * Setup Performance Observer for detailed metrics
   */
  setupPerformanceObserver() {
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (entry.entryType === 'resource' && entry.name.includes('.js')) {
            this.trackResourcePerformance(entry);
          }
        });
      });
      
      this.performanceObserver.observe({ entryTypes: ['resource', 'navigation'] });
      console.log('📊 PerformanceObserver setup complete');
      
    } catch (error) {
      console.warn('⚠️ PerformanceObserver setup failed:', error);
    }
  }
  
  /**
   * Track resource performance metrics
   */
  trackResourcePerformance(entry) {
    const metrics = {
      url: entry.name,
      duration: entry.duration,
      transferSize: entry.transferSize || 0,
      encodedBodySize: entry.encodedBodySize || 0,
      decodedBodySize: entry.decodedBodySize || 0,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd
    };
    
    this.analysisResults.performance.loadTimes[entry.name] = metrics;
    
    // Update total bundle size with actual transfer size
    if (metrics.transferSize > 0) {
      this.bundleMetrics.totalSize += metrics.transferSize;
    }
  }
  
  /**
   * Perform comprehensive bundle analysis
   */
  performAnalysis() {
    console.log('🔍 Performing bundle optimization analysis...');
    
    const analysis = {
      timestamp: Date.now(),
      bundleSize: this.bundleMetrics.totalSize,
      moduleCount: this.bundleMetrics.loadedModules.size,
      optimization: this.analyzeOptimizations(),
      performance: this.analyzePerformance(),
      recommendations: []
    };
    
    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis);
    
    this.analysisResults = analysis;
    
    if (this.options.enableReporting) {
      this.generateReport(analysis);
    }
    
    return analysis;
  }
  
  /**
   * Analyze potential optimizations
   */
  analyzeOptimizations() {
    const duplicates = this.findDuplicateCode();
    const unused = this.findUnusedModules();
    const heavyModules = this.findHeavyModules();
    
    return {
      duplicates,
      unused,
      heavyModules,
      totalWaste: duplicates.totalSize + unused.totalSize
    };
  }
  
  /**
   * Find duplicate code across modules
   */
  findDuplicateCode() {
    const duplicates = [];
    let totalSize = 0;
    
    // This is a simplified duplicate detection
    // In a real implementation, you'd use AST analysis
    const modules = Array.from(this.bundleMetrics.loadedModules.entries());
    
    for (let i = 0; i < modules.length; i++) {
      for (let j = i + 1; j < modules.length; j++) {
        const [path1, data1] = modules[i];
        const [path2, data2] = modules[j];
        
        // Simple heuristic: similar file sizes might indicate duplicates
        if (Math.abs(data1.estimatedSize - data2.estimatedSize) < 1024 && 
            data1.estimatedSize > 5120) { // Only check files > 5KB
          duplicates.push({
            modules: [path1, path2],
            estimatedDuplication: Math.min(data1.estimatedSize, data2.estimatedSize) * 0.3,
            confidence: 'low'
          });
          
          totalSize += Math.min(data1.estimatedSize, data2.estimatedSize) * 0.3;
        }
      }
    }
    
    return { duplicates, totalSize };
  }
  
  /**
   * Find potentially unused modules
   */
  findUnusedModules() {
    const unused = [];
    let totalSize = 0;
    const currentTime = Date.now();
    const unusedThreshold = 300000; // 5 minutes
    
    this.bundleMetrics.loadedModules.forEach((data, path) => {
      if (currentTime - data.timestamp > unusedThreshold) {
        // Check if module has been accessed recently
        // This is a simplified check - real implementation would track usage
        unused.push({
          path,
          size: data.estimatedSize,
          lastAccessed: data.timestamp,
          reason: 'Not accessed in 5+ minutes'
        });
        
        totalSize += data.estimatedSize;
      }
    });
    
    return { unused, totalSize };
  }
  
  /**
   * Find heavy modules that impact performance
   */
  findHeavyModules() {
    const heavyThreshold = 100 * 1024; // 100KB
    const heavy = [];
    
    this.bundleMetrics.loadedModules.forEach((data, path) => {
      if (data.estimatedSize > heavyThreshold) {
        heavy.push({
          path,
          size: data.estimatedSize,
          loadTime: data.loadTime,
          impactScore: (data.estimatedSize / 1024) + (data.loadTime / 10)
        });
      }
    });
    
    // Sort by impact score
    heavy.sort((a, b) => b.impactScore - a.impactScore);
    
    return heavy;
  }
  
  /**
   * Analyze performance metrics
   */
  analyzePerformance() {
    const loadTimes = Array.from(this.bundleMetrics.loadTimes.values());
    const memoryEntries = Array.from(this.bundleMetrics.memoryUsage.values());
    
    return {
      averageLoadTime: loadTimes.length > 0 ? 
        loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,
      slowestLoad: loadTimes.length > 0 ? Math.max(...loadTimes) : 0,
      fastestLoad: loadTimes.length > 0 ? Math.min(...loadTimes) : 0,
      currentMemoryUsage: memoryEntries.length > 0 ? 
        memoryEntries[memoryEntries.length - 1].used : 0,
      memoryGrowthRate: this.calculateMemoryGrowthRate(memoryEntries)
    };
  }
  
  /**
   * Calculate memory growth rate
   */
  calculateMemoryGrowthRate(entries) {
    if (entries.length < 2) return 0;
    
    const first = entries[0];
    const last = entries[entries.length - 1];
    const timeDiff = (entries.length - 1) * 5000; // 5 second intervals
    
    return ((last.used - first.used) / timeDiff) * 1000; // bytes per second
  }
  
  /**
   * Generate optimization recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    
    // Bundle size recommendations
    if (analysis.bundleSize > this.options.maxBundleSize) {
      recommendations.push({
        type: 'size',
        priority: 'high',
        message: `Bundle size (${this.formatBytes(analysis.bundleSize)}) exceeds target (${this.formatBytes(this.options.maxBundleSize)})`,
        suggestion: 'Consider additional code splitting or removing unused modules'
      });
    }
    
    // Heavy modules recommendations
    if (analysis.optimization.heavyModules.length > 0) {
      const heaviest = analysis.optimization.heavyModules[0];
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `Heavy module detected: ${heaviest.path} (${this.formatBytes(heaviest.size)})`,
        suggestion: 'Consider lazy loading or splitting this module'
      });
    }
    
    // Duplicate code recommendations
    if (analysis.optimization.duplicates.totalSize > 50 * 1024) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        message: `Potential duplicate code: ${this.formatBytes(analysis.optimization.duplicates.totalSize)} wasted`,
        suggestion: 'Review modules for shared utilities that can be extracted'
      });
    }
    
    // Memory usage recommendations
    if (analysis.performance.memoryGrowthRate > 1024) { // 1KB/sec growth
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: `High memory growth rate: ${this.formatBytes(analysis.performance.memoryGrowthRate)}/sec`,
        suggestion: 'Check for memory leaks and implement cleanup'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Generate comprehensive report
   */
  generateReport(analysis) {
    console.log('📊 Bundle Optimization Report - Phase 2');
    console.log('='.repeat(50));
    console.log(`📦 Total Bundle Size: ${this.formatBytes(analysis.bundleSize)}`);
    console.log(`📄 Loaded Modules: ${analysis.moduleCount}`);
    console.log(`⚡ Average Load Time: ${analysis.performance.averageLoadTime.toFixed(0)}ms`);
    console.log(`🧠 Memory Usage: ${this.formatBytes(analysis.performance.currentMemoryUsage)}`);
    
    if (analysis.optimization.totalWaste > 0) {
      console.log(`♻️ Potential Savings: ${this.formatBytes(analysis.optimization.totalWaste)}`);
    }
    
    if (analysis.recommendations.length > 0) {
      console.log('\
🎯 Recommendations:');
      analysis.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
        console.log(`   💡 ${rec.suggestion}`);
      });
    }
    
    console.log('='.repeat(50));
    
    // Store report for external access
    window.bundleOptimizationReport = analysis;
  }
  
  /**
   * Get current optimization status
   */
  getOptimizationStatus() {
    const currentSize = this.bundleMetrics.totalSize;
    const targetSize = this.options.maxBundleSize;
    const savings = Math.max(0, currentSize - targetSize);
    
    return {
      currentSize: this.formatBytes(currentSize),
      targetSize: this.formatBytes(targetSize),
      isOptimized: currentSize <= targetSize,
      potentialSavings: this.formatBytes(savings),
      optimizationPercentage: targetSize > 0 ? 
        Math.max(0, ((targetSize - currentSize) / targetSize * 100)).toFixed(1) + '%' : '0%'
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
   * Export optimization data
   */
  exportData() {
    return {
      metrics: {
        totalSize: this.bundleMetrics.totalSize,
        moduleCount: this.bundleMetrics.loadedModules.size,
        loadedModules: Array.from(this.bundleMetrics.loadedModules.entries())
      },
      analysis: this.analysisResults,
      status: this.getOptimizationStatus(),
      timestamp: Date.now()
    };
  }
}

// Global initialization
if (!window.bundleOptimizer) {
  window.bundleOptimizer = new BundleOptimizer({
    enableMonitoring: true,
    enableAnalysis: true,
    enableReporting: true
  });
  
  console.log('🎯 BundleOptimizer initialized for Phase 2 monitoring');
  
  // Debug functions
  window.getBundleReport = () => window.bundleOptimizer.performAnalysis();
  window.getBundleStatus = () => window.bundleOptimizer.getOptimizationStatus();
  window.exportBundleData = () => window.bundleOptimizer.exportData();
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BundleOptimizer;
}
