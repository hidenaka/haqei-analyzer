# HaQei専門エージェント協調実例集

## 🎯 専門エージェントの活用事例

### 📱 Case 1: JavaScript構文エラー緊急修正

```javascript
// 現在の最重大問題を解決
async function fixDuplicateDeclarations() {
  // 1. CTOが問題分析と指揮
  const errorAnalysis = await Task("エラー分析", "haqei-cto", 
    "DynamicKeywordGeneratorの重複宣言エラーを分析し、修正方針を決定"
  );
  
  // 2. 並列調査（複数エージェント同時起動）
  await Promise.all([
    Task("ファイル調査", "researcher", 
      "grep -r 'DynamicKeywordGenerator' でファイル特定"),
    Task("依存関係分析", "system-architect", 
      "モジュール間の依存関係を調査"),
    Task("影響範囲確認", "haqei-programmer", 
      "変更による影響を.serena/memoriesから確認")
  ]);
  
  // 3. 修正実装
  await Task("修正実装", "haqei-programmer",
    "重複宣言を除去し、適切なモジュール構造に修正"
  );
  
  // 4. 検証
  await Task("動作検証", "haqei-qa-tester",
    "PlaywrightでFuture Simulatorの動作を確認"
  );
  
  // 5. 報告
  await Task("完了報告", "haqei-reporter",
    "修正完了と動作確認結果を日本語で報告"
  );
}
```

### 🔮 Case 2: Future Simulator精度向上（91.3%→95%目標）

```javascript
async function improveFutureSimulatorAccuracy() {
  // 易経専門家主導の改善
  
  // 1. 現状分析（易経専門家）
  const accuracyIssues = await Task("精度分析", "haqei-iching-expert",
    `現在の精度91.3%の問題点を分析：
    - 64卦の解釈精度
    - 爻辞の適用ロジック
    - 序卦伝の遷移パターン`
  );
  
  // 2. 改善計画（CTO + 易経専門家）
  await Promise.all([
    Task("技術計画", "haqei-cto", 
      "精度向上のための技術的アプローチ策定"),
    Task("易経理論確認", "haqei-iching-expert",
      "古典テキストとの整合性確認")
  ]);
  
  // 3. 並列実装
  await Promise.all([
    Task("計算ロジック改善", "haqei-programmer",
      "public/js/pages/future-simulator/TextToIChingEngine.js修正"),
    Task("爻辞精度向上", "haqei-iching-expert",
      "384爻の解釈精度向上"),
    Task("UI最適化", "haqei-strategy-navigator",
      "ユーザー入力の質を向上させるUI改善")
  ]);
  
  // 4. 統合テスト
  await Task("精度検証", "haqei-qa-tester",
    "1000パターンのテストケースで精度測定"
  );
}
```

### 🏛️ Case 3: Triple OS Architecture完全統合

```javascript
async function integrateTripleOSArchitecture() {
  // Strategy Navigator主導
  
  // 1. 哲学的基盤確立
  await Task("哲学定義", "haqei-strategy-navigator",
    `HaQei哲学に基づくTriple OS設計：
    - Engine OS: 本質的自己
    - Interface OS: 社会的自己
    - Safe Mode OS: 防衛的自己`
  );
  
  // 2. 要件定義（並列）
  await Promise.all([
    Task("技術要件", "haqei-requirements-analyst",
      "Triple OS統合の技術仕様策定"),
    Task("易経統合", "haqei-iching-expert",
      "Triple OSと64卦のマッピング設計")
  ]);
  
  // 3. モジュール別実装（大規模並列）
  await Promise.all([
    // Engine OS実装チーム
    Task("Engine OS実装", "haqei-programmer",
      "public/js/core/TripleOSEngine.js - Engine部分"),
    
    // Interface OS実装チーム
    Task("Interface OS実装", "coder",
      "public/js/core/TripleOSEngine.js - Interface部分"),
    
    // Safe Mode OS実装チーム
    Task("Safe Mode実装", "haqei-programmer",
      "public/js/core/TripleOSEngine.js - SafeMode部分"),
    
    // UI統合チーム
    Task("UI統合", "haqei-strategy-navigator",
      "7段階ナビゲーションとの統合")
  ]);
  
  // 4. 品質保証
  await Promise.all([
    Task("機能テスト", "haqei-qa-tester",
      "Triple OS切り替えテスト"),
    Task("哲学検証", "haqei-strategy-navigator",
      "HaQei哲学との整合性確認"),
    Task("易経検証", "haqei-iching-expert",
      "易経理論との一貫性確認")
  ]);
}
```

