# Future Simulator UI/UX Design Specification v2.0

## 概要

本仕様書は、bunenjin（分人）哲学の「シンプルで美しい」設計理念に基づいたFuture Simulatorの包括的なUI/UXデザイン仕様を定義します。易経（I-Ching）の智慧と現代的なユーザビリティ原則を融合し、直感的で美的に優れたユーザーエクスペリエンスを実現します。

---

## 1. デザイン原則とコンセプト

### 1.1 bunenjin哲学の具現化

#### 核心原則
- **一（Ichi）**: 本質的な美しさへの還元
- **簡（Kan）**: 不要な装飾を排した機能美
- **和（Wa）**: 調和のとれたバランス
- **静（Sei）**: 内面的な静寂と深み

#### デザイン指針
```
1. ミニマリストアプローチ
   - 必要最小限の要素で最大の効果
   - 空白の美学（余白の活用）
   - 視覚的ノイズの排除

2. 自然な流れ
   - ユーザーの思考プロセスに沿った設計
   - 直感的なナビゲーション
   - 段階的な情報開示

3. 感情的共鳴
   - 色彩の心理効果を活用
   - 八卦エネルギーとの調和
   - 使用者の内面状態への配慮
```

### 1.2 易経統合コンセプト

#### 八卦カラーシステム
- **乾（天）**: 金色 - リーダーシップ、創造性
- **兌（沢）**: 空色 - コミュニケーション、喜び  
- **離（火）**: 赤色 - エネルギー、情熱
- **震（雷）**: 紫色 - 行動力、変革
- **巽（風）**: 緑色 - 柔軟性、適応
- **坎（水）**: 青色 - 直感、深い洞察
- **艮（山）**: 灰色 - 安定性、持続
- **坤（地）**: 茶色 - 包容力、実行力

#### 陰陽バランス
```css
/* 陰陽調和の基本構造 */
.yin-yang-balance {
  light-elements: 60%; /* 陽 - アクティブ要素 */
  dark-elements: 40%;  /* 陰 - 落ち着いた要素 */
  interaction-ratio: 1.618; /* 黄金比による調和 */
}
```

---

## 2. カラーシステム仕様

### 2.1 基本カラーパレット

#### プライマリーカラー
```css
:root {
  /* 基調色 - 深い藍色（易経の智慧を象徴） */
  --primary-50: #f8fafc;   /* 極薄 */
  --primary-100: #f1f5f9;  /* 薄 */
  --primary-200: #e2e8f0;  /* 中薄 */
  --primary-300: #cbd5e1;  /* 中 */
  --primary-400: #94a3b8;  /* やや濃 */
  --primary-500: #64748b;  /* 基調 */
  --primary-600: #475569;  /* 濃 */
  --primary-700: #334155;  /* より濃 */
  --primary-800: #1e293b;  /* 暗 */
  --primary-900: #0f172a;  /* 極暗 */

  /* アクセントカラー - 紫青（直感と洞察を表現） */
  --accent-400: #8b5cf6;   /* ライト */
  --accent-500: #6366f1;   /* ベース */
  --accent-600: #4f46e5;   /* ダーク */
}
```

#### セマンティックカラー
```css
:root {
  /* 成功・調和 */
  --success-light: #d1fae5;
  --success-base: #10b981;
  --success-dark: #047857;

  /* 警告・注意 */
  --warning-light: #fef3c7;
  --warning-base: #f59e0b;
  --warning-dark: #b45309;

  /* エラー・危険 */
  --error-light: #fee2e2;
  --error-base: #ef4444;
  --error-dark: #b91c1c;

  /* 情報・中立 */
  --info-light: #dbeafe;
  --info-base: #3b82f6;
  --info-dark: #1d4ed8;
}
```

### 2.2 八卦統合カラーシステム

#### 完全なトライグラムカラー定義
```css
:root {
  /* 八卦色彩システム - 心理効果付き */
  --trigram-qian: #FFD700;      /* 乾(天) - 権威と創造 */
  --trigram-qian-light: #FFF8DC;
  --trigram-qian-dark: #B8860B;
  --trigram-qian-energy: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
  
  --trigram-dui: #87CEEB;       /* 兌(沢) - 喜びとコミュニケーション */
  --trigram-dui-light: #F0F8FF;
  --trigram-dui-dark: #4682B4;
  --trigram-dui-energy: radial-gradient(circle, #87CEEB 0%, #5F9EA0 100%);
  
  --trigram-li: #FF4500;        /* 離(火) - 情熱と明晰性 */
  --trigram-li-light: #FFE4E1;
  --trigram-li-dark: #DC143C;
  --trigram-li-energy: radial-gradient(circle, #FF4500 0%, #FF6347 100%);
  
  --trigram-zhen: #8A2BE2;      /* 震(雷) - 行動と変革 */
  --trigram-zhen-light: #E6E6FA;
  --trigram-zhen-dark: #4B0082;
  --trigram-zhen-energy: radial-gradient(circle, #8A2BE2 0%, #9370DB 100%);
  
  --trigram-xun: #32CD32;       /* 巽(風) - 柔軟性と浸透 */
  --trigram-xun-light: #F0FFF0;
  --trigram-xun-dark: #228B22;
  --trigram-xun-energy: radial-gradient(circle, #32CD32 0%, #90EE90 100%);
  
  --trigram-kan: #1E90FF;       /* 坎(水) - 深い洞察 */
  --trigram-kan-light: #F0F8FF;
  --trigram-kan-dark: #0000CD;
  --trigram-kan-energy: radial-gradient(circle, #1E90FF 0%, #4169E1 100%);
  
  --trigram-gen: #708090;       /* 艮(山) - 安定と持続 */
  --trigram-gen-light: #F8F8FF;
  --trigram-gen-dark: #2F4F4F;
  --trigram-gen-energy: radial-gradient(circle, #708090 0%, #696969 100%);
  
  --trigram-kun: #8B4513;       /* 坤(地) - 包容と支援 */
  --trigram-kun-light: #F5F5DC;
  --trigram-kun-dark: #A0522D;
  --trigram-kun-energy: radial-gradient(circle, #8B4513 0%, #CD853F 100%);
}
```

