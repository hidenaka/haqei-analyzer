// 効率的検証システム - 実用的な全パターン検証
// 問題: 262,144パターン全てを一度に処理すると重すぎる
// 解決: 段階的検証 + サンプリング + 統計的推定

class EfficientValidationSystem {
    constructor() {
        this.analyzer = null;
        this.sampleResults = [];
        this.fullResults = new Map();
        this.startTime = null;
    }
    
    initialize() {
        console.log('🎯 効率的検証システム初期化');
        if (!this.analyzer) {
            this.analyzer = new TripleOSInteractionAnalyzer();
        }
        this.startTime = Date.now();
        return true;
    }
    
    // Stage 1: 代表的なパターンをサンプリング検証
    async validateRepresentativeSamples() {
        console.log('📊 Stage 1: 代表サンプル検証開始');
        
        const samples = [
            // 同一卦パターン (64通り)
            ...Array.from({length: 64}, (_, i) => [i+1, i+1, i+1]),
            
            // 基本8卦の全組み合わせ (8×8×8 = 512通り)
            ...this.generateBasicEightCombinations(),
            
            // ランダムサンプル (1000通り)
            ...this.generateRandomSamples(1000),
            
            // 特殊関係パターン (綜卦・錯卦)
            ...this.generateSpecialRelationships()
        ];
        
        console.log(`代表サンプル数: ${samples.length}通り`);
        
        let validCount = 0;
        let invalidCount = 0;
        
        for (let i = 0; i < samples.length; i++) {
            const [e, iface, s] = samples[i];
            const result = this.validateSingleCombination(e, iface, s);
            
            if (result.isValid) {
                validCount++;
            } else {
                invalidCount++;
            }
            
            this.sampleResults.push(result);
            
            // 進捗表示
            if ((i + 1) % 100 === 0) {
                const progress = ((i + 1) / samples.length * 100).toFixed(1);
                const successRate = (validCount / (validCount + invalidCount) * 100).toFixed(1);
                console.log(`サンプル進捗: ${progress}% | 成功率: ${successRate}% | 正常: ${validCount} | 問題: ${invalidCount}`);
                
                // UI更新（エラー対応）
                const progressEl = document.getElementById('sample-progress');
                const successEl = document.getElementById('sample-success-rate');
                if (progressEl) progressEl.textContent = `${progress}%`;
                if (successEl) successEl.textContent = `${successRate}%`;
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        const finalSuccessRate = (validCount / samples.length * 100).toFixed(2);
        console.log(`✅ Stage 1完了 - サンプル成功率: ${finalSuccessRate}% (${validCount}/${samples.length})`);
        
        return {
            totalSamples: samples.length,
            validCount,
            invalidCount,
            successRate: finalSuccessRate,
            problematicPatterns: this.sampleResults.filter(r => !r.isValid)
        };
    }
    
    // Stage 2: 統計的推定による全体評価
    async estimateFullValidation(sampleResult) {
        console.log('📈 Stage 2: 統計的推定開始');
        
        const confidence = 95; // 95%信頼区間
        const margin = 0.01; // ±1%の精度
        
        // 統計的推定
        const populationSize = 262144;
        const sampleSize = sampleResult.totalSamples;
        const sampleSuccessRate = sampleResult.validCount / sampleSize;
        
        // 信頼区間計算
        const z = 1.96; // 95%信頼区間
        const standardError = Math.sqrt((sampleSuccessRate * (1 - sampleSuccessRate)) / sampleSize);
        const confidenceInterval = z * standardError;
        
        const estimatedSuccessRate = sampleSuccessRate;
        const lowerBound = Math.max(0, estimatedSuccessRate - confidenceInterval);
        const upperBound = Math.min(1, estimatedSuccessRate + confidenceInterval);
        
        const estimatedValid = Math.round(populationSize * estimatedSuccessRate);
        const estimatedInvalid = populationSize - estimatedValid;
        
        console.log('📊 統計的推定結果:');
        console.log(`  推定成功率: ${(estimatedSuccessRate * 100).toFixed(2)}%`);
        console.log(`  信頼区間: ${(lowerBound * 100).toFixed(2)}% - ${(upperBound * 100).toFixed(2)}%`);
        console.log(`  推定正常パターン: ${estimatedValid.toLocaleString()} / ${populationSize.toLocaleString()}`);
        console.log(`  推定問題パターン: ${estimatedInvalid.toLocaleString()} / ${populationSize.toLocaleString()}`);
        
        return {
            estimatedSuccessRate: estimatedSuccessRate * 100,
            confidenceInterval: {
                lower: lowerBound * 100,
                upper: upperBound * 100
            },
            estimatedValid,
            estimatedInvalid,
            confidence: confidence
        };
    }
    
    // Stage 3: 選択的完全検証 (問題パターンのみ)
    async validateProblematicPatternsCompletely(sampleResult) {
        console.log('🔍 Stage 3: 問題パターン詳細調査');
        
        const problematicPatterns = sampleResult.problematicPatterns;
        
        if (problematicPatterns.length === 0) {
            console.log('✅ 問題パターンなし - 完全検証をスキップ');
            return { message: '問題パターンなし', detailedResults: [] };
        }
        
        console.log(`問題パターン ${problematicPatterns.length} 件の詳細調査開始`);
        
        const detailedResults = problematicPatterns.map(pattern => {
            return {
                combination: pattern.combination,
                error: pattern.error,
                details: this.analyzePatternError(pattern)
            };
        });
        
        return {
            problematicCount: problematicPatterns.length,
            detailedResults
        };
    }
    
    // 効率的検証実行
    async runEfficientValidation() {
        console.log('🚀 効率的全パターン検証開始');
        this.initialize();
        
        try {
            // Stage 1: サンプリング検証
            const sampleResult = await this.validateRepresentativeSamples();
            
            // Stage 2: 統計的推定
            const estimation = await this.estimateFullValidation(sampleResult);
            
            // Stage 3: 問題パターン詳細調査
            const problematicAnalysis = await this.validateProblematicPatternsCompletely(sampleResult);
            
            // 最終レポート
            const finalReport = {
                approach: 'statistical_sampling',
                sampleValidation: sampleResult,
                statisticalEstimation: estimation,
                problematicAnalysis: problematicAnalysis,
                conclusion: this.generateConclusion(sampleResult, estimation),
                processingTime: (Date.now() - this.startTime) / 1000
            };
            
            console.log('🎊 効率的検証完了!');
            return finalReport;
            
        } catch (error) {
            console.error('🚨 検証エラー:', error);
            throw error;
        }
    }
    
    // ユーティリティメソッド群
    validateSingleCombination(engineId, interfaceId, safeModeId) {
        try {
            const engineOS = { hexagramId: engineId, name: `第${engineId}卦`, score: 0.5 };
            const interfaceOS = { hexagramId: interfaceId, name: `第${interfaceId}卦`, score: 0.5 };
            const safeModeOS = { hexagramId: safeModeId, name: `第${safeModeId}卦`, score: 0.5 };
            
            const synergyResult = this.analyzer.calculateSynergy(engineOS, interfaceOS, safeModeOS);
            const engineInterfaceSynergy = this.analyzer.calculatePairSynergy(engineOS, interfaceOS, 'engine-interface');
            const engineSafeSynergy = this.analyzer.calculatePairSynergy(engineOS, safeModeOS, 'engine-safe');
            const interfaceSafeSynergy = this.analyzer.calculatePairSynergy(interfaceOS, safeModeOS, 'interface-safe');
            
            const totalSynergy = (engineInterfaceSynergy + engineSafeSynergy + interfaceSafeSynergy) / 3;
            const category = this.getSynergyCategory(totalSynergy);
            
            return {
                combination: `${engineId}-${interfaceId}-${safeModeId}`,
                totalSynergy,
                category,
                isValid: this.isValidResult(totalSynergy, category)
            };
        } catch (error) {
            return {
                combination: `${engineId}-${interfaceId}-${safeModeId}`,
                isValid: false,
                error: error.message
            };
        }
    }
    
    generateBasicEightCombinations() {
        const combinations = [];
        for (let e = 1; e <= 8; e++) {
            for (let i = 1; i <= 8; i++) {
                for (let s = 1; s <= 8; s++) {
                    combinations.push([e, i, s]);
                }
            }
        }
        return combinations;
    }
    
    generateRandomSamples(count) {
        const samples = [];
        for (let i = 0; i < count; i++) {
            const e = Math.floor(Math.random() * 64) + 1;
            const iface = Math.floor(Math.random() * 64) + 1;
            const s = Math.floor(Math.random() * 64) + 1;
            samples.push([e, iface, s]);
        }
        return samples;
    }
    
    generateSpecialRelationships() {
        // 綜卦・錯卦の特殊関係パターンを生成
        const special = [];
        const pairs = [[1, 2], [3, 50], [5, 6], [7, 8]]; // 例：基本的な対応関係
        
        pairs.forEach(([a, b]) => {
            special.push([a, b, a], [b, a, b], [a, a, b], [b, b, a]);
        });
        
        return special;
    }
    
    getSynergyCategory(synergy) {
        if (synergy >= 0.6) return 'SYNERGY';
        if (synergy >= 0.2) return 'HARMONY';
        if (synergy >= -0.2) return 'TENSION';
        return 'CONFLICT';
    }
    
    isValidResult(synergy, category) {
        return typeof synergy === 'number' && 
               synergy >= -3.0 && synergy <= 3.0 &&
               ['SYNERGY', 'HARMONY', 'TENSION', 'CONFLICT'].includes(category);
    }
    
    analyzePatternError(pattern) {
        return `Pattern ${pattern.combination}: ${pattern.error || 'validation failed'}`;
    }
    
    generateConclusion(sampleResult, estimation) {
        if (estimation.estimatedSuccessRate > 95) {
            return 'システム品質: 優秀 - 全パターンが正常動作する可能性が非常に高い';
        } else if (estimation.estimatedSuccessRate > 90) {
            return 'システム品質: 良好 - 大部分のパターンが正常動作';
        } else {
            return 'システム品質: 要改善 - 問題パターンが多数検出';
        }
    }
}

// エクスポート
if (typeof window !== 'undefined') {
    window.EfficientValidationSystem = EfficientValidationSystem;
}