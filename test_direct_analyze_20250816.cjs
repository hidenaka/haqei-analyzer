/**
 * analyzeWorry関数を直接呼び出してテスト
 */

const { chromium } = require('playwright');

async function testDirectAnalyze() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールログを監視
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Dynamic hexagram') || text.includes('Using') || text.includes('分析') || text.includes('selected')) {
      console.log(`📝 ${text}`);
    }
  });
  
  await page.goto('http://localhost:8788/future_simulator.html');
  await page.waitForTimeout(3000);
  
  const testCases = [
    '新しい仕事に転職を考えています',
    '恋愛関係で悩んでいます',
    '健康について心配があります'
  ];
  
  const results = [];
  
  for (const input of testCases) {
    console.log(`\n🔍 テスト: ${input}`);
    
    // analyzeWorryを直接呼び出し
    const result = await page.evaluate(async (text) => {
      // analyzeWorry関数が存在するか確認
      if (typeof analyzeWorry === 'function') {
        await analyzeWorry(text);
        return window.integratedAnalysisResult?.iching;
      } else {
        return { error: 'analyzeWorry not found' };
      }
    }, input);
    
    results.push({ input, result });
    console.log(`結果:`, {
      hexagram: result?.hexagram?.name,
      number: result?.hexagram?.number,
      method: result?.hexagram?.method || result?.method,
      fallback: result?.fallback
    });
    
    await page.waitForTimeout(2000);
  }
  
  // 結果分析
  const hexagrams = results.map(r => r.result?.hexagram?.name).filter(Boolean);
  const numbers = results.map(r => r.result?.hexagram?.number).filter(Boolean);
  const uniqueHexagrams = new Set(hexagrams);
  const uniqueNumbers = new Set(numbers);
  
  console.log(`\n📊 結果分析:`);
  console.log(`異なる卦名の数: ${uniqueHexagrams.size}/${results.length}`);
  console.log(`異なる卦番号の数: ${uniqueNumbers.size}/${results.length}`);
  console.log(`卦名: ${[...uniqueHexagrams].join(', ')}`);
  console.log(`卦番号: ${[...uniqueNumbers].join(', ')}`);
  
  if (uniqueHexagrams.size === 1 && uniqueNumbers.size === 1) {
    console.log('❌ 固定結果 - 動的マッピング失敗');
  } else {
    console.log('✅ 動的結果 - マッピング成功！');
  }
  
  await browser.close();
}

testDirectAnalyze().catch(console.error);