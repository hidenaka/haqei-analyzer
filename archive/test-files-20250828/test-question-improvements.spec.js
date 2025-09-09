import { test, expect } from '@playwright/test';

test.describe('質問内容改善確認テスト', () => {
  test('全36問の改善内容確認と結果ページ遷移テスト', async ({ page }) => {
    // テスト開始
    await page.goto('http://localhost:8787/os_analyzer.html');
    
    // 初期画面の確認
    await expect(page.locator('h1')).toContainText('HaQei OS Analyzer');
    
    // スタートボタンをクリック
    await page.click('[data-action="start-analysis"]');
    
    // 改善された質問の確認サンプル
    const improvedQuestions = [
      {
        questionId: 'q1',
        expectedText: '新しいプロジェクトを始めるとき、どのように取り組みますか？',
        improvedOptions: [
          '自分で新しい方法を考える',
          '既存の方法を改良して使う'
        ]
      },
      {
        questionId: 'q25', 
        expectedText: '困難な状況に直面したとき、どのように対応しますか？',
        improvedOptions: [
          '新しい解決方法を考える',
          'リスクを避けて慎重に進む'
        ]
      },
      {
        questionId: 'q36',
        expectedText: 'あなたにとって「本当の強さ」とは何ですか？',
        improvedOptions: [
          'どんな困難も新しい方法で乗り越える力',
          '何があっても動じない安定性'
        ]
      }
    ];

    // 全36問を順番に確認
    for (let i = 1; i <= 36; i++) {
      console.log(`質問${i}を確認中...`);
      
      // 質問テキストの存在確認
      const questionText = await page.locator('.question-text').textContent();
      expect(questionText).toBeTruthy();
      console.log(`Q${i}: ${questionText}`);
      
      // 選択肢の確認
      const options = await page.locator('.option-text').allTextContents();
      expect(options).toHaveLength(5);
      
      // 改善内容の確認（サンプル質問の場合）
      const sampleQuestion = improvedQuestions.find(q => q.questionId === `q${i}`);
      if (sampleQuestion) {
        expect(questionText).toContain(sampleQuestion.expectedText);
        
        // 改善された選択肢の確認
        for (const improvedOption of sampleQuestion.improvedOptions) {
          const optionExists = options.some(option => option.includes(improvedOption));
          expect(optionExists).toBeTruthy();
        }
        
        console.log(`✅ Q${i}の改善内容確認完了`);
      }
      
      // 価値判断表現がないことを確認
      const hasValueJudgment = options.some(option => 
        option.includes('革新的') || 
        option.includes('斬新') || 
        option.includes('賢者') ||
        option.includes('状況による') ||
        option.includes('状況を見ながら')
      );
      expect(hasValueJudgment).toBeFalsy();
      
      // 最初の選択肢を選択して次へ
      await page.click('.option-button:first-child');
      await page.click('[data-action="next-question"]');
      
      // 最後の質問でない場合は次の質問を待つ
      if (i < 36) {
        await page.waitForSelector('.question-text');
      }
    }

    console.log('全36問の確認完了 - 結果ページへの遷移を確認中...');
    
    // 結果ページへの遷移を待つ
    await page.waitForSelector('.results-container', { timeout: 10000 });
    
    // 結果ページの要素確認
    await expect(page.locator('.results-container')).toBeVisible();
    await expect(page.locator('.triple-os-results')).toBeVisible();
    
    // Triple OS結果の表示確認
    const engineOSResult = await page.locator('[data-os="engine"]').textContent();
    const interfaceOSResult = await page.locator('[data-os="interface"]').textContent();
    const safeModeOSResult = await page.locator('[data-os="safe-mode"]').textContent();
    
    expect(engineOSResult).toBeTruthy();
    expect(interfaceOSResult).toBeTruthy();
    expect(safeModeOSResult).toBeTruthy();
    
    console.log('✅ 結果ページ表示確認完了');
    console.log(`Engine OS: ${engineOSResult}`);
    console.log(`Interface OS: ${interfaceOSResult}`);
    console.log(`Safe Mode OS: ${safeModeOSResult}`);
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: 'test-results/question-improvements-verification.png',
      fullPage: true 
    });
    
    console.log('✅ 全テスト完了 - スクリーンショット保存済み');
  });
  
  test('改善ポイント詳細確認', async ({ page }) => {
    await page.goto('http://localhost:8787/os_analyzer.html');
    await page.click('[data-action="start-analysis"]');
    
    // 特定の改善ポイントを詳細確認
    const detailedChecks = [
      {
        questionNumber: 1,
        shouldNotContain: ['斬新な', '革新的な'],
        shouldContain: ['新しい']
      },
      {
        questionNumber: 25,
        shouldNotContain: ['状況による', '状況を見ながら'],
        shouldContain: ['対応']
      },
      {
        questionNumber: 36,
        shouldNotContain: ['革新力'],
        shouldContain: ['力']
      }
    ];
    
    for (const check of detailedChecks) {
      // 指定された質問まで進む
      for (let i = 1; i < check.questionNumber; i++) {
        await page.click('.option-button:first-child');
        await page.click('[data-action="next-question"]');
        if (i < 36) await page.waitForSelector('.question-text');
      }
      
      const questionText = await page.locator('.question-text').textContent();
      const options = await page.locator('.option-text').allTextContents();
      const allText = questionText + ' ' + options.join(' ');
      
      // NGワードが含まれていないことを確認
      for (const ngWord of check.shouldNotContain) {
        expect(allText).not.toContain(ngWord);
      }
      
      // 必要なワードが含まれていることを確認
      for (const requiredWord of check.shouldContain) {
        expect(allText).toContain(requiredWord);
      }
      
      console.log(`✅ Q${check.questionNumber}の詳細確認完了`);
      
      // 次のチェックのためにページをリロード
      if (check !== detailedChecks[detailedChecks.length - 1]) {
        await page.reload();
        await page.click('[data-action="start-analysis"]');
      }
    }
  });
});