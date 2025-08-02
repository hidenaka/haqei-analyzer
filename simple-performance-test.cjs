/**
 * シンプルパフォーマンステスト
 * ブラウザ起動負荷を回避して基本的な検証を実行
 */

const fs = require('fs');
const puppeteer = require('puppeteer');

async function testPerformance() {
  console.log('🚀 OS Analyzer パフォーマンステスト開始');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // ネットワーク監視
    const resources = [];
    page.on('response', (response) => {
      if (response.url().includes('.js') && response.status() === 200) {
        resources.push({
          url: response.url().split('/').pop(),
          size: response.headers()['content-length'] || 0,
          status: response.status()
        });
      }
    });
    
    console.log('📊 テスト1: ページ読み込み時間測定');
    const startTime = Date.now();
    
    try {
      await page.goto('http://localhost:8790/os_analyzer.html', {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      
      const loadTime = Date.now() - startTime;
      console.log(`✅ 初期読み込み: ${loadTime}ms`);
      
      // 基本的なDOM要素の存在確認
      const domCheck = await page.evaluate(() => {
        return {
          hasWelcomeContainer: !!document.getElementById('welcome-container'),
          hasQuestionsContainer: !!document.getElementById('questions-container'),
          hasApp: !!document.getElementById('app'),
          scriptCount: document.querySelectorAll('script').length,
          totalElements: document.querySelectorAll('*').length
        };
      });
      
      console.log('🏗️ DOM構造チェック:', domCheck);
      
      // JavaScript読み込み状況
      console.log('📦 読み込まれたJSリソース:');
      resources.forEach(resource => {
        const sizeKB = resource.size ? Math.round(resource.size / 1024) : '?';
        console.log(`  - ${resource.url}: ${sizeKB}KB`);
      });
      
      // コンソールエラーの監視
      const errors = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      // 少し待ってからJavaScript実行状況を確認
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const jsStatus = await page.evaluate(() => {
        return {
          hasBaseComponent: typeof BaseComponent !== 'undefined',
          hasStorageManager: typeof StorageManager !== 'undefined', 
          hasDataManager: typeof DataManager !== 'undefined',
          hasVirtualQuestionFlow: typeof VirtualQuestionFlow !== 'undefined',
          hasApp: typeof app !== 'undefined',
          windowVars: Object.keys(window).filter(key => key.includes('HAQEI') || key.includes('WORLD') || key.includes('SCENARIO')).length
        };
      });
      
      console.log('🔧 JavaScript実行状況:', jsStatus);
      
      if (errors.length > 0) {
        console.log('❌ コンソールエラー:');
        errors.forEach(error => console.log(`  - ${error}`));
      }
      
      // 簡単なパフォーマンス評価
      const performance = {
        loadTime,
        jsResourcesLoaded: resources.length,
        domElementsCount: domCheck.totalElements,
        hasMainComponents: jsStatus.hasStorageManager && jsStatus.hasDataManager,
        hasErrors: errors.length > 0
      };
      
      const grade = evaluatePerformance(performance);
      
      console.log('\n🎯 === パフォーマンス評価 ===');
      console.log(`📊 読み込み時間: ${loadTime}ms ${loadTime < 2000 ? '✅' : loadTime < 5000 ? '⚠️' : '❌'}`);
      console.log(`📦 JSリソース: ${resources.length}個`);
      console.log(`🏗️ DOM要素数: ${domCheck.totalElements}`);
      console.log(`🔧 主要コンポーネント: ${jsStatus.hasMainComponents ? '✅' : '❌'}`);
      console.log(`🚨 エラー: ${errors.length}個 ${errors.length === 0 ? '✅' : '❌'}`);
      console.log(`🏆 総合評価: ${grade}`);
      
      // レポート保存
      const report = {
        timestamp: new Date().toISOString(),
        performance,
        domCheck,
        jsStatus,
        resources,
        errors,
        grade
      };
      
      fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
      console.log('📄 詳細レポート: performance-report.json');
      
    } catch (navigationError) {
      console.error('❌ ページナビゲーションエラー:', navigationError.message);
      
      // フォールバック: ファイル存在確認
      console.log('\n🔍 ファイル構造確認:');
      const fileCheck = await checkFileStructure();
      console.log(fileCheck);
    }
    
  } catch (error) {
    console.error('❌ テスト実行エラー:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function evaluatePerformance(perf) {
  let score = 100;
  
  // 読み込み時間評価
  if (perf.loadTime > 5000) score -= 30;
  else if (perf.loadTime > 2000) score -= 15;
  
  // エラー評価
  if (perf.hasErrors) score -= 25;
  
  // コンポーネント評価
  if (!perf.hasMainComponents) score -= 20;
  
  // DOM要素数評価（多すぎる場合）
  if (perf.domElementsCount > 500) score -= 10;
  
  if (score >= 85) return 'A級 (優秀)';
  if (score >= 70) return 'B級 (良好)';
  if (score >= 50) return 'C級 (改善必要)';
  return 'D級 (要修正)';
}

async function checkFileStructure() {
  const fs = require('fs').promises;
  
  try {
    const files = {
      'public/os_analyzer.html': await fs.access('public/os_analyzer.html').then(() => true).catch(() => false),
      'public/js/app.js': await fs.access('public/js/app.js').then(() => true).catch(() => false),
      'public/js/os-analyzer/components/VirtualQuestionFlow.js': await fs.access('public/js/os-analyzer/components/VirtualQuestionFlow.js').then(() => true).catch(() => false),
      'public/js/os-analyzer/components/HaqeiQuestionElement.js': await fs.access('public/js/os-analyzer/components/HaqeiQuestionElement.js').then(() => true).catch(() => false),
      'public/haqei-sw.js': await fs.access('public/haqei-sw.js').then(() => true).catch(() => false)
    };
    
    return files;
  } catch (error) {
    return { error: error.message };
  }
}

if (require.main === module) {
  testPerformance()
    .then(() => {
      console.log('\n🎉 テスト完了');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 テスト失敗:', error);
      process.exit(1);
    });
}

module.exports = testPerformance;