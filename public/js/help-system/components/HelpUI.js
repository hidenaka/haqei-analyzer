/**
 * HAQEI Intelligent Help System - Help UI Component
 * 
 * Responsive, accessible UI component that provides multiple
 * interaction modes for help content delivery.
 * 
 * UI Modes:
 * - Modal: Full-screen overlay for detailed explanations
 * - Sidebar: Collapsible side panel for quick reference
 * - Tooltip: Contextual pop-ups for inline help
 * - Floating: Persistent help button with expandable content
 * 
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                       HelpUI                                │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │Modal System │  │Sidebar      │  │Tooltip Manager      │  │
 * │  │- Overlay    │  │- Slide panel│  │- Smart positioning  │  │
 * │  │- Focus mgmt │  │- Collapsible│  │- Auto dismiss       │  │
 * │  │- Escape key │  │- Resizable  │  │- Touch optimized    │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * │                                                             │
 * │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
 * │  │Floating Btn │  │Content      │  │Accessibility        │  │
 * │  │- FAB design │  │Renderer     │  │- ARIA labels        │  │
 * │  │- Expandable │  │- Markdown   │  │- Keyboard nav       │  │
 * │  │- Draggable  │  │- Search     │  │- Screen reader      │  │
 * │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
 * └─────────────────────────────────────────────────────────────┘
 */

class HelpUI {
  constructor(helpSystem) {
    this.helpSystem = helpSystem;
    this.currentMode = 'floating'; // 'modal', 'sidebar', 'tooltip', 'floating'
    this.isVisible = false;
    this.elements = new Map();
    this.activeTooltips = new Set();
    
    // Configuration
    this.config = {
      themes: ['light', 'dark', 'adaptive'],
      positions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      animations: true,
      autoHide: true,
      autoHideDelay: 5000,
      maxTooltips: 3,
      keyboardShortcuts: {
        toggle: 'F1',
        close: 'Escape',
        search: 'Ctrl+/'
      }
    };

    // State management
    this.state = {
      activeContent: null,
      searchQuery: '',
      searchResults: [],
      history: [],
      preferences: this.loadUIPreferences()
    };

    this.init();
  }

  /**
   * Initialize Help UI system
   */
  async init() {
    try {
      await this.createUIElements();
      this.setupEventListeners();
      this.setupKeyboardShortcuts();
      this.setupAccessibility();
      this.applyTheme();
      
      console.log('✅ HelpUI initialized');
    } catch (error) {
      console.error('❌ Failed to initialize HelpUI:', error);
      throw error;
    }
  }

  /**
   * Create all UI elements
   */
  async createUIElements() {
    // Create floating help button
    this.createFloatingButton();
    
    // Create modal system
    this.createModalSystem();
    
    // Create sidebar
    this.createSidebar();
    
    // Create tooltip system
    this.createTooltipSystem();
    
    // Create loading styles
    await this.injectStyles();
  }

