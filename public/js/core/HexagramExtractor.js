/**
 * HexagramExtractor - H384データベースから易卦情報を効率的に抽出するクラス
 * 
 * 機能:
 * 1. H384データベースから特定の卦の詳細情報を抽出
 * 2. 卦名から卦番号の検索
 * 3. 爻データの統計分析
 * 4. スコア解釈とレベル判定
 * 5. キーワードと特性の集約
 */
class HexagramExtractor {
    constructor() {
        this.h384Data = null;
        this.h64Data = null;
        this.hexagramMap = new Map();
        this.init();
    }

    /**
     * 初期化処理
     */
    init() {
        try {
            // H384データの取得
            if (typeof window !== 'undefined' && window.H384_DATA) {
                this.h384Data = window.H384_DATA;
                console.log('✅ HexagramExtractor: H384データを正常に読み込みました');
            } else {
                console.warn('⚠️ HexagramExtractor: H384データが見つかりません');
                return;
            }

            // H64データの取得
            if (typeof window !== 'undefined' && window.H64_DATA) {
                this.h64Data = window.H64_DATA;
                console.log('✅ HexagramExtractor: H64データを正常に読み込みました');
            }

            // 卦名マップの構築
            this.buildHexagramMap();
            
        } catch (error) {
            console.error('❌ HexagramExtractor初期化エラー:', error);
        }
    }

    /**
     * 卦名から卦番号への変換マップを構築
     */
    buildHexagramMap() {
        if (!this.h384Data) return;

        const hexagramNames = new Set();
        this.h384Data.forEach(item => {
            if (item['卦名'] && item['卦番号']) {
                this.hexagramMap.set(item['卦名'], item['卦番号']);
                hexagramNames.add(item['卦名']);
            }
        });

        console.log(`✅ HexagramExtractor: ${hexagramNames.size}個の卦名マップを構築しました`);
    }

    /**
     * 卦名から卦番号を取得
     * @param {string} hexagramName - 卦名（例："乾為天"）
     * @returns {number|null} 卦番号
     */
    getHexagramNumber(hexagramName) {
        return this.hexagramMap.get(hexagramName) || null;
    }

    /**
     * 特定の卦の全爻データを取得
     * @param {number} hexagramNumber - 卦番号
     * @returns {Array} 爻データの配列
     */
    getHexagramData(hexagramNumber) {
        if (!this.h384Data) return [];

        return this.h384Data.filter(item => item['卦番号'] === hexagramNumber);
    }

    /**
     * 卦名から全爻データを取得
     * @param {string} hexagramName - 卦名
     * @returns {Array} 爻データの配列
     */
    getHexagramDataByName(hexagramName) {
        const hexagramNumber = this.getHexagramNumber(hexagramName);
        if (!hexagramNumber) return [];
        
        return this.getHexagramData(hexagramNumber);
    }

    /**
     * 特定の卦の統計情報を計算
     * @param {string} hexagramName - 卦名
     * @returns {Object} 統計情報
     */
    getHexagramStats(hexagramName) {
        const data = this.getHexagramDataByName(hexagramName);
        if (data.length === 0) {
            return {
                averageScore: 0,
                maxScore: 0,
                minScore: 0,
                totalLines: 0,
                keywords: [],
                interpretations: []
            };
        }

        // スコア統計
        const scores = data.map(item => item['S1_基本スコア'] || 0);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        // キーワード集約
        const allKeywords = [];
        data.forEach(item => {
            if (item['キーワード'] && Array.isArray(item['キーワード'])) {
                allKeywords.push(...item['キーワード']);
            }
        });
        const uniqueKeywords = [...new Set(allKeywords)];

        // 現代解釈集約
        const interpretations = data.map(item => item['現代解釈の要約'] || '').filter(Boolean);

        return {
            averageScore: Math.round(averageScore),
            maxScore,
            minScore,
            totalLines: data.length,
            keywords: uniqueKeywords,
            interpretations,
            rawData: data
        };
    }

    /**
     * スコアレベルの判定
     * @param {number} score - スコア値
     * @returns {Object} レベル情報
     */
    getScoreLevel(score) {
        if (score >= 90) {
            return {
                level: '最高',
                color: '#10B981',
                description: '非常に良好な状態',
                icon: '🌟'
            };
        } else if (score >= 75) {
            return {
                level: '良好',
                color: '#3B82F6',
                description: '良い状態',
                icon: '✨'
            };
        } else if (score >= 60) {
            return {
                level: '普通',
                color: '#F59E0B',
                description: '標準的な状態',
                icon: '⭐'
            };
        } else if (score >= 40) {
            return {
                level: '注意',
                color: '#EF4444',
                description: '注意が必要',
                icon: '⚠️'
            };
        } else {
            return {
                level: '改善要',
                color: '#DC2626',
                description: '改善が必要',
                icon: '🔴'
            };
        }
    }

    /**
     * スコア解釈の生成
     * @param {number} score - スコア値
     * @param {string} osType - OS種別（Engine, Interface, SafeMode）
     * @returns {Object} 解釈情報
     */
    generateScoreInterpretation(score, osType) {
        const level = this.getScoreLevel(score);
        
        const interpretations = {
            Engine: {
                high: '内なる価値観が明確で、創造性と主体性が高い状態です。',
                medium: '価値観は安定していますが、さらなる自己理解が可能です。',
                low: '価値観の明確化や内的動機の見直しが必要かもしれません。'
            },
            Interface: {
                high: '社会との関わりが良好で、コミュニケーション能力が高い状態です。',
                medium: '対人関係は安定していますが、より深いつながりを築けます。',
                low: '社会的スキルの向上や関係性の見直しが有効です。'
            },
            SafeMode: {
                high: '心の安定性が高く、ストレス耐性も良好な状態です。',
                medium: '基本的な安定はありますが、さらなる強化が可能です。',
                low: 'ストレス管理や心の安定化に注意を向ける必要があります。'
            }
        };

        let category;
        if (score >= 70) category = 'high';
        else if (score >= 50) category = 'medium';
        else category = 'low';

        return {
            ...level,
            interpretation: interpretations[osType]?.[category] || '詳細な分析が必要です。',
            recommendations: this.generateRecommendations(score, osType)
        };
    }

