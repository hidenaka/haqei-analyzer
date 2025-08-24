/**
 * T10: Critical Resource Loader
 * 初期表示に必要な最小限のリソースのみ先読み
 */

(function() {
    'use strict';
    
    // Critical CSS - 初期表示に必要な最小限のスタイル
    const criticalCSS = `
        /* Reset and Base */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        
        /* Loading State */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loading-overlay.hidden { display: none; }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4a90e2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Welcome Screen - Above the fold */
        #welcome-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .title {
            font-size: 3rem;
            color: white;
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .subtitle {
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 32px;
            background: white;
            color: #764ba2;
            border: none;
            border-radius: 25px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .btn:hover { transform: translateY(-2px); }
        
        /* Hide non-critical screens initially */
        .screen:not(#welcome-screen) { display: none; }
        .screen.active { display: block; }
    `;
    
    // Inject critical CSS
    function injectCriticalCSS() {
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        style.id = 'critical-css';
        document.head.appendChild(style);
    }
    
    // Progressive enhancement - load non-critical resources
    function loadNonCriticalResources() {
        // Mark critical resources as loaded
        window.criticalLoaded = true;
        
        // Load heavy JS files asynchronously
        const heavyScripts = [
            'js/os-analyzer-main.js',
            'assets/H384H64database.js',
            'js/core/TripleOSInteractionAnalyzer.js'
        ];
        
        heavyScripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
        });
        
        // Hide loading overlay once critical resources are ready
        setTimeout(() => {
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        }, 500);
    }
    
    // Resource hints for faster loading
    function addResourceHints() {
        // Preconnect to origins
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = window.location.origin;
        document.head.appendChild(preconnect);
        
        // Prefetch next likely resources
        const prefetchResources = [
            'assets/js/questions-full.js',
            'lib/chart.min.js'
        ];
        
        prefetchResources.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    // Initialize critical path
    function initCriticalPath() {
        // 1. Inject critical CSS immediately
        injectCriticalCSS();
        
        // 2. Add resource hints
        addResourceHints();
        
        // 3. Load non-critical resources after initial render
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadNonCriticalResources);
        } else {
            loadNonCriticalResources();
        }
    }
    
    // Start immediately
    initCriticalPath();
})();