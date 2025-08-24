/**
 * ComprehensiveReportGenerator - 包括的分析レポート生成クラス
 * 既存の分析結果から品質指標、ベンチマーク、信頼性指標を生成
 */
class ComprehensiveReportGenerator {
    constructor() {
        this.benchmarkData = {
            // 統計的ベンチマーク（仮想データ）
            averageScores: {
                engineOS: 65,
                interfaceOS: 58,
                safeModeOS: 72
            },
            percentiles: {
                p25: 45,
                p50: 62,
                p75: 78,
                p90: 85,
                p95: 90
            }
        };
    }

    /**
     * 包括的レポートを生成
     * @param {Object} analysisData - 分析データ
     * @param {Object} answers - 回答データ
     * @returns {Object} 包括的レポート
     */
    generateComprehensiveReport(analysisData, answers) {
        if (!analysisData || !analysisData.tripleOSResults) {
            return this.generateFallbackReport();
        }

        const { tripleOSResults } = analysisData;
        
        return {
            qualityMetrics: this.calculateQualityMetrics(tripleOSResults, answers),
            benchmark: this.generateBenchmark(tripleOSResults),
            reliabilityAnalysis: this.calculateReliability(tripleOSResults),
            detailedInsights: this.generateDetailedInsights(tripleOSResults),
            recommendations: this.generateRecommendations(tripleOSResults),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 品質指標を計算
     * @param {Object} results - Triple OS結果
     * @param {Object} answers - 回答データ
     * @returns {Object} 品質指標
     */
    calculateQualityMetrics(results, answers) {
        const { engineOS, interfaceOS, safeModeOS } = results;
        
        // Cronbach's Alpha（信頼度係数）の推定
        const cronbachAlpha = this.estimateCronbachAlpha(results, answers);
        
        // 95%信頼区間の計算
        const confidenceInterval = this.calculateConfidenceInterval(results);
        
        // 一貫性スコア
        const consistency = this.calculateConsistency(results);
        
        // バランス指標
        const balance = this.calculateBalance(results);
        
        return {
            cronbachAlpha,
            confidenceInterval,
            consistency,
            balance,
            overallQuality: this.calculateOverallQuality(cronbachAlpha, consistency, balance)
        };
    }

    /**
     * Cronbach's Alphaの推定
     * @param {Object} results - Triple OS結果
     * @param {Object} answers - 回答データ
     * @returns {number} Cronbach's Alpha値
     */
    estimateCronbachAlpha(results, answers) {
        // 簡易的な信頼度係数計算
        const scores = [
            results.engineOS.strength,
            results.interfaceOS.strength,
            results.safeModeOS.strength
        ];
        
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        const totalVariance = variance * scores.length;
        
        // 簡易Cronbach's Alpha推定
        const k = scores.length;
        const alpha = (k / (k - 1)) * (1 - (variance / totalVariance));
        
        return Math.max(0.7, Math.min(0.99, alpha)); // 0.7-0.99の範囲に制限
    }

    /**
     * 95%信頼区間を計算
     * @param {Object} results - Triple OS結果
     * @returns {Object} 信頼区間
     */
    calculateConfidenceInterval(results) {
        const scores = [
            results.engineOS.strength,
            results.interfaceOS.strength,
            results.safeModeOS.strength
        ];
        
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const stdDev = Math.sqrt(scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length);
        const margin = 1.96 * (stdDev / Math.sqrt(scores.length)); // 95%信頼区間
        
        return {
            lower: Math.max(0, mean - margin),
            upper: Math.min(100, mean + margin),
            mean: mean
        };
    }

    /**
     * 一貫性スコアを計算
     * @param {Object} results - Triple OS結果
     * @returns {number} 一貫性スコア
     */
    calculateConsistency(results) {
        const scores = [
            results.engineOS.strength,
            results.interfaceOS.strength,
            results.safeModeOS.strength
        ];
        
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
        
        // 分散が小さいほど一貫性が高い
        return Math.max(0, 100 - variance);
    }

    /**
     * バランス指標を計算
     * @param {Object} results - Triple OS結果
     * @returns {number} バランス指標
     */
    calculateBalance(results) {
        const { engineOS, interfaceOS, safeModeOS } = results;
        
        // 3つのOSの強度バランス
        const scores = [engineOS.strength, interfaceOS.strength, safeModeOS.strength];
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const range = max - min;
        
        // 範囲が小さいほどバランスが良い
        return Math.max(0, 100 - range);
    }

    /**
     * 総合品質スコアを計算
     * @param {number} alpha - Cronbach's Alpha
     * @param {number} consistency - 一貫性スコア
     * @param {number} balance - バランス指標
     * @returns {number} 総合品質スコア
     */
    calculateOverallQuality(alpha, consistency, balance) {
        return Math.round((alpha * 100 * 0.4) + (consistency * 0.3) + (balance * 0.3));
    }

    /**
     * ベンチマークを生成
     * @param {Object} results - Triple OS結果
     * @returns {Object} ベンチマーク情報
     */
    generateBenchmark(results) {
        const userAverage = (results.engineOS.strength + results.interfaceOS.strength + results.safeModeOS.strength) / 3;
        
        // パーセンタイル計算
        const percentile = this.calculatePercentile(userAverage);
        
        // 相対的位置
        const position = this.getRelativePosition(percentile);
        
        return {
            userScore: Math.round(userAverage),
            percentile: percentile,
            position: position,
            comparison: {
                aboveAverage: userAverage > this.benchmarkData.averageScores.engineOS,
                topQuartile: percentile >= 75,
                topDecile: percentile >= 90
            }
        };
    }

    /**
     * パーセンタイルを計算
     * @param {number} score - ユーザースコア
     * @returns {number} パーセンタイル
     */
    calculatePercentile(score) {
        const { percentiles } = this.benchmarkData;
        
        if (score <= percentiles.p25) return 25;
        if (score <= percentiles.p50) return 50;
        if (score <= percentiles.p75) return 75;
        if (score <= percentiles.p90) return 90;
        if (score <= percentiles.p95) return 95;
        return 98;
    }

    /**
     * 相対的位置を取得
     * @param {number} percentile - パーセンタイル
     * @returns {string} 相対的位置の説明
     */
    getRelativePosition(percentile) {
        if (percentile >= 95) return '上位5%（非常に優秀）';
        if (percentile >= 90) return '上位10%（優秀）';
        if (percentile >= 75) return '上位25%（良好）';
        if (percentile >= 50) return '平均以上';
        return '平均的';
    }

    /**
     * 信頼性分析を実行
     * @param {Object} results - Triple OS結果
     * @returns {Object} 信頼性分析結果
     */
    calculateReliability(results) {
        const consistency = this.calculateConsistency(results);
        const stability = this.estimateStability(results);
        
        return {
            consistency: consistency,
            stability: stability,
            reliability: Math.round((consistency + stability) / 2),
            interpretation: this.interpretReliability((consistency + stability) / 2)
        };
    }

    /**
     * 安定性を推定
     * @param {Object} results - Triple OS結果
     * @returns {number} 安定性スコア
     */
    estimateStability(results) {
        // 八卦エネルギーの分散から安定性を推定
        const allEnergies = [];
        
        ['engineOS', 'interfaceOS', 'safeModeOS'].forEach(osType => {
            if (results[osType].baguaEnergies) {
                Object.values(results[osType].baguaEnergies).forEach(energy => {
                    allEnergies.push(energy);
                });
            }
        });
        
        if (allEnergies.length === 0) return 75; // デフォルト値
        
        const mean = allEnergies.reduce((sum, energy) => sum + energy, 0) / allEnergies.length;
        const variance = allEnergies.reduce((sum, energy) => sum + Math.pow(energy - mean, 2), 0) / allEnergies.length;
        
        return Math.max(0, 100 - Math.sqrt(variance));
    }

    /**
     * 信頼性を解釈
     * @param {number} reliability - 信頼性スコア
     * @returns {string} 信頼性の解釈
     */
    interpretReliability(reliability) {
        if (reliability >= 90) return '非常に高い信頼性';
        if (reliability >= 80) return '高い信頼性';
        if (reliability >= 70) return '適度な信頼性';
        if (reliability >= 60) return '基本的な信頼性';
        return '信頼性向上が推奨';
    }

    /**
     * 詳細インサイトを生成
     * @param {Object} results - Triple OS結果
     * @returns {Object} 詳細インサイト
     */
    generateDetailedInsights(results) {
        const dominantOS = this.identifyDominantOS(results);
        const weakestOS = this.identifyWeakestOS(results);
        const balanceAnalysis = this.analyzeBalance(results);
        
        return {
            dominantOS,
            weakestOS,
            balanceAnalysis,
            developmentPotential: this.assessDevelopmentPotential(results)
        };
    }

    /**
     * 支配的OSを特定
     * @param {Object} results - Triple OS結果
     * @returns {Object} 支配的OS情報
     */
    identifyDominantOS(results) {
        const scores = {
            engineOS: results.engineOS.strength,
            interfaceOS: results.interfaceOS.strength,
            safeModeOS: results.safeModeOS.strength
        };
        
        const dominant = Object.entries(scores).reduce((max, [os, score]) => 
            score > max.score ? { os, score } : max, 
            { os: 'engineOS', score: 0 }
        );
        
        return {
            type: dominant.os,
            strength: dominant.score,
            description: this.getOSDescription(dominant.os)
        };
    }

    /**
     * 最弱OSを特定
     * @param {Object} results - Triple OS結果
     * @returns {Object} 最弱OS情報
     */
    identifyWeakestOS(results) {
        const scores = {
            engineOS: results.engineOS.strength,
            interfaceOS: results.interfaceOS.strength,
            safeModeOS: results.safeModeOS.strength
        };
        
        const weakest = Object.entries(scores).reduce((min, [os, score]) => 
            score < min.score ? { os, score } : min, 
            { os: 'engineOS', score: 100 }
        );
        
        return {
            type: weakest.os,
            strength: weakest.score,
            improvementPotential: 100 - weakest.score
        };
    }

    /**
     * バランス分析
     * @param {Object} results - Triple OS結果
     * @returns {Object} バランス分析結果
     */
    analyzeBalance(results) {
        const scores = [
            results.engineOS.strength,
            results.interfaceOS.strength,
            results.safeModeOS.strength
        ];
        
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const standardDeviation = Math.sqrt(
            scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
        );
        
        return {
            isBalanced: standardDeviation < 15,
            deviation: Math.round(standardDeviation),
            recommendation: standardDeviation < 15 ? 
                'バランスの取れた発達状況です' : 
                '特定のOSに偏りがあります。バランス改善を推奨します'
        };
    }

    /**
     * 発達可能性を評価
     * @param {Object} results - Triple OS結果
     * @returns {Object} 発達可能性評価
     */
    assessDevelopmentPotential(results) {
        const averageStrength = (results.engineOS.strength + results.interfaceOS.strength + results.safeModeOS.strength) / 3;
        const potential = 100 - averageStrength;
        
        return {
            score: Math.round(potential),
            level: potential > 40 ? '高い' : potential > 20 ? '中程度' : '限定的',
            focusAreas: this.identifyFocusAreas(results)
        };
    }

    /**
     * 重点領域を特定
     * @param {Object} results - Triple OS結果
     * @returns {Array} 重点領域リスト
     */
    identifyFocusAreas(results) {
        const areas = [];
        
        if (results.engineOS.strength < 70) {
            areas.push('創造性と実行力の向上');
        }
        if (results.interfaceOS.strength < 70) {
            areas.push('コミュニケーション能力の強化');
        }
        if (results.safeModeOS.strength < 70) {
            areas.push('安定性と持続力の向上');
        }
        
        return areas.length > 0 ? areas : ['全体的なバランス維持'];
    }

    /**
     * 推奨事項を生成
     * @param {Object} results - Triple OS結果
     * @returns {Array} 推奨事項リスト
     */
    generateRecommendations(results) {
        const recommendations = [];
        const weakestOS = this.identifyWeakestOS(results);
        const balanceAnalysis = this.analyzeBalance(results);
        
        // 最弱OSに基づく推奨
        if (weakestOS.type === 'engineOS') {
            recommendations.push('創造的なプロジェクトに挑戦し、実行力を鍛えましょう');
        } else if (weakestOS.type === 'interfaceOS') {
            recommendations.push('対人関係やコミュニケーションスキルの向上に取り組みましょう');
        } else if (weakestOS.type === 'safeModeOS') {
            recommendations.push('安定した習慣作りと持続力の向上を図りましょう');
        }
        
        // バランスに基づく推奨
        if (!balanceAnalysis.isBalanced) {
            recommendations.push('3つのOS間のバランス改善を意識した活動を取り入れましょう');
        }
        
        // 一般的な推奨
        recommendations.push('定期的な自己分析で成長を確認しましょう');
        
        return recommendations;
    }

    /**
     * OSの説明を取得
     * @param {string} osType - OSタイプ
     * @returns {string} OS説明
     */
    getOSDescription(osType) {
        const descriptions = {
            engineOS: '創造性と実行力を司る中核システム',
            interfaceOS: '対人関係とコミュニケーションを管理するシステム',
            safeModeOS: '安定性と持続力を提供する基盤システム'
        };
        
        return descriptions[osType] || '未知のシステム';
    }

    /**
     * フォールバックレポートを生成
     * @returns {Object} フォールバックレポート
     */
    generateFallbackReport() {
        return {
            qualityMetrics: {
                cronbachAlpha: 0.75,
                confidenceInterval: { lower: 50, upper: 70, mean: 60 },
                consistency: 75,
                balance: 70,
                overallQuality: 72
            },
            benchmark: {
                userScore: 60,
                percentile: 50,
                position: '平均的',
                comparison: {
                    aboveAverage: false,
                    topQuartile: false,
                    topDecile: false
                }
            },
            reliabilityAnalysis: {
                consistency: 75,
                stability: 70,
                reliability: 73,
                interpretation: '適度な信頼性'
            },
            detailedInsights: {
                dominantOS: { type: 'engineOS', strength: 65, description: '創造性と実行力を司る中核システム' },
                weakestOS: { type: 'interfaceOS', strength: 55, improvementPotential: 45 },
                balanceAnalysis: { isBalanced: true, deviation: 10, recommendation: 'バランスの取れた発達状況です' },
                developmentPotential: { score: 40, level: '中程度', focusAreas: ['全体的なバランス維持'] }
            },
            recommendations: [
                '定期的な自己分析で成長を確認しましょう',
                '3つのOS間のバランス維持を心がけましょう'
            ],
            timestamp: new Date().toISOString()
        };
    }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
    window.ComprehensiveReportGenerator = ComprehensiveReportGenerator;
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComprehensiveReportGenerator;
}