# 🎨 HaQei Triple OS Analyzer 設計書（既存資産活用版）

**作成日**: 2025年8月16日  
**バージョン**: 2.0（既存資産ベース）  
**プロジェクト**: os_analyzer.html再構築  

---

## 1. システムアーキテクチャ

### 1.1 既存アーキテクチャの維持
```
┌─────────────────────────────────────────────────┐
│              os_analyzer.html                    │
├─────────────────────────────────────────────────┤
│  データ層（変更禁止）                              │
│  ├── questions-full.js (36問データ)              │
│  ├── H384H64database.js (384爻データ)            │
│  ├── H64_profile_vectors.js                     │
│  └── action_plan_database.js                    │
├─────────────────────────────────────────────────┤
│  分析エンジン層（変更最小限）                      │
│  ├── TripleOSInteractionAnalyzer.js             │
│  ├── ExpressionGenerator.js                     │
│  ├── KeywordAnalyzer.js                         │
│  └── DynamicKeywordGenerator.js                 │
├─────────────────────────────────────────────────┤
│  UI制御層（リファクタリング対象）                  │
│  ├── app.js (画面遷移・回答収集)                 │
│  └── os-analyzer-main.js (分析実行・結果表示)    │
├─────────────────────────────────────────────────┤
│  表示層（簡潔化対象）                             │
│  ├── HTML構造（最小限に）                        │
│  └── styles.css（不要部分削除）                  │
└─────────────────────────────────────────────────┘
```

### 1.2 ファイル読み込み順序（重要）
```html
<!-- HEAD内：基盤データと分析エンジン -->
1. H384H64database.js        // 易卦データベース
2. ExpressionGenerator.js     // 表現生成エンジン
3. KeywordAnalyzer.js         // キーワード分析
4. TripleOSInteractionAnalyzer.js // メイン分析エンジン

<!-- BODY末尾：UI制御とデータ -->
5. questions-full.js          // 36問データ
6. app.js                     // 画面制御
7. os-analyzer-main.js        // 分析実行
8. DynamicKeywordGenerator.js // 動的生成（オプション）
```

---

## 2. データフロー設計

### 2.1 既存のデータフロー維持
```
[ユーザー入力]
    ↓
[app.js: 回答収集]
    ↓ userAnswers配列
[os-analyzer-main.js: 分析開始]
    ↓
[TripleOSInteractionAnalyzer: 分析実行]
    ↓ tripleOSResults
[結果表示処理]
    ↓
[DOM更新]
```

### 2.2 状態管理（既存構造）
```javascript
// グローバル状態（既存維持）
window.userAnswers = [];      // 36個の回答（A-E）
window.currentQuestionIndex = 0;
window.QUESTIONS = [...];     // questions-full.jsから
window.H384_DATA = [...];     // H384H64database.jsから
window.criticalCSSAnalyzer = {
    state: {
        tripleOSResults: null,
        answers: []
    }
};
```

---

## 3. HTML構造設計（最小限構成）

### 3.1 クリーンなHTML構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HaQei Triple OS Analyzer</title>
    
    <!-- スタイルシート -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- Critical CSS (インライン) -->
    <style>
        /* 初期表示に必要な最小限のCSS */
        .screen { display: none; }
        .screen.active { display: block; }
        #welcome-screen { 
            text-align: center; 
            padding: 2rem; 
        }
    </style>
    
    <!-- 必須データベース -->
    <script src="assets/H384H64database.js"></script>
    
    <!-- 分析エンジン（順序重要） -->
    <script src="js/core/ExpressionGenerator.js"></script>
    <script src="js/core/KeywordAnalyzer.js"></script>
    <script src="js/core/TripleOSInteractionAnalyzer.js"></script>
