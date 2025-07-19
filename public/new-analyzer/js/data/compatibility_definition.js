/**
 * @typedef {Object} CompatibilityEntry
 * @property {number} synergy - シナジー（相乗効果）スコア (0.0 - 1.0)
 * @property {number} harmony - 調和スコア (0.0 - 1.0)
 * @property {number} tension - 緊張・対立スコア (0.0 - 1.0)
 * @property {number} conflict - 葛藤・矛盾スコア (0.0 - 1.0)
 * @property {number} chaos - 混沌・予測不能性スコア (0.0 - 1.0)
 * @property {CompatibilityType} type - 代表的な相性タイプ
 * @property {string} summary - この組み合わせの要約
 * @property {string} advice - この組み合わせを持つ人へのアドバイス
 */

/**
 * @enum {string}
 * @readonly
 */
export const CompatibilityType = {
    SYNERGY: 'SYNERGY',     // 非常に生産的な相乗効果
    HARMONY: 'HARMONY',     // 安定した調和
    TENSION: 'TENSION',     // 成長の可能性を秘めた緊張関係
    CONFLICT: 'CONFLICT',   // 明確な葛藤・対立
    CHAOS: 'CHAOS'          // 予測不能なカオス状態
};

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
    window.CompatibilityType = CompatibilityType;
}
