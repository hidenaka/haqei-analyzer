// 実装要件: MorphologicalAnalyzer (Kuromoji統合)
class MorphologicalAnalyzer {
    constructor() {
        this.tokenizer = null;
        this.isInitialized = false;
        this.mode = 'basic'; // デフォルト
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            this.tokenizer = await kuromoji.builder({ dicPath: '/js/lib/kuromoji/dict' }).build();
            this.mode = 'kuromoji';
            this.isInitialized = true;
            console.log('📚 Kuromoji初期化完了');
        } catch (error) {
            console.warn('⚠️ Kuromoji初期化失敗、フォールバックモードへ:', error);
            // フォールバック可視化
            if (window.hudManager) window.hudManager.showFallbackMode(true);
            this.mode = 'fallback';
            await this.fallbackInitialize();
        }
    }
    
    async fallbackInitialize() {
        // OfflineKuromojiInitializerを使用（仮定: グローバルまたはインポート）
        try {
            this.tokenizer = await OfflineKuromojiInitializer.init();
            this.isInitialized = true;
            console.log('📘 フォールバック初期化完了');
        } catch (fallbackError) {
            console.error('❌ フォールバック失敗:', fallbackError);
            this.mode = 'basic';
            // 基本モード: シンプルな分割
            this.tokenizer = { tokenize: text => text.split(/\s+/).map(word => ({surface_form: word, pos: '未知'})) };
        }
    }

    async analyze(text) {
        await this.initialize();
        
        if (this.mode === 'basic') {
            const tokens = this.tokenizer.tokenize(text);
            return {
                tokens: tokens.map(t => ({surface: t.surface_form, pos: t.pos})),
                stats: { totalTokens: tokens.length, nouns: 0, verbs: 0 }
            };
        }
        
        const tokens = this.tokenizer.tokenize(text);
        const analysis = tokens.map(token => ({
            surface: token.surface_form,
            pos: token.pos,
            posDetail: token.pos_detail_1,
            baseForm: token.basic_form,
            reading: token.reading
        }));
        
        return {
            tokens: analysis,
            stats: {
                totalTokens: tokens.length,
                nouns: tokens.filter(t => t.pos === '名詞').length,
                verbs: tokens.filter(t => t.pos === '動詞').length
            }
        };
    }
    
    async extractKeywords(text, minLength = 2) {
        const result = await this.analyze(text);
        return result.tokens
            .filter(t => t.pos === '名詞' && t.surface.length >= minLength)
            .map(t => t.surface);
    }
    
    detectNegation(tokens) {
        // 否定表現の検出（'ない'、'ません'、'ぬ'等）
        const negationPatterns = ['ない', 'ません', 'ぬ', 'ず'];
        return tokens.some((token, index) => {
            if (negationPatterns.includes(token.surface)) {
                // 前の語が動詞または形容詞の場合に否定と判定
                if (index > 0) {
                    const prevToken = tokens[index - 1];
                    return prevToken.pos === '動詞' || prevToken.pos === '形容詞';
                }
                return true;
            }
            return false;
        });
    }
    
    getMode() {
        return this.mode;
    }
}

// グローバルインスタンス
window.morphAnalyzer = new MorphologicalAnalyzer();

// 初期化とテスト
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.morphAnalyzer.initialize();
        const test = await window.morphAnalyzer.analyze('これはテスト文です。');
        console.log('形態素解析テスト:', test);
    } catch (error) {
        console.error('初期化エラー');
    }
});