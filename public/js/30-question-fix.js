// 30問目分析開始ボタン修正スクリプト
// 目的: 複数の分析開始ボタン表示を防ぎ、既存の「次の質問」→「分析開始」変更のみを使用

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 30-question fix loaded');
  
  // VirtualQuestionFlow の showAnalysisButton メソッドを無効化
  if (window.VirtualQuestionFlow && window.VirtualQuestionFlow.prototype) {
    window.VirtualQuestionFlow.prototype.showAnalysisButton = function() {
      console.log('🚫 showAnalysisButton disabled - using existing next button transition');
      return;
    };
    console.log('✅ VirtualQuestionFlow.showAnalysisButton method disabled');
  }
  
  // 既存の分析開始ボタンコンテナがあれば削除
  function removeExtraAnalysisButtons() {
    const containers = document.querySelectorAll('.analysis-button-container');
    containers.forEach((container, index) => {
      if (index > 0) { // 最初以外は削除
        container.remove();
        console.log(`🗑️ Removed extra analysis button container ${index + 1}`);
      }
    });
  }
  
  // 定期的にチェック
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && 
              (node.classList?.contains('analysis-button-container') ||
               node.querySelector?.('.analysis-button-container'))) {
            removeExtraAnalysisButtons();
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('✅ 30-question fix monitoring started');
});