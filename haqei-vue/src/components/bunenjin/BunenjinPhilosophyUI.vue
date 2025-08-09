<template>
  <div class="HaQei-philosophy-ui" :class="[themeClass, { 'high-contrast': highContrast }]">
    <!-- 1. 多面性受容インターフェース - Multi-faceted Acceptance Interface -->
    <section class="HaQei-multifaceted zen-entrance" aria-label="多面性受容インターフェース">
      <div class="facet-primary os-element-eastern zen-float">
        <h3 class="facet-title">{{ translate('HaQei.facets.primary') }}</h3>
        <p class="facet-description">{{ translate('HaQei.facets.primaryDesc') }}</p>
        <div class="facet-indicator">
          <div class="indicator-dot" :style="{ backgroundColor: currentFacet.primaryColor }"></div>
        </div>
      </div>
      
      <div class="facet-secondary os-element-eastern zen-float">
        <h3 class="facet-title">{{ translate('HaQei.facets.secondary') }}</h3>
        <p class="facet-description">{{ translate('HaQei.facets.secondaryDesc') }}</p>
        <div class="facet-indicator">
          <div class="indicator-dot" :style="{ backgroundColor: currentFacet.secondaryColor }"></div>
        </div>
      </div>
      
      <div class="facet-tertiary os-element-eastern zen-float">
        <h3 class="facet-title">{{ translate('HaQei.facets.tertiary') }}</h3>
        <p class="facet-description">{{ translate('HaQei.facets.tertiaryDesc') }}</p>
        <div class="facet-indicator">
          <div class="indicator-dot" :style="{ backgroundColor: currentFacet.tertiaryColor }"></div>
        </div>
      </div>
      
      <div class="facet-quaternary os-element-eastern zen-float">
        <h3 class="facet-title">{{ translate('HaQei.facets.quaternary') }}</h3>
        <p class="facet-description">{{ translate('HaQei.facets.quaternaryDesc') }}</p>
        <div class="facet-indicator">
          <div class="indicator-dot" :style="{ backgroundColor: currentFacet.quaternaryColor }"></div>
        </div>
      </div>
    </section>

    <!-- 2. 調和追求レイアウト - Harmony-seeking Layout -->
    <section class="harmony-container" aria-label="調和追求インターフェース">
      <div class="harmony-balance">
        <div class="harmony-side harmony-side--left change-adaptive">
          <div class="harmony-element">
            <span class="harmony-icon">☯</span>
            <h4>{{ translate('HaQei.harmony.balance') }}</h4>
            <p>{{ translate('HaQei.harmony.balanceDesc') }}</p>
          </div>
        </div>
        
        <div class="harmony-center zen-breath">
          <div class="center-mandala">
            <div class="mandala-layer" v-for="(layer, index) in mandalaLayers" :key="index"
                 :style="{ 
                   transform: `rotate(${layer.rotation}deg) scale(${layer.scale})`,
                   borderColor: layer.color,
                   animationDelay: `${index * 0.2}s`
                 }">
            </div>
            <div class="center-symbol">{{ currentSymbol }}</div>
          </div>
        </div>
        
        <div class="harmony-side harmony-side--right change-adaptive">
          <div class="harmony-element">
            <span class="harmony-icon">🌸</span>
            <h4>{{ translate('HaQei.harmony.acceptance') }}</h4>
            <p>{{ translate('HaQei.harmony.acceptanceDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 戦略ナビゲーション羅針盤 - Strategic Navigation Compass -->
    <section class="strategic-compass-container" aria-label="戦略ナビゲーション">
      <div class="strategic-compass">
        <div class="compass-center" @click="onCompassCenter">
          <span class="compass-symbol">{{ compassSymbol }}</span>
        </div>
        
        <button 
          v-for="(direction, index) in compassDirections" 
          :key="direction.id"
          class="compass-direction"
          :class="{ active: activeDirection === direction.id }"
          :style="{ 
            '--direction-color': direction.color,
            '--direction-position': `${direction.position}deg`
          }"
          @click="onDirectionClick(direction)"
          :aria-label="direction.label"
        >
          {{ direction.symbol }}
        </button>
        
        <div class="compass-rings">
          <div class="compass-ring compass-ring--outer"></div>
          <div class="compass-ring compass-ring--middle"></div>
          <div class="compass-ring compass-ring--inner"></div>
        </div>
      </div>
      
      <div class="strategic-guidance" v-if="currentGuidance">
        <h4>{{ currentGuidance.title }}</h4>
        <p>{{ currentGuidance.description }}</p>
        <div class="guidance-actions">
          <button 
            v-for="action in currentGuidance.actions" 
            :key="action.id"
            class="guidance-action"
            @click="onGuidanceAction(action)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- 4. Triple OS 東洋的視覚化 - Eastern Triple OS Visualization -->
    <section class="triple-os-eastern" aria-label="Triple OS分析">
      <div class="os-engine-eastern">
        <div class="os-header">
          <h3>{{ translate('tripleOS.engine.title') }}</h3>
          <div class="os-icon">🔥</div>
        </div>
        <div class="os-content">
          <div class="os-meter">
            <div class="meter-fill" :style="{ width: `${tripleOSData.engine.percentage}%` }"></div>
          </div>
          <p class="os-description">{{ tripleOSData.engine.description }}</p>
          <div class="os-keywords">
            <span v-for="keyword in tripleOSData.engine.keywords" :key="keyword" class="keyword-tag">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="os-interface-eastern">
        <div class="os-header">
          <h3>{{ translate('tripleOS.interface.title') }}</h3>
          <div class="os-icon">💧</div>
        </div>
        <div class="os-content">
          <div class="os-meter">
            <div class="meter-fill" :style="{ width: `${tripleOSData.interface.percentage}%` }"></div>
          </div>
          <p class="os-description">{{ tripleOSData.interface.description }}</p>
          <div class="os-keywords">
            <span v-for="keyword in tripleOSData.interface.keywords" :key="keyword" class="keyword-tag">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="os-safemode-eastern">
        <div class="os-header">
          <h3>{{ translate('tripleOS.safemode.title') }}</h3>
          <div class="os-icon">🌱</div>
        </div>
        <div class="os-content">
          <div class="os-meter">
            <div class="meter-fill" :style="{ width: `${tripleOSData.safeMode.percentage}%` }"></div>
          </div>
          <p class="os-description">{{ tripleOSData.safeMode.description }}</p>
          <div class="os-keywords">
            <span v-for="keyword in tripleOSData.safeMode.keywords" :key="keyword" class="keyword-tag">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 易経64卦統合ナビゲーション - I Ching 64 Hexagrams Navigation -->
    <section class="hexagram-navigation-container" aria-label="易経64卦ナビゲーション">
      <h3 class="navigation-title">{{ translate('iching.navigation.title') }}</h3>
      <div class="hexagram-navigation">
        <div 
          v-for="hexagram in hexagrams" 
          :key="hexagram.number"
          class="hexagram-item"
          :class="{ active: activeHexagram === hexagram.number }"
          @click="onHexagramClick(hexagram)"
          :aria-label="`卦 ${hexagram.number}: ${hexagram.name}`"
          tabindex="0"
          @keydown.enter="onHexagramClick(hexagram)"
        >
          <div class="hexagram-lines">
            <div 
              v-for="(line, index) in hexagram.lines" 
              :key="index"
              class="hexagram-line"
              :class="{ 'hexagram-line--broken': line === 0 }"
            ></div>
          </div>
          <div class="hexagram-number">{{ hexagram.number }}</div>
          <div class="hexagram-name">{{ hexagram.name }}</div>
        </div>
      </div>
      
      <div class="hexagram-detail" v-if="selectedHexagram">
        <h4>{{ selectedHexagram.name }} ({{ selectedHexagram.number }})</h4>
        <p class="hexagram-meaning">{{ selectedHexagram.meaning }}</p>
        <div class="hexagram-guidance">
          <h5>{{ translate('iching.guidance.title') }}</h5>
          <p>{{ selectedHexagram.guidance }}</p>
        </div>
      </div>
    </section>

    <!-- 6. 感情・直感重視インタラクション - Emotion-Intuition Interaction -->
    <section class="emotional-interaction-zone" aria-label="感情・直感インタラクション">
      <div class="emotional-surfaces">
        <div 
          v-for="emotion in emotions" 
          :key="emotion.id"
          class="emotional-surface"
          :class="[`emotion-${emotion.type}`, { active: activeEmotion === emotion.id }]"
          @mouseenter="onEmotionHover(emotion)"
          @mouseleave="onEmotionLeave"
          @click="onEmotionClick(emotion)"
          :style="{ '--emotion-color': emotion.color }"
        >
          <div class="emotion-icon">{{ emotion.icon }}</div>
          <div class="emotion-label">{{ emotion.label }}</div>
          <div class="emotion-intensity" :style="{ opacity: emotion.intensity }"></div>
        </div>
      </div>
      
      <div class="intuitive-feedback" :class="{ show: showFeedback }">
        {{ currentFeedback }}
      </div>
    </section>

    <!-- 7. 段階的啓示コンテナ - Progressive Disclosure Container -->
    <section class="progressive-container" aria-label="段階的情報開示">
      <div 
        v-for="(layer, index) in disclosureLayers" 
        :key="layer.id"
        class="disclosure-layer"
      >
        <div 
          class="disclosure-trigger"
          @click="toggleDisclosure(layer.id)"
          :aria-expanded="layer.expanded"
          :aria-controls="`disclosure-content-${layer.id}`"
        >
          <h4>{{ layer.title }}</h4>
          <div class="disclosure-indicator"></div>
        </div>
        <div 
          :id="`disclosure-content-${layer.id}`"
          class="disclosure-content"
          :class="{ expanded: layer.expanded }"
        >
          <p>{{ layer.content }}</p>
          <div v-if="layer.subItems" class="disclosure-subitems">
            <div 
              v-for="subItem in layer.subItems" 
              :key="subItem.id"
              class="disclosure-subitem"
            >
              <h5>{{ subItem.title }}</h5>
              <p>{{ subItem.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. 包摂的アクセシビリティ要素 - Inclusive Accessibility Elements -->
    <div class="accessibility-controls" aria-label="アクセシビリティ設定">
      <button 
        class="accessibility-toggle"
        @click="toggleHighContrast"
        :aria-pressed="highContrast"
      >
        <span class="sr-only">高コントラストモード切り替え</span>
        <span class="toggle-icon">🎨</span>
      </button>
      
      <button 
        class="accessibility-toggle"
        @click="toggleReducedMotion"
        :aria-pressed="reducedMotion"
      >
        <span class="sr-only">アニメーション削減モード切り替え</span>
        <span class="toggle-icon">⏸️</span>
      </button>
      
      <button 
        class="accessibility-toggle"
        @click="toggleFontSize"
        :aria-pressed="largeFontSize"
      >
        <span class="sr-only">大きなフォントサイズ切り替え</span>
        <span class="toggle-icon">🔍</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * HaQeiPhilosophyUI - HaQei哲学完全統合UIコンポーネント
 * 
 * 目的：
 * - 東洋的美意識と現代UI/UXの完全融合
 * - HaQei哲学の4つの柱の視覚的表現
 * - 文化的適応性と包摂的アクセシビリティ
 * - 世界最高レベルの易経診断体験
 * 
 * 特徴：
 * - 余白（間）の美学的活用
 * - 非対称バランスの調和
 * - 自然色彩・素材感統合
 * - 感情・直感重視インタラクション
 */

interface FacetColors {
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string
  quaternaryColor: string
}

interface MandalaLayer {
  rotation: number
  scale: number
  color: string
}

interface CompassDirection {
  id: string
  symbol: string
  label: string
  color: string
  position: number
}

interface TripleOSData {
  engine: {
    percentage: number
    description: string
    keywords: string[]
  }
  interface: {
    percentage: number
    description: string
    keywords: string[]
  }
  safeMode: {
    percentage: number
    description: string
    keywords: string[]
  }
}

interface Hexagram {
  number: number
  name: string
  lines: number[]
  meaning: string
  guidance: string
}

interface Emotion {
  id: string
  type: string
  icon: string
  label: string
  color: string
  intensity: number
}

interface DisclosureLayer {
  id: string
  title: string
  content: string
  expanded: boolean
  subItems?: {
    id: string
    title: string
    description: string
  }[]
}

const { t } = useI18n()

// TypeScript用のtヘルパー関数
const translate = (key: string, params?: Record<string, any>) => {
  try {
    return t(key, params)
  } catch {
    return key
  }
}

// テーマとアクセシビリティ状態
const themeClass = ref('HaQei-theme')
const highContrast = ref(false)
const reducedMotion = ref(false)
const largeFontSize = ref(false)

// 多面性受容の色彩状態
const currentFacet = ref<FacetColors>({
  primaryColor: '#f44336',
  secondaryColor: '#03a9f4',
  tertiaryColor: '#4caf50',
  quaternaryColor: '#ff9800'
})

// 調和追求の曼荼羅レイヤー
const mandalaLayers = ref<MandalaLayer[]>([
  { rotation: 0, scale: 1, color: '#4caf50' },
  { rotation: 45, scale: 0.8, color: '#03a9f4' },
  { rotation: 90, scale: 0.6, color: '#f44336' },
  { rotation: 135, scale: 0.4, color: '#ff9800' }
])

const currentSymbol = ref('☯')

// 戦略ナビゲーション羅針盤
const compassSymbol = ref('中')
const activeDirection = ref('')
const compassDirections = ref<CompassDirection[]>([
  { id: 'north', symbol: '北', label: '直観', color: '#03a9f4', position: 0 },
  { id: 'east', symbol: '東', label: '行動', color: '#f44336', position: 90 },
  { id: 'south', symbol: '南', label: '感情', color: '#ff9800', position: 180 },
  { id: 'west', symbol: '西', label: '思考', color: '#4caf50', position: 270 }
])

const currentGuidance = ref<any>(null)

// Triple OS データ
const tripleOSData = ref<TripleOSData>({
  engine: {
    percentage: 75,
    description: '内なる価値観と動機の強さを表します',
    keywords: ['情熱', '信念', '動機', '価値観']
  },
  interface: {
    percentage: 65,
    description: '社会的適応と表現能力を表します',
    keywords: ['適応', '表現', '社交', '調和']
  },
  safeMode: {
    percentage: 85,
    description: '防御機制と安全確保能力を表します',
    keywords: ['防御', '安全', '慎重', '保護']
  }
})

// 易経64卦データ（簡略版）
const hexagrams = ref<Hexagram[]>([
  {
    number: 1,
    name: '乾',
    lines: [1, 1, 1, 1, 1, 1],
    meaning: '創造力と指導力',
    guidance: '積極的に行動する時です'
  },
  {
    number: 2,
    name: '坤',
    lines: [0, 0, 0, 0, 0, 0],
    meaning: '受容性と忍耐',
    guidance: '謙虚に学ぶ時です'
  }
  // ... 他の卦も含める
])

const activeHexagram = ref(0)
const selectedHexagram = ref<Hexagram | null>(null)

// 感情・直感インタラクション
const emotions = ref<Emotion[]>([
  { id: 'joy', type: 'positive', icon: '😊', label: '喜び', color: '#ffb74d', intensity: 0.8 },
  { id: 'calm', type: 'neutral', icon: '😌', label: '平静', color: '#90a4ae', intensity: 0.6 },
  { id: 'curiosity', type: 'active', icon: '🤔', label: '好奇心', color: '#5c6bc0', intensity: 0.7 },
  { id: 'determination', type: 'strong', icon: '💪', label: '決意', color: '#f44336', intensity: 0.9 }
])

const activeEmotion = ref('')
const showFeedback = ref(false)
const currentFeedback = ref('')

// 段階的啓示レイヤー
const disclosureLayers = ref<DisclosureLayer[]>([
  {
    id: 'philosophy',
    title: 'HaQei哲学の理解',
    content: 'HaQei哲学は、人間の多面性を受容し、調和を追求する東洋的思想です。',
    expanded: false,
    subItems: [
      {
        id: 'multifaceted',
        title: '多面性受容',
        description: '矛盾する複数の側面を同時に受け入れる能力'
      },
      {
        id: 'harmony',
        title: '調和追求',
        description: '対立する要素間のバランスを見つける智慧'
      }
    ]
  },
  {
    id: 'analysis',
    title: '分析結果の解釈',
    content: 'あなたの分析結果は、内面の複雑な構造を映し出しています。',
    expanded: false
  },
  {
    id: 'guidance',
    title: '戦略的ガイダンス',
    content: '易経の智慧に基づいた、具体的な行動指針をお示しします。',
    expanded: false
  }
])

// コンポーネントメソッド
const onCompassCenter = () => {
  currentSymbol.value = currentSymbol.value === '☯' ? '中' : '☯'
}

const onDirectionClick = (direction: CompassDirection) => {
  activeDirection.value = direction.id
  currentGuidance.value = {
    title: `${direction.label}の導き`,
    description: `${direction.label}的アプローチで問題に取り組むことが推奨されます。`,
    actions: [
      { id: 'explore', label: '詳しく探る' },
      { id: 'apply', label: '実践する' }
    ]
  }
}

const onGuidanceAction = (action: any) => {
  console.log('Guidance action:', action)
}

const onHexagramClick = (hexagram: Hexagram) => {
  activeHexagram.value = hexagram.number
  selectedHexagram.value = hexagram
}

const onEmotionHover = (emotion: Emotion) => {
  activeEmotion.value = emotion.id
  currentFeedback.value = `${emotion.label}の感情が活性化されています`
  showFeedback.value = true
}

const onEmotionLeave = () => {
  activeEmotion.value = ''
  showFeedback.value = false
}

const onEmotionClick = (emotion: Emotion) => {
  console.log('Emotion clicked:', emotion)
}

const toggleDisclosure = (layerId: string) => {
  const layer = disclosureLayers.value.find(l => l.id === layerId)
  if (layer) {
    layer.expanded = !layer.expanded
  }
}

const toggleHighContrast = () => {
  highContrast.value = !highContrast.value
}

const toggleReducedMotion = () => {
  reducedMotion.value = !reducedMotion.value
  if (reducedMotion.value) {
    document.documentElement.style.setProperty('--transition-base', '0s')
  } else {
    document.documentElement.style.removeProperty('--transition-base')
  }
}

const toggleFontSize = () => {
  largeFontSize.value = !largeFontSize.value
  if (largeFontSize.value) {
    document.documentElement.style.setProperty('--font-size-base', '1.25rem')
  } else {
    document.documentElement.style.removeProperty('--font-size-base')
  }
}

// 曼荼羅の回転アニメーション
const animateMandala = () => {
  setInterval(() => {
    mandalaLayers.value = mandalaLayers.value.map(layer => ({
      ...layer,
      rotation: (layer.rotation + 1) % 360
    }))
  }, 100)
}

// 多面性の色彩変化
const animateFacetColors = () => {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4']
  let colorIndex = 0
  
  setInterval(() => {
    currentFacet.value = {
      primaryColor: colors[colorIndex % colors.length],
      secondaryColor: colors[(colorIndex + 1) % colors.length],
      tertiaryColor: colors[(colorIndex + 2) % colors.length],
      quaternaryColor: colors[(colorIndex + 3) % colors.length]
    }
    colorIndex++
  }, 3000)
}

// ライフサイクル
onMounted(() => {
  if (!reducedMotion.value) {
    animateMandala()
    animateFacetColors()
  }
})

// レスポンシブ対応の計算プロパティ
const isMobile = computed(() => {
  return window.innerWidth < 768
})
</script>

<style scoped>
/* コンポーネント固有のスタイル */
.HaQei-philosophy-ui {
  padding: var(--ma-transcendent) var(--ma-social);
  background: var(--paper-texture);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--ma-transcendent);
}

/* 多面性受容のスタイル強化 */
.facet-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--ma-personal);
  color: var(--ink-black);
}

.facet-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--wabi-grey);
  margin-bottom: var(--ma-social);
}

