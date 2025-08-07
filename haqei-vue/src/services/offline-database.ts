/**
 * HAQEI Offline Database Service - TASK-041実装
 * 
 * 目的：
 * - IndexedDBによるオフライン対応
 * - Supabaseとの双方向同期機能
 * - HaQei哲学：オフライン時の最大プライバシー保護
 * - Vue3リアクティブシステム完全統合
 * 
 * 機能：
 * - Dexie.jsベースの型安全なIndexedDB操作
 * - オフライン優先（Offline First）アーキテクチャ
 * - 自動同期とコンフリクト解決
 * - データ整合性保証機能
 * - パフォーマンス最適化
 * 
 * 更新: 2025-08-03 - TASK-041 IndexedDBオフライン統合基盤実装
 */

import Dexie, { type Table } from 'dexie'
import { getSupabaseClient, useSupabase, getConnectionState } from '@/services/supabase'
import type {
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  HAQEIAnalysisResult,
  HAQEIOperationResult,
  AnalysisData,
  TripleOSData
} from '@/types/supabase'

/**
 * オフライン操作のキューアイテム
 */
interface OfflineOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  data?: any
  recordId?: string
  timestamp: number
  retryCount: number
  error?: string
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed'
}

/**
 * 同期設定
 */
interface SyncConfig {
  enabled: boolean
  autoSync: boolean
  syncInterval: number // milliseconds
  maxRetries: number
  conflictResolution: 'local' | 'remote' | 'manual'
  batchSize: number
}

/**
 * データバージョン管理
 */
interface DataVersion {
  id: string
  table: string
  recordId: string
  version: number
  checksum: string
  lastModified: number
  syncedAt?: number
}

/**
 * HAQEI Offline Database Class
 * 
 * Dexie.jsを使用した型安全なIndexedDB管理
 */
class HAQEIOfflineDatabase extends Dexie {
  // Core Tables
  users!: Table<HAQEIUser>
  analysisResults!: Table<HAQEIAnalysisResult>
  analysisSessions!: Table<HAQEIAnalysisSession>
  questionResponses!: Table<HAQEIQuestionResponse>
  
  // I-Ching System Tables
  hexagrams!: Table<any>
  trigrams!: Table<any>
  yaoLines!: Table<any>
  
  // Triple OS Architecture Tables
  engineOSProfiles!: Table<any>
  interfaceOSProfiles!: Table<any>
  safeModeOSProfiles!: Table<any>
  osInteractions!: Table<any>
  
  // Offline Management Tables
  offlineOperations!: Table<OfflineOperation>
  dataVersions!: Table<DataVersion>
  syncConfig!: Table<SyncConfig>
  cacheData!: Table<any>

