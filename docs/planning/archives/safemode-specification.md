# Safe Mode OS 変換仕様書

## 1. Safe Mode OSの質問構成（Q25-36）

### 質問項目と防御次元マッピング

```javascript
// Q25-36の質問から導出される8つの防御次元
const SAFEMODE_DIMENSIONS = {
    "防御_対抗性": {
        questions: [25, 29],  // 直接対抗・攻撃的防御
        description: "ストレス時に積極的に対抗する傾向"
    },
    "防御_調和性": {
        questions: [26, 30],  // 調和的解決・妥協
        description: "対立を和らげ調和を求める傾向"
    },
    "防御_変容性": {
        questions: [27, 31],  // 状況変換・リフレーミング
        description: "視点を変えて状況を再解釈する傾向"
    },
    "防御_堅固性": {
        questions: [28, 32],  // 立場堅持・防衛強化
        description: "自分の立場を守り抜く傾向"
    },
    "防御_回避性": {
        questions: [33],      // 問題回避・迂回
        description: "困難を避けて通る傾向"
    },
    "防御_持久性": {
        questions: [34],      // 忍耐・時間稼ぎ
        description: "耐え忍んで機会を待つ傾向"
    },
    "防御_境界性": {
        questions: [35],      // 境界設定・距離確保
        description: "明確な境界を設定する傾向"
    },
    "防御_撤退性": {
        questions: [36],      // 撤退・降伏
        description: "戦わずに退く傾向"
    }
};
```

## 2. buildSafemodeVector 実装

```javascript
buildStressResponseVector(defenseAnswers) {
    // 防御的8次元ベクトルの初期化
    const vector = {
        "防御_対抗性": 0,
        "防御_調和性": 0,
        "防御_変容性": 0,
        "防御_堅固性": 0,
        "防御_回避性": 0,
        "防御_持久性": 0,
        "防御_境界性": 0,
        "防御_撤退性": 0
    };
    
    // Q25-36の回答から各次元のスコアを集計
    defenseAnswers.forEach(answer => {
        const questionNum = answer.questionId;
        const score = answer.score || 0;
        
        // 質問番号から対応する防御次元を特定
        if ([25, 29].includes(questionNum)) {
            vector["防御_対抗性"] += score;
        }
        if ([26, 30].includes(questionNum)) {
            vector["防御_調和性"] += score;
        }
        if ([27, 31].includes(questionNum)) {
            vector["防御_変容性"] += score;
        }
        if ([28, 32].includes(questionNum)) {
            vector["防御_堅固性"] += score;
        }
        if (questionNum === 33) {
            vector["防御_回避性"] += score;
        }
        if (questionNum === 34) {
            vector["防御_持久性"] += score;
        }
        if (questionNum === 35) {
            vector["防御_境界性"] += score;
        }
        if (questionNum === 36) {
            vector["防御_撤退性"] += score;
        }
    });
    
    // 正規化（0-1範囲）
    const maxScore = Math.max(...Object.values(vector));
    if (maxScore > 0) {
        Object.keys(vector).forEach(key => {
            vector[key] = vector[key] / maxScore;
        });
    }
    
    return vector;
}
```

## 3. Safe Mode → 八卦マッピング行列

```javascript
const SAFEMODE_TO_BAGUA_MATRIX = {
    "防御_対抗性": {
        "乾": 0.7,  // 天の強い意志・リーダーシップ
        "震": 0.3   // 雷の瞬発的反応
    },
    "防御_調和性": {
        "兌": 0.8,  // 沢の喜び・調和
        "巽": 0.2   // 風の柔軟な適応
    },
    "防御_変容性": {
        "離": 0.7,  // 火の変革・明晰
        "坎": 0.3   // 水の流動性
    },
    "防御_堅固性": {
        "震": 0.6,  // 雷の強い反発
        "艮": 0.4   // 山の不動
    },
    "防御_回避性": {
        "巽": 0.8,  // 風の柔軟な回避
        "坤": 0.2   // 地の受動性
    },
    "防御_持久性": {
        "坎": 0.8,  // 水の忍耐・深さ
        "艮": 0.2   // 山の持続性
    },
    "防御_境界性": {
        "艮": 0.9,  // 山の明確な境界
        "乾": 0.1   // 天の威厳
    },
    "防御_撤退性": {
        "坤": 0.8,  // 地の受容・降伏
        "巽": 0.2   // 風の退避
    }
};
```

