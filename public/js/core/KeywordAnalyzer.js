/**
 * KeywordAnalyzer - キーワード分析専門クラス
 * TripleOSInteractionAnalyzerから分離したリファクタリング版
 * 12軸キーワードシステムによる衝突検出
 */

'use strict';

    class KeywordAnalyzer {
        constructor() {
            this.version = '1.0';
            console.log('🔍 KeywordAnalyzer v1.0 initialized');
            
            // メモ化キャッシュ
            this._analysisCache = new Map();
            this._MAX_CACHE_SIZE = 150;
            
            // 12軸キーワードシステムの初期化
            this.initializeKeywordAxes();
        }
        
        /**
         * 12軸キーワードシステムの初期化
         */
        initializeKeywordAxes() {
            // 軸1: 感情極性（Emotional Polarity）
            this.EMOTIONPOSITIVE = ['喜び', '楽しみ', '楽観', '希望', '活気', '明朗', '愉快', '充実', '満足', '幸福'];
            this.EMOTIONNEGATIVE = ['困難', '暗黒', '動揺', '苦難', '憂慮', '不安', '恐れ', '悲しみ', '絶望', '危機'];
            
            // 軸2: 関係性（Relational Dynamics）
            this.RELATIONHARMONY = ['協調', '調和', '結合', '協力', '親密', '共感', '信頼', '尊重', '愛情', '友好'];
            this.RELATIONTENSION = ['分離', '孤立', '対立', '競争', '独立', '距離', '緊張', '摩擦', '葛藤', '反発'];
            
            // 軸3: 物質性（Material Existence）
            this.MATERIALSUCCESS = ['栄光', '成功', '豊満', '繁栄', '達成', '勝利', '完成', '獲得', '富裕', '栄達'];
            this.MATERIALCHALLENGE = ['貧困', '欠乏', '損失', '失敗', '不足', '困窮', '剥奪', '減少', '衰退', '枯渇'];
            
            // 軸4: 学習・成長（Learning & Growth）
            this.LEARNINGEXPANSION = ['発展', '啓発', '教育', '学習', '成長', '進化', '向上', '改善', '習得', '開花'];
            this.LEARNINGSTAGNATION = ['停滞', '退行', '固執', '停止', '後退', '萎縮', '劣化', '鈍化', '閉塞', '硬直'];
            
            // 軸5: 文化的価値（Cultural Values）
            this.CULTURALVIRTUE = ['誠実', '信義', '礼節', '謙虚', '寛容', '慈愛', '正義', '勇気', '節度', '清廉'];
            this.CULTURALVICE = ['邪悪', '不正', '傲慢', '貪欲', '残酷', '偽善', '背信', '堕落', '腐敗', '放縦'];
            
            // 軸6: 生命力（Vitality）
            this.VITALITYSTRONG = ['活力', '生命力', '情熱', '躍動', '活発', '精力', '元気', '健康', '強健', '旺盛'];
            this.VITALITYWEAK = ['衰弱', '疲労', '消耗', '病弱', '無気力', '倦怠', '虚弱', '枯渇', '脱力', '萎靡'];
            
            // 軸7: 変化・安定（Change vs Stability）
            this.CHANGEDYNAMIC = ['変化', '革新', '改革', '転換', '流動', '変動', '更新', '刷新', '変革', '転機'];
            this.CHANGESTABLE = ['安定', '維持', '保守', '継続', '定着', '不変', '恒常', '固定', '持続', '永続'];
            
            // 軸8: 行動性（Action Orientation）
            this.ACTIONACTIVE = ['積極性', '行動力', '実行力', '推進力', '決断力', '主導', '攻勢', '進取', '果敢', '勇猛'];
            this.ACTIONPASSIVE = ['受動性', '慎重さ', '待機', '観察', '熟考', '内省', '静観', '忍耐', '控えめ', '消極'];
            
            // 軸9: 体系性（Systemic Nature）
            this.SYSTEMICORDER = ['秩序', '組織', '構造', '体系', '規律', '整理', '統制', '管理', '計画', '調整'];
            this.SYSTEMICCHAOS = ['混沌', '無秩序', '混乱', '崩壊', '分解', '散乱', '錯乱', '紛糾', '乱雑', '破綻'];
            
            // 軸10: 空間性（Spatial Orientation）
            this.SPATIALEXPANSION = ['拡大', '開放', '広がり', '展開', '伸展', '膨張', '拡散', '放射', '延伸', '拡張'];
            this.SPATIALCONTRACTION = ['収縮', '閉塞', '縮小', '集約', '凝縮', '圧縮', '収斂', '密集', '集中', '内向'];
            
            // 軸11: 能力性（Capability）
            this.CAPABILITYSTRONG = ['強大', '威力', '優越', '卓越', '傑出', '超越', '無敵', '至高', '最強', '覇権'];
            this.CAPABILITYWEAK = ['弱小', '無力', '劣勢', '脆弱', '不能', '欠陥', '不足', '限界', '無能', '弱体'];
            
            // 軸12: 時間性（Temporal Aspect）
            this.TEMPORALBEGINNING = ['始まり', '創始', '起源', '発端', '開始', '誕生', '創造', '初動', '発生', '萌芽'];
            this.TEMPORALENDING = ['終わり', '完結', '終焉', '結末', '完了', '終息', '消滅', '終止', '帰結', '終局'];
        }
        
        /**
         * キーワード組み合わせの分析（メモ化付き）
         */
        analyzeKeywordCombination(char1, char2) {
            try {
                // メモ化キャッシュチェック
                const cacheKey = `kwc_${char1.name}_${char2.name}`;
                if (this._analysisCache.has(cacheKey)) {
                    return this._analysisCache.get(cacheKey);
                }
                
                const keywords1 = char1.keywords || [];
                const keywords2 = char2.keywords || [];
                
                // 12軸での衝突検出
                const result = {
                    emotionConflict: this.detectAxisConflict(keywords1, keywords2, this.EMOTIONPOSITIVE, this.EMOTIONNEGATIVE),
                    relationshipConflict: this.detectAxisConflict(keywords1, keywords2, this.RELATIONHARMONY, this.RELATIONTENSION),
                    materialConflict: this.detectAxisConflict(keywords1, keywords2, this.MATERIALSUCCESS, this.MATERIALCHALLENGE),
                    learningConflict: this.detectAxisConflict(keywords1, keywords2, this.LEARNINGEXPANSION, this.LEARNINGSTAGNATION),
                    culturalConflict: this.detectAxisConflict(keywords1, keywords2, this.CULTURALVIRTUE, this.CULTURALVICE),
                    vitalityConflict: this.detectAxisConflict(keywords1, keywords2, this.VITALITYSTRONG, this.VITALITYWEAK),
                    changeConflict: this.detectAxisConflict(keywords1, keywords2, this.CHANGEDYNAMIC, this.CHANGESTABLE),
                    actionConflict: this.detectAxisConflict(keywords1, keywords2, this.ACTIONACTIVE, this.ACTIONPASSIVE),
                    systemicConflict: this.detectAxisConflict(keywords1, keywords2, this.SYSTEMICORDER, this.SYSTEMICCHAOS),
                    spatialConflict: this.detectAxisConflict(keywords1, keywords2, this.SPATIALEXPANSION, this.SPATIALCONTRACTION),
                    capabilityConflict: this.detectAxisConflict(keywords1, keywords2, this.CAPABILITYSTRONG, this.CAPABILITYWEAK),
                    temporalConflict: this.detectAxisConflict(keywords1, keywords2, this.TEMPORALBEGINNING, this.TEMPORALENDING)
                };
                
                // キャッシュに保存
                if (this._analysisCache.size > this._MAX_CACHE_SIZE) {
                    const firstKey = this._analysisCache.keys().next().value;
                    this._analysisCache.delete(firstKey);
                }
                this._analysisCache.set(cacheKey, result);
                
                return result;
            } catch (error) {
                console.error('❌ Keyword combination analysis error:', error);
                return this.getDefaultConflictResult();
            }
        }
        
        /**
         * 軸での衝突検出
         */
        detectAxisConflict(keywords1, keywords2, positiveAxis, negativeAxis) {
            let hasPositive1 = false, hasNegative1 = false;
            let hasPositive2 = false, hasNegative2 = false;
            
            // keywords1の分類
            for (const kw of keywords1) {
                if (positiveAxis.some(p => kw.includes(p))) hasPositive1 = true;
                if (negativeAxis.some(n => kw.includes(n))) hasNegative1 = true;
            }
            
            // keywords2の分類
            for (const kw of keywords2) {
                if (positiveAxis.some(p => kw.includes(p))) hasPositive2 = true;
                if (negativeAxis.some(n => kw.includes(n))) hasNegative2 = true;
            }
            
            // 衝突判定: 一方がpositive、他方がnegativeの場合
            return (hasPositive1 && hasNegative2) || (hasNegative1 && hasPositive2);
        }
        
        /**
         * デフォルト衝突結果
         */
        getDefaultConflictResult() {
            return {
                emotionConflict: false,
                relationshipConflict: false,
                materialConflict: false,
                learningConflict: false,
                culturalConflict: false,
                vitalityConflict: false,
                changeConflict: false,
                actionConflict: false,
                systemicConflict: false,
                spatialConflict: false,
                capabilityConflict: false,
                temporalConflict: false
            };
        }
        
        /**
         * 衝突の総数カウント
         */
        countConflicts(conflictResult) {
            return Object.values(conflictResult).filter(v => v === true).length;
        }
        
        /**
         * 主要な衝突軸の特定
         */
        identifyMainConflicts(conflictResult) {
            const conflicts = [];
            const axisNames = {
                emotionConflict: '感情',
                relationshipConflict: '関係性',
                materialConflict: '物質',
                learningConflict: '学習',
                culturalConflict: '文化',
                vitalityConflict: '生命力',
                changeConflict: '変化',
                actionConflict: '行動',
                systemicConflict: '体系',
                spatialConflict: '空間',
                capabilityConflict: '能力',
                temporalConflict: '時間'
            };
            
            for (const [key, value] of Object.entries(conflictResult)) {
                if (value === true) {
                    conflicts.push(axisNames[key]);
                }
            }
            
            return conflicts;
        }
        
        /**
         * キャッシュクリア
         */
        clearCache() {
            try {
                this._analysisCache.clear();
                console.log('✅ Keyword analysis cache cleared');
            } catch (error) {
                console.error('❌ Error clearing analysis cache:', error);
            }
        }
        
        /**
         * キャッシュ統計
         */
        getCacheStatistics() {
            return {
                analysisCache: this._analysisCache.size,
                maxSize: this._MAX_CACHE_SIZE
            };
        }
    }
    
    // グローバル公開
    window.KeywordAnalyzer = KeywordAnalyzer;