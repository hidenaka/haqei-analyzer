// TripleOSStrategicView.js - 3OS統合戦略ダッシュボード
// HaQei Analyzer - Strategic Triple OS Dashboard Component

class TripleOSStrategicView extends BaseComponent {
    constructor(containerId, options) {
        super(containerId, options);
        
        this.analysisResult = options.analysisResult;
        this.dataManager = options.dataManager;
        this.compatibilityLoader = options.compatibilityLoader;
        this.personalStrategyAI = new PersonalStrategyAI(this.dataManager);
        this.connectionsVisualizer = null; // Phase 3で実装
        
        console.log("🎯 [TripleOSStrategicView] Initializing strategic dashboard", {
            analysisResult: this.analysisResult,
            hasDataManager: !!this.dataManager
        });
    }

    async init() {
        console.log("🚀 [TripleOSStrategicView] Strategic dashboard initialization started");
        await this.render();
        console.log("✅ [TripleOSStrategicView] Strategic dashboard initialization completed");
    }

    async render() {
        console.log("🎨 [TripleOSStrategicView] Rendering strategic dashboard");
        
        if (!this.analysisResult) {
            this.container.innerHTML = `<div class="error-text">分析結果データがありません。</div>`;
            console.error("❌ [TripleOSStrategicView] Analysis result data not available");
            return;
        }

        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;

        if (!engineOS || !interfaceOS || !safeModeOS) {
            this.container.innerHTML = `<div class="error-text">3OSデータが不完全です。</div>`;
            console.error("❌ [TripleOSStrategicView] Incomplete 3OS data");
            return;
        }

        // 各OSの詳細データを取得
        const engineDetails = this._getHexagramDetails(engineOS.hexagramId);
        const interfaceDetails = this._getHexagramDetails(interfaceOS.hexagramId);
        const safeModeDetails = this._getHexagramDetails(safeModeOS.hexagramId);

        const html = `
        <div class="strategic-dashboard">
            ${await this._renderStrategySummarySection(engineOS, interfaceOS, safeModeOS)}
            
            <div class="three-os-panels">
                ${this._renderEnginePanel(engineOS, engineDetails)}
                ${this._renderInterfacePanel(interfaceOS, interfaceDetails)}
                ${this._renderSafeModePanel(safeModeOS, safeModeDetails)}
            </div>
            
            <div class="connections-container" id="os-connections-container">
                <!-- OS間相互作用の可視化 -->
            </div>
        </div>
        `;

        this.container.innerHTML = html;
        await this._postRender();
    }

    // AIパーソナル戦略サマリーセクション（上部横断）
    async _renderStrategySummarySection(engineOS, interfaceOS, safeModeOS) {
        return `
        <section class="strategy-summary-section">
            <div class="summary-header">
                <h1 class="main-archetype-title">${engineOS.osName}として生きるあなたへ</h1>
                <p class="archetype-subtitle">${engineOS.hexagramInfo?.catchphrase || 'あなたの人生戦略を発見しましょう'}</p>
            </div>
            
            <div class="ai-strategy-summary" id="ai-strategy-summary">
                <div class="summary-loading">
                    <div class="loading-spinner"></div>
                    <p>あなた専用の人生戦略を生成中...</p>
                </div>
            </div>
        </section>
        `;
    }

