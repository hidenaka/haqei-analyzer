/**
 * HAQEI Dynamic Keyword Generator - Phase 1 Implementation
 * 動的キーワード生成システム - bunenjin哲学準拠
 * 
 * 実装日: 2025年8月6日
 * 担当: HAQEI Programming Agent  
 * 目的: 入力テキストから文脈的キーワードを生成し、I Ching分析を強化
 */

class DynamicKeywordGenerator {
    constructor() {
        this.initialized = false;
        this.keywordCache = new Map();
        this.contextPatterns = this.initializeContextPatterns();
        this.emotionalPatterns = this.initializeEmotionalPatterns();
        this.actionPatterns = this.initializeActionPatterns();
        this.temporalPatterns = this.initializeTemporalPatterns();
        this.metaphorPatterns = this.initializeMetaphorPatterns();
        
        console.log('🔧 DynamicKeywordGenerator initialized - Phase 1');
    }

    /**
     * メイン動的キーワード生成メソッド
     * P1-001-1: generateDynamicKeywords メソッド完全実装
     */
    generateDynamicKeywords(inputText, context = {}) {
        try {
            console.log('🔍 Generating dynamic keywords for:', inputText.substring(0, 50));
            
            if (!inputText || typeof inputText !== 'string') {
                throw new Error('有効な入力テキストが必要です');
            }

            // キャッシュキーの生成
            const cacheKey = this.generateCacheKey(inputText, context);
            if (this.keywordCache.has(cacheKey)) {
                console.log('✅ Using cached keywords');
                return this.keywordCache.get(cacheKey);
            }

            // 6つの主要メソッドによる包括的キーワード生成
            const keywords = {
                situational: this.generateSituationalKeywords(inputText),
                emotional: this.generateEmotionalKeywords(inputText),
                contextual: this.generateContextualKeywords(inputText, context),
                action: this.generateActionKeywords(inputText),
                temporal: this.generateTemporalKeywords(inputText),
                metaphor: this.generateMetaphorKeywords(inputText)
            };

            // 統合処理とフィルタリング
            const integratedKeywords = this.integrateAndFilterKeywords(keywords, context);
            
            // キャッシュに保存
            this.keywordCache.set(cacheKey, integratedKeywords);
            
            console.log('✅ Dynamic keywords generated successfully:', Object.keys(integratedKeywords).length, 'categories');
            return integratedKeywords;

        } catch (error) {
            console.error('❌ Error in generateDynamicKeywords:', error);
            return this.generateFallbackKeywords(inputText);
        }
    }

    /**
     * P1-001-2: extractKeywordsFromTokens による自然言語処理強化
     */
    extractKeywordsFromTokens(inputText) {
        try {
            // 基本的なトークン化（kuromoji.jsが利用可能な場合は後で拡張）
            const tokens = this.basicTokenize(inputText);
            
            const keywords = [];
            
            tokens.forEach(token => {
                if (this.isSignificantToken(token)) {
                    keywords.push({
                        word: token.surface || token,
                        reading: token.reading || '',
                        partOfSpeech: token.part_of_speech || 'unknown',
                        significance: this.calculateTokenSignificance(token)
                    });
                }
            });

            return this.rankKeywords(keywords);

        } catch (error) {
            console.error('❌ Error in extractKeywordsFromTokens:', error);
            return this.basicWordExtraction(inputText);
        }
    }

    /**
     * P1-001-3: getRelatedWords による関連語彙拡張
     */
    getRelatedWords(baseKeywords) {
        try {
            const relatedWords = [];
            
            baseKeywords.forEach(keyword => {
                const relations = this.findSemanticRelations(keyword);
                relatedWords.push(...relations);
            });

            return this.deduplicateAndRank(relatedWords);

        } catch (error) {
            console.error('❌ Error in getRelatedWords:', error);
            return baseKeywords; // フォールバック
        }
    }

    /**
     * P1-001-4: generateStemRelated による語幹分析実装
     */
    generateStemRelated(keyword) {
        try {
            const stems = [];
            
            // 日本語語幹分析（簡易版）
            if (this.isJapanese(keyword)) {
                stems.push(...this.extractJapaneseStem(keyword));
            }
            
            // 英語語幹分析
            if (this.isEnglish(keyword)) {
                stems.push(...this.extractEnglishStem(keyword));
            }

            return stems;

        } catch (error) {
            console.error('❌ Error in generateStemRelated:', error);
            return [keyword];
        }
    }

