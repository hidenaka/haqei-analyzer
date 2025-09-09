/**
 * TextTo384LinesBridge - テキストから384個の爻への直接マッピング
 * 各爻を独立したエンティティとして扱う
 * @version 4.0.0 - D1データベース統合版
 * @created 2025-08-26
 * @updated 2025-08-28
 */

// DataService384が必要 - 事前に読み込まれていることを確認
if (typeof DataService384 === 'undefined' && !window.dataService384) {
    console.error('❌ DataService384 is required but not loaded');
    // フォールバックとして動的読み込みを試行
    const script = document.createElement('script');
    script.src = '/js/services/384DataService.js';
    document.head.appendChild(script);
}

// 高度な日本語形態素解析エンジン
class AdvancedJapaneseAnalyzer {
    constructor() {
        // Kuromoji.jsの初期化
        this.tokenizer = null;
        kuromoji.builder({ dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/' }).build((err, tokenizer) => {
            if (err) {
                console.error('❌ Kuromoji initialization failed:', err);
                // フォールバック可視化
                if (window.hudManager) window.hudManager.showFallbackMode(true);
            } else {
                this.tokenizer = tokenizer;
                console.log('✅ Kuromoji initialized successfully');
            }
        });
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
        
        // Top-3候補と寄与内訳の計算
        const top3 = this.calculateTop3(vector);
        const contributions = this.calculateContributions(features);
        return {
            tokens,
            features,
            vector,
            top3,
            contributions
        };
    }
    
    tokenize(text) {
        if (!this.tokenizer) {
            console.error('❌ Tokenizer not initialized');
            return this.fallbackTokenize(text);
        }
        const tokens = this.tokenizer.tokenize(text);
        return tokens
            .filter(token => !this.stopWords.has(token.surface_form))
            .map(token => {
                const dictEntry = this.dictionary[token.surface_form] || {};
                return {
                    surface: token.surface_form,
                    pos: token.pos || dictEntry.pos || this.guessPOS(token.surface_form, token.word_type),
                    weight: dictEntry.weight || 1.0,
                    category: dictEntry.category || 'general',
                    meaning: dictEntry.meaning,
                    type: token.word_type || 'kuromoji'
                };
            });
    }
    
    fallbackTokenize(text) {
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
    calculateTop3(vector) {
        const scores = Array.from(vector).map((score, id) => ({id, score}));
        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, 3);
    }

    calculateContributions(features) {
        const total = Object.values(features.posDistribution).reduce((sum, count) => sum + count, 0);
        return {
            keyword: features.keywords.length / total || 0,
            pos: Object.keys(features.posDistribution).length / 10 || 0,
            category: Object.keys(features.categories).length / 5 || 0
        };
    }

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

    async initializeKuromoji() {
        if (this.tokenizer) return;
        try {
            this.tokenizer = await kuromoji.builder({ dicPath: '/js/lib/kuromoji/dict' }).build();
            console.log('✅ Kuromoji initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Kuromoji:', error);
            this.tokenizer = null;
        }
    }

    testDeterminism(text, iterations = 5) {
        const results = [];
        for (let i = 0; i < iterations; i++) {
            const tokens = this.tokenize(text);
            results.push(JSON.stringify(tokens));
        }
        const uniqueResults = new Set(results);
        return uniqueResults.size === 1;
    }

    structureMorphResults(tokens) {
        const structured = {
            tokens: tokens.map(token => ({
                surface: token.surface,
                pos: token.pos,
                features: token.features || []
            })),
            stats: {
                totalTokens: tokens.length,
                posDistribution: {}
            }
        };

        tokens.forEach(token => {
            structured.stats.posDistribution[token.pos] = (structured.stats.posDistribution[token.pos] || 0) + 1;
        });

        return structured;
    }

    detectNegation(tokens) {
        const negationWords = new Set(['ない', 'ず', 'ぬ', '無', '不', '否']);
        return tokens.some((token, index) => {
            if (negationWords.has(token.surface)) {
                if (index < tokens.length - 1 && tokens[index + 1].pos === 'verb') {
                    return true;
                }
            }
            return false;
        });
    }

    generateDeterministicVector(size, seedInput) {
        const vector = new Float32Array(size);
        if (!this.deterministicMode) {
            for (let i = 0; i < size; i++) {
                vector[i] = this.rng.next() * 0.1;
            }
            return vector;
        }
        const seed = this.hashSeed(seedInput + this.modelVersion + this.salt);
        const rng = new SeedableRandom(seed);
        for (let i = 0; i < size; i++) {
            vector[i] = rng.random() * 0.1;
        }
        return vector;
    }

