#!/usr/bin/env node

/**
 * Visual & Behavior Testing Script
 * 表示と挙動の両方を検証
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VisualBehaviorTester {
  constructor() {
    this.testDir = path.join(process.cwd(), '.visual-behavior-tests');
    this.resultsDir = path.join(this.testDir, 'results');
    this.behaviorTests = [];
    this.visualTests = [];
  }

  async init() {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
    console.log('🔍 Visual & Behavior Test Framework Initialized');
  }

  /**
   * 表示テスト（Playwright使用）
   */
  async testVisualAppearance(url) {
    try {
      // Playwrightでのビジュアルテスト
      const testCode = `
const { test, expect } = require('@playwright/test');

test('Visual appearance test', async ({ page }) => {
  await page.goto('${url}');
  
  // スクリーンショット取得
  await page.screenshot({ path: '${this.resultsDir}/desktop.png', fullPage: true });
  
  // モバイル表示
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: '${this.resultsDir}/mobile.png', fullPage: true });
  
  // CSS検証
  const styles = await page.evaluate(() => {
    const computed = window.getComputedStyle(document.body);
    return {
      fontFamily: computed.fontFamily,
      backgroundColor: computed.backgroundColor,
      color: computed.color
    };
  });
  
  return { success: true, styles };
});
`;
      
      fs.writeFileSync(path.join(this.testDir, 'visual.test.js'), testCode);
      
      this.visualTests.push({
        name: 'Visual Appearance',
        status: 'ready',
        file: 'visual.test.js'
      });

      return { success: true, message: 'Visual test prepared' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 挙動テスト（ユーザーインタラクション）
   */
  async testBehavior(url) {
    try {
      const behaviorTestCode = `
const { test, expect } = require('@playwright/test');

test('Interactive behavior test', async ({ page }) => {
  await page.goto('${url}');
  
  // ボタンクリックテスト
  const buttons = await page.$$('button');
  const results = [];
  
  for (const button of buttons) {
    const text = await button.textContent();
    const isClickable = await button.isEnabled();
    results.push({ text, clickable: isClickable });
  }
  
  // フォーム入力テスト
  const inputs = await page.$$('input');
  for (const input of inputs) {
    const type = await input.getAttribute('type');
    if (type === 'text' || type === 'email') {
      await input.fill('test@example.com');
      const value = await input.inputValue();
      results.push({ type, filled: value === 'test@example.com' });
    }
  }
  
  // ナビゲーションテスト
  const links = await page.$$('a[href]');
  const linkCount = links.length;
  
  return { 
    buttons: results,
    inputsCount: inputs.length,
    linksCount: linkCount
  };
});
`;

      fs.writeFileSync(path.join(this.testDir, 'behavior.test.js'), behaviorTestCode);
      
      this.behaviorTests.push({
        name: 'User Interaction',
        status: 'ready',
        file: 'behavior.test.js'
      });

      return { success: true, message: 'Behavior test prepared' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * レスポンシブテスト
   */
  async testResponsive(url) {
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 812 }
    ];

    const responsiveTestCode = `
const { test, expect } = require('@playwright/test');

${viewports.map(vp => `
test('Responsive: ${vp.name}', async ({ page }) => {
  await page.setViewportSize({ width: ${vp.width}, height: ${vp.height} });
  await page.goto('${url}');
  
  // レイアウト崩れチェック
  const overflowing = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const overflows = [];
    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        overflows.push(el.tagName);
      }
    });
    return overflows;
  });
  
  await page.screenshot({ 
    path: '${this.resultsDir}/responsive-${vp.name.toLowerCase()}.png',
    fullPage: true 
  });
  
  return { viewport: '${vp.name}', overflowing };
});
`).join('\n')}
`;

    fs.writeFileSync(path.join(this.testDir, 'responsive.test.js'), responsiveTestCode);
    
    return { success: true, message: 'Responsive tests prepared' };
  }

  /**
   * パフォーマンステスト
   */
  async testPerformance(url) {
    const perfTestCode = `
const { test, expect } = require('@playwright/test');

test('Performance metrics', async ({ page }) => {
  await page.goto('${url}');
  
  const metrics = await page.evaluate(() => {
    const perf = window.performance;
    const timing = perf.timing;
    
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: perf.getEntriesByType('paint')[0]?.startTime || 0,
      resources: perf.getEntriesByType('resource').length
    };
  });
  
  // 3秒以内にロード完了することを確認
  expect(metrics.loadTime).toBeLessThan(3000);
  
  return metrics;
});
`;

    fs.writeFileSync(path.join(this.testDir, 'performance.test.js'), perfTestCode);
    
    return { success: true, message: 'Performance test prepared' };
  }

  /**
   * アクセシビリティテスト
   */
  async testAccessibility(url) {
    const a11yTestCode = `
const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('axe-playwright');

test('Accessibility compliance', async ({ page }) => {
  await page.goto('${url}');
  await injectAxe(page);
  
  const violations = await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  });
  
  return { violations: violations || [] };
});
`;

    fs.writeFileSync(path.join(this.testDir, 'a11y.test.js'), a11yTestCode);
    
    return { success: true, message: 'Accessibility test prepared' };
  }

  /**
   * 統合レポート生成
   */
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testResults: {
        visual: this.visualTests,
        behavior: this.behaviorTests,
        responsive: 'prepared',
        performance: 'prepared',
        accessibility: 'prepared'
      },
      summary: {
        totalTests: 5,
        prepared: 5,
        passed: 0,
        failed: 0
      },
      recommendations: [
        'Install @playwright/test for full testing: npm install -D @playwright/test',
        'Install axe-playwright for accessibility: npm install -D axe-playwright',
        'Run tests with: npx playwright test',
        'View report with: npx playwright show-report'
      ]
    };

    fs.writeFileSync(
      path.join(this.resultsDir, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📊 Test Report Generated:');
    console.log(`   Location: ${this.resultsDir}/test-report.json`);
    console.log('\n📋 Test Coverage:');
    console.log('   ✅ Visual appearance tests');
    console.log('   ✅ User interaction tests');
    console.log('   ✅ Responsive design tests');
    console.log('   ✅ Performance metrics');
    console.log('   ✅ Accessibility compliance');
    
    return report;
  }

  /**
   * Playwrightコンフィグ生成
   */
  async generatePlaywrightConfig() {
    const config = `
module.exports = {
  testDir: './.visual-behavior-tests',
  timeout: 30000,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['iPhone 12'] }
    }
  ],
  reporter: [
    ['html'],
    ['json', { outputFile: '.visual-behavior-tests/results/test-results.json' }]
  ]
};
`;

    fs.writeFileSync('playwright.config.js', config);
    console.log('✅ Playwright config generated');
  }
}

// CLI実行
if (require.main === module) {
  const tester = new VisualBehaviorTester();
  const url = process.argv[2] || 'http://localhost:8080';
  
  (async () => {
    console.log('🚀 Starting Visual & Behavior Testing Framework\n');
    
    await tester.init();
    
    // すべてのテストを準備
    await tester.testVisualAppearance(url);
    await tester.testBehavior(url);
    await tester.testResponsive(url);
    await tester.testPerformance(url);
    await tester.testAccessibility(url);
    
    // Playwrightコンフィグ生成
    await tester.generatePlaywrightConfig();
    
    // レポート生成
    const report = await tester.generateReport();
    
    console.log('\n✨ Testing framework ready!');
    console.log('\n📝 Next steps:');
    console.log('   1. Install Playwright: npm install -D @playwright/test');
    console.log('   2. Install browsers: npx playwright install');
    console.log('   3. Run tests: npx playwright test');
    console.log('   4. View results: npx playwright show-report');
  })();
}

module.exports = VisualBehaviorTester;