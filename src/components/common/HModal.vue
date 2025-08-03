<template>
  <Teleport to="body">
    <Transition name="modal" @after-leave="afterLeave">
      <div v-if="modelValue" class="h-modal-overlay" @click="handleOverlayClick">
        <div 
          class="h-modal"
          :class="modalClasses"
          :style="modalStyles"
          @click.stop
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="titleId"
        >
          <div v-if="title || closable" class="h-modal-header">
            <h2 v-if="title" :id="titleId" class="h-modal-title">{{ title }}</h2>
            <button
              v-if="closable"
              type="button"
              class="h-modal-close"
              @click="close"
              :aria-label="closeLabel"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          
          <div class="h-modal-body">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="h-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeLabel?: string
  closeOnOverlay?: boolean
  closeOnEsc?: boolean
  width?: string
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeLabel: 'Close modal',
  closeOnOverlay: true,
  closeOnEsc: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'after-leave': []
}>()

const titleId = computed(() => `h-modal-title-${Math.random().toString(36).substr(2, 9)}`)

const modalClasses = computed(() => [
  `h-modal--${props.size}`,
])

const modalStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width) styles.width = props.width
  if (props.maxWidth) styles.maxWidth = props.maxWidth
  return styles
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const afterLeave = () => {
  emit('after-leave')
}

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue && props.closeOnEsc) {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.h-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 1000;
  overflow-y: auto;
}

.h-modal {
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--space-8));
  position: relative;
  width: 100%;
}

/* Sizes */
.h-modal--sm {
  max-width: 480px;
}

.h-modal--md {
  max-width: 640px;
}

.h-modal--lg {
  max-width: 800px;
}

.h-modal--xl {
  max-width: 1024px;
}

.h-modal--full {
  max-width: calc(100vw - var(--space-8));
  max-height: calc(100vh - var(--space-8));
}

/* Header */
.h-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.h-modal-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.h-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  flex-shrink: 0;
  margin-left: var(--space-4);
}

.h-modal-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.h-modal-close:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: -2px;
}

.h-modal-close svg {
  width: 20px;
  height: 20px;
}

/* Body */
.h-modal-body {
  padding: var(--space-5);
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.h-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-5);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-active .h-modal,
.modal-leave-active .h-modal {
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .h-modal,
.modal-leave-to .h-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .h-modal-overlay {
    padding: 0;
  }
  
  .h-modal {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }
  
  .h-modal--full {
    width: 100vw;
    height: 100vh;
  }
}
</style>