# HaQei記憶系MCP統合ガイド

## 🧠 3層記憶アーキテクチャ

```
┌─────────────────────────────────────────────┐
│           人間可読層 (.serena/memories)       │
│  - Markdown形式                              │
│  - 意思決定記録                              │
│  - エラー解決履歴                            │
└─────────────────────────────────────────────┘
                    ↑↓
┌─────────────────────────────────────────────┐
│        プロジェクト記憶層 (Cipher MCP)        │
│  - HaQei哲学                                │
│  - 重要決定事項                              │
│  - エラーパターン                            │
└─────────────────────────────────────────────┘
                    ↑↓
┌─────────────────────────────────────────────┐
│         コード分析層 (Serena MCP)            │
│  - 依存関係グラフ                            │
│  - 関数マップ                                │
│  - コード品質メトリクス                       │
└─────────────────────────────────────────────┘
```

## 📝 実装段階での記憶保存パターン

### 1️⃣ 要件定義フェーズ

```javascript
async function saveRequirementsPhase() {
  // CTOが要件を決定
  const requirements = await haQeiCTO.defineRequirements();
  
  // 記憶保存（並列実行）
  await Promise.all([
    // Cipher: プロジェクトレベルの決定事項
    cipherMCP.store('requirements/latest', {
      date: new Date().toISOString(),
      requirements,
      rationale: "ユーザー要求に基づく",
      approvedBy: "haqei-cto"
    }),
    
    // .serena/memories: 人間用ドキュメント
    fs.writeFile(
      `.serena/memories/requirements_${Date.now()}.md`,
      formatRequirementsAsMarkdown(requirements)
    ),
    
    // Serena: 既存コードとの整合性分析
    serenaMCP.analyzeCompatibility(requirements)
  ]);
}
```

### 2️⃣ 設計フェーズ

```javascript
async function saveDesignPhase() {
  // アーキテクト設計
  const architecture = await systemArchitect.design();
  
  // 易経専門家の検証
  const validation = await haQeiIChingExpert.validate(architecture);
  
  // 記憶保存
  await Promise.all([
    // Serena: アーキテクチャ分析と依存関係マップ
    serenaMCP.mapArchitecture({
      modules: architecture.modules,
      dependencies: architecture.dependencies,
      interfaces: architecture.interfaces
    }),
    
    // Cipher: 設計決定の理由
    cipherMCP.store('design/decisions', {
      architecture,
      validation,
      tradeoffs: architecture.tradeoffs,
      alternatives: architecture.alternatives
    })
  ]);
}
```

### 3️⃣ 実装フェーズ

```javascript
async function saveImplementationPhase() {
  // 並列実装
  const implementations = await Promise.all([
    haQeiProgrammer.implementCore(),
    coder.implementUI(),
    haQeiIChingExpert.implement64Hexagrams()
  ]);
  
  // 実装完了ごとに記憶
  for (const impl of implementations) {
    await Promise.all([
      // Serena: コード構造を自動インデックス
      serenaMCP.indexCode(impl.files),
      
      // Tsumiki: 品質メトリクス記録
      tsumikiMCP.recordQuality({
        complexity: impl.complexity,
        coverage: impl.testCoverage,
        performance: impl.metrics
      }),
      
      // Cipher: 実装上の工夫と判断
      cipherMCP.store(`implementation/${impl.module}`, {
        decisions: impl.decisions,
        optimizations: impl.optimizations,
        knownIssues: impl.issues
      })
    ]);
  }
}
```

### 4️⃣ エラー修正フェーズ

