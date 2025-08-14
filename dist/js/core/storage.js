/**
 * @file storage.js - localStorage管理ユーティリティ
 * @description データ永続化と容量管理
 * 将来的にWorkers KVやIndexedDBへの移行を想定した抽象化層
 */

(function(global) {
    'use strict';

const STORAGE_PREFIX = 'haqei.';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * データ取得
 * @param {string} key - キー名（自動でプレフィックス付与）
 * @returns {any} パースされたデータ or null
 */
function get(key) {
    try {
        const fullKey = key.startsWith(STORAGE_PREFIX) ? key : STORAGE_PREFIX + key;
        const item = localStorage.getItem(fullKey);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Storage get error for ${key}:`, error);
        return null;
    }
}

/**
 * データ保存
 * @param {string} key - キー名
 * @param {any} value - 保存するデータ
 * @returns {boolean} 成功/失敗
 */
function set(key, value) {
    try {
        const fullKey = key.startsWith(STORAGE_PREFIX) ? key : STORAGE_PREFIX + key;
        const serialized = JSON.stringify(value);
        
        // 容量チェック
        if (serialized.length > MAX_STORAGE_SIZE) {
            throw new Error(`Data too large: ${serialized.length} bytes`);
        }
        
        localStorage.setItem(fullKey, serialized);
        return true;
    } catch (error) {
        console.error(`Storage set error for ${key}:`, error);
        
        // 容量エラーの場合は通知
        if (error.name === 'QuotaExceededError') {
            notifyStorageFull();
        }
        return false;
    }
}

/**
 * データ削除
 * @param {string} key - キー名
 */
function remove(key) {
    const fullKey = key.startsWith(STORAGE_PREFIX) ? key : STORAGE_PREFIX + key;
    localStorage.removeItem(fullKey);
}

/**
 * プレフィックスで一括削除
 * @param {string} prefix - プレフィックス
 */
function clearByPrefix(prefix) {
    const fullPrefix = STORAGE_PREFIX + prefix;
    const keys = Object.keys(localStorage).filter(k => k.startsWith(fullPrefix));
    keys.forEach(k => localStorage.removeItem(k));
}

/**
 * ストレージ使用量取得
 * @returns {Object} {used: number, percentage: number}
 */
function getUsage() {
    let total = 0;
    for (let key in localStorage) {
        if (key.startsWith(STORAGE_PREFIX)) {
            total += localStorage[key].length + key.length;
        }
    }
    return {
        used: total,
        percentage: (total / MAX_STORAGE_SIZE) * 100
    };
}

/**
 * 容量不足通知
 */
function notifyStorageFull() {
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    message.textContent = 'ストレージ容量が不足しています。古いデータを削除してください。';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 5000);
}

/**
 * デバッグ用：全データ取得
 */
function getAllData() {
    const data = {};
    for (let key in localStorage) {
        if (key.startsWith(STORAGE_PREFIX)) {
            try {
                data[key] = JSON.parse(localStorage[key]);
            } catch {
                data[key] = localStorage[key];
            }
        }
    }
    return data;
}

// グローバルスコープにエクスポート
global.storageGet = get;
global.storageSet = set;
global.storageRemove = remove;
global.storageClearByPrefix = clearByPrefix;
global.storageGetUsage = getUsage;
global.storageGetAllData = getAllData;

})(window);