class MinimalMetrics {
    constructor() {
        this.metrics = {
            accuracy: [],
            latency: [],
            cacheHitRate: [],
            errors: []
        };
        this.startTime = Date.now();
    }
    
    record(type, value) {
        if (!this.metrics[type]) return;
        
        this.metrics[type].push({
            value,
            timestamp: Date.now() - this.startTime
        });
        
        // バッファが100件超えたら古いデータを削除
        if (this.metrics[type].length > 100) {
            this.metrics[type].shift();
        }
    }
    
    getStats(type) {
        const data = this.metrics[type];
        if (!data || data.length === 0) return null;
        
        const values = data.map(d => d.value);
        values.sort((a, b) => a - b);
        
        return {
            count: values.length,
            mean: values.reduce((a, b) => a + b, 0) / values.length,
            p50: values[Math.floor(values.length * 0.5)],
            p95: values[Math.floor(values.length * 0.95)],
            p99: values[Math.floor(values.length * 0.99)]
        };
    }
}

export { MinimalMetrics };