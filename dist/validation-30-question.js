// 30問目分析開始ボタン修正の検証スクリプト
// コンソールで実行するためのスクリプト

console.log('🧪 30問目分析開始ボタン修正検証開始');

// 1. VirtualQuestionFlow クラスの修正確認
function validateVirtualQuestionFlow() {
    console.log('🔍 VirtualQuestionFlow クラス検証中...');
    
    if (typeof VirtualQuestionFlow === 'undefined') {
        console.error('❌ VirtualQuestionFlow クラスが定義されていません');
        return false;
    }
    
    // showAnalysisButton メソッドの無効化確認
    const instance = new VirtualQuestionFlow(document.createElement('div'));
    const originalLog = console.log;
    let logCalled = false;
    
    console.log = function(...args) {
        if (args[0] && args[0].includes('disabled')) {
            logCalled = true;
        }
        originalLog.apply(console, args);
    };
    
    instance.showAnalysisButton();
    console.log = originalLog;
    
    if (logCalled) {
        console.log('✅ showAnalysisButton メソッドが正しく無効化されています');
        return true;
    } else {
        console.error('❌ showAnalysisButton メソッドの無効化が確認できません');
        return false;
    }
}

// 2. 30-question-fix.js の適用確認
function validate30QuestionFix() {
    console.log('🔧 30-question-fix.js 適用確認中...');
    
    // プロトタイプの修正確認
    if (window.VirtualQuestionFlow && 
        window.VirtualQuestionFlow.prototype && 
        window.VirtualQuestionFlow.prototype.showAnalysisButton) {
        
        const testContainer = document.createElement('div');
        const testInstance = new window.VirtualQuestionFlow(testContainer);
        
        const originalLog = console.log;
        let fixApplied = false;
        
        console.log = function(...args) {
            if (args[0] && args[0].includes('disabled')) {
                fixApplied = true;
            }
            originalLog.apply(console, args);
        };
        
        testInstance.showAnalysisButton();
        console.log = originalLog;
        
        if (fixApplied) {
            console.log('✅ 30-question-fix.js が正しく適用されています');
            return true;
        }
    }
    
    console.error('❌ 30-question-fix.js の適用が確認できません');
    return false;
}

// 3. DOM の重複ボタン確認
function validateNoDuplicateButtons() {
    console.log('🔍 重複ボタン確認中...');
    
    const analysisContainers = document.querySelectorAll('.analysis-button-container');
    const analysisButtons = document.querySelectorAll('.analyze-button, #start-analysis-button');
    
    console.log(`分析ボタンコンテナ数: ${analysisContainers.length}`);
    console.log(`分析ボタン数: ${analysisButtons.length}`);
    
    if (analysisContainers.length <= 1 && analysisButtons.length <= 1) {
        console.log('✅ 重複ボタンは検出されませんでした');
        return true;
    } else {
        console.warn('⚠️ 複数の分析ボタンが検出されました');
        analysisContainers.forEach((container, index) => {
            console.log(`Container ${index + 1}:`, container);
        });
        analysisButtons.forEach((button, index) => {
            console.log(`Button ${index + 1}:`, button);
        });
        return false;
    }
}

// 4. 現在の質問状態確認
function validateCurrentQuestionState() {
    console.log('📋 現在の質問状態確認中...');
    
    // app オブジェクトから QuestionFlow を取得
    if (window.app && window.app.questionFlow) {
        const questionFlow = window.app.questionFlow;
        const currentIndex = questionFlow.currentQuestionIndex;
        const totalQuestions = questionFlow.questions ? questionFlow.questions.length : 0;
        const completedCount = questionFlow.getCompletedCount ? questionFlow.getCompletedCount() : 0;
        
        console.log(`現在の質問: ${currentIndex + 1}/${totalQuestions}`);
        console.log(`完了数: ${completedCount}/${totalQuestions}`);
        
        // 最後の質問かどうか確認
        const isLastQuestion = currentIndex === totalQuestions - 1;
        console.log(`最後の質問: ${isLastQuestion}`);
        
        // ボタンテキスト確認
        const nextBtn = document.querySelector('.navigation-controls .nav-button:last-child');
        if (nextBtn) {
            console.log(`ボタンテキスト: "${nextBtn.textContent}"`);
            
            if (isLastQuestion && completedCount === totalQuestions) {
                if (nextBtn.textContent.includes('分析開始')) {
                    console.log('✅ 最後の質問でボタンが「分析開始」に変更されています');
                    return true;
                } else {
                    console.warn('⚠️ 最後の質問ですがボタンが「分析開始」になっていません');
                }
            } else if (!isLastQuestion && nextBtn.textContent.includes('次の質問')) {
                console.log('✅ 通常の質問でボタンが「次の質問」です');
                return true;
            }
        }
        
        return false;
    } else {
        console.warn('⚠️ app.questionFlow が見つかりません');
        return false;
    }
}

// 全体検証実行
function runFullValidation() {
    console.log('🏁 全体検証開始');
    console.log('==================');
    
    const results = {
        virtualQuestionFlow: validateVirtualQuestionFlow(),
        fixScript: validate30QuestionFix(),
        noDuplicates: validateNoDuplicateButtons(),
        questionState: validateCurrentQuestionState()
    };
    
    console.log('==================');
    console.log('📊 検証結果サマリー:');
    Object.entries(results).forEach(([test, result]) => {
        console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
    });
    
    const overallSuccess = Object.values(results).every(result => result);
    console.log(`🎯 総合結果: ${overallSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    return results;
}

// 自動実行
runFullValidation();

// グローバル関数として公開
window.validate30QuestionFix = runFullValidation;
window.validateCurrentState = validateCurrentQuestionState;
window.validateNoDuplicates = validateNoDuplicateButtons;