## 診断ロジック改善設計書 - 2025-08-11

### 🎯 改善方針

#### 1. 用語統一と純卦の扱い

##### 問題点
- 「三爻」という誤った用語使用（正しくは「八卦」）
- 純卦（同一八卦の重複）を排除してしまい、64卦中8卦が出現不可能

##### 改善案
```javascript
// 修正前
const topTrigram1 = sortedTrigrams[0][0];  // 誤：三爻
if (topTrigram1 === topTrigram2) {
    topTrigram2 = sortedTrigrams[2][0];  // 純卦を回避
}

// 修正後
const topBagua1 = sortedBagua[0][0];  // 正：八卦
const topBagua2 = sortedBagua[1] ? sortedBagua[1][0] : topBagua1;  // 純卦を許容
```

#### 2. 8次元の同形化

##### 問題点
- Engine OS: 八卦次元（乾、兌、離、震、巽、坎、艮、坤）
- Interface OS: 外向/内向×特性次元（非八卦）
- Safe Mode OS: 防御型次元（非八卦）

##### 改善案：統一マッピング行列
```javascript
// Interface OS用マッピング（因子→八卦）
const INTERFACE_TO_BAGUA_MAPPING = {
    "外向_主導性": { "乾": 0.8, "震": 0.2 },  // 乾（天）に主にマップ
    "外向_調和性": { "兌": 0.9, "離": 0.1 },  // 兌（沢）に主にマップ
    "外向_表現性": { "離": 0.8, "兌": 0.2 },  // 離（火）に主にマップ
    "外向_行動性": { "震": 0.9, "乾": 0.1 },  // 震（雷）に主にマップ
    "内向_適応性": { "巽": 0.9, "坤": 0.1 },  // 巽（風）に主にマップ
    "内向_分析性": { "坎": 0.9, "艮": 0.1 },  // 坎（水）に主にマップ
    "内向_安定性": { "艮": 0.9, "坤": 0.1 },  // 艮（山）に主にマップ
    "内向_支援性": { "坤": 0.9, "巽": 0.1 }   // 坤（地）に主にマップ
};

// Safe Mode OS用マッピング（防御型→八卦）
const SAFEMODE_TO_BAGUA_MAPPING = {
    "防御_対抗性": { "乾": 0.7, "震": 0.3 },  // 積極的対抗
    "防御_調和性": { "兌": 0.8, "巽": 0.2 },  // 調和的解決
    "防御_変容性": { "離": 0.7, "坎": 0.3 },  // 変化と適応
    "防御_堅固性": { "震": 0.6, "艮": 0.4 },  // 瞬発的防御
    "防御_回避性": { "巽": 0.8, "坤": 0.2 },  // 柔軟な回避
    "防御_持久性": { "坎": 0.8, "艮": 0.2 },  // 忍耐と持久
    "防御_境界性": { "艮": 0.9, "乾": 0.1 },  // 境界設定
    "防御_撤退性": { "坤": 0.8, "巽": 0.2 }   // 受動的撤退
};
```

#### 3. 正規化と重み付けの明確化

##### 改善案：標準化プロセス
```javascript
function normalizeVector(vector, osType) {
    // Step 1: Z-score標準化
    const values = Object.values(vector);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    
    // Step 2: 標準化
    const zScored = {};
    Object.entries(vector).forEach(([key, value]) => {
        zScored[key] = std > 0 ? (value - mean) / std : 0;
    });
    
    // Step 3: ReLU（負値を0に）
    const nonNegative = {};
    Object.entries(zScored).forEach(([key, value]) => {
        nonNegative[key] = Math.max(0, value);
    });
    
    // Step 4: L1正規化（合計を1に）
    const sum = Object.values(nonNegative).reduce((a, b) => a + b, 0);
    const normalized = {};
    Object.entries(nonNegative).forEach(([key, value]) => {
        normalized[key] = sum > 0 ? value / sum : 0.125;  // 均等分布
    });
    
    // Step 5: OS別重み適用
    const weighted = {};
    const weights = getOSWeights(osType);
    Object.entries(normalized).forEach(([key, value]) => {
        weighted[key] = value * (weights[key] || 1.0);
    });
    
    return weighted;
}
```

#### 4. キーワード適合の中立化

##### 問題点
- 特定の価値判断（「外交・社交」を低評価）
- OSごとに異なる肯定/否定の非対称性

