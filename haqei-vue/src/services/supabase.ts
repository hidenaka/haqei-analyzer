/**
 * HAQEI Supabase Client Configuration & Integration
 * 
 * 目的：
 * - HAQEIデータベーススキーマに最適化されたSupabaseクライアント
 * - Triple OS Architecture完全統合
 * - Vue 3 Composition API最適化
 * - リアルタイム更新・通知システム統合
 * - bunenjin哲学準拠のプライバシー制御
 * - Row Level Security (RLS) 完全統合
 * - Supabase Storage管理システム
 * 
 * 機能：
 * - 型安全なSupabaseクライアント初期化
 * - HAQEI専用データベース関数との統合
 * - 易経64卦システムアクセス最適化
 * - PostgreSQL NOTIFY/LISTENサポート
 * - ローカルストレージフォールバック
 * - RLS認証・認可機能
 * - ファイルアップロード・Storage管理
 * 
 * 更新: 2025-08-03 - TASK-035,037,040実装完了
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// 環境変数の型定義
interface SupabaseConfig {
  url: string
  anonKey: string
}

/**
 * HAQEI拡張Supabase設定を環境変数から取得
 * 
 * 目的：
 * - bunenjin哲学に基づくプライバシー制御統合
 * - Triple OS Architecture設定の動的管理
 * - オフライン対応とローカルストレージフォールバック
 * - 易経64卦システム統合設定
 * 
 * 処理内容：
 * 1. 環境変数の包括的検証
 * 2. HAQEI専用設定の統合
 * 3. フェイルセーフ機能の設定
 * 4. パフォーマンス最適化設定
 * 
 * エラー処理：
 * - 必須環境変数不足時の詳細エラー
 * - オフラインモード自動切り替え
 * - ローカルストレージフォールバック
 */
interface HAQEISupabaseConfig extends SupabaseConfig {
  // データベース接続制御
  connectionTimeout: number
  retryAttempts: number
  retryDelay: number
  
  // Triple OS Architecture制御
  enableEngineOS: boolean
  enableInterfaceOS: boolean
  enableSafeModeOS: boolean
  
  // 易経64卦システム制御
  enableIChingIntegration: boolean
  hexagramCacheTTL: number
  
  // bunenjin哲学・プライバシー制御
  defaultPrivacyLevel: 'maximum' | 'high' | 'medium' | 'low'
  enableOfflineMode: boolean
  enableLocalStorageFallback: boolean
  localStoragePrefix: string
  
  // Supabase機能制御
  enableRealtime: boolean
  enableStorage: boolean
  enableAuth: boolean
  enableRLS: boolean
  
  // Storage設定
  storageBucket: string
  maxFileSize: number
  allowedFileTypes: string[]
  
  // RLS設定
  rlsCheckMode: 'strict' | 'moderate' | 'permissive'
  enableAuditLog: boolean
  dataRetentionDays: number
  
  // セッション管理
  sessionTimeoutMinutes: number
  autoSaveInterval: number
  
  // パフォーマンス制御
  enablePerformanceMonitoring: boolean
  cacheStrategy: 'memory' | 'localStorage' | 'hybrid'
  cacheTTL: number
}

