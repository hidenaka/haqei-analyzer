/**
 * OS Analyzer 質問フロー開始問題の修正パッチ
 * 
 * 問題: CriticalCSSAnalyzerクラスのbindEvents()メソッドで
 * イベントリスナーが正しくバインドされていない
 * 
 * 原因: イベントリスナー登録時にDOMが存在しない可能性
 * 
 * 解決策: 
 * 1. DOMContentLoaded後に確実にバインド
 * 2. エラーハンドリングの追加
 * 3. デバッグログの追加
 */

// 修正パッチを適用する関数
function applyStartButtonFix() {
    console.log('🔧 Applying start button fix...');
    
    // DOM要素の存在確認
    const startBtn = document.getElementById('start-btn');
    
    if (!startBtn) {
        console.error('❌ Start button not found');
        return false;
    }
    
    // criticalCSSAnalyzerの存在確認
    if (!window.criticalCSSAnalyzer) {
        console.error('❌ CriticalCSSAnalyzer not initialized');
        return false;
    }
    
    // 既存のイベントリスナーをクリア（重複防止）
    const newStartBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newStartBtn, startBtn);
    
    // 新しいイベントリスナーを追加
    newStartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('✅ Start button clicked');
        
        try {
            // CriticalCSSAnalyzerのstartAnalysisメソッドを呼び出し
            if (window.criticalCSSAnalyzer && typeof window.criticalCSSAnalyzer.startAnalysis === 'function') {
                console.log('🚀 Starting analysis...');
                window.criticalCSSAnalyzer.startAnalysis();
            } else {
                console.error('❌ startAnalysis method not found');
                // フォールバック: 手動で質問画面に遷移
                fallbackStartQuestions();
            }
        } catch (error) {
            console.error('❌ Error starting analysis:', error);
            showErrorToUser('質問の開始に失敗しました。ページを再読み込みしてください。');
        }
    });
    
    console.log('✅ Start button fix applied');
    return true;
}

// フォールバック: 質問画面への手動遷移
function fallbackStartQuestions() {
    console.log('⚠️ Using fallback start method');
    
    // ランディングセクションを非表示
    const landingSection = document.getElementById('landing-section');
    if (landingSection) {
        landingSection.style.display = 'none';
    }
    
    // 質問セクションを表示
    const questionSection = document.getElementById('question-section');
    if (questionSection) {
        questionSection.style.display = 'block';
        questionSection.classList.add('active');
    }
    
    // 最初の質問を表示
    if (window.criticalCSSAnalyzer) {
        window.criticalCSSAnalyzer.currentQuestion = 0;
        window.criticalCSSAnalyzer.showQuestion(0);
    }
}

// エラー表示関数
function showErrorToUser(message) {
    // 既存のエラー表示要素を探す
    let errorDiv = document.getElementById('error-notification');
    
    // なければ作成
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            animation: slideDown 0.3s ease-out;
        `;
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // 5秒後に自動的に非表示
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// デバッグ用: グローバル関数として公開
window.debugStartButton = function() {
    console.log('=== Start Button Debug Info ===');
    console.log('Start button exists:', !!document.getElementById('start-btn'));
    console.log('CriticalCSSAnalyzer exists:', !!window.criticalCSSAnalyzer);
    
    if (window.criticalCSSAnalyzer) {
        console.log('startAnalysis method exists:', typeof window.criticalCSSAnalyzer.startAnalysis === 'function');
        console.log('Current question:', window.criticalCSSAnalyzer.currentQuestion);
        console.log('Total questions:', window.criticalCSSAnalyzer.questions?.length);
    }
    
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        console.log('Button onclick:', startBtn.onclick);
        console.log('Button event listeners:', startBtn._eventListeners);
    }
};

// テスト用: 手動で質問を開始
window.manualStartQuestions = function() {
    console.log('📝 Manual start questions triggered');
    
    if (window.criticalCSSAnalyzer) {
        window.criticalCSSAnalyzer.startAnalysis();
    } else {
        fallbackStartQuestions();
    }
};

// 修正を自動適用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStartButtonFix);
} else {
    // 既にDOM読み込み完了している場合
    setTimeout(applyStartButtonFix, 100);
}

console.log('✅ Start button fix script loaded');
console.log('💡 Debug with: window.debugStartButton()');
console.log('🚀 Manual start: window.manualStartQuestions()');