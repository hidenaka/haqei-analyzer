/**
 * Phase 4: キーワード適合の中立化
 * 
 * 価値判断を含まない中立的なキーワード評価システム
 * 各OSの特性に応じた公平な評価を実現
 */

class NeutralKeywordSystem {
    constructor() {
        // 中立的なキーワードカテゴリ定義
        // 価値判断（良い/悪い）を含まない純粋な特性分類
        this.NEUTRAL_CATEGORIES = {
            // 行動特性
            "action_oriented": {
                keywords: ["行動", "実行", "活動", "動作", "実践", "推進", "着手", "遂行"],
                description: "行動志向的特性"
            },
            
            // 思考特性
            "thought_oriented": {
                keywords: ["思考", "分析", "検討", "考察", "理解", "洞察", "認識", "判断"],
                description: "思考志向的特性"
            },
            
            // 感情特性
            "emotion_oriented": {
                keywords: ["感情", "共感", "感受", "情緒", "感覚", "気持ち", "心情", "情動"],
                description: "感情志向的特性"
            },
            
            // 社会特性
            "social_oriented": {
                keywords: ["社会", "関係", "交流", "協力", "連携", "対話", "交渉", "調整"],
                description: "社会志向的特性"
            },
            
            // 個人特性
            "individual_oriented": {
                keywords: ["個人", "内省", "独立", "自己", "内面", "自立", "独自", "単独"],
                description: "個人志向的特性"
            },
            
            // 安定特性
            "stability_oriented": {
                keywords: ["安定", "持続", "維持", "継続", "保持", "不変", "定常", "恒常"],
                description: "安定志向的特性"
            },
            
            // 変化特性
            "change_oriented": {
                keywords: ["変化", "革新", "創造", "発展", "成長", "進化", "更新", "改革"],
                description: "変化志向的特性"
            },
            
            // 調和特性
            "harmony_oriented": {
                keywords: ["調和", "均衡", "バランス", "中庸", "統合", "融合", "協調", "共存"],
                description: "調和志向的特性"
            },
            
            // 構造特性
            "structure_oriented": {
                keywords: ["構造", "体系", "組織", "秩序", "規則", "枠組み", "システム", "形式"],
                description: "構造志向的特性"
            },
            
            // 流動特性
            "fluidity_oriented": {
                keywords: ["流動", "柔軟", "適応", "変通", "融通", "自在", "流れ", "可変"],
                description: "流動志向的特性"
            },
            
            // 強度特性
            "intensity_oriented": {
                keywords: ["強度", "力", "勢い", "強さ", "威力", "影響", "圧力", "エネルギー"],
                description: "強度志向的特性"
            },
            
            // 緩和特性
            "moderation_oriented": {
                keywords: ["緩和", "穏やか", "優しさ", "柔らか", "和らぎ", "軽減", "緩慢", "温和"],
                description: "緩和志向的特性"
            }
        };
        
        // OS別カテゴリ適合度（1.0が標準、高いほど重要）
        this.OS_CATEGORY_AFFINITY = {
            engine: {
                // Engine OS: 内的価値観と創造性を重視
                "action_oriented": 1.0,
                "thought_oriented": 1.3,
                "emotion_oriented": 0.8,
                "social_oriented": 0.7,
                "individual_oriented": 1.4,
                "stability_oriented": 0.9,
                "change_oriented": 1.2,
                "harmony_oriented": 0.8,
                "structure_oriented": 1.1,
                "fluidity_oriented": 0.9,
                "intensity_oriented": 1.1,
                "moderation_oriented": 0.7
            },
            interface: {
                // Interface OS: 対人関係と社会性を重視
                "action_oriented": 1.0,
                "thought_oriented": 0.8,
                "emotion_oriented": 1.2,
                "social_oriented": 1.5,
                "individual_oriented": 0.6,
                "stability_oriented": 0.9,
                "change_oriented": 0.9,
                "harmony_oriented": 1.3,
                "structure_oriented": 0.8,
                "fluidity_oriented": 1.1,
                "intensity_oriented": 0.8,
                "moderation_oriented": 1.1
            },
            safemode: {
                // Safe Mode OS: 防御と安定を重視
                "action_oriented": 0.7,
                "thought_oriented": 1.0,
                "emotion_oriented": 0.9,
                "social_oriented": 0.8,
                "individual_oriented": 1.1,
                "stability_oriented": 1.4,
                "change_oriented": 0.6,
                "harmony_oriented": 1.1,
                "structure_oriented": 1.2,
                "fluidity_oriented": 0.8,
                "intensity_oriented": 0.9,
                "moderation_oriented": 1.2
            }
        };
        
        // 八卦とカテゴリの親和性マッピング
        this.BAGUA_CATEGORY_MAPPING = {
            "乾": {
                // 天：創造、リーダーシップ
                "action_oriented": 1.2,
                "thought_oriented": 1.0,
                "change_oriented": 1.1,
                "intensity_oriented": 1.3,
                "individual_oriented": 1.1
            },
            "兌": {
                // 沢：喜び、交流
                "social_oriented": 1.3,
                "emotion_oriented": 1.2,
                "harmony_oriented": 1.2,
                "moderation_oriented": 1.1
            },
            "離": {
                // 火：明晰、表現
                "thought_oriented": 1.2,
                "change_oriented": 1.1,
                "intensity_oriented": 1.0,
                "action_oriented": 1.0
            },
            "震": {
                // 雷：行動、瞬発力
                "action_oriented": 1.4,
                "change_oriented": 1.2,
                "intensity_oriented": 1.2
            },
            "巽": {
                // 風：柔軟、適応
                "fluidity_oriented": 1.4,
                "harmony_oriented": 1.1,
                "social_oriented": 1.0,
                "moderation_oriented": 1.0
            },
            "坎": {
                // 水：洞察、流動
                "thought_oriented": 1.3,
                "fluidity_oriented": 1.2,
                "emotion_oriented": 1.1
            },
            "艮": {
                // 山：安定、境界
                "stability_oriented": 1.4,
                "structure_oriented": 1.3,
                "individual_oriented": 1.2
            },
            "坤": {
                // 地：受容、支援
                "stability_oriented": 1.2,
                "harmony_oriented": 1.3,
                "social_oriented": 1.1,
                "moderation_oriented": 1.2
            }
        };
    }
    
