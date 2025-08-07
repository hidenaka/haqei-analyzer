/**
 * HAQEI Analyzer - 完全型定義システム
 * TypeScript Strict Mode準拠の包括的型定義
 * HaQei philosophy & I Ching 統合型システム
 */

// ====================================
// 基礎型定義 - Core Types
// ====================================

/** 基本エラーカテゴリ */
export type ErrorCategory = 
  | 'VALIDATION' 
  | 'SECURITY' 
  | 'NETWORK' 
  | 'BUSINESS' 
  | 'TECHNICAL'
  | 'PHILOSOPHICAL'
  | 'ICHING';

/** 重要度レベル */
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** HAQEI専用エラー型 */
export interface HAQEIError extends Error {
  category: ErrorCategory;
  severity: SeverityLevel;
  context?: Record<string, unknown>;
  HaQeiGuidance?: string;
  ichingHexagram?: number;
  timestamp: Date;
}

/** タイムスタンプ付きベース型 */
export interface TimestampedEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================
// I Ching (易経) 型定義
// ====================================

/** 爻 (Yao) - 易経の基本要素 */
export interface YaoLine {
  position: 1 | 2 | 3 | 4 | 5 | 6;
  value: 'yin' | 'yang';
  changing: boolean;
  interpretation: string;
  advice: string;
}

/** 64卦システム */
export interface IChingHexagram extends TimestampedEntity {
  number: number; // 1-64
  name: string;
  chineseName: string;
  judgment: string;
  image: string;
  lines: [YaoLine, YaoLine, YaoLine, YaoLine, YaoLine, YaoLine];
  upperTrigram: string;
  lowerTrigram: string;
  keywords: string[];
  modernInterpretation: string;
  philosophicalGuidance: string;
}

/** 易経変換パターン */
export interface TransformationPattern {
  fromHexagram: number;
  toHexagram: number;
  changingLines: number[];
  transformationType: 'natural' | 'forced' | 'evolutionary';
  meaning: string;
}

// ====================================
// HaQei Philosophy 型定義
// ====================================

/** Multiple Dividuals概念 */
export interface MultipleDividual {
  id: string;
  name: string;
  role: string;
  characteristics: string[];
  activeInContext: string[];
  manifestationStrength: number; // 0-1
}

/** HaQei哲学コア */
export interface BunenjinPhilosophy {
  multipleDividuals: MultipleDividual[];
  fixedIdentityLanguage: boolean;
  strategicNavigation: {
    enabled: boolean;
    currentStrategy: string;
    availableStrategies: string[];
  };
  contextualAdaptation: {
    currentContext: string;
    adaptationLevel: number;
  };
}

/** HaQeiアライメント評価 */
export interface BunenjinAlignment {
  score: number; // 0-100
  strengths: string[];
  improvementAreas: string[];
  recommendedDividuals: MultipleDividual[];
  philosophicalGuidance: string;
}

// ====================================
// Triple OS Architecture 型定義
// ====================================

/** OSモード */
export type OSMode = 'engine' | 'interface' | 'safemode';

/** 個性OS */
export interface PersonalityOS extends TimestampedEntity {
  mode: OSMode;
  hexagramId: number;
  hexagramName: string;
  matchPercentage: number;
  characteristics: Characteristic[];
  HaQeiAlignment: BunenjinAlignment;
  systemRecommendations: string[];
  compatibilityMatrix: CompatibilityScore[];
}

/** Triple OS結果 */
export interface TripleOSResult extends TimestampedEntity {
  sessionId: string;
  engineOS: PersonalityOS;
  interfaceOS: PersonalityOS;
  safeModeOS: PersonalityOS;
  overallHarmony: number;
  strategicGuidance: string;
  actionPlan: ActionPlan;
  futureProjections: FutureProjection[];
}

// ====================================
// 診断・分析関連型定義
// ====================================

/** 特性定義 */
export interface Characteristic {
  id: string;
  name: string;
  category: 'personality' | 'behavioral' | 'cognitive' | 'emotional' | 'social';
  value: number; // -100 to 100
  confidence: number; // 0-1
  evidence: string[];
  ichingBasis?: number; // 関連する卦番号
}

/** 質問型定義 */
export interface Question extends TimestampedEntity {
  text: string;
  category: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: string[];
  scaleRange?: {
    min: number;
    max: number;
    step: number;
  };
  required: boolean;
  HaQeiContext?: string;
  ichingConnection?: number;
}

/** 回答型定義 */
export interface Answer extends TimestampedEntity {
  questionId: string;
  value: string | number | string[];
  confidence?: number;
  responseTime: number; // milliseconds
  metadata?: Record<string, unknown>;
}

/** 互換性スコア */
export interface CompatibilityScore {
  targetType: string;
  score: number; // 0-100
  explanation: string;
  recommendedActions: string[];
  potentialChallenges: string[];
}

// ====================================
// Future Simulator 型定義
// ====================================

/** 未来シナリオ */
export interface FutureScenario extends TimestampedEntity {
  title: string;
  description: string;
  probability: number; // 0-1
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
  triggerConditions: string[];
  outcomes: ScenarioOutcome[];
  requiredActions: string[];
  riskFactors: string[];
}

