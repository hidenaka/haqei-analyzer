/**
 * HAQEI Health Beacon - Frontend Health Monitoring System
 * フロントエンドの健全性を監視し、エラーやパフォーマンス問題を検知
 */

(function() {
    'use strict';

    const HealthBeacon = {
        // Configuration
        config: {
            reportInterval: 30000,  // 30秒ごとにレポート
            errorThreshold: 5,      // 5エラー以上で警告
            performanceThreshold: 3000,  // 3秒以上のロードで警告
            storageKey: 'haqei_health_metrics',
            version: '1.0.0'
        },

        // Metrics storage
        metrics: {
            errors: [],
            warnings: [],
            performance: {
                pageLoadTime: 0,
                domReadyTime: 0,
                resourceLoadTime: 0
            },
            userFlow: {
                currentScreen: 'welcome',
                questionsAnswered: 0,
                totalQuestions: 36,
                sessionStartTime: Date.now()
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            }
        },

        // Initialize the beacon
        init() {
            console.log('🚨 Health Beacon v' + this.config.version + ' initialized');
            
            // Setup error handlers
            this.setupErrorHandlers();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup user flow tracking
            this.setupUserFlowTracking();
            
            // Start periodic reporting
            this.startReporting();
            
            // Load previous metrics if any
            this.loadPreviousMetrics();
        },

        // Setup global error handlers
        setupErrorHandlers() {
            // Catch JavaScript errors
            window.addEventListener('error', (event) => {
                this.logError({
                    type: 'javascript',
                    message: event.message,
                    filename: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    stack: event.error?.stack,
                    timestamp: Date.now()
                });
            });

            // Catch unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                this.logError({
                    type: 'promise',
                    message: event.reason?.message || event.reason,
                    stack: event.reason?.stack,
                    timestamp: Date.now()
                });
            });

            // Monitor console errors
            const originalError = console.error;
            console.error = (...args) => {
                this.logError({
                    type: 'console',
                    message: args.join(' '),
                    timestamp: Date.now()
                });
                originalError.apply(console, args);
            };
        },

        // Setup performance monitoring
        setupPerformanceMonitoring() {
            // Page load performance
            if (window.performance && window.performance.timing) {
                window.addEventListener('load', () => {
                    const timing = window.performance.timing;
                    this.metrics.performance = {
                        pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                        resourceLoadTime: timing.responseEnd - timing.requestStart,
                        dnsLookupTime: timing.domainLookupEnd - timing.domainLookupStart,
                        connectTime: timing.connectEnd - timing.connectStart
                    };
                    
                    // Check for slow load
                    if (this.metrics.performance.pageLoadTime > this.config.performanceThreshold) {
                        this.logWarning({
                            type: 'performance',
                            message: `Slow page load detected: ${this.metrics.performance.pageLoadTime}ms`,
                            details: this.metrics.performance
                        });
                    }
                });
            }

            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 50) {  // Long task threshold
                                this.logWarning({
                                    type: 'long-task',
                                    message: `Long task detected: ${entry.duration}ms`,
                                    startTime: entry.startTime,
                                    timestamp: Date.now()
                                });
                            }
                        }
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                } catch (e) {
                    console.log('Long task monitoring not supported');
                }
            }
        },

        // Setup user flow tracking
        setupUserFlowTracking() {
            // Track screen changes
            const observer = new MutationObserver(() => {
                this.detectCurrentScreen();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            // Track user answers
            document.addEventListener('change', (event) => {
                if (event.target.type === 'radio' && event.target.name?.startsWith('q')) {
                    this.metrics.userFlow.questionsAnswered = 
                        Object.keys(window.userAnswers || {}).length;
                }
            });
        },

        // Detect current screen
        detectCurrentScreen() {
            const screens = {
                'welcome-screen': 'welcome',
                'question-screen': 'questions',
                'analysis-screen': 'analysis',
                'results-screen': 'results'
            };

            for (const [id, name] of Object.entries(screens)) {
                const element = document.getElementById(id);
                if (element && element.classList.contains('active')) {
                    this.metrics.userFlow.currentScreen = name;
                    break;
                }
            }
        },

        // Log error
        logError(error) {
            this.metrics.errors.push(error);
            
            // Keep only last 50 errors
            if (this.metrics.errors.length > 50) {
                this.metrics.errors = this.metrics.errors.slice(-50);
            }

            // Check threshold
            const recentErrors = this.metrics.errors.filter(
                e => Date.now() - e.timestamp < 60000  // Last minute
            );
            
            if (recentErrors.length >= this.config.errorThreshold) {
                this.sendAlert('error-threshold', {
                    count: recentErrors.length,
                    errors: recentErrors
                });
            }
        },

        // Log warning
        logWarning(warning) {
            this.metrics.warnings.push({
                ...warning,
                timestamp: Date.now()
            });
            
            // Keep only last 30 warnings
            if (this.metrics.warnings.length > 30) {
                this.metrics.warnings = this.metrics.warnings.slice(-30);
            }
        },

        // Send alert
        sendAlert(type, data) {
            console.warn(`🚨 Health Alert [${type}]:`, data);
            
            // Store critical alerts
            const alerts = JSON.parse(localStorage.getItem('haqei_health_alerts') || '[]');
            alerts.push({
                type,
                data,
                timestamp: Date.now()
            });
            
            // Keep only last 10 alerts
            if (alerts.length > 10) {
                alerts.splice(0, alerts.length - 10);
            }
            
            localStorage.setItem('haqei_health_alerts', JSON.stringify(alerts));
        },

        // Generate health report
        generateReport() {
            const sessionDuration = Date.now() - this.metrics.userFlow.sessionStartTime;
            
            return {
                timestamp: Date.now(),
                version: this.config.version,
                session: {
                    duration: sessionDuration,
                    currentScreen: this.metrics.userFlow.currentScreen,
                    progress: `${this.metrics.userFlow.questionsAnswered}/${this.metrics.userFlow.totalQuestions}`
                },
                health: {
                    errorCount: this.metrics.errors.length,
                    warningCount: this.metrics.warnings.length,
                    recentErrors: this.metrics.errors.slice(-5),
                    recentWarnings: this.metrics.warnings.slice(-5)
                },
                performance: this.metrics.performance,
                browser: this.metrics.browser,
                status: this.calculateHealthStatus()
            };
        },

        // Calculate overall health status
        calculateHealthStatus() {
            const recentErrors = this.metrics.errors.filter(
                e => Date.now() - e.timestamp < 300000  // Last 5 minutes
            ).length;
            
            const recentWarnings = this.metrics.warnings.filter(
                w => Date.now() - w.timestamp < 300000
            ).length;
            
            if (recentErrors > 10) return 'critical';
            if (recentErrors > 5) return 'warning';
            if (recentWarnings > 10) return 'warning';
            if (recentErrors > 0 || recentWarnings > 5) return 'fair';
            return 'healthy';
        },

        // Start periodic reporting
        startReporting() {
            setInterval(() => {
                const report = this.generateReport();
                console.log('📊 Health Report:', report);
                
                // Store in localStorage
                localStorage.setItem(this.config.storageKey, JSON.stringify(report));
                
                // Check for critical status
                if (report.status === 'critical') {
                    this.sendAlert('critical-health', report);
                }
            }, this.config.reportInterval);
        },

        // Load previous metrics
        loadPreviousMetrics() {
            try {
                const stored = localStorage.getItem(this.config.storageKey);
                if (stored) {
                    const previous = JSON.parse(stored);
                    console.log('📈 Previous health metrics loaded:', previous);
                }
            } catch (e) {
                console.log('Could not load previous metrics');
            }
        },

        // Public API for manual health checks
        checkHealth() {
            return this.generateReport();
        },

        // Clear all metrics
        clearMetrics() {
            this.metrics.errors = [];
            this.metrics.warnings = [];
            localStorage.removeItem(this.config.storageKey);
            localStorage.removeItem('haqei_health_alerts');
            console.log('🧹 Health metrics cleared');
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => HealthBeacon.init());
    } else {
        HealthBeacon.init();
    }

    // Expose to global scope for debugging
    window.HealthBeacon = HealthBeacon;
})();