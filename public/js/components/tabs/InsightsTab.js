/**
 * InsightsTab.js
 * HAQEI タブナビゲーションシステム - 洞察タブ
 * 
 * 機能:
 * - 易経メタファーによる深層洞察
 * - パーソナライズされた推奨事項
 * - 成長の方向性とガイダンス
 * - 内的調和の促進
 * - スピリチュアルな視点からの分析
 */

class InsightsTab extends BaseTabView {
    constructor(tabId) {
        super(tabId);
        this.analysisData = null;
        this.insights = null;
        this.ichingEngine = null;
        this.hexagramExtractor = null; // 追加
    }

    /**
     * タブコンテンツの初期化
     */
    init() {
        this.initializeIChingEngine();
        this.initializeHexagramExtractor(); // 追加
        this.bindEvents();
    }

    /**
     * 易経エンジンの初期化
     */
    initializeIChingEngine() {
        if (typeof AuthenticIChingEngine !== 'undefined') {
            this.ichingEngine = new AuthenticIChingEngine();
        } else {
            console.warn('⚠️ AuthenticIChingEngine not available, using fallback');
        }
    }

    /**
     * HexagramExtractorの初期化（新規追加）
     */
    initializeHexagramExtractor() {
        if (typeof HexagramExtractor !== 'undefined') {
            this.hexagramExtractor = new HexagramExtractor();
            console.log('✅ InsightsTab: HexagramExtractor initialized');
        } else {
            console.warn('⚠️ InsightsTab: HexagramExtractor not available');
        }
    }

    /**
     * H384データベースから易卦の詳細情報を取得
     */
    getHexagramDetailedInsights(hexagramName, osType) {
        if (!this.hexagramExtractor) {
            return this.getFallbackInsights(hexagramName, osType);
        }

        const hexagramData = this.hexagramExtractor.getHexagramDataByName(hexagramName);
        
        if (!hexagramData || hexagramData.length === 0) {
            return this.getFallbackInsights(hexagramName, osType);
        }

        // 全6爻データを使用して洞察を生成
        const allYaos = hexagramData.slice(0, 6);
        
        return {
            keywords: this.extractKeywords(allYaos),
            interpretation: this.generateInterpretation(allYaos, osType),
            advice: this.generatePersonalizedAdvice(allYaos, osType),
            scores: this.calculateDetailedScores(allYaos),
            developmentStages: this.generateDevelopmentStages(allYaos)
        };
    }

    /**
     * キーワード抽出
     */
    extractKeywords(yaos) {
        const allKeywords = [];
        yaos.forEach(yao => {
            if (yao['キーワード']) {
                allKeywords.push(...yao['キーワード']);
            }
        });
        // 重複を除去して最初の5つを返す
        return [...new Set(allKeywords)].slice(0, 5);
    }

    /**
     * 解釈の生成
     */
    generateInterpretation(yaos, osType) {
        const interpretations = yaos.map(yao => yao['現代解釈の要約'] || '').filter(i => i);
        
        if (interpretations.length === 0) {
            return this.getDefaultInterpretation(osType);
        }

        // OSタイプに応じて解釈をカスタマイズ
        const osContext = {
            'engine': 'あなたの内的動機と創造性において、',
            'interface': 'あなたの社会的な関わりにおいて、',
            'safemode': 'あなたの心の安定と基盤において、'
        };

        return osContext[osType] + interpretations[0];
    }

    /**
     * パーソナライズされたアドバイス生成
     */
    generatePersonalizedAdvice(yaos, osType) {
        const advice = [];
        
        yaos.forEach((yao, index) => {
            const score = yao['S1_基本スコア'] || 50;
            const keyword = yao['キーワード'] ? yao['キーワード'][0] : '';
            
            if (score >= 70) {
                advice.push(`「${keyword}」の力を最大限に活用しましょう`);
            } else if (score >= 50) {
                advice.push(`「${keyword}」の側面をさらに発展させる余地があります`);
            } else {
                advice.push(`「${keyword}」の要素を意識的に強化することが大切です`);
            }
        });

        return advice.slice(0, 3);
    }

    /**
     * 詳細スコア計算
     */
    calculateDetailedScores(yaos) {
        const scores = {
            potential: 0,
            stability: 0,
            growth: 0
        };

        yaos.forEach(yao => {
            scores.potential += (yao['S1_基本スコア'] || 0) * 0.4;
            scores.stability += (yao['S2_関連スコア'] || 0) * 0.3;
            scores.growth += (yao['S3_状況スコア'] || 0) * 0.3;
        });

        return {
            potential: Math.round(scores.potential / yaos.length),
            stability: Math.round(scores.stability / yaos.length),
            growth: Math.round(scores.growth / yaos.length)
        };
    }
    
    /**
     * 6爻の発展段階を生成
     */
    generateDevelopmentStages(yaos) {
        if (!yaos || yaos.length === 0) return [];
        
        const stageNames = [
            '初期段階（初爻）',
            '成長段階（二爻）', 
            '発展段階（三爻）',
            '転換段階（四爻）',
            '成熟段階（五爻）',
            '完成段階（上爻）'
        ];
        
        return yaos.map((yao, index) => {
            if (!yao) return null;
            
            return {
                stage: index + 1,
                name: stageNames[index] || `第${index + 1}段階`,
                line: yao['爻'] || `${index + 1}爻`,
                keywords: yao['キーワード'] || [],
                interpretation: yao['現代解釈の要約'] || '',
                scores: {
                    basic: parseFloat(yao['S1_基本スコア'] || 0),
                    potential: parseFloat(yao['S2_ポテンシャル'] || 0),
                    stability: parseFloat(yao['S3_安定性スコア'] || 0),
                    risk: parseFloat(yao['S4_リスク'] || 0)
                },
                advice: this.generateStageAdvice(yao, index + 1)
            };
        }).filter(stage => stage !== null);
    }
    