    // 左パネル: エンジンOS（魂の動機）
    _renderEnginePanel(engineOS, engineDetails) {
        const coreKeywords = this._extractCoreKeywords(engineDetails?.engine?.core_drive);
        const strengths = engineDetails?.engine?.potential_strengths || ['データを読み込み中...'];
        const weaknesses = engineDetails?.engine?.potential_weaknesses || ['データを読み込み中...'];

        return `
        <div class="os-panel engine-panel" data-os-type="engine">
            <div class="panel-header">
                <div class="panel-icon">🔥</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">魂のエンジンOS</h2>
                    <p class="panel-subtitle">あなたを突き動かす根源的な力</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="os-identity">
                    <h3 class="os-name">${engineOS.osName}</h3>
                    <p class="os-catchphrase">${engineDetails?.catchphrase || engineOS.hexagramInfo?.catchphrase || ''}</p>
                    <div class="strength-meter">
                        <div class="meter-label">エンジン出力</div>
                        <div class="meter-bar">
                            <div class="meter-fill" style="width: ${Math.round(engineOS.strength * 100)}%"></div>
                        </div>
                        <div class="meter-value">${Math.round(engineOS.strength * 100)}%</div>
                    </div>
                </div>

                <div class="core-motivation">
                    <h4>根源的動機</h4>
                    <div class="motivation-keywords">
                        ${coreKeywords.map(keyword => `<span class="keyword-tag engine-keyword">${keyword}</span>`).join('')}
                    </div>
                    <div class="motivation-statement" id="engine-motivation-statement">
                        <div class="ai-placeholder">AI生成: モチベーション・ステートメント</div>
                    </div>
                </div>

                <div class="strengths-weaknesses">
                    <div class="strengths-section">
                        <h4>💪 潜在的な強み</h4>
                        <ul class="strength-list">
                            ${strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="energy-management" id="engine-energy-management">
                        <h4>⚡ エネルギー管理法</h4>
                        <div class="ai-placeholder">AI生成: 具体的なエネルギー管理アドバイス</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // 中央パネル: インターフェースOS（社会的役割）
    _renderInterfacePanel(interfaceOS, interfaceDetails) {
        const behavioralPatterns = interfaceDetails?.interface?.behavioral_patterns || ['データを読み込み中...'];
        const appearance = interfaceDetails?.interface?.how_it_appears || 'データを読み込み中...';

        return `
        <div class="os-panel interface-panel" data-os-type="interface">
            <div class="panel-header">
                <div class="panel-icon">🌐</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">世界との接続インターフェースOS</h2>
                    <p class="panel-subtitle">社会の中であなたが輝く役回り</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="os-identity">
                    <h3 class="os-name">${interfaceOS.osName}</h3>
                    <p class="os-catchphrase">${interfaceDetails?.catchphrase || interfaceOS.hexagramInfo?.catchphrase || ''}</p>
                    <div class="match-score">
                        <div class="score-label">適合度</div>
                        <div class="score-value">${interfaceOS.matchScore || Math.round(interfaceOS.strength * 100)}%</div>
                    </div>
                </div>

                <div class="social-expression">
                    <h4>外見的特徴</h4>
                    <p class="appearance-description">${appearance}</p>
                </div>

                <div class="optimal-roles" id="interface-optimal-roles">
                    <h4>🎯 推奨される役回り・立場</h4>
                    <div class="ai-placeholder">AI生成: 具体的な職種・役割・シチュエーション</div>
                </div>

                <div class="behavioral-patterns">
                    <h4>⚙️ 典型的な行動パターン</h4>
                    <ul class="pattern-list">
                        ${behavioralPatterns.map(pattern => `<li>${pattern}</li>`).join('')}
                    </ul>
                </div>

                <div class="warning-zones" id="interface-warning-zones">
                    <h4>⚠️ 警告ゾーン（苦手な環境）</h4>
                    <div class="ai-placeholder">AI生成: 避けるべき環境・状況</div>
                </div>
            </div>
        </div>
        `;
    }

    // 右パネル: セーフモードOS（自己防衛機能）
    _renderSafeModePanel(safeModeOS, safeModeDetails) {
        const triggerSituations = safeModeDetails?.safe_mode?.trigger_situations || ['データを読み込み中...'];
        const defensivePatterns = safeModeDetails?.safe_mode?.defensive_patterns || ['データを読み込み中...'];
        const internalState = safeModeDetails?.safe_mode?.internal_state || 'データを読み込み中...';

        return `
        <div class="os-panel safemode-panel" data-os-type="safemode">
            <div class="panel-header">
                <div class="panel-icon">🛡️</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">心のセーフモードOS</h2>
                    <p class="panel-subtitle">あなたを守る無意識の防御システム</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="os-identity">
                    <h3 class="os-name">${safeModeOS.osName}</h3>
                    <p class="os-catchphrase">${safeModeDetails?.catchphrase || safeModeOS.hexagramInfo?.catchphrase || ''}</p>
                    <div class="activation-level">
                        <div class="level-label">発動レベル</div>
                        <div class="level-value">${safeModeOS.matchScore || Math.round(safeModeOS.strength * 100)}%</div>
                    </div>
                </div>

                <div class="trigger-analysis">
                    <h4>🚨 起動トリガー</h4>
                    <ul class="trigger-list">
                        ${triggerSituations.map(trigger => `<li>${trigger}</li>`).join('')}
                    </ul>
                </div>

                <div class="defensive-behaviors">
                    <h4>🔒 典型的な言動パターン</h4>
                    <ul class="behavior-list">
                        ${defensivePatterns.map(pattern => `<li>${pattern}</li>`).join('')}
                    </ul>
                </div>

                <div class="internal-state">
                    <h4>💭 その時の内面状態</h4>
                    <p class="state-description">${internalState}</p>
                </div>

                <div class="recovery-procedures" id="safemode-recovery-procedures">
                    <h4>🔄 安全に再起動するための手順</h4>
                    <div class="ai-placeholder">AI生成: 具体的な回復・対処アクション</div>
                </div>
            </div>
        </div>
        `;
    }

    // レンダリング後の処理
    async _postRender() {
        console.log("🔧 [TripleOSStrategicView] Post-render processing started");
        
        // イベントリスナーの設定
        this._bindEventListeners();
        
        // Phase 2: AI戦略生成
        await this._loadAIStrategy();
        
        // Phase 3: OS間相互作用可視化
        await this._loadConnectionsVisualizer();
        
        console.log("✅ [TripleOSStrategicView] Post-render processing completed");
    }

    // イベントリスナーの設定
    _bindEventListeners() {
        // パネルの展開・折りたたみ機能
        const panels = this.container.querySelectorAll('.os-panel');
        panels.forEach(panel => {
            const header = panel.querySelector('.panel-header');
            if (header) {
                header.addEventListener('click', (e) => {
                    panel.classList.toggle('collapsed');
                });
            }
        });

        // キーワードタグのホバー効果
        const keywords = this.container.querySelectorAll('.keyword-tag');
        keywords.forEach(keyword => {
            keyword.addEventListener('mouseenter', (e) => {
                e.target.classList.add('hover');
            });
            keyword.addEventListener('mouseleave', (e) => {
                e.target.classList.remove('hover');
            });
        });
    }

    // AI戦略生成メソッド
    async _loadAIStrategy() {
        try {
            const summaryContainer = document.getElementById('ai-strategy-summary');
            if (!summaryContainer) return;

            // AI戦略生成を実行
            console.log("🤖 [TripleOSStrategicView] AI戦略生成開始");
            const strategy = await this.personalStrategyAI.generateStrategySummary(this.analysisResult);
            
            // 生成結果をHTMLに反映
            summaryContainer.innerHTML = `
            <div class="strategy-complete">
                <div class="four-questions-complete">
                    <div class="question-complete">
                        <h3>💎 あなたの根源的な強み</h3>
                        <p class="strategy-text">${strategy.rootStrength.text}</p>
                        <div class="generation-info">
                            <span class="quality-score">品質: ${strategy.rootStrength.quality}%</span>
                            ${strategy.rootStrength.fallback ? '<span class="fallback-indicator">フォールバック</span>' : ''}
                        </div>
                    </div>
                    <div class="question-complete">
                        <h3>🎯 最適な役回り</h3>
                        <p class="strategy-text">${strategy.optimalRole.text}</p>
                        <div class="generation-info">
                            <span class="quality-score">品質: ${strategy.optimalRole.quality}%</span>
                            ${strategy.optimalRole.fallback ? '<span class="fallback-indicator">フォールバック</span>' : ''}
                        </div>
                    </div>
                    <div class="question-complete">
                        <h3>🔍 「らしくない」振る舞いの理由</h3>
                        <p class="strategy-text">${strategy.defensivePattern.text}</p>
                        <div class="generation-info">
                            <span class="quality-score">品質: ${strategy.defensivePattern.quality}%</span>
                            ${strategy.defensivePattern.fallback ? '<span class="fallback-indicator">フォールバック</span>' : ''}
                        </div>
                    </div>
                    <div class="question-complete">
                        <h3>⚡ 実践的アドバイス</h3>
                        <p class="strategy-text">${strategy.practicalAdvice.text}</p>
                        <div class="generation-info">
                            <span class="quality-score">品質: ${strategy.practicalAdvice.quality}%</span>
                            ${strategy.practicalAdvice.fallback ? '<span class="fallback-indicator">フォールバック</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="strategy-actions">
                    <button id="regenerate-strategy" class="action-button">戦略を再生成</button>
                    <button id="export-strategy" class="action-button">戦略をエクスポート</button>
                </div>
            </div>
            `;

            // 再生成ボタンのイベントリスナー追加
            this._bindStrategyActions();
            
            console.log("✅ [TripleOSStrategicView] AI戦略生成完了", strategy);

        } catch (error) {
            console.error("❌ [TripleOSStrategicView] AI strategy loading failed:", error);
            this._renderStrategyError();
        }
    }

    // ヘルパーメソッド: 卦詳細データの取得
    _getHexagramDetails(hexagramId) {
        if (!this.dataManager || !hexagramId) {
            console.warn(`⚠️ [TripleOSStrategicView] Cannot get hexagram details for ID: ${hexagramId}`);
            return null;
        }
        return this.dataManager.getHexagramDetails(hexagramId);
    }

    // ヘルパーメソッド: 核心キーワードの抽出
    _extractCoreKeywords(coreDriveText) {
        if (!coreDriveText) return ['創造性', '行動力', '探求心'];
        
        // 簡単なキーワード抽出（Phase 2でAI強化予定）
        const keywords = [];
        if (coreDriveText.includes('創造')) keywords.push('創造性');
        if (coreDriveText.includes('リーダー')) keywords.push('リーダーシップ');
        if (coreDriveText.includes('影響')) keywords.push('影響力');
        if (coreDriveText.includes('新しい')) keywords.push('革新性');
        
        return keywords.length > 0 ? keywords : ['エネルギー', '情熱', '可能性'];
    }

    // 戦略アクションのイベントバインディング
    _bindStrategyActions() {
        const regenerateBtn = document.getElementById('regenerate-strategy');
        const exportBtn = document.getElementById('export-strategy');

        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.regenerateStrategy();
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this._exportStrategy();
            });
        }
    }

    // 戦略エラー表示
    _renderStrategyError() {
        const summaryContainer = document.getElementById('ai-strategy-summary');
        if (!summaryContainer) return;

        summaryContainer.innerHTML = `
        <div class="strategy-error">
            <div class="error-icon">⚠️</div>
            <h3>AI戦略生成エラー</h3>
            <p>申し訳ございません。パーソナル戦略の生成中にエラーが発生しました。</p>
            <button id="retry-strategy" class="action-button error-button">再試行する</button>
        </div>
        `;

        const retryBtn = document.getElementById('retry-strategy');
        if (retryBtn) {
            retryBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this._loadAIStrategy();
            });
        }
    }

    // 戦略エクスポート機能
    _exportStrategy() {
        try {
            const strategyElements = document.querySelectorAll('.strategy-text');
            const strategies = Array.from(strategyElements).map(el => el.textContent);
            
            const exportData = {
                title: `${this.analysisResult.engineOS.osName}の人生戦略`,
                generatedAt: new Date().toLocaleString('ja-JP'),
                strategies: {
                    rootStrength: strategies[0] || '',
                    optimalRole: strategies[1] || '',
                    defensivePattern: strategies[2] || '',
                    practicalAdvice: strategies[3] || ''
                }
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `haqei-strategy-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log("📄 [TripleOSStrategicView] 戦略エクスポート完了");
        } catch (error) {
            console.error("❌ [TripleOSStrategicView] 戦略エクスポートエラー:", error);
        }
    }

