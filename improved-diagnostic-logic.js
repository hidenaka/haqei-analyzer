/**
 * HaQei OS Analyzer 改善診断ロジック
 * 易経思想を反映した集中度連動型純卦制御
 * 
 * 専門家フィードバック反映版
 * - 純卦は「レア」ではなく「気の集中時に現れる」
 * - ReLU下限値削除、Softmax一本化
 * - 分布集中度（∑p_i^2）に基づく自然な純卦率
 */

class ImprovedDiagnosticEngine {
    constructor() {
        // 八卦順序（先天八卦配列）
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // 温度パラメータ（OS別）
        this.TEMPERATURE = {
            engine: 1.2,      // やや尖った分布（志向の明確さ）
            interface: 1.5,   // バランス重視
            safemode: 1.3     // 中間的
        };
        
        // 純卦制御パラメータ（OS別）
        // k値: 集中度から純卦許容確率への変換係数
        this.PURE_CONTROL_K = {
            engine: 1.2,      // 純卦やや出やすく（一点集中を尊ぶ）
            interface: 1.0,   // 標準
            safemode: 1.1     // やや許容（固着の象意）
        };
        
        // 純卦率の目標範囲
        this.TARGET_PURE_RATE = {
            min: 0.12,  // 12%（理論値）
            max: 0.18   // 18%（実用上限）
        };
    }
    
    /**
     * Softmax正規化（改善版）
     * - 温度パラメータで分布の尖り具合を制御
     * - 安定性のための数値処理改善
     */
    softmax(values, temperature = 1.2) {
        // 数値安定性のため最大値を引く
        const maxVal = Math.max(...values);
        const scaled = values.map(v => (v - maxVal) / temperature);
        const exp = scaled.map(v => Math.exp(v));
        const sum = exp.reduce((a, b) => a + b, 0);
        
        // ゼロ除算防止
        if (sum === 0) {
            // 完全に平坦な場合は微小ノイズを付与
            const noise = values.map(() => 0.1 + Math.random() * 0.1);
            return this.softmax(noise, temperature);
        }
        
        return exp.map(v => v / sum);
    }
    
    /**
     * 八卦エネルギー計算（改善版）
     * - ReLU下限値削除
     * - Softmax一本化
     * - 微小ノイズによる安定化
     */
    calculateBaguaEnergies(userVector, osType = 'engine') {
        const rawEnergies = {};
        
        // 生のエネルギー値を取得
        this.BAGUA_ORDER.forEach(bagua => {
            rawEnergies[bagua] = userVector[bagua] || 0;
        });
        
        // 完全に平坦な入力への対処
        const values = Object.values(rawEnergies);
        const variance = this.calculateVariance(values);
        
        let processedValues;
        if (variance < 0.01) {
            // 平坦な場合は微小ノイズを付与
            processedValues = values.map(v => v + (Math.random() - 0.5) * 0.1);
        } else {
            processedValues = values;
        }
        
        // Softmax正規化（温度パラメータはOS別）
        const temperature = this.TEMPERATURE[osType];
        const normalized = this.softmax(processedValues, temperature);
        
        // 結果をオブジェクトに戻す
        const result = {};
        this.BAGUA_ORDER.forEach((bagua, i) => {
            result[bagua] = normalized[i];
        });
        
        return result;
    }
    
    /**
     * 集中度の計算
     * - Herfindahl指数（∑p_i^2）
     * - エントロピー
     * - 最大値比率
     */
    calculateConcentrationMetrics(probabilities) {
        const values = Object.values(probabilities);
        
        // Herfindahl指数（集中度の指標）
        const herfindahl = values.reduce((sum, p) => sum + p * p, 0);
        
        // エントロピー（多様性の指標）
        const entropy = -values.reduce((sum, p) => {
            return sum + (p > 0 ? p * Math.log(p) : 0);
        }, 0);
        
        // 最大値と次点の差
        const sorted = [...values].sort((a, b) => b - a);
        const topRatio = sorted[0] / (sorted[0] + sorted[1]);
        const gap = sorted[0] - sorted[1];
        
        return {
            herfindahl,      // 高いほど集中
            entropy,         // 低いほど集中
            topRatio,        // 高いほど一極集中
            gap,             // 大きいほど明確な差
            maxValue: sorted[0],
            secondValue: sorted[1]
        };
    }
    
    /**
     * 純卦許容確率の動的計算
     * - 分布の集中度に基づく
     * - OS別の調整係数適用
     */
    calculatePureHexagramProbability(probabilities, osType = 'engine') {
        const metrics = this.calculateConcentrationMetrics(probabilities);
        
        // 基本的な純卦許容確率 = k * Herfindahl指数
        const k = this.PURE_CONTROL_K[osType];
        let alpha = k * metrics.herfindahl;
        
        // 目標範囲にクリップ
        alpha = Math.max(this.TARGET_PURE_RATE.min, 
                        Math.min(this.TARGET_PURE_RATE.max, alpha));
        
        // エントロピーによる追加調整
        // エントロピーが低い（集中度高い）場合は純卦を許容
        if (metrics.entropy < 1.5) {
            alpha *= 1.2;  // 20%増加
        } else if (metrics.entropy > 2.0) {
            alpha *= 0.8;  // 20%減少
        }
        
        // 最終的なクリップ
        alpha = Math.min(0.25, alpha);  // 最大25%に制限
        
        return {
            probability: alpha,
            reason: this.explainPureProbability(metrics, alpha)
        };
    }
    
