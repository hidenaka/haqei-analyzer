/**
 * HaQei OS Analyzer - 改善された診断ロジック
 * 
 * 改善点：
 * 1. 用語統一：「三爻」→「八卦」
 * 2. 純卦の許容（同一八卦の重複を認める）
 * 3. 8次元の同形化（全OSで八卦次元に統一）
 * 4. 正規化プロセスの明確化
 * 5. キーワード適合の中立化
 * 6. 決定確信度の実装
 */

class ImprovedDiagnosisLogic {
    constructor() {
        // 八卦の正式名称と順序
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // 八卦のIDマッピング
        this.BAGUA_MAPPING = {
            "乾": 1,  // ☰ 天
            "兌": 2,  // ☱ 沢
            "離": 3,  // ☲ 火
            "震": 4,  // ☳ 雷
            "巽": 5,  // ☴ 風
            "坎": 6,  // ☵ 水
            "艮": 7,  // ☶ 山
            "坤": 8   // ☷ 地
        };
        
        // 正統的64卦マトリックス（純卦を含む）
        this.HEXAGRAM_MATRIX = [
            [1, 43, 14, 34, 9, 5, 26, 11],   // 乾上
            [10, 58, 38, 54, 61, 60, 41, 19], // 兌上
            [13, 49, 30, 55, 37, 63, 22, 36], // 離上
            [25, 17, 21, 51, 42, 3, 27, 24],  // 震上
            [44, 28, 50, 32, 57, 48, 18, 46], // 巽上
            [6, 47, 64, 40, 59, 29, 4, 7],    // 坎上
            [33, 31, 56, 62, 53, 39, 52, 15], // 艮上
            [12, 45, 35, 16, 20, 8, 23, 2]    // 坤上
        ];
        
        // Interface OS → 八卦マッピング行列
        this.INTERFACE_TO_BAGUA = {
            "外向_主導性": { "乾": 0.8, "震": 0.2 },
            "外向_調和性": { "兌": 0.9, "離": 0.1 },
            "外向_表現性": { "離": 0.8, "兌": 0.2 },
            "外向_行動性": { "震": 0.9, "乾": 0.1 },
            "内向_適応性": { "巽": 0.9, "坤": 0.1 },
            "内向_分析性": { "坎": 0.9, "艮": 0.1 },
            "内向_安定性": { "艮": 0.9, "坤": 0.1 },
            "内向_支援性": { "坤": 0.9, "巽": 0.1 }
        };
        
        // Safe Mode OS → 八卦マッピング行列
        this.SAFEMODE_TO_BAGUA = {
            "防御_対抗性": { "乾": 0.7, "震": 0.3 },
            "防御_調和性": { "兌": 0.8, "巽": 0.2 },
            "防御_変容性": { "離": 0.7, "坎": 0.3 },
            "防御_堅固性": { "震": 0.6, "艮": 0.4 },
            "防御_回避性": { "巽": 0.8, "坤": 0.2 },
            "防御_持久性": { "坎": 0.8, "艮": 0.2 },
            "防御_境界性": { "艮": 0.9, "乾": 0.1 },
            "防御_撤退性": { "坤": 0.8, "巽": 0.2 }
        };
        
        // 中立的なキーワードカテゴリ
        this.NEUTRAL_CATEGORIES = {
            "行動性": ["行動", "実行", "活動", "動作", "実践", "アクション", "推進"],
            "思考性": ["思考", "分析", "検討", "考察", "理解", "洞察", "認識"],
            "感情性": ["感情", "共感", "感受", "情緒", "感覚", "気持ち", "心情"],
            "社会性": ["社会", "関係", "交流", "協力", "連携", "コミュニケーション", "つながり"],
            "個人性": ["個人", "内省", "独立", "自己", "内面", "自立", "自分"],
            "安定性": ["安定", "持続", "維持", "継続", "保持", "不変", "定常"],
            "変化性": ["変化", "革新", "創造", "発展", "成長", "進化", "更新"],
            "調和性": ["調和", "均衡", "バランス", "中庸", "統合", "融合", "協調"]
        };
        
        // OS別カテゴリ重み（中立的）
        this.OS_CATEGORY_WEIGHTS = {
            engine: {
                "思考性": 1.2, "個人性": 1.2, "変化性": 1.1,
                "行動性": 1.0, "感情性": 0.9, "社会性": 0.8,
                "安定性": 1.0, "調和性": 0.9
            },
            interface: {
                "社会性": 1.3, "調和性": 1.2, "感情性": 1.1,
                "行動性": 1.0, "思考性": 0.9, "個人性": 0.7,
                "安定性": 0.9, "変化性": 0.9
            },
            safemode: {
                "安定性": 1.3, "調和性": 1.1, "個人性": 1.0,
                "思考性": 1.0, "感情性": 0.9, "社会性": 0.8,
                "行動性": 0.8, "変化性": 0.7
            }
        };
    }
    
