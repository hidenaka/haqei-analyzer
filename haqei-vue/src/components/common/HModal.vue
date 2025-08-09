<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="h-modal-overlay" @click="handleOverlayClick">
        <div class="h-modal" :class="modalClasses" @click.stop>
          <header v-if="title || $slots.header" class="h-modal__header">
            <slot name="header">
              <h2 class="h-modal__title">{{ title }}</h2>
            </slot>
            <button
              v-if="closable"
              class="h-modal__close"
              type="button"
              @click="close"
            >
              ×
            </button>
          </header>
          
          <main class="h-modal__body">
            <slot />
          </main>
          
          <footer v-if="$slots.footer" class="h-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closable?: boolean
  closeOnOverlay?: boolean
  persistent?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  closable: true,
  closeOnOverlay: true,
  persistent: false
})

const emit = defineEmits<Emits>()

const modalClasses = computed(() => [
  'h-modal',
  `h-modal--${props.size}`,
  {
    'h-modal--persistent': props.persistent
  }
])

function close() {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

function handleOverlayClick() {
  if (props.closeOnOverlay && !props.persistent) {
    close()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue && props.closable) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.h-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.h-modal {
  background: var(--bg-surface);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.h-modal--small {
  max-width: 400px;
}

.h-modal--medium {
  max-width: 600px;
}

.h-modal--large {
  max-width: 800px;
}

.h-modal--fullscreen {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  border-radius: 0;
}

.h-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.h-modal__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.h-modal__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.h-modal__close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.h-modal__body {
  padding: 1.5rem;
  flex: 1;
}

.h-modal__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .h-modal,
.modal-leave-active .h-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .h-modal,
.modal-leave-to .h-modal {
  transform: scale(0.95) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .h-modal-overlay {
    padding: 0.5rem;
  }
  
  .h-modal {
    max-height: 100vh;
    width: 100%;
  }
  
  .h-modal--small,
  .h-modal--medium,
  .h-modal--large {
    max-width: none;
  }
  
  .h-modal__header,
  .h-modal__body,
  .h-modal__footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>