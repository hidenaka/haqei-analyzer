/**
 * OSVoiceSwitcher.js
 * 
 * OS声切り替えシステム - Phase 3 UI/UX Enhancement
 * 
 * 説明: 3つのOS（Engine/Interface/SafeMode）の視点を切り替えて
 * ユーザーが異なる人格の声で同じ分析を体験できるシステム
 * 
 * 作成: 2025年7月31日
 * Phase: 3.2 インタラクティブ要素実装
 */

class OSVoiceSwitcher {
    constructor(virtualPersonality, containerId) {
        this.virtualPersonality = virtualPersonality;
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        
        if (!this.virtualPersonality) {
            throw new Error('VirtualPersonality instance is required');
        }
        
        // 現在選択されているOS
        this.currentOS = 'integrated'; // 'engine', 'interface', 'safemode', 'integrated'
        
        // OS切り替え状態
        this.isTransitioning = false;
        this.transitionDuration = 500; // ミリ秒
        
        // 表示コンテンツのキャッシュ
        this.contentCache = {
            integrated: null,
            engine: null,
            interface: null,
            safemode: null
        };
        
        // イベントリスナー
        this.eventListeners = [];
        
        console.log('🔄 OSVoiceSwitcher initialized');
    }
    
    /**
     * OS切り替えUI初期化
     */
    async initialize() {
        try {
            this.renderSwitcherUI();
            this.bindEvents();
            
            // 統合コンテンツを初期表示
            await this.generateIntegratedContent();
            this.displayContent('integrated');
            
            console.log('✅ OSVoiceSwitcher initialization completed');
            
        } catch (error) {
            console.error('❌ OSVoiceSwitcher initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * 切り替えUIのレンダリング
     */
    renderSwitcherUI() {
        const html = `
            <div class="os-voice-switcher">
                <div class="switcher-header">
                    <h3 class="switcher-title">
                        <span class="switcher-icon">🎭</span>
                        視点切り替え
                    </h3>
                    <p class="switcher-subtitle">
                        3つのOS人格の異なる視点で分析結果を体験できます
                    </p>
                </div>
                
                <div class="os-tabs">
                    <button class="os-tab active" data-os="integrated">
                        <div class="tab-icon">🔮</div>
                        <div class="tab-content">
                            <div class="tab-name">統合視点</div>
                            <div class="tab-description">全体のバランス</div>
                        </div>
                    </button>
                    
                    <button class="os-tab" data-os="engine">
                        <div class="tab-icon">🧠</div>
                        <div class="tab-content">
                            <div class="tab-name">価値観OS</div>
                            <div class="tab-description">理想と信念</div>
                        </div>
                        <div class="activation-level" data-level="${this.getActivationLevel('engine')}">
                            ${(this.virtualPersonality.engineOS.activation * 100).toFixed(0)}%
                        </div>
                    </button>
                    
                    <button class="os-tab" data-os="interface">
                        <div class="tab-icon">🤝</div>
                        <div class="tab-content">
                            <div class="tab-name">社会的OS</div>
                            <div class="tab-description">関係と調和</div>
                        </div>
                        <div class="activation-level" data-level="${this.getActivationLevel('interface')}">
                            ${(this.virtualPersonality.interfaceOS.activation * 100).toFixed(0)}%
                        </div>
                    </button>
                    
                    <button class="os-tab" data-os="safemode">
                        <div class="tab-icon">🛡️</div>
                        <div class="tab-content">
                            <div class="tab-name">防御OS</div>
                            <div class="tab-description">安全と安定</div>
                        </div>
                        <div class="activation-level" data-level="${this.getActivationLevel('safemode')}">
                            ${(this.virtualPersonality.safeModeOS.activation * 100).toFixed(0)}%
                        </div>
                    </button>
                </div>
                
                <div class="content-display">
                    <div class="content-header">
                        <div class="current-os-indicator">
                            <span class="os-name">統合視点</span>
                            <span class="os-status">全体のバランスで分析</span>
                        </div>
                        <div class="transition-indicator">
                            <div class="transition-progress"></div>
                        </div>
                    </div>
                    
                    <div class="content-body">
                        <div class="content-loading">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">コンテンツを準備中...</div>
                        </div>
                    </div>
                </div>
                
                <div class="os-comparison">
                    <button class="comparison-button" onclick="this.showOSComparison()">
                        <span class="comparison-icon">⚖️</span>
                        OS比較分析を表示
                    </button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }
    
    /**
     * イベントリスナーの登録
     */
    bindEvents() {
        const tabs = this.container.querySelectorAll('.os-tab');
        
        tabs.forEach(tab => {
            const clickHandler = (event) => {
                event.preventDefault();
                const osType = tab.dataset.os;
                this.switchToOS(osType);
            };
            
            tab.addEventListener('click', clickHandler);
            this.eventListeners.push({ element: tab, event: 'click', handler: clickHandler });
        });
        
        // キーボードショートカット
        const keyHandler = (event) => {
            if (event.altKey) {
                switch(event.key) {
                    case '1':
                        this.switchToOS('integrated');
                        break;
                    case '2':
                        this.switchToOS('engine');
                        break;
                    case '3':
                        this.switchToOS('interface');
                        break;
                    case '4':
                        this.switchToOS('safemode');
                        break;
                }
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        this.eventListeners.push({ element: document, event: 'keydown', handler: keyHandler });
    }
    
    /**
     * OS切り替えメイン処理
     * @param {string} osType - 切り替え先のOS種別
     */
    async switchToOS(osType) {
        if (this.isTransitioning) {
            console.log('⚠️ OS transition already in progress');
            return;
        }
        
        if (osType === this.currentOS) {
            console.log(`⚠️ Already displaying ${osType} perspective`);
            return;
        }
        
        try {
            this.isTransitioning = true;
            
            console.log(`🔄 Switching OS perspective: ${this.currentOS} → ${osType}`);
            
            // UIの更新
            this.updateTabState(osType);
            this.showTransitionEffect();
            
            // コンテンツの生成・取得
            await this.ensureContentGenerated(osType);
            
            // トランジションアニメーション
            await this.triggerOSTransitionAnimation();
            
            // コンテンツの表示
            this.displayContent(osType);
            
            // 状態更新
            this.currentOS = osType;
            
            // 完了イベント発火
            this.dispatchSwitchEvent(osType);
            
            console.log(`✅ OS perspective switched to: ${osType}`);
            
        } catch (error) {
            console.error('❌ OS switching failed:', error);
            this.showSwitchError(error);
        } finally {
            this.isTransitioning = false;
            this.hideTransitionEffect();
        }
    }
    
    /**
     * タブ状態の更新
     * @param {string} activeOS - アクティブなOS
     */
    updateTabState(activeOS) {
        const tabs = this.container.querySelectorAll('.os-tab');
        
        tabs.forEach(tab => {
            const osType = tab.dataset.os;
            
            if (osType === activeOS) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // ヘッダー情報の更新
        const osIndicator = this.container.querySelector('.current-os-indicator');
        if (osIndicator) {
            const osInfo = this.getOSDisplayInfo(activeOS);
            osIndicator.querySelector('.os-name').textContent = osInfo.name;
            osIndicator.querySelector('.os-status').textContent = osInfo.status;
        }
    }
    
    /**
     * コンテンツ生成の確保
     * @param {string} osType - OS種別
     */
    async ensureContentGenerated(osType) {
        if (this.contentCache[osType]) {
            console.log(`📦 Using cached content for ${osType}`);
            return;
        }
        
        console.log(`🔄 Generating content for ${osType}`);
        
        switch (osType) {
            case 'integrated':
                this.contentCache[osType] = await this.generateIntegratedContent();
                break;
            case 'engine':
                this.contentCache[osType] = await this.generateEngineOSContent();
                break;
            case 'interface':
                this.contentCache[osType] = await this.generateInterfaceOSContent();
                break;
            case 'safemode':
                this.contentCache[osType] = await this.generateSafeModeOSContent();
                break;
            default:
                throw new Error(`Unknown OS type: ${osType}`);
        }
        
        console.log(`✅ Content generated for ${osType}`);
    }
    
    /**
     * 統合コンテンツ生成
     */
    async generateIntegratedContent() {
        const osBalance = this.virtualPersonality.personalityState.osBalance;
        const dominantOS = this.virtualPersonality.personalityState.currentDominantOS;
        
        return {
            summary: `3つのOS人格のバランス分析により、あなたの統合的な人格特性を表現します。主導的なのは${this.getOSDisplayName(dominantOS)}で、全体として調和のとれた人格構造を持っています。`,
            
            osAnalysis: {
                balance: `価値観OS: ${(osBalance.engine * 100).toFixed(1)}%, 社会的OS: ${(osBalance.interface * 100).toFixed(1)}%, 防御OS: ${(osBalance.safemode * 100).toFixed(1)}%`,
                dominance: this.getOSDisplayName(dominantOS),
                coherence: `全体一貫性: ${(this.virtualPersonality.personalityState.overallCoherence * 100).toFixed(1)}%`
            },
            
            keyInsights: [
                `主導的人格: ${this.getOSDisplayName(dominantOS)}が判断の中心となっています`,
                `内的調和: ${(this.virtualPersonality.personalityState.internalHarmony * 100).toFixed(1)}%の安定した内的バランス`,
                `適応性: ${(this.virtualPersonality.personalityState.adaptabilityIndex * 100).toFixed(1)}%の環境適応能力`,
                `人格タイプ: ${this.virtualPersonality.personalityMetadata?.personalityType || '統合型'}として分類`
            ],
            
            actionRecommendations: [
                '3つのOS視点を切り替えて、多角的な自己理解を深めましょう',
                '主導的人格の強みを活かしつつ、他のOSの視点も尊重しましょう',
                '状況に応じて適切なOSの声に耳を傾けることで、より良い判断ができます'
            ]
        };
    }
    
    /**
     * Engine OS専用コンテンツ生成
     */
    async generateEngineOSContent() {
        const engineOS = this.virtualPersonality.engineOS;
        
        return {
            summary: `価値観OSの視点から、あなたの核となる信念と理想について分析します。${engineOS.personality.voice}を特徴とし、創造性と理想の追求を重視します。`,
            
            osProfile: {
                activation: `活性度: ${(engineOS.activation * 100).toFixed(1)}%`,
                hexagram: `対応卦: ${engineOS.hexagramName}`,
                voice: engineOS.personality.voice,
                primaryTraits: engineOS.characteristics.primary_traits
            },
            
            keyInsights: [
                `価値観の明確度: ${(engineOS.activation * 100).toFixed(1)}%で、あなたの信念は${engineOS.activation > 0.7 ? '非常に明確' : '発展途上'}です`,
                `優先事項: ${engineOS.personality.priorities.join('、')}`,
                `核心的強み: ${engineOS.personality.strengths.join('、')}`,
                `創造的表現: ${engineOS.characteristics.primary_traits.includes('創造的') ? '強い創造的衝動を持っています' : '着実な価値観を重視します'}`
            ],
            
            actionRecommendations: [
                '理想と現実のバランスを意識して行動しましょう',
                '価値観に基づいた判断を大切にしてください',
                '創造的な表現の機会を積極的に求めましょう',
                '長期的なビジョンを持って計画を立てましょう'
            ],
            
            situationalAdvice: {
                decision: '重要な決断では、まず自分の価値観と一致するかを確認してください',
                conflict: '価値観の対立が生じた時は、根本的な信念に立ち返りましょう',
                growth: '理想を追求する過程で、現実的なステップを設定しましょう'
            }
        };
    }
    
    /**
     * Interface OS専用コンテンツ生成
     */
    async generateInterfaceOSContent() {
        const interfaceOS = this.virtualPersonality.interfaceOS;
        
        return {
            summary: `社会的OSの視点から、あなたの人間関係と社会的表現について分析します。${interfaceOS.personality.voice}を特徴とし、調和と協力を重視します。`,
            
            osProfile: {
                activation: `活性度: ${(interfaceOS.activation * 100).toFixed(1)}%`,
                hexagram: `対応卦: ${interfaceOS.hexagramName}`,
                voice: interfaceOS.personality.voice,
                primaryTraits: interfaceOS.characteristics.primary_traits
            },
            
            keyInsights: [
                `社会性の発達度: ${(interfaceOS.activation * 100).toFixed(1)}%で、${interfaceOS.activation > 0.7 ? '高い社会適応力' : '選択的な社会参加'}を示します`,
                `重視する価値: ${interfaceOS.personality.priorities.join('、')}`,
                `社会的強み: ${interfaceOS.personality.strengths.join('、')}`,
                `対人関係: ${interfaceOS.characteristics.primary_traits.includes('協調的') ? '自然な協調性を持っています' : '独自のコミュニケーションスタイルを持っています'}`
            ],
            
            actionRecommendations: [
                '他者との関係性を大切にしながら行動しましょう',
                '共感と理解を基盤とした対話を心がけてください',
                'チームワークを活かせる環境を選びましょう',
                '社会的な貢献を通じて充実感を得ましょう'
            ],
            
            situationalAdvice: {
                workplace: '職場では協調性を活かし、チームの調和を重視してください',
                relationships: '人間関係では相手の立場を理解し、Win-Winの関係を目指しましょう',
                communication: 'コミュニケーションでは傾聴と共感を大切にしてください'
            }
        };
    }
    
    /**
     * SafeMode OS専用コンテンツ生成
     */
    async generateSafeModeOSContent() {
        const safeModeOS = this.virtualPersonality.safeModeOS;
        
        return {
            summary: `防御OSの視点から、あなたの安全確保と危機管理について分析します。${safeModeOS.personality.voice}を特徴とし、安定性と慎重さを重視します。`,
            
            osProfile: {
                activation: `活性度: ${(safeModeOS.activation * 100).toFixed(1)}%`,
                hexagram: `対応卦: ${safeModeOS.hexagramName}`,
                voice: safeModeOS.personality.voice,
                primaryTraits: safeModeOS.characteristics.primary_traits
            },
            
            keyInsights: [
                `防御機制の発達: ${(safeModeOS.activation * 100).toFixed(1)}%で、${safeModeOS.activation > 0.7 ? '高い危機管理能力' : '柔軟な適応スタイル'}を持っています`,
                `安全重視度: ${safeModeOS.personality.priorities.join('、')}`,
                `防御的強み: ${safeModeOS.personality.strengths.join('、')}`,
                `ストレス対処: ${safeModeOS.characteristics.primary_traits.includes('慎重') ? '計画的なリスク管理を行います' : '状況に応じた柔軟な対処をします'}`
            ],
            
            actionRecommendations: [
                'リスクを適切に評価し、安全な選択肢を確保しましょう',
                '慎重さを活かして、長期的な安定を追求してください',
                'ストレス管理の方法を身につけ、定期的に実践しましょう',
                '予期しない変化に備えて、複数の選択肢を準備しましょう'
            ],
            
            situationalAdvice: {
                crisis: '危機的状況では冷静な分析と段階的な対処を心がけてください',
                planning: '計画立案時はリスク要因の検討と代替案の準備を怠らないでください',
                stress: 'ストレス時は一旦立ち止まり、客観的な視点で状況を整理しましょう'
            }
        };
    }
    
    /**
     * コンテンツ表示
     * @param {string} osType - 表示するOS種別
     */
    displayContent(osType) {
        const contentBody = this.container.querySelector('.content-body');
        const content = this.contentCache[osType];
        
        if (!content) {
            contentBody.innerHTML = '<div class="error-message">コンテンツの生成に失敗しました</div>';
            return;
        }
        
        const html = `
            <div class="os-content" data-os="${osType}">
                <div class="content-summary">
                    <h4>概要</h4>
                    <p>${content.summary}</p>
                </div>
                
                ${osType !== 'integrated' ? `
                <div class="os-profile">
                    <h4>OS詳細プロファイル</h4>
                    <div class="profile-grid">
                        <div class="profile-item">
                            <span class="profile-label">活性度</span>
                            <span class="profile-value">${content.osProfile.activation}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">対応卦</span>
                            <span class="profile-value">${content.osProfile.hexagram}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">特徴的な声</span>
                            <span class="profile-value">${content.osProfile.voice}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">主要特性</span>
                            <span class="profile-value">${content.osProfile.primaryTraits.join('、')}</span>
                        </div>
                    </div>
                </div>
                ` : `
                <div class="os-analysis">
                    <h4>統合分析</h4>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <span class="analysis-label">OSバランス</span>
                            <span class="analysis-value">${content.osAnalysis.balance}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">主導OS</span>
                            <span class="analysis-value">${content.osAnalysis.dominance}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">一貫性</span>
                            <span class="analysis-value">${content.osAnalysis.coherence}</span>
                        </div>
                    </div>
                </div>
                `}
                
                <div class="key-insights">
                    <h4>主要な洞察</h4>
                    <ul class="insight-list">
                        ${content.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="action-recommendations">
                    <h4>行動提案</h4>
                    <ul class="recommendation-list">
                        ${content.actionRecommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                
                ${osType !== 'integrated' ? `
                <div class="situational-advice">
                    <h4>状況別アドバイス</h4>
                    <div class="advice-grid">
                        ${Object.entries(content.situationalAdvice).map(([situation, advice]) => `
                        <div class="advice-item">
                            <div class="advice-situation">${this.getSituationLabel(situation)}</div>
                            <div class="advice-content">${advice}</div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        contentBody.innerHTML = html;
    }
    
    /**
     * トランジションアニメーション
     */
    async triggerOSTransitionAnimation() {
        const contentBody = this.container.querySelector('.content-body');
        
        // フェードアウト
        contentBody.style.opacity = '0';
        contentBody.style.transform = 'translateY(20px)';
        
        await this.sleep(this.transitionDuration / 2);
        
        // フェードイン
        contentBody.style.transition = `opacity ${this.transitionDuration}ms ease, transform ${this.transitionDuration}ms ease`;
        contentBody.style.opacity = '1';
        contentBody.style.transform = 'translateY(0)';
        
        await this.sleep(this.transitionDuration / 2);
    }
    
    /**
     * トランジション効果表示
     */
    showTransitionEffect() {
        const indicator = this.container.querySelector('.transition-progress');
        if (indicator) {
            indicator.style.width = '100%';
        }
    }
    
    /**
     * トランジション効果非表示
     */
    hideTransitionEffect() {
        const indicator = this.container.querySelector('.transition-progress');
        if (indicator) {
            setTimeout(() => {
                indicator.style.width = '0%';
            }, 500);
        }
    }
    
    /**
     * OS比較分析表示
     */
    showOSComparison() {
        const comparisonData = this.generateOSComparison();
        
        // モーダルダイアログで表示
        const modal = document.createElement('div');
        modal.className = 'os-comparison-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>3つのOS比較分析</h3>
                    <button class="modal-close" onclick="this.closest('.os-comparison-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${comparisonData.html}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    /**
     * OS比較データ生成
     */
    generateOSComparison() {
        const engines = this.virtualPersonality.engineOS;
        const interfaceOS = this.virtualPersonality.interfaceOS;
        const safemode = this.virtualPersonality.safeModeOS;
        
        return {
            html: `
                <div class="comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>比較項目</th>
                                <th>価値観OS</th>
                                <th>社会的OS</th>
                                <th>防御OS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>活性度</td>
                                <td>${(engines.activation * 100).toFixed(1)}%</td>
                                <td>${(interfaceOS.activation * 100).toFixed(1)}%</td>
                                <td>${(safemode.activation * 100).toFixed(1)}%</td>
                            </tr>
                            <tr>
                                <td>対応卦</td>
                                <td>${engines.hexagramName}</td>
                                <td>${interfaceOS.hexagramName}</td>
                                <td>${safemode.hexagramName}</td>
                            </tr>
                            <tr>
                                <td>主要特性</td>
                                <td>${engines.characteristics.primary_traits.join('、')}</td>
                                <td>${interfaceOS.characteristics.primary_traits.join('、')}</td>
                                <td>${safemode.characteristics.primary_traits.join('、')}</td>
                            </tr>
                            <tr>
                                <td>声の特徴</td>
                                <td>${engines.personality.voice}</td>
                                <td>${interfaceOS.personality.voice}</td>
                                <td>${safemode.personality.voice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        };
    }
    
    // ユーティリティメソッド
    
    /**
     * OS表示名取得
     * @param {string} osType - OS種別
     */
    getOSDisplayName(osType) {
        const names = {
            'engine': '価値観OS',
            'interface': '社会的OS',
            'safemode': '防御OS',
            'integrated': '統合視点'
        };
        return names[osType] || osType;
    }
    
    /**
     * OS表示情報取得
     * @param {string} osType - OS種別
     */
    getOSDisplayInfo(osType) {
        const info = {
            'integrated': { name: '統合視点', status: '全体のバランスで分析' },
            'engine': { name: '価値観OS', status: '理想と信念の視点' },
            'interface': { name: '社会的OS', status: '関係と調和の視点' },
            'safemode': { name: '防御OS', status: '安全と安定の視点' }
        };
        return info[osType] || { name: osType, status: '分析中...' };
    }
    
    /**
     * 活性度レベル取得
     * @param {string} osType - OS種別
     */
    getActivationLevel(osType) {
        let activation = 0;
        
        switch (osType) {
            case 'engine':
                activation = this.virtualPersonality.engineOS.activation;
                break;
            case 'interface':
                activation = this.virtualPersonality.interfaceOS.activation;
                break;
            case 'safemode':
                activation = this.virtualPersonality.safeModeOS.activation;
                break;
        }
        
        if (activation >= 0.8) return 'high';
        if (activation >= 0.6) return 'medium';
        return 'low';
    }
    
    /**
     * 状況ラベル取得
     * @param {string} situation - 状況キー
     */
    getSituationLabel(situation) {
        const labels = {
            'decision': '重要な決断時',
            'conflict': '価値観の対立時',
            'growth': '成長・発展時',
            'workplace': '職場環境',
            'relationships': '人間関係',
            'communication': 'コミュニケーション',
            'crisis': '危機的状況',
            'planning': '計画立案時',
            'stress': 'ストレス時'
        };
        return labels[situation] || situation;
    }
    
    /**
     * 切り替えイベント発火
     * @param {string} osType - 切り替え先OS
     */
    dispatchSwitchEvent(osType) {
        const event = new CustomEvent('osVoiceSwitched', {
            detail: {
                fromOS: this.currentOS,
                toOS: osType,
                virtualPersonality: this.virtualPersonality,
                timestamp: Date.now()
            }
        });
        
        this.container.dispatchEvent(event);
    }
    
    /**
     * エラー表示
     * @param {Error} error - エラー情報
     */
    showSwitchError(error) {
        const contentBody = this.container.querySelector('.content-body');
        if (contentBody) {
            contentBody.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <div class="error-text">OS切り替えに失敗しました: ${error.message}</div>
                    <button class="error-retry" onclick="location.reload()">再試行</button>
                </div>
            `;
        }
    }
    
    /**
     * 待機ユーティリティ
     * @param {number} ms - 待機時間（ミリ秒）
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 破棄処理
     */
    destroy() {
        // イベントリスナーの削除
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // キャッシュクリア
        this.contentCache = {};
        
        // DOM要素クリア
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log('🗑️ OSVoiceSwitcher destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OSVoiceSwitcher;
}

console.log('🔄 OSVoiceSwitcher class loaded successfully');