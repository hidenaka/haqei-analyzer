import { ref, computed, watch } from 'vue'
import { useOfflineDatabase } from './useOfflineDatabase'
import { useNetworkMonitor } from './useNetworkMonitor'

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'conflict' | 'paused'

export interface SyncOperation {
  id: string
  type: 'upload' | 'download' | 'merge'
  tableName: string
  recordCount: number
  progress: number
  startTime: number
  endTime?: number
  error?: string
}

export interface SyncConflict {
  id: string
  tableName: string
  recordId: string
  localData: any
  remoteData: any
  conflictType: 'version' | 'delete' | 'update'
  timestamp: number
}

export interface SyncStats {
  lastSync: number | null
  totalOperations: number
  successfulOperations: number
  failedOperations: number
  totalDataSynced: number
  averageSyncTime: number
  conflicts: number
}

/**
 * データ同期状況管理のComposable
 * オンライン/オフライン間でのデータ同期状態を管理
 */
export function useSyncStatus() {
  // リアクティブデータ
  const syncStatus = ref<SyncStatus>('idle')  
  const currentOperations = ref<SyncOperation[]>([])
  const syncConflicts = ref<SyncConflict[]>([])
  const syncStats = ref<SyncStats>({
    lastSync: null,
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    totalDataSynced: 0,
    averageSyncTime: 0,
    conflicts: 0
  })

  // 依存関係
  const { isReady, syncData, getPendingChanges, getConflicts } = useOfflineDatabase()
  const { isOnline, connectionQuality } = useNetworkMonitor()

  // 自動同期設定
  const autoSyncEnabled = ref(true)
  const syncInterval = ref(60000) // 1分
  let syncTimer: NodeJS.Timeout | null = null

  // 計算されたプロパティ
  const isSyncing = computed(() => syncStatus.value === 'syncing')
  
  const hasPendingChanges = computed(() => {
    return currentOperations.value.some(op => op.progress < 100)
  })

  const hasConflicts = computed(() => syncConflicts.value.length > 0)

  const syncProgress = computed(() => {
    if (currentOperations.value.length === 0) return 0
    
    const totalProgress = currentOperations.value.reduce((sum, op) => sum + op.progress, 0)
    return Math.round(totalProgress / currentOperations.value.length)
  })

  const lastSyncText = computed(() => {
    if (!syncStats.value.lastSync) return '未同期'
    
    const now = Date.now()
    const diff = now - syncStats.value.lastSync
    
    if (diff < 60000) return '今'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`
    
    return `${Math.floor(diff / 86400000)}日前`
  })

  const syncStatusText = computed(() => {
    switch (syncStatus.value) {
      case 'idle':
        return hasConflicts.value ? '競合あり' : '同期完了'
      case 'syncing':
        return `同期中 (${syncProgress.value}%)`
      case 'success':
        return '同期成功'
      case 'error':
        return '同期エラー'
      case 'conflict':
        return '競合発生'
      case 'paused':
        return '同期停止'
      default:
        return '不明'
    }
  })

  const shouldAutoSync = computed(() => {
    return autoSyncEnabled.value && 
           isOnline.value && 
           isReady.value &&
           connectionQuality.value.level !== 'weak' &&
           syncStatus.value === 'idle'
  })

  // メソッド
  const startSync = async (force = false): Promise<boolean> => {
    if (isSyncing.value && !force) {
      console.warn('同期中のため開始できません')
      return false
    }

    if (!isOnline.value) {
      console.warn('オフラインのため同期できません')
      return false
    }

    if (!isReady.value) {
      console.warn('データベースが準備できていません')
      return false
    }

    try {
      syncStatus.value = 'syncing'
      const startTime = Date.now()

      // 既存の操作をクリア
      currentOperations.value = []

      // 保留中の変更を取得
      const pendingChanges = await getPendingChanges()
      
      if (pendingChanges.length === 0) {
        syncStatus.value = 'success'
        updateSyncStats(startTime, 0, true)
        return true
      }

      // 同期操作を作成
      const operations = createSyncOperations(pendingChanges)
      currentOperations.value = operations

      // データ同期を実行
      await syncData()

      // 競合をチェック
      const conflicts = await getConflicts()
      if (conflicts.length > 0) {
        syncConflicts.value = conflicts.map(conflict => ({
          id: generateId(),
          tableName: conflict.table,
          recordId: conflict.id,
          localData: conflict.local,
          remoteData: conflict.remote,
          conflictType: determineConflictType(conflict),
          timestamp: Date.now()
        }))
        
        syncStatus.value = 'conflict'
        syncStats.value.conflicts += conflicts.length
      } else {
        syncStatus.value = 'success'
      }

      // 操作を完了済みにマーク
      currentOperations.value.forEach(op => {
        op.progress = 100
        op.endTime = Date.now()
      })

      updateSyncStats(startTime, pendingChanges.length, true)
      return true

    } catch (error) {
      console.error('同期エラー:', error)
      syncStatus.value = 'error'
      
      // エラー情報を操作に記録
      currentOperations.value.forEach(op => {
        if (op.progress < 100) {
          op.error = error instanceof Error ? error.message : '不明なエラー'
        }
      })

      updateSyncStats(Date.now(), 0, false)
      return false
    }
  }

  const pauseSync = () => {
    if (isSyncing.value) {
      syncStatus.value = 'paused'
    }
  }

  const resumeSync = async () => {
    if (syncStatus.value === 'paused') {
      await startSync(true)
    }
  }

  const resolveConflict = async (conflictId: string, resolution: 'local' | 'remote' | 'merge') => {
    const conflictIndex = syncConflicts.value.findIndex(c => c.id === conflictId)
    if (conflictIndex === -1) return false

    const conflict = syncConflicts.value[conflictIndex]

    try {
      // 競合解決ロジック（実際の実装は使用するデータベースによる）
      let resolvedData
      switch (resolution) {
        case 'local':
          resolvedData = conflict.localData
          break
        case 'remote':
          resolvedData = conflict.remoteData
          break
        case 'merge':
          resolvedData = mergeData(conflict.localData, conflict.remoteData)
          break
      }

      // データベースに反映（具体的な実装が必要）
      console.log(`競合解決: ${conflictId}`, { resolution, resolvedData })

      // 競合リストから削除
      syncConflicts.value.splice(conflictIndex, 1)

      // 競合がすべて解決された場合
      if (syncConflicts.value.length === 0 && syncStatus.value === 'conflict') {
        syncStatus.value = 'success'
      }

      return true
    } catch (error) {
      console.error('競合解決エラー:', error)
      return false
    }
  }

  const clearSyncHistory = () => {
    currentOperations.value = []
    syncConflicts.value = []
    syncStats.value = {
      lastSync: null,
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      totalDataSynced: 0,
      averageSyncTime: 0,
      conflicts: 0
    }
  }

  const setAutoSync = (enabled: boolean) => {
    autoSyncEnabled.value = enabled
    
    if (enabled) {
      startAutoSyncTimer()
    } else {
      stopAutoSyncTimer()
    }
  }

  const setSyncInterval = (intervalMs: number) => {
    syncInterval.value = intervalMs
    
    if (autoSyncEnabled.value) {
      stopAutoSyncTimer()
      startAutoSyncTimer()
    }
  }

  // 内部メソッド
  const createSyncOperations = (pendingChanges: any[]): SyncOperation[] => {
    // テーブル別にグループ化
    const groupedChanges = pendingChanges.reduce((acc, change) => {
      const table = change.table || 'unknown'
      if (!acc[table]) acc[table] = []
      acc[table].push(change)
      return acc
    }, {} as Record<string, any[]>)

    // 操作オブジェクトを作成
    return Object.entries(groupedChanges).map(([tableName, changes]) => ({
      id: generateId(),
      type: 'upload' as const,
      tableName,
      recordCount: changes.length,
      progress: 0,
      startTime: Date.now()
    }))
  }

  const determineConflictType = (conflict: any): 'version' | 'delete' | 'update' => {
    if (conflict.local === null) return 'delete'
    if (conflict.remote === null) return 'delete'
    return 'update'
  }

  const mergeData = (localData: any, remoteData: any): any => {
    // 簡単なマージロジック（実際のアプリケーションでは適切な戦略が必要）
    return {
      ...localData,
      ...remoteData,
      // タイムスタンプが新しい方を優先
      updatedAt: Math.max(
        new Date(localData.updatedAt || 0).getTime(),
        new Date(remoteData.updatedAt || 0).getTime()
      )
    }
  }

  const updateSyncStats = (startTime: number, recordCount: number, success: boolean) => {
    const endTime = Date.now()
    const duration = endTime - startTime

    syncStats.value.lastSync = endTime
    syncStats.value.totalOperations++
    
    if (success) {
      syncStats.value.successfulOperations++
      syncStats.value.totalDataSynced += recordCount
    } else {
      syncStats.value.failedOperations++
    }

    // 平均同期時間を更新
    const totalDuration = syncStats.value.averageSyncTime * (syncStats.value.totalOperations - 1) + duration
    syncStats.value.averageSyncTime = Math.round(totalDuration / syncStats.value.totalOperations)
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const startAutoSyncTimer = () => {
    if (syncTimer) return

    syncTimer = setInterval(() => {
      if (shouldAutoSync.value) {
        startSync()
      }
    }, syncInterval.value)
  }

  const stopAutoSyncTimer = () => {
    if (syncTimer) {
      clearInterval(syncTimer)
      syncTimer = null
    }
  }

  // 監視
  watch(shouldAutoSync, (newValue) => {
    if (newValue) {
      startAutoSyncTimer()
    } else {
      stopAutoSyncTimer()
    }
  }, { immediate: true })

  // オンライン復旧時の自動同期
  watch(isOnline, (newValue, oldValue) => {
    if (newValue && !oldValue && shouldAutoSync.value) {
      // 少し遅延してから同期開始（接続安定化のため）
      setTimeout(() => {
        if (shouldAutoSync.value) {
          startSync()
        }
      }, 2000)
    }
  })

  return {
    // 状態
    syncStatus,
    currentOperations,
    syncConflicts,
    syncStats,
    autoSyncEnabled,
    syncInterval,
    
    // 計算されたプロパティ
    isSyncing,
    hasPendingChanges,
    hasConflicts,
    syncProgress,
    lastSyncText,
    syncStatusText,
    shouldAutoSync,
    
    // メソッド
    startSync,
    pauseSync,
    resumeSync,
    resolveConflict,
    clearSyncHistory,
    setAutoSync,
    setSyncInterval
  }
}