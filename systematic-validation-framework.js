// 体系的検証フレームワーク - 全64卦×3役割パターンの正常性確認

class SystematicValidationFramework {
    constructor() {
        this.validatedPatterns = new Set();
        this.problematicPatterns = [];
        this.validationResults = {};
        this.analyzer = null;
    }
    
    /**
     * 単一パターンの検証
     */
    validatePattern(hexagramId, pairType) {
        try {
            // OS設定
            const engineOS = { hexagramId: hexagramId, name: `第${hexagramId}卦`, score: 0.5 };
            const interfaceOS = { hexagramId: 30, name: '第30卦', score: 0.5 }; // 離為火固定
            const safeModeOS = { hexagramId: hexagramId, name: `第${hexagramId}卦`, score: 0.5 };
            
            let os1, os2;
            if (pairType === 'engine-interface') {
                os1 = engineOS; os2 = interfaceOS;
            } else if (pairType === 'engine-safe') {
                os1 = engineOS; os2 = safeModeOS;
            } else if (pairType === 'interface-safe') {
                os1 = interfaceOS; os2 = safeModeOS;
            }
            
            if (!this.analyzer) {
                this.analyzer = new TripleOSInteractionAnalyzer();
            }
            
            // 分析実行
            const synergy = this.analyzer.calculatePairSynergy(os1, os2, pairType);
            const analysis = this.analyzer.analyzePair(pairType, os1, os2);
            
            // 検証項目
            const validation = {
                hexagramId,
                pairType,
                synergy,
                category: analysis.category,
                summary: analysis.summary,
                checks: {
                    synergyInRange: this.checkSynergyRange(synergy),
                    categoryConsistent: this.checkCategoryConsistency(synergy, analysis.category),
                    summaryLogical: this.checkSummaryLogic(analysis.summary, analysis.category, hexagramId),
                    noUndefinedValues: this.checkNoUndefined(analysis),
                    noErrorsInExecution: true
                }
            };
            
            // 総合判定
            validation.isValid = Object.values(validation.checks).every(check => check === true);
            
            if (validation.isValid) {
                this.validatedPatterns.add(`${hexagramId}-${pairType}`);
                console.log(`✅ ${hexagramId}-${pairType}: ${analysis.category} (${synergy.toFixed(3)})`);
            } else {
                this.problematicPatterns.push(validation);
                console.log(`❌ ${hexagramId}-${pairType}: 問題検出`);
            }
            
            return validation;
            
        } catch (error) {
            console.error(`🔥 ${hexagramId}-${pairType}: 実行エラー`, error.message);
            const errorValidation = {
                hexagramId, pairType,
                synergy: null, category: 'ERROR', summary: error.message,
                checks: { noErrorsInExecution: false },
                isValid: false, error: error.message
            };
            this.problematicPatterns.push(errorValidation);
            return errorValidation;
        }
    }
    
    /**
     * synergy値の範囲チェック（-1.0 ～ 1.0）
     */
    checkSynergyRange(synergy) {
        return typeof synergy === 'number' && synergy >= -1.0 && synergy <= 1.0;
    }
    
    /**
     * synergyとcategoryの一貫性チェック
     */
    checkCategoryConsistency(synergy, category) {
        if (synergy >= 0.6 && category === 'SYNERGY') return true;
        if (synergy >= 0.2 && synergy < 0.6 && category === 'HARMONY') return true;
        if (synergy >= -0.2 && synergy < 0.2 && category === 'TENSION') return true;
        if (synergy < -0.2 && category === 'CONFLICT') return true;
        return false;
    }
    
