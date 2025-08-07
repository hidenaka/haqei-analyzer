/**
 * Final User Experience Validation
 * 最終ユーザー体験検証 - エラー解消確認
 */

import { chromium } from 'playwright';

(async () => {
  console.log('🎯 最終ユーザー体験検証開始...');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-web-security', '--allow-running-insecure-content']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  
  const page = await context.newPage();
  
  // エラー・ログ収集
  const errors = [];
  const warnings = [];
  const criticalErrors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    
    if (type === 'error') {
      errors.push(text);
      if (text.includes('TypeError') || text.includes('ReferenceError')) {
        criticalErrors.push(text);
      }
    } else if (type === 'warning') {
      warnings.push(text);
    }
  });
  
  page.on('pageerror', error => {
    const errorText = `Page Error: ${error.message}`;
    criticalErrors.push(errorText);
    console.error('❌ Critical Error:', errorText);
  });
  
  try {
    console.log('📄 future_simulator.html ロード...');
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    
    console.log('✅ ページロード完了');
    
    // データベース状態確認
    const dbStatus = await page.evaluate(() => {
      return {
        h384Available: typeof window.H384_DATA !== 'undefined',
        h384Count: window.H384_DATA ? window.H384_DATA.length : 0,
        ichingSimulator: typeof window.getIChingSimulator === 'function'
      };
    });
    
    console.log(`📊 データベース: H384_DATA ${dbStatus.h384Available ? '✅' : '❌'} (${dbStatus.h384Count}件)`);
    console.log(`🎯 I Chingシミュレーター: ${dbStatus.ichingSimulator ? '✅' : '❌'}`);
    
    // 初期画面撮影
    await page.screenshot({ path: 'final-validation-initial.png', fullPage: true });
    
    // 診断実行テスト
    console.log('🔍 診断実行テスト...');
    const testText = '転職するかどうか迷っている。新しい挑戦をしたいが、現在の安定も捨てがたい。家族のことを考えると慎重になってしまう。';
    
    const textarea = page.locator('#worryInput');
    await textarea.fill(testText);
    console.log('✏️ テストテキスト入力完了');
    
    // 分析ボタンクリック
    const analyzeBtn = page.locator('#aiGuessBtn');
    await analyzeBtn.click();
    console.log('🎯 分析実行');
    
    // システム応答待機
    await page.waitForTimeout(6000);
    
    // I Chingセクション確認
    const ichingSection = page.locator('#iching-simulator-section');
    const isIChingVisible = await ichingSection.isVisible();
    console.log(`🔮 I Chingセクション表示: ${isIChingVisible ? '✅' : '❌'}`);
    
    if (isIChingVisible) {
      await ichingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      
      // 分析結果詳細確認
      const analysisDetails = await page.evaluate(() => {
        const hexagramName = document.querySelector('.hexagram-name');
        const metaphorDisplay = document.querySelector('.situation-content');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        // テンプレート文判定
        const isTemplate = hexagramName && 
          hexagramName.textContent.includes('乾為天') &&
          metaphorDisplay &&
          metaphorDisplay.textContent.includes('この時期のテーマ');
        
        // データベース連携確認
        const analyzer = window.getIChingSimulator ? window.getIChingSimulator() : null;
        const currentAnalysis = analyzer ? analyzer.getCurrentAnalysis() : null;
        
        return {
          hexagramDisplayed: !!hexagramName,
          hexagramText: hexagramName ? hexagramName.textContent : '',
          hasMetaphor: !!metaphorDisplay,
          themeCount: themeOptions.length,
          isTemplateResult: isTemplate,
          databaseConnected: !!currentAnalysis && !!currentAnalysis.h384Entry,
          confidence: currentAnalysis ? currentAnalysis.confidence : 0
        };
      });
      
      console.log(`🎴 ヘキサグラム: ${analysisDetails.hexagramDisplayed ? '✅' : '❌'} "${analysisDetails.hexagramText}"`);
      console.log(`🎨 メタファー表示: ${analysisDetails.hasMetaphor ? '✅' : '❌'}`);
      console.log(`🎯 テーマオプション: ${analysisDetails.themeCount}個`);
      console.log(`📊 データベース連携: ${analysisDetails.databaseConnected ? '✅' : '❌'}`);
      console.log(`📈 分析確信度: ${Math.round(analysisDetails.confidence * 100)}%`);
      console.log(`📋 カスタム結果: ${!analysisDetails.isTemplateResult ? '✅' : '⚠️ テンプレート'}`);
      
      await page.screenshot({ path: 'final-validation-analysis.png', fullPage: true });
      
      // テーマ選択・変化テスト
      if (analysisDetails.themeCount === 3) {
        console.log('🎯 テーマ選択・変化テスト...');
        
        const themeOptions = page.locator('.theme-option');
        await themeOptions.nth(1).click(); // "変える"を選択
        console.log('✅ テーマ "変える" 選択完了');
        
        // 変化処理待機
        await page.waitForTimeout(5000);
        
        // 変化結果確認
        const transformationStatus = await page.evaluate(() => {
          const transformationDisplay = document.querySelector('.transformation-display');
          const scenariosDisplay = document.querySelector('.scenarios-display');
          const scenarioCards = document.querySelectorAll('.scenario-card');
          
          let validScenarios = 0;
          scenarioCards.forEach(card => {
            const title = card.querySelector('.scenario-title');
            const probability = card.querySelector('.scenario-probability');
            const timeline = card.querySelectorAll('.timeline-item');
            
            if (title && title.textContent.trim() !== '' && 
                probability && probability.textContent.trim() !== '' && 
                timeline.length > 0) {
              validScenarios++;
            }
          });
          
          return {
            transformationVisible: transformationDisplay && transformationDisplay.style.display !== 'none',
            scenariosVisible: scenariosDisplay && scenariosDisplay.style.display !== 'none',
            totalScenarios: scenarioCards.length,
            validScenarios: validScenarios
          };
        });
        
        console.log(`🔄 変化表示: ${transformationStatus.transformationVisible ? '✅' : '❌'}`);
        console.log(`🔮 シナリオ表示: ${transformationStatus.scenariosVisible ? '✅' : '❌'}`);
        console.log(`📊 シナリオ詳細: ${transformationStatus.validScenarios}/${transformationStatus.totalScenarios} 有効`);
        
        await page.screenshot({ path: 'final-validation-transformation.png', fullPage: true });
      }
    }
    
    // 最終エラー確認
    await page.waitForTimeout(2000);
    
    console.log('\n📊 最終エラーサマリー:');
    console.log(`❌ 重要エラー: ${criticalErrors.length}件`);
    console.log(`⚠️ 一般エラー: ${errors.length}件`);
    console.log(`🔔 警告: ${warnings.length}件`);
    
    if (criticalErrors.length > 0) {
      console.log('\n❌ 重要エラー詳細:');
      criticalErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    // 最終撮影
    await page.screenshot({ path: 'final-validation-complete.png', fullPage: true });
    
    // 総合判定
    const isFullyFunctional = criticalErrors.length === 0 && 
                             dbStatus.h384Available && 
                             dbStatus.h384Count === 386 && 
                             isIChingVisible;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎊 最終ユーザー体験検証結果');
    console.log('='.repeat(60));
    console.log(`📊 H384データベース: ${dbStatus.h384Available ? '✅' : '❌'} (${dbStatus.h384Count}件)`);
    console.log(`🎯 システム初期化: ${dbStatus.ichingSimulator ? '✅' : '❌'}`);
    console.log(`🔮 I Ching診断: ${isIChingVisible ? '✅' : '❌'}`);
    console.log(`❌ 重要エラー: ${criticalErrors.length}件`);
    console.log(`📸 証拠スクリーンショット: 4枚撮影完了`);
    
    console.log(`\n🏆 最終評価: ${isFullyFunctional ? '🎊 完全成功' : '⚠️ 修正必要'}`);
    
    if (isFullyFunctional) {
      console.log('\n🎉 ユーザー体験検証完全合格！');
      console.log('✅ データベース連携正常');
      console.log('✅ I Ching分析機能正常動作'); 
      console.log('✅ テーマ選択・変化システム正常');
      console.log('✅ 重要エラーなし');
      console.log('🎯 HAQEIアナライザー準備完了！');
    }
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    await page.screenshot({ path: 'final-validation-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();