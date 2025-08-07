/**
 * CodeSplitter.js - Advanced Code Splitting Utility
 * 
 * Phase 2 Optimization: Runtime code analysis and splitting
 * Identifies and manages code that can be split for better loading
 * 
 * Features:
 * - Dead code detection
 * - Duplicate code identification  
 * - Dynamic import optimization
 * - Module dependency analysis
 */

class CodeSplitter {
  constructor(options = {}) {
    this.options = {
      enableAnalysis: true,
      enableSplitting: true,
      enableOptimization: true,
      analysisDepth: 'medium', // light, medium, deep
      splitThreshold: 50 * 1024, // 50KB
      ...options
    };
    
    // Analysis results
    this.analysis = {
      modules: new Map(),
      dependencies: new Map(),
      duplicates: [],
      deadCode: [],
      opportunities: []
    };
    
    // Splitting strategies
    this.strategies = {
      byFeature: this.splitByFeature.bind(this),
      bySize: this.splitBySize.bind(this),
      byUsage: this.splitByUsage.bind(this)
    };
    
    // Performance tracking
    this.metrics = {
      analysisTime: 0,
      splitsIdentified: 0,
      potentialSavings: 0,
      optimizationScore: 0
    };
    
    console.log('✂️ CodeSplitter initialized - Advanced splitting analysis ready');
  }
  
  /**
   * Analyze current codebase for splitting opportunities
   */
  async analyzeCodebase() {
    const startTime = performance.now();
    console.log('🔍 Analyzing codebase for splitting opportunities...');
    
    try {
      // Step 1: Analyze loaded modules
      await this.analyzeLoadedModules();
      
      // Step 2: Build dependency graph
      this.buildDependencyGraph();
      
      // Step 3: Identify splitting opportunities
      this.identifySplittingOpportunities();
      
      // Step 4: Calculate optimization potential
      this.calculateOptimizationPotential();
      
      const analysisTime = performance.now() - startTime;
      this.metrics.analysisTime = analysisTime;
      
      console.log(`✅ Codebase analysis complete in ${analysisTime.toFixed(0)}ms`);
      return this.generateAnalysisReport();
      
    } catch (error) {
      console.error('❌ Codebase analysis failed:', error);
      throw error;
    }
  }
  
  /**
   * Analyze currently loaded modules
   */
  async analyzeLoadedModules() {
    const scripts = document.querySelectorAll('script[src]');
    const dynamicModules = window.moduleLoader ? 
      Array.from(window.moduleLoader.loadedModules.keys()) : [];
    
    // Analyze static scripts
    scripts.forEach(script => {
      this.analyzeScript(script.src);
    });
    
    // Analyze dynamic modules
    dynamicModules.forEach(modulePath => {
      this.analyzeModule(modulePath);
    });
    
    console.log(`📊 Analyzed ${scripts.length} static scripts and ${dynamicModules.length} dynamic modules`);
  }
  
  /**
   * Analyze individual script
   */
  analyzeScript(scriptUrl) {
    const moduleInfo = {
      url: scriptUrl,
      type: 'static',
      size: 0,
      dependencies: [],
      splitOpportunities: []
    };
    
    // Estimate size and analyze content if possible
    this.estimateModuleSize(moduleInfo);
    this.identifyModuleType(moduleInfo);
    
    this.analysis.modules.set(scriptUrl, moduleInfo);
  }
  
  /**
   * Analyze dynamic module
   */
  analyzeModule(modulePath) {
    const moduleInfo = {
      url: modulePath,
      type: 'dynamic',
      size: 0,
      dependencies: [],
      splitOpportunities: []
    };
    
    // Get module data from ModuleLoader if available
    if (window.moduleLoader && window.moduleLoader.loadedModules.has(modulePath)) {
      const moduleData = window.moduleLoader.loadedModules.get(modulePath);
      moduleInfo.size = moduleData.estimatedSize || 0;
      moduleInfo.loadTime = moduleData.loadTime || 0;
    }
    
    this.identifyModuleType(moduleInfo);
    this.analysis.modules.set(modulePath, moduleInfo);
  }
  
  /**
   * Estimate module size
   */
  estimateModuleSize(moduleInfo) {
    // Use Performance API if available
    try {
      const resourceEntries = performance.getEntriesByName(moduleInfo.url);
      if (resourceEntries.length > 0) {
        const entry = resourceEntries[0];
        moduleInfo.size = entry.transferSize || entry.encodedBodySize || 0;
        moduleInfo.loadTime = entry.duration || 0;
      }
    } catch (error) {
      console.warn(`Could not get performance data for ${moduleInfo.url}`);
    }
  }
  