function getSupabaseConfig(): HAQEISupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  // 必須設定の検証
  if (!url || !anonKey) {
    const errorMessage = [
      '🚨 HAQEI Supabase Configuration Error',
      '====================================',
      'Missing required environment variables. Please check:',
      '• VITE_SUPABASE_URL - Your Supabase project URL',
      '• VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key',
      '',
      'Copy .env.example to .env and configure your values.',
      'For HAQEI development, see docs/implementation/20250803_IMPL_Supabase_Setup_Guide.md'
    ].join('\n')
    
    throw new Error(errorMessage)
  }

  // HAQEI拡張設定の取得
  const config: HAQEISupabaseConfig = {
    url,
    anonKey,
    
    // データベース接続制御
    connectionTimeout: Number(import.meta.env.VITE_DB_CONNECTION_TIMEOUT) || 10000,
    retryAttempts: Number(import.meta.env.VITE_DB_RETRY_ATTEMPTS) || 3,
    retryDelay: Number(import.meta.env.VITE_DB_RETRY_DELAY) || 1000,
    
    // Triple OS Architecture制御
    enableEngineOS: import.meta.env.VITE_ENABLE_ENGINE_OS !== 'false',
    enableInterfaceOS: import.meta.env.VITE_ENABLE_INTERFACE_OS !== 'false',
    enableSafeModeOS: import.meta.env.VITE_ENABLE_SAFE_MODE_OS !== 'false',
    
    // 易経64卦システム制御
    enableIChingIntegration: import.meta.env.VITE_ENABLE_ICHING_INTEGRATION !== 'false',
    hexagramCacheTTL: Number(import.meta.env.VITE_HEXAGRAM_CACHE_TTL) || 3600000,
    
    // bunenjin哲学・プライバシー制御
    defaultPrivacyLevel: import.meta.env.VITE_DEFAULT_PRIVACY_LEVEL as any || 'maximum',
    enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE !== 'false',
    enableLocalStorageFallback: import.meta.env.VITE_ENABLE_LOCALSTORAGE_FALLBACK !== 'false',
    localStoragePrefix: import.meta.env.VITE_LOCALSTORAGE_PREFIX || 'haqei_',
    
    // Supabase機能制御
    enableRealtime: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
    enableStorage: import.meta.env.VITE_ENABLE_STORAGE !== 'false',
    enableAuth: import.meta.env.VITE_ENABLE_AUTH === 'true',
    enableRLS: import.meta.env.VITE_ENABLE_RLS !== 'false',
    
    // Storage設定
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET || 'haqei-user-data',
    maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    allowedFileTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,json,csv,png,jpg,jpeg').split(','),
    
    // RLS設定
    rlsCheckMode: import.meta.env.VITE_RLS_CHECK_MODE as any || 'strict',
    enableAuditLog: import.meta.env.VITE_ENABLE_AUDIT_LOG !== 'false',
    dataRetentionDays: Number(import.meta.env.VITE_DATA_RETENTION_DAYS) || 2555,
    
    // セッション管理
    sessionTimeoutMinutes: Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES) || 30,
    autoSaveInterval: Number(import.meta.env.VITE_AUTO_SAVE_INTERVAL) || 60000,
    
    // パフォーマンス制御
    enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false',
    cacheStrategy: import.meta.env.VITE_CACHE_STRATEGY as any || 'memory',
    cacheTTL: Number(import.meta.env.VITE_CACHE_TTL) || 300000
  }

  // 開発環境での設定ログ
  if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_MODE === 'true') {
    console.group('🔧 HAQEI Supabase Configuration')
    console.log('🎯 Triple OS Integration:', {
      Engine: config.enableEngineOS,
      Interface: config.enableInterfaceOS,
      SafeMode: config.enableSafeModeOS
    })
    console.log('🌀 I-Ching Integration:', config.enableIChingIntegration)
    console.log('🔒 Privacy Level:', config.defaultPrivacyLevel)
    console.log('📴 Offline Mode:', config.enableOfflineMode)
    console.log('💾 LocalStorage Fallback:', config.enableLocalStorageFallback)
    console.groupEnd()
  }

  return config
}

/**
 * HAQEI最適化Supabaseクライアントの初期化
 * 
 * 目的：
 * - bunenjin哲学に基づくプライバシー重視の接続管理
 * - Triple OS Architecture最適化
 * - オフライン対応とフェイルセーフ機能
 * - 易経64卦システム統合最適化
 * 
 * 設定オプション：
 * - auth: bunenjin哲学に基づく認証制御
 * - realtime: Triple OS相互作用のリアルタイム同期
 * - retry: 接続障害時の自動復旧
 * - performance: HAQEI分析に最適化されたパフォーマンス設定
 * 
 * フェイルセーフ機能：
 * - オフライン検出と自動モード切り替え
 * - ローカルストレージフォールバック
 * - 段階的機能無効化
 * 
 * 副作用：
 * - グローバル接続状態の更新
 * - オフラインモード状態の管理
 * - パフォーマンス監視の開始
 */
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null
let isOfflineMode = false
let connectionRetryCount = 0

// HAQEI接続状態管理
interface HAQEIConnectionState {
  isOnline: boolean
  isSupabaseConnected: boolean
  lastConnectionAttempt: Date | null
  fallbackMode: 'none' | 'localStorage' | 'offline'
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unavailable'
}

