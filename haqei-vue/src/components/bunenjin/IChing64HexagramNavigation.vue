<template>
  <div class="iching-navigation" :class="navigationTheme">
    <!-- 64卦ナビゲーション全体コンテナ -->
    <div class="hexagram-universe" aria-label="易経64卦宇宙">
      <!-- 天地人三才のヘッダー -->
      <div class="sancai-header">
        <div class="sancai-element sancai-heaven">
          <div class="sancai-symbol">☰</div>
          <div class="sancai-label">{{ translate('iching.sancai.heaven') }}</div>
        </div>
        <div class="sancai-element sancai-human">
          <div class="sancai-symbol">☱</div>
          <div class="sancai-label">{{ translate('iching.sancai.human') }}</div>
        </div>
        <div class="sancai-element sancai-earth">
          <div class="sancai-symbol">☷</div>
          <div class="sancai-label">{{ translate('iching.sancai.earth') }}</div>
        </div>
      </div>

      <!-- 64卦マトリックス配置 -->
      <div class="hexagram-matrix" :class="{ 'matrix-expanded': matrixExpanded }">
        <!-- 上卦（天）の表示 -->
        <div class="matrix-axis matrix-upper">
          <div class="axis-label">上卦</div>
          <div class="trigram-indicators">
            <div 
              v-for="trigram in upperTrigrams" 
              :key="trigram.id"
              class="trigram-indicator"
              :class="{ active: activeTrigram === trigram.id }"
              @click="filterByTrigram('upper', trigram.id)"
            >
              <div class="trigram-lines">
                <div 
                  v-for="(line, index) in trigram.lines" 
                  :key="index"
                  class="trigram-line"
                  :class="{ 'trigram-line--broken': line === 0 }"
                ></div>
              </div>
              <div class="trigram-name">{{ trigram.name }}</div>
            </div>
          </div>
        </div>

        <!-- 64卦グリッド本体 -->
        <div class="hexagram-grid">
          <div 
            v-for="hexagram in filteredHexagrams" 
            :key="hexagram.number"
            class="hexagram-cell"
            :class="[
              `hexagram-${hexagram.number}`,
              { 
                active: selectedHexagram?.number === hexagram.number,
                highlighted: hexagram.highlighted,
                'current-guidance': hexagram.number === currentGuidanceHexagram
              }
            ]"
            @click="selectHexagram(hexagram)"
            @mouseenter="previewHexagram(hexagram)"
            @mouseleave="clearPreview"
            :title="`${hexagram.number}. ${hexagram.name} - ${hexagram.meaning}`"
            tabindex="0"
            @keydown.enter="selectHexagram(hexagram)"
            @keydown.space.prevent="selectHexagram(hexagram)"
          >
            <!-- 卦の視覚表現 -->
            <div class="hexagram-visual">
              <div class="hexagram-lines">
                <div 
                  v-for="(line, index) in hexagram.lines" 
                  :key="index"
                  class="hexagram-line"
                  :class="{ 
                    'hexagram-line--broken': line === 0,
                    'hexagram-line--changing': hexagram.changingLines?.includes(5 - index)
                  }"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                ></div>
              </div>
              
              <!-- 卦番号と名前 -->
              <div class="hexagram-info">
                <div class="hexagram-number">{{ hexagram.number }}</div>
                <div class="hexagram-name">{{ hexagram.name }}</div>
              </div>
              
              <!-- 季節・方位指示 -->
              <div class="hexagram-attributes">
                <div class="season-indicator" v-if="hexagram.season">
                  {{ hexagram.season }}
                </div>
                <div class="direction-indicator" v-if="hexagram.direction">
                  {{ hexagram.direction }}
                </div>
              </div>
            </div>
            
            <!-- ホバー時の詳細情報 -->
            <div class="hexagram-tooltip" v-if="previewedHexagram?.number === hexagram.number">
              <div class="tooltip-meaning">{{ hexagram.meaning }}</div>
              <div class="tooltip-keywords">
                <span v-for="keyword in hexagram.keywords" :key="keyword" class="keyword">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 下卦（地）の表示 -->
        <div class="matrix-axis matrix-lower">
          <div class="axis-label">下卦</div>
          <div class="trigram-indicators">
            <div 
              v-for="trigram in lowerTrigrams" 
              :key="trigram.id"
              class="trigram-indicator"
              :class="{ active: activeTrigram === trigram.id }"
              @click="filterByTrigram('lower', trigram.id)"
            >
              <div class="trigram-lines">
                <div 
                  v-for="(line, index) in trigram.lines" 
                  :key="index"
                  class="trigram-line"
                  :class="{ 'trigram-line--broken': line === 0 }"
                ></div>
              </div>
              <div class="trigram-name">{{ trigram.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 選択された卦の詳細表示 -->
      <div class="hexagram-detail-panel" v-if="selectedHexagram" key="detail-panel">
        <div class="detail-header">
          <div class="detail-hexagram">
            <div class="large-hexagram-lines">
              <div 
                v-for="(line, index) in selectedHexagram.lines" 
                :key="index"
                class="large-hexagram-line"
                :class="{ 
                  'large-hexagram-line--broken': line === 0,
                  'large-hexagram-line--changing': selectedHexagram.changingLines?.includes(5 - index)
                }"
              ></div>
            </div>
          </div>
          
          <div class="detail-info">
            <h3 class="detail-title">
              {{ selectedHexagram.number }}. {{ selectedHexagram.name }}
              <span class="detail-pinyin" v-if="selectedHexagram.pinyin">
                ({{ selectedHexagram.pinyin }})
              </span>
            </h3>
            <p class="detail-meaning">{{ selectedHexagram.meaning }}</p>
            
            <div class="detail-attributes">
              <div class="attribute" v-if="selectedHexagram.element">
                <span class="attribute-label">五行:</span>
                <span class="attribute-value">{{ selectedHexagram.element }}</span>
              </div>
              <div class="attribute" v-if="selectedHexagram.season">
                <span class="attribute-label">季節:</span>
                <span class="attribute-value">{{ selectedHexagram.season }}</span>
              </div>
              <div class="attribute" v-if="selectedHexagram.direction">
                <span class="attribute-label">方位:</span>
                <span class="attribute-value">{{ selectedHexagram.direction }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 卦辞と象辞 -->
        <div class="classical-texts">
          <div class="text-section" v-if="selectedHexagram.judgment">
            <h4 class="text-title">卦辞 (Judgment)</h4>
            <p class="text-content">{{ selectedHexagram.judgment }}</p>
          </div>
          
          <div class="text-section" v-if="selectedHexagram.image">
            <h4 class="text-title">象辞 (Image)</h4>
            <p class="text-content">{{ selectedHexagram.image }}</p>
          </div>
        </div>

        <!-- 現代的解釈と戦略ガイダンス -->
        <div class="modern-guidance">
          <div class="guidance-tabs">
            <button 
              v-for="tab in guidanceTabs" 
              :key="tab.id"
              class="guidance-tab"
              :class="{ active: activeGuidanceTab === tab.id }"
              @click="activeGuidanceTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="guidance-content">
            <div v-if="activeGuidanceTab === 'situation'" class="guidance-panel">
              <h5>現在の状況</h5>
              <p>{{ selectedHexagram.guidance?.situation }}</p>
            </div>
            
            <div v-if="activeGuidanceTab === 'action'" class="guidance-panel">
              <h5>推奨される行動</h5>
              <ul class="action-list">
                <li v-for="action in selectedHexagram.guidance?.actions" :key="action">
                  {{ action }}
                </li>
              </ul>
            </div>
            
            <div v-if="activeGuidanceTab === 'warning'" class="guidance-panel">
              <h5>注意すべき点</h5>
              <p>{{ selectedHexagram.guidance?.warning }}</p>
            </div>
            
            <div v-if="activeGuidanceTab === 'opportunity'" class="guidance-panel">
              <h5>機会とチャンス</h5>
              <p>{{ selectedHexagram.guidance?.opportunity }}</p>
            </div>
          </div>
        </div>

        <!-- 関連卦への変化パス -->
        <div class="hexagram-relationships" v-if="selectedHexagram.relatedHexagrams">
          <h4 class="relationships-title">関連する卦</h4>
          <div class="relationship-grid">
            <div 
              v-for="related in selectedHexagram.relatedHexagrams" 
              :key="related.number"
              class="related-hexagram"
              :class="`relationship-${related.relationship}`"
              @click="navigateToHexagram(related.number)"
            >
              <div class="related-visual">
                <div class="mini-hexagram-lines">
                  <div 
                    v-for="(line, index) in related.lines" 
                    :key="index"
                    class="mini-hexagram-line"
                    :class="{ 'mini-hexagram-line--broken': line === 0 }"
                  ></div>
                </div>
              </div>
              <div class="related-info">
                <div class="related-number">{{ related.number }}</div>
                <div class="related-name">{{ related.name }}</div>
                <div class="relationship-type">{{ related.relationship }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- パーソナライズされた解釈 -->
        <div class="personalized-interpretation" v-if="personalizedInterpretation">
          <h4 class="interpretation-title">あなたへの特別なメッセージ</h4>
          <div class="interpretation-content">
            <p class="interpretation-text">{{ personalizedInterpretation.message }}</p>
            <div class="interpretation-aspects">
              <div 
                v-for="aspect in personalizedInterpretation.aspects" 
                :key="aspect.type"
                class="aspect-item"
              >
                <div class="aspect-icon">{{ aspect.icon }}</div>
                <div class="aspect-content">
                  <h6 class="aspect-title">{{ aspect.title }}</h6>
                  <p class="aspect-description">{{ aspect.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- フィルターとソート機能 -->
      <div class="navigation-controls">
        <div class="search-filter">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="卦名、意味、キーワードで検索..."
            class="search-input"
          />
          <button class="search-clear" v-if="searchQuery" @click="searchQuery = ''">×</button>
        </div>
        
        <div class="filter-options">
          <select v-model="elementFilter" class="filter-select">
            <option value="">全ての要素</option>
            <option value="wood">木</option>
            <option value="fire">火</option>
            <option value="earth">土</option>
            <option value="metal">金</option>
            <option value="water">水</option>
          </select>
          
          <select v-model="seasonFilter" class="filter-select">
            <option value="">全ての季節</option>
            <option value="spring">春</option>
            <option value="summer">夏</option>
            <option value="autumn">秋</option>
            <option value="winter">冬</option>
          </select>
        </div>
        
        <div class="view-options">
          <button 
            class="view-toggle"
            :class="{ active: matrixExpanded }"
            @click="matrixExpanded = !matrixExpanded"
          >
            {{ matrixExpanded ? '縮小表示' : '拡大表示' }}
          </button>
          
          <button 
            class="guidance-mode-toggle"
            :class="{ active: guidanceMode }"
            @click="guidanceMode = !guidanceMode"
          >
            ガイダンスモード
          </button>
        </div>
      </div>

      <!-- 序卦伝による卦の流れ -->
      <div class="sequence-flow" v-if="showSequenceFlow">
        <h4 class="sequence-title">序卦伝 - 卦の自然な流れ</h4>
        <div class="sequence-path">
          <div 
            v-for="(step, index) in hexagramSequence" 
            :key="step.number"
            class="sequence-step"
            :class="{ 
              current: step.number === selectedHexagram?.number
            }"
            @click="selectHexagram(step)"
          >
            <div class="sequence-hexagram">
              <div class="sequence-lines">
                <div 
                  v-for="(line, lineIndex) in step.lines" 
                  :key="lineIndex"
                  class="sequence-line"
                  :class="{ 'sequence-line--broken': line === 0 }"
                ></div>
              </div>
              <div class="sequence-number">{{ step.number }}</div>
            </div>
            
            <div class="sequence-arrow" v-if="index < hexagramSequence.length - 1">
              →
            </div>
          </div>
        </div>
        
        <div class="sequence-explanation" v-if="selectedSequenceExplanation">
          <p>{{ selectedSequenceExplanation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * IChing64HexagramNavigation - 易経64卦統合ナビゲーションシステム
 * 
 * 特徴：
 * - 完全な64卦マトリックス表示
 * - 八卦（三才）による階層的組織化
 * - 序卦伝に基づく自然な流れ表示
 * - 現代的解釈と古典的智慧の融合
 * - パーソナライズされた卦解釈
 * - 五行・季節・方位による分類
 * - 動的検索・フィルタリング機能
 */

interface Trigram {
  id: string
  name: string
  lines: number[]
  element: string
  direction: string
  attribute: string
}

interface Hexagram {
  number: number
  name: string
  pinyin?: string
  lines: number[]
  upperTrigram: string
  lowerTrigram: string
  meaning: string
  keywords: string[]
  element?: string
  season?: string
  direction?: string
  judgment?: string
  image?: string
  guidance?: {
    situation: string
    actions: string[]
    warning: string
    opportunity: string
  }
  changingLines?: number[]
  relatedHexagrams?: RelatedHexagram[]
  highlighted?: boolean
}

interface RelatedHexagram {
  number: number
  name: string
  lines: number[]
  relationship: 'opposite' | 'inverse' | 'nuclear' | 'mutual'
}

interface GuidanceTab {
  id: string
  label: string
}

interface PersonalizedInterpretation {
  message: string
  aspects: {
    type: string
    icon: string
    title: string
    description: string
  }[]
}

const { t } = useI18n()

// ナビゲーションテーマ
const navigationTheme = ref('traditional-bagua')

// 八卦（三才）の定義
const upperTrigrams = ref<Trigram[]>([
  { id: 'qian', name: '乾', lines: [1,1,1], element: 'metal', direction: 'northwest', attribute: 'heaven' },
  { id: 'dui', name: '兌', lines: [0,1,1], element: 'metal', direction: 'west', attribute: 'lake' },
  { id: 'li', name: '離', lines: [1,0,1], element: 'fire', direction: 'south', attribute: 'fire' },
  { id: 'zhen', name: '震', lines: [0,0,1], element: 'wood', direction: 'east', attribute: 'thunder' },
  { id: 'xun', name: '巽', lines: [1,1,0], element: 'wood', direction: 'southeast', attribute: 'wind' },
  { id: 'kan', name: '坎', lines: [0,1,0], element: 'water', direction: 'north', attribute: 'water' },
  { id: 'gen', name: '艮', lines: [1,0,0], element: 'earth', direction: 'northeast', attribute: 'mountain' },
  { id: 'kun', name: '坤', lines: [0,0,0], element: 'earth', direction: 'southwest', attribute: 'earth' }
])

const lowerTrigrams = ref<Trigram[]>([...upperTrigrams.value])

// 64卦の完全データセット（簡略版）
const allHexagrams = ref<Hexagram[]>([
  {
    number: 1,
    name: '乾',
    pinyin: 'qián',
    lines: [1,1,1,1,1,1],
    upperTrigram: 'qian',
    lowerTrigram: 'qian',
    meaning: '創造力、指導力、天の力',
    keywords: ['創造', '指導', '強さ', '積極', '天'],
    element: 'metal',
    season: 'winter',
    direction: 'northwest',
    judgment: '元亨利貞。大いに亨通し、利あり貞なり。',
    image: '天行健、君子以自強不息。天の運行は力強く、君子は自ら強めて息まず。',
    guidance: {
      situation: '新しい始まりと創造的なエネルギーに満ちた時期です。',
      actions: ['積極的にリーダーシップを発揮する', '新しいプロジェクトを開始する', '自分の能力を信じて行動する'],
      warning: '過度の傲慢さや独断専行を避けること。',
      opportunity: '大きな成功と影響力を得るチャンスがあります。'
    },
    relatedHexagrams: [
      { number: 2, name: '坤', lines: [0,0,0,0,0,0], relationship: 'opposite' },
      { number: 43, name: '夬', lines: [0,1,1,1,1,1], relationship: 'nuclear' }
    ]
  },
  {
    number: 2,
    name: '坤',
    pinyin: 'kūn',
    lines: [0,0,0,0,0,0],
    upperTrigram: 'kun',
    lowerTrigram: 'kun',
    meaning: '受容性、忍耐、地の力',
    keywords: ['受容', '忍耐', '育成', '謙虚', '地'],
    element: 'earth',
    season: 'summer',
    direction: 'southwest',
    judgment: '元亨、利牝馬之貞。大いに亨通し、牝馬の貞に利あり。',
    image: '地勢坤、君子以厚德載物。地の勢いは坤なり、君子は厚德を以て物を載す。',
    guidance: {
      situation: '謙虚さと忍耐が求められる時期です。',
      actions: ['他者をサポートする', '学びの姿勢を持つ', '基盤を固める'],
      warning: '受け身すぎて機会を逃さないよう注意。',
      opportunity: '信頼を築き、長期的な成功の基盤を作れます。'
    },
    relatedHexagrams: [
      { number: 1, name: '乾', lines: [1,1,1,1,1,1], relationship: 'opposite' },
      { number: 23, name: '剥', lines: [1,0,0,0,0,0], relationship: 'nuclear' }
    ]
  }
  // ... 他の62卦も含める（実装時は完全データを追加）
])

// UI状態管理
const selectedHexagram = ref<Hexagram | null>(null)
const previewedHexagram = ref<Hexagram | null>(null)
const activeTrigram = ref('')
const matrixExpanded = ref(false)
const guidanceMode = ref(false)
const showSequenceFlow = ref(false)

// 検索・フィルター状態
const searchQuery = ref('')
const elementFilter = ref('')
const seasonFilter = ref('')
const currentGuidanceHexagram = ref(0)

// ガイダンスタブ
const guidanceTabs = ref<GuidanceTab[]>([
  { id: 'situation', label: '状況' },
  { id: 'action', label: '行動' },
  { id: 'warning', label: '注意' },
  { id: 'opportunity', label: '機会' }
])

const activeGuidanceTab = ref('situation')

// パーソナライズされた解釈
const personalizedInterpretation = ref<PersonalizedInterpretation | null>(null)

// 序卦伝による卦の流れ
const hexagramSequence = ref<Hexagram[]>([])
const selectedSequenceExplanation = ref('')

// 計算プロパティ
const filteredHexagrams = computed(() => {
  let filtered = allHexagrams.value

  // 検索クエリによるフィルタリング
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(hex => 
      hex.name.toLowerCase().includes(query) ||
      hex.meaning.toLowerCase().includes(query) ||
      hex.keywords.some(keyword => keyword.toLowerCase().includes(query))
    )
  }

  // 要素によるフィルタリング
  if (elementFilter.value) {
    filtered = filtered.filter(hex => hex.element === elementFilter.value)
  }

  // 季節によるフィルタリング
  if (seasonFilter.value) {
    filtered = filtered.filter(hex => hex.season === seasonFilter.value)
  }

  // 三才によるフィルタリング
  if (activeTrigram.value) {
    filtered = filtered.filter(hex => 
      hex.upperTrigram === activeTrigram.value || 
      hex.lowerTrigram === activeTrigram.value
    )
  }

  return filtered
})

// メソッド
const selectHexagram = (hexagram: Hexagram) => {
  selectedHexagram.value = hexagram
  currentGuidanceHexagram.value = hexagram.number
  generatePersonalizedInterpretation(hexagram)
  updateSequenceFlow(hexagram)
}

const previewHexagram = (hexagram: Hexagram) => {
  previewedHexagram.value = hexagram
}

const clearPreview = () => {
  previewedHexagram.value = null
}

const filterByTrigram = (position: 'upper' | 'lower', trigramId: string) => {
  if (activeTrigram.value === trigramId) {
    activeTrigram.value = ''
  } else {
    activeTrigram.value = trigramId
  }
}

const navigateToHexagram = (hexagramNumber: number) => {
  const hexagram = allHexagrams.value.find(h => h.number === hexagramNumber)
  if (hexagram) {
    selectHexagram(hexagram)
  }
}

const generatePersonalizedInterpretation = (hexagram: Hexagram) => {
  // ここでTriple OSデータや分析結果に基づいてパーソナライズされた解釈を生成
  personalizedInterpretation.value = {
    message: `あなたの現在の状況において、${hexagram.name}の卦は特別な意味を持ちます。`,
    aspects: [
      {
        type: 'engine',
        icon: '🔥',
        title: 'Engine OS への影響',
        description: `${hexagram.name}の卦は、あなたの内なる動機を${hexagram.keywords[0]}の方向に導きます。`
      },
      {
        type: 'interface',
        icon: '💧',
        title: 'Interface OS への影響',
        description: `社会的な場面では、${hexagram.keywords[1]}を意識した行動が効果的です。`
      },
      {
        type: 'safemode',
        icon: '🌱',
        title: 'SafeMode OS への影響',
        description: `${hexagram.keywords[2]}の姿勢で安全性を確保できます。`
      }
    ]
  }
}

const updateSequenceFlow = (hexagram: Hexagram) => {
  // 序卦伝に基づいて前後の卦の流れを生成
  const currentIndex = hexagram.number - 1
  const sequence = []
  
  // 前の卦
  if (currentIndex > 0) {
    sequence.push(allHexagrams.value[currentIndex - 1])
  }
  
  // 現在の卦
  sequence.push(hexagram)
  
  // 次の卦
  if (currentIndex < allHexagrams.value.length - 1) {
    sequence.push(allHexagrams.value[currentIndex + 1])
  }
  
  hexagramSequence.value = sequence
  selectedSequenceExplanation.value = `${hexagram.name}の卦は、変化の流れの中で重要な位置を占めています。`
}

// 検索クエリの監視
watch(searchQuery, (newQuery) => {
  // 検索結果をハイライト
  allHexagrams.value.forEach(hex => {
    hex.highlighted = newQuery ? 
      hex.name.toLowerCase().includes(newQuery.toLowerCase()) ||
      hex.meaning.toLowerCase().includes(newQuery.toLowerCase()) ||
      hex.keywords.some(keyword => keyword.toLowerCase().includes(newQuery.toLowerCase()))
      : false
  })
})

// 初期化
onMounted(() => {
  // デフォルトで最初の卦を選択
  if (allHexagrams.value.length > 0) {
    selectHexagram(allHexagrams.value[0])
  }
})
</script>

<style scoped>
.iching-navigation {
  padding: var(--ma-transcendent);
  background: var(--paper-texture);
  min-height: 100vh;
  font-family: var(--font-family-base);
}

.traditional-bagua .hexagram-universe {
  max-width: 90rem;
  margin: 0 auto;
}

/* 三才ヘッダー */
.sancai-header {
  display: flex;
  justify-content: center;
  gap: var(--ma-transcendent);
  margin-bottom: var(--ma-transcendent);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.618rem;
  box-shadow: var(--shadow-md);
}

.sancai-element {
  text-align: center;
  padding: var(--ma-social);
  border-radius: 1rem;
  transition: all var(--transition-base);
  cursor: pointer;
}

.sancai-element:hover {
  transform: translateY(-0.25rem);
  box-shadow: var(--shadow-lg);
}

.sancai-heaven {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.sancai-human {
  background: linear-gradient(135deg, rgba(104, 159, 56, 0.1) 0%, rgba(104, 159, 56, 0.05) 100%);
  border: 2px solid rgba(104, 159, 56, 0.3);
}

.sancai-earth {
  background: linear-gradient(135deg, rgba(141, 110, 99, 0.1) 0%, rgba(141, 110, 99, 0.05) 100%);
  border: 2px solid rgba(141, 110, 99, 0.3);
}

.sancai-symbol {
  font-size: 2rem;
  margin-bottom: var(--ma-personal);
}

.sancai-label {
  font-weight: 600;
  color: var(--ink-black);
}

/* マトリックス配置 */
.hexagram-matrix {
  display: grid;
  grid-template-areas: 
    "upper upper upper"
    "grid grid grid"
    "lower lower lower";
  gap: var(--ma-social);
  margin-bottom: var(--ma-transcendent);
}

.matrix-expanded .hexagram-matrix {
  gap: var(--ma-contemplative);
}

.matrix-axis {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: var(--ma-social);
}

.matrix-upper {
  grid-area: upper;
}

.matrix-lower {
  grid-area: lower;
}

.axis-label {
  text-align: center;
  font-weight: 600;
  margin-bottom: var(--ma-personal);
  color: var(--ink-black);
}

.trigram-indicators {
  display: flex;
  justify-content: center;
  gap: var(--ma-social);
  flex-wrap: wrap;
}

.trigram-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-intimate);
  padding: var(--ma-personal);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.trigram-indicator:hover,
.trigram-indicator.active {
  background: rgba(104, 159, 56, 0.1);
  transform: scale(1.05);
}

.trigram-lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trigram-line {
  width: 2rem;
  height: 3px;
  background: var(--ink-black);
  border-radius: 1px;
}

.trigram-line--broken {
  position: relative;
  background: transparent;
}

.trigram-line--broken::before,
.trigram-line--broken::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0.75rem;
  height: 3px;
  background: var(--ink-black);
  border-radius: 1px;
}

.trigram-line--broken::before { left: 0; }
.trigram-line--broken::after { right: 0; }

.trigram-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--wabi-grey);
}

/* 64卦グリッド */
.hexagram-grid {
  grid-area: grid;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--ma-personal);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.618rem;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
}

.matrix-expanded .hexagram-grid {
  grid-template-columns: repeat(8, 1fr);
  gap: var(--ma-social);
}

.hexagram-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--zen-white);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.hexagram-cell:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--bamboo-green);
}

