/**
 * HAQEI Intelligent Help System - Context Analyzer
 * 
 * Advanced context detection and analysis component that intelligently
 * understands user behavior, page context, and interaction patterns
 * to provide contextually relevant help suggestions.
 * 
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                   ContextAnalyzer                           │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │DOM Observer │  │Behavior     │  │Intent Detection     │  │
 * │  │- Mutations  │  │Analyzer     │  │- Hesitation         │  │
 * │  │- Visibility │  │- Mouse      │  │- Confusion          │  │
 * │  │- Focus      │  │- Keyboard   │  │- Interest           │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │Page Context │  │Session      │  │Smart Suggestions    │  │
 * │  │- URL        │  │Tracking     │  │- Proactive help     │  │
 * │  │- Elements   │  │- Progress   │  │- Contextual tips    │  │
 * │  │- State      │  │- Patterns   │  │- Learning adapt     │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Key Features:
 * - Real-time DOM observation for context changes
 * - Behavioral pattern analysis (mouse, keyboard, scroll)
 * - Intent detection (confusion, hesitation, interest)
 * - Smart help triggering based on user needs
 * - Learning system for improved accuracy over time
 */

class ContextAnalyzer {
  constructor(helpSystem) {
    this.helpSystem = helpSystem;
    this.isMonitoring = false;
    this.observers = new Map();
    this.behaviorData = new Map();
    this.sessionData = {
      startTime: Date.now(),
      pageViews: [],
      interactions: [],
      helpRequests: [],
      currentContext: null
    };

    // Configuration
    this.config = {
      observationThrottleMs: 100,
      behaviorAnalysisIntervalMs: 2000,
      intentDetectionThresholds: {
        hesitationTime: 3000,        // 3 seconds without action
        confusionClicks: 3,          // Multiple clicks in same area
        interestScrolls: 5,          // Multiple scrolls in content area
        rapidClicks: 2000            // Quick successive clicks
      },
      contextElements: [
        '[data-help-context]',
        '.question-container',
        '.analysis-container', 
        '.results-container',
        '.triple-os-container',
        '.bunenjin-section'
      ]
    };

    // Behavioral pattern recognition
    this.patterns = {
      hesitation: new HesitationDetector(this.config.intentDetectionThresholds),
      confusion: new ConfusionDetector(this.config.intentDetectionThresholds),
      interest: new InterestDetector(this.config.intentDetectionThresholds),
      navigation: new NavigationPatternDetector()
    };

    this.init();
  }

  /**
   * Initialize context analysis system
   */
  init() {
    this.setupDOMObservers();
    this.setupBehaviorTracking();
    this.setupSessionTracking();
    this.loadHistoricalData();
    
    console.log('✅ ContextAnalyzer initialized');
  }

  /**
   * Start monitoring user context and behavior
   */
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.activateObservers();
    this.startBehaviorAnalysis();
    this.updateCurrentContext();

    console.log('🔍 Context monitoring started');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    this.deactivateObservers();
    this.stopBehaviorAnalysis();

