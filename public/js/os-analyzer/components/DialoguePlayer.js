/**
 * DialoguePlayer.js
 * 
 * 内部対話再生システム - Phase 3 UI/UX Enhancement
 * 
 * 説明: 3つのOS間の複雑な内部対話を段階的に再生し、
 * ユーザーが自分の内なる声の相互作用を視覚的に体験できるシステム
 * 
 * 作成: 2025年7月31日
 * Phase: 3.2 インタラクティブ要素実装
 */

class DialoguePlayer {
    constructor(relationshipEngine, containerId) {
        this.relationshipEngine = relationshipEngine;
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        
        if (!this.relationshipEngine) {
            throw new Error('OSRelationshipEngine instance is required');
        }
        
        // 再生状態
        this.isPlaying = false;
        this.isPaused = false;
        this.currentDialogue = null;
        this.currentExchangeIndex = 0;
        this.playbackSpeed = 1.0;
        
        // 再生設定
        this.exchangeDelay = 2500; // 発言間の間隔（ミリ秒）
        this.typingSpeed = 50;     // タイピング効果の速度（ミリ秒/文字）
        
        // UI要素参照
        this.playerUI = null;
        this.dialogueDisplay = null;
        this.controlButtons = null;
        
        // イベントリスナー
        this.eventListeners = [];
        
        // SNS共有システム統合
        this.shareManager = null;
        this.imageExporter = null;
        this.initializeSharingComponents();
        
        // 予設定されたシナリオ（拡充版）
        this.presetScenarios = [
            // 基本シナリオ
            {
                id: 'career_change',
                name: '転職・キャリアチェンジ',
                description: '新しい職場への転職を検討している状況',
                category: '30代向け',
                context: '現在の職場に満足していないが、転職にはリスクもある。家族の生活も考慮する必要がある重要な決断場面。'
            },
            {
                id: 'relationship_conflict',
                name: '人間関係の対立',
                description: '重要な人との価値観の違いによる対立',
                category: '40代向け',
                context: '大切な人との間で価値観の違いが表面化し、関係性の見直しが必要になった状況。'
            },
            {
                id: 'life_direction',
                name: '人生の方向性',
                description: '将来の人生設計についての重要な選択',
                category: '20代向け',
                context: 'これからの人生の方向性を見直す必要があり、理想と現実のバランスを考える局面。'
            },
            {
                id: 'creative_challenge',
                name: '創造的挑戦',
                description: '新しい創造的プロジェクトへの挑戦',
                category: '全年代',
                context: '安定した現状を捨てて、創造的だが不確実な新しいプロジェクトに挑戦するかどうかの判断。'
            },
            {
                id: 'family_responsibility',
                name: '家族の責任',
                description: '家族の責任と個人の願望の両立',
                category: '40代向け',
                context: '家族の責任を果たしながら、個人的な夢や目標も追求したいという複雑な状況。'
            },
            
            // 年代別特化シナリオ（拡充）
            {
                id: 'job_hunting',
                name: '就職活動の企業選択',
                description: '複数の内定先から最終選択をする状況',
                category: '20代向け',
                context: '大手安定企業とベンチャー企業、それぞれ異なる魅力を持つ複数の内定先から最終的な就職先を選ぶ重要な局面。'
            },
            {
                id: 'marriage_decision',
                name: '結婚・パートナーシップ',
                description: '人生のパートナーとの将来を決める選択',
                category: '20-30代向け',
                context: '長年付き合っているパートナーとの結婚を具体的に検討する段階で、様々な不安と期待が入り混じっている状況。'
            },
            {
                id: 'parenting_approach',
                name: '子育て方針の選択',
                description: '子どもの教育・成長方針についての判断',
                category: '30-40代向け',
                context: '子どもの将来を考えて、厳格な教育方針と自由な成長を重視する方針のどちらを選ぶか迷っている状況。'
            },
            {
                id: 'elderly_care',
                name: '親の介護問題',
                description: '高齢の親の介護方法についての重要な選択',
                category: '40代向け',
                context: '高齢になった親の介護が必要になり、在宅介護か施設入所か、また仕事との両立をどうするかの判断が必要な状況。'
            },
            {
                id: 'side_business',
                name: '副業・起業の検討',
                description: '安定した職に就きながら新しい挑戦をするかの判断',
                category: '30代向け',
                context: '現在の仕事を続けながら副業を始めるか、思い切って起業するか、それとも現状維持するかの選択。'
            }
        ];
        
        // カスタムシナリオ履歴
        this.customScenarios = [];
        
        // 人気シナリオトラッキング
        this.scenarioStats = {};
        
        console.log('🎭 DialoguePlayer initialized');
    }
    
    /**
     * 共有コンポーネント初期化
     */
    async initializeSharingComponents() {
        try {
            // ShareManagerの動的インポート
            if (typeof ShareManager !== 'undefined') {
                this.shareManager = new ShareManager({
                    expirationDays: 7,
                    enableAnalytics: true,
                    keyPrefix: 'haqei_dialogue_share_'
                });
            } else {
                console.warn('ShareManager not found, loading from core...');
                // ShareManager.jsを動的に読み込み
                await this.loadScript('/js/core/ShareManager.js');
                this.shareManager = new ShareManager();
            }
            
            // ImageExporterの動的インポート
            if (typeof ImageExporter !== 'undefined') {
                this.imageExporter = new ImageExporter({
                    includeWatermark: true,
                    watermarkText: 'HAQEI 内部対話分析',
                    socialMediaFormats: {
                        twitter: { width: 1200, height: 675 },
                        instagram: { width: 1080, height: 1080 },
                        facebook: { width: 1200, height: 630 },
                        linkedin: { width: 1200, height: 627 },
                        tiktok: { width: 1080, height: 1920 }
                    }
                });
            } else {
                console.warn('ImageExporter not found, loading from core...');
                await this.loadScript('/js/core/ImageExporter.js');
                this.imageExporter = new ImageExporter();
            }
            
            console.log('📤 Sharing components initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize sharing components:', error);
            // 共有機能なしでも動作を継続
        }
    }
    
