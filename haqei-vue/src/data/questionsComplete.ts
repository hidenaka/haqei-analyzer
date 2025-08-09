/**
 * 完全な質問データ（移行用テンプレート）
 * 
 * このファイルはquestions.jsからの完全な移行を行うためのテンプレートです。
 * 実際の使用時は、このデータをquestions.tsに統合してください。
 */

import type { Question, ScenarioQuestion } from './types'

// 完全な価値観設問データ（q7-q24）のテンプレート
export const ADDITIONAL_WORLDVIEW_QUESTIONS: Question[] = [
  // ========================================
  // 坎_探求性 測定（Q7-Q9）
  // ========================================
  {
    id: "q7",
    text: "わからないことに遭遇したとき、あなたの反応は？",
    options: [
      {
        value: "A",
        text: "徹底的に調べて真相を突き止めたい",
        scoring_tags: [
          { key: "坎_探求性", value: 3.0 },
          { key: "艮_安定性", value: 1.0 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B", 
        text: "必要な範囲で理解できれば十分",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
      // 他の選択肢も同様に追加
    ],
  },
  // q8-q24も同様に追加
]

// 完全なシナリオ設問データ（q26-q30）のテンプレート  
export const ADDITIONAL_SCENARIO_QUESTIONS: ScenarioQuestion[] = [
  {
    id: "q26",
    scenario: "あなたは友人から重要な相談を受けました。その内容は、あなたの価値観とは相反するものでした。",
    situation_hexagram: "風沢中孚",
    hexagram_number: 61,
    hexagram_meaning: "内なる誠実さと外への配慮のバランス",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（友人への対応）は？",
    text: "", // ScenarioQuestionでは使用しない
    options: {
      inner: [
        {
          value: "A",
          text: "正直に自分の考えを伝えるべきだと思う",
          scoring_tags: [
            { key: "離_表現性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "兌_調和性", value: -1.0 },
          ],
        },
        // 他の内面選択肢
      ],
      outer: [
        {
          value: "A", 
          text: "率直に自分の意見を伝える",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 1.5 },
            { key: "兌_調和性", value: -0.5 },
          ],
        },
        // 他の外面選択肢
      ],
    },
  },
  // q27-q30も同様に追加
]

// データ統合のヘルパー関数
export function mergeQuestions(
  base: Question[],
  additional: Question[]
): Question[] {
  const merged = [...base]
  
  additional.forEach(newQuestion => {
    const existingIndex = merged.findIndex(q => q.id === newQuestion.id)
    if (existingIndex >= 0) {
      merged[existingIndex] = newQuestion
    } else {
      merged.push(newQuestion)
    }
  })
  
  // IDでソート
  return merged.sort((a, b) => {
    const aNum = parseInt(a.id.replace('q', ''))
    const bNum = parseInt(b.id.replace('q', ''))
    return aNum - bNum
  })
}