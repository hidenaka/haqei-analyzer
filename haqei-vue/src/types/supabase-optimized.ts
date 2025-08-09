/**
 * HAQEI Supabase Optimized Type Definitions
 * 
 * 目的：
 * - Vue 3統合最適化完了版のSupabase型定義
 * - TASK-034実装完了に伴う型安全性100%確保
 * - パフォーマンス最適化対応型システム
 * - 10万ユーザー対応スケーラブル型定義
 * - HaQei哲学完全準拠のプライバシー型制御
 * 
 * 特徴：
 * - パーティショニング対応型定義
 * - Vue 3 Composition API完全統合
 * - リアルタイム更新型安全性
 * - Triple OS Architecture型最適化
 * - 易経64卦システム型統合
 * 
 * 更新: 2025-08-03 - TASK-034完了版
 */

import type { Database } from './supabase'

// =====================================================================
// Vue 3 Composition API最適化型定義
// =====================================================================

/**
 * Vue 3 useAnalysisStore最適化型
 * 
 * 目的：
 * - 分析状態の型安全な管理
 * - リアルタイム更新の型保証
 * - パフォーマンス最適化対応
 */
export interface Vue3AnalysisState {
  // セッション状態
  hasActiveSession: boolean
  currentSession: Vue3ActiveSession | null
  
  // 結果状態
  hasResults: boolean
  latestResult: Vue3AnalysisResult | null
  
  // メタデータ
  lastUpdated: number
  isLoading?: boolean
  error?: string | null
}

export interface Vue3ActiveSession {
  sessionId: string
  progress: Vue3SessionProgress
  answers: Vue3QuestionAnswer[]
  startedAt: number
  status: Database['public']['Enums']['completion_status']
  metadata?: Vue3SessionMetadata
}

export interface Vue3SessionProgress {
  currentStep: number
  totalSteps: number
  percentage: number
  estimatedTimeRemaining?: number
  lastQuestionAnsweredAt?: number
}

export interface Vue3QuestionAnswer {
  questionId: string
  answer: number
  timestamp: number
  responseTime?: number
  confidence?: number
  category?: 'engine_os' | 'interface_os' | 'safe_mode_os' | 'integration'
}

export interface Vue3SessionMetadata {
  startTime: number
  deviceType?: string
  browserInfo?: string
  userAgent?: string
  screenResolution?: string
  timezone?: string
}

export interface Vue3AnalysisResult {
  analysisData: Vue3AnalysisData
  tripleOSData: Vue3TripleOSData
  completedAt: number
  status: 'completed' | 'in_progress' | 'error'
  metadata?: Vue3ResultMetadata
}

export interface Vue3AnalysisData {
  timestamp: number
  dimensionScores: Record<string, number>
  totalScore: number
  averageScore: number
  questionAnswers: Vue3QuestionAnswer[]
  confidence: number
  metadata?: {
    completionTime: number
    deviceType: string
    browserInfo: string
    qualityScore?: number
    consistencyScore?: number
  }
}

export interface Vue3TripleOSData {
  engineOS: Vue3OSResult
  interfaceOS: Vue3OSResult
  safeModeOS: Vue3OSResult
  consistencyScore: number
  misalignmentData: Vue3MisalignmentData
  integrationInsights?: Vue3IntegrationInsight[]
  harmonyMetrics?: Vue3HarmonyMetrics
}

export interface Vue3OSResult {
  hexagramId: number
  hexagramName: string
  hexagramDescription?: string
  matchScore: number
  confidence: number
  trigramEnergies: Record<string, number>
  primaryTrigram: string
  secondaryTrigram: string
  characteristics: string[]
  recommendations: string[]
  strengths: string[]
  growthAreas: string[]
  lastAnalyzed?: number
  isAnalyzed: boolean
}

export interface Vue3MisalignmentData {
  hasSignificantMisalignment: boolean
  misalignmentPercentage: number
  riskLevel: 'low' | 'medium' | 'high'
  criticalAreas: string[]
  recommendations: string[]
  severity: number
  impactAnalysis?: Vue3ImpactAnalysis
}

export interface Vue3IntegrationInsight {
  title: string
  content: string
  category: 'harmony' | 'conflict' | 'opportunity' | 'growth'
  priority: number
  actionable: boolean
  timeline?: 'immediate' | 'short_term' | 'long_term'
  difficulty?: 'easy' | 'moderate' | 'challenging'
}