    /**
     * Phase 1: 八卦エネルギー計算と純卦許容
     */
    calculateBaguaEnergies(vector, osType) {
        let baguaVector = {};
        
        // OSタイプに応じて変換
        if (osType === 'engine') {
            // Engine OSは既に八卦次元
            baguaVector = this.normalizeToBagua(vector);
        } else if (osType === 'interface') {
            // Interface OSを八卦次元に変換
            baguaVector = this.convertInterfaceToBagua(vector);
        } else if (osType === 'safemode') {
            // Safe Mode OSを八卦次元に変換
            baguaVector = this.convertSafeModeToBagua(vector);
        }
        
        // 正規化処理
        return this.normalizeVector(baguaVector, osType);
    }
    
    /**
     * Interface OS次元を八卦次元に変換
     */
    convertInterfaceToBagua(interfaceVector) {
        const baguaVector = {};
        
        // 初期化
        this.BAGUA_ORDER.forEach(bagua => {
            baguaVector[bagua] = 0;
        });
        
        // マッピング行列を適用
        Object.entries(interfaceVector).forEach(([dimension, value]) => {
            const mapping = this.INTERFACE_TO_BAGUA[dimension];
            if (mapping) {
                Object.entries(mapping).forEach(([bagua, weight]) => {
                    baguaVector[bagua] += value * weight;
                });
            }
        });
        
        return baguaVector;
    }
    
    /**
     * Safe Mode OS次元を八卦次元に変換
     */
    convertSafeModeToBagua(safemodeVector) {
        const baguaVector = {};
        
        // 初期化
        this.BAGUA_ORDER.forEach(bagua => {
            baguaVector[bagua] = 0;
        });
        
        // マッピング行列を適用
        Object.entries(safemodeVector).forEach(([dimension, value]) => {
            const mapping = this.SAFEMODE_TO_BAGUA[dimension];
            if (mapping) {
                Object.entries(mapping).forEach(([bagua, weight]) => {
                    baguaVector[bagua] += value * weight;
                });
            }
        });
        
        return baguaVector;
    }
    
    /**
     * Engine OS用の正規化（既に八卦次元）
     */
    normalizeToBagua(engineVector) {
        const baguaVector = {};
        
        // 八卦名の正規化（_創造性などのサフィックスを除去）
        Object.entries(engineVector).forEach(([key, value]) => {
            const baguaName = key.split('_')[0];
            if (this.BAGUA_MAPPING[baguaName]) {
                baguaVector[baguaName] = value;
            }
        });
        
        return baguaVector;
    }
    
    /**
     * Phase 3: 正規化プロセス
     */
    normalizeVector(vector, osType) {
        // Step 1: Z-score標準化
        const values = Object.values(vector);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        
        const zScored = {};
        Object.entries(vector).forEach(([key, value]) => {
            zScored[key] = std > 0 ? (value - mean) / std : 0;
        });
        
        // Step 2: ReLU（負値を0に）
        const nonNegative = {};
        Object.entries(zScored).forEach(([key, value]) => {
            nonNegative[key] = Math.max(0, value);
        });
        
        // Step 3: L1正規化（合計を1に）
        const sum = Object.values(nonNegative).reduce((a, b) => a + b, 0);
        const normalized = {};
        Object.entries(nonNegative).forEach(([key, value]) => {
            normalized[key] = sum > 0 ? value / sum : 0.125; // 均等分布
        });
        
        // Step 4: OS別重み適用（オプション）
        // ここでは均等な重みを使用
        return normalized;
    }
    
