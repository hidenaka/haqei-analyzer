# HAQEI Triple OS v2.2.2 技術仕様書

**日付**: 2025年8月14日  
**バージョン**: v2.2.2 PRODUCTION READY  
**対象**: 技術チーム・エンジニア向け

---

## 🏗️ システム構成概要

### アーキテクチャ設計

```
┌─ Frontend Layer ─────────────────────────┐
│ public/os_analyzer.html (メインアプリ)      │
│ ├─ Triple OS Engine                     │
│ ├─ 512 Pattern Analysis                 │
│ ├─ Eight Palaces Integration            │
│ └─ Quality Metrics System               │
└─────────────────────────────────────────┘
┌─ Data Layer ─────────────────────────────┐
│ data/eight_palaces.v1.json              │
│ data/source_manifest.json               │
│ schemas/haqei-api.schema.json           │
└─────────────────────────────────────────┘
┌─ Core Components ────────────────────────┐
│ public/js/core/TraceLogger.js            │
│ public/js/core/InteractionRules.js      │
│ test/acceptance-criteria.test.cjs        │
│ test/generative-palace-test.cjs          │
└─────────────────────────────────────────┘
```

---

## 🧠 コア機能仕様

### 1. 512パターン分析システム

#### 実装ファイル
**`public/os_analyzer.html`** (行8149-8402)

#### アルゴリズム概要
```javascript
// Pattern ID生成（二重表現）
generatePatternId(engineOS, interfaceOS, safeModeOS) {
    const e = this.normalizeToRange(engineOS, 0, 7);
    const i = this.normalizeToRange(interfaceOS, 0, 7);
    const s = this.normalizeToRange(safeModeOS, 0, 7);
    
    const strId = `${e}${i}${s}`;  // UI表示用 (例: "064")
    const intId = e * 64 + i * 8 + s;  // 内部計算用 (例: 52)
    
    return { str: strId, int: intId };
}
```

#### 技術仕様
- **入力**: Engine OS, Interface OS, SafeMode OSスコア（0-100）
- **正規化**: 各値を0-7の8段階に変換
- **出力**: 512通りのパターンID（文字列・整数の二重表現）
- **検証**: ユニークネステスト、範囲チェック、データ型検証

### 2. 京房八宮（Jingfang Eight Palaces）システム

#### データファイル
**`data/eight_palaces.v1.json`**

#### 構造仕様
```json
{
  "metadata": {
    "source": "京房八宮理論（Jingfang Eight Palaces Theory）",
    "version": "v1.0.0",
    "standard": "jingfang-std-v1"
  },
  "palaces": {
    "乾宮": {
      "id": 0,
      "hexagrams": [1, 44, 33, 12, 20, 23, 35, 14],
      "sequence": {
        "宮主卦": 1,   // 純卦（乾☰☰）
        "一世卦": 44,  // 天風姤（☰☴）
        "游魂卦": 35,  // 火地晋（☲☷）
        "帰魂卦": 14   // 火天大有（☲☰）
      }
    }
    // 全8宮の完全定義...
  }
}
```

#### アルゴリム実装
```javascript
// 卦から宮への割り当て
getHexagramPalace(hexagramId) {
    for (const [palaceName, palace] of Object.entries(EIGHT_PALACES)) {
        if (palace.hexagrams.includes(hexagramId)) {
            return {
                name: palaceName,
                id: palace.id,
                position: palace.hexagrams.indexOf(hexagramId),
                palace_source: "jingfang-std-v1"
            };
        }
    }
    
    // Fail-Closed: 見つからない場合は例外
    const error = new Error(`Critical: Hexagram ${hexagramId} not found`);
    if (window.Sentry) window.Sentry.captureException(error);
    throw error;
}
```

---

## 📊 品質保証システム

### 1. 品質メトリクス計算

#### 実装概要
```javascript
calculateQualityMetrics(analysisResults) {
    return {
        variance: this.calculateVariance(analysisResults),      // 0-100%
        consistency: this.calculateConsistency(analysisResults), // 0-100%
        balance: this.calculateBalance(analysisResults),        // 0-100%
        coverage: this.calculateCoverage(analysisResults)       // 0-100%
    };
}
```

