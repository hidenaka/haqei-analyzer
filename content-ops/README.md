Trend Script Ops (AI × 古代の知恵)

目的
- Xなどのトレンド話題に対して「AIと古代の知恵で今日を分析してみた」形式の短尺台本を量産する。

概念
- Now: 話題の“いま”を中立に1行で要約（手入力）
- Tracks: こうなっていく道筋を2–3本（安定/整え直し/揺れながら組み替える/大きく組み替える）
- Data source: `public/data/scenario-db-easy/*.json` の `easy.next3/outcome` を文に変換

フォーマット（短尺 30s）
- Hook: 「AIと古代の知恵で{topic}を分析してみた」
- Now: 「いまは“{now}”」
- TrackA: 「こうなっていく① — {pathLabelA}: {next3A}。終点は『{outcomeA}』」
- TrackB: 「こうなっていく② — {pathLabelB}: {next3B}。終点は『{outcomeB}』」
- TrackC(任意): 同上
- CTA: 「あなたはどれ？保存して答え合わせ」

使い方（CLI）
1) トレンドを1行記述してから生成
```
node scripts/generate-trend-content.mjs \
  --topic "生成AIの規制議論" \
  --now   "基準作りが進み、適用範囲を探る局面" \
  --tracks 2
```
2) 出力をそのまま投稿台本にコピペ（語尾や固有名修正）

パスのラベル規則（自動付与）
- 安定に寄る: JJJ（進行が途切れにくい）
- 途中で整え直す: 1H（どこか1回の変化）
- 揺れながら組み替える: 2H（2回の変化）
- 大きく組み替わる: HHH（3回の変化）

注意
- 助言調にしない（断言/命令を避け「〜しやすい局面」）
- 免責を短く入れる（結果保証しない）
- 話題のセンシティブ度に応じて表現を緩和

