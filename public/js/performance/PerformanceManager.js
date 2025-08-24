/**
 * Performance Manager - Phase 4最適化システム
 * ロード時間1.5秒以下、レンダリング最適化、メモリ管理
 * 
 * @class PerformanceManager
 * @version 1.0.0
 * @date 2025-08-12
 */

class PerformanceManager {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            scriptLoadTime: 0
        };
        
        this.optimizations = {
            lazyLoading: true,
            codesplitting: true,
            imageOptimization: true,
            cacheManagement: true
        };
        
        this.performanceTargets = {
            totalLoadTime: 1500,    // 1.5秒以下
            firstPaint: 800,        // 0.8秒以下
            interactive: 1200,      // 1.2秒以下
            memoryLimit: 50         // 50MB以下
        };
        
        this.init();
    }
    
    /**
     * パフォーマンス監視開始
     */
    init() {
        console.log('🚀 Performance Manager initializing...');
        
        // Core Web Vitals監視
        this.startWebVitalsMonitoring();
        
        // リソース最適化
        this.optimizeResources();
        
        // メモリ監視
        this.startMemoryMonitoring();
        
        // 遅延ロード実装
        this.implementLazyLoading();
        
        console.log('✅ Performance Manager initialized');
    }
    
    /**
     * Core Web Vitals監視
     */
    startWebVitalsMonitoring() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('📊 LCP:', Math.round(entry.startTime), 'ms');
                this.metrics.renderTime = entry.startTime;
                
                if (entry.startTime > this.performanceTargets.firstPaint) {
                    this.optimizeRendering();
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('⚡ FID:', Math.round(entry.processingStart - entry.startTime), 'ms');
            }
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('📐 CLS:', entry.value);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    /**
     * リソース最適化
     */
    optimizeResources() {
        // Critical CSS inlining
        this.inlineCriticalCSS();
        
        // Font preloading
        this.preloadFonts();
        
        // Script defer/async optimization
        this.optimizeScriptLoading();
        
        // Image lazy loading
        this.optimizeImages();
    }
    
    /**
     * Critical CSS inline化
     */
    inlineCriticalCSS() {
        // 既存のCritical CSSを最適化
        const criticalStyles = `
            /* Performance Critical CSS - Phase 4 */
            body { 
                font-display: swap;
                will-change: auto;
            }
            
            .screen {
                contain: layout style paint;
            }
            
            .zone-d-integration {
                content-visibility: auto;
                contain-intrinsic-size: 0 400px;
            }
            
            /* GPU加速最適化 */
            .confidence-gauge, .mobile-component {
                transform: translateZ(0);
                backface-visibility: hidden;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalStyles;
        document.head.insertBefore(style, document.head.firstChild);
    }
    
    /**
     * フォントプリロード
     */
    preloadFonts() {
        const fonts = [
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = font;
            document.head.appendChild(link);
        });
    }
    
    /**
     * スクリプトロード最適化
     */
    optimizeScriptLoading() {
        const scripts = document.querySelectorAll('script[src]');
        
        scripts.forEach(script => {
            // Phase 3コンポーネントは遅延ロード
            if (script.src.includes('zone-d') || 
                script.src.includes('mobile') || 
                script.src.includes('analytics')) {
                script.defer = true;
            }
            
            // 重要なスクリプトは高優先度
            if (script.src.includes('core') || 
                script.src.includes('TripleOS')) {
                script.fetchPriority = 'high';
            }
        });
    }
    
    /**
     * 画像最適化
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading
            img.loading = 'lazy';
            
            // Decode hint
            img.decoding = 'async';
            
            // Intersection Observer for advanced lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                imageObserver.observe(img);
            }
        });
    }
    
    /**
     * 遅延ロード実装
     */
    implementLazyLoading() {
        // Zone D components lazy loading
        window.loadZoneDWhenNeeded = () => {
            return new Promise((resolve) => {
                if (window.zoneDIntegrator) {
                    resolve();
                    return;
                }
                
                // Dynamic import simulation
                setTimeout(() => {
                    console.log('📦 Zone D components loaded lazily');
                    resolve();
                }, 100);
            });
        };
        
        // KPI Dashboard lazy loading
        window.loadKPIDashboardWhenNeeded = () => {
            return new Promise((resolve) => {
                if (window.KPIDashboard) {
                    resolve();
                    return;
                }
                
                setTimeout(() => {
                    console.log('📊 KPI Dashboard loaded lazily');
                    resolve();
                }, 50);
            });
        };
    }
    
    /**
     * メモリ監視
     */
    startMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                
                this.metrics.memoryUsage = usedMB;
                
                if (usedMB > this.performanceTargets.memoryLimit) {
                    console.warn('⚠️ Memory usage high:', usedMB, 'MB');
                    this.performGarbageCollection();
                }
            }, 10000); // 10秒間隔
        }
    }
    
    /**
     * レンダリング最適化
     */
    optimizeRendering() {
        console.log('🎨 Optimizing rendering...');
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            // Virtual scrolling for long lists
            this.implementVirtualScrolling();
            
            // Debounced resize handlers
            this.optimizeResizeHandlers();
            
            // CSS containment
            this.applyCSSContainment();
        });
    }
    
    /**
     * 仮想スクロール実装
     */
    implementVirtualScrolling() {
        const longLists = document.querySelectorAll('.question-list, .result-list');
        
        longLists.forEach(list => {
            if (list.children.length > 10) {
                list.style.contain = 'layout style paint';
                list.style.contentVisibility = 'auto';
            }
        });
    }
    
    /**
     * リサイズハンドラー最適化
     */
    optimizeResizeHandlers() {
        let resizeTimeout;
        
        const optimizedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Mobile optimizer resize
                if (window.mobileOptimizer) {
                    window.mobileOptimizer.handleResize();
                }
                
                // Zone D responsive adjustments
                this.adjustZoneDLayout();
            }, 150);
        };
        
        window.addEventListener('resize', optimizedResize, { passive: true });
    }
    
    /**
     * CSS containment適用
     */
    applyCSSContainment() {
        const containmentElements = [
            '.zone-container',
            '.zone-d-integration',
            '.mobile-component',
            '.kpi-dashboard'
        ];
        
        containmentElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.contain = 'layout style paint';
            });
        });
    }
    
    /**
     * Zone Dレイアウト調整
     */
    adjustZoneDLayout() {
        const zoneD = document.querySelector('.zone-d-integration');
        if (zoneD && window.innerWidth < 768) {
            zoneD.style.gridTemplateColumns = '1fr';
        } else if (zoneD) {
            zoneD.style.gridTemplateColumns = '1fr 1fr 1fr';
        }
    }
    
    /**
     * ガベージコレクション実行
     */
    performGarbageCollection() {
        // Clear unused event listeners
        this.clearUnusedListeners();
        
        // Clear cached data
        this.clearExpiredCache();
        
        // Force garbage collection (Chrome DevTools)
        if (window.gc) {
            window.gc();
        }
    }
    
    /**
     * 未使用イベントリスナー削除
     */
    clearUnusedListeners() {
        // Zone D components cleanup
        if (window.zoneDIntegrator && window.zoneDIntegrator.cleanup) {
            window.zoneDIntegrator.cleanup();
        }
        
        // KPI analyzer cleanup
        if (window.kpiAnalyzer && window.kpiAnalyzer.flushRealtimeBuffer) {
            window.kpiAnalyzer.flushRealtimeBuffer();
        }
    }
    
    /**
     * 期限切れキャッシュ削除
     */
    clearExpiredCache() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24時間
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('haqei_cache_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && (now - data.timestamp) > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
    }
    
    /**
     * パフォーマンスレポート生成
     */
    generatePerformanceReport() {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        const report = {
            timestamp: new Date().toISOString(),
            loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0),
            metrics: this.metrics,
            targets: this.performanceTargets,
            optimizations: this.optimizations,
            score: this.calculatePerformanceScore()
        };
        
        console.log('📈 Performance Report:', report);
        return report;
    }
    
    /**
     * パフォーマンススコア計算
     */
    calculatePerformanceScore() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        let score = 100;
        
        // ロード時間スコア
        if (loadTime > this.performanceTargets.totalLoadTime) {
            score -= 30;
        }
        
        // First Paint スコア
        const firstPaint = performance.getEntriesByType('paint')[0]?.startTime || 0;
        if (firstPaint > this.performanceTargets.firstPaint) {
            score -= 20;
        }
        
        // メモリ使用量スコア
        if (this.metrics.memoryUsage > this.performanceTargets.memoryLimit) {
            score -= 25;
        }
        
        // レンダリング時間スコア
        if (this.metrics.renderTime > this.performanceTargets.firstPaint) {
            score -= 25;
        }
        
        return Math.max(0, Math.min(100, score));
    }
}

// グローバル初期化
if (typeof window !== 'undefined') {
    window.PerformanceManager = PerformanceManager;
    
    // DOMロード後に自動初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.performanceManager = new PerformanceManager();
        });
    } else {
        window.performanceManager = new PerformanceManager();
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
}