    /**
     * キーワードをカテゴリに分類
     */
    categorizeKeywords(keywords) {
        const categorization = {};
        
        // 各カテゴリの初期化
        Object.keys(this.NEUTRAL_CATEGORIES).forEach(category => {
            categorization[category] = 0;
        });
        
        // キーワードをカテゴリに分類
        keywords.forEach(keyword => {
            Object.entries(this.NEUTRAL_CATEGORIES).forEach(([category, config]) => {
                // 部分一致でカテゴリ判定
                if (config.keywords.some(catKeyword => 
                    keyword.includes(catKeyword) || catKeyword.includes(keyword))) {
                    categorization[category]++;
                }
            });
        });
        
        // 正規化（キーワード数で除算）
        const totalKeywords = keywords.length || 1;
        Object.keys(categorization).forEach(category => {
            categorization[category] = categorization[category] / totalKeywords;
        });
        
        return categorization;
    }
    
    /**
     * 中立的なキーワード適合度計算
     */
    calculateNeutralFitness(hexagramKeywords, upperBagua, lowerBagua, osType) {
        if (!hexagramKeywords || hexagramKeywords.length === 0) {
            return { score: 0.5, details: {} }; // デフォルト中立スコア
        }
        
        // Step 1: キーワードのカテゴリ分類
        const categorization = this.categorizeKeywords(hexagramKeywords);
        
        // Step 2: OS別の重み付け適用
        const osAffinity = this.OS_CATEGORY_AFFINITY[osType] || 
                          this.OS_CATEGORY_AFFINITY.engine;
        
        let weightedScore = 0;
        let totalWeight = 0;
        const categoryScores = {};
        
        Object.entries(categorization).forEach(([category, ratio]) => {
            const weight = osAffinity[category] || 1.0;
            const score = ratio * weight;
            
            categoryScores[category] = {
                ratio: ratio,
                weight: weight,
                score: score
            };
            
            weightedScore += score;
            totalWeight += weight;
        });
        
        // Step 3: 八卦との親和性を考慮
        const baguaBonus = this.calculateBaguaAffinity(
            categorization, upperBagua, lowerBagua
        );
        
        // Step 4: 最終スコア計算（0-1の範囲に正規化）
        const baseScore = totalWeight > 0 ? weightedScore / totalWeight : 0.5;
        const finalScore = Math.min(1.0, baseScore * (1 + baguaBonus));
        
        return {
            score: finalScore,
            details: {
                categories: categoryScores,
                baguaBonus: baguaBonus,
                osType: osType,
                keywordCount: hexagramKeywords.length
            }
        };
    }
    
