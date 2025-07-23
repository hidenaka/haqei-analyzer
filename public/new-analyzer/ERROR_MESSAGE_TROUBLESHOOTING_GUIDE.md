# エラーメッセージ対処法ガイド

## 📋 概要

HaQei Analyzerで発生する可能性のあるエラーメッセージとその対処法を網羅的に説明します。

## 🚨 スクリプト読み込みエラー

### 1. `ReferenceError: [クラス名] is not defined`

#### エラー例
```
ReferenceError: BaseComponent is not defined
ReferenceError: DataManager is not defined
ReferenceError: HAQEI_DATA is not defined
```

#### 原因と対処法

| クラス/変数名 | 原因 | 対処法 |
|--------------|------|-------|
| `BaseComponent` | BaseComponent.jsが読み込まれていない | スクリプト順序を確認、BaseComponent.jsを他のコンポーネントより先に読み込む |
| `DataManager` | DataManager.jsが読み込まれていない | コアクラスの読み込み順序を確認 |
| `Calculator` | Calculator.jsが読み込まれていない | DataManagerの後に読み込む |
| `HAQEI_DATA` | data_box.jsが読み込まれていない | データファイルを最初に読み込む |
| `WORLDVIEW_QUESTIONS` | questions.jsが読み込まれていない | data_box.jsの後に読み込む |

#### 解決手順
```html
<!-- 正しい読み込み順序 -->
<script src="../js/data/data_box.js"></script>        <!-- 1. データ -->
<script src="js/core/BaseComponent.js"></script>      <!-- 2. 基底クラス -->
<script src="js/core/DataManager.js"></script>        <!-- 3. コアクラス -->
<script src="js/components/WelcomeScreen.js"></script> <!-- 4. UIコンポーネント -->
```

### 2. `TypeError: Cannot read property 'xxx' of undefined`

#### エラー例
```
TypeError: Cannot read property 'hexagrams_master' of undefined
TypeError: Cannot read property 'calculateCompatibility' of undefined
```

#### 原因と対処法

| プロパティ | 原因 | 対処法 |
|-----------|------|-------|
| `hexagrams_master` | HAQEI_DATAが未定義またはnull | data_box.jsの読み込み確認、フォールバックデータの実装 |
| `calculateCompatibility` | Calculatorが未初期化 | Calculatorの初期化確認 |

#### デバッグ方法
```javascript
// ブラウザコンソールで実行
console.log('HAQEI_DATA:', typeof HAQEI_DATA);
if (HAQEI_DATA) {
    console.log('hexagrams_master:', HAQEI_DATA.hexagrams_master);
}
```

### 3. `Failed to construct '[クラス名]': Illegal constructor`

#### エラー例
```
Failed to construct 'StorageManager': Illegal constructor
Failed to construct 'DataManager': Illegal constructor
```

#### 原因と対処法

| クラス | 原因 | 対処法 |
|-------|------|-------|
| `StorageManager` | LocalStorageが利用できない環境 | ブラウザ設定確認、プライベートモード無効化 |
| `DataManager` | 必要なデータが読み込まれていない | データファイルの読み込み確認 |

#### 解決方法
```javascript
// LocalStorage利用可能性確認
function checkLocalStorageSupport() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error('LocalStorage is not supported');
        return false;
    }
}
```

## 🌐 ネットワーク関連エラー

### 1. `net::ERR_FAILED` / `Failed to load resource`

#### エラー例
```
net::ERR_FAILED https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
Failed to load resource: js/core/DataManager.js
```

#### 原因と対処法

| リソース種別 | 原因 | 対処法 |
|-------------|------|-------|
| CDNライブラリ | ネットワーク接続問題 | ネットワーク確認、代替CDN使用 |
| ローカルファイル | ファイルパス間違い | パスの確認、ファイル存在確認 |
| HTTPSアクセス | Mixed Content問題 | HTTPSでCDNアクセス |

#### 解決手順
1. **ネットワーク確認**
   ```bash
   ping cdnjs.cloudflare.com
   ```

