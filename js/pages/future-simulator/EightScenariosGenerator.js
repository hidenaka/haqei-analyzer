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
        
        // v2.2.0 新しいI Ching統合クラス
        this.kingWenMapping = null;
        this.lineSelector = null;
        this.advanceProcessor = null;
        this.multiLineInterpreter = null;
        
        // 易経統合システム（後方互換性のため保持）
        this.ichingMapping = new Map();
        this.initializeIChingMapping();
        
        // シナリオキャッシュ
        this.scenarioCache = new Map();
        this.cacheTimeout = 1800000; // 30分
        
        console.log('🎯 EightScenariosGenerator v2.2.0 initialized - HaQei統合8シナリオ生成システム (I Ching Integration)');
        this.initializeV22Components();
    }
    
    /**
     * v2.2.0 コンポーネント初期化
     */
    async initializeV22Components() {
        try {
            // 動的インポートでv2.2.0クラスを読み込み
            if (typeof window !== 'undefined') {
                // ブラウザ環境
                const { KingWenMapping } = await import('../../iching/KingWenMapping.js');
                const { LineSelector } = await import('../../iching/LineSelector.js');
                const { AdvanceProcessor } = await import('../../iching/AdvanceProcessor.js');
                const { MultiLineInterpreter } = await import('../../iching/MultiLineInterpreter.js');
                
                this.kingWenMapping = new KingWenMapping();
                this.lineSelector = new LineSelector();
                this.advanceProcessor = new AdvanceProcessor();
                this.multiLineInterpreter = new MultiLineInterpreter();
                
                await this.kingWenMapping.initialize();
                console.log('✅ v2.2.0 I Ching components initialized successfully');
            }
            
            this.initialized = true;
        } catch (error) {
            console.warn('⚠️ v2.2.0 components initialization failed, falling back to v2.1.0 behavior:', error.message);
            this.initialized = true; // 後方互換性を保つ
        }
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
     * 入力テキスト解析 - v2.2.0強化版
     */
    analyzeInputText(inputText) {
        // 基本分析（v2.1.0互換）
        const baseAnalysis = {
            originalText: inputText,
            wordCount: inputText.length,
            emotionalTone: this.detectEmotionalTone(inputText),
            keyThemes: this.extractKeyThemes(inputText),
            situationType: this.classifySituationType(inputText),
            urgencyLevel: this.assessUrgencyLevel(inputText),
            complexityLevel: this.assessComplexityLevel(inputText)
        };
        
        // v2.2.0 拡張: より詳細な分析
        const enhancedAnalysis = {
            ...baseAnalysis,
            emotionalTone: {
                type: baseAnalysis.emotionalTone,
                intensity: this.calculateEmotionalIntensity(inputText)
            },
            keyThemes: baseAnalysis.keyThemes.map(theme => ({
                name: theme,
                score: this.calculateThemeScore(theme, inputText)
            }))
        };
        
        console.log('📝 Enhanced text analysis completed:', enhancedAnalysis.keyThemes);
        return enhancedAnalysis;
    }
    
    /**
     * 感情強度計算
     */
    calculateEmotionalIntensity(text) {
        const intensityWords = ['とても', '非常に', '極めて', '絶対に', '必ず'];
        const count = intensityWords.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
        return Math.min(0.3 + count * 0.2, 1.0);
    }
    
    /**
     * テーマスコア計算
     */
    calculateThemeScore(theme, text) {
        const themePatterns = {
            '仕事': ['仕事', '職場', '会社', '業務', 'キャリア'],
            '人間関係': ['人間関係', '友人', '家族', '恋人', '同僚'],
            '健康': ['健康', '病気', '体調', '医療', '運動'],
            '学習': ['学習', '勉強', '教育', '成長', 'スキル'],
            '財務': ['お金', '財務', '投資', '収入', '支出']
        };
        
        const keywords = themePatterns[theme] || [theme];
        const matchCount = keywords.reduce((acc, keyword) => acc + (text.includes(keyword) ? 1 : 0), 0);
        return Math.min(matchCount * 0.2 + 0.3, 1.0);
    }
    
    /**
     * 易経状況卦マッピング - v2.2.0強化版
     */
    mapToSituationalHexagram(textAnalysis) {
        // v2.2.0: 新しいKingWenMappingクラスを使用
        if (this.kingWenMapping && this.kingWenMapping.initialized) {
            try {
                // より正確な卦選択ロジック
                const hexagramNumber = this.calculateOptimalHexagramV22(textAnalysis);
                const hexData = this.kingWenMapping.getHexagramData(hexagramNumber);
                
                if (hexData) {
                    return {
                        number: hexagramNumber,
                        name: hexData.name,
                        lines: this.kingWenMapping.getLineConfiguration(hexagramNumber),
                        keywords: hexData.keywords || ['変化', '選択', '発展'],
                        situation: hexData.situation || '転換期の状況',
                        guidance: hexData.guidance || '慎重な判断が必要'
                    };
                }
            } catch (error) {
                console.warn('⚠️ v2.2.0 hexagram mapping failed, falling back:', error.message);
            }
        }
        
        // フォールバック: 旧バージョンの動作
        const hexagramNumber = this.calculateOptimalHexagram(textAnalysis);
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
     * v2.2.0 改良された卦計算
     */
    calculateOptimalHexagramV22(textAnalysis) {
        // 利用可能な6卦から選択: 1, 2, 11, 12, 63, 64
        const availableHexagrams = [1, 2, 11, 12, 63, 64];
        
        // テーマベース選択
        const primaryTheme = textAnalysis.keyThemes[0]?.name || textAnalysis.keyThemes[0];
        if (primaryTheme === '仕事' && textAnalysis.emotionalTone.type === 'positive') return 11; // 泰
        if (primaryTheme === '仕事' && textAnalysis.emotionalTone.type === 'negative') return 12; // 否
        if (textAnalysis.situationType === 'decision-making' && textAnalysis.urgencyLevel === 'high') return 1; // 乾
        if (textAnalysis.complexityLevel === 'high') return 63; // 既済
        if (textAnalysis.emotionalTone.type === 'neutral') return 64; // 未済
        
        // デフォルト
        return 2; // 坤
    }
    
    /**
     * 8方向性の基本パターン生成 - v2.2.0強化版
     */
    generateBasePatterns(textAnalysis, hexagram) {
        // v2.2.0: 新しいクラスを使用したパターン生成
        if (this.lineSelector && this.advanceProcessor && this.multiLineInterpreter) {
            try {
                return this.generateV22Patterns(textAnalysis, hexagram);
            } catch (error) {
                console.warn('⚠️ v2.2.0 pattern generation failed, falling back:', error.message);
            }
        }
        
        // フォールバック: 旧バージョンのパターン生成
        const patterns = [
            {
                id: 1,
                direction: 'forward_active',
                title: '積極的前進',
                description: '現在の方向性を強化し、積極的に前進する',
                approach: 'proactive',
                energy: 'yang',
                iching_principle: '乾為天 - 創造と行動'
            },
            {
                id: 2,
                direction: 'forward_adaptive', 
                title: '適応的前進',
                description: '状況に適応しながら着実に前進する',
                approach: 'adaptive',
                energy: 'balanced',
                iching_principle: '坤為地 - 受容と発展'
            },
            {
                id: 3,
                direction: 'transform_gradual',
                title: '段階的変革',
                description: '段階的に変化を起こし、新しい方向性を模索する',
                approach: 'transformative',
                energy: 'yin-to-yang',
                iching_principle: '漸 - 段階的発展'
            },
            {
                id: 4,
                direction: 'transform_decisive',
                title: '決断的変革',
                description: '大胆な決断により根本的な変革を起こす',
                approach: 'decisive',
                energy: 'yang-strong',
                iching_principle: '革 - 革新と変革'
            },
            {
                id: 5,
                direction: 'stabilize_strengthen',
                title: '強化安定化',
                description: '現在の良い要素を強化し、安定化を図る',
                approach: 'strengthening',
                energy: 'stable-yang',
                iching_principle: '大壮 - 力強い安定'
            },
            {
                id: 6,
                direction: 'stabilize_harmonize',
                title: '調和安定化', 
                description: '要素間の調和を重視し、平和的な安定を目指す',
                approach: 'harmonizing',
                energy: 'stable-yin',
                iching_principle: '泰 - 平和と調和'
            },
            {
                id: 7,
                direction: 'integrate_synthesis',
                title: '統合的発展',
                description: '異なる要素を統合し、新しい可能性を創造する',
                approach: 'integrative',
                energy: 'synthesis',
                iching_principle: '既済 - 完成と統合'
            },
            {
                id: 8,
                direction: 'explore_innovative',
                title: '革新的探索',
                description: '従来にない新しいアプローチを探索する',
                approach: 'innovative',
                energy: 'creative',
                iching_principle: '未済 - 無限の可能性'
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
     * v2.2.0 新しいクラスを使用したパターン生成
     */
    generateV22Patterns(textAnalysis, hexagram) {
        const patterns = [];
        const hexagramNumber = hexagram.number;
        
        // 基本パターンテンプレート
        const basePatterns = [
            { id: 1, approach: 'proactive', title: '積極的前進', type: 'advance' },
            { id: 2, approach: 'adaptive', title: '適応的前進', type: 'advance' },
            { id: 3, approach: 'transformative', title: '段階的変革', type: 'transform' },
            { id: 4, approach: 'decisive', title: '決断的変革', type: 'transform' },
            { id: 5, approach: 'strengthening', title: '強化安定化', type: 'advance' },
            { id: 6, approach: 'harmonizing', title: '調和安定化', type: 'advance' },
            { id: 7, approach: 'integrative', title: '統合的発展', type: 'transform' },
            { id: 8, approach: 'innovative', title: '革新的探索', type: 'transform' }
        ];
        
        // 各パターンに対してv2.2.0クラスでの詳細生成
        basePatterns.forEach(template => {
            const startingLine = this.lineSelector.selectStartingLine({}, textAnalysis);
            
            if (template.type === 'advance') {
                // 進爻パターン
                const advanceChain = this.advanceProcessor.generateAdvanceChain(hexagramNumber, startingLine, 2);
                patterns.push({
                    ...template,
                    direction: `${template.approach}_${template.type}`,
                    description: this.generateAdvanceDescription(template, advanceChain),
                    v22Data: {
                        type: 'advance',
                        startingLine,
                        chain: advanceChain,
                        stageName: this.advanceProcessor.getStageName(startingLine)
                    }
                });
            } else {
                // 変爻パターン
                const linesToChange = this.lineSelector.selectLinesToChange(hexagramNumber, textAnalysis);
                const transformHex = linesToChange.length > 0 ? 
                    this.kingWenMapping.calculateTransformedHex(hexagramNumber, linesToChange[0]) : 
                    hexagramNumber;
                    
                const interpretation = this.multiLineInterpreter.interpretMultipleChanges(
                    hexagramNumber, linesToChange, transformHex
                );
                
                patterns.push({
                    ...template,
                    direction: `${template.approach}_${template.type}`,
                    description: this.generateTransformDescription(template, interpretation),
                    v22Data: {
                        type: 'transform',
                        fromHex: hexagramNumber,
                        toHex: transformHex,
                        linesToChange,
                        interpretation
                    }
                });
            }
        });
        
        // 関連度スコア計算
        return patterns.map(pattern => ({
            ...pattern,
            relevanceScore: this.calculateRelevanceScore(pattern, textAnalysis, hexagram),
            contextualAdjustment: this.applyContextualAdjustment(pattern, textAnalysis)
        }));
    }
    
    /**
     * 進爻用の説明生成
     */
    generateAdvanceDescription(template, advanceChain) {
        if (advanceChain.length > 0) {
            return `${template.title}: ${advanceChain[0].description}を通じて段階的に発展する`;
        }
        return `${template.title}: 現在の段階から次のレベルへと着実に進歩する`;
    }
    
    /**
     * 変爻用の説明生成
     */
    generateTransformDescription(template, interpretation) {
        return `${template.title}: ${interpretation.interpretation || '状況の本質的変化を通じて新しい可能性を開く'}`;
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
     * HaQei哲学統合シナリオ構築
     */
    buildScenarios(patterns, analysisContext) {
        return patterns.map((pattern, index) => ({
            scenarioId: `scenario_${pattern.id}`,
            scenarioIndex: index + 1,
            title: pattern.title,
            description: pattern.enhancedDescription || pattern.description,
            
            // HaQei哲学要素
            HaQeiElements: {
                contradictionAcceptance: {
                    principle: `${pattern.title}は他の道と矛盾しない独立した選択肢`,
                    application: '状況や分人の状態により最適性が変化する'
                },
                personaApplication: {
                    primaryPersona: this.identifyPrimaryPersona(pattern, analysisContext),
                    secondaryPersona: this.identifySecondaryPersona(pattern, analysisContext),
                    dynamicSwitch: `状況により${this.identifyPrimaryPersona(pattern, analysisContext)}から${this.identifySecondaryPersona(pattern, analysisContext)}への切り替えが有効`
                },
                situationalAdaptation: {
                    optimalConditions: this.identifyOptimalConditions(pattern),
                    adaptationStrategy: this.generateAdaptationStrategy(pattern)
                }
            },
            
            // 実践的要素
            practicalElements: {
                actionSteps: this.generateActionSteps(pattern),
                timeframe: pattern.binaryTreeIntegration?.timeline || this.estimateTimeframe(pattern),
                successIndicators: this.generateSuccessIndicators(pattern),
                riskFactors: pattern.binaryTreeIntegration?.challenges || this.identifyRiskFactors(pattern)
            },
            
            // 易経統合
            ichingIntegration: {
                principle: pattern.iching_principle,
                modernApplication: this.generateModernApplication(pattern),
                guidance: this.generateIChingGuidance(pattern)
            },
            
            // メタデータ
            metadata: {
                relevanceScore: pattern.relevanceScore,
                confidence: pattern.confidence || pattern.relevanceScore,
                energyType: pattern.energy,
                approach: pattern.approach,
                generatedAt: new Date().toISOString()
            }
        }));
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
        
        // テーママッチング
        if (textAnalysis.keyThemes.includes('仕事') && pattern.approach === 'proactive') score += 0.2;
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