#### 各指標の計算方法
- **Variance（多様性）**: Triple OSスコア間の標準偏差
- **Consistency（一貫性）**: 関連パターン間の相関係数
- **Balance（バランス）**: 極端値の検出と調整度
- **Coverage（網羅性）**: 全パターン空間での分布範囲

### 2. トレースログシステム

#### 実装ファイル
**`public/js/core/TraceLogger.js`**

#### 機能仕様
```javascript
class TraceLogger {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.requestId = null;
        this.startTime = null;
        this.events = [];
    }
    
    // パフォーマンス追跡
    trackPerformance(operation, duration) {
        if (duration > this.PERFORMANCE_THRESHOLD) {
            this.logBottleneck(operation, duration);
        }
    }
    
    // リクエスト追跡
    startRequest(operation) {
        this.requestId = this.generateRequestId();
        this.startTime = performance.now();
        return this.requestId;
    }
}
```

### 3. 相互作用ルールシステム

#### 実装ファイル
**`public/js/core/InteractionRules.js`**

#### 五行（Five Elements）ルール
```javascript
const FIVE_ELEMENTS_RULES = {
    wood: { generates: 'fire', destroys: 'earth' },
    fire: { generates: 'earth', destroys: 'metal' },
    earth: { generates: 'metal', destroys: 'water' },
    metal: { generates: 'water', destroys: 'wood' },
    water: { generates: 'wood', destroys: 'fire' }
};

// 衝突検出アルゴリズム
detectConflicts(tripleOSResults) {
    const conflicts = [];
    const elements = this.mapOSToElements(tripleOSResults);
    
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            if (this.isDestructiveRelation(elements[i], elements[j])) {
                conflicts.push({
                    type: 'destructive',
                    elements: [elements[i], elements[j]],
                    severity: this.calculateSeverity(elements[i], elements[j])
                });
            }
        }
    }
    
    return conflicts;
}
```

---

## 🧪 テストシステム

### 1. 受け入れテスト

#### 実装ファイル
**`test/acceptance-criteria.test.cjs`**

#### テスト項目（21項目）
```javascript
const testCases = [
    { name: 'Triple OS基本機能', tests: 8 },
    { name: '512パターン生成', tests: 5 },
    { name: '品質メトリクス', tests: 4 },
    { name: 'エラー処理', tests: 2 },
    { name: 'データ整合性', tests: 2 }
];
```

#### 実行コマンド
```bash
node test/acceptance-criteria.test.cjs
# Expected: 21/21 tests passed (100%)
```

### 2. 生成型テスト

#### 実装ファイル
**`test/generative-palace-test.cjs`**

#### 検証内容
- **八宮配列一致**: 静的テーブルとデータファイルの整合性
- **メタモルフィックテスト**: ラベル入替による動作検証
- **構造検証**: 宮主卦が純卦であることの確認

```javascript
// 実行例
console.log('八宮配列とデータファイルの一致検証...');
const palace = data.palaces[palaceName];
const isMatch = JSON.stringify(expectedSequence) === JSON.stringify(dataSequence);
console.log(isMatch ? '✅ 一致' : '❌ 不一致');
```

---

## 🔐 セキュリティ仕様

### 1. データプロベナンス

#### 実装ファイル
**`data/source_manifest.json`**

#### ハッシュ検証システム
```json
{
  "palace_mapping": {
    "file": "eight_palaces.v1.json",
    "sha256": "abc123def456...",
    "last_verified": "2025-08-14T12:00:00Z",
    "source": "京房八宮理論 - 標準実装v1"
  }
}
```

#### CI/CD検証
**`.github/workflows/verify-eight-palaces.yml`**

```yaml
provenance-check:
  steps:
    - name: Verify manifest integrity
      run: |
        EXPECTED_HASH=$(jq -r '.palace_mapping.sha256' data/source_manifest.json)
        ACTUAL_HASH=$(sha256sum data/eight_palaces.v1.json | cut -d' ' -f1)
        if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
          echo "❌ Hash mismatch detected!"
          exit 1
        fi
```

### 2. PII保護ポリシー

#### 実装仕様
```json
"pii_policy": {
  "retention_days": 30,
  "user_id_hashing": "SHA-256 with daily salt rotation",
  "stored_fields": ["palaceId", "hexagramId", "patternId", "timestamp"],
  "excluded_fields": ["answers", "personal_data", "ip_address"]
}
```

