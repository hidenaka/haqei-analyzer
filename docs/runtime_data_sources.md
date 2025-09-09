# 384爻システム ランタイムデータソース仕様書

## 全体原則

- 優先順位は常に「D1 API → ローカルJSON → 生成フォールバック」。この順序で解決し、見つからない場合のみ次に降格。
- 内部オブジェクトのキーは統一（snake_case）。bridge内部で参照するキー名を変えないこと。
- 統計・監視・辞書などの補助データも同様に「固定の取得先」を使うこと。

## コンポーネント別のデータ指定

### テキスト→爻マッピング

- **実装**: `public/js/ai/TextTo384LinesBridge.js`
- **参照モジュール**: `public/js/services/384DataService.js`
- **使用データ**:
  - 優先1: D1 API `functions/api/384-lines.js` エンドポイント `GET /api/384-lines?type=all`
  - 優先2: ローカルJSON `public/data/koudo_shishin.json`（386件）
  - 優先3: 生成フォールバック（bridge内の `buildComplete384LineDatabase()`）

- **内部キー（必須）**:
  - `id`（1–384、特別行: 385/386）
  - `hexagram_id`（1–64）
  - `hexagram_name`（例: '地天泰'）
  - `position`（1–6、特別行は7だが統計から除外）
  - `line_name`（例: '六五'相当など）
  - `description`（テキスト）
  - `advice`（テキスト）
  - `yaoci_text`（爻辞）
  - `keywords`（配列；足りなければ `TextTo384LinesBridge.extractKeywords` で補完）
  - `semantic_vectors`（Float32Array 656；無い場合 `generateSemanticVectors()` で生成）
  - `dbSource`（'D1' | 'JSON' | 'Generated'）

### 384爻/64卦/爻辞の取得（DataService384）

- **実装**: `public/js/services/384DataService.js`
- **取得元**:
  - **lines**:
    - 優先1: `/api/384-lines?type=koudo`
    - 優先2: `public/data/koudo_shishin.json`
    - 優先3: bridgeの生成フォールバック
  - **hexagrams**:
    - 優先1: `/api/384-lines?type=hexagrams`
    - 優先2: `public/data/hexagrams.json`
    - 優先3: bridge内定義名
  - **yaoci（爻辞）**:
    - 優先1: `/api/384-lines?type=yaoci`
    - 優先2: なし（空配列を許容）

- **キャッシュ**:
  - L1: メモリ（有効）
  - L2: LocalStorage（有効）
  - L3: API（D1/Cloudflare）
  - L4: JSON（フォールバック）

- **タイムアウト**: 5s（AbortSignal.timeout(5000)）

### D1 API（Cloudflare Functions）

- **実装**: `functions/api/384-lines.js`
- **バインド**: wrangler.toml の [[d1_databases]]（binding=DB）
- **レスポンス構造（type=all の例）**:
  - `data.lines`（koudo_shishin相当の行配列）
  - `data.hexagrams`（64卦配列）
  - `data.yaoci`（爻辞配列）
- **備考**: Cloudflare Cache APIで応答をキャッシュ（max-age 1h）

### 形態素解析（Kuromoji＋フォールバック）

- **標準**: CDNからの辞書読込
  - `https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/`
- **実装**:
  - フォールバック初期化: `public/js/core/OfflineKuromojiInitializer.js`
  - 解析器（補助）: `public/js/core/MorphologicalAnalyzer.js`（CDNパス統一・fallback時はOfflineKuromojiInitializer経由）
- **表示（HUD）**: 解析モード（kuromoji/fallback/basic）をHUDパネルに表示

### 統計的偏り検知（χ²/連続偏り/最大使用率）

- **実装**: `public/js/core/StatisticalBiasDetector.js`
- **記録タイミング**: TextTo384LinesBridge.analyzeTextToSpecificLine の選出完了後に
  - `window.biasDetector.addSelection(lineId, hexagramId, position)`
- **検出**:
  - 100件ごとに `detectBias()` を呼び出し、コンソール＋HUDでアラート可視化
- **前提**:
  - special行（385/386）はχ²から除外（position 1–6のみ集計）
  - `lineId===385/386` で特別行検出（'用九'/'用六'文字比較は不可）
  - historyが閾値未満（例: <30）の場合はχ²判定スキップ

### メトリクスHUD（p50/p95/p99）

- **実装（UI）**: `public/future_simulator.html` 内の #metrics-panel
- **更新場所**: TextTo384LinesBridge.analyzeTextToSpecificLine 前後で計測し、以下を更新
  - `P50 / P95 / P99 / 平均`
  - 実行回数
  - キャッシュヒット率（bridge側のcacheヒット可視化）
  - データソース（'D1' | 'JSON' | 'Generated'）
  - 解析モード（kuromoji/fallback/basic）
  - 決定論チェック率（同一入力連続実行時の一致率）

### 特殊行（用九/用六）の適用条件

