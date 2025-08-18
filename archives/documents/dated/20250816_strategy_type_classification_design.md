# 戦略タイプ判定ロジック再設計仕様書

**実施日**: 2025年8月16日  
**対象**: FutureSimulatorExpression.determineStrategyType()強化  
**目標**: 8パターンで明確に異なる戦略タイプ分類実現

---

## 🎯 現状問題と解決方針

### 現状問題:
- 全8パターンが「⚖️ バランス型」に分類される
- volatility計算のみでは差別化不十分
- H384データベースの多次元情報未活用

### 解決方針:
**多次元分析アルゴリズムによる5タイプ分類システム**

---

## 🔧 新戦略タイプ分類体系

### 1. 戦略タイプ定義拡張
```javascript
const strategyTypes = {
  '🛡️ 安定重視型': {
    criteria: { riskLevel: 'low', progression: 'gradual', approach: 'conservative' },
    template: '無理なく着実に状況が良くなっていく道筋が予測されます',
    difficulty: '★★☆☆☆',
    characteristics: ['低リスク', '漸進的改善', '安定キーワード重視']
  },
  '🚀 成長重視型': {
    criteria: { riskLevel: 'high', progression: 'rapid', approach: 'aggressive' },
    template: '短期的には努力が必要な時期ですが、HaQei分析では大幅な改善が期待できます',
    difficulty: '★★★★☆',
    characteristics: ['高リスク', '急成長', '積極キーワード重視']
  },
  '⚖️ バランス型': {
    criteria: { riskLevel: 'medium', progression: 'moderate', approach: 'balanced' },
    template: '適度な取り組みにより、バランスよく状況が改善していくことが見込まれます',
    difficulty: '★★★☆☆',
    characteristics: ['中リスク', '適度成長', '調和キーワード重視']
  },
  '🎯 集中型': {
    criteria: { riskLevel: 'medium', progression: 'focused', approach: 'targeted' },
    template: '特定の領域に集中することで、効率的な改善が期待できます',
    difficulty: '★★★☆☆',
    characteristics: ['特定領域重視', '段階的進展', '専門性重視']
  },
  '🌊 適応型': {
    criteria: { riskLevel: 'variable', progression: 'flexible', approach: 'adaptive' },
    template: '状況の変化に柔軟に対応しながら、最適な道筋を見つけていくことが見込まれます',
    difficulty: '★★★★☆',
    characteristics: ['変動対応', '柔軟性重視', '適応的調整']
  }
};
```

---

## 🧮 多次元分析アルゴリズム設計

### 1. 分析軸定義
```javascript
const analysisAxes = {
  // 軸1: リスクレベル分析
  riskLevel: {
    calculator: (phases) => {
      const volatility = calculateVolatility(phases.map(p => p.score));
      const maxDrop = Math.max(...phases.map((p, i) => 
        i > 0 ? phases[i-1].score - p.score : 0
      ));
      return {
        volatility: volatility,
        maxDrop: maxDrop,
        level: volatility > 15 ? 'high' : volatility > 8 ? 'medium' : 'low'
      };
    }
  },

  // 軸2: 進行スピード分析
  progression: {
    calculator: (phases) => {
      const totalChange = phases[phases.length-1].score - phases[0].score;
      const phases_count = phases.length - 1;
      const avgPerPhase = totalChange / phases_count;
      return {
        totalChange: totalChange,
        avgPerPhase: avgPerPhase,
        speed: Math.abs(avgPerPhase) > 10 ? 'rapid' : 
               Math.abs(avgPerPhase) > 5 ? 'moderate' : 'gradual'
      };
    }
  },

  // 軸3: アプローチスタイル分析（H384データ活用）
  approach: {
    calculator: (phases) => {
      const keywords = phases.flatMap(p => p.data?.['キーワード'] || []);
      const stances = phases.map(p => p.data?.['S5_主体性推奨スタンス']).filter(Boolean);
      
      // キーワード分析
      const aggressiveKeywords = ['変化', '前進', '積極', '挑戦', '発展', '推進'];
      const conservativeKeywords = ['安定', '継続', '慎重', '維持', '守る', '固める'];
      const balanceKeywords = ['調和', '適度', 'バランス', '中庸', '均衡'];
      
      const aggressiveScore = keywords.filter(k => 
        aggressiveKeywords.some(ak => k.includes(ak))
      ).length;
      const conservativeScore = keywords.filter(k => 
        conservativeKeywords.some(ck => k.includes(ck))
      ).length;
      const balanceScore = keywords.filter(k => 
        balanceKeywords.some(bk => k.includes(bk))
      ).length;
      
      // 主体性スタンス分析
      const activeStances = stances.filter(s => s === '能動').length;
      const passiveStances = stances.filter(s => s === '受動').length;
      
      return {
        keywordProfile: { aggressiveScore, conservativeScore, balanceScore },
        stanceProfile: { activeStances, passiveStances },
        style: aggressiveScore > conservativeScore + balanceScore ? 'aggressive' :
               conservativeScore > aggressiveScore + balanceScore ? 'conservative' :
               'balanced'
      };
    }
  },

  // 軸4: 安定性指向分析
  stability: {
    calculator: (phases) => {
      const scores = phases.map(p => p.score);
      const increases = 0;
      const decreases = 0;
      const stable = 0;
      
      for (let i = 1; i < scores.length; i++) {
        const diff = scores[i] - scores[i-1];
        if (diff > 3) increases++;
        else if (diff < -3) decreases++;
        else stable++;
      }
      
      return {
        increases, decreases, stable,
        preference: stable > increases + decreases ? 'stability' :
                   increases > decreases ? 'growth' : 'adjustment'
      };
    }
  },

  // 軸5: 集中度分析（パターン一貫性）
  focus: {
    calculator: (phases) => {
      const actions = phases.slice(1).map(p => p.action);
      const jinYaoCount = actions.filter(a => a === '進爻').length;
      const hengYaoCount = actions.filter(a => a === '変爻').length;
      
      // パターンの一貫性チェック
      const consistency = Math.abs(jinYaoCount - hengYaoCount);
      
      return {
        jinYaoCount, hengYaoCount, consistency,
        type: consistency === 3 ? 'focused' : 
              consistency === 1 ? 'balanced' : 'mixed'
      };
    }
  }
};
```

