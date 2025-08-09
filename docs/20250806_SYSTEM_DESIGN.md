# HAQEI Analyzer システム改善設計書
**作成日**: 2025年8月6日（日本時間）

## 1. アーキテクチャ設計

### 1.1 現状アーキテクチャの問題点

#### モジュール構成の課題
- **巨大モノリス**: app.js (1,223行) による保守困難性
- **バンドルサイズ**: 4.76MB による初期読み込み遅延
- **密結合**: コンポーネント間の強い依存関係
- **グローバル汚染**: window オブジェクトへの直接アクセス

#### 依存関係の問題
- **循環依存**: A→B→C→A パターンの存在
- **暗黙的依存**: script タグ順序への依存
- **副作用**: importによる予期せぬ実行
- **バージョン不整合**: パッケージ間の互換性問題

#### データフローの課題
- **状態管理の分散**: 複数のストレージマネージャー
- **同期問題**: localStorage直接操作による競合
- **イベント混乱**: 複数のイベントシステム併存
- **データ整合性**: トランザクション管理の欠如

### 1.2 改善アーキテクチャ: Triple OS + Clean Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Presentation Layer                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Engine OS   │  │ Interface OS │  │ Safe Mode OS │         │
│  │     View     │  │    View      │  │    View      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  Components: QuestionFlow, ResultsView, TripleOSVisualization  │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Use Cases / Interactors              │          │
│  ├──────────────────────────────────────────────────┤          │
│  │ • AnalyzeTripleOSUseCase                         │          │
│  │ • GenerateInsightUseCase                         │          │
│  │ • ValidateBunenjinUseCase                        │          │
│  │ • InterpretIChingUseCase                         │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Domain Layer                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Core Business Logic                  │          │
│  ├──────────────────────────────────────────────────┤          │
│  │ • Bunenjin Philosophy Engine                     │          │
│  │ • I Ching Interpretation System                  │          │
│  │ • Triple OS Calculation Logic                    │          │
│  │ • Personality Analysis Algorithm                 │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                         │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Data     │  │  External  │  │   Cache    │  │ Security │ │
│  │Repository  │  │  Services  │  │ Management │  │  Layer   │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 2. モジュール設計

### 2.1 Core層（Domain Layer）

#### ドメインモデル

```typescript
// Domain/Entities/PersonalityOS.ts
export class PersonalityOS {
  private readonly hexagramId: number;
  private readonly matchPercentage: number;
  private readonly characteristics: Characteristic[];
  private readonly HaQeiAlignment: BunenjinAlignment;
  
  constructor(data: PersonalityOSData) {
    this.validateBunenjinPhilosophy(data);
    this.hexagramId = data.hexagramId;
    this.matchPercentage = data.matchPercentage;
    this.characteristics = data.characteristics;
    this.HaQeiAlignment = this.calculateAlignment(data);
  }
  
  private validateBunenjinPhilosophy(data: PersonalityOSData): void {
    // アイデンティティ固定化言語のチェック
    if (this.containsFixedIdentityLanguage(data)) {
      throw new BunenjinViolationError('Fixed identity language detected');
    }
  }
  
  public getStrategicAdvice(): StrategicAdvice {
    return new StrategicAdviceGenerator(this).generate();
  }
}

// Domain/ValueObjects/TripleOSConfiguration.ts
export class TripleOSConfiguration {
  constructor(
    public readonly engineOS: PersonalityOS,
    public readonly interfaceOS: PersonalityOS,
    public readonly safeModeOS: PersonalityOS
  ) {
    this.validateCoherence();
  }
  
  private validateCoherence(): void {
    const coherenceScore = this.calculateCoherence();
    if (coherenceScore < 0.7) {
      throw new IncoherentConfigurationError('Triple OS configuration lacks coherence');
    }
  }
}

// Domain/Services/IChingInterpreter.ts
export class IChingInterpreter {
  private readonly hexagramDatabase: HexagramDatabase;
  private readonly contextAnalyzer: ContextAnalyzer;
  
  async interpretHexagram(
    hexagramId: number,
    context: InterpretationContext
  ): Promise<IChingInterpretation> {
    const hexagram = await this.hexagramDatabase.getHexagram(hexagramId);
    const contextualFactors = this.contextAnalyzer.analyze(context);
    
    return new IChingInterpretation({
      hexagram,
      judgment: this.interpretJudgment(hexagram, contextualFactors),
      image: this.interpretImage(hexagram, contextualFactors),
      lines: this.interpretLines(hexagram, contextualFactors),
      transformation: this.calculateTransformation(hexagram, context)
    });
  }
}
```

