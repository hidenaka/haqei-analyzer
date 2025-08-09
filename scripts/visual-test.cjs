#!/usr/bin/env node

/**
 * Visual Testing Script for Claude Code
 * Captures screenshots and validates UI changes
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class VisualTester {
  constructor() {
    this.baseDir = path.join(process.cwd(), '.visual-tests');
    this.screenshotsDir = path.join(this.baseDir, 'screenshots');
    this.diffDir = path.join(this.baseDir, 'diffs');
  }

  async init() {
    await fs.ensureDir(this.screenshotsDir);
    await fs.ensureDir(this.diffDir);
  }

  async captureScreenshot(url, name) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Desktop viewport
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.join(this.screenshotsDir, `${name}-desktop.png`),
      fullPage: true
    });

    // Mobile viewport
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(this.screenshotsDir, `${name}-mobile.png`),
      fullPage: true
    });

    await browser.close();
    return true;
  }

  async validateCSS(cssFile) {
    try {
      // Run stylelint
      execSync(`npx stylelint ${cssFile}`, { stdio: 'pipe' });
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        errors: error.stdout?.toString() || error.message 
      };
    }
  }

  async checkAccessibility(url) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);

    // Inject axe-core
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
    });

    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.axe.run((err, results) => {
          resolve(results.violations);
        });
      });
    });

    await browser.close();
    return results;
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      screenshots: results.screenshots || [],
      cssValidation: results.css || {},
      accessibility: results.a11y || [],
      passed: results.passed || false
    };

    fs.writeJsonSync(
      path.join(this.baseDir, 'report.json'),
      report,
      { spaces: 2 }
    );

    return report;
  }
}

// CLI execution
if (require.main === module) {
  const tester = new VisualTester();
  const url = process.argv[2] || 'http://localhost:3000';
  
  (async () => {
    await tester.init();
    console.log('📸 Capturing screenshots...');
    await tester.captureScreenshot(url, 'current');
    
    console.log('✅ Visual test complete!');
    console.log(`Screenshots saved to: ${tester.screenshotsDir}`);
  })();
}

module.exports = VisualTester;