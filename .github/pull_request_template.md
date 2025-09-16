### Curation Summary

- Range: `hex-<start> .. hex-<end>`
- Items curated: <count>
- Style: situation-focused (headline + flow + context + risk + after)

### Checklist (Quality Gate)

- [ ] 状況説明のみ（命令・指示語なし）
- [ ] 見出しは2句（現状＋流れ）、重複・短すぎなし
- [ ] いま/すぐ/この先 の3行が揃い、各<=25字
- [ ] 注意≠着地（役割・語の重複なし）
- [ ] 空欄ゼロ／NG語ゼロ／古語→現代語
- [ ] 「卦と爻の変化」表示で根拠が確認できる（Step1/2/3）

### Validation Output

```bash
node scripts/validate-easy-consistency.mjs --out ./public/data/scenario-db-easy --limit <upperBound>
```

### Notes

- 例外や言い換え判断があれば記載（語彙の統一方針など）

