# HaQei Analyzer「自己の運用戦略システム」技術仕様書

## 🎯 プロジェクトの根本的目的

> 「ユーザーが自らの複雑さを、複雑なまま理解し、実生活で使いこなすための、実践的な思想ツールを創る」

### 核心的価値提案
- **目的**: タイプ分類ではなく、**パーソナルな取扱説明書**の提供
- **手段**: 易経を直感的理解のための**メタファー言語**として活用
- **成果**: 人生という複雑なシステムの主体的マネジメント能力の獲得

---

## 📋 機能要件定義

### 1. UI/UXアーキテクチャ: 「3OS統合戦略ダッシュボード」

#### 1.1 レイアウト構成: 左中右3パネル設計

```
┌─────────────────────────────────────────────────────────────┐
│ AIパーソナル運用戦略サマリー（上部横断）                      │
├─────────────┬─────────────────┬─────────────────────────────┤
│ 左パネル    │ 中央パネル      │ 右パネル                    │
│ エンジンOS  │ インターフェースOS│ セーフモードOS              │
│ 魂の動機    │ 社会的役割      │ 自己防衛機能                │
└─────────────┴─────────────────┴─────────────────────────────┘
```

#### 1.2 左パネル: 【魂のエンジンOS】仕様

**表示項目:**
- **OS名とキャッチフレーズ**: `engineOS.osName` + `hexagramInfo.catchphrase`
- **根源的動機キーワード**: `engine.core_drive`を3-4キーワードに分解
- **AIモチベーション・ステートメント**: 一人称での力強い動機文生成
- **エネルギー管理法**: 具体的なモチベーション維持ヒント

**技術実装要件:**
```javascript
// データソース: HEXAGRAM_DETAILS[id].engine
{
  strength_meter: number,     // 0-100
  core_drive: string,         // AI生成のベース
  potential_strengths: array, // 強み一覧
  potential_weaknesses: array // 課題一覧  
}
```

#### 1.3 中央パネル: 【世界との接続インターフェースOS】仕様

**表示項目:**
- **OS名とキャッチフレーズ**: `interfaceOS.osName` + `hexagramInfo.catchphrase`
- **推奨される役回り・立場**: `interface.behavioral_patterns`から推論
- **警告ゾーン（苦手な環境）**: `interface.impression_on_others`から逆算
- **最適化戦略**: そのOSが最も輝く条件の提示

**技術実装要件:**
```javascript
// データソース: HEXAGRAM_DETAILS[id].interface  
{
  how_it_appears: string,      // 外見的特徴
  behavioral_patterns: array,  // 行動パターン
  impression_on_others: string // 他者への印象
}
```

#### 1.4 右パネル: 【心のセーフモードOS】仕様

**表示項目:**
- **OS名とキャッチフレーズ**: `safeModeOS.osName` + `hexagramInfo.catchphrase`
- **起動トリガー**: `safe_mode.trigger_situations`の具体的提示
- **典型的な言動パターン**: `safe_mode.defensive_patterns`の詳細化
- **安全再起動手順**: 健全状態への復帰方法の具体的アクション

**技術実装要件:**
```javascript
// データソース: HEXAGRAM_DETAILS[id].safe_mode
{
  trigger_situations: array,   // 発動条件
  defensive_patterns: array,   // 防御行動
  internal_state: string      // 内面状態
}
```

### 2. AIパーソナル戦略生成システム

#### 2.1 生成する4つの核心質問への回答

1. **あなたの根源的な強みは何か？**
   - エンジンOSの`core_drive`と`potential_strengths`を統合
   - 一人称での説得力のある説明文生成

2. **その強みを最も活かせる役回り・役割は何か？**
   - インターフェースOSの特性から最適環境を推論
   - 具体的な職種・立場・シチュエーションの提示

3. **なぜ、あなたは時々「らしくない」振る舞いをしてしまうのか？**
   - セーフモードOSの発動メカニズムの解説
   - トリガー→行動→結果のパターン分析

4. **実践的な対処法・活用法は何か？**
   - 3OS統合による具体的な人生戦略
   - 日常で実行可能なアクションプラン

