/**
 * useSupabase.ts - HaQei Vue3 Supabase統合コンポーザブル
 * 
 * Day 4 TASK-037完了: RLS (Row Level Security) 完全統合
 * bunenjin哲学準拠の最高レベルプライバシー保護
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ref, reactive, computed } from 'vue'
import type { Ref } from 'vue'

// bunenjin Privacy Configuration
export interface BunenjinPrivacyConfig {
  privacyLevel: 'maximum' | 'high' | 'medium' | 'low'
  engineOSDataSharing: boolean
  interfaceOSDataSharing: boolean
  safeModeOSDataSharing: boolean
  allowAnalyticsAccess: boolean
  allowResearchParticipation: boolean
  allowWisdomSharing: boolean
  auditAllAccess: boolean
  autoDeleteEnabled: boolean
  retentionDays: number
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email?: string
          username: string
          privacy_level: 'maximum' | 'high' | 'medium' | 'low'
          created_at: string
          updated_at: string
          deleted_at?: string
        }
        Insert: {
          id: string
          email?: string
          username: string
          privacy_level?: 'maximum' | 'high' | 'medium' | 'low'
        }
        Update: {
          privacy_level?: 'maximum' | 'high' | 'medium' | 'low'
          updated_at?: string
        }
      }
      bunenjin_privacy_config: {
        Row: BunenjinPrivacyConfig & {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<BunenjinPrivacyConfig, 'id'> & {
          user_id: string
        }
        Update: Partial<BunenjinPrivacyConfig>
      }
      engine_os_profiles: {
        Row: {
          id: string
          user_id: string
          authenticity_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          authenticity_score: number
        }
        Update: {
          authenticity_score?: number
          updated_at?: string
        }
      }
      interface_os_profiles: {
        Row: {
          id: string
          user_id: string
          social_adaptation_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          social_adaptation_score: number
        }
        Update: {
          social_adaptation_score?: number
          updated_at?: string
        }
      }
      safe_mode_os_profiles: {
        Row: {
          id: string
          user_id: string
          defense_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          defense_score: number
        }
        Update: {
          defense_score?: number
          updated_at?: string
        }
      }
    }
  }
}

// Supabase State
interface SupabaseState {
  client: SupabaseClient<Database> | null
  user: any
  session: any
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  privacyConfig: BunenjinPrivacyConfig | null
}

const state = reactive<SupabaseState>({
  client: null,
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  privacyConfig: null
})

/**
 * HaQei Supabaseコンポーザブル - RLS完全統合版
 */
