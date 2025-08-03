/**
 * Supabase Database Type Definitions
 * 
 * 目的：
 * - Supabaseデータベースの型安全性確保
 * - テーブル構造の明確化
 * - TypeScript統合
 */

export interface Database {
  public: {
    Tables: {
      // 分析結果テーブル
      analysis_results: {
        Row: AnalysisResultRow
        Insert: AnalysisResultInsert
        Update: AnalysisResultUpdate
      }
      
      // ユーザープロフィールテーブル
      user_profiles: {
        Row: UserProfileRow
        Insert: UserProfileInsert
        Update: UserProfileUpdate
      }
      
      // 診断履歴テーブル
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
      // ビュー定義（必要に応じて追加）
    }
    Functions: {
      // 関数定義（必要に応じて追加）
    }
    Enums: {
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

// Utility types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]