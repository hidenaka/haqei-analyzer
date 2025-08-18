# HAQEI Phase 3 Week 1: 内的対話システム設計仕様書

## 🎯 概要

**目的**: 3つの仮想人格（Engine OS, Interface OS, Safe Mode OS）が特定の状況で「内的対話」を行う様子を可視化  
**革新性**: 静的な結果表示から「生きた仮想人格の相互作用」への進化  
**ユーザー価値**: 自己内部の多面性を物語的に理解できる新体験

---

## 🎭 コンセプト設計

### 内的対話の基本構造
```
状況: "重要な決断を迫られた時"
┌─────────────────────────────────┐
│ 🚀 創造の探検家 (Engine OS)      │ → "新しいチャンスだ！挑戦してみよう！"
│ 🤝 調和の橋渡し (Interface OS)   │ → "周りの人への影響も考えてみませんか？"  
│ 🛡️ 慎重な守護者 (Safe Mode OS)   │ → "慎重に...リスクを十分検討しましょう"
└─────────────────────────────────┘
```

### 対話の特徴
- **個性的な口調**: 各ペルソナが独自のキャラクター性を発揮
- **強度反映**: OS分析結果の強度により発言の影響力が変化
- **文脈適応**: 状況に応じて異なる対話パターンを生成

---

## 📊 技術設計

### 1. VirtualPersonaDialogueクラス設計

```javascript
class VirtualPersonaDialogue {
  constructor() {
    this.dialogueScenarios = this.initializeScenarios();
    this.personaVoices = this.initializePersonaVoices();
  }
  
  // 主要メソッド設計
  generateDialogue(osResults, scenarioType) {
    // 対話生成のコアロジック
  }
  
  selectScenario(userContext) {
    // ユーザーの状況に応じたシナリオ選択
  }
  
  adjustDialogueIntensity(persona, strength) {
    // OS強度に応じた発言調整
  }
}
```

### 2. 対話シナリオデータベース

```javascript
const DIALOGUE_SCENARIOS = {
  // 決断場面
  decision: {
    situation: "重要な決断を迫られた時",
    context: "人生の分岐点、新しいチャレンジ、リスクを伴う選択",
    engineOS: [
      "新しいチャンスだ！挑戦してみよう！",
      "これまでにない可能性を探ってみませんか？",
      "革新的なアプローチで行きましょう！"
    ],
    interfaceOS: [
      "周りの人への影響も考えてみませんか？",
      "チームのみんなと相談してから決めましょう",
      "協力してもらえる人がいるか確認しませんか？"
    ],
    safeModeOS: [
      "慎重に...リスクを十分検討しましょう",
      "過去の経験から学んで判断しませんか？",
      "安全な道筋を確保してから進みましょう"
    ]
  },
  
  // 困難場面
  challenge: {
    situation: "困難な問題に直面した時",
    context: "想定外の問題、解決困難な課題、行き詰まり状況",
    engineOS: [
      "クリエイティブな解決策を探してみよう",
      "この困難を成長のチャンスに変えましょう！",
      "今までとは違う角度から考えてみませんか？"
    ],
    interfaceOS: [
      "チームで協力すれば乗り越えられる",
      "経験豊富な人に相談してみましょう",
      "みんなの知恵を集めて解決策を見つけましょう"
    ],
    safeModeOS: [
      "まず現状を冷静に分析することが大切",
      "リスクを最小限に抑える方法を考えましょう",
      "着実に一歩ずつ解決していきましょう"
    ]
  },
  
  // 創造場面
  creation: {
    situation: "新しいものを創り出す時",
    context: "企画立案、作品制作、アイデア発想",
    engineOS: [
      "誰も思いつかないようなアイデアを！",
      "既存の枠を超えた発想で行きましょう",
      "革命的な何かを生み出してみませんか？"
    ],
    interfaceOS: [
      "みんなが喜ぶものを作りましょう",
      "協力して素晴らしいものを作り上げましょう",
      "人々の心に響くものを目指しませんか？"
    ],
    safeModeOS: [
      "実現可能性をしっかり検証しましょう",
      "段階的に形にしていきませんか？",
      "リスクを考慮した計画を立てましょう"
    ]
  }
};
```

### 3. ペルソナ個性設定

