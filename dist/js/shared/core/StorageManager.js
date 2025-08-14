// StorageManager.js - ストレージ管理システム
// HAQEI HaQei哲学：データの永続化と取得の調和

/**
 * ストレージ管理クラス
 */
class StorageManager {
  constructor() {
    this.prefix = 'haqei_';
    this.version = '1.0.0';
    this.storageAvailable = this.checkStorageAvailability();
  }

  /**
   * ストレージ利用可能性チェック
   * @returns {boolean} 利用可能かどうか
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('🔍 Storage not available:', error);
      return false;
    }
  }

  /**
   * データ保存
   * @param {string} key - キー
   * @param {any} data - 保存データ
   * @returns {boolean} 保存成功かどうか
   */
  save(key, data) {
    if (!this.storageAvailable) return false;

    try {
      const storageKey = this.prefix + key;
      const storageData = {
        data: data,
        timestamp: new Date().toISOString(),
        version: this.version
      };
      
      localStorage.setItem(storageKey, JSON.stringify(storageData));
      console.log(`🔍 Data saved: ${key}`);
      return true;
    } catch (error) {
      console.error('🔍 Storage save error:', error);
      return false;
    }
  }

  /**
   * データ取得
   * @param {string} key - キー
   * @returns {any} 取得データまたはnull
   */
  load(key) {
    if (!this.storageAvailable) return null;

    try {
      const storageKey = this.prefix + key;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      console.log(`🔍 Data loaded: ${key}`);
      return parsed.data;
    } catch (error) {
      console.error('🔍 Storage load error:', error);
      return null;
    }
  }

  /**
   * データ削除
   * @param {string} key - キー
   * @returns {boolean} 削除成功かどうか
   */
  remove(key) {
    if (!this.storageAvailable) return false;

    try {
      const storageKey = this.prefix + key;
      localStorage.removeItem(storageKey);
      console.log(`🔍 Data removed: ${key}`);
      return true;
    } catch (error) {
      console.error('🔍 Storage remove error:', error);
      return false;
    }
  }

  /**
   * 全データクリア
   * @returns {boolean} クリア成功かどうか
   */
  clear() {
    if (!this.storageAvailable) return false;

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log('🔍 All HAQEI data cleared');
      return true;
    } catch (error) {
      console.error('🔍 Storage clear error:', error);
      return false;
    }
  }
}

// グローバル公開
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}