    /**
     * 各段階のアドバイスを生成
     */
    generateStageAdvice(yao, stageNumber) {
        const stageAdvice = {
            1: '基礎を固め、慎重に準備を進める時期です。',
            2: '成長の機会を見極め、適切な行動を取る時期です。',
            3: '発展の勢いを活かし、積極的に前進する時期です。',
            4: '転換点を迎え、新たな方向性を模索する時期です。',
            5: '成熟した判断力で、リーダーシップを発揮する時期です。',
            6: '完成に向けて、最終的な調整を行う時期です。'
        };
        
        const baseAdvice = stageAdvice[stageNumber] || '現在の状況に応じた適切な行動を取りましょう。';
        const interpretation = yao['現代解釈の要約'] || '';
        
        if (interpretation) {
            return `${baseAdvice} ${interpretation}`;
        }
        
        return baseAdvice;
    }

    /**
     * フォールバック洞察の取得
     */
    getFallbackInsights(hexagramName, osType) {
        return {
            keywords: ['調和', '成長', '変化', '安定', '創造'],
            interpretation: this.getDefaultInterpretation(osType),
            advice: [
                '現在の状況を受け入れることから始めましょう',
                '小さな変化から大きな成長が生まれます',
                'バランスを保ちながら前進することが重要です'
            ],
            scores: {
                potential: 65,
                stability: 70,
                growth: 60
            }
        };
    }

    /**
     * デフォルト解釈の取得
     */
    getDefaultInterpretation(osType) {
        const defaultInterpretations = {
            'engine': 'あなたの内的動機と創造性において、新しい可能性を探求する時期です。',
            'interface': 'あなたの社会的な関わりにおいて、調和と協力を重視することが大切です。',
            'safemode': 'あなたの心の安定と基盤において、着実な歩みを続けることが重要です。'
        };
        return defaultInterpretations[osType] || '現在の状況を深く理解し、適切な行動を取ることが大切です。';
    }

    /**
     * メインコンテンツのレンダリング
     */
    renderContent(container) {
        if (!this.analysisData) {
            this.showLoading(container);
            return;
        }

        // 洞察の生成
        this.generateInsights();

        const content = `
            <div class="insights-container">
                ${this.renderHeader()}
                ${this.renderComprehensiveReport()}
                ${this.renderIChingOverview()}
                ${this.renderPersonalInsights()}
                ${this.renderGrowthGuidance()}
                ${this.renderHarmonyAnalysis()}
                ${this.renderSpiritualPerspective()}
                ${this.renderActionableWisdom()}
            </div>
        `;

        container.innerHTML = content;
        this.initializeInteractiveElements();
    }

    /**
     * ヘッダーセクションのレンダリング
     */
    renderHeader() {
        return `
            <div class="insights-header">
                <h2 class="insights-title">
                    <span class="insights-icon">💡</span>
                    深層洞察
                </h2>
                <p class="insights-subtitle">
                    易経の智慧を通じて、あなたの内なる真実と成長の道筋を探求します
                </p>
            </div>
        `;
    }

