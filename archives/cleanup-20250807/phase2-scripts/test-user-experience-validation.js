/**
 * User Experience Validation Test
 * ユーザー体験の完全検証 - 診断から結果表示まで
 */

import { chromium } from 'playwright';

(async () => {
  console.log('🔍 ユーザー体験完全検証テスト開始...');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-web-security', '--allow-running-insecure-content']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 }
  });
  
  const page = await context.newPage();
  
  // コンソールログを収集
  const logs = [];
  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    
    logs.push(`[${type.toUpperCase()}] ${text}`);
    
    if (type === 'error') {
      errors.push(text);
    } else if (type === 'warning') {
      warnings.push(text);
    }
    
    console.log(`🖥️  [${type.toUpperCase()}] ${text}`);
  });
  
  // ネットワークエラーを監視
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
    console.error('❌ Page Error:', error.message);
  });
  
  try {
    // ページロード
    console.log('\n📄 future_simulator.html をロード中...');
    await page.goto('http://localhost:8788/future_simulator.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ ページロード完了');
    
    // H384データベースロード確認
    console.log('\n🔍 H384データベースロード確認...');
    const h384Status = await page.evaluate(() => {
      return {
        exists: typeof window.H384_DATA !== 'undefined',
        isArray: Array.isArray(window.H384_DATA),
        length: window.H384_DATA ? window.H384_DATA.length : 0,
        firstEntry: window.H384_DATA ? window.H384_DATA[0] : null
      };
    });
    
    console.log('📊 H384データベース状況:', h384Status);
    
    if (!h384Status.exists || !h384Status.isArray || h384Status.length !== 386) {
      console.error('❌ H384データベースの問題を検出:');
      console.error(`  - 存在: ${h384Status.exists}`);
      console.error(`  - 配列: ${h384Status.isArray}`);
      console.error(`  - 長さ: ${h384Status.length} (期待値: 386)`);
    } else {
      console.log('✅ H384データベース正常: 386エントリ確認');
    }
    
    // I Ching システム初期化確認
    console.log('\n🎯 I Ching システム初期化確認...');
    const systemStatus = await page.evaluate(() => {
      return {
        ichingSimulator: typeof window.IChingFutureSimulator !== 'undefined',
        situationAnalyzer: typeof window.IChingSituationAnalyzer !== 'undefined',
        transformationSimulator: typeof window.YaoTransformationSimulator !== 'undefined',
        metaphorDisplay: typeof window.IChingMetaphorDisplay !== 'undefined',
        globalSimulator: typeof window.getIChingSimulator === 'function'
      };
    });
    
    console.log('🧩 システムコンポーネント状況:', systemStatus);
    
    // 初期画面スクリーンショット
    await page.screenshot({ path: 'user-experience-initial.png', fullPage: true });
    console.log('📸 初期画面スクリーンショット撮影');
    
    // テスト用診断内容を複数パターンで確認
    const testCases = [
      {
        name: 'キャリア転換',
        text: '現在の仕事に満足していないが、転職するか迷っている。新しい環境へのチャレンジと現在の安定性のバランスを取るのが難しい。家族もいるので慎重に判断したい。',
        expectedKeywords: ['仕事', '転職', '迷っ', '安定', '家族']
      },
      {
        name: '人間関係の悩み',
        text: '職場の上司との関係がうまくいかず、毎日ストレスを感じている。このまま我慢するべきか、何か行動を起こすべきか分からない。',
        expectedKeywords: ['職場', '上司', 'ストレス', '我慢', '行動']
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n🔄 テストケース: ${testCase.name}`);
      
      // 入力エリアをクリアして新しいテキストを入力
      const textarea = page.locator('#worryInput');
      await textarea.clear();
      await textarea.fill(testCase.text);
      await page.waitForTimeout(1000);
      
      console.log(`✏️ 入力完了: "${testCase.text.substring(0, 50)}..."`);
      
      // 分析実行
      console.log('🎯 分析実行...');
      const analyzeBtn = page.locator('#aiGuessBtn');
      await analyzeBtn.click();
      
      // I Chingシステムの反応を待機
      await page.waitForTimeout(5000);
      
      // I Chingセクションが表示されるか確認
      const ichingSection = page.locator('#iching-simulator-section');
      const isIChingVisible = await ichingSection.isVisible();
      
      console.log(`🔍 I Chingセクション表示: ${isIChingVisible}`);
      
      if (isIChingVisible) {
        // スクロールして表示
        await ichingSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(2000);
        
        // 状況分析結果の確認
        console.log('📊 状況分析結果を確認中...');
        
        // ヘキサグラム情報を取得
        const hexagramInfo = await page.evaluate(() => {
          const hexagramName = document.querySelector('.hexagram-name');
          const hexagramDescription = document.querySelector('.hexagram-description');
          const situationContent = document.querySelector('.situation-content');
          
          return {
            name: hexagramName ? hexagramName.textContent : 'Not found',
            description: hexagramDescription ? hexagramDescription.textContent : 'Not found',
            situationAnalysis: situationContent ? situationContent.innerHTML : 'Not found'
          };
        });
        
        console.log('🎴 ヘキサグラム情報:', hexagramInfo);
        
        // テンプレート文かどうかの確認
        const isTemplate = hexagramInfo.name.includes('乾為天') && 
                          hexagramInfo.description.includes('変化の時') &&
                          hexagramInfo.situationAnalysis.includes('この時期のテーマ');
        
        if (isTemplate) {
          console.warn('⚠️ テンプレート文の可能性を検出');
        } else {
          console.log('✅ カスタマイズされた分析結果を確認');
        }
        
        // データベース連携確認
        const dataIntegration = await page.evaluate(() => {
          const analyzer = window.getIChingSimulator ? window.getIChingSimulator() : null;
          const currentAnalysis = analyzer ? analyzer.getCurrentAnalysis() : null;
          
          return {
            analyzerExists: !!analyzer,
            hasCurrentAnalysis: !!currentAnalysis,
            h384Entry: currentAnalysis ? !!currentAnalysis.h384Entry : false,
            confidence: currentAnalysis ? currentAnalysis.confidence : 0
          };
        });
        
        console.log('🔗 データベース連携状況:', dataIntegration);
        
        if (!dataIntegration.h384Entry || dataIntegration.confidence < 0.3) {
          console.warn('⚠️ データベース連携またはアナライザー精度に問題の可能性');
        }
        
        // テーマ選択オプションの確認
        const themeOptions = page.locator('.theme-option');
        const themeCount = await themeOptions.count();
        
        console.log(`🎨 テーマ選択オプション: ${themeCount}個`);
        
        if (themeCount === 3) {
          // 中間のテーマ（変える）を選択
          await themeOptions.nth(1).click();
          console.log('✅ テーマ選択: "変える" を選択');
          
          // 変化処理を待機
          await page.waitForTimeout(4000);
          
          // 変化結果の確認
          const transformationDisplay = page.locator('.transformation-display');
          const isTransformationVisible = await transformationDisplay.isVisible();
          
          console.log(`🔄 変化表示: ${isTransformationVisible}`);
          
          if (isTransformationVisible) {
            // 変化メタファーの内容確認
            const transformationContent = await page.evaluate(() => {
              const metaphorContainer = document.querySelector('.transformation-metaphor');
              const yaoOld = document.querySelector('.yao-visual.old');
              const yaoNew = document.querySelector('.yao-visual.new');
              
              return {
                metaphor: metaphorContainer ? metaphorContainer.textContent : 'Not found',
                oldYao: yaoOld ? yaoOld.textContent : 'Not found',
                newYao: yaoNew ? yaoNew.textContent : 'Not found'
              };
            });
            
            console.log('🔄 変化内容:', transformationContent);
            
            // 未来シナリオの確認
            await page.waitForTimeout(2000);
            const scenariosDisplay = page.locator('.scenarios-display');
            const isScenariosVisible = await scenariosDisplay.isVisible();
            
            console.log(`🔮 未来シナリオ表示: ${isScenariosVisible}`);
            
            if (isScenariosVisible) {
              const scenarioCards = page.locator('.scenario-card');
              const scenarioCount = await scenarioCards.count();
              
              console.log(`📋 シナリオカード数: ${scenarioCount}`);
              
              // 各シナリオの内容確認
              for (let i = 0; i < Math.min(scenarioCount, 3); i++) {
                const scenarioContent = await scenarioCards.nth(i).evaluate(card => {
                  const title = card.querySelector('.scenario-title');
                  const probability = card.querySelector('.scenario-probability');
                  const timeline = card.querySelectorAll('.timeline-item');
                  
                  return {
                    title: title ? title.textContent : 'No title',
                    probability: probability ? probability.textContent : 'No probability',
                    timelineCount: timeline.length
                  };
                });
                
                console.log(`  📊 シナリオ ${i + 1}:`, scenarioContent);
              }
              
              console.log('✅ 未来シナリオ表示完了');
            }
          }
        }
        
        // スクリーンショット撮影
        await page.screenshot({ path: `user-experience-${testCase.name.replace(/\s+/g, '-')}.png`, fullPage: true });
        console.log(`📸 ${testCase.name} 完了スクリーンショット撮影`);
      } else {
        console.warn('⚠️ I Chingセクションが表示されませんでした');
        
        // 従来の結果エリアを確認
        const resultArea = page.locator('#resultArea');
        if (await resultArea.isVisible()) {
          console.log('📊 従来の結果エリアを確認中...');
          
          const legacyResults = await page.evaluate(() => {
            const summaryCard = document.querySelector('#summaryCard');
            const scenarios = document.querySelectorAll('#scenarioGrid .scenario-card');
            
            return {
              hasSummary: !!summaryCard,
              scenarioCount: scenarios.length,
              summaryContent: summaryCard ? summaryCard.textContent.substring(0, 100) : 'None'
            };
          });
          
          console.log('📋 従来システム結果:', legacyResults);
        }
      }
      
      console.log(`✅ ${testCase.name} テストケース完了\n`);
    }
    
    // 最終エラーチェック
    console.log('\n🔍 最終エラーチェック...');
    console.log(`📊 収集ログ数: ${logs.length}`);
    console.log(`❌ エラー数: ${errors.length}`);
    console.log(`⚠️ 警告数: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ 検出されたエラー:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ 検出された警告:');
      warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }
    
    // 最終スクリーンショット
    await page.screenshot({ path: 'user-experience-final.png', fullPage: true });
    console.log('📸 最終スクリーンショット撮影');
    
    // 検証結果サマリー
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ユーザー体験検証結果サマリー');
    console.log('='.repeat(60));
    console.log(`✅ H384データベース: ${h384Status.exists && h384Status.length === 386 ? '正常' : '問題あり'}`);
    console.log(`✅ システム初期化: ${Object.values(systemStatus).every(v => v) ? '正常' : '一部問題'}`);
    console.log(`✅ 診断テストケース: ${testCases.length}件実行`);
    console.log(`❌ エラー: ${errors.length}件`);
    console.log(`⚠️ 警告: ${warnings.length}件`);
    
    const overallStatus = errors.length === 0 && h384Status.length === 386 && Object.values(systemStatus).every(v => v);
    console.log(`\n🏆 総合評価: ${overallStatus ? '✅ 正常動作' : '⚠️ 要確認'}`);
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    await page.screenshot({ path: 'user-experience-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();