- **実装**: checkSpecialLines() in TextTo384LinesBridge.js
- **条件**:
  - 明示キーワード（yang/yinセット）AND 感情強度≥0.7
  - 選択率キャップ: 385/386 各≤1%（セッション中）
  - 連続選出抑止: 前回がspecialなら次は避ける
- **統計**: special行はχ²から除外（位置分布は1–6のみに限定）

## 明示の優先順位（擬似コード）

### 384行（lines）
```javascript
try {
  const response = await fetch('/api/384-lines?type=koudo');
  if (response.ok) return response.data.lines;
} catch (error) {
  // フォールバック
}
try {
  return await loadJSON('public/data/koudo_shishin.json');
} catch (error) {
  // 最終フォールバック
}
return buildComplete384LineDatabase();
```

### 64卦（hexagrams）
```javascript
try {
  const response = await fetch('/api/384-lines?type=hexagrams');
  if (response.ok) return response.data.hexagrams;
} catch (error) {
  // フォールバック
}
try {
  return await loadJSON('public/data/hexagrams.json');
} catch (error) {
  // 最終フォールバック
}
return deriveFromBridgeDefinition();
```

### 爻辞（yaoci）
```javascript
try {
  const response = await fetch('/api/384-lines?type=yaoci');
  if (response.ok) return response.data.yaoci;
} catch (error) {
  // フォールバック
}
return []; // 必須ではない
```

### 形態素解析
```javascript
if (kuromojiTokenizer.isReady()) {
  return { mode: 'kuromoji', tokenizer: kuromojiTokenizer };
} else if (offlineKuromojiInitializer.isReady()) {
  return { mode: 'fallback', tokenizer: offlineKuromojiInitializer };
} else {
  return { mode: 'basic', tokenizer: basicTokenizer };
}
```

## 「使ってはいけない/デバッグ専用」データ

### 本番系で避けるべきファイル

- `public/assets/H384H64database.js`（legacy/検証用）
  - 本番系のlinesはkoudo_shishin系列を採用。assetsのH384は最終フォールバックとしても原則使わない
- `data/sources/databasemake/` 配下（生成用ソース）
  - 移行/整合検証以外では参照しない（Webランタイムからは使わない）
- `archive/` / `backup/` / `test-archive/` / `archive/test-files-*/`
  - すべて参考資料・実験・記録。ランタイムで参照させない

## 鍵となるファイルパス

### ランタイム/ページ
- `public/future_simulator.html`

### ブリッジ/スコアリング
- `public/js/ai/TextTo384LinesBridge.js`

### データ取得サービス
- `public/js/services/384DataService.js`

### D1 API
- `functions/api/384-lines.js`（Cloudflare Pages Functions）

### バイアス検知
- `public/js/core/StatisticalBiasDetector.js`

### パフォーマンス監視（HUD）
- `public/future_simulator.html` の #metrics-panel

### 形態素解析（CDN+フォールバック）
- `public/js/core/OfflineKuromojiInitializer.js`
- `public/js/core/MorphologicalAnalyzer.js`

## 内部キー・スキーマ（再掲）

### line object（Bridge内部の標準）
```javascript
{
  id: number,                    // 1-384, 特別行: 385/386
  hexagram_id: number,           // 1-64
  hexagram_name: string,         // 例: '地天泰'
  position: 1|2|3|4|5|6,        // specialは7だが統計集計から除外
  line_name: string,             // 例: '六五'相当など
  description: string,           // テキスト
  advice: string,                // テキスト
  yaoci_text: string,            // 爻辞
  keywords: string[],            // 配列
  semantic_vectors: Float32Array, // 656次元
  dbSource: 'D1' | 'JSON' | 'Generated'
}
```

## SLO/DoD確認のチェック（現場用）

### データ系
- [ ] GET /api/384-lines?type=all が200/JSONで返る（本番）
- [ ] public/data/koudo_shishin.json が386件で読み込める（MVP）

### 形態素解析
- [ ] HUDに解析モード（kuromoji/fallback/basic）が表示される

### マッピング実行
- [ ] HUDの p50/p95/p99/平均が更新され、p95<45msを維持

### 決定論性
- [ ] 同一入力×10回で一致率100%（HUDの決定論チェック率が100%）

### 偏り検知
- [ ] 100件流し後にχ²/p値が算出され、逸脱でアラート（position 1–6のみ集計）

### 特殊行
- [ ] 385/386の選択率が各≤1%を超えない（HUDやログで確認）

---

**重要**: この指示書のとおりに、各モジュールが「どのデータを」「どの順に」取りに行くかを固定してください。特に、Bridge内部に渡すlineオブジェクトのキー名（snake_case）と、データ優先順位（D1→JSON→生成）を厳守すると迷子になりません。

**作成日**: 2025年1月28日  
**更新日**: 2025年1月28日  
**バージョン**: 1.0.0