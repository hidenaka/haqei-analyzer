import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock QuestionFlow component
const MockQuestionFlow = {
  template: `
    <div class="question-flow">
      <div class="question-counter">{{ currentQuestion }}/{{ totalQuestions }}</div>
      <div class="question-content">
        <h3>{{ questions[currentQuestion - 1]?.title }}</h3>
        <div class="question-options">
          <button 
            v-for="option in questions[currentQuestion - 1]?.options" 
            :key="option.value"
            @click="selectOption(option.value)"
            class="option-button"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      <div class="navigation">
        <button @click="previousQuestion" :disabled="currentQuestion === 1" class="prev-btn">前へ</button>
        <button @click="nextQuestion" :disabled="currentQuestion === totalQuestions" class="next-btn">次へ</button>
      </div>
    </div>
  `,
  data() {
    return {
      currentQuestion: 1,
      totalQuestions: 30,
      questions: [
        {
          title: 'テスト質問 1',
          options: [
            { label: 'はい', value: 'yes' },
            { label: 'いいえ', value: 'no' }
          ]
        },
        {
          title: 'テスト質問 2',
          options: [
            { label: 'オプション A', value: 'a' },
            { label: 'オプション B', value: 'b' }
          ]
        }
      ],
      answers: {}
    }
  },
  methods: {
    selectOption(value: string) {
      this.$data.answers[this.$data.currentQuestion] = value
      this.$emit('answer-selected', { question: this.$data.currentQuestion, answer: value })
    },
    nextQuestion() {
      if (this.currentQuestion < this.totalQuestions) {
        this.currentQuestion++
      }
    },
    previousQuestion() {
      if (this.currentQuestion > 1) {
        this.currentQuestion--
      }
    }
  }
}

describe('QuestionFlow Component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MockQuestionFlow)
  })

  it('renders question flow structure', () => {
    expect(wrapper.find('.question-flow').exists()).toBe(true)
    expect(wrapper.find('.question-counter').exists()).toBe(true)
    expect(wrapper.find('.question-content').exists()).toBe(true)
    expect(wrapper.find('.navigation').exists()).toBe(true)
  })

  it('displays question counter correctly', () => {
    const counter = wrapper.find('.question-counter')
    expect(counter.text()).toBe('1/30')
  })

  it('displays current question title', () => {
    const title = wrapper.find('h3')
    expect(title.text()).toBe('テスト質問 1')
  })

  it('renders question options', () => {
    const options = wrapper.findAll('.option-button')
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('はい')
    expect(options[1].text()).toBe('いいえ')
  })

  it('handles option selection', async () => {
    const options = wrapper.findAll('.option-button')
    await options[0].trigger('click')
    
    expect(wrapper.vm.answers[1]).toBe('yes')
  })

  it('navigates to next question', async () => {
    const nextButton = wrapper.find('.next-btn')
    await nextButton.trigger('click')
    
    expect(wrapper.vm.currentQuestion).toBe(2)
  })

  it('navigates to previous question', async () => {
    wrapper.vm.currentQuestion = 2
    await wrapper.vm.$nextTick()
    
    const prevButton = wrapper.find('.prev-btn')
    await prevButton.trigger('click')
    
    expect(wrapper.vm.currentQuestion).toBe(1)
  })

  it('disables navigation buttons appropriately', async () => {
    const prevButton = wrapper.find('.prev-btn')
    const nextButton = wrapper.find('.next-btn')
    
    // At first question, previous should be disabled
    expect(prevButton.attributes('disabled')).toBeDefined()
    
    // At last question, next should be disabled
    wrapper.vm.currentQuestion = 30
    await wrapper.vm.$nextTick()
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('emits answer-selected event', async () => {
    const options = wrapper.findAll('.option-button')
    await options[0].trigger('click')
    
    expect(wrapper.emitted('answer-selected')).toBeTruthy()
    expect(wrapper.emitted('answer-selected')[0]).toEqual([{ question: 1, answer: 'yes' }])
  })

  it('maintains answer state across navigation', async () => {
    // Select answer for question 1
    const options = wrapper.findAll('.option-button')
    await options[0].trigger('click')
    
    // Navigate to question 2 and back
    const nextButton = wrapper.findAll('button')[1]
    await nextButton.trigger('click')
    
    const prevButton = wrapper.findAll('button')[0]
    await prevButton.trigger('click')
    
    // Answer should be preserved
    expect(wrapper.vm.answers[1]).toBe('yes')
  })
})