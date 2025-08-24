/**
 * VirtualPersonaResultsView - OSアナライザー結果表示用メインビュー
 * タブナビゲーションシステムに統合された包括的な自己理解・実践支援システム
 * 作成日: 2025-01-18
 * 作成者: TRAE
 */
class VirtualPersonaResultsView {
    constructor(containerId, options = {}) {
        console.log('🎯 VirtualPersonaResultsView: コンストラクタ開始');
        
        this.containerId = containerId;
        this.container = null;
        this.options = {
            enableAnimation: true,
            animationSpeed: 1.0,
            ...options
        };
        
        // タブナビゲーションシステム（シンプル実装）
        this.currentTab = 'basic';
        
        // データ管理
        this.analysisResult = options.analysisResult || null;
        this.insights = options.insights || null;
        this.dataManager = options.dataManager || null;
        
        // 初期化状態
        this.isInitialized = false;
        
        console.log('✅ VirtualPersonaResultsView: コンストラクタ完了');
    }
    
    /**
     * 初期化処理
     */
    async init() {
        console.log('🚀 VirtualPersonaResultsView: 初期化開始');
        console.log('🎯 探しているコンテナID:', this.containerId);
        
        try {
            // コンテナの取得
            this.container = document.getElementById(this.containerId);
            console.log('📦 取得したコンテナ:', this.container);
            
            if (!this.container) {
                console.error('❌ コンテナが見つかりません:', this.containerId);
                throw new Error(`Container not found: ${this.containerId}`);
            }
            
            console.log('✅ コンテナ取得成功:', this.container.id);
            
            // データの準備
            await this.prepareData();
            
            // タブナビゲーションシステムの初期化
            await this.initializeTabSystem();
            
            // 初期化完了
            this.isInitialized = true;
            console.log('✅ VirtualPersonaResultsView: 初期化完了');
            
        } catch (error) {
            console.error('❌ VirtualPersonaResultsView: 初期化エラー', error);
            this.showError('初期化に失敗しました: ' + error.message);
        }
    }
    
    /**
     * データの準備
     */
    async prepareData() {
        console.log('📊 データ準備開始');
        
        // データマネージャーからデータを取得（エラーハンドリング付き）
        try {
            if (this.dataManager && typeof this.dataManager.getAnalysisResult === 'function') {
                this.analysisResult = this.dataManager.getAnalysisResult();
                this.insights = this.dataManager.getInsights();
            }
        } catch (error) {
            console.warn('⚠️ DataManagerからのデータ取得に失敗:', error.message);
        }
        
        // データが不足している場合はローカルストレージから取得
        if (!this.analysisResult) {
            this.analysisResult = this.loadFromStorage('haqei_analysis_result');
        }
        
        if (!this.insights) {
            this.insights = this.loadFromStorage('haqei_insights');
        }
        
        // データが見つからない場合はサンプルデータを使用
        if (!this.analysisResult) {
            console.warn('⚠️ 分析結果が見つかりません。サンプルデータを使用します。');
            this.analysisResult = this.generateSampleData();
        }
        
        console.log('✅ データ準備完了', this.analysisResult);
    }
    
    /**
     * タブナビゲーションシステムの初期化
     */
    async initializeTabSystem() {
        console.log('🗂️ タブシステム初期化開始');
        
        // コンテナの存在確認
        if (!this.container) {
            throw new Error('Container is not available for tab system initialization');
        }
        
        // タブシステム用のHTMLコンテナ構造を生成
        this.container.innerHTML = `
            <div id="results-container" class="results-container">
                <div class="tab-navigation">
                    <button class="tab-button active" data-tab="basic">基本結果</button>
                    <button class="tab-button" data-tab="insights">洞察</button>
                    <button class="tab-button" data-tab="dialogue">対話</button>
                    <button class="tab-button" data-tab="metaphor">メタファー</button>
                    <button class="tab-button" data-tab="practice">実践</button>
                    <button class="tab-button" data-tab="export">エクスポート</button>
                </div>
                <div class="tab-content">
                    <div id="basic-tab-content" class="tab-pane active"></div>
                    <div id="insights-tab-content" class="tab-pane"></div>
                    <div id="dialogue-tab-content" class="tab-pane"></div>
                    <div id="metaphor-tab-content" class="tab-pane"></div>
                    <div id="practice-tab-content" class="tab-pane"></div>
                    <div id="export-tab-content" class="tab-pane"></div>
                </div>
            </div>
        `;
        
        console.log('📦 タブシステム用コンテナ確認:', this.container.id);
        
        // DOMの更新を待つ
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // this.containerの中からresults-containerを直接取得
        const resultsContainer = this.container.querySelector('#results-container');
        if (!resultsContainer) {
            console.error('❌ results-container not found in this.container');
            console.error('❌ this.container.innerHTML:', this.container.innerHTML.substring(0, 500));
            console.error('❌ Available elements in this.container:', 
                Array.from(this.container.querySelectorAll('[id]')).map(el => el.id));
            throw new Error('results-container not found after HTML generation');
        }
        
        console.log('✅ results-container found:', resultsContainer);
        console.log('📋 results-container details:', {
            id: resultsContainer.id,
            className: resultsContainer.className,
            innerHTML: resultsContainer.innerHTML.substring(0, 200) + '...'
        });
        
        // シンプルなタブ機能を実装
        console.log('🚀 簡単なタブシステム初期化開始...');
        this.setupSimpleTabSystem(resultsContainer);
        
        // 基本タブをアクティブにする
        this.switchToTab('basic');
        
        console.log('✅ タブシステム初期化完了');
    }
    