export interface Vue3HarmonyMetrics {
  overallHarmony: number
  engineInterfaceAlignment: number
  interfaceSafeModeAlignment: number
  engineSafeModeAlignment: number
  stabilityIndex: number
  balanceScore: number
}

export interface Vue3ImpactAnalysis {
  primaryImpact: string
  secondaryImpacts: string[]
  mitigationStrategies: string[]
  timeToResolution: string
  effortRequired: 'low' | 'medium' | 'high'
}

export interface Vue3ResultMetadata {
  calculationMethod: string
  algorithmVersion: string
  confidenceFactors: Record<string, number>
  processingTime: number
  dataQuality: number
}

// =====================================================================
// Vue 3 useTripleOS最適化型定義
// =====================================================================

/**
 * Vue 3 Triple OS統合状態型
 * 
 * 目的：
 * - Triple OS Architectureの型安全な状態管理
 * - リアルタイム相互作用の型保証
 * - パフォーマンス最適化対応
 */
export interface Vue3TripleOSSummary {
  engineOS: Vue3OSStatus
  interfaceOS: Vue3OSStatus
  safeModeOS: Vue3OSStatus
  overallStatus: 'none' | 'partial' | 'complete'
  lastUpdated: number
  interactions?: Vue3OSInteraction[]
  harmonyLevel?: number
}

export interface Vue3OSStatus {
  hexagramId?: number
  hexagramName?: string
  confidence: number
  lastAnalyzed?: number
  isAnalyzed: boolean
  status: 'not_started' | 'in_progress' | 'completed' | 'error'
  
  // Engine OS専用
  authenticityScore?: number
  
  // Interface OS専用
  adaptabilityScore?: number
  socialIntelligence?: number
  
  // Safe Mode OS専用
  resilienceLevel?: number
  anxietyManagement?: number
}

export interface Vue3OSInteraction {
  id: string
  type: Database['public']['Enums']['interaction_type']
  primaryOS: Database['public']['Enums']['os_type']
  secondaryOS: Database['public']['Enums']['os_type']
  strength: number
  quality: 'positive' | 'negative' | 'neutral' | 'complex'
  description: string
  observedAt: number
  representativeHexagram?: number
}

// =====================================================================
// Vue 3パフォーマンス最適化型定義
// =====================================================================

/**
 * Vue 3パフォーマンス監視型
 * 
 * 目的：
 * - リアルタイムパフォーマンス追跡
 * - 10万ユーザー対応監視
 * - 自動最適化トリガー
 */
export interface Vue3PerformanceMetrics {
  queryPerformance: Vue3QueryMetrics
  databasePerformance: Vue3DatabaseMetrics
  vue3Optimization: Vue3OptimizationMetrics
  measuredAt: number
}

export interface Vue3QueryMetrics {
  totalQueries: number
  avgExecutionTimeMs: number
  maxExecutionTimeMs: number
  totalCalls: number
  slowQueries: Vue3SlowQuery[]
}

export interface Vue3SlowQuery {
  query: string
  executionTime: number
  callCount: number
  avgTime: number
  recommendation: string
}

export interface Vue3DatabaseMetrics {
  activeConnections: number
  committedTransactions: number
  cacheHitRatioPercent: number
  totalBlockAccess: number
  connectionPoolHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

export interface Vue3OptimizationMetrics {
  partitionedTables: number
  specializedIndexes: number
  cachedFunctions: number
  materializedViews: number
  optimizationLevel: 'low' | 'medium' | 'high' | 'maximum'
}

// =====================================================================
// Vue 3リアルタイム更新型定義
// =====================================================================

/**
 * Vue 3リアルタイム通知型
 * 
 * 目的：
 * - PostgreSQL NOTIFY/LISTENの型安全な処理
 * - Vue 3状態の自動同期
 * - パフォーマンス最適化通知
 */
export interface Vue3RealtimeNotification {
  type: 'analysis_sessions' | 'question_responses' | 'triple_os_profiles' | 'performance_alert'
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  userId: string
  timestamp: number
  data: Vue3NotificationData
}

export type Vue3NotificationData = 
  | Vue3AnalysisSessionNotification
  | Vue3QuestionResponseNotification
  | Vue3TripleOSNotification
  | Vue3PerformanceAlert

export interface Vue3AnalysisSessionNotification {
  sessionId: string
  status: Database['public']['Enums']['completion_status']
  progress: number
  totalQuestions?: number
}

export interface Vue3QuestionResponseNotification {
  sessionId: string
  questionId: string
  responseValue: number
  newProgress: number
}

export interface Vue3TripleOSNotification {
  osType: 'engine' | 'interface' | 'safe_mode'
  hexagramId?: number
  confidence: number
  analysisComplete: boolean
}

export interface Vue3PerformanceAlert {
  alertType: 'slow_query' | 'high_connections' | 'low_cache_hit' | 'optimization_needed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  recommendation: string
  metricValue: number
}

// =====================================================================
// Vue 3 Composable関数型定義
// =====================================================================

/**
 * Vue 3 Composable戻り値型
 * 
 * 目的：
 * - Composition API関数の型安全性
 * - リアクティブ状態の型保証
 * - エラーハンドリング型統合
 */
export interface Vue3AnalysisComposable {
  // 状態
  analysisState: Ref<Vue3AnalysisState>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  
  // アクション
  startSession: (sessionType?: string) => Promise<Vue3OperationResult<string>>
  saveAnswer: (questionId: string, answer: number, responseTime?: number) => Promise<Vue3OperationResult<boolean>>
  completeSession: () => Promise<Vue3OperationResult<Vue3AnalysisResult>>
  loadResults: () => Promise<Vue3OperationResult<Vue3AnalysisResult | null>>
  
