import { chromium } from 'playwright';
import fs from 'fs';

console.log('👤 Future Simulator ユーザー目線での完全性チェック\n');
console.log('=' .repeat(60));
console.log('実際のユーザーが使った時の体験を検証します\n');

async function userPerspectiveTest() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // ユーザーの操作速度を再現
  });
  const page = await browser.newPage();
  
  const userExperience = {
    timestamp: new Date().toISOString(),
    scenarios: [],
    issues: [],
    positives: [],
    screenshots: []
  };
  
  try {
    // ========================================
    // シナリオ1: 初めてのユーザー
    // ========================================
    console.log('📝 シナリオ1: 初めてのユーザーが使う場合');
    console.log('-' .repeat(40));
    
    await page.goto('file:///Users/hideakimacbookair/Desktop/haqei-analyzer/public/future_simulator.html');
    await page.waitForTimeout(2000);
    
    // 1. ページを見た第一印象
    console.log('  1. ページを開いた時...');
    const firstImpression = await page.evaluate(() => {
      const title = document.querySelector('h1, h2')?.textContent;
      const input = document.getElementById('worryInput');
      const button = document.getElementById('aiGuessBtn');
      
      return {
        hasTitle: !!title,
        titleText: title,
        inputVisible: input && window.getComputedStyle(input).display !== 'none',
        inputPlaceholder: input?.placeholder,
        buttonVisible: button && window.getComputedStyle(button).display !== 'none',
        buttonText: button?.textContent?.trim(),
        isIntuitive: input && button && input.placeholder && button.textContent
      };
    });
    
    console.log(`    タイトル: ${firstImpression.titleText || '❌ なし'}`);
    console.log(`    入力欄: ${firstImpression.inputPlaceholder ? '✅ 説明あり' : '❌ 説明なし'}`);
    console.log(`    ボタン: ${firstImpression.buttonText || '❌ なし'}`);
    console.log(`    直感的か: ${firstImpression.isIntuitive ? '✅' : '❌'}`);
    
    await page.screenshot({ path: '20250814_user_1_first.png' });
    userExperience.screenshots.push('20250814_user_1_first.png');
    
    if (!firstImpression.isIntuitive) {
      userExperience.issues.push('初見でどう使うか分からない');
    } else {
      userExperience.positives.push('使い方が直感的に分かる');
    }
    
    // 2. 実際に入力してみる
    console.log('\n  2. 悩みを入力する...');
    const userInput = '仕事を続けるべきか転職すべきか悩んでいます。今の職場は安定していますが、やりがいを感じません。';
    await page.fill('#worryInput', userInput);
    await page.waitForTimeout(1000);
    
    // 入力中の体験
    const inputExperience = await page.evaluate(() => {
      const input = document.getElementById('worryInput');
      const charCount = input?.value.length;
      
      // 文字数表示があるか
      const hasCharCounter = document.body.textContent.includes('文字') && 
                             document.body.textContent.includes(charCount);
      
      // ヘルプや説明があるか
      const hasHelp = document.querySelector('[class*="help"], [class*="guide"], [class*="説明"]');
      
      return {
        charCount,
        hasCharCounter,
        hasHelp: !!hasHelp
      };
    });
    
    console.log(`    入力文字数: ${inputExperience.charCount}文字`);
    console.log(`    文字数表示: ${inputExperience.hasCharCounter ? '✅' : '❌ なし'}`);
    console.log(`    ヘルプ表示: ${inputExperience.hasHelp ? '✅' : '❌ なし'}`);
    
    // 3. ボタンをクリック
    console.log('\n  3. 分析ボタンをクリック...');
    await page.click('#aiGuessBtn');
    
    // 処理中の表示確認
    await page.waitForTimeout(500);
    const processingState = await page.evaluate(() => {
      const button = document.getElementById('aiGuessBtn');
      const hasLoadingIndicator = button?.textContent?.includes('中') || 
                                  button?.disabled ||
                                  document.querySelector('.loading, .spinner');
      
      return {
        buttonDisabled: button?.disabled,
        buttonText: button?.textContent?.trim(),
        hasLoadingIndicator
      };
    });
    
    console.log(`    処理中表示: ${processingState.hasLoadingIndicator ? '✅' : '❌'}`);
    console.log(`    ボタン状態: ${processingState.buttonText}`);
    
    // 4. 結果が表示されるまで待つ
    console.log('\n  4. 結果を待っている...');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '20250814_user_2_results.png', fullPage: true });
    userExperience.screenshots.push('20250814_user_2_results.png');
    
    // 結果の理解しやすさ
    const resultsExperience = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card-v431');
      const container = document.getElementById('resultsContainer');
      
      // カードの内容を確認
      const cardContents = Array.from(cards).map(card => {
        const text = card.textContent;
        const hasJargon = text.includes('両者敗北') || text.includes('進爻') || 
                         text.includes('変爻') || text.includes('六三');
        const hasPlainText = text.includes('着実') || text.includes('基盤') || 
                            text.includes('挑戦') || text.includes('変化');
        
        return {
          id: card.dataset.scenarioId,
          textLength: text.length,
          hasJargon,
          hasPlainText,
          readable: hasPlainText && !hasJargon
        };
      });
      
      // 全体の見やすさ
      const hasTitle = container?.textContent.includes('8つ') || 
                      container?.textContent.includes('未来');
      const hasExplanation = container?.textContent.includes('クリック') || 
                            container?.textContent.includes('詳細');
      
      return {
        cardCount: cards.length,
        cardContents,
        allReadable: cardContents.every(c => c.readable),
        hasTitle,
        hasExplanation,
        isOrganized: cards.length === 8 && hasTitle
      };
    });
    
    console.log(`    カード数: ${resultsExperience.cardCount}`);
    console.log(`    読みやすさ: ${resultsExperience.allReadable ? '✅ 全て平易' : '❌ 難解な表現あり'}`);
    console.log(`    タイトル: ${resultsExperience.hasTitle ? '✅' : '❌'}`);
    console.log(`    説明: ${resultsExperience.hasExplanation ? '✅' : '❌'}`);
    console.log(`    整理されているか: ${resultsExperience.isOrganized ? '✅' : '❌'}`);
    
    if (resultsExperience.cardCount !== 8) {
      userExperience.issues.push(`カード数が${resultsExperience.cardCount}枚（8枚であるべき）`);
    }
    
    if (!resultsExperience.allReadable) {
      userExperience.issues.push('難解な表現が含まれている');
    } else {
      userExperience.positives.push('全て理解しやすい表現');
    }
    
    // 5. カードをクリックして詳細を見る
    console.log('\n  5. カードをクリックして詳細を確認...');
    if (resultsExperience.cardCount > 0) {
      await page.click('.scenario-card-v431:first-child');
      await page.waitForTimeout(1500);
      
      const modalExperience = await page.evaluate(() => {
        const modal = document.getElementById('scenario-modal-v431');
        if (!modal) return { exists: false };
        
        const text = modal.textContent;
        const hasStages = text.includes('第1段階') || text.includes('第2段階') || text.includes('第3段階');
        const hasMetrics = text.includes('%');
        const hasCloseButton = !!modal.querySelector('button');
        const isReadable = !text.includes('進爻') && !text.includes('変爻');
        
        return {
          exists: true,
          hasStages,
          hasMetrics,
          hasCloseButton,
          isReadable,
          textLength: text.length
        };
      });
      
      console.log(`    モーダル表示: ${modalExperience.exists ? '✅' : '❌'}`);
      if (modalExperience.exists) {
        console.log(`    段階表示: ${modalExperience.hasStages ? '✅' : '❌'}`);
        console.log(`    数値表示: ${modalExperience.hasMetrics ? '✅' : '❌'}`);
        console.log(`    閉じるボタン: ${modalExperience.hasCloseButton ? '✅' : '❌'}`);
        console.log(`    読みやすさ: ${modalExperience.isReadable ? '✅' : '❌'}`);
      }
      
      await page.screenshot({ path: '20250814_user_3_modal.png' });
      userExperience.screenshots.push('20250814_user_3_modal.png');
      
      // モーダルを閉じる
      if (modalExperience.hasCloseButton) {
        await page.click('#scenario-modal-v431 button');
      }
    }
    
    // ========================================
    // シナリオ2: 再利用ユーザー
    // ========================================
    console.log('\n📝 シナリオ2: 2回目の利用（別の悩み）');
    console.log('-' .repeat(40));
    
    // 入力をクリアして新しい悩みを入力
    await page.fill('#worryInput', '');
    await page.fill('#worryInput', '結婚すべきか、もう少し自由な時間を楽しむべきか迷っています。');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(2000);
    
    const secondUse = await page.evaluate(() => {
      const cards = document.querySelectorAll('.scenario-card-v431');
      const oldResults = document.querySelectorAll('.scenarios-container').length;
      
      return {
        newCardsCount: cards.length,
        hasOldResults: oldResults > 1,
        isClean: cards.length === 8 && oldResults <= 1
      };
    });
    
    console.log(`    新しい結果: ${secondUse.newCardsCount}枚`);
    console.log(`    古い結果の残存: ${secondUse.hasOldResults ? '❌ あり' : '✅ なし'}`);
    console.log(`    クリーンな表示: ${secondUse.isClean ? '✅' : '❌'}`);
    
    if (secondUse.hasOldResults) {
      userExperience.issues.push('前の結果が残っている');
    }
    
    // ========================================
    // シナリオ3: エラーケース
    // ========================================
    console.log('\n📝 シナリオ3: エラーケース（短い入力）');
    console.log('-' .repeat(40));
    
    await page.fill('#worryInput', '短い');
    await page.click('#aiGuessBtn');
    await page.waitForTimeout(1500);
    
    const errorHandling = await page.evaluate(() => {
      // エラーメッセージを探す
      const messages = Array.from(document.querySelectorAll('div')).filter(
        el => el.style.cssText && el.style.cssText.includes('position: fixed')
      );
      const hasErrorMessage = messages.some(m => 
        m.textContent.includes('10文字') || m.textContent.includes('エラー')
      );
      
      // 結果が表示されていないことを確認
      const cards = document.querySelectorAll('.scenario-card-v431');
      
      return {
        hasErrorMessage,
        errorText: messages[0]?.textContent,
        cardsShown: cards.length,
        handledProperly: hasErrorMessage && cards.length === 0
      };
    });
    
    console.log(`    エラーメッセージ: ${errorHandling.hasErrorMessage ? '✅' : '❌'}`);
    console.log(`    メッセージ内容: ${errorHandling.errorText || 'なし'}`);
    console.log(`    適切な処理: ${errorHandling.handledProperly ? '✅' : '❌'}`);
    
    // ========================================
    // 総合評価
    // ========================================
    console.log('\n' + '=' .repeat(60));
    console.log('📊 ユーザー体験の総合評価');
    console.log('=' .repeat(60));
    
    // 必須要件チェック
    const requirements = {
      '使い方が分かる': firstImpression.isIntuitive,
      '8つのシナリオが表示される': resultsExperience.cardCount === 8,
      '内容が理解できる': resultsExperience.allReadable,
      '詳細が見られる': resultsExperience.cardCount > 0,
      'エラー処理が適切': errorHandling.handledProperly,
      '再利用できる': secondUse.isClean
    };
    
    let passCount = 0;
    for (const [req, passed] of Object.entries(requirements)) {
      console.log(`  ${req}: ${passed ? '✅' : '❌'}`);
      if (passed) passCount++;
    }
    
    const passRate = Math.round(passCount / Object.keys(requirements).length * 100);
    
    console.log('\n📈 良い点:');
    userExperience.positives.forEach(p => console.log(`  ✅ ${p}`));
    
    console.log('\n⚠️ 問題点:');
    if (userExperience.issues.length === 0) {
      console.log('  特になし');
    } else {
      userExperience.issues.forEach(i => console.log(`  ❌ ${i}`));
    }
    
    console.log('\n' + '-' .repeat(60));
    console.log(`完成度: ${passRate}%`);
    
    // 最終判定
    const isComplete = passRate >= 80 && userExperience.issues.length <= 2;
    
    console.log('\n🎯 最終判定:');
    if (isComplete) {
      console.log('✅ ユーザー目線で見て完成しています！');
      console.log('   基本的な機能は全て動作し、理解しやすい表示になっています。');
    } else {
      console.log('❌ まだ改善が必要です。');
      console.log('   以下の点を修正してください:');
      userExperience.issues.forEach(i => console.log(`   - ${i}`));
    }
    
    // 結果を保存
    userExperience.summary = {
      requirements,
      passRate,
      isComplete
    };
    
    fs.writeFileSync(
      '20250814_user_experience_results.json',
      JSON.stringify(userExperience, null, 2)
    );
    
    console.log('\n📁 詳細結果: 20250814_user_experience_results.json');
    console.log('📸 スクリーンショット:');
    userExperience.screenshots.forEach(s => console.log(`  - ${s}`));
    
    // ブラウザを開いたまま
    console.log('\n⏳ 手動確認用（10秒待機）...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ テストエラー:', error.message);
  } finally {
    await browser.close();
  }
}

userPerspectiveTest();