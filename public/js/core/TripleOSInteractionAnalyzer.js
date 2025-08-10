/**
 * TripleOSInteractionAnalyzer - v2要件準拠
 * OS Analyzer: 64卦で"関係の型" + 3OS相互作用（強み/弱み/葛藤/統合ヒント）を記述
 * 変化は扱わない、型と相互作用による豊かさの言語化に集中
 */

(function(global) {
    'use strict';

    class TripleOSInteractionAnalyzer {
        constructor() {
            this.version = '1.1'; // 契約A v1.1準拠
            console.log('🔮 TripleOSInteractionAnalyzer v1.1 initialized');
            
            // 64卦の相互作用パターンDB
            this.interactionPatterns = this.initializeInteractionPatterns();
            
            // 64卦の特徴データ
            this.hexagramCharacteristics = this.loadHexagramCharacteristics();
        }

        /**
         * 契約A v1.1形式の完全な分析結果を生成
         */
        analyze(engineOS, interfaceOS, safeModeOS) {
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
                strengths: this.identifyStrengths(engineOS, interfaceOS, safeModeOS),
                risks: this.identifyRisks(engineOS, interfaceOS, safeModeOS),
                created_at: new Date().toISOString()
            };

            return result;
        }

        /**
         * 3OS間のシナジーマトリックス計算
         */
        calculateSynergy(engineOS, interfaceOS, safeModeOS) {
            const matrix = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];

            // Engine-Interface相互作用
            matrix[0][1] = matrix[1][0] = this.calculatePairSynergy(engineOS, interfaceOS, 'engine-interface');
            
            // Engine-SafeMode相互作用
            matrix[0][2] = matrix[2][0] = this.calculatePairSynergy(engineOS, safeModeOS, 'engine-safe');
            
            // Interface-SafeMode相互作用
            matrix[1][2] = matrix[2][1] = this.calculatePairSynergy(interfaceOS, safeModeOS, 'interface-safe');

            const notes = this.generateSynergyNotes(engineOS, interfaceOS, safeModeOS, matrix);

            return { matrix, notes };
        }

        /**
         * ペア間のシナジー計算
         */
        calculatePairSynergy(os1, os2, pairType = 'unknown') {
            const id1 = os1.hexagramId || 1;
            const id2 = os2.hexagramId || 1;
            const char1 = this.getHexagramCharacteristics(id1);
            const char2 = this.getHexagramCharacteristics(id2);
            
            // 0. 同一卦の場合は役割別に判定
            if (id1 === id2) {
                return this.analyzeSameHexagram(char1, pairType);
            }
            
            // 1. キーワードの意味的類似性を最優先（実際の相性）
            const keywordSynergy = this.calculateKeywordSynergy(char1.keywords, char2.keywords);
            if (keywordSynergy >= 0.7) return keywordSynergy; // 高い意味的相乗効果
            
            // 2. エネルギーパターンの相性
            const energyCompatibility = this.calculateEnergyCompatibility(char1.energy, char2.energy);
            if (energyCompatibility >= 0.6) return energyCompatibility; // エネルギーレベルで相乗効果
            
            // 3. OS間の関係性を考慮した判定
            if (pairType === 'engine-interface') {
                // 実行系：似た方向性が効率的
                if (this.haveSimilarDirection(char1, char2)) return 0.5;
            } else if (pairType === 'engine-safe') {
                // 安全網：補完関係が機能（ただし心理的負担もチェック）
                if (this.isHealthyComplement(char1, char2)) return 0.4;
                if (this.isStressfulComplement(char1, char2)) return -0.3; // しんどい補完関係
            } else if (pairType === 'interface-safe') {
                // 調整：バランスが重要
                if (this.isWellBalanced(char1, char2)) return 0.3;
            }
            
            // 4. 綜卦関係の慎重な判定（個別分析）
            if (this.isMutualHexagram(id1, id2)) {
                // 綜卦関係でも実際の相性をチェック
                if (this.isStressfulComplement(char1, char2)) return -0.2; // しんどい綜卦
                return 0.4; // 理論的補完（控えめ評価）
            }
            
            // 5. 隣接卦関係（自然な流れ）
            const diff = Math.abs(id1 - id2);
            if (diff === 1) return 0.3; // 隣接卦は調和的
            
            // 6. 錯卦関係（対極的だが創造的緊張）
            if (this.isOppositeHexagram(id1, id2)) return -0.1; // 軽い緊張
            
            // 7. エネルギーパターンの衝突
            if (this.areEnergyConflicting(char1.energy, char2.energy)) return -0.2;
            
            // 8. 強みと弱みの相互作用
            const strengthWeaknessInteraction = this.analyzeStrengthWeaknessInteraction(char1, char2);
            if (strengthWeaknessInteraction !== 0) return strengthWeaknessInteraction;
            
            // 9. デフォルト（中立的関係）
            return 0.0;
        }

        /**
         * v2要件準拠：相互作用の豊かさを言語化
         */
        generateInteractions(engineOS, interfaceOS, safeModeOS) {
            return {
                pair_insights: [
                    this.analyzePair('engine-interface', engineOS, interfaceOS),
                    this.analyzePair('engine-safe', engineOS, safeModeOS),
                    this.analyzePair('interface-safe', interfaceOS, safeModeOS)
                ],
                affordances: this.generateAffordances(engineOS, interfaceOS, safeModeOS),
                inner_conflicts: this.identifyInnerConflicts(engineOS, interfaceOS, safeModeOS),
                integration_prompts: this.generateIntegrationPrompts(engineOS, interfaceOS, safeModeOS)
            };
        }

        /**
         * ペア分析
         */
        analyzePair(pairName, os1, os2) {
            const synergy = this.calculatePairSynergy(os1, os2, pairName);
            let category = 'HARMONY';
            
            if (synergy >= 0.6) category = 'SYNERGY';
            else if (synergy >= 0.2) category = 'HARMONY';
            else if (synergy >= -0.2) category = 'TENSION';
            else category = 'CONFLICT';

            const summary = this.generatePairSummary(os1, os2, category, pairName);

            return {
                pair: pairName,
                category,
                score: Math.abs(synergy),
                synergy: synergy,  // 追加: 数値のシナジー値
                summary
            };
        }

        /**
         * アフォーダンス（強み/弱みが出るインターフェース）
         * 64卦の特徴を活用した動的生成
         */
        generateAffordances(engineOS, interfaceOS, safeModeOS) {
            const engineChar = this.getHexagramCharacteristics(engineOS.hexagramId);
            const interfaceChar = this.getHexagramCharacteristics(interfaceOS.hexagramId);
            const safeChar = this.getHexagramCharacteristics(safeModeOS.hexagramId);
            
            return {
                engine: {
                    thrives_with: [
                        `${interfaceChar.keywords[0] || interfaceChar.strength}が活きる環境での${engineChar.strength}の発揮`,
                        `${safeChar.keywords[1] || safeChar.keywords[0] || safeChar.strength}による${engineChar.keywords[0] || engineChar.strength}の洗練`,
                        `${engineChar.energy}が最大化される自由と規律のバランス`
                    ],
                    struggles_with: [
                        `${engineChar.weakness}が露呈する${interfaceChar.weakness}的状況`,
                        `${safeChar.energy}による${engineChar.keywords[1] || engineChar.keywords[0] || engineChar.strength}の抑制`,
                        `${engineChar.keywords[2] || engineChar.keywords[1] || engineChar.keywords[0] || engineChar.strength}を阻害する過度な${safeChar.keywords[0] || safeChar.strength}`
                    ]
                },
                interface: {
                    thrives_with: [
                        `${interfaceChar.strength}を活かした${engineChar.keywords[0] || engineChar.strength}と${safeChar.keywords[0] || safeChar.strength}の調整`,
                        `${interfaceChar.keywords[1] || interfaceChar.keywords[0] || interfaceChar.strength}による組織全体の${interfaceChar.keywords[2] || interfaceChar.keywords[1] || interfaceChar.keywords[0] || interfaceChar.strength}促進`,
                        `${interfaceChar.energy}が評価される協調的環境`
                    ],
                    struggles_with: [
                        `${interfaceChar.weakness}により${engineChar.strength}が発揮できない場面`,
                        `${interfaceChar.keywords[0] || interfaceChar.strength}と${safeChar.keywords[1] || safeChar.keywords[0] || safeChar.strength}の矛盾による混乱`,
                        `${engineChar.energy}との不協和による${interfaceChar.keywords[2] || interfaceChar.keywords[1] || interfaceChar.keywords[0] || interfaceChar.strength}の低下`
                    ]
                },
                safe: {
                    thrives_with: [
                        `${safeChar.strength}による${engineChar.keywords[2] || engineChar.keywords[1] || engineChar.keywords[0] || engineChar.strength}の安定化`,
                        `${safeChar.keywords[0] || safeChar.strength}が必要な長期的${safeChar.keywords[1] || safeChar.keywords[0] || safeChar.strength}の確保`,
                        `${safeChar.energy}による${engineChar.weakness}の抑制効果`
                    ],
                    struggles_with: [
                        `${safeChar.weakness}による${engineChar.keywords[0] || engineChar.strength}の停滞`,
                        `${interfaceChar.energy}との不調和による${safeChar.keywords[2] || safeChar.keywords[1] || safeChar.keywords[0] || safeChar.strength}の混乱`,
                        `${safeChar.keywords[1] || safeChar.keywords[0] || safeChar.strength}への固執による機会損失`
                    ]
                }
            };
        }

        /**
         * 内的葛藤の特定（64卦の特徴に基づく）
         */
        identifyInnerConflicts(engineOS, interfaceOS, safeModeOS) {
            const engineChar = this.getHexagramCharacteristics(engineOS.hexagramId);
            const interfaceChar = this.getHexagramCharacteristics(interfaceOS.hexagramId);
            const safeChar = this.getHexagramCharacteristics(safeModeOS.hexagramId);
            
            const conflicts = [];
            
            // 64卦の特徴に基づく葛藤生成
            conflicts.push(`${engineChar.name}の「${engineChar.keywords[0] || engineChar.strength}」と${safeChar.name}の「${safeChar.keywords[0] || safeChar.strength}」の間で生じる${this.generateConflictTheme(engineChar, safeChar)}`);
            conflicts.push(`${interfaceChar.name}の「${interfaceChar.strength}」が、${engineChar.keywords[1] || engineChar.keywords[0] || engineChar.strength}と${safeChar.keywords[1] || safeChar.keywords[0] || safeChar.strength}の両立を困難にする葛藤`);
            conflicts.push(`${engineChar.energy}、${interfaceChar.energy}、${safeChar.energy}の３つのエネルギーパターンの不協和`);
            
            // 価値観の優先順位
            conflicts.push('成果・調和・安全の価値観が衝突する場面での優先順位付けの葛藤');
            
            // 追加の葛藤パターン
            const additionalConflicts = this.identifyAdditionalConflicts(engineOS, interfaceOS, safeModeOS);
            conflicts.push(...additionalConflicts);

            return conflicts;
        }
        
        /**
         * 追加の葛藤パターン特定
         */
        identifyAdditionalConflicts(engineOS, interfaceOS, safeModeOS) {
            const conflicts = [];
            
            // スコアベースの葛藤
            if (Math.abs(engineOS.score - interfaceOS.score) > 0.3) {
                conflicts.push('内的動機と外的表現のバランスに関する継続的な調整の葛藤');
            }
            
            return conflicts;
        }

        /**
         * 統合のヒント（64卦の特徴を活用）
         */
        generateIntegrationPrompts(engineOS, interfaceOS, safeModeOS) {
            const engineChar = this.getHexagramCharacteristics(engineOS.hexagramId);
            const interfaceChar = this.getHexagramCharacteristics(interfaceOS.hexagramId);
            const safeChar = this.getHexagramCharacteristics(safeModeOS.hexagramId);
            
            const prompts = [];

            // 強みを活かす問い
            prompts.push(`あなたの${engineChar.name}が持つ「${engineChar.strength}」を最大化するには、どんな${engineChar.keywords[2] || engineChar.keywords[1] || engineChar.keywords[0] || engineChar.strength}的環境が必要ですか？`);
            
            // バランスを探る問い
            prompts.push(`${interfaceChar.name}の「${interfaceChar.keywords[0] || interfaceChar.strength}」と${engineChar.name}の「${engineChar.keywords[0] || engineChar.strength}」をシナジーさせる具体的方法は？`);
            
            // 葛藤を統合する問い
            prompts.push(`${safeChar.name}の「${safeChar.strength}」を活かしつつ、${safeChar.weakness}を克服するにはどんな工夫ができますか？`);
            
            // 具体的な実践
            prompts.push('3つのOSそれぞれが最も活きる「時間帯」「場所」「相手」を明確にできますか？');
            
            // 成長の方向性
            const growthDirection = this.suggestGrowthDirection(engineOS, interfaceOS, safeModeOS);
            prompts.push(growthDirection);

            return prompts;
        }

        /**
         * 強みの特定
         */
        identifyStrengths(engineOS, interfaceOS, safeModeOS) {
            const strengths = [];
            
            // 基本的な強み
            strengths.push(`${engineOS.name}による明確な推進力と方向性`);
            strengths.push(`${interfaceOS.name}による柔軟な対人調整能力`);
            strengths.push(`${safeModeOS.name}によるリスク管理と品質保証`);
            
            // 相乗効果による強み
            const synergy = this.calculateTotalSynergy(engineOS, interfaceOS, safeModeOS);
            if (synergy > 0.6) {
                strengths.push('3OS間の高い相乗効果による統合的判断力');
            }
            
            // 特殊な組み合わせによる強み
            const specialStrength = this.identifySpecialCombination(engineOS, interfaceOS, safeModeOS);
            if (specialStrength) {
                strengths.push(specialStrength);
            }

            return strengths;
        }

        /**
         * リスクの特定
         */
        identifyRisks(engineOS, interfaceOS, safeModeOS) {
            const risks = [];
            
            // 基本的なリスク
            risks.push(`${engineOS.name}の過度な推進による燃え尽きリスク`);
            risks.push(`${interfaceOS.name}の調和重視による決断遅延リスク`);
            risks.push(`${safeModeOS.name}の慎重さによる機会損失リスク`);
            
            // 相互作用によるリスク
            const conflictLevel = this.calculateConflictLevel(engineOS, interfaceOS, safeModeOS);
            if (conflictLevel > 0.5) {
                risks.push('OS間の葛藤による意思決定の停滞リスク');
            }
            
            // バランスの偏り
            const imbalance = this.checkImbalance(engineOS, interfaceOS, safeModeOS);
            if (imbalance) {
                risks.push(imbalance);
            }

            return risks;
        }

        // ========== ヘルパーメソッド ==========

        /**
         * 64卦の特徴データベースを読み込み
         * H384データベースから抽出した全64卦の特徴を完全に定義
         */
        loadHexagramCharacteristics() {
            // 全64卦の本質的な特徴をキーワードベースで定義
            const characteristics = {
                1: { // 乾為天
                    name: '乾為天',
                    keywords: ['創造力', 'リーダーシップ', '強い推進力', '天の力'],
                    strength: '決断力と実行力',
                    weakness: '傲慢になりやすい',
                    energy: '陽的・積極的・上昇志向'
                },
                2: { // 坤為地
                    name: '坤為地',
                    keywords: ['受容性', '包容力', '柔軟性', '大地の徳'],
                    strength: '調和と協調',
                    weakness: '主体性の欠如',
                    energy: '陰的・受動的・安定志向'
                },
                3: { // 水雷屯
                    name: '水雷屯',
                    keywords: ['始動', '困難克服', '創業の苦労', '潜在力'],
                    strength: '困難を乗り越える力',
                    weakness: '準備不足による混乱',
                    energy: '動的・挑戦的・成長志向'
                },
                4: { // 山水蒙
                    name: '山水蒙',
                    keywords: ['教育', '学習', '啓発', '指導'],
                    strength: '知識の蓄積と伝授',
                    weakness: '経験不足による判断ミス',
                    energy: '学習的・成長的・受容志向'
                },
                5: { // 水天需
                    name: '水天需',
                    keywords: ['待機', '忍耐', '準備', '時機到来'],
                    strength: '適切なタイミングを待つ力',
                    weakness: '行動の遅れによる機会損失',
                    energy: '待機的・忍耐的・準備志向'
                },
                6: { // 天水訟
                    name: '天水訟',
                    keywords: ['争議', '対立', '法的解決', '正義'],
                    strength: '公正な解決を求める力',
                    weakness: '対立の長期化',
                    energy: '対立的・競争的・正義志向'
                },
                7: { // 地水師
                    name: '地水師',
                    keywords: ['組織', '統率', '軍事', '規律'],
                    strength: '組織的行動力',
                    weakness: '硬直化による柔軟性の欠如',
                    energy: '統制的・組織的・規律志向'
                },
                8: { // 水地比
                    name: '水地比',
                    keywords: ['親和', '協調', '団結', '相互支援'],
                    strength: '協力関係の構築',
                    weakness: '依存関係による自立性の欠如',
                    energy: '協調的・親和的・団結志向'
                },
                9: { // 風天小畜
                    name: '風天小畜',
                    keywords: ['小さな蓄積', '準備', '柔軟性', '調整'],
                    strength: '細かな配慮と調整力',
                    weakness: '小規模すぎる対応',
                    energy: '蓄積的・調整的・柔軟志向'
                },
                10: { // 天沢履
                    name: '天沢履',
                    keywords: ['礼儀', '慎重', '品格', '正道'],
                    strength: '品格のある行動',
                    weakness: '過度の慎重さによる停滞',
                    energy: '品格的・慎重的・正道志向'
                },
                11: { // 地天泰
                    name: '地天泰',
                    keywords: ['調和', '交流', '平和', '繁栄'],
                    strength: '上下の円滑な交流',
                    weakness: '現状への慢心',
                    energy: '調和的・交流的・統合志向'
                },
                12: { // 天地否
                    name: '天地否',
                    keywords: ['閉塞', '停滞', '断絶', '変革の必要'],
                    strength: '現状打破の力',
                    weakness: 'コミュニケーション不全',
                    energy: '分離的・内向的・変革志向'
                },
                13: { // 天火同人
                    name: '天火同人',
                    keywords: ['協力', '同志', '公明正大', '団結'],
                    strength: '公正な協力関係の構築',
                    weakness: '内輪意識による排他性',
                    energy: '協力的・公正的・団結志向'
                },
                14: { // 火天大有
                    name: '火天大有',
                    keywords: ['豊かさ', '成功', '繁栄', '統合'],
                    strength: '豊かな資源の効果的活用',
                    weakness: '成功による慢心',
                    energy: '豊饒的・成功的・統合志向'
                },
                15: { // 地山謙
                    name: '地山謙',
                    keywords: ['謙遜', '低姿勢', '美徳', '尊敬'],
                    strength: '謙虚さによる信頼獲得',
                    weakness: '自己主張の不足',
                    energy: '謙遜的・受容的・美徳志向'
                },
                16: { // 雷地豫
                    name: '雷地豫',
                    keywords: ['喜び', '活気', '準備', '楽観'],
                    strength: '前向きな活力',
                    weakness: '油断による準備不足',
                    energy: '活発的・楽観的・準備志向'
                },
                17: { // 沢雷随
                    name: '沢雷随',
                    keywords: ['追随', '柔軟性', '適応', '変化対応'],
                    strength: '変化への柔軟な適応力',
                    weakness: '主体性の欠如',
                    energy: '適応的・柔軟的・追随志向'
                },
                18: { // 山風蠱
                    name: '山風蠱',
                    keywords: ['腐敗', '改革', '再生', '刷新'],
                    strength: '問題解決と改革力',
                    weakness: '改革の困難さ',
                    energy: '改革的・再生的・刷新志向'
                },
                19: { // 地沢臨
                    name: '地沢臨',
                    keywords: ['接近', '指導', '温情', '包容'],
                    strength: '温かい指導力',
                    weakness: '甘さによる甘えの誘発',
                    energy: '指導的・温情的・包容志向'
                },
                20: { // 風地観
                    name: '風地観',
                    keywords: ['観察', '洞察', '理解', '客観性'],
                    strength: '深い洞察力',
                    weakness: '行動力の不足',
                    energy: '観察的・洞察的・客観志向'
                },
                21: { // 火雷噬嗑
                    name: '火雷噬嗑',
                    keywords: ['決断', '処断', '除去', '解決'],
                    strength: '問題の根本解決力',
                    weakness: '強硬すぎる処断',
                    energy: '決断的・処断的・解決志向'
                },
                22: { // 山火賁
                    name: '山火賁',
                    keywords: ['装飾', '美化', '文化', '優雅'],
                    strength: '美的センスと表現力',
                    weakness: '外見重視による本質軽視',
                    energy: '美的・文化的・装飾志向'
                },
                23: { // 山地剝
                    name: '山地剝',
                    keywords: ['剥落', '衰退', '侵食', '忍耐'],
                    strength: '困難な状況での忍耐力',
                    weakness: '衰退への無力感',
                    energy: '忍耐的・受動的・防御志向'
                },
                24: { // 地雷復
                    name: '地雷復',
                    keywords: ['復活', '回復', '再生', '希望'],
                    strength: '復活と再生の力',
                    weakness: '回復の遅さ',
                    energy: '復活的・再生的・希望志向'
                },
                25: { // 天雷无妄
                    name: '天雷无妄',
                    keywords: ['純真', '自然', '無邪気', '天真'],
                    strength: '純粋で自然な行動力',
                    weakness: '世間知らずによる失敗',
                    energy: '純真的・自然的・無邪気志向'
                },
                26: { // 山天大畜
                    name: '山天大畜',
                    keywords: ['蓄積', '抑制', '準備', '力の貯蓄'],
                    strength: '大きな力の蓄積能力',
                    weakness: '行動の遅れ',
                    energy: '蓄積的・抑制的・準備志向'
                },
                27: { // 山雷頤
                    name: '山雷頤',
                    keywords: ['養育', '栄養', '自制', '節制'],
                    strength: '適切な養育と自制力',
                    weakness: '過度の制限による停滞',
                    energy: '養育的・節制的・自制志向'
                },
                28: { // 沢風大過
                    name: '沢風大過',
                    keywords: ['過度', '危険', '重荷', '極限'],
                    strength: '極限状況での対応力',
                    weakness: '過度による破綻リスク',
                    energy: '極限的・危険的・過度志向'
                },
                29: { // 坎為水
                    name: '坎為水',
                    keywords: ['深い洞察', '危機管理', '慎重さ', '内省'],
                    strength: 'リスク察知能力',
                    weakness: '過度の悲観',
                    energy: '流動的・適応的・深層志向'
                },
                30: { // 離為火
                    name: '離為火',
                    keywords: ['明晰性', '情熱', '照明', '文明'],
                    strength: '物事を明るく照らす',
                    weakness: '燃え尽きやすい',
                    energy: '発散的・照明的・外向志向'
                },
                31: { // 沢山咸
                    name: '沢山咸',
                    keywords: ['感応', '共鳴', '相互影響', '感受性'],
                    strength: '他者との深い共感',
                    weakness: '過度の感情移入',
                    energy: '共鳴的・感応的・相互志向'
                },
                32: { // 雷風恒
                    name: '雷風恒',
                    keywords: ['持続', '継続', '不変', '永続'],
                    strength: '持続的な努力',
                    weakness: '変化への対応不足',
                    energy: '持続的・継続的・恒常志向'
                },
                33: { // 天山遯
                    name: '天山遯',
                    keywords: ['退避', '戦略的撤退', '保身', '時機待ち'],
                    strength: '適切な退き際の判断',
                    weakness: '消極的すぎる姿勢',
                    energy: '退避的・保守的・待機志向'
                },
                34: { // 雷天大壮
                    name: '雷天大壮',
                    keywords: ['強大', '威力', '勇猛', '積極性'],
                    strength: '強力な行動力',
                    weakness: '勇み足による失敗',
                    energy: '強力的・積極的・勇猛志向'
                },
                35: { // 火地晋
                    name: '火地晋',
                    keywords: ['進歩', '昇進', '向上', '発展'],
                    strength: '着実な進歩力',
                    weakness: '急ぎすぎによる失敗',
                    energy: '進歩的・向上的・発展志向'
                },
                36: { // 地火明夷
                    name: '地火明夷',
                    keywords: ['困難', '暗黒', '忍耐', '潜伏'],
                    strength: '困難な状況での忍耐力',
                    weakness: '消極的な姿勢',
                    energy: '潜伏的・忍耐的・内向志向'
                },
                37: { // 風火家人
                    name: '風火家人',
                    keywords: ['家族', '調和', '秩序', '親和'],
                    strength: '家庭的な調和力',
                    weakness: '内向きすぎる視点',
                    energy: '家庭的・調和的・親和志向'
                },
                38: { // 火沢睽
                    name: '火沢睽',
                    keywords: ['対立', '反目', '矛盾', '不和'],
                    strength: '対立を通じた成長',
                    weakness: '関係性の悪化',
                    energy: '対立的・矛盾的・分離志向'
                },
                39: { // 水山蹇
                    name: '水山蹇',
                    keywords: ['困難', '障害', '停滞', '忍耐'],
                    strength: '困難に耐える力',
                    weakness: '前進の困難',
                    energy: '停滞的・忍耐的・内省志向'
                },
                40: { // 雷水解
                    name: '雷水解',
                    keywords: ['解決', '解放', '緩和', '開放'],
                    strength: '問題解決力',
                    weakness: '解決後の気の緩み',
                    energy: '解決的・開放的・緩和志向'
                },
                41: { // 山沢損
                    name: '山沢損',
                    keywords: ['謙遜', '削減', '本質への集中', '無駄の排除'],
                    strength: '本質を見極める力',
                    weakness: '自己犠牲の過多',
                    energy: '削減的・本質的・内向志向'
                },
                42: { // 風雷益
                    name: '風雷益',
                    keywords: ['利益', '増進', '成長', '発展'],
                    strength: '相互利益の創造',
                    weakness: '利益追求の偏重',
                    energy: '増進的・成長的・発展志向'
                },
                43: { // 沢天夬
                    name: '沢天夬',
                    keywords: ['決断', '排除', '除去', '断絶'],
                    strength: '明確な決断力',
                    weakness: '性急すぎる判断',
                    energy: '決断的・排除的・断絶志向'
                },
                44: { // 天風姤
                    name: '天風姤',
                    keywords: ['遭遇', '邂逅', '偶然', '出会い'],
                    strength: '新しい出会いの力',
                    weakness: '予期しない困難',
                    energy: '遭遇的・偶然的・出会い志向'
                },
                45: { // 沢地萃
                    name: '沢地萃',
                    keywords: ['集合', '結集', '統合', '団結'],
                    strength: '集団統合力',
                    weakness: '統率の困難',
                    energy: '集合的・統合的・団結志向'
                },
                46: { // 地風升
                    name: '地風升',
                    keywords: ['上昇', '成長', '発達', '向上'],
                    strength: '着実な成長力',
                    weakness: '成長の鈍化',
                    energy: '上昇的・成長的・向上志向'
                },
                47: { // 沢水困
                    name: '沢水困',
                    keywords: ['困窮', '窮地', '制約', '限界'],
                    strength: '困窮での創意工夫',
                    weakness: '資源不足による制約',
                    energy: '困窮的・制約的・限界志向'
                },
                48: { // 水風井
                    name: '水風井',
                    keywords: ['源泉', '供給', '安定', '恒常性'],
                    strength: '安定した供給力',
                    weakness: '変化への対応不足',
                    energy: '源泉的・供給的・安定志向'
                },
                49: { // 沢火革
                    name: '沢火革',
                    keywords: ['革命', '変革', '改革', '刷新'],
                    strength: '革新的変革力',
                    weakness: '変革による混乱',
                    energy: '革新的・変革的・刷新志向'
                },
                50: { // 火風鼎
                    name: '火風鼎',
                    keywords: ['確立', '完成', '安定', '統治'],
                    strength: '安定した統治力',
                    weakness: '保守的すぎる姿勢',
                    energy: '確立的・完成的・統治志向'
                },
                51: { // 震為雷
                    name: '震為雷',
                    keywords: ['衝撃', '活動', '動揺', '刺激'],
                    strength: '強力な活動力',
                    weakness: '衝動的な行動',
                    energy: '衝撃的・活動的・刺激志向'
                },
                52: { // 艮為山
                    name: '艮為山',
                    keywords: ['静止', '瞑想', '不動', '安定'],
                    strength: '揺るぎない安定性',
                    weakness: '変化への抵抗',
                    energy: '静的・不動的・瞑想志向'
                },
                53: { // 風山漸
                    name: '風山漸',
                    keywords: ['漸進', '段階的', '着実', '穏健'],
                    strength: '着実な段階的進歩',
                    weakness: '進歩の遅さ',
                    energy: '漸進的・段階的・穏健志向'
                },
                54: { // 雷沢帰妹
                    name: '雷沢帰妹',
                    keywords: ['結合', '婚姻', '統合', '調和'],
                    strength: '異なるものの統合力',
                    weakness: '統合の困難',
                    energy: '結合的・統合的・調和志向'
                },
                55: { // 雷火豊
                    name: '雷火豊',
                    keywords: ['豊富', '充実', '栄光', '絶頂'],
                    strength: '豊かな充実感',
                    weakness: '絶頂期の驕り',
                    energy: '豊富的・充実的・栄光志向'
                },
                56: { // 火山旅
                    name: '火山旅',
                    keywords: ['旅行', '移動', '変化', '探求'],
                    strength: '環境変化への適応力',
                    weakness: '不安定な立場',
                    energy: '移動的・変化的・探求志向'
                },
                57: { // 巽為風
                    name: '巽為風',
                    keywords: ['柔軟', '浸透', '順応', '影響'],
                    strength: '柔軟な浸透力',
                    weakness: '意志の弱さ',
                    energy: '柔軟的・浸透的・順応志向'
                },
                58: { // 兌為沢
                    name: '兌為沢',
                    keywords: ['喜び', '楽しみ', '親しみ', '交流'],
                    strength: '人との親和力',
                    weakness: '軽薄さによる信頼失墜',
                    energy: '喜悦的・親和的・交流志向'
                },
                59: { // 風水渙
                    name: '風水渙',
                    keywords: ['散開', '分散', '拡散', '解放'],
                    strength: '柔軟な拡散力',
                    weakness: '統制の困難',
                    energy: '散開的・分散的・解放志向'
                },
                60: { // 水沢節
                    name: '水沢節',
                    keywords: ['節制', '調節', '適度', '制限'],
                    strength: '適切な制御力',
                    weakness: '過度の制約',
                    energy: '節制的・調節的・制限志向'
                },
                61: { // 風沢中孚
                    name: '風沢中孚',
                    keywords: ['誠実', '信頼', '真心', '内実'],
                    strength: '深い信頼関係の構築',
                    weakness: '純粋すぎる信頼',
                    energy: '誠実的・信頼的・真心志向'
                },
                62: { // 雷山小過
                    name: '雷山小過',
                    keywords: ['小さな過ち', '微調整', '謙遜', '慎重'],
                    strength: '細かな調整力',
                    weakness: '小心すぎる姿勢',
                    energy: '調整的・謙遜的・慎重志向'
                },
                63: { // 水火既済
                    name: '水火既済',
                    keywords: ['完成', '達成', '調和', '完璧'],
                    strength: '物事の完成力',
                    weakness: '次への移行困難',
                    energy: '完成的・調和的・安定志向'
                },
                64: { // 火水未済
                    name: '火水未済',
                    keywords: ['未完', '継続', '可能性', '永遠の挑戦'],
                    strength: '無限の可能性',
                    weakness: '完成への不安',
                    energy: '継続的・挑戦的・未来志向'
                }
            };
            
            return characteristics;
        }

        /**
         * 卦番号から特徴を取得
         */
        getHexagramCharacteristics(hexagramId) {
            return this.hexagramCharacteristics[hexagramId] || this.hexagramCharacteristics[1];
        }

        initializeInteractionPatterns() {
            // 64卦の基本的な相互作用パターン
            return new Map([
                ['1-2', { type: 'complementary', strength: 0.9, description: '天地の完全補完' }],
                ['3-4', { type: 'developmental', strength: 0.7, description: '始動と成長の連携' }],
                ['29-30', { type: 'transformative', strength: 0.6, description: '困難と光明の変換' }],
                // ... 他のパターン
            ]);
        }

        isMutualHexagram(id1, id2) {
            // 綜卦関係のチェック：id1 + id2 = 65の関係
            return (id1 + id2) === 65;
        }

        isOppositeHexagram(id1, id2) {
            // 錯卦関係のチェック（簡易版）
            return Math.abs(id1 - id2) === 32;
        }

        calculateSpeedConflict(engineOS, safeModeOS) {
            const engineSpeed = engineOS.score || 0.5;
            const safeSpeed = 1 - (safeModeOS.score || 0.5);
            return Math.abs(engineSpeed - safeSpeed);
        }

        calculateDecisionConflict(interfaceOS) {
            // Interface OSの調和志向度
            return interfaceOS.score || 0.5;
        }

        hasValueConflict(engineOS, interfaceOS, safeModeOS) {
            const scores = [engineOS.score, interfaceOS.score, safeModeOS.score];
            const variance = this.calculateVariance(scores);
            return variance > 0.2;
        }

        calculateVariance(scores) {
            const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
            const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
            return squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
        }

        calculateTotalSynergy(engineOS, interfaceOS, safeModeOS) {
            const s1 = this.calculatePairSynergy(engineOS, interfaceOS, 'engine-interface');
            const s2 = this.calculatePairSynergy(engineOS, safeModeOS, 'engine-safe');
            const s3 = this.calculatePairSynergy(interfaceOS, safeModeOS, 'interface-safe');
            return (s1 + s2 + s3) / 3;
        }

        calculateConflictLevel(engineOS, interfaceOS, safeModeOS) {
            const synergy = this.calculateTotalSynergy(engineOS, interfaceOS, safeModeOS);
            return Math.max(0, -synergy);
        }

        checkImbalance(engineOS, interfaceOS, safeModeOS) {
            const scores = [engineOS.score, interfaceOS.score, safeModeOS.score];
            const maxScore = Math.max(...scores);
            const minScore = Math.min(...scores);
            
            if (maxScore - minScore > 0.5) {
                const dominant = [engineOS, interfaceOS, safeModeOS].find(os => os.score === maxScore);
                const weak = [engineOS, interfaceOS, safeModeOS].find(os => os.score === minScore);
                return `「${dominant.name}」の過度な優位と「${weak.name}」の抑制によるバランス崩壊リスク`;
            }
            return null;
        }

        identifySpecialCombination(engineOS, interfaceOS, safeModeOS) {
            const combo = `${engineOS.hexagramId}-${interfaceOS.hexagramId}-${safeModeOS.hexagramId}`;
            
            // 特殊な組み合わせパターン
            const specialPatterns = {
                '1-2-29': '創造と受容に内省を加えた深い洞察力',
                '3-4-5': '始動・成長・待機のリズムを持つ持続的発展力',
                // ... 他の特殊パターン
            };
            
            return specialPatterns[combo] || null;
        }

        generatePairSummary(os1, os2, category, pairType = 'unknown') {
            const char1 = this.getHexagramCharacteristics(os1.hexagramId);
            const char2 = this.getHexagramCharacteristics(os2.hexagramId);
            
            // 卦の組み合わせパターンに基づいて動的な表現を生成
            return this.generateDynamicPairDescription(char1, char2, category, os1.hexagramId, os2.hexagramId, pairType);
        }
        
        /**
         * ペア間の関係性を動的に言語化
         */
        generateDynamicPairDescription(char1, char2, category, id1, id2, pairType = 'unknown') {
            // 卦番号の関係性を分析
            const diff = Math.abs(id1 - id2);
            // FIXME: 綜卦・錯卦の正確な定義に基づく判定が必要
            // 現在は簡易判定を使用（要改善）
            const isComplementary = this.isKnownComplementaryPair(id1, id2); // 既知の綜卦関係
            const isOpposite = this.isKnownOppositePair(id1, id2); // 既知の錯卦関係
            const isAdjacent = diff === 1; // 隣接卦
            const isSame = id1 === id2; // 同一卦
            
            if (category === 'SYNERGY') {
                if (isSame) {
                    // 同一卦でSYNERGYの場合は役割別の適切な表現
                    if (pairType === 'engine-interface') {
                        return `${char1.name}の${char1.strength}が実行系と調整系で完璧に連携し、最高のパフォーマンスを発揮`;
                    } else if (pairType === 'engine-safe') {
                        return `${char1.name}の${char1.strength}が主軸と安全網の両面で機能し、安定した高いパフォーマンスを実現`;
                    } else if (pairType === 'interface-safe') {
                        return `${char1.name}の${char1.strength}が調整役と安全網の両面で機能し、完璧なバランスを保つ`;
                    } else {
                        return `${char1.name}の${char1.strength}が複数の役割で一貫して最高の成果を生む`;
                    }
                } else if (isComplementary) {
                    return `${char1.name}と${char2.name}が綜卦関係により完全な補完を成し、${char1.keywords[0] || char1.name}と${char2.keywords[0] || char2.name}が最高の相乗効果を生む`;
                } else if (char1.energy.includes('陽') && char2.energy.includes('陰')) {
                    return `${char1.name}の${char1.keywords[0] || char1.strength}が${char2.name}の${char2.keywords[0] || char2.strength}を活性化し、陰陽の理想的バランスを実現`;
                } else {
                    return `${char1.name}の${char1.strength}と${char2.name}の${char2.strength}が共鳴し、相互に力を増幅させる`;
                }
            } else if (category === 'HARMONY') {
                if (isSame) {
                    // 同一卦で調和の場合の適切な表現
                    if (char1.keywords.some(k => ['調和', '協調', '安定', '平和', '受容性', '包容力', '柔軟性'].includes(k))) {
                        return `同じ${char1.name}同士が、共通の${char1.keywords.find(k => ['調和', '協調', '安定', '平和', '受容性', '包容力', '柔軟性'].includes(k))}により安定した基盤を提供`;
                    } else {
                        return `同じ${char1.name}同士が、共通の${char1.keywords[0]}により穏やかに共存し、安定性を維持`;
                    }
                } else if (isAdjacent) {
                    return `隣接する${char1.name}と${char2.name}が、${char1.keywords[2]}から${char2.keywords[2]}への自然な流れを作る`;
                } else if (this.haveSimilarEnergy(char1.energy, char2.energy)) {
                    return `${char1.name}と${char2.name}が共通の${this.extractCommonEnergyPattern(char1.energy, char2.energy)}により穏やかに共存`;
                } else {
                    return `${char1.name}の${char1.keywords[1]}と${char2.name}の${char2.keywords[1]}が互いを尊重し合う調和的関係`;
                }
            } else if (category === 'TENSION') {
                if (isSame) {
                    // 同一卦の場合は役割に応じた適切な表現を生成
                    if (pairType === 'engine-safe') {
                        // Engine-Safeでは多様性の必要性を強調
                        if (char1.keywords.some(k => ['調和', '協調', '安定', '平和', '受容性', '包容力', '柔軟性'].includes(k))) {
                            return `同じ${char1.name}同士が、安定・調和の役割において適度な相互補完を図る`;
                        } else {
                            return `同じ${char1.name}同士が、${char1.strength}の発揮を巡って適度な緊張を持ち、多様性を促進`;
                        }
                    } else {
                        return `同じ${char1.name}同士が、${char1.strength}の発揮を巡って競合し、創造的な緊張を生む`;
                    }
                } else if (isOpposite) {
                    return `錯卦関係の${char1.name}と${char2.name}が、${char1.keywords[0] || char1.strength}と${char2.keywords[0] || char2.strength}の方向性の違いで緊張を生む`;
                } else if (this.areEnergyConflicting(char1.energy, char2.energy)) {
                    return `${char1.name}の${char1.energy}と${char2.name}の${char2.energy}が根本的に異なり、調整が必要な緊張関係`;
                } else {
                    // 人間らしい共感できる表現を生成
                    return this.generateHumanRelatableDescription(char1, char2, pairType);
                }
            } else { // CONFLICT
                if (isSame) {
                    // 同一卦でCONFLICTの場合の適切な表現
                    if (pairType === 'engine-safe') {
                        return `${char1.name}の${char1.weakness || 'リスク'}が主軸と安全網の両方で発現し、深刻な脆弱性を生む`;
                    } else if (pairType === 'engine-interface') {
                        return `${char1.name}の${char1.weakness || 'リスク'}が実行系と調整系の両方で発現し、システム全体の障害を引き起こす`;
                    } else if (pairType === 'interface-safe') {
                        return `${char1.name}の${char1.weakness || 'リスク'}が調整役と安全網の両方で発現し、回復困難な混乱を生む`;
                    } else {
                        return `${char1.name}の${char1.weakness || 'リスク'}が複数の役割で同時発現し、破壊的な相乗効果を生む`;
                    }
                } else if (char1.weakness === char2.weakness) {
                    return `${char1.name}と${char2.name}が共通の弱点「${char1.weakness}」により相互に問題を増幅させる`;
                } else if (this.areDirectlyOpposing(char1, char2)) {
                    return `${char1.name}の${char1.keywords[0] || char1.name}と${char2.name}の${char2.keywords[0] || char2.name}が正面から衝突し、解決困難な対立を生む`;
                } else {
                    return `${char1.name}の${char1.weakness}と${char2.name}の${char2.weakness}が相互に悪影響を及ぼす破壊的関係`;
                }
            }
        }
        
        /**
         * 既知の綜卦関係をチェック（簡易版）
         */
        isKnownComplementaryPair(id1, id2) {
            // 代表的な綜卦関係（上下逆転）のペア
            const knownPairs = [
                [1, 2],   // 乾為天 ↔ 坤為地
                [3, 50],  // 水雷屯 ↔ 風火家人
                [11, 12], // 地天泰 ↔ 天地否
                [13, 14], // 天火同人 ↔ 火天大有
                [31, 32], // 沢山咸 ↔ 雷風恒
                [41, 42], // 山沢損 ↔ 風雷益
                [43, 44], // 沢天夬 ↔ 天風姤
                [53, 54], // 風山漸 ↔ 雷沢帰妹
                [61, 62], // 風沢中孚 ↔ 雷山小過
                [63, 64]  // 水火既済 ↔ 火水未済
            ];
            
            for (let [a, b] of knownPairs) {
                if ((id1 === a && id2 === b) || (id1 === b && id2 === a)) {
                    return true;
                }
            }
            return false;
        }
        
        /**
         * 既知の錯卦関係をチェック（簡易版）
         */
        isKnownOppositePair(id1, id2) {
            // 代表的な錯卦関係（全爻反転）のペア
            const knownOppositePairs = [
                [1, 2],  // 乾為天 ↔ 坤為地（錯卦でもある）
                [29, 30], // 坎為水 ↔ 離為火
                [51, 57], // 震為雷 ↔ 巽為風
                [52, 58], // 艮為山 ↔ 兌為沢
                // その他の対極関係
            ];
            
            for (let [a, b] of knownOppositePairs) {
                if ((id1 === a && id2 === b) || (id1 === b && id2 === a)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * エネルギーパターンの類似性を判定
         */
        haveSimilarEnergy(energy1, energy2) {
            const patterns1 = energy1.split('・');
            const patterns2 = energy2.split('・');
            let matchCount = 0;
            
            patterns1.forEach(p1 => {
                patterns2.forEach(p2 => {
                    if (p1.includes(p2.substring(0, 2)) || p2.includes(p1.substring(0, 2))) {
                        matchCount++;
                    }
                });
            });
            
            return matchCount >= 2;
        }
        
        /**
         * 共通のエネルギーパターンを抽出
         */
        extractCommonEnergyPattern(energy1, energy2) {
            const patterns1 = energy1.split('・');
            const patterns2 = energy2.split('・');
            
            for (let p1 of patterns1) {
                for (let p2 of patterns2) {
                    if (p1.includes(p2.substring(0, 2)) || p2.includes(p1.substring(0, 2))) {
                        return p1.substring(0, 2) + '的志向';
                    }
                }
            }
            return '志向';
        }
        
        /**
         * エネルギーの対立を判定
         */
        areEnergyConflicting(energy1, energy2) {
            const opposites = [
                ['積極', '受動'],
                ['陽的', '陰的'],
                ['外向', '内向'],
                ['上昇', '下降'],
                ['発散', '収束'],
                ['動的', '静的']
            ];
            
            for (let [opp1, opp2] of opposites) {
                if ((energy1.includes(opp1) && energy2.includes(opp2)) ||
                    (energy1.includes(opp2) && energy2.includes(opp1))) {
                    return true;
                }
            }
            return false;
        }
        
        /**
         * 人間らしい共感できる表現を生成
         */
        generateHumanRelatableDescription(char1, char2, pairType) {
            const keyword1 = char1.keywords[0] || char1.strength;
            const keyword2 = char2.keywords[0] || char2.strength;
            
            // キーワード組み合わせパターンによる個別表現
            const combinations = this.analyzeKeywordCombination(char1, char2);
            
            // 役割別の心理的体験を表現
            switch (pairType) {
                case 'engine-interface':
                    return this.generateEngineInterfaceTension(char1, char2, combinations);
                case 'engine-safe':
                    return this.generateEngineSafeTension(char1, char2, combinations);
                case 'interface-safe':
                    return this.generateInterfaceSafeTension(char1, char2, combinations);
                default:
                    return this.generateGeneralTension(char1, char2, combinations);
            }
        }
        
        /**
         * キーワード組み合わせの分析
         */
        analyzeKeywordCombination(char1, char2) {
            const keywords1 = char1.keywords || [];
            const keywords2 = char2.keywords || [];
            
            // スピード感の違い (実際のhexagram keywordsに基づいて拡張)
            const hasSpeedConflict = 
                (keywords1.some(k => ['強大', '威力', '積極性', '勇猛', '衝撃', '活気', '決断', '処断', '勇敢', '攻撃', '雷', '電撃'].includes(k)) &&
                 keywords2.some(k => ['穏健', '慎重', '節制', '内省', '瞑想', '静観', '忍耐', '待機', '準備', '観察', '洞察', '謙遜', '段階的', '着実'].includes(k))) ||
                (keywords2.some(k => ['強大', '威力', '積極性', '勇猛', '衝撃', '活気', '決断', '処断', '勇敢', '攻撃', '雷', '電撃'].includes(k)) &&
                 keywords1.some(k => ['穏健', '慎重', '節制', '内省', '瞑想', '静観', '忍耐', '待機', '準備', '観察', '洞察', '謙遜', '段階的', '着実'].includes(k)));
            
            // 価値観の違い (個人主義 vs 集団主義)
            const hasValueConflict =
                (keywords1.some(k => ['個人', '独立', '自由', '創造', 'リーダーシップ', '自立', '主導', '独創性', '自己主張'].includes(k)) &&
                 keywords2.some(k => ['団結', '協調', '統合', '調和', '集合', '結集', '親和', '協力', '同志', '和解', '包容', '受容性'].includes(k))) ||
                (keywords2.some(k => ['個人', '独立', '自由', '創造', 'リーダーシップ', '自立', '主導', '独創性', '自己主張'].includes(k)) &&
                 keywords1.some(k => ['団結', '協調', '統合', '調和', '集合', '結集', '親和', '協力', '同志', '和解', '包容', '受容性'].includes(k)));
            
            // 時間軸の違い (変革志向 vs 安定志向)
            const hasTimeConflict =
                (keywords1.some(k => ['革新', '変革', '刷新', '改革', '腐敗', '再生', '変化対応', '改革力', '新秩序', '再編', '覚醒', '変化', '進歩'].includes(k)) &&
                 keywords2.some(k => ['安定', '維持', '恒常', '永続', '持続', '継続', '不変', '保守', '現状維持', '忍耐', '堅実', '持続的', '永続的'].includes(k))) ||
                (keywords2.some(k => ['革新', '変革', '刷新', '改革', '腐敗', '再生', '変化対応', '改革力', '新秩序', '再編', '覚醒', '変化', '進歩'].includes(k)) &&
                 keywords1.some(k => ['安定', '維持', '恒常', '永続', '持続', '継続', '不変', '保守', '現状維持', '忍耐', '堅実', '持続的', '永続的'].includes(k)));
            
            // 方向性の違い (拡張・発展志向 vs 内向・退避志向)
            const hasDirectionConflict =
                (keywords1.some(k => ['上昇', '発展', '向上', '進歩', '発達', '成長', '昇進', '拡散', '解放', '散開', '明晰性', '照明', '外向'].includes(k)) &&
                 keywords2.some(k => ['潜伏', '退避', '内向', '収束', '戦略的撤退', '保身', '隠遁', '内省', '深い洞察', '深層', '閉塞', '断絶', '節制', '制限'].includes(k))) ||
                (keywords2.some(k => ['上昇', '発展', '向上', '進歩', '発達', '成長', '昇進', '拡散', '解放', '散開', '明晰性', '照明', '外向'].includes(k)) &&
                 keywords1.some(k => ['潜伏', '退避', '内向', '収束', '戦略的撤退', '保身', '隠遁', '内省', '深い洞察', '深層', '閉塞', '断絶', '節制', '制限'].includes(k)));
            
            return {
                speedConflict: hasSpeedConflict,
                valueConflict: hasValueConflict,
                timeConflict: hasTimeConflict,
                directionConflict: hasDirectionConflict
            };
        }
        
        /**
         * Engine-Interface間の心理的体験
         */
        generateEngineInterfaceTension(char1, char2, combinations) {
            const name1 = char1.name;
            const name2 = char2.name;
            const keyword1 = char1.keywords[0] || char1.strength;
            const keyword2 = char2.keywords[0] || char2.strength;
            
            if (combinations.speedConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、どちらのペースを優先すべきか判断に迷いがち`;
            } else if (combinations.valueConflict) {
                return `${name1}の${keyword1}重視と${name2}の${keyword2}重視、価値観の違いで方針決定に時間がかかる`;
            } else if (combinations.timeConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、タイミングの見解が異なり調整が必要`;
            } else if (combinations.directionConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、目指す方向性が違い戸惑うことがある`;
            } else {
                return `${name1}の${keyword1}と${name2}の${keyword2}、アプローチの違いで迷いが生じやすい`;
            }
        }
        
        /**
         * Engine-Safe間の心理的体験
         */
        generateEngineSafeTension(char1, char2, combinations) {
            const name1 = char1.name;
            const name2 = char2.name;
            const keyword1 = char1.keywords[0] || char1.strength;
            const keyword2 = char2.keywords[0] || char2.strength;
            
            if (combinations.speedConflict) {
                return `${name1}の${keyword1}で進みたいが、${name2}の${keyword2}も大切で、スピード調整に悩む`;
            } else if (combinations.valueConflict) {
                return `${name1}の${keyword1}への衝動と${name2}の${keyword2}への配慮、どちらも譲れず葛藤する`;
            } else if (combinations.timeConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、長期的視点と短期的判断で板挟みになる`;
            } else if (combinations.directionConflict) {
                return `${name1}の${keyword1}で攻めるか、${name2}の${keyword2}で守るか、選択に迷う`;
            } else {
                return `${name1}の${keyword1}と${name2}の${keyword2}、理想と現実の間で悩むことが多い`;
            }
        }
        
        /**
         * Interface-Safe間の心理的体験
         */
        generateInterfaceSafeTension(char1, char2, combinations) {
            const name1 = char1.name;
            const name2 = char2.name;
            const keyword1 = char1.keywords[0] || char1.strength;
            const keyword2 = char2.keywords[0] || char2.strength;
            
            if (combinations.speedConflict) {
                return `${name1}の${keyword1}での調整と${name2}の${keyword2}での安定化、どちらを優先するか悩ましい`;
            } else if (combinations.valueConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、人間関係と安全性のバランスが難しい`;
            } else if (combinations.timeConflict) {
                return `${name1}の${keyword1}による変化と${name2}の${keyword2}による維持、タイミングが合わない`;
            } else if (combinations.directionConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、開放性と慎重さの使い分けに迷う`;
            } else {
                return `${name1}の${keyword1}と${name2}の${keyword2}、調和を取るのに工夫が必要`;
            }
        }
        
        /**
         * 一般的な心理的体験
         */
        generateGeneralTension(char1, char2, combinations) {
            const name1 = char1.name;
            const name2 = char2.name;
            const keyword1 = char1.keywords[0] || char1.strength;
            const keyword2 = char2.keywords[0] || char2.strength;
            
            if (combinations.speedConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、ペースの違いで調整に時間がかかる`;
            } else if (combinations.valueConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、異なる価値観で方向性に悩む`;
            } else if (combinations.timeConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、時間感覚の違いでタイミングが難しい`;
            } else if (combinations.directionConflict) {
                return `${name1}の${keyword1}と${name2}の${keyword2}、目標の違いで迷いが生じる`;
            } else {
                return `${name1}の${keyword1}と${name2}の${keyword2}、違いを活かす方法を模索中`;
            }
        }
        
        /**
         * 緊張の理由を特定
         */
        identifyTensionReason(char1, char2) {
            // スピードの違い
            if ((char1.energy.includes('迅速') && char2.energy.includes('慎重')) ||
                (char1.energy.includes('慎重') && char2.energy.includes('迅速'))) {
                return 'スピード感の相違';
            }
            // 方向性の違い
            if ((char1.energy.includes('未来') && char2.energy.includes('過去')) ||
                (char1.energy.includes('革新') && char2.energy.includes('伝統'))) {
                return '時間軸の不一致';
            }
            // 価値観の違い
            if ((char1.strength.includes('個人') && char2.strength.includes('集団')) ||
                (char1.keywords.some(k => k.includes('独立')) && char2.keywords.some(k => k.includes('協調')))) {
                return '価値観の相違';
            }
            // デフォルト
            return '本質的な方向性の違い';
        }
        
        /**
         * 直接的な対立関係を判定
         */
        areDirectlyOpposing(char1, char2) {
            // キーワードが正反対の概念を含むか
            const opposingConcepts = [
                ['創造', '破壊'],
                ['統合', '分離'],
                ['前進', '後退'],
                ['開放', '閉塞'],
                ['光明', '暗黒']
            ];
            
            for (let [concept1, concept2] of opposingConcepts) {
                for (let keyword1 of char1.keywords) {
                    for (let keyword2 of char2.keywords) {
                        if ((keyword1.includes(concept1) && keyword2.includes(concept2)) ||
                            (keyword1.includes(concept2) && keyword2.includes(concept1))) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        
        /**
         * 葛藤テーマの動的生成
         */
        generateConflictTheme(char1, char2) {
            // エネルギーパターンの対立を分析
            if (char1.energy.includes('積極') && char2.energy.includes('受動')) {
                return '行動速度の根本的相違による葛藤';
            } else if (char1.energy.includes('外向') && char2.energy.includes('内向')) {
                return '方向性の不一致による内的分裂';
            } else if (char1.energy.includes('上昇') && char2.energy.includes('安定')) {
                return '成長と維持のバランス葛藤';
            } else {
                return 'エネルギーの質的相違による調整困難';
            }
        }

        generateSynergyNotes(engineOS, interfaceOS, safeModeOS, matrix) {
            const avgSynergy = (matrix[0][1] + matrix[0][2] + matrix[1][2]) / 3;
            
            if (avgSynergy > 0.5) {
                return `全体的に調和的な構成。${engineOS.name}を中心に、${interfaceOS.name}が調整し、${safeModeOS.name}が安定化させる好循環`;
            } else if (avgSynergy > 0) {
                return `バランスの取れた構成。各OSが適度な距離を保ちながら機能`;
            } else {
                return `葛藤を含む構成。創造的緊張を活かすことで独自の強みを発揮可能`;
            }
        }

        suggestGrowthDirection(engineOS, interfaceOS, safeModeOS) {
            const totalScore = engineOS.score + interfaceOS.score + safeModeOS.score;
            const avgScore = totalScore / 3;
            
            if (avgScore > 0.7) {
                return 'すでに高いバランス。各OSの特徴をより鮮明にすることで、さらなる個性化が可能では？';
            } else if (avgScore > 0.4) {
                return '成長の余地あり。最も低いスコアのOSを意識的に活用する場面を増やしてみては？';
            } else {
                return '大きな成長ポテンシャル。まずは最も得意なOSを軸に、段階的に他のOSを統合していくアプローチを';
            }
        }
        
        /**
         * キーワード間の意味的類似性を計算
         */
        calculateKeywordSynergy(keywords1, keywords2) {
            const synergyPatterns = [
                // 相乗効果を生むキーワード組み合わせ
                [['創造力', 'リーダーシップ'], ['強大', '威力', '積極性']], // 乾為天 × 雷天大壮
                [['決断力', '実行力'], ['行動力', '勇猛']], // 実行系の相乗効果
                [['教育', '指導'], ['学習', '啓発']], // 教育系の相乗効果
                [['包容力', '柔軟性'], ['調和', '協調']], // 調和系の相乗効果
                [['内省', '慎重さ'], ['深い洞察', '瞑想']], // 内観系の相乗効果
                [['変革', '革新'], ['刷新', '改革']], // 変化系の相乗効果
                [['豊かさ', '繁栄'], ['成功', '統合']], // 成功系の相乗効果
                [['持続', '継続'], ['永続', '恒常性']], // 継続系の相乗効果
                [['光明', '照明'], ['文明', '知恵']], // 知恵系の相乗効果
                [['活力', '元気'], ['刺激', '動力']] // エネルギー系の相乗効果
            ];
            
            let maxSynergy = 0;
            for (let [pattern1, pattern2] of synergyPatterns) {
                const match1 = keywords1.some(k1 => pattern1.some(p => k1.includes(p)));
                const match2 = keywords2.some(k2 => pattern2.some(p => k2.includes(p)));
                if (match1 && match2) {
                    maxSynergy = Math.max(maxSynergy, 0.7); // 修正: SYNERGY閾値と整合
                }
            }
            
            // 完全一致チェック
            const commonKeywords = keywords1.filter(k1 => 
                keywords2.some(k2 => k1 === k2 || k1.includes(k2) || k2.includes(k1))
            );
            if (commonKeywords.length > 0) {
                // 共通キーワード数による補正（上限0.7まで）
                const keywordBonus = Math.min(0.5 + (commonKeywords.length * 0.1), 0.7);
                maxSynergy = Math.max(maxSynergy, keywordBonus);
            }
            
            return maxSynergy;
        }
        
        /**
         * エネルギーパターンの相性を計算
         */
        calculateEnergyCompatibility(energy1, energy2) {
            // 相性の良いエネルギーパターン
            const compatiblePatterns = [
                ['陽的', '陽的'], // 同じ陽性エネルギー
                ['積極的', '積極的'], // 同じ積極性
                ['上昇志向', '成長志向'], // 向上心系
                ['学習的', '成長的'], // 学習成長系
                ['発散的', '照明的'], // 外向系
                ['流動的', '適応的'], // 柔軟系
                ['陰的', '陰的'], // 同じ陰性エネルギー
                ['受動的', '安定志向'], // 安定系
                ['内向志向', '深層志向'], // 内観系
                ['瞑想志向', '静的'] // 静寂系
            ];
            
            for (let [pattern1, pattern2] of compatiblePatterns) {
                if ((energy1.includes(pattern1) && energy2.includes(pattern2)) ||
                    (energy1.includes(pattern2) && energy2.includes(pattern1))) {
                    return 0.6; // 修正: calculatePairSynergyでの使用値と整合
                }
            }
            
            // 補完的なパターン（陰陽バランス）
            if ((energy1.includes('陽的') && energy2.includes('陰的')) ||
                (energy1.includes('陰的') && energy2.includes('陽的'))) {
                return 0.6;
            }
            
            return 0.0;
        }
        
        /**
         * 強みと弱みの相互作用を分析
         */
        analyzeStrengthWeaknessInteraction(char1, char2) {
            // 一方の強みが他方の弱みを補う関係
            const complementaryPairs = [
                ['決断力と実行力', '主体性の欠如'], // 乾為天の強み → 坤為地の弱み
                ['調和と協調', '傲慢になりやすい'], // 坤為地の強み → 乾為天の弱み
                ['知識の蓄積と伝授', '経験不足による判断ミス'], // 教育系の補完
                ['適切なタイミングを待つ力', '勇み足による失敗'], // タイミング系の補完
                ['深い洞察力', '行動の遅れによる機会損失'], // 洞察と行動の補完
                ['柔軟な対応力', '完成への不安'] // 柔軟性と完成の補完
            ];
            
            for (let [strength, weakness] of complementaryPairs) {
                if ((char1.strength.includes(strength.split('と')[0]) && char2.weakness.includes(weakness)) ||
                    (char2.strength.includes(strength.split('と')[0]) && char1.weakness.includes(weakness))) {
                    return 0.5; // 補完的な関係
                }
            }
            
            // 両方の弱みが重複する場合
            const sharedWeaknesses = [
                '不安', '混乱', '停滞', '失敗', '欠如'
            ];
            
            for (let weakness of sharedWeaknesses) {
                if (char1.weakness.includes(weakness) && char2.weakness.includes(weakness)) {
                    return -0.3; // 弱みが重複
                }
            }
            
            return 0.0;
        }
        
        /**
         * 似た方向性かどうかを判定（Engine-Interfaceペア用）
         */
        haveSimilarDirection(char1, char2) {
            // 実行系で効率的な組み合わせ
            const executionSynergies = [
                [['創造力', 'リーダーシップ', '決断力'], ['強大', '威力', '行動力', '積極性']],
                [['教育', '指導', '学習'], ['啓発', '成長', '発展']],
                [['調和', '協調', '包容'], ['柔軟', '受容', '適応']],
                [['持続', '継続', '安定'], ['恒常', '永続', '維持']],
                [['変革', '刷新', '革新'], ['改革', '突破', '開拓']]
            ];
            
            for (let [group1, group2] of executionSynergies) {
                const match1 = char1.keywords.some(k1 => group1.some(g => k1.includes(g)));
                const match2 = char2.keywords.some(k2 => group2.some(g => k2.includes(g)));
                if (match1 && match2) return true;
            }
            
            // エネルギーレベルでの類似性
            return this.calculateEnergyCompatibility(char1.energy, char2.energy) > 0.6;
        }
        
        /**
         * 健全な補完関係かどうかを判定（Engine-Safeペア用）
         */
        isHealthyComplement(char1, char2) {
            // 健全な補完パターン
            const healthyComplements = [
                [['決断力', '実行力'], ['慎重', '内省', '深い洞察']], // 行動と内省の補完
                [['積極的', '外向'], ['受動的', '内向', '静寂']], // 外向と内向の補完
                [['創造', '刷新'], ['安定', '維持', '保守']], // 変化と安定の補完
                [['速い', '瞬間'], ['遅い', '持続', '継続']] // スピードの補完
            ];
            
            for (let [active, stable] of healthyComplements) {
                const isActiveFirst = char1.keywords.some(k1 => active.some(a => k1.includes(a))) &&
                                    char2.keywords.some(k2 => stable.some(s => k2.includes(s)));
                const isStableFirst = char2.keywords.some(k2 => active.some(a => k2.includes(a))) &&
                                     char1.keywords.some(k1 => stable.some(s => k1.includes(s)));
                
                if (isActiveFirst || isStableFirst) {
                    // さらに弱みの補完もチェック
                    return this.analyzeStrengthWeaknessInteraction(char1, char2) > 0;
                }
            }
            
            return false;
        }
        
        /**
         * ストレスフルな補完関係かどうかを判定
         */
        isStressfulComplement(char1, char2) {
            // 個人にとってしんどい組み合わせパターン
            const stressfulPatterns = [
                // 完成志向 vs 未完志向
                [['決断力', '実行力', '創造力', '完成'], ['未完', '継続', '永遠', '無限']],
                // 安定志向 vs 変化志向（極端な場合）
                [['安定', '維持', '保守', '不動'], ['変革', '刷新', '革命', '破壊']],
                // 内向性 vs 外向性（極端な場合）
                [['内省', '瞑想', '静寂', '孤独'], ['交流', '社交', '開放', '拡散']],
                // 完璧主義 vs 柔軟性（極端な場合）
                [['完璧', '正確', '厳格', '規律'], ['柔軟', '適当', '曖昧', '自由']]
            ];
            
            for (let [pattern1, pattern2] of stressfulPatterns) {
                const match1to2 = char1.keywords.some(k1 => pattern1.some(p => k1.includes(p))) &&
                                  char2.keywords.some(k2 => pattern2.some(p => k2.includes(p)));
                const match2to1 = char2.keywords.some(k2 => pattern1.some(p => k2.includes(p))) &&
                                  char1.keywords.some(k1 => pattern2.some(p => k1.includes(p)));
                
                if (match1to2 || match2to1) return true;
            }
            
            // 強み vs 強み の競合（同じ強みを持つ場合のストレス）
            if (char1.strength === char2.strength) return true;
            
            // 弱み vs 弱み の重複（弱みが増幅される）
            const sharedWeaknesses = ['不安', '混乱', '停滞', '失敗', '欠如'];
            for (let weakness of sharedWeaknesses) {
                if (char1.weakness.includes(weakness) && char2.weakness.includes(weakness)) {
                    return true;
                }
            }
            
            return false;
        }
        
        /**
         * バランスが取れているかを判定（Interface-Safeペア用）
         */
        isWellBalanced(char1, char2) {
            // 調整に適したバランスパターン
            const balancedPatterns = [
                [['学習', '成長', '発展'], ['安定', '維持', '保護']], // 成長と安定
                [['柔軟', '適応', '調整'], ['規律', '秩序', '構造']], // 柔軟性と構造
                [['開放', '拡張', '表現'], ['収束', '集中', '内省']], // 拡張と収束
                [['直感', '感性', '創造'], ['論理', '分析', '慎重']] // 直感と論理
            ];
            
            for (let [flexible, stable] of balancedPatterns) {
                const isFlexFirst = char1.keywords.some(k1 => flexible.some(f => k1.includes(f))) &&
                                   char2.keywords.some(k2 => stable.some(s => k2.includes(s)));
                const isStabFirst = char2.keywords.some(k2 => flexible.some(f => k2.includes(f))) &&
                                   char1.keywords.some(k1 => stable.some(s => k1.includes(s)));
                
                if (isFlexFirst || isStabFirst) return true;
            }
            
            // エネルギーレベルでの中程度の相性
            const energyCompat = this.calculateEnergyCompatibility(char1.energy, char2.energy);
            return energyCompat > 0.3 && energyCompat < 0.7; // 極端すぎない相性
        }

        /**
         * 同一卦の場合の精緻な判定
         */
        analyzeSameHexagram(char, pairType) {
            // 同一卦でも役割によって相性は異なる
            switch (pairType) {
                case 'engine-interface':
                    // 実行系同士：効率性を求める場面では相乗効果
                    if (char.keywords.some(k => ['決断力', '実行力', '積極性', '強大', '威力'].includes(k))) {
                        return 0.6; // 高い相乗効果
                    }
                    // 内省系同士：実行場面では非効率
                    if (char.keywords.some(k => ['内省', '慎重', '深い洞察', '瞑想'].includes(k))) {
                        return -0.1; // 軽い緊張
                    }
                    return 0.4; // 標準的相乗効果
                    
                case 'engine-safe':
                    // 安全網としては多様性が必要だが、強力なエンジンは安全網としても機能する
                    if (char.keywords.some(k => ['完璧', '理想', '絶頂'].includes(k))) {
                        return -0.2; // 完璧主義の重複は危険
                    }
                    if (char.keywords.some(k => ['調和', '協調', '安定', '平和', '受容性', '包容力', '柔軟性'].includes(k))) {
                        return 0.3; // 安定・調和系は安全網として機能
                    }
                    // 強力なエンジン系も安全網として一定の価値を持つ
                    if (char.keywords.some(k => ['決断力', '実行力', '積極性', '強大', '威力', '創造力', 'リーダーシップ', '推進力'].includes(k))) {
                        return 0.2; // 強力な推進力は安全網としても機能（控えめ評価）
                    }
                    return 0.1; // その他の控えめな評価
                    
                case 'interface-safe':
                    // 調整役には適度な類似性が有効
                    if (char.keywords.some(k => ['柔軟性', '適応', '調整', 'バランス', '包容力', '受容性'].includes(k))) {
                        return 0.4; // 調整・包容系は相性良好
                    }
                    if (char.keywords.some(k => ['極限', '過度', '激化'].includes(k))) {
                        return -0.3; // 極端系の重複は危険
                    }
                    return 0.2; // 一般的調和
                    
                default:
                    return 0.3; // デフォルト（軽い相乗効果）
            }
        }
    }

    // グローバル公開
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TripleOSInteractionAnalyzer;
    } else {
        global.TripleOSInteractionAnalyzer = TripleOSInteractionAnalyzer;
    }

})(typeof window !== 'undefined' ? window : global);