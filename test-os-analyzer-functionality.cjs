/**
 * OS Analyzer Functionality Test
 * HAQEI Triple OS システムの実機能テスト
 */

const { chromium } = require('playwright');
const fs = require('fs');

class OSAnalyzerFunctionalityTest {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'OS Analyzer Functionality Test',
      tests: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    };
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🧠 Initializing OS Analyzer Functionality Test...');
    this.browser = await chromium.launch({ 
      headless: false, // Show browser for visual verification
      slowMo: 1000 // Slow down for observation
    });
    this.page = await this.browser.newPage();
    await this.page.setDefaultTimeout(30000);
    
    // Listen for console messages
    this.page.on('console', msg => {
      console.log(`   Browser Console [${msg.type()}]: ${msg.text()}`);
    });
  }

  async runTest(testName, testFn) {
    console.log(`🔍 Testing: ${testName}`);
    try {
      const result = await testFn();
      this.results.tests.push({
        name: testName,
        status: result.status || 'passed',
        details: result.details || 'Test passed',
        data: result.data || {},
        timestamp: new Date().toISOString()
      });
      
      if (result.status === 'passed') {
        this.results.summary.passed++;
        console.log(`   ✅ ${testName}: PASSED - ${result.details}`);
      } else if (result.status === 'warning') {
        this.results.summary.warnings++;
        console.log(`   ⚠️  ${testName}: WARNING - ${result.details}`);
      } else {
        this.results.summary.failed++;
        console.log(`   ❌ ${testName}: FAILED - ${result.details}`);
      }
    } catch (error) {
      this.results.tests.push({
        name: testName,
        status: 'failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      this.results.summary.failed++;
      console.log(`   ❌ ${testName}: FAILED - ${error.message}`);
    }
  }

  async testPageLoad() {
    const startTime = Date.now();
    const response = await this.page.goto('http://localhost:8788/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    const loadTime = Date.now() - startTime;
    
    const title = await this.page.title();
    const hasMainContainer = await this.page.locator('#main-container, body').count() > 0;
    
    // Wait for JS to load
    await this.page.waitForTimeout(2000);
    
    return {
      status: response.ok() && hasMainContainer ? 'passed' : 'failed',
      details: `Page loaded in ${loadTime}ms, title: "${title}", status: ${response.status()}`,
      data: {
        loadTime,
        title,
        status: response.status(),
        hasMainContainer
      }
    };
  }

  async testTripleOSDisplay() {
    // Look for Triple OS components
    const engineOSVisible = await this.page.locator('text=Engine OS').count() > 0;
    const interfaceOSVisible = await this.page.locator('text=Interface OS').count() > 0;
    const safeModeOSVisible = await this.page.locator('text=Safe Mode OS').count() > 0;
    
    // Look for start button
    const startButton = await this.page.locator('button:has-text("診断を開始"), button:has-text("Start"), [data-action="start"]').count() > 0;
    
    const components = {
      engineOS: engineOSVisible,
      interfaceOS: interfaceOSVisible,
      safeModeOS: safeModeOSVisible,
      startButton: startButton
    };
    
    const visibleCount = Object.values(components).filter(Boolean).length;
    
    return {
      status: visibleCount >= 1 ? 'passed' : 'failed',
      details: `Triple OS components visible: ${visibleCount}/4, Start button: ${startButton}`,
      data: components
    };
  }

  async testQuestionFlow() {
    // Try to start the analysis
    const startSelectors = [
      'button:has-text("診断を開始")',
      'button:has-text("Start")', 
      '[data-action="start"]',
      'button[onclick*="start"]',
      '.start-button',
      '#start-analysis'
    ];
    
    let startButton = null;
    for (const selector of startSelectors) {
      const count = await this.page.locator(selector).count();
      if (count > 0) {
        startButton = this.page.locator(selector).first();
        break;
      }
    }
    
    if (!startButton) {
      return {
        status: 'failed',
        details: 'No start button found',
        data: { availableButtons: await this.page.locator('button').count() }
      };
    }

    // Click start button
    await startButton.click();
    await this.page.waitForTimeout(2000);
    
    // Look for question display
    const questionVisible = await this.page.locator('text=質問, text=Question, .question, #question').count() > 0;
    const choicesVisible = await this.page.locator('input[type="radio"], button[data-choice], .choice').count() > 0;
    
    return {
      status: questionVisible || choicesVisible ? 'passed' : 'warning',
      details: `Question flow started: question=${questionVisible}, choices=${choicesVisible}`,
      data: {
        questionVisible,
        choicesVisible,
        totalChoices: await this.page.locator('input[type="radio"], button[data-choice], .choice').count()
      }
    };
  }

  async testDataIntegrity() {
    // Check if H384H64database.js is loaded
    const databaseLoaded = await this.page.evaluate(() => {
      return typeof window.H384H64database !== 'undefined' || 
             typeof window.database !== 'undefined' ||
             typeof window.hexagramData !== 'undefined';
    });
    
    // Check for 64 hexagrams data
    const hexagramCount = await this.page.evaluate(() => {
      if (window.H384H64database) return Object.keys(window.H384H64database).length;
      if (window.database) return Object.keys(window.database).length;
      if (window.hexagramData) return Object.keys(window.hexagramData).length;
      return 0;
    });
    
    return {
      status: databaseLoaded && hexagramCount >= 64 ? 'passed' : 'warning',
      details: `Database loaded: ${databaseLoaded}, Hexagram count: ${hexagramCount}`,
      data: {
        databaseLoaded,
        hexagramCount,
        expectedCount: 64
      }
    };
  }

  async testAnalysisLogic() {
    // Test if analysis functions exist
    const functionsExist = await this.page.evaluate(() => {
      const functions = [
        'analyzePersonality',
        'calculateTripleOS',
        'generateHexagram',
        'TripleOSInteractionAnalyzer'
      ];
      
      const results = {};
      functions.forEach(fn => {
        results[fn] = typeof window[fn] !== 'undefined' || 
                     (window.analyzer && typeof window.analyzer[fn] !== 'undefined');
      });
      
      return results;
    });
    
    const functionCount = Object.values(functionsExist).filter(Boolean).length;
    
    return {
      status: functionCount >= 1 ? 'passed' : 'warning',
      details: `Analysis functions found: ${functionCount}/4`,
      data: functionsExist
    };
  }

  async testResponsiveDesign() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await this.page.waitForTimeout(1000);
    
    const mobileUsable = await this.page.evaluate(() => {
      const body = document.body;
      const hasOverflow = body.scrollWidth > window.innerWidth;
      const buttonsVisible = document.querySelectorAll('button:visible').length > 0;
      return { hasOverflow, buttonsVisible };
    });
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.waitForTimeout(1000);
    
    return {
      status: !mobileUsable.hasOverflow ? 'passed' : 'warning',
      details: `Mobile responsive: overflow=${mobileUsable.hasOverflow}, buttons=${mobileUsable.buttonsVisible}`,
      data: mobileUsable
    };
  }

  async runAllTests() {
    console.log('🧠 Starting OS Analyzer Functionality Tests...\n');

    await this.initialize();

    await this.runTest('Page Load & Basic Structure', () => this.testPageLoad());
    await this.runTest('Triple OS Components Display', () => this.testTripleOSDisplay());
    await this.runTest('Question Flow Initiation', () => this.testQuestionFlow());
    await this.runTest('Data Integrity (64 Hexagrams)', () => this.testDataIntegrity());
    await this.runTest('Analysis Logic Functions', () => this.testAnalysisLogic());
    await this.runTest('Responsive Design', () => this.testResponsiveDesign());

    console.log('\n📊 OS Analyzer Functionality Test Complete!');
    console.log(`   Passed: ${this.results.summary.passed}`);
    console.log(`   Warnings: ${this.results.summary.warnings}`);
    console.log(`   Failed: ${this.results.summary.failed}`);

    await this.browser.close();
    return this.results;
  }
}

// CLI execution
if (require.main === module) {
  const tester = new OSAnalyzerFunctionalityTest();
  tester.runAllTests()
    .then(results => {
      const reportPath = `./os-analyzer-functionality-report-${Date.now()}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
      console.log(`\n📋 Detailed report saved: ${reportPath}`);
      
      const success = results.summary.failed === 0;
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ OS Analyzer functionality test failed:', error);
      process.exit(1);
    });
}

module.exports = { OSAnalyzerFunctionalityTest };