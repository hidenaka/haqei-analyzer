<template>
  <div class="h-input">
    <label v-if="label" :for="inputId" class="h-input__label">
      {{ label }}
      <span v-if="required" class="h-input__required">*</span>
    </label>
    <input
      :id="inputId"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClasses"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
    <div v-if="error" class="h-input__error">
      {{ error }}
    </div>
    <div v-if="hint && !error" class="h-input__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'medium',
  required: false,
  disabled: false,
  readonly: false
})

const emit = defineEmits<Emits>()

const isFocused = ref(false)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string | number) => emit('update:modelValue', value)
})

const inputClasses = computed(() => [
  'h-input__field',
  `h-input__field--${props.size}`,
  {
    'h-input__field--error': props.error,
    'h-input__field--disabled': props.disabled,
    'h-input__field--focused': isFocused.value
  }
])

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<style scoped>
.h-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.h-input__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.h-input__required {
  color: var(--error-color);
}

.h-input__field {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--bg-surface);
  color: var(--text-primary);
}

.h-input__field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.h-input__field--small {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.h-input__field--large {
  padding: 1rem;
  font-size: 1.125rem;
}

.h-input__field--error {
  border-color: var(--error-color);
}

.h-input__field--disabled {
  background: var(--bg-disabled);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.h-input__error {
  font-size: 0.75rem;
  color: var(--error-color);
}

.h-input__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>