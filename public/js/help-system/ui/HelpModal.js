/**
 * HelpModal.js - HAQEI Intelligent Help System
 * Detailed explanations modal with rich content and interactions
 * 
 * Features:
 * - Rich content with examples and links
 * - Smooth animations and transitions
 * - Keyboard navigation and accessibility
 * - Mobile-responsive design
 * - Progress tracking for tutorials
 */

class HelpModal {
    constructor() {
        this.isOpen = false;
        this.currentContent = null;
        this.modalElement = null;
        this.overlay = null;
        this.focusedElementBeforeModal = null;
        this.tutorialMode = false;
        this.tutorialProgress = {};
        
        this.init();
    }
    
    init() {
        this.createModalStructure();
        this.attachEventListeners();
        this.loadTutorialProgress();
    }
    
    createModalStructure() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'haqei-modal-overlay';
        this.overlay.setAttribute('aria-hidden', 'true');
        
        // Create modal
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'haqei-help-modal';
        this.modalElement.setAttribute('role', 'dialog');
        this.modalElement.setAttribute('aria-modal', 'true');
        this.modalElement.setAttribute('aria-labelledby', 'modal-title');
        this.modalElement.setAttribute('aria-describedby', 'modal-content');
        
        // Modal structure
        this.modalElement.innerHTML = `
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title"></h2>
                <div class="modal-controls">
                    <button class="modal-minimize" aria-label="Minimize" title="最小化">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <line x1="4" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <button class="modal-close" aria-label="Close" title="閉じる">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="modal-body">
                <div id="modal-content" class="modal-content">
                    <div class="content-loading">
                        <div class="loading-spinner"></div>
                        <p>コンテンツを読み込んでいます...</p>
                    </div>
                </div>
                <div class="modal-sidebar">
                    <div class="sidebar-section">
                        <h3>関連項目</h3>
                        <ul class="related-topics"></ul>
                    </div>
                    <div class="sidebar-section">
                        <h3>クイックアクション</h3>
                        <div class="quick-actions">
                            <button class="action-btn bookmark" title="ブックマーク">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M3 2v12l5-3 5 3V2z" stroke="currentColor" fill="none" stroke-width="2"/>
                                </svg>
                                保存
                            </button>
                            <button class="action-btn share" title="共有">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <circle cx="6" cy="12" r="2" stroke="currentColor" fill="none"/>
                                    <circle cx="13" cy="8" r="2" stroke="currentColor" fill="none"/>
                                    <circle cx="6" cy="4" r="2" stroke="currentColor" fill="none"/>
                                    <path d="M8 6l5 2M8 10l5-2" stroke="currentColor"/>
                                </svg>
                                共有
                            </button>
                            <button class="action-btn print" title="印刷">
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <rect x="2" y="6" width="12" height="6" stroke="currentColor" fill="none"/>
                                    <path d="M6 2h4v4H6zM6 10v4h4v-4" stroke="currentColor" fill="none"/>
                                </svg>
                                印刷
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="tutorial-controls" style="display: none;">
                    <button class="tutorial-prev">前へ</button>
                    <div class="tutorial-progress">
                        <span class="progress-text">1 / 5</span>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                    <button class="tutorial-next">次へ</button>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary modal-cancel">キャンセル</button>
                    <button class="btn-primary modal-action" style="display: none;">実行</button>
                </div>
            </div>
        `;
        
