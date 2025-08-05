/**
 * sw-performance.js - Performance-Optimized Service Worker
 * HAQEI Analyzer High-Performance Caching Strategy
 * 
 * 目的:
 * - Core Web Vitals最適化のための戦略的キャッシング
 * - プログレッシブローディング対応
 * - バンドルサイズ削減支援
 * - オフライン対応とパフォーマンス向上
 * 
 * キャッシュ戦略:
 * - Critical: Cache First (即座に配信)
 * - Static: Stale While Revalidate (バックグラウンド更新)
 * - Dynamic: Network First (最新データ優先)
 * - Images: Cache First with Fallback
 * 
 * バージョン: v1.0.0-performance
 * 作成日: 2025-08-05
 */

const CACHE_VERSION = 'haqei-v1.0.0-perf';
const CACHE_NAMES = {
  critical: `${CACHE_VERSION}-critical`,
  static: `${CACHE_VERSION}-static`,
  dynamic: `${CACHE_VERSION}-dynamic`,
  images: `${CACHE_VERSION}-images`,
  data: `${CACHE_VERSION}-data`
};

// Core Web Vitals最適化のための優先順位付きリソース
const CRITICAL_RESOURCES = [
  '/',
  '/os_analyzer.html',
  '/css/core.css',
  '/css/accessibility-wcag.css',
  '/js/shared/core/BaseComponent.js',
  '/js/shared/core/MicroDataManager.js',
  '/js/os-analyzer/components/WelcomeScreen.js'
];

const STATIC_RESOURCES = [
  '/css/components.css',
  '/css/layouts.css',
  '/css/interactive.css',
  '/css/results.css',
  '/css/responsive.css',
  '/css/themes.css',
  '/js/os-analyzer/components/HaqeiQuestionElement.js',
  '/js/ui/DisplayController.js',
  '/js/ui/QuestionManager.js'
];

const LARGE_DATA_FILES = [
  '/js/data/data_box.js',
  '/js/koudo_shishin_database.js',
  '/js/core/H384_DATABASE.js',
  '/js/ai_theme_database.js',
  '/js/bible.js'
];

// Service Worker インストール
self.addEventListener('install', event => {
  console.log('🚀 Service Worker installing for performance optimization...');
  
  event.waitUntil(
    Promise.all([
      // クリティカルリソースの事前キャッシュ
      caches.open(CACHE_NAMES.critical).then(cache => {
        console.log('📦 Pre-caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES.map(url => new Request(url, {
          cache: 'reload' // 強制リロードでキャッシュ
        })));
      }),
      
      // 静的リソースの事前キャッシュ
      caches.open(CACHE_NAMES.static).then(cache => {
        console.log('📦 Pre-caching static resources...');
        return cache.addAll(STATIC_RESOURCES);
      })
    ]).then(() => {
      console.log('✅ Service Worker installation complete');
      // 即座にアクティベート
      return self.skipWaiting();
    })
  );
});

// Service Worker アクティベーション
self.addEventListener('activate', event => {
  console.log('⚡ Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // 古いキャッシュの削除
      cleanupOldCaches(),
      // 全てのクライアントの制御を取得
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated and ready for performance optimization');
    })
  );
});

// メインの fetch イベントハンドラー
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // HAQEI関連のリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }
  
  // リクエストタイプに応じた戦略選択
  if (isCriticalResource(request.url)) {
    event.respondWith(handleCriticalResource(request));
  } else if (isStaticResource(request.url)) {
    event.respondWith(handleStaticResource(request));
  } else if (isLargeDataFile(request.url)) {
    event.respondWith(handleLargeDataFile(request));
  } else if (isImageResource(request.url)) {
    event.respondWith(handleImageResource(request));
  } else {
    event.respondWith(handleDynamicResource(request));
  }
});

/**
 * クリティカルリソースの処理 (Cache First)
 * 最高速配信のためキャッシュ優先
 */