### 2.3 アダプティブテーマシステム

#### 自動環境適応
```css
/* 時間帯による自動テーマ変更 */
@media (prefers-color-scheme: light) {
  :root {
    --background-primary: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    --text-primary: var(--primary-900);
    --shadow-intensity: 0.1;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --background-primary: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    --text-primary: var(--primary-100);
    --shadow-intensity: 0.3;
  }
}

/* 季節テーマ（時刻ベース自動切り替え） */
@media (min-time: "06:00") and (max-time: "09:00") {
  :root { --seasonal-accent: var(--trigram-li); /* 朝の火エネルギー */ }
}

@media (min-time: "09:00") and (max-time: "15:00") {
  :root { --seasonal-accent: var(--trigram-qian); /* 日中の天エネルギー */ }
}

@media (min-time: "15:00") and (max-time: "18:00") {
  :root { --seasonal-accent: var(--trigram-kun); /* 夕方の地エネルギー */ }
}

@media (min-time: "18:00") and (max-time: "06:00") {
  :root { --seasonal-accent: var(--trigram-kan); /* 夜の水エネルギー */ }
}
```

---

## 3. タイポグラフィシステム

### 3.1 フォントファミリー

#### 日英混合最適化フォントスタック
```css
:root {
  /* プライマリフォント - 可読性重視 */
  --font-primary: 
    "Noto Sans JP", 
    "Hiragino Sans", 
    "Yu Gothic Medium", 
    "Meiryo", 
    "Inter", 
    -apple-system, 
    BlinkMacSystemFont, 
    sans-serif;
  
  /* セカンダリフォント - 数値・コード用 */
  --font-mono: 
    "SF Mono", 
    "Monaco", 
    "Inconsolata", 
    "Roboto Mono", 
    "Noto Sans Mono", 
    monospace;
  
  /* 見出し用フォント - 印象的な表現 */
  --font-heading: 
    "Noto Serif JP", 
    "Yu Mincho", 
    "Times New Roman", 
    serif;
}
```

### 3.2 タイポグラフィスケール

#### モジュラースケール（1.250比率）
```css
:root {
  --font-size-xs: 0.64rem;    /* 10.24px */
  --font-size-sm: 0.8rem;     /* 12.8px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-md: 1.25rem;    /* 20px */
  --font-size-lg: 1.563rem;   /* 25px */
  --font-size-xl: 1.953rem;   /* 31.25px */
  --font-size-2xl: 2.441rem;  /* 39.06px */
  --font-size-3xl: 3.052rem;  /* 48.83px */
  --font-size-4xl: 3.815rem;  /* 61.04px */
  
  /* 行間比率 */
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
  
  /* 文字間隔 */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-base: 0;
  --letter-spacing-wide: 0.025em;
}
```

### 3.3 テキストヒエラルキー

#### 意味的階層構造
```css
/* H1 - ページタイトル */
.text-display-1 {
  font-family: var(--font-heading);
  font-size: var(--font-size-4xl);
  font-weight: 300;
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--primary-900);
}

/* H2 - セクション見出し */
.text-display-2 {
  font-family: var(--font-heading);
  font-size: var(--font-size-3xl);
  font-weight: 400;
  line-height: var(--line-height-tight);
  color: var(--primary-800);
}

/* H3 - サブセクション */
.text-display-3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  font-weight: 600;
  line-height: var(--line-height-base);
  color: var(--primary-700);
}

/* H4 - カード見出し */
.text-heading {
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: var(--line-height-base);
  color: var(--primary-700);
}

/* 本文 */
.text-body {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: var(--line-height-relaxed);
  color: var(--primary-600);
}

/* キャプション・補助テキスト */
.text-caption {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: 400;
  line-height: var(--line-height-base);
  color: var(--primary-500);
}
```

---

## 4. レイアウトグリッドシステム

### 4.1 レスポンシブグリッド