</head>
<body>
    <!-- アプリケーションコンテナ -->
    <div id="app">
        
        <!-- ウェルカム画面 -->
        <section id="welcome-screen" class="screen active">
            <h1>HaQei Triple OS Analyzer</h1>
            <p>あなたの3つの仮想人格を発見する</p>
            
            <div class="os-intro">
                <div class="os-card">
                    <h3>🎯 Engine OS</h3>
                    <p>創造と推進の人格</p>
                </div>
                <div class="os-card">
                    <h3>💬 Interface OS</h3>
                    <p>調和と協調の人格</p>
                </div>
                <div class="os-card">
                    <h3>🛡️ Safe Mode OS</h3>
                    <p>安全と慎重の人格</p>
                </div>
            </div>
            
            <button id="start-btn" class="btn-primary">
                分析を開始する
            </button>
        </section>
        
        <!-- 質問画面 -->
        <section id="question-screen" class="screen">
            <!-- 進捗表示 -->
            <div class="progress-bar">
                <div id="progress-fill" class="progress-fill"></div>
                <span id="progress-text">1 / 36</span>
            </div>
            
            <!-- 質問表示エリア -->
            <div id="question-container">
                <!-- 動的に生成 -->
            </div>
            
            <!-- 選択肢エリア -->
            <div id="options-container">
                <!-- 動的に生成 -->
            </div>
            
            <!-- ナビゲーション -->
            <div class="navigation">
                <button id="prev-btn" class="btn-secondary">前へ</button>
                <button id="next-btn" class="btn-primary" disabled>次へ</button>
            </div>
        </section>
        
        <!-- 結果画面 -->
        <section id="results-screen" class="screen">
            <h2>あなたのTriple OS分析結果</h2>
            
            <!-- Triple OSカード表示 -->
            <div id="os-cards-container">
                <!-- 動的に生成 -->
            </div>
            
            <!-- サマリービュー -->
            <div id="summary-view">
                <!-- 動的に生成 -->
            </div>
            
            <!-- 易卦情報 -->
            <div id="hexagram-display">
                <!-- 動的に生成 -->
            </div>
            
            <!-- 8卦エネルギーバランス -->
            <canvas id="radar-chart"></canvas>
            
            <!-- リスタート -->
            <button id="restart-btn" class="btn-primary">
                もう一度分析する
            </button>
        </section>
        
    </div>
    
    <!-- Chart.js (結果表示用) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    
    <!-- 質問データ -->
    <script src="assets/js/questions-full.js"></script>
    
    <!-- アプリケーション制御 -->
    <script src="assets/js/app.js"></script>
    <script src="js/os-analyzer-main.js"></script>
    
    <!-- オプション：動的生成システム -->
    <script src="js/pages/future-simulator/DynamicKeywordGenerator.js"></script>
