/**
 * 質問遷移アニメーション用コンポーザブル
 * 
 * 目的：
 * 質問切り替え時のスムーズなアニメーションとトランジション効果を管理
 * 
 * 機能：
 * - ページ遷移アニメーション
 * - 選択肢のスタガーアニメーション
 * - スワイプジェスチャー対応
 * - キーボードナビゲーション
 */

import { ref, computed, nextTick, Ref } from 'vue'

export interface TransitionState {
  isTransitioning: boolean
  direction: 'forward' | 'backward' | null
  animationClass: string
}

/**
 * 質問遷移アニメーション
 */
export function useQuestionTransition() {
  const transitionState = ref<TransitionState>({
    isTransitioning: false,
    direction: null,
    animationClass: ''
  })
  
  const isAnimating = computed(() => transitionState.value.isTransitioning)
  
  /**
   * 遷移開始
   */
  async function startTransition(direction: 'forward' | 'backward') {
    transitionState.value = {
      isTransitioning: true,
      direction,
      animationClass: direction === 'forward' ? 'slide-left' : 'slide-right'
    }
    
    // アニメーション完了を待つ
    await nextTick()
    
    return new Promise<void>(resolve => {
      setTimeout(() => {
        transitionState.value.isTransitioning = false
        resolve()
      }, 300)
    })
  }
  
  /**
   * フェードトランジション
   */
  async function fadeTransition() {
    transitionState.value = {
      isTransitioning: true,
      direction: null,
      animationClass: 'fade'
    }
    
    await nextTick()
    
    return new Promise<void>(resolve => {
      setTimeout(() => {
        transitionState.value.isTransitioning = false
        resolve()
      }, 200)
    })
  }
  
  return {
    transitionState,
    isAnimating,
    startTransition,
    fadeTransition
  }
}

/**
 * スワイプジェスチャー
 */
export function useSwipeGesture(
  element: Ref<HTMLElement | null>,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  const touchStartX = ref(0)
  const touchEndX = ref(0)
  const isSwiping = ref(false)
  const swipeThreshold = 50 // minimum distance for swipe
  
  function handleTouchStart(e: TouchEvent) {
    touchStartX.value = e.touches[0].clientX
    isSwiping.value = true
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping.value) return
    touchEndX.value = e.touches[0].clientX
  }
  
  function handleTouchEnd() {
    if (!isSwiping.value) return
    
    const distance = touchEndX.value - touchStartX.value
    
    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (distance < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }
    
    isSwiping.value = false
  }
  
  function bindSwipeEvents() {
    if (!element.value) return
    
    element.value.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.value.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.value.addEventListener('touchend', handleTouchEnd)
  }
  
  function unbindSwipeEvents() {
    if (!element.value) return
    
    element.value.removeEventListener('touchstart', handleTouchStart)
    element.value.removeEventListener('touchmove', handleTouchMove)
    element.value.removeEventListener('touchend', handleTouchEnd)
  }
  
  return {
    bindSwipeEvents,
    unbindSwipeEvents,
    isSwiping
  }
}

/**
 * 選択肢アニメーション
 */
export function useOptionAnimation() {
  const visibleOptions = ref<Set<number>>(new Set())
  const selectedOption = ref<string | null>(null)
  
  /**
   * 選択肢を順番に表示
   */
  async function animateOptionsIn(count: number, delay = 100) {
    visibleOptions.value.clear()
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, delay))
      visibleOptions.value.add(i)
    }
  }
  
  /**
   * 選択時のアニメーション
   */
  async function animateSelection(value: string) {
    selectedOption.value = value
    
    // 選択されたオプションを強調
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 他のオプションをフェードアウト
    return new Promise<void>(resolve => {
      setTimeout(() => {
        selectedOption.value = null
        resolve()
      }, 300)
    })
  }
  
  /**
   * 選択肢をクリア
   */
  function clearOptions() {
    visibleOptions.value.clear()
    selectedOption.value = null
  }
  
  return {
    visibleOptions,
    selectedOption,
    animateOptionsIn,
    animateSelection,
    clearOptions
  }
}

/**
 * キーボードナビゲーション
 */
export function useKeyboardNavigation(
  options: {
    onNext?: () => void
    onPrevious?: () => void
    onSelect?: (index: number) => void
    optionCount?: Ref<number>
  }
) {
  const focusedIndex = ref(-1)
  const isKeyboardMode = ref(false)
  
  function handleKeydown(e: KeyboardEvent) {
    isKeyboardMode.value = true
    
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
        if (focusedIndex.value >= 0 && options.onSelect) {
          options.onSelect(focusedIndex.value)
        } else if (options.onNext) {
          options.onNext()
        }
        break
        
      case 'ArrowLeft':
        if (options.onPrevious) {
          options.onPrevious()
        }
        break
        
      case 'ArrowDown':
        if (options.optionCount) {
          focusedIndex.value = Math.min(
            focusedIndex.value + 1,
            options.optionCount.value - 1
          )
        }
        break
        
      case 'ArrowUp':
        focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
        break
        
      case 'Tab':
        // Allow default tab behavior
        return
        
      default:
        return
    }
    
    e.preventDefault()
  }
  
  function bindKeyboardEvents() {
    document.addEventListener('keydown', handleKeydown)
  }
  
  function unbindKeyboardEvents() {
    document.removeEventListener('keydown', handleKeydown)
  }
  
  function resetFocus() {
    focusedIndex.value = -1
  }
  
  return {
    focusedIndex,
    isKeyboardMode,
    bindKeyboardEvents,
    unbindKeyboardEvents,
    resetFocus
  }
}