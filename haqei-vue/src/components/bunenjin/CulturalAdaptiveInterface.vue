<template>
  <div 
    class="cultural-adaptive-interface" 
    :class="[
      `culture-${currentCulture}`,
      `language-${currentLanguage}`,
      { 
        'high-contrast': accessibilitySettings.highContrast,
        'large-text': accessibilitySettings.largeText,
        'reduced-motion': accessibilitySettings.reducedMotion
      }
    ]"
    :dir="isRTL ? 'rtl' : 'ltr'"
    :lang="currentLanguage"
  >
    <!-- 文化的コンテキストヘッダー -->
    <header class="cultural-header" role="banner">
      <div class="cultural-context-indicator">
        <div class="culture-symbol">{{ cultureConfig.symbol }}</div>
        <div class="culture-info">
          <h1 class="main-title">{{ translate('app.title') }}</h1>
          <p class="cultural-subtitle">{{ cultureConfig.subtitle }}</p>
        </div>
      </div>
      
      <!-- 文化・言語切り替え -->
      <div class="cultural-controls">
        <div class="language-selector">
          <label for="language-select" class="sr-only">{{ translate('accessibility.selectLanguage') }}</label>
          <select 
            id="language-select"
            v-model="currentLanguage" 
            @change="changeLanguage"
            class="cultural-select"
          >
            <option 
              v-for="lang in availableLanguages" 
              :key="lang.code"
              :value="lang.code"
            >
              {{ lang.flag }} {{ lang.name }}
            </option>
          </select>
        </div>
        
        <div class="culture-selector">
          <label for="culture-select" class="sr-only">{{ translate('accessibility.selectCulture') }}</label>
          <select 
            id="culture-select"
            v-model="currentCulture" 
            @change="changeCulture"
            class="cultural-select"
          >
            <option 
              v-for="culture in availableCultures" 
              :key="culture.code"
              :value="culture.code"
            >
              {{ culture.symbol }} {{ culture.name }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <!-- 文化適応型ナビゲーション -->
    <nav class="cultural-navigation" role="navigation" :aria-label="translate('navigation.main')">
      <div class="nav-container">
        <div 
          v-for="navItem in culturalNavigation" 
          :key="navItem.id"
          class="nav-item"
          :class="{ active: activeNavItem === navItem.id }"
        >
          <button 
            class="nav-button"
            @click="navigateTo(navItem.id)"
            :aria-current="activeNavItem === navItem.id ? 'page' : null"
          >
            <span class="nav-icon" :style="{ color: navItem.color }">
              {{ navItem.icon }}
            </span>
            <span class="nav-label">{{ translate(navItem.labelKey) }}</span>
            <span class="nav-description" v-if="navItem.descriptionKey">
              {{ translate(navItem.descriptionKey) }}
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 文化的適応コンテンツエリア -->
    <main class="cultural-content" role="main">
      <!-- 東洋的思想コンテナ（東アジア文化向け） -->
      <section 
        v-if="isEasternCulture" 
        class="eastern-wisdom-container"
        :aria-label="translate('sections.easternWisdom')"
      >
        <div class="wisdom-header">
          <h2 class="wisdom-title">{{ translate('wisdom.title') }}</h2>
          <div class="philosophical-symbols">
            <div class="taiji-container">
              <div class="taiji-symbol" :class="{ spinning: !accessibilitySettings.reducedMotion }">
                ☯
              </div>
            </div>
            <div class="bagua-indicators">
              <div 
                v-for="trigram in basicTrigrams" 
                :key="trigram.id"
                class="bagua-symbol"
                :title="trigram.meaning"
              >
                {{ trigram.symbol }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="wisdom-content">
          <div class="philosophical-quote">
            <blockquote>
              {{ cultureConfig.philosophicalQuote }}
            </blockquote>
            <cite>{{ cultureConfig.philosophicalSource }}</cite>
          </div>
        </div>
      </section>

      <!-- 西洋的理論コンテナ（西洋文化向け） -->
      <section 
        v-if="isWesternCulture" 
        class="western-theory-container"
        :aria-label="translate('sections.westernTheory')"
      >
        <div class="theory-header">
          <h2 class="theory-title">{{ translate('theory.title') }}</h2>
          <div class="scientific-indicators">
            <div class="psychology-symbol">🧠</div>
            <div class="data-symbol">📊</div>
            <div class="analysis-symbol">🔬</div>
          </div>
        </div>
        
        <div class="theory-content">
          <div class="scientific-explanation">
            <h3>{{ translate('theory.subtitle') }}</h3>
            <p>{{ cultureConfig.scientificExplanation }}</p>
          </div>
        </div>
      </section>

      <!-- ユニバーサル bunenjin コンテンツ -->
      <section class="bunenjin-universal" :aria-label="translate('sections.bunenjinCore')">
        <div class="multifaceted-presentation">
          <h2 class="universal-title">{{ translate('bunenjin.title') }}</h2>
          
          <!-- 4つの柱の文化的表現 -->
          <div class="pillars-grid">
            <div 
              v-for="pillar in culturalPillars" 
              :key="pillar.id"
              class="pillar-card"
              :class="`pillar-${pillar.id}`"
            >
              <div class="pillar-header">
                <div class="pillar-icon">{{ pillar.icon }}</div>
                <h3 class="pillar-title">{{ translate(pillar.titleKey) }}</h3>
              </div>
              
              <div class="pillar-content">
                <p class="pillar-description">{{ translate(pillar.descriptionKey) }}</p>
                
                <!-- 文化固有の例示 -->
                <div class="cultural-examples">
                  <h4 class="examples-title">{{ translate('examples.title') }}</h4>
                  <ul class="examples-list">
                    <li 
                      v-for="example in pillar.culturalExamples[currentCulture]" 
                      :key="example"
                    >
                      {{ example }}
                    </li>
                  </ul>
                </div>
                
                <!-- 視覚的メタファー -->
                <div class="visual-metaphor">
                  <div 
                    class="metaphor-visualization"
                    :style="{ 
                      backgroundImage: `url(${pillar.metaphors[currentCulture].image})`,
                      color: pillar.metaphors[currentCulture].color
                    }"
                  >
                    <span class="metaphor-text">
                      {{ pillar.metaphors[currentCulture].text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- インタラクティブな文化的探索 -->
      <section class="cultural-exploration" :aria-label="translate('sections.culturalExploration')">
        <h2 class="exploration-title">{{ translate('exploration.title') }}</h2>
        
        <div class="exploration-interface">
          <!-- 文化的価値観の比較 -->
          <div class="values-comparison">
            <h3>{{ translate('exploration.valuesTitle') }}</h3>
            <div class="values-radar">
              <canvas 
                ref="valuesRadarCanvas" 
                class="radar-canvas"
                :aria-label="translate('accessibility.valuesChart')"
              ></canvas>
              <div class="radar-legend">
                <div 
                  v-for="dimension in culturalDimensions" 
                  :key="dimension.id"
                  class="legend-item"
                >
                  <div 
                    class="legend-color" 
                    :style="{ backgroundColor: dimension.color }"
                  ></div>
                  <span class="legend-label">{{ translate(dimension.labelKey) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 文化的適応性テスト -->
          <div class="adaptability-test">
            <h3>{{ translate('exploration.adaptabilityTitle') }}</h3>
            <div class="test-scenarios">
              <div 
                v-for="scenario in culturalScenarios" 
                :key="scenario.id"
                class="scenario-card"
                :class="{ expanded: expandedScenario === scenario.id }"
              >
                <button 
                  class="scenario-trigger"
                  @click="toggleScenario(scenario.id)"
                  :aria-expanded="expandedScenario === scenario.id"
                  :aria-controls="`scenario-content-${scenario.id}`"
                >
                  <span class="scenario-flag">{{ scenario.cultureFlag }}</span>
                  <span class="scenario-title">{{ translate(scenario.titleKey) }}</span>
                  <span class="scenario-indicator">
                    {{ expandedScenario === scenario.id ? '−' : '+' }}
                  </span>
                </button>
                
                <div 
                  :id="`scenario-content-${scenario.id}`"
                  class="scenario-content"
                  v-show="expandedScenario === scenario.id"
                >
                  <p class="scenario-description">{{ translate(scenario.descriptionKey) }}</p>
                  
                  <div class="response-options">
                    <h4>{{ translate('exploration.responseOptions') }}</h4>
                    <div class="options-grid">
                      <button 
                        v-for="option in scenario.options" 
                        :key="option.id"
                        class="response-option"
                        :class="{ selected: selectedOptions[scenario.id] === option.id }"
                        @click="selectOption(scenario.id, option.id)"
                      >
                        <span class="option-icon">{{ option.icon }}</span>
                        <span class="option-text">{{ translate(option.textKey) }}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div v-if="selectedOptions[scenario.id]" class="cultural-feedback">
                    <h5>{{ translate('exploration.culturalInsight') }}</h5>
                    <p>{{ getCulturalFeedback(scenario.id, selectedOptions[scenario.id]) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- アクセシビリティ・包摂性コントロール -->
    <aside class="accessibility-panel" role="complementary" :aria-label="translate('accessibility.settings')">
      <h2 class="accessibility-title">{{ translate('accessibility.title') }}</h2>
      
      <div class="accessibility-controls">
        <!-- コントラスト設定 -->
        <div class="control-group">
          <label class="control-label">
            <input 
              type="checkbox" 
              v-model="accessibilitySettings.highContrast"
              @change="updateAccessibilitySettings"
            />
            <span class="checkmark"></span>
            {{ translate('accessibility.highContrast') }}
          </label>
        </div>
        
        <!-- フォントサイズ設定 -->
        <div class="control-group">
          <label class="control-label">
            <input 
              type="checkbox" 
              v-model="accessibilitySettings.largeText"
              @change="updateAccessibilitySettings"
            />
            <span class="checkmark"></span>
            {{ translate('accessibility.largeText') }}
          </label>
        </div>
        
        <!-- アニメーション設定 -->
        <div class="control-group">
          <label class="control-label">
            <input 
              type="checkbox" 
              v-model="accessibilitySettings.reducedMotion"
              @change="updateAccessibilitySettings"
            />
            <span class="checkmark"></span>
            {{ translate('accessibility.reducedMotion') }}
          </label>
        </div>
        
        <!-- 音声ガイド設定 -->
        <div class="control-group">
          <label class="control-label">
            <input 
              type="checkbox" 
              v-model="accessibilitySettings.audioGuide"
              @change="updateAccessibilitySettings"
            />
            <span class="checkmark"></span>
            {{ translate('accessibility.audioGuide') }}
          </label>
        </div>
        
        <!-- キーボードナビゲーション表示 -->
        <div class="control-group">
          <button 
            class="keyboard-help-button"
            @click="showKeyboardHelp = !showKeyboardHelp"
            :aria-expanded="showKeyboardHelp"
          >
            {{ translate('accessibility.keyboardHelp') }}
          </button>
        </div>
      </div>
      
      <!-- キーボードショートカットヘルプ -->
      <div v-show="showKeyboardHelp" class="keyboard-help" role="dialog" aria-live="polite">
        <h3>{{ translate('accessibility.keyboardShortcuts') }}</h3>
        <dl class="shortcuts-list">
          <div v-for="shortcut in keyboardShortcuts" :key="shortcut.key">
            <dt class="shortcut-key">{{ shortcut.key }}</dt>
            <dd class="shortcut-description">{{ translate(shortcut.descriptionKey) }}</dd>
          </div>
        </dl>
      </div>
    </aside>

    <!-- 音声ガイダンスシステム -->
    <div v-if="accessibilitySettings.audioGuide" class="audio-guidance-system">
      <button 
        class="audio-control"
        @click="toggleAudioGuidance"
        :aria-label="audioPlaying ? translate('accessibility.pauseAudio') : translate('accessibility.playAudio')"
      >
        <span class="audio-icon">{{ audioPlaying ? '⏸️' : '▶️' }}</span>
      </button>
      
      <div class="audio-transcript" v-if="currentAudioTranscript">
        <h4>{{ translate('accessibility.transcript') }}</h4>
        <p>{{ currentAudioTranscript }}</p>
      </div>
    </div>

    <!-- ライブリージョン（スクリーンリーダー用） -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ liveAnnouncement }}
    </div>
    
    <div aria-live="assertive" aria-atomic="true" class="sr-only">
      {{ urgentAnnouncement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * CulturalAdaptiveInterface - 多文化対応・包摂的アクセシビリティUIコンポーネント
 * 
 * 特徴：
 * - 東洋・西洋文化圏への動的適応
 * - WCAG 2.1 AA準拠のアクセシビリティ
 * - RTL言語サポート
 * - 文化的価値観の視覚化
 * - 包摂的デザインパターン
 * - 音声ガイダンスシステム
 * - キーボードナビゲーション完全対応
 */

interface Language {
  code: string
  name: string
  flag: string
  direction: 'ltr' | 'rtl'
}

interface Culture {
  code: string
  name: string
  symbol: string
  subtitle: string
  philosophicalQuote: string
  philosophicalSource: string
  scientificExplanation?: string
}

interface NavigationItem {
  id: string
  icon: string
  color: string
  labelKey: string
  descriptionKey?: string
}

interface CulturalPillar {
  id: string
  icon: string
  titleKey: string
  descriptionKey: string
  culturalExamples: Record<string, string[]>
  metaphors: Record<string, {
    text: string
    color: string
    image: string
  }>
}

interface CulturalDimension {
  id: string
  labelKey: string
  color: string
  values: Record<string, number>
}

interface CulturalScenario {
  id: string
  cultureFlag: string
  titleKey: string
  descriptionKey: string
  options: {
    id: string
    icon: string
    textKey: string
  }[]
}

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  audioGuide: boolean
}

interface KeyboardShortcut {
  key: string
  descriptionKey: string
}

const { t, locale } = useI18n()

// TypeScript用のtヘルパー関数
const translate = (key: string, params?: Record<string, any>) => {
  try {
    return t(key, params)
  } catch {
    return key
  }
}

// 言語・文化設定
const currentLanguage = ref('ja')
const currentCulture = ref('east-asian')

const availableLanguages = ref<Language[]>([
  { code: 'ja', name: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', direction: 'rtl' }
])

const availableCultures = ref<Culture[]>([
  {
    code: 'east-asian',
    name: '東アジア文化圏',
    symbol: '☯',
    subtitle: '調和・相互依存・集団主義の智慧',
    philosophicalQuote: '一陰一陽之謂道',
    philosophicalSource: '易経・繫辞上伝'
  },
  {
    code: 'western',
    name: '西洋文化圏',
    symbol: '🏛️',
    subtitle: '個人主義・論理思考・科学的分析',
    philosophicalQuote: 'Know thyself',
    philosophicalSource: 'Ancient Greek Philosophy',
    scientificExplanation: 'Evidence-based personality analysis using validated psychological frameworks.'
  },
  {
    code: 'middle-eastern',
    name: '中東文化圏',
    symbol: '🕌',
    subtitle: '伝統・家族・精神性の重視',
    philosophicalQuote: 'من عرف نفسه فقد عرف ربه',
    philosophicalSource: 'Islamic Philosophy'
  },
  {
    code: 'african',
    name: 'アフリカ文化圏',
    symbol: '🌍',
    subtitle: 'Ubuntu・共同体・祖先の智慧',
    philosophicalQuote: 'I am because we are',
    philosophicalSource: 'Ubuntu Philosophy'
  }
])

// UI状態
const activeNavItem = ref('home')
const expandedScenario = ref('')
const selectedOptions = ref<Record<string, string>>({})
const showKeyboardHelp = ref(false)

// アクセシビリティ設定
const accessibilitySettings = ref<AccessibilitySettings>({
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  audioGuide: false
})

// 音声ガイダンス
const audioPlaying = ref(false)
const currentAudioTranscript = ref('')

// スクリーンリーダー用
const liveAnnouncement = ref('')
const urgentAnnouncement = ref('')

// 計算プロパティ
const isRTL = computed(() => {
  const currentLang = availableLanguages.value.find(lang => lang.code === currentLanguage.value)
  return currentLang?.direction === 'rtl'
})

const isEasternCulture = computed(() => 
  ['east-asian', 'middle-eastern'].includes(currentCulture.value)
)

const isWesternCulture = computed(() => 
  currentCulture.value === 'western'
)

const cultureConfig = computed(() => 
  availableCultures.value.find(culture => culture.code === currentCulture.value) || availableCultures.value[0]
)

// 文化適応型ナビゲーション
const culturalNavigation = computed<NavigationItem[]>(() => [
  {
    id: 'home',
    icon: isEasternCulture.value ? '🏠' : '🏡',
    color: '#4a90e2',
    labelKey: 'navigation.home',
    descriptionKey: 'navigation.homeDesc'
  },
  {
    id: 'analysis',
    icon: isEasternCulture.value ? '🔍' : '📊',
    color: '#ff6b6b',
    labelKey: 'navigation.analysis',
    descriptionKey: 'navigation.analysisDesc'
  },
  {
    id: 'wisdom',
    icon: isEasternCulture.value ? '☯' : '🧠',
    color: '#4ecdc4',
    labelKey: 'navigation.wisdom',
    descriptionKey: 'navigation.wisdomDesc'
  },
  {
    id: 'community',
    icon: currentCulture.value === 'african' ? '🌍' : '👥',
    color: '#45b7d1',
    labelKey: 'navigation.community',
    descriptionKey: 'navigation.communityDesc'
  }
])

// 基本八卦
const basicTrigrams = ref([
  { id: 'qian', symbol: '☰', meaning: '乾・天' },
  { id: 'kun', symbol: '☷', meaning: '坤・地' },
  { id: 'zhen', symbol: '☳', meaning: '震・雷' },
  { id: 'xun', symbol: '☴', meaning: '巽・風' },
  { id: 'kan', symbol: '☵', meaning: '坎・水' },
  { id: 'li', symbol: '☲', meaning: '離・火' },
  { id: 'gen', symbol: '☶', meaning: '艮・山' },
  { id: 'dui', symbol: '☱', meaning: '兌・沢' }
])

// bunenjin 4つの柱の文化的表現
const culturalPillars = ref<CulturalPillar[]>([
  {
    id: 'multifaceted',
    icon: '🎭',
    titleKey: 'bunenjin.pillars.multifaceted.title',
    descriptionKey: 'bunenjin.pillars.multifaceted.description',
    culturalExamples: {
      'east-asian': ['陰陽の両面性', '中庸の思想', '表と裏の文化'],
      'western': ['Cognitive flexibility', 'Multiple perspectives', 'Paradoxical thinking'],
      'middle-eastern': ['Zahir and Batin', 'Inner and outer wisdom', 'Sufi mysticism'],
      'african': ['Ubuntu interconnectedness', 'Multiple identities', 'Ancestral guidance']
    },
    metaphors: {
      'east-asian': { text: '水のように形を変える', color: '#4a90e2', image: '/images/water-metaphor.jpg' },
      'western': { text: 'Like a multifaceted diamond', color: '#9c27b0', image: '/images/diamond-metaphor.jpg' },
      'middle-eastern': { text: 'كالنجمة ذات الوجوه المتعددة', color: '#ff9800', image: '/images/star-metaphor.jpg' },
      'african': { text: 'Like the baobab tree', color: '#4caf50', image: '/images/baobab-metaphor.jpg' }
    }
  },
  {
    id: 'harmony',
    icon: '⚖️',
    titleKey: 'bunenjin.pillars.harmony.title',
    descriptionKey: 'bunenjin.pillars.harmony.description',
    culturalExamples: {
      'east-asian': ['和を以て貴しとなす', '中道の実践', '調和の美学'],
      'western': ['Work-life balance', 'Emotional regulation', 'Conflict resolution'],
      'middle-eastern': ['Mizan (balance)', 'Golden mean', 'Spiritual equilibrium'],
      'african': ['Community harmony', 'Collective decision-making', 'Ubuntu balance']
    },
    metaphors: {
      'east-asian': { text: '天秤のような均衡', color: '#4ecdc4', image: '/images/balance-metaphor.jpg' },
      'western': { text: 'Like a perfectly tuned orchestra', color: '#e91e63', image: '/images/orchestra-metaphor.jpg' },
      'middle-eastern': { text: 'كالميزان المعتدل', color: '#795548', image: '/images/scale-metaphor.jpg' },
      'african': { text: 'Like the rhythm of drums', color: '#ff5722', image: '/images/drums-metaphor.jpg' }
    }
  },
  {
    id: 'change',
    icon: '🌊',
    titleKey: 'bunenjin.pillars.change.title',
    descriptionKey: 'bunenjin.pillars.change.description',
    culturalExamples: {
      'east-asian': ['無常の受容', '変化こそ不変', '流水の智慧'],
      'western': ['Adaptation strategies', 'Growth mindset', 'Resilience building'],
      'middle-eastern': ['Tawhid and change', 'Divine flow', 'Spiritual transformation'],
      'african': ['Seasonal wisdom', 'Ancestral adaptation', 'Community evolution']
    },
    metaphors: {
      'east-asian': { text: '川の流れのように', color: '#2196f3', image: '/images/river-metaphor.jpg' },
      'western': { text: 'Like evolution in action', color: '#8bc34a', image: '/images/evolution-metaphor.jpg' },
      'middle-eastern': { text: 'كالرياح المتغيرة', color: '#607d8b', image: '/images/wind-metaphor.jpg' },
      'african': { text: 'Like the changing seasons', color: '#ffc107', image: '/images/seasons-metaphor.jpg' }
    }
  },
  {
    id: 'strategy',
    icon: '🧭',
    titleKey: 'bunenjin.pillars.strategy.title',
    descriptionKey: 'bunenjin.pillars.strategy.description',
    culturalExamples: {
      'east-asian': ['兵法の智慧', '先を読む力', '状況判断'],
      'western': ['Strategic planning', 'Decision frameworks', 'Goal optimization'],
      'middle-eastern': ['Hikma (wisdom)', 'Spiritual discernment', 'Divine guidance'],
      'african': ['Elder council wisdom', 'Collective strategy', 'Ancestral guidance']
    },
    metaphors: {
      'east-asian': { text: '羅針盤のような導き', color: '#ff9800', image: '/images/compass-metaphor.jpg' },
      'western': { text: 'Like a GPS navigation system', color: '#3f51b5', image: '/images/gps-metaphor.jpg' },
      'middle-eastern': { text: 'كالبوصلة الروحية', color: '#9e9e9e', image: '/images/spiritual-compass.jpg' },
      'african': { text: 'Like the North Star', color: '#ffeb3b', image: '/images/star-navigation.jpg' }
    }
  }
])

// 文化的価値観の次元
const culturalDimensions = ref<CulturalDimension[]>([
  {
    id: 'individualism',
    labelKey: 'dimensions.individualism',
    color: '#f44336',
    values: {
      'east-asian': 20,
      'western': 80,
      'middle-eastern': 40,
      'african': 30
    }
  },
  {
    id: 'hierarchy',
    labelKey: 'dimensions.hierarchy',
    color: '#9c27b0',
    values: {
      'east-asian': 70,
      'western': 40,
      'middle-eastern': 80,
      'african': 60
    }
  },
  {
    id: 'uncertainty',
    labelKey: 'dimensions.uncertainty',
    color: '#2196f3',
    values: {
      'east-asian': 60,
      'western': 50,
      'middle-eastern': 70,
      'african': 40
    }
  },
  {
    id: 'longterm',
    labelKey: 'dimensions.longterm',
    color: '#4caf50',
    values: {
      'east-asian': 85,
      'western': 60,
      'middle-eastern': 75,
      'african': 90
    }
  }
])

// 文化的シナリオ
const culturalScenarios = ref<CulturalScenario[]>([
  {
    id: 'conflict-resolution',
    cultureFlag: '🤝',
    titleKey: 'scenarios.conflict.title',
    descriptionKey: 'scenarios.conflict.description',
    options: [
      { id: 'direct', icon: '⚡', textKey: 'scenarios.conflict.options.direct' },
      { id: 'mediated', icon: '🕊️', textKey: 'scenarios.conflict.options.mediated' },
      { id: 'indirect', icon: '🌸', textKey: 'scenarios.conflict.options.indirect' },
      { id: 'avoidance', icon: '🦋', textKey: 'scenarios.conflict.options.avoidance' }
    ]
  },
  {
    id: 'decision-making',
    cultureFlag: '🤔',
    titleKey: 'scenarios.decision.title',
    descriptionKey: 'scenarios.decision.description',
    options: [
      { id: 'individual', icon: '🧠', textKey: 'scenarios.decision.options.individual' },
      { id: 'consensus', icon: '👥', textKey: 'scenarios.decision.options.consensus' },
      { id: 'authority', icon: '👑', textKey: 'scenarios.decision.options.authority' },
      { id: 'intuitive', icon: '💫', textKey: 'scenarios.decision.options.intuitive' }
    ]
  }
])

// キーボードショートカット
const keyboardShortcuts = ref<KeyboardShortcut[]>([
  { key: 'Tab', descriptionKey: 'shortcuts.tab' },
  { key: 'Enter', descriptionKey: 'shortcuts.enter' },
  { key: 'Space', descriptionKey: 'shortcuts.space' },
  { key: 'Esc', descriptionKey: 'shortcuts.escape' },
  { key: 'Alt + L', descriptionKey: 'shortcuts.language' },
  { key: 'Alt + C', descriptionKey: 'shortcuts.culture' },
  { key: 'Ctrl + H', descriptionKey: 'shortcuts.help' }
])

// レーダーチャート用のCanvasリファレンス
const valuesRadarCanvas = ref<HTMLCanvasElement>()

// メソッド
const changeLanguage = () => {
  locale.value = currentLanguage.value
  liveAnnouncement.value = translate('announcements.languageChanged', { language: currentLanguage.value })
}

const changeCulture = () => {
  liveAnnouncement.value = translate('announcements.cultureChanged', { culture: currentCulture.value })
}

const navigateTo = (itemId: string) => {
  activeNavItem.value = itemId
  liveAnnouncement.value = translate('announcements.navigated', { item: translate(`navigation.${itemId}`) })
}

const toggleScenario = (scenarioId: string) => {
  expandedScenario.value = expandedScenario.value === scenarioId ? '' : scenarioId
}

const selectOption = (scenarioId: string, optionId: string) => {
  selectedOptions.value[scenarioId] = optionId
  liveAnnouncement.value = translate('announcements.optionSelected')
}

const getCulturalFeedback = (scenarioId: string, optionId: string): string => {
  // 文化的コンテキストに基づいたフィードバックを生成
  const culturalContext = {
    'east-asian': {
      'conflict-resolution': {
        'indirect': '東アジア文化では、面子を保ちながら調和を重視するアプローチが好まれます。',
        'mediated': '第三者による仲裁は、直接的な対立を避ける智慧として評価されます。'
      }
    },
    'western': {
      'conflict-resolution': {
        'direct': '西洋文化では、率直で透明性のあるコミュニケーションが重視されます。',
        'mediated': 'プロフェッショナルな仲裁による解決は効率的で公正と考えられます。'
      }
    }
  }
  
  return culturalContext[currentCulture.value]?.[scenarioId]?.[optionId] || 
         translate('feedback.generic', { option: optionId })
}

const updateAccessibilitySettings = () => {
  // アクセシビリティ設定の変更を適用
  if (accessibilitySettings.value.reducedMotion) {
    document.documentElement.style.setProperty('--transition-duration', '0s')
  } else {
    document.documentElement.style.removeProperty('--transition-duration')
  }
  
  liveAnnouncement.value = translate('announcements.accessibilityUpdated')
}

const toggleAudioGuidance = () => {
  audioPlaying.value = !audioPlaying.value
  if (audioPlaying.value) {
    currentAudioTranscript.value = translate('audio.welcome')
  } else {
    currentAudioTranscript.value = ''
  }
}

const drawValuesRadar = () => {
  const canvas = valuesRadarCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 20
  
  // レーダーチャートを描画
  culturalDimensions.value.forEach((dimension, index) => {
    const angle = (index * 2 * Math.PI) / culturalDimensions.value.length - Math.PI / 2
    const value = dimension.values[currentCulture.value] || 50
    const distance = (value / 100) * radius
    
    const x = centerX + Math.cos(angle) * distance
    const y = centerY + Math.sin(angle) * distance
    
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = dimension.color
    ctx.fill()
  })
}

// キーボードナビゲーション
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.altKey && event.key === 'l') {
    event.preventDefault()
    // 言語選択にフォーカス
    const languageSelect = document.getElementById('language-select')
    languageSelect?.focus()
  } else if (event.altKey && event.key === 'c') {
    event.preventDefault()
    // 文化選択にフォーカス
    const cultureSelect = document.getElementById('culture-select')
    cultureSelect?.focus()
  } else if (event.ctrlKey && event.key === 'h') {
    event.preventDefault()
    showKeyboardHelp.value = !showKeyboardHelp.value
  }
}

// ライフサイクル
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  
  nextTick(() => {
    drawValuesRadar()
  })
})

watch(currentCulture, () => {
  nextTick(() => {
    drawValuesRadar()
  })
})
</script>

<style scoped>
.cultural-adaptive-interface {
  min-height: 100vh;
  padding: var(--ma-social);
  background: var(--paper-texture);
  transition: all var(--transition-base);
  font-family: var(--font-family-base);
}

/* 文化別基本スタイル */
.culture-east-asian {
  --primary-accent: #d32f2f;
  --secondary-accent: #1976d2;
  --harmony-accent: #388e3c;
  font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
}

.culture-western {
  --primary-accent: #1976d2;
  --secondary-accent: #388e3c;
  --harmony-accent: #f57c00;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
}

.culture-middle-eastern {
  --primary-accent: #ff8f00;
  --secondary-accent: #5d4037;
  --harmony-accent: #7b1fa2;
  font-family: 'Noto Sans Arabic', 'Arial', sans-serif;
}

.culture-african {
  --primary-accent: #f57c00;
  --secondary-accent: #d32f2f;
  --harmony-accent: #388e3c;
  font-family: 'Ubuntu', 'Segoe UI', sans-serif;
}

/* RTL言語サポート */
[dir="rtl"] .cultural-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .cultural-controls {
  flex-direction: row-reverse;
}

[dir="rtl"] .nav-container {
  flex-direction: row-reverse;
}

/* アクセシビリティ強化 */
.high-contrast {
  --primary-accent: #000000;
  --secondary-accent: #ffffff;
  --text-primary: #000000;
  --bg-primary: #ffffff;
  filter: contrast(2);
}

.large-text {
  font-size: 1.25em;
}

.reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* 文化的ヘッダー */
.cultural-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.618rem;
  margin-bottom: var(--ma-social);
  box-shadow: var(--shadow-md);
}

.cultural-context-indicator {
  display: flex;
  align-items: center;
  gap: var(--ma-social);
}

.culture-symbol {
  font-size: 3rem;
  line-height: 1;
}

.main-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: var(--ma-intimate);
  color: var(--primary-accent);
}

.cultural-subtitle {
  font-size: 1rem;
  color: var(--wabi-grey);
  margin: 0;
}

.cultural-controls {
  display: flex;
  gap: var(--ma-social);
  align-items: center;
}

.cultural-select {
  padding: var(--ma-personal);
  border: 2px solid var(--primary-accent);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.cultural-select:focus {
  outline: 2px solid var(--harmony-accent);
  outline-offset: 2px;
}

/* 文化適応型ナビゲーション */
.cultural-navigation {
  margin-bottom: var(--ma-contemplative);
}

.nav-container {
  display: flex;
  gap: var(--ma-social);
  justify-content: center;
  flex-wrap: wrap;
}

.nav-item {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.nav-button {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-personal);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 1rem;
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
}

.nav-button:hover,
.nav-button:focus {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.nav-item.active .nav-button {
  background: var(--primary-accent);
  color: white;
}

.nav-icon {
  font-size: 2rem;
}

.nav-label {
  font-size: 1.125rem;
  font-weight: 600;
}

.nav-description {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 東洋的思想コンテナ */
.eastern-wisdom-container {
  background: 
    radial-gradient(circle at 20% 20%, rgba(212, 47, 47, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%),
    var(--paper-texture);
  padding: var(--ma-contemplative);
  border-radius: 1.618rem;
  margin-bottom: var(--ma-contemplative);
  border: 1px solid rgba(212, 47, 47, 0.2);
}

.wisdom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ma-social);
}

.wisdom-title {
  font-size: 1.5rem;
  color: var(--primary-accent);
  font-weight: 600;
}

.philosophical-symbols {
  display: flex;
  align-items: center;
  gap: var(--ma-social);
}

.taiji-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.taiji-symbol {
  font-size: 2rem;
  display: inline-block;
}

.taiji-symbol.spinning {
  animation: zenFloat 6s ease-in-out infinite;
}

.bagua-indicators {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ma-intimate);
}

.bagua-symbol {
  font-size: 1.25rem;
  text-align: center;
  cursor: help;
  transition: all var(--transition-base);
}

.bagua-symbol:hover {
  transform: scale(1.2);
}

.philosophical-quote {
  text-align: center;
  margin-top: var(--ma-social);
}

.philosophical-quote blockquote {
  font-size: 1.25rem;
  font-style: italic;
  color: var(--primary-accent);
  margin-bottom: var(--ma-personal);
  position: relative;
  padding: var(--ma-social);
}

.philosophical-quote blockquote::before,
.philosophical-quote blockquote::after {
  content: '"';
  font-size: 2rem;
  color: var(--secondary-accent);
  position: absolute;
}

.philosophical-quote blockquote::before {
  top: 0;
  left: 0;
}

.philosophical-quote blockquote::after {
  bottom: 0;
  right: 0;
}

.philosophical-quote cite {
  font-size: 0.875rem;
  color: var(--wabi-grey);
}

/* 西洋的理論コンテナ */
.western-theory-container {
  background: 
    linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(56, 142, 60, 0.05) 100%),
    var(--paper-texture);
  padding: var(--ma-contemplative);
  border-radius: 1.618rem;
  margin-bottom: var(--ma-contemplative);
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.theory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ma-social);
}

.theory-title {
  font-size: 1.5rem;
  color: var(--primary-accent);
  font-weight: 600;
}

.scientific-indicators {
  display: flex;
  gap: var(--ma-social);
  font-size: 1.5rem;
}

.scientific-explanation h3 {
  font-size: 1.25rem;
  margin-bottom: var(--ma-personal);
  color: var(--secondary-accent);
}

.scientific-explanation p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--wabi-grey);
}

/* bunenjin柱のグリッド */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--ma-social);
  margin-top: var(--ma-social);
}

.pillar-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: var(--ma-social);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.pillar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--silk-shimmer);
  opacity: 0.1;
  pointer-events: none;
}

.pillar-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.pillar-header {
  display: flex;
  align-items: center;
  gap: var(--ma-personal);
  margin-bottom: var(--ma-social);
}

.pillar-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.pillar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ink-black);
}

.pillar-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--wabi-grey);
  margin-bottom: var(--ma-social);
}

.cultural-examples {
  margin-bottom: var(--ma-social);
}

.examples-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--ma-personal);
  color: var(--secondary-accent);
}

.examples-list {
  list-style: none;
  padding: 0;
}

.examples-list li {
  padding: var(--ma-intimate) 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  padding-left: var(--ma-social);
}

.examples-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary-accent);
  font-weight: bold;
}

