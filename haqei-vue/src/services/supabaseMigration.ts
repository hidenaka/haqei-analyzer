/**
 * HAQEI Supabase データマイグレーションサービス
 * 
 * 目的：
 * - ローカルストレージからSupabaseへの安全なデータ移行
 * - Triple OS Architecture完全対応
 * - HaQei哲学準拠のプライバシー保護
 * - Vue 3 + TypeScript最適化
 * - 段階的移行とロールバック機能
 * 
 * 機能：
 * - ローカルデータ検出・検証
 * - バックアップ作成と復元
 * - 段階的データ移行（User → Session → Responses → TripleOS）
 * - 移行進捗の詳細追跡
 * - エラーハンドリングとロールバック
 * 
 * 更新: 2025-08-03 - TASK-038実装 (データマイグレーションスクリプト)
 */

import { ref, reactive, computed } from 'vue'
import type { Ref } from 'vue'
import { useSupabase, getConnectionState } from '@/services/supabase'
import { useDatabase } from '@/composables/useDatabase'
import type { 
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  HAQEIEngineOS,
  HAQEIInterfaceOS,
  HAQEISafeModeOS,
  AnalysisData,
  TripleOSData,
  HAQEIOperationResult
} from '@/types/supabase'

// ローカルストレージキー（既存システムとの互換性）
const LEGACY_STORAGE_KEYS = {
  HAQEI_DATA: 'haqei_data',
  ANALYSIS_RESULTS: 'haqei_analysis_results',
  USER_PROFILE: 'haqei_user_profile',
  SESSIONS: 'haqei_sessions',
  RESPONSES: 'haqei_responses',
  TRIPLE_OS: 'haqei_triple_os',
  SETTINGS: 'haqei_settings'
} as const

// 移行ステップ定義
enum MigrationStep {
  DETECT = 'detect',
  BACKUP = 'backup',
  VALIDATE = 'validate',
  MIGRATE_USER = 'migrate_user',
  MIGRATE_SESSIONS = 'migrate_sessions',
  MIGRATE_RESPONSES = 'migrate_responses',
  MIGRATE_TRIPLE_OS = 'migrate_triple_os',
  VERIFY = 'verify',
  CLEANUP = 'cleanup',
  COMPLETE = 'complete'
}

// 移行ステータス型定義
interface MigrationStatus {
  currentStep: MigrationStep
  totalSteps: number
  completedSteps: number
  progress: number
  isRunning: boolean
  hasError: boolean
  errorMessage?: string
  startTime?: Date
  endTime?: Date
  estimatedTimeRemaining?: number
}

// ローカルデータ検出結果
interface LocalDataScan {
  hasLegacyData: boolean
  totalItems: number
  dataTypes: {
    users: number
    sessions: number
    responses: number
    tripleOS: number
    settings: number
  }
  estimatedSize: number // bytes
  lastModified?: Date
}

// 移行結果
interface MigrationResult {
  success: boolean
  migratedItems: {
    users: number
    sessions: number
    responses: number
    tripleOS: number
  }
  skippedItems: number
  errors: string[]
  backupPath?: string
  duration: number
}

/**
 * HAQEI Supabase データマイグレーション Composable
 * 
 * Vue 3 Composition APIでの使用に最適化されたデータ移行機能
 */
