/**
 * BasicResultsTab - 基本結果表示タブ
 * 
 * 機能:
 * 1. Triple OSカードの表示（Engine, Interface, SafeMode）
 * 2. 易卦詳細情報の表示
 * 3. スコア解釈とプログレスバー
 * 4. 特性タグとキーワード表示
 * 5. 推奨アクションの提示
 */
class BasicResultsTab extends BaseTabView {
    constructor() {
        super('basic-results');
        this.hexagramExtractor = null;
        this.analysisData = null;
        
        console.log('📊 BasicResultsTab初期化中...');
        
        // localStorageからデータ読み込み
        this.loadAnalysisData();
        this.initializeExtractor();
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
            return { isValid: false, reason: 'データが存在しません' };
        }
        
        const requiredFields = ['engineOS', 'interfaceOS', 'safeModeOS'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return { isValid: false, reason: `${field}が存在しません` };
            }
        }
        
        return { isValid: true };
    }

    /**
     * コンテンツの更新
     */
    updateContent() {
        if (!this.analysisData) {
            this.showNoDataState();
            return;
        }
        
        console.log('🔄 updateContent開始');
        
        try {
            this.renderTripleOSCards();
            console.log('✅ Triple OSカードレンダリング完了');
        } catch (error) {
            console.error('❌ updateContentエラー:', error);
            this.handleRenderingError('Triple OSカード', error);
        }
    }

    /**
     * Triple OSカードをレンダリング
     */
    renderTripleOSCards() {
        // まずコンテナ全体を取得
        const container = this.getContainer();
        if (!container) {
            console.error('❌ コンテナの取得に失敗');
            return;
        }
        
        // コンテナ内から#os-cards-containerを探す
        let osCardsContainer = container.querySelector('#os-cards-container');
        
        // 存在しない場合は作成
        if (!osCardsContainer) {
            console.log('📦 os-cards-containerを新規作成');
            osCardsContainer = document.createElement('div');
            osCardsContainer.id = 'os-cards-container';
            osCardsContainer.className = 'os-cards-container';
            
            // コンテナ内に追加
            container.appendChild(osCardsContainer);
        }
        
        if (!this.analysisData) {
            console.error('❌ analysisData が存在しません');
            // CLAUDE.mdの原則: 正直に表示
            osCardsContainer.innerHTML = `
                <div class="no-data-message" style="text-align: center; padding: 40px; color: #666;">
                    <p style="font-size: 48px; margin-bottom: 20px;">📊</p>
                    <p>データがありません</p>
                    <p style="font-size: 14px; color: #999;">開発モードでテストデータを適用してください</p>
                </div>
            `;
            return;
        }
        
        const engineOS = this.analysisData.engineOS;
        const interfaceOS = this.analysisData.interfaceOS;
        const safeModeOS = this.analysisData.safeModeOS;
        
        console.log('📊 OSデータ:', { engineOS, interfaceOS, safeModeOS });
        
        osCardsContainer.innerHTML = `
            <div class="os-results-section">
                <h3 class="section-title">🔮 Triple OS 現在の状態</h3>
                <div class="os-cards-grid">
                    ${this.renderEngineOSCard(engineOS)}
                    ${this.renderInterfaceOSCard(interfaceOS)}
                    ${this.renderSafeModeOSCard(safeModeOS)}
                </div>
            </div>
        `;
        
        console.log('✅ Triple OSカード描画完了');
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
        
        return this.renderNotImplementedCard('Interface OS', hexagramName, osData);
    }

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
        
        return this.renderNotImplementedCard('SafeMode OS', hexagramName, osData);
    }

    /**
     * localStorageからデータ読み込み
     */
    loadAnalysisData() {
        try {
            const storedData = localStorage.getItem('tripleOSAnalysisResult');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log('📂 localStorageからデータ読み込み:', parsedData);
                
                this.analysisData = this.normalizeAnalysisData(parsedData);
                console.log('✅ データ読み込み完了:', this.analysisData);
            } else {
                console.log('📂 localStorageにデータが存在しません');
                this.analysisData = this.getDefaultAnalysisData();
            }
        } catch (error) {
            console.error('❌ データ読み込みエラー:', error);
            this.analysisData = this.getDefaultAnalysisData();
        }
    }

    /**
     * デフォルトの分析データを取得
     */
    getDefaultAnalysisData() {
        return {
            engineOS: {
                name: 'Engine OS',
                score: 0,
                hexagramName: 'データなし',
                hexagram: 'データなし',
                traits: [],
                keywords: []
            },
            interfaceOS: {
                name: 'Interface OS',
                score: 0,
                hexagramName: 'データなし',
                hexagram: 'データなし',
                traits: [],
                keywords: []
            },
            safeModeOS: {
                name: 'SafeMode OS',
                score: 0,
                hexagramName: 'データなし',
                hexagram: 'データなし',
                traits: [],
                keywords: []
            }
        };
    }

    /**
     * HexagramExtractorの初期化
     */
    initializeExtractor() {
        try {
            if (window.HexagramExtractor) {
                this.hexagramExtractor = new window.HexagramExtractor();
                console.log('✅ HexagramExtractor初期化完了');
            }
        } catch (error) {
            console.error('❌ HexagramExtractor初期化エラー:', error);
        }
    }

    /**
     * フォールバックコンテンツの表示
     */
    showFallbackContent() {
        const container = document.getElementById('os-cards-container');
        if (container) {
            container.innerHTML = `
                <div class="fallback-message">
                    <p>🔄 診断データを読み込み中...</p>
                    <p>しばらくお待ちください。</p>
                </div>
            `;
        }
    }

    /**
     * エラーコンテンツの表示
     */
    showErrorContent(errorMessage) {
        const container = document.getElementById('os-cards-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ エラーが発生しました</h3>
                    <p>${errorMessage}</p>
                    <p>ページを再読み込みして再度お試しください。</p>
                </div>
            `;
        }
    }

    /**
     * データなし状態の表示
     */
    showNoDataState() {
        const container = document.getElementById('os-cards-container');
        if (container) {
            container.innerHTML = `
                <div class="no-data-message">
                    <h3>📊 診断データがありません</h3>
                    <p>まず診断を実行してください。</p>
                </div>
            `;
        }
    }

    /**
     * レンダリングエラーの処理
     */
    handleRenderingError(taskName, error) {
        console.error(`レンダリングタスク「${taskName}」でエラーが発生:`, error);
    }

    /**
     * スコア解釈の取得
     */
    getScoreInterpretation(score) {
        if (score >= 80) {
            return { level: 'excellent', message: '非常に強い特性' };
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
            console.error('❌ タブコンテナが初期化されていません');
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
}

// グローバルスコープでの登録
if (typeof window !== 'undefined') {
    window.BasicResultsTab = BasicResultsTab;
}

// Node.js環境での登録
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BasicResultsTab;
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
            '為': '為',
            '澤': '澤',
            '讼': '訟',
            '師': '師',
            '贲': '賁',
            '剥': '剝',
            '復': '復',
            '風': '風'
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
        
        // パターン3: name
        if (osData.name && osData.name !== 'Engine OS') {
            return osData.name;
        }
        
        return null;
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