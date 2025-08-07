/**
 * HAQEI Analyzer - API型定義システム
 * RESTful API & GraphQL統合型システム
 */

import type { 
  HAQEIError, 
  TripleOSResult, 
  DiagnosisSession, 
  Question, 
  Answer,
  IChingHexagram,
  FutureScenario,
  ActionPlan,
  BunenjinAlignment,
  TimestampedEntity
} from './index'

// ====================================
// 基礎API型定義
// ====================================

/** HTTPメソッド */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** APIエンドポイントレスポンス */
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: APIError
  metadata?: APIMetadata
}

/** APIエラー詳細 */
export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
  category: 'CLIENT_ERROR' | 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'AUTH_ERROR' | 'RATE_LIMIT'
  timestamp: string
  requestId?: string
  HaQeiGuidance?: string
  ichingHexagram?: number
}

/** APIメタデータ */
export interface APIMetadata {
  timestamp: string
  requestId: string
  version: string
  processingTime: number
  rateLimit?: {
    remaining: number
    reset: number
    limit: number
  }
}

/** ページネーション */
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/** ページネーション付きレスポンス */
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: Pagination
}

// ====================================
// 認証関連API型定義
// ====================================

/** ログインリクエスト */
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
  HaQeiLevel?: 'basic' | 'advanced' | 'expert'
}

/** ログインレスポンス */
export interface LoginResponse {
  token: string
  refreshToken: string
  user: UserProfile
  expiresAt: string
  HaQeiCapabilities: BunenjinCapabilities
}

/** ユーザープロフィール */
export interface UserProfile extends TimestampedEntity {
  email: string
  name: string
  HaQeiLevel: 'public' | 'basic' | 'advanced' | 'expert'
  ichingKnowledge: 'none' | 'beginner' | 'intermediate' | 'advanced'
  preferences: UserPreferences
  subscriptionStatus: 'free' | 'premium' | 'expert'
}

/** ユーザー設定 */
export interface UserPreferences {
  language: 'ja' | 'en' | 'zh'
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    analysis: boolean
    insights: boolean
  }
  privacy: {
    dataSharing: boolean
    analytics: boolean
    personalization: boolean
  }
}

/** HaQei能力 */
export interface BunenjinCapabilities {
  multipleDividualsAccess: boolean
  advancedAnalysis: boolean
  futureSimulation: boolean
  ichingIntegration: boolean
  customStrategies: boolean
}

// ====================================
// 診断・分析API型定義
// ====================================

/** 診断開始リクエスト */
export interface StartDiagnosisRequest {
  type: 'quick' | 'full' | 'expert'
  language?: 'ja' | 'en'
  HaQeiMode?: boolean
  ichingMode?: boolean
  customQuestions?: string[]
}

/** 診断開始レスポンス */
export interface StartDiagnosisResponse {
  sessionId: string
  questions: Question[]
  estimatedDuration: number
  HaQeiContext: string
  ichingGuidance?: string
}

/** 回答送信リクエスト */
export interface SubmitAnswerRequest {
  sessionId: string
  questionId: string
  answer: Answer
  metadata?: {
    responseTime: number
    confidence: number
    notes?: string
  }
}

/** 回答送信レスポンス */
export interface SubmitAnswerResponse {
  accepted: boolean
  nextQuestion?: Question
  progress: {
    current: number
    total: number
    percentage: number
  }
  intermediateInsights?: string[]
}

/** 診断完了リクエスト */
export interface CompleteDiagnosisRequest {
  sessionId: string
  finalNotes?: string
}

/** 診断結果取得レスポンス */
export interface DiagnosisResultResponse {
  result: TripleOSResult
  HaQeiAlignment: BunenjinAlignment
  recommendations: string[]
  actionPlan: ActionPlan
  shareUrl?: string
}

// ====================================
// I Ching API型定義
// ====================================

/** 卦情報取得リクエスト */
export interface HexagramRequest {
  number?: number
  name?: string
  situation?: string
  includeTechnical?: boolean
  includeBunenjin?: boolean
}

/** 卦情報レスポンス */
export interface HexagramResponse {
  hexagram: IChingHexagram
  personalRelevance: {
    score: number
    aspects: string[]
    guidance: string
  }
  HaQeiInterpretation?: string
  modernApplications: string[]
}

/** 変化分析リクエスト */
export interface TransformationAnalysisRequest {
  currentHexagram: number
  targetHexagram?: number
  situation: string
  timeframe: 'immediate' | 'short' | 'medium' | 'long'
}

/** 変化分析レスポンス */
export interface TransformationAnalysisResponse {
  transformationPath: {
    from: IChingHexagram
    to: IChingHexagram
    changingLines: number[]
    difficulty: 'easy' | 'moderate' | 'challenging' | 'complex'
  }
  strategy: string[]
  timeline: string
  warnings: string[]
  opportunities: string[]
}

