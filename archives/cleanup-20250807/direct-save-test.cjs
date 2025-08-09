const puppeteer = require('puppeteer');

(async () => {
  console.log('🔧 Direct Save Test - saveAnalysisResultを直接テスト');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.text()));
  
  try {
    await page.goto('http://localhost:3000/os_analyzer.html');
    await page.click('#start-analysis-btn');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = await page.evaluate(async () => {
      try {
        console.log('🧪 Direct save test starting...');
        
        // テスト用のTriple OSデータを作成
        const testTripleOSData = {
          analysisType: 'tripleOS',
          engineOS: {
            name: 'テストEngine OS',
            strength: 0.85,
            hexagramInfo: { name: '乾為天', number: 1 }
          },
          interfaceOS: {
            name: 'テストInterface OS', 
            strength: 0.75,
            hexagramInfo: { name: '坤為地', number: 2 }
          },
          safeModeOS: {
            name: 'テストSafeMode OS',
            strength: 0.65,
            hexagramInfo: { name: '水雷屯', number: 3 }
          },
          timestamp: new Date().toISOString()
        };
        
        console.log('📦 Test data created:', testTripleOSData);
        
        // StorageManagerの直接テスト
        if (window.app && window.app.storageManager) {
          console.log('💾 Testing app.storageManager.saveAnalysisResult...');
          const saveResult = window.app.storageManager.saveAnalysisResult(testTripleOSData);
          console.log('💾 Save result:', saveResult);
          
          // 保存確認
          const retrieved = window.app.storageManager.getAnalysisResult();
          console.log('📖 Retrieved data:', !!retrieved);
          
          if (retrieved) {
            console.log('✅ Direct save/retrieve successful');
          } else {
            console.log('❌ Direct save/retrieve failed');
          }
        } else {
          console.log('❌ app.storageManager not available');
        }
        
        // 直接localStorageテスト
        console.log('💾 Testing direct localStorage...');
        localStorage.setItem('haqei_analysis_result', JSON.stringify(testTripleOSData));
        const directCheck = localStorage.getItem('haqei_analysis_result');
        console.log('📖 Direct localStorage check:', !!directCheck);
        
        return {
          appStorageManagerExists: !!(window.app && window.app.storageManager),
          directLocalStorageWorks: !!directCheck
        };
        
      } catch (error) {
        console.error('❌ Test error:', error);
        return { error: error.message };
      }
    });
    
    console.log('\n📊 テスト結果:');
    console.log(JSON.stringify(result, null, 2));
    
    // 最終確認
    const finalCheck = await page.evaluate(() => {
      const data = localStorage.getItem('haqei_analysis_result');
      if (data) {
        const parsed = JSON.parse(data);
        return {
          exists: true,
          hasTripleOS: !!(parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS)
        };
      }
      return { exists: false };
    });
    
    console.log('\n📊 最終確認:', finalCheck);
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    setTimeout(() => browser.close(), 5000);
  }
})();