/**
 * HAQEI Database Type Definitions
 * 
 * 目的：
 * - HAQEIデータベーススキーマとの完全型同期
 * - Triple OS Architecture型安全性確保
 * - 易経64卦システム統合
 * - bunenjin哲学準拠のプライバシー制御
 * 
 * 更新: 2025-08-03 - Vue 3統合最適化 (Migration 002対応)
 */

export interface Database {
  public: {
    Tables: {
      // === Core HAQEI Tables ===
      
      // ユーザー基盤テーブル
      users: {
        Row: UserRow
        Insert: UserInsert
        Update: UserUpdate
      }
      
      // 易経64卦システム
      trigrams: {
        Row: TrigramRow
        Insert: TrigramInsert
        Update: TrigramUpdate
      }
      
      hexagrams: {
        Row: HexagramRow
        Insert: HexagramInsert
        Update: HexagramUpdate
      }
      
      yao_lines: {
        Row: YaoLineRow
        Insert: YaoLineInsert
        Update: YaoLineUpdate
      }
      
      // Triple OS Architecture
      engine_os_profiles: {
        Row: EngineOSProfileRow
        Insert: EngineOSProfileInsert
        Update: EngineOSProfileUpdate
      }
      
      interface_os_profiles: {
        Row: InterfaceOSProfileRow
        Insert: InterfaceOSProfileInsert
        Update: InterfaceOSProfileUpdate
      }
      
      safe_mode_os_profiles: {
        Row: SafeModeOSProfileRow
        Insert: SafeModeOSProfileInsert
        Update: SafeModeOSProfileUpdate
      }
      
      // 分析・セッション管理
      analysis_sessions: {
        Row: AnalysisSessionRow
        Insert: AnalysisSessionInsert
        Update: AnalysisSessionUpdate
      }
      
      question_responses: {
        Row: QuestionResponseRow
        Insert: QuestionResponseInsert
        Update: QuestionResponseUpdate
      }
      
      // プライバシー・セキュリティ
      privacy_settings: {
        Row: PrivacySettingsRow
        Insert: PrivacySettingsInsert
        Update: PrivacySettingsUpdate
      }
      
      // OS相互作用記録
      os_interactions: {
        Row: OSInteractionRow
        Insert: OSInteractionInsert
        Update: OSInteractionUpdate
      }
      
      // === Legacy Compatibility Tables ===
      
      // 分析結果テーブル (Vue 3互換性)
      analysis_results: {
        Row: AnalysisResultRow
        Insert: AnalysisResultInsert
        Update: AnalysisResultUpdate
      }
      
      // ユーザープロフィールテーブル (Vue 3互換性)
      user_profiles: {
        Row: UserProfileRow
        Insert: UserProfileInsert
        Update: UserProfileUpdate
      }
      
      // 診断履歴テーブル (Vue 3互換性)
      diagnosis_history: {
        Row: DiagnosisHistoryRow
        Insert: DiagnosisHistoryInsert
        Update: DiagnosisHistoryUpdate
      }
      
      // 共有結果テーブル
      shared_results: {
        Row: SharedResultRow
        Insert: SharedResultInsert
        Update: SharedResultUpdate
      }
    }
    Views: {
      // Vue 3統合最適化ビュー
      vue3_analysis_results: {
        Row: Vue3AnalysisResultRow
      }
      
      vue3_user_profiles: {
        Row: Vue3UserProfileRow
      }
      
      vue3_diagnosis_history: {
        Row: Vue3DiagnosisHistoryRow
      }
    }
    Functions: {
      // Vue 3 Composition API最適化関数
      get_analysis_progress: {
        Args: { p_user_id: string }
        Returns: Record<string, any>
      }
      
      get_latest_analysis_result: {
        Args: { p_user_id: string }
        Returns: Record<string, any>
      }
      
      start_analysis_session: {
        Args: { 
          p_user_id: string
          p_session_type?: string
        }
        Returns: string
      }
      
      save_question_answer: {
        Args: {
          p_session_id: string
          p_user_id: string
          p_question_id: string
          p_question_text: string
          p_response_value: number
          p_response_time_seconds?: number
        }
        Returns: boolean
      }
    }
    Enums: {
      // プライバシーレベル
      privacy_level: 'maximum' | 'high' | 'medium' | 'low'
      
      // セッション完了状態
      completion_status: 'in_progress' | 'completed' | 'abandoned' | 'ready_for_analysis' | 'error'
      
      // OS種別
      os_type: 'engine' | 'interface' | 'safe_mode'
      
      // 相互作用タイプ
      interaction_type: 'harmony' | 'conflict' | 'synthesis' | 'dominance'
      
      // Legacy Enums (Vue 3互換性)
      sharing_privacy: 'public' | 'private' | 'limited'
      analysis_status: 'in_progress' | 'completed' | 'error'
    }
  }
}

