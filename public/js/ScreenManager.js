/**
 * ScreenManager - 画面遷移を管理するユーティリティクラス
 * OS Analyzer用に実装
 */

'use strict';

class ScreenManager {
    constructor() {
        this.screens = {};
        this.currentScreen = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // DOM要素が完全に読み込まれるまで待機
        if (document.readyState === 'loading') {
            console.log('⏳ ScreenManager: DOM not ready, deferring init until DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', () => {
                if (!this.isInitialized) {
                    this.performInit();
                    this.isInitialized = true;
                }
            }, { once: true });
            return;
        }
        this.performInit();
        this.isInitialized = true;
    }
    
    performInit() {
        // 画面要素をIDで直接取得（より確実）
        const screenIds = ['welcome-screen', 'question-screen', 'results-screen'];
        
        screenIds.forEach(screenId => {
            const element = document.getElementById(screenId);
            const key = screenId.replace('-screen', '');
            
            if (element) {
                this.screens[key] = element;
                console.log(`✅ ScreenManager: Found ${screenId}`);
            } else {
                console.warn(`⚠️ ScreenManager: ${screenId} element not found`);
                // フォールバック：クラス名で検索
                const fallbackElement = document.querySelector(`.${screenId}`);
                if (fallbackElement) {
                    this.screens[key] = fallbackElement;
                    console.log(`✅ ScreenManager: Found ${screenId} via class fallback`);
                } else {
                    console.error(`❌ ScreenManager: ${screenId} not found via ID or class`);
                }
            }
        });

        // 現在アクティブな画面を特定
        const activeScreen = document.querySelector('.welcome-screen.active, .question-screen.active, .results-screen.active') ||
                            document.querySelector('#welcome-screen.active, #question-screen.active, #results-screen.active');
        
        if (activeScreen) {
            const id = activeScreen.id ? activeScreen.id.replace('-screen', '') : 
                      activeScreen.className.match(/(welcome|question|results)-screen/)?.[1] || 'welcome';
            this.currentScreen = id;
        } else {
            // デフォルトはウェルカム画面
            this.currentScreen = 'welcome';
            if (this.screens.welcome) {
                this.screens.welcome.classList.add('active');
            }
        }

        console.log('🖥️ ScreenManager initialized with screens:', Object.keys(this.screens));
        console.log('🖥️ Current screen:', this.currentScreen);
    }

    /**
     * 指定した画面に切り替える
     * @param {string} screenId - 切り替え先の画面ID (welcome, question, results)
     * @param {Object} options - オプション
     * @param {Function} options.callback - 切り替え後に実行するコールバック関数
     */
    switchTo(screenId, options = {}) {
        console.log(`🔄 Switching to screen: ${screenId}`);
        
        const targetScreen = this.screens[screenId];
        if (!targetScreen) {
            console.error(`❌ Screen not found: ${screenId}`);
            return false;
        }

        // すべての画面を非表示（より確実な方法）
        const allScreens = document.querySelectorAll('.screen, .welcome-screen, .question-screen, .results-screen');
        allScreens.forEach(screen => {
            if (screen) {
                screen.style.display = 'none';
                screen.classList.remove('active');
            }
        });
        
        // 登録された画面も確実に非表示
        Object.values(this.screens).forEach(screen => {
            if (screen) {
                screen.style.display = 'none';
                screen.classList.remove('active');
            }
        });

        // 指定された画面を表示
        if (targetScreen) {
            targetScreen.style.display = 'block';
            
            // アニメーションのために少し遅延
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 10);
            
            this.currentScreen = screenId;
            console.log(`✅ Switched to screen: ${screenId}`);
        } else {
            console.error(`❌ Target screen element not found: ${screenId}`);
            return false;
        }

        // コールバックがあれば実行
        if (options.callback && typeof options.callback === 'function') {
            setTimeout(() => {
                options.callback();
            }, 50); // アニメーション完了後に実行
        }

        return true;
    }

    /**
     * エラー表示
     * @param {string} message - エラーメッセージ
     * @param {Object} options - オプション
     */
    showError(message, options = {}) {
        try {
            console.error('ScreenManager.showError:', message);

            // 結果画面に表示できる場合はそこへ
            const resultsScreen = document.querySelector('.results-screen');
            if (resultsScreen) {
                const slot = resultsScreen.querySelector('.error-message')
                    || resultsScreen.querySelector('.result-title')
                    || resultsScreen;
                if (slot) {
                    slot.textContent = `エラー: ${message}`;
                }
                this.switchTo && this.switchTo('results');
                return;
            }

            // ウェルカム画面にフォールバック
            const welcome = document.querySelector('.welcome-screen');
            if (welcome) {
                const box = document.createElement('div');
                box.className = 'error-inline';
                box.textContent = `エラー: ${message}`;
                welcome.appendChild(box);
                this.switchTo && this.switchTo('welcome');
                return;
            }

            // 最終手段
            const errorContainer = document.getElementById('error-container') || this.createErrorContainer();
            errorContainer.innerHTML = `
                <div class="error-box">
                    <h3>エラーが発生しました</h3>
                    <p>${message}</p>
                    ${options.recoveryActions ? `
                        <ul class="recovery-actions">
                            ${options.recoveryActions.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <button onclick="location.reload()">再試行</button>
                </div>
            `;
            if (errorContainer && errorContainer.style) {
                errorContainer.style.display = 'flex';
            }
        } catch (err) {
            console.error('showError fallback failed:', err);
            alert(`エラー: ${message}`);
        }
    }

    /**
     * エラーコンテナを作成
     * @returns {HTMLElement} 作成したエラーコンテナ
     */
    createErrorContainer() {
        const container = document.createElement('div');
        container.id = 'error-container';
        container.className = 'error-overlay';
        document.body.appendChild(container);
        return container;
    }

    /**
     * 現在の画面IDを取得
     * @returns {string} 現在の画面ID
     */
    getCurrentScreen() {
        return this.currentScreen;
    }
}

// ScreenManagerのグローバルインスタンスを作成（DOM読み込み後）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ScreenManager) {
            window.ScreenManager = new ScreenManager();
        }
    }, { once: true });
} else {
    window.ScreenManager = new ScreenManager();
}