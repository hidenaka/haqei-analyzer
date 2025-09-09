# 🏗️ 384爻システム Edge制約対応システム設計書

**文書番号**: SD-384-EC-001  
**バージョン**: 1.0（Edge制約対応版）  
**作成日**: 2025年8月28日  
**作成者**: HAQEI開発チーム  
**承認者**: [未承認]

---

## 1. システムアーキテクチャ

### 1.1 学習/推論分離アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│              384爻 Edge制約対応システム                        │
├─────────────────────────────────────────────────────────────┤
│                    ユーザー層                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ブラウザUI     │ │Service       │ │IndexedDB     │     │
│  │(React/Vue)    │ │Worker        │ │ローカルCache │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│              Edge推論層（Cloudflare）                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │       軽量推論エンジン（45ms以内処理）                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │    │
│  │  │正規表現   │ │圧縮辞書  │ │軽量      │         │    │
│  │  │形態素解析 │ │類義語    │ │ベクトル  │         │    │
│  │  │(5ms)     │ │(3ms)     │ │(10ms)    │         │    │
│  │  └──────────┘ └──────────┘ └──────────┘         │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │    高速スコアリング（事前計算済み）           │ │    │
│  │  │  ・ルックアップテーブル（2ms）              │ │    │
│  │  │  ・キャッシュヒット率85%以上                │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│            Cloudflare Storage層（制限内）                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │D1 DB     │ │Workers KV│ │R2 Storage│ │Cache API │  │
│  │45MB×2    │ │10MB      │ │モデル    │ │結果Cache │  │
│  │384爻基本 │ │頻出Cache │ │5MB圧縮   │ │1MB       │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────────┤
│         バックエンド学習層（別インフラ）                      │
│  ┌────────────────────────────────────────────────────┐    │
│  │  GPU/TPUサーバー（AWS SageMaker / GCP ML Engine）   │    │
│  │  ・日次バッチ学習（深夜2-4時）                      │    │
│  │  ・フルサイズモデル訓練                             │    │
│  │  ・モデル圧縮・量子化                               │    │
│  │  ・CDN経由でEdgeへ配信                              │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 制約対応設計原則

```yaml
設計原則:
  Edge優先:
    - 推論処理のみEdge実行
    - 学習はバックエンド分離
    - キャッシュファースト
    
  軽量化:
    - モデル圧縮（5MB以下）
    - 辞書圧縮（1MB以下）
    - ベクトル次元削減（300→50次元）
    
  分割配信:
    - データ分割格納
    - 遅延ロード
    - CDN活用
    
  フォールバック:
    - 3段階のグレースフルデグレード
    - オフライン対応
    - 簡易スコアリング
```

---

## 2. データ設計（Edge最適化）

### 2.1 D1 Database設計（分割構成）

```sql
-- DB1: 基本データ (25MB)
CREATE TABLE lines_384_core (
    line_id INTEGER PRIMARY KEY,           -- 1-384
    hexagram_id INTEGER NOT NULL,          -- 1-64
    line_position INTEGER NOT NULL,        -- 1-6
    hexagram_name TEXT NOT NULL,
    
    -- コンパクトデータ
    shin_data TEXT,                        -- 圧縮済み
    hen_data TEXT,                         -- 圧縮済み
    keywords TEXT,                         -- JSON配列
    
    -- インデックス
    INDEX idx_hexagram (hexagram_id),
    INDEX idx_keywords (keywords)
);

-- DB2: 拡張データ (20MB)
CREATE TABLE lines_384_extended (
    line_id INTEGER PRIMARY KEY,
    summary TEXT,                          -- 要約版爻辞
    traits TEXT,                           -- 簡略化特性
    vector_50d BLOB                       -- 圧縮ベクトル
);

-- フィードバック収集（非同期）
CREATE TABLE feedback_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    input_hash TEXT,
    predicted_line INTEGER,
    timestamp INTEGER,
    synced INTEGER DEFAULT 0
);
```

### 2.2 Workers KV設計（高速キャッシュ）

```javascript
// キャッシュ構造（10MB制限内）
const KV_STRUCTURE = {
    // 頻出パターンキャッシュ（5MB）
    "cache:pattern:{hash}": {
        result: { line_id: 1, confidence: 0.92 },
        ttl: 86400  // 24時間
    },
    
    // 圧縮辞書（3MB）
    "dict:synonyms": {
        "リーダー": ["指導者", "統率者"],
        "変化": ["変動", "推移", "変容"],
        // ... 頻出1000語のみ
    },
    
    // 軽量ベクトル（2MB）
    "vectors:compressed": {
        version: "v1.0",
        dimensions: 50,
        data: "base64_encoded_binary"
    }
};
```