.hexagram-cell.active {
  background: var(--bamboo-green);
  color: white;
  box-shadow: var(--shadow-lg);
}

.hexagram-cell.highlighted {
  border-color: var(--autumn-gold);
  background: rgba(255, 143, 0, 0.1);
}

.hexagram-cell.current-guidance {
  border-color: var(--cherry-pink);
  box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.3);
}

.hexagram-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-intimate);
  width: 100%;
}

.hexagram-lines {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.hexagram-line {
  width: 1.5rem;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  transition: all var(--transition-base);
}

.hexagram-line--broken {
  position: relative;
  background: transparent;
}

.hexagram-line--broken::before,
.hexagram-line--broken::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0.6rem;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.hexagram-line--broken::before { left: 0; }
.hexagram-line--broken::after { right: 0; }

.hexagram-line--changing {
  animation: changingLine 2s ease-in-out infinite;
}

@keyframes changingLine {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hexagram-info {
  text-align: center;
  width: 100%;
}

.hexagram-number {
  font-size: 0.625rem;
  font-weight: bold;
  opacity: 0.7;
}

.hexagram-name {
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 1px;
}

.hexagram-attributes {
  display: flex;
  gap: var(--ma-intimate);
  margin-top: var(--ma-intimate);
}

.season-indicator,
.direction-indicator {
  font-size: 0.5rem;
  padding: 1px 3px;
  background: rgba(0,0,0,0.1);
  border-radius: 2px;
}

/* ツールチップ */
.hexagram-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink-black);
  color: white;
  padding: var(--ma-personal);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: var(--z-tooltip);
  margin-top: 0.25rem;
}

