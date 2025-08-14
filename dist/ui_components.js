/**
 * HAQEI UI Components - 保持すべきUI表示ロジック
 * 既存コードから抽出した価値のあるUIコンポーネント
 */

// ==========================================
// 1. 結果表示システム
// ==========================================

class ResultsDisplay {
    constructor() {
        this.currentTab = 'persona';
    }
    
    /**
     * Triple OS結果表示
     */
    displayTripleOS(engineOS, interfaceOS, safeModeOS) {
        const tripleOSHTML = `
            <div class="triple-os-container">
                <div class="os-card engine-os">
                    <h3>Engine OS</h3>
                    <div class="os-hexagram">${engineOS.hexagram}</div>
                    <div class="os-description">${engineOS.description}</div>
                    <div class="os-score">スコア: ${engineOS.score}</div>
                </div>
                <div class="os-card interface-os">
                    <h3>Interface OS</h3>
                    <div class="os-hexagram">${interfaceOS.hexagram}</div>
                    <div class="os-description">${interfaceOS.description}</div>
                    <div class="os-score">スコア: ${interfaceOS.score}</div>
                </div>
                <div class="os-card safemode-os">
                    <h3>Safe Mode OS</h3>
                    <div class="os-hexagram">${safeModeOS.hexagram}</div>
                    <div class="os-description">${safeModeOS.description}</div>
                    <div class="os-score">スコア: ${safeModeOS.score}</div>
                </div>
            </div>
        `;
        return tripleOSHTML;
    }
    
    /**
     * 8次元レーダーチャート表示
     */
    displayRadarChart(scores) {
        // Canvas要素の作成
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        
        // レーダーチャート描画ロジック
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        
        // 8方向の角度計算
        const angleStep = (Math.PI * 2) / 8;
        
        // スコア描画
        ctx.beginPath();
        Object.values(scores).forEach((score, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = centerX + Math.cos(angle) * (score / 100) * radius;
            const y = centerY + Math.sin(angle) * (score / 100) * radius;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.stroke();
        
        return canvas;
    }
    
    /**
     * タブ切り替えシステム
     */
    createTabSystem() {
        const tabHTML = `
            <div class="result-tabs">
                <button class="tab-button active" data-tab="persona">
                    ペルソナ分析
                </button>
                <button class="tab-button" data-tab="os">
                    Triple OS詳細
                </button>
                <button class="tab-button" data-tab="advice">
                    改善アドバイス
                </button>
                <button class="tab-button" data-tab="compatibility">
                    相性分析
                </button>
            </div>
            <div class="tab-content">
                <div id="persona-content" class="content-panel active"></div>
                <div id="os-content" class="content-panel"></div>
                <div id="advice-content" class="content-panel"></div>
                <div id="compatibility-content" class="content-panel"></div>
            </div>
        `;
        return tabHTML;
    }
}

// ==========================================
// 2. 質問表示システム
// ==========================================

class QuestionDisplay {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 30;
    }
    
    /**
     * 質問カード表示
     */
    displayQuestion(question, questionNumber) {
        const questionHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-number">Q${questionNumber}</span>
                    <span class="question-category">${question.category.title}</span>
                </div>
                <h2 class="question-text">${question.text}</h2>
                <div class="options-container">
                    ${question.options.map(option => `
                        <label class="option-label">
                            <input type="radio" name="q${question.id}" value="${option.value}">
                            <span class="option-text">${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        return questionHTML;
    }
    
    /**
     * プログレスバー表示
     */
    displayProgress(current, total) {
        const percentage = (current / total) * 100;
        const progressHTML = `
            <div class="progress-container">
                <div class="progress-bar" style="width: ${percentage}%"></div>
                <span class="progress-text">${current} / ${total}</span>
            </div>
        `;
        return progressHTML;
    }
}

// ==========================================
// 3. アニメーション制御
// ==========================================

class AnimationController {
    /**
     * フェードイン効果
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
    
    /**
     * スライド効果
     */
    slideIn(element, direction = 'right', duration = 300) {
        const startPosition = direction === 'right' ? '100%' : '-100%';
        element.style.transform = `translateX(${startPosition})`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `transform ${duration}ms ease-out`;
            element.style.transform = 'translateX(0)';
        }, 10);
    }
}

// ==========================================
// 4. モーダルシステム
// ==========================================

class ModalController {
    /**
     * モーダル表示
     */
    showModal(title, content) {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHTML;
        document.body.appendChild(modalElement);
        
        // クローズイベント
        modalElement.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modalElement);
        });
        
        modalElement.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(modalElement);
            }
        });
    }
    
    closeModal(modalElement) {
        modalElement.remove();
    }
}

// ==========================================
// エクスポート
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ResultsDisplay,
        QuestionDisplay,
        AnimationController,
        ModalController
    };
}