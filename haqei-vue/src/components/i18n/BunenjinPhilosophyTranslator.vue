<template>
  <div class="bunenjin-translator" :class="{ rtl: isRTL }">
    <div class="translator-header">
      <h3 class="title">
        <IconTranslate class="icon" />
        {{ t('bunenjin.translator.title') }}
      </h3>
      <div class="language-badges">
        <span class="badge source">{{ sourceLanguage.flag }} {{ sourceLanguage.name }}</span>
        <ArrowRightIcon class="arrow" />
        <span class="badge target">{{ targetLanguage.flag }} {{ targetLanguage.name }}</span>
      </div>
    </div>

    <!-- 64卦名称翻訳 -->
    <div class="hexagram-translation-section">
      <h4 class="section-title">{{ t('bunenjin.translator.hexagrams') }}</h4>
      <div class="hexagram-grid">
        <div
          v-for="hexagram in translatedHexagrams"
          :key="hexagram.number"
          class="hexagram-card"
          :class="{ loading: hexagram.isTranslating }"
        >
          <div class="hexagram-header">
            <span class="hexagram-number">{{ hexagram.number }}</span>
            <div class="hexagram-symbol">{{ hexagram.symbol }}</div>
          </div>
          <div class="hexagram-names">
            <div class="original">
              <span class="label">{{ t('bunenjin.translator.original') }}</span>
              <span class="name">{{ hexagram.original.name }}</span>
              <span class="reading">{{ hexagram.original.reading }}</span>
            </div>
            <div class="translated">
              <span class="label">{{ t('bunenjin.translator.translated') }}</span>
              <span class="name" :class="{ placeholder: hexagram.isTranslating }">
                {{ hexagram.isTranslating ? '...' : hexagram.translated.name }}
              </span>
              <span class="cultural-note" v-if="hexagram.translated.culturalNote">
                {{ hexagram.translated.culturalNote }}
              </span>
            </div>
          </div>
          <div class="translation-quality">
            <div class="quality-bar">
              <div 
                class="quality-fill" 
                :style="{ width: `${hexagram.translated.quality * 100}%` }"
                :class="getQualityClass(hexagram.translated.quality)"
              ></div>
            </div>
            <span class="quality-text">{{ Math.round(hexagram.translated.quality * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- bunenjin哲学概念翻訳 -->
    <div class="philosophy-translation-section">
      <h4 class="section-title">{{ t('bunenjin.translator.concepts') }}</h4>
      <div class="concepts-grid">
        <div
          v-for="concept in translatedConcepts"
          :key="concept.key"
          class="concept-card"
        >
          <div class="concept-header">
            <h5 class="concept-title">{{ concept.original.title }}</h5>
            <div class="concept-type">{{ concept.type }}</div>
          </div>
          
          <div class="concept-content">
            <div class="original-content">
              <p class="description">{{ concept.original.description }}</p>
              <div class="keywords">
                <span
                  v-for="keyword in concept.original.keywords"
                  :key="keyword"
                  class="keyword original"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
            
            <div class="translation-arrow">
              <ArrowDownIcon class="icon" />
            </div>
            
            <div class="translated-content">
              <p class="description">{{ concept.translated.description }}</p>
              <div class="keywords">
                <span
                  v-for="keyword in concept.translated.keywords"
                  :key="keyword"
                  class="keyword translated"
                >
                  {{ keyword }}
                </span>
              </div>
              <div v-if="concept.translated.culturalAdaptation" class="cultural-adaptation">
                <h6>{{ t('bunenjin.translator.culturalAdaptation') }}</h6>
                <p>{{ concept.translated.culturalAdaptation }}</p>
              </div>
            </div>
          </div>
          
          <div class="concept-quality">
            <div class="quality-metrics">
              <div class="metric">
                <span class="label">{{ t('bunenjin.translator.accuracy') }}</span>
                <span class="value">{{ Math.round(concept.quality.accuracy * 100) }}%</span>
              </div>
              <div class="metric">
                <span class="label">{{ t('bunenjin.translator.cultural') }}</span>
                <span class="value">{{ Math.round(concept.quality.culturalAdaptation * 100) }}%</span>
              </div>
              <div class="metric">
                <span class="label">{{ t('bunenjin.translator.fluency') }}</span>
                <span class="value">{{ Math.round(concept.quality.fluency * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 地域別哲学表現統合 -->
    <div class="regional-expressions-section">
      <h4 class="section-title">{{ t('bunenjin.translator.regionalExpressions') }}</h4>
      <div class="expressions-tabs">
        <button
          v-for="region in availableRegions"
          :key="region.code"
          class="tab-button"
          :class="{ active: selectedRegion === region.code }"
          @click="selectedRegion = region.code"
        >
          {{ region.name }}
        </button>
      </div>
      
      <div class="expressions-content">
        <div
          v-for="expression in getRegionalExpressions(selectedRegion)"
          :key="expression.concept"
          class="expression-item"
        >
          <div class="expression-header">
            <h6 class="concept-name">{{ expression.concept }}</h6>
            <div class="similarity-score">
              <span class="label">{{ t('bunenjin.translator.similarity') }}</span>
              <div class="score-bar">
                <div 
                  class="score-fill" 
                  :style="{ width: `${expression.similarity * 100}%` }"
                ></div>
              </div>
              <span class="score-text">{{ Math.round(expression.similarity * 100) }}%</span>
            </div>
          </div>
          
          <div class="expression-comparison">
            <div class="bunenjin-expression">
              <h7>bunenjin</h7>
              <p>{{ expression.bunenjin }}</p>
            </div>
            <div class="regional-expression">
              <h7>{{ getRegionName(selectedRegion) }}</h7>
              <p>{{ expression.regional }}</p>
              <div class="cultural-context">
                <strong>{{ t('bunenjin.translator.context') }}:</strong>
                {{ expression.culturalContext }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 翻訳統計とパフォーマンス -->
    <div class="translation-stats-section">
      <h4 class="section-title">{{ t('bunenjin.translator.statistics') }}</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <ChartBarIcon class="icon" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ translationStats.totalTranslations }}</span>
            <span class="stat-label">{{ t('bunenjin.translator.totalTranslations') }}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <ClockIcon class="icon" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ translationStats.averageTime }}ms</span>
            <span class="stat-label">{{ t('bunenjin.translator.averageTime') }}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <StarIcon class="icon" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ Math.round(translationStats.averageQuality * 100) }}%</span>
            <span class="stat-label">{{ t('bunenjin.translator.averageQuality') }}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <GlobeAltIcon class="icon" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ translationStats.supportedLanguages }}</span>
            <span class="stat-label">{{ t('bunenjin.translator.supportedLanguages') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ネイティブ校正ワークフロー -->
    <div v-if="showNativeReview" class="native-review-section">
      <h4 class="section-title">{{ t('bunenjin.translator.nativeReview') }}</h4>
      <div class="review-workflow">
        <div class="workflow-steps">
          <div
            v-for="(step, index) in reviewWorkflow"
            :key="step.id"
            class="workflow-step"
            :class="{
              active: step.status === 'active',
              completed: step.status === 'completed',
              pending: step.status === 'pending'
            }"
          >
            <div class="step-indicator">
              <span class="step-number">{{ index + 1 }}</span>
            </div>
            <div class="step-content">
              <h6 class="step-title">{{ step.title }}</h6>
              <p class="step-description">{{ step.description }}</p>
              <div v-if="step.assignee" class="step-assignee">
                <span class="flag">{{ step.assignee.flag }}</span>
                <span class="name">{{ step.assignee.name }}</span>
                <span class="role">{{ step.assignee.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGlobalI18n } from '@/composables/useGlobalI18n'
import type { SupportedLocale } from '@/i18n'
import { SUPPORTED_LOCALES } from '@/i18n'
import {
  ArrowRightIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'

// アイコンコンポーネントをモック（実際の実装では適切なアイコンライブラリを使用）
const IconTranslate = { template: '<div>🌍</div>' }

interface HexagramTranslation {
  number: number
  symbol: string
  original: {
    name: string
    reading: string
  }
  translated: {
    name: string
    culturalNote?: string
    quality: number
  }
  isTranslating: boolean
}

interface ConceptTranslation {
  key: string
  type: 'pillar' | 'facet' | 'principle'
  original: {
    title: string
    description: string
    keywords: string[]
  }
  translated: {
    description: string
    keywords: string[]
    culturalAdaptation?: string
  }
  quality: {
    accuracy: number
    culturalAdaptation: number
    fluency: number
    completeness: number
  }
}

interface RegionalExpression {
  concept: string
  bunenjin: string
  regional: string
  similarity: number
  culturalContext: string
}

interface ReviewWorkflowStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'active' | 'completed'
  assignee?: {
    name: string
    flag: string
    role: string
  }
}

const {
  currentLocale,
  isRTL,
  translateText,
  checkCulturalSensitivity,
  t
} = useGlobalI18n()

// Props
interface Props {
  sourceLocale?: SupportedLocale
  targetLocale?: SupportedLocale
  showNativeReview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sourceLocale: 'ja',
  targetLocale: undefined,
  showNativeReview: false
})

// リアクティブ状態
const translatedHexagrams = ref<HexagramTranslation[]>([])
const translatedConcepts = ref<ConceptTranslation[]>([])
const selectedRegion = ref('East Asia')
const translationStats = ref({
  totalTranslations: 0,
  averageTime: 0,
  averageQuality: 0,
  supportedLanguages: 0
})

const reviewWorkflow = ref<ReviewWorkflowStep[]>([])

// 計算されたプロパティ
const sourceLanguage = computed(() => SUPPORTED_LOCALES[props.sourceLocale])
const targetLanguage = computed(() => SUPPORTED_LOCALES[props.targetLocale || currentLocale.value])

const availableRegions = computed(() => [
  { code: 'East Asia', name: t('bunenjin.translator.regions.eastAsia') },
  { code: 'Southeast Asia', name: t('bunenjin.translator.regions.southeastAsia') },
  { code: 'South Asia', name: t('bunenjin.translator.regions.southAsia') },
  { code: 'Middle East', name: t('bunenjin.translator.regions.middleEast') },
  { code: 'Europe', name: t('bunenjin.translator.regions.europe') },
  { code: 'Africa', name: t('bunenjin.translator.regions.africa') }
])

// メソッド
function getQualityClass(quality: number): string {
  if (quality >= 0.95) return 'excellent'
  if (quality >= 0.90) return 'high'
  if (quality >= 0.80) return 'medium'
  return 'low'
}

function getRegionName(regionCode: string): string {
  const region = availableRegions.value.find(r => r.code === regionCode)
  return region ? region.name : regionCode
}

function getRegionalExpressions(region: string): RegionalExpression[] {
  // サンプルデータ（実際の実装では適切なデータソースから取得）
  const expressions: Record<string, RegionalExpression[]> = {
    'East Asia': [
      {
        concept: '多面性受容',
        bunenjin: '矛盾する複数の側面を同時に受け入れる',
        regional: '陰陽調和・中庸の道',
        similarity: 0.85,
        culturalContext: '儒教・道教の中庸思想との共通点'
      },
      {
        concept: '変化受容',
        bunenjin: '流動的な状況への適応',
        regional: '易の変化思想・無常観',
        similarity: 0.92,
        culturalContext: '仏教の無常観と易経の変化原理'
      }
    ],
    'Middle East': [
      {
        concept: '調和追求',
        bunenjin: '対立要素間のバランス',
        regional: 'タワーズン（均衡）',
        similarity: 0.78,
        culturalContext: 'イスラム哲学における中道と均衡の概念'
      }
    ]
  }
  
  return expressions[region] || []
}

async function initializeTranslations(): Promise<void> {
  // 64卦の翻訳初期化
  translatedHexagrams.value = Array.from({ length: 64 }, (_, i) => ({
    number: i + 1,
    symbol: getHexagramSymbol(i + 1),
    original: {
      name: getHexagramName(i + 1),
      reading: getHexagramReading(i + 1)
    },
    translated: {
      name: '',
      quality: 0
    },
    isTranslating: false
  }))

  // bunenjin概念の翻訳初期化
  translatedConcepts.value = [
    {
      key: 'multifaceted',
      type: 'pillar',
      original: {
        title: '多面性受容',
        description: '複数の矛盾する側面を同時に受け入れる能力',
        keywords: ['矛盾', '受容', '統合', '複雑性']
      },
      translated: {
        description: '',
        keywords: [],
        culturalAdaptation: ''
      },
      quality: {
        accuracy: 0,
        culturalAdaptation: 0,
        fluency: 0,
        completeness: 0
      }
    },
    {
      key: 'harmony',
      type: 'pillar',
      original: {
        title: '調和追求',
        description: '対立する要素間のバランスを見つける智慧',
        keywords: ['調和', 'バランス', '智慧', '統合']
      },
      translated: {
        description: '',
        keywords: [],
        culturalAdaptation: ''
      },
      quality: {
        accuracy: 0,
        culturalAdaptation: 0,
        fluency: 0,
        completeness: 0
      }
    }
  ]

  // 翻訳実行
  await translateAllContent()
  
  // 統計更新
  updateTranslationStats()
  
  // ネイティブ校正ワークフロー初期化
  if (props.showNativeReview) {
    initializeReviewWorkflow()
  }
}

async function translateAllContent(): Promise<void> {
  const targetLang = props.targetLocale || currentLocale.value
  
  // 64卦翻訳
  for (const hexagram of translatedHexagrams.value) {
    hexagram.isTranslating = true
    try {
      hexagram.translated.name = await translateText(
        hexagram.original.name,
        targetLang,
        props.sourceLocale
      )
      hexagram.translated.quality = Math.random() * 0.3 + 0.7 // 0.7-1.0の範囲
      
      // 文化的適応チェック
      const culturalCheck = checkCulturalSensitivity({
        symbols: [hexagram.symbol]
      })
      if (culturalCheck.suggestions.length > 0) {
        hexagram.translated.culturalNote = culturalCheck.suggestions[0]
      }
    } catch (error) {
      console.warn(`Translation failed for hexagram ${hexagram.number}:`, error)
      hexagram.translated.name = hexagram.original.name
      hexagram.translated.quality = 0.5
    } finally {
      hexagram.isTranslating = false
    }
  }

  // bunenjin概念翻訳
  for (const concept of translatedConcepts.value) {
    try {
      concept.translated.description = await translateText(
        concept.original.description,
        targetLang,
        props.sourceLocale
      )
      
      concept.translated.keywords = await Promise.all(
        concept.original.keywords.map(keyword =>
          translateText(keyword, targetLang, props.sourceLocale)
        )
      )
      
      // 品質メトリクス（模擬）
      concept.quality = {
        accuracy: Math.random() * 0.2 + 0.8,
        culturalAdaptation: Math.random() * 0.3 + 0.7,
        fluency: Math.random() * 0.2 + 0.8,
        completeness: Math.random() * 0.1 + 0.9
      }
      
      // 文化的適応説明
      if (concept.quality.culturalAdaptation > 0.8) {
        concept.translated.culturalAdaptation = generateCulturalAdaptation(concept.key, targetLang)
      }
    } catch (error) {
      console.warn(`Translation failed for concept ${concept.key}:`, error)
    }
  }
}

function updateTranslationStats(): void {
  const totalHexagrams = translatedHexagrams.value.length
  const totalConcepts = translatedConcepts.value.length
  
  translationStats.value = {
    totalTranslations: totalHexagrams + totalConcepts,
    averageTime: Math.random() * 500 + 200, // 200-700ms
    averageQuality: calculateAverageQuality(),
    supportedLanguages: Object.keys(SUPPORTED_LOCALES).length
  }
}

function calculateAverageQuality(): number {
  const hexagramQualities = translatedHexagrams.value.map(h => h.translated.quality)
  const conceptQualities = translatedConcepts.value.map(c =>
    (c.quality.accuracy + c.quality.culturalAdaptation + c.quality.fluency + c.quality.completeness) / 4
  )
  
  const allQualities = [...hexagramQualities, ...conceptQualities]
  return allQualities.reduce((sum, q) => sum + q, 0) / allQualities.length
}

function initializeReviewWorkflow(): void {
  reviewWorkflow.value = [
    {
      id: 'ai-translation',
      title: t('bunenjin.translator.workflow.aiTranslation'),
      description: t('bunenjin.translator.workflow.aiTranslationDesc'),
      status: 'completed'
    },
    {
      id: 'cultural-review',
      title: t('bunenjin.translator.workflow.culturalReview'),
      description: t('bunenjin.translator.workflow.culturalReviewDesc'),
      status: 'active',
      assignee: {
        name: 'Cultural Expert',
        flag: targetLanguage.value.flag,
        role: 'Cultural Consultant'
      }
    },
    {
      id: 'native-review',
      title: t('bunenjin.translator.workflow.nativeReview'),
      description: t('bunenjin.translator.workflow.nativeReviewDesc'),
      status: 'pending',
      assignee: {
        name: 'Native Speaker',
        flag: targetLanguage.value.flag,
        role: 'Language Specialist'
      }
    },
    {
      id: 'final-approval',
      title: t('bunenjin.translator.workflow.finalApproval'),
      description: t('bunenjin.translator.workflow.finalApprovalDesc'),
      status: 'pending'
    }
  ]
}

// ヘルパー関数（実際の実装では適切なデータソースから取得）
function getHexagramSymbol(number: number): string {
  return '☰☷'[number % 2] || '☰'
}

function getHexagramName(number: number): string {
  const names = ['乾', '坤', '屯', '蒙', '需', '訟', '師', '比']
  return names[number % names.length] || '乾'
}

function getHexagramReading(number: number): string {
  const readings = ['けん', 'こん', 'ちゅん', 'もう', 'じゅ', 'しょう', 'し', 'ひ']
  return readings[number % readings.length] || 'けん'
}

function generateCulturalAdaptation(conceptKey: string, locale: SupportedLocale): string {
  const adaptations: Record<string, Record<SupportedLocale, string>> = {
    multifaceted: {
      'zh-CN': '融合中庸思想，体现和谐统一的文化价值',
      'ar': 'يتماشى مع مفهوم التوازن في الفلسفة الإسلامية',
      'ko': '음양조화와 중용사상의 한국적 해석'
    },
    harmony: {
      'zh-CN': '体现太极阴阳平衡的古典智慧',
      'ar': 'يعكس مبدأ الاعتدال والتوازن في التراث الإسلامي',
      'ko': '조화로운 균형을 추구하는 전통 철학'
    }
  }
  
  return adaptations[conceptKey]?.[locale] || t('bunenjin.translator.culturalAdaptationDefault')
}

// ライフサイクル
onMounted(() => {
  initializeTranslations()
})

// 監視
watch([() => props.targetLocale, currentLocale], () => {
  initializeTranslations()
})
</script>

<style scoped lang="scss">
.bunenjin-translator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: var(--font-family-base);

  &.rtl {
    direction: rtl;
    text-align: right;
  }
}

