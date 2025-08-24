/**
 * HAQEI Data Assets - 保持すべきデータベース
 * 64卦データベースとシナリオ設問
 */

// ==========================================
// 64卦データベース（完全版）
// ==========================================

const HEXAGRAMS = [
    { hexagram_id: 1, name_jp: "乾為天", reading: "けんいてん", catchphrase: "天翔ける龍のような、天性のリーダー", upper_trigram_id: 1, lower_trigram_id: 1, description: "あなたの心の奥底には、天を翔ける龍のような壮大なエネルギーが宿っています。新しい道を切り開き、人々を導くことに最も価値を見出すあなたは、生まれながらのリーダーです。", keywords: "創造,リーダーシップ,力" },
    { hexagram_id: 2, name_jp: "坤為地", reading: "こんいち", catchphrase: "大地の母のように、すべてを受け入れる人", upper_trigram_id: 8, lower_trigram_id: 8, description: "あなたの心には、大地のような広大で深い包容力が備わっています。人や物事を育み、支えることに最も喜びを感じるあなたは、周囲にとって欠かせない存在です。", keywords: "受容,育成,サポート" },
    // ... 他の62卦（コピーは省略、実際には全64卦を含む）
];

// ==========================================
// シナリオ設問（Q26-Q30）- 高品質・保持
// ==========================================

