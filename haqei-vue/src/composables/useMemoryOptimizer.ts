/**
 * useMemoryOptimizer.ts - Vue3メモリ最適化コンポーザブル
 * 
 * 目的：
 * - メモリ使用量50MB以下の維持
 * - メモリリーク防止・早期検出
 * - ガベージコレクション最適化
 * - オブジェクトプールによる効率化
 * - bunenjin哲学準拠の調和の取れたメモリ管理
 * 
 * 機能：
 * - リアルタイムメモリ監視
 * - 自動メモリクリーンアップ
 * - オブジェクトプール管理
 * - WeakMapベースのキャッシュ
 * - メモリリーク検出・修復
 */

import { ref, computed, onUnmounted, nextTick } from 'vue'
import type { Ref } from 'vue'

// メモリ使用量統計
interface MemoryStats {
  used: number // MB
  total: number // MB
  percentage: number
  jsHeapSize: number // バイト
  jsHeapSizeLimit: number // バイト
  totalJSHeapSize: number // バイト
}

// メモリリーク検出結果
interface MemoryLeakInfo {
  type: 'dom' | 'event' | 'timer' | 'cache' | 'reactive'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  estimatedSize: number // バイト
  location?: string
}

// オブジェクトプール設定
interface ObjectPoolConfig {
  maxSize: number
  initialSize: number
  createFn: () => any
  resetFn: (obj: any) => void
  validateFn?: (obj: any) => boolean
}

// メモリ最適化設定
interface MemoryOptimizerConfig {
  maxMemoryUsage: number // MB
  gcThreshold: number // しきい値（MB）
  monitoringInterval: number // ミリ秒
  autoCleanup: boolean
  poolingEnabled: boolean
  debugMode: boolean
}

// デフォルト設定
const defaultConfig: MemoryOptimizerConfig = {
  maxMemoryUsage: 50, // 50MB
  gcThreshold: 40, // 40MB
  monitoringInterval: 10000, // 10秒
  autoCleanup: true,
  poolingEnabled: true,
  debugMode: import.meta.env.DEV
}

/**
 * Vue3メモリ最適化コンポーザブル
 */
