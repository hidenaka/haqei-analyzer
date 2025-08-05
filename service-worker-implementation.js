/**
 * HAQEI Analyzer Service Worker Implementation
 * 
 * Implements aggressive caching strategies for optimal performance:
 * - Static asset caching
 * - Dynamic content caching with stale-while-revalidate
 * - Offline fallbacks
 * - Performance monitoring integration
 */

const CACHE_NAME = 'haqei-analyzer-v1';
const STATIC_CACHE = 'haqei-static-v1';
const DYNAMIC_CACHE = 'haqei-dynamic-v1';
const DATA_CACHE = 'haqei-data-v1';

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
  '/',
  '/os_analyzer.html',
  '/css/core.css',
  '/css/components.css',
  '/css/layouts.css',
  '/js/app.js',
  '/js/shared/core/BaseComponent.js',
  '/js/shared/core/MicroStorageManager.js',
  '/js/shared/core/MicroDataManager.js',
  '/js/os-analyzer/components/WelcomeScreen.js'
];

// Assets to cache on first access
const CACHE_ON_ACCESS = [
  // CSS files
  '/css/interactive.css',
  '/css/results.css',
  '/css/responsive.css',
  '/css/themes.css',
  '/css/accessibility-wcag.css',
  
  // JavaScript modules
  '/js/os-analyzer/components/VirtualQuestionFlow-core.js',
  '/js/os-analyzer/components/VirtualQuestionFlow-renderer.js',
  '/js/os-analyzer/components/HaqeiQuestionElement.js',
  '/js/shared/core/StorageManager.js',
  '/js/shared/core/DataManager.js',
  
  // Font files
  '/fonts/',
  
  // Images and icons
  '/images/',
  '/icons/'
];

// Large data files - use special caching strategy
const DATA_FILES = [
  '/js/data/data_box.js',
  '/js/core/H384_DATABASE.js',
  '/js/data/hexagram_details.js',
  '/js/ai_theme_database.js',
  '/js/koudo_shishin_database.js'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/',
  '/results.html',
  '/analytics/'
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('📦 Caching critical assets...');
      return cache.addAll(CRITICAL_ASSETS);
    }).then(() => {
      console.log('✅ Critical assets cached successfully');
      return self.skipWaiting(); // Activate immediately
    }).catch(error => {
      console.error('❌ Failed to cache critical assets:', error);
    })
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    // Clean old caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== DATA_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim(); // Take control immediately
    })
  );
});

/**
 * Fetch Event Handler
 */
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different resource types
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isDataFile(url.pathname)) {
    event.respondWith(handleDataFile(request));
  } else if (isNetworkFirst(url.pathname)) {
    event.respondWith(handleNetworkFirst(request));
  } else {
    event.respondWith(handleDefault(request));
  }
});

/**
 * Static Asset Handler - Cache First Strategy
 */
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 Serving from cache:', request.url);
      
      // Update cache in background for critical assets
      if (CRITICAL_ASSETS.some(asset => request.url.includes(asset))) {
        updateCacheInBackground(request, cache);
      }
      
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      console.log('💾 Cached new asset:', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Static asset fetch failed:', error);
    return createOfflineFallback(request);
  }
}

/**
 * Data File Handler - Stale While Revalidate Strategy
 */
async function handleDataFile(request) {
  try {
    const cache = await caches.open(DATA_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Always try to revalidate data files
    const networkPromise = fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        console.log('🔄 Updated data cache:', request.url);
      }
      return networkResponse;
    }).catch(error => {
      console.warn('⚠️ Network update failed for data file:', request.url, error);
      return null;
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
      console.log('📦 Serving stale data from cache:', request.url);
      // Don't await network promise - let it update in background
      networkPromise;
      return cachedResponse;
    }
    
    // No cache, wait for network
    const networkResponse = await networkPromise;
    if (networkResponse) {
      return networkResponse;
    }
    
    throw new Error('No cached version and network failed');
    
  } catch (error) {
    console.error('❌ Data file fetch failed:', error);
    return createDataFallback(request);
  }
}

/**
 * Network First Handler
 */
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('💾 Cached network-first resource:', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.warn('⚠️ Network first failed, trying cache:', request.url);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 Serving from cache after network failure:', request.url);
      return cachedResponse;
    }
    
    console.error('❌ No cache available for:', request.url);
    return createOfflineFallback(request);
  }
}

