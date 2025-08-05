const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Launching HAQEI Integration Test Suite...');
  console.log('📊 Testing 9 Categories with 36 individual tests');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to test page
    await page.goto('http://localhost:8788/test-haqei-integration.html', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('✅ Test page loaded successfully');
    
    // Wait for initialization
    await page.waitForSelector('#run-all-tests', { timeout: 10000 });
    
    console.log('🎯 Starting automated test execution...');
    
    // Click run all tests
    await page.click('#run-all-tests');
    
    // Monitor progress
    let lastProgress = '';
    let attempts = 0;
    const maxAttempts = 120; // 2 minutes timeout
    
    while (attempts < maxAttempts) {
      const summary = await page.evaluate(() => {
        const summaryElement = document.getElementById('test-summary');
        return summaryElement ? summaryElement.textContent : 'Loading...';
      });
      
      if (summary !== lastProgress) {
        console.log('📈 Progress:', summary);
        lastProgress = summary;
      }
      
      // Check if completed
      if (summary.includes('Final Results') || summary.includes('100.0%')) {
        console.log('🏆 Tests completed!');
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    // Extract final results
    const finalResults = await page.evaluate(() => {
      const resultsContent = document.getElementById('results-content');
      const summary = document.getElementById('test-summary');
      
      return {
        summary: summary ? summary.innerHTML : 'No summary',
        results: resultsContent ? resultsContent.innerHTML : 'No results',
        categories: Array.from(document.querySelectorAll('.category')).map(cat => {
          const title = cat.querySelector('h3').textContent;
          const tests = Array.from(cat.querySelectorAll('.test-item')).map(item => {
            const name = item.querySelector('span').textContent.trim();
            const status = item.querySelector('.status').textContent;
            return { name, status };
          });
          return { title, tests };
        })
      };
    });
    
    console.log('\n📋 FINAL TEST RESULTS:');
    console.log('========================');
    console.log(finalResults.summary.replace(/<[^>]*>/g, ''));
    
    console.log('\n🔍 CATEGORY BREAKDOWN:');
    finalResults.categories.forEach(category => {
      console.log('\n' + category.title);
      category.tests.forEach(test => {
        const statusIcon = test.status === 'PASSED' ? '✅' : test.status === 'FAILED' ? '❌' : '⏳';
        console.log('  ' + statusIcon + ' ' + test.name + ' - ' + test.status);
      });
    });
    
    // Check overall success
    const passedCount = finalResults.categories.reduce((total, cat) => 
      total + cat.tests.filter(test => test.status === 'PASSED').length, 0);
    const totalCount = finalResults.categories.reduce((total, cat) => 
      total + cat.tests.length, 0);
    const successRate = ((passedCount / totalCount) * 100).toFixed(1);
    
    console.log('\n🎯 OVERALL RESULT:');
    console.log('==================');
    console.log(`✅ Passed: ${passedCount}/${totalCount} (${successRate}%)`);
    console.log(`❌ Failed: ${totalCount - passedCount}/${totalCount}`);
    
    if (successRate >= 95) {
      console.log('🏆 EXCELLENT: All systems operational!');
    } else if (successRate >= 80) {
      console.log('✅ GOOD: System mostly functional with minor issues');
    } else if (successRate >= 60) {
      console.log('⚠️  WARNING: System has significant issues');
    } else {
      console.log('❌ CRITICAL: System requires immediate attention');
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'haqei-integration-test-results.png', 
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved: haqei-integration-test-results.png');
    
    // Export detailed results
    const detailedReport = {
      timestamp: new Date().toISOString(),
      testSuite: 'HAQEI Integration Test Suite v1.0',
      categories: 9,
      totalTests: totalCount,
      passedTests: passedCount,
      failedTests: totalCount - passedCount,
      successRate: successRate + '%',
      categoryResults: finalResults.categories.map(cat => ({
        category: cat.title,
        tests: cat.tests.map(test => ({
          name: test.name.replace(/[^\w\s-]/g, '').trim(),
          status: test.status,
          passed: test.status === 'PASSED'
        })),
        categorySuccessRate: ((cat.tests.filter(t => t.status === 'PASSED').length / cat.tests.length) * 100).toFixed(1) + '%'
      }))
    };
    
    // Save results to file
    const fs = require('fs');
    fs.writeFileSync(`haqei-integration-test-report-${Date.now()}.json`, JSON.stringify(detailedReport, null, 2));
    
    console.log('📊 Detailed report saved to JSON file');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await browser.close();
    console.log('🔚 Browser closed');
  }
})();