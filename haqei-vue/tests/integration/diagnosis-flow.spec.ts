/**
 * 診断フロー統合テスト
 * 質問回答から分析完了までの一連の流れをテスト
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import QuestionFlow from '@/components/QuestionFlow.vue'
import { useAnalysisStore } from '@/stores/analysis'
import type { Answer } from '@/data/types'

// Create test router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/questions', component: QuestionFlow },
    { path: '/analysis', component: { template: '<div>Analysis</div>' } }
  ]
})

describe('Diagnosis Flow Integration', () => {
  beforeEach(async () => {
    // Setup
    setActivePinia(createPinia())
    router.push('/questions')
    await router.isReady()
  })

  describe('Complete flow', () => {
    it('should complete entire diagnosis flow', async () => {
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [router],
          stubs: {
            HButton: {
              template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot /></button>',
              props: ['disabled', 'variant', 'size']
            },
            ProgressIndicator: {
              template: '<div class="progress-indicator">{{ currentStep }}/{{ totalSteps }}</div>',
              props: ['currentStep', 'totalSteps', 'answered']
            }
          }
        }
      })

      const store = useAnalysisStore()

      // Answer all questions
      for (let i = 0; i < 30; i++) {
        // Select an answer
        if (i < 24) {
          // Regular questions
          const firstOption = wrapper.find('input[type="radio"]')
          await firstOption.setValue(true)
        } else {
          // Scenario questions
          const innerOption = wrapper.find(`input[name="inner-q${i + 1}"]`)
          const outerOption = wrapper.find(`input[name="outer-q${i + 1}"]`)
          await innerOption.setValue(true)
          await outerOption.setValue(true)
        }

        // Click next (or complete on last question)
        const isLastQuestion = i === 29
        const buttonText = isLastQuestion ? '完了' : '次の質問'
        const button = wrapper.findAll('button').find(b => b.text().includes(buttonText))
        
        if (button) {
          await button.trigger('click')
          await flushPromises()
        }
      }

      // Verify analysis completed
      expect(store.isComplete).toBe(true)
      expect(store.analysisResult).toBeDefined()
      expect(store.tripleOSResult).toBeDefined()
      
      // Verify navigation to analysis page
      expect(router.currentRoute.value.path).toBe('/analysis')
    })

    it('should save and restore progress', async () => {
      const store = useAnalysisStore()

      // Create initial progress
      const initialAnswers: Answer[] = [
        { questionId: 'q1', selectedValue: 'a', timestamp: Date.now() },
        { questionId: 'q2', selectedValue: 'b', timestamp: Date.now() },
        { questionId: 'q3', selectedValue: 'c', timestamp: Date.now() }
      ]

      store.saveProgress({
        currentQuestionIndex: 3,
        answers: initialAnswers,
        lastUpdated: Date.now()
      })

      // Mount component
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()

      // Should restore to question 4 (index 3)
      expect(wrapper.vm.currentQuestionIndex).toBe(3)
      expect(wrapper.vm.answers).toHaveLength(3)
      
      // Should show question 4
      const questionText = wrapper.find('.question-text')
      expect(questionText.exists()).toBe(true)
    })

    it('should validate answers before proceeding', async () => {
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [router]
        }
      })

      // Try to proceed without selecting answer
      const nextButton = wrapper.findAll('button').find(b => b.text().includes('次の質問'))
      expect(nextButton?.attributes('disabled')).toBeDefined()

      // Select invalid answer for scenario question
      wrapper.vm.currentQuestionIndex = 24 // Jump to scenario question
      await wrapper.vm.$nextTick()

      // Select only inner choice
      const innerOption = wrapper.find('input[name="inner-q25"]')
      await innerOption.setValue(true)

      // Should still be disabled
      const completeButton = wrapper.findAll('button').find(b => b.text().includes('次の質問'))
      expect(completeButton?.attributes('disabled')).toBeDefined()
    })
  })

  describe('Data consistency', () => {
    it('should maintain data consistency through localStorage', async () => {
      const store = useAnalysisStore()

      // Create some progress
      const answers: Answer[] = Array.from({ length: 10 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: 'a',
        timestamp: Date.now(),
        scoring_tags: [
          { key: '乾_創造性', value: 3 }
        ]
      }))

      store.saveProgress({
        currentQuestionIndex: 10,
        answers,
        lastUpdated: Date.now()
      })

      // Simulate page reload by creating new store
      const newPinia = createPinia()
      setActivePinia(newPinia)
      const newStore = useAnalysisStore()

      // Should load from localStorage
      const progress = newStore.getProgress()
      expect(progress).toBeDefined()
      expect(progress?.answers).toHaveLength(10)
      expect(progress?.currentQuestionIndex).toBe(10)
    })

    it('should clear progress after completion', async () => {
      const store = useAnalysisStore()

      // Complete analysis
      const answers: Answer[] = Array.from({ length: 30 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: i < 24 ? 'a' : 'inner_a|outer_b',
        timestamp: Date.now(),
        scoring_tags: [
          { key: '乾_創造性', value: 3 }
        ]
      }))

      await store.completeAnalysis(answers)

      // Progress should be cleared
      expect(store.progress).toBeNull()
      expect(localStorage.getItem('haqei_progress')).toBeNull()
      
      // Result should be saved
      expect(store.analysisResult).toBeDefined()
      expect(localStorage.getItem('haqei_analysis_result')).toBeDefined()
    })
  })

  describe('Error handling', () => {
    it('should handle analysis errors gracefully', async () => {
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [router]
        }
      })

      const store = useAnalysisStore()

      // Mock analysis to fail
      const originalCompleteAnalysis = store.completeAnalysis
      store.completeAnalysis = vi.fn().mockRejectedValue(new Error('Analysis failed'))

      // Complete all questions
      wrapper.vm.answers = Array.from({ length: 30 }, (_, i) => ({
        questionId: `q${i + 1}`,
        selectedValue: 'a',
        timestamp: Date.now()
      }))
      wrapper.vm.currentQuestionIndex = 29

      // Try to complete
      const completeButton = wrapper.findAll('button').find(b => b.text().includes('完了'))
      await completeButton?.trigger('click')
      await flushPromises()

      // Should show error (component should handle this)
      expect(store.completeAnalysis).toHaveBeenCalled()
      
      // Should not navigate away
      expect(router.currentRoute.value.path).toBe('/questions')

      // Restore original function
      store.completeAnalysis = originalCompleteAnalysis
    })
  })

  describe('Performance', () => {
    it('should handle rapid answer selection', async () => {
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [router]
        }
      })

      // Rapidly select and change answers
      for (let i = 0; i < 5; i++) {
        const options = wrapper.findAll('input[type="radio"]')
        for (const option of options) {
          await option.setValue(true)
        }
      }

      // Should have only one answer selected
      const selectedOptions = wrapper.findAll('input[type="radio"]:checked')
      expect(selectedOptions).toHaveLength(1)
    })

    it('should debounce localStorage saves', async () => {
      const wrapper = mount(QuestionFlow, {
        global: {
          plugins: [router]
        }
      })

      const store = useAnalysisStore()
      const saveSpy = vi.spyOn(store, 'saveProgress')

      // Rapidly change answers
      for (let i = 0; i < 10; i++) {
        const firstOption = wrapper.find('input[type="radio"]')
        await firstOption.setValue(true)
        await firstOption.setValue(false)
      }

      // Should not save on every change
      expect(saveSpy.mock.calls.length).toBeLessThan(20)
    })
  })
})