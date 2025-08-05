/**
 * エラー表示UIコンポーネント v2.0.0
 * ユーザーフレンドリーなエラーメッセージと復旧アクション提案
 * 哲学的ガイダンス表示システム
 * 
 * 主要機能:
 * - 直感的なエラー表示
 * - 復旧アクション提案
 * - 易経に基づく哲学的ガイダンス
 * - bunenjin分人対応メッセージ
 * - アニメーション付きUI
 * 
 * @version 2.0.0
 * @author HAQEI Development Team
 * @philosophy bunenjin Triple OS
 */

class ErrorDisplayUI {
    constructor(config = {}) {
        this.version = "2.0.0";
        this.philosophy = "bunenjin-iching-guidance";
        
        this.config = {
            containerId: config.containerId || 'error-display-container',
            theme: config.theme || 'haqei-dark',
            animations: config.animations !== false,
            showPhilosophicalGuidance: config.showPhilosophicalGuidance !== false,
            showRecoveryActions: config.showRecoveryActions !== false,
            autoHide: config.autoHide !== false,
            autoHideDelay: config.autoHideDelay || 10000, // 10 seconds
            ...config
        };

        // UI State
        this.currentError = null;
        this.isVisible = false;
        this.displayQueue = [];
        this.isProcessingQueue = false;

        // UI Elements
        this.container = null;
        this.modal = null;
        this.notification = null;

        // Hexagram guidance database
        this.hexagramGuidance = this.initializeHexagramGuidance();
        
        // bunenjin persona messages
        this.bunenjinMessages = this.initializeBunenjinMessages();

        this.initialize();
    }

    /**
     * 初期化
     */
    initialize() {
        this.createContainer();
        this.injectStyles();
        this.setupEventListeners();
        
        console.log("✅ Error Display UI v2.0.0 initialized");
    }

    /**
     * コンテナ作成
     */
    createContainer() {
        // Main container
        this.container = document.createElement('div');
        this.container.id = this.config.containerId;
        this.container.className = 'haqei-error-display-container';
        
        // Append to body
        document.body.appendChild(this.container);
        
        console.log("✅ Error display container created");
    }