.visual-metaphor {
  margin-top: var(--ma-social);
}

.metaphor-visualization {
  padding: var(--ma-social);
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.metaphor-visualization::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.metaphor-text {
  position: relative;
  z-index: 2;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* 文化的探索インターフェース */
.cultural-exploration {
  background: rgba(255, 255, 255, 0.95);
  padding: var(--ma-contemplative);
  border-radius: 1.618rem;
  margin-bottom: var(--ma-contemplative);
}

.exploration-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
}

.exploration-interface {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--ma-contemplative);
}

.values-comparison {
  text-align: center;
}

.values-comparison h3 {
  margin-bottom: var(--ma-social);
  color: var(--secondary-accent);
}

.values-radar {
  position: relative;
  display: inline-block;
}

.radar-canvas {
  width: 300px;
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.radar-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ma-personal);
  margin-top: var(--ma-social);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--ma-intimate);
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.legend-label {
  font-size: 0.875rem;
  color: var(--wabi-grey);
}

/* 文化的適応性テスト */
.adaptability-test h3 {
  margin-bottom: var(--ma-social);
  color: var(--secondary-accent);
}

.test-scenarios {
  display: flex;
  flex-direction: column;
  gap: var(--ma-social);
}

.scenario-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all var(--transition-base);
}

.scenario-card.expanded {
  border-color: var(--primary-accent);
  box-shadow: var(--shadow-md);
}

