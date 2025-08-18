# 🧹 HAQEIプロジェクト データクリーンアップ推奨リスト

## 📋 概要
プロジェクトのデータが大量に蓄積されており、管理しやすくするための不要ファイル整理リストです。

## 🗂️ クリーンアップ対象カテゴリ

### 🔴 【即座に削除推奨】- 危険度: 低

#### 1️⃣ テストファイル（HTML/JS）
```bash
# 一時的なテストファイル（約40+ファイル）
./test-help-system-integration.html
./test-analyze-button.html
./test-h384-integration.html
./test-even-questions-complete.html
./test-comprehensive-integration.html
./test-situation-analyzer.html
./test-os-analyzer.html
./test-optimized-analyzer.html
./test-cachemanager-fix.html
./test-answers-array-fix.html
./test-virtual-question-flow.html
./test-data-persistence-manager.html
./test-load-responsive.html
./test-migration-sample.html

# 推定削除効果: ~5-10MB
```

#### 2️⃣ デバッグファイル
```bash
# デバッグ用CJS/JSファイル（約20+ファイル）
./test-os-analyzer-navigation-debug-simple.cjs
./debug-future-simulator.cjs
./test-container-visibility-debug.cjs
./test-debug-validator.cjs
./debug-even-questions.js

# デバッグ用画像（約10ファイル）
./debug-initial-load.png
./debug-after-start-click.png
./complete-flow-scenario-test-error.png
./final-flow-test-error.png
./results-error-screenshot.png

# 推定削除効果: ~15-20MB
```

#### 3️⃣ バックアップファイル
```bash
# バックアップファイル（約5ファイル）
./public/future_simulator.html.backup-1754338213
./public/future_simulator.html.backup-1754346617

# 修正版ファイル
./quick-fix-test.cjs
./test-even-questions-fix-verification.cjs

# 推定削除効果: ~2-5MB
```

### 🟡 【検討要】- 危険度: 中

#### 4️⃣ レポートファイル（Markdown）
```bash
# 一時的な完了レポート（約30+ファイル）
./HAQEI_CRITICAL_FIX_IMPLEMENTATION_REPORT_20250804.md
./HAQEI_OS_ANALYZER_PAGE_FIX_SUMMARY_20250804.md
./HAQEI_HELP_SYSTEM_INTEGRATION_REPORT_20250805.md
./AUTHENTIC_ICHING_IMPLEMENTATION_COMPLETION_REPORT.md
./FINAL_IMPLEMENTATION_REPORT_20250804.md
./MCP_VERIFICATION_AUDIT_REPORT_20250804.md

# 注意: 重要な完了記録も含むため、アーカイブ化を検討
# 推定削除効果: ~5-15MB
```

#### 5️⃣ 一時JSONレポート
```bash
# テストレポートJSON（約10ファイル）
./virtual-persona-test-report-1754036806340.json
./ml-error-report.json
./question-display-test-report.json
./browser-test-report.json
./haqei-integration-test-report-1754315893966.json
./validation-report.json

# 推定削除効果: ~2-5MB
```

### 🟢 【保留推奨】- 危険度: 高

#### 6️⃣ 大容量データファイル
```bash
# ML学習データ（要確認）
./ml-dataset-1754010072881.json  # ~数MB

# システムキャッシュ（要確認）
./.serena/cache/typescript/document_symbols_cache_v23-06-25.pkl
./public/playwright-profiles/profile-main-test/GraphiteDawnCache/

# 辞書データ（機能に必要）
./public/dict/*.dat.gz  # 必須ファイル、削除しない

# 推定削除効果: ~20-50MB（要検証）
```

## 🎯 推奨クリーンアップ手順

### Phase 1: 安全削除（即座実行可能）
```bash
# 1. テストHTMLファイル削除
find . -name "test-*.html" -not -path "./node_modules/*" -delete

# 2. デバッグ画像削除  
find . -name "*debug*.png" -delete
find . -name "*error*.png" -delete

# 3. バックアップファイル削除
find . -name "*.backup-*" -delete

# 推定削除: ~20-30MB
```

### Phase 2: 選択的削除（レビュー後）
```bash
# 1. 古いレポート削除（日付指定）
find . -name "*_20250804.md" -delete

# 2. 一時JSONレポート削除
find . -name "*-report-*.json" -delete

# 推定削除: ~10-20MB
```

### Phase 3: 大容量ファイル検討
```bash
# 1. 大容量ファイル調査
find . -type f -size +1M -not -path "./node_modules/*" -ls

# 2. 不要キャッシュクリア（要検討）
# rm -rf ./.serena/cache/*
# rm -rf ./public/playwright-profiles/*
```

## 📊 予想削除効果

| カテゴリ | ファイル数 | 推定サイズ削減 |
|---------|-----------|---------------|
| テストファイル | ~40 | 5-10MB |
| デバッグファイル | ~30 | 15-20MB |
| バックアップ | ~10 | 2-5MB |
| レポート | ~30 | 5-15MB |
| **合計** | **~110** | **30-50MB** |

## ⚠️ 注意事項

1. **本番環境への影響**: 削除前に本番サイトへの影響を確認
2. **Git履歴**: 削除したファイルはGit履歴に残るため完全削除ではない
3. **復旧可能性**: 重要ファイルは事前にアーカイブ推奨
4. **段階的実行**: Phase 1から順番に実行し、各段階で動作確認

## 🔧 実行コマンド例

```bash
# 安全な削除コマンド（Phase 1）
git add . && git commit -m "データクリーンアップ前のバックアップ"

# テストファイル削除
find . -name "test-*.html" -not -path "./node_modules/*" -exec rm -v {} \;

# デバッグ画像削除
find . -name "*debug*.png" -exec rm -v {} \;
find . -name "*error*.png" -exec rm -v {} \;

# 結果確認
git status
```

---
**作成日**: 2025年8月5日  
**対象プロジェクト**: HAQEI Analyzer  
**推定効果**: 30-50MB削減、約110ファイル整理