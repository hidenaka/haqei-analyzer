# Future Simulator UI/UXデザイン要件分析書
## Phase 1-2 実装計画

**作成日**: 2025年8月6日  
**対象**: Future Simulator (future_simulator.html)  
**目的**: 機能完全保持でのモダンUI/UXデザイン実装

---

## 1. 現状問題分析

### 1.1 視覚的デザイン問題
- **ダークテーマ過依存**: `bg-gray-900`の暗すぎる背景が視認性を著しく低下
- **コントラスト不適切**: `text-gray-200`と`bg-gray-900`の組み合わせがアクセシビリティ基準未達
- **単調な配色**: グレーベースのみで情報階層が不明確
- **ブランドアイデンティティ欠如**: HAQEIの哲学的価値観が視覚的に表現されていない

### 1.2 ユーザビリティ問題
- **スケルトンローディング過多**: 20箇所以上のスケルトン表示でUX阻害
  ```html
  <!-- 問題例 -->
  <div class="skeleton skeleton-text" style="width: 60%; height: 1.5rem;"></div>
  <div class="skeleton skeleton-card">
    <div class="skeleton skeleton-text" style="width: 100%;"></div>
  ```
- **情報アーキテクチャ混乱**: 7段階ナビゲーションシステムが不明確
- **レスポンシブ設計不完全**: モバイル体験でのタップ領域・テキスト読みやすさ問題
- **フォーカス管理不適切**: アクセシビリティ配慮が部分的

### 1.3 技術的問題（UI関連）
- **404エラー源**: 以下のリソースが欠損
  - SVGアイコンリソース（易経シンボル関連）
  - フォントファイル（一部のウェイト）
  - CSSコンポーネントファイル
- **CSS構造の複雑化**: 16個のCSSファイルが混在し保守性低下
- **アニメーション過多**: `prefers-reduced-motion`配慮も性能への配慮不十分

---

## 2. ターゲットユーザー定義

### 2.1 プライマリユーザー
**東洋哲学実践者・ビジネス意思決定者**
- **年齢**: 35-65歳
- **背景**: 経営者、コンサルタント、研究者
- **ニーズ**: 深い洞察と実用的な意思決定支援
- **技術レベル**: 中級（スマートフォン・PC両方使用）

### 2.2 セカンダリユーザー
**スピリチュアル探求者**
- **年齢**: 25-55歳
- **背景**: 個人的成長・自己理解を求める人
- **ニーズ**: 直感的な操作と美的体験
- **技術レベル**: 初級-中級

### 2.3 ユーザージャーニー
1. **発見**: HaQei分析への興味
2. **初回体験**: 質問入力から結果受取まで
3. **理解**: 8つの未来シナリオの解釈
4. **意思決定**: シナリオ選択と実行計画
5. **継続使用**: 定期的な状況分析

---

## 3. デザインゴール設定

### 3.1 視覚的目標
- **信頼感**: 企業レベルの信頼できる外観
- **調和**: 東洋哲学の美的価値観を表現
- **明瞭性**: 情報の階層と流れが直感的
- **ブランド一貫性**: HAQEIアイデンティティの統一

### 3.2 機能的目標
- **応答性**: 3秒以内の初期表示
- **直感性**: 新規ユーザーでも迷わない操作流れ
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **パフォーマンス**: Core Web Vitals全項目GOOD

### 3.3 成功指標
- **ユーザー完了率**: 現在69% → 目標85%
- **離脱率**: 分析途中での離脱30%削減
- **使いやすさスコア**: SUS（System Usability Scale）80点以上
- **アクセシビリティ**: Lighthouse Accessibility 95点以上

---

## 4. 必要リソース特定

### 4.1 欠損ファイル分析
```
確認が必要なリソース:
├── SVGアイコン: 易経シンボル、ナビゲーション
├── フォント: Inter/Noto Sans JPの全ウェイト
├── 画像: ヘキサグラム表示、背景テクスチャ
└── CSSコンポーネント: 部分的に未実装
```

### 4.2 新規作成必要リソース
- **カラーパレットCSS**: ブランド色定義
- **タイポグラフィシステム**: 階層的文字スタイル
- **コンポーネントライブラリ**: 再利用可能UIパーツ
- **アイコンセット**: 統一された視覚言語

---

## 5. Phase 2 デザインシステム仕様

### 5.1 カラーパレット設計

