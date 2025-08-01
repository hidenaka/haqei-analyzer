/**
 * PersonalityConstructionView.js
 * 
 * 仮想人格構築演出システム - Phase 3 UI/UX Enhancement
 * 
 * 説明: ユーザーの診断結果から仮想人格を段階的に構築する演出を提供
 * 従来の静的な結果表示から、動的で物語的な仮想人格構築体験への革新
 * 
 * 作成: 2025年7月31日
 * Phase: 3.1 仮想人格構築演出システム
 */

class PersonalityConstructionView extends BaseComponent {
    constructor(containerId) {
        super(containerId);
        
        // 構築フェーズの定義
        this.constructionPhases = [
            {
                id: 'analysis',
                name: 'データ分析中...',
                description: '診断結果を詳細に分析しています',
                duration: 2000,
                progress: 15
            },
            {
                id: 'engine_os',
                name: '価値観OSを構築中...',
                description: 'Engine OS (価値観OS) の人格を形成しています',
                duration: 3000,
                progress: 35
            },
            {
                id: 'interface_os',
                name: '社会的OSを構築中...',
                description: 'Interface OS (社会的OS) の人格を形成しています',
                duration: 3000,
                progress: 55
            },
            {
                id: 'safemode_os',
                name: '防御OSを構築中...',
                description: 'SafeMode OS (防御OS) の人格を形成しています',
                duration: 3000,
                progress: 75
            },
            {
                id: 'relationships',
                name: '関係性を分析中...',
                description: '3つのOS間の複雑な相互関係を構築しています',
                duration: 2500,
                progress: 90
            },
            {
                id: 'metaphor',
                name: '易経メタファーを生成中...',
                description: '易経の智慧による物語的解説を作成しています',
                duration: 2000,
                progress: 95
            },
            {
                id: 'integration',
                name: '統合解説を作成中...',
                description: '最終的な統合レポートを生成しています',
                duration: 1500,
                progress: 100
            }
        ];
        
        this.currentPhaseIndex = 0;
        this.isConstructing = false;
        this.virtualPersonality = null;
        this.animationSpeed = 1.0; // アニメーション速度調整
        
        console.log('🎭 PersonalityConstructionView initialized');
    }
    
    /**
     * 仮想人格構築プロセスのメイン実行
     * @param {Object} virtualPersonality - 構築対象の仮想人格データ
     * @param {Object} options - 演出オプション
     */
    async showConstructionProcess(virtualPersonality, options = {}) {
        if (this.isConstructing) {
            console.warn('⚠️ Construction already in progress');
            return;
        }
        
        try {
            this.isConstructing = true;
            this.virtualPersonality = virtualPersonality;
            this.animationSpeed = options.speed || 1.0;
            
            console.log('🚀 Starting personality construction visualization');
            
            // 構築画面の初期化
            await this.initializeConstructionUI();
            
            // フェーズ進行の実行
            await this.showPhaseProgress();
            
            // OS誕生シーケンスの表示
            await this.showOSBirthSequence();
            
            // 関係性形成の可視化
            await this.showRelationshipFormation();
            
            // メタファー生成の演出
            await this.showMetaphorGeneration();
            
            // 完了演出
            await this.showConstructionComplete();
            
            console.log('✅ Personality construction visualization completed');
            
        } catch (error) {
            console.error('❌ Construction visualization failed:', error);
            await this.showConstructionError(error);
        } finally {
            this.isConstructing = false;
        }
    }
    
