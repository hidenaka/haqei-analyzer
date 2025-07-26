# スクリプト読み込み順序説明ドキュメント

## 📋 概要

HaQei Analyzerにおけるスクリプトファイルの読み込み順序と依存関係について詳細に説明します。

## 🎯 読み込み順序の重要性

### なぜ順序が重要か？
- **依存関係の解決**: 後続のスクリプトが前のスクリプトで定義されたクラスや変数に依存
- **初期化の順序**: データ→クラス→コンポーネント→アプリケーションの順で初期化
- **エラーの防止**: 未定義参照エラーやタイミング問題の回避

## 📚 完全な読み込み順序

### 1. ユーティリティスクリプト（最優先）
```html
<!-- 1. ユーティリティスクリプト（最優先 - 他のスクリプトが依存する可能性） -->
<script src="js/utils/validators.js"></script>
<script src="js/utils/animations.js"></script>
```
**理由**: 他のスクリプトが依存する基本的な機能を提供

### 2. データファイル（依存関係順）

#### 2.1. 基盤データファイル（最優先）
```html
<!-- 2.1. 基盤データファイル（最優先 - 他のデータファイルの基盤） -->
<script src="../js/data/data_box.js"></script>
```
**提供内容**: `HAQEI_DATA`（卦マスターデータ、OS手引き等）
**依存関係**: なし（独立）

#### 2.2. 質問・ベクトルデータ
```html
<!-- 2.2. 質問・ベクトルデータ（基盤データに依存） -->
<script src="../js/data/questions.js"></script>
<script src="../js/data/vectors.js"></script>
```
**提供内容**: 
- `WORLDVIEW_QUESTIONS`, `SCENARIO_QUESTIONS`
- `H64_8D_VECTORS`
**依存関係**: `data_box.js`の卦データを参照

#### 2.3. 卦関連データ
```html
<!-- 2.3. 卦関連データ（質問・ベクトルデータに依存） -->
<script src="../js/data/hexagrams.js"></script>
<script src="../js/data/hexagram_details.js"></script>
```
**提供内容**: 
- `hexagrams_master`
- `HEXAGRAM_DETAILS`
**依存関係**: 質問・ベクトルデータで定義された構造を使用

#### 2.4. 互換性・アクション関連データ
```html
<!-- 2.4. 互換性・アクション関連データ（卦データに依存） -->
<script src="../js/data/compatibility_definition.js"></script>
<script src="../js/data/compatibility_matrix.js"></script>
<script src="../js/data/action_plans.js"></script>
```
**提供内容**: 
- `compatibility_definition`, `compatibility_matrix`
- `action_plans`
**依存関係**: 卦データの構造に基づく

### 3. 基底クラス
```html
<!-- 3. 基底クラス（データファイル後に読み込み） -->
<script src="js/core/BaseComponent.js"></script>
```
**提供内容**: `BaseComponent`（すべてのコンポーネントの基底クラス）
**依存関係**: データファイルの読み込み完了が前提

### 4. コアクラス

#### 4.1. 監視・検証システム
```html
<!-- 4. コアクラス（基底クラス後に読み込み） -->
<script src="js/core/PerformanceMonitor.js"></script>
<script src="js/core/ScriptPathValidator.js"></script>
<script src="js/core/ErrorDetectionReporter.js"></script>
```
**提供内容**: パフォーマンス監視、パス検証、エラー検出
**依存関係**: `BaseComponent`

#### 4.2. データ管理・計算
```html
<script src="js/core/DataManager.js"></script>
<script src="js/core/Calculator.js"></script>
<script src="js/core/StorageManager.js"></script>
```
**提供内容**: データ管理、計算処理、ストレージ管理
**依存関係**: `BaseComponent`、データファイル

### 5. エンジンクラス
```html
<!-- 5. エンジンクラス（コアクラス後に読み込み） -->
<script src="js/core/Engine.js"></script>
<script src="js/core/TripleOSEngine.js"></script>
<script src="js/core/EightDimensionAnalysisEngine.js"></script>
<script src="js/core/RelationshipVisualizationEngine.js"></script>
```
**提供内容**: 各種分析エンジン
**依存関係**: `DataManager`, `Calculator`

### 5.5. 特殊機能
```html
<!-- 5.5. 特殊機能（エンジン後に読み込み） -->
<script src="js/core/CompatibilityDataLoader.js"></script>
```
**提供内容**: 互換性データの動的読み込み
**依存関係**: エンジンクラス、互換性データ

### 6. UIコンポーネント
```html
<!-- 6. UIコンポーネント（すべてのコア機能後に読み込み） -->
<script src="js/components/WelcomeScreen.js"></script>
<script src="js/components/QuestionFlow.js"></script>
<script src="js/components/AnalysisView.js"></script>
<script src="js/components/ResultsView.js"></script>
<script src="js/components/TripleOSResultsView.js"></script>
<script src="js/components/InsightPanel.js"></script>
```
**提供内容**: 各UI画面コンポーネント
**依存関係**: すべてのエンジン、データ管理クラス

