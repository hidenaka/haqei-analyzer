/**
 * HAQEI マルチデバイス状態同期システム - bunenjin哲学的連続性保持
 * 
 * 目的：
 * - デバイス間での診断状態のシームレスな同期
 * - bunenjin哲学に基づく一貫した体験の提供
 * - Triple OS分析の連続性保持
 * - 易経64卦解釈の一貫性維持
 * - オフライン対応と競合解決
 * 
 * bunenjin哲学の統合：
 * - 分人（複数人格）の連続性をデバイス間で保持
 * - コンテキストによる人格変化を考慮した同期
 * - プライバシーを重視した最小限データ共有
 * - 易経的変化の自然な流れを維持
 * 
 * 技術要件：
 * 1. リアルタイム双方向同期
 * 2. 競合解決アルゴリズム
 * 3. オフライン対応・復旧機能
 * 4. 暗号化・プライバシー保護
 * 5. 効率的な差分同期
 * 
 * 更新: 2025-08-03 - TASK-039実装
 */

import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useSupabase, getConnectionState } from '@/services/supabase'
import type { 
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  AnalysisData,
  TripleOSData
} from '@/types/supabase'

// デバイス識別・管理
interface DeviceInfo {
  id: string
  name: string
  type: 'desktop' | 'tablet' | 'mobile' | 'unknown'
  platform: string
  userAgent: string
  lastSync: string
  isActive: boolean
  capabilities: DeviceCapabilities
}

interface DeviceCapabilities {
  hasRealtime: boolean
  hasOfflineStorage: boolean
  hasNotifications: boolean
  screenSize: 'small' | 'medium' | 'large'
  performanceLevel: 'high' | 'medium' | 'low'
}

// 同期状態管理
interface SyncState {
  isOnline: boolean
  isSyncing: boolean
  lastSyncTime: Date | null
  pendingChanges: number
  conflictCount: number
  syncProgress: number
  syncSpeed: 'fast' | 'normal' | 'slow'
}

// 同期可能なデータの種類
interface SyncableData {
  userProfile: HAQEIUser | null
  currentSession: HAQEIAnalysisSession | null
  questionResponses: HAQEIQuestionResponse[]
  analysisProgress: AnalysisProgress
  tripleOSState: TripleOSState
  preferences: UserPreferences
  insights: PersonalInsight[]
}

// 分析進捗データ
interface AnalysisProgress {
  currentQuestionIndex: number
  totalQuestions: number
  completedPhases: string[]
  currentPhase: string
  timeSpent: number
  lastActivity: string
}

// Triple OS状態
interface TripleOSState {
  engineOS: {
    discovered: boolean
    strength: number
    characteristics: string[]
    lastUpdated: string
  }
  interfaceOS: {
    discovered: boolean
    strength: number
    characteristics: string[]
    lastUpdated: string
  }
  safeModeOS: {
    discovered: boolean
    strength: number
    characteristics: string[]
    lastUpdated: string
  }
  integrationLevel: number
  harmonicsScore: number
}

// ユーザー設定
interface UserPreferences {
  privacyLevel: 'maximum' | 'high' | 'medium' | 'low'
  autoSyncEnabled: boolean
  syncFrequency: number // minutes
  offlineMode: boolean
  notificationsEnabled: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string
}

// 個人洞察
interface PersonalInsight {
  id: string
  content: string
  relatedHexagram?: number
  osContext: 'engine' | 'interface' | 'safeMode' | 'integration'
  timestamp: string
  isPrivate: boolean
  tags: string[]
}

// 変更追跡
interface ChangeRecord {
  id: string
  dataType: keyof SyncableData
  changeType: 'create' | 'update' | 'delete'
  timestamp: string
  deviceId: string
  data: any
  checksum: string
}

// 競合解決
interface ConflictResolution {
  strategy: 'last_write_wins' | 'merge' | 'manual' | 'bunenjin_context'
  priority: 'server' | 'local' | 'newest' | 'context_aware'
}