### 2.3 R2 Storage（モデル配信）

```yaml
モデル構成:
  inference_model_v1.wasm:
    - WebAssembly推論エンジン（2MB）
    - SIMD最適化済み
    
  vectors_384_50d.bin:
    - 384爻の50次元ベクトル（2MB）
    - Float16量子化
    
  lookup_tables.json:
    - 事前計算スコアテーブル（1MB）
    - gzip圧縮
```

---

## 3. 軽量NLP実装

### 3.1 正規表現ベース形態素解析

```javascript
class LightweightMorphemeAnalyzer {
    constructor() {
        // 易経専門パターン優先
        this.patterns = [
            { regex: /乾為天|坤為地|水雷屯/g, type: 'hexagram' },
            { regex: /初九|九二|九三|九四|九五|上九/g, type: 'line' },
            { regex: /陽爻|陰爻|変爻/g, type: 'yao' },
            { regex: /[一-龥]+/g, type: 'kanji' },
            { regex: /[ぁ-ん]+/g, type: 'hiragana' },
            { regex: /[ァ-ヶ]+/g, type: 'katakana' }
        ];
        
        // 頻出5000語辞書（圧縮形式）
        this.dictionary = new CompressedDictionary();
    }
    
    async analyze(text, timeLimit = 10) {
        const startTime = performance.now();
        const tokens = [];
        
        // 専門用語優先マッチング
        for (const pattern of this.patterns) {
            if (performance.now() - startTime > timeLimit) break;
            
            const matches = text.matchAll(pattern.regex);
            for (const match of matches) {
                tokens.push({
                    surface: match[0],
                    type: pattern.type,
                    position: match.index
                });
            }
        }
        
        // 重複除去と位置ソート
        return this.deduplicateTokens(tokens);
    }
}
```

### 3.2 圧縮類義語処理

```javascript
class CompressedSynonymProcessor {
    constructor() {
        this.synonymMap = null;
        this.loadPromise = this.loadSynonyms();
    }
    
    async loadSynonyms() {
        // Workers KVから圧縮辞書取得
        const compressed = await env.KV.get('dict:synonyms', 'arrayBuffer');
        this.synonymMap = await this.decompress(compressed);
    }
    
    async expand(keyword, maxSynonyms = 5) {
        await this.loadPromise;
        
        // 直接マップ検索（O(1)）
        const synonyms = this.synonymMap[keyword] || [];
        
        // 編集距離による追加候補（軽量）
        if (synonyms.length < maxSynonyms) {
            const similar = this.findSimilarWords(keyword, maxSynonyms - synonyms.length);
            synonyms.push(...similar);
        }
        
        return synonyms.slice(0, maxSynonyms);
    }
    
    findSimilarWords(word, limit) {
        // Levenshtein距離の簡易実装
        const candidates = [];
        const maxDistance = Math.min(2, word.length / 3);
        
        for (const [key, _] of Object.entries(this.synonymMap)) {
            if (this.editDistance(word, key) <= maxDistance) {
                candidates.push(key);
                if (candidates.length >= limit) break;
            }
        }
        
        return candidates;
    }
}
```

### 3.3 軽量ベクトル処理

```javascript
class LightweightVectorProcessor {
    constructor() {
        this.vectors = null;
        this.dimensions = 50;  // 圧縮済み次元
    }
    
    async initialize() {
        // R2から圧縮ベクトル取得
        const response = await fetch('/models/vectors_384_50d.bin');
        const buffer = await response.arrayBuffer();
        
        // Float16 → Float32変換
        this.vectors = new Float32Array(384 * this.dimensions);
        const view = new DataView(buffer);
        
        for (let i = 0; i < this.vectors.length; i++) {
            this.vectors[i] = this.float16ToFloat32(view.getUint16(i * 2, true));
        }
    }
    
    async findSimilar(inputVector, topK = 10) {
        const similarities = new Float32Array(384);
        
        // SIMD最適化内積計算
        for (let i = 0; i < 384; i++) {
            const offset = i * this.dimensions;
            similarities[i] = this.simdDotProduct(
                inputVector,
                this.vectors.subarray(offset, offset + this.dimensions)
            );
        }
        
        // Top-K選択（ヒープ使用）
        return this.selectTopK(similarities, topK);
    }
    
    simdDotProduct(a, b) {
        // WebAssembly SIMD活用
        if (typeof WebAssembly.SIMD !== 'undefined') {
            return wasmSIMD.dotProduct(a, b);
        }
        
        // フォールバック実装
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += a[i] * b[i];
        }
        return sum;
    }
}
```