    /**
     * 純卦確率の説明生成
     */
    explainPureProbability(metrics, alpha) {
        let reason = "";
        
        if (metrics.herfindahl > 0.2) {
            reason = "気が強く集中しているため純卦が現れやすい状態";
        } else if (metrics.herfindahl < 0.13) {
            reason = "気が分散しているため混合卦が現れやすい状態";
        } else {
            reason = "気のバランスが取れた標準的な状態";
        }
        
        reason += `（集中度: ${(metrics.herfindahl * 100).toFixed(1)}%, `;
        reason += `純卦確率: ${(alpha * 100).toFixed(1)}%）`;
        
        return reason;
    }
    
    /**
     * 上卦・下卦の選択（改善版）
     * - 確率的選択
     * - 集中度連動の純卦制御
     * - 無復元抽選オプション
     */
    selectUpperLowerTrigrams(probabilities, osType = 'engine') {
        // 集中度メトリクスと純卦許容確率を計算
        const pureControl = this.calculatePureHexagramProbability(probabilities, osType);
        const alpha = pureControl.probability;
        
        // 確率配列の準備
        const baguaArray = this.BAGUA_ORDER;
        const probArray = baguaArray.map(b => probabilities[b]);
        
        // 上卦を重み付きランダム選択
        const upperIndex = this.weightedRandomSelect(probArray);
        const upperBagua = baguaArray[upperIndex];
        
        // 下卦の選択
        let lowerBagua;
        
        // 純卦許容確率αで同じ卦を選択
        if (Math.random() < alpha) {
            // 純卦を選択
            lowerBagua = upperBagua;
            console.log(`🔮 純卦採用: ${upperBagua}為${upperBagua} (α=${(alpha*100).toFixed(1)}%)`);
        } else {
            // 異なる卦を選択（無復元抽選）
            const remainingProbs = [...probArray];
            remainingProbs[upperIndex] = 0;  // 上卦を除外
            
            // 再正規化
            const sum = remainingProbs.reduce((a, b) => a + b, 0);
            if (sum > 0) {
                const normalizedProbs = remainingProbs.map(p => p / sum);
                const lowerIndex = this.weightedRandomSelect(normalizedProbs);
                lowerBagua = baguaArray[lowerIndex];
            } else {
                // フォールバック（全確率が0の異常ケース）
                const availableIndices = [...Array(8).keys()].filter(i => i !== upperIndex);
                const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                lowerBagua = baguaArray[randomIndex];
            }
        }
        
        return {
            upper: upperBagua,
            lower: lowerBagua,
            isPure: upperBagua === lowerBagua,
            pureProb: alpha,
            metrics: this.calculateConcentrationMetrics(probabilities),
            explanation: pureControl.reason
        };
    }
    
    /**
     * 重み付きランダム選択
     */
    weightedRandomSelect(probabilities) {
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (random < cumulative) {
                return i;
            }
        }
        
        // フォールバック（浮動小数点誤差対策）
        return probabilities.length - 1;
    }
    
    /**
     * 決定論的選択（オプション）
     * - 従来の1位・2位固定方式
     * - 閾値による純卦回避
     */
    selectUpperLowerDeterministic(probabilities, avoidPure = false) {
        const sorted = Object.entries(probabilities)
            .sort(([, a], [, b]) => b - a);
        
        const metrics = this.calculateConcentrationMetrics(probabilities);
        
        // 純卦回避モード
        if (avoidPure && sorted.length >= 3) {
            const gap12 = sorted[0][1] - sorted[1][1];
            const gap23 = sorted[1][1] - sorted[2][1];
            
            // 1位と2位が同じ、または差が小さい場合
            if (sorted[0][0] === sorted[1][0] || gap12 < 0.05) {
                // 1位と3位を選択
                return {
                    upper: sorted[0][0],
                    lower: sorted[2][0],
                    isPure: false,
                    method: 'deterministic-avoid',
                    metrics
                };
            }
        }
        
        // 通常選択
        return {
            upper: sorted[0][0],
            lower: sorted[1][0],
            isPure: sorted[0][0] === sorted[1][0],
            method: 'deterministic',
            metrics
        };
    }
    
    /**
     * 分散の計算
     */
    calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    }
    
    /**
     * 診断実行
     */
    performDiagnosis(userVector, osType = 'engine', method = 'probabilistic') {
        // 八卦エネルギーを計算
        const baguaEnergies = this.calculateBaguaEnergies(userVector, osType);
        
        // 上卦・下卦を選択
        let selection;
        if (method === 'probabilistic') {
            selection = this.selectUpperLowerTrigrams(baguaEnergies, osType);
        } else {
            selection = this.selectUpperLowerDeterministic(baguaEnergies, method === 'avoid-pure');
        }
        
        // 診断結果を構築
        return {
            osType,
            upperTrigram: selection.upper,
            lowerTrigram: selection.lower,
            isPure: selection.isPure,
            baguaEnergies,
            metrics: selection.metrics,
            explanation: selection.explanation || '',
            method: selection.method || method,
            timestamp: new Date().toISOString()
        };
    }
}

// エクスポート（ブラウザ環境）
if (typeof window !== 'undefined') {
    window.ImprovedDiagnosticEngine = ImprovedDiagnosticEngine;
}

// Node.js環境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImprovedDiagnosticEngine;
}