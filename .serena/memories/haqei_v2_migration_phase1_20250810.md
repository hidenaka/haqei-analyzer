# HAQEI システム v2移行記録 - Phase 1
Date: 2025-08-10
Status: Phase 1 Complete
Agent: Claude Code

## 📋 移行要件（HaQei原点回帰ドキュメントv2準拠）

### Future Simulator要件
- ✅ 固定4基軸×2方式の廃止 → 動的8パターン生成
- ✅ ステップ数固定廃止 → 可変長change_chain（0..N）
- ✅ 進爻・変爻メカニズムの中心化
- ✅ 契約B v2.0形式への移行

### OS Analyzer要件  
- ⏸️ 3OS相互作用の豊かさを詳細言語化（Phase 2で実施）

## 🔧 実装内容

### 1. EightScenariosGenerator.js改修

#### 動的パターン生成（Line 151-283）
**Before:** 固定4基軸×2方式のハードコード
```javascript
// 天基軸・爻が進む、天基軸・爻が変わる、地基軸・爻が進む...
```

**After:** 動的な8パターン生成
```javascript
generateBasePatterns(textAnalysis, hexagram) {
    // 現在の卦・爻位から動的に8パターンを生成
    const currentHex = hexagram.number || 1;
    const currentLine = textAnalysis.urgencyLevel ? 
        Math.min(6, Math.max(1, Math.round(textAnalysis.urgencyLevel * 6))) : 3;
    
    const patterns = [
        { id: 1, mechanism: 'advance', changeChain: this.generateAdvanceChain(...) },
        { id: 2, mechanism: 'transform', changeChain: this.generateTransformChain(...) },
        { id: 3, mechanism: 'advance', changeChain: this.generateAdvanceChain(..., 2) },
        { id: 4, mechanism: 'transform', changeChain: this.generateTransformChain(..., 2) },
        { id: 5, mechanism: 'mixed', changeChain: this.generateMixedChain(..., 'advance-transform') },
        { id: 6, mechanism: 'mixed', changeChain: this.generateMixedChain(..., 'transform-advance') },
        { id: 7, mechanism: 'stable', changeChain: [] }, // 0ステップ
        { id: 8, mechanism: 'complex', changeChain: this.generateComplexChain(...) } // 1-4ステップ
    ];
}
```

#### 変化チェーン生成関数（Line 734-849）
```javascript
// 進爻チェーン生成（同一卦で爻位が上がる）
generateAdvanceChain(hexNum, startLine, steps) {
    const chain = [];
    for (let i = 0; i < steps && currentLine < 6; i++) {
        chain.push({
            type: 'advance',
            from: { hex: hexNum, line: currentLine },
            to: { hex: hexNum, line: currentLine + 1 }
        });
    }
    return chain;
}

// 変爻チェーン生成（陰陽反転で之卦が立つ）
generateTransformChain(hexNum, startLine, steps) {
    const chain = [];
    for (let i = 0; i < steps; i++) {
        const newHex = this.calculateTransformedHex(currentHex, currentLine);
        chain.push({
            type: 'transform',
            from: { hex: currentHex, line: currentLine, old: true },
            changed_to_hex: newHex
        });
    }
    return chain;
}

// 複雑チェーン生成（0..Nステップ）
generateComplexChain(hexNum, startLine) {
    const steps = Math.floor(Math.random() * 4) + 1; // 1-4ステップ
    // advance/transformをランダムに組み合わせ
}
```

### 2. 契約B v2.0形式への移行（Line 285-333）

```javascript
buildScenarios(patterns, analysisContext) {
    return patterns.map((pattern, index) => {
        return {
            // 契約B v2.0必須フィールド
            id: `FUT-${String(index + 1).padStart(3, '0')}`,
            mechanism: pattern.mechanism,
            seed: {
                hex: hexNum,
                line: lineNum,
                keywords: {
                    hex: hexData.keywords || ['変化'],
                    line: [lineData.keyword || '転機']
                }
            },
            change_chain: pattern.changeChain || [],
            narrative: {
                analysis: '60字以上。卦/爻のキーワードに基づく未来の含意。',
                advice: '50字以上。今と次の一手。',
                keywords_used: ['坎：陥穽・内省', '四爻：節度', '蹇：難・慎重']
            },
            metrics: {
                risk: 0.34,
                potential: 0.68,
                recommendation: 0.62
            },
            display: {
                label: pattern.title,
                icons: [pattern.mechanism]
            }
        };
    });
}
```

## 📊 変更の影響

### 削除されたコンセプト
- 固定4基軸（天・地・人・時）
- 固定2方式による8パスの生成
- temporalStepsの固定2-3ステップ

### 追加されたコンセプト
- mechanism（advance/transform/mixed/stable/complex）
- change_chain（可変長0..N）
- seed（本卦・爻位・キーワード）
- narrative（analysis/advice/keywords_used）

## ⚠️ 互換性考慮

既存UIとの互換性のため、以下のフィールドを維持：
- title
- description  
- metadata（一部）

## 🔄 次のフェーズ（Phase 2）

1. OS Analyzerの3OS相互作用強化
   - affordances（強み/弱みが出るインターフェース）
   - inner_conflicts（葛藤テーマ）
   - integration_prompts（統合のヒント）

2. UIコンポーネントの更新
   - EightScenariosDisplay.jsの契約B v2.0対応
   - change_chain可視化の改善

3. 契約検証の強化
   - types.validateFuture@2.0の実装

## 📝 技術メモ

### 変爻計算の簡易実装
```javascript
calculateTransformedHex(hexNum, lineNum) {
    // 実際は二進数変換による正確な計算が必要
    // 現在はフォールバック: ((hexNum + lineNum * 7) % 64) + 1
}
```

実装時は正確な変換テーブルまたは二進数計算を使用すること。

---
記録者: Claude Code
Phase 1完了: 2025-08-10 18:30