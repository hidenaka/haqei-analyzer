// Screen Transition Fix - 画面遷移時のレイアウト修正
// 目的: ウェルカム画面→設問画面の切り替えを正常化

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Screen Transition Fix loaded');
  
  // 画面遷移を監視
  const welcomeContainer = document.getElementById('welcome-container');
  const questionsContainer = document.getElementById('questions-container');
  
  // 設問画面表示時の処理
  function showQuestionsScreen() {
    console.log('📝 Showing questions screen...');
    
    // ウェルカム画面を完全に隠す
    if (welcomeContainer) {
      welcomeContainer.style.setProperty('display', 'none', 'important');
      welcomeContainer.style.setProperty('position', 'absolute', 'important');
      welcomeContainer.style.setProperty('top', '-9999px', 'important');
      welcomeContainer.style.setProperty('left', '-9999px', 'important');
      welcomeContainer.style.setProperty('opacity', '0', 'important');
      welcomeContainer.style.setProperty('visibility', 'hidden', 'important');
      welcomeContainer.style.setProperty('pointer-events', 'none', 'important');
      welcomeContainer.style.setProperty('z-index', '-1', 'important');
    }
    
    // 設問画面を表示
    if (questionsContainer) {
      questionsContainer.style.removeProperty('display');
      questionsContainer.style.removeProperty('position');
      questionsContainer.style.removeProperty('top');
      questionsContainer.style.removeProperty('left');
      questionsContainer.style.removeProperty('width');
      questionsContainer.style.removeProperty('height');
      questionsContainer.style.removeProperty('opacity');
      questionsContainer.style.removeProperty('visibility');
      questionsContainer.style.removeProperty('pointer-events');
      questionsContainer.style.removeProperty('z-index');
      
      questionsContainer.style.setProperty('display', 'flex', 'important');
      questionsContainer.style.setProperty('position', 'fixed', 'important');
      questionsContainer.style.setProperty('top', '0', 'important');
      questionsContainer.style.setProperty('left', '0', 'important');
      questionsContainer.style.setProperty('width', '100vw', 'important');
      questionsContainer.style.setProperty('height', '100vh', 'important');
      questionsContainer.style.setProperty('opacity', '1', 'important');
      questionsContainer.style.setProperty('visibility', 'visible', 'important');
      questionsContainer.style.setProperty('z-index', '1000', 'important');
    }
    
    // bodyスタイルを調整
    document.body.style.setProperty('overflow', 'hidden', 'important');
    
    console.log('✅ Questions screen displayed');
  }
  
  // ウェルカム画面表示時の処理
  function showWelcomeScreen() {
    console.log('👋 Showing welcome screen...');
    
    // 設問画面を完全に隠す
    if (questionsContainer) {
      questionsContainer.style.setProperty('display', 'none', 'important');
      questionsContainer.style.setProperty('position', 'absolute', 'important');
      questionsContainer.style.setProperty('top', '-9999px', 'important');
      questionsContainer.style.setProperty('left', '-9999px', 'important');
      questionsContainer.style.setProperty('opacity', '0', 'important');
      questionsContainer.style.setProperty('visibility', 'hidden', 'important');
      questionsContainer.style.setProperty('pointer-events', 'none', 'important');
      questionsContainer.style.setProperty('z-index', '-1', 'important');
    }
    
    // ウェルカム画面を表示
    if (welcomeContainer) {
      welcomeContainer.style.removeProperty('display');
      welcomeContainer.style.removeProperty('position');
      welcomeContainer.style.removeProperty('top');
      welcomeContainer.style.removeProperty('left');
      welcomeContainer.style.removeProperty('opacity');
      welcomeContainer.style.removeProperty('visibility');
      welcomeContainer.style.removeProperty('pointer-events');
      welcomeContainer.style.removeProperty('z-index');
      
      welcomeContainer.style.setProperty('display', 'flex', 'important');
      welcomeContainer.style.setProperty('position', 'fixed', 'important');
      welcomeContainer.style.setProperty('top', '0', 'important');
      welcomeContainer.style.setProperty('left', '0', 'important');
      welcomeContainer.style.setProperty('width', '100vw', 'important');
      welcomeContainer.style.setProperty('height', '100vh', 'important');
      welcomeContainer.style.setProperty('opacity', '1', 'important');
      welcomeContainer.style.setProperty('visibility', 'visible', 'important');
      welcomeContainer.style.setProperty('z-index', '1000', 'important');
    }
    
    console.log('✅ Welcome screen displayed');
  }
  
  // 開始ボタンのクリックを監視
  document.addEventListener('click', function(event) {
    if (event.target && (
      event.target.id === 'start-analysis-btn' ||
      event.target.textContent?.includes('分析を開始') ||
      event.target.textContent?.includes('開始')
    )) {
      console.log('🚀 Start button clicked - transitioning to questions');
      setTimeout(showQuestionsScreen, 100);
    }
  });
  
  // 初期状態でウェルカム画面を確実に表示
  setTimeout(showWelcomeScreen, 100);
  
  // グローバル関数として公開
  window.showQuestionsScreen = showQuestionsScreen;
  window.showWelcomeScreen = showWelcomeScreen;
  
  console.log('✅ Screen transition fix ready');
});