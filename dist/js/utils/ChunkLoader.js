/**
 * ChunkLoader - Phase 2 Data Management System
 * Handles efficient loading and caching of HAQEI data chunks
 * @version 2.0.0
 * @author HAQEI Development Team
 */

class ChunkLoader {
  constructor(options = {}) {
    this.options = {
      enableCaching: options.enableCaching !== false,
      enablePrefetch: options.enablePrefetch !== false,
      maxConcurrentLoads: options.maxConcurrentLoads || 3,
      chunkTimeout: options.chunkTimeout || 10000,
      retryAttempts: options.retryAttempts || 2,
      ...options
    };

    this.cache = new Map();
    this.loadingChunks = new Set();
    this.stats = {
      chunksLoaded: 0,
      cacheHits: 0,
      loadErrors: 0,
      totalLoadTime: 0,
      bytesLoaded: 0,
      averageChunkSize: 0
    };

    this.dataRegistry = {
      hexagrams: {
        baseUrl: '/data/chunks/',
        chunkSize: 16,
        totalChunks: 4,
        loadedChunks: new Set()
      },
      h384: {
        baseUrl: '/data/chunks/',
        chunkSize: 64,
        totalChunks: 6,
        loadedChunks: new Set()
      },
      compatibility: {
        baseUrl: '/data/chunks/',
        chunkSize: 256,
        totalChunks: 16,
        loadedChunks: new Set()
      }
    };

    console.log('🧩 ChunkLoader Phase 2 initialized with advanced features');
    this.initializeLoader();
  }

  /**
   * Initialize the chunk loader system
   */
  initializeLoader() {
    this.detectDataAvailability();
    
    if (this.options.enablePrefetch) {
      this.setupPredictiveLoading();
    }
  }

