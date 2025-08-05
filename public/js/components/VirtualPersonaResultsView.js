/**
 * VirtualPersonaResultsView.js - 仮想人格結果表示システム
 * 
 * 目的：
 * - Triple OSを3つの易経卦として視覚化
 * - 仮想人格をキャラクター的存在として提示
 * - bunenjin哲学に基づく複数人格の客観的観察
 * - インタラクティブな自己探索体験の提供
 * 
 * 設計思想：
 * - ユーザーは「自分を分析する」のではなく「仮想キャラクターを理解する」
 * - 3つのOSは独立した人格として表現される
 * - 易経の知恵とモダンUIの融合による美的体験
 * 
 * @version 1.0.0
 * @date 2025-08-04
 * @author bunenjin-strategy-navigator
 */

class VirtualPersonaResultsView {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = options;
        
        // 分析結果データ
        this.analysisResult = options.analysisResult || null;
        this.insights = options.insights || null;
        
        // 現在選択されているOS
        this.selectedOS = null;
        
        // アニメーション状態
        this.isAnimating = false;
        
        console.log('🎭 VirtualPersonaResultsView initialized with bunenjin philosophy');
    }
    
    /**
     * 初期化処理
     */
    async init() {
        try {
            // データの存在確認
            if (!this.analysisResult) {
                console.error('❌ Analysis result is required for VirtualPersonaResultsView');
                throw new Error('分析結果が見つかりません');
            }
            
            console.log('🎭 VirtualPersonaResultsView: データ検証完了');
            console.log('📊 Analysis data:', {
                hasEngineOS: !!this.analysisResult.engineOS,
                hasInterfaceOS: !!this.analysisResult.interfaceOS,
                hasSafeModeOS: !!this.analysisResult.safeModeOS
            });
            
            return true;
        } catch (error) {
            console.error('❌ VirtualPersonaResultsView initialization failed:', error);
            this.showError('初期化に失敗しました: ' + error.message);
            return false;
        }
    }
    
    /**
     * メイン表示処理
     */
    async show() {
        try {
            if (!this.container) {
                throw new Error(`Container with ID "${this.containerId}" not found`);
            }
            
            // コンテナを表示状態に設定
            this.container.style.display = 'flex';
            this.container.style.opacity = '0';
            this.container.classList.add('visible');
            
            // メインUIをレンダリング
            this.render();
            
            // フェードイン効果
            await this.fadeIn();
            
            // 初期アニメーション開始
            await this.playIntroAnimation();
            
            console.log('✅ VirtualPersonaResultsView displayed successfully');
            
        } catch (error) {
            console.error('❌ VirtualPersonaResultsView show failed:', error);
            this.showError('表示処理に失敗しました: ' + error.message);
        }
    }
    
    /**
     * メイン UI レンダリング
     */
    render() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        
        this.container.innerHTML = `
            <div class="virtual-persona-container">
                <!-- ナビゲーション -->
                <nav class="vp-navigation">
                    <div class="vp-nav-brand">
                        <h1 class="vp-nav-title">Virtual Persona Analysis</h1>
                        <p class="vp-nav-subtitle">あなたの内なる三つの人格を客観視する</p>
                    </div>
                    <div class="vp-nav-controls">
                        <button class="vp-nav-button active" data-view="main">
                            <span class="icon">👥</span>
                            メイン
                        </button>
                        <button class="vp-nav-button" data-view="dialogue">
                            <span class="icon">💬</span>
                            対話
                        </button>
                        <button class="vp-nav-button" data-view="guidance">
                            <span class="icon">🧭</span>
                            ガイダンス
                        </button>
                    </div>
                </nav>
                
                <!-- メインコンテンツ -->
                <main class="vp-main-content">
                    <!-- メインビュー -->
                    <div class="vp-view active" id="vp-main-view">
                        <div class="vp-main-container">
                            <!-- 中央の仮想人格表示 -->
                            <div class="vp-persona-center">
                                <div class="vp-persona-core">
                                    <h2 class="vp-persona-title">仮想人格 "${this.generatePersonaName()}"</h2>
                                    <p class="vp-persona-subtitle">三つのOSが協調する複合的存在</p>
                                </div>
                                
                                <!-- 3つのOSを三角形配置 -->
                                <div class="vp-os-triangle" id="vp-os-triangle">
                                    ${this.renderOSCard(engineOS, 'engine')}
                                    ${this.renderOSCard(interfaceOS, 'interface')}
                                    ${this.renderOSCard(safeModeOS, 'safemode')}
                                    
                                    <!-- 関係性を示すキャンバス -->
                                    <canvas class="vp-relationship-canvas" id="vp-relationship-canvas"></canvas>
                                </div>
                                
                                <!-- 易経メタファー表示 -->
                                <div class="vp-metaphor-section">
                                    <h3>易経による人格解釈</h3>
                                    <div class="vp-metaphor-content" id="vp-metaphor-content">
                                        ${this.generateMetaphorContent()}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- サイドパネル -->
                            <div class="vp-side-panel">
                                <!-- バランスチャート -->
                                <div class="vp-chart-section">
                                    <h3>OS バランス</h3>
                                    <canvas id="os-balance-chart"></canvas>
                                </div>
                                
                                <!-- 統合レベル -->
                                <div class="vp-integration-section">
                                    <h3>統合レベル</h3>
                                    <div class="vp-integration-meter">
                                        <div class="vp-integration-fill" style="width: ${this.calculateIntegrationLevel()}%"></div>
                                    </div>
                                    <p class="vp-integration-text">${this.getIntegrationDescription()}</p>
                                </div>
                                
                                <!-- アクションボタン -->
                                <div class="vp-action-buttons">
                                    <button class="vp-action-button primary" onclick="virtualPersonaView.startDialogue()">
                                        <span class="icon">💬</span>
                                        人格と対話する
                                    </button>
                                    <button class="vp-action-button secondary" onclick="virtualPersonaView.generateReport()">
                                        <span class="icon">📊</span>
                                        詳細レポート
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 対話ビュー -->
                    <div class="vp-view" id="vp-dialogue-view">
                        <div class="vp-dialogue-container">
                            <h2 class="vp-dialogue-title">Virtual Persona との対話</h2>
                            <p class="vp-dialogue-subtitle">各OSと個別に対話して理解を深めましょう</p>
                            
                            <div class="vp-scenario-selection">
                                <h3>対話シナリオを選択</h3>
                                <div class="vp-scenario-grid">
                                    ${this.renderScenarioCards()}
                                </div>
                            </div>
                            
                            <div class="vp-dialogue-player-container" id="vp-dialogue-player" style="display: none;">
                                <!-- 対話プレイヤーがここに表示される -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- ガイダンスビュー -->
                    <div class="vp-view" id="vp-guidance-view">
                        <div class="vp-guidance-container">
                            <h2 class="vp-guidance-title">統合的ガイダンス</h2>
                            <p class="vp-guidance-subtitle">三つの人格を調和させるための具体的アドバイス</p>
                            
                            ${this.renderGuidanceContent()}
                        </div>
                    </div>
                </main>
                
                <!-- フッター -->
                <footer class="vp-footer">
                    <p class="vp-footer-text">
                        bunenjin 哲学に基づく仮想人格分析システム | 
                        Generated on ${new Date().toLocaleDateString('ja-JP')}
                    </p>
                </footer>
            </div>
        `;
        
        // イベントリスナーを設定
        this.setupEventListeners();
        
        // チャートを初期化
        setTimeout(() => {
            this.initializeCharts();
            this.drawRelationshipLines();
        }, 100);
    }
    
    /**
     * OS カードをレンダリング
     */
    renderOSCard(osData, osType) {
        const osConfig = {
            engine: {
                title: 'Engine OS',
                icon: '🔥',
                color: '--vp-engine-color',
                description: '核となる価値観とモチベーション'
            },
            interface: {
                title: 'Interface OS',
                icon: '🌟',
                color: '--vp-interface-color',
                description: '社会的表現と対人関係'
            },
            safemode: {
                title: 'Safe Mode OS',
                icon: '🛡️',
                color: '--vp-safemode-color',
                description: '防御機制とストレス対応'
            }
        };
        
        const config = osConfig[osType];
        const hexagramInfo = osData.hexagramInfo || {};
        const matchPercentage = osData.matchPercentage || 0;
        const traits = osData.traits || [];
        
        return `
            <div class="vp-os-card ${osType}-os" data-os="${osType}">
                <div class="vp-os-header" style="background: linear-gradient(135deg, var(${config.color}), var(${config.color}-dark));">
                    <div class="vp-os-icon">${config.icon}</div>
                    <h4 class="vp-os-title">${config.title}</h4>
                </div>
                <div class="vp-os-body">
                    <div class="vp-os-hexagram">
                        <span class="hexagram-number">第${hexagramInfo.number || '?'}卦</span>
                        <span class="hexagram-name">${hexagramInfo.name || '未知'}</span>
                    </div>
                    <div class="vp-os-score">
                        <div class="vp-score-bar">
                            <div class="vp-score-fill" style="width: ${matchPercentage}%; background: var(${config.color});"></div>
                        </div>
                        <span class="vp-score-text">${matchPercentage.toFixed(1)}%</span>
                    </div>
                    <div class="vp-os-traits">
                        ${traits.slice(0, 3).map(trait => `<span class="vp-trait">${trait}</span>`).join('')}
                    </div>
                    <button class="vp-os-detail-button" onclick="virtualPersonaView.showOSDetail('${osType}')">
                        詳細を見る
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * 人格名を生成
     */
    generatePersonaName() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        const engineName = engineOS?.hexagramInfo?.name || '創造';
        const interfaceName = interfaceOS?.hexagramInfo?.name || '調和';
        const safeName = safeModeOS?.hexagramInfo?.name || '守護';
        
        // 卦名の組み合わせから仮想人格名を生成
        const combinations = [
            `${engineName}の${interfaceName}者`,
            `${interfaceName}を${safeName}する者`,
            `三位一体の${engineName}者`
        ];
        
        return combinations[Math.floor(Math.random() * combinations.length)];
    }
    
    /**
     * 易経メタファーコンテンツを生成
     */
    generateMetaphorContent() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        
        return `
            <div class="vp-metaphor-intro">
                <p>この仮想人格は、易経の三つの卦が織り成す複雑な人間性を表現しています。</p>
            </div>
            
            <div class="vp-metaphor-os-summary">
                <div class="vp-metaphor-os engine">
                    <h4>🔥 ${engineOS?.hexagramInfo?.name || '創造'} - 核心的動力</h4>
                    <p>${this.getHexagramMetaphor(engineOS?.hexagramInfo)}</p>
                </div>
                <div class="vp-metaphor-os interface">
                    <h4>🌟 ${interfaceOS?.hexagramInfo?.name || '調和'} - 社会的表現</h4>
                    <p>${this.getHexagramMetaphor(interfaceOS?.hexagramInfo)}</p>
                </div>
                <div class="vp-metaphor-os safemode">
                    <h4>🛡️ ${safeModeOS?.hexagramInfo?.name || '守護'} - 防御機制</h4>
                    <p>${this.getHexagramMetaphor(safeModeOS?.hexagramInfo)}</p>
                </div>
            </div>
            
            <div class="vp-metaphor-integration">
                <h4>統合された人格像</h4>
                <p>
                    この仮想人格は、${engineOS?.hexagramInfo?.name || '創造'}の力強さと、
                    ${interfaceOS?.hexagramInfo?.name || '調和'}の柔軟性、
                    ${safeModeOS?.hexagramInfo?.name || '守護'}の慎重さを併せ持つ存在です。
                    時と場に応じて、これらの側面が巧妙に調和し、独特の魅力を放ちます。
                </p>
            </div>
        `;
    }
    
    /**
     * 卦のメタファーを取得
     */
    getHexagramMetaphor(hexagramInfo) {
        if (!hexagramInfo || !hexagramInfo.number) {
            return '未知なる力が働いています。';
        }
        
        // 簡易的なメタファー生成（実際の実装では、より詳細な卦の解釈を使用）
        const metaphors = {
            1: '天の創造力が内に宿り、絶えず新しい可能性を生み出します。',
            2: '大地のような包容力と受容性を持ち、他者を支え育みます。',
            3: '雷のような力強さで困難に立ち向かい、成長の道を切り開きます。',
            4: '山の如く安定した意志で、じっくりと物事を判断します。',
            // ... 他の卦についても同様に定義
        };
        
        return metaphors[hexagramInfo.number] || `第${hexagramInfo.number}卦の深い智慧が働いています。`;
    }
    
    /**
     * シナリオカードをレンダリング
     */
    renderScenarioCards() {
        const scenarios = [
            {
                id: 'work-stress',
                icon: '💼',
                title: '職場のストレス対処',
                description: '厳しい職場環境での各OSの反応を見る'
            },
            {
                id: 'relationship',
                icon: '💕',
                title: '人間関係の構築',
                description: '新しい関係性における各OSの役割'
            },
            {
                id: 'decision-making',
                icon: '🤔',
                title: '重要な決断',
                description: '人生の重要な選択における各OSの判断'
            },
            {
                id: 'creative-project',
                icon: '🎨',
                title: '創作活動',
                description: '創造的な活動における各OSの貢献'
            }
        ];
        
        return scenarios.map(scenario => `
            <div class="vp-scenario-card" onclick="virtualPersonaView.startScenario('${scenario.id}')">
                <div class="vp-scenario-icon">${scenario.icon}</div>
                <h4 class="vp-scenario-title">${scenario.title}</h4>
                <p class="vp-scenario-description">${scenario.description}</p>
            </div>
        `).join('');
    }
    
    /**
     * ガイダンスコンテンツをレンダリング
     */
    renderGuidanceContent() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        
        return `
            <!-- 統合的アドバイス -->
            <div class="vp-guidance-section">
                <h3>統合的な人格発達へのアドバイス</h3>
                <div class="vp-integrated-advice">
                    <div class="vp-advice-highlight">
                        あなたの仮想人格は、三つの異なる側面が織り成す複雑な存在です。
                    </div>
                    <p>
                        bunenjin 哲学では、単一の「本当の自分」を求めるのではなく、
                        複数の側面を認識し、それらを状況に応じて活用することを重視します。
                        この仮想人格の各OSを理解することで、より豊かな人生を歩むことができるでしょう。
                    </p>
                </div>
            </div>
            
            <!-- OS別ガイダンス -->
            <div class="vp-os-guidance">
                <h3>各OS別の発達ガイダンス</h3>
                <div class="vp-os-guidance-grid">
                    <div class="vp-os-guidance-card engine">
                        <h4>🔥 Engine OS の活用</h4>
                        <div class="vp-guidance-content">
                            <p>
                                あなたの核となる価値観「${engineOS?.hexagramInfo?.name || '創造'}」を大切にしましょう。
                                この内なる炎は、人生の指針となる重要な力です。
                            </p>
                            <p>
                                日常の決断において、この価値観に立ち返ることで、
                                より一貫性のある選択ができるようになります。
                            </p>
                        </div>
                        <div class="vp-os-score-indicator">
                            <span>現在の活用度: ${engineOS?.matchPercentage?.toFixed(1) || 0}%</span>
                            <div class="vp-mini-score-bar">
                                <div class="vp-mini-score-fill" style="width: ${engineOS?.matchPercentage || 0}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vp-os-guidance-card interface">
                        <h4>🌟 Interface OS の調整</h4>
                        <div class="vp-guidance-content">
                            <p>
                                「${interfaceOS?.hexagramInfo?.name || '調和'}」の性質を活かして、
                                より効果的な対人関係を築いていきましょう。
                            </p>
                            <p>
                                社会的な場面では、この側面を意識的に活用することで、
                                より良いコミュニケーションが可能になります。
                            </p>
                        </div>
                        <div class="vp-os-score-indicator">
                            <span>現在の活用度: ${interfaceOS?.matchPercentage?.toFixed(1) || 0}%</span>
                            <div class="vp-mini-score-bar">
                                <div class="vp-mini-score-fill" style="width: ${interfaceOS?.matchPercentage || 0}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vp-os-guidance-card safemode">
                        <h4>🛡️ Safe Mode OS の調和</h4>
                        <div class="vp-guidance-content">
                            <p>
                                「${safeModeOS?.hexagramInfo?.name || '守護'}」の防御機制を理解し、
                                過度な制限とならないよう調整していきましょう。
                            </p>
                            <p>
                                このOSは安全を守る重要な役割を果たしますが、
                                時には新しい挑戦の妨げになることもあります。
                            </p>
                        </div>
                        <div class="vp-os-score-indicator">
                            <span>現在の活用度: ${safeModeOS?.matchPercentage?.toFixed(1) || 0}%</span>
                            <div class="vp-mini-score-bar">
                                <div class="vp-mini-score-fill" style="width: ${safeModeOS?.matchPercentage || 0}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 実践的エクササイズ -->
            <div class="vp-exercises">
                <h3>実践的エクササイズ</h3>
                <div class="vp-exercises-grid">
                    <div class="vp-exercise-card">
                        <h4>三つの視点からの日記</h4>
                        <p>
                            日常の出来事を、Engine、Interface、Safe Mode の
                            三つの視点から記録してみましょう。
                            同じ出来事でも、それぞれのOSが異なる解釈をしていることに気づくでしょう。
                        </p>
                        <div class="vp-exercise-meta">
                            <span>⏱️ 所要時間: 15分/日</span>
                            <span>📅 推奨期間: 2週間</span>
                        </div>
                    </div>
                    
                    <div class="vp-exercise-card">
                        <h4>OS切り替え練習</h4>
                        <p>
                            意識的に異なるOSを前面に出して行動してみましょう。
                            創造的な場面ではEngine OSを、
                            社会的な場面ではInterface OSを活用する練習をします。
                        </p>
                        <div class="vp-exercise-meta">
                            <span>⏱️ 所要時間: 随時</span>
                            <span>📅 推奨期間: 継続的</span>
                        </div>
                    </div>
                    
                    <div class="vp-exercise-card">
                        <h4>統合的瞑想</h4>
                        <p>
                            三つのOSそれぞれに感謝し、
                            それらが調和して働いている状態を想像する瞑想を行います。
                            内なる複数の声を受け入れる練習になります。
                        </p>
                        <div class="vp-exercise-meta">
                            <span>⏱️ 所要時間: 10分/日</span>
                            <span>📅 推奨期間: 毎日</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- シミュレーション -->
            <div class="vp-simulation">
                <h3>仮想状況シミュレーション</h3>
                <p>以下のボタンから状況を選択し、各OSがどのように反応するかを確認してみましょう。</p>
                
                <div class="vp-simulation-options">
                    <button class="vp-simulation-button" onclick="virtualPersonaView.runSimulation('conflict')">
                        対人関係の衝突
                    </button>
                    <button class="vp-simulation-button" onclick="virtualPersonaView.runSimulation('opportunity')">
                        新しい機会の提示
                    </button>
                    <button class="vp-simulation-button" onclick="virtualPersonaView.runSimulation('pressure')">
                        高いプレッシャー
                    </button>
                    <button class="vp-simulation-button" onclick="virtualPersonaView.runSimulation('creativity')">
                        創造的活動
                    </button>
                </div>
                
                <div class="vp-simulation-result" id="vp-simulation-result" style="display: none;">
                    <!-- シミュレーション結果がここに表示される -->
                </div>
            </div>
        `;
    }
    
    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // ナビゲーションボタン
        const navButtons = this.container.querySelectorAll('.vp-nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const view = e.target.closest('[data-view]').dataset.view;
                this.switchView(view);
            });
        });
        
        // OSカードのクリック
        const osCards = this.container.querySelectorAll('.vp-os-card');
        osCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const osType = e.target.closest('[data-os]').dataset.os;
                this.highlightOS(osType);
            });
        });
        
        // グローバル参照を設定
        window.virtualPersonaView = this;
    }
    
    /**
     * チャートを初期化
     */
    initializeCharts() {
        const canvas = this.container.querySelector('#os-balance-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        
        // Chart.js を使用してバランスチャートを作成
        if (window.Chart) {
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Engine OS', 'Interface OS', 'Safe Mode OS'],
                    datasets: [{
                        label: 'OS Balance',
                        data: [
                            engineOS?.matchPercentage || 0,
                            interfaceOS?.matchPercentage || 0,
                            safeModeOS?.matchPercentage || 0
                        ],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }
    
    /**
     * OS間の関係線を描画
     */
    drawRelationshipLines() {
        const canvas = this.container.querySelector('#vp-relationship-canvas');
        if (!canvas) return;
        
        const triangle = canvas.parentElement;
        canvas.width = triangle.offsetWidth;
        canvas.height = triangle.offsetHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 2;
        
        // 三角形の各頂点を結ぶ線を描画
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 3;
        
        // 3つの点の座標
        const points = [
            { x: centerX, y: centerY - radius }, // Engine OS (上)
            { x: centerX - radius * 0.866, y: centerY + radius * 0.5 }, // Interface OS (左下)
            { x: centerX + radius * 0.866, y: centerY + radius * 0.5 }  // Safe Mode OS (右下)
        ];
        
        // 線を描画
        ctx.beginPath();
        points.forEach((point, index) => {
            const nextPoint = points[(index + 1) % points.length];
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
        });
        ctx.stroke();
    }
    
    /**
     * 統合レベルを計算
     */
    calculateIntegrationLevel() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        const scores = [
            engineOS?.matchPercentage || 0,
            interfaceOS?.matchPercentage || 0,
            safeModeOS?.matchPercentage || 0
        ];
        
        // スコアの均衡性を評価（差が小さいほど統合レベルが高い）
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
        const integrationLevel = Math.max(0, 100 - variance);
        
        return Math.round(integrationLevel);
    }
    
    /**
     * 統合レベルの説明を取得
     */
    getIntegrationDescription() {
        const level = this.calculateIntegrationLevel();
        
        if (level >= 80) {
            return '三つのOSが非常によく調和しています。バランスの取れた人格です。';
        } else if (level >= 60) {
            return '良好な統合状態です。時々OSの切り替えを意識すると更に良くなります。';
        } else if (level >= 40) {
            return '適度な統合レベルです。特定の場面でOSの使い分けを練習してみましょう。';
        } else {
            return 'OSの統合を高める余地があります。意識的な使い分けから始めてみましょう。';
        }
    }
    
    /**
     * ビューを切り替え
     */
    switchView(viewName) {
        // ナビゲーションボタンの状態を更新
        const navButtons = this.container.querySelectorAll('.vp-nav-button');
        navButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.view === viewName);
        });
        
        // ビューを切り替え
        const views = this.container.querySelectorAll('.vp-view');
        views.forEach(view => {
            view.classList.toggle('active', view.id === `vp-${viewName}-view`);
        });
    }
    
    /**
     * OSを強調表示
     */
    highlightOS(osType) {
        const cards = this.container.querySelectorAll('.vp-os-card');
        cards.forEach(card => {
            card.classList.toggle('highlighted', card.dataset.os === osType);
        });
        
        this.selectedOS = osType;
    }
    
    /**
     * OS詳細を表示
     */
    showOSDetail(osType) {
        console.log(`🔍 Showing detail for ${osType} OS`);
        
        // ここで詳細モーダルやパネルを表示
        // 実装は後続のタスクで追加予定
        
        alert(`${osType} OS の詳細表示機能は開発中です。`);
    }
    
    /**
     * 対話を開始
     */
    startDialogue() {
        this.switchView('dialogue');
    }
    
    /**
     * シナリオを開始
     */
    startScenario(scenarioId) {
        console.log(`🎭 Starting scenario: ${scenarioId}`);
        
        // シナリオ別の対話プレイヤーを表示
        // 実装は後続のタスクで追加予定
        
        const playerContainer = this.container.querySelector('#vp-dialogue-player');
        playerContainer.style.display = 'block';
        playerContainer.innerHTML = `
            <h3>シナリオ: ${scenarioId}</h3>
            <p>対話プレイヤーの実装は開発中です。</p>
            <button onclick="virtualPersonaView.hideDialoguePlayer()">戻る</button>
        `;
    }
    
    /**
     * 対話プレイヤーを非表示
     */
    hideDialoguePlayer() {
        const playerContainer = this.container.querySelector('#vp-dialogue-player');
        playerContainer.style.display = 'none';
    }
    
    /**
     * シミュレーションを実行
     */
    runSimulation(situationType) {
        console.log(`🎮 Running simulation: ${situationType}`);
        
        const resultContainer = this.container.querySelector('#vp-simulation-result');
        const { engineOS, interfaceOS, safeModeOS } = this.analysisResult;
        
        const simulations = {
            conflict: {
                title: '対人関係の衝突シミュレーション',
                content: `
                    <p><strong>Engine OS (${engineOS?.hexagramInfo?.name || '創造'}):</strong> 
                    根本的な価値観に基づいて、原則を曲げずに対応しようとします。</p>
                    <p><strong>Interface OS (${interfaceOS?.hexagramInfo?.name || '調和'}):</strong> 
                    関係性を重視し、双方が納得できる解決策を模索します。</p>
                    <p><strong>Safe Mode OS (${safeModeOS?.hexagramInfo?.name || '守護'}):</strong> 
                    リスクを最小化し、安全な選択肢を選ぼうとします。</p>
                `
            },
            opportunity: {
                title: '新しい機会の提示シミュレーション',
                content: `
                    <p><strong>Engine OS:</strong> 機会が自分の価値観と合致するかを判断し、情熱を感じられるかを重視します。</p>
                    <p><strong>Interface OS:</strong> 周囲の人々への影響や、社会的な意味を考慮して判断します。</p>
                    <p><strong>Safe Mode OS:</strong> リスクとリターンを慎重に分析し、失敗の可能性を評価します。</p>
                `
            },
            pressure: {
                title: '高いプレッシャー状況シミュレーション',
                content: `
                    <p><strong>Engine OS:</strong> 核となる動機から力を得て、困難に立ち向かおうとします。</p>
                    <p><strong>Interface OS:</strong> 他者からのサポートを求め、協力体制を築こうとします。</p>
                    <p><strong>Safe Mode OS:</strong> ストレス軽減策を探し、安全な環境を確保しようとします。</p>
                `
            },
            creativity: {
                title: '創造的活動シミュレーション',
                content: `
                    <p><strong>Engine OS:</strong> 内なる情熱と価値観から創造的エネルギーを生み出します。</p>
                    <p><strong>Interface OS:</strong> 他者の視点や社会的意義を考慮しながら表現を調整します。</p>
                    <p><strong>Safe Mode OS:</strong> 完璧主義的な傾向で、失敗を恐れて慎重になりがちです。</p>
                `
            }
        };
        
        const simulation = simulations[situationType];
        if (simulation) {
            resultContainer.innerHTML = `
                <h4>${simulation.title}</h4>
                <div class="vp-simulation-content">
                    ${simulation.content}
                    <p><em>このシミュレーションを参考に、実際の場面でも各OSの反応を観察してみましょう。</em></p>
                </div>
            `;
            resultContainer.style.display = 'block';
        }
    }
    
    /**
     * レポートを生成 (Extended Features統合版)
     */
    generateReport() {
        console.log('📊 Generating virtual persona report');
        
        // Extended Features Managerが利用可能な場合はPDF出力を使用
        if (window.extendedFeatures && window.extendedFeatures.isInitialized) {
            try {
                window.extendedFeatures.exportToPDF();
                return;
            } catch (error) {
                console.warn('Extended PDF export failed, falling back to JSON:', error);
            }
        }
        
        // フォールバック: JSON形式でのレポート生成
        const reportData = {
            timestamp: new Date().toISOString(),
            personaName: this.generatePersonaName(),
            analysisResult: this.analysisResult,
            insights: this.insights,
            integrationLevel: this.calculateIntegrationLevel()
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `virtual-persona-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📄 JSONレポートをダウンロードしました！');
    }
    
    /**
     * 通知表示
     */
    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = 'vp-notification';
        notification.textContent = message;
        
        // スタイリング
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        document.body.appendChild(notification);
        
        // 自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
    
    /**
     * フェードイン効果
     */
    async fadeIn() {
        return new Promise(resolve => {
            this.container.style.transition = 'opacity 0.5s ease-in-out';
            this.container.style.opacity = '1';
            setTimeout(resolve, 500);
        });
    }
    
    /**
     * 導入アニメーション
     */
    async playIntroAnimation() {
        const osCards = this.container.querySelectorAll('.vp-os-card');
        
        // OSカードを順番にアニメーション
        for (let i = 0; i < osCards.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    osCards[i].style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        osCards[i].style.transform = 'scale(1)';
                        resolve();
                    }, 300);
                }, i * 200);
            });
        }
        
        console.log('✨ Intro animation completed');
    }
    
    /**
     * エラー表示
     */
    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-container">
                    <div class="error-content">
                        <h2>エラーが発生しました</h2>
                        <p>${message}</p>
                        <button class="error-retry-button" onclick="location.reload()">
                            再読み込み
                        </button>
                        <a href="/" class="error-link">
                            ホームに戻る
                        </a>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Extended Features Managerの初期化
     */
    async initializeExtendedFeatures() {
        try {
            // Extended Features Managerが利用可能かチェック
            if (typeof ExtendedFeaturesManager !== 'undefined' && this.analysisResult) {
                console.log('🚀 Initializing Extended Features Manager...');
                
                // 少し遅延させて他の初期化を待つ
                setTimeout(async () => {
                    try {
                        if (!window.extendedFeatures) {
                            window.extendedFeatures = new ExtendedFeaturesManager({
                                privacyMode: true,
                                enableAdvancedAnalytics: true,
                                autoSaveResults: true
                            });
                            
                            await window.extendedFeatures.init(this.analysisResult);
                            console.log('✅ Extended Features Manager initialized successfully');
                            
                            // 自動保存結果
                            if (window.extendedFeatures.historyManager) {
                                await window.extendedFeatures.saveCurrentResult(this.analysisResult, {
                                    sessionType: 'virtual_persona_results',
                                    userAgent: navigator.userAgent,
                                    timestamp: new Date().toISOString()
                                });
                            }
                        }
                    } catch (error) {
                        console.warn('⚠️ Extended Features Manager initialization failed:', error);
                    }
                }, 1000);
            }
        } catch (error) {
            console.warn('⚠️ Extended Features not available:', error);
        }
    }
    
    /**
     * コンポーネントを非表示
     */
    async hide() {
        if (this.container) {
            this.container.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 300));
            this.container.style.display = 'none';
            this.container.classList.remove('visible');
        }
    }
}

// グローバルエクスポート
window.VirtualPersonaResultsView = VirtualPersonaResultsView;

console.log('✅ VirtualPersonaResultsView loaded successfully');