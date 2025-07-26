# ResultsPageデータ読み込み修正（2025-07-26）

## 🐛 修正したエラー
results.htmlページで4つのデータファイルが404エラーで読み込めない問題を修正しました。

### エラー内容
1. **MIMEタイプエラー** (4件)
   ```
   Refused to execute script from 'js/data/data_box.js' because its MIME type ('text/html') is not executable
   ```

2. **DataManager読み込み無限ループ**
   - 30回のリトライ後タイムアウト（6秒間）
   - フォールバックデータで動作継続

## 🔧 技術的な修正内容

### パス構造の問題
```
# ファイル構造
haqei-analyzer/
├── public/
│   ├── js/data/                    # 実際のデータファイル位置
│   │   ├── data_box.js            # ✅ 存在
│   │   ├── questions.js           # ✅ 存在  
│   │   ├── vectors.js             # ✅ 存在
│   │   └── hexagrams.js           # ✅ 存在
│   └── new-analyzer/
│       ├── results.html           # 問題のファイル
│       └── js/data/               # ❌ 該当ファイルなし
```

### 修正したコード
```html
<!-- results.html 16-19行目 -->

<!-- 修正前（404エラー） -->
<script src="js/data/data_box.js"></script>
<script src="js/data/questions.js"></script>
<script src="js/data/vectors.js"></script>
<script src="js/data/hexagrams.js"></script>

<!-- 修正後（正常読み込み） -->
<script src="../js/data/data_box.js"></script>
<script src="../js/data/questions.js"></script>
<script src="../js/data/vectors.js"></script>
<script src="../js/data/hexagrams.js"></script>
```

## 💡 修正の背景

### 相対パスの理解
- `results.html` の位置: `/new-analyzer/results.html`
- データファイルの位置: `/js/data/xxx.js`
- 正しい相対パス: `../js/data/xxx.js` (一つ上のディレクトリに移動)

### DataManagerへの影響
修正により以下が改善：
```javascript
// 修正前: エラー状態
🔍 [DataManager] 利用可能なデータ: 0/4 {WORLDVIEW_QUESTIONS: '未読み込み', ...}
⚠️ [DataManager] データ読み込みタイムアウト (6秒)

// 修正後: 正常状態
✅ HAQEI_DATA グローバル変数設定完了
✅ Questions data loaded and set to window: {WORLDVIEW_QUESTIONS: 24, SCENARIO_QUESTIONS: 6}
🔍 [DataManager] 利用可能なデータ: 4/4 {WORLDVIEW_QUESTIONS: '読み込み済み', ...}
```

## 🎯 修正効果

### パフォーマンス改善
- ✅ MIMEタイプエラー × 4件が解消
- ✅ DataManagerの30回リトライループが解消
- ✅ 6秒のタイムアウト待機が解消
- ✅ ページ読み込み時間の大幅短縮

### 機能改善
- ✅ 完全なデータセットで対話型UI動作
- ✅ レーダーチャートが実データで表示
- ✅ OSカードに実際のデータが表示
- ✅ 力学データが正常に可視化

## 📋 関連ドキュメント
- **要件書**: `/requirements/error-recovery/20250726_ResultsPageデータ読み込みエラー修正.md`
- **元の実装**: `/docs/code-explanations/20250726_対話型UI実装.md`