.scenario-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ma-social);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.scenario-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
}

.scenario-flag {
  font-size: 1.25rem;
}

.scenario-title {
  flex: 1;
  text-align: left;
  font-weight: 600;
  color: var(--ink-black);
  margin: 0 var(--ma-personal);
}

.scenario-indicator {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--primary-accent);
}

.scenario-content {
  padding: var(--ma-social);
  background: rgba(0, 0, 0, 0.02);
}

.scenario-description {
  margin-bottom: var(--ma-social);
  line-height: 1.6;
  color: var(--wabi-grey);
}

.response-options h4 {
  margin-bottom: var(--ma-personal);
  color: var(--secondary-accent);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--ma-personal);
  margin-bottom: var(--ma-social);
}

.response-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-intimate);
  padding: var(--ma-personal);
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.response-option:hover {
  border-color: var(--primary-accent);
  transform: translateY(-2px);
}

.response-option.selected {
  border-color: var(--harmony-accent);
  background: rgba(var(--harmony-accent-rgb), 0.1);
}

.option-icon {
  font-size: 1.5rem;
}

.option-text {
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
}

.cultural-feedback {
  background: rgba(var(--harmony-accent-rgb), 0.1);
  padding: var(--ma-social);
  border-radius: 0.5rem;
  border-left: 4px solid var(--harmony-accent);
}