// 分析結果テーブルの型定義
export interface AnalysisResultRow {
  id: string
  user_id: string | null
  session_id: string
  analysis_data: AnalysisData
  triple_os_data: TripleOSData
  created_at: string
  updated_at: string
  status: Database['public']['Enums']['analysis_status']
  metadata: Record<string, any> | null
}

export interface AnalysisResultInsert {
  user_id?: string | null
  session_id: string
  analysis_data: AnalysisData
  triple_os_data: TripleOSData
  status?: Database['public']['Enums']['analysis_status']
  metadata?: Record<string, any> | null
}

export interface AnalysisResultUpdate {
  analysis_data?: AnalysisData
  triple_os_data?: TripleOSData
  status?: Database['public']['Enums']['analysis_status']
  metadata?: Record<string, any> | null
  updated_at?: string
}

// ユーザープロフィールテーブルの型定義
export interface UserProfileRow {
  id: string
  auth_user_id: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  preferences: UserPreferences | null
  created_at: string
  updated_at: string
  last_active_at: string | null
}

export interface UserProfileInsert {
  auth_user_id: string
  display_name?: string | null
  email?: string | null
  avatar_url?: string | null
  preferences?: UserPreferences | null
}

export interface UserProfileUpdate {
  display_name?: string | null
  email?: string | null
  avatar_url?: string | null
  preferences?: UserPreferences | null
  last_active_at?: string | null
  updated_at?: string
}

// 診断履歴テーブルの型定義
export interface DiagnosisHistoryRow {
  id: string
  user_id: string | null
  session_id: string
  analysis_result_id: string
  completion_time: number // milliseconds
  question_count: number
  dimension_scores: Record<string, number>
  created_at: string
}

export interface DiagnosisHistoryInsert {
  user_id?: string | null
  session_id: string
  analysis_result_id: string
  completion_time: number
  question_count: number
  dimension_scores: Record<string, number>
}

export interface DiagnosisHistoryUpdate {
  completion_time?: number
  question_count?: number
  dimension_scores?: Record<string, number>
}

// 共有結果テーブルの型定義
export interface SharedResultRow {
  id: string
  analysis_result_id: string
  share_token: string
  privacy_level: Database['public']['Enums']['sharing_privacy']
  expires_at: string | null
  view_count: number
  created_at: string
  updated_at: string
  custom_message: string | null
}

export interface SharedResultInsert {
  analysis_result_id: string
  share_token: string
  privacy_level: Database['public']['Enums']['sharing_privacy']
  expires_at?: string | null
  custom_message?: string | null
}

export interface SharedResultUpdate {
  privacy_level?: Database['public']['Enums']['sharing_privacy']
  expires_at?: string | null
  view_count?: number
  custom_message?: string | null
  updated_at?: string
}

// データ型の詳細定義
export interface AnalysisData {
  timestamp: string
  dimensionScores: Record<string, number>
  totalScore: number
  averageScore: number
  questionAnswers: QuestionAnswer[]
  metadata?: {
    completionTime: number
    deviceType: string
    browserInfo: string
  }
}

export interface TripleOSData {
  engineOS: OSResult
  interfaceOS: OSResult
  safeModeOS: OSResult
  consistencyScore: number
  misalignmentData: MisalignmentData
  integrationInsights?: IntegrationInsight[]
}

