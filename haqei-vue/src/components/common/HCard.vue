<template>
  <div :class="cardClasses">
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String as () => 'default' | 'elevated' | 'outlined',
    default: 'default'
  },
  padding: {
    type: String as () => 'none' | 'small' | 'medium' | 'large',
    default: 'medium'
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})

// Computed
const cardClasses = computed(() => {
  return [
    'h-card',
    `h-card--${props.variant}`,
    `h-card--padding-${props.padding}`,
    {
      'h-card--hoverable': props.hoverable
    }
  ]
})
</script>

<style scoped>
.h-card {
  background: var(--bg-surface);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

/* Variants */
.h-card--default {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.h-card--elevated {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.h-card--outlined {
  border: 1px solid var(--border-color);
  box-shadow: none;
}

/* Hoverable */
.h-card--hoverable {
  cursor: pointer;
}

.h-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Header */
.card-header {
  padding: 1.5rem 1.5rem 0;
}

.card-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Body */
.card-body {
  padding: 1.5rem;
}

/* Padding variations */
.h-card--padding-none .card-body {
  padding: 0;
}

.h-card--padding-none .card-header {
  padding: 0;
}

.h-card--padding-small .card-body {
  padding: 1rem;
}

.h-card--padding-small .card-header {
  padding: 1rem 1rem 0;
}

.h-card--padding-large .card-body {
  padding: 2rem;
}

.h-card--padding-large .card-header {
  padding: 2rem 2rem 0;
}

/* Footer */
.card-footer {
  padding: 0 1.5rem 1.5rem;
  margin-top: -0.5rem;
}

.h-card--padding-small .card-footer {
  padding: 0 1rem 1rem;
}

.h-card--padding-large .card-footer {
  padding: 0 2rem 2rem;
}

/* When header exists without body padding */
.card-header + .card-body {
  padding-top: 0;
}
</style>