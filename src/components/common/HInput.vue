<template>
  <div class="h-input-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="h-input-label">
      {{ label }}
      <span v-if="required" class="h-input-required">*</span>
    </label>
    
    <div class="h-input-container">
      <span v-if="prefix" class="h-input-prefix">
        <slot name="prefix">{{ prefix }}</slot>
      </span>
      
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="step"
        class="h-input"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
      />
      
      <span v-if="suffix || clearable" class="h-input-suffix">
        <button
          v-if="clearable && inputValue"
          type="button"
          class="h-input-clear"
          @click="clearInput"
          :aria-label="clearLabel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </button>
        <slot v-else name="suffix">{{ suffix }}</slot>
      </span>
    </div>
    
    <div v-if="error || hint" class="h-input-message">
      <span v-if="error" class="h-input-error">{{ error }}</span>
      <span v-else-if="hint" class="h-input-hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  prefix?: string
  suffix?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  clearLabel?: string
  autocomplete?: string
  maxlength?: number
  min?: number | string
  max?: number | string
  step?: number | string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'underlined'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  clearLabel: 'Clear input',
  size: 'md',
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'input': [value: string | number]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'enter': [event: KeyboardEvent]
  'clear': []
}>()

const inputId = computed(() => `h-input-${Math.random().toString(36).substr(2, 9)}`)
const inputValue = ref(props.modelValue ?? '')
const isFocused = ref(false)

const wrapperClasses = computed(() => [
  'h-input-wrapper',
  `h-input-wrapper--${props.size}`,
  `h-input-wrapper--${props.variant}`,
  {
    'h-input-wrapper--disabled': props.disabled,
    'h-input-wrapper--readonly': props.readonly,
    'h-input-wrapper--error': props.error,
    'h-input-wrapper--focused': isFocused.value,
  },
])

const inputClasses = computed(() => [
  'h-input',
  {
    'h-input--with-prefix': props.prefix,
    'h-input--with-suffix': props.suffix || props.clearable,
  },
])

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue ?? ''
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  inputValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleEnter = (event: KeyboardEvent) => {
  emit('enter', event)
}

const clearInput = () => {
  inputValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
.h-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.h-input-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.h-input-required {
  color: var(--error);
}

.h-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.h-input {
  flex: 1;
  width: 100%;
  font-family: inherit;
  font-size: var(--text-base);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  outline: none;
  transition: all var(--transition-base);
}

/* Default variant */
.h-input-wrapper--default .h-input {
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
}

.h-input-wrapper--default.h-input-wrapper--focused .h-input {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-alpha-20);
}

.h-input-wrapper--default .h-input:hover:not(:disabled):not(:focus) {
  border-color: var(--border-hover);
}

/* Filled variant */
.h-input-wrapper--filled .h-input {
  border: 2px solid transparent;
  background-color: var(--bg-secondary);
}

.h-input-wrapper--filled.h-input-wrapper--focused .h-input {
  background-color: var(--bg-primary);
  border-color: var(--primary-color);
}

/* Underlined variant */
.h-input-wrapper--underlined .h-input {
  border: none;
  border-bottom: 2px solid var(--border-color);
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.h-input-wrapper--underlined.h-input-wrapper--focused .h-input {
  border-bottom-color: var(--primary-color);
}

/* Sizes */
.h-input-wrapper--sm .h-input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  min-height: 32px;
}

.h-input-wrapper--md .h-input {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  min-height: 40px;
}

.h-input-wrapper--lg .h-input {
  padding: var(--space-4) var(--space-5);
  font-size: var(--text-lg);
  min-height: 48px;
}

/* Prefix & Suffix */
.h-input-prefix,
.h-input-suffix {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  pointer-events: none;
}

.h-input-prefix {
  left: var(--space-4);
}

.h-input-suffix {
  right: var(--space-4);
}

.h-input--with-prefix {
  padding-left: calc(var(--space-4) * 2.5);
}

.h-input--with-suffix {
  padding-right: calc(var(--space-4) * 2.5);
}

/* Clear button */
.h-input-clear {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.h-input-clear:hover {
  color: var(--text-primary);
}

.h-input-clear svg {
  width: 16px;
  height: 16px;
}

/* States */
.h-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.h-input-wrapper--error .h-input {
  border-color: var(--error);
}

.h-input-wrapper--error.h-input-wrapper--focused .h-input {
  box-shadow: 0 0 0 3px var(--error-alpha-20);
}

/* Messages */
.h-input-message {
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}

.h-input-error {
  color: var(--error);
}

.h-input-hint {
  color: var(--text-secondary);
}

/* Placeholder */
.h-input::placeholder {
  color: var(--text-tertiary);
}
</style>