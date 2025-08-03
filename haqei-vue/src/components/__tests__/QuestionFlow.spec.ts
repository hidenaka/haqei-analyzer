/**
 * QuestionFlow.vue のユニットテスト
 * 診断フローの包括的なテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import QuestionFlow from '../QuestionFlow.vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useRouter } from 'vue-router'
import type { Answer } from '@/data/types'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

// Mock questions data
vi.mock('@/data/questions', () => ({
  WORLDVIEW_QUESTIONS: [
    {
      id: 'q1',
      text: 'Test question 1',
      options: [
        { value: 'a', text: 'Option A', scoring_tags: [{ key: '乾_創造性', value: 3 }] },
        { value: 'b', text: 'Option B', scoring_tags: [{ key: '震_行動性', value: 2 }] }
      ]
    },
    {
      id: 'q2',
      text: 'Test question 2',
      options: [
        { value: 'a', text: 'Option A', scoring_tags: [{ key: '坎_探求性', value: 3 }] },
        { value: 'b', text: 'Option B', scoring_tags: [{ key: '艮_安定性', value: 2 }] }
      ]
    }
  ],
  SCENARIO_QUESTIONS: [
    {
      id: 'q25',
      text: 'Scenario question',
      scenario: 'Test scenario',
      inner_q: 'Inner question?',
      outer_q: 'Outer question?',
      options: {
        inner: [
          { value: 'inner_a', text: 'Inner A', scoring_tags: [] },
          { value: 'inner_b', text: 'Inner B', scoring_tags: [] }
        ],
        outer: [
          { value: 'outer_a', text: 'Outer A', scoring_tags: [] },
          { value: 'outer_b', text: 'Outer B', scoring_tags: [] }
        ]
      }
    }
  ],
  ALL_QUESTIONS: [
    {
      id: 'q1',
      text: 'Test question 1',
      options: [
        { value: 'a', text: 'Option A', scoring_tags: [{ key: '乾_創造性', value: 3 }] },
        { value: 'b', text: 'Option B', scoring_tags: [{ key: '震_行動性', value: 2 }] }
      ]
    },
    {
      id: 'q2',
      text: 'Test question 2',
      options: [
        { value: 'a', text: 'Option A', scoring_tags: [{ key: '坎_探求性', value: 3 }] },
        { value: 'b', text: 'Option B', scoring_tags: [{ key: '艮_安定性', value: 2 }] }
      ]
    },
    {
      id: 'q25',
      text: 'Scenario question',
      scenario: 'Test scenario',
      inner_q: 'Inner question?',
      outer_q: 'Outer question?',
      options: {
        inner: [
          { value: 'inner_a', text: 'Inner A', scoring_tags: [] },
          { value: 'inner_b', text: 'Inner B', scoring_tags: [] }
        ],
        outer: [
          { value: 'outer_a', text: 'Outer A', scoring_tags: [] },
          { value: 'outer_b', text: 'Outer B', scoring_tags: [] }
        ]
      }
    }
  ]
}))

describe('QuestionFlow', () => {
  let wrapper: any
  let store: any
  let router: any

  beforeEach(() => {
    // Create new pinia instance
    setActivePinia(createPinia())
    store = useAnalysisStore()
    
    // Mock router
    router = {
      push: vi.fn()
    }
    ;(useRouter as any).mockReturnValue(router)
    
    // Mount component
    wrapper = mount(QuestionFlow, {
      global: {
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
  })

  describe('Question Display', () => {
    it('should display the first question on mount', () => {
      expect(wrapper.find('.question-text').text()).toBe('Test question 1')
      expect(wrapper.findAll('.option-label')).toHaveLength(2)
    })

    it('should display question counter correctly', () => {
      expect(wrapper.find('.current-question').text()).toBe('1')
      expect(wrapper.find('.total-questions').text()).toBe('/ 3')
    })

    it('should display question type indicator', () => {
      expect(wrapper.find('.question-type-indicator').text()).toContain('価値観質問')
    })

    it('should display scenario questions differently', async () => {
      // Navigate to scenario question
      wrapper.vm.currentQuestionIndex = 2
      await nextTick()

      expect(wrapper.find('.scenario-context').exists()).toBe(true)
      expect(wrapper.find('.scenario-text').text()).toBe('Test scenario')
      expect(wrapper.find('.choice-section.inner-choice').exists()).toBe(true)
      expect(wrapper.find('.choice-section.outer-choice').exists()).toBe(true)
    })
  })

  describe('Answer Selection', () => {
    it('should enable next button when answer is selected', async () => {
      const nextButton = wrapper.findAll('button').find((b: any) => b.text().includes('次の質問'))
      expect(nextButton.attributes('disabled')).toBeDefined()

      // Select an answer
      const radioInput = wrapper.find('input[type="radio"]')
      await radioInput.setValue(true)

      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('should save answer when selected', async () => {
      const saveProgressSpy = vi.spyOn(store, 'saveProgress')
      
      // Select an answer
      const radioInput = wrapper.find('input[type="radio"][value="a"]')
      await radioInput.setValue(true)
      
      expect(saveProgressSpy).toHaveBeenCalled()
      const savedProgress = saveProgressSpy.mock.calls[0][0] as any
      expect(savedProgress.answers).toHaveLength(1)
      expect(savedProgress.answers[0].questionId).toBe('q1')
      expect(savedProgress.answers[0].selectedValue).toBe('a')
    })

    it('should handle scenario question answers', async () => {
      // Navigate to scenario question
      wrapper.vm.currentQuestionIndex = 2
      await nextTick()

      // Select inner choice
      const innerRadio = wrapper.find('input[name="inner-q25"]')
      await innerRadio.setValue(true)

      // Select outer choice
      const outerRadio = wrapper.find('input[name="outer-q25"]')
      await outerRadio.setValue(true)

      // Both should be selected
      expect(wrapper.vm.scenarioAnswers.inner).toBe('inner_a')
      expect(wrapper.vm.scenarioAnswers.outer).toBe('outer_a')
    })
  })

  describe('Navigation', () => {
    it('should navigate to next question', async () => {
      // Select an answer first
      await wrapper.find('input[type="radio"]').setValue(true)
      
      // Click next
      const nextButton = wrapper.findAll('button').find((b: any) => b.text().includes('次の質問'))
      await nextButton.trigger('click')
      await nextTick()

      expect(wrapper.vm.currentQuestionIndex).toBe(1)
      expect(wrapper.find('.question-text').text()).toBe('Test question 2')
    })

    it('should navigate to previous question', async () => {
      // Go to second question first
      wrapper.vm.currentQuestionIndex = 1
      await nextTick()

      // Click previous
      const prevButton = wrapper.findAll('button').find((b: any) => b.text().includes('前の質問'))
      await prevButton.trigger('click')
      await nextTick()

      expect(wrapper.vm.currentQuestionIndex).toBe(0)
      expect(wrapper.find('.question-text').text()).toBe('Test question 1')
    })

    it('should disable previous button on first question', () => {
      const prevButton = wrapper.findAll('button').find((b: any) => b.text().includes('前の質問'))
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('should show completion button on last question', async () => {
      // Navigate to last question
      wrapper.vm.currentQuestionIndex = 2
      await nextTick()

      const buttons = wrapper.findAll('button')
      const completeButton = buttons.find((b: any) => b.text().includes('完了'))
      expect(completeButton.exists()).toBe(true)
    })
  })

  describe('Progress Tracking', () => {
    it('should update progress bar correctly', async () => {
      expect(wrapper.vm.progressPercentage).toBe(33.33333333333333) // 1/3

      // Navigate to next question
      wrapper.vm.currentQuestionIndex = 1
      await nextTick()
      
      expect(wrapper.vm.progressPercentage).toBe(66.66666666666666) // 2/3
    })

    it('should track completed questions', async () => {
      expect(wrapper.vm.completedQuestions).toBe(0)

      // Answer first question
      await wrapper.find('input[type="radio"]').setValue(true)
      
      expect(wrapper.vm.completedQuestions).toBe(1)
    })

    it('should restore progress from saved state', async () => {
      // Simulate saved progress
      const savedAnswers: Answer[] = [
        { questionId: 'q1', selectedValue: 'b', timestamp: Date.now() }
      ]
      
      await store.saveProgress({
        currentQuestionIndex: 1,
        answers: savedAnswers,
        lastUpdated: Date.now()
      })

      // Remount component
      wrapper = mount(QuestionFlow, {
        global: {
          stubs: {
            HButton: true,
            ProgressIndicator: true
          }
        }
      })

      await flushPromises()

      expect(wrapper.vm.currentQuestionIndex).toBe(1)
      expect(wrapper.vm.answers).toHaveLength(1)
    })
  })

  describe('Completion', () => {
    it('should complete analysis when all questions answered', async () => {
      const completeAnalysisSpy = vi.spyOn(store, 'completeAnalysis')
      
      // Answer all questions
      for (let i = 0; i < 3; i++) {
        wrapper.vm.currentQuestionIndex = i
        await nextTick()
        
        if (i < 2) {
          // Regular question
          await wrapper.find('input[type="radio"]').setValue(true)
        } else {
          // Scenario question
          await wrapper.find('input[name="inner-q25"]').setValue(true)
          await wrapper.find('input[name="outer-q25"]').setValue(true)
        }
        
        if (i < 2) {
          const nextButton = wrapper.findAll('button').find((b: any) => b.text().includes('次の質問'))
          await nextButton.trigger('click')
        }
      }

      // Complete on last question
      const completeButton = wrapper.findAll('button').find((b: any) => b.text().includes('完了'))
      await completeButton.trigger('click')
      await flushPromises()

      expect(completeAnalysisSpy).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/analysis')
    })
  })

  describe('Validation', () => {
    it('should show validation errors', async () => {
      // Force a validation error
      wrapper.vm.validationErrors = ['Test validation error']
      await nextTick()

      expect(wrapper.find('.validation-errors').exists()).toBe(true)
      expect(wrapper.find('.error-message').text()).toContain('Test validation error')
    })

    it('should validate scenario answers require both choices', async () => {
      // Navigate to scenario question
      wrapper.vm.currentQuestionIndex = 2
      await nextTick()

      // Select only inner choice
      await wrapper.find('input[name="inner-q25"]').setValue(true)

      // Next button should still be disabled
      const nextButton = wrapper.findAll('button').find((b: any) => b.text().includes('完了'))
      expect(nextButton.attributes('disabled')).toBeDefined()

      // Select outer choice too
      await wrapper.find('input[name="outer-q25"]').setValue(true)

      // Now it should be enabled
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Animations', () => {
    it('should apply transition classes', async () => {
      const questionDisplay = wrapper.find('.question-display-animated')
      expect(questionDisplay.exists()).toBe(true)

      // Trigger transition
      wrapper.vm.transitionState.isTransitioning = true
      await nextTick()

      expect(questionDisplay.classes()).toContain('transitioning')
    })

    it('should animate options on mount', async () => {
      // Options should gradually become visible
      expect(wrapper.vm.visibleOptions.size).toBe(0)
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 300))
      
      expect(wrapper.vm.visibleOptions.size).toBeGreaterThan(0)
    })
  })

  describe('Keyboard Navigation', () => {
    it('should handle arrow key navigation', async () => {
      // Simulate arrow down key
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.vm.focusedIndex).toBe(0)

      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.vm.focusedIndex).toBe(1)

      await wrapper.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.vm.focusedIndex).toBe(0)
    })

    it('should select option with Enter key', async () => {
      // Focus first option
      wrapper.vm.focusedIndex = 0
      await nextTick()

      // Press Enter
      await wrapper.trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.vm.currentAnswer).toBe('a')
    })

    it('should navigate with arrow keys', async () => {
      // Select an answer first
      await wrapper.find('input[type="radio"]').setValue(true)

      // Press right arrow
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.vm.currentQuestionIndex).toBe(1)

      // Press left arrow
      await wrapper.trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.vm.currentQuestionIndex).toBe(0)
    })
  })
})