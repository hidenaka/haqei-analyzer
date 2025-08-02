# Git Hooks for HAQEI Analyzer

このディレクトリには、HAQEI Analyzerプロジェクトの開発を支援するGit Hooksが含まれています。

## 🔧 セットアップ

Git Hooksを有効にするには、以下のコマンドを実行してください：

```bash
# Git Hooksディレクトリを設定
git config core.hooksPath .githooks
```

## 📋 利用可能なHooks

### pre-commit
タスク管理表の進捗率を自動的に更新します。

**機能:**
- タスク完了状況を自動カウント
- Phase別の進捗率計算
- 進捗サマリーの自動更新
- コミットメッセージの推奨フォーマット表示

**動作条件:**
- `docs/development/20250802_DEV_Migration_Task_Tracker_v1.md`が変更された場合のみ動作

## 🎯 使い方

### タスク完了時
1. タスク管理表でタスクのチェックボックスをチェック
   ```markdown
   - [x] **TASK-001** | Vite + Vue 3プロジェクト初期化 | 2h | 高
   ```

2. 変更をコミット
   ```bash
   git add docs/development/20250802_DEV_Migration_Task_Tracker_v1.md
   git commit -m "feat: [TASK-001] 完了 - Vite + Vue 3プロジェクト初期化"
   ```

3. pre-commit hookが自動的に進捗率を更新

## 🚫 一時的に無効化

Hookを一時的にスキップしたい場合：

```bash
git commit --no-verify -m "コミットメッセージ"
```

## ⚙️ カスタマイズ

Hookの動作をカスタマイズしたい場合は、`.githooks/pre-commit`ファイルを編集してください。

## 🐛 トラブルシューティング

### Hookが動作しない場合
```bash
# 権限を確認
ls -la .githooks/pre-commit

# 実行権限を付与
chmod +x .githooks/pre-commit

# Git設定を確認
git config core.hooksPath
```

### エラーが発生する場合
- タスク管理表のフォーマットが正しいか確認
- bashがインストールされているか確認
- スクリプトの構文エラーをチェック