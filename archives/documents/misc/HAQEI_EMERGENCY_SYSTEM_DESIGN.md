# HAQEI Analyzer 緊急修正システム設計書

## 📋 設計概要

**設計方針**: 最小限の複雑さで最大限の機能  
**実装期限**: 24時間  
**アーキテクチャ**: 単一HTMLファイル・インライン実装

---

## 🎯 アーキテクチャ決定記録 (ADR)

### ADR-001: 単一HTMLファイルアーキテクチャ採用

**決定**: 現在の複雑な依存関係を排除し、単一HTMLファイルに全機能を統合

**理由**:
- 現在約50+のJavaScriptファイルが存在し、依存関係が複雑
- 緊急修正として24時間以内での実装が必要
- デプロイ・保守の簡素化

**影響**:
- ロード時間の大幅短縮
- 依存関係エラーの完全排除
- デバッグの簡素化

### ADR-002: インライン実装戦略

**決定**: 外部ファイル依存を最小化し、Critical CSSとCore JavaScriptをインライン化

**理由**:
- ネットワーク要求の削減
- キャッシュ問題の回避
- 完全なオフライン動作

### ADR-003: 段階的縮退戦略

**決定**: エラー時の機能段階的縮退システムを実装

**段階**:
1. 完全機能 (I Ching分析 + UI全機能)
2. 基本機能 (簡易分析 + 基本UI)
3. 最小限機能 (静的コンテンツ + エラー表示)

---

## 🏗️ システムアーキテクチャ

### C4 Context Diagram
```
┌─────────────────────────────────────────────────────────┐
│                    HAQEI Analyzer                      │
│                 (Single HTML File)                     │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │      User       │  │   I Ching Data  │             │
│  │   Interface     │  │    (Inline)     │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Analysis Core  │  │  Result Display │             │
│  │   (Embedded)    │  │   (Component)   │             │
│  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Container Diagram
```
┌─────────────────────────────────────────────────────────┐
│               index.html (Single File)                 │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │             <style> Critical CSS                   │ │
│  │  • Layout & Typography                             │ │
│  │  • Component Styles                                │ │
│  │  • Responsive Design                               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           <script> Core JavaScript                 │ │
│  │  • State Management                                │ │
│  │  • UI Components                                   │ │
│  │  • I Ching Analysis                                │ │
│  │  • Error Handling                                  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │          <script> Inline Data                      │ │
│  │  • Questions (30 items)                            │ │
│  │  • Hexagrams (64 items)                            │ │
│  │  • OS Types Configuration                          │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Component Diagram
```
┌─────────────────────────────────────────────────────────┐
│                 HAQEI Application                       │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │  WelcomeScreen  │  │  QuestionFlow   │             │
│  │  - 初期表示     │  │  - 30問表示     │             │
│  │  - OS選択       │  │  - 回答収集     │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │  AnalysisCore   │  │  ResultDisplay  │             │
│  │  - 回答分析     │  │  - スコア表示   │             │
│  │  - 卦計算       │  │  - 詳細分析     │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │   ErrorHandler  │  │   StateManager  │             │
│  │  - エラー表示   │  │  - 状態管理     │             │
│  │  - 段階的縮退   │  │  - ローカル保存 │             │
│  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 データフロー設計

### User Journey Flow
```
[開始] → [ウェルカム画面] → [OS選択] → [質問1-30] → [分析] → [結果表示]
   ↓         ↓              ↓          ↓         ↓         ↓
[Error] ← [Error Handler] ←──────────────────────────────────┘
   ↓