.tooltip-meaning {
  margin-bottom: var(--ma-intimate);
}

.tooltip-keywords {
  display: flex;
  gap: var(--ma-intimate);
}

.keyword {
  background: rgba(255,255,255,0.2);
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 0.625rem;
}

/* 詳細パネル */
.hexagram-detail-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.618rem;
  padding: var(--ma-contemplative);
  box-shadow: var(--shadow-xl);
  margin-bottom: var(--ma-social);
}

.detail-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--ma-social);
  margin-bottom: var(--ma-social);
  padding-bottom: var(--ma-social);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.detail-hexagram {
  display: flex;
  justify-content: center;
}

.large-hexagram-lines {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.large-hexagram-line {
  width: 4rem;
  height: 0.5rem;
  background: var(--ink-black);
  border-radius: 0.25rem;
}

.large-hexagram-line--broken {
  position: relative;
  background: transparent;
}

.large-hexagram-line--broken::before,
.large-hexagram-line--broken::after {
  content: '';
  position: absolute;
  top: 0;
  width: 1.5rem;
  height: 0.5rem;
  background: var(--ink-black);
  border-radius: 0.25rem;
}

.large-hexagram-line--broken::before { left: 0; }
.large-hexagram-line--broken::after { right: 0; }

.large-hexagram-line--changing {
  animation: changingLine 2s ease-in-out infinite;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: var(--ma-personal);
}

.detail-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ink-black);
}

