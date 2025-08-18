/**
 * 64卦マトリクス修正版（転置済み）
 * 
 * 専門家指摘により判明した問題を修正:
 * - 従来のマトリクスは実際には [下卦][上卦] の順序だった
 * - 正しくは [上卦][下卦] であるべき
 * - マトリクスを転置して修正
 */

class HexagramMatrixCorrected {
    constructor() {
        // 八卦の順序（標準）
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // 転置済みの正しい64卦マトリクス
        // 行: 上卦（外卦）、列: 下卦（内卦）
        // CORRECTED_MATRIX[上卦インデックス][下卦インデックス] = 卦番号
        this.CORRECTED_MATRIX = [
            // 上卦: 乾（天）の行
            // 下卦: 乾,  兌,  離,  震,  巽,  坎,  艮,  坤
            [     1,  10,  13,  25,  44,   6,  33,  12],  // 正しく転置
            
            // 上卦: 兌（沢）の行  
            [    43,  58,  49,  17,  28,  47,  31,  45],
            
            // 上卦: 離（火）の行
            [    14,  38,  30,  21,  50,  64,  56,  35],
            
            // 上卦: 震（雷）の行
            [    34,  54,  55,  51,  32,  40,  62,  16],
            
            // 上卦: 巽（風）の行
            [     9,  61,  37,  42,  57,  59,  53,  20],
            
            // 上卦: 坎（水）の行
            [     5,  60,  63,   3,  48,  29,  39,   8],
            
            // 上卦: 艮（山）の行
            [    26,  41,  22,  27,  18,   4,  52,  23],
            
            // 上卦: 坤（地）の行
            [    11,  19,  36,  24,  46,   7,  15,   2]
        ];
        
        // 検証用アサート（専門家推奨）
        this.CRITICAL_ASSERTIONS = [
            { upper: "乾", lower: "乾", expected: 1,  name: "乾為天" },
            { upper: "乾", lower: "坎", expected: 6,  name: "天水訟" },
            { upper: "坎", lower: "乾", expected: 5,  name: "水天需" },
            { upper: "乾", lower: "離", expected: 13, name: "天火同人" },
            { upper: "離", lower: "乾", expected: 14, name: "火天大有" }
        ];
        
        // 完全な卦名リスト（検証用）
        this.HEXAGRAM_NAMES = {
            1: "乾為天", 2: "坤為地", 3: "水雷屯", 4: "山水蒙",
            5: "水天需", 6: "天水訟", 7: "地水師", 8: "水地比",
            9: "風天小畜", 10: "天沢履", 11: "地天泰", 12: "天地否",
            13: "天火同人", 14: "火天大有", 15: "地山謙", 16: "雷地予",
            17: "沢雷随", 18: "山風蠱", 19: "地沢臨", 20: "風地観",
            21: "火雷噬嗑", 22: "山火賁", 23: "山地剥", 24: "地雷復",
            25: "天雷无妄", 26: "山天大畜", 27: "山雷頤", 28: "沢風大過",
            29: "坎為水", 30: "離為火", 31: "沢山咸", 32: "雷風恒",
            33: "天山遯", 34: "雷天大壮", 35: "火地晋", 36: "地火明夷",
            37: "風火家人", 38: "火沢睽", 39: "水山蹇", 40: "雷水解",
            41: "山沢損", 42: "風雷益", 43: "沢天夬", 44: "天風姤",
            45: "沢地萃", 46: "地風升", 47: "沢水困", 48: "水風井",
            49: "沢火革", 50: "火風鼎", 51: "震為雷", 52: "艮為山",
            53: "風山漸", 54: "雷沢帰妹", 55: "雷火豊", 56: "火山旅",
            57: "巽為風", 58: "兌為沢", 59: "風水渙", 60: "水沢節",
            61: "風沢中孚", 62: "雷山小過", 63: "水火既済", 64: "火水未済"
        };
    }
    
    /**
     * 正しい卦番号を取得（修正版）
     */
    getHexagramId(upperBagua, lowerBagua) {
        const upperIndex = this.BAGUA_ORDER.indexOf(upperBagua);
        const lowerIndex = this.BAGUA_ORDER.indexOf(lowerBagua);
        
        if (upperIndex === -1 || lowerIndex === -1) {
            throw new Error(`Invalid bagua names: upper=${upperBagua}, lower=${lowerBagua}`);
        }
        
        // 正しい順序: [上卦][下卦]
        return this.CORRECTED_MATRIX[upperIndex][lowerIndex];
    }
    
    /**
     * 専門家推奨のアサーションテスト
     */
    runCriticalAssertions() {
        console.log("=== 専門家推奨アサーションテスト ===\n");
        
        let allPassed = true;
        
        this.CRITICAL_ASSERTIONS.forEach(test => {
            const actual = this.getHexagramId(test.upper, test.lower);
            const passed = actual === test.expected;
            
            if (passed) {
                console.log(`✅ getHexagramId("${test.upper}", "${test.lower}") === ${test.expected} (${test.name})`);
            } else {
                console.log(`❌ getHexagramId("${test.upper}", "${test.lower}") = ${actual}, expected ${test.expected} (${test.name})`);
                allPassed = false;
            }
        });
        
        console.log(`\n結果: ${allPassed ? "✅ 全アサーション成功" : "❌ 失敗あり"}`);
        return allPassed;
    }
    
