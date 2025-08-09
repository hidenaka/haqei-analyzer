const puppeteer = require('puppeteer');

(async () => {
  console.log('🔧 Quick Fix Test - LocalStorage保存確認');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('save') || text.includes('Storage') || text.includes('Result')) {
      console.log('[CONSOLE]', text);
    }
  });
  
  try {
    await page.goto('http://localhost:3000/os_analyzer.html');
    
    // 分析開始
    await page.click('#start-analysis-btn');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 回答注入と分析実行
    const result = await page.evaluate(async () => {
      // 回答データ作成
      const answers = [];
      for (let i = 1; i <= 30; i++) {
        answers.push({
          questionId: `q${i}`,
          selectedValue: 'A',
          selectedChoice: `q${i}a`,
          choiceText: '選択肢A',
          timestamp: new Date().toISOString()
        });
      }
      
      localStorage.setItem('haqei_answers', JSON.stringify(answers));
      
      // 直接分析実行
      if (typeof proceedToAnalysis === 'function') {
        proceedToAnalysis(answers);
      }
      
      // 15秒待機
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // LocalStorageチェック
      const keys = ['haqei_analysis_result', 'haqei_simple_analysis_result'];
      const results = {};
      
      keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            results[key] = {
              exists: true,
              hasTripleOS: !!(parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS),
              size: data.length
            };
          } catch (e) {
            results[key] = { exists: true, error: 'parse error' };
          }
        } else {
          results[key] = { exists: false };
        }
      });
      
      return results;
    });
    
    console.log('\n📊 LocalStorage確認結果:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    setTimeout(() => browser.close(), 3000);
  }
})();