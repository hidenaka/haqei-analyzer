/**
 * Integration Samples for HAQEI Help System
 * 
 * This file contains practical examples of integrating the tutorial system
 * with existing HAQEI pages and components.
 * 
 * Created by: Frontend Developer Agent
 * Version: 1.0.0
 * Date: 2025-08-04
 */

// ==========================================
// 1. BASIC INTEGRATION SETUP
// ==========================================

/**
 * Initialize help system on page load
 */
class HAQEITutorialIntegration {
    constructor() {
        this.helpSystem = null;
        this.tutorialOverlay = null;
        this.currentPage = this.detectCurrentPage();
        this.userState = this.loadUserState();
        
        this.init();
    }
    
    async init() {
        try {
            // Load help system components
            await this.loadHelpSystemComponents();
            
            // Initialize systems
            this.helpSystem = new HelpSystemCore();
            this.tutorialOverlay = new TutorialOverlay();
            
            // Setup page-specific tutorials
            this.setupPageSpecificTutorials();
            
            // Setup contextual help
            this.setupContextualHelp();
            
            // Check for auto-start tutorials
            this.checkAutoStartTutorials();
            
            console.log('✅ HAQEI Tutorial Integration initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize tutorial integration:', error);
        }
    }
    
    async loadHelpSystemComponents() {
        const components = [
            '/js/help-system/core/HelpSystemCore.js',
            '/js/help-system/ui/TutorialOverlay.js',
            '/js/help-system/ui/HelpSystemUI.js',
            '/js/help-system/managers/GlossaryManager.js'
        ];
        
        for (const component of components) {
            await this.loadScript(component);
        }
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    detectCurrentPage() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (path.includes('os_analyzer.html') || hash.includes('analyzer')) {
            return 'analyzer';
        } else if (path.includes('results.html') || hash.includes('results')) {
            return 'results';
        } else if (path.includes('future_simulator.html')) {
            return 'future-simulator';
        } else if (path.includes('cockpit.html')) {
            return 'cockpit';
        } else {
            return 'home';
        }
    }
    
    loadUserState() {
        return {
            isFirstVisit: !localStorage.getItem('haqei-visited'),
            completedTutorials: JSON.parse(localStorage.getItem('haqei-tutorial-progress') || '{}').completed || [],
            preferences: JSON.parse(localStorage.getItem('haqei-tutorial-preferences') || '{}')
        };
    }
}

// ==========================================
// 2. PAGE-SPECIFIC TUTORIAL INTEGRATIONS
// ==========================================

/**
 * Analyzer Page Integration
 */
class AnalyzerPageIntegration extends HAQEITutorialIntegration {
    setupPageSpecificTutorials() {
        // Welcome tutorial for first-time visitors
        if (this.userState.isFirstVisit) {
            this.scheduleWelcomeTutorial();
        }
        
        // Question flow tutorial
        this.setupQuestionFlowHelp();
        
        // Progress tracking tutorial
        this.setupProgressHelp();
        
        // Navigation help
        this.setupNavigationHelp();
    }
    
    scheduleWelcomeTutorial() {
        // Wait for page elements to load
        setTimeout(() => {
            if (!this.userState.completedTutorials.includes('welcome-comprehensive')) {
                this.tutorialOverlay.startTutorial('welcome-comprehensive');
            }
        }, 2000);
    }
    
    setupQuestionFlowHelp() {
        // Add help triggers to question elements
        const questionElements = document.querySelectorAll('.haqei-question-element, [data-question-container]');
        
        questionElements.forEach((element, index) => {
            // Add contextual help button
            const helpButton = this.createContextualHelpButton(
                'question-help',
                `第${index + 1}問の詳細説明とヒント`
            );
            
            element.appendChild(helpButton);
            
            // Add tooltip for cultural terms
            this.addCulturalTermTooltips(element);
        });
    }
    
    setupProgressHelp() {
        const progressElement = document.querySelector('.progress-container, [data-progress]');
        if (progressElement) {
            progressElement.addEventListener('click', () => {
                this.showProgressExplanation();
            });
        }
    }
    