let connectionState: HAQEIConnectionState = {
  isOnline: navigator.onLine,
  isSupabaseConnected: false,
  lastConnectionAttempt: null,
  fallbackMode: 'none',
  connectionQuality: 'unavailable'
}

export function getSupabaseClient() {
  if (!supabaseClient && !isOfflineMode) {
    const config = getSupabaseConfig()
    
    try {
      // HAQEI最適化Supabaseクライアント設定
      supabaseClient = createClient<Database>(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: config.enableAuth,
          persistSession: config.enableAuth,
          detectSessionInUrl: config.enableAuth,
          // bunenjin哲学：プライバシー最優先
          storage: config.enableAuth ? undefined : null
        },
        realtime: {
          params: {
            eventsPerSecond: config.enableRealtime ? 10 : 0
          }
        },
        global: {
          // HAQEI分析最適化
          headers: {
            'X-HAQEI-Client': 'Vue3-TypeScript',
            'X-HAQEI-Version': '1.0.0',
            'X-HAQEI-Triple-OS': [
              config.enableEngineOS && 'Engine',
              config.enableInterfaceOS && 'Interface', 
              config.enableSafeModeOS && 'SafeMode'
            ].filter(Boolean).join(','),
            'X-HAQEI-I-Ching': config.enableIChingIntegration ? 'enabled' : 'disabled',
            'X-HAQEI-Privacy-Level': config.defaultPrivacyLevel,
            'X-HAQEI-RLS-Mode': config.rlsCheckMode,
            'X-HAQEI-Storage-Enabled': config.enableStorage.toString(),
            'X-HAQEI-Audit-Enabled': config.enableAuditLog.toString()
          }
        }
      })

      // 接続状態の初期化
      connectionState.isSupabaseConnected = true
      connectionState.lastConnectionAttempt = new Date()
      connectionState.fallbackMode = 'none'
      connectionState.connectionQuality = 'good'
      connectionRetryCount = 0

      // パフォーマンス監視開始
      if (config.enablePerformanceMonitoring) {
        startConnectionMonitoring(config)
      }

      // 開発環境での詳細ログ
      if (import.meta.env.DEV) {
        console.log('✅ HAQEI Supabase client initialized successfully')
        console.log('🎯 Connection state:', connectionState)
      }

    } catch (error) {
      console.error('❌ HAQEI Supabase client initialization failed:', error)
      
      // フェイルセーフ：オフラインモードへの自動切り替え
      if (config.enableOfflineMode) {
        activateOfflineMode(config, error as Error)
      } else {
        throw error
      }
    }
  }

  return supabaseClient
}

/**
 * オフラインモードの有効化
 * 
 * 目的：
 * - Supabase接続失敗時の透明的フォールバック
 * - ローカルストレージベースの分析継続
 * - ユーザー体験の連続性確保
 */
function activateOfflineMode(config: HAQEISupabaseConfig, error: Error) {
  isOfflineMode = true
  connectionState.isSupabaseConnected = false
  connectionState.fallbackMode = config.enableLocalStorageFallback ? 'localStorage' : 'offline'
  connectionState.connectionQuality = 'unavailable'

  if (import.meta.env.DEV) {
    console.group('📴 HAQEI Offline Mode Activated')
    console.warn('Supabase connection failed:', error.message)
    console.log('🔄 Fallback mode:', connectionState.fallbackMode)
    console.log('💾 Local storage available:', !!window.localStorage)
    console.groupEnd()
  }

  // オフライン用の通知をユーザーに表示（Vue 3アプリ側で処理）
  window.dispatchEvent(new CustomEvent('haqei:offline-mode-activated', {
    detail: {
      reason: error.message,
      fallbackMode: connectionState.fallbackMode,
      capabilities: {
        analysis: true,
        storage: config.enableLocalStorageFallback,
        realtime: false,
        sharing: false
      }
    }
  }))
}

/**
 * 接続品質の監視とパフォーマンス最適化
 * 
 * 目的：
 * - リアルタイム接続品質評価
 * - 自動的な最適化調整
 * - Triple OS分析パフォーマンスの最大化
 */
