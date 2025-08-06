# MCP (Model Context Protocol) セットアップガイド

## 概要
このプロジェクトのMCPサーバー（Serena、Cipher）のデータはプロジェクト内の`.mcp-data`ディレクトリに保存され、Gitで同期できるように設定されています。

## セットアップ手順

### 1. 初回セットアップ（新しいデバイス）

```bash
# リポジトリをクローン
git clone [repository-url]
cd haqei-analyzer

# 依存関係をインストール
npm install

# MCPデータディレクトリを作成（自動作成されますが念のため）
mkdir -p .mcp-data/cipher-memory .mcp-data/serena-memory .mcp-data/logs

# MCP設定を生成（現在のユーザー用）
node generate-mcp-config.js
```

### 2. Claude Codeでの使用

```bash
# 生成された設定ファイルを使用してClaude Codeを起動
claude --mcp-config claude-mcp-config.json
```

### 3. データの同期

#### データをコミット・プッシュ（作業完了後）
```bash
# MCPデータをステージング
git add .mcp-data/

# コミット
git commit -m "feat: MCPメモリデータを更新"

# プッシュ
git push
```

#### 他のデバイスでデータを取得
```bash
# 最新の変更を取得
git pull

# MCP設定を再生成（ユーザーパスが異なる場合）
node generate-mcp-config.js

# Claude Codeを起動
claude --mcp-config claude-mcp-config.json
```

## ディレクトリ構造

```
haqei-analyzer/
├── .mcp-data/                  # MCPデータ（Git同期）
│   ├── cipher-memory/          # Cipherの永続メモリ
│   │   └── memory.json         # プロジェクト記憶・bunenjin哲学
│   ├── serena-memory/          # Serenaのデータ（将来対応）
│   └── logs/                   # ログファイル（.gitignoreで除外）
│       └── *.log
├── .gitignore                  # ログファイルは除外設定
├── cipher-server.js            # Cipher MCPサーバー
├── generate-mcp-config.js      # MCP設定生成スクリプト
└── claude-mcp-config.json     # 生成されたMCP設定（ユーザー依存）
```

## 注意事項

1. **ログファイル**: `.mcp-data/logs/*.log`は`.gitignore`で除外されています
2. **設定ファイル**: `claude-mcp-config.json`はユーザーのパスに依存するため、各デバイスで`generate-mcp-config.js`を実行してください
3. **メモリデータ**: `.mcp-data/cipher-memory/memory.json`にプロジェクトの記憶が保存されます

## トラブルシューティング

### MCPサーバーが起動しない場合
```bash
# Cipherサーバーを手動で起動してテスト
node cipher-server.js

# ポート3001が使用中の場合
CIPHER_PORT=3002 node cipher-server.js
```

### データが同期されない場合
```bash
# .mcp-dataディレクトリの状態を確認
ls -la .mcp-data/

# Gitの状態を確認
git status

# 強制的にデータを取得
git fetch --all
git reset --hard origin/main  # 注意：ローカルの変更が失われます
```

## 関連ドキュメント
- [CLAUDE.md](./CLAUDE.md) - Claude Code設定とプロジェクト指示
- [README.md](./README.md) - プロジェクト全体のドキュメント