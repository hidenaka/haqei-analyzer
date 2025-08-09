/**
 * Triple OS 結果表示のデバッグテスト
 */

import { chromium } from 'playwright';

async function debugTripleOSResults() {
  console.log('🔧 Triple OS 結果表示デバッグ開始');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. ページアクセス
    await page.goto('http://localhost:8090/os_analyzer.html');
    console.log('✅ ページアクセス完了');
    
    // 2. 開始ボタンをクリック
    await page.click('.start-button');
    console.log('✅ 開始ボタンクリック完了');
    
    // 3. 最初の3問だけ回答
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(1000);
      const options = await page.$$('.option');
      if (options.length > 0) {
        await options[1].click(); // 2番目の選択肢を選択
        console.log(`✅ 質問 ${i + 1} 回答完了`);
        
        if (i < 2) {
          await page.click('#next-btn');
          await page.waitForTimeout(500);
        }
      } else {
        console.log(`❌ 質問 ${i + 1} の選択肢が見つかりません`);
        break;
      }
    }
    
    // 4. 結果画面に強制移動して確認
    console.log('\n🔍 結果画面に移動してデバッグ...');
    await page.evaluate(() => {
      // 強制的に結果画面を表示
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('results-screen').classList.add('active');
      
      // 簡易的なテスト結果データを作成
      const testResults = {
        engineOS: {
          hexagramName: 'テスト卦・Engine',
          description: 'Engine OSのテスト説明です。',
          catchphrase: 'テスト用キャッチフレーズ',
          trigramEnergies: { 乾: 75, 震: 60, 坎: 45 }
        },
        interfaceOS: {
          hexagramName: 'テスト卦・Interface', 
          description: 'Interface OSのテスト説明です。',
          catchphrase: 'インターフェースのテスト',
          trigramEnergies: { 坤: 80, 巽: 55, 離: 70 }
        },
        safeModeOS: {
          hexagramName: 'テスト卦・SafeMode',
          description: 'SafeMode OSのテスト説明です。', 
          catchphrase: 'セーフモードのテスト',
          trigramEnergies: { 艮: 65, 兌: 50, 坎: 85 }
        }
      };
      
      // HAQEIStateのshowResultsメソッドを直接実行
      if (window.haqeiState) {
        console.log('🎯 HAQEIState発見 - showResults実行');
        window.haqeiState.showResults(testResults);
      } else {
        console.log('❌ HAQEIStateが見つかりません');
        
        // 直接DOM操作で結果表示をテスト
        const container = document.getElementById('os-cards-container');
        if (container) {
          console.log('📦 os-cards-container発見 - 直接挿入テスト');
          container.innerHTML = `
            <div class="os-card card" style="border-color: #6366f140;">
              <div class="os-header">
                <div class="os-name">Engine OS (TEST)</div>
                <div class="os-score" style="color: #6366f1;">テスト卦</div>
              </div>
              <div class="os-description">テストデータによる結果表示</div>
            </div>
            <div class="os-card card" style="border-color: #8b5cf640;">
              <div class="os-header">
                <div class="os-name">Interface OS (TEST)</div>
                <div class="os-score" style="color: #8b5cf6;">テスト卦</div>
              </div>
              <div class="os-description">テストデータによる結果表示</div>
            </div>
            <div class="os-card card" style="border-color: #10b98140;">
              <div class="os-header">
                <div class="os-name">Safe Mode OS (TEST)</div>
                <div class="os-score" style="color: #10b981;">テスト卦</div>
              </div>
              <div class="os-description">テストデータによる結果表示</div>
            </div>
          `;
        } else {
          console.log('❌ os-cards-containerが見つかりません');
        }
      }
    });
    
    await page.waitForTimeout(3000);
    
    // 5. 結果確認
    const engineCard = await page.$('.os-card');
    const allCards = await page.$$('.os-card');
    
    console.log(`\n📊 結果カード検出状況:`);
    console.log(`  - os-cards-container存在: ${await page.$('#os-cards-container') ? '✅' : '❌'}`);
    console.log(`  - OSカード数: ${allCards.length}個`);
    console.log(`  - 最初のカード: ${engineCard ? '✅' : '❌'}`);
    
    if (allCards.length > 0) {
      for (let i = 0; i < allCards.length; i++) {
        const cardText = await allCards[i].textContent();
        console.log(`  - カード${i + 1}: ${cardText.substring(0, 50)}...`);
      }
    }
    
    // 6. スクリーンショット
    await page.screenshot({ path: 'triple-os-debug-screenshot.png', fullPage: true });
    console.log('📸 スクリーンショット保存: triple-os-debug-screenshot.png');
    
    // 7. コンソールログ確認
    const logs = await page.evaluate(() => {
      // ページのコンソールログを収集
      return window.console.history || [];
    });
    
    if (logs.length > 0) {
      console.log('\n📜 ページコンソールログ:');
      logs.forEach(log => console.log(`  ${log}`));
    }
    
  } catch (error) {
    console.error('❌ デバッグエラー:', error.message);
  } finally {
    await browser.close();
  }
}

// 実行
debugTripleOSResults().catch(console.error);