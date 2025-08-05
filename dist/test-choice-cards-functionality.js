// Future Simulator 分析サマリー切り替わり機能テストスクリプト
// 2025-08-04 - 修正後の動作確認用

console.log('🧪 Future Simulator 分析サマリー切り替わり機能テスト開始');

// DOM要素の存在確認
function checkDOMElements() {
  const elements = {
    choiceCardShin: document.getElementById('choiceCardShin'),
    choiceCardHen: document.getElementById('choiceCardHen'),
    summaryContent: document.getElementById('summary-content'),
    summaryCard: document.getElementById('summaryCard')
  };
  
  console.log('📋 DOM要素確認結果:', elements);
  
  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      console.log(`✅ ${name}: 存在`);
    } else {
      console.log(`❌ ${name}: 見つかりません`);
    }
  });
  
  return elements;
}

// イベントハンドラーの動作確認
function testEventHandlers() {
  const elements = checkDOMElements();
  
  if (!elements.choiceCardShin || !elements.choiceCardHen) {
    console.log('❌ 選択カードが見つからないため、テストを中止します');
    return;
  }
  
  console.log('🎯 イベントハンドラーテスト開始');
  
  // 進カードのテスト
  console.log('📊 「進」カードのhoverテスト');
  elements.choiceCardShin.dispatchEvent(new Event('mouseover'));
  
  setTimeout(() => {
    // サマリー内容の確認
    const summaryContent = elements.summaryContent?.innerHTML;
    if (summaryContent && summaryContent.includes('進')) {
      console.log('✅ 「進」カード hover: サマリー更新成功');
    } else {
      console.log('❌ 「進」カード hover: サマリー更新失敗');
      console.log('現在のサマリー内容:', summaryContent);
    }
    
    // mouseleave テスト
    elements.choiceCardShin.dispatchEvent(new Event('mouseleave'));
    
    setTimeout(() => {
      console.log('📊 「変」カードのhoverテスト');
      elements.choiceCardHen.dispatchEvent(new Event('mouseover'));
      
      setTimeout(() => {
        const summaryContent2 = elements.summaryContent?.innerHTML;
        if (summaryContent2 && summaryContent2.includes('変')) {
          console.log('✅ 「変」カード hover: サマリー更新成功');
        } else {
          console.log('❌ 「変」カード hover: サマリー更新失敗');
          console.log('現在のサマリー内容:', summaryContent2);
        }
        
        // mouseleave テスト
        elements.choiceCardHen.dispatchEvent(new Event('mouseleave'));
        
        setTimeout(() => {
          console.log('🏁 テスト完了');
        }, 500);
      }, 500);
    }, 500);
  }, 500);
}

// 関数の存在確認
function checkFunctions() {
  console.log('🔍 実装された関数の確認');
  
  const functions = [
    'updateAnalysisSummary',
    'generateChoiceSummary', 
    'resetAnalysisSummary'
  ];
  
  functions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`✅ ${funcName}: 定義済み`);
    } else {
      console.log(`❌ ${funcName}: 未定義`);
    }
  });
}

// CSS境界色の確認
function checkBorderStyles() {
  const summaryCard = document.getElementById('summaryCard');
  if (!summaryCard) {
    console.log('❌ summaryCard要素が見つかりません');
    return;
  }
  
  console.log('🎨 境界色テスト');
  
  // teal境界色テスト
  summaryCard.classList.add('border-teal-500/50');
  const computedStyle1 = window.getComputedStyle(summaryCard);
  console.log('📘 Teal境界色適用後:', computedStyle1.borderColor);
  
  // purple境界色テスト
  summaryCard.classList.remove('border-teal-500/50');
  summaryCard.classList.add('border-purple-500/50');
  const computedStyle2 = window.getComputedStyle(summaryCard);
  console.log('📜 Purple境界色適用後:', computedStyle2.borderColor);
  
  // リセット
  summaryCard.classList.remove('border-purple-500/50');
}

// メイン実行
function runTests() {
  console.log('🚀 テスト実行開始 - 2025-08-04');
  
  // ページ読み込み完了を待機
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runTests, 1000);
    });
    return;
  }
  
  try {
    checkDOMElements();
    checkFunctions();
    checkBorderStyles();
    
    // 実際のイベントテストは分析が完了してから実行
    if (typeof currentAnalysisData !== 'undefined' && currentAnalysisData) {
      testEventHandlers();
    } else {
      console.log('⏳ 分析データの読み込み待機中...');
      // 分析完了後に再試行
      setTimeout(() => {
        if (typeof currentAnalysisData !== 'undefined' && currentAnalysisData) {
          testEventHandlers();
        } else {
          console.log('❌ 分析データが利用できません');
        }
      }, 3000);
    }
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
  }
}

// 自動実行
runTests();