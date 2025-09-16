# line-states-tools

現代語化の運用を支援するスクリプト集です。

- `generate-progress.cjs`: 進捗CSVを生成（`operations/line-states-progress.csv`）。
- `validate.cjs`: `public/data/h384-line-states.json` の自動検証（JSON整合性・1行1文・文字数・禁止表現）。

実行例:

```bash
node scripts/line-states-tools/generate-progress.cjs
node scripts/line-states-tools/validate.cjs
```

