// animations.js - アニメーション用ユーティリティ関数
// HaQei Analyzer - Animation Utilities

// DOM要素のフェードイン/アウト
function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease`;
  
  setTimeout(() => {
    element.style.opacity = '1';
  }, 10);
}

function fadeOut(element, duration = 300) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = '0';
  
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

// スライドイン/アウト
function slideInFromLeft(element, duration = 300) {
  element.style.transform = 'translateX(-100%)';
  element.style.transition = `transform ${duration}ms ease`;
  
  setTimeout(() => {
    element.style.transform = 'translateX(0)';
  }, 10);
}

function slideInFromRight(element, duration = 300) {
  element.style.transform = 'translateX(100%)';
  element.style.transition = `transform ${duration}ms ease`;
  
  setTimeout(() => {
    element.style.transform = 'translateX(0)';
  }, 10);
}

// スケールアニメーション
function scaleIn(element, duration = 300) {
  element.style.transform = 'scale(0)';
  element.style.transition = `transform ${duration}ms ease`;
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 10);
}

// プログレスバーアニメーション
function animateProgressBar(element, targetWidth, duration = 1000) {
  let startWidth = 0;
  const startTime = Date.now();
  
  function updateProgress() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentWidth = startWidth + (targetWidth - startWidth) * progress;
    element.style.width = `${currentWidth}%`;
    
    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    }
  }
  
  requestAnimationFrame(updateProgress);
}

// 要素を段階的に表示
function staggeredShow(elements, delayBetween = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      fadeIn(element);
    }, index * delayBetween);
  });
}

// タイピングアニメーション
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// 数値カウントアニメーション
function countUp(element, targetValue, duration = 1000) {
  const startValue = 0;
  const startTime = Date.now();
  
  function updateCount() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = startValue + (targetValue - startValue) * progress;
    element.textContent = Math.floor(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(updateCount);
    }
  }
  
  requestAnimationFrame(updateCount);
}

// パルスアニメーション
function pulse(element, duration = 1000) {
  element.style.animation = `pulse ${duration}ms ease-in-out infinite`;
}

// CSS keyframesを動的に追加
function addPulseKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
}

// 初期化時にキーフレームを追加
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addPulseKeyframes);
} else {
  addPulseKeyframes();
}

console.log('✅ Animation utilities loaded');