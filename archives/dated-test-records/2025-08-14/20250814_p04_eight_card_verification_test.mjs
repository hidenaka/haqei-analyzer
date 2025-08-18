/**
 * P0-4: 8カード統一の実装検証
 * Future Simulator v4.3.1の8カード表示を確認
 */

import { chromium } from 'playwright';

async function verifyEightCardDisplay() {
  console.log('🧪 P0-4: 8カード統一の実装検証開始');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-web-security']
  });
  
  try {
    const page = await browser.newPage();
    
    // Future Simulatorページに移動
    console.log('📍 Future Simulatorページを開いています...');
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    // ページタイトル確認
    const title = await page.title();
    console.log(`✅ ページタイトル: ${title}`);
    
    // 入力フィールドにテストデータを入力
    const testInput = 'チームの人間関係が複雑で、仕事の効率が悪い。解決策はあるか？';
    console.log('📝 テスト入力を設定中...');
    await page.fill('#worryInput', testInput);
    
    // 分析実行ボタンをクリック
    console.log('🚀 分析実行ボタンをクリック...');
    await page.click('#aiGuessBtn');
    
    // 結果が表示されるまで待機（最大15秒）
    console.log('⏱️ 結果表示を待機中...');
    try {
      await page.waitForSelector('.scenarios-main-container', { 
        timeout: 15000,
        state: 'visible'
      });
      console.log('✅ 結果コンテナが表示されました');
    } catch (e) {
      console.error('❌ 結果表示のタイムアウト:', e.message);
      return { success: false, error: '結果表示タイムアウト' };
    }
    
    // シナリオカード数をカウント
    const cardCount = await page.locator('.scenario-card-v431').count();
    console.log(`📊 表示されているカード数: ${cardCount}`);
    
    // カードが正確に8枚あるかチェック
    if (cardCount === 8) {
      console.log('✅ 正確に8枚のカードが表示されています！');
    } else {
      console.log(`❌ カード数が異常です。期待値: 8, 実際: ${cardCount}`);
    }
    
    // 各カードのIDを確認
    const cardIds = [];
    for (let i = 0; i < cardCount; i++) {
      const cardId = await page.locator('.scenario-card-v431').nth(i).getAttribute('data-scenario-id');
      cardIds.push(cardId);
    }
    console.log('🎯 カードID一覧:', cardIds);
    
    // 重複チェック
    const uniqueIds = [...new Set(cardIds)];
    const hasDuplicates = uniqueIds.length !== cardIds.length;
    
    if (hasDuplicates) {
      console.log('❌ 重複カードが検出されました！');
    } else {
      console.log('✅ 重複なし - 全カードがユニークです');
    }
    
    // 期待されるシナリオIDパターン
    const expectedIds = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
    const hasAllExpectedIds = expectedIds.every(id => cardIds.includes(id));
    
    if (hasAllExpectedIds) {
      console.log('✅ 期待される8つのシナリオIDがすべて存在します');
    } else {
      console.log('❌ 期待されるシナリオIDが不足しています');
      console.log('期待値:', expectedIds);
      console.log('実際:', cardIds);
    }
    
    // タイトルと概要を確認
    console.log('📖 カード内容を確認中...');
    for (let i = 0; i < Math.min(cardCount, 8); i++) {
      const card = page.locator('.scenario-card-v431').nth(i);
      const id = await card.getAttribute('data-scenario-id');
      const summary = await card.locator('p').textContent();
      console.log(`  ${id}: ${summary.substring(0, 50)}...`);
    }
    
    // モーダルテスト（1つ目のカードをクリック）
    if (cardCount > 0) {
      console.log('🔍 モーダル機能をテスト中...');
      await page.locator('.scenario-card-v431').first().click();
      
      // モーダルが表示されるまで待機
      try {
        await page.waitForSelector('#scenario-modal-v431', { 
          timeout: 5000,
          state: 'visible'
        });
        console.log('✅ モーダルが正常に表示されました');
        
        // モーダルを閉じる
        await page.click('#scenario-modal-v431 button');
        await page.waitForSelector('#scenario-modal-v431', { 
          timeout: 2000,
          state: 'detached'
        });
        console.log('✅ モーダルが正常に閉じられました');
      } catch (e) {
        console.log('⚠️ モーダルテストでエラー:', e.message);
      }
    }
    
    // スクリーンショット撮影
    console.log('📸 結果のスクリーンショットを撮影中...');
    await page.screenshot({ 
      path: '20250814_p04_eight_card_display_result.png', 
      fullPage: true 
    });
    
    // 結果サマリー
    const result = {
      success: cardCount === 8 && !hasDuplicates && hasAllExpectedIds,
      cardCount,
      expectedCount: 8,
      hasDuplicates,
      hasAllExpectedIds,
      cardIds,
      timestamp: new Date().toISOString()
    };
    
    console.log('🎯 P0-4 検証結果:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// メイン実行
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyEightCardDisplay()
    .then(result => {
      if (result.success) {
        console.log('🎉 P0-4: 8カード統一の実装 - 検証成功！');
        process.exit(0);
      } else {
        console.log('💥 P0-4: 8カード統一の実装 - 検証失敗');
        console.log('詳細:', result);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 テスト実行失敗:', error);
      process.exit(1);
    });
}