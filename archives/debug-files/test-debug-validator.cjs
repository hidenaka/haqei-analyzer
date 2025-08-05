/**
 * Debug Results HTML検証スクリプト
 * http://localhost:8000/debug-results.htmlの包括的検証
 */

const fs = require('fs');
const path = require('path');

class DebugValidator {
    constructor() {
        this.publicDir = path.join(__dirname, 'public');
        this.results = {
            pageAccess: null,
            dependencies: {},
            errors: [],
            recommendations: []
        };
    }

    /**
     * 1. ページアクセス確認
     */
    checkPageAccess() {
        const debugPath = path.join(this.publicDir, 'debug-results.html');
        
        try {
            const exists = fs.existsSync(debugPath);
            const stats = fs.statSync(debugPath);
            
            this.results.pageAccess = {
                exists: exists,
                size: stats.size,
                lastModified: stats.mtime,
                status: exists ? 'OK' : 'NOT_FOUND'
            };
            
            console.log('✅ Page Access:', this.results.pageAccess);
        } catch (error) {
            this.results.pageAccess = {
                exists: false,
                error: error.message,
                status: 'ERROR'
            };
            console.error('❌ Page Access Error:', error.message);
        }
    }

    /**
     * 2. 依存関係の読み込み状況検証
     */
    checkDependencies() {
        const dependencies = [
            // Chart.js (CDN) - スキップ
            './js/shared/data/questions.js',
            './js/shared/data/vectors.js',
            './js/os-analyzer/data/hexagrams.js',
            './js/os-analyzer/data/hexagram_details.js',
            './js/shared/utils/validators.js',
            './js/shared/utils/animations.js',
            './js/shared/core/BaseComponent.js',
            './js/shared/core/StorageManager.js',
            './js/shared/core/DataManager.js',
            './js/shared/core/ErrorHandler.js',
            './js/os-analyzer/core/TripleOSEngine.js',
            './js/os-analyzer/core/PersonalityOS.js',
            './js/os-analyzer/core/VirtualPersonality.js',
            './js/os-analyzer/core/OSRelationshipEngine.js',
            './js/os-analyzer/core/IchingMetaphorEngine.js',
            './js/os-analyzer/components/PersonalityConstructionView.js',
            './js/os-analyzer/components/DialoguePlayer.js',
            './js/os-analyzer/components/OSVoiceSwitcher.js',
            './js/components/VirtualPersonaResultsView.js'
        ];

        console.log('\n📦 Checking Dependencies:');
        
        for (const dep of dependencies) {
            const fullPath = path.join(this.publicDir, dep);
            const exists = fs.existsSync(fullPath);
            
            this.results.dependencies[dep] = {
                exists: exists,
                path: fullPath,
                status: exists ? 'FOUND' : 'MISSING'
            };
            
            if (exists) {
                try {
                    const stats = fs.statSync(fullPath);
                    this.results.dependencies[dep].size = stats.size;
                    this.results.dependencies[dep].lastModified = stats.mtime;
                    console.log(`  ✅ ${dep} (${stats.size} bytes)`);
                } catch (error) {
                    this.results.dependencies[dep].error = error.message;
                    console.log(`  ⚠️  ${dep} - ${error.message}`);
                }
            } else {
                console.log(`  ❌ ${dep} - FILE NOT FOUND`);
                this.results.errors.push(`Missing dependency: ${dep}`);
            }
        }
    }

    /**
     * 3. JavaScriptファイルの構文チェック
     */
    checkJavaScriptSyntax() {
        console.log('\n🔍 JavaScript Syntax Check:');
        
        const jsFiles = [
            './js/shared/core/BaseComponent.js',
            './js/components/VirtualPersonaResultsView.js',
            './js/os-analyzer/core/VirtualPersonality.js',
            './js/os-analyzer/core/TripleOSEngine.js'
        ];

        for (const jsFile of jsFiles) {
            const fullPath = path.join(this.publicDir, jsFile);
            
            if (fs.existsSync(fullPath)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    
                    // 基本的な構文チェック
                    const checks = {
                        hasClass: /class\s+\w+/.test(content),
                        hasConstructor: /constructor\s*\(/.test(content),
                        hasProperExport: /window\.\w+\s*=|module\.exports/.test(content),
                        hasSyntaxErrors: this.checkBasicSyntax(content)
                    };
                    
                    console.log(`  📄 ${jsFile}:`);
                    console.log(`    - Class definition: ${checks.hasClass ? '✅' : '❌'}`);
                    console.log(`    - Constructor: ${checks.hasConstructor ? '✅' : '❌'}`);
                    console.log(`    - Export: ${checks.hasProperExport ? '✅' : '❌'}`);
                    console.log(`    - Syntax: ${!checks.hasSyntaxErrors ? '✅' : '❌'}`);
                    
                    if (checks.hasSyntaxErrors) {
                        this.results.errors.push(`Syntax error in ${jsFile}: ${checks.hasSyntaxErrors}`);
                    }
                    
                } catch (error) {
                    console.log(`  ❌ ${jsFile} - Read error: ${error.message}`);
                    this.results.errors.push(`Cannot read ${jsFile}: ${error.message}`);
                }
            }
        }
    }

