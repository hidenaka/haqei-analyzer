/**
 * Phase 3: 正規化と重み付けの明確化
 * 
 * 透明で理論的に一貫した正規化プロセスの実装
 * Z-score → ReLU → L1正規化 → OS別重み付け
 */

class NormalizationSystem {
    constructor() {
        // 八卦の基本定義
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // OS別の八卦重み付け（各OSの特性に応じた重み）
        this.OS_WEIGHTS = {
            engine: {
                // Engine OS: 内的価値観を重視
                "乾": 1.2,  // 創造性・リーダーシップ重視
                "兌": 0.9,  // 交流は中程度
                "離": 1.1,  // 明晰性重視
                "震": 1.0,  // 行動性は標準
                "巽": 0.9,  // 柔軟性は中程度
                "坎": 1.1,  // 洞察力重視
                "艮": 1.0,  // 安定性は標準
                "坤": 0.8   // 受容性は低め
            },
            interface: {
                // Interface OS: 対人関係を重視
                "乾": 0.9,  // リーダーシップは中程度
                "兌": 1.3,  // 交流・調和を最重視
                "離": 1.1,  // 表現力重視
                "震": 1.0,  // 行動性は標準
                "巽": 1.1,  // 適応性重視
                "坎": 0.8,  // 深い洞察は低め
                "艮": 0.9,  // 安定性は中程度
                "坤": 1.0   // 支援性は標準
            },
            safemode: {
                // Safe Mode OS: 防御・安定を重視
                "乾": 1.0,  // 対抗性は標準
                "兌": 0.9,  // 調和は中程度
                "離": 0.8,  // 変化は低め
                "震": 0.9,  // 瞬発性は中程度
                "巽": 1.0,  // 回避・適応は標準
                "坎": 1.1,  // 忍耐重視
                "艮": 1.3,  // 境界・安定を最重視
                "坤": 1.1   // 受動的撤退重視
            }
        };
        
        // 正規化パラメータ
        this.NORMALIZATION_CONFIG = {
            // 最小値保証（各八卦が完全に0にならないように）
            MIN_ENERGY: 0.01,
            // 最大値制限（極端な偏りを防ぐ）
            MAX_ENERGY: 0.5,
            // スムージング係数（極端な値を緩和）
            SMOOTHING_FACTOR: 0.1
        };
    }
    
    /**
     * Step 1: Z-score標準化
     * 平均0、標準偏差1に標準化
     */
    zScoreNormalize(vector) {
        const values = Object.values(vector);
        const n = values.length;
        
        // 平均計算
        const mean = values.reduce((sum, val) => sum + val, 0) / n;
        
        // 分散計算
        const variance = values.reduce((sum, val) => 
            sum + Math.pow(val - mean, 2), 0) / n;
        
        // 標準偏差
        const std = Math.sqrt(variance);
        
        // Z-score変換
        const zScored = {};
        Object.entries(vector).forEach(([key, value]) => {
            if (std > 0) {
                zScored[key] = (value - mean) / std;
            } else {
                // 全値が同じ場合は0に
                zScored[key] = 0;
            }
        });
        
        console.log("📊 Z-score標準化完了:", {
            mean: mean.toFixed(3),
            std: std.toFixed(3),
            result: Object.entries(zScored).map(([k, v]) => 
                `${k}: ${v.toFixed(3)}`).join(", ")
        });
        
        return zScored;
    }
    
    /**
     * Step 2: ReLU活性化
     * 負の値を0に変換（ただし最小値保証付き）
     */
    reluActivation(vector) {
        const activated = {};
        const minEnergy = this.NORMALIZATION_CONFIG.MIN_ENERGY;
        
        Object.entries(vector).forEach(([key, value]) => {
            // ReLU: max(0, value) + 最小値保証
            activated[key] = Math.max(minEnergy, value);
        });
        
        console.log("⚡ ReLU活性化完了:", 
            Object.entries(activated).map(([k, v]) => 
                `${k}: ${v.toFixed(3)}`).join(", ")
        );
        
        return activated;
    }
    
    /**
     * Step 3: L1正規化
     * 合計を1に正規化
     */
    l1Normalize(vector) {
        const sum = Object.values(vector).reduce((a, b) => a + b, 0);
        const normalized = {};
        
        if (sum > 0) {
            Object.entries(vector).forEach(([key, value]) => {
                normalized[key] = value / sum;
            });
        } else {
            // 全値が0の場合は均等分布
            const uniformValue = 1.0 / this.BAGUA_ORDER.length;
            this.BAGUA_ORDER.forEach(bagua => {
                normalized[bagua] = uniformValue;
            });
        }
        
        // 最大値制限を適用
        const maxEnergy = this.NORMALIZATION_CONFIG.MAX_ENERGY;
        Object.entries(normalized).forEach(([key, value]) => {
            if (value > maxEnergy) {
                normalized[key] = maxEnergy;
            }
        });
        
        // 再正規化（最大値制限後）
        const newSum = Object.values(normalized).reduce((a, b) => a + b, 0);
        Object.keys(normalized).forEach(key => {
            normalized[key] = normalized[key] / newSum;
        });
        
        console.log("📐 L1正規化完了 (合計=" + 
            Object.values(normalized).reduce((a, b) => a + b, 0).toFixed(3) + ")");
        
        return normalized;
    }
    
