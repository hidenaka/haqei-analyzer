/**
 * 設定バージョン管理システム
 * 
 * 設定の変更履歴を管理し、再現性を保証する
 */

class ConfigVersionManager {
    constructor() {
        // 現在のバージョン
        this.CURRENT_VERSION = "2.1.0";
        this.RELEASE_DATE = "2025-01-11";
        
        // バージョン履歴
        this.VERSION_HISTORY = [
            {
                version: "2.1.0",
                date: "2025-01-11",
                changes: {
                    matrix: "64卦マトリクス転置修正",
                    normalization: "適用順序明文化",
                    description: "専門家フィードバック対応完了"
                },
                config: this.getConfig_v2_1_0()
            },
            {
                version: "2.0.0",
                date: "2025-01-10",
                changes: {
                    normalization: "Softmax正規化導入",
                    confidence: "多指標統合評価",
                    description: "第二次改善実装"
                },
                config: this.getConfig_v2_0_0()
            },
            {
                version: "1.0.0",
                date: "2025-01-08",
                changes: {
                    initial: "初期リリース",
                    description: "Z-score+ReLU正規化"
                },
                config: this.getConfig_v1_0_0()
            }
        ];
        
        // アクティブな設定
        this.activeConfig = null;
        this.loadLatestConfig();
    }
    
    /**
     * バージョン2.1.0の設定
     */
    getConfig_v2_1_0() {
        return {
            // 基本設定
            bagua: {
                order: ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"],
                names: {
                    "乾": "天", "兌": "沢", "離": "火", "震": "雷",
                    "巽": "風", "坎": "水", "艮": "山", "坤": "地"
                }
            },
            
            // 正規化設定
            normalization: {
                defaultMode: "softmax",
                applicationOrder: [
                    "raw_input",
                    "preprocessing",
                    "os_weights",
                    "normalization",
                    "final_adjustment"
                ],
                softmax: {
                    temperature: 1.2,
                    minTemperature: 0.1,
                    maxTemperature: 5.0
                },
                flatness: {
                    threshold: 1e-9,
                    preferUniformOnFlat: true
                },
                epsilon: 1e-6
            },
            
            // OS重み
            osWeights: {
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
            },
            
            // 確信度設定
            confidence: {
                method: "calibrated",
                thresholds: {
                    high: 0.75,
                    medium: 0.45
                },
                scoreWeights: {
                    gap: 0.4,
                    entropy: 0.3,
                    topRatio: 0.3
                },
                calibration: {
                    intercept: -2.5,
                    coefficients: {
                        gap: 8.5,
                        entropy: -3.2,
                        topRatio: 2.1
                    }
                }
            },
            
            // マトリクス設定
            matrix: {
                type: "corrected",
                indexing: "[upper][lower]",
                validated: true
            }
        };
    }
    
    /**
     * バージョン2.0.0の設定
     */
    getConfig_v2_0_0() {
        const config = this.getConfig_v2_1_0();
        // 2.0.0では転置前のマトリクスを使用
        config.matrix.type = "original";
        config.matrix.indexing = "[lower][upper]";  // 実際の動作
        config.matrix.validated = false;
        return config;
    }
    
    /**
     * バージョン1.0.0の設定
     */
    getConfig_v1_0_0() {
        return {
            bagua: {
                order: ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"]
            },
            normalization: {
                defaultMode: "zrelu",
                applicationOrder: [
                    "raw_input",
                    "z_score",
                    "relu",
                    "l1_normalize"
                ]
            },
            confidence: {
                method: "simple",
                thresholds: {
                    high: 0.15,
                    medium: 0.08
                }
            }
        };
    }
    
    /**
     * 最新設定をロード
     */
    loadLatestConfig() {
        this.activeConfig = this.VERSION_HISTORY[0].config;
        this.activeVersion = this.VERSION_HISTORY[0].version;
        console.log(`✅ Config v${this.activeVersion} loaded`);
    }
    
    /**
     * 特定バージョンをロード
     */
    loadVersion(version) {
        const versionEntry = this.VERSION_HISTORY.find(v => v.version === version);
        
        if (!versionEntry) {
            throw new Error(`Version ${version} not found`);
        }
        
        this.activeConfig = versionEntry.config;
        this.activeVersion = version;
        console.log(`✅ Config v${version} loaded`);
        
        return this.activeConfig;
    }
    
    /**
     * 設定の差分を取得
     */
    getDifferences(version1, version2) {
        const config1 = this.getConfigByVersion(version1);
        const config2 = this.getConfigByVersion(version2);
        
        const differences = [];
        
        // 正規化モードの変更
        if (config1.normalization.defaultMode !== config2.normalization.defaultMode) {
            differences.push({
                field: "normalization.defaultMode",
                from: config1.normalization.defaultMode,
                to: config2.normalization.defaultMode
            });
        }
        
        // マトリクスインデックスの変更
        if (config1.matrix?.indexing !== config2.matrix?.indexing) {
            differences.push({
                field: "matrix.indexing",
                from: config1.matrix?.indexing || "undefined",
                to: config2.matrix?.indexing || "undefined"
            });
        }
        
        // 温度パラメータの変更
        const temp1 = config1.normalization.softmax?.temperature;
        const temp2 = config2.normalization.softmax?.temperature;
        if (temp1 !== temp2) {
            differences.push({
                field: "softmax.temperature",
                from: temp1 || "N/A",
                to: temp2 || "N/A"
            });
        }
        
        return differences;
    }
    
    /**
     * バージョンによる設定取得
     */
    getConfigByVersion(version) {
        const entry = this.VERSION_HISTORY.find(v => v.version === version);
        return entry ? entry.config : null;
    }
    
