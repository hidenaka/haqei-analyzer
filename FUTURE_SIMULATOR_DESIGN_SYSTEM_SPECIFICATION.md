# Future Simulator デザインシステム仕様書
## Phase 2 UI/UXデザイン設計

**作成日**: 2025年8月6日  
**バージョン**: 1.0  
**対象**: Future Simulator モダンUI実装

---

## 1. デザインシステム概要

### 1.1 設計原則
- **調和 (Harmony)**: 東洋哲学の美的バランス
- **明瞭 (Clarity)**: 情報階層の明確な表現
- **信頼 (Trust)**: エンタープライズグレードの品質感
- **アクセシブル (Accessible)**: 万人が使える包括設計

### 1.2 HaQei哲学との整合
- **自然な流れ**: ユーザーの思考プロセスに沿った画面遷移
- **バランス**: 陰陽のバランスを視覚的に表現
- **シンプリシティ**: 本質的な要素のみを残した洗練
- **深さ**: 表面的な美しさを超えた本質的価値の表現

---

## 2. カラーシステム設計

### 2.1 ブランドカラーパレット

#### メインカラー
```css
:root {
  /* プライマリ: 深い藍（智慧・深層） */
  --haqei-primary-50: #eff6ff;
  --haqei-primary-100: #dbeafe;
  --haqei-primary-200: #bfdbfe;
  --haqei-primary-300: #93c5fd;
  --haqei-primary-400: #60a5fa;
  --haqei-primary-500: #3b82f6;  /* ベース */
  --haqei-primary-600: #2563eb;
  --haqei-primary-700: #1d4ed8;  /* メイン使用 */
  --haqei-primary-800: #1e40af;
  --haqei-primary-900: #1e3a8a;

  /* セカンダリ: 温かい金（太陽・創造） */
  --haqei-secondary-50: #fffbeb;
  --haqei-secondary-100: #fef3c7;
  --haqei-secondary-200: #fde68a;
  --haqei-secondary-300: #fcd34d;
  --haqei-secondary-400: #fbbf24;
  --haqei-secondary-500: #f59e0b;  /* ベース */
  --haqei-secondary-600: #d97706;  /* メイン使用 */
  --haqei-secondary-700: #b45309;
  --haqei-secondary-800: #92400e;
  --haqei-secondary-900: #78350f;

  /* アクセント: 神秘的紫（直感・洞察） */
  --haqei-accent-50: #f5f3ff;
  --haqei-accent-100: #ede9fe;
  --haqei-accent-200: #ddd6fe;
  --haqei-accent-300: #c4b5fd;
  --haqei-accent-400: #a78bfa;
  --haqei-accent-500: #8b5cf6;
  --haqei-accent-600: #7c3aed;    /* メイン使用 */
  --haqei-accent-700: #6d28d9;
  --haqei-accent-800: #5b21b6;
  --haqei-accent-900: #4c1d95;
}
```

#### グレースケール（温かみのある）
```css
:root {
  /* ウォームグレー */
  --haqei-gray-50: #fafaf9;   /* ベース背景 */
  --haqei-gray-100: #f5f5f4;  /* カード背景 */
  --haqei-gray-200: #e7e5e4;  /* ボーダー */
  --haqei-gray-300: #d6d3d1;  /* 非アクティブ */
  --haqei-gray-400: #a8a29e;  /* プレースホルダー */
  --haqei-gray-500: #78716c;  /* セカンダリテキスト */
  --haqei-gray-600: #57534e;  /* メインテキスト */
  --haqei-gray-700: #44403c;  /* ヘッダー */
  --haqei-gray-800: #292524;  /* ナビゲーション */
  --haqei-gray-900: #1c1917;  /* 強調テキスト */
}
```

#### セマンティックカラー
```css
:root {
  /* ステータスカラー */
  --success: #10b981;    /* 成功・完了 */
  --success-light: #d1fae5;
  --warning: #f59e0b;    /* 注意・待機 */
  --warning-light: #fef3c7;
  --error: #ef4444;      /* エラー・危険 */
  --error-light: #fee2e2;
  --info: #3b82f6;       /* 情報・中立 */
  --info-light: #dbeafe;
}
```

