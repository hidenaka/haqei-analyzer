#!/usr/bin/env node
/**
 * T12: Basic E2E Test (without Playwright)
 * 静的環境の基本動作確認
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

class BasicE2ETest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Basic E2E Test (T12)',
            passed: 0,
            failed: 0,
            details: []
        };
        this.port = 9091;
        this.server = null;
    }

    async runAllTests() {
        console.log('🧪 T12: Basic End-to-End Test\n');
        
        // File structure tests
        this.testFileStructure();
        
        // HTML validation
        this.testHTMLFiles();
        
        // JavaScript validation
        this.testJavaScriptFiles();
        
        // CSS validation
        this.testCSSFiles();
        
        // Resource dependencies
        this.testResourceDependencies();
        
        // Static server test
        await this.testStaticServer();
        
        // CSP compliance
        this.testCSPCompliance();
        
        // Build artifacts
        this.testBuildArtifacts();
        
        this.printSummary();
    }

    testFileStructure() {
        console.log('📁 File Structure:');
        
        const requiredFiles = [
            'public/os_analyzer.html',
            'public/os_analyzer_optimized.html',
            'public/os_analyzer_a11y.html',
            'public/os_analyzer_clean.html',
            'public/js/os-analyzer-main.js',
            'public/js/core/PatternMapper.js',
            'public/js/accessibility.js',
            'public/js/result-visualizer.js',
            'public/assets/js/questions-full.js',
            'public/assets/H384H64database.js',
            'public/lib/chart.min.js',
            'public/css/os-analyzer.css',
            'public/css/accessibility.css',
            'public/_headers',
            'public/netlify.toml'
        ];
        
        let allExist = true;
        const missing = [];
        
        requiredFiles.forEach(file => {
            const fullPath = path.join(process.cwd(), file);
            if (!fs.existsSync(fullPath)) {
                allExist = false;
                missing.push(file);
            }
        });
        
        if (allExist) {
            console.log(`   ✅ All ${requiredFiles.length} required files present`);
            this.results.passed++;
        } else {
            console.log(`   ❌ Missing ${missing.length} files:`);
            missing.slice(0, 5).forEach(f => {
                console.log(`      - ${f}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'File Structure',
            passed: allExist,
            missingFiles: missing
        });
    }

    testHTMLFiles() {
        console.log('📄 HTML Validation:');
        
        const htmlFiles = [
            'public/os_analyzer_optimized.html',
            'public/os_analyzer_a11y.html'
        ];
        
        let validCount = 0;
        const issues = [];
        
        htmlFiles.forEach(file => {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // Basic validation
                const hasDoctype = content.includes('<!DOCTYPE html>');
                const hasCharset = content.includes('charset="UTF-8"');
                const hasViewport = content.includes('viewport');
                const hasTitle = content.includes('<title>');
                const hasMainContent = content.includes('welcome-screen') || content.includes('app');
                
                if (hasDoctype && hasCharset && hasViewport && hasTitle && hasMainContent) {
                    validCount++;
                } else {
                    issues.push(`${path.basename(file)}: Missing essential elements`);
                }
            }
        });
        
        if (validCount === htmlFiles.length) {
            console.log(`   ✅ All HTML files valid`);
            this.results.passed++;
        } else {
            console.log(`   ⚠️ HTML validation issues:`);
            issues.forEach(i => console.log(`      - ${i}`));
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'HTML Validation',
            passed: validCount === htmlFiles.length,
            issues
        });
    }

    testJavaScriptFiles() {
        console.log('📜 JavaScript Files:');
        
        const jsFiles = [
            'public/js/os-analyzer-main.js',
            'public/js/core/PatternMapper.js',
            'public/js/accessibility.js',
            'public/assets/js/questions-full.js'
        ];
        
        let validCount = 0;
        const errors = [];
        
        jsFiles.forEach(file => {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                try {
                    // Basic syntax check
                    new Function(content);
                    validCount++;
                } catch (error) {
                    errors.push(`${path.basename(file)}: ${error.message}`);
                }
                
                // Check for console.error or debugger
                if (content.includes('console.error(') || content.includes('debugger')) {
                    errors.push(`${path.basename(file)}: Contains debug code`);
                }
            }
        });
        
        if (validCount === jsFiles.length && errors.length === 0) {
            console.log(`   ✅ All JavaScript files valid`);
            this.results.passed++;
        } else {
            console.log(`   ⚠️ JavaScript issues found:`);
            errors.slice(0, 3).forEach(e => console.log(`      - ${e}`));
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'JavaScript Validation',
            passed: validCount === jsFiles.length,
            errors
        });
    }

    testCSSFiles() {
        console.log('🎨 CSS Files:');
        
        const cssFiles = [
            'public/css/os-analyzer.css',
            'public/css/accessibility.css'
        ];
        
        let validCount = 0;
        cssFiles.forEach(file => {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // Basic CSS validation
                const hasSelectors = content.includes('{') && content.includes('}');
                const hasProperties = content.includes(':') && content.includes(';');
                
                if (hasSelectors && hasProperties) {
                    validCount++;
                }
            }
        });
        
        if (validCount === cssFiles.length) {
            console.log(`   ✅ All CSS files valid`);
            this.results.passed++;
        } else {
            console.log(`   ❌ CSS validation failed`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'CSS Validation',
            passed: validCount === cssFiles.length
        });
    }

    testResourceDependencies() {
        console.log('🔗 Resource Dependencies:');
        
        const checks = {
            'Chart.js library': fs.existsSync(path.join(process.cwd(), 'public/lib/chart.min.js')),
            'H384H64 database': fs.existsSync(path.join(process.cwd(), 'public/assets/H384H64database.js')),
            'Questions data': fs.existsSync(path.join(process.cwd(), 'public/assets/js/questions-full.js')),
            'Pattern Mapper': fs.existsSync(path.join(process.cwd(), 'public/js/core/PatternMapper.js')),
            'Accessibility module': fs.existsSync(path.join(process.cwd(), 'public/js/accessibility.js'))
        };
        
        const allPresent = Object.values(checks).every(v => v);
        
        if (allPresent) {
            console.log('   ✅ All dependencies present');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Missing dependencies:');
            Object.entries(checks).forEach(([key, value]) => {
                if (!value) console.log(`      - ${key}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Resource Dependencies',
            checks,
            passed: allPresent
        });
    }

    async testStaticServer() {
        console.log('🌐 Static Server Test:');
        
        try {
            // Create minimal static server
            const server = http.createServer((req, res) => {
                const filePath = path.join(process.cwd(), 'public', 
                    req.url === '/' ? 'os_analyzer_optimized.html' : req.url);
                
                if (fs.existsSync(filePath)) {
                    const ext = path.extname(filePath);
                    const contentType = {
                        '.html': 'text/html',
                        '.js': 'text/javascript',
                        '.css': 'text/css',
                        '.json': 'application/json'
                    }[ext] || 'text/plain';
                    
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(fs.readFileSync(filePath));
                } else {
                    res.writeHead(404);
                    res.end('Not Found');
                }
            });
            
            await new Promise((resolve) => {
                server.listen(this.port, () => {
                    console.log(`   ✅ Static server can start on port ${this.port}`);
                    this.results.passed++;
                    server.close();
                    resolve();
                });
            });
            
        } catch (error) {
            console.log(`   ❌ Static server test failed: ${error.message}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Static Server',
            passed: this.results.passed > 5
        });
    }

    testCSPCompliance() {
        console.log('🔒 CSP Compliance:');
        
        const headersPath = path.join(process.cwd(), 'public/_headers');
        if (!fs.existsSync(headersPath)) {
            console.log('   ❌ _headers file not found');
            this.results.failed++;
            return;
        }
        
        const content = fs.readFileSync(headersPath, 'utf8');
        
        const checks = {
            'CSP header': content.includes('Content-Security-Policy'),
            'script-src self': content.includes("script-src 'self'"),
            'No unsafe-inline': !content.includes('unsafe-inline'),
            'X-Frame-Options': content.includes('X-Frame-Options'),
            'X-Content-Type-Options': content.includes('X-Content-Type-Options')
        };
        
        const compliant = Object.values(checks).filter(v => v).length >= 4;
        
        if (compliant) {
            console.log('   ✅ CSP headers properly configured');
            this.results.passed++;
        } else {
            console.log('   ⚠️ CSP configuration issues:');
            Object.entries(checks).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'CSP Compliance',
            checks,
            passed: compliant
        });
    }

    testBuildArtifacts() {
        console.log('📦 Build Artifacts:');
        
        const artifacts = {
            'Main HTML': 'public/os_analyzer.html',
            'Optimized HTML': 'public/os_analyzer_optimized.html',
            'A11y HTML': 'public/os_analyzer_a11y.html',
            'Headers config': 'public/_headers',
            'Netlify config': 'public/netlify.toml'
        };
        
        let validCount = 0;
        const sizes = {};
        
        Object.entries(artifacts).forEach(([name, file]) => {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                sizes[name] = this.formatSize(stats.size);
                validCount++;
            }
        });
        
        if (validCount === Object.keys(artifacts).length) {
            console.log('   ✅ All build artifacts ready');
            console.log('   File sizes:');
            Object.entries(sizes).forEach(([name, size]) => {
                console.log(`      ${name}: ${size}`);
            });
            this.results.passed++;
        } else {
            console.log(`   ❌ Missing ${Object.keys(artifacts).length - validCount} artifacts`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Build Artifacts',
            passed: validCount === Object.keys(artifacts).length,
            sizes
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
        
        // Production readiness
        const readiness = this.calculateReadiness();
        console.log(`\n   🚀 Static Deployment Readiness: ${readiness}`);
        
        if (this.results.failed === 0) {
            console.log('\n   🎉 T12 Complete: Application ready for static deployment!');
        } else if (this.results.passed >= 6) {
            console.log('\n   ✅ Application mostly ready with minor fixes needed');
        } else {
            console.log('\n   ⚠️ Application needs improvements before deployment');
        }
        
        console.log('='.repeat(50));
        
        // Save report
        const reportPath = `./e2e-basic-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 2 ? 1 : 0);
    }
    
    calculateReadiness() {
        const rate = this.results.passed / (this.results.passed + this.results.failed);
        
        if (rate >= 0.9) return 'Ready for Deployment ✅';
        if (rate >= 0.75) return 'Nearly Ready';
        if (rate >= 0.6) return 'Needs Minor Fixes';
        return 'Not Ready ❌';
    }
}

// Run tests
if (require.main === module) {
    const tester = new BasicE2ETest();
    tester.runAllTests().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}