    console.log('⏹️ Context monitoring stopped');
  }

  /**
   * Setup DOM observers for context detection
   */
  setupDOMObservers() {
    // Mutation Observer for dynamic content changes
    this.observers.set('mutation', new MutationObserver(
      this.throttle((mutations) => {
        this.handleDOMChanges(mutations);
      }, this.config.observationThrottleMs)
    ));

    // Intersection Observer for element visibility
    this.observers.set('intersection', new IntersectionObserver(
      (entries) => {
        this.handleVisibilityChanges(entries);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
    ));

    // Resize Observer for layout changes
    if (window.ResizeObserver) {
      this.observers.set('resize', new ResizeObserver(
        this.throttle((entries) => {
          this.handleLayoutChanges(entries);
        }, this.config.observationThrottleMs)
      ));
    }
  }

  /**
   * Setup behavior tracking (mouse, keyboard, scroll)
   */
  setupBehaviorTracking() {
    // Mouse tracking
    this.setupMouseTracking();
    
    // Keyboard tracking
    this.setupKeyboardTracking();
    
    // Scroll tracking
    this.setupScrollTracking();
    
    // Focus tracking
    this.setupFocusTracking();
  }

  /**
   * Mouse behavior tracking
   */
  setupMouseTracking() {
    const mouseData = {
      positions: [],
      clicks: [],
      hovers: [],
      lastMovement: Date.now()
    };

    this.behaviorData.set('mouse', mouseData);

    // Mouse movement
    document.addEventListener('mousemove', this.throttle((event) => {
      if (!this.isMonitoring) return;

      mouseData.positions.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        target: this.getElementContext(event.target)
      });

      // Keep only recent positions (last 10 seconds)
      const cutoff = Date.now() - 10000;
      mouseData.positions = mouseData.positions.filter(p => p.timestamp > cutoff);

      mouseData.lastMovement = Date.now();
      this.detectMousePatterns(event);
    }, 50));

    // Mouse clicks
    document.addEventListener('click', (event) => {
      if (!this.isMonitoring) return;

      const clickData = {
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        target: this.getElementContext(event.target),
        button: event.button
      };

      mouseData.clicks.push(clickData);
      
      // Keep only recent clicks (last 30 seconds)
      const cutoff = Date.now() - 30000;
      mouseData.clicks = mouseData.clicks.filter(c => c.timestamp > cutoff);

      this.analyzeClickPattern(clickData);
    });

    // Mouse hover detection
    document.addEventListener('mouseenter', (event) => {
      if (!this.isMonitoring) return;
      
      const context = this.getElementContext(event.target);
      if (context.isHelpRelevant) {
        mouseData.hovers.push({
          element: context,
          startTime: Date.now()
        });
      }
    }, true);
  }

  /**
   * Keyboard behavior tracking
   */
  setupKeyboardTracking() {
    const keyboardData = {
      keystrokes: [],
      shortcuts: [],
      lastActivity: Date.now()
    };

    this.behaviorData.set('keyboard', keyboardData);

    document.addEventListener('keydown', (event) => {
      if (!this.isMonitoring) return;

      keyboardData.keystrokes.push({
        key: event.key,
        code: event.code,
        timestamp: Date.now(),
        target: this.getElementContext(event.target),
        modifiers: {
          ctrl: event.ctrlKey,
          alt: event.altKey,
          shift: event.shiftKey,
          meta: event.metaKey
        }
      });

      keyboardData.lastActivity = Date.now();

      // Detect help shortcuts (F1, Ctrl+?, etc.)
      this.detectHelpShortcuts(event);
    });
  }

  /**
   * Scroll behavior tracking
   */
  setupScrollTracking() {
    const scrollData = {
      events: [],
      direction: null,
      speed: 0,
      lastPosition: window.pageYOffset
    };

    this.behaviorData.set('scroll', scrollData);

    window.addEventListener('scroll', this.throttle(() => {
      if (!this.isMonitoring) return;

      const currentPosition = window.pageYOffset;
      const timestamp = Date.now();
      const direction = currentPosition > scrollData.lastPosition ? 'down' : 'up';
      const distance = Math.abs(currentPosition - scrollData.lastPosition);

      scrollData.events.push({
        position: currentPosition,
        direction,
        distance,
        timestamp,
        contextElements: this.getVisibleContextElements()
      });

      scrollData.direction = direction;
      scrollData.lastPosition = currentPosition;

      // Keep only recent events
      const cutoff = timestamp - 20000;
      scrollData.events = scrollData.events.filter(e => e.timestamp > cutoff);

      this.analyzeScrollPatterns();
    }, 100));
  }

  /**
   * Focus tracking for form elements and interactive components
   */
  setupFocusTracking() {
    const focusData = {
      events: [],
      currentFocus: null,
      focusTime: null
    };

    this.behaviorData.set('focus', focusData);

    document.addEventListener('focusin', (event) => {
      if (!this.isMonitoring) return;

      const context = this.getElementContext(event.target);
      focusData.currentFocus = context;
      focusData.focusTime = Date.now();

      focusData.events.push({
        element: context,
        action: 'focus',
        timestamp: Date.now()
      });

      this.handleFocusChange(context);
    });

    document.addEventListener('focusout', (event) => {
      if (!this.isMonitoring || !focusData.currentFocus) return;

      const duration = Date.now() - focusData.focusTime;
      focusData.events.push({
        element: focusData.currentFocus,
        action: 'blur',
        duration,
        timestamp: Date.now()
      });

      this.analyzeFocusPattern(focusData.currentFocus, duration);
      focusData.currentFocus = null;
    });
  }

  /**
   * Session tracking for user journey analysis
   */
  setupSessionTracking() {
    // Track page changes
    this.trackPageView();
    
    // Listen for navigation events
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });

    // Track significant user actions
    this.trackUserActions();
  }

  /**
   * Activate all observers
   */
  activateObservers() {
    // Activate mutation observer
    const mutationObserver = this.observers.get('mutation');
    if (mutationObserver) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'data-help-context', 'style']
      });
    }

    // Activate intersection observer for help-relevant elements
    const intersectionObserver = this.observers.get('intersection');
    if (intersectionObserver) {
      this.config.contextElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          intersectionObserver.observe(element);
        });
      });
    }

    // Activate resize observer
    const resizeObserver = this.observers.get('resize');
    if (resizeObserver) {
      resizeObserver.observe(document.body);
    }
  }

  /**
   * Start behavioral analysis engine
   */
  startBehaviorAnalysis() {
    this.behaviorAnalysisInterval = setInterval(() => {
      this.analyzeBehaviorPatterns();
    }, this.config.behaviorAnalysisIntervalMs);
  }

  /**
   * Main behavior pattern analysis
   */
  analyzeBehaviorPatterns() {
    if (!this.isMonitoring) return;

    // Analyze patterns for intent detection
    const hesitation = this.patterns.hesitation.analyze(this.behaviorData);
    const confusion = this.patterns.confusion.analyze(this.behaviorData);
    const interest = this.patterns.interest.analyze(this.behaviorData);
    const navigation = this.patterns.navigation.analyze(this.behaviorData);

    // Generate insights
    const insights = {
      timestamp: Date.now(),
      hesitation,
      confusion,
      interest,
      navigation,
      context: this.getCurrentContext()
    };

    // Trigger appropriate help responses
    this.processInsights(insights);

    // Update session data
    this.sessionData.interactions.push(insights);
  }

  /**
   * Process behavioral insights and trigger help
   */
  processInsights(insights) {
    const { hesitation, confusion, interest, context } = insights;

    // High hesitation detected - offer proactive help
    if (hesitation.level === 'high' && hesitation.duration > 5000) {
      this.triggerProactiveHelp('hesitation', {
        context,
        duration: hesitation.duration,
        element: hesitation.element
      });
    }

    // Confusion detected - offer contextual explanation
    if (confusion.level === 'high') {
      this.triggerProactiveHelp('confusion', {
        context,
        confusionType: confusion.type,
        element: confusion.element
      });
    }

    // High interest detected - offer advanced information
    if (interest.level === 'high') {
      this.triggerProactiveHelp('interest', {
        context,
        interestType: interest.type,
        element: interest.element
      });
    }
  }

  /**
   * Trigger proactive help based on detected patterns
   */
  triggerProactiveHelp(triggerType, data) {
    const helpRequest = {
      type: 'proactive',
      trigger: triggerType,
      context: data.context,
      element: data.element,
      timestamp: Date.now(),
      data
    };

    // Avoid overwhelming user with too frequent suggestions
    const recentHelp = this.sessionData.helpRequests
      .filter(h => Date.now() - h.timestamp < 60000); // Last minute

    if (recentHelp.length < 2) { // Max 2 proactive helps per minute
      this.helpSystem.dispatchEvent('helpRequested', helpRequest);
      this.sessionData.helpRequests.push(helpRequest);
    }
  }

  /**
   * Get current context information
   */
  getCurrentContext() {
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
      visibleElements: this.getVisibleContextElements(),
      activeElement: document.activeElement ? 
        this.getElementContext(document.activeElement) : null,
      scrollPosition: window.pageYOffset,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: Date.now()
    };
  }

  /**
   * Get context information for an element
   */
  getElementContext(element) {
    if (!element) return null;

    return {
      tagName: element.tagName?.toLowerCase(),
      id: element.id,
      classes: Array.from(element.classList || []),
      attributes: this.getRelevantAttributes(element),
      textContent: element.textContent?.substring(0, 100),
      isHelpRelevant: this.isHelpRelevantElement(element),
      contextType: this.determineContextType(element),
      position: this.getElementPosition(element)
    };
  }

  /**
   * Determine if element is help-relevant
   */
  isHelpRelevantElement(element) {
    const helpSelectors = this.config.contextElements;
    return helpSelectors.some(selector => {
      try {
        return element.matches(selector) || element.closest(selector);
      } catch (e) {
        return false;
      }
    });
  }

  /**
   * Determine context type of element
   */
  determineContextType(element) {
    const classes = Array.from(element.classList || []);
    const id = element.id;

    if (classes.some(c => c.includes('question')) || id.includes('question')) {
      return 'question';
    }
    if (classes.some(c => c.includes('result')) || id.includes('result')) {
      return 'result';
    }
    if (classes.some(c => c.includes('analysis')) || id.includes('analysis')) {
      return 'analysis';
    }
    if (classes.some(c => c.includes('triple-os'))) {
      return 'triple-os';
    }
    if (classes.some(c => c.includes('bunenjin'))) {
      return 'bunenjin';
    }

    return 'general';
  }

  /**
   * Update current context and notify system
   */
  updateCurrentContext() {
    const newContext = this.getCurrentContext();
    const hasChanged = !this.deepEqual(newContext, this.sessionData.currentContext);

    if (hasChanged) {
      this.sessionData.currentContext = newContext;
      this.helpSystem.dispatchEvent('contextChanged', newContext);
    }
  }

  /**
   * Handle DOM changes and update context
   */
  handleDOMChanges(mutations) {
    let shouldUpdateContext = false;

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (this.isHelpRelevantElement(node)) {
              shouldUpdateContext = true;
              // Observe new help-relevant elements
              const intersectionObserver = this.observers.get('intersection');
              if (intersectionObserver) {
                intersectionObserver.observe(node);
              }
            }
          }
        });
      }
    });

    if (shouldUpdateContext) {
      setTimeout(() => this.updateCurrentContext(), 100);
    }
  }

  /**
   * Track page views for journey analysis
   */
  trackPageView() {
    const pageView = {
      url: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
      timestamp: Date.now(),
      referrer: document.referrer
    };

    this.sessionData.pageViews.push(pageView);
    this.updateCurrentContext();
  }

  // Utility methods
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  getVisibleContextElements() {
    const elements = [];
    this.config.contextElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (this.isElementVisible(element)) {
          elements.push(this.getElementContext(element));
        }
      });
    });
    return elements;
  }

  isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }

  getRelevantAttributes(element) {
    const relevantAttrs = ['data-help-context', 'data-help-term', 'title', 'aria-label'];
    const attrs = {};
    
    relevantAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        attrs[attr] = element.getAttribute(attr);
      }
    });
    
    return attrs;
  }

  // Cleanup
  deactivateObservers() {
    this.observers.forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
  }

  stopBehaviorAnalysis() {
    if (this.behaviorAnalysisInterval) {
      clearInterval(this.behaviorAnalysisInterval);
      this.behaviorAnalysisInterval = null;
    }
  }

  loadHistoricalData() {
    // Load previous session data for learning
    try {
      const saved = localStorage.getItem('haqei-context-history');
      if (saved) {
        const history = JSON.parse(saved);
        // Use historical data to improve pattern recognition
        this.patterns.navigation.loadHistory(history.navigation || []);
      }
    } catch (error) {
      console.warn('Failed to load context history:', error);
    }
  }

  // Public API
  getSessionData() {
    return { ...this.sessionData };
  }

  getBehaviorData() {
    return Object.fromEntries(this.behaviorData);
  }

  destroy() {
    this.stopMonitoring();
    this.deactivateObservers();
  }
}