#### ブレイクポイント定義
```css
:root {
  /* ブレイクポイント */
  --breakpoint-xs: 320px;   /* 小型スマートフォン */
  --breakpoint-sm: 640px;   /* スマートフォン */
  --breakpoint-md: 768px;   /* タブレット（縦） */
  --breakpoint-lg: 1024px;  /* タブレット（横）・小型ノートPC */
  --breakpoint-xl: 1280px;  /* デスクトップ */
  --breakpoint-2xl: 1536px; /* 大型ディスプレイ */
  
  /* コンテナ最大幅 */
  --container-xs: 100%;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;
}
```

#### フレキシブルグリッドシステム
```css
/* メインコンテナ */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; padding: 0 1.5rem; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; padding: 0 2.5rem; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; padding: 0 3rem; }
}

/* フレキシブルグリッド */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* レスポンシブグリッド */
@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\:grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
}
```

### 4.2 スペーシングシステム

#### 8pxベースシステム（黄金比調整）
```css
:root {
  /* ベーススペーシング（8px） */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  
  /* 特別なスペーシング（黄金比） */
  --space-golden-sm: 0.618rem;  /* 約10px */
  --space-golden-md: 1.618rem;  /* 約26px */
  --space-golden-lg: 2.618rem;  /* 約42px */
  --space-golden-xl: 4.236rem;  /* 約68px */
}
```

---

## 5. コンポーネント仕様

### 5.1 基本コンポーネント

#### ボタンシステム
```css
/* ベースボタン */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  padding: var(--space-3) var(--space-6);
  border: 2px solid transparent;
  border-radius: 12px;
  
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* アクセシビリティ */
  outline: none;
  position: relative;
  
  /* タッチデバイス対応 */
  min-height: 44px;
  touch-action: manipulation;
}

/* プライマリボタン */
.btn-primary {
  background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--accent-400) 0%, var(--accent-500) 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* セカンダリボタン */
.btn-secondary {
  background: var(--primary-50);
  color: var(--primary-700);
  border-color: var(--primary-200);
}

.btn-secondary:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  transform: translateY(-1px);
}

/* 八卦ボタンバリエーション */
.btn-trigram {
  position: relative;
  overflow: hidden;
}

.btn-trigram::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.btn-trigram:hover::before {
  left: 100%;
}

/* 各八卦色でのボタン */
.btn-qian { background: var(--trigram-qian-energy); color: #1a1a1a; }
.btn-dui { background: var(--trigram-dui-energy); color: #1a1a1a; }
.btn-li { background: var(--trigram-li-energy); color: white; }
.btn-zhen { background: var(--trigram-zhen-energy); color: white; }
.btn-xun { background: var(--trigram-xun-energy); color: #1a1a1a; }
.btn-kan { background: var(--trigram-kan-energy); color: white; }
.btn-gen { background: var(--trigram-gen-energy); color: white; }
.btn-kun { background: var(--trigram-kun-energy); color: white; }
```

#### カードシステム
```css
/* ベースカード */
.card {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  /* インタラクション対応 */
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-300);
}

.card:active {
  transform: translateY(-2px);
}

/* カード内要素 */
.card-header {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--primary-200);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-900);
  margin-bottom: var(--space-2);
}

.card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--primary-600);
  font-weight: 500;
}

.card-body {
  margin-bottom: var(--space-4);
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--primary-200);
}

/* 特殊カード */
.card-scenario {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  border: 2px solid var(--primary-200);
  min-height: 200px;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-scenario:hover {
  background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%);
  border-color: var(--accent-300);
}

.card-result {
  background: linear-gradient(135deg, var(--accent-50) 0%, var(--accent-100) 100%);
  border: 2px solid var(--accent-200);
}

.card-hexagram {
  position: relative;
  background: var(--primary-900);
  color: var(--primary-100);
  border: 1px solid var(--primary-700);
}

.card-hexagram::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--trigram-primary);
  opacity: 0.1;
  border-radius: 16px;
}
```

### 5.2 複合コンポーネント

#### ダイアログプレイヤー
```css
.dialogue-player {
  background: linear-gradient(135deg, var(--accent-600) 0%, var(--accent-800) 100%);
  border-radius: 24px;
  padding: var(--space-8);
  margin: var(--space-8) 0;
  
  position: relative;
  overflow: hidden;
  
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dialogue-player::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  pointer-events: none;
}

.player-header {
  text-align: center;
  margin-bottom: var(--space-8);
  position: relative;
  z-index: 1;
}

.player-title {
  color: white;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dialogue-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;
  
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dialogue-line {
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
}

/* OS別ダイアログスタイル */
.dialogue-line.engine-os {
  background: var(--trigram-li-energy);
  color: white;
  border-left: 4px solid var(--trigram-li-dark);
}

.dialogue-line.interface-os {
  background: var(--trigram-dui-energy);
  color: white;
  border-left: 4px solid var(--trigram-dui-dark);
}

.dialogue-line.safe-mode-os {
  background: var(--trigram-kan-energy);
  color: white;
  border-left: 4px solid var(--trigram-kan-dark);
}
```

