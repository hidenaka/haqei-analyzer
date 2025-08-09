/**
 * グローバル多言語対応コンポーザブル
 * 50+言語対応・文化的適応・AI翻訳統合
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { 
  SupportedLocale, 
  CulturalColorPalette, 
  CulturalLayoutConfig,
  CulturalSensitivity,
  LanguageDetectionResult,
  TranslationQualityMetrics
} from '@/i18n'
import {
  switchLocale,
  getCurrentLocale,
  SUPPORTED_LOCALES,
  getCulturalColors,
  getCulturalLayout,
  getCulturalSensitivity,
  getTranslationQuality,
  suggestLocaleByRegion,
  RTL_LANGUAGES,
  HIGH_QUALITY_AI_LANGUAGES,
  CULTURALLY_SENSITIVE_LANGUAGES,
  autoTranslate,
  measureTranslationPerformance,
  generateLanguageQualityReport
} from '@/i18n'

// グローバル状態管理
const currentLocale = ref<SupportedLocale>(getCurrentLocale())
const isRTL = ref(RTL_LANGUAGES.includes(currentLocale.value))
const isLoading = ref(false)
const translationCache = new Map<string, string>()
const performanceMetrics = ref({
  loadTime: 0,
  cacheHitRate: 0,
  memoryUsage: 0
})

// 自動言語検出結果
const detectionResult = ref<LanguageDetectionResult | null>(null)

// 地域別言語提案
const suggestedLocales = ref<SupportedLocale[]>([])

export function useGlobalI18n() {
  const { t, locale, availableLocales } = useI18n()

  // 現在の言語設定
  const localeConfig = computed(() => SUPPORTED_LOCALES[currentLocale.value])
  const culturalColors = computed(() => getCulturalColors(currentLocale.value))
  const culturalLayout = computed(() => getCulturalLayout(currentLocale.value))
  const culturalSensitivity = computed(() => getCulturalSensitivity(currentLocale.value))
  const translationQuality = computed(() => getTranslationQuality(currentLocale.value))

  // 言語品質情報
  const isHighQualityLanguage = computed(() => 
    HIGH_QUALITY_AI_LANGUAGES.includes(currentLocale.value)
  )
  const isCulturallySensitive = computed(() => 
    CULTURALLY_SENSITIVE_LANGUAGES.includes(currentLocale.value)
  )

  // サポートされている言語リスト
  const supportedLanguages = computed(() => 
    Object.values(SUPPORTED_LOCALES).map(config => ({
      code: config.code,
      name: config.name,
      flag: config.flag,
      region: config.region,
      quality: config.aiTranslationQuality,
      rtl: config.rtl
    }))
  )

  // 地域別言語グループ
  const languagesByRegion = computed(() => {
    const groups: Record<string, typeof supportedLanguages.value> = {}
    supportedLanguages.value.forEach(lang => {
      if (!groups[lang.region]) {
        groups[lang.region] = []
      }
      groups[lang.region].push(lang)
    })
    return groups
  })

  /**
   * 言語切り替え（拡張版）
   */
  async function changeLocale(locale: SupportedLocale): Promise<void> {
    if (locale === currentLocale.value) return

    isLoading.value = true
    try {
      const startTime = performance.now()
      
      await switchLocale(locale)
      currentLocale.value = locale
      isRTL.value = RTL_LANGUAGES.includes(locale)
      
      // パフォーマンス測定
      const endTime = performance.now()
      performanceMetrics.value = {
        ...measureTranslationPerformance(),
        loadTime: endTime - startTime
      }

      // 成功通知
      console.log(`Successfully switched to ${locale}`, {
        quality: `${getTranslationQuality(locale) * 100}%`,
        rtl: isRTL.value,
        loadTime: `${performanceMetrics.value.loadTime.toFixed(2)}ms`
      })

    } catch (error) {
      console.error(`Failed to switch locale to ${locale}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 自動言語検出
   */
  async function detectUserLanguage(): Promise<LanguageDetectionResult> {
    try {
      // ブラウザ言語
      const browserLang = navigator.language.split('-')[0] as SupportedLocale
      
      // 地域提案
      const suggestions = suggestLocaleByRegion()
      
      // 信頼度計算
      let confidence = 0.8
      if (SUPPORTED_LOCALES[browserLang]) {
        confidence = 0.9
      }

      const result: LanguageDetectionResult = {
        locale: SUPPORTED_LOCALES[browserLang] ? browserLang : 'en',
        confidence,
        region: SUPPORTED_LOCALES[browserLang]?.region,
        alternatives: suggestions.filter(l => l !== browserLang).slice(0, 3)
      }

      detectionResult.value = result
      suggestedLocales.value = suggestions

      return result
    } catch (error) {
      console.warn('Language detection failed:', error)
      return {
        locale: 'en',
        confidence: 0.5,
        alternatives: ['ja', 'zh-CN', 'es']
      }
    }
  }

  /**
   * AI支援翻訳（キャッシュ付き）
   */
  async function translateText(
    text: string,
    targetLocale: SupportedLocale,
    sourceLocale?: SupportedLocale
  ): Promise<string> {
    const from = sourceLocale || currentLocale.value
    const cacheKey = `${from}-${targetLocale}-${text}`

    // キャッシュチェック
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!
    }

    try {
      const translated = await autoTranslate(text, from, targetLocale)
      
      // キャッシュに保存
      translationCache.set(cacheKey, translated)
      
      return translated
    } catch (error) {
      console.warn(`Translation failed from ${from} to ${targetLocale}:`, error)
      return text // フォールバック
    }
  }

  /**
   * 文化的配慮チェック
   */
  function checkCulturalSensitivity(content: {
    colors?: string[]
    numbers?: number[]
    symbols?: string[]
  }): {
    warnings: string[]
    suggestions: string[]
  } {
    const sensitivity = culturalSensitivity.value
    const warnings: string[] = []
    const suggestions: string[] = []

    if (!sensitivity) {
      return { warnings, suggestions }
    }

    // 色彩チェック
    if (content.colors) {
      const avoidColors = content.colors.filter(color => 
        sensitivity.colors.avoid.includes(color)
      )
      if (avoidColors.length > 0) {
        warnings.push(`Colors to avoid in ${currentLocale.value}: ${avoidColors.join(', ')}`)
        suggestions.push(`Consider using cultural colors: ${sensitivity.colors.sacred.join(', ')}`)
      }
    }

    // 数字チェック
    if (content.numbers) {
      const unlucky = content.numbers.filter(num => 
        sensitivity.numbers.unlucky.includes(num)
      )
      if (unlucky.length > 0) {
        warnings.push(`Unlucky numbers in ${currentLocale.value}: ${unlucky.join(', ')}`)
        if (sensitivity.numbers.lucky.length > 0) {
          suggestions.push(`Lucky numbers: ${sensitivity.numbers.lucky.join(', ')}`)
        }
      }
    }

    return { warnings, suggestions }
  }

  /**
   * 数値・日付フォーマット
   */
  function formatCulturalNumber(
    value: number,
    options?: Intl.NumberFormatOptions
  ): string {
    const layout = culturalLayout.value
    const locale = currentLocale.value
    
    try {
      return new Intl.NumberFormat(locale, {
        ...options,
        numberingSystem: layout.numberFormat === 'western' ? 'latn' : layout.numberFormat
      }).format(value)
    } catch (error) {
      console.warn(`Number formatting failed for ${locale}:`, error)
      return value.toString()
    }
  }

  function formatCulturalDate(
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string {
    const layout = culturalLayout.value
    const locale = currentLocale.value
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      return new Intl.DateTimeFormat(locale, {
        ...options,
        calendar: layout.dateFormat === 'gregorian' ? 'gregory' : layout.dateFormat
      }).format(dateObj)
    } catch (error) {
      console.warn(`Date formatting failed for ${locale}:`, error)
      return date.toString()
    }
  }

  /**
   * パフォーマンス監視
   */
  function getPerformanceReport() {
    return {
      ...performanceMetrics.value,
      cacheSize: translationCache.size,
      qualityReport: generateLanguageQualityReport(),
      currentLanguageQuality: translationQuality.value,
      isHighQuality: isHighQualityLanguage.value
    }
  }

  /**
   * キャッシュ管理
   */
  function clearTranslationCache(): void {
    translationCache.clear()
    console.log('Translation cache cleared')
  }

  function getTranslationCacheStats() {
    return {
      size: translationCache.size,
      entries: Array.from(translationCache.keys()).slice(0, 10),
      memoryUsage: translationCache.size * 100 // 概算
    }
  }

  /**
   * 言語学習モード
   */
  const learningMode = ref(false)
  const originalTexts = ref<Map<string, string>>(new Map())

  function enableLearningMode(): void {
    learningMode.value = true
    console.log('Language learning mode enabled')
  }

  function disableLearningMode(): void {
    learningMode.value = false
    originalTexts.value.clear()
    console.log('Language learning mode disabled')
  }

  function getOriginalText(translatedText: string): string | null {
    return originalTexts.value.get(translatedText) || null
  }

  // ライフサイクル管理
  onMounted(async () => {
    // 初期言語検出
    try {
      await detectUserLanguage()
    } catch (error) {
      console.warn('Initial language detection failed:', error)
    }

    // パフォーマンス測定開始
    performanceMetrics.value = measureTranslationPerformance()
  })

  onUnmounted(() => {
    // クリーンアップ
    clearTranslationCache()
  })

  // 言語変更の監視
  watch(currentLocale, (newLocale) => {
    console.log(`Locale changed to: ${newLocale}`, {
      quality: `${getTranslationQuality(newLocale) * 100}%`,
      region: SUPPORTED_LOCALES[newLocale].region,
      rtl: RTL_LANGUAGES.includes(newLocale)
    })
  })

  return {
    // 基本状態
    currentLocale: computed(() => currentLocale.value),
    localeConfig,
    isRTL: computed(() => isRTL.value),
    isLoading: computed(() => isLoading.value),

    // 文化的設定
    culturalColors,
    culturalLayout,
    culturalSensitivity,
    translationQuality,

    // 言語品質
    isHighQualityLanguage,
    isCulturallySensitive,

    // 言語リスト
    supportedLanguages,
    languagesByRegion,
    suggestedLocales: computed(() => suggestedLocales.value),

    // 言語操作
    changeLocale,
    detectUserLanguage,
    translateText,

    // 文化的機能
    checkCulturalSensitivity,
    formatCulturalNumber,
    formatCulturalDate,

    // パフォーマンス
    performanceMetrics: computed(() => performanceMetrics.value),
    getPerformanceReport,

    // キャッシュ管理
    clearTranslationCache,
    getTranslationCacheStats,

    // 学習モード
    learningMode: computed(() => learningMode.value),
    enableLearningMode,
    disableLearningMode,
    getOriginalText,

    // 検出結果
    detectionResult: computed(() => detectionResult.value),

    // Vue I18n パススルー
    t
  }
}

// グローバルインスタンス（シングルトン）
let globalI18nInstance: ReturnType<typeof useGlobalI18n> | null = null

export function useGlobalI18nSingleton() {
  if (!globalI18nInstance) {
    globalI18nInstance = useGlobalI18n()
  }
  return globalI18nInstance
}

export default useGlobalI18n