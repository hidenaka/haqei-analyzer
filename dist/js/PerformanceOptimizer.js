/**
 * Performance Optimizer - Phase 2
 * パフォーマンス最適化とメモリ管理
 */

class PerformanceOptimizer {
    constructor() {
        // パフォーマンス設定
        this.config = {
            enableCache: true,
            cacheMaxSize: 50,
            cacheTTL: 300000, // 5分
            enableLazyLoading: true,
            enableDebounce: true,
            debounceDelay: 150,
            enableThrottle: true,
            throttleDelay: 100,
            enableWebWorker: typeof Worker !== 'undefined',
            enableRequestAnimationFrame: true,
            batchRenderSize: 10
        };
        
        // キャッシュストア
        this.cache = new Map();
        this.cacheTimestamps = new Map();
        
        // パフォーマンスメトリクス
        this.metrics = {
            renderTime: [],
            calculationTime: [],
            memoryUsage: [],
            frameRate: []
        };
        
        // デバウンス・スロットル用
        this.debounceTimers = new Map();
        this.throttleTimestamps = new Map();
        
        // Web Worker初期化
        if (this.config.enableWebWorker) {
            this.initializeWebWorker();
        }
        
        // メモリ監視
        this.startMemoryMonitoring();
    }
    
    /**
     * 計算処理の最適化
     */
    optimizeCalculation(func, key, ...args) {
        const startTime = performance.now();
        
        // キャッシュチェック
        if (this.config.enableCache) {
            const cached = this.getFromCache(key);
            if (cached !== null) {
                this.recordMetric('calculationTime', 0);
                return cached;
            }
        }
        
        // 実行
        const result = func(...args);
        
        // キャッシュ保存
        if (this.config.enableCache) {
            this.saveToCache(key, result);
        }
        
        const endTime = performance.now();
        this.recordMetric('calculationTime', endTime - startTime);
        
        return result;
    }
    
    /**
     * レンダリング最適化
     */
    optimizeRender(renderFunc, container, data) {
        const startTime = performance.now();
        
        if (this.config.enableRequestAnimationFrame) {
            return new Promise((resolve) => {
                requestAnimationFrame(() => {
                    this.batchRender(renderFunc, container, data);
                    const endTime = performance.now();
                    this.recordMetric('renderTime', endTime - startTime);
                    resolve();
                });
            });
        } else {
            this.batchRender(renderFunc, container, data);
            const endTime = performance.now();
            this.recordMetric('renderTime', endTime - startTime);
        }
    }
    
    /**
     * バッチレンダリング
     */
    batchRender(renderFunc, container, data) {
        // DocumentFragmentを使用してDOM操作を最小化
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');
        fragment.appendChild(tempContainer);
        
        // 仮想DOMで構築
        renderFunc(tempContainer, data);
        
        // 一度にDOMに追加
        container.innerHTML = '';
        container.appendChild(tempContainer.firstChild || tempContainer);
    }
    
    /**
     * デバウンス処理
     */
    debounce(func, key, delay = null) {
        if (!this.config.enableDebounce) {
            return func;
        }
        
        const actualDelay = delay || this.config.debounceDelay;
        
        return (...args) => {
            // 既存のタイマーをクリア
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            // 新しいタイマーを設定
            const timer = setTimeout(() => {
                func(...args);
                this.debounceTimers.delete(key);
            }, actualDelay);
            
            this.debounceTimers.set(key, timer);
        };
    }
    
    /**
     * スロットル処理
     */
    throttle(func, key, delay = null) {
        if (!this.config.enableThrottle) {
            return func;
        }
        
        const actualDelay = delay || this.config.throttleDelay;
        
        return (...args) => {
            const now = Date.now();
            const lastCall = this.throttleTimestamps.get(key) || 0;
            
            if (now - lastCall >= actualDelay) {
                func(...args);
                this.throttleTimestamps.set(key, now);
            }
        };
    }
    