#### インターフェース定義

```typescript
// Domain/Interfaces/IAnalysisEngine.ts
export interface IAnalysisEngine {
  analyze(answers: Answer[]): Promise<AnalysisResult>;
  generateInsights(result: AnalysisResult): Promise<Insight[]>;
  validateInput(answers: Answer[]): ValidationResult;
  calculateConfidence(result: AnalysisResult): number;
}

// Domain/Interfaces/IStorageRepository.ts
export interface IStorageRepository {
  save<T>(key: string, data: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  list(prefix?: string): Promise<string[]>;
}

// Domain/Interfaces/IEventPublisher.ts
export interface IEventPublisher {
  publish<T>(event: DomainEvent<T>): Promise<void>;
  subscribe<T>(eventType: string, handler: EventHandler<T>): Unsubscribe;
  getEventHistory(filter?: EventFilter): DomainEvent[];
}
```

### 2.2 Infrastructure層

#### データアクセス実装

```typescript
// Infrastructure/Repositories/EncryptedStorageRepository.ts
export class EncryptedStorageRepository implements IStorageRepository {
  constructor(
    private encryption: IEncryption,
    private compression: ICompression
  ) {}
  
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      const compressed = await this.compression.compress(serialized);
      const encrypted = await this.encryption.encrypt(compressed);
      
      // チャンク分割保存（大容量データ対応）
      if (encrypted.length > CHUNK_SIZE) {
        await this.saveInChunks(key, encrypted);
      } else {
        localStorage.setItem(key, encrypted);
      }
      
      // インデックス更新
      await this.updateIndex(key, data);
    } catch (error) {
      throw new StorageError(`Failed to save ${key}`, error);
    }
  }
  
  async load<T>(key: string): Promise<T | null> {
    try {
      const encrypted = await this.loadFromStorage(key);
      if (!encrypted) return null;
      
      const compressed = await this.encryption.decrypt(encrypted);
      const decompressed = await this.compression.decompress(compressed);
      return JSON.parse(decompressed) as T;
    } catch (error) {
      throw new StorageError(`Failed to load ${key}`, error);
    }
  }
}

// Infrastructure/Cache/MultiTierCache.ts
export class MultiTierCache implements ICache {
  private readonly l1Cache: MemoryCache;
  private readonly l2Cache: SessionStorageCache;
  private readonly l3Cache: LocalStorageCache;
  
  constructor(config: CacheConfig) {
    this.l1Cache = new MemoryCache(config.l1);
    this.l2Cache = new SessionStorageCache(config.l2);
    this.l3Cache = new LocalStorageCache(config.l3);
  }
  
  async get<T>(key: string): Promise<T | null> {
    // L1 → L2 → L3 の順でチェック
    let value = await this.l1Cache.get<T>(key);
    if (value) return value;
    
    value = await this.l2Cache.get<T>(key);
    if (value) {
      // L1にプロモート
      await this.l1Cache.set(key, value);
      return value;
    }
    
    value = await this.l3Cache.get<T>(key);
    if (value) {
      // L1, L2にプロモート
      await this.l2Cache.set(key, value);
      await this.l1Cache.set(key, value);
      return value;
    }
    
    return null;
  }
}
```

#### セキュリティ実装

```typescript
// Infrastructure/Security/SecurityManager.ts
export class SecurityManager {
  private readonly csrfProtection: CSRFProtection;
  private readonly xssProtection: XSSProtection;
  private readonly encryption: DataEncryption;
  private readonly validator: InputValidator;
  
  async secureRequest(request: Request): Promise<SecureRequest> {
    // CSRF トークン検証
    if (!this.csrfProtection.validateToken(request)) {
      throw new SecurityError('CSRF token validation failed');
    }
    
    // XSS サニタイゼーション
    const sanitized = this.xssProtection.sanitize(request.body);
    
    // 入力検証
    const validationResult = this.validator.validate(sanitized);
    if (!validationResult.isValid) {
      throw new ValidationError('Input validation failed', validationResult.errors);
    }
    
    // 暗号化
    const encrypted = await this.encryption.encryptSensitiveData(sanitized);
    
    return new SecureRequest(request, encrypted);
  }
}
```

### 2.3 Application層（Use Cases）

