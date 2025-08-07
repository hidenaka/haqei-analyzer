const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 OS Analyzer エラーログ確認開始');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  // すべてのログをキャッチ
  page.on('console', msg => {
    const text = msg.text();
    console.log('[CONSOLE]', text);
  });
  
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]', error.message);
  });
  
  page.on('requestfailed', request => {
    console.error('[REQUEST FAILED]', request.url());
  });
  
  try {
    console.log('📱 OS Analyzerにアクセス...');
    await page.goto('http://localhost:3000/os_analyzer.html', { 
      waitUntil: 'networkidle2',
      timeout: 10000 
    });
    
    console.log('🚀 分析開始ボタンクリック...');
    await page.waitForSelector('#start-analysis-btn', { visible: true });
    await page.click('#start-analysis-btn');
    
    console.log('⏳ 設問画面待機...');
    await page.waitForSelector('#questions-container', { visible: true });
    
    // 回答を直接注入
    console.log('💉 テスト回答を注入...');
    const injectionResult = await page.evaluate(() => {
      try {
        // 30問の回答作成
        const answers = [];
        for (let i = 1; i <= 30; i++) {
          answers.push({
            questionId: 'q' + i,
            selectedValue: 'A',
            selectedChoice: 'q' + i + 'a',
            choiceText: '選択肢A',
            timestamp: new Date().toISOString()
          });
        }
        
        // LocalStorageに保存
        localStorage.setItem('haqei_answers', JSON.stringify(answers));
        localStorage.setItem('haqei_session', JSON.stringify({
          currentQuestionIndex: 29,
          stage: 'analysis'
        }));
        
        console.log('回答データ注入完了:', answers.length + '問');
        
        // proceedToAnalysisを実行
        if (typeof proceedToAnalysis === 'function') {
          console.log('proceedToAnalysis実行中...');
          proceedToAnalysis(answers);
          return { success: true, message: 'Analysis started' };
        } else {
          return { success: false, message: 'proceedToAnalysis not found' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('💡 注入結果:', injectionResult);
    
    // エラーログ監視のため10秒待機
    console.log('⏰ エラーログ監視中...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 最終状態確認
    const finalCheck = await page.evaluate(() => {
      return {
        currentUrl: window.location.href,
        hasAnalysisResult: !!localStorage.getItem('haqei_analysis_result'),
        sessionStage: JSON.parse(localStorage.getItem('haqei_session') || '{}').stage,
        answersCount: JSON.parse(localStorage.getItem('haqei_answers') || '[]').length
      };
    });
    
    console.log('📊 最終確認:', finalCheck);
    
  } catch (error) {
    console.error('❌ テストエラー:', error.message);
  }
  
  console.log('✅ テスト完了');
  setTimeout(() => browser.close(), 3000);
})();