/**
 * 修正版USEPテスト - Triple OS結果表示対応
 */

import { chromium } from 'playwright';

// 仮想ユーザープロファイル
const virtualUser = {
  name: "佐藤 花子",
  age: 35,
  occupation: "UXデザイナー",
  answering_pattern: "balanced", // バランス型回答
  evaluation_focus: ["UI/UX", "結果の分かりやすさ", "実用性"]
};

async function runCorrectedTest() {
  console.log('🚀 修正版USEPテスト開始');
  console.log(`👤 仮想ユーザー: ${virtualUser.name}（${virtualUser.age}歳・${virtualUser.occupation}）\n`);
  
  const browser = await chromium.launch({ 
    headless: false, // デバッグのため表示
    slowMo: 500 // 操作を見やすくする
  });
  
  const page = await browser.newPage();
  const feedback = {
    ux: [],
    content: [],
    technical: [],
    improvements: []
  };
  
  try {
    // 1. ページアクセス
    console.log('📱 システムにアクセス...');
    await page.goto('http://localhost:8090/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    
    // 2. ウェルカム画面評価
    console.log('🎯 ウェルカム画面の評価...');
    const welcomeText = await page.textContent('.welcome-container');
    if (welcomeText) {
      if (welcomeText.includes('HaQei') || welcomeText.includes('Triple OS')) {
        feedback.content.push('✅ 哲学的コンセプトが明確に表示されている');
      } else {
        feedback.content.push('⚠️ システムの目的が不明確');
      }
    }
    
    // 3. 開始ボタンクリック
    console.log('🎮 診断を開始...');
    const startButton = await page.$('.start-button');
    if (startButton) {
      await startButton.click();
      feedback.ux.push('✅ 開始ボタンが明確で押しやすい');
    } else {
      feedback.ux.push('❌ 開始ボタンが見つからない');
      throw new Error('開始ボタンが見つかりません');
    }
    
    // 4. 30問に回答（修正されたセレクタ使用）
    console.log('📝 30問の質問に回答中...');
    let questionCount = 0;
    const maxQuestions = 30;
    const answers = [];
    
    while (questionCount < maxQuestions) {
      // 質問テキストを取得
      await page.waitForTimeout(1000);
      const questionText = await page.$eval('.question-text', el => el.textContent).catch(() => null);
      
      if (!questionText) {
        console.log(`  ⚠️ 質問 ${questionCount + 1} が表示されません`);
        break;
      }
      
      console.log(`  質問 ${questionCount + 1}: ${questionText.substring(0, 50)}...`);
      
      // 選択肢を取得（正しいセレクタ）
      const options = await page.$$('.option');
      
      if (options.length === 0) {
        feedback.technical.push(`❌ 質問${questionCount + 1}の選択肢が表示されない`);
        break;
      }
      
      // バランス型回答パターン（中庸を選ぶ）
      const selectedIndex = Math.floor(options.length / 2);
      if (options.length > 0) {
        await options[selectedIndex].click();
        console.log(`  ✅ 選択肢 ${selectedIndex + 1}/${options.length} をクリック`);
      } else {
        console.log('  ❌ 選択肢が見つかりません');
        break;
      }
      
      answers.push({ question: questionCount + 1, choice: selectedIndex });
      
      // 次へボタンをクリック
      await page.waitForTimeout(500); // 選択後少し待つ
      const nextButton = await page.$('button:has-text("次へ"), button:has-text("次の質問"), #next-btn');
      if (nextButton) {
        await nextButton.click();
        console.log(`  ✅ 次へボタンをクリック`);
      } else {
        console.log('  ⚠️ 次へボタンが見つかりません - 自動進行かもしれません');
      }
      
      questionCount++;
      
      // プログレス確認
      const progress = await page.$eval('.progress-bar, .progress-fill', el => {
        return el.style.width || '0%';
      }).catch(() => '0%');
      
      if (questionCount % 10 === 0) {
        console.log(`  📊 進捗: ${progress} (${questionCount}/${maxQuestions})`);
      }
    }
    
    if (questionCount === maxQuestions) {
      feedback.ux.push('✅ 全30問に問題なく回答完了');
    } else {
      feedback.ux.push(`⚠️ ${questionCount}問で停止（30問中）`);
    }
    
    // 5. 結果画面の評価
    console.log('\n🎯 結果画面の評価...');
    await page.waitForTimeout(3000); // 結果計算を待つ
    
    // Triple OS結果の確認（正しいセレクタ使用）
    const osCards = await page.$$('.os-card');
    
    if (osCards.length >= 3) {
      feedback.content.push(`✅ Triple OSカードが${osCards.length}個表示されている`);
      
      // 各OSカードの内容確認
      const cardTexts = [];
      for (let i = 0; i < Math.min(3, osCards.length); i++) {
        const cardText = await osCards[i].textContent();
        cardTexts.push(cardText);
      }
      
      // Engine OS, Interface OS, Safe Mode OSが含まれているか確認
      const hasEngine = cardTexts.some(text => text.includes('Engine OS'));
      const hasInterface = cardTexts.some(text => text.includes('Interface OS'));
      const hasSafeMode = cardTexts.some(text => text.includes('Safe Mode OS'));
      
      if (hasEngine && hasInterface && hasSafeMode) {
        feedback.content.push('✅ Engine OS, Interface OS, Safe Mode OSがすべて表示されている');
      } else {
        feedback.content.push(`⚠️ OSタイプの表示: Engine=${hasEngine}, Interface=${hasInterface}, SafeMode=${hasSafeMode}`);
      }
      
      // 64卦やHaQei哲学との連携確認
      const allCardText = cardTexts.join(' ');
      if (allCardText.includes('卦') || allCardText.includes('hexagram') || allCardText.includes('HaQei')) {
        feedback.content.push('✅ 易経64卦またはHaQei哲学との連携が機能している');
      } else {
        feedback.content.push('⚠️ 易経要素が結果に反映されていないかもしれません');
      }
      
      // Virtual Persona機能確認
      if (allCardText.includes('ペルソナ') || allCardText.includes('persona') || allCardText.includes('キャッチフレーズ')) {
        feedback.content.push('✅ Virtual Persona機能が動作している');
      }
      
      // 結果の質確認
      if (allCardText.length > 200) { // 十分な情報量
        feedback.content.push('✅ 詳細な分析結果が提供されている');
      }
      
    } else {
      feedback.content.push(`❌ Triple OSカードが不十分です: ${osCards.length}個のみ表示`);
    }
    
    // Chart.js可視化の確認
    const charts = await page.$$('canvas');
    if (charts.length > 0) {
      feedback.ux.push(`✅ ${charts.length}個のチャート可視化が実装されている`);
    } else {
      feedback.improvements.push('📊 視覚的なグラフ表示があると理解しやすい');
    }
    
    // 6. スクリーンショット保存
    await page.screenshot({ path: 'corrected-usep-result-screenshot.png', fullPage: true });
    console.log('📸 結果画面のスクリーンショットを保存');
    
    // 7. パフォーマンス評価
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart
      };
    });
    
    if (performanceMetrics.loadTime < 3000) {
      feedback.technical.push(`✅ ページ読み込み速度: ${performanceMetrics.loadTime}ms（良好）`);
    } else {
      feedback.technical.push(`⚠️ ページ読み込み速度: ${performanceMetrics.loadTime}ms（改善余地あり）`);
    }
    
  } catch (error) {
    console.error('❌ エラー発生:', error.message);
    feedback.technical.push(`❌ エラー: ${error.message}`);
  } finally {
    // フィードバックレポート出力
    console.log('\n' + '='.repeat(60));
    console.log('📊 修正版USEPフィードバックレポート');
    console.log('='.repeat(60));
    
    console.log('\n【UX/UI評価】');
    feedback.ux.forEach(item => console.log(`  ${item}`));
    
    console.log('\n【コンテンツ品質】');
    feedback.content.forEach(item => console.log(`  ${item}`));
    
    console.log('\n【技術的評価】');
    feedback.technical.forEach(item => console.log(`  ${item}`));
    
    if (feedback.improvements.length > 0) {
      console.log('\n【改善提案】');
      feedback.improvements.forEach(item => console.log(`  ${item}`));
    }
    
    // 総合スコア計算
    const positiveCount = [
      ...feedback.ux.filter(f => f.includes('✅')),
      ...feedback.content.filter(f => f.includes('✅')),
      ...feedback.technical.filter(f => f.includes('✅'))
    ].length;
    
    const totalCount = feedback.ux.length + feedback.content.length + feedback.technical.length;
    const score = Math.round((positiveCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 総合評価スコア: ${score}/100点`);
    
    if (score >= 80) {
      console.log('✨ 優秀: ユーザー体験は高品質です');
    } else if (score >= 60) {
      console.log('👍 良好: 基本機能は動作していますが改善余地があります');
    } else {
      console.log('⚠️ 要改善: 重要な問題が複数存在します');
    }
    
    await browser.close();
    console.log('\n✅ 修正版USEPテスト完了');
  }
}

// 実行
runCorrectedTest().catch(console.error);