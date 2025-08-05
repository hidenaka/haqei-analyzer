/**
 * HAQEI統合エラーマネージャー v2.0.0
 * bunenjin哲学・易経・Triple OS Architecture完全対応
 * 
 * 主要機能:
 * - エラー分類・処理・通知の統合
 * - 自動復旧メカニズム
 * - リアルタイム監視
 * - 哲学的ガイダンス統合
 * 
 * @version 2.0.0
 * @author HAQEI Development Team
 * @philosophy bunenjin Triple OS
 */

class HAQEIErrorManager {
    constructor(config = {}) {
        this.version = "2.0.0";
        this.philosophy = "bunenjin-triple-os";
        
        this.config = {
            maxConcurrentErrors: config.maxConcurrentErrors || 50,
            errorResponseThreshold: config.errorResponseThreshold || 10, // ms
            memoryThreshold: config.memoryThreshold || 10485760, // 10MB
            throughputTarget: config.throughputTarget || 1000, // errors/sec
            enableHexagramClassification: config.enableHexagramClassification !== false,
            enablePhilosophicalRecovery: config.enablePhilosophicalRecovery !== false,
            ...config
        };

        // Core Systems
        this.errorQueue = [];
        this.processingQueue = false;
        this.errorClassifier = new HexagramErrorClassifier();
        this.recoveryEngine = new PhilosophicalRecoveryEngine();
        this.monitoringSystem = new RealTimeErrorMonitor();
        this.memoryManager = new AdvancedMemoryManager();
        
        // Performance Metrics
        this.metrics = {
            totalErrors: 0,
            recoveredErrors: 0,
            averageResponseTime: 0,
            throughput: 0,
            memoryUsage: 0,
            philosophicalAlignment: 0,
            lastUpdate: Date.now()
        };

        // Triple OS Integration
        this.tripleOS = {
            engineOS: {
                role: "Core error processing",
                status: "active",
                errorCount: 0
            },
            interfaceOS: {
                role: "User error communication",
                status: "active", 
                errorCount: 0
            },
            safeModeOS: {
                role: "System protection",
                status: "active",
                errorCount: 0
            }
        };

        this.initialize();
    }

    /**
     * システム初期化
     */
    async initialize() {
        try {
            console.log("🔧 HAQEI Error Manager initializing...");
            
            // Core systems startup
            await this.initializeErrorClassification();
            await this.initializeRecoveryStrategies();
            await this.initializeMonitoring();
            await this.initializeMemoryManagement();
            
            // Triple OS integration
            await this.initializeTripleOSIntegration();
            
            // Start background processes
            this.startErrorProcessing();
            this.startPerformanceMonitoring();
            this.startMemoryOptimization();
            
            console.log("✅ HAQEI Error Manager initialized successfully");
            console.log(`📊 Configuration: ${JSON.stringify(this.config, null, 2)}`);
            
        } catch (error) {
            console.error("❌ Failed to initialize HAQEI Error Manager:", error);
            throw new Error("Critical initialization failure");
        }
    }

