/**
 * TutorialOverlay.js - HAQEI Intelligent Help System
 * Interactive tutorial system with step-by-step guidance
 * 
 * Features:
 * - Interactive step-by-step tutorials
 * - Element highlighting and positioning
 * - Progress tracking and resumption
 * - Mobile-responsive design
 * - Customizable tutorial flows
 */

class TutorialOverlay {
    constructor() {
        this.isActive = false;
        this.currentTutorial = null;
        this.currentStep = 0;
        this.overlayElement = null;
        this.spotlight = null;
        this.tutorialCard = null;
        this.progressBar = null;
        this.tutorials = new Map();
        this.completedTutorials = new Set();
        
        this.init();
    }
    
    init() {
        this.createOverlayStructure();
        this.attachEventListeners();
        this.loadProgress();
        this.registerDefaultTutorials();
    }
    
    createOverlayStructure() {
        // Main overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'haqei-tutorial-overlay';
        this.overlayElement.setAttribute('aria-hidden', 'true');
        this.overlayElement.style.display = 'none';
        
        // Backdrop with spotlight effect
        const backdrop = document.createElement('div');
        backdrop.className = 'tutorial-backdrop';
        
        // Spotlight for highlighting elements
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'tutorial-spotlight';
        
        // Tutorial card
        this.tutorialCard = document.createElement('div');
        this.tutorialCard.className = 'tutorial-card';
        this.tutorialCard.innerHTML = `
            <div class="card-header">
                <h3 class="tutorial-title"></h3>
                <div class="tutorial-progress">
                    <span class="progress-indicator">
                        <span class="current-step">1</span> / <span class="total-steps">5</span>
                    </span>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="step-content">
                    <p class="step-description"></p>
                    <div class="step-media"></div>
                    <div class="step-interaction"></div>
                </div>
            </div>
            <div class="card-footer">
                <div class="tutorial-navigation">
                    <button class="btn-ghost tutorial-skip">スキップ</button>
                    <div class="nav-buttons">
                        <button class="btn-secondary tutorial-prev" disabled>前へ</button>
                        <button class="btn-primary tutorial-next">次へ</button>
                    </div>
                </div>
                <div class="tutorial-options">
                    <label class="checkbox-label">
                        <input type="checkbox" class="dont-show-again">
                        <span>このチュートリアルを再表示しない</span>
                    </label>
                </div>
            </div>
        `;
        
        // Assemble overlay
        this.overlayElement.appendChild(backdrop);
        this.overlayElement.appendChild(this.spotlight);
        this.overlayElement.appendChild(this.tutorialCard);
        
        document.body.appendChild(this.overlayElement);
    }
    
    attachEventListeners() {
        // Tutorial navigation
        this.tutorialCard.addEventListener('click', this.handleCardClick.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Window resize for repositioning
        window.addEventListener('resize', this.repositionCard.bind(this), { passive: true });
        
        // Custom events
        document.addEventListener('haqei:startTutorial', this.handleStartTutorial.bind(this));
        document.addEventListener('haqei:showTutorialHint', this.handleShowHint.bind(this));
    }
    
    handleCardClick(event) {
        const target = event.target;
        
        if (target.classList.contains('tutorial-next')) {
            this.nextStep();
        } else if (target.classList.contains('tutorial-prev')) {
            this.previousStep();
        } else if (target.classList.contains('tutorial-skip')) {
            this.skipTutorial();
        }
    }
    
    handleKeydown(event) {
        if (!this.isActive) return;
        
        switch (event.key) {
            case 'Escape':
                this.skipTutorial();
                break;
            case 'ArrowRight':
            case 'Enter':
                if (!event.target.matches('input, textarea')) {
                    event.preventDefault();
                    this.nextStep();
                }
                break;
            case 'ArrowLeft':
                if (!event.target.matches('input, textarea')) {
                    event.preventDefault();
                    this.previousStep();
                }
                break;
        }
    }
    
    handleStartTutorial(event) {
        const { tutorialId, force } = event.detail;
        this.startTutorial(tutorialId, force);
    }
    
    handleShowHint(event) {
        const { element, message, duration } = event.detail;
        this.showHint(element, message, duration);
    }
    
    registerTutorial(id, config) {
        this.tutorials.set(id, {
            id,
            title: config.title,
            description: config.description,
            steps: config.steps,
            autoStart: config.autoStart || false,
            priority: config.priority || 0,
            triggers: config.triggers || [],
            prerequisites: config.prerequisites || [],
            ...config
        });
    }
    
    registerDefaultTutorials() {
        // Welcome tutorial
        this.registerTutorial('welcome-tour', {
            title: 'HAQEIへようこそ',
            description: 'HAQEIの基本的な使い方を学びましょう',
            autoStart: true,
            priority: 10,
            steps: [
                {
                    target: 'body',
                    title: 'HAQEIへようこそ！',
                    content: 'HAQEIは人格分析システムです。このチュートリアルで基本的な使い方を学びましょう。',
                    position: 'center'
                },
                {
                    target: '[data-question-container]',
                    title: '質問システム',
                    content: '質問に答えることで、あなたの人格を分析します。直感的に答えてください。',
                    position: 'bottom'
                },
                {
                    target: '.progress-container',
                    title: '進捗の確認',
                    content: 'ここで現在の進捗状況を確認できます。',
                    position: 'top'
                },
                {
                    target: '.help-button',
                    title: 'ヘルプ機能',
                    content: '困ったときはこのボタンでヘルプを表示できます。',
                    position: 'left'
                }
            ]
        });
        
        // Analysis results tutorial
        this.registerTutorial('results-guide', {
            title: '結果の見方',
            description: '分析結果の読み方を説明します',
            triggers: ['results-page-loaded'],
            steps: [
                {
                    target: '.personality-chart',
                    title: '人格チャート',
                    content: 'あなたの人格特性が視覚的に表示されます。',
                    position: 'right'
                },
                {
                    target: '.detailed-analysis',
                    title: '詳細分析',
                    content: '各特性の詳しい説明を読むことができます。',
                    position: 'left'
                }
            ]
        });
    }
    
    async startTutorial(tutorialId, force = false) {
        const tutorial = this.tutorials.get(tutorialId);
        if (!tutorial) {
            console.warn(`Tutorial not found: ${tutorialId}`);
            return false;
        }
        
        // Check if already completed and not forced
        if (!force && this.completedTutorials.has(tutorialId)) {
            return false;
        }
        
        // Check prerequisites
        if (tutorial.prerequisites.length > 0) {
            const unmetPrerequisites = tutorial.prerequisites.filter(
                prereq => !this.completedTutorials.has(prereq)
            );
            if (unmetPrerequisites.length > 0) {
                console.warn(`Prerequisites not met for ${tutorialId}:`, unmetPrerequisites);
                return false;
            }
        }
        
        this.currentTutorial = tutorial;
        this.currentStep = 0;
        
        await this.show();
        this.displayStep();
        
        this.trackTutorialStart(tutorialId);
        return true;
    }
    
    async show() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.body.classList.add('tutorial-active');
        
        this.overlayElement.style.display = 'block';
        this.overlayElement.setAttribute('aria-hidden', 'false');
        
        // Animate in
        requestAnimationFrame(() => {
            this.overlayElement.classList.add('overlay-visible');
        });
        
        return new Promise(resolve => {
            setTimeout(resolve, 300);
        });
    }
    
