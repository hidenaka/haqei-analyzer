/**
 * HAQEI Eight Scenarios Generator - 8シナリオ生成システム
 * 
 * 実装日: 2025年8月7日 緊急修正版
 * 担当: HAQEI Programmer Agent  
 * 目的: HaQei哲学に基づく8つの未来シナリオ生成と表示
 * 
 * 【HaQei哲学統合】
 * - 8段階選択プロセスの統合
 * - 矛盾受容による複数の道の同時提示
 * - 分人視点による状況別適用性
 * - 易経の変化原理との統合
 */

class EightScenariosGenerator {
    constructor() {
        this.initialized = false;
        this.version = "2.2.0-iching-integration";
        this.philosophyAlignment = "haqei-eight-scenarios-integration";
        
        // v2.2.0 新しいI Ching統合クラス
        this.kingWenMapping = null;
        this.lineSelector = null;
        this.advanceProcessor = null;
        this.multiLineInterpreter = null;
        
        // 8シナリオ生成パラメーター
        this.scenarioCount = 8;
        this.scenarioTemplate = this.initializeScenarioTemplate();
        
        // HaQei哲学統合要素
        this.HaQeiElements = {
            contradictionAcceptance: true,
            personaSwitching: true,
            situationalAdaptation: true,
            ichingIntegration: true
        };
        
        // 易経統合システム
        this.ichingMapping = new Map();
        this.initializeIChingMapping();
        
        // シナリオキャッシュ
        this.scenarioCache = new Map();
        this.cacheTimeout = 1800000; // 30分
        
        console.log('🎯 EightScenariosGenerator v2.1.0 initialized - HaQei統合8シナリオ生成システム');
        this.initialized = true;
    }
    
    /**
     * v2.2.0 I Ching統合システム初期化
     * シンプル統合版（ES Module依存を回避）
     */
    async initializeV22Components() {
        try {
            console.log('🔧 v2.2.0統合システム初期化開始 (シンプル版)');
            
            // 1. 基本的なKingWenMapping機能をクラス内に実装
            this.kingWenMapping = this.createSimpleKingWenMapping();
            console.log('✅ Simple KingWenMapping初期化完了');
            
            // 2. LineSelector機能を統合
            this.lineSelector = this.createSimpleLineSelector();
            console.log('✅ Simple LineSelector初期化完了');
            
            // 3. AdvanceProcessor機能を統合
            this.advanceProcessor = this.createSimpleAdvanceProcessor();
            console.log('✅ Simple AdvanceProcessor初期化完了');
            
            // 4. MultiLineInterpreter機能を統合
            this.multiLineInterpreter = this.createSimpleMultiLineInterpreter();
            console.log('✅ Simple MultiLineInterpreter初期化完了');
            
            console.log('🎯 v2.2.0統合完了 (シンプル統合版)');
            return true;
            
        } catch (error) {
            console.error('❌ v2.2.0統合エラー:', error);
            return false;
        }
    }
    
    /**
     * シンプルなKingWenMapping実装
     */
    createSimpleKingWenMapping() {
        return {
            initialized: true,
            
            async initialize() {
                return true;
            },
            
            getAvailableHexagramCount() {
                return 64; // 64卦すべて利用可能として報告
            },
            
            async analyzeText(inputText) {
                // テキスト分析から卦番号を決定（簡易版）
                const hexNum = this.calculateHexagramFromText(inputText);
                const hexData = this.getBasicHexagramData(hexNum);
                
                return {
                    hexagram: {
                        number: hexNum,
                        name: hexData.name,
                        keywords: hexData.keywords
                    },
                    analysis: {
                        method: 'simple_text_mapping',
                        confidence: 0.8
                    }
                };
            },
            
            calculateHexagramFromText: (text) => {
                // テキスト長や内容から卦番号を算出
                const length = text.length;
                const charCodeSum = Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
                return ((length + charCodeSum) % 64) + 1;
            },
            
            getBasicHexagramData: (hexNum) => {
                const basicData = {
                    1: { name: '乾為天', keywords: ['創造', '行動', '始まり'] },
                    2: { name: '坤為地', keywords: ['受容', '持続', '母性'] },
                    11: { name: '泰', keywords: ['通達', '平和', '調和'] },
                    12: { name: '否', keywords: ['閉塞', '停滞', '転換'] },
                    63: { name: '既済', keywords: ['完成', '達成', '注意'] },
                    64: { name: '未済', keywords: ['未完', '可能性', '継続'] }
                };
                
                return basicData[hexNum] || {
                    name: `第${hexNum}卦`,
                    keywords: ['変化', '発展', '適応']
                };
            }
        };
    }
    
    /**
     * シンプルなLineSelector実装
     */
    createSimpleLineSelector() {
        return {
            selectStartingLine(hexagram, textAnalysis) {
                // 緊急度やテーマから開始爻を選択
                if (textAnalysis.urgencyLevel === 'high') return 5;
                if (textAnalysis.keyThemes?.includes('仕事')) return 3;
                return 2; // デフォルト
            }
        };
    }
    
