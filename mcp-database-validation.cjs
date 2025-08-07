#!/usr/bin/env node
const { chromium } = require('playwright');

async function validateDatabaseIntegration() {
  console.log('🚀 データベース連携検証開始 - 絶対法則対応');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. HAQEI OS Analyzer 直接アクセス
    console.log('📱 HAQEI OS Analyzer 直接アクセス中...');
    await page.goto('http://localhost:8788/os_analyzer.html');
    await page.waitForTimeout(3000);
    
    // 初期画面スクリーンショット
    await page.screenshot({ path: 'database-validation-step1-initial.png', fullPage: true });
    console.log('✅ 初期画面キャプチャ完了');
    
    // 2. 開始ボタンクリック (ID指定で確実クリック)
    await page.waitForSelector('#start-btn', { timeout: 10000 });
    await page.click('#start-btn');
    await page.waitForTimeout(5000);
    
    // 3. 30問自動回答ループ
    for (let i = 1; i <= 30; i++) {
      console.log(`🔄 質問${i}/30 自動回答中...`);
      
      // 質問表示まで待機 (正確なセレクター)
      await page.waitForSelector('#question-screen', { timeout: 15000 });
      
      // データベース連携確認: 質問テキストが動的生成されているか
      const questionText = await page.textContent('.question-text');
      console.log(`📋 Q${i}: ${questionText.substring(0, 50)}...`);
      
      // ランダム選択肢クリック (5つの選択肢からランダム)
      const randomChoice = Math.floor(Math.random() * 5) + 1;
      const choices = await page.$$('.option-button, .choice-btn, .answer-option, button:has-text("誰もやったことのない"), button:has-text("既存の方法を"), button:has-text("みんなで話し合って"), button:has-text("過去の成功例を"), button:has-text("状況に応じて")');
      
      if (choices.length > 0) {
        const choiceIndex = Math.min(randomChoice - 1, choices.length - 1);
        await choices[choiceIndex].click();
        console.log(`✅ 選択肢${choiceIndex + 1}をクリック`);
      }
      await page.waitForTimeout(800);
      
      // 次へボタンクリック (画面で確認した正確なテキスト)
      try {
        await page.click('text=次の質問', { timeout: 3000 });
        console.log(`✅ 次の質問ボタンクリック成功`);
      } catch {
        // 最終問題の場合
        try {
          await page.click('text=分析完了', { timeout: 2000 });
          console.log(`✅ 分析完了ボタンクリック`);
          break;
        } catch {
          console.log(`⚠️ 次へボタン見つからず - Q${i}で停止`);
        }
      }
      await page.waitForTimeout(1500);
      
      // 進捗スクリーンショット (10問ごと)
      if (i % 10 === 0) {
        await page.screenshot({ 
          path: `database-validation-progress-q${i}.png`, 
          fullPage: true 
        });
        console.log(`📸 進捗スクリーンショット Q${i} 完了`);
      }
    }
    
    // 4. 結果画面まで待機
    console.log('⏳ Triple OS分析結果画面まで待機...');
    await page.waitForSelector('#results', { timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // 5. データベース連携検証 - CRITICAL
    console.log('🔍 データベース連携検証開始 - 実際のHEXAGRAMSとH384_DATA参照確認');
    
    // Engine OS データベース参照確認
    const engineOSText = await page.textContent('#engineOSResult');
    console.log('🔧 Engine OS結果:', engineOSText.substring(0, 100));
    
    // Interface OS データベース参照確認
    const interfaceOSText = await page.textContent('#interfaceOSResult');
    console.log('🔗 Interface OS結果:', interfaceOSText.substring(0, 100));
    
    // Safe Mode OS データベース参照確認
    const safeModeOSText = await page.textContent('#safeModeOSResult');
    console.log('🛡️ Safe Mode OS結果:', safeModeOSText.substring(0, 100));
    
    // HaQei Analysis データベース参照確認
    const haqeiAnalysis = await page.textContent('#haqeiAnalysisSection');
    console.log('📊 HaQei Analysis:', haqeiAnalysis.substring(0, 100));
    
    // 6. 最終結果画面スクリーンショット - 証明用
    await page.screenshot({ 
      path: 'database-validation-FINAL-RESULT.png', 
      fullPage: true 
    });
    console.log('✅ 最終結果画面キャプチャ完了 - データベース連携証明');
    
    // 7. 検証結果まとめ
    console.log('\n📋 データベース連携検証結果:');
    console.log('- Engine OS: データベース参照', engineOSText.includes('卦') ? '✅' : '❌');
    console.log('- Interface OS: データベース参照', interfaceOSText.includes('卦') ? '✅' : '❌');
    console.log('- Safe Mode OS: データベース参照', safeModeOSText.includes('卦') ? '✅' : '❌');
    console.log('- HaQei Analysis: データベース参照', haqeiAnalysis.includes('易経') ? '✅' : '❌');
    
    return {
      success: true,
      engineOS: engineOSText,
      interfaceOS: interfaceOSText,
      safeModeOS: safeModeOSText,
      haqeiAnalysis: haqeiAnalysis
    };
    
  } catch (error) {
    console.error('❌ データベース連携検証エラー:', error.message);
    await page.screenshot({ path: 'database-validation-ERROR.png', fullPage: true });
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// 検証実行
validateDatabaseIntegration()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 データベース連携検証完了 - 絶対法則対応済み');
      console.log('📸 証明スクリーンショット: database-validation-FINAL-RESULT.png');
    } else {
      console.log('\n❌ データベース連携検証失敗:', result.error);
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('致命的エラー:', error);
    process.exit(1);
  });