.facet-indicator {
  display: flex;
  justify-content: center;
}

.indicator-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  transition: all var(--transition-base);
}

/* 調和追求のスタイル強化 */
.harmony-element {
  text-align: center;
  padding: var(--ma-social);
}

.harmony-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: var(--ma-personal);
}

.center-mandala {
  position: relative;
  width: 8rem;
  height: 8rem;
}

.mandala-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid;
  border-radius: 50%;
  animation: zenFloat 6.18s ease-in-out infinite;
}

.center-symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
  color: var(--ink-black);
}

/* Triple OS のスタイル強化 */
.os-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ma-social);
}

.os-icon {
  font-size: 1.5rem;
}

.os-meter {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--ma-personal);
}

.meter-fill {
  height: 100%;
  background: currentColor;
  transition: width 1s ease;
  border-radius: 4px;
}

.keyword-tag {
  display: inline-block;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  margin: 0.125rem;
}

/* 易経ナビゲーションのスタイル強化 */
.navigation-title {
  text-align: center;
  margin-bottom: var(--ma-social);
  font-size: 1.5rem;
  color: var(--ink-black);
}

.hexagram-name {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.8;
}

.hexagram-detail {
  margin-top: var(--ma-social);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
}

.hexagram-meaning {
  font-style: italic;
  margin-bottom: var(--ma-personal);
  color: var(--wabi-grey);
}

