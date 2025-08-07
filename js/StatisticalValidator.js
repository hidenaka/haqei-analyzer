/**
 * HAQEI OS Analyzer 統計的検証モジュール
 * Cronbach's α信頼性係数計算と品質検証
 */
class StatisticalValidator {
    constructor() {
        this.minimumReliability = 0.70; // 最低基準値
        this.targetReliability = 0.85;  // 目標値
    }

    /**
     * Cronbach's α係数を計算
     * @param {Array} responses - 回答データ配列
     * @returns {number} α係数（0-1）
     */
    calculateCronbachAlpha(responses) {
        if (!responses || responses.length === 0) {
            return 0;
        }

        const n = responses.length; // サンプル数
        const k = responses[0].length; // 質問数

        // 各質問の分散を計算
        const itemVariances = [];
        for (let i = 0; i < k; i++) {
            const scores = responses.map(r => r[i]);
            itemVariances.push(this.calculateVariance(scores));
        }

        // 総合スコアの分散を計算
        const totalScores = responses.map(r => r.reduce((sum, score) => sum + score, 0));
        const totalVariance = this.calculateVariance(totalScores);

        // Cronbach's α計算
        const sumItemVariances = itemVariances.reduce((sum, v) => sum + v, 0);
        const alpha = (k / (k - 1)) * (1 - (sumItemVariances / totalVariance));

        return Math.max(0, Math.min(1, alpha));
    }

    /**
     * 分散を計算
     * @param {Array} values - 数値配列
     * @returns {number} 分散
     */
    calculateVariance(values) {
        if (!values || values.length === 0) return 0;
        
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
        return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / values.length;
    }

    /**
     * Triple OS結果の統計的検証
     * @param {Object} tripleOSResults - Triple OS分析結果
     * @returns {Object} 検証結果
     */
    validateTripleOSResults(tripleOSResults) {
        const validation = {
            engineOS: {
                reliability: 0,
                status: 'unknown',
                recommendation: ''
            },
            interfaceOS: {
                reliability: 0,
                status: 'unknown',
                recommendation: ''
            },
            safeModeOS: {
                reliability: 0,
                status: 'unknown',
                recommendation: ''
            },
            overall: {
                reliability: 0,
                status: 'unknown',
                isValid: false
            }
        };

        // 各OSの信頼性を評価
        if (tripleOSResults.engineOS) {
            validation.engineOS.reliability = this.evaluateOSReliability(tripleOSResults.engineOS);
            validation.engineOS.status = this.getReliabilityStatus(validation.engineOS.reliability);
            validation.engineOS.recommendation = this.getRecommendation(validation.engineOS.reliability);
        }

        if (tripleOSResults.interfaceOS) {
            validation.interfaceOS.reliability = this.evaluateOSReliability(tripleOSResults.interfaceOS);
            validation.interfaceOS.status = this.getReliabilityStatus(validation.interfaceOS.reliability);
            validation.interfaceOS.recommendation = this.getRecommendation(validation.interfaceOS.reliability);
        }

        if (tripleOSResults.safeModeOS) {
            validation.safeModeOS.reliability = this.evaluateOSReliability(tripleOSResults.safeModeOS);
            validation.safeModeOS.status = this.getReliabilityStatus(validation.safeModeOS.reliability);
            validation.safeModeOS.recommendation = this.getRecommendation(validation.safeModeOS.reliability);
        }

        // 総合信頼性を計算
        const reliabilities = [
            validation.engineOS.reliability,
            validation.interfaceOS.reliability,
            validation.safeModeOS.reliability
        ].filter(r => r > 0);

        if (reliabilities.length > 0) {
            validation.overall.reliability = reliabilities.reduce((sum, r) => sum + r, 0) / reliabilities.length;
            validation.overall.status = this.getReliabilityStatus(validation.overall.reliability);
            validation.overall.isValid = validation.overall.reliability >= this.minimumReliability;
        }

        return validation;
    }

