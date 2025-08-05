/**
 * HAQEI 30問完了フローテスト（簡易版）
 */

console.log('🚀 HAQEI 30問完了フローテスト開始');

// 基本的なテスト関数
function testQuestionFlow() {
  const results = {
    initialLoad: false,
    questionDisplay: false,
    dataStorage: false,
    completion: false,
    errors: []
  };

  try {
    // 1. 初期読み込み確認
    if (typeof window \!== 'undefined' && document.querySelector('#welcome-container')) {
      results.initialLoad = true;
      console.log('✅ 初期ページ読み込み確認');
    }

    // 2. 設問表示確認
    if (document.querySelector('.question-item, .haqei-question-element')) {
      results.questionDisplay = true;
      console.log('✅ 設問表示確認');
    }

    // 3. データストレージ確認
    const answers = JSON.parse(localStorage.getItem('haqei_answers') || '[]');
    if (answers.length > 0) {
      results.dataStorage = true;
      console.log(`✅ データストレージ確認: ${answers.length}問回答済み`);
    }

    // 4. 完了状態確認
    if (answers.length === 30) {
      results.completion = true;
      console.log('✅ 30問完了確認');
    }

  } catch (error) {
    results.errors.push(error.message);
    console.error('❌ テストエラー:', error);
  }

  return results;
}

// テスト実行
if (typeof window \!== 'undefined') {
  // ブラウザ環境での実行
  document.addEventListener('DOMContentLoaded', function() {
    const results = testQuestionFlow();
    console.log('📊 テスト結果:', results);
  });
} else {
  // Node.js環境での実行
  console.log('⚠️ ブラウザ環境が必要です');
}
EOF < /dev/null