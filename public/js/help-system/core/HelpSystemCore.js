/**
 * HAQEI Intelligent Help System - Core Architecture
 * 
 * Architecture Pattern: Modular, Non-Invasive Help System
 * 
 * System Architecture Overview:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    HAQEI Help System                        │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │HelpSystemCore│  │GlossaryMgr  │  │ContextAnalyzer      │  │
 * │  │- Initialize │  │- Terms DB   │  │- Detect context     │  │
 * │  │- Coordinate │  │- Definitions│  │- Smart suggestions  │  │
 * │  │- Event Bus  │  │- i18n       │  │- Usage patterns     │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * │         │                │                    │             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │HelpUI       │  │TooltipMgr   │  │ProgressiveHelp      │  │
 * │  │- Modal      │  │- Smart tips │  │- Step-by-step       │  │
 * │  │- Sidebar    │  │- Positioning│  │- Adaptive guidance  │  │
 * │  │- Overlay    │  │- Timing     │  │- User level aware   │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 *                             │
 * ┌─────────────────────────────────────────────────────────────┐
 * │              Existing HAQEI System                          │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │Triple OS    │  │bunenjin     │  │64卦 (I Ching)      │  │
 * │  │Engine/Safe/ │  │philosophy   │  │Hexagram system      │  │
 * │  │Interface    │  │framework    │  │序卦伝 logic         │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Integration Strategy:
 * 1. Event-driven architecture - no direct code modification
 * 2. DOM observation for context detection
 * 3. CSS injection for styling
 * 4. Local storage for user preferences
 * 5. Progressive enhancement approach
 * 
 * Key Design Principles:
 * - Non-invasive: Zero modification to existing codebase
 * - Modular: Each component is independent and reusable
 * - Contextual: Smart detection of user needs
 * - Accessible: WCAG 2.1 AA compliant
 * - Mobile-first: Responsive design with touch optimization
 * - Performance: Lazy loading and efficient memory usage
 */

class HelpSystemCore {
  constructor(options = {}) {
    this.options = {
      debug: false,
      theme: 'adaptive', // 'light', 'dark', 'adaptive'
      language: 'ja',
      position: 'bottom-right',
      autoShow: true,
      animations: true,
      ...options
    };

    // Core components registry
    this.components = new Map();
    this.managers = new Map();
    this.eventBus = new EventTarget();
    
    // State management
    this.state = {
      initialized: false,
      active: false,
      currentContext: null,
      userLevel: 'beginner', // 'beginner', 'intermediate', 'advanced'
      preferences: this.loadUserPreferences()
    };

    // Performance tracking
    this.metrics = {
      initTime: 0,
      helpRequests: 0,
      successfulHelps: 0,
      averageEngagementTime: 0
    };

    this.init();
  }

  /**
   * Initialize the help system
   * Phase 1: Core initialization
   * Phase 2: Component registration
   * Phase 3: Event listeners setup
   * Phase 4: Context detection activation
   */
  async init() {
    const startTime = performance.now();
    
    try {
      this.log('🎯 Initializing HAQEI Help System...');

      // Phase 1: Core initialization
      await this.initializeCore();
      
      // Phase 2: Register core components
      await this.registerComponents();
      
      // Phase 3: Setup event system
      this.setupEventSystem();
      
      // Phase 4: Activate context detection
      this.activateContextDetection();
      
      this.state.initialized = true;
      this.metrics.initTime = performance.now() - startTime;
      
      this.log(`✅ Help System initialized in ${this.metrics.initTime.toFixed(2)}ms`);
      this.dispatchEvent('helpSystemReady', { metrics: this.metrics });
      
    } catch (error) {
      this.error('Failed to initialize help system:', error);
      throw error;
    }
  }