    setupNavigationHelp() {
        const navButtons = document.querySelectorAll('.btn-next, .btn-prev, .navigation-buttons button');
        
        navButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.showNavigationHint(button);
            });
        });
    }
    
    createContextualHelpButton(type, content) {
        const button = document.createElement('button');
        button.className = 'contextual-help-btn';
        button.innerHTML = '❓';
        button.title = 'ヘルプを表示';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #f59e0b;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
            z-index: 10;
        `;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.helpSystem.showContextualHelp(type, content);
        });
        
        return button;
    }
    
    addCulturalTermTooltips(element) {
        const culturalTerms = ['易経', '64卦', '分人', 'bunenjin', '爻'];
        const text = element.textContent;
        
        culturalTerms.forEach(term => {
            if (text.includes(term)) {
                this.wrapTermWithTooltip(element, term);
            }
        });
    }
    
    wrapTermWithTooltip(element, term) {
        const regex = new RegExp(`(${term})`, 'g');
        element.innerHTML = element.innerHTML.replace(regex, 
            `<span class="cultural-term" data-term="${term}">$1</span>`
        );
        
        const termElements = element.querySelectorAll(`[data-term="${term}"]`);
        termElements.forEach(termEl => {
            termEl.addEventListener('click', () => {
                this.helpSystem.showTermExplanation(term);
            });
        });
    }
}

/**
 * Results Page Integration
 */
class ResultsPageIntegration extends HAQEITutorialIntegration {
    setupPageSpecificTutorials() {
        // Auto-start results tutorial
        if (!this.userState.completedTutorials.includes('results-interpretation')) {
            this.scheduleResultsTutorial();
        }
        
        // Setup hexagram explanation
        this.setupHexagramHelp();
        
        // Setup trait analysis help
        this.setupTraitAnalysisHelp();
        
        // Setup practical application help
        this.setupApplicationHelp();
    }
    
    scheduleResultsTutorial() {
        // Wait for results to fully load
        const checkResults = () => {
            const hexagramElement = document.querySelector('.personality-chart, .hexagram-display');
            if (hexagramElement) {
                setTimeout(() => {
                    this.tutorialOverlay.startTutorial('results-interpretation');
                }, 1500);
            } else {
                setTimeout(checkResults, 500);
            }
        };
        
        checkResults();
    }
    
    setupHexagramHelp() {
        const hexagramElements = document.querySelectorAll('.hexagram-display, .main-hexagram');
        
        hexagramElements.forEach(element => {
            // Add detailed explanation button
            const explainButton = document.createElement('button');
            explainButton.className = 'hexagram-explain-btn';
            explainButton.textContent = '詳細説明';
            explainButton.style.cssText = `
                margin-top: 10px;
                padding: 8px 16px;
                background: #4f46e5;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            `;
            
            explainButton.addEventListener('click', () => {
                this.showHexagramDetailedExplanation(element);
            });
            
            element.appendChild(explainButton);
        });
    }
    
    setupTraitAnalysisHelp() {
        const traitElements = document.querySelectorAll('.trait-breakdown [data-trait], .personality-dimensions .trait');
        
        traitElements.forEach(element => {
            const traitType = element.dataset.trait || this.detectTraitType(element);
            
            element.addEventListener('click', () => {
                this.showTraitDetailedExplanation(traitType, element);
            });
            
            // Add visual indicator
            element.style.cursor = 'pointer';
            element.title = 'クリックで詳細説明';
        });
    }
    
    setupApplicationHelp() {
        const applicationSections = document.querySelectorAll('.recommendations, .practical-advice, .application-tips');
        
        applicationSections.forEach(section => {
            const helpButton = this.createSectionHelpButton('application-guide');
            section.appendChild(helpButton);
        });
    }
    
    showHexagramDetailedExplanation(element) {
        const hexagramName = element.querySelector('.hexagram-name')?.textContent || '不明';
        
        this.helpSystem.showModal({
            title: `${hexagramName}の詳細解説`,
            content: this.generateHexagramExplanation(hexagramName),
            actions: [
                {
                    text: '文化的背景を学ぶ',
                    action: () => this.tutorialOverlay.startTutorial('cultural-sensitivity')
                },
                {
                    text: '実践的活用法',
                    action: () => this.showPracticalApplicationGuide(hexagramName)
                }
            ]
        });
    }
    
    generateHexagramExplanation(hexagramName) {
        // This would normally fetch from the cultural-interpretations.json
        return `
            <div class="hexagram-detailed-explanation">
                <h3>${hexagramName}の深い理解</h3>
                <div class="explanation-section">
                    <h4>古典的意味</h4>
                    <p>易経における${hexagramName}の伝統的な解釈と象徴...</p>
                </div>
                <div class="explanation-section">
                    <h4>現代的解釈</h4>
                    <p>現代生活における${hexagramName}の特性の表れ方...</p>
                </div>
                <div class="explanation-section">
                    <h4>成長の方向性</h4>
                    <p>この特性を活かした自然な発展パターン...</p>
                </div>
            </div>
        `;
    }
    
    createSectionHelpButton(helpType) {
        const button = document.createElement('button');
        button.className = 'section-help-btn';
        button.innerHTML = '📚 詳しく学ぶ';
        button.style.cssText = `
            margin: 10px 0;
            padding: 6px 12px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
        `;
        
        button.addEventListener('click', () => {
            this.helpSystem.showHelpSection(helpType);
        });
        
        return button;
    }
}

