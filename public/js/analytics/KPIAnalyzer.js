/**
 * KPI Analyzer - Comprehensive Performance Measurement System
 * OS Analyzer の効果測定とパフォーマンス分析システム
 * 
 * @class KPIAnalyzer
 * @version 1.0.0
 * @date 2025-08-12
 */

class KPIAnalyzer {
    constructor() {
        
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.metrics = new Map();
        
        // KPI目標値
        this.targets = {
            completionRate: 0.75,           // 75%以上の完了率
            disagreementRate: 0.20,         // 20%以上の不一致フィードバック率
            handoffRate: 0.45,              // 45%以上のハンドオフ率
            averageConfidence: 70,          // 70%以上の平均確信度
            mobileCompletionRate: 0.70,     // 70%以上のモバイル完了率
            sessionDuration: 300,           // 5分以内の平均セッション時間
            touchTargetCompliance: 0.90,    // 90%以上のタッチターゲット適合率
            paradigmShiftScore: 0.60        // 60%以上のパラダイムシフト効果
        };
        
        // イベント追跡設定
        this.trackingEvents = [
            'session_start', 'question_start', 'question_answer', 'question_complete',
            'analysis_start', 'analysis_complete', 'results_view',
            'confidence_check', 'feedback_submit', 'handoff_complete',
            'mobile_interaction', 'error_occurred', 'session_end'
        ];
        
        // データストレージキー
        this.storageKeys = {
            sessions: 'haqei_kpi_sessions',
            metrics: 'haqei_kpi_metrics', 
            goals: 'haqei_kpi_goals',
            reports: 'haqei_kpi_reports'
        };
        
        // リアルタイム計算バッファ
        this.realtimeBuffer = {
            events: [],
            maxSize: 1000,
            flushInterval: 30000 // 30秒
        };
        
        this.init();
    }
    
    /**
     * 初期化
     */
    init() {
        console.log('KPI Analyzer initializing...');
        
        // セッション開始記録
        this.trackEvent('session_start', {
            sessionId: this.sessionId,
            timestamp: this.startTime,
            userAgent: navigator.userAgent,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            device: this.detectDevice(),
            referrer: document.referrer
        });
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        // データクリーンアップ
        this.cleanupOldData();
        
        // リアルタイム処理開始
        this.startRealtimeProcessing();
        
        console.log('KPI Analyzer initialized for session:', this.sessionId);
    }
    
    /**
     * イベント追跡
     */
    trackEvent(eventType, data = {}) {
        const event = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            type: eventType,
            timestamp: Date.now(),
            data: { ...data },
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // リアルタイムバッファに追加
        this.realtimeBuffer.events.push(event);
        
        // バッファサイズ制限
        if (this.realtimeBuffer.events.length > this.realtimeBuffer.maxSize) {
            this.realtimeBuffer.events.shift();
        }
        
        // LocalStorageに永続化
        this.persistEvent(event);
        
        // リアルタイム分析
        this.processEventRealtime(event);
        
        console.log(`KPI Event: ${eventType}`, data);
        
        return event;
    }
    
    /**
     * ユーザー体験指標の計算
     */
    calculateUserExperienceKPIs() {
        const sessions = this.getStoredSessions();
        
        if (sessions.length === 0) {
            return this.getEmptyKPIs();
        }
        
        // 診断完了率
        const completedSessions = sessions.filter(s => s.events.some(e => e.type === 'analysis_complete'));
        const completionRate = completedSessions.length / sessions.length;
        
        // 平均セッション時間
        const sessionDurations = sessions.map(s => {
            const start = s.events.find(e => e.type === 'session_start');
            const end = s.events.find(e => e.type === 'session_end') || 
                      s.events[s.events.length - 1];
            return end.timestamp - start.timestamp;
        });
        const avgSessionDuration = sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length;
        
        // 離脱率分析
        const dropoffAnalysis = this.calculateDropoffRates(sessions);
        
        // 質問完了率
        const questionCompletionRates = this.calculateQuestionCompletionRates(sessions);
        
        return {
            completionRate: {
                value: completionRate,
                target: this.targets.completionRate,
                status: completionRate >= this.targets.completionRate ? 'success' : 'warning'
            },
            avgSessionDuration: {
                value: avgSessionDuration / 1000, // 秒単位
                target: this.targets.sessionDuration,
                status: avgSessionDuration <= this.targets.sessionDuration * 1000 ? 'success' : 'warning'
            },
            dropoffAnalysis,
            questionCompletionRates
        };
    }
    
