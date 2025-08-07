/**
 * useVue3LazyLoading.ts - Vue3遅延読み込み最適化コンポーザブル
 * 
 * 目的：
 * - コンポーネントの遅延読み込みによる初期表示速度向上
 * - 動的インポートによるバンドルサイズ最適化
 * - プログレッシブローディングによる体感速度向上
 * - HaQei哲学準拠の調和の取れたローディング体験
 * 
 * 機能：
 * - コンポーネント遅延読み込み
 * - 画像遅延読み込み
 * - ルート遅延読み込み
 * - プリロード制御
 * - ローディング状態管理
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Component, AsyncComponentLoader, DefineComponent } from 'vue'

// 遅延読み込み設定
interface LazyLoadingConfig {
  // コンポーネント遅延読み込み設定
  componentChunkSize: number
  componentRetryAttempts: number
  componentTimeout: number
  
  // 画像遅延読み込み設定
  imageRootMargin: string
  imageThreshold: number
  imagePlaceholder: string
  
  // プリロード設定
  enablePreload: boolean
  preloadDistance: number
  maxPreloadCount: number
  
  // ローディング設定
  loadingDelay: number
  minimumLoadingTime: number
  
  // デバッグ設定
  debugMode: boolean
}

// デフォルト設定
const defaultConfig: LazyLoadingConfig = {
  componentChunkSize: 5,
  componentRetryAttempts: 3,
  componentTimeout: 10000,
  
  imageRootMargin: '50px',
  imageThreshold: 0.1,
  imagePlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpaHQ9IjEwMCUiIGZpbGw9IiNmNmY4ZmEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTJweCIgZmlsbD0iIzk5YTNhZiI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  
  enablePreload: true,
  preloadDistance: 1000,
  maxPreloadCount: 5,
  
  loadingDelay: 200,
  minimumLoadingTime: 300,
  
  debugMode: import.meta.env.DEV
}

// ローディング状態
interface LoadingState {
  isLoading: boolean
  hasError: boolean
  error?: Error
  loadedAt?: number
}

// 遅延読み込み結果
interface LazyLoadResult<T = any> {
  data: T | null
  loading: boolean
  error: Error | null
  retry: () => Promise<void>
}

/**
 * Vue3遅延読み込みコンポーザブル
 */