---

## 6. インタラクション設計

### 6.1 マイクロインタラクション

#### ホバーエフェクト
```css
/* 統一されたホバーエフェクト */
.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.interactive-element:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 段階的なホバー効果 */
.gentle-hover:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.medium-hover:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.strong-hover:hover {
  transform: translateY(-5px) scale(1.08);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
}
```

#### クリック・タップエフェクト
```css
/* リップルエフェクト */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple-effect:active::before {
  width: 300px;
  height: 300px;
  animation: ripple 0.6s linear;
}

/* プレスダウンエフェクト */
.press-effect:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.1s ease;
}
```

### 6.2 フォーカス管理

#### アクセシブルフォーカス
```css
/* ベースフォーカススタイル */
.focus-visible {
  outline: 3px solid var(--accent-400);
  outline-offset: 2px;
  border-radius: 8px;
}

/* コンテキスト別フォーカス */
.btn:focus-visible {
  outline: 3px solid var(--accent-300);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.2);
}

.card:focus-visible {
  outline: 2px solid var(--accent-400);
  outline-offset: 4px;
  transform: translateY(-2px);
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--accent-500);
  outline-offset: 1px;
  border-color: var(--accent-400);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* 高コントラストモード対応 */
@media (prefers-contrast: high) {
  .focus-visible {
    outline-width: 4px;
    outline-color: currentColor;
    outline-offset: 4px;
  }
}
```

---

## 7. アニメーション仕様

### 7.1 基本アニメーション

#### イージング関数
```css
:root {
  /* カスタムイージング（bunenjin flow） */
  --ease-bunenjin: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-natural: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-gentle: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-energetic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* タイミング */
  --duration-instant: 0.1s;
  --duration-fast: 0.2s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-gentle: 0.8s;
}
```

#### ページトランジション
```css
/* フェードイン */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-natural);
}

/* スライドイン */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-up {
  animation: slideInUp var(--duration-slow) var(--ease-bunenjin);
}

/* ステガード（段階的）アニメーション */
.staggered-animation {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeIn var(--duration-normal) var(--ease-natural) forwards;
}

.staggered-animation:nth-child(1) { animation-delay: 0.1s; }
.staggered-animation:nth-child(2) { animation-delay: 0.2s; }
.staggered-animation:nth-child(3) { animation-delay: 0.3s; }
.staggered-animation:nth-child(4) { animation-delay: 0.4s; }
.staggered-animation:nth-child(5) { animation-delay: 0.5s; }
```

### 7.2 八卦エネルギーアニメーション

#### 八卦別アニメーション特性
```css
/* 乾（天）- 回転する金の輝き */
@keyframes qian-energy {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

.qian-animation {
  animation: qian-energy 3s ease-in-out infinite;
}

/* 震（雷）- 電撃のような振動 */
@keyframes zhen-energy {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-3px); }
  20% { transform: translateX(3px); }
  30% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  50% { transform: translateX(-1px); }
  60% { transform: translateX(1px); }
}

.zhen-animation {
  animation: zhen-energy 0.5s ease-in-out;
}

/* 坎（水）- 波のような流れ */
@keyframes kan-energy {
  0%, 100% { 
    transform: scaleY(1); 
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: scaleY(1.1); 
    filter: hue-rotate(10deg);
  }
  50% { 
    transform: scaleY(0.9); 
    filter: hue-rotate(-10deg);
  }
  75% { 
    transform: scaleY(1.05); 
    filter: hue-rotate(5deg);
  }
}

.kan-animation {
  animation: kan-energy 2s ease-in-out infinite;
}

/* 巽（風）- そよ風のような揺らぎ */
@keyframes xun-energy {
  0%, 100% { transform: rotate(0deg) skew(0deg); }
  25% { transform: rotate(1deg) skew(1deg); }
  50% { transform: rotate(-1deg) skew(-1deg); }
  75% { transform: rotate(0.5deg) skew(0.5deg); }
}

.xun-animation {
  animation: xun-energy 4s ease-in-out infinite;
}
```

### 7.3 ローディングアニメーション

#### 易経風ローディング
```css
/* 陰陽ローダー */
@keyframes yin-yang-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.yin-yang-loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--primary-900) 50%, var(--primary-100) 50%);
  position: relative;
  animation: yin-yang-spin 1s linear infinite;
}

.yin-yang-loader::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background: var(--primary-100);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.yin-yang-loader::after {
  content: '';
  position: absolute;
  top: 25%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--primary-900);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* 八卦ローダー */
.bagua-loader {
  width: 60px;
  height: 60px;
  position: relative;
  animation: rotate 2s linear infinite;
}

.bagua-loader .trigram-line {
  position: absolute;
  width: 20px;
  height: 3px;
  background: var(--accent-500);
  border-radius: 1.5px;
}

.bagua-loader .trigram-line:nth-child(1) { top: 10px; left: 20px; }
.bagua-loader .trigram-line:nth-child(2) { top: 17px; left: 20px; }
.bagua-loader .trigram-line:nth-child(3) { top: 24px; left: 20px; }
.bagua-loader .trigram-line:nth-child(4) { top: 35px; left: 5px; transform: rotate(45deg); }
.bagua-loader .trigram-line:nth-child(5) { top: 42px; left: 5px; transform: rotate(45deg); }
.bagua-loader .trigram-line:nth-child(6) { top: 49px; left: 5px; transform: rotate(45deg); }

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 8. レスポンシブデザイン仕様

### 8.1 モバイルファーストアプローチ

#### デバイス別最適化戦略
```css
/* ベース（モバイル）: 320px以上 */
.responsive-layout {
  padding: var(--space-4);
  gap: var(--space-4);
}

