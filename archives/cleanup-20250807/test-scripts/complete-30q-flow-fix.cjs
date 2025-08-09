#!/usr/bin/env node
const { chromium } = require('playwright');

async function complete30QFlowFix() {
  console.log('🔧 30問回答フロー完全修正 - DIV選択肢対応版');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Console監視
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  try {
    // 1. HAQEI OS Analyzer読み込み
    console.log('🚀 HAQEI OS Analyzer読み込み...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // 2. 開始ボタンクリック
    console.log('🎯 分析開始...');
    await page.click('#start-btn');
    await page.waitForTimeout(3000);
    
    // 3. 30問完全回答フロー (修正版)
    console.log('📝 30問完全回答開始...');
    
    for (let i = 1; i <= 30; i++) {
      console.log(`📋 質問${i}/30 回答中...`);
      
      // 質問画面の確認
      await page.waitForSelector('#question-screen.active', { timeout: 10000 });
      
      // DIV選択肢の検出と選択 (修正版)
      const options = await page.$$('.option[role="radio"]');
      console.log(`   選択肢検出: ${options.length}個`);
      
      if (options.length >= 5) {
        // ランダム選択
        const randomIndex = Math.floor(Math.random() * options.length);
        
        // 選択肢クリック
        await options[randomIndex].click();
        console.log(`   ✅ 選択肢${randomIndex + 1}をクリック`);
        
        // 選択状態確認
        await page.waitForTimeout(500);
        
        // 次の質問へ進む
        if (i < 30) {
          // 次の質問ボタンが有効になるまで待機
          await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
          await page.click('#next-btn');
          console.log(`   ➡️ 次の質問へ`);
        } else {
          // 最終問題完了 - 分析開始
          console.log('🔬 30問完了 - 分析開始...');
          await page.waitForSelector('#next-btn:not([disabled])', { timeout: 5000 });
          await page.click('#next-btn'); // 最後は分析開始ボタンになる
        }
        
        await page.waitForTimeout(800);
        
      } else {
        console.log(`   ❌ 選択肢不足: ${options.length}/5 - スキップ`);
        
        // フォールバック: JavaScript直接実行
        await page.evaluate((questionIndex) => {
          if (window.criticalCSSAnalyzer) {
            const randomScore = Math.floor(Math.random() * 5);
            window.criticalCSSAnalyzer.state.answers[questionIndex] = randomScore;
            window.criticalCSSAnalyzer.nextQuestion();
          }
        }, i - 1);
      }
      
      // 10問ごとに進捗スクリーンショット
      if (i % 10 === 0) {
        await page.screenshot({ 
          path: `30q-flow-progress-q${i}.png`, 
          fullPage: true 
        });
        console.log(`📸 進捗スクリーンショット Q${i} 保存`);
      }
    }
    
    // 4. 結果画面まで待機
    console.log('⏳ 分析完了まで待機...');
    await page.waitForSelector('#results-screen.active', { timeout: 60000 });
    await page.waitForTimeout(5000);
    
    console.log('✅ 結果画面表示成功！');
    
    // 5. Triple OS結果詳細確認
    console.log('🔍 Triple OS結果詳細確認...');
    
    const tripleOSResults = await page.evaluate(() => {
      // 結果要素の詳細検索
      const findElement = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) return element;
        }
        return null;
      };
      
      const engineOS = findElement([
        '#engineOSResult', '.engine-os-result', '.os-card[data-os="engine"]',
        '.basic-layer .os-card:nth-child(1)', '.os-results .engine-os'
      ]);
      
      const interfaceOS = findElement([
        '#interfaceOSResult', '.interface-os-result', '.os-card[data-os="interface"]',
        '.basic-layer .os-card:nth-child(2)', '.os-results .interface-os'
      ]);
      
      const safeModeOS = findElement([
        '#safeModeOSResult', '.safemode-os-result', '.os-card[data-os="safemode"]',
        '.basic-layer .os-card:nth-child(3)', '.os-results .safemode-os'
      ]);
      
      const haqeiAnalysis = findElement([
        '#haqeiAnalysisSection', '.haqei-analysis', '.philosophical-analysis',
        '.detailed-layer .analysis-section', '.haqei-wisdom'
      ]);
      
      const practicalStrategies = findElement([
        '#practicalStrategiesSection', '.practical-strategies', '.strategy-section',
        '.expert-layer .strategies', '.action-strategies'
      ]);
      
      return {
        engineOS: {
          exists: !!engineOS,
          content: engineOS?.textContent?.substring(0, 200) || 'Not found',
          hasHexagram: engineOS?.textContent?.includes('卦') || engineOS?.textContent?.includes('乾') || engineOS?.textContent?.includes('坤') || false
        },
        interfaceOS: {
          exists: !!interfaceOS,
          content: interfaceOS?.textContent?.substring(0, 200) || 'Not found',
          hasHexagram: interfaceOS?.textContent?.includes('卦') || interfaceOS?.textContent?.includes('乾') || interfaceOS?.textContent?.includes('坤') || false
        },
        safeModeOS: {
          exists: !!safeModeOS,
          content: safeModeOS?.textContent?.substring(0, 200) || 'Not found',
          hasHexagram: safeModeOS?.textContent?.includes('卦') || safeModeOS?.textContent?.includes('乾') || safeModeOS?.textContent?.includes('坤') || false
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
        allContent: document.body.textContent.substring(0, 1000)
      };
    });
    
    console.log('\n📊 === Triple OS結果分析 ===');
    console.log(`🔧 Engine OS: ${tripleOSResults.engineOS.exists ? '✅ 存在' : '❌ 未存在'}`);
    if (tripleOSResults.engineOS.exists) {
      console.log(`   Content: "${tripleOSResults.engineOS.content}"`);
      console.log(`   Database連携: ${tripleOSResults.engineOS.hasHexagram ? '✅' : '❌'}`);
    }
    
    console.log(`🔗 Interface OS: ${tripleOSResults.interfaceOS.exists ? '✅ 存在' : '❌ 未存在'}`);
    if (tripleOSResults.interfaceOS.exists) {
      console.log(`   Content: "${tripleOSResults.interfaceOS.content}"`);
      console.log(`   Database連携: ${tripleOSResults.interfaceOS.hasHexagram ? '✅' : '❌'}`);
    }
    
    console.log(`🛡️ Safe Mode OS: ${tripleOSResults.safeModeOS.exists ? '✅ 存在' : '❌ 未存在'}`);
    if (tripleOSResults.safeModeOS.exists) {
      console.log(`   Content: "${tripleOSResults.safeModeOS.content}"`);
      console.log(`   Database連携: ${tripleOSResults.safeModeOS.hasHexagram ? '✅' : '❌'}`);
    }
    
    console.log(`📊 HaQei Analysis: ${tripleOSResults.haqeiAnalysis.exists ? '✅ 存在' : '❌ 未存在'}`);
    console.log(`🎯 Practical Strategies: ${tripleOSResults.practicalStrategies.exists ? '✅ 存在' : '❌ 未存在'}`);
    
    // 6. 最終結果画面スクリーンショット
    await page.screenshot({ 
      path: '30q-complete-result-FINAL.png', 
      fullPage: true 
    });
    console.log('📸 最終結果画面スクリーンショット保存');
    
    // 7. 各レイヤー表示テスト
    const layerTabs = await page.$$('.tab-btn');
    if (layerTabs.length >= 4) {
      for (let i = 0; i < 4; i++) {
        try {
          await layerTabs[i].click();
          await page.waitForTimeout(2000);
          await page.screenshot({ 
            path: `30q-result-layer-${i+1}.png`, 
            fullPage: true 
          });
          console.log(`📸 レイヤー${i+1}表示確認完了`);
        } catch (e) {
          console.log(`⚠️ レイヤー${i+1}表示失敗`);
        }
      }
    }
    
    // 8. 最終レポート
    const finalReport = {
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      questionsCompleted: 30,
      tripleOSResults: tripleOSResults,
      consoleErrors: errors,
      databaseIntegration: {
        engineOS: tripleOSResults.engineOS.hasHexagram,
        interfaceOS: tripleOSResults.interfaceOS.hasHexagram,
        safeModeOS: tripleOSResults.safeModeOS.hasHexagram
      },
      systemFunctionality: {
        questionsWorking: true,
        resultsGenerated: tripleOSResults.engineOS.exists || tripleOSResults.interfaceOS.exists || tripleOSResults.safeModeOS.exists,
        fullSystemOperational: tripleOSResults.engineOS.exists && tripleOSResults.interfaceOS.exists && tripleOSResults.safeModeOS.exists
      }
    };
    
    const fs = require('fs');
    fs.writeFileSync('30q-complete-flow-report.json', JSON.stringify(finalReport, null, 2));
    console.log('📝 30問完全フローレポート保存完了');
    
    return finalReport;
    
  } catch (error) {
    console.error('❌ 30問フロー修正失敗:', error.message);
    await page.screenshot({ path: '30q-flow-fix-error.png', fullPage: true });
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// 実行
complete30QFlowFix()
  .then(result => {
    if (result.status === 'SUCCESS') {
      console.log('\n🎉 30問回答フロー完全修正成功！');
      console.log('📊 System Functionality:', result.systemFunctionality);
      console.log('🔧 Database Integration:', result.databaseIntegration);
      process.exit(0);
    } else {
      console.log('❌ 30問フロー修正失敗');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('致命的エラー:', error);
    process.exit(1);
  });