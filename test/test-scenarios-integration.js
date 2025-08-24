/**
 * EightScenariosGenerator Integration Test Suite
 * テストファースト: 新クラスとの統合テスト
 */

// Simple test framework
const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`❌ Test failed: ${message}`);
    }
};

const describe = (name, fn) => {
    console.log(`\n=== ${name} ===`);
    fn();
};

const it = (name, fn) => {
    try {
        fn();
        console.log(`✅ ${name}`);
    } catch (error) {
        console.error(`❌ ${name}`);
        console.error(`   ${error.message}`);
        process.exit(1);
    }
};

// Import target classes
import { KingWenMapping } from '../js/iching/KingWenMapping.js';
import { LineSelector } from '../js/iching/LineSelector.js';
import { AdvanceProcessor } from '../js/iching/AdvanceProcessor.js';
import { MultiLineInterpreter } from '../js/iching/MultiLineInterpreter.js';

// Test data
const mockAnalysisContext = {
    inputText: '新しい仕事の機会があるが、リスクもある。どうしたらいいだろうか？'
};

const mockTextAnalysis = {
    originalText: mockAnalysisContext.inputText,
    wordCount: 32,
    emotionalTone: { type: 'mixed', intensity: 0.6 },
    keyThemes: [{ name: '仕事', score: 0.8 }],
    situationType: 'decision-making',
    urgencyLevel: 'medium',
    complexityLevel: 'medium'
};

