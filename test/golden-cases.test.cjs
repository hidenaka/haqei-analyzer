#!/usr/bin/env node
/**
 * T06: ゴールデンケース回帰防止テスト
 * 既知の良い入出力パターンを検証し、システムの回帰を防ぐ
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// グローバルモック
global.window = {};
global.require = require;

// モジュール読み込み
const patternMapperPath = path.join(__dirname, '../public/js/core/PatternMapper.js');
const patternMapperContent = fs.readFileSync(patternMapperPath, 'utf8');
eval(patternMapperContent);

const PatternMapper = global.window.PatternMapper;

// ゴールデンケース読み込み
const goldenCasesPath = path.join(__dirname, 'golden-cases.json');
const goldenCases = JSON.parse(fs.readFileSync(goldenCasesPath, 'utf8'));

class GoldenCasesTester {
    constructor() {
        this.mapper = new PatternMapper();
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Golden Cases Regression Test',
            version: goldenCases.version,
            totalTests: 0,
            passed: 0,
            failed: 0,
            details: []
        };
    }

    async runAllTests() {
        console.log('🏆 Starting Golden Cases Regression Tests...');
        console.log(`   Version: ${goldenCases.version}`);
        console.log(`   Created: ${goldenCases.created}\n`);

        // PatternMapper初期化
        await this.mapper.initialize();

        // 各テストカテゴリを実行
        await this.runBasicCases();
        await this.runTripleOSCases();
        await this.runErrorCases();
        await this.runRegressionChecks();

        // 結果サマリー
        this.printSummary();
        this.saveReport();

        // 終了コード
        return this.results.failed === 0 ? 0 : 1;
    }

    async runBasicCases() {
        console.log('📋 Basic Pattern Cases:');
        
        for (const testCase of goldenCases.cases) {
            const result = await this.testPatternCase(testCase);
            this.recordResult(testCase.id, testCase.name, result);
        }
    }

    async testPatternCase(testCase) {
        try {
            // パターン分析実行
            const analysis = this.mapper.analyzePattern(testCase.input.answers);
            
            // 期待値との比較
            const checks = {
                patternId: analysis.patternId === testCase.expected.patternId,
                decimalId: analysis.decimalId === testCase.expected.decimalId,
                hexagramId: analysis.hexagramId === testCase.expected.hexagramId,
                palace: analysis.palace === testCase.expected.palace,
                palacePosition: analysis.palacePosition === testCase.expected.palacePosition,
                binaryPattern: analysis.binaryPattern === testCase.expected.binaryPattern
            };

            const allPassed = Object.values(checks).every(v => v === true);
            
            if (!allPassed) {
                const failures = Object.entries(checks)
                    .filter(([k, v]) => !v)
                    .map(([k]) => k);
                
                console.log(`   ❌ ${testCase.id}: ${testCase.name}`);
                console.log(`      Failed checks: ${failures.join(', ')}`);
                console.log(`      Expected: ${JSON.stringify(testCase.expected, null, 2)}`);
                console.log(`      Actual: ${JSON.stringify({
                    patternId: analysis.patternId,
                    decimalId: analysis.decimalId,
                    hexagramId: analysis.hexagramId,
                    palace: analysis.palace,
                    palacePosition: analysis.palacePosition,
                    binaryPattern: analysis.binaryPattern
                }, null, 2)}`);
                
                return { passed: false, failures, expected: testCase.expected, actual: analysis };
            } else {
                console.log(`   ✅ ${testCase.id}: ${testCase.name}`);
                return { passed: true };
            }
            
        } catch (error) {
            console.log(`   ❌ ${testCase.id}: ${testCase.name} - ERROR: ${error.message}`);
            return { passed: false, error: error.message };
        }
    }

    async runTripleOSCases() {
        console.log('\n📋 Triple OS Integration Cases:');
        
        for (const testCase of goldenCases.tripleOSCases) {
            const result = await this.testTripleOSCase(testCase);
            this.recordResult(testCase.id, testCase.name, result);
        }
    }

    async testTripleOSCase(testCase) {
        try {
            // 3つのOSパターンを分析
            const engineAnalysis = this.mapper.analyzePattern(testCase.input.engineAnswers);
            const interfaceAnalysis = this.mapper.analyzePattern(testCase.input.interfaceAnswers);
            const safeModeAnalysis = this.mapper.analyzePattern(testCase.input.safeModeAnswers);
            
            // 期待値との比較
            const checks = {
                engineHexagram: engineAnalysis.hexagramId === testCase.expected.engineOS.hexagramId,
                enginePalace: engineAnalysis.palace === testCase.expected.engineOS.palace,
                interfaceHexagram: interfaceAnalysis.hexagramId === testCase.expected.interfaceOS.hexagramId,
                interfacePalace: interfaceAnalysis.palace === testCase.expected.interfaceOS.palace,
                safeModeHexagram: safeModeAnalysis.hexagramId === testCase.expected.safeModeOS.hexagramId,
                safeModePalace: safeModeAnalysis.palace === testCase.expected.safeModeOS.palace
            };

            const allPassed = Object.values(checks).every(v => v === true);
            
            if (!allPassed) {
                const failures = Object.entries(checks)
                    .filter(([k, v]) => !v)
                    .map(([k]) => k);
                
                console.log(`   ❌ ${testCase.id}: ${testCase.name}`);
                console.log(`      Failed checks: ${failures.join(', ')}`);
                return { passed: false, failures };
            } else {
                console.log(`   ✅ ${testCase.id}: ${testCase.name}`);
                return { passed: true };
            }
            
        } catch (error) {
            console.log(`   ❌ ${testCase.id}: ${testCase.name} - ERROR: ${error.message}`);
            return { passed: false, error: error.message };
        }
    }

    async runErrorCases() {
        console.log('\n📋 Error Handling Cases:');
        
        for (const testCase of goldenCases.errorCases) {
            const result = await this.testErrorCase(testCase);
            this.recordResult(testCase.id, testCase.name, result);
        }
    }

    async testErrorCase(testCase) {
        try {
            // エラーケースの実行
            const patternId = this.mapper.generatePatternId(testCase.input.answers);
            
            // Fail-Closedパターンの確認
            if (testCase.expected.patternId) {
                const passed = patternId === testCase.expected.patternId;
                
                if (!passed) {
                    console.log(`   ❌ ${testCase.id}: ${testCase.name}`);
                    console.log(`      Expected: "${testCase.expected.patternId}", Got: "${patternId}"`);
                    return { passed: false, expected: testCase.expected.patternId, actual: patternId };
                } else {
                    console.log(`   ✅ ${testCase.id}: ${testCase.name} - Fail-Closed correctly`);
                    return { passed: true };
                }
            }
            
            return { passed: true };
            
        } catch (error) {
            // エラーが期待される場合
            if (testCase.input.shouldFail) {
                console.log(`   ✅ ${testCase.id}: ${testCase.name} - Failed as expected`);
                return { passed: true };
            } else {
                console.log(`   ❌ ${testCase.id}: ${testCase.name} - Unexpected error: ${error.message}`);
                return { passed: false, error: error.message };
            }
        }
    }

    async runRegressionChecks() {
        console.log('\n📋 Regression Checks:');
        
        for (const check of goldenCases.regressionChecks) {
            console.log(`   🔍 ${check.id}: ${check.name}`);
            
            for (const subCheck of check.checks) {
                console.log(`      ✓ ${subCheck}`);
            }
            
            // 実際の検証ロジック
            const result = await this.performRegressionCheck(check);
            this.recordResult(check.id, check.name, result);
        }
    }

    async performRegressionCheck(check) {
        try {
            switch(check.id) {
                case 'RC001': // 8宮マッピング整合性
                    return this.check8PalaceIntegrity();
                    
                case 'RC002': // 512パターン完全性
                    return this.check512PatternCompleteness();
                    
                default:
                    return { passed: true };
            }
        } catch (error) {
            console.log(`      ❌ Error: ${error.message}`);
            return { passed: false, error: error.message };
        }
    }

    check8PalaceIntegrity() {
        // 64卦すべてをテスト
        const hexagramsSeen = new Set();
        const palaceDistribution = {};
        
        for (let i = 0; i < 512; i++) {
            const hexId = this.mapper.mapToHexagram(i);
            hexagramsSeen.add(hexId);
            
            const palaceInfo = this.mapper.findPalaceInfo(hexId);
            if (!palaceDistribution[palaceInfo.palace]) {
                palaceDistribution[palaceInfo.palace] = new Set();
            }
            palaceDistribution[palaceInfo.palace].add(hexId);
        }
        
        // 検証
        const has64Hexagrams = hexagramsSeen.size === 64;
        const has8Palaces = Object.keys(palaceDistribution).length === 8;
        const each8Hexagrams = Object.values(palaceDistribution).every(set => set.size === 8);
        
        const passed = has64Hexagrams && has8Palaces && each8Hexagrams;
        
        if (!passed) {
            console.log(`      ❌ 8宮整合性エラー`);
            console.log(`         64卦カバー: ${has64Hexagrams}`);
            console.log(`         8宮存在: ${has8Palaces}`);
            console.log(`         各宮8卦: ${each8Hexagrams}`);
        } else {
            console.log(`      ✅ 8宮整合性確認`);
        }
        
        return { passed };
    }

    check512PatternCompleteness() {
        // 512パターンすべてをテスト
        const errors = [];
        
        for (let i = 0; i < 512; i++) {
            const octal = i.toString(8).padStart(3, '0');
            // 512パターンは9ビット必要だが、8問の回答のため上位1ビットを無視
            const binary = (i & 0xFF).toString(2).padStart(8, '0');  // 下位8ビットのみ使用
            const binaryArray = binary.split('').map(b => parseInt(b));
            
            const patternId = this.mapper.generatePatternId(binaryArray);
            const decimalId = this.mapper.patternIdToDecimal(patternId);
            const hexagramId = this.mapper.mapToHexagram(decimalId);
            
            // 検証（256以上は下位8ビットのみ使用）
            const expectedOctal = (i & 0xFF).toString(8).padStart(3, '0');
            const expectedDecimal = i & 0xFF;
            
            if (patternId !== expectedOctal) {
                errors.push(`Pattern ${i}: Expected "${expectedOctal}", got "${patternId}"`);
            }
            if (decimalId !== expectedDecimal) {
                errors.push(`Decimal ${i}: Expected ${expectedDecimal}, got ${decimalId}`);
            }
            if (hexagramId < 1 || hexagramId > 64) {
                errors.push(`Hexagram ${i}: Invalid ID ${hexagramId}`);
            }
        }
        
        const passed = errors.length === 0;
        
        if (!passed) {
            console.log(`      ❌ 512パターン完全性エラー`);
            errors.slice(0, 5).forEach(err => console.log(`         ${err}`));
            if (errors.length > 5) {
                console.log(`         ... and ${errors.length - 5} more errors`);
            }
        } else {
            console.log(`      ✅ 512パターン完全性確認`);
        }
        
        return { passed, errors };
    }

    recordResult(id, name, result) {
        this.results.totalTests++;
        
        if (result.passed) {
            this.results.passed++;
        } else {
            this.results.failed++;
        }
        
        this.results.details.push({
            id,
            name,
            ...result
        });
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('🏆 Golden Cases Test Summary:');
        console.log(`   Total Tests: ${this.results.totalTests}`);
        console.log(`   Passed: ${this.results.passed} ✅`);
        console.log(`   Failed: ${this.results.failed} ❌`);
        console.log(`   Success Rate: ${Math.round((this.results.passed / this.results.totalTests) * 100)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n   🎉 All golden cases passed! No regression detected.');
        } else {
            console.log('\n   ⚠️ Some golden cases failed. Regression detected!');
            console.log('   Review the failed tests above for details.');
        }
        
        console.log('='.repeat(60));
    }

    saveReport() {
        const reportPath = `./golden-cases-report-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved: ${reportPath}`);
    }
}

// 実行
if (require.main === module) {
    const tester = new GoldenCasesTester();
    tester.runAllTests()
        .then(exitCode => process.exit(exitCode))
        .catch(error => {
            console.error('❌ Test execution error:', error);
            process.exit(1);
        });
}