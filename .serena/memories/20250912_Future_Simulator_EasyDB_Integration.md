# Future Simulator EasyDB Integration Log (2025-09-12)

## 概要
- 目的: Future Simulator（8分岐表示）に、平易化・状況化済みデータベース（scenario-db-easy）を統合し、各分岐カードへ“一行要約/Next3/合う場面/合わない場面/注意点”を表示する。
- 対象UI: `public/js/components/EightBranchesDisplay.js`
- データ: `public/data/scenario-db-easy/hex-1..64.json`（3072 items, 全面正規化済み: by='manual-plainja' / style='situation-v2' / verified=true）

## 変更点
1) ローダー新規追加
- `public/js/scenario-easy-loader.js`
- 機能:
  - `loadHex(hex)`: `./data/scenario-db-easy/hex-${hex}.json` をfetchしキャッシュ
  - `buildKey(hex,line,series/pattern)`: `${hex}_${line}_${sig}`（sig=JJJ/JJH/...）を生成
  - `getEasyIfReady(...)` / `getEasy(...)`: キーで `easy` ブロックを取得
  - グローバル: `window.easyScenarioLoader`

2) EightBranchesDisplay に easy 統合
- `EightBranchesDisplay._card(...)` 内で、分岐 `branch` から以下を抽出:
  - 開始 `hex = steps[0].hex`、`line = steps[0].line`、`series`（例: "進→変→進"）
  - sig を派生（進=J/変=H）→ `${hex}_${line}_${sig}` キー構築
- 表示: 要約 `summary` を easy.oneLine に差替え、`next3`（いま/すぐ/この先）、`fit/avoid`、`caution` を“やさしい指針”としてカード内に表示（非同期取得も考慮）
- 既存表示はフォールバックとして維持（データ未取得時）

3) HTML読込
- `public/future_simulator.html` にローダースクリプトを追加し、`EightBranchesDisplay` より前に読み込み

## 実装上の注意
- 非同期取得: 最初はフォールバック文言、取得完了後にeasyブロックを描画
- キー整合: `line` は 1..6、`series` は '進→変→進' 形式 → sig 'JHJ'
- 表現統一: `fit/avoid` の接頭辞（合う場面/合わない場面）は正規化済み。UIではラベルを付け直し

## 確認項目
- 64_系: 例 `hex=64, line=1, series=進→進→進` → key `64_1_JJJ` の oneLine/next3 等がカードに反映
- 非同期: 画面初期化 → 少し遅れて“やさしい指針”ブロックが差し込まれること
- 既存機能: H384ベースのスコア・キーワード・段階表示は従来通り

## 既知の非破壊
- JSON構造や既存H384表示は変更なし
- near類似のnext3は温存（exact重複は前段で解消済み）

## 次の改善余地
- 詳細モーダルにも easy 情報を再掲
- 8分岐のランキング説明文に easy.next3 を短縮反映

— 記録: codex / 2025-09-12
