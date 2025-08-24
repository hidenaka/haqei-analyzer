/**
 * ChunkLoader.js - Data Chunking and Lazy Loading System
 * 
 * Phase 2 Optimization: Split large data files into smaller chunks
 * Load data progressively to reduce initial bundle size
 * 
 * Target: Reduce H384_DATABASE.js (296KB) and hexagram_details.js (204KB) impact
 */

class ChunkLoader {
  constructor(options = {}) {
    this.options = {
      chunkSize: 64 * 1024, // 64KB per chunk
      enableCaching: true,
      enablePrefetch: true,
      enableCompression: false, // Browser handles gzip
      maxConcurrentLoads: 3,
      ...options
    };
    
    // Chunk management
    this.chunks = new Map();
    this.loadingChunks = new Set();
    this.loadQueue = [];
    this.cache = new Map();
    
    // Data registry
    this.dataRegistry = {
      hexagrams: {
        totalChunks: 8,
        chunkSize: 8, // 8 hexagrams per chunk
        loadedChunks: new Set(),
        baseUrl: '/js/data/chunks/'
      },
      h384: {
        totalChunks: 6,
        chunkSize: 64, // 64 lines per chunk
        loadedChunks: new Set(),
        baseUrl: '/js/data/h384-chunks/'
      },
      compatibility: {
        totalChunks: 4,
        chunkSize: 16, // 16 hexagram compatibility files per chunk
        loadedChunks: new Set(),
        baseUrl: '/js/data/compatibility/chunks/'
      }
    };
    
    // Performance tracking
    this.stats = {
      chunksLoaded: 0,
      totalLoadTime: 0,
      cacheHits: 0,
      bytesLoaded: 0,
      averageChunkSize: 0
    };
    
    console.log('🧩 ChunkLoader initialized - Data chunking system ready');
  }
  
  /**
   * Load specific data chunks on demand
   */
  async loadChunks(dataType, indices = []) {
    if (!this.dataRegistry[dataType]) {
      throw new Error(`Unknown data type: ${dataType}`);
    }
    
    const registry = this.dataRegistry[dataType];
    const startTime = performance.now();
    
    console.log(`🧩 Loading ${dataType} chunks:`, indices);
    
    try {
      // Load chunks in parallel with concurrency limit
      const chunkPromises = indices.map(index => this.loadChunk(dataType, index));
      const results = await this.limitConcurrency(chunkPromises, this.options.maxConcurrentLoads);
      
      const loadTime = performance.now() - startTime;
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
   * Fetch and parse a chunk
   */
  async fetchChunk(url) {
    try {
      // Try dynamic import first (for ES6 modules)
      const module = await import(url);
      return module.default || module;
      
    } catch (importError) {
      // Fallback to fetch for JSON or other formats
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          // Assume JavaScript module as text
          const text = await response.text();
          return this.parseJavaScriptChunk(text);
        }
        
      } catch (fetchError) {
        console.error(`Failed to fetch chunk: ${url}`, fetchError);
        throw fetchError;
      }
    }
  }
  
  /**
   * Parse JavaScript chunk from text
   */
  parseJavaScriptChunk(text) {
    try {
      // Create a safe evaluation context
      const sandbox = {
        data: null,
        module: { exports: {} },
        exports: {}
      };
      
      // Execute the chunk code in sandbox
      const func = new Function('module', 'exports', 'data', text + '; return data || module.exports || exports;');
      const result = func(sandbox.module, sandbox.exports, sandbox.data);
      
      return result;
      
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
   * Prefetch chunks based on usage patterns
   */
  async prefetchChunks(dataType, priority = 'normal') {
    if (!this.options.enablePrefetch) return;
    
    const registry = this.dataRegistry[dataType];
    const unloadedChunks = [];
    
    for (let i = 0; i < registry.totalChunks; i++) {
      if (!registry.loadedChunks.has(i)) {
        unloadedChunks.push(i);
      }
    }
    
    if (unloadedChunks.length === 0) return;
    
    console.log(`🔄 Prefetching ${dataType} chunks:`, unloadedChunks.slice(0, 3));
    
    // Prefetch up to 3 chunks at a time
    const toPrefetch = unloadedChunks.slice(0, 3);
    
    // Use requestIdleCallback if available for non-urgent prefetching
    if (priority === 'low' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadChunks(dataType, toPrefetch).catch(error => {
          console.warn('Prefetch failed:', error);
        });
      });
    } else {
      // Load immediately for normal/high priority
      setTimeout(() => {
        this.loadChunks(dataType, toPrefetch).catch(error => {
          console.warn('Prefetch failed:', error);
        });
      }, priority === 'high' ? 100 : 1000);
    }
  }
  
