/**
 * 正規化のバイアス設計改善
 * Softmax版とZ-score+ReLU版の選択可能な実装
 */

class ImprovedNormalizationSystem {
    constructor() {
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // 正規化モードの設定
        this.NORMALIZATION_MODES = {
            ZRELU: "zrelu",        // 現行: Z-score → ReLU → L1
            SOFTMAX: "softmax",    // 新規: Softmax with temperature
            MINMAX: "minmax"       // 新規: Min-Max → ε加算
        };
        
        // デフォルト設定
        this.config = {
            mode: this.NORMALIZATION_MODES.SOFTMAX,
            temperature: 1.2,                  // Softmax温度パラメータ
            epsilon: 0.001,                    // 最小値保証
            preferUniformOnFlat: true,         // 平坦入力時に均等出力を優先
            applyOSWeights: true              // OS別重み付けを適用
        };
        
        // OS別重み付け（Phase 3と同じ）
        this.OS_WEIGHTS = {
            engine: {
                "乾": 1.2, "兌": 0.9, "離": 1.1, "震": 1.0,
                "巽": 0.9, "坎": 1.1, "艮": 1.0, "坤": 0.8
            },
            interface: {
                "乾": 0.9, "兌": 1.3, "離": 1.1, "震": 1.0,
                "巽": 1.1, "坎": 0.8, "艮": 0.9, "坤": 1.0
            },
            safemode: {
                "乾": 1.0, "兌": 0.9, "離": 0.8, "震": 0.9,
                "巽": 1.0, "坎": 1.1, "艮": 1.3, "坤": 1.1
            }
        };
    }
    
    /**
     * 統合正規化インターフェース
     */
    normalize(rawVector, osType = 'engine', options = {}) {
        // オプションのマージ
        const config = { ...this.config, ...options };
        
        // 平坦性チェック
        const isFlat = this.checkFlatness(rawVector);
        
        if (isFlat && config.preferUniformOnFlat) {
            console.log("📊 平坦入力検出 → 均等出力");
            return this.createUniformVector();
        }
        
        // 正規化モードに応じた処理
        let normalized;
        switch (config.mode) {
            case this.NORMALIZATION_MODES.SOFTMAX:
                normalized = this.softmaxNormalize(rawVector, config.temperature);
                break;
            case this.NORMALIZATION_MODES.MINMAX:
                normalized = this.minmaxNormalize(rawVector, config.epsilon);
                break;
            case this.NORMALIZATION_MODES.ZRELU:
            default:
                normalized = this.zreluNormalize(rawVector, config.epsilon);
                break;
        }
        
        // OS重み付け（オプション）
        if (config.applyOSWeights) {
            normalized = this.applyOSWeights(normalized, osType);
        }
        
        // 最終正規化（合計を1に）
        return this.finalNormalize(normalized);
    }
    
    /**
     * Softmax正規化（推奨）
     * 温度パラメータで分布の尖度を制御
     */
    softmaxNormalize(vector, temperature = 1.2) {
        console.log(`🔥 Softmax正規化 (τ=${temperature})`);
        
        const values = Object.values(vector);
        
        // 数値安定性のため最大値を引く
        const max = Math.max(...values);
        const shifted = values.map(v => v - max);
        
        // Softmax計算
        const expValues = shifted.map(v => Math.exp(v / temperature));
        const sumExp = expValues.reduce((a, b) => a + b, 0);
        
        const normalized = {};
        const keys = Object.keys(vector);
        keys.forEach((key, i) => {
            normalized[key] = expValues[i] / sumExp;
        });
        
        return normalized;
    }
    
    /**
     * Min-Max正規化
     * 0-1範囲に正規化後、ε加算で最小値保証
     */
    minmaxNormalize(vector, epsilon = 0.001) {
        console.log(`📏 Min-Max正規化 (ε=${epsilon})`);
        
        const values = Object.values(vector);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        
        const normalized = {};
        Object.entries(vector).forEach(([key, value]) => {
            if (range > 0) {
                // Min-Max正規化 + ε
                normalized[key] = ((value - min) / range) + epsilon;
            } else {
                // 全値が同じ場合
                normalized[key] = 1.0 / this.BAGUA_ORDER.length;
            }
        });
        
        return normalized;
    }
    
    /**
     * Z-score + ReLU正規化（従来版）
     */
    zreluNormalize(vector, minValue = 0.01) {
        console.log(`📊 Z-score+ReLU正規化 (min=${minValue})`);
        
        const values = Object.values(vector);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        
        const normalized = {};
        Object.entries(vector).forEach(([key, value]) => {
            const zScore = std > 0 ? (value - mean) / std : 0;
            normalized[key] = Math.max(minValue, zScore);
        });
        
        return normalized;
    }
    
    /**
     * 平坦性チェック
     * 全値の差が閾値以下かどうか
     */
    checkFlatness(vector, threshold = 0.001) {
        const values = Object.values(vector);
        const min = Math.min(...values);
        const max = Math.max(...values);
        return (max - min) < threshold;
    }
    
    /**
     * 均等ベクトル生成
     */
    createUniformVector() {
        const uniformValue = 1.0 / this.BAGUA_ORDER.length;
        const vector = {};
        this.BAGUA_ORDER.forEach(bagua => {
            vector[bagua] = uniformValue;
        });
        return vector;
    }
    