describe('Integration Tests - New Classes with EightScenariosGenerator', () => {
    
    describe('KingWenMapping Integration', () => {
        const mapping = new KingWenMapping();
        
        it('should initialize and provide hexagram data', async () => {
            await mapping.initialize();
            assert(mapping.initialized === true, 'KingWenMapping should initialize');
            
            const hexData = mapping.getHexagramData(11);
            assert(hexData !== null, 'Should return hexagram data');
            assert(hexData.name === '泰', 'Should return correct hexagram name');
        });
        
        it('should integrate with situational hexagram mapping', async () => {
            await mapping.initialize();
            
            // Simulate the old mapToSituationalHexagram behavior
            const hexagramNumber = 11; // Example: determined from text analysis
            const hexData = mapping.getHexagramData(hexagramNumber);
            
            const situationalHexagram = {
                number: hexagramNumber,
                name: hexData.name,
                lines: mapping.getLineConfiguration(hexagramNumber),
                keywords: hexData.keywords || ['変化', '選択', '発展']
            };
            
            assert(situationalHexagram.number === 11, 'Should map to correct hexagram');
            assert(situationalHexagram.name === '泰', 'Should have correct name');
            assert(Array.isArray(situationalHexagram.lines), 'Should have lines array');
        });
    });
    
    describe('LineSelector Integration', () => {
        const selector = new LineSelector();
        
        it('should select appropriate starting line for text analysis', () => {
            const startingLine = selector.selectStartingLine({}, mockTextAnalysis);
            
            assert(typeof startingLine === 'number', 'Should return a line number');
            assert(startingLine >= 1 && startingLine <= 6, 'Line should be between 1-6');
            
            // For '仕事' theme with medium urgency, expect middle layer (3-4)
            assert(startingLine >= 3 && startingLine <= 4, 'Work theme should select middle layer');
        });
        
        it('should determine change count based on complexity', () => {
            const changeCount = selector.determineChangeCount(mockTextAnalysis);
            
            assert(typeof changeCount === 'number', 'Should return a number');
            assert(changeCount >= 1 && changeCount <= 6, 'Change count should be 1-6');
            assert(changeCount === 2, 'Medium complexity should return 2 changes');
        });
        
        it('should select multiple lines to change', () => {
            const linesToChange = selector.selectLinesToChange(11, mockTextAnalysis);
            
            assert(Array.isArray(linesToChange), 'Should return an array');
            assert(linesToChange.length >= 1, 'Should select at least one line');
            assert(linesToChange.every(l => l >= 1 && l <= 6), 'All lines should be 1-6');
            
            // Should be sorted
            const sorted = [...linesToChange].sort((a, b) => a - b);
            assert(JSON.stringify(linesToChange) === JSON.stringify(sorted), 'Lines should be sorted');
        });
    });
    
    describe('AdvanceProcessor Integration', () => {
        const processor = new AdvanceProcessor();
        
        it('should generate advance chain for scenario building', () => {
            const chain = processor.generateAdvanceChain(11, 2, 2);
            
            assert(Array.isArray(chain), 'Should return an array');
            assert(chain.length <= 2, 'Should not exceed requested steps');
            
            if (chain.length > 0) {
                const firstStep = chain[0];
                assert(firstStep.type === 'advance', 'Should be advance type');
                assert(firstStep.from.hex === 11, 'Should maintain hexagram number');
                assert(firstStep.from.line === 2, 'Should start from correct line');
                assert(typeof firstStep.description === 'string', 'Should have description');
            }
        });
        
        it('should provide stage names and guidance', () => {
            const stageName = processor.getStageName(3);
            const evaluation = processor.evaluateAdvancePotential(11, 3);
            
            assert(typeof stageName === 'string', 'Should return stage name');
            assert(stageName.includes('実行'), 'Line 3 should be execution stage');
            
            assert(typeof evaluation === 'object', 'Should return evaluation object');
            assert(evaluation.possible === true, 'Line 3 should allow advance');
            assert(typeof evaluation.recommendation === 'string', 'Should have recommendation');
        });
    });
    
    describe('MultiLineInterpreter Integration', () => {
        const interpreter = new MultiLineInterpreter();
        
        it('should interpret single line changes', () => {
            const result = interpreter.interpretMultipleChanges(11, [3], 19);
            
            assert(typeof result === 'object', 'Should return interpretation object');
            assert(result.focus === 'line', 'Single change should focus on line');
            assert(result.primaryLine === 3, 'Should identify correct primary line');
            assert(typeof result.interpretation === 'string', 'Should have interpretation');
        });
        
        it('should interpret multiple line changes', () => {
            const result = interpreter.interpretMultipleChanges(11, [2, 5], 12);
            
            assert(result.focus === 'main_line_with_support', 'Should use main line approach');
            assert(result.primaryLine === 5, 'Line 5 should be primary');
            assert(Array.isArray(result.secondaryLines), 'Should have secondary lines');
            assert(result.secondaryLines.includes(2), 'Should include line 2 as secondary');
        });
    });
    
    describe('Full Integration Workflow', () => {
        it('should execute complete scenario generation workflow', async () => {
            const mapping = new KingWenMapping();
            const selector = new LineSelector();
            const processor = new AdvanceProcessor();
            const interpreter = new MultiLineInterpreter();
            
            // Initialize
            await mapping.initialize();
            
            // Step 1: Map to hexagram (replacing old mapToSituationalHexagram)
            const hexagramNumber = 11; // Would be calculated from text analysis
            const hexData = mapping.getHexagramData(hexagramNumber);
            const situationalHexagram = {
                number: hexagramNumber,
                name: hexData.name,
                lines: mapping.getLineConfiguration(hexagramNumber)
            };
            
            assert(situationalHexagram.number === 11, 'Should map to hexagram');
            
            // Step 2: Generate scenarios (replacing old generateBasePatterns)
            const startingLine = selector.selectStartingLine({}, mockTextAnalysis);
            const linesToChange = selector.selectLinesToChange(hexagramNumber, mockTextAnalysis);
            
            // Create scenarios with different approaches
            const scenarios = [];
            
            // Advance scenario
            const advanceChain = processor.generateAdvanceChain(hexagramNumber, startingLine, 2);
            scenarios.push({
                id: 'FUT-001',
                type: 'advance',
                mechanism: 'advance',
                chain: advanceChain,
                title: '段階的前進'
            });
            
            // Transform scenario
            if (linesToChange.length > 0) {
                const transformHex = mapping.calculateTransformedHex(hexagramNumber, linesToChange[0]);
                const interpretation = interpreter.interpretMultipleChanges(
                    hexagramNumber, 
                    linesToChange, 
                    transformHex
                );
                
                scenarios.push({
                    id: 'FUT-002',
                    type: 'transform',
                    mechanism: 'transform',
                    fromHex: hexagramNumber,
                    toHex: transformHex,
                    interpretation: interpretation,
                    title: '質的変化'
                });
            }
            
            assert(scenarios.length >= 2, 'Should generate multiple scenarios');
            
            const advanceScenario = scenarios.find(s => s.type === 'advance');
            assert(advanceScenario !== undefined, 'Should have advance scenario');
            assert(Array.isArray(advanceScenario.chain), 'Advance should have chain');
            
            const transformScenario = scenarios.find(s => s.type === 'transform');
            if (transformScenario) {
                assert(typeof transformScenario.fromHex === 'number', 'Transform should have fromHex');
                assert(typeof transformScenario.interpretation === 'object', 'Transform should have interpretation');
            }
            
            console.log(`   Generated ${scenarios.length} scenarios successfully`);
        });
    });
});

// Run tests
console.log('🧪 Running EightScenariosGenerator Integration Tests...');
console.log('Testing new v2.2.0 classes with existing system...');

export { describe, it, assert };