</body>
</html>
```

---

## 4. JavaScript設計

### 4.1 app.js（既存ロジック維持・整理）
```javascript
// app.js - 画面制御と回答収集
(function() {
    'use strict';
    
    // 状態管理
    let currentQuestionIndex = 0;
    const userAnswers = [];
    
    // DOM要素キャッシュ
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        question: document.getElementById('question-screen'),
        results: document.getElementById('results-screen')
    };
    
    // 画面遷移
    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenName].classList.add('active');
    }
    
    // 質問表示
    function displayQuestion(index) {
        const question = window.QUESTIONS[index];
        const container = document.getElementById('question-container');
        const optionsContainer = document.getElementById('options-container');
        
        // 質問文表示
        container.innerHTML = `
            <h3>${question.category.title}</h3>
            <p class="question-text">${question.text}</p>
        `;
        
        // 選択肢表示
        optionsContainer.innerHTML = question.options.map(opt => `
            <label class="option">
                <input type="radio" name="q${index}" value="${opt.value}">
                <span>${opt.value}. ${opt.text}</span>
            </label>
        `).join('');
        
        // 進捗更新
        updateProgress(index);
    }
    
    // 進捗表示更新
    function updateProgress(index) {
        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');
        
        fill.style.width = `${((index + 1) / 36) * 100}%`;
        text.textContent = `${index + 1} / 36`;
    }
    
    // イベントリスナー設定
    function setupEventListeners() {
        // 開始ボタン
        document.getElementById('start-btn').addEventListener('click', () => {
            showScreen('question');
            displayQuestion(0);
        });
        
        // 次へボタン
        document.getElementById('next-btn').addEventListener('click', () => {
            const selected = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
            if (selected) {
                userAnswers[currentQuestionIndex] = selected.value;
                
                if (currentQuestionIndex < 35) {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex);
                } else {
                    // 分析実行
                    startAnalysis();
                }
            }
        });
        
        // 前へボタン
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion(currentQuestionIndex);
            }
        });
        
        // 選択肢変更時
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                document.getElementById('next-btn').disabled = false;
            }
        });
    }
    
    // 分析開始
    function startAnalysis() {
        // os-analyzer-main.jsの分析関数を呼び出し
        if (window.runTripleOSAnalysis) {
            window.runTripleOSAnalysis(userAnswers);
            showScreen('results');
        }
    }
    
    // 初期化
    setupEventListeners();
    
    // グローバルに公開
    window.userAnswers = userAnswers;
    
})();
```

### 4.2 os-analyzer-main.js（分析実行と結果表示）
```javascript
// os-analyzer-main.js - 分析実行と結果表示
(function() {
    'use strict';
    
    // Triple OS分析実行
    function runTripleOSAnalysis(answers) {
        console.log('🔄 Triple OS分析開始...');
        
        // TripleOSInteractionAnalyzerを使用
        if (typeof TripleOSInteractionAnalyzer !== 'undefined') {
            const analyzer = new TripleOSInteractionAnalyzer();
            
            // 36問の回答から分析実行
            const results = analyzer.analyze(answers);
            
            // 結果を状態に保存
            if (!window.criticalCSSAnalyzer) {
                window.criticalCSSAnalyzer = { state: {} };
            }
            window.criticalCSSAnalyzer.state.tripleOSResults = results;
            
            // 結果表示
            displayResults(results);
        }
    }
    
    // 結果表示
    function displayResults(results) {
        // OSカード表示
        const container = document.getElementById('os-cards-container');
        container.innerHTML = `
            ${createOSCard('Engine OS', results.engineOS)}
            ${createOSCard('Interface OS', results.interfaceOS)}
            ${createOSCard('Safe Mode OS', results.safeModeOS)}
        `;
        
        // レーダーチャート表示
        if (window.Chart) {
            createRadarChart(results);
        }
    }
    
    // OSカード生成
    function createOSCard(title, osData) {
        return `
            <div class="os-result-card">
                <h3>${title}</h3>
                <div class="os-score">${Math.round(osData.percentage || 0)}%</div>
                <div class="os-hexagram">
                    #${osData.hexagramId || 'N/A'} 
                    ${osData.hexagramName || 'N/A'}
                </div>
                <p class="os-description">${osData.description || ''}</p>
            </div>
        `;
    }
    
    // レーダーチャート作成
    function createRadarChart(results) {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'],
                datasets: [{
                    label: '8卦エネルギーバランス',
                    data: calculateBaguaScores(results),
                    backgroundColor: 'rgba(79, 172, 254, 0.2)',
                    borderColor: 'rgba(79, 172, 254, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }
    
    // 8卦スコア計算
    function calculateBaguaScores(results) {
        // 既存のロジックまたは簡略版
        return [
            results.engineOS?.baguaScores?.qian || 5,
            results.engineOS?.baguaScores?.dui || 5,
            results.interfaceOS?.baguaScores?.li || 5,
            results.engineOS?.baguaScores?.zhen || 5,
            results.interfaceOS?.baguaScores?.xun || 5,
            results.engineOS?.baguaScores?.kan || 5,
            results.safeModeOS?.baguaScores?.gen || 5,
            results.safeModeOS?.baguaScores?.kun || 5
        ];
    }
    
    // グローバル公開
    window.runTripleOSAnalysis = runTripleOSAnalysis;
    
})();
```

---

## 5. CSS設計（最小限スタイル）

### 5.1 styles.css構造
```css
/* =================== */
/* リセット・基本設定 */
/* =================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Noto Sans JP', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    min-height: 100vh;
}

/* =================== */
/* 画面制御 */
/* =================== */
.screen {
    display: none;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.screen.active {
    display: block;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* =================== */
/* ボタン */
/* =================== */
.btn-primary {
    background: #4F7CAC;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: #3a5f8a;
    transform: translateY(-2px);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
}

/* =================== */
/* 進捗バー */
/* =================== */
.progress-bar {
    background: rgba(255, 255, 255, 0.2);
    height: 8px;
    border-radius: 4px;
    margin: 2rem 0;
    position: relative;
}

.progress-fill {
    background: #4F7CAC;
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

/* =================== */
/* 質問画面 */
/* =================== */
.question-text {
    font-size: 1.3rem;
    margin: 2rem 0;
}

.option {
    display: block;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.option:hover {
    background: rgba(255, 255, 255, 0.2);
}

.option input[type="radio"] {
    margin-right: 1rem;
}

/* =================== */
/* 結果画面 */
/* =================== */
#os-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.os-result-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.os-score {
    font-size: 2rem;
    font-weight: bold;
    color: #4F7CAC;
    margin: 1rem 0;
}

.os-hexagram {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0.5rem 0;
}

/* =================== */
/* レスポンシブ対応 */
/* =================== */
@media (max-width: 768px) {
    .screen {
        padding: 1rem;
    }
    
    #os-cards-container {
        grid-template-columns: 1fr;
    }
}
```

---

## 6. エラーハンドリング設計

### 6.1 グローバルエラーハンドラー
```javascript
// エラーハンドリング（app.js内に追加）
window.addEventListener('error', (event) => {
    console.error('エラー発生:', event.error);
    // ユーザーへの通知（必要に応じて）
});

// データ存在確認
if (!window.QUESTIONS || !window.H384_DATA) {
    console.error('必須データが読み込まれていません');
}
```

---

## 7. テスト計画

### 7.1 動作確認チェックリスト
```javascript
// テストスクリプト
function testSystem() {
    const tests = {
        'questions-full.js読み込み': !!window.QUESTIONS,
        '36問存在確認': window.QUESTIONS?.length === 36,
        'H384データ読み込み': !!window.H384_DATA,
        '384爻存在確認': window.H384_DATA?.length === 384,
        'TripleOSAnalyzer存在': typeof TripleOSInteractionAnalyzer !== 'undefined',
        'ExpressionGenerator存在': typeof ExpressionGenerator !== 'undefined'
    };
    
    console.table(tests);
    return Object.values(tests).every(t => t);
}
```

---

## 8. デプロイメント設計

### 8.1 ファイル構成（本番環境）
```
public/
├── os_analyzer.html          # メインHTML
├── styles.css                # スタイルシート
├── assets/
│   ├── H384H64database.js   # 易卦データ
│   └── js/
│       ├── questions-full.js # 質問データ
│       └── app.js            # アプリ制御
└── js/
    ├── core/                 # 分析エンジン
    │   ├── TripleOSInteractionAnalyzer.js
    │   ├── ExpressionGenerator.js
    │   └── KeywordAnalyzer.js
    └── os-analyzer-main.js   # 分析実行
```

### 8.2 最適化（オプション）
- CSS最小化
- JavaScript結合（ただし読み込み順序維持）
- 画像最適化（使用する場合）

---

**結論**: 既存の動作している資産を最大限活用し、UI層のみを簡潔化することで、安全かつ効率的な再構築が可能。