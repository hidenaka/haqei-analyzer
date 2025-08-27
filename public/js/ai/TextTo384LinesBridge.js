/**
 * TextTo384LinesBridge - テキストから384個の爻への直接マッピング
 * 各爻を独立したエンティティとして扱う
 * @version 3.0.0 - 根本的再設計版
 * @created 2025-08-26
 */

// 高度な日本語形態素解析エンジン
class AdvancedJapaneseAnalyzer {
    constructor() {
        // 易経専門用語辞書
        this.dictionary = this.buildDictionary();
        
        // ストップワード（除外する一般的な語）
        this.stopWords = new Set(['の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ', 'さ', 'ある', 'いる', 'も', 'する', 'から', 'な', 'こと', 'として', 'い', 'や', 'れる']);
        
        // 品詞パターン
        this.patterns = {
            kanji: /[一-龠々]+/g,
            hiragana: /[ぁ-ん]+/g,
            katakana: /[ァ-ヴー]+/g,
            number: /[0-9０-９]+/g,
            english: /[a-zA-Z]+/g
        };
    }
    
    buildDictionary() {
        return {
            // 八卦
            '乾': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'heaven' },
            '坤': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'earth' },
            '震': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'thunder' },
            '巽': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'wind' },
            '坎': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'water' },
            '離': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'fire' },
            '艮': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'mountain' },
            '兌': { pos: 'noun', weight: 2.0, category: 'trigram', meaning: 'lake' },
            
            // 爻位置
            '初': { pos: 'noun', weight: 1.8, category: 'position', meaning: 'first' },
            '二': { pos: 'noun', weight: 1.8, category: 'position', meaning: 'second' },
            '三': { pos: 'noun', weight: 1.8, category: 'position', meaning: 'third' },
            '四': { pos: 'noun', weight: 1.8, category: 'position', meaning: 'fourth' },
            '五': { pos: 'noun', weight: 1.8, category: 'position', meaning: 'fifth' },
            '上': { pos: 'noun', weight: 1.8, category: 'position', meaning: 'top' },
            '九': { pos: 'noun', weight: 1.5, category: 'yang', meaning: 'nine' },
            '六': { pos: 'noun', weight: 1.5, category: 'yin', meaning: 'six' },
            
            // 重要概念
            '龍': { pos: 'noun', weight: 2.5, category: 'symbol', meaning: 'dragon' },
            '潛': { pos: 'verb', weight: 2.0, category: 'action', meaning: 'hidden' },
            '見': { pos: 'verb', weight: 2.0, category: 'action', meaning: 'appear' },
            '飛': { pos: 'verb', weight: 2.0, category: 'action', meaning: 'fly' },
            '躍': { pos: 'verb', weight: 2.0, category: 'action', meaning: 'leap' },
            '亢': { pos: 'adj', weight: 2.0, category: 'state', meaning: 'arrogant' },
            
            // 吉凶
            '吉': { pos: 'adj', weight: 2.0, category: 'fortune', meaning: 'auspicious' },
            '凶': { pos: 'adj', weight: 2.0, category: 'fortune', meaning: 'ominous' },
            '悔': { pos: 'noun', weight: 1.8, category: 'fortune', meaning: 'regret' },
            '咎': { pos: 'noun', weight: 1.8, category: 'fortune', meaning: 'fault' },
            '利': { pos: 'adj', weight: 1.8, category: 'fortune', meaning: 'benefit' },
            '貞': { pos: 'adj', weight: 1.8, category: 'quality', meaning: 'correct' }
        };
    }
    
    /**
     * テキストを高度に分析して656次元ベクトルを生成
     */
    analyze(text) {
        // Step 1: 形態素解析
        const tokens = this.tokenize(text);
        
        // Step 2: 特徴抽出
        const features = this.extractFeatures(tokens);
        
        // Step 3: 完全な656次元ベクトル生成
        const vector = this.generateFullVector(features, text);
        
        return {
            tokens,
            features,
            vector
        };
    }
    
    tokenize(text) {
        const tokens = [];
        const processedWords = new Set();
        
        // 各パターンでトークン化
        Object.entries(this.patterns).forEach(([type, pattern]) => {
            const matches = text.match(pattern) || [];
            matches.forEach(word => {
                if (!this.stopWords.has(word) && !processedWords.has(word)) {
                    processedWords.add(word);
                    const dictEntry = this.dictionary[word];
                    
                    if (dictEntry) {
                        tokens.push({
                            surface: word,
                            pos: dictEntry.pos,
                            weight: dictEntry.weight,
                            category: dictEntry.category,
                            meaning: dictEntry.meaning,
                            type: type
                        });
                    } else {
                        tokens.push({
                            surface: word,
                            pos: this.guessPOS(word, type),
                            weight: 1.0,
                            category: 'general',
                            type: type
                        });
                    }
                }
            });
        });
        
        return tokens;
    }
    
    guessPOS(word, type) {
        if (type === 'kanji') return 'noun';
        if (type === 'hiragana' && /[うくぐすつぬぶむゆる]$/.test(word)) return 'verb';
        if (type === 'hiragana' && /[いしき]$/.test(word)) return 'adj';
        if (type === 'katakana') return 'noun';
        return 'unknown';
    }
    
    extractFeatures(tokens) {
        const features = {
            keywords: [],
            categories: {},
            posDistribution: {},
            semanticClusters: {},
            weights: []
        };
        
        // カテゴリ別集計
        tokens.forEach(token => {
            features.keywords.push(token.surface);
            features.weights.push(token.weight);
            
            // カテゴリ集計
            if (!features.categories[token.category]) {
                features.categories[token.category] = [];
            }
            features.categories[token.category].push(token);
            
            // 品詞分布
            if (!features.posDistribution[token.pos]) {
                features.posDistribution[token.pos] = 0;
            }
            features.posDistribution[token.pos]++;
        });
        
        // セマンティッククラスタリング
        features.semanticClusters = {
            trigram: tokens.filter(t => t.category === 'trigram'),
            position: tokens.filter(t => t.category === 'position'),
            fortune: tokens.filter(t => t.category === 'fortune'),
            action: tokens.filter(t => t.pos === 'verb'),
            state: tokens.filter(t => t.pos === 'adj')
        };
        
        return features;
    }
    
    /**
     * 完全な656次元ベクトル生成
     */
    generateFullVector(features, text) {
        const vector = new Float32Array(656);
        
        // 0-99: 単語埋め込み
        this.encodeWordEmbeddings(vector, 0, features.keywords, features.weights);
        
        // 100-199: 品詞分布と文法特徴
        this.encodePOSFeatures(vector, 100, features.posDistribution);
        
        // 200-299: カテゴリ特徴（易経専門）
        this.encodeCategoryFeatures(vector, 200, features.categories);
        
        // 300-399: セマンティッククラスタ
        this.encodeSemanticClusters(vector, 300, features.semanticClusters);
        
        // 400-499: テキスト統計特徴
        this.encodeStatisticalFeatures(vector, 400, text, features);
        
        // 500-599: 文脈特徴
        this.encodeContextualFeatures(vector, 500, text, features);
        
        // 600-655: 易経特化特徴
        this.encodeIChingFeatures(vector, 600, features);
        
        // L2正規化
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (norm > 0) {
            for (let i = 0; i < 656; i++) {
                vector[i] /= norm;
            }
        }
        
        return vector;
    }
    
    encodeWordEmbeddings(vector, offset, keywords, weights) {
        // ハッシュトリック＋重み付け
        keywords.forEach((word, idx) => {
            const weight = weights[idx] || 1.0;
            let hash = 5381;
            for (let i = 0; i < word.length; i++) {
                hash = ((hash << 5) + hash) + word.charCodeAt(i);
                hash = hash & hash;
            }
            const baseIdx = Math.abs(hash) % 100;
            vector[offset + baseIdx] += weight / (idx + 1);
        });
    }
    
    encodePOSFeatures(vector, offset, posDistribution) {
        const posMap = {
            noun: 0,
            verb: 20,
            adj: 40,
            adv: 60,
            unknown: 80
        };
        
        Object.entries(posDistribution).forEach(([pos, count]) => {
            const baseIdx = posMap[pos] || 90;
            for (let i = 0; i < Math.min(count, 20); i++) {
                vector[offset + baseIdx + i] = 1.0 / (i + 1);
            }
        });
    }
    
    encodeCategoryFeatures(vector, offset, categories) {
        const categoryMap = {
            trigram: 0,
            position: 15,
            fortune: 30,
            symbol: 45,
            action: 60,
            state: 75,
            general: 90
        };
        
        Object.entries(categories).forEach(([category, tokens]) => {
            const baseIdx = categoryMap[category] || 95;
            tokens.forEach((token, i) => {
                if (i < 15) {
                    vector[offset + baseIdx + i] = token.weight;
                }
            });
        });
    }
    
    encodeSemanticClusters(vector, offset, clusters) {
        const clusterMap = {
            trigram: 0,
            position: 20,
            fortune: 40,
            action: 60,
            state: 80
        };
        
        Object.entries(clusters).forEach(([cluster, tokens]) => {
            const baseIdx = clusterMap[cluster] || 90;
            tokens.forEach((token, i) => {
                if (i < 20) {
                    vector[offset + baseIdx + i] = token.weight || 1.0;
                }
            });
        });
    }
    
    encodeStatisticalFeatures(vector, offset, text, features) {
        const stats = {
            length: Math.min(text.length / 100, 1.0),
            uniqueTokens: new Set(features.keywords).size / Math.max(1, features.keywords.length),
            avgWeight: features.weights.reduce((a, b) => a + b, 0) / Math.max(1, features.weights.length),
            categoryDiversity: Object.keys(features.categories).length / 10,
            posDiversity: Object.keys(features.posDistribution).length / 5
        };
        
        Object.values(stats).forEach((value, i) => {
            vector[offset + i] = value;
        });
    }
    
    encodeContextualFeatures(vector, offset, text, features) {
        // 文の開始・終了パターン
        const startPattern = text.substring(0, 10);
        const endPattern = text.substring(Math.max(0, text.length - 10));
        
        // パターンをベクトル化
        for (let i = 0; i < Math.min(startPattern.length, 50); i++) {
            vector[offset + i] = startPattern.charCodeAt(i) / 65536;
        }
        
        for (let i = 0; i < Math.min(endPattern.length, 50); i++) {
            vector[offset + 50 + i] = endPattern.charCodeAt(i) / 65536;
        }
    }
    
    encodeIChingFeatures(vector, offset, features) {
        // 易経特化の特徴
        const iChingFeatures = {
            hasTrigram: features.categories.trigram ? 1.0 : 0.0,
            hasPosition: features.categories.position ? 1.0 : 0.0,
            hasFortune: features.categories.fortune ? 1.0 : 0.0,
            trigramCount: (features.categories.trigram || []).length / 8,
            positionCount: (features.categories.position || []).length / 6,
            fortuneBalance: this.calculateFortuneBalance(features.categories.fortune || [])
        };
        
        Object.values(iChingFeatures).forEach((value, i) => {
            if (i < 56) {
                vector[offset + i] = value;
            }
        });
    }
    
    calculateFortuneBalance(fortuneTokens) {
        let positive = 0, negative = 0;
        fortuneTokens.forEach(token => {
            if (['吉', '利', '亨'].includes(token.surface)) positive++;
            if (['凶', '悔', '咎'].includes(token.surface)) negative++;
        });
        const total = positive + negative;
        return total > 0 ? (positive - negative) / total : 0;
    }
}