    /**
     * 遅延読み込み
     */
    lazyLoad(loader, key) {
        if (!this.config.enableLazyLoading) {
            return loader();
        }
        
        return new Promise((resolve) => {
            // Intersection Observer使用
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const result = loader();
                        observer.disconnect();
                        resolve(result);
                    }
                });
            });
            
            // ダミー要素を監視
            const sentinel = document.createElement('div');
            sentinel.id = `lazy-${key}`;
            document.body.appendChild(sentinel);
            observer.observe(sentinel);
            
            // フォールバック：3秒後に強制ロード
            setTimeout(() => {
                observer.disconnect();
                sentinel.remove();
                resolve(loader());
            }, 3000);
        });
    }
    
    /**
     * Web Worker初期化
     */
    initializeWebWorker() {
        const workerCode = `
            self.addEventListener('message', function(e) {
                const { type, data } = e.data;
                
                switch(type) {
                    case 'calculate':
                        const result = performCalculation(data);
                        self.postMessage({ type: 'result', data: result });
                        break;
                        
                    case 'optimize':
                        const optimized = optimizeData(data);
                        self.postMessage({ type: 'optimized', data: optimized });
                        break;
                }
            });
            
            function performCalculation(data) {
                // 重い計算処理
                let result = 0;
                for (let i = 0; i < data.iterations; i++) {
                    result += Math.sqrt(i) * Math.sin(i);
                }
                return result;
            }
            
            function optimizeData(data) {
                // データ最適化処理
                return data.map(item => ({
                    ...item,
                    optimized: true,
                    processedAt: Date.now()
                }));
            }
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        
        try {
            this.worker = new Worker(workerUrl);
            
            this.worker.addEventListener('message', (e) => {
                this.handleWorkerMessage(e.data);
            });
            
            this.worker.addEventListener('error', (error) => {
                console.error('Worker error:', error);
                this.config.enableWebWorker = false;
            });
        } catch (error) {
            console.warn('Web Worker not available:', error);
            this.config.enableWebWorker = false;
        }
    }
    
    /**
     * Worker メッセージハンドラ
     */
    handleWorkerMessage(message) {
        const { type, data } = message;
        
        switch(type) {
            case 'result':
                this.workerCallbacks.get('calculate')?.(data);
                break;
            case 'optimized':
                this.workerCallbacks.get('optimize')?.(data);
                break;
        }
    }
    
    /**
     * 重い計算をWorkerで実行
     */
    calculateInWorker(data) {
        if (!this.config.enableWebWorker || !this.worker) {
            // フォールバック：メインスレッドで実行
            return Promise.resolve(this.performCalculationFallback(data));
        }
        
        return new Promise((resolve) => {
            if (!this.workerCallbacks) {
                this.workerCallbacks = new Map();
            }
            
            this.workerCallbacks.set('calculate', resolve);
            this.worker.postMessage({ type: 'calculate', data });
        });
    }
    
    /**
     * キャッシュ取得
     */
    getFromCache(key) {
        if (!this.cache.has(key)) {
            return null;
        }
        
        const timestamp = this.cacheTimestamps.get(key);
        const now = Date.now();
        
        // TTLチェック
        if (now - timestamp > this.config.cacheTTL) {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
            return null;
        }
        
        return this.cache.get(key);
    }
    
    /**
     * キャッシュ保存
     */
    saveToCache(key, value) {
        // キャッシュサイズ制限
        if (this.cache.size >= this.config.cacheMaxSize) {
            // 最も古いエントリを削除
            const oldestKey = this.findOldestCacheEntry();
            if (oldestKey) {
                this.cache.delete(oldestKey);
                this.cacheTimestamps.delete(oldestKey);
            }
        }
        
        this.cache.set(key, value);
        this.cacheTimestamps.set(key, Date.now());
    }
    
    /**
     * 最も古いキャッシュエントリを検索
     */
    findOldestCacheEntry() {
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, timestamp] of this.cacheTimestamps.entries()) {
            if (timestamp < oldestTime) {
                oldestTime = timestamp;
                oldestKey = key;
            }
        }
        
        return oldestKey;
    }
    
    /**
     * メモリ監視開始
     */
    startMemoryMonitoring() {
        if (!performance.memory) {
            return; // メモリAPIが利用できない
        }
        
        setInterval(() => {
            const memoryInfo = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
            };
            
            this.recordMetric('memoryUsage', memoryInfo.usage);
            
            // メモリ使用率が高い場合の警告
            if (memoryInfo.usage > 90) {
                this.performMemoryCleanup();
            }
        }, 5000); // 5秒ごとに監視
    }
    
    /**
     * メモリクリーンアップ
     */
    performMemoryCleanup() {
        // キャッシュの半分をクリア
        const entriesToRemove = Math.floor(this.cache.size / 2);
        const keys = Array.from(this.cache.keys());
        
        for (let i = 0; i < entriesToRemove; i++) {
            this.cache.delete(keys[i]);
            this.cacheTimestamps.delete(keys[i]);
        }
        
        // メトリクスデータの古いエントリを削除
        Object.keys(this.metrics).forEach(key => {
            if (this.metrics[key].length > 100) {
                this.metrics[key] = this.metrics[key].slice(-50);
            }
        });
        
        // ガベージコレクションのヒント（実際の実行は保証されない）
        if (typeof global !== 'undefined' && global.gc) {
            global.gc();
        }
    }
    
    /**
     * フレームレート測定
     */
    measureFrameRate() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;
        
        const measure = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round(frames * 1000 / (currentTime - lastTime));
                this.recordMetric('frameRate', fps);
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measure);
        };
        
        requestAnimationFrame(measure);
    }
    
    /**
     * メトリクス記録
     */
    recordMetric(type, value) {
        if (!this.metrics[type]) {
            this.metrics[type] = [];
        }
        
        this.metrics[type].push({
            value,
            timestamp: Date.now()
        });
        
        // 最大100エントリまで
        if (this.metrics[type].length > 100) {
            this.metrics[type].shift();
        }
    }
    
    /**
     * パフォーマンスレポート生成
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            averages: {},
            current: {},
            recommendations: []
        };
        
        // 平均値計算
        Object.keys(this.metrics).forEach(key => {
            const values = this.metrics[key].map(m => 
                typeof m.value === 'number' ? m.value : m.value.usage || 0
            );
            
            if (values.length > 0) {
                report.averages[key] = values.reduce((a, b) => a + b, 0) / values.length;
                report.current[key] = values[values.length - 1];
            }
        });
        
        // 推奨事項
        if (report.averages.renderTime > 16) {
            report.recommendations.push('レンダリング時間が16msを超えています。最適化を検討してください。');
        }
        
        if (report.current.memoryUsage > 80) {
            report.recommendations.push('メモリ使用率が高くなっています。不要なデータをクリアしてください。');
        }
        
        if (report.averages.frameRate < 30) {
            report.recommendations.push('フレームレートが低下しています。アニメーションを簡略化してください。');
        }
        
        return report;
    }
    
    /**
     * 最適化設定の動的調整
     */
    adjustOptimizationSettings(performance) {
        // パフォーマンスが低い場合
        if (performance === 'low') {
            this.config.enableCache = true;
            this.config.cacheMaxSize = 100;
            this.config.debounceDelay = 300;
            this.config.throttleDelay = 200;
            this.config.batchRenderSize = 5;
        }
        // パフォーマンスが高い場合
        else if (performance === 'high') {
            this.config.enableCache = false;
            this.config.debounceDelay = 50;
            this.config.throttleDelay = 50;
            this.config.batchRenderSize = 20;
        }
    }
    
    /**
     * クリーンアップ
     */
    cleanup() {
        // タイマーのクリア
        for (const timer of this.debounceTimers.values()) {
            clearTimeout(timer);
        }
        this.debounceTimers.clear();
        
        // Workerの終了
        if (this.worker) {
            this.worker.terminate();
        }
        
        // キャッシュのクリア
        this.cache.clear();
        this.cacheTimestamps.clear();
        
        // メトリクスのクリア
        this.metrics = {
            renderTime: [],
            calculationTime: [],
            memoryUsage: [],
            frameRate: []
        };
    }
}

// シングルトンインスタンス
const performanceOptimizer = new PerformanceOptimizer();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceOptimizer, performanceOptimizer };
}