```typescript
// Application/UseCases/AnalyzeTripleOSUseCase.ts
export class AnalyzeTripleOSUseCase {
  constructor(
    private analysisEngine: IAnalysisEngine,
    private repository: IStorageRepository,
    private eventPublisher: IEventPublisher,
    private iChingInterpreter: IChingInterpreter
  ) {}
  
  async execute(command: AnalyzeCommand): Promise<TripleOSResult> {
    // 1. コマンド検証
    const validation = this.validateCommand(command);
    if (!validation.isValid) {
      throw new InvalidCommandError(validation.errors);
    }
    
    // 2. 分析開始イベント発行
    await this.eventPublisher.publish(
      new AnalysisStartedEvent(command.sessionId)
    );
    
    try {
      // 3. Triple OS 分析実行
      const analysisResult = await this.analysisEngine.analyze(command.answers);
      
      // 4. I Ching 解釈適用
      const interpretations = await Promise.all([
        this.iChingInterpreter.interpretHexagram(
          analysisResult.engineOS.hexagramId,
          { role: 'engine', answers: command.answers }
        ),
        this.iChingInterpreter.interpretHexagram(
          analysisResult.interfaceOS.hexagramId,
          { role: 'interface', answers: command.answers }
        ),
        this.iChingInterpreter.interpretHexagram(
          analysisResult.safeModeOS.hexagramId,
          { role: 'safeMode', answers: command.answers }
        )
      ]);
      
      // 5. 結果構築
      const result = new TripleOSResult({
        engineOS: this.enrichWithInterpretation(
          analysisResult.engineOS,
          interpretations[0]
        ),
        interfaceOS: this.enrichWithInterpretation(
          analysisResult.interfaceOS,
          interpretations[1]
        ),
        safeModeOS: this.enrichWithInterpretation(
          analysisResult.safeModeOS,
          interpretations[2]
        ),
        metadata: {
          timestamp: new Date(),
          sessionId: command.sessionId,
          analysisVersion: '2.0.0'
        }
      });
      
      // 6. 結果保存
      await this.repository.save(
        `analysis:${command.sessionId}`,
        result
      );
      
      // 7. 完了イベント発行
      await this.eventPublisher.publish(
        new AnalysisCompletedEvent(command.sessionId, result)
      );
      
      return result;
      
    } catch (error) {
      // エラーイベント発行
      await this.eventPublisher.publish(
        new AnalysisFailedEvent(command.sessionId, error)
      );
      throw error;
    }
  }
}
```

### 2.4 Presentation層

```typescript
// Presentation/Components/TripleOSVisualization.vue
<template>
  <div class="triple-os-visualization" :class="accessibilityClasses">
    <div class="os-container" v-for="os in tripleOS" :key="os.type">
      <OSCard
        :os="os"
        :interactive="isInteractive"
        @select="handleOSSelection"
        @hover="handleOSHover"
      />
    </div>
    
    <TransitionGroup name="fade" tag="div" class="insights-container">
      <InsightCard
        v-for="insight in visibleInsights"
        :key="insight.id"
        :insight="insight"
        :HaQei-mode="HaQeiMode"
      />
    </TransitionGroup>
    
    <AccessibilityControls
      v-if="showAccessibilityControls"
      @update="updateAccessibilitySettings"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTripleOSStore } from '@/stores/tripleOS';
import { useAccessibility } from '@/composables/useAccessibility';
import { useBunenjinPhilosophy } from '@/composables/useBunenjinPhilosophy';

const props = defineProps<{
  result: TripleOSResult;
  options?: VisualizationOptions;
}>();

const store = useTripleOSStore();
const { accessibilityClasses, updateSettings } = useAccessibility();
const { HaQeiMode, validateContent } = useBunenjinPhilosophy();

const tripleOS = computed(() => [
  { type: 'engine', ...props.result.engineOS },
  { type: 'interface', ...props.result.interfaceOS },
  { type: 'safeMode', ...props.result.safeModeOS }
]);

const visibleInsights = computed(() => {
  return store.insights
    .filter(insight => validateContent(insight.content))
    .slice(0, props.options?.maxInsights ?? 5);
});

const handleOSSelection = async (os: PersonalityOS) => {
  await store.selectOS(os);
  // アニメーション付き詳細表示
  await nextTick();
  scrollToDetails();
};
</script>
```

## 3. エラーハンドリング設計

### 3.1 統一エラーハンドリングアーキテクチャ

