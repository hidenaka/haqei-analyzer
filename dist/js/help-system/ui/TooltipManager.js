/**
 * TooltipManager.js - HAQEI Intelligent Help System
 * Manages hover/click tooltips for terms and concepts
 * 
 * Features:
 * - Smart positioning to avoid viewport edges
 * - Touch-friendly interactions
 * - Performance-optimized with event delegation
 * - Keyboard navigation support
 * - Theme-aware styling
 */

class TooltipManager {
    constructor() {
        this.activeTooltip = null;
        this.tooltipElement = null;
        this.showDelay = 600; // ms
        this.hideDelay = 200; // ms
        this.showTimer = null;
        this.hideTimer = null;
        this.touchDevice = 'ontouchstart' in window;
        
        this.init();
    }
    
    init() {
        this.createTooltipElement();
        this.attachEventListeners();
        this.loadUserPreferences();
    }
    
    createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'haqei-tooltip';
        this.tooltipElement.setAttribute('role', 'tooltip');
        this.tooltipElement.setAttribute('aria-hidden', 'true');
        
        // Create tooltip structure
        this.tooltipElement.innerHTML = `
            <div class="tooltip-arrow"></div>
            <div class="tooltip-content">
                <div class="tooltip-title"></div>
                <div class="tooltip-description"></div>
                <div class="tooltip-actions">
                    <button class="tooltip-more" aria-label="Learn more">詳細</button>
                    <button class="tooltip-dismiss" aria-label="Dismiss">×</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.tooltipElement);
    }
    
    attachEventListeners() {
        // Use event delegation for performance
        document.addEventListener(this.touchDevice ? 'touchstart' : 'mouseover', 
            this.handleMouseEnter.bind(this), { passive: true });
        document.addEventListener(this.touchDevice ? 'touchend' : 'mouseout', 
            this.handleMouseLeave.bind(this), { passive: true });
        
        // Click handlers for interactive tooltips
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Window resize for repositioning
        window.addEventListener('resize', this.repositionTooltip.bind(this), { passive: true });
        
        // Tooltip internal actions
        this.tooltipElement.addEventListener('click', this.handleTooltipAction.bind(this));
    }
    
    handleMouseEnter(event) {
        const target = event.target.closest('[data-tooltip]');
        if (!target) return;
        
        this.clearTimers();
        
        if (this.touchDevice) {
            // On touch devices, require tap to show
            return;
        }
        
        this.showTimer = setTimeout(() => {
            this.showTooltip(target);
        }, this.showDelay);
    }
    
    handleMouseLeave(event) {
        const target = event.target.closest('[data-tooltip]');
        if (!target) return;
        
        this.clearTimers();
        
        this.hideTimer = setTimeout(() => {
            this.hideTooltip();
        }, this.hideDelay);
    }
    
    handleClick(event) {
        const target = event.target.closest('[data-tooltip]');
        
        if (target) {
            event.preventDefault();
            this.clearTimers();
            
            if (this.activeTooltip === target) {
                this.hideTooltip();
            } else {
                this.showTooltip(target);
            }
        } else if (!event.target.closest('.haqei-tooltip')) {
            // Click outside tooltip - hide it
            this.hideTooltip();
        }
    }
    
    handleKeydown(event) {
        if (event.key === 'Escape' && this.activeTooltip) {
            this.hideTooltip();
            this.activeTooltip.focus();
        }
        
        if (event.key === 'Enter' || event.key === ' ') {
            const target = event.target.closest('[data-tooltip]');
            if (target) {
                event.preventDefault();
                this.showTooltip(target);
            }
        }
    }
    
    showTooltip(target) {
        const tooltipData = this.getTooltipData(target);
        if (!tooltipData) return;
        
        this.activeTooltip = target;
        this.populateTooltip(tooltipData);
        this.positionTooltip(target);
        
        // Animate in
        this.tooltipElement.classList.add('tooltip-visible');
        this.tooltipElement.setAttribute('aria-hidden', 'false');
        
        // Track analytics
        this.trackTooltipView(tooltipData.term);
        
        // Auto-hide after delay on mobile
        if (this.touchDevice) {
            setTimeout(() => {
                if (this.activeTooltip === target) {
                    this.hideTooltip();
                }
            }, 5000);
        }
    }
    
    hideTooltip() {
        if (!this.activeTooltip) return;
        
        this.tooltipElement.classList.remove('tooltip-visible');
        this.tooltipElement.setAttribute('aria-hidden', 'true');
        
        setTimeout(() => {
            this.activeTooltip = null;
        }, 300); // Match CSS transition duration
    }
    
    getTooltipData(target) {
        const term = target.getAttribute('data-tooltip');
        const title = target.getAttribute('data-tooltip-title') || term;
        const description = target.getAttribute('data-tooltip-desc') || '';
        const type = target.getAttribute('data-tooltip-type') || 'concept';
        const showMore = target.getAttribute('data-tooltip-more') !== 'false';
        
        return {
            term,
            title,
            description,
            type,
            showMore,
            element: target
        };
    }
    
    populateTooltip(data) {
        const titleEl = this.tooltipElement.querySelector('.tooltip-title');
        const descEl = this.tooltipElement.querySelector('.tooltip-description');
        const moreBtn = this.tooltipElement.querySelector('.tooltip-more');
        
        titleEl.textContent = data.title;
        descEl.textContent = data.description;
        
        // Show/hide more button
        moreBtn.style.display = data.showMore ? 'inline-block' : 'none';
        
        // Apply type-specific styling
        this.tooltipElement.className = `haqei-tooltip tooltip-${data.type}`;
    }
    
    positionTooltip(target) {
        const tooltip = this.tooltipElement;
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        let top = targetRect.top - tooltipRect.height - 10;
        let arrowPosition = 'bottom';
        
        // Adjust horizontal position
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewport.width - 10) {
            left = viewport.width - tooltipRect.width - 10;
        }
        
        // Adjust vertical position
        if (top < 10) {
            top = targetRect.bottom + 10;
            arrowPosition = 'top';
        }
        
        // Apply positioning
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        // Position arrow
        const arrow = tooltip.querySelector('.tooltip-arrow');
        const arrowLeft = targetRect.left + (targetRect.width / 2) - left;
        arrow.style.left = `${Math.max(15, Math.min(arrowLeft, tooltipRect.width - 15))}px`;
        arrow.className = `tooltip-arrow arrow-${arrowPosition}`;
    }
    
    repositionTooltip() {
        if (this.activeTooltip) {
            this.positionTooltip(this.activeTooltip);
        }
    }
    
    handleTooltipAction(event) {
        if (event.target.classList.contains('tooltip-more')) {
            event.preventDefault();
            const tooltipData = this.getTooltipData(this.activeTooltip);
            this.showDetailedHelp(tooltipData);
        }
        
        if (event.target.classList.contains('tooltip-dismiss')) {
            event.preventDefault();
            this.hideTooltip();
        }
    }
    
    showDetailedHelp(data) {
        // Trigger detailed help modal
        const event = new CustomEvent('haqei:showDetailedHelp', {
            detail: { term: data.term, type: data.type }
        });
        document.dispatchEvent(event);
        
        this.hideTooltip();
    }
    
    clearTimers() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
    }
    
    loadUserPreferences() {
        const prefs = JSON.parse(localStorage.getItem('haqei-help-prefs') || '{}');
        this.showDelay = prefs.tooltipDelay || 600;
        
        if (prefs.disableTooltips) {
            this.disable();
        }
    }
    
    enable() {
        this.tooltipElement.style.display = 'block';
        localStorage.setItem('haqei-help-prefs', 
            JSON.stringify({...this.getUserPreferences(), disableTooltips: false}));
    }
    
    disable() {
        this.hideTooltip();
        this.tooltipElement.style.display = 'none';
        localStorage.setItem('haqei-help-prefs', 
            JSON.stringify({...this.getUserPreferences(), disableTooltips: true}));
    }
    
    getUserPreferences() {
        return JSON.parse(localStorage.getItem('haqei-help-prefs') || '{}');
    }
    
    trackTooltipView(term) {
        // Analytics tracking
        if (window.gtag) {
            gtag('event', 'tooltip_view', {
                'event_category': 'help_system',
                'event_label': term
            });
        }
        
        // Internal tracking
        const stats = JSON.parse(localStorage.getItem('haqei-help-stats') || '{}');
        stats.tooltipViews = (stats.tooltipViews || 0) + 1;
        stats.lastTooltipTerm = term;
        stats.lastTooltipTime = Date.now();
        localStorage.setItem('haqei-help-stats', JSON.stringify(stats));
    }
    
    // Public API
    registerTooltip(element, data) {
        element.setAttribute('data-tooltip', data.term);
        if (data.title) element.setAttribute('data-tooltip-title', data.title);
        if (data.description) element.setAttribute('data-tooltip-desc', data.description);
        if (data.type) element.setAttribute('data-tooltip-type', data.type);
        element.setAttribute('tabindex', '0');
        element.setAttribute('aria-describedby', 'haqei-tooltip');
    }
    
    unregisterTooltip(element) {
        element.removeAttribute('data-tooltip');
        element.removeAttribute('data-tooltip-title');
        element.removeAttribute('data-tooltip-desc');
        element.removeAttribute('data-tooltip-type');
        element.removeAttribute('tabindex');
        element.removeAttribute('aria-describedby');
    }
    
    destroy() {
        this.clearTimers();
        this.hideTooltip();
        
        if (this.tooltipElement) {
            this.tooltipElement.remove();
        }
        
        // Remove event listeners
        document.removeEventListener('mouseover', this.handleMouseEnter);
        document.removeEventListener('mouseout', this.handleMouseLeave);
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.repositionTooltip);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
} else {
    window.TooltipManager = TooltipManager;
}