### 2.2 使用ガイドライン

#### 背景システム
```css
:root {
  /* ページ背景 */
  --bg-primary: var(--haqei-gray-50);     /* メイン背景 */
  --bg-secondary: var(--haqei-gray-100); /* セクション背景 */
  --bg-tertiary: var(--haqei-gray-200);  /* サブセクション */
  
  /* コンポーネント背景 */
  --bg-card: #ffffff;                     /* カード */
  --bg-card-hover: var(--haqei-gray-50); /* ホバー時 */
  --bg-input: #ffffff;                    /* 入力フィールド */
  --bg-nav: var(--haqei-gray-800);       /* ナビゲーション */
}
```

#### テキストカラー
```css
:root {
  /* テキストヒエラルキー */
  --text-primary: var(--haqei-gray-900);   /* メインテキスト */
  --text-secondary: var(--haqei-gray-600); /* サブテキスト */
  --text-tertiary: var(--haqei-gray-500);  /* 補助情報 */
  --text-placeholder: var(--haqei-gray-400); /* プレースホルダー */
  --text-inverse: #ffffff;                 /* 反転（ダーク背景用）*/
  
  /* リンク・アクション */
  --text-link: var(--haqei-primary-700);   /* リンク */
  --text-link-hover: var(--haqei-primary-800); /* ホバー時 */
}
```

---

## 3. タイポグラフィシステム

### 3.1 フォントファミリー
```css
:root {
  /* メインフォント（優先度順） */
  --font-primary: 'Inter', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 
                  'Yu Gothic UI', 'Meiryo', sans-serif;
  
  /* 数字・コード用フォント */
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Consolas', monospace;
  
  /* 装飾フォント（易経シンボルなど） */
  --font-decorative: 'Noto Sans JP', 'Yu Mincho', serif;
}
```

### 3.2 タイポグラフィスケール
```css
:root {
  /* フォントサイズ（Perfect Fourth: 1.333スケール） */
  --text-xs: 0.75rem;      /* 12px - キャプション */
  --text-sm: 0.875rem;     /* 14px - 小テキスト */
  --text-base: 1rem;       /* 16px - ベース */
  --text-lg: 1.125rem;     /* 18px - 大テキスト */
  --text-xl: 1.25rem;      /* 20px - 小見出し */
  --text-2xl: 1.5rem;      /* 24px - 見出し */
  --text-3xl: 2rem;        /* 32px - 大見出し */
  --text-4xl: 2.5rem;      /* 40px - タイトル */
  --text-5xl: 3rem;        /* 48px - ヒーロー */
  
  /* 行間 */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* 文字間隔 */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

### 3.3 タイポグラフィクラス
```css
/* 見出しシステム */
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

.heading-3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--text-primary);
}