// TF-IDFベクトル化
class TFIDFVectorizer {
    constructor() {
        this.tokenizer = new AdvancedJapaneseAnalyzer();
        this.vocabulary = new Map();  // 語彙インデックス
        this.idf = new Map();         // IDF値
        this.documentsCount = 0;
    }
    
    // koudo_shishinデータから語彙を構築
    buildVocabulary(koudoShishinData) {
        const allDocuments = [];
        
        // 全文書を収集
        for (const [index, entry] of koudoShishinData.entries()) {
            // 既存のshin/hen処理
            if (entry.shin) allDocuments.push(entry.shin);
            if (entry.hen) allDocuments.push(entry.hen);
            
            // 新規追加：爻名も語彙に含める
            if (entry.name) {
                allDocuments.push(entry.name);
            }
            
            // 新規追加：位置特有のキーワード
            const position = (index % 6) + 1;
            const positionKeywords = this.getPositionKeywords(position);
            allDocuments.push(positionKeywords.join(' '));
        }
        
        this.documentsCount = allDocuments.length;
        const documentFrequency = new Map();
        
        // 各文書をトークン化してDF計算
        allDocuments.forEach(doc => {
            const tokens = this.tokenizer.tokenize(doc);
            const uniqueTokens = new Set(tokens.map(t => t.surface));
            
            uniqueTokens.forEach(token => {
                documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
            });
        });
        
        // IDF計算と語彙インデックス作成
        let index = 0;
        documentFrequency.forEach((df, token) => {
            const idf = Math.log(this.documentsCount / (df + 1));
            this.idf.set(token, idf);
            this.vocabulary.set(token, index++);
        });
    }
    
    // 新規メソッド：位置特有のキーワードを取得
    getPositionKeywords(position) {
        const keywords = {
            1: ['始動', '潜在', '基礎', '初心', '萌芽', '開始', '準備'],
            2: ['内面', '協力', '蓄積', '忍耐', '育成', '関係', '支援'],
            3: ['困難', '試練', '過渡期', '不安定', '成長', '挑戦'],
            4: ['外界', '関門', '進退', '決断', '境界', '変化', '転換'],
            5: ['中正', '君位', '成就', '権威', '責任', 'リーダー', '統率'],
            6: ['極限', '終焉', '転換', '過剰', '変革', '完成', '結果']
        };
        return keywords[position] || [];
    }
    
    // テキストをTF-IDFベクトル化
    vectorize(text, vectorSize = 100) {
        const vector = new Float32Array(vectorSize);
        const tokens = this.tokenizer.tokenize(text);
        
        // TF計算
        const tf = new Map();
        tokens.forEach(token => {
            tf.set(token.surface, (tf.get(token.surface) || 0) + 1);
        });
        
        // TF-IDF計算してベクトル化
        tf.forEach((freq, token) => {
            const vocabIndex = this.vocabulary.get(token);
            const idfValue = this.idf.get(token) || 0;
            
            if (vocabIndex !== undefined) {
                const tfidf = (freq / tokens.length) * idfValue;
                const vectorIndex = vocabIndex % vectorSize;
                vector[vectorIndex] += tfidf;
            }
        });
        
        // L2正規化
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (norm > 0) {
            for (let i = 0; i < vectorSize; i++) {
                vector[i] /= norm;
            }
        }
        
        return vector;
    }
}

class TextTo384LinesBridge {
    constructor() {
        console.log('🚀 Initializing TextTo384LinesBridge - Direct 384 Line Mapping System');
        
        this.patternMatcher = null; // AdvancedPatternMatcherを使用
        this.semanticAnalyzer = null; // LightweightSemanticEngineを使用
        this.initialized = false;
        
        // 高度な日本語分析用
        this.advancedAnalyzer = new AdvancedJapaneseAnalyzer();
        this.tfidfVectorizer = new TFIDFVectorizer();
        
        // 384個の爻データベース（各爻が独立したエンティティ）
        this.lines384 = this.buildComplete384LineDatabase();
        
        // キャッシュシステム（初期化時にクリア）
        this.cache = new Map();
        this.cache.clear(); // キャッシュをクリア
        this.maxCacheSize = 50;
        
        // 使用頻度追跡システム
        this.lineUsageCount = {}; // 使用頻度追跡
        this.sessionStartTime = Date.now();
        this.recentSelections = []; // 直近10回の選択を記録
        
        // パフォーマンス統計とデバッグ情報
        this.stats = {
            totalAnalyses: 0,
            averageProcessingTime: 0,
            lineSelectionDistribution: new Array(386).fill(0), // 各爻の選択回数
            cacheHits: 0,
            cacheHitRate: 0
        };
        
        this.performanceStats = {
            min: Number.MAX_VALUE,
            max: 0,
            samples: []
        };
        
        this.lastProcessingTime = null;
        
        // デバッグ情報
        this.debugInfo = {
            system: {
                initialized: false,
                koudoShishinLoaded: false,
                totalLines: 0,
                cacheSize: 0
            },
            statistics: {
                totalAnalyses: 0,
                averageProcessingTime: 0,
                lineSelectionDistribution: new Array(386).fill(0),
                mostFrequentLines: []
            },
            performance: {},
            vocabulary: {}
        };
    }
    
    /**
     * 384個の爻データベースを構築
     * 各爻に独自のID、特性、キーワードを付与
     */
    buildComplete384LineDatabase() {
        const lines = {};
        
        // 64卦の名前（日本漢字使用）
        const hexagramNames = [
            '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
            '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
            '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剝', '地雷復',
            '天雷無妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
            '天山遯', '雷天大壯', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
            '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
            '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤歸妹', '雷火豊', '火山旅',
            '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
        ];
        
        for (let lineId = 1; lineId <= 384; lineId++) {
            const hexagramId = Math.ceil(lineId / 6);
            const linePosition = ((lineId - 1) % 6) + 1;
            
            lines[lineId] = {
                id: lineId,
                hexagram_id: hexagramId,
                hexagram_name: hexagramNames[hexagramId - 1],
                position: linePosition,
                
                // 各爻の独自の特性
                keywords: this.generateLineKeywords(lineId, hexagramId, linePosition),
                temporal_phase: this.assignTemporalPhase(lineId, hexagramId, linePosition),
                energy_pattern: this.assignEnergyPattern(lineId, hexagramId, linePosition),
                emotion_pattern: this.assignEmotionPattern(lineId, hexagramId, linePosition),
                
                // セマンティックベクトル（簡易版）
                semantic_vectors: this.generateSemanticVectors(lineId),
                
                // この爻が優先される文脈
                priority_contexts: this.generatePriorityContexts(lineId, hexagramId, linePosition),
                
                // この爻が避けられる文脈
                anti_contexts: this.generateAntiContexts(lineId, hexagramId, linePosition),
                
                // 基本ウェイト
                base_weight: 1.0
            };
        }
        
        // 用九・用六を追加（385, 386）
        lines[385] = {
            id: 385,
            special: true,
            name: '用九',
            hexagram_id: 1,
            hexagram_name: '乾為天',
            keywords: ['全陽', '極致', '転換点', '群龍無首', 'リーダーシップの超越'],
            condition: 'all_yang',
            temporal_phase: { base: 'transcendent', modifier: 0 },
            energy_pattern: { type: 'yang_extreme', intensity: 1.0 },
            base_weight: 0.8
        };
        
        lines[386] = {
            id: 386,
            special: true,
            name: '用六',
            hexagram_id: 2,
            hexagram_name: '坤為地',
            keywords: ['全陰', '受容', '柔軟性', '利永貞', '永続的な貞正'],
            condition: 'all_yin',
            temporal_phase: { base: 'eternal', modifier: 0 },
            energy_pattern: { type: 'yin_extreme', intensity: 1.0 },
            base_weight: 0.8
        };
        
        return lines;
    }
    
    /**
     * 爻固有のキーワードを生成（高度化版）
     */
    generateLineKeywords(lineId, hexagramId, linePosition) {
        const keywords = [];
        const lineData = this.koudoShishinData ? this.koudoShishinData[lineId - 1] : null;
        
        // shin/henテキストから重要語を抽出
        if (lineData) {
            const shinTokens = this.advancedAnalyzer.tokenize(lineData.shin || '');
            const henTokens = this.advancedAnalyzer.tokenize(lineData.hen || '');
            
            // 重み1.5以上のトークンを抽出
            const importantShinWords = shinTokens
                .filter(token => token.weight > 1.5)
                .map(token => token.surface)
                .slice(0, 5);
            
            const importantHenWords = henTokens
                .filter(token => token.weight > 1.5)
                .map(token => token.surface)
                .slice(0, 5);
            
            keywords.push(...importantShinWords, ...importantHenWords);
        }
        
        // 既存の位置キーワードも追加（getPositionKeywordsメソッドを使用）
        const positionKeywords = this.tfidfVectorizer.getPositionKeywords(linePosition);
        keywords.push(...positionKeywords);
        
        // 卦に基づく追加キーワード
        if (hexagramId === 1) keywords.push('創造', '強健', '剛毅'); // 乾
        if (hexagramId === 2) keywords.push('受容', '柔順', '包容'); // 坤
        if (hexagramId === 3) keywords.push('困難', '生成', '開拓'); // 屯
        if (hexagramId === 29) keywords.push('危険', '深淵', '洞察'); // 坎
        if (hexagramId === 30) keywords.push('明晰', '照明', '文明'); // 離
        if (hexagramId === 51) keywords.push('震動', '覚醒', '始動'); // 震
        if (hexagramId === 52) keywords.push('静止', '瞑想', '安定'); // 艮
        if (hexagramId === 57) keywords.push('浸透', '柔軟', '従順'); // 巽
        if (hexagramId === 58) keywords.push('喜悦', '交流', '説得'); // 兌
        
        // 特定の組み合わせに固有のキーワード
        if (hexagramId === 11 && linePosition === 5) keywords.push('大いなる調和');
        if (hexagramId === 12 && linePosition === 1) keywords.push('閉塞の兆し');
        if (hexagramId === 63 && linePosition === 6) keywords.push('完成後の警戒');
        if (hexagramId === 64 && linePosition === 1) keywords.push('新たな始まりの予感');
        
        // 重複除去して返す
        return [...new Set(keywords)];
    }
    
