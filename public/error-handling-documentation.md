# Future Simulator - 包括的エラーハンドリングシステム

## 概要

Future Simulatorに包括的なエラーハンドリングシステムを実装しました。このシステムは、ユーザーフレンドリーなエラーメッセージ、自動復旧機能、段階的劣化戦略を提供します。

## 実装された機能

### 1. 包括的エラーハンドリングクラス (ComprehensiveErrorHandler)

#### 主要機能:
- **エラー分類**: エラーをタイプ別に自動分類（Kuromoji、ネットワーク、データロード、分析、入力検証）
- **ユーザーフレンドリーメッセージ**: 日本語での分かりやすいエラー説明
- **自動復旧**: 可能な場合は自動的にエラーからの復旧を試行
- **段階的劣化**: 機能が利用できない場合のフォールバック処理
- **エラーログ**: 開発者向けの詳細なエラー情報記録

#### エラータイプ別の処理:

##### 🔥 Kuromojiエラー
- **検出**: `kuromoji`文字列を含むエラー
- **対応**: 簡易解析モードへの自動切り替え
- **復旧**: 最大3回まで自動再試行（2秒間隔）
- **ユーザー通知**: "言語解析エンジンの問題" として表示

##### 🌐 ネットワークエラー
- **検出**: `network`, `fetch`, `load`文字列を含むエラー
- **対応**: オフラインモードでの継続動作
- **復旧**: ネットワーク復旧時の自動通知
- **ユーザー通知**: "インターネット接続の問題" として表示

##### 📊 データロードエラー
- **検出**: `h384_data`, `data`文字列を含むエラー
- **対応**: 利用可能なデータでの部分的動作
- **復旧**: 段階的データ復旧機能
- **ユーザー通知**: "データ読み込みの問題" として表示

##### 🔍 分析エラー
- **検出**: `analysis`, `tokenize`文字列を含むエラー
- **対応**: 分析の再試行機能
- **復旧**: 前回の分析状態からの復帰
- **ユーザー通知**: "分析処理の問題" として表示

##### ✍️ 入力検証エラー
- **検出**: `入力`, `validation`文字列を含むエラー
- **対応**: 入力フィールドのハイライト
- **復旧**: 入力内容の修正ガイダンス
- **ユーザー通知**: "入力内容の問題" として表示

### 2. 強化された入力検証システム

#### 検証項目:
- **空入力チェック**: 空の入力を検出
- **長さ検証**: 10文字以上2000文字以内
- **スパム検出**: 繰り返し文字や無意味な入力を検出
- **キーワード分析**: Kuromoji利用時の意味のある単語数チェック
- **フォールバック検証**: Kuromoji不使用時の簡易検証

#### エラータイプ:
- `empty_input`: 空入力
- `too_short`: 短すぎる入力
- `too_long`: 長すぎる入力
- `spam_like`: スパム的な入力
- `insufficient_keywords`: キーワード不足
- `tokenizer_unavailable`: Kuromoji利用不可

### 3. ユーザーインターフェース

#### エラーモーダル
- **デザイン**: ダークテーマに適応したモーダルデザイン
- **アクション**: ユーザーが取れる具体的な行動を提示
- **重複防止**: 同一エラーの複数表示を防止

#### トースト通知
- **タイプ**: success, warning, error, info
- **アニメーション**: スライドイン/アウト効果
- **自動消去**: 3秒後に自動削除

### 4. 自動復旧機能

#### Kuromoji復旧
```javascript
async attemptKuromojiRecovery() {
  // 最大3回まで2秒間隔で再試行
  // 成功時はユーザーに通知
  // 失敗時は簡易モードに切り替え
}
```

#### ネットワーク復旧監視
```javascript
window.addEventListener('online', () => this.handleNetworkRestore());
window.addEventListener('offline', () => this.handleNetworkLoss());
```

### 5. 開発者向け機能

#### エラーログシステム
- **構造化ログ**: タイムスタンプ、エラータイプ、詳細情報
- **ログローテーション**: 最大100件まで保持
- **デバッグ情報**: コンソールでの詳細エラー表示

#### エラーレポート
```javascript
errorHandler.getErrorReport()
// 戻り値:
// {
//   totalErrors: number,
//   recentErrors: Array,
//   retryAttempts: Object,
//   notifiedTypes: Array
// }
```

## 使用方法

### 基本的な使用
```javascript
// グローバルインスタンスは自動的に作成されます
window.errorHandler

// 手動でエラーを処理する場合
errorHandler.handleApplicationError(new Error('テストエラー'));
```

### カスタムエラー処理
```javascript
try {
  // 何らかの処理
} catch (error) {
  if (errorHandler) {
    errorHandler.handleApplicationError(error);
  }
}
```

## 設定可能なパラメータ

```javascript
const errorHandler = new ComprehensiveErrorHandler();
errorHandler.maxLogSize = 100;     // エラーログの最大サイズ
errorHandler.maxRetries = 3;       // 最大再試行回数
```

## Chrome拡張機能エラーの処理

拡張機能によるエラーは自動的に無視され、アプリケーションの動作に影響しません：

```javascript
const chromeExtensionPatterns = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'extension:',
  'content.js',
  'background.js',
  'popup.js',
  'inject.js'
];
```

## パフォーマンス最適化

- **エラー分類の最適化**: 正規表現を避け、単純な文字列検索を使用
- **メモリ管理**: エラーログのサイズ制限とローテーション
- **非同期処理**: 復旧処理は非同期で実行
- **重複防止**: 同一タイプのエラー通知の重複を防止

## 今後の拡張予定

1. **エラー分析**: エラーパターンの分析と改善提案
2. **ユーザー行動追跡**: エラー発生時のユーザー行動分析
3. **自動復旧の改善**: より高度な復旧戦略の実装
4. **外部通知**: 重要なエラーの外部システムへの通知

---

このエラーハンドリングシステムにより、Future Simulatorはより堅牢で使いやすいアプリケーションになりました。