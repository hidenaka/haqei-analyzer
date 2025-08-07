/**
 * HAQEI リアルタイムサブスクリプション管理 - HaQei協調診断システム
 * 
 * 目的：
 * - HaQei哲学に基づく協調的診断体験の実現
 * - 複数デバイス間でのリアルタイム状態同期
 * - Triple OS分析の協調的進行管理
 * - 易経64卦に基づく共鳴的な気づきの共有
 * - メモリ効率的なサブスクリプション管理
 * 
 * HaQei哲学の統合：
 * - 個人の複数人格（分人）間の協調
 * - 他者との建設的な相互作用
 * - リアルタイムでの気づきと洞察の共有
 * - 易経的変化の動的観察
 * 
 * 機能：
 * 1. 協調的診断セッション管理
 * 2. リアルタイム進捗同期
 * 3. Triple OS分析の協調的進行
 * 4. 相互支援・コメント機能
 * 5. 易経卦の共鳴的解釈共有
 * 6. マルチデバイス状態同期
 * 
 * 更新: 2025-08-03 - TASK-039実装
 */

import { ref, reactive, computed, watch, onUnmounted, nextTick } from 'vue'
import type { Ref, UnwrapRef } from 'vue'
import { useSupabase, useSupabaseRealtime, getConnectionState } from '@/services/supabase'
import type { 
  Database,
  HAQEIUser,
  HAQEIAnalysisSession,
  HAQEIQuestionResponse,
  RealtimeChannel 
} from '@/types/supabase'

// HaQei協調診断の設定
interface BunenjinCollaborationConfig {
  // 協調レベル設定
  collaborationLevel: 'individual' | 'pairs' | 'small_group' | 'community'
  
  // 相互作用の制御
  allowMutualSupport: boolean
  allowCommentSharing: boolean
  allowProgressSharing: boolean
  allowInsightSharing: boolean
  
  // プライバシー制御
  privacyLevel: 'open' | 'friends_only' | 'invited_only' | 'anonymous'
  shareProgressDetails: boolean
  sharePersonalInsights: boolean
  
  // 易経的共鳴設定
  enableHexagramResonance: boolean
  allowTripleOSComparison: boolean
  enableCollectiveWisdom: boolean
}

// リアルタイム協調状態
interface CollaborativeState {
  // 現在の協調セッション
  sessionId: string | null
  collaborators: CollaboratorInfo[]
  
  // 協調的診断進行
  sharedProgress: SharedProgressState
  mutualSupports: MutualSupportMessage[]
  sharedInsights: SharedInsightMessage[]
  
  // 易経共鳴状態
  hexagramResonance: HexagramResonanceState[]
  collectiveWisdom: CollectiveWisdomEntry[]
}

// 協調者情報
interface CollaboratorInfo {
  id: string
  displayName: string
  avatarColor: string
  currentPhase: string
  progressPercentage: number
  isActive: boolean
  lastSeen: string
}

// 共有進捗状態
interface SharedProgressState {
  totalParticipants: number
  averageProgress: number
  currentPhases: Record<string, number> // phase名と参加者数
  encouragementMessages: string[]
}

// 相互支援メッセージ
interface MutualSupportMessage {
  id: string
  fromUserId: string
  toUserId: string | null // nullの場合は全体向け
  message: string
  messageType: 'encouragement' | 'insight' | 'question' | 'celebration'
  timestamp: string
  phase: string
  reactions: Reaction[]
}

// 共有洞察メッセージ
interface SharedInsightMessage {
  id: string
  userId: string
  insight: string
  relatedHexagram?: number
  osType?: 'engine' | 'interface' | 'safeMode'
  tags: string[]
  timestamp: string
  resonanceCount: number
  comments: InsightComment[]
}

// 易経共鳴状態
interface HexagramResonanceState {
  hexagramNumber: number
  resonanceCount: number
  collectiveInterpretations: string[]
  personalVariations: PersonalHexagramVariation[]
}

// 個人的卦解釈のバリエーション
interface PersonalHexagramVariation {
  userId: string
  interpretation: string
  osContext: 'engine' | 'interface' | 'safeMode'
  emotionalTone: string
  timestamp: string
}

