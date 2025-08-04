/**
 * グローバル多言語対応システム統合テスト
 * 50+言語・文化的適応・AI翻訳品質検証
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { useGlobalI18n } from '@/composables/useGlobalI18n'
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
  generateLanguageQualityReport,
  type SupportedLocale
} from '@/i18n'

// モック設定
vi.mock('@/i18n/locales/zh-CN.json', () => ({
  default: {
    common: { loading: '加载中...' },
    bunenjin: { title: 'bunenjin哲学' }
  }
}))

vi.mock('@/i18n/locales/ar.json', () => ({
  default: {
    common: { loading: 'جاري التحميل...' },
    bunenjin: { title: 'فلسفة bunenjin' }
  }
}))

describe('グローバルi18nシステム統合テスト', () => {
  let mockConsole: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mockConsole = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // DOM環境のセットアップ
    document.documentElement.lang = 'ja'
    document.documentElement.dir = 'ltr'
  })

  afterEach(() => {
    mockConsole.restore()
    vi.clearAllMocks()
  })

  describe('基本言語サポート', () => {
    it('50+言語が適切に定義されている', () => {
      const supportedLanguages = Object.keys(SUPPORTED_LOCALES)
      expect(supportedLanguages.length).toBeGreaterThanOrEqual(50)
      
      // 主要言語の存在確認
      const majorLanguages: SupportedLocale[] = ['ja', 'en', 'zh-CN', 'zh-TW', 'ko', 'ar', 'es', 'fr', 'de', 'hi']
      majorLanguages.forEach(lang => {
        expect(supportedLanguages).toContain(lang)
      })
    })

    it('各言語設定が完全である', () => {
      Object.entries(SUPPORTED_LOCALES).forEach(([code, config]) => {
        expect(config.code).toBe(code)
        expect(config.name).toBeTruthy()
        expect(config.flag).toBeTruthy()
        expect(config.region).toBeTruthy()
        expect(typeof config.rtl).toBe('boolean')
        expect(config.culturalColors).toBeDefined()
        expect(config.layout).toBeDefined()
        expect(config.sensitivity).toBeDefined()
        expect(config.aiTranslationQuality).toBeGreaterThan(0)
        expect(config.aiTranslationQuality).toBeLessThanOrEqual(1)
      })
    })

    it('RTL言語が正しく識別される', () => {
      expect(RTL_LANGUAGES).toContain('ar')
      expect(RTL_LANGUAGES).toContain('he')
      expect(RTL_LANGUAGES).toContain('fa')
      
      RTL_LANGUAGES.forEach(lang => {
        expect(SUPPORTED_LOCALES[lang].rtl).toBe(true)
      })
    })

    it('高品質AI翻訳対応言語が適切に設定されている', () => {
      expect(HIGH_QUALITY_AI_LANGUAGES.length).toBeGreaterThan(10)
      
      HIGH_QUALITY_AI_LANGUAGES.forEach(lang => {
        expect(SUPPORTED_LOCALES[lang].aiTranslationQuality).toBeGreaterThanOrEqual(0.9)
      })
    })
  })

  describe('言語切り替え機能', () => {
    it('言語切り替えが正常に動作する', async () => {
      const initialLocale = getCurrentLocale()
      
      await switchLocale('zh-CN')
      expect(getCurrentLocale()).toBe('zh-CN')
      expect(document.documentElement.lang).toBe('zh-CN')
      
      await switchLocale(initialLocale)
      expect(getCurrentLocale()).toBe(initialLocale)
    })

    it('RTL言語切り替え時にDOM属性が更新される', async () => {
      await switchLocale('ar')
      expect(document.documentElement.dir).toBe('rtl')
      expect(document.documentElement.lang).toBe('ar')
      
      await switchLocale('en')
      expect(document.documentElement.dir).toBe('ltr')
      expect(document.documentElement.lang).toBe('en')
    })

    it('無効な言語への切り替えでエラーハンドリングされる', async () => {
      const invalidLocale = 'invalid' as SupportedLocale
      
      await expect(switchLocale(invalidLocale)).rejects.toThrow()
      expect(mockConsole).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported locale: invalid')
      )
    })
  })

  describe('文化的カラーパレット', () => {
    it('各言語の文化的色彩が定義されている', () => {
      const testLocales: SupportedLocale[] = ['ja', 'zh-CN', 'ar', 'ko']
      
      testLocales.forEach(locale => {
        const colors = getCulturalColors(locale)
        expect(colors.primary).toBeTruthy()
        expect(colors.secondary).toBeTruthy()
        expect(colors.accent).toBeTruthy()
        expect(colors.background).toBeTruthy()
        expect(colors.surface).toBeTruthy()
        expect(colors.text).toBeTruthy()
        expect(colors.success).toBeTruthy()
        expect(colors.warning).toBeTruthy()
        expect(colors.error).toBeTruthy()
      })
    })

    it('文化的色彩が適切なHEX形式である', () => {
      const colors = getCulturalColors('ja')
      const hexPattern = /^#[0-9A-Fa-f]{6}$/
      
      expect(colors.primary).toMatch(hexPattern)
      expect(colors.secondary).toMatch(hexPattern)
      expect(colors.accent).toMatch(hexPattern)
    })

    it('地域別の色彩の差異が反映されている', () => {
      const japaneseColors = getCulturalColors('ja')
      const arabicColors = getCulturalColors('ar')
      const chineseColors = getCulturalColors('zh-CN')
      
      // 日本とアラビアの色彩は異なる（イスラム緑 vs 日本赤）
      expect(japaneseColors.primary).not.toBe(arabicColors.primary)
      
      // 中国と日本の色彩も微妙に異なる
      expect(japaneseColors.primary).not.toBe(chineseColors.primary)
    })
  })

  describe('文化的レイアウト設定', () => {
    it('RTL言語のレイアウト設定が正しい', () => {
      const arabicLayout = getCulturalLayout('ar')
      expect(arabicLayout.readingDirection).toBe('rtl')
      expect(arabicLayout.textAlignment).toBe('right')
      
      const japaneseLayout = getCulturalLayout('ja')
      expect(japaneseLayout.readingDirection).toBe('ltr')
      expect(japaneseLayout.textAlignment).toBe('left')
    })

    it('数値・日付フォーマットが地域に適している', () => {
      const arabicLayout = getCulturalLayout('ar')
      expect(arabicLayout.numberFormat).toBe('arabic-indic')
      expect(arabicLayout.dateFormat).toBe('islamic')
      
      const persianLayout = getCulturalLayout('fa')
      expect(persianLayout.numberFormat).toBe('persian')
      expect(persianLayout.dateFormat).toBe('persian')
      
      const hindiLayout = getCulturalLayout('hi')
      expect(hindiLayout.numberFormat).toBe('devanagari')
    })

    it('週の開始曜日が文化圏に適している', () => {
      const arabicLayout = getCulturalLayout('ar')
      expect(arabicLayout.weekStart).toBe(6) // 土曜日開始
      
      const japaneseLayout = getCulturalLayout('ja')
      expect(japaneseLayout.weekStart).toBe(0) // 日曜日開始
      
      const chineseLayout = getCulturalLayout('zh-CN')
      expect(chineseLayout.weekStart).toBe(1) // 月曜日開始
    })
  })

  describe('文化的配慮システム', () => {
    it('文化的タブーが適切に設定されている', () => {
      const japaneseSensitivity = getCulturalSensitivity('ja')
      expect(japaneseSensitivity?.numbers.unlucky).toContain(4) // 死を連想
      expect(japaneseSensitivity?.numbers.lucky).toContain(7)
      expect(japaneseSensitivity?.numbers.lucky).toContain(8)
      
      const chineseSensitivity = getCulturalSensitivity('zh-CN')
      expect(chineseSensitivity?.numbers.unlucky).toContain(4)
      expect(chineseSensitivity?.colors.avoid).toContain('#FFFFFF') // 喪服色
      expect(chineseSensitivity?.colors.sacred).toContain('#FF0000') // 中国紅
      expect(chineseSensitivity?.colors.sacred).toContain('#FFD700') // 金色
    })

    it('イスラム文化の配慮が反映されている', () => {
      const arabicSensitivity = getCulturalSensitivity('ar')
      expect(arabicSensitivity?.colors.sacred).toContain('#006633') // イスラム緑
      expect(arabicSensitivity?.symbols.avoid).toContain('🐷') // 豚は禁忌
      expect(arabicSensitivity?.symbols.avoid).toContain('🍷') // 酒類は禁忌
      expect(arabicSensitivity?.symbols.sacred).toContain('☪️') // イスラムの三日月
      expect(arabicSensitivity?.numbers.lucky).toContain(7) // 7は神聖な数字
    })

    it('ジェスチャーの文化的配慮が設定されている', () => {
      const arabicSensitivity = getCulturalSensitivity('ar')
      expect(arabicSensitivity?.gestures.avoid).toContain('thumbs-up')
      expect(arabicSensitivity?.gestures.avoid).toContain('ok-sign')
      
      const japaneseSensitivity = getCulturalSensitivity('ja')
      expect(japaneseSensitivity?.gestures.avoid).toContain('pointing-finger')
    })
  })

  describe('AI翻訳品質システム', () => {
    it('翻訳品質スコアが正しい範囲内である', () => {
      Object.entries(SUPPORTED_LOCALES).forEach(([locale, config]) => {
        const quality = getTranslationQuality(locale as SupportedLocale)
        expect(quality).toBeGreaterThan(0)
        expect(quality).toBeLessThanOrEqual(1)
        expect(quality).toBe(config.aiTranslationQuality)
      })
    })

    it('高品質言語の翻訳品質が基準を満たしている', () => {
      HIGH_QUALITY_AI_LANGUAGES.forEach(locale => {
        const quality = getTranslationQuality(locale)
        expect(quality).toBeGreaterThanOrEqual(0.9)
      })
    })

    it('言語品質レポートが正確な統計を提供する', () => {
      const report = generateLanguageQualityReport()
      
      expect(report.totalLanguages).toBe(Object.keys(SUPPORTED_LOCALES).length)
      expect(report.highQualityLanguages).toBe(HIGH_QUALITY_AI_LANGUAGES.length)
      expect(report.culturallySensitiveLanguages).toBe(CULTURALLY_SENSITIVE_LANGUAGES.length)
      expect(report.rtlLanguages).toBe(RTL_LANGUAGES.length)
      expect(report.averageQuality).toBeGreaterThan(0)
      expect(report.averageQuality).toBeLessThanOrEqual(1)
      expect(typeof report.languagesByRegion).toBe('object')
    })
  })

  describe('地域別言語提案システム', () => {
    it('地域別言語提案が動作する', () => {
      // モックタイムゾーンでテスト
      vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
        timeZone: 'Asia/Tokyo',
        locale: 'ja',
        calendar: 'gregory',
        numberingSystem: 'latn'
      })
      
      const suggestions = suggestLocaleByRegion()
      expect(suggestions).toContain('ja')
    })

    it('複数の地域に対して適切な提案をする', () => {
      const testCases = [
        { timezone: 'Asia/Shanghai', expected: 'zh-CN' },
        { timezone: 'Asia/Seoul', expected: 'ko' },
        { timezone: 'Asia/Bangkok', expected: 'th' },
        { timezone: 'Asia/Dubai', expected: 'ar' },
        { timezone: 'Europe/London', expected: 'en' }
      ]
      
      testCases.forEach(({ timezone, expected }) => {
        vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
          timeZone: timezone,
          locale: 'en',
          calendar: 'gregory',
          numberingSystem: 'latn'
        })
        
        const suggestions = suggestLocaleByRegion()
        expect(suggestions).toContain(expected)
      })
    })
  })

  describe('useGlobalI18nコンポーザブル', () => {
    it('基本的なリアクティブ状態が正しく動作する', () => {
      const { currentLocale, isRTL, supportedLanguages } = useGlobalI18n()
      
      expect(currentLocale.value).toBeTruthy()
      expect(typeof isRTL.value).toBe('boolean')
      expect(Array.isArray(supportedLanguages.value)).toBe(true)
      expect(supportedLanguages.value.length).toBeGreaterThan(0)
    })

    it('文化的設定が適切に取得される', () => {
      const { culturalColors, culturalLayout, culturalSensitivity } = useGlobalI18n()
      
      expect(culturalColors.value).toBeDefined()
      expect(culturalLayout.value).toBeDefined()
      expect(culturalSensitivity.value).toBeDefined()
    })

    it('言語品質情報が正しく判定される', () => {
      const { isHighQualityLanguage, translationQuality } = useGlobalI18n()
      
      expect(typeof isHighQualityLanguage.value).toBe('boolean')
      expect(translationQuality.value).toBeGreaterThan(0)
      expect(translationQuality.value).toBeLessThanOrEqual(1)
    })
  })

  describe('パフォーマンス最適化', () => {
    it('言語切り替えが200ms以内で完了する', async () => {
      const startTime = performance.now()
      await switchLocale('en')
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(200)
    })

    it('キャッシュ機能が動作する', () => {
      const { getTranslationCacheStats, clearTranslationCache } = useGlobalI18n()
      
      const initialStats = getTranslationCacheStats()
      expect(typeof initialStats.size).toBe('number')
      expect(Array.isArray(initialStats.entries)).toBe(true)
      expect(typeof initialStats.memoryUsage).toBe('number')
      
      clearTranslationCache()
      const clearedStats = getTranslationCacheStats()
      expect(clearedStats.size).toBe(0)
    })

    it('パフォーマンスメトリクスが取得できる', () => {
      const { getPerformanceReport } = useGlobalI18n()
      const report = getPerformanceReport()
      
      expect(typeof report.loadTime).toBe('number')
      expect(typeof report.cacheHitRate).toBe('number')
      expect(typeof report.memoryUsage).toBe('number')
      expect(typeof report.cacheSize).toBe('number')
      expect(typeof report.qualityReport).toBe('object')
      expect(typeof report.currentLanguageQuality).toBe('number')
      expect(typeof report.isHighQuality).toBe('boolean')
    })
  })

  describe('エラーハンドリング', () => {
    it('不正な言語コードでエラーが発生する', async () => {
      await expect(switchLocale('invalid' as SupportedLocale)).rejects.toThrow()
    })

    it('翻訳失敗時にフォールバックが動作する', async () => {
      const { translateText } = useGlobalI18n()
      
      // 存在しない言語への翻訳を試行
      const result = await translateText('Hello', 'invalid' as SupportedLocale)
      expect(result).toBe('Hello') // フォールバック
    })

    it('文化的配慮チェックでwarningが適切に生成される', () => {
      const { checkCulturalSensitivity } = useGlobalI18n()
      
      const result = checkCulturalSensitivity({
        colors: ['#FFFFFF'], // 中国語では喪服色
        numbers: [4], // 日本語・中国語では不吉
        symbols: ['🐷'] // イスラム圏では禁忌
      })
      
      expect(Array.isArray(result.warnings)).toBe(true)
      expect(Array.isArray(result.suggestions)).toBe(true)
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIA属性が設定される', async () => {
      await switchLocale('ar')
      
      expect(document.documentElement.getAttribute('lang')).toBe('ar')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    })

    it('言語変更時にイベントが発火される', async () => {
      let eventFired = false
      const handler = () => { eventFired = true }
      
      window.addEventListener('localeChanged', handler)
      await switchLocale('fr')
      
      expect(eventFired).toBe(true)
      window.removeEventListener('localeChanged', handler)
    })
  })

  describe('統合シナリオテスト', () => {
    it('日本語から中国語への完全切り替え', async () => {
      // 初期状態確認
      expect(getCurrentLocale()).toBe('ja')
      
      // 中国語に切り替え
      await switchLocale('zh-CN')
      
      // 状態確認
      expect(getCurrentLocale()).toBe('zh-CN')
      expect(document.documentElement.lang).toBe('zh-CN')
      expect(document.documentElement.dir).toBe('ltr')
      
      // 文化的設定確認
      const colors = getCulturalColors('zh-CN')
      expect(colors.primary).toBe('#FF0000') // 中国紅
      
      const sensitivity = getCulturalSensitivity('zh-CN')
      expect(sensitivity?.numbers.unlucky).toContain(4)
      expect(sensitivity?.colors.sacred).toContain('#FF0000')
    })

    it('アラビア語への完全切り替えとRTL対応', async () => {
      await switchLocale('ar')
      
      // 基本状態確認
      expect(getCurrentLocale()).toBe('ar')
      expect(document.documentElement.lang).toBe('ar')
      expect(document.documentElement.dir).toBe('rtl')
      
      // レイアウト設定確認
      const layout = getCulturalLayout('ar')
      expect(layout.readingDirection).toBe('rtl')
      expect(layout.textAlignment).toBe('right')
      expect(layout.numberFormat).toBe('arabic-indic')
      expect(layout.dateFormat).toBe('islamic')
      expect(layout.weekStart).toBe(6) // 土曜日開始
      
      // 文化的配慮確認
      const sensitivity = getCulturalSensitivity('ar')
      expect(sensitivity?.colors.sacred).toContain('#006633') // イスラム緑
      expect(sensitivity?.symbols.avoid).toContain('🐷')
      expect(sensitivity?.symbols.sacred).toContain('☪️')
    })

    it('多段階言語切り替えでメモリリークが発生しない', async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      // 複数回の言語切り替え
      const languages: SupportedLocale[] = ['ja', 'en', 'zh-CN', 'ar', 'ko', 'fr', 'de', 'es']
      
      for (const lang of languages) {
        await switchLocale(lang)
        expect(getCurrentLocale()).toBe(lang)
      }
      
      // メモリ使用量が過度に増加していないことを確認
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB未満
      }
    })
  })
})

describe('パフォーマンステスト', () => {
  it('大量の言語データ処理が効率的である', () => {
    const startTime = performance.now()
    
    // 全言語の設定を取得
    const allLanguages = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]
    const results = allLanguages.map(locale => ({
      locale,
      colors: getCulturalColors(locale),
      layout: getCulturalLayout(locale),
      sensitivity: getCulturalSensitivity(locale),
      quality: getTranslationQuality(locale)
    }))
    
    const endTime = performance.now()
    
    expect(results.length).toBe(allLanguages.length)
    expect(endTime - startTime).toBeLessThan(100) // 100ms未満
  })

  it('リアクティブシステムが効率的に動作する', () => {
    const { currentLocale, culturalColors, isRTL } = useGlobalI18n()
    
    const startTime = performance.now()
    
    // リアクティブ値への複数回アクセス
    for (let i = 0; i < 1000; i++) {
      const _ = currentLocale.value
      const __ = culturalColors.value.primary
      const ___ = isRTL.value
    }
    
    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(50) // 50ms未満
  })
})

describe('エッジケース', () => {
  it('存在しない翻訳キーでフォールバックが動作する', () => {
    const { t } = useGlobalI18n()
    
    // 存在しないキー
    const result = t('nonexistent.key.path')
    expect(typeof result).toBe('string')
  })

  it('不完全な文化的設定でエラーが発生しない', () => {
    const { checkCulturalSensitivity } = useGlobalI18n()
    
    // 空のコンテンツでテスト
    const result = checkCulturalSensitivity({})
    expect(result.warnings).toEqual([])
    expect(result.suggestions).toEqual([])
    
    // 部分的なコンテンツでテスト
    const partialResult = checkCulturalSensitivity({ colors: ['#FF0000'] })
    expect(Array.isArray(partialResult.warnings)).toBe(true)
    expect(Array.isArray(partialResult.suggestions)).toBe(true)
  })

  it('極端に長いテキストの翻訳処理', async () => {
    const { translateText } = useGlobalI18n()
    
    const longText = 'A'.repeat(10000) // 10,000文字
    const result = await translateText(longText, 'en')
    
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('ブラウザ互換性', () => {
  it('Intl APIサポートが確認される', () => {
    expect(typeof Intl.NumberFormat).toBe('function')
    expect(typeof Intl.DateTimeFormat).toBe('function')
    expect(typeof Intl.RelativeTimeFormat).toBe('function')
  })

  it('古いブラウザでのフォールバック動作', () => {
    // Intl APIが無い場合のモック
    const originalIntl = global.Intl
    
    // @ts-ignore
    delete global.Intl
    
    const { formatCulturalNumber } = useGlobalI18n()
    const result = formatCulturalNumber(1234.56)
    
    expect(typeof result).toBe('string')
    
    // 復元
    global.Intl = originalIntl
  })
})