# Future Simulator 設計体制構築フレームワーク

**作成日**: 2025年8月16日  
**対象**: Future Simulator統一感のある表現改善実装  
**目的**: 悩み解決視点での予測・推測表現システム構築

---

## 🎯 設計コンセプト統一

### コアメッセージ
**「HaQeiロジックによる状況変化の予測可能性」**

### 表現トーン統一方針
1. **予測・推測中心**: 「〜になると予測されます」「〜が見込まれます」
2. **分析的かつ親しみやすい**: 専門性を保ちつつ理解しやすく
3. **悩み解決視点**: ユーザーの感情に配慮した表現

---

## 📋 既存資産分析

### 利用可能なデータソース
```javascript
// H384データベース構造
{
  '通し番号': 99,
  '卦名': '沢雷随', 
  '爻': '初九',
  'キーワード': ['交流', '吉', '変化への対応'],  // ← 活用対象
  '現代解釈の要約': '時代の変化...',           // ← 活用対象
  'S7_総合評価スコア': 32,                    // ← スコア計算
  'S5_主体性推奨スタンス': '能動'              // ← 行動指針
}
```

### 実装済み機能
- ✅ 8パターン生成ロジック（進爻/変爻 2³組み合わせ）
- ✅ Chart.jsグラフ表示
- ✅ モーダル詳細表示
- ✅ カードグリッドレイアウト

---

## 🛠 表現改善要求仕様

### 1. リスク・リターン表現（混合型）
```
テンプレート:
「[期間の性質]には[必要な取り組み]が必要ですが、[期待される結果]が予測されます」

具体例:
「短期的には努力が必要な時期ですが、HaQei分析では大幅な改善が期待できます」
```

### 2. スコア変化の感情配慮表現
```javascript
const phaseExpressions = {
  positive: (score) => `順調な発展期（+${score}点）`,
  negative: (score) => `準備・調整期（${score}点）`,
  neutral: (score) => `安定継続期（${score}点）`
};
```

### 3. 戦略タイプ視覚化
```
🛡️ 安定重視型: リスクを最小化した着実な改善
🚀 成長重視型: 一時的困難を受け入れた大幅改善  
⚖️ バランス型: リスクとリターンの調和
```

### 4. 情報優先順位
```
1. 最終結果（スコア・戦略タイプ）
2. 過程の特徴（リスク・リターン説明）
3. 論理的根拠（HaQeiロジック）
4. 詳細データ（各フェーズ分析）
```

---

## 🎨 統一UIデザイン指針

### カラーパレット
```css
:root {
  --primary-bg: #1a1a2e;
  --secondary-bg: #16213e;
  --accent-color: #e94560;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --text-primary: #eee;
  --text-secondary: #9ca3af;
}
```

### アイコン統一規則
```
📈 上昇トレンド
📊 安定トレンド  
📉 注意トレンド
🛡️ 安定重視型
🚀 成長重視型
⚖️ バランス型
💡 論理的根拠
🎯 行動指針
```

---

## 🔧 実装テンプレート

### 1. フェーズ説明生成
```javascript
generatePhaseDescription(phaseData, previousPhase, action) {
  const keyword = phaseData['キーワード'][0];
  const interpretation = phaseData['現代解釈の要約'];
  const score = phaseData['S7_総合評価スコア'];
  const stance = phaseData['S5_主体性推奨スタンス'];
  
  // スコア変化分析
  const scoreDiff = score - previousPhase.score;
  const difficulty = this.calculateDifficulty(scoreDiff);
  const trend = this.analyzeTrend(scoreDiff);
  
  return {
    title: `${keyword}を重視する${this.getPhaseName(scoreDiff)}`,
    description: this.adaptInterpretation(interpretation),
    guidance: this.generateGuidance(stance, trend),
    score: score,
    difficulty: difficulty,
    prediction: this.generatePrediction(scoreDiff, action)
  };
}
```

### 2. 予測表現パターン
```javascript
const predictionPatterns = {
  improvement: 'HaQei分析によると、この選択により状況の改善が予測されます',
  stability: 'この道筋では安定した状況の継続が見込まれます',
  challenge: '一時的な困難はありますが、その後の好転が期待できます',
  growth: '段階的な成長を通じて、大きな発展が予測されます'
};
```

### 3. 統一エラーハンドリング
```javascript
// フォールバック表現
const fallbackExpressions = {
  noData: 'HaQeiロジックに基づく分析を実行中です',
  lowConfidence: 'この状況では慎重な観察が推奨されます',
  processing: '状況変化のパターンを分析しています'
};
```

---

## 📊 品質保証基準

### 表現品質チェックリスト
- [ ] 予測・推測トーンの一貫性
- [ ] 感情配慮表現の適切性
- [ ] HaQeiロジック言及の自然さ
- [ ] 視覚的階層の統一性
- [ ] アイコン使用の一貫性

### パフォーマンス基準
- [ ] 8パターン生成: 2秒以内
- [ ] グラフ描画: 1秒以内
- [ ] モーダル表示: 0.5秒以内
- [ ] レスポンシブ対応: 全デバイス

---

## 🚀 実装フェーズ計画

### Phase 1: 表現エンジン構築
1. 統一テンプレート実装
2. 予測表現パターン作成
3. 感情配慮ロジック組み込み

### Phase 2: UI統一性向上
1. 戦略タイプアイコン実装
2. カラーパレット統一適用
3. レスポンシブ調整

### Phase 3: 統合テスト
1. 全パターン表現確認
2. エッジケース対応
3. パフォーマンス最適化

---

## 📝 ドキュメント管理規則

### 変更履歴記録
- 全変更を`.serena/memories/`に記録
- ファイル名: `future_simulator_expression_improvement_YYYYMMDD.md`
- 設計判断の理由を明記

### コード規約
- 統一コメント形式
- 予測表現メソッドの命名規則
- エラーハンドリング統一

---

この設計フレームワークに基づき、統一感のあるFuture Simulator表現改善を実装します。