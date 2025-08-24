/**
 * King Wen Mapping Quick Test
 * 骨組み6卦での変爻計算・検証テスト
 */

import { ConfigLoader } from '../config/config-loader-adapter.js';
import fixtures from '../config/authoritative-fixtures.json' assert { type: 'json' };

class KingWenQuickTest {
    constructor() {
        this.loader = new ConfigLoader();
        this.mapping = null;
        this.reverseMap = new Map();
    }
    
    async init() {
        // King Wenデータ読み込み
        this.mapping = await this.loader.load('kingwen-mapping');
        console.log('✅ King Wen mapping loaded:', Object.keys(this.mapping.hexagrams).length, 'hexagrams');
        
        // 逆引きマップ構築
        this.buildReverseMap();
    }
    
    buildReverseMap() {
        for (const [id, hex] of Object.entries(this.mapping.hexagrams)) {
            const key = hex.lines.join('');
            this.reverseMap.set(key, parseInt(id));
        }
        console.log('✅ Reverse map built:', this.reverseMap.size, 'entries');
    }
    
    /**
     * 変爻計算（正確な実装）
     */
    calculateTransform(hexNum, lineNum) {
        const hex = this.mapping.hexagrams[hexNum];
        if (!hex) {
            console.error(`❌ Hexagram ${hexNum} not found`);
            return null;
        }
        
        // 爻配列をコピー
        const newLines = [...hex.lines];
        
        // 指定爻を反転（1-based to 0-based）
        const lineIndex = lineNum - 1;
        newLines[lineIndex] = newLines[lineIndex] === 1 ? 0 : 1;
        
        // 逆引きで新しい卦番号を取得
        const key = newLines.join('');
        const newHexNum = this.reverseMap.get(key);
        
        if (!newHexNum) {
            console.warn(`⚠️ No hexagram found for pattern ${key}`);
            return null;
        }
        
        console.log(`Transform: ${hexNum}(${hex.name}) line ${lineNum} → ${newHexNum}(${this.mapping.hexagrams[newHexNum]?.name})`);
        return newHexNum;
    }
    
    /**
     * 既知変化テスト実行
     */
    async runFixtureTests() {
        console.log('\n=== Running Fixture Tests ===');
        let passed = 0;
        let failed = 0;
        
        for (const fixture of fixtures.fixtures) {
            // 骨組みに含まれる卦のみテスト
            if (!this.mapping.hexagrams[fixture.from]) {
                console.log(`⏭️ Skipping ${fixture.id} (hexagram ${fixture.from} not in seed set)`);
                continue;
            }
            
            const result = this.calculateTransform(fixture.from, fixture.line);
            
            if (result === fixture.to) {
                console.log(`✅ ${fixture.id}: ${fixture.description} - PASSED`);
                console.log(`   Source: ${fixture.source.title} ${fixture.source.edition}`);
                passed++;
            } else {
                console.error(`❌ ${fixture.id}: Expected ${fixture.to}, got ${result}`);
                failed++;
            }
        }
        
        console.log(`\n=== Test Results ===`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Skipped: ${fixtures.fixtures.length - passed - failed}`);
        
        return failed === 0;
    }
    
    /**
     * 基本検証テスト
     */
    async runBasicTests() {
        console.log('\n=== Running Basic Tests ===');
        
        // 1. 八卦整合性チェック
        console.log('Testing trigram consistency...');
        const trigramMap = {
            '111': '乾', '000': '坤', '001': '震', '010': '坎',
            '011': '艮', '100': '巽', '101': '離', '110': '兌'
        };
        
        for (const [id, hex] of Object.entries(this.mapping.hexagrams)) {
            const lower = hex.lines.slice(0, 3).join('');
            const upper = hex.lines.slice(3, 6).join('');
            const expectedLower = trigramMap[lower];
            const expectedUpper = trigramMap[upper];
            
            if (hex.trigrams[0] !== expectedLower || hex.trigrams[1] !== expectedUpper) {
                console.error(`❌ Trigram mismatch in hexagram ${id}`);
                return false;
            }
        }
        console.log('✅ All trigrams consistent');
        
        // 2. 泰↔否の相互変換テスト
        if (this.mapping.hexagrams[11] && this.mapping.hexagrams[12]) {
            console.log('\nTesting 泰↔否 transformations...');
            
            // 泰の全爻を反転すると否になるか
            const taiLines = this.mapping.hexagrams[11].lines;
            const piLines = this.mapping.hexagrams[12].lines;
            const taiInverted = taiLines.map(l => l === 1 ? 0 : 1);
            
            if (taiInverted.join('') === piLines.join('')) {
                console.log('✅ 泰(11) fully inverted = 否(12)');
            } else {
                console.error('❌ 泰↔否 full inversion failed');
            }
        }
        
        return true;
    }
}

// テスト実行
async function main() {
    const tester = new KingWenQuickTest();
    
    try {
        await tester.init();
        
        const basicOk = await tester.runBasicTests();
        const fixtureOk = await tester.runFixtureTests();
        
        if (basicOk && fixtureOk) {
            console.log('\n🎉 All tests passed! Ready for full implementation.');
        } else {
            console.error('\n⚠️ Some tests failed. Please check the output above.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

// Node.js環境で実行
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    main();
}

export { KingWenQuickTest };