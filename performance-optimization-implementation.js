/**
 * HAQEI Performance Optimization Implementation
 * 
 * This file contains specific optimization implementations based on the Core Web Vitals analysis.
 * Implements critical performance improvements for the HAQEI analyzer system.
 */

/**
 * 1. Critical CSS Extraction and Inline Strategy
 */
class CriticalCSSOptimizer {
  constructor() {
    this.criticalCSS = new Set([
      'core.css',
      'components.css', 
      'layouts.css'
    ]);
    this.deferredCSS = new Set([
      'interactive.css',
      'results.css',
      'themes.css',
      'accessibility-wcag.css'
    ]);
  }

  /**
   * Inline critical CSS and defer non-critical CSS
   */
  optimizeCSSLoading() {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    
    cssLinks.forEach(link => {
      const href = link.getAttribute('href');
      const filename = href.split('/').pop();
      
      if (this.deferredCSS.has(filename)) {
        // Convert to non-render-blocking
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'style');
        link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
        
        // Add noscript fallback
        const noscript = document.createElement('noscript');
        const fallbackLink = link.cloneNode();
        fallbackLink.setAttribute('rel', 'stylesheet');
        noscript.appendChild(fallbackLink);
        link.parentNode.insertBefore(noscript, link.nextSibling);
      }
    });
  }
}

/**
 * 2. Dynamic Script Loading Manager
 */
class DynamicScriptLoader {
  constructor() {
    this.loadedScripts = new Set();
    this.loadingPromises = new Map();
    this.dependencies = new Map();
    
    this.defineLoadingStages();
  }

  defineLoadingStages() {
    // Stage 1: Critical Path (loaded immediately)
    this.stages = {
      critical: [
        '/js/shared/core/BaseComponent.js',
        '/js/shared/core/MicroStorageManager.js',
        '/js/shared/core/MicroDataManager.js',
        '/js/os-analyzer/components/WelcomeScreen.js'
      ],
      
      // Stage 2: Question Flow (loaded when needed)
      questionFlow: [
        '/js/os-analyzer/components/VirtualQuestionFlow-core.js',
        '/js/os-analyzer/components/VirtualQuestionFlow-renderer.js',
        '/js/os-analyzer/components/VirtualQuestionFlow-state.js',
        '/js/os-analyzer/components/HaqeiQuestionElement.js'
      ],
      
      // Stage 3: Analysis Engines (loaded after questions complete)
      analysis: [
        '/js/shared/core/StorageManager.js',
        '/js/shared/core/DataManager.js',
        '/js/os-analyzer/core/TripleOSEngine.js',
        '/js/os-analyzer/core/UltraAnalysisEngine.js'
      ],
      
      // Stage 4: Results and Visualization (loaded before results display)
      results: [
        '/js/components/TripleOSResultsView.js',
        '/js/components/VirtualPersonaResultsView.js',
        '/js/visualization/PersonaVisualizationEngine.js'
      ],
      
      // Stage 5: Data Files (loaded progressively)
      data: [
        '/js/data/data_box.js',
        '/js/core/H384_DATABASE.js',
        '/js/data/hexagram_details.js'
      ]
    };
  }

  /**
   * Load scripts for a specific stage
   */
  async loadStage(stageName) {
    const scripts = this.stages[stageName];
    if (!scripts) {
      throw new Error(`Unknown stage: ${stageName}`);
    }

    const loadPromises = scripts.map(script => this.loadScript(script));
    await Promise.all(loadPromises);
    
    console.log(`✅ Stage '${stageName}' loaded successfully`);
  }

