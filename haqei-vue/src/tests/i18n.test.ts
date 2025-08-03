/**
 * 国際化（i18n）システムのテスト
 * Vue I18n の機能と多言語対応をテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { 
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  getBrowserLocale,
  getStoredLocale,
  setStoredLocale,
  getInitialLocale,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatPercentage,
  getErrorMessage
} from '../i18n'
import { useI18n } from '../composables/useI18n'
import { ERROR_CODES, getErrorCodeFromHttpStatus, handleError } from '../utils/errorMessages'

// テスト用のmessages
const testMessages = {
  ja: {
    common: {
      loading: '読み込み中...',
      error: 'エラー'
    },
    errors: {
      network: {
        connectionFailed: 'インターネット接続に失敗しました'
      },
      system: {
        unexpectedError: '予期しないエラーが発生しました'
      }
    },
    validation: {
      required: '{field}は必須項目です',
      minLength: '{field}は{min}文字以上で入力してください'
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error'
    },
    errors: {
      network: {
        connectionFailed: 'Internet connection failed'
      },
      system: {
        unexpectedError: 'An unexpected error occurred'
      }
    },
    validation: {
      required: '{field} is required',
      minLength: '{field} must be at least {min} characters'
    }
  }
}

// テスト用のi18nインスタンス作成
const createTestI18n = (locale = 'ja') => {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'ja',
    messages: testMessages
  })
}

describe('国際化（i18n）システム', () => {
  beforeEach(() => {
    // localStorageのモック
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })

    // navigatorのモック
    Object.defineProperty(window, 'navigator', {
      value: {
        language: 'ja-JP'
      },
      writable: true
    })
  })

  describe('基本設定', () => {
    it('サポートする言語が正しく定義されている', () => {
      expect(SUPPORTED_LOCALES).toHaveProperty('ja')
      expect(SUPPORTED_LOCALES).toHaveProperty('en')
      expect(SUPPORTED_LOCALES.ja.code).toBe('ja')
      expect(SUPPORTED_LOCALES.en.code).toBe('en')
    })

    it('デフォルト言語が日本語に設定されている', () => {
      expect(DEFAULT_LOCALE).toBe('ja')
    })

    it('ブラウザ言語を正しく取得する', () => {
      // 日本語の場合
      Object.defineProperty(window.navigator, 'language', {
        value: 'ja-JP',
        configurable: true
      })
      expect(getBrowserLocale()).toBe('ja')

      // 英語の場合
      Object.defineProperty(window.navigator, 'language', {
        value: 'en-US',
        configurable: true
      })
      expect(getBrowserLocale()).toBe('en')

      // サポートされていない言語の場合はデフォルトを返す
      Object.defineProperty(window.navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      })
      expect(getBrowserLocale()).toBe(DEFAULT_LOCALE)
    })
  })

  describe('ローカルストレージ管理', () => {
    it('言語設定を保存・取得できる', () => {
      const mockGetItem = vi.fn().mockReturnValue('en')
      const mockSetItem = vi.fn()
      window.localStorage.getItem = mockGetItem
      window.localStorage.setItem = mockSetItem

      // 保存
      setStoredLocale('en')
      expect(mockSetItem).toHaveBeenCalledWith('haqei-locale', 'en')

      // 取得
      const stored = getStoredLocale()
      expect(mockGetItem).toHaveBeenCalledWith('haqei-locale')
      expect(stored).toBe('en')
    })

    it('無効な言語設定の場合はnullを返す', () => {
      const mockGetItem = vi.fn().mockReturnValue('invalid-locale')
      window.localStorage.getItem = mockGetItem

      const stored = getStoredLocale()
      expect(stored).toBeNull()
    })

    it('localStorage エラー時はnullを返す', () => {
      const mockGetItem = vi.fn().mockImplementation(() => {
        throw new Error('localStorage error')
      })
      window.localStorage.getItem = mockGetItem

      const stored = getStoredLocale()
      expect(stored).toBeNull()
    })
  })

  describe('初期言語判定', () => {
    it('保存された言語を優先する', () => {
      const mockGetItem = vi.fn().mockReturnValue('en')
      window.localStorage.getItem = mockGetItem

      const initial = getInitialLocale()
      expect(initial).toBe('en')
    })

    it('保存された言語がない場合はブラウザ言語を使用', () => {
      const mockGetItem = vi.fn().mockReturnValue(null)
      window.localStorage.getItem = mockGetItem
      
      Object.defineProperty(window.navigator, 'language', {
        value: 'en-US',
        configurable: true
      })

      const initial = getInitialLocale()
      expect(initial).toBe('en')
    })
  })

  describe('フォーマット関数', () => {
    it('数値を正しくフォーマットする', () => {
      // 日本語
      const jaNumber = formatNumber(1234.56, 'ja')
      expect(jaNumber).toBe('1,234.56')

      // 英語
      const enNumber = formatNumber(1234.56, 'en')
      expect(enNumber).toBe('1,234.56')

      // 通貨フォーマット
      const jaCurrency = formatNumber(1234, 'ja', { style: 'currency', currency: 'JPY' })
      expect(jaCurrency).toContain('¥1,234')
    })

    it('日付を正しくフォーマットする', () => {
      const testDate = new Date('2023-12-25T10:30:00Z')
      
      // 日本語
      const jaDate = formatDate(testDate, 'ja', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      expect(jaDate).toContain('2023')
      expect(jaDate).toContain('12')
      expect(jaDate).toContain('25')

      // 英語
      const enDate = formatDate(testDate, 'en', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      expect(enDate).toContain('2023')
      expect(enDate).toContain('December') 
      expect(enDate).toContain('25')
    })

    it('相対時間を正しくフォーマットする', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      
      const jaRelative = formatRelativeTime(oneHourAgo, 'ja')
      expect(jaRelative).toContain('1')
      expect(jaRelative).toContain('時間')

      const enRelative = formatRelativeTime(oneHourAgo, 'en')
      expect(enRelative).toContain('1')
      expect(enRelative).toContain('hour')
    })

    it('ファイルサイズを正しくフォーマットする', () => {
      // 日本語
      expect(formatFileSize(0, 'ja')).toBe('0 バイト')
      expect(formatFileSize(1024, 'ja')).toBe('1 KB')
      expect(formatFileSize(1048576, 'ja')).toBe('1 MB')

      // 英語
      expect(formatFileSize(0, 'en')).toBe('0 bytes')
      expect(formatFileSize(1024, 'en')).toBe('1 KB')
      expect(formatFileSize(1048576, 'en')).toBe('1 MB')
    })

    it('パーセントを正しくフォーマットする', () => {
      const jaPercent = formatPercentage(75, 'ja', 1)
      expect(jaPercent).toBe('75.0%')

      const enPercent = formatPercentage(75, 'en', 1)
      expect(enPercent).toBe('75.0%')
    })
  })

  describe('エラーメッセージ取得', () => {
    it('コンテキスト付きエラーメッセージを取得する', () => {
      const i18n = createTestI18n('ja')
      
      const message = getErrorMessage(i18n.global, 'connectionFailed', {
        context: 'network'
      })
      
      expect(message).toBe('インターネット接続に失敗しました')
    })

    it('一般的なエラーメッセージを取得する', () => {
      const i18n = createTestI18n('ja')
      
      const message = getErrorMessage(i18n.global, 'unexpectedError', {
        context: 'system'
      })
      
      expect(message).toBe('予期しないエラーが発生しました')
    })

    it('パラメータ付きメッセージを取得する', () => {
      const i18n = createTestI18n('ja')
      
      const message = getErrorMessage(i18n.global, 'required', {
        context: 'validation',
        params: { field: 'メールアドレス' }
      })
      
      expect(message).toBe('メールアドレスは必須項目です')
    })

    it('フォールバック メッセージを使用する', () => {
      const i18n = createTestI18n('ja')
      
      const message = getErrorMessage(i18n.global, 'nonexistentError', {
        fallback: 'デフォルトエラー'
      })
      
      expect(message).toBe('予期しないエラーが発生しました')
    })
  })

  describe('useI18n Composable', () => {
    it('現在のロケールを取得できる', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { locale } = wrapper.vm
      expect(locale.value).toBe('ja')
    })

    it('サポートする言語一覧を取得できる', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { availableLocales } = wrapper.vm
      expect(availableLocales.value).toHaveLength(2)
      expect(availableLocales.value[0].code).toBe('ja')
      expect(availableLocales.value[1].code).toBe('en')
    })

    it('翻訳関数が動作する', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { t } = wrapper.vm
      expect(t('common.loading')).toBe('読み込み中...')
      expect(t('common.error')).toBe('エラー')
    })

    it('エラーメッセージを取得できる', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { getError } = wrapper.vm
      const message = getError('connectionFailed', 'network')
      expect(message).toBe('インターネット接続に失敗しました')
    })

    it('フォーマット関数が動作する', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { formatters } = wrapper.vm
      expect(formatters.number(1234.56)).toBe('1,234.56')
      expect(formatters.fileSize(1024)).toBe('1 KB')
      expect(formatters.percentage(75)).toBe('75.0%')
    })
  })

  describe('エラーコード処理', () => {
    it('HTTPステータスコードからエラーコードを取得する', () => {
      expect(getErrorCodeFromHttpStatus(400)).toBe(ERROR_CODES.NETWORK_BAD_REQUEST)
      expect(getErrorCodeFromHttpStatus(401)).toBe(ERROR_CODES.NETWORK_UNAUTHORIZED)
      expect(getErrorCodeFromHttpStatus(404)).toBe(ERROR_CODES.NETWORK_NOT_FOUND)
      expect(getErrorCodeFromHttpStatus(500)).toBe(ERROR_CODES.NETWORK_SERVER_ERROR)
    })

    it('エラーハンドリングが正しく動作する', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const error = new Error('Test error')
      const errorInfo = handleError(error, 'network', { test: 'metadata' })
      
      expect(errorInfo.message).toBe('Test error')
      expect(errorInfo.context).toBe('network')
      expect(errorInfo.metadata).toEqual({ test: 'metadata' })
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('言語切り替え', () => {
    it('言語を切り替えできる', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { setLocale, locale, t } = wrapper.vm
      
      // 初期は日本語
      expect(locale.value).toBe('ja')
      expect(t('common.loading')).toBe('読み込み中...')
      
      // 英語に切り替え
      setLocale('en')
      expect(locale.value).toBe('en')
      expect(t('common.loading')).toBe('Loading...')
    })
  })

  describe('通知システム', () => {
    it('通知を表示・クリアできる', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { notification, showNotification, clearNotification } = wrapper.vm
      
      // 初期状態
      expect(notification.value).toBeNull()
      
      // 通知表示
      showNotification('success', 'common.success', 'common.loading')
      expect(notification.value).toBeTruthy()
      expect(notification.value.type).toBe('success')
      
      // 通知クリア
      clearNotification()
      expect(notification.value).toBeNull()
    })
  })

  describe('ローディング状態管理', () => {
    it('ローディング状態を管理できる', () => {
      const i18n = createTestI18n('ja')
      const wrapper = mount({
        template: '<div></div>',
        setup() {
          return useI18n()
        }
      }, {
        global: {
          plugins: [i18n]
        }
      })

      const { loading, setLoading } = wrapper.vm
      
      // 初期状態
      expect(loading.value.isLoading).toBe(false)
      
      // ローディング開始
      setLoading(true, 'common.loading')
      expect(loading.value.isLoading).toBe(true)
      expect(loading.value.message).toBe('読み込み中...')
      
      // ローディング終了
      setLoading(false)
      expect(loading.value.isLoading).toBe(false)
    })
  })
})