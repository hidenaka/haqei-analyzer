# Claude Flow 効率的開発コマンドガイド

## 📅 基本情報
- **作成日**: 2025年8月3日
- **バージョン**: v1.0
- **作成者**: Claude Code
- **ステータス**: 実装完了

## 🚀 新しい効率的な開発コマンド

### 既存コマンドとの統合

#### 通常の開発開始（MCPサーバー起動込み）
```bash
# 新規セッション
npm run mcp:claude:unsafe

# 前のセッションを再開
npm run mcp:resume:unsafe
```

### 🐝 Claude Flow統合コマンド

#### 1. **Swarm開発（推奨）**
```bash
# 8エージェントでタスクを並列実行しClaude Code CLIを開く
npm run dev:swarm --task="Triple OS実装"

# エージェント数を指定
npm run dev:swarm --task="易経分析エンジン" --agents=12

# 例: 仮想スクロール最適化
npm run dev:swarm --task="VirtualQuestionFlow偶数番設問修正" --agents=6
```

#### 2. **TDD開発モード**
```bash
# SPARC TDDモードで開発
npm run dev:tdd --task="認証システム実装"

# 例: 新機能のTDD実装
npm run dev:tdd --task="ユーザー設定保存機能"
```

#### 3. **Hive-Mind開発**
```bash
# Hive-Mindモードで複雑なタスクを実行
npm run dev:hive --task="データベース設計とAPI実装"

# 例: アーキテクチャ全体の見直し
npm run dev:hive --task="Triple OSアーキテクチャリファクタリング"
```

#### 4. **リポジトリ分析**
```bash
# 深いリポジトリ分析を実行
npm run dev:analyze
```

### 📋 基本的なClaude Flowコマンド

```bash
# Swarm実行（手動）
npm run flow:swarm "タスク内容"

# Hive-Mind生成
npm run flow:hive "目的"

# SPARC TDD
npm run flow:sparc "機能名"

# メモリ操作
npm run flow:memory list

# ステータス確認
npm run flow:status

# ヘルプ
npm run flow:help
```

## 💡 使用例

### 例1: 新機能の実装
```bash
# Swarmモードで並列開発（Claude Code CLIが自動で開く）
npm run dev:swarm --task="新しいダッシュボード機能" --agents=10
```

### 例2: バグ修正
```bash
# TDDモードでバグ修正
npm run dev:tdd --task="偶数番設問表示バグ修正"
```

### 例3: 大規模リファクタリング
```bash
# Hive-Mindで包括的なリファクタリング
npm run dev:hive --task="パフォーマンス最適化とコード整理"
```

## 🎯 推奨ワークフロー

### 新規開発時
1. `npm run mcp:claude:unsafe` - 新規セッション開始
2. `npm run dev:swarm --task="機能名"` - Swarmで並列開発

### 継続開発時
1. `npm run mcp:resume:unsafe` - 前のセッション再開
2. `npm run flow:status` - 現在の状態確認
3. `npm run dev:swarm --task="継続タスク"` - 開発継続

### TDD開発時
1. `npm run mcp:claude:unsafe` - セッション開始
2. `npm run dev:tdd --task="機能名"` - TDDサイクル実行

## 📊 効率化のメリット

1. **MCPサーバー自動起動**: 手動起動不要
2. **Claude Code CLI自動起動**: `--claude`フラグで即座に開く
3. **並列実行**: 最大12エージェントで高速化
4. **コンテキスト保持**: セッション間でメモリ継続

## 🔧 カスタマイズ

### エージェント数のデフォルト変更
```json
// package.jsonで調整
"dev:swarm": "... --agents ${npm_config_agents:-8} ..."
// デフォルトは8、最大12まで推奨
```

### タスクテンプレート
```bash
# HAQEI特化タスク例
npm run dev:swarm --task="Triple OS: Engine最適化" --agents=6
npm run dev:swarm --task="易経64卦: 新機能追加" --agents=8
npm run dev:swarm --task="仮想スクロール: パフォーマンス改善" --agents=10
```

## 📝 注意事項

- `--task`パラメータは必須です
- エージェント数は3-12の範囲で指定してください
- 複雑なタスクほど多くのエージェントを使用します
- MCPサーバーは自動的に起動・管理されます