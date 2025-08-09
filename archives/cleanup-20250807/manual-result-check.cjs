#!/usr/bin/env node
const { chromium } = require('playwright');

async function manualResultCheck() {
  console.log('🔍 手動結果画面確認 - 5問のみテストで結果表示確認');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    console.log('✅ ページ読み込み完了 - 手動操作で30問回答後、結果画面を確認してください');
    console.log('📝 確認項目:');
    console.log('   1. Engine OS結果表示');
    console.log('   2. Interface OS結果表示'); 
    console.log('   3. Safe Mode OS結果表示');
    console.log('   4. HaQei Analysis表示');
    console.log('   5. Practical Strategies表示');
    console.log('   6. 8次元レーダーチャート');
    console.log('   7. データベース参照内容の確認');
    
    // 初期画面スクリーンショット
    await page.screenshot({ path: 'manual-result-check-start.png', fullPage: true });
    
    // 5分待機（手動操作用）
    console.log('⏳ 5分間手動操作可能...');
    await page.waitForTimeout(300000); // 5分
    
    // 最終画面スクリーンショット
    await page.screenshot({ path: 'manual-result-check-final.png', fullPage: true });
    
    // 結果画面の内容確認
    const resultAnalysis = await page.evaluate(() => {
      // 全ての画面要素を取得
      const screens = Array.from(document.querySelectorAll('.screen')).map(s => ({
        id: s.id,
        active: s.classList.contains('active'),
        visible: s.style.display !== 'none'
      }));
      
      // 結果画面内容確認
      const resultElements = {
        engineOS: document.querySelector('#engineOSResult, .engine-os, [data-os="engine"], .os-card:nth-of-type(1)'),
        interfaceOS: document.querySelector('#interfaceOSResult, .interface-os, [data-os="interface"], .os-card:nth-of-type(2)'),
        safeModeOS: document.querySelector('#safeModeOSResult, .safemode-os, [data-os="safemode"], .os-card:nth-of-type(3)'),
        haqeiAnalysis: document.querySelector('#haqeiAnalysisSection, .haqei-analysis, .philosophical-analysis'),
        practicalStrategies: document.querySelector('#practicalStrategiesSection, .practical-strategies'),
        radarChart: document.querySelector('canvas'),
        allText: document.body.textContent
      };
      
      return {
        screens: screens,
        hasEngineOS: !!resultElements.engineOS,
        hasInterfaceOS: !!resultElements.interfaceOS,
        hasSafeModeOS: !!resultElements.safeModeOS,
        hasHaQeiAnalysis: !!resultElements.haqeiAnalysis,
        hasPracticalStrategies: !!resultElements.practicalStrategies,
        hasRadarChart: !!resultElements.radarChart,
        engineContent: resultElements.engineOS?.textContent?.substring(0, 200) || 'Not found',
        interfaceContent: resultElements.interfaceOS?.textContent?.substring(0, 200) || 'Not found',
        safeModeContent: resultElements.safeModeOS?.textContent?.substring(0, 200) || 'Not found',
        bodyText: resultElements.allText?.substring(0, 500) || 'Not found'
      };
    });
    
    console.log('\n📊 結果画面分析:');
    console.log(`🔧 Engine OS: ${resultAnalysis.hasEngineOS ? '✅ 存在' : '❌ 未存在'}`);
    console.log(`🔗 Interface OS: ${resultAnalysis.hasInterfaceOS ? '✅ 存在' : '❌ 未存在'}`);
    console.log(`🛡️ Safe Mode OS: ${resultAnalysis.hasSafeModeOS ? '✅ 存在' : '❌ 未存在'}`);
    console.log(`📊 HaQei Analysis: ${resultAnalysis.hasHaQeiAnalysis ? '✅ 存在' : '❌ 未存在'}`);
    console.log(`🎯 Practical Strategies: ${resultAnalysis.hasPracticalStrategies ? '✅ 存在' : '❌ 未存在'}`);
    console.log(`📈 Radar Chart: ${resultAnalysis.hasRadarChart ? '✅ 存在' : '❌ 未存在'}`);
    
    if (resultAnalysis.hasEngineOS) {
      console.log(`\n🔧 Engine OS Content: "${resultAnalysis.engineContent}"`);
    }
    if (resultAnalysis.hasInterfaceOS) {
      console.log(`🔗 Interface OS Content: "${resultAnalysis.interfaceContent}"`);
    }
    if (resultAnalysis.hasSafeModeOS) {
      console.log(`🛡️ Safe Mode OS Content: "${resultAnalysis.safeModeContent}"`);
    }
    
    console.log(`\n📄 Body Text Sample: "${resultAnalysis.bodyText}"`);
    
    // レポート保存
    const fs = require('fs');
    fs.writeFileSync('manual-result-analysis.json', JSON.stringify(resultAnalysis, null, 2));
    console.log('📝 手動結果分析レポート保存完了');
    
    return resultAnalysis;
    
  } catch (error) {
    console.error('❌ 手動結果確認エラー:', error.message);
    await page.screenshot({ path: 'manual-result-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

manualResultCheck();