.responsive-text {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.responsive-button {
  min-height: 44px;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
}

/* タブレット: 768px以上 */
@media (min-width: 768px) {
  .responsive-layout {
    padding: var(--space-6);
    gap: var(--space-6);
  }
  
  .responsive-text {
    font-size: var(--font-size-md);
  }
  
  .responsive-button {
    min-height: 48px;
    padding: var(--space-4) var(--space-6);
    font-size: var(--font-size-md);
  }
}

/* デスクトップ: 1024px以上 */
@media (min-width: 1024px) {
  .responsive-layout {
    padding: var(--space-8);
    gap: var(--space-8);
  }
  
  .responsive-text {
    font-size: var(--font-size-lg);
  }
  
  .responsive-button {
    min-height: 52px;
    padding: var(--space-5) var(--space-8);
    font-size: var(--font-size-lg);
  }
}
```

### 8.2 フルードタイポグラフィ

#### ビューポート単位を使用したスケーリング
```css
:root {
  /* フルードタイポグラフィ */
  --font-size-fluid-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-fluid-base: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --font-size-fluid-md: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);
  --font-size-fluid-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --font-size-fluid-xl: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
  --font-size-fluid-2xl: clamp(1.875rem, 1.6rem + 1.375vw, 2.75rem);
  --font-size-fluid-3xl: clamp(2.25rem, 1.9rem + 1.75vw, 3.5rem);
  
  /* フルードスペーシング */
  --space-fluid-xs: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-fluid-sm: clamp(0.75rem, 0.6rem + 0.75vw, 1.125rem);
  --space-fluid-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-fluid-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --space-fluid-xl: clamp(2rem, 1.6rem + 2vw, 3rem);
}
```

### 8.3 デバイス特化機能

#### タッチデバイス最適化
```css
/* タッチデバイス専用スタイル */
@media (hover: none) and (pointer: coarse) {
  /* タッチターゲットの拡大 */
  .touch-target {
    min-height: 44px;
    min-width: 44px;
    padding: var(--space-3);
  }
  
  /* ホバー効果の無効化 */
  .hover-effect:hover {
    transform: none;
    box-shadow: none;
  }
  
  /* タッチフィードバック */
  .touch-feedback:active {
    transform: scale(0.98);
    opacity: 0.8;
    transition: all 0.1s ease;
  }
}

/* マウス・トラックパッド対応 */
@media (hover: hover) and (pointer: fine) {
  /* 精密なホバー効果 */
  .precise-hover:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  /* カーソル変化 */
  .interactive {
    cursor: pointer;
  }
  
  .disabled {
    cursor: not-allowed;
  }
}
```

---

## 9. アクセシビリティ仕様

### 9.1 WCAG 2.1 AA準拠

#### カラーコントラスト
```css
/* コントラスト比保証 */
:root {
  /* AAレベル（4.5:1以上）*/
  --contrast-aa-normal: 4.5;
  --contrast-aa-large: 3;
  
  /* AAAレベル（7:1以上）*/
  --contrast-aaa-normal: 7;
  --contrast-aaa-large: 4.5;
}

/* テキストコントラスト */
.text-high-contrast {
  color: var(--primary-900);
  background: var(--primary-50);
  /* Contrast ratio: 16.69:1 (AAA) */
}

.text-medium-contrast {
  color: var(--primary-700);
  background: var(--primary-100);
  /* Contrast ratio: 8.09:1 (AAA) */
}

.text-minimum-contrast {
  color: var(--primary-600);
  background: var(--primary-50);
  /* Contrast ratio: 4.52:1 (AA) */
}

/* 高コントラストモード */
@media (prefers-contrast: high) {
  :root {
    --primary-50: #ffffff;
    --primary-900: #000000;
    --accent-500: #0000ff;
    --success-500: #008000;
    --error-500: #ff0000;
    --warning-500: #ff8000;
  }
  
  .card,
  .btn,
  input,
  textarea {
    border-width: 2px !important;
    border-style: solid !important;
  }
}
```

### 9.2 スクリーンリーダー対応

#### ARIA属性とセマンティクス
```css
/* 視覚的に隠すが読み上げは残す */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* フォーカス時に表示 */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* ARIA状態の視覚化 */
[aria-expanded="true"] .expandable-icon {
  transform: rotate(180deg);
}

[aria-selected="true"] {
  background: var(--accent-100);
  border-color: var(--accent-500);
}

