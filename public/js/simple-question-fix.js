// Simple Question Fix - 設問表示の最小限修正
// 目的: questions-containerを表示させるだけの簡単な修正

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Simple Question Fix loaded');
  
  // 開始ボタンのクリックイベントを監視
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    // 開始ボタンかどうかをチェック
    if (target && (
      target.id === 'start-analysis-btn' || 
      target.textContent?.includes('分析を開始') ||
      target.textContent?.includes('開始')
    )) {
      console.log('🚀 Start button clicked, showing questions container');
      
      // questions-containerを表示
      const questionsContainer = document.getElementById('questions-container');
      if (questionsContainer) {
        questionsContainer.style.display = 'block';
        questionsContainer.style.opacity = '1';
        questionsContainer.style.visibility = 'visible';
        console.log('✅ Questions container made visible');
      }
      
      // welcome-containerを隠す
      const welcomeContainer = document.getElementById('welcome-container');
      if (welcomeContainer) {
        welcomeContainer.style.display = 'none';
        console.log('👋 Welcome container hidden');
      }
    }
  });
});