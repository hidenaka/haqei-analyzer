/**
 * 国際化（i18n）Composable
 * Vue Composition API を使用した多言語対応ユーティリティ
 */

import { computed, ref, watch } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'
import type { ComputedRef, Ref } from 'vue'
import {
  type SupportedLocale,
  type LocaleConfig,
  type ErrorMessageOptions,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  switchLocale,
  getCurrentLocale,
  getErrorMessage,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatPercentage
} from '../i18n'

// エラーコンテキストの定義
export type ErrorContext = 
  | 'network'
  | 'auth' 
  | 'database'
  | 'file'
  | 'api'
  | 'sync'
  | 'offline'
  | 'validation'
  | 'system'

// ローディング状態のインターフェース
export interface LoadingState {
  isLoading: boolean
  message: string
}

// 通知メッセージのインターフェース
export interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// 国際化Composableの戻り値の型定義
export interface UseI18nReturn {
  // 現在のロケール
  locale: ComputedRef<SupportedLocale>
  // サポートする言語一覧
  availableLocales: ComputedRef<LocaleConfig[]>
  // 言語切り替え
  setLocale: (locale: SupportedLocale) => void
  // 翻訳関数
  t: (key: string, params?: Record<string, any>) => string
  // 複数形対応翻訳
  tc: (key: string, count: number, params?: Record<string, any>) => string
  // 翻訳キー存在チェック
  te: (key: string) => boolean
  // エラーメッセージ取得
  getError: (errorCode: string, context?: ErrorContext, params?: Record<string, any>) => string
  // 共通メッセージ取得
  getCommon: (key: string, params?: Record<string, any>) => string
  // バリデーションメッセージ取得
  getValidation: (key: string, params?: Record<string, any>) => string
  // フォーマット関数
  formatters: {
    number: (value: number, options?: Intl.NumberFormatOptions) => string
    date: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
    relativeTime: (date: Date | string | number) => string
    fileSize: (bytes: number) => string
    percentage: (value: number, decimals?: number) => string
  }
  // ローディング状態管理
  loading: Ref<LoadingState>
  setLoading: (isLoading: boolean, messageKey?: string, params?: Record<string, any>) => void
  // 通知管理
  notification: Ref<NotificationMessage | null>
  showNotification: (
    type: NotificationMessage['type'],
    titleKey: string,
    messageKey: string,
    params?: Record<string, any>,
    duration?: number
  ) => void
  clearNotification: () => void
}

/**
 * 国際化Composable
 * @returns UseI18nReturn
 */
