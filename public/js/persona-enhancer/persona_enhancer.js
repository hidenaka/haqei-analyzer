/**
 * HAQEI Virtual Persona Enhancer - 保持すべきペルソナ生成システム
 * 高品質な動的ペルソナ生成ロジック
 */

// ==========================================
// 簡易通知システム（依存関係解決）
// ==========================================
if (!window.notifications) {
    window.notifications = {
        showError: function(message) {
            console.error('[NOTIFICATION ERROR]:', message);
            // 簡易的なアラート表示
            if (typeof alert !== 'undefined') {
                alert('エラー: ' + message);
            }
        },
        showWarning: function(message) {
            console.warn('[NOTIFICATION WARNING]:', message);
        },
        showInfo: function(message) {
            console.log('[NOTIFICATION INFO]:', message);
        },
        showSuccess: function(message) {
            console.log('[NOTIFICATION SUCCESS]:', message);
        }
    };
}

// ==========================================
// VirtualPersonaEnhancer クラス（完全版）
// ==========================================

class VirtualPersonaEnhancer {
    constructor(scores, hexagram) {
        this.scores = scores;
        this.hexagram = hexagram;
        this.topDimensions = this.getTopDimensions();
        this.bottomDimensions = this.getBottomDimensions();
    }
    
    getTopDimensions() {
        return Object.entries(this.scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([dim, score]) => ({ dimension: dim, score }));
    }
    
