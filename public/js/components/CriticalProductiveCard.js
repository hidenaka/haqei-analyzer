/**
 * CriticalProductiveCard.js
 * 批判的・生産的視点カードコンポーネント
 * 
 * HaQei Analyzerの測定結果に対して批判的思考と建設的な成長視点を提供
 * ShadowAnalyzer・CriticalThinkingEngine・hexagram_detailsとの統合
 */

class CriticalProductiveCard {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        // 依存コンポーネント
        this.shadowAnalyzer = options.shadowAnalyzer || (window.ShadowAnalyzer ? new window.ShadowAnalyzer() : null);
        this.criticalThinkingEngine = options.criticalThinkingEngine || (window.CriticalThinkingEngine ? new window.CriticalThinkingEngine() : null);
        
        // データ
        this.analysisResult = options.analysisResult;
        this.osData = options.osData;
        this.score = options.score;
        this.hexagramDetails = options.hexagramDetails;
        
        // 状態管理
        this.isInitialized = false;
        this.cardData = null;
        
        console.log("🧠 [CriticalProductiveCard] 初期化完了", {
            containerId,
            hasShadowAnalyzer: !!this.shadowAnalyzer,
            hasCriticalEngine: !!this.criticalThinkingEngine,
            score: this.score
        });
    }

    /**
     * カードの初期化とレンダリング
     */
    async init() {
        try {
            console.log("🚀 [CriticalProductiveCard] レンダリング開始");
            
            if (!this.container) {
                throw new Error(`Container not found: ${this.containerId}`);
            }

            // データ生成
            await this._generateCardData();
            
            // レンダリング
            await this._render();
            
            // イベントリスナー設定
            this._setupEventListeners();
            
            this.isInitialized = true;
            console.log("✅ [CriticalProductiveCard] レンダリング完了");
            
        } catch (error) {
            console.error("❌ [CriticalProductiveCard] 初期化エラー:", error);
            this._renderError(error.message);
        }
    }

    /**
     * カードデータの生成
     */
    async _generateCardData() {
        console.log("🔄 [CriticalProductiveCard] データ生成開始");
        
        this.cardData = {
            // 基本情報
            osName: this.osData?.osName || "未特定OS",
            score: this.score || 0,
            scoreRange: this._getScoreRange(this.score),
            
            // 批判的視点 (ShadowAnalyzer)
            critical: await this._generateCriticalContent(),
            
            // 生産的視点 (CriticalThinkingEngine)
            productive: await this._generateProductiveContent(),
            
            // 動的インサイト (hexagram_details)
            dynamicInsights: await this._generateDynamicInsights()
        };
        
        console.log("✅ [CriticalProductiveCard] データ生成完了", this.cardData);
    }

    /**
     * 批判的視点データの生成 (ShadowAnalyzer連携)
     */
    async _generateCriticalContent() {
        if (!this.shadowAnalyzer || !this.osData) {
            console.warn("⚠️ [CriticalProductiveCard] ShadowAnalyzer未利用または osData 不足");
            return this._getFallbackCriticalContent();
        }

        try {
            const shadowProfile = this.shadowAnalyzer.analyzeShadow(this.osData, this.score);
            
            return {
                shadowAspects: shadowProfile.shadowAspects,
                blindSpotQuestions: shadowProfile.selfInquiryQuestions || [],
                growthChallenges: shadowProfile.growthChallenges,
                integrationGuidance: shadowProfile.integrationGuidance
            };
        } catch (error) {
            console.error("❌ [CriticalProductiveCard] 批判的視点生成エラー:", error);
            return this._getFallbackCriticalContent();
        }
    }

    /**
     * 生産的視点データの生成 (CriticalThinkingEngine連携)
     */
    async _generateProductiveContent() {
        if (!this.criticalThinkingEngine) {
            console.warn("⚠️ [CriticalProductiveCard] CriticalThinkingEngine未利用");
            return this._getFallbackProductiveContent();
        }

        try {
            // CriticalThinkingEngineのメソッド呼び出し
            const scoreBasedQuestions = this._generateScoreBasedQuestions();
            const practicalSteps = this._generatePracticalSteps();
            const biasRecognition = this._generateBiasRecognition();
            
            return {
                scoreBasedQuestions,
                practicalSteps,
                integrationGuidance: this._generateIntegrationGuidance(),
                biasRecognition
            };
        } catch (error) {
            console.error("❌ [CriticalProductiveCard] 生産的視点生成エラー:", error);
            return this._getFallbackProductiveContent();
        }
    }

    /**
     * 動的インサイトデータの生成 (hexagram_details連携)
     */
    async _generateDynamicInsights() {
        if (!this.hexagramDetails && !window.HEXAGRAM_DETAILS) {
            console.warn("⚠️ [CriticalProductiveCard] hexagram_details未利用");
            return null;
        }

        try {
            const hexagramId = this.osData?.hexagramId || this.osData?.osId;
            const details = this.hexagramDetails || (window.HEXAGRAM_DETAILS && window.HEXAGRAM_DETAILS[hexagramId]);
            
            if (!details) {
                console.warn(`⚠️ [CriticalProductiveCard] 卦${hexagramId}の詳細データなし`);
                return null;
            }

            return {
                engineWeaknesses: details.engine?.potential_weaknesses || [],
                triggerSituations: details.safe_mode?.trigger_situations || [],
                defensivePatterns: details.safe_mode?.defensive_patterns || [],
                strengthToShadowMapping: this._mapStrengthsToShadows(details.engine?.potential_strengths || [])
            };
        } catch (error) {
            console.error("❌ [CriticalProductiveCard] 動的インサイト生成エラー:", error);
            return null;
        }
    }

    /**
     * HTMLレンダリング
     */
    async _render() {
        const html = `
            <div class="critical-productive-card" data-score-range="${this.cardData.scoreRange}">
                ${this._renderHeader()}
                ${this._renderCriticalSection()}
                ${this._renderProductiveSection()}
                ${this._renderDynamicInsightsSection()}
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    /**
     * ヘッダー部レンダリング
     */
    _renderHeader() {
        return `
            <div class="card-header">
                <h3 class="card-title">🧠 批判的・生産的視点</h3>
                <div class="score-indicator" data-score="${this.cardData.score}%">
                    <span class="score-value">${this.cardData.score}%</span>
                    <span class="score-label">${this.cardData.osName}</span>
                </div>
            </div>
        `;
    }

    /**
     * 批判的視点セクションレンダリング
     */
    _renderCriticalSection() {
        const critical = this.cardData.critical;
        
        return `
            <div class="critical-section collapsible" data-expanded="false">
                <div class="section-header" onclick="window.criticalProductiveCard.toggleSection(this)">
                    <h4>🌑 批判的視点 <span class="expand-indicator">▼</span></h4>
                </div>
                <div class="section-content">
                    ${this._renderShadowAnalysis(critical.shadowAspects)}
                    ${this._renderBlindSpotQuestions(critical.blindSpotQuestions)}
                    ${this._renderGrowthChallenges(critical.growthChallenges)}
                </div>
            </div>
        `;
    }

    /**
     * 生産的視点セクションレンダリング
     */
    _renderProductiveSection() {
        const productive = this.cardData.productive;
        
        return `
            <div class="productive-section collapsible" data-expanded="true">
                <div class="section-header" onclick="window.criticalProductiveCard.toggleSection(this)">
                    <h4>🌱 生産的視点 <span class="expand-indicator">▲</span></h4>
                </div>
                <div class="section-content">
                    ${this._renderActionQuestions(productive.scoreBasedQuestions)}
                    ${this._renderPracticalSteps(productive.practicalSteps)}
                    ${this._renderIntegrationGuidance(productive.integrationGuidance)}
                </div>
            </div>
        `;
    }

    /**
     * 動的インサイトセクションレンダリング
     */
    _renderDynamicInsightsSection() {
        if (!this.cardData.dynamicInsights) {
            return '';
        }
        
        const insights = this.cardData.dynamicInsights;
        
        return `
            <div class="dynamic-insights-section collapsible" data-expanded="false">
                <div class="section-header" onclick="window.criticalProductiveCard.toggleSection(this)">
                    <h4>💡 動的インサイト <span class="expand-indicator">▼</span></h4>
                </div>
                <div class="section-content">
                    ${this._renderHexagramInsights(insights)}
                </div>
            </div>
        `;
    }

    /**
     * シャドウ分析の表示
     */
    _renderShadowAnalysis(shadowAspects) {
        if (!shadowAspects) return '<p>シャドウ分析データがありません</p>';
        
        const intensity = shadowAspects.intensity_level || '不明';
        const likelihood = shadowAspects.likelihood || '0%';
        
        return `
            <div class="shadow-analysis">
                <h5>影の側面</h5>
                <div class="shadow-item" data-intensity="${intensity}">
                    <p class="primary-shadow">${shadowAspects.primary_shadow || '影の側面を分析中...'}</p>
                    <div class="behavioral-risks">${shadowAspects.behavioral_risks || ''}</div>
                    <div class="likelihood-meter">
                        <span class="likelihood-label">発現可能性</span>
                        <div class="likelihood-bar-container">
                            <div class="likelihood-bar" style="width: ${likelihood}"></div>
                        </div>
                        <span class="likelihood-value">${likelihood}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 盲点質問の表示
     */
    _renderBlindSpotQuestions(questions) {
        if (!questions || questions.length === 0) {
            return '<div class="blind-spot-questions"><h5>盲点への気づき</h5><p>質問データを準備中...</p></div>';
        }
        
        const questionHtml = questions.map(q => `
            <div class="question-card">
                <div class="question-text">${q.question}</div>
                <div class="question-purpose">${q.purpose}</div>
            </div>
        `).join('');
        
        return `
            <div class="blind-spot-questions">
                <h5>盲点への気づき</h5>
                <div class="question-list">${questionHtml}</div>
            </div>
        `;
    }

    /**
     * 成長課題の表示
     */
    _renderGrowthChallenges(challenges) {
        if (!challenges) return '';
        
        return `
            <div class="growth-challenges">
                <h5>成長課題</h5>
                <div class="primary-challenge">${challenges.primary_challenge || ''}</div>
                <div class="development-areas">
                    ${(challenges.development_areas || []).map(area => `<span class="area-tag">${area}</span>`).join('')}
                </div>
            </div>
        `;
    }

    /**
     * アクション質問の表示
     */
    _renderActionQuestions(questions) {
        if (!questions || questions.length === 0) {
            return '<div class="action-questions"><h5>建設的な問いかけ</h5><p>質問を生成中...</p></div>';
        }
        
        const questionCards = questions.map(q => `
            <div class="question-card">
                <div class="question-category">${q.category}</div>
                <div class="question-text">${q.question}</div>
                <div class="question-purpose">${q.purpose}</div>
            </div>
        `).join('');
        
        return `
            <div class="action-questions">
                <h5>建設的な問いかけ</h5>
                <div class="question-cards">${questionCards}</div>
            </div>
        `;
    }

    /**
     * 実践ステップの表示
     */
    _renderPracticalSteps(steps) {
        if (!steps || steps.length === 0) {
            return '<div class="practical-steps"><h5>実践的ステップ</h5><p>ステップを準備中...</p></div>';
        }
        
        const stepsHtml = steps.map(step => `
            <div class="step-item">
                <div class="step-number">${step.step}</div>
                <div class="step-content">
                    <div class="step-action">${step.action}</div>
                    <div class="step-description">${step.description}</div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="practical-steps">
                <h5>実践的ステップ</h5>
                <div class="steps-timeline">${stepsHtml}</div>
            </div>
        `;
    }

    /**
     * 統合ガイダンスの表示
     */
    _renderIntegrationGuidance(guidance) {
        if (!guidance) return '';
        
        const osName = this.cardData?.osName || this.osData?.osName || "未特定OS";
        return `
            <div class="integration-guidance">
                <h5>統合ガイダンス</h5>
                <div class="mindset-shift">
                    <div class="from-to-display">
                        <div class="from">From: 「私は${osName}だ」（固定的思考）</div>
                        <div class="arrow">→</div>
                        <div class="to">To: 「私は${osName}の傾向があり、影も含めて成長できる」（成長的思考）</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 易経インサイトの表示
     */
    _renderHexagramInsights(insights) {
        return `
            <div class="hexagram-insights">
                <h5>易経からの洞察</h5>
                <div class="insights-grid">
                    <div class="insight-item">
                        <h6>潜在的弱点</h6>
                        <ul>${insights.engineWeaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
                    </div>
                    <div class="insight-item">
                        <h6>トリガー状況</h6>
                        <ul>${insights.triggerSituations.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>
                    <div class="insight-item">
                        <h6>防御パターン</h6>
                        <ul>${insights.defensivePatterns.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * セクションの展開/折りたたみ
     */
    toggleSection(headerElement) {
        const section = headerElement.parentElement;
        const isExpanded = section.getAttribute('data-expanded') === 'true';
        const indicator = headerElement.querySelector('.expand-indicator');
        
        section.setAttribute('data-expanded', (!isExpanded).toString());
        indicator.textContent = isExpanded ? '▼' : '▲';
        
        console.log(`🔄 [CriticalProductiveCard] セクション${isExpanded ? '折りたたみ' : '展開'}`);
    }

    /**
     * イベントリスナーの設定
     */
    _setupEventListeners() {
        // グローバル参照設定（HTML onclick用）
        window.criticalProductiveCard = this;
        
        // その他のイベントリスナー設定
        console.log("🎧 [CriticalProductiveCard] イベントリスナー設定完了");
    }

    /**
     * ユーティリティメソッド群
     */
    _getScoreRange(score) {
        if (score >= 70) return 'high';
        if (score >= 30) return 'medium';
        return 'low';
    }

    _generateScoreBasedQuestions() {
        const range = this._getScoreRange(this.score);
        const osName = this.cardData?.osName || this.osData?.osName || "未特定OS";
        const score = this.score;
        
        const templates = {
            high: [
                {
                    category: "identity_fixation",
                    question: `「私は${osName}だから」という考えで、本来なら取るべき行動を避けた経験はありませんか？`,
                    purpose: "アイデンティティ固着の検証"
                },
                {
                    category: "environmental_limits", 
                    question: `この${osName}の特性が通用しない環境や相手は、具体的にどのような場合でしょうか？`,
                    purpose: "適用限界の理解"
                }
            ],
            medium: [
                {
                    category: "potential_expansion",
                    question: `この${score}%という結果は、あなたの潜在的な可能性を適切に表していますか？`,
                    purpose: "潜在可能性の探求"
                }
            ],
            low: [
                {
                    category: "hidden_potential",
                    question: `この${score}%という低い数値は、本当にあなたの限界を示していますか？`,
                    purpose: "隠れた可能性の発見"
                }
            ]
        };
        
        return templates[range] || [];
    }

    _generatePracticalSteps() {
        return [
            {
                step: 1,
                action: "観察",
                description: "日常の行動パターンを意識的に観察する"
            },
            {
                step: 2,
                action: "一時停止",
                description: "問題のパターンが出そうな時に、一度立ち止まって考える習慣をつける"
            },
            {
                step: 3,
                action: "代替選択",
                description: "バランスを意識した別の選択肢を検討する"
            },
            {
                step: 4,
                action: "小さな実験",
                description: "リスクの少ない場面で、新しい行動パターンを試してみる"
            },
            {
                step: 5,
                action: "振り返り",
                description: "結果を振り返り、学びを次に活かす"
            }
        ];
    }

    _generateBiasRecognition() {
        return {
            common_biases: ["確証バイアス", "自己奉仕バイアス", "ダニング・クルーガー効果"],
            measurement_limits: "64通りのパターンで人間の複雑さを完全に捉えることの限界"
        };
    }

    _generateIntegrationGuidance() {
        const osName = this.cardData?.osName || this.osData?.osName || "未特定OS";
        return {
            shadow_acceptance: "影の部分も「あなたの一部」として受け入れることから始まります",
            mindset_shift: {
                from: `「私は${osName}だ」（固定的思考）`,
                to: `「私は${osName}の傾向があり、影も含めて成長できる」（成長的思考）`
            },
            integration_timeline: "すぐに変わる必要はありません。まずは「気づき」から始めてください"
        };
    }

    _mapStrengthsToShadows(strengths) {
        return strengths.map(strength => `${strength} → 過度な依存や極端な表現による弊害`);
    }

    /**
     * フォールバックデータ生成
     */
    _getFallbackCriticalContent() {
        const osName = this.cardData?.osName || this.osData?.osName || "未特定OS";
        return {
            shadowAspects: {
                primary_shadow: `${osName}の特性の過度な表現や誤用`,
                behavioral_risks: "バランスを欠いた行動パターン",
                intensity_level: "中",
                likelihood: "50%"
            },
            blindSpotQuestions: [
                {
                    type: "generic",
                    question: "この特性に頼りすぎて、他の能力の発達を怠っていませんか？",
                    purpose: "バランスの確認"
                }
            ],
            growthChallenges: {
                primary_challenge: "バランスの取れた自己表現",
                development_areas: ["自己観察", "フィードバック収集"],
                recommended_practices: ["日記による自己観察", "他者からの意見収集"]
            }
        };
    }

    _getFallbackProductiveContent() {
        return {
            scoreBasedQuestions: this._generateScoreBasedQuestions(),
            practicalSteps: this._generatePracticalSteps(),
            integrationGuidance: this._generateIntegrationGuidance(),
            biasRecognition: this._generateBiasRecognition()
        };
    }

    /**
     * エラー表示
     */
    _renderError(message) {
        this.container.innerHTML = `
            <div class="critical-productive-card error">
                <div class="error-message">
                    <h3>🧠 批判的・生産的視点</h3>
                    <p>申し訳ございません。データの読み込みに失敗しました。</p>
                    <p class="error-details">${message}</p>
                </div>
            </div>
        `;
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.CriticalProductiveCard = CriticalProductiveCard;
    console.log("✅ [CriticalProductiveCard] グローバル登録完了");
}

// Node.js環境での利用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CriticalProductiveCard;
}