    /**
     * OS別重み付け適用
     */
    applyOSWeights(vector, osType) {
        const weights = this.OS_WEIGHTS[osType] || this.OS_WEIGHTS.engine;
        const weighted = {};
        
        Object.entries(vector).forEach(([key, value]) => {
            weighted[key] = value * (weights[key] || 1.0);
        });
        
        return weighted;
    }
    
    /**
     * 最終正規化（合計を1に）
     */
    finalNormalize(vector) {
        const sum = Object.values(vector).reduce((a, b) => a + b, 0);
        const normalized = {};
        
        if (sum > 0) {
            Object.entries(vector).forEach(([key, value]) => {
                normalized[key] = value / sum;
            });
        } else {
            return this.createUniformVector();
        }
        
        return normalized;
    }
    
    /**
     * 正規化の比較テスト
     */
    compareNormalizationMethods(testVector, osType = 'engine') {
        console.log("=== 正規化手法の比較 ===\n");
        console.log("入力ベクトル:", testVector);
        console.log("");
        
        const results = {};
        
        // 1. Softmax版
        results.softmax = this.normalize(testVector, osType, {
            mode: this.NORMALIZATION_MODES.SOFTMAX,
            temperature: 1.2
        });
        console.log("Softmax (τ=1.2):");
        this.printVector(results.softmax);
        
        // 2. Softmax版（高温）
        results.softmaxHigh = this.normalize(testVector, osType, {
            mode: this.NORMALIZATION_MODES.SOFTMAX,
            temperature: 2.0
        });
        console.log("\nSoftmax (τ=2.0, より均等):");
        this.printVector(results.softmaxHigh);
        
        // 3. Min-Max版
        results.minmax = this.normalize(testVector, osType, {
            mode: this.NORMALIZATION_MODES.MINMAX
        });
        console.log("\nMin-Max:");
        this.printVector(results.minmax);
        
        // 4. Z-score+ReLU版（従来）
        results.zrelu = this.normalize(testVector, osType, {
            mode: this.NORMALIZATION_MODES.ZRELU
        });
        console.log("\nZ-score+ReLU:");
        this.printVector(results.zrelu);
        
        // エントロピー計算（分布の尖度指標）
        console.log("\n=== エントロピー（分布の均等性） ===");
        Object.entries(results).forEach(([method, vector]) => {
            const entropy = this.calculateEntropy(vector);
            console.log(`${method}: ${entropy.toFixed(3)} (最大: ${Math.log(8).toFixed(3)})`);
        });
        
        return results;
    }
    
    /**
     * エントロピー計算
     */
    calculateEntropy(vector) {
        let entropy = 0;
        Object.values(vector).forEach(p => {
            if (p > 0) {
                entropy -= p * Math.log(p);
            }
        });
        return entropy;
    }
    
    /**
     * ベクトル表示用ヘルパー
     */
    printVector(vector) {
        const sorted = Object.entries(vector)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => `${k}: ${(v * 100).toFixed(1)}%`);
        console.log(sorted.join(", "));
    }
}

// テスト関数
function testNormalizationMethods() {
    const normalizer = new ImprovedNormalizationSystem();
    
    console.log("=== 正規化改善テスト ===\n");
    
    // テストケース1: 極端に偏ったベクトル
    console.log("【ケース1: 極端な偏り】");
    const extremeVector = {
        "乾": 100, "兌": 5, "離": 3, "震": 2,
        "巽": 1, "坎": 1, "艮": 0.5, "坤": 0.5
    };
    normalizer.compareNormalizationMethods(extremeVector, 'engine');
    
    // テストケース2: 均等なベクトル（平坦）
    console.log("\n【ケース2: 平坦入力】");
    const flatVector = {
        "乾": 1, "兌": 1, "離": 1, "震": 1,
        "巽": 1, "坎": 1, "艮": 1, "坤": 1
    };
    normalizer.compareNormalizationMethods(flatVector, 'interface');
    
    // テストケース3: 中程度の分散
    console.log("\n【ケース3: 中程度の分散】");
    const moderateVector = {
        "乾": 10, "兌": 8, "離": 6, "震": 5,
        "巽": 4, "坎": 3, "艮": 2, "坤": 1
    };
    normalizer.compareNormalizationMethods(moderateVector, 'safemode');
    
    // スケーリング不変性テスト
    console.log("\n【スケーリング不変性テスト】");
    const baseVector = { "乾": 10, "兌": 5, "離": 3, "震": 2, "巽": 1, "坎": 1, "艮": 1, "坤": 1 };
    const scaledVector = { "乾": 100, "兌": 50, "離": 30, "震": 20, "巽": 10, "坎": 10, "艮": 10, "坤": 10 };
    
    const baseResult = normalizer.normalize(baseVector, 'engine', { mode: 'softmax' });
    const scaledResult = normalizer.normalize(scaledVector, 'engine', { mode: 'softmax' });
    
    console.log("基準ベクトル結果:");
    normalizer.printVector(baseResult);
    console.log("10倍スケール結果:");
    normalizer.printVector(scaledResult);
    
    // 差分確認
    let maxDiff = 0;
    Object.keys(baseResult).forEach(key => {
        const diff = Math.abs(baseResult[key] - scaledResult[key]);
        maxDiff = Math.max(maxDiff, diff);
    });
    console.log(`最大差分: ${(maxDiff * 100).toFixed(3)}%`);
    console.log(maxDiff < 0.001 ? "✅ スケーリング不変性確認" : "❌ スケーリング不変性なし");
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImprovedNormalizationSystem };
}

console.log('改善された正規化システムが準備されました。');
console.log('testNormalizationMethods() を実行してテストしてください。');