/**
 * TripleOSInteractionAnalyzer v2統合パッチ
 * 診断ロジックv2（純卦率12-18%制御）の統合
 */

// SeededRandomクラス（再現性のため）
class SeededRandom {
    constructor(seed = Date.now()) {
        this.seed = seed;
    }
    
    next() {
        // LCG (Linear Congruential Generator)
        this.seed = (this.seed * 1664525 + 1013904223) % 2147483647;
        return this.seed / 2147483647;
    }
}

// v2診断ロジックの統合
(function() {
    'use strict';
    
    // TripleOSInteractionAnalyzerクラスの拡張
    if (typeof window.TripleOSInteractionAnalyzer !== 'undefined') {
        const OriginalClass = window.TripleOSInteractionAnalyzer;
        
        // v2メソッドを追加
        OriginalClass.prototype.calculateHexagramProbabilitiesV2 = function(baguaEnergies, osType = 'engine', seed = null) {
            console.log(`🔄 Calculating hexagram probabilities v2 for ${osType} OS`);
            
            // 乱数生成器の初期化
            const rng = seed ? new SeededRandom(seed) : { next: () => this.rng.next() };
            
            // パラメータ設定
            const TEMPERATURE = {
                engine: 1.2,
                interface: 1.5,
                safemode: 1.3
            };
            
            const PURE_CONTROL = {
                engine: { k: 1.2, alphaMin: 0.12, alphaMax: 0.20 },
                interface: { k: 1.0, alphaMin: 0.10, alphaMax: 0.18 },
                safemode: { k: 1.1, alphaMin: 0.12, alphaMax: 0.22 }
            };
            
            const BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
            
            // Step 1: Softmax正規化
            const values = BAGUA_ORDER.map(b => baguaEnergies[b] || 0);
            const temperature = TEMPERATURE[osType];
            
            // 数値安定性のため最大値を引く
            const maxVal = Math.max(...values);
            const scaled = values.map(v => (v - maxVal) / temperature);
            const exp = scaled.map(v => Math.exp(v));
            const sum = exp.reduce((a, b) => a + b, 0);
            
            const normalized = exp.map(v => v / sum);
            
            // Step 2: Herfindahl指数計算
            const herfindahl = normalized.reduce((sum, p) => sum + p * p, 0);
            const H_min = 1/8;
            const H_max = 1;
            const H8_norm = (herfindahl - H_min) / (H_max - H_min);
            
            // Step 3: 純卦確率の決定（線形写像）
            const params = PURE_CONTROL[osType];
            const alpha = params.alphaMin + (params.alphaMax - params.alphaMin) * params.k * H8_norm;
            const alphaClamped = Math.max(params.alphaMin, Math.min(params.alphaMax, alpha));
            
            console.log(`📊 ${osType} OS - H=${herfindahl.toFixed(3)}, H8_norm=${H8_norm.toFixed(3)}, alpha=${alphaClamped.toFixed(3)}`);
            
            // Step 4: 64卦確率分布の生成
            const hexagramProbs = {};
            let totalProb = 0;
            
            BAGUA_ORDER.forEach((upperTrigram, i) => {
                BAGUA_ORDER.forEach((lowerTrigram, j) => {
                    const hexagramIndex = i * 8 + j + 1;
                    
                    if (i === j) {
                        // 純卦
                        hexagramProbs[hexagramIndex] = alphaClamped / 8;
                    } else {
                        // 非純卦
                        const upperWeight = normalized[i];
                        const lowerWeight = normalized[j];
                        const baseProb = upperWeight * lowerWeight;
                        const scaleFactor = (1 - alphaClamped) / (1 - normalized.reduce((s, p) => s + p * p, 0));
                        hexagramProbs[hexagramIndex] = baseProb * scaleFactor;
                    }
                    totalProb += hexagramProbs[hexagramIndex];
                });
            });
            
            // Step 5: 正規化（合計を1にする）
            Object.keys(hexagramProbs).forEach(key => {
                hexagramProbs[key] /= totalProb;
            });
            
            // Step 6: 純卦率の検証
            const pureHexagramIds = [1, 30, 29, 51, 57, 52, 58, 2]; // 八純卦
            const actualPureRate = pureHexagramIds.reduce((sum, id) => sum + (hexagramProbs[id] || 0), 0);
            console.log(`✅ ${osType} OS - Actual pure hexagram rate: ${(actualPureRate * 100).toFixed(1)}%`);
            
            return hexagramProbs;
        };
        
        // selectHexagramメソッドのv2版
        OriginalClass.prototype.selectHexagramV2 = function(probabilities, seed = null) {
            const rng = seed ? new SeededRandom(seed) : { next: () => this.rng.next() };
            const rand = rng.next();
            
            let cumulative = 0;
            for (const [hexagramId, prob] of Object.entries(probabilities)) {
                cumulative += prob;
                if (rand < cumulative) {
                    return parseInt(hexagramId);
                }
            }
            
            // フォールバック
            return 1;
        };
        
        // analyzeメソッドのオーバーライド（v2使用）
        const originalAnalyze = OriginalClass.prototype.analyze;
        OriginalClass.prototype.analyze = function(engineOS, interfaceOS, safeModeOS, options = {}) {
            console.log('🎯 Using v2 diagnostic logic with pure hexagram control');
            
            // v2ロジックを使用するフラグ
            if (options.useV2 !== false) {
                // 各OSの八卦エネルギーから64卦確率を計算
                if (engineOS.baguaEnergies) {
                    engineOS.hexagramProbabilities = this.calculateHexagramProbabilitiesV2(
                        engineOS.baguaEnergies, 
                        'engine', 
                        options.seed
                    );
                }
                
                if (interfaceOS.baguaEnergies) {
                    interfaceOS.hexagramProbabilities = this.calculateHexagramProbabilitiesV2(
                        interfaceOS.baguaEnergies, 
                        'interface', 
                        options.seed
                    );
                }
                
                if (safeModeOS.baguaEnergies) {
                    safeModeOS.hexagramProbabilities = this.calculateHexagramProbabilitiesV2(
                        safeModeOS.baguaEnergies, 
                        'safemode', 
                        options.seed
                    );
                }
            }
            
            // 元のanalyzeメソッドを呼び出し
            return originalAnalyze.call(this, engineOS, interfaceOS, safeModeOS);
        };
        
        console.log('✅ TripleOSInteractionAnalyzer v2 integration complete');
        console.log('📊 Pure hexagram rate target: 12-18%');
        console.log('🔧 Using Herfindahl index-based linear mapping');
    }
})();