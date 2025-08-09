<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="button-spinner">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle
          class="spinner-circle"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke-width="3"
        />
      </svg>
    </span>
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'h-button',
  `h-button--${props.variant}`,
  `h-button--${props.size}`,
  {
    'h-button--full-width': props.fullWidth,
    'h-button--loading': props.loading,
    'h-button--disabled': props.disabled,
  },
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.h-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  cursor: pointer;
  border: 2px solid transparent;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  outline: none;
}

/* Sizes */
.h-button--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  min-height: 32px;
}

.h-button--md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  min-height: 40px;
}

.h-button--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  min-height: 48px;
}

/* Variants */
.h-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.h-button--primary:hover:not(.h-button--disabled):not(.h-button--loading) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.h-button--primary:active:not(.h-button--disabled):not(.h-button--loading) {
  background-color: var(--primary-active);
  transform: translateY(0);
}

.h-button--secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.h-button--secondary:hover:not(.h-button--disabled):not(.h-button--loading) {
  background-color: var(--bg-secondary);
}

.h-button--outline {
  background-color: transparent;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.h-button--outline:hover:not(.h-button--disabled):not(.h-button--loading) {
  background-color: var(--primary-color);
  color: white;
}

.h-button--ghost {
  background-color: transparent;
  color: var(--text-secondary);
}

.h-button--ghost:hover:not(.h-button--disabled):not(.h-button--loading) {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.h-button--danger {
  background-color: var(--error);
  color: white;
}

.h-button--danger:hover:not(.h-button--disabled):not(.h-button--loading) {
  background-color: #d32f2f;
}

/* States */
.h-button--full-width {
  width: 100%;
}

.h-button--disabled,
.h-button--loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.h-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Loading spinner */
.button-spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  stroke: currentColor;
  stroke-dasharray: 62.83;
  stroke-dashoffset: 47.12;
  stroke-linecap: round;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.opacity-0 {
  opacity: 0;
}
</style>