    /**
     * summary文の論理性チェック
     */
    checkSummaryLogic(summary, category, hexagramId) {
        if (!summary || typeof summary !== 'string') return false;
        
        // 同一卦の場合の特別チェック
        const hexagramName = this.getHexagramName(hexagramId);
        if (summary.includes(`同じ${hexagramName}同士`)) {
            // 同一卦表現の論理性
            if (category === 'HARMONY' && summary.includes('競合')) return false;
            if (category === 'SYNERGY' && summary.includes('緊張')) return false;
            if (category === 'CONFLICT' && summary.includes('安定')) return false;
        }
        
        // 基本的な論理性チェック
        if (category === 'SYNERGY' && (summary.includes('衝突') || summary.includes('対立'))) return false;
        if (category === 'CONFLICT' && (summary.includes('相乗効果') || summary.includes('共鳴'))) return false;
        
        return true;
    }
    
    /**
     * undefined値のチェック
     */
    checkNoUndefined(analysis) {
        return analysis.category !== undefined && 
               analysis.summary !== undefined && 
               !analysis.summary.includes('undefined');
    }
    
    /**
     * 卦名取得（簡易版）
     */
    getHexagramName(id) {
        const names = {
            1: '乾為天', 2: '坤為地', 3: '水雷屯', 4: '山水蒙', 5: '水天需',
            6: '天水訟', 7: '地水師', 8: '水地比', 9: '風天小畜', 10: '天沢履'
            // 必要に応じて拡張
        };
        return names[id] || `第${id}卦`;
    }
    
    /**
     * 全64卦の指定役割パターン検証
     */
    validateAllHexagramsForRole(pairType) {
        console.log(`\n🔍 ${pairType}の全64卦パターン検証開始`);
        const results = [];
        
        for (let i = 1; i <= 64; i++) {
            const result = this.validatePattern(i, pairType);
            results.push(result);
            
            // 進捗表示
            if (i % 16 === 0) {
                const validCount = results.filter(r => r.isValid).length;
                console.log(`進捗: ${i}/64 完了 (正常: ${validCount}/${i})`);
            }
        }
        
        return results;
    }
    
    /**
     * 全パターンの包括的検証 (64×3 = 192パターン)
     */
    validateAllPatterns() {
        console.log('🎯 全64卦×3役割 = 192パターンの包括的検証を開始します');
        
        const roles = ['engine-interface', 'engine-safe', 'interface-safe'];
        const allResults = {};
        
        roles.forEach(role => {
            allResults[role] = this.validateAllHexagramsForRole(role);
        });
        
        this.generateComprehensiveReport(allResults);
        return allResults;
    }
    
    /**
     * 包括的レポート生成
     */
    generateComprehensiveReport(allResults) {
        console.log('\n📊 包括的検証レポート');
        console.log('='.repeat(50));
        
        let totalValid = 0;
        let totalProblematic = 0;
        
        Object.entries(allResults).forEach(([role, results]) => {
            const validCount = results.filter(r => r.isValid).length;
            const problematicCount = results.filter(r => !r.isValid).length;
            
            totalValid += validCount;
            totalProblematic += problematicCount;
            
            console.log(`${role}:`);
            console.log(`  ✅ 正常: ${validCount}/64 (${(validCount/64*100).toFixed(1)}%)`);
            console.log(`  ❌ 問題: ${problematicCount}/64 (${(problematicCount/64*100).toFixed(1)}%)`);
        });
        
        console.log(`\n全体統計:`);
        console.log(`  ✅ 正常: ${totalValid}/192 (${(totalValid/192*100).toFixed(1)}%)`);
        console.log(`  ❌ 問題: ${totalProblematic}/192 (${(totalProblematic/192*100).toFixed(1)}%)`);
        
        if (this.problematicPatterns.length > 0) {
            console.log('\n🚨 問題のあるパターン詳細:');
            this.problematicPatterns.forEach(pattern => {
                console.log(`${pattern.hexagramId}-${pattern.pairType}: ${pattern.error || 'チェック失敗'}`);
            });
        }
    }
}

// エクスポート（Node.js環境用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SystematicValidationFramework;
}

// ブラウザ環境用のグローバル設定
if (typeof window !== 'undefined') {
    window.SystematicValidationFramework = SystematicValidationFramework;
}