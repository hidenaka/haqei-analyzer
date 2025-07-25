#!/usr/bin/env node

// Complete diagnosis flow debug test
async function runDiagnosisTest() {
console.log('🔬 Complete Diagnosis Flow Debug Test\n');

try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    
    // Global setup
    global.window = global;
    global.fetch = () => Promise.reject(new Error('Mock fetch - no file loading'));
    
    // Mock data setup
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
    
    global.WORLDVIEW_QUESTIONS = [
        { id: "q1", text: "Test question 1" },
        { id: "q2", text: "Test question 2" }
    ];
    
    global.SCENARIO_QUESTIONS = [
        { id: "q25", text: "Test scenario 1" },
        { id: "q26", text: "Test scenario 2" }
    ];

    // Load classes
    const calculatorPath = join(process.cwd(), 'public/new-analyzer/js/core/Calculator.js');
    const calculatorCode = readFileSync(calculatorPath, 'utf8');
    eval(calculatorCode);
    console.log('✅ Calculator loaded');

    const tripleOSPath = join(process.cwd(), 'public/new-analyzer/js/core/TripleOSEngine.js');
    const tripleOSCode = readFileSync(tripleOSPath, 'utf8');
    eval(tripleOSCode);
    console.log('✅ TripleOSEngine loaded');

    // Mock DataManager
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
            // 実際のキーワードマップをシミュレート
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
            // 実際の爻キーワードマップをシミュレート
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
    }

    console.log('\n📊 Test Data Summary:');
    console.log(`- Hexagrams: ${global.HAQEI_DATA.hexagrams_master.length}`);
    console.log(`- Vectors: ${Object.keys(global.H64_8D_VECTORS).length}`);
    console.log(`- Worldview questions: ${global.WORLDVIEW_QUESTIONS.length}`);
    console.log(`- Scenario questions: ${global.SCENARIO_QUESTIONS.length}`);

    // Create test instance
    const dataManager = new MockDataManager();
    const engine = new TripleOSEngine(dataManager);
    
    console.log('\n🔧 Engine Configuration:');
    console.log('- Calculator initialized:', !!engine.calculator);
    console.log('- Keyword map size:', Object.keys(dataManager.getKeywordMap()).length);
    console.log('- Line keyword map size:', Object.keys(dataManager.getLineKeywordMap()).length);

    // Create realistic test answers
    const testAnswers = [
        // Worldview questions (q1-q24)
        {
            questionId: "q1",
            selectedValue: "A",
            scoring_tags: [
                { key: "乾_創造性", value: 3.0 },
                { key: "離_表現性", value: 1.5 }
            ]
        },
        {
            questionId: "q2",
            selectedValue: "B", 
            scoring_tags: [
                { key: "坎_探求性", value: 2.5 },
                { key: "艮_安定性", value: 2.0 }
            ]
        },
        {
            questionId: "q3",
            selectedValue: "A",
            scoring_tags: [
                { key: "震_行動性", value: 2.8 },
                { key: "兌_調和性", value: 1.2 }
            ]
        },
        // More worldview answers...
        ...Array.from({length: 21}, (_, i) => ({
            questionId: `q${i + 4}`,
            selectedValue: i % 2 === 0 ? "A" : "B",
            scoring_tags: [
                { key: ["乾_創造性", "坎_探求性", "離_表現性", "震_行動性"][i % 4], value: 2.0 + Math.random() * 1.5 },
                { key: ["兌_調和性", "艮_安定性", "巽_適応性", "坤_受容性"][i % 4], value: 1.0 + Math.random() * 1.5 }
            ]
        })),
        // Scenario questions (q25-q30)
        {
            questionId: "q25",
            outerChoice: {
                value: "A",
                text: "積極的にリーダーシップを発揮する",
                scoring_tags: ["leadership", "confidence"]
            },
            innerChoice: {
                value: "B",
                text: "慎重に状況を分析する", 
                scoring_tags: ["caution", "analysis"]
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
                value: "A",
                text: "自分の信念を貫く",
                scoring_tags: ["conviction", "independence"]
            }
        },
        {
            questionId: "q27",
            outerChoice: {
                value: "A", 
                text: "新しいアイデアを提案する",
                scoring_tags: ["creativity", "innovation"]
            },
            innerChoice: {
                value: "B",
                text: "安全な選択肢を選ぶ",
                scoring_tags: ["safety", "stability"]
            }
        }
    ];

    console.log('\n📝 Test Answers Summary:');
    const worldviewAnswers = testAnswers.filter(a => a.questionId.match(/^q([1-9]|1[0-9]|2[0-4])$/));
    const scenarioAnswers = testAnswers.filter(a => a.questionId.match(/^q(25|26|27|28|29|30)$/));
    console.log(`- Total answers: ${testAnswers.length}`);
    console.log(`- Worldview answers: ${worldviewAnswers.length}`);
    console.log(`- Scenario answers: ${scenarioAnswers.length}`);

    // Test step by step
    console.log('\n🔬 Starting Step-by-Step Analysis:');
    
    // Step 1: Test buildUserVector
    console.log('\n1️⃣ Testing buildUserVector:');
    const userVector = engine.calculator.buildUserVector(worldviewAnswers);
    console.log('User vector:', userVector);
    
    const totalScore = Object.values(userVector).reduce((sum, val) => sum + val, 0);
    console.log(`Total score: ${totalScore}`);
    
    if (totalScore === 0) {
        console.log('❌ WARNING: User vector is empty!');
        return;
    }

    // Step 2: Test Engine OS analysis
    console.log('\n2️⃣ Testing Engine OS Analysis:');
    const engineOS = await engine.analyzeEngineOS(worldviewAnswers);
    console.log('Engine OS result:', {
        osId: engineOS.osId,
        osName: engineOS.osName,
        hexagramId: engineOS.hexagramId,
        confidence: engineOS.confidence
    });

    // Step 3: Test Interface OS analysis  
    console.log('\n3️⃣ Testing Interface OS Analysis:');
    const interfaceOS = await engine.analyzeInterfaceOS(scenarioAnswers, engineOS);
    console.log('Interface OS result:', {
        hexagramId: interfaceOS.hexagramId,
        osName: interfaceOS.osName,
        matchScore: interfaceOS.matchScore,
        keywordMatches: interfaceOS.keywordMatches
    });

    // Step 4: Test SafeMode OS analysis
    console.log('\n4️⃣ Testing SafeMode OS Analysis:');
    const safeModeOS = await engine.analyzeSafeModeOS(scenarioAnswers, engineOS);
    console.log('SafeMode OS result:', {
        hexagramId: safeModeOS.hexagramId,
        osName: safeModeOS.osName,
        matchScore: safeModeOS.matchScore,
        lineMatches: safeModeOS.lineMatches
    });

    // Step 5: Test full analysis
    console.log('\n5️⃣ Testing Full Triple OS Analysis:');
    const fullResult = await engine.analyzeTripleOS(testAnswers);
    console.log('Full analysis result structure:');
    console.log(`- Analysis type: ${fullResult.analysisType}`);
    console.log(`- Primary OS: ${fullResult.primaryOS?.osName} (ID: ${fullResult.primaryOS?.osId})`);
    console.log(`- Engine OS: ${fullResult.engineOS?.osName} (hexagramId: ${fullResult.engineOS?.hexagramId})`);
    console.log(`- Interface OS: ${fullResult.interfaceOS?.osName} (hexagramId: ${fullResult.interfaceOS?.hexagramId})`);
    console.log(`- SafeMode OS: ${fullResult.safeModeOS?.osName} (hexagramId: ${fullResult.safeModeOS?.hexagramId})`);
    console.log(`- Dimensions: ${fullResult.dimensions?.length || 0} dimensions`);

    // Step 6: Test insights generation
    console.log('\n6️⃣ Testing Insights Generation:');
    const insights = await engine.generateInsights(fullResult);
    console.log('Insights generated:');
    console.log(`- Summary: ${insights.summary.substring(0, 100)}...`);
    console.log(`- Strengths: ${insights.strengths?.length || 0} items`);
    console.log(`- Recommendations: ${insights.recommendations?.length || 0} items`);

    // Final analysis
    console.log('\n🎯 Final Analysis:');
    
    const hasValidEngine = fullResult.engineOS && fullResult.engineOS.hexagramId;
    const hasValidInterface = fullResult.interfaceOS && fullResult.interfaceOS.hexagramId;
    const hasValidSafeMode = fullResult.safeModeOS && fullResult.safeModeOS.hexagramId;
    
    console.log(`✅ Engine OS valid: ${hasValidEngine}`);
    console.log(`${hasValidInterface ? '✅' : '❌'} Interface OS valid: ${hasValidInterface}`);
    console.log(`${hasValidSafeMode ? '✅' : '❌'} SafeMode OS valid: ${hasValidSafeMode}`);
    
    if (hasValidEngine && hasValidInterface && hasValidSafeMode) {
        console.log('\n🎉 SUCCESS: All OS analyses completed successfully!');
        console.log('The diagnosis should display properly.');
    } else {
        console.log('\n⚠️ WARNING: Some OS analyses returned null hexagramId');
        console.log('This is likely why the diagnosis display is failing.');
        
        if (!hasValidInterface) {
            console.log('\n🔍 Interface OS Issue Analysis:');
            console.log('- Check if keyword_map contains the scoring_tags from outerChoice');
            console.log('- Verify that excludeEngineOS is not removing all candidates');
        }
        
        if (!hasValidSafeMode) {
            console.log('\n🔍 SafeMode OS Issue Analysis:');
            console.log('- Check if line_keyword_map contains the scoring_tags from innerChoice');
            console.log('- Verify that excludeEngineOS is not removing all candidates');
        }
    }

    console.log('\n📋 Diagnosis Result Summary:');
    console.log(`Analysis Type: ${fullResult.analysisType}`);
    console.log(`Ready for Display: ${hasValidEngine && fullResult.dimensions}`);
    console.log(`Result Object Keys: ${Object.keys(fullResult).join(', ')}`);

} catch (error) {
    console.log('\n❌ CRITICAL ERROR in diagnosis test:');
    console.log(`Error: ${error.message}`);
    console.log(`Stack: ${error.stack}`);
    process.exit(1);
}
}

runDiagnosisTest();