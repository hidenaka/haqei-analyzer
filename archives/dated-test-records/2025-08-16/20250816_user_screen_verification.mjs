/**
 * ユーザー画面検証
 */

import { chromium } from 'playwright';

async function verifyUserScreen() {
  console.log('👀 ユーザー画面検証開始');
  console.log('=====================================\n');
  
  const browser = await chromium.launch({ 
    headless: false
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🌐 Future Simulatorページ読み込み中...');
    await page.goto('http://localhost:8788/future_simulator.html', { 
      waitUntil: 'networkidle'
    });
    
    // 初期画面確認
    console.log('\n📋 初期画面確認');
    const initialState = await page.evaluate(() => {
      return {
        title: document.title,
        inputVisible: !!document.querySelector('textarea'),
        buttonVisible: !!document.querySelector('#aiGuessBtn'),
        resultsVisible: document.getElementById('resultsContainer')?.style.display !== 'none'
      };
    });
    
    console.log(`  ページタイトル: ${initialState.title}`);
    console.log(`  入力フォーム: ${initialState.inputVisible ? '✅ 表示' : '❌ 非表示'}`);
    console.log(`  分析ボタン: ${initialState.buttonVisible ? '✅ 表示' : '❌ 非表示'}`);
    console.log(`  結果エリア: ${initialState.resultsVisible ? '❌ 既に表示' : '✅ 非表示'}`);
    
    // テスト入力実行
    console.log('\n📝 テスト入力実行');
    const testInput = '転職を考えているが、今の会社も悪くない。新しい挑戦をしたい気持ちと安定への不安で迷っている。';
    await page.fill('textarea', testInput);
    console.log(`  入力内容: "${testInput.substring(0, 30)}..."`);
    
    console.log('\n🔄 分析実行中...');
    await page.click('#aiGuessBtn');
    
    // 結果表示待機
    await page.waitForTimeout(4000);
    
    // 表示結果詳細確認
    console.log('\n📊 表示結果詳細確認');
    const displayResults = await page.evaluate(() => {
      const container = document.getElementById('resultsContainer');
      const futureSimContainer = document.querySelector('.future-simulator-container');
      
      // 現在の状況セクション
      const currentSituation = document.querySelector('.current-situation');
      const situationInfo = currentSituation?.querySelector('.situation-info')?.innerText;
      
      // グラフ確認
      const chartContainer = document.querySelector('.score-chart-container');
      const chart = document.getElementById('scoreChart');
      
      // カード確認
      const cards = document.querySelectorAll('.scenario-card');
      const cardDetails = Array.from(cards).slice(0, 3).map(card => {
        const header = card.querySelector('.card-header h4')?.innerText;
        const strategyType = card.querySelector('.strategy-type')?.innerText;
        const scoreChange = card.querySelector('.score-change')?.innerText;
        const processDesc = card.querySelector('.process-description')?.innerText;
        const difficulty = card.querySelector('.difficulty')?.innerText;
        const trend = card.querySelector('.trend')?.innerText;
        
        return {
          header: header || 'なし',
          strategyType: strategyType || 'なし',
          scoreChange: scoreChange || 'なし',
          processDesc: processDesc || 'なし',
          difficulty: difficulty || 'なし',
          trend: trend || 'なし'
        };
      });
      
      return {
        containerDisplayed: container?.style.display !== 'none',
        hasNewSystem: !!futureSimContainer,
        currentSituation: situationInfo || 'なし',
        hasChart: !!chart,
        chartVisible: chartContainer?.style.display !== 'none',
        cardCount: cards.length,
        cardDetails: cardDetails,
        hasExpressionEngine: !!window.FutureSimulatorExpression,
        hasDisplayEngine: !!window.FutureSimulatorDisplay
      };
    });
    
    console.log(`  結果コンテナ表示: ${displayResults.containerDisplayed ? '✅' : '❌'}`);
    console.log(`  新表示システム: ${displayResults.hasNewSystem ? '✅' : '❌'}`);
    console.log(`  表現エンジン: ${displayResults.hasExpressionEngine ? '✅' : '❌'}`);
    console.log(`  表示エンジン: ${displayResults.hasDisplayEngine ? '✅' : '❌'}`);
    
    // 現在の状況表示確認
    console.log('\n📍 現在の状況表示:');
    console.log(`  ${displayResults.currentSituation}`);
    
    // グラフ表示確認
    console.log('\n📈 グラフ表示確認:');
    console.log(`  グラフ要素: ${displayResults.hasChart ? '✅ 存在' : '❌ 不在'}`);
    console.log(`  グラフ表示: ${displayResults.chartVisible ? '✅ 表示' : '❌ 非表示'}`);
    
    // カード表示確認
    console.log('\n🃏 シナリオカード確認:');
    console.log(`  カード数: ${displayResults.cardCount}枚`);
    
    if (displayResults.cardDetails.length > 0) {
      displayResults.cardDetails.forEach((card, i) => {
        console.log(`\n  カード${i+1}:`);
        console.log(`    ヘッダー: ${card.header}`);
        console.log(`    戦略タイプ: ${card.strategyType}`);
        console.log(`    スコア変化: ${card.scoreChange}`);
        console.log(`    説明: ${card.processDesc}`);
        console.log(`    難易度: ${card.difficulty}`);
        console.log(`    トレンド: ${card.trend}`);
      });
    }
    
    // モーダル機能確認
    if (displayResults.cardCount > 0) {
      console.log('\n🖱️ モーダル機能確認');
      await page.click('.scenario-card:first-child');
      await page.waitForTimeout(1000);
      
      const modalCheck = await page.evaluate(() => {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');
        
        // 詳細内容確認
        const phaseDetails = modalBody?.querySelectorAll('.phase-detail');
        const summary = modalBody?.querySelector('.summary');
        const predictionSummary = modalBody?.querySelector('.prediction-summary');
        
        // 感情配慮表現確認
        const scoreExpressions = Array.from(modalBody?.querySelectorAll('.score-expression') || [])
          .map(el => el.innerText);
        const guidances = Array.from(modalBody?.querySelectorAll('.guidance') || [])
          .map(el => el.innerText);
        const predictions = Array.from(modalBody?.querySelectorAll('.prediction') || [])
          .map(el => el.innerText);
        
        return {
          modalVisible: modal?.style.display !== 'none',
          phaseCount: phaseDetails?.length || 0,
          hasSummary: !!summary,
          hasPredictionSummary: !!predictionSummary,
          scoreExpressions: scoreExpressions,
          guidances: guidances,
          predictions: predictions,
          modalContent: modalBody?.innerText?.substring(0, 300)
        };
      });
      
      console.log(`  モーダル表示: ${modalCheck.modalVisible ? '✅' : '❌'}`);
      console.log(`  フェーズ詳細: ${modalCheck.phaseCount}個`);
      console.log(`  総合評価: ${modalCheck.hasSummary ? '✅' : '❌'}`);
      console.log(`  予測サマリー: ${modalCheck.hasPredictionSummary ? '✅' : '❌'}`);
      
      // 感情配慮表現の実装確認
      console.log('\n🎭 感情配慮表現確認:');
      console.log(`  スコア表現数: ${modalCheck.scoreExpressions.length}個`);
      if (modalCheck.scoreExpressions.length > 0) {
        console.log(`    例: "${modalCheck.scoreExpressions[0]}"`);
      }
      
      console.log(`  行動指針数: ${modalCheck.guidances.length}個`);
      if (modalCheck.guidances.length > 0) {
        console.log(`    例: "${modalCheck.guidances[0]}"`);
      }
      
      console.log(`  予測表現数: ${modalCheck.predictions.length}個`);
      if (modalCheck.predictions.length > 0) {
        console.log(`    例: "${modalCheck.predictions[0]}"`);
      }
      
      // モーダル内容サンプル
      if (modalCheck.modalContent) {
        console.log(`\n📄 モーダル内容サンプル:\n"${modalCheck.modalContent}..."`);
      }
    }
    
    // 問題点チェック
    console.log('\n🔍 問題点チェック');
    const issueCheck = await page.evaluate(() => {
      const issues = [];
      
      // JavaScriptエラー確認
      if (window.jsErrors && window.jsErrors.length > 0) {
        issues.push(`JavaScriptエラー: ${window.jsErrors.length}件`);
      }
      
      // 表示崩れ確認
      const cards = document.querySelectorAll('.scenario-card');
      const brokenCards = Array.from(cards).filter(card => 
        !card.querySelector('.strategy-type') || 
        !card.querySelector('.difficulty')
      ).length;
      if (brokenCards > 0) {
        issues.push(`表示崩れカード: ${brokenCards}枚`);
      }
      
      // 空のコンテンツ確認
      const emptyElements = document.querySelectorAll('.process-description');
      const emptyCount = Array.from(emptyElements).filter(el => 
        !el.innerText || el.innerText.trim() === '' || el.innerText.includes('...')
      ).length;
      if (emptyCount > 0) {
        issues.push(`空の説明: ${emptyCount}個`);
      }
      
      return issues;
    });
    
    if (issueCheck.length > 0) {
      console.log('  ❌ 発見された問題:');
      issueCheck.forEach(issue => console.log(`    - ${issue}`));
    } else {
      console.log('  ✅ 大きな問題は発見されませんでした');
    }
    
    // スクリーンショット
    await page.screenshot({ 
      path: '20250816_user_screen_verification.png',
      fullPage: false
    });
    console.log('\n📸 スクリーンショット保存: 20250816_user_screen_verification.png');
    
    // 総合評価
    const overallSuccess = displayResults.hasNewSystem && 
                          displayResults.cardCount === 8 && 
                          displayResults.hasExpressionEngine && 
                          issueCheck.length === 0;
    
    console.log('\n' + '='.repeat(50));
    console.log(overallSuccess ? '✅ 実装成功 - 正常動作確認' : '⚠️ 改善が必要');
    console.log('='.repeat(50));
    
  } finally {
    console.log('\n⏰ 15秒後にブラウザを閉じます...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

// 実行
verifyUserScreen().catch(console.error);