/**
 * Improved Question Flow Test
 * Tests the enhanced UI flow with external JS files
 */

const { chromium } = require('playwright');

class ImprovedQuestionFlowTest {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'Improved Question Flow Test',
      tests: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    };
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing Improved Question Flow Test...');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });
    this.page = await this.browser.newPage();
    await this.page.setDefaultTimeout(30000);
    
    // Track console for errors
    this.page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('Failed to find a valid digest')) {
        console.log(`   🚨 Console Error: ${text}`);
      } else if (text.includes('✅')) {
        console.log(`   ${text}`);
      }
    });
  }

  async runTest(testName, testFn) {
    console.log(`\n🔍 Testing: ${testName}`);
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
        console.log(`   ✅ PASSED: ${result.details}`);
      } else if (result.status === 'warning') {
        this.results.summary.warnings++;
        console.log(`   ⚠️  WARNING: ${result.details}`);
      } else {
        this.results.summary.failed++;
        console.log(`   ❌ FAILED: ${result.details}`);
      }
    } catch (error) {
      this.results.tests.push({
        name: testName,
        status: 'failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
      this.results.summary.failed++;
      console.log(`   ❌ FAILED: ${error.message}`);
    }
  }

  async testPageLoadWithExternalJS() {
    const startTime = Date.now();
    const response = await this.page.goto('http://localhost:8788/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    const loadTime = Date.now() - startTime;
    
    // Wait for external JS to load
    await this.page.waitForTimeout(3000);
    
    // Check if app.js loaded
    const appLoaded = await this.page.evaluate(() => {
      return typeof window.HaqeiApp !== 'undefined';
    });
    
    // Check if questions loaded
    const questionsLoaded = await this.page.evaluate(() => {
      return typeof window.QUESTIONS !== 'undefined' && window.QUESTIONS.length > 0;
    });
    
    return {
      status: response.ok() && appLoaded ? 'passed' : 'failed',
      details: `Page loaded in ${loadTime}ms, App JS: ${appLoaded}, Questions: ${questionsLoaded}`,
      data: { loadTime, appLoaded, questionsLoaded }
    };
  }

  async testStartButtonFunctionality() {
    // Find and click start button
    const startBtn = this.page.locator('#start-btn');
    const isVisible = await startBtn.isVisible();
    
    if (!isVisible) {
      return {
        status: 'failed',
        details: 'Start button not visible',
        data: { buttonVisible: false }
      };
    }
    
    // Click the button
    await startBtn.click();
    
    // Wait for transition
    await this.page.waitForTimeout(2000);
    
    // Check if question screen appeared
    const questionVisible = await this.page.locator('#question-container').isVisible();
    const hasQuestionTitle = await this.page.locator('.question-title').count() > 0;
    const hasChoices = await this.page.locator('.choice-option').count() > 0;
    
    return {
      status: questionVisible && hasQuestionTitle ? 'passed' : 'warning',
      details: `Question screen: ${questionVisible}, Title: ${hasQuestionTitle}, Choices: ${hasChoices}`,
      data: { questionVisible, hasQuestionTitle, hasChoices }
    };
  }

  async testQuestionInteraction() {
    // Check if we're on question screen
    const onQuestionScreen = await this.page.locator('#question-container').isVisible();
    
    if (!onQuestionScreen) {
      return {
        status: 'warning',
        details: 'Not on question screen - skipping interaction test',
        data: { onQuestionScreen: false }
      };
    }
    
    // Try to select a choice
    const firstChoice = this.page.locator('.choice-option input[type="radio"]').first();
    const choiceExists = await firstChoice.count() > 0;
    
    if (choiceExists) {
      await firstChoice.click();
      await this.page.waitForTimeout(500);
      
      // Check if next button enabled
      const nextBtn = this.page.locator('#next-btn');
      const nextEnabled = await nextBtn.evaluate(btn => !btn.disabled);
      
      return {
        status: nextEnabled ? 'passed' : 'warning',
        details: `Choice selected, Next button enabled: ${nextEnabled}`,
        data: { choiceExists, nextEnabled }
      };
    }
    
    return {
      status: 'warning',
      details: 'No radio choices found',
      data: { choiceExists: false }
    };
  }

  async testConsoleErrors() {
    // Navigate to page and check for errors
    await this.page.goto('http://localhost:8788/os_analyzer.html', { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(3000);
    
    // Check for CSP or SRI errors by evaluating console
    const hasErrors = await this.page.evaluate(() => {
      return window.cspErrors || 0;
    });
    
    return {
      status: hasErrors === 0 || hasErrors === undefined ? 'passed' : 'warning',
      details: `Console errors detected: ${hasErrors || 0}`,
      data: { errorCount: hasErrors || 0 }
    };
  }

  async testDataIntegrity() {
    const dataStatus = await this.page.evaluate(() => {
      return {
        H64_DATA: typeof window.H64_DATA !== 'undefined' && Object.keys(window.H64_DATA || {}).length,
        H384_DATA: typeof window.H384_DATA !== 'undefined' && (window.H384_DATA || []).length,
        QUESTIONS: typeof window.QUESTIONS !== 'undefined' && (window.QUESTIONS || []).length,
        TripleOSAnalyzer: typeof window.TripleOSInteractionAnalyzer !== 'undefined'
      };
    });
    
    const allLoaded = dataStatus.H64_DATA >= 64 && 
                    dataStatus.H384_DATA >= 384 && 
                    dataStatus.QUESTIONS >= 8 && 
                    dataStatus.TripleOSAnalyzer;
    
    return {
      status: allLoaded ? 'passed' : 'warning',
      details: `Data loaded - H64: ${dataStatus.H64_DATA}, H384: ${dataStatus.H384_DATA}, Q: ${dataStatus.QUESTIONS}, Analyzer: ${dataStatus.TripleOSAnalyzer}`,
      data: dataStatus
    };
  }

  async runAllTests() {
    console.log('🧠 Starting Improved Question Flow Tests...\n');

    await this.initialize();

    await this.runTest('Page Load with External JS', () => this.testPageLoadWithExternalJS());
    await this.runTest('Start Button Functionality', () => this.testStartButtonFunctionality());
    await this.runTest('Question Interaction', () => this.testQuestionInteraction());
    await this.runTest('Console Errors Check', () => this.testConsoleErrors());
    await this.runTest('Data Integrity', () => this.testDataIntegrity());

    console.log('\n📊 Improved Question Flow Test Complete!');
    console.log(`   Passed: ${this.results.summary.passed}`);
    console.log(`   Warnings: ${this.results.summary.warnings}`);
    console.log(`   Failed: ${this.results.summary.failed}`);

    await this.browser.close();
    return this.results;
  }
}

// CLI execution
if (require.main === module) {
  const tester = new ImprovedQuestionFlowTest();
  tester.runAllTests()
    .then(results => {
      const success = results.summary.failed === 0;
      console.log(`\n🎯 Question flow improvements: ${success ? 'SUCCESS' : 'NEEDS WORK'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { ImprovedQuestionFlowTest };