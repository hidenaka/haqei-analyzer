# 🔧 HAQEI正統易経システム技術設計書

**作成日**: 2025年8月5日  
**バージョン**: 2.0  
**対応要件**: HAQEI_AUTHENTIC_ICHING_SYSTEM_REQUIREMENTS_SPECIFICATION.md  
**評価基準**: MCP評価結果（80% → 94%向上目標）

---

## 📋 1. 設計概要

### 1.1 設計目標
MCP評価で明らかになった改善点を技術的に解決し、HAQEIアナライザーを**世界最高水準の正統易経AIシステム**として完成させる。

### 1.2 技術スコープ
- **フロントエンド**: Vanilla JavaScript ES2022+による高性能実装
- **データ**: H384_DATA完全活用による384爻システム
- **アーキテクチャ**: HaQei哲学完全統合型設計
- **性能**: sub-50ms応答時間、99.5%可用性達成

### 1.3 設計原則
- **易経正統性**: 古典理論との100%整合性
- **HaQei統合**: 分人間調和理論の完全実装
- **パフォーマンス**: 高速レスポンス・低リソース使用
- **拡張性**: 将来的機能追加への対応

---

## 🏗️ 2. システムアーキテクチャ設計

### 2.1 全体アーキテクチャ
```
┌─────────────────────────────────────────────────────────────┐
│                    HAQEI Triple OS Architecture            │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│ │   Engine    │ │ Interface   │ │      Safe Mode          │ │
│ │   OS        │ │    OS       │ │         OS              │ │
│ └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                  HaQei Philosophy Layer                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │
│  │Analytics│ │Emotional│ │ Social  │ │   Spiritual     │  │
│  │   分人   │ │   分人   │ │   分人   │ │      分人       │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│              Authentic I-Ching Core Engine                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │ H384_DATA   │ │Transformation│ │  Validation         │  │
│  │ Engine      │ │   Engine     │ │    Engine           │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  Service Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │Performance  │ │   Cache     │ │     Error           │  │
│  │Optimizer    │ │  Manager    │ │    Handler          │  │
│  └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 コンポーネント詳細設計

#### Engine OS（計算エンジン層）
```javascript
class EngineOS {
  constructor() {
    this.h384Engine = new H384DataEngine();
    this.transformationEngine = new TransformationEngine();
    this.validationEngine = new ValidationEngine();
    this.circuitBreaker = new CircuitBreaker();
  }

  async analyzeText(input) {
    return await this.circuitBreaker.execute(async () => {
      const position = await this.h384Engine.identifyPosition(input);
      const transformations = await this.transformationEngine
        .generate8Patterns(position);
      return this.validationEngine.validateResults({
        position, transformations
      });
    });
  }
}
```

#### Interface OS（UI/UX層）
```javascript
class InterfaceOS {
  constructor() {
    this.currentPositionDisplay = new CurrentPositionDisplay();
    this.choiceSystem = new AuthenticChoiceSystem();
    this.scenariosSystem = new Authentic8ScenariosSystem();
    this.progressiveLoader = new ProgressiveLoader();
  }

  async renderAnalysis(analysisResult) {
    await Promise.all([
      this.currentPositionDisplay.update(analysisResult.position),
      this.choiceSystem.generateChoices(analysisResult.position),
      this.scenariosSystem.display8Patterns(analysisResult.transformations)
    ]);
  }
}
```

#### Safe Mode OS（安全性・回復層）
```javascript
class SafeModeOS {
  constructor() {
    this.errorRecovery = new ErrorRecoverySystem();
    this.dataIntegrity = new DataIntegrityChecker();
    this.performanceMonitor = new PerformanceMonitor();
  }

