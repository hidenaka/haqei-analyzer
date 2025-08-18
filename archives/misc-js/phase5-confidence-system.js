/**
 * Phase 5: 決定確信度と検証機能実装
 * 
 * 診断結果の確信度評価と検証機能
 * 高/中/低の3段階評価と補助的な卦選択ロジック
 */

class ConfidenceSystem {
    constructor() {
        // 確信度レベルの定義
        this.CONFIDENCE_LEVELS = {
            HIGH: {
                threshold: 0.15,    // エネルギー差が15%以上
                label: "高確信度",
                color: "#28a745",
                description: "明確な傾向が見られます"
            },
            MEDIUM: {
                threshold: 0.08,    // エネルギー差が8%以上15%未満
                label: "中確信度",
                color: "#ffc107",
                description: "やや明確な傾向があります"
            },
            LOW: {
                threshold: 0,       // エネルギー差が8%未満
                label: "低確信度",
                color: "#dc3545",
                description: "複数の可能性が考えられます"
            }
        };
        
        // 検証項目の定義
        this.VALIDATION_CRITERIA = {
            // 必須検証項目
            required: {
                "hexagram_range": {
                    check: (result) => result.hexagramId >= 1 && result.hexagramId <= 64,
                    message: "卦番号が1-64の範囲内"
                },
                "bagua_validity": {
                    check: (result) => this.isValidBagua(result.upperBagua) && 
                                       this.isValidBagua(result.lowerBagua),
                    message: "有効な八卦名"
                },
                "energy_sum": {
                    check: (result) => {
                        const sum = Object.values(result.baguaEnergies || {})
                            .reduce((a, b) => a + b, 0);
                        return Math.abs(sum - 100) < 1;
                    },
                    message: "エネルギー合計が100%"
                }
            },
            
            // 推奨検証項目
            recommended: {
                "energy_distribution": {
                    check: (result) => {
                        const energies = Object.values(result.baguaEnergies || {});
                        const max = Math.max(...energies);
                        return max < 50; // 極端な偏りがない
                    },
                    message: "エネルギー分布が適切"
                },
                "pure_hexagram_check": {
                    check: (result) => {
                        if (result.upperBagua === result.lowerBagua) {
                            return result.isPureHexagram === true;
                        }
                        return true;
                    },
                    message: "純卦フラグが正しい"
                }
            }
        };
        
        // 有効な八卦名
        this.VALID_BAGUA = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
    }
    
    /**
     * 確信度の計算
     */
    calculateConfidence(baguaEnergies) {
        if (!baguaEnergies || Object.keys(baguaEnergies).length === 0) {
            return this.createConfidenceResult('LOW', 0, null);
        }
        
        // エネルギーを降順でソート
        const sorted = Object.entries(baguaEnergies)
            .sort((a, b) => b[1] - a[1]);
        
        if (sorted.length < 2) {
            return this.createConfidenceResult('LOW', 0, null);
        }
        
        // 上位2つのエネルギー差を計算
        const top1Energy = sorted[0][1];
        const top2Energy = sorted[1][1];
        const energyGap = (top1Energy - top2Energy) / 100; // パーセンテージに正規化
        
        // 確信度レベルを判定
        let level = 'LOW';
        if (energyGap >= this.CONFIDENCE_LEVELS.HIGH.threshold) {
            level = 'HIGH';
        } else if (energyGap >= this.CONFIDENCE_LEVELS.MEDIUM.threshold) {
            level = 'MEDIUM';
        }
        
        // 低確信度の場合、代替候補を提供
        let alternatives = null;
        if (level === 'LOW' && sorted.length >= 3) {
            alternatives = this.generateAlternatives(sorted);
        }
        
        return this.createConfidenceResult(level, energyGap, alternatives);
    }
    
    /**
     * 確信度結果の生成
     */
    createConfidenceResult(level, gap, alternatives) {
        const config = this.CONFIDENCE_LEVELS[level];
        
        return {
            level: level,
            label: config.label,
            score: gap,
            percentage: (gap * 100).toFixed(1) + '%',
            color: config.color,
            description: config.description,
            alternatives: alternatives,
            recommendation: this.getRecommendation(level, alternatives)
        };
    }
    
