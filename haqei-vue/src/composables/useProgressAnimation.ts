/**
 * プログレスアニメーション用コンポーザブル
 * 
 * 目的：
 * 進捗表示のスムーズなアニメーションとトランジションを管理
 * 
 * 機能：
 * - 数値のアニメーション
 * - イージング関数
 * - プログレスバーのトランジション
 */

import { ref, computed, watch, Ref } from 'vue'

interface UseProgressAnimationOptions {
  duration?: number
  easing?: (t: number) => number
}

/**
 * 数値アニメーション
 */
export function useNumberAnimation(
  target: Ref<number>,
  options: UseProgressAnimationOptions = {}
) {
  const { 
    duration = 500,
    easing = easeOutCubic 
  } = options
  
  const animatedValue = ref(target.value)
  const isAnimating = ref(false)
  
  let animationId: number | null = null
  
  watch(target, (newValue, oldValue) => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    const startTime = performance.now()
    const startValue = oldValue
    const endValue = newValue
    const diff = endValue - startValue
    
    isAnimating.value = true
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      
      animatedValue.value = startValue + diff * easedProgress
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        isAnimating.value = false
        animationId = null
      }
    }
    
    animationId = requestAnimationFrame(animate)
  })
  
  return {
    animatedValue,
    isAnimating
  }
}

/**
 * プログレスバーアニメーション
 */
export function useProgressAnimation(
  current: Ref<number>,
  total: Ref<number>,
  options: UseProgressAnimationOptions = {}
) {
  const progress = computed(() => {
    if (total.value === 0) return 0
    return (current.value / total.value) * 100
  })
  
  const { animatedValue: animatedProgress, isAnimating } = useNumberAnimation(
    progress,
    options
  )
  
  const formattedProgress = computed(() => {
    return Math.round(animatedProgress.value)
  })
  
  // マイルストーンチェック
  const milestoneReached = ref<number | null>(null)
  const milestones = [25, 50, 75, 100]
  
  watch(formattedProgress, (newProgress, oldProgress) => {
    for (const milestone of milestones) {
      if (oldProgress < milestone && newProgress >= milestone) {
        milestoneReached.value = milestone
        setTimeout(() => {
          milestoneReached.value = null
        }, 2000)
        break
      }
    }
  })
  
  return {
    progress: formattedProgress,
    animatedProgress,
    isAnimating,
    milestoneReached
  }
}

/**
 * ステップインジケーターアニメーション
 */
export function useStepAnimation(
  currentStep: Ref<number>,
  totalSteps: Ref<number>
) {
  const previousStep = ref(currentStep.value)
  const isTransitioning = ref(false)
  const transitionDirection = ref<'forward' | 'backward'>('forward')
  
  watch(currentStep, (newStep, oldStep) => {
    previousStep.value = oldStep
    transitionDirection.value = newStep > oldStep ? 'forward' : 'backward'
    
    isTransitioning.value = true
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  })
  
  const stepProgress = computed(() => {
    const baseProgress = ((currentStep.value - 1) / (totalSteps.value - 1)) * 100
    return Math.max(0, Math.min(100, baseProgress))
  })
  
  return {
    previousStep,
    isTransitioning,
    transitionDirection,
    stepProgress
  }
}

// イージング関数
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutCubic(t: number): number {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3
  
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

export const easings = {
  linear: (t: number) => t,
  easeOutCubic,
  easeInOutCubic,
  easeOutElastic
}