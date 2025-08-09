<template>
  <div class="hexagram-transition">
    <h3 v-if="title" class="transition-title">{{ title }}</h3>
    
    <div class="transition-container">
      <!-- From Hexagram -->
      <transition name="slide-out" mode="out-in">
        <div v-if="!isTransitioning" key="from" class="hexagram-state from">
          <HexagramVisualization
            :hexagram-id="fromHexagramId"
            :size="size"
            :show-info="true"
            :highlighted-lines="changingLines"
            :animated="false"
          />
          <div class="state-label">変化前</div>
        </div>
      </transition>
      
      <!-- Transition Animation -->
      <transition name="fade">
        <div v-if="isTransitioning" class="transition-animation">
          <div class="changing-lines-indicator">
            <span v-for="line in changingLines" :key="line" class="changing-line">
              第{{ line }}爻
            </span>
            <span class="changing-text">が変化中...</span>
          </div>
          <div class="transition-progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </transition>
      
      <!-- To Hexagram -->
      <transition name="slide-in" mode="out-in">
        <div v-if="showToHexagram" key="to" class="hexagram-state to">
          <HexagramVisualization
            :hexagram-id="toHexagramId"
            :size="size"
            :show-info="true"
            :highlighted-lines="changingLines"
            :animated="true"
          />
          <div class="state-label">変化後</div>
        </div>
      </transition>
    </div>
    
    <!-- Transition Explanation -->
    <div v-if="showExplanation && transitionComplete" class="transition-explanation">
      <h4>変化の意味</h4>
      <p>{{ getTransitionMeaning() }}</p>
      <div class="transition-details">
        <div class="detail-item">
          <span class="detail-label">変化の爻:</span>
          <span class="detail-value">{{ changingLinesText }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">変化の性質:</span>
          <span class="detail-value">{{ transitionNature }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type PropType } from 'vue'
import HexagramVisualization from './HexagramVisualization.vue'
import { getHexagramById, getHexagramLines } from '@/data/hexagrams'

/**
 * 卦の変化をアニメーション表示するコンポーネント
 * 
 * 目的：
 * - 爻の変化による卦の変化を視覚的に表現
 * - 変化のプロセスを段階的に表示
 * - 変化の意味を解説
 * 
 * 処理内容：
 * 1. 変化前の卦を表示
 * 2. 変化する爻をハイライト
 * 3. アニメーションで変化を表現
 * 4. 変化後の卦を表示
 * 5. 変化の意味を解説
 * 
 * 副作用：
 * - transition-complete イベントの発火
 * - アニメーションタイマーの管理
 */

// Props
const props = defineProps({
  fromHexagramId: {
    type: Number,
    required: true
  },
  toHexagramId: {
    type: Number,
    required: true
  },
  changingLines: {
    type: Array as PropType<number[]>,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  duration: {
    type: Number,
    default: 2000 // milliseconds
  },
  autoStart: {
    type: Boolean,
    default: true
  },
  showExplanation: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['transition-complete', 'transition-start'])

// State
const isTransitioning = ref(false)
const showToHexagram = ref(false)
const transitionComplete = ref(false)
const progress = ref(0)

// Computed
const fromHexagram = computed(() => getHexagramById(props.fromHexagramId))
const toHexagram = computed(() => getHexagramById(props.toHexagramId))

const changingLinesText = computed(() => {
  if (props.changingLines.length === 0) return 'なし'
  if (props.changingLines.length === 1) return `第${props.changingLines[0]}爻`
  return props.changingLines.map(line => `第${line}爻`).join('、')
})

const transitionNature = computed(() => {
  const changeCount = props.changingLines.length
  if (changeCount === 0) return '不変'
  if (changeCount === 1) return '単一変化'
  if (changeCount === 2) return '二重変化'
  if (changeCount === 3) return '半数変化'
  if (changeCount >= 4) return '大変革'
  return '複数変化'
})

// Methods
function startTransition() {
  if (isTransitioning.value) return
  
  emit('transition-start')
  isTransitioning.value = true
  progress.value = 0
  
  // Progress animation
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    progress.value = Math.min((elapsed / props.duration) * 100, 100)
    
    if (progress.value < 100) {
      requestAnimationFrame(animate)
    } else {
      completeTransition()
    }
  }
  
  requestAnimationFrame(animate)
}

function completeTransition() {
  isTransitioning.value = false
  showToHexagram.value = true
  transitionComplete.value = true
  emit('transition-complete', {
    from: props.fromHexagramId,
    to: props.toHexagramId,
    changingLines: props.changingLines
  })
}

function getTransitionMeaning(): string {
  if (!fromHexagram.value || !toHexagram.value) return ''
  
  // 簡略化された変化の意味（実際はもっと詳細な解説が必要）
  const meanings: Record<string, string> = {
    '1-2': '天の創造力が地の受容力へと変化。積極性から受容性への転換を示します。',
    '2-1': '地の受容力が天の創造力へと変化。受動性から能動性への転換を示します。',
    // ... more meanings
  }
  
  const key = `${props.fromHexagramId}-${props.toHexagramId}`
  return meanings[key] || `${fromHexagram.value.nameJp}から${toHexagram.value.nameJp}への変化。${changingLinesText.value}の変化により、新たな局面が開かれます。`
}

// Lifecycle
onMounted(() => {
  if (props.autoStart) {
    setTimeout(startTransition, 500)
  }
})

// Expose methods
defineExpose({
  startTransition,
  reset: () => {
    isTransitioning.value = false
    showToHexagram.value = false
    transitionComplete.value = false
    progress.value = 0
  }
})
</script>

<style scoped>
.hexagram-transition {
  width: 100%;
}

.transition-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

/* Container */
.transition-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  min-height: 300px;
  position: relative;
}

/* Hexagram States */
.hexagram-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.state-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.hexagram-state.from .state-label {
  color: var(--color-from, #666);
}

.hexagram-state.to .state-label {
  color: var(--color-to, var(--primary-color));
}

/* Transition Animation */
.transition-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  max-width: 300px;
}

.changing-lines-indicator {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--primary-color);
}

.changing-line {
  font-weight: bold;
  margin: 0 0.25rem;
}

.changing-text {
  color: var(--text-secondary);
}

.transition-progress {
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.1s linear;
}

/* Transition Explanation */
.transition-explanation {
  margin-top: 3rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  animation: fadeIn 0.5s ease;
}

.transition-explanation h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.transition-explanation p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: var(--text-secondary);
}

.transition-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.detail-value {
  color: var(--text-primary);
}

/* Animations */
.slide-out-leave-active {
  transition: all 0.5s ease;
}

.slide-out-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-in-enter-active {
  transition: all 0.5s ease;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .transition-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .transition-animation {
    position: static;
    transform: none;
    margin: 1rem 0;
  }
}
</style>