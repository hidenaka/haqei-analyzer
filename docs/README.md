# HAQEI プロジェクトドキュメント構造

**最終更新**: 2025年7月30日  
**総ファイル数**: 99個のマークダウンファイル

## 📁 ディレクトリ構造

### 🎯 /reports/ - プロジェクトレポート
**保存対象**: 重要な完成レポート、統合分析、フィードバック結果
- システム実装レポート
- フィードバック分析レポート
- 戦略的分析レポート
- CTO統合レポート

### 🔧 /implementation/ - 実装記録
**保存対象**: 実装プロセス、技術的実装記録
- フェーズ別実装記録
- 技術仕様書
- アーキテクチャ設計書

### 📋 /requirements/ - 要件・仕様書
**保存対象**: 要件定義、仕様書、企画書
- 機能要件書
- UI/UX要件書
- エラー対応要件書

### 🏗️ /development/ - 開発ガイドライン
**保存対象**: 開発プロセス、ガイドライン、ルール
- 開発ワークフロー
- コーディング規約
- AIルール・プロンプトテンプレート

### 📚 /guides/ - 操作・設定ガイド
**保存対象**: ユーザーガイド、設定方法、操作説明
- 機能別操作ガイド
- 設定方法
- トラブルシューティング

### 🔍 /analysis/ - 分析・調査報告
**保存対象**: パフォーマンス分析、市場調査、技術調査
- パフォーマンス分析
- 最適化レポート
- 市場分析

### 🗂️ /archive/ - アーカイブ
**保存対象**: 過去の記録、廃止された仕様、バックアップ
- 旧バージョン記録
- 廃止機能の記録
- 参考資料

## 📝 ファイル命名規則

### 基本形式
```
YYYY-MM-DD_[カテゴリ]_[内容名]_[バージョン].md
```

### カテゴリ別接頭辞
- **IMPL**: 実装記録 (Implementation)
- **REQ**: 要件書 (Requirements)
- **REPORT**: レポート類
- **GUIDE**: ガイド類
- **ANALYSIS**: 分析類
- **DESIGN**: 設計書

### 例
- `2025-07-30_REPORT_フィードバックシステム完全実装_v1.0.md`
- `2025-07-30_IMPL_3人格システム更新_v2.0.md`
- `2025-07-30_REQ_新機能要件定義_v1.0.md`

## 🎯 保存場所ルール

### 新規作成時の保存先決定フロー

1. **レポート系** → `/reports/`
   - 完成したプロジェクトレポート
   - 分析結果の総合レポート
   - CTO・エージェントによる統合レポート

2. **実装記録系** → `/implementation/`
   - コード実装の記録
   - 技術的変更の詳細
   - アーキテクチャ変更

3. **要件・仕様系** → `/requirements/`
   - 新機能の要件定義
   - UI/UX仕様書
   - エラー対応仕様

4. **開発プロセス系** → `/development/`
   - ワークフロー改善
   - 開発ルール更新
   - AI指示・テンプレート

5. **ガイド系** → `/guides/`
   - 使用方法説明
   - 操作ガイド
   - 設定方法

6. **分析系** → `/analysis/`
   - パフォーマンス分析
   - 最適化検討
   - 調査レポート

## 🔄 整理ルール

### 月次整理
- 各月末に古いファイルを`/archive/YYYY-MM/`に移動
- 重複ファイルの統合
- 不要ファイルの削除

### バージョン管理
- 同一内容の更新版は旧版を`/archive/`に移動
- 最新版のみメインディレクトリに保持

### ファイルサイズ制限
- 単一ファイル: 1MB以下推奨
- 大きなファイルは分割または圧縮

## 🎯 エージェント・AI向け指示

### 自動保存ルール
```javascript
// エージェントが従うべき保存場所決定ロジック
function determineFilePath(documentType, content) {
    const baseDir = '/Users/hideakimacbookair/Desktop/haqei-analyzer/docs/';
    
    switch(documentType) {
        case 'report':
        case 'feedback_report':
        case 'analysis_report':
            return baseDir + 'reports/';
            
        case 'implementation':
        case 'code_change':
        case 'technical_record':
            return baseDir + 'implementation/';
            
        case 'requirements':
        case 'specification':
        case 'feature_request':
            return baseDir + 'requirements/';
            
        case 'development':
        case 'workflow':
        case 'ai_rules':
            return baseDir + 'development/';
            
        case 'guide':
        case 'tutorial':
        case 'manual':
            return baseDir + 'guides/';
            
        case 'analysis':
        case 'performance':
        case 'optimization':
            return baseDir + 'analysis/';
            
        default:
            return baseDir + 'reports/'; // デフォルトはreports
    }
}
```

### 必須チェック項目
- [ ] 適切なディレクトリに保存されているか
- [ ] ファイル名が命名規則に従っているか  
- [ ] 重複ファイルが発生していないか
- [ ] 内容に応じた適切なカテゴリか

## 📊 現在の整理状況

### ✅ 整理完了状況（2025年7月30日完了）
- **Phase 1完了**: ルートディレクトリファイルの適切な場所への移動完了
- **Phase 2完了**: code-explanations内の整理とアーカイブ化完了
- **Phase 3完了**: 新規ファイルの命名規則統一準備完了
- **Phase 4完了**: 歴史的ファイルのアーカイブ移動完了

### 整理成果
- **ルートディレクトリクリーンアップ**: 散在ファイル12個を適切なディレクトリに分類・移動
- **code-explanations完全整理**: 歴史的開発記録を全て /archive/2025-07/ に整理
- **カテゴリ分類完了**: reports/, implementation/, requirements/, development/, guides/, analysis/ への分類完了
- **エージェント指示完備**: 全agents向けドキュメント作成指示を /development/ に配置

---

**このREADMEは、HAQEIプロジェクトのドキュメント管理の指針となる重要な文書です。**

*作成日: 2025年7月30日*  
*管理者: HAQEI開発チーム*