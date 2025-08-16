#!/usr/bin/env node
/**
 * T13: 不変条件・完全性チェック
 * 64卦被覆・ユニーク・8宮×8件検証
 */

const fs = require('fs');
const path = require('path');

// データファイル読み込み
const dataPath = path.join(__dirname, '../public/assets/H384H64database.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// データ抽出（簡易的なJavaScript実行環境を模擬）
function extractData() {
    let H384_DATA, H64_DATA;
    
    // Node.js環境でwindowオブジェクトとdocumentを模擬
    global.window = global.window || {};
    global.document = global.document || {
        addEventListener: () => {},
        DOMContentLoaded: true
    };
    
    // eval使用（テスト環境での安全な実行）
    eval(dataContent);
    
    // windowオブジェクトから取得を試行
    if (global.window.H384_DATA) {
        H384_DATA = global.window.H384_DATA;
    }
    if (global.window.H64_DATA) {
        H64_DATA = global.window.H64_DATA;
    }
    
    return { H384_DATA, H64_DATA };
}

class EightPalacesInvariantTest {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            testSuite: 'Eight Palaces Invariant Test',
            tests: []
        };
        
        try {
            const { H384_DATA, H64_DATA } = extractData();
            this.h384Data = H384_DATA;
            this.h64Data = H64_DATA;
        } catch (error) {
            console.error('❌ データ読み込みエラー:', error.message);
            process.exit(1);
        }
    }

    runTest(testName, testFn) {
        console.log(`🔍 Testing: ${testName}`);
        try {
            const result = testFn();
            this.results.tests.push({
                name: testName,
                status: 'passed',
                details: result.details,
                metrics: result.metrics || {}
            });
            console.log(`   ✅ PASSED: ${result.details}`);
            return true;
        } catch (error) {
            this.results.tests.push({
                name: testName,
                status: 'failed',
                details: error.message,
                error: error.stack
            });
            console.log(`   ❌ FAILED: ${error.message}`);
            return false;
        }
    }

    // 1. H64データ完全性チェック
    testH64Completeness() {
        if (!this.h64Data || !Array.isArray(this.h64Data)) {
            throw new Error('H64_DATA is not available or not an array');
        }

        const length = this.h64Data.length;
        if (length !== 64) {
            throw new Error(`H64_DATA length is ${length}, expected 64`);
        }

        // 卦番号 1-64 の完全被覆確認
        const hexagramNumbers = this.h64Data.map(item => item.卦番号).sort((a, b) => a - b);
        const expectedNumbers = Array.from({length: 64}, (_, i) => i + 1);
        
        for (let i = 0; i < 64; i++) {
            if (hexagramNumbers[i] !== expectedNumbers[i]) {
                throw new Error(`Missing hexagram number ${expectedNumbers[i]}, found ${hexagramNumbers[i]}`);
            }
        }

        // 重複チェック
        const uniqueNumbers = new Set(hexagramNumbers);
        if (uniqueNumbers.size !== 64) {
            throw new Error(`Duplicate hexagram numbers found. Unique count: ${uniqueNumbers.size}`);
        }

        return {
            details: `H64 completeness verified: 64 hexagrams with unique numbers 1-64`,
            metrics: { totalHexagrams: length, uniqueCount: uniqueNumbers.size }
        };
    }

    // 2. H384データ完全性チェック
    testH384Completeness() {
        if (!this.h384Data || !Array.isArray(this.h384Data)) {
            throw new Error('H384_DATA is not available or not an array');
        }

        const length = this.h384Data.length;
        // 384爻 + 2用爻(用九、用六) = 386
        if (length !== 386) {
            throw new Error(`H384_DATA length is ${length}, expected 386 (384 lines + 2 yong)`);
        }

        // 通し番号の連続性確認
        const serialNumbers = this.h384Data.map(item => item.通し番号).sort((a, b) => a - b);
        for (let i = 0; i < length; i++) {
            if (serialNumbers[i] !== i + 1) {
                throw new Error(`Missing serial number ${i + 1}, found ${serialNumbers[i]}`);
            }
        }

        // 64卦すべてが含まれているか確認
        const hexagramsInH384 = new Set(this.h384Data.map(item => item.卦番号));
        if (hexagramsInH384.size !== 64) {
            throw new Error(`H384_DATA covers ${hexagramsInH384.size} hexagrams, expected 64`);
        }

        return {
            details: `H384 completeness verified: 386 entries covering all 64 hexagrams`,
            metrics: { totalEntries: length, uniqueHexagrams: hexagramsInH384.size }
        };
    }

    // 3. 8宮×8件構造確認（実際のデータファイルから読み込み）
    testEightPalacesStructure() {
        // 実際の8宮データファイルを読み込み
        const eightPalacesPath = path.join(__dirname, '../public/assets/eight_palaces.v1.json');
        const eightPalacesContent = fs.readFileSync(eightPalacesPath, 'utf8');
        const eightPalacesData = JSON.parse(eightPalacesContent);
        
        const eightPalaces = {};
        for (const [palaceName, palace] of Object.entries(eightPalacesData.palaces)) {
            eightPalaces[palaceName] = palace.hexagrams;
        }

        // 各宮が正確に8件ずつあることを確認
        let totalPalaceHexagrams = 0;
        for (const [palaceName, hexagrams] of Object.entries(eightPalaces)) {
            if (hexagrams.length !== 8) {
                throw new Error(`${palaceName} has ${hexagrams.length} hexagrams, expected 8`);
            }
            totalPalaceHexagrams += hexagrams.length;
        }

        if (totalPalaceHexagrams !== 64) {
            throw new Error(`Total palace hexagrams: ${totalPalaceHexagrams}, expected 64`);
        }

        // 全64卦が8宮に分類されているか確認
        const allPalaceHexagrams = Object.values(eightPalaces).flat();
        const uniquePalaceHexagrams = new Set(allPalaceHexagrams);
        
        if (uniquePalaceHexagrams.size !== 64) {
            throw new Error(`Unique hexagrams in palaces: ${uniquePalaceHexagrams.size}, expected 64`);
        }

        return {
            details: `Eight Palaces structure verified: 8 palaces × 8 hexagrams = 64 total`,
            metrics: { 
                palaces: Object.keys(eightPalaces).length,
                totalHexagrams: totalPalaceHexagrams,
                uniqueHexagrams: uniquePalaceHexagrams.size
            }
        };
    }

    // 4. データ品質チェック
    testDataQuality() {
        const requiredH384Fields = ['通し番号', '卦番号', '卦名', '爻', 'キーワード', '現代解釈の要約'];
        const requiredH64Fields = ['卦番号', '名前'];

        // H384データ品質チェック
        for (let i = 0; i < Math.min(10, this.h384Data.length); i++) {
            const item = this.h384Data[i];
            for (const field of requiredH384Fields) {
                if (!(field in item)) {
                    throw new Error(`H384 item ${i+1} missing required field: ${field}`);
                }
            }
        }

        // H64データ品質チェック
        for (let i = 0; i < this.h64Data.length; i++) {
            const item = this.h64Data[i];
            for (const field of requiredH64Fields) {
                if (!(field in item)) {
                    throw new Error(`H64 item ${i+1} missing required field: ${field}`);
                }
            }
        }

        return {
            details: `Data quality verified: All required fields present`,
            metrics: { 
                h384SampleChecked: Math.min(10, this.h384Data.length),
                h64FullyChecked: this.h64Data.length
            }
        };
    }

    runAllTests() {
        console.log('🧠 Starting Eight Palaces Invariant Tests...\n');

        const tests = [
            ['H64 Completeness', () => this.testH64Completeness()],
            ['H384 Completeness', () => this.testH384Completeness()],
            ['Eight Palaces Structure', () => this.testEightPalacesStructure()],
            ['Data Quality', () => this.testDataQuality()]
        ];

        let passed = 0;
        let failed = 0;

        for (const [name, testFn] of tests) {
            if (this.runTest(name, testFn)) {
                passed++;
            } else {
                failed++;
            }
        }

        console.log(`\n📊 Eight Palaces Invariant Test Complete!`);
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

        // レポート保存
        const reportPath = `./eight-palaces-invariant-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📋 Detailed report saved: ${reportPath}`);

        const success = failed === 0;
        console.log(`\n🎯 Result: ${success ? '✅ ALL INVARIANTS SATISFIED' : '❌ INVARIANT VIOLATIONS FOUND'}`);
        
        return success;
    }
}

// CLI実行
if (require.main === module) {
    const tester = new EightPalacesInvariantTest();
    const success = tester.runAllTests();
    process.exit(success ? 0 : 1);
}

module.exports = { EightPalacesInvariantTest };