// Historical Figures Database
// 歴史上の人物例データベース（プライバシーに配慮した参考例）

const HistoricalFiguresDatabase = {
    // 各64卦に対応する歴史上の人物例
    // プライバシー配慮：故人のみ、広く知られた歴史的事実のみを記載
    figures: {
        1: { // 乾為天
            examples: [
                {
                    name: "織田信長",
                    era: "戦国時代",
                    traits: ["強いリーダーシップ", "革新的思考", "果断な決断力"],
                    description: "天下統一への強い意志と革新的な戦略で知られる戦国武将",
                    osPattern: "強力なエンジンOS",
                    note: "※一般的に知られた歴史的評価に基づく参考例です"
                }
            ]
        },
        2: { // 坤為地
            examples: [
                {
                    name: "徳川家康",
                    era: "戦国〜江戸時代",
                    traits: ["忍耐力", "包容力", "安定性重視"],
                    description: "長期的視野と安定志向で江戸幕府を築いた創始者",
                    osPattern: "安定したエンジンOS",
                    note: "※一般的に知られた歴史的評価に基づく参考例です"
                }
            ]
        },
        3: { // 水雷屯
            examples: [
                {
                    name: "坂本龍馬",
                    era: "幕末",
                    traits: ["新しい時代への適応", "困難を乗り越える力", "変革への意志"],
                    description: "激動の時代に新しい道筋を見出した志士",
                    osPattern: "変革期対応OS",
                    note: "※一般的に知られた歴史的評価に基づく参考例です"
                }
            ]
        },
        11: { // 地天泰
            examples: [
                {
                    name: "聖徳太子",
                    era: "飛鳥時代",
                    traits: ["調和", "平和主義", "文化振興"],
                    description: "平和と調和を重視し、文化の発展に貢献した政治家",
                    osPattern: "調和重視OS",
                    note: "※一般的に知られた歴史的評価に基づく参考例です"
                }
            ]
        },
        49: { // 沢火革
            examples: [
                {
                    name: "明治天皇",
                    era: "明治時代",
                    traits: ["変革のリーダーシップ", "近代化への対応", "国家統合"],
                    description: "日本の近代化を象徴する変革期の指導者",
                    osPattern: "変革推進OS",
                    note: "※一般的に知られた歴史的評価に基づく参考例です"
                }
            ]
        }
    },

    // OSタイプ別の傾向分析
    osTypeAnalysis: {
        "creative_leader": {
            description: "創造的リーダータイプ",
            hexagrams: [1, 14, 34, 43],
            traits: ["独創性", "リーダーシップ", "決断力", "変革力"],
            examples: ["織田信長", "ナポレオン", "アレクサンダー大王"]
        },
        "stable_builder": {
            description: "安定構築タイプ",
            hexagrams: [2, 8, 15, 52],
            traits: ["忍耐力", "組織力", "安定性", "持続力"],
            examples: ["徳川家康", "武田信玄", "毛利元就"]
        },
        "adaptive_innovator": {
            description: "適応革新タイプ",
            hexagrams: [3, 17, 32, 42],
            traits: ["適応力", "革新性", "柔軟性", "成長志向"],
            examples: ["坂本龍馬", "勝海舟", "福沢諭吉"]
        },
        "harmonious_mediator": {
            description: "調和仲裁タイプ",
            hexagrams: [11, 19, 46, 61],
            traits: ["調和性", "仲裁力", "包容力", "平和志向"],
            examples: ["聖徳太子", "藤原道長", "北条政子"]
        }
    },

    // 相性パターンの歴史例
    compatibilityExamples: {
        "synergy_pairs": [
            {
                pair: "織田信長 × 豊臣秀吉",
                pattern: "創造リーダー × 適応実行者",
                description: "革新的ビジョンと優れた実行力の組み合わせで大きな成果を生んだ例",
                compatibility_type: "SYNERGY"
            },
            {
                pair: "徳川家康 × 本多正信",
                pattern: "安定構築者 × 戦略参謀",
                description: "長期安定志向と戦略的思考の組み合わせで持続的成功を収めた例",
                compatibility_type: "HARMONY"
            }
        ],
        "tension_pairs": [
            {
                pair: "織田信長 × 明智光秀",
                pattern: "革新リーダー × 慎重思考者",
                description: "異なるアプローチの衝突が悲劇的結果を招いた例",
                compatibility_type: "CONFLICT"
            }
        ]
    },

    // 検索機能
    searchByHexagram(hexagramId) {
        return this.figures[hexagramId] || null;
    },

    searchByOSType(osType) {
        const analysis = this.osTypeAnalysis[osType];
        if (!analysis) return null;
        
        const result = {
            ...analysis,
            detailedExamples: []
        };
        
        // 関連する64卦の人物例を収集
        analysis.hexagrams.forEach(hexagramId => {
            const figure = this.figures[hexagramId];
            if (figure) {
                result.detailedExamples.push(...figure.examples);
            }
        });
        
        return result;
    },

    getCompatibilityExamples(compatibilityType) {
        const examples = [];
        
        if (compatibilityType === 'SYNERGY' || compatibilityType === 'HARMONY') {
            examples.push(...this.compatibilityExamples.synergy_pairs);
        }
        
        if (compatibilityType === 'CONFLICT' || compatibilityType === 'TENSION') {
            examples.push(...this.compatibilityExamples.tension_pairs);
        }
        
        return examples.filter(ex => ex.compatibility_type === compatibilityType);
    },

    // プライバシー配慮のガイドライン
    getPrivacyGuidelines() {
        return {
            policy: "プライバシー保護方針",
            guidelines: [
                "故人のみを対象とし、現存する個人の情報は含まない",
                "広く知られた歴史的事実のみを記載",
                "個人の人格や価値観を断定的に評価しない",
                "あくまで一般的に知られた特徴の参考例として提示",
                "利用者の診断結果と直接関連付けない"
            ],
            disclaimer: "これらの例は、OSパターンの理解を助ける参考として提示されており、個人の評価や判断の根拠として使用されるものではありません。"
        };
    },

    // ランダム例取得（多様性確保）
    getRandomExample() {
        const allFigures = [];
        Object.values(this.figures).forEach(figureGroup => {
            allFigures.push(...figureGroup.examples);
        });
        
        const randomIndex = Math.floor(Math.random() * allFigures.length);
        return allFigures[randomIndex];
    },

    // 教育的コンテンツ生成
    generateEducationalContent(hexagramId) {
        const figure = this.searchByHexagram(hexagramId);
        if (!figure) {
            return {
                message: "この64卦に対応する参考例は現在準備中です",
                suggestion: "OSパターンの特徴から、あなた自身の強みと成長ポイントを考えてみましょう"
            };
        }
        
        const example = figure.examples[0];
        return {
            title: `参考例：${example.name}（${example.era}）`,
            description: example.description,
            traits: example.traits,
            learningPoints: [
                "この例から学べる強みの活かし方",
                "現代に応用できる行動パターン",
                "あなた自身の特徴との共通点を探してみましょう"
            ],
            disclaimer: example.note
        };
    }
};

// エクスポート（モジュール対応）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoricalFiguresDatabase;
} else if (typeof window !== 'undefined') {
    window.HistoricalFiguresDatabase = HistoricalFiguresDatabase;
}