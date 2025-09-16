/**
 * データ駆動型キーワード分析器
 * H384データベースのキーワードと現代解釈を直接活用
 * 占い的要素を排除し、データベースの関係性に基づく分析
 * EnhancedKeywordAnalyzerを継承し、データ駆動機能を追加
 */

(function(global){
class DataDrivenKeywordAnalyzer extends (global.EnhancedKeywordAnalyzer || EnhancedKeywordAnalyzer || class {}) {
    constructor(h384Data, options = {}) {
        super(); // 基底クラスの初期化
        console.log('🔍 DataDrivenKeywordAnalyzer initialized (extends EnhancedKeywordAnalyzer)');
        
        // v4.3.1 決定論的要件: SeedableRandom統合（フォールバック安全化）
        try {
            const rm = options.randomnessManager || (global && global.randomnessManager);
            this.rng = rm && typeof rm.next === 'function' ? rm : { next: Math.random };
        } catch { this.rng = { next: Math.random }; }
                   
        // P0-2: データ正規化とバリデーション
        this.rawH384Data = h384Data;
        this.h384Data = this.normalizeData(h384Data);
        this.keywordMap = new Map();
        this.hexagramRelations = new Map();
        
        console.log('🔍 DataDrivenKeywordAnalyzer 初期化');
        console.log(`  📊 生データ: ${this.rawH384Data?.length || 0}件`);
        console.log(`  🔧 正規化後: ${this.h384Data?.length || 0}件`);
        
        if (this.h384Data && this.h384Data.length > 0) {
            this.buildKeywordRelationMap();
        } else {
            console.error('❌ H384データが不正です');
            throw new Error('H384データが必要です');
        }
    }
    
    /**
     * P0-2: データ正規化メソッド
     * @param {Array} rawData - 生のH384データ
     * @returns {Array} 正規化されたデータ
     */
    normalizeData(rawData) {
        if (!rawData || !Array.isArray(rawData)) {
            console.error('❌ Invalid H384 data:', typeof rawData);
            return [];
        }
        
        console.log('[P0-2] DataDrivenKeywordAnalyzer データ正規化開始...');
        
        const normalized = rawData.map((entry, index) => {
            const normalizedEntry = { ...entry };
            
            // キーワード正規化: Array → String
            if (entry['キーワード']) {
                if (Array.isArray(entry['キーワード'])) {
                    normalizedEntry['キーワード'] = entry['キーワード']
                        .filter(kw => kw && typeof kw === 'string')
                        .join(',');
                } else if (typeof entry['キーワード'] !== 'string') {
                    console.warn(`[P0-2] Entry ${index}: Non-string キーワード converted:`, entry['キーワード']);
                    normalizedEntry['キーワード'] = String(entry['キーワード'] || '');
                }
            } else {
                normalizedEntry['キーワード'] = '';
            }
            
            // 必須フィールド検証
            if (!normalizedEntry['卦番号'] || !normalizedEntry['爻']) {
                console.warn(`[P0-2] Entry ${index}: Missing required fields`);
                normalizedEntry['卦番号'] = normalizedEntry['卦番号'] || Math.floor(index / 6) + 1;
                normalizedEntry['爻'] = normalizedEntry['爻'] || '初';
            }
            
            return normalizedEntry;
        });
        
        console.log('[P0-2] ✅ DataDrivenKeywordAnalyzer データ正規化完了:', normalized.length, '件');
        
        // データ品質チェック
        const emptyKeywords = normalized.filter(entry => !entry['キーワード']).length;
        if (emptyKeywords > 0) {
            console.warn(`[P0-2] ⚠️ 空のキーワード: ${emptyKeywords}件`);
        }
        
        return normalized;
    }

    /**
     * H384データベースからキーワード関係性マップを構築
     */
    buildKeywordRelationMap() {
        this.keywordMap = new Map();
        this.hexagramRelations = new Map();
        
        // 各エントリーのキーワードと解釈を保存
        this.h384Data.forEach((entry, index) => {
            const key = `${entry['卦番号']}_${entry['爻']}`;
            
            this.keywordMap.set(key, {
                keywords: entry['キーワード'] ? entry['キーワード'].split(',') : [],
                interpretation: entry['現代解釈の要約'] || '',
                scores: {
                    basic: parseInt(entry['S1_基本スコア']) || 50,
                    potential: parseInt(entry['S2_ポテンシャル']) || 50,
                    stability: parseInt(entry['S3_安定性スコア']) || 50,
                    risk: parseInt(entry['S4_リスク']) || 0,
                    volatility: parseInt(entry['S6_変動性スコア']) || 50,
                    total: parseInt(entry['S7_総合評価スコア']) || 50
                },
                hexNum: entry['卦番号'],
                hexName: entry['卦名'],
                line: entry['爻']
            });
        });

        // 同一卦内の爻間関係を構築（進爻パターン用）
        for (let hex = 1; hex <= 64; hex++) {
            const hexLines = [];
            for (let line = 1; line <= 6; line++) {
                const key = `${hex}_${this.getLineText(line)}`;
                if (this.keywordMap.has(key)) {
                    hexLines.push(this.keywordMap.get(key));
                }
            }
            this.hexagramRelations.set(hex, hexLines);
        }
    }

    /**
     * 爻の番号をテキストに変換
     */
    getLineText(lineNum) {
        const lineTexts = ['初九', '九二', '九三', '九四', '九五', '上九', 
                          '初六', '六二', '六三', '六四', '六五', '上六'];
        // 実際のデータベースの爻名に合わせて返す
        return lineTexts[lineNum - 1] || '初九';
    }

    /**
     * 進爻の関係性をデータベースから生成
     * 同一卦内での爻の進行に基づく
     */
    generateJinConnection(fromHex, fromLine, toHex, toLine) {
        const fromKey = `${fromHex}_${fromLine}`;
        const toKey = `${toHex}_${toLine}`;
        
        const fromData = this.keywordMap.get(fromKey);
        const toData = this.keywordMap.get(toKey);
        
        if (!fromData || !toData) {
            return '関係性データが見つかりません';
        }

        // スコアの変化から関係性を判断
        const scoreChange = toData.scores.total - fromData.scores.total;
        const stabilityChange = toData.scores.stability - fromData.scores.stability;
        const riskChange = toData.scores.risk - fromData.scores.risk;
        
        // キーワードからデータベースの実際の関係を抽出
        const fromKeywords = fromData.keywords.join('・');
        const toKeywords = toData.keywords.join('・');
        
        // スコアベースで関係性を説明（しきい値を調整）
        if (scoreChange > 10) {
            return `「${fromKeywords}」の状態から、総合評価が${Math.round(scoreChange)}ポイント向上し、「${toKeywords}」という発展的な段階へ進みます。${fromData.hexName}の中で、${fromData.interpretation.substring(0, 30)}から${toData.interpretation.substring(0, 30)}への自然な成長過程です。`;
        } else if (scoreChange < -10) {
            return `「${fromKeywords}」から「${toKeywords}」へ移行し、より慎重な対応が必要な段階となります。${fromData.hexName}において、${stabilityChange > 0 ? '安定性は増しますが' : 'リスクが高まり'}、${Math.abs(Math.round(riskChange))}ポイントの注意が必要です。`;
        } else {
            return `「${fromKeywords}」から「${toKeywords}」へと、${fromData.hexName}の中で段階的に進化します。安定性が${Math.round(stabilityChange)}ポイント、ポテンシャルが${Math.round(toData.scores.potential - fromData.scores.potential)}ポイント変化し、${toData.interpretation.substring(0, 50)}という状況への移行です。`;
        }
    }

    /**
     * 変爻の転換をデータベースから生成
     * 異なる卦への変化に基づく
     */
    generateHengShift(fromHex, fromLine, toHex, toLine) {
        const fromKey = `${fromHex}_${fromLine}`;
        const toKey = `${toHex}_${toLine}`;
        
        const fromData = this.keywordMap.get(fromKey);
        const toData = this.keywordMap.get(toKey);
        
        if (!fromData || !toData) {
            return '転換データが見つかりません';
        }

        // 卦の変化による質的な転換を表現
        const fromKeywords = fromData.keywords.join('・');
        const toKeywords = toData.keywords.join('・');
        
        // 異なる卦への移行は質的な変化
        const volatilityChange = toData.scores.volatility - fromData.scores.volatility;
        const potentialChange = toData.scores.potential - fromData.scores.potential;
        
        if (volatilityChange > 10) {
            return `${fromData.hexName}の「${fromKeywords}」から、${toData.hexName}の「${toKeywords}」へと卦が変化し、変動性が${Math.round(volatilityChange)}ポイント増加します。${toData.interpretation.substring(0, 50)}という新たな局面への転換です。`;
        } else if (potentialChange > 10) {
            return `「${fromKeywords}」という${fromData.hexName}の状態から離れ、${toData.hexName}の「${toKeywords}」へ方向転換します。ポテンシャルが${Math.round(potentialChange)}ポイント向上し、${toData.interpretation.substring(0, 40)}という可能性が開けます。`;
        } else {
            return `${fromData.hexName}から${toData.hexName}への転換により、「${fromKeywords}」から「${toKeywords}」へと状況が質的に変化します。総合評価が${Math.round(toData.scores.total - fromData.scores.total)}ポイント変化し、${toData.interpretation.substring(0, 30)}への転機となります。`;
        }
    }

    /**
     * キーワード間の意味的距離をスコアから計算
     */
    calculateSemanticDistance(fromHex, fromLine, toHex, toLine) {
        const fromKey = `${fromHex}_${fromLine}`;
        const toKey = `${toHex}_${toLine}`;
        
        const fromData = this.keywordMap.get(fromKey);
        const toData = this.keywordMap.get(toKey);
        
        if (!fromData || !toData) return 100; // 最大距離
        
        // 各スコアの差分を計算
        const basicDiff = Math.abs(fromData.scores.basic - toData.scores.basic);
        const potentialDiff = Math.abs(fromData.scores.potential - toData.scores.potential);
        const stabilityDiff = Math.abs(fromData.scores.stability - toData.scores.stability);
        const riskDiff = Math.abs(fromData.scores.risk - toData.scores.risk);
        
        // 重み付き平均で距離を計算
        const distance = (basicDiff * 0.3 + potentialDiff * 0.2 + 
                         stabilityDiff * 0.2 + riskDiff * 0.3) / 100;
        
        return distance;
    }

    /**
     * 最適な次の爻を推薦（データベースのスコアに基づく）
     */
    recommendNextStep(currentHex, currentLine, objective = 'stability') {
        const recommendations = [];
        
        // 進爻オプション（同一卦内）
        const nextLine = this.getNextLine(currentLine);
        if (nextLine) {
            const jinKey = `${currentHex}_${nextLine}`;
            const jinData = this.keywordMap.get(jinKey);
            if (jinData) {
                recommendations.push({
                    type: 'jin',
                    hex: currentHex,
                    line: nextLine,
                    score: this.evaluateObjective(jinData, objective),
                    data: jinData
                });
            }
        }
        
        // 変爻オプション（サンプリング）
        for (let i = 0; i < 5; i++) {
            const newHex = Math.floor(this.rng.next() * 64) + 1;
            const hengKey = `${newHex}_${currentLine}`;
            const hengData = this.keywordMap.get(hengKey);
            if (hengData) {
                recommendations.push({
                    type: 'heng',
                    hex: newHex,
                    line: currentLine,
                    score: this.evaluateObjective(hengData, objective),
                    data: hengData
                });
            }
        }
        
        // スコアでソート
        recommendations.sort((a, b) => b.score - a.score);
        return recommendations;
    }

    /**
     * 目的に応じたスコア評価
     */
    evaluateObjective(data, objective) {
        switch(objective) {
            case 'stability':
                return data.scores.stability - Math.abs(data.scores.risk);
            case 'growth':
                return data.scores.potential + data.scores.basic;
            case 'safety':
                return 100 + data.scores.risk; // リスクが低いほど高スコア
            case 'change':
                return data.scores.volatility + data.scores.potential;
            default:
                return data.scores.total;
        }
    }

    /**
     * 次の爻を取得
     */
    getNextLine(currentLine) {
        const lineOrder = ['初九', '九二', '九三', '九四', '九五', '上九',
                          '初六', '六二', '六三', '六四', '六五', '上六'];
        const currentIndex = lineOrder.indexOf(currentLine);
        
        // 簡易的に次の爻を返す（実際は陰陽の判断が必要）
        if (currentLine.includes('初')) return currentLine.includes('九') ? '九二' : '六二';
        if (currentLine.includes('二')) return currentLine.includes('九') ? '九三' : '六三';
        if (currentLine.includes('三')) return currentLine.includes('九') ? '九四' : '六四';
        if (currentLine.includes('四')) return currentLine.includes('九') ? '九五' : '六五';
        if (currentLine.includes('五')) return currentLine.includes('九') ? '上九' : '上六';
        return null; // 上爻の次はない
    }

    /**
     * パス全体の評価（データベースのスコアに基づく）
     */
    evaluatePath(path) {
        let totalScore = 0;
        let riskAccumulation = 0;
        let stabilityAverage = 0;
        
        path.forEach((step, index) => {
            const key = `${step.hex}_${step.line}`;
            const data = this.keywordMap.get(key);
            
            if (data) {
                totalScore += data.scores.total * (1 - index * 0.1); // 後の段階ほど重み減少
                riskAccumulation += data.scores.risk;
                stabilityAverage += data.scores.stability;
            }
        });
        
        return {
            totalScore: totalScore / path.length,
            totalRisk: riskAccumulation,
            averageStability: stabilityAverage / path.length,
            recommendation: this.generatePathRecommendation(totalScore / path.length, riskAccumulation)
        };
    }

    /**
     * パスの推奨度を生成
     */
    generatePathRecommendation(avgScore, totalRisk) {
        if (avgScore > 70 && totalRisk > -100) {
            return '非常に良好な展開が期待できます';
        } else if (avgScore > 50 && totalRisk > -150) {
            return 'バランスの取れた現実的な選択です';
        } else if (totalRisk < -200) {
            return 'リスクが高いため慎重な判断が必要です';
        } else {
            return '状況に応じた柔軟な対応が求められます';
        }
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataDrivenKeywordAnalyzer;
} else {
    global.DataDrivenKeywordAnalyzer = DataDrivenKeywordAnalyzer;
}

})(typeof window !== 'undefined' ? window : this);
