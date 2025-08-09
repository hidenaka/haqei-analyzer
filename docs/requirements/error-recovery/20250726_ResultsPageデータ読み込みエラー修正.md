# 20250726_ResultsPageデータ読み込みエラー修正

**発生日時**: 2025-07-26  
**エラー種別**: MIME Type Error / Data Loading Failure  
**影響範囲**: results.html ページのデータ読み込み全体  
**緊急度**: 高  

## 🚨 エラー概要

### 発生状況
results.htmlページにアクセス時、以下のエラーが発生：

1. **MIMEタイプエラー** (4件)
   ```
   Refused to execute script from 'http://localhost:8788/new-analyzer/js/data/data_box.js' 
   because its MIME type ('text/html') is not executable
   ```
   - 対象ファイル: `data_box.js`, `questions.js`, `vectors.js`, `hexagrams.js`
   - 原因: 404エラーによりHTMLエラーページが返され、JavaScriptとして実行しようとしている

2. **DataManager読み込み無限ループ**
   ```
   🔍 [DataManager] 利用可能なデータ: 0/4 {WORLDVIEW_QUESTIONS: '未読み込み', ...}
   ```
   - 30回のリトライ後タイムアウト（6秒間）
   - フォールバックデータで動作継続するが、本来のデータが使用不可

### 再現手順
1. analyzer.htmlで診断を完了
2. results.htmlへ自動リダイレクト
3. 上記エラーが発生し、データが正常に読み込まれない

## 🔍 根本原因分析

### パス構造の詳細調査

#### 現在のファイル構造
```
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
│           └── compatibility/     # 別ファイルのみ存在
```

#### results.htmlでの誤った参照
```html
<!-- 現在の参照（16-19行目） -->
<script src="js/data/data_box.js"></script>      <!-- ❌ 404エラー -->
<script src="js/data/questions.js"></script>     <!-- ❌ 404エラー -->  
<script src="js/data/vectors.js"></script>       <!-- ❌ 404エラー -->
<script src="js/data/hexagrams.js"></script>     <!-- ❌ 404エラー -->

<!-- 正しい参照（修正後） -->
<script src="../js/data/data_box.js"></script>   <!-- ✅ 正常読み込み -->
<script src="../js/data/questions.js"></script>  <!-- ✅ 正常読み込み -->
<script src="../js/data/vectors.js"></script>    <!-- ✅ 正常読み込み -->
<script src="../js/data/hexagrams.js"></script>  <!-- ✅ 正常読み込み -->
```

### DataManagerエラーチェーン
```javascript
// エラーの流れ
1. results.html読み込み開始
2. 4つのデータファイルで404エラー発生
3. window.HAQEI_DATA, window.WORLDVIEW_QUESTIONS等が未定義のまま
4. DataManager.waitForGlobalData()が30回リトライ
5. タイムアウト後、フォールバックデータで継続
6. 対話型UIは表示されるが、限定的なデータのみ利用可能
```

## 🛠️ 修復手順

### 1. results.htmlスクリプトパス修正

#### results.html（16-19行目）
```html
<!-- 修正前 -->
<script src="js/data/data_box.js"></script>
<script src="js/data/questions.js"></script>
<script src="js/data/vectors.js"></script>
<script src="js/data/hexagrams.js"></script>

<!-- 修正後 -->
<script src="../js/data/data_box.js"></script>
<script src="../js/data/questions.js"></script>
<script src="../js/data/vectors.js"></script>
<script src="../js/data/hexagrams.js"></script>
```

### 2. パス検証コマンド

#### ファイル存在確認
```bash
# 修正前（エラーパス）
ls -la /Users/nakanohideaki/Desktop/haqei-analyzer/public/new-analyzer/js/data/data_box.js
# -> No such file or directory

# 修正後（正しいパス）
ls -la /Users/nakanohideaki/Desktop/haqei-analyzer/public/js/data/data_box.js
# -> ファイル存在確認
```

