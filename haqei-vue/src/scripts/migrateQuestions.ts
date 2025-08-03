#!/usr/bin/env ts-node

/**
 * 質問データ移行スクリプト
 * 
 * 目的：
 * questions.jsから質問データを読み込み、TypeScript形式に変換する
 * 
 * 使用方法：
 * npm run migrate:questions
 */

import * as fs from 'fs'
import * as path from 'path'

// 出力ファイルのテンプレート
const outputTemplate = `/**
 * HAQEI Analyzer 質問データ定義
 * 
 * 自動生成ファイル - 手動で編集しないでください
 * 生成日時: ${new Date().toISOString()}
 * 
 * 構成：
 * - 価値観設問（Q1-Q24）：エンジンOS特定用
 * - シナリオ設問（Q25-Q30）：インターフェース・セーフモードOS測定用
 * 
 * 8次元：
 * - 乾_創造性, 震_行動性, 坎_探求性, 艮_安定性
 * - 坤_受容性, 巽_適応性, 離_表現性, 兌_調和性
 */

import { Question, QuestionOption, ScoringTag } from './types'

// 価値観設問（Q1-Q24）- 8次元×3問
export const WORLDVIEW_QUESTIONS: Question[] = [
  // ここに質問データを挿入
]

// シナリオ設問（Q25-Q30）
export const SCENARIO_QUESTIONS: Question[] = [
  // ここに質問データを挿入
]

// 全質問データ
export const ALL_QUESTIONS: Question[] = [
  ...WORLDVIEW_QUESTIONS,
  ...SCENARIO_QUESTIONS
]

// ヘルパー関数
export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find(q => q.id === id)
}

export function getQuestionsByRange(startId: string, endId: string): Question[] {
  const startNum = parseInt(startId.replace('q', ''))
  const endNum = parseInt(endId.replace('q', ''))
  
  return ALL_QUESTIONS.filter(q => {
    const num = parseInt(q.id.replace('q', ''))
    return num >= startNum && num <= endNum
  })
}

// 8次元の定義
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

// 次元ごとの質問ID
export const DIMENSION_QUESTIONS: Record<DimensionKey, string[]> = {
  '乾_創造性': ['q1', 'q2', 'q3'],
  '震_行動性': ['q4', 'q5', 'q6'],
  '坎_探求性': ['q7', 'q8', 'q9'],
  '艮_安定性': ['q10', 'q11', 'q12'],
  '坤_受容性': ['q13', 'q14', 'q15'],
  '巽_適応性': ['q16', 'q17', 'q18'],
  '離_表現性': ['q19', 'q20', 'q21'],
  '兌_調和性': ['q22', 'q23', 'q24']
}

// 爻レベルの定義
export const KOUI_LEVELS = {
  1: { name: '初爻', description: '始まり・基礎段階での慎重さと準備' },
  2: { name: '二爻', description: '発展・協力段階での他者との連携' },
  3: { name: '三爻', description: '転換・危険段階での注意深い改良' },
  4: { name: '四爻', description: '進展・責任段階でのリーダーシップ的適応' },
  5: { name: '五爻', description: '成熟・統率段階での創造的決断力' },
  6: { name: '上爻', description: '極限・転換段階での新たな始まり' }
} as const

export type KouiLevel = keyof typeof KOUI_LEVELS
`

// 型定義ファイルのテンプレート
const typesTemplate = `/**
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
}

// 分析結果の型定義
export interface AnalysisResult {
  dimensionScores: Map<string, number>
  primaryHexagram: number
  compatibility: number
  timestamp: number
}
`

// メイン処理
async function migrateQuestions() {
  try {
    console.log('質問データ移行を開始します...')
    
    // 型定義ファイルを作成
    const typesPath = path.join(__dirname, '../data/types.ts')
    fs.writeFileSync(typesPath, typesTemplate)
    console.log('✓ 型定義ファイルを作成しました')
    
    // 移行メッセージ
    console.log(`
注意: 現在は基本構造のみを作成しています。
完全な移行には以下の手順が必要です：

1. public/js/shared/data/questions.js から手動でデータをコピー
2. TypeScript形式に変換
3. データ検証の実行

移行支援ツールは src/utils/questionsMigration.ts にあります。
`)
    
    console.log('✓ 基本ファイル構造の作成が完了しました')
    
  } catch (error) {
    console.error('エラーが発生しました:', error)
    process.exit(1)
  }
}

// スクリプト実行
migrateQuestions()