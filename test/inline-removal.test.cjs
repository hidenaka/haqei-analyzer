#!/usr/bin/env node
/**
 * T03: インライン削除検証テスト
 * CSP準拠のための外部化確認
 */

const fs = require('fs');
const path = require('path');

class InlineRemovalTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Inline Removal Test',
            passed: 0,
            failed: 0,
            details: []
        };
    }

    runAllTests() {
        console.log('🧪 T03: Inline Removal Test\n');
        
        // 1. クリーンHTMLファイル存在確認
        this.testFileExists('public/os_analyzer_clean.html', 'Clean HTML file');
        
        // 2. 外部CSSファイル存在確認
        this.testFileExists('public/css/os-analyzer.css', 'External CSS file');
        
        // 3. 外部JSファイル存在確認
        this.testFileExists('public/js/os-analyzer-main.js', 'External JS file');
        this.testFileExists('public/js/event-handlers.js', 'Event handlers JS');
        
        // 4. インラインスタイル/スクリプトが無いことを確認
        this.testNoInlineStyles();
        this.testNoInlineScripts();
        this.testNoInlineEventHandlers();
        
        // 5. defer属性の確認
        this.testDeferAttributes();
        
        // 6. CSPヘッダー準備状況
        this.testCSPReadiness();
        
        this.printSummary();
    }

    testFileExists(filePath, description) {
        const fullPath = path.join(process.cwd(), filePath);
        const exists = fs.existsSync(fullPath);
        
        if (exists) {
            const stats = fs.statSync(fullPath);
            console.log(`✅ ${description}: ${filePath} (${this.formatSize(stats.size)})`);
            this.results.passed++;
        } else {
            console.log(`❌ ${description}: ${filePath} not found`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: description,
            path: filePath,
            passed: exists
        });
    }

    testNoInlineStyles() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            console.log('⚠️ Clean HTML file not found, skipping inline style test');
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        const styleTagCount = (content.match(/<style[^>]*>/gi) || []).length;
        const inlineStyleCount = (content.match(/style\s*=\s*["'][^"']+["']/gi) || []).length;
        
        const passed = styleTagCount === 0 && inlineStyleCount === 0;
        
        if (passed) {
            console.log('✅ No inline styles found');
            this.results.passed++;
        } else {
            console.log(`❌ Inline styles found: ${styleTagCount} <style> tags, ${inlineStyleCount} style attributes`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'No inline styles',
            styleTags: styleTagCount,
            styleAttributes: inlineStyleCount,
            passed
        });
    }

    testNoInlineScripts() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        // <script>タグの内容を確認（外部ファイル参照は除く）
        const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
        const inlineScripts = scriptMatches.filter(match => {
            // src属性がない場合はインラインスクリプト
            return !match.match(/src\s*=/i) && match.replace(/<\/?script[^>]*>/gi, '').trim().length > 0;
        });
        
        const passed = inlineScripts.length === 0;
        
        if (passed) {
            console.log('✅ No inline scripts found');
            this.results.passed++;
        } else {
            console.log(`❌ ${inlineScripts.length} inline script blocks found`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'No inline scripts',
            inlineScriptCount: inlineScripts.length,
            passed
        });
    }

    testNoInlineEventHandlers() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        const eventHandlerPattern = /on(click|load|error|change|submit|focus|blur|mouseover|mouseout|keydown|keyup)\s*=\s*["'][^"']+["']/gi;
        const matches = content.match(eventHandlerPattern) || [];
        
        const passed = matches.length === 0;
        
        if (passed) {
            console.log('✅ No inline event handlers found');
            this.results.passed++;
        } else {
            console.log(`❌ ${matches.length} inline event handlers found`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'No inline event handlers',
            eventHandlerCount: matches.length,
            passed
        });
    }

    testDeferAttributes() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        const scriptTags = content.match(/<script[^>]*src[^>]*>/gi) || [];
        const deferScripts = scriptTags.filter(tag => tag.includes('defer'));
        
        const deferRatio = scriptTags.length > 0 ? deferScripts.length / scriptTags.length : 0;
        const passed = deferRatio >= 0.7; // 70%以上のスクリプトにdefer
        
        if (passed) {
            console.log(`✅ Defer optimization: ${deferScripts.length}/${scriptTags.length} scripts use defer`);
            this.results.passed++;
        } else {
            console.log(`⚠️ Defer optimization: Only ${deferScripts.length}/${scriptTags.length} scripts use defer`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Defer attributes',
            totalScripts: scriptTags.length,
            deferScripts: deferScripts.length,
            ratio: deferRatio,
            passed
        });
    }

    testCSPReadiness() {
        const checks = {
            'No inline styles': this.results.details.find(d => d.test === 'No inline styles')?.passed,
            'No inline scripts': this.results.details.find(d => d.test === 'No inline scripts')?.passed,
            'No inline event handlers': this.results.details.find(d => d.test === 'No inline event handlers')?.passed,
            'External files exist': this.results.details.filter(d => d.test.includes('file')).every(d => d.passed)
        };
        
        const passed = Object.values(checks).every(v => v === true);
        
        if (passed) {
            console.log('✅ CSP ready: All inline code removed and externalized');
            this.results.passed++;
        } else {
            console.log('⚠️ CSP not ready: Some inline code remains');
            const failures = Object.entries(checks).filter(([k, v]) => !v).map(([k]) => k);
            console.log(`   Failed checks: ${failures.join(', ')}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'CSP Readiness',
            checks,
            passed
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
            console.log('\n   🎉 T03 Complete: All inline code successfully externalized!');
            console.log('   Ready for CSP implementation (T08)');
        } else {
            console.log('\n   ⚠️ Some issues remain. Review failed tests above.');
        }
        
        console.log('='.repeat(50));
        
        // レポート保存
        const reportPath = `./inline-removal-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 0 ? 1 : 0);
    }
}

// 実行
if (require.main === module) {
    const tester = new InlineRemovalTest();
    tester.runAllTests();
}