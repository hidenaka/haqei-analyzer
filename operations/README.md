# h384-line-states 現代語化・運用メモ

## 役割
- 編集者A: 第一次案（全行対応）
- レビュアーB: 二次レビュー（意味逸脱/トーン/冗長/読みやすさ）
- ファシリティ: 作業ボード管理・用語集更新・衝突解消

## ファイル
- `public/data/h384-line-states.json`: 本番データ（キー/構造は不変更）
- `backup/h384-line-states.YYYYMMDD.backup.json`: 読み取り専用バックアップ
- `operations/line-states-progress.csv`: 進捗台帳（Key/Before/After/Status/Notes/Tag/Assignee）
- `docs/line-states-modernization-style.md`: スタイルガイド
- `docs/standard-expressions.md`: 標準表現

## ツール
- 進捗CSV生成: `node scripts/line-states-tools/generate-progress.cjs`
- 自動検証: `node scripts/line-states-tools/validate.cjs`

## ステータス定義
- 未着手 / 一次済 / レビュー中 / 修正中 / 完了

## タグ例
- 慎重 / 改革 / 基盤 / 協力 / 注意 / 要レビュー

## 運用フロー（20〜30キー/PR 推奨）
1. 進捗CSVで対象キーを担当者アサイン
2. 編集者Aが一次案をCSVのAfter欄に記入、Tag/Notesも更新
3. レビュアーBが3観点（状況/評価/指針）で確認・修正
4. `validate.cjs` を通過（禁止表現0・1行1文・長さチェック）
5. JSONへ反映（小分割コミット）→ 差分レビュー → マージ

## 反映時の注意
- キー/順序は厳密に保持すること
- 1行1文（文末「。」、長さ60–110字目安）
- 比喩は意味に直す、価値語は中立化

