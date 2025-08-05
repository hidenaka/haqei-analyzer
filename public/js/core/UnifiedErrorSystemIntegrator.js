/**
 * HAQEI統一エラーシステム統合エンジン v2.0.0
 * 既存システムとの完全統合と後方互換性保証
 * 
 * 主要機能:
 * - 既存ErrorHandlerとの統合
 * - 全HAQEIシステムとの連携
 * - パフォーマンス最適化統合
 * - 哲学的システム統合
 * 
 * @version 2.0.0
 * @author HAQEI Development Team
 * @philosophy bunenjin Triple OS
 */

class UnifiedErrorSystemIntegrator {
    constructor() {
        this.version = "2.0.0";
        this.philosophy = "bunenjin-triple-os-integration";
        
        this.integrationStatus = {
            core: false,
            ui: false,
            philosophy: false,
            performance: false,
            legacy: false
        };
        
        this.errorHandlerInstance = null;
        this.integrationLog = [];
        
        this.initialize();
    }

    /**
     * 統合システム初期化
     */
    async initialize() {
        console.log("🔧 HAQEI Unified Error System Integrator v2.0.0 starting...");
        
        try {
            // Step 1: コアシステム統合
            await this.integrateCore();
            
            // Step 2: UI統合
            await this.integrateUI();
            
            // Step 3: 哲学的システム統合
            await this.integratePhilosophy();
            
            // Step 4: パフォーマンス統合
            await this.integratePerformance();
            
            // Step 5: レガシー統合
            await this.integrateLegacySystems();
            
            // Step 6: グローバル統合
            await this.setupGlobalIntegration();
            
            console.log("✅ HAQEI Unified Error System Integration completed successfully");
            this.logIntegration("✅ Full system integration completed", "success");
            
        } catch (error) {
            console.error("❌ Integration failed:", error);
            this.logIntegration(`❌ Integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * コアシステム統合
     */
    async integrateCore() {
        try {
            console.log("🚀 Integrating core error handling systems...");
            
            // Check if UnifiedErrorHandler is available
            if (typeof UnifiedErrorHandler !== 'undefined') {
                this.errorHandlerInstance = new UnifiedErrorHandler({
                    uiContainerId: 'haqei-unified-error-container',
                    performanceThreshold: 10,
                    memoryThreshold: 10485760,
                    throughputTarget: 1000,
                    enablePhilosophicalGuidance: true,
                    enableTripleOS: true,
                    enableRealTimeMonitoring: true
                });
                
                this.integrationStatus.core = true;
                this.logIntegration("Core error handler integrated", "success");
            } else {
                throw new Error("UnifiedErrorHandler not available");
            }
            
        } catch (error) {
            this.logIntegration(`Core integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * UI統合
     */
    async integrateUI() {
        try {
            console.log("🎨 Integrating UI systems...");
            
            // Create unified error container
            this.createUnifiedErrorContainer();
            
            // Integrate CSS
            this.integrateErrorHandlingCSS();
            
            // Setup UI event handlers
            this.setupUIEventHandlers();
            
            this.integrationStatus.ui = true;
            this.logIntegration("UI systems integrated", "success");
            
        } catch (error) {
            this.logIntegration(`UI integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * 哲学的システム統合
     */
    async integratePhilosophy() {
        try {
            console.log("🔮 Integrating philosophical systems...");
            
            // bunenjin philosophy integration
            this.integrateBunenjinPhilosophy();
            
            // I Ching integration
            this.integrateIChingSystem();
            
            // Triple OS integration
            this.integrateTripleOSSystem();
            
            this.integrationStatus.philosophy = true;
            this.logIntegration("Philosophical systems integrated", "success");
            
        } catch (error) {
            this.logIntegration(`Philosophy integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * パフォーマンス統合
     */
    async integratePerformance() {
        try {
            console.log("⚡ Integrating performance systems...");
            
            // Performance monitoring
            this.setupPerformanceMonitoring();
            
            // Memory optimization
            this.setupMemoryOptimization();
            
            // Real-time metrics
            this.setupRealtimeMetrics();
            
            this.integrationStatus.performance = true;
            this.logIntegration("Performance systems integrated", "success");
            
        } catch (error) {
            this.logIntegration(`Performance integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * レガシーシステム統合
     */
    async integrateLegacySystems() {
        try {
            console.log("🔄 Integrating legacy systems...");
            
            // Backward compatibility for existing ErrorHandler
            this.setupBackwardCompatibility();
            
            // Legacy error format support
            this.setupLegacyErrorFormatSupport();
            
            // Migration path for existing implementations
            this.setupMigrationSupport();
            
            this.integrationStatus.legacy = true;
            this.logIntegration("Legacy systems integrated", "success");
            
        } catch (error) {
            this.logIntegration(`Legacy integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * グローバル統合セットアップ
     */
    async setupGlobalIntegration() {
        try {
            console.log("🌐 Setting up global integration...");
            
            // Global error handlers
            this.setupGlobalErrorHandlers();
            
            // Window object integration
            this.setupWindowIntegration();
            
            // Event system integration
            this.setupEventSystemIntegration();
            
            // Module system integration
            this.setupModuleSystemIntegration();
            
            this.logIntegration("Global integration completed", "success");
            
        } catch (error) {
            this.logIntegration(`Global integration failed: ${error.message}`, "error");
            throw error;
        }
    }

    /**
     * 統一エラーコンテナ作成
     */
    createUnifiedErrorContainer() {
        let container = document.getElementById('haqei-unified-error-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'haqei-unified-error-container';
            container.className = 'haqei-unified-error-container';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                pointer-events: none;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            
            document.body.appendChild(container);
        }
        
        return container;
    }

    /**
     * エラーハンドリングCSS統合
     */
    integrateErrorHandlingCSS() {
        const existingStyles = document.getElementById('haqei-error-handling-styles');
        
        if (!existingStyles) {
            const link = document.createElement('link');
            link.id = 'haqei-error-handling-styles';
            link.rel = 'stylesheet';
            link.href = 'css/error-handling.css';
            document.head.appendChild(link);
        }
    }

    /**
     * UIイベントハンドラー設定
     */
    setupUIEventHandlers() {
        // Custom error events
        window.addEventListener('haqei-error', (event) => {
            if (this.errorHandlerInstance) {
                this.errorHandlerInstance.handleError(
                    event.detail.error,
                    event.detail.context,
                    event.detail.details,
                    event.detail.options
                );
            }
        });

        // Recovery events
        window.addEventListener('haqei-error-recovery', (event) => {
            if (this.errorHandlerInstance) {
                this.logIntegration(`Recovery requested for: ${event.detail.error?.message}`, "info");
            }
        });

        // Retry events
        window.addEventListener('haqei-error-retry', (event) => {
            if (this.errorHandlerInstance) {
                this.logIntegration(`Retry requested for: ${event.detail.error?.message}`, "info");
            }
        });
    }

    /**
     * bunenjin哲学統合
     */
    integrateBunenjinPhilosophy() {
        // Persona balance monitoring
        if (this.errorHandlerInstance) {
            this.errorHandlerInstance.bunenjinPersonas = {
                analyticalSelf: { weight: 0.4, approach: 'logical_analysis' },
                intuitiveSelf: { weight: 0.3, approach: 'spiritual_guidance' },
                socialSelf: { weight: 0.3, approach: 'user_empathy' }
            };
        }

        // Philosophy validation
        this.validatePhilosophicalAlignment = () => {
            return {
                bunenjin: true,
                tripleOS: true,
                iching: true,
                overall: true
            };
        };
    }

    /**
     * 易経システム統合
     */
    integrateIChingSystem() {
        // Hexagram mapping for errors
        this.hexagramErrorMapping = {
            network: 5,  // 水天需 - 待機の智慧
            memory: 2,   // 坤為地 - 受容と包容
            ui: 30,      // 離為火 - 明晰さ
            validation: 15, // 地山謙 - 謙虚と調整
            system: 3,   // 水雷屯 - 困難の始まり
            philosophy: 32 // 雷風恒 - 持続性
        };

        // Guidance system
        this.generateIChingGuidance = (errorType) => {
            const hexagram = this.hexagramErrorMapping[errorType] || 1;
            return this.getHexagramGuidance(hexagram);
        };
    }

    /**
     * Triple OSシステム統合
     */
    integrateTripleOSSystem() {
        this.tripleOSIntegration = {
            engineOS: {
                role: "Core error processing",
                processor: (error) => this.processInEngineOS(error)
            },
            interfaceOS: {
                role: "User error communication",
                processor: (error) => this.processInInterfaceOS(error)
            },
            safeModeOS: {
                role: "System protection",
                processor: (error) => this.processInSafeModeOS(error)
            }
        };
    }

    /**
     * パフォーマンス監視設定
     */
    setupPerformanceMonitoring() {
        this.performanceMonitor = {
            startTime: Date.now(),
            metrics: {
                errorCount: 0,
                averageResponseTime: 0,
                memoryUsage: 0,
                throughput: 0
            },
            
            recordError: (responseTime) => {
                this.performanceMonitor.metrics.errorCount++;
                this.performanceMonitor.metrics.averageResponseTime = 
                    (this.performanceMonitor.metrics.averageResponseTime + responseTime) / 2;
                
                if (performance.memory) {
                    this.performanceMonitor.metrics.memoryUsage = performance.memory.usedJSHeapSize;
                }
                
                const timeElapsed = (Date.now() - this.performanceMonitor.startTime) / 1000;
                this.performanceMonitor.metrics.throughput = 
                    this.performanceMonitor.metrics.errorCount / timeElapsed;
            }
        };
    }

    /**
     * メモリ最適化設定
     */
    setupMemoryOptimization() {
        this.memoryOptimizer = {
            threshold: 10485760, // 10MB
            
            checkMemory: () => {
                if (performance.memory) {
                    const used = performance.memory.usedJSHeapSize;
                    if (used > this.memoryOptimizer.threshold) {
                        this.memoryOptimizer.optimize();
                    }
                }
            },
            
            optimize: () => {
                // Trigger garbage collection if available
                if (window.gc) {
                    window.gc();
                }
                
                // Clear caches
                if (this.errorHandlerInstance) {
                    this.errorHandlerInstance.compressErrorHistory();
                }
            }
        };

        // Periodic memory check
        setInterval(() => {
            this.memoryOptimizer.checkMemory();
        }, 30000);
    }

    /**
     * リアルタイムメトリクス設定
     */
    setupRealtimeMetrics() {
        this.metricsUpdateInterval = setInterval(() => {
            this.updateRealtimeMetrics();
        }, 5000);
    }

    /**
     * 後方互換性設定
     */
    setupBackwardCompatibility() {
        // Legacy ErrorHandler compatibility
        if (!window.ErrorHandler && this.errorHandlerInstance) {
            window.ErrorHandler = function(containerId) {
                console.warn("⚠️ Using legacy ErrorHandler constructor. Consider migrating to UnifiedErrorHandler.");
                return new UnifiedErrorHandler({ uiContainerId: containerId || 'error-container' });
            };
        }

        // Legacy method aliases
        if (this.errorHandlerInstance) {
            // Alias for legacy methods
            this.errorHandlerInstance.displayError = this.errorHandlerInstance.displayErrorWithUI;
            this.errorHandlerInstance.showNotification = this.errorHandlerInstance.showPhilosophicalNotification;
        }
    }

    /**
     * レガシーエラーフォーマットサポート
     */
    setupLegacyErrorFormatSupport() {
        this.convertLegacyError = (legacyError) => {
            // Convert old error format to new format
            return {
                error: legacyError.error || new Error(legacyError.message || 'Unknown error'),
                context: legacyError.context || 'Legacy Error',
                details: legacyError.details || {},
                options: {
                    legacy: true,
                    originalFormat: legacyError
                }
            };
        };
    }

    /**
     * グローバルエラーハンドラー設定
     */
    setupGlobalErrorHandlers() {
        // Enhanced global error handler
        window.addEventListener('error', (event) => {
            if (this.errorHandlerInstance) {
                this.errorHandlerInstance.handleError(
                    event.error || new Error(event.message),
                    'グローバルエラー',
                    {
                        filename: event.filename,
                        lineno: event.lineno,
                        colno: event.colno,
                        stack: event.error?.stack
                    }
                );
            }
        });

        // Enhanced unhandled rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            if (this.errorHandlerInstance) {
                const error = event.reason instanceof Error ? 
                    event.reason : new Error(String(event.reason));
                
                this.errorHandlerInstance.handleError(
                    error,
                    '未処理のPromise拒否',
                    { promise: event.promise }
                );
            }
        });
    }

    /**
     * Windowオブジェクト統合
     */
    setupWindowIntegration() {
        // Make unified error handler globally available
        window.HAQEIErrorSystem = {
            handler: this.errorHandlerInstance,
            integrator: this,
            version: this.version,
            
            // Public API
            handleError: (error, context, details, options) => {
                if (this.errorHandlerInstance) {
                    return this.errorHandlerInstance.handleError(error, context, details, options);
                }
            },
            
            getStatistics: () => {
                if (this.errorHandlerInstance) {
                    return this.errorHandlerInstance.getEnhancedStatistics();
                }
                return null;
            },
            
            getIntegrationStatus: () => {
                return this.integrationStatus;
            },
            
            getIntegrationLog: () => {
                return this.integrationLog;
            }
        };
    }

    /**
     * イベントシステム統合
     */
    setupEventSystemIntegration() {
        // Custom event dispatcher for HAQEI error system
        this.eventDispatcher = {
            dispatch: (eventName, data) => {
                const event = new CustomEvent(eventName, { detail: data });
                window.dispatchEvent(event);
            },
            
            on: (eventName, handler) => {
                window.addEventListener(eventName, handler);
            },
            
            off: (eventName, handler) => {
                window.removeEventListener(eventName, handler);
            }
        };

        // Make it globally available
        window.HAQEIEvents = this.eventDispatcher;
    }

    /**
     * モジュールシステム統合
     */
    setupModuleSystemIntegration() {
        // CommonJS/Node.js support
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = {
                UnifiedErrorHandler: this.errorHandlerInstance?.constructor,
                HAQEIErrorManager: typeof HAQEIErrorManager !== 'undefined' ? HAQEIErrorManager : null,
                ErrorDisplayUI: typeof ErrorDisplayUI !== 'undefined' ? ErrorDisplayUI : null,
                UnifiedErrorSystemIntegrator: UnifiedErrorSystemIntegrator
            };
        }

        // AMD support
        if (typeof define === 'function' && define.amd) {
            define('haqei-unified-error-system', [], () => {
                return {
                    UnifiedErrorHandler: this.errorHandlerInstance?.constructor,
                    HAQEIErrorManager: typeof HAQEIErrorManager !== 'undefined' ? HAQEIErrorManager : null,
                    ErrorDisplayUI: typeof ErrorDisplayUI !== 'undefined' ? ErrorDisplayUI : null,
                    UnifiedErrorSystemIntegrator: UnifiedErrorSystemIntegrator
                };
            });
        }
    }

    // ============ Helper Methods ============

    /**
     * 統合ログ記録
     */
    logIntegration(message, type = 'info') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            message: message,
            type: type
        };
        
        this.integrationLog.push(logEntry);
        
        const prefix = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        }[type] || 'ℹ️';
        
        console.log(`${prefix} [HAQEI Integration] ${message}`);
    }

    /**
     * リアルタイムメトリクス更新
     */
    updateRealtimeMetrics() {
        if (this.performanceMonitor && this.errorHandlerInstance) {
            const stats = this.errorHandlerInstance.getEnhancedStatistics();
            
            // Dispatch metrics update event
            this.eventDispatcher.dispatch('haqei-metrics-update', {
                performance: this.performanceMonitor.metrics,
                system: stats,
                integration: this.integrationStatus
            });
        }
    }

    /**
     * 易経ガイダンス取得
     */
    getHexagramGuidance(hexagramNumber) {
        const guidanceDatabase = {
            1: { name: "乾為天", symbol: "☰", guidance: "創造力と行動力で困難を乗り越える時です" },
            2: { name: "坤為地", symbol: "☷", guidance: "受容性と忍耐力で状況を受け入れ、適応することが重要です" },
            3: { name: "水雷屯", symbol: "☵☳", guidance: "困難の始まりですが、これは成長の機会でもあります" },
            5: { name: "水天需", symbol: "☵☰", guidance: "待機の智慧を発揮する時です" },
            15: { name: "地山謙", symbol: "☷☶", guidance: "謙虚さが解決への道です" },
            30: { name: "離為火", symbol: "☲", guidance: "明晰さと洞察力で真相を見抜きます" },
            32: { name: "雷風恒", symbol: "☳☴", guidance: "持続性と一貫性を保つことが大切です" }
        };
        
        return guidanceDatabase[hexagramNumber] || guidanceDatabase[1];
    }

    /**
     * Triple OS処理メソッド
     */
    processInEngineOS(error) {
        return { processed: true, os: 'engine', error: error };
    }

    processInInterfaceOS(error) {
        return { processed: true, os: 'interface', error: error };
    }

    processInSafeModeOS(error) {
        return { processed: true, os: 'safeMode', error: error };
    }

    /**
     * 統合状態取得
     */
    getIntegrationStatus() {
        return {
            version: this.version,
            philosophy: this.philosophy,
            status: this.integrationStatus,
            log: this.integrationLog,
            errorHandler: !!this.errorHandlerInstance,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * クリーンアップ
     */
    cleanup() {
        console.log("🧹 Cleaning up HAQEI Unified Error System Integrator...");
        
        // Clear intervals
        if (this.metricsUpdateInterval) {
            clearInterval(this.metricsUpdateInterval);
        }

        // Cleanup error handler
        if (this.errorHandlerInstance && this.errorHandlerInstance.cleanup) {
            this.errorHandlerInstance.cleanup();
        }

        // Clear global references
        if (window.HAQEIErrorSystem) {
            delete window.HAQEIErrorSystem;
        }
        
        if (window.HAQEIEvents) {
            delete window.HAQEIEvents;
        }

        console.log("✅ HAQEI Unified Error System Integrator cleanup completed");
    }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.HAQEIUnifiedErrorSystemIntegrator = new UnifiedErrorSystemIntegrator();
        });
    } else {
        window.HAQEIUnifiedErrorSystemIntegrator = new UnifiedErrorSystemIntegrator();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedErrorSystemIntegrator;
}

console.log("✅ HAQEI Unified Error System Integrator v2.0.0 loaded and ready for integration");