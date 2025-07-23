# パフォーマンス最適化のベストプラクティス

## 📋 概要

HaQei Analyzerのパフォーマンス最適化に関するベストプラクティスと実装ガイドを提供します。

## 🚀 読み込み最適化

### 1. スクリプト読み込み戦略

#### 現在の実装
```html
<!-- 同期読み込み（依存関係重視） -->
<script src="js/core/DataManager.js"></script>
<script src="js/core/Calculator.js"></script>
```

#### 最適化のポイント
- **依存関係の維持**: 非同期化は依存関係を壊すため慎重に
- **Critical Path**: 初期表示に必要最小限のスクリプトを優先
- **Non-blocking**: UI描画をブロックしない順序

#### 推奨パターン
```html
<!-- 1. 必須データ（即座に必要） -->
<script src="../js/data/data_box.js"></script>

<!-- 2. 基底クラス（即座に必要） -->
<script src="js/core/BaseComponent.js"></script>

<!-- 3. 初期画面コンポーネント（優先） -->
<script src="js/components/WelcomeScreen.js"></script>

<!-- 4. 遅延読み込み可能なコンポーネント -->
<script src="js/components/ResultsView.js" defer></script>
```

### 2. データファイル最適化

#### サイズ削減
```javascript
// ❌ 冗長なデータ構造
const hexagramData = {
    hexagram_id: 1,
    name_japanese: "乾為天",
    name_reading: "けんいてん",
    full_description: "非常に長い説明文...",
    detailed_interpretation: "詳細な解釈..."
};

// ✅ 最適化されたデータ構造
const hexagramData = {
    id: 1,
    name: "乾為天",
    read: "けんいてん",
    desc: "簡潔な説明",
    // 詳細データは別ファイルまたは遅延読み込み
};
```

#### JSON最適化
```bash
# 本番環境でのJSONファイル最小化
npx json-minify data_box.js > data_box.min.js
```

### 3. CDNとキャッシュ戦略

#### CDN使用
```html
<!-- パフォーマンス重視 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" 
        integrity="sha512-..." 
        crossorigin="anonymous"></script>
```

#### キャッシュ戦略
```html
<!-- バージョン管理によるキャッシュ制御 -->
<script src="js/core/DataManager.js?v=1.0.0"></script>

<!-- Service Worker による高度なキャッシュ -->
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
</script>
```

## 💾 メモリ管理

### 1. メモリリーク防止

#### イベントリスナーのクリーンアップ
```javascript
// ❌ メモリリークの原因
class Component {
    constructor() {
        document.addEventListener('click', this.handleClick);
    }
    
    handleClick() {
        // イベント処理
    }
}

// ✅ 適切なクリーンアップ
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        document.addEventListener('click', this.handleClick);
    }
    
    destroy() {
        document.removeEventListener('click', this.handleClick);
    }
    
    handleClick() {
        // イベント処理
    }
}
```

#### DOM参照のクリア
```javascript
// ❌ DOM参照が残存
class UIComponent {
    constructor() {
        this.elements = document.querySelectorAll('.component');
    }
}

// ✅ 適切な参照管理
class UIComponent {
    constructor() {
        this.elements = null;
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll('.component');
    }
    
    destroy() {
        this.elements = null; // 明示的にクリア
    }
}
```

### 2. 大量データの効率的な処理

#### 仮想化（Virtual Scrolling）
```javascript
class VirtualList {
    constructor(container, items, itemHeight = 50, visibleCount = 10) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.visibleCount = visibleCount;
        this.scrollTop = 0;
        
        this.render();
    }
    
    render() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const endIndex = Math.min(
            startIndex + this.visibleCount,
            this.items.length
        );
        
        // 可視範囲のアイテムのみレンダリング
        const visibleItems = this.items.slice(startIndex, endIndex);
        this.updateDOM(visibleItems, startIndex);
    }
}
```

#### チャンク処理
```javascript
// ❌ 大量データの一括処理
function processAllData(data) {
    return data.map(item => expensiveOperation(item));
}

// ✅ チャンク単位での処理
async function processDataInChunks(data, chunkSize = 1000) {
    const results = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const chunkResults = chunk.map(item => expensiveOperation(item));
        results.push(...chunkResults);
        
        // 次のチャンクまで少し待機（UIをブロックしない）
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return results;
}
```