    /**
     * P1-001-5: generateEmotionalKeywords による感情分析機能
     */
    generateEmotionalKeywords(inputText) {
        try {
            const emotionalKeywords = [];
            
            // 感情パターンマッチング
            Object.entries(this.emotionalPatterns).forEach(([emotion, patterns]) => {
                patterns.forEach(pattern => {
                    if (inputText.match(pattern.regex)) {
                        emotionalKeywords.push({
                            keyword: pattern.keyword,
                            emotion: emotion,
                            intensity: pattern.intensity,
                            context: 'emotional',
                            bunenjinAspect: this.mapToBunenjinAspect(emotion)
                        });
                    }
                });
            });

            return this.rankEmotionalKeywords(emotionalKeywords);

        } catch (error) {
            console.error('❌ Error in generateEmotionalKeywords:', error);
            return this.getBasicEmotionalKeywords(inputText);
        }
    }

    /**
     * P1-001-6: basicKeywordExpansion によるキーワード拡張基盤
     */
    basicKeywordExpansion(coreKeywords) {
        try {
            const expandedKeywords = [...coreKeywords];
            
            coreKeywords.forEach(keyword => {
                // 同義語拡張
                const synonyms = this.getSynonyms(keyword);
                expandedKeywords.push(...synonyms);
                
                // 関連語拡張
                const related = this.getRelatedTerms(keyword);
                expandedKeywords.push(...related);
                
                // 文脈的拡張
                const contextual = this.getContextualVariants(keyword);
                expandedKeywords.push(...contextual);
            });

            return this.deduplicateAndRank(expandedKeywords);

        } catch (error) {
            console.error('❌ Error in basicKeywordExpansion:', error);
            return coreKeywords;
        }
    }

    // ========================================
    // 支援メソッド群
    // ========================================

    generateSituationalKeywords(inputText) {
        const situationalKeywords = [];
        
        // 状況分析パターン
        const situationPatterns = {
            work: /仕事|職場|転職|昇進|同僚|上司|部下|会社|業務/g,
            relationship: /恋愛|結婚|夫婦|家族|友人|人間関係|別れ|出会い/g,
            health: /健康|病気|医者|治療|症状|体調|医療|診察/g,
            money: /お金|財産|投資|借金|収入|支出|経済|金銭/g,
            education: /勉強|学習|資格|試験|教育|学校|大学|スキル/g,
            future: /将来|未来|計画|目標|夢|希望|不安|心配/g
        };

        Object.entries(situationPatterns).forEach(([category, pattern]) => {
            const matches = inputText.match(pattern);
            if (matches) {
                situationalKeywords.push({
                    category,
                    keywords: matches,
                    relevance: matches.length / inputText.length * 100
                });
            }
        });

        return situationalKeywords;
    }

    generateContextualKeywords(inputText, context) {
        const contextualKeywords = [];
        
        // コンテキスト分析
        if (context.timeFrame) {
            contextualKeywords.push(...this.getTimeFrameKeywords(context.timeFrame));
        }
        
        if (context.urgency) {
            contextualKeywords.push(...this.getUrgencyKeywords(context.urgency));
        }
        
        if (context.domain) {
            contextualKeywords.push(...this.getDomainKeywords(context.domain));
        }

        return contextualKeywords;
    }

    generateActionKeywords(inputText) {
        const actionPatterns = [
            /(\w+)する/g,      // 動詞パターン
            /(\w+)したい/g,    // 願望パターン  
            /(\w+)すべき/g,    // 義務パターン
            /(\w+)できる/g,    // 可能性パターン
            /(\w+)しよう/g     // 意志パターン
        ];

        const actionKeywords = [];
        
        actionPatterns.forEach((pattern, index) => {
            const matches = inputText.matchAll(pattern);
            for (let match of matches) {
                actionKeywords.push({
                    action: match[1],
                    type: ['action', 'desire', 'obligation', 'possibility', 'intention'][index],
                    priority: this.calculateActionPriority(match[1], inputText)
                });
            }
        });

        return actionKeywords;
    }

