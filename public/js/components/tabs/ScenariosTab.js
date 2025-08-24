/**
 * ScenariosTab.js
 * HAQEI タブナビゲーションシステム - シナリオタブ
 * 
 * 機能:
 * - 仮想人格シミュレーション
 * - 対話シナリオの生成と実行
 * - 内部対話の可視化
 * - Triple OS間の相互作用シミュレーション
 * - インタラクティブな人格探求
 */

class ScenariosTab extends BaseTabView {
    constructor(tabId) {
        super(tabId);
        this.analysisData = null;
        this.currentScenario = null;
        this.dialogueHistory = [];
        this.simulationState = 'idle'; // idle, running, paused
        this.interactionEngine = null;
        this.hexagramExtractor = null;
    }

    /**
     * タブコンテンツの初期化
     */
    init() {
        this.initializeInteractionEngine();
        this.initializeHexagramExtractor();
        this.bindEvents();
    }

    /**
     * 相互作用エンジンの初期化
     */
    initializeInteractionEngine() {
        if (typeof TripleOSInteractionAnalyzer !== 'undefined') {
            this.interactionEngine = new TripleOSInteractionAnalyzer();
        } else {
            console.warn('⚠️ TripleOSInteractionAnalyzer not available, using fallback');
        }
    }

    /**
     * HexagramExtractorの初期化
     */
    initializeHexagramExtractor() {
        if (typeof HexagramExtractor !== 'undefined') {
            this.hexagramExtractor = new HexagramExtractor();
            console.log('✅ HexagramExtractor initialized for scenarios');
        } else {
            console.warn('⚠️ HexagramExtractor not available, using fallback scenarios');
        }
    }

    /**
     * メインコンテンツのレンダリング
     */
    renderContent(container) {
        if (!this.analysisData) {
            this.showLoading(container);
            return;
        }

        const content = `
            <div class="scenarios-container">
                ${this.renderHeader()}
                ${this.renderScenarioSelector()}
                ${this.renderSimulationArea()}
                ${this.renderDialogueVisualization()}
                ${this.renderPersonalityInsights()}
                ${this.renderControlPanel()}
            </div>
        `;

        container.innerHTML = content;
        this.initializeInteractiveElements();
    }

    /**
     * ヘッダーセクションのレンダリング
     */
    renderHeader() {
        return `
            <div class="scenarios-header">
                <h2 class="scenarios-title">
                    <span class="scenarios-icon">🎭</span>
                    仮想人格シナリオ
                </h2>
                <p class="scenarios-subtitle">
                    あなたの内なる三つの人格が織りなす対話と相互作用を体験してください
                </p>
            </div>
        `;
    }