### 7. メインアプリケーション
```html
<!-- 7. メインアプリケーション（最後に読み込み） -->
<script src="js/app.js"></script>
```
**提供内容**: アプリケーション初期化とフロー制御
**依存関係**: すべてのコンポーネント

## 🔍 依存関係マップ

```
データファイル
├── data_box.js (HAQEI_DATA)
├── questions.js (WORLDVIEW_QUESTIONS, SCENARIO_QUESTIONS)
├── vectors.js (H64_8D_VECTORS)
├── hexagrams.js (hexagrams_master)
├── hexagram_details.js (HEXAGRAM_DETAILS)
├── compatibility_definition.js
├── compatibility_matrix.js
└── action_plans.js

基底クラス
└── BaseComponent.js

コアクラス
├── PerformanceMonitor.js
├── ScriptPathValidator.js
├── ErrorDetectionReporter.js
├── DataManager.js (extends BaseComponent)
├── Calculator.js (extends BaseComponent)
└── StorageManager.js (extends BaseComponent)

エンジンクラス
├── Engine.js (uses DataManager, Calculator)
├── TripleOSEngine.js (extends Engine)
├── EightDimensionAnalysisEngine.js (extends Engine)
├── RelationshipVisualizationEngine.js (extends Engine)
└── CompatibilityDataLoader.js (uses all engines)

UIコンポーネント
├── WelcomeScreen.js (extends BaseComponent)
├── QuestionFlow.js (extends BaseComponent, uses DataManager)
├── AnalysisView.js (extends BaseComponent, uses all engines)
├── ResultsView.js (extends BaseComponent, uses all engines)
├── TripleOSResultsView.js (extends BaseComponent, uses TripleOSEngine)
└── InsightPanel.js (extends BaseComponent, uses all engines)

アプリケーション
└── app.js (uses all components)
```

## ⚠️ よくある読み込みエラー

### 1. `ReferenceError: BaseComponent is not defined`
**原因**: UIコンポーネントがBaseComponentより先に読み込まれた
**解決**: BaseComponent.jsを先に読み込む

### 2. `ReferenceError: HAQEI_DATA is not defined`
**原因**: data_box.jsが読み込まれる前にデータを参照
**解決**: data_box.jsを最初に読み込む

### 3. `ReferenceError: DataManager is not defined`
**原因**: エンジンクラスがDataManagerより先に読み込まれた
**解決**: コアクラスをエンジンクラスより先に読み込む

### 4. CDNライブラリエラー
**原因**: Chart.jsなどの外部ライブラリの読み込み失敗
**解決**: ネットワーク接続確認、CDNの代替URL使用

## 🔧 読み込み順序の検証方法

### 1. ブラウザ開発者ツール
```javascript
// コンソールで実行してクラスの存在確認
console.log('BaseComponent:', typeof BaseComponent);
console.log('DataManager:', typeof DataManager);
console.log('HAQEI_DATA:', typeof HAQEI_DATA);
```

### 2. 統合テストの使用
```bash
# 統合テストで全体の読み込み状況を確認
open test-integration-complete-startup.html
```

### 3. analyzer.html内の読み込み確認スクリプト
analyzer.htmlには読み込み確認スクリプトが組み込まれており、自動的に：
- 各スクリプトの読み込み状況を監視
- 読み込み失敗時のフォールバック処理
- 詳細なログ出力

## 🚀 最適化のポイント

### 1. 並列読み込みの限界
- スクリプトは基本的に順次読み込み（defer属性なし）
- 依存関係により並列化は困難

### 2. 読み込み時間の最適化
- 不要なスクリプトの削除
- ファイルサイズの最小化
- CDNの使用（Chart.js等）

### 3. エラー時の対応
- フォールバックデータの用意
- 読み込み失敗時の代替処理
- ユーザーへの適切なフィードバック

## 📝 開発者向けチェックリスト

### 新しいスクリプトを追加する場合
- [ ] 依存関係を明確に把握する
- [ ] 適切な位置に挿入する
- [ ] 統合テストで読み込み確認する
- [ ] エラー時の動作を確認する

### 既存の順序を変更する場合
- [ ] 変更の影響範囲を分析する
- [ ] 依存関係に問題がないか確認する
- [ ] 全体のテストを実行する
- [ ] パフォーマンスへの影響を測定する

## 🔗 関連ドキュメント

- [統合テストガイド](test-integration-complete-startup.html)
- [エラー検出使用ガイド](ERROR_DETECTION_USAGE_GUIDE.md)
- [パフォーマンス監視実装](PERFORMANCE_MONITORING_IMPLEMENTATION.md)
- [MIME タイプ設定ガイド](MIME_TYPE_SETUP_GUIDE.md)

---

**最終更新**: 2025年1月  
**対象バージョン**: analyzer.html v1.0.0