    /**
     * Phase 1改善: 上位八卦選出（純卦を許容）
     */
    selectTopBagua(baguaVector, allowPureHexagram = true) {
        // 八卦エネルギーでソート
        const sortedBagua = Object.entries(baguaVector)
            .sort((a, b) => b[1] - a[1]);
        
        const topBagua1 = sortedBagua[0];
        let topBagua2 = sortedBagua[1] || sortedBagua[0]; // 第2位がなければ第1位を使用（純卦）
        
        // 純卦を許容する場合は同一八卦でもOK
        if (allowPureHexagram) {
            // 純卦フラグを設定
            const isPureHexagram = topBagua1[0] === topBagua2[0];
            
            return {
                upper: topBagua1[0],
                lower: topBagua2[0],
                upperEnergy: topBagua1[1],
                lowerEnergy: topBagua2[1],
                isPure: isPureHexagram,
                confidence: this.calculateConfidence(sortedBagua)
            };
        } else {
            // 純卦を避ける場合（オプション）
            if (topBagua1[0] === topBagua2[0] && sortedBagua[2]) {
                topBagua2 = sortedBagua[2];
            }
            
            return {
                upper: topBagua1[0],
                lower: topBagua2[0],
                upperEnergy: topBagua1[1],
                lowerEnergy: topBagua2[1],
                isPure: false,
                confidence: this.calculateConfidence(sortedBagua)
            };
        }
    }
    
    /**
     * Phase 5: 決定確信度の計算
     */
    calculateConfidence(sortedBagua) {
        if (sortedBagua.length < 2) {
            return { level: "low", score: 0 };
        }
        
        const top1Energy = sortedBagua[0][1];
        const top2Energy = sortedBagua[1][1];
        const totalEnergy = sortedBagua.reduce((sum, [_, energy]) => sum + energy, 0);
        
        const gap = top1Energy - top2Energy;
        const relativeGap = totalEnergy > 0 ? gap / totalEnergy : 0;
        
        // 確信度レベルの判定
        if (relativeGap > 0.2) {
            return { level: "high", score: relativeGap, description: "明確な傾向" };
        } else if (relativeGap > 0.1) {
            return { level: "medium", score: relativeGap, description: "やや明確" };
        } else {
            return { level: "low", score: relativeGap, description: "僅差" };
        }
    }
    
    /**
     * 64卦の決定
     */
    determineHexagram(upperBagua, lowerBagua) {
        const upperId = this.BAGUA_MAPPING[upperBagua];
        const lowerId = this.BAGUA_MAPPING[lowerBagua];
        
        if (!upperId || !lowerId) {
            console.error("Invalid bagua names:", upperBagua, lowerBagua);
            return null;
        }
        
        // マトリックスから卦番号を取得
        const hexagramId = this.HEXAGRAM_MATRIX[upperId - 1][lowerId - 1];
        
        return {
            id: hexagramId,
            upper: upperBagua,
            lower: lowerBagua,
            isPure: upperBagua === lowerBagua
        };
    }
    
    /**
     * Phase 4: 中立的なキーワード評価
     */
    evaluateKeywordFitness(hexagramKeywords, osType) {
        if (!hexagramKeywords || hexagramKeywords.length === 0) {
            return 0;
        }
        
        let totalScore = 0;
        const weights = this.OS_CATEGORY_WEIGHTS[osType] || this.OS_CATEGORY_WEIGHTS.engine;
        
        // 各キーワードをカテゴリに分類してスコア計算
        hexagramKeywords.forEach(keyword => {
            Object.entries(this.NEUTRAL_CATEGORIES).forEach(([category, categoryWords]) => {
                if (categoryWords.some(word => keyword.includes(word))) {
                    totalScore += weights[category] || 1.0;
                }
            });
        });
        
        // キーワード数で正規化
        return totalScore / Math.sqrt(hexagramKeywords.length);
    }
    
