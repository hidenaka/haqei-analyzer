/**
 * HelpSystemUI.js - HAQEI Intelligent Help System
 * Main integration and orchestration for all UI components
 * 
 * Features:
 * - Centralized management of all help UI components
 * - Auto-initialization and integration
 * - Event coordination between components
 * - Theme management and responsive behavior
 * - Performance optimization and lazy loading
 */

class HelpSystemUI {
    constructor(options = {}) {
        this.options = {
            autoInit: options.autoInit !== false,
            theme: options.theme || 'auto',
            components: {
                tooltips: options.tooltips !== false,
                modal: options.modal !== false,
                tutorial: options.tutorial !== false,
                helpButton: options.helpButton !== false
            },
            positioning: {
                helpButton: options.helpButtonPosition || 'bottom-right'
            },
            animations: options.animations !== false,
            accessibility: options.accessibility !== false,
            ...options
        };
        
        this.components = {};
        this.isInitialized = false;
        this.eventListeners = new Map();
        this.loadedStylesheets = new Set();
        
        if (this.options.autoInit) {
            this.init();
        }
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Load stylesheets first
            await this.loadStylesheets();
            
            // Detect theme and apply
            this.detectAndApplyTheme();
            
            // Initialize components in order
            await this.initializeComponents();
            
            // Set up cross-component communication
            this.setupEventCommunication();
            
            // Set up global event listeners
            this.setupGlobalListeners();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Dispatch initialization event
            this.dispatchEvent('haqei:helpSystemReady', {
                components: Object.keys(this.components),
                options: this.options
            });
            
            console.log('🎯 HAQEI Help System UI initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize HAQEI Help System UI:', error);
            throw error;
        }
    }
    
    async loadStylesheets() {
        const stylesheets = [
            '/css/help-system.css',
            '/css/help-animations.css'
        ];
        
        const loadPromises = stylesheets.map(href => {
            if (this.loadedStylesheets.has(href)) return Promise.resolve();
            
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = () => {
                    this.loadedStylesheets.add(href);
                    resolve();
                };
                link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
                document.head.appendChild(link);
            });
        });
        
        await Promise.all(loadPromises);
    }
    
    detectAndApplyTheme() {
        let theme = this.options.theme;
        
        if (theme === 'auto') {
            // Check user preference
            const storedTheme = localStorage.getItem('haqei-theme');
            if (storedTheme) {
                theme = storedTheme;
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
            } else {
                theme = 'light';
            }
        }
        
        this.setTheme(theme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('haqei-theme', theme);
        
        this.dispatchEvent('haqei:themeChanged', { theme });
    }
    
    async initializeComponents() {
        const { components } = this.options;
        
        // Initialize in dependency order
        if (components.tooltips) {
            await this.initializeTooltips();
        }
        
        if (components.modal) {
            await this.initializeModal();
        }
        
        if (components.tutorial) {
            await this.initializeTutorial();
        }
        
        if (components.helpButton) {
            await this.initializeHelpButton();
        }
    }
    
    async initializeTooltips() {
        if (typeof TooltipManager === 'undefined') {
            await this.loadScript('/js/help-system/ui/TooltipManager.js');
        }
        
        this.components.tooltips = new TooltipManager();
        console.log('✅ TooltipManager initialized');
    }
    
    async initializeModal() {
        if (typeof HelpModal === 'undefined') {
            await this.loadScript('/js/help-system/ui/HelpModal.js');
        }
        
        this.components.modal = new HelpModal();
        console.log('✅ HelpModal initialized');
    }
    
    async initializeTutorial() {
        if (typeof TutorialOverlay === 'undefined') {
            await this.loadScript('/js/help-system/ui/TutorialOverlay.js');
        }
        
        this.components.tutorial = new TutorialOverlay();
        console.log('✅ TutorialOverlay initialized');
    }
    
    async initializeHelpButton() {
        if (typeof HelpButton === 'undefined') {
            await this.loadScript('/js/help-system/ui/HelpButton.js');
        }
        
        this.components.helpButton = new HelpButton({
            position: this.options.positioning.helpButton,
            contextualHelp: true,
            animations: this.options.animations
        });
        console.log('✅ HelpButton initialized');
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }
    
    setupEventCommunication() {
        // Modal ↔ Tutorial communication
        if (this.components.modal && this.components.tutorial) {
            this.addEventListener('haqei:showDetailedHelp', (event) => {
                if (event.detail.tutorial) {
                    this.components.tutorial.startTutorial(event.detail.tutorialId);
                } else {
                    this.components.modal.showHelp(event.detail.term, event.detail.type);
                }
            });
        }
        
        // Help Button ↔ All components communication
        if (this.components.helpButton) {
            this.addEventListener('haqei:startTutorial', (event) => {
                if (this.components.tutorial) {
                    this.components.tutorial.startTutorial(event.detail.tutorialId, event.detail.force);
                }
            });
            
            this.addEventListener('haqei:openHelpSearch', (event) => {
                if (this.components.modal) {
                    this.components.modal.showHelp('search', 'feature', { 
                        searchMode: true,
                        context: event.detail.context 
                    });
                }
            });
        }
        
        // Theme change communication
        this.addEventListener('haqei:themeChanged', (event) => {
            // Update all components with new theme
            Object.values(this.components).forEach(component => {
                if (component.updateTheme) {
                    component.updateTheme(event.detail.theme);
                }
            });
        });
    }
    
    setupGlobalListeners() {
        // Page navigation detection
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                this.handlePageChange();
            }
        }).observe(document, { subtree: true, childList: true });
        
        // Hash change detection
        window.addEventListener('hashchange', () => this.handlePageChange());
        
        // Resize handling
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
        
        // Visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Theme preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.options.theme === 'auto') {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        
        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
    
    handlePageChange() {
        // Update help button context
        if (this.components.helpButton) {
            const context = this.detectPageContext();
            this.components.helpButton.updateContext(context);
        }
        
        // Check for auto-start tutorials
        if (this.components.tutorial) {
            setTimeout(() => {
                this.components.tutorial.checkAutoStartTutorials();
            }, 1000);
        }
        
        this.dispatchEvent('haqei:pageChanged', {
            url: location.href,
            context: this.detectPageContext()
        });
    }
    
    handleResize() {
        // Update component positioning
        Object.values(this.components).forEach(component => {
            if (component.handleResize) {
                component.handleResize();
            }
        });
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page hidden - pause animations and timers
            this.pauseComponents();
        } else {
            // Page visible - resume operations
            this.resumeComponents();
        }
    }
    
    handleGlobalError(event) {
        console.error('Global error in help system:', event.error);
        
        // Show error notification if help button is available
        if (this.components.helpButton) {
            this.showErrorNotification('システムエラーが発生しました');
        }
    }
    
    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection in help system:', event.reason);
        
        // Prevent default to avoid console spam
        event.preventDefault();
    }
    
    detectPageContext() {
        const url = window.location.href;
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        
        // HAQEI-specific context detection
        if (hash.includes('results') || pathname.includes('results')) {
            return {
                page: 'results',
                section: this.detectResultsSection(),
                helpTopics: ['personality-analysis', 'chart-interpretation', 'recommendations']
            };
        } else if (hash.includes('questions') || pathname.includes('os_analyzer')) {
            return {
                page: 'questions',
                section: this.detectQuestionSection(),
                helpTopics: ['question-answering', 'progress-tracking', 'navigation']
            };
        } else if (pathname.includes('future_simulator')) {
            return {
                page: 'future_simulator',
                section: this.detectSimulatorSection(),
                helpTopics: ['scenario-creation', 'simulation-parameters', 'results-analysis']
            };
        } else {
            return {
                page: 'home',
                section: 'welcome',
                helpTopics: ['getting-started', 'system-overview', 'navigation']
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
        const questionElement = document.querySelector('[data-question-number]');
        if (questionElement) {
            return `question_${questionElement.getAttribute('data-question-number')}`;
        }
        return 'question_flow';
    }
    
    detectSimulatorSection() {
        if (document.querySelector('.scenario-input')) return 'scenario_input';
        if (document.querySelector('.simulation-results')) return 'simulation_results';
        return 'simulator_main';
    }
    
    pauseComponents() {
        Object.values(this.components).forEach(component => {
            if (component.pause) {
                component.pause();
            }
        });
    }
    
    resumeComponents() {
        Object.values(this.components).forEach(component => {
            if (component.resume) {
                component.resume();
            }
        });
    }
    
    // Public API methods
    
    showTooltip(element, options) {
        if (!this.components.tooltips) {
            console.warn('TooltipManager not initialized');
            return;
        }
        
        this.components.tooltips.registerTooltip(element, options);
    }
    
    showHelp(term, type = 'concept', options = {}) {
        if (!this.components.modal) {
            console.warn('HelpModal not initialized');
            return;
        }
        
        return this.components.modal.showHelp(term, type, options);
    }
    
    startTutorial(tutorialId, force = false) {
        if (!this.components.tutorial) {
            console.warn('TutorialOverlay not initialized');
            return false;
        }
        
        return this.components.tutorial.startTutorial(tutorialId, force);
    }
    
    showHelpButton() {
        if (!this.components.helpButton) {
            console.warn('HelpButton not initialized');
            return;
        }
        
        this.components.helpButton.show();
    }
    
    hideHelpButton() {
        if (!this.components.helpButton) {
            console.warn('HelpButton not initialized');
            return;
        }
        
        this.components.helpButton.hide();
    }
    
    registerTutorial(id, config) {
        if (!this.components.tutorial) {
            console.warn('TutorialOverlay not initialized');
            return;
        }
        
        this.components.tutorial.registerTutorial(id, config);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    // Auto-enhancement methods
    
    enhanceExistingElements() {
        // Auto-enhance elements with data attributes
        this.enhanceTooltipElements();
        this.enhanceTutorialTriggers();
        this.enhanceHelpLinks();
    }
    
    enhanceTooltipElements() {
        if (!this.components.tooltips) return;
        
        const elements = document.querySelectorAll('[data-help-tooltip]');
        elements.forEach(element => {
            const term = element.getAttribute('data-help-tooltip');
            const title = element.getAttribute('data-help-title') || term;
            const description = element.getAttribute('data-help-desc') || '';
            const type = element.getAttribute('data-help-type') || 'concept';
            
            this.components.tooltips.registerTooltip(element, {
                term, title, description, type
            });
        });
    }
    
    enhanceTutorialTriggers() {
        if (!this.components.tutorial) return;
        
        const triggers = document.querySelectorAll('[data-tutorial-trigger]');
        triggers.forEach(trigger => {
            const tutorialId = trigger.getAttribute('data-tutorial-trigger');
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                this.startTutorial(tutorialId);
            });
        });
    }
    
    enhanceHelpLinks() {
        const helpLinks = document.querySelectorAll('[data-help-link]');
        helpLinks.forEach(link => {
            const term = link.getAttribute('data-help-link');
            const type = link.getAttribute('data-help-type') || 'concept';
            
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.showHelp(term, type);
            });
        });
    }
    
    // Utility methods
    
    addEventListener(eventName, handler) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, []);
        }
        
        this.eventListeners.get(eventName).push(handler);
        document.addEventListener(eventName, handler);
    }
    
    removeEventListener(eventName, handler) {
        const handlers = this.eventListeners.get(eventName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
        
        document.removeEventListener(eventName, handler);
    }
    
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
    
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'help-error-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    getStats() {
        return {
            initialized: this.isInitialized,
            theme: this.currentTheme,
            components: Object.keys(this.components),
            eventListeners: Array.from(this.eventListeners.keys()),
            pageContext: this.detectPageContext()
        };
    }
    
    // Cleanup method
    
    destroy() {
        // Remove all event listeners
        this.eventListeners.forEach((handlers, eventName) => {
            handlers.forEach(handler => {
                document.removeEventListener(eventName, handler);
            });
        });
        this.eventListeners.clear();
        
        // Destroy all components
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        
        // Clear references
        this.components = {};
        this.isInitialized = false;
        
        console.log('🧹 HAQEI Help System UI destroyed');
    }
}

// Auto-initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.haqeiHelpSystem) {
            window.haqeiHelpSystem = new HelpSystemUI();
        }
    });
} else {
    if (!window.haqeiHelpSystem) {
        window.haqeiHelpSystem = new HelpSystemUI();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpSystemUI;
} else {
    window.HelpSystemUI = HelpSystemUI;
}