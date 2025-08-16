# 表現バリエーション強化仕様書

**実施日**: 2025年8月16日  
**対象**: Future Simulator 8パターン表現差別化システム  
**準拠**: 20250816_future_simulator_design_framework.md

---

## 🎯 表現バリエーション問題分析

### 現状課題:
1. **説明文切り捨て**: 30文字制限で「...」表示
2. **同質化表現**: 似通った文章パターン
3. **情報階層不明確**: 重要度順の情報提示不徹底
4. **感情配慮不十分**: 画一的な表現トーン

### 解決目標:
**8パターンの個性が明確に伝わる多層表現システム**

---

## 📐 表現階層化設計

### 1. 3段階情報表示システム
```javascript
const expressionLayers = {
  // レイヤー1: カード要約表示（30-50文字）
  cardSummary: {
    priority: ['戦略タイプ', 'スコア変化', 'キーポイント'],
    format: '{strategyIcon} {strategyName} - {scoreChange} {keyFeature}',
    example: '🚀 成長重視型 - (+25点) 積極的挑戦による大幅改善期'
  },
  
  // レイヤー2: カード詳細表示（80-120文字）
  cardDetail: {
    priority: ['過程特徴', 'リスクリターン', '期間性質'],
    format: '{processDescription} {riskReturnBalance} {timeCharacteristic}',
    example: '短期的には努力が必要な時期ですが、HaQei分析では大幅な改善が期待できます。積極的取り組みにより段階的成長が見込まれます。'
  },
  
  // レイヤー3: モーダル完全表示（制限なし）
  modalFull: {
    priority: ['詳細分析', '論理的根拠', '行動指針', '予測詳細'],
    sections: ['現状認識', 'フェーズ分析', '総合評価', '推奨行動']
  }
};
```

### 2. 適応的表示制御
```javascript
class AdaptiveExpressionRenderer {
  calculateOptimalLength(containerWidth, cardCount) {
    const baseLength = {
      mobile: { summary: 25, detail: 60 },
      tablet: { summary: 35, detail: 90 },
      desktop: { summary: 45, detail: 120 }
    };
    
    const screenType = containerWidth < 768 ? 'mobile' : 
                      containerWidth < 1024 ? 'tablet' : 'desktop';
    const densityFactor = cardCount > 6 ? 0.8 : 1.0;
    
    return {
      summary: Math.floor(baseLength[screenType].summary * densityFactor),
      detail: Math.floor(baseLength[screenType].detail * densityFactor)
    };
  }
  
  generateAdaptiveDescription(scenario, targetLength) {
    const fullDescription = this.generateFullDescription(scenario);
    
    if (fullDescription.length <= targetLength) {
      return fullDescription;
    }
    
    // 重要度順での段階的短縮
    return this.intelligentTruncation(fullDescription, targetLength);
  }
}
```

---

## 🎨 表現バリエーション生成アルゴリズム

### 1. コンテンツ多様化エンジン
```javascript
class ExpressionVariationEngine {
  generateVariedExpressions(scenario, strategyType, expressionLevel) {
    const baseData = this.extractBaseInformation(scenario);
    const variationFactors = this.analyzeVariationFactors(scenario);
    
    return this.applyVariationPatterns(baseData, variationFactors, strategyType, expressionLevel);
  }
  
  analyzeVariationFactors(scenario) {
    return {
      // 因子1: スコア変動パターン
      scorePattern: this.classifyScorePattern(scenario.phases),
      
      // 因子2: 進爻/変爻比率
      actionRatio: this.analyzeActionRatio(scenario.pattern),
      
      // 因子3: キーワード特性
      keywordCharacteristics: this.analyzeKeywordCharacteristics(scenario.phases),
      
      // 因子4: 時間軸特性
      temporalCharacteristics: this.analyzeTemporalFlow(scenario.phases),
      
      // 因子5: 感情的トーン要件
      emotionalTone: this.determineEmotionalTone(scenario)
    };
  }
  
  applyVariationPatterns(baseData, factors, strategyType, level) {
    const patterns = this.getVariationPatterns(strategyType, factors, level);
    return this.blendPatterns(baseData, patterns);
  }
}
```

