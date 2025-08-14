# Claude Code Configuration - HAQEI Project

## 🎯 開発フロー（必ず順番通り実行）

### 標準サイクル: 仕様確認 → AI理解確認 → テスト作成 → 実装 → 検証

```bash
# 1. 仕様確認
cat CLAUDE.md                              # この文書を必ず読む
ls .serena/memories/*$(date "+%Y%m%d")*   # 今日の作業履歴確認
```

### 🤖 2. AI理解確認（実装前に必須）
実装開始前に、以下4点を必ず回答してください：
1. **理解している実装内容**: 何を作るか具体的に説明
2. **不明な点や確認事項**: 曖昧な箇所をリストアップ
3. **実装順序とチェックポイント**: 各ステップと完了基準
4. **想定される技術的課題**: 予想される問題と対策

```bash
# 3. テストファースト（可能な限り）
echo "// テスト: 期待される動作" > test-feature.js
npm test -- test-feature.js                # RED: 失敗確認

# 4. 実装
# コード実装...
npm test -- test-feature.js                # GREEN: 成功確認

# 5. 検証（必須）
npm run lint                               # エラー0確認
npm run mcp                                # ブラウザ動作確認

# 6. テストファイル管理
# 実装完了・動作確認後は削除可能
rm test-*.js                               # 一時テストファイル削除
```

## 🚨 CORE RULES (絶対遵守)

### 1. 指示範囲厳守
- **指示されたことだけを実行** - スコープ拡大絶対禁止
- **"ついでに改善"禁止** - 関連箇所への介入禁止
- **指示外のファイル修正禁止**

### 2. データ保護
- **既存データ削除禁止** - 必ずユーザー確認を取る
- **package.json削除時**: `git restore package.json`

### 3. 記憶保存必須
- **全変更を.serena/memoriesに記録**
- **ファイル名**: `作業内容_$(date "+%Y%m%d").md`

### 4. ドキュメント命名規則
- **全ドキュメントは日付先頭**: `$(date "+%Y%m%d")_ドキュメント名.md`
- **例**: `20250812_要件定義.md`, `20250812_テスト結果.md`
- **レポート・設計書・仕様書すべて適用**

### 5. エラー対応
- **API Error発生時も作業継続** - 停止禁止
- **スクリーンショットサイズ制限**: 8000px以下、fullPage禁止

### 6. 根本解決優先（5WHY分析）
エラーや問題が発生したら、以下の形式で根本原因を特定：
```
問題: [発生した問題]
Why1: なぜ起きた？ → [直接原因]
Why2: なぜその原因が？ → [より深い原因]
Why3: なぜそれが？ → [さらに深い原因]
Why4: なぜ？ → [構造的原因]
Why5: なぜ？ → [根本原因]
対策: [根本原因への対処法]
```

## 🔄 4-PHASE DEVELOPMENT CYCLE

### Phase 1: EXPLORE（調査）
```bash
grep -r "機能名" public/                   # 既存実装検索
cat .serena/memories/*keyword*             # 過去作業確認
```

### Phase 2: PLAN（計画）  
- TodoWrite でタスク分解
- **AI理解確認の4項目に回答**

### Phase 3: IMPLEMENT（実装）
- テストファーストで開発
- 最小実装 → リファクタリング

### Phase 4: VERIFY（検証）
```bash
npm run mcp                                # ブラウザテスト
echo "## 実装内容..." > .serena/memories/機能名_$(date "+%Y%m%d").md
```

## 📂 重要ファイル
```
/public/os_analyzer.html   # メインアプリ
/public/js/core/          # コア機能
/data/*.json              # データ（削除禁止）
/.serena/memories/        # 作業記録（必須）
```

## 🔧 必須コマンド
```bash
npm run dev    # 開発サーバー (localhost:8788)
npm run mcp    # Playwright MCP環境
npm test       # テスト実行
npm run lint   # ESLint
```

## 📌 判断に迷ったら
- データ削除 → **ユーザー確認必須**
- エラー発生 → **継続して作業**
- 実装開始 → **AI理解確認の4項目に回答**
- 問題発生 → **5WHY分析で根本原因特定**

## ⚠️ バックアップ情報
- 旧バージョン: `CLAUDE_BACKUP_20250812.md`
- 復元コマンド: `cp CLAUDE_BACKUP_20250812.md CLAUDE.md`