// ====================================
// Future Simulator API型定義
// ====================================

/** 未来シミュレーションリクエスト */
export interface FutureSimulationRequest {
  personalityProfile: TripleOSResult
  scenario: {
    type: 'career' | 'relationship' | 'health' | 'creative' | 'spiritual' | 'custom'
    description: string
    timeframe: 'days' | 'weeks' | 'months' | 'years'
    constraints?: string[]
  }
  ichingBasis?: number[]
  HaQeiStrategy?: string
}

/** 未来シミュレーションレスポンス */
export interface FutureSimulationResponse {
  scenarios: FutureScenario[]
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  riskFactors: string[]
  opportunities: string[]
  HaQeiGuidance: string
  ichingWisdom: string
}

// ====================================
// データエクスポート API型定義
// ====================================

/** エクスポートリクエスト */
export interface ExportRequest {
  sessionId?: string
  format: 'json' | 'pdf' | 'csv' | 'xml'
  includePersonalData: boolean
  includeAnalysis: boolean
  includeBunenjinInsights: boolean
  includeIchingWisdom: boolean
  language?: 'ja' | 'en'
}

/** エクスポートレスポンス */
export interface ExportResponse {
  downloadUrl: string
  expiresAt: string
  fileSize: number
  format: string
  includesPersonalData: boolean
}

// ====================================
// 管理者API型定義
// ====================================

/** システム統計 */
export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  completedAnalyses: number
  HaQeiLevelDistribution: Record<string, number>
  ichingUsageStats: Record<number, number>
  performanceMetrics: {
    averageResponseTime: number
    errorRate: number
    uptime: number
  }
}

/** ユーザー管理リクエスト */
export interface UserManagementRequest {
  action: 'promote' | 'demote' | 'suspend' | 'activate' | 'delete'
  userId: string
  reason?: string
  newLevel?: 'basic' | 'advanced' | 'expert'
}

// ====================================
// WebSocket API型定義
// ====================================

/** WebSocketメッセージ型 */
export type WebSocketMessageType = 
  | 'analysis_progress'
  | 'real_time_insights'
  | 'HaQei_update'
  | 'iching_guidance'
  | 'system_notification'
  | 'error'

/** WebSocketメッセージ */
export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType
  payload: T
  timestamp: string
  sessionId?: string
}

/** リアルタイム分析進捗 */
export interface AnalysisProgress {
  sessionId: string
  step: string
  progress: number
  currentInsight?: string
  HaQeiNote?: string
  estimatedTimeRemaining: number
}

// ====================================
// APIクライアント設定
// ====================================

/** APIクライアント設定 */
export interface APIClientConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  enableLogging: boolean
  enableCache: boolean
  cacheTimeout: number
  headers?: Record<string, string>
}

/** APIリクエスト設定 */
export interface APIRequestConfig {
  url: string
  method: HTTPMethod
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: unknown
  timeout?: number
  retryAttempts?: number
  enableCache?: boolean
  cacheKey?: string
}

// ====================================
// 型ガード関数
// ====================================

/** APIError型ガード */
export function isAPIError(obj: unknown): obj is APIError {
  return typeof obj === 'object' && 
         obj !== null && 
         'code' in obj && 
         'message' in obj &&
         'category' in obj
}

/** APIResponse型ガード */
export function isAPIResponse<T>(obj: unknown): obj is APIResponse<T> {
  return typeof obj === 'object' && 
         obj !== null && 
         'success' in obj &&
         typeof (obj as APIResponse).success === 'boolean'
}

/** WebSocketMessage型ガード */
export function isWebSocketMessage(obj: unknown): obj is WebSocketMessage {
  return typeof obj === 'object' && 
         obj !== null && 
         'type' in obj && 
         'payload' in obj && 
         'timestamp' in obj
}

// ====================================
// ユーティリティ型
// ====================================

/** APIエンドポイント定義 */
export type APIEndpoint<TRequest = unknown, TResponse = unknown> = {
  method: HTTPMethod
  path: string
  requestType?: TRequest
  responseType?: TResponse
  requiresAuth?: boolean
  HaQeiLevel?: 'public' | 'basic' | 'advanced' | 'expert'
}

/** API操作結果 */
export type APIOperationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: APIError }

export default {
  // Response types
  APIResponse,
  PaginatedResponse,
  
  // Authentication types
  LoginRequest,
  LoginResponse,
  UserProfile,
  
  // Diagnosis types
  StartDiagnosisRequest,
  DiagnosisResultResponse,
  
  // I Ching types
  HexagramRequest,
  TransformationAnalysisRequest,
  
  // Future Simulator types
  FutureSimulationRequest,
  
  // WebSocket types
  WebSocketMessage,
  AnalysisProgress,
  
  // Type guards
  isAPIError,
  isAPIResponse,
  isWebSocketMessage
}