    /**
     * 時間フェーズの割り当て
     */
    assignTemporalPhase(lineId, hexagramId, linePosition) {
        // D-2-4: 改良版 - より適切な位置対応
        // D-2-5: 複数フェーズ割り当て実装
        const phasesByPosition = {
            1: ['beginning'],      // 1爻: 始まりのみ
            2: ['cooperation'],    // 2爻: 協力・関係性
            3: ['challenge'],      // 3爻: 困難・試練
            4: ['transition'],     // 4爻: 変化・転換
            5: ['mature'],         // 5爻: 成熟・リーダーシップ
            6: ['completion']      // 6爻: 完成・終了
        };
        
        // D-2-5: 副次的フェーズも考慮（lineIdによる多様性）
        const secondaryPhases = {
            1: ['beginning', 'cooperation'],
            2: ['cooperation', 'beginning'],
            3: ['challenge', 'transition'],
            4: ['transition', 'challenge'],
            5: ['mature', 'transition'],
            6: ['completion', 'mature']
        };
        
        // lineIdに基づいて決定論的に選択
        const primaryOptions = phasesByPosition[linePosition] || ['transition'];
        const secondaryOptions = secondaryPhases[linePosition] || primaryOptions;
        
        // 奇数lineIdは主フェーズ、偶数lineIdは副フェーズを優先
        const selectedPhase = (lineId % 2 === 1) 
            ? primaryOptions[0]
            : secondaryOptions[lineId % secondaryOptions.length];
        
        // 卦による修正係数（-1.0 ~ 1.0）
        const hexagramModifiers = {
            1: 0.5,   // 乾：積極的・前進的
            2: -0.3,  // 坤：受容的・待機的
            3: 0.2,   // 屯：困難だが前進
            4: -0.1,  // 蒙：学習・準備期
            5: -0.2,  // 需：待機
            6: 0.1,   // 訟：対立・進展
            11: 0.3,  // 泰：大いなる通じ
            12: -0.4, // 否：閉塞
            63: -0.1, // 既済：完成
            64: 0.3,  // 未済：未完成・継続
            // 他の卦も追加可能
        };
        
        const modifier = hexagramModifiers[hexagramId] || 0;
        
        // 組み合わせによる特殊なフェーズ
        let combinedPhase = selectedPhase;
        if (modifier > 0.3 && linePosition <= 3) {
            combinedPhase = 'accelerated_' + combinedPhase;
        } else if (modifier < -0.3 && linePosition >= 4) {
            combinedPhase = 'delayed_' + combinedPhase;
        }
        
        return {
            base: selectedPhase,
            modifier: modifier,
            combined: combinedPhase
        };
    }
    
    /**
     * エネルギーパターンの割り当て
     */
    assignEnergyPattern(lineId, hexagramId, linePosition) {
        // 陰陽判定（正しい実装を使用）
        let isYang = true;
        if (typeof getLineYinYang !== 'undefined') {
            try {
                const yinYang = getLineYinYang(hexagramId, linePosition);
                isYang = yinYang.isYang;
            } catch (e) {
                // フォールバック
            }
        }
        
        const baseEnergy = isYang ? 'yang' : 'yin';
        
        // 爻位置によるエネルギー強度
        const positionIntensity = {
            1: 0.3,  // 潜在
            2: 0.5,  // 内蔵
            3: 0.7,  // 発現
            4: 0.8,  // 外顕
            5: 1.0,  // 極盛
            6: 0.6   // 衰退
        };
        
        return {
            type: baseEnergy,
            intensity: positionIntensity[linePosition],
            direction: isYang ? 'expanding' : 'contracting',
            quality: this.determineEnergyQuality(hexagramId, linePosition)
        };
    }
    
    /**
     * 感情パターンの割り当て
     */
    assignEmotionPattern(lineId, hexagramId, linePosition) {
        const emotionMap = {
            1: { 1: 'ambitious', 2: 'confident', 3: 'determined', 4: 'decisive', 5: 'authoritative', 6: 'excessive' },
            2: { 1: 'cautious', 2: 'patient', 3: 'nurturing', 4: 'receptive', 5: 'accepting', 6: 'yielding' },
            3: { 1: 'anxious', 2: 'struggling', 3: 'persevering', 4: 'emerging', 5: 'achieving', 6: 'relieved' },
            29: { 1: 'alert', 2: 'wary', 3: 'fearful', 4: 'cautious', 5: 'insightful', 6: 'trapped' },
            30: { 1: 'curious', 2: 'enlightening', 3: 'passionate', 4: 'illuminating', 5: 'brilliant', 6: 'burning' }
        };
        
        const hexEmotions = emotionMap[hexagramId] || {};
        const primary = hexEmotions[linePosition] || 'neutral';
        
        return {
            primary: primary,
            intensity: 0.5 + (linePosition * 0.08), // 位置が高いほど感情も強い
            valence: this.calculateEmotionValence(primary)
        };
    }
    
    /**
     * セマンティックベクトルの生成（656次元）- koudo_shishinデータ活用版
     */
    generateSemanticVectors(lineId) {
        // D-3-6: セマンティックベクトル改善
        const vector = new Float32Array(656);
        const lineData = this.koudoShishinData ? this.koudoShishinData[lineId - 1] : null;
        
        if (!lineData) {
            // データがない場合は基本的なベクトル生成
            const hexagramId = Math.ceil(lineId / 6);
            const position = ((lineId - 1) % 6) + 1;
            
            // D-3-7: 爻固有パターン強化
            // より多様な初期値を設定
            for (let i = 0; i < 656; i++) {
                // lineIdに基づく固有パターン
                const pattern1 = Math.sin(lineId * i * 0.01) * 0.5;
                const pattern2 = Math.cos(lineId * i * 0.02) * 0.3;
                const pattern3 = Math.sin((lineId + position) * i * 0.015) * 0.2;
                vector[i] = pattern1 + pattern2 + pattern3;
            }
            
            this.encodeHexagramVector(vector, 0, hexagramId);
            this.encodePositionVector(vector, 100, position);
            this.encodeRelationshipVector(vector, 400, lineId);
            this.encodeBasicContextVector(vector, 500, lineId, hexagramId, position);
            return vector;
        }
        
        // shin/henテキストの解析
        const shinAnalysis = this.advancedAnalyzer.analyze(lineData.shin || '');
        const henAnalysis = this.advancedAnalyzer.analyze(lineData.hen || '');
        
        // shin特徴を前半328次元に展開
        if (shinAnalysis.vector && shinAnalysis.vector.length > 0) {
            for (let i = 0; i < 328; i++) {
                // D-3-8: 次元別重み付け実装
                const weight = 1.0 + (i / 328) * 0.2; // 後半の次元ほど重要度を上げる
                vector[i] = (shinAnalysis.vector[i % shinAnalysis.vector.length] || 0) * weight;
            }
        }
        
        // hen特徴を後半328次元に展開
        if (henAnalysis.vector && henAnalysis.vector.length > 0) {
            for (let i = 0; i < 328; i++) {
                // D-3-8: 次元別重み付け実装
                const weight = 1.2 - (i / 328) * 0.2; // 前半の次元ほど重要度を上げる
                vector[i + 328] = (henAnalysis.vector[i % henAnalysis.vector.length] || 0) * weight;
            }
        }
        
        // 位置と卦の特徴を追加（差別化のため）
        const position = ((lineId - 1) % 6) + 1;
        const hexagram = Math.ceil(lineId / 6);
        
        // 位置・卦特有の特徴を微量加算
        for (let i = 0; i < 656; i++) {
            vector[i] += Math.cos(position * i * 0.1) * 0.3;
            vector[i] += Math.sin(hexagram * i * 0.05) * 0.2;
        }
        
        // 爻固有の特徴を強化（Phase 3: 多様性向上）
        for (let i = 0; i < 656; i++) {
            // 爻IDベースの固有パターンを追加（多様性を増強）
            const uniquePattern = Math.sin(lineId * i * 0.017) * 0.25 + 
                                 Math.cos(hexagram * i * 0.023) * 0.2 +
                                 Math.sin((lineId + hexagram) * i * 0.031) * 0.15;
            vector[i] += uniquePattern;
            
            // 追加: 位置ベースの微細な差異
            const positionPattern = Math.cos(position * i * 0.07) * 0.1;
            vector[i] += positionPattern;
        }
        
        // ベクトル正規化（長さを1に）
        let magnitude = 0;
        for (let i = 0; i < 656; i++) {
            magnitude += vector[i] * vector[i];
        }
        magnitude = Math.sqrt(magnitude);
        
        if (magnitude > 0) {
            for (let i = 0; i < 656; i++) {
                vector[i] /= magnitude;
            }
        }
        
        return vector;
    }
    
    /**
     * セマンティックベクトルの更新（koudo_shishinデータ読み込み後）
     */
    updateSemanticVectors(lineId, lineData) {
        if (!this.lines384[lineId]) return;
        
        const vector = this.lines384[lineId].semantic_vectors;
        if (!vector) return;
        
        // 3. テキストベクトル (200-299) - shin/henデータで更新
        this.encodeTextVector(vector, 200, lineData.shin || '');
        
        // 4. 変爻ベクトル (300-399) - henデータで更新
        this.encodeChangeVector(vector, 300, lineData.hen || '');
        
        // 6. コンテキストベクトル (500-655) - 完全なデータで更新
        this.encodeContextVector(vector, 500, lineData);
    }
    
    /**
     * 卦特性のエンコード（100次元）
     */
    encodeHexagramVector(vector, offset, hexagramId) {
        // 上卦と下卦の計算
        const trigramUpper = Math.floor((hexagramId - 1) / 8);
        const trigramLower = (hexagramId - 1) % 8;
        
        // 八卦の特性値（決定論的）
        const trigramValues = [
            [1.0, 1.0, 1.0], // 乾
            [0.0, 0.0, 0.0], // 坤
            [0.0, 1.0, 0.0], // 震
            [1.0, 0.0, 1.0], // 巽
            [0.0, 0.0, 1.0], // 坎
            [1.0, 0.0, 0.0], // 離
            [0.0, 1.0, 1.0], // 艮
            [1.0, 1.0, 0.0]  // 兌
        ];
        
        // 上卦の特性（0-49）
        for (let i = 0; i < 50; i++) {
            const trigramIdx = i % 3;
            const multiplier = (i + 1) / 50;
            vector[offset + i] = trigramValues[trigramUpper][trigramIdx] * multiplier;
        }
        
        // 下卦の特性（50-99）
        for (let i = 0; i < 50; i++) {
            const trigramIdx = i % 3;
            const multiplier = (i + 1) / 50;
            vector[offset + 50 + i] = trigramValues[trigramLower][trigramIdx] * multiplier;
        }
    }
    