async function handleCriticalResource(request) {
  const cache = await caches.open(CACHE_NAMES.critical);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log(`⚡ Critical cache hit: ${request.url}`);
    return cachedResponse;
  }
  
  console.log(`📥 Critical cache miss, fetching: ${request.url}`);
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 成功時のみキャッシュに保存
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error(`❌ Critical resource fetch failed: ${request.url}`, error);
    
    // オフライン時の fallback
    if (request.destination === 'document') {
      return new Response('HAQEI Analyzer - オフラインモード', {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

/**
 * 静的リソースの処理 (Stale While Revalidate)
 * キャッシュから即座に配信し、バックグラウンドで更新
 */
async function handleStaticResource(request) {
  const cache = await caches.open(CACHE_NAMES.static);
  const cachedResponse = await cache.match(request);
  
  // バックグラウンド更新を非同期で実行
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.warn(`⚠️ Background update failed for ${request.url}:`, error);
  });
  
  if (cachedResponse) {
    console.log(`📦 Static cache hit: ${request.url}`);
    // キャッシュから即座に返し、バックグラウンドで更新
    fetchPromise;
    return cachedResponse;
  }
  
  console.log(`📥 Static cache miss, fetching: ${request.url}`);
  return fetchPromise;
}

/**
 * 大容量データファイルの処理 (Special Chunked Strategy)
 * 分割配信とプログレッシブローディング対応
 */
async function handleLargeDataFile(request) {
  const cache = await caches.open(CACHE_NAMES.data);
  const cachedResponse = await cache.match(request);
  
  // Range リクエストの場合は特別処理
  if (request.headers.get('Range')) {
    return handleRangeRequest(request, cache);
  }
  
  if (cachedResponse) {
    console.log(`📦 Large data cache hit: ${request.url}`);
    return cachedResponse;
  }
  
  console.log(`📥 Large data fetch: ${request.url}`);
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // 大容量ファイルは選択的にキャッシュ
      const contentLength = response.headers.get('content-length');
      const fileSize = contentLength ? parseInt(contentLength) : 0;
      
      if (fileSize < 500 * 1024) { // 500KB未満のみキャッシュ
        cache.put(request, response.clone());
      } else {
        console.log(`📦 Skipping cache for large file: ${(fileSize / 1024).toFixed(1)}KB`);
      }
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Large data fetch failed: ${request.url}`, error);
    throw error;
  }
}

/**
 * Range リクエストの処理 (部分配信)
 */
async function handleRangeRequest(request, cache) {
  try {
    // ネットワークから Range リクエストを実行
    const response = await fetch(request);
    
    if (response.status === 206) { // Partial Content
      console.log(`📦 Range request successful: ${request.url}`);
      return response;
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Range request failed: ${request.url}`, error);
    throw error;
  }
}

/**
 * 画像リソースの処理 (Cache with Optimization)
 */
async function handleImageResource(request) {
  const cache = await caches.open(CACHE_NAMES.images);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log(`🖼️ Image cache hit: ${request.url}`);
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error(`❌ Image fetch failed: ${request.url}`, error);
    
    // 画像のfallbackを返す
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999">画像読み込み中...</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

/**
 * 動的リソースの処理 (Network First)
 */
async function handleDynamicResource(request) {
  const cache = await caches.open(CACHE_NAMES.dynamic);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // 成功時はキャッシュに保存
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.warn(`⚠️ Network failed for ${request.url}, trying cache...`);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log(`📦 Fallback cache hit: ${request.url}`);
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * リソースタイプの判定関数群
 */
function isCriticalResource(url) {
  return CRITICAL_RESOURCES.some(resource => url.includes(resource));
}

function isStaticResource(url) {
  return STATIC_RESOURCES.some(resource => url.includes(resource)) ||
         url.includes('.css') || url.includes('.js');
}

function isLargeDataFile(url) {
  return LARGE_DATA_FILES.some(resource => url.includes(resource));
}

function isImageResource(url) {
  return /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(url);
}

/**
 * 古いキャッシュのクリーンアップ
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCacheNames = Object.values(CACHE_NAMES);
  
  const deletePromises = cacheNames.map(cacheName => {
    if (!validCacheNames.includes(cacheName)) {
      console.log(`🗑️ Deleting old cache: ${cacheName}`);
      return caches.delete(cacheName);
    }
  });
  
  return Promise.all(deletePromises);
}

/**
 * メッセージハンドリング
 */
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'CLEAR_CACHE':
      handleClearCache(event);
      break;
      
    case 'GET_CACHE_STATUS':
      handleGetCacheStatus(event);
      break;
      
    case 'PRELOAD_RESOURCES':
      handlePreloadResources(data, event);
      break;
      
    case 'PERFORMANCE_METRICS':
      handlePerformanceMetrics(data, event);
      break;
      
    default:
      console.warn(`⚠️ Unknown message type: ${type}`);
  }
});