  constructor() {
    super('HAQEIOfflineDB')

    // Schema Version 1 - 初期設計
    this.version(1).stores({
      // Core Tables
      users: '++id, email, username, privacy_level, created_at, updated_at',
      analysisResults: '++id, session_id, user_id, analysis_data, triple_os_data, created_at, updated_at',
      analysisSessions: '++id, user_id, session_type, status, started_at, completed_at',
      questionResponses: '++id, session_id, user_id, question_id, response_value, response_time_seconds, created_at',
      
      // I-Ching System
      hexagrams: '++id, number, name, description, upper_trigram, lower_trigram',
      trigrams: '++id, name, symbol, meaning, element',
      yaoLines: '++id, hexagram_id, position, type, meaning',
      
      // Triple OS Architecture
      engineOSProfiles: '++id, user_id, rational_thinking, analytical_processing, created_at',
      interfaceOSProfiles: '++id, user_id, social_skills, communication_style, created_at',
      safeModeOSProfiles: '++id, user_id, emotional_stability, stress_management, created_at',
      osInteractions: '++id, user_id, interaction_type, interaction_data, created_at',
      
      // Offline Management
      offlineOperations: '++id, type, table, timestamp, syncStatus, retryCount',
      dataVersions: '++id, table, recordId, version, lastModified, syncedAt',
      syncConfig: '++id, enabled, autoSync, syncInterval',
      cacheData: '++id, key, data, expires_at'
    })

    // Schema Version 2 - 拡張機能
    this.version(2).stores({
      // 既存テーブルに新しいインデックス追加
      users: '++id, email, username, privacy_level, created_at, updated_at, [email+privacy_level]',
      analysisResults: '++id, session_id, user_id, analysis_data, triple_os_data, created_at, updated_at, [user_id+created_at]',
      
      // 新しいテーブル追加
      userPreferences: '++id, user_id, key, value, created_at, updated_at',
      performanceMetrics: '++id, operation, duration, success, timestamp, table_name'
    }).upgrade(tx => {
      // データマイグレーション処理
      console.log('🔄 HAQEIOfflineDB: Upgrading to version 2')
      return tx.syncConfig.toCollection().modify(config => {
        if (!config.conflictResolution) {
          config.conflictResolution = 'local'
        }
        if (!config.batchSize) {
          config.batchSize = 50
        }
      })
    })

    // デフォルト設定の初期化
    this.on('ready', async () => {
      console.log('🗄️ HAQEIOfflineDB: Database initialized')
      await this.initializeDefaultConfig()
    })

    // エラーハンドリング
    this.on('error', (error) => {
      console.error('❌ HAQEIOfflineDB Error:', error)
    })
  }

  /**
   * デフォルト同期設定の初期化
   */
  private async initializeDefaultConfig(): Promise<void> {
    try {
      const existingConfig = await this.syncConfig.toArray()
      
      if (existingConfig.length === 0) {
        await this.syncConfig.add({
          id: 'default',
          enabled: true,
          autoSync: true,
          syncInterval: 60000, // 1分間隔
          maxRetries: 3,
          conflictResolution: 'local',
          batchSize: 50
        } as SyncConfig)
        
        console.log('✅ HAQEIOfflineDB: Default sync configuration initialized')
      }
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Failed to initialize default config:', error)
    }
  }

  /**
   * データベース統計情報の取得
   */
  async getStatistics(): Promise<{
    totalRecords: number
    offlineOperations: number
    cacheSize: number
    lastSyncTime: number | null
    tables: Record<string, number>
  }> {
    try {
      const [
        usersCount,
        analysisResultsCount,
        analysisSessionsCount,
        questionResponsesCount,
        offlineOpsCount,
        cacheCount
      ] = await Promise.all([
        this.users.count(),
        this.analysisResults.count(),
        this.analysisSessions.count(),
        this.questionResponses.count(),
        this.offlineOperations.count(),
        this.cacheData.count()
      ])

      const lastSync = await this.dataVersions
        .orderBy('syncedAt')
        .reverse()
        .first()

      return {
        totalRecords: usersCount + analysisResultsCount + analysisSessionsCount + questionResponsesCount,
        offlineOperations: offlineOpsCount,
        cacheSize: cacheCount,
        lastSyncTime: lastSync?.syncedAt || null,
        tables: {
          users: usersCount,
          analysisResults: analysisResultsCount,
          analysisSessions: analysisSessionsCount,
          questionResponses: questionResponsesCount
        }
      }
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Failed to get statistics:', error)
      throw error
    }
  }

  /**
   * データベースの完全クリア（デバッグ用）
   */
  async clearAllData(): Promise<void> {
    try {
      await this.transaction('rw', this.tables, async () => {
        await Promise.all(this.tables.map(table => table.clear()))
      })
      
      console.log('🗑️ HAQEIOfflineDB: All data cleared')
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Failed to clear data:', error)
      throw error
    }
  }