.hexagram-guidance h5 {
  margin-bottom: var(--ma-intimate);
  color: var(--bamboo-green);
}

/* 感情インタラクションのスタイル強化 */
.emotional-surfaces {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--ma-social);
  margin-bottom: var(--ma-social);
}

.emotion-icon {
  font-size: 2rem;
  margin-bottom: var(--ma-personal);
}

.emotion-label {
  font-weight: 500;
  color: var(--ink-black);
}

.emotion-intensity {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--emotion-color);
  border-radius: inherit;
  z-index: -1;
}

/* アクセシビリティコントロール */
.accessibility-controls {
  position: fixed;
  top: var(--ma-social);
  right: var(--ma-social);
  display: flex;
  flex-direction: column;
  gap: var(--ma-personal);
  z-index: var(--z-fixed);
}

.accessibility-toggle {
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: var(--zen-white);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.accessibility-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.toggle-icon {
  font-size: 1.25rem;
}

/* レスポンシブ調整 */
@media (max-width: 768px) {
  .HaQei-multifaceted {
    grid-template-areas: 
      "primary"
      "secondary"
      "tertiary"
      "quaternary";
  }
  
  .emotional-surfaces {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .accessibility-controls {
    flex-direction: row;
    top: auto;
    bottom: var(--ma-social);
    right: 50%;
    transform: translateX(50%);
  }
}
</style>