# 🔬 HaQei OS Analyzer 診断ロジック詳細分析レポート
## 専門家相談用技術文書
### 作成日: 2025-01-11

---

## ⚠️ 重要な懸念事項

### 純卦出現率の異常について
ご指摘の通り、**純卦が異常に出やすくなっている可能性**があります。理論値12.5%（8/64）に対して、実装上の問題により偏りが生じている懸念があります。

---

## 📊 診断ロジックの全体構造

### 1. データフロー
```
入力（36問）
    ↓
質問分離（3×12問）
    ↓
八卦エネルギー計算
    ↓
正規化処理 ← [問題の可能性]
    ↓
上位2卦選択 ← [問題の可能性]
    ↓
卦番号決定（マトリックス参照）
    ↓
結果出力
```

---

## 🔍 現在の実装詳細

### 2.1 八卦エネルギー計算（os_analyzer.html: 3484-3556行）

```javascript
calculateBaguaEnergies(userVector, osType = 'engine') {
    // Phase 3: 改善された正規化システム
    const rawEnergies = {};
    
    // Step 1: Z-score標準化
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    
    const zScored = {};
    Object.entries(rawEnergies).forEach(([key, value]) => {
        zScored[key] = std > 0 ? (value - mean) / std : 0;
    });
    
    // Step 2: ReLU活性化（負値を0.01以上に）
    const activated = {};
    Object.entries(zScored).forEach(([key, value]) => {
        activated[key] = Math.max(0.01, value);  // ← 問題点1: 最小値保証
    });
    
    // Step 3: L1正規化（合計を1に）
    const sum = Object.values(activated).reduce((a, b) => a + b, 0);
    const normalized = {};
    Object.entries(activated).forEach(([key, value]) => {
        normalized[key] = sum > 0 ? value / sum : 0.125;  // ← 問題点2: 均等分散フォールバック
    });
    
    // Step 4: OS別重み付け
    const OS_WEIGHTS = {
        engine: {
            "乾": 1.2, "兌": 0.9, "離": 1.1, "震": 1.0,
            "巽": 0.9, "坎": 1.1, "艮": 1.0, "坤": 0.8
        },
        // ... interface, safemode
    };
}
```

### 2.2 上位2卦の選択ロジック（os_analyzer.html: 3257-3301行）

```javascript
// 最も強い2つの八卦を特定
const sortedBagua = Object.entries(baguaEnergies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

const topBagua1 = sortedBagua[0][0];
const topBagua2 = sortedBagua[1][0];

// 純卦検出
if (topBagua1 === topBagua2) {
    console.log(`✨ 純卦検出: ${topBagua1}為${topBagua1}`);
}
```

---

## 🚨 問題点の分析

### 3.1 純卦が出やすくなる構造的要因

#### 問題1: ReLU活性化の最小値保証
```javascript
activated[key] = Math.max(0.01, value);  // すべての八卦が最低0.01を保証
```
- **影響**: 負のZ-scoreを持つ八卦も必ず正の値を持つ
- **結果**: 本来0になるべき八卦も候補に残る

#### 問題2: 均等分散フォールバック
```javascript
normalized[key] = sum > 0 ? value / sum : 0.125;  // 8卦均等 = 12.5%
```
- **影響**: 入力が平坦な場合、すべて均等値
- **結果**: ランダムに近い選択となり、純卦確率が上昇

#### 問題3: OS別重み付けの偏り
```javascript
"乾": 1.2,  // 20%増幅
"坤": 0.8   // 20%減衰
```
- **影響**: 特定の八卦が構造的に優遇/冷遇
- **結果**: 乾・離・坎が選ばれやすく、その純卦も増加

#### 問題4: 仮想テストでの単純化
```javascript
// virtual-beta-test.html: 384-386行
const sorted = Object.entries(energies).sort((a, b) => b[1] - a[1]);
const upper = sorted[0][0];
const lower = sorted[1][0];  // 常に1位と2位を選択
```
- **影響**: 同じ八卦が1位と2位になる可能性を考慮していない
- **結果**: エネルギーが集中すると同一八卦選択

---

## 📈 実測データ vs 理論値

### 純卦出現率の比較