export function useVue3LazyLoading(config: Partial<LazyLoadingConfig> = {}) {
  const mergedConfig = { ...defaultConfig, ...config }
  
  // 状態管理
  const loadingStates = ref<Map<string, LoadingState>>(new Map())
  const preloadedComponents = ref<Set<string>>(new Set())
  const intersectionObserver = ref<IntersectionObserver | null>(null)
  
  /**
   * コンポーネント遅延読み込み
   */
  function lazyComponent<T extends Component>(
    loader: AsyncComponentLoader<T>,
    options: {
      loadingComponent?: Component
      errorComponent?: Component
      delay?: number
      timeout?: number
      suspensible?: boolean
      onError?: (error: Error, retry: () => void, fail: () => void, attempts: number) => any
    } = {}
  ): DefineComponent {
    const componentId = Math.random().toString(36).substr(2, 9)
    
    // ローディング状態初期化
    loadingStates.value.set(componentId, {
      isLoading: false,
      hasError: false
    })
    
    const asyncComponent: DefineComponent = {
      name: `LazyComponent_${componentId}`,
      async setup() {
        const state = loadingStates.value.get(componentId)!
        
        try {
          state.isLoading = true
          const startTime = performance.now()
          
          // 最小表示時間の保証
          const [component] = await Promise.all([
            loader(),
            new Promise(resolve => setTimeout(resolve, mergedConfig.minimumLoadingTime))
          ])
          
          const loadTime = performance.now() - startTime
          state.loadedAt = Date.now()
          state.isLoading = false
          
          if (mergedConfig.debugMode) {
            console.log(`⚡ Lazy component loaded in ${loadTime.toFixed(2)}ms:`, componentId)
          }
          
          return component
        } catch (error) {
          state.hasError = true
          state.error = error as Error
          state.isLoading = false
          
          if (mergedConfig.debugMode) {
            console.error('❌ Lazy component loading failed:', error)
          }
          
          throw error
        }
      },
      
      // 非同期コンポーネントの設定
      loader,
      loadingComponent: options.loadingComponent,
      errorComponent: options.errorComponent,
      delay: options.delay || mergedConfig.loadingDelay,
      timeout: options.timeout || mergedConfig.componentTimeout,
      suspensible: options.suspensible ?? true,
      onError: options.onError
    } as any
    
    return asyncComponent
  }
  
  /**
   * 複数コンポーネントの遅延読み込み
   */
  function lazyComponents<T extends Record<string, AsyncComponentLoader<any>>>(
    loaders: T,
    options: Parameters<typeof lazyComponent>[1] = {}
  ): { [K in keyof T]: DefineComponent } {
    const result = {} as any
    
    Object.entries(loaders).forEach(([name, loader]) => {
      result[name] = lazyComponent(loader, options)
    })
    
    return result
  }
  
  /**
   * ルート遅延読み込み
   */
  function lazyRoute(loader: AsyncComponentLoader<any>) {
    return () => ({
      component: loader,
      meta: {
        requiresLazyLoad: true
      }
    })
  }
  
  /**
   * 画像遅延読み込み
   */
  function lazyImage(src: string, options: {
    placeholder?: string
    onLoad?: (img: HTMLImageElement) => void
    onError?: (error: Event) => void
  } = {}): LazyLoadResult<string> {
    const loading = ref(true)
    const error = ref<Error | null>(null)
    const imageSrc = ref(options.placeholder || mergedConfig.imagePlaceholder)
    
    const retry = async () => {
      loading.value = true
      error.value = null
      
      try {
        await loadImage(src)
        imageSrc.value = src
        loading.value = false
        
        if (options.onLoad) {
          const img = new Image()
          img.src = src
          options.onLoad(img)
        }
      } catch (err) {
        error.value = err as Error
        loading.value = false
        
        if (options.onError) {
          options.onError(err as Event)
        }
      }
    }
    
    // 初回読み込み
    retry()
    
    return {
      data: imageSrc,
      loading: computed(() => loading.value),
      error: computed(() => error.value),
      retry
    }
  }
  
  /**
   * 画像読み込みPromise
   */
  function loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  }
  
  /**
   * Intersection Observer を使用した遅延読み込み
   */
  function observeLazyLoad(
    element: HTMLElement,
    callback: () => void,
    options: {
      rootMargin?: string
      threshold?: number
    } = {}
  ) {
    if (!intersectionObserver.value) {
      intersectionObserver.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const callback = (entry.target as any).__lazyCallback
              if (callback) {
                callback()
                intersectionObserver.value?.unobserve(entry.target)
              }
            }
          })
        },
        {
          rootMargin: options.rootMargin || mergedConfig.imageRootMargin,
          threshold: options.threshold || mergedConfig.imageThreshold
        }
      )
    }
    
    // コールバックを要素に関連付け
    ;(element as any).__lazyCallback = callback
    
    intersectionObserver.value.observe(element)
    
    // クリーンアップ関数を返す
    return () => {
      if (intersectionObserver.value) {
        intersectionObserver.value.unobserve(element)
        ;(element as any).__lazyCallback = null
      }
    }
  }
  
  /**
   * プリロード機能
   */
  async function preloadComponent(loader: AsyncComponentLoader<any>, id?: string): Promise<void> {
    const componentId = id || Math.random().toString(36).substr(2, 9)
    
    if (preloadedComponents.value.has(componentId)) {
      return // すでにプリロード済み
    }
    
    try {
      await loader()
      preloadedComponents.value.add(componentId)
      
      if (mergedConfig.debugMode) {
        console.log('🚀 Component preloaded:', componentId)
      }
    } catch (error) {
      if (mergedConfig.debugMode) {
        console.error('❌ Component preload failed:', error)
      }
    }
  }
  
  /**
   * 複数コンポーネントのプリロード
   */
  async function preloadComponents(loaders: Array<{ loader: AsyncComponentLoader<any>; id?: string }>) {
    const preloadPromises = loaders
      .slice(0, mergedConfig.maxPreloadCount)
      .map(({ loader, id }) => preloadComponent(loader, id))
    
    await Promise.allSettled(preloadPromises)
  }
  
  /**
   * リソースプリロード
   */
  function preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font' = 'script') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    
    switch (type) {
      case 'script':
        link.as = 'script'
        break
      case 'style':
        link.as = 'style'
        break
      case 'image':
        link.as = 'image'
        break
      case 'font':
        link.as = 'font'
        link.crossOrigin = 'anonymous'
        break
    }
    
    document.head.appendChild(link)
    
    if (mergedConfig.debugMode) {
      console.log(`🔗 Resource preloaded: ${url} (${type})`)
    }
  }
  
  /**
   * プログレッシブローディングの実装
   */
  function createProgressiveLoader<T>(
    stages: Array<{
      name: string
      loader: () => Promise<T>
      priority: 'high' | 'medium' | 'low'
    }>
  ) {
    const results = ref<Map<string, { data: T | null; loading: boolean; error: Error | null }>>(new Map())
    const overallProgress = ref(0)
    
    // 優先度でソート
    const sortedStages = stages.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    
    const loadStages = async () => {
      let completedStages = 0
      
      for (const stage of sortedStages) {
        results.value.set(stage.name, { data: null, loading: true, error: null })
        
        try {
          const data = await stage.loader()
          results.value.set(stage.name, { data, loading: false, error: null })
          
          if (mergedConfig.debugMode) {
            console.log(`✅ Progressive stage completed: ${stage.name}`)
          }
        } catch (error) {
          results.value.set(stage.name, { data: null, loading: false, error: error as Error })
          
          if (mergedConfig.debugMode) {
            console.error(`❌ Progressive stage failed: ${stage.name}`, error)
          }
        }
        
        completedStages++
        overallProgress.value = (completedStages / sortedStages.length) * 100
        
        // 次のステージの前に少し待機（UI の滑らかさのため）
        await nextTick()
      }
    }
    
    // 非同期で読み込み開始
    loadStages()
    
    return {
      results: computed(() => results.value),
      progress: computed(() => overallProgress.value),
      isComplete: computed(() => overallProgress.value === 100)
    }
  }
  
  /**
   * チャンク分割されたコンポーネントローダー
   */
  function createChunkedLoader<T>(
    items: T[],
    processor: (chunk: T[]) => Promise<void>,
    chunkSize: number = mergedConfig.componentChunkSize
  ) {
    const processedCount = ref(0)
    const totalCount = items.length
    const isProcessing = ref(false)
    const error = ref<Error | null>(null)
    
    const processChunks = async () => {
      isProcessing.value = true
      error.value = null
      processedCount.value = 0
      
      try {
        for (let i = 0; i < items.length; i += chunkSize) {
          const chunk = items.slice(i, i + chunkSize)
          await processor(chunk)
          processedCount.value += chunk.length
          
          // UI をブロックしないように nextTick を待つ
          await nextTick()
        }
      } catch (err) {
        error.value = err as Error
        if (mergedConfig.debugMode) {
          console.error('❌ Chunked processing failed:', err)
        }
      } finally {
        isProcessing.value = false
      }
    }
    
    return {
      processChunks,
      progress: computed(() => totalCount > 0 ? (processedCount.value / totalCount) * 100 : 0),
      isProcessing: computed(() => isProcessing.value),
      error: computed(() => error.value),
      processedCount: computed(() => processedCount.value),
      totalCount
    }
  }
  
  /**
   * ローディング状態の取得
   */
  function getLoadingState(componentId: string): LoadingState | null {
    return loadingStates.value.get(componentId) || null
  }
  
  /**
   * 全ローディング状態の取得
   */
  const allLoadingStates = computed(() => {
    return Array.from(loadingStates.value.entries()).map(([id, state]) => ({
      id,
      ...state
    }))
  })
  
  /**
   * プリロード済みコンポーネント一覧
   */
  const preloadedComponentList = computed(() => {
    return Array.from(preloadedComponents.value)
  })
  
  /**
   * 統計情報
   */
  const statistics = computed(() => {
    const states = Array.from(loadingStates.value.values())
    return {
      total: states.length,
      loading: states.filter(s => s.isLoading).length,
      loaded: states.filter(s => s.loadedAt).length,
      errors: states.filter(s => s.hasError).length,
      preloaded: preloadedComponents.value.size
    }
  })
  
  // クリーンアップ
  onUnmounted(() => {
    if (intersectionObserver.value) {
      intersectionObserver.value.disconnect()
      intersectionObserver.value = null
    }
  })
  
  return {
    // コンポーネント遅延読み込み
    lazyComponent,
    lazyComponents,
    lazyRoute,
    
    // 画像遅延読み込み
    lazyImage,
    observeLazyLoad,
    
    // プリロード
    preloadComponent,
    preloadComponents,
    preloadResource,
    
    // プログレッシブローディング
    createProgressiveLoader,
    createChunkedLoader,
    
    // 状態管理
    getLoadingState,
    allLoadingStates,
    preloadedComponentList,
    statistics
  }
}

export type { LazyLoadingConfig, LoadingState, LazyLoadResult }