  /**
   * Core system initialization
   * - Load configuration
   * - Setup storage
   * - Initialize theme system
   */
  async initializeCore() {
    // Load user preferences
    this.state.preferences = this.loadUserPreferences();
    
    // Initialize theme system
    this.initializeTheme();
    
    // Setup storage managers
    this.setupStorageManagers();
    
    // Load critical CSS
    await this.loadCriticalStyles();
  }

  /**
   * Register all help system components
   * Components are loaded lazily for performance
   */
  async registerComponents() {
    const componentConfigs = [
      { 
        name: 'glossaryManager', 
        class: 'GlossaryManager', 
        path: '/js/help-system/managers/GlossaryManager.js',
        critical: true
      },
      { 
        name: 'contextAnalyzer', 
        class: 'ContextAnalyzer', 
        path: '/js/help-system/components/ContextAnalyzer.js',
        critical: true
      },
      { 
        name: 'helpUI', 
        class: 'HelpUI', 
        path: '/js/help-system/components/HelpUI.js',
        critical: false
      },
      { 
        name: 'tooltipManager', 
        class: 'TooltipManager', 
        path: '/js/help-system/ui/TooltipManager.js',
        critical: false
      },
      { 
        name: 'progressiveHelp', 
        class: 'ProgressiveHelp', 
        path: '/js/help-system/components/ProgressiveHelp.js',
        critical: false
      }
    ];

    // Load critical components first
    const criticalComponents = componentConfigs.filter(c => c.critical);
    const nonCriticalComponents = componentConfigs.filter(c => !c.critical);

    // Load critical components synchronously
    for (const config of criticalComponents) {
      await this.loadComponent(config);
    }

    // Load non-critical components asynchronously
    Promise.all(nonCriticalComponents.map(config => this.loadComponent(config)))
      .then(() => {
        this.log('✅ All non-critical components loaded');
        this.dispatchEvent('allComponentsReady');
      })
      .catch(error => {
        this.error('Failed to load non-critical components:', error);
      });
  }

  /**
   * Load and register a component
   */
  async loadComponent(config) {
    try {
      // Dynamic import for modern browsers
      if (typeof import === 'function') {
        const module = await import(config.path);
        const ComponentClass = module[config.class] || module.default;
        
        if (ComponentClass) {
          const instance = new ComponentClass(this);
          this.components.set(config.name, instance);
          this.log(`✅ Loaded component: ${config.name}`);
        }
      } else {
        // Fallback for older browsers
        await this.loadScript(config.path);
        if (window[config.class]) {
          const instance = new window[config.class](this);
          this.components.set(config.name, instance);
          this.log(`✅ Loaded component (fallback): ${config.name}`);
        }
      }
    } catch (error) {
      this.error(`Failed to load component ${config.name}:`, error);
      throw error;
    }
  }