  /**
   * Load a single script with caching
   */
  async loadScript(src) {
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => {
        this.loadedScripts.add(src);
        this.loadingPromises.delete(src);
        resolve();
      };
      
      script.onerror = (error) => {
        this.loadingPromises.delete(src);
        console.error(`Failed to load script: ${src}`, error);
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * Progressive loading based on user interaction
   */
  setupProgressiveLoading() {
    // Load question flow when user starts
    document.addEventListener('haqei:questionFlowStart', () => {
      this.loadStage('questionFlow');
    });

    // Load analysis engines when questions complete
    document.addEventListener('haqei:questionsComplete', () => {
      this.loadStage('analysis');
    });

    // Load results components when analysis starts
    document.addEventListener('haqei:analysisStart', () => {
      this.loadStage('results');
    });

    // Load data files in background after initial load
    setTimeout(() => {
      this.loadStage('data');
    }, 2000);
  }
}

/**
 * 3. Data Chunking and Streaming Strategy
 */
class DataOptimizer {
  constructor() {
    this.chunkSize = 50; // KB
    this.loadedChunks = new Map();
    this.streamingEndpoints = new Map();
  }

  /**
   * Split large data files into smaller chunks
   */
  async chunkLargeDataFiles() {
    const largeDataFiles = [
      '/js/data/data_box.js',
      '/js/core/H384_DATABASE.js',
      '/js/data/hexagram_details.js'
    ];

    for (const file of largeDataFiles) {
      await this.createDataChunks(file);
    }
  }

  /**
   * Create chunked versions of data files
   */
  async createDataChunks(filePath) {
    try {
      const response = await fetch(filePath);
      const content = await response.text();
      
      // Extract the data variable
      const dataMatch = content.match(/(?:const|var|let)\s+(\w+)\s*=\s*({[\s\S]*});/);
      if (!dataMatch) {
        console.warn(`Could not parse data from ${filePath}`);
        return;
      }

      const [, varName, dataString] = dataMatch;
      const data = eval(`(${dataString})`);
      
      // Create chunks
      const chunks = this.createChunks(data, filePath);
      
      // Store chunk information
      this.loadedChunks.set(filePath, {
        totalChunks: chunks.length,
        loadedChunks: 0,
        chunks: chunks
      });

      console.log(`✅ Created ${chunks.length} chunks for ${filePath}`);
      
    } catch (error) {
      console.error(`Failed to chunk ${filePath}:`, error);
    }
  }

  /**
   * Create data chunks
   */
  createChunks(data, filePath) {
    const chunks = [];
    const entries = Object.entries(data);
    const chunkSize = Math.ceil(entries.length / 10); // 10 chunks max
    
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunkEntries = entries.slice(i, i + chunkSize);
      const chunkData = Object.fromEntries(chunkEntries);
      
      chunks.push({
        id: `${filePath}_chunk_${chunks.length}`,
        data: chunkData,
        size: JSON.stringify(chunkData).length
      });
    }
    
    return chunks;
  }

  /**
   * Load data chunks progressively
   */
  async loadDataChunks(filePath, priority = 'low') {
    const chunkInfo = this.loadedChunks.get(filePath);
    if (!chunkInfo) {
      console.warn(`No chunks found for ${filePath}`);
      return;
    }

    const loadPromises = chunkInfo.chunks.map((chunk, index) => {
      return new Promise(resolve => {
        const delay = priority === 'high' ? 0 : index * 100; // Stagger loading
        
        setTimeout(() => {
          // Simulate loading chunk data
          window[`${filePath}_chunk_${index}`] = chunk.data;
          chunkInfo.loadedChunks++;
          resolve(chunk);
        }, delay);
      });
    });

    await Promise.all(loadPromises);
    console.log(`✅ All chunks loaded for ${filePath}`);
  }
}

/**
 * 4. Virtual Scrolling Implementation for Question Flow
 */
class VirtualScrollOptimizer {
  constructor(container, itemHeight = 120) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleItems = Math.ceil(window.innerHeight / itemHeight) + 2; // Buffer
    this.items = [];
    this.scrollTop = 0;
    this.renderedItems = new Map();
  }

  /**
   * Initialize virtual scrolling
   */
  init(items) {
    this.items = items;
    this.setupScrollContainer();
    this.bindScrollEvents();
    this.renderVisibleItems();
  }

  /**
   * Setup scroll container
   */
  setupScrollContainer() {
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'auto';
    this.container.style.height = '100vh';
    
    // Create virtual space
    this.spacer = document.createElement('div');
    this.spacer.style.height = `${this.items.length * this.itemHeight}px`;
    this.spacer.style.position = 'relative';
    this.container.appendChild(this.spacer);
  }

  /**
   * Bind scroll events
   */
  bindScrollEvents() {
    this.container.addEventListener('scroll', this.throttle(() => {
      this.scrollTop = this.container.scrollTop;
      this.renderVisibleItems();
    }, 16)); // 60fps
  }

  /**
   * Render only visible items
   */
  renderVisibleItems() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + this.visibleItems, this.items.length);
    
    // Remove items that are no longer visible
    for (const [index, element] of this.renderedItems) {
      if (index < startIndex || index >= endIndex) {
        element.remove();
        this.renderedItems.delete(index);
      }
    }
    
    // Add new visible items
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.renderedItems.has(i)) {
        const element = this.createItemElement(this.items[i], i);
        element.style.position = 'absolute';
        element.style.top = `${i * this.itemHeight}px`;
        element.style.width = '100%';
        
        this.spacer.appendChild(element);
        this.renderedItems.set(i, element);
      }
    }
  }

  /**
   * Create item element (to be overridden)
   */
  createItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'virtual-item';
    div.innerHTML = `<div>Item ${index}: ${item.title || item.id}</div>`;
    return div;
  }

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

/**
 * 5. Web Vitals Monitoring
 */
class WebVitalsMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.thresholds = {
      FCP: 1800,
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      INP: 200
    };
  }

  /**
   * Initialize Web Vitals monitoring
   */
  init() {
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeINP();
    
    // Report metrics periodically
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Observe First Contentful Paint
   */
  observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.recordMetric('FCP', fcpEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('FCP', observer);
    }
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('LCP', observer);
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.recordMetric('FID', fid);
          }
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('FID', observer);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('CLS', observer);
    }
  }

  /**
   * Observe Interaction to Next Paint
   */
  observeINP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.processingEnd && entry.startTime) {
            const inp = entry.processingEnd - entry.startTime;
            this.recordMetric('INP', inp);
          }
        });
      });
      observer.observe({ entryTypes: ['event'] });
      this.observers.set('INP', observer);
    }
  }

  /**
   * Record a metric
   */
  recordMetric(name, value) {
    const existing = this.metrics.get(name) || [];
    existing.push({
      value: value,
      timestamp: Date.now(),
      url: window.location.pathname
    });
    this.metrics.set(name, existing);
    
    // Check against thresholds
    this.checkThreshold(name, value);
  }

  /**
   * Check if metric exceeds threshold
   */
  checkThreshold(name, value) {
    const threshold = this.thresholds[name];
    if (threshold && value > threshold) {
      console.warn(`⚠️ ${name} threshold exceeded: ${value.toFixed(2)}ms (threshold: ${threshold}ms)`);
      
      // Dispatch custom event for monitoring
      window.dispatchEvent(new CustomEvent('webVitalThresholdExceeded', {
        detail: { metric: name, value, threshold }
      }));
    }
  }

  /**
   * Report metrics
   */
  reportMetrics() {
    const report = {};
    
    for (const [metric, values] of this.metrics) {
      if (values.length > 0) {
        const latest = values[values.length - 1];
        const average = values.reduce((sum, v) => sum + v.value, 0) / values.length;
        const p95 = this.calculatePercentile(values.map(v => v.value), 95);
        
        report[metric] = {
          latest: latest.value,
          average: Math.round(average),
          p95: Math.round(p95),
          count: values.length,
          status: latest.value <= this.thresholds[metric] ? 'good' : 'poor'
        };
      }
    }
    
    console.log('📊 Web Vitals Report:', report);
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'web_vitals', { custom_map: report });
    }
    
    return report;
  }

  /**
   * Calculate percentile
   */
  calculatePercentile(values, percentile) {
    const sorted = values.sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }
}

/**
 * 6. Main Performance Optimization Orchestrator
 */
class HaqeiPerformanceOptimizer {
  constructor() {
    this.cssOptimizer = new CriticalCSSOptimizer();
    this.scriptLoader = new DynamicScriptLoader();
    this.dataOptimizer = new DataOptimizer();
    this.webVitalsMonitor = new WebVitalsMonitor();
    this.virtualScrollOptimizer = null;
    
    this.optimizationMetrics = {
      startTime: Date.now(),
      optimizationsApplied: [],
      performanceGains: {}
    };
  }

  /**
   * Initialize all optimizations
   */
  async init() {
    console.log('🚀 Initializing HAQEI Performance Optimizations...');
    
    try {
      // Critical CSS optimization
      this.cssOptimizer.optimizeCSSLoading();
      this.optimizationMetrics.optimizationsApplied.push('CSS Loading');
      
      // Progressive script loading
      this.scriptLoader.setupProgressiveLoading();
      await this.scriptLoader.loadStage('critical');
      this.optimizationMetrics.optimizationsApplied.push('Progressive Script Loading');
      
      // Data optimization
      await this.dataOptimizer.chunkLargeDataFiles();
      this.optimizationMetrics.optimizationsApplied.push('Data Chunking');
      
      // Web Vitals monitoring
      this.webVitalsMonitor.init();
      this.optimizationMetrics.optimizationsApplied.push('Web Vitals Monitoring');
      
      // Virtual scrolling for questions (when needed)
      this.setupVirtualScrolling();
      
      console.log('✅ Performance optimizations initialized successfully');
      
      // Report initialization metrics
      this.reportInitializationMetrics();
      
    } catch (error) {
      console.error('❌ Performance optimization initialization failed:', error);
    }
  }

  /**
   * Setup virtual scrolling for question flow
   */
  setupVirtualScrolling() {
    document.addEventListener('haqei:questionFlowReady', (event) => {
      const container = event.detail.container;
      const questions = event.detail.questions;
      
      if (questions.length > 10) { // Only for large question sets
        this.virtualScrollOptimizer = new VirtualScrollOptimizer(container);
        this.virtualScrollOptimizer.init(questions);
        this.optimizationMetrics.optimizationsApplied.push('Virtual Scrolling');
      }
    });
  }

  /**
   * Report initialization metrics
   */
  reportInitializationMetrics() {
    const initTime = Date.now() - this.optimizationMetrics.startTime;
    
    console.log('📊 Performance Optimization Report:', {
      initializationTime: `${initTime}ms`,
      optimizationsApplied: this.optimizationMetrics.optimizationsApplied,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return { status: 'not available' };
  }

  /**
   * Get current Web Vitals scores
   */
  getCurrentWebVitals() {
    return this.webVitalsMonitor.reportMetrics();
  }

  /**
   * Force garbage collection (if available)
   */
  optimizeMemory() {
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
      console.log('🧹 Forced garbage collection');
    }
  }
}

// Initialize performance optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.haqeiPerformanceOptimizer = new HaqeiPerformanceOptimizer();
  window.haqeiPerformanceOptimizer.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HaqeiPerformanceOptimizer,
    CriticalCSSOptimizer,
    DynamicScriptLoader,
    DataOptimizer,
    VirtualScrollOptimizer,
    WebVitalsMonitor
  };
}