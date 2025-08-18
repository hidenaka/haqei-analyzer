# HAQEI Analyzer 緊急最適化設計書

## 1. システムアーキテクチャ設計

### 1.1 現行アーキテクチャ
```
[Browser] 
    ↓ 初期ロード26MB
[os_analyzer.html]
    ├── 50+ JavaScript files (同期ロード)
    ├── 7 CSS files (3.7MB)
    └── 全データベース即時展開
```

### 1.2 目標アーキテクチャ
```
[Browser]
    ↓ 初期ロード1MB
[os_analyzer.html]
    ├── Critical JS (必須のみ)
    ├── Critical CSS (インライン)
    └── Progressive Loading
         ├── Dynamic Import
         ├── API Fetch
         └── IndexedDB Cache
```

---

## 2. データ分離設計

### 2.1 データ分類と優先度

#### Critical Data（初期ロード必須）
```javascript
// critical-data.js (目標: 50KB以下)
{
  questions: [...], // 30問の質問データのみ
  ui_texts: {...},  // UI表示テキスト
  config: {...}     // 基本設定
}
```

#### On-Demand Data（必要時取得）
```javascript
// APIエンドポイント設計
/api/v1/hexagrams/
├── summary.json      // 64卦の基本情報のみ (10KB)
├── {id}/            // 個別卦詳細
│   ├── base.json    // 基本情報
│   ├── lines.json   // 爻辞
│   └── analysis.json // 分析データ
├── h384/
│   └── {hex}_{line}.json // 384爻個別データ
└── bulk/
    └── POST: { ids: [...] } // 一括取得
```

### 2.2 データ構造最適化

#### Before（現状）
```javascript
// data_box.js - 388KB
window.hexagrams_master = [
  {
    id: 1,
    name_ja: "乾為天",
    name_cn: "乾",
    // ... 100+ properties per hexagram
  },
  // ... x64
];
```

#### After（最適化後）
```javascript
// hexagram-loader.js - 5KB
class HexagramLoader {
  async getHexagram(id) {
    // キャッシュチェック
    const cached = await this.cache.get(`hex_${id}`);
    if (cached) return cached;
    
    // API取得
    const data = await fetch(`/api/v1/hexagrams/${id}`);
    await this.cache.set(`hex_${id}`, data);
    return data;
  }
}
```

---

## 3. コード分割設計

### 3.1 モジュール分類

#### Core Modules（初期ロード）
```javascript
// core-bundle.js (目標: 500KB)
- BaseComponent.js
- SimpleStorageManager.js
- questions.js (質問データのみ)
- WelcomeScreen.js
- VirtualQuestionFlow-core.js
```

#### Lazy Modules（動的ロード）
```javascript
// 分析時にロード
const loadAnalysisModules = async () => {
  const modules = await Promise.all([
    import('./engines/StatisticalEngine.js'),
    import('./engines/Calculator.js'),
    import('./components/AnalysisView.js')
  ]);
  return modules;
};

// 結果表示時にロード
const loadResultModules = async () => {
  const modules = await Promise.all([
    import('./engines/TripleOSEngine.js'),
    import('./components/ResultsView.js'),
    import('./components/InsightPanel.js')
  ]);
  return modules;
};
```

### 3.2 Progressive Enhancement戦略

```javascript
// app.js 最適化版
class OptimizedApp {
  async initialize() {
    // Phase 1: Critical Path (即座に表示)
    this.showWelcomeScreen();
    
    // Phase 2: Core Functions (1秒以内)
    await this.loadCoreModules();
    
    // Phase 3: Enhancement (バックグラウンド)
    this.loadEnhancementModules();
  }
  
  async loadCoreModules() {
    // 必須モジュールのみ
    const core = await import('./core-bundle.js');
    this.initializeQuestionFlow(core);
  }
  
  loadEnhancementModules() {
    // アイドル時に先読み
    requestIdleCallback(() => {
      import('./enhancement-bundle.js');
    });
  }
}
```

---

## 4. CSS最適化設計

### 4.1 Critical CSS抽出

#### インラインCSS（<style>タグ内）
```css
/* critical.css - 14KB以下 */
:root {
  /* 必須CSS変数のみ */
  --color-primary: #6366f1;
  --font-base: 1rem;
}

/* ファーストビューのみ */
.welcome-container { ... }
.welcome-title { ... }
.start-button { ... }
```

#### 非同期CSS
```html
<!-- プリロード -->
<link rel="preload" href="/css/main.css" as="style">
<!-- 非同期ロード -->
<link rel="stylesheet" href="/css/main.css" media="print" onload="this.media='all'">
```

### 4.2 CSS分割戦略

```
css/
├── critical.css      (14KB - インライン)
├── core.css         (50KB - 基本スタイル)
├── components.css   (100KB - UIコンポーネント)
├── themes.css       (30KB - テーマ変数)
└── interactive.css  (200KB - アニメーション等) ← 2.97MBから削減
```

---

## 5. API実装設計

### 5.1 エンドポイント設計