```javascript
async function saveErrorFixPhase(error) {
  console.log("🔍 エラー分析開始:", error);
  
  // Step 1: 既存の知識を検索
  const pastSolutions = await Promise.all([
    cipherMCP.search(`error:${error.type}`),
    serenaMCP.findSimilarErrors(error.stack)
  ]);
  
  if (pastSolutions.length > 0) {
    console.log("✅ 過去の解決策発見:", pastSolutions[0]);
    return pastSolutions[0].solution;
  }
  
  // Step 2: 新規エラーの解決
  const solution = await haQeiProgrammer.fixError(error);
  
  // Step 3: 解決策を記憶
  await Promise.all([
    // エラーパターンを学習
    cipherMCP.store(`errors/${error.type}_${Date.now()}`, {
      error: {
        message: error.message,
        stack: error.stack,
        file: error.file
      },
      solution: {
        fix: solution.fix,
        rootCause: solution.rootCause,
        prevention: solution.prevention
      },
      timestamp: Date.now()
    }),
    
    // コード変更を記録
    serenaMCP.recordChanges({
      before: solution.before,
      after: solution.after,
      reason: solution.rootCause
    }),
    
    // 人間用の記録
    fs.writeFile(
      `.serena/memories/error_fix_${Date.now()}.md`,
      `# エラー修正記録\n\n## エラー\n${error.message}\n\n## 原因\n${solution.rootCause}\n\n## 解決策\n${solution.fix}\n\n## 再発防止\n${solution.prevention}`
    )
  ]);
  
  return solution;
}
```

### 5️⃣ テスト完了フェーズ

```javascript
async function saveTestPhase() {
  // テスト実行
  const testResults = await haQeiQATester.runFullTests();
  
  // 記憶保存
  await Promise.all([
    // Tsumiki: テスト結果と品質スコア
    tsumikiMCP.saveTestResults({
      passed: testResults.passed,
      failed: testResults.failed,
      coverage: testResults.coverage,
      performance: testResults.performance
    }),
    
    // Cipher: テストで発見した知見
    cipherMCP.store('testing/insights', {
      discoveries: testResults.discoveries,
      edgeCases: testResults.edgeCases,
      improvements: testResults.suggestions
    }),
    
    // Serena: カバレッジマップ
    serenaMCP.mapTestCoverage(testResults.coverage)
  ]);
}
```

## 🔄 記憶活用パターン

### パターン1: 類似エラーの即座解決

```javascript
class SmartErrorResolver {
  async resolve(error) {
    // 1. 記憶から類似エラーを検索
    const memories = await Promise.all([
      cipherMCP.search(`error:*${error.message}*`),
      this.readLocalMemories(error.type)
    ]);
    
    // 2. 解決策が見つかった場合
    if (memories[0].length > 0) {
      const solution = memories[0][0];
      console.log("🎯 過去の解決策を適用:", solution);
      
      // 3. 解決策を適用
      await this.applySolution(solution);
      
      // 4. 成功を記録
      await cipherMCP.incrementSuccessCount(solution.id);
      
      return true;
    }
    
    // 5. 新規エラーとして処理
    return false;
  }
}
```

### パターン2: 設計判断の参照

```javascript
async function makeDesignDecision(feature) {
  // 過去の類似機能の設計を参照
  const pastDesigns = await Promise.all([
    cipherMCP.search(`design:${feature.type}`),
    serenaMCP.findSimilarModules(feature.description)
  ]);
  
  if (pastDesigns[0].length > 0) {
    console.log("📚 過去の設計パターンを参考に:");
    pastDesigns[0].forEach(design => {
      console.log(`  - ${design.module}: ${design.pattern}`);
    });
  }
  
  // 新しい設計を決定
  const newDesign = await systemArchitect.design(feature, pastDesigns);
  
  // 新設計も記憶に追加
  await cipherMCP.store(`design/${feature.name}`, newDesign);
  
  return newDesign;
}
```

## 📊 記憶統計ダッシュボード

```javascript
async function generateMemoryDashboard() {
  const stats = await Promise.all([
    // Cipher統計
    cipherMCP.getStats(),
    
    // Serena統計  
    serenaMCP.getCodeMetrics(),
    
    // Tsumiki統計
    tsumikiMCP.getQualityTrends(),
    
    // ローカルファイル統計
    countLocalMemories()
  ]);
  
  console.log(`
📊 HaQei記憶システム統計
========================
Cipher記憶: ${stats[0].totalMemories}個
  - エラーパターン: ${stats[0].errorPatterns}個
  - 設計決定: ${stats[0].designDecisions}個
  - 実装知見: ${stats[0].implementations}個

Serenaコード分析: 
  - インデックス済み関数: ${stats[1].functions}個
  - 依存関係マップ: ${stats[1].dependencies}個
  - 品質スコア: ${stats[1].qualityScore}/100

Tsumiki品質記録:
  - テスト実行: ${stats[2].testRuns}回
  - 平均カバレッジ: ${stats[2].avgCoverage}%
  - 品質トレンド: ${stats[2].trend}

ローカル記憶:
  - .serena/memories: ${stats[3].files}ファイル
  - 総容量: ${stats[3].size}MB
  `);
}
```

## 🚀 実行コマンド例

```bash
# 記憶システム初期化
npm run mcp:memory:init

# 現在の記憶を全保存
npm run mcp:memory:snapshot

# エラーパターンを学習
npm run mcp:memory:learn-errors

# 記憶から検索
npm run mcp:memory:search "DynamicKeywordGenerator"

# 記憶統計表示
npm run mcp:memory:stats

# 記憶をバックアップ
npm run mcp:memory:backup
```

## 🎯 効果

1. **エラー解決速度**: 類似エラーは即座に解決（10秒以内）
2. **知識の蓄積**: 全ての決定と解決策が永続化
3. **品質向上**: 過去の失敗から自動学習
4. **チーム効率**: 誰でも過去の知見にアクセス可能
5. **一貫性確保**: 設計判断の根拠が明確

---
記録日: 2025-01-07
記憶系MCP統合による知識継承システム