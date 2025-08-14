/**
 * User Feedback Widget for HAQEI
 * Collects user satisfaction and accuracy feedback
 */

class FeedbackWidget {
    constructor() {
        this.feedbackData = {
            satisfaction: 0,
            accuracy: 0,
            helpful: null,
            comments: '',
            timestamp: null
        };
        this.isVisible = false;
    }

    /**
     * Create feedback widget HTML
     */
    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'feedback-widget';
        widget.className = 'feedback-widget';
        widget.innerHTML = `
            <div class="feedback-container">
                <button class="feedback-toggle" onclick="window.feedbackWidget.toggle()">
                    📝 フィードバック
                </button>
                <div class="feedback-panel" style="display: none;">
                    <h3>分析結果はいかがでしたか？</h3>
                    
                    <div class="feedback-section">
                        <label>満足度</label>
                        <div class="rating-stars" data-rating="satisfaction">
                            ${this.createStars('satisfaction')}
                        </div>
                    </div>
                    
                    <div class="feedback-section">
                        <label>精度の高さ</label>
                        <div class="rating-stars" data-rating="accuracy">
                            ${this.createStars('accuracy')}
                        </div>
                    </div>
                    
                    <div class="feedback-section">
                        <label>この分析は役に立ちましたか？</label>
                        <div class="helpful-buttons">
                            <button class="helpful-btn" data-helpful="yes" onclick="window.feedbackWidget.setHelpful(true)">
                                👍 はい
                            </button>
                            <button class="helpful-btn" data-helpful="no" onclick="window.feedbackWidget.setHelpful(false)">
                                👎 いいえ
                            </button>
                        </div>
                    </div>
                    
                    <div class="feedback-section">
                        <label>ご意見・ご感想（任意）</label>
                        <textarea 
                            id="feedback-comments" 
                            placeholder="改善点やご要望があればお聞かせください"
                            maxlength="500"
                        ></textarea>
                    </div>
                    
                    <div class="feedback-actions">
                        <button class="btn-submit" onclick="window.feedbackWidget.submit()">
                            送信
                        </button>
                        <button class="btn-cancel" onclick="window.feedbackWidget.close()">
                            キャンセル
                        </button>
                    </div>
                    
                    <div class="feedback-message" style="display: none;"></div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .feedback-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .feedback-toggle {
                background: #4a90e2;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            
            .feedback-toggle:hover {
                background: #357abd;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .feedback-panel {
                position: absolute;
                bottom: 60px;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 20px;
                width: 320px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .feedback-panel h3 {
                margin: 0 0 20px 0;
                color: #333;
                font-size: 16px;
            }
            
            .feedback-section {
                margin-bottom: 20px;
            }
            
            .feedback-section label {
                display: block;
                margin-bottom: 8px;
                color: #666;
                font-size: 14px;
            }
            
            .rating-stars {
                display: flex;
                gap: 8px;
            }
            
            .star {
                font-size: 24px;
                cursor: pointer;
                transition: transform 0.2s ease;
                user-select: none;
            }
            
            .star:hover {
                transform: scale(1.2);
            }
            
            .star.active {
                color: #ffd700;
            }
            
            .helpful-buttons {
                display: flex;
                gap: 10px;
            }
            
            .helpful-btn {
                flex: 1;
                padding: 8px 16px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .helpful-btn:hover {
                background: #f5f5f5;
            }
            
            .helpful-btn.selected {
                background: #4a90e2;
                color: white;
                border-color: #4a90e2;
            }
            
            #feedback-comments {
                width: 100%;
                min-height: 80px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 6px;
                resize: vertical;
                font-size: 14px;
                font-family: inherit;
            }
            
            .feedback-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .btn-submit, .btn-cancel {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            
            .btn-submit {
                background: #4a90e2;
                color: white;
            }
            
            .btn-submit:hover {
                background: #357abd;
            }
            
            .btn-cancel {
                background: #f5f5f5;
                color: #666;
            }
            
            .btn-cancel:hover {
                background: #e0e0e0;
            }
            
            .feedback-message {
                margin-top: 15px;
                padding: 10px;
                border-radius: 6px;
                font-size: 14px;
                text-align: center;
            }
            
            .feedback-message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .feedback-message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(widget);
        
        // Add event listeners
        this.attachEventListeners();
    }

    /**
     * Create star rating HTML
     */
    createStars(type) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star" data-value="${i}" data-type="${type}" onclick="window.feedbackWidget.setRating('${type}', ${i})">☆</span>`;
        }
        return stars;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const comments = document.getElementById('feedback-comments');
        if (comments) {
            comments.addEventListener('input', (e) => {
                this.feedbackData.comments = e.target.value;
            });
        }
    }

    /**
     * Toggle widget visibility
     */
    toggle() {
        const panel = document.querySelector('.feedback-panel');
        if (panel) {
            this.isVisible = !this.isVisible;
            panel.style.display = this.isVisible ? 'block' : 'none';
        }
    }

    /**
     * Close widget
     */
    close() {
        const panel = document.querySelector('.feedback-panel');
        if (panel) {
            panel.style.display = 'none';
            this.isVisible = false;
        }
    }

    /**
     * Set rating
     */
    setRating(type, value) {
        this.feedbackData[type] = value;
        
        // Update UI
        const stars = document.querySelectorAll(`.star[data-type="${type}"]`);
        stars.forEach((star, index) => {
            if (index < value) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }

    /**
     * Set helpful status
     */
    setHelpful(value) {
        this.feedbackData.helpful = value;
        
        // Update UI
        const buttons = document.querySelectorAll('.helpful-btn');
        buttons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const selectedBtn = document.querySelector(`.helpful-btn[data-helpful="${value ? 'yes' : 'no'}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }

    /**
     * Submit feedback
     */
    submit() {
        this.feedbackData.timestamp = new Date().toISOString();
        
        // Validate
        if (this.feedbackData.satisfaction === 0 || this.feedbackData.accuracy === 0) {
            this.showMessage('満足度と精度の評価を選択してください', 'error');
            return;
        }
        
        // Track with A/B testing
        if (window.haqeiABTest) {
            window.haqeiABTest.trackFeedback(
                this.feedbackData.satisfaction,
                this.feedbackData.accuracy,
                this.feedbackData.comments
            );
        }
        
        // Store locally
        this.storeFeedback();
        
        // Show success message
        this.showMessage('フィードバックありがとうございました！', 'success');
        
        // Close after 2 seconds
        setTimeout(() => {
            this.close();
            this.reset();
        }, 2000);
    }

    /**
     * Store feedback locally
     */
    storeFeedback() {
        const feedbackHistory = JSON.parse(localStorage.getItem('haqei_feedback') || '[]');
        feedbackHistory.push(this.feedbackData);
        
        // Keep only last 50 feedbacks
        if (feedbackHistory.length > 50) {
            feedbackHistory.splice(0, feedbackHistory.length - 50);
        }
        
        localStorage.setItem('haqei_feedback', JSON.stringify(feedbackHistory));
    }

    /**
     * Show message
     */
    showMessage(text, type) {
        const messageEl = document.querySelector('.feedback-message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `feedback-message ${type}`;
            messageEl.style.display = 'block';
        }
    }

    /**
     * Reset form
     */
    reset() {
        this.feedbackData = {
            satisfaction: 0,
            accuracy: 0,
            helpful: null,
            comments: '',
            timestamp: null
        };
        
        // Reset UI
        document.querySelectorAll('.star').forEach(star => {
            star.textContent = '☆';
            star.classList.remove('active');
        });
        
        document.querySelectorAll('.helpful-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const comments = document.getElementById('feedback-comments');
        if (comments) {
            comments.value = '';
        }
        
        const messageEl = document.querySelector('.feedback-message');
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    }

    /**
     * Show widget after analysis completion
     */
    showAfterAnalysis(delay = 5000) {
        setTimeout(() => {
            const toggle = document.querySelector('.feedback-toggle');
            if (toggle) {
                // Pulse animation to draw attention
                toggle.style.animation = 'pulse 2s ease-in-out 3';
            }
        }, delay);
    }
}

// Initialize feedback widget
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.feedbackWidget = new FeedbackWidget();
        window.feedbackWidget.createWidget();
    });
} else {
    window.feedbackWidget = new FeedbackWidget();
    window.feedbackWidget.createWidget();
}

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle);