# 正規化適用順序の明文化仕様書

## 概要
HaQei OS Analyzerにおける正規化処理の適用順序を明確に定義し、一貫性のある処理を保証する。

---

## 標準処理フロー

### 1. 入力段階（Raw Input）
```javascript
// 生の入力ベクトル（例: Engine OS）
const rawVector = {
    "乾": 45,
    "兌": 20,
    "離": 15,
    "震": 10,
    "巽": 8,
    "坎": 5,
    "艮": 3,
    "坤": 2
};
```

### 2. 前処理段階（Preprocessing）
```javascript
// 平坦性チェック
function checkFlatness(vector, epsilon = 1e-9) {
    const values = Object.values(vector);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const maxDiff = Math.max(...values.map(v => Math.abs(v - mean)));
    return maxDiff < epsilon;
}

// 平坦な場合は均等分布を返す
if (checkFlatness(rawVector)) {
    return createUniformVector(); // 各要素 12.5%
}
```

### 3. OS重み適用段階（OS Weights Application）
```javascript
// OS別の重み係数を適用（正規化前）
function applyOSWeights(vector, osType) {
    const weights = OS_WEIGHTS[osType];
    const weighted = {};
    
    Object.keys(vector).forEach(key => {
        weighted[key] = vector[key] * (weights[key] || 1.0);
    });
    
    return weighted;
}

// 例: Engine OSの重み
const OS_WEIGHTS = {
    engine: {
        "乾": 1.2,  // 創造性を重視
        "兌": 0.9,
        "離": 1.1,  // 明晰性を重視
        "震": 1.0,
        "巽": 0.9,
        "坎": 1.1,  // 深層性を重視
        "艮": 1.0,
        "坤": 0.8
    }
};
```

### 4. 正規化段階（Normalization）
```javascript
// Softmax正規化（推奨）
function softmaxNormalize(vector, temperature = 1.2) {
    // 温度パラメータのバリデーション
    if (temperature <= 0) {
        throw new Error("Temperature must be positive");
    }
    if (temperature < 0.1) {
        console.warn("Very low temperature may cause numerical instability");
    }
    if (temperature > 5.0) {
        console.warn("Very high temperature will produce near-uniform distribution");
    }
    
    const values = Object.values(vector);
    const max = Math.max(...values);
    
    // オーバーフロー防止のためのシフト
    const shifted = values.map(v => v - max);
    
    // 指数関数と正規化
    const expValues = shifted.map(v => Math.exp(v / temperature));
    const sumExp = expValues.reduce((a, b) => a + b, 0);
    
    const normalized = {};
    Object.keys(vector).forEach((key, i) => {
        normalized[key] = expValues[i] / sumExp;
    });
    
    return normalized;
}
```

### 5. 最終調整段階（Final Adjustment）
```javascript
// 最小値保証
const EPSILON = 1e-6;

function ensureMinimumValues(vector) {
    const adjusted = {};
    let needsRenormalization = false;
    
    Object.keys(vector).forEach(key => {
        if (vector[key] < EPSILON) {
            adjusted[key] = EPSILON;
            needsRenormalization = true;
        } else {
            adjusted[key] = vector[key];
        }
    });
    
    // 再正規化が必要な場合
    if (needsRenormalization) {
        const sum = Object.values(adjusted).reduce((a, b) => a + b, 0);
        Object.keys(adjusted).forEach(key => {
            adjusted[key] = adjusted[key] / sum;
        });
    }
    
    return adjusted;
}
```

---

## 完全な処理パイプライン

