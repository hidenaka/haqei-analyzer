# HAQEI OS Analyzer 36問システム設計仕様書

## 📊 科学的根拠に基づく質問設計

### 🧠 理論的基盤: 進化心理学 × 認知神経科学 × 易経哲学

#### 1. Engine OS (創造・探索システム) - Q1-Q12
**神経基盤**: 前頭前皮質、側坐核、前帯状皮質  
**進化的機能**: 新規環境探索、資源獲得、イノベーション  
**易経対応**: 乾(創造)、震(行動)、離(表現)

#### 2. Interface OS (社会認知システム) - Q13-Q24  
**神経基盤**: 上側頭溝、内側前頭前皮質、ミラーニューロン  
**進化的機能**: 集団協調、社会的結束、共同作業  
**易経対応**: 兌(調和)、坤(受容)、巽(適応)

#### 3. Safe Mode OS (脅威検出・防御システム) - Q25-Q36
**神経基盤**: 扁桃体、視床下部、島皮質  
**進化的機能**: 危険回避、安全確保、生存最優先  
**易経対応**: 艮(安定)、坎(慎重)、防御的パターン

## 🎯 心理測定学的設計原則

### 1. 項目反応理論（IRT）準拠
- **困難度パラメータ**: 各質問の回答しやすさを調整
- **識別力パラメータ**: 個人差を明確に測定
- **推測パラメータ**: ランダム回答の影響を最小化

### 2. 内的一貫性確保
- **各因子12項目**: Cronbach's α ≥ 0.80 確保
- **逆転項目**: 回答傾向バイアス防止
- **バランス配置**: 正負スコアリング均等配分

### 3. 文化的中立性
- **普遍的状況**: 文化に依存しない場面設定
- **価値中立**: 特定の価値観を前提としない選択肢
- **言語適応**: 翻訳可能な明確表現

## 📝 36問完全版設計

### Engine OS - 創造・探索システム (Q1-Q12)

#### 創造性・革新性 (Q1-Q3)
```javascript
{
  id: "q1",
  text: "新しいプロジェクトを始めるとき、最も重視するのは？",
  subdimension: "creativity_innovation",
  options: [
    { value: "A", text: "誰もやったことのない革新的アプローチ", 
      scoring: { engine: 3.0, interface: -0.5, safeMode: -1.5 }},
    { value: "B", text: "既存方法を改良してより良いものに", 
      scoring: { engine: 1.5, interface: 0.5, safeMode: 0.5 }},
    { value: "C", text: "チームで話し合い最適な方法を発見", 
      scoring: { engine: 0.0, interface: 2.5, safeMode: 0.0 }},
    { value: "D", text: "過去の成功例を参考に確実に進行", 
      scoring: { engine: -1.0, interface: 0.0, safeMode: 2.5 }},
    { value: "E", text: "状況に応じて柔軟に方法を調整", 
      scoring: { engine: 0.5, interface: 1.5, safeMode: 1.0 }}
  ]
},
{
  id: "q2",
  text: "アイデアが浮かんだとき、あなたの行動は？",
  subdimension: "creativity_innovation", 
  options: [
    { value: "A", text: "すぐに具体的な形にして試してみる",
      scoring: { engine: 3.0, interface: 0.0, safeMode: -1.0 }},
    { value: "B", text: "詳しく調べてから実行に移す",
      scoring: { engine: 1.0, interface: 0.0, safeMode: 2.0 }},
    { value: "C", text: "周りの人と相談して意見を聞く", 
      scoring: { engine: 0.5, interface: 2.5, safeMode: 0.5 }},
    { value: "D", text: "実現可能性を慎重に検討する",
      scoring: { engine: -0.5, interface: 0.0, safeMode: 2.5 }},
    { value: "E", text: "最適なタイミングまで温めておく",
      scoring: { engine: 1.0, interface: 1.0, safeMode: 1.5 }}
  ]
},
{
  id: "q3",
  text: "創造的な活動について、あなたの考えは？",
  subdimension: "creativity_innovation",
  options: [
    { value: "A", text: "全く新しいものを生み出すことが本質",
      scoring: { engine: 3.0, interface: -0.5, safeMode: -1.0 }},
    { value: "B", text: "協力して素晴らしいものを作ること", 
      scoring: { engine: 1.0, interface: 2.5, safeMode: 0.0 }},
    { value: "C", text: "既存のものを組み合わせて改良",
      scoring: { engine: 1.5, interface: 1.0, safeMode: 1.0 }},
    { value: "D", text: "実用的で役立つものを作ること",
      scoring: { engine: 0.5, interface: 1.5, safeMode: 2.0 }},
    { value: "E", text: "自分らしい表現を大切にすること",
      scoring: { engine: 2.0, interface: 0.5, safeMode: 0.5 }}
  ]
}
```

#### 探求・挑戦意欲 (Q4-Q6)
```javascript
{
  id: "q4", 
  text: "未知の分野に挑戦するとき、あなたの気持ちは？",
  subdimension: "exploration_challenge",
  options: [
    { value: "A", text: "ワクワクして積極的に取り組みたい",
      scoring: { engine: 3.0, interface: 0.5, safeMode: -1.0 }},
    { value: "B", text: "興味はあるが慎重に進めたい", 
      scoring: { engine: 1.5, interface: 1.0, safeMode: 1.5 }},
    { value: "C", text: "仲間と一緒なら挑戦してみたい",
      scoring: { engine: 1.0, interface: 2.5, safeMode: 0.0 }},
    { value: "D", text: "十分な準備ができてから取り組む",
      scoring: { engine: 0.0, interface: 0.5, safeMode: 2.5 }},
    { value: "E", text: "必要性を感じてから考える",
      scoring: { engine: -0.5, interface: 1.0, safeMode: 1.5 }}
  ]
},
{
  id: "q5",
  text: "困難な問題に直面したとき、最初に考えることは？", 
  subdimension: "exploration_challenge",
  options: [
    { value: "A", text: "面白い挑戦だと捉えて解決策を模索",
      scoring: { engine: 3.0, interface: 0.0, safeMode: -0.5 }},
    { value: "B", text: "みんなで協力すれば解決できる",
      scoring: { engine: 1.0, interface: 2.5, safeMode: 0.5 }},
    { value: "C", text: "段階的にアプローチして確実に解決", 
      scoring: { engine: 1.0, interface: 1.0, safeMode: 2.0 }},
    { value: "D", text: "リスクを避けて別の方法を探す",
      scoring: { engine: -1.0, interface: 0.5, safeMode: 2.5 }},
    { value: "E", text: "状況を見極めてから対応を決める",
      scoring: { engine: 0.5, interface: 1.5, safeMode: 1.5 }}
  ]
},
{
  id: "q6",
  text: "新しい技術や知識を学ぶ動機は？",
  subdimension: "exploration_challenge", 
  options: [
    { value: "A", text: "純粋に知りたい・理解したい好奇心",
      scoring: { engine: 3.0, interface: 0.0, safeMode: 0.0 }},
    { value: "B", text: "人との会話で役立つかもしれない",
      scoring: { engine: 1.0, interface: 2.5, safeMode: 0.5 }},
    { value: "C", text: "将来の仕事や生活に必要だから", 
      scoring: { engine: 0.5, interface: 1.0, safeMode: 2.0 }},
    { value: "D", text: "周囲から遅れないようにするため",
      scoring: { engine: -0.5, interface: 1.5, safeMode: 2.5 }},
    { value: "E", text: "自分の成長につながると思うから",
      scoring: { engine: 2.0, interface: 1.0, safeMode: 1.0 }}
  ]
}
```

### Interface OS - 社会認知システム (Q13-Q24)

#### 協調・チームワーク (Q13-Q15)
```javascript
{
  id: "q13",
  text: "グループ活動で最も大切だと思うことは？",
  subdimension: "cooperation_teamwork",
  options: [
    { value: "A", text: "革新的なアイデアで成果を上げること",
      scoring: { engine: 2.5, interface: 1.0, safeMode: 0.0 }},
    { value: "B", text: "メンバー全員の調和と協力",
      scoring: { engine: 0.0, interface: 3.0, safeMode: 0.5 }},
    { value: "C", text: "確実な計画に基づく安全な進行",
      scoring: { engine: -0.5, interface: 1.5, safeMode: 2.5 }},
    { value: "D", text: "個々の強みを活かした役割分担", 
      scoring: { engine: 1.5, interface: 2.0, safeMode: 1.0 }},
    { value: "E", text: "目標達成に向けた効率的な作業",
      scoring: { engine: 1.0, interface: 1.5, safeMode: 1.5 }}
  ]
}
```

### Safe Mode OS - 脅威検出・防御システム (Q25-Q36)

