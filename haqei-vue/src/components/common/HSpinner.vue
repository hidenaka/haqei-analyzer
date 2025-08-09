<template>
  <div class="h-spinner" :class="spinnerClasses">
    <div class="h-spinner__element"></div>
    <span v-if="text" class="h-spinner__text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'white'
  text?: string
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'primary',
  inline: false
})

const spinnerClasses = computed(() => [
  'h-spinner',
  `h-spinner--${props.size}`,
  `h-spinner--${props.variant}`,
  {
    'h-spinner--inline': props.inline,
    'h-spinner--with-text': props.text
  }
])
</script>

<style scoped>
.h-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.h-spinner--inline {
  display: inline-flex;
}

.h-spinner__element {
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
}

.h-spinner--small .h-spinner__element {
  width: 1rem;
  height: 1rem;
  border-width: 1.5px;
}

.h-spinner--medium .h-spinner__element {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.h-spinner--large .h-spinner__element {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.h-spinner--primary {
  color: var(--primary-color);
}

.h-spinner--secondary {
  color: var(--text-secondary);
}

.h-spinner--white {
  color: white;
}

.h-spinner__text {
  font-size: 0.875rem;
  color: currentColor;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Center spinner when used as a block element */
.h-spinner:not(.h-spinner--inline) {
  min-height: 3rem;
}
</style>