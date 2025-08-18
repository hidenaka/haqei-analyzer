/**
 * 改善されたUI経由での動的結果テスト
 */

const { chromium } = require('playwright');

async function testUIImproved() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const testCases = [
    '新しい仕事に転職を考えています',
    '恋愛関係で幸せになりたいです',
    '健康を維持して長生きしたい'
  ];
  
  const results = [];
  
  for (const input of testCases) {
    console.log(`\n🔍 テスト: ${input}`);
    
    // 毎回新しくページを読み込む
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForTimeout(3000);
    
    // 入力フィールドを探して入力
    const textarea = await page.$('textarea#worryInput');
    if (!textarea) {
      console.log('❌ 入力フィールドが見つかりません');
      continue;
    }
    
    // フィールドをクリアしてから入力
    await textarea.click({ clickCount: 3 }); // 全選択
    await page.keyboard.press('Backspace');
    await textarea.fill(input);
    
    // ボタンの状態を確認
    const buttonState = await page.evaluate(() => {
      const btn = document.getElementById('aiGuessBtn');
      return {
        disabled: btn?.disabled,
        text: btn?.textContent?.trim()
      };
    });
    console.log(`入力後のボタン状態: disabled=${buttonState.disabled}, text="${buttonState.text}"`);
    
    // ボタンが有効になるまで少し待つ
    await page.waitForTimeout(500);
    
    // 再度ボタン状態を確認
    const buttonState2 = await page.evaluate(() => {
      const btn = document.getElementById('aiGuessBtn');
      return {
        disabled: btn?.disabled,
        hasDisabledAttr: btn?.hasAttribute('disabled')
      };
    });
    console.log(`待機後のボタン状態: disabled=${buttonState2.disabled}, hasAttribute=${buttonState2.hasDisabledAttr}`);
    
    // ボタンをクリック試行
    try {
      // forceクリックを使用
      await page.click('#aiGuessBtn', { force: true });
      console.log('✅ 分析ボタンをクリック（force）');
      
      // 分析完了を待つ
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
            method: integrated.iching.method
          };
        }
        return null;
      });
      
      results.push({ input, result });
      console.log(`結果:`, result);
      
    } catch (e) {
      console.log('❌ ボタンクリック失敗:', e.message);
      // JavaScriptで直接実行
      console.log('📝 JavaScript経由で分析実行...');
      await page.evaluate((text) => {
        if (typeof analyzeWorry === 'function') {
          analyzeWorry(text);
        }
      }, input);
      
      await page.waitForTimeout(5000);
      
      const result = await page.evaluate(() => {
        const integrated = window.integratedAnalysisResult;
        if (integrated?.iching) {
          return {
            hexagram: integrated.iching.hexagram?.name,
            number: integrated.iching.hexagram?.number,
            yao: integrated.iching.yao?.name,
            position: integrated.iching.yao?.position,
            keywords: integrated.iching.keywords,
            method: integrated.iching.method
          };
        }
        return null;
      });
      
      results.push({ input, result });
      console.log(`結果（JS経由）:`, result);
    }
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
    }
  });
  
  if (uniqueHexagrams.size === 1) {
    console.log('\n❌ 全て同じ卦 - 動的マッピング失敗');
  } else {
    console.log('\n✅ 異なる卦が生成 - 動的マッピング成功！');
  }
  
  await browser.close();
}

testUIImproved().catch(console.error);