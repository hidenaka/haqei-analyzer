// LazyLoadingStrategy.js - 遅延読み込み戦略
// HaQei Analyzer - Lazy Loading Strategy System

class LazyLoadingStrategy {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px',
            threshold: 0.1,
            enableImageLazyLoad: true,
            enableComponentLazyLoad: true,
            enableDataLazyLoad: true,
            chunkSize: 5,
            loadingTimeout: 5000,
            retryAttempts: 3,
            preloadCritical: true,
            ...options
        };
        
        this.loadedComponents = new Set();
        this.loadingComponents = new Map();
        this.intersectionObserver = null;
        this.imageObserver = null;
        this.loadingQueue = [];
        this.retryCount = new Map();
        
        this.initializeObservers();
    }

    /**
     * Intersection Observerを初期化
     */
    initializeObservers() {
        // コンポーネント用オブザーバー
        if (this.options.enableComponentLazyLoad && 'IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        }

        // 画像用オブザーバー
        if (this.options.enableImageLazyLoad && 'IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(
                this.handleImageIntersection.bind(this),
                {
                    rootMargin: this.options.rootMargin,
                    threshold: 0.01
                }
            );
        }
    }

    /**
     * コンポーネントの遅延読み込みを設定
     * @param {HTMLElement} element - 対象要素
     * @param {string} componentName - コンポーネント名
     * @param {Object} loadOptions - 読み込みオプション
     */
    observeComponent(element, componentName, loadOptions = {}) {
        if (!this.intersectionObserver) {
            // フォールバック: 即座に読み込み
            this.loadComponent(element, componentName, loadOptions);
            return;
        }

        // データ属性を設定
        element.setAttribute('data-lazy-component', componentName);
        element.setAttribute('data-lazy-options', JSON.stringify(loadOptions));
        
        // 読み込み中インジケーターを表示
        this.showLoadingIndicator(element, componentName);
        
        // 監視開始
        this.intersectionObserver.observe(element);
        
        console.log(`👁️ Observing component: ${componentName}`);
    }

    /**
     * 画像の遅延読み込みを設定
     * @param {HTMLImageElement} imgElement - 画像要素
     * @param {string} src - 画像URL
     * @param {string} placeholder - プレースホルダー画像URL
     */
    observeImage(imgElement, src, placeholder = null) {
        if (!this.imageObserver) {
            // フォールバック: 即座に読み込み
            imgElement.src = src;
            return;
        }

        // データ属性を設定
        imgElement.setAttribute('data-lazy-src', src);
        
        // プレースホルダーを設定
        if (placeholder) {
            imgElement.src = placeholder;
        } else {
            imgElement.src = this.generatePlaceholder(imgElement.width, imgElement.height);
        }
        
        // 監視開始
        this.imageObserver.observe(imgElement);
    }

    /**
     * Phase別の段階的読み込み
     * @param {Array} phases - フェーズ配列
     * @param {Function} onPhaseComplete - フェーズ完了コールバック
     */
    async loadPhases(phases, onPhaseComplete = null) {
        console.log(`🚀 Starting phased loading: ${phases.length} phases`);
        
        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i];
            
            try {
                console.log(`📦 Loading phase ${i + 1}: ${phase.name}`);
                
                // Phase読み込み開始時間を記録
                const startTime = performance.now();
                
                // 重要度に応じて並列/順次読み込み
                if (phase.parallel) {
                    await this.loadPhaseParallel(phase);
                } else {
                    await this.loadPhaseSequential(phase);
                }
                
                const endTime = performance.now();
                console.log(`✅ Phase ${i + 1} completed in ${Math.round(endTime - startTime)}ms`);
                
                // コールバック実行
                if (onPhaseComplete) {
                    onPhaseComplete(i + 1, phase, endTime - startTime);
                }
                
                // 次のフェーズまでの待機時間
                if (phase.delay && i < phases.length - 1) {
                    await this.delay(phase.delay);
                }
                
            } catch (error) {
                console.error(`❌ Phase ${i + 1} failed:`, error);
                
                // 重要なフェーズの場合は停止
                if (phase.critical) {
                    throw error;
                }
            }
        }
        
        console.log('🎉 All phases completed');
    }

    /**
     * 並列でPhaseを読み込み
     */
    async loadPhaseParallel(phase) {
        const promises = phase.components.map(componentConfig => 
            this.loadComponentByConfig(componentConfig)
        );
        
        await Promise.allSettled(promises);
    }

    /**
     * 順次でPhaseを読み込み
     */
    async loadPhaseSequential(phase) {
        for (const componentConfig of phase.components) {
            await this.loadComponentByConfig(componentConfig);
            
            // 順次読み込み間の待機時間
            if (componentConfig.delay) {
                await this.delay(componentConfig.delay);
            }
        }
    }

    /**
     * 設定に基づいてコンポーネントを読み込み
     */
    async loadComponentByConfig(config) {
        const { name, module, element, data, priority = 'normal' } = config;
        
        // 既に読み込み済みかチェック
        if (this.loadedComponents.has(name)) {
            return;
        }
        
        // 読み込み中かチェック
        if (this.loadingComponents.has(name)) {
            return this.loadingComponents.get(name);
        }
        
        // 読み込み開始
        const loadPromise = this.performComponentLoad(config);
        this.loadingComponents.set(name, loadPromise);
        
        try {
            await loadPromise;
            this.loadedComponents.add(name);
            this.loadingComponents.delete(name);
            
        } catch (error) {
            this.loadingComponents.delete(name);
            throw error;
        }
    }

    /**
     * 実際のコンポーネント読み込み処理
     */
    async performComponentLoad(config) {
        const { name, module, element, data, initFunction } = config;
        
        try {
            // モジュールの動的インポート
            let ComponentClass = null;
            if (module) {
                const moduleObj = await import(module);
                ComponentClass = moduleObj.default || moduleObj[name];
            }
            
            // データの読み込み
            let componentData = null;
            if (data) {
                componentData = await this.loadData(data);
            }
            
            // コンポーネントの初期化
            if (ComponentClass && element) {
                const instance = new ComponentClass(element, {
                    data: componentData,
                    lazyLoaded: true
                });
                
                if (initFunction) {
                    await initFunction(instance, componentData);
                }
            }
            
            console.log(`✅ Component loaded: ${name}`);
            
        } catch (error) {
            console.error(`❌ Failed to load component ${name}:`, error);
            throw error;
        }
    }

    /**
     * データの遅延読み込み
     */
    async loadData(dataConfig) {
        const { url, type = 'json', cache = true, transform } = dataConfig;
        
        // キャッシュからチェック
        if (cache && this.dataCache.has(url)) {
            return this.dataCache.get(url);
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            let data;
            switch (type) {
                case 'json':
                    data = await response.json();
                    break;
                case 'text':
                    data = await response.text();
                    break;
                case 'blob':
                    data = await response.blob();
                    break;
                default:
                    data = await response.text();
            }
            
            // データ変換
            if (transform && typeof transform === 'function') {
                data = transform(data);
            }
            
            // キャッシュに保存
            if (cache) {
                this.dataCache.set(url, data);
            }
            
            return data;
            
        } catch (error) {
            console.error(`❌ Failed to load data from ${url}:`, error);
            throw error;
        }
    }

    /**
     * 重要なリソースを事前読み込み
     */
    async preloadCritical(resources) {
        if (!this.options.preloadCritical) return;
        
        console.log('🔥 Preloading critical resources');
        
        const preloadPromises = resources.map(async (resource) => {
            try {
                if (resource.type === 'module') {
                    await import(resource.url);
                } else if (resource.type === 'data') {
                    await this.loadData(resource);
                } else if (resource.type === 'image') {
                    await this.preloadImage(resource.url);
                }
                
                console.log(`✅ Preloaded: ${resource.url}`);
                
            } catch (error) {
                console.warn(`⚠️ Failed to preload ${resource.url}:`, error);
            }
        });
        
        await Promise.allSettled(preloadPromises);
    }

    /**
     * 画像を事前読み込み
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * プリロードヒントを追加
     */
    addPreloadHints(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            
            if (resource.type === 'module') {
                link.rel = 'modulepreload';
                link.href = resource.url;
            } else if (resource.type === 'data') {
                link.rel = 'prefetch';
                link.href = resource.url;
            } else if (resource.type === 'image') {
                link.rel = 'preload';
                link.as = 'image';
                link.href = resource.url;
            }
            
            if (resource.priority) {
                link.setAttribute('importance', resource.priority);
            }
            
            document.head.appendChild(link);
        });
    }

    /**
     * 要素が表示領域に入った時の処理
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const componentName = element.getAttribute('data-lazy-component');
                const loadOptions = JSON.parse(element.getAttribute('data-lazy-options') || '{}');
                
                // 監視を停止
                this.intersectionObserver.unobserve(element);
                
                // コンポーネントを読み込み
                this.loadComponent(element, componentName, loadOptions);
            }
        });
    }

    /**
     * 画像が表示領域に入った時の処理
     */
    handleImageIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imgElement = entry.target;
                const src = imgElement.getAttribute('data-lazy-src');
                
                // 監視を停止
                this.imageObserver.unobserve(imgElement);
                
                // 画像を読み込み
                this.loadImage(imgElement, src);
            }
        });
    }

    /**
     * コンポーネントを読み込み
     */
    async loadComponent(element, componentName, loadOptions) {
        try {
            // ローディングインジケーターを表示
            this.showLoadingIndicator(element, componentName);
            
            // タイムアウト設定
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Loading timeout')), this.options.loadingTimeout);
            });
            
            // 実際の読み込み処理
            const loadPromise = this.performComponentLoad({
                name: componentName,
                element: element,
                ...loadOptions
            });
            
            // レース実行
            await Promise.race([loadPromise, timeoutPromise]);
            
            // 成功時の処理
            this.hideLoadingIndicator(element);
            element.setAttribute('data-lazy-loaded', 'true');
            
        } catch (error) {
            console.error(`❌ Failed to load component ${componentName}:`, error);
            
            // リトライ処理
            const retryCount = this.retryCount.get(componentName) || 0;
            if (retryCount < this.options.retryAttempts) {
                this.retryCount.set(componentName, retryCount + 1);
                
                console.log(`🔄 Retrying component ${componentName} (${retryCount + 1}/${this.options.retryAttempts})`);
                
                // 指数バックオフでリトライ
                await this.delay(Math.pow(2, retryCount) * 1000);
                return this.loadComponent(element, componentName, loadOptions);
            }
            
            // エラー表示
            this.showErrorIndicator(element, componentName, error);
        }
    }

    /**
     * 画像を読み込み
     */
    async loadImage(imgElement, src) {
        try {
            // 新しい画像オブジェクトで読み込み
            const newImg = new Image();
            
            await new Promise((resolve, reject) => {
                newImg.onload = resolve;
                newImg.onerror = reject;
                newImg.src = src;
            });
            
            // フェードイン効果
            imgElement.style.transition = 'opacity 0.3s ease';
            imgElement.style.opacity = '0';
            
            imgElement.src = src;
            imgElement.removeAttribute('data-lazy-src');
            
            // フェードイン完了
            setTimeout(() => {
                imgElement.style.opacity = '1';
            }, 10);
            
        } catch (error) {
            console.error('❌ Failed to load image:', error);
            
            // エラー画像を表示
            imgElement.src = this.generateErrorPlaceholder(imgElement.width, imgElement.height);
        }
    }

    /**
     * ローディングインジケーターを表示
     */
    showLoadingIndicator(element, componentName) {
        const indicator = document.createElement('div');
        indicator.className = 'lazy-loading-indicator';
        indicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading ${componentName}...</div>
        `;
        
        element.appendChild(indicator);
    }

    /**
     * ローディングインジケーターを非表示
     */
    hideLoadingIndicator(element) {
        const indicator = element.querySelector('.lazy-loading-indicator');
        if (indicator) {
            indicator.style.transition = 'opacity 0.3s ease';
            indicator.style.opacity = '0';
            
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    /**
     * エラーインジケーターを表示
     */
    showErrorIndicator(element, componentName, error) {
        this.hideLoadingIndicator(element);
        
        const errorIndicator = document.createElement('div');
        errorIndicator.className = 'lazy-error-indicator';
        errorIndicator.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div class="error-text">Failed to load ${componentName}</div>
            <div class="error-details">${error.message}</div>
            <button class="retry-button">Retry</button>
        `;
        
        // リトライボタンのイベントリスナー
        errorIndicator.querySelector('.retry-button').addEventListener('click', () => {
            element.removeChild(errorIndicator);
            this.loadComponent(element, componentName, {});
        });
        
        element.appendChild(errorIndicator);
    }

    /**
     * プレースホルダー画像を生成
     */
    generatePlaceholder(width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width || 300;
        canvas.height = height || 200;
        
        // グラデーション背景
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 読み込み中テキスト
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);
        
        return canvas.toDataURL();
    }

    /**
     * エラープレースホルダー画像を生成
     */
    generateErrorPlaceholder(width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width || 300;
        canvas.height = height || 200;
        
        // エラー背景
        ctx.fillStyle = '#ffebee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // エラーアイコン
        ctx.fillStyle = '#f44336';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠️', canvas.width / 2, canvas.height / 2 - 10);
        
        // エラーテキスト
        ctx.font = '14px Arial';
        ctx.fillText('Failed to load', canvas.width / 2, canvas.height / 2 + 20);
        
        return canvas.toDataURL();
    }

    /**
     * 遅延処理
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * キューに基づく優先読み込み
     */
    async processLoadingQueue() {
        while (this.loadingQueue.length > 0) {
            const batch = this.loadingQueue.splice(0, this.options.chunkSize);
            
            // 優先度でソート
            batch.sort((a, b) => {
                const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            
            // バッチ処理
            const promises = batch.map(item => this.loadComponentByConfig(item));
            await Promise.allSettled(promises);
            
            // 次のバッチまでの待機
            if (this.loadingQueue.length > 0) {
                await this.delay(100);
            }
        }
    }

    /**
     * パフォーマンス統計を取得
     */
    getPerformanceStats() {
        return {
            loadedComponents: this.loadedComponents.size,
            loadingComponents: this.loadingComponents.size,
            queueLength: this.loadingQueue.length,
            retryCount: Array.from(this.retryCount.values()).reduce((sum, count) => sum + count, 0),
            cacheSize: this.dataCache ? this.dataCache.size : 0
        };
    }

    /**
     * 全てのオブザーバーを停止
     */
    disconnectObservers() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }

    /**
     * システム破棄
     */
    destroy() {
        this.disconnectObservers();
        this.loadingComponents.clear();
        this.loadedComponents.clear();
        this.loadingQueue = [];
        this.retryCount.clear();
        
        if (this.dataCache) {
            this.dataCache.clear();
        }
        
        console.log("⚡ LazyLoadingStrategy destroyed");
    }
}

// データキャッシュ用のMapを初期化
LazyLoadingStrategy.prototype.dataCache = new Map();

export default LazyLoadingStrategy;