  /**
   * Create floating help button (FAB)
   */
  createFloatingButton() {
    const button = document.createElement('button');
    button.className = 'haqei-help-trigger';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12" y2="17"></line>
      </svg>
    `;
    button.setAttribute('aria-label', 'HAQEIヘルプを開く');
    button.setAttribute('data-help-context', 'help-trigger');
    
    // Position based on preferences
    const position = this.state.preferences.position || 'bottom-right';
    this.applyPositioning(button, position);
    
    // Add click handler
    button.addEventListener('click', () => {
      this.toggleHelp();
    });
    
    // Add to page
    document.body.appendChild(button);
    this.elements.set('floatingButton', button);
  }

  /**
   * Create modal system for detailed help
   */
  createModalSystem() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'haqei-help-modal-overlay';
    modalOverlay.style.display = 'none';
    
    const modal = document.createElement('div');
    modal.className = 'haqei-help-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'help-modal-title');
    
    modal.innerHTML = `
      <div class="haqei-help-modal-header">
        <h2 id="help-modal-title">HAQEIヘルプ</h2>
        <div class="haqei-help-modal-controls">
          <input type="search" 
                 class="haqei-help-search" 
                 placeholder="用語を検索..." 
                 aria-label="ヘルプ検索">
          <button class="haqei-help-close" aria-label="ヘルプを閉じる">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="haqei-help-modal-content">
        <div class="haqei-help-navigation">
          <ul class="haqei-help-categories" role="menu">
            <li><button role="menuitem" data-category="architecture">Triple OS</button></li>
            <li><button role="menuitem" data-category="philosophy">bunenjin</button></li>
            <li><button role="menuitem" data-category="iching">64卦・I Ching</button></li>
            <li><button role="menuitem" data-category="general">一般</button></li>
          </ul>
        </div>
        <div class="haqei-help-main">
          <div class="haqei-help-content-area" id="help-content">
            <!-- Dynamic content -->
          </div>
        </div>
      </div>
    `;
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // Setup modal event handlers
    this.setupModalHandlers(modal, modalOverlay);
    
    this.elements.set('modalOverlay', modalOverlay);
    this.elements.set('modal', modal);
  }

  /**
   * Create collapsible sidebar
   */
  createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'haqei-help-sidebar';
    sidebar.style.display = 'none';
    sidebar.setAttribute('role', 'complementary');
    sidebar.setAttribute('aria-label', 'ヘルプサイドバー');
    
    sidebar.innerHTML = `
      <div class="haqei-help-sidebar-header">
        <h3>クイックヘルプ</h3>
        <button class="haqei-help-sidebar-close" aria-label="サイドバーを閉じる">×</button>
      </div>
      <div class="haqei-help-sidebar-content">
        <div class="haqei-help-quick-search">
          <input type="search" placeholder="用語検索..." aria-label="用語検索">
        </div>
        <div class="haqei-help-suggestions">
          <!-- Dynamic suggestions -->
        </div>
      </div>
    `;
    
    document.body.appendChild(sidebar);
    this.setupSidebarHandlers(sidebar);
    this.elements.set('sidebar', sidebar);
  }

  /**
   * Create tooltip system
   */
  createTooltipSystem() {
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'haqei-help-tooltip-container';
    tooltipContainer.setAttribute('role', 'tooltip');
    tooltipContainer.style.display = 'none';
    
    document.body.appendChild(tooltipContainer);
    this.elements.set('tooltipContainer', tooltipContainer);
  }

  /**
   * Setup modal event handlers
   */
  setupModalHandlers(modal, overlay) {
    // Close button
    const closeBtn = modal.querySelector('.haqei-help-close');
    closeBtn.addEventListener('click', () => {
      this.hideModal();
    });

    // Overlay click to close
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        this.hideModal();
      }
    });

    // Search functionality
    const searchInput = modal.querySelector('.haqei-help-search');
    searchInput.addEventListener('input', this.debounce((event) => {
      this.performSearch(event.target.value);
    }, 300));

    // Category navigation
    const categoryButtons = modal.querySelectorAll('[data-category]');
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        this.showCategoryContent(category);
      });
    });
  }

  /**
   * Setup sidebar handlers
   */
  setupSidebarHandlers(sidebar) {
    const closeBtn = sidebar.querySelector('.haqei-help-sidebar-close');
    closeBtn.addEventListener('click', () => {
      this.hideSidebar();
    });

    const searchInput = sidebar.querySelector('input[type="search"]');
    searchInput.addEventListener('input', this.debounce((event) => {
      this.updateSidebarSuggestions(event.target.value);
    }, 200));
  }

  /**
   * Main help display method
   */
  async showHelp(helpRequest) {
    const { type, context, data } = helpRequest;
    
    try {
      // Determine best UI mode for the request
      const mode = this.determineBestMode(helpRequest);
      
      // Prepare content
      const content = await this.prepareContent(helpRequest);
      
      // Show in appropriate mode
      switch (mode) {
        case 'modal':
          await this.showModal(content);
          break;
        case 'sidebar':
          await this.showSidebar(content);
          break;
        case 'tooltip':
          await this.showTooltip(content, data.element);
          break;
        default:
          await this.showFloatingContent(content);
      }
      
      // Track usage
      this.trackHelpUsage(helpRequest, mode);
      
    } catch (error) {
      console.error('Failed to show help:', error);
      this.showErrorMessage('ヘルプの表示に失敗しました');
    }
  }

  /**
   * Determine best UI mode for help request
   */
  determineBestMode(helpRequest) {
    const { type, trigger, data } = helpRequest;
    
    // User explicitly requested help
    if (type === 'explicit') {
      return 'modal';
    }
    
    // Proactive help based on behavior
    if (type === 'proactive') {
      if (trigger === 'confusion') {
        return 'tooltip';
      }
      if (trigger === 'hesitation') {
        return 'sidebar';
      }
      if (trigger === 'interest') {
        return 'sidebar';
      }
    }
    
    // Context-specific help
    if (data?.element && this.isSmallScreen()) {
      return 'modal';
    }
    
    return 'tooltip';
  }

  /**
   * Prepare content for display
   */
  async prepareContent(helpRequest) {
    const { context, data } = helpRequest;
    const glossaryManager = this.helpSystem.getComponent('glossaryManager');
    
    let content = {
      title: 'ヘルプ',
      body: '',
      suggestions: [],
      relatedTerms: []
    };

    // Context-based content preparation
    if (data?.element?.contextType) {
      content = await this.prepareContextualContent(data.element.contextType, glossaryManager);
    } else if (context?.visibleElements?.length > 0) {
      content = await this.prepareVisibilityBasedContent(context.visibleElements, glossaryManager);
    } else {
      content = await this.prepareGeneralContent(glossaryManager);
    }

    return content;
  }

  /**
   * Prepare contextual content based on element type
   */
  async prepareContextualContent(contextType, glossaryManager) {
    const content = { suggestions: [], relatedTerms: [] };
    
    switch (contextType) {
      case 'triple-os':
        const tripleOSInfo = glossaryManager.getDefinition('Triple OS');
        content.title = 'Triple OS について';
        content.body = this.formatTermDefinition(tripleOSInfo);
        content.suggestions = glossaryManager.getTermsByCategory('architecture');
        break;
        
      case 'bunenjin':
        const bunenjinInfo = glossaryManager.getDefinition('bunenjin');
        content.title = 'bunenjin 哲学について';
        content.body = this.formatTermDefinition(bunenjinInfo);
        content.suggestions = glossaryManager.getTermsByCategory('philosophy');
        break;
        
      case 'question':
        content.title = '質問について';
        content.body = 'HAQEIの質問は、古代中国の易経（I Ching）の智慧に基づいて設計されています。各質問はあなたの深層心理を探るためのものです。';
        content.suggestions = glossaryManager.getTermsByCategory('iching').slice(0, 3);
        break;
        
      case 'result':
        content.title = '結果の見方';
        content.body = '分析結果は、Triple OSアーキテクチャによって生成された、あなたの人格の多角的な分析です。各要素は相互に関連しています。';
        content.suggestions = [
          glossaryManager.getDefinition('Triple OS'),
          glossaryManager.getDefinition('64卦')
        ].filter(Boolean);
        break;
        
      default:
        return this.prepareGeneralContent(glossaryManager);
    }
    
    return content;
  }

  /**
   * Show modal with content
   */
  async showModal(content) {
    const overlay = this.elements.get('modalOverlay');
    const modal = this.elements.get('modal');
    const contentArea = modal.querySelector('#help-content');
    
    // Set content
    contentArea.innerHTML = this.renderContent(content);
    
    // Show modal
    overlay.style.display = 'flex';
    this.isVisible = true;
    this.currentMode = 'modal';
    
    // Focus management
    this.trapFocus(modal);
    
    // Update state
    this.state.activeContent = content;
    this.state.history.push({ type: 'modal', content, timestamp: Date.now() });
  }

  /**
   * Show tooltip near element
   */
  async showTooltip(content, targetElement) {
    if (this.activeTooltips.size >= this.config.maxTooltips) {
      // Remove oldest tooltip
      const oldest = this.activeTooltips.values().next().value;
      this.hideTooltip(oldest);
    }
    
    const tooltip = this.createTooltipElement(content);
    const position = this.calculateTooltipPosition(targetElement, tooltip);
    
    // Position tooltip
    tooltip.style.left = position.x + 'px';
    tooltip.style.top = position.y + 'px';
    tooltip.style.display = 'block';
    
    // Add to page
    document.body.appendChild(tooltip);
    this.activeTooltips.add(tooltip);
    
    // Auto-hide after delay
    if (this.config.autoHide) {
      setTimeout(() => {
        this.hideTooltip(tooltip);
      }, this.config.autoHideDelay);
    }
    
    // Setup close handlers
    this.setupTooltipHandlers(tooltip);
  }

  /**
   * Render content to HTML
   */
  renderContent(content) {
    return `
      <div class="haqei-help-content">
        <h3>${this.escapeHtml(content.title)}</h3>
        <div class="haqei-help-body">
          ${this.formatContentBody(content.body)}
        </div>
        ${content.suggestions.length > 0 ? `
          <div class="haqei-help-suggestions">
            <h4>関連する用語</h4>
            <ul>
              ${content.suggestions.map(term => `
                <li>
                  <button class="haqei-help-term-link" data-term-id="${term.id}">
                    ${this.escapeHtml(term.term)}
                  </button>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Format term definition for display
   */
  formatTermDefinition(termInfo) {
    if (!termInfo) return '';
    
    return `
      <div class="haqei-term-definition">
        <p class="definition">${this.escapeHtml(termInfo.definition)}</p>
        ${termInfo.explanation ? `
          <div class="explanation">
            ${this.formatExplanation(termInfo.explanation)}
          </div>
        ` : ''}
        ${termInfo.examples.length > 0 ? `
          <div class="examples">
            <h5>使用例:</h5>
            <ul>
              ${termInfo.examples.map(ex => `<li>${this.escapeHtml(ex)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // F1 to toggle help
      if (event.key === 'F1') {
        event.preventDefault();
        this.toggleHelp();
      }
      
      // Escape to close help
      if (event.key === 'Escape' && this.isVisible) {
        event.preventDefault();
        this.hideHelp();
      }
      
      // Ctrl+/ for search
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        this.focusSearch();
      }
    });
  }

  /**
   * Toggle help visibility
   */
  toggleHelp() {
    if (this.isVisible) {
      this.hideHelp();
    } else {
      this.showHelp({
        type: 'explicit',
        context: this.helpSystem.getComponent('contextAnalyzer')?.getCurrentContext(),
        timestamp: Date.now()
      });
    }
  }

  /**
   * Hide help in all modes
   */
  hideHelp() {
    this.hideModal();
    this.hideSidebar();
    this.hideAllTooltips();
    this.isVisible = false;
  }

  // Utility methods
  isSmallScreen() {
    return window.innerWidth < 768;
  }

  loadUIPreferences() {
    try {
      const saved = localStorage.getItem('haqei-help-ui-preferences');
      return saved ? JSON.parse(saved) : {
        theme: 'adaptive',
        position: 'bottom-right',
        animations: true
      };
    } catch (error) {
      return {};
    }
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

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async injectStyles() {
    const styles = `
      .haqei-help-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(2px);
      }
      
      .haqei-help-modal {
        background: var(--help-bg);
        border-radius: var(--help-radius);
        box-shadow: var(--help-shadow);
        max-width: 90vw;
        max-height: 90vh;
        width: 800px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .haqei-help-modal-header {
        padding: 20px;
        border-bottom: 1px solid var(--help-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--help-bg);
      }
      
      .haqei-help-modal-content {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      
      .haqei-help-navigation {
        width: 200px;
        background: #f8fafc;
        border-right: 1px solid var(--help-border);
        padding: 20px;
      }
      
      .haqei-help-main {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
      }
      
      .haqei-help-sidebar {
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        width: 350px;
        background: var(--help-bg);
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }
      
      .haqei-help-sidebar.visible {
        transform: translateX(0);
      }
      
      @media (max-width: 768px) {
        .haqei-help-modal {
          width: 95vw;
          height: 95vh;
        }
        
        .haqei-help-modal-content {
          flex-direction: column;
        }
        
        .haqei-help-navigation {
          width: 100%;
          border-right: none;
          border-bottom: 1px solid var(--help-border);
        }
        
        .haqei-help-sidebar {
          width: 100%;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // Public API methods
  show(content) {
    return this.showModal({ title: 'ヘルプ', body: content, suggestions: [] });
  }

  hide() {
    this.hideHelp();
  }

  search(query) {
    const glossaryManager = this.helpSystem.getComponent('glossaryManager');
    return glossaryManager?.search(query) || [];
  }

  getState() {
    return { ...this.state };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HelpUI;
} else if (typeof window !== 'undefined') {
  window.HelpUI = HelpUI;
}