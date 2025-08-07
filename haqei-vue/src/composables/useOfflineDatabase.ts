/**
 * HAQEI Offline Database Composable - TASK-041実装完了
 * 
 * 目的：
 * - Vue3 Composition APIでのオフラインデータベース統合
 * - リアクティブなオフライン状態管理
 * - Supabaseとの透明的な同期機能
 * - HaQei哲学：オフライン時の完全なプライバシー保護
 * 
 * 機能：
 * - オフライン優先（Offline First）の操作
 * - 自動同期とコンフリクト解決
 * - リアクティブな接続状態監視
 * - パフォーマンス最適化
 * - エラー回復機能
 * 
 * 更新: 2025-08-03 - TASK-041 Vue3 Composable統合完了
 */

import { ref, computed, onMounted, onUnmounted, watch, readonly } from 'vue'
import type { Ref } from 'vue'
import { 
  getOfflineDatabaseService, 
  type HAQEIOfflineDatabaseService,
  type OfflineOperation,
  type SyncConfig 
} from '@/services/offline-database'
import { getConnectionState } from '@/services/supabase'
import type {
  HAQEIUser,
  HAQEIAnalysisResult,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  HAQEIOperationResult
} from '@/types/supabase'

/**
 * オフライン状態の管理
 */
interface OfflineState {
  isOnline: boolean
  isSupabaseConnected: boolean
  syncInProgress: boolean
  lastSyncTime: number | null
  pendingOperations: number
  failedOperations: number
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unavailable'
}

/**
 * 同期統計情報
 */
interface SyncStatistics {
  totalSynced: number
  totalFailed: number
  totalConflicts: number
  lastSyncDuration: number
  averageSyncTime: number
  syncSuccess: boolean
}

/**
 * データベース統計情報
 */
interface DatabaseStatistics {
  totalRecords: number
  offlineOperations: number
  cacheSize: number
  storageUsed: number
  lastBackupTime: number | null
}

/**
 * HAQEI Offline Database Composable
 * 
 * Vue3コンポーネントでのオフラインデータベース使用に最適化
 */