    // OS間相互作用の可視化
    async _loadConnectionsVisualizer() {
        console.log("🔮 [TripleOSStrategicView] Loading connections visualizer");
        
        try {
            const container = document.getElementById('os-connections-container');
            if (!container) {
                console.warn("⚠️ [TripleOSStrategicView] Connections container not found");
                return;
            }

            // InteractiveConnectionsVisualizerが利用可能か確認
            if (typeof InteractiveConnectionsVisualizer === 'undefined') {
                console.error("❌ [TripleOSStrategicView] InteractiveConnectionsVisualizer not loaded");
                return;
            }

            // 可視化インスタンスを作成
            this.connectionsVisualizer = new InteractiveConnectionsVisualizer('os-connections-container', {
                engineOS: this.analysisResult.engineOS,
                interfaceOS: this.analysisResult.interfaceOS,
                safeModeOS: this.analysisResult.safeModeOS,
                dataManager: this.dataManager
            });

            // 初期化
            await this.connectionsVisualizer.init();
            
            console.log("✅ [TripleOSStrategicView] Connections visualizer loaded successfully");
            
        } catch (error) {
            console.error("❌ [TripleOSStrategicView] Failed to load connections visualizer:", error);
            // フォールバック表示
            const container = document.getElementById('os-connections-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--primary-400);">
                        <p>OS間の相互作用の可視化で問題が発生しました。</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">ページを再読み込みしてください。</p>
                    </div>
                `;
            }
        }
    }

    // パブリックメソッド: 戦略の再生成
    async regenerateStrategy() {
        if (this.personalStrategyAI) {
            // ローディング表示
            const summaryContainer = document.getElementById('ai-strategy-summary');
            if (summaryContainer) {
                summaryContainer.innerHTML = `
                <div class="summary-loading">
                    <div class="loading-spinner"></div>
                    <p>戦略を再生成中...</p>
                </div>
                `;
            }
            
            await this._loadAIStrategy();
        }
    }

    // パブリックメソッド: パネルの状態制御
    togglePanel(panelType) {
        const panel = this.container.querySelector(`[data-os-type="${panelType}"]`);
        if (panel) {
            panel.classList.toggle('collapsed');
        }
    }
}

// クラスをグローバルスコープに登録
if (typeof window !== 'undefined') {
    window.TripleOSStrategicView = TripleOSStrategicView;
}