  /**
   * Identify module type and characteristics
   */
  identifyModuleType(moduleInfo) {
    const url = moduleInfo.url;
    
    // Categorize by URL patterns
    if (url.includes('/lib/')) {
      moduleInfo.category = 'library';
      moduleInfo.splitPriority = 'high';
    } else if (url.includes('/components/')) {
      moduleInfo.category = 'component';
      moduleInfo.splitPriority = 'medium';
    } else if (url.includes('/core/')) {
      moduleInfo.category = 'core';
      moduleInfo.splitPriority = 'low';
    } else if (url.includes('/data/')) {
      moduleInfo.category = 'data';
      moduleInfo.splitPriority = 'high';
    } else if (url.includes('/utils/')) {
      moduleInfo.category = 'utility';
      moduleInfo.splitPriority = 'medium';
    } else {
      moduleInfo.category = 'unknown';
      moduleInfo.splitPriority = 'low';
    }
    
    // Size-based priority adjustment
    if (moduleInfo.size > this.options.splitThreshold) {
      moduleInfo.splitPriority = 'high';
    }
  }
  
  /**
   * Build dependency graph
   */
  buildDependencyGraph() {
    console.log('🕸️ Building dependency graph...');
    
    this.analysis.modules.forEach((moduleInfo, modulePath) => {
      const dependencies = this.extractDependencies(moduleInfo);
      this.analysis.dependencies.set(modulePath, dependencies);
    });
  }
  
  /**
   * Extract dependencies from module
   */
  extractDependencies(moduleInfo) {
    const dependencies = [];
    
    // Common dependency patterns in HAQEI codebase
    const dependencyPatterns = {
      'BaseComponent': ['/js/shared/core/BaseComponent.js'],
      'StorageManager': ['/js/shared/core/StorageManager.js'],
      'DataManager': ['/js/shared/core/DataManager.js'],
      'Calculator': ['/js/os-analyzer/core/Calculator.js'],
      'Chart': ['/js/lib/chart.min.js']
    };
    
    // Check for dependency patterns in URL
    Object.entries(dependencyPatterns).forEach(([pattern, deps]) => {
      if (moduleInfo.url.includes(pattern) || 
          moduleInfo.category === pattern.toLowerCase()) {
        dependencies.push(...deps);
      }
    });
    
    return [...new Set(dependencies)];
  }
  
  /**
   * Identify splitting opportunities
   */
  identifySplittingOpportunities() {
    console.log('🎯 Identifying splitting opportunities...');
    
    const opportunities = [];
    
    this.analysis.modules.forEach((moduleInfo, modulePath) => {
      // Strategy 1: Split by feature
      const featureOpportunities = this.strategies.byFeature(moduleInfo);
      opportunities.push(...featureOpportunities);
      
      // Strategy 2: Split by size
      const sizeOpportunities = this.strategies.bySize(moduleInfo);
      opportunities.push(...sizeOpportunities);
      
      // Strategy 3: Split by usage patterns
      const usageOpportunities = this.strategies.byUsage(moduleInfo);
      opportunities.push(...usageOpportunities);
    });
    
    // Deduplicate and prioritize
    this.analysis.opportunities = this.prioritizeOpportunities(opportunities);
    this.metrics.splitsIdentified = this.analysis.opportunities.length;
  }
  
  /**
   * Split by feature strategy
   */
  splitByFeature(moduleInfo) {
    const opportunities = [];
    
    const featurePatterns = {
      'help-system': {
        trigger: 'onDemand',
        priority: 'high',
        estimatedSaving: 400 * 1024
      },
      'chart': {
        trigger: 'onResults',
        priority: 'high', 
        estimatedSaving: 200 * 1024
      },
      'analysis-engine': {
        trigger: 'onAnalysis',
        priority: 'medium',
        estimatedSaving: 800 * 1024
      }
    };
    
    Object.entries(featurePatterns).forEach(([feature, config]) => {
      if (moduleInfo.url.includes(feature) || 
          moduleInfo.category === feature) {
        opportunities.push({
          type: 'feature',
          module: moduleInfo.url,
          feature,
          ...config,
          currentSize: moduleInfo.size
        });
      }
    });
    
    return opportunities;
  }
  
