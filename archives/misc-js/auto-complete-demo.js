// 自動診断完了スクリプト（デモ用）
(function() {
    console.log('🎯 HaQei OS Analyzer 自動診断デモ開始');
    
    let currentQuestion = 1;
    const totalQuestions = 30;
    
    function clickRandomAnswer() {
        // 1-5の選択肢からランダムに選択
        const randomChoice = Math.floor(Math.random() * 5) + 1;
        const options = document.querySelectorAll('.option-card');
        
        if (options.length > 0 && options[randomChoice - 1]) {
            console.log(`質問${currentQuestion}: 選択肢${randomChoice}を選択`);
            options[randomChoice - 1].click();
            
            // 次へボタンをクリック
            setTimeout(() => {
                const nextBtn = document.querySelector('#next-btn, .next-btn, button[data-action="next"]');
                if (nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                    currentQuestion++;
                    
                    // 次の質問まで少し待機
                    if (currentQuestion <= totalQuestions) {
                        setTimeout(clickRandomAnswer, 800);
                    } else {
                        console.log('🎉 30問診断完了！結果を待機中...');
                        // 結果画面の表示を待つ
                        setTimeout(() => {
                            console.log('✅ デモ完了：個別化された結果が表示されました');
                        }, 3000);
                    }
                } else {
                    // 次へボタンが見つからない場合、少し待ってリトライ
                    setTimeout(clickRandomAnswer, 500);
                }
            }, 300);
        } else {
            // 選択肢が見つからない場合、少し待ってリトライ
            setTimeout(clickRandomAnswer, 500);
        }
    }
    
    // 最初の質問から開始（既に1問目を手動で選択済みなので2問目から）
    currentQuestion = 2;
    setTimeout(clickRandomAnswer, 1000);
})();