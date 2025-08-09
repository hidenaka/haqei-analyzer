# データ削除防止プロトコル実装完了
Date: 2025-08-08
Status: Completed

## 問題の背景
ユーザーからの緊急要求：
- 勝手に既存データを削除されて困る
- 「いつまで経っても完成しない」状況の原因
- データ消失によるプロジェクト進捗の停滞

## 根本原因分析
- AI が「整理」「最適化」の名目でデータを削除
- ユーザー許可なしでの「クリーンアップ」実行
- 既存データの重要性判断ミス
- データ削除に対する制御機構の不在

## 実施した厳格な対策

### 1. DATA DELETION PROTECTION PROTOCOL セクション追加
```markdown
#### 2.5. **DATA DELETION PROTECTION PROTOCOL**
**CRITICAL RULE**: 既存データの勝手な削除を絶対に禁止
```

### 2. 絶対禁止削除アクション定義
```bash
❌ NEVER DELETE WITHOUT EXPLICIT USER PERMISSION:
- rm -f existing_data.json
- rm -rf public/data/
- git rm important_files.*
- DELETE FROM database_table;
- DROP TABLE existing_table;

❌ NEVER "CLEAN UP" EXISTING DATA:
- "Removing old data files..."
- "Cleaning up deprecated JSON files..." 
- "Deleting unused database entries..."
- "Removing legacy configurations..."
```

### 3. 必須データ保護ルール（5原則）
1. **ユーザー明示指示なしでの削除禁止**
2. **データベースエントリ削除の確認必須**
3. **「整理」目的での削除禁止**
4. **データの「不要」判断禁止**
5. **削除前の必須確認**

### 4. 必須削除ワークフロー（7段階）
```markdown
BEFORE ANY DATA DELETION:
1. STOP immediately when deletion is considered
2. ASK user: "既存のデータ[filename]を削除してもよろしいですか？"
3. EXPLAIN what will be deleted and why
4. WAIT for explicit user confirmation
5. ONLY AFTER "yes" confirmation → proceed with deletion
6. CREATE backup before deletion
7. DOCUMENT deletion in .serena/memories
```

### 5. データ保護優先リスト
保護対象ファイル（削除禁止）：
```javascript
const protectedData = [
  "*.json",           // 全JSONデータファイル
  "data/*",           // データディレクトリ
  "database/*",       // データベースファイル
  "backup/*",         // バックアップファイル
  "config/*",         // 設定ファイル
  "*.db", "*.sql",    // データベース関連
  "user_data/*",      // ユーザーデータ
  "existing_*",       // 既存ファイル全般
  ".env*", "*.log"    // 環境・ログファイル
];
```

### 6. 安全な修正パターン
```javascript
// ✅ 正しい: 既存データに追加
existingData.newField = newValue;
existingArray.push(newItem);

// ❌ 禁止: 既存データの完全置換
existingData = newCompleteData; // 既存データ破壊

// ✅ 正しい: 大規模変更前の確認
if (needToReplaceAllData) {
  askUserConfirmation("既存のデータを全て置き換えますか？");
}
```

### 7. 必須確認メッセージパターン
```bash
"既存のファイル[filename]を削除してもよろしいですか？削除すると復元できません。"
"データベースのテーブル[table]を削除しますか？全データが失われます。"
"ディレクトリ[dirname]内の全ファイルを削除してもよろしいですか？"
"設定ファイル[config]を上書きしてもよろしいですか？現在の設定が失われます。"
```

### 8. ゼロトレランス違反行為
以下の行為は即座にタスク終了：
- JSONデータの無許可削除
- データベーステーブル・エントリの削除
- 既存ファイルの「整理」削除
- 確認なしでの設定上書き
- バックアップファイルの削除
- ユーザーデータの削除

## 変更ファイル
- `/Users/nakanohideaki/Desktop/haqei-analyzer/CLAUDE.md`
  - Line 30-123: DATA DELETION PROTECTION PROTOCOL 追加

## 影響範囲
- すべてのデータ操作で削除前確認が必須になる
- 既存データの意図しない消失が完全防止される
- プロジェクト進捗の継続性が保証される
- データ整合性が維持される

## 期待される効果
1. **プロジェクト完成促進**: データ消失による後戻りの防止
2. **開発効率向上**: 既存実装の保持による継続的改善
3. **信頼性向上**: データ保護による安心した開発環境
4. **進捗継続**: 削除による作業リセットの回避

## 重要な運用ルール
- **疑問があれば削除しない**
- **ユーザー確認なしでの削除は絶対禁止**
- **「整理」「最適化」を理由とした削除は禁止**
- **バックアップ作成後のみ削除実行**

## 次回参照用キーワード
- データ削除防止, 既存データ保護, 削除前確認, ゼロトレランス, プロジェクト完成阻害防止