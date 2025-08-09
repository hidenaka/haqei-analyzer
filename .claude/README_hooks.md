# HAQEI Analyzer - Hooks設定

## 概要
プログラマーエージェントの作業と連動して自動的にドキュメントを生成するhooksシステムです。

## 設定済みhooks

### 1. 実装完了時の自動ドキュメント生成
- **トリガー**: `SubagentStop` (haqei-programmerエージェント完了時)
- **実行スクリプト**: `.claude/scripts/generate_implementation_docs.sh`
- **生成ドキュメント**:
  - 実装完了レポート (`YYYYMMDD_HHMMSS_implementation_report.md`)
  - データ解説書 (`YYYYMMDD_HHMMSS_data_explanation.md`)
  - 機能説明書 (`YYYYMMDD_HHMMSS_feature_guide.md`)

### 2. 実装開始時の要件定義書生成
- **トリガー**: `UserPromptSubmit` (実装関連キーワード検出時)
- **実行スクリプト**: `.claude/scripts/generate_requirements_docs.sh`
- **検出キーワード**: 実装、機能追加、バグ修正、プログラマー、haqei-programmer
- **生成ドキュメント**:
  - 技術仕様書 (`YYYYMMDD_HHMMSS_technical_specification.md`)
  - 実装要件書 (`YYYYMMDD_HHMMSS_implementation_requirements.md`)
  - テスト計画書 (`YYYYMMDD_HHMMSS_test_plan.md`)

## 出力先
すべてのドキュメントは `/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/` に保存されます。

## ログ
実行ログは `docs/auto_doc_generation.log` に記録されます。

## 時刻設定
すべての時刻は日本時刻（JST）で記録されます。

## 設定ファイル
- メイン設定: `.claude/settings.json`
- 実行スクリプト: `.claude/scripts/`

## 注意事項
- hooksは自動的に実行されるため、実装作業時に自動でドキュメントが生成されます
- 生成されたドキュメントは適宜レビュー・編集してください
- HaQei哲学と易経的アプローチとの整合性が保たれるよう設計されています