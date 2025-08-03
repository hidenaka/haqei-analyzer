/**
 * Calculator.ts のユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Calculator } from '../calculator'
import type { Answer, ScoringTag } from '@/data/types'

describe('Calculator', () => {
  let calculator: Calculator

  beforeEach(() => {
    calculator = new Calculator()
  })

  describe('buildUserVector', () => {
    it('should initialize all dimensions to 0', () => {
      const vector = calculator.buildUserVector([])
      expect(Object.keys(vector)).toHaveLength(8)
      Object.values(vector).forEach(value => {
        expect(value).toBe(0)
      })
    })

    it('should correctly sum scoring tags', () => {
      const answers: Answer[] = [
        {
          questionId: 'q1',
          selectedValue: 'a',
          timestamp: Date.now(),
          scoring_tags: [
            { key: '乾_創造性', value: 3 },
            { key: '震_行動性', value: 2 }
          ]
        },
        {
          questionId: 'q2',
          selectedValue: 'b',
          timestamp: Date.now(),
          scoring_tags: [
            { key: '乾_創造性', value: 1 },
            { key: '坎_探求性', value: 4 }
          ]
        }
      ]

      const vector = calculator.buildUserVector(answers)
      expect(vector['乾_創造性']).toBe(4) // 3 + 1
      expect(vector['震_行動性']).toBe(2)
      expect(vector['坎_探求性']).toBe(4)
      expect(vector['艮_安定性']).toBe(0)
    })

    it('should handle invalid input gracefully', () => {
      const vector = calculator.buildUserVector(null as any)
      expect(Object.values(vector).every(v => v === 0)).toBe(true)
    })

    it('should apply koui level multipliers', () => {
      const answers: Answer[] = [
        {
          questionId: 'q1',
          selectedValue: 'a',
          timestamp: Date.now(),
          koui_level: 5, // 1.3x multiplier
          scoring_tags: [
            { key: '乾_創造性', value: 10 }
          ]
        }
      ]

      const vector = calculator.buildUserVector(answers)
      // Base value 10 + adjustment (10 * (1.3 - 1.0)) = 10 + 3 = 13
      expect(vector['乾_創造性']).toBe(13)
    })
  })

  describe('getLinePositionMeaning', () => {
    it('should return correct line position info', () => {
      const line1 = calculator.getLinePositionMeaning(1)
      expect(line1).toBeTruthy()
      expect(line1?.name).toBe('初爻')
      expect(line1?.keyword).toBe('慎重')

      const line5 = calculator.getLinePositionMeaning(5)
      expect(line5).toBeTruthy()
      expect(line5?.name).toBe('五爻')
      expect(line5?.keyword).toBe('指導')
    })

    it('should return null for invalid position', () => {
      expect(calculator.getLinePositionMeaning(0)).toBeNull()
      expect(calculator.getLinePositionMeaning(7)).toBeNull()
    })
  })

  describe('analyzeLineRelationships', () => {
    it('should analyze correspondence correctly', () => {
      const hexagramLines = [1, 0, 1, 0, 1, 0] // Alternating yang/yin
      const analysis = calculator.analyzeLineRelationships(hexagramLines)
      
      if ('error' in analysis) {
        throw new Error('Unexpected error in analysis')
      }

      // Check correspondence relationships
      expect(analysis.correspondence).toHaveLength(3)
      
      // First and fourth lines (1, 0) are different = 応
      expect(analysis.correspondence[0].relationship).toBe('応')
      
      // Second and fifth lines (0, 1) are different = 応
      expect(analysis.correspondence[1].relationship).toBe('応')
    })

    it('should handle invalid hexagram lines', () => {
      const result = calculator.analyzeLineRelationships([1, 0, 1]) // Only 3 lines
      expect(result).toHaveProperty('error')
    })

    it('should analyze centrality correctly', () => {
      const hexagramLines = [1, 0, 1, 0, 1, 0]
      const analysis = calculator.analyzeLineRelationships(hexagramLines)
      
      if ('error' in analysis) {
        throw new Error('Unexpected error in analysis')
      }

      // Second position (index 1) has 0 (yin), which is correct for even position
      expect(analysis.centrality.lowerCentral.isCorrectPosition).toBe(true)
      
      // Fifth position (index 4) has 1 (yang), which is correct for odd position
      expect(analysis.centrality.upperCentral.isCorrectPosition).toBe(true)
    })
  })

  describe('calculateCosineSimilarity', () => {
    it('should calculate correct similarity for identical vectors', () => {
      const vector1 = {
        '乾_創造性': 1,
        '震_行動性': 1,
        '坎_探求性': 1,
        '艮_安定性': 1,
        '坤_受容性': 1,
        '巽_適応性': 1,
        '離_表現性': 1,
        '兌_調和性': 1
      }
      
      const similarity = calculator.calculateCosineSimilarity(vector1, vector1)
      expect(similarity).toBeCloseTo(1.0)
    })

    it('should calculate correct similarity for orthogonal vectors', () => {
      const vector1 = {
        '乾_創造性': 1,
        '震_行動性': 0,
        '坎_探求性': 0,
        '艮_安定性': 0,
        '坤_受容性': 0,
        '巽_適応性': 0,
        '離_表現性': 0,
        '兌_調和性': 0
      }
      
      const vector2 = {
        '乾_創造性': 0,
        '震_行動性': 1,
        '坎_探求性': 0,
        '艮_安定性': 0,
        '坤_受容性': 0,
        '巽_適応性': 0,
        '離_表現性': 0,
        '兌_調和性': 0
      }
      
      const similarity = calculator.calculateCosineSimilarity(vector1, vector2)
      expect(similarity).toBeCloseTo(0.0)
    })

    it('should handle zero vectors', () => {
      const zeroVector = {
        '乾_創造性': 0,
        '震_行動性': 0,
        '坎_探求性': 0,
        '艮_安定性': 0,
        '坤_受容性': 0,
        '巽_適応性': 0,
        '離_表現性': 0,
        '兌_調和性': 0
      }
      
      const otherVector = {
        '乾_創造性': 1,
        '震_行動性': 1,
        '坎_探求性': 1,
        '艮_安定性': 1,
        '坤_受容性': 1,
        '巽_適応性': 1,
        '離_表現性': 1,
        '兌_調和性': 1
      }
      
      const similarity = calculator.calculateCosineSimilarity(zeroVector, otherVector)
      expect(similarity).toBe(0)
    })
  })

  describe('convertToVectorArray', () => {
    it('should convert object to array correctly', () => {
      const hexagramData = {
        '乾_創造性': 5,
        '震_行動性': 3,
        '坎_探求性': 2,
        '艮_安定性': 4,
        '坤_受容性': 1,
        '巽_適応性': 6,
        '離_表現性': 7,
        '兌_調和性': 8
      }
      
      const array = calculator.convertToVectorArray(hexagramData)
      expect(array).toEqual([5, 3, 2, 4, 1, 6, 7, 8])
    })

    it('should handle missing properties', () => {
      const incompleteData = {
        '乾_創造性': 5,
        '震_行動性': 3
      }
      
      const array = calculator.convertToVectorArray(incompleteData)
      expect(array).toEqual([5, 3, 0, 0, 0, 0, 0, 0])
    })

    it('should return zero array for invalid input', () => {
      expect(calculator.convertToVectorArray(null)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
      expect(calculator.convertToVectorArray(undefined)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
      expect(calculator.convertToVectorArray('invalid' as any)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
    })
  })

  describe('calculateFinalScore', () => {
    it('should calculate weighted score correctly', () => {
      const userVector = {
        '乾_創造性': 10,
        '震_行動性': 8,
        '坎_探求性': 6,
        '艮_安定性': 4,
        '坤_受容性': 2,
        '巽_適応性': 5,
        '離_表現性': 7,
        '兌_調和性': 9
      }
      
      const osVector = { ...userVector } // Same vector for testing
      
      const score = calculator.calculateFinalScore(userVector, osVector)
      
      // With identical vectors:
      // - Cosine similarity = 1.0
      // - Activation score = 1.0 (same magnitude)
      // - Final score = 1.0 * 0.7 + 1.0 * 0.3 = 1.0
      expect(score).toBeCloseTo(1.0, 2)
    })

    it('should handle errors gracefully', () => {
      const invalidVector = {} as any
      const score = calculator.calculateFinalScore(invalidVector, invalidVector)
      
      // Should return fallback value
      expect(score).toBe(0.5)
    })
  })

  describe('analyzeOSCandidates', () => {
    it('should throw error for invalid input', () => {
      expect(() => {
        calculator.analyzeOSCandidates(null as any, {})
      }).toThrow('ユーザーベクターが無効です')

      expect(() => {
        const validVector = { '乾_創造性': 1 }
        calculator.analyzeOSCandidates(validVector, null as any)
      }).toThrow('ベクターデータが無効です')

      expect(() => {
        const validVector = { '乾_創造性': 1 }
        calculator.analyzeOSCandidates(validVector, {})
      }).toThrow('ベクターデータが空です')
    })

    it('should analyze candidates correctly', () => {
      const userVector = {
        '乾_創造性': 10,
        '震_行動性': 8,
        '坎_探求性': 6,
        '艮_安定性': 4,
        '坤_受容性': 2,
        '巽_適応性': 5,
        '離_表現性': 7,
        '兌_調和性': 9
      }
      
      const vectorsData = {
        '1': { ...userVector }, // Identical
        '2': {
          '乾_創造性': 5,
          '震_行動性': 4,
          '坎_探求性': 3,
          '艮_安定性': 2,
          '坤_受容性': 1,
          '巽_適応性': 2.5,
          '離_表現性': 3.5,
          '兌_調和性': 4.5
        },
        '3': {
          '乾_創造性': 0,
          '震_行動性': 0,
          '坎_探求性': 0,
          '艮_安定性': 0,
          '坤_受容性': 0,
          '巽_適応性': 0,
          '離_表現性': 0,
          '兌_調和性': 1
        }
      }
      
      const result = calculator.analyzeOSCandidates(userVector, vectorsData)
      
      expect(result.candidates).toBeDefined()
      expect(result.candidates.length).toBeLessThanOrEqual(4)
      expect(result.candidates[0].osId).toBe(1) // Should be the identical vector
      expect(result.candidates[0].score).toBeCloseTo(1.0, 1)
      
      expect(result.statistics.totalProcessed).toBe(3)
      expect(result.statistics.validCandidates).toBe(3)
      
      expect(result.transparencyReport).toBeDefined()
    })
  })
})