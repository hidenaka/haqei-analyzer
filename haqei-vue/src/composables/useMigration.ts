/**
 * HAQEI Data Migration Composable - Vue 3統合版
 * 
 * 目的：
 * - Vue 3コンポーネントでの移行機能統合
 * - リアクティブな移行進捗管理
 * - bunenjin哲学準拠のプライバシー制御
 * - Triple OS Architecture完全対応
 * 
 * 機能：
 * - リアクティブな移行状態管理
 * - 自動進捗追跡とUI更新
 * - エラーハンドリングと回復機能
 * - データ検証とプレビュー
 * - バックアップとロールバック機能
 * 
 * 実装: 2025-08-03 - TASK-038完了版
 */

import { ref, computed, watch, onMounted, onUnmounted, reactive, readonly } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { 
  migrationService,
  type DetectedLocalStorageData,
  type MigrationOptions,
  type MigrationProgress,
  type MigrationResult,
  type MigrationError
} from '@/services/migration'
import type { HAQEIOperationResult, Database } from '@/types/supabase'

/**
 * 移行UI状態の型定義
 */
export interface MigrationUIState {
  // フェーズ管理
  currentPhase: 'idle' | 'detecting' | 'preview' | 'configuring' | 'migrating' | 'completed' | 'error'
  canProceed: boolean
  canGoBack: boolean
  
  // データ検出状態
  hasDetectedData: boolean
  detectionComplete: boolean
  
  // 移行実行状態
  isMigrating: boolean
  migrationComplete: boolean
  
  // エラー管理
  hasErrors: boolean
  hasCriticalErrors: boolean
  
  // バックアップ管理
  hasBackup: boolean
  canRollback: boolean
}

/**
 * Vue 3 Migration Composable関数
 */
