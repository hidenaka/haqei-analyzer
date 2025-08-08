# HAQEI 64卦正統的マッピング方法設計

## 📊 現状マッピングの分析

### 現在の実装:
```javascript
// Engine OS最強2つの八卦から上卦・下卦を決定
const upperTrigram = sortedTrigrams[0][0];
const lowerTrigram = sortedTrigrams[1][0];
const hexagramId = this.mapTrigramsToHexagram(upperTrigram, lowerTrigram);
```

### 現状の問題点:
1. **Engine OSのみ**: Interface OS、Safe Mode OSが無視される
2. **静的マッピング**: 変爻・動爻の概念がない
3. **三才思想無視**: 天・人・地の統合性が欠如
4. **序卦伝無視**: 64卦の論理的変遷が未実装

## 🌟 易経専門家による正統的マッピング設計

### 1. **三才統合マッピング（主卦決定）**

#### **新マッピング原理**:
```javascript
function calculateOrthodoxtHexagram(engineOS, interfaceOS, safeModeOS) {
    // 1. 天才（上卦）= Engine OS + Interface OS統合
    const upperTrigramScore = {};
    Object.keys(TRIGRAMS).forEach(trigram => {
        upperTrigramScore[trigram] = 
            (engineOS.trigramEnergies[trigram] * 0.7) + 
            (interfaceOS.trigramEnergies[trigram] * 0.3);
    });
    
    // 2. 地才（下卦）= Interface OS + Safe Mode OS統合  
    const lowerTrigramScore = {};
    Object.keys(TRIGRAMS).forEach(trigram => {
        lowerTrigramScore[trigram] = 
            (interfaceOS.trigramEnergies[trigram] * 0.6) +
            (safeModeOS.trigramEnergies[trigram] * 0.4);
    });
    
    // 3. 最強八卦を上卦・下卦として選定
    const upperTrigram = getStrongestTrigram(upperTrigramScore);
    const lowerTrigram = getStrongestTrigram(lowerTrigramScore);
    
    return {
        upperTrigram,
        lowerTrigram, 
        primaryHexagram: mapTrigramsToHexagram(upperTrigram, lowerTrigram)
    };
}
```

### 2. **変爻システム（動的変化の実装）**

#### **変爻判定原理**:
易経では、陰爻・陽爻が変化する「変爻」により卦が変化します。

```javascript
function calculateChangingLines(engineOS, interfaceOS, safeModeOS) {
    const changingLines = [];
    
    // 各爻位(1-6)での変化圧力を計算
    for (let position = 1; position <= 6; position++) {
        const changePressure = calculateLinePressure(
            position, 
            engineOS, 
            interfaceOS, 
            safeModeOS
        );
        
        // 変化閾値（75%以上で変爻認定）
        if (changePressure > 0.75) {
            changingLines.push({
                position,
                pressure: changePressure,
                type: position <= 3 ? '下卦変化' : '上卦変化'
            });
        }
    }
    
    return changingLines;
}

function calculateLinePressure(position, engineOS, interfaceOS, safeModeOS) {
    // 爻位別の変化圧力計算
    const lineInfluences = {
        1: safeModeOS.stability * 0.8,      // 初爻：基礎安定性
        2: interfaceOS.adaptability * 0.7,  // 二爻：社会適応性
        3: engineOS.creativity * 0.6,       // 三爻：創造志向
        4: interfaceOS.harmony * 0.6,       // 四爻：調和力
        5: engineOS.leadership * 0.7,       // 五爻：リーダーシップ  
        6: engineOS.vision * 0.8            // 上爻：ビジョン
    };
    
    return Math.min(1.0, lineInfluences[position]);
}
```

### 3. **序卦伝システム（成長道筋の表示）**

#### **64卦成長パターン**:
易経の序卦伝に基づく論理的な卦の変遷を実装