export interface OSResult {
  hexagramId: number
  hexagramName: string
  hexagramDescription?: string
  matchScore: number
  trigramEnergies: Record<string, number>
  primaryTrigram: string
  secondaryTrigram: string
  characteristics: string[]
  recommendations: string[]
}

export interface MisalignmentData {
  hasSignificantMisalignment: boolean
  misalignmentPercentage: number
  riskLevel: 'low' | 'medium' | 'high'
  criticalAreas: string[]
  recommendations: string[]
}

export interface IntegrationInsight {
  title: string
  content: string
  category: string
  priority: number
  actionable: boolean
}

export interface QuestionAnswer {
  questionId: string
  answer: string | number
  timestamp: string
  responseTime?: number
}

export interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
  }
  privacy: {
    shareAnalytics: boolean
    publicProfile: boolean
  }
  analysis: {
    saveHistory: boolean
    autoSave: boolean
    detailedResults: boolean
  }
}

// === Core HAQEI Database Types ===

// ユーザー基盤型定義
export interface UserRow {
  id: string
  email: string | null
  username: string | null
  privacy_level: Database['public']['Enums']['privacy_level']
  data_sharing_consent: boolean
  analytics_opt_in: boolean
  last_active_at: string | null
  total_sessions: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  data_retention_until: string
}

export interface UserInsert {
  id?: string
  email?: string | null
  username?: string | null
  privacy_level?: Database['public']['Enums']['privacy_level']
  data_sharing_consent?: boolean
  analytics_opt_in?: boolean
}

export interface UserUpdate {
  email?: string | null
  username?: string | null
  privacy_level?: Database['public']['Enums']['privacy_level']
  data_sharing_consent?: boolean
  analytics_opt_in?: boolean
  last_active_at?: string | null
  total_sessions?: number
  updated_at?: string
}

// 易経64卦システム型定義
export interface TrigramRow {
  id: number
  name: string
  name_chinese: string
  binary_value: string
  element: string
  attribute: string
  direction: string | null
  season: string | null
  family_role: string | null
  philosophical_principle: string | null
  modern_interpretation: string | null
  created_at: string
  updated_at: string
}

export interface TrigramInsert {
  name: string
  name_chinese: string
  binary_value: string
  element: string
  attribute: string
  direction?: string | null
  season?: string | null
  family_role?: string | null
  philosophical_principle?: string | null
  modern_interpretation?: string | null
}

export interface TrigramUpdate {
  name?: string
  name_chinese?: string
  binary_value?: string
  element?: string
  attribute?: string
  direction?: string | null
  season?: string | null
  family_role?: string | null
  philosophical_principle?: string | null
  modern_interpretation?: string | null
  updated_at?: string
}

export interface HexagramRow {
  id: number
  number: number
  name: string
  name_chinese: string
  upper_trigram_id: number
  lower_trigram_id: number
  judgment: string
  image: string
  philosophical_meaning: string
  life_guidance: string
  business_application: string | null
  relationship_guidance: string | null
  engine_os_relevance: number | null
  interface_os_relevance: number | null
  safe_mode_os_relevance: number | null
  created_at: string
  updated_at: string
}

export interface HexagramInsert {
  number: number
  name: string
  name_chinese: string
  upper_trigram_id: number
  lower_trigram_id: number
  judgment: string
  image: string
  philosophical_meaning: string
  life_guidance: string
  business_application?: string | null
  relationship_guidance?: string | null
  engine_os_relevance?: number | null
  interface_os_relevance?: number | null
  safe_mode_os_relevance?: number | null
}

export interface HexagramUpdate {
  number?: number
  name?: string
  name_chinese?: string
  upper_trigram_id?: number
  lower_trigram_id?: number
  judgment?: string
  image?: string
  philosophical_meaning?: string
  life_guidance?: string
  business_application?: string | null
  relationship_guidance?: string | null
  engine_os_relevance?: number | null
  interface_os_relevance?: number | null
  safe_mode_os_relevance?: number | null
  updated_at?: string
}