    /**
     * 設定のエクスポート（再現性のため）
     */
    exportConfig() {
        return {
            version: this.activeVersion,
            timestamp: new Date().toISOString(),
            config: this.activeConfig,
            checksum: this.calculateChecksum(this.activeConfig)
        };
    }
    
    /**
     * 設定のインポート
     */
    importConfig(exportedConfig) {
        // チェックサム検証
        const calculatedChecksum = this.calculateChecksum(exportedConfig.config);
        if (calculatedChecksum !== exportedConfig.checksum) {
            console.warn("⚠️ Checksum mismatch - config may have been modified");
        }
        
        this.activeConfig = exportedConfig.config;
        this.activeVersion = exportedConfig.version;
        
        console.log(`✅ Config v${exportedConfig.version} imported`);
        return true;
    }
    
    /**
     * チェックサム計算（簡易版）
     */
    calculateChecksum(config) {
        const str = JSON.stringify(config);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    
    /**
     * マイグレーション支援
     */
    migrateConfig(fromVersion, toVersion) {
        console.log(`🔄 Migrating from v${fromVersion} to v${toVersion}`);
        
        const migrations = [];
        
        // 1.0.0 → 2.0.0
        if (fromVersion === "1.0.0" && toVersion >= "2.0.0") {
            migrations.push({
                action: "Change normalization",
                from: "Z-score+ReLU",
                to: "Softmax"
            });
        }
        
        // 2.0.0 → 2.1.0
        if (fromVersion === "2.0.0" && toVersion >= "2.1.0") {
            migrations.push({
                action: "Fix matrix indexing",
                from: "[lower][upper]",
                to: "[upper][lower]"
            });
        }
        
        return migrations;
    }
    
    /**
     * 設定検証
     */
    validateConfig(config = null) {
        const target = config || this.activeConfig;
        const errors = [];
        const warnings = [];
        
        // 必須フィールドチェック
        if (!target.bagua?.order) {
            errors.push("Missing bagua.order");
        }
        
        if (!target.normalization?.defaultMode) {
            errors.push("Missing normalization.defaultMode");
        }
        
        // 温度パラメータ範囲チェック
        const temp = target.normalization?.softmax?.temperature;
        if (temp !== undefined) {
            if (temp <= 0) {
                errors.push("Temperature must be positive");
            }
            if (temp < 0.1) {
                warnings.push("Very low temperature may cause instability");
            }
            if (temp > 5.0) {
                warnings.push("Very high temperature produces uniform distribution");
            }
        }
        
        // 重み合計チェック
        if (target.confidence?.scoreWeights) {
            const sum = Object.values(target.confidence.scoreWeights)
                .reduce((a, b) => a + b, 0);
            if (Math.abs(sum - 1.0) > 1e-6) {
                warnings.push(`Score weights sum to ${sum}, not 1.0`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 変更履歴の表示
     */
    showHistory() {
        console.log("\n=== Configuration Version History ===\n");
        
        this.VERSION_HISTORY.forEach(entry => {
            console.log(`Version ${entry.version} (${entry.date})`);
            console.log(`  ${entry.changes.description}`);
            
            if (entry.version === this.activeVersion) {
                console.log(`  ⭐ Currently Active`);
            }
            console.log("");
        });
    }
    
    /**
     * A/Bテスト用の設定生成
     */
    generateABTestConfigs() {
        const configs = [];
        
        // 温度パラメータのバリエーション
        [1.0, 1.2, 1.5, 2.0].forEach(temperature => {
            const config = JSON.parse(JSON.stringify(this.activeConfig));
            config.normalization.softmax.temperature = temperature;
            config.testId = `temp_${temperature}`;
            configs.push(config);
        });
        
        // 正規化モードのバリエーション
        ['softmax', 'minmax', 'zrelu'].forEach(mode => {
            const config = JSON.parse(JSON.stringify(this.activeConfig));
            config.normalization.defaultMode = mode;
            config.testId = `mode_${mode}`;
            configs.push(config);
        });
        
        return configs;
    }
}

// 単体テスト
function testConfigVersionManager() {
    console.log("=== Config Version Manager Test ===\n");
    
    const manager = new ConfigVersionManager();
    
    // 1. バージョン履歴表示
    manager.showHistory();
    
    // 2. 現在の設定検証
    console.log("Current Config Validation:");
    const validation = manager.validateConfig();
    console.log(`  Valid: ${validation.valid ? "✅" : "❌"}`);
    if (validation.warnings.length > 0) {
        console.log(`  Warnings: ${validation.warnings.join(", ")}`);
    }
    console.log("");
    
    // 3. バージョン間の差分
    console.log("Differences between v2.0.0 and v2.1.0:");
    const diffs = manager.getDifferences("2.0.0", "2.1.0");
    diffs.forEach(diff => {
        console.log(`  ${diff.field}: ${diff.from} → ${diff.to}`);
    });
    console.log("");
    
    // 4. マイグレーション情報
    console.log("Migration from v1.0.0 to v2.1.0:");
    const migrations = manager.migrateConfig("1.0.0", "2.1.0");
    migrations.forEach(m => {
        console.log(`  ${m.action}: ${m.from} → ${m.to}`);
    });
    console.log("");
    
    // 5. エクスポート/インポート
    console.log("Export/Import Test:");
    const exported = manager.exportConfig();
    console.log(`  Exported v${exported.version} with checksum: ${exported.checksum}`);
    
    manager.loadVersion("1.0.0");
    console.log(`  Switched to v${manager.activeVersion}`);
    
    manager.importConfig(exported);
    console.log(`  Re-imported v${manager.activeVersion}`);
    
    console.log("\n✅ All tests completed");
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfigVersionManager };
}

console.log('設定バージョン管理システムが準備されました');
console.log('testConfigVersionManager() でテストを実行できます');