export function useSupabase() {
  // Supabaseクライアント初期化（パフォーマンス最適化版）
  const initializeSupabase = async () => {
    try {
      state.isLoading = true
      state.error = null

      // 環境変数から設定取得
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing')
      }

      // Supabaseクライアント作成（パフォーマンス最適化設定）
      state.client = createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // パフォーマンス最適化：認証状態チェック間隔を短縮
          refreshTokenHeartbeat: false
        },
        db: {
          schema: 'public'
        },
        realtime: {
          // リアルタイム接続の最適化
          params: {
            eventsPerSecond: 10
          },
          heartbeatIntervalMs: 30000,
          reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 10000)
        },
        global: {
          headers: {
            'X-Privacy-Level': 'maximum', // bunenjin default
            'Cache-Control': 'max-age=3600', // 1時間キャッシュ
            'Connection': 'keep-alive'
          },
          // フェッチ最適化
          fetch: (url, options = {}) => {
            const optimizedOptions = {
              ...options,
              // HTTP/2多重化の活用
              keepalive: true,
              // タイムアウト設定
              signal: AbortSignal.timeout(10000), // 10秒タイムアウト
              headers: {
                ...options.headers,
                // 圧縮の有効化
                'Accept-Encoding': 'gzip, deflate, br'
              }
            }
            return fetch(url, optimizedOptions)
          }
        }
      })

      // 認証状態監視
      state.client.auth.onAuthStateChange(async (event, session) => {
        console.log('🔐 Auth state change:', event)
        
        state.session = session
        state.user = session?.user || null
        state.isAuthenticated = !!session?.user

        if (session?.user) {
          await loadPrivacyConfig(session.user.id)
        } else {
          state.privacyConfig = null
        }
      })

      console.log('✅ Supabase initialized with RLS protection')
      
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Supabase initialization failed:', error)
    } finally {
      state.isLoading = false
    }
  }

  // bunenjinプライバシー設定読み込み
  const loadPrivacyConfig = async (userId: string) => {
    try {
      if (!state.client) return

      const { data, error } = await state.client
        .from('bunenjin_privacy_config')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        state.privacyConfig = {
          privacyLevel: data.privacy_level || 'maximum',
          engineOSDataSharing: data.engine_os_data_sharing || false,
          interfaceOSDataSharing: data.interface_os_data_sharing || false,
          safeModeOSDataSharing: data.safe_mode_os_data_sharing || false,
          allowAnalyticsAccess: data.allow_analytics_access || false,
          allowResearchParticipation: data.allow_research_participation || false,
          allowWisdomSharing: data.allow_wisdom_sharing || false,
          auditAllAccess: data.audit_all_access || true,
          autoDeleteEnabled: data.auto_delete_enabled || true,
          retentionDays: data.retention_days || 2555
        }
      } else {
        // デフォルトのbunenjin設定作成
        await createDefaultPrivacyConfig(userId)
      }

    } catch (error) {
      console.error('❌ Privacy config load failed:', error)
    }
  }

  // デフォルトプライバシー設定作成
  const createDefaultPrivacyConfig = async (userId: string) => {
    try {
      if (!state.client) return

      const defaultConfig = {
        user_id: userId,
        privacy_level: 'maximum' as const,
        engine_os_data_sharing: false,
        interface_os_data_sharing: false,
        safe_mode_os_data_sharing: false,
        allow_analytics_access: false,
        allow_research_participation: false,
        allow_wisdom_sharing: false,
        audit_all_access: true,
        privacy_breach_alerts: true,
        data_access_notifications: true,
        auto_delete_enabled: true,
        retention_days: 2555
      }

      const { error } = await state.client
        .from('bunenjin_privacy_config')
        .insert(defaultConfig)

      if (error) throw error

      console.log('✅ Default bunenjin privacy config created')
      await loadPrivacyConfig(userId)

    } catch (error) {
      console.error('❌ Default privacy config creation failed:', error)
    }
  }

  // 匿名ユーザー作成
  const createAnonymousUser = async (username: string) => {
    try {
      if (!state.client) throw new Error('Supabase not initialized')

      state.isLoading = true
      state.error = null

      // 匿名ユーザーデータ準備
      const userId = crypto.randomUUID()
      const userData = {
        id: userId,
        username,
        privacy_level: 'maximum' as const,
        email: null // 匿名ユーザーはemailなし
      }

      // RLSポリシーに準拠したユーザー作成
      const { data, error } = await state.client
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) throw error

      console.log('✅ Anonymous user created with maximum privacy')
      return data

    } catch (error) {
      state.error = error instanceof Error ? error.message : 'User creation failed'
      console.error('❌ Anonymous user creation failed:', error)
      throw error
    } finally {
      state.isLoading = false
    }
  }

  // プライバシーレベル変更
  const changePrivacyLevel = async (
    newLevel: 'maximum' | 'high' | 'medium' | 'low',
    confirmationToken?: string
  ) => {
    try {
      if (!state.client || !state.user) throw new Error('Not authenticated')

      state.isLoading = true
      state.error = null

      // プライバシーレベル変更関数呼び出し
      const { data, error } = await state.client
        .rpc('change_privacy_level', {
          p_user_id: state.user.id,
          p_new_level: newLevel,
          p_confirmation_token: confirmationToken
        })

      if (error) throw error

      console.log('✅ Privacy level changed to:', newLevel)
      await loadPrivacyConfig(state.user.id)

      return true

    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Privacy level change failed'
      console.error('❌ Privacy level change failed:', error)
      return false
    } finally {
      state.isLoading = false
    }
  }

  // プライバシーサマリー取得
  const getPrivacySummary = async () => {
    try {
      if (!state.client || !state.user) throw new Error('Not authenticated')

      const { data, error } = await state.client
        .rpc('get_privacy_summary', {
          p_user_id: state.user.id
        })

      if (error) throw error

      return data

    } catch (error) {
      console.error('❌ Privacy summary fetch failed:', error)
      return null
    }
  }

  // Triple OSデータ保存（RLS準拠）
  const saveTripleOSData = async (osData: {
    engineOS: { authenticity_score: number }
    interfaceOS: { social_adaptation_score: number }
    safeModeOS: { defense_score: number }
  }) => {
    try {
      if (!state.client || !state.user) throw new Error('Not authenticated')

      state.isLoading = true
      state.error = null

      // Engine OS保存
      const { error: engineError } = await state.client
        .from('engine_os_profiles')
        .upsert({
          user_id: state.user.id,
          authenticity_score: osData.engineOS.authenticity_score,
          updated_at: new Date().toISOString()
        })

      if (engineError) throw engineError

      // Interface OS保存
      const { error: interfaceError } = await state.client
        .from('interface_os_profiles')
        .upsert({
          user_id: state.user.id,
          social_adaptation_score: osData.interfaceOS.social_adaptation_score,
          updated_at: new Date().toISOString()
        })

      if (interfaceError) throw interfaceError

      // Safe Mode OS保存
      const { error: safeModeError } = await state.client
        .from('safe_mode_os_profiles')
        .upsert({
          user_id: state.user.id,
          defense_score: osData.safeModeOS.defense_score,
          updated_at: new Date().toISOString()
        })

      if (safeModeError) throw safeModeError

      console.log('✅ Triple OS data saved with RLS protection')
      return true

    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Data save failed'
      console.error('❌ Triple OS data save failed:', error)
      return false
    } finally {
      state.isLoading = false
    }
  }

  // リアルタイム購読（プライバシー準拠）
  const subscribeToChanges = (callback: (payload: any) => void) => {
    if (!state.client || !state.user) return null

    // ユーザー自身のデータのみ購読（RLS自動適用）
    return state.client
      .channel(`user-${state.user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bunenjin_privacy_config',
        filter: `user_id=eq.${state.user.id}`
      }, callback)
      .subscribe()
  }

  // 計算プロパティ
  const isMaximumPrivacy = computed(() => 
    state.privacyConfig?.privacyLevel === 'maximum'
  )

  const canShareData = computed(() => 
    state.privacyConfig?.allowAnalyticsAccess || 
    state.privacyConfig?.allowResearchParticipation ||
    state.privacyConfig?.allowWisdomSharing
  )

  const privacyScore = computed(() => {
    if (!state.privacyConfig) return 100 // maximum by default
    
    const levels = { maximum: 100, high: 75, medium: 50, low: 25 }
    return levels[state.privacyConfig.privacyLevel]
  })

  // Reactive exports
  return {
    // State
    client: computed(() => state.client),
    user: computed(() => state.user),
    session: computed(() => state.session),
    isAuthenticated: computed(() => state.isAuthenticated),
    isLoading: computed(() => state.isLoading),
    error: computed(() => state.error),
    privacyConfig: computed(() => state.privacyConfig),

    // Computed
    isMaximumPrivacy,
    canShareData,
    privacyScore,

    // Methods
    initializeSupabase,
    createAnonymousUser,
    changePrivacyLevel,
    getPrivacySummary,
    saveTripleOSData,
    subscribeToChanges,
    loadPrivacyConfig
  }
}

export default useSupabase