# 📋 384爻システム Edge制約対応 実装計画書

**文書番号**: IP-384-EC-001  
**バージョン**: 1.0（Edge制約対応版）  
**作成日**: 2025年8月28日  
**作成者**: HAQEI開発チーム  
**承認者**: [未承認]

---

## 1. 実装概要

### 1.1 プロジェクト方針

```yaml
基本方針:
  制約遵守:
    - Cloudflare Pages制限内での実装
    - 学習と推論の完全分離
    - キャッシュファースト設計
    
  段階的実装:
    - Phase 1: 基本機能（軽量版）
    - Phase 2: NLP強化
    - Phase 3: ML統合
    - Phase 4: 最適化
    
  リスク軽減:
    - 3段階フォールバック
    - オフライン対応
    - グレースフルデグレード
```

### 1.2 制約事項マトリックス

| 制約項目 | 制限値 | 対策 | 影響範囲 |
|----------|--------|------|----------|
| D1 Database | 50MB/DB | 複数DB分割 | データ設計 |
| Workers KV | 25MB/値 | 分割格納 | キャッシュ |
| CPU時間 | 50ms/req | 事前計算 | 処理設計 |
| メモリ | 128MB | 軽量処理 | アルゴリズム |
| ペイロード | 100MB | 分割配信 | モデル配布 |

---

## 2. 段階的実装計画

### Phase 1: 基本機能実装（Week 1-2）

#### 目標
- Edge環境での基本動作確立
- 制約内での最小限機能実装
- フォールバック機構確立

#### タスク詳細

```yaml
Week 1:
  Day 1-2: 環境構築
    - Cloudflare Pages セットアップ
    - D1 Database 初期化（2DB分割）
    - Workers KV 設定
    - wrangler.toml 最適化設定
    
  Day 3-4: 基本データ統合
    - koudo_shishin.json 圧縮・分割
    - D1へのデータ投入（45MB以内）
    - インデックス最適化
    - 基本クエリ実装
    
  Day 5-7: 簡易スコアリング
    - 正規表現ベース形態素解析
    - キーワードマッチング
    - 簡易スコア計算
    - レスポンス時間測定

Week 2:
  Day 1-2: キャッシュ層実装
    - メモリキャッシュ（L1）
    - Workers KV（L2）
    - Cache API（L3）
    - キャッシュ戦略実装
    
  Day 3-4: フォールバック実装
    - 3段階デグレード
    - エラーハンドリング
    - オフライン対応
    - タイムアウト処理
    
  Day 5-7: 性能検証
    - 応答時間測定
    - CPU時間監視
    - メモリ使用量確認
    - 最適化ポイント特定
```

#### 実装コード例

```javascript
// workers/index.js
export default {
  async fetch(request, env, ctx) {
    const startTime = Date.now();
    
    try {
      // CPU時間監視
      if (Date.now() - startTime > 45) {
        return this.fallbackResponse();
      }
      
      // リクエスト解析
      const { text } = await request.json();
      
      // キャッシュ確認
      const cached = await this.checkCache(text, env);
      if (cached) return cached;
      
      // 軽量処理実行
      const result = await this.processWithLimit(text, env, 40);
      
      // キャッシュ保存（非同期）
      ctx.waitUntil(this.saveCache(text, result, env));
      
      return new Response(JSON.stringify(result));
      
    } catch (error) {
      return this.handleError(error);
    }
  },
  
  async processWithLimit(text, env, timeLimit) {
    const deadline = Date.now() + timeLimit;
    
    // 段階的処理
    const steps = [
      () => this.quickAnalysis(text),      // 5ms
      () => this.keywordMatch(text, env),  // 10ms
      () => this.scoring(text, env),       // 20ms
      () => this.enhance(text, env)        // 5ms
    ];
    
    let result = {};
    for (const step of steps) {
      if (Date.now() > deadline) break;
      Object.assign(result, await step());
    }
    
    return result;
  }
};
```

### Phase 2: NLP機能強化（Week 3-4）

#### 目標
- 軽量NLP処理の実装
- 圧縮辞書の統合
- ベクトル処理の導入

#### タスク詳細

