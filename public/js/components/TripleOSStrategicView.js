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

    // 分人思想ベースの戦略サマリーセクション（上部横断）
    async _renderStrategySummarySection(engineOS, interfaceOS, safeModeOS) {
        return `
        <section class="strategy-summary-section">
            <!-- 分人思想概念説明 -->
            <div class="bunenjin-concept-intro">
                <h1 class="main-concept-title">🎭 あなたの中に住む3人の『分人』</h1>
                <div class="concept-explanation">
                    <p class="concept-lead">一人の人間の中には複数の「分人」が存在します。あなたの場合はこの3つの分人で構成されています：</p>
                    <div class="bunenjin-preview">
                        <div class="bunenjin-card engine-preview">
                            <div class="bunenjin-icon">🔥</div>
                            <div class="bunenjin-info">
                                <h3>本音の分人</h3>
                                <p>「${engineOS.osName}」として価値観を大切にする</p>
                            </div>
                        </div>
                        <div class="bunenjin-card interface-preview">
                            <div class="bunenjin-icon">🌐</div>
                            <div class="bunenjin-info">
                                <h3>社会的分人</h3>
                                <p>「${interfaceOS.hexagramInfo?.name_jp || "対人関係"}」として人と関わる</p>
                            </div>
                        </div>
                        <div class="bunenjin-card safemode-preview">
                            <div class="bunenjin-icon">🛡️</div>
                            <div class="bunenjin-info">
                                <h3>防御的分人</h3>
                                <p>「${safeModeOS.hexagramInfo?.name_jp || "自己防衛"}」として自分を守る</p>
                            </div>
                        </div>
                    </div>
                    <div class="concept-key-insight">
                        <p><strong>💡 重要な気づき：</strong> 「本当の自分探し」よりも「場面に応じた最適な分人の選択」が、より豊かで自然な人生を送る秘訣です。</p>
                    </div>
                </div>
            </div>
            
            <!-- AI戦略サマリー -->
            <div class="ai-strategy-summary" id="ai-strategy-summary">
                <div class="summary-loading">
                    <div class="loading-spinner"></div>
                    <p>あなた専用の分人活用戦略を生成中...</p>
                </div>
            </div>
        </section>
        `;
    }

    // 左パネル: 本音の分人（エンジンOS）
    _renderEnginePanel(engineOS, engineDetails) {
        const coreKeywords = this._extractCoreKeywords(engineDetails?.engine?.core_drive);
        const strengths = engineDetails?.engine?.potential_strengths || ['データを読み込み中...'];
        const weaknesses = engineDetails?.engine?.potential_weaknesses || ['データを読み込み中...'];

        return `
        <div class="os-panel engine-panel bunenjin-panel" data-os-type="engine">
            <div class="panel-header">
                <div class="panel-icon">🔥</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">本音の分人</h2>
                    <p class="panel-subtitle">あなたの中で最も純粋で本質的な人格</p>
                    <p class="bunenjin-explanation">一人でいる時や心を許せる相手といる時に現れる、ありのままの「あなた」です</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="bunenjin-identity">
                    <div class="bunenjin-type">
                        <span class="type-label">本音の分人タイプ</span>
                        <h3 class="os-name">${engineOS.osName}の人</h3>
                    </div>
                    <p class="os-catchphrase">「${engineDetails?.catchphrase || engineOS.hexagramInfo?.catchphrase || '深い価値観を持つ人'}」</p>
                    
                    <div class="authenticity-meter">
                        <div class="meter-label">この価値観での行動確率</div>
                        <div class="meter-bar">
                            <div class="meter-fill" style="width: ${Math.round(engineOS.strength * 100)}%"></div>
                        </div>
                        <div class="meter-value">${Math.round(engineOS.strength * 100)}%</div>
                        <div class="meter-description">
                            ${this._getEngineStrengthAdvice(Math.round(engineOS.strength * 100)).description}
                        </div>
                    </div>
                </div>

                <div class="bunenjin-core-values">
                    <h4>🎯 この分人が大切にしていること</h4>
                    <div class="values-keywords">
                        ${coreKeywords.map(keyword => `<span class="keyword-tag engine-keyword">${keyword}</span>`).join('')}
                    </div>
                    <div class="core-motivation-statement" id="engine-motivation-statement">
                        <div class="ai-placeholder">AI生成: この分人の核心的な価値観</div>
                    </div>
                </div>

                <div class="bunenjin-expressions">
                    <div class="positive-expressions">
                        <h4>✨ この分人の輝く瞬間</h4>
                        <ul class="expression-list">
                            ${strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="bunenjin-nurturing" id="engine-nurturing">
                        <h4>🌱 この分人を育てる方法</h4>
                        <div class="ai-placeholder">AI生成: 本音の分人を強化する具体的方法</div>
                    </div>
                    
                    <div class="bunenjin-usage">
                        <h4>🏠 この分人を活かせる場面</h4>
                        <div class="usage-scenarios" id="engine-scenarios">
                            <div class="ai-placeholder">AI生成: 本音の分人が活躍できる環境・関係</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // 中央パネル: 社会的分人（インターフェースOS）
    _renderInterfacePanel(interfaceOS, interfaceDetails) {
        const behavioralPatterns = interfaceDetails?.interface?.behavioral_patterns || ['データを読み込み中...'];
        const appearance = interfaceDetails?.interface?.how_it_appears || 'データを読み込み中...';

        return `
        <div class="os-panel interface-panel bunenjin-panel" data-os-type="interface">
            <div class="panel-header">
                <div class="panel-icon">🌐</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">社会的分人</h2>
                    <p class="panel-subtitle">他者と関わる時に現れる、あなたの社交的な顔</p>
                    <p class="bunenjin-explanation">職場や友人関係など、社会の中で役割を果たす時に活躍する分人です</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="bunenjin-identity">
                    <div class="bunenjin-type">
                        <span class="type-label">社会的分人タイプ</span>
                        <h3 class="os-name">${interfaceOS.osName}スタイル</h3>
                    </div>
                    <p class="os-catchphrase">「${interfaceDetails?.catchphrase || interfaceOS.hexagramInfo?.catchphrase || '独特な魅力を持つ人'}」</p>
                    
                    <div class="expression-frequency">
                        <div class="frequency-label">他者との関わりでこのスタイルが現れる頻度</div>
                        <div class="frequency-bar">
                            <div class="frequency-fill" style="width: ${interfaceOS.matchScore || Math.round(interfaceOS.strength * 100)}%"></div>
                        </div>
                        <div class="frequency-value">${interfaceOS.matchScore || Math.round(interfaceOS.strength * 100)}%</div>
                        <div class="frequency-description">
                            ${this._getInterfaceMatchAdvice(interfaceOS.matchScore || Math.round(interfaceOS.strength * 100)).description}
                        </div>
                    </div>
                </div>

                <div class="bunenjin-social-style">
                    <h4>🎭 この分人の社会的な振る舞い</h4>
                    <p class="social-description">${appearance}</p>
                    
                    <div class="behavioral-patterns">
                        <h5>典型的な行動パターン</h5>
                        <ul class="pattern-list">
                            ${behavioralPatterns.map(pattern => `<li>${pattern}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="bunenjin-social-optimization">
                    <div class="optimal-environments" id="interface-optimal-roles">
                        <h4>🎯 この分人が輝く環境・役割</h4>
                        <div class="ai-placeholder">AI生成: 社会的分人が力を発揮できる具体的な場面</div>
                    </div>

                    <div class="relationship-dynamics" id="interface-relationship-dynamics">
                        <h4>🤝 人間関係での特徴</h4>
                        <div class="ai-placeholder">AI生成: この分人が築く人間関係の特徴</div>
                    </div>

                    <div class="growth-areas" id="interface-growth-areas">
                        <h4>📈 この分人の成長ポイント</h4>
                        <div class="ai-placeholder">AI生成: 社会的分人をより効果的に活用する方法</div>
                    </div>
                </div>

                <div class="bunenjin-balance">
                    <h4>⚖️ 本音の分人との関係</h4>
                    <div class="balance-indicator" id="interface-balance-indicator">
                        <div class="ai-placeholder">AI生成: 本音と社会的な顔のバランス分析</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // 右パネル: 防御的分人（セーフモードOS）
    _renderSafeModePanel(safeModeOS, safeModeDetails) {
        const triggerSituations = safeModeDetails?.safe_mode?.trigger_situations || ['データを読み込み中...'];
        const defensivePatterns = safeModeDetails?.safe_mode?.defensive_patterns || ['データを読み込み中...'];
        const internalState = safeModeDetails?.safe_mode?.internal_state || 'データを読み込み中...';

        return `
        <div class="os-panel safemode-panel bunenjin-panel" data-os-type="safemode">
            <div class="panel-header">
                <div class="panel-icon">🛡️</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">防御的分人</h2>
                    <p class="panel-subtitle">困難な状況で自分を守ろうとする、慎重で用心深い人格</p>
                    <p class="bunenjin-explanation">ストレスや脅威を感じた時に現れ、あなたを守ろうとする分人です</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="bunenjin-identity">
                    <div class="bunenjin-type">
                        <span class="type-label">防御的分人タイプ</span>
                        <h3 class="os-name">${safeModeOS.osName}モード</h3>
                    </div>
                    <p class="os-catchphrase">「${safeModeDetails?.catchphrase || safeModeOS.hexagramInfo?.catchphrase || '自分を守る知恵を持つ人'}」</p>
                    
                    <div class="defense-activation">
                        <div class="activation-label">困難な状況でこの分人が現れる頻度</div>
                        <div class="activation-bar">
                            <div class="activation-fill" style="width: ${safeModeOS.matchScore || Math.round(safeModeOS.strength * 100)}%"></div>
                        </div>
                        <div class="activation-value">${safeModeOS.matchScore || Math.round(safeModeOS.strength * 100)}%</div>
                        <div class="activation-description">
                            ${this._getSafeModeActivationAdvice(safeModeOS.matchScore || Math.round(safeModeOS.strength * 100)).description}
                        </div>
                    </div>
                </div>

                <div class="bunenjin-defensive-wisdom">
                    <h4>🚨 この分人が警戒する状況</h4>
                    <ul class="trigger-list">
                        ${triggerSituations.map(trigger => `<li><span class="trigger-icon">⚠️</span>${trigger}</li>`).join('')}
                    </ul>
                    
                    <div class="inner-experience">
                        <h5>💭 その時の内面体験</h5>
                        <p class="state-description">${internalState}</p>
                    </div>
                </div>

                <div class="bunenjin-defensive-actions">
                    <h4>🛡️ この分人の保護行動</h4>
                    <ul class="defense-behavior-list">
                        ${defensivePatterns.map(pattern => `<li><span class="defense-icon">🔒</span>${pattern}</li>`).join('')}
                    </ul>
                </div>

                <div class="bunenjin-healthy-defense">
                    <div class="healthy-usage" id="safemode-healthy-usage">
                        <h4>✨ この分人の健全な活用法</h4>
                        <div class="ai-placeholder">AI生成: 防御的分人を建設的に活用する方法</div>
                    </div>

                    <div class="recovery-guidance" id="safemode-recovery-guidance">
                        <h4>🌱 他の分人への切り替え方法</h4>
                        <div class="ai-placeholder">AI生成: 防御モードから本音・社会的分人への復帰方法</div>
                    </div>

                    <div class="bunenjin-integration" id="safemode-integration">
                        <h4>🤝 3つの分人の調和</h4>
                        <div class="ai-placeholder">AI生成: 防御的分人と他の分人のバランスの取り方</div>
                    </div>
                </div>

                <div class="bunenjin-acceptance">
                    <h4>💝 この分人への感謝</h4>
                    <div class="acceptance-message">
                        <p>この防御的分人は、あなたが困難な状況を乗り越えるために発達した大切な知恵です。責めるのではなく、その役割を理解し、適切に活用することが成長につながります。</p>
                    </div>
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

    // === 新しいヘルパーメソッド群（分人思想対応） ===

    // エンジンOSの強度に基づくアドバイス
    _getEngineStrengthAdvice(strengthPercentage) {
        if (strengthPercentage >= 90) {
            return {
                level: "非常に強固な価値観",
                description: "この価値観があなたの判断と行動の核となっています。ほぼ確実にこの価値観に基づいて人生の重要な決断をします。"
            };
        } else if (strengthPercentage >= 80) {
            return {
                level: "強固な価値観",
                description: "この価値観があなたの行動指針として強く働いています。重要な場面で高い頻度でこの価値観が表れます。"
            };
        } else if (strengthPercentage >= 70) {
            return {
                level: "安定した価値観",
                description: "この価値観があなたの行動パターンに一定の影響を与えています。多くの場面でこの価値観が反映されます。"
            };
        } else if (strengthPercentage >= 50) {
            return {
                level: "中程度の価値観",
                description: "この価値観は時々あなたの判断に影響を与えます。状況によってこの価値観が表れたり表れなかったりします。"
            };
        } else {
            return {
                level: "潜在的な価値観",
                description: "この価値観は現在それほど強くありませんが、適切に育てることで大きな力となる可能性があります。"
            };
        }
    }

    // インターフェースOSのマッチ度に基づくアドバイス
    _getInterfaceMatchAdvice(matchScore) {
        if (matchScore >= 70) {
            return {
                level: "高い表現力",
                description: "あなたのエンジンOSの価値観が、この社会的スタイルとして自然に表れます。このコミュニケーションスタイルはあなたらしさの良い表現です。"
            };
        } else if (matchScore >= 50) {
            return {
                level: "中程度の表現力",
                description: "このコミュニケーションスタイルは時々表れます。意識的に活用することで、対人関係でより効果的な表現ができます。"
            };
        } else if (matchScore >= 30) {
            return {
                level: "控えめな表現力",
                description: "このスタイルはあまり自然には表れませんが、必要な場面で意識的に使うことで新たな魅力を発見できます。"
            };
        } else if (matchScore >= 10) {
            return {
                level: "潜在的な表現力",
                description: "このスタイルはほとんど表れませんが、訓練や意識的な取り組みで開発できる可能性があります。"
            };
        } else {
            return {
                level: "未開発の表現力",
                description: "現在このスタイルはあまり使われていませんが、他のコミュニケーション方法と組み合わせることで補完できます。"
            };
        }
    }

    // セーフモードOSの発動頻度に基づくアドバイス
    _getSafeModeActivationAdvice(activationScore) {
        if (activationScore >= 70) {
            return {
                level: "高頻度発動",
                description: "ストレス時によくこの防御パターンを使います。この分人の特徴を理解し、適切にコントロールすることが重要です。"
            };
        } else if (activationScore >= 50) {
            return {
                level: "中頻度発動",
                description: "困難な状況でしばしばこの防御パターンが現れます。緊急時の対処として活用しつつ、バランスを保ちましょう。"
            };
        } else if (activationScore >= 30) {
            return {
                level: "低頻度発動",
                description: "この防御パターンは時々使われます。必要な時の選択肢として理解しておき、他の対処法も併せて活用しましょう。"
            };
        } else if (activationScore >= 10) {
            return {
                level: "稀に発動",
                description: "この防御パターンはあまり使われません。極限状況での最後の手段として機能する可能性があります。"
            };
        } else {
            return {
                level: "ほとんど発動しない",
                description: "この防御パターンはほとんど使われません。他の対処法を主に使用し、この方法は予備として理解しておきましょう。"
            };
        }
    }
}

// クラスをグローバルスコープに登録
if (typeof window !== 'undefined') {
    window.TripleOSStrategicView = TripleOSStrategicView;
}