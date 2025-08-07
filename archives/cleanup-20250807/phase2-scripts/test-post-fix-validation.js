/**
 * Post-Fix Validation Test  
 * 修正後の完全検証テスト
 */

import { chromium } from 'playwright';

(async () => {
  console.log('🔧 修正後ユーザー体験検証テスト開始...');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-web-security', '--allow-running-insecure-content']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  
  const page = await context.newPage();
  
  // エラーログ収集
  const errors = [];
  const logs = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    logs.push(`[${type.toUpperCase()}] ${text}`);
    
    if (type === 'error') {
      errors.push(text);
      console.log(`❌ ERROR: ${text}`);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
    console.error('❌ Page Error:', error.message);
  });
  
  try {
    // ページロード
    console.log('📄 ページロード中...');
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 初期スクリーンショット
    await page.screenshot({ path: 'post-fix-initial.png', fullPage: true });
    console.log('📸 初期状態撮影');
    
    // H384データベース確認
    const h384Status = await page.evaluate(() => {
      return {
        exists: typeof window.H384_DATA !== 'undefined',
        length: window.H384_DATA ? window.H384_DATA.length : 0,
        dataIntegrity: window.H384_DATA ? !!window.H384_DATA[0] : false
      };
    });
    
    console.log(`📊 H384データベース: ${h384Status.exists ? '✅' : '❌'} (${h384Status.length}件)`);
    
    // システム初期化確認
    const systemStatus = await page.evaluate(() => {
      return {
        ichingSimulator: typeof window.getIChingSimulator === 'function',
        simulator: window.getIChingSimulator ? !!window.getIChingSimulator() : false
      };
    });
    
    console.log(`🎯 システム初期化: ${systemStatus.simulator ? '✅' : '❌'}`);
    
    // 診断テスト実行
    console.log('🔍 診断テスト実行中...');
    const testText = '新しいプロジェクトに挑戦したいが、失敗を恐れて踏み出せない。現状維持か挑戦か迷っている。';
    
    const textarea = page.locator('#worryInput');
    await textarea.fill(testText);
    console.log('✏️ テキスト入力完了');
    
    // 分析実行
    const analyzeBtn = page.locator('#aiGuessBtn');
    await analyzeBtn.click();
    console.log('🎯 分析実行');
    
    // I Chingシステム初期化待機
    await page.waitForTimeout(5000);
    
    // I Chingセクション表示確認
    const ichingSection = page.locator('#iching-simulator-section');
    const isIChingVisible = await ichingSection.isVisible();
    console.log(`🔮 I Chingセクション表示: ${isIChingVisible ? '✅' : '❌'}`);
    
    if (isIChingVisible) {
      await ichingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'post-fix-iching-displayed.png', fullPage: true });
      console.log('📸 I Ching表示撮影');
      
      // 状況分析結果確認
      const analysisResult = await page.evaluate(() => {
        const hexagramName = document.querySelector('.hexagram-name');
        const situationContent = document.querySelector('.situation-content');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        return {
          hexagramDisplayed: !!hexagramName,
          hexagramName: hexagramName ? hexagramName.textContent : '',
          situationAnalyzed: !!situationContent,
          themeOptionsCount: themeOptions.length,
          isTemplateResult: hexagramName ? hexagramName.textContent.includes('乾為天') : false
        };
      });
      
      console.log(`🎴 ヘキサグラム表示: ${analysisResult.hexagramDisplayed ? '✅' : '❌'}`);
      console.log(`📊 状況分析: ${analysisResult.situationAnalyzed ? '✅' : '❌'}`);
      console.log(`🎨 テーマオプション: ${analysisResult.themeOptionsCount}個`);
      console.log(`📋 カスタム結果: ${!analysisResult.isTemplateResult ? '✅' : '⚠️'}`);
      
      if (analysisResult.themeOptionsCount === 3) {
        // テーマ選択テスト
        console.log('🎯 テーマ選択テスト...');
        const themeOptions = page.locator('.theme-option');
        await themeOptions.nth(1).click(); // "変える" を選択
        console.log('✅ テーマ選択: "変える"');
        
        // 変化処理待機
        await page.waitForTimeout(4000);
        
        // 変化結果確認
        const transformationResult = await page.evaluate(() => {
          const transformationDisplay = document.querySelector('.transformation-display');
          const scenariosDisplay = document.querySelector('.scenarios-display');
          const scenarioCards = document.querySelectorAll('.scenario-card');
          
          return {
            transformationVisible: transformationDisplay ? transformationDisplay.style.display !== 'none' : false,
            scenariosVisible: scenariosDisplay ? scenariosDisplay.style.display !== 'none' : false,
            scenarioCount: scenarioCards.length
          };
        });
        
        console.log(`🔄 変化表示: ${transformationResult.transformationVisible ? '✅' : '❌'}`);
        console.log(`🔮 シナリオ表示: ${transformationResult.scenariosVisible ? '✅' : '❌'}`);
        console.log(`📋 シナリオ数: ${transformationResult.scenarioCount}`);
        
        await page.screenshot({ path: 'post-fix-transformation-complete.png', fullPage: true });
        console.log('📸 変化完了撮影');
        
        // シナリオ内容検証
        if (transformationResult.scenarioCount > 0) {
          const scenarioValidation = await page.evaluate(() => {
            const scenarios = document.querySelectorAll('.scenario-card');
            const validScenarios = [];
            
            scenarios.forEach((scenario, index) => {
              const title = scenario.querySelector('.scenario-title');
              const probability = scenario.querySelector('.scenario-probability');
              const timeline = scenario.querySelectorAll('.timeline-item');
              
              validScenarios.push({
                index: index + 1,
                hasTitle: !!title && title.textContent.trim() !== '',
                hasProbability: !!probability && probability.textContent.trim() !== '',
                timelineCount: timeline.length,
                valid: !!title && !!probability && timeline.length > 0
              });
            });
            
            return validScenarios;
          });
          
          const validCount = scenarioValidation.filter(s => s.valid).length;
          console.log(`📊 有効シナリオ: ${validCount}/${scenarioValidation.length}`);
          
          scenarioValidation.forEach(scenario => {
            console.log(`  シナリオ${scenario.index}: ${scenario.valid ? '✅' : '❌'} (タイトル:${scenario.hasTitle}, 確率:${scenario.hasProbability}, タイムライン:${scenario.timelineCount})`);
          });
        }
      }
    }
    
    // エラー数チェック
    console.log(`\n📊 エラーサマリー: ${errors.length}件`);
    
    if (errors.length > 0) {
      console.log('❌ 検出されたエラー:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ エラーは検出されませんでした');
    }
    
    // 最終結果スクリーンショット
    await page.screenshot({ path: 'post-fix-final-validation.png', fullPage: true });
    console.log('📸 最終検証撮影');
    
    // 総合評価
    const overallSuccess = errors.length === 0 && 
                          h384Status.exists && 
                          h384Status.length === 386 && 
                          systemStatus.simulator && 
                          isIChingVisible;
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 修正後検証結果');
    console.log('='.repeat(50));
    console.log(`📊 H384データベース: ${h384Status.exists ? '✅' : '❌'}`);
    console.log(`🎯 システム初期化: ${systemStatus.simulator ? '✅' : '❌'}`);
    console.log(`🔮 I Ching表示: ${isIChingVisible ? '✅' : '❌'}`);
    console.log(`❌ エラー: ${errors.length}件`);
    console.log(`\n🏆 総合評価: ${overallSuccess ? '✅ 完全成功' : '⚠️ 要確認'}`);
    
    if (overallSuccess) {
      console.log('🎊 すべての修正が正常に動作しています！');
      console.log('🎯 ユーザー体験は期待通りに機能しています。');
    }
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    await page.screenshot({ path: 'post-fix-test-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();