  /**
   * Setup event system for component communication
   */
  setupEventSystem() {
    // Core system events
    this.eventBus.addEventListener('contextChanged', (event) => {
      this.handleContextChange(event.detail);
    });

    this.eventBus.addEventListener('helpRequested', (event) => {
      this.handleHelpRequest(event.detail);
    });

    this.eventBus.addEventListener('userLevelChanged', (event) => {
      this.updateUserLevel(event.detail.level);
    });

    // Window events
    window.addEventListener('resize', this.debounce(() => {
      this.dispatchEvent('windowResize', { 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }, 250));

    // Visibility change
    document.addEventListener('visibilitychange', () => {
      this.dispatchEvent('visibilityChange', { 
        hidden: document.hidden 
      });
    });
  }

  /**
   * Activate context detection system
   */
  activateContextDetection() {
    const contextAnalyzer = this.components.get('contextAnalyzer');
    if (contextAnalyzer) {
      contextAnalyzer.startMonitoring();
      this.log('🔍 Context detection activated');
    }
  }

  /**
   * Handle context changes
   */
  handleContextChange(contextData) {
    this.state.currentContext = contextData;
    
    // Update help availability based on context
    this.updateHelpAvailability(contextData);
    
    // Trigger contextual help suggestions
    this.triggerContextualHelp(contextData);
    
    this.log('🔄 Context changed:', contextData);
  }

  /**
   * Handle help requests
   */
  async handleHelpRequest(requestData) {
    this.metrics.helpRequests++;
    
    try {
      const helpUI = this.components.get('helpUI');
      if (helpUI) {
        await helpUI.showHelp(requestData);
        this.metrics.successfulHelps++;
      }
    } catch (error) {
      this.error('Failed to handle help request:', error);
    }
  }

  /**
   * Update user level and adapt help system
   */
  updateUserLevel(level) {
    const previousLevel = this.state.userLevel;
    this.state.userLevel = level;
    
    // Save to preferences
    this.state.preferences.userLevel = level;
    this.saveUserPreferences();
    
    // Notify components of level change
    this.dispatchEvent('userLevelUpdated', { 
      previousLevel, 
      currentLevel: level 
    });
    
    this.log(`👤 User level updated: ${previousLevel} → ${level}`);
  }

  /**
   * Utility methods
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { 
      detail: { ...detail, timestamp: Date.now() } 
    });
    this.eventBus.dispatchEvent(event);
  }

  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('haqei-help-preferences');
      return saved ? JSON.parse(saved) : {
        language: 'ja',
        theme: 'adaptive',
        userLevel: 'beginner',
        showAnimations: true,
        autoShow: true
      };
    } catch (error) {
      this.error('Failed to load user preferences:', error);
      return {};
    }
  }

  saveUserPreferences() {
    try {
      localStorage.setItem('haqei-help-preferences', 
        JSON.stringify(this.state.preferences));
    } catch (error) {
      this.error('Failed to save user preferences:', error);
    }
  }

  async loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadCriticalStyles() {
    const criticalCSS = `
      .haqei-help-system {
        --help-primary: #2563eb;
        --help-secondary: #64748b;
        --help-success: #059669;
        --help-warning: #d97706;
        --help-error: #dc2626;
        --help-bg: #ffffff;
        --help-border: #e2e8f0;
        --help-text: #1e293b;
        --help-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        --help-radius: 8px;
        --help-z-index: 9999;
      }
      
      .haqei-help-system.dark {
        --help-bg: #1e293b;
        --help-border: #374151;
        --help-text: #f1f5f9;
      }
      
      .haqei-help-trigger {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        background: var(--help-primary);
        border-radius: 50%;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: var(--help-shadow);
        z-index: var(--help-z-index);
        transition: all 0.3s ease;
      }
      
      .haqei-help-trigger:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px -8px rgba(37, 99, 235, 0.5);
      }
      
      @media (max-width: 768px) {
        .haqei-help-trigger {
          bottom: 16px;
          right: 16px;
          width: 48px;
          height: 48px;
          font-size: 20px;
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  initializeTheme() {
    const theme = this.state.preferences.theme || 'adaptive';
    document.documentElement.setAttribute('data-help-theme', theme);
    
    if (theme === 'adaptive') {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        document.documentElement.setAttribute('data-help-theme', 
          e.matches ? 'dark' : 'light');
      });
    }
  }

  setupStorageManagers() {
    // Setup help data caching
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  updateHelpAvailability(contextData) {
    // Logic to determine which help options are available
    // based on current context
  }

  triggerContextualHelp(contextData) {
    // Logic to show contextual help suggestions
    // based on user behavior and current context
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  log(...args) {
    if (this.options.debug) {
      console.log('[HelpSystem]', ...args);
    }
  }

  error(...args) {
    console.error('[HelpSystem]', ...args);
  }

  // Public API methods
  getComponent(name) {
    return this.components.get(name);
  }

  isReady() {
    return this.state.initialized;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  destroy() {
    // Cleanup event listeners and components
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components.clear();
    this.state.initialized = false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HelpSystemCore;
} else if (typeof window !== 'undefined') {
  window.HelpSystemCore = HelpSystemCore;
}