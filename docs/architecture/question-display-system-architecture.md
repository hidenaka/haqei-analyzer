# HAQEIアナライザー質問表示システム アーキテクチャ設計書

**バージョン**: 2.0.0  
**作成日**: 2025-08-05  
**作成者**: System Architecture Designer  
**対象システム**: HAQEI Analyzer Question Display System

## 1. システムアーキテクチャ図

### 1.1 高レベルアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    HAQEI Question Display System            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Presentation  │  │   Application   │  │     Domain      │ │
│  │     Layer       │  │     Layer       │  │     Layer       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Infrastructure │  │   Data Access   │  │  Cross-Cutting  │ │
│  │     Layer       │  │     Layer       │  │   Concerns      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 コンポーネント構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 VirtualQuestionFlow                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ Question    │  │ Navigation  │  │ Progress    │     │ │
│  │  │ Renderer    │  │ Controller  │  │ Manager     │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              HaqeiQuestionElement                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ Shadow DOM  │  │ Template    │  │ Event       │     │ │
│  │  │ Manager     │  │ Renderer    │  │ Handler     │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 Support Systems                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ Cache       │  │ Error       │  │ Performance │     │ │
│  │  │ Manager     │  │ Handler     │  │ Monitor     │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 2. コンポーネント設計

### 2.1 HaqeiQuestionElement（再設計）

**役割**: Web Componentsベースの設問表示要素  
**技術**: Custom Elements API, Shadow DOM  

#### アーキテクチャ決定記録 (ADR-001)
- **決定**: Web Components + Shadow DOMによる完全DOM隔離
- **理由**: CSS競合回避、カプセル化、再利用性向上
- **影響**: 偶数番設問表示問題の根本解決

```javascript
class HaqeiQuestionElement extends HTMLElement {
  // Core Architecture
  constructor() {
    - Shadow DOM による完全隔離
    - パフォーマンス追跡機能
    - イベントリスナー管理
    - DOM要素キャッシュ
  }
  
  // Key Methods
  render() {
    - プリコンパイル済みテンプレート使用
    - CSS-in-JS による動的スタイリング
    - パフォーマンス測定付きレンダリング
  }
  
  handleAnswerChange() {
    - 回答状態の管理
    - カスタムイベント発行
    - 永続化処理の統合
  }
  
  cleanup() {
    - メモリリーク防止
    - イベントリスナー削除
    - リソース解放
  }
}
```

#### 設計パターン
- **Template Method Pattern**: レンダリング処理の共通化
- **Observer Pattern**: 回答変更の通知
- **Factory Pattern**: 設問タイプ別要素生成

### 2.2 VirtualQuestionFlow（改善）

**役割**: Netflix品質の仮想スクロール実装  
**技術**: Virtual Scrolling, Performance Optimization

#### アーキテクチャ決定記録 (ADR-002)
- **決定**: 仮想化による表示設問の制限
- **理由**: メモリ効率化、レンダリングパフォーマンス向上
- **影響**: 大量設問での高パフォーマンス実現

```javascript
class VirtualQuestionFlow extends BaseComponent {
  // Performance Optimizations
  - CacheManager統合
  - PerformanceOptimizer統合
  - 仮想スクロール（visible range: current ±1）
  - DOM要素プール
  - MutationObserver活用
  
  // Key Features
  - 偶数番設問表示問題の完全解決
  - CSS競合対策システム
  - タッチジェスチャー対応
  - 段階的フォールバック処理
}
```

#### パフォーマンス設計
- **Target**: 60fps維持、16.67ms以下のレンダリング
- **Memory**: アクティブ要素数制限（3要素まで）
- **Cache**: LRU + TTL統合キャッシング

### 2.3 QuestionRenderer（新規設計）

**役割**: 設問レンダリングの統一インターフェース

```javascript
class QuestionRenderer {
  // Rendering Strategies
  renderValueQuestion(question) {
    - 価値観設問の専用レンダリング
    - 選択肢UI最適化
    - アクセシビリティ対応
  }
  
  renderScenarioQuestion(question) {
    - シナリオ設問の専用レンダリング
    - 内面/外面の2択UI
    - 分人思想統合
  }
  
  // Template Management
  - プリコンパイル済みテンプレート管理
  - 動的CSS生成
  - レスポンシブ対応
}
```

### 2.4 StateManager（改善）

**役割**: 回答状態の一元管理

#### アーキテクチャ決定記録 (ADR-003)
- **決定**: Redux-likeな単方向データフロー
- **理由**: 状態管理の予測可能性、デバッグ容易性
- **影響**: 複雑な状態変更の統一的管理