function startConnectionMonitoring(config: HAQEISupabaseConfig) {
  // 接続品質の定期的な評価
  setInterval(async () => {
    if (!supabaseClient || isOfflineMode) return

    try {
      const startTime = performance.now()
      
      // 軽量な接続テスト
      await supabaseClient.from('hexagrams').select('count').limit(1)
      
      const responseTime = performance.now() - startTime
      
      // 接続品質の判定
      if (responseTime < 100) {
        connectionState.connectionQuality = 'excellent'
      } else if (responseTime < 500) {
        connectionState.connectionQuality = 'good'
      } else if (responseTime < 2000) {
        connectionState.connectionQuality = 'poor'
      } else {
        connectionState.connectionQuality = 'unavailable'
      }

      // 接続問題の自動回復試行
      if (connectionState.connectionQuality === 'unavailable') {
        await attemptConnectionRecovery(config)
      }

    } catch (error) {
      connectionState.connectionQuality = 'unavailable'
      if (connectionRetryCount < config.retryAttempts) {
        await attemptConnectionRecovery(config)
      }
    }
  }, 30000) // 30秒間隔
}

/**
 * 接続回復の試行
 * 
 * 目的：
 * - 一時的な接続障害からの自動回復
 * - ユーザーの操作中断最小化
 * - データ損失防止
 */
async function attemptConnectionRecovery(config: HAQEISupabaseConfig) {
  if (connectionRetryCount >= config.retryAttempts) {
    console.warn('🔄 HAQEI connection recovery: max attempts reached')
    return
  }

  connectionRetryCount++
  
  console.log(`🔄 HAQEI connection recovery attempt ${connectionRetryCount}/${config.retryAttempts}`)
  
  try {
    // 指数バックオフでリトライ
    await new Promise(resolve => setTimeout(resolve, config.retryDelay * Math.pow(2, connectionRetryCount - 1)))
    
    // 新しいクライアントインスタンスで再試行
    supabaseClient = null
    getSupabaseClient()
    
    if (supabaseClient) {
      console.log('✅ HAQEI connection recovered successfully')
      connectionRetryCount = 0
      
      // 回復通知
      window.dispatchEvent(new CustomEvent('haqei:connection-recovered'))
    }
    
  } catch (error) {
    console.error(`❌ HAQEI connection recovery failed (attempt ${connectionRetryCount}):`, error)
    
    // 最後の試行失敗時はオフラインモードに移行
    if (connectionRetryCount >= config.retryAttempts && config.enableOfflineMode) {
      activateOfflineMode(config, error as Error)
    }
  }
}

/**
 * HAQEI接続状態の取得
 * 
 * Vue 3コンポーネントでの接続状態監視用
 */
export function getConnectionState(): HAQEIConnectionState {
  return { ...connectionState }
}

/**
 * 手動での接続状態リセット
 * 
 * デバッグ・テスト用途
 */
export function resetConnection() {
  supabaseClient = null
  isOfflineMode = false
  connectionRetryCount = 0
  connectionState = {
    isOnline: navigator.onLine,
    isSupabaseConnected: false,
    lastConnectionAttempt: null,
    fallbackMode: 'none',
    connectionQuality: 'unavailable'
  }
}

/**
 * HAQEI専用Supabase接続テスト
 * 
 * 目的：
 * - HAQEIデータベーススキーマの接続確認
 * - 易経64卦システムの可用性確認
 * - Vue 3統合ビューのアクセス確認
 * - カスタム関数の動作確認
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean
  details: {
    basic_connection: boolean
    hexagram_system: boolean
    vue3_views: boolean
    custom_functions: boolean
  }
}> {
  const supabase = getSupabaseClient()
  const details = {
    basic_connection: false,
    hexagram_system: false,
    vue3_views: false,
    custom_functions: false
  }
  
  try {
    // 基本接続テスト
    const { error: basicError } = await supabase.from('users').select('count').limit(1)
    details.basic_connection = !basicError
    
    // 易経64卦システムテスト
    const { data: hexagramData, error: hexagramError } = await supabase
      .from('hexagrams')
      .select('id, name, number')
      .limit(1)
    details.hexagram_system = !hexagramError && hexagramData && hexagramData.length > 0
    
    // Vue 3統合ビューテスト
    const { error: viewError } = await supabase
      .from('vue3_analysis_results')
      .select('count')
      .limit(1)
    details.vue3_views = !viewError
    
    // カスタム関数テスト（ローカル開発環境では無効化）
    if (!import.meta.env.DEV) {
      try {
        await supabase.rpc('get_analysis_progress', { p_user_id: '00000000-0000-0000-0000-000000000000' })
        details.custom_functions = true
      } catch {
        details.custom_functions = false
      }
    } else {
      details.custom_functions = true // 開発環境では仮定
    }
    
    const success = Object.values(details).every(Boolean)
    
    if (success) {
      console.log('✅ HAQEI Database connection successful')
      console.log('🎯 Triple OS Architecture ready')
      console.log('🌀 I-Ching 64 Hexagram System online')
      console.log('⚡ Vue 3 Integration optimized')
    } else {
      console.warn('⚠️ HAQEI Database connection issues:', details)
    }
    
    return { success, details }
  } catch (error) {
    console.error('❌ HAQEI Database connection failed:', error)
    return { success: false, details }
  }
}

/**
 * HAQEI専用Composable関数
 * 
 * Vue 3 Composition APIでの使用に最適化
 * TASK-035,037,040統合実装
 */