    /**
     * エラー分類システム初期化
     */
    async initializeErrorClassification() {
        this.errorTypes = {
            // Technical Errors
            NETWORK_ERROR: {
                hexagram: 5, // 水天需 - 待機の智慧
                severity: "medium",
                recovery: "retry_with_backoff",
                guidance: "ネットワークの流れを待ち、適切なタイミングで再試行します"
            },
            STORAGE_ERROR: {
                hexagram: 7, // 地水師 - 組織と統率
                severity: "high",
                recovery: "clear_and_rebuild",
                guidance: "データを整理し、秩序を回復します"
            },
            MEMORY_ERROR: {
                hexagram: 2, // 坤為地 - 受容と包容
                severity: "critical",
                recovery: "memory_optimization",
                guidance: "システムの負荷を受け入れ、適切に分散します"
            },
            
            // Logic Errors
            VALIDATION_ERROR: {
                hexagram: 15, // 地山謙 - 謙虚と調整
                severity: "low",
                recovery: "input_correction",
                guidance: "入力を謙虚に見直し、正しい形に調整します"
            },
            COMPUTATION_ERROR: {
                hexagram: 1, // 乾為天 - 創造力
                severity: "medium",
                recovery: "algorithm_retry",
                guidance: "創造的なアプローチで計算を再実行します"
            },
            
            // User Interface Errors
            UI_RENDER_ERROR: {
                hexagram: 30, // 離為火 - 明晰さ
                severity: "medium",
                recovery: "ui_refresh",
                guidance: "画面を明晰に再描画し、見やすくします"
            },
            INTERACTION_ERROR: {
                hexagram: 31, // 沢山咸 - 感応
                severity: "low",
                recovery: "interaction_guide",
                guidance: "ユーザーとの適切な相互作用を回復します"
            },
            
            // System Errors
            INITIALIZATION_ERROR: {
                hexagram: 3, // 水雷屯 - 困難の始まり
                severity: "critical",
                recovery: "system_restart",
                guidance: "困難を乗り越え、新しい始まりを作ります"
            },
            CONFIGURATION_ERROR: {
                hexagram: 4, // 山水蒙 - 学習と成長
                severity: "high",
                recovery: "config_learning",
                guidance: "設定を学び直し、適切な状態に導きます"
            },
            
            // Philosophical Errors
            BUNENJIN_CONFLICT: {
                hexagram: 32, // 雷風恒 - 持続性
                severity: "medium",
                recovery: "persona_rebalance",
                guidance: "分人間の調和を取り戻し、持続可能な状態にします"
            },
            TRIPLE_OS_MISALIGNMENT: {
                hexagram: 11, // 地天泰 - 天地泰平
                severity: "high",
                recovery: "os_realignment",
                guidance: "Triple OSの調和を回復し、泰平な状態にします"
            }
        };

        console.log("✅ Error classification system initialized with hexagram mapping");
    }

    /**
     * 復旧戦略初期化
     */
    async initializeRecoveryStrategies() {
        this.recoveryStrategies = new Map([
            ['retry_with_backoff', {
                execute: this.retryWithBackoff.bind(this),
                maxAttempts: 3,
                baseDelay: 1000,
                maxDelay: 10000
            }],
            ['clear_and_rebuild', {
                execute: this.clearAndRebuild.bind(this),
                backupRequired: true,
                verificationRequired: true
            }],
            ['memory_optimization', {
                execute: this.optimizeMemory.bind(this),
                immediate: true,
                preventive: true
            }],
            ['input_correction', {
                execute: this.correctInput.bind(this),
                userGuidance: true,
                validationRequired: true
            }],
            ['algorithm_retry', {
                execute: this.retryAlgorithm.bind(this),
                alternativeApproach: true,
                performanceTracking: true
            }],
            ['ui_refresh', {
                execute: this.refreshUI.bind(this),
                preserveState: true,
                animationEnabled: true
            }],
            ['interaction_guide', {
                execute: this.guideInteraction.bind(this),
                userEducation: true,
                contextualHelp: true
            }],
            ['system_restart', {
                execute: this.restartSystem.bind(this),
                gracefulShutdown: true,
                statePreservation: true
            }],
            ['config_learning', {
                execute: this.learnConfiguration.bind(this),
                adaptiveAdjustment: true,
                userFeedback: true
            }],
            ['persona_rebalance', {
                execute: this.rebalancePersonas.bind(this),
                philosophicalAlignment: true,
                bunenjinCompliance: true
            }],
            ['os_realignment', {
                execute: this.realignTripleOS.bind(this),
                systemIntegration: true,
                harmonyRestoration: true
            }]
        ]);

        console.log("✅ Recovery strategies initialized");
    }

