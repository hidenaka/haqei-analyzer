<template>
  <div class="hexagram-comparison">
    <h3 v-if="title" class="comparison-title">{{ title }}</h3>
    
    <div class="hexagrams-container">
      <!-- Primary Hexagram -->
      <div class="hexagram-item primary">
        <div class="hexagram-label">{{ primaryLabel }}</div>
        <HexagramVisualization
          :hexagram-id="primaryHexagramId"
          :size="size"
          :show-info="true"
          :show-trigram-labels="showDetails"
          :animated="animated"
          @hexagram-click="handleHexagramClick('primary', $event)"
        />
        <div v-if="showDetails" class="hexagram-details">
          <p class="catchphrase">{{ primaryHexagram?.catchphrase }}</p>
          <div class="keywords">
            <span 
              v-for="keyword in primaryKeywords" 
              :key="keyword"
              class="keyword-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Comparison Arrow/Symbol -->
      <div class="comparison-symbol">
        <transition name="pulse">
          <span v-if="comparisonType === 'contrast'" class="symbol contrast">⇄</span>
          <span v-else-if="comparisonType === 'evolution'" class="symbol evolution">→</span>
          <span v-else-if="comparisonType === 'balance'" class="symbol balance">⚖</span>
          <span v-else class="symbol relation">↔</span>
        </transition>
        <span class="symbol-label">{{ comparisonLabel }}</span>
      </div>
      
      <!-- Secondary Hexagram -->
      <div class="hexagram-item secondary">
        <div class="hexagram-label">{{ secondaryLabel }}</div>
        <HexagramVisualization
          :hexagram-id="secondaryHexagramId"
          :size="size"
          :show-info="true"
          :show-trigram-labels="showDetails"
          :animated="animated"
          @hexagram-click="handleHexagramClick('secondary', $event)"
        />
        <div v-if="showDetails" class="hexagram-details">
          <p class="catchphrase">{{ secondaryHexagram?.catchphrase }}</p>
          <div class="keywords">
            <span 
              v-for="keyword in secondaryKeywords" 
              :key="keyword"
              class="keyword-tag"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Comparison Analysis -->
    <div v-if="showAnalysis" class="comparison-analysis">
      <h4>関係性の分析</h4>
      <div class="analysis-content">
        <div class="analysis-item">
          <span class="analysis-label">共通要素:</span>
          <span class="analysis-value">{{ commonElements }}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">相違点:</span>
          <span class="analysis-value">{{ differences }}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">変化の爻:</span>
          <span class="analysis-value">{{ changingLines.join(', ') || 'なし' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import HexagramVisualization from './HexagramVisualization.vue'
import { getHexagramById, getHexagramLines, type Hexagram } from '@/data/hexagrams'

/**
 * 2つの卦を比較表示するコンポーネント
 * 
 * 目的：
 * - Engine OS、Interface OS、SafeMode OSの関係性を視覚化
 * - 卦の変化や対比を明確に表示
 * - インタラクティブな比較分析機能
 * 
 * 処理内容：
 * 1. 2つの卦を並べて表示
 * 2. 共通要素と相違点を分析
 * 3. 変化の爻を特定して表示
 * 4. 関係性のタイプに応じた視覚表現
 * 
 * 副作用：
 * - hexagram-select イベントの発火
 * - comparison-changeイベントの発火
 */

// Props
const props = defineProps({
  primaryHexagramId: {
    type: Number,
    required: true
  },
  secondaryHexagramId: {
    type: Number,
    required: true
  },
  primaryLabel: {
    type: String,
    default: '主卦'
  },
  secondaryLabel: {
    type: String,
    default: '副卦'
  },
  comparisonType: {
    type: String as PropType<'contrast' | 'evolution' | 'balance' | 'relation'>,
    default: 'relation'
  },
  comparisonLabel: {
    type: String,
    default: '関係性'
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  showDetails: {
    type: Boolean,
    default: true
  },
  showAnalysis: {
    type: Boolean,
    default: true
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['hexagram-select', 'comparison-change'])

// Computed
const primaryHexagram = computed(() => getHexagramById(props.primaryHexagramId))
const secondaryHexagram = computed(() => getHexagramById(props.secondaryHexagramId))

const primaryKeywords = computed(() => 
  primaryHexagram.value?.keywords.split(',').map(k => k.trim()) || []
)

const secondaryKeywords = computed(() => 
  secondaryHexagram.value?.keywords.split(',').map(k => k.trim()) || []
)

const primaryLines = computed(() => getHexagramLines(props.primaryHexagramId))
const secondaryLines = computed(() => getHexagramLines(props.secondaryHexagramId))

const changingLines = computed(() => {
  const changes: number[] = []
  primaryLines.value.forEach((line, index) => {
    if (line !== secondaryLines.value[index]) {
      changes.push(index + 1) // 爻は1から始まる
    }
  })
  return changes
})

const commonElements = computed(() => {
  if (!primaryHexagram.value || !secondaryHexagram.value) return ''
  
  // 上卦または下卦が同じかチェック
  const sameUpper = primaryHexagram.value.upperTrigramId === secondaryHexagram.value.upperTrigramId
  const sameLower = primaryHexagram.value.lowerTrigramId === secondaryHexagram.value.lowerTrigramId
  
  if (sameUpper && sameLower) return '完全一致'
  if (sameUpper) return '上卦が同じ'
  if (sameLower) return '下卦が同じ'
  return '共通の卦なし'
})

const differences = computed(() => {
  const changeCount = changingLines.value.length
  if (changeCount === 0) return '同一の卦'
  if (changeCount === 1) return '1爻の変化'
  if (changeCount === 6) return '完全反転'
  return `${changeCount}爻の変化`
})

// Methods
function handleHexagramClick(type: 'primary' | 'secondary', event: any) {
  emit('hexagram-select', {
    type,
    hexagram: event.data
  })
}
</script>

<style scoped>
.hexagram-comparison {
  width: 100%;
}

.comparison-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

/* Container */
.hexagrams-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

/* Hexagram Items */
.hexagram-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.hexagram-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.hexagram-item.primary .hexagram-label {
  color: var(--primary-color);
}

/* Hexagram Details */
.hexagram-details {
  text-align: center;
  max-width: 250px;
}

.catchphrase {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* Comparison Symbol */
.comparison-symbol {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.symbol {
  font-size: 2.5rem;
  line-height: 1;
  display: block;
}

.symbol.contrast {
  color: var(--color-contrast, #FF6B6B);
}

.symbol.evolution {
  color: var(--color-evolution, #4ECDC4);
}

.symbol.balance {
  color: var(--color-balance, #FFD93D);
}

.symbol.relation {
  color: var(--primary-color);
}

.symbol-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Comparison Analysis */
.comparison-analysis {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.comparison-analysis h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.analysis-value {
  color: var(--text-primary);
}

/* Animations */
.pulse-enter-active,
.pulse-leave-active {
  transition: all 0.3s ease;
}

.pulse-enter-from,
.pulse-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.symbol {
  animation: pulse 2s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .hexagrams-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .comparison-symbol {
    transform: rotate(90deg);
    margin: 1rem 0;
  }
  
  .comparison-analysis {
    padding: 1rem;
  }
}
</style>