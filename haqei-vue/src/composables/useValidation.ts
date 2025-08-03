/**
 * バリデーション用コンポーザブル
 * 
 * 目的：
 * Vue コンポーネントでバリデーション機能を簡単に使用できるようにする
 * 
 * 機能：
 * - フォーム入力のリアルタイムバリデーション
 * - エラーメッセージの管理
 * - バリデーション状態の追跡
 */

import { ref, computed, watch, Ref } from 'vue'
import type { ValidationResult } from '@/utils/answerValidators'
import { 
  validateInput, 
  validateQuestionAnswer,
  validateAnswerSet,
  sanitizeInput 
} from '@/utils/answerValidators'

// バリデーションルールの型定義
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => ValidationResult
  message?: string
}

// フィールドの型定義
export interface FieldValidation {
  value: Ref<any>
  error: Ref<string | null>
  touched: Ref<boolean>
  dirty: Ref<boolean>
  isValid: Ref<boolean>
  validate: () => boolean
  reset: () => void
}

/**
 * 単一フィールドのバリデーション
 */
export function useFieldValidation(
  initialValue: any = '',
  rules: ValidationRule = {}
): FieldValidation {
  const value = ref(initialValue)
  const error = ref<string | null>(null)
  const touched = ref(false)
  const dirty = ref(false)
  
  const isValid = computed(() => error.value === null)
  
  // バリデーション実行
  function validate(): boolean {
    error.value = null
    
    // 必須チェック
    if (rules.required && !value.value) {
      error.value = rules.message || '必須項目です'
      return false
    }
    
    // 値がない場合は他のルールをスキップ
    if (!value.value) {
      return true
    }
    
    // 文字列の場合のチェック
    if (typeof value.value === 'string') {
      // 最小長チェック
      if (rules.minLength && value.value.length < rules.minLength) {
        error.value = rules.message || `${rules.minLength}文字以上入力してください`
        return false
      }
      
      // 最大長チェック
      if (rules.maxLength && value.value.length > rules.maxLength) {
        error.value = rules.message || `${rules.maxLength}文字以内で入力してください`
        return false
      }
      
      // パターンチェック
      if (rules.pattern && !rules.pattern.test(value.value)) {
        error.value = rules.message || '正しい形式で入力してください'
        return false
      }
    }
    
    // カスタムバリデーター
    if (rules.validator) {
      const result = rules.validator(value.value)
      if (!result.isValid) {
        error.value = result.error || '入力値が正しくありません'
        return false
      }
    }
    
    return true
  }
  
  // リセット
  function reset() {
    value.value = initialValue
    error.value = null
    touched.value = false
    dirty.value = false
  }
  
  // 値の変更を監視
  watch(value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      dirty.value = true
      if (touched.value) {
        validate()
      }
    }
  })
  
  return {
    value,
    error,
    touched,
    dirty,
    isValid,
    validate,
    reset
  }
}

/**
 * フォーム全体のバリデーション
 */
export function useFormValidation(fields: Record<string, FieldValidation>) {
  const isValid = computed(() => {
    return Object.values(fields).every(field => field.isValid.value)
  })
  
  const isDirty = computed(() => {
    return Object.values(fields).some(field => field.dirty.value)
  })
  
  const errors = computed(() => {
    const errs: Record<string, string | null> = {}
    Object.entries(fields).forEach(([key, field]) => {
      errs[key] = field.error.value
    })
    return errs
  })
  
  // 全フィールドをバリデート
  function validateAll(): boolean {
    let allValid = true
    Object.values(fields).forEach(field => {
      field.touched.value = true
      if (!field.validate()) {
        allValid = false
      }
    })
    return allValid
  }
  
  // 全フィールドをリセット
  function resetAll() {
    Object.values(fields).forEach(field => {
      field.reset()
    })
  }
  
  // エラーをクリア
  function clearErrors() {
    Object.values(fields).forEach(field => {
      field.error.value = null
    })
  }
  
  return {
    isValid,
    isDirty,
    errors,
    validateAll,
    resetAll,
    clearErrors
  }
}

/**
 * 回答バリデーション用コンポーザブル
 */
export function useAnswerValidation() {
  const validationErrors = ref<string[]>([])
  const validationWarnings = ref<string[]>([])
  
  // 単一回答のバリデーション
  function validateAnswer(answer: any): boolean {
    const result = validateQuestionAnswer(answer)
    if (!result.isValid) {
      validationErrors.value = [result.error || '回答が無効です']
      return false
    }
    
    validationErrors.value = []
    validationWarnings.value = result.warnings || []
    return true
  }
  
  // 回答セットのバリデーション
  function validateAnswers(answers: any[]): boolean {
    const result = validateAnswerSet(answers)
    if (!result.isValid) {
      validationErrors.value = [result.error || '回答セットが無効です']
      return false
    }
    
    validationErrors.value = []
    validationWarnings.value = result.warnings || []
    return true
  }
  
  // エラー・警告のクリア
  function clearValidation() {
    validationErrors.value = []
    validationWarnings.value = []
  }
  
  return {
    validationErrors,
    validationWarnings,
    validateAnswer,
    validateAnswers,
    clearValidation
  }
}

/**
 * 入力サニタイズ用コンポーザブル
 */
export function useSanitization() {
  // HTML特殊文字のエスケープ
  function sanitize(value: string): string {
    return sanitizeInput(value)
  }
  
  // 安全なHTMLとして表示
  function safeHtml(value: string): string {
    return sanitize(value)
      .replace(/\n/g, '<br>')
      .replace(/\s{2,}/g, match => '&nbsp;'.repeat(match.length))
  }
  
  return {
    sanitize,
    safeHtml
  }
}