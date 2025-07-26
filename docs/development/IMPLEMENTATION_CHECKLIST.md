# HaQei Analyzer「自己の運用戦略システム」実装チェックリスト

## 📋 Phase 0: 要件ドキュメント化

### ドキュメント作成
- [x] **STRATEGIC_UI_REQUIREMENTS.md**: 技術仕様書完成
- [ ] **AI_PROMPT_TEMPLATES.md**: AI生成プロンプト集
- [ ] **実装完了時の解説書**: ユーザー向けガイド

**品質チェック:**
- [x] 要件が技術仕様として具体化されている
- [x] 各コンポーネントの責任が明確に定義されている
- [x] データ構造の拡張要件が明確になっている

---

## 🎯 Phase 1: 3OS統合ダッシュボードの構築

### 1.1 TripleOSStrategicView.js基本実装

**作成するファイル:**
- [ ] `/public/new-analyzer/js/components/TripleOSStrategicView.js`

**実装チェックポイント:**
```javascript
class TripleOSStrategicView extends BaseComponent {
  // [ ] constructor: analysisResult, dataManager等の受け取り
  // [ ] render(): 3パネル構成のHTML生成
  // [ ] _renderEnginePanel(): 左パネル実装
  // [ ] _renderInterfacePanel(): 中央パネル実装  
  // [ ] _renderSafeModePanel(): 右パネル実装
  // [ ] _postRender(): パネル間相互作用の初期化
}
```

**データ連携チェック:**
- [ ] `this.analysisResult.engineOS`からの正常なデータ取得
- [ ] `this.analysisResult.interfaceOS`からの正常なデータ取得
- [ ] `this.analysisResult.safeModeOS`からの正常なデータ取得
- [ ] `this.dataManager.getHexagramDetails()`との連携

### 1.2 3パネルCSS Grid Layout設計

**作成するファイル:**
- [ ] `/public/new-analyzer/css/strategic-dashboard.css`

**レイアウトチェック:**
```css
/* [ ] デスクトップ: 3パネル横並び */
.strategic-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}

/* [ ] タブレット: 2+1段構成 */
@media (min-width: 768px) and (max-width: 1023px) {
  .strategic-dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
}

/* [ ] モバイル: 縦積み */
@media (max-width: 767px) {
  .strategic-dashboard {
    display: flex;
    flex-direction: column;
  }
}
```

**パネル個別スタイル:**
- [ ] **.engine-panel**: 暖色系（赤・オレンジ）テーマ
- [ ] **.interface-panel**: 中性色系（青・緑）テーマ
- [ ] **.safemode-panel**: 寒色系（紫・グレー）テーマ

### 1.3 analyzer.html統合

**更新するファイル:**
- [ ] `/public/new-analyzer/analyzer.html`

**統合チェック:**
- [ ] strategic-dashboard.cssの読み込み追加
- [ ] TripleOSStrategicView.jsの読み込み追加
- [ ] 既存のTripleOSResultsViewからの移行処理

**動作確認:**
- [ ] 診断完了時に3パネル構成で表示される
- [ ] レスポンシブ動作が正常（デスクトップ・タブレット・モバイル）
- [ ] 各パネルに正しいデータが表示される

---

## 🤖 Phase 2: AIパーソナル戦略生成システム

### 2.1 PersonalStrategyAI.js実装

**作成するファイル:**
- [ ] `/public/new-analyzer/js/core/PersonalStrategyAI.js`

**クラス構造チェック:**
```javascript
class PersonalStrategyAI {
  // [ ] constructor: プロンプトテンプレートの初期化
  // [ ] generateStrategySummary(): 4つの核心質問への回答生成
  // [ ] _generateRootStrength(): 根源的強みの説明
  // [ ] _generateOptimalRole(): 最適な役回りの提案
  // [ ] _generateDefensivePattern(): 防御パターンの解説
  // [ ] _generatePracticalAdvice(): 実践的アドバイス
}
```

**AI生成品質チェック:**
- [ ] **一人称での語りかけ**: 「あなたは...」ではなく「私は...」
- [ ] **共感的なトーン**: 理解・受容的な言葉遣い
- [ ] **具体性**: 抽象的でなく実践可能なアドバイス
- [ ] **文字数**: 各質問200-300文字程度

### 2.2 プロンプトテンプレート完成

**プロンプト構造チェック:**
- [ ] **ペルソナ設定**: 「賢明で共感的な相談役」の一貫性
- [ ] **コンテキスト活用**: 3OSデータの効果的な統合
- [ ] **出力形式**: 結論→理由→具体例の構造
- [ ] **エラーハンドリング**: データ不足時のフォールバック

### 2.3 TripleOSStrategicViewとの統合

**統合チェック:**
- [ ] AI生成処理の非同期実行
- [ ] ローディング表示の実装
- [ ] 生成エラー時のフォールバック表示
- [ ] 再生成機能の実装

---

## 🔗 Phase 3: OS間動力学の可視化

### 3.1 InteractiveConnectionsVisualizer.js実装

**作成するファイル:**
- [ ] `/public/new-analyzer/js/components/InteractiveConnectionsVisualizer.js`