    /**
     * Step 4: OS別重み付け
     * 各OSの特性に応じた重み付けを適用
     */
    applyOSWeights(vector, osType) {
        const weights = this.OS_WEIGHTS[osType] || this.OS_WEIGHTS.engine;
        const weighted = {};
        
        Object.entries(vector).forEach(([key, value]) => {
            const weight = weights[key] || 1.0;
            weighted[key] = value * weight;
        });
        
        // 重み付け後の再正規化
        const sum = Object.values(weighted).reduce((a, b) => a + b, 0);
        Object.keys(weighted).forEach(key => {
            weighted[key] = weighted[key] / sum;
        });
        
        console.log(`🎯 ${osType} OS重み付け完了`);
        
        return weighted;
    }
    
    /**
     * Step 5: スムージング（オプション）
     * 極端な値を緩和
     */
    smoothVector(vector) {
        const smoothingFactor = this.NORMALIZATION_CONFIG.SMOOTHING_FACTOR;
        const uniformValue = 1.0 / this.BAGUA_ORDER.length;
        const smoothed = {};
        
        Object.entries(vector).forEach(([key, value]) => {
            // 均等分布との加重平均
            smoothed[key] = value * (1 - smoothingFactor) + 
                           uniformValue * smoothingFactor;
        });
        
        // 最終正規化
        const sum = Object.values(smoothed).reduce((a, b) => a + b, 0);
        Object.keys(smoothed).forEach(key => {
            smoothed[key] = smoothed[key] / sum;
        });
        
        return smoothed;
    }
    
    /**
     * 統合正規化プロセス
     */
    normalizeVector(rawVector, osType, options = {}) {
        console.log(`\n=== 正規化プロセス開始 (${osType} OS) ===`);
        console.log("入力:", rawVector);
        
        // Step 1: Z-score標準化
        let normalized = this.zScoreNormalize(rawVector);
        
        // Step 2: ReLU活性化
        normalized = this.reluActivation(normalized);
        
        // Step 3: L1正規化
        normalized = this.l1Normalize(normalized);
        
        // Step 4: OS別重み付け
        normalized = this.applyOSWeights(normalized, osType);
        
        // Step 5: スムージング（オプション）
        if (options.smoothing) {
            normalized = this.smoothVector(normalized);
        }
        
        console.log("最終結果:", 
            Object.entries(normalized).map(([k, v]) => 
                `${k}: ${(v * 100).toFixed(1)}%`).join(", ")
        );
        console.log("=== 正規化プロセス完了 ===\n");
        
        return normalized;
    }
    
    /**
     * 正規化の妥当性検証
     */
    validateNormalization(vector) {
        const validation = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        // 合計チェック
        const sum = Object.values(vector).reduce((a, b) => a + b, 0);
        if (Math.abs(sum - 1.0) > 0.001) {
            validation.valid = false;
            validation.errors.push(`合計が1ではない: ${sum}`);
        }
        
        // 負値チェック
        Object.entries(vector).forEach(([key, value]) => {
            if (value < 0) {
                validation.valid = false;
                validation.errors.push(`負の値: ${key} = ${value}`);
            }
        });
        
        // 極端な偏りチェック
        const maxValue = Math.max(...Object.values(vector));
        if (maxValue > 0.6) {
            validation.warnings.push(`極端な偏り: 最大値 = ${maxValue}`);
        }
        
        // 多様性チェック
        const nonZeroCount = Object.values(vector)
            .filter(v => v > this.NORMALIZATION_CONFIG.MIN_ENERGY).length;
        if (nonZeroCount < 3) {
            validation.warnings.push(`多様性不足: 有効な八卦が${nonZeroCount}個のみ`);
        }
        
        return validation;
    }
}

// テスト関数
function testNormalizationSystem() {
    const system = new NormalizationSystem();
    
    console.log("=== Phase 3: 正規化システムテスト ===\n");
    
    // テストケース1: 極端に偏ったベクトル
    console.log("【テスト1: 極端に偏ったベクトル】");
    const extremeVector = {
        "乾": 100,
        "兌": 5,
        "離": 3,
        "震": 2,
        "巽": 1,
        "坎": 1,
        "艮": 0.5,
        "坤": 0.5
    };
    
    const normalized1 = system.normalizeVector(extremeVector, 'engine');
    const validation1 = system.validateNormalization(normalized1);
    console.log("検証結果:", validation1);
    
    // テストケース2: 均等なベクトル
    console.log("\n【テスト2: 均等なベクトル】");
    const uniformVector = {
        "乾": 1,
        "兌": 1,
        "離": 1,
        "震": 1,
        "巽": 1,
        "坎": 1,
        "艮": 1,
        "坤": 1
    };
    
    const normalized2 = system.normalizeVector(uniformVector, 'interface');
    const validation2 = system.validateNormalization(normalized2);
    console.log("検証結果:", validation2);
    
    // テストケース3: スムージング適用
    console.log("\n【テスト3: スムージング適用】");
    const normalized3 = system.normalizeVector(extremeVector, 'safemode', { smoothing: true });
    const validation3 = system.validateNormalization(normalized3);
    console.log("検証結果:", validation3);
    
    // OS別重み付けの効果確認
    console.log("\n【OS別重み付けの効果】");
    const testVector = {
        "乾": 10, "兌": 10, "離": 10, "震": 10,
        "巽": 10, "坎": 10, "艮": 10, "坤": 10
    };
    
    ['engine', 'interface', 'safemode'].forEach(osType => {
        const result = system.normalizeVector(testVector, osType);
        const top3 = Object.entries(result)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([k, v]) => `${k}(${(v * 100).toFixed(1)}%)`);
        console.log(`${osType} OS 上位3: ${top3.join(", ")}`);
    });
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NormalizationSystem };
}

console.log('Phase 3: 正規化システムが準備されました。');
console.log('testNormalizationSystem() を実行してテストしてください。');