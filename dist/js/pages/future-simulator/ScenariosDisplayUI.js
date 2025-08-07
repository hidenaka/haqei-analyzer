/**
 * HAQEI Scenarios Display UI System - Phase 3 Implementation
 * 8シナリオ美しい表示システム - HaQei哲学準拠
 * 
 * 実装日: 2025年8月6日
 * 担当: HAQEI Programming Agent  
 * 目的: 8シナリオを美しく表示し、矛盾受容とHaQei哲学を視覚化
 */

class ScenariosDisplayUI {
    constructor() {
        this.initialized = false;
        this.animationEngine = null;
        this.displayContainer = null;
        this.currentScenarios = null;
        this.selectedScenario = null;
        this.contradictionVisualizationEnabled = true;
        this.HaQeiModeActive = true;
        
        // UI State Management
        this.displayStates = {
            loading: false,
            animating: false,
            interactive: true,
            fullscreen: false
        };

        // Animation Configuration
        this.animationConfig = {
            staggerDelay: 200,
            fadeInDuration: 600,
            scaleUpDuration: 400,
            contradictionPulseInterval: 3000,
            HaQeiTransitionDuration: 800
        };

        console.log('🎨 ScenariosDisplayUI Phase 3 initialized');
    }

    /**
     * メイン表示メソッド - Phase 3 Core Implementation
     * P3-001: 8シナリオを美しく表示
     */
    async displayEightScenarios(scenariosResult, options = {}) {
        try {
            console.log('🎭 Displaying eight scenarios with HaQei philosophy...');
            
            if (!scenariosResult || !scenariosResult.scenarios) {
                throw new Error('シナリオデータが必要です');
            }

            this.currentScenarios = scenariosResult;
            this.displayStates.loading = true;

            // Step 1: 表示コンテナの準備
            await this.prepareDisplayContainer(options);

            // Step 2: レスポンシブレイアウトの設定
            this.setupResponsiveLayout();

            // Step 3: HaQei哲学ヘッダーの表示
            await this.displayHaQeiPhilosophyHeader(scenariosResult);

            // Step 4: 8シナリオカードの並列生成
            const scenarioCards = await this.generateScenarioCards(scenariosResult.scenarios);

            // Step 5: 段階的アニメーション表示
            await this.performStaggeredAnimation(scenarioCards);

            // Step 6: 矛盾可視化の実装
            await this.implementContradictionVisualization(scenariosResult.contradictionPatterns);

            // Step 7: 統合的指導の表示
            await this.displayHolisticGuidance(scenariosResult.holisticGuidance);

            // Step 8: インタラクティブ機能の有効化
            this.enableInteractiveFeatures();

            this.displayStates.loading = false;
            this.displayStates.interactive = true;

            console.log('✅ Eight scenarios displayed successfully');
            return { success: true, displayContainer: this.displayContainer };

        } catch (error) {
            console.error('❌ Error in displayEightScenarios:', error);
            return this.displayFallbackScenarios(scenariosResult);
        }
    }

    /**
     * P3-002: 表示コンテナの準備
     */
    async prepareDisplayContainer(options = {}) {
        // 既存コンテナの確認
        let container = document.getElementById('scenarios-display-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'scenarios-display-container';
            container.className = 'scenarios-display-container fade-in-container';
            
            // 適切な親要素に挿入
            const parentElement = options.parentElement || 
                                 document.getElementById('resultArea') ||
                                 document.querySelector('.analysis-results') ||
                                 document.body;
            
            parentElement.appendChild(container);
        }

        // コンテナの初期化
        container.innerHTML = '';
        container.classList.add('phase3-scenarios', 'HaQei-philosophy');
        
        this.displayContainer = container;

        // ローディング表示
        this.showLoadingState();
    }

