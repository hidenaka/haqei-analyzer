const { chromium } = require('playwright');

async function completeUserFlowValidation() {
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 
    });
    const page = await browser.newPage();
    
    console.log('🎯 ===== 完全ユーザーフロー検証開始 =====');
    
    // コンソールエラーを全てキャッチ
    const errors = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        errors.push(text);
        console.log('❌ Console Error:', text);
      } else if (type === 'warn') {
        console.log('⚠️ Warning:', text);
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('❌ Page Error:', error.message);
    });

    // STEP 1: 初期アクセス
    console.log('\n🚀 STEP 1: 初期画面アクセス');
    await page.goto('http://127.0.0.1:8788/future_simulator.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    await page.waitForTimeout(3000);
    
    // 初期画面状態確認
    const initialState = await page.evaluate(() => ({
      title: document.title,
      hasWorryInput: !!document.getElementById('worryInput'),
      inputVisible: document.getElementById('worryInput')?.offsetHeight > 0,
      hasButton: !!document.getElementById('aiGuessBtn'),
      buttonVisible: document.getElementById('aiGuessBtn')?.offsetHeight > 0,
      bodyText: document.body.innerText.substring(0, 300),
      elementCount: document.querySelectorAll('*').length
    }));
    
    console.log('📊 初期画面状態:');
    console.log(`- タイトル: ${initialState.title}`);
    console.log(`- Input存在: ${initialState.hasWorryInput ? '✅' : '❌'}`);
    console.log(`- Input表示: ${initialState.inputVisible ? '✅' : '❌'}`);
    console.log(`- Button存在: ${initialState.hasButton ? '✅' : '❌'}`);
    console.log(`- Button表示: ${initialState.buttonVisible ? '✅' : '❌'}`);
    console.log(`- 要素数: ${initialState.elementCount}`);
    
    await page.screenshot({ path: 'step1-initial-screen.png', fullPage: true });
    
    if (!initialState.inputVisible) {
      throw new Error('🚨 CRITICAL: worryInput要素が表示されていません');
    }
    
    // STEP 2: テキスト入力テスト
    console.log('\n📝 STEP 2: テキスト入力テスト');
    const testText = '最近、仕事とプライベートのバランスに悩んでいます。特に新しいプロジェクトが始まってから、時間の使い方や優先順位の付け方に迷いが生じています。どのような心構えで進めば良いでしょうか？';
    
    await page.fill('#worryInput', testText);
    await page.waitForTimeout(1000);
    
    // 入力確認
    const inputValue = await page.inputValue('#worryInput');
    if (inputValue !== testText) {
      throw new Error('🚨 CRITICAL: テキスト入力が正しく動作していません');
    }
    
    console.log('✅ テキスト入力成功');
    await page.screenshot({ path: 'step2-text-input.png', fullPage: true });
    
    // STEP 3: 分析ボタンクリック
    console.log('\n🔘 STEP 3: 分析実行テスト');
    await page.click('#aiGuessBtn');
    console.log('✅ 分析ボタンクリック完了');
    
    // 分析処理待機（最大30秒）
    console.log('⏳ 分析処理中...');
    await page.waitForTimeout(5000);
    
    // STEP 4: 結果表示確認
    console.log('\n📊 STEP 4: 結果表示確認');
    
    // 結果エリアの確認
    const resultState = await page.evaluate(() => {
      const resultArea = document.getElementById('resultArea');
      const scenarioCards = document.querySelectorAll('.scenario-card, [class*="scenario"]');
      const binaryTree = document.querySelector('.binary-tree, [class*="binary-tree"], [class*="tree"]');
      
      return {
        hasResultArea: !!resultArea,
        resultAreaVisible: resultArea ? resultArea.offsetHeight > 0 : false,
        scenarioCardsCount: scenarioCards.length,
        hasBinaryTree: !!binaryTree,
        binaryTreeVisible: binaryTree ? binaryTree.offsetHeight > 0 : false,
        bodyText: document.body.innerText,
        allElements: Array.from(document.querySelectorAll('*')).map(el => ({
          tag: el.tagName,
          id: el.id,
          classes: el.className,
          visible: el.offsetHeight > 0
        }))
      };
    });
    
    console.log('📈 結果表示状態:');
    console.log(`- ResultArea存在: ${resultState.hasResultArea ? '✅' : '❌'}`);
    console.log(`- ResultArea表示: ${resultState.resultAreaVisible ? '✅' : '❌'}`);
    console.log(`- シナリオカード数: ${resultState.scenarioCardsCount}`);
    console.log(`- BinaryTree存在: ${resultState.hasBinaryTree ? '✅' : '❌'}`);
    console.log(`- BinaryTree表示: ${resultState.binaryTreeVisible ? '✅' : '❌'}`);
    
    await page.screenshot({ path: 'step4-results-display.png', fullPage: true });
    
    // 追加待機して再確認
    console.log('⏳ 追加処理待機中...');
    await page.waitForTimeout(10000);
    
    const finalState = await page.evaluate(() => {
      return {
        bodyContent: document.body.innerText.substring(0, 1000),
        visibleElements: Array.from(document.querySelectorAll('*'))
          .filter(el => el.offsetHeight > 0)
          .map(el => ({
            tag: el.tagName,
            id: el.id,
            text: el.innerText?.substring(0, 100)
          }))
          .slice(0, 20)
      };
    });
    
    console.log('\n🔍 最終状態確認:');
    console.log('表示されているコンテンツ:');
    console.log(finalState.bodyContent);
    
    await page.screenshot({ path: 'step5-final-state.png', fullPage: true });
    
    // エラー総計
    console.log('\n📊 ===== 検証結果サマリー =====');
    console.log(`❌ エラー総数: ${errors.length}`);
    if (errors.length > 0) {
      console.log('🚨 発生エラー:');
      errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('✅ 完全ユーザーフロー検証完了');
    
    return {
      success: errors.length === 0,
      errors,
      states: {
        initial: initialState,
        result: resultState,
        final: finalState
      }
    };
    
  } catch (error) {
    console.error('❌ 検証中にエラー発生:', error.message);
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

completeUserFlowValidation().then(result => {
  console.log('\n🎯 ===== 最終判定 =====');
  if (result.success) {
    console.log('🎉 SUCCESS: 完全ユーザーフロー動作確認');
  } else {
    console.log('❌ FAILED: ユーザーフローに問題があります');
    if (result.error) {
      console.log(`エラー詳細: ${result.error}`);
    }
  }
});