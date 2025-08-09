# QuestionManager データ構造定義

HAQEIアナライザーのHaQei哲学に準拠した質問データ管理システムのデータ構造を定義します。

## 目次

1. [基本データ構造](#基本データ構造)
2. [I Ching 8次元構造](#i-ching-8次元構造)
3. [HaQei分人構造](#HaQei分人構造)
4. [Triple OS Architecture構造](#triple-os-architecture構造)
5. [キャッシュ構造](#キャッシュ構造)
6. [パフォーマンス構造](#パフォーマンス構造)
7. [エラー管理構造](#エラー管理構造)
8. [使用例](#使用例)

## 基本データ構造

### QuestionManager本体

```javascript
class QuestionManager {
  constructor(options = {}) {
    // 設定オプション
    this.config = {
      enableCaching: boolean,              // キャッシング有効化
      cacheTimeout: number,                // キャッシュタイムアウト（ms）
      enableBunenjinMode: boolean,         // HaQei分人モード
      enableIChing8Dimensions: boolean,    // I Ching 8次元モード
      enableTripleOSMode: boolean,         // Triple OSモード
      enableErrorRecovery: boolean,        // エラー回復機能
      enablePerformanceOptimization: boolean, // パフォーマンス最適化
      debugMode: boolean,                  // デバッグモード
      memoryOptimization: boolean          // メモリ最適化
    };
    
    // データストレージ
    this.questions = new Map();          // 質問データ本体
    this.questionsByCategory = new Map(); // カテゴリ別インデックス
    this.questionsByDimension = new Map(); // 8次元別インデックス
    this.questionsArray = [];            // VirtualQuestionFlow互換配列
  }
}
```

### 質問データ構造

```javascript
const ProcessedQuestion = {
  // 基本データ
  id: string,                    // 質問ID (例: "q1", "q2", ...)
  index: number,                 // 配列内インデックス (0ベース)
  text: string,                  // 質問文
  options: OptionData[],         // 選択肢配列
  
  // メタデータ
  category: string,              // カテゴリ ('worldview' | 'scenario' | 'general')
  type: string,                  // タイプ ('multiple-choice' | 'scenario-choice' | 'unknown')
  difficulty: number,            // 難易度 (0.0-1.0)
  
  // HaQei分類
  HaQeiPersona: string,       // 最適分人 ('analyticalSelf' | 'emotionalSelf' | 'pragmaticSelf' | 'creativeSelf')
  HaQeiWeight: number,        // HaQei重要度 (0.0-1.0)
  
  // I Ching 8次元分析
  ichingDimensions: Map,         // 次元別データ Map<string, DimensionData>
  primaryDimension: string,      // 主要次元 (例: '乾_創造性')
  dimensionWeights: Map,         // 次元別重み Map<string, number>
  
  // Triple OS分類
  tripleOSMode: string,          // 最適OS ('engine' | 'interface' | 'safeMode')
  osCompatibility: {             // OS適合度
    engine: number,              // Engine OS適合度 (0.0-1.0)
    interface: number,           // Interface OS適合度 (0.0-1.0) 
    safeMode: number            // Safe Mode適合度 (0.0-1.0)
  },
  
  // パフォーマンス情報
  averageResponseTime: number,   // 平均回答時間（ms）
  complexityScore: number,       // 複雑度スコア (0.0-1.0)
  userEngagement: number,        // ユーザーエンゲージメント (0.0-1.0)
  
  // 時間情報
  createdAt: number,             // 作成時刻（timestamp）
  processedAt: number,           // 処理時刻（timestamp）
  
  // 元データ
  rawData: RawQuestionData       // 元の質問データ
};
```

### 選択肢データ構造

```javascript
const OptionData = {
  // 基本情報
  value: string,                 // 選択肢値 ("A", "B", "C", ...)
  text: string,                  // 選択肢テキスト
  
  // スコアリング情報
  scoringTags: ScoringTag[],     // スコアリングタグ配列
  kouiLevel: number,             // 効位レベル (1-6, 易経の爻位)
  
  // I Ching分析
  ichingImpact: Map,             // I Ching影響度 Map<string, ImpactData>
  
  // HaQei適合度
  HaQeiAlignment: {           // 分人適合度
    analyticalSelf: number,      // 分析型分人適合度
    emotionalSelf: number,       // 感情型分人適合度
    pragmaticSelf: number,       // 実用型分人適合度
    creativeSelf: number         // 創造型分人適合度
  },
  
  // 複雑度と重要度
  complexity: number,            // 選択肢複雑度 (0.0-1.0)
  weight: number,                // 選択肢重要度 (0.1-2.0)
  
  // 元データ
  rawData: RawOptionData         // 元の選択肢データ
};
```

### スコアリングタグ構造

```javascript
const ScoringTag = {
  key: string,                   // 次元キー (例: "乾_創造性")
  value: number,                 // スコア値 (-3.0 to 3.0)
  type: string                   // 関係タイプ ('direct' | 'complementary' | 'conflicting')
};
```

## I Ching 8次元構造

### 8次元定義

```javascript
const IChing8Dimensions = {
  '乾_創造性': {
    trigram: '☰',                // 八卦記号
    element: 'metal',            // 五行要素
    nature: 'creative',          // 性質
    complementary: '坤_受容性',   // 補完関係
    conflicting: '艮_安定性'     // 対立関係
  },
  '震_行動性': {
    trigram: '☳',
    element: 'wood',
    nature: 'dynamic', 
    complementary: '巽_適応性',
    conflicting: '兌_調和性'
  },
  '坎_探求性': {
    trigram: '☵',
    element: 'water',
    nature: 'penetrating',
    complementary: '離_表現性', 
    conflicting: '艮_安定性'
  },
  '艮_安定性': {
    trigram: '☶',
    element: 'earth',
    nature: 'stable',
    complementary: '兌_調和性',
    conflicting: '乾_創造性'
  },
  '坤_受容性': {
    trigram: '☷', 
    element: 'earth',
    nature: 'receptive',
    complementary: '乾_創造性',
    conflicting: '震_行動性'
  },
  '巽_適応性': {
    trigram: '☴',
    element: 'wood', 
    nature: 'gentle',
    complementary: '震_行動性',
    conflicting: '艮_安定性'
  },
  '離_表現性': {
    trigram: '☲',
    element: 'fire',
    nature: 'clinging',
    complementary: '坎_探求性',
    conflicting: '坤_受容性'
  },
  '兌_調和性': {
    trigram: '☱',
    element: 'metal', 
    nature: 'joyful',
    complementary: '艮_安定性',
    conflicting: '震_行動性'
  }
};
```

### I Ching影響度データ

```javascript
const ImpactData = {
  value: number,                 // 影響値 (-3.0 to 3.0)
  type: string,                  // 影響タイプ ('direct' | 'complementary' | 'conflicting')
  strength: number,              // 影響強度 (0.0-3.0, 絶対値)
  positive: boolean              // 正の影響かどうか
};
```

### 次元データ

```javascript
const DimensionData = {
  total: number,                 // 累積値
  count: number,                 // カウント数
  average: number,               // 平均値 (total / count)
  maxValue: number,              // 最大値
  minValue: number               // 最小値
};
```

## HaQei分人構造

### 分人システム

```javascript
const BunenjinPersonas = {
  analyticalSelf: {
    active: boolean,             // 現在アクティブか
    questions: string[],         // 所属質問ID配列
    approach: 'logical-systematic', // アプローチ方法
    ichingAlignment: string[]    // 対応I Ching次元
  },
  emotionalSelf: {
    active: boolean,
    questions: string[],
    approach: 'empathetic-intuitive',
    ichingAlignment: string[]
  },
  pragmaticSelf: {
    active: boolean,
    questions: string[], 
    approach: 'practical-results',
    ichingAlignment: string[]
  },
  creativeSelf: {
    active: boolean,
    questions: string[],
    approach: 'innovative-expressive', 
    ichingAlignment: string[]
  }
};
```

### HaQei分析レポート構造

```javascript
const BunenjinAnalysisReport = {
  totalQuestions: number,        // 総質問数
  personas: {
    [personaName]: {
      questionCount: number,     // 質問数
      percentage: number,        // 割合 (%)
      approach: string,          // アプローチ方法
      ichingAlignment: string[], // I Ching対応次元
      active: boolean           // アクティブ状態
    }
  }
};
```

## Triple OS Architecture構造

### Triple OSシステム

```javascript
const TripleOS = {
  engineMode: {
    questions: string[],         // Engine OS質問ID配列
    priority: 'high'            // 優先度
  },
  interfaceMode: {
    questions: string[],         // Interface OS質問ID配列
    priority: 'medium'
  },
  safeModeMode: {
    questions: string[],         // Safe Mode質問ID配列
    priority: 'low'
  }
};
```

### OS適合度構造

```javascript
const OSCompatibility = {
  engine: number,                // Engine OS適合度 (0.0-1.0)
  interface: number,             // Interface OS適合度 (0.0-1.0)
  safeMode: number              // Safe Mode適合度 (0.0-1.0)
};
```

## キャッシュ構造

### キャッシュデータ

```javascript
const CacheData = {
  questions: RawQuestionData[], // 質問データ配列
  processedAt: number,          // 処理時刻
  version: string               // バージョン
};
```

### キャッシュメタデータ

```javascript
const CacheMetadata = {
  createdAt: number,            // 作成時刻
  expiresAt: number,            // 有効期限
  version: string               // バージョン
};
```

## パフォーマンス構造

### パフォーマンスメトリクス

```javascript
const PerformanceMetrics = {
  totalQuestions: number,       // 総質問数
  loadTime: number,             // 読み込み時間（ms）
  cacheHitRate: number,         // キャッシュヒット率 (%)
  memoryUsage: number,          // メモリ使用量（MB）
  categoriesCount: number,      // カテゴリ数
  dimensionsCount: number,      // I Ching次元数
  cacheMisses: number,          // キャッシュミス数
  cacheHits: number,            // キャッシュヒット数
  dataIntegrityChecks: number,  // データ整合性問題数
  errorRecoveries: number       // エラー回復実行数
};
```

### システム統計

```javascript
const SystemStatistics = {
  version: string,              // バージョン
  totalQuestions: number,       // 総質問数
  categories: string[],         // カテゴリ一覧
  ichingDimensions: string[],   // I Ching次元一覧
  HaQeiPersonas: string[],   // HaQei分人一覧
  tripleOSModes: string[],      // Triple OSモード一覧
  performanceMetrics: PerformanceMetrics, // パフォーマンス統計
  errorCount: number,           // エラー数
  cacheSize: number,            // キャッシュサイズ
  memoryUsage: number,          // メモリ使用量（MB）
  uptime: number               // 稼働時間（ms）
};
```

## エラー管理構造

### エラーデータ

```javascript
const ErrorData = {
  type: string,                 // エラータイプ
  message: string,              // エラーメッセージ
  stack: string,                // スタックトレース
  timestamp: number,            // 発生時刻
  context: ErrorContext         // エラーコンテキスト
};
```

### エラーコンテキスト

```javascript
const ErrorContext = {
  questionsLoaded: number,      // 読み込み済み質問数
  categoriesCount: number,      // カテゴリ数
  dimensionsCount: number,      // 次元数
  cacheSize: number,            // キャッシュサイズ
  memoryUsage: number,          // メモリ使用量
  config: ConfigOptions         // 設定オプション
};
```

### エラー回復戦略

```javascript
const ErrorRecoveryStrategy = {
  strategy: string,             // 戦略名
  maxAttempts: number,          // 最大試行回数
  fallback: string             // フォールバック戦略
};
```

### ヘルスチェック結果

```javascript
const HealthCheckResult = {
  status: string,               // 状態 ('healthy' | 'warning' | 'critical')
  score: number,                // スコア (0-100)
  issues: string[],             // 問題一覧
  recommendations: string[]     // 推奨対応一覧
};
```

## 使用例

### 基本的な質問取得

```javascript
// QuestionManagerの初期化
const questionManager = new QuestionManager({
  enableCaching: true,
  enableBunenjinMode: true,
  enableIChing8Dimensions: true
});

await questionManager.initialize();

// 全質問取得
const allQuestions = questionManager.getAllQuestions();

// 特定質問取得
const question1 = questionManager.getQuestionById('q1');

// VirtualQuestionFlow互換配列取得
const questionsArray = questionManager.getQuestionsArray();
```

### HaQei分人別検索

```javascript
// 分析型分人の質問取得
const analyticalQuestions = questionManager.getQuestionsByBunenjinPersona('analyticalSelf');

// 推奨質問取得（回答状況考慮）
const currentAnswers = [{ questionId: 'q1' }, { questionId: 'q2' }];
const recommended = questionManager.getRecommendedQuestionsForPersona('analyticalSelf', currentAnswers);
```

### I Ching 8次元検索

```javascript
// 創造性次元の質問取得
const creativityQuestions = questionManager.getQuestionsByIChing8Dimension('乾_創造性');

// 相生相克による関連質問取得
const relatedQuestions = questionManager.getRelatedQuestionsByIChing8('q1');
```

### 複合条件検索

```javascript
const searchResults = questionManager.searchQuestions({
  HaQeiPersona: 'analyticalSelf',
  ichingDimension: '乾_創造性',
  minDifficulty: 0.3,
  maxDifficulty: 0.8,
  sortBy: 'HaQeiWeight',
  sortOrder: 'desc',
  limit: 5
});
```

### システム監視

```javascript
// システム統計取得
const stats = questionManager.getSystemStatistics();

// ヘルスチェック実行
const health = questionManager.performHealthCheck();

// HaQei分析レポート
const HaQeiReport = questionManager.getBunenjinAnalysisReport();

// I Ching次元分析レポート
const ichingReport = questionManager.getIChing8DimensionReport();
```

---

この データ構造定義により、HAQEIアナライザーのQuestionManagerシステムの全体像と詳細な実装指針を提供しています。HaQei哲学・I Ching 8次元・Triple OS Architectureの統合により、世界最高水準の質問データ管理システムを実現できます。