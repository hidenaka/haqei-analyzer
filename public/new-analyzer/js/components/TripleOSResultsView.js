class TripleOSResultsView extends BaseComponent {
    constructor(containerId, options) {
        // 1. まず、親クラスのコンストラクタを呼び出し、自分自身(this)を確立します。
        super(containerId, options); 
        
        // ★★★ これで 'this' が安全に使えるようになります ★★★

        // 2. 確立された自分自身に、財産(データ)をセットします。
        this.analysisResult = options.analysisResult;
        this.insights = options.insights;
        this.compatibilityLoader = options.compatibilityLoader;
        this.dataManager = options.dataManager;
        this.compatibilityAnalysisData = null;
        this.radarChart = null;

        // 3. ログで到着確認
        console.log("🕵️‍♂️ [TRACE-CHECKPOINT 3] TripleOSResultsViewが受け取ったオプション内容を検証します。", options);
        if (this.compatibilityLoader && this.dataManager) {
            console.log("✅ [TripleOSResultsView] 全ての必須コンポーネントが正常に到着しました。");
        } else {
            console.error("❌ [TripleOSResultsView] 致命的エラー: 必須コンポーネントが不足しています。");
        }
    }

    // 初期化メソッドを追加
    async init() {
        console.log("🚀 [TripleOSResultsView] Initializing...");
        await this.render();
        console.log("✅ [TripleOSResultsView] Initialization completed.");
    }

    async render() {
        console.log("🎨 [TripleOSResultsView] Render process started.");
        
        // renderの冒頭で、データが存在することを再度確認する
        if (!this.analysisResult) {
            this.container.innerHTML = `<div class="error-text">分析結果データがありません。</div>`;
            console.error("❌ Render failed: this.analysisResult is not available.");
            return;
        }

        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;

        // データがなければフォールバック表示
        if (!engineOS || !interfaceOS || !safeModeOS) {
            this.container.innerHTML = `<p class="error-text">分析結果のデータが不完全です。</p>`;
            return;
        }

        const engineDetails = engineOS.hexagramId ? this.dataManager.getHexagramDetails(engineOS.hexagramId) : null;
        const interfaceDetails = interfaceOS.hexagramId ? this.dataManager.getHexagramDetails(interfaceOS.hexagramId) : null;
        const safeModeDetails = safeModeOS.hexagramId ? this.dataManager.getHexagramDetails(safeModeOS.hexagramId) : null;

        const engineStrengths = engineDetails?.potential_strengths?.map(s => `<li>${s}</li>`).join('') || '<li>情報なし</li>';
        const engineWeaknesses = engineDetails?.potential_weaknesses?.map(w => `<li>${w}</li>`).join('') || '<li>情報なし</li>';
        
        const interfaceStrengths = interfaceDetails?.potential_strengths?.map(s => `<li>${s}</li>`).join('') || '<li>情報なし</li>';
        const interfaceWeaknesses = interfaceDetails?.potential_weaknesses?.map(w => `<li>${w}</li>`).join('') || '<li>情報なし</li>';

        const safeModeStrengths = safeModeDetails?.potential_strengths?.map(s => `<li>${s}</li>`).join('') || '<li>情報なし</li>';
        const safeModeWeaknesses = safeModeDetails?.potential_weaknesses?.map(w => `<li>${w}</li>`).join('') || '<li>情報なし</li>';

        const html = `
        <div class="results-view-final">
            <section class="summary-hero">
                <div class="hero-text">
                    <h1 class="archetype-title">${engineOS.osName}の人</h1>
                    <p class="archetype-catchphrase">${engineOS.hexagramInfo.catchphrase}</p>
                </div>
                <div class="chart-container">
                    <canvas id="profile-radar-chart"></canvas>
                </div>
            </section>

            <section class="os-cards-section">
                <h2 class="section-title">あなたの3層人格OS</h2>
                <div class="os-cards-container">
                    <div class="os-card" data-os-type="engine">
                        <div class="os-card-header">
                            <div class="os-icon">🔧</div>
                            <div class="os-label-group"><h3>エンジンOS</h3><p>核となる価値観と動機</p></div>
                            <div class="os-score-group"><div class="os-name">${engineOS.osName}</div><div class="os-score">${Math.round(engineOS.strength * 100)}%</div></div>
                            <span class="expand-icon">+</span>
                        </div>
                        <div class="os-card-body"><h4>潜在的な強み</h4><ul>${engineStrengths}</ul><h4>成長の課題</h4><ul>${engineWeaknesses}</ul></div>
                    </div>
                    <div class="os-card" data-os-type="interface">
                         <div class="os-card-header">
                            <div class="os-icon">🖥️</div>
                            <div class="os-label-group"><h3>インターフェースOS</h3><p>外面的な行動パターン</p></div>
                            <div class="os-score-group"><div class="os-name">${interfaceOS.osName}</div><div class="os-score">${interfaceOS.matchScore}%</div></div>
                            <span class="expand-icon">+</span>
                        </div>
                        <div class="os-card-body"><h4>潜在的な強み</h4><ul>${interfaceStrengths}</ul><h4>成長の課題</h4><ul>${interfaceWeaknesses}</ul></div>
                    </div>
                    <div class="os-card" data-os-type="safemode">
                        <div class="os-card-header">
                            <div class="os-icon">🛡️</div>
                            <div class="os-label-group"><h3>セーフモードOS</h3><p>内面的な防御機制</p></div>
                            <div class="os-score-group"><div class="os-name">${safeModeOS.osName}</div><div class="os-score">${safeModeOS.matchScore}%</div></div>
                            <span class="expand-icon">+</span>
                        </div>
                        <div class="os-card-body"><h4>潜在的な強み</h4><ul>${safeModeStrengths}</ul><h4>成長の課題</h4><ul>${safeModeWeaknesses}</ul></div>
                    </div>
                </div>
            </section>

            <section class="dynamics-section">
                <h2 class="section-title">内なる力学</h2>
                <div class="dynamics-cards-container">
                    <div id="interface-dynamics-card-container"></div>
                    <div id="safemode-dynamics-card-container"></div>
                </div>
            </section>
        </div>
        `;
        this.container.innerHTML = html;
        console.log("✅ [TripleOSResultsView] Main analysis HTML has been rendered to the DOM.");
        await this._postRender();
    }

    async _postRender() {
        this._renderRadarChart();
        this._bindEventListeners();
        await this._loadAndRenderDynamics(); // 非同期処理の完了を待つ
        console.log("✅ [TripleOSResultsView] All post-render tasks completed.");
    }

    _renderRadarChart() {
        // レーダーチャートの描画処理（Chart.js読み込み確認付き）
        const radarCanvas = document.getElementById('profile-radar-chart');
        if (!radarCanvas) {
            console.warn("⚠️ [TripleOSResultsView] Radar chart canvas not found");
            return;
        }

        // Chart.js読み込み確認
        if (typeof Chart === 'undefined') {
            console.error("❌ [TripleOSResultsView] Chart.js library not loaded - CDN may have failed");
            // Chart.js未読み込みの場合はプレースホルダー表示
            radarCanvas.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 300px;
                background: var(--primary-700);
                border: 2px solid var(--primary-600);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary-200);
                font-size: 14px;
                text-align: center;
                padding: 20px;
            `;
            placeholder.innerHTML = '📊 レーダーチャート<br>（ライブラリ読み込み中...）';
            radarCanvas.parentNode.insertBefore(placeholder, radarCanvas);
            return;
        }

        try {
            // Chart.jsを使用してレーダーチャートを描画
            const ctx = radarCanvas.getContext('2d');
            const { engineOS } = this.analysisResult;
            
            if (engineOS && engineOS.vector) {
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['創造性', '行動性', '探求性', '安定性', '受容性', '適応性', '表現性', '調和性'],
                        datasets: [{
                            label: 'あなたの人格プロファイル',
                            data: [
                                engineOS.vector['乾_創造性'] || 0,
                                engineOS.vector['震_行動性'] || 0,
                                engineOS.vector['坎_探求性'] || 0,
                                engineOS.vector['艮_安定性'] || 0,
                                engineOS.vector['坤_受容性'] || 0,
                                engineOS.vector['巽_適応性'] || 0,
                                engineOS.vector['離_表現性'] || 0,
                                engineOS.vector['兌_調和性'] || 0
                            ],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 10
                            }
                        }
                    }
                });
                console.log("✅ [TripleOSResultsView] Radar chart rendered successfully");
            }
        } catch (error) {
            console.error("❌ [TripleOSResultsView] Chart rendering failed:", error);
            // エラー時もプレースホルダー表示
            radarCanvas.style.display = 'none';
            const errorPlaceholder = document.createElement('div');
            errorPlaceholder.style.cssText = `
                width: 100%;
                height: 300px;
                background: var(--primary-700);
                border: 2px solid var(--primary-600);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary-200);
                font-size: 14px;
                text-align: center;
                padding: 20px;
            `;
            errorPlaceholder.innerHTML = '📊 レーダーチャート<br>（描画エラー発生）';
            radarCanvas.parentNode.insertBefore(errorPlaceholder, radarCanvas);
        }
    }

    _bindEventListeners() {
        console.log("🔗 [TripleOSResultsView] Binding event listeners...");
        
        // OSカードの展開機能
        const expandIcons = this.container.querySelectorAll('.expand-icon');
        expandIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const card = e.target.closest('.os-card');
                const body = card.querySelector('.os-card-body');
                
                if (body.style.display === 'none' || !body.style.display) {
                    body.style.display = 'block';
                    icon.textContent = '-';
                } else {
                    body.style.display = 'none';
                    icon.textContent = '+';
                }
            });
        });
    }

    async _loadAndRenderDynamics() {
        console.log("🔄 [TripleOSResultsView] Loading inner dynamics data...");
        if (!this.compatibilityLoader) {
            console.error("❌ Inner dynamics cannot be loaded: compatibilityLoader is missing.");
            return;
        }

        try {
            const { interfaceOS, safeModeOS } = this.analysisResult;
            
            // インターフェース動力学データの読み込み
            if (interfaceOS && interfaceOS.hexagramId) {
                console.log(`🔄 [TripleOSResultsView] Loading interface data for hexagramId: ${interfaceOS.hexagramId}`);
                const interfaceData = await this.compatibilityLoader.loadEngineInterfaceCompatibility(interfaceOS.hexagramId);
                if (interfaceData) {
                    const interfaceHtml = this._renderInterfaceHtml(interfaceData, interfaceOS.hexagramId);
                    const interfaceContainer = document.getElementById('interface-dynamics-card-container');
                    if (interfaceContainer) {
                        interfaceContainer.innerHTML = interfaceHtml;
                    }
                }
            } else {
                console.warn("⚠️ [TripleOSResultsView] Interface OS hexagramId is null or undefined, skipping interface dynamics loading");
                const interfaceContainer = document.getElementById('interface-dynamics-card-container');
                if (interfaceContainer) {
                    interfaceContainer.innerHTML = '<p class="warning-text">インターフェースOSの分析データが不足しているため、動力学データを読み込めませんでした。</p>';
                }
            }

            // セーフモード動力学データの読み込み
            if (safeModeOS && safeModeOS.hexagramId) {
                console.log(`🔄 [TripleOSResultsView] Loading safemode data for hexagramId: ${safeModeOS.hexagramId}`);
                const safemodeData = await this.compatibilityLoader.loadEngineSafemodeCompatibility(safeModeOS.hexagramId);
                if (safemodeData) {
                    const safemodeHtml = this._renderSafemodeHtml(safemodeData, safeModeOS.hexagramId);
                    const safemodeContainer = document.getElementById('safemode-dynamics-card-container');
                    if (safemodeContainer) {
                        safemodeContainer.innerHTML = safemodeHtml;
                    }
                }
            } else {
                console.warn("⚠️ [TripleOSResultsView] SafeMode OS hexagramId is null or undefined, skipping safemode dynamics loading");
                const safemodeContainer = document.getElementById('safemode-dynamics-card-container');
                if (safemodeContainer) {
                    safemodeContainer.innerHTML = '<p class="warning-text">セーフモードOSの分析データが不足しているため、動力学データを読み込めませんでした。</p>';
                }
            }

            console.log("✅ [TripleOSResultsView] Inner dynamics data loaded and rendered.");
        } catch (error) {
            console.error("❌ [TripleOSResultsView] Error loading dynamics data:", error);
        }
    }

    _renderInterfaceHtml(data, interfaceOsId) {
        console.log("🔍 [TripleOSResultsView] Interface data structure:", data);
        const interfaceCombinations = data?.internal_team_analysis?.interface_combinations;
        if (!data || !interfaceCombinations || !Array.isArray(interfaceCombinations)) {
            console.warn("⚠️ [TripleOSResultsView] Interface data missing or invalid structure:", {data, interfaceCombinations});
            return '<p class="error-text">インターフェース動力学データを読み込めませんでした。</p>';
        }

        return `
        <div class="dynamics-card interface-dynamics">
            <h3>インターフェース動力学</h3>
            <p>外面的な行動パターンの詳細分析</p>
            <div class="dynamics-content">
                ${interfaceCombinations.slice(0, 5).map(item => `
                    <div class="interface-item">
                        <h4>${item.combination_name || 'インターフェース組み合わせ'}</h4>
                        <p>${item.summary || item.description || '詳細分析データ'}</p>
                        <div class="score">適合度: ${Math.round((item.score || item.compatibility_score || 0) * 100)}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }

    _renderSafemodeHtml(data, safemodeOsId) {
        console.log("🔍 [TripleOSResultsView] Safemode data structure:", data);
        const safemodeCombinations = data?.internal_team_analysis?.safemode_combinations;
        if (!data || !safemodeCombinations || !Array.isArray(safemodeCombinations)) {
            console.warn("⚠️ [TripleOSResultsView] Safemode data missing or invalid structure:", {data, safemodeCombinations});
            return '<p class="error-text">セーフモード動力学データを読み込めませんでした。</p>';
        }

        return `
        <div class="dynamics-card safemode-dynamics">
            <h3>セーフモード動力学</h3>
            <p>内面的な防御機制の詳細分析</p>
            <div class="dynamics-content">
                ${safemodeCombinations.slice(0, 5).map(item => `
                    <div class="safemode-item">
                        <h4>${item.combination_name || 'セーフモード組み合わせ'}</h4>
                        <p>${item.summary || item.description || '詳細分析データ'}</p>
                        <div class="score">適合度: ${Math.round((item.score || item.compatibility_score || 0) * 100)}%</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }
}