    /**
     * P3-003: レスポンシブレイアウトの設定
     */
    setupResponsiveLayout() {
        const container = this.displayContainer;
        
        // デバイス検出
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;

        // レイアウトクラスの適用
        container.classList.remove('mobile-layout', 'tablet-layout', 'desktop-layout');
        
        if (isMobile) {
            container.classList.add('mobile-layout');
            this.animationConfig.staggerDelay = 150;
        } else if (isTablet) {
            container.classList.add('tablet-layout');
            this.animationConfig.staggerDelay = 175;
        } else {
            container.classList.add('desktop-layout');
            this.animationConfig.staggerDelay = 200;
        }

        // 動的レイアウト調整
        this.adjustLayoutForContent();
    }

    /**
     * P3-004: HaQei哲学ヘッダーの表示
     */
    async displayHaQeiPhilosophyHeader(scenariosResult) {
        const headerHTML = `
            <div class="HaQei-philosophy-header fade-in-up">
                <div class="philosophy-introduction">
                    <div class="header-icon">🎭</div>
                    <h2 class="philosophy-title">
                        8つの可能性 - HaQei 視点分析
                    </h2>
                    <div class="philosophy-subtitle">
                        ${scenariosResult.sourceHexagram.name} から導かれる多様なアプローチ
                    </div>
                </div>
                
                <div class="philosophy-explanation">
                    <div class="explanation-card">
                        <div class="card-icon">💡</div>
                        <div class="card-content">
                            <h4>HaQei哲学とは</h4>
                            <p>人は複数の「分人」を持ち、状況に応じて異なる側面を表現します。
                            ここでは8つの異なる視点から、あなたの状況への対応策を提示します。</p>
                        </div>
                    </div>
                    
                    <div class="contradiction-embrace">
                        <div class="embrace-icon">🤝</div>
                        <div class="embrace-text">
                            <strong>矛盾の受容</strong>: 相反する感情や考えも、すべてあなたの一部です。
                            複数のアプローチを組み合わせることで、より豊かな解決策が見つかります。
                        </div>
                    </div>
                </div>

                <div class="meta-guidance-preview">
                    <div class="guidance-highlight">
                        "${scenariosResult.holisticGuidance?.meta_guidance?.primary_message || 'すべてのシナリオが真実の一側面を表現しています'}"
                    </div>
                </div>
            </div>
        `;

        this.displayContainer.innerHTML += headerHTML;
        
        // ヘッダーアニメーション
        await this.animateElement('.HaQei-philosophy-header', 'fadeInUp', 600);
    }

    /**
     * P3-005: 8シナリオカードの生成
     */
    async generateScenarioCards(scenarios) {
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'scenarios-grid eight-scenarios-grid';
        cardsContainer.innerHTML = `
            <div class="grid-title">
                <h3>🎯 8つのアプローチ</h3>
                <p>各シナリオをクリックして詳細を確認できます</p>
            </div>
        `;

        const cards = scenarios.map((scenario, index) => {
            return this.createScenarioCard(scenario, index);
        });

        // カードをグリッドに配置
        cards.forEach(card => {
            cardsContainer.appendChild(card);
        });

        this.displayContainer.appendChild(cardsContainer);
        
        return cards;
    }

