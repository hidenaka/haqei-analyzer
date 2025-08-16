/**
 * Zone D - Feedback Collector Component
 * ユーザーからの反例入力を収集し、学習データとして蓄積する
 * 
 * @class FeedbackCollector
 * @version 1.0.0
 * @date 2025-08-12
 */

class FeedbackCollector {
    constructor() {
        
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.feedbacks = [];
        this.currentFeedback = null;
        this.storageKey = 'haqei_user_feedbacks';
        
        // フィードバックタイプ
        this.feedbackTypes = {
            DISAGREE: 'disagree',        // 結果に同意しない
            PARTIAL: 'partial',          // 部分的に同意
            MISSING: 'missing',          // 重要な要素が欠けている
            MISUNDERSTOOD: 'misunderstood', // 誤解されている
            OTHER: 'other'               // その他
        };
        
        // 感情的な反応
        this.reactions = {
            SURPRISED: '😲',   // 驚いた
            CONFUSED: '😕',    // 困惑した
            ENLIGHTENED: '💡', // 気づきがあった
            VALIDATED: '✅',   // 確証を得た
            SKEPTICAL: '🤔'   // 懐疑的
        };
        
        this.loadFeedbacks();
    }
    
    /**
     * 新しいフィードバックを開始
     */
    startFeedback(analysisResults, confidence) {
        this.currentFeedback = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            analysisResults: this.extractEssentials(analysisResults),
            confidence: confidence,
            type: null,
            reaction: null,
            specificFeedback: '',
            counterExample: '',
            suggestions: [],
            isCompleted: false
        };
        
