/**
 * Triple OS Engine使用のためのComposable
 * 
 * 目的：
 * - TripleOSEngineをVue 3コンポーネントで使いやすくする
 * - リアクティブな状態管理
 * - 非同期処理のハンドリング
 */

import { ref, computed } from 'vue'
import { tripleOSEngine } from '@/utils/tripleOSEngine'
import type { Answer } from '@/data/types'
import type { TripleOSAnalysisResult } from '@/utils/tripleOSEngine'

export function useTripleOS() {
  // State
  const isAnalyzing = ref(false)
  const analysisError = ref<string | null>(null)
  const analysisResult = ref<TripleOSAnalysisResult | null>(null)
  
  // Computed
  const hasResult = computed(() => analysisResult.value !== null)
  
  const engineOS = computed(() => analysisResult.value?.engineOS || null)
  const interfaceOS = computed(() => analysisResult.value?.interfaceOS || null)
  const safeModeOS = computed(() => analysisResult.value?.safeModeOS || null)
  
  const consistencyScore = computed(() => analysisResult.value?.consistencyScore || 0)
  const misalignmentLevel = computed(() => {
    const score = analysisResult.value?.misalignmentData?.overallScore || 100
    if (score >= 80) return 'low'
    if (score >= 60) return 'medium'
    if (score >= 40) return 'high'
    return 'critical'
  })
  
  /**
   * Triple OS分析を実行
   */
  async function analyzeTripleOS(answers: Answer[]): Promise<TripleOSAnalysisResult> {
    isAnalyzing.value = true
    analysisError.value = null
    
    try {
      const result = await tripleOSEngine.analyzeUser(answers)
      analysisResult.value = result
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Triple OS分析エラーが発生しました'
      analysisError.value = errorMessage
      throw error
    } finally {
      isAnalyzing.value = false
    }
  }
  
  /**
   * OSの説明文を生成
   */
  function getOSDescription(osType: 'engine' | 'interface' | 'safeMode'): string {
    if (!analysisResult.value) return ''
    
    const osMap = {
      engine: analysisResult.value.engineOS,
      interface: analysisResult.value.interfaceOS,
      safeMode: analysisResult.value.safeModeOS
    }
    
    const os = osMap[osType]
    if (!os) return ''
    
    const typeDescriptions = {
      engine: `価値観システム（Engine OS）: ${os.hexagramName}
        あなたの核となる価値観と判断基準を表します。
        主要な三爻: ${os.primaryTrigram}・${os.secondaryTrigram}`,
      
      interface: `社会的システム（Interface OS）: ${os.hexagramName}
        他者に見せる自分、社会的な振る舞いを表します。
        マッチングスコア: ${os.matchingScore.toFixed(1)}%`,
      
      safeMode: `防御システム（SafeMode OS）: ${os.hexagramName}
        ストレス時の防御反応と対処パターンを表します。
        マッチングスコア: ${os.matchingScore.toFixed(1)}%`
    }
    
    return typeDescriptions[osType] || ''
  }
  
  /**
   * 整合性の説明文を生成
   */
  function getConsistencyDescription(): string {
    if (!analysisResult.value?.misalignmentData) return ''
    
    const data = analysisResult.value.misalignmentData
    const score = data.overallScore
    
    let description = `3つのシステム間の整合性: ${score.toFixed(1)}%\n`
    description += `リスクレベル: ${data.riskLevel}\n\n`
    
    // ペアごとの整合性
    description += '個別の整合性:\n'
    description += `- 価値観⇔社会的表現: ${data.pairScores.engineInterface.toFixed(1)}%\n`
    description += `- 価値観⇔防御反応: ${data.pairScores.engineSafeMode.toFixed(1)}%\n`
    description += `- 社会的表現⇔防御反応: ${data.pairScores.interfaceSafeMode.toFixed(1)}%`
    
    return description
  }
  
  /**
   * 洞察を取得
   */
  function getInsights(): string[] {
    if (!analysisResult.value?.integrationInsights) return []
    
    return analysisResult.value.integrationInsights.map(insight => {
      return `【${insight.title}】\n${insight.content}`
    })
  }
  
  /**
   * エラーをクリア
   */
  function clearError() {
    analysisError.value = null
  }
  
  /**
   * 状態をリセット
   */
  function reset() {
    isAnalyzing.value = false
    analysisError.value = null
    analysisResult.value = null
  }
  
  return {
    // State
    isAnalyzing,
    analysisError,
    analysisResult,
    
    // Computed
    hasResult,
    engineOS,
    interfaceOS,
    safeModeOS,
    consistencyScore,
    misalignmentLevel,
    
    // Methods
    analyzeTripleOS,
    getOSDescription,
    getConsistencyDescription,
    getInsights,
    clearError,
    reset
  }
}