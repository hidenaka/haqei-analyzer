/**
 * 質問データ構造定義とデータ
 * 
 * 目的：
 * HaQei Analyzerの8次元測定のための質問データをTypeScriptで定義
 * 
 * 構成：
 * - 価値観設問（Q1-Q24）：エンジンOS特定用
 * - シナリオ設問（Q25-Q30）：インターフェース・セーフモードOS測定用
 * 
 * 8次元：
 * - 乾_創造性, 震_行動性, 坎_探求性, 艮_安定性
 * - 坤_受容性, 巽_適応性, 離_表現性, 兌_調和性
 */

import type { 
  Question, 
  QuestionOption, 
  ScoringTag, 
  ScenarioQuestion,
  DimensionKey,
  KouiLevel,
  EIGHT_DIMENSIONS
} from './types'
import { SCENARIO_QUESTIONS_EXTENDED } from './scenarioQuestions'

// 価値観設問（Q1-Q24）
export const WORLDVIEW_QUESTIONS: Question[] = [
  // ========================================
  // 乾_創造性 測定（Q1-Q3）
  // ========================================
  {
    id: "q1",
    text: "新しいプロジェクトや取り組みを始めるとき、あなたが最も重視することは？",
    options: [
      {
        value: "A",
        text: "誰もやったことのない革新的なアプローチを試す",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 3.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "艮_安定性", value: -1.0, type: "conflicting" },
        ],
      },
      {
        value: "B",
        text: "既存の方法を改良してより良いものにする",
        koui_level: 3,
        scoring_tags: [
          { key: "乾_創造性", value: 1.5 },
          { key: "坎_探求性", value: 1.5 },
          { key: "巽_適応性", value: 1.0, type: "complementary" },
        ],
      },
      {
        value: "C",
        text: "みんなで話し合って最適な方法を見つける",
        koui_level: 2,
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "乾_創造性", value: -0.5, type: "conflicting" },
        ],
      },
      {
        value: "D",
        text: "過去の成功例を参考にして確実に進める",
        koui_level: 1,
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.0, type: "complementary" },
          { key: "乾_創造性", value: -1.0, type: "conflicting" },
        ],
      },
      {
        value: "E",
        text: "状況に応じて柔軟に方法を調整する",
        koui_level: 4,
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.0, type: "conflicting" },
          { key: "艮_安定性", value: -0.5, type: "conflicting" },
        ],
      },
    ],
  },
  {
    id: "q2",
    text: "アイデアが浮かんだとき、あなたの行動パターンは？",
    options: [
      {
        value: "A",
        text: "すぐに新しい形として具現化してみたくなる",
        scoring_tags: [
          { key: "乾_創造性", value: 3.0 },
          { key: "震_行動性", value: 2.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "まず詳しく調べてから実行に移す",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 2.0 },
          { key: "震_行動性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "周りの人と相談して意見を聞く",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "乾_創造性", value: 0.5 },
        ],
      },
      {
        value: "D",
        text: "実現可能性を慎重に検討する",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.5 },
          { key: "乾_創造性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "タイミングを見計らって最適な時に実行する",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q3",
    text: "「創造する」ということについて、あなたの考えに最も近いのは？",
    options: [
      {
        value: "A",
        text: "何もないところから全く新しいものを生み出すこと",
        scoring_tags: [
          { key: "乾_創造性", value: 3.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "みんなで協力して素晴らしいものを作り上げること",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "乾_創造性", value: 1.0 },
        ],
      },
      {
        value: "C",
        text: "深く研究して新しい発見をすること",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "乾_創造性", value: 1.5 },
          { key: "兌_調和性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "着実に積み重ねて価値あるものを築くこと",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "乾_創造性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "状況に合わせて最適な解決策を見つけること",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "乾_創造性", value: 1.0 },
        ],
      },
    ],
  },

  // ========================================
  // 震_行動性 測定（Q4-Q6）
  // ========================================
  {
    id: "q4",
    text: "やらなければならないことがあるとき、あなたのスタイルは？",
    options: [
      {
        value: "A",
        text: "すぐに行動を起こして勢いで進める",
        scoring_tags: [
          { key: "震_行動性", value: 3.0 },
          { key: "乾_創造性", value: 1.0 },
          { key: "艮_安定性", value: -1.5 },
        ],
      },
      {
        value: "B",
        text: "計画を立ててから着実に実行する",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "周りと協力してチームで進める",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "状況を見極めてから最適なタイミングで動く",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.5 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "自分の感覚を信じて直感的に進める",
        scoring_tags: [
          { key: "離_表現性", value: 2.0 },
          { key: "震_行動性", value: 2.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
    ],
  },
  {
    id: "q5",
    text: "ストレスや困難な状況に直面したとき、あなたの第一反応は？",
    options: [
      {
        value: "A",
        text: "即座に問題解決に向けて動き出す",
        scoring_tags: [
          { key: "震_行動性", value: 3.0 },
          { key: "乾_創造性", value: 1.5 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "冷静に状況を分析して原因を探る",
        scoring_tags: [
          { key: "坎_探求性", value: 3.0 },
          { key: "艮_安定性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "信頼できる人に相談して支えを求める",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "震_行動性", value: 0.0 },
        ],
      },
      {
        value: "D",
        text: "落ち着いて状況が好転するのを待つ",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: -1.5 },
        ],
      },
      {
        value: "E",
        text: "柔軟に対応しながら最善の道を探る",
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
    ],
  },
  {
    id: "q6",
    text: "新しい挑戦や機会があるとき、あなたの反応は？",
    options: [
      {
        value: "A",
        text: "ワクワクして飛び込みたくなる",
        scoring_tags: [
          { key: "震_行動性", value: 3.0 },
          { key: "離_表現性", value: 2.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "興味深いが、まず詳しく調べてから決める",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "巽_適応性", value: 1.5 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
      {
        value: "C",
        text: "リスクと利益を慎重に天秤にかける",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 2.0 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "周りの意見を聞いてから判断する",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: 0.0 },
        ],
      },
      {
        value: "E",
        text: "自分にとって本当に価値があるか考える",
        scoring_tags: [
          { key: "離_表現性", value: 2.0 },
          { key: "坎_探求性", value: 1.5 },
          { key: "震_行動性", value: 1.0 },
        ],
      },
    ],
  },

  // ========================================
  // 坎_探求性 測定（Q7-Q9）
  // ========================================
  {
    id: "q7",
    text: "知らないことに出会ったとき、あなたの反応は？",
    options: [
      {
        value: "A",
        text: "深く掘り下げて徹底的に理解したくなる",
        scoring_tags: [
          { key: "坎_探求性", value: 3.0 },
          { key: "艮_安定性", value: 1.0 },
          { key: "兌_調和性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "新しい発見や可能性を見つけたくなる",
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "坎_探求性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "みんなで一緒に学び合いたくなる",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "実用的で役に立つ部分を知りたくなる",
        scoring_tags: [
          { key: "艮_安定性", value: 2.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "必要に応じて少しずつ理解していく",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q8",
    text: "複雑な問題に直面したとき、あなたのアプローチは？",
    options: [
      {
        value: "A",
        text: "問題の本質を見極めるまで考え抜く",
        scoring_tags: [
          { key: "坎_探求性", value: 3.0 },
          { key: "艮_安定性", value: 1.5 },
          { key: "震_行動性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "新しい視点から問題を捉え直す",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "坎_探求性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "いろいろな人の意見を聞いて参考にする",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "まず行動してみて、やりながら解決策を見つける",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "巽_適応性", value: 1.5 },
          { key: "坎_探求性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "過去の経験や事例を参考にして解決する",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "乾_創造性", value: -1.0 },
        ],
      },
    ],
  },
  {
    id: "q9",
    text: "学習や研究について、あなたの姿勢は？",
    options: [
      {
        value: "A",
        text: "真理や本質を追求することに喜びを感じる",
        scoring_tags: [
          { key: "坎_探求性", value: 3.0 },
          { key: "離_表現性", value: 1.0 },
          { key: "兌_調和性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "新しい発見から創造的なアイデアを得たい",
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "坎_探求性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "学んだことをみんなと共有したい",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "実生活で活用できる知識を身につけたい",
        scoring_tags: [
          { key: "艮_安定性", value: 2.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "状況に応じて必要な知識を効率よく学ぶ",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
    ],
  },

  // ========================================
  // 艮_安定性 測定（Q10-Q12）
  // ========================================
  {
    id: "q10",
    text: "重要な決断をするとき、あなたが最も重視することは？",
    options: [
      {
        value: "A",
        text: "確実性が高く、リスクの少ない選択肢",
        scoring_tags: [
          { key: "艮_安定性", value: 3.0 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: -1.5 },
        ],
      },
      {
        value: "B",
        text: "革新的で大きな可能性のある選択肢",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "震_行動性", value: 1.5 },
          { key: "艮_安定性", value: -1.5 },
        ],
      },
      {
        value: "C",
        text: "みんなが納得できる選択肢",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "艮_安定性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "論理的に最も合理的な選択肢",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "離_表現性", value: 1.0 },
          { key: "艮_安定性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "状況に応じて柔軟に変更できる選択肢",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "震_行動性", value: 1.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q11",
    text: "長期的な目標について、あなたの考え方は？",
    options: [
      {
        value: "A",
        text: "着実に積み重ねて確実に達成したい",
        scoring_tags: [
          { key: "艮_安定性", value: 3.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "大胆な挑戦で大きな成果を目指したい",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "震_行動性", value: 2.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "みんなと一緒に成長していきたい",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "艮_安定性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "深く探求して専門性を高めたい",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "状況に応じて目標を柔軟に調整したい",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
    ],
  },
  {
    id: "q12",
    text: "「継続」や「持続」について、あなたの価値観は？",
    options: [
      {
        value: "A",
        text: "一度始めたことは最後までやり遂げることが大切",
        scoring_tags: [
          { key: "艮_安定性", value: 3.0 },
          { key: "坤_受容性", value: 1.0 },
          { key: "巽_適応性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "常に新しいことに挑戦し続けることが大切",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "震_行動性", value: 1.5 },
          { key: "艮_安定性", value: -1.5 },
        ],
      },
      {
        value: "C",
        text: "みんなと良い関係を長く保つことが大切",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "艮_安定性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "深く学び続けて理解を深めることが大切",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 2.0 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "変化に合わせて適応し続けることが大切",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
    ],
  },

  // ========================================
  // 坤_受容性 測定（Q13-Q15）
  // ========================================
  {
    id: "q13",
    text: "他の人との関わり方で、あなたの特徴は？",
    options: [
      {
        value: "A",
        text: "積極的にリードして新しい方向性を示す",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 2.0 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "相手の話をじっくり聞いて理解しようとする",
        scoring_tags: [
          { key: "坤_受容性", value: 3.0 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "お互いの意見を交換して学び合う",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坎_探求性", value: 1.5 },
          { key: "坤_受容性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "エネルギッシュに活動して盛り上げる",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "坤_受容性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "相手に合わせて適切な距離感を保つ",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q14",
    text: "困っている人を見かけたとき、あなたの反応は？",
    options: [
      {
        value: "A",
        text: "新しい解決方法を提案してサポートする",
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "坤_受容性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "まず相手の気持ちを受け止めて寄り添う",
        scoring_tags: [
          { key: "坤_受容性", value: 3.0 },
          { key: "兌_調和性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "一緒に解決策を考えて実行する",
        scoring_tags: [
          { key: "兌_調和性", value: 2.0 },
          { key: "震_行動性", value: 1.5 },
          { key: "坤_受容性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "問題の原因を分析して根本的な解決を図る",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.0 },
          { key: "坤_受容性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "その人に最も適した支援方法を見つける",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q15",
    text: "「支える」ということについて、あなたの考えは？",
    options: [
      {
        value: "A",
        text: "新しい可能性を開いて人を励ますこと",
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "坤_受容性", value: 1.5 },
        ],
      },
      {
        value: "B",
        text: "どんな時も変わらずそばにいること",
        scoring_tags: [
          { key: "坤_受容性", value: 3.0 },
          { key: "艮_安定性", value: 2.0 },
          { key: "震_行動性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "共に喜び、共に悲しむこと",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "坎_探求性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "具体的な行動で実際に助けること",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "艮_安定性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "相手の状況に合わせて最適な支援をすること",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
    ],
  },

  // ========================================
  // 巽_適応性 測定（Q16-Q18）
  // ========================================
  /**
   * 巽_適応性測定質問群（Q16-Q18）
   * 
   * 目的：
   * 易経の巽卦（風）に基づく適応性・柔軟性・調整力の測定
   * 
   * 測定要素：
   * - 状況への適応力
   * - 柔軟性の価値観
   * - 多様性への対応能力
   * 
   * 特徴：
   * - 風のように状況に合わせて形を変える能力
   * - 固執せず流れに沿う知恵
   * - 多様な価値観を橋渡しする調整力
   */
  {
    id: "q16",
    text: "予期しない変化や困難に直面したとき、あなたの対応は？",
    options: [
      {
        value: "A",
        text: "これを機会に新しいことに挑戦する",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "震_行動性", value: 1.5 },
          { key: "巽_適応性", value: 1.0 },
        ],
      },
      {
        value: "B",
        text: "状況に合わせて柔軟に方針を調整する",
        koui_level: 4,
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "坎_探求性", value: 1.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "みんなで協力して乗り越える方法を探す",
        koui_level: 2,
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "巽_適応性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "原因を分析して根本的な対策を立てる",
        koui_level: 3,
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "確実で安全な方法で対処する",
        koui_level: 1,
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坤_受容性", value: 1.0 },
          { key: "巽_適応性", value: -1.0 },
        ],
      },
    ],
  },
  {
    id: "q17",
    text: "異なる価値観の人たちと一緒に活動するとき、あなたの役割は？",
    options: [
      {
        value: "A",
        text: "新しい視点やアイデアを提供する",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
      {
        value: "B",
        text: "みんなの意見を調整して橋渡しをする",
        koui_level: 4,
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "兌_調和性", value: 2.0 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "全体の雰囲気を和やかに保つ",
        koui_level: 2,
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "巽_適応性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "積極的に行動して場を盛り上げる",
        koui_level: 3,
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "安定した基盤を提供して支える",
        koui_level: 1,
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
    ],
  },
  {
    id: "q18",
    text: "「柔軟性」について、あなたの価値観は？",
    options: [
      {
        value: "A",
        text: "新しい可能性を生み出すために必要なもの",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "巽_適応性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "どんな状況でも対応できる大切な能力",
        koui_level: 4,
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "坎_探求性", value: 1.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "人との関係を良好に保つために重要なもの",
        koui_level: 2,
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "巽_適応性", value: 2.0 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "効果的に行動するための手段の一つ",
        koui_level: 3,
        scoring_tags: [
          { key: "震_行動性", value: 2.0 },
          { key: "巽_適応性", value: 1.5 },
          { key: "艮_安定性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "一貫性があってこそ意味を持つもの",
        koui_level: 1,
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "巽_適応性", value: -1.5 },
        ],
      },
    ],
  },

  // ========================================
  // 離_表現性 測定（Q19-Q21）
  // ========================================
  /**
   * 離_表現性測定質問群（Q19-Q21）
   * 
   * 目的：
   * 易経の離卦（火）に基づく表現力・影響力・発信力の測定
   * 
   * 測定要素：
   * - 自己表現のスタイル
   * - 注目・影響力への態度
   * - 他者への印象や魅力の発揮
   * 
   * 特徴：
   * - 火のように明るく輝く表現力
   * - 他者を照らし導く影響力
   * - 個性と魅力による人々の惹きつけ
   */
  {
    id: "q19",
    text: "自分の考えや気持ちを表現するとき、あなたのスタイルは？",
    options: [
      {
        value: "A",
        text: "独創的で印象に残る方法で表現する",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "離_表現性", value: 3.0 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "相手に合わせて分かりやすく伝える",
        koui_level: 4,
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
      {
        value: "C",
        text: "論理的で説得力のある説明をする",
        koui_level: 3,
        scoring_tags: [
          { key: "坎_探求性", value: 2.0 },
          { key: "離_表現性", value: 2.0 },
          { key: "兌_調和性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "率直で正直な表現を心がける",
        koui_level: 2,
        scoring_tags: [
          { key: "離_表現性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "巽_適応性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "相手の気持ちに寄り添いながら伝える",
        koui_level: 1,
        scoring_tags: [
          { key: "坤_受容性", value: 2.5 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: 0.5 },
        ],
      },
    ],
  },
  {
    id: "q20",
    text: "注目を浴びる場面で、あなたの反応は？",
    options: [
      {
        value: "A",
        text: "自分らしさを思い切り発揮する",
        koui_level: 5,
        scoring_tags: [
          { key: "離_表現性", value: 3.0 },
          { key: "乾_創造性", value: 1.5 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "場の雰囲気に合わせて適切に振る舞う",
        koui_level: 4,
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
      {
        value: "C",
        text: "みんなが楽しめるように配慮する",
        koui_level: 2,
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "控えめに振る舞って目立たないようにする",
        koui_level: 1,
        scoring_tags: [
          { key: "坤_受容性", value: 2.0 },
          { key: "艮_安定性", value: 1.5 },
          { key: "離_表現性", value: -2.0 },
        ],
      },
      {
        value: "E",
        text: "エネルギッシュに行動して場を盛り上げる",
        koui_level: 3,
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q21",
    text: "「影響力を持つ」ということについて、あなたの考えは？",
    options: [
      {
        value: "A",
        text: "新しい価値観や可能性を伝える力",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 2.0 },
          { key: "坤_受容性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "自分の個性や魅力で人を惹きつける力",
        koui_level: 4,
        scoring_tags: [
          { key: "離_表現性", value: 3.0 },
          { key: "兌_調和性", value: 1.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "みんなをまとめて良い方向に導く力",
        koui_level: 2,
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "離_表現性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "行動で示して周りを動かす力",
        koui_level: 3,
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "坤_受容性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "信頼と実績で認められる力",
        koui_level: 1,
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
    ],
  },

  // ========================================
  // 兌_調和性 測定（Q22-Q24）
  // ========================================
  /**
   * 兌_調和性測定質問群（Q22-Q24）
   * 
   * 目的：
   * 易経の兌卦（沢）に基づく調和性・協調性・喜びの共有力の測定
   * 
   * 測定要素：
   * - 対立や衝突への対応
   * - 人間関係での価値観
   * - つながりや絆への考え方
   * 
   * 特徴：
   * - 沢のように人々を潤し和ませる力
   * - 対立を調和に変える調整力
   * - 共感と喜びの共有による絆の構築
   */
  {
    id: "q22",
    text: "対立や意見の衝突が起きたとき、あなたの対応は？",
    options: [
      {
        value: "A",
        text: "新しい視点を提示して流れを変える",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "兌_調和性", value: 1.0 },
        ],
      },
      {
        value: "B",
        text: "双方の良い点を見つけて橋渡しをする",
        koui_level: 4,
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "巽_適応性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "冷静に分析して客観的な解決策を提示する",
        koui_level: 3,
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: 0.5 },
        ],
      },
      {
        value: "D",
        text: "積極的に行動して状況を打開する",
        koui_level: 2,
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "兌_調和性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "相手の気持ちを受け止めて寄り添う",
        koui_level: 1,
        scoring_tags: [
          { key: "坤_受容性", value: 2.5 },
          { key: "兌_調和性", value: 2.0 },
          { key: "震_行動性", value: -1.0 },
        ],
      },
    ],
  },
  {
    id: "q23",
    text: "人との関係で最も大切にしていることは？",
    options: [
      {
        value: "A",
        text: "お互いに刺激し合って成長できること",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "震_行動性", value: 1.5 },
          { key: "兌_調和性", value: 1.5 },
        ],
      },
      {
        value: "B",
        text: "笑顔で楽しい時間を共有できること",
        koui_level: 4,
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "坎_探求性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "深く理解し合えること",
        koui_level: 3,
        scoring_tags: [
          { key: "坎_探求性", value: 2.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "兌_調和性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "互いを支え合えること",
        koui_level: 1,
        scoring_tags: [
          { key: "坤_受容性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
      {
        value: "E",
        text: "相手に合わせて適切な関係を築けること",
        koui_level: 2,
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
    ],
  },
  {
    id: "q24",
    text: "「つながり」や「絆」について、あなたの価値観は？",
    options: [
      {
        value: "A",
        text: "新しい出会いから生まれる可能性が大切",
        koui_level: 5,
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "震_行動性", value: 1.5 },
          { key: "兌_調和性", value: 1.5 },
        ],
      },
      {
        value: "B",
        text: "お互いに喜びを分かち合えることが大切",
        koui_level: 4,
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "離_表現性", value: 1.0 },
          { key: "艮_安定性", value: 0.5 },
        ],
      },
      {
        value: "C",
        text: "深い信頼関係を築けることが大切",
        koui_level: 3,
        scoring_tags: [
          { key: "坎_探求性", value: 1.5 },
          { key: "艮_安定性", value: 2.0 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
      {
        value: "D",
        text: "困った時に支え合えることが大切",
        koui_level: 1,
        scoring_tags: [
          { key: "坤_受容性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
      {
        value: "E",
        text: "お互いの違いを認め合えることが大切",
        koui_level: 2,
        scoring_tags: [
          { key: "巽_適応性", value: 2.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
    ],
  },
]

// シナリオ設問（Q25-Q30）
/**
 * シナリオ設問データ（q25-q30）
 * 
 * 目的：
 * - 極限状況での行動パターン分析
 * - 内面と外面の行動の整合性測定
 * - Triple OS の動的な相互作用の観察
 * 
 * 特徴：
 * - 具体的な状況設定（scenario）
 * - 内面の反応（inner）と外面の行動（outer）を分離
 * - 易経の卦との対応による深層心理分析
 */
export const SCENARIO_QUESTIONS: ScenarioQuestion[] = [
  {
    id: "q25",
    text: "あなたが会社で新しいプロジェクトリーダーに任命されました。メンバーは経験豊富ですが、それぞれ異なる意見を持っています。最初のミーティングで、あなたはどのようにチームをまとめますか？",
    options: [
      {
        value: "A",
        text: "全員の意見をじっくり聞いてから、みんなが納得できる折衷案を作る",
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "坤_受容性", value: 2.0 },
          { key: "巽_適応性", value: 1.5 },
        ],
      },
      {
        value: "B",
        text: "明確なビジョンを示し、そこに向かってメンバーを導く",
        scoring_tags: [
          { key: "乾_創造性", value: 3.0 },
          { key: "離_表現性", value: 2.0 },
          { key: "震_行動性", value: 1.5 },
        ],
      },
      {
        value: "C",
        text: "各メンバーの強みを分析し、最適な役割分担を提案する",
        scoring_tags: [
          { key: "坎_探求性", value: 3.0 },
          { key: "巽_適応性", value: 2.0 },
          { key: "艮_安定性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "過去の成功事例を共有し、実績に基づいた方法論を提案する",
        scoring_tags: [
          { key: "艮_安定性", value: 3.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "坎_探求性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "まずは小さな成功を目指し、チームの結束を高めながら進める",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "兌_調和性", value: 2.0 },
          { key: "巽_適応性", value: 1.5 },
        ],
      },
    ],
  },

  // 残りのシナリオ設問も同様に追加...
]

// 全質問データの結合とエクスポート
export const ALL_QUESTIONS: Question[] = [
  ...WORLDVIEW_QUESTIONS,
  ...SCENARIO_QUESTIONS
]

// 質問IDから質問を取得するヘルパー関数
export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find(q => q.id === id)
}

// 爻レベルの説明
export const KOUI_LEVELS = {
  1: { name: '初爻', description: '始まり・基礎段階での慎重さと準備' },
  2: { name: '二爻', description: '発展・協力段階での他者との連携' },
  3: { name: '三爻', description: '転換・危険段階での注意深い改良' },
  4: { name: '四爻', description: '進展・責任段階でのリーダーシップ的適応' },
  5: { name: '五爻', description: '成熟・統率段階での創造的決断力' },
  6: { name: '上爻', description: '極限・転換段階での新たな始まり' }
} as const

// 次元ごとの質問ID（8次元完全版）
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

// 質問の範囲取得
export function getQuestionsByRange(startId: string, endId: string): Question[] {
  const startNum = parseInt(startId.replace('q', ''))
  const endNum = parseInt(endId.replace('q', ''))
  
  return ALL_QUESTIONS.filter(q => {
    const num = parseInt(q.id.replace('q', ''))
    return num >= startNum && num <= endNum
  })
}