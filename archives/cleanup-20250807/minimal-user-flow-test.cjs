const { chromium } = require('playwright');

async function minimalUserFlowTest() {
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 
    });
    const page = await browser.newPage();
    
    console.log('🎯 ===== 最小限ユーザーフロー検証開始 =====');
    
    // コンソールエラーをキャッチ
    const errors = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        errors.push(text);
        console.log('❌ Console Error:', text);
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('❌ Page Error:', error.message);
    });

    // STEP 1: 初期アクセス - JavaScriptなしでHTML確認
    console.log('\n🚀 STEP 1: HTML構造確認');
    await page.goto('http://127.0.0.1:8788/future_simulator.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    await page.waitForTimeout(2000);
    
    // HTML要素の基本チェック
    const htmlState = await page.evaluate(() => {
      const worryInput = document.getElementById('worryInput');
      const aiGuessBtn = document.getElementById('aiGuessBtn');
      const resultArea = document.getElementById('resultArea');
      
      return {
        title: document.title,
        worryInput: {
          exists: !!worryInput,
          visible: worryInput ? worryInput.offsetHeight > 0 : false,
          style: worryInput ? worryInput.style.display : 'none',
          computedStyle: worryInput ? getComputedStyle(worryInput).display : 'none'
        },
        aiGuessBtn: {
          exists: !!aiGuessBtn,
          visible: aiGuessBtn ? aiGuessBtn.offsetHeight > 0 : false,
          disabled: aiGuessBtn ? aiGuessBtn.disabled : true
        },
        resultArea: {
          exists: !!resultArea,
          visible: resultArea ? resultArea.offsetHeight > 0 : false,
          classes: resultArea ? resultArea.className : 'none',
          style: resultArea ? resultArea.style.display : 'none'
        }
      };
    });
    
    console.log('📊 HTML構造状態:');
    console.log('- worryInput:', htmlState.worryInput);
    console.log('- aiGuessBtn:', htmlState.aiGuessBtn);
    console.log('- resultArea:', htmlState.resultArea);
    
    await page.screenshot({ path: 'minimal-step1-html.png', fullPage: true });

    if (!htmlState.worryInput.visible) {
      throw new Error('🚨 CRITICAL: worryInput要素が表示されていません');
    }

    // STEP 2: テキスト入力テスト（JavaScriptなし）
    console.log('\n📝 STEP 2: 基本的なHTML入力テスト');
    const testText = '基本テスト用の文章です。';
    
    await page.fill('#worryInput', testText);
    await page.waitForTimeout(1000);
    
    const inputValue = await page.inputValue('#worryInput');
    if (inputValue !== testText) {
      throw new Error('🚨 CRITICAL: HTML入力が正しく動作していません');
    }
    
    console.log('✅ HTML基本入力動作確認');
    await page.screenshot({ path: 'minimal-step2-input.png', fullPage: true });
    
    // STEP 3: 分析ボタン表示確認
    console.log('\n🔘 STEP 3: 分析ボタン確認');
    const buttonState = await page.evaluate(() => {
      const button = document.getElementById('aiGuessBtn');
      return {
        exists: !!button,
        visible: button ? button.offsetHeight > 0 : false,
        enabled: button ? !button.disabled : false,
        text: button ? button.innerText : 'not found'
      };
    });
    
    console.log('🔘 ボタン状態:', buttonState);
    
    if (buttonState.exists && buttonState.visible) {
      await page.click('#aiGuessBtn');
      console.log('✅ 分析ボタンクリック完了');
      await page.waitForTimeout(3000);
    }
    
    // STEP 4: 結果エリア状態確認
    console.log('\n📊 STEP 4: 結果エリア最終確認');
    const finalState = await page.evaluate(() => {
      const resultArea = document.getElementById('resultArea');
      return {
        resultArea: {
          exists: !!resultArea,
          visible: resultArea ? resultArea.offsetHeight > 0 : false,
          display: resultArea ? getComputedStyle(resultArea).display : 'none',
          innerHTML: resultArea ? resultArea.innerHTML.substring(0, 500) : 'not found'
        },
        bodyTextLength: document.body.innerText.length,
        allVisibleElements: Array.from(document.querySelectorAll('*'))
          .filter(el => el.offsetHeight > 0)
          .length
      };
    });
    
    console.log('📈 最終状態:');
    console.log(`- ResultArea存在: ${finalState.resultArea.exists ? '✅' : '❌'}`);
    console.log(`- ResultArea表示: ${finalState.resultArea.visible ? '✅' : '❌'}`);
    console.log(`- ResultArea display: ${finalState.resultArea.display}`);
    console.log(`- 可視要素数: ${finalState.allVisibleElements}`);
    console.log(`- ページテキスト長: ${finalState.bodyTextLength}`);
    
    await page.screenshot({ path: 'minimal-step4-final.png', fullPage: true });
    
    // エラーサマリー
    console.log('\n📊 ===== 最小限検証結果 =====');
    console.log(`❌ JavaScriptエラー数: ${errors.length}`);
    if (errors.length > 0) {
      console.log('🚨 発生エラー（最初の3つ）:');
      errors.slice(0, 3).forEach(error => console.log(`  - ${error}`));
    }
    
    return {
      success: errors.length === 0,
      errors: errors.length,
      htmlWorking: htmlState.worryInput.visible && buttonState.visible,
      resultAreaVisible: finalState.resultArea.visible
    };
    
  } catch (error) {
    console.error('❌ 最小限検証中にエラー:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

minimalUserFlowTest().then(result => {
  console.log('\n🎯 ===== 最小限検証判定 =====');
  console.log(`HTML基本動作: ${result.htmlWorking ? '✅' : '❌'}`);
  console.log(`結果エリア表示: ${result.resultAreaVisible ? '✅' : '❌'}`);
  console.log(`JavaScript状態: ${result.success ? '✅ 正常' : `❌ ${result.errors}個エラー`}`);
  
  if (result.htmlWorking && !result.success) {
    console.log('\n💡 結論: HTML構造は正常だが、JavaScriptに問題あり');
    console.log('   → JavaScriptの構文エラーを修正が必要');
  } else if (!result.htmlWorking) {
    console.log('\n💡 結論: HTML構造に根本的問題あり');
    console.log('   → HTML/CSS構造の修正が必要');
  }
});