```javascript
const PERSONA_VOICES = {
  engine: {
    tone: "エネルギッシュで前向き",
    keywords: ["チャンス", "革新", "可能性", "挑戦", "創造"],
    speechPattern: "！で終わる文が多い、提案形",
    emoji: "🚀✨💡⚡🌟"
  },
  interface: {
    tone: "協調的で思いやりがある",
    keywords: ["みんな", "協力", "チーム", "相談", "調和"],
    speechPattern: "「〜しませんか？」の提案形が多い",
    emoji: "🤝💫🌸🎈🎊"
  },
  safemode: {
    tone: "慎重で冷静",
    keywords: ["慎重", "安全", "リスク", "計画", "検証"],
    speechPattern: "「〜しましょう」の確実な提案",
    emoji: "🛡️🔍📋⚖️🎯"
  }
};
```

---

## 🎨 UI設計

### 対話表示コンポーネント

```html
<div class="persona-dialogue-container">
  <div class="dialogue-situation">
    <h3 class="situation-title">${situation}</h3>
    <p class="situation-context">${context}</p>
  </div>
  
  <div class="dialogue-participants">
    <!-- Engine OS -->
    <div class="persona-dialogue-card engine" data-strength="${engineStrength}">
      <div class="persona-header">
        <span class="persona-symbol">🚀</span>
        <h4 class="persona-name">創造の探検家</h4>
        <div class="strength-indicator">${engineStrength}%</div>
      </div>
      <div class="persona-message">
        <p class="dialogue-text">"${engineMessage}"</p>
      </div>
    </div>
    
    <!-- Interface OS -->
    <div class="persona-dialogue-card interface" data-strength="${interfaceStrength}">
      <div class="persona-header">
        <span class="persona-symbol">🤝</span>
        <h4 class="persona-name">調和の橋渡し</h4>
        <div class="strength-indicator">${interfaceStrength}%</div>
      </div>
      <div class="persona-message">
        <p class="dialogue-text">"${interfaceMessage}"</p>
      </div>
    </div>
    
    <!-- Safe Mode OS -->
    <div class="persona-dialogue-card safemode" data-strength="${safeModeStrength}">
      <div class="persona-header">
        <span class="persona-symbol">🛡️</span>
        <h4 class="persona-name">慎重な守護者</h4>
        <div class="strength-indicator">${safeModeStrength}%</div>
      </div>
      <div class="persona-message">
        <p class="dialogue-text">"${safeModeMessage}"</p>
      </div>
    </div>
  </div>
  
  <div class="dialogue-controls">
    <button class="scenario-btn" data-scenario="decision">決断場面</button>
    <button class="scenario-btn" data-scenario="challenge">困難場面</button>
    <button class="scenario-btn" data-scenario="creation">創造場面</button>
  </div>
</div>
```

### CSS設計方針

```css
.persona-dialogue-container {
  /* 対話全体のコンテナ */
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05));
  border-radius: 16px;
  padding: var(--space-lg);
  margin: var(--space-lg) 0;
}

.persona-dialogue-card {
  /* 各ペルソナの発言カード */
  transform: scale(calc(0.8 + var(--strength) * 0.004)); /* 強度に応じてサイズ変化 */
  opacity: calc(0.7 + var(--strength) * 0.003); /* 強度に応じて透明度変化 */
}

.persona-dialogue-card.engine {
  border-left: 4px solid var(--engine-color);
}

.persona-dialogue-card.interface {
  border-left: 4px solid var(--interface-color);
}

.persona-dialogue-card.safemode {
  border-left: 4px solid var(--safemode-color);
}
```

---

## ⚡ 実装ステップ

### Step 1: 基盤クラス実装
1. VirtualPersonaDialogueクラス作成
2. 対話シナリオデータベース構築
3. ペルソナ個性設定実装

### Step 2: 対話生成ロジック
1. generateDialogue()メソッド実装
2. 強度反映アルゴリズム構築
3. メッセージ選択ロジック実装

### Step 3: UI実装
1. 対話表示コンポーネント作成
2. CSS アニメーション実装
3. レスポンシブ対応

### Step 4: 統合
1. 結果画面への統合
2. 既存システムとの連携
3. エラーハンドリング実装

### Step 5: テスト・検証
1. 各シナリオの動作確認
2. UI/UX検証
3. パフォーマンス最適化

---

## 🎯 期待効果

### ユーザー体験向上
- 静的な結果から「生きた対話」への進化
- 自己理解の深化とエンターテインメント性の向上
- 「仮想人格」概念の具現化

### 技術的価値
- 易経メタファーを活用した革新的UI
- 強度データの効果的な可視化
- HaQei哲学との高い整合性

この設計により、HAQEI は単なる「結果表示システム」から「仮想人格との対話体験」へと進化します。