// ==========================================
// 3. CONTEXTUAL HELP SYSTEM
// ==========================================

class ContextualHelpManager {
    constructor(helpSystem) {
        this.helpSystem = helpSystem;
        this.activeTooltips = new Map();
        this.setupGlobalHelp();
    }
    
    setupGlobalHelp() {
        // Global help button
        this.createGlobalHelpButton();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Smart help detection
        this.setupSmartHelp();
    }
    
    createGlobalHelpButton() {
        const helpButton = document.createElement('button');
        helpButton.id = 'global-help-button';
        helpButton.innerHTML = '❓';
        helpButton.title = 'ヘルプメニュー (F1)';
        helpButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(245, 158, 11, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        helpButton.addEventListener('click', () => {
            this.showGlobalHelpMenu();
        });
        
        helpButton.addEventListener('mouseenter', () => {
            helpButton.style.transform = 'scale(1.1)';
        });
        
        helpButton.addEventListener('mouseleave', () => {
            helpButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(helpButton);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F1 - Help menu
            if (e.key === 'F1') {
                e.preventDefault();
                this.showGlobalHelpMenu();
            }
            
            // Ctrl+H - Quick help
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.showQuickHelp();
            }
            
            // Escape - Close help
            if (e.key === 'Escape') {
                this.closeAllHelp();
            }
        });
    }
    
