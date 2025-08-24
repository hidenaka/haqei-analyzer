#!/usr/bin/env node
/**
 * T08: CSPヘッダー検証テスト
 * Content Security Policy validation
 */

const fs = require('fs');
const path = require('path');

class CSPValidationTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'CSP Validation Test (T08)',
            passed: 0,
            failed: 0,
            details: []
        };
    }

    runAllTests() {
        console.log('🧪 T08: CSP Headers Validation Test\n');
        
        // 1. ヘッダーファイル存在確認
        this.testHeaderFiles();
        
        // 2. CSPルール検証
        this.testCSPRules();
        
        // 3. セキュリティヘッダー確認
        this.testSecurityHeaders();
        
        // 4. インラインコード確認
        this.testNoInlineCode();
        
        // 5. 外部リソース対応確認
        this.testExternalResources();
        
        this.printSummary();
    }

    testHeaderFiles() {
        const files = [
            { path: 'public/_headers', name: 'Generic headers file' },
            { path: 'public/netlify.toml', name: 'Netlify config' }
        ];
        
        files.forEach(file => {
            const fullPath = path.join(process.cwd(), file.path);
            const exists = fs.existsSync(fullPath);
            
            if (exists) {
                const stats = fs.statSync(fullPath);
                console.log(`✅ ${file.name}: ${this.formatSize(stats.size)}`);
                this.results.passed++;
            } else {
                console.log(`❌ ${file.name}: Not found`);
                this.results.failed++;
            }
            
            this.results.details.push({
                test: file.name,
                path: file.path,
                passed: exists
            });
        });
    }

    testCSPRules() {
        const headersPath = path.join(process.cwd(), 'public/_headers');
        if (!fs.existsSync(headersPath)) {
            console.log('⚠️ Skipping CSP rules test - _headers not found');
            return;
        }
        
        const content = fs.readFileSync(headersPath, 'utf8');
        
        const cspRules = {
            "default-src 'self'": content.includes("default-src 'self'"),
            "script-src restrictions": content.includes("script-src 'self'"),
            "CDN allowlist": content.includes("https://cdn.jsdelivr.net"),
            "frame-ancestors 'none'": content.includes("frame-ancestors 'none'"),
            "base-uri 'self'": content.includes("base-uri 'self'"),
            "form-action 'self'": content.includes("form-action 'self'")
        };
        
        const passed = Object.values(cspRules).every(v => v);
        
        if (passed) {
            console.log('✅ CSP rules: All security policies configured');
            this.results.passed++;
        } else {
            console.log('❌ CSP rules missing:');
            Object.entries(cspRules).forEach(([key, value]) => {
                if (!value) console.log(`   ${key}: Missing`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'CSP Rules',
            rules: cspRules,
            passed
        });
    }

    testSecurityHeaders() {
        const headersPath = path.join(process.cwd(), 'public/_headers');
        if (!fs.existsSync(headersPath)) {
            return;
        }
        
        const content = fs.readFileSync(headersPath, 'utf8');
        
        const securityHeaders = {
            'X-Frame-Options': content.includes('X-Frame-Options: DENY'),
            'X-Content-Type-Options': content.includes('X-Content-Type-Options: nosniff'),
            'X-XSS-Protection': content.includes('X-XSS-Protection'),
            'Referrer-Policy': content.includes('Referrer-Policy'),
            'Permissions-Policy': content.includes('Permissions-Policy')
        };
        
        const passed = Object.values(securityHeaders).every(v => v);
        
        if (passed) {
            console.log('✅ Security headers: All headers configured');
            this.results.passed++;
        } else {
            console.log('⚠️ Security headers missing:');
            Object.entries(securityHeaders).forEach(([key, value]) => {
                if (!value) console.log(`   ${key}: Missing`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Security Headers',
            headers: securityHeaders,
            passed
        });
    }

    testNoInlineCode() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            console.log('⚠️ Skipping inline code test');
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        // インラインコードのパターン
        const inlinePatterns = {
            'onclick handlers': /onclick\s*=/gi,
            'onload handlers': /onload\s*=/gi,
            'onerror handlers': /onerror\s*=/gi,
            'inline scripts': /<script(?![^>]*src=)[^>]*>[\s\S]+?<\/script>/gi,
            'inline styles': /style\s*=\s*["'][^"']+["']/gi
        };
        
        const violations = {};
        let hasViolations = false;
        
        Object.entries(inlinePatterns).forEach(([name, pattern]) => {
            const matches = content.match(pattern) || [];
            if (matches.length > 0) {
                violations[name] = matches.length;
                hasViolations = true;
            }
        });
        
        if (!hasViolations) {
            console.log('✅ No inline code: CSP-ready HTML');
            this.results.passed++;
        } else {
            console.log('⚠️ Inline code found:');
            Object.entries(violations).forEach(([name, count]) => {
                console.log(`   ${name}: ${count} occurrences`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'No Inline Code',
            violations,
            passed: !hasViolations
        });
    }

    testExternalResources() {
        const headersPath = path.join(process.cwd(), 'public/_headers');
        if (!fs.existsSync(headersPath)) {
            return;
        }
        
        const content = fs.readFileSync(headersPath, 'utf8');
        
        // Chart.js CDNが許可されているか確認
        const cdnAllowed = content.includes('https://cdn.jsdelivr.net');
        
        // T09で自己ホスト化予定のコメント確認
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        let hasChartJS = false;
        
        if (fs.existsSync(htmlPath)) {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            hasChartJS = htmlContent.includes('chart.js') || htmlContent.includes('Chart.js');
        }
        
        if (cdnAllowed && hasChartJS) {
            console.log('✅ External resources: CDN properly configured (pending T09 self-hosting)');
            this.results.passed++;
        } else if (!hasChartJS) {
            console.log('✅ External resources: No external dependencies');
            this.results.passed++;
        } else {
            console.log('⚠️ External resources: CDN configuration issue');
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'External Resources',
            cdnAllowed,
            hasChartJS,
            passed: cdnAllowed || !hasChartJS
        });
    }

    formatSize(bytes) {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary:');
        console.log(`   Total Tests: ${this.results.passed + this.results.failed}`);
        console.log(`   Passed: ${this.results.passed} ✅`);
        console.log(`   Failed: ${this.results.failed} ❌`);
        console.log(`   Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n   🎉 T08 Complete: CSP headers properly configured!');
            console.log('   Ready for static hosting deployment');
        } else {
            console.log('\n   ⚠️ Some issues remain. Review failed tests above.');
        }
        
        console.log('='.repeat(50));
        
        // レポート保存
        const reportPath = `./csp-validation-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 0 ? 1 : 0);
    }
}

// 実行
if (require.main === module) {
    const tester = new CSPValidationTest();
    tester.runAllTests();
}