2. **ファイル存在確認**
   ```bash
   ls -la js/core/DataManager.js
   ```

3. **代替CDN**
   ```html
   <!-- 元のCDN -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
   <!-- 代替CDN -->
   <script src="https://unpkg.com/chart.js@3.9.1/dist/chart.min.js"></script>
   ```

### 2. `Cross-Origin Request Blocked` (CORS エラー)

#### エラー例
```
Access to script at 'file:///path/to/script.js' from origin 'null' has been blocked by CORS policy
```

#### 原因
- `file://` プロトコルでファイルを直接開いている
- HTTPサーバーを使用していない

#### 対処法
```bash
# Python HTTP サーバー
python -m http.server 8000

# Node.js HTTP サーバー
npx http-server -p 8000

# PHP HTTP サーバー
php -S localhost:8000
```

## 💾 データ関連エラー

### 1. `SyntaxError: Unexpected token`

#### エラー例
```
SyntaxError: Unexpected token 'o' in JSON at position 1
SyntaxError: Unexpected end of JSON input
```

#### 原因と対処法

| 状況 | 原因 | 対処法 |
|------|------|-------|
| JSONパース失敗 | データファイルの破損 | データファイルの修復、フォールバックデータ使用 |
| 空のレスポンス | ファイルが空またはアクセス不可 | ファイル内容確認、パーミッション確認 |

#### デバッグ方法
```javascript
// JSON データの検証
function validateJsonData(data) {
    try {
        if (typeof data === 'string') {
            JSON.parse(data);
        }
        return true;
    } catch (error) {
        console.error('Invalid JSON data:', error);
        return false;
    }
}
```

### 2. `Data structure validation failed`

#### エラー例
```
Data structure validation failed: Missing required property 'hexagrams_master'
Data structure validation failed: Invalid question format
```

#### 原因と対処法

| データタイプ | 必須プロパティ | 対処法 |
|-------------|---------------|-------|
| HAQEI_DATA | hexagrams_master, os_manual | データファイル整合性確認 |
| WORLDVIEW_QUESTIONS | 配列形式、各要素にid, text | questions.jsの構造確認 |
| H64_8D_VECTORS | 64個の卦ベクトル | vectors.jsの完全性確認 |

#### 検証スクリプト
```javascript
// データ構造検証
function validateDataStructure() {
    const checks = [
        {
            name: 'HAQEI_DATA',
            test: () => HAQEI_DATA && HAQEI_DATA.hexagrams_master
        },
        {
            name: 'WORLDVIEW_QUESTIONS',
            test: () => Array.isArray(WORLDVIEW_QUESTIONS) && WORLDVIEW_QUESTIONS.length > 0
        },
        {
            name: 'H64_8D_VECTORS',
            test: () => H64_8D_VECTORS && Object.keys(H64_8D_VECTORS).length === 64
        }
    ];
    
    checks.forEach(check => {
        if (!check.test()) {
            console.error(`❌ ${check.name} validation failed`);
        } else {
            console.log(`✅ ${check.name} validation passed`);
        }
    });
}
```

## 🖥️ ブラウザ互換性エラー

### 1. `Promise is not defined`

#### エラー例
```
ReferenceError: Promise is not defined
```

#### 原因
- 古いブラウザ（IE11以前）でPromiseが未対応

#### 対処法
```html
<!-- Promise Polyfill -->
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
```

### 2. `localStorage is not defined`

#### エラー例
```
ReferenceError: localStorage is not defined
```

#### 原因と対処法

| 状況 | 原因 | 対処法 |
|------|------|-------|
| プライベートモード | ブラウザがLocalStorageを無効化 | プライベートモード無効化 |
| 古いブラウザ | LocalStorage未対応 | Web Storage Polyfill使用 |
| セキュリティ設定 | ブラウザ設定でStorage無効 | ブラウザ設定変更 |

#### Fallback実装
```javascript
// LocalStorage Fallback
const storage = {
    data: {},
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            this.data[key] = value;
        }
    },
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return this.data[key] || null;
        }
    }
};
```

