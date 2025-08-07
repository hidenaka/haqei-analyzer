/**
 * BundleOptimizer - Phase 2 Bundle Analysis System
 * Monitors and optimizes JavaScript bundle performance
 * @version 2.0.0
 * @author HAQEI Development Team
 */

class BundleOptimizer {
  constructor(options = {}) {
    this.options = {
      enableMonitoring: options.enableMonitoring !== false,
      enableAnalysis: options.enableAnalysis !== false,
      enableReporting: options.enableReporting !== false,
      maxBundleSize: options.maxBundleSize || 5 * 1024 * 1024, // 5MB default
      analysisInterval: options.analysisInterval || 60000, // 1 minute
      ...options
    };

    this.bundleMetrics = {
      totalSize: 0,
      loadedModules: new Map(),
      loadTimes: new Map(),
      memoryUsage: new Map(),
      errors: [],
      startTime: Date.now()
    };

    this.analysisResults = {
      timestamp: 0,
      performance: {
        loadTimes: {},
        memoryUsage: 0,
        bundleSize: 0,
        moduleCount: 0
      },
      optimization: {
        duplicates: [],
        unused: [],
        recommendations: []
      }
    };

    console.log('📊 BundleOptimizer Phase 2 initialized');
    this.initialize();
  }

  /**
   * Initialize the bundle optimizer
   */
  initialize() {
    if (this.options.enableMonitoring) {
      this.startMonitoring();
    }

    if (this.options.enableAnalysis) {
      this.scheduleAnalysis();
    }

    this.setupEventListeners();
  }

  /**
   * Start monitoring bundle performance
   */
  startMonitoring() {
    console.log('🔍 Starting bundle monitoring...');
    
    this.monitorModuleLoading();
    this.monitorMemoryUsage();
    this.setupPerformanceObserver();
  }

  /**
   * Monitor module loading performance
   */
  monitorModuleLoading() {
    // Override dynamic imports to track loading
    const originalImport = window.import || (() => {});
    
    const trackModuleLoad = (modulePath, startTime, size = 0) => {
      const loadTime = Date.now() - startTime;
      
      this.bundleMetrics.loadedModules.set(modulePath, {
        timestamp: Date.now(),
        loadTime,
        estimatedSize: size
      });
      
      this.bundleMetrics.loadTimes.set(modulePath, loadTime);
      
      console.log(`📦 Module loaded: ${modulePath} (${loadTime}ms)`);
    };

    // Track script loading via DOM observation
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'SCRIPT' && node.src) {
              const startTime = Date.now();
              node.addEventListener('load', () => {
                trackModuleLoad(node.src, startTime, this.estimateScriptSize(node.src));
              });
              node.addEventListener('error', (error) => {
                this.bundleMetrics.errors.push({
                  type: 'load_error',
                  module: node.src,
                  error: error.message,
                  timestamp: Date.now()
                });
              });
            }
          });
        });
      });
      
      observer.observe(document.head, { childList: true });
      observer.observe(document.body, { childList: true });
    }
  }

  /**
   * Estimate script size from headers or content
   */
  estimateScriptSize(scriptUrl) {
    try {
      // Try to get content-length from a HEAD request
      fetch(scriptUrl, { method: 'HEAD' }).then(response => {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const size = parseInt(contentLength);
          this.bundleMetrics.totalSize += size;
          console.log(`📜 Script size estimated: ${scriptUrl} (${this.formatBytes(size)})`);
          return size;
        }
      }).catch(() => {
        // Silently ignore fetch errors for size estimation
      });
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
   * Schedule periodic analysis
   */
  scheduleAnalysis() {
    setInterval(() => {
      this.performAnalysis();
    }, this.options.analysisInterval);
    
    // Initial analysis after 10 seconds
    setTimeout(() => {
      this.performAnalysis();
    }, 10000);
  }

  /**
   * Setup event listeners for optimization triggers
   */
  setupEventListeners() {
    if (typeof document !== 'undefined') {
      // Analyze on page visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          setTimeout(() => this.performAnalysis(), 1000);
        }
      });
      
      // Analyze on window focus
      window.addEventListener('focus', () => {
        setTimeout(() => this.performAnalysis(), 1000);
      });
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
      performance: this.analyzePerformance(),
      optimization: this.analyzeOptimizations(),
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
      memoryGrowthRate: this.calculateMemoryGrowthRate(memoryEntries),
      errorCount: this.bundleMetrics.errors.length
    };
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
      totalWaste: (duplicates.totalSize || 0) + (unused.totalSize || 0)
    };
  }

  /**
   * Find duplicate code across modules (simplified detection)
   */
  findDuplicateCode() {
    const duplicates = [];
    let totalSize = 0;
    
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
        suggestion: 'Consider code splitting or removing unused modules'
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
    
    // Memory usage recommendations
    if (analysis.performance.memoryGrowthRate > 1024) { // 1KB/sec growth
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: `High memory growth rate: ${this.formatBytes(analysis.performance.memoryGrowthRate)}/sec`,
        suggestion: 'Check for memory leaks and implement cleanup'
      });
    }
    
    // Error rate recommendations
    if (analysis.performance.errorCount > 0) {
      recommendations.push({
        type: 'stability',
        priority: 'high',
        message: `${analysis.performance.errorCount} bundle loading errors detected`,
        suggestion: 'Review error logs and fix module loading issues'
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
      console.log('\\n🎯 Recommendations:');
      analysis.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
        console.log(`   💡 ${rec.suggestion}`);
      });
    }
    
    console.log('='.repeat(50));
    
    // Store report for external access
    if (typeof window !== 'undefined') {
      window.bundleOptimizationReport = analysis;
    }
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
        loadedModules: Array.from(this.bundleMetrics.loadedModules.entries()),
        errors: this.bundleMetrics.errors
      },
      analysis: this.analysisResults,
      status: this.getOptimizationStatus(),
      timestamp: Date.now()
    };
  }

  /**
   * Reset all metrics and analysis data
   */
  reset() {
    this.bundleMetrics = {
      totalSize: 0,
      loadedModules: new Map(),
      loadTimes: new Map(),
      memoryUsage: new Map(),
      errors: [],
      startTime: Date.now()
    };
    
    this.analysisResults = {
      timestamp: 0,
      performance: {
        loadTimes: {},
        memoryUsage: 0,
        bundleSize: 0,
        moduleCount: 0
      },
      optimization: {
        duplicates: [],
        unused: [],
        recommendations: []
      }
    };
    
    console.log('🔄 BundleOptimizer reset complete');
  }
}

// Global initialization
if (typeof window !== 'undefined' && !window.bundleOptimizer) {
  window.bundleOptimizer = new BundleOptimizer({
    enableMonitoring: true,
    enableAnalysis: true,
    enableReporting: true
  });
  
  console.log('🎯 BundleOptimizer initialized for Phase 2 monitoring');
  
  // Debug functions for browser console
  window.getBundleReport = () => window.bundleOptimizer.performAnalysis();
  window.getBundleStatus = () => window.bundleOptimizer.getOptimizationStatus();
  window.exportBundleData = () => window.bundleOptimizer.exportData();
  window.resetBundleOptimizer = () => window.bundleOptimizer.reset();
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BundleOptimizer;
}