```javascript
const HEXAGRAM_PROGRESSION = {
    // 乾坤始まりの基本群（創世記）
    group1: [1, 2, 3, 4, 5, 6, 7, 8],      // 乾→坤→屯→蒙→需→訟→師→比
    
    // 小畜大畜群（蓄積・成長期）
    group2: [9, 10, 11, 12, 13, 14, 15, 16], // 小畜→履→泰→否→同人→大有→謙→豫
    
    // 随蛊群（変化・改革期）
    group3: [17, 18, 19, 20, 21, 22, 23, 24], // 随→蛊→臨→観→噬嗑→賁→剥→復
    
    // 無妄大畜群（純化・発展期）
    group4: [25, 26, 27, 28, 29, 30, 31, 32], // 無妄→大畜→頤→大過→坎→離→咸→恒
    
    // 遯大壮群（転換・拡大期）
    group5: [33, 34, 35, 36, 37, 38, 39, 40], // 遯→大壮→晋→明夷→家人→睽→蹇→解
    
    // 損益群（調整・改善期）
    group6: [41, 42, 43, 44, 45, 46, 47, 48], // 損→益→夬→姤→萃→升→困→井
    
    // 革鼎群（革新・安定期）
    group7: [49, 50, 51, 52, 53, 54, 55, 56], // 革→鼎→震→艮→漸→帰妹→豊→旅
    
    // 巽兌群（深化・完成期）
    group8: [57, 58, 59, 60, 61, 62, 63, 64]  // 巽→兌→渙→節→中孚→小過→既済→未済
};

function calculateGrowthPath(currentHexagram, tripleOSBalance) {
    const currentGroup = findHexagramGroup(currentHexagram);
    const balanceType = analyzeBalanceType(tripleOSBalance);
    
    // バランスタイプに応じた成長方向の決定
    const growthDirection = {
        'engine_dominant': 'expansion',     // 拡大・発展
        'interface_dominant': 'harmony',    // 調和・統合
        'safemode_dominant': 'stabilization', // 安定・保持
        'balanced': 'natural_progression'   // 自然な進展
    };
    
    return suggestNextHexagrams(
        currentGroup, 
        growthDirection[balanceType]
    );
}
```

### 4. **多層マッピングシステム**

#### **3層の卦表示**:

```javascript
function generateMultiLayerMapping(engineOS, interfaceOS, safeModeOS) {
    // Layer 1: 主卦（現在の人格状態）
    const primaryHexagram = calculateOrthodoxtHexagram(
        engineOS, interfaceOS, safeModeOS
    );
    
    // Layer 2: 之卦（変化後の状態）- 変爻がある場合
    const changingLines = calculateChangingLines(
        engineOS, interfaceOS, safeModeOS
    );
    const secondaryHexagram = changingLines.length > 0 ? 
        applyChangingLines(primaryHexagram, changingLines) : null;
    
    // Layer 3: 成長卦（推奨される発展方向）
    const growthPath = calculateGrowthPath(
        primaryHexagram, 
        { engineOS, interfaceOS, safeModeOS }
    );
    
    return {
        primary: {
            hexagram: primaryHexagram,
            meaning: '現在のあなたの人格状態',
            description: getHexagramDescription(primaryHexagram)
        },
        secondary: secondaryHexagram ? {
            hexagram: secondaryHexagram,
            meaning: 'あなたの内にある変化の兆し',
            description: getHexagramDescription(secondaryHexagram),
            changingLines: changingLines
        } : null,
        growth: {
            hexagrams: growthPath,
            meaning: 'あなたにお薦めする成長の方向性',
            description: getGrowthDescription(growthPath)
        }
    };
}
```

### 5. **Triple OS与 64卦の統合マップ**

#### **Engine OS主導型の卦群**:
```javascript
const ENGINE_DOMINANT_HEXAGRAMS = [
    1,   // 乾為天（純粋創造）
    11,  // 地天泰（創造的調和）
    25,  // 天雷無妄（純粋意志）
    34,  // 雷天大壮（行動力拡大）
    43,  // 沢天夬（決断突破）
];
```

#### **Interface OS主導型の卦群**:
```javascript
const INTERFACE_DOMINANT_HEXAGRAMS = [
    13,  // 天火同人（社会調和）
    22,  // 山火賁（美的表現）
    37,  // 風火家人（家庭円満）
    49,  // 沢火革（社会変革）
    61,  // 風沢中孚（誠実交流）
];
```

#### **Safe Mode OS主導型の卦群**:
```javascript
const SAFEMODE_DOMINANT_HEXAGRAMS = [
    2,   // 坤為地（受容安定）
    15,  // 地山謙（謙虚な安定）
    20,  // 風地観（冷静観察）
    46,  // 地風升（着実上昇）
    52,  // 艮為山（静止安定）
];
```

## 🎯 実装効果

### 診断深度の向上:
- **現在**: 単一卦による平面的診断
- **改良後**: 3層卦による立体的・動的診断

### 易経的正統性:
- 変爻システムの導入による動的変化の表現
- 序卦伝による成長道筋の具体的提示
- 三才思想の完全統合

### ユーザー価値:
- より深い自己理解
- 具体的な成長方向の提示  
- 易経の智慧の実践的活用

記録者: I Ching Expert Agent
設計日時: 2025年08月08日