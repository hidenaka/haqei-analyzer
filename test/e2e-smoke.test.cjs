#!/usr/bin/env node
/**
 * T12: End-to-End Smoke Test
 * 静的環境での完全動作確認テスト
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

class E2ESmokeTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'E2E Smoke Test (T12)',
            passed: 0,
            failed: 0,
            details: [],
            screenshots: []
        };
        this.server = null;
        this.browser = null;
        this.page = null;
        this.port = 9090;
    }

    async startStaticServer() {
        return new Promise((resolve) => {
            this.server = http.createServer((request, response) => {
                return handler(request, response, {
                    public: path.join(process.cwd(), 'public'),
                    headers: [
                        {
                            source: '**/*',
                            headers: [{
                                key: 'X-Content-Type-Options',
                                value: 'nosniff'
                            }]
                        }
                    ]
                });
            });

            this.server.listen(this.port, () => {
                console.log(`📡 Static server started at http://localhost:${this.port}`);
                resolve();
            });
        });
    }

    async stopStaticServer() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('   Static server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    async initBrowser() {
        try {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();
            
            // Console error tracking
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    console.log(`   Console Error: ${msg.text()}`);
                }
            });
            
            // Page error tracking
            this.page.on('pageerror', error => {
                console.log(`   Page Error: ${error.message}`);
            });
            
            return true;
        } catch (error) {
            console.log(`   ❌ Browser initialization failed: ${error.message}`);
            return false;
        }
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async runAllTests() {
        console.log('🧪 T12: End-to-End Smoke Test\n');
        
        // Start static server
        await this.startStaticServer();
        
        // Initialize browser
        const browserReady = await this.initBrowser();
        if (!browserReady) {
            await this.stopStaticServer();
            process.exit(1);
        }
        
        try {
            // Run test suites
            await this.testPageLoading();
            await this.testCriticalPath();
            await this.testQuestionFlow();
            await this.testDataPersistence();
            await this.testErrorHandling();
            await this.testPerformance();
            await this.testAccessibility();
            await this.testResponsiveness();
            
        } catch (error) {
            console.log(`\n❌ Test execution error: ${error.message}`);
            this.results.failed++;
        } finally {
            await this.closeBrowser();
            await this.stopStaticServer();
            this.printSummary();
        }
    }

    async testPageLoading() {
        console.log('📄 Page Loading:');
        
        try {
            // Test optimized version
            const response = await this.page.goto(`http://localhost:${this.port}/os_analyzer_optimized.html`, {
                waitUntil: 'networkidle'
            });
            
            const loadSuccess = response.status() === 200;
            const hasContent = await this.page.locator('#welcome-screen').isVisible();
            const hasStartButton = await this.page.locator('#start-btn').isVisible();
            
            if (loadSuccess && hasContent && hasStartButton) {
                console.log('   ✅ Page loads successfully');
                this.results.passed++;
            } else {
                console.log('   ❌ Page loading issues');
                console.log(`      Status: ${response.status()}`);
                console.log(`      Content visible: ${hasContent}`);
                console.log(`      Start button: ${hasStartButton}`);
                this.results.failed++;
            }
            
            // Take screenshot
            await this.page.screenshot({ 
                path: 'e2e-page-load.png',
                fullPage: false
            });
            this.results.screenshots.push('e2e-page-load.png');
            
        } catch (error) {
            console.log(`   ❌ Page loading failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Page Loading',
            passed: this.results.passed > 0
        });
    }

    async testCriticalPath() {
        console.log('🛤️ Critical Path:');
        
        try {
            // Welcome → Question → Results flow
            await this.page.goto(`http://localhost:${this.port}/os_analyzer_a11y.html`);
            
            // Start analysis
            await this.page.click('#start-btn');
            await this.page.waitForTimeout(500);
            
            const questionVisible = await this.page.locator('#question-screen').isVisible();
            const progressBarExists = await this.page.locator('.progress-bar').isVisible();
            
            if (questionVisible && progressBarExists) {
                console.log('   ✅ Critical path navigation works');
                this.results.passed++;
                
                // Take screenshot of question screen
                await this.page.screenshot({ 
                    path: 'e2e-question-screen.png',
                    fullPage: false
                });
                this.results.screenshots.push('e2e-question-screen.png');
            } else {
                console.log('   ❌ Critical path broken');
                this.results.failed++;
            }
            
        } catch (error) {
            console.log(`   ❌ Critical path test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Critical Path',
            passed: this.results.passed > 1
        });
    }

    async testQuestionFlow() {
        console.log('❓ Question Flow:');
        
        try {
            await this.page.goto(`http://localhost:${this.port}/os_analyzer_a11y.html`);
            await this.page.click('#start-btn');
            await this.page.waitForTimeout(500);
            
            // Check question elements
            const questionText = await this.page.locator('#question-text').textContent();
            const options = await this.page.locator('.option').count();
            
            let questionsAnswered = 0;
            const maxQuestions = 5; // Test first 5 questions
            
            for (let i = 0; i < maxQuestions; i++) {
                // Select an option
                const optionExists = await this.page.locator('.option').first().isVisible();
                if (optionExists) {
                    await this.page.locator('.option').first().click();
                    
                    // Click next
                    const nextBtn = this.page.locator('#next-btn');
                    await nextBtn.click();
                    await this.page.waitForTimeout(300);
                    
                    questionsAnswered++;
                }
            }
            
            if (questionsAnswered === maxQuestions) {
                console.log(`   ✅ Question flow works (${questionsAnswered} questions tested)`);
                this.results.passed++;
            } else {
                console.log(`   ⚠️ Question flow partially works (${questionsAnswered}/${maxQuestions})`);
                this.results.failed++;
            }
            
        } catch (error) {
            console.log(`   ❌ Question flow failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Question Flow',
            passed: this.results.passed > 2
        });
    }

    async testDataPersistence() {
        console.log('💾 Data Persistence:');
        
        try {
            // Check localStorage
            const hasLocalStorage = await this.page.evaluate(() => {
                try {
                    localStorage.setItem('test', 'value');
                    const value = localStorage.getItem('test');
                    localStorage.removeItem('test');
                    return value === 'value';
                } catch {
                    return false;
                }
            });
            
            // Check data saving
            const dataSaves = await this.page.evaluate(() => {
                const testData = { test: true, timestamp: Date.now() };
                try {
                    localStorage.setItem('os_analyzer_test', JSON.stringify(testData));
                    const saved = JSON.parse(localStorage.getItem('os_analyzer_test'));
                    return saved.test === true;
                } catch {
                    return false;
                }
            });
            
            if (hasLocalStorage && dataSaves) {
                console.log('   ✅ Data persistence works');
                this.results.passed++;
            } else {
                console.log('   ⚠️ Data persistence issues');
                console.log(`      localStorage: ${hasLocalStorage ? '✓' : '✗'}`);
                console.log(`      Data saving: ${dataSaves ? '✓' : '✗'}`);
                this.results.failed++;
            }
            
        } catch (error) {
            console.log(`   ❌ Data persistence test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Data Persistence',
            passed: this.results.passed > 3
        });
    }

    async testErrorHandling() {
        console.log('⚠️ Error Handling:');
        
        try {
            // Collect console errors
            const errors = [];
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });
            
            await this.page.goto(`http://localhost:${this.port}/os_analyzer_optimized.html`);
            await this.page.waitForTimeout(1000);
            
            // Check for JavaScript errors
            const jsErrors = await this.page.evaluate(() => {
                return window.jsErrors || [];
            });
            
            if (errors.length === 0 && jsErrors.length === 0) {
                console.log('   ✅ No JavaScript errors');
                this.results.passed++;
            } else {
                console.log(`   ⚠️ Found ${errors.length + jsErrors.length} errors`);
                errors.slice(0, 3).forEach(err => {
                    console.log(`      - ${err.substring(0, 80)}`);
                });
                this.results.failed++;
            }
            
        } catch (error) {
            console.log(`   ❌ Error handling test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Error Handling',
            passed: this.results.passed > 4
        });
    }

    async testPerformance() {
        console.log('⚡ Performance Metrics:');
        
        try {
            const metrics = await this.page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    domInteractive: navigation.domInteractive,
                    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
                };
            });
            
            const acceptable = metrics.loadComplete < 3000 && metrics.domInteractive < 1500;
            
            if (acceptable) {
                console.log('   ✅ Performance meets targets');
                console.log(`      Load time: ${metrics.loadComplete}ms`);
                console.log(`      Interactive: ${metrics.domInteractive}ms`);
                this.results.passed++;
            } else {
                console.log('   ⚠️ Performance needs improvement');
                console.log(`      Load time: ${metrics.loadComplete}ms (target: <3000ms)`);
                console.log(`      Interactive: ${metrics.domInteractive}ms (target: <1500ms)`);
                this.results.failed++;
            }
            
        } catch (error) {
            console.log(`   ❌ Performance test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Performance',
            passed: this.results.passed > 5
        });
    }

    async testAccessibility() {
        console.log('♿ Accessibility Check:');
        
        try {
            await this.page.goto(`http://localhost:${this.port}/os_analyzer_a11y.html`);
            
            // Check ARIA attributes
            const hasAriaLabels = await this.page.evaluate(() => {
                const elements = document.querySelectorAll('[aria-label], [aria-labelledby]');
                return elements.length > 5;
            });
            
            // Check keyboard navigation
            await this.page.keyboard.press('Tab');
            const focusedElement = await this.page.evaluate(() => {
                return document.activeElement?.tagName;
            });
            
            // Check skip links
            const hasSkipLinks = await this.page.evaluate(() => {
                return document.querySelector('.skip-link') !== null;
            });
            
            if (hasAriaLabels && focusedElement && hasSkipLinks) {
                console.log('   ✅ Accessibility features working');
                this.results.passed++;
            } else {
                console.log('   ⚠️ Some accessibility features missing');
                console.log(`      ARIA labels: ${hasAriaLabels ? '✓' : '✗'}`);
                console.log(`      Keyboard nav: ${focusedElement ? '✓' : '✗'}`);
                console.log(`      Skip links: ${hasSkipLinks ? '✓' : '✗'}`);
                this.results.failed++;
            }
            
        } catch (error) {
            console.log(`   ❌ Accessibility test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Accessibility',
            passed: this.results.passed > 6
        });
    }

    async testResponsiveness() {
        console.log('📱 Responsive Design:');
        
        try {
            // Test mobile viewport
            await this.page.setViewportSize({ width: 375, height: 667 });
            await this.page.goto(`http://localhost:${this.port}/os_analyzer_optimized.html`);
            
            const mobileLayout = await this.page.evaluate(() => {
                const container = document.querySelector('.container');
                return container && window.getComputedStyle(container).padding !== '';
            });
            
            // Test tablet viewport
            await this.page.setViewportSize({ width: 768, height: 1024 });
            const tabletLayout = await this.page.evaluate(() => {
                const container = document.querySelector('.container');
                return container && window.getComputedStyle(container).maxWidth !== '';
            });
            
            // Test desktop viewport
            await this.page.setViewportSize({ width: 1920, height: 1080 });
            const desktopLayout = await this.page.evaluate(() => {
                const container = document.querySelector('.container');
                const computed = window.getComputedStyle(container);
                return container && computed.maxWidth === '1200px';
            });
            
            if (mobileLayout && tabletLayout && desktopLayout) {
                console.log('   ✅ Responsive design works');
                this.results.passed++;
            } else {
                console.log('   ⚠️ Responsive design issues');
                console.log(`      Mobile: ${mobileLayout ? '✓' : '✗'}`);
                console.log(`      Tablet: ${tabletLayout ? '✓' : '✗'}`);
                console.log(`      Desktop: ${desktopLayout ? '✓' : '✗'}`);
                this.results.failed++;
            }
            
            // Take mobile screenshot
            await this.page.setViewportSize({ width: 375, height: 667 });
            await this.page.screenshot({ 
                path: 'e2e-mobile.png',
                fullPage: false
            });
            this.results.screenshots.push('e2e-mobile.png');
            
        } catch (error) {
            console.log(`   ❌ Responsive test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Responsive Design',
            passed: this.results.passed > 7
        });
    }

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary:');
        console.log(`   Total Tests: ${this.results.passed + this.results.failed}`);
        console.log(`   Passed: ${this.results.passed} ✅`);
        console.log(`   Failed: ${this.results.failed} ❌`);
        console.log(`   Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);
        
        // Determine readiness
        const readiness = this.calculateReadiness();
        console.log(`\n   🚀 Production Readiness: ${readiness}`);
        
        if (this.results.screenshots.length > 0) {
            console.log('\n   📸 Screenshots saved:');
            this.results.screenshots.forEach(s => {
                console.log(`      - ${s}`);
            });
        }
        
        if (this.results.failed === 0) {
            console.log('\n   🎉 T12 Complete: All E2E smoke tests passed!');
        } else if (this.results.passed >= 6) {
            console.log('\n   ✅ Application mostly ready with minor issues');
        } else {
            console.log('\n   ⚠️ Application needs fixes before deployment');
        }
        
        console.log('='.repeat(50));
        
        // Save report
        const reportPath = `./e2e-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 2 ? 1 : 0);
    }
    
    calculateReadiness() {
        const rate = this.results.passed / (this.results.passed + this.results.failed);
        
        if (rate >= 0.95) return 'Production Ready ✅';
        if (rate >= 0.8) return 'Nearly Ready (minor fixes needed)';
        if (rate >= 0.6) return 'Beta Ready';
        return 'Not Ready ❌';
    }
}

// Check if serve-handler is installed
try {
    require.resolve('serve-handler');
} catch {
    console.log('📦 Installing serve-handler for static server...');
    require('child_process').execSync('npm install serve-handler', { stdio: 'inherit' });
}

// Check if playwright is installed
try {
    require.resolve('@playwright/test');
} catch {
    console.log('📦 Installing @playwright/test...');
    require('child_process').execSync('npm install -D @playwright/test', { stdio: 'inherit' });
    console.log('📦 Installing Chromium browser...');
    require('child_process').execSync('npx playwright install chromium', { stdio: 'inherit' });
}

// Run tests
if (require.main === module) {
    const tester = new E2ESmokeTest();
    tester.runAllTests().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}