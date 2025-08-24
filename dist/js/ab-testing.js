/**
 * HAQEI A/B Testing Framework
 * Simple, maintainable A/B testing for Cloudflare Pages
 */

class HAQEIABTesting {
    constructor() {
        
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.testId = this.getOrCreateTestId();
        this.variant = this.assignVariant();
        this.events = [];
        this.startTime = Date.now();
        this.initializeTracking();
    }

    /**
     * Get or create unique test ID for user
     */
    getOrCreateTestId() {
        let testId = localStorage.getItem('haqei_test_id');
        if (!testId) {
            testId = 'test_' + Date.now() + '_' + this.rng.next().toString(36).substr(2, 9);
            localStorage.setItem('haqei_test_id', testId);
        }
        return testId;
    }

    /**
     * Assign user to test variant (A or B)
     */
    assignVariant() {
        let variant = localStorage.getItem('haqei_test_variant');
        if (!variant) {
            // 50/50 split
            variant = this.rng.next() < 0.5 ? 'A' : 'B';
            localStorage.setItem('haqei_test_variant', variant);
        }
        return variant;
    }

    /**
     * Initialize tracking
     */
    initializeTracking() {
        // Track page view
        this.trackEvent('page_view', {
            url: window.location.href,
            referrer: document.referrer
        });

        // Track variant assignment
        this.trackEvent('variant_assigned', {
            variant: this.variant
        });
    }

    /**
     * Apply variant changes
     */
    applyVariant() {
        if (this.variant === 'B') {
            // Variant B changes
            this.applyVariantB();
        }
        // Variant A is the control (no changes)
    }

    /**
     * Apply Variant B modifications
     */
    applyVariantB() {
        // Example modifications for Variant B
        // These can be customized based on what you want to test

        // 1. Different button text
        const startBtn = document.querySelector('#startAnalysisBtn, button[onclick*="startAnalysis"]');
        if (startBtn) {
            startBtn.textContent = '🚀 あなたのOSを分析する';
        }

        // 2. Different progress indicator
        document.body.classList.add('variant-b');

        // 3. Enhanced visual feedback
        this.enhanceVisualFeedback();
    }

    /**
     * Enhance visual feedback for Variant B
     */
    enhanceVisualFeedback() {
        // Add CSS for variant B
        const style = document.createElement('style');
        style.textContent = `
            .variant-b .question-card {
                transition: all 0.3s ease;
            }
            .variant-b .question-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .variant-b .progress-bar {
                background: linear-gradient(90deg, #4a90e2, #67b8ff);
            }
            .variant-b button {
                transition: all 0.2s ease;
            }
            .variant-b button:active {
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Track user events
     */
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            variant: this.variant,
            testId: this.testId,
            data: data
        };

        this.events.push(event);

        // Store events locally
        this.saveEvents();

        // Send to analytics if available
        this.sendToAnalytics(event);
    }

    /**
     * Track analysis start
     */
    trackAnalysisStart() {
        this.trackEvent('analysis_started', {
            timestamp: Date.now()
        });
    }

    /**
     * Track question answered
     */
    trackQuestionAnswered(questionNumber, answer) {
        this.trackEvent('question_answered', {
            question: questionNumber,
            answer: answer,
            timeSpent: Date.now() - this.startTime
        });
    }

    /**
     * Track analysis completion
     */
    trackAnalysisComplete(results) {
        const completionTime = Date.now() - this.startTime;
        this.trackEvent('analysis_completed', {
            completionTime: completionTime,
            engineOS: results.engineOS,
            interfaceOS: results.interfaceOS,
            safeModeOS: results.safeModeOS
        });
    }

    /**
     * Track user feedback
     */
    trackFeedback(satisfaction, accuracy, comments) {
        this.trackEvent('user_feedback', {
            satisfaction: satisfaction, // 1-5 scale
            accuracy: accuracy, // 1-5 scale
            comments: comments,
            variant: this.variant
        });
    }

    /**
     * Save events to localStorage
     */
    saveEvents() {
        const storedEvents = JSON.parse(localStorage.getItem('haqei_ab_events') || '[]');
        storedEvents.push(...this.events);
        
        // Keep only last 100 events to prevent storage overflow
        if (storedEvents.length > 100) {
            storedEvents.splice(0, storedEvents.length - 100);
        }
        
        localStorage.setItem('haqei_ab_events', JSON.stringify(storedEvents));
    }

    /**
     * Send events to analytics
     */
    sendToAnalytics(event) {
        // Send to Cloudflare Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', event.name, {
                'event_category': 'AB_Test',
                'event_label': this.variant,
                'value': event.data
            });
        }

        // Custom analytics endpoint (if needed)
        if (window.HAQEI_ANALYTICS_ENDPOINT) {
            fetch(window.HAQEI_ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }).catch(err => {
                console.debug('Analytics send failed:', err);
            });
        }
    }

    /**
     * Get conversion rate for current variant
     */
    getConversionRate() {
        const completed = this.events.filter(e => e.name === 'analysis_completed').length;
        const started = this.events.filter(e => e.name === 'analysis_started').length;
        
        if (started === 0) return 0;
        return (completed / started) * 100;
    }

    /**
     * Get average completion time
     */
    getAverageCompletionTime() {
        const completions = this.events.filter(e => e.name === 'analysis_completed');
        if (completions.length === 0) return 0;
        
        const totalTime = completions.reduce((sum, e) => sum + e.data.completionTime, 0);
        return totalTime / completions.length;
    }

    /**
     * Get test metrics
     */
    getMetrics() {
        return {
            variant: this.variant,
            testId: this.testId,
            conversionRate: this.getConversionRate(),
            averageCompletionTime: this.getAverageCompletionTime(),
            totalEvents: this.events.length,
            startTime: this.startTime
        };
    }

    /**
     * Export test data
     */
    exportTestData() {
        const data = {
            testId: this.testId,
            variant: this.variant,
            events: this.events,
            metrics: this.getMetrics(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `haqei_ab_test_${this.testId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize A/B testing when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.haqeiABTest = new HAQEIABTesting();
        window.haqeiABTest.applyVariant();
    });
} else {
    window.haqeiABTest = new HAQEIABTesting();
    window.haqeiABTest.applyVariant();
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HAQEIABTesting;
}