```yaml
Week 3:
  Day 1-2: 圧縮辞書作成
    - 頻出1000語選定
    - 類義語マップ圧縮（300KB）
    - 易経専門用語辞書（500KB）
    - Workers KV格納
    
  Day 3-4: 軽量形態素解析
    - 正規表現パターン拡充
    - 専門用語優先処理
    - 品詞推定ロジック
    - 処理時間10ms以内
    
  Day 5-7: 類義語処理
    - 圧縮辞書ロード
    - 高速検索実装
    - 編集距離計算
    - キャッシュ最適化

Week 4:
  Day 1-2: ベクトル処理準備
    - 50次元ベクトル生成
    - Float16量子化
    - 384爻ベクトル事前計算
    - R2 Storage配置
    
  Day 3-4: WebAssembly統合
    - WASM推論エンジン実装
    - SIMD最適化
    - 内積計算高速化
    - メモリ管理
    
  Day 5-7: 統合テスト
    - NLP処理統合
    - パフォーマンス測定
    - 精度評価
    - ボトルネック分析
```

#### 軽量NLP実装

```javascript
// nlp/lightweight_nlp.js
class LightweightNLP {
  constructor(env) {
    this.env = env;
    this.dictCache = new Map();
    this.patterns = this.compilePatterns();
  }
  
  compilePatterns() {
    // 優先度付きパターン
    return [
      { 
        name: 'iching',
        regex: /乾為天|坤為地|[一-龥]{3}[為之]/g,
        weight: 2.0,
        type: 'hexagram'
      },
      {
        name: 'line',
        regex: /初[九六]|[九六][二三四五]|上[九六]/g,
        weight: 1.8,
        type: 'line_position'
      },
      {
        name: 'keyword',
        regex: /リーダー|変化|始まり|責任/g,
        weight: 1.5,
        type: 'concept'
      }
    ];
  }
  
  async analyze(text, timeLimit = 10) {
    const deadline = performance.now() + timeLimit;
    
    // 辞書遅延ロード
    if (this.dictCache.size === 0) {
      await this.loadDictionary();
    }
    
    const tokens = [];
    
    // パターンマッチング（優先度順）
    for (const pattern of this.patterns) {
      if (performance.now() > deadline) break;
      
      const matches = [...text.matchAll(pattern.regex)];
      for (const match of matches) {
        tokens.push({
          surface: match[0],
          type: pattern.type,
          weight: pattern.weight,
          position: match.index
        });
      }
    }
    
    // 類義語展開（時間制限内）
    if (performance.now() < deadline - 5) {
      await this.expandSynonyms(tokens);
    }
    
    return this.rankTokens(tokens);
  }
  
  async loadDictionary() {
    // Workers KVから圧縮辞書取得
    const compressed = await this.env.KV.get('dict:core', 'arrayBuffer');
    
    if (compressed) {
      // デコンプレス（簡易LZ圧縮）
      const dict = this.decompress(compressed);
      this.dictCache = new Map(Object.entries(dict));
    }
  }
}
```

### Phase 2.5: 圧縮品質検証ゲート（Week 4）

#### 圧縮データ品質保証プロセス
```javascript
// quality/phase2_verifier.js
class Phase2QualityGate {
    async verify() {
        const tests = {
            // 1. 辞書圧縮品質
            dictionary: await this.verifyDictionary(),
            
            // 2. ベクトル圧縮品質
            vectors: await this.verifyVectors(),
            
            // 3. 精度影響評価
            accuracy: await this.verifyAccuracy()
        };
        
        // 品質基準
        const criteria = {
            dictionary_retention: 0.95,  // 95%情報保持
            vector_similarity: 0.92,     // 92%類似度
            accuracy_degradation: 0.03   // 3%以内劣化
        };
        
        // 不合格時の調整
        if (!this.meetsQuality(tests, criteria)) {
            return this.adjustCompression(tests);
        }
        
        return { status: 'PASSED', tests };
    }
    
    adjustCompression(tests) {
        const adjustments = [];
        
        if (tests.dictionary.retention < 0.95) {
            adjustments.push({
                target: 'dictionary',
                action: '語彙数を1000→1500に拡張',
                impact: '+200KB'
            });
        }
        
        if (tests.vectors.similarity < 0.92) {
            adjustments.push({
                target: 'vectors',
                action: '量子化をINT8→Float16に変更',
                impact: '+1MB'
            });
        }
        
        return { 
            status: 'NEEDS_ADJUSTMENT',
            adjustments,
            estimated_size: this.calculateNewSize(adjustments)
        };
    }
}
```

### Phase 3: 機械学習統合（Week 5-6）

#### 目標
- バックエンド学習環境構築
- モデル圧縮・配信機構
- Edge推論統合

