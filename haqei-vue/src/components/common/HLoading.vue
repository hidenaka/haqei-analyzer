<template>
  <Transition name="loading" @after-leave="$emit('after-leave')">
    <div v-if="loading" class="h-loading" :class="loadingClasses">
      <div class="h-loading-backdrop" v-if="overlay" @click="handleBackdropClick" />
      
      <div class="h-loading-content">
        <HSpinner 
          :size="spinnerSize" 
          :color="spinnerColor"
          :thickness="spinnerThickness"
        />
        
        <div v-if="text || progress !== undefined" class="h-loading-info">
          <p v-if="text" class="h-loading-text">{{ text }}</p>
          
          <div v-if="progress !== undefined" class="h-loading-progress">
            <div class="h-loading-progress-bar">
              <div 
                class="h-loading-progress-fill" 
                :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
              />
            </div>
            <span class="h-loading-progress-text">{{ Math.round(progress) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HSpinner from './HSpinner.vue'

interface Props {
  loading: boolean
  fullscreen?: boolean
  overlay?: boolean
  text?: string
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  zIndex?: number
  disableBackdropClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fullscreen: false,
  overlay: true,
  size: 'md',
  color: 'primary',
  zIndex: 1000,
  disableBackdropClick: false,
})

const emit = defineEmits<{
  'backdrop-click': []
  'after-leave': []
}>()

const loadingClasses = computed(() => ({
  'h-loading--fullscreen': props.fullscreen,
  'h-loading--overlay': props.overlay,
  [`h-loading--${props.size}`]: true,
}))

const spinnerSize = computed(() => {
  const sizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  }
  return sizeMap[props.size]
})

const spinnerColor = computed(() => {
  return props.overlay ? 'white' : props.color
})

const spinnerThickness = computed(() => {
  const thicknessMap = {
    sm: 'thin' as const,
    md: 'normal' as const,
    lg: 'normal' as const,
  }
  return thicknessMap[props.size]
})

const handleBackdropClick = () => {
  if (!props.disableBackdropClick) {
    emit('backdrop-click')
  }
}
</script>

<style scoped>
.h-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: v-bind(zIndex);
}

.h-loading--fullscreen {
  position: fixed;
}

.h-loading-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
}

.h-loading--overlay .h-loading-backdrop {
  backdrop-filter: blur(2px);
}

.h-loading-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

.h-loading--overlay .h-loading-content {
  background-color: rgba(0, 0, 0, 0.75);
}

.h-loading-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.h-loading-text {
  font-size: var(--text-base);
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.h-loading--overlay .h-loading-text {
  color: white;
}

.h-loading-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 200px;
}

.h-loading-progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.h-loading--overlay .h-loading-progress-bar {
  background-color: rgba(255, 255, 255, 0.2);
}

.h-loading-progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.h-loading--overlay .h-loading-progress-fill {
  background-color: white;
}

.h-loading-progress-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.h-loading--overlay .h-loading-progress-text {
  color: rgba(255, 255, 255, 0.8);
}

/* Size variations */
.h-loading--sm .h-loading-content {
  padding: var(--space-4);
  gap: var(--space-3);
}

.h-loading--sm .h-loading-text {
  font-size: var(--text-sm);
}

.h-loading--lg .h-loading-content {
  padding: var(--space-8);
  gap: var(--space-5);
}

.h-loading--lg .h-loading-text {
  font-size: var(--text-lg);
}

.h-loading--lg .h-loading-progress {
  width: 300px;
}

/* Transitions */
.loading-enter-active,
.loading-leave-active {
  transition: opacity var(--transition-base);
}

.loading-enter-active .h-loading-content,
.loading-leave-active .h-loading-content {
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

.loading-enter-from .h-loading-content,
.loading-leave-to .h-loading-content {
  transform: scale(0.9);
  opacity: 0;
}
</style>