  async executeWithSafety(operation) {
    try {
      this.performanceMonitor.startTracking();
      await this.dataIntegrity.validatePreconditions();
      const result = await operation();
      await this.dataIntegrity.validatePostconditions(result);
      return result;
    } catch (error) {
      return await this.errorRecovery.handleError(error);
    } finally {
      this.performanceMonitor.stopTracking();
    }
  }
}
```

---

## 📊 3. データベース設計

### 3.1 H384爻辞データベース設計

#### メインスキーマ
```typescript
interface H384LineData {
  id: string;                    // "hex_01_line_01"
  hexagramNumber: number;        // 1-64
  hexagramName: string;          // "乾為天"
  linePosition: number;          // 1-6 (初爻-上爻)
  lineType: "陽" | "陰";         // 爻の性質
  lineDesignation: string;       // "初九", "六二", etc.
  
  // 原典データ
  classicalText: {
    original: string;            // 古典原文
    reading: string;             // 読み方
    modernInterpretation: string; // 現代語訳
    source: string;              // 出典（周易本義等）
  };
  
  // 解釈データ
  interpretation: {
    traditional: string;         // 伝統的解釈
    psychological: string;       // 心理学的解釈
    practical: string;           // 実用的指導
    HaQei: BunenjinAnalysis; // 分人間分析
  };
  
  // 関係性データ
  relationships: {
    mutual: number;              // 互卦番号
    comprehensive: number;       // 綜卦番号
    opposite: number;            // 錯卦番号
    sequential: number;          // 序卦伝による次卦
  };
  
  // メタデータ
  metadata: {
    keywords: string[];          // 関連キーワード
    situations: string[];        // 適用状況
    emotions: string[];          // 関連感情
    actions: string[];           // 推奨行動
    warnings: string[];          // 注意事項
  };
  
  // スコアリング
  scores: {
    basicScore: number;          // S1_基本スコア
    potential: number;           // S2_ポテンシャル
    stability: number;           // S3_安定性スコア
    risk: number;                // S4_リスク
    proactivity: string;         // S5_主体性推奨スタンス
    volatility: number;          // S6_変動性スコア
    overall: number;             // S7_総合評価スコア
  };
}

interface BunenjinAnalysis {
  analytical: PersonaAnalysis;   // 分析的分人
  emotional: PersonaAnalysis;    // 感情的分人
  social: PersonaAnalysis;       // 社会的分人
  spiritual: PersonaAnalysis;    // 精神的分人
  integration: IntegrationGuidance; // 統合指導
}

interface PersonaAnalysis {
  perspective: string;           // この分人の視点
  recommendation: string;        // 推奨行動
  caution: string;              // 注意点
  development: string;          // 成長指針
}
```

#### インデックス設計
```sql
-- 主要インデックス
CREATE INDEX idx_hexagram_line ON h384_data (hexagramNumber, linePosition);
CREATE INDEX idx_keywords ON h384_data USING GIN (keywords);
CREATE INDEX idx_situations ON h384_data USING GIN (situations);
CREATE INDEX idx_overall_score ON h384_data (scores.overall);

-- 検索最適化
CREATE INDEX idx_text_search ON h384_data 
  USING GIN (to_tsvector('japanese', classicalText.modernInterpretation));

-- 関係性検索
CREATE INDEX idx_relationships ON h384_data 
  (relationships.mutual, relationships.comprehensive, relationships.opposite);
```

### 3.2 序卦伝関係データベース

#### 序卦論理スキーマ
```typescript
interface SequentialLogic {
  currentHexagram: number;       // 現在の卦
  nextHexagram: number;          // 次の卦
  relationship: string;          // 関係性の説明
  transformationType: "natural" | "opposition" | "development";
  timeframe: string;             // 変化の時間軸
  conditions: string[];          // 変化の条件
  probability: number;           // 発生確率 (0-1)
}

// 64卦すべての序卦関係をマッピング
const sequentialMap: SequentialLogic[] = [
  {
    currentHexagram: 1,  // 乾為天
    nextHexagram: 2,     // 坤為地
    relationship: "天地相対の必然性",
    transformationType: "opposition",
    timeframe: "長期的循環",
    conditions: ["陽の極致到達", "陰への転換時期"],
    probability: 0.85
  },
  // ... 64卦すべての関係を定義
];
```

---

## ⚡ 4. パフォーマンス最適化設計

### 4.1 多層キャッシュ戦略

#### L1キャッシュ（メモリ）
```javascript
class L1MemoryCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000;
    this.ttl = 5 * 60 * 1000; // 5分
  }

  async get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < this.ttl) {
      return item.value;
    }
    this.cache.delete(key);
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1
    });
  }
}
```

#### L2キャッシュ（IndexedDB）
```javascript
class L2IndexedDBCache {
  constructor() {
    this.dbName = 'HAQEI_Cache';
    this.version = 1;
    this.init();
  }