.cultural-feedback h5 {
  margin-bottom: var(--ma-personal);
  color: var(--harmony-accent);
  font-weight: 600;
}

.cultural-feedback p {
  line-height: 1.6;
  color: var(--ink-black);
}

/* アクセシビリティパネル */
.accessibility-panel {
  position: fixed;
  top: var(--ma-social);
  right: var(--ma-social);
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: var(--ma-social);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-modal);
  max-height: 80vh;
  overflow-y: auto;
}

.accessibility-title {
  font-size: 1.125rem;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
  text-align: center;
}

.accessibility-controls {
  display: flex;
  flex-direction: column;
  gap: var(--ma-personal);
}

.control-group {
  display: flex;
  align-items: center;
}

.control-label {
  display: flex;
  align-items: center;
  gap: var(--ma-personal);
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--ink-black);
}

.control-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--primary-accent);
  border-radius: 0.25rem;
  position: relative;
  transition: all var(--transition-base);
}

.control-label input[type="checkbox"]:checked + .checkmark {
  background: var(--primary-accent);
}

.control-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
}

.keyboard-help-button {
  width: 100%;
  padding: var(--ma-personal);
  background: var(--harmony-accent);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.keyboard-help-button:hover {
  background: var(--secondary-accent);
}

.keyboard-help {
  margin-top: var(--ma-social);
  padding: var(--ma-social);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
}

.keyboard-help h3 {
  font-size: 1rem;
  margin-bottom: var(--ma-personal);
  color: var(--ink-black);
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: var(--ma-intimate);
}

.shortcuts-list div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shortcut-key {
  background: var(--ink-black);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: monospace;
}

.shortcut-description {
  font-size: 0.75rem;
  color: var(--wabi-grey);
}

/* 音声ガイダンスシステム */
.audio-guidance-system {
  position: fixed;
  bottom: var(--ma-social);
  left: var(--ma-social);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: var(--ma-social);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-fixed);
}