    /**
     * 構築UI初期化
     */
    async initializeConstructionUI() {
        const html = `
            <div class="personality-construction-container">
                <div class="construction-header">
                    <h2 class="construction-title">
                        <span class="title-icon">🎭</span>
                        あなたの仮想人格を構築中
                    </h2>
                    <p class="construction-subtitle">
                        診断結果から、あなただけの3つのOS人格を形成します
                    </p>
                </div>
                
                <div class="phase-indicator">
                    <div class="current-phase">
                        <span class="phase-name">準備中...</span>
                        <div class="phase-description">
                            システムを初期化しています
                        </div>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                            <div class="progress-text">0%</div>
                        </div>
                    </div>
                </div>
                
                <div class="construction-visual">
                    <div class="os-birth-stage">
                        <div class="os-node engine-node" data-os="engine">
                            <div class="os-avatar">
                                <div class="avatar-icon">🧠</div>
                            </div>
                            <div class="os-label">Engine OS</div>
                            <div class="os-status">待機中</div>
                        </div>
                        
                        <div class="os-node interface-node" data-os="interface">
                            <div class="os-avatar">
                                <div class="avatar-icon">🤝</div>
                            </div>
                            <div class="os-label">Interface OS</div>
                            <div class="os-status">待機中</div>
                        </div>
                        
                        <div class="os-node safemode-node" data-os="safemode">
                            <div class="os-avatar">
                                <div class="avatar-icon">🛡️</div>
                            </div>
                            <div class="os-label">SafeMode OS</div>
                            <div class="os-status">待機中</div>
                        </div>
                    </div>
                    
                    <div class="relationship-canvas">
                        <svg class="connection-lines" width="100%" height="200">
                            <!-- 動的な関係性ライン -->
                        </svg>
                    </div>
                    
                    <div class="metaphor-preview">
                        <div class="hexagram-display">
                            <div class="hexagram-symbol">☰</div>
                            <div class="hexagram-name">構築中...</div>
                        </div>
                    </div>
                </div>
                
                <div class="construction-log">
                    <div class="log-header">
                        <span class="log-icon">📋</span>
                        構築ログ
                    </div>
                    <div class="log-content">
                        <div class="log-entry">
                            <span class="log-time">${new Date().toLocaleTimeString()}</span>
                            <span class="log-message">仮想人格構築システム初期化完了</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // CSS アニメーション初期化
        await this.initializeAnimations();
        
        // 少し待機してからフェーズ開始
        await this.sleep(500);
    }
    
    /**
     * フェーズ進行の表示
     */
    async showPhaseProgress() {
        for (let i = 0; i < this.constructionPhases.length; i++) {
            const phase = this.constructionPhases[i];
            this.currentPhaseIndex = i;
            
            await this.executePhase(phase);
        }
    }
    
    /**
     * 個別フェーズの実行
     * @param {Object} phase - フェーズ情報
     */
    async executePhase(phase) {
        // フェーズ表示の更新
        const phaseNameEl = this.container.querySelector('.phase-name');
        const phaseDescEl = this.container.querySelector('.phase-description');
        const progressFill = this.container.querySelector('.progress-fill');
        const progressText = this.container.querySelector('.progress-text');
        
        if (phaseNameEl) phaseNameEl.textContent = phase.name;
        if (phaseDescEl) phaseDescEl.textContent = phase.description;
        
        // ログエントリー追加
        this.addLogEntry(`${phase.name} 開始`);
        
        // プログレスバーアニメーション
        if (progressFill && progressText) {
            await this.animateProgress(phase.progress);
        }
        
        // フェーズ固有の処理
        await this.executePhaseSpecificAnimation(phase);
        
        // フェーズ完了待機
        await this.sleep(phase.duration / this.animationSpeed);
        
        this.addLogEntry(`${phase.name} 完了`);
    }
    
    /**
     * フェーズ固有のアニメーション実行
     * @param {Object} phase - フェーズ情報
     */
    async executePhaseSpecificAnimation(phase) {
        const animationMap = {
            'analysis': this.animateDataAnalysis.bind(this),
            'engine_os': this.animateEngineOSBirth.bind(this),
            'interface_os': this.animateInterfaceOSBirth.bind(this),
            'safemode_os': this.animateSafeModeOSBirth.bind(this),
            'relationships': this.animateRelationshipBuilding.bind(this),
            'metaphor': this.animateMetaphorGeneration.bind(this),
            'integration': this.animateIntegration.bind(this)
        };
        
        const animationFunction = animationMap[phase.id];
        if (animationFunction) {
            await animationFunction();
        }
    }
    
    /**
     * データ分析アニメーション
     */
    async animateDataAnalysis() {
        // 診断データの分析視覚化
        const logContent = this.container.querySelector('.log-content');
        
        const analysisSteps = [
            '診断回答データを解析中...',
            '価値観パターンを特定中...',
            '社会的傾向を分析中...',
            '防御機制を評価中...',
            'OS構築パラメータを算出中...'
        ];
        
        for (const step of analysisSteps) {
            this.addLogEntry(step);
            await this.sleep(300 / this.animationSpeed);
        }
    }
    
    /**
     * Engine OS 誕生アニメーション
     */
    async animateEngineOSBirth() {
        const engineNode = this.container.querySelector('.engine-node');
        const engineStatus = engineNode.querySelector('.os-status');
        
        // ノードのアクティベーション
        engineNode.classList.add('activating');
        engineStatus.textContent = '起動中...';
        
        await this.sleep(500 / this.animationSpeed);
        
        // 人格データの注入
        if (this.virtualPersonality && this.virtualPersonality.engineOS) {
            const engineOS = this.virtualPersonality.engineOS;
            
            this.addLogEntry(`Engine OS [${engineOS.osName}] を構築中`);
            this.addLogEntry(`- 価値観: ${engineOS.characteristics.primary_traits.join(', ')}`);
            this.addLogEntry(`- 活性度: ${(engineOS.activation * 100).toFixed(1)}%`);
            
            await this.sleep(800 / this.animationSpeed);
            
            engineNode.classList.remove('activating');
            engineNode.classList.add('active');
            engineStatus.textContent = '構築完了';
        }
    }
    
    /**
     * Interface OS 誕生アニメーション
     */
    async animateInterfaceOSBirth() {
        const interfaceNode = this.container.querySelector('.interface-node');
        const interfaceStatus = interfaceNode.querySelector('.os-status');
        
        interfaceNode.classList.add('activating');
        interfaceStatus.textContent = '起動中...';
        
        await this.sleep(500 / this.animationSpeed);
        
        if (this.virtualPersonality && this.virtualPersonality.interfaceOS) {
            const interfaceOS = this.virtualPersonality.interfaceOS;
            
            this.addLogEntry(`Interface OS [${interfaceOS.osName}] を構築中`);
            this.addLogEntry(`- 社会的特性: ${interfaceOS.characteristics.primary_traits.join(', ')}`);
            this.addLogEntry(`- 活性度: ${(interfaceOS.activation * 100).toFixed(1)}%`);
            
            await this.sleep(800 / this.animationSpeed);
            
            interfaceNode.classList.remove('activating');
            interfaceNode.classList.add('active');
            interfaceStatus.textContent = '構築完了';
        }
    }
    
    /**
     * SafeMode OS 誕生アニメーション
     */
    async animateSafeModeOSBirth() {
        const safemodeNode = this.container.querySelector('.safemode-node');
        const safemodeStatus = safemodeNode.querySelector('.os-status');
        
        safemodeNode.classList.add('activating');
        safemodeStatus.textContent = '起動中...';
        
        await this.sleep(500 / this.animationSpeed);
        
        if (this.virtualPersonality && this.virtualPersonality.safeModeOS) {
            const safeModeOS = this.virtualPersonality.safeModeOS;
            
            this.addLogEntry(`SafeMode OS [${safeModeOS.osName}] を構築中`);
            this.addLogEntry(`- 防御特性: ${safeModeOS.characteristics.primary_traits.join(', ')}`);
            this.addLogEntry(`- 活性度: ${(safeModeOS.activation * 100).toFixed(1)}%`);
            
            await this.sleep(800 / this.animationSpeed);
            
            safemodeNode.classList.remove('activating');
            safemodeNode.classList.add('active');
            safemodeStatus.textContent = '構築完了';
        }
    }
    
    /**
     * 関係性構築アニメーション
     */
    async animateRelationshipBuilding() {
        this.addLogEntry('OS間の関係性ネットワークを構築中...');
        
        // 接続線の描画アニメーション
        const svg = this.container.querySelector('.connection-lines');
        
        if (svg) {
            // Engine ↔ Interface
            await this.drawConnectionLine(svg, 'engine-interface', '#e74c3c', '#3498db');
            await this.sleep(300 / this.animationSpeed);
            
            // Interface ↔ SafeMode
            await this.drawConnectionLine(svg, 'interface-safemode', '#3498db', '#f39c12');
            await this.sleep(300 / this.animationSpeed);
            
            // SafeMode ↔ Engine
            await this.drawConnectionLine(svg, 'safemode-engine', '#f39c12', '#e74c3c');
            await this.sleep(300 / this.animationSpeed);
        }
        
        this.addLogEntry('関係性マトリックス計算完了');
        this.addLogEntry('内部対話システム初期化完了');
    }
    
    /**
     * メタファー生成アニメーション
     */
    async animateMetaphorGeneration() {
        const hexagramDisplay = this.container.querySelector('.hexagram-display');
        const hexagramSymbol = hexagramDisplay.querySelector('.hexagram-symbol');
        const hexagramName = hexagramDisplay.querySelector('.hexagram-name');
        
        this.addLogEntry('易経メタファー生成開始...');
        
        // 卦の記号をランダムに変化させる演出
        const hexagramSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
        
        for (let i = 0; i < 8; i++) {
            hexagramSymbol.textContent = hexagramSymbols[Math.floor(Math.random() * hexagramSymbols.length)];
            await this.sleep(150 / this.animationSpeed);
        }
        
        // 最終的な卦の決定
        if (this.virtualPersonality) {
            const dominantOS = this.virtualPersonality.personalityState.currentDominantOS;
            let finalHexagram = '☰'; // デフォルト
            let hexagramNameText = '乾（創造）';
            
            if (dominantOS === 'engine') {
                finalHexagram = '☰';
                hexagramNameText = '乾（創造）';
            } else if (dominantOS === 'interface') {
                finalHexagram = '☱';
                hexagramNameText = '兌（喜び）';
            } else if (dominantOS === 'safemode') {
                finalHexagram = '☶';
                hexagramNameText = '艮（静止）';
            }
            
            hexagramSymbol.textContent = finalHexagram;
            hexagramName.textContent = hexagramNameText;
            
            this.addLogEntry(`主要卦: ${hexagramNameText}`);
            this.addLogEntry('個人的物語テンプレート生成完了');
        }
    }
    
    /**
     * 統合アニメーション
     */
    async animateIntegration() {
        this.addLogEntry('最終統合処理を実行中...');
        this.addLogEntry('OS間バランス調整完了');
        this.addLogEntry('メタファーストーリー統合完了');
        this.addLogEntry('実践的行動指針生成完了');
    }
    
    /**
     * 構築完了演出
     */
    async showConstructionComplete() {
        const phaseNameEl = this.container.querySelector('.phase-name');
        const phaseDescEl = this.container.querySelector('.phase-description');
        
        if (phaseNameEl) phaseNameEl.textContent = '🎉 仮想人格構築完了！';
        if (phaseDescEl) phaseDescEl.textContent = 'あなたの仮想人格が完成しました';
        
        this.addLogEntry('='.repeat(50));
        this.addLogEntry('🎭 仮想人格構築プロセス完了');
        
        if (this.virtualPersonality) {
            this.addLogEntry(`人格ID: ${this.virtualPersonality.id}`);
            this.addLogEntry(`人格タイプ: ${this.virtualPersonality.personalityMetadata?.personalityType || '統合型'}`);
            this.addLogEntry(`主導OS: ${this.virtualPersonality.personalityState?.currentDominantOS || 'バランス型'}`);
        }
        
        this.addLogEntry('='.repeat(50));
        
        // 完了時の全体ハイライト
        const container = this.container.querySelector('.personality-construction-container');
        if (container) {
            container.classList.add('construction-complete');
        }
        
        // イベント発火
        this.dispatchEvent('constructionComplete', {
            virtualPersonality: this.virtualPersonality,
            duration: Date.now() - this.constructionStartTime
        });
    }
    
    /**
     * エラー表示
     * @param {Error} error - エラー情報
     */
    async showConstructionError(error) {
        const phaseNameEl = this.container.querySelector('.phase-name');
        const phaseDescEl = this.container.querySelector('.phase-description');
        
        if (phaseNameEl) phaseNameEl.textContent = '❌ 構築エラー';
        if (phaseDescEl) phaseDescEl.textContent = 'エラーが発生しました';
        
        this.addLogEntry(`ERROR: ${error.message}`);
        this.addLogEntry('構築プロセスを中断しました');
    }
    
    // ユーティリティメソッド
    
    /**
     * プログレスバーアニメーション
     * @param {number} targetProgress - 目標進捗（0-100）
     */
    async animateProgress(targetProgress) {
        const progressFill = this.container.querySelector('.progress-fill');
        const progressText = this.container.querySelector('.progress-text');
        
        if (!progressFill || !progressText) return;
        
        const currentProgress = parseInt(progressFill.style.width) || 0;
        const steps = Math.abs(targetProgress - currentProgress);
        const stepSize = (targetProgress - currentProgress) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const progress = currentProgress + (stepSize * i);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            await this.sleep(20 / this.animationSpeed);
        }
    }
    
    /**
     * ログエントリー追加
     * @param {string} message - ログメッセージ
     */
    addLogEntry(message) {
        const logContent = this.container.querySelector('.log-content');
        if (!logContent) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="log-time">${timestamp}</span>
            <span class="log-message">${message}</span>
        `;
        
        logContent.appendChild(logEntry);
        
        // 自動スクロール
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    /**
     * 接続線描画
     * @param {SVGElement} svg - SVG要素
     * @param {string} connectionId - 接続ID
     * @param {string} fromColor - 開始色
     * @param {string} toColor - 終了色
     */
    async drawConnectionLine(svg, connectionId, fromColor, toColor) {
        // 実装は省略（SVG描画ロジック）
        console.log(`Drawing connection: ${connectionId}`);
    }
    
    /**
     * アニメーション初期化
     */
    async initializeAnimations() {
        // CSS アニメーションクラスの初期設定
        const style = document.createElement('style');
        style.textContent = `
            .personality-construction-container {
                opacity: 0;
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .os-node.activating {
                animation: pulse 1s infinite;
            }
            
            .os-node.active {
                animation: glow 2s ease-in-out infinite alternate;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes glow {
                from { box-shadow: 0 0 5px rgba(79, 195, 247, 0.5); }
                to { box-shadow: 0 0 20px rgba(79, 195, 247, 0.8); }
            }
            
            .construction-complete {
                animation: completionFlash 3s ease-in-out;
            }
            
            @keyframes completionFlash {
                0%, 100% { background: rgba(255, 255, 255, 0.05); }
                50% { background: rgba(76, 175, 80, 0.2); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * 待機ユーティリティ
     * @param {number} ms - 待機時間（ミリ秒）
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * イベント発火
     * @param {string} eventName - イベント名
     * @param {Object} detail - イベント詳細
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        this.container.dispatchEvent(event);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalityConstructionView;
}

console.log('🎭 PersonalityConstructionView class loaded successfully');