  /**
   * Get hexagrams by range (with chunking)
   */
  async getHexagrams(start = 1, end = 64) {
    const chunkSize = this.dataRegistry.hexagrams.chunkSize;
    const startChunk = Math.floor((start - 1) / chunkSize);
    const endChunk = Math.floor((end - 1) / chunkSize);
    
    const chunksNeeded = [];
    for (let i = startChunk; i <= endChunk; i++) {
      chunksNeeded.push(i);
    }
    
    const chunks = await this.loadChunks('hexagrams', chunksNeeded);
    
    // Combine chunks and filter by range
    const allHexagrams = chunks.flat();
    return allHexagrams.filter(h => h.hexagram_id >= start && h.hexagram_id <= end);
  }
  
  /**
   * Get H384 lines by hexagram ID
   */
  async getH384Lines(hexagramId) {
    const linesPerHexagram = 6;
    const startLine = (hexagramId - 1) * linesPerHexagram;
    const endLine = startLine + linesPerHexagram - 1;
    
    const chunkSize = this.dataRegistry.h384.chunkSize;
    const startChunk = Math.floor(startLine / chunkSize);
    const endChunk = Math.floor(endLine / chunkSize);
    
    const chunksNeeded = [];
    for (let i = startChunk; i <= endChunk; i++) {
      chunksNeeded.push(i);
    }
    
    const chunks = await this.loadChunks('h384', chunksNeeded);
    
    // Combine chunks and filter by hexagram
    const allLines = chunks.flat();
    return allLines.filter(line => {
      const lineHexagramId = Math.floor((line.lineId - 1) / 6) + 1;
      return lineHexagramId === hexagramId;
    });
  }
  
  /**
   * Get compatibility data for hexagram pair
   */
  async getCompatibility(hexagram1, hexagram2) {
    const chunkIndex = Math.floor((hexagram1 - 1) / 16);
    const chunks = await this.loadChunks('compatibility', [chunkIndex]);
    
    const compatibilityData = chunks[0];
    const key = `${hexagram1}_${hexagram2}`;
    
    return compatibilityData[key] || null;
  }
  
  /**
   * Intelligent preloading based on user context
   */
  predictiveLoad(context) {
    const predictions = {
      'welcome': ['hexagrams'], // Load first few hexagrams
      'questions': ['hexagrams', 'h384'], // Prepare for analysis
      'analysis': ['h384', 'compatibility'], // Load analysis data
      'results': ['compatibility'] // Load relationship data
    };
    
    const toPrefetch = predictions[context] || [];
    
    toPrefetch.forEach(dataType => {
      this.prefetchChunks(dataType, 'low');
    });
  }
  
  /**
   * Memory cleanup - remove old chunks
   */
  cleanup() {
    const maxCacheSize = 50; // Keep max 50 chunks in memory
    
    if (this.cache.size <= maxCacheSize) return;
    
    // Remove oldest cached chunks (simple LRU)
    const entries = Array.from(this.cache.entries());
    const toRemove = entries.slice(0, entries.length - maxCacheSize);
    
    toRemove.forEach(([chunkId]) => {
      this.cache.delete(chunkId);
      console.log(`🧹 Cleaned up chunk: ${chunkId}`);
    });
    
    console.log(`🧹 Cleaned up ${toRemove.length} cached chunks`);
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
    
    this.stats.averageChunkSize = this.stats.bytesLoaded / this.stats.chunksLoaded;
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
      cachedChunks: this.cache.size
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
   * Debug information
   */
  debugInfo() {
    console.log('🧩 ChunkLoader Debug Info:');
    console.log('Registry:', this.dataRegistry);
    console.log('Cache size:', this.cache.size);
    console.log('Loading chunks:', Array.from(this.loadingChunks));
    console.log('Statistics:', this.getStats());
  }
}

// Global initialization
if (!window.chunkLoader) {
  window.chunkLoader = new ChunkLoader({
    enableCaching: true,
    enablePrefetch: true,
    maxConcurrentLoads: 3
  });
  
  console.log('🎯 Global ChunkLoader initialized for data optimization');
  
  // Debug functions
  window.getChunkStats = () => window.chunkLoader.getStats();
  window.debugChunkLoader = () => window.chunkLoader.debugInfo();
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChunkLoader;
}