    setupSmartHelp() {
        // Detect user confusion (long idle time on complex elements)
        let idleTimer;
        const complexElements = document.querySelectorAll('.hexagram-display, .complex-concept, [data-complex]');
        
        complexElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                idleTimer = setTimeout(() => {
                    this.offerContextualHelp(element);
                }, 5000); // 5 seconds idle
            });
            
            element.addEventListener('mouseleave', () => {
                clearTimeout(idleTimer);
            });
        });
    }
    
    showGlobalHelpMenu() {
        const menuOptions = [
            { text: '📚 チュートリアル再実行', action: () => this.showTutorialMenu() },
            { text: '📖 用語解説', action: () => this.helpSystem.showGlossary() },
            { text: '🏛️ 文化的背景', action: () => this.showCulturalBackground() },
            { text: '❓ よくある質問', action: () => this.showFAQ() },
            { text: '🔧 ヘルプ設定', action: () => this.showHelpSettings() },
            { text: '📞 サポート', action: () => this.showSupport() }
        ];
        
        this.helpSystem.showMenu({
            title: 'ヘルプメニュー',
            options: menuOptions
        });
    }
    
    showTutorialMenu() {
        const tutorials = [
            { id: 'welcome-comprehensive', name: 'ウェルカムガイド', status: this.getTutorialStatus('welcome-comprehensive') },
            { id: 'philosophy-basics', name: '哲学的基礎', status: this.getTutorialStatus('philosophy-basics') },
            { id: 'system-navigation', name: 'システム操作', status: this.getTutorialStatus('system-navigation') },
            { id: 'results-interpretation', name: '結果の解釈', status: this.getTutorialStatus('results-interpretation') }
        ];
        
        const tutorialOptions = tutorials.map(tutorial => ({
            text: `${tutorial.name} ${tutorial.status}`,
            action: () => this.helpSystem.startTutorial(tutorial.id, true)
        }));
        
        this.helpSystem.showMenu({
            title: 'チュートリアル選択',
            options: tutorialOptions
        });
    }
    
    getTutorialStatus(tutorialId) {
        const completed = JSON.parse(localStorage.getItem('haqei-tutorial-progress') || '{}').completed || [];
        return completed.includes(tutorialId) ? '✅' : '⭕';
    }
    
    offerContextualHelp(element) {
        const helpType = this.detectHelpType(element);
        
        if (helpType) {
            this.showHelpHint(element, `この要素について詳しく説明しますか？`, () => {
                this.helpSystem.showContextualHelp(helpType, element);
            });
        }
    }
    
    detectHelpType(element) {
        if (element.classList.contains('hexagram-display')) return 'hexagram-explanation';
        if (element.classList.contains('trait-analysis')) return 'trait-explanation';
        if (element.dataset.cultural) return 'cultural-explanation';
        return null;
    }
    
    showHelpHint(element, message, action) {
        const hint = document.createElement('div');
        hint.className = 'help-hint';
        hint.innerHTML = `
            <div class="hint-content">${message}</div>
            <div class="hint-actions">
                <button class="hint-yes">はい</button>
                <button class="hint-no">いいえ</button>
            </div>
        `;
        hint.style.cssText = `
            position: absolute;
            background: white;
            border: 2px solid #4f46e5;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            max-width: 250px;
        `;
        
        // Position hint near element
        const rect = element.getBoundingClientRect();
        hint.style.left = `${rect.right + 10}px`;
        hint.style.top = `${rect.top}px`;
        
        // Add event listeners
        hint.querySelector('.hint-yes').addEventListener('click', () => {
            action();
            hint.remove();
        });
        
        hint.querySelector('.hint-no').addEventListener('click', () => {
            hint.remove();
        });
        
        document.body.appendChild(hint);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (hint.parentNode) hint.remove();
        }, 10000);
    }
}

// ==========================================
// 4. AUTO-INITIALIZATION
// ==========================================

// Auto-initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = new HAQEITutorialIntegration().currentPage;
    
    let integration;
    switch (currentPage) {
        case 'analyzer':
            integration = new AnalyzerPageIntegration();
            break;
        case 'results':
            integration = new ResultsPageIntegration();
            break;
        default:
            integration = new HAQEITutorialIntegration();
    }
    
    // Initialize contextual help
    setTimeout(() => {
        if (integration.helpSystem) {
            new ContextualHelpManager(integration.helpSystem);
        }
    }, 1000);
    
    // Mark page as visited
    localStorage.setItem('haqei-visited', Date.now());
    
    console.log(`✅ HAQEI Tutorial Integration initialized for ${currentPage} page`);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HAQEITutorialIntegration,
        AnalyzerPageIntegration,
        ResultsPageIntegration,
        ContextualHelpManager
    };
} else {
    window.HAQEITutorialIntegration = HAQEITutorialIntegration;
    window.AnalyzerPageIntegration = AnalyzerPageIntegration;
    window.ResultsPageIntegration = ResultsPageIntegration;
    window.ContextualHelpManager = ContextualHelpManager;
}