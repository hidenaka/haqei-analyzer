/**
 * Security Headers Real Response Test
 * セキュリティヘッダーの実レスポンス検証（curl直叩き）
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SecurityHeadersRealTest {
  constructor() {
    this.baseUrl = 'http://localhost:8788';
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'Security Headers Real Response Test',
      tests: [],
      summary: { passed: 0, failed: 0, warnings: 0 }
    };
  }

  async runTest(testName, testFn) {
    console.log(`🔍 Testing: ${testName}`);
    try {
      const result = await testFn();
      this.results.tests.push({
        name: testName,
        status: result.status || 'passed',
        details: result.details || 'Test passed',
        headers: result.headers || {},
        timestamp: new Date().toISOString()
      });
      
      if (result.status === 'passed') {
        this.results.summary.passed++;
        console.log(`   ✅ ${testName}: PASSED`);
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

  async testMainPageSecurityHeaders() {
    const { stdout } = await execAsync(`curl -s -I ${this.baseUrl}/os_analyzer.html`);
    const headers = this.parseHeaders(stdout);
    
    const requiredHeaders = {
      'strict-transport-security': /max-age=\d+/,
      'content-security-policy': /default-src|script-src/,
      'x-content-type-options': /nosniff/,
      'referrer-policy': /no-referrer/,
      'permissions-policy': /geolocation=\(\)/,
      'x-request-id': /req_/
    };
    
    const missing = [];
    const invalid = [];
    
    for (const [headerName, pattern] of Object.entries(requiredHeaders)) {
      const headerValue = headers[headerName];
      if (!headerValue) {
        missing.push(headerName);
      } else if (!pattern.test(headerValue)) {
        invalid.push({ header: headerName, value: headerValue, expected: pattern.toString() });
      }
    }
    
    if (missing.length === 0 && invalid.length === 0) {
      return {
        status: 'passed',
        details: `All ${Object.keys(requiredHeaders).length} security headers present and valid`,
        headers: headers
      };
    } else {
      return {
        status: 'failed',
        details: `Missing: [${missing.join(', ')}], Invalid: [${invalid.map(i => i.header).join(', ')}]`,
        headers: headers,
        missing,
        invalid
      };
    }
  }

  async testCacheHeaders() {
    // Test HTML cache headers
    const { stdout: htmlHeaders } = await execAsync(`curl -s -I ${this.baseUrl}/os_analyzer.html`);
    const htmlParsed = this.parseHeaders(htmlHeaders);
    
    // Test API cache headers
    const { stdout: apiHeaders } = await execAsync(`curl -s -I ${this.baseUrl}/health`);
    const apiParsed = this.parseHeaders(apiHeaders);
    
    const htmlCacheOk = htmlParsed['cache-control']?.includes('no-cache, must-revalidate');
    const apiCacheOk = apiParsed['cache-control']?.includes('no-store, no-cache');
    const htmlHasVary = !!htmlParsed['vary'];
    
    if (htmlCacheOk && apiCacheOk && htmlHasVary) {
      return {
        status: 'passed',
        details: 'Cache headers correctly configured',
        headers: {
          html_cache: htmlParsed['cache-control'],
          api_cache: apiParsed['cache-control'],
          html_vary: htmlParsed['vary']
        }
      };
    } else {
      return {
        status: 'failed',
        details: `HTML cache ok: ${htmlCacheOk}, API cache ok: ${apiCacheOk}, HTML vary: ${htmlHasVary}`,
        headers: {
          html_cache: htmlParsed['cache-control'],
          api_cache: apiParsed['cache-control'],
          html_vary: htmlParsed['vary']
        }
      };
    }
  }

  async testRateLimitHeaders() {
    const { stdout } = await execAsync(`curl -s -I ${this.baseUrl}/health`);
    const headers = this.parseHeaders(stdout);
    
    const rateLimitHeaders = [
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
      'x-ratelimit-window'
    ];
    
    const present = rateLimitHeaders.filter(h => headers[h]);
    const missing = rateLimitHeaders.filter(h => !headers[h]);
    
    if (present.length >= 3) { // At least limit, remaining, reset
      return {
        status: 'passed',
        details: `Rate limit headers present: ${present.length}/4`,
        headers: Object.fromEntries(rateLimitHeaders.map(h => [h, headers[h]]))
      };
    } else {
      return {
        status: 'warning',
        details: `Only ${present.length}/4 rate limit headers present`,
        headers: Object.fromEntries(rateLimitHeaders.map(h => [h, headers[h]])),
        missing
      };
    }
  }

  async testCorrelationId() {
    // Test with provided correlation ID
    const customId = 'test-correlation-' + Date.now();
    const { stdout } = await execAsync(`curl -s -I -H "X-Request-ID: ${customId}" ${this.baseUrl}/health`);
    const headers = this.parseHeaders(stdout);
    
    const returnedId = headers['x-request-id'];
    
    if (returnedId === customId) {
      return {
        status: 'passed',
        details: 'Correlation ID correctly preserved',
        headers: { 'x-request-id': returnedId }
      };
    } else if (returnedId) {
      return {
        status: 'warning',
        details: 'Correlation ID present but not preserved',
        headers: { 'x-request-id': returnedId, expected: customId }
      };
    } else {
      return {
        status: 'failed',
        details: 'No correlation ID in response',
        headers: {}
      };
    }
  }

  async testCSPCompliance() {
    const { stdout } = await execAsync(`curl -s -I ${this.baseUrl}/os_analyzer.html`);
    const headers = this.parseHeaders(stdout);
    
    const csp = headers['content-security-policy'];
    if (!csp) {
      return { status: 'failed', details: 'No CSP header' };
    }
    
    // Check for unsafe directives (should be minimal)
    const hasUnsafeEval = csp.includes("'unsafe-eval'");
    const hasUnsafeInline = csp.includes("'unsafe-inline'");
    const hasFrameAncestors = csp.includes("frame-ancestors 'none'");
    const hasObjectSrc = csp.includes("object-src 'none'");
    
    const unsafeCount = (hasUnsafeEval ? 1 : 0) + (hasUnsafeInline ? 1 : 0);
    
    if (unsafeCount === 0 && hasFrameAncestors && hasObjectSrc) {
      return {
        status: 'passed',
        details: 'CSP is secure (no unsafe directives)',
        headers: { 'content-security-policy': csp }
      };
    } else if (unsafeCount <= 1 && hasFrameAncestors && hasObjectSrc) {
      return {
        status: 'warning',
        details: `CSP mostly secure (${unsafeCount} unsafe directive)`,
        headers: { 'content-security-policy': csp }
      };
    } else {
      return {
        status: 'failed',
        details: `CSP needs hardening (${unsafeCount} unsafe directives)`,
        headers: { 'content-security-policy': csp }
      };
    }
  }

  parseHeaders(curlOutput) {
    const headers = {};
    const lines = curlOutput.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const [, name, value] = match;
        headers[name.toLowerCase().trim()] = value.trim();
      }
    }
    
    return headers;
  }

  async runAllTests() {
    console.log('🔒 Starting Security Headers Real Response Tests...\n');

    await this.runTest('Main Page Security Headers', () => this.testMainPageSecurityHeaders());
    await this.runTest('Cache Headers Configuration', () => this.testCacheHeaders());
    await this.runTest('Rate Limit Headers', () => this.testRateLimitHeaders());
    await this.runTest('Correlation ID Handling', () => this.testCorrelationId());
    await this.runTest('CSP Compliance Check', () => this.testCSPCompliance());

    console.log('\n📊 Security Headers Test Complete!');
    console.log(`   Passed: ${this.results.summary.passed}`);
    console.log(`   Warnings: ${this.results.summary.warnings}`);
    console.log(`   Failed: ${this.results.summary.failed}`);

    return this.results;
  }
}

// CLI execution
if (require.main === module) {
  const tester = new SecurityHeadersRealTest();
  tester.runAllTests()
    .then(results => {
      const success = results.summary.failed === 0;
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Security headers test failed:', error);
      process.exit(1);
    });
}

module.exports = { SecurityHeadersRealTest };