/**
 * マルチデバイス状態同期システム
 * 
 * bunenjin哲学に基づく連続的体験を複数デバイス間で実現
 */
export function useMultiDeviceSync(userId: string) {
  const supabase = useSupabase()
  
  // デバイス情報管理
  const currentDevice = ref<DeviceInfo>(generateDeviceInfo())
  const connectedDevices = ref<DeviceInfo[]>([])
  
  // 同期状態管理
  const syncState = reactive<SyncState>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
    conflictCount: 0,
    syncProgress: 0,
    syncSpeed: 'normal'
  })
  
  // 同期対象データ
  const syncableData = reactive<SyncableData>({
    userProfile: null,
    currentSession: null,
    questionResponses: [],
    analysisProgress: {
      currentQuestionIndex: 0,
      totalQuestions: 30,
      completedPhases: [],
      currentPhase: 'initial',
      timeSpent: 0,
      lastActivity: new Date().toISOString()
    },
    tripleOSState: {
      engineOS: { discovered: false, strength: 0, characteristics: [], lastUpdated: '' },
      interfaceOS: { discovered: false, strength: 0, characteristics: [], lastUpdated: '' },
      safeModeOS: { discovered: false, strength: 0, characteristics: [], lastUpdated: '' },
      integrationLevel: 0,
      harmonicsScore: 0
    },
    preferences: {
      privacyLevel: 'maximum',
      autoSyncEnabled: true,
      syncFrequency: 5,
      offlineMode: false,
      notificationsEnabled: true,
      theme: 'auto',
      language: 'ja'
    },
    insights: []
  })
  
  // 変更追跡
  const changeLog = ref<ChangeRecord[]>([])
  const pendingSync = ref<ChangeRecord[]>([])
  
  // エラー・ステータス管理
  const error = ref<string | null>(null)
  const conflicts = ref<any[]>([])
  
  // 競合解決設定
  const conflictResolution = reactive<ConflictResolution>({
    strategy: 'bunenjin_context',
    priority: 'context_aware'
  })

  /**
   * 同期システムの初期化
   * 
   * 目的：
   * - デバイス登録と識別
   * - 既存データの復元
   * - リアルタイム同期の開始
   * - オフライン変更の検出と送信
   */
  async function initializeSync(): Promise<boolean> {
    try {
      syncState.isSyncing = true
      error.value = null

      // デバイス登録
      await registerDevice()
      
      // 既存データの復元
      await restoreFromCloud()
      
      // ローカル変更の検出・同期
      await syncPendingChanges()
      
      // リアルタイム同期の開始
      await startRealtimeSync()
      
      // 他デバイス監視の開始
      await startDeviceMonitoring()
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '同期初期化に失敗しました'
      error.value = errorMessage
      console.error('同期初期化エラー:', err)
      return false
    } finally {
      syncState.isSyncing = false
    }
  }

  /**
   * デバイス登録と識別
   */
  async function registerDevice(): Promise<void> {
    const deviceData = {
      user_id: userId,
      device_id: currentDevice.value.id,
      device_name: currentDevice.value.name,
      device_type: currentDevice.value.type,
      platform: currentDevice.value.platform,
      user_agent: currentDevice.value.userAgent,
      capabilities: currentDevice.value.capabilities,
      last_sync: new Date().toISOString(),
      is_active: true
    }

    const { error: registerError } = await supabase.client
      .from('user_devices')
      .upsert(deviceData)

    if (registerError) {
      throw new Error(`デバイス登録エラー: ${registerError.message}`)
    }

    // 他のアクティブデバイスを取得
    const { data: devices, error: fetchError } = await supabase.client
      .from('user_devices')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .neq('device_id', currentDevice.value.id)

    if (!fetchError && devices) {
      connectedDevices.value = devices.map(d => ({
        id: d.device_id,
        name: d.device_name,
        type: d.device_type,
        platform: d.platform,
        userAgent: d.user_agent,
        lastSync: d.last_sync,
        isActive: d.is_active,
        capabilities: d.capabilities
      }))
    }
  }

  /**
   * クラウドからのデータ復元
   */
  async function restoreFromCloud(): Promise<void> {
    // ユーザープロフィール復元
    const { data: userProfile } = await supabase.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userProfile) {
      syncableData.userProfile = userProfile
    }

    // 現在セッション復元
    const { data: currentSession } = await supabase.client
      .from('analysis_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('completion_status', 'in_progress')
      .order('started_at', { ascending: false })
      .limit(1)
      .single()

    if (currentSession) {
      syncableData.currentSession = currentSession
      
      // セッション関連の質問応答を復元
      const { data: responses } = await supabase.client
        .from('question_responses')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('answered_at')

      if (responses) {
        syncableData.questionResponses = responses
        updateAnalysisProgress(responses)
      }
    }

    // ユーザー設定復元
    const { data: preferences } = await supabase.client
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (preferences) {
      Object.assign(syncableData.preferences, preferences)
    }

    // Triple OS状態復元
    await restoreTripleOSState()

    // 個人洞察復元
    await restorePersonalInsights()
  }

  /**
   * Triple OS状態の復元
   */
  async function restoreTripleOSState(): Promise<void> {
    const osTypes = ['engine_os_profiles', 'interface_os_profiles', 'safe_mode_os_profiles']
    
    for (const osType of osTypes) {
      const { data: osProfile } = await supabase.client
        .from(osType)
        .select('*')
        .eq('user_id', userId)
        .order('last_analysis_at', { ascending: false })
        .limit(1)
        .single()

      if (osProfile) {
        const osKey = osType.replace('_profiles', '').replace('_', '') as keyof TripleOSState
        if (osKey in syncableData.tripleOSState) {
          const osState = syncableData.tripleOSState[osKey] as any
          osState.discovered = true
          osState.strength = osProfile.strength_score || 0
          osState.characteristics = osProfile.characteristics || []
          osState.lastUpdated = osProfile.last_analysis_at
        }
      }
    }

    // 統合レベルとハーモニクススコアの計算
    calculateIntegrationMetrics()
  }

  /**
   * 個人洞察の復元
   */
  async function restorePersonalInsights(): Promise<void> {
    const { data: insights } = await supabase.client
      .from('personal_insights')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50)

    if (insights) {
      syncableData.insights = insights.map(insight => ({
        id: insight.id,
        content: insight.content,
        relatedHexagram: insight.related_hexagram,
        osContext: insight.os_context,
        timestamp: insight.timestamp,
        isPrivate: insight.is_private,
        tags: insight.tags || []
      }))
    }
  }

  /**
   * 保留中変更の同期
   */
  async function syncPendingChanges(): Promise<void> {
    const localChanges = loadLocalChanges()
    
    if (localChanges.length === 0) return

    syncState.pendingChanges = localChanges.length
    
    for (const change of localChanges) {
      try {
        await applySyncChange(change)
        removeLocalChange(change.id)
        syncState.pendingChanges--
      } catch (err) {
        console.error('変更同期エラー:', change, err)
        // 失敗した変更は保持
      }
    }
  }

  /**
   * リアルタイム同期の開始
   */
  async function startRealtimeSync(): Promise<void> {
    // ユーザーデータの変更監視
    supabase.client
      .channel('user_sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sync_changes',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        handleRemoteChange(payload)
      })
      .subscribe()

    // セッションデータの変更監視
    supabase.client
      .channel('session_sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analysis_sessions',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        handleSessionChange(payload)
      })
      .subscribe()

    // デバイス状態の監視
    supabase.client
      .channel('device_sync')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_devices',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        handleDeviceChange(payload)
      })
      .subscribe()
  }

  /**
   * デバイス監視の開始
   */
  async function startDeviceMonitoring(): Promise<void> {
    // 定期的なハートビート送信
    setInterval(async () => {
      if (syncState.isOnline) {
        await sendHeartbeat()
      }
    }, 30000) // 30秒間隔

    // 他デバイスの状態確認
    setInterval(async () => {
      await checkOtherDevices()
    }, 60000) // 1分間隔
  }

  /**
   * リモート変更の処理
   */
  function handleRemoteChange(payload: any): void {
    const { eventType, new: newData, old: oldData } = payload

    // 自分のデバイスからの変更は無視
    if (newData?.device_id === currentDevice.value.id) return

    // 競合検出と解決
    if (hasLocalChanges(newData)) {
      resolveConflict(newData, oldData)
    } else {
      applyRemoteChange(newData)
    }
  }

  /**
   * セッション変更の処理
   */
  function handleSessionChange(payload: any): void {
    const { eventType, new: newData } = payload

    if (eventType === 'UPDATE' && newData) {
      // セッション状態の更新
      if (syncableData.currentSession?.id === newData.id) {
        Object.assign(syncableData.currentSession, newData)
      }
    }
  }

  /**
   * デバイス変更の処理
   */
  function handleDeviceChange(payload: any): void {
    const { eventType, new: newData, old: oldData } = payload

    switch (eventType) {
      case 'INSERT':
      case 'UPDATE':
        updateDeviceInfo(newData)
        break
      case 'DELETE':
        removeDeviceInfo(oldData)
        break
    }
  }

  /**
   * 競合解決処理
   */
  function resolveConflict(remoteData: any, localData: any): void {
    const conflict = {
      id: crypto.randomUUID(),
      type: 'data_conflict',
      remoteData,
      localData,
      timestamp: new Date().toISOString(),
      resolved: false
    }

    conflicts.value.push(conflict)
    syncState.conflictCount++

    // bunenjin哲学に基づく自動解決
    if (conflictResolution.strategy === 'bunenjin_context') {
      resolveBunenjinConflict(conflict)
    } else {
      // 他の解決戦略
      resolveByStrategy(conflict)
    }
  }

  /**
   * bunenjin哲学に基づく競合解決
   * 
   * 考慮要素：
   * - コンテキスト（どの分人が活動中か）
   * - 感情状態・思考パターン
   * - 時間的文脈（朝・昼・夜の違い）
   * - デバイスタイプ（環境による人格変化）
   */
  function resolveBunenjinConflict(conflict: any): void {
    const remoteContext = extractBunenjinContext(conflict.remoteData)
    const localContext = extractBunenjinContext(conflict.localData)

    // コンテキスト分析
    const contextScore = analyzeBunenjinContext(remoteContext, localContext)
    
    if (contextScore.useRemote) {
      applyRemoteChange(conflict.remoteData)
    } else if (contextScore.useLocal) {
      // ローカルデータを保持（リモートに送信）
      syncLocalChange(conflict.localData)
    } else {
      // 統合的解決（bunenjin的統合）
      const mergedData = mergeByBunenjinPrinciples(conflict.remoteData, conflict.localData)
      applyMergedChange(mergedData)
    }

    conflict.resolved = true
    syncState.conflictCount--
  }

  /**
   * bunenjinコンテキストの抽出
   */
  function extractBunenjinContext(data: any): any {
    return {
      timeOfDay: new Date(data.timestamp).getHours(),
      deviceType: data.device_type,
      emotionalTone: data.emotional_context,
      activePersona: data.active_persona,
      socialContext: data.social_context
    }
  }

  /**
   * bunenjinコンテキストの分析
   */
  function analyzeBunenjinContext(remote: any, local: any): any {
    // 時間的文脈の考慮
    const timeScore = Math.abs(remote.timeOfDay - local.timeOfDay)
    
    // デバイス・環境の考慮
    const environmentScore = remote.deviceType === local.deviceType ? 1 : 0.5
    
    // 感情・思考状態の考慮
    const emotionalAlignment = calculateEmotionalAlignment(remote.emotionalTone, local.emotionalTone)
    
    // 総合判定
    const remoteScore = (24 - timeScore) / 24 + environmentScore + emotionalAlignment
    const localScore = timeScore / 24 + environmentScore + emotionalAlignment
    
    return {
      useRemote: remoteScore > localScore + 0.2,
      useLocal: localScore > remoteScore + 0.2,
      useIntegrated: Math.abs(remoteScore - localScore) <= 0.2
    }
  }

  /**
   * bunenjin原則による統合
   */
  function mergeByBunenjinPrinciples(remoteData: any, localData: any): any {
    // 複数分人の知見を統合
    const mergedInsights = [...(remoteData.insights || []), ...(localData.insights || [])]
      .filter((insight, index, self) => 
        self.findIndex(i => i.content === insight.content) === index
      )

    // Triple OS状態の統合
    const mergedTripleOS = {
      engineOS: mergeOSState(remoteData.tripleOS?.engineOS, localData.tripleOS?.engineOS),
      interfaceOS: mergeOSState(remoteData.tripleOS?.interfaceOS, localData.tripleOS?.interfaceOS),
      safeModeOS: mergeOSState(remoteData.tripleOS?.safeModeOS, localData.tripleOS?.safeModeOS)
    }

    return {
      ...localData,
      ...remoteData,
      insights: mergedInsights,
      tripleOS: mergedTripleOS,
      lastMerged: new Date().toISOString(),
      mergeReason: 'bunenjin_integration'
    }
  }

  /**
   * OS状態の統合
   */
  function mergeOSState(remote: any, local: any): any {
    if (!remote && !local) return { discovered: false, strength: 0, characteristics: [] }
    if (!remote) return local
    if (!local) return remote

    return {
      discovered: remote.discovered || local.discovered,
      strength: Math.max(remote.strength, local.strength),
      characteristics: [...new Set([...remote.characteristics, ...local.characteristics])],
      lastUpdated: remote.lastUpdated > local.lastUpdated ? remote.lastUpdated : local.lastUpdated
    }
  }

  /**
   * データ変更の記録
   */
  function recordChange(dataType: keyof SyncableData, changeType: 'create' | 'update' | 'delete', data: any): void {
    const change: ChangeRecord = {
      id: crypto.randomUUID(),
      dataType,
      changeType,
      timestamp: new Date().toISOString(),
      deviceId: currentDevice.value.id,
      data,
      checksum: calculateChecksum(data)
    }

    changeLog.value.unshift(change)
    
    // 変更をローカルストレージに保存
    saveLocalChange(change)
    
    // オンライン時は即座に同期
    if (syncState.isOnline) {
      syncChange(change)
    } else {
      pendingSync.value.push(change)
      syncState.pendingChanges++
    }
  }

  /**
   * 分析進捗の更新
   */
  function updateAnalysisProgress(responses: HAQEIQuestionResponse[]): void {
    syncableData.analysisProgress.currentQuestionIndex = responses.length
    syncableData.analysisProgress.lastActivity = new Date().toISOString()
    
    // フェーズの判定
    const progress = (responses.length / syncableData.analysisProgress.totalQuestions) * 100
    if (progress >= 75 && !syncableData.analysisProgress.completedPhases.includes('near_completion')) {
      syncableData.analysisProgress.completedPhases.push('near_completion')
      syncableData.analysisProgress.currentPhase = 'near_completion'
    } else if (progress >= 50 && !syncableData.analysisProgress.completedPhases.includes('mid_analysis')) {
      syncableData.analysisProgress.completedPhases.push('mid_analysis')
      syncableData.analysisProgress.currentPhase = 'mid_analysis'
    } else if (progress >= 25 && !syncableData.analysisProgress.completedPhases.includes('early_analysis')) {
      syncableData.analysisProgress.completedPhases.push('early_analysis')
      syncableData.analysisProgress.currentPhase = 'early_analysis'
    }

    recordChange('analysisProgress', 'update', syncableData.analysisProgress)
  }

  /**
   * Triple OS状態の更新
   */
  function updateTripleOSState(osType: 'engineOS' | 'interfaceOS' | 'safeModeOS', updates: any): void {
    const osState = syncableData.tripleOSState[osType]
    Object.assign(osState, updates, { lastUpdated: new Date().toISOString() })
    
    calculateIntegrationMetrics()
    recordChange('tripleOSState', 'update', syncableData.tripleOSState)
  }

  /**
   * 統合メトリクスの計算
   */
  function calculateIntegrationMetrics(): void {
    const { engineOS, interfaceOS, safeModeOS } = syncableData.tripleOSState
    
    // 統合レベル計算
    const discoveredCount = [engineOS.discovered, interfaceOS.discovered, safeModeOS.discovered]
      .filter(Boolean).length
    syncableData.tripleOSState.integrationLevel = (discoveredCount / 3) * 100

    // ハーモニクススコア計算
    if (discoveredCount > 1) {
      const strengths = [engineOS.strength, interfaceOS.strength, safeModeOS.strength]
        .filter(s => s > 0)
      const average = strengths.reduce((sum, s) => sum + s, 0) / strengths.length
      const variance = strengths.reduce((sum, s) => sum + Math.pow(s - average, 2), 0) / strengths.length
      syncableData.tripleOSState.harmonicsScore = Math.max(0, 100 - (variance * 2))
    }
  }

  /**
   * 洞察の追加
   */
  function addPersonalInsight(insight: Omit<PersonalInsight, 'id' | 'timestamp'>): void {
    const newInsight: PersonalInsight = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...insight
    }

    syncableData.insights.unshift(newInsight)
    recordChange('insights', 'create', newInsight)
  }

  /**
   * 手動同期の実行
   */
  async function manualSync(): Promise<boolean> {
    if (syncState.isSyncing) return false

    try {
      syncState.isSyncing = true
      syncState.syncProgress = 0

      // ヘルスチェック
      await sendHeartbeat()
      syncState.syncProgress = 20

      // 保留中変更の同期
      await syncPendingChanges()
      syncState.syncProgress = 60

      // 最新データの取得
      await restoreFromCloud()
      syncState.syncProgress = 80

      // 同期完了
      syncState.lastSyncTime = new Date()
      syncState.syncProgress = 100

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '手動同期に失敗しました'
      return false
    } finally {
      syncState.isSyncing = false
      setTimeout(() => syncState.syncProgress = 0, 2000)
    }
  }

  /**
   * ユーティリティ関数
   */
  function generateDeviceInfo(): DeviceInfo {
    const deviceId = localStorage.getItem('haqei_device_id') || crypto.randomUUID()
    localStorage.setItem('haqei_device_id', deviceId)

    return {
      id: deviceId,
      name: generateDeviceName(),
      type: detectDeviceType(),
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      lastSync: new Date().toISOString(),
      isActive: true,
      capabilities: detectCapabilities()
    }
  }

  function generateDeviceName(): string {
    const platform = navigator.platform.toLowerCase()
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('mobile')) return 'Mobile Device'
    if (userAgent.includes('tablet') || userAgent.includes('ipad')) return 'Tablet'
    if (platform.includes('mac')) return 'Mac'
    if (platform.includes('win')) return 'Windows PC'
    if (platform.includes('linux')) return 'Linux'
    
    return 'Unknown Device'
  }

  function detectDeviceType(): 'desktop' | 'tablet' | 'mobile' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('mobile') && !userAgent.includes('tablet')) return 'mobile'
    if (userAgent.includes('tablet') || userAgent.includes('ipad')) return 'tablet'
    if (!userAgent.includes('mobile')) return 'desktop'
    
    return 'unknown'
  }

  function detectCapabilities(): DeviceCapabilities {
    return {
      hasRealtime: 'WebSocket' in window,
      hasOfflineStorage: 'localStorage' in window,
      hasNotifications: 'Notification' in window,
      screenSize: window.innerWidth > 1024 ? 'large' : window.innerWidth > 768 ? 'medium' : 'small',
      performanceLevel: navigator.hardwareConcurrency > 4 ? 'high' : navigator.hardwareConcurrency > 2 ? 'medium' : 'low'
    }
  }

  function calculateChecksum(data: any): string {
    // 簡易チェックサム実装
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 32bit整数に変換
    }
    return hash.toString(16)
  }

  function calculateEmotionalAlignment(remote: string, local: string): number {
    // 感情的アライメントの計算（簡易実装）
    if (remote === local) return 1
    
    const positiveEmotions = ['joy', 'hope', 'calm', 'confident']
    const negativeEmotions = ['worry', 'anxiety', 'stress', 'confusion']
    
    const remoteIsPositive = positiveEmotions.includes(remote)
    const localIsPositive = positiveEmotions.includes(local)
    
    return remoteIsPositive === localIsPositive ? 0.7 : 0.3
  }

  // ローカルストレージヘルパー
  function saveLocalChange(change: ChangeRecord): void {
    const changes = loadLocalChanges()
    changes.push(change)
    localStorage.setItem('haqei_pending_changes', JSON.stringify(changes))
  }

  function loadLocalChanges(): ChangeRecord[] {
    const stored = localStorage.getItem('haqei_pending_changes')
    return stored ? JSON.parse(stored) : []
  }

  function removeLocalChange(changeId: string): void {
    const changes = loadLocalChanges().filter(c => c.id !== changeId)
    localStorage.setItem('haqei_pending_changes', JSON.stringify(changes))
  }

  // Supabase操作のスタブ関数（実装に応じて調整）
  async function applySyncChange(change: ChangeRecord): Promise<void> {
    // 実装に応じてSupabaseへの同期処理を実装
  }

  async function syncChange(change: ChangeRecord): Promise<void> {
    // 実装に応じてリアルタイム同期処理を実装
  }

  async function syncLocalChange(data: any): Promise<void> {
    // 実装に応じてローカル変更の同期処理を実装
  }

  async function sendHeartbeat(): Promise<void> {
    // 実装に応じてハートビート送信処理を実装
  }

  async function checkOtherDevices(): Promise<void> {
    // 実装に応じて他デバイス状態確認処理を実装
  }

  function hasLocalChanges(remoteData: any): boolean {
    // 実装に応じてローカル変更の有無確認処理を実装
    return false
  }

  function applyRemoteChange(data: any): void {
    // 実装に応じてリモート変更の適用処理を実装
  }

  function applyMergedChange(data: any): void {
    // 実装に応じて統合変更の適用処理を実装
  }

  function resolveByStrategy(conflict: any): void {
    // 実装に応じて戦略的競合解決処理を実装
  }

  function updateDeviceInfo(deviceData: any): void {
    // 実装に応じてデバイス情報更新処理を実装
  }

  function removeDeviceInfo(deviceData: any): void {
    // 実装に応じてデバイス情報削除処理を実装
  }

  // オンライン状態の監視
  watch(() => navigator.onLine, (isOnline) => {
    syncState.isOnline = isOnline
    if (isOnline && pendingSync.value.length > 0) {
      syncPendingChanges()
    }
  })

  // 初期化
  onMounted(() => {
    initializeSync()
  })

  // クリーンアップ
  onUnmounted(() => {
    // アクティブ状態を無効化
    supabase.client
      .from('user_devices')
      .update({ is_active: false })
      .eq('device_id', currentDevice.value.id)
  })

  return {
    // 状態
    currentDevice,
    connectedDevices,
    syncState,
    syncableData,
    conflicts,
    error,
    
    // 操作
    initializeSync,
    manualSync,
    updateAnalysisProgress,
    updateTripleOSState,
    addPersonalInsight,
    recordChange,
    
    // 計算されたプロパティ
    isConnected: computed(() => syncState.isOnline),
    hasConflicts: computed(() => conflicts.value.length > 0),
    syncStatus: computed(() => {
      if (syncState.isSyncing) return 'syncing'
      if (syncState.pendingChanges > 0) return 'pending'
      if (!syncState.isOnline) return 'offline'
      return 'synchronized'
    })
  }
}

/**
 * 型エクスポート
 */
export type HAQEIMultiDeviceSyncComposable = ReturnType<typeof useMultiDeviceSync>
export type { 
  DeviceInfo,
  SyncState,
  SyncableData,
  AnalysisProgress,
  TripleOSState,
  PersonalInsight
}