/**
 * 国際化（i18n）システム設定
 * Vue I18n を使用した多言語対応システム
 */

import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'

// 言語ファイルのインポート
import ja from './locales/ja.json'
import en from './locales/en.json'

// サポートする言語のタイプ定義
export type SupportedLocale = 'ja' | 'en'

// 言語設定インターフェース
export interface LocaleConfig {
  code: SupportedLocale
  name: string
  flag: string
  rtl: boolean
}

// サポートする言語の設定
export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  ja: {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
    rtl: false
  },
  en: {
    code: 'en', 
    name: 'English',
    flag: '🇺🇸',
    rtl: false
  }
}

// デフォルト言語
export const DEFAULT_LOCALE: SupportedLocale = 'ja'

// ブラウザの言語設定を取得
export function getBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined' || !navigator.language) {
    return DEFAULT_LOCALE
  }
  const browserLang = navigator.language.split('-')[0] as SupportedLocale
  return SUPPORTED_LOCALES[browserLang] ? browserLang : DEFAULT_LOCALE
}

// ローカルストレージから言語設定を取得
export function getStoredLocale(): SupportedLocale | null {
  try {
    const stored = localStorage.getItem('haqei-locale')
    if (stored && SUPPORTED_LOCALES[stored as SupportedLocale]) {
      return stored as SupportedLocale
    }
  } catch (error) {
    console.warn('Failed to get stored locale:', error)
  }
  return null
}

// ローカルストレージに言語設定を保存
export function setStoredLocale(locale: SupportedLocale): void {
  try {
    localStorage.setItem('haqei-locale', locale)
  } catch (error) {
    console.warn('Failed to store locale:', error)
  }
}

// 初期言語を判定
export function getInitialLocale(): SupportedLocale {
  return getStoredLocale() || getBrowserLocale()
}

// 数値フォーマット関数
export function formatNumber(
  value: number,
  locale: SupportedLocale = 'ja',
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value)
  } catch (error) {
    console.warn('Number formatting failed:', error)
    return value.toString()
  }
}

// 日付フォーマット関数
export function formatDate(
  date: Date | string | number,
  locale: SupportedLocale = 'ja',
  options: Intl.DateTimeFormatOptions = {}
): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat(locale, options).format(dateObj)
  } catch (error) {
    console.warn('Date formatting failed:', error)
    return date.toString()
  }
}

// 相対時間フォーマット関数
export function formatRelativeTime(
  date: Date | string | number,
  locale: SupportedLocale = 'ja'
): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    if (diffMinutes < 1) {
      return locale === 'ja' ? 'たった今' : 'just now'
    } else if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minute')
    } else if (diffHours < 24) {
      return rtf.format(-diffHours, 'hour')
    } else if (diffDays < 30) {
      return rtf.format(-diffDays, 'day')
    } else {
      return formatDate(dateObj, locale, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  } catch (error) {
    console.warn('Relative time formatting failed:', error)
    return date.toString()
  }
}

// ファイルサイズフォーマット関数
export function formatFileSize(
  bytes: number,
  locale: SupportedLocale = 'ja'
): string {
  const units = locale === 'ja' 
    ? ['バイト', 'KB', 'MB', 'GB', 'TB']
    : ['bytes', 'KB', 'MB', 'GB', 'TB']

  if (bytes === 0) return `0 ${units[0]}`

  const k = 1024
  const dm = 2
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${units[i]}`
}

// パーセント表示フォーマット関数
export function formatPercentage(
  value: number,
  locale: SupportedLocale = 'ja',
  decimals: number = 1
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100)
  } catch (error) {
    console.warn('Percentage formatting failed:', error)
    return `${value}%`
  }
}

// エラーメッセージ取得ヘルパー
export interface ErrorMessageOptions {
  context?: string
  params?: Record<string, any>
  fallback?: string
}

export function getErrorMessage(
  i18n: any,
  errorCode: string,
  options: ErrorMessageOptions = {}
): string {
  const { context, params, fallback } = options
  
  // コンテキスト付きエラーメッセージを試行
  if (context) {
    const contextKey = `errors.${context}.${errorCode}`
    if (i18n.te(contextKey)) {
      return i18n.t(contextKey, params)
    }
  }
  
  // 一般的なエラーメッセージを試行
  const generalKey = `errors.${errorCode}`
  if (i18n.te(generalKey)) {
    return i18n.t(generalKey, params)
  }
  
  // システムエラーとして試行
  const systemKey = `errors.system.${errorCode}`
  if (i18n.te(systemKey)) {
    return i18n.t(systemKey, params)
  }
  
  // フォールバックメッセージ
  return fallback || i18n.t('errors.system.unexpectedError')
}

// Vue I18n 設定
const i18nConfig: I18nOptions = {
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    ja,
    en
  },
  // 数値フォーマット設定
  numberFormats: {
    ja: {
      currency: {
        style: 'currency',
        currency: 'JPY'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }
    }
  },
  // 日付時刻フォーマット設定
  datetimeFormats: {
    ja: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  },
  // 複数形ルール（英語用）
  pluralizationRules: {
    en: (choice: number) => {
      if (choice === 0) return 0
      return choice === 1 ? 1 : 2
    }
  },
  // 警告を無効化（プロダクション用）
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  silentFallbackWarn: process.env.NODE_ENV === 'production'
}

// Vue I18n インスタンスを作成
export const i18n = createI18n(i18nConfig)

// 言語切り替え関数
export function switchLocale(locale: SupportedLocale): void {
  if (!SUPPORTED_LOCALES[locale]) {
    console.warn(`Unsupported locale: ${locale}`)
    return
  }
  
  i18n.global.locale.value = locale
  setStoredLocale(locale)
  
  // HTML lang 属性を更新
  document.documentElement.lang = locale
  
  // RTL対応（将来のアラビア語対応等）
  const config = SUPPORTED_LOCALES[locale]
  document.documentElement.dir = config.rtl ? 'rtl' : 'ltr'
}

// 現在の言語を取得
export function getCurrentLocale(): SupportedLocale {
  return i18n.global.locale.value as SupportedLocale
}

// 翻訳キーが存在するかチェック
export function hasTranslation(key: string): boolean {
  return i18n.global.te(key)
}

// デフォルトエクスポート
export default i18n