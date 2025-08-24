#!/usr/bin/env node
/**
 * T05: PatternMapperテスト
 * 512パターン生成とマッピングの検証
 */

const fs = require('fs');
const path = require('path');

// グローバルオブジェクトのモック
global.window = {
    fetch: async (url) => {
        // eight_palaces.v1.jsonのモック読み込み
        if (url === '/assets/eight_palaces.v1.json') {
            const filePath = path.join(__dirname, '../public/assets/eight_palaces.v1.json');
            const content = fs.readFileSync(filePath, 'utf8');
            return {
                ok: true,
                json: async () => JSON.parse(content)
            };
        }
        throw new Error(`Unexpected fetch URL: ${url}`);
    }
};

// PatternMapperの読み込み
const patternMapperPath = path.join(__dirname, '../public/js/core/PatternMapper.js');
const patternMapperContent = fs.readFileSync(patternMapperPath, 'utf8');
eval(patternMapperContent);

const PatternMapper = global.window.PatternMapper;

class PatternMapperTest {
    constructor() {
        this.mapper = new PatternMapper();
        this.testResults = [];
        this.passCount = 0;
        this.failCount = 0;
    }

    async runAllTests() {
        console.log('🧪 Starting PatternMapper Tests...\n');
        
        // 初期化を待つ
        await this.mapper.initialize();
        
        // テスト実行
        await this.testPatternIdGeneration();
        await this.testPatternToDecimalConversion();
        await this.testHexagramMapping();
        await this.testPalaceInfo();
        await this.testCompleteAnalysis();
        await this.testEdgeCases();
        await this.testPatternDistribution();
        
        // 結果サマリー
        this.printSummary();
    }

    async testPatternIdGeneration() {
        console.log('📋 Test: Pattern ID Generation');
        
        const testCases = [
            { answers: [0,0,0,0,0,0,0,0], expected: "000" },
            { answers: [1,1,1,1,1,1,1,1], expected: "377" },
            { answers: [1,0,0,0,0,0,0,0], expected: "200" },
            { answers: [0,0,0,0,0,0,0,1], expected: "001" },
            { answers: [1,0,1,0,1,0,1,0], expected: "252" },
            { answers: [true,false,true,false,true,false,true,false], expected: "252" },
            { answers: [false,true,false,true,false,true,false,true], expected: "125" }
        ];
        
        for (const testCase of testCases) {
            const result = this.mapper.generatePatternId(testCase.answers);
            const passed = result === testCase.expected;
            
            console.log(`   ${passed ? '✅' : '❌'} Input: [${testCase.answers}] → "${result}" (expected: "${testCase.expected}")`);
            
            if (passed) {
                this.passCount++;
            } else {
                this.failCount++;
            }
        }
    }

    async testPatternToDecimalConversion() {
        console.log('\n📋 Test: Pattern to Decimal Conversion');
        
        const testCases = [
            { pattern: "000", expected: 0 },
            { pattern: "001", expected: 1 },
            { pattern: "007", expected: 7 },
            { pattern: "010", expected: 8 },
            { pattern: "100", expected: 64 },
            { pattern: "377", expected: 255 },
            { pattern: "400", expected: 256 },
            { pattern: "777", expected: 511 }
        ];
        
        for (const testCase of testCases) {
            const result = this.mapper.patternIdToDecimal(testCase.pattern);
            const passed = result === testCase.expected;
            
            console.log(`   ${passed ? '✅' : '❌'} Pattern: "${testCase.pattern}" → ${result} (expected: ${testCase.expected})`);
            
            if (passed) {
                this.passCount++;
            } else {
                this.failCount++;
            }
        }
    }

    async testHexagramMapping() {
        console.log('\n📋 Test: Decimal to Hexagram Mapping');
        
        const testCases = [
            { decimal: 0, expected: 1 },    // パターン0-7 → 卦1
            { decimal: 7, expected: 1 },    
            { decimal: 8, expected: 2 },    // パターン8-15 → 卦2
            { decimal: 15, expected: 2 },   
            { decimal: 63, expected: 8 },   // パターン56-63 → 卦8
            { decimal: 64, expected: 9 },   // パターン64-71 → 卦9
            { decimal: 504, expected: 64 },  // パターン504-511 → 卦64
            { decimal: 511, expected: 64 }
        ];
        
        for (const testCase of testCases) {
            const result = this.mapper.mapToHexagram(testCase.decimal);
            const passed = result === testCase.expected;
            
            console.log(`   ${passed ? '✅' : '❌'} Decimal: ${testCase.decimal} → Hexagram ${result} (expected: ${testCase.expected})`);
            
            if (passed) {
                this.passCount++;
            } else {
                this.failCount++;
            }
        }
    }

