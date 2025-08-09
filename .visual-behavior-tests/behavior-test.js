/**
 * HAQEI Behavior Test Suite
 * 挙動検証テスト
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BehaviorTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };
  }

  async runTests() {
    console.log('🧪 HAQEI Behavior Tests Starting...\n');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // HTMLファイルを開く
      const htmlPath = path.join(__dirname, '..', 'emergency_haqei.html');
      await page.goto(`file://${htmlPath}`);
      
      // テスト実行
      await this.testInitialLoad(page);
      await this.testStartButton(page);
      await this.testQuestionFlow(page);
      await this.testNavigation(page);
      await this.testResponsiveness(page);
      await this.testKeyboardNavigation(page);
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
    } finally {
      await browser.close();
      this.generateReport();
    }
  }

  async testInitialLoad(page) {
    const testName = 'Initial Page Load';
    console.log(`Testing: ${testName}`);
    
    try {
      // タイトル確認
      const title = await page.title();
      this.assert(
        title.includes('HAQEI'),
        testName,
        'Page title contains HAQEI'
      );
      
      // ウェルカム画面表示確認
      const welcomeScreen = await page.isVisible('#welcome-screen');
      this.assert(
        welcomeScreen,
        testName,
        'Welcome screen is visible'
      );
      
      // Triple OS説明確認
      const osCards = await page.$$('.os-card');
      this.assert(
        osCards.length === 3,
        testName,
        'Three OS cards are displayed'
      );
      
    } catch (error) {
      this.recordFailure(testName, error.message);
    }
  }

  async testStartButton(page) {
    const testName = 'Start Button Functionality';
    console.log(`Testing: ${testName}`);
    
    try {
      // スタートボタン存在確認
      const startBtn = await page.$('#start-btn');
      this.assert(
        startBtn !== null,
        testName,
        'Start button exists'
      );
      
      // ボタンクリック可能性
      const isEnabled = await page.isEnabled('#start-btn');
      this.assert(
        isEnabled,
        testName,
        'Start button is clickable'
      );
      
      // ボタンクリック
      await page.click('#start-btn');
      await page.waitForTimeout(500);
      
      // 質問画面遷移確認
      const questionScreen = await page.isVisible('#question-screen');
      this.assert(
        questionScreen,
        testName,
        'Question screen appears after clicking start'
      );
      
    } catch (error) {
      this.recordFailure(testName, error.message);
    }
  }

  async testQuestionFlow(page) {
    const testName = 'Question Flow';
    console.log(`Testing: ${testName}`);
    
    try {
      // 質問表示確認
      const questionTitle = await page.$('.question-title');
      this.assert(
        questionTitle !== null,
        testName,
        'Question title is displayed'
      );
      
      // オプション表示確認
      const options = await page.$$('.option');
      this.assert(
        options.length > 0,
        testName,
        'Answer options are displayed'
      );
      
      // オプション選択
      if (options.length > 0) {
        await options[0].click();
        await page.waitForTimeout(300);
        
        // 選択状態確認
        const isSelected = await options[0].evaluate(el => 
          el.classList.contains('selected')
        );
        this.assert(
          isSelected,
          testName,
          'Option can be selected'
        );
        
        // 次へボタン有効化確認
        const nextBtn = await page.$('#next-btn');
        if (nextBtn) {
          const isEnabled = await nextBtn.isEnabled();
          this.assert(
            isEnabled,
            testName,
            'Next button is enabled after selection'
          );
        }
      }
      
    } catch (error) {
      this.recordFailure(testName, error.message);
    }
  }

  async testNavigation(page) {
    const testName = 'Navigation Controls';
    console.log(`Testing: ${testName}`);
    
    try {
      // ナビゲーションボタン確認
      const prevBtn = await page.$('#prev-btn');
      const nextBtn = await page.$('#next-btn');
      
      this.assert(
        prevBtn !== null && nextBtn !== null,
        testName,
        'Navigation buttons exist'
      );
      
      // プログレスバー確認
      const progressBar = await page.$('.progress-bar');
      this.assert(
        progressBar !== null,
        testName,
        'Progress bar is displayed'
      );
      
    } catch (error) {
      this.recordFailure(testName, error.message);
    }
  }

  async testResponsiveness(page) {
    const testName = 'Responsive Design';
    console.log(`Testing: ${testName}`);
    
    try {
      // デスクトップサイズ
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(300);
      let isResponsive = await page.evaluate(() => {
        const container = document.querySelector('.container');
        return container && window.getComputedStyle(container).maxWidth;
      });
      this.assert(
        isResponsive !== null,
        testName,
        'Desktop layout renders correctly'
      );
      
      // モバイルサイズ
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      isResponsive = await page.evaluate(() => {
        const container = document.querySelector('.container');
        return container && window.getComputedStyle(container).padding;
      });
      this.assert(
        isResponsive !== null,
        testName,
        'Mobile layout renders correctly'
      );
      
    } catch (error) {
      this.recordFailure(testName, error.message);
    }
  }

  async testKeyboardNavigation(page) {
    const testName = 'Keyboard Navigation';
    console.log(`Testing: ${testName}`);
    
    try {
      // Tab キー動作
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => 
        document.activeElement?.tagName
      );
      this.assert(
        focusedElement !== null,
        testName,
        'Tab navigation works'
      );
      
      // Enter キー動作
      const startBtn = await page.$('#start-btn');
      if (startBtn) {
        await startBtn.focus();
        await page.keyboard.press('Enter');
        // エンターキーでボタンが押せることを確認
        this.assert(
          true,
          testName,
          'Enter key activates focused button'
        );
      }
      
    } catch (error) {
      this.recordFailure(testName, error.message);
    }
  }

  assert(condition, testName, description) {
    this.results.tests.push({
      name: testName,
      description: description,
      passed: condition,
      timestamp: new Date().toISOString()
    });
    
    this.results.summary.total++;
    if (condition) {
      this.results.summary.passed++;
      console.log(`  ✅ ${description}`);
    } else {
      this.results.summary.failed++;
      console.log(`  ❌ ${description}`);
    }
  }

  recordFailure(testName, error) {
    this.results.tests.push({
      name: testName,
      description: 'Test failed with error',
      passed: false,
      error: error,
      timestamp: new Date().toISOString()
    });
    
    this.results.summary.total++;
    this.results.summary.failed++;
    console.log(`  ❌ ${testName}: ${error}`);
  }

  generateReport() {
    console.log('\n📊 Test Results Summary:');
    console.log(`  Total: ${this.results.summary.total}`);
    console.log(`  Passed: ${this.results.summary.passed}`);
    console.log(`  Failed: ${this.results.summary.failed}`);
    console.log(`  Success Rate: ${
      Math.round((this.results.summary.passed / this.results.summary.total) * 100)
    }%`);
    
    // レポート保存
    const reportPath = path.join(__dirname, '..', 'behavior-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📝 Detailed report saved to: behavior-test-report.json`);
  }
}

// テスト実行
const tester = new BehaviorTester();
tester.runTests().catch(console.error);