### 🚨 Case 4: 404エラー大量修正

```javascript
async function fixMissingFiles() {
  // 並列処理で高速修正
  
  // 1. 問題の全容把握
  const missingFiles = await Task("404調査", "researcher",
    "コンソールログから全404エラーをリストアップ"
  );
  
  // 2. 修正方針決定
  await Task("方針決定", "haqei-cto",
    "Missing Filesの処理方針（作成/削除/代替）を決定"
  );
  
  // 3. 並列修正（最大10エージェント同時起動）
  const fixes = missingFiles.map(file => 
    Task(`${file}修正`, "coder", `${file}を作成または参照を削除`)
  );
  await Promise.all(fixes.slice(0, 10)); // 最初の10個
  await Promise.all(fixes.slice(10, 20)); // 次の10個
  
  // 4. 統合確認
  await Task("動作確認", "haqei-qa-tester",
    "全ページでコンソールエラーが0になったことを確認"
  );
}
```

### 📊 Case 5: 月次品質改善サイクル

```javascript
async function monthlyQualityImprovement() {
  // 定期的な品質向上プロセス
  
  // Week 1: 分析
  const week1 = await Promise.all([
    Task("コード品質分析", "code-analyzer",
      "Serena MCPでコード品質メトリクス取得"),
    Task("パフォーマンス分析", "performance-benchmarker",
      "ページロード時間とメモリ使用量測定"),
    Task("易経精度分析", "haqei-iching-expert",
      "卦象解釈の精度評価")
  ]);
  
  // Week 2: 計画
  await Task("改善計画", "haqei-cto",
    "分析結果から優先度付けした改善計画策定"
  );
  
  // Week 3: 実装
  await Promise.all([
    Task("リファクタリング", "haqei-programmer",
      "重複コード除去と構造改善"),
    Task("パフォーマンス最適化", "coder",
      "レンダリング最適化とバンドルサイズ削減"),
    Task("テスト追加", "tester",
      "カバレッジ80%達成のためのテスト追加")
  ]);
  
  // Week 4: 検証と報告
  await Promise.all([
    Task("統合テスト", "haqei-qa-tester",
      "全機能の回帰テスト実施"),
    Task("報告書作成", "haqei-reporter",
      "月次改善報告書を日本語で作成")
  ]);
}
```

## 📋 エージェント選択ガイドライン

### いつどのエージェントを使うか

| 状況 | 主導エージェント | サポートエージェント |
|------|-----------------|-------------------|
| 要件不明確 | haqei-cto | haqei-requirements-analyst |
| 易経ロジックエラー | haqei-iching-expert | haqei-programmer |
| UI/UX問題 | haqei-strategy-navigator | coder |
| パフォーマンス問題 | performance-benchmarker | haqei-programmer |
| バグ修正 | haqei-programmer | haqei-qa-tester |
| 新機能追加 | haqei-requirements-analyst | haqei-cto, haqei-programmer |
| テスト | haqei-qa-tester | haqei-iching-expert |
| ドキュメント | haqei-reporter | haqei-requirements-analyst |

## 🚀 並列実行のベストプラクティス

```javascript
// ✅ GOOD: 関連性の低いタスクは並列化
await Promise.all([
  Task("UI修正", "coder", "..."),
  Task("データ処理", "haqei-programmer", "..."),
  Task("ドキュメント更新", "haqei-reporter", "...")
]);

// ❌ BAD: 依存関係のあるタスクを並列化
// これはダメ（後者が前者に依存）
await Promise.all([
  Task("インターフェース定義", "haqei-requirements-analyst", "..."),
  Task("実装", "haqei-programmer", "...") // インターフェースが必要
]);

// ✅ GOOD: 依存関係は直列に
const interface = await Task("インターフェース定義", "haqei-requirements-analyst", "...");
await Task("実装", "haqei-programmer", `${interface}を実装`);
```

## 🎯 効果的な協調のコツ

1. **専門性を活かす**: 易経なら`haqei-iching-expert`、哲学なら`haqei-strategy-navigator`
2. **並列化を最大化**: 独立したタスクは必ず並列実行
3. **メモリを活用**: `.serena/memories`の過去の知見を必ず確認
4. **検証を怠らない**: 実装後は必ず`haqei-qa-tester`でMCP検証
5. **報告を忘れない**: 完了時は`haqei-reporter`で日本語報告

---
記録日: 2025-01-07
専門エージェント協調による大規模プロジェクト管理