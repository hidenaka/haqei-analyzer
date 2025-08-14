/**
 * Zone D Integration Manager - Interactive Enhancement
 * Zone D（確信度・フィードバック・ハンドオフ）の統合とインタラクティブ機能
 * 
 * @class ZoneDIntegrator
 * @version 1.0.0
 * @date 2025-08-12
 */

class ZoneDIntegrator {
    constructor() {
        this.confidenceMeter = null;
        this.feedbackCollector = null;
        this.handoffManager = null;
        
        this.analysisData = null;
        this.isInitialized = false;
        this.updateInterval = null;
        
        // イベントリスナー管理
        this.eventListeners = new Map();
        
        // アニメーション設定
        this.animationConfig = {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            stagger: 200
        };
        
        this.init();
    }
    
    /**
     * 初期化
     */
    async init() {
        try {
            // Zone Dコンポーネントをロード
            await this.loadComponents();
            
            // イベントリスナー設定
            this.setupEventListeners();
            
            // リアルタイム更新開始
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('Zone D Integration initialized successfully');
        } catch (error) {
            console.error('Zone D Integration initialization failed:', error);
        }
    }
    
    /**
     * Zone Dコンポーネントをロード
     */
    async loadComponents() {
        try {
            // 既存のグローバルコンポーネントを使用
            if (typeof ConfidenceMeter !== 'undefined') {
                this.confidenceMeter = new ConfidenceMeter();
            }
            
            if (typeof FeedbackCollector !== 'undefined') {
                this.feedbackCollector = new FeedbackCollector();
            }
            
            if (typeof HandoffManager !== 'undefined') {
                this.handoffManager = new HandoffManager();
            }
            
            // コンポーネントが読み込まれていない場合は動的ロード
            if (!this.confidenceMeter || !this.feedbackCollector || !this.handoffManager) {
                console.log('Loading components dynamically...');
                
                if (!this.confidenceMeter) {
                    await this.loadScript('public/js/zone-d/ConfidenceMeter.js');
                    this.confidenceMeter = new ConfidenceMeter();
                }
                
                if (!this.feedbackCollector) {
                    await this.loadScript('public/js/zone-d/FeedbackCollector.js');
                    this.feedbackCollector = new FeedbackCollector();
                }
                
                if (!this.handoffManager) {
                    await this.loadScript('public/js/zone-d/HandoffManager.js');
                    this.handoffManager = new HandoffManager();
                }
            }
            
            // CSS読み込み確認
            if (!document.querySelector('link[href*="zone-d.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'public/css/zone-d.css';
                document.head.appendChild(link);
            }
            
            console.log('Zone D components loaded successfully');
        } catch (error) {
            console.error('Failed to load components:', error);
            throw error;
        }
    }
    
    /**
     * スクリプト動的ロード
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // 既にロードされているかチェック
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Zone Dを結果画面に統合
     */
    integrateWithResults(analysisResults, container) {
        if (!this.isInitialized) {
            console.warn('Zone D not initialized yet');
            return;
        }
        
        this.analysisData = analysisResults;
        
        // Zone D コンテナを作成
        const zoneDContainer = this.createZoneDContainer();
        
        // 既存の結果コンテナに追加
        if (container) {
            container.appendChild(zoneDContainer);
        } else {
            // デフォルト位置に挿入
            const resultsContainer = document.querySelector('.results-container') 
                || document.querySelector('#results')
                || document.body;
            resultsContainer.appendChild(zoneDContainer);
        }
        
        // コンポーネントを順次表示（ステージ演出）
        this.animateZoneDReveal(zoneDContainer);
        
        // データを各コンポーネントに設定
        this.updateAllComponents(analysisResults);
        
        return zoneDContainer;
    }
    
    /**
     * Zone D コンテナを作成
     */
    createZoneDContainer() {
        const container = document.createElement('div');
        container.id = 'zone-d-container';
        container.className = 'zone-d-integration';
        
        container.innerHTML = `
            <div class="zone-d-header">
                <h2>🔍 診断の確実性と次のステップ</h2>
                <p class="zone-d-description">
                    この診断は「理解の器」です。確実性を確認し、疑問があれば反証を歓迎し、
                    さらなる洞察のために次のAIに引き継ぐことができます。
                </p>
            </div>
            
            <div class="zone-d-components">
                <div class="confidence-section" id="confidence-section">
                    <!-- ConfidenceMeter がここに表示 -->
                </div>
                
                <div class="feedback-section" id="feedback-section">
                    <!-- FeedbackCollector がここに表示 -->
                </div>
                
                <div class="handoff-section" id="handoff-section">
                    <!-- HandoffManager がここに表示 -->
                </div>
            </div>
            
            <div class="zone-d-footer">
                <div class="paradigm-shift-notice">
                    <div class="notice-content">
                        <span class="notice-icon">💡</span>
                        <div class="notice-text">
                            <strong>パラダイムシフト:</strong> 
                            この診断は「答えを与える」のではなく「理解の器を提供する」ツールです。
                            不確実性を認識し、あなたの反証を歓迎します。
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }
    
    /**
     * Zone D の段階的表示アニメーション
     */
    async animateZoneDReveal(container) {
        const sections = container.querySelectorAll('.confidence-section, .feedback-section, .handoff-section');
        
        // 初期状態を設定
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = `all ${this.animationConfig.duration}ms ${this.animationConfig.easing}`;
        });
        
        // ヘッダーアニメーション
        const header = container.querySelector('.zone-d-header');
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        
        // 段階的表示
        await this.delay(300);
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
        
        // セクションを順次表示
        for (let i = 0; i < sections.length; i++) {
            await this.delay(this.animationConfig.stagger);
            sections[i].style.opacity = '1';
            sections[i].style.transform = 'translateY(0)';
        }
        
        // フッター表示
        await this.delay(this.animationConfig.stagger);
        const footer = container.querySelector('.zone-d-footer');
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(20px)';
        footer.style.transition = `all ${this.animationConfig.duration}ms ${this.animationConfig.easing}`;
        
        await this.delay(100);
        footer.style.opacity = '1';
        footer.style.transform = 'translateY(0)';
    }
    
    /**
     * 全コンポーネントを更新
     */
    updateAllComponents(analysisResults) {
        // 確信度計算
        const confidence = this.calculateOverallConfidence(analysisResults);
        
        // ConfidenceMeter 更新
        const confidenceContainer = document.getElementById('confidence-section');
        if (confidenceContainer && this.confidenceMeter) {
            this.confidenceMeter.render(confidenceContainer);
            this.confidenceMeter.updateConfidence(analysisResults, confidence);
        }
        
        // FeedbackCollector 更新
        const feedbackContainer = document.getElementById('feedback-section');
        if (feedbackContainer && this.feedbackCollector) {
            this.feedbackCollector.render(feedbackContainer);
            this.feedbackCollector.initializeFeedback(analysisResults, confidence);
        }
        
        // HandoffManager 更新
        const handoffContainer = document.getElementById('handoff-section');
        if (handoffContainer && this.handoffManager) {
            this.handoffManager.render(handoffContainer);
            this.handoffManager.setAnalysisData(analysisResults, confidence);
            this.handoffManager.setUserContext({
                language: 'ja',
                device: this.detectDevice(),
                sessionId: this.generateSessionId()
            });
        }
    }
    
    /**
     * 総合確信度を計算
     */
    calculateOverallConfidence(results) {
        let confidence = 70; // ベース確信度
        
        // データの完全性チェック
        if (!results.tripleOS) confidence -= 20;
        if (!results.hexagram) confidence -= 10;
        if (!results.metrics) confidence -= 15;
        
        // Triple OS のバランスチェック
        if (results.tripleOS) {
            const values = Object.values(results.tripleOS);
            const max = Math.max(...values);
            const min = Math.min(...values);
            const variance = max - min;
            
            // 適度な分散は良い兆候
            if (variance < 0.1) confidence -= 5; // 均一すぎる
            if (variance > 0.7) confidence -= 10; // 極端すぎる
        }
        
        // シナジー・テンション値チェック
        if (results.metrics) {
            const { synergy, tension } = results.metrics;
            if (synergy && tension) {
                if (synergy + tension > 0.9 && synergy + tension < 1.1) {
                    confidence += 5; // 妥当な関係性
                }
            }
        }
        
        return Math.max(20, Math.min(95, confidence)); // 20-95%の範囲
    }
    
    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // リアルタイム更新イベント
        this.addEventListener('analysisUpdate', (event) => {
            this.updateAllComponents(event.detail);
        });
        
        // フィードバック受信イベント
        this.addEventListener('feedbackReceived', (event) => {
            this.handleFeedbackReceived(event.detail);
        });
        
        // ハンドオフ完了イベント
        this.addEventListener('handoffCompleted', (event) => {
            this.handleHandoffCompleted(event.detail);
        });
        
        // ウィンドウリサイズイベント
        this.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 300));
    }
    
    /**
     * イベントリスナー追加ヘルパー
     */
    addEventListener(eventType, handler) {
        const target = eventType === 'resize' ? window : document;
        target.addEventListener(eventType, handler);
        
        // 削除用に保存
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push({ target, handler });
    }
    
    /**
     * フィードバック受信ハンドラー
     */
    handleFeedbackReceived(feedbackData) {
        console.log('Feedback received:', feedbackData);
        
        // 確信度を再計算
        let newConfidence = this.calculateOverallConfidence(this.analysisData);
        
        // フィードバックタイプに基づく調整
        switch (feedbackData.type) {
            case 'disagree':
                newConfidence -= 15;
                break;
            case 'partial':
                newConfidence -= 5;
                break;
            case 'missing':
                newConfidence -= 10;
                break;
            case 'misunderstood':
                newConfidence -= 8;
                break;
        }
        
        // 確信度メーターを更新
        if (this.confidenceMeter) {
            this.confidenceMeter.updateConfidence(this.analysisData, newConfidence);
        }
        
        // KPI更新イベントを発火
        this.dispatchEvent('kpiUpdate', {
            type: 'feedback',
            data: feedbackData,
            newConfidence: newConfidence
        });
    }
    
    /**
     * ハンドオフ完了ハンドラー
     */
    handleHandoffCompleted(handoffData) {
        console.log('Handoff completed:', handoffData);
        
        // KPI更新イベントを発火
        this.dispatchEvent('kpiUpdate', {
            type: 'handoff',
            data: handoffData
        });
        
        // ユーザー体験向上のための遅延実行
        setTimeout(() => {
            this.showHandoffFollowUp(handoffData);
        }, 3000);
    }
    
    /**
     * ハンドオフ後のフォローアップ表示
     */
    showHandoffFollowUp(handoffData) {
        const followUp = document.createElement('div');
        followUp.className = 'handoff-followup';
        followUp.innerHTML = `
            <div class="followup-content">
                <h4>🎯 ${handoffData.destination.name}への準備が完了しました</h4>
                <p>診断データが正常に準備されました。継続的な成長をサポートします。</p>
                <div class="followup-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">
                        了解
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(followUp);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (followUp.parentNode) {
                followUp.parentNode.removeChild(followUp);
            }
        }, 8000);
    }
    
    /**
     * リアルタイム更新を開始
     */
    startRealTimeUpdates() {
        // 5秒間隔でデータ整合性チェック
        this.updateInterval = setInterval(() => {
            this.performDataIntegrityCheck();
        }, 5000);
    }
    
    /**
     * データ整合性チェック
     */
    performDataIntegrityCheck() {
        if (!this.analysisData) return;
        
        // LocalStorageのデータと比較
        const storedData = localStorage.getItem('haqei_latest_analysis');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (JSON.stringify(parsed) !== JSON.stringify(this.analysisData)) {
                    console.log('Data inconsistency detected, updating...');
                    this.updateAllComponents(parsed);
                    this.analysisData = parsed;
                }
            } catch (e) {
                console.warn('Failed to parse stored analysis data');
            }
        }
    }
    
    /**
     * カスタムイベントを発火
     */
    dispatchEvent(eventType, detail) {
        const event = new CustomEvent(eventType, { detail });
        document.dispatchEvent(event);
    }
    
    /**
     * リサイズハンドラー
     */
    handleResize() {
        // モバイル対応の再計算
        const zoneDContainer = document.getElementById('zone-d-container');
        if (zoneDContainer) {
            const isMobile = window.innerWidth < 768;
            zoneDContainer.classList.toggle('mobile-layout', isMobile);
        }
    }
    
    /**
     * クリーンアップ
     */
    destroy() {
        // インターバルクリア
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // イベントリスナー削除
        this.eventListeners.forEach((listeners, eventType) => {
            listeners.forEach(({ target, handler }) => {
                target.removeEventListener(eventType, handler);
            });
        });
        this.eventListeners.clear();
        
        // コンポーネントクリーンアップ
        if (this.confidenceMeter?.destroy) this.confidenceMeter.destroy();
        if (this.feedbackCollector?.destroy) this.feedbackCollector.destroy();
        if (this.handoffManager?.destroy) this.handoffManager.destroy();
        
        console.log('Zone D Integration destroyed');
    }
    
    /**
     * ユーティリティメソッド
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
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
    
    detectDevice() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }
    
    generateSessionId() {
        return `zd_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// グローバル初期化
window.zoneDIntegrator = new ZoneDIntegrator();

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZoneDIntegrator;
}