[段階的縮退: 完全機能 → 基本機能 → 最小限機能]
```

### Data Structure
```javascript
// インライン化された必須データ構造
const HAQEI_DATA = {
  // 質問データ (30問)
  questions: [
    {
      id: "q1",
      text: "質問文...",
      choices: [
        { value: "A", text: "選択肢A", score: { engine: 3, interface: 1, safemode: 2 } },
        { value: "B", text: "選択肢B", score: { engine: 1, interface: 3, safemode: 2 } },
        { value: "C", text: "選択肢C", score: { engine: 2, interface: 2, safemode: 3 } }
      ]
    }
    // ... 29問継続
  ],
  
  // 卦データ (64卦の基本情報のみ)
  hexagrams: [
    {
      id: 1,
      name: "乾",
      binary: "111111",
      keywords: ["創造", "天", "リーダーシップ"],
      advice: "..."
    }
    // ... 63卦継続
  ],
  
  // OS種別設定
  osTypes: {
    engine: {
      name: "Engine OS",
      description: "実行力重視",
      icon: "⚡",
      color: "#6366f1"
    },
    interface: {
      name: "Interface OS", 
      description: "対話力重視",
      icon: "🤝",
      color: "#a855f7"
    },
    safemode: {
      name: "SafeMode OS",
      description: "安定性重視", 
      icon: "🛡️",
      color: "#fb923c"
    }
  }
};
```

---

## 🛠️ 技術仕様

### Core Technologies
| 技術 | 目的 | 実装方式 |
|------|------|----------|
| HTML5 | 基盤構造 | セマンティック要素 |
| CSS3 | スタイリング | CSS Grid/Flexbox |
| Vanilla JS | 機能実装 | ES6+ (class構文) |
| LocalStorage | データ保存 | JSON形式 |

### Browser Support Matrix
| ブラウザ | 最小バージョン | 対応機能レベル |
|----------|---------------|----------------|
| Chrome | 80+ | 完全対応 |
| Firefox | 75+ | 完全対応 |
| Safari | 13+ | 完全対応 |
| Edge | 80+ | 完全対応 |
| IE11 | N/A | 最小限対応 |

### Performance Targets
| メトリック | 目標値 | 測定方法 |
|-----------|--------|----------|
| First Contentful Paint | < 1.5秒 | Lighthouse |
| Largest Contentful Paint | < 2.5秒 | Lighthouse |
| Total Bundle Size | < 200KB | gzip後 |
| Time to Interactive | < 3秒 | Lighthouse |

---

## 🏗️ 実装設計

### 1. ファイル構造 (簡素化)
```
haqei-analyzer/
├── index.html              # 単一ファイル (全機能統合)
├── README.md               # 基本説明
└── backup/                 # 現在の複雑版バックアップ
    └── dist/...
```

### 2. HTML構造設計
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HAQEI Analyzer - 緊急修正版</title>
  
  <!-- Critical CSS (インライン) -->
  <style>
    /* CSS Variables, Reset, Layout, Components */
    /* 約200行 - 必須スタイルのみ */
  </style>
</head>
<body>
  <!-- App Structure -->
  <div id="app">
    <div id="welcome-screen" class="screen active">...</div>
    <div id="questions-screen" class="screen">...</div>
    <div id="results-screen" class="screen">...</div>
    <div id="error-screen" class="screen">...</div>
  </div>
  
  <!-- Core JavaScript (インライン) -->
  <script>
    // Data, State Management, UI Components, Analysis Logic
    // 約1000行 - 必須機能のみ
  </script>
</body>
</html>
```

### 3. JavaScript アーキテクチャ設計
```javascript
// 1. 状態管理クラス
class HAQEIState {
  constructor() {
    this.currentScreen = 'welcome';
    this.selectedOS = null;
    this.answers = [];
    this.currentQuestion = 0;
    this.analysisResult = null;
  }
}

// 2. UIコンポーネントクラス
class HAQEIComponent {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
  }
  
  render(data) { /* 実装 */ }
  hide() { this.element.classList.remove('active'); }
  show() { this.element.classList.add('active'); }
}

// 3. 分析エンジンクラス  
class HAQEIAnalyzer {
  analyze(answers) {
    // I Ching 分析ロジック
    return {
      osType: this.calculateOSType(answers),
      hexagram: this.calculateHexagram(answers),
      scores: this.calculateScores(answers),
      insights: this.generateInsights(answers)
    };
  }
}

// 4. アプリケーションクラス
class HAQEIApp {
  constructor() {
    this.state = new HAQEIState();
    this.analyzer = new HAQEIAnalyzer();
    this.components = {
      welcome: new WelcomeScreen('welcome-screen'),
      questions: new QuestionFlow('questions-screen'),
      results: new ResultDisplay('results-screen'),
      error: new ErrorHandler('error-screen')
    };
  }
  
  init() { /* 初期化 */ }
  navigate(screen) { /* 画面遷移 */ }
}
```

