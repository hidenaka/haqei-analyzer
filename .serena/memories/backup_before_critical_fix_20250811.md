## 重要修正前のバックアップ - 2025-08-11

### 修正前の問題のある実装

#### 1. Interface OS質問範囲の誤り
```javascript
// analyzeInterfaceOS内のanalyzeSocialPatterns
analyzeSocialPatterns(scenarioAnswers) {
    scenarioAnswers.forEach((answer, index) => {
        const questionId = `Q${25 + index}`;  // Q25-Q30を使用（誤り）
        // 本来はQ13-Q24を使うべき
    });
}
```

#### 2. キーワード重複加点
```javascript
calculateKeywordFitness(keywords, osType, trigramScores) {
    keywords.forEach(keyword => {
        let matched = false;  // このフラグが正しく使われていない
        
        for (const pattern of patterns.high) {
            if (keyword.includes(pattern)) {
                score += 3;
                matched = true;
                break;
            }
        }
        
        if (!matched) {  // この条件分岐がない
            for (const pattern of patterns.medium) {
                // 結果として重複加点される
            }
        }
    });
}
```

#### 3. 三爻重複時の処理なし
```javascript
const topTrigram2 = sortedTrigrams[1] ? sortedTrigrams[1][0] : sortedTrigrams[0][0];
// 2位がない場合1位を使う → 同じ卦になる
```

#### 4. 64卦マトリックス未使用
```javascript
const hexagramId = ((upperTrigramId - 1) * 8) + lowerTrigramId;
// 単純計算で、定義済みマトリックスを使っていない
```

### これから実施する修正
1. Interface OSをQ13-Q24に修正
2. キーワード重複加点を防止
3. 三爻重複時の処理を追加
4. 64卦マトリックスを適用
5. 全体の動作検証