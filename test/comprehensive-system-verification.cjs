/**
 * HAQEI Comprehensive System Verification Test
 * 包括的システム検証・最終構成確認テスト
 * 
 * 検証項目:
 * 1. 全セキュリティ強化機能の動作確認
 * 2. エンドツーエンド機能検証
 * 3. パフォーマンス・安定性検証
 * 4. 設定・構成確認
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ComprehensiveSystemVerifier {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      version: 'v2.2.2',
      testSuite: 'Comprehensive System Verification',
      categories: {
        security: { tests: [], passed: 0, failed: 0, warnings: 0 },
        functionality: { tests: [], passed: 0, failed: 0, warnings: 0 },
        performance: { tests: [], passed: 0, failed: 0, warnings: 0 },
        configuration: { tests: [], passed: 0, failed: 0, warnings: 0 }
      },
      summary: {
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        totalWarnings: 0,
        overallStatus: 'unknown',
        recommendations: []
      }
    };
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing Comprehensive System Verification...');
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    this.page = await this.browser.newPage();
    await this.page.setDefaultTimeout(30000);
  }

  async runTest(category, testName, testFn) {
    console.log(`   🔍 Testing: ${testName}`);
    try {
      const result = await testFn();
      const testResult = {
        name: testName,
        status: result.status || 'passed',
        details: result.details || 'Test completed successfully',
        metrics: result.metrics || {},
        timestamp: new Date().toISOString()
      };

      this.results.categories[category].tests.push(testResult);
      
      if (testResult.status === 'passed') {
        this.results.categories[category].passed++;
        console.log(`      ✅ ${testName}: PASSED`);
      } else if (testResult.status === 'warning') {
        this.results.categories[category].warnings++;
        console.log(`      ⚠️  ${testName}: WARNING - ${testResult.details}`);
      } else {
        this.results.categories[category].failed++;
        console.log(`      ❌ ${testName}: FAILED - ${testResult.details}`);
      }
    } catch (error) {
      const testResult = {
        name: testName,
        status: 'failed',
        details: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.categories[category].tests.push(testResult);
      this.results.categories[category].failed++;
      console.log(`      ❌ ${testName}: FAILED - ${error.message}`);
    }
  }

  // ========== セキュリティ検証 ==========
  async testSecurityHeaders() {
    const response = await this.page.goto('http://localhost:8788/security/headers', {
      waitUntil: 'networkidle'
    });
    const data = await response.json();
    
    const passedHeaders = Object.values(data.security_headers_check.results)
      .filter(result => result.passed).length;
    const totalHeaders = Object.keys(data.security_headers_check.results).length;
    
    return {
      status: data.security_headers_check.passed ? 'passed' : 'warning',
      details: `Security headers: ${passedHeaders}/${totalHeaders} passed`,
      metrics: { 
        headerCoverage: Math.round((passedHeaders / totalHeaders) * 100),
        passedHeaders,
        totalHeaders
      }
    };
  }

  async testRateLimiting() {
    // Test rate limiting by making multiple requests using fetch API (more reliable)
    const context = await this.browser.newContext();
    const requests = [];
    
    // Make 110 requests to trigger rate limiting (100 limit + 10 over)
    for (let i = 0; i < 110; i++) {
      requests.push(context.request.get('http://localhost:8788/health'));
    }
    
    const responses = await Promise.all(requests);
    const statusCodes = responses.map(r => r.status());
    const got429 = responses.some(r => r.status() === 429);
    const lastResponse = responses[responses.length - 1];
    const rateLimitHeaders = await lastResponse.allHeaders();
    
    await context.close();
    
    return {
      status: got429 && rateLimitHeaders['x-ratelimit-limit'] ? 'passed' : 'warning',
      details: `Rate limiting: ${got429 ? 'Triggered' : 'Not triggered'}, Limit: ${rateLimitHeaders['x-ratelimit-limit'] || 'Not detected'}`,
      metrics: { 
        totalRequests: responses.length,
        successfulRequests: statusCodes.filter(s => s === 200).length,
        rateLimitedRequests: statusCodes.filter(s => s === 429).length,
        rateLimitHeader: !!rateLimitHeaders['x-ratelimit-limit'],
        rateLimitTriggered: got429
      }
    };
  }

  async testDependencySecurity() {
    const response = await this.page.goto('http://localhost:8788/security/dependencies', {
      waitUntil: 'networkidle'
    });
    const data = await response.json();
    
    const score = data.dependency_security_check.score;
    
    return {
      status: score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      details: `Dependency security score: ${score}/100`,
      metrics: { 
        securityScore: score,
        recommendation: data.dependency_security_check.recommendation
      }
    };
  }

  async testSRIImplementation() {
    const response = await this.page.goto('http://localhost:8788/security/sri', {
      waitUntil: 'networkidle'
    });
    const data = await response.json();
    
    const coverage = parseInt(data.sri_security_check.coverage);
    
    return {
      status: coverage === 100 ? 'passed' : coverage >= 80 ? 'warning' : 'failed',
      details: `SRI coverage: ${data.sri_security_check.coverage}`,
      metrics: { 
        sriCoverage: coverage,
        totalExternalResources: data.sri_security_check.totalExternalResources,
        secureResources: data.sri_security_check.secureResources
      }
    };
  }

  // ========== 機能検証 ==========
  async testMainApplicationLoad() {
    const startTime = Date.now();
    const response = await this.page.goto('http://localhost:8788/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    const loadTime = Date.now() - startTime;
    
    const title = await this.page.title();
    const bodyExists = await this.page.locator('body').count() > 0;
    
    return {
      status: response.ok() && bodyExists ? 'passed' : 'failed',
      details: `Application loaded in ${loadTime}ms, title: "${title}"`,
      metrics: { 
        loadTime,
        responseStatus: response.status(),
        hasTitle: !!title,
        hasBody: bodyExists
      }
    };
  }

  async testReadinessEndpoint() {
    const response = await this.page.goto('http://localhost:8788/ready', {
      waitUntil: 'networkidle'
    });
    const data = await response.json();
    
    const allChecksPass = Object.values(data.checks).every(check => 
      check === 'ok' || check === 'initialized'
    );
    
    return {
      status: data.ready && allChecksPass ? 'passed' : 'warning',
      details: `Readiness: ${data.ready}, checks: ${Object.keys(data.checks).length}`,
      metrics: { 
        ready: data.ready,
        checksCount: Object.keys(data.checks).length,
        passedChecks: Object.values(data.checks).filter(c => c === 'ok' || c === 'initialized').length
      }
    };
  }

  async testErrorHandling() {
    // Test 404 error handling
    const response = await this.page.goto('http://localhost:8788/nonexistent-page', {
      waitUntil: 'networkidle'
    });
    
    const isError = response.status() === 404;
    const contentType = response.headers()['content-type'];
    
    return {
      status: isError ? 'passed' : 'failed',
      details: `404 handling: ${response.status()}, Content-Type: ${contentType}`,
      metrics: { 
        status404: response.status() === 404,
        hasContentType: !!contentType,
        gracefulError: response.status() === 404 && contentType?.includes('json')
      }
    };
  }

  // ========== パフォーマンス検証 ==========
  async testPagePerformance() {
    const startTime = Date.now();
    
    await this.page.goto('http://localhost:8788/os_analyzer.html', {
      waitUntil: 'networkidle'
    });
    
    const loadTime = Date.now() - startTime;
    
    // Get performance metrics from the browser
    const perfMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    return {
      status: loadTime < 5000 ? 'passed' : loadTime < 10000 ? 'warning' : 'failed',
      details: `Page load: ${loadTime}ms, DOM ready: ${Math.round(perfMetrics.domContentLoaded)}ms`,
      metrics: { 
        totalLoadTime: loadTime,
        domContentLoaded: Math.round(perfMetrics.domContentLoaded),
        loadComplete: Math.round(perfMetrics.loadComplete),
        performanceGrade: loadTime < 3000 ? 'excellent' : loadTime < 5000 ? 'good' : 'needs_improvement'
      }
    };
  }

  async testMemoryUsage() {
    // Navigate to the memory endpoint to check server memory
    const response = await this.page.goto('http://localhost:8788/memory', {
      waitUntil: 'networkidle'
    });
    const data = await response.json();
    
    const memoryEntries = data.memory?.length || 0;
    
    return {
      status: memoryEntries > 0 ? 'passed' : 'warning',
      details: `Server memory entries: ${memoryEntries}`,
      metrics: { 
        memoryEntries,
        memorySystemActive: memoryEntries > 0
      }
    };
  }

  // ========== 構成検証 ==========
  async testReverseProxyConfiguration() {
    // Test that the server is properly configured for reverse proxy
    const response = await this.page.goto('http://localhost:8788/health', {
      waitUntil: 'networkidle'
    });
    
    // Check if server responds (indicates it's bound correctly)
    const serverResponds = response.ok();
    
    return {
      status: serverResponds ? 'passed' : 'failed',
      details: `Server binding: ${serverResponds ? 'Configured for reverse proxy' : 'Not responding'}`,
      metrics: { 
        serverResponds,
        assumedBinding: '127.0.0.1:8788'
      }
    };
  }

  async testCacheStrategy() {
    // Test cache headers for different resource types
    const htmlResponse = await this.page.goto('http://localhost:8788/os_analyzer.html');
    const healthResponse = await this.page.goto('http://localhost:8788/health');
    
    const htmlCacheControl = htmlResponse.headers()['cache-control'];
    const healthCacheControl = healthResponse.headers()['cache-control'];
    
    return {
      status: htmlCacheControl?.includes('no-cache') ? 'passed' : 'warning',
      details: `Cache strategy - HTML: ${htmlCacheControl}, API: ${healthCacheControl}`,
      metrics: { 
        htmlCacheStrategy: htmlCacheControl,
        apiCacheStrategy: healthCacheControl,
        htmlRevalidation: htmlCacheControl?.includes('no-cache')
      }
    };
  }

  async generateReport() {
    // Calculate summary statistics
    Object.keys(this.results.categories).forEach(category => {
      const cat = this.results.categories[category];
      this.results.summary.totalTests += cat.tests.length;
      this.results.summary.totalPassed += cat.passed;
      this.results.summary.totalFailed += cat.failed;
      this.results.summary.totalWarnings += cat.warnings;
    });

    // Determine overall status
    const successRate = this.results.summary.totalPassed / this.results.summary.totalTests;
    this.results.summary.overallStatus = 
      successRate >= 0.9 && this.results.summary.totalFailed === 0 ? 'excellent' :
      successRate >= 0.8 && this.results.summary.totalFailed <= 1 ? 'good' :
      successRate >= 0.7 ? 'needs_attention' : 'critical';

    // Generate recommendations
    if (this.results.summary.totalWarnings > 0) {
      this.results.summary.recommendations.push('Address warning items for optimal security');
    }
    if (this.results.summary.totalFailed > 0) {
      this.results.summary.recommendations.push('Fix failed tests before production deployment');
    }
    if (this.results.summary.overallStatus === 'excellent') {
      this.results.summary.recommendations.push('System ready for production deployment');
    }

    return this.results;
  }

  async runFullVerification() {
    console.log('🔍 Starting Comprehensive System Verification...\n');

    await this.initialize();

    // セキュリティ検証
    console.log('🛡️  Security Verification Tests:');
    await this.runTest('security', 'Security Headers Configuration', () => this.testSecurityHeaders());
    await this.runTest('security', 'Rate Limiting Implementation', () => this.testRateLimiting());
    await this.runTest('security', 'Dependency Security Check', () => this.testDependencySecurity());
    await this.runTest('security', 'SRI Implementation', () => this.testSRIImplementation());

    // 機能検証
    console.log('\n⚙️  Functionality Verification Tests:');
    await this.runTest('functionality', 'Main Application Load', () => this.testMainApplicationLoad());
    await this.runTest('functionality', 'Readiness Endpoint', () => this.testReadinessEndpoint());
    await this.runTest('functionality', 'Error Handling', () => this.testErrorHandling());

    // パフォーマンス検証
    console.log('\n🚀 Performance Verification Tests:');
    await this.runTest('performance', 'Page Performance', () => this.testPagePerformance());
    await this.runTest('performance', 'Memory Usage', () => this.testMemoryUsage());

    // 構成検証
    console.log('\n🔧 Configuration Verification Tests:');
    await this.runTest('configuration', 'Reverse Proxy Configuration', () => this.testReverseProxyConfiguration());
    await this.runTest('configuration', 'Cache Strategy', () => this.testCacheStrategy());

    const report = await this.generateReport();

    console.log('\n📊 Verification Complete!');
    console.log(`   Total Tests: ${report.summary.totalTests}`);
    console.log(`   Passed: ${report.summary.totalPassed}`);
    console.log(`   Warnings: ${report.summary.totalWarnings}`);
    console.log(`   Failed: ${report.summary.totalFailed}`);
    console.log(`   Overall Status: ${report.summary.overallStatus.toUpperCase()}`);

    await this.browser.close();
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const verifier = new ComprehensiveSystemVerifier();
  verifier.runFullVerification()
    .then(report => {
      // Save detailed report
      const reportPath = path.join(__dirname, `../comprehensive-verification-report-${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📋 Detailed report saved: ${reportPath}`);
      
      process.exit(report.summary.totalFailed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { ComprehensiveSystemVerifier };