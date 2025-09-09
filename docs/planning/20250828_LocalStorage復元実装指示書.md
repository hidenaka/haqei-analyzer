# LocalStorage復元実装指示書

**文書番号**: HAQEI-ROLLBACK-001  
**作成日**: 2025年8月28日  
**優先度**: 🔴 最優先（即座実行）  
**作業時間**: 約30分  
**影響範囲**: 384DataService.js のみ

---

## 📋 作業概要

Cloudflare KV対応のために修正された `384DataService.js` をLocalStorage使用版に戻します。
この修正により、os_analyzer.html → results.html のデータ連携が正常に動作するようになります。

---

## 🎯 修正対象ファイル

### 対象ファイル（1ファイルのみ）
```
/public/js/services/384DataService.js
```

---

## 📝 具体的な修正内容

### Step 1: 初期化処理の修正（37-56行目）

**現在のコード（KV版）:**
```javascript
async _performInitialization() {
    try {
        console.log('🔄 DataService384 初期化開始...');
        
        // Cloudflare KVからキャッシュを復元
        await this._restoreFromKV();
        
        // バックグラウンドでデータをプリフェッチ
        this._prefetchData();
        
        this.initialized = true;
        console.log('✅ DataService384 初期化完了');
        return true;
        
    } catch (error) {
        console.error('❌ DataService384 初期化エラー:', error);
        this.initialized = false;
        return false;
    }
}
```

**修正後のコード（LocalStorage版）:**
```javascript
async _performInitialization() {
    try {
        console.log('🔄 DataService384 初期化開始...');
        
        // LocalStorageからキャッシュを復元
        this._restoreFromLocalStorage();
        
        // バックグラウンドでデータをプリフェッチ
        this._prefetchData();
        
        this.initialized = true;
        console.log('✅ DataService384 初期化完了');
        return true;
        
    } catch (error) {
        console.error('❌ DataService384 初期化エラー:', error);
        this.initialized = false;
        return false;
    }
}
```

### Step 2: データ取得処理の修正（61-91行目）

**現在のコード（KV版）:**
```javascript
async fetchLines(options = {}) {
    const cacheKey = 'lines_all';
    
    // L1: メモリキャッシュチェック
    const memoryCached = this._getFromMemoryCache(cacheKey);
    if (memoryCached) {
        console.log('💾 Memory cache hit');
        return memoryCached;
    }
    
    // L2: Cloudflare KVキャッシュチェック
    const kvCached = await this._getFromKV(cacheKey);
    if (kvCached) {
        console.log('📦 KV cache hit');
        this._setMemoryCache(cacheKey, kvCached);
        return kvCached;
    }
    
    // L3: API呼び出し
    try {
        const data = await this._fetchFromAPI('koudo', options);
        this._setCaches(cacheKey, data.lines);
        return data.lines;
        
    } catch (error) {
        console.error('❌ API fetch failed:', error);
        
        // L4: フォールバック
        return this._loadFallbackData();
    }
}
```

**修正後のコード（LocalStorage版）:**
```javascript
async fetchLines(options = {}) {
    const cacheKey = 'lines_all';
    
    // L1: メモリキャッシュチェック
    const memoryCached = this._getFromMemoryCache(cacheKey);
    if (memoryCached) {
        console.log('💾 Memory cache hit');
        return memoryCached;
    }
    
    // L2: LocalStorageキャッシュチェック
    const localCached = this._getFromLocalStorage(cacheKey);
    if (localCached) {
        console.log('📦 LocalStorage cache hit');
        this._setMemoryCache(cacheKey, localCached);
        return localCached;
    }
    
    // L3: API呼び出し
    try {
        const data = await this._fetchFromAPI('koudo', options);
        this._setCaches(cacheKey, data.lines);
        return data.lines;
        
    } catch (error) {
        console.error('❌ API fetch failed:', error);
        
        // L4: フォールバック
        return this._loadFallbackData();
    }
}
```

### Step 3: キャッシュ関連メソッドの修正（228-287行目）

**現在のコード（KV版）を削除:**
```javascript
// 削除する関数
async _getFromKV(key) { ... }     // 230-245行目
async _setToKV(key, data) { ... } // 250-260行目
async _restoreFromKV() { ... }    // 273-287行目
```

