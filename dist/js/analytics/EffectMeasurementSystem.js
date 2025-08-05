/**
 * 効果測定システム
 * 
 * HaQeiプロジェクトの各種KPIを測定・記録・分析するシステム
 * 
 * @version 1.0.0
 * @date 2025-08-03
 */

class EffectMeasurementSystem {
    constructor() {
        this.storageKey = 'haqei_analytics';
        this.sessionKey = 'haqei_session';
        this.events = [];
        this.session = this.initializeSession();
        this.setupEventListeners();
    }

    /**
     * セッション初期化
     */
    initializeSession() {
        let session = sessionStorage.getItem(this.sessionKey);
        
        if (!session) {
            session = {
                id: this.generateSessionId(),
                startTime: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                pageViews: 0,
                events: []
            };
            sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        } else {
            session = JSON.parse(session);
        }
        
        return session;
    }

    /**
     * セッションID生成
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * イベントトラッキング
     */
    trackEvent(category, action, label = null, value = null) {
        const event = {
            timestamp: new Date().toISOString(),
            sessionId: this.session.id,
            category,
            action,
            label,
            value,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // セッションに追加
        this.session.events.push(event);
        this.session.lastActivity = event.timestamp;
        sessionStorage.setItem(this.sessionKey, JSON.stringify(this.session));

        // ローカルストレージに保存
        this.saveEvent(event);

        // リアルタイム分析
        this.analyzeEvent(event);

        console.log('📊 Event tracked:', event);
    }

    /**
     * ページビュートラッキング
     */
    trackPageView(pageName = null) {
        this.session.pageViews++;
        
        const pageView = {
            timestamp: new Date().toISOString(),
            sessionId: this.session.id,
            page: pageName || document.title,
            url: window.location.href,
            referrer: document.referrer,
            duration: 0 // 後で計算
        };

        this.trackEvent('pageview', 'view', pageView.page);
    }

    /**
     * 診断開始トラッキング
     */
    trackDiagnosisStart(diagnosisType) {
        this.trackEvent('diagnosis', 'start', diagnosisType);
        
        // 診断開始時刻を記録
        sessionStorage.setItem('diagnosis_start_time', Date.now());
    }

    /**
     * 診断完了トラッキング
     */
    trackDiagnosisComplete(diagnosisType, result) {
        const startTime = sessionStorage.getItem('diagnosis_start_time');
        const duration = startTime ? Date.now() - parseInt(startTime) : null;
        
        this.trackEvent('diagnosis', 'complete', diagnosisType, duration);
        
        // 結果の詳細を記録
        if (result) {
            this.trackEvent('diagnosis_result', result.primaryOS || 'unknown', diagnosisType);
        }
    }

    /**
     * コンバージョントラッキング
     */
    trackConversion(conversionType, value = null) {
        this.trackEvent('conversion', conversionType, null, value);
        
        // コンバージョン率の計算
        this.calculateConversionRate();
    }

    /**
     * エラートラッキング
     */
    trackError(errorType, errorMessage, errorStack = null) {
        this.trackEvent('error', errorType, errorMessage);
        
        // エラー詳細を保存
        const errorData = {
            timestamp: new Date().toISOString(),
            type: errorType,
            message: errorMessage,
            stack: errorStack,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.saveError(errorData);
    }

    /**
     * カスタムメトリクストラッキング
     */
    trackMetric(metricName, value, unit = null) {
        this.trackEvent('metric', metricName, unit, value);
    }

    /**
     * イベント保存
     */
    saveEvent(event) {
        try {
            let analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            
            if (!analytics.events) {
                analytics.events = [];
            }
            
            analytics.events.push(event);
            
            // 最大1000件まで保存（古いものから削除）
            if (analytics.events.length > 1000) {
                analytics.events = analytics.events.slice(-1000);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(analytics));
        } catch (error) {
            console.error('Failed to save event:', error);
        }
    }

    /**
     * エラー保存
     */
    saveError(errorData) {
        try {
            let analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            
            if (!analytics.errors) {
                analytics.errors = [];
            }
            
            analytics.errors.push(errorData);
            
            // 最大100件まで保存
            if (analytics.errors.length > 100) {
                analytics.errors = analytics.errors.slice(-100);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(analytics));
        } catch (error) {
            console.error('Failed to save error:', error);
        }
    }

    /**
     * リアルタイムイベント分析
     */
    analyzeEvent(event) {
        // ファネル分析
        if (event.category === 'diagnosis') {
            this.updateFunnelMetrics(event);
        }
        
        // エンゲージメント分析
        if (event.category === 'interaction') {
            this.updateEngagementMetrics(event);
        }
    }

    /**
     * ファネルメトリクス更新
     */
    updateFunnelMetrics(event) {
        let funnel = JSON.parse(localStorage.getItem('haqei_funnel') || '{}');
        
        if (!funnel[event.label]) {
            funnel[event.label] = {
                started: 0,
                completed: 0,
                abandoned: 0
            };
        }
        
        if (event.action === 'start') {
            funnel[event.label].started++;
        } else if (event.action === 'complete') {
            funnel[event.label].completed++;
        }
        
        localStorage.setItem('haqei_funnel', JSON.stringify(funnel));
    }

    /**
     * エンゲージメントメトリクス更新
     */
    updateEngagementMetrics(event) {
        let engagement = JSON.parse(localStorage.getItem('haqei_engagement') || '{}');
        
        const today = new Date().toISOString().split('T')[0];
        
        if (!engagement[today]) {
            engagement[today] = {
                interactions: 0,
                uniqueSessions: new Set(),
                totalDuration: 0
            };
        }
        
        engagement[today].interactions++;
        engagement[today].uniqueSessions.add(this.session.id);
        
        localStorage.setItem('haqei_engagement', JSON.stringify(engagement));
    }

    /**
     * コンバージョン率計算
     */
    calculateConversionRate() {
        const analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        const funnel = JSON.parse(localStorage.getItem('haqei_funnel') || '{}');
        
        const metrics = {
            visitToQuickDiagnosis: 0,
            quickToOSAnalysis: 0,
            osAnalysisToPurchase: 0,
            overallConversion: 0
        };
        
        // 計算ロジック（簡略版）
        if (funnel.quick_analyzer) {
            metrics.visitToQuickDiagnosis = (funnel.quick_analyzer.completed / funnel.quick_analyzer.started) * 100;
        }
        
        return metrics;
    }

    /**
     * メトリクスサマリー取得
     */
    getMetricsSummary() {
        const analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        const funnel = JSON.parse(localStorage.getItem('haqei_funnel') || '{}');
        
        return {
            totalEvents: analytics.events ? analytics.events.length : 0,
            totalErrors: analytics.errors ? analytics.errors.length : 0,
            sessionCount: this.getUniqueSessionCount(),
            conversionRate: this.calculateConversionRate(),
            funnelData: funnel,
            lastUpdate: new Date().toISOString()
        };
    }

    /**
     * ユニークセッション数取得
     */
    getUniqueSessionCount() {
        const analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        
        if (!analytics.events) return 0;
        
        const uniqueSessions = new Set(analytics.events.map(e => e.sessionId));
        return uniqueSessions.size;
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // ページ離脱時の処理
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session', 'end', null, Date.now() - new Date(this.session.startTime).getTime());
        });

        // エラーハンドリング
        window.addEventListener('error', (event) => {
            this.trackError('javascript_error', event.message, event.error ? event.error.stack : null);
        });

        // パフォーマンス測定
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    this.trackMetric('page_load_time', pageLoadTime, 'ms');
                }, 0);
            });
        }
    }

    /**
     * データエクスポート
     */
    exportData() {
        const analytics = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        const funnel = JSON.parse(localStorage.getItem('haqei_funnel') || '{}');
        const engagement = JSON.parse(localStorage.getItem('haqei_engagement') || '{}');
        
        return {
            exportDate: new Date().toISOString(),
            analytics,
            funnel,
            engagement,
            summary: this.getMetricsSummary()
        };
    }

    /**
     * データクリア
     */
    clearData() {
        if (confirm('すべての分析データをクリアしますか？')) {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem('haqei_funnel');
            localStorage.removeItem('haqei_engagement');
            console.log('✅ Analytics data cleared');
        }
    }
}

// グローバルインスタンス作成
const effectMeasurement = new EffectMeasurementSystem();

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EffectMeasurementSystem;
}