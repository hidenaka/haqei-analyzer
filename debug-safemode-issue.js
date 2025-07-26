#!/usr/bin/env node

// Debug SafeMode OS hexagramId null issue
async function debugSafeModeIssue() {
    console.log('🔍 Debugging SafeMode OS hexagramId null issue\n');

    try {
        const { readFileSync } = await import('fs');
        const { join } = await import('path');
        
        // Global setup
        global.window = global;
        global.fetch = () => Promise.reject(new Error('Mock fetch - no file loading'));
        
        // Load classes
        const calculatorPath = join(process.cwd(), 'public/new-analyzer/js/core/Calculator.js');
        const calculatorCode = readFileSync(calculatorPath, 'utf8');
        eval(calculatorCode);

        const tripleOSPath = join(process.cwd(), 'public/new-analyzer/js/core/TripleOSEngine.js');
        const tripleOSCode = readFileSync(tripleOSPath, 'utf8');
        eval(tripleOSCode);

        // Mock DataManager with extensive keyword maps
        class MockDataManager {
            getKeywordMap() {
                return {
                    'leadership': [1, 8],
                    'confidence': [1],
                    'cooperation': [2, 8],
                    'harmony': [2, 8],
                    'creativity': [1],
                    'innovation': [1],
                    '乾_創造性': [1],
                    '兌_調和性': [2, 8],
                    '坤_受容性': [2]
                };
            }
            
            getLineKeywordMap() {
                return {
                    'caution': [2, 8],
                    'analysis': [8],
                    'reflection': [2],
                    'conviction': [1],
                    'independence': [1],
                    'determination': [1],
                    'safety': [2],
                    'stability': [2, 8]
                };
            }

            findHexagramById(id) {
                const hexagrams = {
                    1: { hexagram_id: 1, name_jp: '乾為天', upper_trigram_id: 1, lower_trigram_id: 1 },
                    2: { hexagram_id: 2, name_jp: '坤為地', upper_trigram_id: 8, lower_trigram_id: 8 },
                    8: { hexagram_id: 8, name_jp: '水地比', upper_trigram_id: 6, lower_trigram_id: 8 }
                };
                return hexagrams[id] || null;
            }
        }

        const dataManager = new MockDataManager();
        const engine = new TripleOSEngine(dataManager);

        // Create test scenario with Engine OS = 1 (乾為天)
        const mockEngineOS = {
            hexagramId: 1,
            osName: "乾為天",
            osId: 1
        };

        console.log('🧪 Test Case 1: Normal scenario answers (should find SafeMode OS)');
        const scenarioAnswers1 = [
            {
                questionId: "q25",
                innerChoice: {
                    value: "B",
                    text: "慎重に状況を分析する",
                    scoring_tags: ["caution", "analysis"]
                }
            },
            {
                questionId: "q26", 
                innerChoice: {
                    value: "A",
                    text: "安全な選択肢を選ぶ",
                    scoring_tags: ["safety", "stability"]
                }
            }
        ];

        const safeModeResult1 = await engine.analyzeSafeModeOS(scenarioAnswers1, mockEngineOS);
        console.log('SafeMode Result 1:', {
            hexagramId: safeModeResult1.hexagramId,
            osName: safeModeResult1.osName,
            matchScore: safeModeResult1.matchScore,
            lineMatches: safeModeResult1.lineMatches
        });

        console.log('\n🧪 Test Case 2: Scenario that only matches Engine OS (should fallback)');
        const scenarioAnswers2 = [
            {
                questionId: "q25",
                innerChoice: {
                    value: "A",
                    text: "自分の信念を貫く",
                    scoring_tags: ["conviction", "independence"]
                }
            },
            {
                questionId: "q26",
                innerChoice: {
                    value: "B", 
                    text: "決断力を重視する",
                    scoring_tags: ["determination"]
                }
            }
        ];

        const safeModeResult2 = await engine.analyzeSafeModeOS(scenarioAnswers2, mockEngineOS);
        console.log('SafeMode Result 2:', {
            hexagramId: safeModeResult2.hexagramId,
            osName: safeModeResult2.osName,
            matchScore: safeModeResult2.matchScore,
            lineMatches: safeModeResult2.lineMatches
        });

        console.log('\n🧪 Test Case 3: Unknown keywords (should fallback)');
        const scenarioAnswers3 = [
            {
                questionId: "q25",
                innerChoice: {
                    value: "A",
                    text: "未知のアプローチ",
                    scoring_tags: ["unknown1", "unknown2"]
                }
            }
        ];

        const safeModeResult3 = await engine.analyzeSafeModeOS(scenarioAnswers3, mockEngineOS);
        console.log('SafeMode Result 3:', {
            hexagramId: safeModeResult3.hexagramId,
            osName: safeModeResult3.osName,
            matchScore: safeModeResult3.matchScore,
            lineMatches: safeModeResult3.lineMatches
        });

        console.log('\n📋 Analysis Summary:');
        console.log(`Test 1 - hexagramId: ${safeModeResult1.hexagramId} (expected: not null)`);
        console.log(`Test 2 - hexagramId: ${safeModeResult2.hexagramId} (expected: not null after filtering)`);
        console.log(`Test 3 - hexagramId: ${safeModeResult3.hexagramId} (expected: null, needs fallback)`);

        if (safeModeResult3.hexagramId === null) {
            console.log('\n❌ ISSUE IDENTIFIED: SafeMode OS returns null when no keyword matches found');
            console.log('💡 SOLUTION NEEDED: Implement fallback mechanism for SafeMode OS');
        }

    } catch (error) {
        console.error('❌ Error in SafeMode debug:', error);
    }
}

debugSafeModeIssue();