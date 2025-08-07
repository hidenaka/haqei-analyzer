/**
 * HAQEI Database Composable - CRUD操作統合管理
 * 
 * 目的：
 * - Triple OS Architecture完全対応の統合CRUD操作
 * - 易経64卦システムとの深い統合
 * - HaQei哲学準拠のプライバシー制御
 * - Vue 3 Composition API最適化
 * - オフライン対応とローカルストレージフォールバック
 * 
 * 機能：
 * - 分析セッション管理（開始・進捗・完了）
 * - Triple OS プロフィール管理（Engine・Interface・SafeMode）
 * - 質問応答データ管理（リアルタイム保存・復旧）
 * - 易経64卦データアクセス（高速キャッシュ・関連性解析）
 * - プライバシー設定管理（段階的制御・GDPR準拠）
 * 
 * 更新: 2025-08-03 - TASK-036実装 (基本CRUD操作)
 */

import { ref, computed, reactive, watch } from 'vue'
import type { Ref } from 'vue'
import { useSupabase, getConnectionState, type HAQEISupabaseComposable } from '@/services/supabase'
import type { 
  Database,
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  HAQEIEngineOS,
  HAQEIInterfaceOS,
  HAQEISafeModeOS,
  HAQEIHexagram,
  HAQEITrigram,
  HAQEIPrivacySettings,
  AnalysisData,
  TripleOSData,
  QuestionAnswer
} from '@/types/supabase'

// ローカルストレージキー定数
const STORAGE_KEYS = {
  USER_PROFILE: 'haqei_user_profile',
  CURRENT_SESSION: 'haqei_current_session',
  QUESTION_RESPONSES: 'haqei_question_responses',
  ANALYSIS_CACHE: 'haqei_analysis_cache',
  HEXAGRAM_CACHE: 'haqei_hexagram_cache',
  PRIVACY_SETTINGS: 'haqei_privacy_settings'
} as const

// エラー型定義
interface HAQEIOperationResult<T> {
  success: boolean
  data?: T
  error?: string
  fromCache?: boolean
}

/**
 * HAQEI Database Composableメイン関数
 * 
 * Vue 3 Composition APIでの使用に最適化されたデータベース操作
 */