    /**
     * Zone D効果測定
     */
    calculateZoneDKPIs() {
        const sessions = this.getStoredSessions();
        const zoneDSessions = sessions.filter(s => 
            s.events.some(e => e.type === 'confidence_check' || e.type === 'feedback_submit' || e.type === 'handoff_complete')
        );
        
        if (zoneDSessions.length === 0) {
            return this.getEmptyZoneDKPIs();
        }
        
        // 不一致フィードバック率
        const feedbackEvents = this.getEventsByType('feedback_submit');
        const disagreementFeedbacks = feedbackEvents.filter(e => 
            e.data.type === 'disagree' || e.data.type === 'partial'
        );
        const disagreementRate = disagreementFeedbacks.length / Math.max(feedbackEvents.length, 1);
        
        // ハンドオフ完了率
        const handoffEvents = this.getEventsByType('handoff_complete');
        const handoffRate = handoffEvents.length / Math.max(zoneDSessions.length, 1);
        
        // 平均確信度
        const confidenceEvents = this.getEventsByType('confidence_check');
        const confidenceValues = confidenceEvents.map(e => e.data.confidence || 0);
        const avgConfidence = confidenceValues.length > 0 ? 
            confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length : 0;
        
        // フィードバック品質分析
        const feedbackQuality = this.analyzeFeedbackQuality(feedbackEvents);
        
        // ハンドオフ先分析
        const handoffDestinations = this.analyzeHandoffDestinations(handoffEvents);
        
        return {
            disagreementRate: {
                value: disagreementRate,
                target: this.targets.disagreementRate,
                status: disagreementRate >= this.targets.disagreementRate ? 'success' : 'warning'
            },
            handoffRate: {
                value: handoffRate,
                target: this.targets.handoffRate,
                status: handoffRate >= this.targets.handoffRate ? 'success' : 'warning'
            },
            avgConfidence: {
                value: avgConfidence,
                target: this.targets.averageConfidence,
                status: avgConfidence >= this.targets.averageConfidence ? 'success' : 'warning'
            },
            feedbackQuality,
            handoffDestinations
        };
    }
    
    /**
     * モバイル最適化効果測定
     */
    calculateMobileKPIs() {
        const sessions = this.getStoredSessions();
        const mobileSessions = sessions.filter(s => this.isMobileSession(s));
        
        if (mobileSessions.length === 0) {
            return this.getEmptyMobileKPIs();
        }
        
        // モバイル完了率
        const mobileCompletedSessions = mobileSessions.filter(s => 
            s.events.some(e => e.type === 'analysis_complete')
        );
        const mobileCompletionRate = mobileCompletedSessions.length / mobileSessions.length;
        
        // タッチインタラクション分析
        const touchInteractions = this.analyzeTouchInteractions(mobileSessions);
        
        // パフォーマンス分析
        const performanceMetrics = this.analyzeMobilePerformance(mobileSessions);
        
        // デバイス別分析
        const deviceAnalysis = this.analyzeDeviceTypes(mobileSessions);
        
        return {
            mobileCompletionRate: {
                value: mobileCompletionRate,
                target: this.targets.mobileCompletionRate,
                status: mobileCompletionRate >= this.targets.mobileCompletionRate ? 'success' : 'warning'
            },
            touchInteractions,
            performanceMetrics,
            deviceAnalysis
        };
    }
    
