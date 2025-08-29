/**
 * HUD Manager - ヘッドアップディスプレイ管理システム
 * 
 * 機能:
 * - リアルタイムメトリクス表示
 * - パフォーマンス監視
 * - システム状態表示
 * - 分析結果の可視化
 * 
 * @author HAQEI System Architect
 * @date 2025-08-28
 * @version 1.0.0
 */

class HUDManager {
    constructor(options = {}) {
        this.version = "1.0.0-hud-manager";
        this.initialized = false;
        this.visible = false;
        
        // メトリクスデータ
        this.metrics = {
            analysisTime: [],
            confidence: [],
            linesEvaluated: [],
            cacheHits: 0,
            totalRequests: 0,
            selectedLines: [],
            dataSource: 'Unknown',
            parseMode: 'Unknown',
            determinismRate: 100,
            lastUpdate: null
        };
        
        // HUD要素
        this.hudElement = null;
        this.metricsPanel = null;
        
        // 設定
        this.config = {
            updateInterval: 1000, // 1秒間隔で更新
            maxHistorySize: 100,  // 最大履歴サイズ
            autoHide: false,      // 自動非表示
            position: 'top-right' // 表示位置
        };
        
        this.init();
    }
    
    /**
     * HUDManagerの初期化
     */
    init() {
        try {
            this.createHUDElements();
            this.setupEventListeners();
            this.startUpdateLoop();
            this.initialized = true;
            console.log('🎯 HUDManager initialized successfully');
        } catch (error) {
            console.error('❌ HUDManager initialization failed:', error);
        }
    }
    
