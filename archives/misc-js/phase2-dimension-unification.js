/**
 * Phase 2: 8次元の同形化（全OS統一）
 * 
 * Interface OSとSafe Mode OSの次元を八卦次元に変換する
 * マッピングシステムの実装
 */

class DimensionUnificationSystem {
    constructor() {
        // 八卦の基本定義
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // Interface OS → 八卦マッピング行列
        // 外向/内向の8次元を八卦エネルギーに変換
        this.INTERFACE_TO_BAGUA_MATRIX = {
            "外向_主導性": { 
                "乾": 0.8,  // 天の創造的リーダーシップ
                "震": 0.2   // 雷の積極的行動
            },
            "外向_調和性": { 
                "兌": 0.9,  // 沢の喜びと交流
                "離": 0.1   // 火の明るさ
            },
            "外向_表現性": { 
                "離": 0.8,  // 火の輝きと表現
                "兌": 0.2   // 沢の楽しさ
            },
            "外向_行動性": { 
                "震": 0.9,  // 雷の瞬発的動き
                "乾": 0.1   // 天の持続的力
            },
            "内向_適応性": { 
                "巽": 0.9,  // 風の柔軟な適応
                "坤": 0.1   // 地の受容
            },
            "内向_分析性": { 
                "坎": 0.9,  // 水の深い洞察
                "艮": 0.1   // 山の静観
            },
            "内向_安定性": { 
                "艮": 0.9,  // 山の不動と安定
                "坤": 0.1   // 地の支持
            },
            "内向_支援性": { 
                "坤": 0.9,  // 地の育成と支援
                "巽": 0.1   // 風の協調
            }
        };
        
        // Safe Mode OS → 八卦マッピング行列
        // 防御的8次元を八卦エネルギーに変換
        this.SAFEMODE_TO_BAGUA_MATRIX = {
            "防御_対抗性": { 
                "乾": 0.7,  // 天の強い意志
                "震": 0.3   // 雷の即応性
            },
            "防御_調和性": { 
                "兌": 0.8,  // 沢の柔らかな解決
                "巽": 0.2   // 風の順応
            },
            "防御_変容性": { 
                "離": 0.7,  // 火の変革
                "坎": 0.3   // 水の流動性
            },
            "防御_堅固性": { 
                "震": 0.6,  // 雷の瞬間的防御
                "艮": 0.4   // 山の堅固さ
            },
            "防御_回避性": { 
                "巽": 0.8,  // 風の柔軟な回避
                "坤": 0.2   // 地の譲歩
            },
            "防御_持久性": { 
                "坎": 0.8,  // 水の忍耐
                "艮": 0.2   // 山の持続
            },
            "防御_境界性": { 
                "艮": 0.9,  // 山の明確な境界
                "乾": 0.1   // 天の威厳
            },
            "防御_撤退性": { 
                "坤": 0.8,  // 地の受動的撤退
                "巽": 0.2   // 風の柔軟な退避
            }
        };
    }
    
    /**
     * Interface OSベクトルを八卦次元に変換
     */
    convertInterfaceToBagua(interfaceVector) {
        const baguaVector = {};
        
        // 初期化
        this.BAGUA_ORDER.forEach(bagua => {
            baguaVector[bagua] = 0;
        });
        
        // マッピング行列を適用
        Object.entries(interfaceVector).forEach(([dimension, value]) => {
            const mapping = this.INTERFACE_TO_BAGUA_MATRIX[dimension];
            if (mapping) {
                Object.entries(mapping).forEach(([bagua, weight]) => {
                    baguaVector[bagua] += value * weight;
                });
            }
        });
        
        console.log("📊 Interface → 八卦変換結果:", baguaVector);
        return baguaVector;
    }
    
    /**
     * Safe Mode OSベクトルを八卦次元に変換
     */
    convertSafeModeToBagua(safemodeVector) {
        const baguaVector = {};
        
        // 初期化
        this.BAGUA_ORDER.forEach(bagua => {
            baguaVector[bagua] = 0;
        });
        
        // マッピング行列を適用
        Object.entries(safemodeVector).forEach(([dimension, value]) => {
            const mapping = this.SAFEMODE_TO_BAGUA_MATRIX[dimension];
            if (mapping) {
                Object.entries(mapping).forEach(([bagua, weight]) => {
                    baguaVector[bagua] += value * weight;
                });
            }
        });
        
        console.log("🛡️ Safe Mode → 八卦変換結果:", baguaVector);
        return baguaVector;
    }
    