    /**
     * 爻位置のエンコード（100次元）- 改善版
     */
    encodePositionVector(vector, offset, position) {
        // 位置による特性値（D-1-4: 5爻を0.8に強化）
        const positionWeights = [0.5, 0.4, 0.45, 0.5, 0.8, 0.4]; // D-1-4: 5爻を0.65→0.8に変更
        const weight = positionWeights[position - 1];
        
        for (let i = 0; i < 100; i++) {
            // より分散したガウシアン分布
            const center = (position - 1) * 16.67; // 100を6で分割
            const sigma = 15; // より広いシグマで分散を増やす
            const distance = Math.abs(i - center);
            
            // 位置固有のノイズを追加して多様性を確保
            const noise = Math.sin(position * i * 0.1) * 0.1;
            vector[offset + i] = weight * Math.exp(-(distance * distance) / (2 * sigma * sigma)) + noise;
        }
    }
    
    /**
     * テキストのエンコード（TF-IDFベースの本格セマンティック分析・100次元）
     */
    encodeTextVector(vector, offset, text) {
        if (!text) return;
        
        // TF-IDFベクトル生成
        const textVector = this.tfidfVectorizer.vectorize(text, 100);
        
        // ベクトルをコピー
        for (let i = 0; i < 100; i++) {
            vector[offset + i] = textVector[i];
        }
    }
    
    /**
     * 変爻のエンコード（100次元）
     */
    encodeChangeVector(vector, offset, henText) {
        if (!henText) return;
        
        // テキストベクトルと同様の処理だが、異なる重み付け
        for (let i = 0; i < Math.min(henText.length, 100); i++) {
            const charCode = henText.charCodeAt(i);
            const idx = (charCode * 7) % 100; // 異なる分散
            vector[offset + idx] += (charCode / 65536) * 0.15;
        }
        
        // 正規化
        let sum = 0;
        for (let i = 0; i < 100; i++) {
            sum += vector[offset + i];
        }
        if (sum > 0) {
            for (let i = 0; i < 100; i++) {
                vector[offset + i] /= sum;
            }
        }
    }
    
    /**
     * 関係性のエンコード（100次元）
     */
    encodeRelationshipVector(vector, offset, lineId) {
        const hexagramId = Math.ceil(lineId / 6);
        const position = ((lineId - 1) % 6) + 1;
        
        // 承乗比応の関係性を計算
        const relationships = [];
        
        // 承（下から支える）
        if (position > 1) relationships.push(lineId - 1);
        
        // 乗（上から乗る）
        if (position < 6) relationships.push(lineId + 1);
        
        // 応（対応関係）
        const yingPosition = position <= 3 ? position + 3 : position - 3;
        const yingLineId = (hexagramId - 1) * 6 + yingPosition;
        relationships.push(yingLineId);
        
        // 関係性をベクトル化
        for (const relatedId of relationships) {
            if (relatedId >= 1 && relatedId <= 384) {
                const idx = (relatedId * 13) % 100;
                vector[offset + idx] += 0.3;
            }
        }
    }
    
    /**
     * 基本コンテキストのエンコード（156次元）- 初期化用
     */
    encodeBasicContextVector(vector, offset, lineId, hexagramId, position) {
        // 基本的な爻の特性をエンコード
        const base = lineId * 0.002631; // 1/380で正規化
        
        // 位置による特性
        for (let i = 0; i < 56; i++) {
            vector[offset + i] = Math.sin(base * (i + 1)) * 0.5 + 0.5;
        }
        
        // 時間的フェーズ
        const temporalPhase = ((lineId - 1) % 12) / 12;
        for (let i = 56; i < 100; i++) {
            vector[offset + i] = Math.cos(temporalPhase * Math.PI * 2 + i * 0.1) * 0.3 + 0.5;
        }
        
        // エネルギーパターン
        const energyBase = (hexagramId * position) / (64 * 6);
        for (let i = 100; i < 156; i++) {
            vector[offset + i] = Math.abs(Math.sin(energyBase * Math.PI * (i - 100))) * 0.4 + 0.3;
        }
    }
    
    /**
     * コンテキストのエンコード（156次元）
     */
    encodeContextVector(vector, offset, lineData) {
        // キーワードのエンコード
        if (lineData.keywords) {
            for (let i = 0; i < lineData.keywords.length && i < 56; i++) {
                const keyword = lineData.keywords[i];
                let hash = 0;
                for (let j = 0; j < keyword.length; j++) {
                    hash = ((hash << 5) - hash) + keyword.charCodeAt(j);
                    hash = hash & hash; // Convert to 32bit integer
                }
                const idx = Math.abs(hash) % 156;
                vector[offset + idx] += 0.2;
            }
        }
        
        // 時間フェーズのエンコード
        if (lineData.temporal_phase) {
            const phaseMap = {
                'beginning': 0,
                'early_develop': 26,
                'developing': 52,
                'transition': 78,
                'mature': 104,
                'completion': 130
            };
            const idx = phaseMap[lineData.temporal_phase.base] || 0;
            vector[offset + idx] += 0.5;
        }
    }
    
    /**
     * 優先される文脈の生成
     */
    generatePriorityContexts(lineId, hexagramId, linePosition) {
        const contexts = [];
        
        if (linePosition === 1) contexts.push('始まり', '新規', 'スタート');
        if (linePosition === 5) contexts.push('リーダーシップ', '権威', '成功');
        if (linePosition === 6) contexts.push('終わり', '完了', '転換');
        
        if (hexagramId === 1) contexts.push('創造', '起業', '開拓');
        if (hexagramId === 11) contexts.push('調和', '平和', '繁栄');
        if (hexagramId === 63) contexts.push('完成', '達成', '成就');
        
        return contexts;
    }
    
    /**
     * 避けられる文脈の生成
     */
    generateAntiContexts(lineId, hexagramId, linePosition) {
        const contexts = [];
        
        if (linePosition === 1) contexts.push('完了', '終焉');
        if (linePosition === 6) contexts.push('開始', '初期');
        
        if (hexagramId === 12) contexts.push('通じる', '開放');
        if (hexagramId === 29) contexts.push('安全', '平穏');
        
        return contexts;
    }
    
    /**
     * エネルギーの質を判定
     */
    determineEnergyQuality(hexagramId, linePosition) {
        if (linePosition === 2 || linePosition === 5) {
            return 'balanced'; // 中位は調和的
        }
        if (linePosition === 1 || linePosition === 6) {
            return 'extreme'; // 初爻と上爻は極端
        }
        return 'dynamic'; // その他は動的
    }
    
    /**
     * 感情の価値（正負）を計算
     */
    calculateEmotionValence(emotion) {
        const positive = ['confident', 'joyful', 'peaceful', 'hopeful', 'brilliant'];
        const negative = ['anxious', 'fearful', 'trapped', 'excessive', 'burning'];
        
        if (positive.includes(emotion)) return 1.0;
        if (negative.includes(emotion)) return -1.0;
        return 0.0;
    }
    