```typescript
// Core/ErrorHandling/UnifiedErrorHandler.ts
export class UnifiedErrorHandler {
  private readonly strategies: Map<ErrorCategory, ErrorStrategy>;
  private readonly logger: ILogger;
  private readonly notifier: INotifier;
  
  constructor(dependencies: ErrorHandlerDependencies) {
    this.strategies = new Map([
      [ErrorCategory.VALIDATION, new ValidationErrorStrategy()],
      [ErrorCategory.SECURITY, new SecurityErrorStrategy()],
      [ErrorCategory.NETWORK, new NetworkErrorStrategy()],
      [ErrorCategory.BUSINESS, new BusinessErrorStrategy()],
      [ErrorCategory.TECHNICAL, new TechnicalErrorStrategy()]
    ]);
    
    this.logger = dependencies.logger;
    this.notifier = dependencies.notifier;
  }
  
  async handle(error: HAQEIError): Promise<ErrorResolution> {
    // 1. エラー分類
    const category = this.categorizeError(error);
    
    // 2. 戦略選択
    const strategy = this.strategies.get(category) ?? 
                    new DefaultErrorStrategy();
    
    // 3. エラー処理
    const resolution = await strategy.handle(error);
    
    // 4. ロギング
    await this.logger.logError({
      error,
      category,
      resolution,
      timestamp: new Date(),
      context: this.captureContext()
    });
    
    // 5. ユーザー通知
    if (resolution.shouldNotifyUser) {
      await this.notifier.notify({
        type: resolution.notificationType,
        message: resolution.userMessage,
        actions: resolution.suggestedActions
      });
    }
    
    // 6. 回復処理
    if (resolution.recoveryAction) {
      await this.executeRecovery(resolution.recoveryAction);
    }
    
    return resolution;
  }
}
```

## 4. データフロー設計

### 4.1 イベント駆動アーキテクチャ

```typescript
// Core/Events/EventBus.ts
export class HAQEIEventBus implements IEventBus {
  private readonly subscribers: Map<string, Set<EventHandler>>;
  private readonly eventStore: IEventStore;
  private readonly middleware: EventMiddleware[];
  
  async publish<T>(event: DomainEvent<T>): Promise<void> {
    // 1. ミドルウェア処理
    let processedEvent = event;
    for (const mw of this.middleware) {
      processedEvent = await mw.process(processedEvent);
    }
    
    // 2. イベント保存
    await this.eventStore.save(processedEvent);
    
    // 3. 購読者への配信
    const handlers = this.subscribers.get(event.type) ?? new Set();
    
    await Promise.allSettled(
      Array.from(handlers).map(handler => 
        this.invokeHandler(handler, processedEvent)
      )
    );
    
    // 4. HaQei philosophy適用
    if (this.requiresBunenjinProcessing(event)) {
      await this.applyBunenjinPhilosophy(processedEvent);
    }
  }
  
  private async invokeHandler(
    handler: EventHandler,
    event: DomainEvent
  ): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      // ハンドラーエラーは他のハンドラーに影響しない
      this.handleHandlerError(handler, event, error);
    }
  }
}
```

### 4.2 状態管理パターン

```typescript
// Core/State/StateManager.ts
export class HAQEIStateManager {
  private state: Readonly<ApplicationState>;
  private readonly mutations: MutationRegistry;
  private readonly actions: ActionRegistry;
  private readonly subscribers: Set<StateSubscriber>;
  
  commit(mutation: Mutation): void {
    // 1. 現在の状態をコピー
    const newState = structuredClone(this.state);
    
    // 2. ミューテーション適用
    const mutationFn = this.mutations.get(mutation.type);
    if (!mutationFn) {
      throw new UnknownMutationError(mutation.type);
    }
    
    mutationFn(newState, mutation.payload);
    
    // 3. 状態検証
    const validation = this.validateState(newState);
    if (!validation.isValid) {
      throw new InvalidStateError(validation.errors);
    }
    
    // 4. 状態更新（不変性保証）
    this.state = Object.freeze(newState);
    
    // 5. 購読者通知
    this.notifySubscribers(mutation, this.state);
  }
  
  async dispatch(action: Action): Promise<any> {
    const actionFn = this.actions.get(action.type);
    if (!actionFn) {
      throw new UnknownActionError(action.type);
    }
    
    return actionFn({
      state: this.state,
      commit: this.commit.bind(this),
      dispatch: this.dispatch.bind(this)
    }, action.payload);
  }
}
```

## 5. パフォーマンス最適化設計

### 5.1 バンドル最適化

