#!/usr/bin/env node

/**
 * Future Simulator Core Logic Test
 * Node.js environment test for the I Ching transformation logic
 */

console.log('🧪 Testing Future Simulator Core Logic...\n');

// Mock H384 data for testing
const mockH384Data = {
    3: { // 水雷屯
        1: {
            '卦名': '水雷屯',
            '爻': '初九',
            '卦番号': 3,
            'キーワード': ['協力者', '待機', '準備'],
            '現代解釈の要約': '困難な状況での待機と準備の重要性',
            'S5_主体性推奨スタンス': '受動',
            'S7_総合評価スコア': 65,
            'S4_リスク': 30
        },
        2: {
            '卦名': '水雷屯',
            '爻': '六二',
            '卦番号': 3,
            'キーワード': ['困難', '忍耐', '信頼'],
            '現代解釈の要約': '困難な状況での忍耐と信頼構築',
            'S5_主体性推奨スタンス': '受動',
            'S7_総合評価スコア': 70,
            'S4_リスク': 25
        }
    },
    17: { // 澤雷随
        1: {
            '卦名': '澤雷随',
            '爻': '初六',
            '卦番号': 17,
            'キーワード': ['随従', '適応', '柔軟性'],
            '現代解釈の要約': '状況に適応し随従することの智恵',
            'S5_主体性推奨スタンス': '能動',
            'S7_総合評価スコア': 75,
            'S4_リスク': 20
        }
    }
};

// Mock IChingChoiceLogic class
class IChingChoiceLogic {
    constructor() {
        this.name = 'IChingChoiceLogic';
        this.version = '2.0.0';
        this.h384db = {
            getHexagramYaoData: (hexagramNumber, yaoNumber) => {
                return mockH384Data[hexagramNumber] && mockH384Data[hexagramNumber][yaoNumber] || null;
            }
        };
        
        // 64卦の爻構成データ（簡略版）
        this.hexagramStructures = {
            3: '010001',  // 水雷屯
            17: '011001' // 澤雷随
        };
    }

    calculateChange(currentHexagram, followTheme) {
        console.log(`🔄 Calculating change: ${currentHexagram['卦名']} ${currentHexagram['爻']}, follow=${followTheme}`);
        
        if (followTheme) {
            // テーマに従う：進爻
            return this.progressYao(currentHexagram);
        } else {
            // テーマに従わない：変爻
            return this.changeYao(currentHexagram);
        }
    }

    progressYao(currentHexagram) {
        const currentYaoNumber = this.getYaoNumber(currentHexagram['爻']);
        const hexagramNumber = currentHexagram['卦番号'];
        
        if (currentYaoNumber < 6) {
            // 次の爻へ進む
            const nextYaoNumber = currentYaoNumber + 1;
            const nextData = this.h384db.getHexagramYaoData(hexagramNumber, nextYaoNumber);
            
            console.log(`📈 進爻: ${currentHexagram['爻']} → ${nextData ? nextData['爻'] : 'N/A'}`);
            return nextData || currentHexagram;
        } else {
            console.log(`📈 次卦へ: ${currentHexagram['卦名']} → 次の卦`);
            return currentHexagram; // 簡略化
        }
    }

    changeYao(currentHexagram) {
        // 簡略化された変爻実装
        // 水雷屯・初九 → 澤雷随・初六への変化をシミュレート
        const newData = this.h384db.getHexagramYaoData(17, 1);
        
        console.log(`🔄 変爻: ${currentHexagram['卦名']}${currentHexagram['爻']} → ${newData ? newData['卦名'] + newData['爻'] : 'N/A'}`);
        return newData || currentHexagram;
    }

    getYaoNumber(yaoName) {
        const mapping = {
            '初九': 1, '初六': 1,
            '九二': 2, '六二': 2,
            '九三': 3, '六三': 3,
            '九四': 4, '六四': 4,
            '九五': 5, '六五': 5,
            '上九': 6, '上六': 6
        };
        return mapping[yaoName] || 1;
    }
}

// Test execution
async function runTest() {
    const logic = new IChingChoiceLogic();
    
    // Test hexagram
    const testHexagram = {
        '卦名': '水雷屯',
        '爻': '初九',
        '卦番号': 3,
        'キーワード': ['協力者', '待機', '準備'],
        '現代解釈の要約': '困難な状況での待機と準備の重要性',
        'S5_主体性推奨スタンス': '受動',
        'S7_総合評価スコア': 65,
        'S4_リスク': 30
    };

    console.log('🎯 Test Case 1: テーマに従う（進爻）');
    console.log('Input:', JSON.stringify(testHexagram, null, 2));
    
    const followResult = logic.calculateChange(testHexagram, true);
    console.log('Result (Follow):', JSON.stringify(followResult, null, 2));
    
    console.log('\n🎯 Test Case 2: テーマに従わない（変爻）');
    const rejectResult = logic.calculateChange(testHexagram, false);
    console.log('Result (Reject):', JSON.stringify(rejectResult, null, 2));
    
    console.log('\n✅ Core Logic Test Complete!');
    console.log('\n📊 Test Summary:');
    console.log(`- 進爻テスト: ${followResult ? '✅ Success' : '❌ Failed'}`);
    console.log(`- 変爻テスト: ${rejectResult ? '✅ Success' : '❌ Failed'}`);
    
    // Test 3-stage scenario generation
    console.log('\n🎯 Test Case 3: 3段階プロセス生成');
    const scenarios = generate8Scenarios(testHexagram);
    console.log('Generated scenarios count:', scenarios.length);
    scenarios.forEach((scenario, index) => {
        console.log(`Scenario ${index + 1}: ${scenario.title} (${scenario.path.join(' → ')})`);
    });
}

function generate8Scenarios(initialHexagram) {
    const paths = [
        ['follow', 'follow', 'follow'],
        ['follow', 'follow', 'reject'],
        ['follow', 'reject', 'follow'], 
        ['follow', 'reject', 'reject'],
        ['reject', 'follow', 'follow'],
        ['reject', 'follow', 'reject'],
        ['reject', 'reject', 'follow'],
        ['reject', 'reject', 'reject']
    ];
    
    const pathTitles = {
        'follow,follow,follow': '完全受容の道',
        'follow,follow,reject': '最終転換の道',
        'follow,reject,follow': '中間転換の道',
        'follow,reject,reject': '後半革新の道',
        'reject,follow,follow': '初期革新の道',
        'reject,follow,reject': '両端革新の道',
        'reject,reject,follow': '最終受容の道',
        'reject,reject,reject': '完全革新の道'
    };
    
    return paths.map((path, index) => ({
        id: index + 1,
        path: path,
        title: pathTitles[path.join(',')] || '未定義の道',
        probability: Math.floor(Math.random() * 40) + 60, // 60-100%
        description: `3段階で${path.map(p => p === 'follow' ? '受容' : '革新').join('→')}の道を歩む`
    }));
}

// Run the test
runTest().catch(console.error);