##### 改善案：中立的語彙カテゴリ
```javascript
const NEUTRAL_KEYWORD_CATEGORIES = {
    // 価値中立的なカテゴリ
    "行動性": ["行動", "実行", "活動", "動作", "実践"],
    "思考性": ["思考", "分析", "検討", "考察", "理解"],
    "感情性": ["感情", "共感", "感受", "情緒", "感覚"],
    "社会性": ["社会", "関係", "交流", "協力", "連携"],
    "個人性": ["個人", "内省", "独立", "自己", "内面"],
    "安定性": ["安定", "持続", "維持", "継続", "保持"],
    "変化性": ["変化", "革新", "創造", "発展", "成長"],
    "調和性": ["調和", "均衡", "バランス", "中庸", "統合"]
};

// OS別の重み（カテゴリレベル）
const OS_CATEGORY_WEIGHTS = {
    engine: {
        "思考性": 1.2, "個人性": 1.2, "変化性": 1.1,
        "行動性": 1.0, "感情性": 0.9, "社会性": 0.8,
        "安定性": 1.0, "調和性": 0.9
    },
    interface: {
        "社会性": 1.3, "調和性": 1.2, "感情性": 1.1,
        "行動性": 1.0, "思考性": 0.9, "個人性": 0.7,
        "安定性": 0.9, "変化性": 0.9
    },
    safemode: {
        "安定性": 1.3, "調和性": 1.1, "個人性": 1.0,
        "思考性": 1.0, "感情性": 0.9, "社会性": 0.8,
        "行動性": 0.8, "変化性": 0.7
    }
};
```

#### 5. 決定確信度の実装

##### 改善案：確信度スコアと補助判定
```javascript
function selectBaguaWithConfidence(sortedBagua, osType) {
    const top1 = sortedBagua[0];
    const top2 = sortedBagua[1] || sortedBagua[0];
    const top3 = sortedBagua[2];
    
    // 確信度計算
    const gap12 = top1[1] - (top2[1] || 0);
    const totalEnergy = sortedBagua.reduce((sum, [_, energy]) => sum + energy, 0);
    const confidence = gap12 / totalEnergy;
    
    // 高確信度（差が大きい）
    if (confidence > 0.2) {
        return {
            upper: top1[0],
            lower: top2[0],
            confidence: "high",
            score: confidence
        };
    }
    
    // 中確信度（差が中程度）
    if (confidence > 0.1) {
        return {
            upper: top1[0],
            lower: top2[0],
            confidence: "medium",
            score: confidence
        };
    }
    
    // 低確信度（僅差）- 補助判定
    if (top3) {
        // top1-top3の組み合わせも検討
        const alternative = {
            upper: top1[0],
            lower: top3[0],
            confidence: "low",
            score: confidence,
            alternative: true
        };
        
        // キーワード適合度で最終判定
        return selectByKeywordFitness([
            { upper: top1[0], lower: top2[0] },
            { upper: top1[0], lower: top3[0] },
            { upper: top2[0], lower: top3[0] }
        ], osType);
    }
    
    // フォールバック（重心法）
    return calculateCentroidHexagram(sortedBagua, osType);
}
```

#### 6. データ粒度の統一（H64に一本化）

##### 改善案
```javascript
// H64_DATA: 64卦レベルのデータ
const H64_DATA = {
    1: {
        id: 1,
        name: "乾為天",
        upper: "乾",
        lower: "乾",
        keywords: ["創造", "力強さ", "主導性", "純粋な陽"],
        categories: {
            "行動性": 0.9,
            "思考性": 0.7,
            "変化性": 0.8,
            "個人性": 0.6
        }
    },
    // ... 64卦すべて
};

// オプション：動爻データ（将来拡張用）
const H384_LINES = {
    "1_1": "初九：潜龍勿用",  // 卦1の第1爻
    "1_2": "九二：見龍在田",  // 卦1の第2爻
    // ... 384爻すべて
};
```

### 📊 検証計画

#### 1. 網羅性テスト
```javascript
function testAllHexagramsCoverage() {
    const appeared = new Set();
    
    // ランダムベクトルで1000回テスト
    for (let i = 0; i < 1000; i++) {
        const randomVector = generateRandomBaguaVector();
        const result = selectHexagram(randomVector, 'engine');
        appeared.add(result.hexagramId);
    }
    
    // 全64卦が出現可能か
    return {
        coverage: appeared.size / 64,
        missing: Array.from({length: 64}, (_, i) => i + 1)
            .filter(id => !appeared.has(id))
    };
}
```

#### 2. 信頼性テスト
```javascript
function testReliability() {
    const testCases = generateTestCases(100);
    const results = [];
    
    testCases.forEach(testCase => {
        // 同じ入力で3回実行
        const result1 = analyzeOS(testCase);
        const result2 = analyzeOS(testCase);
        const result3 = analyzeOS(testCase);
        
        // 一致率を計算
        const consistent = (
            result1.hexagramId === result2.hexagramId &&
            result2.hexagramId === result3.hexagramId
        );
        
        results.push(consistent);
    });
    
    return {
        consistency: results.filter(r => r).length / results.length,
        cronbachAlpha: calculateCronbachAlpha(testCases)
    };
}
```

### 🔄 実装優先順位

1. **Phase 1**: 用語統一と純卦許容（即座に修正可能）
2. **Phase 2**: 8次元同形化（マッピング行列実装）
3. **Phase 3**: 正規化プロセス明確化
4. **Phase 4**: キーワード中立化
5. **Phase 5**: 確信度と検証機能

この設計に基づいて実装を進めます。