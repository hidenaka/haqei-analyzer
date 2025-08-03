<template>
  <div class="h-skeleton" :class="skeletonClasses" :style="skeletonStyles">
    <div v-if="type === 'text'" class="h-skeleton-text">
      <div 
        v-for="i in rows" 
        :key="i" 
        class="h-skeleton-line"
        :style="{ width: getLineWidth(i) }"
      />
    </div>
    
    <div v-else-if="type === 'avatar'" class="h-skeleton-avatar" />
    
    <div v-else-if="type === 'image'" class="h-skeleton-image">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    </div>
    
    <div v-else-if="type === 'card'" class="h-skeleton-card">
      <div class="h-skeleton-card-header">
        <div class="h-skeleton-avatar h-skeleton-avatar--sm" />
        <div class="h-skeleton-card-title">
          <div class="h-skeleton-line" style="width: 60%" />
          <div class="h-skeleton-line" style="width: 40%" />
        </div>
      </div>
      <div class="h-skeleton-card-body">
        <div 
          v-for="i in 3" 
          :key="i" 
          class="h-skeleton-line"
          :style="{ width: i === 3 ? '80%' : '100%' }"
        />
      </div>
    </div>
    
    <div v-else-if="type === 'button'" class="h-skeleton-button" />
    
    <div v-else class="h-skeleton-custom">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'text' | 'avatar' | 'image' | 'card' | 'button' | 'custom'
  rows?: number
  width?: string | number
  height?: string | number
  animated?: boolean
  rounded?: boolean
  variant?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  rows: 1,
  animated: true,
  rounded: false,
  variant: 'light',
})

const skeletonClasses = computed(() => ({
  [`h-skeleton--${props.type}`]: true,
  'h-skeleton--animated': props.animated,
  'h-skeleton--rounded': props.rounded,
  [`h-skeleton--${props.variant}`]: true,
}))

const skeletonStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return styles
})

const getLineWidth = (index: number) => {
  if (props.rows === 1) return '100%'
  if (index === props.rows) return '80%'
  return '100%'
}
</script>

<style scoped>
.h-skeleton {
  display: block;
}

/* Base skeleton styles */
.h-skeleton-line,
.h-skeleton-avatar,
.h-skeleton-image,
.h-skeleton-button {
  background-color: var(--bg-tertiary);
  position: relative;
  overflow: hidden;
}

.h-skeleton--dark .h-skeleton-line,
.h-skeleton--dark .h-skeleton-avatar,
.h-skeleton--dark .h-skeleton-image,
.h-skeleton--dark .h-skeleton-button {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Animated shimmer effect */
.h-skeleton--animated .h-skeleton-line::after,
.h-skeleton--animated .h-skeleton-avatar::after,
.h-skeleton--animated .h-skeleton-image::after,
.h-skeleton--animated .h-skeleton-button::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}

.h-skeleton--dark.h-skeleton--animated .h-skeleton-line::after,
.h-skeleton--dark.h-skeleton--animated .h-skeleton-avatar::after,
.h-skeleton--dark.h-skeleton--animated .h-skeleton-image::after,
.h-skeleton--dark.h-skeleton--animated .h-skeleton-button::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

/* Text skeleton */
.h-skeleton-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.h-skeleton-line {
  height: 1em;
  border-radius: var(--radius-sm);
}

/* Avatar skeleton */
.h-skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.h-skeleton-avatar--sm {
  width: 32px;
  height: 32px;
}

.h-skeleton--rounded .h-skeleton-avatar {
  border-radius: var(--radius-md);
}

/* Image skeleton */
.h-skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.h-skeleton-image svg {
  width: 48px;
  height: 48px;
  opacity: 0.3;
}

/* Card skeleton */
.h-skeleton-card {
  padding: var(--space-4);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.h-skeleton-card-header {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.h-skeleton-card-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  justify-content: center;
}

.h-skeleton-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Button skeleton */
.h-skeleton-button {
  width: 120px;
  height: 40px;
  border-radius: var(--radius-md);
}

/* Custom skeleton */
.h-skeleton-custom {
  /* Custom content provided via slot */
}

/* Animation */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .h-skeleton-image {
    height: 150px;
  }
}
</style>