export function useOfflineDatabase() {
  // サービスインスタンス
  const service = getOfflineDatabaseService()
  
  // リアクティブ状態
  const offlineState = ref<OfflineState>({
    isOnline: navigator.onLine,
    isSupabaseConnected: false,
    syncInProgress: false,
    lastSyncTime: null,
    pendingOperations: 0,
    failedOperations: 0,
    connectionQuality: 'unavailable'
  })
  
  const syncStats = ref<SyncStatistics>({
    totalSynced: 0,
    totalFailed: 0,
    totalConflicts: 0,
    lastSyncDuration: 0,
    averageSyncTime: 0,
    syncSuccess: false
  })
  
  const dbStats = ref<DatabaseStatistics>({
    totalRecords: 0,
    offlineOperations: 0,
    cacheSize: 0,
    storageUsed: 0,
    lastBackupTime: null
  })
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Computed状態
  const canSync = computed(() => 
    offlineState.value.isOnline && 
    offlineState.value.isSupabaseConnected && 
    !offlineState.value.syncInProgress
  )
  
  const hasOfflineData = computed(() => 
    offlineState.value.pendingOperations > 0
  )
  
  const syncHealthy = computed(() => 
    syncStats.value.syncSuccess && 
    offlineState.value.failedOperations < 10
  )
  
  const isOfflineMode = computed(() => 
    !offlineState.value.isOnline || 
    !offlineState.value.isSupabaseConnected
  )

  /**
   * 接続状態の更新
   */
  async function updateConnectionState(): Promise<void> {
    try {
      const connectionState = getConnectionState()
      
      offlineState.value.isOnline = navigator.onLine
      offlineState.value.isSupabaseConnected = connectionState.isSupabaseConnected
      offlineState.value.connectionQuality = connectionState.connectionQuality
      
      // 未同期操作数の取得
      const pendingOps = await service.database.offlineOperations
        .where('syncStatus')
        .equals('pending')
        .count()
        
      const failedOps = await service.database.offlineOperations
        .where('syncStatus')
        .equals('failed')
        .count()
      
      offlineState.value.pendingOperations = pendingOps
      offlineState.value.failedOperations = failedOps
      
    } catch (err) {
      console.error('❌ useOfflineDatabase: Failed to update connection state:', err)
    }
  }

  /**
   * データベース統計の更新
   */
  async function updateDatabaseStatistics(): Promise<void> {
    try {
      const stats = await service.database.getStatistics()
      
      dbStats.value.totalRecords = stats.totalRecords
      dbStats.value.offlineOperations = stats.offlineOperations
      dbStats.value.cacheSize = stats.cacheSize
      dbStats.value.lastBackupTime = stats.lastSyncTime
      
      // ストレージ使用量の推定
      dbStats.value.storageUsed = Math.round(
        (stats.totalRecords * 1024) + // 1KB per record estimate
        (stats.cacheSize * 2048)     // 2KB per cache item estimate
      )
      
    } catch (err) {
      console.error('❌ useOfflineDatabase: Failed to update database statistics:', err)
    }
  }

  /**
   * 手動同期の実行
   */
  async function syncNow(): Promise<HAQEIOperationResult<SyncStatistics>> {
    if (!canSync.value) {
      return {
        success: false,
        error: 'Cannot sync: offline or sync in progress'
      }
    }

    isLoading.value = true
    error.value = null
    offlineState.value.syncInProgress = true
    
    const startTime = performance.now()
    
    try {
      const result = await service.triggerSync()
      const duration = performance.now() - startTime
      
      if (result.success && result.data) {
        // 統計情報の更新
        syncStats.value.totalSynced += result.data.syncedOperations
        syncStats.value.totalFailed += result.data.failedOperations
        syncStats.value.totalConflicts += result.data.conflicts
        syncStats.value.lastSyncDuration = duration
        syncStats.value.syncSuccess = true
        
        // 平均同期時間の計算
        const history = [
          syncStats.value.averageSyncTime * 0.8, // 重み付き平均
          duration * 0.2
        ]
        syncStats.value.averageSyncTime = history.reduce((a, b) => a + b, 0)
        
        offlineState.value.lastSyncTime = Date.now()
        
        console.log('✅ useOfflineDatabase: Sync completed successfully')
      } else {
        syncStats.value.syncSuccess = false
        error.value = result.error || 'Sync failed'
      }
      
      return {
        success: result.success,
        data: syncStats.value,
        error: result.error
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed'
      error.value = errorMessage
      syncStats.value.syncSuccess = false
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
      offlineState.value.syncInProgress = false
      await updateConnectionState()
    }
  }

  /**
   * ユーザーデータの作成（オフライン対応）
   */
  async function createUser(userData: Partial<HAQEIUser>): Promise<HAQEIOperationResult<HAQEIUser>> {
    isLoading.value = true
    error.value = null
    
    try {
      // ローカルに即座に保存
      const newUser: HAQEIUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email || '',
        username: userData.username || '',
        privacy_level: userData.privacy_level || 'maximum',
        preferences: userData.preferences || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...userData
      }
      
      await service.database.users.add(newUser)
      
      // オフライン операция のキューイング
      await service.addOfflineOperation('create', 'users', newUser)
      
      console.log('✅ useOfflineDatabase: User created offline')
      
      return {
        success: true,
        data: newUser
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 分析結果の保存（オフライン対応）
   */
  async function saveAnalysisResult(
    sessionId: string,
    analysisData: any,
    tripleOSData: any
  ): Promise<HAQEIOperationResult<HAQEIAnalysisResult>> {
    isLoading.value = true
    error.value = null
    
    try {
      const newResult: HAQEIAnalysisResult = {
        id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        session_id: sessionId,
        user_id: '', // セッションから取得する必要がある
        analysis_data: analysisData,
        triple_os_data: tripleOSData,
        confidence_score: analysisData.confidence || 0.8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // セッション情報の取得
      const session = await service.database.analysisSessions.get(sessionId)
      if (session) {
        newResult.user_id = session.user_id
      }
      
      await service.database.analysisResults.add(newResult)
      
      // オフライン操作のキューイング
      await service.addOfflineOperation('create', 'analysis_results', newResult)
      
      console.log('✅ useOfflineDatabase: Analysis result saved offline')
      
      return {
        success: true,
        data: newResult
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save analysis result'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 質問回答の保存（オフライン対応）
   */
  async function saveQuestionResponse(
    sessionId: string,
    userId: string,
    questionId: string,
    responseValue: number,
    responseTime?: number
  ): Promise<HAQEIOperationResult<HAQEIQuestionResponse>> {
    isLoading.value = true
    error.value = null
    
    try {
      const newResponse: HAQEIQuestionResponse = {
        id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        session_id: sessionId,
        user_id: userId,
        question_id: questionId,
        response_value: responseValue,
        response_time_seconds: responseTime || 0,
        created_at: new Date().toISOString()
      }
      
      await service.database.questionResponses.add(newResponse)
      
      // オフライン操作のキューイング
      await service.addOfflineOperation('create', 'question_responses', newResponse)
      
      console.log('✅ useOfflineDatabase: Question response saved offline')
      
      return {
        success: true,
        data: newResponse
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save question response'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 分析セッションの開始（オフライン対応）
   */
  async function startAnalysisSession(
    userId: string,
    sessionType: string = 'initial'
  ): Promise<HAQEIOperationResult<HAQEIAnalysisSession>> {
    isLoading.value = true
    error.value = null
    
    try {
      const newSession: HAQEIAnalysisSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        session_type: sessionType,
        status: 'active',
        started_at: new Date().toISOString(),
        completed_at: null,
        metadata: {
          offline_created: true,
          device: navigator.userAgent,
          timestamp: Date.now()
        }
      }
      
      await service.database.analysisSessions.add(newSession)
      
      // オフライン操作のキューイング
      await service.addOfflineOperation('create', 'analysis_sessions', newSession)
      
      console.log('✅ useOfflineDatabase: Analysis session started offline')
      
      return {
        success: true,
        data: newSession
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start analysis session'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * データの取得（ローカル優先）
   */
  async function getAnalysisResults(
    userId: string, 
    limit: number = 20
  ): Promise<HAQEIOperationResult<HAQEIAnalysisResult[]>> {
    isLoading.value = true
    error.value = null
    
    try {
      const results = await service.database.analysisResults
        .where('user_id')
        .equals(userId)
        .orderBy('created_at')
        .reverse()
        .limit(limit)
        .toArray()
      
      return {
        success: true,
        data: results
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get analysis results'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 同期設定の更新
   */
  async function updateSyncSettings(config: Partial<SyncConfig>): Promise<HAQEIOperationResult<boolean>> {
    try {
      await service.updateSyncConfig(config)
      console.log('⚙️ useOfflineDatabase: Sync settings updated')
      
      return { success: true, data: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update sync settings'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * データベースバックアップの作成
   */
  async function createBackup(): Promise<HAQEIOperationResult<string>> {
    isLoading.value = true
    error.value = null
    
    try {
      const backup = await service.database.createBackup()
      
      // ブラウザダウンロードとして保存
      const dataBlob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(dataBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `haqei_backup_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      console.log('✅ useOfflineDatabase: Backup created successfully')
      
      return {
        success: true,
        data: 'Backup downloaded successfully'
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create backup'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * データベース整合性チェック
   */
  async function performHealthCheck(): Promise<HAQEIOperationResult<{
    isHealthy: boolean
    issues: string[]
    recommendations: string[]
  }>> {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await service.database.performIntegrityCheck()
      
      return {
        success: true,
        data: {
          isHealthy: result.isValid,
          issues: result.issues,
          recommendations: result.recommendations
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 失敗した操作の再試行
   */
  async function retryFailedOperations(): Promise<HAQEIOperationResult<number>> {
    isLoading.value = true
    error.value = null
    
    try {
      // 失敗した操作を取得
      const failedOps = await service.database.offlineOperations
        .where('syncStatus')
        .equals('failed')
        .toArray()
      
      // リトライ回数をリセット
      await Promise.all(
        failedOps.map(op => 
          service.database.offlineOperations.update(op.id, {
            syncStatus: 'pending',
            retryCount: 0,
            error: undefined
          })
        )
      )
      
      // 同期を実行
      const syncResult = await syncNow()
      
      return {
        success: syncResult.success,
        data: failedOps.length,
        error: syncResult.error
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retry operations'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  // ライフサイクル管理
  let statusUpdateTimer: NodeJS.Timeout | null = null
  
  onMounted(async () => {
    console.log('🚀 useOfflineDatabase: Composable mounted')
    
    // 初期データの読み込み
    await updateConnectionState()
    await updateDatabaseStatistics()
    
    // 定期的な状態更新
    statusUpdateTimer = setInterval(async () => {
      await updateConnectionState()
      await updateDatabaseStatistics()
    }, 30000) // 30秒間隔
    
    // ネットワーク状態の監視
    window.addEventListener('online', updateConnectionState)
    window.addEventListener('offline', updateConnectionState)
  })
  
  onUnmounted(() => {
    console.log('🗑️ useOfflineDatabase: Composable unmounted')
    
    if (statusUpdateTimer) {
      clearInterval(statusUpdateTimer)
    }
    
    window.removeEventListener('online', updateConnectionState)
    window.removeEventListener('offline', updateConnectionState)
  })

  return {
    // 状態
    offlineState: readonly(offlineState),
    syncStats: readonly(syncStats),
    dbStats: readonly(dbStats),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed状態
    canSync,
    hasOfflineData,
    syncHealthy,
    isOfflineMode,
    
    // データ操作
    createUser,
    saveAnalysisResult,
    saveQuestionResponse,
    startAnalysisSession,
    getAnalysisResults,
    
    // 同期機能
    syncNow,
    updateSyncSettings,
    retryFailedOperations,
    
    // 管理機能
    createBackup,
    performHealthCheck,
    updateConnectionState,
    updateDatabaseStatistics,
    
    // データベースアクセス
    database: service.database
  }
}

/**
 * オフライン状態専用のComposable
 * 
 * 軽量で特定の機能に特化
 */
export function useOfflineStatus() {
  const isOnline = ref(navigator.onLine)
  const connectionQuality = ref<'excellent' | 'good' | 'poor' | 'unavailable'>('unavailable')
  
  const isOffline = computed(() => !isOnline.value)
  
  function updateStatus() {
    isOnline.value = navigator.onLine
    const connectionState = getConnectionState()
    connectionQuality.value = connectionState.connectionQuality
  }
  
  onMounted(() => {
    updateStatus()
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
  })
  
  onUnmounted(() => {
    window.removeEventListener('online', updateStatus)
    window.removeEventListener('offline', updateStatus)
  })
  
  return {
    isOnline: readonly(isOnline),
    isOffline,
    connectionQuality: readonly(connectionQuality),
    updateStatus
  }
}

/**
 * 型エクスポート
 */
export type { 
  OfflineState, 
  SyncStatistics, 
  DatabaseStatistics 
}