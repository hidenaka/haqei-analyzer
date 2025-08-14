/**
 * Zone D - Confidence Meter Component
 * 結果の確信度を視覚的に表示し、不確実性を透明化する
 * 
 * @class ConfidenceMeter
 * @version 1.0.0
 * @date 2025-08-12
 */

class ConfidenceMeter {
    constructor(containerId = 'confidence-section') {
        this.container = document.querySelector(`.${containerId}`) || 
                        document.getElementById(containerId) || 
                        null;
        
        this.metrics = {
            dataQuality: 0,      // データ品質スコア (0-1)
            consistency: 0,       // 回答の一貫性 (0-1)
            completeness: 0,      // 回答の完全性 (0-1)
            patternStrength: 0    // パターンの強度 (0-1)
        };
        
        this.overallConfidence = 0;  // 総合確信度 (0-100)
        this.confidenceLevel = '';   // 'high', 'medium', 'low'
        
        this.thresholds = {
            high: 75,
            medium: 50,
            low: 0
        };
    }
    
    /**
     * 確信度を計算
     * @param {Object} analysisResults - Triple OS分析結果
     * @param {Array} answers - ユーザーの回答
     * @returns {Object} 確信度メトリクス
     */
    calculateConfidence(analysisResults, answers) {
        // 1. データ品質の評価
        this.metrics.dataQuality = this.assessDataQuality(answers);
        
        // 2. 回答の一貫性チェック
        this.metrics.consistency = this.assessConsistency(answers);
        
        // 3. 回答の完全性
        this.metrics.completeness = this.assessCompleteness(answers);
        
        // 4. パターンの強度
        this.metrics.patternStrength = this.assessPatternStrength(analysisResults);
        
        // 総合確信度を計算（重み付き平均）
        this.overallConfidence = this.calculateOverallConfidence();
        
        // 確信度レベルを判定
        this.confidenceLevel = this.getConfidenceLevel();
        
        return {
            overall: this.overallConfidence,
            level: this.confidenceLevel,
            metrics: this.metrics,
            explanation: this.generateExplanation()
        };
    }
    
    /**
     * データ品質を評価
     */
    assessDataQuality(answers) {
        let quality = 1.0;
        
        // 中間的な回答（どちらでもない）が多い場合は品質低下
        const neutralCount = answers.filter(a => a === 0 || a === 3).length;
        const neutralRatio = neutralCount / answers.length;
        quality -= neutralRatio * 0.3;
        
        // 極端な回答のみの場合も品質低下
        const extremeCount = answers.filter(a => a === -2 || a === 2).length;
        if (extremeCount === answers.length) {
            quality -= 0.2;
        }
        
        return Math.max(0, Math.min(1, quality));
    }
    
    /**
     * 回答の一貫性を評価
     */
    assessConsistency(answers) {
        // 関連する質問間の一貫性をチェック
        let consistency = 1.0;
        
        // 回答の分散を計算
        const mean = answers.reduce((a, b) => a + b, 0) / answers.length;
        const variance = answers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / answers.length;
        
        // 分散が大きすぎる場合は一貫性低下
        if (variance > 2.5) {
            consistency -= 0.3;
        }
        
        // パターンの急激な変化をチェック
        let changes = 0;
        for (let i = 1; i < answers.length; i++) {
            if (Math.abs(answers[i] - answers[i-1]) > 3) {
                changes++;
            }
        }
        consistency -= (changes / answers.length) * 0.4;
        
        return Math.max(0, Math.min(1, consistency));
    }
    
    /**
     * 回答の完全性を評価
     */
    assessCompleteness(answers) {
        // 全質問に回答しているか
        const validAnswers = answers.filter(a => a !== null && a !== undefined).length;
        return validAnswers / answers.length;
    }
    
    /**
     * パターンの強度を評価
     */
    assessPatternStrength(analysisResults) {
        if (!analysisResults || !analysisResults.tripleOS) {
            return 0.5;
        }
        
        const { engineOS, interfaceOS, safeModeOS } = analysisResults.tripleOS;
        
        // 各OSの値の明確さ（0.5から離れているほど明確）
        const engineClarity = Math.abs(engineOS - 0.5) * 2;
        const interfaceClarity = Math.abs(interfaceOS - 0.5) * 2;
        const safeModeClarity = Math.abs(safeModeOS - 0.5) * 2;
        
        // 平均明確度
        const avgClarity = (engineClarity + interfaceClarity + safeModeClarity) / 3;
        
        // OSバランスの評価（偏りがあるほど強いパターン）
        const values = [engineOS, interfaceOS, safeModeOS];
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);
        const range = maxVal - minVal;
        
