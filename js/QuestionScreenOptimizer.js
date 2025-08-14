/**
 * Question Screen Optimizer - Phase 2
 * 質問画面のセレクター調整とPlaywright対応改善
 */

class QuestionScreenOptimizer {
    constructor() {
        this.selectors = {
            // 標準セレクター定義
            screens: {
                welcome: '#welcome-screen',
                question: '#question-screen',
                analysis: '#analysis-screen',
                results: '#results-screen'
            },
            questionElements: {
                container: '#question-container',
                number: '.question-number',
                text: '.question-text',
                options: '.answer-options',
                option: '.answer-option',
                radioInput: 'input[type="radio"]',
                selectedRadio: 'input[type="radio"]:checked'
            },
            navigation: {
                nextButton: '#next-button',
                prevButton: '#prev-button',
                submitButton: '#submit-button',
                progressBar: '.progress-bar',
                progressFill: '.progress-fill'
            },
            // Playwright用の安定したセレクター
            playwright: {
                questionScreen: '[data-testid="question-screen"]',
                questionContainer: '[data-testid="question-container"]',
                answerOption: '[data-testid="answer-option"]',
                nextButton: '[data-testid="next-button"]',
                submitButton: '[data-testid="submit-button"]'
            }
        };
        
        this.optimizations = {
            debounceDelay: 150,
            transitionDuration: 300,
            preloadQuestions: 3,
            cacheResponses: true
        };
        
        this.cache = new Map();
    }
    
    /**
     * 質問画面の最適化
     */
    optimizeQuestionScreen() {
        // データ属性を追加してPlaywright対応を改善
        this.addTestIds();
        
        // イベントリスナーの最適化
        this.optimizeEventListeners();
        
        // レンダリング最適化
        this.optimizeRendering();
        
        // アクセシビリティ改善
        this.improveAccessibility();
        
        return {
            success: true,
            selectors: this.selectors,
            optimizations: this.optimizations
        };
    }
    
