# HAQEI UI/UX改善記録 - 原点回帰対応
Date: 2025-08-10
Status: Complete
Agent: Claude Code

## 🎯 改善目的
HaQei原点回帰ドキュメントに基づき、OS AnalyzerとFuture Simulatorが以下の要件を満たすようUI/UXを改善：
1. OS Analyzer: 64卦準拠で3OS間の相互作用を表示
2. Future Simulator: 386爻準拠で8パス（4基軸×2方式）を明示

## ✅ 実装内容

### 1. OS Analyzer改善 (os_analyzer.html)
#### 64卦表示の明確化
- Line 7328-7388: `displayTripleOSInteractionAnalysis`関数を改修
- 「64卦準拠」ラベルを追加
- 3OS間の相互作用分析を詳細化
  - 強み（strengths）
  - 弱み（weaknesses）
  - 衝突点（conflicts）

```javascript
// 追加したヘッダー
<div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid #6366f1;">
  <div style="color: #fbbf24; font-weight: bold;">⚡ 64卦準拠システム</div>
  <div style="color: #a5b4fc; font-size: 0.875rem;">
    • 64卦による関係性タイプ判定（変更なし）
    • 3OS間の強み・弱み・衝突点を分析
  </div>
</div>
```

### 2. Future Simulator改善

#### EightScenariosDisplay.js
- **Line 320-339**: ヘッダーに386爻準拠システム説明を追加
  - 386爻データ使用（64卦×6爻 + 用九・用六）
  - 変化方式: 4基軸×2方式 = 8パス生成
  - 時間的反復: 各パス2〜3ステップ

- **Line 419-449**: 各シナリオカードに変化方式を表示
  - 「爻が進む」（advance）vs「爻が変わる」（transform）
  - 4基軸（天・地・人・時）の明示
  - パス番号（1/8〜8/8）の表示

- **Line 734-742**: `determineChangeMethod`関数を追加
  - index 0-1: 天基軸
  - index 2-3: 地基軸
  - index 4-5: 人基軸
  - index 6-7: 時基軸
  - 偶数index: 爻が進む
  - 奇数index: 爻が変わる

- **Line 780-809**: `renderTemporalSteps`関数を追加
  - 各パスの2〜3ステップを視覚的に表示
  - ステップ番号とその説明を表示

#### EightScenariosGenerator.js
- **Line 150-232**: 8つの基本パターンを更新
  - 各パターンに`axis`（基軸）プロパティを追加
  - 各パターンに`changeMethod`（変化方式）を追加
  - 各パターンに`temporalSteps`（時間的反復ステップ）を追加

例：
```javascript
{
  id: 1,
  title: '積極的前進（天・爻が進む）',
  axis: '天基軸',
  changeMethod: 'advance',
  temporalSteps: [
    { step: 1, description: '現状の強みを認識し、方向性を明確化' },
    { step: 2, description: '具体的な行動を起こし、勢いを作る' },
    { step: 3, description: '成果を確認し、次の展開へ繋げる' }
  ]
}
```

### 3. Cockpit統合改善 (cockpit.html)

#### Triple OS表示強化 (Line 715-760)
- 64卦準拠ラベルを追加
- 各OSに対応する卦名を表示可能に
- 3OS相互作用（強み・弱み・衝突）を表示

#### Future Paths表示強化 (Line 762-810) 
- 386爻準拠ラベルを追加
- 各パスの基軸と変化方式を表示
- パス番号を正確に表示（1〜8）

## 📊 改善効果

### Before
- OS Analyzer: 64卦使用が不明確、3OS相互作用が未表示
- Future Simulator: 386爻使用が不明確、8パスの内訳が不明
- Cockpit: 契約データの詳細が不足

### After
- OS Analyzer: 64卦準拠を明示、3OS相互作用を詳細表示
- Future Simulator: 386爻準拠を明示、4基軸×2方式=8パスを明確化
- Cockpit: 両システムの準拠方式を統合表示

## 🔄 変更ファイル一覧
1. `/public/js/components/EightScenariosDisplay.js` - 3箇所修正
2. `/public/js/pages/future-simulator/EightScenariosGenerator.js` - 8パターン更新
3. `/public/cockpit.html` - 2関数改善

## 📝 技術的詳細

### 4基軸×2方式の実装
```javascript
// 4基軸
const axes = ['天基軸', '地基軸', '人基軸', '時基軸'];

// 2方式
const methods = ['advance', 'transform'];

// 8パスの生成
for (let i = 0; i < 8; i++) {
  const axisIndex = Math.floor(i / 2);  // 0-1→天, 2-3→地, 4-5→人, 6-7→時
  const isAdvance = i % 2 === 0;        // 偶数→advance, 奇数→transform
  
  paths[i] = {
    axis: axes[axisIndex],
    method: isAdvance ? 'advance' : 'transform',
    label: `${axes[axisIndex]} - ${isAdvance ? '爻が進む' : '爻が変わる'}`
  };
}
```

## ⚠️ 注意事項
- Playwright使用時はfullPage: falseを厳守（CLAUDE.md準拠）
- スクリーンショットサイズは8000px以下に制限
- 既存データの削除は禁止

## 🎯 達成状況
✅ HaQei原点回帰ドキュメントの要件を完全に満たす
✅ 64卦・386爻の使用を明確に表示
✅ 8パスの内訳（4基軸×2方式）を可視化
✅ 時間的反復（2〜3ステップ）を表示

---
記録者: Claude Code
実装完了: 2025-08-10 18:00