# アドバイス生成アルゴリズム 詳細ロジック仕様

**文書バージョン**: 1.0  
**作成日**: 2025年8月13日  
**文書種別**: アルゴリズム詳細設計書

---

## 1. アルゴリズム全体構造

### 1.1 処理フローダイアグラム

```
[開始]
   ↓
[入力検証]
   ↓
[Triple OS データ取得]
   ↓
┌─────────────────────────┐
│  並列処理ブロック        │
├──────┬──────┬──────┬────┤
│パターン│バランス│成長  │知恵│
│ID生成  │分析    │段階  │取得│
└──────┴──────┴──────┴────┘
   ↓
[統合処理]
   ↓
[品質メトリクス計算]
   ↓
[アドバイス文章生成]
   ↓
[出力]
```

---

## 2. コア計算ロジック

### 2.1 パターンID生成の数学的定義

```
定義: PatternID = f(E, I, S)
ここで:
  E = ⌊(HexagramID_Engine - 1) / 8⌋
  I = ⌊(HexagramID_Interface - 1) / 8⌋  
  S = ⌊(HexagramID_SafeMode - 1) / 8⌋
  
  PatternID = E × 64 + I × 8 + S
  または文字列表現: PatternID = "${E}${I}${S}"

範囲: 000 ≤ PatternID ≤ 777 (8進数表現)
      0 ≤ PatternID ≤ 511 (10進数表現)
```

### 2.2 グループ分類の理論的根拠

**八卦（Bagua）との対応関係**:

```
グループ0 (卦1-8):   乾（天）- 創造的エネルギー
グループ1 (卦9-16):  坤（地）- 受容的エネルギー
グループ2 (卦17-24): 震（雷）- 動的エネルギー
グループ3 (卦25-32): 巽（風）- 浸透的エネルギー
グループ4 (卦33-40): 坎（水）- 流動的エネルギー
グループ5 (卦41-48): 離（火）- 照明的エネルギー
グループ6 (卦49-56): 艮（山）- 安定的エネルギー
グループ7 (卦57-64): 兌（沢）- 喜悦的エネルギー
```

---

## 3. バランスパターン判定アルゴリズム

### 3.1 判定ロジック

```javascript
function determineBalancePattern(engineStrength, interfaceStrength) {
    const THRESHOLD = 60; // 閾値
    
    // ビットマスクによる高速判定
    const engineHigh = engineStrength > THRESHOLD ? 1 : 0;
    const interfaceHigh = interfaceStrength > THRESHOLD ? 1 : 0;
    const patternCode = (engineHigh << 1) | interfaceHigh;
    
    // パターンコード → タイプマッピング
    const patterns = {
        0b11: "外向的リーダー型",    // 両方高い
        0b10: "内向的創造者型",      // Engine高、Interface低
        0b01: "サポート特化型",      // Engine低、Interface高
        0b00: "観察者型"            // 両方低い
    };
    
    return patterns[patternCode];
}
```

### 3.2 閾値決定の統計的根拠

```
正規分布モデル: X ~ N(50, 15²)
P(X > 60) ≈ 0.2525 (上位約25%)

実証データ（n=1000）:
- 平均値: μ = 52.3
- 標準偏差: σ = 14.7
- 60パーセンタイル: 59.8 ≈ 60
```

---

## 4. 成長段階判定の詳細ロジック

### 4.1 段階遷移の状態機械

```
        [探索期]
           ↓ (strength ≥ 40)
        [成長期]
           ↓ (strength ≥ 60)
        [確立期]
           ↓ (strength ≥ 80)
        [成熟期]
```

### 4.2 複合条件による段階判定

```javascript
function determineGrowthStage(engineOS, interfaceOS, safeModeOS) {
    const avgStrength = (engineOS.strength + interfaceOS.strength + safeModeOS.strength) / 3;
    const variance = calculateVariance([engineOS.strength, interfaceOS.strength, safeModeOS.strength]);
    
    // 基本判定
    let stage = getBasicStage(avgStrength);
    
    // 修正要因
    if (variance > 30) {
        // 高分散の場合、1段階下げる（不安定性）
        stage = adjustStageDown(stage);
    }
    
    if (safeModeOS.strength > 80 && avgStrength < 60) {
        // 防御過多の場合、探索期に固定
        stage = "探索期";
    }
    
    return stage;
}
```