### 4. エラーハンドリング設計
```javascript
class ErrorHandler {
  constructor() {
    this.level = 'full'; // full → basic → minimal
  }
  
  handleError(error) {
    console.error(error);
    
    switch(this.level) {
      case 'full':
        return this.tryBasicMode();
      case 'basic':
        return this.tryMinimalMode();
      case 'minimal':
        return this.showStaticContent();
    }
  }
  
  degradeToBasic() {
    this.level = 'basic';
    // 機能簡略化
  }
  
  degradeToMinimal() {
    this.level = 'minimal';
    // 静的コンテンツのみ
  }
}
```

---

## 📱 レスポンシブ設計

### Mobile First CSS
```css
/* Base: Mobile (320px+) */
:root {
  --space-unit: 4px;
  --font-base: clamp(1rem, 4vw, 1.125rem);
  --tap-target: max(44px, 2.75rem);
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  /* UI拡張 */
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  /* レイアウト最適化 */
}
```

### Touch Optimization
- タップターゲット: 最小44px
- スワイプナビゲーション対応
- 長押し無効化
- 視覚フィードバック強化

---

## 🔄 データ永続化設計

### LocalStorage Strategy
```javascript
class DataManager {
  save(key, data) {
    try {
      localStorage.setItem(`haqei_${key}`, JSON.stringify(data));
    } catch (e) {
      // Quota exceeded処理
      this.clearOldData();
      localStorage.setItem(`haqei_${key}`, JSON.stringify(data));
    }
  }
  
  load(key) {
    try {
      const data = localStorage.getItem(`haqei_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
}
```

---

## 🚀 24時間実装計画

### Phase 1 (0-8時間): 基盤構築
- [ ] 単一HTMLファイル作成
- [ ] Critical CSS実装 
- [ ] 基本UI構造構築
- [ ] データ構造定義

### Phase 2 (8-16時間): 機能実装
- [ ] 質問フロー実装
- [ ] 分析エンジン実装
- [ ] 結果表示実装
- [ ] エラーハンドリング実装

### Phase 3 (16-24時間): 最適化・テスト
- [ ] レスポンシブ対応
- [ ] パフォーマンス最適化
- [ ] ブラウザテスト
- [ ] 段階的縮退テスト

---

## 🎯 品質保証

### Testing Strategy
1. **Unit Testing**: 主要機能の個別テスト
2. **Integration Testing**: コンポーネント間連携テスト  
3. **User Testing**: 実際のユーザーフロー検証
4. **Error Testing**: 段階的縮退動作確認

### Performance Monitoring
```javascript
// Built-in performance tracking
class PerformanceMonitor {
  trackMetric(name, value) {
    console.log(`📊 ${name}: ${value}ms`);
  }
  
