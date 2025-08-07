# Playwright MCP コンソールログ機能ガイド

## 🎯 概要

Playwright MCPには強力なコンソールログ取得機能が組み込まれており、ブラウザのコンソール出力をリアルタイムで監視・取得できます。

## 🚀 セットアップ

### 1. MCP環境起動
```bash
npm run mcp:claude:unsafe
```

### 2. Playwright MCP確認
MCPセットアップ時に以下が表示される:
```
3️⃣ Playwright MCP準備確認...
   ✅ Playwright MCP利用可能 (バージョン: Version 0.0.32)
   💡 コンソールログ機能: playwright_console_logs ツール利用可能
```

## 🔧 コンソールログツール使用方法

### ツール名
`playwright_console_logs`

### サポートするログタイプ
- `all` - 全てのログ
- `error` - エラーログ  
- `warning` - 警告ログ
- `log` - 一般ログ
- `info` - 情報ログ
- `debug` - デバッグログ
- `exception` - 例外ログ

### パラメータ
- `search` (文字列): ログ内検索テキスト
- `limit` (数値): 取得ログ数制限
- `type` (文字列): ログタイプフィルター
- `clear` (ブール): 取得後ログクリア（デフォルト: false）

## 📝 使用例

### 基本的な使用法
```
"Get the console log from the browser whenever you perform any action."
```

### エラーログのみ取得
```
playwright_console_logs({
  type: "error",
  limit: 50
})
```

### 特定キーワードを含むログ検索
```
playwright_console_logs({
  search: "HAQEI",
  type: "all",
  limit: 100
})
```

### ログ取得後クリア
```
playwright_console_logs({
  type: "all",
  clear: true
})
```

## 🎯 実践的な活用例

### HAQEIアナライザーでの使用
```javascript
// 1. ページを開く
playwright_navigate_to("http://localhost:8001/os_analyzer.html")

// 2. コンソールログを監視
"Monitor console logs for any errors during form interaction"

// 3. フォーム操作実行
playwright_click_element("button#start-analysis")

// 4. エラーログ取得
playwright_console_logs({
  type: "error",
  search: "Error",
  limit: 20
})
```

### デバッグワークフロー
```javascript
// 1. デバッグモードでページロード
playwright_navigate_to("http://localhost:8001/debug.html")

// 2. 全ログ取得（開発時）
playwright_console_logs({
  type: "all",
  limit: 100
})

// 3. 特定の問題を調査
playwright_console_logs({
  search: "HaQei",
  type: "error"
})
```

## 🔍 トラブルシューティング

### Playwright MCPが認識されない場合
1. MCPサーバーリストを確認:
```bash
# Claude Code内で
/tools list
```

2. MCP設定を再生成:
```bash
npm run mcp:generate
```

3. Playwright MCPを手動でテスト:
```bash
npx @playwright/mcp --version
```

### コンソールログが取得できない場合
- ブラウザが起動しているか確認
- JavaScriptエラーでページが停止していないか確認
- ログタイプフィルターが適切か確認

## 🎉 統合された機能

現在のHAQEI MCP環境には以下が含まれます:
- ✅ **Cipher** - HaQei哲学とプロジェクト記憶
- ✅ **Tsumiki** - AI駆動開発フレームワーク  
- ✅ **Serena** - セマンティックコード分析、ファイル監視
- ✅ **Playwright** - ブラウザ自動化 & **コンソールログ取得**
- ✅ **Claude Flow** - AI協調オーケストレーション (87専門ツール)
- ✅ **Ruv Swarm** - 分散エージェント協調システム

## 💡 ベストプラクティス

1. **ログレベル別使用**:
   - 開発時: `type: "all"`
   - 本番デバッグ: `type: "error"`
   - パフォーマンス調査: `search: "performance"`

2. **効率的な検索**:
   - キーワード検索で重要なログのみ取得
   - `limit`パラメータで出力量制御

3. **クリアタイミング**:
   - テスト前に`clear: true`でログをリセット
   - 長時間実行時は定期的にクリア

## 🔗 関連コマンド

```bash
# MCP環境セットアップ
npm run mcp:setup

# Claude Code起動（unsafe mode）
npm run mcp:claude:unsafe

# セッション復帰
npm run mcp:resume:unsafe
```

---

HAQEIアナライザーでのPlaywright MCPコンソールログ機能をフル活用して、効率的なデバッグと品質向上を実現しましょう！