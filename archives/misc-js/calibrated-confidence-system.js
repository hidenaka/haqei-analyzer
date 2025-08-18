/**
 * キャリブレーションされた確信度システム
 * 
 * gap、entropy、topRatioを統合し、0-1に正規化された
 * 確信度スコアを提供
 */

class CalibratedConfidenceSystem {
    constructor(config) {
        this.config = config || CONFIG;
        
        // キャリブレーション済みパラメータ（実データで調整予定）
        this.calibrationParams = {
            // ロジスティック回帰の係数（仮値）
            intercept: -2.5,
            coefficients: {
                gap: 8.5,
                entropy: -3.2,
                topRatio: 2.1
            },
            
            // 閾値（暫定値、実データで最適化予定）
            thresholds: {
                high: 0.75,      // キャリブレーション後
                medium: 0.45,    // キャリブレーション後
                low: 0          // それ以下
            }
        };
    }
    
    /**
     * 統合確信度計算
     */
    calculateCalibratedConfidence(baguaEnergies, options = {}) {
        // 基本メトリクスの計算
        const metrics = this.calculateBaseMetrics(baguaEnergies);
        
        // 特徴量の正規化
        const features = this.normalizeFeatures(metrics);
        
        // ロジスティック回帰による統合スコア
        const rawScore = this.applyLogisticRegression(features);
        
        // 0-1範囲にキャリブレーション
        const calibratedScore = this.calibrateScore(rawScore);
        
        // 確信度レベルの判定
        const level = this.determineConfidenceLevel(calibratedScore);
        
        // 詳細な結果を返す
        return {
            score: calibratedScore,
            level: level,
            metrics: metrics,
            features: features,
            details: this.generateDetails(metrics, calibratedScore, level),
            alternatives: level === 'LOW' ? this.generateAlternatives(baguaEnergies) : null
        };
    }
    
    /**
     * 基本メトリクスの計算
     */
    calculateBaseMetrics(baguaEnergies) {
        const sorted = Object.entries(baguaEnergies)
            .sort((a, b) => b[1] - a[1]);
        
        // 1. Gap（上位2つの差）
        const top1 = sorted[0] ? sorted[0][1] : 0;
        const top2 = sorted[1] ? sorted[1][1] : 0;
        const gap = (top1 - top2) / 100;
        
        // 2. Entropy（分布の均等性）
        const entropy = this.calculateEntropy(baguaEnergies);
        const maxEntropy = Math.log(8); // 最大エントロピー（均等分布）
        const normalizedEntropy = entropy / maxEntropy;
        
        // 3. Top Ratio（上位2つの比）
        const topRatio = top2 > 0 ? top1 / top2 : 10; // 最大10に制限
        
        // 4. 追加メトリクス
        const top3 = sorted[2] ? sorted[2][1] : 0;
        const gapToThird = (top1 - top3) / 100;
        
        // 5. 分散
        const values = Object.values(baguaEnergies);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => 
            sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        return {
            gap,
            entropy: normalizedEntropy,
            topRatio: Math.min(topRatio, 10),
            gapToThird,
            stdDev: stdDev / 100,
            top1Name: sorted[0] ? sorted[0][0] : '',
            top2Name: sorted[1] ? sorted[1][0] : '',
            top1Value: top1,
            top2Value: top2
        };
    }
    
    /**
     * エントロピー計算
     */
    calculateEntropy(baguaEnergies) {
        let entropy = 0;
        const total = Object.values(baguaEnergies).reduce((a, b) => a + b, 0);
        
        if (total > 0) {
            Object.values(baguaEnergies).forEach(value => {
                if (value > 0) {
                    const p = value / total;
                    entropy -= p * Math.log(p);
                }
            });
        }
        
        return entropy;
    }
    
    /**
     * 特徴量の正規化
     */
    normalizeFeatures(metrics) {
        return {
            gap: Math.min(1, metrics.gap / 0.5),           // 0.5を最大値として正規化
            entropy: 1 - metrics.entropy,                   // 低いほど確信度高い
            topRatio: Math.min(1, (metrics.topRatio - 1) / 9), // 1-10を0-1に
            gapToThird: Math.min(1, metrics.gapToThird / 0.6),
            stdDev: Math.min(1, metrics.stdDev / 0.3)
        };
    }
    
