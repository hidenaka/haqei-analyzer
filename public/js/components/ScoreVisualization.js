/**
 * スコアビジュアライゼーション
 * H384データベースのスコアを視覚的に表示
 */

class ScoreVisualization {
    constructor() {
        this.chartColors = {
            基本: '#4A90E2',      // 青
            ポテンシャル: '#50C878', // 緑
            安定性: '#FFD700',     // 金
            リスク: '#FF6B6B',     // 赤
            変動性: '#9B59B6',     // 紫
            総合: '#FF8C42'        // オレンジ
        };
    }
    
    /**
     * 8つのシナリオの比較グラフを作成
     */
    createComparisonChart(scenarios) {
        const container = document.createElement('div');
        container.className = 'score-comparison-chart';
        container.innerHTML = `
            <div class="chart-header">
                <h3>📊 8つのシナリオ スコア比較</h3>
                <p class="chart-subtitle">各シナリオの総合評価と特性を視覚的に比較</p>
            </div>
            <div class="chart-container">
                <canvas id="comparison-chart" width="1200" height="400"></canvas>
            </div>
            <div class="chart-legend">
                ${this.createLegend()}
            </div>
        `;
        
        // Canvas要素を取得して描画
        setTimeout(() => {
            const canvas = container.querySelector('#comparison-chart');
            if (canvas) {
                this.drawComparisonChart(canvas, scenarios);
            }
        }, 100);
        
        this.addStyles();
        return container;
    }
    
    /**
     * 個別シナリオのレーダーチャート作成
     */
    createRadarChart(scenario) {
        const container = document.createElement('div');
        container.className = 'score-radar-chart';
        
        // H384データからスコアを取得
        const scores = this.getScoresFromScenario(scenario);
        
        container.innerHTML = `
            <div class="radar-container">
                <canvas class="radar-canvas" width="300" height="300"></canvas>
                <div class="score-summary">
                    <div class="total-score">${scores.total}</div>
                    <div class="score-label">総合スコア</div>
                </div>
            </div>
        `;
        
        // Canvas要素を取得して描画
        setTimeout(() => {
            const canvas = container.querySelector('.radar-canvas');
            if (canvas) {
                this.drawRadarChart(canvas, scores);
            }
        }, 100);
        
        return container;
    }
    