## 🔧 初期化エラー

### 1. `Application initialization failed`

#### エラー例
```
Application initialization failed: Required components not loaded
```

#### 原因チェックリスト
- [ ] すべてのスクリプトファイルが読み込まれているか
- [ ] データファイルが正常に読み込まれているか
- [ ] DOM要素が正しく配置されているか
- [ ] 必要なCSS/CSSファイルが読み込まれているか

#### デバッグ手順
```javascript
// 初期化状態確認
function checkInitializationState() {
    console.group('🔍 Initialization State Check');
    
    // スクリプト確認
    const requiredClasses = ['BaseComponent', 'DataManager', 'Calculator', 'WelcomeScreen'];
    requiredClasses.forEach(className => {
        console.log(`${className}:`, typeof window[className]);
    });
    
    // データ確認
    const requiredData = ['HAQEI_DATA', 'WORLDVIEW_QUESTIONS', 'H64_8D_VECTORS'];
    requiredData.forEach(dataName => {
        console.log(`${dataName}:`, typeof window[dataName]);
    });
    
    // DOM確認
    const requiredElements = ['app', 'welcome-container', 'questions-container'];
    requiredElements.forEach(elementId => {
        console.log(`#${elementId}:`, document.getElementById(elementId) ? 'found' : 'missing');
    });
    
    console.groupEnd();
}
```

### 2. `Component rendering failed`

#### エラー例
```
Component rendering failed: Container element not found
Component rendering failed: Invalid state transition
```

#### 原因と対処法

| コンポーネント | 原因 | 対処法 |
|---------------|------|-------|
| WelcomeScreen | #welcome-containerが存在しない | HTMLの構造確認 |
| QuestionFlow | データが未読み込み | データ読み込み完了を待つ |
| AnalysisView | 前の段階が未完了 | 状態管理の確認 |

## 🔍 デバッグツール

### 1. ブラウザ開発者ツール活用

#### コンソールでの確認
```javascript
// 総合状態確認
function systemDiagnostics() {
    console.group('🏥 System Diagnostics');
    
    // 環境情報
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Language:', navigator.language);
    
    // ストレージ確認
    console.log('LocalStorage:', typeof localStorage !== 'undefined');
    console.log('SessionStorage:', typeof sessionStorage !== 'undefined');
    
    // 主要オブジェクト確認
    console.log('Window Object Keys:', Object.keys(window).filter(key => key.includes('HAQEI') || key.includes('WORLDVIEW')));
    
    console.groupEnd();
}
```

### 2. 統合テストツール使用

#### テストファイル実行
```bash
# ブラウザで開く
open test-integration-complete-startup.html
open test-error-recovery.html
open test-browser-compatibility.html
```

## 🚑 緊急時対処法

### 1. 完全リセット手順

#### ブラウザキャッシュクリア
```bash
# Chrome
Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)

# Firefox
Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)
```

#### LocalStorageクリア
```javascript
// コンソールで実行
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. フォールバック処理の手動実行

#### 緊急データ作成
```javascript
// analyzer.htmlに組み込まれているフォールバック関数
if (typeof createFallbackHaqeiData !== 'undefined') {
    window.HAQEI_DATA = createFallbackHaqeiData();
}
if (typeof createFallbackQuestions !== 'undefined') {
    window.WORLDVIEW_QUESTIONS = createFallbackQuestions();
}
```

## 📞 サポート情報

### エラー報告時の必要情報
1. **ブラウザ情報**: バージョン、OS
2. **エラーメッセージ**: 完全なスタックトレース
3. **再現手順**: エラーが発生するまでの操作
4. **環境**: HTTP/File プロトコル、ネットワーク状況

### よく使用するコンソールコマンド
```javascript
// 現在の状態確認
checkInitializationState();

// システム診断
systemDiagnostics();

// データ構造検証
validateDataStructure();

// パフォーマンス情報
console.log('Performance:', window.performance);
```

---

**最終更新**: 2025年1月  
**対象バージョン**: analyzer.html v1.0.0