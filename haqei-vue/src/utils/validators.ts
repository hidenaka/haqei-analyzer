/**
 * validators.ts - バリデーション用ユーティリティ関数
 * HaQei Analyzer - Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean
  error: string | null
}

export interface ScoringTag {
  key: string
  value: number
}

export interface QuestionAnswer {
  questionId: string
  selectedValue: string
  scoring_tags: ScoringTag[]
}

export interface EightDimensionVector {
  乾_創造性: number
  震_行動性: number
  坎_探求性: number
  艮_安定性: number
  坤_受容性: number
  巽_適応性: number
  離_表現性: number
  兌_調和性: number
}

export interface HexagramData {
  hexagram_id: number
  name_jp: string
  reading: string
  catchphrase: string
  [key: string]: any
}

export interface MatchResult {
  hexagramId: number
  hexagramInfo: HexagramData
  similarity: number
  matchPercentage: number
}

export interface AnalysisResult {
  primaryOS: MatchResult
  eightDimensionVector: EightDimensionVector
  alternativeMatches?: MatchResult[]
}

/**
 * 質問回答のバリデーション
 */
export function validateQuestionAnswer(answer: any): ValidationResult {
  if (!answer || typeof answer !== 'object') {
    return {
      isValid: false,
      error: '回答データが正しくありません'
    }
  }
  
  if (!answer.questionId || typeof answer.questionId !== 'string') {
    return {
      isValid: false,
      error: '質問IDが正しくありません'
    }
  }
  
  if (!answer.selectedValue || typeof answer.selectedValue !== 'string') {
    return {
      isValid: false,
      error: '選択された値が正しくありません'
    }
  }
  
  if (!answer.scoring_tags || !Array.isArray(answer.scoring_tags)) {
    return {
      isValid: false,
      error: 'スコアリングタグが正しくありません'
    }
  }
  
  // スコアリングタグの各項目をチェック
  for (const tag of answer.scoring_tags) {
    if (!tag.key || typeof tag.key !== 'string') {
      return {
        isValid: false,
        error: 'スコアリングタグのキーが正しくありません'
      }
    }
    
    if (typeof tag.value !== 'number' || isNaN(tag.value)) {
      return {
        isValid: false,
        error: 'スコアリングタグの値が正しくありません'
      }
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 回答セット全体のバリデーション
 */
export function validateAnswerSet(answers: any): ValidationResult {
  if (!answers || !Array.isArray(answers)) {
    return {
      isValid: false,
      error: '回答セットが配列ではありません'
    }
  }
  
  if (answers.length === 0) {
    return {
      isValid: false,
      error: '回答が1つもありません'
    }
  }
  
  // 各回答をバリデーション
  for (let i = 0; i < answers.length; i++) {
    const validation = validateQuestionAnswer(answers[i])
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `回答 ${i + 1}: ${validation.error}`
      }
    }
  }
  
  // 重複する質問IDがないかチェック
  const questionIds = answers.map((answer: QuestionAnswer) => answer.questionId)
  const uniqueIds = Array.from(new Set(questionIds))
  
  if (questionIds.length !== uniqueIds.length) {
    return {
      isValid: false,
      error: '重複する質問IDがあります'
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 8次元ベクトルのバリデーション
 */
export function validateEightDimensionVector(vector: any): ValidationResult {
  if (!vector || typeof vector !== 'object') {
    return {
      isValid: false,
      error: 'ベクトルデータが正しくありません'
    }
  }
  
  const requiredDimensions = [
    '乾_創造性',
    '震_行動性',
    '坎_探求性',
    '艮_安定性',
    '坤_受容性',
    '巽_適応性',
    '離_表現性',
    '兌_調和性'
  ]
  
  for (const dimension of requiredDimensions) {
    if (!(dimension in vector)) {
      return {
        isValid: false,
        error: `必要な次元 ${dimension} が見つかりません`
      }
    }
    
    if (typeof vector[dimension] !== 'number' || isNaN(vector[dimension])) {
      return {
        isValid: false,
        error: `次元 ${dimension} の値が数値ではありません`
      }
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 64卦データのバリデーション
 */
export function validateHexagramData(hexagram: any): ValidationResult {
  if (!hexagram || typeof hexagram !== 'object') {
    return {
      isValid: false,
      error: '64卦データが正しくありません'
    }
  }
  
  const requiredFields = ['hexagram_id', 'name_jp', 'reading', 'catchphrase']
  
  for (const field of requiredFields) {
    if (!(field in hexagram)) {
      return {
        isValid: false,
        error: `必要なフィールド ${field} が見つかりません`
      }
    }
    
    if (field === 'hexagram_id') {
      if (typeof hexagram[field] !== 'number' || hexagram[field] < 1 || hexagram[field] > 64) {
        return {
          isValid: false,
          error: '64卦IDは1から64の数値である必要があります'
        }
      }
    } else {
      if (typeof hexagram[field] !== 'string' || hexagram[field].length === 0) {
        return {
          isValid: false,
          error: `フィールド ${field} は空でない文字列である必要があります`
        }
      }
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * マッチング結果のバリデーション
 */
export function validateMatchResult(match: any): ValidationResult {
  if (!match || typeof match !== 'object') {
    return {
      isValid: false,
      error: 'マッチング結果が正しくありません'
    }
  }
  
  if (!match.hexagramId || typeof match.hexagramId !== 'number') {
    return {
      isValid: false,
      error: '64卦IDが正しくありません'
    }
  }
  
  if (!match.hexagramInfo || typeof match.hexagramInfo !== 'object') {
    return {
      isValid: false,
      error: '64卦情報が正しくありません'
    }
  }
  
  if (typeof match.similarity !== 'number' || isNaN(match.similarity)) {
    return {
      isValid: false,
      error: '類似度が正しくありません'
    }
  }
  
  if (typeof match.matchPercentage !== 'number' || isNaN(match.matchPercentage)) {
    return {
      isValid: false,
      error: 'マッチング率が正しくありません'
    }
  }
  
  if (match.matchPercentage < 0 || match.matchPercentage > 100) {
    return {
      isValid: false,
      error: 'マッチング率は0から100の間である必要があります'
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 分析結果のバリデーション
 */
export function validateAnalysisResult(result: any): ValidationResult {
  if (!result || typeof result !== 'object') {
    return {
      isValid: false,
      error: '分析結果が正しくありません'
    }
  }
  
  if (!result.primaryOS) {
    return {
      isValid: false,
      error: '主要OSが見つかりません'
    }
  }
  
  const primaryOSValidation = validateMatchResult(result.primaryOS)
  if (!primaryOSValidation.isValid) {
    return {
      isValid: false,
      error: `主要OS: ${primaryOSValidation.error}`
    }
  }
  
  if (!result.eightDimensionVector) {
    return {
      isValid: false,
      error: '8次元ベクトルが見つかりません'
    }
  }
  
  const vectorValidation = validateEightDimensionVector(result.eightDimensionVector)
  if (!vectorValidation.isValid) {
    return {
      isValid: false,
      error: `8次元ベクトル: ${vectorValidation.error}`
    }
  }
  
  if (result.alternativeMatches && Array.isArray(result.alternativeMatches)) {
    for (let i = 0; i < result.alternativeMatches.length; i++) {
      const matchValidation = validateMatchResult(result.alternativeMatches[i])
      if (!matchValidation.isValid) {
        return {
          isValid: false,
          error: `代替マッチ ${i + 1}: ${matchValidation.error}`
        }
      }
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 入力値のサニタイズ
 */
export function sanitizeString(input: any): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/[<>]/g, '') // HTMLタグを除去
    .replace(/javascript:/gi, '') // JavaScriptスキームを除去
    .trim()
}

/**
 * 数値の範囲チェック
 */
export function validateNumberRange(value: any, min: number, max: number): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      isValid: false,
      error: '数値ではありません'
    }
  }
  
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `値は${min}から${max}の間である必要があります`
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * メールアドレスのバリデーション（簡易版）
 */
export function validateEmail(email: any): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'メールアドレスが正しくありません'
    }
  }
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'メールアドレスの形式が正しくありません'
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * URLのバリデーション
 */
export function validateURL(url: any): ValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URLが正しくありません'
    }
  }
  
  try {
    new URL(url)
    return {
      isValid: true,
      error: null
    }
  } catch {
    return {
      isValid: false,
      error: 'URLの形式が正しくありません'
    }
  }
}

/**
 * 日付のバリデーション
 */
export function validateDate(date: any): ValidationResult {
  if (!date) {
    return {
      isValid: false,
      error: '日付が指定されていません'
    }
  }
  
  const parsedDate = new Date(date)
  
  if (isNaN(parsedDate.getTime())) {
    return {
      isValid: false,
      error: '日付の形式が正しくありません'
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 配列のバリデーション
 */
export function validateArray<_T>(
  array: any,
  options?: {
    minLength?: number
    maxLength?: number
    itemValidator?: (item: any) => ValidationResult
  }
): ValidationResult {
  if (!Array.isArray(array)) {
    return {
      isValid: false,
      error: '配列ではありません'
    }
  }
  
  if (options?.minLength !== undefined && array.length < options.minLength) {
    return {
      isValid: false,
      error: `配列の長さは${options.minLength}以上である必要があります`
    }
  }
  
  if (options?.maxLength !== undefined && array.length > options.maxLength) {
    return {
      isValid: false,
      error: `配列の長さは${options.maxLength}以下である必要があります`
    }
  }
  
  if (options?.itemValidator) {
    for (let i = 0; i < array.length; i++) {
      const validation = options.itemValidator(array[i])
      if (!validation.isValid) {
        return {
          isValid: false,
          error: `項目 ${i + 1}: ${validation.error}`
        }
      }
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 必須フィールドのバリデーション
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName}は必須項目です`
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 文字列長のバリデーション
 */
export function validateStringLength(
  value: any,
  options: {
    minLength?: number
    maxLength?: number
    fieldName?: string
  }
): ValidationResult {
  if (typeof value !== 'string') {
    return {
      isValid: false,
      error: `${options.fieldName || '値'}は文字列である必要があります`
    }
  }
  
  if (options.minLength !== undefined && value.length < options.minLength) {
    return {
      isValid: false,
      error: `${options.fieldName || '値'}は${options.minLength}文字以上である必要があります`
    }
  }
  
  if (options.maxLength !== undefined && value.length > options.maxLength) {
    return {
      isValid: false,
      error: `${options.fieldName || '値'}は${options.maxLength}文字以下である必要があります`
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}