// Pattern detector classes
class HesitationDetector {
  constructor(thresholds) {
    this.thresholds = thresholds;
  }

  analyze(behaviorData) {
    const mouse = behaviorData.get('mouse');
    const keyboard = behaviorData.get('keyboard');
    
    const timeSinceLastAction = Math.min(
      Date.now() - (mouse?.lastMovement || 0),
      Date.now() - (keyboard?.lastActivity || 0)
    );

    let level = 'low';
    if (timeSinceLastAction > this.thresholds.hesitationTime * 2) {
      level = 'high';
    } else if (timeSinceLastAction > this.thresholds.hesitationTime) {
      level = 'medium';
    }

    return {
      level,
      duration: timeSinceLastAction,
      element: this.getCurrentFocusElement(behaviorData)
    };
  }

  getCurrentFocusElement(behaviorData) {
    const focus = behaviorData.get('focus');
    return focus?.currentFocus || null;
  }
}

class ConfusionDetector {
  constructor(thresholds) {
    this.thresholds = thresholds;
  }

  analyze(behaviorData) {
    const mouse = behaviorData.get('mouse');
    const recentClicks = mouse?.clicks.filter(
      c => Date.now() - c.timestamp < 10000
    ) || [];

    // Detect rapid successive clicks in same area
    const rapidClicks = this.detectRapidClicks(recentClicks);
    const repeatClicks = this.detectRepeatClicks(recentClicks);

    let level = 'low';
    let type = 'none';

    if (rapidClicks.count > this.thresholds.confusionClicks) {
      level = 'high';
      type = 'rapid-clicking';
    } else if (repeatClicks.count > this.thresholds.confusionClicks) {
      level = 'medium';
      type = 'repeat-clicking';
    }

    return {
      level,
      type,
      element: rapidClicks.element || repeatClicks.element
    };
  }

