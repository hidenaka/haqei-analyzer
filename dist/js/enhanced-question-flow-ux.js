/**
 * Enhanced Question Flow UX - Interactive Improvements
 * Bunenjin Philosophy: Creating natural, intuitive user experiences
 * Focus: Smooth transitions, visual feedback, accessibility
 */

class EnhancedQuestionFlowUX {
  constructor() {
    this.isInitialized = false;
    this.currentQuestionElement = null;
    this.progressAnimationActive = false;
    this.touchStartY = 0;
    this.touchEndY = 0;
    
    // Accessibility features
    this.announcements = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Performance optimization
    this.debounceTimers = new Map();
    
    console.log('🎨 Enhanced Question Flow UX initialized');
  }

  /**
   * Initialize enhanced UX features
   */
  init() {
    if (this.isInitialized) return;
    
    try {
      this.setupAccessibility();
      this.enhanceProgressVisualization();
      this.addInteractionEnhancements();
      this.setupKeyboardNavigation();
      this.setupTouchGestures();
      this.optimizeAnimations();
      
      this.isInitialized = true;
      console.log('✅ Enhanced Question Flow UX features activated');
      
      // Announce readiness to screen readers
      this.announceToScreenReader('質問フローが準備完了しました。矢印キーまたはタブキーで操作できます。');
      
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced Question Flow UX:', error);
    }
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Create live region for announcements
    this.announcements = document.getElementById('announcements');
    if (!this.announcements) {
      this.announcements = document.createElement('div');
      this.announcements.id = 'announcements';
      this.announcements.className = 'sr-only';
      this.announcements.setAttribute('aria-live', 'polite');
      this.announcements.setAttribute('role', 'status');
      document.body.appendChild(this.announcements);
    }

    // Add ARIA labels to progress elements
    const progressBar = document.querySelector('.progress-bar-fill');
    const questionCounter = document.querySelector('.current-question');
    
    if (progressBar) {
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-label', '質問の進捗');
    }

    if (questionCounter) {
      questionCounter.setAttribute('aria-live', 'polite');
    }
  }

