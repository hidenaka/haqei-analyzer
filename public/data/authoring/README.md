## 3フェーズまとめ（文章）オーサリング テンプレート一式

このフォルダは「3フェーズまとめ（文章）」を人手で執筆・管理するためのテンプレートとガイドです。UI側の実装には手を入れず、データベース（JSON/CSV）だけで差し替えできる運用を想定しています。

---

### 1. スキーマ（共通仕様）

- キー（key）: `卦名 爻 | PATTERN`（例: `地天泰 六五 | HHH`）
- フィールド:
  - `chain_long` (string): 3フェーズまとめ本文（2〜6文・自然文）。
  - `triad_p1` (string): P1（現状/原因）の短句（6〜10字目安）。
  - `triad_p2` (string): P2（変化/症状）の短句（6〜10字目安）。
  - `triad_p3` (string): P3（打開/対処）の短句（6〜10字目安）。
  - `triad_headline` (string): 1行ヘッドライン（`P1 … → P2 … → P3 …`）。
  - `suitability` (string): 適する場面（1文）。
  - `caution` (string): 注意点（1文）。
  - `tone` (string): トーンタグ（例: `story`）。
  - `start` (object): `{ hex: string, pos: number }` 起点。
  - `final` (object, optional): `{ hex: string, pos: number }` 最終（未入力でも可）。
  - `label` (string, optional): パターン名（例: 一貫深化）。
  - `updated_at` (string|null): ISO文字列。
  - `status` (string): `draft|reviewed|approved`。

> JSONスキーマは `narratives_chain.schema.json` を参照。

---

### 2. 執筆ルール（厳守）

- triad（P1/P2/P3）
  - 形式: `P1 … → P2 … → P3 …` の3句を必須（各6〜10字、名詞句推奨）。
  - 役割: P1=現状/原因、P2=変化/症状、P3=打開/対処（次アクション）。
  - 語彙: 平易語。数値や抽象語（例: 効率化）のみは避ける。

- chain_long（本文）
  - 2〜6文。接続の自然さ（「まず、」「続いて、」「最後に、」）。各文80字程度。
  - 数値・専門語・形而上表現を避け、具体的な動き/手触りで書く。
  - 結語（任意）: 1文まで。「突破口は〜」「まずは〜」の重複は禁止。

- suitability/caution（1文）
  - 実務寄りで具体的に（例: 「小さく試して徐々に広げたい場面」「事前に合意形成と影響範囲を共有」）。

- 表記統一（UI整合）
  - 期待: 「かなり高め/高め/やや高め/ふつう/控えめ/慎重」
  - 成果: 「大きめ/中程度/控えめ」
  - 負荷/リスク: 「低め/中程度/高め」

---

### 3. 検収チェック（レビュワー）

- triad_headlineに3句（P1→P2→P3）が必ずある
- chain_longが2〜6文で接続が自然
- 難語/定型句の過多がない（比喩は軽め、宗教的・形而上表現は不可）
- suitability/cautionが具体的で役に立つ
- updated_at/statusが更新されている

---

### 4. 納品・反映フロー

- 作業方式: JSON/CSVどちらでもOK（テンプレ同梱）
- 進捗管理: `status` を `draft → reviewed → approved` で更新
- 納品: 完成したJSON/CSVをまとめて提出（担当者/レビュー日時は別シートでも可）
- 反映: UI側はDB最優先で表示（実装チームが取り込み）

---

### 5. 同梱物

- `narratives_chain.authoring.template.json` … 空のテンプレ（1件の雛形）
- `narratives_chain.authoring.template.csv` … CSVテンプレ（ヘッダ＋1行例）
- `narratives_chain.authoring.sample.json` … 10件のサンプル（書式と粒度の見本）
- `narratives_chain.schema.json` … JSONスキーマ

必要に応じて、担当割テンプレ（Googleスプレッドシートの見本）も用意します。
