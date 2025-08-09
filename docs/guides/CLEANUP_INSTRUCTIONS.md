# 📁 作業ファイル クリーンアップ ガイド

## 概要
JSON統合処理完了後に、作業用として作成したファイルを安全に削除するためのツールです。

## 🎯 削除対象ファイル

### 📜 作業用スクリプト
- `json_merge_tool.py` - JSON統合メインツール
- `quick_json_fix.py` - 簡易JSON修正ツール
- `cleanup_extra_chars.py` - 余分文字除去ツール
- `cleanup_work_files.py` - このクリーンアップツール自身

### 📚 作業用ドキュメント
- `README_JSON_MERGE.md` - JSON統合ツール使用ガイド

### 💾 バックアップファイル
- `*.backup` - 統合前のバックアップ
- `*.cleanup_backup` - クリーンアップ前のバックアップ
- `*.quickfix_backup` - 修正前のバックアップ

## 🚀 使用方法

### 1. プレビュー（削除予定ファイル確認）
```bash
python3 cleanup_work_files.py --preview
```

### 2. 通常のクリーンアップ（安全確認付き）
```bash
python3 cleanup_work_files.py
```

### 3. 強制クリーンアップ（確認なし）
```bash
python3 cleanup_work_files.py --force
```

## 🔒 安全機能

### 重要ファイル保護
クリーンアップ前に以下の重要ファイルの存在を確認：
- `hexagram_01.json`
- `CompatibilityDataLoader.js`  
- `AdvancedCompatibilityEngine.js`

### 削除前確認
- 削除対象ファイルの一覧表示
- ユーザー確認プロンプト
- カテゴリ別の整理表示

## 📊 出力例

```
🗑️  削除予定ファイル一覧:
==================================================

📜 作業用スクリプト:
   - cleanup_extra_chars.py
   - json_merge_tool.py
   - quick_json_fix.py
   - cleanup_work_files.py

📚 作業用ドキュメント:
   - README_JSON_MERGE.md

💾 バックアップファイル:
   - public/js/data/compatibility/engine-interface/hexagram_02.json.backup
   - public/js/data/compatibility/engine-interface/hexagram_03.json.backup
   - public/js/data/compatibility/engine-interface/hexagram_02.json.cleanup_backup
   - public/js/data/compatibility/engine-interface/hexagram_03.json.cleanup_backup

==================================================
合計: 8個のファイル

🔍 重要ファイルの存在確認中...
✅ 重要ファイルはすべて存在します。

❓ 本当に削除しますか? (y/N): y

🧹 クリーンアップを実行中...
✅ 削除: cleanup_extra_chars.py
✅ 削除: json_merge_tool.py
✅ 削除: quick_json_fix.py
✅ 削除: README_JSON_MERGE.md
✅ 削除: public/js/data/compatibility/engine-interface/hexagram_02.json.backup
✅ 削除: public/js/data/compatibility/engine-interface/hexagram_03.json.backup
✅ 削除: public/js/data/compatibility/engine-interface/hexagram_02.json.cleanup_backup
✅ 削除: public/js/data/compatibility/engine-interface/hexagram_03.json.cleanup_backup
✅ 削除: cleanup_work_files.py

==================================================
📊 クリーンアップ結果:
   ✅ 削除成功: 9個
   ❌ 削除失敗: 0個
🎉 クリーンアップが正常に完了しました!
```

## ⚠️ 注意事項

### 保護されるファイル
以下のファイルは削除**されません**：
- 元の `hexagram_XX.json` ファイル（統合後の正常版）
- システムの核となる `.js` ファイル
- `CLEANUP_INSTRUCTIONS.md`（この説明書）

### 実行タイミング
- 全64卦のJSON統合処理が完了してから実行
- システムの動作確認が済んでから実行
- 必要に応じてバックアップを別途保存してから実行

## 🔄 取り消し不可
一度削除されたファイルは復元できません。心配な場合は：
1. まず `--preview` でファイル一覧を確認
2. 重要なファイルは手動で別の場所にバックアップ
3. 段階的にクリーンアップを実行

## 📞 トラブルシューティング

### ファイルが削除できない場合
- ファイルが他のプロセスで使用中
- ファイル権限の問題
- ファイルパスの問題

この場合は手動で削除するか、システム再起動後に再実行してください。