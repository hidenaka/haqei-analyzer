<template>
  <component
    :is="clickable ? 'button' : 'div'"
    class="h-card"
    :class="cardClasses"
    :type="clickable ? 'button' : undefined"
    @click="handleClick"
  >
    <div v-if="$slots.header || title" class="h-card-header">
      <slot name="header">
        <h3 class="h-card-title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="h-card-body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="h-card-footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost'
  clickable?: boolean
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  clickable: false,
  hoverable: false,
  padding: 'md',
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => [
  `h-card--${props.variant}`,
  `h-card--padding-${props.padding}`,
  {
    'h-card--clickable': props.clickable,
    'h-card--hoverable': props.hoverable || props.clickable,
    'h-card--full-width': props.fullWidth,
  },
])

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.h-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  width: 100%;
  text-align: left;
  position: relative;
}

/* Variants */
.h-card--default {
  background-color: var(--bg-primary);
}

.h-card--elevated {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.h-card--elevated:hover {
  box-shadow: var(--shadow-lg);
}

.h-card--bordered {
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
}

.h-card--ghost {
  background-color: transparent;
  border: 2px solid transparent;
}

/* States */
.h-card--hoverable:hover {
  transform: translateY(-2px);
}

.h-card--clickable {
  cursor: pointer;
  user-select: none;
}

.h-card--clickable:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.h-card--clickable:active {
  transform: translateY(0);
}

/* Padding */
.h-card--padding-none .h-card-header,
.h-card--padding-none .h-card-body,
.h-card--padding-none .h-card-footer {
  padding: 0;
}

.h-card--padding-sm .h-card-header,
.h-card--padding-sm .h-card-body,
.h-card--padding-sm .h-card-footer {
  padding: var(--space-3);
}

.h-card--padding-md .h-card-header,
.h-card--padding-md .h-card-body,
.h-card--padding-md .h-card-footer {
  padding: var(--space-5);
}

.h-card--padding-lg .h-card-header,
.h-card--padding-lg .h-card-body,
.h-card--padding-lg .h-card-footer {
  padding: var(--space-6);
}

/* Header */
.h-card-header {
  border-bottom: 1px solid var(--border-color);
}

.h-card-header + .h-card-body {
  padding-top: var(--space-4);
}

.h-card-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Body */
.h-card-body {
  flex: 1;
  color: var(--text-secondary);
}

/* Footer */
.h-card-footer {
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
}

.h-card-body + .h-card-footer {
  padding-top: var(--space-4);
}

/* Full width */
.h-card--full-width {
  width: 100%;
}
</style>