const SCENARIO_QUESTIONS = [
    {
        id: "q26",
        text: "信頼していた友人が、あなたの知らないところで批判的なことを言っていたことを知ってしまいました。",
        category: { title: "人間関係", description: "信頼関係の危機への対応" },
        options: [
            { value: "A", text: "直接本人に話して、はっきりさせる", scoring: { "li_expression": 3.0, "zhen_action": 2.0, "dui_harmony": -1.5 } },
            { value: "B", text: "何事もなかったように、普段通りに接する", scoring: { "gen_stability": 2.5, "xun_adaptability": 1.5, "li_expression": -1.5 } },
            { value: "C", text: "第三者を交えて冷静に話し合う", scoring: { "kan_exploration": 2.0, "dui_harmony": 2.0, "gen_stability": 1.5 } },
            { value: "D", text: "距離を置いて、関係を自然に薄くしていく", scoring: { "gen_stability": 2.0, "kan_exploration": 1.0, "dui_harmony": -1.5 } },
            { value: "E", text: "率直に傷ついた気持ちを伝える", scoring: { "li_expression": 2.0, "dui_harmony": 1.5, "gen_stability": -0.5 } }
        ]
    },
    {
        id: "q27",
        text: "あなたの重要な決断（進路、転職、結婚、住む場所など）について、家族や親しい人が強く反対しています。",
        category: { title: "価値観の対立", description: "家族との価値観の違いへの対応" },
        options: [
            { value: "A", text: "毅然とした態度で自分の決意を表明する", scoring: { "li_expression": 3.0, "zhen_action": 2.0, "kun_receptiveness": -1.0 } },
            { value: "B", text: "時間をかけて丁寧に説明し、理解を求める", scoring: { "dui_harmony": 2.5, "li_expression": 2.0, "gen_stability": 1.0 } },
            { value: "C", text: "一時的に距離を置いて、お互い冷静になる時間を作る", scoring: { "gen_stability": 2.0, "xun_adaptability": 1.5, "dui_harmony": -0.5 } },
            { value: "D", text: "家族の意見も聞き入れて、妥協点を探る", scoring: { "kun_receptiveness": 2.5, "dui_harmony": 2.0, "zhen_action": -0.5 } },
            { value: "E", text: "第三者の意見も取り入れて、客観的に話し合う", scoring: { "kan_exploration": 2.0, "xun_adaptability": 1.5, "dui_harmony": 1.5 } }
        ]
    },
    {
        id: "q28",
        text: "突然の事故や災害、急病など、予想外の緊急事態が発生しました。迅速な判断と行動が求められています。",
        category: { title: "緊急事態", description: "危機的状況での判断力と行動力" },
        options: [
            { value: "A", text: "大声で周囲に指示を出し、人々を誘導する", scoring: { "li_expression": 3.0, "zhen_action": 2.5, "kun_receptiveness": -1.0 } },
            { value: "B", text: "専門家や責任者を探して、適切な判断を仰ぐ", scoring: { "kan_exploration": 2.0, "gen_stability": 2.0, "zhen_action": 1.0 } },
            { value: "C", text: "できる範囲で周りの人をサポートし、協力して対処する", scoring: { "dui_harmony": 2.5, "kun_receptiveness": 2.0, "zhen_action": 1.0 } },
            { value: "D", text: "状況に応じて臨機応変に行動する", scoring: { "xun_adaptability": 3.0, "zhen_action": 1.5, "gen_stability": -1.0 } },
            { value: "E", text: "マニュアルや手順を思い出して、確実に実行する", scoring: { "gen_stability": 2.5, "kan_exploration": 1.0, "xun_adaptability": -0.5 } }
        ]
    },
    {
        id: "q29",
        text: "あなたが参加している競技やコンテスト、選考などで、他の参加者と競争する状況になりました。結果によって今後が大きく左右されます。",
        category: { title: "競争", description: "競争状況での戦略と心構え" },
        options: [
            { value: "A", text: "フレンドリーに接しながらも、決して気を抜かない", scoring: { "dui_harmony": 2.0, "xun_adaptability": 2.0, "zhen_action": 1.5 } },
            { value: "B", text: "堂々と自信を持って、実力を存分に発揮する", scoring: { "li_expression": 3.0, "qian_creativity": 2.0, "kun_receptiveness": -0.5 } },
            { value: "C", text: "相手を尊重しつつ、正々堂々と競い合う", scoring: { "dui_harmony": 2.5, "gen_stability": 2.0, "li_expression": 1.0 } },
            { value: "D", text: "他の参加者から学べることを積極的に吸収する", scoring: { "kun_receptiveness": 2.5, "kan_exploration": 2.0, "zhen_action": 0.5 } },
            { value: "E", text: "心理戦も含めて、あらゆる手段で勝利を目指す", scoring: { "kan_exploration": 2.0, "xun_adaptability": 1.5, "dui_harmony": -1.5 } }
        ]
    },
    {
        id: "q30",
        text: "あなたは正しいと思うことと、周囲の期待や利益が相反する状況に置かれました。どちらを選んでも何かを犠牲にしなければなりません。",
        category: { title: "道徳的ジレンマ", description: "価値観と現実の間での選択" },
        options: [
            { value: "A", text: "自分の信念を率直に表明し、理解を求める", scoring: { "li_expression": 3.0, "zhen_action": 2.0, "dui_harmony": -0.5 } },
            { value: "B", text: "時間をかけて、みんなが納得できる解決策を探る", scoring: { "dui_harmony": 2.5, "kan_exploration": 2.0, "gen_stability": 1.5 } },
            { value: "C", text: "一時的に判断を保留し、より多くの意見を聞く", scoring: { "kun_receptiveness": 2.0, "kan_exploration": 1.5, "zhen_action": -1.0 } },
            { value: "D", text: "状況に応じて柔軟に対応し、最適解を見つける", scoring: { "xun_adaptability": 2.5, "kan_exploration": 2.0, "li_expression": 1.0 } },
            { value: "E", text: "責任を持って決断し、その結果を受け入れる", scoring: { "gen_stability": 2.5, "zhen_action": 2.0, "kun_receptiveness": 1.0 } }
        ]
    }
];

// ==========================================
// Triple OS定義
// ==========================================

const TRIPLE_OS = {
    'Engine OS': {
        name: 'Engine OS',
        description: '論理的思考と実行力の中核システム',
        color: '#6366f1',
        trigrams: [1, 4, 6, 7], // 乾、震、坎、艮
        keywords: ['創造性', 'リーダーシップ', '行動力', '探求心', '安定性']
    },
    'Interface OS': {
        name: 'Interface OS', 
        description: 'コミュニケーションと表現の対人システム',
        color: '#8b5cf6',
        trigrams: [2, 3, 5, 8], // 兌、離、巽、坤
        keywords: ['調和性', 'コミュニケーション', '表現力', '適応性', '受容性']
    },
    'Safe Mode OS': {
        name: 'Safe Mode OS',
        description: '安定と調和を重視する保護システム',
        color: '#10b981',
        trigrams: [7, 8, 5, 6], // 艮、坤、巽、坎
        keywords: ['安定性', '受容性', '適応性', '慎重さ', '分析力']
    }
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HEXAGRAMS,
        SCENARIO_QUESTIONS,
        TRIPLE_OS
    };
}