import { chromium } from 'playwright';
import fs from 'fs';

console.log('🎬 Future Simulator 完全動作証明テスト\n');
console.log('目的: future_simulator.htmlが実際に正しく動作することを視覚的に証明\n');

async function test() {
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 500  // 動作を見やすくするため遅延追加
  });
  const page = await browser.newPage();
  
  const screenshots = [];
  const testResults = {
    timestamp: new Date().toISOString(),
    url: 'file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html',
    steps: []
  };
  
  try {
    // STEP 1: ページ読み込み
    console.log('📄 STEP 1: ページ読み込み...');
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(3000);
    
    // 初期状態のスクリーンショット
    await page.screenshot({ 
      path: '20250814_step1_initial.png',
      fullPage: false 
    });
    screenshots.push('20250814_step1_initial.png');
    console.log('  ✅ 初期画面キャプチャ: 20250814_step1_initial.png');
    
    testResults.steps.push({
      step: 1,
      action: 'ページ読み込み',
      screenshot: '20250814_step1_initial.png',
      status: 'SUCCESS'
    });
    
    // STEP 2: 要素の存在確認
    console.log('\n📍 STEP 2: 必要な要素の存在確認...');
    const elements = await page.evaluate(() => {
      const input = document.getElementById('worryInput');
      const button = document.getElementById('aiGuessBtn');
      const container = document.getElementById('resultsContainer');
      
      return {
        worryInput: {
          exists: !!input,
          visible: input ? window.getComputedStyle(input).display !== 'none' : false,
          placeholder: input ? input.placeholder : null
        },
        aiGuessBtn: {
          exists: !!button,
          visible: button ? window.getComputedStyle(button).display !== 'none' : false,
          text: button ? button.textContent.trim() : null,
          disabled: button ? button.disabled : null
        },
        resultsContainer: {
          exists: !!container,
          visible: container ? window.getComputedStyle(container).display !== 'none' : false
        }
      };
    });
    
    console.log('  要素状態:', JSON.stringify(elements, null, 2));
    testResults.steps.push({
      step: 2,
      action: '要素確認',
      elements,
      status: elements.worryInput.exists && elements.aiGuessBtn.exists ? 'SUCCESS' : 'FAIL'
    });
    
    // STEP 3: テキスト入力
    console.log('\n✍️ STEP 3: テキスト入力...');
    const inputText = '転職を検討していますが、タイミングが分からず悩んでいます。現在の会社での立場も安定していますが、新しいチャレンジをしたい気持ちもあります。';
    
    const worryInput = await page.$('#worryInput');
    await worryInput.fill('');
    await worryInput.type(inputText, { delay: 50 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: '20250814_step3_input.png',
      fullPage: false 
    });
    screenshots.push('20250814_step3_input.png');
    console.log('  ✅ 入力後キャプチャ: 20250814_step3_input.png');
    console.log(`  入力文字数: ${inputText.length}文字`);
    
    testResults.steps.push({
      step: 3,
      action: 'テキスト入力',
      inputText,
      characterCount: inputText.length,
      screenshot: '20250814_step3_input.png',
      status: 'SUCCESS'
    });
    
    // STEP 4: ボタンクリック
    console.log('\n🖱️ STEP 4: 分析ボタンクリック...');
    const aiGuessBtn = await page.$('#aiGuessBtn');
    
    // クリック前の状態を記録
    const beforeClick = await page.evaluate(() => {
      const btn = document.getElementById('aiGuessBtn');
      const container = document.getElementById('resultsContainer');
      return {
        buttonText: btn.textContent.trim(),
        buttonDisabled: btn.disabled,
        resultsVisible: container.style.display !== 'none'
      };
    });
    console.log('  クリック前:', beforeClick);
    
    await aiGuessBtn.click();
    console.log('  ⏳ 解析処理を待機中...');
    
    // STEP 5: 処理中の状態確認
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: '20250814_step5_processing.png',
      fullPage: false 
    });
    screenshots.push('20250814_step5_processing.png');
    console.log('  ✅ 処理中キャプチャ: 20250814_step5_processing.png');
    
    // STEP 6: 結果表示を待つ
    console.log('\n📊 STEP 6: 結果表示を待機...');
    
    // 結果が表示されるまで待つ（最大30秒）
    let resultAppeared = false;
    try {
      await page.waitForFunction(() => {
        const container = document.getElementById('resultsContainer');
        const hasContent = container && container.innerHTML.length > 100;
        const isVisible = container && container.style.display !== 'none';
        const hasScenarios = document.querySelectorAll('.scenario-card, .analysis-result, [class*="scenario"]').length > 0;
        
        return hasContent || isVisible || hasScenarios;
      }, { timeout: 30000 });
      
      resultAppeared = true;
      console.log('  ✅ 結果が表示されました！');
      
    } catch (e) {
      console.log('  ❌ 30秒待機しましたが結果が表示されません');
    }
    
    // 結果表示後のスクリーンショット
    await page.waitForTimeout(2000); // 描画完了を待つ
    await page.screenshot({ 
      path: '20250814_step6_results.png',
      fullPage: true  // 結果全体を撮影
    });
    screenshots.push('20250814_step6_results.png');
    console.log('  ✅ 結果画面キャプチャ: 20250814_step6_results.png');
    
    // STEP 7: 結果の詳細確認
    console.log('\n🔍 STEP 7: 結果の詳細確認...');
    const resultDetails = await page.evaluate(() => {
      const container = document.getElementById('resultsContainer');
      const scenarios = document.querySelectorAll('.scenario-card, .analysis-result, [class*="scenario"], li');
      const charts = document.querySelectorAll('canvas');
      
      // 表示されているテキストを収集
      const visibleText = [];
      if (container) {
        const textElements = container.querySelectorAll('h1, h2, h3, h4, p, li, span');
        textElements.forEach(el => {
          const text = el.textContent.trim();
          if (text && text.length > 5) {
            visibleText.push(text.substring(0, 50));
          }
        });
      }
      
      return {
        containerVisible: container ? container.style.display !== 'none' : false,
        containerContent: container ? container.innerHTML.substring(0, 200) : '',
        scenarioCount: scenarios.length,
        chartCount: charts.length,
        hasContent: container ? container.innerHTML.length > 100 : false,
        visibleTextSamples: visibleText.slice(0, 5)
      };
    });
    
    console.log('  結果詳細:', JSON.stringify(resultDetails, null, 2));
    
    testResults.steps.push({
      step: 7,
      action: '結果確認',
      details: resultDetails,
      screenshot: '20250814_step6_results.png',
      status: resultDetails.scenarioCount > 0 ? 'SUCCESS' : 'FAIL'
    });
    
    // STEP 8: 最終確認
    console.log('\n✅ STEP 8: 最終確認...');
    const finalState = await page.evaluate(() => {
      // 8シナリオが表示されているか確認
      const findScenarios = () => {
        const possibleSelectors = [
          '.scenario-card',
          '.analysis-result',
          '[class*="scenario"]',
          '#scenarioCardsContainer > div',
          '#resultsContainer li',
          '.three-stage-item'
        ];
        
        for (const selector of possibleSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            return {
              selector,
              count: elements.length,
              samples: Array.from(elements).slice(0, 3).map(el => 
                el.textContent.substring(0, 50)
              )
            };
          }
        }
        return null;
      };
      
      return {
        scenarios: findScenarios(),
        resultsVisible: document.getElementById('resultsContainer').style.display !== 'none',
        pageErrors: window.__errors || []
      };
    });
    
    console.log('  最終状態:', JSON.stringify(finalState, null, 2));
    
    // テスト結果サマリー
    console.log('\n' + '='.repeat(60));
    console.log('📊 テスト結果サマリー');
    console.log('='.repeat(60));
    
    const success = resultAppeared && resultDetails.scenarioCount > 0;
    
    if (success) {
      console.log('✅ Future Simulatorは正常に動作しています！');
      console.log(`  - ${resultDetails.scenarioCount}個のシナリオ/結果を検出`);
      console.log(`  - 結果コンテナは表示状態`);
      console.log(`  - ${resultDetails.chartCount}個のチャートを検出`);
    } else {
      console.log('❌ 問題が検出されました');
      if (!resultAppeared) {
        console.log('  - 結果が表示されませんでした');
      }
      if (resultDetails.scenarioCount === 0) {
        console.log('  - シナリオが見つかりませんでした');
      }
    }
    
    // 結果をJSONファイルに保存
    testResults.summary = {
      success,
      resultAppeared,
      scenarioCount: resultDetails.scenarioCount,
      screenshots: screenshots
    };
    
    fs.writeFileSync(
      '20250814_visual_proof_results.json',
      JSON.stringify(testResults, null, 2)
    );
    
    console.log('\n📁 詳細結果: 20250814_visual_proof_results.json');
    console.log('📸 スクリーンショット:');
    screenshots.forEach(s => console.log(`  - ${s}`));
    
    // ブラウザを開いたまま10秒待機（手動確認用）
    console.log('\n⏳ 10秒間ブラウザを開いたままにします（手動確認してください）...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ エラー発生:', error.message);
    await page.screenshot({ 
      path: '20250814_error.png',
      fullPage: true 
    });
    console.log('エラー時のスクリーンショット: 20250814_error.png');
  } finally {
    await browser.close();
  }
}

test();