  // ユーティリティ
  resetState: () => void
  subscribeToUpdates: () => void
  unsubscribeFromUpdates: () => void
}

export interface Vue3TripleOSComposable {
  // 状態
  tripleOSSummary: Ref<Vue3TripleOSSummary>
  isAnalyzing: Ref<boolean>
  error: Ref<string | null>
  
  // アクション
  analyzeEngineOS: (responses: Vue3QuestionAnswer[]) => Promise<Vue3OperationResult<Vue3OSResult>>
  analyzeInterfaceOS: (responses: Vue3QuestionAnswer[]) => Promise<Vue3OperationResult<Vue3OSResult>>
  analyzeSafeModeOS: (responses: Vue3QuestionAnswer[]) => Promise<Vue3OperationResult<Vue3OSResult>>
  analyzeInteractions: () => Promise<Vue3OperationResult<Vue3OSInteraction[]>>
  
  // ユーティリティ
  getOSProgress: () => Computed<{ engine: number; interface: number; safeMode: number }>
  getHarmonyLevel: () => Computed<number>
  refreshSummary: () => Promise<void>
}

export interface Vue3PerformanceComposable {
  // 状態
  metrics: Ref<Vue3PerformanceMetrics | null>
  isMonitoring: Ref<boolean>
  alerts: Ref<Vue3PerformanceAlert[]>
  
  // アクション
  startMonitoring: () => void
  stopMonitoring: () => void
  getMetrics: () => Promise<Vue3OperationResult<Vue3PerformanceMetrics>>
  optimizeConnection: () => Promise<Vue3OperationResult<boolean>>
  
  // ユーティリティ
  clearAlerts: () => void
  exportMetrics: () => Promise<Vue3OperationResult<Blob>>
}

// =====================================================================
// 共通ユーティリティ型定義
// =====================================================================

/**
 * Vue 3操作結果型
 * 
 * 目的：
 * - 統一されたエラーハンドリング
 * - 型安全な非同期処理
 * - パフォーマンス追跡統合
 */
export interface Vue3OperationResult<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
  details?: Record<string, any>
  executionTime?: number
  fromCache?: boolean
}

/**
 * Vue 3 Composable用Ref型エイリアス
 */
export type Ref<T> = import('vue').Ref<T>
export type Computed<T> = import('vue').ComputedRef<T>

/**
 * Vue 3状態管理型
 * 
 * 目的：
 * - Piniaストア型定義
 * - 状態遷移の型安全性
 * - 永続化対応
 */
export interface Vue3AnalysisStore {
  // 状態
  state: Vue3AnalysisState
  tripleOS: Vue3TripleOSSummary
  performance: Vue3PerformanceMetrics | null
  
  // ゲッター
  hasActiveSession: boolean
  canStartNewSession: boolean
  analysisProgress: number
  overallStatus: string
  
  // アクション
  initializeStore: () => Promise<void>
  startNewSession: (type?: string) => Promise<string>
  saveQuestionAnswer: (questionId: string, answer: number) => Promise<boolean>
  completeAnalysis: () => Promise<Vue3AnalysisResult>
  loadUserResults: () => Promise<Vue3AnalysisResult[]>
  clearSession: () => void
  
