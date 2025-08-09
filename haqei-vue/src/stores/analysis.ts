/**
 * 分析ストア - 診断の進行状況と結果を管理
 * 
 * 目的：
 * - 質問への回答を保存
 * - 進行状況を管理
 * - 分析結果を計算・保存
 * - localStorageとの同期
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Answer, AnalysisResult, DimensionKey } from '@/data/types'
import { calculateDimensionScores } from '@/utils/questionsMigration'
import { ALL_QUESTIONS } from '@/data/questions'
import { calculator } from '@/utils/calculator'
import { tripleOSEngine } from '@/utils/tripleOSEngine'
import type { TripleOSAnalysisResult } from '@/utils/tripleOSEngine'

interface Progress {
  currentQuestionIndex: number
  answers: Answer[]
  lastUpdated: number
}

export const useAnalysisStore = defineStore('analysis', () => {
  // State
  const progress = ref<Progress | null>(null)
  const analysisResult = ref<AnalysisResult | null>(null)
  const tripleOSResult = ref<TripleOSAnalysisResult | null>(null)
  const isAnalyzing = ref(false)
  
  // LocalStorage keys
  const PROGRESS_KEY = 'haqei_progress'
  const RESULT_KEY = 'haqei_analysis_result'
  const TRIPLE_OS_KEY = 'haqei_triple_os_result'
  
  // Computed
  const hasProgress = computed(() => progress.value !== null && progress.value.answers.length > 0)
  const isComplete = computed(() => {
    if (!progress.value) return false
    return progress.value.answers.length === ALL_QUESTIONS.length
  })
  
  // Actions
  function loadFromStorage() {
    // Load progress
    const savedProgress = localStorage.getItem(PROGRESS_KEY)
    if (savedProgress) {
      try {
        progress.value = JSON.parse(savedProgress)
      } catch (e) {
        console.error('Failed to load progress:', e)
      }
    }
    
    // Load result
    const savedResult = localStorage.getItem(RESULT_KEY)
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult)
        // Convert dimensionScores back to Map
        parsed.dimensionScores = new Map(Object.entries(parsed.dimensionScores))
        analysisResult.value = parsed
      } catch (e) {
        console.error('Failed to load result:', e)
      }
    }
  }
  
  function saveProgress(newProgress: Progress) {
    progress.value = newProgress
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress))
  }
  
  function getProgress(): Progress | null {
    if (!progress.value) {
      loadFromStorage()
    }
    return progress.value
  }
  
  async function completeAnalysis(answers: Answer[]) {
    isAnalyzing.value = true
    
    try {
      // Use Calculator to build user vector
      const userVector = calculator.buildUserVector(answers)
      
      // Calculate dimension scores for basic compatibility
      const answerMap = new Map<string, string>()
      answers.forEach(answer => {
        answerMap.set(answer.questionId, answer.selectedValue)
      })
      const dimensionScores = calculateDimensionScores(answerMap, ALL_QUESTIONS)
      
      // Run Triple OS analysis
      const tripleOS = await tripleOSEngine.analyzeUser(answers)
      tripleOSResult.value = tripleOS
      
      // Use Engine OS hexagram as primary hexagram
      const primaryHexagram = tripleOS.engineOS.hexagramId
      
      // Calculate compatibility score
      const compatibility = calculateCompatibility(dimensionScores)
      
      // Create result
      const result: AnalysisResult = {
        dimensionScores,
        primaryHexagram,
        compatibility,
        timestamp: Date.now()
      }
      
      analysisResult.value = result
      
      // Save to localStorage (convert Map to object for serialization)
      const serializable = {
        ...result,
        dimensionScores: Object.fromEntries(dimensionScores)
      }
      localStorage.setItem(RESULT_KEY, JSON.stringify(serializable))
      
      // Save Triple OS result
      localStorage.setItem(TRIPLE_OS_KEY, JSON.stringify(tripleOS))
      
      // Clear progress
      localStorage.removeItem(PROGRESS_KEY)
      progress.value = null
      
    } catch (error) {
      console.error('Analysis failed:', error)
      throw error
    } finally {
      isAnalyzing.value = false
    }
  }
  
  function clearData() {
    progress.value = null
    analysisResult.value = null
    tripleOSResult.value = null
    localStorage.removeItem(PROGRESS_KEY)
    localStorage.removeItem(RESULT_KEY)
    localStorage.removeItem(TRIPLE_OS_KEY)
  }
  
  // Helper functions
  function calculatePrimaryHexagram(scores: Map<string, number>): number {
    // Simplified calculation - in reality this would use the full algorithm
    // Get the dominant dimension
    let maxScore = -Infinity
    let dominantDimension = ''
    
    scores.forEach((score, dimension) => {
      if (score > maxScore) {
        maxScore = score
        dominantDimension = dimension
      }
    })
    
    // Map dimension to hexagram (simplified mapping)
    const dimensionToHexagram: Record<string, number> = {
      '乾_創造性': 1,
      '震_行動性': 51,
      '坎_探求性': 29,
      '艮_安定性': 52,
      '坤_受容性': 2,
      '巽_適応性': 57,
      '離_表現性': 30,
      '兌_調和性': 58
    }
    
    return dimensionToHexagram[dominantDimension] || 1
  }
  
  function calculateCompatibility(scores: Map<string, number>): number {
    // Calculate how balanced the scores are
    const values = Array.from(scores.values())
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    
    // Lower variance = higher compatibility (more balanced)
    // Normalize to 0-100 scale
    const normalizedVariance = Math.min(variance / 100, 1)
    return Math.round((1 - normalizedVariance) * 100)
  }
  
  // Initialize on store creation
  loadFromStorage()
  
  return {
    // State
    progress,
    analysisResult,
    tripleOSResult,
    isAnalyzing,
    
    // Computed
    hasProgress,
    isComplete,
    
    // Actions
    saveProgress,
    getProgress,
    completeAnalysis,
    clearData
  }
})