/**
 * ExpressionGenerator - 表現生成専門クラス
 * TripleOSInteractionAnalyzerから分離したリファクタリング版
 * 平野思想（分人概念）に基づく個人内側面の表現生成
 */

(function(global) {
    'use strict';

    class ExpressionGenerator {
        constructor(options = {}) {
            
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || window.seedableRandom || {
        next: () => 0.5,
        random: () => 0.5
    };
    this.version = '1.0';
            console.log('📝 ExpressionGenerator v1.0 initialized');
            
            // メモ化キャッシュ
            this._expressionCache = new Map();
            this._MAX_CACHE_SIZE = 100;
        }
        
        /**
         * OS の分人的特徴取得（エラーハンドリング付き）
         */
        getOSBunjinCharacteristics(osType) {
            try {
                const bunjinMap = {
                    'engine': {
                        bunjinNames: ['積極的な一面', '推進する自分', '挑戦する側面', 'リーダー気質の部分', '創造的な声'],
                        role: '内なる推進力・創造力を担当する側面',
                        voice: '「やってみよう」「進めよう」「作り出そう」という前向きな心の声'
                    },
                    'interface': {
                        bunjinNames: ['社交的な面', '協調する自分', '人と繋がる側面', 'コミュニケーター気質', '調和を大切にする声'],
                        role: '内なる社会性・対人関係を担当する側面',
                        voice: '「みんなで協力しよう」「関係を大切にしよう」という社会性を重視する心の声',
                        stressBehavior: '過度な気遣い、他人に合わせすぎ、自分を抑制'
                    },
                    'safe': {
                        bunjinNames: ['慎重な部分', '守る自分', '安全を確保する側面', '誠実な面', '安定を求める声'],
                        role: '内なる安全確保・リスク管理を担当する側面',
                        voice: '「よく考えよう」「安全を確保しよう」「無理をしないでおこう」という慎重な心の声',
                        stressBehavior: '過度な心配、行動制限、変化への抵抗、萎縮'
                    }
                };
                
                return bunjinMap[osType] || bunjinMap['engine'];
            } catch (error) {
                console.error('❌ OS characteristics error:', error);
                return {
                    bunjinNames: ['側面'],
                    role: '内なる側面',
                    voice: '心の声'
                };
            }
        }
        
        /**
         * OSペア固有の適切な表現生成
         */
        generateOSPairSpecificExpression(os1Type, os2Type, innerName1, innerName2) {
            try {
                const cacheKey = `pair_${os1Type}_${os2Type}_${innerName1}_${innerName2}`;
                if (this._expressionCache.has(cacheKey)) {
                    return this._expressionCache.get(cacheKey);
                }
                
                const pairKey = `${os1Type}-${os2Type}`;
                const pairTemplates = {
                    'engine-safe': [
                        `場面に応じて自分の中の${innerName1}と${innerName2}が適切に現れ、積極性と慎重さのバランスの取れた行動ができる`,
                        `必要な時に内なる${innerName1}と${innerName2}が自然に切り替わり、勇気と安全の両立を実現する`,
                        `心の中の${innerName1}と${innerName2}が状況によって自然に連携し、勇気と慎重さを併せ持った自分として行動する`,
                        `自分の中の${innerName1}と${innerName2}が有機的に連動し、挑戦と安定の調和した判断ができる`,
                        `場面に応じて${innerName1}と${innerName2}が適切に働き、推進力と安全性を両立させた選択ができる`
                    ],
                    'interface-safe': [
                        `状況に応じて自分の中の${innerName1}と${innerName2}が現れ、社会性と安定性のバランスの取れた関係作りができる`,
                        `必要な時に内なる${innerName1}と${innerName2}が協力し、人間関係の中で安心と信頼を両立する`,
                        `場面に応じて自分の中の${innerName1}と${innerName2}が適切に現れ、人間関係の中で安心と信頼を両立できる`,
                        `心の中の${innerName1}と${innerName2}が状況によって連携し、社会性を保ちながら自分を守ることができる`,
                        `自分の中の${innerName1}と${innerName2}が有機的に働き、人との繋がりと個人の安全を両立できる`
                    ],
                    'engine-interface': [
                        `必要な時に内なる${innerName1}や${innerName2}が前面に出て、状況に最適な推進力とコミュニケーション力を発揮する`,
                        `場面に応じて自分の中の${innerName1}と${innerName2}が協調し、リーダーシップと協調性を両立させる`,
                        `心の中の${innerName1}と${innerName2}が自然に連携し、行動力と社会性の調和した自分として振る舞える`,
                        `状況によって内なる${innerName1}と${innerName2}が適切に働き、実行力と調整力のバランスが取れる`,
                        `自分の中の${innerName1}と${innerName2}が有機的に協力し、推進と協調の最適な組み合わせを実現する`
                    ]
                };
                
                const templates = pairTemplates[pairKey];
                if (templates && templates.length > 0) {
                    const result = templates[Math.floor(this.rng.next() * templates.length)];
                    
                    // キャッシュ管理
                    if (this._expressionCache.size > this._MAX_CACHE_SIZE) {
                        const firstKey = this._expressionCache.keys().next().value;
                        this._expressionCache.delete(firstKey);
                    }
                    this._expressionCache.set(cacheKey, result);
                    
                    return result;
                }
                
                return null;
            } catch (error) {
                console.error('❌ OS pair expression generation error:', error);
                return null;
            }
        }
        
        /**
         * 調和型特殊表現の生成
         */
        generateBunjinHarmoniousExpression(os1Type, os2Type, harmoniousRelations) {
            try {
                const bunjin1 = this.getOSBunjinCharacteristics(os1Type);
                const bunjin2 = this.getOSBunjinCharacteristics(os2Type);
                
                const bunjinName1 = bunjin1.bunjinNames[Math.floor(this.rng.next() * bunjin1.bunjinNames.length)];
                const bunjinName2 = bunjin2.bunjinNames[Math.floor(this.rng.next() * bunjin2.bunjinNames.length)];
                
                // 1. OSペア固有テンプレート（最優先）
                const pairSpecificExpression = this.generateOSPairSpecificExpression(os1Type, os2Type, bunjinName1, bunjinName2);
                if (pairSpecificExpression) {
                    console.log(`💪 OSペアテンプレート使用`);
                    return pairSpecificExpression;
                }
                
                // 2. 易経的関係性による表現
                if (harmoniousRelations.ichingRelations && harmoniousRelations.ichingRelations.length > 0) {
                    const relation = harmoniousRelations.ichingRelations[0];
                    const expression = this.generateBunjinRelationshipExpression(relation.type, bunjinName1, bunjinName2);
                    console.log(`🔮 易経関係表現: ${relation.type}`);
                    return expression;
                }
                
                // 3. 微細差異による表現
                if (harmoniousRelations.subtleDifferences && harmoniousRelations.subtleDifferences.length > 0) {
                    const difference = harmoniousRelations.subtleDifferences[0];
                    const expression = this.generateBunjinDifferenceExpression(difference.type, bunjinName1, bunjinName2);
                    console.log(`🎭 微細差異表現: ${difference.type}`);
                    return expression;
                }
                
                // 4. フォールバック表現
                console.log(`🔄 フォールバック表現使用`);
                return `自分の中の${bunjinName1}と${bunjinName2}が場面に応じて自然に協力し、柔軟でバランスの取れた行動ができる`;
                
            } catch (error) {
                console.error('❌ Harmonious expression generation error:', error);
                return '内なる側面が調和して、バランスの取れた行動ができる';
            }
        }
        
        /**
         * 個人内視点での関係性表現
         */
        generateBunjinRelationshipExpression(relationType, bunjinName1, bunjinName2) {
            const templates = {
                'adjacent': `場面に応じて自分の中の${bunjinName1}と${bunjinName2}が自然に協力し、無理なく状況に適応していく`,
                'zong': `自分の中の${bunjinName1}と${bunjinName2}がお互いに影響し合いながら、バランスの取れた行動ができる`,
                'terminal': `心の中の${bunjinName1}と${bunjinName2}が相互に支え合って、継続的に成長していく力を発揮する`,
                'origin': `内なる${bunjinName1}と${bunjinName2}が深く協調して、状況に応じた独自の判断力を生み出す`
            };
            
            return templates[relationType] || templates['adjacent'];
        }
        
        /**
         * 個人内視点での微細差異表現
         */
        generateBunjinDifferenceExpression(differenceType, bunjinName1, bunjinName2) {
            const templates = {
                'cognitive_direction': `自分の中の${bunjinName1}と${bunjinName2}の考え方の違いが、場面に応じて柔軟で多角的な判断力を生み出す`,
                'emotional_texture': `心の中の${bunjinName1}と${bunjinName2}の感じ方の違いが、状況に応じて豊かで深みのある感情表現を可能にする`,
                'completion_phase': `内なる${bunjinName1}と${bunjinName2}の異なる成長段階が、場面に応じて継続的で持続的な発展を実現する`
            };
            
            return templates[differenceType] || templates['cognitive_direction'];
        }
        
        /**
         * キャッシュクリア
         */
        clearCache() {
            try {
                this._expressionCache.clear();
                console.log('✅ Expression cache cleared');
            } catch (error) {
                console.error('❌ Error clearing expression cache:', error);
            }
        }
        
        /**
         * キャッシュ統計
         */
        getCacheStatistics() {
            return {
                expressionCache: this._expressionCache.size,
                maxSize: this._MAX_CACHE_SIZE
            };
        }
    }
    
    // グローバル公開
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ExpressionGenerator;
    } else {
        global.ExpressionGenerator = ExpressionGenerator;
    }
    
})(typeof window !== 'undefined' ? window : global);