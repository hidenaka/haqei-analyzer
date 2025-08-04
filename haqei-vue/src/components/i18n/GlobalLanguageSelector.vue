<template>
  <div class="global-language-selector" :class="{ rtl: isRTL }">
    <!-- 言語選択ドロップダウン -->
    <div class="language-dropdown" :class="{ active: isDropdownOpen }">
      <button
        class="language-trigger"
        @click="toggleDropdown"
        :aria-label="t('accessibility.selectLanguage')"
        :aria-expanded="isDropdownOpen"
      >
        <span class="current-language">
          <span class="flag">{{ localeConfig.flag }}</span>
          <span class="name">{{ localeConfig.name }}</span>
          <span class="quality-indicator" :class="qualityClass">
            {{ Math.round(translationQuality * 100) }}%
          </span>
        </span>
        <ChevronDownIcon class="chevron" :class="{ rotated: isDropdownOpen }" />
      </button>

      <!-- ドロップダウンメニュー -->
      <div
        v-if="isDropdownOpen"
        class="dropdown-menu"
        role="menu"
        @click.stop
      >
        <!-- 検索フィルター -->
        <div class="search-section">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('common.search')"
            class="search-input"
          />
        </div>

        <!-- 推奨言語 -->
        <div v-if="suggestedLocales.length > 0" class="suggested-section">
          <h4 class="section-title">{{ t('i18n.suggested') }}</h4>
          <button
            v-for="locale in suggestedLocales.slice(0, 3)"
            :key="`suggested-${locale}`"
            class="language-option suggested"
            @click="selectLanguage(locale)"
            role="menuitem"
          >
            <span class="flag">{{ SUPPORTED_LOCALES[locale].flag }}</span>
            <span class="name">{{ SUPPORTED_LOCALES[locale].name }}</span>
            <span class="region">{{ SUPPORTED_LOCALES[locale].region }}</span>
          </button>
        </div>

        <!-- 地域別言語 -->
        <div class="regions-section">
          <div
            v-for="(languages, region) in filteredLanguagesByRegion"
            :key="region"
            class="region-group"
          >
            <h4 class="region-title">{{ region }}</h4>
            <div class="languages-grid">
              <button
                v-for="lang in languages"
                :key="lang.code"
                class="language-option"
                :class="{
                  active: lang.code === currentLocale,
                  'high-quality': lang.quality >= 0.9,
                  'culturally-sensitive': isCulturallySensitive && lang.code === currentLocale
                }"
                @click="selectLanguage(lang.code)"
                role="menuitem"
              >
                <span class="flag">{{ lang.flag }}</span>
                <span class="details">
                  <span class="name">{{ lang.name }}</span>
                  <span class="meta">
                    <span class="quality" :class="getQualityClass(lang.quality)">
                      {{ Math.round(lang.quality * 100) }}%
                    </span>
                    <span v-if="lang.rtl" class="rtl-badge">RTL</span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 言語品質レポート -->
        <div class="quality-report-section">
          <button
            class="quality-report-toggle"
            @click="showQualityReport = !showQualityReport"
          >
            <BarChartIcon class="icon" />
            {{ t('i18n.qualityReport') }}
            <ChevronDownIcon class="chevron" :class="{ rotated: showQualityReport }" />
          </button>
          
          <div v-if="showQualityReport" class="quality-report">
            <div class="stats-grid">
              <div class="stat">
                <span class="label">{{ t('i18n.totalLanguages') }}</span>
                <span class="value">{{ qualityReport.totalLanguages }}</span>
              </div>
              <div class="stat">
                <span class="label">{{ t('i18n.highQuality') }}</span>
                <span class="value">{{ qualityReport.highQualityLanguages }}</span>
              </div>
              <div class="stat">
                <span class="label">{{ t('i18n.avgQuality') }}</span>
                <span class="value">{{ Math.round(qualityReport.averageQuality * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文化的配慮アラート -->
    <div
      v-if="culturalWarnings.length > 0"
      class="cultural-alert"
      role="alert"
    >
      <ExclamationTriangleIcon class="warning-icon" />
      <div class="alert-content">
        <h5>{{ t('i18n.culturalNote') }}</h5>
        <ul>
          <li v-for="warning in culturalWarnings" :key="warning">
            {{ warning }}
          </li>
        </ul>
      </div>
    </div>

    <!-- パフォーマンス表示（開発モード） -->
    <div v-if="showPerformanceMetrics" class="performance-metrics">
      <div class="metric">
        <span class="label">{{ t('i18n.loadTime') }}</span>
        <span class="value">{{ Math.round(performanceMetrics.loadTime) }}ms</span>
      </div>
      <div class="metric">
        <span class="label">{{ t('i18n.cacheHit') }}</span>
        <span class="value">{{ Math.round(performanceMetrics.cacheHitRate * 100) }}%</span>
      </div>
    </div>

    <!-- 学習モードトグル -->
    <div v-if="showLearningMode" class="learning-mode-section">
      <label class="learning-toggle">
        <input
          type="checkbox"
          :checked="learningMode"
          @change="toggleLearningMode"
        />
        <span class="toggle-text">{{ t('i18n.learningMode') }}</span>
        <AcademicCapIcon class="icon" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGlobalI18n } from '@/composables/useGlobalI18n'
import type { SupportedLocale } from '@/i18n'
import { SUPPORTED_LOCALES } from '@/i18n'
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  BarChartIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'

interface Props {
  showPerformanceMetrics?: boolean
  showLearningMode?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPerformanceMetrics: false,
  showLearningMode: false,
  compact: false
})

const {
  currentLocale,
  localeConfig,
  isRTL,
  isLoading,
  translationQuality,
  supportedLanguages,
  languagesByRegion,
  suggestedLocales,
  changeLocale,
  checkCulturalSensitivity,
  performanceMetrics,
  learningMode,
  enableLearningMode,
  disableLearningMode,
  getPerformanceReport,
  t
} = useGlobalI18n()

// UI状態
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const showQualityReport = ref(false)
const culturalWarnings = ref<string[]>([])

// 計算されたプロパティ
const qualityClass = computed(() => {
  const quality = translationQuality.value
  if (quality >= 0.95) return 'excellent'
  if (quality >= 0.90) return 'high'
  if (quality >= 0.80) return 'medium'
  return 'low'
})

const qualityReport = computed(() => getPerformanceReport().qualityReport)

const filteredLanguagesByRegion = computed(() => {
  if (!searchQuery.value) return languagesByRegion.value

  const query = searchQuery.value.toLowerCase()
  const filtered: typeof languagesByRegion.value = {}

  Object.entries(languagesByRegion.value).forEach(([region, languages]) => {
    const matchingLanguages = languages.filter(lang =>
      lang.name.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query) ||
      region.toLowerCase().includes(query)
    )
    if (matchingLanguages.length > 0) {
      filtered[region] = matchingLanguages
    }
  })

  return filtered
})