    /**
     * 結果の表示（メインエントリーポイント）
     */
    async displayResults(analysisResult = null, insights = null) {
        console.log('🎨 結果表示開始');
        
        // パラメータが渡された場合は更新
        if (analysisResult) {
            this.analysisResult = analysisResult;
        }
        if (insights) {
            this.insights = insights;
        }
        
        // 初期化されていない場合は初期化
        if (!this.isInitialized) {
            await this.init();
        }
        
        // コンテナを表示
        this.container.style.display = 'block';
        
        console.log('✅ 結果表示完了');
    }
    
    /**
     * ローカルストレージからデータを読み込み
     */
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`ストレージ読み込みエラー (${key}):`, error);
            return null;
        }
    }
    
    /**
     * サンプルデータの生成
     */
    generateSampleData() {
        return {
            engine: {
                score: 7.2,
                hexagram: {
                    symbol: '☰',
                    name: '乾為天',
                    description: '創造力と推進力の象徴'
                },
                traits: ['創造性', '実行力', '革新性', 'リーダーシップ']
            },
            interface: {
                score: 6.8,
                hexagram: {
                    symbol: '☱',
                    name: '兌為沢',
                    description: 'コミュニケーションと調和の象徴'
                },
                traits: ['コミュニケーション', '協調性', '適応力', '情報処理']
            },
            safemode: {
                score: 6.5,
                hexagram: {
                    symbol: '☶',
                    name: '艮為山',
                    description: '安定性と慎重さの象徴'
                },
                traits: ['安定性', '慎重さ', '継続性', 'リスク管理']
            }
        };
    }
    
    /**
     * エラー表示
     */
    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <h3>エラーが発生しました</h3>
                    <p>${this.escapeHtml(message)}</p>
                    <button class="btn btn-primary" onclick="location.reload()">ページを再読み込み</button>
                </div>
            `;
        }
    }
    
    /**
     * HTMLエスケープ
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * 簡単なタブシステムのセットアップ
     */
    setupSimpleTabSystem(container) {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanes = container.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchToTab(tabId);
            });
        });
        
        console.log('✅ 簡単なタブシステムセットアップ完了');
    }
    
    /**
     * タブ切り替え
     */
    switchToTab(tabId) {
        console.log('🔄 タブ切り替え:', tabId);
        
        // すべてのタブボタンとペインの状態をリセット
        const tabButtons = this.container.querySelectorAll('.tab-button');
        const tabPanes = this.container.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // 選択されたタブをアクティブにする
        const activeButton = this.container.querySelector(`[data-tab="${tabId}"]`);
        const activePane = this.container.querySelector(`#${tabId}-tab-content`);
        
        if (activeButton) activeButton.classList.add('active');
        if (activePane) activePane.classList.add('active');
        
        // タブ固有のコンテンツを読み込み
        this.loadTabContent(tabId);
    }
    
    /**
     * タブコンテンツの読み込み
     */
    loadTabContent(tabId) {
        switch (tabId) {
            case 'basic':
                this.displayBasicContent();
                break;
            case 'insights':
                this.displayInsightsContent();
                break;
            case 'dialogue':
                this.displayDialogueContent();
                break;
            case 'metaphor':
                this.displayMetaphorContent();
                break;
            case 'practice':
                this.displayPracticeContent();
                break;
            case 'export':
                this.displayExportContent();
                break;
        }
    }
    
    /**
     * 基本コンテンツの表示
     */
    displayBasicContent() {
        const basicPane = this.container.querySelector('#basic-tab-content');
        if (basicPane && this.analysisResult) {
            basicPane.innerHTML = `
                <div class="basic-results-fallback">
                    <h3>分析結果</h3>
                    <div class="result-summary">
                        <div class="dimension">
                            <h4>Engine (創造力)</h4>
                            <p>スコア: ${this.analysisResult.engine?.score || 'N/A'}</p>
                            <p>特徴: ${this.analysisResult.engine?.traits?.join(', ') || 'N/A'}</p>
                        </div>
                        <div class="dimension">
                            <h4>Interface (対人力)</h4>
                            <p>スコア: ${this.analysisResult.interface?.score || 'N/A'}</p>
                            <p>特徴: ${this.analysisResult.interface?.traits?.join(', ') || 'N/A'}</p>
                        </div>
                        <div class="dimension">
                            <h4>Safemode (安定性)</h4>
                            <p>スコア: ${this.analysisResult.safemode?.score || 'N/A'}</p>
                            <p>特徴: ${this.analysisResult.safemode?.traits?.join(', ') || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * 洞察コンテンツの表示
     */
    displayInsightsContent() {
        const insightsPane = this.container.querySelector('#insights-tab-content');
        if (insightsPane) {
            insightsPane.innerHTML = '<div class="tab-placeholder">洞察コンテンツは準備中です</div>';
        }
    }
    
    /**
     * 対話コンテンツの表示
     */
    displayDialogueContent() {
        const dialoguePane = this.container.querySelector('#dialogue-tab-content');
        if (dialoguePane) {
            dialoguePane.innerHTML = '<div class="tab-placeholder">対話コンテンツは準備中です</div>';
        }
    }
    
    /**
     * メタファーコンテンツの表示
     */
    displayMetaphorContent() {
        const metaphorPane = this.container.querySelector('#metaphor-tab-content');
        if (metaphorPane) {
            metaphorPane.innerHTML = '<div class="tab-placeholder">メタファーコンテンツは準備中です</div>';
        }
    }
    
    /**
     * 実践コンテンツの表示
     */
    displayPracticeContent() {
        const practicePane = this.container.querySelector('#practice-tab-content');
        if (practicePane) {
            practicePane.innerHTML = '<div class="tab-placeholder">実践コンテンツは準備中です</div>';
        }
    }
    
    /**
     * エクスポートコンテンツの表示
     */
    displayExportContent() {
        const exportPane = this.container.querySelector('#export-tab-content');
        if (exportPane) {
            exportPane.innerHTML = '<div class="tab-placeholder">エクスポート機能は準備中です</div>';
        }
    }
    
    /**
     * メインビューに切り替え（基本タブに戻る）
     */
    switchToMainView() {
        console.log('🔄 switchToMainView: メインビューに切り替え開始');
        
        try {
            // 基本タブに切り替え
            this.switchToTab('basic');
            
            // コンテナが存在する場合は表示状態を確認
            if (this.container) {
                this.container.style.display = 'block';
                console.log('✅ メインビューに切り替え完了');
            } else {
                console.warn('⚠️ コンテナが見つかりません');
            }
            
        } catch (error) {
            console.error('❌ switchToMainView エラー:', error);
            this.showError('メインビューへの切り替えに失敗しました');
        }
    }
    
    /**
     * クリーンアップ処理
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isInitialized = false;
        
        console.log('🧹 VirtualPersonaResultsView: クリーンアップ完了');
    }
}

// グローバルスコープに公開
window.VirtualPersonaResultsView = VirtualPersonaResultsView;
console.log('✅ VirtualPersonaResultsView.js loaded');

// // 自動初期化を無効化（results.htmlで手動初期化するため）
// // document.addEventListener('DOMContentLoaded', async () => {
// //     console.log('🎬 DOM読み込み完了 - VirtualPersonaResultsView自動初期化開始');
//     
//     // virtual-persona-containerが存在する場合は自動初期化
//     const container = document.getElementById('virtual-persona-container');
//     if (container) {
//         try {
//             // ローディングオーバーレイを非表示
//             const loadingOverlay = document.getElementById('loading-overlay');
//             if (loadingOverlay) {
//                 setTimeout(() => {
//                     loadingOverlay.classList.remove('active');
//                 }, 1000);
//             }
//             
//             // VirtualPersonaResultsViewの初期化
//             const virtualPersonaView = new VirtualPersonaResultsView('virtual-persona-container');
//             await virtualPersonaView.displayResults();
//             
//             console.log('🎉 VirtualPersonaResultsView自動初期化完了');
//             
//         } catch (error) {
//             console.error('❌ VirtualPersonaResultsView自動初期化エラー:', error);
//             
//             // エラー表示
//             const errorContainer = document.getElementById('error-container');
//             const errorMessage = document.getElementById('error-message');
//             if (errorContainer && errorMessage) {
//                 errorMessage.textContent = error.message;
//                 errorContainer.style.display = 'block';
//             }
//         }
//     }
// });