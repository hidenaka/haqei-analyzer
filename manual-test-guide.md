# 📋 OS Analyzer 手動テストガイド

## 🚀 今すぐテストする方法

### ステップ1: ブラウザで開く
```bash
# ターミナルで実行
cd /Users/hideakimacbookair/Desktop/haqei-analyzer
open os_analyzer.html
```

または、Finderから直接 `os_analyzer.html` をダブルクリック

### ステップ2: 実機テスト手順

## 📸 スクリーンショット撮影ポイント

### 1️⃣ 初期画面
- **確認事項**:
  - HaQeiタイトル表示
  - 3つのOS説明カード
  - 「✨ 仮想人格生成を開始する」ボタン

### 2️⃣ 質問画面（開始ボタンクリック後）
- **確認事項**:
  - 質問1が表示される
  - 「新しいことを始めるとき、あなたはどんなアプローチを取りますか？」
  - 5つの選択肢
  - 次へボタン

### 3️⃣ 分析画面（36問完了後）
- **確認事項**:
  - 「分析中...」表示
  - ローディングアニメーション

### 4️⃣ 結果画面
- **確認事項**:
  - Engine OS カード
  - Interface OS カード
  - Safe Mode OS カード
  - 各カードに64卦番号と名前

## 🧪 クイックテスト（5分）

### 最小動作確認
1. **開始**: 「仮想人格生成を開始する」をクリック
2. **質問1**: 最初の選択肢を選んで「次へ」
3. **質問2-36**: すべて最初の選択肢を選択（高速テスト）
4. **分析**: 自動的に開始されるのを確認
5. **結果**: 3つのOSカードが表示されることを確認

## ✅ チェックポイント

### 必須確認項目
```javascript
// ブラウザのコンソール（F12）で実行
// 1. データベース確認
console.log("H384_DATA exists:", !!window.H384_DATA);
console.log("H64_DATA exists:", !!window.H64_DATA);

// 2. 質問数確認
console.log("Questions count:", window.QUESTIONS?.length);

// 3. アナライザー確認
console.log("Analyzer ready:", !!window.criticalCSSAnalyzer);

// 4. エラーチェック
console.log("Console errors:", 
  document.querySelectorAll('.error').length === 0 ? "None" : "Found errors");
```

## 🔴 問題が発生した場合

### スタートボタンが反応しない
```javascript
// コンソールで実行して手動開始
if (!window.criticalCSSAnalyzer) {
    window.criticalCSSAnalyzer = new CriticalCSSAnalyzer();
}
window.criticalCSSAnalyzer.startAnalysis();
```

### 結果が表示されない
```javascript
// リロードして再試行
location.reload();
```

## 📱 モバイル確認

### レスポンシブテスト
1. ブラウザの開発者ツール（F12）を開く
2. デバイスモードに切り替え（Ctrl+Shift+M）
3. 以下のサイズで確認:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)

## 🎯 期待される結果

### 正常動作の場合
- ✅ 質問がスムーズに切り替わる
- ✅ 36問すべて回答できる
- ✅ 分析が5秒以内に完了
- ✅ 3つのOSカードが表示される
- ✅ エラーメッセージが出ない

### v2.0.0で修正された問題
- ✅ スタートボタンの動作問題 → 修正済み
- ✅ 変数名エラー（topTrigram） → topBaguaに修正済み
- ✅ エラー回復ボタン → 正常動作

## 📝 テスト結果記録

```markdown
テスト日時: 2025/01/12
テスター: [あなたの名前]
ブラウザ: Chrome/Safari/Firefox
デバイス: Mac/Windows/iPhone/Android

[ ] 初期画面 - OK/NG
[ ] 質問開始 - OK/NG
[ ] 36問完走 - OK/NG
[ ] 分析処理 - OK/NG
[ ] 結果表示 - OK/NG
[ ] エラーなし - OK/NG

コメント:
```

## 🆘 サポート

問題が発生した場合は、以下の情報と共に報告してください:
1. スクリーンショット
2. ブラウザのコンソールログ（F12 → Console）
3. 使用ブラウザとバージョン
4. 発生した手順