# HAQEI フロントエンドデベロッパーエージェント

**作成日**: 2025年7月30日  
**バージョン**: 1.0.0

## 概要

HAQEIプロジェクト専門のフロントエンドデベロッパーエージェント。Triple OS哲学と易経の世界観に基づいた高品質なUI/UX開発を支援します。

## 🎯 主な機能

### 1. Triple OS哲学に基づくUI設計
- **Engine OS**: 価値観・本質重視の深い設計
- **Interface OS**: 実用性・使いやすさ重視の設計  
- **Safe Mode OS**: 安全性・信頼性重視の設計

### 2. 易経的ビジュアルデザイン
- 8卦に基づく配色システム (乾・坤・震・坎・艮・巽・離・兌)
- 陰陽思想を反映したレイアウト
- 五行思想による調和のとれたインタラクション

### 3. アクセシビリティ重視開発
- WCAG 2.1 AA準拠
- スクリーンリーダー完全対応
- キーボードナビゲーション最適化
- 色彩コントラスト4.5:1以上

### 4. パフォーマンス最適化
- Core Web Vitals対応 (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- バンドルサイズ最適化 (< 100KB per feature)
- Critical CSS抽出
- レイジーローディング実装

## 🚀 使用方法

### 基本使用例

```javascript
import HAQEIFrontendDeveloper from './haqei-frontend-developer.js';

const frontendDev = new HAQEIFrontendDeveloper();

// UI/UX設計分析
const analysis = frontendDev.analyzeUIUXRequirements('analysis-flow', {
    device: 'mobile',
    context: 'first-time-user'
});

// コンポーネント設計
const componentSpec = frontendDev.designComponent('AnalysisCard', {
    accessibility: 'high',
    responsive: true
});

// アクセシビリティ監査
const a11yAudit = frontendDev.auditAccessibility('ResultsDisplay');

// パフォーマンス最適化
const perfOptimization = frontendDev.optimizePerformance('dashboard');
```

### CLI使用例

```bash
# UI/UX設計分析
node cli.js frontend -f "分析画面" -t uiux --device mobile

# コンポーネント設計
node cli.js frontend -t component --component "AnalysisCard"

# アクセシビリティ監査
node cli.js frontend -t audit --component "ResultsDisplay"

# パフォーマンス最適化
node cli.js frontend -t performance -f "ダッシュボード"

# デザインシステム生成
node cli.js designsystem

# 統合テスト実行
node cli.js test --frontend
```

### 専用CLIツール使用例

```bash
# UI/UX設計分析
node frontend-cli.js uiuxdesign analysis-flow

# コンポーネント設計
node frontend-cli.js component AnalysisProgressCard

# アクセシビリティ監査
node frontend-cli.js audit ResultsDisplay

# パフォーマンス最適化
node frontend-cli.js optimize dashboard

# レスポンシブ最適化
node frontend-cli.js responsive

# デザインシステム構築
node frontend-cli.js designsystem

# 品質レポート生成
node frontend-cli.js quality haqei-analyzer
```

## 📊 出力レポート

全ての分析結果は `./docs/reports/` に自動保存されます：

### レポート形式
- **UI/UX分析レポート**: `YYYYMMDD_UIUX_[機能名]_設計分析レポート.md`
- **コンポーネント仕様書**: `YYYYMMDD_COMPONENT_[コンポーネント名]_設計仕様書.md`
- **A11y監査レポート**: `YYYYMMDD_A11Y_[コンポーネント名]_監査レポート.md`
- **パフォーマンスレポート**: `YYYYMMDD_PERF_[機能名]_最適化レポート.md`

### 設計ドキュメント
- **デザインシステム**: `./docs/development/YYYYMMDD_DESIGN_SYSTEM_HAQEIデザインシステム.json`
- **実装推奨事項**: `./docs/implementation/YYYYMMDD_FRONTEND_実装推奨事項.json`

## 🎨 設計システム

### カラーパレット（易経8卦対応）
```css
:root {
  /* 8卦ベースカラー */
  --haqei-heaven: #1E40AF;  /* 乾 - 深い青 */
  --haqei-earth: #92400E;   /* 坤 - 茶色 */
  --haqei-thunder: #DC2626; /* 震 - 赤 */
  --haqei-water: #1E3A8A;   /* 坎 - 濃い青 */
  --haqei-mountain: #374151;/* 艮 - グレー */
  --haqei-wind: #059669;    /* 巽 - 緑 */
  --haqei-fire: #EA580C;    /* 離 - オレンジ */
  --haqei-lake: #7C3AED;    /* 兌 - 紫 */
}
```

### タイポグラフィ
```css
:root {
  --font-primary: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
  --font-secondary: 'Noto Serif JP', 'Hiragino Mincho Pro', serif;
  
  /* Type Scale */
  --text-xs: 0.75rem;
  --text-4xl: 2.25rem;
}
```

### スペーシング
```css
:root {
  --spacing-unit: 0.25rem; /* 4px基準 */
  --spacing-1: calc(var(--spacing-unit) * 1);
  --spacing-64: calc(var(--spacing-unit) * 64);
}
```

## 🧩 コンポーネント階層

### Atomic Design採用
- **Atoms**: Button, Input, Icon, Typography
- **Molecules**: Card, Form Field, Navigation Item
- **Organisms**: Header, Footer, Form, Analysis Display
- **Templates**: Page Layout, Analysis Flow, Results Layout

### BEM方法論
```css
.haqei-component {}
.haqei-component__element {}
.haqei-component--modifier {}
```

## ♿ アクセシビリティ標準

### WCAG 2.1 AA準拠
- **色彩コントラスト**: 4.5:1以上
- **キーボード操作**: 全機能対応
- **スクリーンリーダー**: 完全対応
- **拡大**: 200%まで対応

### ARIA実装
```html
<div 
  role="button" 
  aria-label="分析を開始" 
  aria-describedby="analysis-help"
  tabindex="0">
  分析開始
</div>
```

## ⚡ パフォーマンス基準

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ミリ秒  
- **CLS (Cumulative Layout Shift)**: < 0.1

### バンドル最適化
- **機能別バンドル**: < 100KB
- **Critical CSS**: < 20KB
- **画像最適化**: WebP形式、レスポンシブ画像

## 📱 レスポンシブ設計

### ブレークポイント
```css
/* Mobile First */
.component { /* base styles */ }

@media (min-width: 640px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### タッチターゲット
- **最小サイズ**: 44px x 44px
- **間隔**: 8px以上

## 🔧 技術スタック

### コア技術
- **HTML5**: セマンティックマークアップ
- **CSS3**: Custom Properties、Grid、Flexbox
- **JavaScript**: ES6+ Vanilla JavaScript

### 開発ツール
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Stylelint
- **Build**: ES Modules + Dynamic Imports
- **A11y**: axe-core

## 📈 品質指標

### 測定項目
- **Performance**: Lighthouse スコア 90+
- **Accessibility**: axe-core 100% パス
- **Code Quality**: ESLint エラー 0件
- **Bundle Size**: 予算内
- **Load Time**: TTI < 3.5秒

## 🎯 使用シナリオ

### 1. 新機能UI設計時
```bash
node frontend-cli.js uiuxdesign new-feature
node frontend-cli.js component NewFeatureCard
```

### 2. 既存機能改善時
```bash
node frontend-cli.js audit ExistingComponent
node frontend-cli.js optimize existing-feature
```

### 3. 品質チェック時
```bash
node frontend-cli.js quality haqei-analyzer
node cli.js test --frontend
```

### 4. デザインシステム更新時
```bash
node frontend-cli.js designsystem
node frontend-cli.js responsive
```

## 📚 参考資料

### 外部ドキュメント
- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Components](https://developer.mozilla.org/ja/docs/Web/Web_Components)
- [Core Web Vitals](https://web.dev/vitals/)

### プロジェクト内ドキュメント
- `docs/development/BUNENJIN_STRATEGY_NAVIGATOR_DESIGN.md`
- `docs/reports/INTEGRATED_BUSINESS_OVERVIEW.md`
- `docs/development/AGENT_DOCUMENTATION_INSTRUCTIONS.md`

---

**このフロントエンドデベロッパーエージェントは、HAQEIプロジェクトの哲学と技術要件に特化して設計されており、一貫性のある高品質なユーザーインターフェースの構築を支援します。**

*作成者: HAQEI開発チーム*  
*最終更新: 2025年7月30日*