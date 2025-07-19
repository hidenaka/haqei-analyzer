// AnalyticsCollector.js - 利用状況分析システム
// HaQei Analyzer - Analytics Collection System

class AnalyticsCollector {
    constructor(options = {}) {
        this.options = {
            enableTracking: true,
            enablePerformanceTracking: true,
            enableUserBehaviorTracking: true,
            enableErrorTracking: true,
            enableCustomEvents: true,
            batchSize: 50,
            flushInterval: 30000, // 30秒
            maxRetries: 3,
            retentionDays: 30,
            anonymizeData: true,
            keyPrefix: 'haqei_analytics_',
            enableLocalStorage: true,
            enableSessionReplay: false,
            heatmapSampling: 0.1,
            ...options
        };
        
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.eventQueue = [];
        this.performanceMetrics = new Map();
        this.userInteractions = [];
        this.flushTimer = null;
        this.pageLoadTime = Date.now();
        
        this.initializeTracking();
    }

    /**
     * トラッキングを初期化
     */
    initializeTracking() {
        if (!this.options.enableTracking) return;
        
        try {
            // セッション開始イベント
            this.trackEvent('session_start', {
                sessionId: this.sessionId,
                userId: this.userId,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                platform: navigator.platform,
                referrer: document.referrer
            });
            
            // ページ読み込み時間の追跡
            if (this.options.enablePerformanceTracking) {
                this.trackPageLoadPerformance();
            }
            
            // ユーザー行動の追跡
            if (this.options.enableUserBehaviorTracking) {
                this.setupUserBehaviorTracking();
            }
            
            // エラー追跡
            if (this.options.enableErrorTracking) {
                this.setupErrorTracking();
            }
            
            // 定期的なフラッシュ
            this.startAutoFlush();
            
            // ページ離脱時の処理
            this.setupUnloadHandlers();
            
            console.log("📊 Analytics tracking initialized");
            
        } catch (error) {
            console.error("❌ Failed to initialize analytics:", error);
        }
    }

    /**
     * イベントを追跡
     * @param {string} eventName - イベント名
     * @param {Object} properties - イベントプロパティ
     * @param {Object} options - オプション
     */
    trackEvent(eventName, properties = {}, options = {}) {
        if (!this.options.enableTracking) return;
        
        const event = {
            id: this.generateEventId(),
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            properties: this.sanitizeProperties(properties),
            context: this.getContext(),
            ...options
        };
        
        this.eventQueue.push(event);
        
        // 即座にフラッシュが必要な重要イベント
        if (options.immediate || this.isImportantEvent(eventName)) {
            this.flush();
        }
        
        // バッチサイズに達した場合
        if (this.eventQueue.length >= this.options.batchSize) {
            this.flush();
        }
    }

    /**
     * ページビューを追跡
     * @param {string} pageName - ページ名
     * @param {Object} properties - 追加プロパティ
     */
    trackPageView(pageName, properties = {}) {
        this.trackEvent('page_view', {
            page: pageName,
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            ...properties
        });
    }

    /**
     * ユーザーアクションを追跡
     * @param {string} action - アクション名
     * @param {string} target - ターゲット要素
     * @param {Object} properties - 追加プロパティ
     */
    trackUserAction(action, target, properties = {}) {
        this.trackEvent('user_action', {
            action: action,
            target: target,
            timestamp: Date.now(),
            ...properties
        });
    }

    /**
     * 診断結果の利用状況を追跡
     * @param {Object} analysisResult - 分析結果
     * @param {Object} userInteractions - ユーザーの操作
     */
    trackDiagnosisUsage(analysisResult, userInteractions = {}) {
        const usageData = {
            engineOS: analysisResult.engineOS?.hexagramInfo?.name,
            interfaceOS: analysisResult.interfaceOS?.hexagramInfo?.name,
            safeModeOS: analysisResult.safeModeOS?.hexagramInfo?.name,
            consistencyScore: Math.round((analysisResult.consistencyScore?.overall || 0) * 100),
            completionTime: userInteractions.completionTime,
            sectionsViewed: userInteractions.sectionsViewed || [],
            actionsPerformed: userInteractions.actionsPerformed || [],
            timeSpentPerSection: userInteractions.timeSpentPerSection || {},
            enhancedModeUsed: userInteractions.enhancedModeUsed || false,
            shareUsed: userInteractions.shareUsed || false,
            exportUsed: userInteractions.exportUsed || false
        };
        
        this.trackEvent('diagnosis_completed', usageData);
    }

