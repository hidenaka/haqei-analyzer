## H384_DATAキーワードを使った64卦OS診断実装 - 2025-08-11

### 実施内容

#### 1. 元々のタスク
- **目的**: H384_DATAのキーワードを使って64卦のOS診断結果を生成
- **要件**: 易経64卦の意味テキストは変更せず、ロジックのみ修正

#### 2. 実装した機能

##### 2.1 キーワード抽出メソッド (extractHexagramKeywords)
```javascript
// H384_DATAから該当卦番号のキーワードを収集
const hexagramEntries = H384_DATA.filter(entry => entry['卦番号'] === hexagramId);
const keywordSet = new Set();
hexagramEntries.forEach(entry => {
    if (entry['キーワード'] && Array.isArray(entry['キーワード'])) {
        entry['キーワード'].forEach(keyword => keywordSet.add(keyword));
    }
});
```

##### 2.2 OSタイプ別キーワード解釈 (generateOSInterpretation)
OSタイプごとに関連するキーワードをフィルタリング：

**Engine OS（内なる価値観）**
- 創造、探求、基礎、学習、成長、意志、目標、価値、潜在

**Interface OS（対人関係）**
- 調和、協力、信頼、交流、共感、理解、関係、コミュニケーション

**Safe Mode OS（防御システム）**
- 安定、保護、慎重、忍耐、回復、防御、休息、内省、静

##### 2.3 動的な解釈生成
```javascript
// OSタイプに応じた解釈
interpretation = `あなたの内なる動機は「${relevantKeywords.join('・')}」によって特徴づけられます。`;
advice = `これらの特性を活かして、自分らしい道を歩んでいきましょう。`;
```

##### 2.4 結果表示の強化
OSカードに以下を追加：
1. **キーワードセクション**: 最大5つのキーワードをタグ表示
2. **キーワード解釈セクション**: OSタイプ別の解釈と助言
3. **ビジュアル強化**: 色分けとグラデーション背景

#### 3. buildOSResultメソッドの拡張
```javascript
return {
    // 既存のフィールド
    type: osType,
    hexagramId: validHexagramId,
    keywords: hexagramData.keywords || [],
    
    // 新規追加フィールド
    keywordInterpretation: osInterpretation.interpretation,
    keywordAdvice: osInterpretation.advice,
    description: osInterpretation.description || hexagramData.description
};
```

#### 4. 実装の特徴
1. **既存テキスト保持**: 64卦の意味表現は変更なし
2. **動的解釈**: H384_DATAのキーワードから動的に解釈を生成
3. **OSタイプ最適化**: 各OSの特性に合わせたキーワード選択
4. **視覚的強化**: キーワードタグとグラデーション背景で見やすく

### 技術的詳細

#### データフロー
1. 診断完了 → buildOSResult呼び出し
2. getHexagramDataWithMeaning → extractHexagramKeywords
3. generateOSInterpretation → OSタイプ別フィルタリング
4. createEnhancedOSCard → キーワード表示

#### エラー処理
- H384_DATA未定義時のフォールバック
- キーワード空配列時のデフォルト値
- 不正な卦番号の範囲チェック

### 今後の拡張可能性
1. キーワード間の関連性分析
2. 複数の卦にまたがるキーワードパターン検出
3. ユーザーの選択傾向に基づくキーワード重み付け
4. 時系列でのキーワード変化追跡