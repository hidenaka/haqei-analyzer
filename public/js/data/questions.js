// questions.js - 質問データ定義ファイル（雛形）
// public/js/questions.js

// 【HaQei Analyzer】8次元対応 questions.js 完全版
// 価値観設問24問 + シナリオ設問6問 = 計30問
// 8次元：乾_創造性, 震_行動性, 坎_探求性, 艮_安定性, 坤_受容性, 巽_適応性, 離_表現性, 兌_調和性

// ===========================================
// 価値観設問（Q1-Q24）: エンジンOS特定用
// 8次元×3問ずつの均等配置
// ===========================================

var WORLDVIEW_QUESTIONS = [
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
        scoring_tags: [
          { key: "乾_創造性", value: 3.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "既存の方法を改良してより良いものにする",
        scoring_tags: [
          { key: "乾_創造性", value: 1.5 },
          { key: "坎_探求性", value: 1.5 },
          { key: "巽_適応性", value: 1.0 },
        ],
      },
      {
        value: "C",
        text: "みんなで話し合って最適な方法を見つける",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "乾_創造性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "過去の成功例を参考にして確実に進める",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "乾_創造性", value: -1.0 },
        ],
      },
      {
        value: "E",
        text: "状況に応じて柔軟に方法を調整する",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.0 },
          { key: "艮_安定性", value: -0.5 },
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
          { key: "震_行動性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "周りの人と相談しながら進める",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
      {
        value: "D",
        text: "状況を見ながら柔軟に対応する",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "明確な方針を決めてから動き出す",
        scoring_tags: [
          { key: "離_表現性", value: 2.0 },
          { key: "艮_安定性", value: 1.5 },
          { key: "震_行動性", value: 1.0 },
        ],
      },
    ],
  },

  {
    id: "q5",
    text: "変化や新しい状況に直面したとき、あなたの反応は？",
    options: [
      {
        value: "A",
        text: "エネルギーが湧いてきて積極的に取り組む",
        scoring_tags: [
          { key: "震_行動性", value: 3.0 },
          { key: "乾_創造性", value: 1.5 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "まず状況をよく理解してから対応する",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "みんなで協力して乗り越えようとする",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 2.0 },
          { key: "震_行動性", value: 0.5 },
        ],
      },
      {
        value: "D",
        text: "慎重に様子を見てから判断する",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坎_探求性", value: 1.0 },
          { key: "震_行動性", value: -1.5 },
        ],
      },
      {
        value: "E",
        text: "状況に合わせて臨機応変に対応する",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "震_行動性", value: 1.5 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
    ],
  },

  {
    id: "q6",
    text: "エネルギーや活力について、あなたの特徴は？",
    options: [
      {
        value: "A",
        text: "瞬発力があり、一気に集中して物事を進める",
        scoring_tags: [
          { key: "震_行動性", value: 3.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "持続力があり、コツコツと長く続けられる",
        scoring_tags: [
          { key: "艮_安定性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "人との関わりの中でエネルギーが湧いてくる",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "震_行動性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "興味のあることに没頭すると力を発揮する",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "離_表現性", value: 1.0 },
          { key: "震_行動性", value: 1.0 },
        ],
      },
      {
        value: "E",
        text: "必要に応じて力の出し方を調整できる",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "震_行動性", value: 1.0 },
          { key: "艮_安定性", value: 0.5 },
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

  {
    id: "q16",
    text: "予期しない変化や困難に直面したとき、あなたの対応は？",
    options: [
      {
        value: "A",
        text: "これを機会に新しいことに挑戦する",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "震_行動性", value: 1.5 },
          { key: "巽_適応性", value: 1.0 },
        ],
      },
      {
        value: "B",
        text: "状況に合わせて柔軟に方針を調整する",
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "坎_探求性", value: 1.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "みんなで協力して乗り越える方法を探す",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "巽_適応性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "原因を分析して根本的な対策を立てる",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "確実で安全な方法で対処する",
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
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
      {
        value: "B",
        text: "みんなの意見を調整して橋渡しをする",
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "兌_調和性", value: 2.0 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "全体の雰囲気を和やかに保つ",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "巽_適応性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "積極的に行動して場を盛り上げる",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "巽_適応性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "安定した基盤を提供して支える",
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
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "巽_適応性", value: 2.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "どんな状況でも対応できる大切な能力",
        scoring_tags: [
          { key: "巽_適応性", value: 3.0 },
          { key: "坎_探求性", value: 1.0 },
          { key: "艮_安定性", value: -1.0 },
        ],
      },
      {
        value: "C",
        text: "人との関係を良好に保つために重要なもの",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "巽_適応性", value: 2.0 },
          { key: "離_表現性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "効果的に行動するための手段の一つ",
        scoring_tags: [
          { key: "震_行動性", value: 2.0 },
          { key: "巽_適応性", value: 1.5 },
          { key: "艮_安定性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "一貫性があってこそ意味を持つもの",
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

  {
    id: "q19",
    text: "自分の考えや気持ちを表現するとき、あなたのスタイルは？",
    options: [
      {
        value: "A",
        text: "独創的で印象に残る方法で表現する",
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "離_表現性", value: 3.0 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "相手に合わせて分かりやすく伝える",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
      {
        value: "C",
        text: "論理的で説得力のある説明をする",
        scoring_tags: [
          { key: "坎_探求性", value: 2.0 },
          { key: "離_表現性", value: 2.0 },
          { key: "兌_調和性", value: -0.5 },
        ],
      },
      {
        value: "D",
        text: "率直で正直な表現を心がける",
        scoring_tags: [
          { key: "離_表現性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "巽_適応性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "相手の気持ちに寄り添いながら伝える",
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
        scoring_tags: [
          { key: "離_表現性", value: 3.0 },
          { key: "乾_創造性", value: 1.5 },
          { key: "坤_受容性", value: -1.0 },
        ],
      },
      {
        value: "B",
        text: "場の雰囲気に合わせて適切に振る舞う",
        scoring_tags: [
          { key: "巽_適応性", value: 2.5 },
          { key: "兌_調和性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
      {
        value: "C",
        text: "みんなが楽しめるように配慮する",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "離_表現性", value: 1.0 },
        ],
      },
      {
        value: "D",
        text: "控えめに振る舞って目立たないようにする",
        scoring_tags: [
          { key: "坤_受容性", value: 2.0 },
          { key: "艮_安定性", value: 1.5 },
          { key: "離_表現性", value: -2.0 },
        ],
      },
      {
        value: "E",
        text: "エネルギッシュに行動して場を盛り上げる",
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
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 2.0 },
          { key: "坤_受容性", value: -0.5 },
        ],
      },
      {
        value: "B",
        text: "自分の個性や魅力で人を惹きつける力",
        scoring_tags: [
          { key: "離_表現性", value: 3.0 },
          { key: "兌_調和性", value: 1.0 },
          { key: "艮_安定性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "みんなをまとめて良い方向に導く力",
        scoring_tags: [
          { key: "兌_調和性", value: 2.5 },
          { key: "坤_受容性", value: 1.5 },
          { key: "離_表現性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "行動で示して周りを動かす力",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "坤_受容性", value: -0.5 },
        ],
      },
      {
        value: "E",
        text: "信頼と実績で認められる力",
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

  {
    id: "q22",
    text: "対立や意見の衝突が起きたとき、あなたの対応は？",
    options: [
      {
        value: "A",
        text: "新しい視点を提示して流れを変える",
        scoring_tags: [
          { key: "乾_創造性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "兌_調和性", value: 1.0 },
        ],
      },
      {
        value: "B",
        text: "双方の良い点を見つけて橋渡しをする",
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "巽_適応性", value: 1.5 },
          { key: "震_行動性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "冷静に分析して客観的な解決策を提示する",
        scoring_tags: [
          { key: "坎_探求性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: 0.5 },
        ],
      },
      {
        value: "D",
        text: "積極的に行動して状況を打開する",
        scoring_tags: [
          { key: "震_行動性", value: 2.5 },
          { key: "離_表現性", value: 1.5 },
          { key: "兌_調和性", value: 0.5 },
        ],
      },
      {
        value: "E",
        text: "相手の気持ちを受け止めて寄り添う",
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
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "震_行動性", value: 1.5 },
          { key: "兌_調和性", value: 1.5 },
        ],
      },
      {
        value: "B",
        text: "笑顔で楽しい時間を共有できること",
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "離_表現性", value: 1.5 },
          { key: "坎_探求性", value: -0.5 },
        ],
      },
      {
        value: "C",
        text: "深く理解し合えること",
        scoring_tags: [
          { key: "坎_探求性", value: 2.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "兌_調和性", value: 1.5 },
        ],
      },
      {
        value: "D",
        text: "互いを支え合えること",
        scoring_tags: [
          { key: "坤_受容性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
      {
        value: "E",
        text: "相手に合わせて適切な関係を築けること",
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
        scoring_tags: [
          { key: "乾_創造性", value: 2.0 },
          { key: "震_行動性", value: 1.5 },
          { key: "兌_調和性", value: 1.5 },
        ],
      },
      {
        value: "B",
        text: "お互いに喜びを分かち合えることが大切",
        scoring_tags: [
          { key: "兌_調和性", value: 3.0 },
          { key: "離_表現性", value: 1.0 },
          { key: "艮_安定性", value: 0.5 },
        ],
      },
      {
        value: "C",
        text: "深い信頼関係を築けることが大切",
        scoring_tags: [
          { key: "坎_探求性", value: 1.5 },
          { key: "艮_安定性", value: 2.0 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
      {
        value: "D",
        text: "困った時に支え合えることが大切",
        scoring_tags: [
          { key: "坤_受容性", value: 2.5 },
          { key: "艮_安定性", value: 1.5 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
      {
        value: "E",
        text: "お互いの違いを認め合えることが大切",
        scoring_tags: [
          { key: "巽_適応性", value: 2.0 },
          { key: "坤_受容性", value: 1.5 },
          { key: "兌_調和性", value: 2.0 },
        ],
      },
    ],
  },
];

// ===========================================
// シナリオ設問（Q25-Q30）: インターフェース/セーフモードOS特定用
// 8次元対応完全版
// ===========================================

var SCENARIO_QUESTIONS = [
  {
    id: "q25",
    scenario:
      "あなたは重要な発表を控えています。準備時間は十分ではなく、多くの人があなたの成果を注目しています。",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（他者への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「きっと何とかなる」と前向きに構える",
          scoring_tags: [
            { key: "乾_創造性", value: 1.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "坎_探求性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "プレッシャーを感じるが、それを力に変える",
          scoring_tags: [
            { key: "震_行動性", value: 2.0 },
            { key: "離_表現性", value: 1.5 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "冷静に状況を分析し、最善の対策を考える",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "艮_安定性", value: 1.5 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "周りの人の理解や支援を心の支えにする",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "兌_調和性", value: 1.5 },
            { key: "離_表現性", value: -1.0 },
          ],
        },
        {
          value: "E",
          text: "不安になるが、状況に合わせて臨機応変に対応しようとする",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "坎_探求性", value: 1.0 },
            { key: "艮_安定性", value: -1.5 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "自信を持って堂々と振る舞う",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "乾_創造性", value: 1.0 },
            { key: "坤_受容性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "周囲に助けを求め、協力して進める",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "離_表現性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "冷静沈着を装い、準備を周到に進める",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "率直に状況を説明し、理解を求める",
          scoring_tags: [
            { key: "離_表現性", value: 2.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "艮_安定性", value: -1.0 },
          ],
        },
        {
          value: "E",
          text: "状況に応じて柔軟に対応方法を調整する",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "震_行動性", value: 1.0 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
      ],
    },
  },

  {
    id: "q26",
    scenario:
      "信頼していた友人が、あなたの知らないところで批判的なことを言っていたことを知ってしまいました。",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（その人への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「これも経験だ」と前向きに捉える",
          scoring_tags: [
            { key: "乾_創造性", value: 1.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "兌_調和性", value: 1.0 },
          ],
        },
        {
          value: "B",
          text: "怒りと裏切られた悲しみを感じる",
          scoring_tags: [
            { key: "震_行動性", value: 2.0 },
            { key: "離_表現性", value: 1.5 },
            { key: "坤_受容性", value: -2.0 },
          ],
        },
        {
          value: "C",
          text: "「何か理由があるはずだ」と冷静に考える",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "坤_受容性", value: 1.0 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "深く傷つき、人間関係への不安を感じる",
          scoring_tags: [
            { key: "坤_受容性", value: -1.5 },
            { key: "艮_安定性", value: -1.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "ショックだが、関係を修復したいと思う",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "直接本人に話して、はっきりさせる",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 2.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "何事もなかったように、普段通りに接する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "巽_適応性", value: 1.5 },
            { key: "離_表現性", value: -1.5 },
          ],
        },
        {
          value: "C",
          text: "第三者を交えて冷静に話し合う",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "兌_調和性", value: 2.0 },
            { key: "艮_安定性", value: 1.5 },
          ],
        },
        {
          value: "D",
          text: "距離を置いて、関係を自然に薄くしていく",
          scoring_tags: [
            { key: "艮_安定性", value: 2.0 },
            { key: "坎_探求性", value: 1.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "率直に傷ついた気持ちを伝える",
          scoring_tags: [
            { key: "離_表現性", value: 2.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
      ],
    },
  },

  {
    id: "q27",
    scenario:
      "あなたの重要な決断（進路、転職、結婚、住む場所など）について、家族や親しい人が強く反対しています。",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（家族への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「自分の人生だから」と自分の意志を貫こうとする",
          scoring_tags: [
            { key: "離_表現性", value: 2.5 },
            { key: "乾_創造性", value: 2.0 },
            { key: "坤_受容性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "家族の気持ちも理解できるので板挟みで悩む",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 1.5 },
            { key: "離_表現性", value: -1.0 },
          ],
        },
        {
          value: "C",
          text: "客観的にどちらが正しいか冷静に判断しようとする",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "艮_安定性", value: 1.5 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "家族の期待に応えたい気持ちが強くなる",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "兌_調和性", value: 2.0 },
            { key: "離_表現性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "状況に応じて柔軟に調整できる方法を探そうとする",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "坎_探求性", value: 1.5 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "自分の考えを論理的に説明し、説得を試みる",
          scoring_tags: [
            { key: "離_表現性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "坤_受容性", value: -0.5 },
          ],
        },
        {
          value: "B",
          text: "家族の意見を尊重し、妥協点を探る",
          scoring_tags: [
            { key: "兌_調和性", value: 3.0 },
            { key: "坤_受容性", value: 1.5 },
            { key: "離_表現性", value: -1.0 },
          ],
        },
        {
          value: "C",
          text: "時間をかけて、お互いの理解を深めようとする",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "艮_安定性", value: 1.5 },
          ],
        },
        {
          value: "D",
          text: "家族の意向に従い、自分の希望は我慢する",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "艮_安定性", value: 1.5 },
            { key: "離_表現性", value: -2.0 },
          ],
        },
        {
          value: "E",
          text: "状況を見ながら段階的に話を進める",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "坎_探求性", value: 1.0 },
            { key: "震_行動性", value: 0.5 },
          ],
        },
      ],
    },
  },

  {
    id: "q28",
    scenario:
      "突然の事故や災害、急病など、予想外の緊急事態が発生しました。迅速な判断と行動が求められています。",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（周囲への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "緊張するが、むしろ集中力が高まる",
          scoring_tags: [
            { key: "震_行動性", value: 2.0 },
            { key: "艮_安定性", value: 2.0 },
            { key: "坤_受容性", value: -0.5 },
          ],
        },
        {
          value: "B",
          text: "パニックになりそうだが、何とか対処しようとする",
          scoring_tags: [
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: 1.5 },
            { key: "艮_安定性", value: -1.5 },
          ],
        },
        {
          value: "C",
          text: "状況を整理し、優先順位を考える",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "みんなの安全を第一に考える",
          scoring_tags: [
            { key: "坤_受容性", value: 3.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "離_表現性", value: -1.0 },
          ],
        },
        {
          value: "E",
          text: "状況に応じて臨機応変に対応しようとする",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "震_行動性", value: 1.5 },
            { key: "艮_安定性", value: -1.0 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "率先して指示を出し、場をまとめる",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 2.0 },
            { key: "坤_受容性", value: -0.5 },
          ],
        },
        {
          value: "B",
          text: "みんなの気持ちを落ち着かせることに集中する",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "情報収集と状況分析を担当する",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "離_表現性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "経験者や専門家の指示を仰ぐ",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "離_表現性", value: -1.5 },
          ],
        },
        {
          value: "E",
          text: "状況に応じて必要な役割を柔軟に担う",
          scoring_tags: [
            { key: "巽_適応性", value: 2.5 },
            { key: "坤_受容性", value: 1.5 },
            { key: "離_表現性", value: -0.5 },
          ],
        },
      ],
    },
  },

  {
    id: "q29",
    scenario:
      "あなたが参加している競技やコンテスト、選考などで、他の参加者と競争する状況になりました。結果によって今後が大きく左右されます。",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（他の参加者への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「絶対に勝ちたい」と闘志を燃やす",
          scoring_tags: [
            { key: "震_行動性", value: 2.5 },
            { key: "離_表現性", value: 2.0 },
            { key: "兌_調和性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "「みんなで良い結果を出せればいいな」と考える",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "C",
          text: "自分のベストを尽くすことだけに集中する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.0 },
            { key: "坎_探求性", value: 1.5 },
            { key: "兌_調和性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "この経験から学べることを大切にしたい",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "坤_受容性", value: 1.5 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "E",
          text: "新しい挑戦ができることが嬉しい",
          scoring_tags: [
            { key: "乾_創造性", value: 2.5 },
            { key: "震_行動性", value: 1.5 },
            { key: "艮_安定性", value: -1.0 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "堂々と自信を見せ、強気な態度で臨む",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 1.5 },
            { key: "兌_調和性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "他の参加者とも友好的に交流する",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 1.5 },
            { key: "離_表現性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "謙虚で礼儀正しい態度を保つ",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "艮_安定性", value: 1.5 },
            { key: "離_表現性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "情報収集をして、戦略的に行動する",
          scoring_tags: [
            { key: "坎_探求性", value: 2.0 },
            { key: "巽_適応性", value: 1.5 },
            { key: "兌_調和性", value: -0.5 },
          ],
        },
        {
          value: "E",
          text: "目立たず、静かに実力を発揮する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "坎_探求性", value: 1.0 },
            { key: "離_表現性", value: -2.0 },
          ],
        },
      ],
    },
  },

  {
    id: "q30",
    scenario:
      "あなたは正しいと思うことと、周囲の期待や利益が相反する状況に置かれました。どちらを選んでも何かを犠牲にしなければなりません。",
    inner_q: "その時のあなたの内面（心の中）の状態は？",
    outer_q: "その時のあなたの外面（周囲への振る舞い）は？",
    options: {
      inner: [
        {
          value: "A",
          text: "「正しいことを貫くべきだ」と強く思う",
          scoring_tags: [
            { key: "離_表現性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "巽_適応性", value: -1.5 },
          ],
        },
        {
          value: "B",
          text: "「みんなが納得できる解決策があるはず」と考える",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "震_行動性", value: -0.5 },
          ],
        },
        {
          value: "C",
          text: "より多くの人が幸せになる選択肢を選びたい",
          scoring_tags: [
            { key: "坤_受容性", value: 3.0 },
            { key: "兌_調和性", value: 1.5 },
            { key: "離_表現性", value: -0.5 },
          ],
        },
        {
          value: "D",
          text: "論理的に最も合理的な判断をしたい",
          scoring_tags: [
            { key: "坎_探求性", value: 2.5 },
            { key: "艮_安定性", value: 2.0 },
            { key: "兌_調和性", value: -0.5 },
          ],
        },
        {
          value: "E",
          text: "新しい第三の道を見つけたい",
          scoring_tags: [
            { key: "乾_創造性", value: 2.5 },
            { key: "巽_適応性", value: 1.5 },
            { key: "艮_安定性", value: -1.0 },
          ],
        },
      ],
      outer: [
        {
          value: "A",
          text: "自分の信念を明確に表明し、理解を求める",
          scoring_tags: [
            { key: "離_表現性", value: 3.0 },
            { key: "震_行動性", value: 1.5 },
            { key: "巽_適応性", value: -1.0 },
          ],
        },
        {
          value: "B",
          text: "関係者全員と話し合い、合意形成を図る",
          scoring_tags: [
            { key: "兌_調和性", value: 2.5 },
            { key: "坤_受容性", value: 2.0 },
            { key: "離_表現性", value: 0.5 },
          ],
        },
        {
          value: "C",
          text: "時間をかけて慎重に検討することを提案する",
          scoring_tags: [
            { key: "艮_安定性", value: 2.5 },
            { key: "坎_探求性", value: 2.0 },
            { key: "震_行動性", value: -1.0 },
          ],
        },
        {
          value: "D",
          text: "周囲の意向に従い、波風を立てないようにする",
          scoring_tags: [
            { key: "坤_受容性", value: 2.5 },
            { key: "艮_安定性", value: 1.5 },
            { key: "離_表現性", value: -2.0 },
          ],
        },
        {
          value: "E",
          text: "創造的な代替案を積極的に提案する",
          scoring_tags: [
            { key: "乾_創造性", value: 2.5 },
            { key: "離_表現性", value: 2.0 },
            { key: "艮_安定性", value: -0.5 },
          ],
        },
      ],
    },
  },
];

console.log("✅ Questions data loaded:", {
  WORLDVIEW_QUESTIONS: WORLDVIEW_QUESTIONS?.length || 0,
  SCENARIO_QUESTIONS: SCENARIO_QUESTIONS?.length || 0,
});