// 集合知エントリ
interface CollectiveWisdomEntry {
  id: string
  topic: string
  insights: string[]
  contributors: string[]
  hexagramConnections: number[]
  emergentPatterns: string[]
  timestamp: string
}

// リアクション
interface Reaction {
  userId: string
  type: 'heart' | 'wise' | 'star' | 'yin' | 'yang'
  timestamp: string
}

// 洞察コメント
interface InsightComment {
  id: string
  userId: string
  comment: string
  timestamp: string
}

// サブスクリプション管理
interface SubscriptionManager {
  channels: Map<string, RealtimeChannel>
  activeSubscriptions: Set<string>
  reconnectAttempts: number
  lastHeartbeat: Date | null
}

/**
 * リアルタイムサブスクリプション管理システム
 * 
 * HaQei哲学に基づく協調的診断体験を実現する核となるcomposable
 */
export function useRealtimeSubscription(userId: string, config?: Partial<BunenjinCollaborationConfig>) {
  const supabase = useSupabase()
  const realtime = useSupabaseRealtime()
  
  // デフォルト設定（HaQei哲学に基づく）
  const defaultConfig: BunenjinCollaborationConfig = {
    collaborationLevel: 'small_group',
    allowMutualSupport: true,
    allowCommentSharing: true,
    allowProgressSharing: true,
    allowInsightSharing: true,
    privacyLevel: 'friends_only',
    shareProgressDetails: true,
    sharePersonalInsights: false, // デフォルトは個人洞察は非共有
    enableHexagramResonance: true,
    allowTripleOSComparison: true,
    enableCollectiveWisdom: true
  }

  const collaborationConfig = reactive({ ...defaultConfig, ...config })
  
  // 接続状態管理
  const connectionState = ref(getConnectionState())
  const isConnected = computed(() => connectionState.value.isSupabaseConnected)
  const isRealtimeActive = ref(false)
  
  // 協調状態管理
  const collaborativeState = reactive<CollaborativeState>({
    sessionId: null,
    collaborators: [],
    sharedProgress: {
      totalParticipants: 0,
      averageProgress: 0,
      currentPhases: {},
      encouragementMessages: []
    },
    mutualSupports: [],
    sharedInsights: [],
    hexagramResonance: [],
    collectiveWisdom: []
  })
  
  // サブスクリプション管理
  const subscriptionManager = reactive<SubscriptionManager>({
    channels: new Map(),
    activeSubscriptions: new Set(),
    reconnectAttempts: 0,
    lastHeartbeat: null
  })
  
  // エラー・ローディング状態
  const error = ref<string | null>(null)
  const isLoading = ref(false)
  
  /**
   * 協調診断セッションの開始
   * 
   * 目的：
   * - HaQei哲学に基づく協調的診断の初期化
   * - リアルタイム同期の開始
   * - 参加者間の相互作用環境準備
   */
  async function startCollaborativeSession(sessionId: string): Promise<boolean> {
    if (!isConnected.value) {
      error.value = 'リアルタイム機能にはインターネット接続が必要です'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      // セッション存在確認
      const { data: session, error: sessionError } = await supabase.client
        .from('analysis_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError || !session) {
        throw new Error('診断セッションが見つかりません')
      }

      collaborativeState.sessionId = sessionId

      // 基本リアルタイムサブスクリプションの設定
      await setupCoreSubscriptions(sessionId)
      
      // 協調機能の有効化
      if (collaborationConfig.allowMutualSupport) {
        await setupMutualSupportSubscriptions(sessionId)
      }
      
      if (collaborationConfig.allowInsightSharing) {
        await setupInsightSharingSubscriptions(sessionId)
      }
      
      if (collaborationConfig.enableHexagramResonance) {
        await setupHexagramResonanceSubscriptions(sessionId)
      }
      
      // 参加者として登録
      await registerAsCollaborator(sessionId)
      
      isRealtimeActive.value = true
      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '協調セッションの開始に失敗しました'
      error.value = errorMessage
      console.error('協調セッション開始エラー:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 基本リアルタイムサブスクリプションの設定
   * 
   * 処理内容：
   * 1. 診断進捗の監視
   * 2. 質問応答のリアルタイム同期
   * 3. Triple OS分析状況の共有
   * 4. 接続状態の監視
   */
  async function setupCoreSubscriptions(sessionId: string) {
    // 診断進捗監視
    const progressChannel = realtime.subscribeToAnalysisProgress(userId, (payload) => {
      handleProgressUpdate(payload)
    })
    subscriptionManager.channels.set('progress', progressChannel)
    subscriptionManager.activeSubscriptions.add('progress')

    // 質問応答監視
    const responseChannel = realtime.subscribeToQuestionResponses(sessionId, (payload) => {
      handleQuestionResponseUpdate(payload)
    })
    subscriptionManager.channels.set('responses', responseChannel)
    subscriptionManager.activeSubscriptions.add('responses')

    // Triple OS完了監視
    const tripleOSChannel = realtime.subscribeToTripleOSComplete(userId, (payload) => {
      handleTripleOSComplete(payload)
    })
    subscriptionManager.channels.set('tripleOS', tripleOSChannel)
    subscriptionManager.activeSubscriptions.add('tripleOS')

    // 協調者状態監視
    const collaboratorChannel = supabase.client
      .channel('collaborators')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_collaborators',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        handleCollaboratorUpdate(payload)
      })
      .subscribe()
    
    subscriptionManager.channels.set('collaborators', collaboratorChannel as any)
    subscriptionManager.activeSubscriptions.add('collaborators')
  }

  /**
   * 相互支援機能のサブスクリプション設定
   */
  async function setupMutualSupportSubscriptions(sessionId: string) {
    const supportChannel = supabase.client
      .channel('mutual_support')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mutual_support_messages',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        handleMutualSupportMessage(payload.new as MutualSupportMessage)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'mutual_support_messages',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        handleMutualSupportUpdate(payload.new as MutualSupportMessage)
      })
      .subscribe()

    subscriptionManager.channels.set('mutualSupport', supportChannel as any)
    subscriptionManager.activeSubscriptions.add('mutualSupport')
  }

  /**
   * 洞察共有機能のサブスクリプション設定
   */
  async function setupInsightSharingSubscriptions(sessionId: string) {
    const insightChannel = supabase.client
      .channel('shared_insights')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'shared_insights',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        handleSharedInsight(payload.new as SharedInsightMessage)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'shared_insights',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        handleInsightUpdate(payload.new as SharedInsightMessage)
      })
      .subscribe()

    subscriptionManager.channels.set('insights', insightChannel as any)
    subscriptionManager.activeSubscriptions.add('insights')
  }

  /**
   * 易経共鳴機能のサブスクリプション設定
   */
  async function setupHexagramResonanceSubscriptions(sessionId: string) {
    const resonanceChannel = supabase.client
      .channel('hexagram_resonance')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'hexagram_resonance',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        handleHexagramResonance(payload)
      })
      .subscribe()

    subscriptionManager.channels.set('resonance', resonanceChannel as any)
    subscriptionManager.activeSubscriptions.add('resonance')
  }

  /**
   * 協調者として登録
   */
  async function registerAsCollaborator(sessionId: string) {
    const collaboratorData = {
      session_id: sessionId,
      user_id: userId,
      display_name: `HaQei_${userId.slice(-6)}`, // 匿名化された表示名
      avatar_color: generateAvatarColor(userId),
      current_phase: 'initial',
      progress_percentage: 0,
      is_active: true,
      last_seen: new Date().toISOString(),
      collaboration_preferences: collaborationConfig
    }

    const { error } = await supabase.client
      .from('session_collaborators')
      .upsert(collaboratorData)

    if (error) {
      throw new Error(`協調者登録エラー: ${error.message}`)
    }
  }

  /**
   * 診断進捗の更新処理
   */
  function handleProgressUpdate(payload: any) {
    if (payload.new) {
      updateSharedProgress(payload.new)
      
      // 進捗に基づく自動励ましメッセージ
      if (collaborationConfig.allowMutualSupport) {
        generateEncouragementMessage(payload.new.progress_percentage)
      }
    }
  }

  /**
   * 質問応答の更新処理
   */
  function handleQuestionResponseUpdate(payload: any) {
    if (payload.new && collaborationConfig.shareProgressDetails) {
      // リアルタイム進捗の更新
      updateCollaboratorProgress(payload.new.user_id, payload.new)
    }
  }

  /**
   * Triple OS分析完了の処理
   */
  function handleTripleOSComplete(payload: any) {
    if (payload.new && collaborationConfig.allowTripleOSComparison) {
      // Triple OS分析結果の共有処理
      shareTripleOSInsight(payload.new)
    }
  }

  /**
   * 協調者状態の更新処理
   */
  function handleCollaboratorUpdate(payload: any) {
    const { eventType, new: newData, old: oldData } = payload

    switch (eventType) {
      case 'INSERT':
        addCollaborator(newData)
        break
      case 'UPDATE':
        updateCollaborator(newData)
        break
      case 'DELETE':
        removeCollaborator(oldData)
        break
    }
  }

  /**
   * 相互支援メッセージの処理
   */
  function handleMutualSupportMessage(message: MutualSupportMessage) {
    collaborativeState.mutualSupports.unshift(message)
    
    // 自分宛のメッセージの場合、通知
    if (message.toUserId === userId || message.toUserId === null) {
      showSupportNotification(message)
    }
  }

  /**
   * 相互支援メッセージの更新処理
   */
  function handleMutualSupportUpdate(message: MutualSupportMessage) {
    const index = collaborativeState.mutualSupports.findIndex(m => m.id === message.id)
    if (index !== -1) {
      collaborativeState.mutualSupports[index] = message
    }
  }

  /**
   * 共有洞察の処理
   */
  function handleSharedInsight(insight: SharedInsightMessage) {
    collaborativeState.sharedInsights.unshift(insight)
    
    // 易経共鳴の更新
    if (insight.relatedHexagram && collaborationConfig.enableHexagramResonance) {
      updateHexagramResonance(insight.relatedHexagram, insight)
    }
  }

  /**
   * 洞察更新の処理
   */
  function handleInsightUpdate(insight: SharedInsightMessage) {
    const index = collaborativeState.sharedInsights.findIndex(i => i.id === insight.id)
    if (index !== -1) {
      collaborativeState.sharedInsights[index] = insight
    }
  }

  /**
   * 易経共鳴の処理
   */
  function handleHexagramResonance(payload: any) {
    const { eventType, new: newData } = payload
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      updateResonanceState(newData)
    }
  }

  /**
   * 共有進捗の更新
   */
  function updateSharedProgress(progressData: any) {
    // 平均進捗の計算
    const collaboratorProgresses = collaborativeState.collaborators
      .map(c => c.progressPercentage)
      .filter(p => p > 0)
    
    if (collaboratorProgresses.length > 0) {
      collaborativeState.sharedProgress.averageProgress = 
        collaboratorProgresses.reduce((sum, p) => sum + p, 0) / collaboratorProgresses.length
    }
    
    // フェーズ分布の更新
    const phaseDistribution: Record<string, number> = {}
    collaborativeState.collaborators.forEach(collaborator => {
      phaseDistribution[collaborator.currentPhase] = 
        (phaseDistribution[collaborator.currentPhase] || 0) + 1
    })
    collaborativeState.sharedProgress.currentPhases = phaseDistribution
  }

  /**
   * 協調者の追加
   */
  function addCollaborator(collaboratorData: any) {
    const collaborator: CollaboratorInfo = {
      id: collaboratorData.user_id,
      displayName: collaboratorData.display_name,
      avatarColor: collaboratorData.avatar_color,
      currentPhase: collaboratorData.current_phase,
      progressPercentage: collaboratorData.progress_percentage,
      isActive: collaboratorData.is_active,
      lastSeen: collaboratorData.last_seen
    }
    
    const existingIndex = collaborativeState.collaborators.findIndex(c => c.id === collaborator.id)
    if (existingIndex === -1) {
      collaborativeState.collaborators.push(collaborator)
      collaborativeState.sharedProgress.totalParticipants++
    }
  }

  /**
   * 協調者の更新
   */
  function updateCollaborator(collaboratorData: any) {
    const index = collaborativeState.collaborators.findIndex(c => c.id === collaboratorData.user_id)
    if (index !== -1) {
      collaborativeState.collaborators[index] = {
        id: collaboratorData.user_id,
        displayName: collaboratorData.display_name,
        avatarColor: collaboratorData.avatar_color,
        currentPhase: collaboratorData.current_phase,
        progressPercentage: collaboratorData.progress_percentage,
        isActive: collaboratorData.is_active,
        lastSeen: collaboratorData.last_seen
      }
    }
  }

  /**
   * 協調者の削除
   */
  function removeCollaborator(collaboratorData: any) {
    const index = collaborativeState.collaborators.findIndex(c => c.id === collaboratorData.user_id)
    if (index !== -1) {
      collaborativeState.collaborators.splice(index, 1)
      collaborativeState.sharedProgress.totalParticipants--
    }
  }

  /**
   * 協調者進捗の更新
   */
  function updateCollaboratorProgress(collaboratorUserId: string, responseData: any) {
    const collaborator = collaborativeState.collaborators.find(c => c.id === collaboratorUserId)
    if (collaborator) {
      // 進捗計算（質問数から推定）
      const estimatedProgress = (responseData.question_sequence / 30) * 100
      collaborator.progressPercentage = Math.min(estimatedProgress, 100)
      collaborator.lastSeen = new Date().toISOString()
    }
  }

  /**
   * 励ましメッセージの生成
   */
  function generateEncouragementMessage(progressPercentage: number) {
    const messages = {
      25: 'いい調子ですね！自分の内なる多様性を探求し続けてください 🌱',
      50: '半分まで来ました！異なる分人たちの声を聞いてみましょう ⚖️',
      75: 'もうすぐ完了です！Triple OSの相互作用に注目してみてください 🔄',
      100: '診断完了おめでとうございます！新しい自己理解の扉が開かれました ✨'
    }
    
    const milestone = Math.floor(progressPercentage / 25) * 25
    const message = messages[milestone as keyof typeof messages]
    
    if (message && !collaborativeState.sharedProgress.encouragementMessages.includes(message)) {
      collaborativeState.sharedProgress.encouragementMessages.push(message)
    }
  }

  /**
   * Triple OS洞察の共有
   */
  async function shareTripleOSInsight(tripleOSData: any) {
    if (!collaborationConfig.sharePersonalInsights) return

    const insight = generateTripleOSInsight(tripleOSData)
    if (insight) {
      await sendSharedInsight(insight, tripleOSData.related_hexagram)
    }
  }

  /**
   * Triple OS洞察の生成
   */
  function generateTripleOSInsight(tripleOSData: any): string | null {
    const osTypes = ['engine', 'interface', 'safeMode']
    const dominantOS = osTypes.find(os => tripleOSData[`${os}_strength`] > 70)
    
    if (dominantOS) {
      const insights = {
        engine: 'あなたの本質的な価値観が強く現れていますね。内なる動力を大切にしてください。',
        interface: '社会的な調和を重視する姿勢が見えます。他者との関係性を活かしましょう。',
        safeMode: '安全性を重視する慎重さが特徴です。その守りの力を活用してみてください。'
      }
      
      return insights[dominantOS as keyof typeof insights]
    }
    
    return null
  }

  /**
   * 易経共鳴の更新
   */
  function updateHexagramResonance(hexagramNumber: number, insight: SharedInsightMessage) {
    let resonance = collaborativeState.hexagramResonance.find(r => r.hexagramNumber === hexagramNumber)
    
    if (!resonance) {
      resonance = {
        hexagramNumber,
        resonanceCount: 0,
        collectiveInterpretations: [],
        personalVariations: []
      }
      collaborativeState.hexagramResonance.push(resonance)
    }
    
    resonance.resonanceCount++
    
    if (insight.insight && !resonance.collectiveInterpretations.includes(insight.insight)) {
      resonance.collectiveInterpretations.push(insight.insight)
    }
    
    const personalVariation: PersonalHexagramVariation = {
      userId: insight.userId,
      interpretation: insight.insight,
      osContext: insight.osType || 'engine',
      emotionalTone: extractEmotionalTone(insight.insight),
      timestamp: insight.timestamp
    }
    
    resonance.personalVariations.push(personalVariation)
  }

  /**
   * 感情的トーンの抽出
   */
  function extractEmotionalTone(text: string): string {
    const positiveKeywords = ['嬉しい', '楽しい', '希望', '明るい', '前向き']
    const contemplativeKeywords = ['考える', '深い', '静か', '瞑想', '内省']
    const challengingKeywords = ['困難', '挑戦', '変化', '成長', '学び']
    
    if (positiveKeywords.some(keyword => text.includes(keyword))) return 'positive'
    if (contemplativeKeywords.some(keyword => text.includes(keyword))) return 'contemplative'
    if (challengingKeywords.some(keyword => text.includes(keyword))) return 'challenging'
    
    return 'neutral'
  }

  /**
   * 共有洞察の送信
   */
  async function sendSharedInsight(insight: string, hexagramNumber?: number): Promise<boolean> {
    if (!collaborativeState.sessionId) return false

    try {
      const insightData = {
        session_id: collaborativeState.sessionId,
        user_id: userId,
        insight,
        related_hexagram: hexagramNumber,
        tags: extractTags(insight),
        timestamp: new Date().toISOString(),
        resonance_count: 0,
        comments: []
      }

      const { error } = await supabase.client
        .from('shared_insights')
        .insert(insightData)

      return !error
    } catch (err) {
      console.error('洞察共有エラー:', err)
      return false
    }
  }

  /**
   * 相互支援メッセージの送信
   */
  async function sendMutualSupport(
    message: string,
    messageType: 'encouragement' | 'insight' | 'question' | 'celebration',
    targetUserId?: string
  ): Promise<boolean> {
    if (!collaborativeState.sessionId) return false

    try {
      const supportData = {
        session_id: collaborativeState.sessionId,
        from_user_id: userId,
        to_user_id: targetUserId || null,
        message,
        message_type: messageType,
        timestamp: new Date().toISOString(),
        phase: getCurrentPhase(),
        reactions: []
      }

      const { error } = await supabase.client
        .from('mutual_support_messages')
        .insert(supportData)

      return !error
    } catch (err) {
      console.error('相互支援メッセージ送信エラー:', err)
      return false
    }
  }

  /**
   * 洞察にリアクションを追加
   */
  async function addInsightReaction(
    insightId: string, 
    reactionType: 'heart' | 'wise' | 'star' | 'yin' | 'yang'
  ): Promise<boolean> {
    try {
      const { data: insight, error: fetchError } = await supabase.client
        .from('shared_insights')
        .select('*')
        .eq('id', insightId)
        .single()

      if (fetchError || !insight) return false

      const existingReactions = insight.reactions || []
      const userReaction = existingReactions.find((r: Reaction) => r.userId === userId)

      if (userReaction) {
        // 既存のリアクションを更新
        userReaction.type = reactionType
        userReaction.timestamp = new Date().toISOString()
      } else {
        // 新しいリアクションを追加
        existingReactions.push({
          userId,
          type: reactionType,
          timestamp: new Date().toISOString()
        })
      }

      const { error } = await supabase.client
        .from('shared_insights')
        .update({ 
          reactions: existingReactions,
          resonance_count: existingReactions.length
        })
        .eq('id', insightId)

      return !error
    } catch (err) {
      console.error('リアクション追加エラー:', err)
      return false
    }
  }

  /**
   * 進捗の更新通知
   */
  async function updateProgress(phase: string, progressPercentage: number): Promise<boolean> {
    if (!collaborativeState.sessionId) return false

    try {
      const { error } = await supabase.client
        .from('session_collaborators')
        .update({
          current_phase: phase,
          progress_percentage: progressPercentage,
          last_seen: new Date().toISOString()
        })
        .eq('session_id', collaborativeState.sessionId)
        .eq('user_id', userId)

      return !error
    } catch (err) {
      console.error('進捗更新エラー:', err)
      return false
    }
  }

  /**
   * 協調セッションの終了
   */
  async function endCollaborativeSession(): Promise<boolean> {
    try {
      // すべてのサブスクリプションを解除
      subscriptionManager.channels.forEach((channel, key) => {
        channel.unsubscribe()
        subscriptionManager.activeSubscriptions.delete(key)
      })
      subscriptionManager.channels.clear()

      // 協調者ステータスを非アクティブに
      if (collaborativeState.sessionId) {
        await supabase.client
          .from('session_collaborators')
          .update({ is_active: false })
          .eq('session_id', collaborativeState.sessionId)
          .eq('user_id', userId)
      }

      // 状態リセット
      collaborativeState.sessionId = null
      collaborativeState.collaborators = []
      collaborativeState.mutualSupports = []
      collaborativeState.sharedInsights = []
      collaborativeState.hexagramResonance = []
      
      isRealtimeActive.value = false
      return true
    } catch (err) {
      console.error('協調セッション終了エラー:', err)
      return false
    }
  }

  /**
   * ユーティリティ関数
   */
  function generateAvatarColor(userId: string): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
    const index = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  function extractTags(text: string): string[] {
    const keywords = ['分人', 'HaQei', 'triple', 'os', '易経', '卦', '陰陽', '調和', '成長', '洞察']
    return keywords.filter(keyword => text.toLowerCase().includes(keyword.toLowerCase()))
  }

  function getCurrentPhase(): string {
    // 現在のフェーズを取得（実装に応じて調整）
    return 'analysis'
  }

  function showSupportNotification(message: MutualSupportMessage) {
    // Vue 3アプリ側での通知表示（実装に応じて調整）
    window.dispatchEvent(new CustomEvent('haqei:support-message', {
      detail: message
    }))
  }

  function updateResonanceState(resonanceData: any) {
    // 易経共鳴状態の更新処理
    const hexagramNumber = resonanceData.hexagram_number
    const existingIndex = collaborativeState.hexagramResonance.findIndex(r => r.hexagramNumber === hexagramNumber)
    
    if (existingIndex !== -1) {
      collaborativeState.hexagramResonance[existingIndex] = {
        ...collaborativeState.hexagramResonance[existingIndex],
        ...resonanceData
      }
    }
  }

  // 接続状態の監視
  watch(() => getConnectionState(), (newState) => {
    connectionState.value = newState
    
    // 接続が復旧したら再接続試行
    if (newState.isSupabaseConnected && !isRealtimeActive.value && collaborativeState.sessionId) {
      startCollaborativeSession(collaborativeState.sessionId)
    }
  }, { deep: true })

  // コンポーネントアンマウント時のクリーンアップ
  onUnmounted(() => {
    endCollaborativeSession()
  })

  return {
    // 状態
    isConnected,
    isRealtimeActive,
    isLoading,
    error,
    collaborationConfig,
    collaborativeState,
    
    // 協調セッション管理
    startCollaborativeSession,
    endCollaborativeSession,
    updateProgress,
    
    // 相互作用機能
    sendMutualSupport,
    sendSharedInsight,
    addInsightReaction,
    
    // 計算されたプロパティ
    activeCollaborators: computed(() => 
      collaborativeState.collaborators.filter(c => c.isActive)
    ),
    
    averageProgress: computed(() => 
      collaborativeState.sharedProgress.averageProgress
    ),
    
    totalParticipants: computed(() => 
      collaborativeState.sharedProgress.totalParticipants
    ),
    
    recentInsights: computed(() => 
      collaborativeState.sharedInsights.slice(0, 10)
    ),
    
    topResonantHexagrams: computed(() => 
      collaborativeState.hexagramResonance
        .sort((a, b) => b.resonanceCount - a.resonanceCount)
        .slice(0, 5)
    )
  }
}

/**
 * 型エクスポート
 */
export type HAQEIRealtimeSubscriptionComposable = ReturnType<typeof useRealtimeSubscription>
export type { 
  BunenjinCollaborationConfig,
  CollaborativeState,
  CollaboratorInfo,
  MutualSupportMessage,
  SharedInsightMessage,
  HexagramResonanceState
}