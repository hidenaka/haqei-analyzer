/**
 * SingleDOMManager - 単一責任のDOM管理システム
 * CLAUDE.md準拠：指示範囲厳守、1つのシステムのみ
 * 
 * 責任：
 * 1. Canvas要素を破壊しない
 * 2. innerHTML使用禁止
 * 3. 差分更新のみ
 */

window.SingleDOMManager = {
    // 初期化フラグ
    initialized: false,
    
    /**
     * 初期化（1回だけ実行）
     */
    init() {
        if (this.initialized) return;
        
        console.log('🚀 SingleDOMManager initializing...');
        
        // 既存のdisplay関数をオーバーライド
        this.overrideDisplayFunctions();
        
        this.initialized = true;
        console.log('✅ SingleDOMManager initialized');
    },
    
    /**
     * 既存のdisplay関数を安全なバージョンに置き換え
     */
    overrideDisplayFunctions() {
        // future-simulator-coreの関数をオーバーライド
        const originalDisplay = window.haqeiFutureSimulator?.displayAuthentic386Results;
        
        if (originalDisplay) {
            window.haqeiFutureSimulator.displayAuthentic386Results = (analysisResult) => {
                console.log('🛡️ SingleDOMManager: Intercepting display function');
                this.safeDisplayResults(analysisResult);
            };
        }
        
        // displayBinaryTreeResultsもオーバーライド
        const originalBinary = window.haqeiFutureSimulator?.displayBinaryTreeResults;
        
        if (originalBinary) {
            window.haqeiFutureSimulator.displayBinaryTreeResults = (analysisResult) => {
                console.log('🛡️ SingleDOMManager: Intercepting binary display');
                this.safeDisplayResults(analysisResult);
            };
        }
    },
    
    /**
     * 安全な結果表示（innerHTML禁止）
     */
    safeDisplayResults(analysisResult) {
        const container = document.getElementById('resultsContainer');
        if (!container) {
            console.error('❌ resultsContainer not found');
            return;
        }
        
        // 1. コンテナを表示
        container.style.display = 'block';
        
        // 2. 必要な構造を確保（innerHTMLを使わない）
        this.ensureStructure(container);
        
        // 3. テキストコンテンツのみ更新
        this.updateTextContent(container, analysisResult);
        
        // 4. シナリオカードを差分更新
        this.updateScenarioCards(analysisResult);
        
        // 5. 既存のCanvas要素でグラフ更新
        this.updateCharts(analysisResult);
        
        console.log('✅ Results displayed safely');
    },
    
    /**
     * DOM構造を確保（破壊しない）
     */
    ensureStructure(container) {
        // eight-scenarios-display-containerの確保
        let scenariosContainer = document.getElementById('eight-scenarios-display-container');
        
        if (!scenariosContainer) {
            scenariosContainer = document.createElement('div');
            scenariosContainer.id = 'eight-scenarios-display-container';
            scenariosContainer.className = 'eight-scenarios-container';
            scenariosContainer.style.cssText = 'margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;';
            
            // タイトル
            const title = document.createElement('h3');
            title.textContent = '📊 8パターン分析結果';
            scenariosContainer.appendChild(title);
            
            // カードコンテナ
            const cardsDiv = document.createElement('div');
            cardsDiv.id = 'scenarios-cards';
            cardsDiv.className = 'scenarios-grid';
            scenariosContainer.appendChild(cardsDiv);
            
            // Canvasコンテナ（3個のCanvas用）
            const canvasDiv = document.createElement('div');
            canvasDiv.id = 'canvas-container';
            canvasDiv.className = 'canvas-container';
            
            // 3個のCanvas要素を作成（破壊されない）
            ['position', 'branching', 'comparison'].forEach(type => {
                const canvas = document.createElement('canvas');
                canvas.id = `${type}-chart`;
                canvas.width = 400;
                canvas.height = 300;
                canvasDiv.appendChild(canvas);
            });
            
            scenariosContainer.appendChild(canvasDiv);
            container.appendChild(scenariosContainer);
            
            console.log('✅ Structure ensured with 3 canvas elements');
        }
    },
    
    /**
     * テキストコンテンツの更新（差分のみ）
     */
    updateTextContent(container, analysisResult) {
        // 現在の卦情報
        let hexagramInfo = container.querySelector('#currentHexagramInfo');
        if (!hexagramInfo) {
            const infoDiv = document.createElement('div');
            infoDiv.id = 'currentHexagramInfo';
            container.insertBefore(infoDiv, container.firstChild);
            hexagramInfo = infoDiv;
        }
        
        const hexagramText = analysisResult.currentHexagram || 
                           analysisResult.hexagramName || 
                           '分析完了';
        
        if (hexagramInfo.textContent !== hexagramText) {
            hexagramInfo.textContent = hexagramText;
        }
    },
    
    /**
     * シナリオカードの更新（innerHTML禁止）
     */
    updateScenarioCards(analysisResult) {
        const cardsContainer = document.getElementById('scenarios-cards');
        if (!cardsContainer) return;
        
        const scenarios = this.extractScenarios(analysisResult);
        
        // 8枚に正規化
        const normalized = scenarios.slice(0, 8);
        
        // 既存カードを再利用
        normalized.forEach((scenario, idx) => {
            let card = cardsContainer.children[idx];
            
            if (!card) {
                card = document.createElement('div');
                card.className = 'scenario-card';
                card.dataset.index = idx;
                
                // カード構造を作成（innerHTML禁止）
                const title = document.createElement('h4');
                title.className = 'card-title';
                card.appendChild(title);
                
                const desc = document.createElement('p');
                desc.className = 'card-description';
                card.appendChild(desc);
                
                const score = document.createElement('span');
                score.className = 'card-score';
                card.appendChild(score);
                
                cardsContainer.appendChild(card);
            }
            
            // テキストのみ更新
            const title = card.querySelector('.card-title');
            const desc = card.querySelector('.card-description');
            const score = card.querySelector('.card-score');
            
            if (title) title.textContent = scenario.name || `シナリオ${idx + 1}`;
            if (desc) desc.textContent = scenario.description || '';
            if (score) score.textContent = `スコア: ${Math.round(scenario.score || 50)}`;
        });
        
        // 余分なカードを削除
        while (cardsContainer.children.length > 8) {
            cardsContainer.removeChild(cardsContainer.lastChild);
        }
        
        console.log(`✅ Updated ${normalized.length} scenario cards`);
    },
    
    /**
     * チャート更新（既存Canvas要素を使用）
     */
    updateCharts(analysisResult) {
        if (!window.Chart) {
            console.warn('⚠️ Chart.js not loaded');
            return;
        }
        
        // 既存のCanvas要素を取得
        const canvases = {
            position: document.getElementById('position-chart'),
            branching: document.getElementById('branching-chart'),
            comparison: document.getElementById('comparison-chart')
        };
        
        // Canvas要素が存在する場合のみ更新
        Object.entries(canvases).forEach(([type, canvas]) => {
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // 既存のChartインスタンスを破棄
            if (canvas._chart) {
                canvas._chart.destroy();
            }
            
            // 新しいChartを作成
            canvas._chart = new window.Chart(ctx, {
                type: type === 'comparison' ? 'radar' : 'bar',
                data: this.getChartData(type, analysisResult),
                options: {
                    animation: false,
                    responsive: false,
                    maintainAspectRatio: false
                }
            });
        });
        
        console.log('✅ Charts updated on existing canvas elements');
    },
    
    /**
     * シナリオデータ抽出
     */
    extractScenarios(analysisResult) {
        return analysisResult.scenarios || 
               analysisResult.finalEightPaths || 
               analysisResult.eightScenarios || 
               [];
    },
    
    /**
     * チャートデータ生成
     */
    getChartData(type, analysisResult) {
        const defaultData = {
            labels: ['A', 'B', 'C', 'D', 'E'],
            datasets: [{
                label: 'データ',
                data: [65, 59, 80, 81, 56],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)'
            }]
        };
        
        return defaultData;
    }
};

// DOMContentLoadedで自動初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.SingleDOMManager.init();
    });
} else {
    window.SingleDOMManager.init();
}