    /**
     * スタイル注入
     */
    injectStyles() {
        const styleId = 'haqei-error-display-styles';
        
        // Check if styles already exist
        if (document.getElementById(styleId)) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* HAQEI Error Display Styles v2.0.0 */
            .haqei-error-display-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                pointer-events: none;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            /* Modal Error Display */
            .haqei-error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: auto;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .haqei-error-modal.visible {
                opacity: 1;
            }

            .haqei-error-card {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                border: 2px solid #4a90e2;
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                color: #ffffff;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }

            .haqei-error-modal.visible .haqei-error-card {
                transform: scale(1);
            }

            .haqei-error-header {
                padding: 24px 24px 16px;
                border-bottom: 1px solid rgba(74, 144, 226, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .haqei-error-title {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0;
                font-size: 24px;
                font-weight: 600;
                color: #4a90e2;
            }

            .haqei-error-hexagram {
                font-size: 32px;
                filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.5));
            }

            .haqei-error-close {
                background: none;
                border: none;
                color: #999;
                font-size: 28px;
                cursor: pointer;
                transition: color 0.2s ease;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .haqei-error-close:hover {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }

            .haqei-error-content {
                padding: 24px;
            }

            .haqei-error-message {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
                padding: 16px;
                background: rgba(74, 144, 226, 0.1);
                border-left: 4px solid #4a90e2;
                border-radius: 4px;
            }

            .haqei-philosophical-guidance {
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 20px;
            }

            .haqei-philosophical-guidance h4 {
                margin: 0 0 12px 0;
                color: #ffd700;
                font-size: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .haqei-philosophical-guidance p {
                margin: 0;
                line-height: 1.5;
                color: #e0e0e0;
            }

            .haqei-bunenjin-personas {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 12px;
                margin-bottom: 20px;
            }

            .haqei-persona-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 12px;
                text-align: center;
            }

            .haqei-persona-card.active {
                border-color: #4a90e2;
                background: rgba(74, 144, 226, 0.1);
            }

            .haqei-persona-icon {
                font-size: 24px;
                margin-bottom: 8px;
                display: block;
            }

            .haqei-persona-name {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .haqei-persona-approach {
                font-size: 12px;
                color: #aaa;
            }

            .haqei-error-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: 20px;
            }

            .haqei-action-button {
                background: linear-gradient(135deg, #4a90e2, #357abd);
                border: none;
                border-radius: 8px;
                color: white;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .haqei-action-button:hover {
                background: linear-gradient(135deg, #357abd, #2968a3);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
            }

            .haqei-action-button:active {
                transform: translateY(0);
            }

            .haqei-action-button.secondary {
                background: linear-gradient(135deg, #6c757d, #5a6268);
            }

            .haqei-action-button.secondary:hover {
                background: linear-gradient(135deg, #5a6268, #495057);
            }

            .haqei-action-button.danger {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }

            .haqei-action-button.danger:hover {
                background: linear-gradient(135deg, #c82333, #bd2130);
            }

            .haqei-action-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }

            .haqei-error-details {
                margin-top: 20px;
            }

            .haqei-error-details summary {
                cursor: pointer;
                font-weight: 500;
                color: #4a90e2;
                margin-bottom: 12px;
                outline: none;
            }

            .haqei-error-details summary:hover {
                color: #357abd;
            }

            .haqei-error-details pre {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                padding: 12px;
                font-size: 12px;
                line-height: 1.4;
                overflow-x: auto;
                color: #e0e0e0;
            }

            /* Notification Style */
            .haqei-error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 1px solid #4a90e2;
                border-radius: 8px;
                color: white;
                padding: 16px;
                pointer-events: auto;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 1000000;
            }

            .haqei-error-notification.visible {
                transform: translateX(0);
            }

            .haqei-error-notification.success {
                border-color: #28a745;
                background: linear-gradient(135deg, #1a2e1a, #162116);
            }

            .haqei-error-notification.warning {
                border-color: #ffc107;
                background: linear-gradient(135deg, #2e2a1a, #212116);
            }

            .haqei-error-notification.info {
                border-color: #17a2b8;
                background: linear-gradient(135deg, #1a2a2e, #162121);
            }

            .haqei-notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .haqei-notification-title {
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .haqei-notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .haqei-notification-close:hover {
                color: white;
            }

            .haqei-notification-message {
                font-size: 14px;
                line-height: 1.4;
                margin-bottom: 8px;
            }

            .haqei-notification-guidance {
                font-size: 12px;
                color: #ccc;
                font-style: italic;
            }

            /* Animations */
            @keyframes haqeiPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .haqei-pulse {
                animation: haqeiPulse 2s infinite;
            }

            @keyframes haqeiSlideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .haqei-slide-down {
                animation: haqeiSlideDown 0.3s ease;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .haqei-error-card {
                    width: 95%;
                    margin: 10px;
                    max-height: 90vh;
                }
                
                .haqei-error-header,
                .haqei-error-content {
                    padding: 16px;
                }
                
                .haqei-bunenjin-personas {
                    grid-template-columns: 1fr;
                }
                
                .haqei-error-actions {
                    flex-direction: column;
                }
                
                .haqei-action-button {
                    width: 100%;
                    justify-content: center;
                }
                
                .haqei-error-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }

            /* Dark theme adjustments */
            .haqei-error-display-container.theme-light .haqei-error-card {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                color: #333;
                border-color: #4a90e2;
            }

            .haqei-error-display-container.theme-light .haqei-error-message {
                background: rgba(74, 144, 226, 0.1);
                color: #333;
            }
        `;
        
        document.head.appendChild(styles);
        console.log("✅ Error display styles injected");
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // Global error handler integration
        window.addEventListener('haqei-error', (event) => {
            this.displayError(event.detail);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isVisible) {
                this.hideError();
            }
        });
    }

    /**
     * 易経ガイダンス初期化
     */
    initializeHexagramGuidance() {
        return {
            1: { // 乾為天
                name: "乾為天",
                symbol: "☰",
                guidance: "創造力と行動力で困難を乗り越える時です。積極的に解決策を見つけ、前進しましょう。",
                keywords: ["創造", "行動", "リーダーシップ"]
            },
            2: { // 坤為地
                name: "坤為地", 
                symbol: "☷",
                guidance: "受容性と忍耐力で状況を受け入れ、適応することが重要です。焦らず着実に進みましょう。",
                keywords: ["受容", "忍耐", "適応"]
            },
            3: { // 水雷屯
                name: "水雷屯",
                symbol: "☵☳",
                guidance: "困難の始まりですが、これは成長の機会でもあります。慎重に準備を進めましょう。",
                keywords: ["困難", "準備", "成長"]
            },
            5: { // 水天需
                name: "水天需",
                symbol: "☵☰", 
                guidance: "待機の智慧を発揮する時です。適切なタイミングを待ち、準備を怠らないことが大切です。",
                keywords: ["待機", "タイミング", "準備"]
            },
            7: { // 地水師
                name: "地水師",
                symbol: "☷☵",
                guidance: "組織と統率力で問題を解決します。チームワークと規律が成功の鍵です。",
                keywords: ["組織", "統率", "チームワーク"]
            },
            11: { // 地天泰
                name: "地天泰",
                symbol: "☷☰",
                guidance: "天地泰平の時です。調和とバランスを保ち、安定した状態を維持しましょう。",
                keywords: ["調和", "安定", "泰平"]
            },
            15: { // 地山謙
                name: "地山謙",
                symbol: "☷☶",
                guidance: "謙虚さが解決への道です。自分を省み、他者から学ぶ姿勢を大切にしましょう。",
                keywords: ["謙虚", "学習", "改善"]
            },
            30: { // 離為火
                name: "離為火",
                symbol: "☲",
                guidance: "明晰さと洞察力で真相を見抜きます。明るい視点で問題を照らし出しましょう。",
                keywords: ["明晰", "洞察", "照明"]
            },
            31: { // 沢山咸
                name: "沢山咸",
                symbol: "☱☶",
                guidance: "感応と相互理解が重要です。相手の立場に立って考え、共感を示しましょう。",
                keywords: ["感応", "理解", "共感"]
            },
            32: { // 雷風恒
                name: "雷風恒",
                symbol: "☳☴",
                guidance: "持続性と一貫性を保つことが大切です。着実に継続することが成功につながります。",
                keywords: ["持続", "一貫", "継続"]
            }
        };
    }

    /**
     * bunenjin分人メッセージ初期化
     */
    initializeBunenjinMessages() {
        return {
            analyticalSelf: {
                name: "分析的分人",
                icon: "🔍",
                approach: "論理的分析",
                messages: {
                    network: "ネットワーク接続の問題を分析し、最適な解決策を検討します。",
                    memory: "メモリ使用量を分析し、効率的な最適化手順を実行します。",
                    ui: "UI要素の構造を分析し、レンダリング問題を特定します。",
                    default: "問題を論理的に分析し、系統的な解決アプローチを提案します。"
                }
            },
            intuitiveSelf: {
                name: "直感的分人",
                icon: "✨",
                approach: "精神的洞察",
                messages: {
                    network: "接続の流れを感じ取り、自然なタイミングで再試行します。",
                    memory: "システムの負荷を感じ取り、調和のとれた状態に導きます。",
                    ui: "ユーザーの期待を感じ取り、直感的な表示を復元します。",
                    default: "直感的な洞察で問題の本質を見抜き、自然な解決を促します。"
                }
            },
            socialSelf: {
                name: "社会的分人",
                icon: "🤝",
                approach: "関係性重視",
                messages: {
                    network: "ユーザーとの接続を大切にし、円滑なコミュニケーションを回復します。",
                    memory: "システムとユーザーの調和を考慮し、快適な環境を整えます。",
                    ui: "ユーザーの使いやすさを最優先に、親しみやすい画面を提供します。",
                    default: "ユーザーとの良好な関係を保ちながら、問題を解決します。"
                }
            }
        };
    }

    /**
     * エラー表示（メインメソッド）
     */
    displayError(errorData) {
        // Add to queue
        this.displayQueue.push(errorData);
        
        // Process queue if not already processing
        if (!this.isProcessingQueue) {
            this.processDisplayQueue();
        }
    }

    /**
     * 表示キュー処理
     */
    async processDisplayQueue() {
        this.isProcessingQueue = true;
        
        while (this.displayQueue.length > 0) {
            const errorData = this.displayQueue.shift();
            await this.showErrorModal(errorData);
            
            // Wait for user interaction or auto-hide
            await this.waitForUserInteraction(errorData);
        }
        
        this.isProcessingQueue = false;
    }

    /**
     * エラーモーダル表示
     */
    async showErrorModal(errorData) {
        this.currentError = errorData;
        
        // Determine display type based on severity
        if (errorData.classification?.severity === 'critical') {
            this.showModal(errorData);
        } else {
            this.showNotification(errorData);
        }
    }

    /**
     * モーダル表示
     */
    showModal(errorData) {
        // Create modal if it doesn't exist
        if (!this.modal) {
            this.modal = this.createModal();
        }

        // Populate modal content
        this.populateModal(errorData);
        
        // Show modal
        this.container.appendChild(this.modal);
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.modal.classList.add('visible');
        });
        
        this.isVisible = true;
        
        // Setup auto-hide if enabled
        if (this.config.autoHide && errorData.classification?.severity !== 'critical') {
            setTimeout(() => {
                this.hideError();
            }, this.config.autoHideDelay);
        }
    }

    /**
     * 通知表示
     */
    showNotification(errorData) {
        // Create notification
        const notification = this.createNotification(errorData);
        
        // Show notification
        this.container.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('visible');
        });
        
        // Auto-hide after delay
        setTimeout(() => {
            this.hideNotification(notification);
        }, this.config.autoHideDelay);
    }

    /**
     * モーダル作成
     */
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'haqei-error-modal';
        
        modal.innerHTML = `
            <div class="haqei-error-card">
                <div class="haqei-error-header">
                    <h2 class="haqei-error-title">
                        <span class="haqei-error-hexagram"></span>
                        <span class="haqei-error-title-text">システムエラー</span>
                    </h2>
                    <button class="haqei-error-close">&times;</button>
                </div>
                <div class="haqei-error-content">
                    <div class="haqei-error-message"></div>
                    <div class="haqei-philosophical-guidance"></div>
                    <div class="haqei-bunenjin-personas"></div>
                    <div class="haqei-error-actions"></div>
                    <details class="haqei-error-details">
                        <summary>詳細情報（開発者向け）</summary>
                        <pre class="haqei-error-debug"></pre>
                    </details>
                </div>
            </div>
        `;
        
        // Event listeners
        const closeButton = modal.querySelector('.haqei-error-close');
        closeButton.addEventListener('click', () => this.hideError());
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.hideError();
            }
        });
        
        return modal;
    }

    /**
     * 通知作成
     */
    createNotification(errorData) {
        const notification = document.createElement('div');
        notification.className = `haqei-error-notification ${this.getSeverityClass(errorData.classification?.severity)}`;
        
        const guidance = this.getHexagramGuidance(errorData.classification?.hexagram);
        const persona = this.getActivePersona(errorData.classification?.bunenjinPersona);
        
        notification.innerHTML = `
            <div class="haqei-notification-header">
                <div class="haqei-notification-title">
                    <span>${guidance.symbol}</span>
                    <span>${this.getErrorTitle(errorData)}</span>
                </div>
                <button class="haqei-notification-close">&times;</button>
            </div>
            <div class="haqei-notification-message">
                ${this.getErrorMessage(errorData)}
            </div>
            <div class="haqei-notification-guidance">
                ${persona.icon} ${persona.messages[this.getErrorCategory(errorData)] || persona.messages.default}
            </div>
        `;
        
        // Event listeners
        const closeButton = notification.querySelector('.haqei-notification-close');
        closeButton.addEventListener('click', () => this.hideNotification(notification));
        
        return notification;
    }

    /**
     * モーダル内容更新
     */
    populateModal(errorData) {
        if (!this.modal) return;
        
        const hexagram = errorData.classification?.hexagram || 1;
        const guidance = this.getHexagramGuidance(hexagram);
        const personas = this.getBunenjinPersonas(errorData);
        
        // Update hexagram and title
        const hexagramEl = this.modal.querySelector('.haqei-error-hexagram');
        const titleEl = this.modal.querySelector('.haqei-error-title-text');
        hexagramEl.textContent = guidance.symbol;
        titleEl.textContent = this.getErrorTitle(errorData);
        
        // Update message
        const messageEl = this.modal.querySelector('.haqei-error-message');
        messageEl.textContent = this.getErrorMessage(errorData);
        
        // Update philosophical guidance
        const guidanceEl = this.modal.querySelector('.haqei-philosophical-guidance');
        guidanceEl.innerHTML = `
            <h4>🔮 ${guidance.name} - 易経からの導き</h4>
            <p>${guidance.guidance}</p>
        `;
        
        // Update bunenjin personas
        const personasEl = this.modal.querySelector('.haqei-bunenjin-personas');
        personasEl.innerHTML = personas.map(persona => `
            <div class="haqei-persona-card ${persona.active ? 'active' : ''}">
                <span class="haqei-persona-icon">${persona.icon}</span>
                <div class="haqei-persona-name">${persona.name}</div>
                <div class="haqei-persona-approach">${persona.approach}</div>
            </div>
        `).join('');
        
        // Update actions
        const actionsEl = this.modal.querySelector('.haqei-error-actions');
        actionsEl.innerHTML = this.generateActionButtons(errorData);
        
        // Update debug info
        const debugEl = this.modal.querySelector('.haqei-error-debug');
        debugEl.textContent = this.formatDebugInfo(errorData);
        
        // Setup action listeners
        this.setupActionListeners(errorData);
    }

    /**
     * アクションボタン生成
     */
    generateActionButtons(errorData) {
        const actions = [];
        
        // Primary recovery action
        if (errorData.recovery?.strategy) {
            actions.push(`
                <button class="haqei-action-button" data-action="recover">
                    🔧 自動修復
                </button>
            `);
        }
        
        // Retry action
        actions.push(`
            <button class="haqei-action-button secondary" data-action="retry">
                🔄 再試行
            </button>
        `);
        
        // Reload action
        actions.push(`
            <button class="haqei-action-button secondary" data-action="reload">
                ⟳ ページ再読み込み
            </button>
        `);
        
        // Report action
        actions.push(`
            <button class="haqei-action-button secondary" data-action="report">
                📊 エラー報告
            </button>
        `);
        
        return actions.join('');
    }

    /**
     * アクションリスナー設定
     */
    setupActionListeners(errorData) {
        const actionButtons = this.modal.querySelectorAll('[data-action]');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const action = event.target.dataset.action;
                await this.handleAction(action, errorData, button);
            });
        });
    }

    /**
     * アクション処理
     */
    async handleAction(action, errorData, button) {
        // Disable button during processing
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = '処理中...';
        
        try {
            switch (action) {
                case 'recover':
                    await this.performRecovery(errorData);
                    break;
                case 'retry':
                    await this.performRetry(errorData);
                    break;
                case 'reload':
                    window.location.reload();
                    break;
                case 'report':
                    await this.reportError(errorData);
                    break;
            }
            
            // Show success and hide error
            this.showNotification({
                classification: { severity: 'info' },
                message: 'アクションが正常に実行されました'
            });
            
            this.hideError();
            
        } catch (error) {
            console.error('Action failed:', error);
            button.textContent = 'エラー';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }
    }

    /**
     * エラー非表示
     */
    hideError() {
        if (this.modal && this.modal.classList.contains('visible')) {
            this.modal.classList.remove('visible');
            
            setTimeout(() => {
                if (this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                }
                this.isVisible = false;
                this.currentError = null;
            }, 300);
        }
    }

    /**
     * 通知非表示
     */
    hideNotification(notification) {
        notification.classList.remove('visible');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ============ Helper Methods ============

    getHexagramGuidance(hexagramNumber) {
        return this.hexagramGuidance[hexagramNumber] || this.hexagramGuidance[1];
    }

    getActivePersona(personaType) {
        const type = personaType || 'analyticalSelf';
        return this.bunenjinMessages[type] || this.bunenjinMessages.analyticalSelf;
    }

    getBunenjinPersonas(errorData) {
        const activePersona = errorData.classification?.bunenjinPersona || 'analyticalSelf';
        
        return Object.entries(this.bunenjinMessages).map(([key, persona]) => ({
            ...persona,
            active: key === activePersona
        }));
    }

    getErrorTitle(errorData) {
        const type = errorData.classification?.type || 'UNKNOWN_ERROR';
        const titles = {
            NETWORK_ERROR: 'ネットワークエラー',
            STORAGE_ERROR: 'データ保存エラー',
            MEMORY_ERROR: 'メモリエラー',
            UI_RENDER_ERROR: '画面表示エラー',
            VALIDATION_ERROR: '入力検証エラー',
            COMPUTATION_ERROR: '計算エラー',
            INITIALIZATION_ERROR: 'システム初期化エラー',
            CONFIGURATION_ERROR: '設定エラー',
            BUNENJIN_CONFLICT: '分人思想調和エラー',
            TRIPLE_OS_MISALIGNMENT: 'Triple OS不整合エラー'
        };
        
        return titles[type] || 'システムエラー';
    }

    getErrorMessage(errorData) {
        return errorData.userMessage || 
               errorData.message || 
               errorData.error?.message || 
               '予期せぬエラーが発生しました';
    }

    getErrorCategory(errorData) {
        const type = errorData.classification?.type || '';
        
        if (type.includes('NETWORK')) return 'network';
        if (type.includes('MEMORY')) return 'memory';
        if (type.includes('UI')) return 'ui';
        
        return 'default';
    }

    getSeverityClass(severity) {
        const classes = {
            critical: 'error',
            high: 'warning',
            medium: 'warning',
            low: 'info'
        };
        
        return classes[severity] || 'info';
    }

    formatDebugInfo(errorData) {
        return JSON.stringify({
            timestamp: errorData.timestamp,
            classification: errorData.classification,
            error: {
                name: errorData.error?.name,
                message: errorData.error?.message,
                stack: errorData.error?.stack
            },
            context: errorData.context,
            recovery: errorData.recovery
        }, null, 2);
    }

    async waitForUserInteraction(errorData) {
        return new Promise((resolve) => {
            // Auto-resolve for non-critical errors
            if (errorData.classification?.severity !== 'critical') {
                setTimeout(resolve, this.config.autoHideDelay);
                return;
            }
            
            // Wait for user interaction for critical errors
            const checkVisibility = () => {
                if (!this.isVisible) {
                    resolve();
                } else {
                    setTimeout(checkVisibility, 100);
                }
            };
            
            checkVisibility();
        });
    }

    // Action implementations
    async performRecovery(errorData) {
        // Emit recovery event
        window.dispatchEvent(new CustomEvent('haqei-error-recovery', {
            detail: errorData
        }));
        
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async performRetry(errorData) {
        // Emit retry event
        window.dispatchEvent(new CustomEvent('haqei-error-retry', {
            detail: errorData
        }));
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async reportError(errorData) {
        // Emit report event
        window.dispatchEvent(new CustomEvent('haqei-error-report', {
            detail: errorData
        }));
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * クリーンアップ
     */
    cleanup() {
        // Remove all elements
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        // Clear queues
        this.displayQueue = [];
        this.currentError = null;
        this.isVisible = false;
        
        console.log("🧹 Error Display UI cleanup completed");
    }
}

// Global export
if (typeof window !== 'undefined') {
    window.ErrorDisplayUI = ErrorDisplayUI;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorDisplayUI;
}

console.log("✅ Error Display UI v2.0.0 loaded - bunenjin philosophy & I Ching guidance ready");