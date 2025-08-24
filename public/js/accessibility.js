/**
 * T11: Accessibility Enhancement Module
 * アクセシビリティ基準に準拠した実装
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = 0;
        this.skipLinks = new Map();
        this.announcements = [];
        this.init();
    }

    init() {
        // Skip to main content
        this.createSkipLinks();
        
        // ARIA live regions
        this.setupLiveRegions();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
        
        // Screen reader announcements
        this.setupAnnouncements();
    }

    createSkipLinks() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'メインコンテンツへスキップ';
        skipLink.setAttribute('aria-label', 'メインコンテンツへスキップ');
        
        // Insert at the beginning of body
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Skip to navigation
        const skipToNav = document.createElement('a');
        skipToNav.href = '#navigation';
        skipToNav.className = 'skip-link';
        skipToNav.textContent = 'ナビゲーションへスキップ';
        skipToNav.setAttribute('aria-label', 'ナビゲーションへスキップ');
        
        document.body.insertBefore(skipToNav, skipLink.nextSibling);
    }

    setupLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        // Create alert region for important messages
        const alertRegion = document.createElement('div');
        alertRegion.id = 'aria-alert-region';
        alertRegion.setAttribute('role', 'alert');
        alertRegion.setAttribute('aria-live', 'assertive');
        alertRegion.className = 'sr-only';
        document.body.appendChild(alertRegion);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
            
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
            
            // Arrow keys for option navigation
            if (e.key.startsWith('Arrow')) {
                this.handleArrowNavigation(e);
            }
            
            // Enter/Space for activation
            if (e.key === 'Enter' || e.key === ' ') {
                this.handleActivation(e);
            }
        });
    }

    setupFocusManagement() {
        // Track focus changes
        document.addEventListener('focus', (e) => {
            this.updateFocusIndicator(e.target);
        }, true);
        
        // Manage focus trap for modals
        this.setupFocusTrap();
        
        // Restore focus after screen changes
        this.setupFocusRestoration();
    }

    setupAnnouncements() {
        // Announce screen changes
        this.observeScreenChanges();
        
        // Announce progress updates
        this.observeProgressChanges();
        
        // Announce form validation
        this.observeFormValidation();
    }

    handleTabNavigation(e) {
        const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(document.querySelectorAll(focusableSelector));
        
        if (this.focusableElements.length === 0) return;
        
        const currentIndex = this.focusableElements.indexOf(document.activeElement);
        let nextIndex;
        
        if (e.shiftKey) {
            // Backward navigation
            nextIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1;
        } else {
            // Forward navigation
            nextIndex = currentIndex >= this.focusableElements.length - 1 ? 0 : currentIndex + 1;
        }
        
        // Skip hidden elements
        while (this.focusableElements[nextIndex] && !this.isVisible(this.focusableElements[nextIndex])) {
            nextIndex = e.shiftKey ? nextIndex - 1 : nextIndex + 1;
            if (nextIndex < 0) nextIndex = this.focusableElements.length - 1;
            if (nextIndex >= this.focusableElements.length) nextIndex = 0;
        }
    }

    handleEscapeKey(e) {
        // Close any open modals or dropdowns
        const modal = document.querySelector('.modal.active');
        if (modal) {
            this.closeModal(modal);
            e.preventDefault();
        }
    }

    handleArrowNavigation(e) {
        const target = e.target;
        
        // Handle radio groups and option lists
        if (target.getAttribute('role') === 'radio' || target.classList.contains('option')) {
            const group = target.closest('[role="radiogroup"], .options-container');
            if (!group) return;
            
            const options = Array.from(group.querySelectorAll('[role="radio"], .option'));
            const currentIndex = options.indexOf(target);
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    nextIndex = currentIndex - 1;
                    if (nextIndex < 0) nextIndex = options.length - 1;
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    nextIndex = currentIndex + 1;
                    if (nextIndex >= options.length) nextIndex = 0;
                    break;
                default:
                    return;
            }
            
            options[nextIndex]?.focus();
            e.preventDefault();
        }
    }

    handleActivation(e) {
        const target = e.target;
        
        // Activate buttons and links with Space/Enter
        if (target.getAttribute('role') === 'button' || target.classList.contains('option')) {
            if (e.key === ' ') {
                target.click();
                e.preventDefault();
            }
        }
    }

    setupFocusTrap() {
        // Trap focus within modals
        const trapFocus = (container) => {
            const focusableElements = container.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            container.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            });
        };
        
        // Apply to all modals
        document.querySelectorAll('.modal').forEach(modal => {
            trapFocus(modal);
        });
    }

    setupFocusRestoration() {
        let previousFocus = null;
        
        // Save focus before screen change
        document.addEventListener('screen-change-start', () => {
            previousFocus = document.activeElement;
        });
        
        // Restore focus after screen change
        document.addEventListener('screen-change-complete', () => {
            if (previousFocus && document.body.contains(previousFocus)) {
                previousFocus.focus();
            } else {
                // Focus on main heading of new screen
                const heading = document.querySelector('.screen.active h1, .screen.active h2');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus();
                }
            }
        });
    }

    observeScreenChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('screen') && target.classList.contains('active')) {
                        this.announceScreenChange(target);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    observeProgressChanges() {
        const progressBar = document.querySelector('#progress-fill');
        if (!progressBar) return;
        
        const observer = new MutationObserver(() => {
            const progressText = document.querySelector('#progress-text');
            if (progressText) {
                this.announce(`進捗: ${progressText.textContent}`);
            }
        });
        
        observer.observe(progressBar, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    observeFormValidation() {
        document.addEventListener('invalid', (e) => {
            const field = e.target;
            const message = field.validationMessage || 'このフィールドは必須です';
            this.announceAlert(`エラー: ${field.getAttribute('aria-label') || field.name} - ${message}`);
        }, true);
    }

    announceScreenChange(screen) {
        const screenName = screen.id.replace('-screen', '').replace('-', ' ');
        const heading = screen.querySelector('h1, h2');
        const message = heading ? heading.textContent : `${screenName}画面に移動しました`;
        
        this.announce(message);
    }

    announce(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    announceAlert(message) {
        const alertRegion = document.getElementById('aria-alert-region');
        if (alertRegion) {
            alertRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                alertRegion.textContent = '';
            }, 2000);
        }
    }

    updateFocusIndicator(element) {
        // Remove previous focus indicator
        document.querySelectorAll('.focus-visible').forEach(el => {
            el.classList.remove('focus-visible');
        });
        
        // Add focus indicator to current element
        if (element && !element.matches(':focus-visible')) {
            element.classList.add('focus-visible');
        }
    }

    isVisible(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        
        return rect.width > 0 && 
               rect.height > 0 && 
               style.visibility !== 'hidden' && 
               style.display !== 'none' &&
               style.opacity !== '0';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore focus to trigger element
        const trigger = modal.dataset.trigger;
        if (trigger) {
            const triggerElement = document.querySelector(trigger);
            if (triggerElement) {
                triggerElement.focus();
            }
        }
    }

    // Public API
    setFocus(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
        }
    }

    moveFocusToNext() {
        const current = document.activeElement;
        const focusable = this.focusableElements;
        const currentIndex = focusable.indexOf(current);
        
        if (currentIndex >= 0 && currentIndex < focusable.length - 1) {
            focusable[currentIndex + 1].focus();
        }
    }

    moveFocusToPrevious() {
        const current = document.activeElement;
        const focusable = this.focusableElements;
        const currentIndex = focusable.indexOf(current);
        
        if (currentIndex > 0) {
            focusable[currentIndex - 1].focus();
        }
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.accessibilityManager = new AccessibilityManager();
    });
} else {
    window.accessibilityManager = new AccessibilityManager();
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}