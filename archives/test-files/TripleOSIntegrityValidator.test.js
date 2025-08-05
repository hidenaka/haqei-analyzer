/**
 * 🧪 TripleOSIntegrityValidator テストスイート
 * 
 * bunenjin哲学統合テスト:
 * - 三才配置（天・人・地）による検証精度テスト
 * - Triple OSアーキテクチャ完全性テスト
 * - 易経的バランス検証テスト
 */

describe('TripleOSIntegrityValidator', () => {
    let validator;
    
    beforeEach(() => {
        validator = new TripleOSIntegrityValidator();
    });

    describe('Engine OS（天・価値観）検証テスト', () => {
        test('完全なEngine OSデータの検証成功', () => {
            const validEngineOS = {
                values: ['authenticity', 'growth'],
                motivations: ['self-actualization'],
                coreBeliefs: ['continuous improvement'],
                dominantPatterns: ['intrinsic motivation']
            };

            const result = validator.validateEngineOS(validEngineOS);
            
            expect(result.isValid).toBe(true);
            expect(result.completeness).toBeGreaterThanOrEqual(0.8);
            expect(result.missingFields).toHaveLength(0);
        });

        test('不完全なEngine OSデータの適切な検証失敗', () => {
            const incompleteEngineOS = {
                values: ['authenticity']
                // motivations, coreBeliefs missing
            };

            const result = validator.validateEngineOS(incompleteEngineOS);
            
            expect(result.isValid).toBe(false);
            expect(result.missingFields).toContain('motivations');
            expect(result.missingFields).toContain('coreBeliefs');
            expect(result.completeness).toBeLessThan(0.5);
        });

        test('null/undefined Engine OSの拒否', () => {
            expect(validator.validateEngineOS(null).isValid).toBe(false);
            expect(validator.validateEngineOS(undefined).isValid).toBe(false);
            expect(validator.validateEngineOS({}).isValid).toBe(false);
        });
    });

    describe('Interface OS（人・社会的）検証テスト', () => {
        test('完全なInterface OSデータの検証成功', () => {
            const validInterfaceOS = {
                socialPatterns: ['collaborative', 'empathetic'],
                communicationStyle: 'direct-supportive',
                adaptability: 'high',
                interpersonalStrategies: ['active listening']
            };

            const result = validator.validateInterfaceOS(validInterfaceOS);
            
            expect(result.isValid).toBe(true);
            expect(result.completeness).toBeGreaterThanOrEqual(0.8);
            expect(result.socialCoherency).toBeGreaterThanOrEqual(0.7);
        });

        test('社会的一貫性の検証', () => {
            const inconsistentInterfaceOS = {
                socialPatterns: ['highly introverted'],
                communicationStyle: 'extroverted-dominant',
                adaptability: 'low',
                interpersonalStrategies: ['public speaking']
            };

            const result = validator.validateInterfaceOS(inconsistentInterfaceOS);
            
            expect(result.socialCoherency).toBeLessThan(0.5);
            expect(result.warnings).toContain('social-pattern-communication-inconsistency');
        });
    });

    describe('Safe Mode OS（地・防御）検証テスト', () => {
        test('完全なSafe Mode OSデータの検証成功', () => {
            const validSafeModeOS = {
                defensePatterns: ['analytical-caution', 'emotional-regulation'],
                stressResponses: ['systematic-planning'],
                protectiveMechanisms: ['boundary-setting'],
                resilience: 'adaptive'
            };

            const result = validator.validateSafeModeOS(validSafeModeOS);
            
            expect(result.isValid).toBe(true);
            expect(result.completeness).toBeGreaterThanOrEqual(0.8);
            expect(result.defensiveBalance).toBeGreaterThanOrEqual(0.6);
        });

        test('防御メカニズムのバランス検証', () => {
            const unbalancedSafeModeOS = {
                defensePatterns: ['extreme-avoidance', 'complete-isolation'],
                stressResponses: ['panic', 'shutdown'],
                protectiveMechanisms: ['total-withdrawal'],
                resilience: 'brittle'
            };

            const result = validator.validateSafeModeOS(unbalancedSafeModeOS);
            
            expect(result.defensiveBalance).toBeLessThan(0.4);
            expect(result.warnings).toContain('excessive-defensive-patterns');
        });
    });

    describe('Triple OS統合検証テスト', () => {
        test('三つのOS間の調和的バランス検証', () => {
            const harmonizedTripleOS = {
                engineOS: {
                    values: ['authenticity', 'growth'],
                    motivations: ['self-actualization'],
                    coreBeliefs: ['continuous-improvement']
                },
                interfaceOS: {
                    socialPatterns: ['collaborative', 'empathetic'],
                    communicationStyle: 'authentic-supportive',
                    adaptability: 'high'
                },
                safeModeOS: {
                    defensePatterns: ['healthy-boundaries'],
                    stressResponses: ['seek-support'],
                    protectiveMechanisms: ['self-care']
                }
            };

            const result = validator.validateTripleOSIntegration(harmonizedTripleOS);
            
            expect(result.isValid).toBe(true);
            expect(result.harmonyScore).toBeGreaterThanOrEqual(0.8);
            expect(result.integration.engineInterface).toBeGreaterThanOrEqual(0.7);
            expect(result.integration.engineSafeMode).toBeGreaterThanOrEqual(0.7);
            expect(result.integration.interfaceSafeMode).toBeGreaterThanOrEqual(0.7);
        });

        test('OS間の矛盾検知', () => {
            const conflictedTripleOS = {
                engineOS: {
                    values: ['independence', 'solitude'],
                    motivations: ['autonomy'],
                    coreBeliefs: ['self-reliance']
                },
                interfaceOS: {
                    socialPatterns: ['highly-social', 'attention-seeking'],
                    communicationStyle: 'dominant-expressive',
                    adaptability: 'conformist'
                },
                safeModeOS: {
                    defensePatterns: ['people-pleasing'],
                    stressResponses: ['social-compliance'],
                    protectiveMechanisms: ['external-validation']
                }
            };

            const result = validator.validateTripleOSIntegration(conflictedTripleOS);
            
            expect(result.conflicts).toHaveLength(3); // Engine-Interface, Engine-SafeMode, Interface-SafeMode
            expect(result.harmonyScore).toBeLessThan(0.5);
        });
    });

    describe('易経的バランス検証テスト', () => {
        test('陰陽バランスの評価', () => {
            const balancedOS = {
                engineOS: { yinYangBalance: 0.6 }, // やや陽
                interfaceOS: { yinYangBalance: 0.4 }, // やや陰  
                safeModeOS: { yinYangBalance: 0.5 } // 中庸
            };

            const result = validator.validateYinYangHarmony(balancedOS);
            
            expect(result.overallBalance).toBeCloseTo(0.5, 1);
            expect(result.harmonyLevel).toBe('balanced');
            expect(result.recommendations).toHaveLength(0);
        });

        test('極端な陰陽不均衡の検知', () => {
            const unbalancedOS = {
                engineOS: { yinYangBalance: 0.9 }, // 極陽
                interfaceOS: { yinYangBalance: 0.1 }, // 極陰
                safeModeOS: { yinYangBalance: 0.9 } // 極陽
            };

            const result = validator.validateYinYangHarmony(unbalancedOS);
            
            expect(result.harmonyLevel).toBe('highly-unbalanced');
            expect(result.recommendations).toContain('moderate-yang-tendencies');
            expect(result.recommendations).toContain('strengthen-yin-aspects');
        });
    });
});