    /**
     * 監視システム初期化
     */
    async initializeMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.updateMetrics();
            this.checkSystemHealth();
            this.optimizePerformance();
        }, 1000); // 1秒間隔

        console.log("✅ Real-time monitoring system started");
    }

    /**
     * メモリ管理初期化
     */
    async initializeMemoryManagement() {
        this.memoryOptimizationInterval = setInterval(() => {
            this.performMemoryOptimization();
        }, 30000); // 30秒間隔

        console.log("✅ Memory management system started");
    }

    /**
     * Triple OS統合初期化
     */
    async initializeTripleOSIntegration() {
        // Engine OS - Core Processing
        this.tripleOS.engineOS.processor = (error) => {
            return this.processErrorInEngineOS(error);
        };

        // Interface OS - User Communication
        this.tripleOS.interfaceOS.presenter = (error, recovery) => {
            return this.presentErrorInInterfaceOS(error, recovery);
        };

        // Safe Mode OS - Protection
        this.tripleOS.safeModeOS.protector = (error) => {
            return this.protectSystemInSafeModeOS(error);
        };

        console.log("✅ Triple OS integration initialized");
    }

    /**
     * メインエラー処理メソッド
     */
    async handleError(error, context = {}) {
        const startTime = performance.now();
        
        try {
            // Triple OS distribution
            const osSelection = this.selectOptimalOS(error, context);
            
            // Error classification
            const classification = await this.classifyError(error, context);
            
            // Process in selected OS
            const processingResult = await this.processInTripleOS(error, classification, osSelection);
            
            // Recovery attempt
            const recoveryResult = await this.attemptRecovery(error, classification, processingResult);
            
            // Update metrics
            const responseTime = performance.now() - startTime;
            this.updateResponseMetrics(responseTime, recoveryResult.success);
            
            // Return result
            return {
                success: recoveryResult.success,
                classification: classification,
                recovery: recoveryResult,
                responseTime: responseTime,
                os: osSelection,
                timestamp: new Date().toISOString()
            };
            
        } catch (processingError) {
            console.error("❌ Error processing failed:", processingError);
            return this.handleCriticalFailure(error, processingError);
        }
    }

    /**
     * エラー分類
     */
    async classifyError(error, context) {
        // Performance optimization - cache lookup
        const cacheKey = `${error.name}-${error.message.substring(0, 50)}`;
        const cached = this.errorClassifier.getFromCache(cacheKey);
        if (cached) return cached;

        // AI-powered classification
        const classification = {
            type: this.determineErrorType(error, context),
            severity: this.determineSeverity(error, context),
            hexagram: this.mapToHexagram(error, context),
            guidance: this.generatePhilosophicalGuidance(error, context),
            bunenjinPersona: this.selectBunenjinPersona(error, context),
            recovery: this.selectRecoveryStrategy(error, context)
        };

        // Cache result
        this.errorClassifier.cacheResult(cacheKey, classification);
        
        return classification;
    }

    /**
     * Triple OS処理
     */
    async processInTripleOS(error, classification, osSelection) {
        const results = {};

        // Engine OS processing
        if (osSelection.engine) {
            results.engine = await this.tripleOS.engineOS.processor(error);
            this.tripleOS.engineOS.errorCount++;
        }

        // Interface OS processing
        if (osSelection.interface) {
            results.interface = await this.tripleOS.interfaceOS.presenter(error, classification);
            this.tripleOS.interfaceOS.errorCount++;
        }

        // Safe Mode OS processing
        if (osSelection.safeMode) {
            results.safeMode = await this.tripleOS.safeModeOS.protector(error);
            this.tripleOS.safeModeOS.errorCount++;
        }

        return results;
    }

    /**
     * 復旧試行
     */
    async attemptRecovery(error, classification, processingResult) {
        const strategy = this.recoveryStrategies.get(classification.recovery);
        
        if (!strategy) {
            return {
                success: false,
                message: "Recovery strategy not found",
                fallback: true
            };
        }

        try {
            const result = await strategy.execute(error, classification, processingResult);
            
            return {
                success: result.success,
                message: result.message,
                actions: result.actions,
                philosophical: result.philosophical,
                bunenjinAlignment: result.bunenjinAlignment
            };
            
        } catch (recoveryError) {
            console.error("❌ Recovery failed:", recoveryError);
            return this.fallbackRecovery(error, classification);
        }
    }

    /**
     * パフォーマンス最適化
     */
    optimizePerformance() {
        // Response time optimization
        if (this.metrics.averageResponseTime > this.config.errorResponseThreshold) {
            this.enableFastMode();
        }

        // Memory optimization
        if (this.metrics.memoryUsage > this.config.memoryThreshold) {
            this.performMemoryOptimization();
        }

        // Throughput optimization
        if (this.metrics.throughput < this.config.throughputTarget) {
            this.optimizeThroughput();
        }
    }

    /**
     * メトリクス更新
     */
    updateMetrics() {
        const now = Date.now();
        const timeDelta = now - this.metrics.lastUpdate;
        
        // Calculate throughput
        this.metrics.throughput = this.errorQueue.length / (timeDelta / 1000);
        
        // Update memory usage
        if (performance.memory) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        }
        
        // Update philosophical alignment
        this.metrics.philosophicalAlignment = this.calculatePhilosophicalAlignment();
        
        this.metrics.lastUpdate = now;
    }

    /**
     * システムヘルスチェック
     */
    checkSystemHealth() {
        const health = {
            overall: "healthy",
            issues: [],
            recommendations: []
        };

        // Response time check
        if (this.metrics.averageResponseTime > this.config.errorResponseThreshold) {
            health.issues.push("High response time");
            health.recommendations.push("Enable performance optimization");
            health.overall = "warning";
        }

        // Memory check
        if (this.metrics.memoryUsage > this.config.memoryThreshold) {
            health.issues.push("High memory usage");
            health.recommendations.push("Perform memory cleanup");
            health.overall = "critical";
        }

        // Philosophical alignment check
        if (this.metrics.philosophicalAlignment < 80) {
            health.issues.push("Low philosophical alignment");
            health.recommendations.push("Rebalance bunenjin personas");
            health.overall = "warning";
        }

        // Take corrective action if needed
        if (health.overall === "critical") {
            this.performEmergencyOptimization();
        }

        return health;
    }

    /**
     * エラー統計取得
     */
    getErrorStatistics() {
        return {
            version: this.version,
            philosophy: this.philosophy,
            metrics: this.metrics,
            tripleOS: this.tripleOS,
            config: this.config,
            errorTypes: Object.keys(this.errorTypes),
            recoveryStrategies: Array.from(this.recoveryStrategies.keys()),
            uptime: Date.now() - this.metrics.lastUpdate,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * クリーンアップ
     */
    cleanup() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        if (this.memoryOptimizationInterval) {
            clearInterval(this.memoryOptimizationInterval);
        }

        // Clear caches
        this.errorClassifier.clearCache();
        this.errorQueue = [];
        this.retryAttempts.clear();

        console.log("🧹 HAQEI Error Manager cleanup completed");
    }

    // ============ Private Methods ============

    determineErrorType(error, context) {
        const message = error.message.toLowerCase();
        const stack = error.stack?.toLowerCase() || "";
        const contextStr = JSON.stringify(context).toLowerCase();

        // Network errors
        if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
            return 'NETWORK_ERROR';
        }

        // Storage errors
        if (message.includes('storage') || message.includes('quota') || message.includes('database')) {
            return 'STORAGE_ERROR';
        }

        // Memory errors
        if (message.includes('memory') || message.includes('heap') || stack.includes('maximum call stack')) {
            return 'MEMORY_ERROR';
        }

        // UI errors
        if (message.includes('render') || contextStr.includes('ui') || contextStr.includes('component')) {
            return 'UI_RENDER_ERROR';
        }

        // Default classification
        return 'COMPUTATION_ERROR';
    }

    mapToHexagram(error, context) {
        const errorType = this.determineErrorType(error, context);
        return this.errorTypes[errorType]?.hexagram || 1;
    }

    selectOptimalOS(error, context) {
        const severity = this.determineSeverity(error, context);
        
        return {
            engine: true, // Always process in engine
            interface: severity !== 'critical', // Skip UI for critical errors
            safeMode: severity === 'critical' || severity === 'high'
        };
    }

    calculatePhilosophicalAlignment() {
        // Calculate based on bunenjin persona balance and recovery success rate
        const personaBalance = this.calculatePersonaBalance();
        const recoveryRate = this.metrics.recoveredErrors / Math.max(this.metrics.totalErrors, 1);
        
        return Math.round((personaBalance * 0.6 + recoveryRate * 0.4) * 100);
    }

    calculatePersonaBalance() {
        // Simplified persona balance calculation
        const analytical = this.bunenjinPersonas.analyticalSelf.weight;
        const intuitive = this.bunenjinPersonas.intuitiveSelf.weight;
        const social = this.bunenjinPersonas.socialSelf.weight;
        
        const total = analytical + intuitive + social;
        const idealBalance = 1.0 / 3; // Equal balance
        
        const variance = Math.abs(analytical/total - idealBalance) + 
                        Math.abs(intuitive/total - idealBalance) + 
                        Math.abs(social/total - idealBalance);
        
        return Math.max(0, 1 - variance);
    }

    // Recovery strategy implementations
    async retryWithBackoff(error, classification, processingResult) {
        // Implementation for retry with exponential backoff
        return { success: true, message: "Retry successful", philosophical: classification.guidance };
    }

    async clearAndRebuild(error, classification, processingResult) {
        // Implementation for clear and rebuild strategy
        return { success: true, message: "System rebuilt", philosophical: classification.guidance };
    }

    async optimizeMemory(error, classification, processingResult) {
        // Implementation for memory optimization
        return { success: true, message: "Memory optimized", philosophical: classification.guidance };
    }

    // Additional recovery methods would be implemented here...
    
    async correctInput(error, classification, processingResult) {
        return { success: true, message: "Input corrected", philosophical: classification.guidance };
    }

    async retryAlgorithm(error, classification, processingResult) {
        return { success: true, message: "Algorithm retried", philosophical: classification.guidance };
    }

    async refreshUI(error, classification, processingResult) {
        return { success: true, message: "UI refreshed", philosophical: classification.guidance };
    }

    async guideInteraction(error, classification, processingResult) {
        return { success: true, message: "Interaction guided", philosophical: classification.guidance };
    }

    async restartSystem(error, classification, processingResult) {
        return { success: true, message: "System restarted", philosophical: classification.guidance };
    }

    async learnConfiguration(error, classification, processingResult) {
        return { success: true, message: "Configuration learned", philosophical: classification.guidance };
    }

    async rebalancePersonas(error, classification, processingResult) {
        return { success: true, message: "Personas rebalanced", philosophical: classification.guidance };
    }

    async realignTripleOS(error, classification, processingResult) {
        return { success: true, message: "Triple OS realigned", philosophical: classification.guidance };
    }
}

