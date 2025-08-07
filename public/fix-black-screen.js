// Fix Black Screen Issue - Immediate Loading Screen Removal
// 黒い画面を修正する緊急スクリプト

(function() {
    console.log('🔧 Fixing black screen issue...');
    
    // 1. Remove loading overlay immediately
    function removeLoadingScreen() {
        const loadingScreen = document.getElementById('initial-loading');
        if (loadingScreen) {
            console.log('✅ Removing loading screen...');
            loadingScreen.style.display = 'none';
            loadingScreen.remove();
        }
        
        // Show main container
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            console.log('✅ Showing main container...');
            mainContainer.style.opacity = '1';
            mainContainer.style.display = 'block';
            mainContainer.classList.remove('opacity-0');
        }
        
        // Ensure input content is visible
        const inputContent = document.getElementById('input-content');
        if (inputContent) {
            inputContent.style.display = 'block';
        }
        
        // Remove any skeleton loaders
        const skeletons = document.querySelectorAll('.skeleton, .skeleton-input');
        skeletons.forEach(skeleton => {
            skeleton.style.display = 'none';
        });
        
        // Fix body background if needed
        if (document.body.style.backgroundColor === 'black' || 
            document.body.style.backgroundColor === '#000' ||
            document.body.style.backgroundColor === '#0f172a') {
            // Keep dark theme but ensure content is visible
            document.body.style.backgroundColor = '#1a202c';
        }
        
        // Ensure all progressive-load elements are visible
        const progressiveElements = document.querySelectorAll('.progressive-load');
        progressiveElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
        
        console.log('✅ Black screen fixed!');
    }
    
    // 2. Execute fix immediately
    removeLoadingScreen();
    
    // 3. Also execute when DOM is ready (backup)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeLoadingScreen);
    }
    
    // 4. Force execute after a short delay (final backup)
    setTimeout(removeLoadingScreen, 100);
    setTimeout(removeLoadingScreen, 500);
    setTimeout(removeLoadingScreen, 1000);
    
    // 5. Initialize essential functionality
    window.addEventListener('load', function() {
        console.log('🔧 Ensuring Future Simulator functionality...');
        
        // Check for analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        if (!analyzeBtn) {
            console.warn('⚠️ Analyze button not found, searching alternatives...');
            // Search for any button that might be the analyze button
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('分析') || btn.textContent.includes('開始')) {
                    console.log('✅ Found analyze button:', btn.textContent);
                    btn.id = 'analyze-btn';
                }
            });
        }
        
        // Check for text input
        const textInput = document.getElementById('text-input');
        if (!textInput) {
            console.warn('⚠️ Text input not found, searching alternatives...');
            const textareas = document.querySelectorAll('textarea');
            if (textareas.length > 0) {
                console.log('✅ Found textarea, assigning as text-input');
                textareas[0].id = 'text-input';
            }
        }
        
        console.log('✅ Future Simulator ready!');
    });
    
})();

// Export for global access
window.fixBlackScreen = function() {
    location.reload();
};