---

## 4. スコアリングエンジン（Edge最適化）

### 4.1 高速複合スコアリング

```javascript
class EdgeOptimizedScorer {
    constructor() {
        this.weights = {
            keyword_match: 0.35,    // キーワード一致
            synonym_match: 0.25,    // 類義語一致
            vector_similarity: 0.25, // ベクトル類似度
            pattern_cache: 0.15    // パターンキャッシュ
        };
        
        this.cache = new Map();
        this.maxCacheSize = 10000;
    }
    
    async score(input) {
        const startTime = performance.now();
        
        // 1. キャッシュ確認（1ms）
        const cacheKey = this.hashInput(input);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // 2. 並列処理で各スコア計算
        const [keywords, synonyms, vector] = await Promise.all([
            this.extractKeywords(input),      // 5ms
            this.expandSynonyms(input),       // 3ms
            this.computeVector(input)          // 10ms
        ]);
        
        // 3. 事前計算テーブル参照（2ms）
        const scores = await this.lookupScores(keywords, synonyms, vector);
        
        // 4. 最終スコア計算（1ms）
        const result = this.combineScores(scores);
        
        // 5. キャッシュ保存
        this.updateCache(cacheKey, result);
        
        // 処理時間確認
        const elapsed = performance.now() - startTime;
        if (elapsed > 45) {
            console.warn(`Scoring took ${elapsed}ms - optimization needed`);
        }
        
        return result;
    }
    
    async lookupScores(keywords, synonyms, vector) {
        // 事前計算済みスコアテーブル参照
        const lookupTable = await this.getLookupTable();
        const scores = new Float32Array(384);
        
        for (let i = 0; i < 384; i++) {
            // キーワードスコア（ハッシュテーブル）
            const kwScore = this.keywordScore(keywords, lookupTable.keywords[i]);
            
            // 類義語スコア（ビットマップ）
            const synScore = this.synonymScore(synonyms, lookupTable.synonyms[i]);
            
            // ベクトルスコア（事前計算済み）
            const vecScore = lookupTable.vectors[i];
            
            scores[i] = kwScore * this.weights.keyword_match +
                       synScore * this.weights.synonym_match +
                       vecScore * this.weights.vector_similarity;
        }
        
        return scores;
    }
}
```

### 4.2 フォールバック戦略

```javascript
class FallbackStrategy {
    async executeWithFallback(input) {
        try {
            // レベル1: フル機能（30ms目標）
            return await this.fullScoring(input);
        } catch (error) {
            console.warn('Falling back to simplified scoring:', error);
            
            try {
                // レベル2: 簡易スコアリング（10ms）
                return await this.simplifiedScoring(input);
            } catch (error2) {
                console.warn('Falling back to rule-based:', error2);
                
                // レベル3: ルールベース（5ms）
                return this.ruleBasedScoring(input);
            }
        }
    }
    
    async simplifiedScoring(input) {
        // キーワードマッチのみ
        const keywords = this.extractBasicKeywords(input);
        return this.matchKeywords(keywords);
    }
    
    ruleBasedScoring(input) {
        // 固定ルール
        if (input.includes('リーダー')) return { line_id: 1, confidence: 0.7 };
        if (input.includes('始まり')) return { line_id: 1, confidence: 0.6 };
        // ... その他のルール
        return { line_id: 1, confidence: 0.5 }; // デフォルト
    }
}
```

---

## 5. バックエンド学習システム

### 5.1 学習パイプライン（オフライン）