    /**
     * ロジスティック回帰
     */
    applyLogisticRegression(features) {
        const { intercept, coefficients } = this.calibrationParams;
        
        // 線形結合
        let z = intercept;
        z += coefficients.gap * features.gap;
        z += coefficients.entropy * features.entropy;
        z += coefficients.topRatio * features.topRatio;
        
        // シグモイド関数
        const sigmoid = 1 / (1 + Math.exp(-z));
        
        return sigmoid;
    }
    
    /**
     * スコアのキャリブレーション
     */
    calibrateScore(rawScore) {
        // プラットキャリブレーション（簡易版）
        // 実データでより精密な校正が必要
        const a = 1.2;  // スケーリング係数
        const b = -0.1; // バイアス項
        
        const calibrated = Math.max(0, Math.min(1, a * rawScore + b));
        
        return Math.round(calibrated * 1000) / 1000; // 小数点3桁
    }
    
    /**
     * 確信度レベルの判定
     */
    determineConfidenceLevel(score) {
        const { thresholds } = this.calibrationParams;
        
        if (score >= thresholds.high) {
            return 'HIGH';
        } else if (score >= thresholds.medium) {
            return 'MEDIUM';
        } else {
            return 'LOW';
        }
    }
    
    /**
     * 詳細情報の生成
     */
    generateDetails(metrics, score, level) {
        const levelDescriptions = {
            HIGH: "診断結果は高い確信度を持っています",
            MEDIUM: "診断結果は中程度の確信度です",
            LOW: "複数の可能性が考えられます"
        };
        
        return {
            description: levelDescriptions[level],
            reason: this.generateReason(metrics, score),
            interpretation: this.generateInterpretation(metrics),
            reliability: this.assessReliability(score)
        };
    }
    
    /**
     * 理由の生成
     */
    generateReason(metrics, score) {
        const reasons = [];
        
        if (metrics.gap > 0.2) {
            reasons.push(`明確な差異（${(metrics.gap * 100).toFixed(1)}%）`);
        }
        
        if (metrics.entropy < 0.6) {
            reasons.push("分布が集中");
        }
        
        if (metrics.topRatio > 2) {
            reasons.push(`上位比率${metrics.topRatio.toFixed(1)}:1`);
        }
        
        if (reasons.length === 0) {
            reasons.push("各指標が均衡");
        }
        
        return reasons.join("、");
    }
    
    /**
     * 解釈の生成
     */
    generateInterpretation(metrics) {
        if (metrics.gap > 0.3 && metrics.entropy < 0.5) {
            return "非常に明確な傾向が見られます";
        } else if (metrics.gap > 0.15 || metrics.entropy < 0.7) {
            return "比較的明確な傾向があります";
        } else {
            return "複数の要素が拮抗しています";
        }
    }
    
    /**
     * 信頼性評価
     */
    assessReliability(score) {
        if (score >= 0.8) return "非常に高い";
        if (score >= 0.6) return "高い";
        if (score >= 0.4) return "中程度";
        if (score >= 0.2) return "低い";
        return "非常に低い";
    }
    
    /**
     * 代替候補の生成
     */
    generateAlternatives(baguaEnergies) {
        const sorted = Object.entries(baguaEnergies)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4); // 上位4つ
        
        const alternatives = [];
        
        // 組み合わせパターン
        const patterns = [
            [0, 1], // 1位と2位
            [0, 2], // 1位と3位
            [1, 2], // 2位と3位
            [0, 3]  // 1位と4位
        ];
        
        patterns.forEach(([i, j]) => {
            if (sorted[i] && sorted[j]) {
                alternatives.push({
                    upper: sorted[i][0],
                    lower: sorted[j][0],
                    combinedEnergy: (sorted[i][1] + sorted[j][1]) / 2,
                    confidence: this.estimateAlternativeConfidence(sorted[i][1], sorted[j][1])
                });
            }
        });
        
