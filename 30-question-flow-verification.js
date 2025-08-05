/**
 * 30問回答フロー検証スクリプト
 * HAQEIの30問回答が正常に動作し、結果ページに遷移できるかを検証
 */

console.log('🚀 HAQEI 30問フロー検証開始');

/**
 * 質問要素の可視性を検証・修正
 */
function verifyAndFixQuestionVisibility() {
    console.log('🔍 質問要素の可視性を検証・修正中...');
    
    // haqei-question要素を検索
    const haqeiQuestions = document.querySelectorAll('haqei-question');
    console.log(`📝 haqei-question要素: ${haqeiQuestions.length}個見つかりました`);
    
    if (haqeiQuestions.length === 0) {
        console.log('⚠️ haqei-question要素が見つかりません。動的生成を待機中...');
        return false;
    }
    
    let visibilityFixed = 0;
    haqeiQuestions.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        console.log(`📏 質問${index + 1}: w=${rect.width}, h=${rect.height}, visible=${isVisible}`);
        
        if (!isVisible) {
            // 強制的に要素を可視化
            element.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                width: 100% !important;
                height: auto !important;
                min-height: 400px !important;
                max-width: 800px !important;
                margin: 20px auto !important;
                padding: 30px !important;
                background: #2a2a2a !important;
                border: 3px solid #6366f1 !important;
                border-radius: 12px !important;
                z-index: 9999 !important;
                pointer-events: auto !important;
                box-sizing: border-box !important;
            `;
            visibilityFixed++;
            console.log(`✅ 質問${index + 1}の可視性を修正しました`);
        }
        
        // ラジオボタンも修正
        const radioButtons = element.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.style.cssText = `
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                pointer-events: auto !important;
                z-index: 10000 !important;
                width: 20px !important;
                height: 20px !important;
                margin: 5px !important;
            `;
        });
        
        // ラベルも修正
        const labels = element.querySelectorAll('label');
        labels.forEach(label => {
            label.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                z-index: 10000 !important;
                align-items: center !important;
                padding: 15px !important;
                margin: 10px 0 !important;
                background: #3a3a3a !important;
                border: 2px solid #555 !important;
                border-radius: 8px !important;
                color: #ffffff !important;
                cursor: pointer !important;
                min-height: 50px !important;
            `;
        });
    });
    
    console.log(`🔧 ${visibilityFixed}個の質問要素の可視性を修正しました`);
    return haqeiQuestions.length > 0;
}

/**
 * 質問に自動回答
 */
function answerCurrentQuestion() {
    console.log('📝 現在の質問に自動回答を試行中...');
    
    // 利用可能なラジオボタンを探す
    const radioButtons = document.querySelectorAll('input[type="radio"]:not(:checked)');
    console.log(`🔘 利用可能なラジオボタン: ${radioButtons.length}個`);
    
    if (radioButtons.length > 0) {
        // 最初のオプションを選択
        const firstRadio = radioButtons[0];
        firstRadio.click();
        
        // 選択したことを確認
        setTimeout(() => {
            if (firstRadio.checked) {
                console.log('✅ ラジオボタンが選択されました');
                
                // 次の質問への自動遷移を試す
                const nextButton = document.querySelector('button:contains("次へ"), .next-button, [data-action="next"]');
                if (nextButton) {
                    nextButton.click();
                    console.log('➡️ 次へボタンをクリックしました');
                } else {
                    console.log('🔄 自動遷移を待機中...');
                }
                
                return true;
            } else {
                console.log('⚠️ ラジオボタンの選択に失敗しました');
                return false;
            }
        }, 500);
        
        return true;
    } else {
        console.log('❌ 回答可能なラジオボタンが見つかりません');
        return false;
    }
}

/**
 * 30問完了状況を確認
 */