```python
# backend/training_pipeline.py
class OfflineTrainingPipeline:
    def __init__(self):
        self.model = None
        self.training_data = []
        self.validation_data = []
    
    async def daily_batch_training(self):
        """日次バッチ学習（深夜2-4時実行）"""
        
        # 1. Edgeからフィードバック収集
        feedbacks = await self.collect_feedbacks_from_edge()
        
        # 2. データ準備
        self.prepare_training_data(feedbacks)
        
        # 3. フルモデル訓練
        full_model = await self.train_full_model(
            epochs=100,
            batch_size=32,
            learning_rate=0.001
        )
        
        # 4. モデル圧縮
        compressed_model = await self.compress_model(
            full_model,
            target_size_mb=5,
            quantization='int8'
        )
        
        # 5. 検証
        metrics = await self.validate_model(compressed_model)
        
        # 6. デプロイ判定
        if metrics['accuracy'] > 0.85:
            await self.deploy_to_edge(compressed_model)
    
    async def compress_model(self, model, target_size_mb, quantization):
        """モデル圧縮処理"""
        compressed = model
        
        # 量子化
        if quantization == 'int8':
            compressed = self.quantize_to_int8(compressed)
        
        # プルーニング（枝刈り）
        compressed = self.prune_weights(compressed, sparsity=0.5)
        
        # 知識蒸留
        compressed = self.knowledge_distillation(
            teacher=model,
            student=compressed
        )
        
        # WebAssembly変換
        wasm_model = self.convert_to_wasm(compressed)
        
        return wasm_model
    
    async def deploy_to_edge(self, model):
        """CDN経由でEdgeへデプロイ"""
        
        # バージョニング
        version = f"v{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # R2へアップロード
        await self.upload_to_r2(model, version)
        
        # Workers KVメタデータ更新
        await self.update_kv_metadata(version)
        
        # カナリアデプロイ（5% → 25% → 100%）
        await self.canary_deployment(version)
```

### 5.2 フィードバック収集

```javascript
// edge/feedback_collector.js
class FeedbackCollector {
    async collectAndBuffer(prediction, actual = null) {
        const feedback = {
            session_id: this.getSessionId(),
            input_hash: this.hashInput(prediction.input),
            predicted_line: prediction.line_id,
            confidence: prediction.confidence,
            actual_line: actual,
            timestamp: Date.now()
        };
        
        // D1に非同期保存
        await env.DB.prepare(
            'INSERT INTO feedback_queue (session_id, input_hash, predicted_line, timestamp) VALUES (?, ?, ?, ?)'
        ).bind(
            feedback.session_id,
            feedback.input_hash, 
            feedback.predicted_line,
            feedback.timestamp
        ).run();
        
        // バッチサイズ到達時にバックエンド送信
        const count = await this.getFeedbackCount();
        if (count >= 100) {
            await this.flushToBackend();
        }
    }
    
    async flushToBackend() {
        const feedbacks = await env.DB.prepare(
            'SELECT * FROM feedback_queue WHERE synced = 0 LIMIT 1000'
        ).all();
        
        if (feedbacks.results.length > 0) {
            // バックエンドAPIへ送信
            await fetch('https://ml-backend.example.com/feedbacks', {
                method: 'POST',
                body: JSON.stringify(feedbacks.results)
            });
            
            // 送信済みマーク
            await env.DB.prepare(
                'UPDATE feedback_queue SET synced = 1 WHERE id IN (' +
                feedbacks.results.map(f => f.id).join(',') + ')'
            ).run();
        }
    }
}
```

---

## 6. パフォーマンス最適化

### 6.1 キャッシング戦略

```javascript
class MultiLevelCache {
    constructor() {
        this.l1 = new Map();           // メモリキャッシュ（インスタンス内）
        this.l1MaxSize = 1000;
        this.l2 = env.KV;              // Workers KV（エッジ全体）
        this.l3 = caches.default;      // Cache API（CDN）
    }
    
    async get(key) {
        // L1: メモリ（0ms）
        if (this.l1.has(key)) {
            return { data: this.l1.get(key), source: 'memory' };
        }
        
        // L2: Workers KV（5ms）
        const kvData = await this.l2.get(key, 'json');
        if (kvData) {
            this.l1.set(key, kvData);
            return { data: kvData, source: 'kv' };
        }
        
        // L3: Cache API（10ms）
        const cacheResponse = await this.l3.match(key);
        if (cacheResponse) {
            const data = await cacheResponse.json();
            await this.promote(key, data);
            return { data, source: 'cache' };
        }
        
        return null;
    }
    
    async set(key, value, ttl = 3600) {
        // 全レベルに非同期書き込み
        this.l1.set(key, value);
        
        // L1サイズ制御
        if (this.l1.size > this.l1MaxSize) {
            const firstKey = this.l1.keys().next().value;
            this.l1.delete(firstKey);
        }
        
        // L2/L3への非同期書き込み（ブロッキングしない）
        this.l2.put(key, JSON.stringify(value), { expirationTtl: ttl });
        
        const response = new Response(JSON.stringify(value));
        this.l3.put(key, response);
    }
}
```