  trackUserFlow(step) {
    const timestamp = performance.now();
    this.trackMetric(`UserFlow-${step}`, timestamp);
  }
}
```

---

## 📈 リスク管理

### 技術リスク
| リスク | 確率 | 影響 | 対策 |
|-------|------|------|------|
| ブラウザ互換性 | 中 | 高 | Progressive Enhancement |
| パフォーマンス | 低 | 中 | Bundle Size監視 |
| データ損失 | 低 | 高 | LocalStorage + Backup |

### 実装リスク
| リスク | 確率 | 影響 | 対策 |
|-------|------|------|------|
| 機能削減必要 | 高 | 中 | MVP優先実装 |
| 24時間超過 | 中 | 高 | 段階的リリース |
| 既存データ移行 | 中 | 中 | 互換性レイヤー |

---

## 📋 成功指標

### Technical KPIs
- Bundle Size: < 200KB (現在対比90%削減)
- Load Time: < 2秒 (現在対比80%改善)
- Error Rate: < 1% (現在の複雑性起因エラー排除)

### User Experience KPIs  
- Task Completion Rate: > 95%
- User Satisfaction: > 4.0/5.0
- Mobile Usability: > 90%

### Business KPIs
- Development Time: 24時間以内完了
- Maintenance Cost: 90%削減
- Deploy Complexity: 95%削減

---

## 🔧 運用・保守設計

### Monitoring Strategy
```javascript
// Simple error tracking
window.addEventListener('error', (e) => {
  console.error('Global Error:', e);
  // Optional: Send to analytics
});

// Performance tracking  
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  console.log(`Load Time: ${loadTime}ms`);
});
```

### Update Strategy
1. **Hotfix**: HTMLファイル直接編集
2. **Feature Update**: 段階的機能追加
3. **Major Update**: アーキテクチャ見直し

---

## 📚 結論

この緊急修正システム設計は、複雑な依存関係を排除し、**単一HTMLファイルでの完全動作**を実現します。24時間実装により、即座にユーザーが利用可能な安定したHAQEI Analyzerを提供し、今後の段階的機能拡張の基盤とします。

---

## 📊 現状分析と問題点

### 現在のシステム状況
- **JavaScriptファイル数**: 78個
- **JSディレクトリサイズ**: 1.2MB
- **複雑な依存関係**: 動的読み込み、エラーハンドリング、リトライ機能
- **保守性**: 極めて低い（ファイル間依存関係追跡困難）

### 問題点分析
1. **過度の分散**: 本来統合可能な機能が78ファイルに分散
2. **依存関係地獄**: app.jsの動的読み込みシステムが複雑化
3. **デバッグ困難**: エラー発生時の原因特定が困難
4. **パフォーマンス劣化**: 大量のHTTP請求とファイル読み込み
5. **デプロイ複雑性**: 78ファイルの整合性管理が必要

### 緊急修正の必要性
- 現在のシステムは継続的な保守が困難
- 新機能追加時の影響範囲予測不可能
- エラー発生時の復旧作業が長時間化

---

## 🎯 技術評価マトリックス

### 現在 vs 提案システム比較

| 評価項目 | 現在のシステム | 提案システム | 改善率 |
|----------|----------------|--------------|--------|
| **ファイル数** | 78ファイル | 1ファイル | **98.7%削減** |
| **Bundle Size** | 1.2MB+ | <200KB | **83%削減** |
| **初期読み込み** | 3-8秒 | <2秒 | **75%改善** |
| **依存関係** | 複雑・追跡困難 | なし | **100%解決** |
| **デバッグ** | 困難 | 簡単 | **90%改善** |
| **保守性** | 極低 | 高 | **400%改善** |
| **エラー率** | 高（依存性） | 低 | **80%削減** |
| **デプロイ** | 複雑 | 単純 | **95%簡素化** |

### 実装リスク評価

| リスク要因 | 確率 | 影響度 | リスクレベル | 対策 |
|-----------|------|--------|-------------|------|
| **機能削減** | 高(80%) | 中 | **中** | MVP機能優先 |
| **24h超過** | 中(40%) | 高 | **中** | 段階的実装 |
| **互換性問題** | 低(20%) | 中 | **低** | Progressive Enhancement |
| **データ移行** | 中(30%) | 中 | **低** | LocalStorage維持 |
| **ユーザビリティ低下** | 低(15%) | 高 | **低** | UX優先設計 |

### 技術選択理由

| 技術 | 選択理由 | 代替案 | 選択根拠 |
|------|----------|--------|----------|
| **Single HTML** | 依存関係完全排除 | SPA Framework | 緊急性・簡素性 |
| **Vanilla JS** | 外部依存なし | React/Vue | Bundle Size最小化 |
| **CSS Grid/Flex** | レスポンシブ対応 | CSS Framework | 軽量性 |
| **LocalStorage** | 簡単・高速 | IndexedDB | 実装簡素性 |
| **Inline Assets** | HTTP請求削減 | External Files | 速度・信頼性 |

---

## 🏗️ 詳細実装仕様

### 1. データ構造最適化

#### 質問データ圧縮
```javascript
// 現在: 冗長な構造
const currentQuestion = {
  id: "question_1",
  text: "長い質問文...",
  choices: [
    { id: "choice_1_a", text: "選択肢A", scores: { engine: 3, interface: 1, safemode: 2 } }
  ]
};

