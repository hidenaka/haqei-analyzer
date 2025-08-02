/**
 * 🧪 HarmoniousTransitionManager テストスイート
 * 
 * bunenjin哲学統合テスト:
 * - Engine OS: データ保存の確実性テスト
 * - Interface OS: ユーザー体験のテスト
 * - Safe Mode OS: エラー回復のテスト
 * 
 * Tsumiki TDD標準: テストファースト実装
 */

describe('HarmoniousTransitionManager', () => {
    let transitionManager;
    let mockStorageManager;
    
    beforeEach(() => {
        // モックStorageManagerの設定
        mockStorageManager = {
            saveAnalysisResult: jest.fn().mockResolvedValue(true),
            saveInsights: jest.fn().mockResolvedValue(true),
            updateSession: jest.fn().mockResolvedValue(true),
            getAnalysisResult: jest.fn(),
            getInsights: jest.fn()
        };
        
        transitionManager = new HarmoniousTransitionManager(mockStorageManager);
    });

    describe('Engine OS（価値観・内的確実性）テスト', () => {
        test('データ保存の確実性を保証する', async () => {
            const mockResult = {
                engineOS: { values: ['test'] },
                interfaceOS: { socialPatterns: ['test'] },
                safeModeOS: { defensePatterns: ['test'] }
            };
            const mockInsights = { summary: 'test insights' };

            await transitionManager.executeHarmoniousTransition(mockResult, mockInsights);

            expect(mockStorageManager.saveAnalysisResult).toHaveBeenCalledWith(mockResult);
            expect(mockStorageManager.saveInsights).toHaveBeenCalledWith(mockInsights);
            expect(transitionManager.state).toBe('completed');
        });

        test('データ保存失敗時の適切なエラーハンドリング', async () => {
            mockStorageManager.saveAnalysisResult.mockRejectedValue(new Error('Storage failed'));
            
            const mockResult = { engineOS: {}, interfaceOS: {}, safeModeOS: {} };
            const mockInsights = {};

            await expect(transitionManager.executeHarmoniousTransition(mockResult, mockInsights))
                .rejects.toThrow('Storage failed');
            expect(transitionManager.state).toBe('error');
        });
    });

    describe('Interface OS（社会的・ユーザー体験）テスト', () => {
        test('状態変化イベントが適切に発火される', async () => {
            const stateChangeEvents = [];
            transitionManager.addEventListener('stateChanged', (e) => {
                stateChangeEvents.push(e.detail.state);
            });

            const mockResult = {
                engineOS: { values: ['test'] },
                interfaceOS: { socialPatterns: ['test'] },
                safeModeOS: { defensePatterns: ['test'] }
            };

            await transitionManager.executeHarmoniousTransition(mockResult, {});

            expect(stateChangeEvents).toEqual(['saving', 'validating', 'transitioning', 'completed']);
        });

        test('遷移プロセスの透明性確保', () => {
            expect(transitionManager.getCurrentState()).toBe('idle');
            expect(transitionManager.getTransitionProgress()).toEqual({
                currentStage: 'idle',
                completedStages: [],
                nextStage: 'saving'
            });
        });
    });

    describe('Safe Mode OS（防御・エラー回復）テスト', () => {
        test('部分的失敗時の回復メカニズム', async () => {
            mockStorageManager.saveInsights.mockRejectedValue(new Error('Insights save failed'));
            
            const mockResult = {
                engineOS: { values: ['test'] },
                interfaceOS: { socialPatterns: ['test'] },
                safeModeOS: { defensePatterns: ['test'] }
            };

            await expect(transitionManager.executeHarmoniousTransition(mockResult, {}))
                .rejects.toThrow('Insights save failed');
                
            // 分析結果は保存されているべき
            expect(mockStorageManager.saveAnalysisResult).toHaveBeenCalled();
            expect(transitionManager.getLastError()).toBeDefined();
        });

        test('不正なデータ構造の検知と拒否', async () => {
            const invalidResult = { invalidStructure: true };

            await expect(transitionManager.executeHarmoniousTransition(invalidResult, {}))
                .rejects.toThrow('Invalid Triple OS structure');
        });
    });

    describe('易経的変化プロセステスト', () => {
        test('四段階変化の正確な実行順序', async () => {
            const executionOrder = [];
            
            // 実行順序を記録するスパイ
            jest.spyOn(transitionManager, 'saveWithVerification').mockImplementation(async () => {
                executionOrder.push('save');
            });
            jest.spyOn(transitionManager, 'validateDataIntegrity').mockImplementation(async () => {
                executionOrder.push('validate');
            });
            jest.spyOn(transitionManager, 'executeTransition').mockImplementation(async () => {
                executionOrder.push('transition');
            });

            const mockResult = {
                engineOS: { values: ['test'] },
                interfaceOS: { socialPatterns: ['test'] },
                safeModeOS: { defensePatterns: ['test'] }
            };

            await transitionManager.executeHarmoniousTransition(mockResult, {});

            expect(executionOrder).toEqual(['save', 'validate', 'transition']);
        });
    });
});