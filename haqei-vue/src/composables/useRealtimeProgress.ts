/**
 * HAQEI リアルタイムプログレス表示システム - 動的可視化
 * 
 * 目的：
 * - HaQei哲学の進行をリアルタイムで可視化
 * - Triple OS分析の動的表示
 * - 協調診断での集合進捗管理
 * - 易経64卦の変化過程可視化
 * - アニメーション・インタラクション最適化
 * 
 * 可視化要素：
 * 1. 個人進捗（質問応答・フェーズ遷移）
 * 2. Triple OS発見・統合プロセス
 * 3. 易経卦の変化・共鳴状態
 * 4. 協調診断参加者の同期状況
 * 5. HaQei分人の動的変化
 * 
 * アニメーション・UX設計：
 * - 易経的な自然な流れ（陰陽の調和）
 * - 段階的開示（過度な情報による圧迫感回避）
 * - 個人ペースの尊重（強制感のない進行）
 * - 美しいトランジション（心地よい体験）
 * 
 * 更新: 2025-08-03 - TASK-039実装
 */

import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { useMultiDeviceSync } from './useMultiDeviceSync'
import { useCollaborativeDiagnosis } from './useCollaborativeDiagnosis'

// 進捗表示モード
type ProgressDisplayMode = 
  | 'minimal' // 最小限表示
  | 'standard' // 標準表示
  | 'detailed' // 詳細表示
  | 'collaborative' // 協調表示

// 進捗アニメーション設定
interface ProgressAnimationConfig {
  enableAnimations: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
  easingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  enableParticleEffects: boolean
  enableSoundEffects: boolean
  culturalTheme: 'modern' | 'traditional' | 'minimal'
}

// 個人進捗状態
interface PersonalProgressState {
  overall: OverallProgress
  phases: PhaseProgress[]
  tripleOS: TripleOSProgress
  insights: InsightProgress
  milestones: MilestoneProgress[]
}

// 全体進捗
interface OverallProgress {
  percentage: number
  questionsAnswered: number
  totalQuestions: number
  timeSpent: number // 分
  estimatedRemaining: number // 分
  currentPhase: string
  nextPhase: string
  velocity: number // 質問/分
}

// フェーズ進捗
interface PhaseProgress {
  id: string
  name: string
  description: string
  status: 'pending' | 'active' | 'completed'
  progress: number // 0-100
  startTime?: string
  endTime?: string
  insights: string[]
  color: string
  icon: string
}

// Triple OS進捗
interface TripleOSProgress {
  engineOS: OSDiscoveryProgress
  interfaceOS: OSDiscoveryProgress
  safeModeOS: OSDiscoveryProgress
  integration: IntegrationProgress
  harmony: HarmonyProgress
}

// OS発見進捗
interface OSDiscoveryProgress {
  discovered: boolean
  strength: number // 0-100
  clarity: number // 0-100
  characteristics: CharacteristicProgress[]
  relatedHexagrams: number[]
  discoveryMoments: string[]
}

// 特性進捗
interface CharacteristicProgress {
  name: string
  strength: number
  confidence: number
  evidenceCount: number
  lastUpdated: string
}

// 統合進捗
interface IntegrationProgress {
  level: number // 0-100
  balance: number // 0-100
  conflicts: ConflictProgress[]
  synergies: SynergyProgress[]
  emergentPatterns: string[]
}

// 衝突進捗
interface ConflictProgress {
  between: string[]
  intensity: number
  status: 'unresolved' | 'understanding' | 'accepting' | 'integrating'
  insights: string[]
}

// 相乗効果進捗
interface SynergyProgress {
  between: string[]
  strength: number
  benefits: string[]
  applications: string[]
}

// 調和進捗
interface HarmonyProgress {
  score: number // 0-100
  areas: HarmonyArea[]
  trends: HarmonyTrend[]
}

// 調和領域
interface HarmonyArea {
  name: string
  score: number
  trend: 'improving' | 'stable' | 'declining'
  factors: string[]
}