    /**
     * パラダイムシフト効果測定
     */
    calculateParadigmShiftKPIs() {
        const sessions = this.getStoredSessions();
        
        // 反証歓迎度
        const feedbackEvents = this.getEventsByType('feedback_submit');
        const proactiveFeedbacks = feedbackEvents.filter(e => 
            e.data.specificFeedback && e.data.specificFeedback.length > 20
        );
        const feedbackEngagement = proactiveFeedbacks.length / Math.max(sessions.length, 1);
        
        // 不確実性受容度
        const confidenceEvents = this.getEventsByType('confidence_check');
        const lowConfidenceAcceptance = confidenceEvents.filter(e => 
            e.data.confidence < 70 && !e.data.userConcern
        ).length / Math.max(confidenceEvents.length, 1);
        
        // 継続利用意向
        const repeatSessions = this.calculateRepeatUsage();
        
        // AI引き継ぎ意欲
        const handoffWillingness = this.getEventsByType('handoff_complete').length / Math.max(sessions.length, 1);
        
        // 総合パラダイムシフトスコア
        const paradigmShiftScore = (
            feedbackEngagement * 0.3 +
            lowConfidenceAcceptance * 0.2 +
            repeatSessions * 0.25 +
            handoffWillingness * 0.25
        );
        
        return {
            paradigmShiftScore: {
                value: paradigmShiftScore,
                target: this.targets.paradigmShiftScore,
                status: paradigmShiftScore >= this.targets.paradigmShiftScore ? 'success' : 'warning'
            },
            feedbackEngagement: {
                value: feedbackEngagement,
                description: '積極的なフィードバック提供率'
            },
            lowConfidenceAcceptance: {
                value: lowConfidenceAcceptance,
                description: '低確信度結果の受容率'
            },
            repeatUsage: {
                value: repeatSessions,
                description: 'リピート利用率'
            },
            handoffWillingness: {
                value: handoffWillingness,
                description: 'AI引き継ぎ意欲'
            }
        };
    }
    
    /**
     * 包括的KPIダッシュボードデータ生成
     */
    generateDashboardData() {
        const userExperience = this.calculateUserExperienceKPIs();
        const zoneD = this.calculateZoneDKPIs();
        const mobile = this.calculateMobileKPIs();
        const paradigmShift = this.calculateParadigmShiftKPIs();
        
        // 総合スコア計算
        const overallScore = this.calculateOverallScore({
            userExperience, zoneD, mobile, paradigmShift
        });
        
        // トレンド分析
        const trends = this.calculateTrends();
        
        // アラート生成
        const alerts = this.generateAlerts({
            userExperience, zoneD, mobile, paradigmShift
        });
        
        return {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            overallScore,
            categories: {
                userExperience,
                zoneD,
                mobile,
                paradigmShift
            },
            trends,
            alerts,
            summary: this.generateSummary({ userExperience, zoneD, mobile, paradigmShift })
        };
    }
    
    /**
     * リアルタイムダッシュボード更新
     */
    updateDashboardRealtime() {
        const dashboardData = this.generateDashboardData();
        
        // カスタムイベント発火
        const event = new CustomEvent('kpiDashboardUpdate', {
            detail: dashboardData
        });
        document.dispatchEvent(event);
        
        return dashboardData;
    }
    
    /**
     * 週次レポート生成
     */
    generateWeeklyReport() {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyData = this.getDataByDateRange(startDate, endDate);
        const previousWeekData = this.getDataByDateRange(
            new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            startDate
        );
        
        return {
            reportType: 'weekly',
            period: { start: startDate.toISOString(), end: endDate.toISOString() },
            current: this.analyzeDataPeriod(weeklyData),
            previous: this.analyzeDataPeriod(previousWeekData),
            comparison: this.compareDataPeriods(weeklyData, previousWeekData),
            recommendations: this.generateRecommendations(weeklyData),
            charts: this.generateChartData(weeklyData)
        };
    }
    
    /**
     * 月次レポート生成
     */
    generateMonthlyReport() {
        const endDate = new Date();
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        
        const monthlyData = this.getDataByDateRange(startDate, endDate);
        const previousMonthEnd = new Date(startDate.getTime() - 1);
        const previousMonthStart = new Date(previousMonthEnd.getFullYear(), previousMonthEnd.getMonth(), 1);
        const previousMonthData = this.getDataByDateRange(previousMonthStart, previousMonthEnd);
        
        return {
            reportType: 'monthly',
            period: { start: startDate.toISOString(), end: endDate.toISOString() },
            current: this.analyzeDataPeriod(monthlyData),
            previous: this.analyzeDataPeriod(previousMonthData),
            comparison: this.compareDataPeriods(monthlyData, previousMonthData),
            recommendations: this.generateRecommendations(monthlyData),
            charts: this.generateChartData(monthlyData),
            goals: this.evaluateMonthlyGoals(monthlyData)
        };
    }
    
