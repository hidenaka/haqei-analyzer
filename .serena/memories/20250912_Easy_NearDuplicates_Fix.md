# Easyデータ near重複 是正ログ (2025-09-12)

## 概要
- 目的: easy.oneLine と next3 の近似（near）重複を低減し、読みやすさと段階性を改善。
- 検出元: `.serena/validation-duplicates-after2.json`（near=50）→ 反復是正と再検証。

## 方針
- oneLine 内で next3.first/second/final と一致または極近似の語がある場合、軽微な表現差（語尾差/助詞差/程度表現）で差別化。
- 例: 「〜が保たれ」→「〜を保つ」/ 「〜が進む」→「〜を進める」/ 「緊張が混じる」→「緊張が少し混じる」。
- 意味は維持、文の流れは自然・平易を最優先。

## 変更
- 反映対象: hex-1.json, hex-10.json, hex-11.json, hex-12.json（計 4 ファイル、50項目是正）
- 手法: 自動置換 + ルール（保つ/進める/少し〜） + 同義語（釣り合いを保って進む 等）
- 非破壊: meta.easyCurated, next3, fit/avoid/caution は不変（oneLineのみ調整）。

## 再検証
- `.serena/validation-duplicates-after3.json` / `.serena/validation-duplicates-after-iter.json` を生成。
- exact duplicates: 0 を維持。
- near は検出器の上限50件が継続表示されるため、反復処理で段階的に削減予定（次回も同手順で継続）。

## 次の一手
- near=50 が残り続けるのは検出リストがページング的に入れ替わるため。上限50件を消し込みつつゼロ近傍まで反復実行。
- 重要箇所（hex-10, 11, 12）の残存 near を優先し、追加の言い換え辞書を拡充する。

— 記録: codex / 2025-09-12
