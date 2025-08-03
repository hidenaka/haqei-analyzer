/**
 * Service Worker for HAQEI Vue3 Application
 * Performance Optimization & Caching Strategy
 * 
 * bunenjin Philosophy: Fast, Reliable, Privacy-First
 */

const CACHE_NAME = 'haqei-vue3-v1.0.0'
const STATIC_CACHE_NAME = 'haqei-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'haqei-dynamic-v1.0.0'

// Cache URLs for static assets
const STATIC_URLS = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.json'
]

// Cache patterns for dynamic content
const CACHE_PATTERNS = {
  // API responses (short-term cache)
  api: /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
  // Static assets (long-term cache)
  assets: /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
  // IndexedDB resources
  idb: /indexeddb/
}

// Performance optimization settings
const PERFORMANCE_CONFIG = {
  maxCacheSize: 50 * 1024 * 1024, // 50MB
  maxCacheEntries: 100,
  staleWhileRevalidate: 24 * 60 * 60 * 1000, // 24 hours
  networkTimeoutMs: 3000 // 3 seconds
}

/**
 * Install event - Cache static resources
 */
self.addEventListener('install', event => {
  console.log('🔧 SW: Installing...')
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('📦 SW: Caching static resources')
        return cache.addAll(STATIC_URLS)
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

/**
 * Activate event - Clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('⚡ SW: Activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('haqei-') && 
              ![CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cacheName)
            )
            .map(cacheName => {
              console.log('🗑️ SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  )
})

/**
 * Fetch event - Smart caching strategy
 */
self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  event.respondWith(handleFetch(request))
})

/**
 * Smart fetch handling with multiple strategies
 */
async function handleFetch(request) {
  const url = new URL(request.url)
  
  try {
    // Strategy 1: Static assets - Cache First
    if (CACHE_PATTERNS.assets.test(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE_NAME)
    }
    
    // Strategy 2: API calls - Network First with fallback
    if (CACHE_PATTERNS.api.test(url.href)) {
      return await networkFirstWithTimeout(request, DYNAMIC_CACHE_NAME)
    }
    
    // Strategy 3: HTML - Stale While Revalidate
    if (request.destination === 'document') {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME)
    }
    
    // Strategy 4: Default - Network First
    return await networkFirst(request, DYNAMIC_CACHE_NAME)
    
  } catch (error) {
    console.error('🚨 SW: Fetch failed:', error)
    
    // Fallback to offline page for navigation requests
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/index.html')
      return offlineResponse || new Response('Offline', { status: 503 })
    }
    
    // For other requests, return error
    return new Response('Network Error', { status: 503 })
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  const networkResponse = await fetch(request)
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}

/**
 * Network First Strategy
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

/**
 * Network First with Timeout Strategy
 */
async function networkFirstWithTimeout(request, cacheName) {
  const cache = await caches.open(cacheName)
  
  try {
    // Race between network and timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), PERFORMANCE_CONFIG.networkTimeoutMs)
      )
    ])
    
    if (networkResponse.ok) {
      // Clean cache if it's getting too large
      await cleanCacheIfNeeded(cache)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.warn('🕰️ SW: Network timeout or error, falling back to cache')
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Always try to fetch and update cache in background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  })
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Don't wait for fetch promise
    fetchPromise.catch(error => {
      console.warn('🔄 SW: Background fetch failed:', error)
    })
    return cachedResponse
  }
  
  // If no cache, wait for network
  return await fetchPromise
}

/**
 * Clean cache if it exceeds size or entry limits
 */
async function cleanCacheIfNeeded(cache) {
  const keys = await cache.keys()
  
  if (keys.length > PERFORMANCE_CONFIG.maxCacheEntries) {
    console.log('🧹 SW: Cleaning cache - too many entries')
    // Delete oldest entries (first 10%)
    const deleteCount = Math.floor(keys.length * 0.1)
    const deletePromises = keys.slice(0, deleteCount).map(key => cache.delete(key))
    await Promise.all(deletePromises)
  }
}

/**
 * Background sync for failed API calls
 */
self.addEventListener('sync', event => {
  if (event.tag === 'haqei-sync') {
    console.log('🔄 SW: Background sync triggered')
    event.waitUntil(handleBackgroundSync())
  }
})

/**
 * Handle background sync
 */
async function handleBackgroundSync() {
  // Implementation for retrying failed API calls
  console.log('🔄 SW: Processing background sync')
  
  // This could include:
  // - Retry failed analysis submissions
  // - Sync offline changes
  // - Update cached data
}

/**
 * Message handling for client communication
 */
self.addEventListener('message', event => {
  const { type, data } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info)
      })
      break
      
    default:
      console.warn('🤷 SW: Unknown message type:', type)
  }
})

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name.startsWith('haqei-'))
      .map(name => caches.delete(name))
  )
  console.log('🗑️ SW: All caches cleared')
}

/**
 * Get cache information
 */
async function getCacheInfo() {
  const cacheNames = await caches.keys()
  const info = await Promise.all(
    cacheNames
      .filter(name => name.startsWith('haqei-'))
      .map(async name => {
        const cache = await caches.open(name)
        const keys = await cache.keys()
        return { name, entryCount: keys.length }
      })
  )
  
  return { caches: info, timestamp: Date.now() }
}

/**
 * Performance monitoring
 */
self.addEventListener('fetch', event => {
  // Track performance metrics
  const startTime = performance.now()
  
  event.respondWith(
    handleFetch(event.request).then(response => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Log slow requests in development
      if (duration > 1000) {
        console.warn(`🐌 SW: Slow request (${duration.toFixed(2)}ms):`, event.request.url)
      }
      
      return response
    })
  )
})

console.log('✅ SW: Service Worker loaded successfully')