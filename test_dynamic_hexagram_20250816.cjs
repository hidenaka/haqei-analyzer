/**
 * 動的易経マッピングテスト
 * 異なる入力で異なる結果が出るか確認
 */

const { chromium } = require('playwright');

async function testDynamicHexagram() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールログを詳細に出力
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('I Ching') || text.includes('Hexagram') || text.includes('Dynamic') || text.includes('卦')) {
      console.log(`📝 ${text}`);
    }
  });
  
  const testCases = [
    { input: '仕事で成功したい', expected: '仕事関連の卦' },
    { input: '恋愛で悩んでいる', expected: '恋愛関連の卦' },
    { input: '健康が心配', expected: '健康関連の卦' }
  ];
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 テスト: ${testCase.input}`);
    
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // テキスト入力
    await page.fill('#worryInput, textarea', testCase.input);
    
    // 分析実行
    await page.click('#aiGuessBtn, button:has-text("分析")');
    await page.waitForTimeout(5000);
    
    // 結果取得
    const result = await page.evaluate(() => {
      const integrated = window.integratedAnalysisResult;
      return {
        hexagram: integrated?.iching?.hexagram,
        yao: integrated?.iching?.yao,
        method: integrated?.iching?.method,
        fallback: integrated?.iching?.fallback,
        error: integrated?.iching?.error
      };
    });
    
    results.push({ input: testCase.input, result });
    console.log(`結果:`, result);
  }
  
  // 結果の多様性を確認
  const hexagrams = results.map(r => r.result?.hexagram?.name).filter(Boolean);
  const uniqueHexagrams = new Set(hexagrams);
  
  console.log(`\n📊 結果分析:`);
  console.log(`異なる卦の数: ${uniqueHexagrams.size}/${results.length}`);
  console.log(`卦のリスト:`, [...uniqueHexagrams].join(', '));
  
  if (uniqueHexagrams.size === 1) {
    console.log('❌ 全て同じ卦 - 固定結果のまま');
  } else {
    console.log('✅ 異なる卦が生成 - 動的マッピング成功');
  }
  
  await browser.close();
}

testDynamicHexagram().catch(console.error);