/**
 * HaQei Triple OS Analyzer - 統一スコアリングシステム完全版
 * 
 * 設計思想：
 * - 全員が3つのOSを持っている（相対的な強さを測定）
 * - 各質問の合計点は常に6点
 * - マイナススコアなし（数学的健全性）
 * - 選択肢の意味を統一
 */

// スコアリング配分定義
const UNIFIED_SCORING = {
    // ENGINE OS測定質問（Q1-12）の配点パターン
    ENGINE_PATTERNS: {
        A: { engine: 3.0, interface: 2.0, safe: 1.0 },  // ENGINE重視型
        B: { engine: 3.0, interface: 1.0, safe: 2.0 },  // ENGINEバランス型
        C: { engine: 2.0, interface: 2.0, safe: 2.0 },  // 中庸型
        D: { engine: 1.0, interface: 3.0, safe: 2.0 },  // INTERFACE寄り
        E: { engine: 1.0, interface: 2.0, safe: 3.0 }   // SAFE寄り
    },
    
    // INTERFACE OS測定質問（Q13-24）の配点パターン
    INTERFACE_PATTERNS: {
        A: { engine: 2.0, interface: 3.0, safe: 1.0 },  // INTERFACE重視型
        B: { engine: 1.0, interface: 3.0, safe: 2.0 },  // INTERFACEバランス型
        C: { engine: 2.0, interface: 2.0, safe: 2.0 },  // 中庸型
        D: { engine: 3.0, interface: 1.0, safe: 2.0 },  // ENGINE寄り
        E: { engine: 2.0, interface: 1.0, safe: 3.0 }   // SAFE寄り
    },
    
    // SAFE MODE OS測定質問（Q25-36）の配点パターン
    SAFE_PATTERNS: {
        A: { engine: 1.0, interface: 2.0, safe: 3.0 },  // SAFE重視型
        B: { engine: 2.0, interface: 1.0, safe: 3.0 },  // SAFEバランス型
        C: { engine: 2.0, interface: 2.0, safe: 2.0 },  // 中庸型
        D: { engine: 3.0, interface: 2.0, safe: 1.0 },  // ENGINE寄り
        E: { engine: 2.0, interface: 3.0, safe: 1.0 }   // INTERFACE寄り
    }
};

// OS点数を八卦に分配する関数
function distributeToTriGrams(osScore, osType) {
    const distributions = {
        engine: {
            3.0: { "乾_創造性": 1.2, "震_行動性": 1.0, "坎_探求性": 0.8 },
            2.0: { "乾_創造性": 0.8, "震_行動性": 0.7, "坎_探求性": 0.5 },
            1.0: { "乾_創造性": 0.4, "震_行動性": 0.3, "坎_探求性": 0.3 }
        },
        interface: {
            3.0: { "兌_調和性": 1.2, "離_表現性": 1.0, "巽_適応性": 0.8 },
            2.0: { "兌_調和性": 0.8, "離_表現性": 0.7, "巽_適応性": 0.5 },
            1.0: { "兌_調和性": 0.4, "離_表現性": 0.3, "巽_適応性": 0.3 }
        },
        safe: {
            3.0: { "艮_安定性": 1.8, "坤_受容性": 1.2 },
            2.0: { "艮_安定性": 1.2, "坤_受容性": 0.8 },
            1.0: { "艮_安定性": 0.6, "坤_受容性": 0.4 }
        }
    };
    
    return distributions[osType][osScore] || {};
}