.detail-pinyin {
  font-size: 1rem;
  font-weight: normal;
  color: var(--wabi-grey);
}

.detail-meaning {
  font-size: 1.125rem;
  color: var(--wabi-grey);
  line-height: 1.5;
}

.detail-attributes {
  display: flex;
  gap: var(--ma-social);
  flex-wrap: wrap;
}

.attribute {
  display: flex;
  gap: var(--ma-intimate);
}

.attribute-label {
  font-weight: 600;
  color: var(--ink-black);
}

.attribute-value {
  color: var(--bamboo-green);
  font-weight: 500;
}

/* 古典テキスト */
.classical-texts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--ma-social);
  margin-bottom: var(--ma-social);
}

.text-section {
  background: rgba(104, 159, 56, 0.05);
  padding: var(--ma-social);
  border-radius: 1rem;
  border-left: 4px solid var(--bamboo-green);
}

.text-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--ma-personal);
  color: var(--ink-black);
}

.text-content {
  line-height: 1.6;
  color: var(--wabi-grey);
  font-style: italic;
}

/* 現代的ガイダンス */
.modern-guidance {
  margin-bottom: var(--ma-social);
}

.guidance-tabs {
  display: flex;
  gap: var(--ma-intimate);
  margin-bottom: var(--ma-social);
  background: rgba(0,0,0,0.05);
  padding: var(--ma-intimate);
  border-radius: 0.5rem;
}