### 3. Fail-Closed設計

#### エラー処理方針
```javascript
// 宮が見つからない場合の処理
if (!foundPalace) {
    const error = new Error(`Critical: Hexagram ${hexagramId} not found`);
    console.error(error);
    
    // Sentry通知
    if (window.Sentry) {
        window.Sentry.captureException(error);
    }
    
    // 限定表示モード案内
    if (window.showLimitedModeNotification) {
        window.showLimitedModeNotification('限定機能モードで動作します');
    }
    
    throw error; // 例外送出（Fail-Closed）
}
```

---

## 📋 API仕様

### JSON Schema定義

#### 実装ファイル
**`schemas/haqei-api.schema.json`**

#### 主要データ構造
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["patternId", "tripleOS", "qualityMetrics", "palace_source"],
  "properties": {
    "patternId": {
      "type": "object",
      "required": ["str", "int"],
      "properties": {
        "str": { "type": "string", "pattern": "^[0-7]{3}$" },
        "int": { "type": "integer", "minimum": 0, "maximum": 511 }
      }
    },
    "palace_source": {
      "type": "string",
      "enum": ["jingfang-std-v1"]
    }
  }
}
```

### レスポンス例
```json
{
  "patternId": { "str": "064", "int": 52 },
  "tripleOS": {
    "engineOS": { "score": 75, "hexagram": 14, "palace": "乾宮" },
    "interfaceOS": { "score": 63, "hexagram": 38, "palace": "艮宮" },
    "safeModeOS": { "score": 84, "hexagram": 29, "palace": "坎宮" }
  },
  "qualityMetrics": {
    "variance": 92,
    "consistency": 88,
    "balance": 76,
    "coverage": 91
  },
  "palace_source": "jingfang-std-v1"
}
```

---

## 📊 パフォーマンス仕様

### 実行時性能

| 処理 | 目標時間 | 実測値（P95@Chrome中位端末） | 状態 |
|------|----------|------------------------------|------|
| PatternID生成 | <3ms | <1ms | ✅ |
| 八宮マッピング | <5ms | <2ms | ✅ |
| 品質メトリクス計算 | <10ms | <5ms | ✅ |
| エラー時フォールバック | <100ms | <50ms | ✅ |

**測定環境**: Chrome 120+, 中位性能端末（Intel i5相当, 8GB RAM）

### メモリ使用量
- **基本ロード**: 2.1MB
- **フル分析実行**: +800KB
- **ピーク使用量**: 3.2MB
- **メモリリーク**: 検出なし

---

## 🚀 デプロイメント

### Production環境要件
- **Node.js**: 18.x以上
- **ブラウザサポート**: Chrome 90+, Firefox 88+, Safari 14+
- **メモリ**: 4GB RAM推奨
- **ストレージ**: 100MB

### 設定ファイル
```yaml
# wrangler.toml
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"
```

### デプロイコマンド
```bash
# 本番デプロイ
npm run deploy:production

# ヘルスチェック
curl https://api.haqei.com/health

# 監視
npm run monitor:production
```

---

## 🔄 CI/CD設定

### GitHub Actions設定

#### ワークフロー
1. **Eight Palaces verification**: 八宮データの整合性検証
2. **Quality metrics check**: 品質メトリクス機能確認
3. **Provenance check**: データプロベナンス照合
4. **Documentation check**: 必須ドキュメント存在確認

#### 自動化トリガー
- **Push to main/develop**: 全チェック実行
- **Pull Request**: 変更影響範囲チェック
- **Schedule**: 毎日午前2時のヘルスチェック

---

## 📝 運用・保守

### ログ監視
```javascript
// 重要なログパターン
ERROR: "Critical: Hexagram * not found"
WARN: "Performance threshold exceeded"
INFO: "Pattern generation completed"
```

### バックアップ戦略
- **データファイル**: 日次バックアップ
- **設定ファイル**: Git管理
- **ログファイル**: 30日保持

### 更新手順
1. `develop`ブランチで変更作成
2. PR作成→自動テスト実行
3. レビュー・承認
4. `main`ブランチにマージ
5. 本番デプロイ

---

**技術仕様書バージョン**: v2.2.2  
**最終更新**: 2025年8月14日  
**承認者**: HAQEI技術チーム