    /**
     * P3-006: 個別シナリオカードの作成
     */
    createScenarioCard(scenario, index) {
        const card = document.createElement('div');
        card.className = `scenario-card scenario-${scenario.id} card-${index + 1}`;
        card.setAttribute('data-scenario-id', scenario.id);
        card.setAttribute('data-index', index);

        // 成功確率に基づく視覚的表現
        const probabilityClass = this.getProbabilityClass(scenario.success_probability);
        
        // HaQei矛盾要素の表示
        const contradictions = scenario.HaQei_contradictions || [];
        const hasContradictions = contradictions.length > 0;

        card.innerHTML = `
            <div class="card-header ${probabilityClass}">
                <div class="scenario-number">${index + 1}</div>
                <div class="scenario-title-group">
                    <h4 class="scenario-title">${scenario.title}</h4>
                    <p class="scenario-subtitle">${scenario.subtitle}</p>
                </div>
                ${hasContradictions ? '<div class="contradiction-indicator" title="矛盾要素あり">⚖️</div>' : ''}
            </div>

            <div class="card-body">
                <div class="core-approach">
                    <div class="approach-primary">
                        <span class="approach-label">主要アプローチ:</span>
                        <span class="approach-text">${scenario.core_approach?.primary || '基本的アプローチ'}</span>
                    </div>
                </div>

                <div class="scenario-metrics">
                    <div class="metric probability-metric">
                        <div class="metric-icon">📊</div>
                        <div class="metric-content">
                            <div class="metric-label">成功確率</div>
                            <div class="metric-value">${this.formatProbability(scenario.success_probability)}</div>
                        </div>
                    </div>
                    
                    <div class="metric timeline-metric">
                        <div class="metric-icon">⏱️</div>
                        <div class="metric-content">
                            <div class="metric-label">実施期間</div>
                            <div class="metric-value">${scenario.timeline || '適宜調整'}</div>
                        </div>
                    </div>
                </div>

                ${hasContradictions ? this.generateContradictionDisplay(contradictions[0]) : ''}
                
                <div class="actions-preview">
                    <div class="preview-label">主な行動:</div>
                    <ul class="actions-list">
                        ${(scenario.specific_actions || ['基本的な対応']).slice(0, 2).map(action => 
                            `<li class="action-item">${action}</li>`
                        ).join('')}
                    </ul>
                    ${scenario.specific_actions && scenario.specific_actions.length > 2 ? 
                        '<div class="more-actions">他 ' + (scenario.specific_actions.length - 2) + ' 項目...</div>' : ''}
                </div>
            </div>

            <div class="card-footer">
                <div class="action-buttons">
                    <button class="expand-button" data-scenario="${scenario.id}" 
                            aria-label="${scenario.title}の詳細を表示" 
                            role="button" 
                            tabindex="0">
                        詳細を見る <span class="expand-icon">→</span>
                    </button>
                    <button class="save-button" data-scenario="${scenario.id}" 
                            aria-label="${scenario.title}を保存" 
                            role="button" 
                            tabindex="0" 
                            title="ローカルストレージに保存">
                        <span class="save-icon">💾</span> 保存
                    </button>
                    <button class="share-button" data-scenario="${scenario.id}" 
                            aria-label="${scenario.title}を共有" 
                            role="button" 
                            tabindex="0" 
                            title="クリップボードにコピー">
                        <span class="share-icon">📤</span> 共有
                    </button>
                </div>
                <div class="HaQei-badge" title="HaQei哲学準拠">
                    <span class="badge-icon">🎭</span>
                    <span class="badge-text">分人視点</span>
                </div>
            </div>

            <div class="card-overlay"></div>
        `;

        // カードイベントリスナー
        this.attachCardEventListeners(card, scenario);

        return card;
    }

