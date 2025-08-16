# ユーザーフロー検証 & 要件設計タスク分解報告

## 📅 作業日時
2025年8月16日

## 🧪 ユーザーフロー検証結果

### ✅ Playwright統合テスト完了

**検証内容**: 実際のユーザー画面でのOSアナライザー統一実装システム動作確認

**テスト結果**:
- ✅ **統一コンテナ存在確認**: `#os-analyzer-unified-results` 正常検出
- ✅ **ScreenManager統合**: `showResults()` メソッド正常動作
- ✅ **画面遷移**: Welcome → Results 画面切り替え成功
- ✅ **結果表示**: 旧システム（generateResultsHTML）による表示確認
- ✅ **localStorage保存**: 統一フォーマットでのデータ保存確認

**現状判明事項**:
1. **統一フレームワーク基盤**: ✅ 完成・動作確認済み
2. **旧システム併用**: 現在は `generateResultsHTML()` (旧) が動作中
3. **新システム準備完了**: `generateOSAnalyzerUnifiedHTML()` 実装済み・未呼び出し

### 📋 現状分析：既存システムと新統一システムの関係

**発見した問題**:
- `showResults()` メソッドが **旧システム** `generateResultsHTML()` を呼び出し中
- 新統一システム `generateOSAnalyzerUnifiedHTML()` が実装済みだが未使用
- 結果として「統一実装準備完了」だが「旧システムが動作継続」状態

**修正必要箇所**:
`/public/js/core/ScreenManager.js` line 175:
```javascript
// 現在（旧システム）
const unifiedHTML = this.generateOSAnalyzerUnifiedHTML(results);

// 実際の呼び出し（要修正）
// generateResultsHTML() が実行されている
```

## 🎯 要件設計タスク分解

### **Phase 1: 統一システム有効化**
```
T1-1: showResults()メソッド修正
  - generateOSAnalyzerUnifiedHTML()の正式呼び出し実装
  - 旧システム完全非活性化
  - 動作確認テスト
  優先度: P0 (即時)
  見積り: 30分
```

### **Phase 2: コア機能実装**

#### **T2-1: 8角形レーダーチャート実装**
```
要件:
- 8卦エネルギー（乾兌離震巽坎艮坤）の可視化
- SVG/Canvas2Dによる描画
- 縦長レイアウト対応
- モバイル対応

技術仕様:
- サイズ: 400x400px (デスクトップ), 300x300px (モバイル)
- データ: trigram_scores から 8卦バランス値取得
- 色彩: OS_COLORS による8卦色分け
- アニメーション: 0.8秒フェードイン

実装ファイル:
- 新規: /public/js/components/OSAnalyzer_RadarChart.js
- 統合: ScreenManager.generateOSAnalyzerUnifiedHTML()

優先度: P1
見積り: 4時間
依存: Phase 1完了
```

#### **T2-2: 3つのOS統合タイトル生成システム**
```
要件:
- Engine/Interface/Safe Mode OSの本質特性組み合わせ
- 64卦マッピングデータ(H64_DATA)活用
- 動的タイトル生成アルゴリズム

技術仕様:
- 入力: engineOS.hexagramId, interfaceOS.hexagramId, safeModeOS.hexagramId
- 処理: H64_DATA[id].essence + 組み合わせロジック
- 出力: "〇〇な創造者としての△△"形式タイトル

実装ファイル:
- 新規: /public/js/components/OSAnalyzer_TitleGenerator.js
- データ: H64_DATA essence フィールド活用

優先度: P1  
見積り: 3時間
依存: Phase 1完了
```

#### **T2-3: Safe Mode OS過剰状態可視化**
```
要件:
- OS_MANUAL_DATA.debug_pattern による"runaway"状態表示
- 艮(boundary defense), 坎(endurance), 坤(passive retreat)パターン
- ストレス警告UI

技術仕様:
- データソース: OS_MANUAL_DATA[safeModeOS.hexagramId].debug_pattern
- 条件: safeModeOS.score > 閾値(18.0) 時に警告表示
- UI: ⚠️アイコン + debug_pattern テキスト + debug_method

実装ファイル:
- 新規: /public/js/components/OSAnalyzer_StressAnalyzer.js
- 統合: ScreenManager stress-warning-section

優先度: P2
見積り: 2時間  
依存: Phase 1完了
```

### **Phase 3: データ連携強化**

#### **T3-1: H384データベース個人化アドバイス**
```
要件:
- H384_DATA keywords/modern_interpretation 活用
- ユーザーインタビュー結果反映（保留中機能）
- パーソナライゼーション基盤

技術仕様:
- データ取得: H384_DATA[hexagramId + lineId]
- フィルタリング: keywords による関連性スコア
- 表示: 「参考になるかもしれません」提案形式

実装ファイル:
- 新規: /public/js/components/OSAnalyzer_AdviceEngine.js
- 統合: advice-section への動的挿入

優先度: P3 (ユーザーインタビュー後)
見積り: 3時間
依存: ユーザー調査完了
```

### **Phase 4: UX/UI改善**

#### **T4-1: スクリーンショット最適化**
```
要件:
- 縦長1枚レイアウト完全対応
- CSS print media queries
- 共有ボタン機能

技術仕様:
- CSS: @media print 専用スタイル
- サイズ: 800px幅固定, 可変高さ
- 要素: ヘッダー/フッター最適化

見積り: 2時間
優先度: P2
```

#### **T4-2: アクセシビリティ対応**
```
要件:
- WCAG 2.1 AA準拠
- スクリーンリーダー対応
- キーボードナビゲーション

技術仕様:
- ARIA labels: 8卦名の音声読み上げ対応
- Focus management: タブ順序最適化
- Color contrast: 4.5:1以上確保

見積り: 3時間
優先度: P2
```

## 📊 実装スケジュール

### **即座実行（本日中）**
- **T1-1**: showResults()修正 → 統一システム有効化

### **Week 1（優先実装）**
- **T2-1**: 8角形レーダーチャート (P1)
- **T2-2**: 統合タイトル生成 (P1)

### **Week 2（機能完成）**  
- **T2-3**: ストレス状態可視化 (P2)
- **T4-1**: スクリーンショット最適化 (P2)
- **T4-2**: アクセシビリティ対応 (P2)

### **Week 3+（ユーザー調査後）**
- **T3-1**: H384個人化アドバイス (P3)

## 🔧 技術的依存関係

```
T1-1 (統一システム有効化)
  ↓
┌─ T2-1 (レーダーチャート)
├─ T2-2 (タイトル生成)  
├─ T2-3 (ストレス可視化)
├─ T4-1 (スクリーンショット)
└─ T4-2 (アクセシビリティ)
  ↓
T3-1 (H384アドバイス) ← ユーザーインタビュー結果待ち
```

## ✅ 結論

**現状**: 統一実装基盤完成済み、旧システム動作中
**即座修正**: showResults()メソッド1行修正で統一システム有効化可能
**実装準備**: 全コンポーネントの技術仕様・優先度・依存関係整理完了

統一実装体制下での効率的な機能開発が可能です。

---
*OSアナライザー統一実装体制 v2.2.2*