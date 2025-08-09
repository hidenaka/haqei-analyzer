/**
 * useErrorHandler.ts - エラーハンドリング用コンポーザブル
 * HaQei Analyzer - Error Handling Composable
 */

import { ref, readonly, inject } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface ErrorInfo {
  message: string
  code?: string
  details?: any
  timestamp: Date
  component?: string
  action?: string
}

export interface ErrorHandlerOptions {
  showNotification?: boolean
  logToConsole?: boolean
  reportToService?: boolean
  redirect?: string
}

export function useErrorHandler(componentName?: string) {
  const router = useRouter()
  const errors = ref<ErrorInfo[]>([])
  const isLoading = ref(false)
  const lastError = ref<ErrorInfo | null>(null)
  
  // AsyncErrorBoundaryから提供される関数を注入
  const asyncError = inject<{
    catchError: (error: Error) => void
    clearError: () => void
    retry: () => Promise<void>
  }>('asyncError', null)
  
  /**
   * エラーを処理
   */
  const handleError = (
    error: Error | string,
    action?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      component: componentName,
      action,
    }
    
    errors.value.push(errorInfo)
    lastError.value = errorInfo
    
    // デフォルトオプション
    const defaultOptions: ErrorHandlerOptions = {
      showNotification: true,
      logToConsole: import.meta.env.DEV,
      reportToService: !import.meta.env.DEV,
    }
    
    const finalOptions = { ...defaultOptions, ...options }
    
    // コンソールログ
    if (finalOptions.logToConsole) {
      console.error(`[${componentName || 'Unknown'}] ${action || 'Error'}:`, error)
    }
    
    // 通知表示（将来の実装用）
    if (finalOptions.showNotification) {
      showErrorNotification(errorInfo)
    }
    
    // エラーレポートサービスに送信（将来の実装用）
    if (finalOptions.reportToService) {
      reportError(errorInfo)
    }
    
    // リダイレクト
    if (finalOptions.redirect) {
      router.push(finalOptions.redirect)
    }
    
    // AsyncErrorBoundaryに伝播
    if (asyncError && error instanceof Error) {
      asyncError.catchError(error)
    }
  }
  
  /**
   * 非同期処理をラップしてエラーハンドリング
   */
  const withErrorHandling = async <T>(
    asyncFn: () => Promise<T>,
    action?: string,
    options?: ErrorHandlerOptions
  ): Promise<T | null> => {
    isLoading.value = true
    try {
      const result = await asyncFn()
      return result
    } catch (error) {
      handleError(error as Error, action, options)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Try-catchのラッパー
   */
  const trySync = <T>(
    fn: () => T,
    action?: string,
    options?: ErrorHandlerOptions
  ): T | null => {
    try {
      return fn()
    } catch (error) {
      handleError(error as Error, action, options)
      return null
    }
  }
  
  /**
   * エラーをクリア
   */
  const clearErrors = () => {
    errors.value = []
    lastError.value = null
    asyncError?.clearError()
  }
  
  /**
   * 特定のエラーを削除
   */
  const removeError = (index: number) => {
    errors.value.splice(index, 1)
  }
  
  /**
   * エラーが特定のコードかチェック
   */
  const hasErrorCode = (code: string): boolean => {
    return errors.value.some(error => error.code === code)
  }
  
  /**
   * 最新のエラーメッセージを取得
   */
  const getLatestErrorMessage = (): string | null => {
    return lastError.value?.message || null
  }
  
  return {
    errors: readonly(errors),
    isLoading: readonly(isLoading),
    lastError: readonly(lastError),
    handleError,
    withErrorHandling,
    trySync,
    clearErrors,
    removeError,
    hasErrorCode,
    getLatestErrorMessage,
  }
}

/**
 * グローバルエラーハンドラー
 */
export function useGlobalErrorHandler() {
  const errors = ref<Map<string, ErrorInfo[]>>(new Map())
  
  const addError = (component: string, error: ErrorInfo) => {
    if (!errors.value.has(component)) {
      errors.value.set(component, [])
    }
    errors.value.get(component)!.push(error)
  }
  
  const getErrors = (component?: string): ErrorInfo[] => {
    if (component) {
      return errors.value.get(component) || []
    }
    
    const allErrors: ErrorInfo[] = []
    errors.value.forEach(componentErrors => {
      allErrors.push(...componentErrors)
    })
    return allErrors
  }
  
  const clearErrors = (component?: string) => {
    if (component) {
      errors.value.delete(component)
    } else {
      errors.value.clear()
    }
  }
  
  return {
    errors: readonly(errors),
    addError,
    getErrors,
    clearErrors,
  }
}

/**
 * ネットワークエラー専用ハンドラー
 */
export function useNetworkErrorHandler() {
  const isOnline = ref(navigator.onLine)
  const networkErrors = ref<Error[]>([])
  
  // オンライン状態を監視
  window.addEventListener('online', () => {
    isOnline.value = true
  })
  
  window.addEventListener('offline', () => {
    isOnline.value = false
  })
  
  const handleNetworkError = (error: Error) => {
    networkErrors.value.push(error)
    
    if (!isOnline.value) {
      console.warn('Network error occurred while offline:', error)
    }
  }
  
  const retryFailedRequests = async () => {
    if (!isOnline.value) {
      console.warn('Cannot retry requests while offline')
      return
    }
    
    // 失敗したリクエストの再試行ロジック
    networkErrors.value = []
  }
  
  return {
    isOnline: readonly(isOnline),
    networkErrors: readonly(networkErrors),
    handleNetworkError,
    retryFailedRequests,
  }
}

// ヘルパー関数（将来の実装用）
function showErrorNotification(errorInfo: ErrorInfo) {
  // Toast通知やSnackbarの表示
  console.log('Error notification:', errorInfo.message)
}

function reportError(errorInfo: ErrorInfo) {
  // SentryやLogRocketなどにエラーを送信
  if (import.meta.env.PROD) {
    console.log('Reporting error to service:', errorInfo)
  }
}