// メソッド
function toggleDropdown(): void {
  isDropdownOpen.value = !isDropdownOpen.value
}

async function selectLanguage(locale: SupportedLocale): Promise<void> {
  if (locale === currentLocale.value) {
    isDropdownOpen.value = false
    return
  }

  try {
    await changeLocale(locale)
    isDropdownOpen.value = false
    
    // 文化的配慮チェック
    checkCulturalConsiderations()
    
    // 成功通知
    showNotification(t('i18n.languageChanged', { language: SUPPORTED_LOCALES[locale].name }))
  } catch (error) {
    console.error('Language change failed:', error)
    showNotification(t('errors.system.unexpectedError'), 'error')
  }
}

function getQualityClass(quality: number): string {
  if (quality >= 0.95) return 'excellent'
  if (quality >= 0.90) return 'high'
  if (quality >= 0.80) return 'medium'
  return 'low'
}

function checkCulturalConsiderations(): void {
  // サンプルコンテンツで文化的配慮をチェック
  const sampleContent = {
    colors: ['#FFFFFF', '#000000', '#FF0000'],
    numbers: [4, 13, 666],
    symbols: ['👍', '🐷', '🍷']
  }

  const { warnings } = checkCulturalSensitivity(sampleContent)
  culturalWarnings.value = warnings
}

function toggleLearningMode(): void {
  if (learningMode.value) {
    disableLearningMode()
  } else {
    enableLearningMode()
  }
}

function showNotification(message: string, type: 'success' | 'error' = 'success'): void {
  // 実装は通知システムに依存
  console.log(`${type.toUpperCase()}: ${message}`)
}

// 外部クリックでドロップダウンを閉じる
function handleOutsideClick(event: MouseEvent): void {
  const target = event.target as Element
  if (!target.closest('.global-language-selector')) {
    isDropdownOpen.value = false
  }
}

// ライフサイクル
onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  checkCulturalConsiderations()
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// 監視
watch(currentLocale, () => {
  checkCulturalConsiderations()
})
</script>

<style scoped lang="scss">
.global-language-selector {
  position: relative;
  font-family: var(--font-family-base);

  &.rtl {
    direction: rtl;
    text-align: right;
  }
}

