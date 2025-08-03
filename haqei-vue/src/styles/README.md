# HAQEI スタイルシステム

## 概要

HAQEIプロジェクトでは、Tailwind CSSからカスタムCSSシステムへ移行し、より柔軟で保守性の高いスタイル管理を実現しています。

## ファイル構成

```
src/styles/
├── variables.css    # デザイントークン定義
├── base.css        # リセット・ベーススタイル
├── theme.css       # テーマ定義・コンポーネント拡張
└── README.md       # このファイル
```

## デザイントークン

### 色

```css
/* プライマリカラー */
--primary-color: #4a90e2;
--primary-hover: #357abd;
--primary-active: #2968a3;

/* Triple OS カラー */
--engine-os-color: #e74c3c;    /* 価値観システム */
--interface-os-color: #3498db;  /* 社会的システム */
--safemode-os-color: #2ecc71;  /* 防御システム */

/* 易経インスパイアカラー */
--yin-color: #1a237e;           /* 陰 */
--yang-color: #ff6f00;          /* 陽 */
--balance-color: #4a90e2;       /* バランス */
```

### スペーシング

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
```

### タイポグラフィ

```css
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

## テーマ適用方法

### コンポーネントでの使用

```vue
<template>
  <div class="my-component">
    <h1 class="title">タイトル</h1>
    <p class="description">説明文</p>
  </div>
</template>

<style scoped>
.my-component {
  padding: var(--space-4);
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
}

.title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.description {
  font-size: var(--text-base);
  color: var(--text-secondary);
}
</style>
```

### Triple OSテーマの使用

```vue
<template>
  <div class="analysis-card" :class="`analysis-card--${osType}`">
    <!-- コンテンツ -->
  </div>
</template>

<style scoped>
.analysis-card--engine {
  border-color: var(--engine-os-color);
}

.analysis-card--interface {
  border-color: var(--interface-os-color);
}

.analysis-card--safemode {
  border-color: var(--safemode-os-color);
}
</style>
```

## ユーティリティクラス

### テキストカラー
- `.text-engine` - Engine OSカラー
- `.text-interface` - Interface OSカラー
- `.text-safemode` - SafeMode OSカラー

### 背景カラー
- `.bg-engine` - Engine OS背景色
- `.bg-interface` - Interface OS背景色
- `.bg-safemode` - SafeMode OS背景色

### アニメーション
- `.fade-in` - フェードインアニメーション
- `.slide-in-up` - 下からスライドイン
- `.pulse` - パルスアニメーション
- `.skeleton` - スケルトンローディング

## レスポンシブデザイン

### ブレークポイント

```css
--screen-sm: 640px;   /* モバイル */
--screen-md: 768px;   /* タブレット */
--screen-lg: 1024px;  /* デスクトップ */
--screen-xl: 1280px;  /* ワイドスクリーン */
```

### 使用例

```css
/* モバイルファースト */
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}
```

## ダークモード対応

CSS変数を使用しているため、ダークモードの実装が容易です：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #f0f0f0;
    --text-secondary: #b0b0b0;
  }
}
```

## ベストプラクティス

1. **CSS変数の活用**: ハードコードされた値の代わりに必ずCSS変数を使用
2. **セマンティックな命名**: 色の名前ではなく、用途に基づいた変数名を使用
3. **スコープの活用**: グローバルスタイルは最小限に、コンポーネントスコープを活用
4. **パフォーマンス**: 不要なアニメーションを避け、`will-change`を適切に使用

## 移行ガイド

### Tailwindからの移行

```vue
<!-- Before (Tailwind) -->
<div class="p-4 bg-gray-100 rounded-lg">

<!-- After (Custom CSS) -->
<div class="card">

<style scoped>
.card {
  padding: var(--space-4);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
}
</style>
```

これにより、より意味のあるクラス名と保守性の高いスタイルを実現できます。