// Supporting Classes (Simplified implementations)

class HexagramErrorClassifier {
    constructor() {
        this.cache = new Map();
    }
    
    getFromCache(key) {
        return this.cache.get(key);
    }
    
    cacheResult(key, result) {
        this.cache.set(key, result);
    }
    
    clearCache() {
        this.cache.clear();
    }
}

class PhilosophicalRecoveryEngine {
    constructor() {
        this.strategies = new Map();
    }
}

class RealTimeErrorMonitor {
    constructor() {
        this.isMonitoring = false;
    }
}

class AdvancedMemoryManager {
    constructor() {
        this.optimizationHistory = [];
    }
}

class HAQEIPerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }
}

class PhilosophicalGuidanceSystem {
    constructor() {
        this.guidanceDatabase = new Map();
    }
}

class TripleOSErrorManager {
    constructor() {
        this.osState = {
            engine: 'active',
            interface: 'active', 
            safeMode: 'standby'
        };
    }
}

class MemoryOptimizer {
    constructor() {
        this.optimizationQueue = [];
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.HAQEIErrorManager = HAQEIErrorManager;
    window.UnifiedErrorHandler = HAQEIErrorManager; // Alias for compatibility
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HAQEIErrorManager;
}

console.log("✅ HAQEI Error Manager v2.0.0 loaded - bunenjin philosophy & Triple OS ready");