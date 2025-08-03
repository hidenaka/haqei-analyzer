<template>
  <div class="hexagram-visualization">
    <div class="hexagram-container" @click="handleClick">
      <!-- Upper Trigram -->
      <div class="trigram upper-trigram">
        <div 
          v-for="(line, index) in upperTrigramLines"
          :key="`upper-${index}`"
          class="hexagram-line"
          :class="{ 
            'yang': line, 
            'yin': !line,
            'highlighted': highlightedLines.includes(index + 3)
          }"
          :style="{ animationDelay: `${(5 - index) * 100}ms` }"
        >
          <span v-if="line" class="yang-line"></span>
          <span v-else class="yin-line">
            <span class="yin-part"></span>
            <span class="yin-gap"></span>
            <span class="yin-part"></span>
          </span>
        </div>
      </div>
      
      <!-- Trigram Separator -->
      <div v-if="showTrigramSeparator" class="trigram-separator"></div>
      
      <!-- Lower Trigram -->
      <div class="trigram lower-trigram">
        <div 
          v-for="(line, index) in lowerTrigramLines"
          :key="`lower-${index}`"
          class="hexagram-line"
          :class="{ 
            'yang': line, 
            'yin': !line,
            'highlighted': highlightedLines.includes(index)
          }"
          :style="{ animationDelay: `${(2 - index) * 100}ms` }"
        >
          <span v-if="line" class="yang-line"></span>
          <span v-else class="yin-line">
            <span class="yin-part"></span>
            <span class="yin-gap"></span>
            <span class="yin-part"></span>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Hexagram Info -->
    <div v-if="showInfo" class="hexagram-info">
      <h3 class="hexagram-number">第{{ hexagramId }}卦</h3>
      <h4 class="hexagram-name">{{ hexagramData?.nameJp }}</h4>
      <p v-if="showReading" class="hexagram-reading">{{ hexagramData?.reading }}</p>
    </div>
    
    <!-- Trigram Labels -->
    <div v-if="showTrigramLabels" class="trigram-labels">
      <div class="trigram-label upper">
        <span class="trigram-symbol">{{ upperTrigram?.symbol }}</span>
        <span class="trigram-name">{{ upperTrigram?.nameJp }} ({{ upperTrigram?.meaning }})</span>
      </div>
      <div class="trigram-label lower">
        <span class="trigram-symbol">{{ lowerTrigram?.symbol }}</span>
        <span class="trigram-name">{{ lowerTrigram?.nameJp }} ({{ lowerTrigram?.meaning }})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { getHexagramById, getHexagramTrigrams, getHexagramLines } from '@/data/hexagrams'

/**
 * 易経の卦を視覚的に表示するコンポーネント
 * 
 * 目的：
 * - 64卦の視覚的表現
 * - 上卦・下卦の構成表示
 * - インタラクティブな操作サポート
 * - アニメーション効果による魅力的な表示
 * 
 * 処理内容：
 * 1. 卦IDから6本の爻（線）を生成
 * 2. 陽爻（実線）と陰爻（破線）を適切に表示
 * 3. 上卦と下卦を視覚的に分離
 * 4. クリックやホバーなどのインタラクション対応
 * 
 * 副作用：
 * - hexagram-clickイベントの発火
 * - highlightedLinesの状態変更
 */

// Props
const props = defineProps({
  hexagramId: {
    type: Number,
    required: true
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  showReading: {
    type: Boolean,
    default: false
  },
  showTrigramLabels: {
    type: Boolean,
    default: false
  },
  showTrigramSeparator: {
    type: Boolean,
    default: true
  },
  interactive: {
    type: Boolean,
    default: true
  },
  highlightedLines: {
    type: Array as PropType<number[]>,
    default: () => []
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['hexagram-click', 'line-click'])

// Computed
const hexagramData = computed(() => getHexagramById(props.hexagramId))

const { upper: upperTrigram, lower: lowerTrigram } = computed(() => 
  getHexagramTrigrams(props.hexagramId)
).value

const hexagramLines = computed(() => getHexagramLines(props.hexagramId))

const upperTrigramLines = computed(() => {
  // 上卦は爻4-6（配列インデックス3-5）
  return hexagramLines.value.slice(3, 6).reverse() // 表示は上から下へ
})

const lowerTrigramLines = computed(() => {
  // 下卦は爻1-3（配列インデックス0-2）
  return hexagramLines.value.slice(0, 3).reverse() // 表示は上から下へ
})

// Methods
function handleClick() {
  if (props.interactive) {
    emit('hexagram-click', {
      id: props.hexagramId,
      data: hexagramData.value
    })
  }
}
</script>

<style scoped>
.hexagram-visualization {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  user-select: none;
}

/* Container */
.hexagram-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hexagram-container[data-size="small"] {
  padding: 0.5rem;
  gap: 0.125rem;
}

.hexagram-container[data-size="large"] {
  padding: 1.5rem;
  gap: 0.375rem;
}

.hexagram-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Trigrams */
.trigram {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Trigram Separator */
.trigram-separator {
  height: 0.5rem;
  opacity: 0.3;
  border-bottom: 1px dashed var(--text-secondary);
  margin: 0.25rem 0;
}

/* Hexagram Lines */
.hexagram-line {
  position: relative;
  height: 0.5rem;
  width: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeInLine 0.3s ease forwards;
}

/* Size Variants */
.hexagram-container[data-size="small"] .hexagram-line {
  height: 0.375rem;
  width: 3rem;
}

.hexagram-container[data-size="large"] .hexagram-line {
  height: 0.625rem;
  width: 5rem;
}

/* Yang Line (Solid) */
.yang-line {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Yin Line (Broken) */
.yin-line {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20%;
}

.yin-part {
  flex: 1;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.yin-gap {
  width: 20%;
}

/* Highlighted Lines */
.hexagram-line.highlighted .yang-line,
.hexagram-line.highlighted .yin-part {
  background: var(--primary-color);
  box-shadow: 0 0 8px var(--primary-color);
}

/* Hexagram Info */
.hexagram-info {
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.hexagram-number {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin: 0 0 0.25rem 0;
}

.hexagram-name {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0;
}

.hexagram-reading {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

/* Trigram Labels */
.trigram-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;
  margin-top: 0.5rem;
}

.trigram-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.trigram-symbol {
  font-size: 1.5rem;
  line-height: 1;
}

.trigram-name {
  color: var(--text-secondary);
}

/* Animations */
@keyframes fadeInLine {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Interactive States */
.hexagram-container.interactive:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .hexagram-line {
    width: 3.5rem;
  }
  
  .trigram-labels {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>