// 調和トレンド
interface HarmonyTrend {
  timestamp: string
  score: number
  context: string
}

// 洞察進捗
interface InsightProgress {
  total: number
  byType: Record<string, number>
  quality: number // 0-100
  depth: number // 0-100
  recent: RecentInsight[]
}

// 最近の洞察
interface RecentInsight {
  content: string
  type: string
  timestamp: string
  impact: number
  relatedHexagram?: number
}

// マイルストーン進捗
interface MilestoneProgress {
  id: string
  title: string
  description: string
  achieved: boolean
  achievedAt?: string
  significance: 'low' | 'medium' | 'high' | 'critical'
  celebrationMessage: string
}

// 協調進捗状態
interface CollaborativeProgressState {
  totalParticipants: number
  activeParticipants: number
  averageProgress: number
  phaseDistribution: Record<string, number>
  collectiveInsights: number
  mutualSupport: number
  resonanceLevel: number
}

// 視覚化要素
interface VisualizationElements {
  progressBars: ProgressBarElement[]
  radialCharts: RadialChartElement[]
  flowDiagrams: FlowDiagramElement[]
  particleEffects: ParticleEffectElement[]
  notifications: NotificationElement[]
}

// プログレスバー要素
interface ProgressBarElement {
  id: string
  type: 'linear' | 'radial' | 'stepped'
  value: number
  maxValue: number
  color: string
  gradient?: string[]
  animation: AnimationState
  milestones: number[]
}

// ラジアルチャート要素
interface RadialChartElement {
  id: string
  data: RadialDataPoint[]
  centerText: string
  colors: string[]
  animation: AnimationState
}

// ラジアルデータポイント
interface RadialDataPoint {
  label: string
  value: number
  maxValue: number
  color: string
}

// フロー図要素
interface FlowDiagramElement {
  id: string
  nodes: FlowNode[]
  connections: FlowConnection[]
  animation: AnimationState
}

// フローノード
interface FlowNode {
  id: string
  label: string
  status: 'pending' | 'active' | 'completed'
  position: { x: number; y: number }
  color: string
}

// フロー接続
interface FlowConnection {
  from: string
  to: string
  status: 'inactive' | 'active' | 'completed'
  strength: number
}

// パーティクル効果要素
interface ParticleEffectElement {
  id: string
  type: 'celebration' | 'discovery' | 'harmony' | 'resonance'
  intensity: number
  duration: number
  colors: string[]
}

// 通知要素
interface NotificationElement {
  id: string
  type: 'milestone' | 'insight' | 'support' | 'celebration'
  title: string
  message: string
  timestamp: string
  priority: 'low' | 'medium' | 'high'
  autoHide: boolean
  actions: NotificationAction[]
}

// 通知アクション
interface NotificationAction {
  label: string
  action: () => void
  style: 'primary' | 'secondary'
}

// アニメーション状態
interface AnimationState {
  isAnimating: boolean
  startTime?: number
  duration: number
  easing: string
  currentValue: number
  targetValue: number
}

/**
 * リアルタイムプログレス表示システム
 * 
 * HaQei哲学の動的可視化と美しいUX実現
 */