export function useSupabaseMigration() {
  const supabase = useSupabase()
  const database = useDatabase()
  
  // リアクティブ状態管理
  const migrationStatus = reactive<MigrationStatus>({
    currentStep: MigrationStep.DETECT,
    totalSteps: Object.keys(MigrationStep).length,
    completedSteps: 0,
    progress: 0,
    isRunning: false,
    hasError: false
  })
  
  const localDataScan = ref<LocalDataScan | null>(null)
  const migrationHistory = ref<MigrationResult[]>([])
  const backupData = ref<Record<string, any> | null>(null)
  
  // Computed状態
  const isOnline = computed(() => getConnectionState().isSupabaseConnected)
  const canMigrate = computed(() => isOnline.value && localDataScan.value?.hasLegacyData)
  const migrationProgress = computed(() => Math.round((migrationStatus.completedSteps / migrationStatus.totalSteps) * 100))
  
  /**
   * ローカルデータの検出と分析
   * 
   * 目的：
   * - 既存ローカルストレージデータの包括的スキャン
   * - データ整合性と移行可能性の評価
   * - 移行コストとリスクの評価
   * 
   * 処理内容：
   * 1. 全ローカルストレージキーの検索
   * 2. データ形式・整合性の検証
   * 3. 移行優先度の判定
   * 4. データサイズと移行時間の推定
   */
  async function scanLocalData(): Promise<LocalDataScan> {
    console.log('🔍 HAQEI Migration: Scanning local data...')
    
    const scan: LocalDataScan = {
      hasLegacyData: false,
      totalItems: 0,
      dataTypes: {
        users: 0,
        sessions: 0,
        responses: 0,
        tripleOS: 0,
        settings: 0
      },
      estimatedSize: 0
    }
    
    try {
      // 各ストレージキーをスキャン
      for (const [type, key] of Object.entries(LEGACY_STORAGE_KEYS)) {
        const data = localStorage.getItem(key)
        if (data) {
          try {
            const parsed = JSON.parse(data)
            const items = Array.isArray(parsed) ? parsed.length : (parsed ? 1 : 0)
            
            scan.totalItems += items
            scan.estimatedSize += data.length
            
            // データタイプ別カウント
            switch (type) {
              case 'USER_PROFILE':
                scan.dataTypes.users += items
                break
              case 'SESSIONS':
                scan.dataTypes.sessions += items
                break
              case 'RESPONSES':
                scan.dataTypes.responses += items
                break
              case 'TRIPLE_OS':
                scan.dataTypes.tripleOS += items
                break
              case 'SETTINGS':
                scan.dataTypes.settings += items
                break
            }
            
            scan.hasLegacyData = true
          } catch (e) {
            console.warn(`⚠️ Invalid JSON in ${key}:`, e)
          }
        }
      }
      
      // 最終更新日時を検出
      const allKeys = Object.values(LEGACY_STORAGE_KEYS)
      let latestModified = 0
      for (const key of allKeys) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const parsed = JSON.parse(data)
            if (parsed.updated_at || parsed.lastModified) {
              const timestamp = new Date(parsed.updated_at || parsed.lastModified).getTime()
              if (timestamp > latestModified) {
                latestModified = timestamp
              }
            }
          }
        } catch (e) {
          // Skip invalid data
        }
      }
      
      if (latestModified > 0) {
        scan.lastModified = new Date(latestModified)
      }
      
      localDataScan.value = scan
      
      console.log('📊 Local data scan complete:', scan)
      return scan
      
    } catch (error) {
      console.error('❌ Local data scan failed:', error)
      throw error
    }
  }
  
  /**
   * データバックアップの作成
   * 
   * 目的：
   * - 移行前の完全なデータバックアップ
   * - ロールバック機能のためのスナップショット
   * - データ損失防止の最後の砦
   */
  async function createBackup(): Promise<string> {
    console.log('💾 Creating migration backup...')
    
    const backup: Record<string, any> = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      metadata: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      },
      data: {}
    }
    
    // 全ローカルストレージデータをバックアップ
    for (const [type, key] of Object.entries(LEGACY_STORAGE_KEYS)) {
      const data = localStorage.getItem(key)
      if (data) {
        backup.data[key] = data
      }
    }
    
    // バックアップデータをローカル保存
    const backupKey = `haqei_migration_backup_${Date.now()}`
    const backupString = JSON.stringify(backup)
    
    try {
      localStorage.setItem(backupKey, backupString)
      backupData.value = backup
      
      console.log(`✅ Backup created: ${backupKey} (${Math.round(backupString.length / 1024)}KB)`)
      return backupKey
      
    } catch (error) {
      console.error('❌ Backup creation failed:', error)
      throw new Error('バックアップの作成に失敗しました')
    }
  }
  
  /**
   * バックアップからの復元
   * 
   * 目的：
   * - 移行失敗時の完全な状態復元
   * - データ整合性の確保
   * - ユーザー体験の継続性維持
   */
  async function restoreFromBackup(backupKey: string): Promise<boolean> {
    console.log(`🔄 Restoring from backup: ${backupKey}`)
    
    try {
      const backupString = localStorage.getItem(backupKey)
      if (!backupString) {
        throw new Error('バックアップが見つかりません')
      }
      
      const backup = JSON.parse(backupString)
      
      // バックアップデータを復元
      for (const [key, data] of Object.entries(backup.data)) {
        localStorage.setItem(key, data as string)
      }
      
      console.log('✅ Backup restored successfully')
      return true
      
    } catch (error) {
      console.error('❌ Backup restoration failed:', error)
      return false
    }
  }
  
  /**
   * ユーザーデータの移行
   * 
   * 目的：
   * - ローカルユーザープロフィールのSupabase移行
   * - HaQei哲学準拠のプライバシー設定移行
   * - 認証との統合準備
   */
  async function migrateUserData(): Promise<HAQEIOperationResult<HAQEIUser>> {
    console.log('👤 Migrating user data...')
    
    try {
      const userData = localStorage.getItem(LEGACY_STORAGE_KEYS.USER_PROFILE)
      if (!userData) {
        return { success: true, data: undefined as any } // No user data to migrate
      }
      
      const parsed = JSON.parse(userData)
      
      // 新しいユーザー作成
      const result = await database.userOperations.createOrGetUser({
        email: parsed.email,
        username: parsed.username || parsed.displayName,
        privacyLevel: parsed.privacyLevel || 'maximum'
      })
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      // プライバシー設定の移行
      if (parsed.privacySettings) {
        await database.userOperations.updatePrivacySettings(parsed.privacySettings)
      }
      
      console.log('✅ User data migrated successfully')
      return result
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ユーザーデータの移行に失敗しました'
      console.error('❌ User migration failed:', error)
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * セッションデータの移行
   * 
   * 目的：
   * - 分析セッション履歴の移行
   * - セッション完了状態の維持
   * - Vue 3との互換性確保
   */
  async function migrateSessionData(): Promise<HAQEIOperationResult<HAQEIAnalysisSession[]>> {
    console.log('📊 Migrating session data...')
    
    try {
      const sessionData = localStorage.getItem(LEGACY_STORAGE_KEYS.SESSIONS)
      if (!sessionData) {
        return { success: true, data: [] }
      }
      
      const sessions = JSON.parse(sessionData)
      const migratedSessions: HAQEIAnalysisSession[] = []
      
      for (const session of Array.isArray(sessions) ? sessions : [sessions]) {
        // セッションデータの正規化
        const normalizedSession = {
          user_id: database.currentUser.value?.id,
          session_type: session.type || 'legacy_migration',
          completion_status: session.completed ? 'completed' : 'abandoned',
          vue_session_data: {
            migratedFrom: 'localStorage',
            originalData: session,
            migratedAt: new Date().toISOString()
          },
          started_at: session.startTime || session.created_at || new Date().toISOString(),
          completed_at: session.endTime || session.completed_at,
          duration_minutes: session.duration || null,
          questions_answered: session.questionsAnswered || 0
        }
        
        // Supabaseに挿入
        const { data, error } = await supabase.client
          .from('analysis_sessions')
          .insert(normalizedSession)
          .select()
          .single()
        
        if (error) {
          console.warn('⚠️ Session migration warning:', error)
          continue
        }
        
        migratedSessions.push(data)
      }
      
      console.log(`✅ Migrated ${migratedSessions.length} sessions`)
      return { success: true, data: migratedSessions }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'セッションデータの移行に失敗しました'
      console.error('❌ Session migration failed:', error)
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * 質問応答データの移行
   * 
   * 目的：
   * - 詳細な質問応答履歴の移行
   * - Triple OS重み付けの再計算
   * - データ整合性の確保
   */
  async function migrateResponseData(): Promise<HAQEIOperationResult<HAQEIQuestionResponse[]>> {
    console.log('❓ Migrating response data...')
    
    try {
      const responseData = localStorage.getItem(LEGACY_STORAGE_KEYS.RESPONSES)
      if (!responseData) {
        return { success: true, data: [] }
      }
      
      const responses = JSON.parse(responseData)
      const migratedResponses: HAQEIQuestionResponse[] = []
      
      for (const response of Array.isArray(responses) ? responses : [responses]) {
        const normalizedResponse = {
          session_id: database.currentSession.value?.id || 'legacy-session',
          user_id: database.currentUser.value?.id || 'legacy-user',
          question_id: response.questionId || response.id,
          question_text: response.question || response.text,
          question_category: response.category || 'legacy',
          response_value: response.answer || response.value,
          response_time_seconds: response.responseTime || null,
          answered_at: response.timestamp || new Date().toISOString()
        }
        
        const { data, error } = await supabase.client
          .from('question_responses')
          .insert(normalizedResponse)
          .select()
          .single()
        
        if (error) {
          console.warn('⚠️ Response migration warning:', error)
          continue
        }
        
        migratedResponses.push(data)
      }
      
      console.log(`✅ Migrated ${migratedResponses.length} responses`)
      return { success: true, data: migratedResponses }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '応答データの移行に失敗しました'
      console.error('❌ Response migration failed:', error)
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * Triple OSプロフィールの移行
   * 
   * 目的：
   * - Engine・Interface・SafeMode OSデータの移行
   * - 易経64卦マッピングの保持
   * - 分析結果の継続性確保
   */
  async function migrateTripleOSData(): Promise<HAQEIOperationResult<boolean>> {
    console.log('🎯 Migrating Triple OS data...')
    
    try {
      const tripleOSData = localStorage.getItem(LEGACY_STORAGE_KEYS.TRIPLE_OS)
      if (!tripleOSData) {
        return { success: true, data: true }
      }
      
      const parsed = JSON.parse(tripleOSData)
      let migrationCount = 0
      
      // Engine OS移行
      if (parsed.engineOS) {
        const result = await database.tripleOSOperations.saveEngineOSProfile({
          intrinsic_motivation: parsed.engineOS.motivation || {},
          core_values: parsed.engineOS.values || {},
          life_philosophy: parsed.engineOS.philosophy,
          primary_hexagram_id: parsed.engineOS.hexagramId,
          authenticity_score: parsed.engineOS.score
        })
        if (result.success) migrationCount++
      }
      
      // Interface OS移行
      if (parsed.interfaceOS) {
        const result = await database.tripleOSOperations.saveInterfaceOSProfile({
          social_adaptation_patterns: parsed.interfaceOS.adaptation || {},
          communication_styles: parsed.interfaceOS.communication || {},
          primary_hexagram_id: parsed.interfaceOS.hexagramId,
          social_intelligence_score: parsed.interfaceOS.score
        })
        if (result.success) migrationCount++
      }
      
      // Safe Mode OS移行
      if (parsed.safeModeOS) {
        const result = await database.tripleOSOperations.saveSafeModeOSProfile({
          defense_mechanisms: parsed.safeModeOS.defenses || {},
          risk_assessment_patterns: parsed.safeModeOS.riskPatterns || {},
          primary_hexagram_id: parsed.safeModeOS.hexagramId,
          resilience_level: parsed.safeModeOS.score
        })
        if (result.success) migrationCount++
      }
      
      console.log(`✅ Migrated ${migrationCount} Triple OS profiles`)
      return { success: true, data: true }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Triple OSデータの移行に失敗しました'
      console.error('❌ Triple OS migration failed:', error)
      return { success: false, error: errorMessage }
    }
  }
  
  /**
   * 包括的データ移行の実行
   * 
   * 目的：
   * - 全データの段階的移行
   * - 進捗の詳細追跡
   * - エラーハンドリングとロールバック
   * 
   * 処理フロー：
   * 1. ローカルデータ検出
   * 2. バックアップ作成
   * 3. データ検証
   * 4. 段階的移行実行
   * 5. 検証とクリーンアップ
   */
  async function runCompleteMigration(): Promise<MigrationResult> {
    console.log('🚀 Starting complete HAQEI data migration...')
    
    const startTime = Date.now()
    const result: MigrationResult = {
      success: false,
      migratedItems: {
        users: 0,
        sessions: 0,
        responses: 0,
        tripleOS: 0
      },
      skippedItems: 0,
      errors: [],
      duration: 0
    }
    
    // 移行状態初期化
    migrationStatus.currentStep = MigrationStep.DETECT
    migrationStatus.isRunning = true
    migrationStatus.hasError = false
    migrationStatus.completedSteps = 0
    migrationStatus.startTime = new Date()
    
    let backupKey: string | null = null
    
    try {
      // ステップ1: データ検出
      updateMigrationProgress(MigrationStep.DETECT)
      await scanLocalData()
      
      if (!localDataScan.value?.hasLegacyData) {
        console.log('ℹ️ No legacy data found, migration skipped')
        result.success = true
        return result
      }
      
      // ステップ2: バックアップ作成
      updateMigrationProgress(MigrationStep.BACKUP)
      backupKey = await createBackup()
      result.backupPath = backupKey
      
      // ステップ3: データ検証
      updateMigrationProgress(MigrationStep.VALIDATE)
      if (!isOnline.value) {
        throw new Error('Supabase接続が必要です')
      }
      
      // ステップ4: ユーザー移行
      updateMigrationProgress(MigrationStep.MIGRATE_USER)
      const userResult = await migrateUserData()
      if (userResult.success && userResult.data) {
        result.migratedItems.users = 1
      } else if (!userResult.success) {
        result.errors.push(userResult.error || 'User migration failed')
      }
      
      // ステップ5: セッション移行
      updateMigrationProgress(MigrationStep.MIGRATE_SESSIONS)
      const sessionResult = await migrateSessionData()
      if (sessionResult.success) {
        result.migratedItems.sessions = sessionResult.data?.length || 0
      } else {
        result.errors.push(sessionResult.error || 'Session migration failed')
      }
      
      // ステップ6: 応答移行
      updateMigrationProgress(MigrationStep.MIGRATE_RESPONSES)
      const responseResult = await migrateResponseData()
      if (responseResult.success) {
        result.migratedItems.responses = responseResult.data?.length || 0
      } else {
        result.errors.push(responseResult.error || 'Response migration failed')
      }
      
      // ステップ7: Triple OS移行
      updateMigrationProgress(MigrationStep.MIGRATE_TRIPLE_OS)
      const tripleOSResult = await migrateTripleOSData()
      if (tripleOSResult.success) {
        result.migratedItems.tripleOS = 1
      } else {
        result.errors.push(tripleOSResult.error || 'Triple OS migration failed')
      }
      
      // ステップ8: 検証
      updateMigrationProgress(MigrationStep.VERIFY)
      // TODO: データ整合性検証の実装
      
      // ステップ9: クリーンアップ
      updateMigrationProgress(MigrationStep.CLEANUP)
      // 移行成功時のみローカルデータを削除
      if (result.errors.length === 0) {
        // await cleanupLocalData() // 実際の削除は手動確認後
      }
      
      // ステップ10: 完了
      updateMigrationProgress(MigrationStep.COMPLETE)
      result.success = result.errors.length === 0
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Migration failed'
      result.errors.push(errorMessage)
      migrationStatus.hasError = true
      migrationStatus.errorMessage = errorMessage
      
      // エラー時はバックアップから復元
      if (backupKey) {
        console.log('🔄 Attempting rollback...')
        await restoreFromBackup(backupKey)
      }
      
    } finally {
      result.duration = Date.now() - startTime
      migrationStatus.isRunning = false
      migrationStatus.endTime = new Date()
      
      // 移行履歴に追加
      migrationHistory.value.push(result)
      
      console.log('📊 Migration complete:', result)
    }
    
    return result
  }
  
  /**
   * 移行進捗の更新
   */
  function updateMigrationProgress(step: MigrationStep) {
    migrationStatus.currentStep = step
    migrationStatus.completedSteps++
    migrationStatus.progress = migrationProgress.value
    
    // 残り時間推定
    if (migrationStatus.startTime) {
      const elapsed = Date.now() - migrationStatus.startTime.getTime()
      const avgTimePerStep = elapsed / migrationStatus.completedSteps
      const remainingSteps = migrationStatus.totalSteps - migrationStatus.completedSteps
      migrationStatus.estimatedTimeRemaining = Math.round(avgTimePerStep * remainingSteps / 1000)
    }
    
    console.log(`🔄 Migration step: ${step} (${migrationStatus.progress}%)`)
  }
  
  /**
   * ローカルデータのクリーンアップ
   */
  async function cleanupLocalData(): Promise<void> {
    console.log('🧹 Cleaning up local data...')
    
    for (const key of Object.values(LEGACY_STORAGE_KEYS)) {
      localStorage.removeItem(key)
    }
    
    console.log('✅ Local data cleanup complete')
  }
  
  return {
    // 状態
    migrationStatus,
    localDataScan,
    migrationHistory,
    isOnline,
    canMigrate,
    migrationProgress,
    
    // 操作
    scanLocalData,
    createBackup,
    restoreFromBackup,
    runCompleteMigration,
    cleanupLocalData,
    
    // 個別移行（高度な使用方法）
    migrateUserData,
    migrateSessionData,
    migrateResponseData,
    migrateTripleOSData
  }
}

/**
 * 型エクスポート
 */
export type HAQEIMigrationComposable = ReturnType<typeof useSupabaseMigration>
export { MigrationStep, type MigrationStatus, type LocalDataScan, type MigrationResult }