### 2. 統合判定アルゴリズム
```javascript
function determineAdvancedStrategyType(phases) {
  // 各軸での分析実行
  const riskAnalysis = analysisAxes.riskLevel.calculator(phases);
  const progressionAnalysis = analysisAxes.progression.calculator(phases);
  const approachAnalysis = analysisAxes.approach.calculator(phases);
  const stabilityAnalysis = analysisAxes.stability.calculator(phases);
  const focusAnalysis = analysisAxes.focus.calculator(phases);
  
  // 判定マトリックス適用
  const strategyScore = {
    '🛡️ 安定重視型': calculateStabilityScore(riskAnalysis, progressionAnalysis, approachAnalysis, stabilityAnalysis),
    '🚀 成長重視型': calculateGrowthScore(riskAnalysis, progressionAnalysis, approachAnalysis, stabilityAnalysis),
    '⚖️ バランス型': calculateBalanceScore(riskAnalysis, progressionAnalysis, approachAnalysis, stabilityAnalysis),
    '🎯 集中型': calculateFocusScore(riskAnalysis, progressionAnalysis, approachAnalysis, focusAnalysis),
    '🌊 適応型': calculateAdaptiveScore(riskAnalysis, progressionAnalysis, approachAnalysis, stabilityAnalysis)
  };
  
  // 最高スコアのタイプを選択
  const selectedType = Object.entries(strategyScore)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  return {
    type: selectedType,
    template: strategyTypes[selectedType].template,
    difficulty: strategyTypes[selectedType].difficulty,
    characteristics: strategyTypes[selectedType].characteristics,
    analysisDetail: {
      riskAnalysis, progressionAnalysis, approachAnalysis, 
      stabilityAnalysis, focusAnalysis
    },
    confidence: strategyScore[selectedType] / Math.max(...Object.values(strategyScore))
  };
}
```

