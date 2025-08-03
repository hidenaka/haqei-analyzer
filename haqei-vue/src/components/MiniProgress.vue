<template>
  <div class="mini-progress" :class="{ 'expanded': isExpanded }">
    <!-- Collapsed View -->
    <div class="mini-header" @click="toggleExpanded">
      <div class="mini-info">
        <span class="mini-current">{{ current }}</span>
        <span class="mini-separator">/</span>
        <span class="mini-total">{{ total }}</span>
      </div>
      
      <div class="mini-bar">
        <div 
          class="mini-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      
      <div class="mini-percentage">
        {{ progressPercentage }}%
      </div>
      
      <button class="expand-btn" :aria-label="isExpanded ? 'Collapse' : 'Expand'">
        <svg viewBox="0 0 24 24" class="expand-icon">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </button>
    </div>
    
    <!-- Expanded View -->
    <transition name="expand">
      <div v-if="isExpanded" class="mini-details">
        <div class="detail-row">
          <span class="detail-label">現在のフェーズ</span>
          <span class="detail-value">{{ phaseLabel }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">回答済み</span>
          <span class="detail-value">{{ answered }}問</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">残り時間</span>
          <span class="detail-value">{{ estimatedTime }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  current: number
  total: number
  answered?: number
}

const props = withDefaults(defineProps<Props>(), {
  answered: 0
})

const isExpanded = ref(false)

// Constants
const QUESTIONS_PER_MINUTE = 2

// Computed properties
const progressPercentage = computed(() => {
  return Math.round((props.current / props.total) * 100)
})

const phaseLabel = computed(() => {
  if (props.current <= 24) return '価値観質問'
  if (props.current <= 30) return 'シナリオ質問'
  return '完了'
})

const estimatedTime = computed(() => {
  const remaining = props.total - props.current
  const minutes = Math.ceil(remaining / QUESTIONS_PER_MINUTE)
  
  if (minutes < 1) return '完了間近'
  if (minutes === 1) return '約1分'
  return `約${minutes}分`
})

// Methods
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.mini-progress {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.mini-progress.expanded {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Header */
.mini-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
}

.mini-info {
  display: flex;
  align-items: baseline;
  font-weight: 600;
}

.mini-current {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.mini-separator {
  margin: 0 0.25rem;
  color: var(--text-secondary);
}

.mini-total {
  color: var(--text-secondary);
}

.mini-bar {
  flex: 1;
  height: 6px;
  background: var(--progress-bg, #e5e7eb);
  border-radius: 3px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.mini-percentage {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 3ch;
  text-align: right;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.expand-icon {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.3s ease;
}

.mini-progress.expanded .expand-icon {
  transform: rotate(180deg);
}

/* Details */
.mini-details {
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--border-color);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Animations */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .mini-progress {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .mini-progress.expanded {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}

/* Responsive - Show only on mobile */
@media (min-width: 769px) {
  .mini-progress {
    display: none;
  }
}
</style>