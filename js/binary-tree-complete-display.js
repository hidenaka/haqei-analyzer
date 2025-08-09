// Binary Tree Complete Display System v2.1
// 分岐型折れ線グラフ実装 + H384データベース統合
// HaQei哲学統合システム

window.BinaryTreeCompleteDisplay = {
    // メイン表示関数
    display: function(result) {
        console.log('🌳 Binary Tree Complete Display v2.1 開始');
        
        if (!result) {
            result = this.generateDefaultResultWithH384Data();
        }

        // Chart.js読み込み
        this.loadChartJS(() => {
            this.renderCompleteAnalysis(result);
        });
    },

    // H384データベースから実際の数値を使用してデフォルト結果生成
    generateDefaultResultWithH384Data: function() {
        // H384_DATAから実際の数値を取得
        let lineData = null;
        const defaultLine = 248; // デフォルトの通し番号
        
        if (window.H384_DATA && window.H384_DATA.length > 0) {
            // 実際のH384データからラインデータを取得
            lineData = window.H384_DATA.find(item => item.通し番号 === defaultLine) || window.H384_DATA[247];
        }

        // 実際のデータから確率を計算
        const baseValues = lineData ? {
            // 各爻からの次ステップ確率を計算
            継続強化: this.calculateProbabilityFromLine(lineData, 'continue_strong'),
            継続調整: this.calculateProbabilityFromLine(lineData, 'continue_transform'),
            転換統合: this.calculateProbabilityFromLine(lineData, 'transform_integrate'),
            転換段階: this.calculateProbabilityFromLine(lineData, 'transform_step')
        } : {
            継続強化: 0.27,
            継続調整: 0.24,
            転換統合: 0.27,
            転換段階: 0.22
        };

        // 8つの最終パスを生成
        const paths = [
            { pathIndex: 1, title: '継続強化・突破型', probability: baseValues.継続強化 * 0.55, route: ['開始', '継続選択', '強化方向'], description: '現在の強みを最大限に活かす道' },
            { pathIndex: 2, title: '継続強化・安定型', probability: baseValues.継続強化 * 0.45, route: ['開始', '継続選択', '安定方向'], description: '着実な成長を重視する道' },
            { pathIndex: 3, title: '継続調整・革新型', probability: baseValues.継続調整 * 0.54, route: ['開始', '継続選択', '革新方向'], description: '既存の枠組みを革新する道' },
            { pathIndex: 4, title: '継続調整・改善型', probability: baseValues.継続調整 * 0.46, route: ['開始', '継続選択', '改善方向'], description: '段階的な改善を重ねる道' },
            { pathIndex: 5, title: '転換統合・融合型', probability: baseValues.転換統合 * 0.52, route: ['開始', '転換選択', '融合方向'], description: '新旧の要素を統合する道' },
            { pathIndex: 6, title: '転換統合・創造型', probability: baseValues.転換統合 * 0.48, route: ['開始', '転換選択', '創造方向'], description: '全く新しい価値を創造する道' },
            { pathIndex: 7, title: '転換段階・飛躍型', probability: baseValues.転換段階 * 0.55, route: ['開始', '転換選択', '飛躍方向'], description: '大きな飛躍を目指す道' },
            { pathIndex: 8, title: '転換段階・探索型', probability: baseValues.転換段階 * 0.45, route: ['開始', '転換選択', '探索方向'], description: '新たな可能性を探索する道' }
        ];

        // 確率の合計を1に正規化
        const totalProb = paths.reduce((sum, p) => sum + p.probability, 0);
        paths.forEach(p => p.probability = p.probability / totalProb);

        return {
            currentLine: defaultLine,
            lineData: lineData,
            finalEightPaths: paths,
            branchingData: this.generateBranchingData(paths)
        };
    },

    // 爻データから確率を計算
    calculateProbabilityFromLine: function(lineData, type) {
        if (!lineData) return 0.25;
        
        // 各爻の位置と陰陽から確率を計算
        const position = lineData.位置 || 3;
        const isYang = lineData.陰陽 === '陽';
        
        switch(type) {
            case 'continue_strong':
                return isYang ? (0.3 + position * 0.02) : (0.2 + position * 0.01);
            case 'continue_transform':
                return isYang ? (0.25 - position * 0.01) : (0.25 + position * 0.01);
            case 'transform_integrate':
                return !isYang ? (0.3 + position * 0.01) : (0.2 + position * 0.02);
            case 'transform_step':
                return !isYang ? (0.25 - position * 0.01) : (0.2 + position * 0.01);
            default:
                return 0.25;
        }
    },

    // 分岐型グラフデータ生成（1→2→4→8の分岐構造）
    generateBranchingData: function(paths) {
        // フェーズ1: 単一の開始点
        const phase1 = {
            x: 0,
            y: 0.5,
            label: '現在'
        };

        // フェーズ2: 2つに分岐（継続 vs 転換）
        const continueProb = paths.slice(0, 4).reduce((sum, p) => sum + p.probability, 0);
        const transformProb = paths.slice(4, 8).reduce((sum, p) => sum + p.probability, 0);
        
        const phase2 = [
            { x: 1, y: 0.3, probability: continueProb, label: '継続路線', parent: 0 },
            { x: 1, y: 0.7, probability: transformProb, label: '転換路線', parent: 0 }
        ];

        // フェーズ3: 4つに分岐
        const phase3 = [
            { x: 2, y: 0.15, probability: paths[0].probability + paths[1].probability, label: '継続強化', parent: 0 },
            { x: 2, y: 0.35, probability: paths[2].probability + paths[3].probability, label: '継続調整', parent: 0 },
            { x: 2, y: 0.55, probability: paths[4].probability + paths[5].probability, label: '転換統合', parent: 1 },
            { x: 2, y: 0.75, probability: paths[6].probability + paths[7].probability, label: '転換段階', parent: 1 }
        ];

        // フェーズ4: 8つの最終シナリオ
        const phase4 = paths.map((path, index) => ({
            x: 3,
            y: 0.05 + index * 0.125,
            probability: path.probability,
            label: `パス${index + 1}`,
            title: path.title,
            parent: Math.floor(index / 2)
        }));

        return {
            phase1,
            phase2,
            phase3,
            phase4,
            allPhases: [phase1, ...phase2, ...phase3, ...phase4]
        };
    },

    // Chart.js読み込み
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
                         document.querySelector('#binary-tree-results') ||
                         document.body;

        if (!container) {
            console.error('No container found for results');
            return;
        }

        // HTML生成
        container.innerHTML = this.generateHTML(result);

        // グラフレンダリング（分岐型折れ線グラフ）
        setTimeout(() => {
            this.renderBranchingChart(result);
        }, 100);

        // ダウンロード機能設定
        this.setupDownload(result);
    },

    // HTML生成
    generateHTML: function(result) {
        // finalEightPathsが存在しない場合はデフォルト結果を生成
        if (!result || !result.finalEightPaths) {
            console.log('🌳 Result data missing, generating default data...');
            result = this.generateDefaultResultWithH384Data();
        }
        
        const transformProb = result.finalEightPaths.slice(4, 8).reduce((sum, p) => sum + p.probability, 0);
        const continueProb = result.finalEightPaths.slice(0, 4).reduce((sum, p) => sum + p.probability, 0);
        const topPath = result.finalEightPaths.reduce((max, p) => p.probability > max.probability ? p : max);

        return `
            <div class="binary-tree-complete-analysis" style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; color: white; margin: 20px 0;">
                
                <!-- タイトル -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="font-size: 2em; margin-bottom: 10px; color: white;">🌳 Binary Tree 未来分岐分析</h2>
                    <p style="font-size: 1.2em; opacity: 0.95;">8つの未来パスから統合的洞察を生成します</p>
                    ${result.lineData ? `<p style="font-size: 0.9em; opacity: 0.8;">基準: ${result.lineData.卦名} ${result.lineData.爻名}</p>` : ''}
                </div>

                <!-- 分岐型折れ線グラフ -->
                <div style="background: white; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="color: #4338ca; margin-bottom: 20px;">📈 未来分岐パスの可視化</h3>
                    <div style="height: 400px; position: relative;">
                        <canvas id="branchingChart"></canvas>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                        <p style="color: #4b5563; margin: 0; font-size: 0.9em;">
                            <strong>説明:</strong> 現在から始まり、2つ→4つ→最終的に8つのパスへ分岐する未来の可能性を示しています。
                            線の太さは確率の高さを表しています。
                        </p>
                    </div>
                </div>

                <!-- 8シナリオカード -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
                    ${result.finalEightPaths.map((path, i) => this.generatePathCard(path, i)).join('')}
                </div>

                <!-- HaQei統合分析 -->
                ${this.generateInsightSection(result, transformProb, continueProb, topPath)}

                <!-- アクションボタン -->
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="background: white; color: #4338ca; padding: 12px 30px; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin: 0 10px;">
                        📄 PDFで保存
                    </button>
                    <button onclick="window.BinaryTreeCompleteDisplay.downloadResults()" style="background: white; color: #4338ca; padding: 12px 30px; border: none; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin: 0 10px;">
                        💾 データをダウンロード
                    </button>
                </div>
            </div>
        `;
    },

    // パスカード生成
    generatePathCard: function(path, index) {
        const icons = ['🎯', '🚀', '💡', '🌟', '🔮', '⚡', '🌈', '✨'];
        const colors = [
            '#22c55e', '#3b82f6', '#a855f7', '#ec4899',
            '#fb923c', '#facc15', '#0ea5e9', '#6366f1'
        ];
        
        return `
            <div style="background: rgba(255,255,255,0.95); border-radius: 12px; padding: 20px; color: #333; border-left: 4px solid ${colors[index]};">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 1.5em; margin-right: 10px;">${icons[index]}</span>
                    <span style="font-weight: bold;">パス${path.pathIndex}</span>
                </div>
                <div style="font-size: 1.1em; font-weight: 600; margin-bottom: 10px; color: #4338ca;">
                    ${path.title}
                </div>
                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 8px 12px; border-radius: 8px; margin-bottom: 10px;">
                    確率: ${(path.probability * 100).toFixed(1)}%
                </div>
                <div style="font-size: 0.85em; color: #6b7280; margin-bottom: 10px;">
                    経路: ${path.route.join(' → ')}
                </div>
                <div style="font-size: 0.9em; color: #666;">
                    ${path.description || path.fullDescription || ''}
                </div>
            </div>
        `;
    },

    // 洞察セクション生成
    generateInsightSection: function(result, transformProb, continueProb, topPath) {
        const tendency = transformProb > continueProb ? '転換' : '継続';
        
        return `
            <div style="background: rgba(255,255,255,0.98); border-radius: 16px; padding: 30px; color: #333;">
                <h3 style="color: #4338ca; margin-bottom: 25px;">🔍 HaQei哲学による統合的洞察</h3>
                
                <!-- 易経ベース分析 -->
                ${result.lineData ? `
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">📖 易経ベース分析</h4>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; line-height: 1.8;">
                        <p style="margin-bottom: 10px;">
                            <strong>卦象:</strong> ${result.lineData.卦名} - ${result.lineData.爻名}
                        </p>
                        <p style="margin-bottom: 10px;">
                            <strong>現代解釈:</strong> ${result.lineData.現代解釈 || '変化の時期における新たな機会'}
                        </p>
                        <p>
                            <strong>行動指針:</strong> ${result.lineData.行動 || '状況を見極めて慎重に進む'}
                        </p>
                    </div>
                </div>
                ` : ''}
                
                <!-- 未来傾向分析 -->
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">📊 あなたの未来傾向分析</h4>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; line-height: 1.8;">
                        <p style="margin-bottom: 15px;">
                            <strong>主傾向:</strong> 「${tendency}」の流れが強まっています（${tendency}系パス計: ${((tendency === '転換' ? transformProb : continueProb) * 100).toFixed(0)}%）。
                        </p>
                        <p style="margin-bottom: 15px;">
                            <strong>最有力シナリオ:</strong> 「${topPath.title}」（${(topPath.probability * 100).toFixed(1)}%）
                        </p>
                        <p>
                            <strong>バランス指標:</strong> 継続${(continueProb * 100).toFixed(0)}% vs 転換${(transformProb * 100).toFixed(0)}%
                        </p>
                    </div>
                </div>

                <!-- 分岐選択ガイド -->
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">🧭 分岐選択における重要ポイント</h4>
                    <div style="display: grid; gap: 15px;">
                        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); padding: 15px; border-radius: 10px;">
                            <strong>第1分岐:</strong> 現状維持か変革かの基本方針
                        </div>
                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 15px; border-radius: 10px;">
                            <strong>第2分岐:</strong> 積極性か慎重性かの行動様式
                        </div>
                        <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 15px; border-radius: 10px;">
                            <strong>第3分岐:</strong> 個人最適か全体最適かの価値基準
                        </div>
                    </div>
                </div>

                <!-- 実践的アドバイス -->
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">💡 実践的アドバイス</h4>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px;">
                        <ol style="line-height: 2; margin: 0; padding-left: 20px;">
                            <li><strong>短期（3ヶ月）:</strong> 現在の強みを認識し基盤を固める</li>
                            <li><strong>中期（6ヶ月）:</strong> 選択した方向性への段階的移行</li>
                            <li><strong>長期（1年）:</strong> 新たな状態での安定と次の成長準備</li>
                        </ol>
                    </div>
                </div>

                <!-- HaQei哲学総括 -->
                <div>
                    <h4 style="color: #6366f1; margin-bottom: 15px;">🎯 HaQei哲学の核心メッセージ</h4>
                    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; border-radius: 12px; color: white; text-align: center; font-size: 1.1em; line-height: 1.6;">
                        「8つのパスは全て可能性です。重要なのは選択ではなく、選んだ道での実践です。」
                    </div>
                </div>
            </div>
        `;
    },

    // 分岐型折れ線グラフレンダリング
    renderBranchingChart: function(result) {
        const canvas = document.getElementById('branchingChart');
        if (!canvas || !window.Chart) {
            console.error('Canvas element or Chart.js not found');
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context from canvas');
            return;
        }

        const branchingData = result.branchingData;
        if (!branchingData) return;

        // データセット生成
        const datasets = this.generateBranchingDatasets(branchingData);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['現在', 'フェーズ1', 'フェーズ2', 'フェーズ3'],
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const dataset = context.dataset;
                                return `${dataset.label}: ${(dataset.probability * 100).toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '時間経過 →'
                        }
                    },
                    y: {
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: '分岐位置'
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }
        });

        console.log('✅ 分岐型折れ線グラフ描画完了');
    },

    // 分岐データセット生成
    generateBranchingDatasets: function(branchingData) {
        const datasets = [];
        const colors = [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(250, 204, 21, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(99, 102, 241, 0.8)'
        ];

        // 各パスの線を生成
        branchingData.phase4.forEach((endpoint, index) => {
            const path = this.tracePath(branchingData, index);
            datasets.push({
                label: endpoint.title || `パス${index + 1}`,
                data: path,
                borderColor: colors[index],
                backgroundColor: colors[index].replace('0.8', '0.2'),
                borderWidth: 2 + (endpoint.probability * 10),
                probability: endpoint.probability,
                fill: false
            });
        });

        return datasets;
    },

    // パス追跡
    tracePath: function(branchingData, endpointIndex) {
        const path = [];
        const endpoint = branchingData.phase4[endpointIndex];
        
        // 現在点
        path.push({ x: 0, y: 0.5 });
        
        // フェーズ2の分岐点
        const phase2Point = endpointIndex < 4 ? branchingData.phase2[0] : branchingData.phase2[1];
        path.push({ x: 1, y: phase2Point.y });
        
        // フェーズ3の分岐点
        const phase3Index = Math.floor(endpointIndex / 2);
        const phase3Point = branchingData.phase3[phase3Index];
        path.push({ x: 2, y: phase3Point.y });
        
        // 最終点
        path.push({ x: 3, y: endpoint.y });
        
        return path;
    },

    // ダウンロード設定
    setupDownload: function(result) {
        window.BinaryTreeCompleteDisplay.downloadResults = function() {
            const data = {
                timestamp: new Date().toISOString(),
                analysis: result,
                insights: {
                    generated: true,
                    version: '2.1.0-branching-graph',
                    dataSource: 'H384_DATABASE'
                }
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `binary-tree-analysis-${Date.now()}.json`;
            a.click();
        };
    },

    // ダウンロード実行（外部から呼び出し可能）
    downloadResults: function() {
        if (window.BinaryTreeCompleteDisplay.downloadResults) {
            window.BinaryTreeCompleteDisplay.downloadResults();
        }
    }
};

// 自動初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🌳 Binary Tree Complete Display System v2.1 Ready');
    });
} else {
    console.log('🌳 Binary Tree Complete Display System v2.1 Loaded');
}