# 動的分析機能 技術設計書

## 📋 設計概要
- **作成日**: 2025年8月1日
- **対象**: Future Simulator 動的分析機能強化
- **アーキテクチャ**: Triple OS + 易経64卦システム統合
- **開発手法**: Tsumiki AI駆動開発 + TDD品質保証

## 🏗️ システムアーキテクチャ設計

### 1. DynamicKeywordGenerator クラス設計

```javascript
/**
 * 動的キーワード生成システム - ユーザー入力に適応する高精度キーワード抽出
 * 
 * 目的：
 * - ユーザー入力からリアルタイムでコンテキスト適応キーワード生成
 * - SNSパターン、感情表現、易経64卦との動的マッピング
 * - Triple OSアーキテクチャとの統合
 * 
 * 入力：
 * - inputText: string - ユーザー入力テキスト
 * - contextType: string - コンテキストタイプ（optional）
 * - osContext: object - Triple OS状態情報（optional）
 * 
 * 処理内容：
 * 1. テキスト前処理・正規化
 * 2. kuromoji.js による形態素解析
 * 3. 感情・文脈パターンマッチング
 * 4. SNSパターンとの統合（KeywordExpansionEngine活用）
 * 5. 優先度付きキーワード生成
 * 6. 易経64卦への動的マッピング
 * 
 * 出力：
 * - keywords: Array<{keyword: string, priority: number, category: string}>
 * - confidence: number (0-1)
 * - contextAnalysis: object
 * - hexagramMapping: Array<{hexagram: number, confidence: number}>
 * 
 * 副作用：
 * - キーワードキャッシュの更新
 * - 分析統計の記録
 * 
 * 前提条件：
 * - kuromoji tokenizer が初期化済み
 * - KeywordExpansionEngine が利用可能
 * - SNS_WORRY_PATTERNS データが読み込み済み
 * 
 * エラー処理：
 * - tokenizer 未初期化時はフォールバック処理
 * - 不正入力時は空結果と警告ログ
 * - メモリ不足時は段階的処理切り替え
 */
class DynamicKeywordGenerator {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    this.keywordExpansion = new KeywordExpansionEngine();
    this.emotionPatterns = this.initializeEmotionPatterns();
    this.contextPatterns = this.initializeContextPatterns();
    this.cache = new Map();
    this.statisticsTracker = new AnalysisStatistics();
  }

  /**
   * メインキーワード生成処理
   */
  async generateContextualKeywords(inputText, contextType = null, osContext = null) {
    // 実装詳細は後述
  }

  /**
   * 感情パターン初期化
   */
  initializeEmotionPatterns() {
    // 実装詳細は後述
  }

  /**
   * コンテキストパターン初期化  
   */
  initializeContextPatterns() {
    // 実装詳細は後述
  }
}
```

### 2. IntegratedAnalysisEngine 7段階処理設計

```javascript
/**
 * 統合分析エンジン - bunenjin哲学に基づく7段階包括分析
 * 
 * 目的：
 * - ユーザー入力の多次元的分析と易経マッピング
 * - Triple OSアーキテクチャとの完全統合
 * - 高信頼度の分析結果生成
 * 
 * 入力：
 * - inputText: string - 分析対象テキスト
 * - contextType: string - 事前コンテキスト情報
 * - userPersona: object - ユーザー属性情報
 * 
 * 処理内容：
 * Stage 1: 前処理・正規化（テキスト清浄化、文字コード統一）
 * Stage 2: 形態素・構文解析（kuromoji.js 詳細解析）
 * Stage 3: 動的キーワード抽出（DynamicKeywordGenerator活用）
 * Stage 4: 感情・文脈分析（多次元感情マッピング）
 * Stage 5: Triple OS統合（Engine/Interface/SafeMode相互作用）
 * Stage 6: 易経マッピング（64卦システム精密マッチング）
 * Stage 7: 統合結果生成（信頼度付き最終結果）
 * 
 * 出力：
 * - hexagram: number - 推定卦番号
 * - line: number - 推定爻番号
 * - confidence: number - 総合信頼度
 * - analysis: object - 詳細分析結果
 * - osIntegration: object - Triple OS統合結果
 * - stageResults: Array - 各段階の結果
 * 
 * 副作用：
 * - 分析キャッシュの更新
 * - 統計データの蓄積
 * - ML学習データの記録
 * 
 * 前提条件：
 * - DynamicKeywordGenerator が初期化済み
 * - 易経データベースが読み込み済み
 * - Triple OS状態が設定済み
 * 
 * エラー処理：
 * - 各段階での例外ハンドリング
 * - 段階的フォールバック処理
 * - 品質しきい値による結果検証
 */
class IntegratedAnalysisEngine {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    this.keywordGenerator = new DynamicKeywordGenerator(kuromojiTokenizer);
    this.irregularDetector = new IrregularPatternDetector();
    this.mlIntegration = window.mlIntegration;
    this.analysisCache = new Map();
    this.qualityThreshold = 0.6;
  }

  /**
   * 7段階統合分析実行
   */
  async performSevenStageAnalysis(inputText, contextType = null, userPersona = null) {
    // 実装詳細は後述
  }

  /**
   * Stage 1: 前処理・正規化
   */
  stage1_preprocessing(inputText) {
    // 実装詳細は後述
  }

  /**
   * Stage 2: 形態素・構文解析
   */
  async stage2_morphologicalAnalysis(normalizedText) {
    // 実装詳細は後述
  }

  // ... 各段階のメソッド定義
}
```

