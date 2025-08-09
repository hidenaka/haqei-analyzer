# HaQei Analyzer 統合テストシステム

## 概要

HaQei Analyzer の行動主導型変化システム全体を包括的にテストするための統合テストシステムです。

## 🎯 テスト対象

### 状況推定層
- **SituationalContextEngine**: 状況分析・時系列ダイナミクス
- **DeepPsychologicalAnalyzer**: 深層心理パターン分析
- **ProbabilisticSituationModeler**: 確率的状況モデリング

### 易経マッピング層
- **HexagramMappingEngine**: 64卦マッピング・五行相生相剋・時系列変化分析
- **MetaphorGenerationEngine**: メタファー生成・現代的解釈
- **CulturalAdaptationEngine**: 文化的適応・世代職業地域別調整

### 行動変化層
- **ActionTriggeredTransformationEngine**: 行動条件定義・変化トリガー
- **UnifiedTransformationEngine**: 5種類の易経的変化予測
- **MultiDimensionalPathVisualizer**: 多次元変化パス可視化

## 🚀 クイックスタート

### 1. 手動テスト実行（推奨）

```bash
# Webベースのテストランナーを開く
npm run test:manual
# または
open tests/integrated-test-runner.html
```

### 2. 自動テスト実行

```bash
# 基本的なスモークテスト
npm test

# 全機能テスト（詳細ログ付き）
npm run test:full

# パフォーマンステストのみ
npm run test:performance

# CI環境用（レポート無し）
npm run test:ci
```

## 📋 テストスイート

### smoke（スモークテスト）
基本的な動作確認テスト
- 環境確認
- コンポーネント利用可能性
- 基本フロー

```bash
npm test
# または
node tests/automated-test-runner.js --suite=smoke
```

### regression（回帰テスト）
既存機能の確認
- 単体テスト
- 統合テスト
- データ整合性

```bash
npm run test:unit
# または
node tests/automated-test-runner.js --suite=regression
```

### performance（パフォーマンステスト）
性能要件の確認
- 応答時間
- メモリ使用量
- 同時ユーザー対応

```bash
npm run test:performance
# または
node tests/automated-test-runner.js --suite=performance
```

### full（全機能テスト）
すべてのテストカテゴリを実行
- 環境テスト
- 単体テスト
- 統合テスト
- システムテスト
- パフォーマンステスト
- ユーザビリティテスト

```bash
npm run test:full
# または
node tests/automated-test-runner.js --suite=full --verbose
```

## 🎛️ 実行オプション

### コマンドライン引数

```bash
# テストスイート指定
--suite=smoke|regression|performance|full

# 環境指定
--env=development|staging|production

# 詳細ログ出力
--verbose

# レポート生成無効
--no-report

# 通知送信有効
--notify

# ヘルプ表示
--help
```

### 実行例

```bash
# ステージング環境で全テスト（詳細ログ付き）
node tests/automated-test-runner.js --suite=full --env=staging --verbose

# パフォーマンステスト（通知付き）
node tests/automated-test-runner.js --suite=performance --notify

# CI用レポート無しテスト
node tests/automated-test-runner.js --suite=regression --env=staging --no-report
```

## 📊 テスト設定

### 設定ファイル: `tests/test-config.json`

```json
{
  "testEnvironments": {
    "development": {
      "baseUrl": "http://localhost:8001",
      "timeout": 10000,
      "retryCount": 3
    }
  },
  "performanceThresholds": {
    "responseTime": {
      "situationalAnalysis": 3000,
      "hexagramMapping": 2000,
      "fullFlow": 5000
    }
  }
}
```

## 🧪 テストファイル構成

```
tests/
├── README.md                    # このファイル
├── test-config.json            # テスト設定
├── integrated-test-system.js   # メインテストロジック
├── integrated-test-runner.html # Webベーステストランナー
├── automated-test-runner.js    # CLI自動テストランナー
└── reports/                    # テストレポート出力
    ├── test-report-YYYY-MM-DD.json
    └── test-report-YYYY-MM-DD.html
```

