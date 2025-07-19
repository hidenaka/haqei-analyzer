# JSON統合ツール使用ガイド

## 概要
複数のJSONオブジェクトが混在するhexagram_XX.jsonファイルを、正しい1つのJSONファイルに統合するツールです。

## 使用方法

### 1. 全ファイル一括処理
```bash
cd /Users/nakanohideaki/Desktop/haqei-analyzer
python3 json_merge_tool.py
```

### 2. 特定ファイルのみ処理
```bash
cd /Users/nakanohideaki/Desktop/haqei-analyzer
python3 json_merge_tool.py 2  # hexagram_02.jsonのみ処理
```

## ツールの機能

### 🔍 自動検出
- ファイル内の複数JSONオブジェクトを自動検出
- 各セクションを安全に分離

### 🔧 自動統合
- `interface_combinations`配列を1つに統合
- `interface_id`順にソート
- JSON構文の自動修正

### 💾 安全性
- 処理前に`.backup`ファイルを自動作成
- エラー時は自動的にバックアップから復元
- 処理後にJSON構文チェック

### 📊 詳細ログ
- 処理進行状況をリアルタイム表示
- 統合した組み合わせ数を表示
- エラー箇所の詳細表示

## 出力例

```
🚀 HaQei Analyzer JSON統合ツール開始
==================================================
🔧 修正中: hexagram_02.json
💾 バックアップ作成: public/js/data/compatibility/engine-interface/hexagram_02.json.backup
🔍 4個のJSONオブジェクトを検出
✅ セクション2から 16個の組み合わせを追加
✅ セクション3から 16個の組み合わせを追加
✅ セクション4から 16個の組み合わせを追加
✅ hexagram_02.json: 統合完了 (64個の組み合わせ)
✅ hexagram_02.json: JSON構文チェック完了
------------------------------
...
==================================================
📊 処理結果:
   ✅ 成功: 64ファイル
   ❌ エラー: 0ファイル
🎉 全てのファイルの統合が完了しました！
```

## 修正される問題

### Before (問題のある状態)
```json
{
  "hexagram_id": 2,
  "internal_team_analysis": {
    "interface_combinations": [
      // 最初の16個の組み合わせ
    ]
  }
}
{
  "hexagram_id": 2,
  "internal_team_analysis": {
    "interface_combinations": [
      // 次の16個の組み合わせ
    ]
  }
}
// さらに2つのJSONオブジェクト...
```

### After (修正後)
```json
{
  "hexagram_id": 2,
  "internal_team_analysis": {
    "engine_os_name": "坤為地",
    "interface_combinations": [
      // 全64個の組み合わせが統合された配列
    ]
  }
}
```

## トラブルシューティング

### よくあるエラーと対処法

1. **JSON構文エラー**
   - `,` の不足/過多
   - `}`や`]`の不足
   - 文字列の`"`不足

2. **ファイル読み込みエラー**
   - ファイルパスの確認
   - ファイル権限の確認

3. **復元方法**
   ```bash
   # バックアップから復元
   cp public/js/data/compatibility/engine-interface/hexagram_02.json.backup \
      public/js/data/compatibility/engine-interface/hexagram_02.json
   ```

## Cursor での使用方法

1. **プロジェクトを開く**
   ```
   /Users/nakanohideaki/Desktop/haqei-analyzer
   ```

2. **ターミナルで実行**
   ```bash
   python3 json_merge_tool.py
   ```

3. **特定ファイルのテスト**
   ```bash
   python3 json_merge_tool.py 2
   ```

4. **処理結果の確認**
   - コンソールログで進行状況確認
   - 修正されたJSONファイルの動作確認

## 注意事項

- **必ずバックアップが作成されます** - 安心してご使用ください
- **処理は冪等** - 何度実行しても安全です
- **interface_id順にソート** - 組み合わせが自動的に整理されます