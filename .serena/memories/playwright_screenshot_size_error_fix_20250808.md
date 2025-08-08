# Playwright スクリーンショット画像サイズエラー対策実装
Date: 2025-08-08
Status: Completed

## 問題の背景
ユーザーから報告された問題：
```
API Error: 400 {"type":"error","error":{"type":"invalid_request_error",
"message":"messages.1.content.27.image.source.base64.data: At least one 
of the image dimensions exceed max allowed size: 8000 pixels"}}
```

- fullPage: true でのスクリーンショット撮影時に8000px制限に引っかかる
- 作業が途中で停止してしまう
- 特に長いページの検証時に頻発

## 実施した対策

### 1. PLAYWRIGHT SCREENSHOT SIZE ERROR HANDLING セクション追加
```markdown
### 📸 PLAYWRIGHT SCREENSHOT SIZE ERROR HANDLING
**CRITICAL ISSUE**: API Error 400 - Image dimensions exceed 8000px limit
```

### 2. 自動サイズ制限回避ルール
```javascript
// ❌ 禁止: fullPage screenshots for large pages
fullPage: true  // 8000px制限に引っかかる可能性

// ✅ 推奨: Viewport-only screenshots
fullPage: false  // ビューポート内のみで制限内に収める
```

### 3. 4つの代替戦略を提供
1. **Strategy 1**: Viewport-only capture (推奨)
2. **Strategy 2**: Element-specific capture (特定要素のみ)
3. **Strategy 3**: Compressed JPEG format (圧縮で軽量化)
4. **Strategy 4**: Multiple viewport captures (長いページを分割)

### 4. 必須スクリーンショットルール制定
1. **fullPage: true禁止** - ページ高さ6000px未満確認済みの場合のみ
2. **事前ページ高さチェック** - fullPage前に必ず確認
3. **デフォルトはviewport-only** - すべての検証スクリーンショット
4. **要素キャプチャ活用** - 特定UIコンポーネント検証用

## 技術的詳細

### 推奨スクリーンショット設定
```javascript
// 基本設定（最も安全）
{
  fullPage: false,
  raw: false,  // JPEG圧縮
  filename: "verification.jpg"
}

// 要素特定設定
{
  element: "main content",
  ref: "element-ref",
  filename: "component.png"
}
```

## 変更ファイル
- `/Users/nakanohideaki/Desktop/haqei-analyzer/CLAUDE.md`
  - Line 774-829: PLAYWRIGHT SCREENSHOT SIZE ERROR HANDLING 追加

## 影響範囲
- すべてのPlaywrightスクリーンショット撮影で8000px制限エラー回避
- 作業の中断が防止される
- 検証作業の継続性が保証される

## 期待される効果
1. **エラー撲滅**: 画像サイズ超過エラーの完全回避
2. **作業効率**: 中断なしでの検証作業継続
3. **柔軟性**: 4つの代替戦略で様々なページに対応
4. **品質向上**: より適切なスクリーンショット取得

## 次回参照用キーワード
- Playwright, スクリーンショット, 8000px制限, API Error 400, fullPage禁止