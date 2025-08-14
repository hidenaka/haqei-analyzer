/**
 * HAQEI Trace Logger
 * 詳細なトレースログ機能の実装
 * Version: 2.2.2
 */

class TraceLogger {
    constructor() {
        this.entries = [];
        this.startTime = null;
        this.requestId = null;
        this.enabled = false;
    }

    /**
     * トレースログの初期化
     */
    initialize(requestId = null, enabled = false) {
        this.entries = [];
        this.startTime = performance.now();
        this.requestId = requestId || this.generateRequestId();
        this.enabled = enabled || window.debugHAQEI;
        
        if (this.enabled) {
            console.log(`[TraceLogger] Initialized - RequestID: ${this.requestId}`);
        }
    }

    /**
     * リクエストIDの生成
     */
    generateRequestId() {
        return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * トレースエントリの記録
     */
    trace(step, input, output, metadata = {}) {
        if (!this.enabled) return;

        const entryTime = performance.now();
        const duration = this.entries.length > 0 
            ? entryTime - (this.startTime + this.getTotalDuration())
            : entryTime - this.startTime;

        const entry = {
            step,
            timestamp: new Date().toISOString(),
            input: this.sanitizeData(input),
            output: this.sanitizeData(output),
            duration: Math.round(duration * 100) / 100,
            metadata
        };

        this.entries.push(entry);

        // コンソール出力
        if (window.debugHAQEI) {
            console.group(`[Trace] ${step}`);
            console.log('Input:', entry.input);
            console.log('Output:', entry.output);
            console.log(`Duration: ${entry.duration}ms`);
            if (Object.keys(metadata).length > 0) {
                console.log('Metadata:', metadata);
            }
            console.groupEnd();
        }

        return entry;
    }

    /**
     * エラーの記録
     */
    traceError(step, error, context = {}) {
        const entry = this.trace(step, context, null, {
            error: error.message || error,
            stack: error.stack
        });
        
        if (this.enabled) {
            console.error(`[TraceError] ${step}:`, error);
        }
        
        return entry;
    }

    /**
     * 警告の記録
     */
    traceWarning(step, warning, context = {}) {
        const entry = this.trace(step, context, null, {
            warning: warning
        });
        
        if (this.enabled) {
            console.warn(`[TraceWarning] ${step}:`, warning);
        }
        
        return entry;
    }

    /**
     * データのサニタイズ（循環参照対策）
     */
    sanitizeData(data) {
        try {
            return JSON.parse(JSON.stringify(data, (key, value) => {
                // 関数は文字列化
                if (typeof value === 'function') {
                    return `[Function: ${value.name || 'anonymous'}]`;
                }
                // undefined は null に変換
                if (value === undefined) {
                    return null;
                }
                // 大きな配列は要約
                if (Array.isArray(value) && value.length > 10) {
                    return {
                        type: 'Array',
                        length: value.length,
                        sample: value.slice(0, 3)
                    };
                }
                return value;
            }));
        } catch (e) {
            return { error: 'Failed to sanitize data', type: typeof data };
        }
    }

    /**
     * 総実行時間の取得
     */
    getTotalDuration() {
        return this.entries.reduce((sum, entry) => sum + entry.duration, 0);
    }

    /**
     * エラー数の取得
     */
    getErrorCount() {
        return this.entries.filter(e => e.metadata && e.metadata.error).length;
    }

    /**
     * 警告数の取得
     */
    getWarningCount() {
        return this.entries.filter(e => e.metadata && e.metadata.warning).length;
    }

    /**
     * サマリーの生成
     */
    getSummary() {
        return {
            requestId: this.requestId,
            totalSteps: this.entries.length,
            totalDuration: Math.round(this.getTotalDuration() * 100) / 100,
            errors: this.getErrorCount(),
            warnings: this.getWarningCount(),
            startTime: new Date(performance.timeOrigin + this.startTime).toISOString(),
            endTime: new Date().toISOString()
        };
    }

    /**
     * 完全なトレースログの取得
     */
    getFullTrace() {
        return {
            timestamp: new Date().toISOString(),
            requestId: this.requestId,
            entries: this.entries,
            summary: this.getSummary()
        };
    }

    /**
     * トレースログのエクスポート（JSON）
     */
    exportJSON() {
        return JSON.stringify(this.getFullTrace(), null, 2);
    }

    /**
     * トレースログのエクスポート（CSV）
     */
    exportCSV() {
        const headers = ['Step', 'Duration(ms)', 'Input', 'Output', 'Error', 'Warning'];
        const rows = this.entries.map(entry => [
            entry.step,
            entry.duration,
            JSON.stringify(entry.input),
            JSON.stringify(entry.output),
            entry.metadata?.error || '',
            entry.metadata?.warning || ''
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        return csv;
    }

    /**
     * トレースログのクリア
     */
    clear() {
        this.entries = [];
        this.startTime = null;
        this.requestId = null;
    }

    /**
     * パフォーマンスメトリクスの取得
     */
    getPerformanceMetrics() {
        const metrics = {};
        
        // ステップごとの実行時間を集計
        this.entries.forEach(entry => {
            if (!metrics[entry.step]) {
                metrics[entry.step] = {
                    count: 0,
                    totalDuration: 0,
                    minDuration: Infinity,
                    maxDuration: -Infinity,
                    avgDuration: 0
                };
            }
            
            const metric = metrics[entry.step];
            metric.count++;
            metric.totalDuration += entry.duration;
            metric.minDuration = Math.min(metric.minDuration, entry.duration);
            metric.maxDuration = Math.max(metric.maxDuration, entry.duration);
            metric.avgDuration = metric.totalDuration / metric.count;
        });

        return metrics;
    }

    /**
     * ボトルネックの検出
     */
    detectBottlenecks(threshold = 100) {
        return this.entries
            .filter(entry => entry.duration > threshold)
            .sort((a, b) => b.duration - a.duration)
            .map(entry => ({
                step: entry.step,
                duration: entry.duration,
                percentage: (entry.duration / this.getTotalDuration() * 100).toFixed(2) + '%'
            }));
    }
}

// グローバルインスタンスの作成
if (typeof window !== 'undefined') {
    window.HAQEITraceLogger = new TraceLogger();
}