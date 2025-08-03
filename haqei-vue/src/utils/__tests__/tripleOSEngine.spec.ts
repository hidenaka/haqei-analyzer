/**
 * TripleOSEngine.ts のユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { TripleOSEngine } from '../tripleOSEngine'
import type { Answer } from '@/data/types'

describe('TripleOSEngine', () => {
  let engine: TripleOSEngine

  beforeEach(() => {
    engine = new TripleOSEngine()
  })

  describe('analyzeUser', () => {
    it('should complete Triple OS analysis with valid answers', async () => {
      const mockAnswers: Answer[] = [
        // Worldview questions (q1-q24)
        ...Array.from({ length: 24 }, (_, i) => ({
          questionId: `q${i + 1}`,
          selectedValue: 'a',
          timestamp: Date.now(),
          scoring_tags: [
            { key: '乾_創造性', value: 3 },
            { key: '震_行動性', value: 2 }
          ]
        })),
        // Scenario questions (q25-q30)
        ...Array.from({ length: 6 }, (_, i) => ({
          questionId: `q${i + 25}`,
          selectedValue: 'inner_a|outer_b',
          timestamp: Date.now(),
          innerChoice: { text: '慎重に考える' },
          outerChoice: { text: 'リーダーシップを発揮' }
        }))
      ]

      const result = await engine.analyzeUser(mockAnswers)

      // Basic structure check
      expect(result).toHaveProperty('engineOS')
      expect(result).toHaveProperty('interfaceOS')
      expect(result).toHaveProperty('safeModeOS')
      expect(result).toHaveProperty('consistencyScore')
      expect(result).toHaveProperty('misalignmentData')
      expect(result).toHaveProperty('integrationInsights')

      // Engine OS check
      expect(result.engineOS).toHaveProperty('hexagramId')
      expect(result.engineOS).toHaveProperty('hexagramName')
      expect(result.engineOS).toHaveProperty('primaryTrigram')
      expect(result.engineOS).toHaveProperty('secondaryTrigram')
      expect(result.engineOS).toHaveProperty('trigramEnergies')
      expect(result.engineOS.matchType).toBe('direct_calculation')

      // Interface OS check
      expect(result.interfaceOS).toHaveProperty('keywordMatching')
      expect(result.interfaceOS.matchType).toBe('keyword_matching')

      // SafeMode OS check
      expect(result.safeModeOS).toHaveProperty('keywordMatching')
      expect(result.safeModeOS.matchType).toBe('keyword_matching')

      // Consistency score should be between 0 and 100
      expect(result.consistencyScore).toBeGreaterThanOrEqual(0)
      expect(result.consistencyScore).toBeLessThanOrEqual(100)

      // Bunenjin implementation data
      expect(result.bunenjinImplementation).toBeDefined()
      expect(result.bunenjinImplementation?.philosophicalAlignment).toHaveProperty('supportsDividedPersonality')
      expect(result.bunenjinImplementation?.philosophicalAlignment.supportsDividedPersonality).toBe(true)
    })

    it('should handle empty answers gracefully', async () => {
      const result = await engine.analyzeUser([])

      expect(result).toBeDefined()
      expect(result.engineOS).toBeDefined()
      expect(result.interfaceOS).toBeDefined()
      expect(result.safeModeOS).toBeDefined()
    })

    it('should separate worldview and scenario questions correctly', async () => {
      const mixedAnswers: Answer[] = [
        { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() },
        { questionId: 'q25', selectedValue: 'b', timestamp: Date.now() },
        { questionId: 'q10', selectedValue: 'c', timestamp: Date.now() },
        { questionId: 'q30', selectedValue: 'd', timestamp: Date.now() },
        { questionId: 'q24', selectedValue: 'e', timestamp: Date.now() }
      ]

      const result = await engine.analyzeUser(mixedAnswers)
      
      // Should process all questions despite mixed order
      expect(result).toBeDefined()
      expect(result.engineOS).toBeDefined()
    })
  })

  describe('Trigram Energy Calculation', () => {
    it('should calculate normalized trigram energies', () => {
      const mockAnswers: Answer[] = [
        {
          questionId: 'q1',
          selectedValue: 'a',
          timestamp: Date.now(),
          scoring_tags: [
            { key: '乾_創造性', value: 10 },
            { key: '震_行動性', value: 5 },
            { key: '坎_探求性', value: 3 }
          ]
        }
      ]

      // We need to test through the public interface
      engine.analyzeUser(mockAnswers).then(result => {
        const energies = result.engineOS.trigramEnergies
        
        // Should have all 8 trigrams
        expect(Object.keys(energies)).toHaveLength(8)
        
        // Highest energy should be normalized to 100
        const maxEnergy = Math.max(...Object.values(energies))
        expect(maxEnergy).toBe(100)
        
        // 乾 should have the highest energy
        expect(energies['乾']).toBe(100)
      })
    })
  })

  describe('Consistency Calculation', () => {
    it('should calculate consistency between OS pairs', async () => {
      const mockAnswers: Answer[] = Array.from({ length: 30 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: 'a',
        timestamp: Date.now()
      }))

      const result = await engine.analyzeUser(mockAnswers)
      const misalignment = result.misalignmentData

      expect(misalignment).toBeDefined()
      expect(misalignment?.pairScores).toHaveProperty('engineInterface')
      expect(misalignment?.pairScores).toHaveProperty('engineSafeMode')
      expect(misalignment?.pairScores).toHaveProperty('interfaceSafeMode')

      // All pair scores should be between 0 and 100
      Object.values(misalignment?.pairScores || {}).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      })
    })

    it('should categorize risk levels correctly', async () => {
      const mockAnswers: Answer[] = Array.from({ length: 30 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: 'a',
        timestamp: Date.now()
      }))

      const result = await engine.analyzeUser(mockAnswers)
      const riskLevel = result.misalignmentData?.riskLevel

      expect(riskLevel).toBeDefined()
      expect(['低リスク', '中リスク', '高リスク', '非常に高リスク']).toContain(riskLevel)
    })
  })

  describe('Keyword Matching', () => {
    it('should extract keywords from scenario choices', async () => {
      const mockAnswers: Answer[] = [
        // Add worldview questions
        ...Array.from({ length: 24 }, (_, i) => ({
          questionId: `q${i + 1}`,
          selectedValue: 'a',
          timestamp: Date.now()
        })),
        // Scenario with keywords
        {
          questionId: 'q25',
          selectedValue: 'inner_a|outer_b',
          timestamp: Date.now(),
          innerChoice: { text: '慎重に分析的に考える' },
          outerChoice: { text: 'リーダーシップを発揮して協調性を示す' }
        }
      ]

      const result = await engine.analyzeUser(mockAnswers)

      // Interface OS should have keyword matching results
      expect(result.interfaceOS.keywordMatching).toBeDefined()
      expect(result.interfaceOS.keywordMatching.keywords).toBeInstanceOf(Array)
      
      // SafeMode OS should have keyword matching results
      expect(result.safeModeOS.keywordMatching).toBeDefined()
      expect(result.safeModeOS.keywordMatching.keywords).toBeInstanceOf(Array)
    })
  })

  describe('Integration Insights', () => {
    it('should generate basic integration insights', async () => {
      const mockAnswers: Answer[] = Array.from({ length: 30 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: 'a',
        timestamp: Date.now()
      }))

      const result = await engine.analyzeUser(mockAnswers)

      expect(result.integrationInsights).toBeDefined()
      expect(result.integrationInsights).toBeInstanceOf(Array)
      expect(result.integrationInsights?.length).toBeGreaterThan(0)

      // Check insight structure
      const firstInsight = result.integrationInsights?.[0]
      expect(firstInsight).toHaveProperty('type')
      expect(firstInsight).toHaveProperty('title')
      expect(firstInsight).toHaveProperty('content')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid question IDs gracefully', async () => {
      const invalidAnswers: Answer[] = [
        { questionId: 'invalid', selectedValue: 'a', timestamp: Date.now() },
        { questionId: 'q999', selectedValue: 'b', timestamp: Date.now() }
      ]

      // Should not throw, but handle gracefully
      await expect(engine.analyzeUser(invalidAnswers)).resolves.toBeDefined()
    })

    it('should handle missing scoring tags', async () => {
      const answersWithoutTags: Answer[] = [
        { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() },
        { questionId: 'q2', selectedValue: 'b', timestamp: Date.now() }
      ]

      const result = await engine.analyzeUser(answersWithoutTags)
      expect(result).toBeDefined()
      expect(result.engineOS).toBeDefined()
    })
  })
})