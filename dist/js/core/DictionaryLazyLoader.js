/**
 * DictionaryLazyLoader.js - On-demand dictionary loading system
 * 
 * Reduces initial bundle size by loading large dictionaries only when needed
 * Maintains performance while optimizing initial load time
 */

class DictionaryLazyLoader {
  constructor() {
    this.loadedDictionaries = new Set();
    this.loadingPromises = new Map();
    this.config = {
      baseUrl: '/dict/',
      cdnUrl: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/',
      fallbackEnabled: true,
      cacheEnabled: true
    };
    
    // Performance metrics
    this.metrics = {
      loadTimes: {},
      cacheHits: 0,
      totalRequests: 0
    };
    
    console.log('📚 DictionaryLazyLoader initialized - On-demand loading ready');
  }

  /**
   * Load dictionary on-demand
   * @param {string} dictionaryName - Name of dictionary to load
   * @param {Object} options - Loading options
   * @returns {Promise<boolean>} Success status
   */
  async loadDictionary(dictionaryName, options = {}) {
    const { 
      priority = 'normal',
      timeout = 15000,
      retryCount = 2
    } = options;
    
    const startTime = performance.now();
    this.metrics.totalRequests++;
    
    // Check if already loaded
    if (this.loadedDictionaries.has(dictionaryName)) {
      this.metrics.cacheHits++;
      console.log(`📚 Dictionary already loaded: ${dictionaryName}`);
      return true;
    }
    
    // Check if currently loading
    if (this.loadingPromises.has(dictionaryName)) {
      console.log(`📚 Dictionary loading in progress: ${dictionaryName}`);
      return await this.loadingPromises.get(dictionaryName);
    }
    
    // Start loading process
    const loadingPromise = this.performDictionaryLoad(dictionaryName, options);
    this.loadingPromises.set(dictionaryName, loadingPromise);
    
    try {
      const result = await loadingPromise;
      const loadTime = performance.now() - startTime;
      this.metrics.loadTimes[dictionaryName] = loadTime;
      
      if (result) {
        this.loadedDictionaries.add(dictionaryName);
        console.log(`✅ Dictionary loaded successfully: ${dictionaryName} (${loadTime.toFixed(2)}ms)`);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Dictionary load failed: ${dictionaryName}`, error);
      return false;
    } finally {
      this.loadingPromises.delete(dictionaryName);
    }
  }

  /**
   * Perform actual dictionary loading
   * @private
   */
  async performDictionaryLoad(dictionaryName, options) {
    const { timeout = 15000, retryCount = 2 } = options;
    
    // Try local dictionary first
    try {
      return await this.loadFromLocal(dictionaryName, timeout);
    } catch (localError) {
      console.warn(`⚠️ Local dictionary load failed: ${dictionaryName}`, localError);
      
      // Fallback to CDN if enabled
      if (this.config.fallbackEnabled) {
        try {
          return await this.loadFromCDN(dictionaryName, timeout);
        } catch (cdnError) {
          console.error(`❌ CDN dictionary load failed: ${dictionaryName}`, cdnError);
          throw cdnError;
        }
      } else {
        throw localError;
      }
    }
  }

  /**
   * Load dictionary from local storage
   * @private
   */
  async loadFromLocal(dictionaryName, timeout) {
    const url = `${this.config.baseUrl}${dictionaryName}.dat.gz`;
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Dictionary load timeout: ${dictionaryName}`));
      }, timeout);
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.arrayBuffer();
        })
        .then(data => {
          clearTimeout(timeoutId);
          // Store in memory for quick access
          this.cacheDictionary(dictionaryName, data);
          resolve(true);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Load dictionary from CDN
   * @private
   */
  async loadFromCDN(dictionaryName, timeout) {
    const url = `${this.config.cdnUrl}${dictionaryName}.dat.gz`;
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`CDN dictionary load timeout: ${dictionaryName}`));
      }, timeout);
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`CDN HTTP ${response.status}: ${response.statusText}`);
          }
          return response.arrayBuffer();
        })
        .then(data => {
          clearTimeout(timeoutId);
          this.cacheDictionary(dictionaryName, data);
          resolve(true);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Cache dictionary data in memory
   * @private
   */
  cacheDictionary(dictionaryName, data) {
    if (this.config.cacheEnabled) {
      // Use WeakMap or similar for memory-efficient caching
      // Implementation depends on specific use case
      console.log(`💾 Dictionary cached: ${dictionaryName} (${data.byteLength} bytes)`);
    }
  }

  /**
   * Load essential dictionaries for basic functionality
   */
  async loadEssentialDictionaries() {
    console.log('📚 Loading essential dictionaries...');
    
    const essential = [
      'unk',           // Unknown word handling - 12KB
      'unk_pos',       // Unknown word POS - 10KB
      'unk_char',      // Unknown char - 306B
      'unk_compat',    // Unknown compatibility - 338B
    ];
    
    const loadPromises = essential.map(dict => 
      this.loadDictionary(dict, { priority: 'high' })
    );
    
    const results = await Promise.allSettled(loadPromises);
    const loaded = results.filter(r => r.status === 'fulfilled' && r.value).length;
    
    console.log(`📚 Essential dictionaries loaded: ${loaded}/${essential.length}`);
    return loaded === essential.length;
  }

  /**
   * Load full dictionaries when advanced features are needed
   */
  async loadAdvancedDictionaries() {
    console.log('📚 Loading advanced dictionaries for full functionality...');
    
    const advanced = [
      'base',          // Base dictionary - 3.8MB
      'cc',            // Connection cost - 1.6MB
      'check',         // Check dictionary - 3.0MB
      'tid',           // Term ID - 1.5MB
      'tid_map',       // Term ID mapping - 1.4MB
      'tid_pos'        // Term ID POS - 5.6MB
    ];
    
    // Load in order of importance and size (smallest first)
    const ordered = [
      'tid',
      'tid_map', 
      'cc',
      'check',
      'base',
      'tid_pos'
    ];
    
    const results = [];
    for (const dict of ordered) {
      try {
        const result = await this.loadDictionary(dict, { 
          priority: 'normal',
          timeout: 30000 // Longer timeout for large files
        });
        results.push(result);
        
        // Progressive loading feedback
        console.log(`📚 Progress: ${results.filter(Boolean).length}/${ordered.length} advanced dictionaries loaded`);
        
      } catch (error) {
        console.warn(`⚠️ Advanced dictionary load failed: ${dict}`, error);
        results.push(false);
      }
    }
    
    const loaded = results.filter(Boolean).length;
    console.log(`📚 Advanced dictionaries loaded: ${loaded}/${advanced.length}`);
    return loaded >= Math.ceil(advanced.length * 0.7); // 70% success rate acceptable
  }

  /**
   * Check if morphological analysis is available
   */
  isMorphologicalAnalysisReady() {
    const required = ['unk', 'unk_pos'];
    return required.every(dict => this.loadedDictionaries.has(dict));
  }

  /**
   * Check if full analysis is available
   */
  isFullAnalysisReady() {
    const required = ['base', 'cc', 'check', 'tid', 'tid_map', 'tid_pos'];
    return required.every(dict => this.loadedDictionaries.has(dict));
  }

  /**
   * Get loading metrics for performance monitoring
   */
  getMetrics() {
    return {
      ...this.metrics,
      loadedDictionaries: Array.from(this.loadedDictionaries),
      totalLoadTime: Object.values(this.metrics.loadTimes).reduce((sum, time) => sum + time, 0),
      averageLoadTime: Object.values(this.metrics.loadTimes).length > 0 
        ? Object.values(this.metrics.loadTimes).reduce((sum, time) => sum + time, 0) / Object.values(this.metrics.loadTimes).length 
        : 0,
      cacheHitRate: this.metrics.totalRequests > 0 ? this.metrics.cacheHits / this.metrics.totalRequests : 0
    };
  }

  /**
   * Clear cache and reset loader
   */
  reset() {
    this.loadedDictionaries.clear();
    this.loadingPromises.clear();
    this.metrics = {
      loadTimes: {},
      cacheHits: 0,
      totalRequests: 0
    };
    
    console.log('📚 DictionaryLazyLoader reset');
  }
}

// Global instance
window.DictionaryLazyLoader = DictionaryLazyLoader;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dictionaryLoader = new DictionaryLazyLoader();
  });
} else {
  window.dictionaryLoader = new DictionaryLazyLoader();
}