    /**
     * 推奨アクションの生成
     * @param {number} score - スコア値
     * @param {string} osType - OS種別
     * @returns {Array} 推奨アクション
     */
    generateRecommendations(score, osType) {
        const recommendations = {
            Engine: {
                high: ['価値観の深化', '創造的プロジェクトへの挑戦', 'リーダーシップの発揮'],
                medium: ['自己理解の深化', '新しい体験への挑戦', '内省の時間確保'],
                low: ['価値観の整理', '自分らしさの探求', 'メンターとの対話']
            },
            Interface: {
                high: ['コミュニティ活動への参加', 'メンタリング', 'ネットワーク拡大'],
                medium: ['新しい人との出会い', 'コミュニケーションスキル向上', 'チームワーク強化'],
                low: ['基本的な対人スキル習得', '小さなグループ活動参加', '信頼関係の構築']
            },
            SafeMode: {
                high: ['チャレンジングな目標設定', 'ストレス管理法の共有', '安定基盤の活用'],
                medium: ['リラクゼーション技法習得', '生活リズム改善', 'サポート体制強化'],
                low: ['基本的なストレス管理', '専門家への相談', '生活環境の見直し']
            }
        };

        let category;
        if (score >= 70) category = 'high';
        else if (score >= 50) category = 'medium';
        else category = 'low';

        return recommendations[osType]?.[category] || ['詳細な分析を行いましょう'];
    }

    /**
     * 易卦シンボルの取得（フォールバック付き）
     * @param {string} hexagramName - 卦名
     * @returns {string} 易卦シンボル
     */
    getHexagramSymbol(hexagramName) {
        // 基本的なシンボルマップ
        const symbolMap = {
            '乾為天': '☰',
            '坤為地': '☷',
            '水雷屯': '☵☳',
            '山水蒙': '☶☵',
            '水天需': '☵☰',
            '天水訟': '☰☵',
            '地水師': '☷☵',
            '水地比': '☵☷',
            '風天小畜': '☴☰',
            '天沢履': '☰☱',
            '地天泰': '☷☰',
            '天地否': '☰☷',
            '天火同人': '☰☲',
            '火天大有': '☲☰',
            '地山謙': '☷☶',
            '雷地豫': '☳☷',
            '沢雷随': '☱☳',
            '山風蠱': '☶☴',
            '地沢臨': '☷☱',
            '風地観': '☴☷',
            '火雷噬嗑': '☲☳',
            '山火賁': '☶☲',
            '山地剥': '☶☷',
            '地雷復': '☷☳',
            '天雷无妄': '☰☳',
            '山天大畜': '☶☰',
            '山雷頤': '☶☳',
            '沢風大過': '☱☴',
            '坎為水': '☵',
            '離為火': '☲',
            '沢山咸': '☱☶',
            '雷風恒': '☳☴',
            '天山遯': '☰☶',
            '雷天大壮': '☳☰',
            '火地晋': '☲☷',
            '地火明夷': '☷☲',
            '風火家人': '☴☲',
            '火沢睽': '☲☱',
            '水山蹇': '☵☶',
            '雷水解': '☳☵',
            '山沢損': '☶☱',
            '風雷益': '☴☳',
            '沢天夬': '☱☰',
            '天風姤': '☰☴',
            '沢地萃': '☱☷',
            '地風升': '☷☴',
            '沢水困': '☱☵',
            '水風井': '☵☴',
            '沢火革': '☱☲',
            '火風鼎': '☲☴',
            '震為雷': '☳',
            '艮為山': '☶',
            '風山漸': '☴☶',
            '雷沢帰妹': '☳☱',
            '雷火豊': '☳☲',
            '火山旅': '☲☶',
            '巽為風': '☴',
            '兌為沢': '☱',
            '風水渙': '☴☵',
            '水沢節': '☵☱',
            '風沢中孚': '☴☱',
            '雷山小過': '☳☶',
            '水火既済': '☵☲',
            '火水未済': '☲☵'
        };

        return symbolMap[hexagramName] || '☯';
    }

    /**
     * データの有効性チェック
     * @returns {boolean} データが利用可能かどうか
     */
    isDataAvailable() {
        return this.h384Data && Array.isArray(this.h384Data) && this.h384Data.length > 0;
    }

    /**
     * デバッグ情報の取得
     * @returns {Object} デバッグ情報
     */
    getDebugInfo() {
        return {
            h384DataLength: this.h384Data ? this.h384Data.length : 0,
            h64DataLength: this.h64Data ? this.h64Data.length : 0,
            hexagramMapSize: this.hexagramMap.size,
            isDataAvailable: this.isDataAvailable()
        };
    }
}

// グローバルスコープに登録
if (typeof window !== 'undefined') {
    window.HexagramExtractor = HexagramExtractor;
    console.log('✅ HexagramExtractor: クラスがグローバルスコープに登録されました');
}

// Node.js環境での対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagramExtractor;
}