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

    // 易経の智慧ベースの戦略サマリーセクション（上部横断）
    async _renderStrategySummarySection(engineOS, interfaceOS, safeModeOS) {
        return `
        <section class="strategy-summary-section">
            <!-- 易経の智慧概念説明 -->
            <div class="os-aspect-concept-intro">
                <h1 class="main-concept-title">🎭 あなたには「3つの顔」があります</h1>
                <div class="concept-explanation">
                    <p class="concept-lead">私たちは誰でも、場面によって異なる自分を自然に使い分けています。</p>
                    <p class="concept-detail">例えば、家族といる時、職場にいる時、困った時...それぞれで少し違う「あなた」が現れませんか？</p>
                    <p class="concept-conclusion">あなたの場合、この3つの行動パターンで日々を過ごしています：</p>
                    <div class="triple-os-preview">
                        <div class="os-aspect-card engine-preview">
                            <div class="os-aspect-icon">🔥</div>
                            <div class="os-aspect-info">
                                <h3>本質的な自分</h3>
                                <p>「${engineOS.osName}」として価値観を大切にする</p>
                            </div>
                        </div>
                        <div class="os-aspect-card interface-preview">
                            <div class="os-aspect-icon">🌐</div>
                            <div class="os-aspect-info">
                                <h3>社会での自分</h3>
                                <p>「${interfaceOS.hexagramInfo?.name_jp || "対人関係"}」として人と関わる</p>
                            </div>
                        </div>
                        <div class="os-aspect-card safemode-preview">
                            <div class="os-aspect-icon">🛡️</div>
                            <div class="os-aspect-info">
                                <h3>守る力を持つ自分</h3>
                                <p>「${safeModeOS.hexagramInfo?.name_jp || "安全への配慮"}」として大切なものを守る</p>
                            </div>
                        </div>
                    </div>
                    <div class="concept-key-insight">
                        <p><strong>💡 重要な発見：</strong> 「自分らしさ」は一つに決める必要はありません。場面に応じて最適な「あなた」を選択することで、より自然で充実した毎日を送ることができます。</p>
                    </div>
                </div>
            </div>
            
            <!-- AI戦略サマリー -->
            <div class="ai-strategy-summary" id="ai-strategy-summary">
                <div class="summary-loading">
                    <div class="loading-spinner"></div>
                    <p>あなた専用の多面性活用戦略を生成中...</p>
                </div>
            </div>
        </section>
        `;
    }

    // 左パネル: 本質的な自分（エンジンOS）
    _renderEnginePanel(engineOS, engineDetails) {
        const coreKeywords = this._extractCoreKeywords(engineDetails?.engine?.core_drive);
        const strengths = engineDetails?.engine?.potential_strengths || ['データを読み込み中...'];
        const weaknesses = engineDetails?.engine?.potential_weaknesses || ['データを読み込み中...'];

        return `
        <div class="os-panel engine-panel os-aspect-panel" data-os-type="engine">
            <div class="panel-header">
                <div class="panel-icon">🔥</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">本質的な自分</h2>
                    <p class="panel-subtitle">あなたの中で最も純粋で本質的な価値観</p>
                    <p class="os-aspect-explanation">一人でいる時や心を許せる相手といる時に現れる、ありのままの「あなた」です</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="os-aspect-identity">
                    <div class="os-aspect-type">
                        <span class="type-label">本質的な価値観タイプ</span>
                        <h3 class="os-name">${engineOS.osName}の人</h3>
                    </div>
                    <p class="os-catchphrase">「${engineDetails?.catchphrase || engineOS.hexagramInfo?.catchphrase || '深い価値観を持つ人'}」</p>
                    
                    <div class="authenticity-meter">
                        <div class="meter-label">この価値観での行動確率</div>
                        <div class="meter-bar">
                            <div class="meter-fill" style="width: ${Math.round(engineOS.strength * 100)}%"></div>
                        </div>
                        <div class="meter-value">${this._formatScoreDisplay(engineOS.strength, 'engine')}</div>
                        <div class="meter-description">
                            ${this._getEngineStrengthAdvice(Math.round(engineOS.strength * 100)).description}
                        </div>
                        
                        <!-- 新しい心理的配慮に基づく詳細解釈 -->
                        <div class="psychological-interpretation engine-interpretation" id="engine-psychological-interpretation">
                            ${this._renderPsychologicalCare(this._interpretEngineScore(engineOS.strength, engineOS.osName))}
                        </div>
                    </div>
                </div>

                <div class="os-aspect-core-values">
                    <h4>🎯 この価値観が大切にしていること</h4>
                    <div class="values-keywords">
                        ${coreKeywords.map(keyword => `<span class="keyword-tag engine-keyword">${keyword}</span>`).join('')}
                    </div>
                    <div class="core-motivation-statement" id="engine-motivation-statement">
                        <div class="ai-placeholder">AI生成: この価値観の核心的な動機</div>
                    </div>
                </div>

                <div class="os-aspect-expressions">
                    <div class="positive-expressions">
                        <h4>✨ この価値観が輝く瞬間</h4>
                        <ul class="expression-list">
                            ${strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="os-aspect-nurturing" id="engine-nurturing">
                        <h4>🌱 この価値観を育てる方法</h4>
                        <div class="ai-placeholder">AI生成: 本質的な価値観を強化する具体的方法</div>
                    </div>
                    
                    <div class="os-aspect-usage">
                        <h4>🏠 この価値観を活かせる場面</h4>
                        <div class="usage-scenarios" id="engine-scenarios">
                            <div class="ai-placeholder">AI生成: 本質的な価値観が活躍できる環境・関係</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // 中央パネル: 社会での自分（インターフェースOS）
    _renderInterfacePanel(interfaceOS, interfaceDetails) {
        const behavioralPatterns = interfaceDetails?.interface?.behavioral_patterns || ['データを読み込み中...'];
        const appearance = interfaceDetails?.interface?.how_it_appears || 'データを読み込み中...';

        return `
        <div class="os-panel interface-panel os-aspect-panel" data-os-type="interface">
            <div class="panel-header">
                <div class="panel-icon">🌐</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">社会での自分</h2>
                    <p class="panel-subtitle">他者と関わる時に現れる、あなたの社交的な顔</p>
                    <p class="os-aspect-explanation">職場や友人関係など、社会の中で役割を果たす時に活躍する自分です</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="os-aspect-identity">
                    <div class="os-aspect-type">
                        <span class="type-label">社会での振る舞いタイプ</span>
                        <h3 class="os-name">${interfaceOS.osName}スタイル</h3>
                    </div>
                    <p class="os-catchphrase">「${interfaceDetails?.catchphrase || interfaceOS.hexagramInfo?.catchphrase || '独特な魅力を持つ人'}」</p>
                    
                    <div class="expression-frequency">
                        <div class="frequency-label">他者との関わりでこのスタイルが現れる頻度</div>
                        <div class="frequency-bar">
                            <div class="frequency-fill" style="width: ${interfaceOS.matchScore || Math.round(interfaceOS.strength * 100)}%"></div>
                        </div>
                        <div class="frequency-value">${this._formatScoreDisplay(interfaceOS.matchScore ? interfaceOS.matchScore / 100 : interfaceOS.strength, 'interface')}</div>
                        <div class="frequency-description">
                            ${this._getInterfaceMatchAdvice(interfaceOS.matchScore || Math.round(interfaceOS.strength * 100)).description}
                        </div>
                        
                        <!-- 新しい心理的配慮に基づく詳細解釈 -->
                        <div class="psychological-interpretation interface-interpretation" id="interface-psychological-interpretation">
                            ${this._renderPsychologicalCare(this._interpretInterfaceScore(interfaceOS.matchScore || interfaceOS.strength, interfaceOS.osName))}
                        </div>
                    </div>
                </div>

                <div class="os-aspect-social-style">
                    <h4>🎭 この自分の社会的な振る舞い</h4>
                    <p class="social-description">${appearance}</p>
                    
                    <div class="behavioral-patterns">
                        <h5>典型的な行動パターン</h5>
                        <ul class="pattern-list">
                            ${behavioralPatterns.map(pattern => `<li>${pattern}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="os-aspect-social-optimization">
                    <div class="optimal-environments" id="interface-optimal-roles">
                        <h4>🎯 この自分が輝く環境・役割</h4>
                        <div class="ai-placeholder">AI生成: 社会での自分が力を発揮できる具体的な場面</div>
                    </div>

                    <div class="relationship-dynamics" id="interface-relationship-dynamics">
                        <h4>🤝 人間関係での特徴</h4>
                        <div class="ai-placeholder">AI生成: この自分が築く人間関係の特徴</div>
                    </div>

                    <div class="growth-areas" id="interface-growth-areas">
                        <h4>📈 この自分の成長ポイント</h4>
                        <div class="ai-placeholder">AI生成: 社会での自分をより効果的に活用する方法</div>
                    </div>
                </div>

                <div class="os-aspect-balance">
                    <h4>⚖️ 本質的な自分との関係</h4>
                    <div class="balance-indicator" id="interface-balance-indicator">
                        <div class="ai-placeholder">AI生成: 本質的な価値観と社会的な顔のバランス分析</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // 右パネル: 守る力を持つ自分（セーフモードOS）
    _renderSafeModePanel(safeModeOS, safeModeDetails) {
        const triggerSituations = safeModeDetails?.safe_mode?.trigger_situations || ['データを読み込み中...'];
        const defensivePatterns = safeModeDetails?.safe_mode?.defensive_patterns || ['データを読み込み中...'];
        const internalState = safeModeDetails?.safe_mode?.internal_state || 'データを読み込み中...';

        return `
        <div class="os-panel safemode-panel os-aspect-panel" data-os-type="safemode">
            <div class="panel-header">
                <div class="panel-icon">🛡️</div>
                <div class="panel-title-group">
                    <h2 class="panel-title">守る力を持つ自分</h2>
                    <p class="panel-subtitle">大切なものを守る時に現れる、賢明で慎重な判断力</p>
                    <p class="os-aspect-explanation">困難な状況や重要な判断の際に現れ、あなたの大切なものを守ろうとする自分です</p>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="os-aspect-identity">
                    <div class="os-aspect-type">
                        <span class="type-label">保護力タイプ</span>
                        <h3 class="os-name">${safeModeOS.osName}モード</h3>
                    </div>
                    <p class="os-catchphrase">「${safeModeDetails?.catchphrase || safeModeOS.hexagramInfo?.catchphrase || '大切なものを守る知恵を持つ人'}」</p>
                    
                    <div class="defense-activation">
                        <div class="activation-label">重要な判断でこの保護力が現れる頻度</div>
                        <div class="activation-bar">
                            <div class="activation-fill" style="width: ${safeModeOS.matchScore || Math.round(safeModeOS.strength * 100)}%"></div>
                        </div>
                        <div class="activation-value">${this._formatScoreDisplay(safeModeOS.matchScore ? safeModeOS.matchScore / 100 : safeModeOS.strength, 'safemode')}</div>
                        <div class="activation-description">
                            ${this._getSafeModeActivationAdvice(safeModeOS.matchScore || Math.round(safeModeOS.strength * 100)).description}
                        </div>
                    </div>
                </div>

                <div class="safemode-theory-explanation">
                    <h4>🧠 セーフモードOSとは</h4>
                    <div class="theory-content">
                        <p>bunenjin哲学では、私たちが困難や脅威に直面した時、無意識に発動する「保護システム」があると考えます。これは生存のために培った賢明な防御メカニズムであり、決して排除すべき「悪い部分」ではありません。</p>
                        
                        <div class="theory-points">
                            <div class="theory-point">
                                <span class="theory-icon">🔄</span>
                                <div class="point-content">
                                    <strong>発動の原因</strong>
                                    <p>エンジンOS（本質的な自分）とインターフェースOS（社会的な自分）が噛み合わない時、心は危険を察知してセーフモードを発動します</p>
                                </div>
                            </div>
                            <div class="theory-point">
                                <span class="theory-icon">⚖️</span>
                                <div class="point-content">
                                    <strong>短期的なメリット</strong>
                                    <p>緊急事態において、一時的に心を守り、困難な状況を乗り切るための重要な機能として働きます</p>
                                </div>
                            </div>
                            <div class="theory-point">
                                <span class="theory-icon">⚠️</span>
                                <div class="point-content">
                                    <strong>長期化のリスク</strong>
                                    <p>長期間セーフモードが続くと、本来の自分を見失い、抑圧されたエネルギーが衝動的な行動や心身の不調として「暴走」することがあります</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="os-aspect-defensive-wisdom">
                    <h4>🚨 この保護力が働く状況</h4>
                    <div class="trigger-analysis">
                        <div class="external-factors">
                            <h5>🌍 外的要因</h5>
                            <p>社会的な期待、組織のプレッシャー、家庭環境など、「こうあるべき」という外部からの力</p>
                        </div>
                        <div class="internal-factors">
                            <h5>💭 内的要因</h5>
                            <p>過去の成功・失敗体験から生まれた「こうしなければならない」という自己制約や思い込み</p>
                        </div>
                    </div>
                    <ul class="trigger-list">
                        ${triggerSituations.map(trigger => `<li><span class="trigger-icon">⚠️</span>${trigger}</li>`).join('')}
                    </ul>
                    
                    <div class="inner-experience">
                        <h5>💭 その時の内面体験</h5>
                        <p class="state-description">${internalState}</p>
                    </div>
                </div>

                <div class="os-aspect-defensive-actions">
                    <h4>🛡️ この保護力の具体的な行動</h4>
                    <ul class="defense-behavior-list">
                        ${defensivePatterns.map(pattern => `<li><span class="defense-icon">🔒</span>${pattern}</li>`).join('')}
                    </ul>
                    
                    <div class="runaway-warning">
                        <h5>⚠️ 「暴走」の具体例</h5>
                        <div class="runaway-examples">
                            <div class="runaway-category">
                                <span class="runaway-icon">💥</span>
                                <strong>衝動的な行動</strong>
                                <p>突然の退職、人間関係のリセット、散財など、後先を考えない行動</p>
                            </div>
                            <div class="runaway-category">
                                <span class="runaway-icon">😵</span>
                                <strong>心身の不調</strong>
                                <p>原因不明の体調不良、意欲の低下、感情の麻痺など、自分でもコントロールできない状態</p>
                            </div>
                            <div class="runaway-category">
                                <span class="runaway-icon">😠</span>
                                <strong>他責・攻撃性</strong>
                                <p>周囲の環境や他人に対して過度に批判的になったり、攻撃的になったりする</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="os-aspect-healthy-defense">
                    <div class="healthy-usage" id="safemode-healthy-usage">
                        <h4>✨ この保護力の健全な活用法</h4>
                        <div class="ai-placeholder">AI生成: 守る力を建設的に活用する方法</div>
                    </div>

                    <div class="recovery-guidance" id="safemode-recovery-guidance">
                        <h4>🌱 他の自分への切り替え方法</h4>
                        <div class="ai-placeholder">AI生成: 保護モードから本質的・社会的な自分への復帰方法</div>
                    </div>

                    <div class="os-aspect-integration" id="safemode-integration">
                        <h4>🤝 3つの自分の調和</h4>
                        <div class="ai-placeholder">AI生成: 守る力と他の自分のバランスの取り方</div>
                    </div>
                </div>

                <div class="os-aspect-acceptance">
                    <h4>💝 この保護力への感謝</h4>
                    <div class="acceptance-message">
                        <p>本来のあなた（エンジンOS）と、社会に見せる顔（インターフェースOS）がうまく噛み合わない時、心は危険を察知して『セーフモードOS』を発動します。これは、あなたを傷つけないための緊急避難措置です。</p>
                        <p>しかし、この緊急事態が長く続くと、いつしかセーフモードでいることが当たり前になり、本来の自分がどうしたいのか（エンジンOS）が分からなくなってしまいます。そして、抑圧されたエネルギーは、ある日突然、衝動的な行動や心身の不調といった形で『暴走』を始めるのです。</p>
                        <p><strong>大切なのは、セーフモードOSを悪者にするのではなく、『なぜ今、自分はセーフモードでいる必要があるのか？』と問いかけること。そして、少しずつ本来の自分（エンジンOS）と社会的な役割（インターフェースOS）をすり合わせ、自分らしい生き方を取り戻していくことです。</strong></p>
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

    // === 新しいヘルパーメソッド群（易経の智慧対応） ===

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
                description: "このスタイルは微細に存在し、必要な場面で意識的に活用することで新たな魅力を発見できます。"
            };
        } else if (matchScore >= 10) {
            return {
                level: "潜在的な表現力",
                description: "このスタイルは潜在的に存在し、訓練や意識的な取り組みで開発できる可能性があります。"
            };
        } else {
            return {
                level: "未開発の表現力",
                description: "現在このスタイルは検出レベルが低い状態ですが、他のコミュニケーション方法と組み合わせることで補完できます。"
            };
        }
    }

    // セーフモードOSの発動頻度に基づくアドバイス
    _getSafeModeActivationAdvice(activationScore) {
        if (activationScore >= 70) {
            return {
                level: "高頻度発動",
                description: "重要な判断でよくこの保護力を使います。この力の特徴を理解し、適切に活用することが大切です。"
            };
        } else if (activationScore >= 50) {
            return {
                level: "中頻度発動",
                description: "困難な状況でしばしばこの保護力が現れます。大切なものを守る力として活用しつつ、バランスを保ちましょう。"
            };
        } else if (activationScore >= 30) {
            return {
                level: "低頻度発動",
                description: "この保護力は時々使われます。必要な時の選択肢として理解しておき、他の対処法も併せて活用しましょう。"
            };
        } else if (activationScore >= 10) {
            return {
                level: "稀に発動",
                description: "この保護力はあまり使われません。特に重要な場面での慎重な判断として機能する可能性があります。"
            };
        } else {
            return {
                level: "柔軟適応型",
                description: "固定的な防御パターンを持たない適応型です。状況に応じて最適な対処法を選択する高い柔軟性の証です。型にはまらない創造的な問題解決力を秘めています。"
            };
        }
    }

    // エンジンOSスコアの心理的配慮に基づく詳細解釈
    _interpretEngineScore(score, osName = "価値観") {
        // スコアを0-100の範囲に正規化
        const normalizedScore = Math.max(0, Math.min(100, Math.round(score * 100)));
        
        // 極端に低い値（0-5%）への特別な心理的ケア
        if (normalizedScore <= 5) {
            return {
                level: "探求中の価値観",
                numericDescription: `${normalizedScore}%という数値は、あなたが既存の価値観にとらわれない自由な状態にいることを示します`,
                psychologicalCare: {
                    primary: "固定的な価値観に縛られていない貴重な探求期にあります",
                    strength: "この状態は価値観の「未熟さ」ではなく、様々な可能性を探求できる「開放性」の証です",
                    opportunity: "多様な体験を通じて、あなただけの独自の価値観を構築する絶好の機会です",
                    actionable: "様々な活動や人との出会いを通じて、心から「これだ」と思える価値観を見つける旅を楽しむことができます"
                },
                interpretation: "価値観探求の自由期",
                color: "success",
                icon: "🔍"
            };
        }
        
        // その他のスコア範囲も同様の配慮で処理
        if (normalizedScore <= 15) {
            return {
                level: "発芽期の価値観",
                numericDescription: `${normalizedScore}%は、新しい価値観が芽生え始めていることを示します`,
                psychologicalCare: {
                    primary: "あなたの価値観は今、土の中で静かに芽吹こうとしている種のような状態です",
                    strength: "まだ小さくても、将来大木になる可能性を秘めた価値観の芽があります",
                    opportunity: "この芽を大切に育てることで、強固で美しい価値観の樹を築くことができます",
                    actionable: "日々の小さな選択で「これは心地よい」と感じる方向を意識的に選ぶことで、価値観を育てることができます"
                },
                interpretation: "成長初期の価値観",
                color: "info",
                icon: "🌱"
            };
        }
        
        if (normalizedScore <= 30) {
            return {
                level: "成長期の価値観",
                numericDescription: `${normalizedScore}%は、価値観が着実に形成されつつあることを示します`,
                psychologicalCare: {
                    primary: "あなたの価値観は健全な成長過程にあります",
                    strength: "まだ柔軟性を保ちながらも、核となる部分が形成され始めています",
                    opportunity: "この時期の価値観は、経験により豊かに発展する可能性に満ちています",
                    actionable: "様々な体験を積極的に受け入れながら、自分の心の声に耳を傾けることで価値観を深めることができます"
                },
                interpretation: "発展期の価値観",
                color: "primary",
                icon: "🌿"
            };
        }
        
        return this._getStandardScoreInterpretation(normalizedScore, "価値観", "engine");
    }

    // インターフェースOSスコアの心理的配慮に基づく詳細解釈  
    _interpretInterfaceScore(score, osName = "表現力") {
        // スコアを0-100の範囲に正規化
        const normalizedScore = Math.max(0, Math.min(100, Math.round(score * 100)));
        
        // 極端に低い値（0-5%）への特別な心理的ケア
        if (normalizedScore <= 5) {
            return {
                level: "内向的な魅力",
                numericDescription: `${normalizedScore}%という数値は、あなたが内面重視の独特な魅力を持つことを示します`,
                psychologicalCare: {
                    primary: "表面的な社交性よりも、深く真実な関係を好む貴重な特性があります",
                    strength: "この控えめさは「不足」ではなく、質の高い人間関係を築く能力の表れです",
                    opportunity: "少数の深い関係の中で、あなたの真の魅力が最大限に発揮されます",
                    actionable: "無理に外向的になろうとせず、あなたらしい自然な関わり方を大切にすることで、本当に合う人との出会いが生まれます"
                },
                interpretation: "深層的コミュニケーター",
                color: "success",
                icon: "💎"
            };
        }
        
        if (normalizedScore <= 15) {
            return {
                level: "選択的な表現力",
                numericDescription: `${normalizedScore}%は、あなたが慎重で選択的な表現スタイルを持つことを示します`,
                psychologicalCare: {
                    primary: "必要な時に的確に表現する、効率的なコミュニケーション能力があります",
                    strength: "無駄な社交に時間を費やさず、本当に大切な時に力を発揮する賢明さを持っています",
                    opportunity: "この選択的なスタイルは、信頼性と誠実さを印象づける貴重な特徴です",
                    actionable: "自分のペースを大切にしながら、興味のある分野や人との交流を深めることで表現力を育てることができます"
                },
                interpretation: "戦略的コミュニケーター",
                color: "info", 
                icon: "🎯"
            };
        }
        
        return this._getStandardScoreInterpretation(normalizedScore, "表現力", "interface");
    }

    // 標準的なスコア解釈（中程度から高い値用）
    _getStandardScoreInterpretation(score, typeName, osType) {
        if (score <= 50) {
            return {
                level: `バランス型の${typeName}`,
                numericDescription: `${score}%は、この${typeName}がバランス良く機能していることを示します`,
                psychologicalCare: {
                    primary: `適度で健全な${typeName}を維持しています`,
                    strength: `過剰でも不足でもない、調和の取れた${typeName}を持っています`,
                    opportunity: `この中庸なレベルは、様々な状況に柔軟に対応できる理想的なバランスです`,
                    actionable: `現在のバランスを維持しつつ、必要に応じて強化することで更なる成長が期待できます`
                },
                interpretation: `調和型の${typeName}`,
                color: "primary",
                icon: "⚖️"
            };
        } else if (score <= 70) {
            return {
                level: `確立された${typeName}`,
                numericDescription: `${score}%は、この${typeName}がしっかりと確立されていることを示します`,
                psychologicalCare: {
                    primary: `信頼できる${typeName}の基盤を持っています`,
                    strength: `多くの場面でこの${typeName}が安定して機能しています`,
                    opportunity: `この確立された${typeName}を活かし、より高度な表現や行動が可能です`,
                    actionable: `この${typeName}を基盤として、新しい挑戦や表現方法を探求することができます`
                },
                interpretation: `安定した${typeName}`,
                color: "success",
                icon: "🏗️"
            };
        } else if (score <= 85) {
            return {
                level: `強固な${typeName}`,
                numericDescription: `${score}%は、この${typeName}が非常に発達していることを示します`,
                psychologicalCare: {
                    primary: `高度に発達した${typeName}を持ち、多くの場面で力を発揮できます`,
                    strength: `この${typeName}は、あなたの重要な強みとして機能しています`,
                    opportunity: `この強い${typeName}を活かし、他者の成長や支援にも貢献できる可能性があります`,
                    actionable: `この${typeName}をさらに洗練させつつ、バランスの取れた全人格的な成長を目指すことができます`
                },
                interpretation: `高度な${typeName}`,
                color: "warning",
                icon: "💪"
            };
        } else {
            return {
                level: `卓越した${typeName}`,
                numericDescription: `${score}%は、この${typeName}が卓越したレベルに達していることを示します`,
                psychologicalCare: {
                    primary: `非常に稀有な、卓越した${typeName}を持っています`,
                    strength: `この${typeName}は、あなたの人生における最大の資産の一つです`,
                    opportunity: `この卓越した${typeName}を通じて、社会や周囲の人々に大きな影響を与えることができます`,
                    actionable: `この貴重な${typeName}を責任を持って活用し、自分だけでなく他者の成長にも貢献することができます`
                },
                interpretation: `マスタークラスの${typeName}`,
                color: "danger",
                icon: "👑"
            };
        }
    }

    // 数値表示の心理的配慮に基づくフォーマット
    _formatScoreDisplay(score, osType) {
        const normalizedScore = Math.max(0, Math.min(100, Math.round(score * 100)));
        
        // 極端に低い値（0-10%）には特別な表現を提供
        if (normalizedScore <= 10) {
            const encouragementTexts = {
                'engine': {
                    low: '探求中',
                    context: '新たな価値観を模索中です'
                },
                'interface': {
                    low: '内向型',
                    context: '深い関係を好む特性があります'
                },
                'safemode': {
                    low: '柔軟型',
                    context: '適応的な対処力があります'
                }
            };
            
            const typeData = encouragementTexts[osType] || encouragementTexts['engine'];
            return `<span class="score-number">${normalizedScore}%</span><span class="score-context">(${typeData.low}: ${typeData.context})</span>`;
        }
        
        // 通常の表示
        return `<span class="score-number">${normalizedScore}%</span>`;
    }

    // セーフモードOSスコアの心理的配慮に基づく詳細解釈
    _interpretSafeModeScore(score, osName = "保護力") {
        // スコアを0-100の範囲に正規化
        const normalizedScore = Math.max(0, Math.min(100, Math.round(score * 100)));
        
        // 極端に低い値（0-5%）への特別な心理的ケア
        if (normalizedScore <= 5) {
            return {
                level: "内在する無限の可能性",
                numericDescription: `${normalizedScore}%という数値は、この保護パターンが固定化されていない証拠です`,
                psychologicalCare: {
                    primary: "あなたは既存の防御パターンに縛られない、極めて貴重な柔軟性を持っています",
                    strength: "このスコアは「欠如」ではなく「自由度の高さ」を意味します。状況に応じて最適な対処法を創造的に選択できる能力の表れです",
                    opportunity: "固定的なパターンがないということは、あらゆる可能性に開かれているということ。この柔軟性こそが、予測不可能な現代社会での最大の武器になります",
                    actionable: "この自由度を活かし、様々な対処法を試行錯誤することで、あなただけの独創的な問題解決スタイルを築くことができます"
                },
                interpretation: "極めて高い創造的適応力",
                color: "success", // 成長可能性を示すポジティブな色
                icon: "🌟"
            };
        }
        
        // 非常に低い値（6-15%）への心理的配慮
        if (normalizedScore <= 15) {
            return {
                level: "潜在的な適応力",
                numericDescription: `${normalizedScore}%は、この保護パターンが軽微に存在することを示しています`,
                psychologicalCare: {
                    primary: "この数値は「弱さ」ではなく、他の強みに頼る賢明さの表れです",
                    strength: "固定的な防御パターンに依存せず、より建設的で柔軟な対処法を無意識に選択している証拠です",
                    opportunity: "このパターンを必要とする場面は限られていますが、いざという時の予備戦力として機能する可能性があります",
                    actionable: "普段は他の対処法を使いつつ、特別な状況でこの保護力を意識的に活用する選択肢として捉えることができます"
                },
                interpretation: "柔軟性重視の適応型",
                color: "info",
                icon: "🎯"
            };
        }
        
        // 低い値（16-30%）への配慮
        if (normalizedScore <= 30) {
            return {
                level: "選択的な保護力",
                numericDescription: `${normalizedScore}%は、この保護パターンが控えめに機能していることを示します`,
                psychologicalCare: {
                    primary: "必要最小限で効率的な保護システムを持っています",
                    strength: "過度な防御に頼らず、状況を適切に判断して必要な時にのみ保護力を発動する知恵があります",
                    opportunity: "この選択的な発動パターンは、エネルギーの無駄遣いを避ける効率的な心理システムです",
                    actionable: "この保護力を「温存された力」として理解し、本当に必要な時のために取っておく戦略的思考として活用できます"
                },
                interpretation: "効率的な保護システム",
                color: "primary",
                icon: "🎖️"
            };
        }
        
        // 中程度の値（31-50%）
        if (normalizedScore <= 50) {
            return {
                level: "バランス型の保護力",
                numericDescription: `${normalizedScore}%は、この保護パターンがバランス良く機能していることを示します`,
                psychologicalCare: {
                    primary: "適度で健全な保護システムを維持しています",
                    strength: "過剰でも不足でもない、調和の取れた防御機能を持っています",
                    opportunity: "この中庸な発動レベルは、様々な状況に柔軟に対応できる理想的なバランスです",
                    actionable: "現在のバランスを維持しつつ、必要に応じて他の対処法と組み合わせることで更なる成長が期待できます"
                },
                interpretation: "調和の取れた保護システム",
                color: "primary",
                icon: "⚖️"
            };
        }
        
        // やや高い値（51-70%）
        if (normalizedScore <= 70) {
            return {
                level: "積極的な保護力",
                numericDescription: `${normalizedScore}%は、この保護パターンが積極的に機能していることを示します`,
                psychologicalCare: {
                    primary: "大切なものを守る強い意志と能力を持っています",
                    strength: "困難な状況でもしっかりと自分や大切な人を守る頼もしい力があります",
                    opportunity: "この保護力を建設的に活用することで、安心できる環境づくりに貢献できます",
                    actionable: "この力を防御だけでなく、積極的な保護と支援のために活用することで、より豊かな人間関係を築けます"
                },
                interpretation: "信頼できる保護システム",
                color: "success",
                icon: "🛡️"
            };
        }
        
        // 高い値（71-85%）
        if (normalizedScore <= 85) {
            return {
                level: "強固な保護力",
                numericDescription: `${normalizedScore}%は、この保護パターンが高い頻度で発動していることを示します`,
                psychologicalCare: {
                    primary: "非常に発達した保護システムを持ち、安全を重視する賢明さがあります",
                    strength: "困難や脅威に対して確実に対処できる、信頼性の高い防御能力があります",
                    opportunity: "この強い保護力を活かし、他者の安全や安心も支えることができる指導力を秘めています",
                    actionable: "時には他の対処法も試しながら、この保護力を戦略的に活用することで、より効果的な問題解決が可能になります"
                },
                interpretation: "高度に発達した保護システム",
                color: "warning",
                icon: "🏰"
            };
        }
        
        // 非常に高い値（86-100%）
        return {
            level: "最高レベルの保護力",
            numericDescription: `${normalizedScore}%は、この保護パターンが最高レベルで機能していることを示します`,
            psychologicalCare: {
                primary: "完全に発達した保護システムを持ち、あらゆる困難に対処できる力があります",
                strength: "この保護力は、あなたが人生で培った知恵と経験の結晶です。それだけ多くの困難を乗り越えてきた証拠でもあります",
                opportunity: "この強力な保護力を、自分だけでなく周囲の人々の安全と成長のために活用することで、真の指導者となれる可能性があります",
                actionable: "時にはこの保護力を休ませ、他の自分（エンジンOSやインターフェースOS）が表現される余地を作ることで、より豊かな人生体験が得られます"
            },
            interpretation: "最高レベルの守護能力",
            color: "danger", // 注意深く扱う必要があることを示す
            icon: "👑"
        };
    }

    // 心理的配慮に基づく詳細解釈のHTML生成
    _renderPsychologicalCare(interpretation) {
        return `
            <div class="interpretation-header">
                <span class="interpretation-icon">${interpretation.icon}</span>
                <h5 class="interpretation-level">${interpretation.level}</h5>
            </div>
            
            <div class="numeric-description">
                ${interpretation.numericDescription}
            </div>
            
            <div class="psychological-care">
                <div class="care-section primary">
                    <div class="care-label">基本評価</div>
                    <div class="care-content">${interpretation.psychologicalCare.primary}</div>
                </div>
                
                <div class="care-section strength">
                    <div class="care-label">強みの視点</div>
                    <div class="care-content">${interpretation.psychologicalCare.strength}</div>
                </div>
                
                <div class="care-section opportunity">
                    <div class="care-label">機会として</div>
                    <div class="care-content">${interpretation.psychologicalCare.opportunity}</div>
                </div>
                
                <div class="care-section actionable">
                    <div class="care-label">具体的活用法</div>
                    <div class="care-content">${interpretation.psychologicalCare.actionable}</div>
                </div>
            </div>
        `;
    }
}

// クラスをグローバルスコープに登録
if (typeof window !== 'undefined') {
    window.TripleOSStrategicView = TripleOSStrategicView;
}