    /**
     * 包括的レポートセクションのレンダリング
     */
    renderComprehensiveReport() {
        if (!window.ComprehensiveReportGenerator) {
            return '';
        }

        try {
            const storageManager = window.StorageManager;
            const answers = storageManager ? storageManager.getAnswers() : {};
            
            const reportGenerator = new window.ComprehensiveReportGenerator();
            const report = reportGenerator.generateComprehensiveReport(this.analysisData, answers);

            return `
                <div class="comprehensive-report-section">
                    <h3 class="section-title">
                        <span class="section-icon">📊</span>
                        包括的分析レポート
                    </h3>
                    
                    <!-- 品質指標 -->
                    <div class="quality-metrics-card">
                        <h4 class="card-title">品質指標</h4>
                        <div class="metrics-grid">
                            <div class="metric-item">
                                <span class="metric-label">Cronbach's Alpha</span>
                                <div class="metric-value">${report.qualityMetrics.cronbachAlpha.toFixed(3)}</div>
                                <div class="metric-description">内的一貫性</div>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">信頼区間</span>
                                <div class="metric-value">${report.qualityMetrics.confidenceInterval.toFixed(1)}%</div>
                                <div class="metric-description">結果の信頼性</div>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">一貫性スコア</span>
                                <div class="metric-value">${report.qualityMetrics.consistency.toFixed(1)}%</div>
                                <div class="metric-description">回答の一貫性</div>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">バランススコア</span>
                                <div class="metric-value">${report.qualityMetrics.balance.toFixed(1)}%</div>
                                <div class="metric-description">三つのOSのバランス</div>
                            </div>
                            <div class="metric-item overall">
                                <span class="metric-label">総合品質</span>
                                <div class="metric-value">${report.qualityMetrics.overallQuality.toFixed(1)}%</div>
                                <div class="metric-description">全体的な分析品質</div>
                            </div>
                        </div>
                    </div>

                    <!-- ベンチマーク -->
                    <div class="benchmark-card">
                        <h4 class="card-title">ベンチマーク比較</h4>
                        <div class="benchmark-grid">
                            ${Object.entries(report.benchmarks).map(([key, value]) => `
                                <div class="benchmark-item">
                                    <span class="benchmark-label">${this.getBenchmarkLabel(key)}</span>
                                    <div class="benchmark-bar">
                                        <div class="benchmark-fill" style="width: ${value}%"></div>
                                    </div>
                                    <span class="benchmark-value">${value.toFixed(1)}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 信頼性分析 -->
                    <div class="reliability-card">
                        <h4 class="card-title">信頼性分析</h4>
                        <div class="reliability-content">
                            <div class="reliability-score">
                                <span class="score-label">信頼性レベル:</span>
                                <span class="score-value ${this.getReliabilityClass(report.reliabilityAnalysis.level)}">
                                    ${report.reliabilityAnalysis.level}
                                </span>
                            </div>
                            <div class="reliability-factors">
                                <h5>主要要因:</h5>
                                <ul>
                                    ${report.reliabilityAnalysis.factors.map(factor => `
                                        <li>${factor}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- 推奨事項 -->
                    <div class="recommendations-card">
                        <h4 class="card-title">推奨事項</h4>
                        <div class="recommendations-list">
                            ${report.recommendations.map(rec => `
                                <div class="recommendation-item">
                                    <div class="recommendation-priority ${rec.priority}">
                                        ${rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'}
                                    </div>
                                    <div class="recommendation-content">
                                        <h5 class="recommendation-title">${rec.title}</h5>
                                        <p class="recommendation-description">${rec.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('包括的レポート生成エラー:', error);
            return `
                <div class="comprehensive-report-section">
                    <h3 class="section-title">
                        <span class="section-icon">📊</span>
                        包括的分析レポート
                    </h3>
                    <div class="error-message">
                        レポートの生成中にエラーが発生しました。
                    </div>
                </div>
            `;
        }
    }

    /**
     * ベンチマークラベルの取得
     */
    getBenchmarkLabel(key) {
        const labels = {
            'consistency': '一貫性',
            'balance': 'バランス',
            'coverage': 'カバレッジ',
            'depth': '深度',
            'accuracy': '精度'
        };
        return labels[key] || key;
    }

    /**
     * 信頼性クラスの取得
     */
    getReliabilityClass(level) {
        const classes = {
            '高': 'high-reliability',
            '中': 'medium-reliability',
            '低': 'low-reliability'
        };
        return classes[level] || 'medium-reliability';
    }

    /**
     * 易経概要セクションのレンダリング（修正版）
     */
    renderIChingOverview() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        // H384データベースから詳細情報を取得
        const engineInsights = this.getHexagramDetailedInsights(engineOS.hexagram.name, 'engine');
        const interfaceInsights = this.getHexagramDetailedInsights(interfaceOS.hexagram.name, 'interface');
        const safeModeInsights = this.getHexagramDetailedInsights(safeModeOS.hexagram.name, 'safemode');
        
        return `
            <div class="iching-overview-section">
                <h3 class="section-title">
                    <span class="section-icon">☯️</span>
                    易経による深層分析
                </h3>
                <div class="hexagram-grid">
                    <!-- Engine OS Card -->
                    <div class="hexagram-insight-card engine">
                        <div class="hexagram-header">
                            <div class="hexagram-symbol">${engineOS.hexagram.symbol}</div>
                            <div class="hexagram-info">
                                <h4 class="hexagram-name">${engineOS.hexagram.name}</h4>
                                <p class="hexagram-role">内なる価値観の源泉</p>
                            </div>
                        </div>
                        
                        <div class="hexagram-keywords">
                            ${engineInsights.keywords.map(keyword => 
                                `<span class="keyword-tag">${keyword}</span>`
                            ).join('')}
                        </div>
                        
                        <div class="hexagram-interpretation">
                            <p>${engineInsights.interpretation}</p>
                        </div>
                        
                        <div class="hexagram-scores">
                            <div class="score-item">
                                <span class="score-label">潜在力</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${engineInsights.scores.potential}%"></div>
                                </div>
                                <span class="score-value">${engineInsights.scores.potential}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">安定性</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${engineInsights.scores.stability}%"></div>
                                </div>
                                <span class="score-value">${engineInsights.scores.stability}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">成長性</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${engineInsights.scores.growth}%"></div>
                                </div>
                                <span class="score-value">${engineInsights.scores.growth}%</span>
                            </div>
                        </div>
                        
                        <div class="hexagram-advice">
                            <h5 class="advice-title">💡 実践的アドバイス</h5>
                            <ul class="advice-list">
                                ${engineInsights.advice.map(item => 
                                    `<li>${item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- Interface OS Card -->
                    <div class="hexagram-insight-card interface">
                        <div class="hexagram-header">
                            <div class="hexagram-symbol">${interfaceOS.hexagram.symbol}</div>
                            <div class="hexagram-info">
                                <h4 class="hexagram-name">${interfaceOS.hexagram.name}</h4>
                                <p class="hexagram-role">社会との関わり方</p>
                            </div>
                        </div>
                        
                        <div class="hexagram-keywords">
                            ${interfaceInsights.keywords.map(keyword => 
                                `<span class="keyword-tag">${keyword}</span>`
                            ).join('')}
                        </div>
                        
                        <div class="hexagram-interpretation">
                            <p>${interfaceInsights.interpretation}</p>
                        </div>
                        
                        <div class="hexagram-scores">
                            <div class="score-item">
                                <span class="score-label">潜在力</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${interfaceInsights.scores.potential}%"></div>
                                </div>
                                <span class="score-value">${interfaceInsights.scores.potential}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">安定性</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${interfaceInsights.scores.stability}%"></div>
                                </div>
                                <span class="score-value">${interfaceInsights.scores.stability}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">成長性</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${interfaceInsights.scores.growth}%"></div>
                                </div>
                                <span class="score-value">${interfaceInsights.scores.growth}%</span>
                            </div>
                        </div>
                        
                        <div class="hexagram-advice">
                            <h5 class="advice-title">💡 実践的アドバイス</h5>
                            <ul class="advice-list">
                                ${interfaceInsights.advice.map(item => 
                                    `<li>${item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- Safe Mode OS Card -->
                    <div class="hexagram-insight-card safemode">
                        <div class="hexagram-header">
                            <div class="hexagram-symbol">${safeModeOS.hexagram.symbol}</div>
                            <div class="hexagram-info">
                                <h4 class="hexagram-name">${safeModeOS.hexagram.name}</h4>
                                <p class="hexagram-role">心の基盤と安定</p>
                            </div>
                        </div>
                        
                        <div class="hexagram-keywords">
                            ${safeModeInsights.keywords.map(keyword => 
                                `<span class="keyword-tag">${keyword}</span>`
                            ).join('')}
                        </div>
                        
                        <div class="hexagram-interpretation">
                            <p>${safeModeInsights.interpretation}</p>
                        </div>
                        
                        <div class="hexagram-scores">
                            <div class="score-item">
                                <span class="score-label">潜在力</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${safeModeInsights.scores.potential}%"></div>
                                </div>
                                <span class="score-value">${safeModeInsights.scores.potential}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">安定性</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${safeModeInsights.scores.stability}%"></div>
                                </div>
                                <span class="score-value">${safeModeInsights.scores.stability}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">成長性</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${safeModeInsights.scores.growth}%"></div>
                                </div>
                                <span class="score-value">${safeModeInsights.scores.growth}%</span>
                            </div>
                        </div>
                        
                        <div class="hexagram-advice">
                            <h5 class="advice-title">💡 実践的アドバイス</h5>
                            <ul class="advice-list">
                                ${safeModeInsights.advice.map(item => 
                                    `<li>${item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- 6爻発展段階セクション -->
                ${this.renderDevelopmentStages()}
            </div>
        `;
    }

    /**
     * 6爻発展段階セクションのレンダリング
     */
    renderDevelopmentStages() {
        if (!this.data || !this.data.hexagrams) {
            return '';
        }

        // 各OSの卦から発展段階を取得
        const stages = [];
        Object.entries(this.data.hexagrams).forEach(([osType, hexagramData]) => {
            const insights = this.getHexagramDetailedInsights(hexagramData.name, osType);
            if (insights && insights.developmentStages) {
                stages.push({
                    osType,
                    hexagram: hexagramData,
                    stages: insights.developmentStages
                });
            }
        });

        if (stages.length === 0) {
            return '';
        }

        return `
            <div class="development-stages-section">
                <h3 class="section-title">🌱 6爻発展段階分析</h3>
                <p class="section-description">各OSの6つの発展段階を通じて、あなたの成長プロセスを理解しましょう。</p>
                
                <div class="stages-container">
                    ${stages.map(osStages => `
                        <div class="os-stages-card ${osStages.osType.toLowerCase()}">
                            <div class="os-stages-header">
                                <div class="hexagram-symbol">${osStages.hexagram.symbol}</div>
                                <div class="os-info">
                                    <h4 class="os-name">${this.getOSDisplayName(osStages.osType)}</h4>
                                    <p class="hexagram-name">${osStages.hexagram.name}</p>
                                </div>
                            </div>
                            
                            <div class="stages-grid">
                                ${osStages.stages.map((stage, index) => {
                                    const osScore = osStages.hexagram.score || 0;
                                    const currentStage = Math.ceil(osScore / 16.67); // 100/6 ≈ 16.67
                                    const isCurrent = (index + 1) === currentStage;
                                    const isPassed = (index + 1) < currentStage;
                                    
                                    return `
                                    <div class="stage-item stage-${index + 1} ${isCurrent ? 'current-stage' : ''} ${isPassed ? 'passed-stage' : ''}" style="${isCurrent ? 'background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 2px solid #f39c12; box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);' : isPassed ? 'background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 1px solid #28a745; opacity: 0.8;' : 'opacity: 0.6;'}">
                                        <div class="stage-header">
                                            <span class="stage-number" style="${isCurrent ? 'background: #f39c12; color: white; font-weight: bold;' : isPassed ? 'background: #28a745; color: white;' : ''}">${index + 1}</span>
                                            <span class="stage-title" style="${isCurrent ? 'font-weight: bold; color: #d68910;' : ''}">${stage.title}</span>
                                            ${isCurrent ? '<span style="color: #f39c12; font-weight: bold; margin-left: 8px;">← 現在の段階</span>' : ''}
                                        </div>
                                        <div class="stage-content">
                                            <p class="stage-description">${stage.description}</p>
                                            <div class="stage-advice">
                                                <strong>アドバイス:</strong> ${stage.advice}
                                            </div>
                                        </div>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * OS表示名を取得
     */
    getOSDisplayName(osType) {
        const displayNames = {
            'InterfaceOS': 'Interface OS（社会性）',
            'SafeModeOS': 'Safe Mode OS（安定性）',
            'CreativeOS': 'Engine OS（内的動機）'
        };
        return displayNames[osType] || osType;
    }

    /**
     * 個人的洞察セクションのレンダリング
     */
    renderPersonalInsights() {
        return `
            <div class="personal-insights-section">
                <h3 class="section-title">あなたへの洞察</h3>
                <div class="insights-grid">
                    <div class="insight-card primary">
                        <div class="insight-icon">🌟</div>
                        <h4 class="insight-title">核心的な特質</h4>
                        <p class="insight-content">${this.insights.coreNature}</p>
                    </div>
                    <div class="insight-card secondary">
                        <div class="insight-icon">🔮</div>
                        <h4 class="insight-title">隠れた可能性</h4>
                        <p class="insight-content">${this.insights.hiddenPotential}</p>
                    </div>
                    <div class="insight-card tertiary">
                        <div class="insight-icon">⚖️</div>
                        <h4 class="insight-title">内的バランス</h4>
                        <p class="insight-content">${this.insights.innerBalance}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 成長ガイダンスセクションのレンダリング
     */
    renderGrowthGuidance() {
        return `
            <div class="growth-guidance-section">
                <h3 class="section-title">成長への道筋</h3>
                <div class="growth-path">
                    ${this.insights.growthSteps.map((step, index) => `
                        <div class="growth-step" data-step="${index + 1}">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">
                                <h4 class="step-title">${step.title}</h4>
                                <p class="step-description">${step.description}</p>
                                <div class="step-practices">
                                    ${step.practices.map(practice => `
                                        <span class="practice-tag">${practice}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * 調和分析セクションのレンダリング
     */
    renderHarmonyAnalysis() {
        const harmonyLevel = this.calculateHarmonyLevel();
        
        return `
            <div class="harmony-analysis-section">
                <h3 class="section-title">内的調和の分析</h3>
                <div class="harmony-container">
                    <div class="harmony-meter">
                        <div class="harmony-circle">
                            <div class="harmony-progress" style="--progress: ${harmonyLevel}%">
                                <div class="harmony-value">${harmonyLevel}%</div>
                            </div>
                        </div>
                        <p class="harmony-label">調和レベル</p>
                    </div>
                    <div class="harmony-details">
                        <h4 class="harmony-title">調和の状態</h4>
                        <p class="harmony-description">${this.getHarmonyDescription(harmonyLevel)}</p>
                        <div class="harmony-elements">
                            <div class="element-balance">
                                <span class="element-label">創造性と安定性</span>
                                <div class="balance-bar">
                                    <div class="balance-fill" style="width: ${this.getElementBalance('creativity')}%"></div>
                                </div>
                            </div>
                            <div class="element-balance">
                                <span class="element-label">内向性と外向性</span>
                                <div class="balance-bar">
                                    <div class="balance-fill" style="width: ${this.getElementBalance('social')}%"></div>
                                </div>
                            </div>
                            <div class="element-balance">
                                <span class="element-label">変化と継続性</span>
                                <div class="balance-bar">
                                    <div class="balance-fill" style="width: ${this.getElementBalance('change')}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * スピリチュアル視点セクションのレンダリング
     */
    renderSpiritualPerspective() {
        return `
            <div class="spiritual-perspective-section">
                <h3 class="section-title">魂の視点から</h3>
                <div class="spiritual-content">
                    <div class="spiritual-message">
                        <div class="message-icon">🕊️</div>
                        <div class="message-content">
                            <h4 class="message-title">魂からのメッセージ</h4>
                            <p class="message-text">${this.insights.soulMessage}</p>
                        </div>
                    </div>
                    <div class="life-purpose">
                        <div class="purpose-icon">🎯</div>
                        <div class="purpose-content">
                            <h4 class="purpose-title">人生の目的</h4>
                            <p class="purpose-text">${this.insights.lifePurpose}</p>
                        </div>
                    </div>
                    <div class="karmic-lessons">
                        <div class="lessons-icon">📚</div>
                        <div class="lessons-content">
                            <h4 class="lessons-title">学びのテーマ</h4>
                            <ul class="lessons-list">
                                ${this.insights.karmicLessons.map(lesson => `
                                    <li class="lesson-item">${lesson}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 実践的智慧セクションのレンダリング
     */
    renderActionableWisdom() {
        return `
            <div class="actionable-wisdom-section">
                <h3 class="section-title">実践的な智慧</h3>
                <div class="wisdom-categories">
                    <div class="wisdom-category daily">
                        <h4 class="category-title">
                            <span class="category-icon">🌅</span>
                            日常の実践
                        </h4>
                        <ul class="wisdom-list">
                            ${this.insights.dailyPractices.map(practice => `
                                <li class="wisdom-item">
                                    <span class="wisdom-bullet">•</span>
                                    <span class="wisdom-text">${practice}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="wisdom-category meditation">
                        <h4 class="category-title">
                            <span class="category-icon">🧘</span>
                            瞑想と内省
                        </h4>
                        <ul class="wisdom-list">
                            ${this.insights.meditationGuidance.map(guidance => `
                                <li class="wisdom-item">
                                    <span class="wisdom-bullet">•</span>
                                    <span class="wisdom-text">${guidance}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="wisdom-category relationships">
                        <h4 class="category-title">
                            <span class="category-icon">💝</span>
                            人間関係
                        </h4>
                        <ul class="wisdom-list">
                            ${this.insights.relationshipWisdom.map(wisdom => `
                                <li class="wisdom-item">
                                    <span class="wisdom-bullet">•</span>
                                    <span class="wisdom-text">${wisdom}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 洞察の生成
     */
    generateInsights() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        this.insights = {
            coreNature: this.generateCoreNatureInsight(),
            hiddenPotential: this.generateHiddenPotentialInsight(),
            innerBalance: this.generateInnerBalanceInsight(),
            growthSteps: this.generateGrowthSteps(),
            soulMessage: this.generateSoulMessage(),
            lifePurpose: this.generateLifePurpose(),
            karmicLessons: this.generateKarmicLessons(),
            dailyPractices: this.generateDailyPractices(),
            meditationGuidance: this.generateMeditationGuidance(),
            relationshipWisdom: this.generateRelationshipWisdom()
        };
    }

    /**
     * 核心的特質の洞察生成
     */
    generateCoreNatureInsight() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const dominantOS = this.getDominantOS();
        
        const insights = {
            engine: "あなたの本質は創造的な火のエネルギーに満ちています。内なる情熱と独創性が、人生を推進する原動力となっています。",
            interface: "あなたの本質は調和と共感の水のエネルギーを持っています。他者との繋がりと相互理解が、あなたの成長の源泉です。",
            safe: "あなたの本質は安定と持続の土のエネルギーに根ざしています。着実な歩みと深い洞察が、あなたの強みとなっています。"
        };
        
        return insights[dominantOS] || "あなたの本質は多面的で、バランスの取れた豊かな人格を持っています。";
    }

    /**
     * 隠れた可能性の洞察生成
     */
    generateHiddenPotentialInsight() {
        const lowestOS = this.getLowestOS();
        
        const potentials = {
            engine: "あなたの内には未開発の創造的エネルギーが眠っています。自己表現と革新的思考を育むことで、新たな可能性が開花します。",
            interface: "あなたの内には深い共感力と人を癒す力が潜んでいます。他者との真の繋がりを築くことで、この力が覚醒します。",
            safe: "あなたの内には揺るぎない内的平和と智慧が宿っています。静寂の中で自己と向き合うことで、この宝が現れます。"
        };
        
        return potentials[lowestOS] || "あなたの可能性は無限大です。すべての側面がバランス良く発達する素質を持っています。";
    }

    /**
     * 内的バランスの洞察生成
     */
    generateInnerBalanceInsight() {
        const balance = this.calculateHarmonyLevel();
        
        if (balance >= 80) {
            return "あなたの内的世界は美しい調和を保っています。この平衡状態を維持しながら、さらなる深みを探求していきましょう。";
        } else if (balance >= 60) {
            return "あなたの内的バランスは概ね良好です。時折現れる不調和も、成長のための貴重な学びの機会として受け入れましょう。";
        } else {
            return "あなたの内的世界には調整が必要な部分があります。この不調和は、より深い自己理解への扉を開く鍵となります。";
        }
    }

    /**
     * 成長ステップの生成
     */
    generateGrowthSteps() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const steps = [];
        
        // 最低スコアのOSに基づいた成長ステップ
        const lowestOS = this.getLowestOS();
        
        if (lowestOS === 'engine') {
            steps.push({
                title: "内なる声に耳を傾ける",
                description: "日々の静寂の時間を作り、あなたの真の価値観と情熱を探求しましょう。",
                practices: ["朝の瞑想", "ジャーナリング", "創作活動"]
            });
        }
        
        if (lowestOS === 'interface') {
            steps.push({
                title: "他者との真の繋がりを築く",
                description: "表面的な関係を超えて、心からの理解と共感を育みましょう。",
                practices: ["積極的傾聴", "感情の共有", "奉仕活動"]
            });
        }
        
        if (lowestOS === 'safe') {
            steps.push({
                title: "内的平和を培う",
                description: "心の安定と平穏を育み、人生の嵐にも動じない強さを身につけましょう。",
                practices: ["呼吸法", "自然との触れ合い", "感謝の実践"]
            });
        }
        
        // 統合的な成長ステップ
        steps.push({
            title: "三つのOSの統合",
            description: "Engine、Interface、Safe Modeの調和を図り、全人格的な成長を目指しましょう。",
            practices: ["バランス瞑想", "統合的実践", "定期的な自己評価"]
        });
        
        steps.push({
            title: "智慧の実践",
            description: "得られた洞察を日常生活に活かし、真の変容を体験しましょう。",
            practices: ["意識的な選択", "慈悲の実践", "継続的学習"]
        });
        
        return steps;
    }

    /**
     * 魂からのメッセージ生成
     */
    generateSoulMessage() {
        const messages = [
            "あなたは愛そのものです。この真実を思い出し、世界に愛を放射してください。",
            "あなたの人生には深い意味があります。すべての経験が、魂の成長のための贈り物です。",
            "完璧である必要はありません。あなたの不完全さこそが、美しい人間性の証です。",
            "恐れを手放し、信頼の中で歩んでください。宇宙はあなたを支えています。",
            "あなたの内なる光は、決して消えることはありません。それを信じ、輝かせてください。"
        ];
        
        const dominantOS = this.getDominantOS();
        const index = dominantOS === 'engine' ? 0 : dominantOS === 'interface' ? 1 : 2;
        return messages[index] || messages[0];
    }

    /**
     * 人生の目的生成
     */
    generateLifePurpose() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const totalScore = engineOS.score + interfaceOS.score + safeModeOS.score;
        
        if (totalScore >= 240) {
            return "あなたの人生の目的は、調和と智慧を体現し、他者の成長を支援することです。";
        } else if (totalScore >= 210) {
            return "あなたの人生の目的は、自己実現を通じて、世界により多くの愛と理解をもたらすことです。";
        } else {
            return "あなたの人生の目的は、自己受容と成長を通じて、真の平和と喜びを見つけることです。";
        }
    }

    /**
     * カルマ的学びの生成
     */
    generateKarmicLessons() {
        const lessons = [];
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        if (engineOS.score < 70) lessons.push("自己価値の認識と創造性の解放");
        if (interfaceOS.score < 70) lessons.push("他者との健全な境界線の確立");
        if (safeModeOS.score < 70) lessons.push("恐れの手放しと信頼の育成");
        
        lessons.push("無条件の愛の実践");
        lessons.push("現在の瞬間への完全な存在");
        
        return lessons;
    }

    /**
     * 日常の実践生成
     */
    generateDailyPractices() {
        return [
            "朝起きたら、感謝の気持ちを3つ心の中で唱える",
            "一日一回、深呼吸をして自分の内側に意識を向ける",
            "他者に対して、判断ではなく理解を示す",
            "自分の感情を否定せず、優しく受け入れる",
            "夜寝る前に、その日の学びを振り返る"
        ];
    }

    /**
     * 瞑想ガイダンス生成
     */
    generateMeditationGuidance() {
        return [
            "静かな場所で、背筋を伸ばして座り、自然な呼吸に意識を向ける",
            "思考が浮かんできても、雲が空を流れるように優しく手放す",
            "心の奥深くにある平和な空間を感じ、そこに安らぐ",
            "愛と慈悲の光が心から放射されるイメージを持つ",
            "瞑想の終わりに、すべての存在への感謝を捧げる"
        ];
    }

    /**
     * 人間関係の智慧生成
     */
    generateRelationshipWisdom() {
        return [
            "相手を変えようとせず、まず自分自身を理解し受け入れる",
            "コミュニケーションでは、話すことよりも聞くことを重視する",
            "対立が生じたときは、相手の立場に立って考えてみる",
            "愛は条件付きではなく、無条件に与えるものであることを思い出す",
            "すべての関係は、お互いの成長のための鏡であることを理解する"
        ];
    }

    /**
     * ユーティリティメソッド
     */
    getDominantOS() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const scores = {
            engine: engineOS.score,
            interface: interfaceOS.score,
            safe: safeModeOS.score
        };
        
        return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    }

    getLowestOS() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const scores = {
            engine: engineOS.score,
            interface: interfaceOS.score,
            safe: safeModeOS.score
        };
        
        return Object.keys(scores).reduce((a, b) => scores[a] < scores[b] ? a : b);
    }

    calculateHarmonyLevel() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        const scores = [engineOS.score, interfaceOS.score, safeModeOS.score];
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
        const standardDeviation = Math.sqrt(variance);
        
        // 調和レベル（標準偏差が小さく、平均スコアが高いほど高い）
        const balanceScore = Math.max(0, 100 - standardDeviation * 5);
        const averageScore = mean;
        
        return Math.round((balanceScore + averageScore) / 2);
    }

    getHarmonyDescription(level) {
        if (level >= 80) {
            return "あなたの内的世界は美しい調和を保っています。三つのOSが互いに支え合い、豊かな人格を形成しています。";
        } else if (level >= 60) {
            return "あなたの内的バランスは概ね良好です。時折の不調和も、成長のための自然なプロセスです。";
        } else if (level >= 40) {
            return "あなたの内的世界には調整が必要な部分があります。この気づきが、より深い自己理解への第一歩です。";
        } else {
            return "あなたの内的世界は大きな変化の時期にあります。この混乱は、新しい自分への生まれ変わりの兆しです。";
        }
    }

    getElementBalance(element) {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        switch (element) {
            case 'creativity':
                return Math.min(100, (engineOS.score + (100 - safeModeOS.score)) / 2);
            case 'social':
                return Math.min(100, (interfaceOS.score + (100 - engineOS.score)) / 2);
            case 'change':
                return Math.min(100, ((engineOS.score + interfaceOS.score) / 2 + (100 - safeModeOS.score)) / 2);
            default:
                return 50;
        }
    }

    getHexagramMeaning(hexagramName, osType) {
        const meanings = {
            '乾為天': '創造的エネルギーと天の意志を表します。リーダーシップと革新の力を持っています。',
        '坤為地': '受容性と育成の力を表します。安定と持続の基盤となります。',
            '水雷屯': '新しい始まりの困難を表します。忍耐と準備が成功の鍵です。',
            '山水蒙': '学習と成長の時期を表します。謙虚さと探求心が重要です。',
            '水天需': '待つことの智慧を表します。適切なタイミングを見極める力です。',
            '天水讼': '対立と調和の学びを表します。公正さと理解が求められます。',
            '地水师': '組織と指導の力を表します。集団をまとめる能力があります。',
            '水地比': '協力と親和の精神を表します。他者との調和を重視します。'
        };
        
        return meanings[hexagramName] || '深い智慧と洞察を持つ特別な性質を表しています。';
    }

    /**
     * H384データベースを活用した強化された洞察の生成
     */
    generateEnhancedInsights() {
        if (!this.hexagramExtractor) {
            return this.generateInsights();
        }

        try {
            const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
            
            // 各OSの易卦キーワードを抽出
            const engineKeywords = this.extractHexagramKeywords(engineOS.hexagram.name);
            const interfaceKeywords = this.extractHexagramKeywords(interfaceOS.hexagram.name);
            const safeModeKeywords = this.extractHexagramKeywords(safeModeOS.hexagram.name);
            
            // 統合的な洞察を生成
            this.enhancedInsights = {
                coreNature: this.generateCoreNatureInsight(),
                hiddenPotential: this.generateHiddenPotentialInsight(),
                innerBalance: this.generateInnerBalanceInsight(),
                keywords: {
                    engine: engineKeywords,
                    interface: interfaceKeywords,
                    safeMode: safeModeKeywords
                },
                connections: this.analyzeHexagramConnections()
            };
            
            return this.enhancedInsights;
        } catch (error) {
            console.warn('Enhanced insights generation failed, falling back to basic insights:', error);
            return this.generateInsights();
        }
    }

    /**
     * 易卦からキーワードを抽出
     */
    extractHexagramKeywords(hexagramName) {
        if (!this.hexagramExtractor || !hexagramName) {
            return this.getDefaultKeywords();
        }

        try {
            const hexagramData = this.hexagramExtractor.getHexagramByName(hexagramName);
            if (!hexagramData) {
                return this.getDefaultKeywords();
            }

            const keywords = [];
            
            // 基本的なキーワード
            if (hexagramData.meaning) keywords.push(hexagramData.meaning);
            if (hexagramData.element) keywords.push(hexagramData.element);
            if (hexagramData.nature) keywords.push(hexagramData.nature);
            
            // 爻辞からのキーワード
            if (hexagramData.yaos) {
                hexagramData.yaos.forEach(yao => {
                    if (yao.keywords) {
                        keywords.push(...yao.keywords);
                    }
                });
            }
            
            // 重複を除去して最大10個まで
            return [...new Set(keywords)].slice(0, 10);
        } catch (error) {
            console.warn('Keyword extraction failed:', error);
            return this.getDefaultKeywords();
        }
    }

    /**
     * デフォルトキーワードの取得
     */
    getDefaultKeywords() {
        return ['調和', '成長', '変化', '智慧', '直感', '創造', '安定', '発展'];
    }

    /**
     * 易卦間の関連性を分析
     */
    analyzeHexagramConnections() {
        const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
        
        return {
            engineInterface: this.findHexagramConnection(engineOS.hexagram.name, interfaceOS.hexagram.name),
            engineSafeMode: this.findHexagramConnection(engineOS.hexagram.name, safeModeOS.hexagram.name),
            interfaceSafeMode: this.findHexagramConnection(interfaceOS.hexagram.name, safeModeOS.hexagram.name)
        };
    }

    /**
     * 2つの易卦間の関連性を見つける
     */
    findHexagramConnection(hexagram1, hexagram2) {
        // 簡単な関連性分析（実際のH384データベースがあればより詳細に）
        const connections = {
            '乾': ['坤', '震', '巽'],
            '坤': ['乾', '艮', '兌'],
            '震': ['乾', '離', '坎'],
            '巽': ['乾', '兌', '艮']
        };
        
        if (connections[hexagram1] && connections[hexagram1].includes(hexagram2)) {
            return '相補関係';
        }
        
        return '独立関係';
    }

    /**
     * 強化された洞察セクションのレンダリング
     */
    renderEnhancedInsights() {
        if (!this.enhancedInsights) {
            this.generateEnhancedInsights();
        }

        return `
            <div class="enhanced-insights-section">
                <h3 class="section-title">
                    <span class="section-icon">🔮</span>
                    H384データベース強化洞察
                </h3>
                
                <div class="insight-cards-grid">
                    <div class="insight-card core-nature">
                        <h4>本質的性格</h4>
                        <p>${this.enhancedInsights.coreNature}</p>
                    </div>
                    
                    <div class="insight-card hidden-potential">
                        <h4>隠れた可能性</h4>
                        <p>${this.enhancedInsights.hiddenPotential}</p>
                    </div>
                    
                    <div class="insight-card inner-balance">
                        <h4>内的バランス</h4>
                        <p>${this.enhancedInsights.innerBalance}</p>
                    </div>
                </div>
                
                ${this.renderKeywordCloud()}
                ${this.renderHexagramConnections()}
            </div>
        `;
    }

    /**
     * キーワードクラウドのレンダリング
     */
    renderKeywordCloud() {
        if (!this.enhancedInsights || !this.enhancedInsights.keywords) {
            return '';
        }

        const { keywords } = this.enhancedInsights;
        
        return `
            <div class="keyword-cloud-section">
                <h4>キーワード分析</h4>
                <div class="keyword-cloud">
                    <div class="keyword-group engine-keywords">
                        <h5>エンジンOS</h5>
                        <div class="keywords">
                            ${keywords.engine.map(keyword => 
                                `<span class="keyword engine">${keyword}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="keyword-group interface-keywords">
                        <h5>インターフェースOS</h5>
                        <div class="keywords">
                            ${keywords.interface.map(keyword => 
                                `<span class="keyword interface">${keyword}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="keyword-group safemode-keywords">
                        <h5>セーフモードOS</h5>
                        <div class="keywords">
                            ${keywords.safeMode.map(keyword => 
                                `<span class="keyword safemode">${keyword}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 易卦関連性のレンダリング
     */
    renderHexagramConnections() {
        if (!this.enhancedInsights || !this.enhancedInsights.connections) {
            return '';
        }

        const { connections } = this.enhancedInsights;
        
        return `
            <div class="hexagram-connections-section">
                <h4>易卦関連性分析</h4>
                <div class="hexagram-connection">
                    <div class="connection-item">
                        <span class="connection-label">エンジン ↔ インターフェース:</span>
                        <span class="connection-type">${connections.engineInterface}</span>
                    </div>
                    <div class="connection-item">
                        <span class="connection-label">エンジン ↔ セーフモード:</span>
                        <span class="connection-type">${connections.engineSafeMode}</span>
                    </div>
                    <div class="connection-item">
                        <span class="connection-label">インターフェース ↔ セーフモード:</span>
                        <span class="connection-type">${connections.interfaceSafeMode}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * インタラクティブ要素の初期化
     */
    initializeInteractiveElements() {
        // 成長ステップのアニメーション
        const growthSteps = document.querySelectorAll('.growth-step');
        growthSteps.forEach((step, index) => {
            step.style.animationDelay = `${index * 0.2}s`;
            step.classList.add('fade-in');
        });
        
        // ホバーエフェクト
        const insightCards = document.querySelectorAll('.insight-card');
        insightCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * イベントバインディング
     */
    bindEvents() {
        // 必要に応じてイベントリスナーを追加
    }

    /**
     * データ設定
     */
    setData(data) {
        this.analysisData = data;
    }

    /**
     * クリーンアップ
     */
    destroy() {
        super.destroy();
    }
}

// グローバルスコープに登録
window.InsightsTab = InsightsTab;