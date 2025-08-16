/**
 * Phase 1 実装検証テスト
 * 設計フレームワーク準拠確認
 */

import { chromium } from 'playwright';

async function validatePhase1Implementation() {
  console.log('🎯 Phase 1 実装検証開始');
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
    
    // テスト入力実行
    console.log('📝 テスト入力実行');
    const testInput = '新しい挑戦をしたいが、安定も重要。どの道筋が最適か悩んでいる。';
    await page.fill('textarea', testInput);
    console.log(`  入力内容: "${testInput}"`);
    
    console.log('🔄 分析実行中...');
    await page.click('#aiGuessBtn');
    
    // 結果表示待機
    await page.waitForTimeout(4000);
    
    // Phase 1 検証項目
    console.log('\n📊 Phase 1 検証結果');
    console.log('=====================================');
    
    const validationResults = await page.evaluate(() => {
      const container = document.getElementById('resultsContainer');
      const cards = document.querySelectorAll('.scenario-card');
      
      // 1. カード説明文切り捨て問題解決確認
      const cardDescriptions = Array.from(cards).map(card => {
        const desc = card.querySelector('.process-description')?.innerText || '';
        return {
          length: desc.length,
          hasEllipsis: desc.includes('...'),
          content: desc.substring(0, 50)
        };
      });
      
      // 2. 戦略タイプ多様性確認
      const strategyTypes = Array.from(cards).map(card => 
        card.querySelector('.strategy-type')?.innerText || 'なし'
      );
      
      const uniqueStrategyTypes = [...new Set(strategyTypes)];
      
      // 3. 表現エンジン統合確認
      const hasExpressionEngine = !!window.FutureSimulatorExpression;
      const hasDisplayEngine = !!window.FutureSimulatorDisplay;
      
      // 4. HaQei統一表現確認
      const bodyText = document.body.innerText;
      const hasHaQeiMentions = bodyText.includes('HaQei');
      const hasPredictionLanguage = bodyText.includes('予測され') || 
                                   bodyText.includes('見込まれ') ||
                                   bodyText.includes('期待でき');
      
      return {
        cardCount: cards.length,
        cardDescriptions: cardDescriptions,
        strategyTypes: strategyTypes,
        uniqueStrategyTypes: uniqueStrategyTypes,
        hasExpressionEngine: hasExpressionEngine,
        hasDisplayEngine: hasDisplayEngine,
        hasHaQeiMentions: hasHaQeiMentions,
        hasPredictionLanguage: hasPredictionLanguage
      };
    });
    
    // 検証結果評価
    console.log('### Task 1.1: カード説明文切り捨て問題修正');
    const descriptionsFixed = validationResults.cardDescriptions.every(desc => 
      desc.length > 30 && (!desc.hasEllipsis || desc.length > 40)
    );
    console.log(`  結果: ${descriptionsFixed ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`  詳細: 平均文字数 ${Math.round(
      validationResults.cardDescriptions.reduce((sum, desc) => sum + desc.length, 0) / 
      validationResults.cardDescriptions.length
    )}文字`);
    
    console.log('\n### Task 1.2: 戦略タイプ判定ロジック強化');
    const strategyDiversified = validationResults.uniqueStrategyTypes.length >= 4;
    console.log(`  結果: ${strategyDiversified ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`  戦略タイプ数: ${validationResults.uniqueStrategyTypes.length}種類`);
    console.log(`  タイプ詳細: ${validationResults.uniqueStrategyTypes.join(', ')}`);
    
    console.log('\n### Task 1.3: UI統合');
    const uiIntegrated = validationResults.hasExpressionEngine && 
                        validationResults.hasDisplayEngine &&
                        validationResults.cardCount === 8;
    console.log(`  結果: ${uiIntegrated ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`  表現エンジン: ${validationResults.hasExpressionEngine ? '✅' : '❌'}`);
    console.log(`  表示エンジン: ${validationResults.hasDisplayEngine ? '✅' : '❌'}`);
    console.log(`  カード数: ${validationResults.cardCount}枚`);
    
    console.log('\n### 統一性チェック: HaQei設計フレームワーク準拠');
    const frameworkCompliant = validationResults.hasHaQeiMentions && 
                              validationResults.hasPredictionLanguage;
    console.log(`  結果: ${frameworkCompliant ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`  HaQei言及: ${validationResults.hasHaQeiMentions ? '✅' : '❌'}`);
    console.log(`  予測表現: ${validationResults.hasPredictionLanguage ? '✅' : '❌'}`);
    
    // 総合評価
    const overallSuccess = descriptionsFixed && strategyDiversified && 
                          uiIntegrated && frameworkCompliant;
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎯 Phase 1 実装検証結果: ${overallSuccess ? '✅ 成功' : '⚠️ 部分成功'}`);
    console.log('='.repeat(50));
    
    // 詳細レポート生成
    const reportData = {
      timestamp: new Date().toISOString(),
      phase: 'Phase 1',
      tasks: {
        'Task 1.1': { status: descriptionsFixed ? 'success' : 'failed', focus: 'カード説明文修正' },
        'Task 1.2': { status: strategyDiversified ? 'success' : 'failed', focus: '戦略タイプ強化' },
        'Task 1.3': { status: uiIntegrated ? 'success' : 'failed', focus: 'UI統合' }
      },
      frameworkCompliance: {
        status: frameworkCompliant ? 'success' : 'failed',
        details: {
          haQeiMentions: validationResults.hasHaQeiMentions,
          predictionLanguage: validationResults.hasPredictionLanguage
        }
      },
      metrics: {
        cardCount: validationResults.cardCount,
        strategyTypeCount: validationResults.uniqueStrategyTypes.length,
        avgDescriptionLength: Math.round(
          validationResults.cardDescriptions.reduce((sum, desc) => sum + desc.length, 0) / 
          validationResults.cardDescriptions.length
        )
      },
      overallSuccess: overallSuccess
    };
    
    return reportData;
    
  } finally {
    console.log('\\n⏰ 10秒後にブラウザを閉じます...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// 実行
const report = await validatePhase1Implementation().catch(console.error);
console.log('\\n📄 検証レポート完了');