        return alternatives.slice(0, 3); // 上位3つ
    }
    
    /**
     * 代替候補の確信度推定
     */
    estimateAlternativeConfidence(energy1, energy2) {
        const avg = (energy1 + energy2) / 2;
        const diff = Math.abs(energy1 - energy2);
        
        // 簡易推定
        const baseScore = avg / 100;
        const penalty = diff / 200;
        
        return Math.max(0.1, Math.min(0.9, baseScore - penalty));
    }
}

// テスト関数
function testCalibratedConfidence() {
    const system = new CalibratedConfidenceSystem(CONFIG);
    
    console.log("=== キャリブレーション済み確信度テスト ===\n");
    
    // テストケース1: 高確信度
    console.log("【ケース1: 高確信度】");
    const highConfidenceEnergies = {
        "乾": 45, "兌": 15, "離": 10, "震": 8,
        "巽": 6, "坎": 6, "艮": 5, "坤": 5
    };
    
    const result1 = system.calculateCalibratedConfidence(highConfidenceEnergies);
    console.log(`スコア: ${result1.score.toFixed(3)}`);
    console.log(`レベル: ${result1.level}`);
    console.log(`メトリクス:`);
    console.log(`  Gap: ${result1.metrics.gap.toFixed(3)}`);
    console.log(`  Entropy: ${result1.metrics.entropy.toFixed(3)}`);
    console.log(`  TopRatio: ${result1.metrics.topRatio.toFixed(2)}`);
    console.log(`理由: ${result1.details.reason}`);
    console.log(`信頼性: ${result1.details.reliability}`);
    console.log("");
    
    // テストケース2: 低確信度
    console.log("【ケース2: 低確信度】");
    const lowConfidenceEnergies = {
        "乾": 14, "兌": 13, "離": 12.5, "震": 12,
        "巽": 12, "坎": 12, "艮": 12, "坤": 12.5
    };
    
    const result2 = system.calculateCalibratedConfidence(lowConfidenceEnergies);
    console.log(`スコア: ${result2.score.toFixed(3)}`);
    console.log(`レベル: ${result2.level}`);
    console.log(`メトリクス:`);
    console.log(`  Gap: ${result2.metrics.gap.toFixed(3)}`);
    console.log(`  Entropy: ${result2.metrics.entropy.toFixed(3)}`);
    console.log(`  TopRatio: ${result2.metrics.topRatio.toFixed(2)}`);
    console.log(`理由: ${result2.details.reason}`);
    console.log("");
    
    if (result2.alternatives) {
        console.log("代替候補:");
        result2.alternatives.forEach((alt, idx) => {
            console.log(`  ${idx + 1}. ${alt.upper}/${alt.lower} (確信度: ${alt.confidence.toFixed(2)})`);
        });
    }
    
    // テストケース3: 境界値付近
    console.log("\n【ケース3: 境界値付近の連続性】");
    const testVectors = [
        { "乾": 20, "兌": 15, "離": 12, "震": 11, "巽": 11, "坎": 11, "艮": 10, "坤": 10 },
        { "乾": 22, "兌": 14, "離": 11, "震": 11, "巽": 11, "坎": 11, "艮": 10, "坤": 10 },
        { "乾": 24, "兌": 13, "離": 11, "震": 11, "巽": 10, "坎": 11, "艮": 10, "坤": 10 },
        { "乾": 26, "兌": 12, "離": 10, "震": 10, "巽": 11, "坎": 11, "艮": 10, "坤": 10 }
    ];
    
    console.log("Gap増加に対するスコアの変化:");
    testVectors.forEach((vector, idx) => {
        const result = system.calculateCalibratedConfidence(vector);
        console.log(`  ${idx + 1}. Gap=${result.metrics.gap.toFixed(3)} → Score=${result.score.toFixed(3)} (${result.level})`);
    });
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CalibratedConfidenceSystem };
}

console.log('キャリブレーション済み確信度システムが準備されました。');
console.log('testCalibratedConfidence() でテストを実行できます。');