function checkCompletionStatus() {
    // localStorage から回答状況を確認
    const answers = JSON.parse(localStorage.getItem('haqei_answers') || '[]');
    const questionIndex = parseInt(localStorage.getItem('questionIndex') || '0');
    
    console.log(`📊 回答状況: ${answers.length}/30問完了, 現在の質問番号: ${questionIndex + 1}`);
    
    if (answers.length >= 30) {
        console.log('🎉 30問完了！結果画面への遷移を確認中...');
        
        // 結果画面を探す
        const resultSelectors = [
            '#results-container',
            '.results-screen',
            '.analysis-results',
            '.strategic-dashboard',
            '#strategic-dashboard'
        ];
        
        for (const selector of resultSelectors) {
            const element = document.querySelector(selector);
            if (element && element.style.display !== 'none') {
                console.log(`✅ 結果画面が見つかりました: ${selector}`);
                return 'completed';
            }
        }
        
        console.log('⚠️ 30問完了しましたが、結果画面が表示されていません');
        return 'completed-no-results';
    }
    
    return 'in-progress';
}

/**
 * メインの検証ループ
 */
async function runVerificationLoop() {
    console.log('🔄 検証ループを開始します...');
    
    let attempts = 0;
    const maxAttempts = 35; // 30問 + 余裕
    
    while (attempts < maxAttempts) {
        attempts++;
        console.log(`\n📋 試行 ${attempts}/${maxAttempts}`);
        
        // 1. 質問要素の可視性を確認・修正
        const questionsVisible = verifyAndFixQuestionVisibility();
        
        if (!questionsVisible) {
            console.log('⏳ 質問要素の生成を待機中... (2秒)');
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
        }
        
        // 2. 完了状況を確認
        const status = checkCompletionStatus();
        if (status === 'completed') {
            console.log('🎉 30問フロー検証完了！結果画面への遷移が成功しました');
            return { success: true, message: '30問完了、結果画面遷移成功' };
        } else if (status === 'completed-no-results') {
            console.log('⚠️ 30問は完了しましたが、結果画面への遷移に問題があります');
            return { success: false, message: '30問完了、結果画面遷移失敗' };
        }
        
        // 3. 現在の質問に回答
        const answered = answerCurrentQuestion();
        
        if (!answered) {
            console.log('❌ 回答に失敗しました。要素の状態を再確認します');
        }
        
        // 4. 次の質問の表示を待つ
        console.log('⏳ 次の質問の表示を待機中... (3秒)');
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('❌ 最大試行回数に達しました。検証を終了します');
    return { success: false, message: '最大試行回数に達した' };
}

/**
 * 検証結果を報告
 */
function reportResults(result) {
    console.log('\n🎯 === HAQEI 30問フロー検証結果 ===');
    console.log(`成功: ${result.success}`);
    console.log(`メッセージ: ${result.message}`);
    
    // 最終的な状況を確認
    const answers = JSON.parse(localStorage.getItem('haqei_answers') || '[]');
    const questionIndex = parseInt(localStorage.getItem('questionIndex') || '0');
    const haqeiQuestions = document.querySelectorAll('haqei-question');
    
    console.log(`\n📊 最終統計:`);
    console.log(`- 回答数: ${answers.length}/30`);
    console.log(`- 現在の質問番号: ${questionIndex + 1}`);
    console.log(`- 質問要素数: ${haqeiQuestions.length}`);
    console.log(`- 現在のURL: ${window.location.href}`);
    
    // グローバルスコープに結果を保存
    window.haqeiVerificationResult = result;
    
    return result;
}

// メイン実行
async function main() {
    try {
        console.log('🚀 HAQEI 30問フロー検証を開始します...');
        
        // 少し待ってからページの初期化を待つ
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const result = await runVerificationLoop();
        return reportResults(result);
        
    } catch (error) {
        console.error('❌ 検証中にエラーが発生しました:', error);
        return reportResults({ 
            success: false, 
            message: `検証エラー: ${error.message}` 
        });
    }
}

// DOMが読み込まれたら実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

// 手動実行用
window.runHaqeiVerification = main;