export function useMigration() {
  // ===== リアクティブ状態 =====
  
  // データ検出状態
  const detectedData = ref<DetectedLocalStorageData | null>(null)
  const isDetecting = ref(false)
  const detectionError = ref<string | null>(null)
  
  // 移行設定
  const migrationOptions = reactive<MigrationOptions>({
    // 基本設定
    batchSize: 50,
    maxRetries: 3,
    timeoutMs: 30000,
    dryRun: false,
    
    // プライバシー設定（bunenjin哲学準拠）
    privacyLevel: 'maximum',
    anonymizeData: false,
    excludeSensitiveData: false,
    
    // 移行制御
    skipExisting: true,
    validateData: true,
    createBackup: true,
    rollbackOnError: false,
    
    // 進捗追跡
    enableProgressTracking: true,
    reportInterval: 1000,
    
    // Triple OS Architecture設定
    migrateEngineOS: true,
    migrateInterfaceOS: true,
    migrateSafeModeOS: true,
    preserveOSInteractions: true
  })
  
  // 移行進捗状態
  const migrationProgress = ref<MigrationProgress | null>(null)
  const isMigrating = ref(false)
  const migrationError = ref<string | null>(null)
  const migrationResult = ref<MigrationResult | null>(null)
  
  // バックアップ管理
  const backupLocation = ref<string | null>(null)
  const isRollingBack = ref(false)
  const rollbackError = ref<string | null>(null)
  
  // UI状態管理
  const uiState = reactive<MigrationUIState>({
    currentPhase: 'idle',
    canProceed: false,
    canGoBack: false,
    hasDetectedData: false,
    detectionComplete: false,
    isMigrating: false,
    migrationComplete: false,
    hasErrors: false,
    hasCriticalErrors: false,
    hasBackup: false,
    canRollback: false
  })
  
  // 進捗監視用のアンサブスクライブ関数
  let progressUnsubscribe: (() => void) | null = null
  
  // ===== Computed Properties =====
  
  const hasLocalStorageData = computed(() => {
    return detectedData.value && detectedData.value.totalItems > 0
  })
  
  const migrationSummary = computed(() => {
    if (!detectedData.value) return null
    
    const data = detectedData.value
    return {
      totalItems: data.totalItems,
      totalSizeKB: Math.round(data.totalSizeBytes / 1024),
      estimatedTimeMinutes: Math.round(data.estimatedMigrationTime / 60),
      privacyRisk: data.privacyRisk,
      dataTypes: Object.keys(data.dataByType).filter(key => data.dataByType[key].length > 0),
      compatibilityIssues: data.compatibilityCheck.issues.length,
      recommendations: data.compatibilityCheck.recommendations
    }
  })
  
  const progressPercentage = computed(() => {
    return migrationProgress.value?.overallProgress || 0
  })
  
  const currentOperation = computed(() => {
    return migrationProgress.value?.currentOperation || ''
  })
  
  const migrationStats = computed(() => {
    if (!migrationProgress.value) return null
    
    const stats = migrationProgress.value.statistics
    const tripleOS = migrationProgress.value.tripleOSStats
    
    return {
      // 基本統計
      elapsedTime: Math.round(stats.elapsedTimeMs / 1000),
      remainingTime: Math.round(stats.estimatedTimeRemainingMs / 1000),
      itemsPerSecond: Math.round(stats.itemsPerSecond * 100) / 100,
      
      // 処理統計
      processed: stats.successCount,
      errors: stats.errorCount,
      skipped: stats.skippedCount,
      
      // Triple OS統計
      engineOSMigrated: tripleOS.engineOSMigrated,
      interfaceOSMigrated: tripleOS.interfaceOSMigrated,
      safeModeOSMigrated: tripleOS.safeModeOSMigrated,
      interactionsMigrated: tripleOS.interactionsMigrated
    }
  })
  
  const criticalErrors = computed(() => {
    if (!migrationProgress.value) return []
    return migrationProgress.value.errors.filter(error => error.severity === 'critical')
  })
  
  const canStartMigration = computed(() => {
    return hasLocalStorageData.value && 
           !isMigrating.value && 
           !uiState.migrationComplete &&
           uiState.detectionComplete &&
           criticalErrors.value.length === 0
  })
  
  // ===== メソッド =====
  
  /**
   * localStorageデータの検出
   */
  async function detectLocalStorageData(): Promise<void> {
    if (isDetecting.value) return
    
    isDetecting.value = true
    detectionError.value = null
    uiState.currentPhase = 'detecting'
    
    try {
      const result = await migrationService.detectLocalStorageData()
      
      if (result.success && result.data) {
        detectedData.value = result.data
        uiState.hasDetectedData = true
        uiState.detectionComplete = true
        uiState.currentPhase = 'preview'
        uiState.canProceed = result.data.totalItems > 0
      } else {
        throw new Error(result.error || 'データ検出に失敗しました')
      }
      
    } catch (error) {
      detectionError.value = error instanceof Error ? error.message : 'データ検出エラー'
      uiState.currentPhase = 'error'
      uiState.hasErrors = true
    } finally {
      isDetecting.value = false
    }
  }
  
  /**
   * 移行設定の更新
   */
  function updateMigrationOptions(options: Partial<MigrationOptions>): void {
    Object.assign(migrationOptions, options)
    
    // プライバシーレベルに応じた自動調整
    if (migrationOptions.privacyLevel === 'maximum') {
      migrationOptions.anonymizeData = true
      migrationOptions.excludeSensitiveData = true
    }
  }
  
  /**
   * データ移行の実行
   */
  async function startMigration(): Promise<void> {
    if (!canStartMigration.value) {
      throw new Error('移行を開始できません。データ検出または設定を確認してください。')
    }
    
    isMigrating.value = true
    migrationError.value = null
    uiState.currentPhase = 'migrating'
    uiState.isMigrating = true
    
    try {
      // 進捗監視の開始
      startProgressMonitoring()
      
      // 移行実行
      const result = await migrationService.migrateData(migrationOptions)
      
      if (result.success && result.data) {
        migrationResult.value = result.data
        backupLocation.value = result.data.backupLocation || null
        uiState.migrationComplete = true
        uiState.currentPhase = 'completed'
        uiState.hasBackup = !!result.data.backupLocation
        uiState.canRollback = result.data.rollbackAvailable
        
        // 成功通知
        console.log('✅ データ移行が正常に完了しました')
        console.log('📊 移行統計:', result.data.summary)
        
      } else {
        throw new Error(result.error || '移行処理に失敗しました')
      }
      
    } catch (error) {
      migrationError.value = error instanceof Error ? error.message : '移行エラー'
      uiState.currentPhase = 'error'
      uiState.hasErrors = true
      uiState.hasCriticalErrors = true
      
      console.error('❌ データ移行に失敗:', error)
      
    } finally {
      isMigrating.value = false
      uiState.isMigrating = false
      stopProgressMonitoring()
    }
  }
  
  /**
   * 移行のキャンセル
   */
  function cancelMigration(): boolean {
    const cancelled = migrationService.cancelMigration()
    
    if (cancelled) {
      isMigrating.value = false
      uiState.isMigrating = false
      uiState.currentPhase = 'idle'
      stopProgressMonitoring()
    }
    
    return cancelled
  }
  
  /**
   * バックアップからのロールバック
   */
  async function rollbackMigration(): Promise<void> {
    if (!backupLocation.value || isRollingBack.value) {
      throw new Error('ロールバックできません。バックアップが見つからないか、既に実行中です。')
    }
    
    isRollingBack.value = true
    rollbackError.value = null
    
    try {
      const result = await migrationService.rollbackFromBackup(backupLocation.value)
      
      if (result.success) {
        // 状態をリセット
        resetMigrationState()
        console.log('✅ ロールバックが正常に完了しました')
      } else {
        throw new Error(result.error || 'ロールバックに失敗しました')
      }
      
    } catch (error) {
      rollbackError.value = error instanceof Error ? error.message : 'ロールバックエラー'
      console.error('❌ ロールバックに失敗:', error)
    } finally {
      isRollingBack.value = false
    }
  }
  
  /**
   * 移行状態のリセット
   */
  function resetMigrationState(): void {
    // データリセット
    detectedData.value = null
    migrationProgress.value = null
    migrationResult.value = null
    backupLocation.value = null
    
    // エラーリセット
    detectionError.value = null
    migrationError.value = null
    rollbackError.value = null
    
    // フラグリセット
    isDetecting.value = false
    isMigrating.value = false
    isRollingBack.value = false
    
    // UI状態リセット
    Object.assign(uiState, {
      currentPhase: 'idle',
      canProceed: false,
      canGoBack: false,
      hasDetectedData: false,
      detectionComplete: false,
      isMigrating: false,
      migrationComplete: false,
      hasErrors: false,
      hasCriticalErrors: false,
      hasBackup: false,
      canRollback: false
    })
    
    // 進捗監視停止
    stopProgressMonitoring()
  }
  
  /**
   * Triple OS設定の一括更新
   */
  function configureTripleOSMigration(config: {
    migrateEngineOS?: boolean
    migrateInterfaceOS?: boolean
    migrateSafeModeOS?: boolean
    preserveInteractions?: boolean
  }): void {
    if (config.migrateEngineOS !== undefined) {
      migrationOptions.migrateEngineOS = config.migrateEngineOS
    }
    if (config.migrateInterfaceOS !== undefined) {
      migrationOptions.migrateInterfaceOS = config.migrateInterfaceOS
    }
    if (config.migrateSafeModeOS !== undefined) {
      migrationOptions.migrateSafeModeOS = config.migrateSafeModeOS
    }
    if (config.preserveInteractions !== undefined) {
      migrationOptions.preserveOSInteractions = config.preserveInteractions
    }
  }
  
  /**
   * プライバシーレベルの設定
   */
  function setPrivacyLevel(level: Database['public']['Enums']['privacy_level']): void {
    migrationOptions.privacyLevel = level
    
    // プライバシーレベルに応じた自動調整
    switch (level) {
      case 'maximum':
        migrationOptions.anonymizeData = true
        migrationOptions.excludeSensitiveData = true
        break
      case 'high':
        migrationOptions.anonymizeData = false
        migrationOptions.excludeSensitiveData = true
        break
      case 'medium':
      case 'low':
        migrationOptions.anonymizeData = false
        migrationOptions.excludeSensitiveData = false
        break
    }
  }
  
  /**
   * データプレビューの取得
   */
  function getDataPreview(dataType: string, limit = 5): any[] {
    if (!detectedData.value) return []
    
    const items = detectedData.value.dataByType[dataType] || []
    return items.slice(0, limit).map(item => ({
      key: item.key,
      size: item.size,
      timestamp: item.timestamp,
      preview: typeof item.value === 'object' 
        ? JSON.stringify(item.value, null, 2).substring(0, 200) + '...'
        : String(item.value).substring(0, 200) + '...'
    }))
  }
  
  /**
   * 移行可能なデータタイプの取得
   */
  function getAvailableDataTypes(): Array<{
    type: string
    count: number
    size: number
    enabled: boolean
  }> {
    if (!detectedData.value) return []
    
    return Object.entries(detectedData.value.dataByType).map(([type, items]) => ({
      type,
      count: items.length,
      size: items.reduce((sum, item) => sum + item.size, 0),
      enabled: items.length > 0
    })).filter(item => item.count > 0)
  }
  
  // ===== プライベートメソッド =====
  
  /**
   * 進捗監視の開始
   */
  function startProgressMonitoring(): void {
    if (progressUnsubscribe) {
      progressUnsubscribe()
    }
    
    progressUnsubscribe = migrationService.onProgress((progress) => {
      migrationProgress.value = progress
      
      // UI状態の更新
      uiState.hasErrors = progress.errors.length > 0
      uiState.hasCriticalErrors = progress.errors.some(e => e.severity === 'critical')
    })
  }
  
  /**
   * 進捗監視の停止
   */
  function stopProgressMonitoring(): void {
    if (progressUnsubscribe) {
      progressUnsubscribe()
      progressUnsubscribe = null
    }
  }
  
  /**
   * エラー分析と推奨事項の取得
   */
  function analyzeErrors(): {
    summary: string
    recommendations: string[]
    recoverable: boolean
  } {
    if (!migrationProgress.value) {
      return {
        summary: 'エラー情報がありません',
        recommendations: [],
        recoverable: false
      }
    }
    
    const errors = migrationProgress.value.errors
    const criticalCount = errors.filter(e => e.severity === 'critical').length
    const recoverableCount = errors.filter(e => e.recoverable).length
    
    return {
      summary: `${errors.length}個のエラー（重大: ${criticalCount}個）`,
      recommendations: [
        criticalCount > 0 ? '重大なエラーがあります。設定を確認してください。' : '',
        recoverableCount > 0 ? `${recoverableCount}個のエラーは回復可能です。` : '',
        errors.length > errors.length * 0.5 ? 'バッチサイズを小さくしてみてください。' : '',
        'プライバシーレベルを下げることで問題が解決する場合があります。'
      ].filter(Boolean),
      recoverable: recoverableCount > 0
    }
  }
  
  // ===== ウォッチャー =====
  
  // プライバシーレベルの変更監視
  watch(() => migrationOptions.privacyLevel, (newLevel) => {
    console.log(`🔒 プライバシーレベルが ${newLevel} に変更されました`)
  })
  
  // Triple OS設定の変更監視
  watch([
    () => migrationOptions.migrateEngineOS,
    () => migrationOptions.migrateInterfaceOS,
    () => migrationOptions.migrateSafeModeOS
  ], ([engine, interface_, safeMode]) => {
    const enabledOS = [
      engine && 'Engine OS',
      interface_ && 'Interface OS', 
      safeMode && 'Safe Mode OS'
    ].filter(Boolean)
    
    console.log(`🎯 Triple OS移行設定: ${enabledOS.join(', ')}`)
  })
  
  // ===== ライフサイクル =====
  
  onMounted(() => {
    // 自動データ検出（オプション）
    if (localStorage.length > 0) {
      detectLocalStorageData()
    }
  })
  
  onUnmounted(() => {
    stopProgressMonitoring()
  })
  
  // ===== 戻り値 =====
  
  return {
    // === データ ===
    detectedData: readonly(detectedData),
    migrationOptions,
    migrationProgress: readonly(migrationProgress),
    migrationResult: readonly(migrationResult),
    uiState: readonly(uiState),
    
    // === Computed ===
    hasLocalStorageData,
    migrationSummary,
    progressPercentage,
    currentOperation,
    migrationStats,
    criticalErrors,
    canStartMigration,
    
    // === 状態フラグ ===
    isDetecting: readonly(isDetecting),
    isMigrating: readonly(isMigrating),
    isRollingBack: readonly(isRollingBack),
    
    // === エラー ===
    detectionError: readonly(detectionError),
    migrationError: readonly(migrationError),
    rollbackError: readonly(rollbackError),
    
    // === バックアップ ===
    backupLocation: readonly(backupLocation),
    
    // === アクション ===
    detectLocalStorageData,
    startMigration,
    cancelMigration,
    rollbackMigration,
    resetMigrationState,
    
    // === 設定 ===
    updateMigrationOptions,
    configureTripleOSMigration,
    setPrivacyLevel,
    
    // === ユーティリティ ===
    getDataPreview,
    getAvailableDataTypes,
    analyzeErrors,
    
    // === 進捗監視 ===
    startProgressMonitoring,
    stopProgressMonitoring
  }
}