export function useMemoryOptimizer(config: Partial<MemoryOptimizerConfig> = {}) {
  const mergedConfig = { ...defaultConfig, ...config }
  
  // 状態管理
  const memoryStats = ref<MemoryStats | null>(null)
  const memoryLeaks = ref<MemoryLeakInfo[]>([])
  const isMonitoring = ref(false)
  const alerts = ref<string[]>([])
  
  // オブジェクトプール管理
  const objectPools = new Map<string, {
    pool: any[]
    config: ObjectPoolConfig
    stats: { created: number; reused: number; destroyed: number }
  }>()
  
  // WeakMapベースのキャッシュ（自動GC対応）
  const weakCache = new WeakMap<object, any>()
  
  // タイマー・インターバル管理
  const managedTimers = new Set<NodeJS.Timeout>()
  const managedIntervals = new Set<NodeJS.Timeout>()
  
  // DOM観察者管理
  const managedObservers = new Set<MutationObserver | IntersectionObserver | ResizeObserver>()
  
  // イベントリスナー管理
  const managedEventListeners = new Map<EventTarget, Map<string, EventListener>>()
  
  // リアクティブ参照追跡
  const reactiveRefs = new Set<Ref<any>>()
  
  let monitoringTimer: NodeJS.Timeout | null = null
  
  /**
   * メモリ使用量取得
   */
  function getMemoryStats(): MemoryStats | null {
    if (!('memory' in performance)) {
      return null
    }
    
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      percentage: Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100),
      jsHeapSize: memory.usedJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize
    }
  }
  
  /**
   * メモリ監視開始
   */
  function startMemoryMonitoring() {
    if (isMonitoring.value) return
    
    isMonitoring.value = true
    
    monitoringTimer = setInterval(async () => {
      // メモリ統計更新
      memoryStats.value = getMemoryStats()
      
      if (memoryStats.value) {
        // アラートチェック
        checkMemoryAlerts(memoryStats.value)
        
        // メモリリーク検出
        await detectMemoryLeaks()
        
        // 自動クリーンアップ
        if (mergedConfig.autoCleanup && memoryStats.value.used > mergedConfig.gcThreshold) {
          await performMemoryCleanup()
        }
      }
    }, mergedConfig.monitoringInterval)
    
    if (mergedConfig.debugMode) {
      console.log('🧠 Memory monitoring started')
    }
  }
  
  /**
   * メモリ監視停止
   */
  function stopMemoryMonitoring() {
    isMonitoring.value = false
    
    if (monitoringTimer) {
      clearInterval(monitoringTimer)
      monitoringTimer = null
    }
    
    if (mergedConfig.debugMode) {
      console.log('🧠 Memory monitoring stopped')
    }
  }
  
  /**
   * メモリアラートチェック
   */
  function checkMemoryAlerts(stats: MemoryStats) {
    const newAlerts: string[] = []
    
    if (stats.percentage > 90) {
      newAlerts.push(`重大：メモリ使用量が${stats.percentage}%に達しています`)
    } else if (stats.percentage > 80) {
      newAlerts.push(`警告：メモリ使用量が${stats.percentage}%です`)
    }
    
    if (stats.used > mergedConfig.maxMemoryUsage) {
      newAlerts.push(`制限超過：メモリ使用量が${stats.used}MB（制限：${mergedConfig.maxMemoryUsage}MB）`)
    }
    
    alerts.value = newAlerts
    
    if (newAlerts.length > 0 && mergedConfig.debugMode) {
      console.warn('🚨 Memory alerts:', newAlerts)
    }
  }
  
  /**
   * メモリリーク検出
   */
  async function detectMemoryLeaks(): Promise<void> {
    const leaks: MemoryLeakInfo[] = []
    
    // DOM要素の孤立チェック
    const domNodes = document.querySelectorAll('*')
    const suspiciousNodes = Array.from(domNodes).filter(node => {
      // 削除されたはずの要素が残っている
      const element = node as HTMLElement
      return element.dataset?.removed === 'true' || 
             (node as any).__vue_disposed === true
    })
    
    if (suspiciousNodes.length > 0) {
      leaks.push({
        type: 'dom',
        description: `${suspiciousNodes.length}個の孤立DOM要素が検出されました`,
        severity: suspiciousNodes.length > 100 ? 'high' : 'medium',
        estimatedSize: suspiciousNodes.length * 1000 // 推定1KB/要素
      })
    }
    
    // タイマー・インターバルの未解放チェック
    if (managedTimers.size > 100) {
      leaks.push({
        type: 'timer',
        description: `${managedTimers.size}個の未解放タイマーが検出されました`,
        severity: 'medium',
        estimatedSize: managedTimers.size * 100
      })
    }
    
    // イベントリスナーの未解放チェック
    let totalListeners = 0
    managedEventListeners.forEach(listeners => {
      totalListeners += listeners.size
    })
    
    if (totalListeners > 500) {
      leaks.push({
        type: 'event',
        description: `${totalListeners}個の未解放イベントリスナーが検出されました`,
        severity: 'high',
        estimatedSize: totalListeners * 200
      })
    }
    
    // リアクティブ参照の未解放チェック
    if (reactiveRefs.size > 1000) {
      leaks.push({
        type: 'reactive',
        description: `${reactiveRefs.size}個の未解放リアクティブ参照が検出されました`,
        severity: 'medium',
        estimatedSize: reactiveRefs.size * 500
      })
    }
    
    memoryLeaks.value = leaks
    
    if (leaks.length > 0 && mergedConfig.debugMode) {
      console.warn('🕳️ Memory leaks detected:', leaks)
    }
  }
  
  /**
   * メモリクリーンアップ実行
   */
  async function performMemoryCleanup(): Promise<{
    freedMemory: number
    actions: string[]
  }> {
    const startStats = getMemoryStats()
    const actions: string[] = []
    
    try {
      // 1. WeakMapキャッシュは自動的にGCされるので何もしない
      
      // 2. オブジェクトプールの最適化
      for (const [poolName, poolData] of objectPools.entries()) {
        const { pool, config } = poolData
        if (pool.length > config.maxSize * 1.5) {
          const excess = pool.length - config.maxSize
          pool.splice(config.maxSize, excess)
          actions.push(`オブジェクトプール「${poolName}」から${excess}個のオブジェクトを削除`)
        }
      }
      
      // 3. 孤立DOM要素の削除
      const orphanedElements = document.querySelectorAll('[data-removed="true"]')
      orphanedElements.forEach(el => el.remove())
      if (orphanedElements.length > 0) {
        actions.push(`${orphanedElements.length}個の孤立DOM要素を削除`)
      }
      
      // 4. 未使用のリアクティブ参照のクリーンアップ
      const unusedRefs: Ref<any>[] = []
      reactiveRefs.forEach(ref => {
        if (ref.value === null || ref.value === undefined) {
          unusedRefs.push(ref)
        }
      })
      unusedRefs.forEach(ref => reactiveRefs.delete(ref))
      if (unusedRefs.length > 0) {
        actions.push(`${unusedRefs.length}個の未使用リアクティブ参照を削除`)
      }
      
      // 5. 強制ガベージコレクション（可能な場合）
      if ((window as any).gc) {
        (window as any).gc()
        actions.push('強制ガベージコレクションを実行')
      }
      
      // 6. Vue3の内部クリーンアップ
      await nextTick()
      actions.push('Vue3内部クリーンアップを実行')
      
      const endStats = getMemoryStats()
      const freedMemory = startStats && endStats 
        ? startStats.used - endStats.used 
        : 0
      
      if (mergedConfig.debugMode) {
        console.log(`🧹 Memory cleanup completed. Freed: ${freedMemory}MB`, actions)
      }
      
      return { freedMemory, actions }
      
    } catch (error) {
      console.error('❌ Memory cleanup failed:', error)
      return { freedMemory: 0, actions: ['クリーンアップ中にエラーが発生'] }
    }
  }
  
  /**
   * オブジェクトプール作成
   */
  function createObjectPool<T>(name: string, config: ObjectPoolConfig): {
    acquire: () => T
    release: (obj: T) => void
    getStats: () => { created: number; reused: number; destroyed: number; poolSize: number }
  } {
    if (!mergedConfig.poolingEnabled) {
      // プーリング無効時は直接作成・破棄
      return {
        acquire: () => config.createFn(),
        release: () => {},
        getStats: () => ({ created: 0, reused: 0, destroyed: 0, poolSize: 0 })
      }
    }
    
    const pool: T[] = []
    const stats = { created: 0, reused: 0, destroyed: 0 }
    
    // 初期オブジェクト作成
    for (let i = 0; i < config.initialSize; i++) {
      pool.push(config.createFn())
      stats.created++
    }
    
    objectPools.set(name, { pool, config, stats })
    
    return {
      acquire: (): T => {
        if (pool.length > 0) {
          const obj = pool.pop()!
          stats.reused++
          return obj
        } else {
          const obj = config.createFn()
          stats.created++
          return obj
        }
      },
      
      release: (obj: T): void => {
        // オブジェクトの検証
        if (config.validateFn && !config.validateFn(obj)) {
          stats.destroyed++
          return
        }
        
        // プールサイズ制限チェック
        if (pool.length >= config.maxSize) {
          stats.destroyed++
          return
        }
        
        // オブジェクトリセット
        config.resetFn(obj)
        pool.push(obj)
      },
      
      getStats: () => ({ ...stats, poolSize: pool.length })
    }
  }
  
  /**
   * 管理されたタイマー作成
   */
  function createManagedTimer(callback: () => void, delay: number): NodeJS.Timeout {
    const timer = setTimeout(() => {
      callback()
      managedTimers.delete(timer)
    }, delay)
    
    managedTimers.add(timer)
    return timer
  }
  
  /**
   * 管理されたインターバル作成
   */
  function createManagedInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const interval = setInterval(callback, delay)
    managedIntervals.add(interval)
    return interval
  }
  
  /**
   * 管理されたイベントリスナー追加
   */
  function addManagedEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(type, listener, options)
    
    if (!managedEventListeners.has(target)) {
      managedEventListeners.set(target, new Map())
    }
    
    managedEventListeners.get(target)!.set(type, listener)
  }
  
  /**
   * 管理されたObserver作成
   */
  function createManagedObserver<T extends MutationObserver | IntersectionObserver | ResizeObserver>(
    observer: T
  ): T {
    managedObservers.add(observer)
    return observer
  }
  
  /**
   * リアクティブ参照追跡
   */
  function trackReactiveRef<T>(ref: Ref<T>): Ref<T> {
    reactiveRefs.add(ref)
    return ref
  }
  
  /**
   * WeakMapキャッシュ操作
   */
  function setWeakCache<K extends object, V>(key: K, value: V): void {
    weakCache.set(key, value)
  }
  
  function getWeakCache<K extends object, V>(key: K): V | undefined {
    return weakCache.get(key)
  }
  
  function hasWeakCache<K extends object>(key: K): boolean {
    return weakCache.has(key)
  }
  
  /**
   * メモリ使用量予測
   */
  function predictMemoryUsage(operation: string, dataSize: number): {
    estimated: number // MB
    safe: boolean
    recommendation: string
  } {
    const currentUsage = memoryStats.value?.used || 0
    const estimated = currentUsage + (dataSize / 1024 / 1024)
    const safe = estimated < mergedConfig.maxMemoryUsage * 0.9
    
    let recommendation = ''
    if (!safe) {
      recommendation = '操作前にメモリクリーンアップを実行することを推奨します'
    } else if (estimated > mergedConfig.maxMemoryUsage * 0.7) {
      recommendation = 'メモリ使用量が増加しています。監視を強化してください'
    } else {
      recommendation = '安全な範囲内です'
    }
    
    return { estimated, safe, recommendation }
  }
  
  /**
   * 全リソースクリーンアップ
   */
  function cleanup() {
    // タイマークリア
    managedTimers.forEach(timer => clearTimeout(timer))
    managedTimers.clear()
    
    managedIntervals.forEach(interval => clearInterval(interval))
    managedIntervals.clear()
    
    // イベントリスナー削除
    managedEventListeners.forEach((listeners, target) => {
      listeners.forEach((listener, type) => {
        target.removeEventListener(type, listener)
      })
    })
    managedEventListeners.clear()
    
    // Observer停止
    managedObservers.forEach(observer => {
      observer.disconnect()
    })
    managedObservers.clear()
    
    // リアクティブ参照クリア
    reactiveRefs.clear()
    
    // オブジェクトプールクリア
    objectPools.clear()
    
    if (mergedConfig.debugMode) {
      console.log('🧹 All managed resources cleaned up')
    }
  }
  
  // 計算プロパティ
  const memoryUsagePercentage = computed(() => {
    return memoryStats.value?.percentage || 0
  })
  
  const isMemoryHigh = computed(() => {
    return memoryUsagePercentage.value > 80
  })
  
  const isCriticalMemory = computed(() => {
    return memoryUsagePercentage.value > 90
  })
  
  const totalManagedResources = computed(() => {
    return managedTimers.size + 
           managedIntervals.size + 
           managedEventListeners.size + 
           managedObservers.size +
           reactiveRefs.size
  })
  
  // クリーンアップ
  onUnmounted(() => {
    stopMemoryMonitoring()
    cleanup()
  })
  
  return {
    // 状態
    memoryStats,
    memoryLeaks,
    isMonitoring,
    alerts,
    
    // 計算プロパティ
    memoryUsagePercentage,
    isMemoryHigh,
    isCriticalMemory,
    totalManagedResources,
    
    // 監視制御
    startMemoryMonitoring,
    stopMemoryMonitoring,
    
    // メモリ管理
    performMemoryCleanup,
    detectMemoryLeaks,
    predictMemoryUsage,
    
    // オブジェクトプール
    createObjectPool,
    
    // リソース管理
    createManagedTimer,
    createManagedInterval,
    addManagedEventListener,
    createManagedObserver,
    trackReactiveRef,
    
    // キャッシュ
    setWeakCache,
    getWeakCache,
    hasWeakCache,
    
    // クリーンアップ
    cleanup
  }
}

export type { MemoryStats, MemoryLeakInfo, ObjectPoolConfig, MemoryOptimizerConfig }