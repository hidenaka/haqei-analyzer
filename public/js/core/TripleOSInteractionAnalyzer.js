/**
 * TripleOSInteractionAnalyzer - 修復版
 * 3つのOS（自我、超自我、エス）の相互作用を分析
 */

(function(global) {
    'use strict';

    class TripleOSInteractionAnalyzer {
        constructor() {
            this.version = '1.2';
            console.log('🔮 TripleOSInteractionAnalyzer v1.2 initialized');
            
            // 基本データの初期化
            this.interactionPatterns = this.initializeInteractionPatterns();
            this.hexagramCharacteristics = this.loadHexagramCharacteristics();
        }
        
        /**
         * インタラクションパターンの初期化
         */
        initializeInteractionPatterns() {
            return {
                harmonious: ['協調', '調和', '結合', '協力'],
                conflicting: ['対立', '競争', '分離', '緊張'],
                transformative: ['変化', '転換', '進化', '改革'],
                stable: ['安定', '維持', '継続', '保全']
            };
        }
        
        /**
         * 卦の特性データを読み込み
         */
        loadHexagramCharacteristics() {
            return {
                1: { name: '乾', keywords: ['創造', '天', '強健'] },
                2: { name: '坤', keywords: ['受容', '地', '柔順'] },
                3: { name: '屯', keywords: ['困難', '始まり', '蓄積'] },
                4: { name: '蒙', keywords: ['無知', '学習', '啓発'] }
            };
        }
        
        /**
         * 3つのOSの相互作用を分析
         */
        analyzeTripleOSInteraction(egoData, superEgoData, idData) {
            try {
                const interaction = {
                    ego: this.processOSData(egoData),
                    superEgo: this.processOSData(superEgoData),
                    id: this.processOSData(idData)
                };
                
                return {
                    interaction: interaction,
                    balance: this.calculateBalance(interaction),
                    recommendations: this.generateRecommendations(interaction)
                };
            } catch (error) {
                console.error('分析エラー:', error);
                return { error: error.message };
            }
        }
        
        /**
         * OSデータの処理
         */
        processOSData(data) {
            if (!data) return { strength: 0, keywords: [] };
            
            return {
                strength: data.strength || 0,
                keywords: data.keywords || [],
                characteristics: data.characteristics || []
            };
        }
        
        /**
         * バランスの計算
         */
        calculateBalance(interaction) {
            const egoStrength = interaction.ego.strength;
            const superEgoStrength = interaction.superEgo.strength;
            const idStrength = interaction.id.strength;
            
            const total = egoStrength + superEgoStrength + idStrength;
            if (total === 0) return { balanced: true, dominant: 'none' };
            
            const balance = {
                ego: egoStrength / total,
                superEgo: superEgoStrength / total,
                id: idStrength / total
            };
            
            const dominant = Object.keys(balance).reduce((a, b) => 
                balance[a] > balance[b] ? a : b
            );
            
            return {
                balance: balance,
                dominant: dominant,
                balanced: Math.abs(balance.ego - 0.33) < 0.1 && 
                         Math.abs(balance.superEgo - 0.33) < 0.1 && 
                         Math.abs(balance.id - 0.33) < 0.1
            };
        }
        
        /**
         * 推奨事項の生成
         */
        generateRecommendations(interaction) {
            const recommendations = [];
            
            if (interaction.ego.strength > 0.5) {
                recommendations.push('自我が強すぎます。他者との協調を意識してください。');
            }
            
            if (interaction.superEgo.strength > 0.5) {
                recommendations.push('超自我が強すぎます。もう少し自由な発想を取り入れてください。');
            }
            
            if (interaction.id.strength > 0.5) {
                recommendations.push('エスが強すぎます。理性的な判断を心がけてください。');
            }
            
            if (recommendations.length === 0) {
                recommendations.push('バランスが取れています。現在の状態を維持してください。');
            }
            
            return recommendations;
        }
        
        /**
         * メイン分析メソッド（v2要件準拠）
         */
        analyze(engineOS, interfaceOS, safeModeOS) {
            try {
                // 入力検証
                if (!engineOS || !interfaceOS || !safeModeOS) {
                    throw new Error('Invalid OS input parameters');
                }
                
                const result = {
                    version: this.version,
                    engine_os: {
                        id: engineOS.hexagramId || 1,
                        name: engineOS.name || '乾為天',
                        score: engineOS.score || 0.5
                    },
                    interface_os: {
                        id: interfaceOS.hexagramId || 2,
                        name: interfaceOS.name || '坤為地',
                        score: interfaceOS.score || 0.5
                    },
                    safe_mode_os: {
                        id: safeModeOS.hexagramId || 29,
                        name: safeModeOS.name || '坎為水',
                        score: safeModeOS.score || 0.5
                    },
                    synergy: this.calculateSynergy(engineOS, interfaceOS, safeModeOS),
                    interactions: this.generateInteractions(engineOS, interfaceOS, safeModeOS),
                    strengths: this.generateStrengths(engineOS, interfaceOS, safeModeOS),
                    risks: this.generateRisks(engineOS, interfaceOS, safeModeOS)
                };
                
                return result;
            } catch (error) {
                console.error('❌ Analysis error:', error);
                return this.getDefaultAnalysisResult(engineOS, interfaceOS, safeModeOS);
            }
        }
        
        /**
         * callメソッド（analyzeのエイリアス）
         */
        call(engineOS, interfaceOS, safeModeOS) {
            return this.analyze(engineOS, interfaceOS, safeModeOS);
        }
        
        /**
         * シナジー計算
         */
        calculateSynergy(engineOS, interfaceOS, safeModeOS) {
            const engineScore = engineOS.score || 0.5;
            const interfaceScore = interfaceOS.score || 0.5;
            const safeModeScore = safeModeOS.score || 0.5;
            
            return {
                engine_interface: (engineScore + interfaceScore) / 2,
                engine_safemode: (engineScore + safeModeScore) / 2,
                interface_safemode: (interfaceScore + safeModeScore) / 2,
                overall: (engineScore + interfaceScore + safeModeScore) / 3
            };
        }
        
        /**
         * 相互作用の生成
         */
        generateInteractions(engineOS, interfaceOS, safeModeOS) {
            return {
                engine_interface: `${engineOS.name || '内的動機'}と${interfaceOS.name || '社会性'}の相互作用により、創造的なエネルギーが生まれます。`,
                engine_safemode: `${engineOS.name || '内的動機'}と${safeModeOS.name || '安定性'}のバランスにより、持続可能な成長が期待できます。`,
                interface_safemode: `${interfaceOS.name || '社会性'}と${safeModeOS.name || '安定性'}の組み合わせにより、信頼関係の構築が促進されます。`
            };
        }
        
        /**
         * 強みの生成
         */
        generateStrengths(engineOS, interfaceOS, safeModeOS) {
            const strengths = [];
            
            if (engineOS.score > 0.6) {
                strengths.push('強い内的動機と創造性');
            }
            if (interfaceOS.score > 0.6) {
                strengths.push('優れた社会的適応能力');
            }
            if (safeModeOS.score > 0.6) {
                strengths.push('高い安定性と信頼性');
            }
            
            return strengths.length > 0 ? strengths : ['バランスの取れた総合力'];
        }
        
        /**
         * リスクの生成
         */
        generateRisks(engineOS, interfaceOS, safeModeOS) {
            const risks = [];
            
            if (engineOS.score < 0.3) {
                risks.push('内的動機の不足');
            }
            if (interfaceOS.score < 0.3) {
                risks.push('社会的適応の困難');
            }
            if (safeModeOS.score < 0.3) {
                risks.push('安定性の欠如');
            }
            
            return risks.length > 0 ? risks : ['特に大きなリスクは見当たりません'];
        }
        
        /**
         * デフォルト分析結果
         */
        getDefaultAnalysisResult(engineOS, interfaceOS, safeModeOS) {
            return {
                version: this.version,
                engine_os: {
                    id: (engineOS && engineOS.hexagramId) || 1,
                    name: (engineOS && engineOS.name) || '乾為天',
                    score: (engineOS && engineOS.score) || 0.5
                },
                interface_os: {
                    id: (interfaceOS && interfaceOS.hexagramId) || 2,
                    name: (interfaceOS && interfaceOS.name) || '坤為地',
                    score: (interfaceOS && interfaceOS.score) || 0.5
                },
                safe_mode_os: {
                    id: (safeModeOS && safeModeOS.hexagramId) || 29,
                    name: (safeModeOS && safeModeOS.name) || '坎為水',
                    score: (safeModeOS && safeModeOS.score) || 0.5
                },
                synergy: {
                    engine_interface: 0.5,
                    engine_safemode: 0.5,
                    interface_safemode: 0.5,
                    overall: 0.5
                },
                interactions: {
                    engine_interface: '分析中にエラーが発生しました。',
                    engine_safemode: '分析中にエラーが発生しました。',
                    interface_safemode: '分析中にエラーが発生しました。'
                },
                strengths: ['基本的な機能は維持されています'],
                risks: ['分析エラーが発生しました']
            };
        }
        
        /**
         * バージョン情報の取得
         */
        getVersion() {
            return this.version;
        }
    }
    
    // グローバル登録
    global.TripleOSInteractionAnalyzer = TripleOSInteractionAnalyzer;
    
    // Node.js環境での対応
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TripleOSInteractionAnalyzer;
    }
    
})(typeof window !== 'undefined' ? window : this);