.language-dropdown {
  position: relative;

  &.active .language-trigger {
    background: var(--cultural-primary);
    color: var(--cultural-surface);
    border-color: var(--cultural-primary);
  }
}

.language-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--cultural-surface);
  border: 2px solid var(--cultural-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover {
    background: var(--cultural-background);
    border-color: var(--cultural-accent);
  }

  &:focus {
    outline: 2px solid var(--cultural-accent);
    outline-offset: 2px;
  }
}

.current-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .flag {
    font-size: 1.2em;
  }

  .name {
    font-weight: 500;
    color: var(--cultural-text);
  }

  .quality-indicator {
    font-size: 0.75em;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-weight: 600;

    &.excellent {
      background: #10B981;
      color: white;
    }

    &.high {
      background: #F59E0B;
      color: white;
    }

    &.medium {
      background: #EF4444;
      color: white;
    }

    &.low {
      background: #6B7280;
      color: white;
    }
  }
}

.chevron {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--cultural-text);
  transition: transform 0.2s ease;

  &.rotated {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--cultural-surface);
  border: 2px solid var(--cultural-primary);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
  margin-top: 0.5rem;

  .rtl & {
    left: auto;
    right: 0;
  }
}

.search-section {
  padding: 1rem;
  border-bottom: 1px solid var(--cultural-background);

  .search-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--cultural-primary);
    border-radius: 4px;
    background: var(--cultural-background);
    color: var(--cultural-text);

    &:focus {
      outline: 2px solid var(--cultural-accent);
      outline-offset: 1px;
    }
  }
}

.suggested-section,
.regions-section {
  padding: 1rem;
}

.suggested-section {
  border-bottom: 1px solid var(--cultural-background);
}

.section-title,
.region-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cultural-text);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.region-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.languages-grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  .rtl & {
    text-align: right;
  }

  &:hover {
    background: var(--cultural-background);
    border-color: var(--cultural-primary);
  }

  &.active {
    background: var(--cultural-primary);
    color: var(--cultural-surface);
    border-color: var(--cultural-primary);
  }

  &.suggested {
    background: linear-gradient(135deg, var(--cultural-accent), var(--cultural-primary));
    color: var(--cultural-surface);
    border-color: var(--cultural-accent);
  }

  &.high-quality {
    position: relative;

    &::after {
      content: '⭐';
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      font-size: 0.75em;
    }

    .rtl &::after {
      right: auto;
      left: 0.25rem;
    }
  }

  .flag {
    font-size: 1.5em;
    flex-shrink: 0;
  }

  .details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .name {
    font-weight: 500;
    font-size: 0.9rem;
  }

  .region {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .quality {
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-weight: 600;

    &.excellent { background: #10B981; color: white; }
    &.high { background: #F59E0B; color: white; }
    &.medium { background: #EF4444; color: white; }
    &.low { background: #6B7280; color: white; }
  }

  .rtl-badge {
    background: var(--cultural-accent);
    color: var(--cultural-surface);
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-weight: 600;
  }
}

.quality-report-section {
  border-top: 1px solid var(--cultural-background);
  padding: 1rem;
}

.quality-report-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--cultural-text);

  .icon {
    width: 1rem;
    height: 1rem;
  }
}

.quality-report {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--cultural-background);
  border-radius: 6px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .label {
    font-size: 0.75rem;
    color: var(--cultural-text);
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--cultural-primary);
  }
}

.cultural-alert {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border: 1px solid #F59E0B;
  border-radius: 8px;
  display: flex;
  gap: 0.75rem;

  .warning-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #D97706;
    flex-shrink: 0;
  }

  .alert-content {
    h5 {
      margin: 0 0 0.5rem 0;
      font-weight: 600;
      color: #92400E;
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #78350F;

      .rtl & {
        padding-left: 0;
        padding-right: 1.5rem;
      }
    }
  }
}

.performance-metrics {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--cultural-background);
  border-radius: 6px;
  display: flex;
  gap: 1rem;
  justify-content: space-around;
  font-size: 0.875rem;

  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    .label {
      opacity: 0.7;
      font-size: 0.75rem;
    }

    .value {
      font-weight: 600;
      color: var(--cultural-primary);
    }
  }
}

.learning-mode-section {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--cultural-background);
  border-radius: 6px;
}

.learning-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  .toggle-text {
    flex: 1;
    font-weight: 500;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--cultural-primary);
  }
}

// アニメーション
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  animation: slideDown 0.2s ease;
}

// レスポンシブ対応
@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: none;
    border-radius: 0;
    margin: 0;
  }

  .languages-grid {
    grid-template-columns: 1fr;
  }
}
</style>