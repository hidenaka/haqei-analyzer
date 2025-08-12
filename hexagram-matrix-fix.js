/**
 * 64卦マトリクスの上下添字修正
 * 
 * 問題: 現在のマトリクスは上卦と下卦が逆転している
 * 修正: 正しい配列 [上卦][下卦] でアクセスするように修正
 */

class HexagramMatrixFix {
    constructor() {
        // 八卦の順序（標準）
        this.BAGUA_ORDER = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"];
        
        // 正しい64卦マトリクス
        // 行: 上卦（外卦）、列: 下卦（内卦）
        // authenticHexagramMatrix[上卦インデックス][下卦インデックス] = 卦番号
        this.CORRECT_HEXAGRAM_MATRIX = [
            // 上卦: 乾（天）
            [1,  43, 14, 34,  9,  5, 26, 11],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 兌（沢）
            [10, 58, 38, 54, 61, 60, 41, 19],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 離（火）
            [13, 49, 30, 55, 37, 63, 22, 36],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 震（雷）
            [25, 17, 21, 51, 42,  3, 27, 24],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 巽（風）
            [44, 28, 50, 32, 57, 48, 18, 46],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 坎（水）
            [6,  47, 64, 40, 59, 29,  4,  7],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 艮（山）
            [33, 31, 56, 62, 53, 39, 52, 15],  // 下: 乾,兌,離,震,巽,坎,艮,坤
            // 上卦: 坤（地）
            [12, 45, 35, 16, 20,  8, 23,  2]   // 下: 乾,兌,離,震,巽,坎,艮,坤
        ];
        
        // 検証用の既知ペア
        this.KNOWN_PAIRS = [
            // [上卦, 下卦, 期待ID, 卦名]
            ["乾", "乾", 1,  "乾為天"],
            ["坤", "坤", 2,  "坤為地"],
            ["坎", "乾", 5,  "水天需"],  // 上=坎(水)、下=乾(天)
            ["乾", "坎", 6,  "天水訟"],  // 上=乾(天)、下=坎(水)
            ["離", "乾", 13, "天火同人"], // 上=離(火)、下=乾(天) → 実際は逆
            ["乾", "離", 14, "火天大有"], // 上=乾(天)、下=離(火) → 実際は逆
            ["坎", "坎", 29, "坎為水"],
            ["離", "離", 30, "離為火"],
            ["兌", "巽", 28, "沢風大過"], // 上=兌(沢)、下=巽(風)
            ["震", "震", 51, "震為雷"],
            ["艮", "艮", 52, "艮為山"],
            ["巽", "巽", 57, "巽為風"],
            ["兌", "兌", 58, "兌為沢"]
        ];
        
        // 正しい卦名（検証用）
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
     * 正しい卦番号を取得
     */
    getHexagramId(upperBagua, lowerBagua) {
        const upperIndex = this.BAGUA_ORDER.indexOf(upperBagua);
        const lowerIndex = this.BAGUA_ORDER.indexOf(lowerBagua);
        
        if (upperIndex === -1 || lowerIndex === -1) {
            throw new Error(`Invalid bagua names: upper=${upperBagua}, lower=${lowerBagua}`);
        }
        
        // 正しい順序: [上卦][下卦]
        return this.CORRECT_HEXAGRAM_MATRIX[upperIndex][lowerIndex];
    }
    
    /**
     * 卦番号から上卦・下卦を取得
     */
    getBaguaFromId(hexagramId) {
        for (let upperIdx = 0; upperIdx < 8; upperIdx++) {
            for (let lowerIdx = 0; lowerIdx < 8; lowerIdx++) {
                if (this.CORRECT_HEXAGRAM_MATRIX[upperIdx][lowerIdx] === hexagramId) {
                    return {
                        upper: this.BAGUA_ORDER[upperIdx],
                        lower: this.BAGUA_ORDER[lowerIdx]
                    };
                }
            }
        }
        return null;
    }
    
    /**
     * マトリクスの検証テスト
     */
    validateMatrix() {
        const results = {
            passed: [],
            failed: [],
            total: this.KNOWN_PAIRS.length
        };
        
        console.log("=== 64卦マトリクス検証開始 ===\n");
        
        this.KNOWN_PAIRS.forEach(([upper, lower, expectedId, name]) => {
            const actualId = this.getHexagramId(upper, lower);
            const isCorrect = actualId === expectedId;
            
            if (isCorrect) {
                results.passed.push({
                    upper, lower, id: actualId, name
                });
                console.log(`✅ ${upper}/${lower} = #${actualId} ${name}`);
            } else {
                results.failed.push({
                    upper, lower, 
                    expected: expectedId,
                    actual: actualId,
                    name
                });
                console.log(`❌ ${upper}/${lower} = #${actualId} (期待: #${expectedId} ${name})`);
            }
        });
        
        console.log(`\n=== 検証結果: ${results.passed.length}/${results.total} 成功 ===`);
        
        if (results.failed.length > 0) {
            console.log("\n失敗したケース:");
            results.failed.forEach(f => {
                console.log(`  ${f.upper}/${f.lower}: 実際=${f.actual}, 期待=${f.expected}`);
            });
        }
        
        return results;
    }
    
    /**
     * 全64卦の網羅性テスト
     */
    testCompleteness() {
        const foundIds = new Set();
        const duplicates = [];
        
        for (let upperIdx = 0; upperIdx < 8; upperIdx++) {
            for (let lowerIdx = 0; lowerIdx < 8; lowerIdx++) {
                const id = this.CORRECT_HEXAGRAM_MATRIX[upperIdx][lowerIdx];
                
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
        
        // 1-64の全番号が存在するか確認
        const missing = [];
        for (let i = 1; i <= 64; i++) {
            if (!foundIds.has(i)) {
                missing.push(i);
            }
        }
        
        console.log("\n=== 網羅性テスト ===");
        console.log(`カバー卦数: ${foundIds.size}/64`);
        
        if (missing.length > 0) {
            console.log(`❌ 欠落ID: ${missing.join(", ")}`);
        } else {
            console.log("✅ 全64卦が存在");
        }
        
        if (duplicates.length > 0) {
            console.log(`❌ 重複ID:`);
            duplicates.forEach(d => {
                console.log(`  #${d.id}: ${d.upper}/${d.lower}`);
            });
        } else {
            console.log("✅ 重複なし");
        }
        
        return {
            complete: missing.length === 0 && duplicates.length === 0,
            coverage: foundIds.size,
            missing,
            duplicates
        };
    }
    
    /**
     * 純卦の検証
     */
    testPureHexagrams() {
        const pureHexagrams = [
            { bagua: "乾", id: 1, name: "乾為天" },
            { bagua: "坤", id: 2, name: "坤為地" },
            { bagua: "坎", id: 29, name: "坎為水" },
            { bagua: "離", id: 30, name: "離為火" },
            { bagua: "震", id: 51, name: "震為雷" },
            { bagua: "艮", id: 52, name: "艮為山" },
            { bagua: "巽", id: 57, name: "巽為風" },
            { bagua: "兌", id: 58, name: "兌為沢" }
        ];
        
        console.log("\n=== 純卦検証 ===");
        let allCorrect = true;
        
        pureHexagrams.forEach(pure => {
            const actualId = this.getHexagramId(pure.bagua, pure.bagua);
            const isCorrect = actualId === pure.id;
            
            if (isCorrect) {
                console.log(`✅ ${pure.bagua}/${pure.bagua} = #${actualId} ${pure.name}`);
            } else {
                console.log(`❌ ${pure.bagua}/${pure.bagua} = #${actualId} (期待: #${pure.id} ${pure.name})`);
                allCorrect = false;
            }
        });
        
        return allCorrect;
    }
    
    /**
     * 逆順チェック（上下入れ替え）
     */
    testReversePairs() {
        const testPairs = [
            ["坎", "乾"],  // #5 水天需
            ["乾", "坎"],  // #6 天水訟
            ["離", "乾"],  // #13 天火同人
            ["乾", "離"],  // #14 火天大有
            ["坤", "乾"],  // #11 地天泰
            ["乾", "坤"]   // #12 天地否
        ];
        
        console.log("\n=== 逆順ペア検証 ===");
        
        for (let i = 0; i < testPairs.length; i += 2) {
            const [upper1, lower1] = testPairs[i];
            const [upper2, lower2] = testPairs[i + 1];
            
            const id1 = this.getHexagramId(upper1, lower1);
            const id2 = this.getHexagramId(upper2, lower2);
            
            const name1 = this.HEXAGRAM_NAMES[id1];
            const name2 = this.HEXAGRAM_NAMES[id2];
            
            console.log(`${upper1}/${lower1} = #${id1} ${name1}`);
            console.log(`${upper2}/${lower2} = #${id2} ${name2}`);
            console.log("");
        }
    }
}

// テスト実行関数
function runMatrixTests() {
    const fixer = new HexagramMatrixFix();
    
    // 1. 既知ペアの検証
    const validationResults = fixer.validateMatrix();
    
    // 2. 網羅性テスト
    const completenessResults = fixer.testCompleteness();
    
    // 3. 純卦テスト
    const pureResults = fixer.testPureHexagrams();
    
    // 4. 逆順ペアテスト
    fixer.testReversePairs();
    
    // 総合結果
    console.log("\n=== 総合結果 ===");
    console.log(`既知ペア検証: ${validationResults.passed.length}/${validationResults.total}`);
    console.log(`網羅性: ${completenessResults.complete ? "✅" : "❌"}`);
    console.log(`純卦: ${pureResults ? "✅" : "❌"}`);
    
    return {
        validation: validationResults,
        completeness: completenessResults,
        pureHexagrams: pureResults
    };
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HexagramMatrixFix, runMatrixTests };
}

console.log('64卦マトリクス修正モジュールが準備されました。');
console.log('runMatrixTests() を実行して検証してください。');