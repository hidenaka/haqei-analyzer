/**
 * analysis.ts ストアのユニットテスト
 * Pinia ストアの状態管理とlocalStorage同期のテスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAnalysisStore } from '../analysis'
import type { Answer } from '@/data/types'

// Mock calculator and tripleOSEngine
vi.mock('@/utils/calculator', () => ({
  calculator: {
    buildUserVector: vi.fn(() => ({
      '乾_創造性': 80,
      '震_行動性': 70,
      '坎_探求性': 60,
      '艮_安定性': 50,
      '坤_受容性': 40,
      '巽_適応性': 65,
      '離_表現性': 75,
      '兌_調和性': 55
    }))
  }
}))

vi.mock('@/utils/tripleOSEngine', () => ({
  tripleOSEngine: {
    analyzeUser: vi.fn(() => ({
      engineOS: {
        hexagramId: 1,
        hexagramName: '乾',
        primaryTrigram: '乾',
        secondaryTrigram: '乾',
        trigramEnergies: {},
        matchType: 'direct_calculation'
      },
      interfaceOS: {
        hexagramId: 2,
        hexagramName: '坤',
        keywordMatching: {},
        matchType: 'keyword_matching'
      },
      safeModeOS: {
        hexagramId: 3,
        hexagramName: '屯',
        keywordMatching: {},
        matchType: 'keyword_matching'
      },
      consistencyScore: 85,
      misalignmentData: {
        overallScore: 85,
        pairScores: {
          engineInterface: 80,
          engineSafeMode: 85,
          interfaceSafeMode: 90
        },
        riskLevel: '低リスク'
      }
    }))
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock as any

describe('Analysis Store', () => {
  let store: ReturnType<typeof useAnalysisStore>

  beforeEach(() => {
    // Create a fresh pinia instance
    setActivePinia(createPinia())
    store = useAnalysisStore()
    
    // Clear mocks
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      expect(store.progress).toBeNull()
      expect(store.analysisResult).toBeNull()
      expect(store.tripleOSResult).toBeNull()
      expect(store.isAnalyzing).toBe(false)
    })

    it('should have correct computed values', () => {
      expect(store.hasProgress).toBe(false)
      expect(store.isComplete).toBe(false)
    })
  })

  describe('Progress management', () => {
    it('should save progress', () => {
      const progress = {
        currentQuestionIndex: 5,
        answers: [
          { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() },
          { questionId: 'q2', selectedValue: 'b', timestamp: Date.now() }
        ],
        lastUpdated: Date.now()
      }

      store.saveProgress(progress)

      expect(store.progress).toEqual(progress)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'haqei_progress',
        JSON.stringify(progress)
      )
    })

    it('should get progress from state if available', () => {
      const progress = {
        currentQuestionIndex: 3,
        answers: [],
        lastUpdated: Date.now()
      }
      store.progress = progress

      const result = store.getProgress()
      expect(result).toBe(progress)
      expect(localStorageMock.getItem).not.toHaveBeenCalled()
    })

    it('should load progress from localStorage if not in state', () => {
      const savedProgress = {
        currentQuestionIndex: 10,
        answers: [
          { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() }
        ],
        lastUpdated: Date.now()
      }
      
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedProgress))
      
      const result = store.getProgress()
      
      expect(result).toEqual(savedProgress)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('haqei_progress')
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json')
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      store.loadFromStorage()
      
      expect(consoleSpy).toHaveBeenCalled()
      expect(store.progress).toBeNull()
      
      consoleSpy.mockRestore()
    })
  })

  describe('hasProgress computed', () => {
    it('should return false when no progress', () => {
      expect(store.hasProgress).toBe(false)
    })

    it('should return false when progress has no answers', () => {
      store.progress = {
        currentQuestionIndex: 0,
        answers: [],
        lastUpdated: Date.now()
      }
      expect(store.hasProgress).toBe(false)
    })

    it('should return true when progress has answers', () => {
      store.progress = {
        currentQuestionIndex: 1,
        answers: [
          { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() }
        ],
        lastUpdated: Date.now()
      }
      expect(store.hasProgress).toBe(true)
    })
  })

  describe('isComplete computed', () => {
    it('should return false when no progress', () => {
      expect(store.isComplete).toBe(false)
    })

    it('should return false when not all questions answered', () => {
      store.progress = {
        currentQuestionIndex: 5,
        answers: Array.from({ length: 5 }, (_, i) => ({
          questionId: `q${i + 1}`,
          selectedValue: 'a',
          timestamp: Date.now()
        })),
        lastUpdated: Date.now()
      }
      expect(store.isComplete).toBe(false)
    })

    it('should return true when all questions answered', () => {
      // Assuming ALL_QUESTIONS has 30 questions (mocked in the test)
      store.progress = {
        currentQuestionIndex: 29,
        answers: Array.from({ length: 30 }, (_, i) => ({
          questionId: `q${i + 1}`,
          selectedValue: 'a',
          timestamp: Date.now()
        })),
        lastUpdated: Date.now()
      }
      expect(store.isComplete).toBe(true)
    })
  })

  describe('completeAnalysis', () => {
    it('should complete analysis successfully', async () => {
      const answers: Answer[] = Array.from({ length: 30 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: i < 24 ? 'a' : 'inner_a|outer_b',
        timestamp: Date.now(),
        scoring_tags: [
          { key: '乾_創造性', value: 3 },
          { key: '震_行動性', value: 2 }
        ]
      }))

      await store.completeAnalysis(answers)

      expect(store.isAnalyzing).toBe(false)
      expect(store.analysisResult).toBeDefined()
      expect(store.tripleOSResult).toBeDefined()
      
      // Check localStorage calls
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'haqei_analysis_result',
        expect.any(String)
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'haqei_triple_os_result',
        expect.any(String)
      )
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('haqei_progress')
      
      // Check analysis result structure
      expect(store.analysisResult!.primaryHexagram).toBe(1)
      expect(store.analysisResult!.dimensionScores).toBeInstanceOf(Map)
      expect(store.analysisResult!.compatibility).toBeGreaterThan(0)
      expect(store.analysisResult!.timestamp).toBeDefined()
    })

    it('should set isAnalyzing during analysis', async () => {
      const answers: Answer[] = []
      
      const promise = store.completeAnalysis(answers)
      expect(store.isAnalyzing).toBe(true)
      
      await promise
      expect(store.isAnalyzing).toBe(false)
    })

    it('should handle analysis errors', async () => {
      // Mock calculator to throw error
      const { calculator } = await import('@/utils/calculator')
      vi.mocked(calculator.buildUserVector).mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await expect(store.completeAnalysis([])).rejects.toThrow('Test error')
      expect(store.isAnalyzing).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('clearData', () => {
    it('should clear all data and localStorage', () => {
      // Set some data
      store.progress = {
        currentQuestionIndex: 5,
        answers: [],
        lastUpdated: Date.now()
      }
      store.analysisResult = {
        dimensionScores: new Map(),
        primaryHexagram: 1,
        compatibility: 80,
        timestamp: Date.now()
      }
      store.tripleOSResult = {} as any

      store.clearData()

      expect(store.progress).toBeNull()
      expect(store.analysisResult).toBeNull()
      expect(store.tripleOSResult).toBeNull()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('haqei_progress')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('haqei_analysis_result')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('haqei_triple_os_result')
    })
  })

  describe('loadFromStorage', () => {
    it('should load saved data from localStorage', () => {
      const savedProgress = {
        currentQuestionIndex: 15,
        answers: [
          { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() }
        ],
        lastUpdated: Date.now()
      }

      const savedResult = {
        dimensionScores: {
          '乾_創造性': 80,
          '震_行動性': 70
        },
        primaryHexagram: 1,
        compatibility: 85,
        timestamp: Date.now()
      }

      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(savedProgress))
        .mockReturnValueOnce(JSON.stringify(savedResult))

      store.loadFromStorage()

      expect(store.progress).toEqual(savedProgress)
      expect(store.analysisResult).toBeDefined()
      expect(store.analysisResult!.dimensionScores).toBeInstanceOf(Map)
      expect(store.analysisResult!.dimensionScores.get('乾_創造性')).toBe(80)
    })

    it('should handle missing data in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)

      store.loadFromStorage()

      expect(store.progress).toBeNull()
      expect(store.analysisResult).toBeNull()
    })

    it('should convert dimensionScores object back to Map', () => {
      const savedResult = {
        dimensionScores: {
          '乾_創造性': 85,
          '震_行動性': 72,
          '坎_探求性': 63,
          '艮_安定性': 55,
          '坤_受容性': 48,
          '巽_適応性': 68,
          '離_表現性': 77,
          '兌_調和性': 82
        },
        primaryHexagram: 1,
        compatibility: 90,
        timestamp: Date.now()
      }

      localStorageMock.getItem
        .mockReturnValueOnce(null) // No progress
        .mockReturnValueOnce(JSON.stringify(savedResult))

      store.loadFromStorage()

      const scores = store.analysisResult!.dimensionScores
      expect(scores).toBeInstanceOf(Map)
      expect(scores.size).toBe(8)
      expect(scores.get('乾_創造性')).toBe(85)
      expect(scores.get('兌_調和性')).toBe(82)
    })
  })
})