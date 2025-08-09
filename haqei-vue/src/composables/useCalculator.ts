/**
 * Calculator使用のためのComposable
 * 
 * 目的：
 * - CalculatorクラスをVue 3コンポーネントで使いやすくする
 * - リアクティブな状態管理
 * - 非同期処理のハンドリング
 */

import { ref, computed } from 'vue'
import { calculator } from '@/utils/calculator'
import type { Answer, UserVector, OSVector, AnalysisResult } from '@/utils/calculator'

export function useCalculator() {
  // State
  const isCalculating = ref(false)
  const calculationError = ref<string | null>(null)
  const userVector = ref<UserVector | null>(null)
  const analysisResult = ref<AnalysisResult | null>(null)
  
  // Computed
  const hasUserVector = computed(() => userVector.value !== null)
  const hasAnalysisResult = computed(() => analysisResult.value !== null)
  
  /**
   * ユーザーベクトルを構築
   */
  async function buildVector(answers: Answer[]): Promise<UserVector> {
    isCalculating.value = true
    calculationError.value = null
    
    try {
      const vector = calculator.buildUserVector(answers)
      userVector.value = vector
      return vector
    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : '計算エラーが発生しました'
      throw error
    } finally {
      isCalculating.value = false
    }
  }
  
  /**
   * シナリオベクトルを構築
   */
  async function buildScenarioVector(
    scenarioAnswers: Answer[], 
    vectorType: 'interface' | 'engine' = 'interface'
  ): Promise<UserVector> {
    isCalculating.value = true
    calculationError.value = null
    
    try {
      const vector = calculator.buildScenarioVector(scenarioAnswers, vectorType)
      return vector
    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : '計算エラーが発生しました'
      throw error
    } finally {
      isCalculating.value = false
    }
  }
  
  /**
   * OS候補を分析
   */
  async function analyzeOSCandidates(
    userVec: UserVector,
    vectorsData: { [key: string]: OSVector },
    systemType: string = 'general'
  ): Promise<AnalysisResult> {
    isCalculating.value = true
    calculationError.value = null
    
    try {
      const result = calculator.analyzeOSCandidates(userVec, vectorsData, systemType)
      analysisResult.value = result
      return result
    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : '分析エラーが発生しました'
      throw error
    } finally {
      isCalculating.value = false
    }
  }
  
  /**
   * コサイン類似度を計算
   */
  function calculateSimilarity(vectorA: UserVector, vectorB: OSVector): number {
    try {
      return calculator.calculateCosineSimilarity(vectorA, vectorB)
    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : '類似度計算エラー'
      return 0
    }
  }
  
  /**
   * 最終スコアを計算
   */
  function calculateScore(
    vectorA: UserVector, 
    vectorB: OSVector, 
    systemType: string = 'general'
  ): number {
    try {
      return calculator.calculateFinalScore(vectorA, vectorB, systemType)
    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : 'スコア計算エラー'
      return 0
    }
  }
  
  /**
   * 爻の関係を分析
   */
  function analyzeHexagramLines(hexagramLines: number[]) {
    try {
      return calculator.analyzeLineRelationships(hexagramLines)
    } catch (error) {
      calculationError.value = error instanceof Error ? error.message : '爻分析エラー'
      return { error: '分析に失敗しました' }
    }
  }
  
  /**
   * 爻位の意味を取得
   */
  function getLineMeaning(position: number) {
    return calculator.getLinePositionMeaning(position)
  }
  
  /**
   * エラーをクリア
   */
  function clearError() {
    calculationError.value = null
  }
  
  /**
   * 状態をリセット
   */
  function reset() {
    isCalculating.value = false
    calculationError.value = null
    userVector.value = null
    analysisResult.value = null
  }
  
  return {
    // State
    isCalculating,
    calculationError,
    userVector,
    analysisResult,
    
    // Computed
    hasUserVector,
    hasAnalysisResult,
    
    // Methods
    buildVector,
    buildScenarioVector,
    analyzeOSCandidates,
    calculateSimilarity,
    calculateScore,
    analyzeHexagramLines,
    getLineMeaning,
    clearError,
    reset
  }
}