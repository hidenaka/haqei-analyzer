/**
 * HAQEI Scenarios Display UI - シナリオ表示統合システム
 * 
 * 実装日: 2025年8月7日 緊急修正版
 * 担当: HAQEI Programmer Agent
 * 目的: 8シナリオとBinary Treeの統合表示システム
 * 
 * 【統合機能】
 * - 8シナリオカード表示
 * - Binary Tree可視化
 * - HaQei哲学統合レイアウト
 * - 結果の整理された表示
 */

class ScenariosDisplayUI {
    constructor() {
        this.initialized = false;
        this.version = "2.1.0-emergency-fix";
        this.displayAlignment = "haqei-integrated-scenarios-display";
        
        // 表示設定
        this.displayConfig = {
            scenarioCards: {
                maxCards: 8,
                cardLayout: 'grid',
                animationEnabled: true,
                responsiveBreakpoints: {
                    mobile: 768,
                    tablet: 1024,
                    desktop: 1200
                }
            },
            binaryTree: {
                enabled: true,
                visualization: 'hierarchical',
                interactive: true,
                maxDepth: 3
            },
            layout: {
                sectionsOrder: ['scenarios', 'binaryTree', 'integration'],
                spacing: 'comfortable',
                colorScheme: 'haqei-harmonious'
            }
        };
        
        // DOM要素の参照
        this.containers = {
            main: null,
            scenarios: null,
            binaryTree: null,
            integration: null
        };
        
        // アニメーション制御
        this.animations = {
            scenarioReveal: 'fadeInUp',
            binaryTreeGrow: 'expandFromCenter',
            cardHover: 'gentle-lift'
        };
        
        console.log('🎨 ScenariosDisplayUI v2.1.0 initialized - 統合シナリオ表示システム');
        this.initialized = true;
    }
    
