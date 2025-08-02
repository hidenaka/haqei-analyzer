# HAQEI 仮想人格構築システム 完全設計仕様書

## 📋 システム概要

### 革新的アプローチ
**従来**: 診断 → 結果表示
**HAQEI**: 診断 → **仮想人格構築** → **3つのOS複雑関係性** → **易経メタファー解説**

### 核心コンセプト
ユーザーの回答から**デジタル分身（仮想人格）**を生成し、その中で3つのOS（価値観・社会的・防御）が独立した存在として相互作用する様子を易経の智慧で解説する。

---

## 🏗️ アーキテクチャ設計

### システム構成
```
VirtualPersonality (仮想人格本体)
├── PersonalityOS[Engine] (価値観OS)
├── PersonalityOS[Interface] (社会的OS) 
├── PersonalityOS[SafeMode] (防御OS)
├── OSRelationshipEngine (関係性シミュレーション)
└── IchingMetaphorEngine (易経解説生成)
```

### データフロー
```
ユーザー回答 → 仮想人格構築 → OS独立判断 → 関係性分析 → 易経物語生成 → 結果表示
```

---

## 🎭 Phase 1: 仮想人格基盤システム

### VirtualPersonality.js 仕様

```javascript
class VirtualPersonality {
  constructor(userAnswers) {
    this.id = `personality_${Date.now()}`;
    this.createdAt = new Date();
    
    // 3つの独立したOS人格を構築
    this.engineOS = new PersonalityOS('engine', userAnswers);
    this.interfaceOS = new PersonalityOS('interface', userAnswers);  
    this.safeModeOS = new PersonalityOS('safemode', userAnswers);
    
    // 関係性エンジン
    this.relationshipEngine = new OSRelationshipEngine(this);
    
    // 内部状態
    this.currentDominantOS = null;
    this.osActivationHistory = [];
    this.personalityMetadata = this.generateMetadata();
  }
  
  // 主要メソッド
  simulateInternalDialogue(scenario) { /* OS間対話シミュレーション */ }
  getCurrentOSConfiguration() { /* 現在のOS状態取得 */ }
  predictBehavior(situation) { /* 行動予測 */ }
  generatePersonalityNarrative() { /* 人格物語生成 */ }
}
```

### PersonalityOS.js 仕様

```javascript
class PersonalityOS {
  constructor(osType, userAnswers) {
    this.osType = osType; // 'engine', 'interface', 'safemode'
    this.hexagramId = null; // 対応する64卦
    this.activation = 0.0; // 活性度 (0.0-1.0)
    this.characteristics = {};
    this.preferences = {};
    this.behaviorPatterns = {};
    
    // 回答から特性を抽出
    this.buildFromAnswers(userAnswers);
  }
  
  // OS固有メソッド
  makeDecision(context) { /* このOSとしての判断 */ }
  expressOpinion(topic) { /* このOSの意見表明 */ }
  reactToStimulus(stimulus) { /* 刺激への反応 */ }
  negotiateWith(otherOS) { /* 他OSとの交渉 */ }
}
```

---

## 🔗 Phase 2: OS関係性エンジン

### OSRelationshipEngine.js 仕様

```javascript
class OSRelationshipEngine {
  constructor(virtualPersonality) {
    this.personality = virtualPersonality;
    this.relationshipMatrix = this.initializeMatrix();
    this.conflictPatterns = {};
    this.cooperationPatterns = {};
    this.dominanceHistory = [];
  }
  
  // 関係性分析メソッド
  analyzeCurrentRelationships() {
    return {
      engineInterface: this.analyzeOSPair('engine', 'interface'),
      engineSafemode: this.analyzeOSPair('engine', 'safemode'),
      interfaceSafemode: this.analyzeOSPair('interface', 'safemode'),
      overallDynamics: this.calculateOverallDynamics()
    };
  }
  
  simulateOSDialogue(scenario) {
    // 3つのOSが実際に会話する様子をシミュレーション
    const dialogue = [];
    
    // Engine OS の発言
    dialogue.push({
      speaker: 'engineOS',
      content: this.personality.engineOS.expressOpinion(scenario),
      emotion: this.calculateEmotion('engine', scenario)
    });
    
    // Interface OS の反応
    dialogue.push({
      speaker: 'interfaceOS', 
      content: this.personality.interfaceOS.reactToStimulus(dialogue[0]),
      emotion: this.calculateEmotion('interface', scenario)
    });
    
    // SafeMode OS の介入
    dialogue.push({
      speaker: 'safeModeOS',
      content: this.personality.safeModeOS.negotiateWith([
        this.personality.engineOS, 
        this.personality.interfaceOS
      ]),
      emotion: this.calculateEmotion('safemode', scenario)
    });
    
    return dialogue;
  }
}
```

---

## 🔮 Phase 3: 易経メタファーエンジン

### IchingMetaphorEngine.js 仕様

