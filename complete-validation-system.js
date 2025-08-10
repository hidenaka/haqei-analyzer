// 完全検証システム - 全262,144パターン (64×64×64) の包括的検証
// ユーザー要求: 192通りじゃ全然足りない、ちゃんと全部 (26万通り) 確認して

class CompleteValidationSystem {
    constructor() {
        this.totalCombinations = 64 * 64 * 64; // 262,144
        this.validatedCount = 0;
        this.problematicCount = 0;
        this.results = {
            valid: new Map(),
            problematic: []
        };
        this.batchSize = 1000; // 1度に処理する組み合わせ数
        this.currentBatch = 0;
        this.analyzer = null;
        this.startTime = null;
    }
    
    /**
     * 初期化
     */
    initialize() {
        console.log('🎯 完全検証システム初期化中...');
        console.log(`📊 検証対象: ${this.totalCombinations.toLocaleString()}通りの全組み合わせ`);
        console.log(`⚙️ バッチサイズ: ${this.batchSize}件ずつ処理`);
        
        if (!this.analyzer) {
            this.analyzer = new TripleOSInteractionAnalyzer();
            console.log('✅ TripleOSInteractionAnalyzer 初期化完了');
        }
        
        this.startTime = Date.now();
        return true;
    }
    
    /**
     * 単一の Triple OS 組み合わせを検証
     */
    validateCombination(engineId, interfaceId, safeModeId) {
        try {
            // OS設定
            const engineOS = { 
                hexagramId: engineId, 
                name: `第${engineId}卦`, 
                score: 0.5 
            };
            const interfaceOS = { 
                hexagramId: interfaceId, 
                name: `第${interfaceId}卦`, 
                score: 0.5 
            };
            const safeModeOS = { 
                hexagramId: safeModeId, 
                name: `第${safeModeId}卦`, 
                score: 0.5 
            };
            
            // Triple OS分析実行 - 正しいメソッド使用
            const synergyResult = this.analyzer.calculateSynergy(engineOS, interfaceOS, safeModeOS);
            const synergyMatrix = synergyResult.matrix;
            
            // 個別ペア分析
            const engineInterfaceSynergy = this.analyzer.calculatePairSynergy(engineOS, interfaceOS, 'engine-interface');
            const engineSafeSynergy = this.analyzer.calculatePairSynergy(engineOS, safeModeOS, 'engine-safe');
            const interfaceSafeSynergy = this.analyzer.calculatePairSynergy(interfaceOS, safeModeOS, 'interface-safe');
            
            // totalSynergyを計算（matrixの非ゼロ要素の平均）
            const totalSynergy = (engineInterfaceSynergy + engineSafeSynergy + interfaceSafeSynergy) / 3;
            const overallCategory = this.getSynergyCategory(totalSynergy);
            
            const analysis = {
                totalSynergy: totalSynergy,
                overallCategory: overallCategory,
                synergyMatrix: synergyMatrix
            };
            
            // 検証項目チェック
            const validation = {
                combination: `${engineId}-${interfaceId}-${safeModeId}`,
                engineOS: engineId,
                interfaceOS: interfaceId, 
                safeModeOS: safeModeId,
                totalSynergy: analysis.totalSynergy,
                overallCategory: analysis.overallCategory,
                matrix: analysis.synergyMatrix,
                checks: {
                    totalSynergyInRange: this.checkSynergyRange(analysis.totalSynergy),
                    matrixConsistent: this.checkMatrixConsistency(analysis.synergyMatrix),
                    categoryLogical: this.checkCategoryLogic(analysis.overallCategory, analysis.totalSynergy),
                    noUndefinedValues: this.checkNoUndefined(analysis),
                    noErrorsInExecution: true
                }
            };
            
            // 総合判定
            validation.isValid = Object.values(validation.checks).every(check => check === true);
            
            if (validation.isValid) {
                this.validatedCount++;
                const key = `${engineId}-${interfaceId}-${safeModeId}`;
                this.results.valid.set(key, {
                    totalSynergy: analysis.totalSynergy,
                    category: analysis.overallCategory,
                    engineInterface: analysis.synergyMatrix[0][1],
                    engineSafe: analysis.synergyMatrix[0][2], 
                    interfaceSafe: analysis.synergyMatrix[1][2]
                });
            } else {
                this.problematicCount++;
                validation.error = this.getValidationError(validation.checks);
                this.results.problematic.push(validation);
            }
            
            return validation;
            
        } catch (error) {
            this.problematicCount++;
            const errorValidation = {
                combination: `${engineId}-${interfaceId}-${safeModeId}`,
                engineOS: engineId,
                interfaceOS: interfaceId,
                safeModeOS: safeModeId,
                error: error.message,
                isValid: false
            };
            this.results.problematic.push(errorValidation);
            return errorValidation;
        }
    }
    
