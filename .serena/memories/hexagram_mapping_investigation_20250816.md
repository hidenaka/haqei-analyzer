# 易経マッピングロジック調査結果

**作業日時**: 2025年08月16日  
**作業者**: Claude Code Assistant  
**調査内容**: 動的易経マッピングのための既存実装調査

## 📋 発見された易経マッピングシステム

### 1. HexagramMappingEngine ✅
**場所**: `/public/js/pages/future-simulator/HexagramMappingEngine.js`
```javascript
class HexagramMappingEngine {
  async analyzeTextToHexagram(text) {
    // テキストから卦を選択
    const keywords = await this.extractKeywords(text);
    const sentiment = await this.analyzeSentiment(text);
    const context = await this.analyzeContext(text);
    const hexagramNumber = this.calculateHexagramNumber(keywords, sentiment, context);
    return { number: hexagramNumber, ... };
  }
}
```

### 2. BinaryTreeCompleteDisplay.analyzeTextToSelectHexagram ✅
**場所**: `/public/js/binary-tree-complete-display.js`
```javascript
analyzeTextToSelectHexagram: function(inputText) {
  // 感情・状況・キーワード分析
  const emotionAnalysis = this.analyzeEmotionalContent(inputText);
  const situationAnalysis = this.analyzeSituationalContext(inputText);
  const keywordAnalysis = this.analyzeKeywords(inputText);
  
  // 64卦から最適なものを選択
  const hexagramSelection = this.selectHexagramFromAnalysis(
    emotionAnalysis, 
    situationAnalysis, 
    keywordAnalysis
  );
  return hexagramSelection;
}
```

### 3. PatternMapper ✅
**場所**: `/public/js/core/PatternMapper.js`
```javascript
class PatternMapper {
  mapToHexagram(decimalId) {
    // 512パターンを64卦にマッピング（8パターンごとに1卦）
    const hexagramId = Math.floor(decimalId / 8) + 1;
    return hexagramId;
  }
}
```

### 4. selectHexagramFromAnalysis詳細 ✅
**感情×状況×キーワードによるマトリックス選択**
```javascript
const hexagramMatrix = {
  work: {
    positive: { high_action: 1, high_stability: 11, high_growth: 42 },
    negative: { high_conflict: 6, high_change: 16, high_harmony: 15 },
    seeking: { high_action: 25, high_growth: 32, high_stability: 23 }
  },
  relationship: {
    positive: { high_action: 30, high_stability: 58, high_growth: 61 },
    negative: { high_conflict: 38, high_change: 41, high_harmony: 58 },
    seeking: { high_action: 31, high_growth: 54, high_stability: 32 }
  }
  // ... 他のカテゴリ
};
```

## 🔧 実装した統合ロジック

### 優先順位付き易経マッピング
```javascript
// 1. HexagramMappingEngine（最優先）
// 2. BinaryTreeCompleteDisplay（第2優先）
// 3. PatternMapper（第3優先）
// 4. ランダム選択（フォールバック）
```

### 爻の動的選択
```javascript
// キーワードの重要度に基づいて爻を選択
const yaoIndex = dynamicKeywords?.final?.[0]?.importance 
  ? Math.min(Math.floor(dynamicKeywords.final[0].importance * 6) + 1, 6)
  : Math.floor(Math.random() * 6) + 1;
```

## ⚠️ 現在の問題

### 固定結果が続く原因
1. **IChingSimulatorが常にnull**: ichingSimulator.analyzeSituationが動作しない
2. **フォールバック処理が毎回実行**: 補完ロジックは実装したが、メインの分析が動作しない
3. **H384データベース未連携**: hexagramデータへのアクセスが不完全

## 🎯 解決策

### 実装済み
- ✅ HexagramMappingEngine統合
- ✅ BinaryTreeCompleteDisplay統合
- ✅ PatternMapper統合
- ✅ 動的爻選択ロジック

### 要修正
- ⚠️ IChingSimulatorの初期化タイミング
- ⚠️ H384データベースの完全統合
- ⚠️ 各エンジンの初期化処理

## 📈 期待される効果

動的マッピングが完全動作すれば：
- 入力内容に応じた64卦の選択
- キーワード重要度による爻の決定
- 感情×状況×キーワードの3次元分析
- 512パターンからの精密マッピング

---

**記録日時**: 2025年08月16日 16:30  
**次回アクション**: IChingSimulator初期化の修正