  async init() {
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore('cache', { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      };
    });
  }

  async get(key) {
    const transaction = this.db.transaction(['cache'], 'readonly');
    const store = transaction.objectStore('cache');
    const request = store.get(key);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() - result.timestamp < 24 * 60 * 60 * 1000) {
          resolve(result.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }
}
```

#### L3キャッシュ（予測的プリフェッチ）
```javascript
class L3PredictiveCache {
  constructor() {
    this.ml = new SimpleMachineLearning();
    this.patterns = new Map();
  }

  async predictAndPrefetch(currentAnalysis) {
    const predictions = await this.ml.predict(currentAnalysis);
    const prefetchTasks = predictions.map(prediction => 
      this.prefetchData(prediction.key, prediction.probability)
    );
    
    // 並列でプリフェッチ実行
    await Promise.allSettled(prefetchTasks);
  }

  async prefetchData(key, probability) {
    if (probability > 0.7) {
      // 高確率の場合は即座にプリフェッチ
      return await this.loadAndCache(key);
    } else if (probability > 0.4) {
      // 中確率の場合は遅延プリフェッチ
      setTimeout(() => this.loadAndCache(key), 1000);
    }
  }
}
```

### 4.2 並列処理設計

#### Web Workers活用
```javascript
class ParallelProcessor {
  constructor() {
    this.workers = [];
    this.taskQueue = [];
    this.maxWorkers = navigator.hardwareConcurrency || 4;
    this.initWorkers();
  }

  initWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker('/js/workers/iching-calculator.js');
      worker.onmessage = (e) => this.handleWorkerMessage(e, i);
      this.workers.push({
        worker,
        busy: false,
        id: i
      });
    }
  }

  async calculate8Patterns(data) {
    const tasks = [
      { type: 'orthodox', data },
      { type: 'contradiction', data },
      { type: 'mutual', data },
      { type: 'opposite', data },
      { type: 'reversed', data },
      { type: 'rapid', data },
      { type: 'gradual', data },
      { type: 'sequential', data }
    ];

    const promises = tasks.map(task => this.executeTask(task));
    return await Promise.all(promises);
  }

  async executeTask(task) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.busy);
      
      if (availableWorker) {
        availableWorker.busy = true;
        availableWorker.resolve = resolve;
        availableWorker.reject = reject;
        availableWorker.worker.postMessage(task);
      } else {
        this.taskQueue.push({ task, resolve, reject });
      }
    });
  }
}
```

### 4.3 レスポンシブ最適化

#### プログレッシブ・ローディング
```javascript
class ProgressiveLoader {
  constructor() {
    this.loadingStages = [
      { name: 'essential', priority: 1, estimatedTime: 100 },
      { name: 'core', priority: 2, estimatedTime: 300 },
      { name: 'enhanced', priority: 3, estimatedTime: 500 },
      { name: 'complete', priority: 4, estimatedTime: 800 }
    ];
  }

  async loadAnalysis(inputText) {
    const progressCallback = this.createProgressCallback();
    
    // Stage 1: Essential (基本的な卦・爻特定)
    progressCallback(20, '卦・爻を特定中...');
    const basicPosition = await this.loadBasicPosition(inputText);
    
    // Stage 2: Core (現在地表示・基本選択)
    progressCallback(50, '現在地を表示中...');
    const coreAnalysis = await this.loadCoreAnalysis(basicPosition);
    
    // Stage 3: Enhanced (8パターン・詳細分析)
    progressCallback(80, '変化パターンを生成中...');
    const enhancedAnalysis = await this.loadEnhancedAnalysis(coreAnalysis);
    
    // Stage 4: Complete (HaQei統合・最適化)
    progressCallback(100, '分析完了');
    return await this.loadCompleteAnalysis(enhancedAnalysis);
  }

