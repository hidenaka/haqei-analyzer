# 🚀 HAQEI Analyzer ローカルサーバー

ローカル環境でHAQEIシステムの動作確認を行うためのローカル開発サーバーです。

## 📋 概要

このローカルサーバーは以下の機能を提供します：

- **静的ファイル配信**: public/ディレクトリ内のHTMLファイルを配信
- **ルーティング**: HAQEIシステム用の特別なルーティング設定
- **CORS対応**: クロスオリジンリクエストのサポート
- **エラーハンドリング**: 404エラーページとサーバーエラーの適切な処理
- **自動ブラウザ起動**: オプションでブラウザを自動起動

## 🎯 主要エンドポイント

| URL | ファイル | 説明 |
|-----|----------|------|
| `http://localhost:3000/` | `public/index.html` | ホームページ |
| `http://localhost:3000/os_analyzer` | `public/os_analyzer.html` | OS Analyzer診断ページ |
| `http://localhost:3000/results` | `public/results.html` | 診断結果表示ページ |
| `http://localhost:3000/future-simulator` | `public/future_simulator.html` | Future Simulatorページ |
| `http://localhost:3000/test-integration-complete.html` | `test-integration-complete.html` | 統合テストページ |
| `http://localhost:3000/qa-validation-complete.html` | `qa-validation-complete.html` | QA検証結果ページ |

## 🚀 使用方法

### 1. 基本的な起動

```bash
# NPMスクリプトを使用（推奨）
npm run dev

# または直接実行
./start-local-server.sh

# またはNode.jsで直接実行
node local-dev-server.js
```

### 2. ブラウザ自動起動

```bash
# 起動後にブラウザを自動で開く
npm run dev:browser

# または
./start-local-server.sh --browser
```

### 3. カスタムポート指定

```bash
# ポート8080で起動
npm run local-server:8080

# または任意のポート
./start-local-server.sh --port=4000

# ブラウザ自動起動と組み合わせ
./start-local-server.sh --port=4000 --browser
```

### 4. 利用可能なNPMコマンド

```bash
npm run dev                    # ポート3000で起動
npm run dev:browser           # ポート3000で起動してブラウザを開く
npm run dev:port 8080         # 指定ポートで起動
npm run local-server          # Node.jsサーバーを直接起動
npm run local-server:3000     # ポート3000で起動
npm run local-server:8080     # ポート8080で起動
```

## 🔧 高度な使用方法

### コマンドラインオプション

```bash
./start-local-server.sh [オプション]

オプション:
  --port=XXXX, -p XXXX  ポート番号指定 (デフォルト: 3000)
  --browser, -b         ブラウザを自動起動
  --help, -h            ヘルプを表示

例:
  ./start-local-server.sh                    # ポート3000で起動
  ./start-local-server.sh --port=8080        # ポート8080で起動
  ./start-local-server.sh -b                 # 起動後ブラウザを開く
  ./start-local-server.sh --port=4000 -b     # ポート4000で起動してブラウザを開く
```

### ポート衝突の自動解決

指定したポートが既に使用されている場合：

1. **自動検出**: システムが利用可能な代替ポートを検索
2. **選択肢提示**: 利用可能なポートを提案
3. **ユーザー確認**: 代替ポート使用の可否を確認

## 📊 テスト・検証

### 統合テスト実行

```bash
# ローカルサーバーを起動後、以下のURLにアクセス
http://localhost:3000/test-integration-complete.html
```

### QA検証結果確認

```bash
# ローカルサーバーを起動後、以下のURLにアクセス
http://localhost:3000/qa-validation-complete.html
```

### データフロー確認

1. **OS Analyzer診断**: `http://localhost:3000/os_analyzer`
2. **診断実行**: 質問に回答して分析を実行
3. **結果確認**: 自動で`http://localhost:3000/results`に遷移
4. **データ整合性**: 診断結果が正しく表示されることを確認

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### 1. ポートが既に使用されている

```bash
❌ ポート 3000 は既に使用されています
💡 以下のコマンドで代替ポートを試してください:
   ./start-local-server.sh --port=3001
```

**解決方法**:
- 別のポートを指定する
- 既存のプロセスを終了する: `lsof -ti:3000 | xargs kill -9`

#### 2. Node.jsがインストールされていない

```bash
❌ Node.jsがインストールされていません
💡 https://nodejs.org からNode.jsをインストールしてください
```

**解決方法**:
- [Node.js公式サイト](https://nodejs.org)からインストール
- または、nvm経由でインストール: `nvm install node`

#### 3. publicディレクトリが見つからない

```bash
❌ publicディレクトリが見つかりません
💡 HAQEIファイルが正しく配置されているか確認してください
```

**解決方法**:
- プロジェクトのルートディレクトリで実行していることを確認
- `public/`ディレクトリが存在し、HTMLファイルが含まれていることを確認

#### 4. ブラウザが自動起動しない

**解決方法**:
- 手動でブラウザを開き、`http://localhost:3000`にアクセス
- OSによってはブラウザ自動起動がサポートされていない場合があります

## 🔒 セキュリティ

### 組み込まれているセキュリティ機能

- **CORS設定**: クロスオリジンリクエストの適切な処理
- **セキュリティヘッダー**: XSS、クリックジャッキング対策
- **Content-Typeの正確な設定**: MIMEタイプスニッフィング防止
- **キャッシュ制御**: HTMLファイルのキャッシュ無効化

### 注意事項

- このサーバーは**開発・テスト専用**です
- 本番環境での使用は推奨されません
- ローカルネットワーク内でのみ使用してください

## 📁 ファイル構成

```
haqei-analyzer/
├── local-dev-server.js           # Node.jsサーバー本体
├── start-local-server.sh         # 起動スクリプト
├── package.json                  # NPMスクリプト定義
├── README-LocalServer.md         # このファイル
└── public/                       # 静的ファイル
    ├── index.html
    ├── os_analyzer.html
    ├── results.html
    ├── future_simulator.html
    ├── css/
    ├── js/
    └── ...
```

## 🆘 サポート

問題が発生した場合：

1. **ログの確認**: サーバー起動時のコンソール出力を確認
2. **ブラウザ開発者ツール**: Network、Consoleタブでエラーを確認
3. **ポート確認**: `lsof -i :3000` でポート使用状況を確認
4. **再起動**: `Ctrl+C`でサーバーを停止し、再起動

## ✅ 動作確認チェックリスト

- [ ] サーバーが正常に起動する
- [ ] `http://localhost:3000`にアクセスできる
- [ ] OS Analyzerページが表示される
- [ ] 診断を実行できる
- [ ] Resultsページに遷移できる
- [ ] 診断結果が正しく表示される
- [ ] 統合テストページが動作する
- [ ] QA検証結果ページが表示される

---

🎉 **HAQEIシステムのローカル環境での動作確認をお楽しみください！**