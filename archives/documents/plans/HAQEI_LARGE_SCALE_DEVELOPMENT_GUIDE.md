# HaQei大規模プロジェクト開発ガイド

## 🎯 プロジェクト現状と課題

### 規模指標
- **コードベース**: 587,208行
- **ファイル数**: 17,419個
- **戦略パターン**: 1,572,864通り
- **現在の問題**: JavaScript構文エラーでシステム停止中

## 🏗️ 段階的改善戦略

### Phase 1: 緊急安定化 (1-3日)
```javascript
// 最優先タスク
const emergency = {
  1: "重複宣言エラー修正",
  2: "404ファイル作成",
  3: "基本動作復旧確認"
};
```

### Phase 2: アーキテクチャ整理 (1週間)
```javascript
// モジュール分離
const architecture = {
  core: ["OS Analyzer", "Future Simulator", "Strategic Cockpit"],
  utils: ["DataManager", "EventBus", "ErrorHandler"],
  ui: ["Components", "Views", "Styles"]
};
```

### Phase 3: 品質標準化 (2週間)
```javascript
// 品質ゲート
const qualityGates = {
  gate1: "構文チェック",
  gate2: "依存関係検証",
  gate3: "単体テスト",
  gate4: "統合テスト",
  gate5: "MCP動作確認"
};
```

## 🔧 実装ルール

### 1. モジュール開発原則

```javascript
// ❌ BAD: 密結合
class BadModule {
  constructor() {
    this.otherModule = window.otherModule; // 直接参照
    this.data = globalData; // グローバル依存
  }
}

// ✅ GOOD: 疎結合
class GoodModule {
  constructor(config) {
    this.config = config; // 注入
    this.eventBus = config.eventBus; // インターフェース経由
  }
  
  communicate(event, data) {
    this.eventBus.emit(event, data); // イベント通信
  }
}
```

### 2. エラー処理統一

```javascript
// 統一エラーハンドラー
class HaQeiError extends Error {
  constructor(code, message, context) {
    super(message);
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
  }
  
  log() {
    console.error(`[${this.code}] ${this.message}`, this.context);
    // .serena/memoriesに記録
    this.saveToMemory();
  }
}

// 使用例
try {
  // 処理
} catch (error) {
  throw new HaQeiError('CORE_001', 'Module initialization failed', {
    module: 'OSAnalyzer',
    original: error
  });
}
```

### 3. ファイル整理規則

```
haqei-analyzer/
├── src/                    # ソースコード
│   ├── core/              # コア機能
│   │   ├── os-analyzer/
│   │   ├── future-simulator/
│   │   └── strategic-cockpit/
│   ├── shared/            # 共有モジュール
│   │   ├── utils/
│   │   ├── services/
│   │   └── constants/
│   └── ui/                # UI層
│       ├── components/
│       ├── views/
│       └── styles/
├── tests/                 # テスト
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/                  # ドキュメント
    ├── architecture/
    ├── api/
    └── guides/
```

## 📋 開発チェックリスト

### 新機能追加時

- [ ] 既存実装の確認 (`grep -r "機能名"`)
- [ ] インターフェース定義
- [ ] 依存関係の明確化
- [ ] エラーハンドリング設計
- [ ] テストケース作成
- [ ] ドキュメント更新

### バグ修正時

- [ ] 影響範囲の特定
- [ ] 根本原因の分析
- [ ] 修正案の検討
- [ ] 副作用の確認
- [ ] リグレッションテスト
- [ ] **記憶系MCP実行**：
  - [ ] Serena: 変更ファイルの依存関係記録
  - [ ] Cipher: エラーパターンと解決策保存
  - [ ] .serena/memories: 修正履歴記録

### リファクタリング時

- [ ] 対象モジュールの分離
- [ ] インターフェース保持
- [ ] 段階的移行計画
- [ ] 互換性の維持
- [ ] パフォーマンス計測
- [ ] ロールバック計画

## 🚀 エージェント協調プロトコル

### HaQei専門エージェント活用戦略