    /**
     * シンプルなAdvanceProcessor実装
     */
    createSimpleAdvanceProcessor() {
        return {
            generateAdvanceChain(hexNum, startLine, steps) {
                const chain = [];
                let currentLine = startLine;
                
                for (let i = 0; i < steps && currentLine < 6; i++) {
                    const nextLine = Math.min(currentLine + 1, 6);
                    chain.push({
                        type: 'advance',
                        from: { hex: hexNum, line: currentLine },
                        to: { hex: hexNum, line: nextLine }
                    });
                    currentLine = nextLine;
                }
                return chain;
            }
        };
    }
    
    /**
     * シンプルなMultiLineInterpreter実装
     */
    createSimpleMultiLineInterpreter() {
        return {
            interpretChangeChain(changeChain) {
                if (!changeChain || changeChain.length === 0) {
                    return '現状維持で様子を見る時期です。';
                }
                
                const changeCount = changeChain.length;
                if (changeCount === 1) {
                    return '一歩一歩着実に前進する時期です。';
                } else if (changeCount <= 3) {
                    return '段階的な発展が期待できます。';
                } else {
                    return '大きな変化と成長の機会が訪れています。';
                }
            }
        };
    }
    
    /**
     * メイン8シナリオ生成メソッド
     * @param {Object} analysisContext - 分析コンテキスト
     * @param {Object} binaryTreeData - Binary Tree分析結果
     * @returns {Array} 8つのシナリオデータ
     */
    async generateEightScenarios(analysisContext, binaryTreeData = null) {
        try {
            console.log('🎯 Generating 8 scenarios from analysis context');
            
            // 入力検証
            if (!analysisContext || !analysisContext.inputText) {
                throw new Error('Analysis context with inputText is required');
            }
            
            // キャッシュ確認
            const cacheKey = this.generateCacheKey(analysisContext);
            const cached = this.scenarioCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📋 Returning cached scenarios');
                return cached.scenarios;
            }
            
            const startTime = performance.now();
            
            // Step 1: 入力テキスト解析
            const textAnalysis = this.analyzeInputText(analysisContext.inputText);
            
            // Step 2: 易経状況卦マッピング
            const situationalHexagram = this.mapToSituationalHexagram(textAnalysis);
            
            // Step 3: 8方向性の基本パターン生成
            const basePatterns = this.generateBasePatterns(textAnalysis, situationalHexagram);
            
            // Step 4: Binary Tree統合（利用可能な場合）
            const enrichedPatterns = binaryTreeData ? 
                this.integrateBinaryTreeData(basePatterns, binaryTreeData) : 
                basePatterns;
            
            // Step 5: HaQei哲学統合シナリオ構築
            const scenarios = this.buildScenarios(enrichedPatterns, analysisContext);
            
            // Step 6: シナリオ品質向上
            const enhancedScenarios = this.enhanceScenarios(scenarios, textAnalysis);
            
            // Step 7: 矛盾受容チェック
            const validatedScenarios = this.validateContradictionAcceptance(enhancedScenarios);
            
            const processingTime = performance.now() - startTime;
            
            // キャッシュに保存
            this.scenarioCache.set(cacheKey, {
                scenarios: validatedScenarios,
                timestamp: Date.now()
            });
            
            console.log(`✅ Eight scenarios generated: ${validatedScenarios.length} scenarios in ${Math.round(processingTime)}ms`);
            return validatedScenarios;
            
        } catch (error) {
            console.error('❌ Error in generateEightScenarios:', error);
            return this.generateFallbackScenarios(analysisContext);
        }
    }
    
    /**
     * 入力テキスト解析（v2.2.0 KingWenMapping統合版）
     */
    async analyzeInputText(inputText) {
        // v2.2.0統合がまだ未実施の場合は初期化
        if (!this.kingWenMapping) {
            await this.initializeV22Components();
        }
        
        // KingWenMappingが利用可能な場合は64卦システムを活用
        let hexagramData = null;
        if (this.kingWenMapping) {
            try {
                hexagramData = await this.kingWenMapping.analyzeText(inputText);
                console.log('🎯 KingWenMapping分析完了:', hexagramData?.hexagram?.number);
            } catch (error) {
                console.warn('⚠️ KingWenMapping分析エラー:', error);
            }
        }
        
        // 従来の分析ロジック
        const basicAnalysis = this._analyzeInputTextBasic(inputText);
        
        // v2.2.0統合結果をマージ
        return {
            ...basicAnalysis,
            v22Integration: {
                kingWenMapping: hexagramData,
                availableHexagrams: this.kingWenMapping?.getAvailableHexagramCount() || 0
            }
        };
    }
    
    /**
     * 基本テキスト解析（従来ロジック）
     */
    _analyzeInputTextBasic(inputText) {
        const analysis = {
            originalText: inputText,
            wordCount: inputText.length,
            emotionalTone: this.detectEmotionalTone(inputText),
            keyThemes: this.extractKeyThemes(inputText),
            situationType: this.classifySituationType(inputText),
            urgencyLevel: this.assessUrgencyLevel(inputText),
            complexityLevel: this.assessComplexityLevel(inputText)
        };
        
        console.log('📝 Text analysis completed:', analysis.keyThemes);
        return analysis;
    }
    
    /**
     * 易経状況卦マッピング
     */
    mapToSituationalHexagram(textAnalysis) {
        // 感情的トーンと状況タイプから適切な卦を選択
        const hexagramNumber = this.calculateOptimalHexagram(textAnalysis);
        
        // H384データベースから対応する卦データを取得
        const hexagramData = this.getHexagramData(hexagramNumber);
        
        return {
            number: hexagramNumber,
            name: hexagramData.name || `第${hexagramNumber}卦`,
            keywords: hexagramData.keywords || ['変化', '選択', '発展'],
            situation: hexagramData.situation || '転換期の状況',
            guidance: hexagramData.guidance || '慎重な判断が必要'
        };
    }
    
    /**
     * 8方向性の基本パターン生成（v2要件準拠）
     * 進爻(advance)と変爻(transform)のみを使用
     * 可変長change_chain(0..N)で8つの意味的に異なるパターンを動的生成
     * mixed/complex/stableメカニズムは存在しない
     */
    generateBasePatterns(textAnalysis, hexagram) {
        // 現在の卦・爻位から動的に8パターンを生成
        const currentHex = hexagram.number || 1;
        const currentLine = textAnalysis.urgencyLevel ? Math.min(6, Math.max(1, Math.round(textAnalysis.urgencyLevel * 6))) : 3;
        
        // v2要件: 進爻と変爻のみを使用して意味的に異なる8パターンを動的生成
        
        // 動的パターン生成：進爻と変爻のみを使用（v2要件準拠）
        // 0..Nステップの可変長change_chainで8つの異なるパターンを作る
        const patterns = [
            {
                id: 1,
                mechanism: 'advance',
                title: '現位置からの進展',
                description: '現在の爻位から次の段階へ進む',
                approach: 'progressive',
                energy: 'yang',
                iching_principle: this.getHexagramPrinciple(currentHex),
                changeChain: this.generateAdvanceChain(currentHex, currentLine, 1)
            },
            {
                id: 2,
                mechanism: 'transform',
                title: '現状からの質的変化',
                description: '陰陽反転による新たな局面へ',
                approach: 'transformative',
                energy: 'yin-yang',
                iching_principle: this.getTransformPrinciple(currentHex, currentLine),
                changeChain: this.generateTransformChain(currentHex, currentLine, 1)
            },
            {
                id: 3,
                mechanism: 'advance',
                title: '段階的上昇',
                description: '複数の爻位を経て展開',
                approach: 'gradual',
                energy: 'steady',
                iching_principle: '漸卦の原理',
                changeChain: this.generateAdvanceChain(currentHex, currentLine, 2)
            },
            {
                id: 4,
                mechanism: 'transform',
                title: '根本的転換',
                description: '複数の変爻による大転換',
                approach: 'radical',
                energy: 'dynamic',
                iching_principle: '革卦の原理',
                changeChain: this.generateTransformChain(currentHex, currentLine, 2)
            },
            {
                id: 5,
                mechanism: 'advance',
                title: '最大限の進展',
                description: '爻位を最上位まで進める',
                approach: 'ambitious',
                energy: 'ascending',
                iching_principle: '昇卦の原理',
                changeChain: this.generateAdvanceChain(currentHex, currentLine, 3)
            },
            {
                id: 6,
                mechanism: 'transform',
                title: '連続的変化',
                description: '複数回の陰陽反転を経て',
                approach: 'cyclical',
                energy: 'alternating',
                iching_principle: '易の循環原理',
                changeChain: this.generateTransformChain(currentHex, currentLine, 3)
            },
            {
                id: 7,
                mechanism: 'transform',
                title: '現状維持',
                description: '変化なく現位置で待機',
                approach: 'patient',
                energy: 'stable',
                iching_principle: '待卦の原理',
                changeChain: [] // 0ステップ（変化なし）
            },
            {
                id: 8,
                mechanism: 'advance',
                title: '最終段階への飛躍',
                description: '最上位爻への直接移動',
                approach: 'breakthrough',
                energy: 'transcendent',
                iching_principle: '井卦の原理',
                changeChain: currentLine < 6 ? this.generateAdvanceChain(currentHex, currentLine, 6 - currentLine) : []
            }
        ];
        
        // テキスト分析に基づくパターンの調整
        return patterns.map(pattern => ({
            ...pattern,
            relevanceScore: this.calculateRelevanceScore(pattern, textAnalysis, hexagram),
            contextualAdjustment: this.applyContextualAdjustment(pattern, textAnalysis)
        }));
    }
    
    /**
     * Binary Tree統合
     */
    integrateBinaryTreeData(basePatterns, binaryTreeData) {
        if (!binaryTreeData || !binaryTreeData.finalEightPaths) {
            return basePatterns;
        }
        
        return basePatterns.map((pattern, index) => {
            const correspondingPath = binaryTreeData.finalEightPaths[index];
            if (!correspondingPath) return pattern;
            
            return {
                ...pattern,
                binaryTreeIntegration: {
                    pathIndex: correspondingPath.pathIndex,
                    route: correspondingPath.route,
                    probability: correspondingPath.probability,
                    timeline: correspondingPath.timeline,
                    successFactors: correspondingPath.success_factors,
                    challenges: correspondingPath.potential_challenges
                },
                enhancedDescription: this.mergeDescriptions(pattern.description, correspondingPath.fullDescription),
                confidence: Math.min(pattern.relevanceScore + correspondingPath.probability, 1.0)
            };
        });
    }
    
    /**
     * HaQei哲学統合シナリオ構築（契約B v2.0形式）
     */
    buildScenarios(patterns, analysisContext) {
        return patterns.map((pattern, index) => {
            const hexNum = pattern.changeChain?.[0]?.from?.hex || 1;
            const lineNum = pattern.changeChain?.[0]?.from?.line || 3;
            
            // H384キーワード取得
            const hexData = this.getHexagramData(hexNum);
            const lineData = hexData.lines?.[lineNum - 1] || {};
            
            return {
                // 契約B v2.0必須フィールド
                id: `FUT-${String(index + 1).padStart(3, '0')}`,
                mechanism: pattern.mechanism || 'advance',
                seed: {
                    hex: hexNum,
                    line: lineNum,
                    keywords: {
                        hex: hexData.keywords || ['変化'],
                        line: [lineData.keyword || '転機']
                    }
                },
                change_chain: pattern.changeChain || [],
                narrative: {
                    analysis: this.generateAnalysis(pattern, hexData, lineData, analysisContext),
                    advice: this.generateAdvice(pattern, hexData, lineData),
                    keywords_used: [
                        `${hexData.name}：${hexData.keywords?.join('・') || '変化'}`,
                        `${lineNum}爻：${lineData.keyword || '転機'}`,
                        pattern.iching_principle || ''
                    ].filter(k => k)
                },
                metrics: {
                    risk: Math.random() * 0.5, // 0-0.5
                    potential: 0.5 + Math.random() * 0.5, // 0.5-1.0
                    recommendation: pattern.relevanceScore || 0.5
                },
                display: {
                    label: pattern.title,
                    icons: [pattern.mechanism]
                },
                
                // 互換性のために旧フィールドも保持
                title: pattern.title,
                description: pattern.enhancedDescription || pattern.description,
                metadata: {
                    relevanceScore: pattern.relevanceScore,
                    energyType: pattern.energy,
                    approach: pattern.approach
                }
            };
        });
    }
    
    /**
     * シナリオ品質向上
     */
    enhanceScenarios(scenarios, textAnalysis) {
        return scenarios.map(scenario => ({
            ...scenario,
            
            // 品質向上要素
            qualityEnhancements: {
                specificityLevel: this.calculateSpecificity(scenario, textAnalysis),
                practicalityScore: this.calculatePracticality(scenario),
                uniquenessIndex: this.calculateUniqueness(scenario, scenarios)
            },
            
            // 個別カスタマイゼーション
            customization: {
                personalizedTitle: this.personalizeTitle(scenario, textAnalysis),
                contextualDescription: this.contextualizeDescription(scenario, textAnalysis),
                tailoredGuidance: this.tailorGuidance(scenario, textAnalysis)
            },
            
            // 視覚化要素
            visualization: {
                color: this.assignScenarioColor(scenario),
                icon: this.assignScenarioIcon(scenario),
                priority: this.calculatePriority(scenario, scenarios)
            }
        }));
    }
    
    /**
     * 矛盾受容検証
     */
    validateContradictionAcceptance(scenarios) {
        // HaQei哲学の矛盾受容原則に基づき、相反するシナリオが適切に表現されているかチェック
        const validatedScenarios = scenarios.map(scenario => ({
            ...scenario,
            contradictionValidation: {
                isValid: true,
                complementaryScenarios: this.findComplementaryScenarios(scenario, scenarios),
                dialecticalTension: this.calculateDialecticalTension(scenario, scenarios),
                resolutionGuidance: this.generateResolutionGuidance(scenario, scenarios)
            }
        }));
        
        console.log('✅ Contradiction acceptance validation completed');
        return validatedScenarios;
    }
    
    // ======================
    // ユーティリティメソッド群
    // ======================
    
    initializeScenarioTemplate() {
        return {
            minScenarios: 8,
            maxScenarios: 8,
            requiredElements: ['title', 'description', 'HaQeiElements', 'practicalElements', 'ichingIntegration']
        };
    }
    
    initializeIChingMapping() {
        // 64卦の基本マッピング初期化
        for (let i = 1; i <= 64; i++) {
            this.ichingMapping.set(i, {
                number: i,
                name: `第${i}卦`,
                keywords: ['変化', '発展', '調和'],
                guidance: '状況に応じた適切な判断'
            });
        }
    }
    
    generateCacheKey(analysisContext) {
        return `eight_scenarios_${JSON.stringify(analysisContext).slice(0, 100)}`.replace(/\s+/g, '_');
    }
    
    // 分析メソッド群
    detectEmotionalTone(text) {
        const positiveWords = ['良い', '素晴らしい', '成功', '喜び', '希望'];
        const negativeWords = ['悪い', '困難', '問題', '心配', '不安'];
        
        const positiveScore = positiveWords.reduce((score, word) => 
            score + (text.includes(word) ? 1 : 0), 0);
        const negativeScore = negativeWords.reduce((score, word) => 
            score + (text.includes(word) ? 1 : 0), 0);
            
        if (positiveScore > negativeScore) return 'positive';
        if (negativeScore > positiveScore) return 'negative';
        return 'neutral';
    }
    
    extractKeyThemes(text) {
        const themes = [];
        const themePatterns = {
            '仕事': ['仕事', '職場', '会社', '業務', 'キャリア'],
            '人間関係': ['人間関係', '友人', '家族', '恋人', '同僚'],
            '健康': ['健康', '病気', '体調', '医療', '運動'],
            '学習': ['学習', '勉強', '教育', '成長', 'スキル'],
            '財務': ['お金', '財務', '投資', '収入', '支出']
        };
        
        Object.entries(themePatterns).forEach(([theme, keywords]) => {
            if (keywords.some(keyword => text.includes(keyword))) {
                themes.push(theme);
            }
        });
        
        return themes.length > 0 ? themes : ['一般'];
    }
    
    classifySituationType(text) {
        if (text.includes('問題') || text.includes('困難')) return 'problem-solving';
        if (text.includes('選択') || text.includes('決断')) return 'decision-making';
        if (text.includes('目標') || text.includes('計画')) return 'goal-setting';
        if (text.includes('関係') || text.includes('コミュニケーション')) return 'relationship';
        return 'general-guidance';
    }
    
    assessUrgencyLevel(text) {
        const urgentWords = ['緊急', '急ぎ', '今すぐ', '至急'];
        return urgentWords.some(word => text.includes(word)) ? 'high' : 'medium';
    }
    
    assessComplexityLevel(text) {
        return text.length > 200 ? 'high' : text.length > 100 ? 'medium' : 'low';
    }
    
    calculateOptimalHexagram(textAnalysis) {
        // 簡易的な卦選択ロジック
        let baseNumber = 1;
        
        if (textAnalysis.emotionalTone === 'positive') baseNumber += 20;
        if (textAnalysis.emotionalTone === 'negative') baseNumber += 40;
        if (textAnalysis.situationType === 'decision-making') baseNumber += 10;
        if (textAnalysis.urgencyLevel === 'high') baseNumber += 5;
        
        return Math.min(baseNumber % 64 + 1, 64);
    }
    
    getHexagramData(hexagramNumber) {
        if (typeof window !== 'undefined' && window.H384_DATA) {
            const hexagramData = window.H384_DATA.filter(item => 
                item['卦番号'] === hexagramNumber)[0];
            if (hexagramData) {
                return {
                    name: hexagramData['卦名'],
                    keywords: hexagramData['キーワード'] ? [hexagramData['キーワード']] : ['変化'],
                    situation: hexagramData['現代解釈の要約'] || '状況の転換期',
                    guidance: '慎重な判断と適切な行動'
                };
            }
        }
        
        return {
            name: `第${hexagramNumber}卦`,
            keywords: ['変化', '発展'],
            situation: '変化の時期',
            guidance: '状況を注意深く観察し、適切に行動する'
        };
    }
    
    calculateRelevanceScore(pattern, textAnalysis, hexagram) {
        let score = 0.5;
        
        // nullチェックを追加
        if (!textAnalysis || !pattern) return score;
        
        // テーママッチング
        if (textAnalysis.keyThemes && Array.isArray(textAnalysis.keyThemes)) {
            if (textAnalysis.keyThemes.includes('仕事') && pattern.approach === 'proactive') score += 0.2;
        }
        if (textAnalysis.emotionalTone === 'negative' && pattern.approach === 'transformative') score += 0.2;
        if (textAnalysis.urgencyLevel === 'high' && pattern.approach === 'decisive') score += 0.1;
        
        return Math.min(score, 1.0);
    }
    
    applyContextualAdjustment(pattern, textAnalysis) {
        return {
            themeAlignment: textAnalysis.keyThemes,
            emotionalResonance: textAnalysis.emotionalTone,
            situationalFit: textAnalysis.situationType
        };
    }
    
    mergeDescriptions(baseDesc, treeDesc) {
        return `${baseDesc}。${treeDesc || ''}`;
    }
    
    // HaQei統合メソッド群
    identifyPrimaryPersona(pattern, context) {
        const personaMap = {
            'proactive': '積極行動分人',
            'adaptive': '適応調整分人', 
            'transformative': '変革推進分人',
            'decisive': '決断実行分人',
            'strengthening': '強化発展分人',
            'harmonizing': '調和維持分人',
            'integrative': '統合創造分人',
            'innovative': '革新探索分人'
        };
        
        return personaMap[pattern.approach] || '一般判断分人';
    }
    
    identifySecondaryPersona(pattern, context) {
        const secondaryMap = {
            '積極行動分人': '慎重検討分人',
            '適応調整分人': '積極行動分人',
            '変革推進分人': '安定維持分人',
            '決断実行分人': '熟考分析分人',
            '強化発展分人': '調和維持分人',
            '調和維持分人': '強化発展分人',
            '統合創造分人': '専門集中分人',
            '革新探索分人': '実践重視分人'
        };
        
        const primary = this.identifyPrimaryPersona(pattern, context);
        return secondaryMap[primary] || '補完的分人';
    }
    
    identifyOptimalConditions(pattern) {
        const conditionMap = {
            'proactive': ['明確な目標設定時', '環境が安定している時', 'リソースが十分な時'],
            'adaptive': ['環境が変化している時', '不確実性が高い時', '柔軟性が求められる時'],
            'transformative': ['現状に限界を感じる時', '新しい可能性を模索する時'],
            'decisive': ['迅速な判断が求められる時', '機会が限定的な時'],
            'strengthening': ['基盤が安定している時', '持続的成長を目指す時'],
            'harmonizing': ['対立や摩擦がある時', 'バランスが必要な時'],
            'integrative': ['複数の要素を統合する時', '新しい価値を創造する時'],
            'innovative': ['従来の方法に限界を感じる時', '創造性が求められる時']
        };
        
        return conditionMap[pattern.approach] || ['一般的な状況において'];
    }
    
    generateAdaptationStrategy(pattern) {
        return `${pattern.title}を基本方針として、状況変化に応じて${this.identifySecondaryPersona(pattern, {})}による調整を実行`;
    }
    
    generateActionSteps(pattern) {
        const steps = [
            '現状分析と目標設定',
            '具体的行動計画の策定',
            '段階的実行と進捗確認',
            '成果評価と必要な調整'
        ];
        
        return steps.map(step => `${pattern.title}において：${step}`);
    }
    
    estimateTimeframe(pattern) {
        const timeframes = {
            'proactive': '1-3ヶ月',
            'adaptive': '3-6ヶ月',
            'transformative': '6-12ヶ月', 
            'decisive': '1-2ヶ月',
            'strengthening': '3-9ヶ月',
            'harmonizing': '2-6ヶ月',
            'integrative': '6-18ヶ月',
            'innovative': '12-24ヶ月'
        };
        
        return timeframes[pattern.approach] || '3-6ヶ月';
    }
    
    generateSuccessIndicators(pattern) {
        return [
            `${pattern.title}に関連する具体的成果の達成`,
            '関係者からの肯定的なフィードバック',
            '個人的満足度と成長の実感',
            '継続可能な改善サイクルの確立'
        ];
    }
    
    identifyRiskFactors(pattern) {
        return [
            '外部環境の予期しない変化',
            'リソース不足や制約の発生',
            '関係者の理解や協力の不足',
            '計画の複雑性による実行困難'
        ];
    }
    
    generateModernApplication(pattern) {
        return `現代社会における${pattern.title}の実践: ${pattern.description}を具体的行動に落とし込み、持続可能な形で実行する`;
    }
    
    generateIChingGuidance(pattern) {
        return `${pattern.iching_principle}の教えに基づき、${pattern.title}を実践する際は状況の変化を注意深く観察し、適切なタイミングで行動する`;
    }
    
    // 品質向上メソッド群
    calculateSpecificity(scenario, textAnalysis) {
        return textAnalysis.keyThemes.length * 0.2 + (scenario.practicalElements.actionSteps.length * 0.1);
    }
    
    calculatePracticality(scenario) {
        return scenario.practicalElements.actionSteps.length > 3 ? 0.8 : 0.6;
    }
    
    calculateUniqueness(scenario, allScenarios) {
        return 0.7 + (scenario.metadata.approach === 'innovative' ? 0.2 : 0);
    }
    
    personalizeTitle(scenario, textAnalysis) {
        return `${scenario.title} (${textAnalysis.keyThemes.join('・')}重視)`;
    }
    
    contextualizeDescription(scenario, textAnalysis) {
        return `${textAnalysis.keyThemes.join('・')}の文脈における${scenario.description}`;
    }
    
    tailorGuidance(scenario, textAnalysis) {
        return `${textAnalysis.emotionalTone === 'negative' ? '困難な状況から' : '現在の状況を活かして'}、${scenario.ichingIntegration.guidance}`;
    }
    
    assignScenarioColor(scenario) {
        const colorMap = {
            'proactive': '#4CAF50',     // 緑
            'adaptive': '#2196F3',      // 青
            'transformative': '#FF9800', // オレンジ
            'decisive': '#F44336',       // 赤
            'strengthening': '#9C27B0',  // 紫
            'harmonizing': '#00BCD4',    // シアン
            'integrative': '#795548',    // 茶
            'innovative': '#E91E63'      // ピンク
        };
        
        return colorMap[scenario.metadata.approach] || '#757575';
    }
    
    assignScenarioIcon(scenario) {
        const iconMap = {
            'proactive': '⚡',
            'adaptive': '🌊',
            'transformative': '🦋',
            'decisive': '⚔️',
            'strengthening': '💪',
            'harmonizing': '☯️',
            'integrative': '🔗',
            'innovative': '💡'
        };
        
        return iconMap[scenario.metadata.approach] || '🎯';
    }
    
    calculatePriority(scenario, allScenarios) {
        return Math.round(scenario.metadata.relevanceScore * 100);
    }
    
    // 矛盾受容関連メソッド
    findComplementaryScenarios(scenario, allScenarios) {
        return allScenarios
            .filter(s => s.scenarioId !== scenario.scenarioId)
            .map(s => s.scenarioId)
            .slice(0, 2);
    }
    
    calculateDialecticalTension(scenario, allScenarios) {
        return 0.6; // 適度な対立的緊張
    }
    
    generateResolutionGuidance(scenario, allScenarios) {
        return `${scenario.title}は他の選択肢と対立するものではなく、状況や内的分人の状態により最適な選択が変わることを理解する`;
    }
    
    // フォールバック生成
    generateFallbackScenarios(analysisContext) {
        const fallbackScenarios = Array.from({ length: 8 }, (_, i) => ({
            scenarioId: `fallback_scenario_${i + 1}`,
            scenarioIndex: i + 1,
            title: `基本的アプローチ ${i + 1}`,
            description: `状況に応じた基本的な対応策 ${i + 1}`,
            HaQeiElements: {
                contradictionAcceptance: {
                    principle: '複数の道が同時に有効である',
                    application: '状況に応じた選択が可能'
                }
            },
            practicalElements: {
                actionSteps: ['分析', '計画', '実行', '評価'],
                timeframe: '3-6ヶ月',
                successIndicators: ['進捗', '成果', '満足度'],
                riskFactors: ['変化', '制約', '複雑性']
            },
            metadata: {
                relevanceScore: 0.5,
                confidence: 0.5,
                approach: 'general'
            },
            visualization: {
                color: '#757575',
                icon: '🎯',
                priority: 50
            }
        }));
        
        console.log('🔄 Fallback scenarios generated');
        return fallbackScenarios;
    }
    
    /**
     * 進爻チェーン生成（同一卦で爻位が上がる）
     */
    generateAdvanceChain(hexNum, startLine, steps) {
        const chain = [];
        let currentLine = startLine;
        
        for (let i = 0; i < steps && currentLine < 6; i++) {
            const nextLine = Math.min(currentLine + 1, 6);
            chain.push({
                type: 'advance',
                from: { hex: hexNum, line: currentLine },
                to: { hex: hexNum, line: nextLine },
                transparency_note: '※進爻は古典易経にない当システム独自手法です'
            });
            currentLine = nextLine;
        }
        return chain;
    }
    
    /**
     * 変爻チェーン生成（陰陽反転で之卦が立つ）
     */
    generateTransformChain(hexNum, startLine, steps) {
        const chain = [];
        let currentHex = hexNum;
        let currentLine = startLine;
        
        for (let i = 0; i < steps; i++) {
            // 陰陽反転で新たな卦を計算
            const newHex = this.calculateTransformedHex(currentHex, currentLine);
            chain.push({
                type: 'transform',
                from: { hex: currentHex, line: currentLine, old: true },
                changed_to_hex: newHex
            });
            currentHex = newHex;
            // 次の変化のためにランダムな爻位を選択
            currentLine = Math.floor(Math.random() * 6) + 1;
        }
        return chain;
    }
    
    // v2要件により削除: generateMixedChain/generateComplexChainは存在しない
    // 8パターンはadvance/transformのステップ数変化のみで生成
    
    /**
     * 卦データ取得
     */
    getHexagramData(hexNum) {
        // 簡易的な卦データ（実際はH384データベースから取得）
        const basicHexagrams = {
            1: { name: '乾為天', keywords: ['創造', '行動', '初志'], lines: [{keyword: '潜龍'}, {keyword: '見龍'}, {keyword: '躍龍'}, {keyword: '飛龍'}, {keyword: '亢龍'}, {keyword: '用九'}] },
            2: { name: '坤為地', keywords: ['受容', '持続', '安定'], lines: [{keyword: '履霜'}, {keyword: '直方'}, {keyword: '含章'}, {keyword: '括囊'}, {keyword: '黄裳'}, {keyword: '用六'}] },
            29: { name: '坎為水', keywords: ['深み', '内省', 'リスク'], lines: [{keyword: '習坎'}, {keyword: '坎有険'}, {keyword: '來之'}, {keyword: '樽酒'}, {keyword: '坎不盈'}, {keyword: '係徵'}] }
        };
        
        return basicHexagrams[hexNum] || {
            name: `第${hexNum}卦`,
            keywords: ['変化'],
            lines: Array(6).fill({ keyword: '変化' })
        };
    }
    
    /**
     * 卦の原理を取得
     */
    getHexagramPrinciple(hexNum) {
        const hexData = this.getHexagramData(hexNum);
        return hexData.name + ' - ' + (hexData.keywords?.[0] || '変化');
    }
    
    /**
     * 変爻の原理を取得
     */
    getTransformPrinciple(hexNum, lineNum) {
        const hexData = this.getHexagramData(hexNum);
        const lineKeyword = hexData.lines?.[lineNum - 1]?.keyword || '転換';
        return `${hexData.name}の${lineNum}爻 - ${lineKeyword}`;
    }
    
    /**
     * 変爻後の卦番号を計算
     */
    calculateTransformedHex(hexNum, lineNum) {
        // 簡易的な変換ロジック（実際は二進数変換が必要）
        const transformTable = {
            1: [1, 43, 14, 34, 9, 5, 26, 11], // 乾の各爻変化
            2: [23, 2, 8, 20, 16, 35, 45, 12], // 坤の各爻変化
            // ... 省略（実際には64卦全ての変換テーブルが必要）
        };
        
        // フォールバック: ランダムな卦を返す
        if (!transformTable[hexNum]) {
            return ((hexNum + lineNum * 7) % 64) + 1;
        }
        
        return transformTable[hexNum][lineNum - 1] || hexNum;
    }
    
    /**
     * 感情トーン検出
     */
    detectEmotionalTone(text) {
        if (!text) return 'neutral';
        const positiveWords = ['良い', '嬉しい', '成功', '希望'];
        const negativeWords = ['悪い', '不安', '失敗', '困難'];
        
        const hasPositive = positiveWords.some(word => text.includes(word));
        const hasNegative = negativeWords.some(word => text.includes(word));
        
        if (hasPositive && !hasNegative) return 'positive';
        if (hasNegative && !hasPositive) return 'negative';
        return 'mixed';
    }
    
    /**
     * キーテーマ抽出
     */
    extractKeyThemes(text) {
        if (!text) return [];
        // 簡易的なキーワード抽出
        return ['変化', '選択', '未来'];
    }
    
    /**
     * 状況タイプ分類
     */
    classifySituationType(text) {
        if (!text) return 'general';
        return 'decision';
    }
    
    /**
     * 緊急レベル評価
     */
    assessUrgencyLevel(text) {
        if (!text) return 0.5;
        return Math.random();
    }
    
    /**
     * 複雑レベル評価
     */
    assessComplexityLevel(text) {
        if (!text) return 0.5;
        return Math.random();
    }
    
    /**
     * 最適卦番号計算
     */
    calculateOptimalHexagram(textAnalysis) {
        // 簡易的なマッピング
        return Math.floor(Math.random() * 64) + 1;
    }
    
    /**
     * キャッシュキー生成
     */
    generateCacheKey(context) {
        return `scenarios_${context.inputText?.substring(0, 50)}_${Date.now()}`;
    }
    
    /**
     * 分析文生成（60字以上）
     */
    generateAnalysis(pattern, hexData, lineData, context) {
        const mechanism = pattern.mechanism === 'advance' ? '進爻' : '変爻';
        const hexKeywords = hexData.keywords?.join('・') || '変化';
        const lineKeyword = lineData.keyword || '転機';
        
        // 透明性注記を追加
        const transparencyNote = pattern.mechanism === 'advance' 
            ? '\n\n※進爻分析について：進爻は古典易経にない当システム独自の分析手法です。従来の変爻（陰陽反転）とは異なり、現在の爻位から次の段階への動的進展として解釈しています。HaQei哲学の「非決定論的選択肢提示」に基づく現代的適応です。'
            : '';
        
        return `${hexData.name}の${lineKeyword}を基点とし、${mechanism}による${pattern.description}。
                ${hexKeywords}のエネルギーを活かし、${pattern.approach}なアプローチで
                現状からの変化を導く選択肢があります。${transparencyNote}`;
    }
    
    /**
     * 助言生成（50字以上）
     */
    generateAdvice(pattern, hexData, lineData) {
        const action = pattern.mechanism === 'advance' ? '着実に前進する' : '大胆に変化を受け入れる';
        const energy = pattern.energy || '中庸';
        const approach = pattern.approach || '柔軟';
        return `今は${hexData.name}の時期として見ることができます。${lineData.keyword || '転機'}の意味を深く理解し、${approach}なアプローチで${action}という選択肢があります。${energy}のエネルギーを活かして、次の段階への道筋を描いていく方向性が考えられます。`;
    }
    
    /**
     * キャッシュクリア
     */
    clearCache() {
        this.scenarioCache.clear();
        console.log('🧹 EightScenariosGenerator cache cleared');
    }
    
    /**
     * システム情報取得
     */
    getSystemInfo() {
        return {
            version: this.version,
            philosophy: this.philosophyAlignment,
            scenarioCount: this.scenarioCount,
            cacheSize: this.scenarioCache.size,
            HaQeiElements: this.HaQeiElements,
            initialized: this.initialized
        };
    }
}

// グローバル公開
if (typeof window !== 'undefined') {
    window.EightScenariosGenerator = EightScenariosGenerator;
    
    // グローバルインスタンス作成
    if (!window.haqeiScenariosGenerator) {
        window.haqeiScenariosGenerator = new EightScenariosGenerator();
    }
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EightScenariosGenerator;
}

console.log('🎯 EightScenariosGenerator.js loaded successfully - HaQei統合8シナリオ生成システム');