```javascript
class IchingMetaphorEngine {
  constructor(virtualPersonality) {
    this.personality = virtualPersonality;
    this.hexagramDatabase = this.loadHexagramDatabase();
    this.metaphorTemplates = this.loadMetaphorTemplates();
    this.narrativePatterns = this.initializeNarrativePatterns();
  }
  
  generatePersonalityNarrative() {
    const narrative = {
      introduction: this.generateIntroduction(),
      osDescriptions: this.generateOSDescriptions(),
      relationshipAnalysis: this.generateRelationshipAnalysis(),
      scenarioSimulations: this.generateScenarioSimulations(),
      wisdomMessage: this.generateWisdomMessage()
    };
    
    return this.formatAsStory(narrative);
  }
  
  generateOSDescriptions() {
    return {
      engineOS: {
        hexagram: this.personality.engineOS.hexagramId,
        metaphor: this.createHexagramMetaphor(this.personality.engineOS),
        characteristics: this.translateToPoetry(this.personality.engineOS.characteristics),
        ancientWisdom: this.getAncientWisdom(this.personality.engineOS.hexagramId)
      },
      // interfaceOS, safeModeOS も同様
    };
  }
  
  generateRelationshipAnalysis() {
    const relationships = this.personality.relationshipEngine.analyzeCurrentRelationships();
    
    return {
      engineInterface: this.createRelationshipMetaphor(
        relationships.engineInterface,
        '天地否卦のような...'
      ),
      engineSafemode: this.createRelationshipMetaphor(
        relationships.engineSafemode,  
        '山水蒙卦のような...'
      ),
      interfaceSafemode: this.createRelationshipMetaphor(
        relationships.interfaceSafemode,
        '風火家人卦のような...'
      )
    };
  }
}
```

---

## 🎨 Phase 4: UI統合・体験設計

### ResultsView.js 拡張仕様

```javascript
class VirtualPersonalityView {
  constructor(containerId, virtualPersonality) {
    this.container = document.getElementById(containerId);
    this.personality = virtualPersonality;
    this.currentView = 'introduction';
    this.animationQueue = [];
  }
  
  render() {
    this.renderIntroduction();
    this.renderOSPersonalities();
    this.renderLiveDialogue();
    this.renderIchingWisdom();
    this.renderInteractiveScenarios();
  }
  
  renderLiveDialogue() {
    // リアルタイムでOS同士が対話する様子を表示
    const dialogueContainer = this.createDialogueContainer();
    
    // ユーザーがシナリオを選択すると、3つのOSが議論を始める
    this.startLiveSimulation();
  }
  
  startLiveSimulation() {
    const scenarios = [
      '重要な決断を迫られた時',
      '人間関係でストレスを感じた時', 
      '新しいチャレンジに直面した時'
    ];
    
    scenarios.forEach(scenario => {
      const dialogue = this.personality.relationshipEngine.simulateOSDialogue(scenario);
      this.animateDialogue(dialogue);
    });
  }
}
```

---

## 📊 実装チェックリスト

### Phase 1: 仮想人格基盤システム
- [ ] VirtualPersonality.js 基本クラス実装
- [ ] PersonalityOS.js 基本クラス実装  
- [ ] ユーザー回答からOS特性抽出ロジック
- [ ] 基本テスト・動作確認
- [ ] **Git Checkpoint 1**

### Phase 2: OS関係性エンジン
- [ ] OSRelationshipEngine.js 実装
- [ ] OS間関係性分析ロジック
- [ ] 内部対話シミュレーション機能
- [ ] 関係性テスト・検証
- [ ] **Git Checkpoint 2**

### Phase 3: 易経メタファーエンジン
- [ ] IchingMetaphorEngine.js 拡張
- [ ] 64卦データベース統合
- [ ] 物語生成システム実装
- [ ] 易経解説テスト・品質確認
- [ ] **Git Checkpoint 3**

### Phase 4: UI統合・体験最適化
- [ ] VirtualPersonalityView.js 実装
- [ ] ResultsView.js 統合
- [ ] インタラクティブ対話UI
- [ ] 全体統合テスト
- [ ] **Final Git Checkpoint**

---

## 🛡️ 処理落ち対策

### 独立実行設計
各Phaseは前のPhaseの成果物を利用するが、独立して実行・テスト可能。

### プログレス管理
```javascript
const IMPLEMENTATION_PROGRESS = {
  phase1_virtual_personality: false,
  phase2_relationship_engine: false, 
  phase3_iching_metaphor: false,
  phase4_ui_integration: false
};
```

### バックアップポイント
- 各Phase完了時の自動コミット
- 重要ファイルのスナップショット保存
- ロールバック機能の確保

---

## 🎯 期待される革新的成果

### ユーザー体験の革命
**Before**: 「あなたは◯◯タイプです」  
**After**: 「あなたの中の3つのOSが対話しています...価値観OS『乾』が言いました："私は理想を追求したい"。社会的OS『兌』が応答しました："でも周囲との調和も大切よ"。防御OS『艮』が割り込みました："まずは安全を確保しましょう"」

### 市場での差別化
- 他の診断ツールとの圧倒的差別化
- 易経という古代智慧 × 現代心理学の融合
- インタラクティブな仮想人格体験

この設計仕様書に基づき、段階的に実装を進めていきます。