/**
 * HaQei OS Analyzer 改善診断ロジック v2
 * 易経思想を反映した集中度連動型純卦制御
 * 
 * 専門家フィードバック反映版 v2
 * - 線形写像(H8_norm)による純卦確率計算
 * - 乱数シード対応
 * - ログ・可観測性の強化
 * - クリップ順序の修正
 */

class ImprovedDiagnosticEngineV2 {
    constructor(options = {}) {
        // 設定バージョン（変更追跡用）
        this.configVersion = '2.0.0';
        
        // 八卦順序（マトリクスの行列順に一致）
        // 注: "先天八卦"という用語は誤解を招くため使用しない
        // この順序は64卦マトリクスの行列インデックスに対応
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // 乱数生成器（テスト時のシード対応）
        this.rng = options.rng || (() => Math.random());
        
        // デバッグモード
        this.debug = options.debug || false;
        
        // 温度パラメータ（OS別）
        this.TEMPERATURE = {
            engine: 1.2,      // やや尖った分布（志向の明確さ）
            interface: 1.5,   // バランス重視
            safemode: 1.3     // 中間的
        };
        
        // 純卦制御パラメータ（OS別）
        this.PURE_CONTROL = {
            engine: {
                k: 1.2,           // 変換係数
                alphaMin: 0.12,   // 最小純卦確率
                alphaMax: 0.20    // 最大純卦確率（Engineはやや高め）
            },
            interface: {
                k: 1.0,
                alphaMin: 0.10,   // Interfaceは抑えめ
                alphaMax: 0.18
            },
            safemode: {
                k: 1.1,
                alphaMin: 0.12,
                alphaMax: 0.22    // Safe Modeは固着の象意でやや高め
            }
        };
        
        // Herfindahl指数の理論的な範囲
        this.HERFINDAHL_MIN = 1/8;  // 0.125（完全均等分散）
        this.HERFINDAHL_MAX = 1;    // 1.0（完全一極集中）
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
            const noise = values.map(() => 0.1 + this.rng() * 0.1);
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
            processedValues = values.map(v => v + (this.rng() - 0.5) * 0.1);
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
     * 集中度の計算（強化版）
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
        
        // Herfindahl正規化（線形写像用）
        const herfindahlNorm = (herfindahl - this.HERFINDAHL_MIN) / 
                               (this.HERFINDAHL_MAX - this.HERFINDAHL_MIN);
        
        return {
            herfindahl,          // 生のHerfindahl指数
            herfindahlNorm,      // 正規化済み（0-1範囲）
            entropy,             // エントロピー
            topRatio,            // 最大値比率
            gap,                 // 上位差
            maxValue: sorted[0],
            secondValue: sorted[1]
        };
    }
    
    /**
     * 純卦許容確率の動的計算（改善版）
     * - 線形写像による直感的な制御
     * - クリップ順序の修正
     * - OS別範囲設定
     */
    calculatePureHexagramProbability(probabilities, osType = 'engine') {
        const metrics = this.calculateConcentrationMetrics(probabilities);
        const config = this.PURE_CONTROL[osType];
        
        // 線形写像: α = αMin + (αMax - αMin) * k * H8_norm
        let alpha = config.alphaMin + 
                   (config.alphaMax - config.alphaMin) * 
                   (config.k * metrics.herfindahlNorm);
        
        // エントロピーによる追加調整
        // エントロピーが低い（集中度高い）場合は純卦を許容
        if (metrics.entropy < 1.5) {
            alpha *= 1.1;  // 10%増加
        } else if (metrics.entropy > 2.0) {
            alpha *= 0.9;  // 10%減少
        }
        
        // 最終的なクリップ（OS別の範囲内に収める）
        alpha = Math.max(config.alphaMin, Math.min(config.alphaMax, alpha));
        
        // ログ出力（可観測性向上）
        const logData = {
            osType,
            alpha: alpha.toFixed(3),
            herfindahl: metrics.herfindahl.toFixed(3),
            herfindahlNorm: metrics.herfindahlNorm.toFixed(3),
            entropy: metrics.entropy.toFixed(3),
            temperature: this.TEMPERATURE[osType],
            k: config.k,
            alphaMin: config.alphaMin,
            alphaMax: config.alphaMax,
            configVersion: this.configVersion
        };
        
        if (this.debug) {
            console.log('🔍 純卦確率計算:', logData);
        }
        
        return {
            probability: alpha,
            metrics: metrics,
            logData: logData,
            reason: this.explainPureProbability(metrics, alpha)
        };
    }
    
    /**
     * 純卦確率の説明生成（強化版）
     */
    explainPureProbability(metrics, alpha) {
        let reason = "";
        
        if (metrics.herfindahlNorm > 0.6) {
            reason = "気が強く集中しているため純卦が現れやすい状態";
        } else if (metrics.herfindahlNorm < 0.3) {
            reason = "気が分散しているため混合卦が現れやすい状態";
        } else {
            reason = "気のバランスが取れた標準的な状態";
        }
        
        // 具体的な数値を含める
        reason += `（集中度: ${(metrics.herfindahl * 100).toFixed(1)}%, `;
        reason += `エントロピー: ${metrics.entropy.toFixed(2)}, `;
        reason += `純卦確率: ${(alpha * 100).toFixed(1)}%）`;
        
        return reason;
    }
    