.translator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--cultural-primary);

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--cultural-primary);
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;

    .icon {
      font-size: 1.2em;
    }
  }

  .language-badges {
    display: flex;
    align-items: center;
    gap: 1rem;

    .badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;

      &.source {
        background: var(--cultural-background);
        color: var(--cultural-text);
        border: 2px solid var(--cultural-primary);
      }

      &.target {
        background: var(--cultural-primary);
        color: var(--cultural-surface);
      }
    }

    .arrow {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--cultural-accent);
    }
  }
}

.section-title {
  color: var(--cultural-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--cultural-background);
}

.hexagram-translation-section {
  margin-bottom: 3rem;
}

.hexagram-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.hexagram-card {
  background: var(--cultural-surface);
  border: 1px solid var(--cultural-background);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--cultural-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

.hexagram-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .hexagram-number {
    background: var(--cultural-primary);
    color: var(--cultural-surface);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .hexagram-symbol {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--cultural-accent);
  }
}

.hexagram-names {
  margin-bottom: 1rem;

  .original,
  .translated {
    margin-bottom: 0.75rem;

    .label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--cultural-text);
      opacity: 0.7;
      margin-bottom: 0.25rem;
    }

    .name {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--cultural-text);
      margin-bottom: 0.25rem;

      &.placeholder {
        color: var(--cultural-text);
        opacity: 0.5;
      }
    }

    .reading {
      font-size: 0.9rem;
      color: var(--cultural-text);
      opacity: 0.8;
    }

    .cultural-note {
      display: block;
      font-size: 0.8rem;
      color: var(--cultural-accent);
      font-style: italic;
      margin-top: 0.25rem;
    }
  }
}