#### プライマリカラー（信頼・調和）
```css
:root {
  /* プライマリ - 深い藍（易の智慧） */
  --color-primary: #1e40af;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1e3a8a;
  
  /* セカンダリ - 温かい金（太陽・陽）*/
  --color-secondary: #f59e0b;
  --color-secondary-light: #fbbf24;
  --color-secondary-dark: #d97706;
  
  /* アクセント - 紫（直感・洞察） */
  --color-accent: #7c3aed;
  --color-accent-light: #8b5cf6;
}
```

#### 背景システム（明るく親しみやすい）
```css
:root {
  /* 背景 - 温かいニュートラル */
  --bg-primary: #fefefe;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  /* カード・コンテナ */
  --bg-card: #ffffff;
  --bg-card-hover: #f8fafc;
  
  /* サイドバー・ナビ */
  --bg-nav: #1e293b;
  --bg-nav-item: rgba(255, 255, 255, 0.1);
}
```

### 5.2 タイポグラフィシステム

#### フォント階層
```css
:root {
  /* フォントファミリー */
  --font-primary: 'Inter', 'Noto Sans JP', sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
  
  /* サイズスケール（Major Third: 1.25） */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* 行間 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-loose: 1.75;
}
```

### 5.3 レスポンシブグリッドシステム

#### ブレークポイント
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;  
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

#### グリッドレイアウト
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) { .container { max-width: 640px; }}
@media (min-width: 768px) { .container { max-width: 768px; }}
@media (min-width: 1024px) { .container { max-width: 1024px; }}
@media (min-width: 1280px) { .container { max-width: 1280px; }}
```

### 5.4 コンポーネントライブラリ設計

#### カード系コンポーネント
```css
.card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 
              0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.card:hover {
  background: var(--bg-card-hover);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 
              0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
```

#### ボタンシステム
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}
```

### 5.5 インタラクションパターン

#### ローディング状態（スケルトン置換）
```css
.loading-card {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 12px;
  height: 120px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### フォーカスとホバー状態
```css
.interactive:focus {
  outline: 3px solid var(--color-primary-light);
  outline-offset: 2px;
}

.interactive:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}
```

---

## 6. 実装アクションプラン

### 6.1 Phase 1完了項目（今回実施）
1. ✅ **問題点詳細分析** - 現状UI/UXの網羅的評価
2. ✅ **ターゲットユーザー定義** - ペルソナとユーザージャーニー
3. ✅ **デザインゴール設定** - 定量的・定性的成功指標
4. ✅ **リソース要件特定** - 欠損ファイルと新規作成項目

### 6.2 Phase 2実装優先度
1. **Critical (即座実装)**
   - カラーパレットCSS実装
   - タイポグラフィシステム適用
   - 基本カードコンポーネント置換

2. **High (1週間以内)**
   - スケルトンローディング全面刷新
   - レスポンシブグリッド適用
   - アクセシビリティ向上

3. **Medium (2週間以内)**
   - アニメーション最適化
   - インタラクションパターン統一
   - パフォーマンス向上

### 6.3 技術的制約・考慮事項
- **機能保持**: 易経分析、8シナリオ、選択システム、エクスポート機能の完全維持
- **bunenjin哲学**: 東洋思想の美的価値観とUI設計の調和
- **セキュリティ**: 既存のCSP、CSRF保護システムとの互換性
- **パフォーマンス**: 26MB→5MB削減目標との整合

---

## 7. 次ステップ（Phase 2開始準備）

1. **CTO承認**: 本要件定義書の技術的実現性確認
2. **I Ching Expert確認**: 東洋哲学的デザイン要素の適切性検証
3. **QA基準設定**: テスト基準とユーザー受入基準の明文化
4. **実装開始**: デザインシステムCSS作成からスタート

---

## 付録

### A. 現在のCSS構造
```
public/css/
├── ui-enhancements.css (192行) - UI改善基盤
├── tailwind.css - ベースフレームワーク
├── themes.css - テーマシステム
├── components.css - コンポーネント定義
├── responsive.css - レスポンシブ対応
├── accessibility-wcag.css - アクセシビリティ
└── 他10ファイル
```

### B. 主要機能フロー
1. **質問入力** → 2. **易経分析** → 3. **8シナリオ生成** → 4. **選択・実行**

### C. 参考資料
- WCAG 2.1 ガイドライン
- Material Design システム
- Apple Human Interface Guidelines
- 東洋美学原理

---

*本要件定義書は、HaQei Future Simulatorの機能性を損なうことなく、ユーザー体験を大幅に向上させるモダンUI/UX実装のための包括的ガイドラインです。*