.guidance-tab {
  flex: 1;
  padding: var(--ma-personal);
  border: none;
  background: transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all var(--transition-base);
  font-weight: 500;
}

.guidance-tab:hover {
  background: rgba(255,255,255,0.5);
}

.guidance-tab.active {
  background: var(--bamboo-green);
  color: white;
}

.guidance-content {
  background: rgba(255, 255, 255, 0.9);
  padding: var(--ma-social);
  border-radius: 0.5rem;
}

.guidance-panel h5 {
  margin-bottom: var(--ma-personal);
  color: var(--ink-black);
  font-weight: 600;
}

.guidance-panel p {
  line-height: 1.6;
  color: var(--wabi-grey);
}

.action-list {
  list-style: none;
  padding: 0;
}

.action-list li {
  padding: var(--ma-intimate) 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  position: relative;
  padding-left: var(--ma-social);
}

.action-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--bamboo-green);
  font-weight: bold;
}

/* 関連卦 */
.hexagram-relationships {
  margin-bottom: var(--ma-social);
}

.relationships-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
}

.relationship-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--ma-social);
}

.related-hexagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-personal);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.related-hexagram:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.related-visual {
  display: flex;
  justify-content: center;
}

.mini-hexagram-lines {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mini-hexagram-line {
  width: 1rem;
  height: 1.5px;
  background: var(--ink-black);
}

.mini-hexagram-line--broken {
  position: relative;
  background: transparent;
}

.mini-hexagram-line--broken::before,
.mini-hexagram-line--broken::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0.375rem;
  height: 1.5px;
  background: var(--ink-black);
}