    /**
     * シナリオセレクターのレンダリング（修正版）
     */
    renderScenarioSelector() {
        const scenarios = this.getAvailableScenarios();
        
        return `
            <div class="scenario-selector-section">
                <h3 class="section-title">
                    <span class="section-icon">🎯</span>
                    パーソナライズされたシナリオ
                </h3>
                <div class="scenario-grid">
                    ${scenarios.map(scenario => `
                        <div class="scenario-card enhanced" data-scenario="${scenario.id}">
                            <div class="scenario-header">
                                <div class="scenario-icon">${scenario.icon}</div>
                                <div class="scenario-meta">
                                    <h4 class="scenario-name">${scenario.name}</h4>
                                    ${scenario.theme ? `<span class="scenario-theme">${scenario.theme}</span>` : ''}
                                </div>
                            </div>
                            
                            <p class="scenario-description">${scenario.description}</p>
                            
                            ${scenario.keywords ? `
                                <div class="scenario-keywords">
                                    <span class="keywords-label">キーワード:</span>
                                    ${scenario.keywords.map(keyword => `
                                        <span class="keyword-chip">${keyword}</span>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            <div class="scenario-participants">
                                <span class="participants-label">参加者:</span>
                                ${scenario.participants.map(participant => `
                                    <span class="participant-tag ${participant.toLowerCase()}">${participant}</span>
                                `).join('')}
                            </div>
                            
                            <div class="scenario-details">
                                <span class="scenario-complexity complexity-${scenario.complexity}">
                                    ${this.getComplexityLabel(scenario.complexity)}
                                </span>
                                <span class="scenario-duration">
                                    ⏱️ ${scenario.duration}
                                </span>
                            </div>
                            
                            <button class="scenario-start-btn" data-scenario="${scenario.id}">
                                <span class="btn-icon">▶️</span>
                                シナリオ開始
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * シミュレーションエリアのレンダリング
     */
    renderSimulationArea() {
        return `
            <div class="simulation-area-section">
                <h3 class="section-title">シミュレーション空間</h3>
                <div class="simulation-container">
                    <div class="simulation-stage">
                        <div class="stage-background">
                            <div class="stage-lighting"></div>
                        </div>
                        <div class="persona-avatars">
                            <div class="avatar engine-avatar" data-os="engine">
                                <div class="avatar-circle">
                                    <span class="avatar-icon">🔥</span>
                                </div>
                                <div class="avatar-label">Engine OS</div>
                                <div class="avatar-status idle"></div>
                            </div>
                            <div class="avatar interface-avatar" data-os="interface">
                                <div class="avatar-circle">
                                    <span class="avatar-icon">🌊</span>
                                </div>
                                <div class="avatar-label">Interface OS</div>
                                <div class="avatar-status idle"></div>
                            </div>
                            <div class="avatar safe-avatar" data-os="safe">
                                <div class="avatar-circle">
                                    <span class="avatar-icon">🛡️</span>
                                </div>
                                <div class="avatar-label">Safe Mode OS</div>
                                <div class="avatar-status idle"></div>
                            </div>
                        </div>
                        <div class="interaction-lines">
                            <svg class="connection-svg" width="100%" height="100%">
                                <defs>
                                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                                    </linearGradient>
                                </defs>
                                <!-- 接続線は動的に描画 -->
                            </svg>
                        </div>
                    </div>
                    <div class="simulation-info">
                        <div class="current-scenario-info">
                            <h4 class="info-title">現在のシナリオ</h4>
                            <p class="info-content" id="current-scenario-name">シナリオを選択してください</p>
                        </div>
                        <div class="simulation-stats">
                            <div class="stat-item">
                                <span class="stat-label">対話回数</span>
                                <span class="stat-value" id="dialogue-count">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">相互作用強度</span>
                                <span class="stat-value" id="interaction-intensity">0%</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">調和レベル</span>
                                <span class="stat-value" id="harmony-level">0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 対話可視化セクションのレンダリング
     */
    renderDialogueVisualization() {
        return `
            <div class="dialogue-visualization-section">
                <h3 class="section-title">内部対話</h3>
                <div class="dialogue-container">
                    <div class="dialogue-timeline">
                        <div class="timeline-header">
                            <div class="timeline-controls">
                                <button class="timeline-btn" id="timeline-play" disabled>
                                    <span class="btn-icon">▶️</span>
                                    再生
                                </button>
                                <button class="timeline-btn" id="timeline-pause" disabled>
                                    <span class="btn-icon">⏸️</span>
                                    一時停止
                                </button>
                                <button class="timeline-btn" id="timeline-reset">
                                    <span class="btn-icon">🔄</span>
                                    リセット
                                </button>
                            </div>
                            <div class="timeline-speed">
                                <label for="speed-slider">速度:</label>
                                <input type="range" id="speed-slider" min="0.5" max="3" step="0.5" value="1">
                                <span id="speed-value">1x</span>
                            </div>
                        </div>
                        <div class="dialogue-messages" id="dialogue-messages">
                            <div class="no-dialogue-message">
                                <span class="message-icon">💭</span>
                                <p>シナリオを開始すると、内部対話が表示されます</p>
                            </div>
                        </div>
                    </div>
                    <div class="dialogue-analysis">
                        <h4 class="analysis-title">対話分析</h4>
                        <div class="analysis-metrics">
                            <div class="metric-card">
                                <div class="metric-icon">🗣️</div>
                                <div class="metric-content">
                                    <div class="metric-label">発言頻度</div>
                                    <div class="metric-chart">
                                        <div class="frequency-bar engine" style="width: 0%"></div>
                                        <div class="frequency-bar interface" style="width: 0%"></div>
                                        <div class="frequency-bar safe" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon">💡</div>
                                <div class="metric-content">
                                    <div class="metric-label">影響力</div>
                                    <div class="influence-radar">
                                        <canvas id="influence-radar" width="120" height="120"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon">🎯</div>
                                <div class="metric-content">
                                    <div class="metric-label">合意度</div>
                                    <div class="consensus-meter">
                                        <div class="consensus-fill" style="width: 0%"></div>
                                        <span class="consensus-value">0%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 人格洞察セクションのレンダリング
     */
    renderPersonalityInsights() {
        return `
            <div class="personality-insights-section">
                <h3 class="section-title">人格動態分析</h3>
                <div class="insights-dashboard">
                    <div class="dynamic-chart-container">
                        <h4 class="chart-title">人格バランスの変化</h4>
                        <canvas id="personality-dynamics-chart" width="400" height="200"></canvas>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color engine"></span>
                                <span class="legend-label">Engine OS</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color interface"></span>
                                <span class="legend-label">Interface OS</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color safe"></span>
                                <span class="legend-label">Safe Mode OS</span>
                            </div>
                        </div>
                    </div>
                    <div class="insights-summary">
                        <h4 class="summary-title">シナリオ洞察</h4>
                        <div class="insight-cards">
                            <div class="insight-card dominant-pattern">
                                <div class="card-icon">👑</div>
                                <div class="card-content">
                                    <h5 class="card-title">支配的パターン</h5>
                                    <p class="card-description" id="dominant-pattern">分析中...</p>
                                </div>
                            </div>
                            <div class="insight-card conflict-areas">
                                <div class="card-icon">⚡</div>
                                <div class="card-content">
                                    <h5 class="card-title">対立領域</h5>
                                    <p class="card-description" id="conflict-areas">分析中...</p>
                                </div>
                            </div>
                            <div class="insight-card growth-opportunities">
                                <div class="card-icon">🌱</div>
                                <div class="card-content">
                                    <h5 class="card-title">成長機会</h5>
                                    <p class="card-description" id="growth-opportunities">分析中...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * コントロールパネルのレンダリング
     */
    renderControlPanel() {
        return `
            <div class="control-panel-section">
                <h3 class="section-title">シミュレーション制御</h3>
                <div class="control-panel">
                    <div class="control-group scenario-controls">
                        <h4 class="control-title">シナリオ制御</h4>
                        <div class="control-buttons">
                            <button class="control-btn primary" id="start-simulation" disabled>
                                <span class="btn-icon">🚀</span>
                                シミュレーション開始
                            </button>
                            <button class="control-btn secondary" id="pause-simulation" disabled>
                                <span class="btn-icon">⏸️</span>
                                一時停止
                            </button>
                            <button class="control-btn tertiary" id="stop-simulation" disabled>
                                <span class="btn-icon">⏹️</span>
                                停止
                            </button>
                        </div>
                    </div>
                    <div class="control-group interaction-controls">
                        <h4 class="control-title">相互作用設定</h4>
                        <div class="control-sliders">
                            <div class="slider-group">
                                <label for="interaction-intensity">相互作用強度</label>
                                <input type="range" id="interaction-intensity-slider" min="1" max="10" value="5">
                                <span class="slider-value">5</span>
                            </div>
                            <div class="slider-group">
                                <label for="dialogue-speed">対話速度</label>
                                <input type="range" id="dialogue-speed-slider" min="1" max="5" value="3">
                                <span class="slider-value">3</span>
                            </div>
                            <div class="slider-group">
                                <label for="emotional-intensity">感情強度</label>
                                <input type="range" id="emotional-intensity-slider" min="1" max="10" value="5">
                                <span class="slider-value">5</span>
                            </div>
                        </div>
                    </div>
                    <div class="control-group export-controls">
                        <h4 class="control-title">エクスポート</h4>
                        <div class="export-buttons">
                            <button class="export-btn" id="export-dialogue">
                                <span class="btn-icon">💾</span>
                                対話履歴をエクスポート
                            </button>
                            <button class="export-btn" id="export-analysis">
                                <span class="btn-icon">📊</span>
                                分析結果をエクスポート
                            </button>
                            <button class="export-btn" id="export-video">
                                <span class="btn-icon">🎬</span>
                                シミュレーション動画
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 利用可能なシナリオの取得（H384データベース連携版）
     */
    getAvailableScenarios() {
        if (!this.analysisData) {
            return this.getDefaultScenarios();
        }

        // H384データベースから易卦キーワードを取得してシナリオを生成
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const engineKeywords = this.extractHexagramKeywords(engineOS.hexagram.name);
        const interfaceKeywords = this.extractHexagramKeywords(interfaceOS.hexagram.name);
        const safeModeKeywords = this.extractHexagramKeywords(safeModeOS.hexagram.name);

        return [
            {
                id: 'inner-conflict',
                name: '内的葛藤の解決',
                icon: '⚖️',
                description: this.generateConflictScenarioDescription(engineKeywords, interfaceKeywords),
                participants: ['Engine', 'Interface'],
                complexity: 'high',
                duration: '10-15分',
                keywords: [...engineKeywords.slice(0, 2), ...interfaceKeywords.slice(0, 2)],
                theme: '価値観の対立と調和'
            },
            {
                id: 'social-harmony',
                name: '社会的調和',
                icon: '🤝',
                description: this.generateHarmonyScenarioDescription(interfaceKeywords, safeModeKeywords),
                participants: ['Interface', 'Safe'],
                complexity: 'medium',
                duration: '8-12分',
                keywords: [...interfaceKeywords.slice(0, 2), ...safeModeKeywords.slice(0, 2)],
                theme: '社会適応と安定性'
            },
            {
                id: 'integrated-growth',
                name: '統合的成長',
                icon: '🌟',
                description: this.generateGrowthScenarioDescription(engineKeywords, interfaceKeywords, safeModeKeywords),
                participants: ['Engine', 'Interface', 'Safe'],
                complexity: 'high',
                duration: '15-20分',
                keywords: [...engineKeywords.slice(0, 1), ...interfaceKeywords.slice(0, 1), ...safeModeKeywords.slice(0, 1)],
                theme: '全人格の統合と発展'
            }
        ];
    }

    /**
     * デフォルトシナリオの取得（フォールバック用）
     */
    getDefaultScenarios() {
        return [
            {
                id: 'decision-making',
                name: '重要な決断',
                icon: '🤔',
                description: '人生の重要な選択に直面したとき、三つの人格がどのように議論し、合意に達するかを体験します。',
                participants: ['Engine', 'Interface', 'Safe']
            },
            {
                id: 'conflict-resolution',
                name: '内的対立の解決',
                icon: '⚖️',
                description: '異なる価値観や欲求が対立したとき、どのように調和を見つけるかを探求します。',
                participants: ['Engine', 'Interface', 'Safe']
            },
            {
                id: 'creative-collaboration',
                name: '創造的協働',
                icon: '🎨',
                description: '新しいアイデアや創造的プロジェクトにおいて、各人格がどのように貢献するかを観察します。',
                participants: ['Engine', 'Interface']
            },
            {
                id: 'stress-response',
                name: 'ストレス対応',
                icon: '😰',
                description: 'ストレスフルな状況において、各人格がどのように反応し、対処するかを分析します。',
                participants: ['Interface', 'Safe']
            },
            {
                id: 'relationship-dynamics',
                name: '人間関係の動態',
                icon: '👥',
                description: '他者との関係において、各人格がどのような役割を果たすかを理解します。',
                participants: ['Engine', 'Interface', 'Safe']
            },
            {
                id: 'growth-journey',
                name: '成長の旅路',
                icon: '🌱',
                description: '個人的成長と変化のプロセスにおいて、各人格がどのように進化するかを追跡します。',
                participants: ['Engine', 'Interface', 'Safe']
            }
        ];
    }

    /**
     * 易卦からキーワードを抽出
     */
    extractHexagramKeywords(hexagramName) {
        if (!this.hexagramExtractor) {
            return ['調和', '成長', '安定'];
        }

        try {
            const hexagramData = this.hexagramExtractor.getHexagramByName(hexagramName);
            if (hexagramData && hexagramData.keywords) {
                return hexagramData.keywords.slice(0, 3);
            }
        } catch (error) {
            console.warn('キーワード抽出エラー:', error);
        }

        return this.getDefaultKeywords(hexagramName);
    }

    /**
     * デフォルトキーワードの取得
     */
    getDefaultKeywords(hexagramName) {
        const keywordMap = {
            '乾': ['創造', '指導力', '積極性'],
            '坤': ['受容', '協調', '安定'],
            '屯': ['困難', '忍耐', '成長'],
            '蒙': ['学習', '謙虚', '発見'],
            '需': ['待機', '準備', '機会']
        };
        
        return keywordMap[hexagramName] || ['調和', '成長', '安定'];
    }

    /**
     * 葛藤シナリオの説明文生成
     */
    generateConflictScenarioDescription(engineKeywords, interfaceKeywords) {
        const engineTheme = engineKeywords[0] || '創造性';
        const interfaceTheme = interfaceKeywords[0] || '調和';
        
        return `「${engineTheme}」を重視するEngine OSと「${interfaceTheme}」を大切にするInterface OSの間で生じる価値観の対立を探求し、新たな統合点を見つけるシナリオです。`;
    }

    /**
     * 調和シナリオの説明文生成
     */
    generateHarmonyScenarioDescription(interfaceKeywords, safeModeKeywords) {
        const interfaceTheme = interfaceKeywords[0] || '社会性';
        const safeModeTheme = safeModeKeywords[0] || '安定性';
        
        return `「${interfaceTheme}」を通じた社会との関わりと「${safeModeTheme}」による内的安定のバランスを取りながら、持続可能な人間関係を築くシナリオです。`;
    }

    /**
     * 成長シナリオの説明文生成
     */
    generateGrowthScenarioDescription(engineKeywords, interfaceKeywords, safeModeKeywords) {
        const engineTheme = engineKeywords[0] || '創造性';
        const interfaceTheme = interfaceKeywords[0] || '調和';
        const safeModeTheme = safeModeKeywords[0] || '安定性';
        
        return `「${engineTheme}」「${interfaceTheme}」「${safeModeTheme}」の三つの要素を統合し、より高次の人格的成長を目指すシナリオです。各OSが協力して新たな可能性を探求します。`;
    }

    /**
     * 複雑度ラベルの取得
     */
    getComplexityLabel(complexity) {
        const labels = {
            'low': '🟢 初級',
            'medium': '🟡 中級', 
            'high': '🔴 上級'
        };
        return labels[complexity] || '🟡 中級';
    }

    /**
     * シナリオの開始
     */
    startScenario(scenarioId) {
        const scenario = this.getAvailableScenarios().find(s => s.id === scenarioId);
        if (!scenario) return;

        this.currentScenario = scenario;
        this.dialogueHistory = [];
        this.simulationState = 'running';

        // UI更新
        document.getElementById('current-scenario-name').textContent = scenario.name;
        this.updateControlButtons();
        this.clearDialogueMessages();
        this.resetMetrics();

        // シミュレーション開始
        this.runScenarioSimulation(scenario);
    }

    /**
     * シナリオシミュレーションの実行
     */
    runScenarioSimulation(scenario) {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        // シナリオに基づいた対話生成
        const dialogueScript = this.generateDialogueScript(scenario);
        
        // 対話の段階的実行
        this.executeDialogue(dialogueScript);
    }

    /**
     * 対話スクリプトの生成（H384データベース連携版）
     */
    generateDialogueScript(scenario) {
        // H384データベースのキーワードを活用した対話生成
        const scripts = {
            'inner-conflict': this.generateInnerConflictScript(scenario),
            'social-harmony': this.generateSocialHarmonyScript(scenario),
            'integrated-growth': this.generateIntegratedGrowthScript(scenario),
            // フォールバック用の従来スクリプト
            'decision-making': this.generateDecisionMakingScript(),
            'conflict-resolution': this.generateConflictResolutionScript(),
            'creative-collaboration': this.generateCreativeCollaborationScript(),
            'stress-response': this.generateStressResponseScript(),
            'relationship-dynamics': this.generateRelationshipDynamicsScript(),
            'growth-journey': this.generateGrowthJourneyScript()
        };
        
        return scripts[scenario.id] || this.generateDefaultScript(scenario);
    }

    /**
     * 内的葛藤シナリオスクリプト生成
     */
    generateInnerConflictScript(scenario) {
        const { engineOS, interfaceOS } = this.analysisData;
        const engineKeywords = scenario.keywords ? scenario.keywords.slice(0, 2) : ['創造', '挑戦'];
        const interfaceKeywords = scenario.keywords ? scenario.keywords.slice(2, 4) : ['調和', '協力'];
        
        return [
            {
                speaker: 'engine',
                message: `「${engineKeywords[0]}」こそが私たちの本質だ。${engineKeywords[1]}を恐れずに進むべきだ！`,
                emotion: 'passionate',
                timestamp: 0,
                keywords: engineKeywords
            },
            {
                speaker: 'interface',
                message: `でも「${interfaceKeywords[0]}」も大切にしたい。${interfaceKeywords[1]}を通じて、もっと良い方法があるはず。`,
                emotion: 'thoughtful',
                timestamp: 3000,
                keywords: interfaceKeywords
            },
            {
                speaker: 'engine',
                message: `${interfaceKeywords[0]}ばかり考えていては、${engineKeywords[0]}の機会を逃してしまう。時には大胆さが必要だ。`,
                emotion: 'frustrated',
                timestamp: 6000
            },
            {
                speaker: 'interface',
                message: `${engineKeywords[0]}は理解できる。でも${interfaceKeywords[1]}があってこそ、持続可能な${engineKeywords[1]}ができるのでは？`,
                emotion: 'diplomatic',
                timestamp: 9000
            },
            {
                speaker: 'engine',
                message: `なるほど...${interfaceKeywords[1]}を活かした${engineKeywords[0]}という視点は考えていなかった。`,
                emotion: 'contemplative',
                timestamp: 12000
            },
            {
                speaker: 'interface',
                message: `そう！${engineKeywords[0]}と${interfaceKeywords[0]}を両立させる道を一緒に見つけよう。`,
                emotion: 'hopeful',
                timestamp: 15000
            }
        ];
    }

    /**
     * 社会的調和シナリオスクリプト生成
     */
    generateSocialHarmonyScript(scenario) {
        const { interfaceOS, safeModeOS } = this.analysisData;
        const interfaceKeywords = scenario.keywords ? scenario.keywords.slice(0, 2) : ['社会性', '適応'];
        const safeModeKeywords = scenario.keywords ? scenario.keywords.slice(2, 4) : ['安定', '安心'];
        
        return [
            {
                speaker: 'interface',
                message: `新しい環境では「${interfaceKeywords[0]}」を活かして、周りとの関係を築いていきたい。`,
                emotion: 'optimistic',
                timestamp: 0,
                keywords: interfaceKeywords
            },
            {
                speaker: 'safe',
                message: `でも「${safeModeKeywords[0]}」も大切。急激な変化は心の${safeModeKeywords[1]}を脅かすかもしれない。`,
                emotion: 'cautious',
                timestamp: 3000,
                keywords: safeModeKeywords
            },
            {
                speaker: 'interface',
                message: `${safeModeKeywords[1]}は確かに重要。${interfaceKeywords[1]}しながらも、${safeModeKeywords[0]}を保つ方法を考えよう。`,
                emotion: 'understanding',
                timestamp: 6000
            },
            {
                speaker: 'safe',
                message: `段階的な${interfaceKeywords[1]}なら、${safeModeKeywords[0]}を維持しながら${interfaceKeywords[0]}も発揮できそう。`,
                emotion: 'relieved',
                timestamp: 9000
            },
            {
                speaker: 'interface',
                message: `素晴らしい！${safeModeKeywords[0]}という基盤があるからこそ、安心して${interfaceKeywords[0]}を表現できる。`,
                emotion: 'grateful',
                timestamp: 12000
            }
        ];
    }

    /**
     * 統合的成長シナリオスクリプト生成
     */
    generateIntegratedGrowthScript(scenario) {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const allKeywords = scenario.keywords || ['創造', '調和', '安定'];
        
        return [
            {
                speaker: 'engine',
                message: `「${allKeywords[0]}」の力で新しい可能性を切り開こう！`,
                emotion: 'energetic',
                timestamp: 0,
                keywords: [allKeywords[0]]
            },
            {
                speaker: 'interface',
                message: `「${allKeywords[1]}」を大切にしながら、みんなで一緒に成長していきたい。`,
                emotion: 'collaborative',
                timestamp: 3000,
                keywords: [allKeywords[1]]
            },
            {
                speaker: 'safe',
                message: `「${allKeywords[2]}」した基盤があれば、安心して挑戦できる。`,
                emotion: 'supportive',
                timestamp: 6000,
                keywords: [allKeywords[2]]
            },
            {
                speaker: 'engine',
                message: `${allKeywords[2]}があるからこそ、${allKeywords[0]}に集中できるんだ。`,
                emotion: 'appreciative',
                timestamp: 9000
            },
            {
                speaker: 'interface',
                message: `${allKeywords[0]}と${allKeywords[2]}の間で${allKeywords[1]}を取ることで、より大きな成長が可能になる。`,
                emotion: 'insightful',
                timestamp: 12000
            },
            {
                speaker: 'safe',
                message: `三つの力が合わさることで、今まで見えなかった道が開けてきた。`,
                emotion: 'enlightened',
                timestamp: 15000
            },
            {
                speaker: 'engine',
                message: `そうだ！${allKeywords[0]}、${allKeywords[1]}、${allKeywords[2]}が統合された時、真の成長が始まる。`,
                emotion: 'triumphant',
                timestamp: 18000
            }
        ];
    }

    /**
     * デフォルトスクリプト生成
     */
    generateDefaultScript(scenario) {
        return [
            {
                speaker: 'engine',
                message: 'このシナリオについて考えてみよう。',
                emotion: 'neutral',
                timestamp: 0
            },
            {
                speaker: 'interface',
                message: 'みんなの意見を聞いてから判断したい。',
                emotion: 'thoughtful',
                timestamp: 3000
            },
            {
                speaker: 'safe',
                message: '慎重に進めることが大切だと思う。',
                emotion: 'cautious',
                timestamp: 6000
            }
        ];
    }

    /**
     * 決断シナリオスクリプト生成
     */
    generateDecisionMakingScript() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        return [
            {
                speaker: 'engine',
                message: `新しいチャレンジに挑戦すべきだ！リスクを恐れていては何も始まらない。`,
                emotion: 'excited',
                timestamp: 0
            },
            {
                speaker: 'safe',
                message: `ちょっと待って。まずはリスクを慎重に評価する必要がある。失敗したらどうなる？`,
                emotion: 'concerned',
                timestamp: 2000
            },
            {
                speaker: 'interface',
                message: `両方の意見に価値がある。周りの人たちの意見も聞いてみてはどうだろう？`,
                emotion: 'thoughtful',
                timestamp: 4000
            },
            {
                speaker: 'engine',
                message: `でも時間をかけすぎると機会を逃してしまう。直感を信じることも大切だ。`,
                emotion: 'urgent',
                timestamp: 6000
            },
            {
                speaker: 'safe',
                message: `直感も大事だけど、準備不足で後悔するのは避けたい。段階的に進めることはできないか？`,
                emotion: 'analytical',
                timestamp: 8000
            },
            {
                speaker: 'interface',
                message: `段階的アプローチは良いアイデアね。小さく始めて、学びながら調整していこう。`,
                emotion: 'agreeable',
                timestamp: 10000
            }
        ];
    }

    /**
     * 対話の実行
     */
    executeDialogue(script) {
        let currentIndex = 0;
        const speed = document.getElementById('dialogue-speed-slider')?.value || 3;
        const baseDelay = 3000 / speed;

        const executeNext = () => {
            if (currentIndex >= script.length || this.simulationState !== 'running') {
                this.simulationState = 'completed';
                this.updateControlButtons();
                this.analyzeDialogue();
                return;
            }

            const dialogue = script[currentIndex];
            this.addDialogueMessage(dialogue);
            this.updateAvatarStatus(dialogue.speaker, 'speaking');
            this.updateMetrics();

            setTimeout(() => {
                this.updateAvatarStatus(dialogue.speaker, 'idle');
                currentIndex++;
                executeNext();
            }, baseDelay);
        };

        executeNext();
    }

    /**
     * 対話メッセージの追加
     */
    addDialogueMessage(dialogue) {
        const messagesContainer = document.getElementById('dialogue-messages');
        const noMessageDiv = messagesContainer.querySelector('.no-dialogue-message');
        
        if (noMessageDiv) {
            noMessageDiv.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `dialogue-message ${dialogue.speaker}`;
        messageElement.innerHTML = `
            <div class="message-avatar">
                <span class="avatar-icon">${this.getOSIcon(dialogue.speaker)}</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="speaker-name">${this.getOSName(dialogue.speaker)}</span>
                    <span class="message-emotion ${dialogue.emotion}">${this.getEmotionIcon(dialogue.emotion)}</span>
                </div>
                <div class="message-text">${dialogue.message}</div>
                <div class="message-timestamp">${this.formatTimestamp(dialogue.timestamp)}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.dialogueHistory.push(dialogue);
    }

    /**
     * ユーティリティメソッド
     */
    getOSIcon(osType) {
        const icons = {
            engine: '🔥',
            interface: '🌊',
            safe: '🛡️'
        };
        return icons[osType] || '❓';
    }

    getOSName(osType) {
        const names = {
            engine: 'Engine OS',
            interface: 'Interface OS',
            safe: 'Safe Mode OS'
        };
        return names[osType] || 'Unknown';
    }

    getEmotionIcon(emotion) {
        const icons = {
            excited: '😄',
            concerned: '😟',
            thoughtful: '🤔',
            urgent: '⚡',
            analytical: '🧐',
            agreeable: '😊'
        };
        return icons[emotion] || '😐';
    }

    formatTimestamp(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * アバターステータスの更新
     */
    updateAvatarStatus(osType, status) {
        const avatar = document.querySelector(`.avatar[data-os="${osType}"]`);
        if (avatar) {
            const statusElement = avatar.querySelector('.avatar-status');
            statusElement.className = `avatar-status ${status}`;
            
            if (status === 'speaking') {
                avatar.classList.add('speaking');
            } else {
                avatar.classList.remove('speaking');
            }
        }
    }

    /**
     * メトリクスの更新
     */
    updateMetrics() {
        const dialogueCount = this.dialogueHistory.length;
        const interactionIntensity = this.calculateInteractionIntensity();
        const harmonyLevel = this.calculateHarmonyLevel();

        document.getElementById('dialogue-count').textContent = dialogueCount;
        document.getElementById('interaction-intensity').textContent = `${interactionIntensity}%`;
        document.getElementById('harmony-level').textContent = `${harmonyLevel}%`;
    }

    /**
     * インタラクティブ要素の初期化
     */
    initializeInteractiveElements() {
        // シナリオカードのクリックイベント
        document.querySelectorAll('.scenario-start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenarioId = e.target.dataset.scenario;
                this.startScenario(scenarioId);
            });
        });

        // コントロールボタンのイベント
        this.bindControlEvents();
        
        // スライダーのイベント
        this.bindSliderEvents();
    }

    /**
     * イベントバインディング
     */
    bindEvents() {
        // 必要に応じてグローバルイベントを追加
    }

    bindControlEvents() {
        const startBtn = document.getElementById('start-simulation');
        const pauseBtn = document.getElementById('pause-simulation');
        const stopBtn = document.getElementById('stop-simulation');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.currentScenario) {
                    this.startScenario(this.currentScenario.id);
                }
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.simulationState = 'paused';
                this.updateControlButtons();
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.simulationState = 'idle';
                this.currentScenario = null;
                this.updateControlButtons();
                this.clearDialogueMessages();
                this.resetMetrics();
            });
        }
    }

    bindSliderEvents() {
        const sliders = document.querySelectorAll('.control-sliders input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueSpan = e.target.parentElement.querySelector('.slider-value');
                if (valueSpan) {
                    valueSpan.textContent = e.target.value;
                }
            });
        });
    }

    /**
     * コントロールボタンの状態更新
     */
    updateControlButtons() {
        const startBtn = document.getElementById('start-simulation');
        const pauseBtn = document.getElementById('pause-simulation');
        const stopBtn = document.getElementById('stop-simulation');

        if (startBtn) startBtn.disabled = !this.currentScenario || this.simulationState === 'running';
        if (pauseBtn) pauseBtn.disabled = this.simulationState !== 'running';
        if (stopBtn) stopBtn.disabled = this.simulationState === 'idle';
    }

    /**
     * 対話メッセージのクリア
     */
    clearDialogueMessages() {
        const messagesContainer = document.getElementById('dialogue-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="no-dialogue-message">
                    <span class="message-icon">💭</span>
                    <p>シナリオを開始すると、内部対話が表示されます</p>
                </div>
            `;
        }
    }

    /**
     * メトリクスのリセット
     */
    resetMetrics() {
        document.getElementById('dialogue-count').textContent = '0';
        document.getElementById('interaction-intensity').textContent = '0%';
        document.getElementById('harmony-level').textContent = '0%';
        this.dialogueHistory = [];
    }

    /**
     * 計算メソッド
     */
    calculateInteractionIntensity() {
        if (this.dialogueHistory.length === 0) return 0;
        
        const recentDialogues = this.dialogueHistory.slice(-5);
        const uniqueSpeakers = new Set(recentDialogues.map(d => d.speaker)).size;
        return Math.min(100, (uniqueSpeakers / 3) * 100);
    }

    calculateHarmonyLevel() {
        if (this.dialogueHistory.length < 3) return 0;
        
        const speakerCounts = this.dialogueHistory.reduce((acc, dialogue) => {
            acc[dialogue.speaker] = (acc[dialogue.speaker] || 0) + 1;
            return acc;
        }, {});
        
        const values = Object.values(speakerCounts);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        
        return Math.max(0, Math.min(100, 100 - variance * 10));
    }

    /**
     * 対話分析
     */
    analyzeDialogue() {
        const analysis = this.performDialogueAnalysis();
        this.updateInsightCards(analysis);
    }

    performDialogueAnalysis() {
        const speakerStats = this.dialogueHistory.reduce((acc, dialogue) => {
            if (!acc[dialogue.speaker]) {
                acc[dialogue.speaker] = { count: 0, emotions: [] };
            }
            acc[dialogue.speaker].count++;
            acc[dialogue.speaker].emotions.push(dialogue.emotion);
            return acc;
        }, {});

        const dominantSpeaker = Object.keys(speakerStats).reduce((a, b) => 
            speakerStats[a].count > speakerStats[b].count ? a : b
        );

        return {
            dominantPattern: `${this.getOSName(dominantSpeaker)}が主導的な役割を果たしています`,
            conflictAreas: this.identifyConflictAreas(),
            growthOpportunities: this.identifyGrowthOpportunities()
        };
    }

    identifyConflictAreas() {
        // 簡単な対立分析
        const conflictKeywords = ['でも', 'しかし', '待って', '反対'];
        const conflicts = this.dialogueHistory.filter(d => 
            conflictKeywords.some(keyword => d.message.includes(keyword))
        );
        
        if (conflicts.length > 2) {
            return '価値観の違いによる対立が見られます';
        } else if (conflicts.length > 0) {
            return '軽微な意見の相違があります';
        } else {
            return '調和的な対話が行われています';
        }
    }

    identifyGrowthOpportunities() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const lowestScore = Math.min(engineOS.score, interfaceOS.score, safeModeOS.score);
        
        if (engineOS.score === lowestScore) {
            return '創造性と自己表現の向上に取り組みましょう';
        } else if (interfaceOS.score === lowestScore) {
            return '他者との関係性を深める機会があります';
        } else {
            return '内的安定性を高める余地があります';
        }
    }

    updateInsightCards(analysis) {
        document.getElementById('dominant-pattern').textContent = analysis.dominantPattern;
        document.getElementById('conflict-areas').textContent = analysis.conflictAreas;
        document.getElementById('growth-opportunities').textContent = analysis.growthOpportunities;
    }

    /**
     * その他のシナリオスクリプト生成メソッド（簡略版）
     */
    generateConflictResolutionScript() {
        return [
            { speaker: 'engine', message: '自分の信念を曲げるべきではない！', emotion: 'determined', timestamp: 0 },
            { speaker: 'safe', message: '対立を避けて平和を保つことも大切だ', emotion: 'cautious', timestamp: 2000 },
            { speaker: 'interface', message: '相手の立場も理解してみよう', emotion: 'empathetic', timestamp: 4000 }
        ];
    }

    generateCreativeCollaborationScript() {
        return [
            { speaker: 'engine', message: '革新的なアイデアを試してみよう！', emotion: 'creative', timestamp: 0 },
            { speaker: 'interface', message: 'チームの意見も取り入れて改善しよう', emotion: 'collaborative', timestamp: 2000 }
        ];
    }

    generateStressResponseScript() {
        return [
            { speaker: 'safe', message: 'まずは深呼吸して落ち着こう', emotion: 'calming', timestamp: 0 },
            { speaker: 'interface', message: '誰かに相談してサポートを求めよう', emotion: 'seeking', timestamp: 2000 }
        ];
    }

    generateRelationshipDynamicsScript() {
        return [
            { speaker: 'interface', message: '相手の気持ちを理解することが大切', emotion: 'empathetic', timestamp: 0 },
            { speaker: 'engine', message: '自分の意見もしっかり伝えよう', emotion: 'assertive', timestamp: 2000 },
            { speaker: 'safe', message: '関係を壊さないよう慎重に', emotion: 'protective', timestamp: 4000 }
        ];
    }

    generateGrowthJourneyScript() {
        return [
            { speaker: 'engine', message: '新しい挑戦で自分を成長させよう', emotion: 'ambitious', timestamp: 0 },
            { speaker: 'safe', message: '着実に一歩ずつ進むことが大切', emotion: 'steady', timestamp: 2000 },
            { speaker: 'interface', message: '他者から学ぶことも忘れずに', emotion: 'learning', timestamp: 4000 }
        ];
    }

    /**
     * データ設定
     */
    setData(data) {
        this.analysisData = data;
    }

    /**
     * クリーンアップ
     */
    destroy() {
        this.simulationState = 'idle';
        this.currentScenario = null;
        this.dialogueHistory = [];
        super.destroy();
    }
}

// グローバルスコープに登録
window.ScenariosTab = ScenariosTab;