/* 本文テキスト */
.text-body {
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

.text-body-large {
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

/* 補助テキスト */
.text-caption {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.text-small {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* ブランドテキスト */
.brand-text {
  background: linear-gradient(135deg, 
    var(--haqei-primary-600), 
    var(--haqei-accent-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}
```

---

## 4. スペーシングシステム

### 4.1 スペーススケール
```css
:root {
  /* スペーシング（8px base unit） */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### 4.2 コンポーネント間隔
```css
:root {
  /* セクション間隔 */
  --section-gap-sm: var(--space-12);   /* 48px */
  --section-gap-md: var(--space-16);   /* 64px */
  --section-gap-lg: var(--space-24);   /* 96px */
  
  /* カード内余白 */
  --card-padding-sm: var(--space-4);   /* 16px */
  --card-padding-md: var(--space-6);   /* 24px */
  --card-padding-lg: var(--space-8);   /* 32px */
  
  /* ボタン内余白 */
  --button-padding-sm: var(--space-2) var(--space-4);   /* 8px 16px */
  --button-padding-md: var(--space-3) var(--space-6);   /* 12px 24px */
  --button-padding-lg: var(--space-4) var(--space-8);   /* 16px 32px */
}
```

---

## 5. レイアウトシステム

### 5.1 レスポンシブブレークポイント
```css
:root {
  /* モバイルファースト ブレークポイント */
  --bp-sm: 640px;    /* スマートフォン（大） */
  --bp-md: 768px;    /* タブレット（小） */
  --bp-lg: 1024px;   /* タブレット（大）/ノートPC */
  --bp-xl: 1280px;   /* デスクトップ */
  --bp-2xl: 1536px;  /* 大型デスクトップ */
}
```

### 5.2 コンテナシステム
```css
/* ベースコンテナ */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

/* レスポンシブ最大幅 */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { 
    max-width: 768px;
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container { 
    max-width: 1024px;
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

### 5.3 グリッドシステム
```css
/* Flexbox ベース グリッド */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.grid-cols-1 { --columns: 1; }
.grid-cols-2 { --columns: 2; }
.grid-cols-3 { --columns: 3; }
.grid-cols-4 { --columns: 4; }

.grid > * {
  flex: 1 1 calc(100% / var(--columns) - var(--space-4) * (var(--columns) - 1) / var(--columns));
}

/* CSS Grid ベース（複雑なレイアウト用） */
.css-grid {
  display: grid;
  gap: var(--space-4);
}

.css-grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/* レスポンシブグリッド */
@media (min-width: 768px) {
  .md\:grid-cols-2 { --columns: 2; }
  .md\:grid-cols-3 { --columns: 3; }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { --columns: 3; }
  .lg\:grid-cols-4 { --columns: 4; }
}
```

---

## 6. コンポーネントライブラリ

### 6.1 カードコンポーネント
```css
/* ベースカード */
.card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--haqei-gray-200);
  padding: var(--card-padding-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
              0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.card:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 
              0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  border-color: var(--haqei-primary-300);
}

/* カードバリエーション */
.card-elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 
              0 10px 15px rgba(0, 0, 0, 0.06);
}

.card-bordered {
  border: 2px solid var(--haqei-primary-200);
}

.card-accent {
  border-left: 4px solid var(--haqei-accent-500);
}

/* 特別なカード（易経結果表示用） */
.hexagram-card {
  background: linear-gradient(135deg, 
    rgba(123, 58, 237, 0.05), 
    rgba(59, 130, 246, 0.05));
  border: 1px solid var(--haqei-accent-200);
  position: relative;
}

.hexagram-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    var(--haqei-primary-500), 
    var(--haqei-accent-500));
  border-radius: 12px 12px 0 0;
}
```

### 6.2 ボタンコンポーネント
```css
/* ベースボタン */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--button-padding-md);
  border: none;
  border-radius: 8px;
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* プライマリボタン */
.btn-primary {
  background: var(--haqei-primary-600);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--haqei-primary-700);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(29, 78, 216, 0.4);
}

/* セカンダリボタン */
.btn-secondary {
  background: white;
  color: var(--haqei-primary-600);
  border: 1px solid var(--haqei-primary-300);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--haqei-primary-50);
  border-color: var(--haqei-primary-400);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

/* アクセントボタン */
.btn-accent {
  background: linear-gradient(135deg, 
    var(--haqei-accent-500), 
    var(--haqei-accent-600));
  color: white;
}

.btn-accent:hover:not(:disabled) {
  background: linear-gradient(135deg, 
    var(--haqei-accent-600), 
    var(--haqei-accent-700));
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

/* サイズバリエーション */
.btn-sm {
  padding: var(--button-padding-sm);
  font-size: var(--text-sm);
}

.btn-lg {
  padding: var(--button-padding-lg);
  font-size: var(--text-lg);
}

/* アイコンボタン */
.btn-icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border-radius: 50%;
}
```

### 6.3 フォーム要素
```css
/* 入力フィールド */
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--haqei-gray-300);
  border-radius: 8px;
  background: var(--bg-input);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--haqei-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--text-placeholder);
}

/* テキストエリア */
.textarea {
  resize: vertical;
  min-height: 120px;
  line-height: var(--leading-relaxed);
}

/* セレクト */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right var(--space-3) center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* ラベル */
.label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

/* フィールドグループ */
.field-group {
  margin-bottom: var(--space-6);
}

