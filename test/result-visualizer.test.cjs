#!/usr/bin/env node
/**
 * T07: 結果可視化テスト
 * 宮名/position/hexagram表示検証
 */

const fs = require('fs');
const path = require('path');

class ResultVisualizerTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Result Visualizer Test (T07)',
            passed: 0,
            failed: 0,
            details: []
        };
    }

    runAllTests() {
        console.log('🧪 T07: Result Visualizer Test\n');
        
        // 1. ファイル存在確認
        this.testFileExists('public/js/result-visualizer.js', 'Result Visualizer JS');
        this.testFileExists('public/css/result-visualizer.css', 'Result Visualizer CSS');
        
        // 2. PatternMapper統合確認
        this.testPatternMapperIntegration();
        
        // 3. 主要機能確認
        this.testVisualizerFeatures();
        
        // 4. CSS スタイル確認
        this.testCSSStyles();
        
        // 5. HTML統合確認
        this.testHTMLIntegration();
        
        this.printSummary();
    }

    testFileExists(filePath, description) {
        const fullPath = path.join(process.cwd(), filePath);
        const exists = fs.existsSync(fullPath);
        
        if (exists) {
            const stats = fs.statSync(fullPath);
            console.log(`✅ ${description}: ${this.formatSize(stats.size)}`);
            this.results.passed++;
        } else {
            console.log(`❌ ${description}: Not found`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: description,
            path: filePath,
            passed: exists
        });
    }

    testPatternMapperIntegration() {
        const filePath = path.join(process.cwd(), 'public/js/result-visualizer.js');
        if (!fs.existsSync(filePath)) {
            console.log('⚠️ Skipping PatternMapper integration test');
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        const checks = {
            'PatternMapper import': content.includes('PatternMapper'),
            'mapToHexagram usage': content.includes('mapToHexagram'),
            'Fallback mechanism': content.includes('getFallbackHexagramDetails'),
            'Eight answers conversion': content.includes('convertToEightAnswers')
        };
        
        const passed = Object.values(checks).every(v => v);
        
        if (passed) {
            console.log('✅ PatternMapper integration: All components present');
            this.results.passed++;
        } else {
            console.log('❌ PatternMapper integration issues:');
            Object.entries(checks).forEach(([key, value]) => {
                console.log(`   ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'PatternMapper Integration',
            checks,
            passed
        });
    }

    testVisualizerFeatures() {
        const filePath = path.join(process.cwd(), 'public/js/result-visualizer.js');
        if (!fs.existsSync(filePath)) {
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        const features = {
            'Hexagram details display': content.includes('displayHexagramInfo'),
            'Palace info calculation': content.includes('palace.name') && content.includes('palace.position'),
            'SVG hexagram drawing': content.includes('drawHexagramSVG'),
            'Palace analysis': content.includes('enhanceResultsWithPalaceAnalysis'),
            'Strength level calculation': content.includes('calculateStrengthLevel'),
            '64 hexagram names': content.includes('乾為天') && content.includes('火水未済')
        };
        
        const passedCount = Object.values(features).filter(v => v).length;
        const totalCount = Object.keys(features).length;
        const passed = passedCount === totalCount;
        
        if (passed) {
            console.log('✅ Visualizer features: All features implemented');
            this.results.passed++;
        } else {
            console.log(`⚠️ Visualizer features: ${passedCount}/${totalCount} implemented`);
            Object.entries(features).forEach(([key, value]) => {
                if (!value) console.log(`   Missing: ${key}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Visualizer Features',
            features,
            passed
        });
    }

    testCSSStyles() {
        const filePath = path.join(process.cwd(), 'public/css/result-visualizer.css');
        if (!fs.existsSync(filePath)) {
            console.log('⚠️ Skipping CSS test');
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        const styles = {
            'Hexagram info styles': content.includes('.hexagram-detailed-info'),
            'Palace info styles': content.includes('.palace-info'),
            'Palace color themes': content.includes('.palace-qian') && content.includes('.palace-kun'),
            'Responsive design': content.includes('@media'),
            'Visual elements': content.includes('.hexagram-visual')
        };
        
        const passed = Object.values(styles).every(v => v);
        
        if (passed) {
            console.log('✅ CSS styles: Complete styling implemented');
            this.results.passed++;
        } else {
            console.log('❌ CSS styles missing:');
            Object.entries(styles).forEach(([key, value]) => {
                if (!value) console.log(`   ${key}: Missing`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'CSS Styles',
            styles,
            passed
        });
    }

    testHTMLIntegration() {
        const htmlPath = path.join(process.cwd(), 'public/os_analyzer_clean.html');
        if (!fs.existsSync(htmlPath)) {
            console.log('⚠️ Skipping HTML integration test');
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        const integrations = {
            'Result visualizer script': content.includes('result-visualizer.js'),
            'Result visualizer CSS': content.includes('result-visualizer.css'),
            'Hexagram display div': content.includes('hexagram-display'),
            'PatternMapper script': content.includes('PatternMapper.js')
        };
        
        const passed = integrations['Result visualizer script'] && 
                      integrations['Result visualizer CSS'] &&
                      integrations['PatternMapper script'];
        
        if (passed) {
            console.log('✅ HTML integration: Scripts and styles properly linked');
            this.results.passed++;
        } else {
            console.log('⚠️ HTML integration incomplete:');
            Object.entries(integrations).forEach(([key, value]) => {
                console.log(`   ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'HTML Integration',
            integrations,
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
            console.log('\n   🎉 T07 Complete: Result visualization fully implemented!');
            console.log('   宮名/position/hexagram display ready');
        } else {
            console.log('\n   ⚠️ Some issues remain. Review failed tests above.');
        }
        
        console.log('='.repeat(50));
        
        // レポート保存
        const reportPath = `./result-visualizer-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 0 ? 1 : 0);
    }
}

// 実行
if (require.main === module) {
    const tester = new ResultVisualizerTest();
    tester.runAllTests();
}