export interface YaoLineRow {
  id: number
  hexagram_id: number
  position: number
  line_type: '陰' | '陽'
  text: string
  interpretation: string
  modern_meaning: string
  action_guidance: string
  timing_advice: string | null
  engine_os_impact: number | null
  interface_os_impact: number | null
  safe_mode_os_impact: number | null
  created_at: string
  updated_at: string
}

export interface YaoLineInsert {
  hexagram_id: number
  position: number
  line_type: '陰' | '陽'
  text: string
  interpretation: string
  modern_meaning: string
  action_guidance: string
  timing_advice?: string | null
  engine_os_impact?: number | null
  interface_os_impact?: number | null
  safe_mode_os_impact?: number | null
}

export interface YaoLineUpdate {
  hexagram_id?: number
  position?: number
  line_type?: '陰' | '陽'
  text?: string
  interpretation?: string
  modern_meaning?: string
  action_guidance?: string
  timing_advice?: string | null
  engine_os_impact?: number | null
  interface_os_impact?: number | null
  safe_mode_os_impact?: number | null
  updated_at?: string
}

// Triple OS Architecture型定義
export interface EngineOSProfileRow {
  id: string
  user_id: string
  intrinsic_motivation: Record<string, any>
  core_values: Record<string, any>
  life_philosophy: string | null
  primary_hexagram_id: number | null
  secondary_hexagram_id: number | null
  value_hexagram_mapping: Record<string, any> | null
  strength_areas: Record<string, any> | null
  growth_aspirations: Record<string, any> | null
  authenticity_score: number | null
  philosophical_alignment: string | null
  wisdom_integration_level: number | null
  analysis_confidence: number | null
  last_analysis_at: string | null
  created_at: string
  updated_at: string
}

export interface EngineOSProfileInsert {
  id?: string
  user_id: string
  intrinsic_motivation: Record<string, any>
  core_values: Record<string, any>
  life_philosophy?: string | null
  primary_hexagram_id?: number | null
  secondary_hexagram_id?: number | null
  value_hexagram_mapping?: Record<string, any> | null
  strength_areas?: Record<string, any> | null
  growth_aspirations?: Record<string, any> | null
  authenticity_score?: number | null
  philosophical_alignment?: string | null
  wisdom_integration_level?: number | null
  analysis_confidence?: number | null
}

export interface EngineOSProfileUpdate {
  intrinsic_motivation?: Record<string, any>
  core_values?: Record<string, any>
  life_philosophy?: string | null
  primary_hexagram_id?: number | null
  secondary_hexagram_id?: number | null
  value_hexagram_mapping?: Record<string, any> | null
  strength_areas?: Record<string, any> | null
  growth_aspirations?: Record<string, any> | null
  authenticity_score?: number | null
  philosophical_alignment?: string | null
  wisdom_integration_level?: number | null
  analysis_confidence?: number | null
  last_analysis_at?: string | null
  updated_at?: string
}

export interface InterfaceOSProfileRow {
  id: string
  user_id: string
  social_adaptation_patterns: Record<string, any>
  communication_styles: Record<string, any>
  relationship_strategies: Record<string, any> | null
  primary_hexagram_id: number | null
  secondary_hexagram_id: number | null
  social_hexagram_mapping: Record<string, any> | null
  adaptability_score: number | null
  social_intelligence_score: number | null
  empathy_level: number | null
  interpersonal_patterns: Record<string, any> | null
  conflict_resolution_style: string | null
  leadership_tendencies: Record<string, any> | null
  harmony_seeking_score: number | null
  collective_wisdom_integration: string | null
  analysis_confidence: number | null
  last_analysis_at: string | null
  created_at: string
  updated_at: string
}

export interface InterfaceOSProfileInsert {
  id?: string
  user_id: string
  social_adaptation_patterns: Record<string, any>
  communication_styles: Record<string, any>
  relationship_strategies?: Record<string, any> | null
  primary_hexagram_id?: number | null
  secondary_hexagram_id?: number | null
  social_hexagram_mapping?: Record<string, any> | null
  adaptability_score?: number | null
  social_intelligence_score?: number | null
  empathy_level?: number | null
  interpersonal_patterns?: Record<string, any> | null
  conflict_resolution_style?: string | null
  leadership_tendencies?: Record<string, any> | null
  harmony_seeking_score?: number | null
  collective_wisdom_integration?: string | null
  analysis_confidence?: number | null
}