    /**
     * 八卦とカテゴリの親和性計算
     */
    calculateBaguaAffinity(categorization, upperBagua, lowerBagua) {
        let affinity = 0;
        
        // 上卦の親和性
        const upperMapping = this.BAGUA_CATEGORY_MAPPING[upperBagua] || {};
        Object.entries(categorization).forEach(([category, ratio]) => {
            const weight = upperMapping[category] || 1.0;
            affinity += ratio * weight * 0.5; // 上卦は50%の影響
        });
        
        // 下卦の親和性
        const lowerMapping = this.BAGUA_CATEGORY_MAPPING[lowerBagua] || {};
        Object.entries(categorization).forEach(([category, ratio]) => {
            const weight = lowerMapping[category] || 1.0;
            affinity += ratio * weight * 0.5; // 下卦は50%の影響
        });
        
        // 0.0-0.2の範囲でボーナスを返す
        return Math.min(0.2, affinity - 1.0);
    }
    
    /**
     * キーワードの多様性評価
     */
    evaluateDiversity(keywords) {
        if (!keywords || keywords.length === 0) {
            return { diversity: 0, uniqueCount: 0 };
        }
        
        // ユニークなキーワード数
        const uniqueKeywords = new Set(keywords);
        const uniqueCount = uniqueKeywords.size;
        
        // カテゴリの分散度
        const categorization = this.categorizeKeywords(keywords);
        const activeCategories = Object.values(categorization)
            .filter(ratio => ratio > 0).length;
        
        // 多様性スコア（0-1）
        const diversity = activeCategories / Object.keys(this.NEUTRAL_CATEGORIES).length;
        
        return {
            diversity: diversity,
            uniqueCount: uniqueCount,
            activeCategories: activeCategories,
            totalCategories: Object.keys(this.NEUTRAL_CATEGORIES).length
        };
    }
}

// テスト関数
function testNeutralKeywordSystem() {
    const system = new NeutralKeywordSystem();
    
    console.log("=== Phase 4: 中立的キーワードシステムテスト ===\n");
    
    // テストケース1: Engine OS向けキーワード
    console.log("【テスト1: Engine OS】");
    const engineKeywords = ["創造", "思考", "分析", "独立", "革新", "構造"];
    const engineResult = system.calculateNeutralFitness(
        engineKeywords, "乾", "離", "engine"
    );
    console.log("キーワード:", engineKeywords);
    console.log("適合度スコア:", engineResult.score.toFixed(3));
    console.log("詳細:", engineResult.details);
    
    // テストケース2: Interface OS向けキーワード
    console.log("\n【テスト2: Interface OS】");
    const interfaceKeywords = ["交流", "協力", "調和", "対話", "共感", "関係"];
    const interfaceResult = system.calculateNeutralFitness(
        interfaceKeywords, "兌", "巽", "interface"
    );
    console.log("キーワード:", interfaceKeywords);
    console.log("適合度スコア:", interfaceResult.score.toFixed(3));
    console.log("詳細:", interfaceResult.details);
    
    // テストケース3: Safe Mode OS向けキーワード
    console.log("\n【テスト3: Safe Mode OS】");
    const safemodeKeywords = ["安定", "維持", "構造", "境界", "持続", "秩序"];
    const safemodeResult = system.calculateNeutralFitness(
        safemodeKeywords, "艮", "坤", "safemode"
    );
    console.log("キーワード:", safemodeKeywords);
    console.log("適合度スコア:", safemodeResult.score.toFixed(3));
    console.log("詳細:", safemodeResult.details);
    
    // テストケース4: 多様性評価
    console.log("\n【テスト4: キーワード多様性】");
    const diverseKeywords = [
        "行動", "思考", "感情", "社会", "個人", 
        "安定", "変化", "調和", "構造", "流動"
    ];
    const diversity = system.evaluateDiversity(diverseKeywords);
    console.log("キーワード数:", diverseKeywords.length);
    console.log("多様性評価:", diversity);
    
    // カテゴリ分類の確認
    console.log("\n【カテゴリ分類確認】");
    const testKeywords = ["創造的思考", "社会的協調", "感情的安定"];
    const categorization = system.categorizeKeywords(testKeywords);
    console.log("テストキーワード:", testKeywords);
    console.log("カテゴリ分類結果:");
    Object.entries(categorization).forEach(([category, ratio]) => {
        if (ratio > 0) {
            console.log(`  ${category}: ${(ratio * 100).toFixed(1)}%`);
        }
    });
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NeutralKeywordSystem };
}

console.log('Phase 4: 中立的キーワードシステムが準備されました。');
console.log('testNeutralKeywordSystem() を実行してテストしてください。');