export function useDatabase() {
  const supabase = useSupabase()
  
  // リアクティブ状態管理
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const connectionState = ref(getConnectionState())
  
  // 現在のユーザーセッション状態
  const currentUser = ref<HAQEIUser | null>(null)
  const currentSession = ref<HAQEIAnalysisSession | null>(null)
  const currentResponses = ref<HAQEIQuestionResponse[]>([])
  
  // Triple OS状態管理
  const tripleOSProfiles = reactive({
    engine: null as HAQEIEngineOS | null,
    interface: null as HAQEIInterfaceOS | null,
    safeMode: null as HAQEISafeModeOS | null
  })
  
  // 易経64卦システム状態
  const hexagramCache = ref<Map<number, HAQEIHexagram>>(new Map())
  const trigramCache = ref<Map<number, HAQEITrigram>>(new Map())
  
  // Computed状態
  const isOffline = computed(() => !connectionState.value.isSupabaseConnected)
  const canUseRealtime = computed(() => connectionState.value.isSupabaseConnected && connectionState.value.connectionQuality !== 'unavailable')
  
  /**
   * ユーザー管理操作
   */
  const userOperations = {
    /**
     * 新規ユーザーの作成または取得
     * 
     * 目的：
     * - HaQei哲学に基づく匿名ユーザー作成
     * - プライバシー最優先のユーザー管理
     * - ローカルストレージベースのフォールバック
     */
    async createOrGetUser(options: {
      email?: string
      username?: string
      privacyLevel?: 'maximum' | 'high' | 'medium' | 'low'
    } = {}): Promise<HAQEIOperationResult<HAQEIUser>> {
      isLoading.value = true
      error.value = null

      try {
        // オフライン時はローカルストレージから復元
        if (isOffline.value) {
          const localUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
          if (localUser) {
            const userData = JSON.parse(localUser) as HAQEIUser
            currentUser.value = userData
            return { success: true, data: userData, fromCache: true }
          }
        }

        // Supabase経由でユーザー作成
        const { data, error: supabaseError } = await supabase.client.rpc('create_anonymous_user', {
          p_email: options.email || null,
          p_username: options.username || null,
          p_privacy_level: options.privacyLevel || 'maximum'
        })

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        currentUser.value = data
        
        // ローカルストレージにバックアップ
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(data))

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'ユーザー作成に失敗しました'
        error.value = errorMessage
        return { success: false, error: errorMessage }
      } finally {
        isLoading.value = false
      }
    },

    /**
     * ユーザープライバシー設定の更新
     */
    async updatePrivacySettings(settings: Partial<HAQEIPrivacySettings>): Promise<HAQEIOperationResult<HAQEIPrivacySettings>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        if (isOffline.value) {
          const cached = localStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS)
          const current = cached ? JSON.parse(cached) : {}
          const updated = { ...current, ...settings }
          localStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(updated))
          return { success: true, data: updated, fromCache: true }
        }

        const { data, error: supabaseError } = await supabase.client
          .from('privacy_settings')
          .upsert({
            user_id: currentUser.value.id,
            ...settings
          })
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'プライバシー設定の更新に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * 分析セッション管理操作
   */
  const sessionOperations = {
    /**
     * 新しい分析セッションの開始
     * 
     * 目的：
     * - Triple OS分析セッションの初期化
     * - 質問応答プロセスの準備
     * - リアルタイム進捗追跡の設定
     */
    async startAnalysisSession(sessionType: string = 'initial'): Promise<HAQEIOperationResult<HAQEIAnalysisSession>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      isLoading.value = true

      try {
        const sessionData = {
          user_id: currentUser.value.id,
          session_type: sessionType,
          completion_status: 'in_progress' as const,
          vue_session_data: {
            startedAt: new Date().toISOString(),
            clientInfo: {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform
            }
          }
        }

        if (isOffline.value) {
          const localSession = {
            id: crypto.randomUUID(),
            ...sessionData,
            started_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as HAQEIAnalysisSession

          currentSession.value = localSession
          localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(localSession))
          return { success: true, data: localSession, fromCache: true }
        }

        const { data, error: supabaseError } = await supabase.client
          .from('analysis_sessions')
          .insert(sessionData)
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        currentSession.value = data
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(data))

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'セッション開始に失敗しました'
        error.value = errorMessage
        return { success: false, error: errorMessage }
      } finally {
        isLoading.value = false
      }
    },

    /**
     * 質問応答の保存
     * 
     * 目的：
     * - リアルタイム質問応答の保存
     * - Triple OS重み付けの自動計算
     * - 易経64卦との関連付け
     */
    async saveQuestionResponse(
      questionId: string,
      questionText: string,
      responseValue: number,
      responseTime?: number
    ): Promise<HAQEIOperationResult<HAQEIQuestionResponse>> {
      if (!currentSession.value || !currentUser.value) {
        return { success: false, error: 'セッションまたはユーザーが設定されていません' }
      }

      try {
        const responseData = {
          session_id: currentSession.value.id,
          user_id: currentUser.value.id,
          question_id: questionId,
          question_text: questionText,
          response_value: responseValue,
          response_time_seconds: responseTime,
          answered_at: new Date().toISOString()
        }

        if (isOffline.value) {
          const localResponse = {
            id: crypto.randomUUID(),
            ...responseData,
            created_at: new Date().toISOString()
          } as HAQEIQuestionResponse

          currentResponses.value.push(localResponse)
          localStorage.setItem(STORAGE_KEYS.QUESTION_RESPONSES, JSON.stringify(currentResponses.value))
          return { success: true, data: localResponse, fromCache: true }
        }

        const { data, error: supabaseError } = await supabase.client
          .from('question_responses')
          .insert(responseData)
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        currentResponses.value.push(data)
        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '回答の保存に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * セッション完了と結果保存
     * 
     * 目的：
     * - Triple OS分析結果の保存
     * - 易経64卦解釈の統合
     * - HaQei哲学的洞察の生成
     */
    async completeSession(
      analysisData: AnalysisData,
      tripleOSData: TripleOSData
    ): Promise<HAQEIOperationResult<HAQEIAnalysisSession>> {
      if (!currentSession.value) {
        return { success: false, error: 'セッションが設定されていません' }
      }

      try {
        const completionData = {
          completion_status: 'completed' as const,
          completed_at: new Date().toISOString(),
          duration_minutes: Math.round((Date.now() - new Date(currentSession.value.started_at).getTime()) / 60000),
          questions_answered: currentResponses.value.length,
          overall_harmony_score: tripleOSData.consistencyScore,
          integration_level: Math.round((tripleOSData.engineOS.matchScore + tripleOSData.interfaceOS.matchScore + tripleOSData.safeModeOS.matchScore) / 3),
          vue_session_data: {
            ...currentSession.value.vue_session_data,
            completedAt: new Date().toISOString(),
            analysisData,
            tripleOSData
          }
        }

        if (isOffline.value) {
          const updatedSession = {
            ...currentSession.value,
            ...completionData,
            updated_at: new Date().toISOString()
          }

          currentSession.value = updatedSession
          localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(updatedSession))
          return { success: true, data: updatedSession, fromCache: true }
        }

        const { data, error: supabaseError } = await supabase.client
          .from('analysis_sessions')
          .update(completionData)
          .eq('id', currentSession.value.id)
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        currentSession.value = data
        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'セッション完了に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * Triple OS操作
   */
  const tripleOSOperations = {
    /**
     * Engine OS プロフィールの作成・更新
     */
    async saveEngineOSProfile(profileData: Partial<HAQEIEngineOS>): Promise<HAQEIOperationResult<HAQEIEngineOS>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        const data = {
          user_id: currentUser.value.id,
          ...profileData,
          last_analysis_at: new Date().toISOString()
        }

        if (isOffline.value) {
          const profile = {
            id: crypto.randomUUID(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as HAQEIEngineOS

          tripleOSProfiles.engine = profile
          return { success: true, data: profile, fromCache: true }
        }

        const { data: result, error: supabaseError } = await supabase.client
          .from('engine_os_profiles')
          .upsert(data)
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        tripleOSProfiles.engine = result
        return { success: true, data: result }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Engine OSプロフィールの保存に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * Interface OS プロフィールの作成・更新
     */
    async saveInterfaceOSProfile(profileData: Partial<HAQEIInterfaceOS>): Promise<HAQEIOperationResult<HAQEIInterfaceOS>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        const data = {
          user_id: currentUser.value.id,
          ...profileData,
          last_analysis_at: new Date().toISOString()
        }

        if (isOffline.value) {
          const profile = {
            id: crypto.randomUUID(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as HAQEIInterfaceOS

          tripleOSProfiles.interface = profile
          return { success: true, data: profile, fromCache: true }
        }

        const { data: result, error: supabaseError } = await supabase.client
          .from('interface_os_profiles')
          .upsert(data)
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        tripleOSProfiles.interface = result
        return { success: true, data: result }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Interface OSプロフィールの保存に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * Safe Mode OS プロフィールの作成・更新
     */
    async saveSafeModeOSProfile(profileData: Partial<HAQEISafeModeOS>): Promise<HAQEIOperationResult<HAQEISafeModeOS>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        const data = {
          user_id: currentUser.value.id,
          ...profileData,
          last_analysis_at: new Date().toISOString()
        }

        if (isOffline.value) {
          const profile = {
            id: crypto.randomUUID(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as HAQEISafeModeOS

          tripleOSProfiles.safeMode = profile
          return { success: true, data: profile, fromCache: true }
        }

        const { data: result, error: supabaseError } = await supabase.client
          .from('safe_mode_os_profiles')
          .upsert(data)
          .select()
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        tripleOSProfiles.safeMode = result
        return { success: true, data: result }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Safe Mode OSプロフィールの保存に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * 易経64卦システム操作
   */
  const ichingOperations = {
    /**
     * 64卦データの取得（キャッシュ最適化）
     */
    async getHexagram(number: number): Promise<HAQEIOperationResult<HAQEIHexagram>> {
      // キャッシュから取得
      if (hexagramCache.value.has(number)) {
        return { success: true, data: hexagramCache.value.get(number)!, fromCache: true }
      }

      try {
        if (isOffline.value) {
          const cached = localStorage.getItem(STORAGE_KEYS.HEXAGRAM_CACHE)
          if (cached) {
            const cacheData = JSON.parse(cached)
            if (cacheData[number]) {
              const hexagram = cacheData[number] as HAQEIHexagram
              hexagramCache.value.set(number, hexagram)
              return { success: true, data: hexagram, fromCache: true }
            }
          }
          return { success: false, error: 'オフライン時：卦データが見つかりません' }
        }

        const { data, error: supabaseError } = await supabase.client
          .from('hexagrams')
          .select('*')
          .eq('number', number)
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        // キャッシュに保存
        hexagramCache.value.set(number, data)
        
        // ローカルストレージにも保存
        const cached = localStorage.getItem(STORAGE_KEYS.HEXAGRAM_CACHE)
        const cacheData = cached ? JSON.parse(cached) : {}
        cacheData[number] = data
        localStorage.setItem(STORAGE_KEYS.HEXAGRAM_CACHE, JSON.stringify(cacheData))

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '卦データの取得に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 全64卦データの一括取得
     */
    async getAllHexagrams(): Promise<HAQEIOperationResult<HAQEIHexagram[]>> {
      try {
        if (isOffline.value) {
          const cached = localStorage.getItem(STORAGE_KEYS.HEXAGRAM_CACHE)
          if (cached) {
            const cacheData = JSON.parse(cached)
            const hexagrams = Object.values(cacheData) as HAQEIHexagram[]
            return { success: true, data: hexagrams, fromCache: true }
          }
          return { success: false, error: 'オフライン時：卦データが見つかりません' }
        }

        const { data, error: supabaseError } = await supabase.client
          .from('hexagrams')
          .select('*')
          .order('number')

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        // キャッシュに保存
        data.forEach(hexagram => {
          hexagramCache.value.set(hexagram.number, hexagram)
        })

        // ローカルストレージに保存
        const cacheData = data.reduce((acc, hexagram) => {
          acc[hexagram.number] = hexagram
          return acc
        }, {} as Record<number, HAQEIHexagram>)
        localStorage.setItem(STORAGE_KEYS.HEXAGRAM_CACHE, JSON.stringify(cacheData))

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '全卦データの取得に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * 診断履歴管理操作
   */
  const historyOperations = {
    /**
     * 診断履歴の一覧取得
     * 
     * 目的：
     * - ユーザーの分析履歴の包括的取得
     * - ページネーション対応
     * - フィルタリング機能
     */
    async getDiagnosisHistory(
      userId: string,
      options: {
        limit?: number
        offset?: number
        sortBy?: 'created_at' | 'completion_time'
        sortOrder?: 'asc' | 'desc'
        dateFrom?: string
        dateTo?: string
      } = {}
    ): Promise<HAQEIOperationResult<any[]>> {
      try {
        if (isOffline.value) {
          // オフライン時はローカルストレージから取得
          const localHistory = localStorage.getItem('haqei_diagnosis_history')
          if (localHistory) {
            const history = JSON.parse(localHistory)
            return { success: true, data: history, fromCache: true }
          }
          return { success: true, data: [], fromCache: true }
        }

        let query = supabase.vue3.diagnosisHistory()
          .select('*')
          .eq('user_id', userId)

        // フィルタリング
        if (options.dateFrom) {
          query = query.gte('created_at', options.dateFrom)
        }
        if (options.dateTo) {
          query = query.lte('created_at', options.dateTo)
        }

        // ソート
        const sortBy = options.sortBy || 'created_at'
        const sortOrder = options.sortOrder || 'desc'
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })

        // ページネーション
        if (options.limit) {
          query = query.limit(options.limit)
        }
        if (options.offset) {
          query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
        }

        const { data, error } = await query

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data: data || [] }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '診断履歴の取得に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 診断履歴の削除
     */
    async deleteDiagnosisHistory(historyId: string): Promise<HAQEIOperationResult<boolean>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        if (isOffline.value) {
          return { success: false, error: 'オフライン時は削除できません' }
        }

        const { error } = await supabase.client
          .from('diagnosis_history')
          .delete()
          .eq('id', historyId)
          .eq('user_id', currentUser.value.id)

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data: true }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '診断履歴の削除に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 診断履歴のバッチ削除
     */
    async batchDeleteHistory(historyIds: string[]): Promise<HAQEIOperationResult<number>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        if (isOffline.value) {
          return { success: false, error: 'オフライン時は削除できません' }
        }

        let deletedCount = 0
        const errors: string[] = []

        // バッチサイズを制限して順次処理
        const batchSize = 50
        for (let i = 0; i < historyIds.length; i += batchSize) {
          const batch = historyIds.slice(i, i + batchSize)
          
          const { error } = await supabase.client
            .from('diagnosis_history')
            .delete()
            .in('id', batch)
            .eq('user_id', currentUser.value.id)

          if (error) {
            errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`)
          } else {
            deletedCount += batch.length
          }
        }

        if (errors.length > 0) {
          return { success: false, error: `部分的に失敗: ${errors.join(', ')}` }
        }

        return { success: true, data: deletedCount }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'バッチ削除に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * 分析結果管理操作
   */
  const analysisResultsOperations = {
    /**
     * 分析結果の保存
     */
    async saveAnalysisResult(
      sessionId: string,
      analysisData: AnalysisData,
      tripleOSData: TripleOSData
    ): Promise<HAQEIOperationResult<any>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        const resultData = {
          user_id: currentUser.value.id,
          session_id: sessionId,
          analysis_data: analysisData,
          triple_os_data: tripleOSData,
          status: 'completed' as const,
          metadata: {
            createdBy: 'haqei-vue-app',
            version: '1.0.0',
            timestamp: new Date().toISOString()
          }
        }

        if (isOffline.value) {
          const localResult = {
            id: crypto.randomUUID(),
            ...resultData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          // ローカルストレージに保存
          const cachedResults = localStorage.getItem(STORAGE_KEYS.ANALYSIS_CACHE)
          const results = cachedResults ? JSON.parse(cachedResults) : []
          results.push(localResult)
          localStorage.setItem(STORAGE_KEYS.ANALYSIS_CACHE, JSON.stringify(results))

          return { success: true, data: localResult, fromCache: true }
        }

        const { data, error } = await supabase.client
          .from('analysis_results')
          .insert(resultData)
          .select()
          .single()

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '分析結果の保存に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 分析結果の取得
     */
    async getAnalysisResult(resultId: string): Promise<HAQEIOperationResult<any>> {
      try {
        if (isOffline.value) {
          const cachedResults = localStorage.getItem(STORAGE_KEYS.ANALYSIS_CACHE)
          if (cachedResults) {
            const results = JSON.parse(cachedResults)
            const result = results.find((r: any) => r.id === resultId)
            if (result) {
              return { success: true, data: result, fromCache: true }
            }
          }
          return { success: false, error: 'オフライン時：分析結果が見つかりません' }
        }

        const { data, error } = await supabase.vue3.analysisResults()
          .select('*')
          .eq('id', resultId)
          .single()

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '分析結果の取得に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * ユーザーの全分析結果取得
     */
    async getAllAnalysisResults(
      userId: string,
      options: {
        limit?: number
        offset?: number
        status?: string
      } = {}
    ): Promise<HAQEIOperationResult<any[]>> {
      try {
        if (isOffline.value) {
          const cachedResults = localStorage.getItem(STORAGE_KEYS.ANALYSIS_CACHE)
          if (cachedResults) {
            const results = JSON.parse(cachedResults)
            const userResults = results.filter((r: any) => r.user_id === userId)
            return { success: true, data: userResults, fromCache: true }
          }
          return { success: true, data: [], fromCache: true }
        }

        let query = supabase.vue3.analysisResults()
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (options.status) {
          query = query.eq('status', options.status)
        }

        if (options.limit) {
          query = query.limit(options.limit)
        }

        if (options.offset) {
          query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
        }

        const { data, error } = await query

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data: data || [] }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '分析結果一覧の取得に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 分析結果の更新
     */
    async updateAnalysisResult(
      resultId: string,
      updates: {
        analysis_data?: AnalysisData
        triple_os_data?: TripleOSData
        status?: string
        metadata?: Record<string, any>
      }
    ): Promise<HAQEIOperationResult<any>> {
      try {
        if (isOffline.value) {
          return { success: false, error: 'オフライン時は更新できません' }
        }

        const { data, error } = await supabase.client
          .from('analysis_results')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', resultId)
          .select()
          .single()

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '分析結果の更新に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 分析結果の削除
     */
    async deleteAnalysisResult(resultId: string): Promise<HAQEIOperationResult<boolean>> {
      if (!currentUser.value) {
        return { success: false, error: 'ユーザーが設定されていません' }
      }

      try {
        if (isOffline.value) {
          return { success: false, error: 'オフライン時は削除できません' }
        }

        const { error } = await supabase.client
          .from('analysis_results')
          .delete()
          .eq('id', resultId)
          .eq('user_id', currentUser.value.id)

        if (error) {
          throw new Error(error.message)
        }

        return { success: true, data: true }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '分析結果の削除に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * バッチ処理操作
   */
  const batchOperations = {
    /**
     * 複数セッションの一括処理
     */
    async batchProcessSessions(
      sessions: Partial<HAQEIAnalysisSession>[]
    ): Promise<HAQEIOperationResult<HAQEIAnalysisSession[]>> {
      try {
        if (isOffline.value) {
          return { success: false, error: 'オフライン時はバッチ処理できません' }
        }

        const results: HAQEIAnalysisSession[] = []
        const errors: string[] = []

        // バッチサイズを制限
        const batchSize = 100
        for (let i = 0; i < sessions.length; i += batchSize) {
          const batch = sessions.slice(i, i + batchSize)
          
          const { data, error } = await supabase.client
            .from('analysis_sessions')
            .upsert(batch as any)
            .select()

          if (error) {
            errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`)
          } else {
            results.push(...(data || []))
          }
        }

        if (errors.length > 0) {
          return { success: false, error: `部分的に失敗: ${errors.join(', ')}` }
        }

        return { success: true, data: results }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'バッチ処理に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 複数質問応答の一括保存
     */
    async batchSaveResponses(
      responses: Partial<HAQEIQuestionResponse>[]
    ): Promise<HAQEIOperationResult<HAQEIQuestionResponse[]>> {
      try {
        if (isOffline.value) {
          // オフライン時はローカルストレージに保存
          const localResponses = responses.map(r => ({
            id: crypto.randomUUID(),
            ...r,
            created_at: new Date().toISOString()
          })) as HAQEIQuestionResponse[]

          currentResponses.value.push(...localResponses)
          localStorage.setItem(STORAGE_KEYS.QUESTION_RESPONSES, JSON.stringify(currentResponses.value))
          
          return { success: true, data: localResponses, fromCache: true }
        }

        const results: HAQEIQuestionResponse[] = []
        const errors: string[] = []

        const batchSize = 100
        for (let i = 0; i < responses.length; i += batchSize) {
          const batch = responses.slice(i, i + batchSize)
          
          const { data, error } = await supabase.client
            .from('question_responses')
            .insert(batch as any)
            .select()

          if (error) {
            errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`)
          } else {
            results.push(...(data || []))
          }
        }

        if (errors.length > 0) {
          return { success: false, error: `部分的に失敗: ${errors.join(', ')}` }
        }

        return { success: true, data: results }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'バッチ保存に失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  /**
   * データ同期・復旧操作
   */
  const syncOperations = {
    /**
     * オフラインデータをSupabaseに同期
     */
    async syncOfflineData(): Promise<HAQEIOperationResult<boolean>> {
      if (!connectionState.value.isSupabaseConnected) {
        return { success: false, error: 'Supabase接続が必要です' }
      }

      try {
        let syncCount = 0

        // セッションデータの同期
        const sessionData = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)
        if (sessionData) {
          const session = JSON.parse(sessionData)
          await supabase.client.from('analysis_sessions').upsert(session)
          syncCount++
        }

        // 質問応答データの同期
        const responsesData = localStorage.getItem(STORAGE_KEYS.QUESTION_RESPONSES)
        if (responsesData) {
          const responses = JSON.parse(responsesData)
          if (responses.length > 0) {
            await supabase.client.from('question_responses').upsert(responses)
            syncCount += responses.length
          }
        }

        return { success: true, data: true }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'データ同期に失敗しました'
        return { success: false, error: errorMessage }
      }
    },

    /**
     * 全データのクリア（プライバシー準拠）
     */
    async clearAllData(): Promise<HAQEIOperationResult<boolean>> {
      try {
        // ローカルストレージクリア
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key)
        })

        // リアクティブ状態のリセット
        currentUser.value = null
        currentSession.value = null
        currentResponses.value = []
        tripleOSProfiles.engine = null
        tripleOSProfiles.interface = null
        tripleOSProfiles.safeMode = null
        hexagramCache.value.clear()

        // Supabaseデータの削除（ユーザーが設定されている場合）
        if (currentUser.value && connectionState.value.isSupabaseConnected) {
          await supabase.client.from('users').delete().eq('id', currentUser.value.id)
        }

        return { success: true, data: true }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'データクリアに失敗しました'
        return { success: false, error: errorMessage }
      }
    }
  }

  // 接続状態の監視
  watch(() => getConnectionState(), (newState) => {
    connectionState.value = newState
  }, { deep: true })

  return {
    // 状態
    isLoading,
    error,
    connectionState,
    isOffline,
    canUseRealtime,
    currentUser,
    currentSession,
    currentResponses,
    tripleOSProfiles,
    hexagramCache,

    // 操作
    userOperations,
    sessionOperations,
    tripleOSOperations,
    ichingOperations,
    historyOperations,
    analysisResultsOperations,
    batchOperations,
    syncOperations
  }
}

/**
 * 型エクスポート
 */
export type HAQEIDatabaseComposable = ReturnType<typeof useDatabase>
export type { HAQEIOperationResult }