  /**
   * Detect what data chunks are available
   */
  async detectDataAvailability() {
    console.log('🔍 Detecting available data chunks...');
    
    for (const [dataType, registry] of Object.entries(this.dataRegistry)) {
      try {
        const testUrl = `${registry.baseUrl}${dataType}_chunk_0.js`;
        const response = await fetch(testUrl, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`✅ ${dataType} chunks available`);
        } else {
          console.warn(`⚠️ ${dataType} chunks not found, using fallback`);
          registry.totalChunks = 0;
        }
      } catch (error) {
        console.warn(`⚠️ Could not verify ${dataType} chunks:`, error.message);
        registry.totalChunks = 0;
      }
    }
  }

  /**
   * Load multiple chunks concurrently
   */
  async loadChunks(dataType, chunkIndices) {
    const startTime = Date.now();
    const registry = this.dataRegistry[dataType];
    
    if (!registry) {
      throw new Error(`Unknown data type: ${dataType}`);
    }

    const promises = chunkIndices.map(index => this.loadChunk(dataType, index));
    
    try {
      const results = await this.limitConcurrency(promises, this.options.maxConcurrentLoads);
      const loadTime = Date.now() - startTime;
      
      this.updateStats(results, loadTime);
      
      console.log(`✅ Loaded ${results.length} ${dataType} chunks in ${loadTime.toFixed(0)}ms`);
      return results;
      
    } catch (error) {
      console.error(`❌ Failed to load ${dataType} chunks:`, error);
      throw error;
    }
  }
  
  /**
   * Load a single chunk
   */
  async loadChunk(dataType, index) {
    const registry = this.dataRegistry[dataType];
    const chunkId = `${dataType}_${index}`;
    
    // Check cache first
    if (this.options.enableCaching && this.cache.has(chunkId)) {
      this.stats.cacheHits++;
      console.log(`📦 Chunk loaded from cache: ${chunkId}`);
      return this.cache.get(chunkId);
    }
    
    // Check if already loading
    if (this.loadingChunks.has(chunkId)) {
      return new Promise((resolve, reject) => {
        const checkLoaded = () => {
          if (this.cache.has(chunkId)) {
            resolve(this.cache.get(chunkId));
          } else if (!this.loadingChunks.has(chunkId)) {
            reject(new Error(`Chunk loading failed: ${chunkId}`));
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }
    
    this.loadingChunks.add(chunkId);
    
    try {
      const chunkUrl = this.getChunkUrl(dataType, index);
      const chunk = await this.fetchChunk(chunkUrl);
      
      // Cache the chunk
      if (this.options.enableCaching) {
        this.cache.set(chunkId, chunk);
      }
      
      registry.loadedChunks.add(index);
      this.stats.chunksLoaded++;
      
      return chunk;
      
    } finally {
      this.loadingChunks.delete(chunkId);
    }
  }
  
  /**
   * Get chunk URL based on type and index
   */
  getChunkUrl(dataType, index) {
    const registry = this.dataRegistry[dataType];
    return `${registry.baseUrl}${dataType}_chunk_${index}.js`;
  }
  
  /**
   * Fetch and parse a chunk with retry logic
   */
  async fetchChunk(url, attempt = 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        return this.parseJavaScriptChunk(text);
      }
    } catch (error) {
      if (attempt < this.options.retryAttempts) {
        console.warn(`⚠️ Retry attempt ${attempt + 1} for ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.fetchChunk(url, attempt + 1);
      }
      
      console.error(`❌ Failed to fetch chunk after ${attempt} attempts: ${url}`, error);
      this.stats.loadErrors++;
      throw error;
    }
  }
  
  /**
   * Parse JavaScript chunk from text
   */
  parseJavaScriptChunk(text) {
    try {
      // Simple evaluation for data chunks
      const func = new Function('', `return ${text}`);
      return func();
    } catch (error) {
      console.error('Failed to parse JavaScript chunk:', error);
      throw error;
    }
  }
  
  /**
   * Limit concurrent loading
   */
  async limitConcurrency(promises, limit) {
    const results = [];
    const executing = [];
    
    for (const promise of promises) {
      const p = Promise.resolve(promise).then(result => {
        executing.splice(executing.indexOf(p), 1);
        return result;
      });
      
      results.push(p);
      executing.push(p);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
    
    return Promise.all(results);
  }
  
  /**
   * Setup predictive loading based on user patterns
   */
  setupPredictiveLoading() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.predictiveLoad('visibility');
        }
      });
    }
  }
  
  /**
   * Predictive loading based on context
   */
  predictiveLoad(context) {
    const predictions = {
      'welcome': ['hexagrams'],
      'questions': ['hexagrams', 'h384'],
      'analysis': ['h384', 'compatibility'],
      'results': ['compatibility'],
      'visibility': ['hexagrams']
    };
    
    const toPrefetch = predictions[context] || [];
    
    toPrefetch.forEach(dataType => {
      this.prefetchChunks(dataType);
    });
  }
  
  /**
   * Prefetch chunks in background
   */
  async prefetchChunks(dataType, maxChunks = 2) {
    if (!this.options.enablePrefetch) return;
    
    const registry = this.dataRegistry[dataType];
    if (!registry || registry.totalChunks === 0) return;
    
    const unloadedChunks = [];
    for (let i = 0; i < Math.min(registry.totalChunks, maxChunks); i++) {
      if (!registry.loadedChunks.has(i)) {
        unloadedChunks.push(i);
      }
    }
    
    if (unloadedChunks.length === 0) return;
    
    console.log(`🔄 Prefetching ${dataType} chunks:`, unloadedChunks);
    
    // Use requestIdleCallback if available
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        this.loadChunks(dataType, unloadedChunks).catch(error => {
          console.warn('Prefetch failed:', error);
        });
      });
    } else {
      setTimeout(() => {
        this.loadChunks(dataType, unloadedChunks).catch(error => {
          console.warn('Prefetch failed:', error);
        });
      }, 1000);
    }
  }
  
  /**
   * Get hexagrams by range
   */
  async getHexagrams(start = 1, end = 64) {
    const chunkSize = this.dataRegistry.hexagrams.chunkSize || 16;
    const startChunk = Math.floor((start - 1) / chunkSize);
    const endChunk = Math.floor((end - 1) / chunkSize);
    
    const chunksNeeded = [];
    for (let i = startChunk; i <= endChunk; i++) {
      chunksNeeded.push(i);
    }
    
    const chunks = await this.loadChunks('hexagrams', chunksNeeded);
    const allHexagrams = chunks.flat().filter(Boolean);
    return allHexagrams.filter(h => h && h.hexagram_id >= start && h.hexagram_id <= end);
  }
  
  /**
   * Get H384 lines by hexagram ID
   */
  async getH384Lines(hexagramId) {
    try {
      const chunkIndex = Math.floor((hexagramId - 1) / 16);
      const chunks = await this.loadChunks('h384', [chunkIndex]);
      
      const allLines = chunks.flat().filter(Boolean);
      return allLines.filter(line => {
        if (line && typeof line.lineId === 'number') {
          const lineHexagramId = Math.floor((line.lineId - 1) / 6) + 1;
          return lineHexagramId === hexagramId;
        }
        return false;
      });
    } catch (error) {
      console.error(`Failed to load H384 lines for hexagram ${hexagramId}:`, error);
      return [];
    }
  }
  
  /**
   * Update performance statistics
   */
  updateStats(results, loadTime) {
    this.stats.totalLoadTime += loadTime;
    
    results.forEach(result => {
      if (result) {
        const size = JSON.stringify(result).length;
        this.stats.bytesLoaded += size;
      }
    });
    
    this.stats.averageChunkSize = this.stats.chunksLoaded > 0 ? 
      this.stats.bytesLoaded / this.stats.chunksLoaded : 0;
  }
  
  /**
   * Get performance statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheHitRatio: this.stats.chunksLoaded > 0 ? 
        (this.stats.cacheHits / this.stats.chunksLoaded * 100).toFixed(1) + '%' : '0%',
      averageLoadTime: this.stats.chunksLoaded > 0 ? 
        (this.stats.totalLoadTime / this.stats.chunksLoaded).toFixed(0) + 'ms' : '0ms',
      memoryUsage: this.formatBytes(this.stats.bytesLoaded),
      cachedChunks: this.cache.size,
      errorRate: this.stats.chunksLoaded > 0 ?
        (this.stats.loadErrors / (this.stats.chunksLoaded + this.stats.loadErrors) * 100).toFixed(1) + '%' : '0%'
    };
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
   * Clear cache and reset statistics
   */
  reset() {
    this.cache.clear();
    this.loadingChunks.clear();
    
    // Reset loaded chunks tracking
    Object.values(this.dataRegistry).forEach(registry => {
      registry.loadedChunks.clear();
    });
    
    // Reset statistics
    this.stats = {
      chunksLoaded: 0,
      cacheHits: 0,
      loadErrors: 0,
      totalLoadTime: 0,
      bytesLoaded: 0,
      averageChunkSize: 0
    };
    
    console.log('🔄 ChunkLoader reset complete');
  }
  
  /**
   * Debug information
   */
  debugInfo() {
    console.log('🧩 ChunkLoader Debug Info:');
    console.log('Options:', this.options);
    console.log('Registry:', this.dataRegistry);
    console.log('Cache size:', this.cache.size);
    console.log('Loading chunks:', Array.from(this.loadingChunks));
    console.log('Statistics:', this.getStats());
  }
}

// Global initialization
if (typeof window !== 'undefined' && !window.chunkLoader) {
  window.chunkLoader = new ChunkLoader({
    enableCaching: true,
    enablePrefetch: true,
    maxConcurrentLoads: 3
  });
  
  console.log('🎯 Global ChunkLoader initialized for data optimization');
  
  // Debug functions for browser console
  window.getChunkStats = () => window.chunkLoader.getStats();
  window.debugChunkLoader = () => window.chunkLoader.debugInfo();
  window.resetChunkLoader = () => window.chunkLoader.reset();
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChunkLoader;
}