## 📈 テスト結果

### 成功基準
- **環境テスト**: 必要なブラウザ機能・ライブラリ・データファイルが利用可能
- **単体テスト**: 各コンポーネントが独立して正常動作
- **統合テスト**: コンポーネント間の連携が正常
- **パフォーマンステスト**: 応答時間が基準以内
- **システムテスト**: エンドツーエンドフローが完了

### パフォーマンス基準
- **状況分析**: 3秒以内
- **卦マッピング**: 2秒以内
- **文化適応**: 1.5秒以内
- **フルフロー**: 5秒以内

### 品質基準
- **成功率**: 90%以上
- **信頼度**: 各コンポーネント0.6以上
- **エラー率**: 1%未満

## 🔧 トラブルシューティング

### よくある問題

#### 1. コンポーネントが見つからない
```bash
# 必要なファイルが存在するか確認
ls public/js/pages/future-simulator/SituationalContextEngine.js
ls public/js/pages/future-simulator/HexagramMappingEngine.js
ls public/js/pages/future-simulator/CulturalAdaptationEngine.js
```

#### 2. データファイルが見つからない
```bash
# データファイルの存在確認
ls public/assets/H384H64database.js
```

#### 3. サーバーが起動していない
```bash
# ローカルサーバー起動
npm run dev
# または
node local-dev-server.js
```

#### 4. テストタイムアウト
```bash
# タイムアウト時間を延長
node tests/automated-test-runner.js --suite=smoke --timeout=30000
```

### デバッグ方法

#### 1. 詳細ログを有効化
```bash
# 詳細ログ付きでテスト実行
npm run test:full
```

#### 2. 個別テスト実行
```bash
# 特定のテストスイートのみ実行
npm run test:unit
npm run test:performance
```

#### 3. ブラウザ開発者ツール
1. `tests/integrated-test-runner.html`をブラウザで開く
2. 開発者ツール（F12）でコンソールを確認
3. 詳細ログを確認

## 📝 レポート

### 自動生成レポート
- **JSONレポート**: `reports/test-report-{suite}-{timestamp}.json`
- **HTMLレポート**: `reports/test-report-{suite}-{timestamp}.html`

### レポート内容
- テスト実行サマリー
- 個別テスト結果詳細
- パフォーマンスメトリクス
- 推奨事項

### レポート例
```json
{
  "summary": {
    "total": 25,
    "passed": 23,
    "failed": 1,
    "skipped": 1,
    "passRate": 96
  },
  "performance": {
    "averageExecutionTime": 1250,
    "slowestTest": {...},
    "fastestTest": {...}
  }
}
```

## 🔄 CI/CD統合

### GitHub Actions例
```yaml
name: HaQei Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:ci
```

### npm scripts統合
```json
{
  "scripts": {
    "validate": "npm run test && npm run lint",
    "deploy": "npm run validate && npm run deploy:production"
  }
}
```

## 🚀 今後の拡張

### 計画中の機能
1. **視覚的回帰テスト**: スクリーンショット比較
2. **アクセシビリティテスト**: WCAG 2.1 準拠確認
3. **セキュリティテスト**: XSS・CSRF対策確認
4. **負荷テスト**: 大量同時アクセステスト
5. **E2Eテスト**: Playwright統合
6. **モバイルテスト**: 各種デバイス対応確認

### 技術的改善
1. **並列実行**: テスト実行時間短縮
2. **メモリ最適化**: 大規模テスト対応
3. **レポート強化**: より詳細な分析
4. **通知機能**: Slack・メール連携

## 📞 サポート

### 問題報告
- GitHub Issues: プロジェクトリポジトリ
- テストエラー: 詳細ログと設定を添付

### 開発チーム連絡先
- 技術チーム: tech@haqei.com
- QAチーム: qa@haqei.com

---

**最終更新**: 2025年8月2日  
**バージョン**: 1.0.0  
**対象システム**: HaQei Analyzer v3.0.0