export interface InterfaceOSProfileUpdate {
  social_adaptation_patterns?: Record<string, any>
  communication_styles?: Record<string, any>
  relationship_strategies?: Record<string, any> | null
  primary_hexagram_id?: number | null
  secondary_hexagram_id?: number | null
  social_hexagram_mapping?: Record<string, any> | null
  adaptability_score?: number | null
  social_intelligence_score?: number | null
  empathy_level?: number | null
  interpersonal_patterns?: Record<string, any> | null
  conflict_resolution_style?: string | null
  leadership_tendencies?: Record<string, any> | null
  harmony_seeking_score?: number | null
  collective_wisdom_integration?: string | null
  analysis_confidence?: number | null
  last_analysis_at?: string | null
  updated_at?: string
}

export interface SafeModeOSProfileRow {
  id: string
  user_id: string
  defense_mechanisms: Record<string, any>
  risk_assessment_patterns: Record<string, any>
  stress_response_strategies: Record<string, any> | null
  primary_hexagram_id: number | null
  secondary_hexagram_id: number | null
  safety_hexagram_mapping: Record<string, any> | null
  risk_tolerance_level: number | null
  anxiety_management_score: number | null
  resilience_level: number | null
  threat_recognition_patterns: Record<string, any> | null
  safety_seeking_behaviors: Record<string, any> | null
  comfort_zone_boundaries: Record<string, any> | null
  wisdom_based_caution: string | null
  protective_instinct_balance: number | null
  analysis_confidence: number | null
  last_analysis_at: string | null
  created_at: string
  updated_at: string
}

export interface SafeModeOSProfileInsert {
  id?: string
  user_id: string
  defense_mechanisms: Record<string, any>
  risk_assessment_patterns: Record<string, any>
  stress_response_strategies?: Record<string, any> | null
  primary_hexagram_id?: number | null
  secondary_hexagram_id?: number | null
  safety_hexagram_mapping?: Record<string, any> | null
  risk_tolerance_level?: number | null
  anxiety_management_score?: number | null
  resilience_level?: number | null
  threat_recognition_patterns?: Record<string, any> | null
  safety_seeking_behaviors?: Record<string, any> | null
  comfort_zone_boundaries?: Record<string, any> | null
  wisdom_based_caution?: string | null
  protective_instinct_balance?: number | null
  analysis_confidence?: number | null
}

export interface SafeModeOSProfileUpdate {
  defense_mechanisms?: Record<string, any>
  risk_assessment_patterns?: Record<string, any>
  stress_response_strategies?: Record<string, any> | null
  primary_hexagram_id?: number | null
  secondary_hexagram_id?: number | null
  safety_hexagram_mapping?: Record<string, any> | null
  risk_tolerance_level?: number | null
  anxiety_management_score?: number | null
  resilience_level?: number | null
  threat_recognition_patterns?: Record<string, any> | null
  safety_seeking_behaviors?: Record<string, any> | null
  comfort_zone_boundaries?: Record<string, any> | null
  wisdom_based_caution?: string | null
  protective_instinct_balance?: number | null
  analysis_confidence?: number | null
  last_analysis_at?: string | null
  updated_at?: string
}

// 分析セッション型定義
export interface AnalysisSessionRow {
  id: string
  user_id: string
  session_type: string
  completion_status: Database['public']['Enums']['completion_status']
  engine_os_profile_id: string | null
  interface_os_profile_id: string | null
  safe_mode_os_profile_id: string | null
  overall_harmony_score: number | null
  integration_level: number | null
  authenticity_alignment: number | null
  primary_life_hexagram_id: number | null
  guidance_hexagram_id: number | null
  transformation_path: Record<string, any> | null
  wisdom_synthesis: string | null
  life_guidance_summary: string | null
  philosophical_insight: string | null
  vue_session_data: Record<string, any>
  started_at: string
  completed_at: string | null
  duration_minutes: number | null
  questions_answered: number | null
  created_at: string
  updated_at: string
}