    /**
     * 代替候補の生成（低確信度の場合）
     */
    generateAlternatives(sortedEnergies) {
        const alternatives = [];
        
        // 上位3つの組み合わせを提案
        const top3 = sortedEnergies.slice(0, 3);
        
        // 組み合わせ1: 1位と2位
        alternatives.push({
            upper: top3[0][0],
            lower: top3[1][0],
            confidence: ((top3[0][1] + top3[1][1]) / 2).toFixed(1),
            reason: "最もエネルギーが高い2つの八卦"
        });
        
        // 組み合わせ2: 1位と3位（もし存在すれば）
        if (top3[2]) {
            alternatives.push({
                upper: top3[0][0],
                lower: top3[2][0],
                confidence: ((top3[0][1] + top3[2][1]) / 2).toFixed(1),
                reason: "第1位と第3位の組み合わせ"
            });
            
            // 組み合わせ3: 2位と3位
            alternatives.push({
                upper: top3[1][0],
                lower: top3[2][0],
                confidence: ((top3[1][1] + top3[2][1]) / 2).toFixed(1),
                reason: "第2位と第3位の組み合わせ"
            });
        }
        
        return alternatives;
    }
    
    /**
     * 推奨事項の生成
     */
    getRecommendation(level, alternatives) {
        switch(level) {
            case 'HIGH':
                return "診断結果は高い確信度を持っています。この卦があなたの特性をよく表しています。";
            
            case 'MEDIUM':
                return "診断結果は中程度の確信度です。主要な傾向は捉えていますが、細部には個人差があるかもしれません。";
            
            case 'LOW':
                if (alternatives && alternatives.length > 0) {
                    return "複数の可能性があります。以下の代替候補も参考にしてください。より詳細な質問への回答で精度が向上します。";
                }
                return "エネルギーが分散しています。より明確な回答をすることで、診断精度が向上します。";
            
            default:
                return "";
        }
    }
    
    /**
     * 診断結果の検証
     */
    validateDiagnosisResult(result) {
        const validation = {
            valid: true,
            errors: [],
            warnings: [],
            passed: [],
            score: 0
        };
        
        // 必須項目の検証
        Object.entries(this.VALIDATION_CRITERIA.required).forEach(([key, criterion]) => {
            if (criterion.check(result)) {
                validation.passed.push(criterion.message);
                validation.score += 2;
            } else {
                validation.valid = false;
                validation.errors.push(`❌ ${criterion.message}`);
            }
        });
        
        // 推奨項目の検証
        Object.entries(this.VALIDATION_CRITERIA.recommended).forEach(([key, criterion]) => {
            if (criterion.check(result)) {
                validation.passed.push(criterion.message);
                validation.score += 1;
            } else {
                validation.warnings.push(`⚠️ ${criterion.message}`);
            }
        });
        
        // 総合スコア（最大10点）
        validation.totalScore = validation.score;
        validation.maxScore = 
            Object.keys(this.VALIDATION_CRITERIA.required).length * 2 +
            Object.keys(this.VALIDATION_CRITERIA.recommended).length;
        
        validation.percentage = (validation.score / validation.maxScore * 100).toFixed(0);
        
        return validation;
    }
    
    /**
     * 有効な八卦名かチェック
     */
    isValidBagua(name) {
        return this.VALID_BAGUA.includes(name);
    }
    
    /**
     * 統合診断結果の生成
     */
    generateCompleteDiagnosis(baguaEnergies, upperBagua, lowerBagua, hexagramId, osType) {
        // 基本診断結果
        const diagnosis = {
            hexagramId: hexagramId,
            upperBagua: upperBagua,
            lowerBagua: lowerBagua,
            isPureHexagram: upperBagua === lowerBagua,
            baguaEnergies: baguaEnergies,
            osType: osType
        };
        
        // 確信度計算
        diagnosis.confidence = this.calculateConfidence(baguaEnergies);
        
        // 検証実行
        diagnosis.validation = this.validateDiagnosisResult(diagnosis);
        
        // 診断品質評価
        diagnosis.quality = this.evaluateQuality(diagnosis);
        
        return diagnosis;
    }
    