## 🔄 データフロー設計

### 処理フロー図
```
[ユーザー入力] 
    ↓
[IntegratedAnalysisEngine]
    ↓
[Stage 1: 前処理] → [Stage 2: 形態素解析] → [Stage 3: キーワード抽出]
    ↓                        ↓                       ↓
[Stage 4: 感情分析] → [Stage 5: Triple OS統合] → [Stage 6: 易経マッピング]
    ↓
[Stage 7: 統合結果生成] → [MLIntegrationSystem] → [最終結果]
```

### データ構造設計

```javascript
// キーワード生成結果
const KeywordGenerationResult = {
  keywords: [
    {
      keyword: "敏感",
      priority: 0.9,
      category: "emotional_trait",
      confidence: 0.85,
      source: "morphological_analysis"
    }
  ],
  emotionalContext: {
    primary: "sensitivity",
    secondary: "social_impact",
    intensity: 0.7
  },
  contextualMapping: {
    situationType: "emotional_sensitivity",
    temporalContext: "current_state",
    socialContext: "interpersonal_influence"
  },
  hexagramCandidates: [
    { hexagram: 29, confidence: 0.78, reason: "水の困難・感情の渦" },
    { hexagram: 47, confidence: 0.72, reason: "困窮・外的圧力" }
  ]
};

// 7段階分析結果
const SevenStageAnalysisResult = {
  inputAnalysis: {
    originalText: "世の中イライラしてる人敏感に感じやすく...",
    normalizedText: "世の中イライラしてる人敏感に感じやすく",
    textLength: 25,
    complexity: "medium"
  },
  stageResults: {
    stage1: { /* 前処理結果 */ },
    stage2: { /* 形態素解析結果 */ },
    stage3: { /* キーワード抽出結果 */ },
    stage4: { /* 感情分析結果 */ },
    stage5: { /* Triple OS統合結果 */ },
    stage6: { /* 易経マッピング結果 */ },
    stage7: { /* 統合結果 */ }
  },
  finalResult: {
    hexagram: 29,
    line: 3,
    confidence: 0.81,
    reasoning: "外的な感情環境に敏感に反応する心理状態...",
    tripleOSIntegration: {
      engineOS: 0.6,    // 内的価値観の影響度
      interfaceOS: 0.8,  // 社会的影響の受けやすさ
      safeModeOS: 0.7    // 防御反応の強度
    }
  },
  qualityMetrics: {
    overallConfidence: 0.81,
    stageCompletionRate: 1.0,
    errorCount: 0,
    processingTime: 2.3
  }
};
```

## 🔧 技術実装仕様

### 1. パフォーマンス最適化

```javascript
// キャッシング戦略
class AnalysisCache {
  constructor() {
    this.textCache = new Map();
    this.keywordCache = new Map();
    this.hexagramCache = new Map();
    this.maxCacheSize = 1000;
  }

  getCachedResult(inputText, contextType) {
    const cacheKey = `${inputText}_${contextType}`;
    return this.textCache.get(cacheKey);
  }

  setCachedResult(inputText, contextType, result) {
    if (this.textCache.size >= this.maxCacheSize) {
      this.evictOldestEntries();
    }
    const cacheKey = `${inputText}_${contextType}`;
    this.textCache.set(cacheKey, {
      ...result,
      cachedAt: Date.now()
    });
  }
}
```

### 2. エラーハンドリング戦略

