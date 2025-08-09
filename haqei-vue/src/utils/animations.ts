/**
 * animations.ts - アニメーション用ユーティリティ関数
 * HaQei Analyzer - Animation Utilities
 */

/**
 * DOM要素のフェードイン
 */
export function fadeIn(element: HTMLElement, duration = 300): void {
  element.style.opacity = '0'
  element.style.transition = `opacity ${duration}ms ease`
  
  setTimeout(() => {
    element.style.opacity = '1'
  }, 10)
}

/**
 * DOM要素のフェードアウト
 */
export function fadeOut(element: HTMLElement, duration = 300): Promise<void> {
  element.style.transition = `opacity ${duration}ms ease`
  element.style.opacity = '0'
  
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

/**
 * 左からスライドイン
 */
export function slideInFromLeft(element: HTMLElement, duration = 300): void {
  element.style.transform = 'translateX(-100%)'
  element.style.transition = `transform ${duration}ms ease`
  
  setTimeout(() => {
    element.style.transform = 'translateX(0)'
  }, 10)
}

/**
 * 右からスライドイン
 */
export function slideInFromRight(element: HTMLElement, duration = 300): void {
  element.style.transform = 'translateX(100%)'
  element.style.transition = `transform ${duration}ms ease`
  
  setTimeout(() => {
    element.style.transform = 'translateX(0)'
  }, 10)
}

/**
 * 上からスライドイン
 */
export function slideInFromTop(element: HTMLElement, duration = 300): void {
  element.style.transform = 'translateY(-100%)'
  element.style.transition = `transform ${duration}ms ease`
  
  setTimeout(() => {
    element.style.transform = 'translateY(0)'
  }, 10)
}

/**
 * 下からスライドイン
 */
export function slideInFromBottom(element: HTMLElement, duration = 300): void {
  element.style.transform = 'translateY(100%)'
  element.style.transition = `transform ${duration}ms ease`
  
  setTimeout(() => {
    element.style.transform = 'translateY(0)'
  }, 10)
}

/**
 * スケールイン
 */
export function scaleIn(element: HTMLElement, duration = 300): void {
  element.style.transform = 'scale(0)'
  element.style.transition = `transform ${duration}ms ease`
  
  setTimeout(() => {
    element.style.transform = 'scale(1)'
  }, 10)
}

/**
 * スケールアウト
 */
export function scaleOut(element: HTMLElement, duration = 300): Promise<void> {
  element.style.transition = `transform ${duration}ms ease`
  element.style.transform = 'scale(0)'
  
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

/**
 * プログレスバーアニメーション
 */
export function animateProgressBar(
  element: HTMLElement,
  targetWidth: number,
  duration = 1000
): void {
  const startWidth = 0
  const startTime = Date.now()
  
  function updateProgress() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const currentWidth = startWidth + (targetWidth - startWidth) * progress
    element.style.width = `${currentWidth}%`
    
    if (progress < 1) {
      requestAnimationFrame(updateProgress)
    }
  }
  
  requestAnimationFrame(updateProgress)
}

/**
 * 要素を段階的に表示
 */
export function staggeredShow(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  delayBetween = 100
): void {
  Array.from(elements).forEach((element, index) => {
    setTimeout(() => {
      fadeIn(element)
    }, index * delayBetween)
  })
}

/**
 * タイピングアニメーション
 */
export function typeWriter(
  element: HTMLElement,
  text: string,
  speed = 50
): Promise<void> {
  return new Promise(resolve => {
    let i = 0
    element.textContent = ''
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        setTimeout(type, speed)
      } else {
        resolve()
      }
    }
    
    type()
  })
}

/**
 * 数値カウントアップアニメーション
 */
export function countUp(
  element: HTMLElement,
  targetValue: number,
  duration = 1000,
  options?: {
    startValue?: number
    decimals?: number
    format?: (value: number) => string
  }
): void {
  const startValue = options?.startValue ?? 0
  const decimals = options?.decimals ?? 0
  const format = options?.format ?? ((value: number) => value.toFixed(decimals))
  const startTime = Date.now()
  
  function updateCount() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const currentValue = startValue + (targetValue - startValue) * progress
    element.textContent = format(currentValue)
    
    if (progress < 1) {
      requestAnimationFrame(updateCount)
    }
  }
  
  requestAnimationFrame(updateCount)
}

/**
 * パルスアニメーション
 */
export function pulse(element: HTMLElement, duration = 1000): void {
  element.style.animation = `pulse ${duration}ms ease-in-out infinite`
}

/**
 * アニメーションを停止
 */
export function stopAnimation(element: HTMLElement): void {
  element.style.animation = ''
}

/**
 * CSS keyframesを動的に追加
 */
export function addAnimationKeyframes(): void {
  if (document.getElementById('haqei-animations')) return
  
  const style = document.createElement('style')
  style.id = 'haqei-animations'
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)
}

/**
 * 要素をシェイク
 */
export function shake(element: HTMLElement, duration = 500): void {
  element.style.animation = `shake ${duration}ms ease-in-out`
  
  setTimeout(() => {
    element.style.animation = ''
  }, duration)
}

/**
 * 要素をバウンス
 */
export function bounce(element: HTMLElement, duration = 500): void {
  element.style.animation = `bounce ${duration}ms ease-in-out`
  
  setTimeout(() => {
    element.style.animation = ''
  }, duration)
}

/**
 * 要素を回転
 */
export function spin(element: HTMLElement, duration = 1000): void {
  element.style.animation = `spin ${duration}ms linear`
  
  setTimeout(() => {
    element.style.animation = ''
  }, duration)
}

/**
 * Vue 3 Transition互換のアニメーション
 */
export const vueTransitions = {
  fade: {
    enter: 'fadeIn 300ms ease-out',
    leave: 'fadeIn 300ms ease-out reverse'
  },
  slide: {
    enter: 'slideInUp 300ms ease-out',
    leave: 'slideInUp 300ms ease-out reverse'
  }
}

/**
 * Intersection Observerを使ったアニメーション
 */
export function animateOnScroll(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  animationClass: string,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass)
        observer.unobserve(entry.target)
      }
    })
  }, options ?? { threshold: 0.1 })
  
  Array.from(elements).forEach(element => {
    observer.observe(element)
  })
  
  return observer
}

// 初期化時にキーフレームを追加
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAnimationKeyframes)
  } else {
    addAnimationKeyframes()
  }
}