    /**
     * HUD要素の作成
     */
    createHUDElements() {
        // メインHUD要素
        this.hudElement = document.createElement('div');
        this.hudElement.id = 'hud-manager';
        this.hudElement.className = 'hud-container';
        this.hudElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            min-width: 250px;
            max-width: 350px;
            border: 1px solid #00ff00;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            display: none;
        `;
        
        // メトリクスパネル
        this.metricsPanel = document.createElement('div');
        this.metricsPanel.className = 'metrics-panel';
        this.metricsPanel.innerHTML = this.generateMetricsHTML();
        
        this.hudElement.appendChild(this.metricsPanel);
        document.body.appendChild(this.hudElement);
        
        // トグルボタン
        this.createToggleButton();
    }
    
    /**
     * トグルボタンの作成
     */
    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'hud-toggle';
        toggleButton.innerHTML = '📊';
        toggleButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            border: 1px solid #00ff00;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        toggleButton.addEventListener('click', () => this.toggle());
        document.body.appendChild(toggleButton);
    }
    
    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // キーボードショートカット (Ctrl+H)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'h') {
                event.preventDefault();
                this.toggle();
            }
        });
    }
    
    /**
     * 更新ループの開始
     */
    startUpdateLoop() {
        setInterval(() => {
            if (this.visible) {
                this.updateDisplay();
            }
        }, this.config.updateInterval);
    }
    
    /**
     * メトリクスの更新
     * @param {Object} data - メトリクスデータ
     */
    updateMetrics(data) {
        try {
            const timestamp = Date.now();
            
            // 分析時間の記録
            if (data.analysisTime !== undefined) {
                this.metrics.analysisTime.push({
                    value: data.analysisTime,
                    timestamp: timestamp
                });
                this.trimHistory('analysisTime');
            }
            
            // 信頼度の記録
            if (data.confidence !== undefined) {
                this.metrics.confidence.push({
                    value: data.confidence,
                    timestamp: timestamp
                });
                this.trimHistory('confidence');
            }
            
            // 評価行数の記録
            if (data.linesEvaluated !== undefined) {
                this.metrics.linesEvaluated.push({
                    value: data.linesEvaluated,
                    timestamp: timestamp
                });
                this.trimHistory('linesEvaluated');
            }
            
            // 選択された行の記録
            if (data.selectedLineId !== undefined) {
                this.metrics.selectedLines.push({
                    lineId: data.selectedLineId,
                    timestamp: timestamp
                });
                this.trimHistory('selectedLines');
            }

            // データソースの更新
            if (data.dataSource !== undefined) {
                this.metrics.dataSource = data.dataSource;
            }

            // 解析モードの更新
            if (data.parseMode !== undefined) {
                this.metrics.parseMode = data.parseMode;
            }

            // 決定論率の更新
            if (data.determinismRate !== undefined) {
                this.metrics.determinismRate = data.determinismRate;
            }

            // キャッシュヒット/総リクエスト数の更新
            this.metrics.totalRequests++;
            if (data.fromCache) {
                this.metrics.cacheHits++;
            }
            
            this.metrics.lastUpdate = timestamp;
            
            // 即座に表示を更新
            if (this.visible) {
                this.updateDisplay();
            }
            
        } catch (error) {
            console.error('❌ HUDManager updateMetrics error:', error);
        }
    }
    
    /**
     * 履歴データのトリミング
     * @param {string} metricName - メトリクス名
     */
    trimHistory(metricName) {
        const history = this.metrics[metricName];
        if (Array.isArray(history) && history.length > this.config.maxHistorySize) {
            this.metrics[metricName] = history.slice(-this.config.maxHistorySize);
        }
    }
    
    /**
     * 表示の更新
     */
    updateDisplay() {
        if (!this.metricsPanel) return;
        
        this.metricsPanel.innerHTML = this.generateMetricsHTML();
    }
    
    /**
     * メトリクスHTMLの生成
     * @returns {string} HTML文字列
     */
    generateMetricsHTML() {
        const stats = this.calculateStats();
        
        return `
            <div class="hud-header">
                <h3 style="margin: 0 0 10px 0; color: #00ff00; font-size: 14px;">📊 HUD Metrics</h3>
                <div style="font-size: 10px; color: #888;">Last Update: ${this.formatTime(this.metrics.lastUpdate)}</div>
            </div>
            
            <div class="metrics-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0;">
                <div class="metric-item">
                    <div style="color: #888; font-size: 10px;">Analysis Time</div>
                    <div style="color: ${stats.analysisTime.p95 > 45 ? '#ff6666' : '#00ff00'}; font-weight: bold;">${stats.analysisTime.avg.toFixed(1)}ms</div>
                    <div style="color: #666; font-size: 9px;">P50: ${stats.analysisTime.p50.toFixed(1)} P95: ${stats.analysisTime.p95.toFixed(1)} P99: ${stats.analysisTime.p99.toFixed(1)}</div>
                </div>
                
                <div class="metric-item">
                    <div style="color: #888; font-size: 10px;">Confidence</div>
                    <div style="color: #00ff00; font-weight: bold;">${stats.confidence.avg.toFixed(1)}%</div>
                    <div style="color: #666; font-size: 9px;">Range: ${stats.confidence.min.toFixed(1)}-${stats.confidence.max.toFixed(1)}</div>
                </div>
                
                <div class="metric-item">
                    <div style="color: #888; font-size: 10px;">Cache Hit Rate</div>
                    <div style="color: #00ff00; font-weight: bold;">${stats.cacheHitRate.toFixed(1)}%</div>
                    <div style="color: #666; font-size: 9px;">${this.metrics.cacheHits}/${this.metrics.totalRequests}</div>
                </div>
                
                <div class="metric-item">
                    <div style="color: #888; font-size: 10px;">Lines Evaluated</div>
                    <div style="color: #00ff00; font-weight: bold;">${stats.linesEvaluated.avg.toFixed(0)}</div>
                    <div style="color: #666; font-size: 9px;">Max: ${stats.linesEvaluated.max}</div>
                </div>
                
                <div class="metric-item">
                    <div style="color: #888; font-size: 10px;">Data Source</div>
                    <div style="color: #00ff00; font-weight: bold;">${this.metrics.dataSource}</div>
                    <div style="color: #666; font-size: 9px;">Parse: ${this.metrics.parseMode}</div>
                </div>
                
                <div class="metric-item">
                    <div style="color: #888; font-size: 10px;">Determinism</div>
                    <div style="color: ${this.metrics.determinismRate === 100 ? '#00ff00' : '#ffaa00'}; font-weight: bold;">${this.metrics.determinismRate.toFixed(1)}%</div>
                    <div style="color: #666; font-size: 9px;">Reproducibility</div>
                </div>
            </div>
            
            <div class="recent-activity" style="margin-top: 10px; border-top: 1px solid #333; padding-top: 8px;">
                <div style="color: #888; font-size: 10px; margin-bottom: 5px;">Recent Selections</div>
                <div style="font-size: 9px; color: #666; max-height: 60px; overflow-y: auto;">
                    ${this.getRecentSelections()}
                </div>
            </div>
        `;
    }
    
    /**
     * 統計の計算
     * @returns {Object} 統計データ
     */
    calculateStats() {
        const stats = {
            analysisTime: { avg: 0, p50: 0, p95: 0, p99: 0, min: 0, max: 0 },
            confidence: { avg: 0, min: 0, max: 0 },
            linesEvaluated: { avg: 0, min: 0, max: 0 },
            cacheHitRate: 0
        };
        
        // 分析時間の統計
        if (this.metrics.analysisTime.length > 0) {
            const times = this.metrics.analysisTime.map(item => item.value);
            stats.analysisTime.avg = times.reduce((a, b) => a + b, 0) / times.length;
            stats.analysisTime.min = Math.min(...times);
            stats.analysisTime.max = Math.max(...times);
            
            const sortedTimes = times.sort((a, b) => a - b);
            const p50Index = Math.floor(sortedTimes.length * 0.5);
            const p95Index = Math.floor(sortedTimes.length * 0.95);
            const p99Index = Math.floor(sortedTimes.length * 0.99);
            stats.analysisTime.p50 = sortedTimes[p50Index] || 0;
            stats.analysisTime.p95 = sortedTimes[p95Index] || 0;
            stats.analysisTime.p99 = sortedTimes[p99Index] || 0;
        }
        
        // 信頼度の統計
        if (this.metrics.confidence.length > 0) {
            const confidences = this.metrics.confidence.map(item => item.value);
            stats.confidence.avg = confidences.reduce((a, b) => a + b, 0) / confidences.length;
            stats.confidence.min = Math.min(...confidences);
            stats.confidence.max = Math.max(...confidences);
        }
        
        // 評価行数の統計
        if (this.metrics.linesEvaluated.length > 0) {
            const lines = this.metrics.linesEvaluated.map(item => item.value);
            stats.linesEvaluated.avg = lines.reduce((a, b) => a + b, 0) / lines.length;
            stats.linesEvaluated.min = Math.min(...lines);
            stats.linesEvaluated.max = Math.max(...lines);
        }
        
        // キャッシュヒット率
        if (this.metrics.totalRequests > 0) {
            stats.cacheHitRate = (this.metrics.cacheHits / this.metrics.totalRequests) * 100;
        }
        
        return stats;
    }
    
    /**
     * 最近の選択履歴を取得
     * @returns {string} HTML文字列
     */
    getRecentSelections() {
        const recent = this.metrics.selectedLines.slice(-5).reverse();
        if (recent.length === 0) {
            return '<div style="color: #666;">No recent selections</div>';
        }
        
        return recent.map(item => {
            const time = new Date(item.timestamp).toLocaleTimeString();
            return `<div>${time}: Line ${item.lineId}</div>`;
        }).join('');
    }
    
    /**
     * 時刻のフォーマット
     * @param {number} timestamp - タイムスタンプ
     * @returns {string} フォーマットされた時刻
     */
    formatTime(timestamp) {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleTimeString();
    }
    
    /**
     * HUDの表示/非表示切り替え
     */
    toggle() {
        this.visible = !this.visible;
        if (this.hudElement) {
            this.hudElement.style.display = this.visible ? 'block' : 'none';
        }
        
        if (this.visible) {
            this.updateDisplay();
        }
    }
    
    /**
     * HUDの表示
     */
    show() {
        this.visible = true;
        if (this.hudElement) {
            this.hudElement.style.display = 'block';
            this.updateDisplay();
        }
    }
    
    /**
     * HUDを非表示にする
     */
    hide() {
        this.visible = false;
        if (this.hudElement) {
            this.hudElement.style.display = 'none';
        }
    }
    
    /**
     * フォールバックモードの表示
     * @param {boolean} enabled - フォールバックモードの有効/無効
     */
    showFallbackMode(enabled = true) {
        if (enabled) {
            this.updateMetrics({
                analysisTime: 0,
                confidence: 0,
                linesEvaluated: 0,
                fromCache: false,
                selectedLineId: null,
                fallbackMode: true
            });
            this.show();
        }
    }
    
    /**
     * メトリクスのリセット
     */
    resetMetrics() {
        this.metrics = {
            analysisTime: [],
            confidence: [],
            linesEvaluated: [],
            cacheHits: 0,
            totalRequests: 0,
            selectedLines: [],
            lastUpdate: null
        };
        
        if (this.visible) {
            this.updateDisplay();
        }
    }
    
    /**
     * メトリクスデータのエクスポート
     * @returns {Object} メトリクスデータ
     */
    exportMetrics() {
        return {
            ...this.metrics,
            stats: this.calculateStats(),
            exportTime: Date.now()
        };
    }
    
    /**
     * HUDManagerの破棄
     */
    destroy() {
        if (this.hudElement) {
            this.hudElement.remove();
        }
        
        const toggleButton = document.getElementById('hud-toggle');
        if (toggleButton) {
            toggleButton.remove();
        }
        
        this.initialized = false;
        console.log('🎯 HUDManager destroyed');
    }
}

// グローバルインスタンスの作成
if (typeof window !== 'undefined') {
    // 自動初期化（DOMContentLoaded後）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.hudManager) {
                window.hudManager = new HUDManager();
            }
        });
    } else {
        // 既にDOMが読み込まれている場合
        if (!window.hudManager) {
            window.hudManager = new HUDManager();
        }
    }
}

// Node.js環境での対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HUDManager;
}