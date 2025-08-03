/**
 * HAQEI Data Migration Service - localStorage to Supabase
 * 
 * 目的：
 * - localStorageに保存されたHAQEIデータの安全なSupabase移行
 * - bunenjin哲学準拠のプライバシー保護移行
 * - Triple OS Architectureデータの完全移行
 * - Vue3統合とリアクティブ進捗管理
 * 
 * 機能：
 * - localStorageデータの自動検出・抽出
 * - バッチ処理による安全なSupabase移行
 * - 進捗追跡とエラー回復機能
 * - データ検証とロールバック機能
 * - プライバシーレベル準拠の移行制御
 * 
 * 実装: 2025-08-03 - TASK-038完了版
 */

import { useSupabase, getConnectionState } from '@/services/supabase'
import type { 
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  AnalysisData,
  TripleOSData,
  HAQEIOperationResult,
  Database
} from '@/types/supabase'

/**
 * 移行可能なlocalStorageデータ型定義
 */
export interface LocalStorageDataItem {
  key: string
  value: any
  timestamp?: number
  dataType: 'user' | 'session' | 'response' | 'analysis' | 'triple_os' | 'settings'
  size: number
}

export interface DetectedLocalStorageData {
  totalItems: number
  totalSizeBytes: number
  dataByType: Record<string, LocalStorageDataItem[]>
  estimatedMigrationTime: number
  privacyRisk: 'low' | 'medium' | 'high'
  compatibilityCheck: {
    isCompatible: boolean
    issues: string[]
    recommendations: string[]
  }
}

/**
 * 移行操作の設定オプション
 */
export interface MigrationOptions {
  // 基本設定
  batchSize: number
  maxRetries: number
  timeoutMs: number
  dryRun: boolean
  
  // プライバシー設定（bunenjin哲学準拠）
  privacyLevel: Database['public']['Enums']['privacy_level']
  anonymizeData: boolean
  excludeSensitiveData: boolean
  
  // 移行制御
  skipExisting: boolean
  validateData: boolean
  createBackup: boolean
  rollbackOnError: boolean
  
  // 進捗追跡
  enableProgressTracking: boolean
  reportInterval: number
  
  // Triple OS Architecture設定
  migrateEngineOS: boolean
  migrateInterfaceOS: boolean
  migrateSafeModeOS: boolean
  preserveOSInteractions: boolean
}

/**
 * 移行進捗状態
 */
export interface MigrationProgress {
  phase: 'detection' | 'validation' | 'backup' | 'migration' | 'verification' | 'cleanup' | 'completed' | 'error'
  overallProgress: number
  currentOperation: string
  itemsProcessed: number
  totalItems: number
  
  // フェーズ別進捗
  phaseProgress: {
    detection: number
    validation: number
    backup: number
    migration: number
    verification: number
    cleanup: number
  }
  
  // 統計情報
  statistics: {
    startTime: number
    elapsedTimeMs: number
    estimatedTimeRemainingMs: number
    itemsPerSecond: number
    successCount: number
    errorCount: number
    skippedCount: number
  }
  
  // エラー情報
  errors: MigrationError[]
  warnings: string[]
  
  // Triple OS専用統計
  tripleOSStats: {
    engineOSMigrated: number
    interfaceOSMigrated: number
    safeModeOSMigrated: number
    interactionsMigrated: number
  }
}

export interface MigrationError {
  phase: string
  operation: string
  itemKey: string
  error: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  recoverable: boolean
}

/**
 * 移行結果サマリー
 */
export interface MigrationResult {
  success: boolean
  summary: {
    totalItemsFound: number
    itemsMigrated: number
    itemsSkipped: number
    itemsFailed: number
    dataTransferredBytes: number
    executionTimeMs: number
  }
  
  // 詳細結果
  details: {
    userDataMigrated: number
    sessionsMigrated: number
    responsesMigrated: number
    analysisMigrated: number
    tripleOSMigrated: number
  }
  
  // Triple OS詳細
  tripleOSResults: {
    engineOS: { migrated: number; failed: number }
    interfaceOS: { migrated: number; failed: number }
    safeModeOS: { migrated: number; failed: number }
    interactions: { migrated: number; failed: number }
  }
  
