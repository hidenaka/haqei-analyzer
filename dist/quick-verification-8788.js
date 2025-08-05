// Quick Verification Script for localhost:8788
// 目的: 設問が正常に表示されるかの簡単な確認

console.log('🧪 Quick Verification for localhost:8788 started');

// Test the main functions
function verifyQuestions() {
    console.log('📋 Verifying questions...');
    
    // Check if questions container exists
    const questionsContainer = document.getElementById('questions-container');
    console.log('Questions container exists:', !!questionsContainer);
    
    // Check if original questions data is loaded
    console.log('WORLDVIEW_QUESTIONS available:', typeof window.WORLDVIEW_QUESTIONS !== 'undefined');
    console.log('SCENARIO_QUESTIONS available:', typeof window.SCENARIO_QUESTIONS !== 'undefined');
    
    if (window.WORLDVIEW_QUESTIONS) {
        console.log('✅ Worldview questions count:', window.WORLDVIEW_QUESTIONS.length);
        console.log('First worldview question:', window.WORLDVIEW_QUESTIONS[0]?.question_text?.substring(0, 50) + '...');
    }
    
    if (window.SCENARIO_QUESTIONS) {
        console.log('✅ Scenario questions count:', window.SCENARIO_QUESTIONS.length);
        console.log('First scenario question:', window.SCENARIO_QUESTIONS[0]?.question_text?.substring(0, 50) + '...');
    }
    
    // Test if simple question fix is working
    const startButton = document.getElementById('start-analysis-btn');
    if (startButton) {
        console.log('✅ Start button found');
        
        // Simulate click to test if questions show
        console.log('🔧 Testing question display fix...');
        startButton.click();
        
        setTimeout(() => {
            const isVisible = questionsContainer && 
                questionsContainer.style.display !== 'none' && 
                questionsContainer.style.visibility !== 'hidden';
            console.log('Questions container visible after click:', isVisible);
            
            if (isVisible) {
                console.log('✅ Questions display fix is working!');
            } else {
                console.log('❌ Questions display fix needs debugging');
            }
        }, 100);
    } else {
        console.log('❌ Start button not found');
    }
}

// Run verification when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyQuestions);
} else {
    verifyQuestions();
}

// Export for manual testing
window.verifyQuestions = verifyQuestions;