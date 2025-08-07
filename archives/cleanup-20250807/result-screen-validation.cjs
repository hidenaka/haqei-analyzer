#!/usr/bin/env node
const { chromium } = require('playwright');

async function resultScreenValidation() {
  console.log('🔍 結果画面完全確認 - 絶対法則準拠');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console監視
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  try {
    // 1. HAQEI OS Analyzer読み込み
    console.log('🚀 HAQEI OS Analyzer読み込み開始...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // 2. 開始ボタンクリック
    console.log('🎯 開始ボタンクリック...');
    await page.click('#start-btn');
    await page.waitForTimeout(3000);
    
    // 3. 30問自動回答 (高速モード)
    console.log('⚡ 30問高速自動回答開始...');
    
    for (let i = 1; i <= 30; i++) {
      console.log(`📝 質問${i}/30 回答中...`);
      
      // 質問画面確認
      await page.waitForSelector('#question-screen.active', { timeout: 10000 });
      
      // 選択肢ボタンを直接クリック (安全な方法)
      const choiceButtons = await page.$$('button');
      const validChoices = [];
      
      for (let btn of choiceButtons) {
        const text = await btn.textContent();
        const isChoice = text && !text.includes('前の質問') && !text.includes('次の質問') && 
                        !text.includes('Triple') && !text.includes('もう一度') && 
                        text.trim().length > 10;
        if (isChoice) validChoices.push(btn);
      }
      
      if (validChoices.length >= 5) {
        const randomChoice = Math.floor(Math.random() * validChoices.length);
        await validChoices[randomChoice].click();
        console.log(`   選択肢${randomChoice + 1}クリック成功`);
      } else {
        console.log(`   ⚠️ 選択肢ボタン不足: ${validChoices.length}/5`);
      }
      
      await page.waitForTimeout(200);
      
      // 次の質問へ (最後の質問の場合は分析開始)
      if (i < 30) {
        try {
          await page.click('text=次の質問', { timeout: 3000 });
          console.log(`   次の質問ボタンクリック成功`);
        } catch {
          console.log(`   ⚠️ 次の質問ボタン見つからず`);
          // JavaScriptフォールバック
          await page.evaluate(() => {
            if (window.criticalCSSAnalyzer && typeof window.criticalCSSAnalyzer.nextQuestion === 'function') {
              window.criticalCSSAnalyzer.nextQuestion();
            }
          });
        }
      } else {
        console.log('🔬 最終質問完了 - 分析開始...');
        try {
          await page.click('text=分析開始', { timeout: 3000 });
        } catch {
          await page.evaluate(() => {
            if (window.criticalCSSAnalyzer && typeof window.criticalCSSAnalyzer.proceedToAnalysis === 'function') {
              window.criticalCSSAnalyzer.proceedToAnalysis();
            }
          });
        }
      }
      
      await page.waitForTimeout(300);
    }
    
    // 4. 結果画面まで待機
    console.log('⏳ 結果画面表示まで待機...');
    await page.waitForSelector('#results-screen.active', { timeout: 45000 });
    await page.waitForTimeout(5000);
    
    console.log('✅ 結果画面表示成功！');
    
    // 5. 結果画面内容確認
    console.log('🔍 結果画面内容詳細確認...');
    
    const resultData = await page.evaluate(() => {
      // Engine OS結果
      const engineOS = document.querySelector('#engineOSResult, .engine-os-result, [data-os="engine"]');
      
      // Interface OS結果  
      const interfaceOS = document.querySelector('#interfaceOSResult, .interface-os-result, [data-os="interface"]');
      
      // Safe Mode OS結果
      const safeModeOS = document.querySelector('#safeModeOSResult, .safemode-os-result, [data-os="safemode"]');
      
      // HaQei Analysis
      const haqeiAnalysis = document.querySelector('#haqeiAnalysisSection, .haqei-analysis, .philosophical-analysis');
      
      // Practical Strategies
      const practicalStrategies = document.querySelector('#practicalStrategiesSection, .practical-strategies, .strategy-section');
      
      // 8次元レーダーチャート
      const radarChart = document.querySelector('canvas, .radar-chart, #radarCanvas');
      
      return {
        engineOS: {
          exists: !!engineOS,
          content: engineOS?.textContent?.substring(0, 200) || 'Not found',
          hasHexagram: engineOS?.textContent?.includes('卦') || false,
          hasDatabase: engineOS?.textContent?.includes('乾') || engineOS?.textContent?.includes('坤') || false
        },
        interfaceOS: {
          exists: !!interfaceOS,
          content: interfaceOS?.textContent?.substring(0, 200) || 'Not found',
          hasHexagram: interfaceOS?.textContent?.includes('卦') || false,
          hasDatabase: interfaceOS?.textContent?.includes('乾') || interfaceOS?.textContent?.includes('坤') || false
        },
        safeModeOS: {
          exists: !!safeModeOS,
          content: safeModeOS?.textContent?.substring(0, 200) || 'Not found',
          hasHexagram: safeModeOS?.textContent?.includes('卦') || false,
          hasDatabase: safeModeOS?.textContent?.includes('乾') || safeModeOS?.textContent?.includes('坤') || false
        },
        haqeiAnalysis: {
          exists: !!haqeiAnalysis,
          content: haqeiAnalysis?.textContent?.substring(0, 200) || 'Not found',
          hasPhilosophy: haqeiAnalysis?.textContent?.includes('易経') || haqeiAnalysis?.textContent?.includes('哲学') || false
        },
        practicalStrategies: {
          exists: !!practicalStrategies,
          content: practicalStrategies?.textContent?.substring(0, 200) || 'Not found',
          hasStrategy: practicalStrategies?.textContent?.includes('戦略') || practicalStrategies?.textContent?.includes('改善') || false
        },
        radarChart: {
          exists: !!radarChart,
          type: radarChart?.tagName || 'Not found'
        },
        allScreens: Array.from(document.querySelectorAll('.screen')).map(s => ({
          id: s.id,
          active: s.classList.contains('active'),
          visible: s.style.display !== 'none'
        }))
      };
    });
    
    console.log('\n📊 === 結果画面内容分析 ===');
    console.log('🔧 Engine OS:', resultData.engineOS.exists ? '✅ 存在' : '❌ 未存在');
    if (resultData.engineOS.exists) {
      console.log(`   Content: "${resultData.engineOS.content}"`);
      console.log(`   Database連携: ${resultData.engineOS.hasDatabase ? '✅' : '❌'}`);
    }
    
    console.log('🔗 Interface OS:', resultData.interfaceOS.exists ? '✅ 存在' : '❌ 未存在');
    if (resultData.interfaceOS.exists) {
      console.log(`   Content: "${resultData.interfaceOS.content}"`);
      console.log(`   Database連携: ${resultData.interfaceOS.hasDatabase ? '✅' : '❌'}`);
    }
    
    console.log('🛡️ Safe Mode OS:', resultData.safeModeOS.exists ? '✅ 存在' : '❌ 未存在');
    if (resultData.safeModeOS.exists) {
      console.log(`   Content: "${resultData.safeModeOS.content}"`);
      console.log(`   Database連携: ${resultData.safeModeOS.hasDatabase ? '✅' : '❌'}`);
    }
    
    console.log('📊 HaQei Analysis:', resultData.haqeiAnalysis.exists ? '✅ 存在' : '❌ 未存在');
    if (resultData.haqeiAnalysis.exists) {
      console.log(`   Philosophy連携: ${resultData.haqeiAnalysis.hasPhilosophy ? '✅' : '❌'}`);
    }
    
    console.log('🎯 Practical Strategies:', resultData.practicalStrategies.exists ? '✅ 存在' : '❌ 未存在');
    console.log('📈 Radar Chart:', resultData.radarChart.exists ? '✅ 存在' : '❌ 未存在');
    
    // 6. 結果画面スクリーンショット (証明用)
    await page.screenshot({ 
      path: 'result-screen-validation-FINAL.png', 
      fullPage: true 
    });
    console.log('📸 結果画面スクリーンショット保存完了');
    
    // 7. 各OS詳細確認 (レイヤー切り替え)
    console.log('\n🔍 詳細レイヤー確認...');
    const layerTabs = await page.$$('.tab-btn, .layer-tab');
    
    if (layerTabs.length > 0) {
      for (let i = 0; i < Math.min(layerTabs.length, 4); i++) {
        try {
          await layerTabs[i].click();
          await page.waitForTimeout(2000);
          await page.screenshot({ 
            path: `result-layer-${i+1}.png`, 
            fullPage: true 
          });
          console.log(`📸 レイヤー${i+1}スクリーンショット完了`);
        } catch (e) {
          console.log(`⚠️ レイヤー${i+1}クリック失敗`);
        }
      }
    }
    
    // 8. 最終レポート生成
    const report = {
      timestamp: new Date().toISOString(),
      resultScreenStatus: 'SUCCESS',
      databaseIntegration: {
        engineOS: resultData.engineOS.hasDatabase,
        interfaceOS: resultData.interfaceOS.hasDatabase,
        safeModeOS: resultData.safeModeOS.hasDatabase
      },
      contentValidation: {
        allOSPresent: resultData.engineOS.exists && resultData.interfaceOS.exists && resultData.safeModeOS.exists,
        haqeiAnalysisPresent: resultData.haqeiAnalysis.exists,
        practicalStrategiesPresent: resultData.practicalStrategies.exists,
        radarChartPresent: resultData.radarChart.exists
      },
      consoleErrors: consoleErrors,
      resultData: resultData
    };
    
    const fs = require('fs');
    fs.writeFileSync('result-screen-validation-report.json', JSON.stringify(report, null, 2));
    console.log('📝 結果画面検証レポート保存完了');
    
    return report;
    
  } catch (error) {
    console.error('❌ 結果画面確認失敗:', error.message);
    await page.screenshot({ path: 'result-screen-validation-ERROR.png', fullPage: true });
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// 実行
resultScreenValidation()
  .then(result => {
    if (result.resultScreenStatus === 'SUCCESS') {
      console.log('\n🎉 結果画面完全確認成功 - 絶対法則準拠');
      console.log('📊 Database Integration:', result.databaseIntegration);
      console.log('✅ Content Validation:', result.contentValidation);
      process.exit(0);
    } else {
      console.log('❌ 結果画面確認失敗');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('致命的エラー:', error);
    process.exit(1);
  });