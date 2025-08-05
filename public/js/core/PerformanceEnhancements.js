/**
 * HAQEI Performance Enhancement Methods - PerformanceEnhancements.js
 * 
 * Shared performance initialization methods for all engines
 * Provides consistent performance optimization across components
 * 
 * Author: Ultra-Speed-Optimizer Agent
 * Created: 2025-08-04
 */

// TripleOSEngine Performance Enhancements
if (typeof TripleOSEngine !== 'undefined') {
  TripleOSEngine.prototype.initializeCacheAndOptimizer = async function() {
    try {
      // Initialize cache manager
      await this.cacheManager.init();
      
      // Initialize performance optimizer
      await this.performanceOptimizer.init();
      
      // Create WebWorker manager for heavy calculations
      this.workerManager = new WebWorkerManager({
        maxWorkers: 4,
        enableLoadBalancing: true,
        enableAutoScaling: true
      });
      await this.workerManager.init();
      
      console.log("🚀 TripleOSEngine: Cache and optimizer initialized");
      
    } catch (error) {
      console.warn("⚠️ TripleOSEngine: Performance enhancement initialization failed:", error);
    }
  };

  // Enhanced OS analysis with caching
  TripleOSEngine.prototype.analyzeWithCache = async function(answers) {
    const cacheKey = `os_analysis_${this.hashAnswers(answers)}`;
    
    // Check cache first
    let cachedResult = this.cacheManager.get(cacheKey);
    if (cachedResult) {
      console.log("📦 OS Analysis cache hit");
      return cachedResult;
    }
    
    const startTime = performance.now();
    
    try {
      // Use WebWorker for heavy analysis
      const result = await this.workerManager.executeTask('os_analysis', {
        answers: answers,
        analysisType: 'comprehensive'
      });
      
      const duration = performance.now() - startTime;
      
      // Cache the result
      this.cacheManager.cacheAnalysis('os_comprehensive', { answers }, result, {
        ttl: 1800000 // 30 minutes
      });
      
      console.log(`⚡ OS Analysis completed in ${duration.toFixed(2)}ms`);
      return result;
      
    } catch (error) {
      console.error("❌ OS Analysis failed:", error);
      // Fallback to original method
      return this.analyze(answers);
    }
  };

  // Hash answers for caching
  TripleOSEngine.prototype.hashAnswers = function(answers) {
    const answerString = answers.map(a => `${a.questionId}:${a.selectedValue || a.innerChoice?.value + a.outerChoice?.value}`).join('|');
    return this.cacheManager.hashParameters(answerString);
  };
}