```javascript
class DynamicAnalysisErrorHandler {
  static handleStageError(stageNumber, error, inputData) {
    const errorInfo = {
      stage: stageNumber,
      error: error.message,
      inputLength: inputData?.length || 0,
      timestamp: new Date().toISOString()
    };

    // ログ記録
    console.error(`🚨 Stage ${stageNumber} エラー:`, errorInfo);

    // 段階的フォールバック
    switch (stageNumber) {
      case 1:
      case 2:
        return this.generateMinimalFallback(inputData);
      case 3:
      case 4:
        return this.generateKeywordFallback(inputData);
      case 5:
      case 6:
        return this.generateHexagramFallback(inputData);
      case 7:
        return this.generateResultFallback(inputData);
      default:
        return this.generateEmergencyFallback(inputData);
    }
  }
}
```

### 3. ML統合インターフェース

```javascript
class MLEnhancedAnalysis {
  constructor() {
    this.mlIntegration = window.mlIntegration;
    this.fallbackAnalysis = new TraditionalAnalysis();
  }

  async enhanceAnalysisWithML(analysisResult, userContext) {
    try {
      if (this.mlIntegration && !this.mlIntegration.fallbackMode) {
        const mlResult = await this.mlIntegration.enhanceFutureSimulation({
          inputText: analysisResult.inputText,
          contextType: analysisResult.contextType,
          worryLevel: this.estimateWorryLevel(analysisResult)
        });

        return this.mergeMLWithTraditional(analysisResult, mlResult);
      }
    } catch (error) {
      console.warn('ML統合エラー、従来分析を使用:', error);
    }

    return analysisResult;
  }

  mergeMLWithTraditional(traditional, ml) {
    return {
      ...traditional,
      mlEnhancement: {
        hexagram: ml.hexagram,
        confidence: ml.confidence,
        reasoning: ml.reasoning,
        enhancementApplied: true
      },
      finalConfidence: (traditional.confidence + ml.confidence) / 2
    };
  }
}
```

## 📊 品質保証設計

### 1. TDD テスト戦略

```javascript
// テストケース設計
describe('DynamicKeywordGenerator', () => {
  test('実際のユーザー入力での動作検証', () => {
    const input = "世の中イライラしてる人敏感に感じやすく、自分もその影響を受けてしまう";
    const result = generator.generateContextualKeywords(input);
    
    expect(result.keywords).toContain('敏感');
    expect(result.keywords).toContain('影響');
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.contextualMapping.situationType).toBe('emotional_sensitivity');
  });

  test('複雑な感情表現の解析', () => {
    const input = "めちゃくちゃストレス溜まってて、もうどうしていいかわからない";
    const result = generator.generateContextualKeywords(input);
    
    expect(result.emotionalContext.intensity).toBeGreaterThan(0.8);
    expect(result.hexagramCandidates.length).toBeGreaterThan(0);
  });
});

describe('IntegratedAnalysisEngine', () => {
  test('7段階処理の完全実行', async () => {
    const input = "将来への不安が続いている";
    const result = await engine.performSevenStageAnalysis(input);
    
    expect(result.stageResults).toHaveProperty('stage1');
    expect(result.stageResults).toHaveProperty('stage7');
    expect(result.qualityMetrics.stageCompletionRate).toBe(1.0);
    expect(result.finalResult.confidence).toBeGreaterThan(0.6);
  });
});
```

### 2. パフォーマンステスト

```javascript
describe('Performance Tests', () => {
  test('応答時間3秒以内', async () => {
    const startTime = Date.now();
    const result = await engine.performSevenStageAnalysis("複雑な感情状態のテスト");
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(3000);
  });

  test('メモリ使用量50MB以下', () => {
    // メモリ使用量測定・検証ロジック
    const memoryUsage = process.memoryUsage();
    expect(memoryUsage.heapUsed / 1024 / 1024).toBeLessThan(50);
  });
});
```

## 🔗 統合ポイント

### 1. 既存システムとの統合
- **StorageManager**: 分析結果の永続化
- **DataManager**: セッション間のデータ連携
- **MLIntegrationSystem**: AI強化機能
- **KeywordExpansionEngine**: SNSパターン統合

### 2. Triple OSアーキテクチャ統合
- **Engine OS**: 内的価値観との適合度分析
- **Interface OS**: 社会的コンテキストの考慮
- **Safe Mode OS**: 防御メカニズムの統合

### 3. 易経64卦システム統合
- 動的キーワードから卦への高精度マッピング
- 爻の動的決定ロジック
- 信頼度ベースの結果検証

---

**次のステップ**: この技術設計に基づき、Tsumiki /kairo-tasks でタスク分解を行い、段階的実装を開始します。