// 提案: 圧縮構造
const optimizedQuestion = {
  i: 1, // id shorthand
  t: "質問文...", // text shorthand  
  c: [["選択肢A", [3,1,2]], ["選択肢B", [1,3,2]], ["選択肢C", [2,2,3]]] // compressed choices
};

// データサイズ削減: 約60%削減見込み
```

#### 卦データ最適化
```javascript
// 必須情報のみ抽出
const hexagramData = {
  1: { n: "乾", b: "111111", k: ["創造","天","リーダー"], a: "積極的に..." },
  2: { n: "坤", b: "000000", k: ["受容","地","サポート"], a: "慎重に..." }
  // ... 64卦 (圧縮形式で約80%削減)
};
```

### 2. コンポーネント設計詳細

#### 状態管理システム
```javascript
class HAQEIState {
  constructor() {
    this.data = {
      screen: 'welcome',    // 現在画面
      osType: null,         // 選択されたOS
      answers: [],          // 回答配列
      questionIndex: 0,     // 現在の質問番号
      result: null,         // 分析結果
      error: null           // エラー状態
    };
    
    this.observers = [];    // Observer Pattern
    this.history = [];      // Undo/Redo用
  }
  
  setState(newState) {
    this.history.push({ ...this.data });
    Object.assign(this.data, newState);
    this.notifyObservers();
    this.persist(); // LocalStorageに自動保存
  }
  
  subscribe(callback) {
    this.observers.push(callback);
  }
  
  notifyObservers() {
    this.observers.forEach(callback => callback(this.data));
  }
  
  persist() {
    try {
      localStorage.setItem('haqei_state', JSON.stringify(this.data));
    } catch (e) {
      console.warn('State persistence failed:', e);
    }
  }
  
  restore() {
    try {
      const saved = localStorage.getItem('haqei_state');
      if (saved) {
        this.data = { ...this.data, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('State restoration failed:', e);
    }
  }
}
```

#### UI コンポーネントベース
```javascript
class HAQEIComponent {
  constructor(containerId, template = '') {
    this.container = document.getElementById(containerId);
    this.template = template;
    this.state = {};
    this.events = {};
  }
  
  render(data = {}) {
    // テンプレート処理（軽量版）
    let html = this.template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      html = html.replace(regex, data[key] || '');
    });
    
    this.container.innerHTML = html;
    this.bindEvents();
    this.onRender(data);
  }
  
  bindEvents() {
    Object.keys(this.events).forEach(selector => {
      const [eventType, handler] = this.events[selector];
      const elements = this.container.querySelectorAll(selector);
      elements.forEach(el => {
        el.addEventListener(eventType, handler.bind(this));
      });
    });
  }
  
  onRender(data) {
    // Override point for custom logic
  }
  
  show() {
    this.container.classList.add('active');
    this.container.classList.remove('hidden');
  }
  
  hide() {
    this.container.classList.remove('active');
    this.container.classList.add('hidden');
  }
}
```

### 3. パフォーマンス最適化戦略

#### Critical Rendering Path最適化
```css
/* Critical CSS - Above the Fold優先 */
/* 1. Layout Essentials */
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, sans-serif; }

/* 2. Welcome Screen (First View) */
.welcome-screen { 
  display: flex; 
  align-items: center; 
  justify-content: center;
  min-height: 100vh;
}