.mini-hexagram-line--broken::before { left: 0; }
.mini-hexagram-line--broken::after { right: 0; }

.related-info {
  text-align: center;
}

.related-number {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--wabi-grey);
}

.related-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-black);
}

.relationship-type {
  font-size: 0.625rem;
  color: var(--bamboo-green);
  font-weight: 500;
}

/* パーソナライズされた解釈 */
.personalized-interpretation {
  background: linear-gradient(135deg, 
    rgba(255, 183, 77, 0.1) 0%, 
    rgba(255, 183, 77, 0.05) 100%);
  padding: var(--ma-social);
  border-radius: 1rem;
  border-left: 4px solid var(--autumn-gold);
  margin-bottom: var(--ma-social);
}

.interpretation-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
}

.interpretation-text {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--ma-social);
  color: var(--wabi-grey);
}

.interpretation-aspects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--ma-personal);
}

.aspect-item {
  display: flex;
  gap: var(--ma-personal);
  padding: var(--ma-personal);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
}

.aspect-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.aspect-content {
  flex: 1;
}

.aspect-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--ma-intimate);
  color: var(--ink-black);
}

.aspect-description {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--wabi-grey);
}

/* ナビゲーションコントロール */
.navigation-controls {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--ma-social);
  margin-bottom: var(--ma-social);
  padding: var(--ma-social);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
}

