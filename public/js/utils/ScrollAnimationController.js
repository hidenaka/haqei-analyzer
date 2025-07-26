// ScrollAnimationController.js - スクロール連動アニメーションコントローラー
// PersonalityOSBootSequence用のスクロールアニメーション管理

class ScrollAnimationController {
  constructor() {
    this.sections = [];
    this.animatedElements = new Set();
    this.countUpCallbacks = new Map();
    
    // Intersection Observer の設定
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    // Intersection Observer のサポート確認とフォールバック
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.observerOptions
      );
    } else {
      console.warn('Intersection Observer not supported, falling back to scroll event');
      this.setupScrollFallback();
    }
    
    // reduced motion 設定の確認
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * セクションを監視対象に追加
   */
  observeSection(element) {
    if (!element) return;
    
    this.sections.push(element);
    
    if (this.observer) {
      this.observer.observe(element);
    }
    
    // 初期状態の設定
    if (!this.prefersReducedMotion) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }
  }
  
  /**
   * Intersection Observer のコールバック
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
        this.triggerSectionAnimation(entry.target);
        this.animatedElements.add(entry.target);
      }
    });
  }
  
  /**
   * セクション固有のアニメーションをトリガー
   */
  triggerSectionAnimation(section) {
    if (this.prefersReducedMotion) {
      section.classList.add('is-visible');
      return;
    }
    
    // フェードインアニメーション
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    section.classList.add('is-visible');
    
    // セクション固有のアニメーション
    const sectionType = this.getSectionType(section);
    
    switch (sectionType) {
      case 'boot-screen':
        this.animateBootScreen(section);
        break;
      case 'core-engine':
        this.animateCoreEngine(section);
        break;
      case 'gui-section':
        this.animateGUISection(section);
        break;
      case 'safemode-section':
        this.animateSafeModeSection(section);
        break;
      case 'integration-section':
        this.animateIntegrationSection(section);
        break;
    }
    
    // 数値カウントアップアニメーション
    this.animateCounters(section);
  }
  
  /**
   * セクションタイプを判定
   */
  getSectionType(section) {
    if (section.classList.contains('boot-screen')) return 'boot-screen';
    if (section.classList.contains('core-engine-section')) return 'core-engine';
    if (section.classList.contains('gui-section')) return 'gui-section';
    if (section.classList.contains('safemode-section')) return 'safemode-section';
    if (section.classList.contains('integration-section')) return 'integration-section';
    return 'unknown';
  }
  
  /**
   * BootScreen固有のアニメーション
   */
  animateBootScreen(section) {
    const hexagramSVG = section.querySelector('.hexagram-svg');
    if (hexagramSVG) {
      // SVG線描画アニメーション
      const lines = hexagramSVG.querySelectorAll('.yang-line, .yin-line');
      lines.forEach((line, index) => {
        setTimeout(() => {
          line.style.animation = 'drawLine 1s ease-out forwards';
        }, index * 200);
      });
    }
    
    // タイトルのタイピングエフェクト（簡易版）
    const bootTitle = section.querySelector('.boot-title');
    if (bootTitle) {
      setTimeout(() => {
        bootTitle.style.animation = 'fadeInUp 1s ease-out forwards';
      }, 500);
    }
  }
  
  /**
   * CoreEngine固有のアニメーション
   */
  animateCoreEngine(section) {
    // レーダーチャートのアニメーション
    const chartCanvas = section.querySelector('#profile-radar-chart');
    if (chartCanvas && window.Chart) {
      setTimeout(() => {
        // Chart.jsのアニメーションをトリガー
        const chartInstance = Chart.getChart(chartCanvas);
        if (chartInstance) {
          chartInstance.update('active');
        }
      }, 300);
    }
    
    // エンジン説明のフェードイン
    const engineDescription = section.querySelector('.engine-description');
    if (engineDescription) {
      setTimeout(() => {
        engineDescription.style.animation = 'fadeInRight 0.8s ease-out forwards';
      }, 600);
    }
  }
  
  /**
   * GUISection固有のアニメーション
   */
  animateGUISection(section) {
    this.animateDynamicsConnector(section);
  }
  
  /**
   * SafeModeSection固有のアニメーション
   */
  animateSafeModeSection(section) {
    this.animateDynamicsConnector(section, 'tension');
  }
  
  /**
   * IntegrationSection固有のアニメーション
   */
  animateIntegrationSection(section) {
    const summaryCards = section.querySelectorAll('.summary-card');
    summaryCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
      }, index * 200);
    });
  }
  
  /**
   * ダイナミクスコネクターのアニメーション
   */
  animateDynamicsConnector(section, type = 'harmony') {
    const connector = section.querySelector('.dynamics-connector');
    const osIcons = section.querySelectorAll('.os-icon');
    
    if (connector) {
      setTimeout(() => {
        if (type === 'tension') {
          connector.style.animation = 'tensionPulse 2s ease-in-out infinite';
        } else {
          connector.style.animation = 'harmonyFlow 3s ease-in-out infinite';
        }
      }, 400);
    }
    
    // アイコンのアニメーション
    osIcons.forEach((icon, index) => {
      setTimeout(() => {
        icon.style.animation = 'bounceIn 0.6s ease-out forwards';
      }, index * 300);
    });
  }
  
  /**
   * 数値カウントアップアニメーション
   */
  animateCounters(section) {
    const counters = section.querySelectorAll('[data-count-to]');
    
    counters.forEach(counter => {
      const targetValue = parseInt(counter.getAttribute('data-count-to'));
      const duration = parseInt(counter.getAttribute('data-duration') || '2000');
      const startValue = 0;
      
      this.animateCounter(counter, startValue, targetValue, duration);
    });
  }
  
  /**
   * 個別カウンターのアニメーション
   */
  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuart イージング関数
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = currentValue + (element.getAttribute('data-suffix') || '');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
  
  /**
   * Intersection Observer をサポートしない場合のフォールバック
   */
  setupScrollFallback() {
    let ticking = false;
    
    const checkVisibility = () => {
      this.sections.forEach(section => {
        if (!this.animatedElements.has(section)) {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          
          if (isVisible) {
            this.triggerSectionAnimation(section);
            this.animatedElements.add(section);
          }
        }
      });
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkVisibility);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // 初期チェック
    checkVisibility();
  }
  
  /**
   * カスタムアニメーションコールバックを登録
   */
  registerCustomAnimation(sectionId, callback) {
    this.countUpCallbacks.set(sectionId, callback);
  }
  
  /**
   * リソースのクリーンアップ
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.sections = [];
    this.animatedElements.clear();
    this.countUpCallbacks.clear();
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.ScrollAnimationController = ScrollAnimationController;
}