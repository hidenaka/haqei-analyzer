# HAQEI 技術アーキテクチャ仕様書

## システムアーキテクチャ概要

HAQEI は Vue 3 + Supabase を基盤とした、モダンでスケーラブルなフルスタック Web アプリケーションです。

## フロントエンド アーキテクチャ

### Vue 3 Composition API 構成

```typescript
// 主要技術スタック
Vue 3.5.18        // Composition API + <script setup>
TypeScript 5.8.3  // 型安全性保証
Vite 7.0.4        // 高速ビルド・開発環境
Pinia 3.0.3       // 状態管理
Vue Router 4.5.1  // ルーティング
```

### コンポーネントアーキテクチャ

```
src/components/
├── common/          # 再利用可能UIコンポーネント
│   ├── HButton.vue
│   ├── HCard.vue
│   ├── HInput.vue
│   ├── HModal.vue
│   └── ...
├── features/        # 機能特化コンポーネント
│   ├── MigrationDashboard.vue
│   └── ...
├── bunenjin/        # bunenjin哲学統合UI
│   ├── BunenjinPhilosophyUI.vue
│   ├── CulturalAdaptiveInterface.vue
│   ├── EasternTripleOSVisualization.vue
│   └── IChing64HexagramNavigation.vue
├── charts/          # データ可視化
│   ├── BaseChart.vue
│   ├── DimensionRadarChart.vue
│   ├── TripleOSDoughnutChart.vue
│   └── ...
├── hexagram/        # 64卦システム
│   ├── HexagramVisualization.vue
│   ├── HexagramTransition.vue
│   └── ...
├── results/         # 分析結果表示
│   ├── TripleOSOverview.vue
│   ├── DimensionBreakdown.vue
│   └── ...
└── tripleOS/        # Triple OS分析
    ├── TripleOSComparison.vue
    ├── TripleOSInsights.vue
    └── ...
```

### Composables アーキテクチャ

```typescript
// データ管理
useCRUDOperations    // 汎用CRUD操作
useDatabase          // データベース接続
useSupabase         // Supabase統合
useOfflineDatabase  // オフライン対応

// UI・UX
useProgressAnimation // アニメーション制御
useQuestionTransition // 質問遷移管理
useLoading          // ローディング状態
useErrorHandler     // エラーハンドリング

// ビジネスロジック
useTripleOS         // Triple OS分析
useCalculator       // 診断計算エンジン
useFutureSimulatorPrecision // 未来予測
useValidation       // 入力検証

// システム統合
useMigration        // データ移行
useRLS              // Row Level Security
useRealtimeSubscription // リアルタイム更新
useMultiDeviceSync  // マルチデバイス同期
```

## バックエンド・データベース設計

### Supabase 構成

```sql
-- 主要テーブル構造
analysis_results     -- 分析結果保存
├── id (uuid)
├── user_id (uuid)
├── session_id (text)
├── analysis_data (jsonb)
├── triple_os_data (jsonb)
├── hexagram_data (jsonb)
├── created_at (timestamp)
└── updated_at (timestamp)

diagnosis_history    -- 診断履歴
├── id (uuid)
├── user_id (uuid)
├── diagnosis_type (text)
├── result_data (jsonb)
├── metadata (jsonb)
└── created_at (timestamp)

user_profiles       -- ユーザープロファイル
├── id (uuid)
├── email (text)
├── preferences (jsonb)
├── privacy_settings (jsonb)
└── last_login (timestamp)
```

### Row Level Security (RLS) 設計

```sql
-- analysis_results RLS Policy
CREATE POLICY "Users can only access their own analysis results"
ON analysis_results FOR ALL USING (
  auth.uid() = user_id OR 
  auth.jwt()->>'email' = 'admin@haqei.com'
);

-- diagnosis_history RLS Policy  
CREATE POLICY "Users can only access their own diagnosis history"
ON diagnosis_history FOR ALL USING (
  auth.uid() = user_id
);

-- user_profiles RLS Policy
CREATE POLICY "Users can only access their own profile"
ON user_profiles FOR ALL USING (
  auth.uid() = id
);
```

### データマイグレーション システム

```typescript
// Migration Service Architecture
class MigrationService {
  // ローカルからSupabaseへの完全移行
  async migrateToSupabase(options: MigrationOptions): Promise<MigrationResult>
  
  // バックアップ作成・復元
  async createBackup(data: any): Promise<BackupResult>
  async restoreFromBackup(backupKey: string): Promise<RestoreResult>
  
  // データ整合性検証
  async validateDataIntegrity(): Promise<ValidationResult>
  
  // 競合解決
  async resolveConflicts(conflicts: DataConflict[]): Promise<ResolutionResult>
}
```

## セキュリティ・プライバシー アーキテクチャ

### bunenjin哲学実装

```typescript
// プライバシー最優先設計
interface BunenjinPrivacyConfig {
  dataOwnership: 'user_complete_control'
  offlineFirst: true
  transparentProcessing: true
  minimumDataCollection: true
  encryptionAtRest: true
  encryptionInTransit: true
}

// データ主権実装
class DataSovereigntyManager {
  // ユーザーによる完全データ制御
  async exportAllUserData(userId: string): Promise<UserDataExport>
  async deleteAllUserData(userId: string): Promise<DeletionResult>
  async modifyDataProcessing(preferences: PrivacyPreferences): Promise<void>
}
```