## ⚡ 計算処理最適化

### 1. 計算結果のキャッシュ

#### Memoization実装
```javascript
class Calculator {
    constructor() {
        this.cache = new Map();
    }
    
    // ❌ 毎回計算
    calculateCompatibility(hexagram1, hexagram2) {
        return this.performExpensiveCalculation(hexagram1, hexagram2);
    }
    
    // ✅ キャッシュ使用
    calculateCompatibilityMemo(hexagram1, hexagram2) {
        const key = `${hexagram1}-${hexagram2}`;
        
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        const result = this.performExpensiveCalculation(hexagram1, hexagram2);
        this.cache.set(key, result);
        
        return result;
    }
    
    // キャッシュサイズ制限
    addToCache(key, value, maxSize = 1000) {
        if (this.cache.size >= maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}
```

### 2. 非同期処理の活用

#### Web Workers使用
```javascript
// main.js
class HeavyCalculationManager {
    constructor() {
        this.worker = new Worker('js/workers/calculation-worker.js');
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
    }
    
    async performHeavyCalculation(data) {
        return new Promise((resolve, reject) => {
            const id = Date.now();
            this.pendingCalculations = this.pendingCalculations || {};
            this.pendingCalculations[id] = { resolve, reject };
            
            this.worker.postMessage({
                id,
                type: 'heavy_calculation',
                data
            });
        });
    }
    
    handleWorkerMessage(event) {
        const { id, result, error } = event.data;
        const pending = this.pendingCalculations[id];
        
        if (pending) {
            if (error) {
                pending.reject(new Error(error));
            } else {
                pending.resolve(result);
            }
            delete this.pendingCalculations[id];
        }
    }
}

// js/workers/calculation-worker.js
self.onmessage = function(event) {
    const { id, type, data } = event.data;
    
    try {
        let result;
        switch (type) {
            case 'heavy_calculation':
                result = performHeavyCalculation(data);
                break;
        }
        
        self.postMessage({ id, result });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};
```

## 🎨 UI/UX最適化

### 1. 描画パフォーマンス

#### requestAnimationFrame使用
```javascript
// ❌ 直接DOM操作
function animateProgress(element, targetValue) {
    element.style.width = targetValue + '%';
}

// ✅ requestAnimationFrame使用
function animateProgress(element, targetValue, duration = 1000) {
    const startValue = parseFloat(element.style.width) || 0;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (targetValue - startValue) * progress;
        element.style.width = currentValue + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}
```

#### CSS Transform使用
```css
/* ❌ layout/paintをトリガー */
.element {
    transition: left 0.3s ease;
}

/* ✅ compositeのみ */
.element {
    transition: transform 0.3s ease;
}
.element.moved {
    transform: translateX(100px);
}
```

### 2. 遅延読み込み（Lazy Loading）

#### 画像の遅延読み込み
```javascript
class LazyImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this));
        
        this.images.forEach(img => this.observer.observe(img));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                this.observer.unobserve(img);
            }
        });
    }
}
```

#### コンポーネントの動的読み込み
```javascript
class ComponentLoader {
    async loadComponent(componentName) {
        const moduleMap = {
            'AdvancedAnalysis': () => import('./components/AdvancedAnalysis.js'),
            'DetailedReport': () => import('./components/DetailedReport.js')
        };
        
        if (moduleMap[componentName]) {
            const module = await moduleMap[componentName]();
            return module.default;
        }
        
        throw new Error(`Component ${componentName} not found`);
    }
}
```

## 📊 パフォーマンス監視

### 1. 実装済み監視機能

#### PerformanceMonitorの活用
```javascript
// analyzer.htmlに実装済み
const monitor = new PerformanceMonitor({
    enableScriptTiming: true,
    enableMemoryMonitoring: true,
    enableDetailedLogging: true
});

// フェーズ監視
monitor.startInitializationPhase('data_loading');
// ... データ読み込み処理
monitor.endInitializationPhase('data_loading', success);

// メモリスナップショット
monitor.takeMemorySnapshot('after_data_load');

// 最終レポート
const report = monitor.finalize();
```