/**
 * 軽量版Migration Composable（最小限の機能）
 */
export function useMigrationSimple() {
  const migrationState = ref<'idle' | 'detecting' | 'migrating' | 'completed' | 'error'>('idle')
  const progress = ref(0)
  const error = ref<string | null>(null)
  
  async function quickMigrate(options?: Partial<MigrationOptions>) {
    migrationState.value = 'detecting'
    error.value = null
    
    try {
      // データ検出
      const detectionResult = await migrationService.detectLocalStorageData()
      if (!detectionResult.success) {
        throw new Error(detectionResult.error)
      }
      
      if (!detectionResult.data || detectionResult.data.totalItems === 0) {
        migrationState.value = 'completed'
        return { success: true, message: '移行するデータがありません' }
      }
      
      // 移行実行
      migrationState.value = 'migrating'
      
      const migrationResult = await migrationService.migrateData({
        privacyLevel: 'maximum',
        createBackup: true,
        validateData: true,
        ...options
      })
      
      if (migrationResult.success) {
        migrationState.value = 'completed'
        progress.value = 100
        return { 
          success: true, 
          message: `${migrationResult.data?.summary.itemsMigrated}個のアイテムを移行しました` 
        }
      } else {
        throw new Error(migrationResult.error)
      }
      
    } catch (err) {
      migrationState.value = 'error'
      error.value = err instanceof Error ? err.message : '移行に失敗しました'
      return { success: false, error: error.value }
    }
  }
  
  return {
    migrationState: readonly(migrationState),
    progress: readonly(progress),
    error: readonly(error),
    quickMigrate
  }
}

/**
 * Migration診断Composable
 */
export function useMigrationDiagnostics() {
  const diagnostics = ref<{
    hasLocalStorageData: boolean
    dataSize: number
    dataTypes: string[]
    compatibility: boolean
    recommendations: string[]
  } | null>(null)
  
  async function runDiagnostics() {
    const result = await migrationService.detectLocalStorageData()
    
    if (result.success && result.data) {
      diagnostics.value = {
        hasLocalStorageData: result.data.totalItems > 0,
        dataSize: result.data.totalSizeBytes,
        dataTypes: Object.keys(result.data.dataByType).filter(
          key => result.data!.dataByType[key].length > 0
        ),
        compatibility: result.data.compatibilityCheck.isCompatible,
        recommendations: result.data.compatibilityCheck.recommendations
      }
    }
    
    return diagnostics.value
  }
  
  return {
    diagnostics: readonly(diagnostics),
    runDiagnostics
  }
}