    generateTemporalKeywords(inputText) {
        const temporalPatterns = {
            past: /昨日|先週|去年|以前|前回|過去|昔|かつて/g,
            present: /今|現在|今日|今週|今月|今年|今回|いま/g,
            future: /明日|来週|来月|来年|将来|未来|これから|今後/g,
            urgent: /すぐに|急いで|至急|早く|直ちに|即座に/g,
            gradual: /徐々に|少しずつ|ゆっくり|段階的に|時間をかけて/g
        };

        const temporalKeywords = [];
        
        Object.entries(temporalPatterns).forEach(([timeType, pattern]) => {
            const matches = inputText.match(pattern);
            if (matches) {
                temporalKeywords.push({
                    timeType,
                    indicators: matches,
                    strength: matches.length
                });
            }
        });

        return temporalKeywords;
    }

    generateMetaphorKeywords(inputText) {
        const metaphorPatterns = [
            { pattern: /道|路|歩む|進む|方向|迷う/, theme: 'journey' },
            { pattern: /光|闇|明るい|暗い|照らす|影/, theme: 'light' },
            { pattern: /山|谷|頂上|登る|降りる|険しい/, theme: 'mountain' },
            { pattern: /海|波|泳ぐ|溺れる|港|航海/, theme: 'ocean' },
            { pattern: /種|芽|花|実|育つ|咲く/, theme: 'growth' },
            { pattern: /嵐|雲|晴れ|雨|風|空/, theme: 'weather' }
        ];

        const metaphorKeywords = [];
        
        metaphorPatterns.forEach(({ pattern, theme }) => {
            if (inputText.match(pattern)) {
                metaphorKeywords.push({
                    theme,
                    pattern: pattern.source,
                    iChingConnection: this.mapToIChingElement(theme)
                });
            }
        });

        return metaphorKeywords;
    }

    // ========================================
    // 初期化メソッド群
    // ========================================

    initializeContextPatterns() {
        return {
            personal: [
                { pattern: /自分|私|僕|俺/, weight: 1.0 },
                { pattern: /気持ち|感情|心/, weight: 0.9 },
                { pattern: /性格|個性|特徴/, weight: 0.8 }
            ],
            social: [
                { pattern: /他人|人|相手/, weight: 1.0 },
                { pattern: /社会|世間|周り/, weight: 0.9 },
                { pattern: /関係|つながり/, weight: 0.8 }
            ],
            professional: [
                { pattern: /仕事|職|キャリア/, weight: 1.0 },
                { pattern: /会社|組織|職場/, weight: 0.9 },
                { pattern: /責任|役割|立場/, weight: 0.8 }
            ]
        };
    }

    initializeEmotionalPatterns() {
        return {
            joy: [
                { regex: /嬉しい|楽しい|幸せ|喜び/, keyword: 'happiness', intensity: 0.8 },
                { regex: /満足|充実|達成/, keyword: 'satisfaction', intensity: 0.7 }
            ],
            sadness: [
                { regex: /悲しい|辛い|落ち込む|憂鬱/, keyword: 'sadness', intensity: 0.8 },
                { regex: /失望|後悔|諦め/, keyword: 'disappointment', intensity: 0.7 }
            ],
            anxiety: [
                { regex: /不安|心配|恐れ|怖い/, keyword: 'anxiety', intensity: 0.9 },
                { regex: /緊張|ストレス|プレッシャー/, keyword: 'stress', intensity: 0.8 }
            ],
            anger: [
                { regex: /怒り|イライラ|腹立つ|ムカつく/, keyword: 'anger', intensity: 0.9 },
                { regex: /不満|批判|反発/, keyword: 'frustration', intensity: 0.7 }
            ]
        };
    }

    initializeActionPatterns() {
        return {
            decide: [/決める|決断|選択|判断/g],
            change: [/変える|変化|改善|修正/g],
            start: [/始める|開始|スタート|着手/g],
            stop: [/止める|停止|終了|中断/g],
            continue: [/続ける|継続|維持|持続/g]
        };
    }

    initializeTemporalPatterns() {
        return {
            immediate: [/今すぐ|直ちに|即座に|急いで/g],
            short_term: [/今日|今週|今月|近いうちに/g],
            medium_term: [/来月|来年|しばらく|いずれ/g],
            long_term: [/将来|永続的に|長期的に|生涯/g]
        };
    }

    initializeMetaphorPatterns() {
        return {
            journey: [/道|路|歩む|進む|目的地|旅/g],
            growth: [/成長|発展|育つ|伸びる|開花/g],
            balance: [/バランス|調和|均衡|安定/g],
            transformation: [/変化|変容|変身|進化|変革/g]
        };
    }

