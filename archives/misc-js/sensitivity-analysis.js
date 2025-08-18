/**
 * 感度分析と安定性テスト
 * 
 * 小さな摂動に対する診断結果の安定性を評価
 */

class SensitivityAnalysis {
    constructor(diagnosisSystem, config) {
        this.diagnosis = diagnosisSystem;
        this.config = config || CONFIG;
    }
    
    /**
     * 感度分析の実行
     */
    runSensitivityAnalysis(baseVector, osType = 'engine', options = {}) {
        const config = {
            perturbationSize: 1,      // 摂動の大きさ
            iterations: 100,          // 試行回数
            noiseType: 'uniform',     // 'uniform' or 'gaussian'
            ...options
        };
        
        console.log("=== 感度分析開始 ===");
        console.log(`OS: ${osType}`);
        console.log(`摂動サイズ: ±${config.perturbationSize}`);
        console.log(`試行回数: ${config.iterations}`);
        console.log("");
        
        // ベースライン診断
        const baseResult = this.runDiagnosis(baseVector, osType);
        console.log("ベースライン結果:");
        console.log(`  卦: ${baseResult.upper}/${baseResult.lower} (#${baseResult.hexagramId})`);
        console.log("");
        
        // 摂動テスト結果の収集
        const results = {
            stable: 0,           // 結果が変わらなかった回数
            changed: 0,          // 結果が変わった回数
            hexagramDistribution: {},  // 出現した卦の分布
            upperBaguaChanges: 0,      // 上卦が変わった回数
            lowerBaguaChanges: 0,      // 下卦が変わった回数
            confidenceStats: {
                mean: 0,
                min: 1,
                max: 0,
                std: 0
            },
            perturbedResults: []
        };
        
        // 複数回の摂動テスト
        for (let i = 0; i < config.iterations; i++) {
            // 摂動を加えたベクトル生成
            const perturbedVector = this.addPerturbation(
                baseVector, 
                config.perturbationSize,
                config.noiseType
            );
            
            // 診断実行
            const perturbedResult = this.runDiagnosis(perturbedVector, osType);
            
            // 結果の記録
            const hexagramKey = `${perturbedResult.upper}/${perturbedResult.lower}`;
            results.hexagramDistribution[hexagramKey] = 
                (results.hexagramDistribution[hexagramKey] || 0) + 1;
            
            // 変化の検出
            if (perturbedResult.hexagramId === baseResult.hexagramId) {
                results.stable++;
            } else {
                results.changed++;
                
                if (perturbedResult.upper !== baseResult.upper) {
                    results.upperBaguaChanges++;
                }
                if (perturbedResult.lower !== baseResult.lower) {
                    results.lowerBaguaChanges++;
                }
            }
            
            // 確信度統計
            const confidence = perturbedResult.confidence || 0.5;
            results.confidenceStats.mean += confidence;
            results.confidenceStats.min = Math.min(results.confidenceStats.min, confidence);
            results.confidenceStats.max = Math.max(results.confidenceStats.max, confidence);
            
            results.perturbedResults.push({
                iteration: i + 1,
                hexagram: hexagramKey,
                hexagramId: perturbedResult.hexagramId,
                confidence: confidence
            });
        }
        
        // 統計計算
        results.confidenceStats.mean /= config.iterations;
        
        // 標準偏差計算
        const confidenceValues = results.perturbedResults.map(r => r.confidence);
        const mean = results.confidenceStats.mean;
        const variance = confidenceValues.reduce((sum, val) => 
            sum + Math.pow(val - mean, 2), 0) / config.iterations;
        results.confidenceStats.std = Math.sqrt(variance);
        
        // 安定性スコア計算
        results.stabilityScore = results.stable / config.iterations;
        
        // レポート生成
        return this.generateReport(baseResult, results, config);
    }
    