// 統一質問データ
const unifiedQuestions = [
    // ========== ENGINE OS Questions (Q1-12) ==========
    {
        id: "q1",
        text: "何か新しいことを始めるとき、あなたはどんな風に取り組みますか？",
        category: { title: "創造性", description: "新しいことへの取り組み方" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "わくわくして、すぐに飛び込む",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "興味深いと思ったら、まず調べてみる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "状況を見ながら、バランスよく進める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "周りの人と相談しながら進める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "慎重に準備してから始める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q2",
        text: "アイデアが浮かんだとき、どうしますか？",
        category: { title: "創造性", description: "アイデアの扱い方" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "すぐに実行に移す",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "可能性を深く考える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "いくつかの選択肢を比較する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "人に話して意見を聞く",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "メモして後で検討する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q3",
        text: "変化に対してどう感じますか？",
        category: { title: "創造性", description: "変化への態度" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "変化は成長のチャンス",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "新しい発見があって面白い",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "必要に応じて受け入れる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "みんなと一緒に乗り越える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "できるだけ安定を保ちたい",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q4",
        text: "決断を下すとき、何を重視しますか？",
        category: { title: "行動性", description: "決断の基準" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "直感とスピード",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "データと分析",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "バランスと総合判断",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "関係者への影響",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "リスクの最小化",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q5",
        text: "行動を起こすタイミングは？",
        category: { title: "行動性", description: "行動のタイミング" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "思い立ったらすぐ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "重要なポイントを見極めてから",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "状況を見て適切に",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "周りと足並みを揃えて",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "十分な準備ができてから",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q6",
        text: "困難に直面したとき、どう対処しますか？",
        category: { title: "行動性", description: "困難への対処" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "挑戦として楽しむ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "原因を分析して解決策を探る",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "複数の対処法を検討",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "仲間と協力して乗り越える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "焦らず着実に対処",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q7",
        text: "新しい知識や技術を学ぶとき、どのように取り組みますか？",
        category: { title: "探求性", description: "学習への取り組み" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "実践しながら学ぶ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "深く理解するまで研究",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "段階的に理解を深める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "人から教わりながら学ぶ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "基礎から順番に積み上げる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q8",
        text: "問題を発見したとき、どう感じますか？",
        category: { title: "探求性", description: "問題への反応" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "解決する楽しみを感じる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "原因を突き止めたくなる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "改善の機会と捉える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "みんなで解決したいと思う",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "慎重に対処を考える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q9",
        text: "目標に向かってどのように進みますか？",
        category: { title: "探求性", description: "目標達成の方法" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "最短距離を突き進む",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "最適な方法を探求する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "柔軟にルートを調整",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "仲間と協力しながら",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "着実に一歩ずつ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q10",
        text: "リーダーシップを取るとき、どんなスタイルですか？",
        category: { title: "創造性", description: "リーダーシップスタイル" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "ビジョンを示して引っ張る",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "戦略を立てて導く",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "状況に応じて役割を変える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "みんなの意見をまとめる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "支える役割を果たす",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q11",
        text: "エネルギーが最も高まるのはどんな時？",
        category: { title: "行動性", description: "エネルギーの源" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "新しい挑戦をする時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "深く没頭している時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "全体が調和している時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "人と繋がっている時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "安定した環境にいる時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q12",
        text: "未知の領域に踏み出すとき、どう感じますか？",
        category: { title: "探求性", description: "未知への態度" },
        osType: "ENGINE",
        options: [
            { 
                value: "A", 
                text: "興奮と期待でいっぱい",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "知的好奇心が刺激される",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "慎重に可能性を評価",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "仲間がいれば安心",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "十分な準備があれば大丈夫",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    
    // ========== INTERFACE OS Questions (Q13-24) ==========
    {
        id: "q13",
        text: "人と接するとき、どんなスタイルですか？",
        category: { title: "調和性", description: "対人関係のスタイル" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "親しみやすく温かく接する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "相手に合わせて調整する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "バランスを保って接する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "率直に自分を表現する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "慎重に距離を保つ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q14",
        text: "チームワークで大切にしていることは？",
        category: { title: "調和性", description: "チームでの価値観" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "みんなが楽しく働けること",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "役割分担と協力",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "効率と調和のバランス",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "目標達成への集中",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "安定した関係性",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q15",
        text: "意見の違いがあるとき、どう対応しますか？",
        category: { title: "調和性", description: "対立への対処" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "共通点を見つけて和解を目指す",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "お互いの立場を理解し合う",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "中立的な立場で調整",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "論理的に議論する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "時間をかけて解決を待つ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q16",
        text: "自分の考えや感情を伝えるとき、どのように表現しますか？",
        category: { title: "表現性", description: "自己表現の方法" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "情熱的に伝える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "相手に分かりやすく説明",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "状況を見て適切に",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "簡潔に要点を伝える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "控えめに伝える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q17",
        text: "プレゼンテーションをするとき、どんなスタイルですか？",
        category: { title: "表現性", description: "プレゼンスタイル" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "エネルギッシュに魅力的に",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "聴衆との対話を重視",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "バランスよく構成",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "データと論理で説得",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "慎重に準備した内容を伝える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q18",
        text: "創作活動（文章、絵、音楽など）をするとき、どんな傾向がありますか？",
        category: { title: "表現性", description: "創作スタイル" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "感情を豊かに表現",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "人に伝わることを意識",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "様々な要素を組み合わせる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "独創的なアイデアを形に",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "丁寧に時間をかけて完成",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q19",
        text: "環境の変化に対して、どのように適応しますか？",
        category: { title: "適応性", description: "環境への適応" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "すぐに新しい環境を楽しむ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "周りを観察して調整",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "徐々に馴染んでいく",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "自分のペースを保つ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "慎重に様子を見る",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q20",
        text: "予定が変更になったとき、どう反応しますか？",
        category: { title: "適応性", description: "変更への対応" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "新しい可能性として歓迎",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "柔軟に対応策を考える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "状況を見て判断",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "効率的な代替案を立てる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "できるだけ元の計画に近づける",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q21",
        text: "新しい人と会うとき、どのように関係を築きますか？",
        category: { title: "適応性", description: "新しい関係構築" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "オープンに自分から話しかける",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "相手のペースに合わせる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "自然な流れで関係を深める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "共通の話題から入る",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "ゆっくり時間をかけて",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q22",
        text: "人から頼まれごとをされたとき、どう対応しますか？",
        category: { title: "調和性", description: "依頼への対応" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "喜んで引き受ける",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "できる範囲で協力",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "内容を確認してから判断",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "自分の優先順位で決める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "慎重に検討してから返答",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q23",
        text: "コミュニケーションで重視することは？",
        category: { title: "表現性", description: "コミュニケーション価値観" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "感情的なつながり",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "相互理解と共感",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "バランスの取れた対話",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "効率的な情報交換",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "適切な距離感",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    {
        id: "q24",
        text: "フィードバックを受けたとき、どう反応しますか？",
        category: { title: "適応性", description: "フィードバックへの反応" },
        osType: "INTERFACE",
        options: [
            { 
                value: "A", 
                text: "成長の機会として歓迎",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "建設的に受け止める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "内容を吟味して取り入れる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "論理的に分析する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "じっくり考えてから対応",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            }
        ]
    },
    
    // ========== SAFE MODE OS Questions (Q25-36) ==========
    {
        id: "q25",
        text: "日常生活で大切にしていることは？",
        category: { title: "安定性", description: "日常の価値観" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "規則正しい生活リズム",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "健康と安全",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "仕事と休息のバランス",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "効率的な時間管理",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "人との調和",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q26",
        text: "ストレスを感じたとき、どう対処しますか？",
        category: { title: "安定性", description: "ストレス対処法" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "休息を取って回復",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "運動や趣味でリフレッシュ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "原因を分析して対策",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "積極的に問題解決",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "人に相談して支えを得る",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q27",
        text: "長期的な計画を立てるとき、どんなアプローチを取りますか？",
        category: { title: "安定性", description: "計画立案のスタイル" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "確実に達成できる目標を設定",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "段階的に積み上げる計画",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "柔軟に調整できる計画",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "野心的な目標設定",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "周りと調整しながら決める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q28",
        text: "他人の意見や感情に対して、どのように受け止めますか？",
        category: { title: "受容性", description: "他者への受容" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "深く共感して受け入れる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "理解しようと努力する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "客観的に受け止める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "論理的に評価する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "相手との関係性を重視",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q29",
        text: "批判や否定的な意見を受けたとき、どう感じますか？",
        category: { title: "受容性", description: "批判への反応" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "冷静に受け止める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "学びの機会と考える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "内容によって判断",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "反論したくなる",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "関係性への影響を心配",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q30",
        text: "自分と異なる価値観に出会ったとき、どう対応しますか？",
        category: { title: "受容性", description: "多様性への対応" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "違いを尊重する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "理解を深めようとする",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "共通点と相違点を整理",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "自分の価値観を主張",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "対話を通じて調和を目指す",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q31",
        text: "リスクをどのように捉えますか？",
        category: { title: "安定性", description: "リスクへの態度" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "できるだけ避ける",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "慎重に評価して対処",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "バランスを見て判断",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "チャンスとして捉える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "周りと相談して決める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q32",
        text: "自分の限界を感じたとき、どうしますか？",
        category: { title: "安定性", description: "限界への対処" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "休息を取って回復を待つ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "ペースを調整する",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "方法を変えて対処",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "限界を超えようと挑戦",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "助けを求める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q33",
        text: "安心感を感じるのはどんな時？",
        category: { title: "安定性", description: "安心感の源" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "予定通りに進んでいる時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "準備が整っている時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "全体のバランスが取れている時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "目標に向かって進んでいる時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "信頼できる人と一緒にいる時",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q34",
        text: "感謝の気持ちを表現するとき、どのようにしますか？",
        category: { title: "受容性", description: "感謝の表現" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "心からの言葉で伝える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "行動で示す",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "適切な形で返す",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "成果で応える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "関係を深める",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q35",
        text: "他人の成功を見たとき、どう感じますか？",
        category: { title: "受容性", description: "他者の成功への反応" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "素直に喜ぶ",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "学びの機会と捉える",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "客観的に評価",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "自分も頑張ろうと思う",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "一緒に祝いたい",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    },
    {
        id: "q36",
        text: "人生で最も大切にしていることは？",
        category: { title: "受容性", description: "人生の価値観" },
        osType: "SAFE",
        options: [
            { 
                value: "A", 
                text: "心の平穏と安定",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(1.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "B", 
                text: "着実な成長",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(1.0, "interface"),
                    distributeToTriGrams(3.0, "safe")
                )
            },
            { 
                value: "C", 
                text: "バランスの取れた生活",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(2.0, "safe")
                )
            },
            { 
                value: "D", 
                text: "目標の達成",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(3.0, "engine"),
                    distributeToTriGrams(2.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            },
            { 
                value: "E", 
                text: "人との繋がり",
                scoring: Object.assign(
                    {},
                    distributeToTriGrams(2.0, "engine"),
                    distributeToTriGrams(3.0, "interface"),
                    distributeToTriGrams(1.0, "safe")
                )
            }
        ]
    }
];

// Export for use in the application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { unifiedQuestions, UNIFIED_SCORING };
} else {
    window.unifiedQuestions = unifiedQuestions;
    window.UNIFIED_SCORING = UNIFIED_SCORING;
    
    // 互換性レイヤー: 既存コードがwindow.QUESTIONSを使用しているため
    window.QUESTIONS = unifiedQuestions;
    console.log('✅ Unified scoring system loaded: 36 questions with balanced 6-point scoring');
}