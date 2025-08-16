/**
 * 簡易悩み分析テスト
 */

const { chromium } = require('playwright');

async function testSimpleWorries() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8788/future_simulator.html');
  await page.waitForTimeout(3000);
  
  const testCases = [
    '上司との関係がうまくいかない',
    '彼氏が浮気しているかもしれない',
    '将来が不安で何をすればいいかわからない'
  ];
  
  for (const input of testCases) {
    console.log(`\n🔍 悩み: ${input}`);
    
    const result = await page.evaluate(async (text) => {
      if (typeof analyzeWorry === 'function') {
        await analyzeWorry(text);
        const integrated = window.integratedAnalysisResult;
        return {
          keywords: integrated?.keywords?.final?.slice(0, 3).map(k => k.word),
          emotion: integrated?.context?.emotionalContext,
          situation: integrated?.context?.situationalContext,
          hexagram: integrated?.iching?.hexagram?.name,
          interpretation: integrated?.iching?.interpretation?.substring(0, 60)
        };
      }
      return null;
    }, input);
    
    console.log(`キーワード: ${result?.keywords?.join(', ') || '未検出'}`);
    console.log(`感情分析: ${result?.emotion || '未検出'}`);
    console.log(`状況分析: ${result?.situation || '未検出'}`);
    console.log(`易経: ${result?.hexagram || '未取得'}`);
    console.log(`解釈: ${result?.interpretation || '未取得'}...`);
  }
  
  await browser.close();
}

testSimpleWorries().catch(console.error);