/**
 * キャッシュクリア処理
 */
async function handleClearCache(event) {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    event.ports[0].postMessage({
      type: 'CACHE_CLEARED',
      success: true
    });
    
    console.log('🧹 All caches cleared');
  } catch (error) {
    event.ports[0].postMessage({
      type: 'CACHE_CLEARED',
      success: false,
      error: error.message
    });
  }
}

/**
 * キャッシュ状況取得
 */
async function handleGetCacheStatus(event) {
  try {
    const status = {};
    
    for (const [name, cacheName] of Object.entries(CACHE_NAMES)) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      status[name] = {
        name: cacheName,
        entries: keys.length,
        urls: keys.map(request => request.url)
      };
    }
    
    event.ports[0].postMessage({
      type: 'CACHE_STATUS',
      data: status
    });
  } catch (error) {
    event.ports[0].postMessage({
      type: 'CACHE_STATUS',
      error: error.message
    });
  }
}

/**
 * リソースの事前読み込み
 */
async function handlePreloadResources(urls, event) {
  try {
    const cache = await caches.open(CACHE_NAMES.static);
    const preloadPromises = urls.map(url => {
      return fetch(url).then(response => {
        if (response.ok) {
          return cache.put(url, response);
        }
      }).catch(error => {
        console.warn(`⚠️ Preload failed for ${url}:`, error);
      });
    });
    
    await Promise.all(preloadPromises);
    
    event.ports[0].postMessage({
      type: 'PRELOAD_COMPLETE',
      success: true,
      count: urls.length
    });
    
    console.log(`📦 Preloaded ${urls.length} resources`);
  } catch (error) {
    event.ports[0].postMessage({
      type: 'PRELOAD_COMPLETE',
      success: false,
      error: error.message
    });
  }
}

/**
 * パフォーマンスメトリクス処理
 */
async function handlePerformanceMetrics(metrics, event) {
  // パフォーマンスメトリクスをログに記録
  console.log('📊 Performance metrics received:', metrics);
  
  // 必要に応じてキャッシュ戦略を動的調整
  if (metrics.fcp > 3000) { // FCPが3秒を超える場合
    console.log('⚡ Adjusting cache strategy for better FCP');
    // より積極的なキャッシング戦略に切り替え
  }
}

/**
 * バックグラウンド同期 (将来的な拡張用)
 */
self.addEventListener('sync', event => {
  if (event.tag === 'performance-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync() {
  console.log('🔄 Performing background performance sync...');
  // パフォーマンスデータの同期処理
}

/**
 * プッシュ通知 (パフォーマンス改善提案用)
 */
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    if (data.type === 'performance-suggestion') {
      event.waitUntil(
        self.registration.showNotification('HAQEI パフォーマンス改善', {
          body: data.message,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: 'performance'
        })
      );
    }
  }
});

console.log('🚀 HAQEI Performance Service Worker loaded and ready');