    // ========================================
    // ユーティリティメソッド群
    // ========================================

    generateCacheKey(inputText, context) {
        const textHash = this.simpleHash(inputText);
        const contextHash = this.simpleHash(JSON.stringify(context));
        return `${textHash}_${contextHash}`;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return hash.toString(36);
    }

    basicTokenize(text) {
        // 基本的な日本語・英語トークン化
        return text
            .replace(/[。、！？]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 0);
    }

    isSignificantToken(token) {
        if (typeof token === 'string') {
            return token.length >= 2 && !/^[0-9\s\u3040-\u309F]+$/.test(token);
        }
        return token.surface && token.surface.length >= 2;
    }

    calculateTokenSignificance(token) {
        let score = 0.5; // ベーススコア
        
        if (typeof token === 'object' && token.part_of_speech) {
            const pos = token.part_of_speech;
            if (pos.includes('名詞')) score += 0.3;
            if (pos.includes('動詞')) score += 0.2;
            if (pos.includes('形容詞')) score += 0.15;
        }
        
        return Math.min(score, 1.0);
    }

    rankKeywords(keywords) {
        return keywords
            .sort((a, b) => (b.significance || 0.5) - (a.significance || 0.5))
            .slice(0, 20); // 上位20個
    }

    findSemanticRelations(keyword) {
        // 基本的な語彙関係辞書（実装時に拡張）
        const relations = {
            '仕事': ['職業', 'キャリア', '労働', '職場', '業務'],
            '恋愛': ['愛情', 'パートナー', 'デート', '結婚', '関係'],
            '健康': ['体調', '医療', '病気', '治療', '予防'],
            '学習': ['勉強', '教育', 'スキル', '知識', '成長']
        };
        
        return relations[keyword] || [];
    }

    deduplicateAndRank(words) {
        const uniqueWords = [...new Set(words.map(w => typeof w === 'string' ? w : w.keyword))];
        return uniqueWords.slice(0, 15);
    }

    isJapanese(text) {
        return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    }

    isEnglish(text) {
        return /^[a-zA-Z\s]+$/.test(text);
    }

    extractJapaneseStem(word) {
        // 日本語語幹抽出（簡易版）
        const stems = [];
        if (word.endsWith('する')) {
            stems.push(word.slice(0, -2));
        }
        if (word.endsWith('です')) {
            stems.push(word.slice(0, -2));
        }
        return stems;
    }

    extractEnglishStem(word) {
        // 英語語幹抽出（簡易版）
        const stems = [];
        if (word.endsWith('ing')) {
            stems.push(word.slice(0, -3));
        }
        if (word.endsWith('ed')) {
            stems.push(word.slice(0, -2));
        }
        return stems;
    }

    mapToBunenjinAspect(emotion) {
        // bunenjin哲学への感情マッピング
        const aspectMap = {
            joy: 'creative_self',
            sadness: 'reflective_self', 
            anxiety: 'protective_self',
            anger: 'assertive_self'
        };
        return aspectMap[emotion] || 'balanced_self';
    }

    mapToIChingElement(theme) {
        // I Ching元素への比喩マッピング
        const elementMap = {
            journey: '艮 (Mountain) - 止まること、方向性',
            light: '離 (Fire) - 明晰さ、理解',
            mountain: '艮 (Mountain) - 安定、忍耐',
            ocean: '坎 (Water) - 流動性、適応',
            growth: '震 (Thunder) - 動き、成長',
            weather: '巽 (Wind) - 変化、影響'
        };
        return elementMap[theme] || '無極 (Wuji) - 無限の可能性';
    }