    /**
     * P3-007: 矛盾表示の生成
     */
    generateContradictionDisplay(contradiction) {
        return `
            <div class="contradiction-display">
                <div class="contradiction-header">
                    <span class="contradiction-icon">⚖️</span>
                    <span class="contradiction-title">内的矛盾</span>
                </div>
                <div class="contradiction-content">
                    <div class="contradiction-element">${contradiction.element}</div>
                    <div class="contradiction-insight">${contradiction.insight}</div>
                    <div class="contradiction-resolution">
                        <span class="resolution-label">統合のヒント:</span>
                        <span class="resolution-text">${contradiction.resolution}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * P3-008: 段階的アニメーション表示
     */
    async performStaggeredAnimation(cards) {
        this.displayStates.animating = true;

        // ローディング状態の解除
        this.hideLoadingState();

        // カードの段階的表示
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            
            setTimeout(() => {
                card.classList.add('animate-card-entrance');
                this.animateElement(card, 'fadeInUp', this.animationConfig.fadeInDuration);
                
                // 矛盾要素のパルスアニメーション
                const contradictionIndicator = card.querySelector('.contradiction-indicator');
                if (contradictionIndicator) {
                    setTimeout(() => {
                        contradictionIndicator.classList.add('pulse-animation');
                    }, 500);
                }
            }, i * this.animationConfig.staggerDelay);
        }

        // すべてのアニメーションが完了するまで待機
        const totalAnimationTime = cards.length * this.animationConfig.staggerDelay + 
                                  this.animationConfig.fadeInDuration;
        
        await new Promise(resolve => setTimeout(resolve, totalAnimationTime));
        
        this.displayStates.animating = false;
    }

    /**
     * P3-009: 矛盾可視化の実装
     */
    async implementContradictionVisualization(contradictionPatterns) {
        if (!this.contradictionVisualizationEnabled || !contradictionPatterns) {
            return;
        }

        const visualizationContainer = document.createElement('div');
        visualizationContainer.className = 'contradiction-visualization-container';
        visualizationContainer.innerHTML = `
            <div class="visualization-header">
                <h3>🤝 矛盾と調和の可視化</h3>
                <p>異なる視点間の対話と統合を表現します</p>
            </div>
            
            <div class="contradiction-network">
                ${this.generateContradictionNetwork(contradictionPatterns)}
            </div>
            
            <div class="visualization-legend">
                <div class="legend-item">
                    <div class="legend-color contradiction-color"></div>
                    <span>対立的関係</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color harmony-color"></div>
                    <span>調和的統合</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color synthesis-color"></div>
                    <span>創造的統合</span>
                </div>
            </div>
        `;

        this.displayContainer.appendChild(visualizationContainer);
        
        // 可視化アニメーション
        await this.animateContradictionVisualization();
    }

    /**
     * P3-010: 統合的指導の表示
     */
    async displayHolisticGuidance(holisticGuidance) {
        if (!holisticGuidance) return;

        const guidanceContainer = document.createElement('div');
        guidanceContainer.className = 'holistic-guidance-container';
        
        guidanceContainer.innerHTML = `
            <div class="guidance-header">
                <div class="header-icon">🌟</div>
                <h3>統合的指導</h3>
                <p>8つのシナリオを統合した智慧</p>
            </div>

            <div class="meta-guidance">
                <div class="primary-message">
                    <div class="message-icon">💡</div>
                    <div class="message-content">
                        <h4>核心メッセージ</h4>
                        <p>${holisticGuidance.meta_guidance?.primary_message}</p>
                    </div>
                </div>
                
                <div class="HaQei-principle">
                    <div class="principle-icon">🎭</div>
                    <div class="principle-content">
                        <h4>HaQei原理</h4>
                        <p>${holisticGuidance.meta_guidance?.HaQei_principle}</p>
                    </div>
                </div>
                
                <div class="contradiction-embrace">
                    <div class="embrace-icon">🤝</div>
                    <div class="embrace-content">
                        <h4>矛盾の受容</h4>
                        <p>${holisticGuidance.meta_guidance?.contradiction_embrace}</p>
                    </div>
                </div>
            </div>

            <div class="practical-integration">
                <h4>実践的統合アプローチ</h4>
                <ul class="integration-list">
                    ${(holisticGuidance.practical_integration || []).map(item => 
                        `<li class="integration-item">${item}</li>`
                    ).join('')}
                </ul>
            </div>

            <div class="scenario-navigation">
                <h4>シナリオナビゲーション</h4>
                <div class="navigation-grid">
                    <div class="nav-item">
                        <strong>選び方:</strong>
                        <span>${holisticGuidance.scenario_navigation?.how_to_choose}</span>
                    </div>
                    <div class="nav-item">
                        <strong>組み合わせ:</strong>
                        <span>${holisticGuidance.scenario_navigation?.multi_scenario_approach}</span>
                    </div>
                    <div class="nav-item">
                        <strong>動的切り替え:</strong>
                        <span>${holisticGuidance.scenario_navigation?.dynamic_switching}</span>
                    </div>
                </div>
            </div>

            <div class="philosophical-insight">
                <div class="insight-header">
                    <div class="insight-icon">🔮</div>
                    <h4>哲学的洞察</h4>
                </div>
                <div class="insight-content">
                    <p><strong>HaQei的真理:</strong> ${holisticGuidance.philosophical_insight?.HaQei_truth}</p>
                    <p><strong>統合の道:</strong> ${holisticGuidance.philosophical_insight?.integration_path}</p>
                </div>
            </div>
        `;

        this.displayContainer.appendChild(guidanceContainer);
        
        // 指導部分のアニメーション
        await this.animateElement('.holistic-guidance-container', 'fadeInUp', 800);
    }

    /**
     * P3-011: インタラクティブ機能の有効化（改善版）
     */
    enableInteractiveFeatures() {
        // インタラクティブ要素のキャッシュ
        this.interactiveElements = {
            cards: this.displayContainer.querySelectorAll('.scenario-card'),
            expandButtons: this.displayContainer.querySelectorAll('.expand-button'),
            saveButtons: this.displayContainer.querySelectorAll('.save-button'),
            shareButtons: this.displayContainer.querySelectorAll('.share-button')
        };

        // シナリオカードクリック
        this.displayContainer.addEventListener('click', (e) => {
            if (e.target.matches('.expand-button') || e.target.closest('.expand-button')) {
                const button = e.target.closest('.expand-button');
                const scenarioId = button.getAttribute('data-scenario');
                this.expandScenarioDetails(scenarioId);
            }

            // 保存ボタンクリック
            if (e.target.matches('.save-button') || e.target.closest('.save-button')) {
                const button = e.target.closest('.save-button');
                const scenarioId = button.getAttribute('data-scenario');
                this.saveScenarioToStorage(scenarioId);
            }

            // 共有ボタンクリック
            if (e.target.matches('.share-button') || e.target.closest('.share-button')) {
                const button = e.target.closest('.share-button');
                const scenarioId = button.getAttribute('data-scenario');
                this.shareScenarioToClipboard(scenarioId);
            }

            if (e.target.matches('.scenario-card') || e.target.closest('.scenario-card')) {
                const card = e.target.closest('.scenario-card');
                this.selectScenarioCard(card);
            }
        });

        // ホバー効果
        this.setupHoverEffects();
        
        // キーボードナビゲーション（アクセシビリティ改善）
        this.enableKeyboardNavigation();
        
        // フォーカス管理
        this.setupFocusManagement();
        
        // スワイプジェスチャー（モバイル）
        if (window.innerWidth < 768) {
            this.enableSwipeGestures();
        }
    }

    // ========================================
    // ユーティリティメソッド群
    // ========================================

    showLoadingState() {
        if (this.displayContainer) {
            this.displayContainer.innerHTML = `
                <div class="scenarios-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">8つのシナリオを生成中...</div>
                    <div class="loading-subtitle">HaQei哲学に基づく多視点分析</div>
                </div>
            `;
        }
    }

    hideLoadingState() {
        const loadingElement = this.displayContainer?.querySelector('.scenarios-loading');
        if (loadingElement) {
            loadingElement.classList.add('fade-out');
            setTimeout(() => {
                if (loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }
            }, 300);
        }
    }

    getProbabilityClass(probability) {
        if (probability >= 0.8) return 'high-probability';
        if (probability >= 0.6) return 'medium-probability';
        return 'low-probability';
    }

    formatProbability(probability) {
        return Math.round(probability * 100) + '%';
    }

    attachCardEventListeners(card, scenario) {
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });

        card.addEventListener('click', (e) => {
            if (!e.target.matches('.expand-button')) {
                this.selectScenarioCard(card);
            }
        });
    }

    async animateElement(selector, animationType, duration) {
        const element = typeof selector === 'string' ? 
                       this.displayContainer.querySelector(selector) : 
                       selector;
        
        if (!element) return;

        element.classList.add('animate', animationType);
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.remove('animate', animationType);
                resolve();
            }, duration);
        });
    }

    displayFallbackScenarios(scenariosResult) {
        console.log('🔄 Displaying fallback scenarios');
        
        if (this.displayContainer) {
            this.displayContainer.innerHTML = `
                <div class="fallback-scenarios">
                    <h3>基本的シナリオ表示</h3>
                    <p>詳細な表示に問題が発生しました。基本的なシナリオをご確認ください。</p>
                    <div class="basic-scenarios-list">
                        ${scenariosResult?.scenarios?.map((scenario, index) => `
                            <div class="basic-scenario-item">
                                <h4>${index + 1}. ${scenario.title || 'シナリオ' + (index + 1)}</h4>
                                <p>${scenario.subtitle || 'アプローチの概要'}</p>
                            </div>
                        `).join('') || '<p>シナリオデータが利用できません</p>'}
                    </div>
                </div>
            `;
        }
        
        return { success: false, fallback: true };
    }

    /**
     * 保存機能の実装
     */
    async saveScenarioToStorage(scenarioId) {
        try {
            const scenario = this.currentScenarios.scenarios.find(s => s.id === scenarioId);
            if (!scenario) throw new Error('シナリオが見つかりません');
            
            const savedScenarios = this.getSavedScenarios();
            const saveData = {
                id: scenarioId,
                title: scenario.title,
                subtitle: scenario.subtitle,
                saved_at: new Date().toISOString(),
                data: scenario
            };
            
            savedScenarios[scenarioId] = saveData;
            localStorage.setItem('haqei_saved_scenarios', JSON.stringify(savedScenarios));
            
            // 保存成功フィードバック
            this.showSaveSuccessModal(scenario.title);
            
            console.log('✅ Scenario saved successfully:', scenarioId);
            
        } catch (error) {
            console.error('❌ Error saving scenario:', error);
            this.showErrorModal('保存に失敗しました: ' + error.message);
        }
    }

    /**
     * 共有機能の実装
     */
    async shareScenarioToClipboard(scenarioId) {
        try {
            const scenario = this.currentScenarios.scenarios.find(s => s.id === scenarioId);
            if (!scenario) throw new Error('シナリオが見つかりません');
            
            const shareText = this.formatScenarioForSharing(scenario);
            
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareText);
                this.showShareSuccessModal(scenario.title);
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(shareText);
                this.showShareSuccessModal(scenario.title);
            }
            
            console.log('✅ Scenario shared successfully:', scenarioId);
            
        } catch (error) {
            console.error('❌ Error sharing scenario:', error);
            this.showErrorModal('共有に失敗しました: ' + error.message);
        }
    }

    /**
     * フォーカス管理の設定（アクセシビリティ改善）
     */
    setupFocusManagement() {
        // カード要素にフォーカス可能属性を追加
        this.displayContainer.querySelectorAll('.scenario-card').forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `scenario-title-${index}`);
            card.setAttribute('aria-describedby', `scenario-subtitle-${index}`);
            
            // タイトルにIDを設定
            const title = card.querySelector('.scenario-title');
            const subtitle = card.querySelector('.scenario-subtitle');
            if (title) title.id = `scenario-title-${index}`;
            if (subtitle) subtitle.id = `scenario-subtitle-${index}`;
        });
        
        // フォーカストラップの実装
        this.setupFocusTrap();
    }

    /**
     * キーボードナビゲーションの実装
     */
    enableKeyboardNavigation() {
        this.displayContainer.addEventListener('keydown', (e) => {
            const focusedElement = document.activeElement;
            const cards = Array.from(this.displayContainer.querySelectorAll('.scenario-card'));
            const currentIndex = cards.indexOf(focusedElement);
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.focusNextCard(cards, currentIndex);
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.focusPreviousCard(cards, currentIndex);
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (focusedElement.classList.contains('scenario-card')) {
                        this.selectScenarioCard(focusedElement);
                    } else if (focusedElement.matches('button')) {
                        focusedElement.click();
                    }
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    this.closeModal();
                    break;
            }
        });
    }

    // 簡略化実装メソッド
    adjustLayoutForContent() { /* レイアウト調整 */ }
    generateContradictionNetwork() { return '<div class="network-placeholder">矛盾ネットワーク表示</div>'; }
    animateContradictionVisualization() { return Promise.resolve(); }
    expandScenarioDetails(scenarioId) { 
        console.log(`Expanding scenario: ${scenarioId}`); 
    }
    selectScenarioCard(card) { 
        // 選択状態の切り替え
        this.displayContainer.querySelectorAll('.scenario-card').forEach(c => {
            c.classList.remove('selected');
        });
        card.classList.add('selected');
        this.selectedScenario = card.getAttribute('data-scenario-id');
        
        // アクセシビリティ: 選択状態を読み上げに通知
        card.setAttribute('aria-selected', 'true');
    }
    setupHoverEffects() { 
        this.displayContainer.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.setAttribute('aria-expanded', 'true');
            });
            card.addEventListener('mouseleave', () => {
                card.setAttribute('aria-expanded', 'false');
            });
        });
    }
    enableSwipeGestures() { /* スワイプジェスチャー */ }
    
    // 新規ユーティリティメソッド
    getSavedScenarios() {
        try {
            const saved = localStorage.getItem('haqei_saved_scenarios');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading saved scenarios:', error);
            return {};
        }
    }
    
    formatScenarioForSharing(scenario) {
        return `🎭 HAQEI シナリオ分析結果\n\n` +
               `【${scenario.title}】\n` +
               `${scenario.subtitle}\n\n` +
               `主要アプローチ: ${scenario.core_approach?.primary}\n` +
               `実施期間: ${scenario.timeline}\n` +
               `成功確率: ${this.formatProbability(scenario.success_probability)}\n\n` +
               `Generated by HAQEI Analyzer - HaQei philosophy`;
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    
    showSaveSuccessModal(title) {
        this.showModal('保存完了', `「${title}」を保存しました`);
    }
    
    showShareSuccessModal(title) {
        this.showModal('共有完了', `「${title}」をクリップボードにコピーしました`);
    }
    
    showErrorModal(message) {
        this.showModal('エラー', message);
    }
    
    showModal(title, message) {
        // 既存モーダルがあれば削除
        const existingModal = document.querySelector('.haqei-modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'haqei-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                    <h3 id="modal-title">${title}</h3>
                    <p>${message}</p>
                    <button class="modal-close" aria-label="閉じる">閉じる</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // モーダルクローズ処理
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                modal.remove();
            }
        });
        
        // 3秒後に自動クローズ
        setTimeout(() => {
            if (document.contains(modal)) {
                modal.remove();
            }
        }, 3000);
    }
    
    closeModal() {
        const modal = document.querySelector('.haqei-modal');
        if (modal) modal.remove();
    }
    
    focusNextCard(cards, currentIndex) {
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % cards.length : 0;
        cards[nextIndex].focus();
    }
    
    focusPreviousCard(cards, currentIndex) {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
        cards[prevIndex].focus();
    }
    
    setupFocusTrap() {
        // モーダル表示時のフォーカストラップ実装
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.haqei-modal');
            if (modal && e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('[tabindex]:not([tabindex="-1"]), button, input, select, textarea');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// グローバル利用のためのエクスポート
if (typeof window !== 'undefined') {
    window.ScenariosDisplayUI = ScenariosDisplayUI;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScenariosDisplayUI;
}

console.log('✅ ScenariosDisplayUI.js Phase 3 implementation loaded successfully');