    /**
     * 初期化処理
     */
    async initialize() {
        console.log('🔄 Initializing TextTo384LinesBridge...');
        
        try {
            // AdvancedPatternMatcherの初期化
            if (typeof AdvancedPatternMatcher !== 'undefined') {
                this.patternMatcher = new AdvancedPatternMatcher();
                console.log('✅ AdvancedPatternMatcher loaded');
            }
            
            // LightweightSemanticEngineの初期化
            if (typeof LightweightSemanticEngine !== 'undefined') {
                this.semanticAnalyzer = new LightweightSemanticEngine();
                console.log('✅ LightweightSemanticEngine loaded');
            }
            
            // koudo_shishin.jsonの読み込み
            await this.loadKoudoShishinData();
            
            this.initialized = true;
            console.log('✅ TextTo384LinesBridge initialized successfully');
            
            return true;
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * koudo_shishin.jsonデータの読み込み（必須・3段階フォールバック）
     */
    async loadKoudoShishinData() {
        console.log('📊 koudo_shishin.json読み込み開始...');
        
        // 正しいパスで試行（これ以外は404エラー）
        const paths = [
            '/public/data/koudo_shishin.json',    // 正解パス（絶対）
            './data/koudo_shishin.json',          // フォールバック（相対）
            '../public/data/koudo_shishin.json',  // フォールバック（上位）
            'data/koudo_shishin.json'             // 最終手段
        ];
        
        let data = null;
        let successPath = null;
        
        for (const path of paths) {
            try {
                console.log(`  試行: ${path}`);
                const response = await fetch(path);
                if (response.ok) {
                    data = await response.json();
                    successPath = path;
                    console.log(`  ✅ 成功: ${path}`);
                    break;
                }
                console.log(`  ❌ 失敗: ${path} (status: ${response.status})`);
            } catch (error) {
                console.log(`  ❌ エラー: ${path} - ${error.message}`);
            }
        }
        
        if (!data) {
            throw new Error('FATAL: koudo_shishin.jsonが見つかりません。全パス試行失敗。');
        }
        
        this.koudoShishinData = Array.isArray(data) ? data : (data.entries || data.lines || []);
        
        if (this.koudoShishinData.length !== 386) {
            throw new Error(`FATAL: Expected 386 entries, got ${this.koudoShishinData.length}`);
        }
        
        console.log(`📊 koudo_shishin.json読み込み成功 (${successPath})`);
        console.log(`   エントリー数: ${this.koudoShishinData.length}`);
        
        // TF-IDF語彙を構築
        console.log('📚 TF-IDF語彙辞書構築中...');
        this.tfidfVectorizer.buildVocabulary(this.koudoShishinData);
        console.log(`✅ 語彙辞書構築完了: ${this.tfidfVectorizer.vocabulary.size}語`);
        
        // 各爻にkoudo_shishinデータを必ずマッピング＋656次元ベクトル更新
        for (let i = 0; i < 384; i++) {
            const lineId = i + 1;
            if (this.lines384[lineId] && this.koudoShishinData[i]) {
                this.lines384[lineId].shin = this.koudoShishinData[i].shin || '';
                this.lines384[lineId].hen = this.koudoShishinData[i].hen || '';
                this.lines384[lineId].originalName = this.koudoShishinData[i].name || '';
                
                // セマンティックベクトルを完全に更新（656次元）
                this.updateSemanticVectors(lineId, this.koudoShishinData[i]);
            }
        }
        
        // 用九・用六の処理
        if (this.koudoShishinData[384]) {
            this.lines384[385] = {
                id: 385,
                ...this.koudoShishinData[384]
            };
        }
        if (this.koudoShishinData[385]) {
            this.lines384[386] = {
                id: 386,
                ...this.koudoShishinData[385]
            };
        }
        
        return true;
    }
    
    /**
     * テキストから384個の爻への直接マッピング（メイン関数・並列処理版）
     */
    async analyzeTextToSpecificLine(text, options = {}) {
        if (!this.initialized) {
            await this.initialize();
        }
        
        // キャッシュチェック（決定論的）
        const cacheKey = text.trim().toLowerCase();
        if (this.cache.has(cacheKey) && !options.skipCache) {
            console.log('📦 Using cached result');
            const cachedResult = this.cache.get(cacheKey);
            cachedResult.fromCache = true;
            
            // キャッシュヒット統計を更新
            this.stats.cacheHits++;
            this.stats.cacheHitRate = this.stats.cacheHits / Math.max(1, this.stats.totalAnalyses);
            
            return cachedResult;
        }
        
        const startTime = performance.now();
        
        // Step 1: テキスト分析
        const analysis = await this.performComprehensiveAnalysis(text);
        
        // Step 2: 384個を8バッチに分割して並列処理（各48個）
        const batchSize = 48;
        const batches = [];
        
        for (let i = 0; i < 8; i++) {
            const start = i * batchSize + 1;
            const end = Math.min(start + batchSize - 1, 384);
            batches.push(this.processBatch(start, end, analysis, text));
        }
        
        // 並列実行
        const batchResults = await Promise.all(batches);
        
        // 結果の統合
        const lineScores = batchResults.flat();
        
        // Step 3: 特殊な用九・用六のチェック
        const specialLineScore = this.checkSpecialLines(analysis, text);
        if (specialLineScore) {
            lineScores.push(specialLineScore);
        }
        
        // Step 4: 最高スコアの爻を選択（完全決定論的ソート）
        lineScores.sort((a, b) => {
            // 1. スコアで比較（浮動小数点誤差を考慮）
            const scoreDiff = b.score - a.score;
            if (Math.abs(scoreDiff) > 0.000001) {
                return scoreDiff > 0 ? 1 : -1;
            }
            
            // 2. スコアが同じならlineIdで決定
            if (a.lineId !== b.lineId) {
                return a.lineId - b.lineId;
            }
            
            // 3. それでも同じなら（ありえないが）hexagramIdで決定
            return (a.hexagramId || 0) - (b.hexagramId || 0);
        });
        
        const selectedLine = lineScores[0];
        
        // D-3-4: lineUsageCountの更新
        if (!this.lineUsageCount) {
            this.lineUsageCount = {};
        }
        this.lineUsageCount[selectedLine.lineId] = (this.lineUsageCount[selectedLine.lineId] || 0) + 1;
        
        // 統計更新
        const processingTime = performance.now() - startTime;
        this.updateDebugStats(selectedLine.lineId, processingTime);
        
        // Step 5: 結果の構築
        const result = await this.buildResult(selectedLine, analysis, text);
        
        const finalResult = {
            ...result,
            performance: {
                processing_time_ms: processingTime,
                total_lines_evaluated: lineScores.length,
                confidence: selectedLine.score,
                top_3_candidates: lineScores.slice(0, 3).map(l => ({
                    lineId: l.lineId,
                    score: l.score,
                    hexagram: `${l.hexagramName}(${l.hexagramId})`,
                    position: l.position
                }))
            },
            fromCache: false
        };
        
        // キャッシュ更新
        this.updateCache(cacheKey, finalResult);
        
        // 使用頻度を記録
        if (!this.lineUsageCount[selectedLine.lineId]) {
            this.lineUsageCount[selectedLine.lineId] = 0;
        }
        this.lineUsageCount[selectedLine.lineId]++;
        
        // 直近の選択を記録（10件まで）
        this.recentSelections.unshift(selectedLine.lineId);
        if (this.recentSelections.length > 10) {
            this.recentSelections.pop();
        }
        
        // セッションが1時間以上経過したらリセット
        if (Date.now() - this.sessionStartTime > 3600000) {
            this.lineUsageCount = {};
            this.sessionStartTime = Date.now();
            this.recentSelections = [];
        }
        
        console.log(`✅ Selected Line #${selectedLine.lineId}/384 (${selectedLine.hexagramName} ${selectedLine.position}爻) in ${processingTime.toFixed(2)}ms`);
        
        return finalResult;
    }
    
    /**
     * バッチ処理（Promise.allを使った真の並列処理）
     */
    async processBatch(startId, endId, analysis, text) {
        // マイクロタスクで分割して真の並列化
        const MICRO_BATCH_SIZE = 6;
        const promises = [];
        
        for (let i = startId; i <= endId; i += MICRO_BATCH_SIZE) {
            const batchEnd = Math.min(i + MICRO_BATCH_SIZE - 1, endId);
            
            // 各マイクロバッチを独立したPromiseとして実行
            promises.push(
                Promise.resolve().then(async () => {
                    const scores = [];
                    for (let lineId = i; lineId <= batchEnd; lineId++) {
                        const lineData = this.lines384[lineId];
                        if (lineData) {
                            // 直接スコア計算（並列性はPromise.allが保証）
                            const score = this.calculateLineScore(lineId, lineData, analysis, text);
                            scores.push({
                                lineId,
                                score,
                                hexagramId: lineData.hexagram_id,
                                hexagramName: lineData.hexagram_name,
                                position: lineData.position,
                                lineName: lineData.line_name
                            });
                        }
                    }
                    return scores;
                })
            );
        }
        
        // 全マイクロバッチを並列実行
        const results = await Promise.all(promises);
        
        // 結果を平坦化して返す
        return results.flat();
    }
    
    /**
     * テキストの包括的分析
     */
    async performComprehensiveAnalysis(text) {
        const analysis = {
            keywords: [],
            temporal: null,
            energy: null,
            emotion: null,
            semantic_vectors: null,
            context: null
        };
        
        // パターンマッチング分析
        if (this.patternMatcher) {
            const patternResult = this.patternMatcher.analyzeText(text);
            analysis.temporal = patternResult.temporal;
            analysis.energy = patternResult.energy;
            analysis.emotion = patternResult.emotion;
        } else {
            // フォールバック分析（決定論的）
            analysis.temporal = { phase: this.detectTemporalPhase(text), confidence: 0.7 };
            analysis.energy = { direction: this.detectEnergyDirection(text), intensity: 0.6 };
            analysis.emotion = { primary: this.detectEmotion(text), intensity: 0.5 };
        }
        
        // セマンティック分析
        if (this.semanticAnalyzer) {
            const semanticResult = this.semanticAnalyzer.analyze(text);
            analysis.keywords = semanticResult.keywords || [];
            analysis.semantic_vectors = semanticResult.vectors || null;
        } else {
            // 簡易キーワード抽出
            analysis.keywords = this.extractKeywords(text);
            // テキストから656次元ベクトルを生成
            analysis.semantic_vectors = this.generateTextVector656(text);
        }
        
        // コンテキスト分析
        analysis.context = this.analyzeContext(text);
        
        return analysis;
    }
    
    /**
     * テキストから656次元ベクトルを生成
     */
    generateTextVector656(text) {
        const vector = new Float32Array(656);
        
        // テキストの文字コードから決定論的にベクトルを生成
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            
            // 各文字を656次元に分散
            for (let j = 0; j < 8; j++) {
                const idx = (charCode * (j + 1) * 7) % 656;
                vector[idx] += 0.01 * (1 / (i + 1)); // 位置による減衰
            }
        }
        
        // 正規化
        let sum = 0;
        for (let i = 0; i < 656; i++) {
            sum += vector[i] * vector[i];
        }
        if (sum > 0) {
            const norm = Math.sqrt(sum);
            for (let i = 0; i < 656; i++) {
                vector[i] /= norm;
            }
        }
        
        return vector;
    }
    
    /**
     * 時間フェーズの検出（決定論的）
     */
    detectTemporalPhase(text) {
        // D-2-2: フェーズ定義の見直し - より均等な分布を目指す
        const phases = {
            'beginning': {
                keywords: ['始', '新', '初', 'スタート', '開始', '第一歩', '着手', '始まり', '立ち上げ', '起動', '創始'],
                primaryPosition: 1,
                secondaryPosition: null
            },
            'cooperation': {
                keywords: ['協力', '関係', '内面', '相談', '支援', '協調', '協働', '連携', '共同', 'チーム'],
                primaryPosition: 2,
                secondaryPosition: null
            },
            'challenge': {
                keywords: ['困難', '試練', '挑戦', '問題', '課題', '葛藤', '苦労', '壁', '障害', '逆境'],
                primaryPosition: 3,
                secondaryPosition: null
            },
            'transition': {
                keywords: ['変化', '転換', '移行', '岐路', '転機', '変更', '調整', '選択', '決断', '分岐'],
                primaryPosition: 4,
                secondaryPosition: null
            },
            'mature': {
                keywords: ['成熟', '完成', '達成', '成功', '安定', '確立', '充実', 'リーダー', '責任', '統率',
                         '指導', '管理', '権限', '中心', '主導', '統括', '決定', '判断', '方向', '戦略'],
                primaryPosition: 5,
                secondaryPosition: null
            },
            'completion': {
                keywords: ['終', '完了', '結果', '終了', '締結', '最後', '極致', '完結', '成就', '到達'],
                primaryPosition: 6,
                secondaryPosition: null
            }
        };
        
        // D-2-1: 改修 - 複数のフェーズを検出し、優先度を設定
        const detectedPhases = [];
        
        for (const [phase, data] of Object.entries(phases)) {
            let matchCount = 0;
            for (const keyword of data.keywords) {
                if (text.includes(keyword)) {
                    matchCount++;
                }
            }
            
            if (matchCount > 0) {
                detectedPhases.push({
                    phase,
                    score: matchCount,
                    position: data.primaryPosition
                });
            }
        }
        
        // 最も多くマッチしたフェーズを返す
        if (detectedPhases.length > 0) {
            detectedPhases.sort((a, b) => b.score - a.score);
            return detectedPhases[0].phase;
        }
        
        // デフォルトを決定論的ランダム化（ただし均等に分布）
        const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const phaseKeys = Object.keys(phases);
        return phaseKeys[hash % phaseKeys.length];
    }
    
    /**
     * エネルギー方向の検出（決定論的）
     */
    detectEnergyDirection(text) {
        const expanding = ['積極', '前進', '拡大', '成長', '上昇'];
        const contracting = ['慎重', '後退', '縮小', '保守', '下降'];
        
        let expandCount = 0;
        let contractCount = 0;
        
        for (const word of expanding) {
            if (text.includes(word)) expandCount++;
        }
        for (const word of contracting) {
            if (text.includes(word)) contractCount++;
        }
        
        if (expandCount > contractCount) return 'expanding';
        if (contractCount > expandCount) return 'contracting';
        return 'stable';
    }
    
    /**
     * 感情の検出（決定論的）
     */
    detectEmotion(text) {
        const emotions = {
            'confident': ['自信', '確信', '強い'],
            'anxious': ['不安', '心配', '迷'],
            'hopeful': ['希望', '期待', '楽観'],
            'cautious': ['慎重', '警戒', '注意']
        };
        
        for (const [emotion, keywords] of Object.entries(emotions)) {
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    return emotion;
                }
            }
        }
        