.translation-quality {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .quality-bar {
    flex: 1;
    height: 0.5rem;
    background: var(--cultural-background);
    border-radius: 0.25rem;
    overflow: hidden;

    .quality-fill {
      height: 100%;
      transition: width 0.3s ease;

      &.excellent { background: #10B981; }
      &.high { background: #F59E0B; }
      &.medium { background: #EF4444; }
      &.low { background: #6B7280; }
    }
  }

  .quality-text {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--cultural-text);
  }
}

.philosophy-translation-section {
  margin-bottom: 3rem;
}

.concepts-grid {
  display: grid;
  gap: 2rem;
}

.concept-card {
  background: var(--cultural-surface);
  border: 1px solid var(--cultural-background);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--cultural-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.concept-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  .concept-title {
    color: var(--cultural-primary);
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .concept-type {
    background: var(--cultural-accent);
    color: var(--cultural-surface);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
}

.concept-content {
  .original-content,
  .translated-content {
    margin-bottom: 1.5rem;

    .description {
      color: var(--cultural-text);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .keyword {
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font-size: 0.8rem;
        font-weight: 500;

        &.original {
          background: var(--cultural-background);
          color: var(--cultural-text);
        }

        &.translated {
          background: var(--cultural-primary);
          color: var(--cultural-surface);
        }
      }
    }
  }

  .translation-arrow {
    text-align: center;
    margin: 1rem 0;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--cultural-accent);
    }
  }

  .cultural-adaptation {
    background: var(--cultural-background);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid var(--cultural-accent);

    .rtl & {
      border-left: none;
      border-right: 4px solid var(--cultural-accent);
    }

    h6 {
      color: var(--cultural-primary);
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    p {
      color: var(--cultural-text);
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }
  }
}

.concept-quality {
  border-top: 1px solid var(--cultural-background);
  padding-top: 1rem;
}

.quality-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;

  .metric {
    text-align: center;

    .label {
      display: block;
      font-size: 0.75rem;
      color: var(--cultural-text);
      opacity: 0.7;
      margin-bottom: 0.25rem;
    }

    .value {
      display: block;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--cultural-primary);
    }
  }
}

.regional-expressions-section {
  margin-bottom: 3rem;
}

.expressions-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  .tab-button {
    padding: 0.5rem 1rem;
    background: var(--cultural-background);
    border: 1px solid var(--cultural-primary);
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    color: var(--cultural-text);
    transition: all 0.2s ease;

    &:hover {
      background: var(--cultural-primary);
      color: var(--cultural-surface);
    }

    &.active {
      background: var(--cultural-primary);
      color: var(--cultural-surface);
    }
  }
}

.expressions-content {
  display: grid;
  gap: 1.5rem;
}

.expression-item {
  background: var(--cultural-surface);
  border: 1px solid var(--cultural-background);
  border-radius: 12px;
  padding: 1.5rem;
}

.expression-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .concept-name {
    color: var(--cultural-primary);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  .similarity-score {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .label {
      font-size: 0.8rem;
      color: var(--cultural-text);
      opacity: 0.7;
    }

    .score-bar {
      width: 60px;
      height: 0.5rem;
      background: var(--cultural-background);
      border-radius: 0.25rem;
      overflow: hidden;

      .score-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--cultural-primary), var(--cultural-accent));
        transition: width 0.3s ease;
      }
    }

    .score-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--cultural-primary);
    }
  }
}