  detectRapidClicks(clicks) {
    let maxCount = 0;
    let element = null;

    for (let i = 0; i < clicks.length - 1; i++) {
      let count = 1;
      const baseClick = clicks[i];
      
      for (let j = i + 1; j < clicks.length; j++) {
        const click = clicks[j];
        const timeDiff = click.timestamp - baseClick.timestamp;
        
        if (timeDiff < this.thresholds.rapidClicks) {
          count++;
        }
      }

      if (count > maxCount) {
        maxCount = count;
        element = baseClick.target;
      }
    }

    return { count: maxCount, element };
  }

  detectRepeatClicks(clicks) {
    const areas = new Map();
    
    clicks.forEach(click => {
      const area = `${Math.floor(click.x / 50)}_${Math.floor(click.y / 50)}`;
      const current = areas.get(area) || { count: 0, element: null };
      areas.set(area, {
        count: current.count + 1,
        element: click.target
      });
    });

    let maxCount = 0;
    let element = null;

    areas.forEach(data => {
      if (data.count > maxCount) {
        maxCount = data.count;
        element = data.element;
      }
    });

    return { count: maxCount, element };
  }
}

class InterestDetector {
  constructor(thresholds) {
    this.thresholds = thresholds;
  }

  analyze(behaviorData) {
    const scroll = behaviorData.get('scroll');
    const mouse = behaviorData.get('mouse');

    const scrollEvents = scroll?.events || [];
    const hoverEvents = mouse?.hovers || [];

    // Detect prolonged engagement with content
    const engagement = this.detectEngagement(scrollEvents, hoverEvents);

    let level = 'low';
    let type = 'none';

    if (engagement.scrollCount > this.thresholds.interestScrolls) {
      level = 'high';
      type = 'content-exploration';
    } else if (engagement.hoverTime > 5000) {
      level = 'medium';
      type = 'element-focus';
    }

    return {
      level,
      type,
      element: engagement.element
    };
  }

  detectEngagement(scrollEvents, hoverEvents) {
    const recentScrolls = scrollEvents.filter(
      e => Date.now() - e.timestamp < 30000
    );

    const longestHover = hoverEvents.reduce((max, hover) => {
      const duration = Date.now() - hover.startTime;
      return duration > max.duration ? { duration, element: hover.element } : max;
    }, { duration: 0, element: null });

    return {
      scrollCount: recentScrolls.length,
      hoverTime: longestHover.duration,
      element: longestHover.element
    };
  }
}

class NavigationPatternDetector {
  constructor() {
    this.history = [];
  }

  analyze(behaviorData) {
    // Analyze navigation patterns to predict user needs
    return {
      pattern: 'exploring', // 'exploring', 'focused', 'lost', 'completing'
      confidence: 0.7
    };
  }

  loadHistory(history) {
    this.history = history;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContextAnalyzer;
} else if (typeof window !== 'undefined') {
  window.ContextAnalyzer = ContextAnalyzer;
}