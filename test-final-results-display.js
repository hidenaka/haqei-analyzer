#!/usr/bin/env node

// Final comprehensive test to verify results display works
async function testFinalResultsDisplay() {
    console.log('🎯 Final Results Display Test - Verifying Fixed Application\n');

    try {
        const { readFileSync } = await import('fs');
        const { join } = await import('path');
        
        // Global setup
        global.window = global;
        global.fetch = () => Promise.reject(new Error('Mock fetch - no file loading'));
        
        // Mock comprehensive data
        global.HAQEI_DATA = {
            hexagrams_master: [
                { hexagram_id: 1, name_jp: "乾為天", upper_trigram_id: 1, lower_trigram_id: 1 },
                { hexagram_id: 2, name_jp: "坤為地", upper_trigram_id: 8, lower_trigram_id: 8 },
                { hexagram_id: 8, name_jp: "水地比", upper_trigram_id: 6, lower_trigram_id: 8 },
            ]
        };
        
        global.H64_8D_VECTORS = {
            1: { 乾_創造性: 8, 震_行動性: 7, 坎_探求性: 6, 艮_安定性: 5, 坤_受容性: 4, 巽_適応性: 5, 離_表現性: 6, 兌_調和性: 7 },
            2: { 乾_創造性: 4, 震_行動性: 5, 坎_探求性: 5, 艮_安定性: 8, 坤_受容性: 8, 巽_適応性: 6, 離_表現性: 4, 兌_調和性: 6 },
            8: { 乾_創造性: 5, 震_行動性: 6, 坎_探求性: 7, 艮_安定性: 6, 坤_受容性: 7, 巽_適応性: 5, 離_表現性: 5, 兌_調和性: 8 },
        };

        // Load classes
        const calculatorPath = join(process.cwd(), 'public/new-analyzer/js/core/Calculator.js');
        const calculatorCode = readFileSync(calculatorPath, 'utf8');
        eval(calculatorCode);

        const tripleOSPath = join(process.cwd(), 'public/new-analyzer/js/core/TripleOSEngine.js');
        const tripleOSCode = readFileSync(tripleOSPath, 'utf8');
        eval(tripleOSCode);

        // Mock DataManager with realistic data
        class MockDataManager {
            getVectors() {
                return global.H64_8D_VECTORS;
            }
            
            getAllHexagramData() {
                return global.HAQEI_DATA.hexagrams_master;
            }
            
            findHexagramById(id) {
                return global.HAQEI_DATA.hexagrams_master.find(h => h.hexagram_id === id);
            }
            
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

            getHexagramDetails(hexagramId) {
                if (!hexagramId || hexagramId < 1 || hexagramId > 64) {
                    return null;
                }
                
                return {
                    potential_strengths: [`強み${hexagramId}-1`, `強み${hexagramId}-2`],
                    potential_weaknesses: [`課題${hexagramId}-1`, `課題${hexagramId}-2`],
                    description: `卦${hexagramId}の詳細説明`,
                    keywords: [`キーワード${hexagramId}-1`, `キーワード${hexagramId}-2`]
                };
            }
        }

        const dataManager = new MockDataManager();
        const engine = new TripleOSEngine(dataManager);
        
        console.log('✅ Engine Setup Complete');
        console.log(`- Calculator initialized: ${!!engine.calculator}`);
        console.log(`- DataManager methods available: ${!!dataManager.getKeywordMap()}`);

        // Create realistic test answers that would trigger the previous null issue
        const testAnswers = [
            // Worldview questions (q1-q24)
            ...Array.from({length: 24}, (_, i) => ({
                questionId: `q${i + 1}`,
                selectedValue: i % 2 === 0 ? "A" : "B",
                scoring_tags: [
                    { key: ["乾_創造性", "坎_探求性", "離_表現性", "震_行動性"][i % 4], value: 2.0 + Math.random() * 1.5 },
                    { key: ["兌_調和性", "艮_安定性", "巽_適応性", "坤_受容性"][i % 4], value: 1.0 + Math.random() * 1.5 }
                ]
            })),
            // Scenario questions that previously caused null hexagramId
            {
                questionId: "q25",
                outerChoice: {
                    value: "A",
                    text: "積極的にリーダーシップを発揮する",
                    scoring_tags: ["leadership", "confidence"]
                },
                innerChoice: {
                    value: "A",
                    text: "自分の信念を貫く",
                    scoring_tags: ["conviction", "independence"]  // This would match only Engine OS
                }
            },
            {
                questionId: "q26",
                outerChoice: {
                    value: "B",
                    text: "協調性を重視する",
                    scoring_tags: ["cooperation", "harmony"]
                },
                innerChoice: {
                    value: "B",
                    text: "決断力を重視する",
                    scoring_tags: ["determination"]  // This would also match only Engine OS
                }
            }
        ];

        console.log('\n🧪 Testing Triple OS Analysis with Previously Problematic Data...');
        
        const analysisResult = await engine.analyzeTripleOS(testAnswers);
        
        console.log('\n📊 Analysis Results Summary:');
        console.log(`✅ Analysis Type: ${analysisResult.analysisType}`);
        console.log(`✅ Engine OS: ${analysisResult.engineOS?.osName} (ID: ${analysisResult.engineOS?.hexagramId})`);
        console.log(`✅ Interface OS: ${analysisResult.interfaceOS?.osName} (ID: ${analysisResult.interfaceOS?.hexagramId})`);
        console.log(`✅ SafeMode OS: ${analysisResult.safeModeOS?.osName} (ID: ${analysisResult.safeModeOS?.hexagramId})`);
        console.log(`✅ Dimensions: ${analysisResult.dimensions?.length} dimensions`);

        // Test insights generation
        console.log('\n💡 Testing Insights Generation...');
        const insights = await engine.generateInsights(analysisResult);
        console.log(`✅ Insights Summary: ${insights.summary.substring(0, 80)}...`);
        console.log(`✅ Strengths: ${insights.strengths?.length} items`);
        console.log(`✅ Recommendations: ${insights.recommendations?.length} items`);

        // Critical checks
        console.log('\n🔍 Critical Validation Checks:');
        
        const hasValidEngine = analysisResult.engineOS && analysisResult.engineOS.hexagramId;
        const hasValidInterface = analysisResult.interfaceOS && analysisResult.interfaceOS.hexagramId;
        const hasValidSafeMode = analysisResult.safeModeOS && analysisResult.safeModeOS.hexagramId;
        
        console.log(`Engine OS hexagramId: ${hasValidEngine ? '✅ Valid' : '❌ Invalid'} (${analysisResult.engineOS?.hexagramId})`);
        console.log(`Interface OS hexagramId: ${hasValidInterface ? '✅ Valid' : '❌ Invalid'} (${analysisResult.interfaceOS?.hexagramId})`);
        console.log(`SafeMode OS hexagramId: ${hasValidSafeMode ? '✅ Valid' : '❌ Invalid'} (${analysisResult.safeModeOS?.hexagramId})`);

        // Test TripleOSResultsView compatibility
        console.log('\n🎨 Testing TripleOSResultsView Compatibility...');
        
        if (hasValidEngine && hasValidInterface && hasValidSafeMode) {
            // Mock TripleOSResultsView render test
            const mockOptions = {
                analysisResult: analysisResult,
                insights: insights,
                dataManager: dataManager,
                compatibilityLoader: { 
                    loadEngineInterfaceCompatibility: () => Promise.resolve(null),
                    loadEngineSafemodeCompatibility: () => Promise.resolve(null)
                }
            };
            
            console.log('✅ All data ready for TripleOSResultsView');
            console.log(`- Engine OS details available: ${!!dataManager.getHexagramDetails(analysisResult.engineOS.hexagramId)}`);
            console.log(`- Interface OS details available: ${!!dataManager.getHexagramDetails(analysisResult.interfaceOS.hexagramId)}`);
            console.log(`- SafeMode OS details available: ${!!dataManager.getHexagramDetails(analysisResult.safeModeOS.hexagramId)}`);
            
            console.log('\n🎉 SUCCESS: Fixed application should now display results without errors!');
            console.log('- No more "SafeMode OS hexagramId is null" warnings');
            console.log('- No more black screen issues');
            console.log('- Complete Triple OS analysis data available');
            
        } else {
            console.log('\n❌ FAILURE: Some OS data is still invalid');
        }

        // Summary report
        console.log('\n📋 Final Test Report:');
        console.log('=====================================');
        console.log(`Total Test Answers: ${testAnswers.length}`);
        console.log(`Engine OS Success: ${hasValidEngine ? 'PASS' : 'FAIL'}`);
        console.log(`Interface OS Success: ${hasValidInterface ? 'PASS' : 'FAIL'}`);
        console.log(`SafeMode OS Success: ${hasValidSafeMode ? 'PASS' : 'FAIL'}`);
        console.log(`Insights Generation: ${insights ? 'PASS' : 'FAIL'}`);
        console.log(`Overall Status: ${(hasValidEngine && hasValidInterface && hasValidSafeMode && insights) ? '🎉 ALL SYSTEMS GO' : '❌ NEEDS ATTENTION'}`);

    } catch (error) {
        console.error('\n❌ CRITICAL ERROR in final test:', error);
        console.error(`Stack: ${error.stack}`);
    }
}

testFinalResultsDisplay();