#### タスク詳細

```yaml
Week 5:
  Day 1-2: バックエンド環境
    - AWS SageMaker設定
    - 学習パイプライン構築
    - データ収集API
    - S3バケット準備
    
  Day 3-4: 学習実装
    - TensorFlow Lite使用
    - モデル訓練スクリプト
    - ハイパーパラメータ調整
    - 検証セット評価
    
  Day 5-7: モデル圧縮
    - 量子化（INT8）
    - プルーニング
    - 知識蒸留
    - WebAssembly変換

Week 6:
  Day 1-2: 配信機構
    - R2へのアップロード
    - バージョン管理
    - 差分更新
    - CDN配信設定
    
  Day 3-4: Edge推論統合
    - モデルローダー実装
    - 推論エンジン統合
    - フォールバック対応
    - メモリ管理
    
  Day 5-7: フィードバックループ
    - 予測結果収集
    - バッファリング
    - バッチ送信
    - 学習データ蓄積
```

#### バックエンド学習システム

```python
# backend/training.py
import tensorflow as tf
import numpy as np
from datetime import datetime

class EdgeModelTrainer:
    def __init__(self):
        self.model = None
        self.target_size_mb = 5
        
    def train_and_compress(self, training_data):
        """フルモデル訓練と圧縮"""
        
        # 1. フルモデル訓練
        full_model = self.train_full_model(training_data)
        
        # 2. 量子化
        converter = tf.lite.TFLiteConverter.from_keras_model(full_model)
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.target_spec.supported_types = [tf.int8]
        
        # 3. プルーニング
        pruned_model = self.prune_model(full_model, sparsity=0.5)
        
        # 4. TFLite変換
        tflite_model = converter.convert()
        
        # 5. サイズ確認
        model_size = len(tflite_model) / (1024 * 1024)
        if model_size > self.target_size_mb:
            tflite_model = self.further_compress(tflite_model)
        
        return tflite_model
    
    def deploy_to_edge(self, model):
        """Edgeへのデプロイ"""
        
        # WebAssembly変換
        wasm_model = self.convert_to_wasm(model)
        
        # R2へアップロード
        version = datetime.now().strftime('%Y%m%d_%H%M')
        self.upload_to_r2(wasm_model, f'model_{version}.wasm')
        
        # メタデータ更新
        self.update_edge_metadata({
            'version': version,
            'size': len(wasm_model),
            'accuracy': self.validate_model(model)
        })
```

### Phase 4: 最適化と本番展開（Week 7-8）

#### 目標
- パフォーマンス最適化
- 本番環境展開
- 監視体制確立

#### タスク詳細

```yaml
Week 7:
  Day 1-2: パフォーマンス最適化
    - ボトルネック特定
    - クエリ最適化
    - インデックス調整
    - キャッシュチューニング
    
  Day 3-4: 負荷テスト
    - 500req/sec負荷試験
    - CPU時間測定
    - メモリ使用量監視
    - エラー率確認
    
  Day 5-7: セキュリティ対策
    - 入力検証強化
    - レート制限
    - CORS設定
    - CSP実装

Week 8:
  Day 1-2: 本番デプロイ準備
    - 環境変数設定
    - シークレット管理
    - DNS設定
    - SSL証明書
    
  Day 3-4: 段階的リリース
    - カナリアデプロイ（5%）
    - 監視強化
    - 段階的拡大（25%→50%→100%）
    - ロールバック準備
    
  Day 5-7: 運用体制確立
    - 監視ダッシュボード
    - アラート設定
    - オンコール体制
    - ドキュメント整備
```

---

## 3. リスク管理計画

### 3.1 技術リスクと対策

| リスク | 発生確率 | 影響度 | 対策 | 代替案 |
|--------|----------|--------|------|--------|
| D1容量超過 | 中 | 高 | データ圧縮・分割 | 外部API化 |
| CPU時間超過 | 高 | 高 | 事前計算・キャッシュ | 処理簡略化 |
| モデルサイズ | 中 | 中 | 量子化・圧縮 | 簡易ルール |
| キャッシュミス | 低 | 中 | 多層キャッシュ | 容量拡大 |
| 学習精度低下 | 中 | 中 | データ品質管理 | 手動調整 |

### 3.2 段階的フォールバック戦略

