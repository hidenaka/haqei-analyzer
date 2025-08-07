/**
 * HAQEI Visual Test Suite
 * 表示検証テスト
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class VisualTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      screenshots: [],
      cssValidation: [],
      responsiveChecks: []
    };
  }

  async runTests() {
    console.log('🎨 HAQEI Visual Tests Starting...\n');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      const htmlPath = path.join(__dirname, '..', 'emergency_haqei.html');
      await page.goto(`file://${htmlPath}`);
      
      // スクリーンショット取得
      await this.captureScreenshots(page);
      
      // CSS検証
      await this.validateCSS(page);
      
      // レスポンシブデザイン検証
      await this.checkResponsiveDesign(page);
      
    } catch (error) {
      console.error('❌ Visual test failed:', error);
    } finally {
      await browser.close();
      this.generateReport();
    }
  }

  async captureScreenshots(page) {
    console.log('📸 Capturing screenshots...');
    
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      const screenshotPath = path.join(__dirname, '..', `screenshot-${viewport.name}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      this.results.screenshots.push({
        device: viewport.name,
        resolution: `${viewport.width}x${viewport.height}`,
        path: screenshotPath,
        captured: new Date().toISOString()
      });
      
      console.log(`  ✅ ${viewport.name} screenshot captured`);
    }
  }

  async validateCSS(page) {
    console.log('🎨 Validating CSS...');
    
    const cssChecks = await page.evaluate(() => {
      const checks = [];
      
      // CSS変数の存在確認
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      const cssVars = [
        '--primary-color',
        '--secondary-color',
        '--text-color',
        '--bg-color',
        '--space-xs',
        '--space-sm',
        '--space-md',
        '--space-lg',
        '--space-xl'
      ];
      
      cssVars.forEach(varName => {
        const value = computedStyle.getPropertyValue(varName);
        checks.push({
          property: varName,
          exists: value !== '',
          value: value.trim()
        });
      });
      
      // Critical CSSの適用確認
      const container = document.querySelector('.container');
      if (container) {
        const containerStyle = getComputedStyle(container);
        checks.push({
          property: 'container-max-width',
          exists: true,
          value: containerStyle.maxWidth
        });
      }
      
      // アニメーションの存在確認
      const animatedElements = document.querySelectorAll('.pulse-animation, .fade-in');
      checks.push({
        property: 'animations',
        exists: animatedElements.length > 0,
        value: `${animatedElements.length} animated elements`
      });
      
      return checks;
    });
    
    this.results.cssValidation = cssChecks;
    
    cssChecks.forEach(check => {
      if (check.exists) {
        console.log(`  ✅ ${check.property}: ${check.value}`);
      } else {
        console.log(`  ❌ ${check.property}: Not found`);
      }
    });
  }

  async checkResponsiveDesign(page) {
    console.log('📱 Checking responsive design...');
    
    const breakpoints = [
      { name: 'mobile', width: 320 },
      { name: 'mobile-large', width: 480 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1024 },
      { name: 'desktop-large', width: 1440 }
    ];
    
    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: 800 });
      await page.waitForTimeout(300);
      
      const layoutCheck = await page.evaluate(() => {
        const container = document.querySelector('.container');
        const cards = document.querySelectorAll('.os-card');
        const buttons = document.querySelectorAll('button');
        
        return {
          containerWidth: container ? container.offsetWidth : 0,
          cardsVisible: cards.length,
          buttonsClickable: Array.from(buttons).every(btn => 
            btn.offsetWidth > 0 && btn.offsetHeight > 0
          ),
          overflow: document.body.scrollWidth > window.innerWidth
        };
      });
      
      this.results.responsiveChecks.push({
        breakpoint: breakpoint.name,
        width: breakpoint.width,
        ...layoutCheck,
        passed: !layoutCheck.overflow && layoutCheck.buttonsClickable
      });
      
      const status = layoutCheck.overflow ? '❌' : '✅';
      console.log(`  ${status} ${breakpoint.name} (${breakpoint.width}px): ${
        layoutCheck.overflow ? 'Has overflow' : 'Layout OK'
      }`);
    }
  }

  generateReport() {
    console.log('\n📊 Visual Test Summary:');
    console.log(`  Screenshots: ${this.results.screenshots.length}`);
    console.log(`  CSS Properties Validated: ${this.results.cssValidation.length}`);
    console.log(`  Responsive Breakpoints Tested: ${this.results.responsiveChecks.length}`);
    
    const passedResponsive = this.results.responsiveChecks.filter(r => r.passed).length;
    console.log(`  Responsive Pass Rate: ${
      Math.round((passedResponsive / this.results.responsiveChecks.length) * 100)
    }%`);
    
    // レポート保存
    const reportPath = path.join(__dirname, '..', 'visual-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📝 Visual test report saved to: visual-test-report.json`);
  }
}

// テスト実行
const tester = new VisualTester();
tester.runTests().catch(console.error);