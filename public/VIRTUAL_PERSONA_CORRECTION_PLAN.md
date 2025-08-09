# VirtualPersona実装修正計画

## 現状の問題点

### 1. HaQei哲学との不整合
- **誤**: 3つの固定的ペルソナ（創造の探検家、調和の橋渡し、慎重な守護者）
- **正**: 64卦それぞれに対応した動的な仮想人格生成

### 2. Triple OSの正しい理解
- **Engine OS**: 内的価値観システム（Q1-Q24の分析結果）→ 64卦のいずれか
- **Interface OS**: 社会的パターン（Q25-Q30の分析結果）→ 64卦のいずれか  
- **SafeMode OS**: 防御パターン（Q25-Q30の分析結果）→ 64卦のいずれか

### 3. 分人戦略（Multiple Sub-Personality）
- 単一の固定的な性格ではなく、文脈に応じて変化する複数の分人
- 各OSは状況により異なる卦を示す可能性がある

## 正しい実装方針

### Phase 3 Week 2: 動的ペルソナ生成システム

#### 1. 64卦データベース活用
```javascript
// 各OSの結果に応じて、hexagrams.jsonから適切な卦を選択
const engineHexagram = hexagrams[engineOS.hexagramId - 1];
const interfaceHexagram = hexagrams[interfaceOS.hexagramId - 1];
const safeModeHexagram = hexagrams[safeModeOS.hexagramId - 1];

// 各卦のcatchphraseをペルソナ名として使用
const enginePersona = {
    name: engineHexagram.catchphrase,  // 例: "天翔ける龍のような、天性のリーダー"
    symbol: getSymbolForHexagram(engineHexagram.hexagram_id),
    traits: extractTraitsFromKeywords(engineHexagram.keywords),
    description: engineHexagram.description,
    hexagramName: engineHexagram.name_jp
};
```

#### 2. 動的シンボル割り当て
```javascript
// 8つの三爻に基づくシンボル体系
const trigramSymbols = {
    1: "☰", // 乾（天）- 創造的
    2: "☱", // 兌（沢）- 喜悦
    3: "☲", // 離（火）- 明晰
    4: "☳", // 震（雷）- 動的
    5: "☴", // 巽（風）- 柔軟
    6: "☵", // 坎（水）- 深遠
    7: "☶", // 艮（山）- 静止
    8: "☷"  // 坤（地）- 受容
};
```

#### 3. 文脈依存的な表現
```javascript
// 状況に応じて異なる側面を強調
function generateContextualPersona(hexagram, context) {
    const basePersona = hexagram.catchphrase;
    const contextualModifier = getContextModifier(context);
    
    return {
        currentExpression: `${context}における${basePersona}`,
        potentialShift: calculatePotentialChanges(hexagram),
        strategicAdvice: generateStrategicAdvice(hexagram, context)
    };
}
```

## 実装タスク

### 即時修正（DAY 2.5）
1. [ ] 固定ペルソナ名を削除
2. [ ] hexagrams.jsonとの連携実装
3. [ ] 動的ペルソナ生成関数の作成

### Phase 3 Week 2完全実装
1. [ ] 64卦すべてに対応したペルソナ生成
2. [ ] 変卦（へんか）システムの実装
3. [ ] 文脈依存的な表現システム
4. [ ] ペルソナ間の相互作用シミュレーション

## HaQei哲学準拠チェックリスト

- [ ] 単一の「真の自己」を示唆しない
- [ ] 複数の分人の共存を表現
- [ ] 状況により変化する可能性を示す
- [ ] 戦略的選択の余地を残す
- [ ] 易経の正統的解釈を尊重

## 期待される成果

1. **哲学的整合性**: HaQei分人戦略の正確な実装
2. **文化的正確性**: 易経64卦の正統的活用
3. **動的な体験**: ユーザーごとに異なる仮想人格生成
4. **戦略的価値**: 状況に応じた選択肢の提示

## 参照ドキュメント
- `/Users/nakanohideaki/Desktop/haqei-analyzer/public/data/hexagrams.json`
- `.serena/memories/haqei-philosophy-integration-requirements.md`
- `.serena/memories/HAQEI_Triple_OS_Requirements_Definition.md`