/**
 * Default Handler - Cache First with Network Fallback
 */
async function handleDefault(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 Serving from dynamic cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.log('💾 Cached default resource:', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Default fetch failed:', error);
    return createOfflineFallback(request);
  }
}

/**
 * Background Cache Update
 */
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      console.log('🔄 Background cache update:', request.url);
    }
  } catch (error) {
    console.warn('⚠️ Background update failed:', request.url, error);
  }
}

/**
 * Resource Type Checkers
 */
function isStaticAsset(pathname) {
  return (
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf') ||
    pathname.includes('/css/') ||
    pathname.includes('/js/') ||
    pathname.includes('/images/') ||
    pathname.includes('/fonts/')
  );
}

function isDataFile(pathname) {
  return DATA_FILES.some(pattern => pathname.includes(pattern.replace('/js/', ''))) ||
         pathname.includes('database') ||
         pathname.includes('/data/');
}

function isNetworkFirst(pathname) {
  return NETWORK_FIRST.some(pattern => pathname.startsWith(pattern));
}

/**
 * Offline Fallbacks
 */
function createOfflineFallback(request) {
  const url = new URL(request.url);
  
  // HTML fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    return new Response(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HAQEI Analyzer - オフライン</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
          .offline-container {
            max-width: 500px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          h1 { color: #60a5fa; margin-bottom: 20px; }
          p { line-height: 1.6; margin: 20px 0; }
          .retry-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
          }
          .retry-btn:hover { background: #2563eb; }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <h1>🔌 オフラインです</h1>
          <p>現在インターネット接続がありません。</p>
          <p>接続を確認して、再度お試しください。</p>
          <button class="retry-btn" onclick="location.reload()">再試行</button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
  
  // JSON fallback
  if (request.headers.get('accept')?.includes('application/json')) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline',
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Default fallback
  return new Response('Content not available offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

function createDataFallback(request) {
  // Return minimal data structure for HAQEI components
  return new Response(JSON.stringify({
    fallback: true,
    message: 'Using offline fallback data',
    data: {},
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Message Handler for Cache Management
 */
self.addEventListener('message', event => {
  const { action, data } = event.data;
  
  switch (action) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      cacheUrls(data.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearCache(data.cacheNames);
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    default:
      console.warn('Unknown message action:', action);
  }
});

/**
 * Cache URLs on demand
 */
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await Promise.all(
      urls.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            return cache.put(url, response);
          }
        }).catch(error => {
          console.warn('Failed to cache URL:', url, error);
        })
      )
    );
    console.log('✅ URLs cached successfully:', urls.length);
  } catch (error) {
    console.error('❌ Failed to cache URLs:', error);
  }
}

/**
 * Clear specific caches
 */
async function clearCache(cacheNames = []) {
  try {
    if (cacheNames.length === 0) {
      cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, DATA_CACHE];
    }
    
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    console.log('🗑️ Caches cleared:', cacheNames);
  } catch (error) {
    console.error('❌ Failed to clear caches:', error);
  }
}

/**
 * Get cache status
 */
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      status[cacheName] = {
        size: keys.length,
        urls: keys.map(request => request.url)
      };
    }
    
    return {
      caches: status,
      totalCaches: cacheNames.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Failed to get cache status:', error);
    return { error: error.message };
  }
}

/**
 * Performance Monitoring Integration
 */
self.addEventListener('sync', event => {
  if (event.tag === 'performance-metrics') {
    event.waitUntil(sendPerformanceMetrics());
  }
});

async function sendPerformanceMetrics() {
  try {
    // Get performance metrics from indexedDB or cache
    const metrics = await getStoredMetrics();
    
    if (metrics && metrics.length > 0) {
      // Send to analytics endpoint
      const response = await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: metrics,
          timestamp: new Date().toISOString(),
          source: 'service-worker'
        })
      });
      
      if (response.ok) {
        // Clear sent metrics
        await clearStoredMetrics();
        console.log('📊 Performance metrics sent successfully');
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to send performance metrics:', error);
  }
}

async function getStoredMetrics() {
  // Implementation would depend on storage strategy
  // This is a placeholder for the actual implementation
  return [];
}

async function clearStoredMetrics() {
  // Implementation would depend on storage strategy
  // This is a placeholder for the actual implementation
}

console.log('🔧 HAQEI Service Worker loaded successfully');