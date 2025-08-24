class DetailedAnalysisTab extends BaseTabView {
    constructor() {
        super('detailed-analysis');
        this.analysisData = null;
        this.chart = null;
    }

    generateContent() {
        return `
            <div class="detailed-analysis-container">
                <!-- ヘッダー -->
                <div class="analysis-header">
                    <h2 class="analysis-title">
                        <span class="title-icon">☯</span>
                        易経視点による詳細分析
                    </h2>
                    <p class="analysis-subtitle">
                        八卦と三才の智慧で、あなたの3つのOSの本質と調和を探究します
                    </p>
                </div>

                <!-- バランスチャートセクション -->
                <div class="balance-chart-section">
                    <h3 class="section-title">
                        <span class="section-icon">📊</span>
                        OSバランスチャート
                    </h3>
                    <div class="chart-container">
                        <canvas id="balanceChart" width="400" height="400"></canvas>
                    </div>
                    <div class="balance-interpretation" id="balanceInterpretation">
                        <!-- バランス解釈がここに表示される -->
                    </div>
                </div>

                <!-- 相互作用分析セクション -->
                <div class="synergy-analysis-section">
                    <h3 class="section-title">
                        <span class="section-icon">🔄</span>
                        OS間の相互作用
                    </h3>
                    <div class="synergy-cards" id="synergyCards">
                        <!-- シナジーカードがここに表示される -->
                    </div>
                </div>

                <!-- 八卦視点分析セクション -->
                <div class="eight-trigrams-analysis-section">
                    <h3 class="section-title">
                        <span class="section-icon">☰</span>
                        八卦視点分析
                    </h3>
                    <div class="eight-trigrams-panel" id="eightTrigramsPanel">
                        <!-- 八卦パネルがここに表示される -->
                    </div>
                </div>

                <!-- 三才統合分析セクション -->
                <div class="three-powers-integration-section">
                    <h3 class="section-title">
                        <span class="section-icon">☰☷</span>
                        三才統合分析（天・人・地）
                    </h3>
                    <div class="three-powers-panel" id="threePowersPanel">
                        <!-- 三才統合パネルがここに表示される -->
                    </div>
                </div>
            </div>
        `;
    }

    setData(data) {
        this.analysisData = data;
        console.log('DetailedAnalysisTab: Data set', data);
        
        // タブがアクティブな場合は自動的に更新
        if (this.isActive && this.container) {
            this.updateContent();
        }
    }

    /**
     * コンテンツのレンダリング（BaseTabViewのオーバーライド）
     * タブが表示される時に自動的に呼ばれる
     */
    renderContent(container) {
        if (container) {
            // HTMLを生成して挿入
            container.innerHTML = this.generateContent();
            
            // HTMLが挿入された後、各種レンダリングを実行
            setTimeout(() => {
                if (this.analysisData) {
                    this.renderBalanceChart();
                    this.renderBalanceInterpretation();
                    this.renderSynergyAnalysis();
                    this.renderInteractionDetails();
                    this.renderEightTrigramsAnalysis();
                    this.renderThreePowersIntegration();
                    console.log('✅ DetailedAnalysisTab: All components rendered');
                }
            }, 100);
        }
    }

    /**
     * コンテンツの更新
     */
    updateContent() {
        // データが設定されていない場合は何もしない
        if (!this.analysisData) {
            console.warn('⚠️ DetailedAnalysisTab: No analysis data available');
            return;
        }

        // 各コンポーネントを更新
        this.renderBalanceChart();
        this.renderBalanceInterpretation();
        this.renderSynergyAnalysis();
        this.renderEightTrigramsAnalysis();
        this.renderThreePowersIntegration();
    }

    onActivate() {
        super.onActivate();
        console.log('DetailedAnalysisTab: Activated');
        
        // renderContentが既にレンダリングを行うため、
        // ここでは追加の処理のみ行う
        if (this.analysisData && this.chart) {
            // チャートが既に存在する場合は再描画
            this.chart.update();
        }
    }

    // レーダーチャート描画メソッド
    renderBalanceChart() {
        const canvas = document.getElementById('balanceChart');
        if (!canvas || !this.analysisData) return;

        // 既存のチャートがあれば破棄
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // データ準備
        const scores = [
            this.analysisData.engineOS.score,
            this.analysisData.interfaceOS.score,
            this.analysisData.safeModeOS.score
        ];

        // Chart.js設定
        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Engine OS\n(内的動機)',
                    'Interface OS\n(社会性)',
                    'Safe Mode OS\n(安定性)'
                ],
                datasets: [{
                    label: 'あなたのバランス',
                    data: scores,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                }, {
                    label: '理想的なバランス',
                    data: [75, 75, 75],
                    fill: true,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgba(34, 197, 94, 0.5)',
                    pointBackgroundColor: 'rgba(34, 197, 94, 0.5)',
                    pointBorderColor: '#fff',
                    borderWidth: 1,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.r + '点';
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 10
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    // バランス解釈の表示
    renderBalanceInterpretation() {
        const container = document.getElementById('balanceInterpretation');
        if (!container || !this.analysisData) return;

        const scores = [
            this.analysisData.engineOS.score,
            this.analysisData.interfaceOS.score,
            this.analysisData.safeModeOS.score
        ];

        const balanceType = this.determineBalanceType(scores);
        
        container.innerHTML = `
            <div class="balance-type-card ${balanceType.className}">
                <div class="balance-type-header">
                    <span class="balance-type-icon">${balanceType.icon}</span>
                    <h4 class="balance-type-title">${balanceType.title}</h4>
                </div>
                <p class="balance-type-description">${balanceType.description}</p>
                <div class="balance-metrics">
                    <div class="metric">
                        <span class="metric-label">バランス度</span>
                        <span class="metric-value">${balanceType.balanceScore}%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">最強OS</span>
                        <span class="metric-value">${balanceType.dominantOS}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">改善余地</span>
                        <span class="metric-value">${balanceType.improvementArea}</span>
                    </div>
                </div>
                <div class="balance-advice">
                    <p class="advice-label">💡 アドバイス</p>
                    <p class="advice-text">${balanceType.advice}</p>
                </div>
            </div>
        `;
    }

    determineBalanceType(scores) {
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const diff = max - min;
        const avg = scores.reduce((a, b) => a + b, 0) / 3;
        
        // 最強OSの特定
        const osNames = ['Engine OS（内的動機）', 'Interface OS（社会性）', 'Safe Mode OS（安定性）'];
        const maxIndex = scores.indexOf(max);
        const minIndex = scores.indexOf(min);
        
        if (diff < 10) {
            return {
                className: 'balanced',
                icon: '⚖️',
                title: '完全バランス型',
                description: '3つのOSが非常に調和した状態です。状況に応じて柔軟に対応できる理想的なバランスを保っています。',
                balanceScore: 95,
                dominantOS: 'なし（均等）',
                improvementArea: '現状維持',
                advice: 'このバランスを維持しながら、各OSをさらに高めていくことで、より高次元での調和が実現できます。'
            };
        } else if (diff < 20) {
            return {
                className: 'semi-balanced',
                icon: '🎯',
                title: `${osNames[maxIndex]}リード型`,
                description: `${osNames[maxIndex]}がやや優位ながら、全体的にバランスの取れた状態です。`,
                balanceScore: 75,
                dominantOS: osNames[maxIndex],
                improvementArea: osNames[minIndex],
                advice: `${osNames[minIndex]}を意識的に活用する機会を増やすことで、さらなるバランス改善が期待できます。`
            };
        } else {
            return {
                className: 'specialized',
                icon: '🚀',
                title: `${osNames[maxIndex]}特化型`,
                description: `${osNames[maxIndex]}が突出して強い、専門性の高い状態です。`,
                balanceScore: 50,
                dominantOS: osNames[maxIndex],
                improvementArea: osNames[minIndex],
                advice: `${osNames[minIndex]}の強化に注力することで、より安定した人格バランスを構築できます。`
            };
        }
    }

    // 相互作用分析の実装
    renderSynergyAnalysis() {
        const container = document.getElementById('synergyCards');
        if (!container || !this.analysisData) return;

        // TripleOSInteractionAnalyzerの詳細分析結果を取得
        const detailedAnalysis = this.getTripleOSInteractionAnalysis();
        
        let synergyHTML = '';
        
        // 基本的なシナジー分析
        const synergyPairs = [
            {
                pair: 'Engine × Interface',
                os1: this.analysisData.engineOS,
                os2: this.analysisData.interfaceOS,
                icon: '⚡🔄',
                title: '創造的コミュニケーション',
                description: '内的動機と社会性の融合'
            },
            {
                pair: 'Interface × Safe Mode',
                os1: this.analysisData.interfaceOS,
                os2: this.analysisData.safeModeOS,
                icon: '🔄🛡️',
                title: '安定的な関係構築',
                description: '社会性と安定性の調和'
            },
            {
                pair: 'Engine × Safe Mode',
                os1: this.analysisData.engineOS,
                os2: this.analysisData.safeModeOS,
                icon: '⚡🛡️',
                title: '持続可能な成長',
                description: '創造性と安定性のバランス'
            }
        ];

        synergyHTML += synergyPairs.map(synergy => {
            const synergyScore = this.calculateSynergyScore(synergy.os1.score, synergy.os2.score);
            const synergyLevel = this.getSynergyLevel(synergyScore);
            
            return `
                <div class="synergy-card">
                    <div class="synergy-header">
                        <span class="synergy-icon">${synergy.icon}</span>
                        <h4 class="synergy-title">${synergy.title}</h4>
                    </div>
                    <div class="synergy-pair-info">
                        <span class="pair-label">${synergy.pair}</span>
                        <span class="synergy-score ${synergyLevel.class}">${synergyScore}%</span>
                    </div>
                    <p class="synergy-description">${synergy.description}</p>
                    <div class="synergy-gauge">
                        <div class="gauge-fill" style="width: ${synergyScore}%; background: ${synergyLevel.color}"></div>
                    </div>
                    <p class="synergy-status">${synergyLevel.message}</p>
                    <div class="synergy-advice">
                        <p>${this.getSynergyAdvice(synergy.pair, synergyScore)}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        // TripleOSInteractionAnalyzerの詳細分析結果を追加
        const tripleOSAnalysis = this.getTripleOSInteractionAnalysis();
        if (tripleOSAnalysis) {
            synergyHTML += this.renderTripleOSInteractionDetails(tripleOSAnalysis);
        }

        container.innerHTML = synergyHTML;
    }

    calculateSynergyScore(score1, score2) {
        // 両方のスコアが高いほどシナジーが強い
        const avg = (score1 + score2) / 2;
        const diff = Math.abs(score1 - score2);
        
        // 差が小さいほどボーナス
        const balanceBonus = Math.max(0, 20 - diff);
        
        return Math.min(100, Math.round(avg + balanceBonus / 2));
    }

    getSynergyLevel(score) {
        if (score >= 80) {
            return {
                class: 'excellent',
                color: '#10B981',
                message: '✨ 優れたシナジー効果'
            };
        } else if (score >= 65) {
            return {
                class: 'good',
                color: '#3B82F6',
                message: '👍 良好なシナジー'
            };
        } else if (score >= 50) {
            return {
                class: 'moderate',
                color: '#F59E0B',
                message: '📈 成長の余地あり'
            };
        } else {
            return {
                class: 'weak',
                color: '#EF4444',
                message: '⚠️ 強化が必要'
            };
        }
    }

    getSynergyAdvice(pair, score) {
        const adviceMap = {
            'Engine × Interface': {
                high: 'あなたの創造性と社交性が見事に調和しています。革新的なアイデアを効果的に伝えることができます。',
                medium: 'アイデアを人に伝える練習をすることで、より大きな成果を生み出せます。',
                low: '内なる創造性を表現する方法を探してみましょう。小さなグループから始めることをお勧めします。'
            },
            'Interface × Safe Mode': {
                high: '人間関係において安定感と信頼感を与えることができます。長期的な関係構築が得意です。',
                medium: '人との関わりにおいて、もう少しリスクを取ってみても良いかもしれません。',
                low: '社交の場での安心感を高めるため、準備と練習を重視しましょう。'
            },
            'Engine × Safe Mode': {
                high: '革新性と安定性のバランスが取れており、持続可能な成長が可能です。',
                medium: '時には快適圏から出て新しいチャレンジをすることで、さらなる成長が期待できます。',
                low: '創造的な活動に安全な環境を作ることから始めてみましょう。'
            }
        };

        const level = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
        return adviceMap[pair][level];
    }

    // 八卦視点分析の実装
    renderEightTrigramsAnalysis() {
        const container = document.getElementById('eightTrigramsPanel');
        if (!container || !this.analysisData) return;

        // 八卦それぞれの視点から3つのOSを分析
        const eightTrigramsData = this.analyzeFromEightTrigrams();
        
        const trigramsHTML = `
            <div class="eight-trigrams-container">
                <div class="trigrams-grid">
                    ${eightTrigramsData.map(trigram => `
                        <div class="trigram-card ${trigram.prominence}">
                            <div class="trigram-header">
                                <span class="trigram-symbol">${trigram.symbol}</span>
                                <h4 class="trigram-name">${trigram.name}</h4>
                            </div>
                            <div class="trigram-element">
                                <span class="element-label">${trigram.element}</span>
                            </div>
                            <div class="trigram-analysis">
                                <h5>${trigram.aspectTitle}</h5>
                                <p class="analysis-text">${trigram.description}</p>
                            </div>
                            <div class="trigram-balance">
                                <div class="balance-indicator">
                                    <div class="indicator-fill" style="width: ${trigram.balanceLevel}%; background: ${trigram.color}"></div>
                                </div>
                                <span class="balance-text">${trigram.balanceText}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="trigrams-interpretation">
                    <h4>八卦からの洞察</h4>
                    <p class="interpretation-text">${this.getOverallTrigramsInterpretation(eightTrigramsData)}</p>
                </div>
            </div>
        `;

        container.innerHTML = trigramsHTML;
    }

    identifyStrengths() {
        const strengths = [];
        const data = this.analysisData;

        // 各OSのスコアに基づいて強みを特定
        if (data.engineOS.score >= 70) {
            strengths.push({
                icon: '🚀',
                title: '高い創造性',
                description: '独創的なアイデアと内的動機により、革新的な解決策を生み出せます'
            });
        }
        
        if (data.interfaceOS.score >= 70) {
            strengths.push({
                icon: '🤝',
                title: '優れた社交性',
                description: '人との関わりを大切にし、協力的な関係を構築できます'
            });
        }
        
        if (data.safeModeOS.score >= 70) {
            strengths.push({
                icon: '🏰',
                title: '安定した基盤',
                description: '慎重で計画的な行動により、着実な成果を生み出せます'
            });
        }

        // バランスが良い場合の強み
        const scores = [data.engineOS.score, data.interfaceOS.score, data.safeModeOS.score];
        if (Math.max(...scores) - Math.min(...scores) < 15) {
            strengths.push({
                icon: '⚖️',
                title: '優れたバランス感覚',
                description: '状況に応じて適切なOSを活用できる柔軟性があります'
            });
        }

        return strengths.slice(0, 3); // 最大3つまで表示
    }

    identifyChallenges() {
        const challenges = [];
        const data = this.analysisData;

        // 低スコアのOSを課題として特定
        if (data.engineOS.score < 60) {
            challenges.push({
                icon: '💡',
                title: '創造性の活性化',
                description: '新しいアイデアや独自の視点を育てる機会を増やしましょう'
            });
        }
        
        if (data.interfaceOS.score < 60) {
            challenges.push({
                icon: '👥',
                title: '社交スキルの向上',
                description: '人との繋がりを深め、コミュニケーション力を高めましょう'
            });
        }
        
        if (data.safeModeOS.score < 60) {
            challenges.push({
                icon: '🎯',
                title: '安定性の構築',
                description: '計画性と継続性を意識して、基盤を強化しましょう'
            });
        }

        return challenges.slice(0, 2); // 最大2つまで表示
    }

    assessPotential() {
        const totalScore = Math.round(
            (this.analysisData.engineOS.score + 
             this.analysisData.interfaceOS.score + 
             this.analysisData.safeModeOS.score) / 3
        );

        const badges = [];
        
        if (totalScore >= 75) {
            badges.push({
                icon: '🏆',
                label: 'ハイパフォーマー',
                class: 'gold'
            });
        }

        const scores = [
            this.analysisData.engineOS.score,
            this.analysisData.interfaceOS.score,
            this.analysisData.safeModeOS.score
        ];

        if (Math.max(...scores) - Math.min(...scores) < 10) {
            badges.push({
                icon: '🎯',
                label: 'バランスマスター',
                class: 'purple'
            });
        }

        if (Math.max(...scores) >= 85) {
            badges.push({
                icon: '⭐',
                label: 'スペシャリスト',
                class: 'blue'
            });
        }

        return {
            message: this.getPotentialMessage(totalScore),
            badges: badges
        };
    }

    getPotentialMessage(totalScore) {
        if (totalScore >= 80) {
            return 'あなたは非常に高いポテンシャルを持っています。現在の強みを活かしながら、さらなる高みを目指すことができます。リーダーシップを発揮する機会を積極的に求めてください。';
        } else if (totalScore >= 70) {
            return 'バランスの取れた能力を持っています。特定の分野に特化することで、専門性を高めることができるでしょう。自己成長への投資を続けてください。';
        } else if (totalScore >= 60) {
            return '成長の可能性が大いにあります。弱点を改善しながら、強みを伸ばすことで、大きな飛躍が期待できます。小さな成功体験を積み重ねていきましょう。';
        } else {
            return '基礎から着実に力をつけていく段階です。焦らず、一歩ずつ前進することで、必ず成長できます。サポートを求めることも大切です。';
        }
    }

    getScoreColor(score) {
        if (score >= 80) return '#10B981';
        if (score >= 70) return '#3B82F6';
        if (score >= 60) return '#F59E0B';
        return '#EF4444';
    }

    // 三才統合分析の実装
    renderThreePowersIntegration() {
        const container = document.getElementById('threePowersPanel');
        if (!container || !this.analysisData) return;

        // 天・人・地の三才の観点から分析
        const threePowersData = this.analyzeThreePowers();
        
        const threePowersHTML = `
            <div class="three-powers-container">
                <!-- 三才それぞれの分析 -->
                <div class="powers-analysis-grid">
                    ${threePowersData.powers.map(power => `
                        <div class="power-panel ${power.type}">
                            <div class="power-header">
                                <span class="power-symbol">${power.symbol}</span>
                                <h4 class="power-name">${power.name}</h4>
                                <span class="power-subtitle">${power.subtitle}</span>
                            </div>
                            <div class="power-score">
                                <div class="score-circle">
                                    <span class="score-value">${Math.round(power.score)}</span>
                                </div>
                            </div>
                            <div class="power-description">
                                <p>${power.description}</p>
                            </div>
                            <div class="power-characteristic">
                                <span class="characteristic-label">特性：</span>
                                <span class="characteristic-value">${power.characteristic}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- 三才の調和状態 -->
                <div class="harmony-analysis">
                    <h4 class="harmony-title">
                        <span class="harmony-icon">☯</span>
                        三才の調和状態
                    </h4>
                    <div class="harmony-content">
                        <div class="harmony-level ${threePowersData.harmonyLevel.className}">
                            <span class="harmony-indicator">${threePowersData.harmonyLevel.indicator}</span>
                            <span class="harmony-text">${threePowersData.harmonyLevel.description}</span>
                        </div>
                        <div class="sequence-path">
                            <h5>序卦伝による発展方向</h5>
                            <p class="sequence-description">${threePowersData.sequencePath}</p>
                        </div>
                        <div class="integration-insight">
                            <h5>統合の洞察</h5>
                            <p class="insight-text">${threePowersData.integration}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = threePowersHTML;
    }

    // 八卦視点分析のヘルパーメソッド
    analyzeFromEightTrigrams() {
        const engineScore = this.analysisData.engineOS.score;
        const interfaceScore = this.analysisData.interfaceOS.score;
        const safeModeScore = this.analysisData.safeModeOS.score;
        
        const trigrams = [
            {
                symbol: '☰',
                name: '乾（天）',
                element: '天の性質',
                aspectTitle: '創造的推進力',
                description: this.getTrigramAnalysis('qian', engineScore, 'engine'),
                balanceLevel: this.calculateTrigramBalance('qian', engineScore),
                balanceText: this.getTrigramBalanceText(engineScore),
                prominence: this.getTrigramProminence(engineScore),
                color: this.getTrigramColor('qian')
            },
            {
                symbol: '☷',
                name: '坤（地）',
                element: '地の性質',
                aspectTitle: '受容と育成',
                description: this.getTrigramAnalysis('kun', safeModeScore, 'safe'),
                balanceLevel: this.calculateTrigramBalance('kun', safeModeScore),
                balanceText: this.getTrigramBalanceText(safeModeScore),
                prominence: this.getTrigramProminence(safeModeScore),
                color: this.getTrigramColor('kun')
            },
            {
                symbol: '☳',
                name: '震（雷）',
                element: '雷の性質',
                aspectTitle: '行動と変革',
                description: this.getTrigramAnalysis('zhen', engineScore, 'action'),
                balanceLevel: this.calculateTrigramBalance('zhen', engineScore),
                balanceText: this.getTrigramBalanceText(engineScore),
                prominence: this.getTrigramProminence(engineScore),
                color: this.getTrigramColor('zhen')
            },
            {
                symbol: '☴',
                name: '巽（風）',
                element: '風の性質',
                aspectTitle: '適応と浸透',
                description: this.getTrigramAnalysis('xun', interfaceScore, 'adaptation'),
                balanceLevel: this.calculateTrigramBalance('xun', interfaceScore),
                balanceText: this.getTrigramBalanceText(interfaceScore),
                prominence: this.getTrigramProminence(interfaceScore),
                color: this.getTrigramColor('xun')
            },
            {
                symbol: '☵',
                name: '坎（水）',
                element: '水の性質',
                aspectTitle: '困難への対応',
                description: this.getTrigramAnalysis('kan', safeModeScore, 'protection'),
                balanceLevel: this.calculateTrigramBalance('kan', safeModeScore),
                balanceText: this.getTrigramBalanceText(safeModeScore),
                prominence: this.getTrigramProminence(safeModeScore),
                color: this.getTrigramColor('kan')
            },
            {
                symbol: '☲',
                name: '離（火）',
                element: '火の性質',
                aspectTitle: '明晰と表現',
                description: this.getTrigramAnalysis('li', interfaceScore, 'expression'),
                balanceLevel: this.calculateTrigramBalance('li', interfaceScore),
                balanceText: this.getTrigramBalanceText(interfaceScore),
                prominence: this.getTrigramProminence(interfaceScore),
                color: this.getTrigramColor('li')
            },
            {
                symbol: '☶',
                name: '艮（山）',
                element: '山の性質',
                aspectTitle: '静止と内省',
                description: this.getTrigramAnalysis('gen', safeModeScore, 'stability'),
                balanceLevel: this.calculateTrigramBalance('gen', safeModeScore),
                balanceText: this.getTrigramBalanceText(safeModeScore),
                prominence: this.getTrigramProminence(safeModeScore),
                color: this.getTrigramColor('gen')
            },
            {
                symbol: '☱',
                name: '兌（沢）',
                element: '沢の性質',
                aspectTitle: '喜びと調和',
                description: this.getTrigramAnalysis('dui', interfaceScore, 'harmony'),
                balanceLevel: this.calculateTrigramBalance('dui', interfaceScore),
                balanceText: this.getTrigramBalanceText(interfaceScore),
                prominence: this.getTrigramProminence(interfaceScore),
                color: this.getTrigramColor('dui')
            }
        ];
        
        return trigrams;
    }

    // 三才統合分析のヘルパーメソッド
    analyzeThreePowers() {
        const engineScore = this.analysisData.engineOS.score;
        const interfaceScore = this.analysisData.interfaceOS.score;
        const safeModeScore = this.analysisData.safeModeOS.score;
        
        const powers = [
            {
                type: 'heaven',
                symbol: '☰',
                name: '天',
                subtitle: 'Engine OS（創造的意志）',
                score: engineScore,
                description: this.getThreePowerDescription('heaven', engineScore),
                characteristic: this.getThreePowerCharacteristic('heaven', engineScore)
            },
            {
                type: 'human',
                symbol: '☯',
                name: '人',
                subtitle: 'Interface OS（実現する力）',
                score: interfaceScore,
                description: this.getThreePowerDescription('human', interfaceScore),
                characteristic: this.getThreePowerCharacteristic('human', interfaceScore)
            },
            {
                type: 'earth',
                symbol: '☷',
                name: '地',
                subtitle: 'Safe Mode OS（支える基盤）',
                score: safeModeScore,
                description: this.getThreePowerDescription('earth', safeModeScore),
                characteristic: this.getThreePowerCharacteristic('earth', safeModeScore)
            }
        ];
        
        const harmonyLevel = this.calculateHarmonyLevel(engineScore, interfaceScore, safeModeScore);
        const sequencePath = this.getSequencePath(powers);
        const integration = this.getIntegrationInsight(powers, harmonyLevel);
        
        return {
            powers,
            harmonyLevel,
            sequencePath,
            integration
        };
    }

    // 八卦分析の詳細ヘルパーメソッド
    getTrigramAnalysis(trigram, score, aspect) {
        const analysisMap = {
            'qian': {
                engine: `創造的エネルギーの強さ: ${score}点。純粋な推進力と決断力を表します。`,
                action: `変革への意志: 乾の強さで新しい道を切り開く力があります。`
            },
            'kun': {
                safe: `受容と包容の力: ${score}点。安定した基盤を提供する土台の強さです。`,
                stability: `堅実な基盤: 坤の性質で着実に成長を支える力があります。`
            },
            'zhen': {
                action: `行動力と変革力: ${score}点。雷のような瞬発力で新しい展開を生み出します。`
            },
            'xun': {
                adaptation: `適応力と浸透力: ${score}点。風のように柔軟に環境に適応する力です。`
            },
            'kan': {
                protection: `困難への対応力: ${score}点。水のように障害を乗り越える粘り強さです。`
            },
            'li': {
                expression: `明晰性と表現力: ${score}点。火のような明るい表現で人を照らす力です。`
            },
            'gen': {
                stability: `静止と内省の力: ${score}点。山のような不動の安定性を持ちます。`
            },
            'dui': {
                harmony: `喜びと調和力: ${score}点。沢のような穏やかな人間関係を築く力です。`
            }
        };
        
        return analysisMap[trigram]?.[aspect] || `${trigram}の${aspect}的側面: ${score}点`;
    }

    calculateTrigramBalance(trigram, score) {
        return Math.min(100, score + 10);
    }

    getTrigramProminence(score) {
        if (score >= 80) return 'high-prominence';
        if (score >= 65) return 'medium-prominence';
        return 'low-prominence';
    }

    getTrigramColor(trigram) {
        const colorMap = {
            'qian': '#FFD700',  // 金色（天）
            'kun': '#8B4513',   // 茶色（地）
            'zhen': '#FF4500',  // 赤橙（雷）
            'xun': '#32CD32',   // 緑（風）
            'kan': '#1E90FF',   // 青（水）
            'li': '#FF6347',    // 赤（火）
            'gen': '#654321',   // 褐色（山）
            'dui': '#87CEEB'    // 空色（沢）
        };
        return colorMap[trigram] || '#808080';
    }

    getTrigramBalanceText(score) {
        if (score >= 80) return '非常に強い';
        if (score >= 65) return '強い';
        if (score >= 50) return '中程度';
        if (score >= 35) return '弱い';
        return '潜在的';
    }

    getOverallTrigramsInterpretation(trigrams) {
        const highTrigrams = trigrams.filter(t => t.prominence === 'high-prominence');
        if (highTrigrams.length >= 3) {
            return '八卦の多くの側面で高いエネルギーを示しており、バランスの取れた統合的な人格を持っています。';
        } else if (highTrigrams.length >= 1) {
            return `特に${highTrigrams.map(t => t.name).join('、')}の性質が強く現れており、これらを中心とした個性が形成されています。`;
        } else {
            return '各八卦の要素が穏やかに調和しており、安定した性格基盤を持っています。';
        }
    }

    // 三才分析の詳細ヘルパーメソッド
    getThreePowerDescription(power, score) {
        const descriptions = {
            'heaven': {
                high: '創造的意志が非常に強く、新しいアイデアや方向性を生み出す力に満ちています。',
                medium: '適度な創造性を持ち、状況に応じてアイデアを発揮できます。',
                low: '創造的側面は控えめですが、着実に自分の道を歩む力があります。'
            },
            'human': {
                high: '人と社会をつなぐ実現力が高く、アイデアを形にする優れた能力があります。',
                medium: 'バランスの取れた社会性で、適切に人との関係を築けます。',
                low: '内向的な傾向がありますが、深い関係性を大切にします。'
            },
            'earth': {
                high: '非常に安定した基盤を持ち、継続的な成長を支える力があります。',
                medium: '適度な安定性で、変化と安定のバランスを保てます。',
                low: '変化に対して柔軟ですが、時には基盤の強化が必要です。'
            }
        };
        
        const level = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low';
        return descriptions[power][level];
    }

    getThreePowerCharacteristic(power, score) {
        const characteristics = {
            'heaven': score >= 75 ? '創造者・先駆者' : score >= 55 ? '発想豊か' : '堅実思考',
            'human': score >= 75 ? '優れた調整者' : score >= 55 ? '良きコミュニケーター' : '深い関係重視',
            'earth': score >= 75 ? '安定の基盤' : score >= 55 ? 'バランス型' : '柔軟適応'
        };
        return characteristics[power];
    }

    calculateHarmonyLevel(heaven, human, earth) {
        const scores = [heaven, human, earth];
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const diff = max - min;
        const avg = scores.reduce((a, b) => a + b, 0) / 3;
        
        if (diff < 10 && avg >= 70) {
            return {
                className: 'perfect-harmony',
                indicator: '⚡',
                description: '天・人・地が完璧に調和した理想的な状態です。'
            };
        } else if (diff < 15) {
            return {
                className: 'good-harmony',
                indicator: '⭐',
                description: '三才がよく調和しており、安定した統合状態にあります。'
            };
        } else if (diff < 25) {
            return {
                className: 'developing-harmony',
                indicator: '🌟',
                description: '調和に向けて発展している状態です。'
            };
        } else {
            return {
                className: 'seeking-harmony',
                indicator: '🌱',
                description: '調和を求める成長段階にあります。'
            };
        }
    }

    getSequencePath(powers) {
        const dominant = powers.reduce((max, power) => power.score > max.score ? power : max);
        const sequenceMap = {
            'heaven': '乾から始まる創造の序列。純粋な創造エネルギーから具体的な形へと発展していく道筋です。',
            'human': '人の道から始まる調和の序列。社会性を中心として天地を結ぶ発展の道筋です。',
            'earth': '坤から始まる受容の序列。安定した基盤から徐々に拡張していく発展の道筋です。'
        };
        return sequenceMap[dominant.type];
    }

    getIntegrationInsight(powers, harmonyLevel) {
        const totalScore = powers.reduce((sum, power) => sum + power.score, 0) / 3;
        
        if (harmonyLevel.className === 'perfect-harmony') {
            return '三才の完璧な調和により、64卦のあらゆる変化パターンに対応できる統合的な分業パフォーマンスを実現できます。';
        } else if (totalScore >= 70) {
            return '高いレベルでの三才統合により、多様な状況に適応できる分業パフォーマンスの基盤が形成されています。';
        } else {
            return '三才の調和を深めることで、より効果的な分業パフォーマンスの発揮が期待できます。';
        }
    }

    // データドリブン分析のヘルパーメソッド
    
    /**
     * 傾向分析（BasicResultsTabと同じロジック）
     */
    analyzeTendencies(osData, userAnswers) {
        const keywords = this.extractHexagramKeywords(osData);
        const level = this.determineTendencyLevel(osData.score);
        const patterns = this.extractAnswerPatterns(userAnswers, osData.type);
        const hexagramMeaning = this.getHexagramCoreMeaning(osData.hexagram?.name);
        
        return {
            keywords,
            level,
            patterns,
            hexagramMeaning
        };
    }
    
    /**
     * 統合的なパターンを分析
     */
    analyzeIntegratedPattern(engineTendency, interfaceTendency, safeModeTendency) {
        const pattern = {
            description: '',
            behaviors: [],
            strengths: [],
            balance: {}
        };
        
        // スコアのバランスを分析
        const scores = [
            this.analysisData.engineOS.score,
            this.analysisData.interfaceOS.score,
            this.analysisData.safeModeOS.score
        ];
        
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const diff = maxScore - minScore;
        
        // バランスタイプを判定
        if (diff < 10) {
            pattern.description = '内面・社会性・安定性が均等に発達したバランス型。状況に応じて適切な面を発揮できます。';
            pattern.behaviors.push('状況に応じて柔軟に対応を変える');
            pattern.behaviors.push('多面的な視点から物事を捉える');
        } else if (diff < 20) {
            const dominantIndex = scores.indexOf(maxScore);
            const dominantName = ['内的動機', '社会性', '安定性'][dominantIndex];
            pattern.description = `${dominantName}がやや強く現れる傾向があります。この特性を軸に他の面も活用しています。`;
            pattern.behaviors.push(`${dominantName}を重視した判断をする`);
            pattern.behaviors.push('特定の強みを活かしつつバランスを保つ');
        } else {
            const dominantIndex = scores.indexOf(maxScore);
            const dominantName = ['内的動機', '社会性', '安定性'][dominantIndex];
            pattern.description = `${dominantName}が顕著に強い特化型。この分野での専門性が高く発達しています。`;
            pattern.behaviors.push(`${dominantName}を中心とした行動パターン`);
            pattern.behaviors.push('得意分野での深い専門性を発揮');
        }
        
        // 強みを抽出
        pattern.strengths = this.extractIntegratedStrengths(engineTendency, interfaceTendency, safeModeTendency);
        
        return pattern;
    }
    
    /**
     * 統合的な強みを抽出
     */
    extractIntegratedStrengths(engineTendency, interfaceTendency, safeModeTendency) {
        const strengths = [];
        
        // 各OSの上位キーワードから強みを抽出
        if (engineTendency.keywords.length > 0) {
            strengths.push({
                icon: '🚀',
                text: `創造性: ${engineTendency.keywords.slice(0, 2).join('・')}`
            });
        }
        
        if (interfaceTendency.keywords.length > 0) {
            strengths.push({
                icon: '🤝',
                text: `社会性: ${interfaceTendency.keywords.slice(0, 2).join('・')}`
            });
        }
        
        if (safeModeTendency.keywords.length > 0) {
            strengths.push({
                icon: '🛡️',
                text: `安定性: ${safeModeTendency.keywords.slice(0, 2).join('・')}`
            });
        }
        
        return strengths.slice(0, 3);
    }
    
    /**
     * 相互作用の可視化
     */
    renderInteractionVisualization(pattern) {
        const scores = [
            this.analysisData.engineOS.score,
            this.analysisData.interfaceOS.score,
            this.analysisData.safeModeOS.score
        ];
        
        return `
            <div class="interaction-bars">
                <div class="interaction-bar">
                    <span class="bar-label">内的動機</span>
                    <div class="bar-fill" style="width: ${scores[0]}%"></div>
                    <span class="bar-value">${Math.round(scores[0])}</span>
                </div>
                <div class="interaction-bar">
                    <span class="bar-label">社会性</span>
                    <div class="bar-fill" style="width: ${scores[1]}%"></div>
                    <span class="bar-value">${Math.round(scores[1])}</span>
                </div>
                <div class="interaction-bar">
                    <span class="bar-label">安定性</span>
                    <div class="bar-fill" style="width: ${scores[2]}%"></div>
                    <span class="bar-value">${Math.round(scores[2])}</span>
                </div>
            </div>
        `;
    }
    
    // BasicResultsTabと共通のヘルパーメソッド
    extractHexagramKeywords(osData) {
        if (!osData.hexagram || !this.hexagramExtractor) return [];
        
        const hexagramData = this.hexagramExtractor.getHexagramDataByName(osData.hexagram.name);
        if (!hexagramData || hexagramData.length === 0) return [];
        
        const keywords = [];
        hexagramData.forEach(yao => {
            if (yao['キーワード']) {
                const yaokeywords = yao['キーワード'].split(',').map(k => k.trim());
                keywords.push(...yaokeywords);
            }
        });
        
        const keywordCount = {};
        keywords.forEach(keyword => {
            keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        });
        
        return Object.entries(keywordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([keyword]) => keyword);
    }
    
    determineTendencyLevel(score) {
        if (score >= 85) {
            return {
                intensity: '非常に強い',
                description: 'この特性が人格の中核を形成しています'
            };
        } else if (score >= 70) {
            return {
                intensity: '強い',
                description: 'この特性が明確に現れています'
            };
        } else if (score >= 55) {
            return {
                intensity: '中程度',
                description: 'この特性が適度に発揮されています'
            };
        } else if (score >= 40) {
            return {
                intensity: '弱い',
                description: 'この特性は控えめに現れています'
            };
        } else {
            return {
                intensity: '潜在的',
                description: 'この特性は潜在的に存在しています'
            };
        }
    }
    
    extractAnswerPatterns(userAnswers, osType) {
        if (!userAnswers || userAnswers.length === 0) return [];
        
        const patterns = [];
        const relevantAnswers = this.getRelevantAnswers(userAnswers, osType);
        
        switch(osType) {
            case 'engineOS':
                patterns.push(...this.analyzeEnginePatterns(relevantAnswers));
                break;
            case 'interfaceOS':
                patterns.push(...this.analyzeInterfacePatterns(relevantAnswers));
                break;
            case 'safeModeOS':
                patterns.push(...this.analyzeSafeModePatterns(relevantAnswers));
                break;
        }
        
        return patterns.slice(0, 3);
    }
    
    getRelevantAnswers(userAnswers, osType) {
        const indices = {
            'engineOS': [0, 3, 6, 9, 12, 15],
            'interfaceOS': [1, 4, 7, 10, 13, 16],
            'safeModeOS': [2, 5, 8, 11, 14, 17]
        };
        
        return (indices[osType] || []).map(i => userAnswers[i]).filter(Boolean);
    }
    
    analyzeEnginePatterns(answers) {
        const patterns = [];
        const highScores = answers.filter(a => a.score >= 4);
        const lowScores = answers.filter(a => a.score <= 2);
        
        if (highScores.length >= 4) {
            patterns.push('新しいアイデアを積極的に生み出す');
            patterns.push('創造的な解決策を好む');
        }
        if (lowScores.length >= 4) {
            patterns.push('既存の方法を重視する');
            patterns.push('安定した手法を選択する');
        }
        
        return patterns;
    }
    
    analyzeInterfacePatterns(answers) {
        const patterns = [];
        const highScores = answers.filter(a => a.score >= 4);
        const lowScores = answers.filter(a => a.score <= 2);
        
        if (highScores.length >= 4) {
            patterns.push('積極的にコミュニケーションを取る');
            patterns.push('チームワークを重視する');
        }
        if (lowScores.length >= 4) {
            patterns.push('独立した作業を好む');
            patterns.push('深く集中して取り組む');
        }
        
        return patterns;
    }
    
    analyzeSafeModePatterns(answers) {
        const patterns = [];
        const highScores = answers.filter(a => a.score >= 4);
        const lowScores = answers.filter(a => a.score <= 2);
        
        if (highScores.length >= 4) {
            patterns.push('慎重に計画を立てる');
            patterns.push('リスクを事前に評価する');
        }
        if (lowScores.length >= 4) {
            patterns.push('直感的に行動する');
            patterns.push('柔軟に対応を変える');
        }
        
        return patterns;
    }
    
    getHexagramCoreMeaning(hexagramName) {
        const meanings = {
            '乾為天': '強い推進力と決断力',
        '坤為地': '受容性と包容力',
            '水雷屯': '困難を乗り越える粘り強さ',
            '山水蒙': '学習と成長への意欲',
            '水天需': '適切なタイミングを見極める力',
            '天水訟': '論理的思考と公正さ',
            '地水师': '組織力と統率力',
            '水地比': '協調性と親和性',
            '風天小畜': '着実な積み重ね',
            '天泽履': '礼節と社会性'
        };
        
        return meanings[hexagramName] || '独自の個性';
    }
    
    // デバッグ用メソッド
    debugDataDriven() {
        console.log('=== Data-Driven Analysis Debug ===');
        console.log('Analysis Data:', this.analysisData);
        if (this.analysisData) {
            const userAnswers = this.storageManager?.getAnswers() || [];
            console.log('User Answers:', userAnswers);
            console.log('Engine Tendency:', this.analyzeTendencies(this.analysisData.engineOS, userAnswers));
            console.log('Interface Tendency:', this.analyzeTendencies(this.analysisData.interfaceOS, userAnswers));
            console.log('SafeMode Tendency:', this.analyzeTendencies(this.analysisData.safeModeOS, userAnswers));
        }
    }
    
    /**
     * TripleOSInteractionAnalyzerの分析結果を取得
     */
    getTripleOSInteractionAnalysis() {
        try {
            // TripleOSInteractionAnalyzerが利用可能かチェック
            if (!window.TripleOSInteractionAnalyzer) {
                console.warn('TripleOSInteractionAnalyzer not available');
                return null;
            }
            
            const analyzer = new window.TripleOSInteractionAnalyzer();
            
            // 分析データからOS情報を構築
            const engineOS = {
                hexagramId: this.analysisData.engineOS.hexagramId || 1,
                name: this.analysisData.engineOS.name || '乾為天',
                score: this.analysisData.engineOS.score || 0.5
            };
            
            const interfaceOS = {
                hexagramId: this.analysisData.interfaceOS.hexagramId || 2,
                name: this.analysisData.interfaceOS.name || '坤為地',
                score: this.analysisData.interfaceOS.score || 0.5
            };
            
            const safeModeOS = {
                hexagramId: this.analysisData.safeModeOS.hexagramId || 29,
                name: this.analysisData.safeModeOS.name || '坎為水',
                score: this.analysisData.safeModeOS.score || 0.5
            };
            
            // 詳細分析を実行
            const result = analyzer.analyze(engineOS, interfaceOS, safeModeOS);
            console.log('🔮 TripleOSInteractionAnalyzer result:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Error in TripleOSInteractionAnalysis:', error);
            return null;
        }
    }
    
    /**
     * TripleOSInteractionAnalyzerの詳細分析結果を表示
     */
    renderTripleOSInteractionDetails(analysis) {
        if (!analysis) return '';
        
        let html = `
            <div class="triple-os-interaction-details">
                <div class="interaction-header">
                    <h4 class="interaction-title">
                        <span class="interaction-icon">🔮</span>
                        高度な相互作用分析
                    </h4>
                    <p class="interaction-subtitle">TripleOSInteractionAnalyzer による詳細分析結果</p>
                </div>
        `;
        
        // シナジーマトリックス表示
        if (analysis.synergy) {
            html += this.renderSynergyMatrix(analysis.synergy);
        }
        
        // 相互作用の詳細表示
        if (analysis.interactions) {
            html += this.renderInteractionInsights(analysis.interactions);
        }
        
        // 強みとリスクの表示
        if (analysis.strengths || analysis.risks) {
            html += this.renderStrengthsAndRisks(analysis.strengths, analysis.risks);
        }
        
        html += `</div>`;
        
        return html;
    }
    
    /**
     * シナジーマトリックスの表示
     */
    renderSynergyMatrix(synergy) {
        if (!synergy || !Array.isArray(synergy)) return '';
        
        return `
            <div class="synergy-matrix-section">
                <h5 class="matrix-title">相互作用強度マトリックス</h5>
                <div class="synergy-matrix">
                    <div class="matrix-grid">
                        <div class="matrix-cell header"></div>
                        <div class="matrix-cell header">Engine</div>
                        <div class="matrix-cell header">Interface</div>
                        <div class="matrix-cell header">SafeMode</div>
                        
                        <div class="matrix-cell header">Engine</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[0]?.[0])}</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[0]?.[1])}</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[0]?.[2])}</div>
                        
                        <div class="matrix-cell header">Interface</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[1]?.[0])}</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[1]?.[1])}</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[1]?.[2])}</div>
                        
                        <div class="matrix-cell header">SafeMode</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[2]?.[0])}</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[2]?.[1])}</div>
                        <div class="matrix-cell value">${this.formatSynergyValue(synergy[2]?.[2])}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 相互作用の洞察表示
     */
    renderInteractionInsights(interactions) {
        if (!interactions) return '';
        
        let html = `
            <div class="interaction-insights-section">
                <h5 class="insights-title">相互作用の洞察</h5>
        `;
        
        // ペア分析の表示
        if (interactions.pair_insights && Array.isArray(interactions.pair_insights)) {
            html += `
                <div class="pair-insights">
                    <h6>ペア分析</h6>
                    ${interactions.pair_insights.map(insight => `
                        <div class="insight-item">
                            <strong>${insight.pair || 'Unknown Pair'}:</strong>
                            <p>${insight.description || insight.insight || 'No description available'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // アフォーダンスの表示
        if (interactions.affordances && Array.isArray(interactions.affordances)) {
            html += `
                <div class="affordances">
                    <h6>可能性とアフォーダンス</h6>
                    <ul>
                        ${interactions.affordances.map(affordance => `
                            <li>${affordance}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        // 内的葛藤の表示
        if (interactions.inner_conflicts && Array.isArray(interactions.inner_conflicts)) {
            html += `
                <div class="inner-conflicts">
                    <h6>内的葛藤と調整点</h6>
                    <ul>
                        ${interactions.inner_conflicts.map(conflict => `
                            <li>${conflict}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        // 統合ヒントの表示
        if (interactions.integration_prompts && Array.isArray(interactions.integration_prompts)) {
            html += `
                <div class="integration-prompts">
                    <h6>統合のヒント</h6>
                    <ul>
                        ${interactions.integration_prompts.map(prompt => `
                            <li>${prompt}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        html += `</div>`;
        
        return html;
    }
    
    /**
     * 強みとリスクの表示
     */
    renderStrengthsAndRisks(strengths, risks) {
        let html = `
            <div class="strengths-risks-section">
                <div class="strengths-risks-grid">
        `;
        
        // 強みの表示
        if (strengths && Array.isArray(strengths)) {
            html += `
                <div class="strengths-panel">
                    <h6 class="panel-title">
                        <span class="panel-icon">💪</span>
                        特定された強み
                    </h6>
                    <ul class="strengths-list">
                        ${strengths.map(strength => `
                            <li class="strength-item">${strength}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        // リスクの表示
        if (risks && Array.isArray(risks)) {
            html += `
                <div class="risks-panel">
                    <h6 class="panel-title">
                        <span class="panel-icon">⚠️</span>
                        注意すべきリスク
                    </h6>
                    <ul class="risks-list">
                        ${risks.map(risk => `
                            <li class="risk-item">${risk}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * シナジー値のフォーマット
     */
    formatSynergyValue(value) {
        if (typeof value !== 'number') return '-';
        return (value * 100).toFixed(1) + '%';
    }

    /**
     * 3つの側面の相互作用詳細を表示
     */
    renderInteractionDetails() {
        try {
            if (!window.TripleOSInteractionAnalyzer) {
                console.warn('TripleOSInteractionAnalyzer not available');
                return;
            }
            
            const analyzer = new TripleOSInteractionAnalyzer();
            const result = analyzer.analyze(
                this.analysisData.engineOS,
                this.analysisData.interfaceOS,
                this.analysisData.safeModeOS
            );
            
            // resultの構造をログに出力してデバッグ
            console.log('TripleOSInteractionAnalyzer result:', result);
            
            // synergyプロパティが存在しない場合は、計算する
            let synergyData = result?.synergy;
            if (!synergyData) {
                // データが存在しない場合は、スコアから計算
                const engineScore = this.analysisData.engineOS?.score || 0;
                const interfaceScore = this.analysisData.interfaceOS?.score || 0;
                const safeModeScore = this.analysisData.safeModeOS?.score || 0;
                
                synergyData = {
                    engine_interface: this.calculateSynergyScore(engineScore, interfaceScore) / 100,
                    engine_safe: this.calculateSynergyScore(engineScore, safeModeScore) / 100,
                    interface_safe: this.calculateSynergyScore(interfaceScore, safeModeScore) / 100
                };
                console.log('Calculated synergy data:', synergyData);
            }
            
            const container = document.querySelector('.synergy-analysis-section');
            if (!container) {
                console.warn('Synergy analysis section container not found');
                return;
            }
            
            const interactionHtml = `
                <div class="interaction-details-section" style="margin:30px 0;padding:25px;background:#f0f9ff;border-radius:16px;">
                    <h3>🔄 3つの側面の相互作用</h3>
                    <div class="synergy-grid" style="display:grid;gap:20px;margin:20px 0;">
                        <div class="synergy-item" style="display:flex;align-items:center;gap:15px;">
                            <span>内的動機×社会性</span>
                            <div style="flex:1;height:24px;background:#e0f2fe;border-radius:12px;overflow:hidden;">
                                <div style="width:${(synergyData.engine_interface || 0) * 100}%;height:100%;background:linear-gradient(90deg,#0ea5e9,#0284c7);"></div>
                            </div>
                            <span>${Math.round((synergyData.engine_interface || 0) * 100)}%</span>
                        </div>
                        <div class="synergy-item" style="display:flex;align-items:center;gap:15px;">
                            <span>内的動機×安定性</span>
                            <div style="flex:1;height:24px;background:#e0f2fe;border-radius:12px;overflow:hidden;">
                                <div style="width:${(synergyData.engine_safe || 0) * 100}%;height:100%;background:linear-gradient(90deg,#0ea5e9,#0284c7);"></div>
                            </div>
                            <span>${Math.round((synergyData.engine_safe || 0) * 100)}%</span>
                        </div>
                        <div class="synergy-item" style="display:flex;align-items:center;gap:15px;">
                            <span>社会性×安定性</span>
                            <div style="flex:1;height:24px;background:#e0f2fe;border-radius:12px;overflow:hidden;">
                                <div style="width:${(synergyData.interface_safe || 0) * 100}%;height:100%;background:linear-gradient(90deg,#0ea5e9,#0284c7);"></div>
                            </div>
                            <span>${Math.round((synergyData.interface_safe || 0) * 100)}%</span>
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', interactionHtml);
        } catch (error) {
            console.error('Error in renderInteractionDetails:', error);
        }
    }
}