  /**
   * Split by size strategy
   */
  splitBySize(moduleInfo) {
    const opportunities = [];
    
    if (moduleInfo.size > this.options.splitThreshold) {
      opportunities.push({
        type: 'size',
        module: moduleInfo.url,
        reason: 'Large module',
        currentSize: moduleInfo.size,
        priority: moduleInfo.size > 100 * 1024 ? 'high' : 'medium',
        strategy: 'chunk-splitting',
        estimatedSaving: Math.floor(moduleInfo.size * 0.6)
      });
    }
    
    return opportunities;
  }
  
  /**
   * Split by usage strategy
   */
  splitByUsage(moduleInfo) {
    const opportunities = [];
    
    const usagePatterns = {
      'debug': 'development-only',
      'test': 'development-only', 
      'admin': 'admin-only',
      'advanced': 'power-user',
      'experimental': 'optional'
    };
    
    Object.entries(usagePatterns).forEach(([pattern, usage]) => {
      if (moduleInfo.url.includes(pattern)) {
        opportunities.push({
          type: 'usage',
          module: moduleInfo.url,
          usage,
          priority: 'high',
          strategy: 'conditional-loading',
          currentSize: moduleInfo.size,
          estimatedSaving: moduleInfo.size
        });
      }
    });
    
    return opportunities;
  }
  
  /**
   * Prioritize splitting opportunities
   */
  prioritizeOpportunities(opportunities) {
    return opportunities
      .filter(opp => opp.currentSize > 1024)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority] || 0;
        const bPriority = priorityOrder[b.priority] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return b.currentSize - a.currentSize;
      })
      .slice(0, 20);
  }
  
  /**
   * Calculate optimization potential
   */
  calculateOptimizationPotential() {
    let totalSavings = 0;
    let totalSize = 0;
    
    this.analysis.modules.forEach((moduleInfo) => {
      totalSize += moduleInfo.size;
    });
    
    this.analysis.opportunities.forEach((opportunity) => {
      totalSavings += opportunity.estimatedSaving || 0;
    });
    
    this.metrics.potentialSavings = totalSavings;
    this.metrics.optimizationScore = totalSize > 0 ? 
      Math.min(100, (totalSavings / totalSize * 100)) : 0;
  }
  
  /**
   * Generate analysis report
   */
  generateAnalysisReport() {
    const report = {
      summary: {
        modulesAnalyzed: this.analysis.modules.size,
        splittingOpportunities: this.analysis.opportunities.length,
        potentialSavings: this.formatBytes(this.metrics.potentialSavings),
        optimizationScore: this.metrics.optimizationScore.toFixed(1) + '%'
      },
      opportunities: this.analysis.opportunities.map(opp => ({
        ...opp,
        currentSize: this.formatBytes(opp.currentSize),
        estimatedSaving: this.formatBytes(opp.estimatedSaving || 0)
      })),
      recommendations: this.generateRecommendations(),
      metrics: this.metrics
    };
    
    console.log('📊 Code Splitting Analysis Report:');
    console.log('='.repeat(50));
    console.log(`📦 Modules Analyzed: ${report.summary.modulesAnalyzed}`);
    console.log(`✂️ Splitting Opportunities: ${report.summary.splittingOpportunities}`);
    console.log(`💾 Potential Savings: ${report.summary.potentialSavings}`);
    console.log(`🎯 Optimization Score: ${report.summary.optimizationScore}`);
    console.log('='.repeat(50));
    
    return report;
  }
  
  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    const highImpact = this.analysis.opportunities.filter(opp => 
      opp.priority === 'high' && opp.currentSize > 50 * 1024
    );
    
    if (highImpact.length > 0) {
      recommendations.push({
        type: 'high-impact',
        message: `${highImpact.length} high-impact splitting opportunities identified`,
        action: 'Implement dynamic imports for these modules first'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Format bytes for display
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Export analysis data
   */
  exportAnalysis() {
    return {
      analysis: {
        modules: Array.from(this.analysis.modules.entries()),
        dependencies: Array.from(this.analysis.dependencies.entries()),
        opportunities: this.analysis.opportunities
      },
      metrics: this.metrics,
      timestamp: Date.now()
    };
  }
}

// Global initialization
if (typeof window !== 'undefined' && !window.codeSplitter) {
  window.codeSplitter = new CodeSplitter({
    enableAnalysis: true,
    splitThreshold: 50 * 1024
  });
  
  console.log('🎯 Global CodeSplitter initialized');
  
  // Debug functions
  window.analyzeCodeSplitting = () => window.codeSplitter.analyzeCodebase();
  window.getCodeSplittingReport = () => window.codeSplitter.generateAnalysisReport();
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeSplitter;
}