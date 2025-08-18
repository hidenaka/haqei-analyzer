/**
 * 上下卦の向き選択ロジック
 * 
 * 純卦でない場合、両向きで語彙スコアを計算し、
 * より適合度の高い方を選択
 */

class DirectionSelectionLogic {
    constructor(neutralKeywordSystem, config) {
        this.keywordSystem = neutralKeywordSystem;
        this.config = config || CONFIG;
        this.H384_DATA = null; // 実際のデータベースを設定
    }
    
    /**
     * 最適な上下卦の向きを選択
     */
    selectOptimalDirection(bagua1, bagua2, osType, h384Data) {
        // 純卦の場合は向きの選択不要
        if (bagua1 === bagua2) {
            return {
                upper: bagua1,
                lower: bagua2,
                isPureHexagram: true,
                selectionReason: "純卦のため向き固定"
            };
        }
        
        // 両方向のスコアを計算
        const direction1 = this.evaluateDirection(bagua1, bagua2, osType, h384Data);
        const direction2 = this.evaluateDirection(bagua2, bagua1, osType, h384Data);
        
        // スコアが高い方を選択
        if (direction1.totalScore >= direction2.totalScore) {
            return {
                upper: bagua1,
                lower: bagua2,
                isPureHexagram: false,
                score: direction1.totalScore,
                alternativeScore: direction2.totalScore,
                selectionReason: direction1.reason,
                details: direction1
            };
        } else {
            return {
                upper: bagua2,
                lower: bagua1,
                isPureHexagram: false,
                score: direction2.totalScore,
                alternativeScore: direction1.totalScore,
                selectionReason: direction2.reason,
                details: direction2
            };
        }
    }
    
    /**
     * 特定の向きでの評価
     */
    evaluateDirection(upperBagua, lowerBagua, osType, h384Data) {
        // 卦番号を取得
        const hexagramId = this.getHexagramId(upperBagua, lowerBagua);
        
        // キーワードを取得（実際のH384データから）
        const keywords = this.extractKeywords(hexagramId, h384Data);
        
        // 中立的キーワード評価
        let keywordScore = 0;
        if (this.keywordSystem && keywords.length > 0) {
            const evaluation = this.keywordSystem.calculateNeutralFitness(
                keywords, 
                upperBagua, 
                lowerBagua, 
                osType
            );
            keywordScore = evaluation.score;
        }
        
        // 八卦の特性による追加評価
        const baguaAffinityScore = this.calculateBaguaAffinity(
            upperBagua, 
            lowerBagua, 
            osType
        );
        
        // 総合スコア（重み付け）
        const totalScore = keywordScore * 0.7 + baguaAffinityScore * 0.3;
        
        return {
            hexagramId: hexagramId,
            keywordScore: keywordScore,
            baguaAffinityScore: baguaAffinityScore,
            totalScore: totalScore,
            keywords: keywords,
            reason: this.generateSelectionReason(
                upperBagua, 
                lowerBagua, 
                keywordScore, 
                baguaAffinityScore
            )
        };
    }
    
    /**
     * 卦番号取得（統一API）
     */
    getHexagramId(upperBagua, lowerBagua) {
        const CORRECT_HEXAGRAM_MATRIX = [
            [1,  43, 14, 34,  9,  5, 26, 11],
            [10, 58, 38, 54, 61, 60, 41, 19],
            [13, 49, 30, 55, 37, 63, 22, 36],
            [25, 17, 21, 51, 42,  3, 27, 24],
            [44, 28, 50, 32, 57, 48, 18, 46],
            [6,  47, 64, 40, 59, 29,  4,  7],
            [33, 31, 56, 62, 53, 39, 52, 15],
            [12, 45, 35, 16, 20,  8, 23,  2]
        ];
        
        const upperIndex = this.config.BAGUA_ORDER.indexOf(upperBagua);
        const lowerIndex = this.config.BAGUA_ORDER.indexOf(lowerBagua);
        
        if (upperIndex === -1 || lowerIndex === -1) {
            throw new Error(`Invalid bagua: upper=${upperBagua}, lower=${lowerBagua}`);
        }
        
        return CORRECT_HEXAGRAM_MATRIX[upperIndex][lowerIndex];
    }
    