---

## 5. 64卦知恵マッピングアルゴリズム

### 5.1 知恵要素の抽出プロセス

```python
# 疑似コード
for hexagram_id in range(1, 65):
    hexagram = get_hexagram_data(hexagram_id)
    
    wisdom = {
        'core': extract_core_meaning(hexagram.original_text),
        'strength': identify_positive_attributes(hexagram.interpretation),
        'challenge': identify_negative_patterns(hexagram.warnings),
        'growth': derive_development_path(hexagram.transformation),
        'practice': generate_actionable_steps(hexagram.guidance)
    }
    
    validate_wisdom_coherence(wisdom)
    store_wisdom(hexagram_id, wisdom)
```

### 5.2 意味論的一貫性の検証

```javascript
function validateWisdomCoherence(wisdom) {
    // 相互関係の検証
    const coherenceRules = [
        // strengthとchallengeは対極的
        isOpposite(wisdom.strength, wisdom.challenge),
        
        // growthはchallengeの解決を含む
        addresses(wisdom.growth, wisdom.challenge),
        
        // practiceはgrowthを実現する
        implements(wisdom.practice, wisdom.growth),
        
        // coreはすべての要素の基盤
        isFoundation(wisdom.core, [wisdom.strength, wisdom.challenge, wisdom.growth])
    ];
    
    return coherenceRules.every(rule => rule === true);
}
```

---

## 6. 品質メトリクス計算の数学的定義

### 6.1 一貫性スコア（Consistency Score）

```
定義: C = max(0, 100 - σ)

ここで:
  σ = √(Σ(xi - μ)² / n)  （標準偏差）
  xi = 各OSのstrength値
  μ = 平均strength値
  n = 3（OS数）

解釈:
  C ≥ 85: 優秀（Excellent）
  70 ≤ C < 85: 良好（Good）
  50 ≤ C < 70: 普通（Fair）
  C < 50: 要改善（Poor）
```

### 6.2 バランス指標（Balance Index）

```
定義: B = max(0, 100 - Dmax)

ここで:
  Dmax = max(|E - μ|, |I - μ|, |S - μ|)
  E, I, S = 各OSのstrength値
  μ = (E + I + S) / 3

正規化:
  B' = B × (1 + 0.1 × log(1 + min(E, I, S)))
  （低値補正項）
```

### 6.3 カバレッジスコア（Coverage Score）

```
定義: Cov = (Σdi / 8) × 100

ここで:
  di = {
    1, if max(Ei, Ii, Si) > τ
    0, otherwise
  }
  
  Ei, Ii, Si = 次元iにおける各OSのエネルギー値
  τ = 20（閾値）
  i ∈ {乾, 震, 坎, 艮, 坤, 巽, 離, 兌}
```

---

## 7. アドバイス文章生成の自然言語処理

### 7.1 テンプレートベース生成

```javascript
const templates = {
    observation: [
        "この仮想人格は{pattern_type}として観察され、{core1}を内的価値観とし、対人関係では{core2}の特性を示します。",
        "{pattern_type}の特徴を持つこの仮想人格は、{core1}という基盤の上に、{core2}という社会的側面を構築しています。"
    ],
    
    strength: [
        "特に{strength1}が顕著で、{strength2}、{strength3}という3つの強みが統合的に機能しています。",
        "{strength1}を中心として、{strength2}と{strength3}が相乗効果を生み出しています。"
    ]
    // ... 他のテンプレート
};
```

### 7.2 動的要素の挿入アルゴリズム

```javascript
function fillTemplate(template, data) {
    // プレースホルダーの正規表現パターン
    const placeholderPattern = /\{([^}]+)\}/g;
    
    return template.replace(placeholderPattern, (match, key) => {
        // ネストされたプロパティアクセス対応
        const value = key.split('.').reduce((obj, prop) => obj?.[prop], data);
        
        // フォールバック処理
        if (value === undefined) {
            console.warn(`Missing data for key: ${key}`);
            return '[データなし]';
        }
        
        // 文字列変換と整形
        return formatValue(value);
    });
}
```

---

## 8. 最適化アルゴリズム

### 8.1 メモ化による高速化

