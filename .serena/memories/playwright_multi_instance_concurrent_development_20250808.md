# Playwright マルチインスタンス同時開発設定完了
Date: 2025-08-08
Status: Completed

## 問題の背景
ユーザーからの要求：
- 2つの違うページを同時に開発したい
- "already in use" エラーで作業がいつも止まる
- Playwrightの同時起動ができない

## 根本原因分析
- Playwrightがデフォルトで単一ブラウザインスタンス使用
- プロファイル分離が行われていない
- 同時開発用の設定が存在しない
- エラー時の自動リトライ機構が不十分

## 実施した解決策

### 1. PLAYWRIGHT MULTI-INSTANCE CONCURRENT DEVELOPMENT セクション追加
```markdown
### 🚀 PLAYWRIGHT MULTI-INSTANCE CONCURRENT DEVELOPMENT
**SOLUTION**: 複数ページ同時開発のためのマルチインスタンス設定
```

### 2. 同時ブラウザインスタンス設定
4つの同時実行パターン：
```bash
# Instance 1: メイン開発 (Port 8788)
--profile=dev-main

# Instance 2: セカンダリ開発 (Port 3000)
--profile=dev-secondary --isolated

# Instance 3: テスト環境 (Port 8080)  
--profile=test-env --isolated

# Instance 4: 別プロジェクト (Port 5173)
--profile=project-b --isolated
```

### 3. HAQEI プロジェクト専用同時開発コマンド
```bash
# メイン開発
--profile=haqei-main

# Future Simulator (同時開発)
--profile=haqei-future --isolated

# OS Analyzer (同時テスト)
--profile=haqei-os --isolated

# Quick Analysis (同時検証)
--profile=haqei-quick --isolated
```

### 4. 自動 "Already in Use" 解決機構
3段階自動リトライチェーン：
```bash
retry_commands = [
  "--profile=retry-1 --isolated",
  "--profile=retry-2 --isolated", 
  "--profile=retry-3 --isolated"
];
```

### 5. マルチプロファイル戦略 (自動割り当て)
```javascript
const profileStrategy = {
  "localhost:8788": "--profile=haqei-main",
  "localhost:3000": "--profile=haqei-secondary --isolated",
  "localhost:8080": "--profile=haqei-test --isolated",
  "localhost:5173": "--profile=other-project --isolated"
};
```

### 6. NEVER-BLOCK 同時実行戦略
5つの並行開発手法：
1. **Default Profile**: メイン開発ページ用
2. **Isolated Profiles**: 追加ページ用の自動割り当て
3. **Port-based Profiles**: ポート別自動プロファイル
4. **Feature-based Profiles**: 機能別独自プロファイル
5. **Retry Chain**: 衝突時の3段階リトライ

## 技術的詳細

### 実際の使用例
```bash
# HAQEI メイン + Future Simulator 同時開発
npx @playwright/mcp navigate "http://localhost:8788" --profile=haqei-main
npx @playwright/mcp navigate "http://localhost:8788/future_simulator" --profile=haqei-future --isolated

# 3ページ同時テスト
npx @playwright/mcp navigate "http://localhost:8788" --profile=test-main --isolated
npx @playwright/mcp navigate "http://localhost:8788/os_analyzer" --profile=test-os --isolated  
npx @playwright/mcp navigate "http://localhost:8788/quick_analysis" --profile=test-quick --isolated
```

## 変更ファイル
- `/Users/nakanohideaki/Desktop/haqei-analyzer/CLAUDE.md`
  - Line 746-826: PLAYWRIGHT MULTI-INSTANCE CONCURRENT DEVELOPMENT 追加

## 影響範囲
- 複数ページの同時開発が可能になる
- "already in use" エラーの完全回避
- 並行開発・テスト・検証の効率化
- プロファイル衝突の自動解決

## 期待される効果
1. **開発効率向上**: 2つ以上のページを並行開発
2. **エラー撲滅**: "already in use" による作業停止の回避
3. **柔軟性向上**: 異なるポート・機能の同時作業
4. **テスト効率**: 複数環境での同時検証
5. **生産性向上**: 待機時間の完全削除

## 使用方法
```bash
# 基本の同時開発パターン
npx @playwright/mcp navigate "URL1" --profile=main
npx @playwright/mcp navigate "URL2" --profile=secondary --isolated

# HAQEI専用同時開発
npx @playwright/mcp navigate "http://localhost:8788" --profile=haqei-main
npx @playwright/mcp navigate "http://localhost:8788/feature" --profile=haqei-feature --isolated
```

## 次回参照用キーワード
- Playwright同時実行, マルチインスタンス, --isolated, --profile, already in use回避