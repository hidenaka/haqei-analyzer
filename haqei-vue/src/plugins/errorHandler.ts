/**
 * errorHandler.ts - グローバルエラーハンドリングプラグイン
 * HaQei Analyzer - Global Error Handler Plugin
 */

import type { App } from 'vue'
import { useGlobalErrorHandler } from '@/composables/useErrorHandler'

export interface ErrorHandlerPluginOptions {
  enableLogging?: boolean
  enableReporting?: boolean
  errorPageRoute?: string
  onError?: (error: Error, info: string) => void
}

export default {
  install(app: App, options: ErrorHandlerPluginOptions = {}) {
    const {
      enableLogging = import.meta.env.DEV,
      enableReporting = !import.meta.env.DEV,
      errorPageRoute = '/error',
      onError,
    } = options
    
    const { addError } = useGlobalErrorHandler()
    
    // Vue エラーハンドラー
    app.config.errorHandler = (err, instance, info) => {
      const error = err as Error
      const componentName = instance?.$options.name || 'Unknown'
      
      if (enableLogging) {
        console.error(`[Vue Error] Component: ${componentName}`)
        console.error('Error:', error)
        console.error('Info:', info)
        console.error('Instance:', instance)
      }
      
      // グローバルエラーストアに追加
      addError(componentName, {
        message: error.message,
        details: error.stack,
        timestamp: new Date(),
        component: componentName,
        action: info,
      })
      
      // カスタムエラーハンドラー
      onError?.(error, info)
      
      // エラーレポーティング
      if (enableReporting) {
        reportErrorToService(error, {
          component: componentName,
          info,
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
      }
    }
    
    // Vue 警告ハンドラー
    app.config.warnHandler = (msg, instance, trace) => {
      if (enableLogging) {
        console.warn(`[Vue Warning] ${msg}`)
        console.warn('Trace:', trace)
      }
    }
    
    // グローバル未処理エラーハンドラー
    window.addEventListener('error', (event) => {
      if (enableLogging) {
        console.error('[Global Error]', event.error)
      }
      
      addError('Global', {
        message: event.message,
        details: event.error?.stack,
        timestamp: new Date(),
        component: 'Window',
        action: 'unhandledError',
      })
      
      if (enableReporting) {
        reportErrorToService(event.error || new Error(event.message), {
          type: 'unhandledError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      }
    })
    
    // 未処理のPromiseリジェクション
    window.addEventListener('unhandledrejection', (event) => {
      if (enableLogging) {
        console.error('[Unhandled Promise Rejection]', event.reason)
      }
      
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason))
      
      addError('Global', {
        message: error.message,
        details: error.stack,
        timestamp: new Date(),
        component: 'Promise',
        action: 'unhandledRejection',
      })
      
      if (enableReporting) {
        reportErrorToService(error, {
          type: 'unhandledRejection',
          promise: event.promise,
        })
      }
      
      // デフォルトの動作を防ぐ
      event.preventDefault()
    })
    
    // エラーページへのリダイレクト機能
    app.config.globalProperties.$handleCriticalError = (error: Error) => {
      console.error('[Critical Error]', error)
      
      // ルーターが利用可能な場合はエラーページへ
      const router = app.config.globalProperties.$router
      if (router && errorPageRoute) {
        router.push({
          path: errorPageRoute,
          query: {
            message: error.message,
            timestamp: Date.now().toString(),
          },
        })
      }
    }
    
    // エラーハンドリングユーティリティ
    app.config.globalProperties.$errorUtils = {
      /**
       * 安全に関数を実行
       */
      safely<T>(fn: () => T, fallback?: T): T | undefined {
        try {
          return fn()
        } catch (error) {
          if (enableLogging) {
            console.error('[Safe Execution Failed]', error)
          }
          return fallback
        }
      },
      
      /**
       * 非同期関数を安全に実行
       */
      async safelyAsync<T>(
        fn: () => Promise<T>,
        fallback?: T
      ): Promise<T | undefined> {
        try {
          return await fn()
        } catch (error) {
          if (enableLogging) {
            console.error('[Async Safe Execution Failed]', error)
          }
          return fallback
        }
      },
      
      /**
       * エラーをフォーマット
       */
      formatError(error: unknown): string {
        if (error instanceof Error) {
          return error.message
        }
        if (typeof error === 'string') {
          return error
        }
        return 'An unknown error occurred'
      },
    }
  },
}

/**
 * エラーレポーティングサービスへの送信
 */
function reportErrorToService(error: Error, context: Record<string, any>) {
  // 本番環境でのみ実行
  if (import.meta.env.PROD) {
    // Sentry, LogRocket, Bugsnag などのサービスに送信
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
    }
    
    // TODO: 実際のエラーレポーティングサービスのAPIを呼び出す
    console.log('Error report prepared:', errorReport)
  }
}

// TypeScript の型定義を拡張
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $handleCriticalError: (error: Error) => void
    $errorUtils: {
      safely<T>(fn: () => T, fallback?: T): T | undefined
      safelyAsync<T>(fn: () => Promise<T>, fallback?: T): Promise<T | undefined>
      formatError(error: unknown): string
    }
  }
}