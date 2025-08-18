// 🚨 EMERGENCY PATCH for HAQEI os_analyzer.html Start Button Issue
// This patch fixes the non-functional start button by ensuring proper event binding

console.log('🚨 Emergency Patch Loading...');

// Wait for everything to be fully loaded
window.addEventListener('load', function() {
    console.log('🚨 Emergency Patch: Window loaded');
    
    setTimeout(function() {
        console.log('🚨 Emergency Patch: Attempting to fix start button...');
        
        // Find the start button
        const startBtn = document.getElementById('start-btn');
        
        if (!startBtn) {
            console.error('🚨 Emergency Patch: Start button not found!');
            return;
        }
        
        console.log('✅ Emergency Patch: Start button found');
        
        // Check if criticalCSSAnalyzer exists
        if (!window.criticalCSSAnalyzer) {
            console.error('🚨 Emergency Patch: CriticalCSSAnalyzer not found!');
            return;
        }
        
        console.log('✅ Emergency Patch: CriticalCSSAnalyzer found');
        
        // Check if startAnalysis method exists
        if (typeof window.criticalCSSAnalyzer.startAnalysis !== 'function') {
            console.error('🚨 Emergency Patch: startAnalysis method not found!');
            return;
        }
        
        console.log('✅ Emergency Patch: startAnalysis method found');
        
        // Remove any existing event listeners by cloning the element
        const newStartBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newStartBtn, startBtn);
        
        // Add the emergency event listener
        newStartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🚨 Emergency Patch: Start button clicked!');
            
            try {
                window.criticalCSSAnalyzer.startAnalysis();
                console.log('✅ Emergency Patch: startAnalysis called successfully!');
            } catch (error) {
                console.error('❌ Emergency Patch: Error calling startAnalysis:', error);
            }
        });
        
        console.log('✅ Emergency Patch: Event listener added successfully!');
        
        // Also add global function as backup
        window.emergencyStartAnalysis = function() {
            console.log('🚨 Emergency function called');
            window.criticalCSSAnalyzer.startAnalysis();
        };
        
        // Add visual indicator that patch is active
        newStartBtn.style.boxShadow = '0 0 10px #ff6b6b';
        newStartBtn.title = '🚨 Emergency Patch Active - Click to start analysis';
        
        console.log('🎯 Emergency Patch: Fully loaded and active!');
        
    }, 1000); // Wait 1 second after window load to ensure everything is ready
    
}, false);

// Also try immediate binding if DOM is already ready
if (document.readyState === 'complete') {
    console.log('🚨 Emergency Patch: DOM already complete, applying immediately');
    window.dispatchEvent(new Event('load'));
}