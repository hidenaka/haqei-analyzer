# HaQei Analyzer - データ読み込み修正ガイド

## 概要

このドキュメントは、HaQei Analyzerシステムにおけるデータ読み込み機能の修正内容と使用方法について説明します。

## 実装された修正内容

### 1. DataManagerの欠落メソッド修正

#### 追加されたメソッド

- **`getDataStats()`**: データ統計情報を取得
- **`logMessage(level, section, message, data)`**: 統一されたログ出力
- **`getLoadingLogs()`**: 読み込みログの取得
- **`clearLogs()`**: ログのクリア
- **`validateDataStructure(data)`**: データ構造検証
- **`transformDataForBackwardCompatibility(data)`**: 後方互換性のためのデータ変換
- **`waitForGlobalData(maxRetries, retryDelay)`**: 非同期データ読み込み待機

### 2. 非同期データ読み込みメカニズム

#### 機能概要

```javascript
// 自動的にグローバルデータの読み込みを待機
await dataManager.loadData();
```

#### 設定可能なパラメータ

- **maxRetries**: 最大再試行回数（デフォルト: 10）
- **retryDelay**: 再試行間隔（デフォルト: 100ms）
- **指数バックオフ**: 遅延時間を徐々に増加

### 3. スクリプト読み込み順序とタイミング強化

#### analyzer.htmlの拡張機能

```javascript
// 読み込み状態の追跡
window.scriptLoadingStatus = {
    dataBoxLoaded: false,
    coreClassesLoaded: false,
    dataFilesLoaded: false,
    componentsLoaded: false,
    allLoaded: false
};
```

#### 自動初期化チェック

- DOMContentLoaded時の自動確認
- 100ms間隔での定期チェック
- 5秒タイムアウト機能

### 4. エラーハンドリングとログ出力強化

#### ログレベル

- **error**: エラーメッセージ
- **warn**: 警告メッセージ  
- **info**: 情報メッセージ
- **debug**: デバッグメッセージ（`?debug=true`で有効）

#### 使用例

```javascript
const dataManager = new DataManager();
await dataManager.loadData();

// ログ確認
const logs = dataManager.getLoadingLogs();
console.log('エラー数:', logs.summary.errorCount);
console.log('警告数:', logs.summary.warningCount);
```

### 5. データ整合性検証

#### 検証項目

- 必須プロパティの存在確認
- データ型の検証
- ネストしたオブジェクトの検証
- データ統計の生成

#### 使用例

```javascript
const validationResult = dataManager.validateDataStructure(data);
if (!validationResult.isValid) {
    console.error('検証エラー:', validationResult.errors);
}
```

### 6. 包括的なテストスイート

#### ユニットテスト

- **ファイル**: `datamanager-unit-test.html`
- **カバレッジ**: 基本機能、データ読み込み、エラーハンドリング、データ検証

#### 統合テスト

- **ファイル**: `comprehensive-integration-test.html`
- **カバレッジ**: 全システム統合、パフォーマンス、回帰テスト

## トラブルシューティング

### よくある問題

#### 1. HAQEI_DATAが見つからない

**エラー**: `Critical data missing: HAQEI_DATA not found`

**解決方法**:
1. `data_box.js`がHTMLに正しく読み込まれていることを確認
2. スクリプトの読み込み順序を確認
3. ブラウザのコンソールでデバッグ情報を確認

#### 2. スクリプト読み込みタイムアウト

**エラー**: `スクリプト読み込みタイムアウト`

**解決方法**:
1. ネットワーク接続を確認
2. ファイルパスが正しいことを確認
3. ブラウザのキャッシュをクリア

#### 3. データ構造検証エラー

**エラー**: `データ構造検証に失敗しました`

**解決方法**:
1. `getLoadingLogs()`でエラー詳細を確認
2. データファイルの形式を確認
3. 必要に応じてデータ変換を実行

### デバッグ方法

#### 1. デバッグモードの有効化

```
http://localhost:8000/analyzer.html?debug=true
```

#### 2. ログの確認

```javascript
// DataManager初期化後
const logs = dataManager.getLoadingLogs();
console.table(logs.errors);
console.table(logs.warnings);
```

#### 3. データ統計の確認

```javascript
const stats = dataManager.getDataStats();
console.log('データ統計:', stats);
```

## パフォーマンス最適化

### 推奨設定

```javascript
// 高速な環境
const dataManager = new DataManager();
await dataManager.loadData(); // デフォルト設定

// 低速な環境  
await dataManager.waitForGlobalData(20, 200); // 再試行数増加、遅延増加
```

### 監視指標

- データ読み込み時間
- 再試行回数
- エラー発生率
- メモリ使用量

## 今後の拡張予定

1. **データキャッシュ機能**: ブラウザストレージを使用したデータキャッシュ
2. **プログレッシブ読み込み**: 重要なデータから順次読み込み
3. **オフライン対応**: Service Workerを使用したオフライン機能
4. **動的データ更新**: リアルタイムデータ更新機能

## 開発者向け情報

### 新しいデータソースの追加

```javascript
// 1. data_box.jsに新しいデータを追加
export const new_data_source = { /* データ */ };

// 2. window.HAQEI_DATAに追加
window.HAQEI_DATA = {
    // 既存データ...
    newDataSource: new_data_source
};

// 3. DataManagerのloadDataメソッドで取得
newDataSource: (globals.HAQEI_DATA && globals.HAQEI_DATA.newDataSource) || {},
```

### カスタムバリデーションルールの追加

```javascript
// validateDataStructureメソッドを拡張
validateDataStructure(data) {
    // 既存の検証...
    
    // カスタム検証ルール
    if (data.customField && !this.validateCustomField(data.customField)) {
        validationResult.errors.push('カスタムフィールドが無効です');
    }
    
    return validationResult;
}
```

---

**最終更新**: 2024年
**バージョン**: 1.0.0
**作成者**: HaQei Development Team