    /**
     * 上卦・下卦の選択（改善版）
     * - 確率的選択
     * - 集中度連動の純卦制御
     * - 無復元抽選オプション
     * - 詳細なログ出力
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
        let isPure = false;
        let selectionMethod = '';
        
        // 純卦許容確率αで同じ卦を選択
        const randomValue = this.rng();
        if (randomValue < alpha) {
            // 純卦を選択
            lowerBagua = upperBagua;
            isPure = true;
            selectionMethod = 'pure-probabilistic';
            
            if (this.debug) {
                console.log(`🔮 純卦採用: ${upperBagua}為${upperBagua} (α=${(alpha*100).toFixed(1)}%, random=${randomValue.toFixed(3)})`);
            }
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
                selectionMethod = 'mixed-without-replacement';
            } else {
                // フォールバック（全確率が0の異常ケース）
                const availableIndices = [...Array(8).keys()].filter(i => i !== upperIndex);
                const randomIndex = availableIndices[Math.floor(this.rng() * availableIndices.length)];
                lowerBagua = baguaArray[randomIndex];
                selectionMethod = 'fallback-random';
            }
        }
        
        // 詳細なログデータ
        const fullLogData = {
            ...pureControl.logData,
            upper: upperBagua,
            lower: lowerBagua,
            isPure,
            selectionMethod,
            randomValue: randomValue.toFixed(3),
            timestamp: new Date().toISOString()
        };
        
        return {
            upper: upperBagua,
            lower: lowerBagua,
            isPure,
            pureProb: alpha,
            metrics: pureControl.metrics,
            explanation: pureControl.reason,
            logData: fullLogData
        };
    }
    
    /**
     * 重み付きランダム選択（乱数シード対応）
     */
    weightedRandomSelect(probabilities) {
        const random = this.rng();  // this.rng()を使用
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
     * 64卦マトリクスから卦番号を取得
     * BAGUA_ORDERとの整合性を保証
     */
    getHexagramId(upperBagua, lowerBagua) {
        // 転置済み正統マトリクス
        // [上卦インデックス][下卦インデックス] = 卦番号
        const HEXAGRAM_MATRIX = [
            [1,  10, 13, 25, 44,  6, 33, 12], // 上卦: 乾
            [43, 58, 49, 17, 28, 47, 31, 45], // 上卦: 兌
            [14, 38, 30, 21, 50, 64, 56, 35], // 上卦: 離
            [34, 54, 55, 51, 32, 40, 62, 16], // 上卦: 震
            [9,  61, 37, 42, 57, 59, 53, 20], // 上卦: 巽
            [5,  60, 63,  3, 48, 29, 39,  8], // 上卦: 坎
            [26, 41, 22, 27, 18,  4, 52, 23], // 上卦: 艮
            [11, 19, 36, 24, 46,  7, 15,  2]  // 上卦: 坤
        ];
        
        const upperIdx = this.BAGUA_ORDER.indexOf(upperBagua);
        const lowerIdx = this.BAGUA_ORDER.indexOf(lowerBagua);
        
        if (upperIdx === -1 || lowerIdx === -1) {
            console.error('Invalid bagua name:', { upperBagua, lowerBagua });
            return 1; // デフォルト: 乾為天
        }
        
        return HEXAGRAM_MATRIX[upperIdx][lowerIdx];
    }
    
    /**
     * 診断実行（完全版）
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
        
        // 卦番号を取得
        const hexagramId = this.getHexagramId(selection.upper, selection.lower);
        
        // 診断結果を構築
        const result = {
            osType,
            upperTrigram: selection.upper,
            lowerTrigram: selection.lower,
            hexagramId,
            isPure: selection.isPure,
            baguaEnergies,
            metrics: selection.metrics,
            explanation: selection.explanation || '',
            method: selection.method || method,
            logData: selection.logData,
            timestamp: new Date().toISOString()
        };
        
        // 完全なログ出力（運用監視用）
        if (this.debug) {
            console.log('📊 診断完了:', {
                ...result.logData,
                hexagramId,
                method
            });
        }
        
        return result;
    }
    
    /**
     * 統計的検証用メソッド
     * 大量のシミュレーションで期待値を確認
     */
    validatePureRate(n = 10000, osType = 'engine') {
        const results = [];
        for (let i = 0; i < n; i++) {
            // ランダムベクトル生成
            const vector = {};
            this.BAGUA_ORDER.forEach(b => {
                vector[b] = this.rng() * 100;
            });
            
            const diagnosis = this.performDiagnosis(vector, osType);
            results.push(diagnosis);
        }
        
        const pureCount = results.filter(r => r.isPure).length;
        const pureRate = pureCount / n;
        const avgHerfindahl = results.reduce((sum, r) => sum + r.metrics.herfindahl, 0) / n;
        const avgAlpha = results.reduce((sum, r) => sum + r.logData.alpha, 0) / n;
        
        return {
            n,
            osType,
            pureCount,
            pureRate: (pureRate * 100).toFixed(2) + '%',
            avgHerfindahl: avgHerfindahl.toFixed(3),
            avgAlpha: (avgAlpha * 100).toFixed(2) + '%',
            deviation: Math.abs(pureRate - avgAlpha).toFixed(4),
            configVersion: this.configVersion
        };
    }
}

// シード付き乱数生成器（テスト用）
class SeededRandom {
    constructor(seed = 12345) {
        this.seed = seed;
    }
    
    next() {
        // LCG (Linear Congruential Generator)
        this.seed = (this.seed * 1664525 + 1013904223) % 2147483647;
        return this.seed / 2147483647;
    }
}

// エクスポート（ブラウザ環境）
if (typeof window !== 'undefined') {
    window.ImprovedDiagnosticEngineV2 = ImprovedDiagnosticEngineV2;
    window.SeededRandom = SeededRandom;
}

// Node.js環境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ImprovedDiagnosticEngineV2,
        SeededRandom
    };
}