[aria-invalid="true"] {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px var(--error-100);
}

/* フォーカストラップ */
.focus-trap {
  position: relative;
}

.focus-trap::before,
.focus-trap::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

### 9.3 モーション配慮

#### アニメーション制御
```css
/* モーション削減設定 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* 位置変更のみ保持 */
  .essential-motion {
    animation: none !important;
    transition: none !important;
  }
  
  /* フォーカス表示は維持 */
  :focus-visible {
    transition: outline 0.1s ease !important;
  }
}

/* モーション許可時の強化 */
@media (prefers-reduced-motion: no-preference) {
  .enhanced-animation {
    animation-duration: var(--duration-slow);
    transition-duration: var(--duration-normal);
  }
  
  .parallax-effect {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
}
```

---

## 10. デザイントークン定義

### 10.1 完全なトークンシステム

#### 基本トークン
```css
:root {
  /* === カラートークン === */
  /* グレースケール */
  --color-white: #ffffff;
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;
  --color-black: #000000;
  
  /* プライマリカラー（易経藍） */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;
  
  /* === タイポグラフィトークン === */
  --font-family-sans: 'Noto Sans JP', 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-serif: 'Noto Serif JP', 'Georgia', serif;
  --font-family-mono: 'JetBrains Mono', 'Consolas', monospace;
  
  --font-size-2xs: 0.625rem;   /* 10px */
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;     /* 24px */
  --font-size-3xl: 1.875rem;   /* 30px */
  --font-size-4xl: 2.25rem;    /* 36px */
  --font-size-5xl: 3rem;       /* 48px */
  --font-size-6xl: 3.75rem;    /* 60px */
  --font-size-7xl: 4.5rem;     /* 72px */
  --font-size-8xl: 6rem;       /* 96px */
  --font-size-9xl: 8rem;       /* 128px */
  
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
  
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  
  /* === スペーシングトークン === */
  --space-px: 1px;
  --space-0: 0px;
  --space-0-5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1-5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  --space-2-5: 0.625rem;   /* 10px */
  --space-3: 0.75rem;      /* 12px */
  --space-3-5: 0.875rem;   /* 14px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-7: 1.75rem;      /* 28px */
  --space-8: 2rem;         /* 32px */
  --space-9: 2.25rem;      /* 36px */
  --space-10: 2.5rem;      /* 40px */
  --space-11: 2.75rem;     /* 44px */
  --space-12: 3rem;        /* 48px */
  --space-14: 3.5rem;      /* 56px */
  --space-16: 4rem;        /* 64px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */
  --space-28: 7rem;        /* 112px */
  --space-32: 8rem;        /* 128px */
  --space-36: 9rem;        /* 144px */
  --space-40: 10rem;       /* 160px */
  --space-44: 11rem;       /* 176px */
  --space-48: 12rem;       /* 192px */
  --space-52: 13rem;       /* 208px */
  --space-56: 14rem;       /* 224px */
  --space-60: 15rem;       /* 240px */
  --space-64: 16rem;       /* 256px */
  --space-72: 18rem;       /* 288px */
  --space-80: 20rem;       /* 320px */
  --space-96: 24rem;       /* 384px */
  
  /* === シャドウトークン === */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --shadow-none: none;
  
  /* === ボーダー半径トークン === */
  --radius-none: 0px;
  --radius-sm: 0.125rem;    /* 2px */
  --radius: 0.25rem;        /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;
  
  /* === トランジショントークン === */
  --transition-none: none;
  --transition-all: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-default: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-colors: color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-opacity: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-shadow: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-transform: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* === アニメーション期間 === */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
  
  /* === イージング === */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bunenjin: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 10.2 セマンティックトークン

#### 意味的なトークン定義
```css
:root {
  /* === セマンティックカラー === */
  --color-background: var(--color-white);
  --color-background-alt: var(--color-gray-50);
  --color-background-inverse: var(--color-gray-900);
  
  --color-surface: var(--color-white);
  --color-surface-alt: var(--color-gray-100);
  --color-surface-inverse: var(--color-gray-800);
  
  --color-text: var(--color-gray-900);
  --color-text-alt: var(--color-gray-600);
  --color-text-inverse: var(--color-white);
  --color-text-muted: var(--color-gray-500);
  
  --color-border: var(--color-gray-200);
  --color-border-alt: var(--color-gray-300);
  --color-border-inverse: var(--color-gray-700);
  
  --color-focus: var(--color-primary-500);
  --color-focus-ring: var(--color-primary-100);
  
  /* === インタラクションカラー === */
  --color-interactive: var(--color-primary-500);
  --color-interactive-hover: var(--color-primary-600);
  --color-interactive-active: var(--color-primary-700);
  --color-interactive-disabled: var(--color-gray-300);
  
  /* === フィードバックカラー === */
  --color-success: #10b981;
  --color-success-bg: #d1fae5;
  --color-success-border: #6ee7b7;
  
  --color-warning: #f59e0b;
  --color-warning-bg: #fef3c7;
  --color-warning-border: #fcd34d;
  
  --color-error: #ef4444;
  --color-error-bg: #fee2e2;
  --color-error-border: #fca5a5;
  
  --color-info: var(--color-primary-500);
  --color-info-bg: var(--color-primary-50);
  --color-info-border: var(--color-primary-200);
  
  /* === 八卦セマンティック === */
  --color-leader: var(--trigram-qian);       /* リーダーシップ */
  --color-communication: var(--trigram-dui); /* コミュニケーション */
  --color-passion: var(--trigram-li);        /* 情熱・エネルギー */
  --color-action: var(--trigram-zhen);       /* 行動・変革 */
  --color-adaptation: var(--trigram-xun);    /* 柔軟性・適応 */
  --color-intuition: var(--trigram-kan);     /* 直感・洞察 */
  --color-stability: var(--trigram-gen);     /* 安定・持続 */
  --color-support: var(--trigram-kun);       /* 支援・包容 */
}
```

### 10.3 コンポーネントトークン

#### コンポーネント固有のトークン
```css
:root {
  /* === ボタントークン === */
  --btn-font-family: var(--font-family-sans);
  --btn-font-weight: var(--font-weight-semibold);
  --btn-line-height: var(--line-height-none);
  --btn-border-width: 1px;
  --btn-border-radius: var(--radius-lg);
  --btn-transition: var(--transition-all);
  --btn-focus-ring-width: 3px;
  --btn-focus-ring-offset: 2px;
  
  /* ボタンサイズ */
  --btn-sm-height: 32px;
  --btn-sm-px: var(--space-3);
  --btn-sm-py: var(--space-1-5);
  --btn-sm-font-size: var(--font-size-sm);
  
  --btn-md-height: 40px;
  --btn-md-px: var(--space-4);
  --btn-md-py: var(--space-2-5);
  --btn-md-font-size: var(--font-size-base);
  
  --btn-lg-height: 48px;
  --btn-lg-px: var(--space-6);
  --btn-lg-py: var(--space-3);
  --btn-lg-font-size: var(--font-size-lg);
  
  /* === カードトークン === */
  --card-background: var(--color-surface);
  --card-border-width: 1px;
  --card-border-color: var(--color-border);
  --card-border-radius: var(--radius-2xl);
  --card-shadow: var(--shadow-md);
  --card-shadow-hover: var(--shadow-lg);
  --card-padding: var(--space-6);
  --card-gap: var(--space-4);
  --card-transition: var(--transition-all);
  
  /* === 入力フィールドトークン === */
  --input-font-family: var(--font-family-sans);
  --input-font-size: var(--font-size-base);
  --input-line-height: var(--line-height-tight);
  --input-background: var(--color-surface);
  --input-border-width: 1px;
  --input-border-color: var(--color-border-alt);
  --input-border-radius: var(--radius-lg);
  --input-padding-x: var(--space-3);
  --input-padding-y: var(--space-2-5);
  --input-height: 42px;
  --input-shadow: var(--shadow-sm);
  --input-shadow-focus: 0 0 0 3px var(--color-focus-ring);
  --input-transition: var(--transition-all);
  
  /* === ダイアログトークン === */
  --dialog-background: var(--color-surface);
  --dialog-border-radius: var(--radius-3xl);
  --dialog-shadow: var(--shadow-2xl);
  --dialog-padding: var(--space-8);
  --dialog-max-width: 32rem;
  --dialog-backdrop: rgba(0, 0, 0, 0.5);
  --dialog-backdrop-blur: blur(8px);
}
```

---

## 11. 実装ガイドライン

### 11.1 CSS変数の活用

#### 動的テーマ切り替えの実装
```css
/* テーマ切り替えJavaScript連携 */
:root[data-theme="dark"] {
  --color-background: var(--color-gray-900);
  --color-text: var(--color-gray-100);
  --color-border: var(--color-gray-700);
}

