<template>
  <div class="question-flow-container">
    <!-- Enhanced Progress Indicator -->
    <div class="progress-section">
      <ProgressIndicator 
        :current-step="currentQuestionNum"
        :total-steps="totalQuestions"
        :answered="completedQuestions"
      />
    </div>

    <!-- Progress Header -->
    <div class="question-header">
      <div class="progress-section">
        <div class="progress-info">
          <div class="question-counter">
            <span class="current-question">{{ currentQuestionNum }}</span>
            <span class="total-questions">/ {{ totalQuestions }}</span>
          </div>
          <div class="question-type-indicator">
            <span class="type-icon">{{ questionIcon }}</span>
            <span class="type-text">{{ questionType }}</span>
          </div>
        </div>
        <div class="progress-visual">
          <div class="progress-bar-container">
            <div class="progress-bar-track"></div>
            <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
            <div 
              class="progress-milestone" 
              :style="{ left: milestonePosition + '%' }" 
              title="価値観質問完了"
            ></div>
          </div>
          <div class="completion-stats">
            <span class="completed-count">{{ completedQuestions }}</span>
            <span class="completed-label">問完了</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Errors -->
    <transition name="slide-down">
      <div v-if="validationErrors.length > 0" class="validation-errors">
        <div v-for="(error, index) in validationErrors" :key="index" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
      </div>
    </transition>

    <!-- Question Content -->
    <div class="question-content" ref="questionContainer">
      <transition :name="transitionState.animationClass" mode="out-in">
        <div 
          :key="currentQuestion.id" 
          class="question-display-animated"
          :class="{ 'transitioning': transitionState.isTransitioning }"
        >
          <!-- Regular Question -->
          <div v-if="!isScenarioQuestion" class="question-item">
            <h3 class="question-text">{{ currentQuestion.text }}</h3>
            <div class="question-options">
              <label 
                v-for="(option, index) in currentQuestion.options" 
                :key="option.value"
                class="option-label option-interactive"
                :class="{ 
                  'option-enter': visibleOptions.has(index),
                  'option-selected': currentAnswer === option.value,
                  'keyboard-focused': focusedIndex === index
                }"
                :style="{ animationDelay: index * 0.1 + 's' }"
              >
                <input 
                  type="radio" 
                  :name="'question-' + currentQuestion.id"
                  :value="option.value"
                  v-model="currentAnswer"
                  @change="handleAnswerChange"
                />
                <div class="option-content">
                  <div class="option-indicator"></div>
                  <span class="option-text">{{ option.text }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Scenario Question -->
          <div v-else class="question-item scenario-question">
            <div class="scenario-context">
              <div class="scenario-icon">🎭</div>
              <h3 class="scenario-title">状況設定</h3>
              <p class="scenario-text">{{ currentQuestion.scenario }}</p>
            </div>
            
            <div class="scenario-choices">
              <!-- Inner Choice -->
              <div class="choice-section inner-choice">
                <div class="choice-header">
                  <span class="choice-icon">💭</span>
                  <h4 class="choice-title">{{ currentQuestion.inner_q }}</h4>
                </div>
                <div class="question-options">
                  <label 
                    v-for="(option, index) in currentQuestion.options.inner" 
                    :key="'inner-' + option.value"
                    class="option-label option-interactive"
                    :class="{ 
                      'option-enter': visibleOptions.has(index),
                      'option-selected': scenarioAnswers.inner === option.value
                    }"
                    :style="{ animationDelay: index * 0.1 + 's' }"
                  >
                    <input 
                      type="radio" 
                      :name="'inner-' + currentQuestion.id"
                      :value="option.value"
                      v-model="scenarioAnswers.inner"
                      @change="handleScenarioAnswerChange('inner')"
                    />
                    <div class="option-content">
                      <div class="option-indicator"></div>
                      <span class="option-text">{{ option.text }}</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Outer Choice -->
              <div class="choice-section outer-choice">
                <div class="choice-header">
                  <span class="choice-icon">🎨</span>
                  <h4 class="choice-title">{{ currentQuestion.outer_q }}</h4>
                </div>
                <div class="question-options">
                  <label 
                    v-for="(option, index) in currentQuestion.options.outer" 
                    :key="'outer-' + option.value"
                    class="option-label"
                    :style="{ animationDelay: index * 0.1 + 's' }"
                  >
                    <input 
                      type="radio" 
                      :name="'outer-' + currentQuestion.id"
                      :value="option.value"
                      v-model="scenarioAnswers.outer"
                      @change="handleScenarioAnswerChange('outer')"
                    />
                    <div class="option-content">
                      <div class="option-indicator"></div>
                      <span class="option-text">{{ option.text }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <div class="question-navigation">
      <HButton 
        variant="secondary" 
        size="large"
        :disabled="currentQuestionIndex === 0"
        @click="previousQuestion"
      >
        <span class="btn-icon">←</span>
        <span class="btn-text">前の質問</span>
      </HButton>
      <HButton 
        variant="primary" 
        size="large"
        :disabled="!canProceed"
        @click="nextQuestion"
      >
        <span class="btn-text">{{ isLastQuestion ? '完了' : '次の質問' }}</span>
        <span class="btn-icon">{{ isLastQuestion ? '✓' : '→' }}</span>
      </HButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import type { Question, Answer, ScenarioQuestion } from '@/data/types'
import { WORLDVIEW_QUESTIONS, SCENARIO_QUESTIONS, ALL_QUESTIONS } from '@/data/questions'
import HButton from '@/components/common/HButton.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useAnswerValidation } from '@/composables/useValidation'
import { validateScenarioAnswer } from '@/utils/answerValidators'
import { 
  useQuestionTransition, 
  useSwipeGesture, 
  useOptionAnimation,
  useKeyboardNavigation 
} from '@/composables/useQuestionTransition'

const router = useRouter()
const analysisStore = useAnalysisStore()
const { validateAnswer, validationErrors, clearValidation } = useAnswerValidation()

// State
const currentQuestionIndex = ref<number>(0)
const currentAnswer = ref<string>('')
const scenarioAnswers = ref<{ inner: string; outer: string }>({ inner: '', outer: '' })
const answers = ref<Answer[]>([])
const questionContainer = ref<HTMLElement | null>(null)

// Animations
const { transitionState, startTransition } = useQuestionTransition()
const { visibleOptions, animateOptionsIn, animateSelection } = useOptionAnimation()
const { bindSwipeEvents, unbindSwipeEvents } = useSwipeGesture(
  questionContainer,
  () => nextQuestion(),
  () => previousQuestion()
)
const { focusedIndex, bindKeyboardEvents, unbindKeyboardEvents } = useKeyboardNavigation({
  onNext: () => nextQuestion(),
  onPrevious: () => previousQuestion(),
  onSelect: (index) => selectOptionByIndex(index),
  optionCount: computed(() => currentQuestion.value.options.length || 0)
})

// Load previous progress and setup animations
onMounted(async () => {
  const savedProgress = analysisStore.getProgress()
  if (savedProgress) {
    currentQuestionIndex.value = savedProgress.currentQuestionIndex || 0
    answers.value = savedProgress.answers || []
    
    // Restore current answer
    const currentQ = ALL_QUESTIONS[currentQuestionIndex.value]
    const savedAnswer = answers.value.find(a => a.questionId === currentQ.id)
    if (savedAnswer) {
      if (isScenarioQuestion.value) {
        // Parse scenario answer
        const [inner, outer] = savedAnswer.selectedValue.split('|')
        scenarioAnswers.value = { inner, outer }
      } else {
        currentAnswer.value = savedAnswer.selectedValue
      }
    }
  }
  
  // Setup animations
  await nextTick()
  animateOptionsIn(currentQuestion.value.options.length || 0)
  
  // Bind events
  bindSwipeEvents()
  bindKeyboardEvents()
})

// Cleanup on unmount
onBeforeUnmount(() => {
  unbindSwipeEvents()
  unbindKeyboardEvents()
})

// Computed properties
const currentQuestion = computed((): Question | ScenarioQuestion => ALL_QUESTIONS[currentQuestionIndex.value])
const currentQuestionNum = computed((): number => currentQuestionIndex.value + 1)
const totalQuestions = computed((): number => ALL_QUESTIONS.length)
const progressPercentage = computed((): number => (currentQuestionNum.value / totalQuestions.value) * 100)
const completedQuestions = computed((): number => answers.value.length)
const milestonePosition = computed((): number => (WORLDVIEW_QUESTIONS.length / totalQuestions.value) * 100)

const isScenarioQuestion = computed((): boolean => {
  const q = currentQuestion.value as ScenarioQuestion
  return !!(q.scenario && q.inner_q && q.outer_q)
})

const isValueQuestion = computed((): boolean => currentQuestionIndex.value < WORLDVIEW_QUESTIONS.length)
const questionType = computed((): string => isValueQuestion.value ? '価値観質問' : 'シナリオ質問')
const questionIcon = computed((): string => isValueQuestion.value ? '💭' : '🎭')
const isLastQuestion = computed((): boolean => currentQuestionIndex.value === totalQuestions.value - 1)

const canProceed = computed((): boolean => {
  if (isScenarioQuestion.value) {
    return !!scenarioAnswers.value.inner && !!scenarioAnswers.value.outer
  }
  return !!currentAnswer.value
})

/**
 * 回答の変更処理
 * 
 * 目的：
 * - 一般質問の回答変更を処理
 * - 自動保存を実行
 * 
 * 副作用：
 * - saveAnswer()を呼び出す
 */
function handleAnswerChange(): void {
  saveAnswer()
}

/**
 * シナリオ質問の回答変更処理
 * 
 * 目的：
 * - シナリオ質問の内面/外面回答変更を処理
 * - 両方の回答が揃った場合のみ自動保存
 * 
 * 入力：
 * - type: 'inner' | 'outer' - 変更された回答の種類
 * 
 * 副作用：
 * - 両方の回答が揃っている場合、saveAnswer()を呼び出す
 */
function handleScenarioAnswerChange(type: 'inner' | 'outer'): void {
  if (scenarioAnswers.value.inner && scenarioAnswers.value.outer) {
    saveAnswer()
  }
}

/**
 * 回答を保存する
 * 
 * 目的：
 * - 現在の回答をAnswerオブジェクトとして構築
 * - バリデーション実行
 * - ローカルストレージに永続化
 * 
 * 処理内容：
 * 1. 質問タイプに応じて回答値を構築（一般質問 or シナリオ質問）
 * 2. Answerオブジェクトの作成（タイムスタンプ付き）
 * 3. バリデーション実行（基本 + シナリオ特化）
 * 4. answersリストの更新（新規追加 or 既存更新）
 * 5. 分析ストアでの進捗保存
 * 
 * 副作用：
 * - answers配列の変更
 * - バリデーションエラーのクリア
 * - ローカルストレージへの書き込み
 * 
 * エラー処理：
 * - 回答値が空の場合は早期リターン
 * - バリデーション失敗時はコンソールエラー出力
 */
function saveAnswer(): void {
  const questionId = currentQuestion.value.id
  let selectedValue = ''
  
  if (isScenarioQuestion.value) {
    selectedValue = `${scenarioAnswers.value.inner}|${scenarioAnswers.value.outer}`
  } else {
    selectedValue = currentAnswer.value
  }
  
  if (!selectedValue) return
  
  // Create answer object
  const answer: Answer = {
    questionId,
    selectedValue,
    timestamp: Date.now()
  }
  
  // Validate answer
  if (!validateAnswer(answer)) {
    console.error('Answer validation failed:', validationErrors.value)
    return
  }
  
  // Additional validation for scenario questions
  if (isScenarioQuestion.value) {
    const scenarioValidation = validateScenarioAnswer(answer)
    if (!scenarioValidation.isValid) {
      console.error('Scenario validation failed:', scenarioValidation.error)
      return
    }
  }
  
  // Update or add answer
  const existingIndex = answers.value.findIndex(a => a.questionId === questionId)
  if (existingIndex >= 0) {
    answers.value[existingIndex] = answer
  } else {
    answers.value.push(answer)
  }
  
  // Clear validation errors
  clearValidation()
  
  // Save progress
  analysisStore.saveProgress({
    currentQuestionIndex: currentQuestionIndex.value,
    answers: answers.value,
    lastUpdated: Date.now()
  })
}

/**
 * 前の質問に戻る
 * 
 * 目的：
 * - 質問を一つ前に戻す
 * - アニメーション付きで画面遷移
 * 
 * 処理内容：
 * 1. 戻り可能かチェック（最初の質問でない、遷移中でない）
 * 2. 後退アニメーション開始
 * 3. 質問インデックスをデクリメント
 * 4. 回答状態をリセット
 * 5. 選択肢アニメーションを開始
 * 
 * 前提条件：
 * - currentQuestionIndex > 0
 * - 遷移中でない
 * 
 * 副作用：
 * - currentQuestionIndexの変更
 * - 回答状態のリセット
 * - アニメーション実行
 */
async function previousQuestion(): Promise<void> {
  if (currentQuestionIndex.value > 0 && !transitionState.value.isTransitioning) {
    await startTransition('backward')
    currentQuestionIndex.value--
    resetCurrentAnswer()
    await nextTick()
    animateOptionsIn(currentQuestion.value.options.length || 0)
  }
}

/**
 * 次の質問に進む、または分析を完了する
 * 
 * 目的：
 * - 質問を一つ先に進める
 * - 最後の質問の場合は分析画面に遷移
 * 
 * 処理内容：
 * 1. 進行可能かチェック（回答済み、遷移中でない）
 * 2. 最後の質問かチェック
 * 3a. 最後の場合：分析完了処理、ルーター遷移
 * 3b. 続きがある場合：前進アニメーション、質問インデックス更新
 * 4. 回答状態をリセット
 * 5. 選択肢アニメーションを開始
 * 
 * 前提条件：
 * - canProceed = true（回答が選択済み）
 * - 遷移中でない
 * 
 * 副作用：
 * - currentQuestionIndexの変更（継続時）
 * - 分析ストアでの分析完了処理（最後の質問時）
 * - ルーター遷移（最後の質問時）
 * - アニメーション実行
 */
async function nextQuestion(): Promise<void> {
  if (!canProceed.value || transitionState.value.isTransitioning) return
  
  if (isLastQuestion.value) {
    // Complete analysis with fade animation
    await startTransition('forward')
    analysisStore.completeAnalysis(answers.value)
    router.push('/analysis')
  } else {
    await startTransition('forward')
    currentQuestionIndex.value++
    resetCurrentAnswer()
    await nextTick()
    animateOptionsIn(currentQuestion.value.options.length || 0)
  }
}

/**
 * 現在の回答状態をリセットし、保存済み回答があれば復元
 * 
 * 目的：
 * - 質問変更時の回答状態初期化
 * - 保存済み回答の復元（ページ戻り時など）
 * 
 * 処理内容：
 * 1. 回答状態を初期値にリセット
 * 2. 現在の質問に対する保存済み回答を検索
 * 3. 保存済み回答があれば復元（質問タイプ別に処理）
 * 
 * 副作用：
 * - currentAnswer、scenarioAnswersの初期化
 * - 保存済み回答がある場合の復元
 */
function resetCurrentAnswer(): void {
  currentAnswer.value = ''
  scenarioAnswers.value = { inner: '', outer: '' }
  
  // Load saved answer for new question
  const currentQ = ALL_QUESTIONS[currentQuestionIndex.value]
  const savedAnswer = answers.value.find(a => a.questionId === currentQ.id)
  
  if (savedAnswer) {
    if (isScenarioQuestion.value) {
      const [inner, outer] = savedAnswer.selectedValue.split('|')
      scenarioAnswers.value = { inner, outer }
    } else {
      currentAnswer.value = savedAnswer.selectedValue
    }
  }
}

/**
 * キーボード操作で選択肢を選択
 * 
 * 目的：
 * - キーボードナビゲーションでの選択肢選択
 * - アクセシビリティ向上
 * 
 * 入力：
 * - index: number - 選択する選択肢のインデックス
 * 
 * 処理内容：
 * 1. シナリオ質問の場合は処理をスキップ（未対応）
 * 2. インデックスの妥当性チェック
 * 3. 選択肢の値を現在の回答に設定
 * 
 * 注意事項：
 * - シナリオ質問では未対応（inner/outerの複雑性のため）
 * 
 * 副作用：
 * - currentAnswerの変更
 */
function selectOptionByIndex(index: number): void {
  if (isScenarioQuestion.value) return // Not supported for scenario questions
  
  const options = currentQuestion.value.options as any[]
  if (index >= 0 && index < options.length) {
    currentAnswer.value = options[index].value
  }
}

// Auto-save on answer change
watch([currentAnswer, scenarioAnswers], () => {
  if (canProceed.value) {
    saveAnswer()
  }
}, { deep: true })
</script>

<style scoped>
@import '@/styles/transitions.css';

.question-flow-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* Progress Section */
.progress-section {
  margin-bottom: 2rem;
}

.question-header {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-counter {
  font-size: 1.5rem;
  font-weight: bold;
}

.current-question {
  color: var(--primary-color);
}

.total-questions {
  color: var(--text-secondary);
}

.question-type-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
}

.type-icon {
  font-size: 1.2rem;
}

.progress-bar-container {
  position: relative;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-milestone {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: var(--accent-color);
  border-radius: 50%;
  transform: translateX(-50%);
}

.completion-stats {
  margin-top: 0.5rem;
  text-align: right;
  color: var(--text-secondary);
}

/* Question Content */
.question-content {
  min-height: 400px;
  margin-bottom: 2rem;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-label {
  display: block;
  cursor: pointer;
  animation: slideIn 0.5s ease-out backwards;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.option-label:hover .option-content {
  border-color: var(--primary-color);
  transform: translateX(4px);
}

input[type="radio"] {
  display: none;
}

input[type="radio"]:checked + .option-content {
  background: var(--primary-light);
  border-color: var(--primary-color);
}

.option-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

input[type="radio"]:checked + .option-content .option-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: var(--primary-color);
  border-radius: 50%;
}

/* Scenario Question Styles */
.scenario-question {
  animation: fadeIn 0.5s ease-out;
}

.scenario-context {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.scenario-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.scenario-title {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.scenario-text {
  line-height: 1.6;
}

.scenario-choices {
  display: grid;
  gap: 2rem;
}

.choice-section {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 8px;
}

.choice-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.choice-icon {
  font-size: 1.5rem;
}

.choice-title {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Navigation */
.question-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-icon {
  font-size: 1.2rem;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Validation Errors */
.validation-errors {
  background: var(--error-bg, #fee);
  border: 1px solid var(--error-border, #fcc);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--error-color, #c00);
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.1rem;
}

/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Animation states */
.transitioning {
  pointer-events: none;
}

.option-interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-interactive:not(.option-enter) {
  opacity: 0;
  transform: translateY(20px);
}

.option-interactive.option-enter {
  opacity: 1;
  transform: translateY(0);
}

.option-selected {
  background: var(--primary-light) !important;
  transform: scale(1.02);
}

.keyboard-focused {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Swipe hint for mobile */
@media (max-width: 768px) {
  .question-content::after {
    content: '';
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: var(--text-secondary);
    border-radius: 2px;
    opacity: 0.3;
  }
}

/* Transition animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* Responsive */
@media (max-width: 768px) {
  .question-flow-container {
    padding: 1rem;
  }
  
  .question-text {
    font-size: 1.1rem;
  }
  
  .option-content {
    padding: 0.75rem 1rem;
  }
  
  .scenario-choices {
    gap: 1rem;
  }
}
</style>