/**
 * ボタンの初期状態と有効化条件を調査
 */

const { chromium } = require('playwright');

async function investigateButton() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // コンソールログを詳細に監視
  page.on('console', msg => {
    const text = msg.text();
    console.log(`📝 ${text}`);
  });
  
  await page.goto('http://localhost:8788/future_simulator.html');
  await page.waitForTimeout(3000);
  
  console.log('\n=== 初期状態調査 ===');
  
  // ボタンの初期状態を確認
  const buttonInitialState = await page.evaluate(() => {
    const btn = document.getElementById('aiGuessBtn');
    const input = document.getElementById('worryInput');
    return {
      button: {
        id: btn?.id,
        disabled: btn?.disabled,
        hasDisabledAttr: btn?.hasAttribute('disabled'),
        className: btn?.className,
        textContent: btn?.textContent?.trim(),
        dataOptimized: btn?.getAttribute('data-optimized')
      },
      input: {
        id: input?.id,
        value: input?.value,
        placeholder: input?.placeholder
      }
    };
  });
  
  console.log('ボタン初期状態:', buttonInitialState.button);
  console.log('入力フィールド初期状態:', buttonInitialState.input);
  
  // イベントリスナーを調査
  const listeners = await page.evaluate(() => {
    const btn = document.getElementById('aiGuessBtn');
    const input = document.getElementById('worryInput');
    
    // getEventListenersは通常のブラウザでは使えないので、代替方法
    const result = {
      buttonOnclick: btn?.onclick ? 'あり' : 'なし',
      inputOninput: input?.oninput ? 'あり' : 'なし',
      inputOnkeyup: input?.onkeyup ? 'あり' : 'なし'
    };
    
    // data-optimizedの詳細調査
    if (btn?.getAttribute('data-optimized')) {
      result.dataOptimized = btn.getAttribute('data-optimized');
    }
    
    return result;
  });
  
  console.log('イベントリスナー:', listeners);
  
  console.log('\n=== 入力時の動作調査 ===');
  
  // 1文字ずつ入力して状態変化を観察
  const testInput = '新しい仕事に転職したい';
  const input = await page.$('#worryInput');
  
  for (let i = 1; i <= testInput.length; i++) {
    const char = testInput[i-1];
    await input.type(char, { delay: 100 });
    
    const state = await page.evaluate(() => {
      const btn = document.getElementById('aiGuessBtn');
      const input = document.getElementById('worryInput');
      return {
        inputLength: input?.value?.length,
        buttonDisabled: btn?.disabled,
        buttonText: btn?.textContent?.trim()
      };
    });
    
    console.log(`入力${i}文字目「${char}」: 文字数=${state.inputLength}, ボタン=${state.buttonDisabled ? '無効' : '有効'}`);
    
    // 10文字目で変化があるか確認
    if (i === 10) {
      console.log('>>> 10文字到達！ボタン状態:', state.buttonDisabled ? '無効のまま' : '有効化');
    }
  }
  
  console.log('\n=== data-optimized属性の調査 ===');
  
  // data-optimized属性を削除してみる
  await page.evaluate(() => {
    const btn = document.getElementById('aiGuessBtn');
    if (btn) {
      console.log('data-optimized削除前:', btn.getAttribute('data-optimized'));
      btn.removeAttribute('data-optimized');
      btn.removeAttribute('disabled');
      console.log('data-optimized削除後:', btn.getAttribute('data-optimized'));
      console.log('disabled削除後:', btn.disabled);
    }
  });
  
  await page.waitForTimeout(1000);
  
  // 削除後の状態確認
  const afterRemoval = await page.evaluate(() => {
    const btn = document.getElementById('aiGuessBtn');
    return {
      disabled: btn?.disabled,
      dataOptimized: btn?.getAttribute('data-optimized'),
      clickable: !btn?.disabled
    };
  });
  
  console.log('属性削除後の状態:', afterRemoval);
  
  // クリック可能か試す
  if (afterRemoval.clickable) {
    try {
      await page.click('#aiGuessBtn');
      console.log('✅ ボタンクリック成功！');
    } catch (e) {
      console.log('❌ ボタンクリック失敗:', e.message);
    }
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
}

investigateButton().catch(console.error);