export interface AnalysisSessionInsert {
  id?: string
  user_id: string
  session_type: string
  completion_status?: Database['public']['Enums']['completion_status']
  engine_os_profile_id?: string | null
  interface_os_profile_id?: string | null
  safe_mode_os_profile_id?: string | null
  vue_session_data?: Record<string, any>
}

export interface AnalysisSessionUpdate {
  session_type?: string
  completion_status?: Database['public']['Enums']['completion_status']
  engine_os_profile_id?: string | null
  interface_os_profile_id?: string | null
  safe_mode_os_profile_id?: string | null
  overall_harmony_score?: number | null
  integration_level?: number | null
  authenticity_alignment?: number | null
  primary_life_hexagram_id?: number | null
  guidance_hexagram_id?: number | null
  transformation_path?: Record<string, any> | null
  wisdom_synthesis?: string | null
  life_guidance_summary?: string | null
  philosophical_insight?: string | null
  vue_session_data?: Record<string, any>
  completed_at?: string | null
  duration_minutes?: number | null
  questions_answered?: number | null
  updated_at?: string
}

// 質問応答型定義
export interface QuestionResponseRow {
  id: string
  session_id: string
  user_id: string
  question_id: string
  question_text: string
  question_category: string | null
  response_value: number
  response_confidence: number | null
  response_time_seconds: number | null
  engine_os_weight: number | null
  interface_os_weight: number | null
  safe_mode_os_weight: number | null
  influenced_hexagrams: number[] | null
  answered_at: string
  revised_at: string | null
  created_at: string
}

export interface QuestionResponseInsert {
  id?: string
  session_id: string
  user_id: string
  question_id: string
  question_text: string
  question_category?: string | null
  response_value: number
  response_confidence?: number | null
  response_time_seconds?: number | null
  engine_os_weight?: number | null
  interface_os_weight?: number | null
  safe_mode_os_weight?: number | null
  influenced_hexagrams?: number[] | null
}

export interface QuestionResponseUpdate {
  question_text?: string
  question_category?: string | null
  response_value?: number
  response_confidence?: number | null
  response_time_seconds?: number | null
  engine_os_weight?: number | null
  interface_os_weight?: number | null
  safe_mode_os_weight?: number | null
  influenced_hexagrams?: number[] | null
  revised_at?: string | null
}

// プライバシー設定型定義
export interface PrivacySettingsRow {
  id: string
  user_id: string
  profile_visibility: 'private' | 'anonymous' | 'shared'
  data_export_format: 'json' | 'csv' | 'pdf'
  auto_delete_enabled: boolean
  auto_delete_after_days: number
  store_engine_os_data: boolean
  store_interface_os_data: boolean
  store_safe_mode_os_data: boolean
  store_interaction_data: boolean
  anonymous_research_participation: boolean
  algorithm_improvement_contribution: boolean
  wisdom_sharing_consent: boolean
  collective_growth_participation: boolean
  created_at: string
  updated_at: string
}

export interface PrivacySettingsInsert {
  id?: string
  user_id: string
  profile_visibility?: 'private' | 'anonymous' | 'shared'
  data_export_format?: 'json' | 'csv' | 'pdf'
  auto_delete_enabled?: boolean
  auto_delete_after_days?: number
  store_engine_os_data?: boolean
  store_interface_os_data?: boolean
  store_safe_mode_os_data?: boolean
  store_interaction_data?: boolean
  anonymous_research_participation?: boolean
  algorithm_improvement_contribution?: boolean
  wisdom_sharing_consent?: boolean
  collective_growth_participation?: boolean
}

export interface PrivacySettingsUpdate {
  profile_visibility?: 'private' | 'anonymous' | 'shared'
  data_export_format?: 'json' | 'csv' | 'pdf'
  auto_delete_enabled?: boolean
  auto_delete_after_days?: number
  store_engine_os_data?: boolean
  store_interface_os_data?: boolean
  store_safe_mode_os_data?: boolean
  store_interaction_data?: boolean
  anonymous_research_participation?: boolean
  algorithm_improvement_contribution?: boolean
  wisdom_sharing_consent?: boolean
  collective_growth_participation?: boolean
  updated_at?: string
}