    /**
     * スクリプト動的読み込み
     */
    async loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // 既に読み込まれている
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * 対話プレイヤーUI初期化
     */
    async initialize() {
        try {
            this.renderPlayerUI();
            this.bindEvents();
            
            // 保存済みカスタムシナリオを読み込み
            this.loadCustomScenariosFromStorage();
            
            console.log('✅ DialoguePlayer initialization completed');
            
        } catch (error) {
            console.error('❌ DialoguePlayer initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * プレイヤーUIのレンダリング
     */
    renderPlayerUI() {
        const html = `
            <div class="dialogue-player">
                <div class="player-header">
                    <h3 class="player-title">
                        <span class="player-icon">🎬</span>
                        内部対話シミュレーター
                    </h3>
                    <p class="player-subtitle">
                        3つのOS人格が様々なシナリオでどのように対話するかを再生・体験できます
                    </p>
                </div>
                
                <div class="scenario-selector">
                    <h4 class="selector-title">シナリオ選択</h4>
                    
                    <!-- カテゴリフィルター -->
                    <div class="category-filter">
                        <button class="filter-btn active" data-category="all">すべて</button>
                        <button class="filter-btn" data-category="20代向け">20代向け</button>
                        <button class="filter-btn" data-category="30代向け">30代向け</button>
                        <button class="filter-btn" data-category="40代向け">40代向け</button>
                        <button class="filter-btn" data-category="全年代">全年代</button>
                    </div>
                    
                    <!-- プリセットシナリオ -->
                    <div class="scenario-grid">
                        ${this.presetScenarios.map(scenario => `
                        <div class="scenario-card" data-scenario="${scenario.id}" data-category="${scenario.category}">
                            <div class="scenario-header">
                                <div class="scenario-name">${scenario.name}</div>
                                <div class="scenario-category">${scenario.category}</div>
                            </div>
                            <div class="scenario-description">${scenario.description}</div>
                        </div>
                        `).join('')}
                    </div>
                    
                    <!-- カスタムシナリオ作成 -->
                    <div class="custom-scenario-section">
                        <div class="custom-header">
                            <h5>🎨 カスタムシナリオ作成</h5>
                            <div class="custom-subtitle">あなた独自の状況で内部対話を体験できます</div>
                        </div>
                        
                        <div class="custom-form">
                            <div class="form-group">
                                <label class="form-label">シナリオタイトル</label>
                                <input 
                                    type="text" 
                                    class="custom-title-input" 
                                    placeholder="例：新しい部署への異動検討"
                                    maxlength="30"
                                >
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">詳細な状況説明</label>
                                <textarea 
                                    class="custom-input" 
                                    placeholder="具体的な状況を詳しく説明してください。背景、関係者、悩んでいるポイントなどを含めると、より精度の高い内部対話が生成されます。

例：
現在の部署で3年間勤務しているが、新設される企画部への異動打診を受けた。企画部は将来性があり興味深い仕事ができそうだが、現在のチームとの関係も良好で、異動により給与が下がる可能性もある。家族の理解も必要で、判断に迷っている。"
                                    rows="6"
                                    maxlength="500"
                                ></textarea>
                                <div class="char-counter">0 / 500</div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">重視したい観点（オプション）</label>
                                <div class="aspect-tags">
                                    <button class="aspect-tag" data-aspect="financial">経済的側面</button>
                                    <button class="aspect-tag" data-aspect="relationship">人間関係</button>
                                    <button class="aspect-tag" data-aspect="growth">成長・学習</button>
                                    <button class="aspect-tag" data-aspect="balance">ワークライフバランス</button>
                                    <button class="aspect-tag" data-aspect="stability">安定性</button>
                                    <button class="aspect-tag" data-aspect="creativity">創造性</button>
                                </div>
                            </div>
                            
                            <div class="custom-actions">
                                <button class="custom-button primary">
                                    <span class="btn-icon">🎭</span>
                                    カスタム対話を生成
                                </button>
                                <button class="save-scenario-btn" style="display: none;">
                                    <span class="btn-icon">💾</span>
                                    シナリオを保存
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 保存済みカスタムシナリオ -->
                    <div class="saved-scenarios" style="display: none;">
                        <h5>💾 保存済みシナリオ</h5>
                        <div class="saved-scenario-list">
                            <!-- 動的に生成 -->
                        </div>
                    </div>
                </div>
                
                <div class="dialogue-stage">
                    <div class="stage-header">
                        <div class="current-scenario">
                            <span class="scenario-title">シナリオを選択してください</span>
                            <span class="scenario-context"></span>
                        </div>
                        <div class="playback-info">
                            <span class="exchange-counter">0 / 0</span>
                            <span class="speed-indicator">×${this.playbackSpeed}</span>
                        </div>
                    </div>
                    
                    <div class="dialogue-visualization">
                        <div class="os-participants">
                            <div class="participant engine-os" data-os="engine">
                                <div class="participant-avatar">🧠</div>
                                <div class="participant-name">価値観OS</div>
                                <div class="participant-status">待機中</div>
                            </div>
                            
                            <div class="participant interface-os" data-os="interface">
                                <div class="participant-avatar">🤝</div>
                                <div class="participant-name">社会的OS</div>
                                <div class="participant-status">待機中</div>
                            </div>
                            
                            <div class="participant safemode-os" data-os="safemode">
                                <div class="participant-avatar">🛡️</div>
                                <div class="participant-name">防御OS</div>
                                <div class="participant-status">待機中</div>
                            </div>
                        </div>
                        
                        <div class="dialogue-bubbles">
                            <div class="bubble-container">
                                <!-- 動的に生成される対話バブル -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="player-controls">
                        <button class="control-btn play-btn" disabled>
                            <span class="btn-icon">▶️</span>
                            <span class="btn-text">再生</span>
                        </button>
                        
                        <button class="control-btn pause-btn" disabled>
                            <span class="btn-icon">⏸️</span>
                            <span class="btn-text">一時停止</span>
                        </button>
                        
                        <button class="control-btn stop-btn" disabled>
                            <span class="btn-icon">⏹️</span>
                            <span class="btn-text">停止</span>
                        </button>
                        
                        <button class="control-btn replay-btn" disabled>
                            <span class="btn-icon">🔄</span>
                            <span class="btn-text">再生成</span>
                        </button>
                        
                        <div class="speed-controls">
                            <label class="speed-label">再生速度:</label>
                            <select class="speed-selector">
                                <option value="0.5">×0.5</option>
                                <option value="1.0" selected>×1.0</option>
                                <option value="1.5">×1.5</option>
                                <option value="2.0">×2.0</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="dialogue-analysis">
                    <div class="analysis-header">
                        <h4>対話分析</h4>
                        <div class="analysis-toggle">
                            <input type="checkbox" id="auto-analysis" checked>
                            <label for="auto-analysis">自動分析</label>
                        </div>
                    </div>
                    <div class="analysis-content">
                        <div class="analysis-placeholder">
                            対話を再生すると、OS間の相互作用パターンを分析します
                        </div>
                    </div>
                </div>
                
                <!-- SNS共有セクション -->
                <div class="sns-sharing-section" style="display: none;">
                    <div class="sharing-header">
                        <h4>
                            <span class="sharing-icon">📤</span>
                            結果を共有
                        </h4>
                        <div class="sharing-subtitle">
                            あなたの内部対話分析を友人や家族と共有しましょう
                        </div>
                    </div>
                    
                    <div class="sharing-options">
                        <!-- クイック共有ボタン -->
                        <div class="quick-share-buttons">
                            <button class="share-btn twitter-share" data-platform="twitter">
                                <span class="share-icon">🐦</span>
                                <div class="share-content">
                                    <div class="share-name">Twitter</div>
                                    <div class="share-desc">ツイート形式で共有</div>
                                </div>
                            </button>
                            
                            <button class="share-btn instagram-share" data-platform="instagram">
                                <span class="share-icon">📷</span>
                                <div class="share-content">
                                    <div class="share-name">Instagram</div>
                                    <div class="share-desc">ストーリー・投稿用画像</div>
                                </div>
                            </button>
                            
                            <button class="share-btn facebook-share" data-platform="facebook">
                                <span class="share-icon">📘</span>
                                <div class="share-content">
                                    <div class="share-name">Facebook</div>
                                    <div class="share-desc">投稿で共有</div>
                                </div>
                            </button>
                            
                            <button class="share-btn linkedin-share" data-platform="linkedin">
                                <span class="share-icon">💼</span>
                                <div class="share-content">
                                    <div class="share-name">LinkedIn</div>
                                    <div class="share-desc">プロフェッショナル共有</div>
                                </div>
                            </button>
                        </div>
                        
                        <!-- 詳細共有オプション -->
                        <div class="advanced-sharing">
                            <div class="sharing-type-selector">
                                <label class="sharing-type-label">共有形式:</label>
                                <div class="type-options">
                                    <label class="type-option">
                                        <input type="radio" name="share-type" value="image" checked>
                                        <span class="option-text">画像で共有</span>
                                    </label>
                                    <label class="type-option">
                                        <input type="radio" name="share-type" value="link">
                                        <span class="option-text">リンクで共有</span>
                                    </label>
                                    <label class="type-option">
                                        <input type="radio" name="share-type" value="text">
                                        <span class="option-text">テキストで共有</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="sharing-privacy">
                                <label class="privacy-label">
                                    <input type="checkbox" id="include-personal-info" checked>
                                    <span class="privacy-text">個人的な分析結果を含める</span>
                                </label>
                                <div class="privacy-note">
                                    チェックを外すと、シナリオ名と基本的な分析のみを共有します
                                </div>
                            </div>
                            
                            <div class="custom-message">
                                <label class="message-label">カスタムメッセージ（オプション）:</label>
                                <textarea 
                                    class="custom-message-input" 
                                    placeholder="共有時に追加したいメッセージを入力してください（例：『面白い結果が出ました！みなさんもぜひ試してみてください』）"
                                    maxlength="280"
                                    rows="3"
                                ></textarea>
                                <div class="message-counter">0 / 280</div>
                            </div>
                        </div>
                        
                        <!-- アクションボタン -->
                        <div class="sharing-actions">
                            <button class="share-action-btn generate-image">
                                <span class="btn-icon">🖼️</span>
                                画像を生成
                            </button>
                            
                            <button class="share-action-btn generate-link">
                                <span class="btn-icon">🔗</span>
                                共有リンクを生成
                            </button>
                            
                            <button class="share-action-btn copy-text">
                                <span class="btn-icon">📋</span>
                                テキストをコピー
                            </button>
                            
                            <button class="share-action-btn download-all">
                                <span class="btn-icon">📦</span>
                                全形式でダウンロード
                            </button>
                        </div>
                        
                        <!-- 生成結果表示エリア -->
                        <div class="sharing-results" style="display: none;">
                            <div class="results-header">
                                <h5>生成完了</h5>
                                <button class="results-close">×</button>
                            </div>
                            <div class="results-content">
                                <!-- 動的に生成される共有結果 -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // UI要素参照の保存
        this.playerUI = this.container.querySelector('.dialogue-player');
        this.dialogueDisplay = this.container.querySelector('.dialogue-bubbles');
        this.controlButtons = {
            play: this.container.querySelector('.play-btn'),
            pause: this.container.querySelector('.pause-btn'),
            stop: this.container.querySelector('.stop-btn'),
            replay: this.container.querySelector('.replay-btn')
        };
    }
    
    /**
     * イベントリスナーの登録
     */
    bindEvents() {
        // シナリオカード選択
        const scenarioCards = this.container.querySelectorAll('.scenario-card');
        scenarioCards.forEach(card => {
            const clickHandler = () => {
                const scenarioId = card.dataset.scenario;
                this.selectScenario(scenarioId);
            };
            
            card.addEventListener('click', clickHandler);
            this.eventListeners.push({ element: card, event: 'click', handler: clickHandler });
        });
        
        // カテゴリフィルター
        const filterButtons = this.container.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            const filterHandler = () => {
                const category = btn.dataset.category;
                this.filterScenarios(category);
                
                // アクティブ状態更新
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
            
            btn.addEventListener('click', filterHandler);
            this.eventListeners.push({ element: btn, event: 'click', handler: filterHandler });
        });
        
        // カスタムシナリオボタン
        const customButton = this.container.querySelector('.custom-button.primary');
        const customClickHandler = () => {
            this.createCustomScenario();
        };
        
        customButton.addEventListener('click', customClickHandler);
        this.eventListeners.push({ element: customButton, event: 'click', handler: customClickHandler });
        
        // シナリオ保存ボタン
        const saveButton = this.container.querySelector('.save-scenario-btn');
        const saveHandler = () => {
            this.saveCurrentCustomScenario();
        };
        
        saveButton.addEventListener('click', saveHandler);
        this.eventListeners.push({ element: saveButton, event: 'click', handler: saveHandler });
        
        // 文字カウンター
        const customInput = this.container.querySelector('.custom-input');
        const charCountHandler = () => {
            this.updateCharacterCount();
        };
        
        customInput.addEventListener('input', charCountHandler);
        this.eventListeners.push({ element: customInput, event: 'input', handler: charCountHandler });
        
        // 観点タグ選択
        const aspectTags = this.container.querySelectorAll('.aspect-tag');
        aspectTags.forEach(tag => {
            const tagHandler = () => {
                tag.classList.toggle('selected');
            };
            
            tag.addEventListener('click', tagHandler);
            this.eventListeners.push({ element: tag, event: 'click', handler: tagHandler });
        });
        
        // プレイヤーコントロール
        const playHandler = () => this.playDialogue();
        const pauseHandler = () => this.pauseDialogue();
        const stopHandler = () => this.stopDialogue();
        const replayHandler = () => this.replayDialogue();
        
        this.controlButtons.play.addEventListener('click', playHandler);
        this.controlButtons.pause.addEventListener('click', pauseHandler);
        this.controlButtons.stop.addEventListener('click', stopHandler);
        this.controlButtons.replay.addEventListener('click', replayHandler);
        
        this.eventListeners.push(
            { element: this.controlButtons.play, event: 'click', handler: playHandler },
            { element: this.controlButtons.pause, event: 'click', handler: pauseHandler },
            { element: this.controlButtons.stop, event: 'click', handler: stopHandler },
            { element: this.controlButtons.replay, event: 'click', handler: replayHandler }
        );
        
        // 再生速度選択
        const speedSelector = this.container.querySelector('.speed-selector');
        const speedHandler = (event) => {
            this.playbackSpeed = parseFloat(event.target.value);
            this.updateSpeedIndicator();
        };
        
        speedSelector.addEventListener('change', speedHandler);
        this.eventListeners.push({ element: speedSelector, event: 'change', handler: speedHandler });
        
        // キーボードショートカット
        const keyHandler = (event) => {
            if (this.container.contains(document.activeElement)) {
                switch(event.key) {
                    case ' ':
                        event.preventDefault();
                        if (this.isPlaying) {
                            this.pauseDialogue();
                        } else {
                            this.playDialogue();
                        }
                        break;
                    case 'Escape':
                        this.stopDialogue();
                        break;
                    case 'r':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            this.replayDialogue();
                        }
                        break;
                }
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        this.eventListeners.push({ element: document, event: 'keydown', handler: keyHandler });
        
        // SNS共有関連のイベントリスナー
        this.bindSharingEvents();
    }
    
    /**
     * SNS共有イベントリスナーの登録
     */
    bindSharingEvents() {
        // クイック共有ボタン
        const shareButtons = this.container.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            const shareHandler = () => {
                const platform = btn.dataset.platform;
                this.shareToSocialMedia(platform);
            };
            
            btn.addEventListener('click', shareHandler);
            this.eventListeners.push({ element: btn, event: 'click', handler: shareHandler });
        });
        
        // 共有アクションボタン
        const generateImageBtn = this.container.querySelector('.generate-image');
        const generateLinkBtn = this.container.querySelector('.generate-link');
        const copyTextBtn = this.container.querySelector('.copy-text');
        const downloadAllBtn = this.container.querySelector('.download-all');
        
        if (generateImageBtn) {
            const imageHandler = () => this.generateSharingImage();
            generateImageBtn.addEventListener('click', imageHandler);
            this.eventListeners.push({ element: generateImageBtn, event: 'click', handler: imageHandler });
        }
        
        if (generateLinkBtn) {
            const linkHandler = () => this.generateSharingLink();
            generateLinkBtn.addEventListener('click', linkHandler);
            this.eventListeners.push({ element: generateLinkBtn, event: 'click', handler: linkHandler });
        }
        
        if (copyTextBtn) {
            const textHandler = () => this.copySharingText();
            copyTextBtn.addEventListener('click', textHandler);
            this.eventListeners.push({ element: copyTextBtn, event: 'click', handler: textHandler });
        }
        
        if (downloadAllBtn) {
            const downloadHandler = () => this.downloadAllFormats();
            downloadAllBtn.addEventListener('click', downloadHandler);
            this.eventListeners.push({ element: downloadAllBtn, event: 'click', handler: downloadHandler });
        }
        
        // カスタムメッセージの文字数カウンター
        const messageInput = this.container.querySelector('.custom-message-input');
        if (messageInput) {
            const messageHandler = () => this.updateMessageCounter();
            messageInput.addEventListener('input', messageHandler);
            this.eventListeners.push({ element: messageInput, event: 'input', handler: messageHandler });
        }
        
        // 結果を閉じるボタン
        const resultsClose = this.container.querySelector('.results-close');
        if (resultsClose) {
            const closeHandler = () => this.hideSharingResults();
            resultsClose.addEventListener('click', closeHandler);
            this.eventListeners.push({ element: resultsClose, event: 'click', handler: closeHandler });
        }
    }
    
    /**
     * プリセットシナリオ選択
     * @param {string} scenarioId - シナリオID
     */
    async selectScenario(scenarioId) {
        const scenario = this.presetScenarios.find(s => s.id === scenarioId);
        if (!scenario) {
            console.error('Unknown scenario:', scenarioId);
            return;
        }
        
        try {
            console.log(`🎬 Selecting scenario: ${scenario.name}`);
            
            // UI更新
            this.updateSelectedScenario(scenario);
            this.resetPlayer();
            
            // 対話生成
            this.currentDialogue = await this.relationshipEngine.simulateComplexInternalDialogue(
                scenario.context,
                {
                    depth: 'detailed',
                    includeEmotions: true,
                    rounds: 3
                }
            );
            
            // プレイヤー有効化
            this.enablePlayerControls();
            
            console.log(`✅ Scenario selected and dialogue generated: ${this.currentDialogue.exchanges.length} exchanges`);
            
        } catch (error) {
            console.error('❌ Scenario selection failed:', error);
            this.showError('シナリオの読み込みに失敗しました');
        }
    }
    
    /**
     * カスタムシナリオ選択
     * @param {string} customScenario - カスタムシナリオテキスト
     */
    async selectCustomScenario(customScenario) {
        try {
            console.log('🎬 Selecting custom scenario');
            
            const scenario = {
                name: 'カスタムシナリオ',
                description: customScenario.substring(0, 50) + '...',
                context: customScenario
            };
            
            // UI更新
            this.updateSelectedScenario(scenario);
            this.resetPlayer();
            
            // 対話生成
            this.currentDialogue = await this.relationshipEngine.simulateComplexInternalDialogue(
                customScenario,
                {
                    depth: 'detailed',
                    includeEmotions: true,
                    rounds: 3
                }
            );
            
            // プレイヤー有効化
            this.enablePlayerControls();
            
            // カスタム入力クリア
            const customInput = this.container.querySelector('.custom-input');
            customInput.value = '';
            
            console.log('✅ Custom scenario selected and dialogue generated');
            
        } catch (error) {
            console.error('❌ Custom scenario selection failed:', error);
            this.showError('カスタムシナリオの処理に失敗しました');
        }
    }
    
    /**
     * 対話再生開始
     */
    async playDialogue() {
        if (!this.currentDialogue) {
            console.warn('⚠️ No dialogue to play');
            return;
        }
        
        if (this.isPlaying) {
            console.warn('⚠️ Dialogue already playing');
            return;
        }
        
        try {
            console.log('▶️ Starting dialogue playback');
            
            this.isPlaying = true;
            this.isPaused = false;
            this.updateControlsState();
            
            // 再生開始イベント
            this.dispatchPlayerEvent('playbackStarted');
            
            await this.animateDialogueSequence();
            
            console.log('✅ Dialogue playback completed');
            
        } catch (error) {
            console.error('❌ Dialogue playback failed:', error);
            this.showError('対話の再生に失敗しました');
        } finally {
            this.isPlaying = false;
            this.updateControlsState();
        }
    }
    
    /**
     * 対話一時停止
     */
    pauseDialogue() {
        if (!this.isPlaying) {
            console.warn('⚠️ No dialogue playing to pause');
            return;
        }
        
        console.log('⏸️ Pausing dialogue playback');
        
        this.isPaused = true;
        this.updateControlsState();
        
        // 一時停止イベント
        this.dispatchPlayerEvent('playbackPaused');
    }
    
    /**
     * 対話停止
     */
    stopDialogue() {
        console.log('⏹️ Stopping dialogue playback');
        
        this.isPlaying = false;
        this.isPaused = false;
        this.currentExchangeIndex = 0;
        
        // 対話表示クリア
        this.clearDialogueDisplay();
        this.resetParticipantStatus();
        this.updateExchangeCounter();
        this.updateControlsState();
        
        // 停止イベント
        this.dispatchPlayerEvent('playbackStopped');
    }
    
    /**
     * 対話再生成・再再生
     */
    async replayDialogue() {
        console.log('🔄 Replaying dialogue');
        
        // 現在の再生を停止
        this.stopDialogue();
        
        // シナリオ情報の取得
        const scenarioTitle = this.container.querySelector('.scenario-title').textContent;
        const scenarioContext = this.container.querySelector('.scenario-context').textContent;
        
        if (scenarioContext && scenarioContext !== 'シナリオを選択してください') {
            // 対話再生成
            try {
                this.currentDialogue = await this.relationshipEngine.simulateComplexInternalDialogue(
                    scenarioContext,
                    {
                        depth: 'detailed',
                        includeEmotions: true,
                        rounds: 3,
                        regenerate: true
                    }
                );
                
                // 自動再生
                setTimeout(() => this.playDialogue(), 500);
                
            } catch (error) {
                console.error('❌ Dialogue regeneration failed:', error);
                this.showError('対話の再生成に失敗しました');
            }
        }
    }
    
    /**
     * 対話シーケンスのアニメーション
     */
    async animateDialogueSequence() {
        const exchanges = this.currentDialogue.exchanges;
        this.currentExchangeIndex = 0;
        
        this.updateExchangeCounter();
        
        for (let i = 0; i < exchanges.length; i++) {
            // 一時停止チェック
            while (this.isPaused && this.isPlaying) {
                await this.sleep(100);
            }
            
            // 停止チェック
            if (!this.isPlaying) {
                break;
            }
            
            this.currentExchangeIndex = i;
            this.updateExchangeCounter();
            
            const exchange = exchanges[i];
            
            // 参加者のアクティブ化
            this.activateParticipant(exchange.speaker);
            
            // 対話バブル表示
            await this.displayExchange(exchange, i);
            
            // 自動分析の更新
            if (this.isAutoAnalysisEnabled()) {
                this.updateAnalysis(i + 1, exchanges);
            }
            
            // 次の発言までの待機（速度調整）
            const delay = this.exchangeDelay / this.playbackSpeed;
            await this.sleep(delay);
            
            // 参加者の非アクティブ化
            this.deactivateParticipant(exchange.speaker);
        }
        
        // 最終分析
        if (this.isAutoAnalysisEnabled()) {
            this.showFinalAnalysis();
        }
        
        // SNS共有セクションを表示
        this.showSharingSectionAfterCompletion();
        
        // 完了イベント
        this.dispatchPlayerEvent('playbackCompleted');
    }
    
    /**
     * 個別発言の表示
     * @param {Object} exchange - 発言データ
     * @param {number} index - 発言インデックス
     */
    async displayExchange(exchange, index) {
        const bubbleContainer = this.container.querySelector('.bubble-container');
        
        // バブル要素作成
        const bubble = document.createElement('div');
        bubble.className = `dialogue-bubble ${exchange.speaker.toLowerCase().replace(' ', '-')}-bubble`;
        bubble.innerHTML = `
            <div class="bubble-header">
                <span class="speaker-name">${exchange.speaker}</span>
                <span class="exchange-type">${this.getExchangeTypeLabel(exchange.type)}</span>
            </div>
            <div class="bubble-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="bubble-text" style="display: none;"></div>
            </div>
            <div class="bubble-metadata">
                <span class="confidence">確信度: ${Math.round(exchange.confidence * 100)}%</span>
                <span class="emotion">${exchange.emotion || 'neutral'}</span>
            </div>
        `;
        
        bubbleContainer.appendChild(bubble);
        
        // アニメーション入場
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            bubble.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        });
        
        // タイピング効果
        await this.sleep(800 / this.playbackSpeed); // タイピング開始までの待機
        
        const typingIndicator = bubble.querySelector('.typing-indicator');
        const bubbleText = bubble.querySelector('.bubble-text');
        
        // タイピングインジケーターを非表示にしてテキスト表示
        typingIndicator.style.display = 'none';
        bubbleText.style.display = 'block';
        
        // タイプライター効果
        await this.typewriterEffect(bubbleText, exchange.content);
        
        // 自動スクロール
        bubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * タイプライター効果
     * @param {HTMLElement} element - 対象要素
     * @param {string} text - 表示テキスト
     */
    async typewriterEffect(element, text) {
        element.textContent = '';
        
        const adjustedSpeed = Math.max(10, this.typingSpeed / this.playbackSpeed);
        
        for (let i = 0; i < text.length; i++) {
            // 停止・一時停止チェック
            if (!this.isPlaying) break;
            while (this.isPaused && this.isPlaying) {
                await this.sleep(100);
            }
            
            element.textContent += text[i];
            
            if (adjustedSpeed > 0) {
                await this.sleep(adjustedSpeed);
            }
        }
    }
    
    /**
     * 参加者のアクティブ化
     * @param {string} speaker - 発言者
     */
    activateParticipant(speaker) {
        const osType = this.getOSTypeFromSpeaker(speaker);
        const participant = this.container.querySelector(`.participant[data-os="${osType}"]`);
        
        if (participant) {
            participant.classList.add('active');
            const status = participant.querySelector('.participant-status');
            status.textContent = '発言中';
        }
    }
    
    /**
     * 参加者の非アクティブ化
     * @param {string} speaker - 発言者
     */
    deactivateParticipant(speaker) {
        const osType = this.getOSTypeFromSpeaker(speaker);
        const participant = this.container.querySelector(`.participant[data-os="${osType}"]`);
        
        if (participant) {
            participant.classList.remove('active');
            const status = participant.querySelector('.participant-status');
            status.textContent = '待機中';
        }
    }
    
    /**
     * 全参加者ステータスリセット
     */
    resetParticipantStatus() {
        const participants = this.container.querySelectorAll('.participant');
        participants.forEach(participant => {
            participant.classList.remove('active');
            const status = participant.querySelector('.participant-status');
            status.textContent = '待機中';
        });
    }
    
    /**
     * 対話表示クリア
     */
    clearDialogueDisplay() {
        const bubbleContainer = this.container.querySelector('.bubble-container');
        bubbleContainer.innerHTML = '';
    }
    
    /**
     * 選択シナリオの更新
     * @param {Object} scenario - シナリオ情報
     */
    updateSelectedScenario(scenario) {
        const scenarioTitle = this.container.querySelector('.scenario-title');
        const scenarioContext = this.container.querySelector('.scenario-context');
        
        scenarioTitle.textContent = scenario.name;
        scenarioContext.textContent = scenario.context;
        
        // シナリオカードの選択状態更新
        const scenarioCards = this.container.querySelectorAll('.scenario-card');
        scenarioCards.forEach(card => {
            if (scenario.id && card.dataset.scenario === scenario.id) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }
    
    /**
     * プレイヤーリセット
     */
    resetPlayer() {
        this.stopDialogue();
        this.currentDialogue = null;
        this.disablePlayerControls();
        this.clearAnalysis();
    }
    
    /**
     * プレイヤーコントロール有効化
     */
    enablePlayerControls() {
        this.controlButtons.play.disabled = false;
        this.controlButtons.replay.disabled = false;
        this.updateExchangeCounter();
    }
    
    /**
     * プレイヤーコントロール無効化
     */
    disablePlayerControls() {
        Object.values(this.controlButtons).forEach(btn => {
            btn.disabled = true;
        });
    }
    
    /**
     * コントロール状態更新
     */
    updateControlsState() {
        this.controlButtons.play.disabled = this.isPlaying || !this.currentDialogue;
        this.controlButtons.pause.disabled = !this.isPlaying || this.isPaused;
        this.controlButtons.stop.disabled = !this.isPlaying && !this.isPaused;
        this.controlButtons.replay.disabled = !this.currentDialogue;
    }
    
    /**
     * 発言カウンタ更新
     */
    updateExchangeCounter() {
        const counter = this.container.querySelector('.exchange-counter');
        if (this.currentDialogue) {
            counter.textContent = `${this.currentExchangeIndex} / ${this.currentDialogue.exchanges.length}`;
        } else {
            counter.textContent = '0 / 0';
        }
    }
    
    /**
     * 速度インジケーター更新
     */
    updateSpeedIndicator() {
        const indicator = this.container.querySelector('.speed-indicator');
        indicator.textContent = `×${this.playbackSpeed}`;
    }
    
    /**
     * 自動分析有効確認
     */
    isAutoAnalysisEnabled() {
        const checkbox = this.container.querySelector('#auto-analysis');
        return checkbox.checked;
    }
    
    /**
     * 分析更新
     * @param {number} currentIndex - 現在のインデックス
     * @param {Array} exchanges - 全発言データ
     */
    updateAnalysis(currentIndex, exchanges) {
        const analysisContent = this.container.querySelector('.analysis-content');
        
        // 簡易分析表示
        const participationCount = this.countParticipation(exchanges.slice(0, currentIndex));
        const dominantOS = this.getDominantOS(participationCount);
        
        analysisContent.innerHTML = `
            <div class="current-analysis">
                <h5>進行中の分析 (${currentIndex}/${exchanges.length})</h5>
                <div class="participation-stats">
                    <div class="stat-item">
                        <span class="stat-label">価値観OS</span>
                        <span class="stat-value">${participationCount.engine}回</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">社会的OS</span>
                        <span class="stat-value">${participationCount.interface}回</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">防御OS</span>
                        <span class="stat-value">${participationCount.safemode}回</span>
                    </div>
                </div>
                <div class="dominant-analysis">
                    <strong>現在の主導OS:</strong> ${dominantOS}
                </div>
            </div>
        `;
    }
    
    /**
     * 最終分析表示
     */
    showFinalAnalysis() {
        const analysisContent = this.container.querySelector('.analysis-content');
        
        if (!this.currentDialogue) return;
        
        const exchanges = this.currentDialogue.exchanges;
        const participationCount = this.countParticipation(exchanges);
        const consensus = this.currentDialogue.consensusLevel || 0;
        const outcome = this.currentDialogue.outcome || '調整中';
        
        analysisContent.innerHTML = `
            <div class="final-analysis">
                <h5>対話分析結果</h5>
                
                <div class="analysis-section">
                    <h6>参加度</h6>
                    <div class="participation-chart">
                        <div class="chart-item">
                            <span class="chart-label">価値観OS</span>
                            <div class="chart-bar">
                                <div class="chart-fill" style="width: ${(participationCount.engine / exchanges.length * 100)}%"></div>
                            </div>
                            <span class="chart-value">${participationCount.engine}回</span>
                        </div>
                        <div class="chart-item">
                            <span class="chart-label">社会的OS</span>
                            <div class="chart-bar">
                                <div class="chart-fill" style="width: ${(participationCount.interface / exchanges.length * 100)}%"></div>
                            </div>
                            <span class="chart-value">${participationCount.interface}回</span>
                        </div>
                        <div class="chart-item">
                            <span class="chart-label">防御OS</span>
                            <div class="chart-bar">
                                <div class="chart-fill" style="width: ${(participationCount.safemode / exchanges.length * 100)}%"></div>
                            </div>
                            <span class="chart-value">${participationCount.safemode}回</span>
                        </div>
                    </div>
                </div>
                
                <div class="analysis-section">
                    <h6>合意レベル</h6>
                    <div class="consensus-indicator">
                        <div class="consensus-bar">
                            <div class="consensus-fill" style="width: ${consensus * 100}%"></div>
                        </div>
                        <span class="consensus-text">${(consensus * 100).toFixed(1)}%</span>
                    </div>
                </div>
                
                <div class="analysis-section">
                    <h6>対話の結論</h6>
                    <div class="outcome-text">${outcome}</div>
                </div>
                
                <div class="analysis-insights">
                    <h6>洞察</h6>
                    <ul>
                        ${this.generateInsights(participationCount, consensus, outcome).map(insight => 
                            `<li>${insight}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    /**
     * 分析クリア
     */
    clearAnalysis() {
        const analysisContent = this.container.querySelector('.analysis-content');
        analysisContent.innerHTML = `
            <div class="analysis-placeholder">
                対話を再生すると、OS間の相互作用パターンを分析します
            </div>
        `;
    }
    
    // ユーティリティメソッド
    
    /**
     * 発言者からOS種別取得
     * @param {string} speaker - 発言者
     */
    getOSTypeFromSpeaker(speaker) {
        if (speaker.includes('Engine') || speaker.includes('価値観')) return 'engine';
        if (speaker.includes('Interface') || speaker.includes('社会的')) return 'interface';
        if (speaker.includes('SafeMode') || speaker.includes('防御')) return 'safemode';
        return 'engine'; // デフォルト
    }
    
    /**
     * 発言種別ラベル取得
     * @param {string} type - 発言種別
     */
    getExchangeTypeLabel(type) {
        const labels = {
            'proposal': '提案',
            'consideration': '検討',
            'caution': '警告',
            'support': '支持',
            'objection': '異議',
            'compromise': '妥協案',
            'conclusion': '結論'
        };
        return labels[type] || type;
    }
    
    /**
     * 参加度カウント
     * @param {Array} exchanges - 発言配列
     */
    countParticipation(exchanges) {
        const count = { engine: 0, interface: 0, safemode: 0 };
        
        exchanges.forEach(exchange => {
            const osType = this.getOSTypeFromSpeaker(exchange.speaker);
            count[osType]++;
        });
        
        return count;
    }
    
    /**
     * 主導OS取得
     * @param {Object} participationCount - 参加度カウント
     */
    getDominantOS(participationCount) {
        const osNames = {
            engine: '価値観OS',
            interface: '社会的OS',
            safemode: '防御OS'
        };
        
        const dominantKey = Object.keys(participationCount).reduce((a, b) => 
            participationCount[a] > participationCount[b] ? a : b
        );
        
        return osNames[dominantKey];
    }
    
    /**
     * 洞察生成
     * @param {Object} participationCount - 参加度
     * @param {number} consensus - 合意レベル
     * @param {string} outcome - 結論
     */
    generateInsights(participationCount, consensus, outcome) {
        const insights = [];
        const total = Object.values(participationCount).reduce((a, b) => a + b, 0);
        const dominant = this.getDominantOS(participationCount);
        
        // 主導OS分析
        insights.push(`${dominant}が対話を主導しています`);
        
        // バランス分析
        const isBalanced = Math.max(...Object.values(participationCount)) - Math.min(...Object.values(participationCount)) <= 1;
        if (isBalanced) {
            insights.push('3つのOSがバランス良く参加した対話です');
        } else {
            insights.push('特定のOSが主導的な役割を果たした対話です');
        }
        
        // 合意分析
        if (consensus > 0.8) {
            insights.push('高い合意レベルを達成しました');
        } else if (consensus > 0.5) {
            insights.push('適度な合意が形成されました');
        } else {
            insights.push('意見の相違が残る結果となりました');
        }
        
        return insights;
    }
    
    /**
     * エラー表示
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        const analysisContent = this.container.querySelector('.analysis-content');
        analysisContent.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-text">${message}</div>
            </div>
        `;
    }
    
    /**
     * イベント発火
     * @param {string} eventName - イベント名
     * @param {Object} detail - イベント詳細
     */
    dispatchPlayerEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                ...detail,
                currentDialogue: this.currentDialogue,
                currentExchangeIndex: this.currentExchangeIndex,
                timestamp: Date.now()
            }
        });
        
        this.container.dispatchEvent(event);
    }
    
    /**
     * カテゴリフィルター
     * @param {string} category - フィルターカテゴリ
     */
    filterScenarios(category) {
        const scenarioCards = this.container.querySelectorAll('.scenario-card');
        
        scenarioCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0.5';
            }
        });
        
        console.log(`🔍 Filtered scenarios by category: ${category}`);
    }
    
    /**
     * カスタムシナリオ作成
     */
    async createCustomScenario() {
        const titleInput = this.container.querySelector('.custom-title-input');
        const descriptionInput = this.container.querySelector('.custom-input');
        
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        
        if (!title || !description) {
            this.showError('タイトルと詳細説明の両方を入力してください');
            return;
        }
        
        if (description.length < 20) {
            this.showError('より詳細な状況説明をお願いします（20文字以上）');
            return;
        }
        
        try {
            console.log('🎨 Creating custom scenario:', title);
            
            // 選択された観点を取得
            const selectedAspects = this.getSelectedAspects();
            
            // カスタムシナリオ作成
            const customScenario = {
                id: `custom_${Date.now()}`,
                name: title,
                description: description.substring(0, 100) + '...',
                category: 'カスタム',
                context: this.enrichContext(description, selectedAspects),
                aspects: selectedAspects,
                createdAt: new Date().toISOString()
            };
            
            // シナリオ選択と対話生成
            await this.selectCustomScenario(customScenario.context);
            
            // 保存ボタンを表示
            const saveButton = this.container.querySelector('.save-scenario-btn');
            saveButton.style.display = 'inline-flex';
            saveButton.dataset.scenario = JSON.stringify(customScenario);
            
            console.log('✅ Custom scenario created successfully');
            
        } catch (error) {
            console.error('❌ Custom scenario creation failed:', error);
            this.showError('カスタムシナリオの作成に失敗しました');
        }
    }
    
    /**
     * 選択された観点を取得
     */
    getSelectedAspects() {
        const selectedTags = this.container.querySelectorAll('.aspect-tag.selected');
        return Array.from(selectedTags).map(tag => tag.dataset.aspect);
    }
    
    /**
     * コンテキストの拡充
     * @param {string} description - 基本説明
     * @param {Array} aspects - 選択された観点
     */
    enrichContext(description, aspects) {
        let enrichedContext = description;
        
        if (aspects.length > 0) {
            const aspectPrompts = {
                'financial': '経済的な影響や将来の収入に関する懸念も含めて',
                'relationship': '人間関係や周囲への影響も考慮して',
                'growth': '個人的な成長や学習機会の観点も含めて',
                'balance': 'ワークライフバランスへの影響も考慮して',
                'stability': '安定性や安全性の観点も重視して',
                'creativity': '創造性や表現の自由度も考慮して'
            };
            
            const selectedPrompts = aspects.map(aspect => aspectPrompts[aspect]).filter(Boolean);
            
            if (selectedPrompts.length > 0) {
                enrichedContext += '\n\n【重視したい観点】\n' + selectedPrompts.join('、') + '判断したいと考えています。';
            }
        }
        
        return enrichedContext;
    }
    
    /**
     * 現在のカスタムシナリオを保存
     */
    saveCurrentCustomScenario() {
        const saveButton = this.container.querySelector('.save-scenario-btn');
        const scenarioData = saveButton.dataset.scenario;
        
        if (!scenarioData) {
            this.showError('保存するシナリオが見つかりません');
            return;
        }
        
        try {
            const scenario = JSON.parse(scenarioData);
            
            // ローカルストレージに保存
            this.customScenarios.push(scenario);
            this.saveCustomScenariosToStorage();
            
            // 保存済みセクションを表示・更新
            this.updateSavedScenariosDisplay();
            
            // 入力フォームをクリア
            this.clearCustomForm();
            
            // 保存ボタンを非表示
            saveButton.style.display = 'none';
            
            // 成功メッセージ
            this.showSuccessMessage('シナリオが保存されました');
            
            console.log('💾 Custom scenario saved:', scenario.name);
            
        } catch (error) {
            console.error('❌ Scenario save failed:', error);
            this.showError('シナリオの保存に失敗しました');
        }
    }
    
    /**
     * カスタムシナリオをローカルストレージに保存
     */
    saveCustomScenariosToStorage() {
        try {
            localStorage.setItem('haqei_custom_scenarios', JSON.stringify(this.customScenarios));
        } catch (error) {
            console.error('Failed to save custom scenarios to localStorage:', error);
        }
    }
    
    /**
     * ローカルストレージからカスタムシナリオを読み込み
     */
    loadCustomScenariosFromStorage() {
        try {
            const saved = localStorage.getItem('haqei_custom_scenarios');
            if (saved) {
                this.customScenarios = JSON.parse(saved);
                this.updateSavedScenariosDisplay();
            }
        } catch (error) {
            console.error('Failed to load custom scenarios from localStorage:', error);
            this.customScenarios = [];
        }
    }
    
    /**
     * 保存済みシナリオ表示の更新
     */
    updateSavedScenariosDisplay() {
        const savedSection = this.container.querySelector('.saved-scenarios');
        const savedList = this.container.querySelector('.saved-scenario-list');
        
        if (this.customScenarios.length > 0) {
            savedSection.style.display = 'block';
            
            savedList.innerHTML = this.customScenarios.map(scenario => `
                <div class="saved-scenario-item" data-scenario-id="${scenario.id}">
                    <div class="saved-scenario-header">
                        <div class="saved-scenario-name">${scenario.name}</div>
                        <div class="saved-scenario-date">${new Date(scenario.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="saved-scenario-description">${scenario.description}</div>
                    <div class="saved-scenario-actions">
                        <button class="saved-scenario-load" data-scenario-id="${scenario.id}">
                            <span class="btn-icon">🎭</span>
                            再生
                        </button>
                        <button class="saved-scenario-delete" data-scenario-id="${scenario.id}">
                            <span class="btn-icon">🗑️</span>
                            削除
                        </button>
                    </div>
                </div>
            `).join('');
            
            // イベントリスナーを追加
            this.bindSavedScenarioEvents();
        } else {
            savedSection.style.display = 'none';
        }
    }
    
    /**
     * 保存済みシナリオのイベントリスナー
     */
    bindSavedScenarioEvents() {
        // 読み込みボタン
        const loadButtons = this.container.querySelectorAll('.saved-scenario-load');
        loadButtons.forEach(btn => {
            const loadHandler = () => {
                const scenarioId = btn.dataset.scenarioId;
                this.loadSavedScenario(scenarioId);
            };
            
            btn.addEventListener('click', loadHandler);
            this.eventListeners.push({ element: btn, event: 'click', handler: loadHandler });
        });
        
        // 削除ボタン
        const deleteButtons = this.container.querySelectorAll('.saved-scenario-delete');
        deleteButtons.forEach(btn => {
            const deleteHandler = () => {
                const scenarioId = btn.dataset.scenarioId;
                this.deleteSavedScenario(scenarioId);
            };
            
            btn.addEventListener('click', deleteHandler);
            this.eventListeners.push({ element: btn, event: 'click', handler: deleteHandler });
        });
    }
    
    /**
     * 保存済みシナリオの読み込み
     */
    async loadSavedScenario(scenarioId) {
        const scenario = this.customScenarios.find(s => s.id === scenarioId);
        if (!scenario) {
            this.showError('シナリオが見つかりません');
            return;
        }
        
        try {
            console.log('📁 Loading saved scenario:', scenario.name);
            await this.selectCustomScenario(scenario.context);
        } catch (error) {
            console.error('❌ Failed to load saved scenario:', error);
            this.showError('シナリオの読み込みに失敗しました');
        }
    }
    
    /**
     * 保存済みシナリオの削除
     */
    deleteSavedScenario(scenarioId) {
        if (!confirm('このシナリオを削除しますか？')) {
            return;
        }
        
        this.customScenarios = this.customScenarios.filter(s => s.id !== scenarioId);
        this.saveCustomScenariosToStorage();
        this.updateSavedScenariosDisplay();
        
        console.log('🗑️ Deleted saved scenario:', scenarioId);
    }
    
    /**
     * 文字数カウンター更新
     */
    updateCharacterCount() {
        const customInput = this.container.querySelector('.custom-input');
        const charCounter = this.container.querySelector('.char-counter');
        
        if (customInput && charCounter) {
            const currentLength = customInput.value.length;
            const maxLength = 500;
            
            charCounter.textContent = `${currentLength} / ${maxLength}`;
            
            // 文字数に応じてスタイル変更
            if (currentLength > maxLength * 0.9) {
                charCounter.style.color = '#ff6b6b';
            } else if (currentLength > maxLength * 0.7) {
                charCounter.style.color = '#ffd93d';
            } else {
                charCounter.style.color = '#6c757d';
            }
        }
    }
    
    /**
     * カスタムフォームのクリア
     */
    clearCustomForm() {
        const titleInput = this.container.querySelector('.custom-title-input');
        const descriptionInput = this.container.querySelector('.custom-input');
        const aspectTags = this.container.querySelectorAll('.aspect-tag');
        
        if (titleInput) titleInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        
        aspectTags.forEach(tag => tag.classList.remove('selected'));
        
        this.updateCharacterCount();
    }
    
    /**
     * 成功メッセージ表示
     */
    showSuccessMessage(message) {
        // 既存のメッセージを削除
        const existingMessage = this.container.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 成功メッセージを作成
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.innerHTML = `
            <div class="success-icon">✅</div>
            <div class="success-text">${message}</div>
        `;
        
        // 分析コンテンツの上に表示
        const analysisContent = this.container.querySelector('.analysis-content');
        analysisContent.appendChild(messageEl);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
    
    /**
     * 対話完了後にSNS共有セクションを表示
     */
    showSharingSectionAfterCompletion() {
        const sharingSection = this.container.querySelector('.sns-sharing-section');
        if (sharingSection) {
            sharingSection.style.display = 'block';
            
            // フェードインアニメーション
            sharingSection.style.opacity = '0';
            sharingSection.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                sharingSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                sharingSection.style.opacity = '1';
                sharingSection.style.transform = 'translateY(0)';
            });
            
            console.log('📤 SNS sharing section displayed');
        }
    }
    
    /**
     * SNSプラットフォームへの共有
     */
    async shareToSocialMedia(platform) {
        if (!this.shareManager || !this.imageExporter) {
            this.showError('共有機能が利用できません');
            return;
        }
        
        try {
            console.log(`🚀 Sharing to ${platform}`);
            
            // 共有データを準備
            const shareData = this.prepareSharingData();
            const customMessage = this.getCustomMessage();
            
            // プラットフォーム別の処理
            switch (platform) {
                case 'twitter':
                    await this.shareToTwitter(shareData, customMessage);
                    break;
                case 'instagram':
                    await this.shareToInstagram(shareData, customMessage);
                    break;
                case 'facebook':
                    await this.shareToFacebook(shareData, customMessage);
                    break;
                case 'linkedin':
                    await this.shareToLinkedIn(shareData, customMessage);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${platform}`);
            }
            
            this.showSuccessMessage(`${platform}への共有準備が完了しました！`);
            
        } catch (error) {
            console.error(`❌ Failed to share to ${platform}:`, error);
            this.showError(`${platform}への共有に失敗しました`);
        }
    }
    
    /**
     * 共有データの準備
     */
    prepareSharingData() {
        const includePersonalInfo = this.container.querySelector('#include-personal-info').checked;
        
        let shareData = {
            scenario: this.getCurrentScenarioInfo(),
            timestamp: new Date().toLocaleString('ja-JP'),
            platform: 'HAQEI Analyzer'
        };
        
        if (includePersonalInfo && this.currentDialogue) {
            const analysis = this.generateShareableAnalysis();
            shareData = {
                ...shareData,
                analysis: analysis,
                participationStats: this.countParticipation(this.currentDialogue.exchanges),
                consensusLevel: this.currentDialogue.consensusLevel || 0,
                outcome: this.currentDialogue.outcome || '調整中'
            };
        }
        
        return shareData;
    }
    
    /**
     * 共有可能な分析データを生成
     */
    generateShareableAnalysis() {
        if (!this.currentDialogue) return null;
        
        const exchanges = this.currentDialogue.exchanges;
        const participationCount = this.countParticipation(exchanges);
        const dominantOS = this.getDominantOS(participationCount);
        
        return {
            totalExchanges: exchanges.length,
            dominantOS: dominantOS,
            insights: this.generateInsights(
                participationCount, 
                this.currentDialogue.consensusLevel || 0, 
                this.currentDialogue.outcome || '調整中'
            ).slice(0, 3) // 最初の3つの洞察のみ
        };
    }
    
    /**
     * Twitter共有
     */
    async shareToTwitter(shareData, customMessage) {
        const shareType = this.getSelectedShareType();
        
        if (shareType === 'image') {
            // 画像付きツイート
            const image = await this.generateImageForPlatform('twitter');
            const text = this.generateTwitterText(shareData, customMessage);
            
            // Twitter Web Intentを使用
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            
            // 新しいタブで開く
            window.open(tweetUrl, '_blank', 'width=600,height=400');
            
            // 画像のダウンロードも提供
            this.downloadImageWithFilename(image, `HAQEI_Twitter_${Date.now()}.png`);
            
        } else if (shareType === 'link') {
            // リンク付きツイート
            const shareUrl = await this.generateShareUrl(shareData);
            const text = this.generateTwitterText(shareData, customMessage, shareUrl);
            
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(tweetUrl, '_blank', 'width=600,height=400');
            
        } else {
            // テキストのみ
            const text = this.generateTwitterText(shareData, customMessage);
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            window.open(tweetUrl, '_blank', 'width=600,height=400');
        }
    }
    
    /**
     * Instagram共有
     */
    async shareToInstagram(shareData, customMessage) {
        // Instagramは外部からの直接投稿ができないため、画像生成とクリップボードコピーを提供
        const image = await this.generateImageForPlatform('instagram');
        const text = this.generateInstagramText(shareData, customMessage);
        
        // 画像をダウンロード
        this.downloadImageWithFilename(image, `HAQEI_Instagram_${Date.now()}.png`);
        
        // テキストをクリップボードにコピー
        await this.copyToClipboard(text);
        
        // ユーザーに指示を表示
        this.showSharingInstructions('instagram', {
            imageDownloaded: true,
            textCopied: true,
            instructions: 'Instagram画像とキャプションをダウンロード・コピーしました。Instagramアプリで投稿してください。'
        });
    }
    
    /**
     * Facebook共有
     */
    async shareToFacebook(shareData, customMessage) {
        const shareType = this.getSelectedShareType();
        
        if (shareType === 'link') {
            const shareUrl = await this.generateShareUrl(shareData);
            const text = this.generateFacebookText(shareData, customMessage);
            
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        } else {
            // 画像 or テキスト共有（手動）
            const image = await this.generateImageForPlatform('facebook');
            const text = this.generateFacebookText(shareData, customMessage);
            
            this.downloadImageWithFilename(image, `HAQEI_Facebook_${Date.now()}.png`);
            await this.copyToClipboard(text);
            
            this.showSharingInstructions('facebook', {
                imageDownloaded: true,
                textCopied: true,
                instructions: 'Facebook用画像とテキストを準備しました。Facebookで手動投稿してください。'
            });
        }
    }
    
    /**
     * LinkedIn共有
     */
    async shareToLinkedIn(shareData, customMessage) {
        const shareType = this.getSelectedShareType();
        
        if (shareType === 'link') {
            const shareUrl = await this.generateShareUrl(shareData);
            const text = this.generateLinkedInText(shareData, customMessage);
            
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(text)}`;
            window.open(linkedinUrl, '_blank', 'width=600,height=400');
        } else {
            const image = await this.generateImageForPlatform('linkedin');
            const text = this.generateLinkedInText(shareData, customMessage);
            
            this.downloadImageWithFilename(image, `HAQEI_LinkedIn_${Date.now()}.png`);
            await this.copyToClipboard(text);
            
            this.showSharingInstructions('linkedin', {
                imageDownloaded: true,
                textCopied: true,
                instructions: 'LinkedIn用画像とテキストを準備しました。LinkedInで手動投稿してください。'
            });
        }
    }
    
    /**
     * プラットフォーム用画像生成
     */
    async generateImageForPlatform(platform) {
        if (!this.imageExporter) {
            throw new Error('ImageExporter not available');
        }
        
        // 共有用の要素を作成
        const shareableElement = this.createShareableElement();
        document.body.appendChild(shareableElement);
        
        try {
            const result = await this.imageExporter.generateSocialMediaImage(shareableElement, platform);
            return result;
        } finally {
            document.body.removeChild(shareableElement);
        }
    }
    
    /**
     * 共有用要素を作成
     */
    createShareableElement() {
        const element = document.createElement('div');
        element.className = 'shareable-dialogue-summary';
        element.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 800px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 20px;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            z-index: 9999;
        `;
        
        const shareData = this.prepareSharingData();
        
        element.innerHTML = `
            <div class="share-header" style="text-align: center; margin-bottom: 30px;">
                <h2 style="margin: 0; font-size: 28px; font-weight: 700;">🎭 HAQEI 内部対話分析</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">${shareData.scenario.name}</p>
            </div>
            
            <div class="share-content" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                ${this.generateShareableContent(shareData)}
            </div>
            
            <div class="share-footer" style="text-align: center; font-size: 14px; opacity: 0.8;">
                <p style="margin: 0;">${shareData.timestamp} • HAQEI Analyzer</p>
                <p style="margin: 5px 0 0 0;">あなたも内部対話を体験してみませんか？</p>
            </div>
        `;
        
        return element;
    }
    
    /**
     * 共有可能なコンテンツ生成
     */
    generateShareableContent(shareData) {
        if (!shareData.analysis) {
            return `
                <div style="text-align: center;">
                    <p style="font-size: 18px; margin: 0;">「${shareData.scenario.name}」のシナリオで</p>
                    <p style="font-size: 18px; margin: 10px 0;">内部対話を体験しました！</p>
                    <p style="font-size: 14px; margin: 20px 0 0 0; opacity: 0.9;">3つのOS人格がどのように対話するか、<br>とても興味深い結果でした。</p>
                </div>
            `;
        }
        
        const analysis = shareData.analysis;
        return `
            <div class="share-stats" style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="text-align: center; flex: 1;">
                        <div style="font-size: 24px; font-weight: 700;">${analysis.totalExchanges}</div>
                        <div style="font-size: 12px; opacity: 0.8;">対話交換数</div>
                    </div>
                    <div style="text-align: center; flex: 1;">
                        <div style="font-size: 18px; font-weight: 600;">${analysis.dominantOS}</div>
                        <div style="font-size: 12px; opacity: 0.8;">主導OS</div>
                    </div>
                    <div style="text-align: center; flex: 1;">
                        <div style="font-size: 20px; font-weight: 600;">${Math.round(shareData.consensusLevel * 100)}%</div>
                        <div style="font-size: 12px; opacity: 0.8;">合意レベル</div>
                    </div>
                </div>
            </div>
            
            <div class="share-insights" style="text-align: left;">
                <h4 style="margin: 0 0 10px 0; font-size: 16px;">主な洞察:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    ${analysis.insights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // SNS別テキスト生成メソッド群
    
    generateTwitterText(shareData, customMessage, shareUrl = null) {
        let text = customMessage || '🎭 HAQEI内部対話分析を体験しました！';
        
        if (shareData.analysis) {
            text += `\n\n📊 ${shareData.analysis.totalExchanges}回の対話で${shareData.analysis.dominantOS}が主導`;
            text += `\n🎯 合意レベル: ${Math.round(shareData.consensusLevel * 100)}%`;
        }
        
        text += `\n\n#HAQEI #内部対話 #自己分析 #易経AI`;
        
        if (shareUrl) {
            text += `\n\n詳細結果: ${shareUrl}`;
        }
        
        return text.substring(0, 280); // Twitter文字数制限
    }
    
    generateInstagramText(shareData, customMessage) {
        let text = customMessage || '🎭 HAQEI内部対話分析を体験してみました！';
        
        text += `\n\n「${shareData.scenario.name}」のシナリオで3つのOS人格がどのように対話するかを可視化。`;
        
        if (shareData.analysis) {
            text += `\n\n✨ 結果ハイライト:\n• ${shareData.analysis.totalExchanges}回の内部対話`;
            text += `\n• ${shareData.analysis.dominantOS}が主導的役割`;
            text += `\n• 合意レベル ${Math.round(shareData.consensusLevel * 100)}%達成`;
        }
        
        text += `\n\n自分の内なる声を理解することで、より良い判断ができるようになります🌟`;
        text += `\n\n#HAQEI #内部対話 #自己分析 #易経AI #セルフディスカバリー #マインドフルネス #自己理解`;
        
        return text;
    }
    
    generateFacebookText(shareData, customMessage) {
        let text = customMessage || 'HAQEI内部対話分析という面白いツールを試してみました！';
        
        text += `\n\n「${shareData.scenario.name}」という状況で、自分の中の3つの人格（価値観OS、社会的OS、防御OS）がどのように対話するかを可視化してくれるんです。`;
        
        if (shareData.analysis) {
            text += `\n\n今回の結果では、${shareData.analysis.totalExchanges}回の内部対話を通じて、${shareData.analysis.dominantOS}が主導的な役割を果たしていることがわかりました。最終的な合意レベルは${Math.round(shareData.consensusLevel * 100)}%でした。`;
            
            if (shareData.analysis.insights.length > 0) {
                text += `\n\n特に印象的だった洞察：\n「${shareData.analysis.insights[0]}」`;
            }
        }
        
        text += `\n\n普段意識していない自分の内なる声を理解できて、とても興味深い体験でした。みなさんもぜひ試してみてください！`;
        
        return text;
    }
    
    generateLinkedInText(shareData, customMessage) {
        let text = customMessage || 'プロフェッショナル向けの自己分析ツール「HAQEI内部対話分析」を体験しました。';
        
        text += `\n\n複雑な意思決定場面において、私たちの内部では複数の「声」が対話していることをご存知でしょうか？`;
        
        text += `\n\nこのツールでは、「${shareData.scenario.name}」というビジネス場面を想定し、価値観OS、社会的OS、防御OSという3つの人格システムの相互作用を可視化します。`;
        
        if (shareData.analysis) {
            text += `\n\n今回の分析結果：`;
            text += `\n• 内部対話回数: ${shareData.analysis.totalExchanges}回`;
            text += `\n• 主導的人格: ${shareData.analysis.dominantOS}`;
            text += `\n• 意思決定の合意レベル: ${Math.round(shareData.consensusLevel * 100)}%`;
            
            if (shareData.analysis.insights.length > 0) {
                text += `\n\n重要な洞察：「${shareData.analysis.insights[0]}」`;
            }
        }
        
        text += `\n\nリーダーシップや複雑な意思決定に携わる方々にとって、自己理解を深める有効なツールだと感じました。`;
        text += `\n\n#リーダーシップ #意思決定 #自己分析 #HAQEI #プロフェッショナル開発`;
        
        return text;
    }
    
    // ユーティリティメソッド群
    
    getSelectedShareType() {
        const checkedRadio = this.container.querySelector('input[name="share-type"]:checked');
        return checkedRadio ? checkedRadio.value : 'image';
    }
    
    getCustomMessage() {
        const messageInput = this.container.querySelector('.custom-message-input');
        return messageInput ? messageInput.value.trim() : '';
    }
    
    getCurrentScenarioInfo() {
        const scenarioTitle = this.container.querySelector('.scenario-title');
        const scenarioContext = this.container.querySelector('.scenario-context');
        
        return {
            name: scenarioTitle ? scenarioTitle.textContent : '不明なシナリオ',
            context: scenarioContext ? scenarioContext.textContent : ''
        };
    }
    
    async generateShareUrl(shareData) {
        if (!this.shareManager) {
            throw new Error('ShareManager not available');
        }
        
        const result = this.shareManager.generateShareableURL(shareData, {
            title: `HAQEI内部対話分析: ${shareData.scenario.name}`,
            description: 'HAQEI Analyzerで生成された内部対話分析結果',
            category: 'dialogue_analysis'
        });
        
        if (result.success) {
            return result.shareURL;
        } else {
            throw new Error(result.message);
        }
    }
    
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('📋 Text copied to clipboard');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // フォールバック: テキストエリアを使った方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }
    
    downloadImageWithFilename(imageResult, filename) {
        if (!imageResult || !imageResult.blob) {
            console.error('Invalid image result for download');
            return;
        }
        
        const url = URL.createObjectURL(imageResult.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('💾 Image downloaded:', filename);
    }
    
    showSharingInstructions(platform, options) {
        const resultsSection = this.container.querySelector('.sharing-results');
        const resultsContent = resultsSection.querySelector('.results-content');
        
        const platformNames = {
            instagram: 'Instagram',
            facebook: 'Facebook',
            linkedin: 'LinkedIn',
            twitter: 'Twitter'
        };
        
        resultsContent.innerHTML = `
            <div class="sharing-success">
                <div class="success-icon">✅</div>
                <h4>${platformNames[platform]}共有準備完了</h4>
                <p>${options.instructions}</p>
                
                <div class="completion-status">
                    ${options.imageDownloaded ? '<div class="status-item">🖼️ 画像をダウンロードしました</div>' : ''}
                    ${options.textCopied ? '<div class="status-item">📋 テキストをクリップボードにコピーしました</div>' : ''}
                </div>
                
                <div class="next-steps">
                    <p><strong>次のステップ:</strong></p>
                    <ol>
                        <li>${platformNames[platform]}アプリを開く</li>
                        <li>新しい投稿を作成</li>
                        <li>ダウンロードした画像を添付</li>
                        <li>クリップボードからテキストを貼り付け</li>
                        <li>投稿を公開</li>
                    </ol>
                </div>
            </div>
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    updateMessageCounter() {
        const messageInput = this.container.querySelector('.custom-message-input');
        const counter = this.container.querySelector('.message-counter');
        
        if (messageInput && counter) {
            const currentLength = messageInput.value.length;
            const maxLength = 280;
            
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ff6b6b';
            } else if (currentLength > maxLength * 0.7) {
                counter.style.color = '#ffd93d';
            } else {
                counter.style.color = '#6c757d';
            }
        }
    }
    
    hideSharingResults() {
        const resultsSection = this.container.querySelector('.sharing-results');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }
    
    // 共有アクション実装
    
    async generateSharingImage() {
        try {
            const shareableElement = this.createShareableElement();
            document.body.appendChild(shareableElement);
            
            const result = await this.imageExporter.exportToImage(shareableElement);
            this.downloadImageWithFilename(result, `HAQEI_対話分析_${Date.now()}.png`);
            
            document.body.removeChild(shareableElement);
            this.showSuccessMessage('画像を生成・ダウンロードしました');
            
        } catch (error) {
            console.error('❌ Failed to generate sharing image:', error);
            this.showError('画像の生成に失敗しました');
        }
    }
    
    async generateSharingLink() {
        try {
            const shareData = this.prepareSharingData();
            const shareUrl = await this.generateShareUrl(shareData);
            
            await this.copyToClipboard(shareUrl);
            
            const resultsSection = this.container.querySelector('.sharing-results');
            const resultsContent = resultsSection.querySelector('.results-content');
            
            resultsContent.innerHTML = `
                <div class="sharing-success">
                    <div class="success-icon">🔗</div>
                    <h4>共有リンクを生成しました</h4>
                    <div class="generated-link">
                        <input type="text" value="${shareUrl}" readonly class="link-input">
                        <button class="copy-link-btn" onclick="navigator.clipboard.writeText('${shareUrl}')">コピー</button>
                    </div>
                    <p>このリンクは7日間有効です。友人や家族と自由に共有してください。</p>
                </div>
            `;
            
            resultsSection.style.display = 'block';
            this.showSuccessMessage('共有リンクをクリップボードにコピーしました');
            
        } catch (error) {
            console.error('❌ Failed to generate sharing link:', error);
            this.showError('共有リンクの生成に失敗しました');
        }
    }
    
    async copySharingText() {
        try {
            const shareData = this.prepareSharingData();
            const customMessage = this.getCustomMessage();
            const text = this.generateGenericSharingText(shareData, customMessage);
            
            await this.copyToClipboard(text);
            this.showSuccessMessage('共有テキストをクリップボードにコピーしました');
            
        } catch (error) {
            console.error('❌ Failed to copy sharing text:', error);
            this.showError('テキストのコピーに失敗しました');
        }
    }
    
    generateGenericSharingText(shareData, customMessage) {
        let text = customMessage || 'HAQEI内部対話分析を体験しました！';
        
        text += `\n\n「${shareData.scenario.name}」のシナリオで、自分の中の3つのOS人格がどのように対話するかを可視化。`;
        
        if (shareData.analysis) {
            text += `\n\n📊 結果サマリー:`;
            text += `\n• ${shareData.analysis.totalExchanges}回の内部対話`;
            text += `\n• ${shareData.analysis.dominantOS}が主導`;
            text += `\n• 合意レベル: ${Math.round(shareData.consensusLevel * 100)}%`;
            
            if (shareData.analysis.insights.length > 0) {
                text += `\n\n💡 主な洞察:\n「${shareData.analysis.insights[0]}」`;
            }
        }
        
        text += `\n\n自分の内なる声を理解することで、より良い判断ができるようになります。`;
        text += `\n\n#HAQEI #内部対話 #自己分析`;
        
        return text;
    }
    
    async downloadAllFormats() {
        try {
            const shareableElement = this.createShareableElement();
            document.body.appendChild(shareableElement);
            
            // 画像形式でダウンロード
            const timestamp = Date.now();
            const baseFilename = `HAQEI_対話分析_${timestamp}`;
            
            const imageResult = await this.imageExporter.exportToImage(shareableElement);
            this.downloadImageWithFilename(imageResult, `${baseFilename}.png`);
            
            // SNS用画像を生成
            const platforms = ['twitter', 'instagram', 'facebook', 'linkedin'];
            for (const platform of platforms) {
                const socialResult = await this.imageExporter.generateSocialMediaImage(shareableElement, platform);
                this.downloadImageWithFilename(socialResult, `${baseFilename}_${platform}.png`);
            }
            
            // テキストファイルを生成
            const shareData = this.prepareSharingData();
            const text = this.generateGenericSharingText(shareData, this.getCustomMessage());
            const textBlob = new Blob([text], { type: 'text/plain' });
            const textUrl = URL.createObjectURL(textBlob);
            const textA = document.createElement('a');
            textA.href = textUrl;
            textA.download = `${baseFilename}.txt`;
            document.body.appendChild(textA);
            textA.click();
            document.body.removeChild(textA);
            URL.revokeObjectURL(textUrl);
            
            document.body.removeChild(shareableElement);
            this.showSuccessMessage('全形式でダウンロードを完了しました');
            
        } catch (error) {
            console.error('❌ Failed to download all formats:', error);
            this.showError('一括ダウンロードに失敗しました');
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
        // 再生停止
        this.stopDialogue();
        
        // 共有コンポーネントの破棄
        if (this.shareManager) {
            this.shareManager.destroy();
        }
        if (this.imageExporter) {
            this.imageExporter.destroy();
        }
        
        // イベントリスナーの削除
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // DOM要素クリア
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        console.log('🗑️ DialoguePlayer destroyed');
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DialoguePlayer;
}

console.log('🎬 DialoguePlayer class loaded successfully');