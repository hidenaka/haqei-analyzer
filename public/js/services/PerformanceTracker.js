class PerformanceTracker {
    constructor() {
        this.marks = new Map();
    }
    
    start(label) {
        this.marks.set(label, performance.now());
    }
    
    end(label) {
        const start = this.marks.get(label);
        if (!start) return null;
        
        const duration = performance.now() - start;
        this.marks.delete(label);
        
        // メトリクス記録
        if (window.metrics) {
            window.metrics.record('latency', duration);
        }
        
        return duration;
    }
    
    measure(fn, label) {
        this.start(label);
        const result = fn();
        const duration = this.end(label);
        return { result, duration };
    }
}

export const performanceTracker = new PerformanceTracker();