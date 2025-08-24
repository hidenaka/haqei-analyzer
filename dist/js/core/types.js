/**
 * @file types.js - HAQEIデータ契約検証
 * @description 契約A(Triple OS)と契約B(Future Paths)のスキーマ検証
 * 単一の真実源(Single Source of Truth)として全ページ間のデータ連携を保証
 */

// グローバルスコープに登録（ESモジュール非対応環境用）
(function(global) {
    'use strict';

/**
 * 契約A: Triple OS検証
 * @param {Object} obj - OS Analyzer出力
 * @returns {Object} {valid: boolean, errors: string[]}
 */
function validateTripleOS(obj) {
    const errors = [];
    
    if (!obj || typeof obj !== 'object') {
        return {valid: false, errors: ['Invalid object']};
    }
    
    // 必須フィールド
    if (!obj.version) errors.push('Missing version');
    if (!obj.engine_os?.id || !obj.engine_os?.name) errors.push('Invalid engine_os');
    if (!obj.interface_os?.id || !obj.interface_os?.name) errors.push('Invalid interface_os');
    if (!obj.safe_mode_os?.id || !obj.safe_mode_os?.name) errors.push('Invalid safe_mode_os');
    if (!obj.created_at) errors.push('Missing created_at');
    
    // スコア範囲チェック
    ['engine_os', 'interface_os', 'safe_mode_os'].forEach(key => {
        const score = obj[key]?.score;
        if (typeof score !== 'number' || score < 0 || score > 1) {
            errors.push(`Invalid ${key}.score: must be 0-1`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 契約B: Future Paths検証
 * @param {Object} obj - Future Simulator出力
 * @returns {Object} {valid: boolean, errors: string[]}
 */
function validateFuturePaths(obj) {
    const errors = [];
    
    if (!obj || typeof obj !== 'object') {
        return {valid: false, errors: ['Invalid object']};
    }
    
    if (!Array.isArray(obj.paths)) {
        errors.push('paths must be array');
    } else {
        obj.paths.forEach((path, i) => {
            if (!path.id) errors.push(`Path[${i}] missing id`);
            if (!path.title) errors.push(`Path[${i}] missing title`);
            if (!path.analysis || path.analysis.length < 60) {
                errors.push(`Path[${i}] analysis must be >= 60 chars`);
            }
            if (!path.advice || path.advice.length < 50) {
                errors.push(`Path[${i}] advice must be >= 50 chars`);
            }
            if (!path.hexagram?.id || !path.hexagram?.name) {
                errors.push(`Path[${i}] invalid hexagram`);
            }
            
            // 数値範囲チェック
            ['risk', 'potential', 'recommendation'].forEach(key => {
                const val = path[key];
                if (typeof val !== 'number' || val < 0 || val > 1) {
                    errors.push(`Path[${i}].${key} must be 0-1`);
                }
            });
            
            if (!Array.isArray(path.milestones) || path.milestones.length < 3) {
                errors.push(`Path[${i}] must have >= 3 milestones`);
            }
        });
    }
    
    if (!obj.created_at) errors.push('Missing created_at');
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 検証結果のコンソール出力（開発用）
 */
function logValidation(contractType, data, result) {
    if (window.DEBUG_MODE || localStorage.getItem('haqei.debug') === 'true') {
        console.group(`Contract ${contractType} Validation`);
        console.log('Data:', data);
        console.log('Valid:', result.valid);
        if (!result.valid) {
            console.error('Errors:', result.errors);
        }
        console.groupEnd();
    }
}

// グローバルスコープにエクスポート
global.validateTripleOS = validateTripleOS;
global.validateFuturePaths = validateFuturePaths;
global.logValidation = logValidation;

})(window);