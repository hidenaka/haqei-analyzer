/**
 * HaQei OS Analyzer 統一設定モジュール
 * 
 * 単一ソースとして管理される設定と定数
 * Version: 2.0.0
 */

class UnifiedConfiguration {
    constructor() {
        // バージョン管理
        this.CONFIG_VERSION = "2.0.0";
        this.LAST_UPDATED = "2025-08-11";
        
        // ======================
        // 1. 八卦順序（単一ソース）
        // ======================
        this.BAGUA_ORDER = Object.freeze([
            "乾",  // 1: 天 (Heaven)
            "兌",  // 2: 沢 (Lake)
            "離",  // 3: 火 (Fire)
            "震",  // 4: 雷 (Thunder)
            "巽",  // 5: 風 (Wind)
            "坎",  // 6: 水 (Water)
            "艮",  // 7: 山 (Mountain)
            "坤"   // 8: 地 (Earth)
        ]);
        
        // ======================
        // 2. 正規化設定
        // ======================
        this.NORMALIZATION_CONFIG = {
            // デフォルトモード
            defaultMode: "softmax",
            
            // Softmax設定
            softmax: {
                temperature: 1.2,        // 推奨値
                minTemperature: 0.1,     // 最小値（検証用）
                maxTemperature: 5.0      // 最大値（検証用）
            },
            
            // 適用順序の明確化
            applicationOrder: [
                "raw_input",
                "preprocessing",
                "os_weights",           // OS重みを先に適用
                "normalization",        // その後に正規化
                "final_adjustment"
            ],
            
            // 平坦性判定
            flatness: {
                threshold: 1e-9,        // 近接判定の閾値
                preferUniformOnFlat: true
            },
            
            // 最小値保証
            epsilon: 1e-6
        };
        
        // ======================
        // 3. 確信度設定
        // ======================
        this.CONFIDENCE_CONFIG = {
            // 閾値（実データで調整予定）
            thresholds: {
                high: 0.15,      // 暫定値
                medium: 0.08,    // 暫定値
                calibrationNote: "These values are provisional and should be optimized with actual data"
            },
            
            // 統合スコア計算の重み
            scoreWeights: {
                gap: 0.4,        // top1-top2差の重み
                entropy: 0.3,    // エントロピーの重み
                topRatio: 0.3    // top1/top2比の重み
            },
            
            // キャリブレーション設定
            calibration: {
                method: "logistic",  // ロジスティック回帰
                outputRange: [0, 1]  // 0-1に正規化
            }
        };
        
        // ======================
        // 4. Interface OS マッピング行列
        // ======================
        this.INTERFACE_TO_BAGUA = Object.freeze({
            "外向_主導性": { "乾": 0.8, "震": 0.2 },  // 合計: 1.0
            "外向_調和性": { "兌": 0.9, "離": 0.1 },  // 合計: 1.0
            "外向_表現性": { "離": 0.8, "兌": 0.2 },  // 合計: 1.0
            "外向_行動性": { "震": 0.9, "乾": 0.1 },  // 合計: 1.0
            "内向_適応性": { "巽": 0.9, "坤": 0.1 },  // 合計: 1.0
            "内向_分析性": { "坎": 0.9, "艮": 0.1 },  // 合計: 1.0
            "内向_安定性": { "艮": 0.9, "坤": 0.1 },  // 合計: 1.0
            "内向_支援性": { "坤": 0.9, "巽": 0.1 }   // 合計: 1.0
        });
        
        // ======================
        // 5. Safe Mode OS マッピング行列
        // ======================
        this.SAFEMODE_TO_BAGUA = Object.freeze({
            "防御_対抗性": { "乾": 0.7, "震": 0.3 },  // 合計: 1.0
            "防御_調和性": { "兌": 0.8, "巽": 0.2 },  // 合計: 1.0
            "防御_変容性": { "離": 0.7, "坎": 0.3 },  // 合計: 1.0
            "防御_堅固性": { "震": 0.6, "艮": 0.4 },  // 合計: 1.0
            "防御_回避性": { "巽": 0.8, "坤": 0.2 },  // 合計: 1.0
            "防御_持久性": { "坎": 0.8, "艮": 0.2 },  // 合計: 1.0
            "防御_境界性": { "艮": 0.9, "乾": 0.1 },  // 合計: 1.0
            "防御_撤退性": { "坤": 0.8, "巽": 0.2 }   // 合計: 1.0
        });
        
        // ======================
        // 6. OS別重み付け
        // ======================
        this.OS_WEIGHTS = Object.freeze({
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
        });
        
        // ======================
        // 7. デバッグ設定
        // ======================
        this.DEBUG_CONFIG = {
            enabled: false,
            logLevel: "info",  // "error", "warn", "info", "debug", "trace"
            logIntermediateVectors: false,
            logNormalizationSteps: false,
            logConfidenceDetails: false
        };
    }
    