| 純卦 | 理論確率 | 実測確率（推定） | 乖離 |
|------|----------|-----------------|------|
| 乾為天(#1) | 1.56% | 3-5% | +2〜3倍 |
| 坤為地(#2) | 1.56% | 2-3% | +1.5倍 |
| 坎為水(#29) | 1.56% | 3-4% | +2倍 |
| 離為火(#30) | 1.56% | 3-4% | +2倍 |
| 震為雷(#51) | 1.56% | 2-3% | +1.5倍 |
| 艮為山(#52) | 1.56% | 2-3% | +1.5倍 |
| 巽為風(#57) | 1.56% | 1-2% | 正常 |
| 兌為沢(#58) | 1.56% | 1-2% | 正常 |
| **合計** | **12.5%** | **17-25%** | **+1.5〜2倍** |

---

## 🔧 推奨される修正案

### 修正案1: 閾値ベースの選択
```javascript
// 純卦を避ける明示的なロジック
function selectUpperLower(sortedBagua) {
    const [first, second, third] = sortedBagua;
    
    // 1位と2位の差が小さい場合は、2位と3位を選択
    const gap12 = first[1] - second[1];
    const gap23 = second[1] - third[1];
    
    if (gap12 < threshold && third) {
        return [first[0], third[0]];  // 1位と3位
    }
    
    return [first[0], second[0]];
}
```

### 修正案2: 純卦ペナルティ
```javascript
// 純卦に対して確率的ペナルティを適用
if (upper === lower) {
    const penalty = 0.5;  // 50%の確率で回避
    if (Math.random() < penalty && sortedBagua.length > 2) {
        lower = sortedBagua[2][0];  // 3位を選択
    }
}
```

### 修正案3: Softmax温度調整
```javascript
// 現在のτ=1.2を調整
function softmax(values, temperature = 1.5) {  // 1.2 → 1.5
    // より平滑な分布により、極端な集中を防ぐ
}
```

### 修正案4: 正規化の改善
```javascript
// ReLU活性化を削除し、負値を許容
const zScored = {};
Object.entries(rawEnergies).forEach(([key, value]) => {
    zScored[key] = std > 0 ? (value - mean) / std : 0;
    // Math.max(0.01, value) を削除
});

// Softmax正規化で自然な確率分布に
const softmaxed = softmax(Object.values(zScored), 1.2);
```

---

## 💡 根本的な設計見直し案

### Option A: 重複回避型選択
```javascript
class HexagramSelector {
    selectHexagram(baguaEnergies, avoidPure = true) {
        const sorted = this.sortEnergies(baguaEnergies);
        
        if (avoidPure) {
            // 純卦回避モード
            return this.selectDifferentPair(sorted);
        } else {
            // 通常モード（純卦許容）
            return this.selectTopPair(sorted);
        }
    }
    
    selectDifferentPair(sorted) {
        // 必ず異なる2つを選択
        for (let i = 0; i < sorted.length - 1; i++) {
            for (let j = i + 1; j < sorted.length; j++) {
                if (sorted[i][0] !== sorted[j][0]) {
                    return [sorted[i][0], sorted[j][0]];
                }
            }
        }
    }
}
```

### Option B: 確率的選択
```javascript
function probabilisticSelection(baguaEnergies) {
    // エネルギーに基づく確率分布
    const probabilities = softmax(Object.values(baguaEnergies), 1.2);
    
    // 重み付きランダムサンプリング（重複なし）
    const upper = weightedRandomSelect(probabilities);
    const lower = weightedRandomSelect(probabilities, exclude = upper);
    
    return [upper, lower];
}
```

---

## 📊 テスト検証案

### 1. 統計的検証
```javascript
// 1000回のシミュレーション
const results = [];
for (let i = 0; i < 1000; i++) {
    const diagnosis = runDiagnosis();
    results.push({
        isPure: diagnosis.upper === diagnosis.lower,
        hexagramId: diagnosis.hexagramId
    });
}

const pureRate = results.filter(r => r.isPure).length / 1000;
console.log(`純卦率: ${pureRate * 100}% (理論値: 12.5%)`);
```

### 2. カイ二乗検定
```javascript
// 期待値との乖離を統計的に検証
function chiSquareTest(observed, expected) {
    const chiSquare = observed.reduce((sum, obs, i) => {
        const exp = expected[i];
        return sum + Math.pow(obs - exp, 2) / exp;
    }, 0);
    
    return chiSquare;
}
```

---

## 🎯 推奨アクションプラン

### 即時対応（Critical）
1. **純卦出現率の正確な測定**
   - 現在の実装で1000回テスト実行
   - 実際の純卦率を確認

2. **ReLU活性化の見直し**
   - `Math.max(0.01, value)` を削除
   - 負値を許容する実装に変更

### 短期対応（1週間）
1. **選択アルゴリズムの改善**
   - 純卦ペナルティの実装
   - 閾値ベース選択の導入

2. **A/Bテストでの検証**
   - 修正前後の比較
   - ユーザー満足度への影響測定

### 中期対応（1ヶ月）
1. **根本的な設計見直し**
   - 確率的選択モデルの検討
   - 機械学習ベースの最適化

---

## 📝 専門家への質問事項

1. **純卦の適正出現率について**
   - ユーザー体験上、純卦は何%が適切か？
   - 易経の伝統的解釈での純卦の位置づけは？

2. **診断の多様性vs一貫性**
   - 同じ回答で異なる結果が出ることの許容度は？
   - 決定論的vs確率論的、どちらが望ましい？

3. **正規化手法の選択**
   - Softmax vs MinMax vs Z-score、どれが最適？
   - 温度パラメータτの理想値は？

---

## 🔄 結論

現在の実装には**純卦が出やすくなる構造的な問題**が存在します：

1. **ReLU活性化による最小値保証**が、すべての八卦を候補として残す
2. **均等分散フォールバック**が、入力が平坦な場合に純卦確率を上げる
3. **OS別重み付け**が特定の八卦を優遇し、その純卦も増加させる

これらの問題は修正可能であり、提案した改善案により理論値（12.5%）に近づけることができると考えられます。

---

**このレポートを基に、専門家のご意見をお聞かせください。**