    /**
     * 診断品質の総合評価
     */
    evaluateQuality(diagnosis) {
        let qualityScore = 0;
        let maxScore = 100;
        
        // 確信度による評価（40点）
        if (diagnosis.confidence.level === 'HIGH') {
            qualityScore += 40;
        } else if (diagnosis.confidence.level === 'MEDIUM') {
            qualityScore += 25;
        } else {
            qualityScore += 10;
        }
        
        // 検証スコアによる評価（30点）
        const validationScore = (diagnosis.validation.percentage / 100) * 30;
        qualityScore += validationScore;
        
        // エネルギー分布による評価（30点）
        if (diagnosis.baguaEnergies) {
            const energies = Object.values(diagnosis.baguaEnergies);
            const variance = this.calculateVariance(energies);
            
            // 適度な分散が理想（極端すぎず、均等すぎず）
            if (variance > 100 && variance < 400) {
                qualityScore += 30;
            } else if (variance > 50 && variance < 500) {
                qualityScore += 20;
            } else {
                qualityScore += 10;
            }
        }
        
        // 品質レベルの判定
        let qualityLevel;
        if (qualityScore >= 80) {
            qualityLevel = "優秀";
        } else if (qualityScore >= 60) {
            qualityLevel = "良好";
        } else if (qualityScore >= 40) {
            qualityLevel = "普通";
        } else {
            qualityLevel = "要改善";
        }
        
        return {
            score: qualityScore,
            maxScore: maxScore,
            percentage: (qualityScore / maxScore * 100).toFixed(0) + '%',
            level: qualityLevel
        };
    }
    
    /**
     * 分散の計算
     */
    calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => 
            sum + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
    }
}

// テスト関数
function testConfidenceSystem() {
    const system = new ConfidenceSystem();
    
    console.log("=== Phase 5: 確信度システムテスト ===\n");
    
    // テストケース1: 高確信度
    console.log("【テスト1: 高確信度】");
    const highConfidenceEnergies = {
        "乾": 35, "兌": 15, "離": 12, "震": 10,
        "巽": 8, "坎": 8, "艮": 7, "坤": 5
    };
    
    const result1 = system.generateCompleteDiagnosis(
        highConfidenceEnergies, "乾", "兌", 43, "engine"
    );
    console.log("確信度:", result1.confidence.label, 
                `(${result1.confidence.percentage})`);
    console.log("推奨事項:", result1.confidence.recommendation);
    console.log("品質評価:", result1.quality.level, 
                `(${result1.quality.percentage})`);
    
    // テストケース2: 低確信度
    console.log("\n【テスト2: 低確信度】");
    const lowConfidenceEnergies = {
        "乾": 14, "兌": 13.5, "離": 13, "震": 12.5,
        "巽": 12, "坎": 11.5, "艮": 11.5, "坤": 12
    };
    
    const result2 = system.generateCompleteDiagnosis(
        lowConfidenceEnergies, "乾", "兌", 43, "interface"
    );
    console.log("確信度:", result2.confidence.label, 
                `(${result2.confidence.percentage})`);
    console.log("代替候補:");
    result2.confidence.alternatives?.forEach((alt, idx) => {
        console.log(`  ${idx + 1}. ${alt.upper}上${alt.lower}下 - ${alt.reason}`);
    });
    
    // テストケース3: 純卦の検証
    console.log("\n【テスト3: 純卦検証】");
    const pureHexagramEnergies = {
        "艮": 40, "坤": 15, "坎": 10, "巽": 10,
        "震": 8, "離": 7, "兌": 5, "乾": 5
    };
    
    const result3 = system.generateCompleteDiagnosis(
        pureHexagramEnergies, "艮", "艮", 52, "safemode"
    );
    console.log("純卦判定:", result3.isPureHexagram ? "✅ 純卦" : "❌ 通常卦");
    console.log("検証結果:");
    console.log("  エラー:", result3.validation.errors.length === 0 ? "なし" : 
                result3.validation.errors.join(", "));
    console.log("  警告:", result3.validation.warnings.length === 0 ? "なし" : 
                result3.validation.warnings.join(", "));
    console.log("  検証スコア:", `${result3.validation.score}/${result3.validation.maxScore}`);
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfidenceSystem };
}

console.log('Phase 5: 確信度システムが準備されました。');
console.log('testConfidenceSystem() を実行してテストしてください。');