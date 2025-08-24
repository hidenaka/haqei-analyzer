/**
 * 拡張キーワード分析器
 * H384の全キーワードに対応した高精度分類システム
 */

class EnhancedKeywordAnalyzer {
    constructor() {
        // 拡張カテゴリ辞書（頻出上位100キーワード対応）
        this.categoryDictionary = {
            preparation: [
                '準備', '基礎固め', '学習', 'ポテンシャル', '始まり', 
                '待機', '予兆', '初霜', '始まりの注意', '教育',
                '学び', '素直さ', '蓄積', '潜在力', '萌芽'
            ],
            cooperation: [
                '協力', '協力者', '出会い', '信頼', '公の場', 
                'パートナー', '信頼関係', '包容力', '親密', '結束',
                '団結', 'パートナーシップ', '交流', '共感', '協調',
                '相互理解', '支援', '仲間', '連携', '協働'
            ],
            growth: [
                'チャンス到来', '成長', '発展', 'チャンス', '成果',
                '吉', '繁栄', '成功', '達成', '飛躍',
                '向上', '進歩', '開花', '実現', '結実'
            ],
            leadership: [
                'リーダー', 'リーダーシップ', '公明正大', '中核', '勝利',
                '統率', '指導', '責任', '決断', '主導',
                '威厳', '権威', '統治', '采配', '求心力'
            ],
            difficulty: [
                '困難', 'リスクあり', '危機', '停滞', '危険',
                '凶', '絶望', '行き詰まり', '破滅', '泥沼',
                '危機管理', '破綻', '失敗', '機能不全', '混乱',
                '不満', '不安定', '障害', '苦境', '窮地'
            ],
            stability: [
                '安定', '問題なし', '安全第一', '休息', '堅実',
                '持続', '平穏', '秩序', '維持', '保全',
                '継続', '均衡', '調和', '平和', '安泰'
            ],
            reflection: [
                '内省', '慎重', '忍耐', '待機', '口を閉ざす',
                '内面の美徳', '反省', '熟慮', '自制', '沈黙',
                '瞑想', '観察', '洞察', '自己探求', '省察'
            ],
            transformation: [
                '改革', '革新', '転換点', '方針転換', '撤退',
                '再編', '変革', '刷新', '再生', '転機',
                '変化', '移行', '改変', '革命', '更新'
            ],
            decision: [
                '決断', '判断', '選択', '決定', '意思決定',
                '判断ミス', '賢明な判断', '冷静な対応', '見極め', '評価'
            ],
            integrity: [
                '誠実', '公正', '公平性', '正義', '真心',
                '誠意', '信義', '廉潔', '高潔', '清廉'
            ],
            caution: [
                '油断', '慢心', '傲慢', '軽率', '無謀',
                '虚飾', '誘惑', '不誠実', '優柔不断', '危険回避'
            ],
            completion: [
                '完成', '完了', '成就', '達成', '終結',
                '完結', '完遂', '完全', '完備', '円満'
            ],
            recovery: [
                '危機脱出', '信頼回復', '原点回帰', '再生', '回復',
                '復活', '復興', '立ち直り', '更生', '復帰'
            ],
            strategy: [
                '守り', '損失回避', '危機克服', '問題解決', '対策',
                '戦略', '戦術', '方策', '手段', '計画'
            ],
            balance: [
                '中庸', '柔軟性', '調整', 'バランス', '均衡',
                '適度', '節度', '程良い', '適正', '適切'
            ]
        };

        // カテゴリの意味的関連性マップ
        this.categoryRelations = {
            preparation: ['cooperation', 'growth'],
            cooperation: ['stability', 'leadership', 'growth'],
            growth: ['leadership', 'completion', 'stability'],
            leadership: ['decision', 'strategy', 'integrity'],
            difficulty: ['reflection', 'recovery', 'transformation'],
            stability: ['growth', 'completion', 'balance'],
            reflection: ['transformation', 'recovery', 'integrity'],
            transformation: ['growth', 'recovery', 'decision'],
            decision: ['strategy', 'leadership', 'caution'],
            integrity: ['leadership', 'cooperation', 'stability'],
            caution: ['difficulty', 'reflection', 'strategy'],
            completion: ['growth', 'stability', 'recovery'],
            recovery: ['transformation', 'growth', 'stability'],
            strategy: ['decision', 'leadership', 'caution'],
            balance: ['stability', 'integrity', 'reflection']
        };
    }

    /**
     * キーワードのカテゴリを分析（拡張版）
     */
    analyzeKeyword(keyword) {
        // 完全一致検索
        for (const [category, keywords] of Object.entries(this.categoryDictionary)) {
            if (keywords.includes(keyword)) {
                return category;
            }
        }

        // 部分文字列マッチング
        for (const [category, keywords] of Object.entries(this.categoryDictionary)) {
            for (const dictWord of keywords) {
                if (keyword.includes(dictWord) || dictWord.includes(keyword)) {
                    return category;
                }
            }
        }

        // セマンティック分析（意味的類似性）
        return this.analyzeSemantics(keyword);
    }