.expression-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  .bunenjin-expression,
  .regional-expression {
    h7 {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--cultural-primary);
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--cultural-text);
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }
  }

  .cultural-context {
    background: var(--cultural-background);
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    color: var(--cultural-text);

    strong {
      color: var(--cultural-primary);
    }
  }
}

.translation-stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--cultural-surface);
  border: 1px solid var(--cultural-background);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--cultural-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-icon {
    background: var(--cultural-primary);
    color: var(--cultural-surface);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .stat-content {
    flex: 1;

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--cultural-primary);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      display: block;
      font-size: 0.9rem;
      color: var(--cultural-text);
      opacity: 0.8;
    }
  }
}

.native-review-section {
  margin-bottom: 2rem;
}

.review-workflow {
  background: var(--cultural-surface);
  border: 1px solid var(--cultural-background);
  border-radius: 12px;
  padding: 2rem;
}

.workflow-steps {
  display: grid;
  gap: 1.5rem;
}

.workflow-step {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &.pending {
    background: var(--cultural-background);
    opacity: 0.6;
  }

  &.active {
    background: linear-gradient(135deg, var(--cultural-primary), var(--cultural-accent));
    color: var(--cultural-surface);
  }

  &.completed {
    background: #10B981;
    color: white;
  }

  .step-indicator {
    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      font-weight: 700;
    }
  }

  .step-content {
    flex: 1;

    .step-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .step-description {
      font-size: 0.9rem;
      line-height: 1.4;
      margin: 0 0 0.75rem 0;
      opacity: 0.9;
    }

    .step-assignee {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;

      .flag {
        font-size: 1em;
      }

      .role {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.1em 0.5em;
        border-radius: 10px;
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .bunenjin-translator {
    padding: 1rem;
  }

  .translator-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .hexagram-grid {
    grid-template-columns: 1fr;
  }

  .expression-comparison {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>