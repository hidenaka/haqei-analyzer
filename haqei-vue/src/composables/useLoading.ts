/**
 * useLoading.ts - ローディング状態管理用コンポーザブル
 * HaQei Analyzer - Loading State Composable
 */

import { ref, computed, readonly } from 'vue'
import type { Ref } from 'vue'

export interface LoadingOptions {
  text?: string
  timeout?: number
  onTimeout?: () => void
}

export function useLoading(initialLoading = false) {
  const isLoading = ref(initialLoading)
  const loadingText = ref<string>('')
  const loadingProgress = ref<number | undefined>(undefined)
  const loadingTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
  
  /**
   * ローディングを開始
   */
  const startLoading = (options?: LoadingOptions) => {
    isLoading.value = true
    loadingText.value = options?.text || ''
    loadingProgress.value = undefined
    
    // タイムアウトの設定
    if (options?.timeout) {
      loadingTimeout.value = setTimeout(() => {
        stopLoading()
        options.onTimeout?.()
      }, options.timeout)
    }
  }
  
  /**
   * ローディングを停止
   */
  const stopLoading = () => {
    isLoading.value = false
    loadingText.value = ''
    loadingProgress.value = undefined
    
    // タイムアウトをクリア
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value)
      loadingTimeout.value = null
    }
  }
  
  /**
   * ローディングテキストを更新
   */
  const updateLoadingText = (text: string) => {
    loadingText.value = text
  }
  
  /**
   * ローディング進捗を更新
   */
  const updateLoadingProgress = (progress: number) => {
    loadingProgress.value = Math.min(100, Math.max(0, progress))
  }
  
  /**
   * 非同期処理をローディング付きで実行
   */
  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    options?: LoadingOptions
  ): Promise<T> => {
    startLoading(options)
    try {
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }
  
  return {
    isLoading: readonly(isLoading),
    loadingText: readonly(loadingText),
    loadingProgress: readonly(loadingProgress),
    startLoading,
    stopLoading,
    updateLoadingText,
    updateLoadingProgress,
    withLoading,
  }
}

/**
 * 複数のローディング状態を管理
 */
export function useMultipleLoading() {
  const loadingStates = ref<Map<string, boolean>>(new Map())
  const loadingTexts = ref<Map<string, string>>(new Map())
  const loadingProgresses = ref<Map<string, number>>(new Map())
  
  /**
   * 特定のキーのローディングを開始
   */
  const startLoading = (key: string, text?: string) => {
    loadingStates.value.set(key, true)
    if (text) {
      loadingTexts.value.set(key, text)
    }
  }
  
  /**
   * 特定のキーのローディングを停止
   */
  const stopLoading = (key: string) => {
    loadingStates.value.delete(key)
    loadingTexts.value.delete(key)
    loadingProgresses.value.delete(key)
  }
  
  /**
   * すべてのローディングを停止
   */
  const stopAllLoading = () => {
    loadingStates.value.clear()
    loadingTexts.value.clear()
    loadingProgresses.value.clear()
  }
  
  /**
   * 特定のキーのローディング状態を取得
   */
  const isLoading = (key: string): boolean => {
    return loadingStates.value.get(key) || false
  }
  
  /**
   * いずれかがローディング中か
   */
  const isAnyLoading = computed(() => loadingStates.value.size > 0)
  
  /**
   * 特定のキーの進捗を更新
   */
  const updateProgress = (key: string, progress: number) => {
    if (loadingStates.value.has(key)) {
      loadingProgresses.value.set(key, Math.min(100, Math.max(0, progress)))
    }
  }
  
  /**
   * 特定のキーのテキストを更新
   */
  const updateText = (key: string, text: string) => {
    if (loadingStates.value.has(key)) {
      loadingTexts.value.set(key, text)
    }
  }
  
  return {
    loadingStates: readonly(loadingStates),
    loadingTexts: readonly(loadingTexts),
    loadingProgresses: readonly(loadingProgresses),
    isAnyLoading,
    startLoading,
    stopLoading,
    stopAllLoading,
    isLoading,
    updateProgress,
    updateText,
  }
}

/**
 * グローバルローディング状態
 */
let globalLoadingInstance: ReturnType<typeof useLoading> | null = null

export function useGlobalLoading() {
  if (!globalLoadingInstance) {
    globalLoadingInstance = useLoading()
  }
  return globalLoadingInstance
}

/**
 * ローディングデコレーター（メソッド用）
 */
export function withLoadingDecorator(loadingKey?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const key = loadingKey || propertyKey
      const loading = useGlobalLoading()
      
      loading.startLoading({ text: `Processing ${key}...` })
      try {
        const result = await originalMethod.apply(this, args)
        return result
      } finally {
        loading.stopLoading()
      }
    }
    
    return descriptor
  }
}