    /**
     * キーワード抽出（仮実装）
     */
    extractKeywords(hexagramId, h384Data) {
        if (!h384Data) {
            // テスト用のダミーデータ
            const testKeywords = {
                1: ["創造", "リーダーシップ", "天", "純粋", "始まり"],
                14: ["豊かさ", "大いなる所有", "火", "天", "明朗"],
                28: ["大いなる過ぎ", "臨界", "柔軟", "慎重", "バランス"],
                // ... 他の卦
            };
            return testKeywords[hexagramId] || [];
        }
        
        // 実際のH384データから抽出
        const keywords = [];
        h384Data.forEach(entry => {
            if (entry.hexagramId === hexagramId && entry.keyword) {
                keywords.push(entry.keyword);
            }
        });
        
        return keywords;
    }
    
    /**
     * 八卦親和性スコア計算
     */
    calculateBaguaAffinity(upperBagua, lowerBagua, osType) {
        // OS別の八卦重み
        const osWeights = this.config.OS_WEIGHTS[osType] || this.config.OS_WEIGHTS.engine;
        
        // 上卦と下卦の重みの平均
        const upperWeight = osWeights[upperBagua] || 1.0;
        const lowerWeight = osWeights[lowerBagua] || 1.0;
        
        // 正規化（0-1範囲）
        const avgWeight = (upperWeight + lowerWeight) / 2;
        const normalized = (avgWeight - 0.8) / (1.3 - 0.8); // Min=0.8, Max=1.3と仮定
        
        return Math.max(0, Math.min(1, normalized));
    }
    
    /**
     * 選択理由の生成
     */
    generateSelectionReason(upperBagua, lowerBagua, keywordScore, affinityScore) {
        const reasons = [];
        
        if (keywordScore > 0.7) {
            reasons.push("キーワード適合度が高い");
        }
        
        if (affinityScore > 0.7) {
            reasons.push(`${upperBagua}/${lowerBagua}の組み合わせがOSに適合`);
        }
        
        if (reasons.length === 0) {
            reasons.push("標準的な適合度");
        }
        
        return reasons.join("、");
    }
}

// テスト関数
function testDirectionSelection() {
    console.log("=== 上下卦の向き選択テスト ===\n");
    
    // ダミーのキーワードシステム
    const mockKeywordSystem = {
        calculateNeutralFitness: (keywords, upper, lower, osType) => {
            // 簡易スコア計算
            const score = keywords.length * 0.1 + Math.random() * 0.5;
            return { score: Math.min(1, score) };
        }
    };
    
    const selector = new DirectionSelectionLogic(mockKeywordSystem, CONFIG);
    
    // テストケース1: 純卦
    console.log("【ケース1: 純卦】");
    const pureResult = selector.selectOptimalDirection("乾", "乾", "engine", null);
    console.log(`結果: ${pureResult.upper}/${pureResult.lower}`);
    console.log(`理由: ${pureResult.selectionReason}\n`);
    
    // テストケース2: 通常卦（乾と離）
    console.log("【ケース2: 通常卦（乾/離）】");
    const normalResult1 = selector.selectOptimalDirection("乾", "離", "engine", null);
    console.log(`結果: ${normalResult1.upper}/${normalResult1.lower}`);
    console.log(`スコア: ${normalResult1.score?.toFixed(3)}`);
    console.log(`代替スコア: ${normalResult1.alternativeScore?.toFixed(3)}`);
    console.log(`理由: ${normalResult1.selectionReason}\n`);
    
    // テストケース3: Interface OS用
    console.log("【ケース3: Interface OS（兌/巽）】");
    const interfaceResult = selector.selectOptimalDirection("兌", "巽", "interface", null);
    console.log(`結果: ${interfaceResult.upper}/${interfaceResult.lower}`);
    console.log(`スコア: ${interfaceResult.score?.toFixed(3)}`);
    console.log(`理由: ${interfaceResult.selectionReason}\n`);
    
    // 100ケースの自動検証
    console.log("【100ケース自動検証】");
    let reversalCount = 0;
    const baguaList = CONFIG.BAGUA_ORDER;
    
    for (let i = 0; i < 100; i++) {
        // ランダムに2つの八卦を選択
        const idx1 = Math.floor(Math.random() * 8);
        const idx2 = Math.floor(Math.random() * 8);
        
        if (idx1 === idx2) continue; // 純卦はスキップ
        
        const bagua1 = baguaList[idx1];
        const bagua2 = baguaList[idx2];
        
        const result = selector.selectOptimalDirection(bagua1, bagua2, "engine", null);
        
        // 順序が入れ替わったかチェック
        if (result.upper === bagua2 && result.lower === bagua1) {
            reversalCount++;
        }
    }
    
    console.log(`入れ替え発生率: ${reversalCount}%`);
    console.log("（約50%前後が期待値）");
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DirectionSelectionLogic };
}

console.log('上下卦の向き選択ロジックが準備されました。');
console.log('testDirectionSelection() でテストを実行できます。');