        return this.currentFeedback.id;
    }
    
    /**
     * フィードバックタイプを設定
     */
    setFeedbackType(type) {
        if (!this.currentFeedback) return false;
        
        if (Object.values(this.feedbackTypes).includes(type)) {
            this.currentFeedback.type = type;
            return true;
        }
        return false;
    }
    
    /**
     * 感情的な反応を設定
     */
    setReaction(reaction) {
        if (!this.currentFeedback) return false;
        
        const reactionKey = Object.keys(this.reactions).find(
            key => this.reactions[key] === reaction
        );
        
        if (reactionKey) {
            this.currentFeedback.reaction = reactionKey;
            return true;
        }
        return false;
    }
    
    /**
     * 具体的なフィードバックを追加
     */
    addSpecificFeedback(text) {
        if (!this.currentFeedback) return false;
        
        this.currentFeedback.specificFeedback = text.trim();
        return true;
    }
    
    /**
     * 反例を追加
     */
    addCounterExample(example) {
        if (!this.currentFeedback) return false;
        
        this.currentFeedback.counterExample = example.trim();
        return true;
    }
    
    /**
     * 改善提案を追加
     */
    addSuggestion(suggestion) {
        if (!this.currentFeedback) return false;
        
        if (suggestion && suggestion.trim()) {
            this.currentFeedback.suggestions.push(suggestion.trim());
            return true;
        }
        return false;
    }
    
    /**
     * フィードバックを完了して保存
     */
    completeFeedback() {
        if (!this.currentFeedback) return null;
        
        this.currentFeedback.isCompleted = true;
        this.feedbacks.push(this.currentFeedback);
        this.saveFeedbacks();
        
        const completed = this.currentFeedback;
        this.currentFeedback = null;
        
        return completed;
    }
    
    /**
     * フィードバックをキャンセル
     */
    cancelFeedback() {
        this.currentFeedback = null;
    }
    
    /**
     * 分析結果から必要最小限を抽出
     */
    extractEssentials(results) {
        if (!results) return null;
        
        return {
            tripleOS: results.tripleOS || {},
            hexagram: results.hexagram || null,
            primaryPattern: results.pattern || null
        };
    }
    
    /**
     * フィードバックの統計を取得
     */
    getStatistics() {
        const stats = {
            total: this.feedbacks.length,
            byType: {},
            byReaction: {},
            averageConfidence: 0,
            disagreementRate: 0
        };
        
        // タイプ別集計
        Object.values(this.feedbackTypes).forEach(type => {
            stats.byType[type] = 0;
        });
        
        // 反応別集計
        Object.keys(this.reactions).forEach(reaction => {
            stats.byReaction[reaction] = 0;
        });
        
        let totalConfidence = 0;
        let disagreements = 0;
        
        this.feedbacks.forEach(feedback => {
            if (feedback.type) {
                stats.byType[feedback.type]++;
                if (feedback.type === this.feedbackTypes.DISAGREE) {
                    disagreements++;
                }
            }
            
            if (feedback.reaction) {
                stats.byReaction[feedback.reaction]++;
            }
            
            if (feedback.confidence) {
                totalConfidence += feedback.confidence;
            }
        });
        
        if (stats.total > 0) {
            stats.averageConfidence = Math.round(totalConfidence / stats.total);
            stats.disagreementRate = (disagreements / stats.total * 100).toFixed(1);
        }
        
        return stats;
    }
    
    /**
     * HTMLを生成
     */
    render(container) {
        const stats = this.getStatistics();
        
        const html = `
            <div class="feedback-collector">
                <h3>診断結果へのフィードバック</h3>
                
                <div class="feedback-prompt">
                    <p>この診断結果について、あなたの感想をお聞かせください。</p>
                </div>
                
                <!-- 感情的な反応 -->
                <div class="reaction-selector">
                    <h4>最初の印象は？</h4>
                    <div class="reaction-buttons">
                        ${Object.entries(this.reactions).map(([key, emoji]) => `
                            <button class="reaction-btn" data-reaction="${key}" title="${this.getReactionLabel(key)}">
                                <span class="reaction-emoji">${emoji}</span>
                                <span class="reaction-label">${this.getReactionLabel(key)}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- フィードバックタイプ -->
                <div class="feedback-type-selector">
                    <h4>結果についてどう思いますか？</h4>
                    <div class="feedback-types">
                        ${Object.entries(this.feedbackTypes).map(([key, value]) => `
                            <label class="feedback-type-option">
                                <input type="radio" name="feedback-type" value="${value}">
                                <span>${this.getFeedbackTypeLabel(value)}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 具体的なフィードバック -->
                <div class="specific-feedback">
                    <h4>具体的にお聞かせください</h4>
                    <textarea 
                        id="specific-feedback-text" 
                        placeholder="例：Engine OSの評価が高すぎる気がします。実際はもっと慎重に行動することが多いです。"
                        rows="4"
                    ></textarea>
                </div>
                
                <!-- 反例入力 -->
                <div class="counter-example">
                    <h4>反例があれば教えてください（任意）</h4>
                    <textarea 
                        id="counter-example-text" 
                        placeholder="例：最近の会議では、提案された通りではなく、チームの意見を重視して決定しました。"
                        rows="3"
                    ></textarea>
                </div>
                
                <!-- アクションボタン -->
                <div class="feedback-actions">
                    <button class="btn-cancel" onclick="feedbackCollector.cancelFeedback()">
                        キャンセル
                    </button>
                    <button class="btn-submit" onclick="feedbackCollector.submitFeedback()">
                        フィードバックを送信
                    </button>
                </div>
                
                <!-- 統計表示 -->
                ${stats.total > 0 ? `
                    <div class="feedback-stats">
                        <h4>これまでのフィードバック</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-value">${stats.total}</span>
                                <span class="stat-label">件のフィードバック</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${stats.disagreementRate}%</span>
                                <span class="stat-label">不一致率</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${stats.averageConfidence}%</span>
                                <span class="stat-label">平均確信度</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- プライバシー通知 -->
                <div class="privacy-notice">
                    <p>
                        ※ フィードバックは診断精度向上のために使用されます。
                        個人を特定する情報は含まれません。
                    </p>
                </div>
            </div>
        `;
        
        if (container) {
            container.innerHTML = html;
            this.attachEventListeners(container);
        }
        
        return html;
    }
    
    /**
     * イベントリスナーを設定
     */
    attachEventListeners(container) {
        // 反応ボタン
        container.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reaction = e.currentTarget.dataset.reaction;
                this.handleReactionClick(reaction, e.currentTarget);
            });
        });
        
        // フィードバックタイプ
        container.querySelectorAll('input[name="feedback-type"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.setFeedbackType(e.target.value);
            });
        });
    }
    
    /**
     * 反応ボタンクリック処理
     */
    handleReactionClick(reaction, button) {
        // 既存の選択をクリア
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 新しい選択を設定
        button.classList.add('selected');
        this.setReaction(this.reactions[reaction]);
    }
    
    /**
     * フィードバック収集（TDD互換性）
     */
    collectFeedback(type, reaction, text) {
        const feedbackId = this.createFeedback();
        if (type) this.setFeedbackType(type);
        if (reaction) this.setReaction(reaction);
        if (text) this.setSpecificFeedback(text);
        return this.submitFeedback();
    }

    /**
     * フィードバックを送信
     */
    submitFeedback() {
        const specificText = document.getElementById('specific-feedback-text')?.value;
        const counterExample = document.getElementById('counter-example-text')?.value;
        
        if (!specificText || !this.currentFeedback?.type) {
            alert('フィードバックタイプと具体的な内容を入力してください。');
            return;
        }
        
        this.addSpecificFeedback(specificText);
        if (counterExample) {
            this.addCounterExample(counterExample);
        }
        
        const completed = this.completeFeedback();
        
        if (completed) {
            this.showThankYouMessage();
            console.log('Feedback submitted:', completed);
            
            // KPI: 不一致フィードバック率の計算
            const stats = this.getStatistics();
            console.log(`KPI - Disagreement Rate: ${stats.disagreementRate}%`);
        }
    }
    
    /**
     * お礼メッセージを表示
     */
    showThankYouMessage() {
        const message = document.createElement('div');
        message.className = 'thank-you-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="message-icon">🙏</span>
                <h3>フィードバックありがとうございました</h3>
                <p>あなたのご意見は診断精度の向上に活用させていただきます。</p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
    
    /**
     * ラベル取得メソッド
     */
    getReactionLabel(key) {
        const labels = {
            SURPRISED: '驚いた',
            CONFUSED: '困惑した',
            ENLIGHTENED: '気づきがあった',
            VALIDATED: '確証を得た',
            SKEPTICAL: '懐疑的'
        };
        return labels[key] || '';
    }
    
    getFeedbackTypeLabel(type) {
        const labels = {
            disagree: '結果に同意できない',
            partial: '部分的に同意',
            missing: '重要な要素が欠けている',
            misunderstood: '誤解されている',
            other: 'その他'
        };
        return labels[type] || '';
    }
    
    /**
     * ローカルストレージ操作
     */
    loadFeedbacks() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.feedbacks = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load feedbacks:', e);
        }
    }
    
    saveFeedbacks() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.feedbacks));
        } catch (e) {
            console.error('Failed to save feedbacks:', e);
        }
    }
    
    /**
     * ID生成
     */
    generateId() {
        return `fb_${Date.now()}_${this.rng.next().toString(36).substr(2, 9)}`;
    }
    
    /**
     * フィードバックをエクスポート
     */
    exportFeedbacks() {
        const data = {
            exported: new Date().toISOString(),
            feedbacks: this.feedbacks,
            statistics: this.getStatistics()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feedbacks_${Date.now()}.json`;
        a.click();
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackCollector;
}