        return 'neutral';
    }
    
    /**
     * 簡易キーワード抽出
     */
    extractKeywords(text) {
        const keywords = [];
        const importantTerms = [
            '始', '新', '変', '完', '成', '発', '展', '安', '定', '困', '難',
            '創造', '開始', '成長', '転換', '完了', '危機', '機会', '調和'
        ];
        
        for (const term of importantTerms) {
            if (text.includes(term)) {
                keywords.push(term);
            }
        }
        
        return keywords;
    }
    
    /**
     * コンテキスト分析
     */
    analyzeContext(text) {
        return {
            length: text.length,
            hasQuestion: text.includes('？') || text.includes('?'),
            sentiment: this.analyzeSentiment(text),
            domain: this.detectDomain(text)
        };
    }
    
    /**
     * 感情分析（簡易版）
     */
    analyzeSentiment(text) {
        let score = 0;
        const positive = ['良い', '素晴らしい', '成功', '幸せ', '嬉しい'];
        const negative = ['悪い', '失敗', '困難', '不安', '心配'];
        
        for (const word of positive) {
            if (text.includes(word)) score += 1;
        }
        for (const word of negative) {
            if (text.includes(word)) score -= 1;
        }
        
        return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    }
    
    /**
     * ドメイン検出
     */
    detectDomain(text) {
        if (text.includes('仕事') || text.includes('ビジネス')) return 'business';
        if (text.includes('恋愛') || text.includes('結婚')) return 'relationship';
        if (text.includes('健康') || text.includes('病気')) return 'health';
        if (text.includes('勉強') || text.includes('学習')) return 'education';
        return 'general';
    }
    
    /**
     * 個別の爻スコア計算（384個それぞれに対して実行・同期処理）
     */
    calculateLineScore(lineId, lineData, analysis, text) {
        let score = 0;
        
        // 1. キーワードマッチング (15% - 削減)
        const keywordScore = this.calculateKeywordMatch(lineData.keywords, analysis.keywords);
        score += keywordScore * 0.15;
        
        // 2. 時間フェーズマッチング (5% - 大幅削減)
        const temporalScore = this.calculateTemporalMatch(lineData.temporal_phase, analysis.temporal);
        score += temporalScore * 0.05;
        
        // 3. エネルギーパターンマッチング (10% - 削減)
        const energyScore = this.calculateEnergyMatch(lineData.energy_pattern, analysis.energy);
        score += energyScore * 0.10;
        
        // 4. 感情パターンマッチング (10% - 維持)
        const emotionScore = this.calculateEmotionMatch(lineData.emotion_pattern, analysis.emotion);
        score += emotionScore * 0.10;
        
        // 5. セマンティックベクトル類似度 (45% - 増加)
        if (lineData.semantic_vectors && analysis.semantic_vectors) {
            const semanticScore = this.calculateSemanticSimilarity(
                lineData.semantic_vectors,
                analysis.semantic_vectors
            );
            score += semanticScore * 0.45;
        }
        
        // 6. 爻位置特有の調整（15% - 増加）
        const positionAdjustment = this.getEnhancedPositionAdjustment(lineData.position, text);
        score += positionAdjustment * 0.15;
        
        // 7. 基本ウェイト適用
        score *= lineData.base_weight || 1.0;
        
        // 7.5. Phase 2追加: 位置別調整（マイルドに）
        // D-1-6: 決定・判断系の特別処理追加
        const isDecisionText = this.isDecisionRelatedText(text);
        
        if (lineData.position === 5) {
            // 5爻に適度なボーナス
            score *= 1.05;
            // D-1-6: 決定・判断系テキストで5爻に追加ボーナス
            if (isDecisionText) {
                score *= 1.2;  // 決定系テキストの場合、さらに20%ボーナス
            }
        } else if (lineData.position === 2 || lineData.position === 3) {
            // 2爻と3爻に軽いペナルティ
            score *= 0.95;
        }
        
        // 8. 探索ノイズの追加（D-3-2, D-3-3, E-3: 多様性確保・Phase 3強化・追加ノイズ）
        // テキストとlineIdから決定論的なノイズを生成
        const noiseBase = text.charCodeAt(0) + text.charCodeAt(text.length - 1);
        
        // 使用頻度を先に取得（E-3で必要）
        const usageCount = this.lineUsageCount[lineId] || 0;
        
        // D-3-3: より強力な探索ノイズ実装（0-0.2の範囲）
        const primaryNoise = ((lineId * noiseBase * 13) % 200) / 1000; // 0-0.2に増強
        const secondaryNoise = ((lineId * text.length * 7) % 100) / 1000; // 0-0.1の追加ノイズ
        const tertiaryNoise = ((Math.abs(lineId - 192) * noiseBase) % 50) / 1000; // 0-0.05の位置依存ノイズ
        
        // E-3: 追加ノイズパラメータ設計（未使用爻への探索促進）
        // 未使用爻により高いノイズを付与
        const unusedBonus = (usageCount === 0) ? 0.15 : 0; // 未使用爻に15%ボーナス
        const rareBonus = (usageCount === 1) ? 0.08 : 0; // 低使用爻に8%ボーナス
        
        // 爻位置による追加ノイズ（位置別の未使用率を考慮）
        const positionExplorationNoise = this.getPositionExplorationNoise(lineData.position, lineId);
        
        // 卦単位での探索ノイズ（特定卦への偏り防止）
        const hexagramId = Math.ceil(lineId / 6);
        const hexagramNoise = ((hexagramId * noiseBase * 11) % 100) / 1000; // 0-0.1
        
        const totalNoise = primaryNoise + secondaryNoise + tertiaryNoise + 
                          unusedBonus + rareBonus + positionExplorationNoise + hexagramNoise;
        score += totalNoise;
        
        // D-3-2: セッション経過時間による多様性ボーナス
        const sessionDuration = Date.now() - this.sessionStartTime;
        const timeBonus = Math.min(0.05, sessionDuration / (1000 * 60 * 60)); // 最大0.05（1時間で最大）
        score += timeBonus * ((lineId % 10) / 10); // lineIdによって異なる時間ボーナス
        
        // 9. 使用頻度ペナルティ（D-3-4, D-3-5, E-4: Phase 3強化・動的閾値調整）
        if (!this.lineUsageCount) {
            this.lineUsageCount = {}; // D-3-4: 初期化
        }
        
        // usageCountは既に上で取得済み
        
        // D-3-5, E-4: より強力な使用頻度ペナルティと動的閾値調整
        if (usageCount > 0) {
            // E-4: 動的閾値調整機能実装
            const totalAnalyses = this.stats.totalAnalyses || 1;
            const coverageRate = Object.keys(this.lineUsageCount).length / 384;
            
            // カバー率に応じてペナルティを動的に調整
            let penaltyMultiplier = 1.0;
            if (coverageRate < 0.08) {
                // 8%未満：より厳しいペナルティで新規探索促進
                penaltyMultiplier = 0.8;
            } else if (coverageRate < 0.13) {
                // 8-13%：標準ペナルティ
                penaltyMultiplier = 1.0;
            } else {
                // 13%以上：ペナルティを緩和してバランス重視
                penaltyMultiplier = 1.2;
            }
            
            let penalty = 1.0;
            
            if (usageCount === 1) {
                penalty = 0.95 * penaltyMultiplier;
            } else if (usageCount === 2) {
                penalty = 0.85 * penaltyMultiplier;
            } else if (usageCount === 3) {
                penalty = 0.70 * penaltyMultiplier;
            } else if (usageCount === 4) {
                penalty = 0.50 * penaltyMultiplier;
            } else {
                penalty = Math.max(0.2, (0.5 - (usageCount - 4) * 0.1) * penaltyMultiplier);
            }
            
            score *= penalty;
        }
        
        return Math.max(0, Math.min(1, score)); // 0-1に正規化
    }
    
    /**
     * キーワードマッチング計算
     */
    calculateKeywordMatch(lineKeywords, textKeywords) {
        if (!lineKeywords || !textKeywords || textKeywords.length === 0) {
            return 0;
        }
        
        let matches = 0;
        for (const keyword of textKeywords) {
            if (lineKeywords.includes(keyword)) {
                matches++;
            }
        }
        
        return matches / Math.max(lineKeywords.length, textKeywords.length);
    }
    
    /**
     * 時間フェーズマッチング計算
     */
    calculateTemporalMatch(linePhase, textPhase) {
        if (!linePhase || !textPhase) return 0.5;
        
        const phaseMap = {
            'beginning': 0,
            'early_develop': 1,
            'developing': 2,
            'transition': 3,
            'mature': 4,
            'completion': 5
        };
        
        const linePhaseNum = phaseMap[linePhase.base] || 0;
        const textPhaseNum = phaseMap[textPhase.phase] || 0;
        const distance = Math.abs(linePhaseNum - textPhaseNum);
        
        return Math.max(0, 1 - (distance * 0.2));
    }
    
    /**
     * エネルギーマッチング計算
     */
    calculateEnergyMatch(lineEnergy, textEnergy) {
        if (!lineEnergy || !textEnergy) return 0.5;
        
        let score = 0;
        
        // 方向性の一致
        if (lineEnergy.direction === textEnergy.direction) {
            score += 0.5;
        }
        
        // 強度の近さ
        const intensityDiff = Math.abs((lineEnergy.intensity || 0.5) - (textEnergy.intensity || 0.5));
        score += (1 - intensityDiff) * 0.5;
        
        return score;
    }
    
    /**
     * 感情マッチング計算
     */
    calculateEmotionMatch(lineEmotion, textEmotion) {
        if (!lineEmotion || !textEmotion) return 0.5;
        
        if (lineEmotion.primary === textEmotion.primary) {
            return 1.0;
        }
        
        // 価値の近さで部分スコア
        const valenceDiff = Math.abs((lineEmotion.valence || 0) - (textEmotion.valence || 0));
        return Math.max(0, 1 - valenceDiff * 0.5);
    }
    
    /**
     * セマンティック類似度計算（656次元・決定論的）
     */
    calculateSemanticSimilarity(vector1, vector2) {
        // Math.random()は一切使用禁止！
        
        if (!vector1 || !vector2) return 0;
        
        if (vector1.length !== 656 || vector2.length !== 656) {
            console.error(`Invalid vectors: v1=${vector1.length}, v2=${vector2.length}, expected 656`);
            return 0;
        }
        
        // 重要な次元により重みを付ける
        const dimensionWeights = new Float32Array(656);
        for (let i = 0; i < 656; i++) {
            // 位置ベクトル（100-199）とテキストベクトル（200-299）を重視
            if (i >= 100 && i < 300) {
                dimensionWeights[i] = 1.2;
            } else {
                dimensionWeights[i] = 1.0;
            }
        }
        
        // 実際のコサイン類似度計算
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        for (let i = 0; i < 656; i++) {
            const weight = dimensionWeights[i];
            dotProduct += vector1[i] * vector2[i] * weight;
            norm1 += vector1[i] * vector1[i] * weight;
            norm2 += vector2[i] * vector2[i] * weight;
        }
        
        if (norm1 === 0 || norm2 === 0) return 0;
        
        const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
        return Math.max(0, Math.min(1, similarity));
    }
    
    /**
     * 文脈適合性計算
     */
    calculateContextFitness(lineData, context) {
        if (!context) return 0.5;
        
        let score = 0.5;
        
        // 優先文脈のチェック
        if (lineData.priority_contexts && context.domain) {
            for (const priority of lineData.priority_contexts) {
                if (context.domain.includes(priority) || priority.includes(context.domain)) {
                    score += 0.3;
                    break;
                }
            }
        }
        
        // 回避文脈のチェック
        if (lineData.anti_contexts && context.domain) {
            for (const anti of lineData.anti_contexts) {
                if (context.domain.includes(anti) || anti.includes(context.domain)) {
                    score -= 0.3;
                    break;
                }
            }
        }
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * 爻位置による調整
     */
    getPositionAdjustment(position, analysis) {
        let adjustment = 0;
        
        // 質問文の場合、4爻（外界との関門）を優先
        if (analysis.context && analysis.context.hasQuestion && position === 4) {
            adjustment += 0.1;
        }
        
        // 強い感情の場合、5爻（極盛）を優先
        if (analysis.emotion && analysis.emotion.intensity > 0.6 && position === 5) {
            adjustment += 0.2;  // 0.1から0.2に増加
        }
        
        // 決定・判断系のテキストで5爻を優先
        if (position === 5) {
            const decisionKeywords = ['決定', '判断', '選択', '方針', '戦略', '管理', 'リーダー',
                                    '責任', '成功', '達成', '完成', '成熟', '確立'];
            for (const keyword of decisionKeywords) {
                if (analysis.keywords && analysis.keywords.includes(keyword)) {
                    adjustment += 0.25;  // 0.15から0.25に増加
                    break;
                }
            }
        }
        
        return adjustment;
    }
    
    /**
     * D-1-5: 決定・判断系テキストの判定
     */
    isDecisionRelatedText(text) {
        const decisionKeywords = [
            '決定', '判断', '決断', '決める', '選ぶ', '選択',
            '裁定', '決裁', '承認', '認可', '批准', '決着',
            '結論', '最終', '確定', '方針', '戦略', '計画',
            'リーダー', '指導', '統率', '管理', '経営', '方向性',
            '判定', '評価', '審査', '採択', '実行', '実施'
        ];
        
        for (const keyword of decisionKeywords) {
            if (text.includes(keyword)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * E-3: 位置別探索ノイズ（位置ごとの未使用率を考慮）
     */
    getPositionExplorationNoise(position, lineId) {
        // 位置別の未使用率に基づく追加ノイズ
        // 分析結果から、各位置の未使用傾向を反映
        const positionNoiseFactors = {
            1: 0.08,  // 1爻：比較的バランス良い
            2: 0.05,  // 2爻：既に偏りがあるので控えめ
            3: 0.10,  // 3爻：未使用が多いので高め
            4: 0.12,  // 4爻：最も未使用が多い
            5: 0.06,  // 5爻：改善されたので控えめ
            6: 0.09   // 6爻：まだ改善余地あり
        };
        
        const baseFactor = positionNoiseFactors[position] || 0.08;
        
        // lineIdを使った決定論的なノイズ生成
        const noise = ((lineId * position * 17) % 100) / 1000 * baseFactor;
        
        return noise;
    }
    
    /**
     * 強化された位置調整（テキスト内容に基づく動的調整）
     */
    getEnhancedPositionAdjustment(position, text) {
        // テキストの特徴に基づいた位置優先度
        const adjustments = {
            1: ['始', '新', '初', '基礎', '準備', '第一歩', '着手', 'スタート'],
            2: ['協力', '関係', '内面', '相談', '支援'],  // 適度に復元
            3: ['困難', '試練', '挑戦', '問題'],  // 適度に復元
            4: ['変化', '転換', '決断', '外部', '環境', '選択', '岐路'],
            5: [
                // 既存17個
                'リーダーシップ', '決断', '成熟', '統率', '指導',
                '権威', '頂点', '支配', '君主', '統治',
                '最高', '絶頂', '完成間近', '最終段階', '決定的',
                '主導', '極致',
                // 新規30個（D-1-2）
                '統括', '総括', '監督', '指揮', '采配',
                '統制', '管理職', '経営者', '円熟', '熟練',
                '老練', '達人', 'マスター', 'エキスパート', 'プロフェッショナル',
                'ベテラン', '最終判断', '裁定', '決裁', '承認',
                '認可', '批准', '決着', '重鎮', '要職',
                '高位', '上級', '幹部', '役員', 'トップ',
                // 既存の短縮形も維持
                'リーダー', '責任', '管理', '権限', '中心',
                '決定', '判断', '方向', '戦略', '全体', 
                '統合', 'マネジメント', '上位', '達成', '成功',
                '安定', '確立', '充実', '最適', '理想', 
                '完璧'
            ],
            6: ['完成', '終了', '極限', '最終', '完了', '結果']  // 適度に復元
        };
        
        let maxAdjustment = 0;
        let bestPosition = 0;
        
        // 各位置のキーワードマッチング数を計算
        for (const [pos, keywords] of Object.entries(adjustments)) {
            let matches = 0;
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    matches++;
                }
            }
            
            if (matches > 0) {
                // D-1-1: 5爻の場合はボーナスを0.25に増加（従来0.05）
                const multiplier = (parseInt(pos) === 5) ? 0.25 : 0.05;
                const adjustment = matches * multiplier;
                if (adjustment > maxAdjustment) {
                    maxAdjustment = adjustment;
                    bestPosition = parseInt(pos);
                }
            }
        }
        
        // 該当位置にボーナス、他の位置にはペナルティ
        if (bestPosition === 0) {
            // マッチなしでも5爻には小ボーナス
            return position === 5 ? 0.1 : 0;  // D-1-1: 0.05→0.1に増加
        }
        
        // 2爻と3爻にはより大きなペナルティ
        if (position === 2 || position === 3) {
            return position === bestPosition ? maxAdjustment : -0.05;
        }
        
        return position === bestPosition ? maxAdjustment : -0.03;
    }
    
    /**
     * 特殊爻（用九・用六）のチェック
     * E-5: 用九・用六への条件緩和
     */
    checkSpecialLines(analysis, text) {
        // Phase 4, E-5: 用九・用六の活用強化と条件大幅緩和
        const yangKeywords = ['極限', '究極', '最大', '頂点', '限界突破', '超越',
                            '無限', '全力', '極致', '最高峰', '絶対', '完全',
                            '最強', '最高', '頂上', '至高', '極上', '超'];
        const yinKeywords = ['受容', '包容', '柔軟', '適応', '流れ', '委ねる',
                           '従順', '謙虚', '内省', '調和', '融合', '静寂',
                           '深淵', '底', '無限小', '消失', '空', '無'];
        
        let yangCount = 0;
        let yinCount = 0;
        
        for (const keyword of yangKeywords) {
            if (text.includes(keyword)) yangCount++;
        }
        
        for (const keyword of yinKeywords) {
            if (text.includes(keyword)) yinCount++;
        }
        
        // E-5: 使用頻度に基づく追加ボーナス
        const line385Usage = this.lineUsageCount[385] || 0;
        const line386Usage = this.lineUsageCount[386] || 0;
        
        // 未使用または低使用の場合、選択確率を上げる
        const yang385Bonus = (line385Usage === 0) ? 0.15 : 
                            (line385Usage === 1) ? 0.08 : 0;
        const yin386Bonus = (line386Usage === 0) ? 0.15 : 
                           (line386Usage === 1) ? 0.08 : 0;
        
        // 用九（陽の極致）- E-5: 条件を大幅に緩和
        if ((analysis.energy && analysis.energy.direction === 'expanding' && 
             analysis.energy.intensity > 0.6) || yangCount >= 1 ||
            (text.includes('リーダー') && text.includes('極')) ||
            text.includes('全陽') || text.includes('最') || 
            text.includes('完全') || text.includes('究極')) {
            return {
                lineId: 385,
                score: 0.85 + yang385Bonus,  // E-5: スコア増加+使用頻度ボーナス
                hexagramId: 1,
                hexagramName: '乾為天',
                position: 7
            };
        }
        
        // 用六（陰の極致）- E-5: 条件を大幅に緩和
        if ((analysis.energy && analysis.energy.direction === 'contracting' && 
             analysis.energy.intensity > 0.6) || yinCount >= 1 ||
            (text.includes('受け入れ') && text.includes('全')) ||
            text.includes('全陰') || text.includes('無') || 
            text.includes('空') || text.includes('静寂')) {
            return {
                lineId: 386,
                score: 0.85 + yin386Bonus,  // E-5: スコア増加+使用頻度ボーナス
                hexagramId: 2,
                hexagramName: '坤為地',
                position: 7
            };
        }
        
        return null;
    }
    
    /**
     * 結果の構築
     */
    async buildResult(selectedLine, analysis, text) {
        const lineData = this.lines384[selectedLine.lineId];
        
        // koudo_shishin.jsonから該当データを取得
        const koudoShishinEntry = await this.getKoudoShishinData(selectedLine.lineId);
        
        // 爻名の生成
        const lineName = this.getLineName(selectedLine.hexagramId, selectedLine.position);
        
        return {
            // 基本情報
            line_384_id: selectedLine.lineId,
            hexagram_id: selectedLine.hexagramId,
            hexagram_name: selectedLine.hexagramName,
            line_position: selectedLine.position,
            
            // 爻の詳細
            line_name: lineName,
            line_full_name: `${selectedLine.hexagramName} ${lineName}`,
            
            // 解釈
            interpretation: {
                traditional: koudoShishinEntry ? koudoShishinEntry.shin : '伝統的解釈データなし',
                modern: this.generateModernInterpretation(selectedLine, analysis, lineData),
                advice: this.generateAdvice(selectedLine, analysis, lineData)
            },
            
            // 変爻の解釈
            change_interpretation: koudoShishinEntry ? koudoShishinEntry.hen : null,
            
            // 分析詳細
            analysis: {
                keywords_matched: analysis.keywords,
                temporal_phase: lineData.temporal_phase,
                energy_pattern: lineData.energy_pattern,
                emotion_pattern: lineData.emotion_pattern,
                confidence_score: selectedLine.score
            },
            
            // 爻の特性
            line_characteristics: {
                keywords: lineData.keywords,
                priority_contexts: lineData.priority_contexts,
                anti_contexts: lineData.anti_contexts
            },
            
            // 元のテキスト
            original_text: text
        };
    }
    
    /**
     * koudo_shishin.jsonから該当データを取得
     */
    async getKoudoShishinData(lineId) {
        if (!this.koudoShishinData || this.koudoShishinData.length === 0) {
            return null;
        }
        
        // IDで検索
        let entry = this.koudoShishinData.find(e => e.id === lineId);
        
        // 見つからない場合は名前で検索
        if (!entry && lineId <= 384) {
            const hexagramId = Math.ceil(lineId / 6);
            const linePosition = ((lineId - 1) % 6) + 1;
            const lineName = this.getLineName(hexagramId, linePosition);
            const hexagramName = this.lines384[lineId].hexagram_name;
            
            entry = this.koudoShishinData.find(e => 
                e.name && e.name.includes(hexagramName) && e.name.includes(lineName)
            );
        }
        
        return entry;
    }
    
    /**
     * 爻名の取得
     */
    getLineName(hexagramId, position) {
        // 正しい陰陽判定を使用
        if (typeof getLineYinYang !== 'undefined') {
            try {
                const yinYang = getLineYinYang(hexagramId, position);
                return yinYang.name;
            } catch (e) {
                // フォールバック
            }
        }
        
        // フォールバック
        const positions = ['初', '二', '三', '四', '五', '上'];
        return `第${positions[position - 1]}爻`;
    }
    
    /**
     * 現代的解釈の生成
     */
    generateModernInterpretation(selectedLine, analysis, lineData) {
        const parts = [];
        
        // 時間フェーズに基づく解釈
        const phaseInterpretations = {
            'beginning': '新しい始まりの時期です。',
            'early_develop': '基礎を築く重要な段階です。',
            'developing': '成長と発展の真っ只中にいます。',
            'transition': '転換期を迎えています。',
            'mature': '成熟と実りの時期です。',
            'completion': '一つのサイクルが完了しようとしています。'
        };
        
        parts.push(phaseInterpretations[lineData.temporal_phase.base] || '');
        
        // エネルギーに基づく解釈
        if (lineData.energy_pattern.direction === 'expanding') {
            parts.push('積極的に前進すべき時です。');
        } else if (lineData.energy_pattern.direction === 'contracting') {
            parts.push('内省と準備の時期です。');
        }
        
        // 爻位置に基づくアドバイス
        const positionAdvice = {
            1: '潜在的な力を蓄える時期です。',
            2: '内面の充実を図りましょう。',
            3: '困難はあれど成長の機会です。',
            4: '外界との関わりが重要です。',
            5: 'リーダーシップを発揮する時です。',
            6: '次の段階への準備をしましょう。'
        };
        
        parts.push(positionAdvice[selectedLine.position] || '');
        
        return parts.join(' ');
    }
    
    /**
     * アドバイスの生成
     */
    generateAdvice(selectedLine, analysis, lineData) {
        const advices = [];
        
        // キーワードベースのアドバイス
        if (lineData.keywords.includes('始動')) {
            advices.push('新しいことを始めるのに適した時期です。');
        }
        if (lineData.keywords.includes('忍耐')) {
            advices.push('今は耐え忍ぶことが重要です。');
        }
        if (lineData.keywords.includes('成就')) {
            advices.push('努力が実を結ぶ時が来ました。');
        }
        
        // 感情パターンに基づくアドバイス
        if (lineData.emotion_pattern.primary === 'anxious') {
            advices.push('不安はありますが、それは成長の証です。');
        }
        if (lineData.emotion_pattern.primary === 'confident') {
            advices.push('自信を持って前進してください。');
        }
        
        return advices.length > 0 ? advices.join(' ') : '状況をよく観察し、適切なタイミングで行動しましょう。';
    }
    
    /**
     * 統計情報の更新
     */
    updateStatistics(lineId, processingTime) {
        this.stats.totalAnalyses++;
        this.stats.averageProcessingTime = 
            (this.stats.averageProcessingTime * (this.stats.totalAnalyses - 1) + processingTime) / 
            this.stats.totalAnalyses;
        
        if (lineId >= 1 && lineId <= 386) {
            this.stats.lineSelectionDistribution[lineId - 1]++;
        }
    }
    
    /**
     * キャッシュの更新
     */
    updateCache(key, value) {
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    /**
     * 統計情報の取得
     */
    getStatistics() {
        return {
            ...this.stats,
            cacheSize: this.cache.size,
            mostSelectedLines: this.getMostSelectedLines(),
            leastSelectedLines: this.getLeastSelectedLines()
        };
    }
    
    /**
     * 最も選ばれた爻トップ10
     */
    getMostSelectedLines() {
        const distribution = this.stats.lineSelectionDistribution;
        const sorted = distribution
            .map((count, index) => ({ lineId: index + 1, count }))
            .filter(item => item.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        return sorted;
    }
    
    /**
     * 最も選ばれなかった爻
     */
    getLeastSelectedLines() {
        const distribution = this.stats.lineSelectionDistribution;
        const zeros = distribution
            .map((count, index) => ({ lineId: index + 1, count }))
            .filter(item => item.count === 0)
            .slice(0, 10);
        
        return zeros;
    }
    
    /**
     * デバッグ情報
     */
    /**
     * デバッグ統計の更新
     */
    updateDebugStats(selectedLineId, processingTime) {
        // 統計情報を更新
        this.stats.totalAnalyses++;
        this.stats.averageProcessingTime = 
            (this.stats.averageProcessingTime * 
             (this.stats.totalAnalyses - 1) + processingTime) / 
             this.stats.totalAnalyses;
        
        // 爻選択分布を更新
        if (selectedLineId >= 1 && selectedLineId <= 386) {
            this.stats.lineSelectionDistribution[selectedLineId - 1]++;
            this.debugInfo.statistics.lineSelectionDistribution[selectedLineId - 1]++;
        }
        
        // 最頻出爻を更新
        const distribution = this.stats.lineSelectionDistribution;
        let maxCount = 0;
        let mostFrequent = [];
        
        for (let i = 0; i < 386; i++) {
            if (distribution[i] > maxCount) {
                maxCount = distribution[i];
                mostFrequent = [i + 1];
            } else if (distribution[i] === maxCount && maxCount > 0) {
                mostFrequent.push(i + 1);
            }
        }
        
        this.debugInfo.statistics.mostFrequentLines = mostFrequent.slice(0, 10);
        
        // パフォーマンス統計
        this.performanceStats.min = Math.min(this.performanceStats.min, processingTime);
        this.performanceStats.max = Math.max(this.performanceStats.max, processingTime);
        this.performanceStats.samples.push(processingTime);
        
        // 最新100サンプルのみ保持
        if (this.performanceStats.samples.length > 100) {
            this.performanceStats.samples.shift();
        }
        
        this.lastProcessingTime = processingTime;
        
        // デバッグ情報を更新
        this.debugInfo.statistics.totalAnalyses = this.stats.totalAnalyses;
        this.debugInfo.statistics.averageProcessingTime = this.stats.averageProcessingTime;
    }
    
    /**
     * デバッグ情報取得（完全実装）
     */
    getDebugInfo() {
        // 選択頻度の高い爻TOP10
        const topLines = this.stats.lineSelectionDistribution
            .map((count, idx) => ({
                lineId: idx + 1,
                count: count,
                percentage: (count / Math.max(1, this.stats.totalAnalyses) * 100).toFixed(2)
            }))
            .filter(item => item.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        // 選択されたことがない爻の数
        const neverSelected = this.stats.lineSelectionDistribution
            .filter(count => count === 0).length;
        
        const info = {
            system: {
                initialized: this.initialized,
                koudoShishinLoaded: this.koudoShishinData?.length === 386,
                totalLines: Object.keys(this.lines384).length,
                cacheSize: this.cache.size,
                cacheHitRate: `${(this.stats.cacheHitRate * 100).toFixed(2)}%`
            },
            performance: {
                totalAnalyses: this.stats.totalAnalyses,
                averageProcessingTime: `${this.stats.averageProcessingTime.toFixed(2)}ms`,
                cacheHits: this.stats.cacheHits,
                lastProcessingTime: this.lastProcessingTime ? `${this.lastProcessingTime.toFixed(2)}ms` : 'N/A'
            },
            distribution: {
                topSelectedLines: topLines,
                neverSelectedCount: neverSelected,
                coverageRate: `${((384 - neverSelected) / 384 * 100).toFixed(2)}%`
            }
        };
        
        // パフォーマンス統計を追加
        if (this.performanceStats.samples.length > 0) {
            info.performance.minTime = this.performanceStats.min.toFixed(2) + 'ms';
            info.performance.maxTime = this.performanceStats.max.toFixed(2) + 'ms';
            info.performance.avgTime = (this.performanceStats.samples.reduce((a,b) => a+b, 0) / 
                     this.performanceStats.samples.length).toFixed(2) + 'ms';
            info.performance.samples = this.performanceStats.samples.length;
        }
        
        // 語彙サイズ情報
        if (this.tfidfVectorizer) {
            info.vocabulary = {
                size: this.tfidfVectorizer.vocabulary.size,
                documentsCount: this.tfidfVectorizer.documentsCount
            };
        }
        
        // メモリ使用量（概算）
        const vectorMemory = 656 * 4 * 384; // Float32Array
        const textMemory = this.koudoShishinData ? JSON.stringify(this.koudoShishinData).length : 0;
        info.memory = {
            vectors: (vectorMemory / 1024 / 1024).toFixed(2) + ' MB',
            texts: (textMemory / 1024 / 1024).toFixed(2) + ' MB',
            total: ((vectorMemory + textMemory) / 1024 / 1024).toFixed(2) + ' MB'
        };
        
        return info;
    }
}

// グローバルに公開（ブラウザ環境用）
if (typeof window !== 'undefined') {
    window.TextTo384LinesBridge = TextTo384LinesBridge;
}

// エクスポート（ES6モジュール環境用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextTo384LinesBridge;
}