    async hide() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        this.overlayElement.classList.remove('overlay-visible');
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.overlayElement.style.display = 'none';
                this.overlayElement.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('tutorial-active');
                resolve();
            }, 300);
        });
    }
    
    displayStep() {
        if (!this.currentTutorial || !this.isActive) return;
        
        const step = this.currentTutorial.steps[this.currentStep];
        const isLastStep = this.currentStep === this.currentTutorial.steps.length - 1;
        
        // Update card content
        this.updateCardContent(step, isLastStep);
        
        // Position spotlight and card
        this.positionElements(step);
        
        // Update navigation
        this.updateNavigation();
        
        // Handle step interactions
        this.setupStepInteraction(step);
        
        this.trackStepView(this.currentTutorial.id, this.currentStep);
    }
    
    updateCardContent(step, isLastStep) {
        const titleEl = this.tutorialCard.querySelector('.tutorial-title');
        const descEl = this.tutorialCard.querySelector('.step-description');
        const mediaEl = this.tutorialCard.querySelector('.step-media');
        const interactionEl = this.tutorialCard.querySelector('.step-interaction');
        const nextBtn = this.tutorialCard.querySelector('.tutorial-next');
        
        titleEl.textContent = step.title || this.currentTutorial.title;
        descEl.textContent = step.content;
        
        // Media content (images, videos, etc.)
        if (step.media) {
            mediaEl.innerHTML = this.renderStepMedia(step.media);
            mediaEl.style.display = 'block';
        } else {
            mediaEl.style.display = 'none';
        }
        
        // Interactive elements
        if (step.interaction) {
            interactionEl.innerHTML = this.renderStepInteraction(step.interaction);
            interactionEl.style.display = 'block';
        } else {
            interactionEl.style.display = 'none';
        }
        
        // Update button text
        nextBtn.textContent = isLastStep ? '完了' : '次へ';
        
        // Update progress
        this.updateProgress();
    }
    
    updateProgress() {
        const currentStepEl = this.tutorialCard.querySelector('.current-step');
        const totalStepsEl = this.tutorialCard.querySelector('.total-steps');
        const progressFill = this.tutorialCard.querySelector('.progress-fill');
        
        const current = this.currentStep + 1;
        const total = this.currentTutorial.steps.length;
        
        currentStepEl.textContent = current;
        totalStepsEl.textContent = total;
        progressFill.style.width = `${(current / total) * 100}%`;
    }
    
    positionElements(step) {
        const targetElement = this.findTargetElement(step.target);
        
        if (targetElement) {
            this.highlightElement(targetElement);
            this.positionCard(targetElement, step.position);
        } else {
            // Center the card if no target element
            this.centerCard();
            this.spotlight.style.display = 'none';
        }
    }
    
    findTargetElement(selector) {
        if (selector === 'body' || !selector) return null;
        
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`);
            return null;
        }
    }
    
    highlightElement(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        const scrollLeft = window.pageXOffset;
        
        // Position spotlight
        this.spotlight.style.display = 'block';
        this.spotlight.style.left = `${rect.left + scrollLeft - 10}px`;
        this.spotlight.style.top = `${rect.top + scrollTop - 10}px`;
        this.spotlight.style.width = `${rect.width + 20}px`;
        this.spotlight.style.height = `${rect.height + 20}px`;
        
        // Smooth scroll to element if needed
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
    
    positionCard(targetElement, position = 'auto') {
        const rect = targetElement.getBoundingClientRect();
        const cardRect = this.tutorialCard.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        let left, top;
        
        // Auto-detect best position if not specified
        if (position === 'auto') {
            position = this.detectBestPosition(rect, cardRect, viewport);
        }
        
        switch (position) {
            case 'top':
                left = rect.left + (rect.width / 2) - (cardRect.width / 2);
                top = rect.top - cardRect.height - 20;
                break;
            case 'bottom':
                left = rect.left + (rect.width / 2) - (cardRect.width / 2);
                top = rect.bottom + 20;
                break;
            case 'left':
                left = rect.left - cardRect.width - 20;
                top = rect.top + (rect.height / 2) - (cardRect.height / 2);
                break;
            case 'right':
                left = rect.right + 20;
                top = rect.top + (rect.height / 2) - (cardRect.height / 2);
                break;
            case 'center':
            default:
                this.centerCard();
                return;
        }
        
        // Ensure card stays in viewport
        left = Math.max(20, Math.min(left, viewport.width - cardRect.width - 20));
        top = Math.max(20, Math.min(top, viewport.height - cardRect.height - 20));
        
        this.tutorialCard.style.left = `${left}px`;
        this.tutorialCard.style.top = `${top}px`;
        this.tutorialCard.style.transform = 'none';
    }
    
    centerCard() {
        this.tutorialCard.style.left = '50%';
        this.tutorialCard.style.top = '50%';
        this.tutorialCard.style.transform = 'translate(-50%, -50%)';
    }
    
    detectBestPosition(targetRect, cardRect, viewport) {
        const spaceTop = targetRect.top;
        const spaceBottom = viewport.height - targetRect.bottom;
        const spaceLeft = targetRect.left;
        const spaceRight = viewport.width - targetRect.right;
        
        const cardHeight = cardRect.height || 300; // Estimate if not available
        const cardWidth = cardRect.width || 400;
        
        // Check if there's enough space in each direction
        if (spaceBottom >= cardHeight + 40) return 'bottom';
        if (spaceTop >= cardHeight + 40) return 'top';
        if (spaceRight >= cardWidth + 40) return 'right';
        if (spaceLeft >= cardWidth + 40) return 'left';
        
        return 'center';
    }
    
    repositionCard() {
        if (!this.isActive || !this.currentTutorial) return;
        
        const step = this.currentTutorial.steps[this.currentStep];
        this.positionElements(step);
    }
    
    setupStepInteraction(step) {
        if (!step.interaction) return;
        
        const { type, waitFor, validateWith } = step.interaction;
        
        switch (type) {
            case 'click':
                this.waitForClick(waitFor, validateWith);
                break;
            case 'input':
                this.waitForInput(waitFor, validateWith);
                break;
            case 'scroll':
                this.waitForScroll(waitFor, validateWith);
                break;
        }
    }
    
    waitForClick(selector, validator) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const handler = (event) => {
            if (!validator || validator(event)) {
                element.removeEventListener('click', handler);
                this.nextStep();
            }
        };
        
        element.addEventListener('click', handler);
    }
    
    waitForInput(selector, validator) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        const handler = (event) => {
            if (!validator || validator(event.target.value)) {
                element.removeEventListener('input', handler);
                this.nextStep();
            }
        };
        
        element.addEventListener('input', handler);
    }
    
    waitForScroll(selector, validator) {
        const element = selector ? document.querySelector(selector) : window;
        if (!element) return;
        
        const handler = (event) => {
            if (!validator || validator(event)) {
                element.removeEventListener('scroll', handler);
                this.nextStep();
            }
        };
        
        element.addEventListener('scroll', handler, { passive: true });
    }
    
    renderStepMedia(media) {
        switch (media.type) {
            case 'image':
                return `<img src="${media.src}" alt="${media.alt}" class="step-image">`;
            case 'video':
                return `<video src="${media.src}" controls class="step-video"></video>`;
            case 'gif':
                return `<img src="${media.src}" alt="${media.alt}" class="step-gif">`;
            default:
                return '';
        }
    }
    
    renderStepInteraction(interaction) {
        switch (interaction.type) {
            case 'form':
                return this.renderInteractiveForm(interaction.fields);
            case 'quiz':
                return this.renderInteractiveQuiz(interaction.questions);
            case 'demo':
                return this.renderInteractiveDemo(interaction.config);
            default:
                return '';
        }
    }
    
    renderInteractiveForm(fields) {
        return `
            <form class="tutorial-form">
                ${fields.map(field => `
                    <div class="form-field">
                        <label>${field.label}</label>
                        <input type="${field.type}" name="${field.name}" placeholder="${field.placeholder || ''}">
                    </div>
                `).join('')}
                <button type="submit" class="btn-primary">送信</button>
            </form>
        `;
    }
    
    renderInteractiveQuiz(questions) {
        return `
            <div class="tutorial-quiz">
                ${questions.map((q, index) => `
                    <div class="quiz-question">
                        <p>${q.question}</p>
                        ${q.options.map((option, i) => `
                            <label class="quiz-option">
                                <input type="radio" name="q${index}" value="${i}">
                                <span>${option}</span>
                            </label>
                        `).join('')}
                    </div>
                `).join('')}
                <button class="btn-primary quiz-submit">回答を確認</button>
            </div>
        `;
    }
    
    renderInteractiveDemo(config) {
        return `
            <div class="tutorial-demo">
                <p>実際に試してみましょう：</p>
                <div class="demo-area" data-demo="${config.type}">
                    ${config.content || ''}
                </div>
            </div>
        `;
    }
    
    nextStep() {
        if (!this.currentTutorial) return;
        
        if (this.currentStep < this.currentTutorial.steps.length - 1) {
            this.currentStep++;
            this.displayStep();
        } else {
            this.completeTutorial();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.displayStep();
        }
        
        this.updateNavigation();
    }
    
    updateNavigation() {
        const prevBtn = this.tutorialCard.querySelector('.tutorial-prev');
        const nextBtn = this.tutorialCard.querySelector('.tutorial-next');
        
        prevBtn.disabled = this.currentStep === 0;
        
        if (this.currentStep === this.currentTutorial.steps.length - 1) {
            nextBtn.textContent = '完了';
            nextBtn.className = 'btn-success tutorial-next';
        } else {
            nextBtn.textContent = '次へ';
            nextBtn.className = 'btn-primary tutorial-next';
        }
    }
    
    async completeTutorial() {
        if (!this.currentTutorial) return;
        
        const tutorialId = this.currentTutorial.id;
        
        // Mark as completed
        this.completedTutorials.add(tutorialId);
        this.saveProgress();
        
        // Check "don't show again" preference
        const dontShowAgain = this.tutorialCard.querySelector('.dont-show-again').checked;
        if (dontShowAgain) {
            this.setTutorialPreference(tutorialId, 'disabled');
        }
        
        this.trackTutorialComplete(tutorialId);
        
        // Show completion message
        await this.showCompletionMessage();
        
        // Hide tutorial
        await this.hide();
        
        this.currentTutorial = null;
        this.currentStep = 0;
    }
    
    async skipTutorial() {
        if (!this.currentTutorial) return;
        
        const tutorialId = this.currentTutorial.id;
        
        this.trackTutorialSkip(tutorialId, this.currentStep);
        
        await this.hide();
        
        this.currentTutorial = null;
        this.currentStep = 0;
    }
    
    async showCompletionMessage() {
        const originalContent = this.tutorialCard.innerHTML;
        
        this.tutorialCard.innerHTML = `
            <div class="completion-message">
                <div class="completion-icon">✓</div>
                <h3>チュートリアル完了！</h3>
                <p>${this.currentTutorial.title}を完了しました。</p>
                <button class="btn-primary completion-done">了解</button>
            </div>
        `;
        
        return new Promise(resolve => {
            const doneBtn = this.tutorialCard.querySelector('.completion-done');
            doneBtn.addEventListener('click', () => {
                this.tutorialCard.innerHTML = originalContent;
                resolve();
            });
        });
    }
    
    showHint(element, message, duration = 3000) {
        const hint = document.createElement('div');
        hint.className = 'tutorial-hint';
        hint.innerHTML = `
            <div class="hint-content">${message}</div>
            <div class="hint-arrow"></div>
        `;
        
        document.body.appendChild(hint);
        
        // Position near element
        if (element) {
            const rect = element.getBoundingClientRect();
            hint.style.left = `${rect.right + 10}px`;
            hint.style.top = `${rect.top}px`;
        }
        
        // Auto-remove after duration
        setTimeout(() => {
            hint.remove();
        }, duration);
    }
    
    // Progress and preferences management
    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('haqei-tutorial-progress') || '{}');
        this.completedTutorials = new Set(progress.completed || []);
        
        const preferences = JSON.parse(localStorage.getItem('haqei-tutorial-preferences') || '{}');
        this.tutorialPreferences = preferences;
    }
    
    saveProgress() {
        const progress = {
            completed: Array.from(this.completedTutorials),
            lastUpdate: Date.now()
        };
        localStorage.setItem('haqei-tutorial-progress', JSON.stringify(progress));
    }
    
    setTutorialPreference(tutorialId, preference) {
        this.tutorialPreferences = this.tutorialPreferences || {};
        this.tutorialPreferences[tutorialId] = preference;
        localStorage.setItem('haqei-tutorial-preferences', JSON.stringify(this.tutorialPreferences));
    }
    
    // Analytics and tracking
    trackTutorialStart(tutorialId) {
        if (window.gtag) {
            gtag('event', 'tutorial_start', {
                'event_category': 'tutorial',
                'event_label': tutorialId
            });
        }
        
        this.trackEvent('tutorial_start', { tutorialId });
    }
    
    trackTutorialComplete(tutorialId) {
        if (window.gtag) {
            gtag('event', 'tutorial_complete', {
                'event_category': 'tutorial',
                'event_label': tutorialId
            });
        }
        
        this.trackEvent('tutorial_complete', { tutorialId });
    }
    
    trackTutorialSkip(tutorialId, step) {
        if (window.gtag) {
            gtag('event', 'tutorial_skip', {
                'event_category': 'tutorial',
                'event_label': tutorialId,
                'value': step
            });
        }
        
        this.trackEvent('tutorial_skip', { tutorialId, step });
    }
    
    trackStepView(tutorialId, step) {
        if (window.gtag) {
            gtag('event', 'tutorial_step_view', {
                'event_category': 'tutorial',
                'event_label': tutorialId,
                'value': step
            });
        }
        
        this.trackEvent('tutorial_step_view', { tutorialId, step });
    }
    
    trackEvent(eventName, data) {
        const stats = JSON.parse(localStorage.getItem('haqei-tutorial-stats') || '{}');
        stats.events = stats.events || [];
        stats.events.push({
            event: eventName,
            data,
            timestamp: Date.now()
        });
        
        // Keep only last 100 events
        if (stats.events.length > 100) {
            stats.events = stats.events.slice(-100);
        }
        
        localStorage.setItem('haqei-tutorial-stats', JSON.stringify(stats));
    }
    
    // Public API
    isTutorialCompleted(tutorialId) {
        return this.completedTutorials.has(tutorialId);
    }
    
    resetTutorial(tutorialId) {
        this.completedTutorials.delete(tutorialId);
        this.saveProgress();
    }
    
    resetAllTutorials() {
        this.completedTutorials.clear();
        this.saveProgress();
        localStorage.removeItem('haqei-tutorial-preferences');
    }
    
    checkAutoStartTutorials() {
        for (const [id, tutorial] of this.tutorials) {
            if (tutorial.autoStart && !this.completedTutorials.has(id)) {
                // Check triggers
                if (tutorial.triggers.length === 0 || this.checkTriggers(tutorial.triggers)) {
                    this.startTutorial(id);
                    break; // Only start one tutorial at a time
                }
            }
        }
    }
    
    checkTriggers(triggers) {
        return triggers.some(trigger => {
            switch (trigger) {
                case 'first-visit':
                    return !localStorage.getItem('haqei-visited');
                case 'results-page-loaded':
                    return window.location.hash.includes('results');
                default:
                    return false;
            }
        });
    }
    
    destroy() {
        if (this.isActive) {
            this.hide();
        }
        
        if (this.overlayElement) {
            this.overlayElement.remove();
        }
        
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.repositionCard);
        document.removeEventListener('haqei:startTutorial', this.handleStartTutorial);
        document.removeEventListener('haqei:showTutorialHint', this.handleShowHint);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorialOverlay;
} else {
    window.TutorialOverlay = TutorialOverlay;
}