```javascript
class NormalizationPipeline {
    constructor(config) {
        this.config = {
            mode: 'softmax',           // 'softmax' | 'minmax' | 'zrelu'
            temperature: 1.2,          // Softmax温度パラメータ
            applyOSWeights: true,      // OS重み適用フラグ
            preferUniformOnFlat: true, // 平坦時の均等出力フラグ
            epsilon: 1e-6,            // 最小値保証
            flatnessThreshold: 1e-9,  // 平坦性判定閾値
            ...config
        };
    }
    
    process(rawVector, osType) {
        console.log("Step 1: Raw Input", rawVector);
        
        // Step 2: 前処理（平坦性チェック）
        if (this.checkFlatness(rawVector)) {
            console.log("Step 2: Flat input detected → Uniform output");
            return this.createUniformVector();
        }
        
        // Step 3: OS重み適用
        let processed = rawVector;
        if (this.config.applyOSWeights && osType) {
            processed = this.applyOSWeights(processed, osType);
            console.log("Step 3: OS Weights Applied", processed);
        }
        
        // Step 4: 正規化
        let normalized;
        switch (this.config.mode) {
            case 'softmax':
                normalized = this.softmaxNormalize(processed, this.config.temperature);
                break;
            case 'minmax':
                normalized = this.minMaxNormalize(processed);
                break;
            case 'zrelu':
                normalized = this.zReluNormalize(processed);
                break;
            default:
                throw new Error(`Unknown mode: ${this.config.mode}`);
        }
        console.log("Step 4: Normalized", normalized);
        
        // Step 5: 最終調整
        const final = this.ensureMinimumValues(normalized);
        console.log("Step 5: Final Output", final);
        
        return final;
    }
}
```

---

## 重要な設計決定

### 1. OS重みを正規化前に適用する理由
- **理由**: 正規化後に重みを適用すると、正規化の効果が歪む
- **例**: Softmax後の分布に重みを掛けると、合計が1.0から外れる
- **解決**: 重み適用 → 正規化の順序を厳守

### 2. 平坦性判定のε値
- **デフォルト**: 1e-9
- **意味**: 全値の最大差がこの値未満なら「平坦」と判定
- **調整**: ノイズの多いデータでは1e-6程度に緩和

### 3. Softmax温度パラメータ
- **推奨値**: τ = 1.2
- **効果**:
  - τ < 1.0: より鋭い分布（上位に集中）
  - τ = 1.0: 標準的なSoftmax
  - τ > 1.0: より平滑な分布（分散）
  - τ > 3.0: ほぼ均等分布

### 4. 最小値保証（ε）
- **値**: 1e-6
- **目的**: ゼロ除算防止、数値安定性確保
- **適用**: 最終段階でのみ適用

---

## テストケース

### ケース1: 通常の偏りのあるベクトル
```javascript
input: {乾: 100, 兌: 20, 離: 10, ...}
↓ OS重み適用 (engine)
{乾: 120, 兌: 18, 離: 11, ...}
↓ Softmax (τ=1.2)
{乾: 0.452, 兌: 0.083, 離: 0.051, ...}
↓ 最終調整
{乾: 0.452, 兌: 0.083, 離: 0.051, ...} // 変更なし
```

### ケース2: 平坦な入力
```javascript
input: {乾: 1, 兌: 1, 離: 1, ...}
↓ 平坦性検出
↓ 均等分布出力
{乾: 0.125, 兌: 0.125, 離: 0.125, ...}
```

### ケース3: スケーリング不変性
```javascript
input1: {乾: 10, 兌: 5, ...}
input2: {乾: 100, 兌: 50, ...}  // 10倍
↓ 処理後
output1 === output2  // 同一の結果
```

---

## バージョン管理

```javascript
const NORMALIZATION_CONFIG_VERSION = {
    version: "2.1.0",
    lastUpdated: "2025-01-11",
    changes: [
        {
            version: "2.1.0",
            date: "2025-01-11",
            description: "正規化適用順序の明文化"
        },
        {
            version: "2.0.0",
            date: "2025-01-10",
            description: "Softmax正規化導入"
        }
    ]
};
```

---

## 実装チェックリスト

- [ ] 平坦性チェック関数の実装
- [ ] εパラメータのバリデーション
- [ ] 温度パラメータの範囲チェック
- [ ] OS重み適用タイミングの確認
- [ ] 最小値保証の実装
- [ ] スケーリング不変性のテスト
- [ ] 処理ログの出力オプション

---

**この仕様に従って実装することで、一貫性のある正規化処理が保証されます。**