```javascript
class StateManager {
  constructor() {
    this.state = {
      currentQuestionIndex: 0,
      answers: [],
      navigationState: {},
      uiState: {}
    };
    this.subscribers = [];
    this.reducers = {};
  }
  
  dispatch(action) {
    // Action処理とState更新
    // 購読者への通知
  }
  
  subscribe(callback) {
    // 状態変更の購読
  }
}
```

## 3. データ構造設計

### 3.1 質問データ構造

```typescript
interface Question {
  id: string;                    // 一意識別子 (q1, q2, ...)
  type: 'value' | 'scenario';    // 設問タイプ
  text: string;                  // 設問文
  title?: string;                // 設問タイトル
  description?: string;          // 説明文
  
  // 価値観設問用
  options?: Option[];            
  
  // シナリオ設問用
  scenario?: string;
  inner_q?: SubQuestion;
  outer_q?: SubQuestion;
}

interface Option {
  id: string;                    // 選択肢ID (A, B, C, ...)
  text: string;                  // 選択肢テキスト
  value: string;                 // 値
  koui_level?: number;           // 五位レベル
  scoring_tags: ScoringTag[];    // スコアリングタグ
}

interface ScoringTag {
  key: string;                   // 次元名
  value: number;                 // スコア値
  type?: 'complementary' | 'conflicting'; // 関係性
}
```

### 3.2 回答データ構造

```typescript
interface Answer {
  questionId: string;
  timestamp: string;
  
  // 価値観設問用
  selectedValue?: string;
  selectedChoice?: string;        // q1a, q2b形式
  choiceText?: string;
  scoring_tags?: ScoringTag[];
  
  // シナリオ設問用
  innerChoice?: {
    value: string;
    scoring_tags: ScoringTag[];
  };
  outerChoice?: {
    value: string;
    scoring_tags: ScoringTag[];
  };
}
```

### 3.3 セッション管理構造

```typescript
interface Session {
  sessionId: string;
  userId?: string;
  startTime: string;
  lastUpdateTime: string;
  progress: {
    currentQuestionIndex: number;
    completedCount: number;
    totalQuestions: number;
  };
  answers: Answer[];
  metadata: {
    userAgent: string;
    viewport: Viewport;
    performance: PerformanceMetrics;
  };
}
```

## 4. UI/UX設計

### 4.1 レイアウト設計

#### Visual Hierarchy
```
┌─────────────────────────────────────┐
│           Progress Bar              │ ← 全体進捗
├─────────────────────────────────────┤
│                                     │
│        Question Display Area        │ ← メイン表示領域
│                                     │
│  ┌─────────────────────────────────┐ │
│  │         Question Text           │ │
│  ├─────────────────────────────────┤ │
│  │                                 │ │
│  │        Options Area             │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│    [ ← Previous ]  [ Next → ]       │ ← ナビゲーション
└─────────────────────────────────────┘
```

#### アーキテクチャ決定記録 (ADR-004)
- **決定**: Card-basedレイアウト + Progressive Disclosure
- **理由**: 認知負荷軽減、フォーカス向上
- **影響**: ユーザー体験の向上、回答精度の向上

### 4.2 アニメーション設計

```css
/* Question Transition */
.question-enter {
  transform: translateX(100%);
  opacity: 0;
}

.question-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.question-exit {
  transform: translateX(0);
  opacity: 1;
}

.question-exit-active {
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}
```

#### パフォーマンス考慮
- **GPU加速**: transform, opacity使用
- **60fps目標**: 16.67ms以下のアニメーション
- **Reduced Motion対応**: prefers-reduced-motion対応

### 4.3 レスポンシブ対応

```scss
// Breakpoints
$breakpoints: (
  mobile: 320px,
  tablet: 768px,
  desktop: 1024px,
  wide: 1440px
);

// Layout Adaptations
@include mobile {
  .question-container {
    padding: 16px;
    .scenario-choices {
      grid-template-columns: 1fr; // 縦並び
    }
  }
}

@include tablet {
  .question-container {
    padding: 24px;
    max-width: 600px;
  }
}

@include desktop {
  .question-container {
    padding: 32px;
    max-width: 800px;
  }
}
```

## 5. パフォーマンス設計

### 5.1 仮想化対応

#### アーキテクチャ決定記録 (ADR-005)
- **決定**: Virtual Scrolling + Element Pooling
- **理由**: メモリ効率化、大量データ対応
- **影響**: 100+設問でも高パフォーマンス維持

```javascript
class VirtualizationEngine {
  constructor() {
    this.visibleRange = { start: 0, end: 2 }; // 現在±1
    this.bufferSize = 1;
    this.elementPool = new Map();
    this.activeElements = new Map();
  }
  
  updateVisibleRange() {
    // 可視範囲の計算と更新
  }
  
  renderVisibleQuestions() {
    // 可視設問のみレンダリング
  }
  
  recycleElements() {
    // 非可視要素の再利用
  }
}
```