### オフライン・ファースト設計

```typescript
// IndexedDB 統合
class OfflineDatabaseService {
  // オフライン分析実行
  async performOfflineAnalysis(answers: Answer[]): Promise<AnalysisResult>
  
  // データ同期管理
  async syncWithCloud(options: SyncOptions): Promise<SyncResult>
  
  // 競合解決
  async resolveOfflineConflicts(): Promise<ConflictResolution>
}

// Service Worker 統合
class ServiceWorkerManager {
  // オフライン キャッシュ戦略
  async cacheEssentialAssets(): Promise<void>
  async handleOfflineRequests(request: Request): Promise<Response>
}
```

## パフォーマンス最適化

### レンダリング最適化

```typescript
// Vue 3 最適化技法
defineAsyncComponent    // 動的コンポーネント読み込み
ref/reactive           // 効率的反応性システム
computed               // メモ化計算
watchEffect           // 副作用管理

// Lazy Loading 実装
const LazyChart = defineAsyncComponent(() => import('./charts/BaseChart.vue'))
const LazyHexagram = defineAsyncComponent(() => import('./hexagram/HexagramVisualization.vue'))
```

### メモリ最適化

```typescript
// メモリ効率化
class MemoryOptimizer {
  // 大きなデータセットの効率的処理
  async processLargeDataset(data: any[]): Promise<ProcessedData>
  
  // ガベージコレクション最適化
  cleanupUnusedComponents(): void
  
  // キャッシュ管理
  manageComponentCache(strategy: CacheStrategy): void
}
```

## モジュール・依存関系

### 主要依存関係

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.53.0",  // バックエンド統合
    "vue": "^3.5.18",                    // フロントエンド フレームワーク
    "pinia": "^3.0.3",                   // 状態管理
    "chart.js": "^4.5.0",                // データ可視化
    "dexie": "^4.0.11",                  // IndexedDB ORM
    "vue-i18n": "^11.1.11"               // 国際化
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.1",      // Vue Vite統合
    "typescript": "~5.8.3",              // 型システム
    "vitest": "^3.2.4",                  // テストフレームワーク
    "@vue/test-utils": "^2.4.6"          // Vue テストユーティリティ
  }
}
```

### モジュール境界設計

```
Domain Layer (ビジネスロジック)
├── Triple OS Analysis Engine
├── I Ching 64 Hexagram System  
├── Future Simulation Engine
└── bunenjin Philosophy Core

Application Layer (アプリケーション層)
├── Analysis Orchestration
├── Data Migration Management
├── Privacy & Security Control
└── User Experience Coordination

Infrastructure Layer (インフラ層)
├── Supabase Integration
├── IndexedDB Management
├── Network Communication
└── Storage & Caching
```

## APIデザイン

### Supabase API統合

```typescript
// 型安全API Client
interface SupabaseClient {
  // 分析結果管理
  analysis: {
    create(data: AnalysisInput): Promise<AnalysisResult>
    read(id: string): Promise<AnalysisResult | null>
    update(id: string, data: AnalysisUpdate): Promise<AnalysisResult>
    delete(id: string): Promise<void>
    list(filters: AnalysisFilters): Promise<AnalysisResult[]>
  }
  
  // リアルタイム購読
  realtime: {
    subscribe(table: string, callback: RealtimeCallback): Subscription
    unsubscribe(subscription: Subscription): void
  }
}
```

### 内部API設計

```typescript
// 分析エンジンAPI
interface AnalysisEngine {
  // Triple OS 分析
  analyzeTripleOS(answers: Answer[]): Promise<TripleOSResult>
  
  // 64卦診断
  generateHexagram(context: DiagnosisContext): Promise<HexagramResult>
  
  // 未来シミュレーション
  simulateFuture(currentState: State, options: SimulationOptions): Promise<FutureResult>
}
```

## 運用・監視アーキテクチャ

### 監視・ログ システム

```typescript
// パフォーマンス監視
class PerformanceMonitor {
  // メトリクス収集
  collectMetrics(): Promise<PerformanceMetrics>
  
  // エラー追跡
  trackErrors(error: Error, context: ErrorContext): void
  
  // ユーザー行動分析
  trackUserBehavior(event: UserEvent): void
}

// ヘルスチェック
class HealthCheck {
  // システム状態監視
  checkSystemHealth(): Promise<HealthStatus>
  
  // データベース接続確認
  checkDatabaseConnection(): Promise<ConnectionStatus>
  
  // 外部サービス状態確認
  checkExternalServices(): Promise<ServiceStatus[]>
}
```

### デプロイメント パイプライン

```yaml
# CI/CD Pipeline
stages:
  - test           # 単体・統合テスト実行
  - build          # プロダクションビルド
  - security_scan  # セキュリティスキャン
  - deploy_staging # ステージング環境デプロイ
  - e2e_test      # E2Eテスト実行
  - deploy_prod   # 本番環境デプロイ
  - monitor       # デプロイ後監視
```

---

**技術責任者**: システムアーキテクト  
**最終更新**: 2025-08-03  
**アーキテクチャバージョン**: 1.0.0  
**技術スタック**: Vue 3 + Supabase + TypeScript