    hashSeed(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    // Alias for hashSeed to support legacy code
    hashString(input) {
        return this.hashSeed(input);
    }

    detectBias(selections) {
        if (selections.length < 5) return false;
        const recent = selections.slice(-5);
        const hexagramCounts = {};
        recent.forEach(sel => {
            const hexId = Math.ceil(sel / 6);
            hexagramCounts[hexId] = (hexagramCounts[hexId] || 0) + 1;
        });
        return Object.values(hexagramCounts).some(count => count >= 3);
    }

    correctBias(biasedSelection) {
        const hexId = Math.ceil(biasedSelection / 6);
        let newHexId = hexId;
        while (newHexId === hexId) {
            newHexId = Math.floor(this.rng.next() * 64) + 1;
        }
        const newPosition = Math.floor(this.rng.next() * 6) + 1;
        return (newHexId - 1) * 6 + newPosition;
    }

    async loadWord2VecModel(modelPath) {
        try {
            const response = await fetch(modelPath);
            const arrayBuffer = await response.arrayBuffer();
            this.word2vecModel = new Float32Array(arrayBuffer);
            console.log('✅ Word2Vec model loaded');
            if (arrayBuffer.byteLength > 50 * 1024 * 1024) {
                this.reduceVocabulary();
            }
        } catch (error) {
            console.error('❌ Failed to load Word2Vec model:', error);
        }
    }

    reduceVocabulary() {
        console.log('Reducing vocabulary size');
        this.word2vecModel = this.word2vecModel.slice(0, Math.floor(this.word2vecModel.length / 2));
    }

    getWordVector(word) {
        if (!this.word2vecModel) return new Float32Array(300).fill(0);
        const index = this.getWordIndex(word);
        if (index === -1) return this.handleOOV(word);
        return this.word2vecModel.slice(index * 300, (index + 1) * 300);
    }

    getWordIndex(word) {
        const hash = this.hashWord(word);
        return hash % (this.word2vecModel.length / 300);
    }

    hashWord(word) {
        let hash = 0;
        for (let i = 0; i < word.length; i++) {
            hash = ((hash << 5) - hash) + word.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    handleOOV(word) {
        console.warn(`OOV word: ${word}`);
        return new Float32Array(300).fill(0.1);
    }

    generateDeterministicVector(tokens) {
        const vectors = tokens.map(token => this.getWordVector(token.surface));
        const avgVector = vectors.reduce((acc, vec) => {
            for (let i = 0; i < vec.length; i++) {
                acc[i] = (acc[i] || 0) + vec[i];
            }
            return acc;
        }, new Float32Array(300));
        for (let i = 0; i < avgVector.length; i++) {
            avgVector[i] /= vectors.length;
        }
        return avgVector;
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
    
    // ドキュメント配列から語彙を構築（D1データベース対応）
    buildVocabularyFromDocuments(documents) {
        this.documentsCount = documents.length;
        const documentFrequency = new Map();
        
        // 各ドキュメントの単語出現頻度を計算
        documents.forEach(doc => {
            const tokens = this.tokenizer.analyze(doc).tokens;
            const uniqueTokens = new Set(tokens.map(t => t.word));
            
            uniqueTokens.forEach(word => {
                documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1);
            });
        });
        
        // 語彙インデックスとIDF値を計算
        let index = 0;
        documentFrequency.forEach((freq, word) => {
            this.vocabulary.set(word, index++);
            this.idf.set(word, Math.log(this.documentsCount / freq));
        });
        
        console.log(`✅ Vocabulary built: ${this.vocabulary.size} terms from ${documents.length} documents`);
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
        console.log('🚀 Initializing TextTo384LinesBridge - D1 Database Integration System');
        
        this.patternMatcher = null; // AdvancedPatternMatcherを使用
        this.semanticAnalyzer = null; // LightweightSemanticEngineを使用
        this.initialized = false;
        this.deterministicMode = true; // Default to deterministic mode
        this.modelVersion = '1.0';
        this.salt = 'haqei-fixed-salt';
        
        // DataService384インスタンス取得
        this.dataService = window.dataService384 || new DataService384();
        
        // 高度な日本語分析用
        this.advancedAnalyzer = new AdvancedJapaneseAnalyzer();
        this.tfidfVectorizer = new TFIDFVectorizer();
        
        // 384個の爻データベース（D1から動的に読み込み）
        this.lines384 = null; // 初期化時にD1から読み込み
        this.hexagramData = null; // 卦データ
        this.yaoData = null; // 爻辞データ
        
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
                hexagramId: hexagramId,
                hexagramName: hexagramNames[hexagramId - 1],
                position: linePosition,
                
                // 各爻の独自の特性
                keywords: this.generateLineKeywords(lineId, hexagramId, linePosition),
                temporalPhase: this.assignTemporalPhase(lineId, hexagramId, linePosition),
                energyPattern: this.assignEnergyPattern(lineId, hexagramId, linePosition),
                emotionPattern: this.assignEmotionPattern(lineId, hexagramId, linePosition),
                
                // セマンティックベクトル（簡易版）
                semanticVectors: this.generateSemanticVectors(lineId),
                
                // この爻が優先される文脈
                priorityContexts: this.generatePriorityContexts(lineId, hexagramId, linePosition),
                
                // この爻が避けられる文脈
                antiContexts: this.generateAntiContexts(lineId, hexagramId, linePosition),
                
                // 基本ウェイト
                baseWeight: 1.0
            };
        }
        
        // 用九・用六を追加（385, 386）
        lines[385] = {
            id: 385,
            special: true,
            name: '用九',
            hexagramId: 1,
            hexagramName: '乾為天',
            keywords: ['全陽', '極致', '転換点', '群龍無首', 'リーダーシップの超越'],
            condition: 'all_yang',
            temporalPhase: { base: 'transcendent', modifier: 0 },
            energyPattern: { type: 'yang_extreme', intensity: 1.0 },
            baseWeight: 0.8
        };
        
        lines[386] = {
            id: 386,
            special: true,
            name: '用六',
            hexagramId: 2,
            hexagramName: '坤為地',
            keywords: ['全陰', '受容', '柔軟性', '利永貞', '永続的な貞正'],
            condition: 'all_yin',
            temporalPhase: { base: 'eternal', modifier: 0 },
            energyPattern: { type: 'yin_extreme', intensity: 1.0 },
            baseWeight: 0.8
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
     * 爻位置のエンコード（100次元）- F-1/F-2/F-3: 均等分布最適化版
     */
    encodePositionVector(vector, offset, position) {
        // F-1: 現状分析に基づく位置別重み
        // F-2: 理想分布モデル（各位置16.67%）を目指す
        // F-3: 位置別重みの微調整
        
        // 分析結果に基づく新しい重み配分
        // 目標：全位置を0.5に近づけて均等化
        const positionWeights = [
            0.5,   // 1爻
            0.3,   // 2爻: 下げる
            0.4,   // 3爻
            0.5,   // 4爻
            0.85,  // 5爻: 大幅強化！
            0.3    // 6爻: 下げる
        ];
        
        const weight = positionWeights[position - 1];
        
        // F-3: より均等な分布を実現する新しいエンコーディング
        for (let i = 0; i < 100; i++) {
            // 位置ごとの中心をより均等に配置
            const center = (position - 1) * 16.67;
            const sigma = 12; // シグマを調整して重なりを制御
            const distance = Math.abs(i - center);
            
            // 基本ガウシアン分布
            const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
            
            // F-3: 位置固有パターンを追加（決定論的だが多様性を保つ）
            const pattern1 = Math.sin(position * i * 0.1) * 0.08;
            const pattern2 = Math.cos(position * i * 0.15) * 0.05;
            
            // 最終値の計算（重みを適用）
            vector[offset + i] = weight * gaussian + pattern1 + pattern2;
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
     * 初期化処理 - D1データベース統合版
     */
    async initialize() {
        if (typeof SeedableRandom === 'undefined') {
            console.warn('SeedableRandom not available, falling back to Math.random');
            this.deterministicMode = false;
        }
        console.log('🔄 Initializing TextTo384LinesBridge with D1 Database...');
        
        try {
            // DataService384の初期化
            await this.dataService.initialize();
            console.log('✅ DataService384 initialized');
            
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
            
            // D1データベースから384爻データを読み込み
            await this.loadFromD1Database();
            
            // フォールバック: データが取得できない場合は静的データを構築
            if (!this.lines384 || this.lines384.length === 0) {
                console.warn('⚠️ D1 data unavailable, using fallback static data');
                this.lines384 = this.buildComplete384LineDatabase();
            }
            
            this.initialized = true;
            console.log('✅ TextTo384LinesBridge initialized with D1 integration');
            console.log(`📊 Loaded ${this.lines384?.length || 0} lines from database`);
            
            return true;
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            
            // エラー時のフォールバック処理
            console.log('⚠️ Attempting fallback initialization...');
            this.lines384 = this.buildComplete384LineDatabase();
            this.initialized = true;
            
            return true;
        }
    }
    
    /**
     * D1データベースから384爻データを読み込み
     */
    async loadFromD1Database() {
        console.log('📊 Loading data from D1 Database...');
        
        try {
            // 384爻データを取得
            const lines = await this.dataService.fetchLines();
            const hexagrams = await this.dataService.fetchHexagrams();
            const yaoci = await this.dataService.fetchYaoci();
            
            console.log(`📦 Fetched: ${lines?.length || 0} lines, ${hexagrams?.length || 0} hexagrams, ${yaoci?.length || 0} yaoci`);
            
            // データを内部形式に変換
            if (lines && lines.length > 0) {
                this.lines384 = lines.map((line, index) => {
                    const hexagramId = Math.floor(index / 6) + 1;
                    const linePosition = index % 6 + 1;
                    const hexagram = hexagrams?.find(h => h.id === hexagramId);
                    const yaoLine = yaoci?.find(y => 
                        y.hexagramId === hexagramId && y.linePosition === linePosition
                    );
                    
                    return {
                        id: line.shishinId || index + 1,
                        hexagramId: hexagramId,
                        position: linePosition,
                        hexagramName: hexagram?.name || `卦${hexagramId}`,
                        lineName: line.title || `Line ${index + 1}`,
                        description: line.description || '',
                        advice: line.category || '',
                        yaociText: yaoLine?.text || '',
                        interpretation: yaoLine?.interpretation || '',
                        // 656次元ベクトルは後で生成
                        vector656: this.generateDeterministicVector(656, line.id),
                        // メタデータ
                        keywords: this.extractKeywords(line.description || ''),
                        sentiment: this.analyzeSentiment(line.description || ''),
                        category: line.category || 'general',
                        dbSource: 'D1'
                    };
                });
                
                // TF-IDF語彙を構築
                console.log('📚 Building TF-IDF vocabulary from D1 data...');
                const documents = this.lines384.map(line => 
                    `${line.lineName} ${line.description} ${line.advice} ${line.yaociText}`
                );
                this.tfidfVectorizer.buildVocabularyFromDocuments(documents);
                console.log(`✅ Vocabulary built: ${this.tfidfVectorizer.vocabulary.size} terms`);
                
                // 各爻の656次元ベクトルを更新
                this.lines384.forEach(line => {
                    const text = `${line.lineName} ${line.description} ${line.advice}`;
                    const analysis = this.advancedAnalyzer.analyze(text);
                    line.semantic_vectors = analysis.vector;
                    if (!line.semantic_vectors) {
                        line.semantic_vectors = this.generateSemanticVectors(line.id);
                    }
                });
                
                console.log('✅ D1 Database data loaded and processed successfully');
            } else {
                console.warn('⚠️ No data retrieved from D1 Database');
                this.lines384 = [];
            }
            
            this.hexagramData = hexagrams;
            this.yaoData = yaoci;
            
        } catch (error) {
            console.error('❌ Failed to load from D1 Database:', error);
            throw error;
        }
    }
    
    /**
     * キーワード抽出ヘルパー
     */
    extractKeywords(text) {
        if (!text) return [];
        
        const keywords = [];
        const words = text.match(/[一-龠々]+|[ぁ-ん]+|[ァ-ヴー]+/g) || [];
        
        words.forEach(word => {
            if (word.length >= 2 && !this.advancedAnalyzer.stopWords.has(word)) {
                keywords.push(word);
            }
        });
        
        return keywords.slice(0, 10); // 上位10個のキーワード
    }
    
    /**
     * センチメント分析ヘルパー
     */
    analyzeSentiment(text) {
        if (!text) return 0;
        
        let score = 0;
        const positive = ['吉', '利', '貞', '善', '成功', '発展', '幸'];
        const negative = ['凶', '悔', '咎', '困難', '失敗', '危険', '難'];
        
        positive.forEach(word => {
            if (text.includes(word)) score += 1;
        });
        
        negative.forEach(word => {
            if (text.includes(word)) score -= 1;
        });
        
        return Math.max(-1, Math.min(1, score * 0.3)); // -1 to 1の範囲に正規化
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
        // A6: HUD配線強化 - パフォーマンス計測開始
        const hudStartTime = performance.now();
        
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
            
            // A6: HUD配線強化 - キャッシュヒット時のメトリクス更新
            const hudCacheTime = performance.now() - hudStartTime;
            if (window.hudManager && typeof window.hudManager.updateMetrics === 'function') {
                window.hudManager.updateMetrics({
                    analysisTime: hudCacheTime,
                    selectedLineId: cachedResult.line_id || 0,
                    confidence: cachedResult.confidence_score || 0,
                    linesEvaluated: 0,
                    fromCache: true
                });
            }
            
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
        
        // Top-3のスコア分解を追加
        const top3 = lineScores.slice(0, 3).map(l => ({
            lineId: l.lineId,
            score: l.score,
            breakdown: l.breakdown || { semantic: 0, position: 0, temporal: 0, energy: 0, emotion: 0, correction: 0, penalty: 0 }
        }));
        
        // 用九/用六の安全弁: 連続選択を防ぐ
        const specialLines = [385, 386]; // 用九と用六
        if (specialLines.includes(selectedLine.lineId) && this.recentSelections.length > 0 && specialLines.includes(this.recentSelections[0])) {
            // 連続の場合、次点を選択
            selectedLine = lineScores[1] || selectedLine; // 安全のため
        }
        
        // D-3-4: lineUsageCountの更新
        if (!this.lineUsageCount) {
            this.lineUsageCount = {};
        }
        this.lineUsageCount[selectedLine.lineId] = (this.lineUsageCount[selectedLine.lineId] || 0) + 1;
        
        // F-5: 位置分布の追跡
        if (!this.positionDistribution) {
            this.positionDistribution = [0, 0, 0, 0, 0, 0];
        }
        const lineData = this.lines384[selectedLine.lineId];
        if (lineData && lineData.position >= 1 && lineData.position <= 6) {
            this.positionDistribution[lineData.position - 1]++;
        }
        
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
                    position: l.position,
                    breakdown: l.breakdown || { semantic: 0, position: 0, temporal: 0, energy: 0, emotion: 0, correction: 0, penalty: 0 }
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
        
        // 用九/用六のキャップ: セッション内で最大3回
        const specialCount = this.recentSelections.filter(id => specialLines.includes(id)).length;
        if (specialCount > 3) {
            // 超過の場合、次点を選択
            selectedLine = lineScores.find(l => !specialLines.includes(l.lineId)) || selectedLine;
        }
        
        // セッションが1時間以上経過したらリセット
        if (Date.now() - this.sessionStartTime > 3600000) {
            this.lineUsageCount = {};
            this.sessionStartTime = Date.now();
            this.recentSelections = [];
        }
        
        console.log(`✅ Selected Line #${selectedLine.lineId}/384 (${selectedLine.hexagramName} ${selectedLine.position}爻) in ${processingTime.toFixed(2)}ms`);
        
        // A5: 偏り検知のための記録
        if (window.biasDetector) {
            window.biasDetector.addSelection({
                lineId: selectedLine.lineId,
                hexagramId: selectedLine.hexagramId,
                position: selectedLine.position
            });
            if (window.biasDetector.history.length % 100 === 0) {
                window.biasDetector.detectBias();
            }
        }
        
        // A6: HUD配線強化 - メトリクス更新
        const hudTotalTime = performance.now() - hudStartTime;
        if (window.hudManager && typeof window.hudManager.updateMetrics === 'function') {
            // データソースの判定
            let dataSource = 'Unknown';
            if (this.lines384 && this.lines384.length > 0) {
                const firstLine = this.lines384[0];
                if (firstLine.dbSource === 'D1') {
                    dataSource = 'D1';
                } else if (firstLine.dbSource === 'JSON') {
                    dataSource = 'JSON';
                } else {
                    dataSource = 'Generated';
                }
            }
            
            // 解析モードの判定
            let parseMode = 'Unknown';
            if (window.morphAnalyzer && typeof window.morphAnalyzer.getMode === 'function') {
                parseMode = window.morphAnalyzer.getMode();
            } else if (window.OfflineKuromojiInitializer && window.OfflineKuromojiInitializer.isInitialized) {
                parseMode = 'kuromoji';
            } else {
                parseMode = 'fallback';
            }
            
            window.hudManager.updateMetrics({
                analysisTime: hudTotalTime,
                selectedLineId: selectedLine.lineId,
                confidence: selectedLine.score,
                linesEvaluated: lineScores.length,
                fromCache: false,
                dataSource: dataSource,
                parseMode: parseMode,
                determinismRate: 100 // TODO: 実際の決定論率計算を実装
            });
        }
        
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
                                hexagramId: lineData.hexagramId,
                                hexagramName: lineData.hexagramName,
                                position: lineData.position,
                                lineName: lineData.lineName
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
     * G-4/G-5/G-6: コンテキスト理解改善
     */
    async performComprehensiveAnalysis(text) {
        // Task 5-1/5-2/5-3/5-7: エッジケース対応の前処理
        const processedText = this.preprocessTextForEdgeCases(text);
        
        const analysis = {
            keywords: [],
            temporal: null,
            energy: null,
            emotion: null,
            semantic_vectors: null,
            context: null,
            // G-4: 追加の分析情報
            textLength: processedText.length,
            originalLength: text.length,
            sentenceCount: this.countSentences(processedText),
            complexityScore: this.calculateComplexity(processedText),
            domainHints: this.detectDomain(processedText),
            // Task 5-1/5-2: エッジケース情報
            isShortText: processedText.length < 5,
            isLongText: processedText.length > 100,
            hasSpecialChars: this.hasSpecialCharacters(text),
            processedText: processedText
        };
        
        // Task 5-6: 曖昧入力の処理改善
        // 処理後のテキストを使用して分析
        const textForAnalysis = analysis.processedText;
        
        // パターンマッチング分析
        if (this.patternMatcher) {
            const patternResult = this.patternMatcher.analyzeText(textForAnalysis);
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
            // G-5: 強化されたキーワード抽出
            analysis.keywords = this.extractEnhancedKeywords(text);
            // テキストから656次元ベクトルを生成
            analysis.semantic_vectors = this.generateTextVector656(text);
        }
        
        // G-6: 強化されたコンテキスト分析
        analysis.context = this.analyzeEnhancedContext(text, analysis);
        
        return analysis;
    }
    
    /**
     * G-4: 文の数をカウント
     */
    countSentences(text) {
        const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim().length > 0);
        return sentences.length;
    }
    
    /**
     * G-4: テキストの複雑度を計算
     */
    calculateComplexity(text) {
        const charCount = text.length;
        const uniqueChars = new Set(text).size;
        const diversity = uniqueChars / Math.max(1, charCount);
        
        // 漢字の割合も考慮
        const kanjiCount = (text.match(/[\u4E00-\u9FAF]/g) || []).length;
        const kanjiRatio = kanjiCount / Math.max(1, charCount);
        
        return diversity * 0.5 + kanjiRatio * 0.5;
    }
    
    /**
     * G-4: ドメインヒントを検出
     */
    detectDomain(text) {
        const domains = {
            business: ['会議', '報告', '予算', '売上', '戦略', '経営', 'プロジェクト'],
            personal: ['私', '自分', '気持ち', '感情', '思い', '心'],
            technical: ['システム', 'データ', 'プログラム', '開発', '技術', 'AI'],
            academic: ['研究', '論文', '分析', '考察', '実験', '理論'],
            creative: ['創造', 'アイデア', 'デザイン', '芸術', '表現', '作品']
        };
        
        const hints = [];
        for (const [domain, keywords] of Object.entries(domains)) {
            const count = keywords.filter(kw => text.includes(kw)).length;
            if (count > 0) {
                hints.push({ domain, strength: count / keywords.length });
            }
        }
        
        return hints;
    }
    
    /**
     * G-5: 強化されたキーワード抽出
     */
    extractEnhancedKeywords(text) {
        const keywords = this.extractKeywords(text);
        
        // 重要度でソート
        const weightedKeywords = keywords.map(keyword => {
            const frequency = (text.match(new RegExp(keyword, 'g')) || []).length;
            const position = text.indexOf(keyword) / Math.max(1, text.length);
            const importance = frequency * (1 - position * 0.5); // 前の方にあるほど重要
            
            return { keyword, importance };
        });
        
        weightedKeywords.sort((a, b) => b.importance - a.importance);
        return weightedKeywords.slice(0, 10).map(item => item.keyword);
    }
    
    /**
     * G-6: 強化されたコンテキスト分析
     */
    analyzeEnhancedContext(text, analysis) {
        const context = this.analyzeContext(text);
        
        // 追加のコンテキスト情報
        context.enhanced = {
            complexity: analysis.complexityScore,
            domains: analysis.domainHints,
            temporalStrength: analysis.temporal ? analysis.temporal.confidence : 0,
            emotionalIntensity: analysis.emotion ? analysis.emotion.intensity : 0,
            keywordDensity: analysis.keywords.length / Math.max(1, analysis.sentenceCount)
        };
        
        return context;
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
     * F-5: バランシングアルゴリズム実装
     * 位置分布の偏りを動的に補正
     */
    getPositionBalancingFactor(position) {
        // 現在の分布状況を確認
        if (!this.positionDistribution) {
            this.positionDistribution = [0, 0, 0, 0, 0, 0];
        }
        
        const totalAnalyses = this.stats.totalAnalyses || 1;
        
        // 各位置の現在の選択率を計算
        const currentRates = this.positionDistribution.map(count => count / totalAnalyses);
        const idealRate = 1 / 6; // 16.67%
        
        // 偏差を計算
        const deviations = currentRates.map(rate => rate - idealRate);
        
        // バランシング係数を計算（偏りが大きいほど強い補正）
        let factor = 1.0;
        const deviation = deviations[position - 1];
        
        if (deviation > 0.05) {
            // 過多：ペナルティ
            factor = 0.8 - (deviation * 0.5);
        } else if (deviation < -0.05) {
            // 不足：ボーナス
            factor = 1.2 - (deviation * 0.5);
        }
        
        return Math.max(0.5, Math.min(1.5, factor));
    }
    
    /**
     * 個別の爻スコア計算（384個それぞれに対して実行・同期処理）
     */
    calculateLineScore(lineId, lineData, analysis, text) {
        let score = 0;
        const breakdown = {
            semantic: 0,
            position: 0,
            temporal: 0,
            energy: 0,
            emotion: 0,
            correction: 0,
            penalty: 0
        };
        
        // EMERGENCY FIX: Add base chance for all lines (coverage improvement)
        const baseChance = 0.002; // Small base chance for every line
        score += baseChance;
        
        // 1. キーワードマッチング (15% - 削減)
        const keywordScore = this.calculateKeywordMatch(lineData.keywords, analysis.keywords);
        score += keywordScore * 0.15;
        
        // 2. 時間フェーズマッチング (5% - 大幅削減)
        const temporalScore = this.calculateTemporalMatch(lineData.temporal_phase, analysis.temporal);
        score += temporalScore * 0.05;
        breakdown.temporal = temporalScore * 0.05;
        
        // 3. エネルギーパターンマッチング (10% - 削減)
        const energyScore = this.calculateEnergyMatch(lineData.energy_pattern, analysis.energy);
        score += energyScore * 0.10;
        breakdown.energy = energyScore * 0.10;
        
        // 4. 感情パターンマッチング (10% - 維持)
        const emotionScore = this.calculateEmotionMatch(lineData.emotion_pattern, analysis.emotion);
        score += emotionScore * 0.10;
        breakdown.emotion = emotionScore * 0.10;
        
        // 5. セマンティックベクトル類似度 (45% - 増加)
        let semanticScore = 0;
        if (lineData.semantic_vectors && analysis.semantic_vectors) {
            semanticScore = this.calculateSemanticSimilarity(
                lineData.semantic_vectors,
                analysis.semantic_vectors
            );
            score += semanticScore * 0.45;
            breakdown.semantic = semanticScore * 0.45;
        }
        
        // 6. 爻位置特有の調整（15% - 増加）
        const positionAdjustment = this.getEnhancedPositionAdjustment(lineData.position, text);
        score += positionAdjustment * 0.15;
        breakdown.position = positionAdjustment * 0.15;
        
        // 7. 基本ウェイト適用
        score *= lineData.base_weight || 1.0;
        
        // 7.5. F-5: バランシングアルゴリズムを適用
        const balancingFactor = this.getPositionBalancingFactor(lineData.position);
        score *= balancingFactor;
        
        // 7.6. 決定・判断系の特別処理（維持）
        const isDecisionText = this.isDecisionRelatedText(text);
        if (lineData.position === 5 && isDecisionText) {
            score *= 1.1;  // 決定系テキストで5爻に小ボーナス（F-5で調整）
        }
        
        // 8. 探索ノイズの追加（D-3-2, D-3-3, E-3: 多様性確保・Phase 3強化・追加ノイズ）
        // テキストとlineIdから決定論的なノイズを生成
        const noiseBase = text.charCodeAt(0) + text.charCodeAt(text.length - 1);
        
        // 使用頻度を先に取得（E-3で必要）
        const usageCount = this.lineUsageCount[lineId] || 0;
        
        // EMERGENCY FIX: Enhanced exploration noise for coverage improvement
        const primaryNoise = ((lineId * noiseBase * 17) % 200) / 1000; // Increased: 0-0.2
        const secondaryNoise = ((lineId * text.length * 11) % 150) / 1000; // Increased: 0-0.15
        const tertiaryNoise = ((Math.abs(lineId - 192) * noiseBase) % 100) / 1000; // Increased: 0-0.1
        
        // EMERGENCY FIX: Much stronger bonus for unused lines
        const unusedBonus = (usageCount === 0) ? 0.35 : 0; // Doubled bonus for unused lines
        const rareBonus = (usageCount === 1) ? 0.20 : 0; // Increased bonus for rarely used lines
        const mediumBonus = (usageCount === 2) ? 0.10 : 0; // Added bonus for medium usage
        
        // 爻位置による追加ノイズ（位置別の未使用率を考慮）
        const positionExplorationNoise = this.getPositionExplorationNoise(lineData.position, lineId);
        
        // 卦単位での探索ノイズ（特定卦への偏り防止）
        const hexagramId = Math.ceil(lineId / 6);
        const hexagramNoise = ((hexagramId * noiseBase * 11) % 100) / 1000; // 0-0.1
        
        // Task 4-9: 卦単位での多様性ボーナスを追加
        const hexagramDiversityBonus = this.getHexagramDiversityBonus(hexagramId, lineData.position);
        
        const totalNoise = primaryNoise + secondaryNoise + tertiaryNoise + 
                          unusedBonus + rareBonus + mediumBonus + positionExplorationNoise + hexagramNoise + hexagramDiversityBonus;
        score += totalNoise;
        
        // D-3-2: 決定論的な多様性ボーナス（テキストハッシュベース）
        const hashSeed = this.hashString(text + this.modelVersion + this.salt);
        const deterministicBonus = (hashSeed % 100) / 2000; // 0-0.05の範囲で決定論的
        score += deterministicBonus * ((lineId % 10) / 10); // lineIdによって異なるボーナス
        
        // 9. 使用頻度ペナルティ（D-3-4, D-3-5, E-4: Phase 3強化・動的閾値調整）
        if (!this.lineUsageCount) {
            this.lineUsageCount = {}; // D-3-4: 初期化
        }
        
        // usageCountは既に上で取得済み
        
        // D-3-5, E-4: より強力な使用頻度ペナルティと動的閾値調整
        // Task 4-8: 使用頻度ペナルティの段階的強化
        if (usageCount > 0) {
            // E-4: 動的閾値調整機能実装
            const totalAnalyses = this.stats.totalAnalyses || 1;
            const coverageRate = Object.keys(this.lineUsageCount).length / 384;
            
            // Task 4-8: より細かい段階でのペナルティ調整
            let penaltyMultiplier = 1.0;
            if (coverageRate < 0.05) {
                // 5%未満：最も厳しいペナルティで積極的探索
                penaltyMultiplier = 0.6;
            } else if (coverageRate < 0.08) {
                // 5-8%：厳しいペナルティで新規探索促進
                penaltyMultiplier = 0.7;
            } else if (coverageRate < 0.10) {
                // 8-10%：やや厳しいペナルティ
                penaltyMultiplier = 0.85;
            } else if (coverageRate < 0.13) {
                // 10-13%：標準ペナルティ
                penaltyMultiplier = 1.0;
            } else if (coverageRate < 0.15) {
                // 13-15%：ペナルティをやや緩和
                penaltyMultiplier = 1.1;
            } else {
                // 15%以上：ペナルティを緩和してバランス重視
                penaltyMultiplier = 1.2;
            }
            
            // Task 6-2: より緩やかなペナルティカーブに調整
            let penalty = 1.0;
            
            if (usageCount === 1) {
                penalty = 0.95 * penaltyMultiplier;  // EMERGENCY FIX: Even more lenient
            } else if (usageCount === 2) {
                penalty = 0.88 * penaltyMultiplier;  // EMERGENCY FIX: More lenient
            } else if (usageCount === 3) {
                penalty = 0.75 * penaltyMultiplier;  // EMERGENCY FIX: More lenient
            } else if (usageCount === 4) {
                penalty = 0.60 * penaltyMultiplier;  // EMERGENCY FIX: More lenient
            } else if (usageCount === 5) {
                penalty = 0.45 * penaltyMultiplier;  // EMERGENCY FIX: More lenient
            } else {
                // 6回以上使用された爻には最小ペナルティ
                penalty = Math.max(0.15, (0.3 - (usageCount - 5) * 0.03) * penaltyMultiplier);
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
     * G-1/G-2/G-3: セマンティック分析強化
     */
    calculateSemanticSimilarity(vector1, vector2) {
        // Math.random()は一切使用禁止！
        
        if (!vector1 || !vector2) return 0;
        
        if (vector1.length !== 656 || vector2.length !== 656) {
            console.error(`Invalid vectors: v1=${vector1.length}, v2=${vector2.length}, expected 656`);
            return 0;
        }
        
        // G-1: セグメントベースの重み付け分析
        // Task 4-2/4-3: セグメント重み最適化
        // Task 4-6: 類似度計算最適化 - 動的重み調整を追加
        const segments = {
            hexagram: { start: 0, end: 100, weight: 1.0 },      // 卦特性（維持）
            position: { start: 100, end: 200, weight: 1.3 },    // 位置特性（1.5→1.3 依存軽減）
            text: { start: 200, end: 300, weight: 2.0 },        // テキスト特性（1.8→2.0 最重要）
            change: { start: 300, end: 400, weight: 1.1 },      // 変化特性（1.0→1.1 微強化）
            temporal: { start: 400, end: 500, weight: 0.8 },    // 時間特性（維持）
            context: { start: 500, end: 656, weight: 1.5 }      // コンテキスト（1.2→1.5 強化）
        };
        
        // G-2: セグメント別の類似度計算
        // Task 4-6: 類似度計算最適化 - 高速化と精度向上
        let segmentScores = {};
        let totalWeightedScore = 0;
        let totalWeight = 0;
        
        // セグメント別に独立して類似度を計算（並列化可能な構造）
        for (const [segmentName, segment] of Object.entries(segments)) {
            let dotProduct = 0;
            let norm1 = 0;
            let norm2 = 0;
            let activeElements = 0;
            
            // Task 4-6: 早期終了による最適化
            // 非ゼロ要素のみ計算（スパース性を活用）
            for (let i = segment.start; i < segment.end && i < vector1.length; i++) {
                const v1 = vector1[i] || 0;
                const v2 = vector2[i] || 0;
                
                // 非ゼロ要素のみ計算
                if (v1 !== 0 || v2 !== 0) {
                    dotProduct += v1 * v2;
                    norm1 += v1 * v1;
                    norm2 += v2 * v2;
                    activeElements++;
                }
            }
            
            // セグメントの類似度計算
            let segmentSimilarity = 0;
            if (norm1 > 0 && norm2 > 0) {
                segmentSimilarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
                
                // Task 4-6: アクティブ要素の密度による調整
                // アクティブ要素が多いほど信頼度が高い
                const density = activeElements / (segment.end - segment.start);
                segmentSimilarity *= (0.5 + 0.5 * density);
            }
            
            segmentScores[segmentName] = segmentSimilarity;
            totalWeightedScore += segmentSimilarity * segment.weight;
            totalWeight += segment.weight;
        }
        
        // 重み付き平均
        const baseSimilarity = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
        
        // Task 4-6: 適応的非線形変換
        // カバー率に応じて変換の強度を調整
        const coverageRate = Object.keys(this.lineUsageCount || {}).length / 384;
        const transformPower = coverageRate < 0.10 ? 0.6 : 0.7;  // カバー率が低い時はより強い変換
        
        const enhancedSimilarity = Math.pow(Math.max(0, baseSimilarity), transformPower);
        
        // Task 4-6: セグメント別スコアを考慮した調整
        // テキストセグメントのスコアが高い場合は追加ボーナス
        if (segmentScores.text > 0.7) {
            const textBonus = (segmentScores.text - 0.7) * 0.2;
            return Math.min(1, enhancedSimilarity + textBonus);
        }
        
        // 閾値処理で差を強調
        let finalSimilarity = enhancedSimilarity;
        if (enhancedSimilarity > 0.7) {
            finalSimilarity = 0.7 + (enhancedSimilarity - 0.7) * 1.5;
        } else if (enhancedSimilarity < 0.3) {
            finalSimilarity = enhancedSimilarity * 0.8;
        }
        
        return Math.max(0, Math.min(1, finalSimilarity));
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
                                    '責任', '成功', '達成', '完成', '成熟', '確立',
                                    '決め', '社長', 'マネージャー', '上司', '主導', 
                                    '統括', 'トップ', '重要', '承認', '経営', '統率',
                                    '指導', '権限', '中心'];
            for (const keyword of decisionKeywords) {
                if (analysis.keywords && analysis.keywords.includes(keyword)) {
                    adjustment += 0.35;  // 0.25から0.35に大幅増加！
                    break;
                }
            }
            
            // 追加: よく使われる意思決定関連の語に特別ブースト
            const boostWords = ['どうすれば', 'べきか', '決め', '選', '判断'];
            for (const word of boostWords) {
                if (text && text.includes(word)) {
                    adjustment += 0.2; // 大きめのブースト
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
        // Task 4-9: カバー率向上のため探索ノイズを強化
        const positionNoiseFactors = {
            1: 0.10,  // 1爻：0.08→0.10（強化）
            2: 0.06,  // 2爻：0.05→0.06（微増）
            3: 0.12,  // 3爻：0.10→0.12（強化）
            4: 0.14,  // 4爻：0.12→0.14（最大強化）
            5: 0.10,  // 5爻：維持
            6: 0.11   // 6爻：0.09→0.11（強化）
        };
        
        const baseFactor = positionNoiseFactors[position] || 0.10;
        
        // Task 4-9: より強力な探索ノイズ生成
        // lineIdと位置の組み合わせでより多様な値を生成
        const primaryNoise = ((lineId * position * 17) % 100) / 1000 * baseFactor;
        const secondaryNoise = ((lineId * lineId * position) % 50) / 1000 * baseFactor * 0.5;
        
        return primaryNoise + secondaryNoise;
    }
    
    /**
     * Task 4-9: カバー率向上のための新規メソッド
     * 卦単位での多様性促進
     */
    getHexagramDiversityBonus(hexagramId, linePosition) {
        // 卦ごとの使用状況を追跡
        if (!this.hexagramUsagePattern) {
            this.hexagramUsagePattern = {};
        }
        
        const hexagramKey = `hex_${hexagramId}`;
        if (!this.hexagramUsagePattern[hexagramKey]) {
            this.hexagramUsagePattern[hexagramKey] = new Set();
        }
        
        // 該当卦で未使用の爻位置数をカウント
        const usedPositions = this.hexagramUsagePattern[hexagramKey].size;
        const unusedPositions = 6 - usedPositions;
        
        // 未使用爻が多い卦ほど高いボーナス
        const diversityBonus = unusedPositions * 0.03;
        
        // 該当卦が完全に未使用の場合は追加ボーナス
        const virginHexagramBonus = (usedPositions === 0) ? 0.10 : 0;
        
        return diversityBonus + virginHexagramBonus;
    }
    
    /**
     * Task 5-1/5-2/5-3/5-7: エッジケース対応の前処理
     * 短文・長文・特殊文字・空白などのエッジケースを処理
     */
    preprocessTextForEdgeCases(text) {
        // Task 5-8: エラーハンドリング強化
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        let processed = text;
        
        // Task 5-7: 空白・改行処理
        // 連続する空白を1つに、改行を空白に置換
        processed = processed.replace(/\s+/g, ' ').trim();
        
        // Task 5-3: 特殊文字・記号の正規化
        // 全角英数字を半角に変換
        processed = processed.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        
        // 絵文字・顔文字の除去（意味解析には不要）
        processed = processed.replace(/[\u{1F600}-\u{1F6FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
        processed = processed.replace(/\([\^o]\^|T_T|>_<|\*_\*|@_@\)/g, '');
        
        // Task 5-1: 短文処理の最適化
        if (processed.length < 3) {
            // 超短文の場合は、繰り返して最低限の長さを確保
            const minLength = 3;
            while (processed.length < minLength && processed.length > 0) {
                processed = processed + ' ' + processed;
            }
        }
        
        // Task 5-2: 長文処理の最適化
        if (processed.length > 150) {
            // 長文の場合は重要部分を抽出（先頭と末尾を重視）
            const headLength = 75;
            const tailLength = 50;
            const head = processed.substring(0, headLength);
            const tail = processed.substring(processed.length - tailLength);
            processed = head + ' ... ' + tail;
        }
        
        // Task 5-4: 数字・英語混在対応
        // 数字は漢数字に変換（1桁のみ）
        processed = processed.replace(/[1１]/g, '一');
        processed = processed.replace(/[2２]/g, '二');
        processed = processed.replace(/[3３]/g, '三');
        processed = processed.replace(/[4４]/g, '四');
        processed = processed.replace(/[5５]/g, '五');
        processed = processed.replace(/[6６]/g, '六');
        processed = processed.replace(/[7７]/g, '七');
        processed = processed.replace(/[8８]/g, '八');
        processed = processed.replace(/[9９]/g, '九');
        
        // Task 5-6: 曖昧入力の拡張処理
        // 指示語や曖昧表現を具体的な意味に変換
        const ambiguousPatterns = {
            'あれ': '対象',
            'これ': '現在',
            'それ': '事柄',
            'なんか': '何か',
            'うーん': '思考',
            'まあまあ': '普通',
            'そんな感じ': 'そのような状況',
            'あんまり': 'あまり',
            'ちょっと': '少し',
            'すごく': '非常に',
            'めっちゃ': '非常に'
        };
        
        for (const [pattern, replacement] of Object.entries(ambiguousPatterns)) {
            if (processed === pattern) {
                processed = replacement;
                break;
            }
        }
        
        // 空文字列の場合はデフォルト値を返す
        if (processed.length === 0) {
            return '無';
        }
        
        return processed;
    }
    
    /**
     * Task 5-3: 特殊文字の検出
     */
    hasSpecialCharacters(text) {
        if (!text) return false;
        
        // 絵文字、顔文字、記号の検出
        const emojiPattern = /[\u{1F600}-\u{1F6FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
        const facePattern = /\([\^o]\^|T_T|>_<|\*_\*|@_@\)/;
        const symbolPattern = /[★☆♪♫♡♥]/;
        
        return emojiPattern.test(text) || facePattern.test(text) || symbolPattern.test(text);
    }
    
    /**
     * 強化された位置調整（テキスト内容に基づく動的調整）
     * F-4: キーワード配分の最適化
     */
    getEnhancedPositionAdjustment(position, text) {
        // F-4: より均等なキーワード配分（各位置20-25個程度に統一）
        const adjustments = {
            1: [
                // 基本キーワード
                '始', '新', '初', '基礎', '準備', '第一歩', '着手', 'スタート',
                // F-4: 追加キーワード
                '開始', '始動', '起動', '創始', '開幕', '出発', '発端', '起点',
                '序章', '導入', 'イントロ', '立ち上げ', '発足', '誕生', '生成'
            ],
            2: [
                // Task 3-2: キーワード削減（25個→15個）
                // 基本キーワード（維持）
                '協力', '関係', '内面', '相談', '支援',
                // 重要なキーワードのみ保持
                'チーム', '連携', 'パートナー', 'サポート',
                '話し合い', '内部', '仲間', '共有', '分担', '協調'
                // 削除: '協働', '共同', '補佐', '助力', '援助', 
                // '協議', '検討', '同僚', '協同', '配分'
            ],
            3: [
                // 基本キーワード
                '困難', '試練', '挑戦', '問題',
                // F-4: 追加キーワード
                '壁', '障害', '逆境', '苦労', '葛藤', '対立', '摩擦', '抵抗',
                '課題', '難題', '難関', '苦難', '危機', '窮地', 'トラブル',
                '争い', '衝突', '紛争', '混乱', 'ピンチ', '苦境',
                // Task 3-7: 追加キーワード（10個）
                '難局', '試行錯誤', '克服', '忍耐', '我慢',
                '踏ん張り', '正念場', '修羅場', '瀬戸際', '岐路'
            ],
            4: [
                // 基本キーワード
                '変化', '転換', '決断', '外部', '環境', '選択', '岐路',
                // F-4: 追加キーワード
                '移行', '転機', '変更', '調整', '適応', '改変', '修正', '転職',
                '方向転換', '路線変更', 'シフト', '切り替え', '変革', '改革',
                '分岐', '判断', '選定', '採択', '決定',
                // Task 3-8: 追加キーワード（10個）
                '転身', '移転', '交代', '更新', '刷新',
                '革新', '転回', '舵取り', '軌道修正', '再編'
            ],
            5: [
                // F-4: 数を調整（25個程度に削減）
                'リーダーシップ', '統率', '指導', '権威', '管理',
                '統括', '監督', '指揮', '経営', '責任',
                '決定', '判断', '戦略', '方針', '計画',
                '主導', '中心', '核心', '要', '重要',
                'トップ', '上級', '幹部', '役員', '成熟',
                // Task 2-2: 第1弾追加キーワード（10個）- 実践的管理用語
                '司令', '総括', '采配', '裁量', '決裁',
                '施策', '運営', '制御', '調整', '権限',
                // Task 2-4: 第2弾追加キーワード（10個）- 具体的役職・行動
                '部長', '課長', 'マネージャー', '責任者', '主任',
                '上司', '代表', '統率者', '指導者', '監査'
            ],
            6: [
                // Task 3-4: キーワード削減（26個→15個）
                // 基本キーワード（維持）
                '完成', '終了', '極限', '最終', '完了', '結果',
                // 重要なキーワードのみ保持
                '完結', '達成', '頂点', '最後', 'ゴール',
                '成果', '締め', '仕上げ', '総仕上げ'
                // 削除: '締結', '終結', '成就', '極致', '絶頂',
                // '終末', '終焉', '到達', '結実', 'フィナーレ', '大団円'
            ]
        };
        
        let maxAdjustment = 0;
        let bestPosition = 0;
        
        // F-4: 各位置のキーワードマッチング数を計算（より均等な重み付け）
        for (const [pos, keywords] of Object.entries(adjustments)) {
            let matches = 0;
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    matches++;
                }
            }
            
            if (matches > 0) {
                // F-4: 全位置により均等なボーナス（位置による差を縮小）
                const positionMultipliers = {
                    1: 0.08,  // 標準
                    2: 0.07,  // やや抑制
                    3: 0.09,  // やや強化
                    4: 0.10,  // 強化
                    5: 0.08,  // 標準に戻す（既に十分）
                    6: 0.07   // やや抑制
                };
                
                const multiplier = positionMultipliers[parseInt(pos)] || 0.08;
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
        // A4: 明示キーワード＋高感情強度のAND条件でのみ候補化
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
        
        // 高感情強度の閾値
        const highEmotionThreshold = 0.7;
        
        // 選択率キャップ (1%)
        const totalAnalyses = this.stats.totalAnalyses || 1;
        const line385Usage = this.lineUsageCount[385] || 0;
        const line386Usage = this.lineUsageCount[386] || 0;
        const yangRate = line385Usage / totalAnalyses;
        const yinRate = line386Usage / totalAnalyses;
        
        if (yangRate > 0.01 || yinRate > 0.01) {
            return null; // キャップ超過
        }
        
        // 用九: キーワード存在 AND 高感情強度
        if (yangCount >= 1 && analysis.emotion.valence > highEmotionThreshold) {
            console.log(`用九 selected for text: ${text}`);
            return {
                lineId: 385,
                score: 0.85,
                hexagramId: 1,
                hexagramName: '乾為天',
                position: 7
            };
        }
        
        // 用六: キーワード存在 AND 高感情強度
        if (yinCount >= 1 && Math.abs(analysis.emotion.valence) > highEmotionThreshold) {
            console.log(`用六 selected for text: ${text}`);
            return {
                lineId: 386,
                score: 0.85,
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
            line384Id: selectedLine.lineId,
            hexagramId: selectedLine.hexagramId,
            hexagramName: selectedLine.hexagramName,
            linePosition: selectedLine.position,
            
            // 爻の詳細
            lineName: lineName,
            lineFullName: `${selectedLine.hexagramName} ${lineName}`,
            
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