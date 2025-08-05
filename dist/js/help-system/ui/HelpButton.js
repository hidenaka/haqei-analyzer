/**
 * HelpButton.js - HAQEI Intelligent Help System
 * Floating help button with contextual assistance
 * 
 * Features:
 * - Smart contextual help suggestions
 * - Floating action button design
 * - Quick access to help features
 * - Adaptive positioning
 * - Voice commands support (future)
 */

class HelpButton {
    constructor(options = {}) {
        this.options = {
            position: options.position || 'bottom-right',
            showDelay: options.showDelay || 1000,
            hideDelay: options.hideDelay || 5000,
            autoHide: options.autoHide !== false,
            contextualHelp: options.contextualHelp !== false,
            animations: options.animations !== false,
            ...options
        };
        
        this.isVisible = false;
        this.isExpanded = false;
        this.buttonElement = null;
        this.menuElement = null;
        this.showTimer = null;
        this.hideTimer = null;
        this.currentContext = null;
        this.helpSuggestions = [];
        
        this.init();
    }
    
    init() {
        this.createButtonStructure();
        this.attachEventListeners();
        this.setupContextualHelp();
        this.scheduleShow();
    }
    
    createButtonStructure() {
        // Main floating button
        this.buttonElement = document.createElement('div');
        this.buttonElement.className = `haqei-help-button help-button-${this.options.position}`;
        this.buttonElement.setAttribute('role', 'button');
        this.buttonElement.setAttribute('aria-label', 'ヘルプを開く');
        this.buttonElement.setAttribute('aria-expanded', 'false');
        this.buttonElement.setAttribute('tabindex', '0');
        
        // Button content
        this.buttonElement.innerHTML = `
            <div class="help-button-main">
                <div class="help-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 17h.01" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <div class="help-pulse"></div>
                <div class="help-notification-badge" style="display: none;">
                    <span class="badge-count">1</span>
                </div>
            </div>
        `;
        
        // Help menu
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'help-button-menu';
        this.menuElement.setAttribute('role', 'menu');
        this.menuElement.setAttribute('aria-hidden', 'true');
        
        this.menuElement.innerHTML = `
            <div class="menu-header">
                <h3>ヘルプ</h3>
                <button class="menu-close" aria-label="メニューを閉じる">×</button>
            </div>
            <div class="menu-content">
                <div class="contextual-help" style="display: none;">
                    <h4>現在のページについて</h4>
                    <ul class="help-suggestions"></ul>
                </div>
                <div class="menu-actions">
                    <button class="help-action" data-action="tutorial">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                        </svg>
                        <span>チュートリアル</span>
                    </button>
                    <button class="help-action" data-action="search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span>ヘルプを検索</span>
                    </button>
                    <button class="help-action" data-action="contact">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span>お問い合わせ</span>
                    </button>
                    <button class="help-action" data-action="shortcuts">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M6 8h.01M10 8h.01M14 8h.01M6 12h.01M10 12h.01M14 12h.01M6 16h.01M10 16h.01M14 16h.01" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span>キーボードショートカット</span>
                    </button>
                </div>
                <div class="menu-footer">
                    <div class="help-settings">
                        <label class="settings-item">
                            <input type="checkbox" class="auto-help-toggle">
                            <span>自動ヘルプを有効にする</span>
                        </label>
                        <label class="settings-item">
                            <input type="checkbox" class="sound-toggle">
                            <span>効果音を有効にする</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        // Assemble structure
        this.buttonElement.appendChild(this.menuElement);
        document.body.appendChild(this.buttonElement);
        
        // Initially hide
        this.buttonElement.style.display = 'none';
    }
    
    attachEventListeners() {
        // Main button click
        this.buttonElement.addEventListener('click', this.handleButtonClick.bind(this));
        
        // Menu interactions
        this.menuElement.addEventListener('click', this.handleMenuClick.bind(this));
        
        // Keyboard navigation
        this.buttonElement.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Outside click to close menu
        document.addEventListener('click', this.handleOutsideClick.bind(this));
        
        // Mouse events for auto-hide
        this.buttonElement.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        this.buttonElement.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Page navigation detection
        window.addEventListener('hashchange', this.handlePageChange.bind(this));
        window.addEventListener('popstate', this.handlePageChange.bind(this));
        
        // Scroll handling
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Settings changes
        this.menuElement.addEventListener('change', this.handleSettingsChange.bind(this));
    }
    
    handleButtonClick(event) {
        event.stopPropagation();
        
        if (this.isExpanded) {
            this.collapseMenu();
        } else {
            this.expandMenu();
        }
        
        this.trackInteraction('button_click');
    }
    
    handleMenuClick(event) {
        const action = event.target.closest('[data-action]');
        if (action) {
            event.preventDefault();
            this.handleAction(action.getAttribute('data-action'));
        }
        
        if (event.target.classList.contains('menu-close')) {
            this.collapseMenu();
        }
    }
    
    handleKeydown(event) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                if (event.target === this.buttonElement) {
                    event.preventDefault();
                    this.handleButtonClick(event);
                }
                break;
            case 'Escape':
                if (this.isExpanded) {
                    this.collapseMenu();
                }
                break;
            case 'Tab':
                if (this.isExpanded) {
                    this.handleTabNavigation(event);
                }
                break;
        }
    }
    
    handleTabNavigation(event) {
        const focusableElements = this.menuElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    handleOutsideClick(event) {
        if (this.isExpanded && !this.buttonElement.contains(event.target)) {
            this.collapseMenu();
        }
    }
    
    handleMouseEnter() {
        this.clearHideTimer();
        
        if (this.options.contextualHelp) {
            this.updateContextualHelp();
        }
    }
    
    handleMouseLeave() {
        if (!this.isExpanded && this.options.autoHide) {
            this.scheduleHide();
        }
    }
    
    handlePageChange() {
        this.currentContext = this.detectPageContext();
        this.updateContextualHelp();
        
        // Show notification if new help is available
        if (this.hasNewContextualHelp()) {
            this.showNotificationBadge();
        }
    }
    
    handleScroll() {
        // Hide menu on scroll
        if (this.isExpanded) {
            this.collapseMenu();
        }
        
        // Update position on mobile
        if (window.innerWidth <= 768) {
            this.updateMobilePosition();
        }
    }
    
    handleSettingsChange(event) {
        const target = event.target;
        
        if (target.classList.contains('auto-help-toggle')) {
            this.setAutoHelp(target.checked);
        } else if (target.classList.contains('sound-toggle')) {
            this.setSoundEnabled(target.checked);
        }
    }
    
    handleAction(action) {
        this.trackInteraction('action_click', { action });
        
        switch (action) {
            case 'tutorial':
                this.startTutorial();
                break;
            case 'search':
                this.openSearchModal();
                break;
            case 'contact':
                this.openContactForm();
                break;
            case 'shortcuts':
                this.showKeyboardShortcuts();
                break;
        }
        
        this.collapseMenu();
    }
    
    expandMenu() {
        if (this.isExpanded) return;
        
        this.isExpanded = true;
        this.buttonElement.setAttribute('aria-expanded', 'true');
        this.menuElement.setAttribute('aria-hidden', 'false');
        
        // Update contextual help
        this.updateContextualHelp();
        
        // Animate menu
        this.menuElement.classList.add('menu-visible');
        
        // Focus first menu item
        const firstAction = this.menuElement.querySelector('.help-action');
        if (firstAction) {
            firstAction.focus();
        }
        
        this.trackInteraction('menu_expand');
    }
    
    collapseMenu() {
        if (!this.isExpanded) return;
        
        this.isExpanded = false;
        this.buttonElement.setAttribute('aria-expanded', 'false');
        this.menuElement.setAttribute('aria-hidden', 'true');
        
        this.menuElement.classList.remove('menu-visible');
        
        // Return focus to button
        this.buttonElement.focus();
        
        this.trackInteraction('menu_collapse');
    }
    
    setupContextualHelp() {
        if (!this.options.contextualHelp) return;
        
        this.currentContext = this.detectPageContext();
        this.loadHelpDatabase();
    }
    
    detectPageContext() {
        const url = window.location.href;
        const hash = window.location.hash;
        const pathname = window.location.pathname;
        
        // Detect HAQEI page context
        if (hash.includes('results') || pathname.includes('results')) {
            return {
                page: 'results',
                section: this.detectResultsSection(),
                features: this.getAvailableFeatures()
            };
        } else if (hash.includes('questions') || pathname.includes('questions')) {
            return {
                page: 'questions',
                section: this.detectQuestionSection(),
                features: this.getAvailableFeatures()
            };
        } else if (pathname.includes('future_simulator')) {
            return {
                page: 'future_simulator',
                section: this.detectSimulatorSection(),
                features: this.getAvailableFeatures()
            };
        } else {
            return {
                page: 'home',
                section: 'welcome',
                features: this.getAvailableFeatures()
            };
        }
    }
    
    detectResultsSection() {
        if (document.querySelector('.personality-chart')) return 'personality_chart';
        if (document.querySelector('.detailed-analysis')) return 'detailed_analysis';
        if (document.querySelector('.recommendations')) return 'recommendations';
        return 'overview';
    }
    
    detectQuestionSection() {
        const questionNumber = document.querySelector('[data-question-number]');
        if (questionNumber) {
            return `question_${questionNumber.getAttribute('data-question-number')}`;
        }
        return 'question_flow';
    }
    
    detectSimulatorSection() {
        if (document.querySelector('.scenario-input')) return 'scenario_input';
        if (document.querySelector('.simulation-results')) return 'simulation_results';
        return 'simulator_main';
    }
    
    getAvailableFeatures() {
        const features = [];
        
        if (document.querySelector('[data-tooltip]')) features.push('tooltips');
        if (document.querySelector('.progress-container')) features.push('progress_tracking');
        if (document.querySelector('.navigation-menu')) features.push('navigation');
        
        return features;
    }
    
    loadHelpDatabase() {
        // Mock help database - in real implementation, load from API
        this.helpDatabase = {
            results: {
                personality_chart: [
                    { title: 'チャートの読み方', description: '各軸の意味と解釈方法' },
                    { title: 'データのエクスポート', description: '結果を保存・共有する方法' }
                ],
                detailed_analysis: [
                    { title: '分析結果の詳細', description: '各項目の詳しい説明' },
                    { title: '改善提案', description: 'パーソナリティの向上方法' }
                ]
            },
            questions: {
                question_flow: [
                    { title: '質問の答え方', description: '効果的な回答のコツ' },
                    { title: '進捗の保存', description: '途中で中断した場合の対処' }
                ]
            },
            future_simulator: {
                scenario_input: [
                    { title: 'シナリオの作成', description: '効果的なシナリオの書き方' },
                    { title: 'パラメータ調整', description: 'シミュレーション設定の最適化' }
                ]
            }
        };
    }
    
    updateContextualHelp() {
        if (!this.options.contextualHelp || !this.currentContext) return;
        
        const suggestions = this.getContextualSuggestions();
        const contextualSection = this.menuElement.querySelector('.contextual-help');
        const suggestionsList = this.menuElement.querySelector('.help-suggestions');
        
        if (suggestions.length > 0) {
            suggestionsList.innerHTML = suggestions.map(suggestion => `
                <li>
                    <button class="suggestion-item" data-suggestion="${suggestion.id}">
                        <strong>${suggestion.title}</strong>
                        <span>${suggestion.description}</span>
                    </button>
                </li>
            `).join('');
            
            contextualSection.style.display = 'block';
        } else {
            contextualSection.style.display = 'none';
        }
    }
    
    getContextualSuggestions() {
        const { page, section } = this.currentContext;
        const pageHelp = this.helpDatabase[page];
        
        if (!pageHelp) return [];
        
        return pageHelp[section] || [];
    }
    
    hasNewContextualHelp() {
        const suggestions = this.getContextualSuggestions();
        const lastSuggestions = this.helpSuggestions || [];
        
        return suggestions.length > lastSuggestions.length ||
               suggestions.some(s => !lastSuggestions.find(ls => ls.id === s.id));
    }
    
    showNotificationBadge() {
        const badge = this.buttonElement.querySelector('.help-notification-badge');
        const count = this.getContextualSuggestions().length;
        
        if (count > 0) {
            badge.querySelector('.badge-count').textContent = count;
            badge.style.display = 'block';
            
            // Auto-hide after delay
            setTimeout(() => {
                badge.style.display = 'none';
            }, 5000);
        }
    }
    
    scheduleShow() {
        if (this.isVisible) return;
        
        this.showTimer = setTimeout(() => {
            this.show();
        }, this.options.showDelay);
    }
    
    scheduleHide() {
        if (!this.options.autoHide) return;
        
        this.hideTimer = setTimeout(() => {
            this.hide();
        }, this.options.hideDelay);
    }
    
    clearShowTimer() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }
    }
    
    clearHideTimer() {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
    }
    
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.buttonElement.style.display = 'block';
        
        // Animate in
        requestAnimationFrame(() => {
            this.buttonElement.classList.add('button-visible');
        });
        
        // Auto-hide if enabled
        if (this.options.autoHide) {
            this.scheduleHide();
        }
        
        this.trackInteraction('button_show');
    }
    
    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        this.collapseMenu();
        
        this.buttonElement.classList.remove('button-visible');
        
        setTimeout(() => {
            this.buttonElement.style.display = 'none';
        }, 300);
        
        this.trackInteraction('button_hide');
    }
    
    updateMobilePosition() {
        if (window.innerWidth <= 768) {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Adjust position to avoid keyboard on mobile
            if (scrollY > 100) {
                this.buttonElement.style.bottom = '20px';
            } else {
                this.buttonElement.style.bottom = '80px';
            }
        }
    }
    
    // Action handlers
    startTutorial() {
        const context = this.currentContext?.page || 'welcome';
        
        const event = new CustomEvent('haqei:startTutorial', {
            detail: { 
                tutorialId: `${context}-tour`,
                context: this.currentContext
            }
        });
        document.dispatchEvent(event);
    }
    
    openSearchModal() {
        const event = new CustomEvent('haqei:openHelpSearch', {
            detail: { context: this.currentContext }
        });
        document.dispatchEvent(event);
    }
    
    openContactForm() {
        const event = new CustomEvent('haqei:openContactForm', {
            detail: { 
                context: this.currentContext,
                suggestions: this.getContextualSuggestions()
            }
        });
        document.dispatchEvent(event);
    }
    
    showKeyboardShortcuts() {
        const event = new CustomEvent('haqei:showKeyboardShortcuts', {
            detail: { context: this.currentContext }
        });
        document.dispatchEvent(event);
    }
    
    // Settings management
    setAutoHelp(enabled) {
        const settings = this.getSettings();
        settings.autoHelp = enabled;
        this.saveSettings(settings);
        
        if (enabled) {
            this.enableAutoHelp();
        } else {
            this.disableAutoHelp();
        }
    }
    
    setSoundEnabled(enabled) {
        const settings = this.getSettings();
        settings.soundEnabled = enabled;
        this.saveSettings(settings);
    }
    
    enableAutoHelp() {
        // Enable automatic contextual suggestions
        this.options.contextualHelp = true;
        this.setupContextualHelp();
    }
    
    disableAutoHelp() {
        this.options.contextualHelp = false;
        const contextualSection = this.menuElement.querySelector('.contextual-help');
        contextualSection.style.display = 'none';
    }
    
    getSettings() {
        return JSON.parse(localStorage.getItem('haqei-help-button-settings') || '{}');
    }
    
    saveSettings(settings) {
        localStorage.setItem('haqei-help-button-settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const settings = this.getSettings();
        
        // Apply settings to UI
        const autoHelpToggle = this.menuElement.querySelector('.auto-help-toggle');
        const soundToggle = this.menuElement.querySelector('.sound-toggle');
        
        if (autoHelpToggle) autoHelpToggle.checked = settings.autoHelp !== false;
        if (soundToggle) soundToggle.checked = settings.soundEnabled !== false;
        
        // Apply settings to behavior
        if (settings.autoHelp === false) {
            this.disableAutoHelp();
        }
    }
    
    // Analytics and tracking
    trackInteraction(event, data = {}) {
        if (window.gtag) {
            gtag('event', `help_button_${event}`, {
                'event_category': 'help_system',
                'event_label': this.currentContext?.page,
                ...data
            });
        }
        
        // Internal tracking
        const stats = JSON.parse(localStorage.getItem('haqei-help-button-stats') || '{}');
        stats.interactions = (stats.interactions || 0) + 1;
        stats.lastInteraction = event;
        stats.lastInteractionTime = Date.now();
        stats.context = this.currentContext;
        localStorage.setItem('haqei-help-button-stats', JSON.stringify(stats));
    }
    
    // Public API
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    setPosition(position) {
        this.buttonElement.className = this.buttonElement.className.replace(
            /help-button-\w+-\w+/,
            `help-button-${position}`
        );
        this.options.position = position;
    }
    
    updateContext(context) {
        this.currentContext = context;
        this.updateContextualHelp();
    }
    
    addCustomAction(id, config) {
        const actionsContainer = this.menuElement.querySelector('.menu-actions');
        const actionButton = document.createElement('button');
        actionButton.className = 'help-action';
        actionButton.setAttribute('data-action', id);
        actionButton.innerHTML = `
            ${config.icon || '<svg width="20" height="20"><circle cx="10" cy="10" r="8"/></svg>'}
            <span>${config.label}</span>
        `;
        
        actionsContainer.appendChild(actionButton);
        
        // Add handler
        actionButton.addEventListener('click', () => {
            if (config.handler) {
                config.handler();
            }
            this.collapseMenu();
        });
    }
    
    destroy() {
        this.clearShowTimer();
        this.clearHideTimer();
        
        if (this.buttonElement) {
            this.buttonElement.remove();
        }
        
        // Remove event listeners
        document.removeEventListener('click', this.handleOutsideClick);
        window.removeEventListener('hashchange', this.handlePageChange);
        window.removeEventListener('popstate', this.handlePageChange);
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpButton;
} else {
    window.HelpButton = HelpButton;
}