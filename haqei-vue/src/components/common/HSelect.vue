<template>
  <div class="h-select">
    <label v-if="label" :for="selectId" class="h-select__label">
      {{ label }}
      <span v-if="required" class="h-select__required">*</span>
    </label>
    <div class="h-select__wrapper">
      <select
        :id="selectId"
        v-model="selectedValue"
        :disabled="disabled"
        :class="selectClasses"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      <div class="h-select__icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
    <div v-if="error" class="h-select__error">
      {{ error }}
    </div>
    <div v-if="hint && !error" class="h-select__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: Option[] | string[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

const isFocused = ref(false)
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectedValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string | number) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const selectClasses = computed(() => [
  'h-select__field',
  `h-select__field--${props.size}`,
  {
    'h-select__field--error': props.error,
    'h-select__field--disabled': props.disabled,
    'h-select__field--focused': isFocused.value
  }
])

function getOptionValue(option: Option | string): string | number {
  return typeof option === 'string' ? option : option.value
}

function getOptionLabel(option: Option | string): string {
  return typeof option === 'string' ? option : option.label
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  selectedValue.value = target.value
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  emit('focus', event)
}
</script>

<style scoped>
.h-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.h-select__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.h-select__required {
  color: var(--error-color);
}

.h-select__wrapper {
  position: relative;
}

.h-select__field {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--bg-surface);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
}

.h-select__field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.h-select__field--small {
  padding: 0.5rem;
  padding-right: 2rem;
  font-size: 0.875rem;
}

.h-select__field--large {
  padding: 1rem;
  padding-right: 3rem;
  font-size: 1.125rem;
}

.h-select__field--error {
  border-color: var(--error-color);
}

.h-select__field--disabled {
  background: var(--bg-disabled);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.h-select__icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.h-select__field:focus + .h-select__icon {
  transform: translateY(-50%) rotate(180deg);
}

.h-select__error {
  font-size: 0.75rem;
  color: var(--error-color);
}

.h-select__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>