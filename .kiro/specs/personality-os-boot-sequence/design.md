# Design Document

## Overview

人格 OS 起動シーケンス体験は、現在の横並びカード型レイアウトを縦長のスクロール形式に変更し、ユーザーが自分の「人格 OS」が起動していくプロセスを追体験できる物語性のある UI を実装する。この体験により、単なる情報の受け取りではなく「発見と驚きのある体験」を提供する。

## Architecture

### Component Structure

```
TripleOSResultsView (Enhanced)
├── BootScreen (新規)
├── CoreEngineSection (既存を拡張)
├── GUISection (既存を拡張)
├── SafeModeSection (既存を拡張)
├── IntegrationSection (新規)
└── ScrollAnimationController (新規)
```

### Data Flow

1. 診断完了後、TripleOSResultsView が起動シーケンスモードで初期化
2. ScrollAnimationController が Intersection Observer API でセクションの表示を監視
3. 各セクションが画面に入ると、アニメーション付きでコンテンツを表示
4. OS テーマカラーシステムがエンジン OS に基づいて全体のテーマを設定

## Components and Interfaces

### 1. BootScreen Component

**目的**: ユーザーの最も根源的な OS を宣言し、世界観に引き込む

**HTML 構造**:

```html
<section class="boot-screen">
  <div class="hexagram-background" data-hexagram-id="${engineOS.hexagramId}">
    <svg class="hexagram-svg"></svg>
  </div>
  <div class="boot-content">
    <h1 class="boot-title">
      あなたは「<span class="os-name-highlight">${engineOS.osName}</span
      >」のOSを搭載しています
    </h1>
    <div class="boot-subtitle">${engineOS.hexagramInfo.catchphrase}</div>
  </div>
</section>
```

**CSS 設計**:

- 画面全体の高さ(100vh)を占有
- hexagram-background は薄いオーバーレイで卦の SVG アニメーションを表示
- boot-title は大きなタイポグラフィで中央配置
- stroke-dasharray/stroke-dashoffset を使った線描画アニメーション

### 2. CoreEngineSection Component

**目的**: OS のスペックと核心的な特徴を提示する

**HTML 構造**:

```html
<section class="core-engine-section">
  <div class="section-header">
    <h2 class="section-title">
      コアエンジン: <span class="os-name-highlight">${engineOS.osName}</span>
      <span class="os-strength">(${Math.round(engineOS.strength * 100)}%)</span>
    </h2>
  </div>
  <div class="engine-layout">
    <div class="engine-chart">
      <canvas id="profile-radar-chart"></canvas>
    </div>
    <div class="engine-description">
      <p class="engine-catchphrase">"${engineOS.hexagramInfo.catchphrase}"</p>
      <details class="accordion">
        <summary>さらに詳しく</summary>
        <div class="accordion-content">
          <!-- 詳細情報 -->
        </div>
      </details>
    </div>
  </div>
</section>
```

**機能**:

- 既存のレーダーチャート描画ロジックを統合
- アコーディオン UI で詳細情報を隠す
- OS テーマカラーを適用

### 3. GUISection Component

**目的**: 社会との関わり方と OS 間の力学を示す

**HTML 構造**:

```html
<section class="gui-section">
  <div class="section-header">
    <h2 class="section-title">
      GUI: <span class="os-name-highlight">${interfaceOS.osName}</span>
      <span class="os-match-score">(${interfaceOS.matchScore}%)</span>
    </h2>
  </div>
  <div class="narrative-text">
    <p>
      あなたの「${engineOS.osName}」エンジンは、社会と関わる際、「${interfaceOS.osName}」というインターフェースを介してその能力を発揮します。
    </p>
  </div>
  <div class="dynamics-visualizer">
    <div class="os-icon engine" data-os-type="engine">🔧</div>
    <div class="dynamics-connector" data-dynamics-type="harmony"></div>
    <div class="os-icon interface" data-os-type="interface">🖥️</div>
  </div>
  <div class="dynamics-card-container">
    <!-- 既存の力学カードを統合 -->
  </div>
</section>
```

**機能**:

- HARMONY/TENSION スコアに基づく視覚的コネクタ
- 既存の力学分析カードを統合
- アニメーション付きの接続線

### 4. SafeModeSection Component

**目的**: ストレス時の防御機制とその力学を示す

**HTML 構造**: GUISection と類似した構造で、safeModeOS の情報を表示
**機能**:

- TENSION を表現する視覚的要素（警告マーク、ギクシャクした動き）
- セーフモードの役割説明

### 5. IntegrationSection Component