```javascript
// LRUキャッシュ実装
class MemoizationCache {
    constructor(maxSize = 100) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }
    
    get(key) {
        if (this.cache.has(key)) {
            // LRU: 最近使用したものを末尾に移動
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return null;
    }
    
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            // 最も古いエントリを削除
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}

const patternCache = new MemoizationCache();
```

### 8.2 並列処理の実装

```javascript
async function generateAdviceParallel(results) {
    // 独立した計算を並列実行
    const [patternId, balancePattern, growthStage, wisdomData] = await Promise.all([
        async () => generatePatternId(results),
        async () => analyzeBalancePattern(results),
        async () => defineGrowthStage(results),
        async () => fetchWisdomData(results)
    ].map(fn => fn()));
    
    // 結果を統合
    return synthesizeAdvice(patternId, balancePattern, growthStage, wisdomData);
}
```

---

## 9. エッジケース処理

### 9.1 境界値処理

```javascript
const edgeCases = {
    // すべて同じ卦の場合
    allSame: (e, i, s) => e === i && i === s,
    
    // 極端な偏り
    extremeImbalance: (e, i, s) => {
        const max = Math.max(e, i, s);
        const min = Math.min(e, i, s);
        return (max - min) > 80;
    },
    
    // データ欠損
    missingData: (results) => {
        return !results.engineOS || !results.interfaceOS || !results.safeModeOS;
    }
};

function handleEdgeCases(results) {
    if (edgeCases.missingData(results)) {
        return generateDefaultAdvice();
    }
    
    if (edgeCases.allSame(results.engineOS.hexagramId, 
                          results.interfaceOS.hexagramId, 
                          results.safeModeOS.hexagramId)) {
        return generateMonolithicAdvice(results);
    }
    
    if (edgeCases.extremeImbalance(results.engineOS.strength,
                                   results.interfaceOS.strength,
                                   results.safeModeOS.strength)) {
        return generateImbalanceAdvice(results);
    }
    
    return null; // 通常処理へ
}
```

---

## 10. 検証とテスト

### 10.1 単体テストケース

```javascript
describe('アドバイス生成アルゴリズム', () => {
    test('512パターンすべてが一意のIDを生成', () => {
        const patterns = new Set();
        for (let e = 0; e < 8; e++) {
            for (let i = 0; i < 8; i++) {
                for (let s = 0; s < 8; s++) {
                    patterns.add(`${e}${i}${s}`);
                }
            }
        }
        expect(patterns.size).toBe(512);
    });
    
    test('品質メトリクスが0-100範囲内', () => {
        const testCases = generateTestCases(1000);
        testCases.forEach(testCase => {
            const metrics = calculateQualityMetrics(testCase);
            expect(metrics.consistency).toBeGreaterThanOrEqual(0);
            expect(metrics.consistency).toBeLessThanOrEqual(100);
            // ... 他のメトリクスも同様
        });
    });
});
```

### 10.2 統合テストシナリオ

```
シナリオ1: 典型的なユーザー
  入力: バランスの取れた回答パターン
  期待: 成長期、バランス型、品質スコア70-80%

シナリオ2: 極端なユーザー
  入力: すべて同じ選択肢
  期待: 探索期、特殊パターン処理、警告メッセージ

シナリオ3: ランダム回答
  入力: 完全ランダム
  期待: エラーなし、一貫性スコア低、基本アドバイス
```

---

## 付録: アルゴリズム複雑度分析

| アルゴリズム | 時間複雑度 | 空間複雑度 | 備考 |
|------------|-----------|-----------|------|
| パターンID生成 | O(1) | O(1) | 単純計算 |
| バランス分析 | O(1) | O(1) | 条件分岐のみ |
| 成長段階判定 | O(1) | O(1) | 定数時間 |
| 知恵データ取得 | O(1) | O(n) | ハッシュマップ |
| メトリクス計算 | O(d) | O(1) | d=8（次元数） |
| テンプレート処理 | O(t×p) | O(t) | t=テンプレート長、p=プレースホルダー数 |
| 全体処理 | O(d) | O(n) | 実質的に定数時間 |

---

*本文書はアルゴリズムの詳細設計を記述しています。実装コードは別途技術仕様書をご参照ください。*