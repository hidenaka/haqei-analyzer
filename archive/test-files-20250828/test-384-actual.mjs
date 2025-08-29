import { chromium } from 'playwright';

(async () => {
  console.log('=== 384爻システム実動作確認 ===\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Load the actual test page
    await page.goto('http://localhost:8089/test-384-browser.html', {
      waitUntil: 'networkidle'
    });
    
    // Run distribution test via button click
    await page.click('button:has-text("分布テスト")');
    
    // Wait for test completion
    await page.waitForTimeout(5000);
    
    // Get the results
    const results = await page.evaluate(() => {
      const output = document.getElementById('output').textContent;
      return output;
    });
    
    console.log(results);
    
    // Parse specific metrics
    const coverageMatch = results.match(/カバー率: ([\d.]+)%/);
    const fiveYaoMatch = results.match(/5爻: (\d+) \(([\d.]+)%\)/);
    
    if (coverageMatch) {
      const coverage = parseFloat(coverageMatch[1]);
      console.log(`\n📊 カバー率: ${coverage}%`);
      if (coverage < 10) {
        console.log('❌ カバー率が目標(10%)未満です');
      }
    }
    
    if (fiveYaoMatch) {
      const fiveYaoCount = parseInt(fiveYaoMatch[1]);
      const fiveYaoPercent = parseFloat(fiveYaoMatch[2]);
      console.log(`📊 5爻選択率: ${fiveYaoPercent}% (${fiveYaoCount}回)`);
    } else if (results.includes('5爻が一度も選ばれていません')) {
      console.log('❌ 5爻が0%です！');
    }
    
  } catch (error) {
    console.error('エラー:', error.message);
  } finally {
    await browser.close();
  }
})();