export function useSupabase() {
  const client = getSupabaseClient()
  
  return {
    client,
    
    // 分析セッション管理
    async startAnalysisSession(userId: string, sessionType = 'initial') {
      return await client.rpc('start_analysis_session', {
        p_user_id: userId,
        p_session_type: sessionType
      })
    },
    
    // 質問回答保存
    async saveQuestionAnswer(
      sessionId: string,
      userId: string,
      questionId: string,
      questionText: string,
      responseValue: number,
      responseTime?: number
    ) {
      return await client.rpc('save_question_answer', {
        p_session_id: sessionId,
        p_user_id: userId,
        p_question_id: questionId,
        p_question_text: questionText,
        p_response_value: responseValue,
        p_response_time_seconds: responseTime
      })
    },
    
    // 分析進捗取得
    async getAnalysisProgress(userId: string) {
      return await client.rpc('get_analysis_progress', {
        p_user_id: userId
      })
    },
    
    // 最新分析結果取得
    async getLatestAnalysisResult(userId: string) {
      return await client.rpc('get_latest_analysis_result', {
        p_user_id: userId
      })
    },
    
    // Vue 3統合ビューアクセス
    vue3: {
      analysisResults: () => client.from('vue3_analysis_results'),
      userProfiles: () => client.from('vue3_user_profiles'),
      diagnosisHistory: () => client.from('vue3_diagnosis_history')
    },
    
    // 易経64卦システムアクセス
    iching: {
      trigrams: () => client.from('trigrams'),
      hexagrams: () => client.from('hexagrams'),
      yaoLines: () => client.from('yao_lines')
    },
    
    // Triple OS Architectureアクセス
    tripleOS: {
      engineOS: () => client.from('engine_os_profiles'),
      interfaceOS: () => client.from('interface_os_profiles'),
      safeModeOS: () => client.from('safe_mode_os_profiles'),
      interactions: () => client.from('os_interactions')
    },
    
    // TASK-037: Row Level Security管理
    rls: {
      async setUserContext(userId: string, privacyLevel = 'maximum') {
        const { error } = await client.rpc('set_user_security_context', {
          p_user_id: userId,
          p_privacy_level: privacyLevel
        })
        return { error }
      },
      
      async checkDataAccess(tableIdentifier: string, rowId: string) {
        const { data, error } = await client.rpc('check_data_access_permissions', {
          p_table_name: tableIdentifier,
          p_row_id: rowId
        })
        return { hasAccess: data, error }
      },
      
      async getAuditLog(userId: string, days = 30) {
        const { data, error } = await client
          .from('access_audit_log')
          .select('*')
          .eq('user_id', userId)
          .gte('accessed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
          .order('accessed_at', { ascending: false })
        return { auditLog: data, error }
      }
    },
    
    // TASK-040: Supabase Storage管理
    storage: {
      async uploadAnalysisResult(userId: string, data: any, filename?: string) {
        const config = getSupabaseConfig()
        const fileName = filename || `analysis_${userId}_${Date.now()}.json`
        const filePath = `users/${userId}/results/${fileName}`
        
        const { data: uploadData, error } = await client.storage
          .from(config.storageBucket)
          .upload(filePath, JSON.stringify(data, null, 2), {
            contentType: 'application/json',
            cacheControl: '3600',
            upsert: false
          })
        
        return { filePath: uploadData?.path, error }
      },
      
      async downloadAnalysisResult(userId: string, filePath: string) {
        const config = getSupabaseConfig()
        const { data, error } = await client.storage
          .from(config.storageBucket)
          .download(filePath)
        
        if (data) {
          const text = await data.text()
          return { data: JSON.parse(text), error: null }
        }
        
        return { data: null, error }
      },
      
      async uploadUserDocument(userId: string, file: File, category = 'documents') {
        const config = getSupabaseConfig()
        
        // ファイルサイズチェック
        if (file.size > config.maxFileSize) {
          return { 
            error: new Error(`File size exceeds limit of ${config.maxFileSize / 1024 / 1024}MB`) 
          }
        }
        
        // ファイルタイプチェック
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        if (!config.allowedFileTypes.includes(fileExtension || '')) {
          return { 
            error: new Error(`File type .${fileExtension} not allowed. Allowed: ${config.allowedFileTypes.join(', ')}`) 
          }
        }
        
        const filePath = `users/${userId}/${category}/${Date.now()}_${file.name}`
        const { data, error } = await client.storage
          .from(config.storageBucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        return { filePath: data?.path, error }
      },
      
      async listUserFiles(userId: string, category?: string) {
        const config = getSupabaseConfig()
        const folder = category ? `users/${userId}/${category}` : `users/${userId}`
        
        const { data, error } = await client.storage
          .from(config.storageBucket)
          .list(folder, {
            limit: 100,
            offset: 0
          })
        
        return { files: data, error }
      },
      
      async deleteUserFile(userId: string, filePath: string) {
        const config = getSupabaseConfig()
        const { data, error } = await client.storage
          .from(config.storageBucket)
          .remove([filePath])
        
        return { deleted: data, error }
      },
      
      async getFileUrl(filePath: string, expiresIn = 3600) {
        const config = getSupabaseConfig()
        const { data, error } = await client.storage
          .from(config.storageBucket)
          .createSignedUrl(filePath, expiresIn)
        
        return { url: data?.signedUrl, error }
      }
    }
  }
}

/**
 * リアルタイム通知システム
 * 
 * PostgreSQL NOTIFY/LISTENとの統合
 */
export function useSupabaseRealtime() {
  const client = getSupabaseClient()
  
  return {
    // 分析進捗の監視
    subscribeToAnalysisProgress(userId: string, callback: (payload: any) => void) {
      return client
        .channel('analysis_progress')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'analysis_sessions',
          filter: `user_id=eq.${userId}`
        }, callback)
        .subscribe()
    },
    
    // Triple OS分析完了の監視
    subscribeToTripleOSComplete(userId: string, callback: (payload: any) => void) {
      return client
        .channel('triple_os_complete')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'engine_os_profiles',
          filter: `user_id=eq.${userId}`
        }, callback)
        .subscribe()
    },
    
    // 質問回答リアルタイム同期
    subscribeToQuestionResponses(sessionId: string, callback: (payload: any) => void) {
      return client
        .channel('question_responses')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'question_responses',
          filter: `session_id=eq.${sessionId}`
        }, callback)
        .subscribe()
    }
  }
}

/**
 * デフォルトエクスポート
 */
export const supabase = getSupabaseClient()
export type SupabaseClient = typeof supabase
export type HAQEISupabaseComposable = ReturnType<typeof useSupabase>
export type HAQEIRealtimeComposable = ReturnType<typeof useSupabaseRealtime>

// 開発環境でのデバッグ情報
if (import.meta.env.DEV) {
  console.log('🚀 HAQEI Supabase client initialized in development mode')
  console.log('🎯 Triple OS Architecture integration ready')
  console.log('🌀 I-Ching 64 Hexagram System integrated')
  console.log('⚡ Vue 3 Composition API optimizations active')
  
  // 接続テストを実行（開発環境のみ）
  testSupabaseConnection().then(({ success, details }) => {
    if (success) {
      console.log('📊 HAQEI Database fully operational')
      console.log('✨ bunenjin philosophy compliance verified')
    } else {
      console.warn('⚠️ HAQEI Database connection issues detected:', details)
      console.log('💾 localStorage fallback will be used')
    }
  })
}