.search-filter {
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--ma-personal);
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-clear {
  position: absolute;
  right: var(--ma-personal);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--wabi-grey);
}

.filter-options {
  display: flex;
  gap: var(--ma-personal);
}

.filter-select {
  flex: 1;
  padding: var(--ma-personal);
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.view-options {
  display: flex;
  gap: var(--ma-personal);
}

.view-toggle,
.guidance-mode-toggle {
  padding: var(--ma-personal);
  border: 1px solid var(--bamboo-green);
  background: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 0.875rem;
  font-weight: 500;
}

.view-toggle:hover,
.guidance-mode-toggle:hover {
  background: rgba(104, 159, 56, 0.1);
}

.view-toggle.active,
.guidance-mode-toggle.active {
  background: var(--bamboo-green);
  color: white;
}

/* 序卦伝の流れ */
.sequence-flow {
  background: rgba(255, 255, 255, 0.9);
  padding: var(--ma-social);
  border-radius: 1rem;
  border-top: 4px solid var(--cherry-pink);
}

.sequence-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--ma-social);
  color: var(--ink-black);
  text-align: center;
}

.sequence-path {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ma-personal);
  margin-bottom: var(--ma-social);
  flex-wrap: wrap;
}

.sequence-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-base);
}

.sequence-step:hover {
  transform: scale(1.05);
}