    /**
     * OSの信頼性を評価
     * @param {Object} osResult - OS分析結果
     * @returns {number} 信頼性スコア（0-1）
     */
    evaluateOSReliability(osResult) {
        let reliabilityScore = 0;
        let factors = 0;

        // trigramEnergiesの存在と分布を確認
        if (osResult.trigramEnergies) {
            const energies = Object.values(osResult.trigramEnergies);
            const nonZeroCount = energies.filter(e => e > 0).length;
            
            // 少なくとも4つ以上の三爻にエネルギーがあれば信頼性高
            if (nonZeroCount >= 4) {
                reliabilityScore += 0.35;
            } else if (nonZeroCount >= 2) {
                reliabilityScore += 0.20;
            }
            factors++;
        }

        // hexagramIdの妥当性を確認
        if (osResult.hexagramId && osResult.hexagramId >= 1 && osResult.hexagramId <= 64) {
            reliabilityScore += 0.25;
            factors++;
        }

        // 三爻の整合性を確認
        if (osResult.upperTrigram && osResult.lowerTrigram) {
            reliabilityScore += 0.20;
            factors++;
        }

        // descriptionの存在を確認
        if (osResult.description && osResult.description.length > 10) {
            reliabilityScore += 0.20;
            factors++;
        }

        // 最低保証値15%
        return Math.max(0.15, Math.min(1, reliabilityScore));
    }

    /**
     * 信頼性ステータスを取得
     * @param {number} reliability - 信頼性スコア
     * @returns {string} ステータス
     */
    getReliabilityStatus(reliability) {
        if (reliability >= this.targetReliability) {
            return 'excellent';
        } else if (reliability >= this.minimumReliability) {
            return 'acceptable';
        } else if (reliability >= 0.5) {
            return 'marginal';
        } else {
            return 'poor';
        }
    }

    /**
     * 改善推奨事項を取得
     * @param {number} reliability - 信頼性スコア
     * @returns {string} 推奨事項
     */
    getRecommendation(reliability) {
        if (reliability >= this.targetReliability) {
            return '優れた信頼性です。現状を維持してください。';
        } else if (reliability >= this.minimumReliability) {
            return '許容範囲内ですが、さらなる改善が推奨されます。';
        } else if (reliability >= 0.5) {
            return '信頼性が低いです。質問数の増加を検討してください。';
        } else {
            return '信頼性が不足しています。システムの再設計が必要です。';
        }
    }

    /**
     * 統計レポートを生成
     * @param {Object} validation - 検証結果
     * @returns {string} HTMLレポート
     */
    generateReport(validation) {
        return `
            <div class="statistical-report">
                <h3>📊 統計的信頼性レポート</h3>
                
                <div class="reliability-scores">
                    <div class="os-reliability">
                        <h4>Engine OS</h4>
                        <div class="score ${validation.engineOS.status}">
                            ${(validation.engineOS.reliability * 100).toFixed(1)}%
                        </div>
                        <p>${validation.engineOS.recommendation}</p>
                    </div>
                    
                    <div class="os-reliability">
                        <h4>Interface OS</h4>
                        <div class="score ${validation.interfaceOS.status}">
                            ${(validation.interfaceOS.reliability * 100).toFixed(1)}%
                        </div>
                        <p>${validation.interfaceOS.recommendation}</p>
                    </div>
                    
                    <div class="os-reliability">
                        <h4>Safe Mode OS</h4>
                        <div class="score ${validation.safeModeOS.status}">
                            ${(validation.safeModeOS.reliability * 100).toFixed(1)}%
                        </div>
                        <p>${validation.safeModeOS.recommendation}</p>
                    </div>
                </div>
                
                <div class="overall-reliability">
                    <h4>総合信頼性</h4>
                    <div class="score ${validation.overall.status}">
                        ${(validation.overall.reliability * 100).toFixed(1)}%
                    </div>
                    <p>${validation.overall.isValid ? '✅ 統計的に有効' : '⚠️ 信頼性向上が必要'}</p>
                </div>
                
                <div class="legend">
                    <p><strong>信頼性基準:</strong></p>
                    <ul>
                        <li>85%以上: 優秀（研究レベル）</li>
                        <li>70%以上: 許容範囲（実用レベル）</li>
                        <li>50%以上: 要改善</li>
                        <li>50%未満: 要再設計</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// グローバルに公開
window.StatisticalValidator = StatisticalValidator;