    /**
     * 基本的な構文チェック
     */
    checkBasicSyntax(content) {
        try {
            // 基本的なJavaScript構文エラーをチェック
            const issues = [];
            
            // 未閉じ括弧のチェック
            const openBraces = (content.match(/\{/g) || []).length;
            const closeBraces = (content.match(/\}/g) || []).length;
            if (openBraces !== closeBraces) {
                issues.push('Mismatched braces');
            }
            
            // 未閉じ丸括弧のチェック
            const openParens = (content.match(/\(/g) || []).length;
            const closeParens = (content.match(/\)/g) || []).length;
            if (openParens !== closeParens) {
                issues.push('Mismatched parentheses');
            }
            
            return issues.length > 0 ? issues.join(', ') : null;
            
        } catch (error) {
            return error.message;
        }
    }

    /**
     * 4. HTML構造の確認
     */
    checkHTMLStructure() {
        console.log('\n🏗️  HTML Structure Check:');
        
        const htmlPath = path.join(this.publicDir, 'debug-results.html');
        
        try {
            const content = fs.readFileSync(htmlPath, 'utf8');
            
            const checks = {
                hasDoctype: /<!DOCTYPE html>/i.test(content),
                hasHtmlTag: /<html[^>]*>/i.test(content),
                hasHead: /<head>/i.test(content),
                hasBody: /<body>/i.test(content),
                hasTestContainer: /test-container/.test(content),
                hasDebugSections: /debug-section/.test(content),
                hasScriptTags: /<script/.test(content),
                hasChartJS: /Chart\.js/.test(content)
            };
            
            console.log('  Structure checks:');
            Object.entries(checks).forEach(([check, result]) => {
                console.log(`    - ${check}: ${result ? '✅' : '❌'}`);
            });
            
            // スクリプトタグの数をカウント
            const scriptTags = content.match(/<script[^>]*>/g) || [];
            console.log(`  - Script tags found: ${scriptTags.length}`);
            
        } catch (error) {
            console.error('❌ HTML Structure Check Error:', error.message);
            this.results.errors.push(`HTML structure check failed: ${error.message}`);
        }
    }

    /**
     * 5. 推奨される修正事項の生成
     */
    generateRecommendations() {
        console.log('\n💡 Recommendations:');
        
        const missingFiles = Object.entries(this.results.dependencies)
            .filter(([_, info]) => !info.exists)
            .map(([file, _]) => file);
        
        if (missingFiles.length > 0) {
            this.results.recommendations.push({
                type: 'MISSING_FILES',
                severity: 'HIGH',
                description: 'Missing critical dependency files',
                files: missingFiles,
                solution: 'Ensure all referenced JavaScript files exist in the correct locations'
            });
        }
        
        // Chart.js CDN接続性の推奨事項
        this.results.recommendations.push({
            type: 'EXTERNAL_DEPENDENCY',
            severity: 'MEDIUM',
            description: 'Chart.js loaded from CDN',
            solution: 'Verify internet connection for CDN access, consider local fallback'
        });
        
        // コンソールエラー対策の推奨事項
        this.results.recommendations.push({
            type: 'ERROR_HANDLING',
            severity: 'MEDIUM',
            description: 'Enhanced error handling needed',
            solution: 'Add try-catch blocks around dependency initialization'
        });
        
        this.results.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. [${rec.severity}] ${rec.description}`);
            console.log(`     Solution: ${rec.solution}`);
        });
    }

    /**
     * 6. 総合レポートの生成
     */
    generateReport() {
        console.log('\n📊 Summary Report:');
        console.log('==================');
        
        const totalDeps = Object.keys(this.results.dependencies).length;
        const foundDeps = Object.values(this.results.dependencies)
            .filter(dep => dep.exists).length;
        const missingDeps = totalDeps - foundDeps;
        
        console.log(`Dependencies: ${foundDeps}/${totalDeps} found`);
        console.log(`Missing files: ${missingDeps}`);
        console.log(`Errors: ${this.results.errors.length}`);
        console.log(`Recommendations: ${this.results.recommendations.length}`);
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ Errors found:');
            this.results.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        const overallStatus = missingDeps === 0 && this.results.errors.length === 0 
            ? '✅ READY' : '⚠️  NEEDS ATTENTION';
        
        console.log(`\nOverall Status: ${overallStatus}`);
        
        return this.results;
    }

    /**
     * 完全な検証を実行
     */
    async runFullValidation() {
        console.log('🔍 Starting debug-results.html validation...\n');
        
        this.checkPageAccess();
        this.checkDependencies();
        this.checkJavaScriptSyntax();
        this.checkHTMLStructure();
        this.generateRecommendations();
        
        return this.generateReport();
    }
}

// 実行
if (require.main === module) {
    const validator = new DebugValidator();
    validator.runFullValidation().then(results => {
        console.log('\n🎯 Validation completed');
        
        // 結果をJSONファイルとして保存
        const reportPath = path.join(__dirname, 'debug-validation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
        console.log(`📄 Report saved to: ${reportPath}`);
    }).catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });
}

module.exports = DebugValidator;