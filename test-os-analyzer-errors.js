const { spawn } = require('child_process');
const fs = require('fs');

// OS Analyzerのエラーログを確認
console.log('🔍 OS Analyzer エラーログ確認開始');

// puppeteerでブラウザを起動して実際にテスト
const testOSAnalyzer = `
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // エラーとコンソールログをキャッチ
  page.on('console', msg => console.log('[CONSOLE]', msg.text()));
  page.on('pageerror', error => console.error('[PAGE ERROR]', error.message));
  page.on('requestfailed', request => console.error('[REQUEST FAILED]', request.url()));
  
  try {
    console.log('📱 OS Analyzerにアクセス中...');
    await page.goto('http://localhost:3000/os_analyzer.html', { waitUntil: 'networkidle2' });
    
    console.log('🚀 分析開始ボタンをクリック...');
    await page.waitForSelector('#start-analysis-btn', { visible: true });
    await page.click('#start-analysis-btn');
    
    console.log('⏳ 設問画面を待機...');
    await page.waitForSelector('#questions-container', { visible: true });
    
    // 回答データを直接注入して分析を強制実行
    console.log('💉 回答データを注入して分析実行...');
    const result = await page.evaluate(() => {
      // 30問の回答を作成
      const answers = [];
      for (let i = 1; i <= 30; i++) {
        answers.push({
          questionId: \`q\${i}\`,
          selectedValue: 'A',
          selectedChoice: \`q\${i}a\`,
          choiceText: '選択肢A',
          timestamp: new Date().toISOString()
        });
      }
      
      // LocalStorageに保存
      localStorage.setItem('haqei_answers', JSON.stringify(answers));
      
      // セッション更新
      localStorage.setItem('haqei_session', JSON.stringify({
        currentQuestionIndex: 29,
        stage: 'analysis'
      }));
      
      // proceedToAnalysisを呼び出し
      if (typeof proceedToAnalysis === 'function') {
        console.log('🎯 proceedToAnalysis実行中...');
        proceedToAnalysis(answers);
        return { success: true, message: 'proceedToAnalysis実行' };
      } else {
        return { success: false, message: 'proceedToAnalysis関数が見つからない' };
      }
    });
    
    console.log('💡 注入結果:', result);
    
    // 10秒待機してエラーを確認
    console.log('⏰ 10秒間エラーログを監視...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // LocalStorageの最終状態を確認
    const finalState = await page.evaluate(() => {
      return {
        answers: localStorage.getItem('haqei_answers') ? 'あり' : 'なし',
        analysisResult: localStorage.getItem('haqei_analysis_result') ? 'あり' : 'なし',
        session: localStorage.getItem('haqei_session') ? JSON.parse(localStorage.getItem('haqei_session')) : 'なし',
        currentUrl: window.location.href
      };
    });
    
    console.log('📊 最終状態:', finalState);
    
  } catch (error) {
    console.error('❌ テストエラー:', error.message);
  }
  
  console.log('✅ テスト完了 - ブラウザは5秒後に閉じます');
  setTimeout(() => browser.close(), 5000);
})();
`;

// テストスクリプトを一時ファイルに保存
fs.writeFileSync('/tmp/test-os-analyzer.js', testOSAnalyzer);

// puppeteerテストを実行
const child = spawn('node', ['/tmp/test-os-analyzer.js'], {
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log(`\nテスト終了 (exit code: ${code})`);
  // 一時ファイルを削除
  fs.unlinkSync('/tmp/test-os-analyzer.js');
});