    /**
     * 意味的分析によるカテゴリ推定
     */
    analyzeSemantics(keyword) {
        // ポジティブ/ネガティブ判定
        const positivePatterns = ['吉', '成', '良', '善', '正', '安', '信', '協'];
        const negativePatterns = ['凶', '危', '困', '破', '失', '悪', '不', '無'];
        
        for (const pattern of positivePatterns) {
            if (keyword.includes(pattern)) {
                if (keyword.includes('成')) return 'growth';
                if (keyword.includes('安')) return 'stability';
                if (keyword.includes('信') || keyword.includes('協')) return 'cooperation';
                return 'growth'; // デフォルトポジティブ
            }
        }

        for (const pattern of negativePatterns) {
            if (keyword.includes(pattern)) {
                if (keyword.includes('危') || keyword.includes('困')) return 'difficulty';
                if (keyword.includes('不') || keyword.includes('無')) return 'caution';
                return 'difficulty'; // デフォルトネガティブ
            }
        }

        // 行動/状態判定
        const actionPatterns = ['動', '進', '変', '転', '改'];
        const statePatterns = ['静', '定', '保', '維', '続'];
        
        for (const pattern of actionPatterns) {
            if (keyword.includes(pattern)) return 'transformation';
        }
        
        for (const pattern of statePatterns) {
            if (keyword.includes(pattern)) return 'stability';
        }

        return 'other';
    }

    /**
     * 進爻パターンの関連性生成（拡張版）
     */
    getThematicConnection(fromCategory, toCategory, fromKeyword, toKeyword) {
        // カテゴリが同じまたは関連している場合
        if (fromCategory === toCategory) {
            return `「${fromKeyword}」の状態が深まり、より成熟した「${toKeyword}」へと自然に発展していきます。`;
        }

        // 関連カテゴリの場合
        if (this.categoryRelations[fromCategory]?.includes(toCategory)) {
            const transitions = {
                'preparation_cooperation': '個人の準備から他者との協働へ',
                'preparation_growth': '基礎固めから成長段階へ',
                'cooperation_stability': '協力関係から安定した体制へ',
                'cooperation_leadership': '協働からリーダーシップ発揮へ',
                'growth_leadership': '成長から主導的立場へ',
                'growth_completion': '成長から完成段階へ',
                'difficulty_reflection': '困難から内省と学びへ',
                'reflection_transformation': '内省から変革への決意へ',
                'transformation_recovery': '変革から再生と回復へ'
            };
            
            const key = `${fromCategory}_${toCategory}`;
            const transition = transitions[key] || `${fromKeyword}から${toKeyword}への自然な流れ`;
            
            return `「${fromKeyword}」という${this.getCategoryLabel(fromCategory)}の段階から、${transition}という関連性のある発展が起こります。`;
        }

        // 関連がない場合でも意味のある説明を生成
        return `「${fromKeyword}」の経験を踏まえ、新たな視点で「${toKeyword}」という${this.getCategoryLabel(toCategory)}の段階へ進化します。`;
    }

    /**
     * 変爻パターンの転換説明生成（拡張版）
     */
    getThematicShift(fromCategory, toCategory, fromKeyword, toKeyword) {
        if (fromCategory === toCategory) {
            return `同じ${this.getCategoryLabel(fromCategory)}の中でも、「${fromKeyword}」から「${toKeyword}」へと質的な変化が起こります。`;
        }

        const opposites = {
            'preparation': 'completion',
            'cooperation': 'difficulty',
            'growth': 'difficulty',
            'stability': 'transformation',
            'reflection': 'leadership',
            'caution': 'decision',
            'difficulty': 'recovery'
        };

        if (opposites[fromCategory] === toCategory) {
            return `「${fromKeyword}」という${this.getCategoryLabel(fromCategory)}から、対極的な「${toKeyword}」という${this.getCategoryLabel(toCategory)}への大転換が起こります。`;
        }

        return `「${fromKeyword}」という${this.getCategoryLabel(fromCategory)}のテーマから離れ、全く異なる「${toKeyword}」という${this.getCategoryLabel(toCategory)}への方向転換が起こります。`;
    }

    /**
     * カテゴリのラベル取得
     */
    getCategoryLabel(category) {
        const labels = {
            preparation: '準備と基礎',
            cooperation: '協力と信頼',
            growth: '成長と発展',
            leadership: 'リーダーシップ',
            difficulty: '困難と挑戦',
            stability: '安定と持続',
            reflection: '内省と熟慮',
            transformation: '変革と転換',
            decision: '決断と判断',
            integrity: '誠実と正義',
            caution: '警戒と注意',
            completion: '完成と達成',
            recovery: '回復と再生',
            strategy: '戦略と対策',
            balance: 'バランスと調和',
            other: '独自の展開'
        };
        return labels[category] || category;
    }

    /**
     * 精度統計の取得
     */
    getAccuracyStats(h384Data) {
        let total = 0;
        let classified = 0;
        const categoryCount = {};

        h384Data.forEach(entry => {
            if (entry['キーワード']) {
                entry['キーワード'].forEach(keyword => {
                    total++;
                    const category = this.analyzeKeyword(keyword);
                    if (category !== 'other') {
                        classified++;
                    }
                    categoryCount[category] = (categoryCount[category] || 0) + 1;
                });
            }
        });

        return {
            total,
            classified,
            classificationRate: (classified / total * 100).toFixed(2),
            categoryCount
        };
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedKeywordAnalyzer;
}