/**
 * Scenario Animations - Phase 3 Implementation
 * シナリオアニメーション制御システム
 * 
 * 8シナリオ表示における美しいアニメーション効果を管理
 * スムーズな遷移とユーザーエクスペリエンス向上を実現
 * 
 * 機能:
 * - カード表示アニメーション
 * - ホバー・クリック効果
 * - モーダル遷移アニメーション
 * - スクロール連動アニメーション
 * - パフォーマンス最適化
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 1.0.0-phase3
 */

class ScenarioAnimations {
  constructor() {
    this.version = "1.0.0-phase3";
    this.initialized = false;
    this.animationFrameId = null;
    this.observers = new Map();
    this.animationQueue = [];
    this.preferences = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      duration: {
        fast: 150,
        normal: 300,
        slow: 600
      }
    };
    
    console.log('🎬 Scenario Animations initializing...');
  }

  /**
   * アニメーションシステム初期化
   */
  async initialize() {
    if (this.initialized) {
      console.log('✅ Scenario Animations already initialized');
      return;
    }

    try {
      // モーション設定の監視
      this.setupMotionPreferences();
      
      // スクロールアニメーション設定
      this.setupScrollAnimations();
      
      // パフォーマンス監視
      this.setupPerformanceMonitoring();
      
      // アニメーションキーフレーム追加
      this.addAnimationKeyframes();
      
      this.initialized = true;
      console.log('✅ Scenario Animations ready');
      
    } catch (error) {
      console.error('❌ Scenario Animations initialization failed:', error);
      throw error;
    }
  }

  /**
   * モーション設定監視
   */
  setupMotionPreferences() {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    motionQuery.addEventListener('change', (e) => {
      this.preferences.reducedMotion = e.matches;
      this.updateAnimationStates();
    });
    
    this.preferences.reducedMotion = motionQuery.matches;
  }

  /**
   * カード表示アニメーション
   * @param {NodeList} cards - アニメーション対象のカード群
   * @param {Object} options - アニメーションオプション
   */
  animateCardsEntrance(cards, options = {}) {
    if (this.preferences.reducedMotion) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
      return Promise.resolve();
    }

    const {
      delay = 100,
      duration = this.preferences.duration.normal,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
      direction = 'up' // 'up', 'down', 'left', 'right', 'scale'
    } = options;

    return new Promise((resolve) => {
      let completed = 0;
      const total = cards.length;

      cards.forEach((card, index) => {
        // 初期状態設定
        this.setInitialCardState(card, direction);
        
        setTimeout(() => {
          this.animateCardToVisible(card, duration, easing, () => {
            completed++;
            if (completed === total) {
              resolve();
            }
          });
        }, index * delay);
      });
      
      // フォールバック（最大待機時間）
      setTimeout(resolve, (total * delay) + duration + 100);
    });
  }

  /**
   * カード初期状態設定
   */
  setInitialCardState(card, direction) {
    card.style.opacity = '0';
    
    switch (direction) {
      case 'up':
        card.style.transform = 'translateY(30px)';
        break;
      case 'down':
        card.style.transform = 'translateY(-30px)';
        break;
      case 'left':
        card.style.transform = 'translateX(-30px)';
        break;
      case 'right':
        card.style.transform = 'translateX(30px)';
        break;
      case 'scale':
        card.style.transform = 'scale(0.8)';
        break;
      default:
        card.style.transform = 'translateY(20px)';
    }
  }

  /**
   * カード表示アニメーション実行
   */
  animateCardToVisible(card, duration, easing, callback) {
    card.style.transition = `all ${duration}ms ${easing}`;
    card.style.opacity = '1';
    card.style.transform = 'translate(0) scale(1)';
    
    setTimeout(callback, duration);
  }

  /**
   * カードホバーアニメーション
   * @param {HTMLElement} card - 対象カード
   * @param {boolean} isHover - ホバー状態
   * @param {Object} options - アニメーションオプション
   */
  animateCardHover(card, isHover, options = {}) {
    if (this.preferences.reducedMotion) return;

    const {
      duration = this.preferences.duration.fast,
      scale = isHover ? 1.02 : 1,
      translateY = isHover ? -8 : 0,
      shadowIntensity = isHover ? 0.3 : 0.1
    } = options;

    const transform = `translateY(${translateY}px) scale(${scale})`;
    const boxShadow = `0 ${isHover ? 20 : 4}px ${isHover ? 40 : 16}px rgba(0, 0, 0, ${shadowIntensity})`;
    
    // カスタムカラー取得
    const scenarioColor = card.style.getPropertyValue('--scenario-color') || 'rgba(99, 102, 241, 0.3)';
    const coloredShadow = isHover ? `, 0 0 0 1px ${scenarioColor}40` : '';

    card.style.transition = `transform ${duration}ms ease, box-shadow ${duration}ms ease`;
    card.style.transform = transform;
    card.style.boxShadow = boxShadow + coloredShadow;

    // オーバーレイアニメーション
    const overlay = card.querySelector('.card-overlay');
    if (overlay) {
      overlay.style.transition = `opacity ${duration}ms ease`;
      overlay.style.opacity = isHover ? '0.1' : '0.05';
    }

    // メトリクスバーアニメーション
    if (isHover) {
      this.animateMetricBars(card);
    }
  }

  /**
   * メトリクスバーアニメーション
   */
  animateMetricBars(card) {
    const metricFills = card.querySelectorAll('.metric-fill');
    
    metricFills.forEach((fill, index) => {
      const currentWidth = fill.style.width;
      fill.style.width = '0%';
      
      setTimeout(() => {
        fill.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        fill.style.width = currentWidth;
      }, index * 100);
    });
  }

  /**
   * カードクリックアニメーション
   * @param {HTMLElement} card - 対象カード
   * @param {Object} options - アニメーションオプション
   */
  animateCardClick(card, options = {}) {
    if (this.preferences.reducedMotion) return Promise.resolve();

    const {
      duration = this.preferences.duration.fast,
      scale = 0.95
    } = options;

    return new Promise((resolve) => {
      // クリック時のスケールダウン
      card.style.transition = `transform ${duration / 2}ms ease`;
      card.style.transform = `scale(${scale})`;

      setTimeout(() => {
        // 元のホバー状態に戻す
        card.style.transition = `transform ${duration}ms ease`;
        card.style.transform = 'translateY(-8px) scale(1.02)';
        
        setTimeout(resolve, duration);
      }, duration / 2);
    });
  }

  /**
   * リップル効果生成
   * @param {Event} event - クリックイベント
   * @param {Object} options - リップルオプション
   */
  createRippleEffect(event, options = {}) {
    if (this.preferences.reducedMotion) return;

    const {
      color = 'rgba(255, 255, 255, 0.3)',
      duration = 600,
      size = null
    } = options;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const rippleSize = size || Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - rippleSize / 2;
    const y = event.clientY - rect.top - rippleSize / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${rippleSize}px;
      height: ${rippleSize}px;
      left: ${x}px;
      top: ${y}px;
      background: ${color};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation ${duration}ms linear;
      pointer-events: none;
    `;

    // ボタンの相対位置設定
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';

    button.appendChild(ripple);

    // アニメーション終了後に削除
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, duration);
  }

  /**
   * モーダル表示アニメーション
   * @param {HTMLElement} modal - モーダル要素
   * @param {boolean} isShow - 表示/非表示
   * @param {Object} options - アニメーションオプション
   */
  animateModal(modal, isShow, options = {}) {
    const {
      duration = this.preferences.duration.normal,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)'
    } = options;

    if (this.preferences.reducedMotion) {
      modal.style.display = isShow ? 'flex' : 'none';
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (isShow) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        
        const overlay = modal.querySelector('.modal-overlay');
        const content = modal.querySelector('.modal-content');
        
        // 初期状態
        overlay.style.opacity = '0';
        content.style.opacity = '0';
        content.style.transform = 'scale(0.9) translateY(-20px)';
        
        // アニメーション開始
        requestAnimationFrame(() => {
          overlay.style.transition = `opacity ${duration}ms ${easing}`;
          content.style.transition = `all ${duration}ms ${easing}`;
          
          overlay.style.opacity = '1';
          content.style.opacity = '1';
          content.style.transform = 'scale(1) translateY(0)';
          
          setTimeout(resolve, duration);
        });
      } else {
        const overlay = modal.querySelector('.modal-overlay');
        const content = modal.querySelector('.modal-content');
        
        overlay.style.transition = `opacity ${duration}ms ${easing}`;
        content.style.transition = `all ${duration}ms ${easing}`;
        
        overlay.style.opacity = '0';
        content.style.opacity = '0';
        content.style.transform = 'scale(0.9) translateY(-20px)';
        
        setTimeout(() => {
          modal.style.display = 'none';
          modal.classList.add('hidden');
          resolve();
        }, duration);
      }
    });
  }

  /**
   * スクロールアニメーション設定
   */
  setupScrollAnimations() {
    if (this.preferences.reducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElementIntoView(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // 監視対象を後から追加できるように保存
    this.observers.set('scroll', observer);
  }

  /**
   * 要素の表示アニメーション
   */
  animateElementIntoView(element) {
    if (element.classList.contains('animate-in')) return;

    element.classList.add('animate-in');
    
    if (!this.preferences.reducedMotion) {
      element.style.animation = 'fadeInUp 0.6s ease-out forwards';
    }
  }

  /**
   * スクロール監視に要素を追加
   */
  observeElement(element) {
    const scrollObserver = this.observers.get('scroll');
    if (scrollObserver) {
      scrollObserver.observe(element);
    }
  }

  /**
   * 段階的表示アニメーション
   * @param {NodeList} elements - 対象要素群
   * @param {Object} options - アニメーションオプション
   */
  animateStaggered(elements, options = {}) {
    if (this.preferences.reducedMotion) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return Promise.resolve();
    }

    const {
      delay = 100,
      duration = this.preferences.duration.normal,
      easing = 'ease-out'
    } = options;

    return new Promise((resolve) => {
      elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          element.style.transition = `all ${duration}ms ${easing}`;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * delay);
      });
      
      // 最後の要素のアニメーション完了を待つ
      setTimeout(resolve, (elements.length - 1) * delay + duration);
    });
  }

  /**
   * フィルター・ソートアニメーション
   * @param {NodeList} elements - 対象要素群
   * @param {string} animationType - アニメーションタイプ
   */
  animateFilterSort(elements, animationType = 'fade') {
    if (this.preferences.reducedMotion) return Promise.resolve();

    const duration = this.preferences.duration.normal;

    return new Promise((resolve) => {
      // 一旦フェードアウト
      elements.forEach(element => {
        element.style.transition = `all ${duration / 2}ms ease-out`;
        element.style.opacity = '0';
        
        if (animationType === 'scale') {
          element.style.transform = 'scale(0.8)';
        } else if (animationType === 'slide') {
          element.style.transform = 'translateX(-20px)';
        }
      });

      // フェードイン
      setTimeout(() => {
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.style.transition = `all ${duration / 2}ms ease-in`;
            element.style.opacity = '1';
            element.style.transform = 'none';
          }, index * 50);
        });
        
        setTimeout(resolve, elements.length * 50 + duration / 2);
      }, duration / 2);
    });
  }

  /**
   * パーティクル効果
   * @param {HTMLElement} element - 起点要素
   * @param {Object} options - パーティクルオプション
   */
  createParticleEffect(element, options = {}) {
    if (this.preferences.reducedMotion) return;

    const {
      count = 8,
      colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'],
      duration = 1000,
      spread = 100
    } = options;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 50 + Math.random() * spread;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particle-burst-${i} ${duration}ms ease-out forwards;
      `;

      // 個別のキーフレーム生成
      const keyframes = `
        @keyframes particle-burst-${i} {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0);
            opacity: 0;
          }
        }
      `;

      // スタイルシートに追加
      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);

      document.body.appendChild(particle);

      // アニメーション終了後削除
      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
        if (style.parentNode) style.parentNode.removeChild(style);
      }, duration);
    }
  }

  /**
   * アニメーションキーフレーム追加
   */
  addAnimationKeyframes() {
    if (document.getElementById('scenario-animations-keyframes')) return;

    const style = document.createElement('style');
    style.id = 'scenario-animations-keyframes';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      /* Reduced motion対応 */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * パフォーマンス監視設定
   */
  setupPerformanceMonitoring() {
    // フレームレート監視
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // FPSが低い場合はアニメーションを簡素化
        if (fps < 30) {
          this.simplifyAnimations();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(measureFrameRate);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(measureFrameRate);
  }

  /**
   * アニメーション簡素化
   */
  simplifyAnimations() {
    this.preferences.duration.fast = 50;
    this.preferences.duration.normal = 100;
    this.preferences.duration.slow = 200;
    
    console.log('⚡ Animations simplified for better performance');
  }

  /**
   * アニメーション状態更新
   */
  updateAnimationStates() {
    const body = document.body;
    
    if (this.preferences.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    // フレームレート監視停止
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Observer削除
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    
    // アニメーションキュークリア
    this.animationQueue = [];
    
    console.log('✅ Scenario Animations cleanup completed');
  }

  /**
   * パフォーマンス統計取得
   */
  getPerformanceStats() {
    return {
      version: this.version,
      initialized: this.initialized,
      reducedMotion: this.preferences.reducedMotion,
      observersCount: this.observers.size,
      animationQueueLength: this.animationQueue.length,
      durations: this.preferences.duration
    };
  }
}

// Node.js環境での対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScenarioAnimations;
}

// ブラウザ環境での自動初期化
if (typeof window !== 'undefined') {
  window.ScenarioAnimations = ScenarioAnimations;
  console.log('✅ ScenarioAnimations loaded and ready');
}