    /**
     * 摂動の追加
     */
    addPerturbation(vector, size, noiseType) {
        const perturbed = { ...vector };
        
        Object.keys(perturbed).forEach(key => {
            let noise;
            
            if (noiseType === 'gaussian') {
                // ガウシアンノイズ
                noise = this.gaussianRandom() * size;
            } else {
                // 一様分布ノイズ
                noise = (Math.random() - 0.5) * 2 * size;
            }
            
            perturbed[key] = Math.max(0, perturbed[key] + noise);
        });
        
        return perturbed;
    }
    
    /**
     * ガウシアン乱数生成（Box-Muller法）
     */
    gaussianRandom() {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    
    /**
     * 診断実行（簡易版）
     */
    runDiagnosis(vector, osType) {
        // 正規化
        const normalized = this.normalize(vector, osType);
        
        // 上位2つの八卦選択
        const sorted = Object.entries(normalized)
            .sort((a, b) => b[1] - a[1]);
        
        const upper = sorted[0][0];
        const lower = sorted[1] ? sorted[1][0] : sorted[0][0];
        
        // 卦番号取得
        const hexagramId = this.getHexagramId(upper, lower);
        
        // 確信度計算
        const gap = sorted[0][1] - (sorted[1] ? sorted[1][1] : 0);
        const confidence = gap;
        
        return {
            upper,
            lower,
            hexagramId,
            confidence,
            isPureHexagram: upper === lower
        };
    }
    
    /**
     * 正規化（簡易版）
     */
    normalize(vector, osType) {
        const sum = Object.values(vector).reduce((a, b) => a + b, 0);
        const normalized = {};
        
        if (sum > 0) {
            Object.entries(vector).forEach(([key, value]) => {
                normalized[key] = value / sum;
            });
        } else {
            // 均等分布
            this.config.BAGUA_ORDER.forEach(bagua => {
                normalized[bagua] = 1.0 / 8;
            });
        }
        
        return normalized;
    }
    
    /**
     * 卦番号取得
     */
    getHexagramId(upper, lower) {
        const MATRIX = [
            [1,  43, 14, 34,  9,  5, 26, 11],
            [10, 58, 38, 54, 61, 60, 41, 19],
            [13, 49, 30, 55, 37, 63, 22, 36],
            [25, 17, 21, 51, 42,  3, 27, 24],
            [44, 28, 50, 32, 57, 48, 18, 46],
            [6,  47, 64, 40, 59, 29,  4,  7],
            [33, 31, 56, 62, 53, 39, 52, 15],
            [12, 45, 35, 16, 20,  8, 23,  2]
        ];
        
        const upperIdx = this.config.BAGUA_ORDER.indexOf(upper);
        const lowerIdx = this.config.BAGUA_ORDER.indexOf(lower);
        
        return MATRIX[upperIdx][lowerIdx];
    }
    
    /**
     * レポート生成
     */
    generateReport(baseResult, results, config) {
        const report = {
            summary: {
                baseHexagram: `${baseResult.upper}/${baseResult.lower}`,
                baseHexagramId: baseResult.hexagramId,
                stabilityScore: results.stabilityScore,
                stabilityLevel: this.getStabilityLevel(results.stabilityScore),
                iterations: config.iterations,
                perturbationSize: config.perturbationSize
            },
            
            changeStatistics: {
                stable: results.stable,
                changed: results.changed,
                changeRate: (results.changed / config.iterations * 100).toFixed(1) + '%',
                upperBaguaChangeRate: (results.upperBaguaChanges / config.iterations * 100).toFixed(1) + '%',
                lowerBaguaChangeRate: (results.lowerBaguaChanges / config.iterations * 100).toFixed(1) + '%'
            },
            
            hexagramDistribution: this.sortDistribution(results.hexagramDistribution),
            
            confidenceStatistics: {
                mean: results.confidenceStats.mean.toFixed(3),
                std: results.confidenceStats.std.toFixed(3),
                min: results.confidenceStats.min.toFixed(3),
                max: results.confidenceStats.max.toFixed(3),
                cv: (results.confidenceStats.std / results.confidenceStats.mean).toFixed(3)
            },
            
            assessment: this.generateAssessment(results.stabilityScore)
        };
        
        // コンソール出力
        this.printReport(report);
        
        return report;
    }
    
    /**
     * 安定性レベル判定
     */
    getStabilityLevel(score) {
        if (score >= 0.9) return "非常に安定";
        if (score >= 0.7) return "安定";
        if (score >= 0.5) return "やや不安定";
        return "不安定";
    }
    
    /**
     * 分布のソート
     */
    sortDistribution(distribution) {
        return Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .map(([hexagram, count]) => ({
                hexagram,
                count,
                percentage: (count / Object.values(distribution).reduce((a, b) => a + b, 0) * 100).toFixed(1) + '%'
            }));
    }
    
    /**
     * 評価生成
     */
    generateAssessment(stabilityScore) {
        if (stabilityScore >= 0.9) {
            return "診断結果は非常に安定しており、小さな入力変化に対して頑健です。";
        } else if (stabilityScore >= 0.7) {
            return "診断結果は安定していますが、境界付近では変化の可能性があります。";
        } else if (stabilityScore >= 0.5) {
            return "診断結果はやや不安定です。より明確な回答により精度が向上します。";
        } else {
            return "診断結果は不安定です。回答の再確認を推奨します。";
        }
    }
    
    /**
     * レポート出力
     */
    printReport(report) {
        console.log("\n=== 感度分析レポート ===\n");
        
        console.log("【要約】");
        console.log(`ベース卦: ${report.summary.baseHexagram} (#${report.summary.baseHexagramId})`);
        console.log(`安定性スコア: ${(report.summary.stabilityScore * 100).toFixed(1)}%`);
        console.log(`安定性レベル: ${report.summary.stabilityLevel}`);
        console.log("");
        
        console.log("【変化統計】");
        console.log(`安定: ${report.changeStatistics.stable}回`);
        console.log(`変化: ${report.changeStatistics.changed}回`);
        console.log(`変化率: ${report.changeStatistics.changeRate}`);
        console.log("");
        
        console.log("【出現卦分布（上位3）】");
        report.hexagramDistribution.slice(0, 3).forEach(item => {
            console.log(`  ${item.hexagram}: ${item.count}回 (${item.percentage})`);
        });
        console.log("");
        
        console.log("【確信度統計】");
        console.log(`平均: ${report.confidenceStatistics.mean}`);
        console.log(`標準偏差: ${report.confidenceStatistics.std}`);
        console.log(`変動係数: ${report.confidenceStatistics.cv}`);
        console.log("");
        
        console.log("【評価】");
        console.log(report.assessment);
    }
}

// テスト関数
function testSensitivityAnalysis() {
    const analyzer = new SensitivityAnalysis(null, CONFIG);
    
    console.log("=== 感度分析テスト ===\n");
    
    // テストケース1: 明確な偏り（安定的）
    console.log("【ケース1: 明確な偏り】");
    const stableVector = {
        "乾": 100,
        "兌": 20,
        "離": 10,
        "震": 5,
        "巽": 3,
        "坎": 2,
        "艮": 1,
        "坤": 1
    };
    
    const stableReport = analyzer.runSensitivityAnalysis(stableVector, 'engine', {
        iterations: 50,
        perturbationSize: 1
    });
    
    console.log("\n" + "=".repeat(50) + "\n");
    
    // テストケース2: 均等に近い（不安定）
    console.log("【ケース2: 均等に近い分布】");
    const unstableVector = {
        "乾": 10,
        "兌": 9,
        "離": 8,
        "震": 7,
        "巽": 6,
        "坎": 5,
        "艮": 4,
        "坤": 3
    };
    
    const unstableReport = analyzer.runSensitivityAnalysis(unstableVector, 'interface', {
        iterations: 50,
        perturbationSize: 1
    });
    
    return {
        stable: stableReport,
        unstable: unstableReport
    };
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SensitivityAnalysis };
}

console.log('感度分析モジュールが準備されました。');
console.log('testSensitivityAnalysis() でテストを実行できます。');