    /**
     * タイムライン変化グラフ（3段階の変化を表示）
     */
    createTimelineChart(scenario, phases) {
        const container = document.createElement('div');
        container.className = 'timeline-chart';
        
        container.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-title">スコア推移</span>
            </div>
            <div class="timeline-graph">
                <canvas class="timeline-canvas" width="400" height="150"></canvas>
            </div>
        `;
        
        setTimeout(() => {
            const canvas = container.querySelector('.timeline-canvas');
            if (canvas) {
                this.drawTimelineChart(canvas, scenario, phases);
            }
        }, 100);
        
        return container;
    }
    
    /**
     * 比較チャートの描画
     */
    drawComparisonChart(canvas, scenarios) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 背景をクリア
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, width, height);
        
        // グリッド線を描画
        this.drawGrid(ctx, width, height);
        
        // 各シナリオのバーを描画
        const barWidth = width / (scenarios.length * 2);
        const padding = barWidth / 2;
        
        scenarios.forEach((scenario, index) => {
            const scores = this.getScoresFromScenario(scenario);
            const x = padding + (index * barWidth * 2);
            
            // 総合スコアのバー
            const totalHeight = (scores.total / 100) * (height - 60);
            ctx.fillStyle = this.chartColors.総合;
            ctx.fillRect(x, height - 40 - totalHeight, barWidth, totalHeight);
            
            // スコア値を表示
            ctx.fillStyle = '#E5E7EB';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(scores.total, x + barWidth/2, height - 45 - totalHeight);
            
            // シナリオ番号
            ctx.fillText(`#${index + 1}`, x + barWidth/2, height - 20);
            
            // リスクインジケーター
            if (scores.risk < -50) {
                ctx.fillStyle = 'rgba(255, 107, 107, 0.5)';
                ctx.fillRect(x, height - 40, barWidth, 3);
            }
        });
    }
    
    /**
     * レーダーチャートの描画
     */
    drawRadarChart(canvas, scores) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        // 6軸（基本、ポテンシャル、安定性、リスク（逆転）、変動性（逆転）、総合）
        const axes = [
            { label: '基本', value: scores.basic, color: this.chartColors.基本 },
            { label: 'ポテンシャル', value: scores.potential, color: this.chartColors.ポテンシャル },
            { label: '安定性', value: scores.stability, color: this.chartColors.安定性 },
            { label: '低リスク', value: 100 + scores.risk, color: this.chartColors.リスク }, // リスクは逆転
            { label: '低変動', value: 100 - scores.volatility, color: this.chartColors.変動性 }, // 変動性も逆転
            { label: '総合', value: scores.total, color: this.chartColors.総合 }
        ];
        
        const angleStep = (Math.PI * 2) / axes.length;
        
        // 背景の多角形を描画
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            const r = (radius / 5) * i;
            for (let j = 0; j < axes.length; j++) {
                const angle = angleStep * j - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // 軸線を描画
        axes.forEach((axis, index) => {
            const angle = angleStep * index - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + radius * Math.cos(angle),
                centerY + radius * Math.sin(angle)
            );
            ctx.stroke();
            
            // ラベル
            ctx.fillStyle = '#94A3B8';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            const labelX = centerX + (radius + 20) * Math.cos(angle);
            const labelY = centerY + (radius + 20) * Math.sin(angle);
            ctx.fillText(axis.label, labelX, labelY);
        });
        
        // データポリゴンを描画
        ctx.beginPath();
        ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 2;
        
        axes.forEach((axis, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const r = (axis.value / 100) * radius;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    /**
     * タイムラインチャートの描画
     */
    drawTimelineChart(canvas, scenario, phases) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 20;
        
        // 背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, 0, width, height);
        
        // 時間軸
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // 3つのフェーズポイント
        const points = [
            { x: padding + 50, label: '現在' },
            { x: padding + 150, label: '動爻期' },
            { x: padding + 250, label: '転爻期' },
            { x: padding + 350, label: '成爻期' }
        ];
        
        // スコアの変化を計算（仮のロジック）
        const scores = this.getScoresFromScenario(scenario);
        const scorePoints = [
            scores.total,
            scores.total + 10,
            scores.total + 5,
            scores.total + 15
        ];
        
        // 折れ線グラフを描画
        ctx.strokeStyle = this.chartColors.総合;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        points.forEach((point, index) => {
            const y = height - padding - (scorePoints[index] / 100) * (height - padding * 2);
            if (index === 0) ctx.moveTo(point.x, y);
            else ctx.lineTo(point.x, y);
            
            // ポイントを描画
            ctx.fillStyle = this.chartColors.総合;
            ctx.beginPath();
            ctx.arc(point.x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // ラベル
            ctx.fillStyle = '#94A3B8';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(point.label, point.x, height - 5);
            
            // スコア値
            ctx.fillText(scorePoints[index], point.x, y - 10);
        });
        
        ctx.stroke();
    }
    
    /**
     * グリッド線の描画
     */
    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
        ctx.lineWidth = 1;
        
        // 横線
        for (let i = 0; i <= 10; i++) {
            const y = (height - 60) * (1 - i/10) + 20;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
            
            // スコアラベル
            if (i % 2 === 0) {
                ctx.fillStyle = '#64748B';
                ctx.font = '10px Inter';
                ctx.textAlign = 'right';
                ctx.fillText(i * 10, 25, y + 3);
            }
        }
    }
    
    /**
     * シナリオからスコアを取得
     */
    getScoresFromScenario(scenario) {
        // H384データベースから該当する卦と爻のスコアを取得
        if (window.H384_DATA && scenario.finalHex && scenario.finalLine) {
            const index = (scenario.finalHex - 1) * 6 + scenario.finalLine - 1;
            const data = window.H384_DATA[index];
            if (data) {
                return {
                    basic: data.S1_基本スコア || 50,
                    potential: data.S2_ポテンシャル || 50,
                    stability: data.S3_安定性スコア || 50,
                    risk: data.S4_リスク || -35,
                    volatility: data.S6_変動性スコア || 50,
                    total: data.S7_総合評価スコア || 50
                };
            }
        }
        
        // フォールバック値
        return {
            basic: 50,
            potential: 50,
            stability: 50,
            risk: -35,
            volatility: 50,
            total: 50
        };
    }
    
    /**
     * 凡例の作成
     */
    createLegend() {
        return `
            <div class="legend-items">
                <span class="legend-item">
                    <span class="legend-color" style="background: ${this.chartColors.総合}"></span>
                    総合評価
                </span>
                <span class="legend-item">
                    <span class="legend-color" style="background: ${this.chartColors.基本}"></span>
                    基本スコア
                </span>
                <span class="legend-item">
                    <span class="legend-color" style="background: ${this.chartColors.ポテンシャル}"></span>
                    ポテンシャル
                </span>
                <span class="legend-item">
                    <span class="legend-color" style="background: ${this.chartColors.安定性}"></span>
                    安定性
                </span>
                <span class="legend-item">
                    <span class="legend-color" style="background: ${this.chartColors.リスク}"></span>
                    リスク
                </span>
            </div>
        `;
    }
    
    /**
     * スタイルの追加
     */
    addStyles() {
        if (document.getElementById('score-visualization-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'score-visualization-styles';
        styles.textContent = `
            .score-comparison-chart {
                margin: 30px 0;
                padding: 20px;
                background: rgba(30, 41, 59, 0.5);
                border-radius: 12px;
                border: 1px solid rgba(148, 163, 184, 0.2);
            }
            
            .chart-header {
                margin-bottom: 20px;
            }
            
            .chart-header h3 {
                color: #E5E7EB;
                font-size: 1.5rem;
                margin: 0 0 8px 0;
            }
            
            .chart-subtitle {
                color: #94A3B8;
                font-size: 0.9rem;
                margin: 0;
            }
            
            .chart-container {
                background: rgba(15, 23, 42, 0.5);
                border-radius: 8px;
                padding: 20px;
                overflow-x: auto;
            }
            
            .chart-legend {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(148, 163, 184, 0.2);
            }
            
            .legend-items {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #94A3B8;
                font-size: 0.85rem;
            }
            
            .legend-color {
                width: 16px;
                height: 16px;
                border-radius: 4px;
            }
            
            .score-radar-chart {
                margin: 15px 0;
            }
            
            .radar-container {
                position: relative;
                display: inline-block;
            }
            
            .score-summary {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                pointer-events: none;
            }
            
            .total-score {
                font-size: 2rem;
                font-weight: bold;
                color: #FF8C42;
            }
            
            .score-label {
                font-size: 0.75rem;
                color: #94A3B8;
                margin-top: -5px;
            }
            
            .timeline-chart {
                margin: 10px 0;
                padding: 10px;
                background: rgba(15, 23, 42, 0.3);
                border-radius: 8px;
            }
            
            .timeline-header {
                color: #94A3B8;
                font-size: 0.85rem;
                margin-bottom: 10px;
            }
            
            canvas {
                max-width: 100%;
                height: auto;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// グローバルに公開
window.ScoreVisualization = ScoreVisualization;