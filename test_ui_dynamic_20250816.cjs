/**
 * UI経由での動的結果テスト
 */

const { chromium } = require('playwright');

async function testUIDynamic() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールログを監視
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('分析') || text.includes('Dynamic') || text.includes('mapping') || text.includes('結果')) {
      console.log(`📝 ${text}`);
    }
  });
  
  const testCases = [
    '仕事で成功したい',
    '恋愛で幸せになりたい',
    '健康を維持したい'
  ];
  
  const results = [];
  
  for (const input of testCases) {
    console.log(`\n🔍 テスト: ${input}`);
    
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForTimeout(3000);
    
    // 入力フィールドを探す
    const textarea = await page.$('textarea[placeholder*="あなたの悩み"], #worryInput');
    if (!textarea) {
      console.log('❌ 入力フィールドが見つかりません');
      continue;
    }
    
    // テキストを入力（typeを使用）
    await textarea.click();
    await textarea.type(input, { delay: 50 });
    
    // ボタンが有効になるまで待つ
    await page.waitForFunction(() => {
      const btn = document.querySelector('#aiGuessBtn');
      return btn && !btn.disabled;
    }, { timeout: 5000 }).catch(() => {
      console.log('⚠️ ボタンが有効になりませんでした');
    });
    
    // 分析ボタンをクリック
    const button = await page.$('#aiGuessBtn:not([disabled])');
    if (button) {
      await button.click();
      console.log('✅ 分析ボタンをクリック');
    } else {
      console.log('❌ 有効な分析ボタンが見つかりません');
      continue;
    }
    
    // 結果を待つ
    await page.waitForTimeout(5000);
    
    // 結果を取得
    const result = await page.evaluate(() => {
      const integrated = window.integratedAnalysisResult;
      if (integrated?.iching) {
        return {
          hexagram: integrated.iching.hexagram?.name,
          number: integrated.iching.hexagram?.number,
          yao: integrated.iching.yao?.name,
          position: integrated.iching.yao?.position,
          keywords: integrated.iching.keywords,
          interpretation: integrated.iching.interpretation?.substring(0, 50),
          method: integrated.iching.method
        };
      }
      return null;
    });
    
    results.push({ input, result });
    console.log(`結果:`, result);
  }
  
  // 結果分析
  const hexagrams = results.map(r => r.result?.hexagram).filter(Boolean);
  const uniqueHexagrams = new Set(hexagrams);
  
  console.log(`\n📊 結果分析:`);
  console.log(`異なる卦の数: ${uniqueHexagrams.size}/${results.length}`);
  console.log(`卦のリスト:`, [...uniqueHexagrams]);
  
  results.forEach(r => {
    if (r.result) {
      console.log(`\n📍 ${r.input}:`);
      console.log(`  卦: ${r.result.hexagram} (${r.result.number}番) - ${r.result.yao}`);
      console.log(`  キーワード: ${r.result.keywords?.join(', ') || 'なし'}`);
      console.log(`  解釈: ${r.result.interpretation || 'なし'}...`);
    }
  });
  
  if (uniqueHexagrams.size === 1) {
    console.log('\n❌ 全て同じ卦 - 動的マッピング失敗');
  } else {
    console.log('\n✅ 異なる卦が生成 - 動的マッピング成功！');
  }
  
  await browser.close();
}

testUIDynamic().catch(console.error);