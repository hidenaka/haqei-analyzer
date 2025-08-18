/**
 * Future Simulator 調査データ分析システム
 * ブラウザのlocalStorageから調査データを読み込み、詳細分析を実行
 */

import fs from 'fs';

class SurveyDataAnalyzer {
    constructor() {
        this.data = [];
        this.statistics = {};
    }

    /**
     * 調査データの読み込み（100名テストデータまたはサンプルデータ）
     */
    loadSampleData() {
        // 100名テストデータの読み込み
        try {
            const group1File = JSON.parse(fs.readFileSync('./test-users-group-1-2025-07-31.json', 'utf8'));
            const group2File = JSON.parse(fs.readFileSync('./test-users-group-2-2025-07-31.json', 'utf8'));
            const group3File = JSON.parse(fs.readFileSync('./test-users-group-3-2025-07-31.json', 'utf8'));
            const group4File = JSON.parse(fs.readFileSync('./test-users-group-4-2025-07-31.json', 'utf8'));
            
            // データ構造に応じた読み込み（グループファイルからdataプロパティを取得）
            const group1Data = group1File.data || group1File;
            const group2Data = group2File.data || group2File;
            const group3Data = group3File.data || group3File;
            const group4Data = group4File.data || group4File;
            
            this.data = [...group1Data, ...group2Data, ...group3Data, ...group4Data];
            console.log(`✅ 100名テストデータを読み込み完了: ${this.data.length}件`);
            return;
        } catch (error) {
            console.log('⚠️  100名テストデータが見つかりません。サンプルデータを使用します。');
            console.log('   エラー詳細:', error.message);
        }
        
        // フォールバック: サンプルデータ（実際のテスト結果の模擬）
        this.data = [
            {
                id: 1001,
                timestamp: '2025-07-31T10:30:00.000Z',
                ageGroup: '30s',
                occupation: 'employee',
                consultationType: 'personal',
                hexagramResult: '3卦2爻',
                confidenceLevel: '78%',
                responseTime: 'good',
                satisfaction: '4',
                usefulness: '4',
                clarity: '5',
                usability: '4',
                overallValue: '4',
                impressivePoint: '卦の選択理由が詳しく説明されていて納得できた',
                improvementPoint: '結果の表示がもう少し分かりやすいと良い',
                recommendation: '推奨する。自分の状況を客観視できた',
                additionalComments: '思ったより使いやすかった'
            },
            {
                id: 1002,
                timestamp: '2025-07-31T11:15:00.000Z',
                ageGroup: '40s',
                occupation: 'professional',
                consultationType: 'career',
                hexagramResult: '5卦1爻',
                confidenceLevel: '85%',
                responseTime: 'fast',
                satisfaction: '5',
                usefulness: '5',
                clarity: '4',
                usability: '5',
                overallValue: '5',
                impressivePoint: '転職への迷いに対して適切なアドバイスがもらえた',
                improvementPoint: '特になし',
                recommendation: '同僚にも紹介したい',
                additionalComments: '易経の知識がなくても理解できる説明が良かった'
            },
            {
                id: 1003,
                timestamp: '2025-07-31T14:20:00.000Z',
                ageGroup: '20s',
                occupation: 'other',
                consultationType: 'relationship',
                hexagramResult: '31卦4爻',
                confidenceLevel: '72%',
                responseTime: 'good',
                satisfaction: '3',
                usefulness: '3',
                clarity: '3',
                usability: '4',
                overallValue: '3',
                impressivePoint: 'システムの応答が早い',
                improvementPoint: '解釈がもう少し具体的だと良い',
                recommendation: 'どちらとも言えない',
                additionalComments: '興味深いが、もう少し詳しい説明がほしい'
            },
            {
                id: 1004,
                timestamp: '2025-07-31T15:45:00.000Z',
                ageGroup: '30s',
                occupation: 'selfemployed',
                consultationType: 'personal',
                hexagramResult: '29卦3爻',
                confidenceLevel: '80%',
                responseTime: 'good',
                satisfaction: '4',
                usefulness: '4',
                clarity: '4',
                usability: '3',
                overallValue: '4',
                impressivePoint: '困難な状況への対処法が参考になった',
                improvementPoint: '操作方法の説明があると良い',
                recommendation: '似たような悩みを持つ人には推奨',
                additionalComments: '今後も使ってみたい'
            },
            {
                id: 1005,
                timestamp: '2025-07-31T16:30:00.000Z',
                ageGroup: '50s',
                occupation: 'professional',
                consultationType: 'life',
                hexagramResult: '20卦5爻',
                confidenceLevel: '88%',
                responseTime: 'fast',
                satisfaction: '5',
                usefulness: '5',
                clarity: '5',
                usability: '4',
                overallValue: '5',
                impressivePoint: '人生の節目での指針として非常に有用',
                improvementPoint: '特になし',
                recommendation: '強く推奨する',
                additionalComments: '易経の現代的な活用として素晴らしい'
            }
        ];

        console.log(`📊 サンプルデータ読み込み完了: ${this.data.length}件`);
    }

