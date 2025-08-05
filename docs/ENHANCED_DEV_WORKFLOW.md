# HAQEI Analyzer - 拡張開発ワークフロー

## 🎯 概要

HAQEI Analyzerでは、Serena MCPを含む6つのMCPサーバーと連携した拡張開発ワークフローが利用可能です。

## 🚀 利用可能なコマンド

### 1. 新規開発時

```bash
# 基本的な起動
npm run mcp:claude:unsafe

# Swarmベース開発（推奨）
npm run dev:swarm:new "ユーザー認証機能実装" 6

# または直接スクリプト実行
./scripts/enhanced-dev-commands.sh new "ユーザー認証機能実装" 6
```

### 2. 継続開発時

```bash
# 既存セッション復帰
npm run mcp:resume:unsafe

# Swarmベース継続開発
npm run dev:swarm:resume "ユーザー認証機能実装（続き）" 6

# または直接スクリプト実行
./scripts/enhanced-dev-commands.sh resume "ユーザー認証機能実装（続き）" 6
```

## 🎯 コマンドの利点

### ✅ 自動化されたセットアップ
- MCP環境の自動初期化
- 6つのMCPサーバー（Serena、Cipher、Claude Flow、Ruv Swarm、Tsumiki、Playwright）の統合
- 開発テンプレートの自動適用

### ⚡ インテリジェントなタスク分析
- タスク名から開発タイプを自動判別
- 適切なエージェント構成の自動選択
- プロジェクト固有のガイドライン適用

### 🤖 並列エージェント協調
- 最大8エージェントによる並列開発
- タスクタイプ別の最適化されたトポロジー
- メモリベースの知識共有

## 📋 サポートされるタスクタイプ

### Requirements（要件定義）
- **キーワード**: 要件、仕様、設計
- **エージェント**: haqei-requirements-analyst, haqei-cto, researcher
- **トポロジー**: hierarchical（階層型）

### Development（開発）
- **キーワード**: 実装、機能、API
- **エージェント**: system-architect, coder×2, backend-dev, tester, task-orchestrator
- **トポロジー**: mesh（メッシュ型）

### Testing（テスト）
- **キーワード**: テスト、test
- **エージェント**: tester, haqei-qa-tester, performance-benchmarker, code-analyzer
- **トポロジー**: hierarchical（階層型）

### Quality（品質保証）
- **キーワード**: 品質、レビュー、チェック
- **エージェント**: reviewer, code-analyzer, security-manager, documenter
- **トポロジー**: star（スター型）

## 🔧 MCPサーバー統合

### 利用可能なサービス

1. **Serena** - セマンティックコード分析とファイル監視
2. **Cipher** - bunenjin哲学とプロジェクト記憶管理
3. **Claude Flow** - AI協調オーケストレーション（87専門ツール）
4. **Ruv Swarm** - 分散エージェント協調システム
5. **Tsumiki** - AI駆動開発フレームワーク
6. **Playwright** - ブラウザ自動化とE2Eテスト

### 🎨 HAQEI固有の機能

- **bunenjin哲学** の自動適用
- **Triple OS Architecture** の維持
- **易経64卦システム** の統合
- **ユーザー主権** とプライバシーファースト設計
- **フリーミアム戦略** の実装方針

## 📖 使用例

### 新機能開発
```bash
# ユーザー認証機能の実装
./scripts/enhanced-dev-commands.sh new "ユーザー認証機能実装" 8

# REST API開発
./scripts/enhanced-dev-commands.sh new "ユーザー管理API実装" 6

# UI/UX改善
./scripts/enhanced-dev-commands.sh new "ダッシュボードUI改善" 4
```

### 継続開発
```bash
# 前回の続きから
./scripts/enhanced-dev-commands.sh resume "ユーザー認証機能実装（続き）" 8

# バグ修正セッション
./scripts/enhanced-dev-commands.sh resume "認証エラー修正" 4
```

## 🔄 ワークフロー

1. **初期化**: MCPサーバー群の起動と設定
2. **分析**: タスク名からの自動タイプ判別
3. **計画**: 適切なエージェント構成の選択
4. **実行**: 並列エージェントによる協調開発
5. **統合**: 結果の統合とメモリへの保存

## 💡 ベストプラクティス

### タスク命名
- 具体的で明確な名前を使用
- 開発段階を含める（実装、テスト、レビューなど）
- 継続時は「（続き）」を追加

### エージェント数
- 小規模タスク: 3-4エージェント
- 中規模タスク: 6-8エージェント
- 大規模タスク: 8エージェント（最大）

### セッション管理
- 新規開発は `new` モード
- 継続開発は `resume` モード
- メモリベースの状態継続

## 🚨 注意事項

- Serena MCPはuv経由でインストールが必要
- Claude Code再起動後に全MCPサーバーが利用可能
- 大規模タスクでは適切なリソース管理を推奨

---

## 📝 更新履歴

- 2025-08-05: Serena MCP統合と拡張コマンド追加
- 2025-08-05: 6つのMCPサーバー統合完了