```javascript
// Cloudflare Workers実装
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // ルーティング
    if (path.startsWith('/api/v1/hexagrams/')) {
      return handleHexagrams(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleHexagrams(request, env) {
  const id = getHexagramId(request.url);
  
  // KVストレージから取得
  const data = await env.HEXAGRAMS.get(`hex_${id}`, 'json');
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
```

### 5.2 キャッシング設計

```javascript
// cache-manager.js
class OptimizedCacheManager {
  constructor() {
    this.initIndexedDB();
    this.memoryCacheSize = 0;
    this.maxMemoryCache = 10 * 1024 * 1024; // 10MB
  }
  
  async get(key) {
    // L1: Memory Cache
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // L2: IndexedDB
    const cached = await this.db.get(key);
    if (cached && !this.isExpired(cached)) {
      this.memoryCache.set(key, cached.data);
      return cached.data;
    }
    
    // L3: Network
    return null;
  }
  
  async set(key, data, ttl = 86400) {
    const entry = {
      data,
      expires: Date.now() + (ttl * 1000)
    };
    
    // Memory Cache管理
    if (this.getSize(data) < this.maxMemoryCache * 0.1) {
      this.memoryCache.set(key, data);
    }
    
    // IndexedDB永続化
    await this.db.put(key, entry);
  }
}
```

---

## 6. セキュリティヘッダー実装設計

### 6.1 メタタグ実装（即時対応）

```html
<!-- os_analyzer.html -->
<head>
  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data:;
    connect-src 'self' https://api.haqei.com;
  ">
  
  <!-- その他のセキュリティヘッダー -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
</head>
```

### 6.2 Cloudflare Workers実装（本格対応）

```javascript
// security-headers.js
export function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  
  // セキュリティヘッダー追加
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS（HTTPS環境のみ）
  if (request.url.startsWith('https://')) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
```

### 6.3 CSRF実装補完

```javascript
// csrf-protection.js
class EnhancedCSRFProtection {
  generateToken() {
    const token = crypto.randomUUID();
    sessionStorage.setItem('csrf_token', token);
    
    // メタタグ更新
    let meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'csrf-token';
      document.head.appendChild(meta);
    }
    meta.content = token;
    
    return token;
  }
  
  validateRequest(request) {
    const token = request.headers.get('X-CSRF-Token');
    const stored = sessionStorage.getItem('csrf_token');
    
    if (!token || token !== stored) {
      throw new Error('CSRF token validation failed');
    }
  }
  
  attachToFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
        options.headers = {
          ...options.headers,
          'X-CSRF-Token': this.getToken()
        };
      }
      return originalFetch(url, options);
    };
  }
}
```

---

## 7. 実装優先順位

### Phase 1: 即時対応（1-2日）
1. セキュリティヘッダー（メタタグ）実装
2. Critical CSS抽出とインライン化
3. 大容量データファイルの外部化

### Phase 2: API実装（3-4日）
1. Cloudflare Workers API構築
2. データ取得クライアント実装
3. キャッシング層実装

### Phase 3: コード分割（3-4日）
1. Dynamic Import実装
2. バンドル再構成
3. Progressive Loading最適化

### Phase 4: 最終調整（2-3日）
1. パフォーマンステスト
2. セキュリティ監査
3. 本番環境検証

---

## 8. 移行計画

### 8.1 後方互換性維持

```javascript
// compatibility-layer.js
// 既存コードとの互換性維持
window.hexagrams_master = new Proxy({}, {
  get(target, prop) {
    console.warn('Legacy access to hexagrams_master');
    return getHexagramSync(prop); // 同期的に見せる
  }
});
```

### 8.2 段階的移行

```javascript
// feature-flags.js
const FEATURES = {
  USE_API_DATA: true,
  USE_DYNAMIC_IMPORT: true,
  USE_CRITICAL_CSS: true,
  USE_SECURITY_HEADERS: true
};

// 問題時の即時ロールバック可能
```

---

## 9. テスト計画

### 9.1 自動テスト
```javascript
// performance-test.js
describe('Bundle Size Tests', () => {
  test('Initial bundle < 1MB', async () => {
    const stats = await getBundleStats();
    expect(stats.initialSize).toBeLessThan(1024 * 1024);
  });
  
  test('Total size < 5MB', async () => {
    const stats = await getBundleStats();
    expect(stats.totalSize).toBeLessThan(5 * 1024 * 1024);
  });
});
```

### 9.2 手動テスト
- [ ] 3G環境での動作確認
- [ ] オフライン時のフォールバック
- [ ] 30問フロー完全動作
- [ ] セキュリティヘッダー検証

---

## 10. リスク対策

### リスク1: API遅延
**対策**: 
- プリフェッチ戦略
- 適切なローディングUI
- タイムアウト処理

### リスク2: キャッシュ不整合
**対策**:
- バージョニング
- 強制更新機能
- TTL管理

### リスク3: 既存機能破損
**対策**:
- Feature Flag
- A/Bテスト
- 即時ロールバック

---

**設計書作成日**: 2025年8月6日  
**次工程**: 実装タスク定義書の作成