## 4. 変換処理の実装

```javascript
calculateDefensiveBaguaEnergies(stressVector) {
    // 八卦エネルギー初期化
    const baguaEnergies = {
        "乾": 0, "兌": 0, "離": 0, "震": 0,
        "巽": 0, "坎": 0, "艮": 0, "坤": 0
    };
    
    // マッピング行列を適用
    Object.entries(stressVector).forEach(([dimension, value]) => {
        const mapping = SAFEMODE_TO_BAGUA_MATRIX[dimension];
        if (mapping) {
            Object.entries(mapping).forEach(([bagua, weight]) => {
                baguaEnergies[bagua] += value * weight;
            });
        }
    });
    
    console.log("🛡️ Safe Mode → 八卦変換完了:", baguaEnergies);
    return baguaEnergies;
}
```

## 5. マッピング理論的根拠

### 防御次元と八卦の対応理由

| 防御次元 | 主要八卦 | 副次八卦 | 理論的根拠 |
|----------|----------|----------|------------|
| 対抗性 | 乾(0.7) | 震(0.3) | 乾は天の強さ、震は雷の即応性 |
| 調和性 | 兌(0.8) | 巽(0.2) | 兌は和やかな交流、巽は柔軟な順応 |
| 変容性 | 離(0.7) | 坎(0.3) | 離は変革の火、坎は流動的適応 |
| 堅固性 | 震(0.6) | 艮(0.4) | 震は強い反発、艮は不動の山 |
| 回避性 | 巽(0.8) | 坤(0.2) | 巽は風の回避、坤は受動的退避 |
| 持久性 | 坎(0.8) | 艮(0.2) | 坎は水の忍耐、艮は山の持続 |
| 境界性 | 艮(0.9) | 乾(0.1) | 艮は明確な境界、乾は威厳的距離 |
| 撤退性 | 坤(0.8) | 巽(0.2) | 坤は受容的降伏、巽は柔軟な退避 |

### 重み付けの設計原理

1. **主要八卦（0.6-0.9）**: その防御特性を最もよく表現する八卦
2. **副次八卦（0.1-0.4）**: 補完的または関連する特性を持つ八卦
3. **合計1.0**: 各防御次元の重みは必ず1.0に正規化

## 6. 検証テストケース

```javascript
// テストケース1: 対抗型防御
const confrontationalDefense = {
    "防御_対抗性": 1.0,
    "防御_調和性": 0.1,
    "防御_変容性": 0.2,
    "防御_堅固性": 0.8,
    "防御_回避性": 0.0,
    "防御_持久性": 0.3,
    "防御_境界性": 0.5,
    "防御_撤退性": 0.0
};
// 期待: 乾と震が高い

// テストケース2: 回避型防御
const avoidantDefense = {
    "防御_対抗性": 0.0,
    "防御_調和性": 0.6,
    "防御_変容性": 0.3,
    "防御_堅固性": 0.1,
    "防御_回避性": 1.0,
    "防御_持久性": 0.4,
    "防御_境界性": 0.2,
    "防御_撤退性": 0.7
};
// 期待: 巽と坤が高い

// テストケース3: 境界型防御
const boundaryDefense = {
    "防御_対抗性": 0.3,
    "防御_調和性": 0.2,
    "防御_変容性": 0.1,
    "防御_堅固性": 0.6,
    "防御_回避性": 0.2,
    "防御_持久性": 0.5,
    "防御_境界性": 1.0,
    "防御_撤退性": 0.1
};
// 期待: 艮が圧倒的に高い
```

## 7. 実装統合チェックリスト

- [x] 防御次元の定義（8次元）
- [x] 質問番号との対応関係
- [x] buildStressResponseVector の実装
- [x] SAFEMODE_TO_BAGUA_MATRIX の定義
- [x] calculateDefensiveBaguaEnergies の実装
- [x] 理論的根拠の文書化
- [x] テストケースの準備

## 8. 改善後の期待効果

1. **透明性**: Safe Mode OSの変換プロセスが明確
2. **一貫性**: Interface OSと同じマッピング方式
3. **検証可能性**: 入力→出力の変換が追跡可能
4. **調整可能性**: マッピング係数の調整で精度向上可能

---

この仕様により、Safe Mode OSも他のOSと同様に、透明で検証可能な方法で八卦次元に変換されます。