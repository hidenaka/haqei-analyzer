/**
 * BasicResultsTab - 基本結果表示タブ (V3データベース統合版)
 * 
 * 機能:
 * 1. Triple OSカードの表示（Engine, Interface, SafeMode）
 * 2. V3データベースからの詳細情報表示
 * 3. スコア解釈とプログレスバー
 * 4. 特性タグとキーワード表示
 * 5. 推奨アクションの提示
 */
class BasicResultsTab extends BaseTabView {
    constructor() {
        super('basic-results');
        this.hexagramExtractor = null;
        this.analysisData = null;
        this.summaryGenerator = null;
        
        // 九宮構成をデフォルトで使用
        console.log('🔧 九宮構成モード有効化（デフォルト）');
        
        // V3データベースの参照を保持
        this.v3Database = null;
        this.initializeV3Database();
        this.initializeSummaryGenerator();
        
        console.log('📊 BasicResultsTab初期化中...');
        
        // localStorageからデータ読み込み
        this.loadAnalysisData();
        this.initializeExtractor();
    }

    /**
     * V3データベースの初期化
     */
    initializeV3Database() {
        if (typeof window !== 'undefined' && window.HexagramHumanTraitsV3) {
            this.v3Database = window.HexagramHumanTraitsV3;
            console.log('✅ V3データベース読み込み成功:', Object.keys(this.v3Database).length, '卦');
        } else {
            console.error('❌ V3データベース読み込み失敗 - window.HexagramHumanTraitsV3が見つかりません');
        }
    }

    /**
     * SummaryGeneratorの初期化
     */
    initializeSummaryGenerator() {
        if (typeof window !== 'undefined' && window.SummaryGenerator) {
            this.summaryGenerator = new window.SummaryGenerator();
            console.log('✅ SummaryGenerator初期化成功');
        } else {
            console.error('❌ SummaryGenerator読み込み失敗');
        }
    }

    /**
     * 分析データを設定
     */
    setData(data) {
        console.log('📊 setData呼び出し:', data);
        
        try {
            const normalizedData = this.normalizeAnalysisData(data);
            
            if (normalizedData) {
                this.analysisData = normalizedData;
                console.log('✅ setData: データ正規化完了:', this.analysisData);
                
                // データ検証
                const validation = this.validateAnalysisData(this.analysisData);
                if (validation.isValid) {
                    this.updateContent();
                    console.log('✅ setData: コンテンツ更新完了');
                } else {
                    console.warn('⚠️ setData: データが無効です:', validation.reason);
                    this.showFallbackContent();
                }
            } else {
                console.warn('⚠️ setData: 正規化されたデータがありません');
                this.showFallbackContent();
            }
        } catch (error) {
            console.error('❌ setData エラー:', error);
            this.showErrorContent('データの設定中にエラーが発生しました');
        }
    }

    /**
     * 分析データの正規化
     */
    normalizeAnalysisData(data) {
        if (!data) {
            console.warn('⚠️ normalizeAnalysisData: データが提供されていません');
            return this.getDefaultAnalysisData();
        }
        
        console.log('🔄 normalizeAnalysisData: 入力データ:', data);
        
        const normalized = {
            engineOS: this.normalizeOSData(data.engineOS || data.engine, 'Engine OS'),
            interfaceOS: this.normalizeOSData(data.interfaceOS || data.interface, 'Interface OS'),
            safeModeOS: this.normalizeOSData(data.safeModeOS || data.safeMode, 'SafeMode OS'),
            timestamp: data.timestamp || Date.now(),
            sessionId: data.sessionId || 'unknown'
        };
        
        console.log('✅ normalizeAnalysisData: 正規化完了:', normalized);
        return normalized;
    }

    /**
     * OSデータの正規化
     */
    normalizeOSData(osData, defaultName) {
        if (!osData) {
            return {
                name: defaultName,
                score: 0,
                hexagramName: 'データなし',
                hexagram: 'データなし',
                traits: [],
                keywords: []
            };
        }

        return {
            name: osData.name || defaultName,
            score: osData.score || 0,
            hexagramName: osData.hexagramName || osData.hexagram?.name || osData.hexagram || 'Unknown',
            hexagram: osData.hexagram || osData.hexagramName || 'Unknown',
            traits: osData.traits || [],
            keywords: osData.keywords || []
        };
    }

    /**
     * データ検証
     */
    validateAnalysisData(data) {
        if (!data) {
            return { isValid: false, reason: 'データがありません' };
        }
        
        if (!data.engineOS || !data.interfaceOS || !data.safeModeOS) {
            return { isValid: false, reason: 'Triple OSデータが不完全です' };
        }
        
        return { isValid: true };
    }