#### 相対パス検証
```bash
# results.htmlからの相対パス確認
cd /Users/nakanohideaki/Desktop/haqei-analyzer/public/new-analyzer
ls -la ../js/data/
# -> data_box.js, questions.js, vectors.js, hexagrams.js が表示されるはず
```

### 3. DataManager動作確認

#### 修正後の期待されるログ
```javascript
// 正常なデータ読み込み時のログ
✅ HAQEI_DATA グローバル変数設定完了
✅ Questions data loaded and set to window: {WORLDVIEW_QUESTIONS: 24, SCENARIO_QUESTIONS: 6}
✅ Vectors data loaded and set to window: 64 hexagrams
✅ Hexagrams data loaded and set to window: 64 hexagrams
🔍 [DataManager] 利用可能なデータ: 4/4 {WORLDVIEW_QUESTIONS: '読み込み済み', ...}
```

## 📋 テスト検証手順

### 1. **修正前エラー確認**
```bash
# ブラウザのDevToolsで確認
# Network タブで 404 エラー × 4件
# Console タブで MIME type エラー × 4件
```

### 2. **修正後正常動作確認**
```bash
# ブラウザのDevToolsで確認
# Network タブで 200 OK × 4件
# Console タブでデータ読み込み成功ログ
```

### 3. **対話型UI動作確認**
- レーダーチャートが完全なデータで表示
- OSカードに実際のデータが表示
- 力学データが正常に可視化

### 4. **パフォーマンス確認**
- DataManagerのリトライループが発生しない
- ページ読み込み時間の短縮（6秒のタイムアウト待機が解消）

## 🔒 予防策

### 1. パスバリデーションシステム
```javascript
// results.html初期化時にパス検証を追加
async function validateScriptPaths() {
    const requiredPaths = [
        '../js/data/data_box.js',
        '../js/data/questions.js', 
        '../js/data/vectors.js',
        '../js/data/hexagrams.js'
    ];
    
    for (const path of requiredPaths) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            if (!response.ok) {
                console.error(`❌ Required script not found: ${path}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Path validation failed: ${path}`, error);
            return false;
        }
    }
    
    console.log('✅ All required scripts validated');
    return true;
}
```

### 2. ファイル構造ドキュメント化
```markdown
# HaQei Analyzer ファイル構造

## データファイル配置
```
public/
├── js/data/                    # メインデータファイル
│   ├── data_box.js            # 基本データ
│   ├── questions.js           # 質問データ
│   ├── vectors.js             # ベクトルデータ
│   └── hexagrams.js           # 卦データ
└── new-analyzer/
    ├── results.html           # 結果表示ページ
    └── js/data/compatibility/  # 互換性データのみ
```

## 参照パターン
- `analyzer.html` から: `js/data/xxx.js`
- `results.html` から: `../js/data/xxx.js`
```

### 3. 自動テストスクリプト
```bash
#!/bin/bash
# test-results-page.sh
echo "🧪 Testing results.html script paths..."

BASE_DIR="/Users/nakanohideaki/Desktop/haqei-analyzer/public"
RESULTS_DIR="$BASE_DIR/new-analyzer"

cd "$RESULTS_DIR"

REQUIRED_FILES=(
    "../js/data/data_box.js"
    "../js/data/questions.js"
    "../js/data/vectors.js"
    "../js/data/hexagrams.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo "🎉 All required files validated"
```

## 🎯 期待される結果

### 修正前（問題状態）
- ❌ MIMEタイプエラー × 4件
- ❌ DataManager 30回リトライ + 6秒タイムアウト
- ❌ フォールバックデータのみで動作
- ❌ 限定的な対話型UI機能

### 修正後（正常状態）
- ✅ 全スクリプトが正常読み込み
- ✅ DataManager 1回で成功
- ✅ 完全なデータセットで動作
- ✅ フル機能の対話型UI

---

**作成者**: Claude Code Assistant  
**次回レビュー**: 修正実装後即座に検証  
**関連ドキュメント**: 
- `CLAUDE.md` - 実装履歴
- `20250726_対話型UI再実装要件書.md` - 元の実装要件
- `/docs/code-explanations/` - 技術詳細解説