### 6.2 遅延読み込み

```javascript
class LazyLoader {
    constructor() {
        this.loaded = new Set();
        this.loading = new Map();
    }
    
    async loadResource(resource) {
        // 既に読み込み済み
        if (this.loaded.has(resource)) {
            return true;
        }
        
        // 読み込み中
        if (this.loading.has(resource)) {
            return await this.loading.get(resource);
        }
        
        // 新規読み込み
        const loadPromise = this.performLoad(resource);
        this.loading.set(resource, loadPromise);
        
        try {
            await loadPromise;
            this.loaded.add(resource);
            this.loading.delete(resource);
            return true;
        } catch (error) {
            this.loading.delete(resource);
            throw error;
        }
    }
    
    async performLoad(resource) {
        switch (resource) {
            case 'vectors':
                // 必要時のみベクトルロード
                return await this.loadVectors();
            case 'extended_dict':
                // 必要時のみ拡張辞書ロード
                return await this.loadExtendedDictionary();
            default:
                throw new Error(`Unknown resource: ${resource}`);
        }
    }
}
```

---

## 7. 監視とログ

### 7.1 パフォーマンス監視

```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            requests: 0,
            totalTime: 0,
            cacheHits: 0,
            errors: 0
        };
    }
    
    async track(operation) {
        const startTime = performance.now();
        const startMemory = performance.memory?.usedJSHeapSize;
        
        try {
            const result = await operation();
            
            const elapsed = performance.now() - startTime;
            const memoryUsed = performance.memory?.usedJSHeapSize - startMemory;
            
            // メトリクス更新
            this.metrics.requests++;
            this.metrics.totalTime += elapsed;
            
            // 閾値チェック
            if (elapsed > 50) {
                console.warn(`Operation exceeded 50ms limit: ${elapsed}ms`);
                await this.reportSlowOperation(operation, elapsed);
            }
            
            if (memoryUsed > 10 * 1024 * 1024) {  // 10MB
                console.warn(`High memory usage: ${memoryUsed / 1024 / 1024}MB`);
            }
            
            return result;
            
        } catch (error) {
            this.metrics.errors++;
            throw error;
        }
    }
    
    async reportMetrics() {
        const report = {
            timestamp: Date.now(),
            avgResponseTime: this.metrics.totalTime / this.metrics.requests,
            cacheHitRate: this.metrics.cacheHits / this.metrics.requests,
            errorRate: this.metrics.errors / this.metrics.requests
        };
        
        // Cloudflare Analytics Engineへ送信
        await env.ANALYTICS.writeDataPoint(report);
    }
}
```

---

## 8. デプロイメント構成

### 8.1 環境別構成

```yaml
environments:
  development:
    edge:
      runtime: wrangler dev
      database: D1 local
      cache: local memory
    backend:
      runtime: docker compose
      ml_framework: tensorflow
      
  staging:
    edge:
      runtime: Cloudflare Workers (preview)
      database: D1 preview
      cache: Workers KV preview
    backend:
      runtime: AWS ECS
      ml_framework: SageMaker
      
  production:
    edge:
      runtime: Cloudflare Workers
      database: D1 (分割構成)
      cache: Workers KV + Cache API
      regions: [US, EU, APAC]
    backend:
      runtime: AWS ECS + Fargate
      ml_framework: SageMaker
      gpu: p3.2xlarge (学習時のみ)
```

### 8.2 CI/CDパイプライン

```yaml
deploy_pipeline:
  edge_deploy:
    - test: npm run test:edge
    - build: npm run build:edge
    - compress: npm run compress:assets
    - deploy: wrangler publish
    - verify: npm run verify:edge
    
  backend_deploy:
    - test: pytest tests/
    - build: docker build
    - push: docker push
    - deploy: ecs deploy
    - verify: python verify.py
    
  model_update:
    - train: python train.py
    - compress: python compress_model.py
    - validate: python validate.py
    - upload: aws s3 cp
    - notify: wrangler kv:key put
```

---

## 承認

| 役割 | 氏名 | 承認日 | 署名 |
|------|------|--------|------|
| システムアーキテクト | | | |
| インフラリード | | | |
| MLエンジニアリード | | | |

**文書管理**
- **設計方針**: Edge制約を考慮した学習/推論分離
- **技術選定**: 軽量NLP + WebAssembly + 圧縮モデル
- **制約対応**: Cloudflare制限内での最適化
- **配布先**: 開発チーム、インフラチーム、MLチーム