**SVG描画チェック:**
```javascript
class InteractiveConnectionsVisualizer {
  // [ ] constructor: SVG要素の初期化
  // [ ] renderConnections(): 全体の接続線描画
  // [ ] _drawEngineInterfaceLine(): エンジン↔インターフェース線
  // [ ] _drawEngineSafeModeLine(): エンジン↔セーフモード線
  // [ ] _attachInteractivity(): ホバー・クリック処理
}
```

**視覚的表現チェック:**
- [ ] **相生関係**: 緑色、流れるアニメーション
- [ ] **相剋関係**: 赤色、断続的アニメーション
- [ ] **調和関係**: 青色、穏やかなアニメーション
- [ ] **緊張関係**: オレンジ色、振動アニメーション

### 3.2 インタラクティブ機能

**インタラクションチェック:**
- [ ] **ホバー効果**: 関係線の強調表示
- [ ] **ツールチップ表示**: 動的解説テキスト
- [ ] **クリック機能**: 詳細情報モーダル表示
- [ ] **アニメーション制御**: スムーズな状態遷移

### 3.3 TRIGRAM_INTERACTIONSデータ活用

**データ統合チェック:**
- [ ] 既存の相性データとの連携
- [ ] OS間関係スコアの正確な反映
- [ ] 実践的含意の適切な表示

---

## 📚 Phase 4: データ拡充・最適化

### 4.1 HEXAGRAM_DETAILS拡充

**データ作成チェック:**
```javascript
// 各卦（2-64番）に必要な構造
{
  name_jp: string,
  catchphrase: string,
  description: string,
  keywords: array,
  engine: {
    strength_meter: number,
    core_drive: string,
    potential_strengths: array,
    potential_weaknesses: array
  },
  interface: {
    how_it_appears: string,
    behavioral_patterns: array,
    impression_on_others: string
  },
  safe_mode: {
    trigger_situations: array,
    defensive_patterns: array,
    internal_state: string
  }
}
```

**品質確認:**
- [ ] **一貫性**: 全64卦で構造が統一されている
- [ ] **網羅性**: engine/interface/safe_mode全てが記述されている
- [ ] **品質**: 具体的で実用的な内容になっている

### 4.2 パフォーマンス最適化

**最適化チェック:**
- [ ] **遅延読み込み**: AI生成の段階的実行
- [ ] **メモ化**: 計算結果のキャッシュ機能
- [ ] **バンドルサイズ**: 不要なコードの除去
- [ ] **読み込み時間**: 3秒以内の目標達成

### 4.3 エラーハンドリング強化

**堅牢性チェック:**
- [ ] **データ不足**: 適切なフォールバック表示
- [ ] **AI生成失敗**: エラーメッセージと再試行機能
- [ ] **ネットワークエラー**: オフライン対応
- [ ] **ブラウザ互換性**: 古いブラウザでの動作確認

---

## 🔍 統合テスト・品質保証

### テストシナリオ

**基本フロー:**
1. [ ] 診断開始→質問回答→結果表示の完全フロー
2. [ ] 3パネル構成での正常表示
3. [ ] AI戦略サマリーの生成・表示
4. [ ] OS間動力学の可視化

**レスポンシブテスト:**
- [ ] **デスクトップ（1920px）**: 3パネル横並び
- [ ] **タブレット（768px）**: 2+1段構成
- [ ] **スマートフォン（375px）**: 縦積み

**パフォーマンステスト:**
- [ ] **初期読み込み**: 3秒以内
- [ ] **AI生成**: 5秒以内
- [ ] **インタラクション応答**: 300ms以内

**アクセシビリティテスト:**
- [ ] **キーボードナビゲーション**: Tab移動対応
- [ ] **スクリーンリーダー**: 適切なaria-label設定
- [ ] **色覚多様性**: カラーブラインド対応

### ブラウザ互換性

**対象ブラウザでの動作確認:**
- [ ] **Chrome 90+**: 完全動作
- [ ] **Firefox 88+**: 完全動作
- [ ] **Safari 14+**: 完全動作
- [ ] **Edge 90+**: 完全動作

---

## 📖 ドキュメント最終化

### 実装完了時の解説書

**作成する解説書:**
- [ ] **ユーザー向けガイド**: 新機能の使い方説明
- [ ] **開発者向けドキュメント**: コード構造・拡張方法
- [ ] **運用マニュアル**: メンテナンス・トラブルシューティング

### 成果物の最終確認

**成果物リスト:**
- [ ] **新規作成ファイル**: 10+ JavaScript/CSSファイル
- [ ] **更新ファイル**: analyzer.html, 既存コンポーネント
- [ ] **データファイル**: HEXAGRAM_DETAILS完全版
- [ ] **ドキュメント**: 要件書、実装ガイド、解説書

---

## ✅ 最終チェックリスト

### ユーザー体験
- [ ] **「腑に落ちる」感覚**: 自己理解の深化を実感できる
- [ ] **実用性**: 日常で参考にできる具体的アドバイス
- [ ] **直感性**: 複雑な情報の直感的理解

### 技術品質
- [ ] **安定性**: エラー率1%以下
- [ ] **パフォーマンス**: 目標時間内での動作
- [ ] **保守性**: ビルドレス、モジュラー設計

### 要件適合性
- [ ] **3OS統合ダッシュボード**: 左中右パネル構成
- [ ] **AI戦略生成**: 4つの核心質問への回答
- [ ] **動力学可視化**: インタラクティブなOS間関係表示

---

**チェック実行者**: _________________  
**実行日**: _________________  
**承認**: _________________