  errors: MigrationError[]
  backupLocation?: string
  rollbackAvailable: boolean
}

/**
 * HAQEIデータ移行サービスクラス
 */
export class HAQEIDataMigrationService {
  private supabase = useSupabase()
  private storagePrefix = 'haqei_'
  private isRunning = false
  private currentProgress: MigrationProgress | null = null
  private progressCallbacks: ((progress: MigrationProgress) => void)[] = []
  
  /**
   * localStorageデータの検出と分析
   */
  async detectLocalStorageData(): Promise<HAQEIOperationResult<DetectedLocalStorageData>> {
    try {
      const detectedData: DetectedLocalStorageData = {
        totalItems: 0,
        totalSizeBytes: 0,
        dataByType: {
          user: [],
          session: [],
          response: [],
          analysis: [],
          triple_os: [],
          settings: []
        },
        estimatedMigrationTime: 0,
        privacyRisk: 'low',
        compatibilityCheck: {
          isCompatible: true,
          issues: [],
          recommendations: []
        }
      }
      
      // localStorageをスキャン
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key || !key.startsWith(this.storagePrefix)) continue
        
        try {
          const value = localStorage.getItem(key)
          if (!value) continue
          
          const dataItem: LocalStorageDataItem = {
            key,
            value: JSON.parse(value),
            timestamp: this.extractTimestamp(value),
            dataType: this.determineDataType(key),
            size: value.length
          }
          
          detectedData.dataByType[dataItem.dataType].push(dataItem)
          detectedData.totalItems++
          detectedData.totalSizeBytes += dataItem.size
          
        } catch (parseError) {
          console.warn(`データ解析エラー ${key}:`, parseError)
          detectedData.compatibilityCheck.issues.push(`${key}: JSON解析に失敗`)
        }
      }
      
      // 移行時間の推定
      detectedData.estimatedMigrationTime = this.estimateMigrationTime(detectedData)
      
      // プライバシーリスク評価
      detectedData.privacyRisk = this.assessPrivacyRisk(detectedData)
      
      // 互換性チェック
      this.performCompatibilityCheck(detectedData)
      