  /**
   * データベース整合性チェック
   */
  async performIntegrityCheck(): Promise<{
    isValid: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const issues: string[] = []
    const recommendations: string[] = []

    try {
      // 孤立したレコードのチェック
      const analysisResults = await this.analysisResults.toArray()
      for (const result of analysisResults) {
        const session = await this.analysisSessions.get(result.session_id)
        if (!session) {
          issues.push(`Analysis result ${result.id} has no corresponding session`)
          recommendations.push('Run data cleanup to remove orphaned analysis results')
        }
      }

      // 重複データのチェック
      const users = await this.users.toArray()
      const emailCounts = new Map<string, number>()
      users.forEach(user => {
        const count = emailCounts.get(user.email) || 0
        emailCounts.set(user.email, count + 1)
      })

      emailCounts.forEach((count, email) => {
        if (count > 1) {
          issues.push(`Duplicate email found: ${email} (${count} entries)`)
          recommendations.push('Merge or remove duplicate user entries')
        }
      })

      // 未同期操作の確認
      const pendingOps = await this.offlineOperations
        .where('syncStatus')
        .equals('pending')
        .count()

      if (pendingOps > 100) {
        issues.push(`High number of pending sync operations: ${pendingOps}`)
        recommendations.push('Force sync or clear failed operations')
      }

      return {
        isValid: issues.length === 0,
        issues,
        recommendations
      }
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Integrity check failed:', error)
      return {
        isValid: false,
        issues: ['Integrity check failed due to database error'],
        recommendations: ['Restart application or rebuild database']
      }
    }
  }

  /**
   * バックアップデータの作成
   */
  async createBackup(): Promise<{
    data: any
    metadata: {
      version: number
      timestamp: number
      recordCount: number
      checksum: string
    }
  }> {
    try {
      const allData: any = {}
      
      // 全テーブルのデータを取得
      for (const table of this.tables) {
        allData[table.name] = await table.toArray()
      }

      const dataString = JSON.stringify(allData)
      const recordCount = Object.values(allData).reduce((sum: number, records: any) => 
        sum + (Array.isArray(records) ? records.length : 0), 0)
      
      // 簡単なチェックサム計算
      const checksum = this.calculateChecksum(dataString)

      return {
        data: allData,
        metadata: {
          version: this.verno,
          timestamp: Date.now(),
          recordCount,
          checksum
        }
      }
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Backup creation failed:', error)
      throw error
    }
  }

  /**
   * バックアップからの復元
   */
  async restoreFromBackup(backup: {
    data: any
    metadata: any
  }): Promise<void> {
    try {
      // データ整合性の検証
      const dataString = JSON.stringify(backup.data)
      const calculatedChecksum = this.calculateChecksum(dataString)
      
      if (calculatedChecksum !== backup.metadata.checksum) {
        throw new Error('Backup data integrity check failed')
      }

      // 既存データをクリア
      await this.clearAllData()

      // バックアップデータを復元
      await this.transaction('rw', this.tables, async () => {
        for (const [tableName, records] of Object.entries(backup.data)) {
          const table = (this as any)[tableName]
          if (table && Array.isArray(records)) {
            await table.bulkAdd(records)
          }
        }
      })

      console.log('✅ HAQEIOfflineDB: Data restored from backup')
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Restore from backup failed:', error)
      throw error
    }
  }

  /**
   * 簡単なチェックサム計算
   */
  private calculateChecksum(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 32bit整数に変換
    }
    return hash.toString(16)
  }
}

/**
 * HAQEI Offline Database Service
 * 
 * オフライン操作とSupabase同期の統合管理
 */
export class HAQEIOfflineDatabaseService {
  private db: HAQEIOfflineDatabase
  private supabase: ReturnType<typeof useSupabase>
  private syncTimer: NodeJS.Timeout | null = null
  private isOnline: boolean = navigator.onLine
  private syncInProgress: boolean = false