.audio-control {
  width: 3rem;
  height: 3rem;
  border: none;
  background: var(--primary-accent);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.125rem;
  transition: all var(--transition-base);
}

.audio-control:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.audio-transcript {
  margin-top: var(--ma-personal);
  max-width: 300px;
}

.audio-transcript h4 {
  font-size: 0.875rem;
  margin-bottom: var(--ma-intimate);
  color: var(--ink-black);
}

.audio-transcript p {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--wabi-grey);
}

/* スクリーンリーダー専用 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* レスポンシブ対応 */
@media (max-width: 1200px) {
  .accessibility-panel {
    position: relative;
    width: 100%;
    margin-bottom: var(--ma-social);
  }
  
  .exploration-interface {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cultural-header {
    flex-direction: column;
    text-align: center;
    gap: var(--ma-social);
  }
  
  .nav-container {
    flex-direction: column;
  }
  
  .pillars-grid {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .radar-canvas {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .cultural-adaptive-interface {
    padding: var(--ma-personal);
  }
  
  .cultural-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .cultural-select {
    width: 100%;
  }
}

/* ハイコントラストモード用の追加調整 */
@media (prefers-contrast: high) {
  .high-contrast {
    --primary-accent: #000000;
    --secondary-accent: #ffffff;
    --harmony-accent: #000000;
    --text-primary: #000000;
    --bg-primary: #ffffff;
  }
  
  .high-contrast .pillar-card,
  .high-contrast .nav-button,
  .high-contrast .response-option {
    border-width: 3px;
  }
}

/* 動きを控えめにする設定 */
@media (prefers-reduced-motion: reduce) {
  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .taiji-symbol.spinning {
    animation: none;
  }
}
</style>