    /**
     * 基本統計の計算
     */
    calculateBasicStatistics() {
        if (this.data.length === 0) {
            console.log('❌ データがありません');
            return;
        }

        const ratings = this.data.map(item => ({
            satisfaction: parseInt(item.satisfaction),
            usefulness: parseInt(item.usefulness),
            clarity: parseInt(item.clarity),
            usability: parseInt(item.usability),
            overallValue: parseInt(item.overallValue)
        }));

        const averages = {
            satisfaction: this.calculateAverage(ratings.map(r => r.satisfaction)),
            usefulness: this.calculateAverage(ratings.map(r => r.usefulness)),
            clarity: this.calculateAverage(ratings.map(r => r.clarity)),
            usability: this.calculateAverage(ratings.map(r => r.usability)),
            overallValue: this.calculateAverage(ratings.map(r => r.overallValue))
        };

        const overallScore = this.calculateAverage(Object.values(averages));

        // 信頼区間計算用の全評価値配列
        const allRatings = ratings.map(r => 
            (r.satisfaction + r.usefulness + r.clarity + r.usability + r.overallValue) / 5
        );
        
        this.statistics = {
            totalResponses: this.data.length,
            averages,
            overallScore,
            confidenceInterval: this.calculateConfidenceInterval(allRatings),
            correlationAnalysis: this.calculateCorrelationAnalysis(),
            segmentAnalysis: this.calculateSegmentAnalysis(),
            responseTimeDistribution: this.calculateResponseTimeDistribution(),
            demographicBreakdown: this.calculateDemographicBreakdown(),
            satisfactionDistribution: this.calculateSatisfactionDistribution()
        };

        return this.statistics;
    }