    /**
     * A/Bテスト結果分析
     */
    analyzeABTest(testId) {
        const testEvents = this.getEventsByType('ab_test').filter(e => e.data.testId === testId);
        
        if (testEvents.length === 0) {
            return { error: 'No A/B test data found for test ID: ' + testId };
        }
        
        const variantA = testEvents.filter(e => e.data.variant === 'A');
        const variantB = testEvents.filter(e => e.data.variant === 'B');
        
        return {
            testId,
            totalSessions: testEvents.length,
            variants: {
                A: this.analyzeVariantPerformance(variantA),
                B: this.analyzeVariantPerformance(variantB)
            },
            significance: this.calculateStatisticalSignificance(variantA, variantB),
            recommendation: this.generateABTestRecommendation(variantA, variantB)
        };
    }
    
    /**
     * アラート設定と通知
     */
    setupAlerts(alertConfig) {
        this.alertConfig = {
            completionRateThreshold: 0.60,
            disagreementRateThreshold: 0.15,
            handoffRateThreshold: 0.30,
            errorRateThreshold: 0.05,
            ...alertConfig
        };
        
        // アラートチェックのインターバル設定
        this.alertInterval = setInterval(() => {
            this.checkAlerts();
        }, 60000); // 1分間隔
    }
    
    /**
     * データエクスポート
     */
    exportData(format = 'json', dateRange = null) {
        const data = dateRange ? 
            this.getDataByDateRange(dateRange.start, dateRange.end) :
            this.getAllStoredData();
        
        switch (format) {
            case 'csv':
                return this.convertToCSV(data);
            case 'excel':
                return this.convertToExcel(data);
            case 'json':
            default:
                return JSON.stringify(data, null, 2);
        }
    }
    
    /**
     * データプライバシー管理
     */
    anonymizeData() {
        const sessions = this.getStoredSessions();
        const anonymizedSessions = sessions.map(session => ({
            ...session,
            sessionId: this.hashSessionId(session.sessionId),
            events: session.events.map(event => ({
                ...event,
                sessionId: this.hashSessionId(event.sessionId),
                userAgent: this.anonymizeUserAgent(event.userAgent),
                url: this.anonymizeUrl(event.url)
            }))
        }));
        
        localStorage.setItem(this.storageKeys.sessions, JSON.stringify(anonymizedSessions));
        return anonymizedSessions;
    }
    
    /**
     * ヘルパーメソッド群
     */
    