    getBottomDimensions() {
        return Object.entries(this.scores)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 2)
            .map(([dim, score]) => ({ dimension: dim, score }));
    }
    
    generateVirtualPersona() {
        const archetypes = this.generateArchetypes();
        const strengths = this.generateStrengths();
        const challenges = this.generateChallenges();
        const workStyle = this.generateWorkStyle();
        const relationships = this.generateRelationships();
        const growth = this.generateGrowthPath();
        
        return {
            archetypes,
            strengths,
            challenges,
            workStyle,
            relationships,
            growth,
            summary: this.generateSummary()
        };
    }
    
    generateArchetypes() {
        const archetypeMap = {
            'qian_creativity': ['革新者', 'ビジョナリー', '創造的リーダー'],
            'zhen_action': ['実行者', 'チェンジメーカー', '行動派リーダー'],
            'kan_exploration': ['探究者', '分析家', '戦略家'],
            'gen_stability': ['守護者', '管理者', '堅実な実行者'],
            'kun_receptiveness': ['サポーター', 'メンター', '共感的リーダー'],
            'xun_adaptability': ['調整役', 'ファシリテーター', '柔軟な問題解決者'],
            'li_expression': ['コミュニケーター', 'インスピレーター', '表現者'],
            'dui_harmony': ['調和者', 'チームビルダー', '関係構築者']
        };
        
        const primary = archetypeMap[this.topDimensions[0].dimension];
        const secondary = archetypeMap[this.topDimensions[1].dimension];
        
        return {
            primary: primary ? primary[0] : '多面的な才能の持ち主',
            secondary: secondary ? secondary[0] : 'バランス型の実践者',
            combined: this.combineArchetypes(primary, secondary)
        };
    }
    
    combineArchetypes(primary, secondary) {
        if (!primary || !secondary) return '独自の道を切り開く開拓者';
        
        const combinations = {
            '革新者_実行者': '革新的な実行リーダー',
            '革新者_探究者': '未来を創造する戦略家',
            '実行者_調和者': '人を動かす実践的リーダー',
            '探究者_守護者': '深い洞察を持つ安定的指導者',
            '守護者_サポーター': '信頼される支援型リーダー',
            'サポーター_調和者': '共感的なチームの要',
            'コミュニケーター_調和者': 'カリスマ的な関係構築者',
            '調整役_探究者': '柔軟な戦略的思考者'
        };
        
        const key = `${primary[0]}_${secondary[0]}`;
        return combinations[key] || `${primary[0]}と${secondary[0]}の資質を併せ持つ稀有な存在`;
    }
    
    generateStrengths() {
        const strengthTemplates = {
            'qian_creativity': [
                '新しいアイデアを次々と生み出す創造力',
                '既存の枠組みを超える革新的思考',
                '大胆なビジョンを描く構想力'
            ],
            'zhen_action': [
                '即座に行動に移す実行力',
                '困難に立ち向かう勇気と決断力',
                '変化を恐れない挑戦精神'
            ],
            'kan_exploration': [
                '本質を見抜く深い洞察力',
                '複雑な問題を分析する思考力',
                '未知の領域を探求する好奇心'
            ],
            'gen_stability': [
                '長期的な視点で物事を進める持続力',
                '着実に成果を積み上げる堅実性',
                '周囲に安心感を与える安定感'
            ],
            'kun_receptiveness': [
                '他者の意見を受け入れる包容力',
                'チームを支える献身的な姿勢',
                '相手の立場を理解する共感力'
            ],
            'xun_adaptability': [
                '状況に応じて柔軟に対応する適応力',
                '異なる価値観を調和させる調整力',
                '変化を機会に変える順応性'
            ],
            'li_expression': [
                '想いを効果的に伝える表現力',
                '人を惹きつけるプレゼンテーション能力',
                '感情豊かなコミュニケーション力'
            ],
            'dui_harmony': [
                'チームの和を保つ調和力',
                '対立を解消する仲裁能力',
                '人間関係を円滑にする社交性'
            ]
        };
        
        const strengths = [];
        this.topDimensions.forEach(dim => {
            const dimStrengths = strengthTemplates[dim.dimension];
            if (dimStrengths) {
                const index = Math.min(Math.floor(dim.score / 35), dimStrengths.length - 1);
                strengths.push(dimStrengths[index]);
            }
        });
        
        return strengths;
    }
    
    generateChallenges() {
        const challengeTemplates = {
            'qian_creativity': '既存のルールや慣習との摩擦',
            'zhen_action': '慎重な検討が必要な場面での性急さ',
            'kan_exploration': '実践よりも分析に時間をかけすぎる傾向',
            'gen_stability': '急速な変化への対応の遅れ',
            'kun_receptiveness': '自己主張が必要な場面での遠慮',
            'xun_adaptability': '一貫性を保つことの難しさ',
            'li_expression': '内省的な思考時間の不足',
            'dui_harmony': '対立を避けるあまり本音を言えない'
        };
        
        const challenges = [];
        this.bottomDimensions.forEach(dim => {
            const challenge = challengeTemplates[dim.dimension];
            if (challenge) {
                challenges.push(challenge);
            }
        });
        
        return challenges;
    }
    
    generateWorkStyle() {
        const topDim = this.topDimensions[0].dimension;
        const workStyles = {
            'qian_creativity': {
                ideal: '新規プロジェクトの立ち上げや革新的な取り組み',
                environment: '自由度が高く、創造性を発揮できる環境',
                team: 'アイデアを形にできる実行力のあるメンバー'
            },
            'zhen_action': {
                ideal: '迅速な意思決定と実行が求められる役割',
                environment: '成果が明確で、スピード感のある職場',
                team: '行動力を評価し、共に動けるメンバー'
            },
            'kan_exploration': {
                ideal: '戦略立案や問題解決が中心の業務',
                environment: '深く考察できる時間と空間がある環境',
                team: '知的な議論ができる専門性の高いメンバー'
            },
            'gen_stability': {
                ideal: '長期的なプロジェクト管理や品質管理',
                environment: '安定した組織で着実に成長できる環境',
                team: '信頼関係を重視する堅実なメンバー'
            },
            'kun_receptiveness': {
                ideal: 'チームサポートや人材育成の役割',
                environment: '協力的で支援的な文化のある職場',
                team: '多様性を尊重し、助け合えるメンバー'
            },
            'xun_adaptability': {
                ideal: '変化の多いプロジェクトや調整役',
                environment: '柔軟性が評価される動的な環境',
                team: '異なる背景を持つ多様なメンバー'
            },
            'li_expression': {
                ideal: '対外的なコミュニケーションや広報活動',
                environment: '表現力を活かせるクリエイティブな環境',
                team: 'アイデアを共有し合える開放的なメンバー'
            },
            'dui_harmony': {
                ideal: 'チームビルディングや関係構築の役割',
                environment: '人間関係を重視する温かい職場',
                team: '協調性を大切にする和やかなメンバー'
            }
        };
        
        return workStyles[topDim] || {
            ideal: 'バランスの取れた多様な業務',
            environment: '様々な経験ができる成長環境',
            team: '互いを尊重し合える協力的なメンバー'
        };
    }
    
    generateRelationships() {
        const topDim = this.topDimensions[0].dimension;
        const relationshipStyles = {
            'qian_creativity': '新しい可能性を共に探求できる関係',
            'zhen_action': '共に行動し、成長できる関係',
            'kan_exploration': '深い対話と理解を重ねる関係',
            'gen_stability': '長期的な信頼を築ける安定的な関係',
            'kun_receptiveness': '互いを支え合う温かい関係',
            'xun_adaptability': '変化を楽しみ、共に適応する関係',
            'li_expression': '感情を豊かに表現し合える関係',
            'dui_harmony': '調和と平和を大切にする関係'
        };
        
        return {
            style: relationshipStyles[topDim] || 'バランスの取れた健全な関係',
            compatibility: this.calculateCompatibility()
        };
    }
    
    calculateCompatibility() {
        const compatibilityMatrix = {
            'qian_creativity': ['zhen_action', 'li_expression', 'kan_exploration'],
            'zhen_action': ['qian_creativity', 'dui_harmony', 'li_expression'],
            'kan_exploration': ['gen_stability', 'qian_creativity', 'kun_receptiveness'],
            'gen_stability': ['kun_receptiveness', 'kan_exploration', 'dui_harmony'],
            'kun_receptiveness': ['gen_stability', 'dui_harmony', 'xun_adaptability'],
            'xun_adaptability': ['dui_harmony', 'kun_receptiveness', 'li_expression'],
            'li_expression': ['dui_harmony', 'qian_creativity', 'zhen_action'],
            'dui_harmony': ['li_expression', 'kun_receptiveness', 'xun_adaptability']
        };
        
        const topDim = this.topDimensions[0].dimension;
        return compatibilityMatrix[topDim] || ['balance', 'harmony', 'growth'];
    }
    
    generateGrowthPath() {
        const weakestDim = this.bottomDimensions[0].dimension;
        const growthAdvice = {
            'qian_creativity': '定期的にブレインストーミングやアイデア出しの時間を設ける',
            'zhen_action': '小さな行動から始めて、徐々に実行力を高める',
            'kan_exploration': '好奇心を持って新しい分野の学習に取り組む',
            'gen_stability': 'ルーティンを作り、継続的な取り組みを心がける',
            'kun_receptiveness': '他者の意見に耳を傾け、フィードバックを積極的に求める',
            'xun_adaptability': '異なる環境や状況に意識的に身を置く',
            'li_expression': '自分の考えや感情を言語化する練習をする',
            'dui_harmony': 'チーム活動に参加し、協調性を養う'
        };
        
        return {
            focus: growthAdvice[weakestDim] || '弱点を認識し、段階的な改善に取り組む',
            timeline: '3-6ヶ月の中期的な取り組み',
            method: '日々の小さな実践と定期的な振り返り'
        };
    }
    
    generateSummary() {
        const archetype = this.generateArchetypes();
        const hexagramName = this.hexagram?.name_jp || '未定義';
        const catchphrase = this.hexagram?.catchphrase || '独自の道を歩む者';
        
        return `あなたは「${archetype.primary}」の資質を持つ「${hexagramName}」タイプ。${catchphrase}として、独自の価値を世界に提供できる存在です。`;
    }
}

// ==========================================
// エクスポート
// ==========================================

// グローバル公開（ブラウザ環境）
window.VirtualPersonaEnhancer = VirtualPersonaEnhancer;