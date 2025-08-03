/**
 * バリデーション用ユーティリティ関数
 * 
 * 目的：
 * 質問回答、分析データ、入力値の妥当性を検証する
 * 
 * 機能：
 * - 質問回答のバリデーション
 * - 回答セット全体のバリデーション
 * - 8次元ベクトルのバリデーション
 * - 64卦データのバリデーション
 * - シナリオ回答のバリデーション
 */

import type { Answer, DimensionKey, EIGHT_DIMENSIONS } from '@/data/types'
import { ALL_QUESTIONS } from '@/data/questions'

// バリデーション結果の型定義
export interface ValidationResult {
  isValid: boolean
  error: string | null
  warnings?: string[]
}

// 回答データの詳細型
export interface DetailedAnswer extends Answer {
  scoring_tags?: Array<{
    key: string
    value: number
    type?: string
  }>
}

/**
 * 質問回答の基本バリデーション
 * 
 * 目的：
 * 単一の回答データが正しい形式かを検証
 * 
 * 検証内容：
 * - 必須フィールドの存在
 * - データ型の正確性
 * - 値の妥当性
 */
export function validateQuestionAnswer(answer: any): ValidationResult {
  if (!answer || typeof answer !== 'object') {
    return {
      isValid: false,
      error: '回答データが正しくありません'
    }
  }
  
  // 必須フィールドのチェック
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
  
  // 質問IDが実在するかチェック
  const question = ALL_QUESTIONS.find(q => q.id === answer.questionId)
  if (!question) {
    return {
      isValid: false,
      error: `質問ID ${answer.questionId} が存在しません`
    }
  }
  
  // タイムスタンプのチェック（オプショナル）
  if ('timestamp' in answer && typeof answer.timestamp !== 'number') {
    return {
      isValid: false,
      error: 'タイムスタンプが正しくありません'
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * シナリオ回答のバリデーション
 * 
 * 目的：
 * シナリオ設問の回答形式（inner|outer）を検証
 */
export function validateScenarioAnswer(answer: Answer): ValidationResult {
  const baseValidation = validateQuestionAnswer(answer)
  if (!baseValidation.isValid) {
    return baseValidation
  }
  
  // シナリオ設問かどうかチェック
  const questionNum = parseInt(answer.questionId.replace('q', ''))
  const isScenario = questionNum >= 25 && questionNum <= 30
  
  if (isScenario) {
    // inner|outer形式かチェック
    const parts = answer.selectedValue.split('|')
    if (parts.length !== 2) {
      return {
        isValid: false,
        error: 'シナリオ回答は inner|outer 形式である必要があります'
      }
    }
    
    const [inner, outer] = parts
    if (!inner || !outer) {
      return {
        isValid: false,
        error: 'シナリオ回答の内面・外面の両方を選択してください'
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
 * 
 * 目的：
 * 複数の回答データ全体の整合性を検証
 * 
 * 検証内容：
 * - 各回答の妥当性
 * - 重複チェック
 * - 完全性チェック
 */
export function validateAnswerSet(answers: any[]): ValidationResult {
  const warnings: string[] = []
  
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
    
    // シナリオ回答の追加チェック
    const scenarioValidation = validateScenarioAnswer(answers[i])
    if (!scenarioValidation.isValid) {
      return {
        isValid: false,
        error: `回答 ${i + 1}: ${scenarioValidation.error}`
      }
    }
  }
  
  // 重複する質問IDがないかチェック
  const questionIds = answers.map(answer => answer.questionId)
  const uniqueIds = [...new Set(questionIds)]
  
  if (questionIds.length !== uniqueIds.length) {
    return {
      isValid: false,
      error: '重複する質問IDがあります'
    }
  }
  
  // 完全性チェック（警告のみ）
  if (answers.length < ALL_QUESTIONS.length) {
    warnings.push(`${ALL_QUESTIONS.length - answers.length}問が未回答です`)
  }
  
  return {
    isValid: true,
    error: null,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

/**
 * 8次元ベクトルのバリデーション
 * 
 * 目的：
 * 分析結果の8次元ベクトルデータを検証
 */
export function validateEightDimensionVector(vector: any): ValidationResult {
  if (!vector || typeof vector !== 'object') {
    return {
      isValid: false,
      error: 'ベクトルデータが正しくありません'
    }
  }
  
  const requiredDimensions: DimensionKey[] = [
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
    
    const value = vector[dimension]
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        isValid: false,
        error: `次元 ${dimension} の値が数値ではありません`
      }
    }
    
    // 値の範囲チェック（警告）
    if (value < -100 || value > 100) {
      return {
        isValid: true,
        error: null,
        warnings: [`次元 ${dimension} の値 ${value} が通常の範囲外です`]
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
 * 
 * 目的：
 * 易経の64卦データ形式を検証
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
      const id = hexagram[field]
      if (typeof id !== 'number' || id < 1 || id > 64) {
        return {
          isValid: false,
          error: '64卦IDは1から64の数値である必要があります'
        }
      }
    } else {
      const value = hexagram[field]
      if (typeof value !== 'string' || value.length === 0) {
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
 * 
 * 目的：
 * 分析によるマッチング結果の妥当性を検証
 */
export function validateMatchResult(match: any): ValidationResult {
  if (!match || typeof match !== 'object') {
    return {
      isValid: false,
      error: 'マッチング結果が正しくありません'
    }
  }
  
  // 必須フィールド
  if (!match.hexagramId || typeof match.hexagramId !== 'number') {
    return {
      isValid: false,
      error: '64卦IDが正しくありません'
    }
  }
  
  if (match.hexagramId < 1 || match.hexagramId > 64) {
    return {
      isValid: false,
      error: '64卦IDは1から64の範囲である必要があります'
    }
  }
  
  if (!match.similarity || typeof match.similarity !== 'number') {
    return {
      isValid: false,
      error: '類似度が正しくありません'
    }
  }
  
  if (match.similarity < 0 || match.similarity > 1) {
    return {
      isValid: false,
      error: '類似度は0から1の範囲である必要があります'
    }
  }
  
  // オプショナルフィールド
  if ('hexagramInfo' in match) {
    const hexagramValidation = validateHexagramData(match.hexagramInfo)
    if (!hexagramValidation.isValid) {
      return hexagramValidation
    }
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * 入力値の基本バリデーション
 * 
 * 目的：
 * ユーザー入力値の安全性を確保
 */
export function validateInput(value: any, type: 'string' | 'number' | 'email' = 'string'): ValidationResult {
  if (value === null || value === undefined) {
    return {
      isValid: false,
      error: '値が入力されていません'
    }
  }
  
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return {
          isValid: false,
          error: '文字列として入力してください'
        }
      }
      if (value.trim().length === 0) {
        return {
          isValid: false,
          error: '空白のみの入力は無効です'
        }
      }
      break
      
    case 'number':
      const num = Number(value)
      if (isNaN(num)) {
        return {
          isValid: false,
          error: '数値として入力してください'
        }
      }
      break
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          error: '正しいメールアドレス形式で入力してください'
        }
      }
      break
  }
  
  return {
    isValid: true,
    error: null
  }
}

/**
 * セキュリティバリデーション
 * 
 * 目的：
 * XSS等のセキュリティリスクを防ぐ
 */
export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}