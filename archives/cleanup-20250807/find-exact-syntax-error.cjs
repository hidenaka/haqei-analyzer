const { chromium } = require('playwright');
const fs = require('fs');

async function findExactSyntaxError() {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('🔍 構文エラーの詳細調査開始...');
    
    // すべてのコンソールメッセージをキャッチ
    const allErrors = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type.toUpperCase()}] ${text}`);
    });
    
    page.on('pageerror', error => {
      console.log(`❌ Page Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
      allErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });

    // ネットワークエラーもキャッチ
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`🌐 Network Error: ${response.url()} - ${response.status()}`);
      }
    });

    await page.goto('http://127.0.0.1:8788/future_simulator.html', {
      waitUntil: 'networkidle',
      timeout: 20000
    });
    
    console.log('✅ ページ読み込み完了、エラー詳細を分析中...');
    
    // 5秒待機してすべてのスクリプト読み込みを待つ
    await page.waitForTimeout(5000);
    
    // 詳細なエラー分析
    const errorAnalysis = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const errors = window.console ? window.console._errors || [] : [];
      
      return {
        totalScripts: scripts.length,
        scriptSources: scripts.map(s => s.src).slice(0, 20),
        windowErrors: errors,
        hasGlobalObjects: {
          window: typeof window !== 'undefined',
          document: typeof document !== 'undefined',
          console: typeof console !== 'undefined',
          fetch: typeof fetch !== 'undefined'
        },
        customObjects: {
          IntegratedAnalysisEngine: typeof window.IntegratedAnalysisEngine,
          BinaryTreeFutureEngine: typeof window.BinaryTreeFutureEngine,
          EightScenariosGenerator: typeof window.EightScenariosGenerator,
          FutureSimulator: typeof window.FutureSimulator
        }
      };
    });
    
    console.log('\n📊 エラー分析結果:');
    console.log('スクリプト総数:', errorAnalysis.totalScripts);
    console.log('カスタムオブジェクト状態:', errorAnalysis.customObjects);
    
    if (allErrors.length > 0) {
      console.log('\n🚨 キャッチされたエラー:');
      allErrors.forEach((error, i) => {
        console.log(`${i + 1}. ${error.message}`);
        if (error.stack) {
          const stackLines = error.stack.split('\n').slice(0, 3);
          stackLines.forEach(line => console.log(`   ${line}`));
        }
      });
    }
    
    return {
      errors: allErrors,
      analysis: errorAnalysis
    };
    
  } catch (error) {
    console.error('❌ 調査中エラー:', error.message);
    return { errors: [{ message: error.message, stack: error.stack }] };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

findExactSyntaxError().then(result => {
  console.log('\n🎯 最終分析結果:');
  
  if (result.errors.length === 0) {
    console.log('✅ エラーが検出されませんでした');
    console.log('💡 ブラウザでは正常に動作している可能性があります');
  } else {
    console.log(`❌ ${result.errors.length}個のエラーを検出`);
    console.log('🔧 修正が必要なエラーが特定されました');
    
    // エラーをファイルに保存
    fs.writeFileSync('syntax-error-details.json', JSON.stringify(result, null, 2));
    console.log('📄 詳細はsyntax-error-details.jsonに保存されました');
  }
});