    /**
     * テストID属性の追加
     */
    addTestIds() {
        // 画面要素
        const screens = [
            { selector: '#welcome-screen', testId: 'welcome-screen' },
            { selector: '#question-screen', testId: 'question-screen' },
            { selector: '#analysis-screen', testId: 'analysis-screen' },
            { selector: '#results-screen', testId: 'results-screen' }
        ];
        
        screens.forEach(screen => {
            const element = document.querySelector(screen.selector);
            if (element) {
                element.setAttribute('data-testid', screen.testId);
            }
        });
        
        // 質問関連要素
        const questionElements = [
            { selector: '#question-container', testId: 'question-container' },
            { selector: '.question-number', testId: 'question-number' },
            { selector: '.question-text', testId: 'question-text' }
        ];
        
        questionElements.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.setAttribute('data-testid', item.testId);
            }
        });
        
        // 回答オプション
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            option.setAttribute('data-testid', `answer-option-${index}`);
            option.setAttribute('data-value', option.querySelector('input')?.value || '');
        });
        
        // ナビゲーションボタン
        const buttons = [
            { selector: '#next-button', testId: 'next-button' },
            { selector: '#prev-button', testId: 'prev-button' },
            { selector: '#submit-button', testId: 'submit-button' }
        ];
        
        buttons.forEach(button => {
            const element = document.querySelector(button.selector);
            if (element) {
                element.setAttribute('data-testid', button.testId);
                element.setAttribute('aria-label', button.testId.replace('-', ' '));
            }
        });
    }
    
    /**
     * イベントリスナーの最適化
     */
    optimizeEventListeners() {
        // デバウンス付きイベントハンドラ
        const debouncedHandlers = new Map();
        
        // ラジオボタンのクリックイベント最適化
        const optimizeRadioButtons = () => {
            const container = document.querySelector('#question-container');
            if (!container) return;
            
            // イベント委譲を使用
            container.addEventListener('click', (e) => {
                const option = e.target.closest('.answer-option');
                if (!option) return;
                
                const radio = option.querySelector('input[type="radio"]');
                if (radio && !radio.checked) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, { passive: true });
        };
        
        // キーボードナビゲーション最適化
        const optimizeKeyboardNavigation = () => {
            document.addEventListener('keydown', (e) => {
                if (!this.isQuestionScreenActive()) return;
                
                switch(e.key) {
                    case 'ArrowRight':
                    case 'Enter':
                        this.handleNext();
                        break;
                    case 'ArrowLeft':
                        this.handlePrevious();
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                        this.selectAnswer(parseInt(e.key));
                        break;
                }
            });
        };
        
        optimizeRadioButtons();
        optimizeKeyboardNavigation();
    }
    
    /**
     * レンダリング最適化
     */
    optimizeRendering() {
        // 質問表示の最適化
        this.optimizeQuestionDisplay = (questionData) => {
            const container = document.querySelector('#question-container');
            if (!container) return;
            
            // DocumentFragmentを使用
            const fragment = document.createDocumentFragment();
            
            // 質問番号
            const numberEl = document.createElement('div');
            numberEl.className = 'question-number';
            numberEl.setAttribute('data-testid', 'question-number');
            numberEl.textContent = `質問 ${questionData.number} / ${questionData.total}`;
            fragment.appendChild(numberEl);
            
            // 質問テキスト
            const textEl = document.createElement('div');
            textEl.className = 'question-text';
            textEl.setAttribute('data-testid', 'question-text');
            textEl.textContent = questionData.text;
            fragment.appendChild(textEl);
            
            // 回答オプション
            const optionsEl = document.createElement('div');
            optionsEl.className = 'answer-options';
            optionsEl.setAttribute('data-testid', 'answer-options');
            
            questionData.options.forEach((option, index) => {
                const optionEl = this.createOptionElement(option, index, questionData.id);
                optionsEl.appendChild(optionEl);
            });
            
            fragment.appendChild(optionsEl);
            
            // 一度にDOMを更新
            requestAnimationFrame(() => {
                container.innerHTML = '';
                container.appendChild(fragment);
            });
        };
        
        // プログレスバーアニメーション最適化
        this.optimizeProgressBar = (progress) => {
            const progressFill = document.querySelector('.progress-fill');
            if (!progressFill) return;
            
            // CSS transitionを使用
            progressFill.style.transition = `width ${this.optimizations.transitionDuration}ms ease-out`;
            progressFill.style.width = `${progress}%`;
        };
    }
    
    /**
     * オプション要素の作成
     */
    createOptionElement(option, index, questionId) {
        const label = document.createElement('label');
        label.className = 'answer-option';
        label.setAttribute('data-testid', `answer-option-${index}`);
        label.setAttribute('data-value', option.value);
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${questionId}`;
        input.value = option.value;
        input.id = `q${questionId}-option-${index}`;
        
        const text = document.createElement('span');
        text.className = 'option-text';
        text.textContent = option.text;
        
        label.appendChild(input);
        label.appendChild(text);
        
        return label;
    }
    
    /**
     * アクセシビリティ改善
     */
    improveAccessibility() {
        // ARIA属性の追加
        const addAriaAttributes = () => {
            // 質問コンテナ
            const container = document.querySelector('#question-container');
            if (container) {
                container.setAttribute('role', 'form');
                container.setAttribute('aria-label', '質問フォーム');
            }
            
            // プログレスバー
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.setAttribute('role', 'progressbar');
                progressBar.setAttribute('aria-valuemin', '0');
                progressBar.setAttribute('aria-valuemax', '100');
            }
            
            // ボタン
            document.querySelectorAll('button').forEach(button => {
                if (!button.getAttribute('aria-label')) {
                    button.setAttribute('aria-label', button.textContent);
                }
            });
        };
        
        // フォーカス管理
        const manageFocus = () => {
            // 質問変更時に最初のオプションにフォーカス
            const firstOption = document.querySelector('.answer-option input');
            if (firstOption) {
                firstOption.focus();
            }
        };
        
        addAriaAttributes();
        
        // MutationObserverで動的な変更を監視
        const observer = new MutationObserver(() => {
            addAriaAttributes();
        });
        
        const questionScreen = document.querySelector('#question-screen');
        if (questionScreen) {
            observer.observe(questionScreen, { 
                childList: true, 
                subtree: true 
            });
        }
    }
    
    /**
     * 質問画面がアクティブかチェック
     */
    isQuestionScreenActive() {
        const screen = document.querySelector('#question-screen');
        return screen && screen.classList.contains('active');
    }
    
    /**
     * 次へ処理
     */
    handleNext() {
        const nextButton = document.querySelector('#next-button');
        if (nextButton && !nextButton.disabled) {
            nextButton.click();
        }
    }
    
    /**
     * 前へ処理
     */
    handlePrevious() {
        const prevButton = document.querySelector('#prev-button');
        if (prevButton && !prevButton.disabled) {
            prevButton.click();
        }
    }
    
    /**
     * 回答選択
     */
    selectAnswer(value) {
        const option = document.querySelector(`.answer-option input[value="${value}"]`);
        if (option) {
            option.checked = true;
            option.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    
    /**
     * Playwright用のヘルパーメソッド生成
     */
    generatePlaywrightHelpers() {
        return `
// Playwright Helper Functions for OS Analyzer

class OSAnalyzerTestHelper {
    constructor(page) {
        this.page = page;
        this.selectors = ${JSON.stringify(this.selectors.playwright, null, 2)};
    }
    
    async waitForQuestionScreen() {
        await this.page.waitForSelector(this.selectors.questionScreen, {
            state: 'visible',
            timeout: 10000
        });
    }
    
    async answerQuestion(value) {
        const optionSelector = \`\${this.selectors.answerOption}[data-value="\${value}"]\`;
        await this.page.click(optionSelector);
    }
    
    async answerAllQuestions(answers) {
        for (let i = 0; i < answers.length; i++) {
            await this.answerQuestion(answers[i]);
            
            if (i < answers.length - 1) {
                await this.page.click(this.selectors.nextButton);
                await this.page.waitForTimeout(300); // アニメーション待機
            } else {
                await this.page.click(this.selectors.submitButton);
            }
        }
    }
    
    async getQuestionText() {
        return await this.page.textContent('[data-testid="question-text"]');
    }
    
    async getProgress() {
        const progressFill = await this.page.locator('.progress-fill');
        const width = await progressFill.evaluate(el => el.style.width);
        return parseFloat(width);
    }
}

module.exports = { OSAnalyzerTestHelper };
        `;
    }
    
    /**
     * セレクター検証
     */
    validateSelectors() {
        const results = {
            valid: [],
            missing: [],
            suggestions: []
        };
        
        // 全セレクターをチェック
        Object.entries(this.selectors).forEach(([category, selectors]) => {
            if (category === 'playwright') return;
            
            Object.entries(selectors).forEach(([key, selector]) => {
                const element = document.querySelector(selector);
                if (element) {
                    results.valid.push({ category, key, selector });
                } else {
                    results.missing.push({ category, key, selector });
                    
                    // 代替セレクターの提案
                    const suggestion = this.suggestAlternativeSelector(selector);
                    if (suggestion) {
                        results.suggestions.push({
                            original: selector,
                            suggested: suggestion
                        });
                    }
                }
            });
        });
        
        return results;
    }
    
    /**
     * 代替セレクター提案
     */
    suggestAlternativeSelector(selector) {
        // IDセレクターの場合
        if (selector.startsWith('#')) {
            const id = selector.substring(1);
            // data-testid属性を使用
            return `[data-testid="${id}"]`;
        }
        
        // クラスセレクターの場合
        if (selector.startsWith('.')) {
            const className = selector.substring(1);
            // 複合セレクターを提案
            return `[class*="${className}"]`;
        }
        
        return null;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionScreenOptimizer;
}