#!/usr/bin/env node
/**
 * T09: 外部ライブラリ自己ホストテスト
 * Self-hosting external libraries test
 */

const fs = require('fs');
const path = require('path');

class SelfHostingTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Self-Hosting Test (T09)',
            passed: 0,
            failed: 0,
            details: []
        };
    }

    runAllTests() {
        console.log('🧪 T09: Self-Hosting Libraries Test\n');
        
        // 1. ローカルライブラリ存在確認
        this.testLocalLibraries();
        
        // 2. CDN参照が無いことを確認
        this.testNoCDNReferences();
        
        // 3. CSPからCDN除去確認
        this.testCSPNoCDN();
        
        // 4. ファイルサイズ確認
        this.testFileSizes();
        
        // 5. HTML参照確認
        this.testHTMLReferences();
        
        this.printSummary();
    }

    testLocalLibraries() {
        const libraries = [
            { path: 'public/lib/chart.min.js', name: 'Chart.js', minSize: 100000 }
        ];
        
        libraries.forEach(lib => {
            const fullPath = path.join(process.cwd(), lib.path);
            const exists = fs.existsSync(fullPath);
            
            if (exists) {
                const stats = fs.statSync(fullPath);
                if (stats.size >= lib.minSize) {
                    console.log(`✅ ${lib.name}: ${this.formatSize(stats.size)} (self-hosted)`);
                    this.results.passed++;
                } else {
                    console.log(`❌ ${lib.name}: File too small (${this.formatSize(stats.size)})`);
                    this.results.failed++;
                }
            } else {
                console.log(`❌ ${lib.name}: Not found at ${lib.path}`);
                this.results.failed++;
            }
            
            this.results.details.push({
                test: lib.name,
                path: lib.path,
                passed: exists && (!lib.minSize || (exists && fs.statSync(fullPath).size >= lib.minSize))
            });
        });
    }

    testNoCDNReferences() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            console.log('⚠️ Skipping CDN reference test');
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        const cdnPatterns = [
            'cdn.jsdelivr.net',
            'unpkg.com',
            'cdnjs.cloudflare.com',
            'ajax.googleapis.com',
            'cdn.skypack.dev'
        ];
        
        const foundCDNs = [];
        cdnPatterns.forEach(pattern => {
            if (content.includes(pattern)) {
                foundCDNs.push(pattern);
            }
        });
        
        if (foundCDNs.length === 0) {
            console.log('✅ No CDN references: All libraries self-hosted');
            this.results.passed++;
        } else {
            console.log(`❌ CDN references found: ${foundCDNs.join(', ')}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'No CDN References',
            foundCDNs,
            passed: foundCDNs.length === 0
        });
    }

    testCSPNoCDN() {
        const headersPath = path.join(process.cwd(), 'public/_headers');
        const netlifyPath = path.join(process.cwd(), 'public/netlify.toml');
        
        let cspClean = true;
        
        // Check _headers
        if (fs.existsSync(headersPath)) {
            const content = fs.readFileSync(headersPath, 'utf8');
            if (content.includes('cdn.jsdelivr.net') || content.includes('unpkg.com')) {
                cspClean = false;
                console.log('❌ _headers still contains CDN in CSP');
            }
        }
        
        // Check netlify.toml
        if (fs.existsSync(netlifyPath)) {
            const content = fs.readFileSync(netlifyPath, 'utf8');
            if (content.includes('cdn.jsdelivr.net') || content.includes('unpkg.com')) {
                cspClean = false;
                console.log('❌ netlify.toml still contains CDN in CSP');
            }
        }
        
        if (cspClean) {
            console.log('✅ CSP updated: No CDN references in security policy');
            this.results.passed++;
        } else {
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'CSP No CDN',
            passed: cspClean
        });
    }

    testFileSizes() {
        const libDir = path.join(process.cwd(), 'public/lib');
        if (!fs.existsSync(libDir)) {
            console.log('⚠️ lib directory not found');
            this.results.failed++;
            return;
        }
        
        const files = fs.readdirSync(libDir);
        let totalSize = 0;
        
        files.forEach(file => {
            const filePath = path.join(libDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
        });
        
        console.log(`📦 Total library size: ${this.formatSize(totalSize)}`);
        
        // Warn if too large (> 1MB)
        if (totalSize > 1024 * 1024) {
            console.log('⚠️ Libraries exceed 1MB - consider optimization');
        } else {
            console.log('✅ Library size acceptable');
        }
        
        this.results.passed++;
        
        this.results.details.push({
            test: 'File Sizes',
            totalSize,
            passed: true
        });
    }

    testHTMLReferences() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        // Check for local library references
        const localReferences = {
            'Chart.js local': content.includes('lib/chart.min.js') || content.includes('lib/chart.js')
        };
        
        const allLocal = Object.values(localReferences).every(v => v);
        
        if (allLocal) {
            console.log('✅ HTML references: All libraries use local paths');
            this.results.passed++;
        } else {
            console.log('❌ HTML references: Missing local library references');
            Object.entries(localReferences).forEach(([key, value]) => {
                if (!value) console.log(`   ${key}: Missing`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'HTML References',
            references: localReferences,
            passed: allLocal
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
            console.log('\n   🎉 T09 Complete: All libraries self-hosted!');
            console.log('   No external CDN dependencies');
        } else {
            console.log('\n   ⚠️ Some issues remain. Review failed tests above.');
        }
        
        console.log('='.repeat(50));
        
        // レポート保存
        const reportPath = `./self-hosting-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 0 ? 1 : 0);
    }
}

// 実行
if (require.main === module) {
    const tester = new SelfHostingTest();
    tester.runAllTests();
}