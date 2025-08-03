/**
 * HAQEI 協調的診断体験システム - bunenjin哲学の実現
 * 
 * 目的：
 * - bunenjin哲学に基づく複数人での診断支援
 * - 相互理解と気づきの共有
 * - Triple OS分析の協調的進行
 * - 易経的共鳴による深い洞察の創発
 * - プライバシーを保持した建設的相互作用
 * 
 * bunenjin哲学の核心：
 * - 個人の複数人格（分人）の相互理解
 * - 他者との関係性で現れる異なる自己の発見
 * - 社会的文脈での人格の動的変化
 * - 相互支援による成長と気づき
 * 
 * 協調診断の特徴：
 * 1. ペア診断：親密な関係での相互理解
 * 2. 小グループ診断：多様な視点からの洞察
 * 3. 匿名コミュニティ：安全な環境での支援
 * 4. メンター制度：経験者からの指導
 * 5. 易経的共鳴：集合的知恵の活用
 * 
 * 更新: 2025-08-03 - TASK-039実装
 */

import { ref, reactive, computed, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { useMultiDeviceSync } from './useMultiDeviceSync'
import { useSupabase } from '@/services/supabase'
import type { 
  BunenjinCollaborationConfig,
  MutualSupportMessage,
  SharedInsightMessage,
  HexagramResonanceState 
} from './useRealtimeSubscription'

// 協調診断のモード
type CollaborativeModeType = 
  | 'individual' // 個人診断（基本）
  | 'pair_mutual' // ペア相互診断
  | 'small_group' // 小グループ（3-5人）
  | 'community_anonymous' // 匿名コミュニティ
  | 'mentor_guided' // メンター指導型

// 協調診断セッション
interface CollaborativeDiagnosisSession {
  id: string
  mode: CollaborativeModeType
  title: string
  description: string
  maxParticipants: number
  currentParticipants: CollaborativeParticipant[]
  privacy: 'open' | 'invite_only' | 'anonymous'
  duration: number // 分
  startTime: string
  endTime?: string
  status: 'waiting' | 'active' | 'completed' | 'cancelled'
  facilitator?: string
  guidelines: string[]
  insights: CollaborativeInsight[]
  hexagramResonance: HexagramResonanceState[]
}

// 協調参加者
interface CollaborativeParticipant {
  id: string
  displayName: string
  role: 'participant' | 'facilitator' | 'mentor' | 'observer'
  avatar: ParticipantAvatar
  status: 'active' | 'away' | 'thinking' | 'sharing'
  progress: ParticipantProgress
  preferences: ParticipantPreferences
  contributions: ContributionStats
}

// 参加者アバター
interface ParticipantAvatar {
  color: string
  symbol: string // 易経・五行・四神などの象徴
  energy: 'yin' | 'yang' | 'balanced' // 現在のエネルギー状態
}

// 参加者進捗
interface ParticipantProgress {
  currentPhase: string
  questionsAnswered: number
  totalQuestions: number
  timeSpent: number
  lastActivity: string
  milestones: string[]
}

// 参加者設定
interface ParticipantPreferences {
  shareProgress: boolean
  receiveSupport: boolean
  offerSupport: boolean
  shareInsights: boolean
  allowMentoring: boolean
  communicationStyle: 'direct' | 'gentle' | 'philosophical' | 'encouraging'
}

// 貢献統計
interface ContributionStats {
  supportMessagesGiven: number
  supportMessagesReceived: number
  insightsShared: number
  insightReactions: number
  mentoringSessions: number
  helpfulVotes: number
}

// 協調的洞察
interface CollaborativeInsight {
  id: string
  content: string
  author: string
  recipients: string[] // 対象者（空の場合は全体）
  type: 'personal_sharing' | 'mutual_reflection' | 'group_wisdom' | 'mentor_guidance'
  relatedHexagram?: number
  osContext: 'engine' | 'interface' | 'safeMode' | 'integration'
  emergentPatterns: string[]
  resonanceLevel: number
  timestamp: string
  reactions: InsightReaction[]
  responses: InsightResponse[]
}

// 洞察反応
interface InsightReaction {
  userId: string
  type: 'resonance' | 'gratitude' | 'question' | 'expansion'
  intensity: 1 | 2 | 3 | 4 | 5
  timestamp: string
}

// 洞察応答
interface InsightResponse {
  id: string
  userId: string
  content: string
  type: 'clarification' | 'expansion' | 'alternative_view' | 'support'
  timestamp: string
}

// 相互作用パターン
interface InteractionPattern {
  pattern: 'mirroring' | 'complementary' | 'challenging' | 'nurturing'
  participants: string[]
  strength: number
  emergentInsights: string[]
  hexagramConnection?: number
}

// ファシリテーション指針
interface FacilitationGuideline {
  phase: string
  guideline: string
  purpose: string
  timing: string
  examples: string[]
}

/**
 * 協調的診断体験システム
 * 
 * bunenjin哲学を実践する相互支援・相互理解プラットフォーム
 */
export function useCollaborativeDiagnosis(userId: string, config?: Partial<BunenjinCollaborationConfig>) {
  const supabase = useSupabase()
  const realtimeSubscription = useRealtimeSubscription(userId, config)
  const multiDeviceSync = useMultiDeviceSync(userId)
  
  // 現在のセッション状態
  const currentSession = ref<CollaborativeDiagnosisSession | null>(null)
  const myParticipant = ref<CollaborativeParticipant | null>(null)
  
  // 利用可能セッション
  const availableSessions = ref<CollaborativeDiagnosisSession[]>([])
  
  // 相互作用状態
  const activeInteractions = ref<InteractionPattern[]>([])
  const pendingSupport = ref<MutualSupportMessage[]>([])
  const sharedInsights = ref<CollaborativeInsight[]>([])
  
  // ファシリテーション
  const facilitationGuidelines = ref<FacilitationGuideline[]>([])
  const currentPhaseGuidance = ref<string>('')
  
  // ステータス管理
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const connectionStatus = ref<'connected' | 'connecting' | 'disconnected'>('disconnected')

  /**
   * 協調診断システムの初期化
   */
  async function initializeCollaborativeDiagnosis(): Promise<boolean> {
    try {
      isLoading.value = true
      error.value = null

      // 参加者プロフィールの初期化
      await initializeParticipantProfile()
      
      // 利用可能セッションの取得
      await loadAvailableSessions()
      
      // ファシリテーション指針の読み込み
      await loadFacilitationGuidelines()
      
      // リアルタイム機能の初期化
      await realtimeSubscription.startCollaborativeSession('default')
      
      connectionStatus.value = 'connected'
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '協調診断の初期化に失敗しました'
      error.value = errorMessage
      console.error('協調診断初期化エラー:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 参加者プロフィールの初期化
   */
  async function initializeParticipantProfile(): Promise<void> {
    const avatar = generateParticipantAvatar(userId)
    
    myParticipant.value = {
      id: userId,
      displayName: generateAnonymousName(),
      role: 'participant',
      avatar,
      status: 'active',
      progress: {
        currentPhase: 'initial',
        questionsAnswered: 0,
        totalQuestions: 30,
        timeSpent: 0,
        lastActivity: new Date().toISOString(),
        milestones: []
      },
      preferences: {
        shareProgress: true,
        receiveSupport: true,
        offerSupport: true,
        shareInsights: false, // デフォルトは非共有（bunenjin哲学：段階的開示）
        allowMentoring: true,
        communicationStyle: 'encouraging'
      },
      contributions: {
        supportMessagesGiven: 0,
        supportMessagesReceived: 0,
        insightsShared: 0,
        insightReactions: 0,
        mentoringSessions: 0,
        helpfulVotes: 0
      }
    }
  }

  /**
   * 利用可能セッションの読み込み
   */
  async function loadAvailableSessions(): Promise<void> {
    const { data: sessions, error: fetchError } = await supabase.client
      .from('collaborative_sessions')
      .select('*')
      .in('status', ['waiting', 'active'])
      .order('start_time', { ascending: true })

    if (fetchError) {
      throw new Error(`セッション取得エラー: ${fetchError.message}`)
    }

    if (sessions) {
      availableSessions.value = sessions.map(session => ({
        id: session.id,
        mode: session.mode,
        title: session.title,
        description: session.description,
        maxParticipants: session.max_participants,
        currentParticipants: session.participants || [],
        privacy: session.privacy,
        duration: session.duration,
        startTime: session.start_time,
        endTime: session.end_time,
        status: session.status,
        facilitator: session.facilitator,
        guidelines: session.guidelines || [],
        insights: session.insights || [],
        hexagramResonance: session.hexagram_resonance || []
      }))
    }
  }

  /**
   * ファシリテーション指針の読み込み
   */
  async function loadFacilitationGuidelines(): Promise<void> {
    facilitationGuidelines.value = [
      {
        phase: 'initial',
        guideline: '参加者の心理的安全性を確保し、オープンな雰囲気を作りましょう',
        purpose: '信頼関係の構築',
        timing: 'セッション開始時',
        examples: [
          '「今日は皆さんと一緒に自己理解の旅を歩めることを嬉しく思います」',
          '「どんな気づきも大切で、判断されることはありません」',
          '「自分のペースで進めて大丈夫です」'
        ]
      },
      {
        phase: 'early_analysis',
        guideline: '初期の気づきを優しく受け止め、励ましを提供しましょう',
        purpose: '自己探求への動機づけ',
        timing: '診断開始〜25%進行時',
        examples: [
          '「素晴らしい洞察ですね。その感覚をもう少し詳しく聞かせてください」',
          '「皆さんも似たような体験はありませんか？」',
          '「その違和感も大切な情報ですね」'
        ]
      },
      {
        phase: 'mid_analysis',
        guideline: 'Triple OSの違いを尊重し、多様性を称賛しましょう',
        purpose: '個性の承認と相互理解',
        timing: '25%〜75%進行時',
        examples: [
          '「Engine OSが強い方とInterface OSが強い方で見え方が違うのは自然なことです」',
          '「その対照的な視点から新しい気づきが生まれそうですね」',
          '「お互いの強みを活かし合えるかもしれません」'
        ]
      },
      {
        phase: 'near_completion',
        guideline: '統合的な理解を促進し、今後の成長を支援しましょう',
        purpose: '統合と未来志向',
        timing: '75%〜完了時',
        examples: [
          '「これらの発見をどう日常に活かしていけそうですか？」',
          '「今日の体験で一番印象的だったことは何でしょうか？」',
          '「お互いから学んだことを教えてください」'
        ]
      }
    ]
  }

  /**
   * 協調診断セッションの作成
   */
  async function createCollaborativeSession(
    mode: CollaborativeModeType,
    title: string,
    description: string,
    maxParticipants: number = 5
  ): Promise<CollaborativeDiagnosisSession | null> {
    try {
      const sessionData = {
        mode,
        title,
        description,
        max_participants: maxParticipants,
        privacy: 'invite_only' as const,
        duration: 90, // 90分
        start_time: new Date().toISOString(),
        status: 'waiting' as const,
        facilitator: userId,
        guidelines: getDefaultGuidelines(mode),
        participants: [myParticipant.value],
        insights: [],
        hexagram_resonance: []
      }

      const { data: session, error: createError } = await supabase.client
        .from('collaborative_sessions')
        .insert(sessionData)
        .select()
        .single()

      if (createError) {
        throw new Error(createError.message)
      }

      const newSession: CollaborativeDiagnosisSession = {
        id: session.id,
        mode: session.mode,
        title: session.title,
        description: session.description,
        maxParticipants: session.max_participants,
        currentParticipants: session.participants,
        privacy: session.privacy,
        duration: session.duration,
        startTime: session.start_time,
        status: session.status,
        facilitator: session.facilitator,
        guidelines: session.guidelines,
        insights: [],
        hexagramResonance: []
      }

      availableSessions.value.unshift(newSession)
      return newSession
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'セッション作成に失敗しました'
      return null
    }
  }

  /**
   * セッションへの参加
   */
  async function joinSession(sessionId: string): Promise<boolean> {
    try {
      const session = availableSessions.value.find(s => s.id === sessionId)
      if (!session) {
        throw new Error('セッションが見つかりません')
      }

      if (session.currentParticipants.length >= session.maxParticipants) {
        throw new Error('セッションの定員に達しています')
      }

      // 参加者として追加
      const updatedParticipants = [...session.currentParticipants, myParticipant.value!]
      
      const { error: updateError } = await supabase.client
        .from('collaborative_sessions')
        .update({ participants: updatedParticipants })
        .eq('id', sessionId)

      if (updateError) {
        throw new Error(updateError.message)
      }

      currentSession.value = session
      session.currentParticipants = updatedParticipants

      // リアルタイム同期の開始
      await realtimeSubscription.startCollaborativeSession(sessionId)
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'セッション参加に失敗しました'
      return false
    }
  }

  /**
   * 相互支援メッセージの送信
   */
  async function sendSupportMessage(
    content: string,
    type: 'encouragement' | 'insight' | 'question' | 'celebration',
    targetUserId?: string
  ): Promise<boolean> {
    if (!currentSession.value || !myParticipant.value) return false

    const success = await realtimeSubscription.sendMutualSupport(content, type, targetUserId)
    
    if (success) {
      myParticipant.value.contributions.supportMessagesGiven++
      updateParticipantProgress()
    }
    
    return success
  }

  /**
   * 洞察の共有
   */
  async function shareInsight(
    content: string,
    type: 'personal_sharing' | 'mutual_reflection' | 'group_wisdom',
    relatedHexagram?: number,
    osContext: 'engine' | 'interface' | 'safeMode' | 'integration' = 'integration'
  ): Promise<boolean> {
    if (!currentSession.value || !myParticipant.value) return false

    const insight: CollaborativeInsight = {
      id: crypto.randomUUID(),
      content,
      author: userId,
      recipients: [], // 全体共有
      type,
      relatedHexagram,
      osContext,
      emergentPatterns: extractEmergentPatterns(content),
      resonanceLevel: 0,
      timestamp: new Date().toISOString(),
      reactions: [],
      responses: []
    }

    const success = await realtimeSubscription.sendSharedInsight(content, relatedHexagram)
    
    if (success) {
      sharedInsights.value.unshift(insight)
      myParticipant.value.contributions.insightsShared++
      updateParticipantProgress()
    }
    
    return success
  }

  /**
   * 洞察への反応
   */
  async function reactToInsight(
    insightId: string,
    type: 'resonance' | 'gratitude' | 'question' | 'expansion',
    intensity: 1 | 2 | 3 | 4 | 5 = 3
  ): Promise<boolean> {
    if (!myParticipant.value) return false

    const insight = sharedInsights.value.find(i => i.id === insightId)
    if (!insight) return false

    const reaction: InsightReaction = {
      userId,
      type,
      intensity,
      timestamp: new Date().toISOString()
    }

    insight.reactions.push(reaction)
    insight.resonanceLevel = calculateResonanceLevel(insight.reactions)

    myParticipant.value.contributions.insightReactions++
    updateParticipantProgress()

    // Supabaseへの同期
    return await realtimeSubscription.addInsightReaction(insightId, type as any)
  }

  /**
   * 洞察への応答
   */
  async function respondToInsight(
    insightId: string,
    content: string,
    type: 'clarification' | 'expansion' | 'alternative_view' | 'support'
  ): Promise<boolean> {
    const insight = sharedInsights.value.find(i => i.id === insightId)
    if (!insight) return false

    const response: InsightResponse = {
      id: crypto.randomUUID(),
      userId,
      content,
      type,
      timestamp: new Date().toISOString()
    }

    insight.responses.push(response)
    return true
  }

  /**
   * 進捗の更新
   */
  async function updateProgress(
    phase: string,
    questionsAnswered: number,
    timeSpent: number
  ): Promise<void> {
    if (!myParticipant.value) return

    const oldPhase = myParticipant.value.progress.currentPhase
    
    myParticipant.value.progress = {
      ...myParticipant.value.progress,
      currentPhase: phase,
      questionsAnswered,
      timeSpent,
      lastActivity: new Date().toISOString()
    }

    // マイルストーンの追加
    if (phase !== oldPhase) {
      myParticipant.value.progress.milestones.push(`${phase}_reached_at_${new Date().toISOString()}`)
    }

    // リアルタイム同期
    await realtimeSubscription.updateProgress(phase, (questionsAnswered / 30) * 100)
    
    // ファシリテーション指針の更新
    updateCurrentPhaseGuidance(phase)
  }

  /**
   * 現在フェーズのガイダンス更新
   */
  function updateCurrentPhaseGuidance(phase: string): void {
    const guideline = facilitationGuidelines.value.find(g => g.phase === phase)
    if (guideline) {
      currentPhaseGuidance.value = guideline.guideline
    }
  }

  /**
   * 相互作用パターンの分析
   */
  function analyzeInteractionPatterns(): void {
    if (!currentSession.value) return

    const participants = currentSession.value.currentParticipants
    const insights = sharedInsights.value

    // パターン検出のロジック
    const patterns: InteractionPattern[] = []

    // ミラーリングパターン：似たような洞察を共有する参加者
    const mirroringGroups = findMirroringPatterns(participants, insights)
    mirroringGroups.forEach(group => {
      patterns.push({
        pattern: 'mirroring',
        participants: group.members,
        strength: group.similarity,
        emergentInsights: group.commonThemes,
        hexagramConnection: group.relatedHexagram
      })
    })

    // 相補的パターン：異なるOS強度で補完し合う参加者
    const complementaryPairs = findComplementaryPatterns(participants)
    complementaryPairs.forEach(pair => {
      patterns.push({
        pattern: 'complementary',
        participants: pair.members,
        strength: pair.complementarity,
        emergentInsights: pair.synergies,
        hexagramConnection: pair.relatedHexagram
      })
    })

    activeInteractions.value = patterns
  }

  /**
   * セッションの完了
   */
  async function completeSession(): Promise<boolean> {
    if (!currentSession.value) return false

    try {
      // 最終洞察の生成
      const finalInsights = generateSessionSummary()
      
      // セッション完了の記録
      const { error: updateError } = await supabase.client
        .from('collaborative_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString(),
          final_insights: finalInsights
        })
        .eq('id', currentSession.value.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // リアルタイム同期の終了
      await realtimeSubscription.endCollaborativeSession()
      
      currentSession.value = null
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'セッション完了に失敗しました'
      return false
    }
  }

  /**
   * ユーティリティ関数
   */
  function generateParticipantAvatar(userId: string): ParticipantAvatar {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
    const symbols = ['乾', '坤', '震', '巽', '坎', '離', '艮', '兌'] // 八卦
    const energies: ('yin' | 'yang' | 'balanced')[] = ['yin', 'yang', 'balanced']
    
    const index = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    
    return {
      color: colors[index % colors.length],
      symbol: symbols[index % symbols.length],
      energy: energies[index % energies.length]
    }
  }

  function generateAnonymousName(): string {
    const adjectives = ['思慮深い', '温かい', '洞察力のある', '共感的な', '創造的な', '静かな', '活発な', '知的な']
    const nouns = ['探求者', '歩行者', '思索者', '発見者', '理解者', '学習者', '成長者', '変化者']
    
    const adjIndex = Math.floor(Math.random() * adjectives.length)
    const nounIndex = Math.floor(Math.random() * nouns.length)
    
    return `${adjectives[adjIndex]}${nouns[nounIndex]}`
  }

  function getDefaultGuidelines(mode: CollaborativeModeType): string[] {
    const baseGuidelines = [
      'お互いの経験を尊重し、判断を控えましょう',
      '自分のペースで進めることを大切にしましょう',
      '異なる視点を歓迎し、多様性を称賛しましょう',
      'プライバシーを尊重し、適切な境界を保ちましょう'
    ]

    const modeSpecificGuidelines = {
      individual: [],
      pair_mutual: [
        '相手の発見を祝福し、共に成長を喜びましょう',
        '違いを通して新しい自分を発見しましょう'
      ],
      small_group: [
        '全員が発言できるよう配慮しましょう',
        '集合知を活用し、個人を超えた洞察を探求しましょう'
      ],
      community_anonymous: [
        '匿名性を活用し、普段話せないことも共有してみましょう',
        'コミュニティ全体の成長に貢献しましょう'
      ],
      mentor_guided: [
        'メンターの経験を活用し、深い学びを得ましょう',
        '質問を恐れず、積極的に学習しましょう'
      ]
    }

    return [...baseGuidelines, ...modeSpecificGuidelines[mode]]
  }

  function extractEmergentPatterns(content: string): string[] {
    const patterns: string[] = []
    
    // 自己言及パターン
    if (content.includes('自分') || content.includes('私')) {
      patterns.push('自己認識')
    }
    
    // 関係性パターン
    if (content.includes('他者') || content.includes('関係')) {
      patterns.push('関係性意識')
    }
    
    // 変化パターン
    if (content.includes('変化') || content.includes('成長')) {
      patterns.push('変化受容')
    }
    
    // 統合パターン
    if (content.includes('統合') || content.includes('バランス')) {
      patterns.push('統合思考')
    }
    
    return patterns
  }

  function calculateResonanceLevel(reactions: InsightReaction[]): number {
    if (reactions.length === 0) return 0
    
    const totalIntensity = reactions.reduce((sum, r) => sum + r.intensity, 0)
    return Math.min(100, (totalIntensity / reactions.length) * 20)
  }

  function findMirroringPatterns(participants: CollaborativeParticipant[], insights: CollaborativeInsight[]): any[] {
    // ミラーリングパターンの検出ロジック（簡化）
    return []
  }

  function findComplementaryPatterns(participants: CollaborativeParticipant[]): any[] {
    // 相補的パターンの検出ロジック（簡化）
    return []
  }

  function generateSessionSummary(): string[] {
    const insights: string[] = []
    
    if (sharedInsights.value.length > 0) {
      insights.push('参加者間で豊かな洞察の交換が行われました')
    }
    
    if (activeInteractions.value.length > 0) {
      insights.push('相互作用により新しいパターンが発見されました')
    }
    
    return insights
  }

  function updateParticipantProgress(): void {
    if (currentSession.value && myParticipant.value) {
      const participantIndex = currentSession.value.currentParticipants.findIndex(p => p.id === userId)
      if (participantIndex !== -1) {
        currentSession.value.currentParticipants[participantIndex] = myParticipant.value
      }
    }
  }

  return {
    // 状態
    currentSession,
    myParticipant,
    availableSessions,
    activeInteractions,
    pendingSupport,
    sharedInsights,
    facilitationGuidelines,
    currentPhaseGuidance,
    isLoading,
    error,
    connectionStatus,
    
    // 操作
    initializeCollaborativeDiagnosis,
    createCollaborativeSession,
    joinSession,
    sendSupportMessage,
    shareInsight,
    reactToInsight,
    respondToInsight,
    updateProgress,
    completeSession,
    analyzeInteractionPatterns,
    
    // 計算されたプロパティ
    canCreateSession: computed(() => myParticipant.value?.role !== 'observer'),
    hasActiveSession: computed(() => currentSession.value !== null),
    myContributions: computed(() => myParticipant.value?.contributions),
    sessionProgress: computed(() => {
      if (!currentSession.value) return 0
      const totalParticipants = currentSession.value.currentParticipants.length
      const avgProgress = currentSession.value.currentParticipants
        .reduce((sum, p) => sum + (p.progress.questionsAnswered / p.progress.totalQuestions), 0) / totalParticipants
      return avgProgress * 100
    })
  }
}

/**
 * 型エクスポート
 */
export type HAQEICollaborativeDiagnosisComposable = ReturnType<typeof useCollaborativeDiagnosis>
export type { 
  CollaborativeModeType,
  CollaborativeDiagnosisSession,
  CollaborativeParticipant,
  CollaborativeInsight,
  InteractionPattern
}