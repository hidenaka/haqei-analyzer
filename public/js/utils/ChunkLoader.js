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
      
    } catch (error) {\n      console.error(`❌ Failed to load ${dataType} chunks:`, error);\n      throw error;\n    }\n  }\n  \n  /**\n   * Load a single chunk\n   */\n  async loadChunk(dataType, index) {\n    const registry = this.dataRegistry[dataType];\n    const chunkId = `${dataType}_${index}`;\n    \n    // Check cache first\n    if (this.options.enableCaching && this.cache.has(chunkId)) {\n      this.stats.cacheHits++;\n      console.log(`📦 Chunk loaded from cache: ${chunkId}`);\n      return this.cache.get(chunkId);\n    }\n    \n    // Check if already loading\n    if (this.loadingChunks.has(chunkId)) {\n      return new Promise((resolve, reject) => {\n        const checkLoaded = () => {\n          if (this.cache.has(chunkId)) {\n            resolve(this.cache.get(chunkId));\n          } else if (!this.loadingChunks.has(chunkId)) {\n            reject(new Error(`Chunk loading failed: ${chunkId}`));\n          } else {\n            setTimeout(checkLoaded, 50);\n          }\n        };\n        checkLoaded();\n      });\n    }\n    \n    this.loadingChunks.add(chunkId);\n    \n    try {\n      const chunkUrl = this.getChunkUrl(dataType, index);\n      const chunk = await this.fetchChunk(chunkUrl);\n      \n      // Cache the chunk\n      if (this.options.enableCaching) {\n        this.cache.set(chunkId, chunk);\n      }\n      \n      registry.loadedChunks.add(index);\n      this.stats.chunksLoaded++;\n      \n      return chunk;\n      \n    } finally {\n      this.loadingChunks.delete(chunkId);\n    }\n  }\n  \n  /**\n   * Get chunk URL based on type and index\n   */\n  getChunkUrl(dataType, index) {\n    const registry = this.dataRegistry[dataType];\n    return `${registry.baseUrl}${dataType}_chunk_${index}.js`;\n  }\n  \n  /**\n   * Fetch and parse a chunk\n   */\n  async fetchChunk(url) {\n    try {\n      // Try dynamic import first (for ES6 modules)\n      const module = await import(url);\n      return module.default || module;\n      \n    } catch (importError) {\n      // Fallback to fetch for JSON or other formats\n      try {\n        const response = await fetch(url);\n        if (!response.ok) {\n          throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n        }\n        \n        const contentType = response.headers.get('content-type');\n        if (contentType && contentType.includes('application/json')) {\n          return await response.json();\n        } else {\n          // Assume JavaScript module as text\n          const text = await response.text();\n          return this.parseJavaScriptChunk(text);\n        }\n        \n      } catch (fetchError) {\n        console.error(`Failed to fetch chunk: ${url}`, fetchError);\n        throw fetchError;\n      }\n    }\n  }\n  \n  /**\n   * Parse JavaScript chunk from text\n   */\n  parseJavaScriptChunk(text) {\n    try {\n      // Create a safe evaluation context\n      const sandbox = {\n        data: null,\n        module: { exports: {} },\n        exports: {}\n      };\n      \n      // Execute the chunk code in sandbox\n      const func = new Function('module', 'exports', 'data', text + '; return data || module.exports || exports;');\n      const result = func(sandbox.module, sandbox.exports, sandbox.data);\n      \n      return result;\n      \n    } catch (error) {\n      console.error('Failed to parse JavaScript chunk:', error);\n      throw error;\n    }\n  }\n  \n  /**\n   * Limit concurrent loading\n   */\n  async limitConcurrency(promises, limit) {\n    const results = [];\n    const executing = [];\n    \n    for (const promise of promises) {\n      const p = Promise.resolve(promise).then(result => {\n        executing.splice(executing.indexOf(p), 1);\n        return result;\n      });\n      \n      results.push(p);\n      executing.push(p);\n      \n      if (executing.length >= limit) {\n        await Promise.race(executing);\n      }\n    }\n    \n    return Promise.all(results);\n  }\n  \n  /**\n   * Prefetch chunks based on usage patterns\n   */\n  async prefetchChunks(dataType, priority = 'normal') {\n    if (!this.options.enablePrefetch) return;\n    \n    const registry = this.dataRegistry[dataType];\n    const unloadedChunks = [];\n    \n    for (let i = 0; i < registry.totalChunks; i++) {\n      if (!registry.loadedChunks.has(i)) {\n        unloadedChunks.push(i);\n      }\n    }\n    \n    if (unloadedChunks.length === 0) return;\n    \n    console.log(`🔄 Prefetching ${dataType} chunks:`, unloadedChunks.slice(0, 3));\n    \n    // Prefetch up to 3 chunks at a time\n    const toPrefetch = unloadedChunks.slice(0, 3);\n    \n    // Use requestIdleCallback if available for non-urgent prefetching\n    if (priority === 'low' && 'requestIdleCallback' in window) {\n      requestIdleCallback(() => {\n        this.loadChunks(dataType, toPrefetch).catch(error => {\n          console.warn('Prefetch failed:', error);\n        });\n      });\n    } else {\n      // Load immediately for normal/high priority\n      setTimeout(() => {\n        this.loadChunks(dataType, toPrefetch).catch(error => {\n          console.warn('Prefetch failed:', error);\n        });\n      }, priority === 'high' ? 100 : 1000);\n    }\n  }\n  \n  /**\n   * Get hexagrams by range (with chunking)\n   */\n  async getHexagrams(start = 1, end = 64) {\n    const chunkSize = this.dataRegistry.hexagrams.chunkSize;\n    const startChunk = Math.floor((start - 1) / chunkSize);\n    const endChunk = Math.floor((end - 1) / chunkSize);\n    \n    const chunksNeeded = [];\n    for (let i = startChunk; i <= endChunk; i++) {\n      chunksNeeded.push(i);\n    }\n    \n    const chunks = await this.loadChunks('hexagrams', chunksNeeded);\n    \n    // Combine chunks and filter by range\n    const allHexagrams = chunks.flat();\n    return allHexagrams.filter(h => h.hexagram_id >= start && h.hexagram_id <= end);\n  }\n  \n  /**\n   * Get H384 lines by hexagram ID\n   */\n  async getH384Lines(hexagramId) {\n    const linesPerHexagram = 6;\n    const startLine = (hexagramId - 1) * linesPerHexagram;\n    const endLine = startLine + linesPerHexagram - 1;\n    \n    const chunkSize = this.dataRegistry.h384.chunkSize;\n    const startChunk = Math.floor(startLine / chunkSize);\n    const endChunk = Math.floor(endLine / chunkSize);\n    \n    const chunksNeeded = [];\n    for (let i = startChunk; i <= endChunk; i++) {\n      chunksNeeded.push(i);\n    }\n    \n    const chunks = await this.loadChunks('h384', chunksNeeded);\n    \n    // Combine chunks and filter by hexagram\n    const allLines = chunks.flat();\n    return allLines.filter(line => {\n      const lineHexagramId = Math.floor((line.lineId - 1) / 6) + 1;\n      return lineHexagramId === hexagramId;\n    });\n  }\n  \n  /**\n   * Get compatibility data for hexagram pair\n   */\n  async getCompatibility(hexagram1, hexagram2) {\n    const chunkIndex = Math.floor((hexagram1 - 1) / 16);\n    const chunks = await this.loadChunks('compatibility', [chunkIndex]);\n    \n    const compatibilityData = chunks[0];\n    const key = `${hexagram1}_${hexagram2}`;\n    \n    return compatibilityData[key] || null;\n  }\n  \n  /**\n   * Intelligent preloading based on user context\n   */\n  predictiveLoad(context) {\n    const predictions = {\n      'welcome': ['hexagrams'], // Load first few hexagrams\n      'questions': ['hexagrams', 'h384'], // Prepare for analysis\n      'analysis': ['h384', 'compatibility'], // Load analysis data\n      'results': ['compatibility'] // Load relationship data\n    };\n    \n    const toPrefetch = predictions[context] || [];\n    \n    toPrefetch.forEach(dataType => {\n      this.prefetchChunks(dataType, 'low');\n    });\n  }\n  \n  /**\n   * Memory cleanup - remove old chunks\n   */\n  cleanup() {\n    const maxCacheSize = 50; // Keep max 50 chunks in memory\n    \n    if (this.cache.size <= maxCacheSize) return;\n    \n    // Remove oldest cached chunks (simple LRU)\n    const entries = Array.from(this.cache.entries());\n    const toRemove = entries.slice(0, entries.length - maxCacheSize);\n    \n    toRemove.forEach(([chunkId]) => {\n      this.cache.delete(chunkId);\n      console.log(`🧹 Cleaned up chunk: ${chunkId}`);\n    });\n    \n    console.log(`🧹 Cleaned up ${toRemove.length} cached chunks`);\n  }\n  \n  /**\n   * Update performance statistics\n   */\n  updateStats(results, loadTime) {\n    this.stats.totalLoadTime += loadTime;\n    \n    results.forEach(result => {\n      if (result) {\n        const size = JSON.stringify(result).length;\n        this.stats.bytesLoaded += size;\n      }\n    });\n    \n    this.stats.averageChunkSize = this.stats.bytesLoaded / this.stats.chunksLoaded;\n  }\n  \n  /**\n   * Get performance statistics\n   */\n  getStats() {\n    return {\n      ...this.stats,\n      cacheHitRatio: this.stats.chunksLoaded > 0 ? \n        (this.stats.cacheHits / this.stats.chunksLoaded * 100).toFixed(1) + '%' : '0%',\n      averageLoadTime: this.stats.chunksLoaded > 0 ? \n        (this.stats.totalLoadTime / this.stats.chunksLoaded).toFixed(0) + 'ms' : '0ms',\n      memoryUsage: this.formatBytes(this.stats.bytesLoaded),\n      cachedChunks: this.cache.size\n    };\n  }\n  \n  /**\n   * Format bytes for display\n   */\n  formatBytes(bytes) {\n    if (bytes === 0) return '0 B';\n    const k = 1024;\n    const sizes = ['B', 'KB', 'MB'];\n    const i = Math.floor(Math.log(bytes) / Math.log(k));\n    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];\n  }\n  \n  /**\n   * Debug information\n   */\n  debugInfo() {\n    console.log('🧩 ChunkLoader Debug Info:');\n    console.log('Registry:', this.dataRegistry);\n    console.log('Cache size:', this.cache.size);\n    console.log('Loading chunks:', Array.from(this.loadingChunks));\n    console.log('Statistics:', this.getStats());\n  }\n}\n\n// Global initialization\nif (!window.chunkLoader) {\n  window.chunkLoader = new ChunkLoader({\n    enableCaching: true,\n    enablePrefetch: true,\n    maxConcurrentLoads: 3\n  });\n  \n  console.log('🎯 Global ChunkLoader initialized for data optimization');\n  \n  // Debug functions\n  window.getChunkStats = () => window.chunkLoader.getStats();\n  window.debugChunkLoader = () => window.chunkLoader.debugInfo();\n}\n\n// Export for ES6 modules\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = ChunkLoader;\n}\n