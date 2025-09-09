// HAQEI Analyzer Results Page Comprehensive Test
// QA Testing Progress: 20250822

console.log('🎯 HAQEI Results Page Comprehensive Test Starting...');

class ResultsPageTester {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.testResults = {
            ui: { passed: 0, failed: 0, tests: [] },
            functionality: { passed: 0, failed: 0, tests: [] },
            data: { passed: 0, failed: 0, tests: [] },
            performance: { passed: 0, failed: 0, tests: [] }
        };
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log('📋 Starting comprehensive test suite...');
        
        try {
            await this.testUIDisplay();
            await this.testFunctionality();
            await this.testDataIntegrity();
            await this.testPerformance();
            
            this.generateReport();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testUIDisplay() {
        console.log('\n🎨 Testing UI Display...');
        
        // Test 1: Page Load
        await this.runTest('ui', 'Page Load', async () => {
            const response = await fetch(`${this.baseUrl}/results.html`);
            return response.ok;
        });

        // Test 2: CSS Loading
        await this.runTest('ui', 'CSS Resources', async () => {
            const cssResponse = await fetch(`${this.baseUrl}/css/results.css`);
            const unifiedResponse = await fetch(`${this.baseUrl}/css/haqei-unified-design.css`);
            return cssResponse.ok && unifiedResponse.ok;
        });

        // Test 3: JavaScript Loading
        await this.runTest('ui', 'JavaScript Resources', async () => {
            const responses = await Promise.all([
                fetch(`${this.baseUrl}/js/shared/core/StorageManager.js`),
                fetch(`${this.baseUrl}/js/components/TabNavigator.js`),
                fetch(`${this.baseUrl}/js/data/hexagram-human-traits-v3.js`)
            ]);
            return responses.every(r => r.ok);
        });
    }

    async testFunctionality() {
        console.log('\n⚙️ Testing Functionality...');
        
        // Test 1: Tab Navigation Structure
        await this.runTest('functionality', 'Tab Structure', async () => {
            const response = await fetch(`${this.baseUrl}/results.html`);
            const html = await response.text();
            return html.includes('tab-nav') && html.includes('tab-content');
        });

        // Test 2: LocalStorage Integration
        await this.runTest('functionality', 'StorageManager Integration', async () => {
            const response = await fetch(`${this.baseUrl}/js/shared/core/StorageManager.js`);
            const code = await response.text();
            return code.includes('localStorage') && code.includes('getItem');
        });

        // Test 3: Error Handling
        await this.runTest('functionality', 'Error Handling Components', async () => {
            const response = await fetch(`${this.baseUrl}/js/components/ErrorDisplayUI.js`);
            return response.ok;
        });
    }

    async testDataIntegrity() {
        console.log('\n📊 Testing Data Integrity...');
        
        // Test 1: V3 Data Structure
        await this.runTest('data', 'V3 Hexagram Data', async () => {
            const response = await fetch(`${this.baseUrl}/js/data/hexagram-human-traits-v3.js`);
            const code = await response.text();
            return code.includes('hexagramHumanTraitsV3') && code.includes('socialTraits');
        });

        // Test 2: I-Ching Database
        await this.runTest('data', 'I-Ching Database', async () => {
            const response = await fetch(`${this.baseUrl}/js/data/data_box.js`);
            const code = await response.text();
            return code.includes('hexagramData') && code.length > 1000;
        });

        // Test 3: Nine Palace Configuration
        await this.runTest('data', 'Nine Palace Data', async () => {
            const response = await fetch(`${this.baseUrl}/js/os-analyzer/data/iching_relationships.js`);
            return response.ok;
        });
    }

    async testPerformance() {
        console.log('\n🚀 Testing Performance...');
        
        // Test 1: Page Load Speed
        await this.runTest('performance', 'Page Load Speed', async () => {
            const start = Date.now();
            const response = await fetch(`${this.baseUrl}/results.html`);
            const loadTime = Date.now() - start;
            console.log(`   Load time: ${loadTime}ms`);
            return loadTime < 3000; // Under 3 seconds
        });

        // Test 2: Resource Size Check
        await this.runTest('performance', 'Resource Sizes', async () => {
            const response = await fetch(`${this.baseUrl}/results.html`);
            const size = response.headers.get('content-length') || (await response.text()).length;
            console.log(`   HTML size: ${size} bytes`);
            return size < 100000; // Under 100KB for HTML
        });

        // Test 3: JavaScript Bundle Size
        await this.runTest('performance', 'JS Bundle Size', async () => {
            const responses = await Promise.all([
                fetch(`${this.baseUrl}/js/data/hexagram-human-traits-v3.js`),
                fetch(`${this.baseUrl}/js/shared/core/StorageManager.js`)
            ]);
            
            let totalSize = 0;
            for (const response of responses) {
                if (response.ok) {
                    const text = await response.text();
                    totalSize += text.length;
                }
            }
            
            console.log(`   JS bundle size: ${totalSize} bytes`);
            return totalSize < 500000; // Under 500KB
        });
    }

    async runTest(category, testName, testFn) {
        try {
            const result = await testFn();
            if (result) {
                this.testResults[category].passed++;
                this.testResults[category].tests.push({ name: testName, status: 'PASS' });
                console.log(`   ✅ ${testName}: PASS`);
            } else {
                this.testResults[category].failed++;
                this.testResults[category].tests.push({ name: testName, status: 'FAIL' });
                console.log(`   ❌ ${testName}: FAIL`);
            }
        } catch (error) {
            this.testResults[category].failed++;
            this.testResults[category].tests.push({ name: testName, status: 'ERROR', error: error.message });
            console.log(`   💥 ${testName}: ERROR - ${error.message}`);
        }
    }

    generateReport() {
        const endTime = Date.now();
        const totalTime = endTime - this.startTime;
        
        console.log('\n📋 COMPREHENSIVE TEST REPORT');
        console.log('='.repeat(50));
        console.log(`Test Duration: ${totalTime}ms`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        
        let totalPassed = 0;
        let totalFailed = 0;
        
        Object.keys(this.testResults).forEach(category => {
            const { passed, failed, tests } = this.testResults[category];
            totalPassed += passed;
            totalFailed += failed;
            
            console.log(`\n${category.toUpperCase()} Tests:`);
            console.log(`  Passed: ${passed}, Failed: ${failed}`);
            
            tests.forEach(test => {
                const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '💥';
                console.log(`  ${icon} ${test.name}`);
                if (test.error) {
                    console.log(`      Error: ${test.error}`);
                }
            });
        });
        
        console.log('\n📊 SUMMARY:');
        console.log(`Total Tests: ${totalPassed + totalFailed}`);
        console.log(`Passed: ${totalPassed}`);
        console.log(`Failed: ${totalFailed}`);
        console.log(`Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
        
        // Critical Issues Check
        this.checkCriticalIssues();
    }

    checkCriticalIssues() {
        console.log('\n🔍 CRITICAL ISSUES ANALYSIS:');
        
        const criticalChecks = [
            { category: 'ui', test: 'Page Load', critical: true },
            { category: 'functionality', test: 'StorageManager Integration', critical: true },
            { category: 'data', test: 'V3 Hexagram Data', critical: true }
        ];
        
        const criticalFailures = [];
        
        criticalChecks.forEach(check => {
            const test = this.testResults[check.category].tests.find(t => t.name === check.test);
            if (test && test.status !== 'PASS') {
                criticalFailures.push(`${check.category}: ${check.test}`);
            }
        });
        
        if (criticalFailures.length > 0) {
            console.log('❌ CRITICAL FAILURES DETECTED:');
            criticalFailures.forEach(failure => console.log(`  - ${failure}`));
        } else {
            console.log('✅ No critical failures detected');
        }
        
        // Recommendations
        this.generateRecommendations();
    }

    generateRecommendations() {
        console.log('\n💡 RECOMMENDATIONS:');
        
        if (this.testResults.performance.failed > 0) {
            console.log('  - Optimize resource loading for better performance');
        }
        
        if (this.testResults.data.failed > 0) {
            console.log('  - Verify data integrity and file paths');
        }
        
        if (this.testResults.functionality.failed > 0) {
            console.log('  - Review JavaScript functionality and error handling');
        }
        
        if (this.testResults.ui.failed > 0) {
            console.log('  - Check CSS and HTML structure');
        }
        
        console.log('  - Consider implementing automated regression testing');
        console.log('  - Monitor performance metrics in production');
    }
}

// Execute tests
const tester = new ResultsPageTester();
tester.runAllTests();