### 2. パターン分類システム
```javascript
const variationPatterns = {
  // スコア変動パターン別表現
  scorePatterns: {
    steadyGrowth: {
      cardSummary: '着実な改善により{finalScore}点到達',
      processEmphasis: '段階的な向上',
      timeFrame: '継続的取り組み'
    },
    volatileGrowth: {
      cardSummary: '変動を経て{finalScore}点に成長',
      processEmphasis: 'ダイナミックな展開',
      timeFrame: '変化対応期間'
    },
    rapidJump: {
      cardSummary: '大幅改善で{finalScore}点達成',
      processEmphasis: '急速な変化',
      timeFrame: '集中期間'
    },
    stableFloat: {
      cardSummary: '安定的に{finalScore}点維持',
      processEmphasis: '均衡状態',
      timeFrame: '継続維持期'
    }
  },
  
  // 行動パターン別表現
  actionPatterns: {
    progressive: { // 進爻中心
      approach: '積極的な前進により',
      method: '段階的なステップアップで',
      result: '着実な成果が期待できます'
    },
    transformative: { // 変爻中心
      approach: '状況の転換を通じて',
      method: '根本的な変化により',
      result: '新たな展開が見込まれます'
    },
    mixed: { // 混合型
      approach: '柔軟なアプローチで',
      method: '状況に応じた最適な選択により',
      result: 'バランスの取れた改善が予測されます'
    }
  },
  
  // 感情配慮表現バリエーション
  emotionalTones: {
    encouraging: {
      opening: 'HaQei分析によると、',
      transition: 'この選択により',
      closing: 'ことが期待できます'
    },
    analytical: {
      opening: 'ロジカル分析では、',
      transition: 'この道筋では',
      closing: 'ことが予測されます'
    },
    supportive: {
      opening: '状況を総合的に検討すると、',
      transition: 'この方向性により',
      closing: 'ことが見込まれます'
    }
  }
};
```

### 3. キーワード特性分析
```javascript
class KeywordCharacteristicsAnalyzer {
  analyzeKeywordCharacteristics(phases) {
    const allKeywords = phases.flatMap(p => p.data?.['キーワード'] || []);
    
    return {
      // 特性1: 行動志向性
      actionOrientation: this.classifyActionOrientation(allKeywords),
      
      // 特性2: 時間軸感覚
      timeOrientation: this.classifyTimeOrientation(allKeywords),
      
      // 特性3: リスク傾向
      riskTolerance: this.classifyRiskTolerance(allKeywords),
      
      // 特性4: 関係性重視度
      relationshipFocus: this.classifyRelationshipFocus(allKeywords),
      
      // 特性5: 変化受容度
      changeReceptivity: this.classifyChangeReceptivity(allKeywords)
    };
  }
  
  classifyActionOrientation(keywords) {
    const activeKeywords = ['行動', '実行', '推進', '挑戦', '取り組み'];
    const reflectiveKeywords = ['考察', '検討', '観察', '分析', '理解'];
    const cooperativeKeywords = ['協力', '調和', '連携', '共感', '支援'];
    
    const scores = {
      active: this.countMatches(keywords, activeKeywords),
      reflective: this.countMatches(keywords, reflectiveKeywords),
      cooperative: this.countMatches(keywords, cooperativeKeywords)
    };
    
    return this.determineMaxCategory(scores);
  }
}
```

---

## 🔧 実装統合設計

### 1. カード表示統合
```javascript
// future-simulator-display.js 改修
generateCardHTML(scenario) {
  const containerWidth = this.getContainerWidth();
  const optimalLengths = this.adaptiveRenderer.calculateOptimalLength(containerWidth, 8);
  
  const strategyAnalysis = this.expressionEngine.determineAdvancedStrategyType(scenario.phases);
  const variationData = this.variationEngine.generateVariedExpressions(scenario, strategyAnalysis, 'card');
  
  const cardSummary = this.generateLayeredSummary(variationData, optimalLengths.summary);
  const cardDetail = this.generateLayeredDetail(variationData, optimalLengths.detail);
  
  return `
    <div class="scenario-card" data-scenario-id="${scenario.id}">
      <div class="card-header">
        <h4>${variationData.title}</h4>
        <div class="strategy-indicator">
          <span class="strategy-icon">${strategyAnalysis.type.split(' ')[0]}</span>
          <span class="strategy-name">${strategyAnalysis.type.split(' ')[1]}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="summary-layer">${cardSummary}</div>
        <div class="detail-layer" style="display: none;">${cardDetail}</div>
        <div class="metadata">
          <span class="difficulty">${strategyAnalysis.difficulty}</span>
          <span class="trend">${variationData.trendExpression}</span>
        </div>
      </div>
    </div>
  `;
}
```