    async testPalaceInfo() {
        console.log('\n📋 Test: Palace Information Lookup');
        
        const testCases = [
            { hexagram: 1, expectedPalace: "乾宮", expectedPosition: 0 },
            { hexagram: 44, expectedPalace: "乾宮", expectedPosition: 1 },
            { hexagram: 58, expectedPalace: "兌宮", expectedPosition: 0 },
            { hexagram: 30, expectedPalace: "離宮", expectedPosition: 0 },
            { hexagram: 51, expectedPalace: "震宮", expectedPosition: 0 },
            { hexagram: 57, expectedPalace: "巽宮", expectedPosition: 0 },
            { hexagram: 29, expectedPalace: "坎宮", expectedPosition: 0 },
            { hexagram: 52, expectedPalace: "艮宮", expectedPosition: 0 },
            { hexagram: 2, expectedPalace: "坤宮", expectedPosition: 0 }
        ];
        
        for (const testCase of testCases) {
            const result = this.mapper.findPalaceInfo(testCase.hexagram);
            const passed = result.palace === testCase.expectedPalace && 
                          result.position === testCase.expectedPosition;
            
            console.log(`   ${passed ? '✅' : '❌'} Hexagram ${testCase.hexagram} → ${result.palace}[${result.position}] (expected: ${testCase.expectedPalace}[${testCase.expectedPosition}])`);
            
            if (passed) {
                this.passCount++;
            } else {
                this.failCount++;
            }
        }
    }

    async testCompleteAnalysis() {
        console.log('\n📋 Test: Complete Pattern Analysis');
        
        const answers = [1, 0, 1, 0, 1, 0, 1, 0]; // パターン "252" (10進: 170)
        const result = this.mapper.analyzePattern(answers);
        
        console.log('   Input answers:', answers);
        console.log('   Analysis result:');
        console.log(`     Pattern ID: ${result.patternId}`);
        console.log(`     Decimal ID: ${result.decimalId}`);
        console.log(`     Binary: ${result.binaryPattern}`);
        console.log(`     Hexagram: ${result.hexagramId}`);
        console.log(`     Palace: ${result.palace}`);
        console.log(`     Position: ${result.palacePosition}`);
        console.log(`     Pattern Group: ${result.patternGroup}`);
        console.log(`     Sub-pattern: ${result.subPattern}`);
        
        const passed = result.patternId === "252" && 
                      result.decimalId === 170 &&
                      result.hexagramId === 22 && // 170/8 + 1 = 21.25 → 22
                      result.binaryPattern === "10101010";
        
        console.log(`   ${passed ? '✅' : '❌'} Complete analysis validation`);
        
        if (passed) {
            this.passCount++;
        } else {
            this.failCount++;
        }
    }

    async testEdgeCases() {
        console.log('\n📋 Test: Edge Cases & Error Handling');
        
        // 無効な入力のテスト
        const invalidCases = [
            { input: null, description: "null input" },
            { input: [], description: "empty array" },
            { input: [1,1,1], description: "too few answers" },
            { input: [1,1,1,1,1,1,1,1,1], description: "too many answers" },
            { input: [2,0,0,0,0,0,0,0], description: "invalid value (2)" },
            { input: ["yes","no","yes","no","yes","no","yes","no"], description: "string values" }
        ];
        
        for (const testCase of invalidCases) {
            const result = this.mapper.generatePatternId(testCase.input);
            const passed = result === "000"; // Fail-Closed: デフォルトパターン
            
            console.log(`   ${passed ? '✅' : '❌'} ${testCase.description} → "${result}" (expected fail-closed: "000")`);
            
            if (passed) {
                this.passCount++;
            } else {
                this.failCount++;
            }
        }
    }

    async testPatternDistribution() {
        console.log('\n📋 Test: Pattern Distribution Statistics');
        
        // 各グループの統計情報テスト
        for (let group = 0; group < 8; group++) {
            const stats = this.mapper.getPatternGroupStats(group);
            console.log(`   Group ${group}:`, stats);
            
            const passed = stats !== null && 
                          stats.group === group &&
                          stats.totalPatterns === 64;
            
            if (passed) {
                this.passCount++;
            } else {
                this.failCount++;
            }
        }
    }

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary:');
        console.log(`   Total Tests: ${this.passCount + this.failCount}`);
        console.log(`   Passed: ${this.passCount} ✅`);
        console.log(`   Failed: ${this.failCount} ❌`);
        console.log(`   Success Rate: ${Math.round((this.passCount / (this.passCount + this.failCount)) * 100)}%`);
        console.log('='.repeat(50));
        
        // デバッグ情報
        console.log('\n📍 Debug Information:');
        this.mapper.debugInfo();
        
        // レポート保存
        const report = {
            timestamp: new Date().toISOString(),
            testSuite: 'PatternMapper Tests',
            totalTests: this.passCount + this.failCount,
            passed: this.passCount,
            failed: this.failCount,
            successRate: Math.round((this.passCount / (this.passCount + this.failCount)) * 100)
        };
        
        const reportPath = `./pattern-mapper-test-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Test report saved: ${reportPath}`);
        
        // 終了コード
        process.exit(this.failCount > 0 ? 1 : 0);
    }
}

// テスト実行
if (require.main === module) {
    const tester = new PatternMapperTest();
    tester.runAllTests().catch(error => {
        console.error('❌ Test execution error:', error);
        process.exit(1);
    });
}