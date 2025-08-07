// 🚨 EMERGENCY BYPASS SCRIPT for HAQEI os_analyzer.html
// This script bypasses the main application and provides direct functionality

console.log('🚨 EMERGENCY BYPASS: Loading independent start button functionality');

// Define minimal required data
const EMERGENCY_QUESTIONS = [
    {
        id: 1,
        text: "緊急テスト質問: あなたの価値観について",
        options: [
            { text: "強く同意する", value: 5 },
            { text: "同意する", value: 4 },
            { text: "どちらでもない", value: 3 },
            { text: "同意しない", value: 2 },
            { text: "強く同意しない", value: 1 }
        ]
    }
];

// Emergency state management
class EmergencyState {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
    }
}

// Emergency question flow
class EmergencyQuestionFlow {
    constructor() {
        this.state = new EmergencyState();
        console.log('🚨 Emergency Question Flow initialized');
    }
    
    startAnalysis() {
        console.log('🚨 Emergency startAnalysis called');
        
        // Hide welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('active');
            console.log('✅ Welcome screen hidden');
        }
        
        // Show question screen  
        const questionScreen = document.getElementById('question-screen');
        if (questionScreen) {
            questionScreen.classList.add('active');
            console.log('✅ Question screen activated');
            
            // Show first question
            this.showQuestion(0);
        } else {
            console.error('❌ Question screen not found');
        }
    }
    
    showQuestion(index) {
        if (index >= EMERGENCY_QUESTIONS.length) {
            console.log('🎉 Emergency analysis complete');
            return;
        }
        
        const question = EMERGENCY_QUESTIONS[index];
        console.log(`📝 Showing question ${index + 1}: ${question.text}`);
        
        // Update question display
        const questionTitle = document.getElementById('question-title');
        const questionNumber = document.getElementById('question-number');
        const optionsContainer = document.getElementById('options-container');
        
        if (questionTitle) questionTitle.textContent = question.text;
        if (questionNumber) questionNumber.textContent = index + 1;
        
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, optionIndex) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.innerHTML = `<span class="option-text">${option.text}</span>`;
                
                optionElement.addEventListener('click', () => {
                    console.log(`✅ Option selected: ${option.text}`);
                    // Mark as selected
                    optionsContainer.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
                    optionElement.classList.add('selected');
                    
                    // Store answer
                    this.state.answers[index] = option;
                    
                    // Auto-advance after selection
                    setTimeout(() => {
                        this.showQuestion(index + 1);
                    }, 1000);
                });
                
                optionsContainer.appendChild(optionElement);
            });
            
            console.log(`✅ Rendered ${question.options.length} options`);
        }
    }
}

// Initialize emergency system
function initializeEmergencySystem() {
    console.log('🚨 Initializing emergency system...');
    
    // Create emergency flow
    window.emergencyFlow = new EmergencyQuestionFlow();
    
    // Bind to start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        console.log('🚨 Binding emergency handler to start button');
        
        // Remove existing handlers
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        // Add emergency handler
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🚨 EMERGENCY START BUTTON CLICKED!');
            window.emergencyFlow.startAnalysis();
        });
        
        // Visual indicator
        newBtn.style.border = '3px solid #ff4444';
        newBtn.title = '🚨 Emergency Mode Active';
        
        console.log('✅ Emergency handler bound successfully');
    } else {
        console.error('❌ Start button not found');
    }
}

// Auto-initialize when this script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmergencySystem);
} else {
    initializeEmergencySystem();
}

console.log('🚨 EMERGENCY BYPASS SCRIPT LOADED');