### 3. 各タイプスコア計算ロジック
```javascript
function calculateStabilityScore(risk, progression, approach, stability) {
  let score = 0;
  if (risk.level === 'low') score += 30;
  if (progression.speed === 'gradual') score += 25;
  if (approach.style === 'conservative') score += 25;
  if (stability.preference === 'stability') score += 20;
  return score;
}

function calculateGrowthScore(risk, progression, approach, stability) {
  let score = 0;
  if (risk.level === 'high') score += 30;
  if (progression.speed === 'rapid') score += 25;
  if (approach.style === 'aggressive') score += 25;
  if (stability.preference === 'growth') score += 20;
  return score;
}

function calculateBalanceScore(risk, progression, approach, stability) {
  let score = 0;
  if (risk.level === 'medium') score += 25;
  if (progression.speed === 'moderate') score += 25;
  if (approach.style === 'balanced') score += 30;
  if (Math.abs(stability.increases - stability.decreases) <= 1) score += 20;
  return score;
}

function calculateFocusScore(risk, progression, approach, focus) {
  let score = 0;
  if (risk.level === 'medium') score += 20;
  if (progression.speed === 'moderate') score += 20;
  if (focus.type === 'focused') score += 40;
  if (approach.stanceProfile.activeStances > approach.stanceProfile.passiveStances) score += 20;
  return score;
}

function calculateAdaptiveScore(risk, progression, approach, stability) {
  let score = 0;
  if (risk.volatility > 10 && risk.volatility < 20) score += 25; // 中程度の変動
  if (progression.speed === 'moderate' || progression.speed === 'rapid') score += 20;
  if (approach.keywordProfile.aggressiveScore > 0 && approach.keywordProfile.conservativeScore > 0) score += 30; // 混在
  if (stability.increases > 0 && stability.decreases > 0) score += 25; // 変動対応
  return score;
}
```

---

## 🎨 実装統合方針

### 1. 既存コード改修箇所
```javascript
// future-simulator-expression.js 修正対象
class FutureSimulatorExpression {
  // 既存 determineStrategyType() を置換
  determineStrategyType(scenarioPhases) {
    return this.determineAdvancedStrategyType(scenarioPhases);
  }
  
  // 新メソッド追加
  determineAdvancedStrategyType(phases) {
    // 上記アルゴリズム実装
  }
  
  // 分析軸計算メソッド追加
  analyzeRiskLevel(phases) { /* ... */ }
  analyzeProgression(phases) { /* ... */ }
  analyzeApproach(phases) { /* ... */ }
  analyzeStability(phases) { /* ... */ }
  analyzeFocus(phases) { /* ... */ }
}
```

### 2. future-simulator-display.js連携強化
```javascript
// カードHTML生成時の戦略情報拡張
generateCardHTML(scenario) {
  const strategyAnalysis = this.expressionEngine.determineStrategyType(scenario.phases);
  const cardData = this.expressionEngine.generateCardSummary(scenario, strategyAnalysis);
  
  return `
    <div class="scenario-card">
      <div class="strategy-indicator">
        <span class="strategy-icon">${strategyAnalysis.type.split(' ')[0]}</span>
        <span class="strategy-name">${strategyAnalysis.type.split(' ')[1]}</span>
        <span class="confidence-level">${Math.round(strategyAnalysis.confidence * 100)}%</span>
      </div>
      <div class="strategy-description">
        ${cardData.adaptiveDescription}
      </div>
      <div class="characteristics">
        ${strategyAnalysis.characteristics.map(c => `<span class="char-tag">${c}</span>`).join('')}
      </div>
    </div>
  `;
}
```

---

## 🧪 テスト設計

### 1. 分類精度テスト
```javascript
const testScenarios = [
  {
    name: '高リスク高リターン',
    phases: [/* スコア: 40→20→35→75 */],
    expectedType: '🚀 成長重視型'
  },
  {
    name: '低リスク漸進',
    phases: [/* スコア: 50→52→55→58 */],
    expectedType: '🛡️ 安定重視型'
  },
  {
    name: '進爻集中',
    pattern: ['進爻', '進爻', '進爻'],
    expectedType: '🎯 集中型'
  },
  {
    name: '混合変動',
    pattern: ['進爻', '変爻', '進爻'],
    expectedType: '🌊 適応型'
  }
];
```

### 2. 品質保証基準
- [ ] 8パターン中最低4種類の戦略タイプ分散
- [ ] 同一タイプは最大3パターンまで
- [ ] 信頼度60%以上の分類精度
- [ ] 既存表現フレームワーク完全準拠

---

## 📊 期待成果

### 分類精度向上:
- **Before**: 全パターン1種類（⚖️ バランス型）
- **After**: 4-5種類に分散、各タイプ特徴明確

### ユーザー体験向上:
- 戦略タイプの違いが一目で理解可能
- 選択の根拠となる特徴情報提供
- 信頼度表示による判定透明性

### システム拡張性:
- 多次元分析基盤で将来機能拡張容易
- H384データベース活用度最大化
- モジュール化で保守性向上

---

**次ステップ**: 実装完了後、全8パターンでの戦略タイプ分散テスト実行