# 🚨 URGENT: Design & Data Integration Issues - CRITICAL FIX REQUIRED

## 現在の重大な問題

### 1. **システム競合 - 2つの表示システムが同時動作**
- **新システム**: BinaryTreeCompleteDisplay - H384データベース連動、動的生成
- **旧システム**: ProgressiveLoader - 固定8シナリオ、静的表示

### 2. **データ連動問題**
```javascript
// ❌ 問題: 固定されたシナリオ (future_simulator.html lines 1816-1839)
generateEnhancedScenarios() {
  return [
    { text: '現状維持を選択し、安定的な成長を目指す道', hint: 'リスクを最小限...' },
    { text: '積極的な変化を求めて新たな挑戦を始める道', hint: '成長機会...' },
    // ... 8個の固定シナリオ
  ];
}
```

```javascript
// ✅ 正しい: H384データベース連動 (BinaryTreeFutureEngine)
const lineData = H384_DATA.find(item => item.通し番号 === currentLine);
// 実際の易経データから動的生成
```

### 3. **表示の問題**
- **新システム**: 美しいChart.js可視化 + HaQei哲学統合
- **旧システム**: 単純なHTML + 固定推奨度バー

## 解決方針

### Phase 1: 古いシステム無効化
1. ProgressiveLoader.displayResults() を無効化
2. 古い固定シナリオ表示を削除

### Phase 2: データ連動強化
1. H384データベースの実データを表示に反映
2. 卦名、爻名、現代解釈を正しく表示
3. 通し番号ベースの動的確率計算

### Phase 3: デザイン統合
1. BinaryTreeCompleteDisplayのデザインを保持
2. H384データとの完全連動
3. レスポンシブ対応

## 絶対要件
1. **H384データベース完全連動**: 通し番号 → 卦名/爻名/解釈
2. **単一システム**: 1つの統合されたDisplay system
3. **美しいデザイン**: Chart.js + 現代的UI
4. **動的データ**: 固定値ではなく実データ連動

Status: CRITICAL - 即座修正必要
Priority: P0 - 最優先