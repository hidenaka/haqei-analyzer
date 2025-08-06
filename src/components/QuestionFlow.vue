<template>
  <div class="question-flow" :class="{ 'fullscreen': isFullscreen }">
    <!-- プログレスバー -->
    <div class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progressPercentage}%` }"
          :aria-valuenow="progressPercentage"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div class="progress-text">
        {{ currentStep }} / {{ totalSteps }} 
        ({{ Math.round(progressPercentage) }}%)
      </div>
    </div>

    <!-- bunenjin哲学コンテキスト -->
    <div v-if="bunenjinContext" class="bunenjin-context">
      <div class="context-icon">🏵️</div>
      <p>{{ bunenjinContext }}</p>
    </div>

    <!-- 質問表示 -->
    <div v-if="currentQuestion" class="question-container">
      <div class="question-header">
        <h2 class="question-title">{{ currentQuestion.text }}</h2>
        <div v-if="currentQuestion.bunenjinContext" class="question-context">
          <small>{{ currentQuestion.bunenjinContext }}</small>
        </div>
      </div>

      <!-- 質問タイプ別入力 -->
      <div class="answer-container">
        <!-- Single Choice -->
        <div 
          v-if="currentQuestion.type === 'single' && currentQuestion.options"
          class="answer-single"
        >
          <div 
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{ active: selectedAnswer === option }"
            @click="selectOption(option)"
          >
            <input
              :id="`option-${index}`"
              v-model="selectedAnswer"
              type="radio"
              :value="option"
              :name="`question-${currentQuestion.id}`"
              class="option-input"
            />
            <label 
              :for="`option-${index}`"
              class="option-label"
            >
              {{ option }}
            </label>
          </div>
        </div>

        <!-- Multiple Choice -->
        <div 
          v-else-if="currentQuestion.type === 'multiple' && currentQuestion.options"
          class="answer-multiple"
        >
          <div 
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
          >
            <input
              :id="`multi-option-${index}`"
              v-model="multipleAnswers"
              type="checkbox"
              :value="option"
              class="option-input"
            />
            <label 
              :for="`multi-option-${index}`"
              class="option-label"
            >
              {{ option }}
            </label>
          </div>
        </div>

        <!-- Scale -->
        <div 
          v-else-if="currentQuestion.type === 'scale' && currentQuestion.scaleRange"
          class="answer-scale"
        >
          <div class="scale-container">
            <input
              v-model.number="scaleValue"
              type="range"
              :min="currentQuestion.scaleRange.min"
              :max="currentQuestion.scaleRange.max"
              :step="currentQuestion.scaleRange.step"
              class="scale-input"
            />
            <div class="scale-value">{{ scaleValue }}</div>
          </div>
          <div class="scale-labels">
            <span class="scale-min">{{ currentQuestion.scaleRange.min }}</span>
            <span class="scale-max">{{ currentQuestion.scaleRange.max }}</span>
          </div>
        </div>

        <!-- Text -->
        <div 
          v-else-if="currentQuestion.type === 'text'"
          class="answer-text"
        >
          <textarea
            v-model="textAnswer"
            :placeholder="`質問への回答を入力してください...`"
            class="text-input"
            rows="4"
          ></textarea>
          <div class="text-counter">
            {{ textAnswer.length }} / 500文字
          </div>
        </div>
      </div>

      <!-- 確信度スライダー -->
      <div v-if="showConfidenceSlider" class="confidence-container">
        <label for="confidence" class="confidence-label">
          回答の確信度: {{ confidence }}%
        </label>
        <input
          id="confidence"
          v-model.number="confidence"
          type="range"
          min="0"
          max="100"
          step="5"
          class="confidence-input"
        />
      </div>

      <!-- I Ching ガイダンス -->
      <div v-if="currentQuestion.ichingConnection" class="iching-guidance">
        <div class="iching-header">
          <span class="iching-icon">☯</span>
          <span class="iching-title">易経の智慧</span>
        </div>
        <p class="iching-text">
          この質問は第{{ currentQuestion.ichingConnection }}卦と関連があります。
          内なる声に耳を傾け、直感を大切にしてください。
        </p>
      </div>
    </div>

    <!-- ナビゲーションボタン -->
    <div class="navigation-container">
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="!canGoBack"
        @click="goBack"
      >
        ← 前へ
      </button>

      <button
        type="button"
        class="btn btn-primary"
        :disabled="!canProceed"
        @click="proceed"
      >
        {{ isLastQuestion ? '完了' : '次へ →' }}
      </button>
    </div>

    <!-- エラーメッセージ -->
    <div v-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <div class="error-message">{{ error.message }}</div>
      <div v-if="error.bunenjinGuidance" class="error-guidance">
        {{ error.bunenjinGuidance }}
      </div>
    </div>

    <!-- ローディング状態 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">処理中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { 
  Question, 
  Answer, 
  TripleOSResult, 
  HAQEIError,
  NavigationState 
} from '@/types'

// ====================================
// Props & Emits Definition
// ====================================

interface Props {
  questions: Question[]
  initialStep?: number
  showConfidenceSlider?: boolean
  bunenjinMode?: boolean
  ichingMode?: boolean
  fullscreen?: boolean
}

interface Emits {
  (e: 'complete', result: TripleOSResult): void
  (e: 'progress', step: number, total: number): void
  (e: 'answer', questionId: string, answer: Answer): void
  (e: 'error', error: HAQEIError): void
  (e: 'navigation', state: NavigationState): void
}

const props = withDefaults(defineProps<Props>(), {
  initialStep: 0,
  showConfidenceSlider: true,
  bunenjinMode: true,
  ichingMode: true,
  fullscreen: false
})

const emit = defineEmits<Emits>()

// ====================================
// Reactive State
// ====================================

const currentStep = ref<number>(props.initialStep)
const answers = ref<Answer[]>([])
const loading = ref<boolean>(false)
const error = ref<HAQEIError | null>(null)

// 質問回答状態
const selectedAnswer = ref<string>('')
const multipleAnswers = ref<string[]>([])
const scaleValue = ref<number>(5)
const textAnswer = ref<string>('')
const confidence = ref<number>(80)

// UI状態
const isFullscreen = ref<boolean>(props.fullscreen)
const responseStartTime = ref<number>(0)

// ====================================
// Computed Properties
// ====================================

const totalSteps = computed((): number => props.questions.length)

const currentQuestion = computed((): Question | null => {
  return props.questions[currentStep.value] || null
})

const progressPercentage = computed((): number => {
  if (totalSteps.value === 0) return 0
  return (currentStep.value / totalSteps.value) * 100
})

const isLastQuestion = computed((): boolean => {
  return currentStep.value === totalSteps.value - 1
})

const canGoBack = computed((): boolean => {
  return currentStep.value > 0
})

const canProceed = computed((): boolean => {
  if (!currentQuestion.value) return false
  
  switch (currentQuestion.value.type) {
    case 'single':
      return selectedAnswer.value.length > 0
    case 'multiple':
      return multipleAnswers.value.length > 0
    case 'scale':
      return true // スケールは常に値がある
    case 'text':
      return textAnswer.value.trim().length > 0
    default:
      return false
  }
})

const bunenjinContext = computed((): string => {
  if (!props.bunenjinMode) return ''
  
  const contexts = [
    'Multiple Dividualsの視点から、この質問に答えることで新たな「個」を発見できます。',
    '固定化された自己言語に囚われず、柔軟な回答を心がけましょう。',
    '戦略的ナビゲーションの観点から、最適な選択肢を見極めましょう。',
    '自分の中の異なる側面が、この質問にどう反応するか観察してみてください。'
  ]
  
  return contexts[currentStep.value % contexts.length] || ''
})

// ====================================
// Methods
// ====================================

const selectOption = (option: string): void => {
  selectedAnswer.value = option
  recordResponseTime()
}

const recordResponseTime = (): void => {
  if (responseStartTime.value === 0) return
  
  const responseTime = Date.now() - responseStartTime.value
  console.log(`Response time for question ${currentQuestion.value?.id}: ${responseTime}ms`)
}

const resetAnswerState = (): void => {
  selectedAnswer.value = ''
  multipleAnswers.value = []
  scaleValue.value = currentQuestion.value?.scaleRange?.min || 5
  textAnswer.value = ''
  confidence.value = 80
  responseStartTime.value = Date.now()
}

const createAnswer = (): Answer => {
  if (!currentQuestion.value) {
    throw new Error('No current question available')
  }

  let value: string | number | string[]
  
  switch (currentQuestion.value.type) {
    case 'single':
      value = selectedAnswer.value
      break
    case 'multiple':
      value = multipleAnswers.value
      break
    case 'scale':
      value = scaleValue.value
      break
    case 'text':
      value = textAnswer.value.trim()
      break
    default:
      throw new Error(`Unknown question type: ${currentQuestion.value.type}`)
  }

  const answer: Answer = {
    id: `answer-${currentQuestion.value.id}-${Date.now()}`,
    questionId: currentQuestion.value.id,
    value,
    confidence: props.showConfidenceSlider ? confidence.value / 100 : undefined,
    responseTime: Date.now() - responseStartTime.value,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      bunenjinMode: props.bunenjinMode,
      ichingMode: props.ichingMode,
      questionIndex: currentStep.value
    }
  }

  return answer
}

const proceed = async (): Promise<void> => {
  if (!canProceed.value || !currentQuestion.value) return

  try {
    loading.value = true
    error.value = null

    // 回答を作成
    const answer = createAnswer()
    answers.value.push(answer)

    // 回答をemit
    emit('answer', currentQuestion.value.id, answer)

    if (isLastQuestion.value) {
      // 分析完了
      await completeAnalysis()
    } else {
      // 次の質問へ
      currentStep.value++
      resetAnswerState()
      updateNavigationState()
    }

  } catch (err) {
    const haqeiError: HAQEIError = {
      name: 'QuestionFlowError',
      message: err instanceof Error ? err.message : '質問処理中にエラーが発生しました',
      category: 'TECHNICAL',
      severity: 'MEDIUM',
      context: {
        questionId: currentQuestion.value?.id,
        step: currentStep.value,
        questionType: currentQuestion.value?.type
      },
      bunenjinGuidance: 'エラーも学びの機会です。落ち着いて再度お試しください。',
      timestamp: new Date()
    }
    
    error.value = haqeiError
    emit('error', haqeiError)
  } finally {
    loading.value = false
  }
}

const goBack = (): void => {
  if (!canGoBack.value) return

  currentStep.value--
  
  // 前の回答を復元
  const previousAnswer = answers.value[currentStep.value]
  if (previousAnswer) {
    restoreAnswerState(previousAnswer)
  }
  
  updateNavigationState()
}

const restoreAnswerState = (answer: Answer): void => {
  const question = currentQuestion.value
  if (!question) return

  switch (question.type) {
    case 'single':
      selectedAnswer.value = answer.value as string
      break
    case 'multiple':
      multipleAnswers.value = answer.value as string[]
      break
    case 'scale':
      scaleValue.value = answer.value as number
      break
    case 'text':
      textAnswer.value = answer.value as string
      break
  }

  if (answer.confidence !== undefined) {
    confidence.value = answer.confidence * 100
  }
}

const completeAnalysis = async (): Promise<void> => {
  try {
    // TODO: 実際の分析ロジックを実装
    // 現在はモックデータを返す
    
    const mockResult: TripleOSResult = {
      id: `result-${Date.now()}`,
      sessionId: `session-${Date.now()}`,
      engineOS: {
        id: `engine-${Date.now()}`,
        mode: 'engine',
        hexagramId: 1,
        hexagramName: '乾',
        matchPercentage: 85,
        characteristics: [],
        bunenjinAlignment: {
          score: 80,
          strengths: ['戦略的思考', '柔軟性'],
          improvementAreas: ['感情表現'],
          recommendedDividuals: [],
          philosophicalGuidance: 'Multiple Dividualsの活用を推奨'
        },
        systemRecommendations: [],
        compatibilityMatrix: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      interfaceOS: {
        id: `interface-${Date.now()}`,
        mode: 'interface',
        hexagramId: 2,
        hexagramName: '坤',
        matchPercentage: 78,
        characteristics: [],
        bunenjinAlignment: {
          score: 75,
          strengths: ['共感力', '協調性'],
          improvementAreas: ['自己主張'],
          recommendedDividuals: [],
          philosophicalGuidance: '受容的な姿勢を大切に'
        },
        systemRecommendations: [],
        compatibilityMatrix: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      safeModeOS: {
        id: `safe-${Date.now()}`,
        mode: 'safemode',
        hexagramId: 61,
        hexagramName: '中孚',
        matchPercentage: 82,
        characteristics: [],
        bunenjinAlignment: {
          score: 85,
          strengths: ['誠実性', '安定性'],
          improvementAreas: ['冒険心'],
          recommendedDividuals: [],
          philosophicalGuidance: '内なる真実を大切に'
        },
        systemRecommendations: [],
        compatibilityMatrix: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      overallHarmony: 81,
      strategicGuidance: 'バランスの取れた個性です。Multiple Dividualsを活用してさらなる成長を。',
      actionPlan: {
        id: `plan-${Date.now()}`,
        title: '個性発展計画',
        steps: [],
        timeline: '3ヶ月',
        resources: [],
        successMetrics: [],
        riskMitigation: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      futureProjections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    emit('complete', mockResult)
    
  } catch (err) {
    const haqeiError: HAQEIError = {
      name: 'AnalysisError',
      message: '分析処理中にエラーが発生しました',
      category: 'TECHNICAL',
      severity: 'HIGH',
      context: { totalAnswers: answers.value.length },
      bunenjinGuidance: '一時的な困難です。時間をおいて再度お試しください。',
      timestamp: new Date()
    }
    
    error.value = haqeiError
    emit('error', haqeiError)
  }
}

const updateNavigationState = (): void => {
  const state: NavigationState = {
    currentStep: currentStep.value,
    totalSteps: totalSteps.value,
    canGoBack: canGoBack.value,
    canGoForward: canProceed.value,
    progress: progressPercentage.value / 100
  }
  
  emit('navigation', state)
  emit('progress', currentStep.value, totalSteps.value)
}

// ====================================
// Lifecycle Hooks
// ====================================

onMounted(() => {
  resetAnswerState()
  updateNavigationState()
  
  // キーボードショートカット
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey && canProceed.value) {
      event.preventDefault()
      proceed()
    } else if (event.key === 'Escape' && canGoBack.value) {
      event.preventDefault()
      goBack()
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})

// ====================================
// Watchers
// ====================================

watch(
  currentQuestion,
  (newQuestion) => {
    if (newQuestion) {
      resetAnswerState()
    }
  },
  { immediate: true }
)

watch(
  [selectedAnswer, multipleAnswers, scaleValue, textAnswer],
  () => {
    updateNavigationState()
  }
)
</script>

<style scoped>
.question-flow {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.question-flow.fullscreen {
  max-width: none;
  margin: 0;
  border-radius: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  color: #6b7280;
  font-weight: 500;
}

.bunenjin-context {
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.context-icon {
  font-size: 1.5rem;
}

.question-container {
  margin-bottom: 2rem;
}

.question-header {
  margin-bottom: 2rem;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.question-context {
  color: #6b7280;
  font-style: italic;
}

.answer-container {
  margin-bottom: 2rem;
}

/* Single/Multiple Choice Styles */
.answer-single,
.answer-multiple {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.option-item.active {
  border-color: #3b82f6;
  background: #dbeafe;
}

.option-input {
  margin: 0;
}

.option-label {
  flex: 1;
  cursor: pointer;
  font-weight: 500;
}

/* Scale Styles */
.answer-scale {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
}

.scale-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.scale-input {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: #e5e7eb;
  border-radius: 4px;
}

.scale-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

.scale-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
  min-width: 50px;
  text-align: center;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Text Styles */
.answer-text {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
}

.text-input {
  width: 100%;
  border: none;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
}

.text-input:focus {
  outline: none;
}

.text-counter {
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

/* Confidence Slider */
.confidence-container {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.confidence-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.confidence-input {
  width: 100%;
}

/* I Ching Guidance */
.iching-guidance {
  background: #fefbf3;
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.iching-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #92400e;
}

.iching-icon {
  font-size: 1.25rem;
}

.iching-text {
  color: #78350f;
  line-height: 1.6;
  margin: 0;
}

/* Navigation */
.navigation-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Error State */
.error-container {
  background: #fef2f2;
  border: 2px solid #ef4444;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.error-icon {
  font-size: 1.25rem;
  color: #ef4444;
}

.error-message {
  font-weight: 600;
  color: #dc2626;
}

.error-guidance {
  margin-top: 0.5rem;
  color: #7f1d1d;
  font-style: italic;
}

/* Loading State */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #6b7280;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 640px) {
  .question-flow {
    padding: 1rem;
    margin: 1rem;
  }
  
  .question-title {
    font-size: 1.25rem;
  }
  
  .navigation-container {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>