    /**
     * セクション別の閲覧率を追跡
     * @param {string} sectionName - セクション名
     * @param {number} viewDuration - 閲覧時間（ミリ秒）
     * @param {Object} interactionData - 操作データ
     */
    trackSectionView(sectionName, viewDuration, interactionData = {}) {
        this.trackEvent('section_view', {
            section: sectionName,
            duration: viewDuration,
            scrollDepth: interactionData.scrollDepth || 0,
            interactions: interactionData.interactions || 0,
            timestamp: Date.now()
        });
    }

    /**
     * パフォーマンスメトリクスを追跡
     * @param {string} metricName - メトリクス名
     * @param {number} value - 値
     * @param {Object} context - コンテキスト
     */
    trackPerformance(metricName, value, context = {}) {
        if (!this.options.enablePerformanceTracking) return;
        
        this.performanceMetrics.set(metricName, {
            value: value,
            timestamp: Date.now(),
            context: context
        });
        
        this.trackEvent('performance_metric', {
            metric: metricName,
            value: value,
            ...context
        });
    }

    /**
     * エラーを追跡
     * @param {Error} error - エラーオブジェクト
     * @param {Object} context - エラーコンテキスト
     */
    trackError(error, context = {}) {
        if (!this.options.enableErrorTracking) return;
        
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            url: window.location.href,
            lineNumber: context.lineNumber,
            columnNumber: context.columnNumber,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            ...context
        }, { immediate: true });
    }

    /**
     * カスタムイベントを追跡
     * @param {string} eventName - イベント名
     * @param {Object} data - データ
     */
    trackCustomEvent(eventName, data = {}) {
        if (!this.options.enableCustomEvents) return;
        
        this.trackEvent(`custom_${eventName}`, data);
    }

    /**
     * A/Bテストの結果を追跡
     * @param {string} testName - テスト名
     * @param {string} variant - バリアント
     * @param {Object} results - 結果データ
     */
    trackABTest(testName, variant, results = {}) {
        this.trackEvent('ab_test', {
            testName: testName,
            variant: variant,
            ...results
        });
    }

    /**
     * コンバージョンを追跡
     * @param {string} goal - ゴール名
     * @param {number} value - 値
     * @param {Object} properties - 追加プロパティ
     */
    trackConversion(goal, value = 1, properties = {}) {
        this.trackEvent('conversion', {
            goal: goal,
            value: value,
            ...properties
        });
    }

    /**
     * ユーザー行動追跡をセットアップ
     */
    setupUserBehaviorTracking() {
        // クリック追跡
        document.addEventListener('click', (event) => {
            this.trackClickEvent(event);
        });
        
        // スクロール追跡
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScrollEvent();
            }, 250);
        });
        
        // マウス移動追跡（サンプリング）
        if (Math.random() < this.options.heatmapSampling) {
            this.setupMouseTracking();
        }
        
        // フォーカス/ブラー追跡
        window.addEventListener('focus', () => {
            this.trackEvent('window_focus');
        });
        
        window.addEventListener('blur', () => {
            this.trackEvent('window_blur');
        });
        
        // ページ表示状態の追跡
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                visible: !document.hidden
            });
        });
    }

    /**
     * クリックイベントを追跡
     */
    trackClickEvent(event) {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        const elementInfo = this.getElementInfo(target);
        
        this.trackEvent('click', {
            tagName: tagName,
            elementInfo: elementInfo,
            x: event.clientX,
            y: event.clientY,
            timestamp: Date.now()
        });
    }

    /**
     * スクロールイベントを追跡
     */
    trackScrollEvent() {
        const scrollDepth = this.calculateScrollDepth();
        
        this.trackEvent('scroll', {
            scrollTop: window.pageYOffset,
            scrollDepth: scrollDepth,
            viewportHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight,
            timestamp: Date.now()
        });
    }

    /**
     * マウス追跡をセットアップ
     */
    setupMouseTracking() {
        let mousePositions = [];
        let lastFlush = Date.now();
        
        document.addEventListener('mousemove', (event) => {
            mousePositions.push({
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now()
            });
            
            // 1秒ごとにフラッシュ
            if (Date.now() - lastFlush > 1000) {
                this.trackEvent('mouse_heatmap', {
                    positions: mousePositions
                });
                mousePositions = [];
                lastFlush = Date.now();
            }
        });
    }

    /**
     * エラー追跡をセットアップ
     */
    setupErrorTracking() {
        // JavaScript エラー
        window.addEventListener('error', (event) => {
            this.trackError(event.error, {
                filename: event.filename,
                lineNumber: event.lineno,
                columnNumber: event.colno
            });
        });
        
        // Promise 拒否
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError(new Error(event.reason), {
                type: 'unhandled_promise_rejection'
            });
        });
        
        // リソース読み込みエラー
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackEvent('resource_error', {
                    tagName: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Failed to load resource'
                });
            }
        }, true);
    }

    /**
     * ページ読み込みパフォーマンスを追跡
     */
    trackPageLoadPerformance() {
        window.addEventListener('load', () => {
            // Performance API を使用
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                this.trackEvent('page_performance', {
                    loadTime: Date.now() - this.pageLoadTime,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint(),
                    largestContentfulPaint: this.getLargestContentfulPaint()
                });
            }
        });
    }

    /**
     * ページ離脱処理をセットアップ
     */
    setupUnloadHandlers() {
        const handleUnload = () => {
            this.trackEvent('session_end', {
                sessionDuration: Date.now() - this.pageLoadTime,
                pageViews: this.getPageViewCount(),
                totalEvents: this.getTotalEventCount()
            });
            
            // 残りのイベントをフラッシュ
            this.flush(true);
        };
        
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('pagehide', handleUnload);
        
        // Visibilitychange でもセッション終了を検知
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                handleUnload();
            }
        });
    }

    /**
     * イベントをサーバーに送信（または保存）
     */
    async flush(immediate = false) {
        if (this.eventQueue.length === 0) return;
        
        const events = [...this.eventQueue];
        this.eventQueue = [];
        
        try {
            if (this.options.enableLocalStorage) {
                await this.saveToLocalStorage(events);
            }
            
            // 実際のアナリティクスサーバーがあれば送信
            // await this.sendToServer(events);
            
            console.log(`📊 Flushed ${events.length} analytics events`);
            
        } catch (error) {
            console.error('❌ Failed to flush analytics events:', error);
            
            // 失敗したイベントをキューに戻す
            this.eventQueue.unshift(...events);
        }
    }

    /**
     * LocalStorageに保存
     */
    async saveToLocalStorage(events) {
        try {
            const storageKey = this.options.keyPrefix + 'events';
            const existingData = localStorage.getItem(storageKey);
            const existingEvents = existingData ? JSON.parse(existingData) : [];
            
            const allEvents = [...existingEvents, ...events];
            
            // 保存期間を超えたイベントを削除
            const cutoffTime = Date.now() - (this.options.retentionDays * 24 * 60 * 60 * 1000);
            const validEvents = allEvents.filter(event => event.timestamp > cutoffTime);
            
            localStorage.setItem(storageKey, JSON.stringify(validEvents));
            
        } catch (error) {
            console.error('❌ Failed to save events to localStorage:', error);
        }
    }

    /**
     * アナリティクスレポートを生成
     */
    generateReport() {
        try {
            const storageKey = this.options.keyPrefix + 'events';
            const eventsData = localStorage.getItem(storageKey);
            const events = eventsData ? JSON.parse(eventsData) : [];
            
            return {
                totalEvents: events.length,
                uniqueSessions: new Set(events.map(e => e.sessionId)).size,
                eventTypes: this.analyzeEventTypes(events),
                userBehavior: this.analyzeUserBehavior(events),
                performance: this.analyzePerformance(events),
                errors: this.analyzeErrors(events),
                diagnosisUsage: this.analyzeDiagnosisUsage(events),
                generatedAt: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Failed to generate analytics report:', error);
            return null;
        }
    }

    /**
     * イベントタイプを分析
     */
    analyzeEventTypes(events) {
        const eventCounts = {};
        events.forEach(event => {
            eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
        });
        
        return Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // トップ10
    }

    /**
     * ユーザー行動を分析
     */
    analyzeUserBehavior(events) {
        const clickEvents = events.filter(e => e.name === 'click');
        const scrollEvents = events.filter(e => e.name === 'scroll');
        const sectionViews = events.filter(e => e.name === 'section_view');
        
        return {
            totalClicks: clickEvents.length,
            averageScrollDepth: this.calculateAverageScrollDepth(scrollEvents),
            mostViewedSections: this.getMostViewedSections(sectionViews),
            averageSessionDuration: this.calculateAverageSessionDuration(events)
        };
    }

    /**
     * パフォーマンスを分析
     */
    analyzePerformance(events) {
        const perfEvents = events.filter(e => e.name === 'page_performance');
        
        if (perfEvents.length === 0) return null;
        
        const loadTimes = perfEvents.map(e => e.properties.loadTime);
        
        return {
            averageLoadTime: loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length,
            medianLoadTime: this.calculateMedian(loadTimes),
            slowestLoad: Math.max(...loadTimes),
            fastestLoad: Math.min(...loadTimes)
        };
    }

    /**
     * エラーを分析
     */
    analyzeErrors(events) {
        const errorEvents = events.filter(e => e.name === 'error');
        
        const errorTypes = {};
        errorEvents.forEach(event => {
            const errorType = event.properties.name || 'Unknown';
            errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
        });
        
        return {
            totalErrors: errorEvents.length,
            errorRate: errorEvents.length / events.length,
            commonErrors: Object.entries(errorTypes)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        };
    }

    /**
     * 診断利用状況を分析
     */
    analyzeDiagnosisUsage(events) {
        const diagnosisEvents = events.filter(e => e.name === 'diagnosis_completed');
        
        if (diagnosisEvents.length === 0) return null;
        
        const osDistribution = {
            engine: {},
            interface: {},
            safeMode: {}
        };
        
        let totalCompletionTime = 0;
        let enhancedModeUsage = 0;
        let shareUsage = 0;
        
        diagnosisEvents.forEach(event => {
            const props = event.properties;
            
            // OS分布
            if (props.engineOS) {
                osDistribution.engine[props.engineOS] = (osDistribution.engine[props.engineOS] || 0) + 1;
            }
            if (props.interfaceOS) {
                osDistribution.interface[props.interfaceOS] = (osDistribution.interface[props.interfaceOS] || 0) + 1;
            }
            if (props.safeModeOS) {
                osDistribution.safeMode[props.safeModeOS] = (osDistribution.safeMode[props.safeModeOS] || 0) + 1;
            }
            
            // 完了時間
            if (props.completionTime) {
                totalCompletionTime += props.completionTime;
            }
            
            // 機能利用状況
            if (props.enhancedModeUsed) enhancedModeUsage++;
            if (props.shareUsed) shareUsage++;
        });
        
        return {
            totalDiagnoses: diagnosisEvents.length,
            averageCompletionTime: totalCompletionTime / diagnosisEvents.length,
            enhancedModeUsageRate: enhancedModeUsage / diagnosisEvents.length,
            shareUsageRate: shareUsage / diagnosisEvents.length,
            osDistribution: osDistribution
        };
    }

    // === ヘルパーメソッド ===

    /**
     * セッションIDを生成
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    }

    /**
     * ユーザーIDを取得または生成
     */
    getUserId() {
        const storageKey = this.options.keyPrefix + 'user_id';
        let userId = localStorage.getItem(storageKey);
        
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2);
            localStorage.setItem(storageKey, userId);
        }
        
        return userId;
    }

    /**
     * イベントIDを生成
     */
    generateEventId() {
        return Date.now() + '_' + Math.random().toString(36).substring(2);
    }

    /**
     * プロパティをサニタイズ
     */
    sanitizeProperties(properties) {
        if (!this.options.anonymizeData) return properties;
        
        const sanitized = { ...properties };
        
        // 個人情報を除去
        const sensitiveKeys = ['email', 'name', 'phone', 'address', 'ip'];
        sensitiveKeys.forEach(key => {
            delete sanitized[key];
        });
        
        return sanitized;
    }

    /**
     * コンテキストを取得
     */
    getContext() {
        return {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: Date.now()
        };
    }

    /**
     * 重要イベントかどうかチェック
     */
    isImportantEvent(eventName) {
        const importantEvents = ['error', 'conversion', 'session_end'];
        return importantEvents.includes(eventName);
    }

    /**
     * 要素情報を取得
     */
    getElementInfo(element) {
        return {
            id: element.id,
            className: element.className,
            tagName: element.tagName.toLowerCase(),
            text: element.textContent?.substring(0, 100) || '',
            attributes: this.getElementAttributes(element)
        };
    }

    /**
     * 要素の属性を取得
     */
    getElementAttributes(element) {
        const attrs = {};
        Array.from(element.attributes).forEach(attr => {
            if (['data-', 'aria-'].some(prefix => attr.name.startsWith(prefix))) {
                attrs[attr.name] = attr.value;
            }
        });
        return attrs;
    }

    /**
     * スクロール深度を計算
     */
    calculateScrollDepth() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        return Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    }

    /**
     * First Paint を取得
     */
    getFirstPaint() {
        const perfEntries = performance.getEntriesByType('paint');
        const firstPaint = perfEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * First Contentful Paint を取得
     */
    getFirstContentfulPaint() {
        const perfEntries = performance.getEntriesByType('paint');
        const fcp = perfEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    /**
     * Largest Contentful Paint を取得
     */
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // タイムアウト
                setTimeout(() => resolve(null), 5000);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * 中央値を計算
     */
    calculateMedian(values) {
        const sorted = values.sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    /**
     * 自動フラッシュを開始
     */
    startAutoFlush() {
        this.flushTimer = setInterval(() => {
            this.flush();
        }, this.options.flushInterval);
    }

    /**
     * 平均スクロール深度を計算
     */
    calculateAverageScrollDepth(scrollEvents) {
        if (scrollEvents.length === 0) return 0;
        
        const scrollDepths = scrollEvents
            .map(event => event.properties?.scrollDepth || 0)
            .filter(depth => depth > 0);
            
        return scrollDepths.length > 0 ? 
            scrollDepths.reduce((sum, depth) => sum + depth, 0) / scrollDepths.length : 0;
    }

    /**
     * 最も閲覧されたセクションを取得
     */
    getMostViewedSections(sectionViews) {
        const sectionCounts = {};
        
        sectionViews.forEach(event => {
            const section = event.properties?.section;
            if (section) {
                sectionCounts[section] = (sectionCounts[section] || 0) + 1;
            }
        });
        
        return Object.entries(sectionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([section, count]) => ({ section, views: count }));
    }

    /**
     * 平均セッション時間を計算
     */
    calculateAverageSessionDuration(events) {
        const sessionStarts = events.filter(e => e.name === 'session_start');
        const sessionEnds = events.filter(e => e.name === 'session_end');
        
        if (sessionStarts.length === 0 || sessionEnds.length === 0) return 0;
        
        const durations = [];
        sessionStarts.forEach(start => {
            const correspondingEnd = sessionEnds.find(end => 
                end.sessionId === start.sessionId && end.timestamp > start.timestamp
            );
            
            if (correspondingEnd) {
                durations.push(correspondingEnd.timestamp - start.timestamp);
            }
        });
        
        return durations.length > 0 ? 
            durations.reduce((sum, duration) => sum + duration, 0) / durations.length : 0;
    }

    /**
     * ページビュー数を取得
     */
    getPageViewCount() {
        try {
            const storageKey = this.options.keyPrefix + 'events';
            const eventsData = localStorage.getItem(storageKey);
            const events = eventsData ? JSON.parse(eventsData) : [];
            
            return events.filter(e => e.name === 'page_view').length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * 総イベント数を取得
     */
    getTotalEventCount() {
        try {
            const storageKey = this.options.keyPrefix + 'events';
            const eventsData = localStorage.getItem(storageKey);
            const events = eventsData ? JSON.parse(eventsData) : [];
            
            return events.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * エクスポート機能
     */
    exportData(format = 'json') {
        const report = this.generateReport();
        
        if (format === 'csv') {
            return this.convertToCSV(report);
        }
        
        return JSON.stringify(report, null, 2);
    }

    /**
     * CSVに変換
     */
    convertToCSV(report) {
        // 簡易CSV変換
        const lines = [];
        lines.push('Metric,Value');
        lines.push(`Total Events,${report.totalEvents}`);
        lines.push(`Unique Sessions,${report.uniqueSessions}`);
        
        if (report.performance) {
            lines.push(`Average Load Time,${report.performance.averageLoadTime}`);
        }
        
        return lines.join('\n');
    }

    /**
     * システム破棄
     */
    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        
        // 残りのイベントをフラッシュ
        this.flush(true);
        
        console.log("📊 AnalyticsCollector destroyed");
    }
}

export default AnalyticsCollector;