// OS相互作用型定義
export interface OSInteractionRow {
  id: string
  user_id: string
  interaction_type: Database['public']['Enums']['interaction_type']
  primary_os: Database['public']['Enums']['os_type']
  secondary_os: Database['public']['Enums']['os_type']
  interaction_strength: number | null
  interaction_quality: 'positive' | 'negative' | 'neutral' | 'complex' | null
  resolution_pattern: Record<string, any> | null
  representative_hexagram_id: number | null
  transformation_hexagram_id: number | null
  iching_interpretation: string | null
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant' | null
  duration_pattern: 'brief' | 'moderate' | 'extended' | 'persistent' | null
  philosophical_meaning: string | null
  growth_opportunity: string | null
  harmony_potential: string | null
  observed_at: string
  context_description: string | null
  created_at: string
}

export interface OSInteractionInsert {
  id?: string
  user_id: string
  interaction_type: Database['public']['Enums']['interaction_type']
  primary_os: Database['public']['Enums']['os_type']
  secondary_os: Database['public']['Enums']['os_type']
  interaction_strength?: number | null
  interaction_quality?: 'positive' | 'negative' | 'neutral' | 'complex' | null
  resolution_pattern?: Record<string, any> | null
  representative_hexagram_id?: number | null
  transformation_hexagram_id?: number | null
  iching_interpretation?: string | null
  frequency?: 'rare' | 'occasional' | 'frequent' | 'constant' | null
  duration_pattern?: 'brief' | 'moderate' | 'extended' | 'persistent' | null
  philosophical_meaning?: string | null
  growth_opportunity?: string | null
  harmony_potential?: string | null
  observed_at: string
  context_description?: string | null
}

export interface OSInteractionUpdate {
  interaction_type?: Database['public']['Enums']['interaction_type']
  primary_os?: Database['public']['Enums']['os_type']
  secondary_os?: Database['public']['Enums']['os_type']
  interaction_strength?: number | null
  interaction_quality?: 'positive' | 'negative' | 'neutral' | 'complex' | null
  resolution_pattern?: Record<string, any> | null
  representative_hexagram_id?: number | null
  transformation_hexagram_id?: number | null
  iching_interpretation?: string | null
  frequency?: 'rare' | 'occasional' | 'frequent' | 'constant' | null
  duration_pattern?: 'brief' | 'moderate' | 'extended' | 'persistent' | null
  philosophical_meaning?: string | null
  growth_opportunity?: string | null
  harmony_potential?: string | null
  observed_at?: string
  context_description?: string | null
}

// === Vue 3統合最適化ビュー型定義 ===

export interface Vue3AnalysisResultRow {
  id: string
  user_id: string | null
  session_id: string | null
  analysis_data: AnalysisData
  triple_os_data: TripleOSData
  created_at: string
  updated_at: string
  status: string
  metadata: Record<string, any> | null
}

export interface Vue3UserProfileRow {
  user_id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  preferences: UserPreferences | null
  created_at: string
  updated_at: string
  last_active_at: string | null
  auth_user_id: string
}

export interface Vue3DiagnosisHistoryRow {
  id: string
  user_id: string | null
  session_id: string
  analysis_result_id: string
  completion_time: number
  question_count: number
  dimension_scores: Record<string, number>
  created_at: string
}

// === Utility Types ===

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// === Vue 3 Composition API型エイリアス ===

export type HAQEIUser = UserRow
export type HAQEIAnalysisSession = AnalysisSessionRow
export type HAQEIQuestionResponse = QuestionResponseRow
export type HAQEIEngineOS = EngineOSProfileRow
export type HAQEIInterfaceOS = InterfaceOSProfileRow
export type HAQEISafeModeOS = SafeModeOSProfileRow
export type HAQEIHexagram = HexagramRow
export type HAQEITrigram = TrigramRow
export type HAQEIPrivacySettings = PrivacySettingsRow