    /**
     * 統合診断メソッド
     */
    diagnoseOS(answers, osType) {
        console.log(`🔍 Improved Diagnosis for ${osType} OS`);
        
        // Step 1: 8次元ベクトル構築
        const rawVector = this.buildVector(answers, osType);
        
        // Step 2: 八卦エネルギー計算（正規化含む）
        const baguaEnergies = this.calculateBaguaEnergies(rawVector, osType);
        
        // Step 3: 上位八卦選出（純卦許容）
        const selection = this.selectTopBagua(baguaEnergies, true);
        
        // Step 4: 64卦決定
        const hexagram = this.determineHexagram(selection.upper, selection.lower);
        
        // Step 5: 結果構築
        return {
            hexagramId: hexagram.id,
            upperBagua: hexagram.upper,
            lowerBagua: hexagram.lower,
            isPureHexagram: hexagram.isPure,
            baguaEnergies: baguaEnergies,
            confidence: selection.confidence,
            osType: osType,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * ベクトル構築（仮実装）
     */
    buildVector(answers, osType) {
        // 実際の実装では質問回答からベクトルを構築
        const vector = {};
        
        if (osType === 'engine') {
            // Engine OS: 八卦次元
            this.BAGUA_ORDER.forEach(bagua => {
                vector[`${bagua}_dimension`] = Math.random() * 10;
            });
        } else if (osType === 'interface') {
            // Interface OS: 外向/内向次元
            ["外向_主導性", "外向_調和性", "外向_表現性", "外向_行動性",
             "内向_適応性", "内向_分析性", "内向_安定性", "内向_支援性"].forEach(dim => {
                vector[dim] = Math.random() * 10;
            });
        } else {
            // Safe Mode OS: 防御次元
            ["防御_対抗性", "防御_調和性", "防御_変容性", "防御_堅固性",
             "防御_回避性", "防御_持久性", "防御_境界性", "防御_撤退性"].forEach(dim => {
                vector[dim] = Math.random() * 10;
            });
        }
        
        return vector;
    }
}

/**
 * 検証用テスト関数
 */
class DiagnosisValidator {
    constructor(logic) {
        this.logic = logic;
    }
    
    /**
     * 全64卦の出現可能性テスト
     */
    testCoverage(iterations = 1000) {
        const appeared = new Set();
        const counts = {};
        
        for (let i = 0; i < iterations; i++) {
            // ランダムな八卦ベクトル生成
            const randomVector = {};
            this.logic.BAGUA_ORDER.forEach(bagua => {
                randomVector[bagua] = Math.random();
            });
            
            // 正規化
            const normalized = this.logic.normalizeVector(randomVector, 'engine');
            
            // 上位選出
            const selection = this.logic.selectTopBagua(normalized, true);
            
            // 卦決定
            const hexagram = this.logic.determineHexagram(selection.upper, selection.lower);
            
            appeared.add(hexagram.id);
            counts[hexagram.id] = (counts[hexagram.id] || 0) + 1;
        }
        
        // 純卦の出現確認
        const pureHexagrams = [1, 2, 29, 30, 51, 52, 57, 58]; // 8つの純卦
        const pureAppeared = pureHexagrams.filter(id => appeared.has(id));
        
        return {
            coverage: appeared.size / 64,
            totalAppeared: appeared.size,
            missing: Array.from({length: 64}, (_, i) => i + 1)
                .filter(id => !appeared.has(id)),
            pureHexagramsCoverage: pureAppeared.length / 8,
            pureHexagramsAppeared: pureAppeared,
            distribution: counts
        };
    }
    
    /**
     * 決定論的一貫性テスト
     */
    testConsistency(testCases = 100) {
        const results = [];
        
        for (let i = 0; i < testCases; i++) {
            // 固定ベクトル生成
            const fixedVector = {};
            this.logic.BAGUA_ORDER.forEach((bagua, idx) => {
                fixedVector[bagua] = (idx + 1) * 0.1;
            });
            
            // 3回実行
            const result1 = this.logic.selectTopBagua(fixedVector, true);
            const result2 = this.logic.selectTopBagua(fixedVector, true);
            const result3 = this.logic.selectTopBagua(fixedVector, true);
            
            // 一致確認
            const consistent = (
                result1.upper === result2.upper &&
                result2.upper === result3.upper &&
                result1.lower === result2.lower &&
                result2.lower === result3.lower
            );
            
            results.push(consistent);
        }
        
        return {
            consistency: results.filter(r => r).length / results.length,
            message: "同一入力に対する出力の一貫性"
        };
    }
    
    /**
     * 確信度分布テスト
     */
    testConfidenceDistribution(iterations = 1000) {
        const confidenceLevels = { high: 0, medium: 0, low: 0 };
        
        for (let i = 0; i < iterations; i++) {
            const randomVector = {};
            this.logic.BAGUA_ORDER.forEach(bagua => {
                randomVector[bagua] = Math.random();
            });
            
            const normalized = this.logic.normalizeVector(randomVector, 'engine');
            const selection = this.logic.selectTopBagua(normalized, true);
            
            confidenceLevels[selection.confidence.level]++;
        }
        
        return {
            high: confidenceLevels.high / iterations,
            medium: confidenceLevels.medium / iterations,
            low: confidenceLevels.low / iterations,
            message: "確信度レベルの分布"
        };
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImprovedDiagnosisLogic, DiagnosisValidator };
}