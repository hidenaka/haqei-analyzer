/**
 * 動的分析機能デバッグシステム
 * 実際の分析ロジックが動作しているかを詳細検証
 * 
 * @date 2025-08-16
 */

const { chromium } = require('playwright');
const fs = require('fs');

console.log('🔍 動的分析機能デバッグ開始');
console.log(`📅 実行日時: ${new Date().toISOString()}`);

async function debugAnalysisLogic() {
  let browser = null;
  let page = null;
  
  const testInputs = [
    {
      id: 'test1',
      text: '新しい仕事で人手不足で困っています。チームの協力を得て効率的に進めたいです。',
      expected: 'チーム運営、人員不足関連のキーワード'
    },
    {
      id: 'test2', 
      text: '恋人との関係がうまくいかず、将来が不安です。結婚について話し合いたいけど怖いです。',
      expected: '恋愛、将来不安関連のキーワード'
    },
    {
      id: 'test3',
      text: '起業を考えていますが、資金調達がうまくいきません。リスクを考えると踏み切れません。',
      expected: '起業、資金、リスク関連のキーワード'
    }
  ];
  
  const results = [];
  
  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000
    });
    page = await browser.newPage();
    
    // コンソールログを監視
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });
    
    for (let i = 0; i < testInputs.length; i++) {
      const testInput = testInputs[i];
      console.log(`\\n🧪 テスト${i + 1}: ${testInput.id}`);
      
      // ページアクセス
      await page.goto('http://localhost:8788/future_simulator.html', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      await page.waitForTimeout(3000);
      
      // 入力フィールドに異なるテキストを入力
      const inputSelector = 'textarea[placeholder*="悩み"], input[type="text"], textarea';
      await page.waitForSelector(inputSelector, { timeout: 10000 });
      await page.fill(inputSelector, testInput.text);
      
      console.log(`📝 入力完了: "${testInput.text.substring(0, 50)}..."`);
      
      // 分析実行
      const buttonSelector = 'button[onclick*="analyze"], button:has-text("分析"), button:has-text("開始"), .analyze-button, #analyze-btn';
      await page.waitForSelector(buttonSelector, { timeout: 5000 });
      await page.click(buttonSelector);
      
      console.log('🔄 分析実行中...');
      await page.waitForTimeout(6000);
      
      // 結果を詳細取得
      const analysisResult = await page.evaluate(() => {
        // 現在の状況
        const currentSituation = document.querySelector('.scenario-card, [id*="result"], .analysis-result')?.textContent || 'なし';
        
        // 卦名
        const hexagramName = document.querySelector('h3, .hexagram-name, [class*="hexagram"]')?.textContent || 'なし';
        
        // キーワード
        const keywords = document.querySelector('[class*="keyword"], .keywords')?.textContent || 'なし';
        
        // スコア
        const score = document.querySelector('[class*="score"], .score')?.textContent || 'なし';
        
        // 全結果カード
        const allCards = Array.from(document.querySelectorAll('.scenario-card, .result-card, .analysis-result')).map(card => ({
          text: card.textContent?.substring(0, 100) || '',
          className: card.className || ''
        }));
        
        return {
          currentSituation,
          hexagramName,
          keywords,
          score,
          allCards,
          inputValue: document.querySelector('textarea, input[type="text"]')?.value || ''
        };
      });
      
      // スクリーンショット撮影
      await page.screenshot({ 
        path: `analysis_debug_${testInput.id}.png`,
        fullPage: false 
      });
      
      results.push({
        testId: testInput.id,
        inputText: testInput.text,
        expectedKeywords: testInput.expected,
        actualResult: analysisResult,
        consoleMessages: [...consoleMessages]
      });
      
      console.log(`📊 結果取得完了: ${testInput.id}`);
      console.log(`   卦名: ${analysisResult.hexagramName}`);
      console.log(`   キーワード: ${analysisResult.keywords}`);
      console.log(`   スコア: ${analysisResult.score}`);
    }
    
    // 結果分析
    console.log('\\n' + '='.repeat(80));
    console.log('🔍 動的分析機能デバッグ結果');
    console.log('='.repeat(80));
    
    let isDynamic = false;
    let isStatic = true;
    
    // 結果の一意性チェック
    const uniqueResults = new Set();
    results.forEach(result => {
      const resultKey = `${result.actualResult.hexagramName}-${result.actualResult.keywords}-${result.actualResult.score}`;
      uniqueResults.add(resultKey);
    });
    
    if (uniqueResults.size > 1) {
      isDynamic = true;
      isStatic = false;
      console.log('✅ 動的分析確認: 異なる入力で異なる結果が生成されています');
    } else {
      console.log('❌ 固定結果確認: 全ての入力に対して同じ結果が表示されています');
    }
    
    // 詳細結果表示
    results.forEach((result, index) => {
      console.log(`\\n📋 テスト${index + 1} (${result.testId}):`);
      console.log(`   入力: "${result.inputText.substring(0, 80)}..."`);
      console.log(`   期待: ${result.expectedKeywords}`);
      console.log(`   実際の卦名: ${result.actualResult.hexagramName}`);
      console.log(`   実際のキーワード: ${result.actualResult.keywords}`);
      console.log(`   実際のスコア: ${result.actualResult.score}`);
      console.log(`   カード数: ${result.actualResult.allCards.length}`);
    });
    
    // 入力内容との関連性チェック
    console.log('\\n🎯 入力内容との関連性分析:');
    results.forEach(result => {
      const inputText = result.inputText.toLowerCase();
      const keywords = result.actualResult.keywords.toLowerCase();
      
      let relevance = 'なし';
      if (inputText.includes('仕事') && keywords.includes('チャンス')) {
        relevance = '低い（仕事の悩みなのにチャンス到来？）';
      } else if (inputText.includes('恋人') && keywords.includes('出会い')) {
        relevance = '中程度（恋愛関係だが新しい出会い？）';
      } else if (inputText.includes('起業') && keywords.includes('公の場')) {
        relevance = '低い（起業の悩みなのに公の場？）';
      }
      
      console.log(`   ${result.testId}: 関連性=${relevance}`);
    });
    
    // 動的要素チェック
    console.log('\\n🔧 システム機能チェック:');
    console.log(`   結果の多様性: ${uniqueResults.size}/3`);
    console.log(`   動的分析: ${isDynamic ? '動作' : '未動作'}`);
    console.log(`   固定結果: ${isStatic ? 'あり' : 'なし'}`);
    
    // 総合評価
    let overallStatus;
    if (isDynamic && uniqueResults.size === 3) {
      overallStatus = '🎉 正常 - 動的分析が正しく動作';
    } else if (uniqueResults.size > 1) {
      overallStatus = '⚠️ 部分的動作 - 一部動的だが不完全';
    } else {
      overallStatus = '🚨 重大問題 - 完全に固定結果のみ';
    }
    
    console.log(`\\n📊 総合評価: ${overallStatus}`);
    
    return {
      isDynamic,
      isStatic,
      uniqueResults: uniqueResults.size,
      totalTests: results.length,
      overallStatus,
      results
    };
    
  } catch (error) {
    console.error(`❌ デバッグエラー: ${error.message}`);
    return { error: error.message, results };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * メイン実行関数
 */
async function runAnalysisDebug() {
  const debugResults = await debugAnalysisLogic();
  
  // 結果をファイルに保存
  fs.writeFileSync(
    `analysis_debug_report_${new Date().toISOString().split('T')[0]}.json`,
    JSON.stringify(debugResults, null, 2)
  );
  
  return debugResults;
}

// メイン実行
if (require.main === module) {
  runAnalysisDebug().catch(console.error);
}

module.exports = { runAnalysisDebug };