    /**
     * 全64卦の対称性チェック
     */
    testSymmetry() {
        console.log("\n=== 対称性チェック ===\n");
        
        const symmetryPairs = [
            ["乾", "坎", "坎", "乾"],  // 6と5
            ["乾", "離", "離", "乾"],  // 13と14
            ["乾", "坤", "坤", "乾"],  // 12と11
            ["兌", "巽", "巽", "兌"],  // 28と61
            ["震", "艮", "艮", "震"],  // 62と27
        ];
        
        symmetryPairs.forEach(([u1, l1, u2, l2]) => {
            const id1 = this.getHexagramId(u1, l1);
            const id2 = this.getHexagramId(u2, l2);
            const name1 = this.HEXAGRAM_NAMES[id1];
            const name2 = this.HEXAGRAM_NAMES[id2];
            
            console.log(`${u1}/${l1} = #${id1} ${name1}`);
            console.log(`${u2}/${l2} = #${id2} ${name2}`);
            console.log(`対称性: ${id1 !== id2 ? "✅ 異なる卦" : "❌ 同じ卦"}\n`);
        });
    }
    
    /**
     * 純卦の検証
     */
    testPureHexagrams() {
        console.log("=== 純卦検証 ===\n");
        
        const pureTests = [
            { bagua: "乾", expected: 1 },
            { bagua: "坤", expected: 2 },
            { bagua: "坎", expected: 29 },
            { bagua: "離", expected: 30 },
            { bagua: "震", expected: 51 },
            { bagua: "艮", expected: 52 },
            { bagua: "巽", expected: 57 },
            { bagua: "兌", expected: 58 }
        ];
        
        let allCorrect = true;
        
        pureTests.forEach(test => {
            const actual = this.getHexagramId(test.bagua, test.bagua);
            const passed = actual === test.expected;
            
            if (passed) {
                console.log(`✅ ${test.bagua}/${test.bagua} = #${actual} ${this.HEXAGRAM_NAMES[actual]}`);
            } else {
                console.log(`❌ ${test.bagua}/${test.bagua} = #${actual}, expected #${test.expected}`);
                allCorrect = false;
            }
        });
        
        return allCorrect;
    }
    
    /**
     * 網羅性テスト（1-64すべて存在するか）
     */
    testCompleteness() {
        console.log("\n=== 網羅性テスト ===\n");
        
        const foundIds = new Set();
        const duplicates = [];
        
        for (let upperIdx = 0; upperIdx < 8; upperIdx++) {
            for (let lowerIdx = 0; lowerIdx < 8; lowerIdx++) {
                const id = this.CORRECTED_MATRIX[upperIdx][lowerIdx];
                
                if (foundIds.has(id)) {
                    duplicates.push({
                        id,
                        upper: this.BAGUA_ORDER[upperIdx],
                        lower: this.BAGUA_ORDER[lowerIdx]
                    });
                } else {
                    foundIds.add(id);
                }
            }
        }
        
        const missing = [];
        for (let i = 1; i <= 64; i++) {
            if (!foundIds.has(i)) {
                missing.push(i);
            }
        }
        
        console.log(`カバー卦数: ${foundIds.size}/64`);
        console.log(`欠落: ${missing.length === 0 ? "なし ✅" : missing.join(", ") + " ❌"}`);
        console.log(`重複: ${duplicates.length === 0 ? "なし ✅" : duplicates.map(d => `#${d.id}`).join(", ") + " ❌"}`);
        
        return missing.length === 0 && duplicates.length === 0;
    }
    
    /**
     * 完全テストスイート実行
     */
    runFullTestSuite() {
        console.log("╔════════════════════════════════════╗");
        console.log("║  64卦マトリクス完全テストスイート  ║");
        console.log("╚════════════════════════════════════╝\n");
        
        const results = {
            assertions: this.runCriticalAssertions(),
            pureHexagrams: this.testPureHexagrams(),
            completeness: this.testCompleteness()
        };
        
        this.testSymmetry();
        
        console.log("\n╔════════════════════════════════════╗");
        console.log("║           総合結果                 ║");
        console.log("╚════════════════════════════════════╝");
        console.log(`アサーション: ${results.assertions ? "✅ PASS" : "❌ FAIL"}`);
        console.log(`純卦: ${results.pureHexagrams ? "✅ PASS" : "❌ FAIL"}`);
        console.log(`網羅性: ${results.completeness ? "✅ PASS" : "❌ FAIL"}`);
        
        const allPassed = results.assertions && results.pureHexagrams && results.completeness;
        console.log(`\n最終結果: ${allPassed ? "✅ 全テスト成功！" : "❌ 修正が必要"}`);
        
        return allPassed;
    }
}

// テスト実行
if (typeof window !== 'undefined' || typeof module !== 'undefined') {
    const correctedMatrix = new HexagramMatrixCorrected();
    
    // ブラウザ環境
    if (typeof window !== 'undefined') {
        window.HexagramMatrixCorrected = HexagramMatrixCorrected;
        console.log('ブラウザで correctedMatrix.runFullTestSuite() を実行してください');
    }
    
    // Node.js環境
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { HexagramMatrixCorrected };
        console.log('修正版マトリクスが準備されました');
        console.log('実行: new HexagramMatrixCorrected().runFullTestSuite()');
    }
}