### 2. 表現エンジン連携強化
```javascript
// future-simulator-expression.js 拡張
class FutureSimulatorExpression {
  generateComprehensiveCardContent(scenario, targetLength) {
    const strategyAnalysis = this.determineAdvancedStrategyType(scenario.phases);
    const variationFactors = this.variationEngine.analyzeVariationFactors(scenario);
    
    // ベース情報構築
    const baseContent = {
      strategyInfo: strategyAnalysis,
      scoreProgression: this.analyzeScoreProgression(scenario.phases),
      keywordFlow: this.analyzeKeywordFlow(scenario.phases),
      actionSequence: this.analyzeActionSequence(scenario.pattern),
      emotionalConsideration: this.generateEmotionalConsideration(scenario)
    };
    
    // バリエーション適用
    const variedContent = this.applyVariationPatterns(baseContent, variationFactors);
    
    // 長さ調整
    return this.adaptContentToLength(variedContent, targetLength);
  }
  
  adaptContentToLength(content, targetLength) {
    const priorityOrder = [
      'strategyTypeAndScore',  // 戦略タイプ+スコア（必須）
      'keyFeature',           // 主要特徴（高優先）
      'processDescription',   // 過程説明（中優先）
      'emotionalFraming',     // 感情配慮（低優先）
      'detailContext'         // 詳細文脈（省略可）
    ];
    
    let result = '';
    let remainingLength = targetLength;
    
    for (const component of priorityOrder) {
      const componentText = content[component];
      if (componentText && componentText.length <= remainingLength) {
        result += componentText;
        remainingLength -= componentText.length;
      } else if (componentText && remainingLength > 10) {
        // 重要コンポーネントは短縮して含める
        result += this.intelligentTruncate(componentText, remainingLength);
        break;
      }
    }
    
    return result;
  }
}
```

### 3. レスポンシブ対応
```javascript
class ResponsiveExpressionManager {
  adjustExpressionForDevice(expression, deviceContext) {
    const adjustments = {
      mobile: {
        maxSummaryLength: 25,
        maxDetailLength: 60,
        prioritizeIcons: true,
        useAbbreviations: true
      },
      tablet: {
        maxSummaryLength: 35,
        maxDetailLength: 90,
        prioritizeIcons: false,
        useAbbreviations: false
      },
      desktop: {
        maxSummaryLength: 50,
        maxDetailLength: 120,
        prioritizeIcons: false,
        useAbbreviations: false
      }
    };
    
    const config = adjustments[deviceContext.deviceType];
    return this.applyDeviceAdjustments(expression, config);
  }
}
```

---

## 📊 品質保証基準

### 1. バリエーション品質指標
```javascript
const qualityMetrics = {
  // 差別化度: 8パターン間の類似度70%以下
  differentiation: {
    target: '< 70% similarity',
    measurement: 'Levenshtein distance between card summaries'
  },
  
  // 可読性: 理解度テスト80%以上
  readability: {
    target: '> 80% comprehension',
    measurement: 'User understanding test scores'
  },
  
  // 一貫性: ブランドトーン統一95%以上
  consistency: {
    target: '> 95% brand alignment',
    measurement: 'HaQei terminology usage consistency'
  },
  
  // 適応性: デバイス別表示崩れゼロ
  adaptivity: {
    target: '0 layout breaks',
    measurement: 'Cross-device display validation'
  }
};
```

### 2. 自動品質チェック
```javascript
class QualityAssuranceValidator {
  validateExpressionQuality(allCardExpressions) {
    return {
      differentiation: this.calculateDifferentiationScore(allCardExpressions),
      readability: this.calculateReadabilityScore(allCardExpressions),
      consistency: this.validateBrandConsistency(allCardExpressions),
      adaptivity: this.validateResponsiveDisplay(allCardExpressions),
      overall: this.calculateOverallQuality()
    };
  }
  
  calculateDifferentiationScore(expressions) {
    const similarities = [];
    for (let i = 0; i < expressions.length; i++) {
      for (let j = i + 1; j < expressions.length; j++) {
        similarities.push(this.calculateSimilarity(expressions[i], expressions[j]));
      }
    }
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    return Math.max(0, 100 - avgSimilarity);
  }
}
```

---

## 🚀 実装ロードマップ

### Phase 1: 基盤実装（Priority: High）
1. **適応的表示制御システム**
   - デバイス検出とレイアウト計算
   - 動的文字数調整アルゴリズム

2. **3段階表現レイヤー**
   - カード要約/詳細/モーダルの階層化
   - レイヤー間の一貫性保持

### Phase 2: バリエーション強化（Priority: High）
1. **表現生成エンジン**
   - パターン分類システム実装
   - キーワード特性分析機能

2. **品質保証システム**
   - 自動差別化度チェック
   - 表現品質バリデーション

### Phase 3: 統合最適化（Priority: Medium）
1. **パフォーマンス最適化**
   - 表現生成速度向上
   - メモリ使用量最適化

2. **UX向上**
   - 段階的詳細表示
   - インタラクティブな情報展開

---

## 📈 期待成果

### ユーザビリティ向上:
- **理解度**: 8パターンの違いが明確に認識可能
- **選択支援**: 戦略特徴に基づく最適選択促進
- **情報効率**: 必要情報の段階的アクセス実現

### システム品質向上:
- **差別化**: 表現類似度70%以下達成
- **適応性**: 全デバイスでの最適表示実現
- **拡張性**: 将来的な表現パターン追加基盤構築

---

**次ステップ**: H384データベース活用強化設計書作成