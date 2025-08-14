# Claude Code Configuration - HAQEI Project (Essential)

## 🚨 CORE RULES (絶対遵守)

### 1. 指示範囲厳守
- **指示されたことだけを実行** - スコープ拡大絶対禁止
- **"ついでに改善"禁止** - 関連箇所への介入禁止
- **指示外のファイル修正禁止**

### 2. データ保護
- **既存データ削除禁止** - 必ずユーザー確認を取る
- **JSON、DB、設定ファイル削除前に明示的確認**
- **"クリーンアップ"目的の削除禁止**

### 3. 記憶保存必須
- **全変更を.serena/memoriesに記録** - 軽微な変更も必須
- **次回セッションでの消失防止**
- **作業完了前の記録保存**

### 4. エラー継続
- **API Error発生時も作業継続** - 停止禁止
- **スクリーンショット失敗時は代替手段使用**
- **スクリーンショットサイズ制限**: 8000px以下、fullPage使用禁止
- **エラー後も指示受信継続**

### 5. 根本解決優先
- **フォールバック・回避策禁止**
- **5WHY分析で根本原因特定**
- **症状治療ではなく原因治療**

## 🔄 4-PHASE DEVELOPMENT CYCLE

### Phase 1: EXPLORE
- 既存実装の調査 (Read/Grep/Glob)
- `.serena/memories` での過去知見確認
- 依存関係とアーキテクチャの理解

### Phase 2: PLAN  
- TodoWrite でタスク分解
- マイクロタスク化（30分以内）
- 実装アプローチの明確化

### Phase 3: IMPLEMENT
- **TDD Red-Green-Refactor サイクル必須**
- Red: テスト失敗確認（仕様固定）
- Green: 最小実装（テスト通過）  
- Refactor: 品質改善（ESLint/Prettier）

### Phase 4: VERIFY
- MCP testing による動作確認
- 統合テスト実行
- `.serena/memories` への記録完了

## 📂 専門設定ファイル参照

### HAQEI専用設定
詳細は `HAQEI_CONFIG.md` を参照
- HaQei philosophy implementation
- I Ching (易経) integration
- Agent selection strategy

### Playwright設定  
詳細は `PLAYWRIGHT_CONFIG.md` を参照
- Multi-instance concurrent setup
- **Screenshot size limits: 8000px max, width×height制限**
- **fullPage禁止**: 通常スクリーンショットのみ使用
- Error recovery protocols

### プロジェクト記憶
詳細は `.serena/memories/` を参照
- 過去の実装履歴
- 問題解決パターン
- アーキテクチャ決定記録

## 🔄 Basic Commands
```bash
# Memory check (session start)
ls .serena/memories/*$(date "+%Y%m%d")*

# MCP validation  
npm run claude "MCPでテストして"

# HAQEI agent usage
# See HAQEI_CONFIG.md for agent selection rules
```

## Important Notes
- **Date format**: Always use current system date `$(date "+%Y%m%d")`
- **File operations**: Read existing implementations before changes
- **Testing**: Run lint/typecheck after code changes
- **Documentation**: Keep this file under 100 lines