/**
 * HAQEI Performance Test Suite
 * パフォーマンス検証テスト
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      metrics: {},
      resourceLoading: [],
      domMetrics: {}
    };
  }

  async runTests() {
    console.log('⚡ HAQEI Performance Tests Starting...\n');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      const htmlPath = path.join(__dirname, '..', 'emergency_haqei.html');
      
      // パフォーマンス計測開始
      const startTime = Date.now();
      
      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
      
      const loadTime = Date.now() - startTime;
      
      // メトリクス収集
      await this.collectMetrics(page, loadTime);
      
      // リソース読み込み分析
      await this.analyzeResources(page);
      
      // DOM構築時間測定
      await this.measureDOMMetrics(page);
      
      // インタラクション速度測定
      await this.measureInteractionSpeed(page);
      
    } catch (error) {
      console.error('❌ Performance test failed:', error);
    } finally {
      await browser.close();
      this.generateReport();
    }
  }

  async collectMetrics(page, loadTime) {
    console.log('📊 Collecting performance metrics...');
    
    const metrics = await page.evaluate(() => {
      const perf = window.performance;
      const timing = perf.timing || {};
      const navigation = perf.navigation || {};
      
      return {
        // Navigation Timing API
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        domComplete: timing.domComplete - timing.domLoading,
        domInteractive: timing.domInteractive - timing.domLoading,
        
        // Resource Timing
        resources: perf.getEntriesByType('resource').length,
        
        // Memory (if available)
        memory: perf.memory ? {
          usedJSHeapSize: Math.round(perf.memory.usedJSHeapSize / 1048576),
          totalJSHeapSize: Math.round(perf.memory.totalJSHeapSize / 1048576)
        } : null,
        
        // Paint Timing
        firstPaint: perf.getEntriesByType('paint')
          .find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: perf.getEntriesByType('paint')
          .find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    this.results.metrics = {
      pageLoadTime: loadTime,
      ...metrics
    };
    
    // パフォーマンス評価
    const loadTimeStatus = loadTime < 3000 ? '✅' : '⚠️';
    console.log(`  ${loadTimeStatus} Page Load Time: ${loadTime}ms (Target: <3000ms)`);
    
    if (metrics.firstContentfulPaint) {
      const fcpStatus = metrics.firstContentfulPaint < 1500 ? '✅' : '⚠️';
      console.log(`  ${fcpStatus} First Contentful Paint: ${Math.round(metrics.firstContentfulPaint)}ms`);
    }
    
    console.log(`  📦 Resources Loaded: ${metrics.resources}`);
    
    if (metrics.memory) {
      console.log(`  💾 Memory Usage: ${metrics.memory.usedJSHeapSize}MB / ${metrics.memory.totalJSHeapSize}MB`);
    }
  }

  async analyzeResources(page) {
    console.log('📦 Analyzing resource loading...');
    
    const resources = await page.evaluate(() => {
      const perf = window.performance;
      const entries = perf.getEntriesByType('resource');
      
      return entries.map(entry => ({
        name: entry.name.split('/').pop() || entry.name,
        type: entry.initiatorType,
        duration: Math.round(entry.duration),
        size: entry.transferSize || 0
      }));
    });
    
    this.results.resourceLoading = resources;
    
    // リソースタイプ別集計
    const byType = {};
    resources.forEach(r => {
      if (!byType[r.type]) {
        byType[r.type] = { count: 0, totalDuration: 0 };
      }
      byType[r.type].count++;
      byType[r.type].totalDuration += r.duration;
    });
    
    Object.entries(byType).forEach(([type, data]) => {
      console.log(`  ${type}: ${data.count} files, ${data.totalDuration}ms total`);
    });
  }

  async measureDOMMetrics(page) {
    console.log('🏗️ Measuring DOM metrics...');
    
    const domMetrics = await page.evaluate(() => {
      const startTime = performance.now();
      
      // DOM要素数カウント
      const allElements = document.querySelectorAll('*').length;
      const buttons = document.querySelectorAll('button').length;
      const inputs = document.querySelectorAll('input, select, textarea').length;
      
      // DOM深度計算
      function getMaxDepth(element, currentDepth = 0) {
        if (!element.children || element.children.length === 0) {
          return currentDepth;
        }
        
        let maxDepth = currentDepth;
        for (const child of element.children) {
          maxDepth = Math.max(maxDepth, getMaxDepth(child, currentDepth + 1));
        }
        return maxDepth;
      }
      
      const maxDepth = getMaxDepth(document.body);
      const queryTime = performance.now() - startTime;
      
      return {
        totalElements: allElements,
        interactiveElements: buttons + inputs,
        domDepth: maxDepth,
        queryTime: Math.round(queryTime * 100) / 100
      };
    });
    
    this.results.domMetrics = domMetrics;
    
    console.log(`  Total Elements: ${domMetrics.totalElements}`);
    console.log(`  Interactive Elements: ${domMetrics.interactiveElements}`);
    console.log(`  DOM Depth: ${domMetrics.domDepth}`);
    console.log(`  Query Time: ${domMetrics.queryTime}ms`);
  }

  async measureInteractionSpeed(page) {
    console.log('🖱️ Measuring interaction speed...');
    
    try {
      // スタートボタンクリック速度
      const startTime = Date.now();
      await page.click('#start-btn');
      await page.waitForSelector('#question-screen', { timeout: 5000 });
      const transitionTime = Date.now() - startTime;
      
      console.log(`  Start Button Response: ${transitionTime}ms`);
      
      // オプション選択速度
      const optionStart = Date.now();
      const firstOption = await page.$('.option');
      if (firstOption) {
        await firstOption.click();
        const optionTime = Date.now() - optionStart;
        console.log(`  Option Selection Response: ${optionTime}ms`);
      }
      
    } catch (error) {
      console.log('  ⚠️ Could not measure interaction speed');
    }
  }

  generateReport() {
    console.log('\n📊 Performance Test Summary:');
    
    const loadTime = this.results.metrics.pageLoadTime;
    const loadStatus = loadTime < 3000 ? 'PASS ✅' : 'FAIL ❌';
    console.log(`  Page Load: ${loadStatus} (${loadTime}ms)`);
    
    const domElements = this.results.domMetrics.totalElements;
    const domStatus = domElements < 1500 ? 'PASS ✅' : 'WARNING ⚠️';
    console.log(`  DOM Complexity: ${domStatus} (${domElements} elements)`);
    
    const resources = this.results.metrics.resources;
    const resourceStatus = resources < 20 ? 'PASS ✅' : 'WARNING ⚠️';
    console.log(`  Resource Count: ${resourceStatus} (${resources} resources)`);
    
    // レポート保存
    const reportPath = path.join(__dirname, '..', 'performance-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📝 Performance report saved to: performance-test-report.json`);
  }
}

// テスト実行
const tester = new PerformanceTester();
tester.runTests().catch(console.error);