/* 3. Component Base Classes */
.screen { display: none; }
.screen.active { display: flex; }
.btn { 
  padding: 12px 24px; 
  border: none; 
  border-radius: 6px;
  background: #007AFF;
  color: white;
  cursor: pointer;
  min-height: 44px; /* Touch target */
}

/* Non-critical styles loaded after First Paint */
```

#### JavaScript実行最適化
```javascript
// 1. Lazy Component Loading
class LazyLoader {
  static components = new Map();
  
  static register(name, factory) {
    this.components.set(name, { factory, instance: null });
  }
  
  static async get(name) {
    const component = this.components.get(name);
    if (!component) throw new Error(`Component ${name} not found`);
    
    if (!component.instance) {
      component.instance = await component.factory();
    }
    
    return component.instance;
  }
}

// 2. Event Delegation (メモリ効率化)
class EventManager {
  constructor() {
    this.delegatedEvents = new Map();
    this.setupDelegation();
  }
  
  setupDelegation() {
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('change', this.handleChange.bind(this));
  }
  
  handleClick(event) {
    const handler = this.findHandler(event.target, 'click');
    if (handler) handler(event);
  }
  
  findHandler(element, eventType) {
    let current = element;
    while (current && current !== document) {
      const key = `${eventType}:${current.dataset.action || ''}`;
      if (this.delegatedEvents.has(key)) {
        return this.delegatedEvents.get(key);
      }
      current = current.parentElement;
    }
    return null;
  }
  
  register(eventType, action, handler) {
    this.delegatedEvents.set(`${eventType}:${action}`, handler);
  }
}
```

### 4. エラーハンドリング詳細

#### 段階的縮退システム
```javascript
class ErrorRecoverySystem {
  constructor() {
    this.errorLevel = 0; // 0: Normal, 1: Basic, 2: Minimal
    this.errorLog = [];
    this.setupGlobalErrorHandling();
  }
  
  setupGlobalErrorHandling() {
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
  }
  
