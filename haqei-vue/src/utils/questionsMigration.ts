/**
 * 質問データ移行ユーティリティ
 * 
 * 目的：
 * 既存のquestions.jsからTypeScript版への移行を支援する
 * 
 * 機能：
 * - レガシーフォーマットの読み込み
 * - TypeScript型への変換
 * - データ検証
 */

import { Question, QuestionOption, ScoringTag } from '@/data/questions'

// レガシー質問データの型定義
interface LegacyQuestion {
  id: string
  text: string
  options: LegacyOption[]
}

interface LegacyOption {
  value: string
  text: string
  koui_level?: number
  scoring_tags: LegacyScoringTag[]
}

interface LegacyScoringTag {
  key: string
  value: number
  type?: string
}

/**
 * レガシー質問データをTypeScript形式に変換
 */
export function migrateLegacyQuestions(legacyQuestions: LegacyQuestion[]): Question[] {
  return legacyQuestions.map(question => ({
    id: question.id,
    text: question.text,
    options: question.options.map(option => migrateOption(option))
  }))
}

/**
 * レガシー選択肢をTypeScript形式に変換
 */
function migrateOption(legacyOption: LegacyOption): QuestionOption {
  return {
    value: legacyOption.value,
    text: legacyOption.text,
    koui_level: legacyOption.koui_level,
    scoring_tags: legacyOption.scoring_tags.map(tag => migrateScoringTag(tag))
  }
}

/**
 * レガシースコアリングタグをTypeScript形式に変換
 */
function migrateScoringTag(legacyTag: LegacyScoringTag): ScoringTag {
  const tag: ScoringTag = {
    key: legacyTag.key,
    value: legacyTag.value
  }
  
  if (legacyTag.type === 'conflicting' || legacyTag.type === 'complementary') {
    tag.type = legacyTag.type
  }
  
  return tag
}

/**
 * 質問データの検証
 */
export function validateQuestions(questions: Question[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // 質問IDの重複チェック
  const idSet = new Set<string>()
  questions.forEach(q => {
    if (idSet.has(q.id)) {
      errors.push(`重複した質問ID: ${q.id}`)
    }
    idSet.add(q.id)
  })
  
  // 各質問の検証
  questions.forEach(question => {
    // 必須フィールドのチェック
    if (!question.id) errors.push('質問IDが未設定')
    if (!question.text) errors.push(`質問${question.id}: テキストが未設定`)
    if (!question.options || question.options.length === 0) {
      errors.push(`質問${question.id}: 選択肢が未設定`)
    }
    
    // 選択肢の検証
    question.options.forEach((option, index) => {
      if (!option.value) errors.push(`質問${question.id}の選択肢${index + 1}: valueが未設定`)
      if (!option.text) errors.push(`質問${question.id}の選択肢${index + 1}: textが未設定`)
      
      // スコアリングタグの検証
      if (!option.scoring_tags || option.scoring_tags.length === 0) {
        warnings.push(`質問${question.id}の選択肢${option.value}: スコアリングタグが未設定`)
      }
      
      option.scoring_tags.forEach(tag => {
        if (!tag.key) errors.push(`質問${question.id}の選択肢${option.value}: タグのkeyが未設定`)
        if (typeof tag.value !== 'number') {
          errors.push(`質問${question.id}の選択肢${option.value}: タグの値が数値ではない`)
        }
      })
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalQuestions: questions.length,
      totalOptions: questions.reduce((sum, q) => sum + q.options.length, 0),
      questionIds: questions.map(q => q.id)
    }
  }
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  summary: {
    totalQuestions: number
    totalOptions: number
    questionIds: string[]
  }
}

/**
 * 8次元スコアの集計
 */
export function calculateDimensionScores(
  answers: Map<string, string>,
  questions: Question[]
): Map<string, number> {
  const scores = new Map<string, number>()
  
  // 各次元のスコアを初期化
  const dimensions = [
    '乾_創造性', '震_行動性', '坎_探求性', '艮_安定性',
    '坤_受容性', '巽_適応性', '離_表現性', '兌_調和性'
  ]
  dimensions.forEach(dim => scores.set(dim, 0))
  
  // 回答に基づいてスコアを集計
  answers.forEach((selectedValue, questionId) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return
    
    const selectedOption = question.options.find(opt => opt.value === selectedValue)
    if (!selectedOption) return
    
    selectedOption.scoring_tags.forEach(tag => {
      const currentScore = scores.get(tag.key) || 0
      scores.set(tag.key, currentScore + tag.value)
    })
  })
  
  return scores
}