    /**
     * デフォルトの分析データ
     */
    getDefaultAnalysisData() {
        return {
            engineOS: {
                name: 'Engine OS',
                score: 75,
                hexagramName: '乾為天',
                hexagram: '乾為天',
                traits: ['創造的', 'リーダーシップ', '革新的'],
                keywords: ['イノベーション', '先見性', '独立性']
            },
            interfaceOS: {
                name: 'Interface OS',
                score: 82,
                hexagramName: '兌為澤',
                hexagram: '兌為澤',
                traits: ['協調的', 'コミュニケーション', '楽観的'],
                keywords: ['社交性', '調和', '柔軟性']
            },
            safeModeOS: {
                name: 'SafeMode OS',
                score: 68,
                hexagramName: '坤為地',
                hexagram: '坤為地',
                traits: ['安定志向', '慎重', '保守的'],
                keywords: ['安全性', '継続性', '支援']
            },
            timestamp: Date.now(),
            sessionId: 'default'
        };
    }

    /**
     * コンテンツの更新
     */
    updateContent() {
        console.log('🔄 updateContent開始');
        
        // containerがまだ設定されていない場合は、後でrenderから呼ばれるのを待つ
        if (!this.container) {
            console.log('⏳ コンテナがまだ初期化されていません。render()時に再度呼び出されます');
            return;
        }
        
        const container = this.getContainer();
        if (!container) {
            console.error('❌ コンテナの取得に失敗しました');
            return;
        }
        
        if (!this.analysisData) {
            console.warn('⚠️ 分析データがありません');
            this.showFallbackContent();
            return;
        }
        
        // Triple OSカードの描画
        this.renderTripleOSCards();
    }

    /**
     * Triple OSカードの描画
     */
    renderTripleOSCards() {
        console.log('🎨 Triple OSカードを描画');
        
        const container = this.getContainer();
        if (!container) {
            console.error('❌ renderTripleOSCards: コンテナが見つかりません');
            return;
        }
        
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        console.log('📊 OSデータ:', { engineOS, interfaceOS, safeModeOS });
        
        // 要約データの生成
        const fourLineSummary = this.summaryGenerator ? 
            this.summaryGenerator.generateFourLineSummary(this.analysisData) : null;

        container.innerHTML = `
            ${fourLineSummary ? this.renderSummarySection(fourLineSummary) : ''}
            <div class="os-cards-wrapper">
                ${this.renderEngineOSCard(engineOS)}
                ${this.renderInterfaceOSCard(interfaceOS)}
                ${this.renderSafeModeOSCard(safeModeOS)}
            </div>
            ${this.renderDetailedAnalysisSection()}
        `;
        
        console.log('✅ Triple OSカード描画完了');
    }

    /**
     * V3データベースから卦名に対応するデータを取得
     * @param {string} hexagramName - 卦名（例: "乾為天"）
     * @returns {Object|null} V3データまたはnull
     */
    getV3DataForHexagram(hexagramName) {
        // データ検証
        if (!hexagramName || hexagramName === 'データなし' || hexagramName === '') {
            console.warn('⚠️ 卦名が無効です:', hexagramName);
            return null;
        }
        
        // V3データベース存在確認
        if (!this.v3Database) {
            console.error('❌ V3データベースが初期化されていません');
            return null;
        }
        
        // 卦名の正規化（中国漢字→日本漢字変換）
        const normalizedName = this.normalizeHexagramName(hexagramName);
        
        // データ取得
        const v3Data = this.v3Database[normalizedName];
        
        if (!v3Data) {
            console.warn(`⚠️ V3データが見つかりません: ${normalizedName} (元: ${hexagramName})`);
            return null;
        }
        
        console.log(`✅ V3データ取得成功: ${normalizedName}`);
        return v3Data;
    }

    /**
     * 卦名の正規化（表記ゆれ対応）
     * @param {string} name - 元の卦名
     * @returns {string} 正規化された卦名
     */
    normalizeHexagramName(name) {
        // 中国漢字→日本漢字変換マップ
        const replacements = {
            '为': '為',
            '泽': '澤',
            '讼': '訟',
            '师': '師',
            '贲': '賁',
            '剥': '剝',
            '复': '復',
            '风': '風'
        };
        
        let normalized = name;
        for (const [chinese, japanese] of Object.entries(replacements)) {
            normalized = normalized.replace(new RegExp(chinese, 'g'), japanese);
        }
        
        return normalized;
    }

    /**
     * OSタイプに応じたV3データを取得
     * @param {string} hexagramName - 卦名
     * @param {string} osType - OSタイプ（engineOS/interfaceOS/safeModeOS）
     * @returns {Object|null} 該当するOSのV3データ
     */
    getV3DataForOS(hexagramName, osType) {
        const v3Data = this.getV3DataForHexagram(hexagramName);
        
        if (!v3Data) {
            return null;
        }
        
        // OSタイプに応じたデータを返す
        switch(osType) {
            case 'engineOS':
                return v3Data.asEngineOS || null;
            case 'interfaceOS':
                return v3Data.asInterfaceOS || null;
            case 'safeModeOS':
                return v3Data.asSafeModeOS || null;
            default:
                console.error('❌ 不明なOSタイプ:', osType);
                return null;
        }
    }