    /**
     * マッピング行列の正則性チェック
     */
    validateMappingMatrices() {
        const results = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        // Interface OS行列チェック
        Object.entries(this.INTERFACE_TO_BAGUA).forEach(([dimension, mapping]) => {
            const sum = Object.values(mapping).reduce((a, b) => a + b, 0);
            if (Math.abs(sum - 1.0) > 1e-6) {
                results.valid = false;
                results.errors.push(`Interface dimension "${dimension}" sum is ${sum}, expected 1.0`);
            }
        });
        
        // Safe Mode OS行列チェック
        Object.entries(this.SAFEMODE_TO_BAGUA).forEach(([dimension, mapping]) => {
            const sum = Object.values(mapping).reduce((a, b) => a + b, 0);
            if (Math.abs(sum - 1.0) > 1e-6) {
                results.valid = false;
                results.errors.push(`SafeMode dimension "${dimension}" sum is ${sum}, expected 1.0`);
            }
        });
        
        // 未定義の八卦チェック
        const validBagua = new Set(this.BAGUA_ORDER);
        [this.INTERFACE_TO_BAGUA, this.SAFEMODE_TO_BAGUA].forEach((matrix, idx) => {
            const matrixName = idx === 0 ? "Interface" : "SafeMode";
            Object.values(matrix).forEach(mapping => {
                Object.keys(mapping).forEach(bagua => {
                    if (!validBagua.has(bagua)) {
                        results.valid = false;
                        results.errors.push(`${matrixName} matrix contains invalid bagua: "${bagua}"`);
                    }
                });
            });
        });
        
        return results;
    }
    
    /**
     * 設定のバリデーション
     */
    validateConfiguration() {
        const results = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        // 温度パラメータのチェック
        const temp = this.NORMALIZATION_CONFIG.softmax.temperature;
        if (temp <= 0) {
            results.valid = false;
            results.errors.push(`Invalid temperature: ${temp} (must be > 0)`);
        }
        
        // 確信度重みの合計チェック
        const weightSum = Object.values(this.CONFIDENCE_CONFIG.scoreWeights)
            .reduce((a, b) => a + b, 0);
        if (Math.abs(weightSum - 1.0) > 1e-6) {
            results.warnings.push(`Confidence weights sum to ${weightSum}, not 1.0`);
        }
        
        // マッピング行列の検証
        const matrixValidation = this.validateMappingMatrices();
        if (!matrixValidation.valid) {
            results.valid = false;
            results.errors.push(...matrixValidation.errors);
        }
        
        return results;
    }
    
    /**
     * 設定情報の取得
     */
    getConfigInfo() {
        return {
            version: this.CONFIG_VERSION,
            lastUpdated: this.LAST_UPDATED,
            baguaOrder: this.BAGUA_ORDER,
            normalizationMode: this.NORMALIZATION_CONFIG.defaultMode,
            temperature: this.NORMALIZATION_CONFIG.softmax.temperature,
            confidenceThresholds: this.CONFIDENCE_CONFIG.thresholds,
            debugEnabled: this.DEBUG_CONFIG.enabled
        };
    }
    
    /**
     * JSONエクスポート（バージョン管理用）
     */
    exportConfig() {
        return JSON.stringify({
            version: this.CONFIG_VERSION,
            timestamp: new Date().toISOString(),
            config: {
                bagua: this.BAGUA_ORDER,
                normalization: this.NORMALIZATION_CONFIG,
                confidence: this.CONFIDENCE_CONFIG,
                interfaceMapping: this.INTERFACE_TO_BAGUA,
                safemodeMapping: this.SAFEMODE_TO_BAGUA,
                osWeights: this.OS_WEIGHTS
            }
        }, null, 2);
    }
}

// シングルトンインスタンス
const CONFIG = new UnifiedConfiguration();

// 初期検証
const validation = CONFIG.validateConfiguration();
if (!validation.valid) {
    console.error("❌ Configuration validation failed:");
    validation.errors.forEach(err => console.error(`  - ${err}`));
} else {
    console.log("✅ Configuration validation passed");
    if (validation.warnings.length > 0) {
        console.warn("⚠️ Warnings:");
        validation.warnings.forEach(warn => console.warn(`  - ${warn}`));
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedConfiguration, CONFIG };
}

console.log('統一設定モジュールが準備されました。');
console.log('CONFIG.getConfigInfo() で設定情報を確認できます。');