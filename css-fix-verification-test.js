/**
 * CSS Fix Verification Test
 * Testing w-full class addition and worryInput element functionality
 */

async function verifyCSS_Fix() {
    const testResults = {
        timestamp: new Date().toISOString(),
        testName: "CSS w-full Class Fix Verification",
        url: "http://127.0.0.1:8083/future_simulator.html",
        results: {}
    };

    try {
        console.log("🔍 Starting CSS Fix Verification Test...");
        
        // Wait for page load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log("📋 Testing worryInput element...");
        
        // Test 1: worryInput element existence and properties
        const worryInput = document.getElementById('worryInput');
        testResults.results.worryInputExists = \!\!worryInput;
        
        if (worryInput) {
            // Get computed styles
            const computedStyle = window.getComputedStyle(worryInput);
            const rect = worryInput.getBoundingClientRect();
            
            testResults.results.worryInput = {
                offsetWidth: worryInput.offsetWidth,
                offsetHeight: worryInput.offsetHeight,
                clientWidth: worryInput.clientWidth,
                clientHeight: worryInput.clientHeight,
                boundingRect: {
                    width: rect.width,
                    height: rect.height,
                    left: rect.left,
                    top: rect.top
                },
                computedStyles: {
                    width: computedStyle.width,
                    height: computedStyle.height,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity
                },
                classList: Array.from(worryInput.classList)
            };
            
            // Test input functionality
            worryInput.focus();
            worryInput.value = "テスト入力";
            testResults.results.inputFunctional = worryInput.value === "テスト入力";
        }
        
        // Test 2: Button visibility and functionality
        const aiGuessBtn = document.getElementById('aiGuessBtn');
        testResults.results.aiGuessBtnExists = \!\!aiGuessBtn;
        
        if (aiGuessBtn) {
            const btnRect = aiGuessBtn.getBoundingClientRect();
            const btnComputedStyle = window.getComputedStyle(aiGuessBtn);
            
            testResults.results.aiGuessBtn = {
                offsetWidth: aiGuessBtn.offsetWidth,
                offsetHeight: aiGuessBtn.offsetHeight,
                boundingRect: {
                    width: btnRect.width,
                    height: btnRect.height
                },
                computedStyles: {
                    display: btnComputedStyle.display,
                    visibility: btnComputedStyle.visibility
                },
                classList: Array.from(aiGuessBtn.classList)
            };
        }
        
        return testResults;
        
    } catch (error) {
        console.error("❌ Test execution error:", error);
        testResults.error = error.message;
        return testResults;
    }
}

// Auto-execute test when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const results = await verifyCSS_Fix();
    window.cssFixTestResults = results;
    console.log("📋 Final Test Results:", JSON.stringify(results, null, 2));
});
EOF < /dev/null