        this.overlay.appendChild(this.modalElement);
        document.body.appendChild(this.overlay);
    }
    
    attachEventListeners() {
        // Modal controls
        this.modalElement.addEventListener('click', this.handleModalClick.bind(this));
        
        // Global listeners
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        document.addEventListener('haqei:showDetailedHelp', this.handleShowDetailedHelp.bind(this));
        
        // Overlay click to close
        this.overlay.addEventListener('click', (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });
        
        // Prevent body scroll when modal open
        this.overlay.addEventListener('wheel', (event) => {
            if (this.isOpen) {
                event.preventDefault();
            }
        }, { passive: false });
    }
    
    handleModalClick(event) {
        const target = event.target;
        
        if (target.classList.contains('modal-close')) {
            this.close();
        } else if (target.classList.contains('modal-minimize')) {
            this.minimize();
        } else if (target.classList.contains('modal-cancel')) {
            this.close();
        } else if (target.classList.contains('tutorial-prev')) {
            this.previousTutorialStep();
        } else if (target.classList.contains('tutorial-next')) {
            this.nextTutorialStep();
        } else if (target.classList.contains('bookmark')) {
            this.bookmarkContent();
        } else if (target.classList.contains('share')) {
            this.shareContent();
        } else if (target.classList.contains('print')) {
            this.printContent();
        }
    }
    
    handleKeydown(event) {
        if (!this.isOpen) return;
        
        if (event.key === 'Escape') {
            this.close();
        } else if (event.key === 'Tab') {
            this.handleTabKey(event);
        }
    }
    
    handleTabKey(event) {
        const focusableElements = this.modalElement.querySelectorAll(
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
    
    handleShowDetailedHelp(event) {
        const { term, type } = event.detail;
        this.showHelp(term, type);
    }
    
    async showHelp(term, type = 'concept', options = {}) {
        this.focusedElementBeforeModal = document.activeElement;
        this.tutorialMode = options.tutorial || false;
        
        await this.open();
        await this.loadContent(term, type, options);
        
        // Focus the modal
        const firstFocusable = this.modalElement.querySelector('button, [href], input');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        this.trackModalView(term, type);
    }
    
    async open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        document.body.classList.add('modal-open');
        
        // Animate in
        this.overlay.style.display = 'flex';
        this.overlay.setAttribute('aria-hidden', 'false');
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            this.overlay.classList.add('modal-visible');
            this.modalElement.classList.add('modal-enter');
        });
        
        return new Promise(resolve => {
            setTimeout(resolve, 300); // Match CSS transition
        });
    }
    
    async close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Animate out
        this.overlay.classList.remove('modal-visible');
        this.modalElement.classList.remove('modal-enter');
        this.modalElement.classList.add('modal-exit');
        
        return new Promise(resolve => {
            setTimeout(() => {
                this.overlay.style.display = 'none';
                this.overlay.setAttribute('aria-hidden', 'true');
                this.modalElement.classList.remove('modal-exit');
                document.body.classList.remove('modal-open');
                
                // Restore focus
                if (this.focusedElementBeforeModal) {
                    this.focusedElementBeforeModal.focus();
                }
                
                resolve();
            }, 300);
        });
    }
    
    minimize() {
        this.modalElement.classList.add('modal-minimized');
        this.trackAction('minimize');
    }
    
    async loadContent(term, type, options = {}) {
        const titleEl = this.modalElement.querySelector('.modal-title');
        const contentEl = this.modalElement.querySelector('.modal-content');
        const relatedEl = this.modalElement.querySelector('.related-topics');
        
        // Show loading state
        contentEl.innerHTML = `
            <div class="content-loading">
                <div class="loading-spinner"></div>
                <p>コンテンツを読み込んでいます...</p>
            </div>
        `;
        
        try {
            // Simulate API call - replace with actual content loading
            const content = await this.fetchHelpContent(term, type);
            
            titleEl.textContent = content.title;
            
            // Render main content
            contentEl.innerHTML = this.renderContent(content);
            
            // Populate related topics
            this.populateRelatedTopics(relatedEl, content.related || []);
            
            // Setup tutorial if needed
            if (this.tutorialMode) {
                this.setupTutorial(content.tutorial);
            }
            
        } catch (error) {
            console.error('Failed to load help content:', error);
            contentEl.innerHTML = `
                <div class="content-error">
                    <h3>エラーが発生しました</h3>
                    <p>コンテンツの読み込みに失敗しました。後でもう一度お試しください。</p>
                    <button class="btn-primary retry-load">再試行</button>
                </div>
            `;
        }
    }
    
    async fetchHelpContent(term, type) {
        try {
            // まず、サンプルヘルプコンテンツから取得を試行
            const response = await fetch('/js/help-system/data/sample-help-content.json');
            if (response.ok) {
                const helpData = await response.json();
                const termData = helpData[type + 's'] && helpData[type + 's'][term];
                
                if (termData) {
                    return {
                        title: termData.title,
                        type: termData.type || type,
                        content: {
                            overview: termData.overview,
                            details: termData.details,
                            examples: termData.examples || [],
                            tips: termData.tips || []
                        },
                        related: termData.related || []
                    };
                }
            }
        } catch (error) {
            console.warn('Failed to load help content from JSON:', error);
        }
        
        // フォールバック: Mock data
        const mockContent = {
            title: `${term}について`,
            type: type,
            content: {
                overview: `${term}は、HAQEIシステムの重要な概念です。`,
                details: `詳細な説明がここに入ります。実際のシステムでは、APIから動的にコンテンツを取得します。`,
                examples: [
                    { title: '基本的な使用例', description: 'HAQEIシステムでの基本的な使用方法' },
                    { title: '応用例', description: 'より高度な活用方法' }
                ],
                tips: [
                    'ポイント1: 効率的な使用方法',
                    'ポイント2: 注意すべき点'
                ]
            },
            related: [
                { term: '関連項目1', type: 'concept' },
                { term: '関連項目2', type: 'feature' }
            ]
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockContent;
    }
    
    renderContent(content) {
        return `
            <div class="help-content">
                <section class="content-overview">
                    <h3>概要</h3>
                    <p>${content.content.overview}</p>
                </section>
                
                <section class="content-details">
                    <h3>詳細</h3>
                    <p>${content.content.details}</p>
                </section>
                
                ${content.content.examples ? this.renderExamples(content.content.examples) : ''}
                
                ${content.content.tips ? this.renderTips(content.content.tips) : ''}
            </div>
        `;
    }
    
    renderExamples(examples) {
        if (!examples || examples.length === 0) return '';
        
        return `
            <section class="content-examples">
                <h3>使用例</h3>
                ${examples.map(example => `
                    <div class="example-item">
                        <h4>${example.title}</h4>
                        ${example.code ? `<pre><code>${example.code}</code></pre>` : `<p>${example.description}</p>`}
                    </div>
                `).join('')}
            </section>
        `;
    }
    
    renderTips(tips) {
        if (!tips || tips.length === 0) return '';
        
        return `
            <section class="content-tips">
                <h3>ヒント</h3>
                <ul>
                    ${tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </section>
        `;
    }
    
    populateRelatedTopics(container, topics) {
        container.innerHTML = topics.map(topic => `
            <li>
                <a href="#" data-help-term="${topic.term}" data-help-type="${topic.type}">
                    ${topic.term}
                </a>
            </li>
        `).join('');
        
        // Add click handlers for related topics
        container.addEventListener('click', (event) => {
            const link = event.target.closest('[data-help-term]');
            if (link) {
                event.preventDefault();
                const term = link.getAttribute('data-help-term');
                const type = link.getAttribute('data-help-type');
                this.showHelp(term, type);
            }
        });
    }
    
    setupTutorial(tutorialData) {
        if (!tutorialData) return;
        
        const controls = this.modalElement.querySelector('.tutorial-controls');
        controls.style.display = 'flex';
        
        this.currentTutorial = tutorialData;
        this.currentStep = 0;
        
        this.updateTutorialProgress();
    }
    
    updateTutorialProgress() {
        const progressText = this.modalElement.querySelector('.progress-text');
        const progressFill = this.modalElement.querySelector('.progress-fill');
        
        const current = this.currentStep + 1;
        const total = this.currentTutorial.steps.length;
        
        progressText.textContent = `${current} / ${total}`;
        progressFill.style.width = `${(current / total) * 100}%`;
    }
    
    nextTutorialStep() {
        if (this.currentStep < this.currentTutorial.steps.length - 1) {
            this.currentStep++;
            this.loadTutorialStep();
            this.updateTutorialProgress();
        }
    }
    
    previousTutorialStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.loadTutorialStep();
            this.updateTutorialProgress();
        }
    }
    
    loadTutorialStep() {
        const step = this.currentTutorial.steps[this.currentStep];
        const contentEl = this.modalElement.querySelector('.modal-content');
        
        contentEl.innerHTML = this.renderTutorialStep(step);
    }
    
    renderTutorialStep(step) {
        return `
            <div class="tutorial-step">
                <h3>${step.title}</h3>
                <div class="step-content">
                    ${step.content}
                </div>
                ${step.interactive ? this.renderInteractiveElement(step.interactive) : ''}
            </div>
        `;
    }
    
    renderInteractiveElement(interactive) {
        // Render interactive tutorial elements
        return `
            <div class="interactive-element">
                <p>実際に試してみましょう：</p>
                ${interactive.element}
            </div>
        `;
    }
    
    bookmarkContent() {
        const bookmarks = JSON.parse(localStorage.getItem('haqei-bookmarks') || '[]');
        const bookmark = {
            term: this.currentContent?.term,
            title: this.modalElement.querySelector('.modal-title').textContent,
            timestamp: Date.now()
        };
        
        bookmarks.push(bookmark);
        localStorage.setItem('haqei-bookmarks', JSON.stringify(bookmarks));
        
        this.showNotification('ブックマークに保存しました');
        this.trackAction('bookmark');
    }
    
    shareContent() {
        if (navigator.share) {
            navigator.share({
                title: this.modalElement.querySelector('.modal-title').textContent,
                text: 'HAQEI ヘルプ: ' + this.currentContent?.term,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const url = window.location.href + '#help=' + this.currentContent?.term;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('リンクをクリップボードにコピーしました');
            });
        }
        
        this.trackAction('share');
    }
    
    printContent() {
        const printWindow = window.open('', '_blank');
        const content = this.modalElement.querySelector('.modal-content').innerHTML;
        const title = this.modalElement.querySelector('.modal-title').textContent;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title} - HAQEI Help</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                        .help-content { max-width: 800px; margin: 0 auto; padding: 20px; }
                        h3 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                        code { font-family: 'Monaco', 'Menlo', monospace; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${content}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        
        this.trackAction('print');
    }
    
    showNotification(message) {
        // Simple notification - could be enhanced with a proper notification system
        const notification = document.createElement('div');
        notification.className = 'help-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    loadTutorialProgress() {
        this.tutorialProgress = JSON.parse(localStorage.getItem('haqei-tutorial-progress') || '{}');
    }
    
    saveTutorialProgress() {
        localStorage.setItem('haqei-tutorial-progress', JSON.stringify(this.tutorialProgress));
    }
    
    trackModalView(term, type) {
        // Analytics tracking
        if (window.gtag) {
            gtag('event', 'help_modal_view', {
                'event_category': 'help_system',
                'event_label': term,
                'custom_parameter_1': type
            });
        }
        
        // Internal stats
        const stats = JSON.parse(localStorage.getItem('haqei-help-stats') || '{}');
        stats.modalViews = (stats.modalViews || 0) + 1;
        stats.lastModalTerm = term;
        stats.lastModalTime = Date.now();
        localStorage.setItem('haqei-help-stats', JSON.stringify(stats));
    }
    
    trackAction(action) {
        if (window.gtag) {
            gtag('event', `help_modal_${action}`, {
                'event_category': 'help_system',
                'event_label': this.currentContent?.term
            });
        }
    }
    
    // Public API
    destroy() {
        if (this.isOpen) {
            this.close();
        }
        
        if (this.overlay) {
            this.overlay.remove();
        }
        
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('haqei:showDetailedHelp', this.handleShowDetailedHelp);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpModal;
} else {
    window.HelpModal = HelpModal;
}