/** シナリオ結果 */
export interface ScenarioOutcome {
  description: string;
  likelihood: number; // 0-1
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number; // 1-10
  mitigationStrategies?: string[];
}

/** 行動計画 */
export interface ActionPlan extends TimestampedEntity {
  title: string;
  steps: ActionStep[];
  timeline: string;
  resources: string[];
  successMetrics: string[];
  riskMitigation: string[];
}

/** 行動ステップ */
export interface ActionStep {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: string;
  dependencies: string[];
  successCriteria: string[];
}

/** 未来予測 */
export interface FutureProjection {
  scenario: string;
  probability: number;
  timeline: string;
  keyFactors: string[];
  recommendations: string[];
  alternativeOutcomes: string[];
}

// ====================================
// UI・UX関連型定義
// ====================================

/** ナビゲーション状態 */
export interface NavigationState {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  progress: number; // 0-1
}

/** UI状態 */
export interface UIState {
  loading: boolean;
  error?: HAQEIError;
  navigation: NavigationState;
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  accessibility: AccessibilitySettings;
}

/** アクセシビリティ設定 */
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

/** モーダル設定 */
export interface ModalConfig {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  actions: ModalAction[];
  closable: boolean;
}

/** モーダルアクション */
export interface ModalAction {
  label: string;
  action: () => void | Promise<void>;
  style: 'primary' | 'secondary' | 'danger';
}

// ====================================
// API・データ関連型定義
// ====================================

/** APIレスポンスベース */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

/** APIエラー */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  category: ErrorCategory;
}

/** セッション情報 */
export interface Session extends TimestampedEntity {
  userId?: string;
  sessionData: Record<string, unknown>;
  expiresAt: Date;
  isActive: boolean;
}

/** 診断セッション */
export interface DiagnosisSession extends Session {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  result?: TripleOSResult;
}

// ====================================
// Vue Router関連型定義
// ====================================

/** ルートメタ情報 */
export interface RouteMeta {
  requiresAuth?: boolean;
  HaQeiLevel?: 'public' | 'basic' | 'advanced' | 'expert';
  ichingRequired?: boolean;
  title?: string;
  description?: string;
  keywords?: string[];
}

/** ナビゲーションガード結果 */
export type NavigationGuardResult = 
  | boolean 
  | { name: string; query?: Record<string, string> } 
  | string;

// ====================================
// パフォーマンス・監視関連型定義
// ====================================

/** パフォーマンスメトリクス */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactiveTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
}

/** エラーレポート */
export interface ErrorReport extends TimestampedEntity {
  error: HAQEIError;
  context: {
    url: string;
    userAgent: string;
    userId?: string;
    sessionId?: string;
  };
  stackTrace?: string;
  resolved: boolean;
}

// ====================================
// 型ガード関数
// ====================================

/** HAQEIError型ガード */
export function isHAQEIError(error: unknown): error is HAQEIError {
  return error instanceof Error && 
         'category' in error && 
         'severity' in error;
}

/** TripleOSResult型ガード */
export function isTripleOSResult(obj: unknown): obj is TripleOSResult {
  return typeof obj === 'object' && 
         obj !== null && 
         'engineOS' in obj && 
         'interfaceOS' in obj && 
         'safeModeOS' in obj;
}

/** IChingHexagram型ガード */
export function isIChingHexagram(obj: unknown): obj is IChingHexagram {
  return typeof obj === 'object' && 
         obj !== null && 
         'number' in obj && 
         'lines' in obj && 
         Array.isArray((obj as any).lines) && 
         (obj as any).lines.length === 6;
}

// ====================================
// ユーティリティ型
// ====================================

/** 部分的な更新のための型 */
export type PartialUpdate<T> = Partial<T> & Pick<T, 'id'>;

/** APIレスポンス用ラッパー型 */
export type APIResponseWrapper<T> = Promise<APIResponse<T>>;

/** イベントハンドラー型 */
export type EventHandler<T = Event> = (event: T) => void | Promise<void>;

/** 設定オプション型 */
export type ConfigOptions<T> = Partial<T> & {
  debug?: boolean;
  version?: string;
};

// ====================================
// エクスポート
// ====================================

// メイン型をデフォルトエクスポート
export default {
  // Core types
  HAQEIError,
  TimestampedEntity,
  
  // I Ching types
  IChingHexagram,
  YaoLine,
  TransformationPattern,
  
  // HaQei types
  BunenjinPhilosophy,
  MultipleDividual,
  BunenjinAlignment,
  
  // Triple OS types
  PersonalityOS,
  TripleOSResult,
  
  // Analysis types
  Question,
  Answer,
  Characteristic,
  
  // Future Simulator types
  FutureScenario,
  ActionPlan,
  FutureProjection,
  
  // UI types
  UIState,
  NavigationState,
  ModalConfig,
  
  // API types
  APIResponse,
  Session,
  DiagnosisSession,
  
  // Type guards
  isHAQEIError,
  isTripleOSResult,
  isIChingHexagram
};