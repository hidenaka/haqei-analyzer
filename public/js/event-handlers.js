/**
 * T03: Event Handlers - Replacing inline event handlers
 * For CSP compliance
 */

'use strict';

// Chart.js error handling (must be before DOMContentLoaded)
const chartScript = document.getElementById('chartjs-script');
if (chartScript) {
    chartScript.addEventListener('error', function() {
        window.chartJSFailed = true;
        console.error('Chart.js failed to load');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Reload buttons
    const reloadButtons = document.querySelectorAll('[data-action="reload"]');
    reloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            location.reload();
        });
    });
    
    // Restart analysis buttons
    const restartButtons = document.querySelectorAll('[data-action="restart"]');
    restartButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.restart) {
                window.criticalCSSAnalyzer.restart();
            } else {
                location.reload();
            }
        });
    });
    
    // Navigate to pricing
    const pricingButtons = document.querySelectorAll('[data-action="pricing"]');
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = './pricing.html';
        });
    });
    
    // Error handler for external scripts
    const externalScripts = document.querySelectorAll('script[data-error-fallback]');
    externalScripts.forEach(script => {
        script.addEventListener('error', function() {
            const fallbackMsg = script.getAttribute('data-error-fallback');
            console.error(fallbackMsg || 'External script failed to load');
            
            // Set global flag for missing dependencies
            if (script.src.includes('chart.js')) {
                window.chartJSFailed = true;
            }
        });
    });
});