### 5.2 遅延読み込み

```javascript
class LazyLoadingManager {
  constructor() {
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '100px' }
    );
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadQuestion(entry.target);
      }
    });
  }
}
```

### 5.3 メモリ管理

#### リソース管理戦略
- **WeakMap使用**: メモリリーク防止
- **FinalizationRegistry**: ガベージコレクション最適化
- **定期クリーンアップ**: アイドル時間での自動クリーンアップ

```javascript
class MemoryManager {
  constructor() {
    this.weakRefs = new WeakMap();
    this.cleanupRegistry = new FinalizationRegistry(
      this.handleCleanup.bind(this)
    );
  }
  
  registerForCleanup(obj, key) {
    this.cleanupRegistry.register(obj, key);
  }
  
  performCleanup() {
    // メモリクリーンアップ処理
  }
}
```

## 6. エラーハンドリング設計

### 6.1 UnifiedErrorHandlerとの統合

#### アーキテクチャ決定記録 (ADR-006)
- **決定**: 既存UnifiedErrorHandlerとの完全統合
- **理由**: bunenjin哲学との整合性、一貫したエラー処理
- **影響**: エラー処理の統一、ユーザー体験の向上

```javascript
class QuestionDisplayErrorHandler {
  constructor(unifiedHandler) {
    this.unifiedHandler = unifiedHandler;
    this.questionSpecificStrategies = new Map();
  }
  
  handleQuestionDisplayError(error, questionId) {
    const context = {
      source: 'question-display',
      questionId,
      component: 'HaqeiQuestionElement',
      userAction: 'viewing-question'
    };
    
    return this.unifiedHandler.handleError(error, context);
  }
  
  handleRenderingError(error, template) {
    // レンダリング固有のエラー処理
  }
  
  handleInteractionError(error, interaction) {
    // ユーザーインタラクション固有のエラー処理
  }
}
```

### 6.2 質問表示エラーの対応

```javascript
// エラー分類とリカバリ戦略
const QUESTION_ERROR_STRATEGIES = {
  RENDERING_FAILED: {
    strategy: 'fallback-template',
    fallback: 'simple-text-display'
  },
  TEMPLATE_NOT_FOUND: {
    strategy: 'dynamic-generation',
    fallback: 'generic-template'
  },
  SHADOW_DOM_ERROR: {
    strategy: 'light-dom-fallback',
    fallback: 'inline-styles'
  },
  CSS_CONFLICT: {
    strategy: 'style-isolation',
    fallback: 'important-override'
  },
  EVEN_QUESTION_DISPLAY: {
    strategy: 'force-visibility',
    fallback: 'mutation-observer-retry'
  }
};
```

### 6.3 グレースフルデグラデーション

```javascript
class GracefulDegradation {
  static DEGRADATION_LEVELS = [
    'full-featured',      // 全機能
    'reduced-animations', // アニメーション削減
    'basic-styling',      // 基本スタイルのみ
    'text-only',         // テキストのみ
    'emergency-mode'      // 緊急モード
  ];
  
  applyDegradation(level, component) {
    switch (level) {
      case 'reduced-animations':
        component.disableAnimations();
        break;
      case 'basic-styling':
        component.useBasicStyles();
        break;
      case 'text-only':
        component.useTextOnlyMode();
        break;
      case 'emergency-mode':
        component.useEmergencyMode();
        break;
    }
  }
}
```

## 7. セキュリティ設計

### 7.1 データ保護

```javascript
class DataProtection {
  sanitizeInput(input) {
    // XSS対策
    return DOMPurify.sanitize(input);
  }
  
  validateQuestionData(question) {
    // 設問データの検証
    return schema.validate(question);
  }
  
  encryptSensitiveData(data) {
    // 機密データの暗号化
    return crypto.encrypt(data);
  }
}
```

### 7.2 CSP（Content Security Policy）

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

## 8. テスト戦略

### 8.1 ユニットテスト

```javascript
describe('HaqeiQuestionElement', () => {
  describe('rendering', () => {
    it('should render value question correctly', () => {
      const element = new HaqeiQuestionElement();
      element.dataset.questionId = 'q1';
      element.render();
      
      expect(element.shadowRoot.innerHTML).toContain('question-container');
    });
    
    it('should handle even question display', () => {
      const element = new HaqeiQuestionElement();
      element.dataset.questionId = 'q2';
      element.render();
      
      const isVisible = window.getComputedStyle(element).display !== 'none';
      expect(isVisible).toBe(true);
    });
  });
});
```

