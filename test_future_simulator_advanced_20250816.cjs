/**
 * Future Simulator 高度分析システム動作確認テスト
 * 236KBの未使用コードを全部使って動的分析が動作するか検証
 * 
 * @date 2025-08-16
 */

const { chromium } = require('playwright');

console.log('🔍 Future Simulator 高度分析システム動作テスト開始');
console.log(`📅 実行日時: ${new Date().toISOString()}`);

async function testAdvancedAnalysis() {
  let browser = null;
  let page = null;
  
  // テストケース（異なる内容で異なる結果が出るか確認）
  const testCases = [
    {
      id: 'case1',
      input: '新しい仕事に転職するか迷っています。今の会社は安定していますが、やりがいを感じられません。',
      expectedKeywords: ['転職', '仕事', '安定', 'やりがい']
    },
    {
      id: 'case2', 
      input: '恋人との関係がうまくいかず、将来が不安です。結婚の話も出ていますが、本当にこの人でいいのか迷っています。',
      expectedKeywords: ['恋人', '関係', '将来', '結婚', '不安']
    },
    {
      id: 'case3',
      input: '起業を考えていますが、資金調達で困っています。リスクも大きく、家族のことを考えると踏み切れません。',
      expectedKeywords: ['起業', '資金', 'リスク', '家族']
    }
  ];
  
  const results = [];
  
  try {
    console.log('🌐 ブラウザ起動中...');
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });
    
    page = await browser.newPage();
    
    // コンソールログを監視
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('高度分析版') || 
          text.includes('Kuromoji') || 
          text.includes('DynamicKeyword') ||
          text.includes('IntegratedAnalysis') ||
          text.includes('I Ching分析')) {
        console.log(`  📝 ${text}`);
      }
    });
    
    // エラー監視
    page.on('pageerror', (error) => {
      console.error('❌ ページエラー:', error.message);
    });
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n📊 テストケース${i + 1}: ${testCase.id}`);
      console.log(`  入力: "${testCase.input.substring(0, 50)}..."`);
      
      // ページアクセス
      await page.goto('http://localhost:8788/future_simulator.html', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // ページ読み込み待機
      await page.waitForTimeout(3000);
      
      // 入力フィールドを探す
      const inputSelector = '#worryInput, textarea[placeholder*="悩み"], textarea';
      await page.waitForSelector(inputSelector, { timeout: 10000 });
      
      // テキスト入力
      await page.fill(inputSelector, testCase.input);
      console.log('  ✅ テキスト入力完了');
      
      // 分析ボタンをクリック
      const buttonSelector = '#aiGuessBtn, button:has-text("分析"), button:has-text("AI")';
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      await page.click(buttonSelector);
      console.log('  ✅ 分析実行');
      
      // 分析完了まで待機
      await page.waitForTimeout(8000);
      
      // 結果を取得
      const analysisResult = await page.evaluate(() => {
        // グローバル変数から統合分析結果を取得
        const integrated = window.integratedAnalysisResult;
        
        // 表示されている結果も取得
        const displayedResults = [];
        const cards = document.querySelectorAll('.scenario-card, .result-card');
        cards.forEach(card => {
          displayedResults.push(card.textContent);
        });
        
        return {
          hasIntegratedResult: !!integrated,
          hasMorphology: !!(integrated?.morphology),
          hasKeywords: !!(integrated?.keywords),
          hasContext: !!(integrated?.context),
          hasIching: !!(integrated?.iching),
          hexagramName: integrated?.iching?.hexagram?.name || 'なし',
          yaoName: integrated?.iching?.yao?.name || 'なし',
          keywordCount: integrated?.keywords?.final?.length || 0,
          displayedCardsCount: displayedResults.length,
          timestamp: integrated?.timestamp
        };
      });
      
      // 結果を記録
      results.push({
        testCase: testCase.id,
        input: testCase.input,
        result: analysisResult
      });
      
      // スクリーンショット撮影
      await page.screenshot({ 
        path: `test_advanced_${testCase.id}.png`,
        fullPage: false
      });
      
      console.log('  📊 分析結果:');
      console.log(`    - 統合分析: ${analysisResult.hasIntegratedResult ? '✅' : '❌'}`);
      console.log(`    - 形態素解析: ${analysisResult.hasMorphology ? '✅' : '❌'}`);
      console.log(`    - キーワード生成: ${analysisResult.hasKeywords ? '✅' : '❌'} (${analysisResult.keywordCount}個)`);
      console.log(`    - コンテキスト分析: ${analysisResult.hasContext ? '✅' : '❌'}`);
      console.log(`    - I Ching分析: ${analysisResult.hasIching ? '✅' : '❌'}`);
      console.log(`    - 卦名: ${analysisResult.hexagramName}`);
      console.log(`    - 爻名: ${analysisResult.yaoName}`);
      console.log(`    - 表示カード数: ${analysisResult.displayedCardsCount}`);
    }
    
    // 結果の比較
    console.log('\n' + '='.repeat(80));
    console.log('📊 テスト結果分析');
    console.log('='.repeat(80));
    
    // 各ケースで異なる結果が出ているか確認
    const hexagrams = new Set();
    const yaos = new Set();
    
    results.forEach(r => {
      hexagrams.add(r.result.hexagramName);
      yaos.add(r.result.yaoName);
    });
    
    console.log(`\n🎯 動的分析の検証:`);
    console.log(`  異なる卦の数: ${hexagrams.size}/3`);
    console.log(`  異なる爻の数: ${yaos.size}/3`);
    
    // 高度な分析システムの使用状況
    let advancedSystemsUsed = 0;
    results.forEach(r => {
      if (r.result.hasMorphology) advancedSystemsUsed++;
      if (r.result.hasKeywords) advancedSystemsUsed++;
      if (r.result.hasContext) advancedSystemsUsed++;
      if (r.result.hasIching) advancedSystemsUsed++;
    });
    
    console.log(`\n🚀 高度システム使用率:`);
    console.log(`  ${advancedSystemsUsed}/${results.length * 4} (${Math.round(advancedSystemsUsed / (results.length * 4) * 100)}%)`);
    
    // 総合評価
    const isDynamic = hexagrams.size > 1 || yaos.size > 1;
    const isAdvanced = advancedSystemsUsed > results.length * 2;
    
    console.log(`\n📊 総合評価:`);
    if (isDynamic && isAdvanced) {
      console.log('  🎉 成功 - 高度な動的分析が正常に動作しています！');
      console.log('  236KBのコードが活用されています！');
    } else if (isDynamic) {
      console.log('  ⚠️ 部分的成功 - 動的分析は動作していますが、高度システムの一部が未使用');
    } else {
      console.log('  ❌ 失敗 - まだ固定結果のままです');
    }
    
    return {
      success: isDynamic && isAdvanced,
      results
    };
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
    return { error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// メイン実行
testAdvancedAnalysis()
  .then(result => {
    console.log('\n✅ テスト完了');
    if (result.success) {
      console.log('🎊 高度分析システムは正常に動作しています！');
    }
  })
  .catch(console.error);