#### 2.2 AI生成プロンプトテンプレート構造

```javascript
const STRATEGY_PROMPT_TEMPLATE = {
  persona: "賢明で、共感的な相談役",
  context: {
    engineOS: "ユーザーの核心的動機",
    interfaceOS: "ユーザーの社会的表現",  
    safeModeOS: "ユーザーの防御機制",
    userConcern: "未来予測で入力された悩み"
  },
  outputFormat: {
    tone: "一人称での語りかけ",
    length: "各質問200-300文字",
    structure: "結論→理由→具体例の順"
  }
}
```

### 3. OS間動力学のインタラクティブ可視化

#### 3.1 視覚的表現方式

**SVGベースの動的接続線:**
- エンジン↔インターフェース間の関係線
- エンジン↔セーフモード間の関係線
- 関係の種類（相生・相剋・調和・緊張）による色分け

**エネルギーフローアニメーション:**
```css
/* 例: 相生関係の表現 */
.energy-flow-harmony {
  stroke: #4ade80;  /* 緑: 調和 */
  stroke-dasharray: 5,5;
  animation: flowHarmony 2s linear infinite;
}

/* 例: 相剋関係の表現 */  
.energy-flow-conflict {
  stroke: #f87171;  /* 赤: 葛藤 */
  stroke-dasharray: 3,7;
  animation: flowConflict 1.5s ease-in-out infinite;
}
```

#### 3.2 インタラクティブ要素

**ホバー・クリック時のツールチップ:**
- 関係線にマウスオーバー→動的解説テキスト表示
- 「あなたの『貢献』のエンジンは、この『慎重な』インターフェースに安定したエネルギーを供給しますが、時にブレーキをかけすぎてしまうことがあります」

**技術実装要件:**
```javascript
// TRIGRAM_INTERACTIONSデータ活用
const osInteraction = {
  relationship: "harmony|conflict|tension|support",
  strength: 0.0-1.0,
  description: "動的生成される関係性解説",
  practicalImplication: "実生活での影響・活用法"
}
```

---

## 🎨 デザイン・UX要件

### 1. 視覚的階層

#### 1.1 色彩戦略
- **エンジンOS**: 暖色系（赤・オレンジ）- エネルギー・情熱を表現
- **インターフェースOS**: 中性色系（青・緑）- 安定・信頼を表現  
- **セーフモードOS**: 寒色系（紫・グレー）- 保護・内省を表現

#### 1.2 タイポグラフィ
- **メインフォント**: Inter（可読性重視）
- **アクセントフォント**: Shippori Mincho（易経の雰囲気）
- **サイズヒエラルキー**: 
  - H1: 2.5rem（OS名）
  - H2: 1.8rem（セクションタイトル）
  - Body: 1rem（説明文）

### 2. レスポンシブ戦略

#### 2.1 ブレークポイント設計
```css
/* デスクトップ: 3パネル横並び */
@media (min-width: 1024px) {
  .strategic-dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
}

/* タブレット: 2+1段構成 */  
@media (min-width: 768px) and (max-width: 1023px) {
  .strategic-dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
  .safemode-panel {
    grid-column: 1 / -1;
  }
}

/* モバイル: 縦積み */
@media (max-width: 767px) {
  .strategic-dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}
```

### 3. アニメーション・マイクロインタラクション

#### 3.1 ページ遷移
- **フェードイン**: 各パネルが順次表示（左→中→右の順）
- **イージング**: `cubic-bezier(0.4, 0, 0.2, 1)` で自然な動き

#### 3.2 データ更新時の視覚フィードバック
- **ローディング状態**: スケルトンUI表示
- **成功状態**: 緑色の短いハイライト
- **エラー状態**: 赤色の境界線+エラーメッセージ

---

## 🔧 技術アーキテクチャ要件

### 1. コンポーネント設計

#### 1.1 新規作成コンポーネント
```javascript
// メインダッシュボード
class TripleOSStrategicView extends BaseComponent {
  // 3パネル統合管理
}

// AI戦略生成
class PersonalStrategyAI {
  // プロンプト管理、テキスト生成
}

// 相互作用可視化  
class InteractiveConnectionsVisualizer {
  // SVG描画、アニメーション制御
}

// 各パネル
class EngineOSPanel extends BaseComponent {}
class InterfaceOSPanel extends BaseComponent {}  
class SafeModeOSPanel extends BaseComponent {}
```