    // イベントリスナー設定
    setupEventListeners() {
        // ページ離脱時
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.startTime
            });
            this.flushRealtimeBuffer();
        });
        
        // エラー監視
        window.addEventListener('error', (e) => {
            this.trackEvent('error_occurred', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
        
        // パフォーマンス監視
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    this.trackEvent('performance_metrics', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
                    });
                }, 0);
            });
        }
    }
    
    // セッション判定
    isMobileSession(session) {
        const startEvent = session.events.find(e => e.type === 'session_start');
        return startEvent?.data?.device?.category?.includes('mobile') || 
               startEvent?.data?.viewport?.width < 768;
    }
    
    // ID生成
    generateSessionId() {
        return `kpi_${Date.now()}_${this.rng.next().toString(36).substr(2, 9)}`;
    }
    
    generateEventId() {
        return `evt_${Date.now()}_${this.rng.next().toString(36).substr(2, 6)}`;
    }
    
    // デバイス検出
    detectDevice() {
        return {
            category: window.innerWidth < 768 ? 'mobile' : 'desktop',
            userAgent: navigator.userAgent,
            viewport: { width: window.innerWidth, height: window.innerHeight }
        };
    }
    
    // データ永続化
    persistEvent(event) {
        try {
            const sessions = this.getStoredSessions();
            let currentSession = sessions.find(s => s.sessionId === this.sessionId);
            
            if (!currentSession) {
                currentSession = {
                    sessionId: this.sessionId,
                    startTime: this.startTime,
                    events: []
                };
                sessions.push(currentSession);
            }
            
            currentSession.events.push(event);
            
            // 最新100セッションのみ保持
            if (sessions.length > 100) {
                sessions.splice(0, sessions.length - 100);
            }
            
            localStorage.setItem(this.storageKeys.sessions, JSON.stringify(sessions));
        } catch (e) {
            console.error('Failed to persist KPI event:', e);
        }
    }
    
    // データ取得
    getStoredSessions() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys.sessions) || '[]');
        } catch (e) {
            console.error('Failed to load KPI sessions:', e);
            return [];
        }
    }
    
    getEventsByType(eventType) {
        const sessions = this.getStoredSessions();
        const events = [];
        sessions.forEach(session => {
            events.push(...session.events.filter(e => e.type === eventType));
        });
        return events;
    }
    
    // 古いデータクリーンアップ
    cleanupOldData() {
        const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30日前
        const sessions = this.getStoredSessions();
        const filteredSessions = sessions.filter(s => s.startTime >= cutoffDate);
        localStorage.setItem(this.storageKeys.sessions, JSON.stringify(filteredSessions));
    }
    
    // リアルタイム処理
    startRealtimeProcessing() {
        this.realtimeInterval = setInterval(() => {
            this.flushRealtimeBuffer();
        }, this.realtimeBuffer.flushInterval);
    }
    
    flushRealtimeBuffer() {
        if (this.realtimeBuffer.events.length > 0) {
            console.log(`Flushing ${this.realtimeBuffer.events.length} KPI events`);
            // リアルタイムバッファをクリア
            this.realtimeBuffer.events = [];
        }
    }
    
    processEventRealtime(event) {
        // リアルタイム処理（必要に応じて実装）
        if (event.type === 'error_occurred') {
            console.warn('KPI Alert: Error occurred', event.data);
        }
    }
    
    // 空のKPI構造
    getEmptyKPIs() {
        return {
            completionRate: { value: 0, target: this.targets.completionRate, status: 'no-data' },
            avgSessionDuration: { value: 0, target: this.targets.sessionDuration, status: 'no-data' },
            dropoffAnalysis: {},
            questionCompletionRates: []
        };
    }
    
    getEmptyZoneDKPIs() {
        return {
            disagreementRate: { value: 0, target: this.targets.disagreementRate, status: 'no-data' },
            handoffRate: { value: 0, target: this.targets.handoffRate, status: 'no-data' },
            avgConfidence: { value: 0, target: this.targets.averageConfidence, status: 'no-data' },
            feedbackQuality: {},
            handoffDestinations: {}
        };
    }
    
    getEmptyMobileKPIs() {
        return {
            mobileCompletionRate: { value: 0, target: this.targets.mobileCompletionRate, status: 'no-data' },
            touchInteractions: {},
            performanceMetrics: {},
            deviceAnalysis: {}
        };
    }
    
    // 詳細分析メソッド（省略版）
    calculateDropoffRates(sessions) {
        // 各段階での離脱率を計算
        return { analysis: 'Detailed dropoff analysis would be implemented here' };
    }
    
    calculateQuestionCompletionRates(sessions) {
        // 質問別の完了率を計算
        return [];
    }
    
    analyzeFeedbackQuality(feedbackEvents) {
        // フィードバックの質を分析
        return { analysis: 'Feedback quality analysis would be implemented here' };
    }
    
    analyzeHandoffDestinations(handoffEvents) {
        // ハンドオフ先の傾向を分析
        return { analysis: 'Handoff destination analysis would be implemented here' };
    }
    
    analyzeTouchInteractions(mobileSessions) {
        // タッチインタラクションを分析
        return { analysis: 'Touch interaction analysis would be implemented here' };
    }
    
    analyzeMobilePerformance(mobileSessions) {
        // モバイルパフォーマンスを分析
        return { analysis: 'Mobile performance analysis would be implemented here' };
    }
    
    analyzeDeviceTypes(mobileSessions) {
        // デバイス種別を分析
        return { analysis: 'Device type analysis would be implemented here' };
    }
    
    calculateRepeatUsage() {
        // リピート利用率を計算
        return 0;
    }
    
    calculateOverallScore(kpis) {
        // 総合スコアを計算
        return 0.75; // 仮の値
    }
    
    calculateTrends() {
        // トレンド分析
        return { trends: 'Trend analysis would be implemented here' };
    }
    
    generateAlerts(kpis) {
        // アラート生成
        return [];
    }
    
    generateSummary(kpis) {
        // サマリー生成
        return 'KPI summary would be generated here';
    }
    
    // クリーンアップ
    destroy() {
        if (this.realtimeInterval) {
            clearInterval(this.realtimeInterval);
        }
        if (this.alertInterval) {
            clearInterval(this.alertInterval);
        }
        this.flushRealtimeBuffer();
        
        this.trackEvent('session_end', {
            duration: Date.now() - this.startTime
        });
        
        console.log('KPI Analyzer destroyed');
    }
}

// グローバル初期化
if (typeof window !== 'undefined') {
    window.kpiAnalyzer = new KPIAnalyzer();
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KPIAnalyzer;
}