  /**
   * Enhance progress visualization with smooth animations
   */
  enhanceProgressVisualization() {
    const progressFill = document.querySelector('.progress-bar-fill');
    const completedCount = document.querySelector('.completed-count');
    
    if (!progressFill) return;

    // Add smooth progress animation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          this.animateProgressChange(progressFill, completedCount);
        }
      });
    });

    observer.observe(progressFill, { attributes: true });

    // Add milestone indicators
    this.addProgressMilestones();
  }

  /**
   * Add milestone indicators to progress bar
   */
  addProgressMilestones() {
    const progressContainer = document.querySelector('.progress-bar-container');
    if (!progressContainer) return;

    // Add milestone at 50% (halfway point)
    const halfwayMilestone = document.createElement('div');
    halfwayMilestone.className = 'progress-milestone';
    halfwayMilestone.style.left = '50%';
    halfwayMilestone.title = '中間地点';
    progressContainer.appendChild(halfwayMilestone);

    // Add milestone at 80% (near completion)
    const nearCompletionMilestone = document.createElement('div');
    nearCompletionMilestone.className = 'progress-milestone';
    nearCompletionMilestone.style.left = '80%';
    nearCompletionMilestone.title = '完了まであと少し';
    progressContainer.appendChild(nearCompletionMilestone);
  }

  /**
   * Animate progress changes with enhanced visual feedback
   */
  animateProgressChange(progressFill, completedCount) {
    if (this.progressAnimationActive) return;
    this.progressAnimationActive = true;

    // Get current progress percentage
    const width = progressFill.style.width;
    const percentage = parseFloat(width) || 0;

    // Add celebration effect for major milestones
    if (percentage >= 25 && percentage < 30) {
      this.celebrateMilestone('25%達成！順調に進んでいます', '🎉');
    } else if (percentage >= 50 && percentage < 55) {
      this.celebrateMilestone('半分完了！後半に入りました', '⭐');
    } else if (percentage >= 75 && percentage < 80) {
      this.celebrateMilestone('75%達成！もう少しです', '🚀');
    } else if (percentage >= 90 && percentage < 95) {
      this.celebrateMilestone('90%達成！完了間近です', '✨');
    }

    // Animate completed count
    if (completedCount) {
      this.animateCounterUpdate(completedCount);
    }

    // Reset animation flag
    setTimeout(() => {
      this.progressAnimationActive = false;
    }, 1000);
  }

  /**
   * Celebrate milestone achievements
   */
  celebrateMilestone(message, icon) {
    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.className = 'milestone-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">${icon}</div>
        <div class="celebration-text">${message}</div>
      </div>
    `;

    // Add celebration styles
    celebration.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      backdrop-filter: blur(10px);
    `;

    const content = celebration.querySelector('.celebration-content');
    content.style.cssText = `
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 2rem 3rem;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      transform: scale(0.8);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    const celebrationIcon = celebration.querySelector('.celebration-icon');
    celebrationIcon.style.cssText = `
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: bounce 0.6s ease-in-out;
    `;

    const celebrationText = celebration.querySelector('.celebration-text');
    celebrationText.style.cssText = `
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    `;

    document.body.appendChild(celebration);

    // Animate in
    requestAnimationFrame(() => {
      celebration.style.opacity = '1';
      content.style.transform = 'scale(1)';
    });

    // Remove after animation
    setTimeout(() => {
      celebration.style.opacity = '0';
      content.style.transform = 'scale(0.8)';
      setTimeout(() => {
        document.body.removeChild(celebration);
      }, 400);
    }, 2000);

    // Announce to screen readers
    this.announceToScreenReader(message);

    // Add confetti effect if not reduced motion
    if (!this.reducedMotion) {
      this.addConfettiEffect();
    }
  }

  /**
   * Add confetti effect for celebrations
   */
  addConfettiEffect() {
    const confettiColors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
          top: -10px;
          left: ${Math.random() * 100}vw;
          z-index: 9999;
          border-radius: 50%;
          pointer-events: none;
          animation: confettiFall 3s linear forwards;
        `;

        document.body.appendChild(confetti);

        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 3000);
      }, i * 50);
    }

    // Add confetti animation styles if not already present
    if (!document.querySelector('#confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Animate counter updates
   */
  animateCounterUpdate(counterElement) {
    const currentValue = parseInt(counterElement.textContent) || 0;
    const targetValue = currentValue + 1;

    counterElement.style.transform = 'scale(1.2)';
    counterElement.style.color = '#10b981';

    setTimeout(() => {
      counterElement.textContent = targetValue;
      counterElement.style.transform = 'scale(1)';
      counterElement.style.color = '';
    }, 150);
  }

  /**
   * Add interaction enhancements to options
   */
  addInteractionEnhancements() {
    // Enhanced hover effects
    this.setupHoverEffects();
    
    // Selection feedback
    this.setupSelectionFeedback();
    
    // Button state improvements
    this.enhanceButtonStates();
  }

  /**
   * Setup enhanced hover effects
   */
  setupHoverEffects() {
    document.addEventListener('mouseover', (e) => {
      const optionLabel = e.target.closest('.option-label');
      if (optionLabel && !optionLabel.classList.contains('selected')) {
        this.debounce('hover-' + Date.now(), () => {
          this.addHoverEffect(optionLabel);
        }, 50);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const optionLabel = e.target.closest('.option-label');
      if (optionLabel) {
        this.removeHoverEffect(optionLabel);
      }
    });
  }

  /**
   * Add hover effect to option
   */
  addHoverEffect(optionLabel) {
    if (this.reducedMotion) return;

    const ripple = optionLabel.querySelector('.option-ripple');
    if (ripple) {
      ripple.style.opacity = '0.5';
    }

    // Add subtle shake for engagement
    optionLabel.style.animation = 'subtle-pulse 0.3s ease-in-out';
    
    setTimeout(() => {
      optionLabel.style.animation = '';
    }, 300);
  }

  /**
   * Remove hover effect from option
   */
  removeHoverEffect(optionLabel) {
    const ripple = optionLabel.querySelector('.option-ripple');
    if (ripple) {
      ripple.style.opacity = '0';
    }
  }

  /**
   * Setup selection feedback
   */
  setupSelectionFeedback() {
    document.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        this.handleSelectionFeedback(e.target);
      }
    });
  }

  /**
   * Handle selection feedback
   */
  handleSelectionFeedback(radioInput) {
    const optionLabel = radioInput.closest('.option-label');
    const questionContainer = radioInput.closest('.question-item');
    
    if (!optionLabel || !questionContainer) return;

    // Remove selected class from all options in this question
    const allOptions = questionContainer.querySelectorAll('.option-label');
    allOptions.forEach(option => option.classList.remove('selected'));

    // Add selected class to current option
    optionLabel.classList.add('selected');

    // Add selection animation
    if (!this.reducedMotion) {
      optionLabel.style.animation = 'selection-pulse 0.6s ease-out';
      setTimeout(() => {
        optionLabel.style.animation = '';
      }, 600);
    }

    // Haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Audio feedback (optional, can be enabled)
    this.playSelectionSound();

    // Announce selection to screen readers
    const optionText = optionLabel.querySelector('.option-text')?.textContent || '';
    this.announceToScreenReader(`選択されました: ${optionText}`);

    // Update navigation button state with animation
    this.updateNavigationWithAnimation();
  }

  /**
   * Play subtle selection sound
   */
  playSelectionSound() {
    // Create audio context for subtle click sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context not available
    }
  }

  /**
   * Enhance button states with smooth transitions
   */
  enhanceButtonStates() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          const button = mutation.target;
          this.animateButtonStateChange(button);
        }
      });
    });

    // Observe navigation buttons
    const navButtons = document.querySelectorAll('.btn');
    navButtons.forEach(button => {
      observer.observe(button, { attributes: true });
    });
  }

  /**
   * Animate button state changes
   */
  animateButtonStateChange(button) {
    if (this.reducedMotion) return;

    if (button.disabled) {
      button.style.transition = 'all 0.3s ease';
      button.style.transform = 'scale(0.95)';
    } else {
      button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      button.style.transform = 'scale(1)';
      
      // Add activation pulse
      setTimeout(() => {
        button.style.animation = 'activation-pulse 0.6s ease-out';
        setTimeout(() => {
          button.style.animation = '';
        }, 600);
      }, 100);
    }
  }

  /**
   * Update navigation with smooth animation
   */
  updateNavigationWithAnimation() {
    const nextButton = document.querySelector('#next-btn');
    if (!nextButton) return;

    // Add loading state briefly
    const btnText = nextButton.querySelector('.btn-text');
    const btnIcon = nextButton.querySelector('.btn-icon');
    
    if (btnText && !nextButton.disabled) {
      const originalText = btnText.textContent;
      const originalIcon = btnIcon?.textContent || '';
      
      btnText.textContent = '確認中...';
      if (btnIcon) btnIcon.textContent = '⏳';
      
      setTimeout(() => {
        btnText.textContent = originalText;
        if (btnIcon) btnIcon.textContent = originalIcon;
      }, 300);
    }
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    const currentQuestion = document.querySelector('.question-item');
    if (!currentQuestion) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        this.navigateOptions(e.key === 'ArrowUp' ? -1 : 1);
        break;
      case ' ':
      case 'Enter':
        const focusedOption = document.activeElement.closest('.option-label');
        if (focusedOption) {
          e.preventDefault();
          const radioInput = focusedOption.querySelector('input[type="radio"]');
          if (radioInput) {
            radioInput.checked = true;
            radioInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.clickPreviousButton();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.clickNextButton();
        break;
    }
  }

  /**
   * Navigate between options using keyboard
   */
  navigateOptions(direction) {
    const options = Array.from(document.querySelectorAll('.option-label'));
    if (!options.length) return;

    const currentIndex = options.findIndex(option => 
      option.contains(document.activeElement) || option === document.activeElement
    );

    let nextIndex;
    if (currentIndex === -1) {
      nextIndex = direction > 0 ? 0 : options.length - 1;
    } else {
      nextIndex = (currentIndex + direction + options.length) % options.length;
    }

    options[nextIndex].focus();
    options[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Click previous button programmatically
   */
  clickPreviousButton() {
    const prevButton = document.querySelector('#prev-btn');
    if (prevButton && !prevButton.disabled) {
      prevButton.click();
    }
  }

  /**
   * Click next button programmatically
   */
  clickNextButton() {
    const nextButton = document.querySelector('#next-btn');
    if (nextButton && !nextButton.disabled) {
      nextButton.click();
    }
  }

  /**
   * Setup touch gestures for mobile
   */
  setupTouchGestures() {
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      this.touchEndY = e.changedTouches[0].clientY;
      this.handleTouchGesture();
    }, { passive: true });
  }

  /**
   * Handle touch gesture
   */
  handleTouchGesture() {
    const swipeDistance = Math.abs(this.touchEndY - this.touchStartY);
    const swipeDirection = this.touchStartY > this.touchEndY ? 'up' : 'down';

    // Require minimum swipe distance
    if (swipeDistance < 50) return;

    // Handle vertical swipes for navigation
    if (swipeDirection === 'up') {
      // Swipe up to go to next question
      this.clickNextButton();
    } else if (swipeDirection === 'down') {
      // Swipe down to go to previous question
      this.clickPreviousButton();
    }
  }

  /**
   * Optimize animations based on user preferences
   */
  optimizeAnimations() {
    // Add reduced motion styles if needed
    if (this.reducedMotion) {
      const style = document.createElement('style');
      style.textContent = `
        .enhanced-ux-reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('enhanced-ux-reduced-motion');
    }

    // Add smooth scrolling styles
    const smoothScrollStyle = document.createElement('style');
    smoothScrollStyle.textContent = `
      @keyframes subtle-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      @keyframes selection-pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
      }
      @keyframes activation-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(smoothScrollStyle);
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    if (this.announcements) {
      this.announcements.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        this.announcements.textContent = '';
      }, 1000);
    }
  }

  /**
   * Debounce function for performance optimization
   */
  debounce(key, func, wait) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    const timer = setTimeout(() => {
      func();
      this.debounceTimers.delete(key);
    }, wait);
    
    this.debounceTimers.set(key, timer);
  }

  /**
   * Cleanup method
   */
  destroy() {
    // Clear all debounce timers
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    
    // Remove event listeners would go here if we tracked them
    this.isInitialized = false;
    
    console.log('🧹 Enhanced Question Flow UX destroyed');
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enhancedQuestionFlowUX = new EnhancedQuestionFlowUX();
    window.enhancedQuestionFlowUX.init();
  });
} else {
  window.enhancedQuestionFlowUX = new EnhancedQuestionFlowUX();
  window.enhancedQuestionFlowUX.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedQuestionFlowUX;
}