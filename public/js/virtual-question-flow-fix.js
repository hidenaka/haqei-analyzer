// VirtualQuestionFlow修正スクリプト
// 目的: showAnalysisButtonメソッドの無効化とonComplete呼び出し修正

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 VirtualQuestionFlow fix loaded');
  
  // VirtualQuestionFlowクラスが読み込まれるまで待機
  function waitForVirtualQuestionFlow() {
    if (typeof VirtualQuestionFlow !== 'undefined') {
      console.log('✅ VirtualQuestionFlow class found, applying fixes');
      
      // showAnalysisButtonメソッドを無効化
      VirtualQuestionFlow.prototype.showAnalysisButton = function() {
        console.log('🚫 showAnalysisButton disabled - using existing next button transition');
        return;
      };
      
      // 30問目の分析開始処理を修正
      const originalBindEvents = VirtualQuestionFlow.prototype.bindEvents;
      VirtualQuestionFlow.prototype.bindEvents = function() {
        // 元のbindEventsを実行
        if (originalBindEvents) {
          originalBindEvents.call(this);
        }
        
        // 次のボタンのクリック処理を修正
        const nextBtn = this.container.querySelector('.navigation-controls .nav-button:last-child');
        if (nextBtn) {
          // 既存のイベントリスナーを削除
          const newNextBtn = nextBtn.cloneNode(true);
          nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
          
          // 新しいイベントリスナーを追加
          newNextBtn.addEventListener('click', () => {
            const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
            
            if (isLastQuestion) {
              // 最後の設問の場合、すべての質問が回答されているか確認
              const completedCount = this.getCompletedCount ? this.getCompletedCount() : this.answers.length;
              console.log(`🔍 Analyze button clicked. Completed: ${completedCount}/${this.questions.length}`);
              
              if (completedCount === this.questions.length) {
                console.log('✅ All questions answered - starting analysis');
                // 分析を開始 - 正しい完了処理を呼ぶ
                if (this.onComplete) {
                  console.log('🎉 Calling onComplete callback for analysis');
                  this.onComplete(this.answers);
                } else {
                  console.error('❌ onComplete callback not defined');
                }
              } else {
                console.warn('⚠️ Not all questions answered yet');
              }
            } else {
              // 通常の次へ処理
              if (this.goToNext) {
                this.goToNext();
              }
            }
          });
        }
      };
      
      console.log('✅ VirtualQuestionFlow fixes applied');
    } else {
      console.log('⏳ Waiting for VirtualQuestionFlow to load...');
      setTimeout(waitForVirtualQuestionFlow, 100);
    }
  }
  
  // 少し遅延させて確実にクラスが読み込まれてから実行
  setTimeout(waitForVirtualQuestionFlow, 500);
});