    calculateAverage(numbers) {
        return Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 10) / 10;
    }

    /**
     * 標準偏差の計算
     */
    calculateStandardDeviation(numbers) {
        const mean = this.calculateAverage(numbers);
        const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
        const variance = this.calculateAverage(squaredDifferences);
        return Math.sqrt(variance);
    }

    /**
     * 95%信頼区間の計算
     */
    calculateConfidenceInterval(numbers, confidenceLevel = 0.95) {
        const n = numbers.length;
        const mean = this.calculateAverage(numbers);
        const stdDev = this.calculateStandardDeviation(numbers);
        const standardError = stdDev / Math.sqrt(n);
        
        // t分布の臨界値（簡易計算、n>30の場合は正規分布近似）
        const tValue = n > 30 ? 1.96 : this.getTValueApproximation(n - 1, confidenceLevel);
        
        const marginOfError = tValue * standardError;
        
        return {
            mean: Math.round(mean * 1000) / 1000,
            lowerBound: Math.round((mean - marginOfError) * 1000) / 1000,
            upperBound: Math.round((mean + marginOfError) * 1000) / 1000,
            marginOfError: Math.round(marginOfError * 1000) / 1000,
            standardError: Math.round(standardError * 1000) / 1000,
            standardDeviation: Math.round(stdDev * 1000) / 1000,
            sampleSize: n,
            confidenceLevel: Math.round(confidenceLevel * 100)
        };
    }

    /**
     * t分布臨界値の近似計算
     */
    getTValueApproximation(df, confidenceLevel) {
        // 簡易的なt値テーブル（自由度と信頼水準に基づく）
        const tTable = {
            0.95: { // 95%信頼区間
                1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
                10: 2.228, 15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
            },
            0.99: { // 99%信頼区間
                1: 63.657, 2: 9.925, 3: 5.841, 4: 4.604, 5: 4.032,
                10: 3.169, 15: 2.947, 20: 2.845, 25: 2.787, 30: 2.750
            }
        };
        
        const table = tTable[confidenceLevel] || tTable[0.95];
        
        // 最も近い自由度の値を返す
        const availableDf = Object.keys(table).map(Number).sort((a, b) => a - b);
        for (let i = 0; i < availableDf.length; i++) {
            if (df <= availableDf[i]) {
                return table[availableDf[i]];
            }
        }
        return 1.96; // 大サンプル近似
    }

    /**
     * 相関分析の実行
     */
    calculateCorrelationAnalysis() {
        const ratings = this.data.map(item => ({
            satisfaction: parseInt(item.satisfaction),
            usefulness: parseInt(item.usefulness),
            clarity: parseInt(item.clarity),
            usability: parseInt(item.usability),
            overallValue: parseInt(item.overallValue)
        }));

        const metrics = ['satisfaction', 'usefulness', 'clarity', 'usability', 'overallValue'];
        const correlations = {};
        
        for (let i = 0; i < metrics.length; i++) {
            for (let j = i + 1; j < metrics.length; j++) {
                const metric1 = metrics[i];
                const metric2 = metrics[j];
                const correlation = this.calculatePearsonCorrelation(
                    ratings.map(r => r[metric1]),
                    ratings.map(r => r[metric2])
                );
                correlations[`${metric1}_${metric2}`] = {
                    correlation: Math.round(correlation * 1000) / 1000,
                    strength: this.interpretCorrelationStrength(correlation),
                    significance: this.assessCorrelationSignificance(correlation, ratings.length)
                };
            }
        }
        
        return correlations;
    }

    /**
     * ピアソン相関係数の計算
     */
    calculatePearsonCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * 相関の強さの解釈
     */
    interpretCorrelationStrength(r) {
        const abs_r = Math.abs(r);
        if (abs_r >= 0.8) return '非常に強い';
        if (abs_r >= 0.6) return '強い';
        if (abs_r >= 0.4) return '中程度';
        if (abs_r >= 0.2) return '弱い';
        return 'ほとんどなし';
    }

    /**
     * 相関の有意性評価
     */
    assessCorrelationSignificance(r, n) {
        // 簡易的な有意性判定（t検定近似）
        const t = Math.abs(r) * Math.sqrt((n - 2) / (1 - r * r));
        const critical_t_05 = 1.96; // α=0.05での近似
        const critical_t_01 = 2.58; // α=0.01での近似
        
        if (t > critical_t_01) return 'p < 0.01 (非常に有意)';
        if (t > critical_t_05) return 'p < 0.05 (有意)';
        return '有意でない';
    }

    /**
     * セグメント別詳細分析
     */
    calculateSegmentAnalysis() {
        const segments = {
            age: this.analyzeBySegment('ageGroup'),
            occupation: this.analyzeBySegment('occupation'),
            consultationType: this.analyzeBySegment('consultationType')
        };
        
        // セグメント間比較
        const comparisons = {
            ageSegmentComparison: this.compareSegments(segments.age),
            occupationSegmentComparison: this.compareSegments(segments.occupation),
            consultationSegmentComparison: this.compareSegments(segments.consultationType)
        };
        
        return { segments, comparisons };
    }

    /**
     * 特定属性によるセグメント分析
     */
    analyzeBySegment(attribute) {
        const segmentData = {};
        const uniqueValues = [...new Set(this.data.map(item => item[attribute]))];
        
        uniqueValues.forEach(value => {
            const segmentItems = this.data.filter(item => item[attribute] === value);
            const ratings = segmentItems.map(item => ({
                satisfaction: parseInt(item.satisfaction),
                usefulness: parseInt(item.usefulness),
                clarity: parseInt(item.clarity),
                usability: parseInt(item.usability),
                overallValue: parseInt(item.overallValue)
            }));
            
            const overallScores = ratings.map(r => 
                (r.satisfaction + r.usefulness + r.clarity + r.usability + r.overallValue) / 5
            );
            
            segmentData[value] = {
                count: segmentItems.length,
                averages: {
                    satisfaction: this.calculateAverage(ratings.map(r => r.satisfaction)),
                    usefulness: this.calculateAverage(ratings.map(r => r.usefulness)),
                    clarity: this.calculateAverage(ratings.map(r => r.clarity)),
                    usability: this.calculateAverage(ratings.map(r => r.usability)),
                    overallValue: this.calculateAverage(ratings.map(r => r.overallValue))
                },
                overallScore: this.calculateAverage(overallScores),
                confidenceInterval: this.calculateConfidenceInterval(overallScores),
                qualityGrade: this.determineQualityLevel(this.calculateAverage(overallScores))
            };
        });
        
        return segmentData;
    }

    /**
     * セグメント間比較分析
     */
    compareSegments(segmentData) {
        const segments = Object.keys(segmentData);
        const comparisons = [];
        
        for (let i = 0; i < segments.length; i++) {
            for (let j = i + 1; j < segments.length; j++) {
                const seg1 = segments[i];
                const seg2 = segments[j];
                const diff = segmentData[seg1].overallScore - segmentData[seg2].overallScore;
                
                comparisons.push({
                    segment1: seg1,
                    segment2: seg2,
                    scoreDifference: Math.round(diff * 1000) / 1000,
                    significantDifference: Math.abs(diff) > 0.2 ? '有意差あり' : '有意差なし',
                    betterSegment: diff > 0 ? seg1 : seg2
                });
            }
        }
        
        return comparisons;
    }

    calculateResponseTimeDistribution() {
        const distribution = {};
        this.data.forEach(item => {
            distribution[item.responseTime] = (distribution[item.responseTime] || 0) + 1;
        });
        return distribution;
    }

    calculateDemographicBreakdown() {
        return {
            ageGroups: this.getDistribution('ageGroup'),
            occupations: this.getDistribution('occupation'),
            consultationTypes: this.getDistribution('consultationType')
        };
    }

    calculateSatisfactionDistribution() {
        const distribution = {};
        this.data.forEach(item => {
            const overall = parseInt(item.overallValue);
            distribution[overall] = (distribution[overall] || 0) + 1;
        });
        return distribution;
    }

    getDistribution(field) {
        const distribution = {};
        this.data.forEach(item => {
            distribution[item[field]] = (distribution[item[field]] || 0) + 1;
        });
        return distribution;
    }

    /**
     * 詳細分析レポートの生成
     */
    generateDetailedReport() {
        const stats = this.calculateBasicStatistics();
        
        const report = {
            executionDate: new Date().toISOString(),
            summary: {
                totalResponses: stats.totalResponses,
                overallScore: stats.overallScore,
                averageRatings: stats.averages,
                qualityJudgment: this.determineQualityLevel(stats.overallScore),
                confidenceInterval: stats.confidenceInterval,
                qualityGrade: this.determineQualityGrade(stats.overallScore, stats.confidenceInterval),
                deploymentDecision: this.makeDeploymentDecision(stats.overallScore, stats.confidenceInterval)
            },
            statisticalAnalysis: {
                basicStatistics: this.generateDescriptiveStatistics(),
                confidenceIntervals: this.generateAllConfidenceIntervals(),
                correlationAnalysis: stats.correlationAnalysis,
                segmentAnalysis: stats.segmentAnalysis
            },
            qualityImprovementAnalysis: stats.overallScore < 3.7 ? this.analyzeQualityImprovementPath() : null,
            demographics: stats.demographicBreakdown,
            performanceMetrics: {
                responseTimeDistribution: stats.responseTimeDistribution,
                satisfactionDistribution: stats.satisfactionDistribution
            },
            detailedAnalysis: this.performDetailedAnalysis(),
            recommendations: this.generateRecommendations(),
            rawData: this.data
        };

        return report;
    }

    determineQualityLevel(score) {
        if (score >= 4.0) return 'A級 - 即座実用化推奨';
        if (score >= 3.5) return 'B級 - 条件付き実用化';
        if (score >= 3.0) return 'C級 - 改善後実用化';
        return 'D級 - 大幅改善必要';
    }

    /**
     * 信頼区間を考慮した品質グレード判定
     */
    determineQualityGrade(score, confidenceInterval) {
        const lowerBound = confidenceInterval.lowerBound;
        
        // 信頼区間の下限でA級基準（3.7）を満たすかチェック
        if (lowerBound >= 3.7) return 'A級 - 統計的確信度高';
        if (lowerBound >= 3.5) return 'B級 - 統計的に良好';
        if (lowerBound >= 3.0) return 'C級 - 改善後実用化';
        if (lowerBound >= 2.5) return 'D級 - 大幅改善必要';
        return 'E級 - 実用化困難';
    }

    /**
     * デプロイメント判定
     */
    makeDeploymentDecision(score, confidenceInterval) {
        const lowerBound = confidenceInterval.lowerBound;
        
        if (lowerBound >= 3.7) return 'APPROVE';
        if (lowerBound >= 3.5 && score >= 3.7) return 'CONDITIONAL_APPROVE';
        if (lowerBound >= 3.0) return 'DEFER';
        return 'REJECT';
    }

    /**
     * 全指標の記述統計
     */
    generateDescriptiveStatistics() {
        const metrics = ['satisfaction', 'usefulness', 'clarity', 'usability', 'overallValue'];
        const stats = {};
        
        metrics.forEach(metric => {
            const values = this.data.map(item => parseInt(item[metric]));
            stats[metric] = {
                n: values.length,
                mean: this.calculateAverage(values),
                median: this.calculateMedian(values),
                mode: this.calculateMode(values),
                stdDev: Math.round(this.calculateStandardDeviation(values) * 1000) / 1000,
                variance: Math.round(Math.pow(this.calculateStandardDeviation(values), 2) * 1000) / 1000,
                standardError: Math.round((this.calculateStandardDeviation(values) / Math.sqrt(values.length)) * 1000) / 1000,
                min: Math.min(...values),
                max: Math.max(...values),
                range: Math.max(...values) - Math.min(...values),
                percentiles: this.calculatePercentiles(values),
                skewness: Math.round(this.calculateSkewness(values) * 1000) / 1000,
                kurtosis: Math.round(this.calculateKurtosis(values) * 1000) / 1000
            };
        });
        
        return stats;
    }

    /**
     * 全指標の信頼区間
     */
    generateAllConfidenceIntervals() {
        const metrics = ['satisfaction', 'usefulness', 'clarity', 'usability', 'overallValue'];
        const intervals = {};
        
        metrics.forEach(metric => {
            const values = this.data.map(item => parseInt(item[metric]));
            intervals[metric] = this.calculateConfidenceInterval(values);
        });
        
        return intervals;
    }

    // 統計計算補助関数
    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
    }
    
    calculateMode(values) {
        const frequency = {};
        values.forEach(value => frequency[value] = (frequency[value] || 0) + 1);
        return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    }
    
    calculatePercentiles(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const n = sorted.length;
        return {
            p25: sorted[Math.floor(n * 0.25)],
            p50: sorted[Math.floor(n * 0.50)],
            p75: sorted[Math.floor(n * 0.75)]
        };
    }
    
    calculateSkewness(values) {
        const mean = this.calculateAverage(values);
        const stdDev = this.calculateStandardDeviation(values);
        const n = values.length;
        const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
        return (n / ((n - 1) * (n - 2))) * sum;
    }
    
    calculateKurtosis(values) {
        const mean = this.calculateAverage(values);
        const stdDev = this.calculateStandardDeviation(values);
        const n = values.length;
        const sum = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
        return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    }

    /**
     * C級→A級品質向上分析
     */
    analyzeQualityImprovementPath() {
        const currentStats = this.calculateBasicStatistics();
        const targetScore = 3.7; // A級基準
        const currentScore = currentStats.overallScore;
        const requiredImprovement = targetScore - currentScore;
        
        const improvementAnalysis = {
            currentState: {
                overallScore: currentScore,
                confidenceInterval: currentStats.confidenceInterval,
                gradeAssessment: this.determineQualityGrade(currentScore, currentStats.confidenceInterval),
                deploymentDecision: this.makeDeploymentDecision(currentScore, currentStats.confidenceInterval)
            },
            targetState: {
                targetScore: targetScore,
                requiredImprovement: Math.round(requiredImprovement * 1000) / 1000,
                improvementPercentage: Math.round((requiredImprovement / currentScore) * 100 * 10) / 10
            },
            criticalFactors: this.identifyCriticalImprovementFactors(),
            improvementStrategies: this.generateImprovementStrategies(),
            achievabilityAssessment: this.assessAchievability(currentScore, targetScore),
            prioritizedActions: this.prioritizeImprovementActions()
        };
        
        return improvementAnalysis;
    }

    /**
     * 重要改善要因の特定
     */
    identifyCriticalImprovementFactors() {
        const metrics = ['satisfaction', 'usefulness', 'clarity', 'usability', 'overallValue'];
        const currentStats = this.calculateBasicStatistics();
        const correlations = this.calculateCorrelationAnalysis();
        
        const factors = metrics.map(metric => {
            const currentAvg = currentStats.averages[metric];
            const improvementNeeded = 3.7 - currentAvg;
            const impactPotential = this.calculateImpactPotential(metric, correlations);
            
            return {
                metric: metric,
                currentScore: currentAvg,
                improvementNeeded: Math.round(improvementNeeded * 1000) / 1000,
                impactPotential: impactPotential,
                priority: this.calculateImprovementPriority(improvementNeeded, impactPotential),
                feasibility: this.assessImprovementFeasibility(metric, improvementNeeded)
            };
        }).sort((a, b) => b.priority - a.priority);
        
        return factors;
    }

    /**
     * メトリックの影響ポテンシャル計算
     */
    calculateImpactPotential(targetMetric, correlations) {
        let totalImpact = 0;
        let correlationCount = 0;
        
        Object.entries(correlations).forEach(([pair, data]) => {
            if (pair.includes(targetMetric)) {
                totalImpact += Math.abs(data.correlation);
                correlationCount++;
            }
        });
        
        return correlationCount > 0 ? totalImpact / correlationCount : 0;
    }

    /**
     * 改善優先度計算
     */
    calculateImprovementPriority(improvementNeeded, impactPotential) {
        // 改善必要度 × 影響ポテンシャル
        return Math.max(0, improvementNeeded) * impactPotential;
    }

    /**
     * 改善実現可能性評価
     */
    assessImprovementFeasibility(metric, improvementNeeded) {
        // 改善幅に基づいた実現可能性判定
        if (improvementNeeded <= 0) return '改善不要';
        if (improvementNeeded <= 0.3) return '高い';
        if (improvementNeeded <= 0.5) return '中程度';
        if (improvementNeeded <= 0.8) return '低い';
        return '非常に困難';
    }

    /**
     * 改善戦略の生成
     */
    generateImprovementStrategies() {
        const factors = this.identifyCriticalImprovementFactors();
        const topFactors = factors.slice(0, 3); // 上位3要因
        
        const strategies = topFactors.map(factor => {
            return {
                targetMetric: factor.metric,
                currentGap: factor.improvementNeeded,
                strategy: this.generateSpecificStrategy(factor.metric, factor.improvementNeeded),
                expectedImpact: this.estimateImprovementImpact(factor),
                implementationComplexity: this.assessImplementationComplexity(factor.metric),
                timeToImplement: this.estimateImplementationTime(factor.metric)
            };
        });
        
        return strategies;
    }

    /**
     * 具体的改善戦略の生成
     */
    generateSpecificStrategy(metric, gap) {
        const strategies = {
            satisfaction: {
                high: '結果の根拠説明を詳細化し、易経解釈の信頼性を向上させる',
                medium: 'ユーザー回答と結果の関連性を明確化し、納得感を高める',
                low: '結果表示のフォーマットを整理し、読みやすさを向上させる'
            },
            usefulness: {
                high: '実用的なアドバイスや行動指針を追加し、結果の実用性を向上させる',
                medium: '状況別の具体的な対応策や改善提案を充実させる',
                low: '日常的な活用方法やフォローアップ機能を追加する'
            },
            clarity: {
                high: 'UI/UXを大幅に改善し、情報の視覚的階層化を実現する',
                medium: '用語解説やヘルプ機能を充実させ、初心者にも理解しやすくする',
                low: '文言を精査し、より平易で理解しやすい表現に改善する'
            },
            usability: {
                high: 'ナビゲーションを根本的に見直し、直感的な操作を実現する',
                medium: 'ボタン配置やフォームデザインを最適化し、操作性を向上させる',
                low: 'ローディング時間短縮やレスポンシブ対応を改善する'
            },
            overallValue: {
                high: 'サービスの価値提案を明確化し、独自性や付加価値を強化する',
                medium: '結果の深みや網羅性を向上させ、総合的な価値を高める',
                low: 'ユーザーエクスペリエンスを整理し、一貫した品質を提供する'
            }
        };
        
        const level = gap > 0.5 ? 'high' : gap > 0.3 ? 'medium' : 'low';
        return strategies[metric] ? strategies[metric][level] : '汎用的な品質向上施策が必要';
    }

    /**
     * 改善インパクトの推算
     */
    estimateImprovementImpact(factor) {
        const impact = factor.priority * (factor.feasibility === '高い' ? 1.0 : 
                                       factor.feasibility === '中程度' ? 0.7 : 0.4);
        return {
            estimatedScoreIncrease: Math.round(impact * 100) / 100,
            probabilityOfSuccess: factor.feasibility === '高い' ? '80-90%' : 
                                 factor.feasibility === '中程度' ? '60-75%' : '30-50%',
            riskLevel: factor.feasibility === '高い' ? '低' : 
                      factor.feasibility === '中程度' ? '中' : '高'
        };
    }

    /**
     * 実装複雑度の評価
     */
    assessImplementationComplexity(metric) {
        const complexity = {
            satisfaction: '中', // コンテンツ改善
            usefulness: '高', // 機能追加が必要
            clarity: '中', // UI/UX改善
            usability: '高', // システム改修が必要
            overallValue: '高' // 包括的な改善が必要
        };
        return complexity[metric] || '中';
    }

    /**
     * 実装時間の推算
     */
    estimateImplementationTime(metric) {
        const timeEstimates = {
            satisfaction: '2-4週間', // コンテンツ改善
            usefulness: '6-8週間', // 機能追加
            clarity: '3-5週間', // UI/UX改善
            usability: '8-12週間', // システム改修
            overallValue: '10-16週間' // 包括的改善
        };
        return timeEstimates[metric] || '4-6週間';
    }

    /**
     * A級達成可能性の評価
     */
    assessAchievability(currentScore, targetScore) {
        const gap = targetScore - currentScore;
        const factors = this.identifyCriticalImprovementFactors();
        const highFeasibilityCount = factors.filter(f => f.feasibility === '高い').length;
        const totalImprovementPotential = factors.reduce((sum, f) => sum + (f.improvementNeeded > 0 ? f.improvementNeeded : 0), 0);
        
        return {
            overallFeasibility: gap <= 0.5 ? '高い' : gap <= 0.8 ? '中程度' : '低い',
            keyIndicators: {
                requiredGap: Math.round(gap * 1000) / 1000,
                highFeasibilityFactors: highFeasibilityCount,
                totalImprovementPotential: Math.round(totalImprovementPotential * 1000) / 1000
            },
            successProbability: this.calculateSuccessProbability(gap, highFeasibilityCount, totalImprovementPotential),
            recommendedApproach: this.recommendImplementationApproach(gap, factors)
        };
    }

    /**
     * 成功確率の計算
     */
    calculateSuccessProbability(gap, highFeasibilityCount, totalPotential) {
        let baseProbability = Math.max(0, Math.min(100, 100 - (gap * 100)));
        const feasibilityBonus = highFeasibilityCount * 10;
        const potentialBonus = Math.min(20, totalPotential * 25);
        
        const probability = Math.min(95, baseProbability + feasibilityBonus + potentialBonus);
        return Math.round(probability) + '%';
    }

    /**
     * 推奨実装アプローチ
     */
    recommendImplementationApproach(gap, factors) {
        if (gap <= 0.3) {
            return '漸進的改善: 高優先度要因を順次実装';
        } else if (gap <= 0.6) {
            return '段階的改善: 主要要因を並行して実装';
        } else {
            return '包括的改善: 全面的なシステム改修が必要';
        }
    }

    /**
     * 優先された改善アクション
     */
    prioritizeImprovementActions() {
        const strategies = this.generateImprovementStrategies();
        
        return strategies.map(strategy => ({
            action: strategy.strategy,
            targetMetric: strategy.targetMetric,
            priority: this.calculateActionPriority(strategy),
            estimatedEffort: strategy.implementationComplexity,
            expectedROI: this.calculateExpectedROI(strategy),
            timeline: strategy.timeToImplement,
            dependencies: this.identifyActionDependencies(strategy.targetMetric)
        })).sort((a, b) => b.priority - a.priority);
    }

    /**
     * アクション優先度計算
     */
    calculateActionPriority(strategy) {
        const impactScore = strategy.expectedImpact.estimatedScoreIncrease;
        const complexityPenalty = strategy.implementationComplexity === '高' ? 0.5 : 
                                 strategy.implementationComplexity === '中' ? 0.7 : 1.0;
        return impactScore * complexityPenalty;
    }

    /**
     * 期待ROI計算
     */
    calculateExpectedROI(strategy) {
        const benefit = strategy.expectedImpact.estimatedScoreIncrease;
        const cost = strategy.implementationComplexity === '高' ? 3 : 
                    strategy.implementationComplexity === '中' ? 2 : 1;
        return Math.round((benefit / cost) * 100) / 100;
    }

    /**
     * 依存関係特定
     */
    identifyActionDependencies(targetMetric) {
        const dependencies = {
            satisfaction: ['コンテンツ品質向上', 'データ品質確保'],
            usefulness: ['機能設計', 'ユーザーリサーチ'],
            clarity: ['UI/UXデザイン', 'コンテンツライティング'],
            usability: ['システムアーキテクチャ', 'パフォーマンス最適化'],
            overallValue: ['全メトリックのバランス調整', 'ブランド価値向上']
        };
        return dependencies[targetMetric] || ['一般的な品質管理'];
    }

    performDetailedAnalysis() {
        const highSatisfaction = this.data.filter(item => parseInt(item.overallValue) >= 4);
        const lowSatisfaction = this.data.filter(item => parseInt(item.overallValue) <= 2);

        return {
            highSatisfactionCount: highSatisfaction.length,
            lowSatisfactionCount: lowSatisfaction.length,
            commonPositivePoints: this.extractCommonPoints(highSatisfaction, 'impressivePoint'),
            commonImprovementPoints: this.extractCommonPoints(this.data, 'improvementPoint'),
            hexagramAccuracy: this.analyzeHexagramResults()
        };
    }

    extractCommonPoints(data, field) {
        const points = data.map(item => item[field]).filter(point => point && point.trim());
        // 簡易的なキーワード抽出（実際はより高度な自然言語処理が必要）
        const keywords = points.join(' ').split(/[\s、。！？]/)
            .filter(word => word.length > 1)
            .reduce((acc, word) => {
                acc[word] = (acc[word] || 0) + 1;
                return acc;
            }, {});
        
        return Object.entries(keywords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count }));
    }

    analyzeHexagramResults() {
        const hexagrams = this.data.map(item => {
            const match = item.hexagramResult.match(/(\d+)卦/);
            return match ? parseInt(match[1]) : null;
        }).filter(h => h !== null);

        const distribution = {};
        hexagrams.forEach(h => {
            distribution[h] = (distribution[h] || 0) + 1;
        });

        return {
            totalHexagrams: hexagrams.length,
            uniqueHexagrams: Object.keys(distribution).length,
            mostCommon: Object.entries(distribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([hex, count]) => ({ hexagram: parseInt(hex), count }))
        };
    }

    generateRecommendations() {
        const stats = this.statistics;
        const recommendations = [];

        // 満足度に基づく推奨事項
        if (stats.averages.satisfaction < 3.5) {
            recommendations.push({
                category: '満足度改善',
                priority: 'high',
                suggestion: '分析結果の根拠説明を更に詳細化し、ユーザーの納得度向上を図る'
            });
        }

        if (stats.averages.clarity < 3.5) {
            recommendations.push({
                category: 'UI/UX改善',
                priority: 'high',
                suggestion: '結果表示の分かりやすさを向上させる'
            });
        }

        if (stats.averages.usability < 3.5) {
            recommendations.push({
                category: 'システム改善',
                priority: 'medium',
                suggestion: '操作性の向上とユーザビリティの改善'
            });
        }

        // 応答時間に基づく推奨事項
        const slowResponses = (stats.responseTimeDistribution.slow || 0) / stats.totalResponses;
        if (slowResponses > 0.1) {
            recommendations.push({
                category: 'パフォーマンス',
                priority: 'medium',
                suggestion: '応答時間の短縮とシステム最適化'
            });
        }

        // 全体的な品質に基づく推奨事項
        if (stats.overallScore >= 4.0) {
            recommendations.push({
                category: '実用化',
                priority: 'high',
                suggestion: '即座の本格実用化を推奨'
            });
        } else if (stats.overallScore >= 3.5) {
            recommendations.push({
                category: '実用化',
                priority: 'medium',
                suggestion: '軽微な改善後の実用化を推奨'
            });
        } else {
            recommendations.push({
                category: '実用化',
                priority: 'low',
                suggestion: '大幅な改善後の実用化を検討'
            });
        }

        return recommendations;
    }

    /**
     * コンソール出力用の統計表示
     */
    displayStatistics() {
        const stats = this.calculateBasicStatistics();
        
        console.log('\n' + '='.repeat(60));
        console.log('🔮 Future Simulator 調査結果分析レポート');
        console.log('='.repeat(60));
        
        // 品質向上分析追加
        if (stats.overallScore < 3.7) {
            console.log('\n\n📊 C級→A級 品質向上分析:');
            const improvementAnalysis = this.analyzeQualityImprovementPath();
            
            console.log(`\n🎯 改善目標:`);
            console.log(`   現在: ${improvementAnalysis.currentState.overallScore}/5.0 (${improvementAnalysis.currentState.gradeAssessment})`);
            console.log(`   目標: ${improvementAnalysis.targetState.targetScore}/5.0 (A級基準)`);
            console.log(`   必要改善: +${improvementAnalysis.targetState.requiredImprovement}点 (${improvementAnalysis.targetState.improvementPercentage}%向上)`);
            
            console.log(`\n🔍 主要改善要因:`);
            improvementAnalysis.criticalFactors.slice(0, 3).forEach((factor, index) => {
                console.log(`   ${index + 1}. ${factor.metric}: ${factor.currentScore}/5.0 → 3.7/5.0 (実現可能性: ${factor.feasibility})`);
            });
            
            console.log(`\n🎆 A級達成可能性: ${improvementAnalysis.achievabilityAssessment.overallFeasibility}`);
            console.log(`   成功確率: ${improvementAnalysis.achievabilityAssessment.successProbability}`);
            console.log(`   推奨アプローチ: ${improvementAnalysis.achievabilityAssessment.recommendedApproach}`);
            
            console.log(`\n🚀 上位3優先アクション:`);
            improvementAnalysis.prioritizedActions.slice(0, 3).forEach((action, index) => {
                console.log(`   ${index + 1}. [${action.targetMetric}] ${action.action}`);
                console.log(`      期待ROI: ${action.expectedROI} | 実装時間: ${action.timeline}`);
            });
        }
        
        console.log(`\n📊 基本統計:`);
        console.log(`   総回答数: ${stats.totalResponses}`);
        console.log(`   総合スコア: ${stats.overallScore}/5.0`);
        console.log(`   品質判定: ${this.determineQualityLevel(stats.overallScore)}`);
        
        console.log(`\n⭐ 項目別平均評価:`);
        console.log(`   納得度: ${stats.averages.satisfaction}/5.0`);
        console.log(`   有用性: ${stats.averages.usefulness}/5.0`);
        console.log(`   分かりやすさ: ${stats.averages.clarity}/5.0`);
        console.log(`   使いやすさ: ${stats.averages.usability}/5.0`);
        console.log(`   総合価値: ${stats.averages.overallValue}/5.0`);
        
        console.log(`\n⏱️ 応答時間分布:`);
        Object.entries(stats.responseTimeDistribution).forEach(([time, count]) => {
            const percentage = Math.round((count / stats.totalResponses) * 100);
            console.log(`   ${time}: ${count}件 (${percentage}%)`);
        });
        
        console.log(`\n📊 95%信頼区間:`);
        const ci = stats.confidenceInterval;
        console.log(`   平均スコア: ${ci.mean} (${ci.lowerBound} - ${ci.upperBound})`);
        console.log(`   誤差範囲: ±${ci.marginOfError}`);
        console.log(`   標準偏差: ${ci.standardDeviation}`);
        console.log(`   標準誤差: ${ci.standardError}`);
        
        console.log(`\n🔗 主要相関分析:`);
        Object.entries(stats.correlationAnalysis).forEach(([pair, data]) => {
            if (Math.abs(data.correlation) > 0.3) { // 中程度以上の相関のみ表示
                const [metric1, metric2] = pair.split('_');
                console.log(`   ${metric1} ↔ ${metric2}: r=${data.correlation} (${data.strength}, ${data.significance})`);
            }
        });
        
        console.log(`\n👥 セグメント別品質 (年齢層):`);
        Object.entries(stats.segmentAnalysis.segments.age).forEach(([age, data]) => {
            console.log(`   ${age}: ${data.overallScore}/5.0 (${data.qualityGrade}, n=${data.count})`);
        });
        
        console.log(`\n👥 回答者属性:`);
        console.log(`   年齢層:`, stats.demographicBreakdown.ageGroups);
        console.log(`   職業:`, stats.demographicBreakdown.occupations);
        console.log(`   相談内容:`, stats.demographicBreakdown.consultationTypes);
    }

    /**
     * レポートをJSONファイルに保存
     */
    saveReport() {
        const report = this.generateDetailedReport();
        const filename = `future-simulator-survey-analysis-${new Date().toISOString().split('T')[0]}.json`;
        
        try {
            fs.writeFileSync(filename, JSON.stringify(report, null, 2));
            console.log(`\n📄 詳細レポートを ${filename} に保存しました`);
            return filename;
        } catch (error) {
            console.error('❌ レポート保存エラー:', error.message);
            return null;
        }
    }
}

// メイン実行
async function main() {
    console.log('🎯 Future Simulator 調査データ分析開始');
    
    const analyzer = new SurveyDataAnalyzer();
    
    // サンプルデータ読み込み
    analyzer.loadSampleData();
    
    // 統計計算・表示
    analyzer.displayStatistics();
    
    // 詳細レポート生成・保存
    const reportFile = analyzer.saveReport();
    
    if (reportFile) {
        console.log('\n🎉 分析完了！');
        console.log(`📈 品質判定: ${analyzer.determineQualityLevel(analyzer.statistics.overallScore)}`);
        
        // 主要な推奨事項表示
        const report = analyzer.generateDetailedReport();
        console.log('\n💡 主要推奨事項:');
        report.recommendations.slice(0, 3).forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority}] ${rec.suggestion}`);
        });
    }
}

// 実行
main().catch(console.error);

// エクスポート
export default SurveyDataAnalyzer;