```javascript
// fallback/strategy.js
class FallbackStrategy {
  constructor() {
    this.levels = [
      { name: 'full', timeout: 45, accuracy: 0.85 },
      { name: 'simplified', timeout: 20, accuracy: 0.75 },
      { name: 'rule-based', timeout: 5, accuracy: 0.60 }
    ];
  }
  
  async execute(input, env) {
    for (const level of this.levels) {
      try {
        const result = await this.executeLevel(input, env, level);
        if (result) return result;
      } catch (error) {
        console.warn(`Level ${level.name} failed:`, error);
        continue;
      }
    }
    
    // 最終フォールバック
    return this.staticResponse();
  }
  
  async executeLevel(input, env, level) {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), level.timeout)
    );
    
    const process = this.getProcessor(level.name);
    
    return Promise.race([
      process(input, env),
      timeout
    ]);
  }
}
```

---

## 4. 成功指標とKPI

### 4.1 フェーズ別目標値

| Phase | 期間 | 精度目標 | 応答時間 | 実装範囲 |
|-------|------|----------|----------|----------|
| Phase 1 | Week 1-2 | 70% | <50ms | 基本機能 |
| Phase 2 | Week 3-4 | 75% | <40ms | NLP統合 |
| Phase 3 | Week 5-6 | 80% | <35ms | ML推論 |
| Phase 4 | Week 7-8 | 85% | <30ms | 最適化版 |

### 4.2 監視メトリクス

```yaml
必須監視項目:
  パフォーマンス:
    - 応答時間（p50, p95, p99）
    - CPU時間/リクエスト
    - メモリ使用量
    - キャッシュヒット率
    
  品質:
    - 分類精度
    - エラー率
    - フォールバック発生率
    - タイムアウト率
    
  ビジネス:
    - リクエスト数/日
    - ユニークユーザー数
    - API使用量
    - コスト/リクエスト
```

---

## 5. チーム体制と役割

### 5.1 実装チーム構成

```yaml
Edge開発チーム:
  役割:
    - Workers実装
    - D1/KV管理
    - キャッシュ最適化
  必要スキル:
    - JavaScript/TypeScript
    - Cloudflare Workers
    - WebAssembly
    
ML開発チーム:
  役割:
    - モデル訓練
    - 圧縮・最適化
    - バックエンド実装
  必要スキル:
    - Python/TensorFlow
    - モデル圧縮技術
    - AWS/GCP
    
インフラチーム:
  役割:
    - CI/CD構築
    - 監視設定
    - セキュリティ
  必要スキル:
    - Terraform
    - GitHub Actions
    - Cloudflare設定
```

### 5.2 コミュニケーション計画

```yaml
定例会議:
  日次スタンドアップ:
    時間: 10:00-10:15
    内容: 進捗共有、ブロッカー確認
    
  週次レビュー:
    時間: 金曜 15:00-16:00
    内容: KPI確認、次週計画
    
  技術共有会:
    時間: 水曜 14:00-15:00
    内容: 実装課題、最適化案

ツール:
  - Slack: 日常コミュニケーション
  - GitHub: コード管理、Issue管理
  - Notion: ドキュメント管理
  - Datadog: 監視ダッシュボード
```

---

## 6. ライセンスと法的考慮

### 6.1 使用ライブラリのライセンス

| ライブラリ | ライセンス | 利用方法 | 注意点 |
|-----------|-----------|----------|--------|
| TensorFlow | Apache 2.0 | バックエンド学習 | 帰属表示必要 |
| 正規表現辞書 | 自作 | Edge処理 | 制限なし |
| 圧縮アルゴリズム | MIT | データ圧縮 | 著作権表示 |
| WebAssembly SDK | Apache 2.0 | 推論エンジン | 帰属表示必要 |

### 6.2 データ利用規約

```yaml
JSONデータ:
  koudo_shishin.json:
    - プロジェクト内利用可
    - 圧縮・加工可
    
  外部辞書:
    - MeCab辞書: 使用せず（ライセンス回避）
    - WordNet: API経由利用検討
    - 自作辞書: 制限なし
```

---

## 承認

| 役割 | 氏名 | 承認日 | 署名 |
|------|------|--------|------|
| プロジェクトマネージャー | | | |
| 技術リード | | | |
| 法務責任者 | | | |

**文書管理**
- **実装方式**: Edge制約内での段階的実装
- **期間**: 8週間（フェーズ別）
- **リスク対応**: 3段階フォールバック
- **配布先**: 開発チーム、PM、法務チーム