  constructor() {
    this.db = new HAQEIOfflineDatabase()
    this.supabase = useSupabase()
    
    // オンライン状態の監視
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))
    
    // 定期同期の開始
    this.startAutoSync()
    
    console.log('🚀 HAQEIOfflineDatabaseService: Service initialized')
  }

  /**
   * オンライン状態になった時の処理
   */
  private handleOnline(): void {
    console.log('🌐 HAQEIOfflineDB: Online mode activated')
    this.isOnline = true
    this.triggerSync()
  }

  /**
   * オフライン状態になった時の処理
   */
  private handleOffline(): void {
    console.log('📴 HAQEIOfflineDB: Offline mode activated')
    this.isOnline = false
    this.stopAutoSync()
  }

  /**
   * 自動同期の開始
   */
  private async startAutoSync(): Promise<void> {
    try {
      const config = await this.db.syncConfig.get('default')
      
      if (!config || !config.autoSync) {
        return
      }

      if (this.syncTimer) {
        clearInterval(this.syncTimer)
      }

      this.syncTimer = setInterval(() => {
        if (this.isOnline && !this.syncInProgress) {
          this.triggerSync()
        }
      }, config.syncInterval)

      console.log(`⏰ HAQEIOfflineDB: Auto-sync started (${config.syncInterval}ms interval)`)
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Failed to start auto-sync:', error)
    }
  }

  /**
   * 自動同期の停止
   */
  private stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
      console.log('⏹️ HAQEIOfflineDB: Auto-sync stopped')
    }
  }

  /**
   * 手動同期のトリガー
   */
  async triggerSync(): Promise<HAQEIOperationResult<{
    syncedOperations: number
    failedOperations: number
    conflicts: number
  }>> {
    if (this.syncInProgress) {
      return {
        success: false,
        error: 'Sync already in progress'
      }
    }

    if (!this.isOnline) {
      return {
        success: false,
        error: 'Cannot sync while offline'
      }
    }

    this.syncInProgress = true
    console.log('🔄 HAQEIOfflineDB: Starting sync process')

    try {
      const config = await this.db.syncConfig.get('default')
      if (!config || !config.enabled) {
        return {
          success: false,
          error: 'Sync is disabled'
        }
      }

      // 未同期操作の取得
      const pendingOperations = await this.db.offlineOperations
        .where('syncStatus')
        .equals('pending')
        .limit(config.batchSize)
        .toArray()

      let syncedCount = 0
      let failedCount = 0
      let conflictCount = 0

      // バッチ処理で同期
      for (const operation of pendingOperations) {
        try {
          const result = await this.syncOperation(operation, config)
          
          if (result.success) {
            syncedCount++
            await this.db.offlineOperations.update(operation.id, {
              syncStatus: 'synced',
              error: undefined
            })
          } else if (result.error?.includes('conflict')) {
            conflictCount++
            await this.db.offlineOperations.update(operation.id, {
              syncStatus: 'failed',
              error: result.error,
              retryCount: operation.retryCount + 1
            })
          } else {
            failedCount++
            await this.db.offlineOperations.update(operation.id, {
              syncStatus: 'failed',
              error: result.error,
              retryCount: operation.retryCount + 1
            })
          }
        } catch (error) {
          failedCount++
          await this.db.offlineOperations.update(operation.id, {
            syncStatus: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            retryCount: operation.retryCount + 1
          })
        }
      }

      console.log(`✅ HAQEIOfflineDB: Sync completed - ${syncedCount} synced, ${failedCount} failed, ${conflictCount} conflicts`)

      return {
        success: true,
        data: {
          syncedOperations: syncedCount,
          failedOperations: failedCount,
          conflicts: conflictCount
        }
      }
    } catch (error) {
      console.error('❌ HAQEIOfflineDB: Sync process failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * 単一操作の同期
   */
  private async syncOperation(
    operation: OfflineOperation,
    config: SyncConfig
  ): Promise<HAQEIOperationResult<boolean>> {
    try {
      switch (operation.type) {
        case 'create':
          return await this.syncCreateOperation(operation)
        case 'update':
          return await this.syncUpdateOperation(operation, config)
        case 'delete':
          return await this.syncDeleteOperation(operation)
        default:
          return {
            success: false,
            error: `Unknown operation type: ${operation.type}`
          }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Operation sync failed'
      }
    }
  }

  /**
   * Create操作の同期
   */
  private async syncCreateOperation(operation: OfflineOperation): Promise<HAQEIOperationResult<boolean>> {
    try {
      let result: any

      switch (operation.table) {
        case 'users':
          result = await this.supabase.client
            .from('users')
            .insert(operation.data)
            .select()
            .single()
          break

        case 'analysis_results':
          result = await this.supabase.client
            .from('analysis_results')
            .insert(operation.data)
            .select()
            .single()
          break

        case 'analysis_sessions':
          result = await this.supabase.client
            .from('analysis_sessions')
            .insert(operation.data)
            .select()
            .single()
          break

        case 'question_responses':
          result = await this.supabase.client
            .from('question_responses')
            .insert(operation.data)
            .select()
            .single()
          break

        default:
          return {
            success: false,
            error: `Unsupported table for create: ${operation.table}`
          }
      }

      if (result.error) {
        return {
          success: false,
          error: result.error.message
        }
      }

      // ローカルデータをサーバーデータで更新
      if (result.data) {
        const table = (this.db as any)[this.getTableName(operation.table)]
        if (table) {
          await table.put(result.data)
        }
      }

      return { success: true, data: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Create sync failed'
      }
    }
  }

  /**
   * Update操作の同期（コンフリクト解決含む）
   */
  private async syncUpdateOperation(
    operation: OfflineOperation,
    config: SyncConfig
  ): Promise<HAQEIOperationResult<boolean>> {
    try {
      // リモートデータの取得
      const remoteData = await this.supabase.client
        .from(operation.table)
        .select('*')
        .eq('id', operation.recordId)
        .single()

      if (remoteData.error) {
        return {
          success: false,
          error: remoteData.error.message
        }
      }

      // ローカルデータの取得
      const table = (this.db as any)[this.getTableName(operation.table)]
      const localData = await table.get(operation.recordId)

      // コンフリクトチェック
      if (this.hasConflict(localData, remoteData.data, operation.timestamp)) {
        return await this.resolveConflict(
          operation,
          localData,
          remoteData.data,
          config.conflictResolution
        )
      }

      // 通常の更新
      const updateResult = await this.supabase.client
        .from(operation.table)
        .update(operation.data)
        .eq('id', operation.recordId)
        .select()
        .single()

      if (updateResult.error) {
        return {
          success: false,
          error: updateResult.error.message
        }
      }

      // ローカルデータの更新
      if (updateResult.data && table) {
        await table.put(updateResult.data)
      }

      return { success: true, data: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update sync failed'
      }
    }
  }

  /**
   * Delete操作の同期
   */
  private async syncDeleteOperation(operation: OfflineOperation): Promise<HAQEIOperationResult<boolean>> {
    try {
      const result = await this.supabase.client
        .from(operation.table)
        .delete()
        .eq('id', operation.recordId)

      if (result.error) {
        return {
          success: false,
          error: result.error.message
        }
      }

      return { success: true, data: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete sync failed'
      }
    }
  }

  /**
   * コンフリクトの検出
   */
  private hasConflict(localData: any, remoteData: any, operationTimestamp: number): boolean {
    if (!localData || !remoteData) {
      return false
    }

    // リモートデータの更新時刻がローカル操作時刻より新しい場合はコンフリクト
    const remoteTimestamp = new Date(remoteData.updated_at).getTime()
    return remoteTimestamp > operationTimestamp
  }

  /**
   * コンフリクトの解決
   */
  private async resolveConflict(
    operation: OfflineOperation,
    localData: any,
    remoteData: any,
    strategy: 'local' | 'remote' | 'manual'
  ): Promise<HAQEIOperationResult<boolean>> {
    switch (strategy) {
      case 'local':
        // ローカルデータを優先
        const localResult = await this.supabase.client
          .from(operation.table)
          .update(operation.data)
          .eq('id', operation.recordId)

        return {
          success: !localResult.error,
          error: localResult.error?.message
        }

      case 'remote':
        // リモートデータを優先
        const table = (this.db as any)[this.getTableName(operation.table)]
        if (table) {
          await table.put(remoteData)
        }
        return { success: true, data: true }

      case 'manual':
        // 手動解決用のエラーを返す
        return {
          success: false,
          error: `conflict:${JSON.stringify({ local: localData, remote: remoteData })}`
        }

      default:
        return {
          success: false,
          error: 'Unknown conflict resolution strategy'
        }
    }
  }

  /**
   * テーブル名の変換
   */
  private getTableName(supabaseTable: string): string {
    const tableMapping: Record<string, string> = {
      'users': 'users',
      'analysis_results': 'analysisResults',
      'analysis_sessions': 'analysisSessions',
      'question_responses': 'questionResponses',
      'hexagrams': 'hexagrams',
      'trigrams': 'trigrams',
      'yao_lines': 'yaoLines',
      'engine_os_profiles': 'engineOSProfiles',
      'interface_os_profiles': 'interfaceOSProfiles',
      'safe_mode_os_profiles': 'safeModeOSProfiles',
      'os_interactions': 'osInteractions'
    }
    return tableMapping[supabaseTable] || supabaseTable
  }

  /**
   * オフライン操作の追加
   */
  async addOfflineOperation(
    type: 'create' | 'update' | 'delete',
    table: string,
    data?: any,
    recordId?: string
  ): Promise<string> {
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await this.db.offlineOperations.add({
      id: operationId,
      type,
      table,
      data,
      recordId,
      timestamp: Date.now(),
      retryCount: 0,
      syncStatus: 'pending'
    })

    console.log(`📝 HAQEIOfflineDB: Offline operation queued - ${type} on ${table}`)
    
    // オンラインの場合は即座に同期試行
    if (this.isOnline && !this.syncInProgress) {
      setTimeout(() => this.triggerSync(), 1000)
    }

    return operationId
  }

  /**
   * データベースインスタンスの取得
   */
  get database(): HAQEIOfflineDatabase {
    return this.db
  }

  /**
   * 同期設定の更新
   */
  async updateSyncConfig(config: Partial<SyncConfig>): Promise<void> {
    await this.db.syncConfig.update('default', config)
    
    // 自動同期設定の再起動
    if (config.autoSync !== undefined || config.syncInterval !== undefined) {
      this.stopAutoSync()
      if (config.autoSync !== false) {
        await this.startAutoSync()
      }
    }
    
    console.log('⚙️ HAQEIOfflineDB: Sync configuration updated')
  }

  /**
   * サービスの破棄
   */
  async destroy(): Promise<void> {
    this.stopAutoSync()
    window.removeEventListener('online', this.handleOnline.bind(this))
    window.removeEventListener('offline', this.handleOffline.bind(this))
    await this.db.close()
    console.log('🗑️ HAQEIOfflineDatabaseService: Service destroyed')
  }
}

// シングルトンインスタンス
let offlineService: HAQEIOfflineDatabaseService | null = null

/**
 * HAQEIオフラインデータベースサービスの取得
 */
export function getOfflineDatabaseService(): HAQEIOfflineDatabaseService {
  if (!offlineService) {
    offlineService = new HAQEIOfflineDatabaseService()
  }
  return offlineService
}

/**
 * 型エクスポート
 */
export type { 
  OfflineOperation, 
  SyncConfig, 
  DataVersion, 
  HAQEIOfflineDatabase 
}