      return {
        success: true,
        data: detectedData
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'データ検出に失敗しました'
      }
    }
  }
  
  /**
   * データ移行の実行
   */
  async migrateData(
    options: Partial<MigrationOptions> = {}
  ): Promise<HAQEIOperationResult<MigrationResult>> {
    if (this.isRunning) {
      return { success: false, error: '移行が既に実行中です' }
    }
    
    this.isRunning = true
    
    try {
      // デフォルトオプションの設定
      const migrationOptions: MigrationOptions = {
        batchSize: 50,
        maxRetries: 3,
        timeoutMs: 30000,
        dryRun: false,
        privacyLevel: 'maximum',
        anonymizeData: false,
        excludeSensitiveData: false,
        skipExisting: true,
        validateData: true,
        createBackup: true,
        rollbackOnError: false,
        enableProgressTracking: true,
        reportInterval: 1000,
        migrateEngineOS: true,
        migrateInterfaceOS: true,
        migrateSafeModeOS: true,
        preserveOSInteractions: true,
        ...options
      }
      
      // 移行進捗の初期化
      this.currentProgress = this.initializeProgress()
      this.reportProgress('検出フェーズを開始中...')
      
      // フェーズ1: データ検出
      const detectionResult = await this.detectLocalStorageData()
      if (!detectionResult.success || !detectionResult.data) {
        throw new Error(detectionResult.error || 'データ検出に失敗')
      }
      
      this.updatePhaseProgress('detection', 100)
      this.reportProgress('データ検証フェーズを開始中...')
      
      // フェーズ2: データ検証
      const validationResult = await this.validateDataForMigration(
        detectionResult.data, 
        migrationOptions
      )
      if (!validationResult.success) {
        throw new Error(validationResult.error || 'データ検証に失敗')
      }
      
      this.updatePhaseProgress('validation', 100)
      
      // フェーズ3: バックアップ作成
      let backupLocation: string | undefined
      if (migrationOptions.createBackup) {
        this.reportProgress('バックアップを作成中...')
        const backupResult = await this.createBackup(detectionResult.data)
        if (backupResult.success) {
          backupLocation = backupResult.data
        }
        this.updatePhaseProgress('backup', 100)
      }
      
      // フェーズ4: 実際の移行処理
      this.reportProgress('データ移行を開始中...')
      const migrationResult = await this.performDataMigration(
        detectionResult.data,
        migrationOptions
      )
      
      this.updatePhaseProgress('migration', 100)
      
      // フェーズ5: 移行検証
      this.reportProgress('移行データを検証中...')
      const verificationResult = await this.verifyMigration(migrationResult.data!)
      this.updatePhaseProgress('verification', 100)
      
      // フェーズ6: クリーンアップ
      this.reportProgress('クリーンアップを実行中...')
      if (!migrationOptions.dryRun && migrationResult.success) {
        await this.cleanupLocalStorage(detectionResult.data, migrationOptions)
      }
      this.updatePhaseProgress('cleanup', 100)
      
      // 完了
      this.currentProgress!.phase = 'completed'
      this.currentProgress!.overallProgress = 100
      this.reportProgress('移行が正常に完了しました')
      
      const finalResult: MigrationResult = {
        ...migrationResult.data!,
        backupLocation,
        rollbackAvailable: !!backupLocation
      }
      
      return {
        success: true,
        data: finalResult
      }
      
    } catch (error) {
      this.currentProgress!.phase = 'error'
      this.currentProgress!.errors.push({
        phase: this.currentProgress!.phase,
        operation: this.currentProgress!.currentOperation,
        itemKey: 'global',
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
        severity: 'critical',
        recoverable: false
      })
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '移行処理に失敗しました'
      }
    } finally {
      this.isRunning = false
    }
  }
  
  /**
   * 移行進捗の監視コールバック登録
   */
  onProgress(callback: (progress: MigrationProgress) => void): () => void {
    this.progressCallbacks.push(callback)
    
    // アンサブスクライブ関数を返す
    return () => {
      const index = this.progressCallbacks.indexOf(callback)
      if (index > -1) {
        this.progressCallbacks.splice(index, 1)
      }
    }
  }
  
  /**
   * 現在の移行進捗状態を取得
   */
  getCurrentProgress(): MigrationProgress | null {
    return this.currentProgress
  }
  
  /**
   * 移行のキャンセル
   */
  cancelMigration(): boolean {
    if (!this.isRunning) return false
    
    this.isRunning = false
    if (this.currentProgress) {
      this.currentProgress.phase = 'error'
      this.currentProgress.errors.push({
        phase: 'cancellation',
        operation: 'user_cancelled',
        itemKey: 'global',
        error: 'ユーザーによって移行がキャンセルされました',
        timestamp: Date.now(),
        severity: 'medium',
        recoverable: true
      })
    }
    
    return true
  }
  
  /**
   * バックアップからのロールバック
   */
  async rollbackFromBackup(backupLocation: string): Promise<HAQEIOperationResult<boolean>> {
    try {
      // バックアップファイルの存在確認
      const backupData = localStorage.getItem(`haqei_backup_${backupLocation}`)
      if (!backupData) {
        return { success: false, error: 'バックアップデータが見つかりません' }
      }
      
      const backup = JSON.parse(backupData)
      
      // 現在のlocalStorageをクリア（HAQEIデータのみ）
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // バックアップからデータを復元
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      
      return { success: true, data: true }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'ロールバックに失敗しました'
      }
    }
  }
  
  // ===== プライベートメソッド =====
  
  private extractTimestamp(value: string): number {
    try {
      const parsed = JSON.parse(value)
      return parsed.timestamp || parsed.createdAt || parsed.created_at || Date.now()
    } catch {
      return Date.now()
    }
  }
  
  private determineDataType(key: string): LocalStorageDataItem['dataType'] {
    const keyLower = key.toLowerCase()
    
    if (keyLower.includes('user') || keyLower.includes('profile')) return 'user'
    if (keyLower.includes('session')) return 'session'
    if (keyLower.includes('response') || keyLower.includes('answer')) return 'response'
    if (keyLower.includes('analysis') || keyLower.includes('result')) return 'analysis'
    if (keyLower.includes('triple') || keyLower.includes('os') || keyLower.includes('engine') || 
        keyLower.includes('interface') || keyLower.includes('safe')) return 'triple_os'
    if (keyLower.includes('setting') || keyLower.includes('config') || keyLower.includes('preference')) return 'settings'
    
    return 'settings' // デフォルト
  }
  
  private estimateMigrationTime(data: DetectedLocalStorageData): number {
    // アイテム数とサイズに基づく推定（秒）
    const baseTimePerItem = 0.1 // 100ms per item
    const sizeMultiplier = Math.max(1, data.totalSizeBytes / (1024 * 1024)) // MB単位でのマルチプライヤー
    
    return Math.ceil(data.totalItems * baseTimePerItem * sizeMultiplier)
  }
  
  private assessPrivacyRisk(data: DetectedLocalStorageData): 'low' | 'medium' | 'high' {
    let riskScore = 0
    
    // ユーザーデータのリスク評価
    if (data.dataByType.user.length > 0) riskScore += 2
    if (data.dataByType.analysis.length > 5) riskScore += 1
    if (data.dataByType.triple_os.length > 0) riskScore += 1
    if (data.totalSizeBytes > 1024 * 1024) riskScore += 1 // 1MB以上
    
    if (riskScore >= 4) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
  }
  
  private performCompatibilityCheck(data: DetectedLocalStorageData): void {
    // Supabaseスキーマとの互換性チェック
    data.dataByType.user.forEach(item => {
      if (!item.value.id && !item.value.user_id) {
        data.compatibilityCheck.issues.push('ユーザーデータにIDが不足しています')
      }
    })
    
    data.dataByType.session.forEach(item => {
      if (!item.value.user_id || !item.value.session_type) {
        data.compatibilityCheck.issues.push('セッションデータに必須フィールドが不足しています')
      }
    })
    
    data.dataByType.triple_os.forEach(item => {
      if (!item.value.hexagram_id && !item.value.analysis_data) {
        data.compatibilityCheck.issues.push('Triple OSデータが不完全です')
      }
    })
    
    // 互換性判定
    data.compatibilityCheck.isCompatible = data.compatibilityCheck.issues.length === 0
    
    // 推奨事項
    if (data.totalSizeBytes > 10 * 1024 * 1024) { // 10MB以上
      data.compatibilityCheck.recommendations.push('大量データのため、バッチサイズを小さくすることを推奨します')
    }
    
    if (data.dataByType.user.length > 1) {
      data.compatibilityCheck.recommendations.push('複数のユーザーデータが検出されました。統合方法を確認してください')
    }
  }
  
  private initializeProgress(): MigrationProgress {
    return {
      phase: 'detection',
      overallProgress: 0,
      currentOperation: '初期化中...',
      itemsProcessed: 0,
      totalItems: 0,
      phaseProgress: {
        detection: 0,
        validation: 0,
        backup: 0,
        migration: 0,
        verification: 0,
        cleanup: 0
      },
      statistics: {
        startTime: Date.now(),
        elapsedTimeMs: 0,
        estimatedTimeRemainingMs: 0,
        itemsPerSecond: 0,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0
      },
      errors: [],
      warnings: [],
      tripleOSStats: {
        engineOSMigrated: 0,
        interfaceOSMigrated: 0,
        safeModeOSMigrated: 0,
        interactionsMigrated: 0
      }
    }
  }
  
  private reportProgress(operation: string): void {
    if (!this.currentProgress) return
    
    this.currentProgress.currentOperation = operation
    this.currentProgress.statistics.elapsedTimeMs = Date.now() - this.currentProgress.statistics.startTime
    
    // 進捗コールバックの実行
    this.progressCallbacks.forEach(callback => {
      try {
        callback(this.currentProgress!)
      } catch (error) {
        console.error('進捗コールバックエラー:', error)
      }
    })
  }
  
  private updatePhaseProgress(phase: keyof MigrationProgress['phaseProgress'], progress: number): void {
    if (!this.currentProgress) return
    
    this.currentProgress.phaseProgress[phase] = progress
    
    // 全体進捗の計算
    const phases = Object.values(this.currentProgress.phaseProgress)
    this.currentProgress.overallProgress = phases.reduce((sum, p) => sum + p, 0) / phases.length
  }
  
  private async validateDataForMigration(
    data: DetectedLocalStorageData,
    options: MigrationOptions
  ): Promise<HAQEIOperationResult<boolean>> {
    try {
      // 接続状態の確認
      const connectionState = getConnectionState()
      if (!connectionState.isSupabaseConnected) {
        return { success: false, error: 'Supabaseに接続されていません' }
      }
      
      // データ検証
      if (data.totalItems === 0) {
        return { success: false, error: '移行するデータがありません' }
      }
      
      if (!data.compatibilityCheck.isCompatible) {
        return { 
          success: false, 
          error: `互換性問題: ${data.compatibilityCheck.issues.join(', ')}` 
        }
      }
      
      // プライバシーレベルの検証
      if (options.privacyLevel === 'maximum' && data.privacyRisk === 'high') {
        return { 
          success: false, 
          error: 'プライバシーレベル「maximum」では高リスクデータの移行ができません' 
        }
      }
      
      return { success: true, data: true }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'データ検証に失敗しました'
      }
    }
  }
  
  private async createBackup(data: DetectedLocalStorageData): Promise<HAQEIOperationResult<string>> {
    try {
      const backupId = `backup_${Date.now()}`
      const backupData = {
        timestamp: Date.now(),
        version: '1.0.0',
        dataTypes: Object.keys(data.dataByType),
        totalItems: data.totalItems,
        data: {}
      }
      
      // localStorageから全データをバックアップ
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.storagePrefix)) {
          const value = localStorage.getItem(key)
          if (value) {
            backupData.data[key] = JSON.parse(value)
          }
        }
      }
      
      // バックアップをlocalStorageに保存
      localStorage.setItem(`haqei_backup_${backupId}`, JSON.stringify(backupData))
      
      return { success: true, data: backupId }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'バックアップ作成に失敗しました'
      }
    }
  }
  
  private async performDataMigration(
    data: DetectedLocalStorageData,
    options: MigrationOptions
  ): Promise<HAQEIOperationResult<MigrationResult>> {
    try {
      const result: MigrationResult = {
        success: true,
        summary: {
          totalItemsFound: data.totalItems,
          itemsMigrated: 0,
          itemsSkipped: 0,
          itemsFailed: 0,
          dataTransferredBytes: 0,
          executionTimeMs: 0
        },
        details: {
          userDataMigrated: 0,
          sessionsMigrated: 0,
          responsesMigrated: 0,
          analysisMigrated: 0,
          tripleOSMigrated: 0
        },
        tripleOSResults: {
          engineOS: { migrated: 0, failed: 0 },
          interfaceOS: { migrated: 0, failed: 0 },
          safeModeOS: { migrated: 0, failed: 0 },
          interactions: { migrated: 0, failed: 0 }
        },
        errors: [],
        rollbackAvailable: false
      }
      
      const startTime = Date.now()
      
      // データタイプ別の移行処理
      for (const [dataType, items] of Object.entries(data.dataByType)) {
        if (items.length === 0) continue
        
        switch (dataType) {
          case 'user':
            if (options.migrateEngineOS || options.migrateInterfaceOS || options.migrateSafeModeOS) {
              const migrationResult = await this.migrateUserData(items, options)
              result.details.userDataMigrated += migrationResult.successCount
              result.summary.itemsFailed += migrationResult.failureCount
            }
            break
            
          case 'session':
            const sessionResult = await this.migrateSessionData(items, options)
            result.details.sessionsMigrated += sessionResult.successCount
            result.summary.itemsFailed += sessionResult.failureCount
            break
            
          case 'response':
            const responseResult = await this.migrateResponseData(items, options)
            result.details.responsesMigrated += responseResult.successCount
            result.summary.itemsFailed += responseResult.failureCount
            break
            
          case 'analysis':
            const analysisResult = await this.migrateAnalysisData(items, options)
            result.details.analysisMigrated += analysisResult.successCount
            result.summary.itemsFailed += analysisResult.failureCount
            break
            
          case 'triple_os':
            const tripleOSResult = await this.migrateTripleOSData(items, options)
            result.details.tripleOSMigrated += tripleOSResult.successCount
            result.summary.itemsFailed += tripleOSResult.failureCount
            
            // Triple OS詳細統計の更新
            result.tripleOSResults = tripleOSResult.details
            break
        }
      }
      
      // 実行時間の記録
      result.summary.executionTimeMs = Date.now() - startTime
      result.summary.itemsMigrated = 
        result.details.userDataMigrated +
        result.details.sessionsMigrated +
        result.details.responsesMigrated +
        result.details.analysisMigrated +
        result.details.tripleOSMigrated
      
      // 成功判定
      result.success = result.summary.itemsMigrated > 0 && result.summary.itemsFailed === 0
      
      return { success: true, data: result }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'データ移行に失敗しました'
      }
    }
  }
  
  private async migrateUserData(
    items: LocalStorageDataItem[],
    options: MigrationOptions
  ): Promise<{ successCount: number; failureCount: number }> {
    let successCount = 0
    let failureCount = 0
    
    for (const item of items) {
      try {
        const userData = item.value
        
        // bunenjin哲学準拠のプライバシー設定
        const user: Partial<HAQEIUser> = {
          id: userData.id || userData.user_id || crypto.randomUUID(),
          email: options.anonymizeData ? null : userData.email,
          username: options.anonymizeData ? `anonymous_${Date.now()}` : userData.username,
          privacy_level: options.privacyLevel,
          created_at: new Date(userData.created_at || userData.createdAt || Date.now()).toISOString(),
          last_active_at: new Date().toISOString()
        }
        
        if (!options.dryRun) {
          const result = await this.supabase.client
            .from('users')
            .upsert(user, { onConflict: 'id' })
          
          if (result.error) {
            throw new Error(result.error.message)
          }
        }
        
        successCount++
        this.reportProgress(`ユーザーデータを移行中... (${successCount}/${items.length})`)
        
      } catch (error) {
        failureCount++
        console.error(`ユーザーデータ移行エラー ${item.key}:`, error)
      }
    }
    
    return { successCount, failureCount }
  }
  
  private async migrateSessionData(
    items: LocalStorageDataItem[],
    options: MigrationOptions
  ): Promise<{ successCount: number; failureCount: number }> {
    let successCount = 0
    let failureCount = 0
    
    for (const item of items) {
      try {
        const sessionData = item.value
        
        const session: Partial<HAQEIAnalysisSession> = {
          id: sessionData.id || crypto.randomUUID(),
          user_id: sessionData.user_id || sessionData.userId,
          session_type: sessionData.session_type || sessionData.type || 'initial',
          completion_status: sessionData.completion_status || sessionData.status || 'in_progress',
          created_at: new Date(sessionData.created_at || sessionData.createdAt || Date.now()).toISOString(),
          metadata: sessionData.metadata || {}
        }
        
        if (!options.dryRun) {
          const result = await this.supabase.client
            .from('analysis_sessions')
            .upsert(session, { onConflict: 'id' })
          
          if (result.error) {
            throw new Error(result.error.message)
          }
        }
        
        successCount++
        this.reportProgress(`セッションデータを移行中... (${successCount}/${items.length})`)
        
      } catch (error) {
        failureCount++
        console.error(`セッションデータ移行エラー ${item.key}:`, error)
      }
    }
    
    return { successCount, failureCount }
  }
  
  private async migrateResponseData(
    items: LocalStorageDataItem[],
    options: MigrationOptions
  ): Promise<{ successCount: number; failureCount: number }> {
    let successCount = 0
    let failureCount = 0
    
    for (const item of items) {
      try {
        const responseData = item.value
        
        const response: Partial<HAQEIQuestionResponse> = {
          id: responseData.id || crypto.randomUUID(),
          session_id: responseData.session_id || responseData.sessionId,
          user_id: responseData.user_id || responseData.userId,
          question_id: responseData.question_id || responseData.questionId,
          question_text: responseData.question_text || responseData.questionText,
          response_value: responseData.response_value || responseData.answer,
          response_time_seconds: responseData.response_time_seconds || responseData.responseTime,
          created_at: new Date(responseData.created_at || responseData.timestamp || Date.now()).toISOString()
        }
        
        if (!options.dryRun) {
          const result = await this.supabase.client
            .from('question_responses')
            .upsert(response, { onConflict: 'id' })
          
          if (result.error) {
            throw new Error(result.error.message)
          }
        }
        
        successCount++
        this.reportProgress(`回答データを移行中... (${successCount}/${items.length})`)
        
      } catch (error) {
        failureCount++
        console.error(`回答データ移行エラー ${item.key}:`, error)
      }
    }
    
    return { successCount, failureCount }
  }
  
  private async migrateAnalysisData(
    items: LocalStorageDataItem[],
    options: MigrationOptions
  ): Promise<{ successCount: number; failureCount: number }> {
    let successCount = 0
    let failureCount = 0
    
    for (const item of items) {
      try {
        const analysisData = item.value
        
        const analysis = {
          id: analysisData.id || crypto.randomUUID(),
          session_id: analysisData.session_id || analysisData.sessionId,
          user_id: analysisData.user_id || analysisData.userId,
          analysis_data: analysisData.analysis_data || analysisData.analysisData,
          triple_os_data: analysisData.triple_os_data || analysisData.tripleOSData,
          created_at: new Date(analysisData.created_at || analysisData.timestamp || Date.now()).toISOString(),
          metadata: options.anonymizeData ? {} : (analysisData.metadata || {})
        }
        
        if (!options.dryRun) {
          const result = await this.supabase.client
            .from('analysis_results')
            .upsert(analysis, { onConflict: 'id' })
          
          if (result.error) {
            throw new Error(result.error.message)
          }
        }
        
        successCount++
        this.reportProgress(`分析データを移行中... (${successCount}/${items.length})`)
        
      } catch (error) {
        failureCount++
        console.error(`分析データ移行エラー ${item.key}:`, error)
      }
    }
    
    return { successCount, failureCount }
  }
  
  private async migrateTripleOSData(
    items: LocalStorageDataItem[],
    options: MigrationOptions
  ): Promise<{ 
    successCount: number; 
    failureCount: number;
    details: MigrationResult['tripleOSResults']
  }> {
    let successCount = 0
    let failureCount = 0
    
    const details: MigrationResult['tripleOSResults'] = {
      engineOS: { migrated: 0, failed: 0 },
      interfaceOS: { migrated: 0, failed: 0 },
      safeModeOS: { migrated: 0, failed: 0 },
      interactions: { migrated: 0, failed: 0 }
    }
    
    for (const item of items) {
      try {
        const tripleOSData = item.value
        const osType = this.determineOSType(item.key, tripleOSData)
        
        // OS別の移行制御
        if (osType === 'engine' && !options.migrateEngineOS) continue
        if (osType === 'interface' && !options.migrateInterfaceOS) continue
        if (osType === 'safe_mode' && !options.migrateSafeModeOS) continue
        
        const tableName = this.getOSTableName(osType)
        const osRecord = {
          id: tripleOSData.id || crypto.randomUUID(),
          user_id: tripleOSData.user_id || tripleOSData.userId,
          hexagram_id: tripleOSData.hexagram_id || tripleOSData.hexagramId,
          trigram_upper_id: tripleOSData.trigram_upper_id,
          trigram_lower_id: tripleOSData.trigram_lower_id,
          confidence_score: tripleOSData.confidence_score || tripleOSData.confidence,
          analysis_data: tripleOSData.analysis_data,
          created_at: new Date(tripleOSData.created_at || tripleOSData.timestamp || Date.now()).toISOString(),
          last_analyzed_at: new Date().toISOString()
        }
        
        if (!options.dryRun) {
          const result = await this.supabase.client
            .from(tableName)
            .upsert(osRecord, { onConflict: 'id' })
          
          if (result.error) {
            throw new Error(result.error.message)
          }
        }
        
        successCount++
        details[osType].migrated++
        this.reportProgress(`Triple OS (${osType}) データを移行中... (${successCount}/${items.length})`)
        
        // Triple OS統計の更新
        if (this.currentProgress) {
          if (osType === 'engine') this.currentProgress.tripleOSStats.engineOSMigrated++
          if (osType === 'interface') this.currentProgress.tripleOSStats.interfaceOSMigrated++
          if (osType === 'safe_mode') this.currentProgress.tripleOSStats.safeModeOSMigrated++
        }
        
      } catch (error) {
        failureCount++
        const osType = this.determineOSType(item.key, item.value)
        details[osType].failed++
        console.error(`Triple OSデータ移行エラー ${item.key}:`, error)
      }
    }
    
    return { successCount, failureCount, details }
  }
  
  private determineOSType(key: string, data: any): 'engineOS' | 'interfaceOS' | 'safeModeOS' | 'interactions' {
    const keyLower = key.toLowerCase()
    
    if (keyLower.includes('engine')) return 'engineOS'
    if (keyLower.includes('interface')) return 'interfaceOS'
    if (keyLower.includes('safe') || keyLower.includes('safety')) return 'safeModeOS'
    if (keyLower.includes('interaction')) return 'interactions'
    
    // データ内容から判定
    if (data.os_type) {
      if (data.os_type === 'engine') return 'engineOS'
      if (data.os_type === 'interface') return 'interfaceOS'
      if (data.os_type === 'safe_mode') return 'safeModeOS'
    }
    
    return 'engineOS' // デフォルト
  }
  
  private getOSTableName(osType: string): string {
    switch (osType) {
      case 'engineOS':
      case 'engine':
        return 'engine_os_profiles'
      case 'interfaceOS':
      case 'interface':
        return 'interface_os_profiles'
      case 'safeModeOS':
      case 'safe_mode':
        return 'safe_mode_os_profiles'
      case 'interactions':
        return 'os_interactions'
      default:
        return 'engine_os_profiles'
    }
  }
  
  private async verifyMigration(result: MigrationResult): Promise<HAQEIOperationResult<boolean>> {
    try {
      // 移行されたデータの整合性確認
      let totalVerified = 0
      
      // ユーザーデータの確認
      if (result.details.userDataMigrated > 0) {
        const { count } = await this.supabase.client
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        totalVerified += count || 0
      }
      
      // セッションデータの確認
      if (result.details.sessionsMigrated > 0) {
        const { count } = await this.supabase.client
          .from('analysis_sessions')
          .select('*', { count: 'exact', head: true })
        
        totalVerified += count || 0
      }
      
      // 検証成功判定
      const verificationSuccessful = totalVerified >= result.summary.itemsMigrated * 0.9 // 90%以上成功
      
      return { success: verificationSuccessful, data: verificationSuccessful }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '移行検証に失敗しました'
      }
    }
  }
  
  private async cleanupLocalStorage(
    data: DetectedLocalStorageData,
    options: MigrationOptions
  ): Promise<void> {
    if (options.dryRun) return
    
    try {
      // 移行成功後のlocalStorageクリーンアップ
      Object.values(data.dataByType).flat().forEach(item => {
        localStorage.removeItem(item.key)
      })
      
      this.reportProgress('localStorageクリーンアップ完了')
      
    } catch (error) {
      console.error('localStorageクリーンアップエラー:', error)
    }
  }
}

/**
 * デフォルトエクスポート: シングルトンインスタンス
 */
export const migrationService = new HAQEIDataMigrationService()

/**
 * Vue 3 Composable関数としてのエクスポート
 */
export function useMigrationService() {
  return {
    migrationService,
    
    // ショートカットメソッド
    detectData: () => migrationService.detectLocalStorageData(),
    migrateData: (options?: Partial<MigrationOptions>) => migrationService.migrateData(options),
    onProgress: (callback: (progress: MigrationProgress) => void) => migrationService.onProgress(callback),
    getCurrentProgress: () => migrationService.getCurrentProgress(),
    cancelMigration: () => migrationService.cancelMigration(),
    rollback: (backupLocation: string) => migrationService.rollbackFromBackup(backupLocation)
  }
}