**追加するコード（LocalStorage版）:**
```javascript
/**
 * LocalStorage取得
 */
_getFromLocalStorage(key) {
    try {
        const stored = localStorage.getItem(`384_${key}`);
        if (!stored) return null;
        
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp > this.cacheExpiry) {
            localStorage.removeItem(`384_${key}`);
            return null;
        }
        
        return parsed.data;
    } catch (error) {
        console.warn('LocalStorage read error:', error);
        return null;
    }
}

/**
 * LocalStorage設定
 */
_setToLocalStorage(key, data) {
    try {
        const value = JSON.stringify({
            data,
            timestamp: Date.now()
        });
        localStorage.setItem(`384_${key}`, value);
    } catch (error) {
        console.warn('LocalStorage write error:', error);
        // 容量超過時は古いデータを削除
        if (error.name === 'QuotaExceededError') {
            this._cleanupLocalStorage();
            // リトライ
            try {
                localStorage.setItem(`384_${key}`, value);
            } catch (retryError) {
                console.error('LocalStorage retry failed:', retryError);
            }
        }
    }
}

/**
 * LocalStorageから復元
 */
_restoreFromLocalStorage() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('384_')) {
                const stored = localStorage.getItem(key);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Date.now() - parsed.timestamp < this.cacheExpiry) {
                            const cacheKey = key.replace('384_', '');
                            this._setMemoryCache(cacheKey, parsed.data);
                            console.log(`📦 Restored ${cacheKey} from LocalStorage`);
                        }
                    } catch (e) {
                        console.warn(`Failed to parse ${key}:`, e);
                    }
                }
            }
        });
    } catch (error) {
        console.error('❌ LocalStorage restore failed:', error);
    }
}
```

### Step 4: setCaches メソッドの修正（264-268行目）

**現在のコード（KV版）:**
```javascript
async _setCaches(key, data) {
    this._setMemoryCache(key, data);
    await this._setToKV(key, data);
}
```

**修正後のコード（LocalStorage版）:**
```javascript
_setCaches(key, data) {
    this._setMemoryCache(key, data);
    this._setToLocalStorage(key, data);
}
```

### Step 5: clearCache メソッドの修正（337-348行目）

**現在のコード:**
```javascript
clearCache() {
    this.memoryCache.clear();
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('384_')) {
            localStorage.removeItem(key);
        }
    });
    
    console.log('🧹 All caches cleared');
}
```

**修正不要** - このメソッドは既にLocalStorageを使用しています。

---

## 🧪 テスト手順

### 1. 基本動作確認
```javascript
// ブラウザコンソールで実行
console.clear();

// 1. キャッシュクリア
window.dataService384.clearCache();

// 2. データ取得（API経由）
const lines1 = await window.dataService384.fetchLines();
console.log('初回取得:', lines1.length, '件');

// 3. データ取得（LocalStorageキャッシュ）
const lines2 = await window.dataService384.fetchLines();
console.log('キャッシュ取得:', lines2.length, '件');

// 4. LocalStorage確認
const keys = Object.keys(localStorage).filter(k => k.startsWith('384_'));
console.log('LocalStorageキー:', keys);
```

### 2. ページ間連携確認
```bash
# 1. os_analyzer.htmlを開く
# 2. 分析を実行
# 3. results.htmlに遷移
# 4. 結果が正しく表示されることを確認
```

### 3. エラーがないことを確認
```javascript
// コンソールで以下が表示されないことを確認
// - "KV read error"
// - "KV write error"
// - "分析結果が見つかりません"
```

---

## ⚠️ 注意事項

### やってはいけないこと
- ❌ KV関連のコードを完全削除しない（将来の参考のためコメントアウトで残す）
- ❌ 他のファイルは一切修正しない
- ❌ async/awaitを不適切に削除しない

### 確認事項
- ✅ LocalStorageの容量制限（5-10MB）を考慮
- ✅ エラーハンドリングを適切に実装
- ✅ 既存のデータ連携が壊れないことを確認

---

## 🔄 ロールバック手順

もし問題が発生した場合:

```bash
# Gitで元に戻す
git status
git diff public/js/services/384DataService.js
git checkout -- public/js/services/384DataService.js
```

または:

```bash
# バックアップから復元
cp public/js/services/384DataService.js.backup public/js/services/384DataService.js
```

---

## ✅ 完了チェックリスト

- [ ] 384DataService.jsのバックアップを作成
- [ ] Step 1: 初期化処理を修正
- [ ] Step 2: fetchLinesメソッドを修正
- [ ] Step 3: LocalStorage関連メソッドを追加
- [ ] Step 4: setCachesメソッドを修正
- [ ] 基本動作テストを実行
- [ ] ページ間連携テストを実行
- [ ] エラーログの確認
- [ ] 動作確認完了

---

## 📊 期待される結果

修正後:
- ✅ os_analyzer.html → results.html のデータ連携が正常動作
- ✅ LocalStorageに384爻データがキャッシュされる
- ✅ ページリロード後もキャッシュが有効
- ✅ エラーなしで動作

---

## 🚀 実装開始

この指示書に従って実装を進めてください。
不明な点があれば、実装前に確認してください。

**推定作業時間**: 30分
**リスクレベル**: 低（1ファイルのみの修正）
**影響範囲**: 384爻データサービスのキャッシュ機構のみ

---

**文書完了** - LocalStorage復元実装を開始してください