:root[data-theme="light"] {
  --color-background: var(--color-white);
  --color-text: var(--color-gray-900);
  --color-border: var(--color-gray-200);
}

/* 八卦テーマの動的切り替え */
:root[data-trigram="qian"] {
  --color-accent: var(--trigram-qian);
  --color-accent-light: var(--trigram-qian-light);
  --color-accent-energy: var(--trigram-qian-energy);
}

:root[data-trigram="li"] {
  --color-accent: var(--trigram-li);
  --color-accent-light: var(--trigram-li-light);
  --color-accent-energy: var(--trigram-li-energy);
}
```

### 11.2 JavaScript統合

#### テーマ制御システム
```javascript
class BunenjinThemeSystem {
  constructor() {
    this.currentTheme = 'auto';
    this.currentTrigram = 'auto';
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }
  
  init() {
    // システム設定の監視
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applySystemTheme();
      }
    });
    
    // 初期テーマの適用
    this.loadSavedPreferences();
    this.applyTheme();
  }
  
  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme();
    this.savePreferences();
  }
  
  setTrigram(trigram) {
    this.currentTrigram = trigram;
    this.applyTrigram();
    this.savePreferences();
  }
  
  applyTheme() {
    const root = document.documentElement;
    
    if (this.currentTheme === 'auto') {
      const isDark = this.mediaQuery.matches;
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', this.currentTheme);
    }
  }
  
  applyTrigram() {
    const root = document.documentElement;
    
    if (this.currentTrigram === 'auto') {
      // 時間帯に基づく自動選択
      const hour = new Date().getHours();
      const trigram = this.getTrigramByTime(hour);
      root.setAttribute('data-trigram', trigram);
    } else {
      root.setAttribute('data-trigram', this.currentTrigram);
    }
  }
  
  getTrigramByTime(hour) {
    if (hour >= 6 && hour < 9) return 'li';      // 朝の火
    if (hour >= 9 && hour < 15) return 'qian';   // 日中の天
    if (hour >= 15 && hour < 18) return 'kun';   // 夕方の地
    return 'kan';                                 // 夜の水
  }
  
  savePreferences() {
    localStorage.setItem('bunenjin-theme', JSON.stringify({
      theme: this.currentTheme,
      trigram: this.currentTrigram
    }));
  }
  
  loadSavedPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem('bunenjin-theme'));
      if (saved) {
        this.currentTheme = saved.theme || 'auto';
        this.currentTrigram = saved.trigram || 'auto';
      }
    } catch (e) {
      // デフォルト値のまま
    }
  }
}