    /**
     * 卦名を様々な場所から抽出
     */
    extractHexagramName(osData) {
        // パターン1: hexagram.name
        if (osData.hexagram?.name) {
            return osData.hexagram.name;
        }
        
        // パターン2: hexagramName
        if (osData.hexagramName) {
            return osData.hexagramName;
        }
        
        // パターン3: hexagram (文字列の場合)
        if (typeof osData.hexagram === 'string' && osData.hexagram !== 'データなし') {
            return osData.hexagram;
        }
        
        // パターン4: name (OS名でない場合)
        if (osData.name && !osData.name.includes('OS')) {
            return osData.name;
        }
        
        return null;
    }

    /**
     * Engine OSカードをレンダリング
     */
    renderEngineOSCard(osData) {
        // データ検証
        if (!osData) {
            return this.renderErrorCard('Engine OS', 'データの読み込みに失敗しました');
        }
        
        // 卦名の取得（複数の場所から試行）
        const hexagramName = this.extractHexagramName(osData);
        
        if (!hexagramName) {
            return this.renderFallbackCard('Engine OS', osData, '⚙️', '内なる原動力');
        }
        
        // V3データを取得
        const v3Data = this.getV3DataForOS(hexagramName, 'engineOS');
        
        // V3データがある場合は詳細表示
        if (v3Data && v3Data.profile) {
            return `
                <div class="os-card os-card-engine">
                    <div class="os-card-header">
                        <div class="os-icon">⚙️</div>
                        <div class="os-title">
                            <h3>Engine OS</h3>
                            <p class="os-subtitle">内なる原動力</p>
                        </div>
                        <div class="os-score">
                            <div class="score-value">${osData.score || 0}</div>
                            <div class="score-label">pts</div>
                        </div>
                    </div>
                    
                    <div class="hexagram-info">
                        <span class="hexagram-symbol">${osData.hexagram?.symbol || ''}</span>
                        <span class="hexagram-name">${hexagramName}</span>
                    </div>
                    
                    <div class="os-v3-content">
                        <div class="v3-type">
                            <span class="v3-label">タイプ:</span>
                            <span class="v3-value">${v3Data.profile.type}</span>
                        </div>
                        
                        <div class="v3-description">
                            <p>${v3Data.profile.description}</p>
                        </div>
                        
                        ${v3Data.normalState ? `
                            <div class="v3-example">
                                <span class="v3-label">例:</span>
                                <p>${v3Data.normalState.example}</p>
                            </div>
                            
                            <div class="v3-energy">
                                <span class="v3-label">エネルギー:</span>
                                <span>${v3Data.normalState.energyLevel}</span>
                            </div>
                        ` : ''}
                        
                        ${v3Data.maintenance ? `
                            <div class="v3-advice">
                                <span class="v3-label">💡 アドバイス:</span>
                                <p>${v3Data.maintenance.tip}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        // V3データがない場合は未実装メッセージ
        return this.renderNotImplementedCard('Engine OS', hexagramName, osData);
    }

    /**
     * Interface OSカードをレンダリング
     */
    renderInterfaceOSCard(osData) {
        if (!osData) {
            return this.renderErrorCard('Interface OS', 'データの読み込みに失敗しました');
        }
        
        const hexagramName = this.extractHexagramName(osData);
        
        if (!hexagramName) {
            return this.renderFallbackCard('Interface OS', osData, '🌐', '社会との接点');
        }
        
        const v3Data = this.getV3DataForOS(hexagramName, 'interfaceOS');
        
        if (v3Data && v3Data.profile) {
            return `
                <div class="os-card os-card-interface">
                    <div class="os-card-header">
                        <div class="os-icon">🌐</div>
                        <div class="os-title">
                            <h3>Interface OS</h3>
                            <p class="os-subtitle">社会との接点</p>
                        </div>
                        <div class="os-score">
                            <div class="score-value">${osData.score || 0}</div>
                            <div class="score-label">pts</div>
                        </div>
                    </div>
                    
                    <div class="hexagram-info">
                        <span class="hexagram-symbol">${osData.hexagram?.symbol || ''}</span>
                        <span class="hexagram-name">${hexagramName}</span>
                    </div>
                    
                    <div class="os-v3-content">
                        <div class="v3-type">
                            <span class="v3-label">タイプ:</span>
                            <span class="v3-value">${v3Data.profile.type}</span>
                        </div>
                        
                        <div class="v3-description">
                            <p>${v3Data.profile.description}</p>
                        </div>
                        
                        ${v3Data.howToTalk ? `
                            <div class="v3-communication">
                                <span class="v3-label">コミュニケーション:</span>
                                <p>${v3Data.howToTalk.style}</p>
                            </div>
                            
                            <div class="v3-example">
                                <span class="v3-label">例:</span>
                                <p>${v3Data.howToTalk.example}</p>
                            </div>
                        ` : ''}
                        
                        ${v3Data.bestEnvironment ? `
                            <div class="v3-environment">
                                <span class="v3-label">最適な環境:</span>
                                <p>${v3Data.bestEnvironment.where}</p>
                            </div>
                        ` : ''}
                        
                        ${v3Data.relationshipTips ? `
                            <div class="v3-advice">
                                <span class="v3-label">💡 関係性のヒント:</span>
                                <p>${v3Data.relationshipTips.advice}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        return this.renderNotImplementedCard('Interface OS', hexagramName, osData);
    }

    /**
     * SafeMode OSカードをレンダリング
     */
    renderSafeModeOSCard(osData) {
        if (!osData) {
            return this.renderErrorCard('SafeMode OS', 'データの読み込みに失敗しました');
        }
        
        const hexagramName = this.extractHexagramName(osData);
        
        if (!hexagramName) {
            return this.renderFallbackCard('SafeMode OS', osData, '🛡️', '心の防御機構');
        }
        
        const v3Data = this.getV3DataForOS(hexagramName, 'safeModeOS');
        
        if (v3Data && v3Data.profile) {
            return `
                <div class="os-card os-card-safemode">
                    <div class="os-card-header">
                        <div class="os-icon">🛡️</div>
                        <div class="os-title">
                            <h3>SafeMode OS</h3>
                            <p class="os-subtitle">心の防御機構</p>
                        </div>
                        <div class="os-score">
                            <div class="score-value">${osData.score || 0}</div>
                            <div class="score-label">pts</div>
                        </div>
                    </div>
                    
                    <div class="hexagram-info">
                        <span class="hexagram-symbol">${osData.hexagram?.symbol || ''}</span>
                        <span class="hexagram-name">${hexagramName}</span>
                    </div>
                    
                    <div class="os-v3-content">
                        <div class="v3-type">
                            <span class="v3-label">タイプ:</span>
                            <span class="v3-value">${v3Data.profile.type}</span>
                        </div>
                        
                        <div class="v3-description">
                            <p>${v3Data.profile.description}</p>
                        </div>
                        
                        ${v3Data.stressResponse ? `
                            <div class="v3-stress">
                                <span class="v3-label">ストレス反応:</span>
                                <p>${v3Data.stressResponse.whatYouDo}</p>
                            </div>
                            
                            <div class="v3-example">
                                <span class="v3-label">例:</span>
                                <p>${v3Data.stressResponse.example}</p>
                            </div>
                        ` : ''}
                        
                        ${v3Data.emergencyMode ? `
                            <div class="v3-emergency">
                                <span class="v3-label">緊急モード:</span>
                                <p>${v3Data.emergencyMode.whatHappens}</p>
                            </div>
                        ` : ''}
                        
                        ${v3Data.howToRecover ? `
                            <div class="v3-advice">
                                <span class="v3-label">💡 回復方法:</span>
                                <p>${v3Data.howToRecover.bestWay}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        return this.renderNotImplementedCard('SafeMode OS', hexagramName, osData);
    }

    /**
     * エラーカード表示
     */
    renderErrorCard(osType, message) {
        return `
            <div class="os-card os-card-error">
                <h3>${osType}</h3>
                <p class="error-message">❌ ${message}</p>
            </div>
        `;
    }

    /**
     * フォールバックカード表示
     */
    renderFallbackCard(osType, osData, icon, subtitle) {
        return `
            <div class="os-card os-card-${osType.toLowerCase().replace(' ', '-')}">
                <div class="os-card-header">
                    <div class="os-icon">${icon}</div>
                    <div class="os-title">
                        <h3>${osType}</h3>
                        <p class="os-subtitle">${subtitle}</p>
                    </div>
                    <div class="os-score">
                        <div class="score-value">${osData.score || 0}</div>
                        <div class="score-label">pts</div>
                    </div>
                </div>
                
                <div class="fallback-message">
                    <p>🚧 データを読み込み中です</p>
                </div>
            </div>
        `;
    }

    /**
     * 未実装メッセージカード
     */
    renderNotImplementedCard(osType, hexagramName, osData) {
        return `
            <div class="os-card os-card-not-implemented">
                <div class="os-card-header">
                    <div class="os-icon">⚙️</div>
                    <div class="os-title">
                        <h3>${osType}</h3>
                        <p class="os-subtitle">データ準備中</p>
                    </div>
                    <div class="os-score">
                        <div class="score-value">${osData.score || 0}</div>
                        <div class="score-label">pts</div>
                    </div>
                </div>
                
                <div class="hexagram-info">
                    <span class="hexagram-name">${hexagramName}</span>
                </div>
                
                <div class="not-implemented-message">
                    <p>🚧 まだ実装していません - 今後実装予定です</p>
                    <p class="small-text">V3データベースの該当データが準備中です</p>
                </div>
            </div>
        `;
    }

    /**
     * localStorageからデータ読み込み
     */
    loadAnalysisData() {
        try {
            const storedData = localStorage.getItem('tripleOSAnalysisResult');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log('📚 localStorageからデータ読み込み成功:', parsedData);
                this.analysisData = this.normalizeAnalysisData(parsedData);
            }
        } catch (error) {
            console.error('❌ localStorageからのデータ読み込み失敗:', error);
        }
    }

    /**
     * HexagramExtractorの初期化
     */
    initializeExtractor() {
        if (window.HexagramExtractor) {
            this.hexagramExtractor = new window.HexagramExtractor();
            console.log('✅ HexagramExtractor初期化完了');
        } else {
            console.warn('⚠️ HexagramExtractorが利用できません');
        }
    }

    /**
     * フォールバックコンテンツの表示
     */
    showFallbackContent() {
        const container = this.getContainer();
        if (container) {
            container.innerHTML = `
                <div class="fallback-content">
                    <p>📊 デフォルトデータを表示しています</p>
                </div>
            `;
            
            // デフォルトデータで表示
            this.analysisData = this.getDefaultAnalysisData();
            this.renderTripleOSCards();
        }
    }

    /**
     * エラーコンテンツの表示
     */
    showErrorContent(message) {
        const container = this.getContainer();
        if (container) {
            container.innerHTML = `
                <div class="error-content">
                    <h3>❌ エラー</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    /**
     * スコアの解釈
     */
    interpretScore(score) {
        if (score >= 80) {
            return { level: 'excellent', message: '卓越した特性' };
        } else if (score >= 60) {
            return { level: 'good', message: '強い特性' };
        } else if (score >= 40) {
            return { level: 'moderate', message: '中程度の特性' };
        } else if (score >= 20) {
            return { level: 'weak', message: '弱い特性' };
        } else {
            return { level: 'minimal', message: '最小限の特性' };
        }
    }

    /**
     * タブのHTMLを生成
     */
    render(container) {
        console.log('🎨 BasicResultsTab render()呼び出し');
        
        // BaseTabViewのrenderメソッドを呼び出し
        super.render(container);
        
        // analysisDataが存在する場合はupdateContentを呼び出し
        if (this.analysisData) {
            console.log('📊 analysisDataが存在するため、updateContent()を呼び出します');
            this.updateContent();
        } else {
            console.log('⚠️ analysisDataが存在しません');
        }
    }
    
    renderContent(container) {
        // コンテナにHTMLを設定
        container.innerHTML = `
            <div class="basic-results-content">
                <div id="os-cards-container">
                    <!-- ここにTriple OSカードが描画される -->
                </div>
            </div>
        `;
    }

    /**
     * コンテナ要素を取得または作成
     */
    getContainer() {
        // タブパネル全体のコンテナを取得（BaseTabViewから継承）
        const tabContainer = this.container;
        
        if (!tabContainer) {
            console.warn('⚠️ タブコンテナがまだ初期化されていません');
            return null;
        }
        
        // os-cards-containerを探す
        let osCardsContainer = tabContainer.querySelector('#os-cards-container');
        
        if (!osCardsContainer) {
            console.log('📦 os-cards-containerが存在しないため作成');
            
            // コンテナ全体の構造を作成
            tabContainer.innerHTML = `
                <div class="basic-results-content">
                    <div id="os-cards-container" class="os-cards-container">
                        <!-- Triple OSカードがここに表示されます -->
                    </div>
                </div>
            `;
            
            osCardsContainer = tabContainer.querySelector('#os-cards-container');
            console.log('✅ os-cards-container作成完了');
        }
        
        return osCardsContainer;
    }

    /**
     * 4行要約セクションのレンダリング
     * @param {Object} summary - 4行要約データ
     * @returns {string} HTML文字列
     */
    renderSummarySection(summary) {
        return `
            <div class="summary-section">
                <div class="summary-header">
                    <h2>🎯 あなたの人格特性　4行要約</h2>
                    <p class="summary-subtitle">AI分析による簡潔な特性解説</p>
                </div>
                <div class="summary-content">
                    <div class="summary-line" data-line="1">
                        <span class="line-number">1</span>
                        <p>${summary.line1}</p>
                    </div>
                    <div class="summary-line" data-line="2">
                        <span class="line-number">2</span>
                        <p>${summary.line2}</p>
                    </div>
                    <div class="summary-line" data-line="3">
                        <span class="line-number">3</span>
                        <p>${summary.line3}</p>
                    </div>
                    <div class="summary-line" data-line="4">
                        <span class="line-number">4</span>
                        <p>${summary.line4}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 詳細分析セクションのレンダリング（九宮構成のみ）
     * @returns {string} HTML文字列
     */
    renderDetailedAnalysisSection() {
        return this.renderNinePhaseSection();
    }

    /**
     * HTMLエスケープ用ユーティリティ関数
     * @param {string} text - エスケープするテキスト
     * @returns {string} エスケープ済みテキスト
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 九宮分析セクションのレンダリング
     * @returns {string} HTML文字列
     */
    renderNinePhaseSection() {
        console.log('🔷 九宮構成レンダリング開始');
        
        if (!this.summaryGenerator || !this.analysisData) {
            return '<div class="nine-phase-placeholder">分析準備中...</div>';
        }
        
        // 九宮構成のメソッドが実装されているか確認
        if (typeof this.summaryGenerator.generateNinePhaseAnalysis !== 'function') {
            console.error('❌ generateNinePhaseAnalysisメソッドが未実装');
            return '<div class="error-message">九宮構成の生成に失敗しました。ページをリロードしてください。</div>';
        }
        
        // エラーハンドリングを追加
        let analysis;
        try {
            analysis = this.summaryGenerator.generateNinePhaseAnalysis(this.analysisData);
        } catch (error) {
            console.error('❌ 九宮構成生成エラー:', error);
            return '<div class="error-message">分析の生成中にエラーが発生しました。</div>';
        }
        
        return `
            <div class="nine-phase-section">
                <div class="nine-phase-header">
                    <h2>📊 九宮による人格深層分析</h2>
                    <p class="nine-phase-subtitle">36問の回答から導き出された9つの側面</p>
                </div>
                
                <div class="nine-phase-grid">
                    <!-- Engine OS 列 -->
                    <div class="phase-column engine-column">
                        <div class="column-header">
                            <h3>⚙️ Engine OS</h3>
                            <p>内なる原動力</p>
                        </div>
                        ${this.renderPhaseCard(analysis.engineDrive, 'engine')}
                        ${this.renderPhaseCard(analysis.engineCreativity, 'engine')}
                        ${this.renderPhaseCard(analysis.enginePropulsion, 'engine')}
                    </div>
                    
                    <!-- Interface OS 列 -->
                    <div class="phase-column interface-column">
                        <div class="column-header">
                            <h3>🔄 Interface OS</h3>
                            <p>社会適応力</p>
                        </div>
                        ${this.renderPhaseCard(analysis.interfaceAdaptation, 'interface')}
                        ${this.renderPhaseCard(analysis.interfaceCommunication, 'interface')}
                        ${this.renderPhaseCard(analysis.interfaceHarmony, 'interface')}
                    </div>
                    
                    <!-- SafeMode OS 列 -->
                    <div class="phase-column safemode-column">
                        <div class="column-header">
                            <h3>🛡️ SafeMode OS</h3>
                            <p>ストレス耐性</p>
                        </div>
                        ${this.renderPhaseCard(analysis.safeModeStability, 'safemode')}
                        ${this.renderPhaseCard(analysis.safeModeResilience, 'safemode')}
                        ${this.renderPhaseCard(analysis.safeModeBalance, 'safemode')}
                    </div>
                </div>
                
                ${this.renderScoreExplanations()}
            </div>
        `;
    }

    /**
     * フェーズカードのレンダリング（拡張版・XSS対策付き）
     * @param {Object} phase - フェーズデータ
     * @param {string} type - OSタイプ
     * @returns {string} HTML文字列
     */
    renderPhaseCard(phase, type) {
        if (!phase) return '';
        
        const typeClass = `phase-card-${type}`;
        const scoreDisplay = phase.score ? `<span class="phase-score">${phase.score}pts</span>` : '';
        
        // XSS対策: titleとsubtitleをエスケープ
        const safeTitle = this.escapeHtml(phase.title);
        const safeSubtitle = phase.subtitle ? this.escapeHtml(phase.subtitle) : '';
        
        // contentがオブジェクトの場合は拡張表示、文字列の場合は従来表示
        let contentHtml = '';
        if (typeof phase.content === 'object' && phase.content !== null) {
            const content = phase.content;
            contentHtml = `
                <div class="phase-content-rich">
                    ${content.main ? `<p class="content-main">${this.escapeHtml(content.main)}</p>` : ''}
                    ${content.metaphor ? `<div class="content-metaphor">💡 ${this.escapeHtml(content.metaphor)}</div>` : ''}
                    ${content.example ? `<div class="content-example">📌 例: ${this.escapeHtml(content.example)}</div>` : ''}
                    ${content.normal ? `<div class="content-normal">📊 通常時: ${this.escapeHtml(content.normal)}</div>` : ''}
                    ${content.energyLevel ? `<div class="content-energy">⚡ ${this.escapeHtml(content.energyLevel)}</div>` : ''}
                    ${content.when ? `<div class="content-when">🎯 発動時: ${this.escapeHtml(content.when)}</div>` : ''}
                    ${content.howToCharge ? `<div class="content-charge">🔋 充電方法: ${this.escapeHtml(content.howToCharge)}</div>` : ''}
                    ${content.warning ? `<div class="content-warning">⚠️ 注意: ${this.escapeHtml(content.warning)}</div>` : ''}
                    ${content.tip ? `<div class="content-tip">💡 ヒント: ${this.escapeHtml(content.tip)}</div>` : ''}
                    ${content.style ? `<div class="content-style">🗣️ スタイル: ${this.escapeHtml(content.style)}</div>` : ''}
                    ${content.goodAt ? `<div class="content-good">✅ 得意: ${this.escapeHtml(content.goodAt)}</div>` : ''}
                    ${content.notGoodAt ? `<div class="content-notgood">❌ 苦手: ${this.escapeHtml(content.notGoodAt)}</div>` : ''}
                    ${content.withWho ? `<div class="content-who">👥 相性: ${this.escapeHtml(content.withWho)}</div>` : ''}
                    ${content.advice ? `<div class="content-advice">💡 アドバイス: ${this.escapeHtml(content.advice)}</div>` : ''}
                    ${content.whatYouDo ? `<div class="content-action">🎯 行動: ${this.escapeHtml(content.whatYouDo)}</div>` : ''}
                    ${content.coreValue ? `<div class="content-core-value">💎 核心価値: ${this.escapeHtml(content.coreValue)}</div>` : ''}
                    ${content.lifeMission ? `<div class="content-life-mission">🎯 人生の使命: ${this.escapeHtml(content.lifeMission)}</div>` : ''}
                    ${content.socialMission ? `<div class="content-social-mission">🌍 社会的使命: ${this.escapeHtml(content.socialMission)}</div>` : ''}
                    ${content.innerConflict ? `<div class="content-inner-conflict">⚖️ 内なる葛藤: ${this.escapeHtml(content.innerConflict)}</div>` : ''}
                    ${content.growthPath ? `<div class="content-growth-path">📈 成長への道: ${this.escapeHtml(content.growthPath)}</div>` : ''}
                    ${content.morning ? `<div class="content-morning">🌅 朝の思考: ${this.escapeHtml(content.morning)}</div>` : ''}
                    ${content.decision ? `<div class="content-decision">🤔 意思決定: ${this.escapeHtml(content.decision)}</div>` : ''}
                    ${content.problemSolving ? `<div class="content-problem">🔧 問題解決: ${this.escapeHtml(content.problemSolving)}</div>` : ''}
                    ${content.creativity ? `<div class="content-creativity">✨ 創造性: ${this.escapeHtml(content.creativity)}</div>` : ''}
                    ${content.topStrength ? `<div class="content-strength">💪 最大の強み: ${this.escapeHtml(content.topStrength)}</div>` : ''}
                    ${content.hiddenTalent ? `<div class="content-hidden">🎁 隠れた才能: ${this.escapeHtml(content.hiddenTalent)}</div>` : ''}
                    ${content.blindSpot ? `<div class="content-blind">👁️ 盲点: ${this.escapeHtml(content.blindSpot)}</div>` : ''}
                    ${content.improvement ? `<div class="content-improvement">🔄 改善方法: ${this.escapeHtml(content.improvement)}</div>` : ''}
                    ${content.firstImpression ? `<div class="content-impression">👤 第一印象: ${this.escapeHtml(content.firstImpression)}</div>` : ''}
                    ${content.presentation ? `<div class="content-presentation">📊 プレゼン: ${this.escapeHtml(content.presentation)}</div>` : ''}
                    ${content.listening ? `<div class="content-listening">👂 傾聴: ${this.escapeHtml(content.listening)}</div>` : ''}
                    ${content.relationshipPattern ? `<div class="content-relationship">🤝 関係性: ${this.escapeHtml(content.relationshipPattern)}</div>` : ''}
                    ${content.connectionPath ? `<div class="content-connection">🌉 繋がり方: ${this.escapeHtml(content.connectionPath)}</div>` : ''}
                    ${content.conflict ? `<div class="content-conflict">⚔️ 対立時: ${this.escapeHtml(content.conflict)}</div>` : ''}
                    ${content.defenseMechanism ? `<div class="content-defense">🛡️ 防御機制: ${this.escapeHtml(content.defenseMechanism)}</div>` : ''}
                    ${content.vulnerablePoint ? `<div class="content-vulnerable">💔 弱点: ${this.escapeHtml(content.vulnerablePoint)}</div>` : ''}
                    ${content.healingPath ? `<div class="content-healing">💚 癒しの道: ${this.escapeHtml(content.healingPath)}</div>` : ''}
                    ${content.earlySign ? `<div class="content-early-sign">⚡ 初期兆候: ${this.escapeHtml(content.earlySign)}</div>` : ''}
                    ${content.peakStress ? `<div class="content-peak">📊 ピーク時: ${this.escapeHtml(content.peakStress)}</div>` : ''}
                    ${content.breakingPoint ? `<div class="content-breaking">🚨 限界点: ${this.escapeHtml(content.breakingPoint)}</div>` : ''}
                    ${content.preventiveMeasure ? `<div class="content-preventive">🔰 予防策: ${this.escapeHtml(content.preventiveMeasure)}</div>` : ''}
                    ${content.goodPoint ? `<div class="content-good">👍 良い点: ${this.escapeHtml(content.goodPoint)}</div>` : ''}
                    ${content.recovery ? `<div class="content-recovery">🔄 回復: ${this.escapeHtml(content.recovery)}</div>` : ''}
                    ${content.timeToRecover ? `<div class="content-time">⏱️ 回復時間: ${this.escapeHtml(content.timeToRecover)}</div>` : ''}
                    ${content.environment ? `<div class="content-env">🌿 環境: ${this.escapeHtml(content.environment)}</div>` : ''}
                    ${content.support ? `<div class="content-support">🤝 サポート: ${this.escapeHtml(content.support)}</div>` : ''}
                    ${content.coreValue ? `<div class="content-core">🎯 核心価値: ${this.escapeHtml(content.coreValue)}</div>` : ''}
                    ${content.restMode ? `<div class="content-rest">😴 休息モード: ${this.escapeHtml(content.restMode)}</div>` : ''}
                    ${content.howToRest ? `<div class="content-rest-how">🛏️ 休み方: ${this.escapeHtml(content.howToRest)}</div>` : ''}
                    ${content.idealBalance ? `<div class="content-balance">⚖️ 理想バランス: ${this.escapeHtml(content.idealBalance)}</div>` : ''}
                    ${content.whenBalanced ? `<div class="content-balanced">✨ バランス時: ${this.escapeHtml(content.whenBalanced)}</div>` : ''}
                    ${content.whenImbalanced ? `<div class="content-imbalanced">⚠️ 不均衡時: ${this.escapeHtml(content.whenImbalanced)}</div>` : ''}
                    ${content.avoid ? `<div class="content-avoid">🚫 避けるべき: ${this.escapeHtml(content.avoid)}</div>` : ''}
                    ${content.strength ? `<div class="content-strength">💪 強み: ${this.escapeHtml(content.strength)}</div>` : ''}
                    ${content.weakness ? `<div class="content-weakness">🎯 弱み: ${this.escapeHtml(content.weakness)}</div>` : ''}
                    ${content.badPoint ? `<div class="content-bad">⚠️ 弱点: ${this.escapeHtml(content.badPoint)}</div>` : ''}
                    ${content.profile ? `<div class="content-profile">👤 プロファイル: ${this.escapeHtml(content.profile)}</div>` : ''}
                    ${content.bestWay ? `<div class="content-best">🌟 最善策: ${this.escapeHtml(content.bestWay)}</div>` : ''}
                </div>
            `;
        } else {
            // 従来の文字列コンテンツ
            const safeContent = this.escapeHtml(phase.content);
            contentHtml = `
                <div class="phase-content">
                    <p>${safeContent}</p>
                </div>
            `;
        }
        
        return `
            <div class="phase-card ${typeClass}">
                <div class="phase-card-header">
                    <h4 class="phase-title">${safeTitle}</h4>
                    ${scoreDisplay}
                </div>
                ${safeSubtitle ? `<div class="phase-subtitle">${safeSubtitle}</div>` : ''}
                ${contentHtml}
            </div>
        `;
    }


    /**
     * スコア説明セクションのレンダリング
     * @returns {string} HTML文字列
     */
    renderScoreExplanations() {
        if (!this.analysisData || !this.summaryGenerator) {
            return '';
        }

        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        const engineExplanation = this.summaryGenerator.explainScore(engineOS.score, 'engineOS');
        const interfaceExplanation = this.summaryGenerator.explainScore(interfaceOS.score, 'interfaceOS');
        const safeModeExplanation = this.summaryGenerator.explainScore(safeModeOS.score, 'safeModeOS');

        return `
            <div class="score-explanations">
                <h3>📈 スコア詳細説明</h3>
                <div class="score-cards">
                    ${this.renderScoreCard('Engine OS', engineOS.score, engineExplanation)}
                    ${this.renderScoreCard('Interface OS', interfaceOS.score, interfaceExplanation)}
                    ${this.renderScoreCard('SafeMode OS', safeModeOS.score, safeModeExplanation)}
                </div>
            </div>
        `;
    }

    /**
     * スコアカードのレンダリング
     * @param {string} osName - OS名
     * @param {number} score - スコア値
     * @param {Object} explanation - スコア説明
     * @returns {string} HTML文字列
     */
    renderScoreCard(osName, score, explanation) {
        return `
            <div class="score-explanation-card">
                <div class="score-header">
                    <h4>${osName}</h4>
                    <div class="score-value">${score} <span class="score-unit">pts</span></div>
                </div>
                <div class="score-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${score}%; background-color: ${explanation.visualization.color}"></div>
                    </div>
                    <div class="progress-labels">
                        <span class="progress-label-left">0</span>
                        <span class="progress-label-right">100</span>
                    </div>
                </div>
                <div class="score-interpretation">
                    <div class="score-level ${explanation.level}">${explanation.message}</div>
                    <p class="score-description">${explanation.interpretation}</p>
                    <div class="score-percentile">上位 ${100 - explanation.percentile}%</div>
                </div>
                <div class="score-advice">
                    <strong>💡 アドバイス:</strong>
                    <p>${explanation.advice}</p>
                </div>
            </div>
        `;
    }
}

// グローバルスコープでの登録
if (typeof window !== 'undefined') {
    window.BasicResultsTab = BasicResultsTab;
}

// Node.js環境での登録
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BasicResultsTab;
}