<template>
  <div class="h-select-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="selectId" class="h-select-label">
      {{ label }}
      <span v-if="required" class="h-select-required">*</span>
    </label>
    
    <div class="h-select-container">
      <select
        :id="selectId"
        v-model="selectValue"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        class="h-select"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <option v-if="placeholder && !multiple" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <span class="h-select-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
    
    <div v-if="error || hint" class="h-select-message">
      <span v-if="error" class="h-select-error">{{ error }}</span>
      <span v-else-if="hint" class="h-select-hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | (string | number)[]
  options: (Option | string | number)[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'underlined'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  multiple: false,
  size: 'md',
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  'change': [value: string | number | (string | number)[]]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const selectId = computed(() => `h-select-${Math.random().toString(36).substr(2, 9)}`)
const selectValue = ref(props.modelValue ?? (props.multiple ? [] : ''))
const isFocused = ref(false)

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && 'label' in option && 'value' in option) {
      return option
    }
    return {
      label: String(option),
      value: option,
      disabled: false,
    }
  })
})

const wrapperClasses = computed(() => [
  'h-select-wrapper',
  `h-select-wrapper--${props.size}`,
  `h-select-wrapper--${props.variant}`,
  {
    'h-select-wrapper--disabled': props.disabled,
    'h-select-wrapper--error': props.error,
    'h-select-wrapper--focused': isFocused.value,
    'h-select-wrapper--multiple': props.multiple,
  },
])

watch(() => props.modelValue, (newValue) => {
  selectValue.value = newValue ?? (props.multiple ? [] : '')
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  let value: string | number | (string | number)[]
  
  if (props.multiple) {
    value = Array.from(target.selectedOptions).map(option => {
      const val = option.value
      return isNaN(Number(val)) ? val : Number(val)
    })
  } else {
    value = target.value
    if (!isNaN(Number(value)) && value !== '') {
      value = Number(value)
    }
  }
  
  selectValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}
</script>

<style scoped>
.h-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.h-select-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.h-select-required {
  color: var(--error);
}

.h-select-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.h-select {
  flex: 1;
  width: 100%;
  font-family: inherit;
  font-size: var(--text-base);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  outline: none;
  transition: all var(--transition-base);
  appearance: none;
  cursor: pointer;
  padding-right: calc(var(--space-4) * 2.5);
}

/* Default variant */
.h-select-wrapper--default .h-select {
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
}

.h-select-wrapper--default.h-select-wrapper--focused .h-select {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-alpha-20);
}

.h-select-wrapper--default .h-select:hover:not(:disabled):not(:focus) {
  border-color: var(--border-hover);
}

/* Filled variant */
.h-select-wrapper--filled .h-select {
  border: 2px solid transparent;
  background-color: var(--bg-secondary);
}

.h-select-wrapper--filled.h-select-wrapper--focused .h-select {
  background-color: var(--bg-primary);
  border-color: var(--primary-color);
}

/* Underlined variant */
.h-select-wrapper--underlined .h-select {
  border: none;
  border-bottom: 2px solid var(--border-color);
  border-radius: 0;
  padding-left: 0;
  padding-right: calc(var(--space-4) * 2);
}

.h-select-wrapper--underlined.h-select-wrapper--focused .h-select {
  border-bottom-color: var(--primary-color);
}

/* Sizes */
.h-select-wrapper--sm .h-select {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  min-height: 32px;
}

.h-select-wrapper--md .h-select {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  min-height: 40px;
}

.h-select-wrapper--lg .h-select {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-lg);
  min-height: 48px;
}

/* Icon */
.h-select-icon {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
  color: var(--text-secondary);
  transition: transform var(--transition-base);
}

.h-select-icon svg {
  width: 20px;
  height: 20px;
}

.h-select-wrapper--focused .h-select-icon {
  color: var(--primary-color);
}

/* States */
.h-select:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.h-select-wrapper--error .h-select {
  border-color: var(--error);
}

.h-select-wrapper--error.h-select-wrapper--focused .h-select {
  box-shadow: 0 0 0 3px var(--error-alpha-20);
}

/* Messages */
.h-select-message {
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}

.h-select-error {
  color: var(--error);
}

.h-select-hint {
  color: var(--text-secondary);
}

/* Multiple select */
.h-select-wrapper--multiple .h-select {
  min-height: 80px;
  padding-top: var(--space-2);
  padding-bottom: var(--space-2);
}

/* Option styles */
.h-select option {
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

.h-select option:disabled {
  color: var(--text-tertiary);
}
</style>