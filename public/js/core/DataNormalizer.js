/**
 * Data Normalizer - P0-2 DataDrivenKeywordAnalyzer対応
 * H384データベースの構造を正規化してキーワード解析器に適合させる
 */

class DataNormalizer {
    /**
     * H384データを正規化
     * @param {Array} rawData - 生のH384データ
     * @returns {Array} 正規化されたデータ
     */
    static normalizeH384Data(rawData) {
        if (!Array.isArray(rawData)) {
            console.error('[DataNormalizer] Invalid input: expected array, got', typeof rawData);
            return [];
        }

        console.log(`[DataNormalizer] Normalizing ${rawData.length} entries...`);
        
        const normalizedData = rawData.map((entry, index) => {
            try {
                return this.normalizeEntry(entry, index);
            } catch (error) {
                console.error(`[DataNormalizer] Entry ${index} normalization failed:`, error);
                return this.createFallbackEntry(entry, index);
            }
        });

        console.log(`[DataNormalizer] ✅ Normalized ${normalizedData.length} entries`);
        return normalizedData;
    }

    /**
     * 単一エントリの正規化
     * @param {Object} entry - エントリデータ
     * @param {number} index - エントリインデックス
     * @returns {Object} 正規化されたエントリ
     */
    static normalizeEntry(entry, index) {
        const normalized = { ...entry };

        // キーワード正規化: Array -> String
        if (entry['キーワード']) {
            if (Array.isArray(entry['キーワード'])) {
                normalized['キーワード'] = entry['キーワード']
                    .filter(kw => kw && typeof kw === 'string')
                    .join(',');
            } else if (typeof entry['キーワード'] === 'string') {
                normalized['キーワード'] = entry['キーワード'];
            } else {
                console.warn(`[DataNormalizer] Entry ${index}: Invalid キーワード type`, typeof entry['キーワード']);
                normalized['キーワード'] = '';
            }
        } else {
            normalized['キーワード'] = '';
        }

        // 必須フィールドの検証と補完
        this.validateAndFillRequired(normalized, index);

        return normalized;
    }

    /**
     * 必須フィールドの検証と補完
     * @param {Object} entry - エントリデータ
     * @param {number} index - エントリインデックス
     */
    static validateAndFillRequired(entry, index) {
        const requiredFields = {
            '卦番号': (i) => Math.floor(i / 6) + 1,
            '卦名': () => '名前未設定',
            '爻': (i) => ['初', '二', '三', '四', '五', '上'][i % 6],
            '現代解釈の要約': () => '解釈データが不足しています',
            'S1_基本スコア': () => 50,
            'S2_ポテンシャル': () => 50,
            'S3_安定性スコア': () => 50,
            'S4_リスク': () => 0,
            'S6_変動性スコア': () => 50,
            'S7_総合評価スコア': () => 50
        };

        Object.entries(requiredFields).forEach(([field, fallbackGenerator]) => {
            if (entry[field] === undefined || entry[field] === null) {
                entry[field] = fallbackGenerator(index);
                console.warn(`[DataNormalizer] Entry ${index}: Added fallback ${field} = ${entry[field]}`);
            }
        });
    }

    /**
     * フォールバックエントリの作成
     * @param {Object} originalEntry - 元のエントリ
     * @param {number} index - エントリインデックス
     * @returns {Object} フォールバックエントリ
     */
    static createFallbackEntry(originalEntry, index) {
        const hexNum = Math.floor(index / 6) + 1;
        const lineIndex = index % 6;
        const lineNames = ['初', '二', '三', '四', '五', '上'];

        return {
            '通し番号': index + 1,
            '卦番号': hexNum,
            '卦名': `第${hexNum}卦`,
            '爻': lineNames[lineIndex],
            'キーワード': '基本,標準,通常',
            '現代解釈の要約': 'データ復旧中のエントリです',
            'S1_基本スコア': 50,
            'S2_ポテンシャル': 50,
            'S3_安定性スコア': 50,
            'S4_リスク': 0,
            'S5_主体性推奨スタンス': '中庸',
            'S6_変動性スコア': 50,
            'S7_総合評価スコア': 50,
            _normalized: true,
            _fallback: true
        };
    }

    /**
     * データ品質チェック
     * @param {Array} data - チェック対象データ
     * @returns {Object} 品質レポート
     */
    static checkDataQuality(data) {
        const report = {
            totalEntries: data.length,
            validEntries: 0,
            emptyKeywords: 0,
            missingFields: [],
            duplicates: 0,
            errors: []
        };

        const seen = new Set();

        data.forEach((entry, index) => {
            try {
                // キーワード検証
                if (!entry['キーワード'] || entry['キーワード'].trim() === '') {
                    report.emptyKeywords++;
                }

                // 重複検証
                const key = `${entry['卦番号']}_${entry['爻']}`;
                if (seen.has(key)) {
                    report.duplicates++;
                } else {
                    seen.add(key);
                }

                report.validEntries++;

            } catch (error) {
                report.errors.push({
                    index,
                    error: error.message
                });
            }
        });

        report.qualityScore = Math.round(
            (report.validEntries / report.totalEntries) * 100
        );

        return report;
    }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataNormalizer;
}
if (typeof window !== 'undefined') {
    window.DataNormalizer = DataNormalizer;
}