  createProgressCallback() {
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    
    return (percentage, message) => {
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (statusText) statusText.textContent = message;
    };
  }
}
```

---

## 🛡️ 5. エラーハンドリング設計

### 5.1 サーキットブレーカーパターン

#### 実装仕様
```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.recoveryTimeout) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 3) {
        this.state = 'CLOSED';
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

### 5.2 段階的フォールバック戦略

#### 4段階復旧システム
```javascript
class FallbackManager {
  constructor() {
    this.fallbackStrategies = [
      new PrimaryStrategy(),    // H384_DATA完全版
      new CachedStrategy(),     // キャッシュ版
      new ReducedStrategy(),    // 簡易版
      new OfflineStrategy()     // オフライン版
    ];
  }

  async executeWithFallback(operation, context) {
    for (let i = 0; i < this.fallbackStrategies.length; i++) {
      try {
        const strategy = this.fallbackStrategies[i];
        console.log(`Attempting strategy ${i + 1}: ${strategy.name}`);
        
        const result = await strategy.execute(operation, context);
        
        if (i > 0) {
          // フォールバック使用をログ記録
          this.logFallbackUsage(strategy.name, i);
        }
        
        return result;
      } catch (error) {
        console.warn(`Strategy ${i + 1} failed:`, error.message);
        
        if (i === this.fallbackStrategies.length - 1) {
          throw new Error('All fallback strategies exhausted');
        }
      }
    }
  }

  logFallbackUsage(strategyName, level) {
    const event = {
      timestamp: Date.now(),
      strategy: strategyName,
      fallbackLevel: level,
      reason: 'Primary strategy failure'
    };
    
    // 分析・改善のためのログ記録
    this.analytics.track('fallback_usage', event);
  }
}
```

### 5.3 自動復旧システム

#### セルフヒーリング機能
```javascript
class SelfHealingSystem {
  constructor() {
    this.healthChecks = new Map();
    this.recoveryActions = new Map();
    this.monitoringInterval = 30000; // 30秒
    this.startMonitoring();
  }

  registerHealthCheck(name, checkFunction, recoveryFunction) {
    this.healthChecks.set(name, checkFunction);
    this.recoveryActions.set(name, recoveryFunction);
  }

  async startMonitoring() {
    setInterval(async () => {
      for (const [name, checkFunction] of this.healthChecks) {
        try {
          const isHealthy = await checkFunction();
          if (!isHealthy) {
            await this.attemptRecovery(name);
          }
        } catch (error) {
          console.error(`Health check failed for ${name}:`, error);
          await this.attemptRecovery(name);
        }
      }
    }, this.monitoringInterval);
  }

  async attemptRecovery(componentName) {
    const recoveryFunction = this.recoveryActions.get(componentName);
    if (recoveryFunction) {
      try {
        console.log(`Attempting recovery for ${componentName}`);
        await recoveryFunction();
        console.log(`Recovery successful for ${componentName}`);
      } catch (error) {
        console.error(`Recovery failed for ${componentName}:`, error);
      }
    }
  }
}
```

---

## 🔧 6. API設計・インターフェース仕様

### 6.1 RESTful API設計

#### 主要エンドポイント
```typescript
// 包括的分析API
POST /api/v2/analysis/comprehensive
Content-Type: application/json

Request:
{
  "input": "最近、仕事でうまくいかないことが多く...",
  "options": {
    "includeDetailed": true,
    "includeBunenjin": true,
    "includeSequential": true
  }
}

Response:
{
  "status": "success",
  "data": {
    "currentPosition": {
      "hexagram": 12,
      "hexagramName": "天地否",
      "line": 3,
      "lineText": "包羞",
      "confidence": 0.87
    },
    "choices": {
      "pathA": { ... },
      "pathB": { ... }
    },
    "eightPatterns": [ ... ],
    "HaQeiAnalysis": { ... },
    "sequentialPrediction": { ... }
  },
  "performance": {
    "analysisTime": 45,
    "cacheHit": true
  }
}

// 爻辞検索API
GET /api/v2/lines/search?q=困難&context=work&limit=10

Response:
{
  "results": [
    {
      "id": "hex_12_line_03",
      "hexagram": 12,
      "line": 3,
      "text": "包羞",
      "interpretation": "...",
      "relevanceScore": 0.92
    }
  ],
  "total": 15,
  "searchTime": 12
}

// 関係性分析API
GET /api/v2/hexagrams/12/relationships

Response:
{
  "hexagram": 12,
  "relationships": {
    "mutual": 53,
    "comprehensive": 11,
    "opposite": 45,
    "sequential": 13
  },
  "detailed": {
    "mutual": {
      "number": 53,
      "name": "風山漸",
      "relationship": "隠れた可能性"
    }
  }
}
```

### 6.2 WebSocket リアルタイム通信

#### 分析進捗通知
```javascript
class AnalysisWebSocket {
  constructor() {
    this.ws = new WebSocket('wss://api.haqei.com/analysis');
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('Analysis WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
  }

  handleMessage(message) {
    switch (message.type) {
      case 'analysis_progress':
        this.updateProgressUI(message.data);
        break;
      case 'analysis_complete':
        this.displayResults(message.data);
        break;
      case 'cache_update':
        this.updateLocalCache(message.data);
        break;
    }
  }

  requestAnalysis(inputText) {
    this.ws.send(JSON.stringify({
      type: 'start_analysis',
      data: { input: inputText },
      requestId: this.generateRequestId()
    }));
  }
}
```

### 6.3 TypeScript型定義

#### 完全な型安全性確保
```typescript
// 基本型定義
export interface HexagramPosition {
  hexagram: number;
  hexagramName: string;
  line: number;
  lineType: '陽' | '陰';
  lineDesignation: string;
  lineText: string;
  confidence: number;
}

export interface TransformationPattern {
  id: number;
  title: string;
  subtitle: string;
  type: TransformationType;
  category: PatternCategory;
  confidence: number;
  hexagramChange: HexagramTransformation;
  description: string;
  guidance: PatternGuidance;
  outcome: PatternOutcome;
  HaQeiAlignment: BunenjinAlignment;
  iChingWisdom: string;
}

export type TransformationType = 
  | 'orthodox_transformation'
  | 'contradiction_transformation'
  | 'mutual_hexagram_transformation'
  | 'opposite_hexagram_transformation'
  | 'reversed_hexagram_transformation'
  | 'rapid_transformation'
  | 'gradual_transformation'
  | 'sequential_transformation';

export type PatternCategory = 
  | '正統変化'
  | '逆行変化'
  | '関係変化'
  | '時間変化';

// API応答型
export interface AnalysisResponse {
  status: 'success' | 'error' | 'partial';
  data?: {
    currentPosition: HexagramPosition;
    choices: AuthenticChoices;
    eightPatterns: TransformationPattern[];
    HaQeiAnalysis: BunenjinAnalysis;
    sequentialPrediction: SequentialPrediction;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  performance: {
    analysisTime: number;
    cacheHit: boolean;
    fallbackUsed?: string;
  };
}
```

---

## 🔒 7. セキュリティ設計

### 7.1 多層セキュリティ

#### 入力検証・サニタイゼーション
```javascript
class InputValidator {
  constructor() {
    this.xssFilter = new XSSFilter();
    this.sqlInjectionFilter = new SQLInjectionFilter();
    this.maxInputLength = 2000;
  }

  validateAnalysisInput(input) {
    // 基本検証
    if (!input || typeof input !== 'string') {
      throw new ValidationError('Invalid input type');
    }

    if (input.length > this.maxInputLength) {
      throw new ValidationError('Input too long');
    }

    // XSS対策
    const cleanInput = this.xssFilter.sanitize(input);
    
    // 悪意のあるパターン検出
    this.detectMaliciousPatterns(cleanInput);
    
    return cleanInput;
  }

  detectMaliciousPatterns(input) {
    const maliciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(input)) {
        throw new SecurityError('Malicious pattern detected');
      }
    }
  }
}
```

#### データ暗号化・プライバシー保護
```javascript
class PrivacyProtector {
  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.hashFunction = new SHA256();
  }

  async encryptSensitiveData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    const cryptoKey = await window.crypto.importKey(
      'raw',
      this.encryptionKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await window.crypto.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    return {
      encrypted: Array.from(new Uint8Array(encryptedBuffer)),
      iv: Array.from(iv)
    };
  }

  hashPersonalData(data) {
    // 個人特定可能情報のハッシュ化
    return this.hashFunction.hash(data + this.getSalt());
  }
}
```

### 7.2 認証・認可システム

#### トークンベース認証
```javascript
class AuthenticationManager {
  constructor() {
    this.tokenStorage = new SecureTokenStorage();
    this.refreshThreshold = 5 * 60 * 1000; // 5分前
  }

  async authenticate(credentials) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const { accessToken, refreshToken } = await response.json();
        await this.tokenStorage.store(accessToken, refreshToken);
        return true;
      } else {
        throw new AuthenticationError('Invalid credentials');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  async getValidToken() {
    const token = await this.tokenStorage.getAccessToken();
    
    if (!token) {
      throw new AuthenticationError('No token available');
    }

    if (this.isTokenExpiringSoon(token)) {
      await this.refreshToken();
      return await this.tokenStorage.getAccessToken();
    }

    return token;
  }
}
```

---

## 🧪 8. テスト設計・QA戦略

### 8.1 包括的テスト戦略

#### テストピラミッド
```
┌─────────────────────────────────────┐
│           E2E Tests (10%)           │  ← 易経専門家による検証
├─────────────────────────────────────┤
│       Integration Tests (20%)      │  ← システム間連携テスト
├─────────────────────────────────────┤
│        Unit Tests (70%)            │  ← モジュール単位テスト
└─────────────────────────────────────┘
```

#### 単体テスト設計
```javascript
// H384エンジンのテスト例
describe('H384DataEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new H384DataEngine();
  });

  describe('identifyCurrentSituation', () => {
    test('困難な状況のテキストを正確に分析する', async () => {
      const input = '最近、仕事でうまくいかないことが多く、チームメンバーとのコミュニケーションに悩んでいます。';
      const result = await engine.identifyCurrentSituation(input);

      expect(result).toMatchObject({
        卦番号: expect.any(Number),
        卦名: expect.any(String),
        爻: expect.any(String),
        confidence: expect.numberBetween(0.7, 1.0)
      });

      expect(result.卦番号).toBeGreaterThan(0);
      expect(result.卦番号).toBeLessThanOrEqual(64);
    });

    test('空文字列の場合はフォールバック結果を返す', async () => {
      const result = await engine.identifyCurrentSituation('');
      
      expect(result).toMatchObject({
        卦番号: 1,
        卦名: '乾為天',
        爻: '初九',
        reason: 'フォールバック結果'
      });
    });
  });

  describe('calculateTransformation', () => {
    test('本卦から之卦への変化を正確に計算する', () => {
      const transformation = engine.calculateTransformation(12, [3]);

      expect(transformation).toMatchObject({
        fromHexagram: {
          number: 12,
          name: '天地否'
        },
        toHexagram: {
          number: expect.any(Number),
          name: expect.any(String)
        },
        changingLines: [3]
      });
    });
  });
});
```

#### 統合テスト設計
```javascript
describe('Authentic I-Ching System Integration', () => {
  let system;

  beforeEach(async () => {
    system = new AuthenticIChingSystem();
    await system.initialize();
  });

  test('完全な分析フローが正常に動作する', async () => {
    const input = '転職を考えているが、今の会社に残るべきか悩んでいる。';
    
    // 分析実行
    const result = await system.performCompleteAnalysis(input);

    // 結果検証
    expect(result.currentPosition).toBeDefined();
    expect(result.choices).toHaveProperty('pathA');
    expect(result.choices).toHaveProperty('pathB');
    expect(result.eightPatterns).toHaveLength(8);
    expect(result.HaQeiAnalysis).toHaveProperty('analytical');
    expect(result.HaQeiAnalysis).toHaveProperty('emotional');
    expect(result.HaQeiAnalysis).toHaveProperty('social');
    expect(result.HaQeiAnalysis).toHaveProperty('spiritual');

    // 性能検証
    expect(result.performance.analysisTime).toBeLessThan(2000);
  });

  test('エラー状況での回復力をテストする', async () => {
    // H384_DATAを意図的に破損
    window.H384_DATA = null;

    const result = await system.performCompleteAnalysis('テスト入力');

    // フォールバック機能が動作することを確認
    expect(result).toBeDefined();
    expect(result.fallbackUsed).toBe(true);
  });
});
```

### 8.2 パフォーマンステスト

#### 負荷テスト設計
```javascript
describe('Performance Tests', () => {
  test('100件の同時分析リクエストを処理できる', async () => {
    const requests = Array.from({ length: 100 }, (_, i) => 
      system.performCompleteAnalysis(`テスト入力 ${i}`)
    );

    const startTime = Date.now();
    const results = await Promise.allSettled(requests);
    const endTime = Date.now();

    // 成功率検証
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    expect(successCount / results.length).toBeGreaterThan(0.95);

    // 応答時間検証
    expect(endTime - startTime).toBeLessThan(10000); // 10秒以内
  });

  test('メモリ使用量が制限内に収まる', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    // 大量の分析を実行
    for (let i = 0; i < 50; i++) {
      await system.performCompleteAnalysis(`メモリテスト ${i}`);
    }

    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // 25MB以下の増加に制限
    expect(memoryIncrease).toBeLessThan(25 * 1024 * 1024);
  });
});
```

### 8.3 易経正統性テスト

#### 哲学的整合性検証
```javascript
describe('I-Ching Authenticity Tests', () => {
  test('64卦すべての名前が正確である', () => {
    const expectedNames = [
      '乾為天', '坤為地', '水雷屯', '山水蒙',
      // ... 64卦すべて
    ];

    for (let i = 1; i <= 64; i++) {
      const hexagramName = engine.hexagramNames[i];
      expect(hexagramName).toBe(expectedNames[i - 1]);
    }
  });

  test('互卦計算が伝統的算法と一致する', () => {
    // 乾為天（第1卦）の互卦は雷風恒（第32卦）
    const mutualHex = engine.calculateMutualHexagram(1);
    expect(mutualHex).toBe(32);

    // 坤為地（第2卦）の互卦は山火賁（第22卦）
    const mutualHex2 = engine.calculateMutualHexagram(2);
    expect(mutualHex2).toBe(22);
  });

  test('序卦伝の論理が正確に実装されている', () => {
    // 乾為天の次は坤為地
    const nextHex = engine.getNextHexagramInSequence(1);
    expect(nextHex.number).toBe(2);
    expect(nextHex.relationship).toContain('天地相対');
  });
});
```

---

## 🚀 9. デプロイメント設計

### 9.1 CI/CD パイプライン

#### 自動デプロイフロー
```yaml
# .github/workflows/deploy.yml
name: HAQEI Authentic I-Ching Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run I-Ching authenticity tests
        run: npm run test:iching-authenticity
      
      - name: Performance benchmarks
        run: npm run test:performance
      
      - name: Security scan
        run: npm run security:scan

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to staging
        run: npm run deploy:staging
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Deploy to production
        run: npm run deploy:production
        
      - name: Post-deploy verification
        run: npm run verify:production
```

### 9.2 監視・アラート設計

#### リアルタイム監視システム
```javascript
class ProductionMonitor {
  constructor() {
    this.metrics = new MetricsCollector();
    this.alerts = new AlertManager();
    this.dashboard = new MonitoringDashboard();
  }

  startMonitoring() {
    // パフォーマンス監視
    this.monitorPerformance();
    
    // エラー率監視
    this.monitorErrorRates();
    
    // ユーザー体験監視
    this.monitorUserExperience();
    
    // 易経品質監視
    this.monitorIChingQuality();
  }

  monitorPerformance() {
    setInterval(() => {
      const metrics = {
        responseTime: this.measureResponseTime(),
        memoryUsage: this.measureMemoryUsage(),
        cacheHitRate: this.measureCacheHitRate(),
        concurrentUsers: this.countConcurrentUsers()
      };

      this.metrics.record('performance', metrics);

      // アラート条件チェック
      if (metrics.responseTime > 2000) {
        this.alerts.trigger('high_response_time', metrics);
      }

      if (metrics.memoryUsage > 25 * 1024 * 1024) {
        this.alerts.trigger('high_memory_usage', metrics);
      }
    }, 30000); // 30秒間隔
  }

  monitorIChingQuality() {
    setInterval(() => {
      const qualityMetrics = {
        hexagramAccuracy: this.measureHexagramAccuracy(),
        transformationCorrectness: this.measureTransformationCorrectness(),
        HaQeiIntegration: this.measureBunenjinIntegration(),
        userSatisfaction: this.measureUserSatisfaction()
      };

      this.metrics.record('iching_quality', qualityMetrics);

      // 品質低下アラート
      if (qualityMetrics.hexagramAccuracy < 0.9) {
        this.alerts.trigger('quality_degradation', qualityMetrics);
      }
    }, 300000); // 5分間隔
  }
}
```

---

## 📈 10. 期待される改善効果

### 10.1 定量的改善指標

| 指標 | 現在値 | 目標値 | 改善率 | 測定方法 |
|------|--------|--------|--------|----------|
| **MCP評価スコア** | 80% | 94% | +17.5% | MCP自動評価 |
| **応答時間** | 500ms | <50ms | -90% | パフォーマンス測定 |
| **キャッシュヒット率** | 70% | >95% | +36% | キャッシュ統計 |
| **可用性** | 98% | 99.5% | +1.5% | アップタイム監視 |
| **メモリ使用量** | 35MB | <25MB | -29% | リソース監視 |
| **同時ユーザー** | 50人 | 100人 | +100% | 負荷テスト |
| **エラー率** | 2% | <0.5% | -75% | エラー追跡 |

### 10.2 定性的改善効果

#### 易経正統性の向上
- **384爻完全実装**: 全爻辞の正確な表示と解釈
- **関係卦精度**: 互卦・綜卦・錯卦の100%正確な計算
- **序卦伝論理**: 自然な変化の流れの完全実装
- **HaQei統合**: 世界初の分人間調和理論実装

#### ユーザー体験の向上
- **段階的表示**: 理解レベルに応じた情報提供
- **リアルタイム**: 即座のフィードバックと進捗表示
- **直感的操作**: アクセシビリティ対応の操作性
- **個人化**: ユーザー固有の分人パターン学習

#### 技術的成熟度の向上
- **エンタープライズ級**: 99.5%可用性・自動復旧
- **スケーラブル**: 水平・垂直スケーリング対応
- **セキュア**: 多層セキュリティ・プライバシー保護
- **保守性**: モジュラー設計・包括的テスト

---

## 🎯 11. 実装ロードマップ

### Phase 1: 基盤強化（Week 1-2）
- **Week 1**: H384_DATA完全化・互卦計算精度向上
- **Week 2**: 序卦伝論理・エラーハンドリング実装

### Phase 2: 核心機能（Week 3-4）
- **Week 3**: パフォーマンス最適化・キャッシュ実装
- **Week 4**: HaQei統合強化・API実装

### Phase 3: 品質向上（Week 5-6）
- **Week 5**: セキュリティ・テスト・監視実装
- **Week 6**: ユーザビリティ・アクセシビリティ対応

### Phase 4: 本格運用（Week 7-8）
- **Week 7**: 本番デプロイ・性能検証
- **Week 8**: 最終検証・ドキュメント完成

---

**設計書完成日**: 2025年8月5日  
**実装開始**: 2025年8月19日  
**完成予定**: 2025年10月14日  

🌟 **この技術設計書により、HAQEIアナライザーは世界最高水準の正統易経システムとして、技術的にも哲学的にも完璧な実装を実現します。**