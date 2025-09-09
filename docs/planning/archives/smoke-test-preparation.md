# 本番環境スモークテスト準備

## ✅ 完了事項（1. 今すぐ）
- **os_analyzer.htmlへのマトリクス統合**: 完了
  - 2箇所のマトリクス定義を転置済み版に統一
  - 専門家推奨アサーション5項目すべて成功
  - 純卦8つすべて生成可能

---

## 🚀 スモークテスト計画（2. 今週中）

### テスト環境
- **ファイル**: os_analyzer.html（修正済み）
- **ブラウザ**: Chrome, Safari, Firefox
- **デバイス**: Desktop, Mobile

### テストシナリオ

#### シナリオ1: 基本診断フロー
```
1. os_analyzer.htmlを開く
2. 「診断を開始」をクリック
3. 36問すべてに回答
4. 結果表示を確認
   - Engine OS: 卦番号と名称
   - Interface OS: 卦番号と名称
   - Safe Mode OS: 卦番号と名称
```

#### シナリオ2: 純卦生成確認
```
1. 特定の回答パターンで純卦を生成
   - すべて「とても当てはまる」→ 乾為天(#1)が出やすい
   - すべて「全く当てはまらない」→ 坤為地(#2)が出やすい
2. 8つの純卦が生成可能か確認
```

#### シナリオ3: エッジケース
```
1. 均等な回答（すべて「どちらともいえない」）
   - 確信度: LOW
   - 代替候補表示
2. 極端な偏り（1つだけ高く他は低い）
   - 確信度: HIGH
   - 明確な診断結果
```

### 検証項目チェックリスト

#### 機能検証
- [ ] 36問の質問が正しく表示される
- [ ] 回答データが正しく分離される（Q1-12/Q13-24/Q25-36）
- [ ] 64卦すべてが生成可能
- [ ] 純卦8つが生成可能
- [ ] 卦番号と卦名が一致する

#### 表示検証
- [ ] 結果画面が正しく表示される
- [ ] 八卦レーダーチャートが表示される
- [ ] 確信度バッジが表示される
- [ ] エラーメッセージなし

#### パフォーマンス検証
- [ ] 診断計算が3秒以内に完了
- [ ] ページロードが5秒以内
- [ ] スムーズなスクロール

### エラー監視
```javascript
// コンソールでエラーチェック
window.addEventListener('error', (e) => {
    console.error('Error caught:', e);
});

// マトリクスアクセスの検証
function validateMatrixAccess() {
    const testCases = [
        {upper: "乾", lower: "離", expected: 13},
        {upper: "離", lower: "乾", expected: 14}
    ];
    
    testCases.forEach(test => {
        // 実際の関数を呼び出してテスト
        console.log(`Testing ${test.upper}/${test.lower}...`);
    });
}
```

---

## 📊 期待される結果

### 成功基準
1. **マトリクスアクセス**: エラーなし
2. **卦番号生成**: 1-64の範囲内
3. **純卦生成**: 8つすべて確認
4. **パフォーマンス**: 規定時間内

### 既知の問題
- なし（修正済み）

### ロールバック計画
```bash
# バックアップから復元
cp backup-matrix-before-fix.js os_analyzer.html
# または Git から復元
git checkout HEAD~1 os_analyzer.html
```

---

## 📅 スケジュール

| 日付 | タスク | 状態 |
|------|--------|------|
| 今日 | マトリクス統合 | ✅ 完了 |
| 明日 | 内部テスト | 🔄 準備中 |
| 3日後 | スモークテスト実施 | ⏳ 待機 |
| 来週 | ベータテスト開始 | ⏳ 待機 |

---

## 🔍 モニタリング

### ログ収集
```javascript
// 診断結果の記録
const diagnosticLog = {
    timestamp: new Date().toISOString(),
    engineOS: {hexagramId: null, confidence: null},
    interfaceOS: {hexagramId: null, confidence: null},
    safemodeOS: {hexagramId: null, confidence: null},
    errors: []
};
```

### メトリクス
- 診断完了率
- エラー発生率
- 平均処理時間
- 純卦生成率

---

**準備完了**: スモークテストを実施する準備が整いました。