```javascript
const haQeiSpecialistAgents = {
  // 🎯 意思決定層
  "haqei-cto": {
    role: "技術的意思決定・タスク配分",
    when: "要件不明確、大規模変更、アーキテクチャ決定",
    priority: "HIGHEST"
  },
  
  // 🔮 易経専門層
  "haqei-iching-expert": {
    role: "易経ロジック検証・64卦精度確認",
    when: "卦象計算、爻辞解釈、序卦伝実装",
    critical: "Future Simulator精度に直結"
  },
  
  // 🎨 HaQei哲学層
  "haqei-strategy-navigator": {
    role: "HaQei哲学統合・7段階ナビゲーション",
    when: "Triple OS設計、ユーザー体験設計",
    critical: "システム全体の一貫性"
  },
  
  // 💻 実装層
  "haqei-programmer": {
    role: "HaQei固有機能実装・localStorage管理",
    when: "OS Analyzer、Future Simulator実装",
    must: "メモリ確認後に実装"
  },
  
  // 📋 要件層
  "haqei-requirements-analyst": {
    role: "易経統合要件定義・仕様策定",
    when: "新機能追加、インターフェース設計",
    output: "requirements.md"
  },
  
  // ✅ 品質層
  "haqei-qa-tester": {
    role: "MCP動作検証・易経精度テスト",
    when: "実装完了後、リリース前",
    must: "Playwright必須"
  },
  
  // 📊 報告層
  "haqei-reporter": {
    role: "進捗報告・ユーザー向け説明",
    when: "マイルストーン達成、エラー発生時",
    format: "日本語優先"
  }
};
```

### 大規模プロジェクト並列実行パターン

```javascript
// Phase 0: 易経検証（必須）
await Promise.all([
  haQeiIChingExpert.validate64Hexagrams(),
  haQeiStrategyNavigator.verifyPhilosophy()
]);

// Phase 1: 要件定義（CTO主導）
const requirements = await haQeiCTO.analyzeRequirements();
await Promise.all([
  haQeiRequirementsAnalyst.defineSpecs(requirements),
  haQeiIChingExpert.validateIChingLogic(requirements)
]);

// Phase 2: 並列実装（専門家分担）
await Promise.all([
  // OS Analyzerチーム
  haQeiProgrammer.implementOSAnalyzer(),
  haQeiStrategyNavigator.implementTripleOS(),
  
  // Future Simulatorチーム  
  haQeiProgrammer.implementFutureSimulator(),
  haQeiIChingExpert.implement64HexagramLogic(),
  
  // UIチーム
  coder.implementUIComponents(),
  haQeiStrategyNavigator.implement7StageNavigation()
]);

// Phase 3: 統合テスト（QA主導）
await Promise.all([
  haQeiQATester.testWithPlaywright(),
  haQeiIChingExpert.validateAccuracy(),
  haQeiStrategyNavigator.verifyUserExperience()
]);

// Phase 4: 報告
await haQeiReporter.generateComprehensiveReport();

// Phase 5: 記憶保存（必須）
await Promise.all([
  serenaMCP.saveCodeAnalysis(),
  cipherMCP.saveProjectMemory(),
  tsumikiMCP.saveQualityMetrics()
]);
```

### 🧠 記憶系MCP活用プロトコル

```javascript
const memoryProtocol = {
  // Serena MCP - コード分析と構造記憶
  serena: {
    when: "コード変更後、リファクタリング後",
    saves: "依存関係、関数マップ、コード品質メトリクス",
    command: "mcp:serena:analyze --save-to-memory"
  },
  
  // Cipher MCP - プロジェクト知識と決定事項
  cipher: {
    when: "要件定義後、設計決定後、エラー解決後",
    saves: "決定理由、エラーパターン、解決策",
    command: "mcp:cipher:store --key 'project/decisions'"
  },
  
  // Tsumiki MCP - 品質と進捗記録
  tsumiki: {
    when: "テスト完了後、マイルストーン達成時",
    saves: "テスト結果、品質スコア、改善履歴",
    command: "mcp:tsumiki:record --quality-metrics"
  }
};

// 実行例：各フェーズ完了時の記憶保存
async function savePhaseMemory(phase, results) {
  const memory = {
    phase,
    timestamp: new Date().toISOString(),
    results,
    decisions: [],
    errors: [],
    learnings: []
  };
  
  // 並列保存
  await Promise.all([
    // Serenaでコード構造を記録
    serenaMCP.analyzeCodeChanges(results.files),
    
    // Cipherでプロジェクト記憶を保存
    cipherMCP.saveMemory({
      key: `phase_${phase}_${Date.now()}`,
      data: memory
    }),
    
    // .serena/memoriesに人間可読形式で保存
    fs.writeFile(
      `.serena/memories/${phase}_${new Date().toISOString()}.md`,
      formatMemoryAsMarkdown(memory)
    )
  ]);
}
```