### 2. カスタム監視メトリクス

#### Core Web Vitals測定
```javascript
class WebVitalsMonitor {
    constructor() {
        this.metrics = {};
        this.measureCLS();
        this.measureFID();
        this.measureLCP();
    }
    
    measureCLS() {
        let clsValue = 0;
        let clsEntries = [];
        
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }
            this.metrics.cls = clsValue;
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }
    
    measureFID() {
        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                this.metrics.fid = entry.processingStart - entry.startTime;
            }
        });
        
        observer.observe({ entryTypes: ['first-input'] });
    }
    
    measureLCP() {
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}
```

### 3. リアルタイム監視

#### パフォーマンスダッシュボード
```javascript
class PerformanceDashboard {
    constructor(container) {
        this.container = container;
        this.metrics = {};
        this.updateInterval = 1000;
        this.init();
    }
    
    init() {
        this.createUI();
        this.startMonitoring();
    }
    
    createUI() {
        this.container.innerHTML = `
            <div class="perf-dashboard">
                <div class="metric">
                    <label>Memory Usage</label>
                    <span id="memory-usage">-</span>
                </div>
                <div class="metric">
                    <label>Script Load Time</label>
                    <span id="script-time">-</span>
                </div>
                <div class="metric">
                    <label>DOM Ready Time</label>
                    <span id="dom-time">-</span>
                </div>
            </div>
        `;
    }
    
    startMonitoring() {
        setInterval(() => {
            this.updateMetrics();
        }, this.updateInterval);
    }
    
    updateMetrics() {
        // メモリ使用量
        if (performance.memory) {
            const memoryMB = Math.round(
                performance.memory.usedJSHeapSize / 1024 / 1024
            );
            document.getElementById('memory-usage').textContent = `${memoryMB}MB`;
        }
        
        // スクリプト読み込み時間
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            const loadTime = Math.round(navEntries[0].loadEventEnd - navEntries[0].fetchStart);
            document.getElementById('script-time').textContent = `${loadTime}ms`;
        }
        
        // DOM準備時間
        const domTime = Math.round(navEntries[0].domContentLoadedEventEnd - navEntries[0].fetchStart);
        document.getElementById('dom-time').textContent = `${domTime}ms`;
    }
}
```

## 🔧 実装チェックリスト

### フロントエンド最適化
- [ ] スクリプト読み込み順序の最適化
- [ ] 不要なスクリプトの削除
- [ ] CDN使用によるロード時間短縮
- [ ] 画像最適化とLazy Loading
- [ ] CSS/JSファイルの最小化

### メモリ最適化
- [ ] イベントリスナーのクリーンアップ
- [ ] DOM参照の適切な管理
- [ ] 大量データの仮想化
- [ ] キャッシュサイズの制限
- [ ] 定期的なガベージコレクション

### 計算処理最適化
- [ ] 計算結果のキャッシュ
- [ ] Web Workersの活用
- [ ] 非同期処理の実装
- [ ] アルゴリズムの改善

### 監視・測定
- [ ] PerformanceMonitorの実装
- [ ] Core Web Vitalsの測定
- [ ] リアルタイム監視の設定
- [ ] パフォーマンスレポートの分析

## 📈 パフォーマンス目標

### 読み込み時間
- **First Contentful Paint**: < 1.5秒
- **Largest Contentful Paint**: < 2.5秒
- **Total Load Time**: < 3秒

### メモリ使用量
- **初期メモリ**: < 50MB
- **ピーク時メモリ**: < 100MB
- **メモリ増加率**: < 1MB/分

### 応答性
- **First Input Delay**: < 100ms
- **インタラクション応答**: < 200ms
- **画面遷移**: < 500ms

## 🔍 測定ツール

### ブラウザ内蔵
- Chrome DevTools Performance tab
- Lighthouse
- Performance API

### 統合テスト
- `test-integration-complete-startup.html`
- `test-performance-monitoring.html`
- `test-browser-compatibility.html`

### 外部ツール
- WebPageTest
- GTmetrix  
- PageSpeed Insights

---

**最終更新**: 2025年1月  
**対象バージョン**: analyzer.html v1.0.0