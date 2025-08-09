<template>
  <div class="h-progress" :class="progressClasses">
    <div v-if="label || showValue" class="h-progress-header">
      <span v-if="label" class="h-progress-label">{{ label }}</span>
      <span v-if="showValue" class="h-progress-value">
        {{ formattedValue }}
      </span>
    </div>
    
    <div class="h-progress-track" :style="trackStyles">
      <div 
        class="h-progress-bar" 
        :style="barStyles"
        role="progressbar"
        :aria-valuenow="value"
        :aria-valuemin="min"
        :aria-valuemax="max"
      >
        <span v-if="showValueInBar && !indeterminate" class="h-progress-bar-value">
          {{ formattedValue }}
        </span>
      </div>
    </div>
    
    <div v-if="hint" class="h-progress-hint">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number
  min?: number
  max?: number
  label?: string
  hint?: string
  showValue?: boolean
  showValueInBar?: boolean
  format?: (value: number, min: number, max: number) => string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  striped?: boolean
  animated?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  min: 0,
  max: 100,
  showValue: false,
  showValueInBar: false,
  color: 'primary',
  size: 'md',
  striped: false,
  animated: false,
  indeterminate: false,
})

const progressClasses = computed(() => [
  `h-progress--${props.color}`,
  `h-progress--${props.size}`,
  {
    'h-progress--striped': props.striped,
    'h-progress--animated': props.animated || props.indeterminate,
    'h-progress--indeterminate': props.indeterminate,
  },
])

const percentage = computed(() => {
  if (props.indeterminate) return 0
  const range = props.max - props.min
  const progress = props.value - props.min
  return Math.min(100, Math.max(0, (progress / range) * 100))
})

const formattedValue = computed(() => {
  if (props.format) {
    return props.format(props.value, props.min, props.max)
  }
  
  if (props.max === 100 && props.min === 0) {
    return `${Math.round(props.value)}%`
  }
  
  return `${props.value} / ${props.max}`
})

const trackStyles = computed(() => {
  const heights = {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
  }
  return {
    height: heights[props.size],
  }
})

const barStyles = computed(() => {
  if (props.indeterminate) {
    return {}
  }
  
  return {
    width: `${percentage.value}%`,
  }
})
</script>

<style scoped>
.h-progress {
  width: 100%;
}

.h-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.h-progress-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.h-progress-value {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.h-progress-track {
  width: 100%;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.h-progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h-progress-bar-value {
  font-size: var(--text-xs);
  color: white;
  font-weight: var(--font-medium);
  white-space: nowrap;
  padding: 0 var(--space-2);
}

.h-progress-hint {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

/* Colors */
.h-progress--primary .h-progress-bar {
  background-color: var(--primary-color);
}

.h-progress--success .h-progress-bar {
  background-color: var(--success);
}

.h-progress--warning .h-progress-bar {
  background-color: var(--warning);
}

.h-progress--error .h-progress-bar {
  background-color: var(--error);
}

.h-progress--info .h-progress-bar {
  background-color: var(--info);
}

/* Striped pattern */
.h-progress--striped .h-progress-bar {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

/* Animated stripes */
.h-progress--animated .h-progress-bar {
  animation: progress-stripes 1s linear infinite;
}

/* Indeterminate state */
.h-progress--indeterminate .h-progress-bar {
  width: 30%;
  position: absolute;
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}

/* Size adjustments for bar value */
.h-progress--xs .h-progress-bar-value {
  display: none;
}

.h-progress--sm .h-progress-bar-value {
  font-size: 0.625rem;
  padding: 0 var(--space-1);
}

/* Animations */
@keyframes progress-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

@keyframes progress-indeterminate {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .h-progress--md .h-progress-bar-value,
  .h-progress--sm .h-progress-bar-value {
    display: none;
  }
}
</style>