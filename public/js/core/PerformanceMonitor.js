// 実装要件: パフォーマンス監視システム
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            analysisTime: [],  // 分析時間履歴 (ms)
            errorRate: 0,
            cacheHitRate: 0,
            totalRequests: 0,
            errors: 0,
            cacheHits: 0
        };
        this.thresholds = {
            maxAnalysisTime: 500,  // ms
            maxErrorRate: 0.05,    // 5%
            minCacheHitRate: 0.7   // 70%
        };
        this.alertHistory = [];
    }
    
    recordAnalysis(duration) {
        this.metrics.analysisTime.push(duration);
        if (this.metrics.analysisTime.length > 100) {
            this.metrics.analysisTime.shift();
        }
        this.metrics.totalRequests++;
        this.checkThresholds();
    }
    
    recordError() {
        this.metrics.errors++;
        this.metrics.errorRate = this.metrics.errors / this.metrics.totalRequests;
        this.checkThresholds();
    }
    
    recordCacheHit(isHit) {
        if (isHit) this.metrics.cacheHits++;
        this.metrics.cacheHitRate = this.metrics.cacheHits / this.metrics.totalRequests;
        this.checkThresholds();
    }
    
    checkThresholds() {
        const avgTime = this.metrics.analysisTime.reduce((a, b) => a + b, 0) / this.metrics.analysisTime.length;
        const alerts = [];
        
        if (avgTime > this.thresholds.maxAnalysisTime) {
            alerts.push(`分析時間超過: ${avgTime.toFixed(2)}ms`);
        }
        if (this.metrics.errorRate > this.thresholds.maxErrorRate) {
            alerts.push(`エラー率超過: ${(this.metrics.errorRate * 100).toFixed(1)}%`);
        }
        if (this.metrics.cacheHitRate < this.thresholds.minCacheHitRate && this.metrics.totalRequests > 10) {
            alerts.push(`キャッシュヒット率低下: ${(this.metrics.cacheHitRate * 100).toFixed(1)}%`);
        }
        
        alerts.forEach(alert => {
            console.warn(`🚨 パフォーマンスアラート: ${alert}`);
            this.alertHistory.push({timestamp: Date.now(), message: alert});
            // 通知統合（例: APIコール）
        });
    }
    
    getStats() {
        const avgTime = this.metrics.analysisTime.reduce((a, b) => a + b, 0) / (this.metrics.analysisTime.length || 1);
        return {
            avgAnalysisTime: avgTime.toFixed(2),
            errorRate: (this.metrics.errorRate * 100).toFixed(1) + '%',
            cacheHitRate: (this.metrics.cacheHitRate * 100).toFixed(1) + '%',
            totalRequests: this.metrics.totalRequests,
            recentAlerts: this.alertHistory.slice(-5)
        };
    }
    
    reset() {
        Object.assign(this.metrics, {
            analysisTime: [],
            errorRate: 0,
            cacheHitRate: 0,
            totalRequests: 0,
            errors: 0,
            cacheHits: 0
        });
        this.alertHistory = [];
    }
}

// グローバルインスタンス
window.performanceMonitor = new PerformanceMonitor();

// 使用例
// analysisStart = performance.now();
// ... analysis ...
// performanceMonitor.recordAnalysis(performance.now() - analysisStart);
// performanceMonitor.recordCacheHit(true);
// エラー時: performanceMonitor.recordError();