export function useRealtimeProgress(
  userId: string,
  displayMode: ProgressDisplayMode = 'standard'
) {
  const realtimeSubscription = useRealtimeSubscription(userId)
  const multiDeviceSync = useMultiDeviceSync(userId)
  const collaborativeDiagnosis = useCollaborativeDiagnosis(userId)
  
  // 表示設定
  const animationConfig = reactive<ProgressAnimationConfig>({
    enableAnimations: true,
    animationSpeed: 'normal',
    easingFunction: 'ease-out',
    enableParticleEffects: true,
    enableSoundEffects: false,
    culturalTheme: 'modern'
  })
  
  // 進捗状態
  const personalProgress = reactive<PersonalProgressState>({
    overall: {
      percentage: 0,
      questionsAnswered: 0,
      totalQuestions: 30,
      timeSpent: 0,
      estimatedRemaining: 0,
      currentPhase: 'initial',
      nextPhase: 'early_analysis',
      velocity: 0
    },
    phases: [],
    tripleOS: {
      engineOS: initializeOSProgress(),
      interfaceOS: initializeOSProgress(),
      safeModeOS: initializeOSProgress(),
      integration: {
        level: 0,
        balance: 50,
        conflicts: [],
        synergies: [],
        emergentPatterns: []
      },
      harmony: {
        score: 50,
        areas: [],
        trends: []
      }
    },
    insights: {
      total: 0,
      byType: {},
      quality: 0,
      depth: 0,
      recent: []
    },
    milestones: []
  })
  
  const collaborativeProgress = reactive<CollaborativeProgressState>({
    totalParticipants: 1,
    activeParticipants: 1,
    averageProgress: 0,
    phaseDistribution: {},
    collectiveInsights: 0,
    mutualSupport: 0,
    resonanceLevel: 0
  })
  
  // 視覚化要素
  const visualizations = reactive<VisualizationElements>({
    progressBars: [],
    radialCharts: [],
    flowDiagrams: [],
    particleEffects: [],
    notifications: []
  })
  
  // 状態管理
  const isVisible = ref(true)
  const isPaused = ref(false)
  const currentDisplayMode = ref(displayMode)

  /**
   * 進捗表示システムの初期化
   */
  async function initializeProgressDisplay(): Promise<void> {
    // フェーズ定義の初期化
    initializePhases()
    
    // マイルストーンの初期化
    initializeMilestones()
    
    // 視覚化要素の初期化
    initializeVisualizations()
    
    // リアルタイム監視の開始
    startProgressMonitoring()
    
    // アニメーションループの開始
    startAnimationLoop()
  }

  /**
   * フェーズの初期化
   */
  function initializePhases(): void {
    personalProgress.phases = [
      {
        id: 'initial',
        name: '導入',
        description: 'HAQEIシステムとHaQei哲学の理解',
        status: 'active',
        progress: 0,
        insights: [],
        color: '#E3F2FD',
        icon: '🌱'
      },
      {
        id: 'early_analysis',
        name: '初期分析',
        description: '基本的な自己理解と分人の発見',
        status: 'pending',
        progress: 0,
        insights: [],
        color: '#E8F5E8',
        icon: '🔍'
      },
      {
        id: 'triple_os_discovery',
        name: 'Triple OS発見',
        description: '3つのOSの特性と相互作用の理解',
        status: 'pending',
        progress: 0,
        insights: [],
        color: '#FFF3E0',
        icon: '⚖️'
      },
      {
        id: 'integration',
        name: '統合',
        description: '分人と3つのOSの調和的統合',
        status: 'pending',
        progress: 0,
        insights: [],
        color: '#F3E5F5',
        icon: '🔄'
      },
      {
        id: 'wisdom',
        name: '知恵',
        description: '易経的洞察と人生戦略の確立',
        status: 'pending',
        progress: 0,
        insights: [],
        color: '#E0F2F1',
        icon: '✨'
      }
    ]
  }

  /**
   * マイルストーンの初期化
   */
  function initializeMilestones(): void {
    personalProgress.milestones = [
      {
        id: 'first_question',
        title: '最初の一歩',
        description: '最初の質問に回答しました',
        achieved: false,
        significance: 'medium',
        celebrationMessage: '素晴らしい！自己理解の旅が始まりました 🌟'
      },
      {
        id: 'quarter_complete',
        title: '初期探索完了',
        description: '25%の質問に回答しました',
        achieved: false,
        significance: 'medium',
        celebrationMessage: 'いい調子です！内なる世界が見えてきています 🔮'
      },
      {
        id: 'first_os_discovered',
        title: '最初のOS発見',
        description: '最初のOperating Systemを発見しました',
        achieved: false,
        significance: 'high',
        celebrationMessage: '素晴らしい発見です！あなたの中核的な動作システムが明らかになりました 🎯'
      },
      {
        id: 'half_complete',
        title: '中間地点到達',
        description: '50%の質問に回答しました',
        achieved: false,
        significance: 'high',
        celebrationMessage: '半分まで来ました！深い自己理解が進んでいます 🚀'
      },
      {
        id: 'triple_os_complete',
        title: 'Triple OS完成',
        description: '3つすべてのOSを発見しました',
        achieved: false,
        significance: 'critical',
        celebrationMessage: '驚異的な達成です！あなたの完全な人格システムが明らかになりました 👑'
      },
      {
        id: 'analysis_complete',
        title: '分析完了',
        description: 'すべての質問に回答しました',
        achieved: false,
        significance: 'critical',
        celebrationMessage: 'おめでとうございます！完全な自己理解を達成されました ✨'
      }
    ]
  }

  /**
   * 視覚化要素の初期化
   */
  function initializeVisualizations(): void {
    // 全体進捗バー
    visualizations.progressBars.push({
      id: 'overall_progress',
      type: 'linear',
      value: 0,
      maxValue: 100,
      color: '#4CAF50',
      gradient: ['#81C784', '#4CAF50'],
      animation: createAnimationState(),
      milestones: [25, 50, 75, 100]
    })
    
    // Triple OSラジアルチャート
    visualizations.radialCharts.push({
      id: 'triple_os_radar',
      data: [
        { label: 'Engine OS', value: 0, maxValue: 100, color: '#FF6B6B' },
        { label: 'Interface OS', value: 0, maxValue: 100, color: '#4ECDC4' },
        { label: 'Safe Mode OS', value: 0, maxValue: 100, color: '#45B7D1' }
      ],
      centerText: 'Triple OS',
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      animation: createAnimationState()
    })
    
    // フェーズフロー図
    initializePhaseFlow()
  }

  /**
   * フェーズフロー図の初期化
   */
  function initializePhaseFlow(): void {
    const flowNodes: FlowNode[] = personalProgress.phases.map((phase, index) => ({
      id: phase.id,
      label: phase.name,
      status: phase.status,
      position: { x: 50 + (index * 150), y: 100 },
      color: phase.color
    }))
    
    const flowConnections: FlowConnection[] = []
    for (let i = 0; i < flowNodes.length - 1; i++) {
      flowConnections.push({
        from: flowNodes[i].id,
        to: flowNodes[i + 1].id,
        status: 'inactive',
        strength: 0
      })
    }
    
    visualizations.flowDiagrams.push({
      id: 'phase_flow',
      nodes: flowNodes,
      connections: flowConnections,
      animation: createAnimationState()
    })
  }

  /**
   * リアルタイム監視の開始
   */
  function startProgressMonitoring(): void {
    // 個人進捗の監視
    watch(() => personalProgress.overall.questionsAnswered, (newValue, oldValue) => {
      if (newValue > oldValue) {
        handleQuestionAnswered(newValue)
      }
    })
    
    // Triple OS進捗の監視
    watch(() => personalProgress.tripleOS, (newTripleOS) => {
      updateTripleOSVisualization(newTripleOS)
    }, { deep: true })
    
    // フェーズ進捗の監視
    watch(() => personalProgress.phases, (newPhases) => {
      updatePhaseVisualization(newPhases)
    }, { deep: true })
    
    // 協調進捗の監視
    if (currentDisplayMode.value === 'collaborative') {
      watch(() => collaborativeProgress, (newProgress) => {
        updateCollaborativeVisualization(newProgress)
      }, { deep: true })
    }
  }

  /**
   * 質問回答時の処理
   */
  async function handleQuestionAnswered(questionNumber: number): Promise<void> {
    // 全体進捗の更新
    const percentage = (questionNumber / personalProgress.overall.totalQuestions) * 100
    await animateProgressChange('overall_progress', percentage)
    
    // フェーズ判定と更新
    updateCurrentPhase(percentage)
    
    // マイルストーンチェック
    checkMilestones(questionNumber, percentage)
    
    // パーティクル効果
    if (animationConfig.enableParticleEffects) {
      triggerParticleEffect('discovery', questionNumber % 5 === 0 ? 'high' : 'low')
    }
    
    // 協調診断での更新通知
    if (currentDisplayMode.value === 'collaborative') {
      await realtimeSubscription.updateProgress(personalProgress.overall.currentPhase, percentage)
    }
  }

  /**
   * 進捗アニメーション
   */
  async function animateProgressChange(elementId: string, targetValue: number): Promise<void> {
    const element = visualizations.progressBars.find(bar => bar.id === elementId)
    if (!element) return

    const animation = element.animation
    animation.targetValue = targetValue
    animation.startTime = Date.now()
    animation.isAnimating = true
    
    // アニメーション速度の調整
    const speedMultiplier = {
      slow: 0.5,
      normal: 1,
      fast: 2
    }[animationConfig.animationSpeed]
    
    animation.duration = 1000 / speedMultiplier
    
    return new Promise(resolve => {
      const animate = () => {
        if (!animation.isAnimating) {
          resolve()
          return
        }
        
        const elapsed = Date.now() - (animation.startTime || 0)
        const progress = Math.min(elapsed / animation.duration, 1)
        
        // イージング関数の適用
        const easedProgress = applyEasing(progress, animationConfig.easingFunction)
        
        animation.currentValue = animation.currentValue + 
          (animation.targetValue - animation.currentValue) * easedProgress
        
        element.value = animation.currentValue
        
        if (progress >= 1) {
          animation.isAnimating = false
          element.value = animation.targetValue
          resolve()
        } else {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    })
  }

  /**
   * 現在フェーズの更新
   */
  function updateCurrentPhase(percentage: number): void {
    let newPhase = 'initial'
    
    if (percentage >= 75) newPhase = 'wisdom'
    else if (percentage >= 50) newPhase = 'integration'
    else if (percentage >= 25) newPhase = 'triple_os_discovery'
    else if (percentage >= 10) newPhase = 'early_analysis'
    
    if (newPhase !== personalProgress.overall.currentPhase) {
      // 現在フェーズを完了に
      const currentPhaseObj = personalProgress.phases.find(p => p.id === personalProgress.overall.currentPhase)
      if (currentPhaseObj) {
        currentPhaseObj.status = 'completed'
        currentPhaseObj.progress = 100
        currentPhaseObj.endTime = new Date().toISOString()
      }
      
      // 新しいフェーズをアクティブに
      const newPhaseObj = personalProgress.phases.find(p => p.id === newPhase)
      if (newPhaseObj) {
        newPhaseObj.status = 'active'
        newPhaseObj.startTime = new Date().toISOString()
        
        // フェーズ変更通知
        showPhaseChangeNotification(newPhaseObj)
      }
      
      personalProgress.overall.currentPhase = newPhase
      
      // 次フェーズの設定
      const currentIndex = personalProgress.phases.findIndex(p => p.id === newPhase)
      if (currentIndex < personalProgress.phases.length - 1) {
        personalProgress.overall.nextPhase = personalProgress.phases[currentIndex + 1].id
      }
    }
  }

  /**
   * マイルストーンチェック
   */
  function checkMilestones(questionNumber: number, percentage: number): void {
    const milestones = personalProgress.milestones
    
    // 最初の質問
    if (questionNumber === 1 && !milestones.find(m => m.id === 'first_question')?.achieved) {
      achieveMilestone('first_question')
    }
    
    // 25%完了
    if (percentage >= 25 && !milestones.find(m => m.id === 'quarter_complete')?.achieved) {
      achieveMilestone('quarter_complete')
    }
    
    // 50%完了
    if (percentage >= 50 && !milestones.find(m => m.id === 'half_complete')?.achieved) {
      achieveMilestone('half_complete')
    }
    
    // 100%完了
    if (percentage >= 100 && !milestones.find(m => m.id === 'analysis_complete')?.achieved) {
      achieveMilestone('analysis_complete')
    }
  }

  /**
   * マイルストーン達成
   */
  function achieveMilestone(milestoneId: string): void {
    const milestone = personalProgress.milestones.find(m => m.id === milestoneId)
    if (!milestone || milestone.achieved) return
    
    milestone.achieved = true
    milestone.achievedAt = new Date().toISOString()
    
    // 祝福通知
    showCelebrationNotification(milestone)
    
    // パーティクル効果
    if (animationConfig.enableParticleEffects) {
      triggerParticleEffect('celebration', milestone.significance === 'critical' ? 'high' : 'medium')
    }
  }

  /**
   * Triple OS可視化の更新
   */
  function updateTripleOSVisualization(tripleOS: TripleOSProgress): void {
    const radarChart = visualizations.radialCharts.find(chart => chart.id === 'triple_os_radar')
    if (!radarChart) return
    
    radarChart.data[0].value = tripleOS.engineOS.strength
    radarChart.data[1].value = tripleOS.interfaceOS.strength
    radarChart.data[2].value = tripleOS.safeModeOS.strength
    
    // アニメーション開始
    radarChart.animation.isAnimating = true
    radarChart.animation.startTime = Date.now()
  }

  /**
   * フェーズ可視化の更新
   */
  function updatePhaseVisualization(phases: PhaseProgress[]): void {
    const flowDiagram = visualizations.flowDiagrams.find(diagram => diagram.id === 'phase_flow')
    if (!flowDiagram) return
    
    // ノード状態の更新
    phases.forEach(phase => {
      const node = flowDiagram.nodes.find(n => n.id === phase.id)
      if (node) {
        node.status = phase.status
      }
    })
    
    // 接続状態の更新
    flowDiagram.connections.forEach(connection => {
      const fromPhase = phases.find(p => p.id === connection.from)
      const toPhase = phases.find(p => p.id === connection.to)
      
      if (fromPhase?.status === 'completed') {
        connection.status = 'completed'
        connection.strength = 100
      } else if (fromPhase?.status === 'active') {
        connection.status = 'active'
        connection.strength = fromPhase.progress
      }
    })
  }

  /**
   * 協調可視化の更新
   */
  function updateCollaborativeVisualization(progress: CollaborativeProgressState): void {
    // 協調進捗バーの追加/更新
    const collaborativeBar = visualizations.progressBars.find(bar => bar.id === 'collaborative_progress')
    if (!collaborativeBar) {
      visualizations.progressBars.push({
        id: 'collaborative_progress',
        type: 'linear',
        value: progress.averageProgress,
        maxValue: 100,
        color: '#9C27B0',
        gradient: ['#BA68C8', '#9C27B0'],
        animation: createAnimationState(),
        milestones: [25, 50, 75, 100]
      })
    } else {
      animateProgressChange('collaborative_progress', progress.averageProgress)
    }
  }

  /**
   * パーティクル効果のトリガー
   */
  function triggerParticleEffect(
    type: 'celebration' | 'discovery' | 'harmony' | 'resonance',
    intensity: 'low' | 'medium' | 'high'
  ): void {
    const intensityMap = { low: 1, medium: 3, high: 5 }
    const durationMap = { low: 2000, medium: 3000, high: 5000 }
    
    const effect: ParticleEffectElement = {
      id: crypto.randomUUID(),
      type,
      intensity: intensityMap[intensity],
      duration: durationMap[intensity],
      colors: getParticleColors(type)
    }
    
    visualizations.particleEffects.push(effect)
    
    // 自動削除
    setTimeout(() => {
      const index = visualizations.particleEffects.findIndex(e => e.id === effect.id)
      if (index !== -1) {
        visualizations.particleEffects.splice(index, 1)
      }
    }, effect.duration)
  }

  /**
   * 通知表示
   */
  function showCelebrationNotification(milestone: MilestoneProgress): void {
    const notification: NotificationElement = {
      id: crypto.randomUUID(),
      type: 'celebration',
      title: milestone.title,
      message: milestone.celebrationMessage,
      timestamp: new Date().toISOString(),
      priority: milestone.significance === 'critical' ? 'high' : 'medium',
      autoHide: true,
      actions: [
        {
          label: '続ける',
          action: () => dismissNotification(notification.id),
          style: 'primary'
        }
      ]
    }
    
    visualizations.notifications.push(notification)
    
    // 自動非表示
    setTimeout(() => {
      dismissNotification(notification.id)
    }, 5000)
  }

  /**
   * フェーズ変更通知
   */
  function showPhaseChangeNotification(phase: PhaseProgress): void {
    const notification: NotificationElement = {
      id: crypto.randomUUID(),
      type: 'milestone',
      title: `新しいフェーズ: ${phase.name}`,
      message: phase.description,
      timestamp: new Date().toISOString(),
      priority: 'medium',
      autoHide: true,
      actions: [
        {
          label: '理解しました',
          action: () => dismissNotification(notification.id),
          style: 'primary'
        }
      ]
    }
    
    visualizations.notifications.push(notification)
    
    // 自動非表示
    setTimeout(() => {
      dismissNotification(notification.id)
    }, 7000)
  }

  /**
   * 通知の削除
   */
  function dismissNotification(notificationId: string): void {
    const index = visualizations.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      visualizations.notifications.splice(index, 1)
    }
  }

  /**
   * 外部更新インターフェース
   */
  function updateQuestionProgress(questionNumber: number, timeSpent: number): void {
    personalProgress.overall.questionsAnswered = questionNumber
    personalProgress.overall.timeSpent = timeSpent
    personalProgress.overall.percentage = (questionNumber / personalProgress.overall.totalQuestions) * 100
    
    // 速度計算
    if (timeSpent > 0) {
      personalProgress.overall.velocity = questionNumber / timeSpent
      personalProgress.overall.estimatedRemaining = 
        (personalProgress.overall.totalQuestions - questionNumber) / personalProgress.overall.velocity
    }
  }

  function updateTripleOSStrength(osType: 'engineOS' | 'interfaceOS' | 'safeModeOS', strength: number): void {
    personalProgress.tripleOS[osType].strength = strength
    
    if (strength > 50 && !personalProgress.tripleOS[osType].discovered) {
      personalProgress.tripleOS[osType].discovered = true
      
      // 最初のOS発見マイルストーン
      const discoveredCount = [
        personalProgress.tripleOS.engineOS.discovered,
        personalProgress.tripleOS.interfaceOS.discovered,
        personalProgress.tripleOS.safeModeOS.discovered
      ].filter(Boolean).length
      
      if (discoveredCount === 1) {
        achieveMilestone('first_os_discovered')
      } else if (discoveredCount === 3) {
        achieveMilestone('triple_os_complete')
      }
    }
  }

  function addInsight(content: string, type: string, impact: number): void {
    const insight: RecentInsight = {
      content,
      type,
      timestamp: new Date().toISOString(),
      impact
    }
    
    personalProgress.insights.recent.unshift(insight)
    personalProgress.insights.total++
    personalProgress.insights.byType[type] = (personalProgress.insights.byType[type] || 0) + 1
    
    // 最新10件まで保持
    if (personalProgress.insights.recent.length > 10) {
      personalProgress.insights.recent = personalProgress.insights.recent.slice(0, 10)
    }
    
    // 品質・深度の更新
    updateInsightMetrics()
  }

  /**
   * アニメーションループの開始
   */
  function startAnimationLoop(): void {
    const animate = () => {
      if (!isPaused.value && isVisible.value && animationConfig.enableAnimations) {
        updateAnimations()
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }

  /**
   * アニメーションの更新
   */
  function updateAnimations(): void {
    // 進捗バーアニメーション
    visualizations.progressBars.forEach(bar => {
      if (bar.animation.isAnimating) {
        updateProgressBarAnimation(bar)
      }
    })
    
    // ラジアルチャートアニメーション
    visualizations.radialCharts.forEach(chart => {
      if (chart.animation.isAnimating) {
        updateRadialChartAnimation(chart)
      }
    })
    
    // フロー図アニメーション
    visualizations.flowDiagrams.forEach(diagram => {
      if (diagram.animation.isAnimating) {
        updateFlowDiagramAnimation(diagram)
      }
    })
  }

  /**
   * ユーティリティ関数
   */
  function initializeOSProgress(): OSDiscoveryProgress {
    return {
      discovered: false,
      strength: 0,
      clarity: 0,
      characteristics: [],
      relatedHexagrams: [],
      discoveryMoments: []
    }
  }

  function createAnimationState(): AnimationState {
    return {
      isAnimating: false,
      duration: 1000,
      easing: 'ease-out',
      currentValue: 0,
      targetValue: 0
    }
  }

  function applyEasing(progress: number, easing: string): number {
    switch (easing) {
      case 'ease-in':
        return progress * progress
      case 'ease-out':
        return 1 - Math.pow(1 - progress, 2)
      case 'ease-in-out':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
      default:
        return progress
    }
  }

  function getParticleColors(type: string): string[] {
    const colorMap = {
      celebration: ['#FFD700', '#FFA500', '#FF6B6B'],
      discovery: ['#4ECDC4', '#45B7D1', '#96CEB4'],
      harmony: ['#9C27B0', '#E91E63', '#F48FB1'],
      resonance: ['#FF9800', '#FFC107', '#FFEB3B']
    }
    return colorMap[type as keyof typeof colorMap] || ['#4CAF50']
  }

  function updateInsightMetrics(): void {
    const insights = personalProgress.insights.recent
    if (insights.length === 0) return
    
    const avgImpact = insights.reduce((sum, i) => sum + i.impact, 0) / insights.length
    personalProgress.insights.quality = Math.min(100, avgImpact * 20)
    personalProgress.insights.depth = Math.min(100, insights.length * 10)
  }

  // スタブ関数（実装に応じて詳細化）
  function updateProgressBarAnimation(bar: ProgressBarElement): void {}
  function updateRadialChartAnimation(chart: RadialChartElement): void {}
  function updateFlowDiagramAnimation(diagram: FlowDiagramElement): void {}

  // 初期化
  onMounted(() => {
    initializeProgressDisplay()
  })

  return {
    // 状態
    personalProgress,
    collaborativeProgress,
    visualizations,
    animationConfig,
    currentDisplayMode,
    isVisible,
    isPaused,
    
    // 操作
    updateQuestionProgress,
    updateTripleOSStrength,
    addInsight,
    triggerParticleEffect,
    achieveMilestone,
    
    // 制御
    pause: () => isPaused.value = true,
    resume: () => isPaused.value = false,
    hide: () => isVisible.value = false,
    show: () => isVisible.value = true,
    
    // 計算されたプロパティ
    overallProgress: computed(() => personalProgress.overall.percentage),
    currentPhase: computed(() => personalProgress.overall.currentPhase),
    nextMilestone: computed(() => 
      personalProgress.milestones.find(m => !m.achieved)
    ),
    tripleOSBalance: computed(() => {
      const { engineOS, interfaceOS, safeModeOS } = personalProgress.tripleOS
      const strengths = [engineOS.strength, interfaceOS.strength, safeModeOS.strength]
      const max = Math.max(...strengths)
      const min = Math.min(...strengths)
      return max === 0 ? 100 : ((max - min) / max) * 100
    })
  }
}

/**
 * 型エクスポート
 */
export type HAQEIRealtimeProgressComposable = ReturnType<typeof useRealtimeProgress>
export type { 
  ProgressDisplayMode,
  PersonalProgressState,
  CollaborativeProgressState,
  VisualizationElements,
  ProgressAnimationConfig
}