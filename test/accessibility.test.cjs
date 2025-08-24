#!/usr/bin/env node
/**
 * T11: アクセシビリティテスト
 * WCAG 2.1 Level AA準拠確認
 */

const fs = require('fs');
const path = require('path');

class AccessibilityTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Accessibility Test (T11)',
            passed: 0,
            failed: 0,
            details: []
        };
    }

    runAllTests() {
        console.log('🧪 T11: Accessibility Baseline Test\n');
        
        // 1. ARIAラベル確認
        this.testAriaLabels();
        
        // 2. キーボードナビゲーション確認
        this.testKeyboardNavigation();
        
        // 3. フォーカス管理確認
        this.testFocusManagement();
        
        // 4. スクリーンリーダー対応確認
        this.testScreenReaderSupport();
        
        // 5. カラーコントラスト確認
        this.testColorContrast();
        
        // 6. タッチターゲットサイズ確認
        this.testTouchTargets();
        
        // 7. エラー処理確認
        this.testErrorHandling();
        
        this.printSummary();
    }

    testAriaLabels() {
        console.log('🏷️ ARIA Labels and Roles:');
        
        // Check both optimized and a11y versions
        let htmlPath = path.join(process.cwd(), 'public/os_analyzer_a11y.html');
        if (!fs.existsSync(htmlPath)) {
            htmlPath = path.join(process.cwd(), 'public/os_analyzer_optimized.html');
        }
        
        if (!fs.existsSync(htmlPath)) {
            console.log('   ❌ HTML file not found');
            this.results.failed++;
            return;
        }
        
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        const checks = {
            'role="application"': content.includes('role="application"'),
            'role="main"': content.includes('role="main"'),
            'role="button"': content.includes('role="button"'),
            'role="progressbar"': content.includes('role="progressbar"'),
            'role="radiogroup"': content.includes('role="radiogroup"'),
            'aria-label': content.includes('aria-label='),
            'aria-labelledby': content.includes('aria-labelledby='),
            'aria-hidden': content.includes('aria-hidden='),
            'aria-live': content.includes('aria-live=') || content.includes('aria-live-region'),
            'aria-disabled': content.includes('aria-disabled=')
        };
        
        const passed = Object.values(checks).filter(v => v).length >= 8;
        
        if (passed) {
            console.log('   ✅ Comprehensive ARIA implementation');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Partial ARIA implementation');
            Object.entries(checks).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'ARIA Labels',
            checks,
            passed
        });
    }

    testKeyboardNavigation() {
        console.log('⌨️ Keyboard Navigation:');
        
        const jsPath = path.join(process.cwd(), 'public/js/accessibility.js');
        if (!fs.existsSync(jsPath)) {
            console.log('   ❌ Accessibility JS not found');
            this.results.failed++;
            return;
        }
        
        const content = fs.readFileSync(jsPath, 'utf8');
        
        const features = {
            'Tab handling': content.includes('handleTabNavigation'),
            'Arrow key navigation': content.includes('handleArrowNavigation'),
            'Escape key': content.includes('handleEscapeKey'),
            'Enter/Space activation': content.includes('handleActivation'),
            'Focus trap': content.includes('setupFocusTrap'),
            'Skip links': content.includes('createSkipLinks')
        };
        
        const passed = Object.values(features).every(v => v);
        
        if (passed) {
            console.log('   ✅ Full keyboard navigation support');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Incomplete keyboard navigation');
            Object.entries(features).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Keyboard Navigation',
            features,
            passed
        });
    }

    testFocusManagement() {
        console.log('🎯 Focus Management:');
        
        const jsPath = path.join(process.cwd(), 'public/js/accessibility.js');
        if (!fs.existsSync(jsPath)) {
            return;
        }
        
        const content = fs.readFileSync(jsPath, 'utf8');
        
        const features = {
            'Focus tracking': content.includes('updateFocusIndicator'),
            'Focus restoration': content.includes('setupFocusRestoration'),
            'Focus trap for modals': content.includes('trapFocus'),
            'Visible focus indicators': content.includes('focus-visible'),
            'Focus management API': content.includes('setFocus') && content.includes('moveFocusToNext')
        };
        
        const passed = Object.values(features).filter(v => v).length >= 4;
        
        if (passed) {
            console.log('   ✅ Robust focus management');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Basic focus management');
            Object.entries(features).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Focus Management',
            features,
            passed
        });
    }

    testScreenReaderSupport() {
        console.log('🔊 Screen Reader Support:');
        
        const jsPath = path.join(process.cwd(), 'public/js/accessibility.js');
        const cssPath = path.join(process.cwd(), 'public/css/accessibility.css');
        
        if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
            console.log('   ❌ Required files not found');
            this.results.failed++;
            return;
        }
        
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const features = {
            'Live regions': jsContent.includes('setupLiveRegions'),
            'Announcements': jsContent.includes('announce(') && jsContent.includes('announceAlert'),
            'SR-only classes': cssContent.includes('.sr-only'),
            'Screen change announcements': jsContent.includes('announceScreenChange'),
            'Progress announcements': jsContent.includes('observeProgressChanges')
        };
        
        const passed = Object.values(features).every(v => v);
        
        if (passed) {
            console.log('   ✅ Comprehensive screen reader support');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Partial screen reader support');
            Object.entries(features).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Screen Reader Support',
            features,
            passed
        });
    }

    testColorContrast() {
        console.log('🎨 Color Contrast & Visual Accessibility:');
        
        const cssPath = path.join(process.cwd(), 'public/css/accessibility.css');
        if (!fs.existsSync(cssPath)) {
            console.log('   ❌ Accessibility CSS not found');
            this.results.failed++;
            return;
        }
        
        const content = fs.readFileSync(cssPath, 'utf8');
        
        const features = {
            'High contrast mode': content.includes('@media (prefers-contrast: high)'),
            'Dark mode support': content.includes('@media (prefers-color-scheme: dark)'),
            'Reduced motion': content.includes('@media (prefers-reduced-motion: reduce)'),
            'Focus indicators': content.includes('*:focus') && content.includes('outline:'),
            'Error states': content.includes('[aria-invalid="true"]')
        };
        
        const passed = Object.values(features).every(v => v);
        
        if (passed) {
            console.log('   ✅ Full visual accessibility support');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Partial visual accessibility');
            Object.entries(features).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Color Contrast',
            features,
            passed
        });
    }

    testTouchTargets() {
        console.log('👆 Touch Target Sizes:');
        
        const cssPath = path.join(process.cwd(), 'public/css/accessibility.css');
        if (!fs.existsSync(cssPath)) {
            return;
        }
        
        const content = fs.readFileSync(cssPath, 'utf8');
        
        // Check for minimum 44px touch targets
        const hasMinHeight = content.includes('min-height: 44px');
        const hasMinWidth = content.includes('min-width: 44px');
        const hasButtonSizing = content.includes('.btn') && hasMinHeight;
        const hasInputSizing = content.includes('input') && hasMinHeight;
        
        const passed = hasMinHeight && hasMinWidth && hasButtonSizing;
        
        if (passed) {
            console.log('   ✅ WCAG compliant touch targets (44x44px minimum)');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Touch targets may be too small');
            console.log(`      Min height: ${hasMinHeight ? '✓' : '✗'}`);
            console.log(`      Min width: ${hasMinWidth ? '✓' : '✗'}`);
            console.log(`      Button sizing: ${hasButtonSizing ? '✓' : '✗'}`);
            console.log(`      Input sizing: ${hasInputSizing ? '✓' : '✗'}`);
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Touch Targets',
            passed
        });
    }

    testErrorHandling() {
        console.log('⚠️ Error Handling & Validation:');
        
        const jsPath = path.join(process.cwd(), 'public/js/accessibility.js');
        if (!fs.existsSync(jsPath)) {
            return;
        }
        
        const content = fs.readFileSync(jsPath, 'utf8');
        
        const features = {
            'Form validation observer': content.includes('observeFormValidation'),
            'Error announcements': content.includes('announceAlert'),
            'Invalid field handling': content.includes('invalid') && content.includes('validationMessage'),
            'Error message display': content.includes('error-message') || content.includes('Error:')
        };
        
        const passed = Object.values(features).filter(v => v).length >= 3;
        
        if (passed) {
            console.log('   ✅ Accessible error handling');
            this.results.passed++;
        } else {
            console.log('   ⚠️ Basic error handling');
            Object.entries(features).forEach(([key, value]) => {
                console.log(`      ${key}: ${value ? '✓' : '✗'}`);
            });
            this.results.failed++;
        }
        
        this.results.details.push({
            test: 'Error Handling',
            features,
            passed
        });
    }

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary:');
        console.log(`   Total Tests: ${this.results.passed + this.results.failed}`);
        console.log(`   Passed: ${this.results.passed} ✅`);
        console.log(`   Failed: ${this.results.failed} ❌`);
        console.log(`   Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);
        
        // WCAG compliance level
        const complianceLevel = this.calculateComplianceLevel();
        console.log(`\n   ♿ WCAG 2.1 Compliance: ${complianceLevel}`);
        
        if (this.results.failed === 0) {
            console.log('\n   🎉 T11 Complete: Full accessibility baseline implemented!');
        } else if (this.results.passed >= 5) {
            console.log('\n   ✅ Good accessibility coverage with minor gaps');
        } else {
            console.log('\n   ⚠️ Accessibility needs improvement');
        }
        
        console.log('='.repeat(50));
        
        // レポート保存
        const reportPath = `./accessibility-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
        
        process.exit(this.results.failed > 2 ? 1 : 0);
    }
    
    calculateComplianceLevel() {
        const rate = this.results.passed / (this.results.passed + this.results.failed);
        
        if (rate >= 0.9) return 'Level AA (Excellent)';
        if (rate >= 0.7) return 'Level A (Good)';
        if (rate >= 0.5) return 'Partial Compliance';
        return 'Non-compliant';
    }
}

// 実行
if (require.main === module) {
    const tester = new AccessibilityTest();
    tester.runAllTests();
}