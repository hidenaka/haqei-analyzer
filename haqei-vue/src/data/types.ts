/**
 * 質問システムの型定義
 */

// スコアリングタグの型定義
export interface ScoringTag {
  key: string
  value: number
  type?: 'conflicting' | 'complementary'
}

// 選択肢の型定義
export interface QuestionOption {
  value: string
  text: string
  koui_level?: number
  scoring_tags: ScoringTag[]
}

// 基本質問の型定義
export interface Question {
  id: string
  text: string
  options: QuestionOption[]
}

// シナリオ質問の型定義（拡張版）
export interface ScenarioQuestion extends Question {
  scenario?: string
  situation_hexagram?: string
  hexagram_number?: number
  hexagram_meaning?: string
  inner_q?: string
  outer_q?: string
  options: {
    inner?: QuestionOption[]
    outer?: QuestionOption[]
  } | QuestionOption[]
}

// 回答の型定義
export interface Answer {
  questionId: string
  selectedValue: string
  timestamp: number
  scoring_tags?: ScoringTag[]
  koui_level?: number
  innerChoice?: any
  outerChoice?: any
}

// 分析結果の型定義
export interface AnalysisResult {
  dimensionScores: Map<string, number>
  primaryHexagram: number
  compatibility: number
  timestamp: number
}

// 8次元の型定義
export const EIGHT_DIMENSIONS = [
  '乾_創造性',
  '震_行動性',
  '坎_探求性',
  '艮_安定性',
  '坤_受容性',
  '巽_適応性',
  '離_表現性',
  '兌_調和性'
] as const

export type DimensionKey = typeof EIGHT_DIMENSIONS[number]

// 爻レベルの型定義
export type KouiLevel = 1 | 2 | 3 | 4 | 5 | 6

// 質問グループの型定義
export type QuestionGroup = 'worldview' | 'scenario' | 'safemode'

// 質問のメタデータ
export interface QuestionMetadata {
  group: QuestionGroup
  dimension?: DimensionKey
  order: number
}