  handleGlobalError(event) {
    this.logError({
      type: 'script',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
    
    this.degradeIfNeeded();
  }
  
  degradeIfNeeded() {
    const recentErrors = this.getRecentErrors(60000); // 1分以内
    
    if (recentErrors.length >= 3 && this.errorLevel === 0) {
      this.degradeToBasic();
    } else if (recentErrors.length >= 5 && this.errorLevel === 1) {
      this.degradeToMinimal();
    }
  }
  
  degradeToBasic() {
    this.errorLevel = 1;
    console.warn('🔄 Degrading to Basic Mode');
    
    // 機能制限
    this.disableAdvancedFeatures();
    this.showBasicUI();
  }
  
  degradeToMinimal() {
    this.errorLevel = 2;
    console.warn('🔄 Degrading to Minimal Mode');
    
    // 最小限機能のみ
    this.showStaticContent();
  }
  
  disableAdvancedFeatures() {
    // アニメーション無効化
    document.documentElement.style.setProperty('--animation-duration', '0s');
    
    // 複雑なUI要素非表示
    document.querySelectorAll('[data-advanced]').forEach(el => {
      el.style.display = 'none';
    });
  }
  
  showStaticContent() {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h1>HAQEI Analyzer</h1>
        <p>申し訳ございません。現在システムに問題が発生しています。</p>
        <p>ページを再読み込みしてお試しください。</p>
        <button onclick="location.reload()" style="padding: 12px 24px; font-size: 16px;">
          再読み込み
        </button>
      </div>
    `;
  }
}
```

---

## 📱 モバイル最適化詳細

### Touch Interface Design
```css
/* Touch-friendly interface */
:root {
  --touch-target: max(44px, 2.75rem); /* WCAG推奨サイズ */
  --touch-spacing: 8px;
}

.touch-target {
  min-height: var(--touch-target);
  min-width: var(--touch-target);
  padding: var(--touch-spacing);
  position: relative;
}

/* Touch feedback */
.touch-target:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* Prevent text selection during touch */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Safe area for notched devices */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Gesture Support
```javascript
class TouchManager {
  constructor() {
    this.touches = new Map();
    this.setupTouchEvents();
  }
  
  setupTouchEvents() {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }
  
  handleTouchStart(event) {
    Array.from(event.changedTouches).forEach(touch => {
      this.touches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now()
      });
    });
  }
  
  handleTouchEnd(event) {
    Array.from(event.changedTouches).forEach(touch => {
      const touchData = this.touches.get(touch.identifier);
      if (!touchData) return;
      
      const deltaX = touch.clientX - touchData.startX;
      const deltaY = touch.clientY - touchData.startY;
      const deltaTime = Date.now() - touchData.startTime;
      
      // スワイプ検出
      if (Math.abs(deltaX) > 50 && deltaTime < 300) {
        this.handleSwipe(deltaX > 0 ? 'right' : 'left');
      }
      
      this.touches.delete(touch.identifier);
    });
  }
  
  handleSwipe(direction) {
    // 画面遷移等の処理
    window.dispatchEvent(new CustomEvent('swipe', { detail: { direction } }));
  }
}
```

---

## 🚀 実装ロードマップ詳細

### Phase 1: 基盤構築 (0-8時間)

#### 時間配分
- **0-2時間**: HTML構造 + Critical CSS
- **2-4時間**: JavaScript基盤クラス
- **4-6時間**: データ構造 + State Management
- **6-8時間**: 基本UI Components

#### 成果物
```
✅ index.html (基本構造)
✅ Critical CSS (上記デザインシステム)
✅ HAQEIState class
✅ HAQEIComponent base class
✅ 基本データ構造定義
✅ WelcomeScreen component
```

### Phase 2: 機能実装 (8-16時間)

#### 時間配分
- **8-10時間**: Question Flow implementation
- **10-12時間**: Analysis Engine
- **12-14時間**: Results Display
- **14-16時間**: Error Handling + Recovery

#### 成果物
```
✅ QuestionFlow component
✅ HAQEIAnalyzer class
✅ ResultsDisplay component
✅ ErrorRecoverySystem class
✅ TouchManager class
```

### Phase 3: 最適化・テスト (16-24時間)

#### 時間配分
- **16-18時間**: Performance optimization
- **18-20時間**: Responsive design
- **20-22時間**: Browser testing
- **22-24時間**: Error scenario testing

#### 成果物
```
✅ Performance benchmarks
✅ Cross-browser compatibility
✅ Mobile optimization
✅ Error recovery testing
✅ Documentation update
```

---

## 📊 成功測定指標

### Technical Metrics

| 指標 | 現在値 | 目標値 | 測定方法 |
|------|--------|--------|----------|
| **Bundle Size** | >1.2MB | <200KB | gzip compression |
| **File Count** | 78 | 1 | Direct count |
| **Load Time** | 3-8s | <2s | Performance API |
| **FCP** | 2-4s | <1.5s | Lighthouse |
| **LCP** | 4-8s | <2.5s | Lighthouse |
| **CLS** | 0.1-0.3 | <0.1 | Lighthouse |
| **TTI** | 5-10s | <3s | Lighthouse |

### User Experience Metrics

| 指標 | 測定方法 | 目標値 |
|------|----------|--------|
| **Task Completion** | User testing | >95% |
| **Error Rate** | Analytics | <1% |
| **Mobile Usability** | Lighthouse | >90 |
| **Accessibility** | axe-core | AA compliance |
| **User Satisfaction** | Survey | >4.0/5.0 |

### Business Impact

| 指標 | 改善見込み |
|------|------------|
| **Development Speed** | 300%向上 |
| **Maintenance Cost** | 90%削減 |
| **Deploy Time** | 95%短縮 |
| **Bug Resolution** | 80%高速化 |
| **Feature Delivery** | 200%向上 |

---

**次のステップ**: Phase 1実装開始 - HTML構造構築から開始