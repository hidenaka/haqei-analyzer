/**
 * HAQEI Complete 36 Questions - 統一スコアリング版 v2
 * 3つのOSの相対的優位性を測定する新設計
 * 全質問で合計6ポイントの統一配点
 */

// 配点パターンの定義（全質問共通）
const SCORING_PATTERNS = {
  // ENGINE OS測定質問用（Q1-12）
  ENGINE_QUESTIONS: {
    A: { // ENGINE重視型
      engine: { "乾_創造性": 1.2, "震_行動性": 1.0, "坎_探求性": 0.8 },     // 合計3.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 0.6, "坤_受容性": 0.4 }                        // 合計1.0
    },
    B: { // ENGINEバランス型
      engine: { "乾_創造性": 1.2, "震_行動性": 1.0, "坎_探求性": 0.8 },     // 合計3.0
      interface: { "兌_調和性": 0.4, "離_表現性": 0.3, "巽_適応性": 0.3 },  // 合計1.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    C: { // 中庸型
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    D: { // INTERFACE寄り
      engine: { "乾_創造性": 0.4, "震_行動性": 0.3, "坎_探求性": 0.3 },     // 合計1.0
      interface: { "兌_調和性": 1.2, "離_表現性": 1.0, "巽_適応性": 0.8 },  // 合計3.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    E: { // SAFE寄り
      engine: { "乾_創造性": 0.4, "震_行動性": 0.3, "坎_探求性": 0.3 },     // 合計1.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 1.8, "坤_受容性": 1.2 }                        // 合計3.0
    }
  },
  
  // INTERFACE OS測定質問用（Q13-24）
  INTERFACE_QUESTIONS: {
    A: { // INTERFACE重視型
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 1.2, "離_表現性": 1.0, "巽_適応性": 0.8 },  // 合計3.0
      safe: { "艮_安定性": 0.6, "坤_受容性": 0.4 }                        // 合計1.0
    },
    B: { // INTERFACEバランス型
      engine: { "乾_創造性": 0.4, "震_行動性": 0.3, "坎_探求性": 0.3 },     // 合計1.0
      interface: { "兌_調和性": 1.2, "離_表現性": 1.0, "巽_適応性": 0.8 },  // 合計3.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    C: { // 中庸型
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    D: { // ENGINE寄り
      engine: { "乾_創造性": 1.2, "震_行動性": 1.0, "坎_探求性": 0.8 },     // 合計3.0
      interface: { "兌_調和性": 0.4, "離_表現性": 0.3, "巽_適応性": 0.3 },  // 合計1.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    E: { // SAFE寄り
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 0.4, "離_表現性": 0.3, "巽_適応性": 0.3 },  // 合計1.0
      safe: { "艮_安定性": 1.8, "坤_受容性": 1.2 }                        // 合計3.0
    }
  },
  
  // SAFE MODE OS測定質問用（Q25-36）
  SAFEMODE_QUESTIONS: {
    A: { // SAFE重視型
      engine: { "乾_創造性": 0.4, "震_行動性": 0.3, "坎_探求性": 0.3 },     // 合計1.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 1.8, "坤_受容性": 1.2 }                        // 合計3.0
    },
    B: { // SAFEバランス型
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 0.4, "離_表現性": 0.3, "巽_適応性": 0.3 },  // 合計1.0
      safe: { "艮_安定性": 1.8, "坤_受容性": 1.2 }                        // 合計3.0
    },
    C: { // 中庸型
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 1.2, "坤_受容性": 0.8 }                        // 合計2.0
    },
    D: { // ENGINE寄り
      engine: { "乾_創造性": 1.2, "震_行動性": 1.0, "坎_探求性": 0.8 },     // 合計3.0
      interface: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },  // 合計2.0
      safe: { "艮_安定性": 0.6, "坤_受容性": 0.4 }                        // 合計1.0
    },
    E: { // INTERFACE寄り
      engine: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },     // 合計2.0
      interface: { "兌_調和性": 1.2, "離_表現性": 1.0, "巽_適応性": 0.8 },  // 合計3.0
      safe: { "艮_安定性": 0.6, "坤_受容性": 0.4 }                        // 合計1.0
    }
  }
};

// スコアリング関数
function getScoring(questionType, choice) {
  const patterns = SCORING_PATTERNS[questionType];
  const pattern = patterns[choice];
  
  // 3つのカテゴリを統合して1つのオブジェクトに
  return {
    ...pattern.engine,
    ...pattern.interface,
    ...pattern.safe
  };
}