    rankEmotionalKeywords(keywords) {
        return keywords
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, 10);
    }

    getBasicEmotionalKeywords(inputText) {
        // フォールバック感情キーワード
        const basicEmotions = ['neutral', 'contemplative', 'seeking_guidance'];
        return basicEmotions.map(emotion => ({
            keyword: emotion,
            emotion: emotion,
            intensity: 0.5,
            context: 'fallback'
        }));
    }

    getSynonyms(keyword) {
        // 基本的な同義語辞書
        const synonyms = {
            '問題': ['課題', '困難', 'トラブル'],
            '解決': ['解答', '対策', '改善'],
            '選択': ['決定', '判断', 'オプション']
        };
        return synonyms[keyword] || [];
    }

    getRelatedTerms(keyword) {
        // 関連語取得（簡易版）
        return [];
    }

    getContextualVariants(keyword) {
        // 文脈的バリエーション（簡易版）
        return [];
    }

    basicWordExtraction(inputText) {
        // 最基本的な単語抽出
        return inputText
            .split(/[\s、。！？]/)
            .filter(word => word.length >= 2)
            .map(word => ({ word, significance: 0.5 }));
    }

    integrateAndFilterKeywords(keywords, context) {
        // キーワード統合とフィルタリング
        const integrated = {
            primary: [],
            secondary: [],
            contextual: [],
            emotional: [],
            temporal: [],
            metaphorical: []
        };

        // 各カテゴリーからトップキーワードを選択
        if (keywords.situational) {
            integrated.primary.push(...keywords.situational.slice(0, 5));
        }
        if (keywords.emotional) {
            integrated.emotional.push(...keywords.emotional.slice(0, 3));
        }
        if (keywords.contextual) {
            integrated.contextual.push(...keywords.contextual.slice(0, 3));
        }
        if (keywords.action) {
            integrated.secondary.push(...keywords.action.slice(0, 4));
        }
        if (keywords.temporal) {
            integrated.temporal.push(...keywords.temporal.slice(0, 3));
        }
        if (keywords.metaphor) {
            integrated.metaphorical.push(...keywords.metaphor.slice(0, 2));
        }

        return integrated;
    }

    generateFallbackKeywords(inputText) {
        // エラー時のフォールバックキーワード生成
        console.log('🔄 Generating fallback keywords');
        
        return {
            primary: [
                { keyword: '状況分析', category: 'analysis', relevance: 0.8 },
                { keyword: '意思決定', category: 'decision', relevance: 0.7 },
                { keyword: '将来計画', category: 'planning', relevance: 0.6 }
            ],
            secondary: [
                { keyword: '選択肢検討', category: 'option', relevance: 0.6 },
                { keyword: '現状把握', category: 'assessment', relevance: 0.5 }
            ],
            emotional: [
                { keyword: '冷静分析', emotion: 'analytical', intensity: 0.7 }
            ],
            contextual: [
                { keyword: '一般的状況', context: 'general' }
            ],
            temporal: [
                { timeType: 'present', indicators: ['現在'] }
            ],
            metaphorical: [
                { theme: 'journey', iChingConnection: '人生の道程' }
            ]
        };
    }

    // ========================================
    // 時間・緊急度・領域キーワード取得
    // ========================================

    getTimeFrameKeywords(timeFrame) {
        const timeKeywords = {
            immediate: ['緊急', '今すぐ', '急務'],
            short_term: ['近い将来', '数日内', '今週中'],
            medium_term: ['数ヶ月', '今年中', '中期的'],
            long_term: ['将来的', '長期視点', '人生設計']
        };
        return timeKeywords[timeFrame] || [];
    }

    getUrgencyKeywords(urgency) {
        const urgencyKeywords = {
            low: ['ゆっくり', '慎重に', '時間をかけて'],
            medium: ['適度に', '計画的に', 'バランス良く'],
            high: ['迅速に', '集中して', '優先的に'],
            critical: ['最優先', '緊急対応', '即座に']
        };
        return urgencyKeywords[urgency] || [];
    }

    getDomainKeywords(domain) {
        const domainKeywords = {
            work: ['職業', 'キャリア', '専門性', 'スキル'],
            relationship: ['人間関係', '感情', 'コミュニケーション', '絆'],
            health: ['健康管理', '医療', '生活習慣', 'ウェルネス'],
            finance: ['財務', '投資', '経済', '資産管理'],
            education: ['学習', '教育', '知識', '成長']
        };
        return domainKeywords[domain] || [];
    }

    calculateActionPriority(action, fullText) {
        // アクション優先度計算
        const actionCount = (fullText.match(new RegExp(action, 'g')) || []).length;
        const textLength = fullText.length;
        return Math.min(actionCount / textLength * 1000, 1.0);
    }
}

// グローバル利用のためのエクスポート
if (typeof window !== 'undefined') {
    window.DynamicKeywordGenerator = DynamicKeywordGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicKeywordGenerator;
}

console.log('✅ DynamicKeywordGenerator.js loaded successfully');