// IChingTransformationEngine Performance Enhancements
if (typeof IChingTransformationEngine !== 'undefined') {
  IChingTransformationEngine.prototype.initializePerformanceSystems = async function() {
    try {
      // Initialize cache manager
      await this.cacheManager.init();
      
      // Initialize performance optimizer
      await this.performanceOptimizer.init();
      
      // Create specialized workers for I Ching calculations
      this.createParallelWorkers();
      
      console.log("🌟 IChingTransformationEngine: Performance systems initialized");
      
    } catch (error) {
      console.warn("⚠️ IChingTransformationEngine: Performance initialization failed:", error);
    }
  };

  IChingTransformationEngine.prototype.createParallelWorkers = function() {
    const workerTypes = ['hexagram', 'transformation', 'relationship'];
    
    workerTypes.forEach(type => {
      this.parallelWorkers.set(type, new WebWorkerManager({
        maxWorkers: 2,
        enableLoadBalancing: true
      }));
    });
  };

  // Enhanced calculation with parallel processing
  IChingTransformationEngine.prototype.calculateWithParallel = async function(inputData) {
    const cacheKey = `transformation_${this.cacheManager.hashParameters(inputData)}`;
    
    // Check cache first
    let cachedResult = this.cacheManager.get(cacheKey);
    if (cachedResult) {
      console.log("📦 I Ching calculation cache hit");
      return cachedResult;
    }
    
    const startTime = performance.now();
    
    try {
      // Queue multiple calculations in parallel
      const parallelTasks = [
        this.calculateBasicTransformation(inputData.currentHexagram, inputData.changingLines),
        this.calculateRelationalTransformation(inputData.currentHexagram),
        this.calculateFiveElementsTransformation(inputData.currentHexagram, inputData.timeContext),
        this.calculateSequenceTransformation(inputData.currentHexagram)
      ];
      
      const results = await Promise.all(parallelTasks);
      
      // Comprehensive integration
      const finalResult = this.calculateComprehensiveIntegration(
        inputData.currentHexagram,
        inputData.changingLines,
        inputData.timeContext,
        inputData.personalContext
      );
      
      const duration = performance.now() - startTime;
      
      // Cache the result
      this.cacheManager.cacheCalculation('comprehensive_transformation', 
        this.cacheManager.hashParameters(inputData), finalResult);
      
      console.log(`⚡ I Ching calculation completed in ${duration.toFixed(2)}ms`);
      return finalResult;
      
    } catch (error) {
      console.error("❌ I Ching calculation failed:", error);
      return this.calculateComprehensiveTransformation(inputData);
    }
  };

  // Process calculation queue
  IChingTransformationEngine.prototype.processCalculationQueue = async function() {
    if (this.isProcessingQueue || this.calculationQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    const batch = this.calculationQueue.splice(0, 5); // Process 5 at a time
    
    const promises = batch.map(async (calc) => {
      try {
        const result = await this.calculateWithParallel(calc.inputData);
        calc.resolve(result);
      } catch (error) {
        calc.reject(error);
      }
    });
    
    await Promise.all(promises);
    
    this.isProcessingQueue = false;
    
    // Process remaining queue
    if (this.calculationQueue.length > 0) {
      setTimeout(() => this.processCalculationQueue(), 10);
    }
  };
}

// VirtualQuestionFlow Performance Enhancements
if (typeof VirtualQuestionFlow !== 'undefined') {
  VirtualQuestionFlow.prototype.initializePerformanceSystems = async function() {
    try {
      // Initialize cache manager
      await this.cacheManager.init();
      
      // Initialize performance optimizer
      await this.performanceOptimizer.init();
      
      // Setup render queue optimization
      this.setupRenderOptimization();
      
      // Setup FPS monitoring
      this.setupFPSMonitoring();
      
      console.log("🎬 VirtualQuestionFlow: Performance systems initialized");
      
    } catch (error) {
      console.warn("⚠️ VirtualQuestionFlow: Performance initialization failed:", error);
    }
  };

  VirtualQuestionFlow.prototype.setupRenderOptimization = function() {
    // Render queue with priority
    this.renderQueue = [];
    this.isRenderOptimizing = false;
    
    // Debounced render processing
    this.processRenderQueue = this.debounce(() => {
      this.executeRenderQueue();
    }, 16); // 60fps target
  };

  VirtualQuestionFlow.prototype.setupFPSMonitoring = function() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.averageFPS = frameCount;
        
        // Trigger optimization if FPS drops
        if (frameCount < 50) {
          this.triggerRenderOptimization();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  };

  VirtualQuestionFlow.prototype.triggerRenderOptimization = async function() {
    if (this.isOptimizing) return;
    
    this.isOptimizing = true;
    
    try {
      // Optimize DOM elements
      await this.performanceOptimizer.optimizeDOM();
      
      // Optimize memory usage
      await this.performanceOptimizer.optimizeMemory();
      
      this.performanceMetrics.optimizationCount++;
      
    } catch (error) {
      console.warn("⚠️ Render optimization failed:", error);
    } finally {
      this.isOptimizing = false;
    }
  };

  VirtualQuestionFlow.prototype.executeRenderQueue = function() {
    if (this.isRenderOptimizing || this.renderQueue.length === 0) return;
    
    this.isRenderOptimizing = true;
    
    const startTime = performance.now();
    
    try {
      // Process render queue in batches
      const batch = this.renderQueue.splice(0, 3);
      
      batch.forEach(renderTask => {
        try {
          renderTask.execute();
        } catch (error) {
          console.warn("⚠️ Render task failed:", error);
        }
      });
      
      const duration = performance.now() - startTime;
      this.performanceMetrics.renderTime = duration;
      
      // Continue processing if queue has items
      if (this.renderQueue.length > 0) {
        requestAnimationFrame(() => {
          this.isRenderOptimizing = false;
          this.processRenderQueue();
        });
      } else {
        this.isRenderOptimizing = false;
      }
      
    } catch (error) {
      console.error("❌ Render queue execution failed:", error);
      this.isRenderOptimizing = false;
    }
  };

  // Enhanced rendering with caching
  VirtualQuestionFlow.prototype.renderQuestionWithCache = function(questionIndex) {
    const question = this.questions[questionIndex];
    if (!question) return;
    
    const cacheKey = `question_render_${question.id}`;
    
    // Check if element is cached
    let cachedElement = this.cacheManager.get(cacheKey);
    if (cachedElement && cachedElement.parentNode) {
      this.performanceMetrics.cacheHitRate++;
      return cachedElement;
    }
    
    // Create new element
    const element = this.createQuestionElement(question);
    
    // Cache the element
    this.cacheManager.set(cacheKey, element, {
      ttl: 900000, // 15 minutes
      type: 'ui_element'
    });
    
    return element;
  };

  // Debounce utility
  VirtualQuestionFlow.prototype.debounce = function(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
}

// Global Performance Utilities
window.HAQEIPerformanceUtils = {
  // Memory usage monitoring
  monitorMemoryUsage: function() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(2) + '%'
      };
    }
    return null;
  },
  
  // Performance timing
  measurePerformance: function(operation, fn) {
    const startTime = performance.now();
    const result = fn();
    const duration = performance.now() - startTime;
    
    console.log(`⚡ ${operation} completed in ${duration.toFixed(2)}ms`);
    return { result, duration };
  },
  
  // Async performance timing
  measureAsyncPerformance: async function(operation, fn) {
    const startTime = performance.now();
    const result = await fn();
    const duration = performance.now() - startTime;
    
    console.log(`⚡ ${operation} completed in ${duration.toFixed(2)}ms`);
    return { result, duration };
  },
  
  // Generate performance report
  generatePerformanceReport: function() {
    const memory = this.monitorMemoryUsage();
    const timing = performance.timing;
    
    return {
      timestamp: Date.now(),
      memory: memory,
      navigation: {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domComplete - timing.navigationStart
      },
      resources: performance.getEntriesByType('resource').length,
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency
    };
  }
};

console.log("🚀 PerformanceEnhancements.js loaded - All engines enhanced");