export function useI18n(): UseI18nReturn {
  const vueI18n = useVueI18n()
  
  // リアクティブな状態
  const loading = ref<LoadingState>({
    isLoading: false,
    message: ''
  })
  
  const notification = ref<NotificationMessage | null>(null)

  // 現在のロケール
  const locale = computed<SupportedLocale>(() => getCurrentLocale())

  // サポートする言語一覧
  const availableLocales = computed<LocaleConfig[]>(() => 
    Object.values(SUPPORTED_LOCALES)
  )

  // 言語切り替え
  const setLocale = (newLocale: SupportedLocale): void => {
    switchLocale(newLocale)
  }

  // 翻訳関数
  const t = (key: string, params?: Record<string, any>): string => {
    try {
      return vueI18n.t(key, params)
    } catch (error) {
      console.warn(`Translation failed for key: ${key}`, error)
      return key
    }
  }

  // 複数形対応翻訳
  const tc = (key: string, count: number, params?: Record<string, any>): string => {
    try {
      return vueI18n.tc(key, count, params)
    } catch (error) {
      console.warn(`Plural translation failed for key: ${key}`, error)
      return key
    }
  }

  // 翻訳キー存在チェック
  const te = (key: string): boolean => {
    return vueI18n.te(key)
  }

  // エラーメッセージ取得
  const getError = (
    errorCode: string,
    context?: ErrorContext,
    params?: Record<string, any>
  ): string => {
    return getErrorMessage(vueI18n, errorCode, {
      context,
      params,
      fallback: t('errors.system.unexpectedError')
    })
  }

  // 共通メッセージ取得
  const getCommon = (key: string, params?: Record<string, any>): string => {
    return t(`common.${key}`, params)
  }

  // バリデーションメッセージ取得
  const getValidation = (key: string, params?: Record<string, any>): string => {
    return t(`validation.${key}`, params)
  }

  // フォーマット関数群
  const formatters = {
    number: (value: number, options?: Intl.NumberFormatOptions): string => {
      return formatNumber(value, locale.value, options)
    },
    
    date: (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      return formatDate(date, locale.value, options)
    },
    
    relativeTime: (date: Date | string | number): string => {
      return formatRelativeTime(date, locale.value)
    },
    
    fileSize: (bytes: number): string => {
      return formatFileSize(bytes, locale.value)
    },
    
    percentage: (value: number, decimals: number = 1): string => {
      return formatPercentage(value, locale.value, decimals)
    }
  }

  // ローディング状態管理
  const setLoading = (
    isLoading: boolean,
    messageKey?: string,
    params?: Record<string, any>
  ): void => {
    loading.value = {
      isLoading,
      message: messageKey ? t(messageKey, params) : t('common.loading')
    }
  }

  // 通知管理
  const showNotification = (
    type: NotificationMessage['type'],
    titleKey: string,
    messageKey: string,
    params?: Record<string, any>,
    duration: number = 5000
  ): void => {
    notification.value = {
      type,
      title: t(titleKey, params),
      message: t(messageKey, params),
      duration
    }

    // 自動削除
    if (duration > 0) {
      setTimeout(() => {
        if (notification.value?.title === t(titleKey, params)) {
          clearNotification()
        }
      }, duration)
    }
  }

  const clearNotification = (): void => {
    notification.value = null
  }

  // ロケール変更時の処理
  watch(locale, (newLocale, oldLocale) => {
    if (newLocale !== oldLocale) {
      // ローディングメッセージを更新
      if (loading.value.isLoading) {
        loading.value.message = t('common.loading')
      }
      
      console.log(`Locale changed from ${oldLocale} to ${newLocale}`)
    }
  })

  return {
    locale,
    availableLocales,
    setLocale,
    t,
    tc,
    te,
    getError,
    getCommon,
    getValidation,
    formatters,
    loading,
    setLoading,
    notification,
    showNotification,
    clearNotification
  }
}

// 特定用途向けのComposable

/**
 * エラーハンドリング専用Composable
 */
export function useErrorHandler() {
  const { getError, showNotification, t } = useI18n()

  const handleError = (
    error: Error | string,
    context?: ErrorContext,
    showToast: boolean = true
  ): string => {
    const errorCode = typeof error === 'string' ? error : error.message
    const errorMessage = getError(errorCode, context)
    
    if (showToast) {
      showNotification('error', 'common.error', errorMessage)
    }
    
    console.error(`Error [${context || 'general'}]:`, error)
    return errorMessage
  }

  const handleNetworkError = (error: Error | string): string => {
    return handleError(error, 'network')
  }

  const handleAuthError = (error: Error | string): string => {
    return handleError(error, 'auth')
  }

  const handleValidationError = (error: Error | string): string => {
    return handleError(error, 'validation')
  }

  return {
    handleError,
    handleNetworkError,
    handleAuthError,
    handleValidationError
  }
}

/**
 * 成功メッセージ表示専用Composable
 */
export function useSuccessHandler() {
  const { showNotification, t } = useI18n()

  const showSuccess = (
    messageKey: string,
    params?: Record<string, any>,
    duration: number = 3000
  ): void => {
    showNotification('success', 'common.success', messageKey, params, duration)
  }

  const showSaveSuccess = (): void => {
    showSuccess('messages.changesSaved')
  }

  const showDeleteSuccess = (): void => {
    showSuccess('messages.itemDeleted')
  }

  const showUpdateSuccess = (): void => {
    showSuccess('messages.dataUpdated')
  }

  return {
    showSuccess,
    showSaveSuccess,
    showDeleteSuccess,
    showUpdateSuccess
  }
}

// デフォルトエクスポート
export default useI18n