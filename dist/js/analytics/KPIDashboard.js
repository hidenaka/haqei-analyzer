/**
 * KPI Dashboard - Real-time Performance Visualization
 * リアルタイムKPI可視化ダッシュボード
 * 
 * @class KPIDashboard
 * @version 1.0.0
 * @date 2025-08-12
 */

class KPIDashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.kpiAnalyzer = window.kpiAnalyzer;
        this.isVisible = false;
        this.updateInterval = null;
        this.charts = new Map();
        
        // ダッシュボード設定
        this.config = {
            updateFrequency: 30000, // 30秒間隔
            chartColors: {
                success: '#22c55e',
                warning: '#f59e0b', 
                danger: '#ef4444',
                info: '#6366f1',
                primary: '#8b5cf6'
            },
            animations: {
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        };
        
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        if (!this.container) {
            console.error('KPI Dashboard container not found');
            return;
        }
        
        if (!this.kpiAnalyzer) {
            console.error('KPI Analyzer not found');
            return;
        }
        
        // ダッシュボードHTML生成
        this.createDashboardHTML();
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        // 初期データロード
        this.loadInitialData();
        
        console.log('KPI Dashboard initialized');
    }
    
    /**
     * ダッシュボードHTML生成
     */
    createDashboardHTML() {
        this.container.innerHTML = `
            <div class="kpi-dashboard">
                <div class="dashboard-header">
                    <div class="header-content">
                        <h2 class="dashboard-title">
                            <span class="title-icon">📊</span>
                            OS Analyzer KPI ダッシュボード
                        </h2>
                        <div class="header-controls">
                            <button class="btn btn-refresh" id="refresh-btn">
                                <span class="btn-icon">🔄</span>
                                更新
                            </button>
                            <button class="btn btn-export" id="export-btn">
                                <span class="btn-icon">💾</span>
                                エクスポート
                            </button>
                            <button class="btn btn-toggle" id="toggle-btn">
                                <span class="btn-icon">👁️</span>
                                表示切替
                            </button>
                        </div>
                    </div>
                    <div class="last-updated">
                        最終更新: <span id="last-updated-time">-</span>
                    </div>
                </div>
                
                <div class="dashboard-content" id="dashboard-content">
                    <div class="kpi-overview">
                        <div class="overview-card overall-score">
                            <div class="card-header">
                                <h3>総合スコア</h3>
                                <span class="card-icon">🎯</span>
                            </div>
                            <div class="card-body">
                                <div class="score-display">
                                    <span class="score-value" id="overall-score">-</span>
                                    <span class="score-unit">%</span>
                                </div>
                                <div class="score-status" id="overall-status">評価中</div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <h3>今日のセッション</h3>
                                <span class="card-icon">👥</span>
                            </div>
                            <div class="card-body">
                                <div class="metric-value" id="daily-sessions">-</div>
                                <div class="metric-change" id="daily-sessions-change">-</div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <h3>完了率</h3>
                                <span class="card-icon">✅</span>
                            </div>
                            <div class="card-body">
                                <div class="metric-value" id="completion-rate">-</div>
                                <div class="metric-target">目標: 75%</div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <h3>フィードバック率</h3>
                                <span class="card-icon">💬</span>
                            </div>
                            <div class="card-body">
                                <div class="metric-value" id="feedback-rate">-</div>
                                <div class="metric-target">目標: 20%</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kpi-categories">
                        <div class="category-section" id="user-experience-section">
                            <div class="section-header">
                                <h3>
                                    <span class="section-icon">👤</span>
                                    ユーザー体験
                                </h3>
                                <button class="section-toggle" data-section="user-experience">
                                    <span class="toggle-icon">▼</span>
                                </button>
                            </div>
                            <div class="section-content" id="user-experience-content">
                                <div class="kpi-grid">
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>診断完了率</h4>
                                            <div class="kpi-status" id="completion-status">-</div>
                                        </div>
                                        <div class="kpi-chart" id="completion-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value" id="completion-value">-</span>
                                            <span class="kpi-trend" id="completion-trend">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>平均セッション時間</h4>
                                            <div class="kpi-status" id="session-duration-status">-</div>
                                        </div>
                                        <div class="kpi-chart" id="session-duration-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value" id="session-duration-value">-</span>
                                            <span class="kpi-trend" id="session-duration-trend">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="category-section" id="zone-d-section">
                            <div class="section-header">
                                <h3>
                                    <span class="section-icon">🔍</span>
                                    Zone D 効果
                                </h3>
                                <button class="section-toggle" data-section="zone-d">
                                    <span class="toggle-icon">▼</span>
                                </button>
                            </div>
                            <div class="section-content" id="zone-d-content">
                                <div class="kpi-grid">
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>不一致フィードバック率</h4>
                                            <div class="kpi-status" id="disagreement-status">-</div>
                                        </div>
                                        <div class="kpi-chart" id="disagreement-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value" id="disagreement-value">-</span>
                                            <span class="kpi-trend" id="disagreement-trend">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>ハンドオフ完了率</h4>
                                            <div class="kpi-status" id="handoff-status">-</div>
                                        </div>
                                        <div class="kpi-chart" id="handoff-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value" id="handoff-value">-</span>
                                            <span class="kpi-trend" id="handoff-trend">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>平均確信度</h4>
                                            <div class="kpi-status" id="confidence-status">-</div>
                                        </div>
                                        <div class="kpi-chart" id="confidence-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value" id="confidence-value">-</span>
                                            <span class="kpi-trend" id="confidence-trend">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="category-section" id="mobile-section">
                            <div class="section-header">
                                <h3>
                                    <span class="section-icon">📱</span>
                                    モバイル最適化
                                </h3>
                                <button class="section-toggle" data-section="mobile">
                                    <span class="toggle-icon">▼</span>
                                </button>
                            </div>
                            <div class="section-content" id="mobile-content">
                                <div class="kpi-grid">
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>モバイル完了率</h4>
                                            <div class="kpi-status" id="mobile-completion-status">-</div>
                                        </div>
                                        <div class="kpi-chart" id="mobile-completion-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value" id="mobile-completion-value">-</span>
                                            <span class="kpi-trend" id="mobile-completion-trend">-</span>
                                        </div>
                                    </div>
                                    
                                    <div class="kpi-card">
                                        <div class="kpi-header">
                                            <h4>デバイス分布</h4>
                                            <div class="kpi-status">情報</div>
                                        </div>
                                        <div class="kpi-chart" id="device-distribution-chart"></div>
                                        <div class="kpi-details">
                                            <span class="kpi-value">デバイス別利用状況</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="category-section" id="paradigm-shift-section">
                            <div class="section-header">
                                <h3>
                                    <span class="section-icon">🔄</span>
                                    パラダイムシフト効果
                                </h3>
                                <button class="section-toggle" data-section="paradigm-shift">
                                    <span class="toggle-icon">▼</span>
                                </button>
                            </div>
                            <div class="section-content" id="paradigm-shift-content">
                                <div class="kpi-grid">
                                    <div class="kpi-card full-width">
                                        <div class="kpi-header">
                                            <h4>パラダイムシフトスコア</h4>
                                            <div class="kpi-status" id="paradigm-shift-status">-</div>
                                        </div>
                                        <div class="paradigm-breakdown">
                                            <div class="breakdown-item">
                                                <span class="breakdown-label">反証歓迎度</span>
                                                <div class="breakdown-bar">
                                                    <div class="breakdown-fill" id="feedback-engagement-bar"></div>
                                                </div>
                                                <span class="breakdown-value" id="feedback-engagement-value">-</span>
                                            </div>
                                            <div class="breakdown-item">
                                                <span class="breakdown-label">不確実性受容</span>
                                                <div class="breakdown-bar">
                                                    <div class="breakdown-fill" id="uncertainty-acceptance-bar"></div>
                                                </div>
                                                <span class="breakdown-value" id="uncertainty-acceptance-value">-</span>
                                            </div>
                                            <div class="breakdown-item">
                                                <span class="breakdown-label">継続利用意向</span>
                                                <div class="breakdown-bar">
                                                    <div class="breakdown-fill" id="repeat-usage-bar"></div>
                                                </div>
                                                <span class="breakdown-value" id="repeat-usage-value">-</span>
                                            </div>
                                            <div class="breakdown-item">
                                                <span class="breakdown-label">AI引き継ぎ意欲</span>
                                                <div class="breakdown-bar">
                                                    <div class="breakdown-fill" id="handoff-willingness-bar"></div>
                                                </div>
                                                <span class="breakdown-value" id="handoff-willingness-value">-</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-alerts" id="dashboard-alerts">
                        <!-- アラートが動的に表示される -->
                    </div>
                </div>
            </div>
        `;
        
        this.attachStyles();
    }
    
    /**
     * スタイル添付
     */
    attachStyles() {
        if (document.getElementById('kpi-dashboard-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'kpi-dashboard-styles';
        style.textContent = `
            .kpi-dashboard {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #e2e8f0;
                min-height: 100vh;
                padding: 2rem;
            }
            
            .dashboard-header {
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 16px;
                padding: 2rem;
                margin-bottom: 2rem;
            }
            
            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .dashboard-title {
                font-size: 2rem;
                font-weight: 700;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin: 0;
            }
            
            .header-controls {
                display: flex;
                gap: 1rem;
            }
            
            .btn {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: transform 0.2s;
            }
            
            .btn:hover {
                transform: translateY(-2px);
            }
            
            .btn-export {
                background: linear-gradient(135deg, #10b981, #22c55e);
            }
            
            .btn-toggle {
                background: linear-gradient(135deg, #f59e0b, #eab308);
            }
            
            .last-updated {
                color: #94a3b8;
                font-size: 0.9rem;
            }
            
            .kpi-overview {
                display: grid;
                grid-template-columns: 2fr repeat(3, 1fr);
                gap: 1.5rem;
                margin-bottom: 3rem;
            }
            
            .overview-card {
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 12px;
                padding: 1.5rem;
                transition: transform 0.2s;
            }
            
            .overview-card:hover {
                transform: translateY(-2px);
            }
            
            .overall-score {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border-color: rgba(99, 102, 241, 0.3);
            }
            
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .card-header h3 {
                font-size: 1rem;
                font-weight: 600;
                color: #cbd5e1;
                margin: 0;
            }
            
            .score-display {
                display: flex;
                align-items: baseline;
                gap: 0.25rem;
            }
            
            .score-value {
                font-size: 3rem;
                font-weight: 700;
                color: #10b981;
            }
            
            .score-unit {
                font-size: 1.5rem;
                color: #6b7280;
            }
            
            .score-status {
                color: #10b981;
                font-weight: 600;
                margin-top: 0.5rem;
            }
            
            .metric-value {
                font-size: 2rem;
                font-weight: 700;
                color: #e2e8f0;
                margin-bottom: 0.5rem;
            }
            
            .metric-change {
                color: #10b981;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .metric-target {
                color: #94a3b8;
                font-size: 0.85rem;
            }
            
            .category-section {
                background: rgba(15, 23, 42, 0.4);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 16px;
                margin-bottom: 2rem;
                overflow: hidden;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                background: rgba(15, 23, 42, 0.8);
                border-bottom: 1px solid rgba(99, 102, 241, 0.1);
                cursor: pointer;
            }
            
            .section-header h3 {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0;
                color: #e2e8f0;
            }
            
            .section-toggle {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.5rem;
                border-radius: 4px;
                transition: all 0.2s;
            }
            
            .section-toggle:hover {
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
            }
            
            .section-content {
                padding: 2rem;
                display: block;
            }
            
            .section-content.collapsed {
                display: none;
            }
            
            .kpi-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            
            .kpi-card {
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(99, 102, 241, 0.1);
                border-radius: 12px;
                padding: 1.5rem;
                transition: transform 0.2s;
            }
            
            .kpi-card:hover {
                transform: translateY(-2px);
                border-color: rgba(99, 102, 241, 0.3);
            }
            
            .kpi-card.full-width {
                grid-column: 1 / -1;
            }
            
            .kpi-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .kpi-header h4 {
                font-size: 1rem;
                font-weight: 600;
                color: #cbd5e1;
                margin: 0;
            }
            
            .kpi-status {
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .kpi-status.success { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
            .kpi-status.warning { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
            .kpi-status.danger { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
            .kpi-status.info { background: rgba(99, 102, 241, 0.2); color: #6366f1; }
            
            .kpi-chart {
                height: 120px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
                font-size: 0.9rem;
            }
            
            .kpi-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .kpi-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #e2e8f0;
            }
            
            .kpi-trend {
                color: #10b981;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .paradigm-breakdown {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .breakdown-item {
                display: grid;
                grid-template-columns: 150px 1fr 60px;
                align-items: center;
                gap: 1rem;
            }
            
            .breakdown-label {
                color: #94a3b8;
                font-size: 0.9rem;
            }
            
            .breakdown-bar {
                height: 8px;
                background: rgba(99, 102, 241, 0.2);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .breakdown-fill {
                height: 100%;
                background: linear-gradient(90deg, #6366f1, #8b5cf6);
                border-radius: 4px;
                width: 0%;
                transition: width 1s ease-out;
            }
            
            .breakdown-value {
                color: #e2e8f0;
                font-weight: 600;
                font-size: 0.9rem;
                text-align: right;
            }
            
            .dashboard-alerts {
                margin-top: 2rem;
            }
            
            .alert {
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: start;
                gap: 0.75rem;
            }
            
            .alert-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
                margin-top: 0.1rem;
            }
            
            .alert-content h4 {
                color: #ef4444;
                font-size: 1rem;
                font-weight: 600;
                margin: 0 0 0.5rem 0;
            }
            
            .alert-content p {
                color: #cbd5e1;
                margin: 0;
                line-height: 1.5;
            }
            
            /* レスポンシブ対応 */
            @media (max-width: 1024px) {
                .kpi-overview {
                    grid-template-columns: 1fr;
                }
                
                .header-content {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
                
                .header-controls {
                    justify-content: center;
                }
            }
            
            @media (max-width: 768px) {
                .kpi-dashboard {
                    padding: 1rem;
                }
                
                .dashboard-header {
                    padding: 1.5rem;
                }
                
                .dashboard-title {
                    font-size: 1.5rem;
                }
                
                .kpi-grid {
                    grid-template-columns: 1fr;
                }
                
                .breakdown-item {
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // 更新ボタン
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn?.addEventListener('click', () => this.refreshData());
        
        // エクスポートボタン
        const exportBtn = document.getElementById('export-btn');
        exportBtn?.addEventListener('click', () => this.exportData());
        
        // 表示切替ボタン
        const toggleBtn = document.getElementById('toggle-btn');
        toggleBtn?.addEventListener('click', () => this.toggleVisibility());
        
        // セクション折りたたみ
        const sectionToggles = document.querySelectorAll('.section-toggle');
        sectionToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSection(toggle.dataset.section);
            });
        });
        
        // セクションヘッダークリックでも折りたたみ
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const toggle = header.querySelector('.section-toggle');
                if (toggle) {
                    this.toggleSection(toggle.dataset.section);
                }
            });
        });
        
        // KPI更新イベント
        document.addEventListener('kpiDashboardUpdate', (e) => {
            this.updateDashboard(e.detail);
        });
        
        // リサイズイベント
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    /**
     * 初期データロード
     */
    loadInitialData() {
        const dashboardData = this.kpiAnalyzer.generateDashboardData();
        this.updateDashboard(dashboardData);
        
        // 自動更新開始
        this.startAutoUpdate();
    }
    
    /**
     * ダッシュボード更新
     */
    updateDashboard(data) {
        try {
            // 最終更新時間
            const lastUpdated = document.getElementById('last-updated-time');
            if (lastUpdated) {
                lastUpdated.textContent = new Date().toLocaleTimeString('ja-JP');
            }
            
            // 総合スコア
            this.updateOverallScore(data.overallScore);
            
            // 概要カード
            this.updateOverviewCards(data.categories);
            
            // KPIカテゴリ
            this.updateUserExperienceKPIs(data.categories.userExperience);
            this.updateZoneDKPIs(data.categories.zoneD);
            this.updateMobileKPIs(data.categories.mobile);
            this.updateParadigmShiftKPIs(data.categories.paradigmShift);
            
            // アラート
            this.updateAlerts(data.alerts);
            
            console.log('KPI Dashboard updated', data);
            
        } catch (error) {
            console.error('Failed to update KPI dashboard:', error);
            this.showError('ダッシュボードの更新に失敗しました');
        }
    }
    
    /**
     * 総合スコア更新
     */
    updateOverallScore(score) {
        const scoreElement = document.getElementById('overall-score');
        const statusElement = document.getElementById('overall-status');
        
        if (scoreElement && statusElement) {
            scoreElement.textContent = Math.round(score * 100);
            
            let status, className;
            if (score >= 0.8) {
                status = '優秀';
                className = 'success';
            } else if (score >= 0.6) {
                status = '良好';
                className = 'info';
            } else if (score >= 0.4) {
                status = '改善要';
                className = 'warning';
            } else {
                status = '要注意';
                className = 'danger';
            }
            
            statusElement.textContent = status;
            statusElement.className = `score-status ${className}`;
        }
    }
    
    /**
     * 概要カード更新
     */
    updateOverviewCards(categories) {
        // 今日のセッション数（仮データ）
        const dailySessionsElement = document.getElementById('daily-sessions');
        if (dailySessionsElement) {
            dailySessionsElement.textContent = '24'; // 仮データ
        }
        
        // 完了率
        const completionRateElement = document.getElementById('completion-rate');
        if (completionRateElement && categories.userExperience?.completionRate) {
            completionRateElement.textContent = 
                Math.round(categories.userExperience.completionRate.value * 100) + '%';
        }
        
        // フィードバック率
        const feedbackRateElement = document.getElementById('feedback-rate');
        if (feedbackRateElement && categories.zoneD?.disagreementRate) {
            feedbackRateElement.textContent = 
                Math.round(categories.zoneD.disagreementRate.value * 100) + '%';
        }
    }
    
    /**
     * ユーザー体験KPI更新
     */
    updateUserExperienceKPIs(data) {
        if (!data) return;
        
        // 診断完了率
        this.updateKPICard('completion', data.completionRate);
        
        // セッション時間
        this.updateKPICard('session-duration', data.avgSessionDuration);
    }
    
    /**
     * Zone D KPI更新
     */
    updateZoneDKPIs(data) {
        if (!data) return;
        
        // 不一致フィードバック率
        this.updateKPICard('disagreement', data.disagreementRate);
        
        // ハンドオフ完了率
        this.updateKPICard('handoff', data.handoffRate);
        
        // 平均確信度
        this.updateKPICard('confidence', data.avgConfidence);
    }
    
    /**
     * モバイルKPI更新
     */
    updateMobileKPIs(data) {
        if (!data) return;
        
        // モバイル完了率
        this.updateKPICard('mobile-completion', data.mobileCompletionRate);
    }
    
    /**
     * パラダイムシフトKPI更新
     */
    updateParadigmShiftKPIs(data) {
        if (!data) return;
        
        // パラダイムシフトスコア
        const statusElement = document.getElementById('paradigm-shift-status');
        if (statusElement && data.paradigmShiftScore) {
            statusElement.textContent = data.paradigmShiftScore.status.toUpperCase();
            statusElement.className = `kpi-status ${data.paradigmShiftScore.status}`;
        }
        
        // 各要素のバー更新
        this.updateBreakdownBar('feedback-engagement', data.feedbackEngagement?.value || 0);
        this.updateBreakdownBar('uncertainty-acceptance', data.lowConfidenceAcceptance?.value || 0);
        this.updateBreakdownBar('repeat-usage', data.repeatUsage?.value || 0);
        this.updateBreakdownBar('handoff-willingness', data.handoffWillingness?.value || 0);
    }
    
    /**
     * KPIカード更新ヘルパー
     */
    updateKPICard(prefix, data) {
        if (!data) return;
        
        const statusElement = document.getElementById(`${prefix}-status`);
        const valueElement = document.getElementById(`${prefix}-value`);
        
        if (statusElement) {
            statusElement.textContent = data.status.toUpperCase();
            statusElement.className = `kpi-status ${data.status}`;
        }
        
        if (valueElement) {
            if (typeof data.value === 'number') {
                valueElement.textContent = data.value < 1 ? 
                    Math.round(data.value * 100) + '%' : 
                    Math.round(data.value).toLocaleString();
            } else {
                valueElement.textContent = data.value;
            }
        }
    }
    
    /**
     * breakdown bar更新ヘルパー
     */
    updateBreakdownBar(id, value) {
        const barElement = document.getElementById(`${id}-bar`);
        const valueElement = document.getElementById(`${id}-value`);
        
        if (barElement) {
            setTimeout(() => {
                barElement.style.width = `${Math.round(value * 100)}%`;
            }, 100);
        }
        
        if (valueElement) {
            valueElement.textContent = Math.round(value * 100) + '%';
        }
    }
    
    /**
     * アラート更新
     */
    updateAlerts(alerts) {
        const alertsContainer = document.getElementById('dashboard-alerts');
        if (!alertsContainer) return;
        
        if (!alerts || alerts.length === 0) {
            alertsContainer.innerHTML = '';
            return;
        }
        
        const alertsHTML = alerts.map(alert => `
            <div class="alert">
                <div class="alert-icon">${alert.icon || '⚠️'}</div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                </div>
            </div>
        `).join('');
        
        alertsContainer.innerHTML = alertsHTML;
    }
    
    /**
     * データ更新
     */
    refreshData() {
        console.log('Refreshing KPI dashboard data...');
        const dashboardData = this.kpiAnalyzer.generateDashboardData();
        this.updateDashboard(dashboardData);
        
        // ボタンアニメーション
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = '';
            }, 500);
        }
    }
    
    /**
     * データエクスポート
     */
    exportData() {
        try {
            const dashboardData = this.kpiAnalyzer.generateDashboardData();
            const exportData = {
                exportDate: new Date().toISOString(),
                dashboardData: dashboardData,
                weeklyReport: this.kpiAnalyzer.generateWeeklyReport(),
                monthlyReport: this.kpiAnalyzer.generateMonthlyReport()
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `kpi-dashboard-export-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log('KPI dashboard data exported');
            
        } catch (error) {
            console.error('Failed to export KPI data:', error);
            this.showError('データエクスポートに失敗しました');
        }
    }
    
    /**
     * 表示切替
     */
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        
        const content = document.getElementById('dashboard-content');
        if (content) {
            content.style.display = this.isVisible ? 'block' : 'none';
        }
        
        const toggleBtn = document.getElementById('toggle-btn');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('.btn-icon');
            icon.textContent = this.isVisible ? '👁️' : '🙈';
        }
    }
    
    /**
     * セクション折りたたみ
     */
    toggleSection(sectionName) {
        const content = document.getElementById(`${sectionName}-content`);
        const toggle = document.querySelector(`[data-section="${sectionName}"] .toggle-icon`);
        
        if (content && toggle) {
            const isCollapsed = content.classList.contains('collapsed');
            content.classList.toggle('collapsed', !isCollapsed);
            toggle.textContent = isCollapsed ? '▼' : '▶';
        }
    }
    
    /**
     * 自動更新開始
     */
    startAutoUpdate() {
        this.updateInterval = setInterval(() => {
            if (this.isVisible) {
                this.refreshData();
            }
        }, this.config.updateFrequency);
    }
    
    /**
     * エラー表示
     */
    showError(message) {
        const alertsContainer = document.getElementById('dashboard-alerts');
        if (alertsContainer) {
            const errorHTML = `
                <div class="alert">
                    <div class="alert-icon">❌</div>
                    <div class="alert-content">
                        <h4>エラー</h4>
                        <p>${message}</p>
                    </div>
                </div>
            `;
            alertsContainer.innerHTML = errorHTML;
        }
    }
    
    /**
     * リサイズハンドラー
     */
    handleResize() {
        // 必要に応じてチャートのリサイズなどを実装
        console.log('KPI Dashboard resized');
    }
    
    /**
     * デバウンスヘルパー
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * クリーンアップ
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.charts.forEach(chart => {
            if (chart.destroy) chart.destroy();
        });
        
        console.log('KPI Dashboard destroyed');
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KPIDashboard;
}