**目的**: 3 つの OS を要約し、分人主義の思想を伝える

**HTML 構造**:

```html
<section class="integration-section">
  <div class="section-header">
    <h2 class="section-title">「分人」としてのあなたへ</h2>
  </div>
  <div class="narrative-text">
    <p>
      これら3つのOSは、固定された人格ではなく、状況に応じて顔を出す異なる「分人」です。その多面性こそが、あなたの豊かさです。
    </p>
  </div>
  <div class="summary-cards-container">
    <!-- 3つのOSの簡易サマリー -->
  </div>
  <div class="actions-container">
    <button class="share-btn">結果をシェア</button>
    <button class="explore-more-btn">他のタイプも見る</button>
  </div>
</section>
```

### 6. ScrollAnimationController

**目的**: スクロール連動アニメーションを管理

**機能**:

```javascript
class ScrollAnimationController {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        this.triggerSectionAnimation(entry.target);
      }
    });
  }

  triggerSectionAnimation(section) {
    // セクション固有のアニメーションを実行
    if (section.classList.contains("core-engine-section")) {
      this.animateRadarChart();
    }
    // 数値のカウントアップアニメーション
    this.animateCounters(section);
  }
}
```

## Data Models

### OSThemeSystem

```javascript
const OSThemeSystem = {
  getThemeForOS: (hexagramId) => {
    const themeMap = {
      1: { primary: "#FF6B35", secondary: "#F7931E", name: "keniten" },
      2: { primary: "#8B4513", secondary: "#D2691E", name: "konichi" },
      // ... 他の64卦のテーマカラー
    };
    return (
      themeMap[hexagramId] || {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        name: "default",
      }
    );
  },

  applyTheme: (theme) => {
    document.body.setAttribute("data-theme", theme.name);
    document.documentElement.style.setProperty(
      "--theme-primary",
      theme.primary
    );
    document.documentElement.style.setProperty(
      "--theme-secondary",
      theme.secondary
    );
  },
};
```

### HexagramSVGGenerator

```javascript
class HexagramSVGGenerator {
  static generateSVG(hexagramId) {
    const hexagramData = this.getHexagramStructure(hexagramId);
    return `
      <svg viewBox="0 0 100 200" class="hexagram-lines">
        ${hexagramData.lines
          .map((line, index) => this.generateLine(line, index))
          .join("")}
      </svg>
    `;
  }

  static generateLine(lineType, position) {
    const y = 30 + position * 25;
    if (lineType === "yang") {
      return `<line x1="20" y1="${y}" x2="80" y2="${y}" stroke="currentColor" stroke-width="3" class="yang-line"/>`;
    } else {
      return `
        <line x1="20" y1="${y}" x2="45" y2="${y}" stroke="currentColor" stroke-width="3" class="yin-line"/>
        <line x1="55" y1="${y}" x2="80" y2="${y}" stroke="currentColor" stroke-width="3" class="yin-line"/>
      `;
    }
  }
}
```

## Error Handling

### 1. データ不整合への対応

- 必須データ（engineOS, interfaceOS, safeModeOS）が欠損している場合のフォールバック表示
- hexagramId が無効な場合のデフォルトテーマ適用

### 2. アニメーション失敗への対応

- Intersection Observer API が利用できない環境での静的表示
- Chart.js の読み込み失敗時の代替表示

### 3. パフォーマンス対策

- 大量のアニメーションによるメモリリーク防止
- スクロールイベントの適切なデバウンス処理

## Testing Strategy

### 1. Unit Tests

- OSThemeSystem の各テーマカラー設定
- HexagramSVGGenerator の正しい SVG 生成
- ScrollAnimationController の Intersection Observer 処理

### 2. Integration Tests

- 診断完了から起動シーケンス表示までの全フロー
- 各セクションのアニメーション連携
- レスポンシブデザインでの表示確認

### 3. Performance Tests

- スクロールアニメーションのフレームレート測定
- Core Web Vitals（LCP, CLS）の目標値達成確認
- メモリ使用量の監視

### 4. Accessibility Tests

- キーボードナビゲーションの確認
- スクリーンリーダーでの読み上げテスト
- 色覚異常者向けのコントラスト確認
- motion-reduce 設定への対応確認

## Visual Design Specifications

### Typography Hierarchy

```css
.boot-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
}

.section-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.narrative-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
}
```

### Animation Specifications

```css
.section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.hexagram-lines .yang-line,
.hexagram-lines .yin-line {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: drawLine 2s ease-out forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
```

### Responsive Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

各ブレークポイントでのレイアウト調整とタイポグラフィスケーリングを定義。
