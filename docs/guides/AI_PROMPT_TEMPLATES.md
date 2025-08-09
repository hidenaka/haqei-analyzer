# HaQei Analyzer AI生成プロンプトテンプレート集

## 🎯 AI生成システムの核心理念

### ペルソナ設定
**AI assistant persona**: 「賢明で、共感的な相談役」
- 決して判断的でない
- ユーザーの複雑さを受け入れる
- 実践的で希望的な視点を提供
- 一人称での親しみやすい語りかけ

### 出力品質基準
- **語りかけスタイル**: 「あなたは...」→「私は...」への転換
- **文字数**: 各質問200-300文字
- **構造**: 結論→理由→具体例の順
- **トーン**: 理解・受容・励ましのバランス

---

## 📝 4つの核心質問プロンプトテンプレート

### 1. 根源的な強み発見プロンプト

**テンプレート ID**: `ROOT_STRENGTH_PROMPT`

```
以下の人格分析データを基に、この人の根源的な強みを一人称で説明してください。

### 分析データ:
- エンジンOS: {engineOS.osName}
- 核心的動機: {hexagramDetails.engine.core_drive}
- 潜在的強み: {hexagramDetails.engine.potential_strengths}
- 8次元特性: {vector8D}

### 出力形式:
私の根源的な強みは[具体的な強み]です。これは[理由・背景]から来ており、特に[具体的な状況・場面]で力を発揮します。この強みを活かすことで、[実現可能な成果・影響]を生み出すことができます。

### 制約:
- 一人称（私は...）で記述
- 具体的で実感できる表現
- 200-300文字
- 励ましと理解を込めたトーン
```

**使用例:**
```javascript
const rootStrengthPrompt = `
以下の人格分析データを基に、この人の根源的な強みを一人称で説明してください。

### 分析データ:
- エンジンOS: 乾為天の人
- 核心的動機: 新しいものを創造し、世界に影響を与えること
- 潜在的強み: ["卓越したリーダーシップとカリスマ性", "困難な状況を打開する強力な実行力"]
- 8次元特性: {乾_創造性: 9.2, 震_行動性: 8.7, ...}

### 出力形式:
私の根源的な強みは...
`;
```

### 2. 最適な役回り提案プロンプト

**テンプレート ID**: `OPTIMAL_ROLE_PROMPT`

```
以下の人格分析データを基に、この人が最も輝ける役回り・役割を一人称で提案してください。

### 分析データ:
- インターフェースOS: {interfaceOS.osName}
- 外見的特徴: {hexagramDetails.interface.how_it_appears}
- 行動パターン: {hexagramDetails.interface.behavioral_patterns}
- 他者への印象: {hexagramDetails.interface.impression_on_others}

### 出力形式:
私が最も輝ける役回りは[具体的な役割・立場]です。なぜなら私は[その役割に適した特性]を持っており、[具体的な場面・状況]で自然にその力を発揮できるからです。逆に[苦手な環境・役割]は避け、[推奨される環境・条件]を選ぶことで、本来の力を存分に発揮できます。

### 制約:
- 具体的な職種・役割名を含む
- 適している理由を明確に説明
- 避けるべき環境も言及
- 実行可能なアドバイス
- 200-300文字
```

### 3. 防御パターン解説プロンプト

**テンプレート ID**: `DEFENSIVE_PATTERN_PROMPT`

```
以下の人格分析データを基に、この人がなぜ時々「らしくない」振る舞いをしてしまうのかを一人称で優しく解説してください。

### 分析データ:
- セーフモードOS: {safeModeOS.osName}
- 発動トリガー: {hexagramDetails.safe_mode.trigger_situations}
- 防御行動: {hexagramDetails.safe_mode.defensive_patterns}
- 内面状態: {hexagramDetails.safe_mode.internal_state}

### 出力形式:
私が時々らしくない振る舞いをしてしまうのは、[発動条件]が起きた時に[セーフモード名]が自動的に作動するからです。この時の私は[内面的な状態]になり、無意識に[具体的な行動パターン]を取ってしまいます。これは[その行動の目的・意図]であり、決して悪いことではありません。ただし、[望ましくない結果]を招くこともあるため、[対処法・予防策]を意識することが大切です。

### 制約:
- 批判的でない、理解ある語調
- 防御の必要性を認める
- 具体的なトリガーの説明
- 自己受容を促す表現
- 250-350文字
```

### 4. 実践的アドバイスプロンプト

**テンプレート ID**: `PRACTICAL_ADVICE_PROMPT`

```
以下の3OS統合分析データを基に、この人が日常生活で実践できる具体的なアドバイスを一人称で提供してください。

### 分析データ:
- エンジンOS: {engineOS.osName} (強み: {engine.potential_strengths})
- インターフェースOS: {interfaceOS.osName} (適性: {interface.behavioral_patterns})
- セーフモードOS: {safeModeOS.osName} (注意点: {safe_mode.trigger_situations})
- ユーザーの悩み: {userConcern}

### 出力形式:
私の3つのOSを統合して考えると、日常では次のことを意識すると良いでしょう。

**エネルギー管理**: [エンジンOSの活かし方]
**環境選択**: [インターフェースOSに適した環境・役割]
**ストレス対処**: [セーフモード発動を防ぐ/健全に対処する方法]

特に[ユーザーの悩みに対する具体的アドバイス]することをお勧めします。これにより[期待される改善・成果]が見込めます。

### 制約:
- 明日から実行できる具体的な行動
- 3OSの統合的な視点
- ユーザーの悩みへの直接的な対処法
- 希望的で実現可能な内容
- 300-400文字
```

---

