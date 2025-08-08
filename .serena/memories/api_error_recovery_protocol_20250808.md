# API Error 400 自動復旧プロトコル実装完了
Date: 2025-08-08
Status: Completed

## 問題の背景
ユーザーから報告された重大な問題：
- API Error 400が発生すると、その後の指示を一切聞かなくなる
- 作業が完全に停止してしまう
- エラー発生 = 作業終了という致命的な動作

## 根本原因分析
- API Error 400によりワークフローが完全停止
- エラーハンドリングが不十分でフェイルファスト過ぎる
- 復旧メカニズムが存在しない
- 代替手段への切り替えができない

## 実施した対策

### 1. API ERROR RECOVERY PROTOCOL セクション追加
```markdown
### 🔄 API ERROR RECOVERY PROTOCOL
**CRITICAL ISSUE**: API Error 400により指示を聞かなくなる問題
```

### 2. 自動エラー復旧ルール制定
```javascript
const apiErrorRecovery = {
  onApiError400: "CONTINUE execution despite error",
  skipFailedOperation: "Mark operation as failed, continue next step", 
  maintainWorkflow: "Never stop listening to user instructions",
  documentError: "Record error in memory, but keep working"
};
```

### 3. 5段階自動フォールバックチェーン
API Error 400発生時の必須動作：
1. **即座にスキップ** - スクリーンショットを諦め、次に進む
2. **指示処理継続** - ユーザーコマンドの受信を維持
3. **代替検証使用** - テキストベース検証に切り替え
4. **エラー記録** - 将来の参照用に記録
5. **制限付完了報告** - 部分完了として報告

### 4. NEVER-STOP PROTOCOL (絶対停止禁止)
```javascript
function handleApiError400() {
  // エラーログ → 失敗操作スキップ → ワークフロー継続 → 指示受信維持 → 代替検証
}
```

### 5. 継続コマンドパターン
エラー後の必須メッセージ：
- "Screenshot failed due to size limit - continuing verification..."  
- "Using text-based confirmation instead of visual proof..."
- "Ready for next instruction despite previous error..."

## 技術的詳細

### 禁止パターン
```bash
❌ "API Error occurred, stopping execution..."
```

### 必須パターン  
```bash
✅ "API Error detected - skipping screenshot, continuing with next task..."
✅ "Error logged, proceeding with alternative verification method..."
```

### 5つの重要エラーハンドリングルール
1. **API Error = Skip + Continue** - 全ワークフローを停止させない
2. **Alternative verification** - スクリーンショット失敗時はテキスト説明使用
3. **Keep listening** - 常に次のユーザー指示に対応可能
4. **Memory logging** - エラー記録もブロッキング要因にしない
5. **Graceful degradation** - 完全失敗より部分完了を選択

## 変更ファイル
- `/Users/nakanohideaki/Desktop/haqei-analyzer/CLAUDE.md`
  - Line 831-899: API ERROR RECOVERY PROTOCOL 追加

## 影響範囲
- API Error 400が発生しても作業が継続される
- スクリーンショット失敗時でも検証作業が完了する
- ユーザー指示の受信が継続される
- エラー耐性の大幅向上

## 期待される効果
1. **作業継続性**: エラーによる作業停止の完全回避
2. **レジリエンス**: 部分的失敗でも全体を完了
3. **ユーザビリティ**: エラー後も指示が通る
4. **生産性向上**: エラー復旧時間の短縮

## 次回参照用キーワード
- API Error 400, 自動復旧, 継続プロトコル, エラーハンドリング, NEVER-STOP