.sequence-step.current {
  transform: scale(1.1);
}

.sequence-hexagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ma-intimate);
  padding: var(--ma-personal);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  border: 1px solid rgba(0,0,0,0.1);
}

.sequence-step.current .sequence-hexagram {
  border-color: var(--cherry-pink);
  background: rgba(233, 30, 99, 0.1);
}

.sequence-lines {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sequence-line {
  width: 1.25rem;
  height: 2px;
  background: var(--ink-black);
}

.sequence-line--broken {
  position: relative;
  background: transparent;
}

.sequence-line--broken::before,
.sequence-line--broken::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0.5rem;
  height: 2px;
  background: var(--ink-black);
}

.sequence-line--broken::before { left: 0; }
.sequence-line--broken::after { right: 0; }

.sequence-number {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--wabi-grey);
}

.sequence-arrow {
  font-size: 1.5rem;
  color: var(--bamboo-green);
  margin: 0 var(--ma-personal);
}

.sequence-explanation {
  text-align: center;
  padding: var(--ma-social);
  background: rgba(104, 159, 56, 0.05);
  border-radius: 0.5rem;
  color: var(--wabi-grey);
  line-height: 1.6;
}

/* レスポンシブ対応 */
@media (max-width: 1024px) {
  .hexagram-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .navigation-controls {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hexagram-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .sancai-header {
    flex-direction: column;
    gap: var(--ma-social);
  }
  
  .trigram-indicators {
    gap: var(--ma-personal);
  }
  
  .classical-texts {
    grid-template-columns: 1fr;
  }
  
  .relationship-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sequence-path {
    flex-direction: column;
  }
  
  .sequence-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .hexagram-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .guidance-tabs {
    flex-direction: column;
  }
  
  .interpretation-aspects {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .changingLine {
    animation: none;
  }
  
  .hexagram-cell,
  .trigram-indicator,
  .sequence-step {
    transition: none;
  }
}
</style>