#### 1.2 データフロー
```
User Input → TripleOSEngine → AnalysisResult
    ↓
TripleOSStrategicView → PersonalStrategyAI → Strategy Summary
    ↓
[EngineOSPanel] [InterfaceOSPanel] [SafeModeOSPanel]
    ↓
InteractiveConnectionsVisualizer → SVG Connections
```

### 2. パフォーマンス要件

#### 2.1 読み込み時間目標
- **初期表示**: 2秒以内
- **AI生成**: 3秒以内  
- **パネル遷移**: 300ms以内

#### 2.2 最適化戦略
```javascript
// 遅延読み込み
const lazyLoadStrategySummary = async () => {
  // 基本表示後にAI生成を開始
  await new Promise(resolve => setTimeout(resolve, 100));
  return await generateStrategySummary();
};

// メモ化
const memoizedOSAnalysis = new Map();
const getCachedAnalysis = (key) => {
  if (!memoizedOSAnalysis.has(key)) {
    memoizedOSAnalysis.set(key, analyzeOS(key));
  }
  return memoizedOSAnalysis.get(key);
};
```

### 3. データ管理要件

#### 3.1 拡張が必要なデータ構造

**HEXAGRAM_DETAILS拡張:**
```javascript
// 残り63卦分のデータ追加必要
const HEXAGRAM_DETAILS = {
  1: { /* 現在完成済み */ },
  2: { 
    name_jp: "坤為地（こんいち）",
    // engine/interface/safe_mode完全実装
  },
  // ... 3-64番まで
}
```

**AI生成用メタデータ追加:**
```javascript
// 各卦に追加
meta: {
  aiPromptKeywords: ["キーワード1", "キーワード2"],
  contextualHints: "AI生成時の参考情報",
  practicalApplications: ["具体的活用例1", "具体的活用例2"]
}
```

---

## 📊 品質保証要件

### 1. ユーザー体験品質

#### 1.1 「腑に落ちる」体験の設計指標
- **理解度指標**: ユーザーが自身の行動パターンを言語化できる
- **実用性指標**: 日常生活で参考にできる具体的アドバイスの提供
- **共感度指標**: AI生成文章が「自分のことを言われている」と感じられる

#### 1.2 エラーハンドリング戦略
```javascript
// グレースフルデグラデーション
const safeRenderStrategy = {
  primary: "完全なAI生成戦略表示",
  fallback1: "テンプレートベース戦略表示", 
  fallback2: "基本データのみ表示",
  emergency: "エラーメッセージ + 再試行ボタン"
}
```

### 2. 技術品質要件

#### 2.1 コード品質
- **モジュラリティ**: 各コンポーネントが独立して動作
- **拡張性**: 新しいOS分析パターンの追加が容易
- **保守性**: ビルドレスでの動作、明確なドキュメント

#### 2.2 互換性
- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **デバイス**: デスクトップ、タブレット、スマートフォン
- **アクセシビリティ**: WCAG 2.1 AA準拠

---

## 🎯 成功指標・検証方法

### 1. 機能完成度指標
- [ ] 3OS統合ダッシュボード完全実装
- [ ] AIパーソナル戦略サマリー生成機能
- [ ] OS間動力学のインタラクティブ可視化
- [ ] レスポンシブ対応完了
- [ ] 64卦分のデータ完全化

### 2. 品質指標
- [ ] ページ読み込み3秒以内
- [ ] AI生成テキストの品質確保（共感度・実用性）
- [ ] エラー率1%以下
- [ ] アクセシビリティ要件充足

### 3. ユーザー体験指標  
- [ ] 初回利用時の「腑に落ちる」感覚の創出
- [ ] 具体的で実行可能なアドバイスの提供
- [ ] 複雑な自己理解の直感的把握の実現

---

**最終更新**: 2025-07-26  
**ステータス**: 実装開始  
**次回レビュー**: Phase 1完了時