.field-group .input:invalid {
  border-color: var(--error);
}

.field-group .error-message {
  color: var(--error);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}
```

---

## 7. アニメーション・トランジション

### 7.1 イージング関数
```css
:root {
  /* カスタムイージング */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-quart: cubic-bezier(0.5, 0, 0.75, 0);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  
  /* 標準イージング */
  --ease-linear: linear;
  --ease-in: ease-in;
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
}
```

### 7.2 トランジション
```css
/* 標準トランジション */
.transition {
  transition-property: color, background-color, border-color, 
                       text-decoration-color, fill, stroke, 
                       opacity, box-shadow, transform, filter, 
                       backdrop-filter;
  transition-timing-function: var(--ease-in-out);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: var(--ease-in-out);
  transition-duration: 150ms;
}

/* 持続時間 */
.duration-75 { transition-duration: 75ms; }
.duration-150 { transition-duration: 150ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }
```

### 7.3 キーフレームアニメーション
```css
/* フェードイン */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s var(--ease-out-quart) forwards;
}

/* スケールイン */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s var(--ease-out-quart) forwards;
}

/* シマー効果（ローディング用） */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    var(--haqei-gray-100) 25%,
    var(--haqei-gray-50) 50%,
    var(--haqei-gray-100) 75%
  );
  background-size: 200% 100%;
}

/* 回転（ローディングスピナー用） */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 7.4 リデュースモーション対応
```css
/* アクセシビリティ: モーション削減設定 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. 実装ガイドライン

### 8.1 CSS変数使用例
```html
<!-- カード使用例 -->
<div class="card hexagram-card">
  <h3 class="heading-3 brand-text">易経分析結果</h3>
  <p class="text-body">あなたの現在の状況は...</p>
  <button class="btn btn-primary btn-lg">詳細を見る</button>
</div>

<!-- フォーム使用例 -->
<div class="field-group">
  <label class="label" for="situation">現在の状況</label>
  <textarea class="input textarea" id="situation" 
            placeholder="詳しく教えてください..."></textarea>
</div>
```

### 8.2 レスポンシブ実装
```css
/* モバイルファースト アプローチ */
.hero-section {
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

@media (min-width: 768px) {
  .hero-section {
    padding: var(--space-16) var(--space-8);
    text-align: left;
  }
}

@media (min-width: 1024px) {
  .hero-section {
    padding: var(--space-24) var(--space-12);
  }
}
```

### 8.3 ダークモード対応準備
```css
/* 将来のダークモード対応 */
:root {
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    /* ダークモード用変数定義 */
    --bg-primary: var(--haqei-gray-900);
    --bg-card: var(--haqei-gray-800);
    --text-primary: var(--haqei-gray-50);
  }
}
```

---

## 9. パフォーマンス最適化

### 9.1 CSS最適化
- **クリティカルCSS**: Above-the-fold コンテンツ用CSSを最優先
- **CSS分割**: コンポーネント別にファイル分割
- **未使用CSS削除**: PurgeCSS等でファイルサイズ削減

### 9.2 アニメーション最適化
- **GPU活用**: `transform` と `opacity` 使用を優先
- **will-change**: アニメーション前に適切に設定
- **レイヤー分離**: 重いアニメーションは別レイヤーで実行

---

## 10. アクセシビリティ配慮

### 10.1 カラーアクセシビリティ
- **コントラスト比**: 4.5:1以上（本文）、3:1以上（大テキスト）
- **カラーブラインド**: 色以外の情報伝達手段も併用
- **フォーカス表示**: 明確で一貫したフォーカスインジケーター

### 10.2 キーボードナビゲーション
```css
/* フォーカス管理 */
.focus-visible {
  outline: 3px solid var(--haqei-primary-400);
  outline-offset: 2px;
}

/* スキップリンク */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--haqei-primary-600);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
}

.skip-link:focus {
  top: 6px;
}
```

---

*このデザインシステム仕様書は、Future Simulator の全面的UI/UX改善のための実装ガイドラインです。HaQei哲学との調和を保ちながら、モダンで使いやすいインターフェースの実現を目指します。*