// 質問データ
window.QUESTIONS_UNIFIED = [
  // ========== ENGINE OS測定質問 (Q1-12) ==========
  {
    id: "q1",
    text: "何か新しいことを始めるとき、あなたはどんな風に取り組みますか？",
    category: { title: "創造性", description: "新しいことへの取り組み方" },
    options: [
      { 
        value: "A", 
        text: "わくわくして、すぐに飛び込む",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "興味深いと思ったら、まず調べてみる",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "状況を見ながら、バランスよく進める",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "周りの人と相談しながら進める",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "慎重に準備してから始める",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q2",
    text: "いいアイデアが浮かんだとき、あなたはどうしますか？",
    category: { title: "創造性", description: "アイデアへの対応" },
    options: [
      { 
        value: "A", 
        text: "すぐに試してみたくなる",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "実現可能か検討してから動く",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "いろいろな角度から考える",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "誰かに話して意見を聞く",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "タイミングを見計らって実行する",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q3",
    text: "挑戦するとき、何を大切にしますか？",
    category: { title: "行動性", description: "挑戦への姿勢" },
    options: [
      { 
        value: "A", 
        text: "スピード感と勢い",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "効率と成果",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "全体のバランス",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "周りとの協力",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "リスクの最小化",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q4",
    text: "時間がない中で何かを終わらせるとき、どうしますか？",
    category: { title: "行動性", description: "プレッシャー下での対応" },
    options: [
      { 
        value: "A", 
        text: "集中力を高めて一気に片付ける",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "優先順位をつけて効率的に処理",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "できる範囲で最善を尽くす",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "助けを求めて協力してもらう",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "延期できないか検討する",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q5",
    text: "チャンスが来たとき、どう反応しますか？",
    category: { title: "行動性", description: "機会への対応" },
    options: [
      { 
        value: "A", 
        text: "迷わず飛びつく",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "メリットを分析してから決める",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "総合的に判断する",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "周りの意見も聞いてみる",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "リスクを慎重に評価する",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q6",
    text: "やる気が高まったとき、どうしますか？",
    category: { title: "行動性", description: "モチベーションの活用" },
    options: [
      { 
        value: "A", 
        text: "新しいことに挑戦する",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "溜まっていた仕事を片付ける",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "いろいろなことをバランスよく",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "みんなと何か楽しいことをする",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "長期的な目標のために使う",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q7",
    text: "新しいことを学ぶとき、どんな方法が好きですか？",
    category: { title: "探求性", description: "学習スタイル" },
    options: [
      { 
        value: "A", 
        text: "実践しながら覚える",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "体系的に理解してから実践",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "いろいろな方法を試す",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "人から教えてもらう",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "確実に身につくまでじっくり",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q8",
    text: "問題にぶつかったとき、どう対処しますか？",
    category: { title: "探求性", description: "問題解決アプローチ" },
    options: [
      { 
        value: "A", 
        text: "直感的に解決策を見つける",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "原因を分析して対処",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "複数の視点から検討",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "みんなで相談する",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "安全な方法を選ぶ",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q9",
    text: "知識を実践で使うとき、どうしますか？",
    category: { title: "探求性", description: "知識の活用" },
    options: [
      { 
        value: "A", 
        text: "自分なりにアレンジして使う",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "理論通りに正確に実行",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "状況に応じて調整",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "他の人と共有して活用",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "確実な部分だけを使う",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q10",
    text: "何か重要なことを進めるとき、どんな役割を担いますか？",
    category: { title: "推進力", description: "役割選択" },
    options: [
      { 
        value: "A", 
        text: "先頭に立って引っ張る",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "計画を立てて道筋を示す",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "全体を見て調整する",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "みんなをまとめる",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "確実に支える",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q11",
    text: "達成感を感じるのはどんなときですか？",
    category: { title: "価値観", description: "成果への価値観" },
    options: [
      { 
        value: "A", 
        text: "新しいことを成し遂げたとき",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "計画通りに完了したとき",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスよく達成したとき",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "みんなで成功したとき",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "安定した成果を出したとき",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q12",
    text: "決断するとき、何を重視しますか？",
    category: { title: "決断", description: "意思決定の基準" },
    options: [
      { 
        value: "A", 
        text: "直感とスピード",
        scoring: getScoring('ENGINE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "論理と分析",
        scoring: getScoring('ENGINE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "総合的なバランス",
        scoring: getScoring('ENGINE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "関係者の合意",
        scoring: getScoring('ENGINE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "リスクの最小化",
        scoring: getScoring('ENGINE_QUESTIONS', 'E')
      }
    ]
  },

  // ========== INTERFACE OS測定質問 (Q13-24) ==========
  {
    id: "q13",
    text: "みんなの雰囲気が良くないとき、どうしますか？",
    category: { title: "調和性", description: "雰囲気改善" },
    options: [
      { 
        value: "A", 
        text: "明るく振る舞って雰囲気を変える",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "一人ひとりの話を聞く",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "状況を見て適切に対応",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "問題を解決しようと動く",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "静かに見守る",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q14",
    text: "意見が対立したとき、どう対処しますか？",
    category: { title: "調和性", description: "対立解決" },
    options: [
      { 
        value: "A", 
        text: "間に入って調整する",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "双方の良い点を見つける",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "中立的な立場を保つ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しい解決策を提案",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "時間をかけて収まるのを待つ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q15",
    text: "楽しい時間を過ごすとき、どうしますか？",
    category: { title: "調和性", description: "喜びの共有" },
    options: [
      { 
        value: "A", 
        text: "みんなを盛り上げる",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "それぞれが楽しめるよう配慮",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "自然体で楽しむ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しい楽しみ方を提案",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "静かに一緒の時間を楽しむ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q16",
    text: "自分の考えを伝えるとき、どうしますか？",
    category: { title: "表現性", description: "自己表現" },
    options: [
      { 
        value: "A", 
        text: "情熱的に熱く語る",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "相手に合わせて伝え方を変える",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスよく説明",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "論理的に説得する",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "控えめに伝える",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q17",
    text: "注目されたとき、どう感じますか？",
    category: { title: "表現性", description: "注目への反応" },
    options: [
      { 
        value: "A", 
        text: "チャンスだと思って活かす",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "期待に応えようとする",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "自然体でいる",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "何か新しいことをする",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "目立たないようにする",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q18",
    text: "自信を持って行動できるのは？",
    category: { title: "表現性", description: "自信の源泉" },
    options: [
      { 
        value: "A", 
        text: "人前で話すとき",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "人をサポートするとき",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "いつも通りにできるとき",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しいことに挑戦するとき",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "準備が万全なとき",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q19",
    text: "予定が変わったとき、どう対応しますか？",
    category: { title: "適応性", description: "変化への対応" },
    options: [
      { 
        value: "A", 
        text: "新しい可能性として楽しむ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "柔軟に対応を切り替える",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "状況を見て判断",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "より良い計画を立て直す",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "できるだけ元の予定を守る",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q20",
    text: "想定外のことが起きたとき、最初にすることは？",
    category: { title: "適応性", description: "予期せぬ事態" },
    options: [
      { 
        value: "A", 
        text: "面白いと思って対応する",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "みんなと協力して対処",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "冷静に状況を把握",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "すぐに対策を考える",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "安全を確保する",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q21",
    text: "色々な価値観の人と一緒にいるとき、どうしますか？",
    category: { title: "適応性", description: "多様性への対応" },
    options: [
      { 
        value: "A", 
        text: "違いを楽しむ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "共通点を見つける",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "自然に接する",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しい視点を学ぶ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "自分のペースを保つ",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q22",
    text: "人と関わるときに得意なことは？",
    category: { title: "対人能力", description: "対人スキル" },
    options: [
      { 
        value: "A", 
        text: "場を盛り上げる",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "相手の気持ちを理解する",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスよく付き合う",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しいアイデアを出す",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "信頼関係を築く",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q23",
    text: "グループで提供できる価値は？",
    category: { title: "貢献", description: "グループへの貢献" },
    options: [
      { 
        value: "A", 
        text: "活気と元気",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "調整と仲介",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "安定とバランス",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "革新と変化",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "安心と信頼",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q24",
    text: "人間関係で大切にしていることは？",
    category: { title: "価値観", description: "関係性の価値観" },
    options: [
      { 
        value: "A", 
        text: "楽しさと刺激",
        scoring: getScoring('INTERFACE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "理解と共感",
        scoring: getScoring('INTERFACE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "適度な距離感",
        scoring: getScoring('INTERFACE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "成長と発展",
        scoring: getScoring('INTERFACE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "安定と継続",
        scoring: getScoring('INTERFACE_QUESTIONS', 'E')
      }
    ]
  },

  // ========== SAFE MODE OS測定質問 (Q25-36) ==========
  {
    id: "q25",
    text: "困難な状況でも安定していられるのは？",
    category: { title: "安定性", description: "困難への対応" },
    options: [
      { 
        value: "A", 
        text: "準備と計画があるから",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "経験と実績があるから",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランス感覚があるから",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "挑戦精神があるから",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "周りの支えがあるから",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q26",
    text: "長期的に続けることについて、どう考えますか？",
    category: { title: "継続性", description: "継続への価値観" },
    options: [
      { 
        value: "A", 
        text: "コツコツ積み重ねが大切",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "基盤をしっかり作ることが重要",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "無理なく続けることが大切",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "常に改善しながら続ける",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "みんなと一緒なら続けられる",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q27",
    text: "大切なものを守るとき、どうしますか？",
    category: { title: "防御", description: "価値の保護" },
    options: [
      { 
        value: "A", 
        text: "万全の対策を講じる",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "実績ある方法で守る",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "状況に応じて守り方を変える",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "積極的に守りに行く",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "みんなで協力して守る",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q28",
    text: "誰かを支えるとき、どうしますか？",
    category: { title: "受容性", description: "支援の方法" },
    options: [
      { 
        value: "A", 
        text: "しっかりと支える",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "安心できる環境を作る",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "相手に合わせて支える",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "前向きに励ます",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "一緒に寄り添う",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q29",
    text: "ストレスを感じるのは？",
    category: { title: "ストレス", description: "ストレス要因" },
    options: [
      { 
        value: "A", 
        text: "計画が崩れるとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "基盤が揺らぐとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスが崩れるとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "挑戦できないとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "人間関係が悪いとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q30",
    text: "心の中で最も守りたいものは？",
    category: { title: "価値観", description: "内的価値" },
    options: [
      { 
        value: "A", 
        text: "秩序と規律",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "安全と安心",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "心の平穏",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "自由と可能性",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "つながりと絆",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q31",
    text: "予想外のことが起きたとき、最初の反応は？",
    category: { title: "変化対応", description: "初期反応" },
    options: [
      { 
        value: "A", 
        text: "すぐに対策を考える",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "まず状況を安定させる",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "落ち着いて様子を見る",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "チャンスと捉える",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "周りと相談する",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q32",
    text: "疲れたとき、どう回復しますか？",
    category: { title: "回復", description: "回復方法" },
    options: [
      { 
        value: "A", 
        text: "規則正しい生活で回復",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "ゆっくり休んで回復",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスよく回復",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しいことで気分転換",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "人と過ごして回復",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q33",
    text: "限界を感じたとき、どうしますか？",
    category: { title: "限界", description: "限界への対処" },
    options: [
      { 
        value: "A", 
        text: "計画を見直す",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "無理せず休む",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "ペースを調整する",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "新しい方法を試す",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "助けを求める",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q34",
    text: "安心を感じるのは？",
    category: { title: "安心", description: "安心の源泉" },
    options: [
      { 
        value: "A", 
        text: "準備が整っているとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "安定した環境にいるとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスが取れているとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "自由に動けるとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "信頼できる人といるとき",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q35",
    text: "批判されたとき、どう反応しますか？",
    category: { title: "批判", description: "批判への対応" },
    options: [
      { 
        value: "A", 
        text: "改善点として受け止める",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "冷静に受け流す",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "バランスよく対応",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "成長の機会と捉える",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "相手の立場も理解する",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  },
  {
    id: "q36",
    text: "本当の強さとは？",
    category: { title: "強さ", description: "強さの定義" },
    options: [
      { 
        value: "A", 
        text: "計画性と実行力",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'A')
      },
      { 
        value: "B", 
        text: "揺るがない安定性",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'B')
      },
      { 
        value: "C", 
        text: "柔軟なバランス",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'C')
      },
      { 
        value: "D", 
        text: "挑戦する勇気",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'D')
      },
      { 
        value: "E", 
        text: "人とのつながり",
        scoring: getScoring('SAFEMODE_QUESTIONS', 'E')
      }
    ]
  }
];

// 実装確認
console.log("✅ HAQEI Unified Scoring v2 loaded:", window.QUESTIONS_UNIFIED.length, "questions");
console.log("📊 統一スコアリングシステム実装完了");
console.log("⚖️ 全質問で合計6ポイントの配点");
console.log("🎯 3つのOSの相対的優位性を測定");