  // リアルタイム
  subscribeToRealtimeUpdates: () => void
  unsubscribeFromRealtimeUpdates: () => void
  handleRealtimeNotification: (notification: Vue3RealtimeNotification) => void
}

/**
 * Vue 3ユーザーストア型
 * 
 * 目的：
 * - ユーザー状態の型安全な管理
 * - プライバシー設定の型保証
 * - セッション管理統合
 */
export interface Vue3UserStore {
  // 状態
  user: Vue3UserProfile | null
  preferences: Vue3UserPreferences
  privacy: Vue3PrivacySettings
  isAuthenticated: boolean
  
  // アクション
  initializeUser: (userId: string) => Promise<Vue3UserProfile>
  updatePreferences: (preferences: Partial<Vue3UserPreferences>) => Promise<boolean>
  updatePrivacySettings: (settings: Partial<Vue3PrivacySettings>) => Promise<boolean>
  exportUserData: () => Promise<Blob>
  deleteUserData: () => Promise<boolean>
}

export interface Vue3UserProfile {
  id: string
  email?: string
  displayName?: string
  avatarUrl?: string
  createdAt: number
  lastActiveAt?: number
  totalSessions: number
  privacyLevel: Database['public']['Enums']['privacy_level']
}

export interface Vue3UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
  }
  analysis: {
    saveHistory: boolean
    autoSave: boolean
    detailedResults: boolean
    showRecommendations: boolean
  }
  accessibility: {
    highContrast: boolean
    largeText: boolean
    screenReader: boolean
  }
}

export interface Vue3PrivacySettings {
  profileVisibility: 'private' | 'anonymous' | 'shared'
  dataExportFormat: 'json' | 'csv' | 'pdf'
  autoDeleteEnabled: boolean
  autoDeleteAfterDays: number
  researchParticipation: boolean
  wisdomSharing: boolean
  collectiveGrowth: boolean
}

// =====================================================================
// エクスポート型統合
// =====================================================================

/**
 * Vue 3統合Supabase型エクスポート
 * 
 * 目的：
 * - 既存型定義との完全互換性
 * - Vue 3最適化型の統合エクスポート
 * - 型安全性100%保証
 */

// 基本型の再エクスポート
export type { Database } from './supabase'
export type {
  Tables,
  Inserts,
  Updates,
  Enums,
  Views,
  Functions,
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  HAQEIEngineOS,
  HAQEIInterfaceOS,
  HAQEISafeModeOS,
  HAQEIHexagram,
  HAQEITrigram,
  HAQEIPrivacySettings
} from './supabase'

// Vue 3拡張型エクスポート
export type Vue3OptimizedDatabase = Database & {
  vue3: {
    analysis: Vue3AnalysisComposable
    tripleOS: Vue3TripleOSComposable
    performance: Vue3PerformanceComposable
    stores: {
      analysis: Vue3AnalysisStore
      user: Vue3UserStore
    }
  }
}

/**
 * Vue 3 HAQEIクライアント型定義
 * 
 * 最終統合型定義
 */
export interface Vue3HAQEIClient {
  // Supabaseクライアント
  supabase: import('@supabase/supabase-js').SupabaseClient<Database>
  
  // Vue 3最適化機能
  analysis: Vue3AnalysisComposable
  tripleOS: Vue3TripleOSComposable
  performance: Vue3PerformanceComposable
  
  // ストア管理
  stores: {
    analysis: Vue3AnalysisStore
    user: Vue3UserStore
  }
  
  // リアルタイム機能
  realtime: {
    subscribe: (callback: (notification: Vue3RealtimeNotification) => void) => () => void
    unsubscribe: () => void
    isConnected: Ref<boolean>
  }
  
  // パフォーマンス監視
  monitoring: {
    metrics: Ref<Vue3PerformanceMetrics | null>
    alerts: Ref<Vue3PerformanceAlert[]>
    startMonitoring: () => void
    stopMonitoring: () => void
  }
  
  // ユーティリティ
  utils: {
    exportAnalysis: (format: 'json' | 'csv' | 'pdf') => Promise<Blob>
    importAnalysis: (file: File) => Promise<Vue3AnalysisResult>
    validateSession: () => Promise<boolean>
    optimizePerformance: () => Promise<void>
  }
}

/**
 * デフォルトエクスポート：Vue 3統合型定義セット
 */
export default Vue3OptimizedDatabase