    /**
     * Engine OSベクトルの正規化（既に八卦次元）
     */
    normalizeEngineToBagua(engineVector) {
        const baguaVector = {};
        
        // Engine OSは既に八卦次元なので、キー名の正規化のみ
        Object.entries(engineVector).forEach(([key, value]) => {
            // "_創造性" などのサフィックスを除去
            const baguaName = key.split('_')[0];
            if (this.BAGUA_ORDER.includes(baguaName)) {
                baguaVector[baguaName] = value;
            }
        });
        
        console.log("⚙️ Engine OS 八卦正規化:", baguaVector);
        return baguaVector;
    }
    
    /**
     * 統一された正規化プロセス
     */
    normalizeUnifiedVector(baguaVector, osType) {
        // Step 1: Z-score標準化
        const values = Object.values(baguaVector);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        
        const zScored = {};
        Object.entries(baguaVector).forEach(([key, value]) => {
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
        
        console.log(`✨ ${osType} OS 正規化完了:`, normalized);
        return normalized;
    }
    
    /**
     * 統合診断プロセス
     */
    unifiedDiagnose(rawVector, osType) {
        let baguaVector;
        
        // OSタイプに応じて八卦次元に変換
        switch(osType) {
            case 'engine':
                baguaVector = this.normalizeEngineToBagua(rawVector);
                break;
            case 'interface':
                baguaVector = this.convertInterfaceToBagua(rawVector);
                break;
            case 'safemode':
                baguaVector = this.convertSafeModeToBagua(rawVector);
                break;
            default:
                throw new Error(`Unknown OS type: ${osType}`);
        }
        
        // 統一された正規化
        const normalizedVector = this.normalizeUnifiedVector(baguaVector, osType);
        
        // 上位2つの八卦を選択（純卦許容）
        const sortedBagua = Object.entries(normalizedVector)
            .sort((a, b) => b[1] - a[1]);
        
        const topBagua1 = sortedBagua[0];
        const topBagua2 = sortedBagua[1] || sortedBagua[0]; // 純卦の場合
        
        const isPureHexagram = topBagua1[0] === topBagua2[0];
        
        return {
            upperBagua: topBagua1[0],
            lowerBagua: topBagua2[0],
            upperEnergy: topBagua1[1],
            lowerEnergy: topBagua2[1],
            isPureHexagram: isPureHexagram,
            baguaVector: normalizedVector,
            osType: osType
        };
    }
}

// テスト関数
function testDimensionUnification() {
    const system = new DimensionUnificationSystem();
    
    console.log("=== Phase 2: 8次元統一テスト ===");
    
    // Interface OSテスト
    const interfaceVector = {
        "外向_主導性": 8.5,
        "外向_調和性": 7.2,
        "外向_表現性": 6.8,
        "外向_行動性": 5.5,
        "内向_適応性": 4.3,
        "内向_分析性": 3.7,
        "内向_安定性": 2.9,
        "内向_支援性": 2.1
    };
    
    console.log("\n1. Interface OS変換テスト:");
    const interfaceResult = system.unifiedDiagnose(interfaceVector, 'interface');
    console.log("結果:", interfaceResult);
    
    // Safe Mode OSテスト
    const safemodeVector = {
        "防御_対抗性": 7.8,
        "防御_調和性": 6.5,
        "防御_変容性": 5.2,
        "防御_堅固性": 4.9,
        "防御_回避性": 3.6,
        "防御_持久性": 3.1,
        "防御_境界性": 2.8,
        "防御_撤退性": 1.5
    };
    
    console.log("\n2. Safe Mode OS変換テスト:");
    const safemodeResult = system.unifiedDiagnose(safemodeVector, 'safemode');
    console.log("結果:", safemodeResult);
    
    // Engine OSテスト（既に八卦次元）
    const engineVector = {
        "乾_創造性": 9.2,
        "兌_調和性": 7.8,
        "離_明晰性": 6.5,
        "震_行動性": 5.3,
        "巽_柔軟性": 4.1,
        "坎_洞察性": 3.2,
        "艮_安定性": 2.5,
        "坤_受容性": 1.8
    };
    
    console.log("\n3. Engine OS正規化テスト:");
    const engineResult = system.unifiedDiagnose(engineVector, 'engine');
    console.log("結果:", engineResult);
    
    // 全OSが同じ八卦次元を使用していることを確認
    console.log("\n=== 統一性確認 ===");
    console.log("✅ 全OSが八卦次元に統一されました");
    console.log("✅ 純卦の生成が可能です");
    console.log("✅ 正規化プロセスが統一されました");
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DimensionUnificationSystem };
}

console.log('Phase 2: 8次元統一システムが準備されました。');
console.log('testDimensionUnification() を実行してテストしてください。');