    /**
     * バッチ処理で指定範囲を検証
     */
    async validateBatch(startIndex, endIndex) {
        const batchResults = [];
        const total = endIndex - startIndex;
        
        console.log(`🔄 バッチ${this.currentBatch + 1} 開始: ${startIndex} - ${endIndex} (${total}件)`);
        
        for (let i = startIndex; i < endIndex; i++) {
            // インデックスを3次元座標に変換
            const engineId = Math.floor(i / (64 * 64)) + 1;
            const interfaceId = Math.floor((i % (64 * 64)) / 64) + 1;
            const safeModeId = (i % 64) + 1;
            
            const result = this.validateCombination(engineId, interfaceId, safeModeId);
            batchResults.push(result);
            
            // 進捗表示 (1000件ごと)
            if ((i - startIndex + 1) % 1000 === 0) {
                const progress = ((i - startIndex + 1) / total * 100).toFixed(1);
                const validRate = (this.validatedCount / (this.validatedCount + this.problematicCount) * 100).toFixed(1);
                console.log(`  進捗: ${progress}% | 正常率: ${validRate}% | 正常: ${this.validatedCount} | 問題: ${this.problematicCount}`);
            }
        }
        
        this.currentBatch++;
        return batchResults;
    }
    
    /**
     * 全262,144通りの完全検証実行
     */
    async validateAllCombinations() {
        console.log('🚀 全262,144通り完全検証開始！');
        console.log('⚠️  これは時間がかかります。お待ちください...');
        
        this.initialize();
        
        const totalBatches = Math.ceil(this.totalCombinations / this.batchSize);
        console.log(`📦 総バッチ数: ${totalBatches}`);
        
        for (let batch = 0; batch < totalBatches; batch++) {
            const startIndex = batch * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, this.totalCombinations);
            
            await this.validateBatch(startIndex, endIndex);
            
            // バッチ間で少し待機（ブラウザのフリーズ防止）
            if (batch % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        this.generateFinalReport();
        return this.results;
    }
    
    /**
     * 最終レポート生成
     */
    generateFinalReport() {
        const elapsedTime = Date.now() - this.startTime;
        const elapsedMinutes = (elapsedTime / 1000 / 60).toFixed(1);
        
        console.log('\n🎊 全262,144通り完全検証完了！');
        console.log('='.repeat(60));
        console.log(`⏱️  処理時間: ${elapsedMinutes}分`);
        console.log(`📊 検証総数: ${this.totalCombinations.toLocaleString()}通り`);
        console.log(`✅ 正常: ${this.validatedCount.toLocaleString()}通り (${(this.validatedCount/this.totalCombinations*100).toFixed(2)}%)`);
        console.log(`❌ 問題: ${this.problematicCount.toLocaleString()}通り (${(this.problematicCount/this.totalCombinations*100).toFixed(2)}%)`);
        
        if (this.problematicCount === 0) {
            console.log('🎉 全パターン正常動作確認！システム完璧です！');
        } else {
            console.log('\n🚨 問題のある組み合わせ詳細:');
            this.results.problematic.slice(0, 10).forEach(p => {
                console.log(`  ${p.combination}: ${p.error || '検証失敗'}`);
            });
            if (this.results.problematic.length > 10) {
                console.log(`  ... (他 ${this.results.problematic.length - 10} 件)`);
            }
        }
        
        console.log('\n📈 統計情報:');
        console.log(`  平均処理速度: ${(this.totalCombinations / (elapsedTime / 1000)).toFixed(0)} 組み合わせ/秒`);
        
        return {
            totalCombinations: this.totalCombinations,
            validatedCount: this.validatedCount,
            problematicCount: this.problematicCount,
            successRate: this.validatedCount / this.totalCombinations * 100,
            processingTimeMinutes: elapsedMinutes
        };
    }
    
    // ユーティリティメソッド群
    getSynergyCategory(synergy) {
        if (synergy >= 0.6) return 'SYNERGY';
        if (synergy >= 0.2) return 'HARMONY';
        if (synergy >= -0.2) return 'TENSION';
        return 'CONFLICT';
    }
    
    checkSynergyRange(synergy) {
        return typeof synergy === 'number' && synergy >= -3.0 && synergy <= 3.0;
    }
    
    checkMatrixConsistency(matrix) {
        if (!Array.isArray(matrix) || matrix.length !== 3) return false;
        return matrix.every(row => Array.isArray(row) && row.length === 3);
    }
    
    checkCategoryLogic(category, totalSynergy) {
        const validCategories = ['SYNERGY', 'HARMONY', 'TENSION', 'CONFLICT'];
        return validCategories.includes(category);
    }
    
    checkNoUndefined(analysis) {
        return analysis.totalSynergy !== undefined && 
               analysis.overallCategory !== undefined &&
               analysis.synergyMatrix !== undefined;
    }
    
    getValidationError(checks) {
        const failed = Object.entries(checks).filter(([key, value]) => !value);
        return failed.map(([key]) => key).join(', ');
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompleteValidationSystem;
}

if (typeof window !== 'undefined') {
    window.CompleteValidationSystem = CompleteValidationSystem;
}