## 📊 品質メトリクス

### 必須達成基準

- **構文エラー**: 0個
- **404エラー**: 0個
- **テストカバレッジ**: 80%以上
- **応答時間**: 2秒以内
- **メモリ使用量**: 100MB以下

### 監視項目

```javascript
const metrics = {
  performance: {
    loadTime: "< 3s",
    interactionDelay: "< 100ms",
    memoryLeak: "none"
  },
  quality: {
    syntaxErrors: 0,
    missingFiles: 0,
    failedTests: 0,
    eslintErrors: 0
  },
  maintenance: {
    duplicateCode: "< 5%",
    cyclomaticComplexity: "< 10",
    documentation: "> 80%"
  }
};
```

## 💾 知識継承システム

### 段階別記憶保存戦略

```javascript
const knowledgeManagement = {
  // Phase 1: 要件定義完了時
  afterRequirements: async (specs) => {
    await cipherMCP.store('requirements', specs);
    await fs.writeFile('.serena/memories/requirements_latest.md', specs);
  },
  
  // Phase 2: 設計完了時
  afterDesign: async (architecture) => {
    await serenaMCP.analyzeArchitecture(architecture);
    await cipherMCP.store('architecture', architecture);
  },
  
  // Phase 3: 実装完了時
  afterImplementation: async (code) => {
    await serenaMCP.indexCodebase();
    await tsumikiMCP.analyzeQuality(code);
    await cipherMCP.store('implementation', code.summary);
  },
  
  // Phase 4: テスト完了時
  afterTesting: async (results) => {
    await tsumikiMCP.saveTestResults(results);
    await cipherMCP.store('test_results', results);
  },
  
  // Phase 5: 統合完了時
  afterIntegration: async (system) => {
    // 全記憶系MCPで包括的保存
    await Promise.all([
      serenaMCP.saveFullAnalysis(),
      cipherMCP.createSnapshot(),
      tsumikiMCP.generateReport()
    ]);
  }
};
```

### エラー学習システム

```javascript
class ErrorLearningSystem {
  async recordError(error) {
    const analysis = {
      error: error.message,
      stack: error.stack,
      context: this.getCurrentContext(),
      timestamp: Date.now()
    };
    
    // パターン分析
    const pattern = await this.analyzePattern(error);
    
    // 記憶保存（3層構造）
    await Promise.all([
      // 1. 即座の記録（Cipher）
      cipherMCP.store(`error_${Date.now()}`, analysis),
      
      // 2. パターン学習（Serena）
      serenaMCP.learnErrorPattern(pattern),
      
      // 3. 人間用ドキュメント（.serena/memories）
      this.saveErrorDocument(analysis)
    ]);
    
    return pattern;
  }
  
  async preventSimilarError(context) {
    // 過去のエラーパターンを検索
    const similarErrors = await Promise.all([
      cipherMCP.search('error_*', context),
      serenaMCP.findSimilarPatterns(context)
    ]);
    
    if (similarErrors.length > 0) {
      console.warn('⚠️ Similar error detected:', similarErrors[0]);
      return similarErrors[0].solution;
    }
    
    return null;
  }
}
```

## 🔄 継続的改善サイクル

### 週次レビュー

1. **月曜**: 問題分析・優先度設定
2. **火-木**: 実装・テスト
3. **金曜**: 統合・リリース準備

### 月次改善

- アーキテクチャレビュー
- パフォーマンス最適化
- 技術的負債の削減
- ドキュメント更新

## 🎯 最終目標

### 6ヶ月後の達成目標

- **コード品質**: A級（Tsumiki標準）
- **パフォーマンス**: 全指標グリーン
- **保守性**: 新機能追加が1日で可能
- **安定性**: 99.9%稼働率
- **スケーラビリティ**: 100万パターン対応

---

記録日: 2025-01-07
最終更新: CLAUDE.md統合による大規模対応強化