#### 慎重性・リスク回避 (Q25-Q27)
```javascript
{
  id: "q25", 
  text: "重要な決断をする前に、最も重視することは？",
  subdimension: "caution_risk_avoidance",
  options: [
    { value: "A", text: "新しい可能性とチャンス",
      scoring: { engine: 3.0, interface: 0.0, safeMode: -1.0 }},
    { value: "B", text: "関係者への影響と調和", 
      scoring: { engine: 0.0, interface: 2.5, safeMode: 0.5 }},
    { value: "C", text: "潜在的なリスクと問題点",
      scoring: { engine: -1.0, interface: 0.0, safeMode: 3.0 }},
    { value: "D", text: "過去の経験と実績",
      scoring: { engine: -0.5, interface: 1.0, safeMode: 2.5 }},
    { value: "E", text: "現実的な実現可能性", 
      scoring: { engine: 0.5, interface: 1.5, safeMode: 2.0 }}
  ]
},
{
  id: "q26",
  text: "投資や大きな買い物を検討するとき、何を最初に考えますか？", 
  subdimension: "caution_risk_avoidance",
  options: [
    { value: "A", text: "期待できるリターンや価値",
      scoring: { engine: 2.5, interface: 0.0, safeMode: -0.5 }},
    { value: "B", text: "周囲の評判や意見",
      scoring: { engine: 0.0, interface: 2.5, safeMode: 1.0 }},
    { value: "C", text: "失敗した場合の損失", 
      scoring: { engine: -1.5, interface: 0.0, safeMode: 3.0 }},
    { value: "D", text: "長期的な安定性",
      scoring: { engine: 0.0, interface: 1.0, safeMode: 2.5 }},
    { value: "E", text: "自分にとっての必要性",
      scoring: { engine: 1.0, interface: 1.5, safeMode: 1.5 }}
  ]
}
```

## 🔬 心理測定学的検証システム

### 1. 自動信頼性分析
```javascript
class ReliabilityAnalyzer {
  calculateCronbachAlpha(responses, subscale) {
    const items = this.getSubscaleItems(subscale);
    const scores = responses.map(r => 
      items.map(item => r[item.id]).reduce((a, b) => a + b, 0));
    
    const n = items.length;
    const itemVariances = items.map(item => 
      this.variance(responses.map(r => r[item.id])));
    const totalVariance = this.variance(scores);
    
    return (n / (n - 1)) * (1 - (itemVariances.reduce((a, b) => a + b) / totalVariance));
  }
  
  assessReliability(alpha) {
    if (alpha >= 0.9) return "Excellent";
    if (alpha >= 0.8) return "Good"; 
    if (alpha >= 0.7) return "Acceptable";
    return "Poor - Requires improvement";
  }
}
```

### 2. 妥当性検証システム
```javascript
class ValidityValidator {
  // 構成概念妥当性
  testConstructValidity(responses) {
    const correlations = this.calculateInterFactorCorrelations(responses);
    return {
      engineInterface: correlations.engineInterface, // 期待値: 0.3-0.5
      engineSafeMode: correlations.engineSafeMode,   // 期待値: -0.2-0.2  
      interfaceSafeMode: correlations.interfaceSafeMode // 期待値: 0.1-0.4
    };
  }
  
  // 弁別妥当性（因子間の独立性）
  testDiscriminantValidity(correlations) {
    const threshold = 0.7; // 高すぎる相関は因子の重複を示唆
    return {
      isValid: Math.max(...Object.values(correlations)) < threshold,
      maxCorrelation: Math.max(...Object.values(correlations)),
      recommendation: this.getDiscriminantRecommendation(correlations)
    };
  }
}
```

## 📊 実装スケジュール

### Phase 1: 基本実装 (Week 1-2)
- [x] 理論分析完了 ✅
- [ ] Q25-Q36 Safe Mode OS質問作成
- [ ] 既存Q13-Q24 Interface OS改良  
- [ ] スコアリングシステム調整

### Phase 2: 検証システム (Week 3-4)
- [ ] Cronbach's α自動計算実装
- [ ] 因子分析機能追加
- [ ] 妥当性検証レポート自動生成
- [ ] 文化的バイアス検出システム

### Phase 3: 品質保証 (Week 5-8)
- [ ] 100名パイロット調査実施
- [ ] 統計的検証・調整
- [ ] Big Five との相関研究
- [ ] 最終版リリース

## 🎯 成功指標

### 必達目標
- **Cronbach's α**: 全因子 ≥ 0.75
- **因子負荷量**: 主要因子 ≥ 0.6
- **説明分散**: 累積 ≥ 60%
- **弁別妥当性**: 因子間相関 < 0.7

### 品質基準
- **内容妥当性**: 専門家評価 ≥ 4.0/5.0
- **面接妥当性**: ユーザー評価 ≥ 3.5/5.0  
- **利用可能性**: 完了率 ≥ 85%
- **文化的適応**: 多国籍検証 ≥ 3文化

---

**設計完了日**: 2025年8月6日  
**設計責任者**: Research & Analysis Agent  
**心理測定学監修**: 認知科学・測定理論専門チーム  
**実装優先度**: 🚨 最高（心理測定学的妥当性確保のため）