        // 明確度とバランスを組み合わせ
        return (avgClarity * 0.6 + range * 0.4);
    }
    
    /**
     * 総合確信度を計算
     */
    calculateOverallConfidence() {
        // 重み付き平均
        const weights = {
            dataQuality: 0.25,
            consistency: 0.35,
            completeness: 0.20,
            patternStrength: 0.20
        };
        
        let weighted = 0;
        for (const [key, weight] of Object.entries(weights)) {
            weighted += this.metrics[key] * weight;
        }
        
        return Math.round(weighted * 100);
    }
    
    /**
     * 確信度レベルを取得
     */
    getConfidenceLevel() {
        if (this.overallConfidence >= this.thresholds.high) {
            return 'high';
        } else if (this.overallConfidence >= this.thresholds.medium) {
            return 'medium';
        } else {
            return 'low';
        }
    }
    
    /**
     * 説明文を生成
     */
    generateExplanation() {
        const explanations = [];
        
        // データ品質
        if (this.metrics.dataQuality < 0.7) {
            explanations.push('回答に中間的な選択が多く、明確な傾向が読み取りにくい');
        }
        
        // 一貫性
        if (this.metrics.consistency < 0.7) {
            explanations.push('回答パターンに変動が見られ、一貫性がやや低い');
        }
        
        // 完全性
        if (this.metrics.completeness < 1.0) {
            explanations.push('一部の質問が未回答');
        }
        
        // パターン強度
        if (this.metrics.patternStrength < 0.5) {
            explanations.push('Triple OSのパターンが不明瞭');
        }
        
        if (explanations.length === 0) {
            explanations.push('十分なデータと明確なパターンで高い確信度');
        }
        
        return explanations;
    }
    
    /**
     * HTMLを生成
     */
    render(container) {
        const html = `
            <div class="confidence-meter">
                <h3>診断の確信度</h3>
                
                <div class="confidence-gauge">
                    <div class="gauge-container">
                        <div class="gauge-fill" style="width: ${this.overallConfidence}%">
                            <span class="gauge-value">${this.overallConfidence}%</span>
                        </div>
                    </div>
                    <div class="confidence-level ${this.confidenceLevel}">
                        ${this.getLevelLabel()}
                    </div>
                </div>
                
                <div class="confidence-breakdown">
                    <h4>確信度の内訳</h4>
                    <div class="metric-bars">
                        ${this.renderMetricBar('データ品質', this.metrics.dataQuality)}
                        ${this.renderMetricBar('一貫性', this.metrics.consistency)}
                        ${this.renderMetricBar('完全性', this.metrics.completeness)}
                        ${this.renderMetricBar('パターン強度', this.metrics.patternStrength)}
                    </div>
                </div>
                
                <div class="confidence-explanation">
                    <h4>確信度の根拠</h4>
                    <ul>
                        ${this.generateExplanation().map(exp => `<li>${exp}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="uncertainty-notice">
                    <p class="notice-text">
                        ※ この診断は${this.overallConfidence}%の確信度で提供されています。
                        結果は参考としてご利用ください。
                    </p>
                </div>
            </div>
        `;
        
        if (container) {
            container.innerHTML = html;
        }
        
        return html;
    }
    
    /**
     * メトリクスバーを描画
     */
    renderMetricBar(label, value) {
        const percentage = Math.round(value * 100);
        return `
            <div class="metric-bar">
                <span class="metric-label">${label}</span>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="metric-value">${percentage}%</span>
            </div>
        `;
    }
    
    /**
     * レベルラベルを取得
     */
    getLevelLabel() {
        const labels = {
            high: '高確信度',
            medium: '中確信度',
            low: '低確信度'
        };
        return labels[this.confidenceLevel] || '';
    }
    
    /**
     * アニメーション付きで表示
     */
    animateDisplay(container) {
        this.render(container);
        
        // ゲージアニメーション
        setTimeout(() => {
            const gaugeFill = container.querySelector('.gauge-fill');
            if (gaugeFill) {
                gaugeFill.style.transition = 'width 1s ease-out';
            }
            
            // メトリクスバーアニメーション
            const bars = container.querySelectorAll('.bar-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transition = 'width 0.5s ease-out';
                }, index * 100);
            });
        }, 100);
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfidenceMeter;
}