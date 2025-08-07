// Binary Tree Complete Display System
// HaQei哲学統合型8シナリオ分析表示

window.BinaryTreeCompleteDisplay = {
    // メイン表示関数
    display: function(result) {
        if (!result) {
            result = this.getDefaultResult();
        }

        // Chart.jsをロード
        this.loadChartJS(() => {
            this.renderCompleteAnalysis(result);
        });
    },

    // デフォルトデータ
    getDefaultResult: function() {
        return {
            currentLine: 248,
            finalEightPaths: [
                { pathIndex: 1, title: '継続・強化・維持路線', probability: 0.15, route: ['順行型', '統合的継続', '段階的強化'], description: '現在の方向性を着実に進める道' },
                { pathIndex: 2, title: '継続・強化・転換路線', probability: 0.12, route: ['順行型', '統合的継続', '部分的転換'], description: '基本路線を維持しつつ微調整する道' },
                { pathIndex: 3, title: '継続・転換・維持路線', probability: 0.13, route: ['順行型', '局所的転換', '現状維持'], description: '部分的な変更を加えながら進む道' },
                { pathIndex: 4, title: '継続・転換・革新路線', probability: 0.11, route: ['順行型', '局所的転換', '革新的変更'], description: '継続の中に革新を取り入れる道' },
                { pathIndex: 5, title: '転換・統合・修正路線', probability: 0.14, route: ['転換型', '統合的転換', '部分的修正'], description: '大きな転換を統合的に進める道' },
                { pathIndex: 6, title: '転換・統合・革新路線', probability: 0.13, route: ['転換型', '統合的転換', '全面的革新'], description: '根本的な転換と革新を目指す道' },
                { pathIndex: 7, title: '転換・段階・調整路線', probability: 0.12, route: ['転換型', '段階的転換', '慎重な調整'], description: '転換を段階的に慎重に進める道' },
                { pathIndex: 8, title: '転換・段階・加速路線', probability: 0.10, route: ['転換型', '段階的転換', '加速的実行'], description: '転換を加速度的に実現する道' }
            ]
        };
    },

    // Chart.jsローダー
    loadChartJS: function(callback) {
        if (window.Chart) {
            callback();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    },

    // 完全な分析結果を表示
    renderCompleteAnalysis: function(result) {
        const container = document.querySelector('.main-content') || 
                         document.querySelector('#results-container') ||
                         document.querySelector('#binary-tree-results');

        if (!container) {
            console.error('No container found for results');
            return;
        }

        // HTMLを生成
        container.innerHTML = this.generateHTML(result);

        // グラフを描画
        setTimeout(() => {
            this.renderChart(result);
        }, 100);

        // ダウンロード機能を設定
        this.setupDownload(result);
    },

    // HTML生成
    generateHTML: function(result) {
        const transformProb = result.finalEightPaths.slice(4, 8).reduce((sum, p) => sum + p.probability, 0);
        const continueProb = result.finalEightPaths.slice(0, 4).reduce((sum, p) => sum + p.probability, 0);
        const topPath = result.finalEightPaths.reduce((max, p) => p.probability > max.probability ? p : max);

        return `
            <div class="binary-tree-complete-analysis" style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; color: white; margin: 20px 0;">
                
                <!-- タイトル -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="font-size: 2em; margin-bottom: 10px;">🎯 Binary Tree 未来分析完了</h2>
                    <p style="font-size: 1.2em; opacity: 0.95;">8つの未来パスと統合的洞察を生成しました</p>
                </div>

                <!-- グラフセクション -->
                <div style="background: white; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="color: #4338ca; margin-bottom: 20px;">📊 未来シナリオ確率分布</h3>
                    <div style="height: 300px;">
                        <canvas id="futureChart"></canvas>
                    </div>
                </div>

                <!-- 8シナリオグリッド -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
                    ${result.finalEightPaths.map((path, i) => this.generatePathCard(path, i)).join('')}
                </div>

                <!-- HaQei統合分析 -->
                ${this.generateInsightSection(result, transformProb, continueProb, topPath)}

                <!-- アクションボタン -->
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="background: white; color: #4338ca; padding: 12px 30px; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin: 0 10px;">
                        📄 結果を印刷
                    </button>
                    <button onclick="window.downloadBinaryTreeResults()" style="background: white; color: #4338ca; padding: 12px 30px; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin: 0 10px;">
                        💾 データ保存
                    </button>
                </div>
            </div>
        `;
    },

    // パスカード生成
    generatePathCard: function(path, index) {
        const icons = ['🌱', '🌿', '🌳', '🎋', '🍀', '🌾', '🌲', '🎄'];
        return `
            <div style="background: rgba(255,255,255,0.95); border-radius: 12px; padding: 20px; color: #333;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 1.5em; margin-right: 10px;">${icons[index]}</span>
                    <span style="font-weight: bold;">パス${path.pathIndex}</span>
                </div>
                <div style="font-size: 1.1em; font-weight: 600; margin-bottom: 10px; color: #4338ca;">
                    ${path.title}
                </div>
                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 8px 12px; border-radius: 8px; margin-bottom: 10px;">
                    確率: ${(path.probability * 100).toFixed(0)}%
                </div>
                <div style="font-size: 0.9em; color: #666;">
                    ${path.description || ''}
                </div>
            </div>
        `;
    },

    // 洞察セクション生成
    generateInsightSection: function(result, transformProb, continueProb, topPath) {
        const tendency = transformProb > continueProb ? '転換型' : '継続型';
        
        return `
            <div style="background: rgba(255,255,255,0.98); border-radius: 16px; padding: 30px; color: #333;">
                <h3 style="color: #4338ca; margin-bottom: 25px;">🧘‍♂️ HaQei哲学による統合的洞察</h3>
                
                <!-- 未来展開パターン -->
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">📈 あなたの未来展開パターン</h4>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; line-height: 1.8;">
                        <p style="margin-bottom: 15px;">
                            <strong>主要傾向:</strong> 「${tendency}」の傾向が見られます（${tendency}系パス合計: ${((tendency === '転換型' ? transformProb : continueProb) * 100).toFixed(0)}%）。
                        </p>
                        <p style="margin-bottom: 15px;">
                            <strong>最高確率シナリオ:</strong> 「${topPath.title}」（${(topPath.probability * 100).toFixed(0)}%）
                        </p>
                        <p>
                            <strong>バランス指標:</strong> 継続${(continueProb * 100).toFixed(0)}% vs 転換${(transformProb * 100).toFixed(0)}%
                        </p>
                    </div>
                </div>

                <!-- 分人システム -->
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">🎭 分人システムによる行動指針</h4>
                    <div style="display: grid; gap: 15px;">
                        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); padding: 15px; border-radius: 10px;">
                            <strong>戦略的分人:</strong> 長期計画と重要決断時に活用
                        </div>
                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 15px; border-radius: 10px;">
                            <strong>適応的分人:</strong> 変化対応と創造的解決時に切替
                        </div>
                        <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 15px; border-radius: 10px;">
                            <strong>統合的分人:</strong> 全体最適と調和実現時に発動
                        </div>
                    </div>
                </div>

                <!-- 実践的アドバイス -->
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">🌟 実践的アドバイス</h4>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px;">
                        <ol style="line-height: 2; margin: 0; padding-left: 20px;">
                            <li><strong>短期（3ヶ月）:</strong> 現在の基盤強化と小規模実験</li>
                            <li><strong>中期（6ヶ月）:</strong> 実験評価と方向性決定</li>
                            <li><strong>長期（1年）:</strong> 選択道の成果検証と次段階準備</li>
                        </ol>
                    </div>
                </div>

                <!-- HaQei智慧 -->
                <div>
                    <h4 style="color: #6366f1; margin-bottom: 15px;">💡 HaQei智慧の結晶</h4>
                    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; border-radius: 12px; color: white; text-align: center; font-size: 1.1em; line-height: 1.6;">
                        「8つの道は全て正当。重要なのは選んだ道をどう歩むか」
                    </div>
                </div>
            </div>
        `;
    },

    // チャート描画
    renderChart: function(result) {
        const ctx = document.getElementById('futureChart');
        if (!ctx || !window.Chart) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: result.finalEightPaths.map(p => `パス${p.pathIndex}`),
                datasets: [{
                    label: '実現確率 (%)',
                    data: result.finalEightPaths.map(p => p.probability * 100),
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(250, 204, 21, 0.8)',
                        'rgba(14, 165, 233, 0.8)',
                        'rgba(99, 102, 241, 0.8)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const path = result.finalEightPaths[context.dataIndex];
                                return `${path.title}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    },

    // ダウンロード機能
    setupDownload: function(result) {
        window.downloadBinaryTreeResults = function() {
            const data = {
                timestamp: new Date().toISOString(),
                analysis: result,
                insights: {
                    generated: true,
                    version: '1.0.1-virtual-spiral'
                }
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `binary-tree-analysis-${Date.now()}.json`;
            a.click();
        };
    }
};

// 自動実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🌳 Binary Tree Complete Display System Ready');
    });
} else {
    console.log('🌳 Binary Tree Complete Display System Loaded');
}