    /**
     * メイン表示統合メソッド
     * @param {Array} scenarios - 8シナリオデータ
     * @param {Object} binaryTreeData - Binary Tree分析結果
     * @param {Object} container - 表示コンテナ要素
     * @returns {Promise} 表示完了Promise
     */
    async displayIntegratedResults(scenarios, binaryTreeData = null, container = null) {
        try {
            console.log('🎨 Displaying integrated scenarios and binary tree results');
            
            // コンテナ設定
            const displayContainer = container || this.findOrCreateMainContainer();
            this.containers.main = displayContainer;
            
            // 表示エリアクリア
            this.clearDisplayArea(displayContainer);
            
            // Step 1: メインレイアウト構築
            const layoutStructure = this.buildMainLayout(displayContainer);
            
            // Step 2: 8シナリオカード表示
            await this.displayScenarioCards(scenarios, layoutStructure.scenarios);
            
            // Step 3: Binary Tree可視化（利用可能な場合）
            if (binaryTreeData && binaryTreeData.finalEightPaths) {
                await this.displayBinaryTreeVisualization(binaryTreeData, layoutStructure.binaryTree);
            }
            
            // Step 4: HaQei統合セクション
            await this.displayIntegrationSection(scenarios, binaryTreeData, layoutStructure.integration);
            
            // Step 5: レスポンシブ調整
            this.applyResponsiveLayout();
            
            // Step 6: アニメーション適用
            this.applyAnimations();
            
            console.log('✅ Integrated results display completed successfully');
            return { success: true, displayed: { scenarios: scenarios.length, binaryTree: !!binaryTreeData } };
            
        } catch (error) {
            console.error('❌ Error in displayIntegratedResults:', error);
            this.displayErrorState(container, error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * メインレイアウト構築
     */
    buildMainLayout(container) {
        const layoutHTML = `
            <div class="haqei-results-container">
                <!-- ヘッダーセクション -->
                <div class="results-header">
                    <h2 class="results-title">🎯 統合分析結果</h2>
                    <p class="results-subtitle">HaQei哲学に基づく8つの道筋と二分木分析</p>
                </div>
                
                <!-- 8シナリオセクション -->
                <div class="scenarios-section">
                    <div class="section-header">
                        <h3 class="section-title">🌟 8つの未来シナリオ</h3>
                        <p class="section-description">矛盾を受容しながら、状況に応じた最適な道筋を選択できます</p>
                    </div>
                    <div class="scenarios-grid" id="scenarios-container">
                        <!-- シナリオカードがここに挿入される -->
                    </div>
                </div>
                
                <!-- Binary Treeセクション -->
                <div class="binary-tree-section">
                    <div class="section-header">
                        <h3 class="section-title">🌳 段階的分岐分析</h3>
                        <p class="section-description">3段階の選択による8つの到達点を可視化</p>
                    </div>
                    <div class="binary-tree-container" id="binary-tree-container">
                        <!-- Binary Tree可視化がここに挿入される -->
                    </div>
                </div>
                
                <!-- HaQei統合セクション -->
                <div class="integration-section">
                    <div class="section-header">
                        <h3 class="section-title">☯️ HaQei統合的洞察</h3>
                        <p class="section-description">複数の道筋を統合した実践的ガイダンス</p>
                    </div>
                    <div class="integration-content" id="integration-container">
                        <!-- 統合コンテンツがここに挿入される -->
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = layoutHTML;
        
        // 各セクションの参照を保存
        this.containers.scenarios = container.querySelector('#scenarios-container');
        this.containers.binaryTree = container.querySelector('#binary-tree-container');
        this.containers.integration = container.querySelector('#integration-container');
        
        return this.containers;
    }
    
    /**
     * 8シナリオカード表示
     */
    async displayScenarioCards(scenarios, container) {
        if (!scenarios || scenarios.length === 0) {
            container.innerHTML = '<p class="no-scenarios">シナリオが生成されませんでした。</p>';
            return;
        }
        
        console.log(`🎨 Displaying ${scenarios.length} scenario cards`);
        
        // グリッドレイアウト設定
        container.className = 'scenarios-grid';
        container.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        `;
        
        // 各シナリオのカード生成
        scenarios.forEach((scenario, index) => {
            const card = this.createScenarioCard(scenario, index);
            container.appendChild(card);
        });
        
        console.log(`✅ ${scenarios.length} scenario cards displayed`);
    }
    
    /**
     * シナリオカード作成
     */
    createScenarioCard(scenario, index) {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.style.cssText = `
            background: linear-gradient(135deg, ${scenario.visualization?.color || '#757575'}20, ${scenario.visualization?.color || '#757575'}10);
            border: 2px solid ${scenario.visualization?.color || '#757575'};
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            min-height: 200px;
        `;
        
        // ホバーエフェクト
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = `0 8px 25px ${scenario.visualization?.color || '#757575'}40`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
        
        const cardHTML = `
            <div class="card-header">
                <div class="card-icon" style="font-size: 24px; margin-bottom: 10px;">
                    ${scenario.visualization?.icon || '🎯'}
                </div>
                <h4 class="card-title" style="color: ${scenario.visualization?.color || '#333'}; margin: 0 0 10px 0;">
                    ${scenario.customization?.personalizedTitle || scenario.title}
                </h4>
                <div class="card-priority" style="position: absolute; top: 15px; right: 15px; background: ${scenario.visualization?.color || '#757575'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                    優先度: ${scenario.visualization?.priority || 50}%
                </div>
            </div>
            
            <div class="card-body">
                <p class="card-description" style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                    ${scenario.customization?.contextualDescription || scenario.description}
                </p>
                
                <div class="card-metadata">
                    <div class="metadata-item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: bold;">アプローチ:</span>
                        <span>${this.translateApproach(scenario.metadata?.approach)}</span>
                    </div>
                    <div class="metadata-item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: bold;">期間:</span>
                        <span>${scenario.practicalElements?.timeframe || '3-6ヶ月'}</span>
                    </div>
                    <div class="metadata-item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: bold;">信頼度:</span>
                        <span>${Math.round((scenario.metadata?.confidence || 0.5) * 100)}%</span>
                    </div>
                </div>
                
                <div class="card-haqei-elements" style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 8px;">
                    <h5 style="margin: 0 0 8px 0; color: #333;">HaQei要素:</h5>
                    <p style="font-size: 12px; color: #666; margin: 0;">
                        主要分人: ${scenario.HaQeiElements?.personaApplication?.primaryPersona || '判断分人'}<br>
                        状況適用: ${scenario.HaQeiElements?.situationalAdaptation?.optimalConditions?.[0] || '一般的状況'}
                    </p>
                </div>
            </div>
        `;
        
        card.innerHTML = cardHTML;
        
        // クリックイベント
        card.addEventListener('click', () => {
            this.showScenarioDetails(scenario);
        });
        
        return card;
    }
    
    /**
     * Binary Tree可視化表示
     */
    async displayBinaryTreeVisualization(binaryTreeData, container) {
        console.log('🌳 Displaying binary tree visualization');
        
        container.style.cssText = `
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            min-height: 400px;
            position: relative;
        `;
        
        // Binary Tree構造の表示
        const treeHTML = this.buildBinaryTreeHTML(binaryTreeData);
        container.innerHTML = treeHTML;
        
        // インタラクティブな動作を追加
        this.addBinaryTreeInteractivity(container, binaryTreeData);
        
        console.log('✅ Binary tree visualization displayed');
    }
    
    /**
     * Binary Tree HTML構築
     */
    buildBinaryTreeHTML(binaryTreeData) {
        const paths = binaryTreeData.finalEightPaths || [];
        
        if (paths.length === 0) {
            return '<p class="no-binary-tree">二分木データがありません。</p>';
        }
        
        const treeHTML = `
            <div class="binary-tree-visualization">
                <div class="tree-header">
                    <h4>段階的分岐による8つの道筋</h4>
                    <p>各段階での選択により異なる未来へと分岐します</p>
                </div>
                
                <div class="tree-structure">
                    <div class="tree-level level-0">
                        <div class="tree-node root-node">
                            現在の状況
                        </div>
                    </div>
                    
                    <div class="tree-level level-1">
                        <div class="tree-node level-1-node progress-node">
                            順行アプローチ
                        </div>
                        <div class="tree-node level-1-node transform-node">
                            転換アプローチ
                        </div>
                    </div>
                    
                    <div class="tree-level level-2">
                        ${this.generateLevel2Nodes()}
                    </div>
                    
                    <div class="tree-level level-3">
                        ${this.generateLevel3Nodes(paths)}
                    </div>
                </div>
                
                <div class="tree-paths-summary">
                    <h5>8つの到達点:</h5>
                    <div class="paths-grid">
                        ${paths.map((path, index) => this.createPathSummaryCard(path, index)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return treeHTML;
    }
    
    /**
     * Level 2ノード生成
     */
    generateLevel2Nodes() {
        return `
            <div class="tree-node level-2-node continue-node">継続強化</div>
            <div class="tree-node level-2-node adjust-node">部分調整</div>
            <div class="tree-node level-2-node complete-node">完全転換</div>
            <div class="tree-node level-2-node integrate-node">統合変革</div>
        `;
    }
    
    /**
     * Level 3ノード生成
     */
    generateLevel3Nodes(paths) {
        return paths.slice(0, 8).map((path, index) => 
            `<div class="tree-node level-3-node final-node" data-path-index="${index}">
                道筋${index + 1}
            </div>`
        ).join('');
    }
    
    /**
     * パス要約カード作成
     */
    createPathSummaryCard(path, index) {
        return `
            <div class="path-summary-card" data-path="${index}">
                <div class="path-number">${index + 1}</div>
                <div class="path-title">${path.title || `道筋 ${index + 1}`}</div>
                <div class="path-probability">確率: ${Math.round((path.probability || 0.5) * 100)}%</div>
                <div class="path-route">${(path.route || []).join(' → ')}</div>
            </div>
        `;
    }
    
    /**
     * HaQei統合セクション表示
     */
    async displayIntegrationSection(scenarios, binaryTreeData, container) {
        console.log('☯️ Displaying HaQei integration section');
        
        const integrationHTML = `
            <div class="haqei-integration">
                <div class="integration-principles">
                    <div class="principle-card">
                        <h5>🎭 矛盾受容の原則</h5>
                        <p>8つの異なるアプローチが同時に有効であることを受容し、状況に応じて最適な道を選択します。</p>
                    </div>
                    
                    <div class="principle-card">
                        <h5>🔄 分人切り替えの実践</h5>
                        <p>状況や内的状態に応じて、異なる分人（判断する自己の側面）を切り替えることで、柔軟な対応が可能になります。</p>
                    </div>
                    
                    <div class="principle-card">
                        <h5>⚖️ 統合的バランス</h5>
                        <p>極端な選択を避け、複数の要素を統合した中庸の道も常に選択肢として保持します。</p>
                    </div>
                </div>
                
                <div class="practical-guidance">
                    <h4>実践的ガイダンス</h4>
                    <div class="guidance-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <span class="step-text">8つのシナリオを全て理解し、それぞれの価値を認識する</span>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <span class="step-text">現在の状況と内的状態（主導的分人）を確認する</span>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <span class="step-text">最も共鳴するシナリオを選択し、実行計画を立てる</span>
                        </div>
                        <div class="step">
                            <span class="step-number">4</span>
                            <span class="step-text">状況変化に応じて他のシナリオへの切り替えを検討する</span>
                        </div>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>次のステップ</h4>
                    <div class="next-steps-actions">
                        <button class="action-btn primary" onclick="window.haqeiScenariosDisplayUI?.exportResults()">
                            📊 結果をエクスポート
                        </button>
                        <button class="action-btn secondary" onclick="window.haqeiScenariosDisplayUI?.showDetailedAnalysis()">
                            🔍 詳細分析を表示
                        </button>
                        <button class="action-btn secondary" onclick="window.haqeiScenariosDisplayUI?.scheduleFollowUp()">
                            📅 フォローアップ設定
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = integrationHTML;
        
        // スタイル適用
        this.applyIntegrationStyles(container);
        
        console.log('✅ HaQei integration section displayed');
    }
    
    /**
     * 統合セクションスタイル適用
     */
    applyIntegrationStyles(container) {
        const style = document.createElement('style');
        style.textContent = `
            .haqei-integration {
                max-width: 100%;
                margin: 0 auto;
            }
            
            .integration-principles {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .principle-card {
                background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                padding: 20px;
                border-radius: 12px;
                border-left: 4px solid #2196f3;
            }
            
            .principle-card h5 {
                margin: 0 0 10px 0;
                color: #1976d2;
            }
            
            .guidance-steps {
                margin-top: 15px;
            }
            
            .step {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 8px;
            }
            
            .step-number {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                background: #4caf50;
                color: white;
                border-radius: 50%;
                margin-right: 15px;
                font-weight: bold;
            }
            
            .next-steps-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 15px;
            }
            
            .action-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .action-btn.primary {
                background: #4caf50;
                color: white;
            }
            
            .action-btn.secondary {
                background: #f5f5f5;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
        `;
        
        if (!document.head.querySelector('#haqei-integration-styles')) {
            style.id = 'haqei-integration-styles';
            document.head.appendChild(style);
        }
    }
    
    /**
     * レスポンシブレイアウト適用
     */
    applyResponsiveLayout() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .scenarios-grid {
                    grid-template-columns: 1fr !important;
                }
                
                .integration-principles {
                    grid-template-columns: 1fr !important;
                }
                
                .next-steps-actions {
                    flex-direction: column;
                }
                
                .action-btn {
                    width: 100%;
                }
            }
            
            @media (max-width: 480px) {
                .haqei-results-container {
                    padding: 10px;
                }
                
                .scenario-card {
                    padding: 15px !important;
                }
            }
        `;
        
        if (!document.head.querySelector('#haqei-responsive-styles')) {
            style.id = 'haqei-responsive-styles';
            document.head.appendChild(style);
        }
    }
    
    /**
     * アニメーション適用
     */
    applyAnimations() {
        // シナリオカードのアニメーション
        const scenarioCards = this.containers.main.querySelectorAll('.scenario-card');
        scenarioCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Binary Tree要素のアニメーション
        const treeNodes = this.containers.main.querySelectorAll('.tree-node');
        treeNodes.forEach((node, index) => {
            node.style.opacity = '0';
            node.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                node.style.transition = 'all 0.4s ease';
                node.style.opacity = '1';
                node.style.transform = 'scale(1)';
            }, 500 + (index * 50));
        });
    }
    
    // ======================
    // ユーティリティメソッド群
    // ======================
    
    findOrCreateMainContainer() {
        let container = document.getElementById('results-container') || 
                       document.getElementById('future-simulator-results') ||
                       document.querySelector('.results-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'results-container';
            container.className = 'haqei-results-main';
            
            // 適切な親要素を見つけて挿入
            const parentElement = document.querySelector('.main-content') ||
                                 document.querySelector('#future-analysis-results') ||
                                 document.body;
            parentElement.appendChild(container);
        }
        
        return container;
    }
    
    clearDisplayArea(container) {
        container.innerHTML = '';
        container.className = 'haqei-results-main';
    }
    
    translateApproach(approach) {
        const translations = {
            'proactive': '積極的',
            'adaptive': '適応的',
            'transformative': '変革的',
            'decisive': '決断的',
            'strengthening': '強化的',
            'harmonizing': '調和的',
            'integrative': '統合的',
            'innovative': '革新的',
            'general': '一般的'
        };
        
        return translations[approach] || '一般的';
    }
    
    addBinaryTreeInteractivity(container, binaryTreeData) {
        // パス要約カードのクリックイベント
        const pathCards = container.querySelectorAll('.path-summary-card');
        pathCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                this.highlightTreePath(index, binaryTreeData);
                this.showPathDetails(binaryTreeData.finalEightPaths[index]);
            });
        });
        
        // Tree nodeのホバーエフェクト
        const treeNodes = container.querySelectorAll('.tree-node');
        treeNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                node.style.transform = 'scale(1.05)';
                node.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });
            
            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
                node.style.boxShadow = 'none';
            });
        });
    }
    
    highlightTreePath(pathIndex, binaryTreeData) {
        // ツリーパスのハイライト表示（実装詳細は省略）
        console.log(`Highlighting path ${pathIndex}`);
    }
    
    showPathDetails(pathData) {
        // パス詳細表示（モーダルまたはサイドパネル）
        const modal = document.createElement('div');
        modal.className = 'path-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>${pathData.title}</h4>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>説明:</strong> ${pathData.fullDescription || pathData.description}</p>
                    <p><strong>確率:</strong> ${Math.round((pathData.probability || 0.5) * 100)}%</p>
                    <p><strong>経路:</strong> ${(pathData.route || []).join(' → ')}</p>
                    ${pathData.timeline ? `<p><strong>期間:</strong> ${pathData.timeline}</p>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 閉じるボタンのイベント
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    showScenarioDetails(scenario) {
        // シナリオ詳細表示（既存のshowPathDetailsと同様）
        console.log('Showing scenario details:', scenario);
    }
    
    displayErrorState(container, error) {
        const errorHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>表示エラーが発生しました</h3>
                <p>エラー内容: ${error.message}</p>
                <button onclick="location.reload()" class="retry-btn">再読み込み</button>
            </div>
        `;
        
        if (container) {
            container.innerHTML = errorHTML;
        }
    }
    
    // アクションボタンメソッド群
    exportResults() {
        console.log('📊 Exporting results...');
        // 結果エクスポート機能の実装
    }
    
    showDetailedAnalysis() {
        console.log('🔍 Showing detailed analysis...');
        // 詳細分析表示機能の実装
    }
    
    scheduleFollowUp() {
        console.log('📅 Scheduling follow-up...');
        // フォローアップスケジュール機能の実装
    }
    
    /**
     * システム情報取得
     */
    getSystemInfo() {
        return {
            version: this.version,
            displayAlignment: this.displayAlignment,
            initialized: this.initialized,
            displayConfig: this.displayConfig,
            containersConnected: Object.keys(this.containers).length
        };
    }
}

// グローバル公開
if (typeof window !== 'undefined') {
    window.ScenariosDisplayUI = ScenariosDisplayUI;
    
    // グローバルインスタンス作成
    if (!window.haqeiScenariosDisplayUI) {
        window.haqeiScenariosDisplayUI = new ScenariosDisplayUI();
    }
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScenariosDisplayUI;
}

console.log('🎨 ScenariosDisplayUI.js loaded successfully - 統合シナリオ表示システム');