// 初期化
const themeSystem = new BunenjinThemeSystem();
```

---

## 12. パフォーマンス考慮事項

### 12.1 CSS最適化

#### クリティカルCSS
```css
/* Above-the-fold critical styles */
.critical-styles {
  /* 必要最小限のスタイル */
  font-family: var(--font-family-sans);
  color: var(--color-text);
  background: var(--color-background);
  line-height: var(--line-height-normal);
}

/* 遅延読み込み対象 */
.deferred-styles {
  /* アニメーション、装飾的要素など */
  animation: fadeIn 0.3s ease;
  box-shadow: var(--shadow-lg);
}
```

#### CSS Containment
```css
.component-container {
  contain: layout style paint;
}

.animation-container {
  contain: layout;
  will-change: transform, opacity;
}

.isolated-component {
  contain: strict;
}
```

### 12.2 レンダリング最適化

#### GPU加速の活用
```css
.gpu-optimized {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.smooth-animation {
  transform: translate3d(0, 0, 0);
  animation-fill-mode: both;
}
```

---

## 13. ブラウザサポート

### 13.1 対応ブラウザ

#### 完全サポート
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

#### 制限付きサポート
- IE 11（基本機能のみ）
- Chrome 70-87（一部CSS機能制限）
- Firefox 70-84（一部CSS機能制限）

#### フォールバック戦略
```css
/* CSS Grid fallback */
.grid-container {
  display: flex;
  flex-wrap: wrap;
}

@supports (display: grid) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

/* Custom properties fallback */
.fallback-styles {
  color: #334155; /* fallback */
  color: var(--color-text); /* modern */
}

/* Backdrop filter fallback */
.modal-backdrop {
  background: rgba(0, 0, 0, 0.8); /* fallback */
}

@supports (backdrop-filter: blur(8px)) {
  .modal-backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
  }
}
```

---

## 14. 今後の展開

### 14.1 バージョンロードマップ

#### v2.1 (次期メジャーアップデート)
- Dynamic Color System（ユーザー入力に基づく動的色調整）
- Advanced Accessibility Features（AI支援アクセシビリティ）
- Performance Metrics Dashboard（リアルタイム性能監視）

#### v2.2 (機能拡張)
- Multi-language Typography Optimization
- Advanced Animation System（physics-based animations）
- Custom Theme Builder（GUI）

#### v3.0 (次世代アーキテクチャ)
- Web Components based architecture
- CSS-in-JS hybrid approach
- Advanced AI-driven personalization

### 14.2 継続的改善

#### メトリクス監視
- Core Web Vitals
- Accessibility Score
- User Satisfaction Index
- Performance Budget

#### フィードバック収集
- User Experience Surveys
- A/B Testing Framework
- Analytics Integration
- Accessibility Auditing

---

## 15. 結論

この包括的なUI/UXデザイン仕様書により、Future Simulatorは以下を実現します：

1. **bunenjin哲学の体現**: シンプルさと美しさの完璧な調和
2. **易経智慧の統合**: 八卦エネルギーによる直感的な色彩体験
3. **ユニバーサルアクセシビリティ**: すべてのユーザーに配慮した設計
4. **レスポンシブ対応**: あらゆるデバイスでの最適な体験
5. **パフォーマンス最適化**: 高速で滑らかな動作
6. **将来への拡張性**: 継続的な進化に対応する柔軟なアーキテクチャ

本仕様書は生きたドキュメントとして、プロジェクトの発展とともに継続的に更新され、常に最高のユーザーエクスペリエンスを提供するための指針となります。

---

*Designed with bunenjin philosophy - Simple, Beautiful, Harmonious*

**Document Version**: 2.0  
**Last Updated**: 2025-08-06  
**Next Review**: 2025-09-06