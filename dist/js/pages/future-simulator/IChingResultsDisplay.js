/**
 * HAQEI I Ching Results Display System - Phase 2 Implementation
 * 易経結果表示システム
 * 
 * 実装日: 2025年8月6日
 * 担当: HAQEI Programming Agent  
 * 目的: 易経分析結果の美しく分かりやすい表示とbunenjin哲学準拠のUI
 */

class IChingResultsDisplay {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            theme: options.theme || 'modern',
            language: options.language || 'japanese',
            userLevel: options.userLevel || 'intermediate',
            showAnimation: options.showAnimation !== false,
            enableInteraction: options.enableInteraction !== false,
            ...options
        };
        
        this.animationState = 'idle';
        this.currentResults = null;
        this.interactionHandlers = new Map();
        
        console.log('🎨 IChingResultsDisplay initialized for container:', containerId);
    }

    /**
     * メイン表示メソッド - Phase 2 Core Implementation
     * P2-007: 包括的結果表示システム
     */
    async displayResults(analysisResult) {
        try {
            console.log('🎯 Displaying I Ching analysis results');
            
            if (!analysisResult || !analysisResult.selectedHexagram) {
                throw new Error('無効な分析結果です');
            }

            this.currentResults = analysisResult;
            
            // コンテナの初期化
            this.initializeContainer();
            
            if (this.options.showAnimation) {
                await this.playIntroAnimation();
            }
            
            // メイン結果の構築と表示
            await this.buildMainResults();
            
            // bunenjin解釈の表示
            await this.displayBunenjinInterpretation();
            
            // インタラクティブ要素の追加
            if (this.options.enableInteraction) {
                this.addInteractiveElements();
            }
            
            // 完了アニメーション
            if (this.options.showAnimation) {
                await this.playCompletionAnimation();
            }
            
            console.log('✅ Results display completed successfully');
            
        } catch (error) {
            console.error('❌ Error in displayResults:', error);
            this.displayErrorFallback(error);
        }
    }

    /**
     * P2-008: コンテナ初期化とレスポンシブ設定
     */
    initializeContainer() {
        if (!this.container) {
            throw new Error(`Container not found: ${this.containerId}`);
        }
        
        // 基本構造の生成
        this.container.innerHTML = `
            <div class="iching-results-wrapper ${this.options.theme}">
                <div class="results-header" id="results-header">
                    <div class="hexagram-visual" id="hexagram-visual"></div>
                    <div class="hexagram-info" id="hexagram-info"></div>
                </div>
                
                <div class="results-body" id="results-body">
                    <div class="classical-interpretation" id="classical-interpretation"></div>
                    <div class="modern-interpretation" id="modern-interpretation"></div>
                    <div class="bunenjin-perspectives" id="bunenjin-perspectives"></div>
                </div>
                
                <div class="results-actions" id="results-actions">
                    <div class="action-buttons" id="action-buttons"></div>
                    <div class="sharing-options" id="sharing-options"></div>
                </div>
                
                <div class="results-metadata" id="results-metadata"></div>
            </div>
        `;
        
        // CSS classes適用
        this.container.classList.add('iching-display-container', `theme-${this.options.theme}`, `level-${this.options.userLevel}`);
        
        // レスポンシブ処理
        this.setupResponsiveLayout();
    }

    /**
     * P2-009: メイン結果構築
     */
    async buildMainResults() {
        const hexagram = this.currentResults.selectedHexagram;
        
        // 卦の視覚表示
        await this.renderHexagramVisual(hexagram);
        
        // 卦情報表示
        this.renderHexagramInfo(hexagram);
        
        // 古典的解釈
        this.renderClassicalInterpretation(hexagram);
        
        // 現代的解釈
        this.renderModernInterpretation(hexagram, this.currentResults);
    }

    /**
     * P2-010: 卦の視覚表示
     */
    async renderHexagramVisual(hexagram) {
        const visualContainer = document.getElementById('hexagram-visual');
        if (!visualContainer) return;
        
        // 6爻の視覚表示
        const linesHtml = hexagram.structure.map((line, index) => {
            const lineType = line === 1 ? 'yang' : 'yin';
            const position = 6 - index; // 上爻から下爻へ
            return `
                <div class="hexagram-line ${lineType}" data-position="${position}">
                    <div class="line-visual">
                        ${line === 1 ? 
                            '<div class="yang-line"></div>' : 
                            '<div class="yin-line"><div class="yin-break"></div></div>'
                        }
                    </div>
                    <div class="line-number">${position}</div>
                </div>
            `;
        }).join('');
        
        visualContainer.innerHTML = `
            <div class="hexagram-structure">
                <div class="hexagram-lines">${linesHtml}</div>
                <div class="trigram-labels">
                    <div class="upper-trigram">${hexagram.trigrams.upper}</div>
                    <div class="lower-trigram">${hexagram.trigrams.lower}</div>
                </div>
            </div>
            <div class="hexagram-metadata">
                <div class="element-indicator" data-element="${hexagram.element}">
                    ${this.getElementSymbol(hexagram.element)}
                </div>
                <div class="direction-indicator" data-direction="${hexagram.direction}">
                    ${this.getDirectionSymbol(hexagram.direction)}
                </div>
            </div>
        `;
        
        // アニメーション適用
        if (this.options.showAnimation) {
            await this.animateHexagramLines();
        }
    }

    /**
     * P2-011: 卦情報表示
     */
    renderHexagramInfo(hexagram) {
        const infoContainer = document.getElementById('hexagram-info');
        if (!infoContainer) return;
        
        infoContainer.innerHTML = `
            <div class="hexagram-title">
                <h2 class="hexagram-name">${hexagram.name}</h2>
                <div class="hexagram-number">第${hexagram.number}番</div>
            </div>
            
            <div class="hexagram-properties">
                <div class="property-item">
                    <label>五行</label>
                    <span class="element-name" data-element="${hexagram.element}">
                        ${this.getElementName(hexagram.element)}
                    </span>
                </div>
                <div class="property-item">
                    <label>季節</label>
                    <span class="season-name">${this.getSeasonName(hexagram.season)}</span>
                </div>
                <div class="property-item">
                    <label>方位</label>
                    <span class="direction-name">${this.getDirectionName(hexagram.direction)}</span>
                </div>
            </div>
            
            <div class="selection-confidence">
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${this.currentResults.confidence * 100}%"></div>
                </div>
                <div class="confidence-text">
                    適合度: ${Math.round(this.currentResults.confidence * 100)}%
                </div>
            </div>
        `;
    }

    /**
     * P2-012: 古典的解釈表示
     */
    renderClassicalInterpretation(hexagram) {
        const classicalContainer = document.getElementById('classical-interpretation');
        if (!classicalContainer) return;
        
        classicalContainer.innerHTML = `
            <div class="interpretation-section">
                <h3 class="section-title">
                    <span class="title-icon">📜</span>
                    古典的解釈
                </h3>
                
                <div class="classical-content">
                    <div class="judgment-text">
                        <h4>彖辞（判断の辞）</h4>
                        <p class="classical-text">${hexagram.judgment_text || hexagram.judgment}</p>
                    </div>
                    
                    <div class="image-text">
                        <h4>象辞（象の辞）</h4>
                        <p class="classical-text">${hexagram.image_text || hexagram.image}</p>
                    </div>
                    
                    <div class="classical-meaning">
                        <h4>基本的意味</h4>
                        <p class="meaning-text">${hexagram.classical_meaning}</p>
                    </div>
                </div>
            </div>
        `;
        
        // 古典テキストの読み上げボタン（アクセシビリティ）
        if (this.options.enableInteraction) {
            this.addReadAloudButton(classicalContainer);
        }
    }

    /**
     * P2-013: 現代的解釈表示
     */
    renderModernInterpretation(hexagram, analysisResult) {
        const modernContainer = document.getElementById('modern-interpretation');
        if (!modernContainer) return;
        
        modernContainer.innerHTML = `
            <div class="interpretation-section">
                <h3 class="section-title">
                    <span class="title-icon">🧭</span>
                    現代的解釈・実用的指導
                </h3>
                
                <div class="modern-content">
                    <div class="current-situation">
                        <h4>現在の状況理解</h4>
                        <p class="situation-analysis">${hexagram.modern_interpretation}</p>
                    </div>
                    
                    <div class="practical-advice">
                        <h4>実用的アドバイス</h4>
                        ${this.renderPracticalAdvice(analysisResult.adaptiveResults?.practical_advice)}
                    </div>
                    
                    <div class="next-steps">
                        <h4>推奨される次のステップ</h4>
                        ${this.renderNextSteps(analysisResult.adaptiveResults?.next_steps)}
                    </div>
                    
                    <div class="timing-guidance">
                        <h4>タイミングの指導</h4>
                        <p class="timing-text">${this.generateTimingGuidance(hexagram, analysisResult)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * P2-014: bunenjin解釈表示（Phase 2の核心機能）
     */
    async displayBunenjinInterpretation() {
        const bunenjinContainer = document.getElementById('bunenjin-perspectives');
        if (!bunenjinContainer) return;
        
        const interpretation = this.currentResults.bunenjinInterpretation;
        if (!interpretation) {
            bunenjinContainer.innerHTML = '<div class="no-bunenjin">bunenjin解釈が利用できません</div>';
            return;
        }
        
        bunenjinContainer.innerHTML = `
            <div class="interpretation-section bunenjin-section">
                <h3 class="section-title">
                    <span class="title-icon">👥</span>
                    bunenjin哲学による多視点解釈
                </h3>
                
                <div class="bunenjin-intro">
                    <p class="philosophy-explanation">
                        人間は一つの統一された自己ではなく、状況に応じて異なる「分人」を表現します。
                        以下は、あなたの異なる分人の視点からの解釈です。
                    </p>
                </div>
                
                <div class="aspect-interpretations" id="aspect-interpretations">
                    ${this.renderAspectInterpretations(interpretation.aspect_interpretations)}
                </div>
                
                <div class="triple-os-integration">
                    <h4 class="subsection-title">Triple OS統合視点</h4>
                    ${this.renderTripleOSIntegration(interpretation.triple_os_integration)}
                </div>
                
                <div class="unified-guidance">
                    <h4 class="subsection-title">統合的指導</h4>
                    ${this.renderUnifiedGuidance(interpretation.unified_guidance)}
                </div>
            </div>
        `;
        
        // インタラクティブタブ機能
        if (this.options.enableInteraction) {
            this.setupBunenjinTabs();
        }
    }

    /**
     * P2-015: 分人解釈のレンダリング
     */
    renderAspectInterpretations(aspectInterpretations) {
        if (!aspectInterpretations || Object.keys(aspectInterpretations).length === 0) {
            return '<div class="no-aspects">分人解釈が利用できません</div>';
        }
        
        const aspects = Object.entries(aspectInterpretations).map(([aspectName, interpretation]) => {
            const aspectInfo = this.getAspectInfo(aspectName);
            return `
                <div class="aspect-card" data-aspect="${aspectName}">
                    <div class="aspect-header">
                        <div class="aspect-icon">${aspectInfo.icon}</div>
                        <h5 class="aspect-name">${aspectInfo.displayName}</h5>
                        <div class="aspect-relevance">${aspectInfo.relevance}</div>
                    </div>
                    
                    <div class="aspect-content">
                        <div class="aspect-interpretation">
                            ${typeof interpretation === 'string' ? 
                                `<p>${interpretation}</p>` : 
                                `<p>${interpretation.main_message || '解釈情報'}</p>`
                            }
                        </div>
                        
                        <div class="aspect-characteristics">
                            <div class="characteristics-list">
                                ${aspectInfo.characteristics.map(char => 
                                    `<span class="characteristic-tag">${char}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="aspects-container">
                ${aspects}
            </div>
        `;
    }

    /**
     * P2-016: Triple OS統合の表示
     */
    renderTripleOSIntegration(tripleOSIntegration) {
        if (!tripleOSIntegration) {
            return '<div class="no-triple-os">Triple OS情報が利用できません</div>';
        }
        
        return `
            <div class="triple-os-grid">
                <div class="os-perspective" data-os="engine">
                    <div class="os-header">
                        <div class="os-icon">⚙️</div>
                        <h6 class="os-name">Engine OS</h6>
                    </div>
                    <div class="os-content">
                        <p>${tripleOSIntegration.engine || 'エンジンOS視点の解釈'}</p>
                    </div>
                </div>
                
                <div class="os-perspective" data-os="interface">
                    <div class="os-header">
                        <div class="os-icon">🤝</div>
                        <h6 class="os-name">Interface OS</h6>
                    </div>
                    <div class="os-content">
                        <p>${tripleOSIntegration.interface || 'インターフェイスOS視点の解釈'}</p>
                    </div>
                </div>
                
                <div class="os-perspective" data-os="safemode">
                    <div class="os-header">
                        <div class="os-icon">🛡️</div>
                        <h6 class="os-name">Safe Mode OS</h6>
                    </div>
                    <div class="os-content">
                        <p>${tripleOSIntegration.safeMode || 'セーフモードOS視点の解釈'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * P2-017: 統合指導の表示
     */
    renderUnifiedGuidance(unifiedGuidance) {
        if (!unifiedGuidance) {
            return '<div class="no-guidance">統合指導が利用できません</div>';
        }
        
        return `
            <div class="unified-guidance-content">
                <div class="primary-message">
                    <h6>中心的メッセージ</h6>
                    <p class="guidance-message">${unifiedGuidance.primary_message || '基本的指導'}</p>
                </div>
                
                <div class="action-steps">
                    <h6>具体的行動ステップ</h6>
                    <ol class="steps-list">
                        ${(unifiedGuidance.action_steps || ['現状分析', '選択肢検討']).map(step => 
                            `<li class="step-item">${step}</li>`
                        ).join('')}
                    </ol>
                </div>
                
                <div class="philosophical-note">
                    <p class="bunenjin-note">
                        💡 <strong>bunenjin哲学から</strong>: 
                        これらの視点は同時に存在し得ます。矛盾を恐れず、状況に応じて適切な分人を発揮してください。
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * P2-018: インタラクティブ要素の追加
     */
    addInteractiveElements() {
        this.addActionButtons();
        this.addSharingOptions();
        this.addMetadataDisplay();
        this.setupKeyboardNavigation();
        this.setupAccessibilityFeatures();
    }

    addActionButtons() {
        const actionsContainer = document.getElementById('action-buttons');
        if (!actionsContainer) return;
        
        actionsContainer.innerHTML = `
            <div class="action-buttons-grid">
                <button class="action-btn primary" data-action="save-result">
                    💾 結果を保存
                </button>
                <button class="action-btn secondary" data-action="new-analysis">
                    🔄 新しい分析
                </button>
                <button class="action-btn secondary" data-action="detailed-view">
                    🔍 詳細表示
                </button>
                <button class="action-btn secondary" data-action="print-result">
                    🖨️ 印刷用表示
                </button>
            </div>
        `;
        
        // イベントリスナー設定
        actionsContainer.addEventListener('click', this.handleActionClick.bind(this));
    }

    addSharingOptions() {
        const sharingContainer = document.getElementById('sharing-options');
        if (!sharingContainer) return;
        
        sharingContainer.innerHTML = `
            <div class="sharing-section">
                <h6 class="sharing-title">結果を共有</h6>
                <div class="sharing-buttons">
                    <button class="share-btn" data-share="twitter">
                        🐦 Twitter
                    </button>
                    <button class="share-btn" data-share="line">
                        💬 LINE
                    </button>
                    <button class="share-btn" data-share="copy-link">
                        🔗 リンクコピー
                    </button>
                    <button class="share-btn" data-share="export-text">
                        📄 テキスト出力
                    </button>
                </div>
            </div>
        `;
        
        sharingContainer.addEventListener('click', this.handleSharingClick.bind(this));
    }

    addMetadataDisplay() {
        const metadataContainer = document.getElementById('results-metadata');
        if (!metadataContainer) return;
        
        const results = this.currentResults;
        metadataContainer.innerHTML = `
            <div class="metadata-section">
                <div class="analysis-stats">
                    <div class="stat-item">
                        <label>分析時間</label>
                        <span>${results.processingTime}ms</span>
                    </div>
                    <div class="stat-item">
                        <label>信頼度</label>
                        <span>${Math.round(results.confidence * 100)}%</span>
                    </div>
                    <div class="stat-item">
                        <label>真正性</label>
                        <span>${Math.round(results.authenticity * 100)}%</span>
                    </div>
                    <div class="stat-item">
                        <label>哲学準拠</label>
                        <span>${Math.round(results.philosophical_alignment * 100)}%</span>
                    </div>
                </div>
                
                <div class="engine-info">
                    <div class="engine-version">Engine v${results.engineVersion}</div>
                    <div class="analysis-type">${results.analysisType}</div>
                    <div class="timestamp">${new Date(results.timestamp).toLocaleString('ja-JP')}</div>
                </div>
            </div>
        `;
    }

    // ========================================
    // アニメーション関連メソッド
    // ========================================

    async playIntroAnimation() {
        this.animationState = 'intro';
        const wrapper = this.container.querySelector('.iching-results-wrapper');
        
        // フェードイン効果
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(20px)';
        
        await this.delay(100);
        
        wrapper.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
        
        await this.delay(800);
    }

    async animateHexagramLines() {
        const lines = this.container.querySelectorAll('.hexagram-line');
        
        for (let i = 0; i < lines.length; i++) {
            lines[i].style.opacity = '0';
            lines[i].style.transform = 'scale(0.8)';
        }
        
        for (let i = 0; i < lines.length; i++) {
            await this.delay(150);
            lines[i].style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            lines[i].style.opacity = '1';
            lines[i].style.transform = 'scale(1)';
        }
    }

    async playCompletionAnimation() {
        this.animationState = 'complete';
        
        // 完了効果の追加
        const completionIndicator = document.createElement('div');
        completionIndicator.className = 'completion-indicator';
        completionIndicator.innerHTML = '✨ 分析完了';
        completionIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4ade80;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.5s ease;
        `;
        
        document.body.appendChild(completionIndicator);
        
        await this.delay(100);
        completionIndicator.style.opacity = '1';
        completionIndicator.style.transform = 'translateX(0)';
        
        await this.delay(2000);
        completionIndicator.style.opacity = '0';
        completionIndicator.style.transform = 'translateX(100px)';
        
        await this.delay(500);
        document.body.removeChild(completionIndicator);
    }

    // ========================================
    // イベントハンドリング
    // ========================================

    handleActionClick(event) {
        const action = event.target.dataset.action;
        if (!action) return;
        
        switch (action) {
            case 'save-result':
                this.saveResult();
                break;
            case 'new-analysis':
                this.startNewAnalysis();
                break;
            case 'detailed-view':
                this.showDetailedView();
                break;
            case 'print-result':
                this.printResult();
                break;
        }
    }

    handleSharingClick(event) {
        const shareType = event.target.dataset.share;
        if (!shareType) return;
        
        switch (shareType) {
            case 'twitter':
                this.shareToTwitter();
                break;
            case 'line':
                this.shareToLine();
                break;
            case 'copy-link':
                this.copyShareLink();
                break;
            case 'export-text':
                this.exportAsText();
                break;
        }
    }

    // ========================================
    // 機能実装メソッド（簡略化）
    // ========================================

    saveResult() {
        try {
            const saveData = {
                timestamp: Date.now(),
                results: this.currentResults
            };
            localStorage.setItem('haqei_iching_result', JSON.stringify(saveData));
            this.showNotification('結果を保存しました', 'success');
        } catch (error) {
            this.showNotification('保存に失敗しました', 'error');
        }
    }

    startNewAnalysis() {
        if (confirm('新しい分析を開始しますか？現在の結果は失われます。')) {
            window.location.reload();
        }
    }

    showDetailedView() {
        // 詳細ビューモードに切り替え
        this.container.classList.toggle('detailed-view');
    }

    printResult() {
        const printContent = this.generatePrintableContent();
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    generatePrintableContent() {
        const hexagram = this.currentResults.selectedHexagram;
        return `
            <html>
                <head>
                    <title>易経分析結果 - ${hexagram.name}</title>
                    <style>
                        body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.6; }
                        .hexagram-title { text-align: center; margin-bottom: 20px; }
                        .interpretation { margin: 20px 0; }
                        .classical-text { font-style: italic; background: #f5f5f5; padding: 10px; }
                    </style>
                </head>
                <body>
                    <div class="hexagram-title">
                        <h1>${hexagram.name}</h1>
                        <p>第${hexagram.number}番 | ${new Date().toLocaleDateString('ja-JP')}</p>
                    </div>
                    
                    <div class="interpretation">
                        <h2>古典的意味</h2>
                        <p class="classical-text">${hexagram.classical_meaning}</p>
                    </div>
                    
                    <div class="interpretation">
                        <h2>現代的解釈</h2>
                        <p>${hexagram.modern_interpretation}</p>
                    </div>
                    
                    <div class="metadata">
                        <p><small>HAQEI マルチバース・アナライザー | bunenjin Philosophy Compliant</small></p>
                    </div>
                </body>
            </html>
        `;
    }

    // ========================================
    // ユーティリティメソッド
    // ========================================

    getAspectInfo(aspectName) {
        const aspectMap = {
            personal_self: {
                displayName: '個人的自分',
                icon: '🧘',
                relevance: '高',
                characteristics: ['内省', '成長', '価値観']
            },
            social_self: {
                displayName: '社会的自分',
                icon: '🤝',
                relevance: '中',
                characteristics: ['関係性', '協調', 'コミュニケーション']
            },
            professional_self: {
                displayName: '職業的自分',
                icon: '💼',
                relevance: '高',
                characteristics: ['責任', 'スキル', 'キャリア']
            },
            creative_self: {
                displayName: '創造的自分',
                icon: '🎨',
                relevance: '中',
                characteristics: ['創造性', '直感', '表現']
            },
            protective_self: {
                displayName: '防御的自分',
                icon: '🛡️',
                relevance: '中',
                characteristics: ['安全', '慎重', 'リスク管理']
            }
        };
        
        return aspectMap[aspectName] || {
            displayName: aspectName,
            icon: '👤',
            relevance: '不明',
            characteristics: []
        };
    }

    getElementSymbol(element) {
        const symbols = {
            wood: '🌲', fire: '🔥', earth: '🌍', metal: '⚙️', water: '💧'
        };
        return symbols[element] || '🌍';
    }

    getElementName(element) {
        const names = {
            wood: '木', fire: '火', earth: '土', metal: '金', water: '水'
        };
        return names[element] || '土';
    }

    getDirectionSymbol(direction) {
        const symbols = {
            north: '⬆️', south: '⬇️', east: '➡️', west: '⬅️',
            northeast: '↗️', southeast: '↘️', southwest: '↙️', northwest: '↖️',
            center: '🎯'
        };
        return symbols[direction] || '🎯';
    }

    getDirectionName(direction) {
        const names = {
            north: '北', south: '南', east: '東', west: '西',
            northeast: '北東', southeast: '南東', southwest: '南西', northwest: '北西',
            center: '中央'
        };
        return names[direction] || '中央';
    }

    getSeasonName(season) {
        const names = {
            spring: '春', summer: '夏', autumn: '秋', winter: '冬',
            late_summer: '土用', late_autumn: '晩秋'
        };
        return names[season] || '通年';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        // 簡易通知システム
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
    }

    displayErrorFallback(error) {
        this.container.innerHTML = `
            <div class="error-fallback">
                <div class="error-icon">⚠️</div>
                <h3>表示エラーが発生しました</h3>
                <p>結果の表示中に問題が発生しました。</p>
                <p class="error-message">${error.message}</p>
                <button onclick="location.reload()" class="retry-button">
                    🔄 再読み込み
                </button>
            </div>
        `;
    }

    // その他の支援メソッド（簡略化実装）
    setupResponsiveLayout() { /* レスポンシブ設定 */ }
    renderPracticalAdvice(advice) { 
        return Array.isArray(advice) ? 
            `<ul>${advice.map(item => `<li>${item}</li>`).join('')}</ul>` : 
            '<p>具体的な行動を検討してください</p>';
    }
    renderNextSteps(steps) {
        return Array.isArray(steps) ?
            `<ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol>` :
            '<p>状況に応じた適切な行動をとってください</p>';
    }
    generateTimingGuidance() { return '適切なタイミングを見極めることが重要です'; }
    setupBunenjinTabs() { /* タブ機能設定 */ }
    addReadAloudButton() { /* 読み上げ機能 */ }
    setupKeyboardNavigation() { /* キーボードナビゲーション */ }
    setupAccessibilityFeatures() { /* アクセシビリティ */ }
    shareToTwitter() { /* Twitter共有 */ }
    shareToLine() { /* LINE共有 */ }
    copyShareLink() { /* リンクコピー */ }
    exportAsText() { /* テキスト出力 */ }
}

// グローバル利用のためのエクスポート
if (typeof window !== 'undefined') {
    window.IChingResultsDisplay = IChingResultsDisplay;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IChingResultsDisplay;
}

console.log('✅ IChingResultsDisplay.js Phase 2 implementation loaded successfully');