### 8.2 統合テスト

```javascript
describe('VirtualQuestionFlow Integration', () => {
  it('should display all 30 questions correctly', async () => {
    const flow = new VirtualQuestionFlow('test-container');
    await flow.init();
    
    const results = await flow.testAllQuestionsDisplay();
    
    expect(results.passed).toBe(30);
    expect(results.failed).toBe(0);
    expect(results.evenQuestions.passed).toBe(15);
  });
});
```

### 8.3 E2Eテスト

```javascript
// Playwright E2E Test
test('Question flow completion', async ({ page }) => {
  await page.goto('/os_analyzer.html');
  
  // 全30問に回答
  for (let i = 1; i <= 30; i++) {
    await page.waitForSelector(`haqei-question[data-question-id="q${i}"]`);
    await page.click('input[type="radio"]:first-child');
    
    if (i < 30) {
      await page.click('#next-btn');
    }
  }
  
  // 分析開始
  await page.click('#next-btn');
  await page.waitForURL('**/analysis');
});
```

## 9. パフォーマンス目標

### 9.1 Core Web Vitals

| メトリクス | 目標値 | 現在値 | 改善策 |
|-----------|--------|--------|--------|
| LCP | < 2.5s | 3.2s | 仮想化、プリロード |
| FID | < 100ms | 150ms | コード分割、遅延読み込み |
| CLS | < 0.1 | 0.15 | レイアウト固定 |

### 9.2 カスタムメトリクス

| メトリクス | 目標値 | 測定方法 |
|-----------|--------|----------|
| Question Render Time | < 50ms | Performance API |
| Memory Usage | < 50MB | Performance Observer |
| Cache Hit Rate | > 95% | CacheManager統計 |
| Error Rate | < 0.1% | UnifiedErrorHandler |

## 10. 運用・監視設計

### 10.1 リアルタイム監視

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }
  
  startMonitoring() {
    // Performance Observer
    const perfObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.recordMetric(entry.name, entry.duration);
      });
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
  }
  
  recordMetric(name, value) {
    this.metrics.set(name, {
      value,
      timestamp: Date.now()
    });
  }
  
  generateReport() {
    return {
      performance: Object.fromEntries(this.metrics),
      memory: performance.memory,
      navigation: performance.navigation
    };
  }
}
```

### 10.2 ログ収集

```javascript
class LogCollector {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }
  
  log(level, message, context = {}) {
    const entry = {
      timestamp: Date.now(),
      level,
      message,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // 重要なログはリアルタイム送信
    if (level === 'error' || level === 'warning') {
      this.sendLogToServer(entry);
    }
  }
}
```

## 11. デプロイ・移行戦略

### 11.1 段階的移行

1. **Phase 1**: 新アーキテクチャの並行実装
2. **Phase 2**: A/Bテストによる検証
3. **Phase 3**: 段階的切り替え
4. **Phase 4**: 旧システムの廃止

### 11.2 ロールバック計画

```javascript
class DeploymentManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.newVersion = '2.0.0';
    this.rollbackThreshold = 0.05; // 5%エラー率
  }
  
  deploy() {
    // カナリアデプロイ
    this.deployToCanary();
    
    // メトリクス監視
    this.monitorMetrics();
    
    // 自動ロールバック判定
    if (this.shouldRollback()) {
      this.rollback();
    }
  }
}
```

## 12. 今後の拡張性

### 12.1 マイクロフロントエンド対応

```javascript
// Module Federation設定
module.exports = {
  mode: 'development',
  devServer: {
    port: 3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'questionDisplay',
      filename: 'remoteEntry.js',
      exposes: {
        './QuestionFlow': './src/components/VirtualQuestionFlow',
        './QuestionElement': './src/components/HaqeiQuestionElement',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

### 12.2 PWA対応

```javascript
// Service Worker
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/questions')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

## 13. 結論

本アーキテクチャ設計書は、HAQEIアナライザーの質問表示システムを高性能・高品質・高保守性を実現するための包括的な設計指針を提供します。

### 主要な改善点
1. **偶数番設問表示問題の根本解決**
2. **Netflix品質の仮想スクロール実装**
3. **bunenjin哲学統合エラーハンドリング**
4. **高性能キャッシング機能**
5. **レスポンシブ・アクセシブル設計**

### 期待される効果
- **パフォーマンス**: 60fps維持、50ms以下のレンダリング
- **ユーザビリティ**: 直感的なインターフェース、高い回答完了率
- **保守性**: モジュラー設計、明確な責任分離
- **拡張性**: 将来的な機能追加への対応力

この設計書に基づいて実装を進めることで、世界最高水準の質問表示システムを実現できます。