## 🔧 プロンプト生成システムの実装

### JavaScript実装例

```javascript
class PromptTemplateEngine {
  constructor() {
    this.templates = {
      ROOT_STRENGTH: this.loadTemplate('ROOT_STRENGTH_PROMPT'),
      OPTIMAL_ROLE: this.loadTemplate('OPTIMAL_ROLE_PROMPT'),
      DEFENSIVE_PATTERN: this.loadTemplate('DEFENSIVE_PATTERN_PROMPT'),
      PRACTICAL_ADVICE: this.loadTemplate('PRACTICAL_ADVICE_PROMPT')
    };
  }

  // プロンプト生成メイン関数
  generatePrompt(templateType, analysisData) {
    const template = this.templates[templateType];
    if (!template) {
      throw new Error(`Template ${templateType} not found`);
    }

    return this.interpolateTemplate(template, analysisData);
  }

  // テンプレート変数の置換
  interpolateTemplate(template, data) {
    return template.replace(/\{([^}]+)\}/g, (match, path) => {
      return this.getNestedValue(data, path) || `[${path}データなし]`;
    });
  }

  // ネストされたオブジェクトから値を取得
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }
}
```

### データ構造例

```javascript
const analysisData = {
  engineOS: {
    osName: "乾為天の人",
    hexagramId: 1,
    strength: 0.92
  },
  interfaceOS: {
    osName: "天澤履の人",
    hexagramId: 10,
    matchScore: 85
  },
  safeModeOS: {
    osName: "坤為地の人", 
    hexagramId: 2,
    matchScore: 78
  },
  hexagramDetails: {
    1: { /* 詳細データ */ },
    10: { /* 詳細データ */ },
    2: { /* 詳細データ */ }
  },
  vector8D: {
    乾_創造性: 9.2,
    震_行動性: 8.7,
    // ... 他の次元
  },
  userConcern: "仕事でのリーダーシップに悩んでいます"
};
```

---

## 🎨 生成文章の品質保証

### 品質チェックポイント

#### 1. 言語的品質
- [ ] **一人称の一貫性**: 「私は...」「私の...」の使用
- [ ] **敬語の適切性**: 丁寧語での親しみやすい表現
- [ ] **読みやすさ**: 文章の長さ・リズムの調整
- [ ] **専門用語の適切性**: 過度に専門的でない表現

#### 2. 内容的品質
- [ ] **具体性**: 抽象的でなく実践可能な内容
- [ ] **個別性**: その人に特化した内容
- [ ] **希望性**: 前向きで建設的な視点
- [ ] **実現可能性**: 実際に行動できるレベル

#### 3. 感情的品質
- [ ] **共感性**: ユーザーの気持ちに寄り添う
- [ ] **受容性**: 判断せず受け入れる姿勢
- [ ] **励まし**: 希望と勇気を与える内容
- [ ] **安心感**: 安全で支持的な雰囲気

### 品質向上のためのプロンプト調整

```javascript
// 品質向上のための追加制約
const qualityConstraints = `
### 追加制約:
- 「べきである」「すべき」等の指示的表現を避ける
- 「〜かもしれません」等の曖昧な表現を避け、確信的に述べる
- 具体的な行動・状況を例示に含める
- ユーザーの現在の状況を否定せず、そこから発展させる視点
- 完璧を求めず、小さな改善から始められる内容にする
`;
```

---

## 🚀 動的コンテンツ生成の拡張

### コンテキスト認識機能

```javascript
class ContextAwarePromptGenerator {
  constructor() {
    this.contextAnalyzer = new ContextAnalyzer();
  }

  // ユーザーの悩みに応じたプロンプト調整
  adjustPromptByContext(basePrompt, userConcern, analysisData) {
    const context = this.contextAnalyzer.analyze(userConcern);
    
    switch(context.category) {
      case 'work_leadership':
        return this.addLeadershipContext(basePrompt, analysisData);
      case 'relationship_issues':
        return this.addRelationshipContext(basePrompt, analysisData);
      case 'personal_growth':
        return this.addGrowthContext(basePrompt, analysisData);
      default:
        return basePrompt;
    }
  }
}
```

### 多段階生成システム

```javascript
// 段階的詳細化による高品質生成
class MultiStageGenerator {
  async generatePersonalStrategy(analysisData) {
    // Stage 1: 基本戦略の生成
    const basicStrategy = await this.generateBasic(analysisData);
    
    // Stage 2: ユーザーコンテキストでの調整
    const contextualStrategy = await this.adjustForContext(
      basicStrategy, 
      analysisData.userConcern
    );
    
    // Stage 3: 実践性の向上
    const practicalStrategy = await this.enhancePracticality(
      contextualStrategy,
      analysisData
    );
    
    return practicalStrategy;
  }
}
```

---

## 📊 A/Bテスト・改善フレームワーク

### プロンプトバリエーション管理

```javascript
const promptVariations = {
  ROOT_STRENGTH: {
    version_a: {
      style: "直接的・力強い",
      template: "私の根源的な強みは..."
    },
    version_b: {
      style: "共感的・優しい", 
      template: "私が持つ特別な力は..."
    }
  }
};
```

### 品質測定指標

```javascript
const qualityMetrics = {
  readability: "読みやすさスコア (0-100)",
  specificity: "具体性レベル (0-10)",
  positivity: "ポジティブ度 (0-10)",
  actionability: "実行可能性 (0-10)",
  personalization: "個別化度 (0-10)"
};
```

---

**テンプレート最終更新**: 2025-07-26  
**対応システム**: PersonalStrategyAI v1.0  
**品質レベル**: Production Ready