```typescript
// Build/BundleOptimizer.ts
export const bundleConfig: BundleConfiguration = {
  // コード分割戦略
  chunks: {
    // 即座に必要なコア機能
    core: {
      modules: ['BaseComponent', 'EventBus', 'StateManager'],
      preload: true,
      priority: 'high'
    },
    
    // 質問フロー（遅延読み込み）
    questions: {
      modules: ['QuestionFlow', 'ValidationRules'],
      preload: false,
      priority: 'medium',
      trigger: 'route:/analysis'
    },
    
    // 分析エンジン（動的インポート）
    analysis: {
      modules: ['TripleOSEngine', 'IChingInterpreter'],
      preload: false,
      priority: 'high',
      trigger: 'event:analysis-started'
    },
    
    // 結果表示（条件付き読み込み）
    results: {
      modules: ['ResultsView', 'ChartEngine', 'Visualization'],
      preload: false,
      priority: 'medium',
      trigger: 'event:analysis-completed'
    },
    
    // オプション機能（オンデマンド）
    optional: {
      modules: ['HelpSystem', 'ExportManager', 'ShareFeatures'],
      preload: false,
      priority: 'low',
      trigger: 'user-action'
    }
  },
  
  // 最適化設定
  optimization: {
    minify: true,
    treeshake: true,
    compress: true,
    splitVendor: true,
    
    // 目標メトリクス
    targets: {
      maxChunkSize: 500_000,  // 500KB
      maxAssetSize: 300_000,  // 300KB
      maxEntrypointSize: 1_000_000  // 1MB
    }
  }
};
```

### 5.2 実行時最適化

```typescript
// Performance/RuntimeOptimizer.ts
export class RuntimeOptimizer {
  // 仮想スクロール実装
  virtualScroll(items: any[], viewport: Viewport): VirtualItems {
    const startIndex = Math.floor(viewport.scrollTop / ITEM_HEIGHT);
    const endIndex = Math.ceil(
      (viewport.scrollTop + viewport.height) / ITEM_HEIGHT
    );
    
    return {
      items: items.slice(startIndex, endIndex),
      offsetY: startIndex * ITEM_HEIGHT,
      totalHeight: items.length * ITEM_HEIGHT
    };
  }
  
  // Web Worker活用
  async offloadToWorker<T>(
    task: ComputeIntensiveTask
  ): Promise<T> {
    const worker = await this.getWorker(task.type);
    
    return new Promise((resolve, reject) => {
      worker.postMessage(task.data);
      worker.onmessage = (e) => resolve(e.data);
      worker.onerror = reject;
    });
  }
  
  // リクエストバッチング
  batchRequests<T>(
    requests: Request[],
    batchSize: number = 10
  ): Promise<T[]> {
    const batches = chunk(requests, batchSize);
    
    return Promise.all(
      batches.map(batch => 
        this.executeBatch(batch)
      )
    ).then(results => results.flat());
  }
}
```

## 6. 実装ロードマップ

### Phase 1: 基盤整備（Week 1-2）
- ✅ エラーハンドリング統一
- ✅ 基本的なドメインモデル実装
- ✅ イベントシステム構築
- ✅ セキュリティ基盤強化

### Phase 2: アーキテクチャ移行（Week 3-4）
- ⏳ Clean Architecture導入
- ⏳ モジュール分割とリファクタリング
- ⏳ 依存性注入コンテナ実装
- ⏳ テスト環境整備

### Phase 3: 最適化実装（Week 5-6）
- ⏳ バンドル最適化
- ⏳ パフォーマンスチューニング
- ⏳ キャッシュ戦略実装
- ⏳ 遅延ローディング導入

### Phase 4: 品質保証（Week 7）
- ⏳ 包括的テスト実施
- ⏳ セキュリティ監査
- ⏳ パフォーマンス測定
- ⏳ ドキュメント完成

## 7. 期待される成果

### 技術的成果
- **エラー率**: 100% → 0%
- **バンドルサイズ**: 4.76MB → 3MB (37%削減)
- **初期ローディング**: 50%高速化
- **メモリ使用量**: 30%削減
- **テストカバレッジ**: 0% → 80%

### ビジネス的成果
- **ユーザー満足度**: 向上
- **開発効率**: 2倍向上
- **保守コスト**: 40%削減
- **新機能開発速度**: 3倍向上

この設計により、HAQEI Analyzerは技術的卓越性と哲学的深さを兼ね備えた、世界クラスの易経分析システムへと進化します。