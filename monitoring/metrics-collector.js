class MetricsCollector {
    constructor() {
        this.metrics = {
            performance: {
                e2e_times: [],
                cache_hits: 0,
                cache_misses: 0
            },
            accuracy: {
                predictions: [],
                feedback: []
            },
            distribution: {
                linePositions: new Array(6).fill(0),
                hexagrams: new Array(64).fill(0)
            },
            errors: {
                count: 0,
                types: {}
            }
        };
        
        // アラート閾値
        this.alertThresholds = {
            e2e_p95: 45,           // 45ms超えたらアラート
            error_rate: 0.01,      // エラー率1%超えたらアラート
            position_bias: 0.30,   // 位置偏り30%超えたらアラート
            cache_hit_rate: 0.70   // キャッシュヒット率70%未満でアラート
        };
    }
    
    checkAlerts() {
        const alerts = [];
        
        // パフォーマンスチェック
        const p95 = this.calculateP95(this.metrics.performance.e2e_times);
        if (p95 > this.alertThresholds.e2e_p95) {
            alerts.push({
                type: 'PERFORMANCE',
                message: `E2E P95 ${p95}ms exceeds ${this.alertThresholds.e2e_p95}ms`,
                severity: 'HIGH'
            });
        }
        
        // 分布偏りチェック（χ²検定）
        const chiSquare = this.calculateChiSquare(this.metrics.distribution.linePositions);
        if (chiSquare.pValue < 0.05) {
            alerts.push({
                type: 'DISTRIBUTION_BIAS',
                message: `Position distribution bias detected (p=${chiSquare.pValue})`,
                severity: 'MEDIUM'
            });
        }
        
        return alerts;
    }

    // 以下はcalculateP95とcalculateChiSquareの例の実装（タスク分解表に基づき追加）
    calculateP95(times) {
        if (times.length === 0) return 0;
        const sorted = [...times].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length * 0.95)];
    }

    calculateChiSquare(observed) {
        const n = observed.reduce((a, b) => a + b, 0);
        if (n === 0) return { chiSquare: 0, pValue: 1 };
        const expected = n / observed.length;
        let chiSquare = 0;
        for (const obs of observed) {
            chiSquare += Math.pow(obs - expected, 2) / expected;
        }
        // 簡易pValue計算（実際には統計ライブラリ使用推奨）
        const pValue = 1 - chiSquare / (observed.length - 1); // 簡易近似
        return { chiSquare, pValue };
    }
}