# 🎨 HaQei Triple OS Analyzer 設計書

**作成日**: 2025年8月16日  
**バージョン**: 1.0  
**プロジェクト**: HaQei OSAnalyzer 完全再構築  

---

## 1. アーキテクチャ設計

### 1.1 システム構成図
```
┌─────────────────────────────────────────────────┐
│                  フロントエンド                    │
├─────────────────────────────────────────────────┤
│  Presentation Layer (HTML/CSS)                  │
│  ├── index.html (エントリーポイント)               │
│  ├── styles.css (統一スタイルシート)              │
│  └── components/ (UIコンポーネント)              │
├─────────────────────────────────────────────────┤
│  Application Layer (JavaScript)                 │
│  ├── app.js (メインコントローラー)                │
│  ├── screens/ (画面制御)                        │
│  ├── analyzers/ (分析エンジン)                  │
│  └── utils/ (ユーティリティ)                     │
├─────────────────────────────────────────────────┤
│  Data Layer                                     │
│  ├── questions.json (質問データ)                 │
│  ├── hexagrams.json (易卦データ)                │
│  └── localStorage (一時保存)                    │
└─────────────────────────────────────────────────┘
```

### 1.2 ディレクトリ構造
```
haqei-analyzer/
├── index.html                    # メインHTML
├── styles.css                    # 統一CSS
├── js/
│   ├── app.js                   # アプリケーションエントリーポイント
│   ├── core/
│   │   ├── StateManager.js      # 状態管理
│   │   ├── EventBus.js          # イベント管理
│   │   └── Router.js            # 画面遷移管理
│   ├── screens/
│   │   ├── WelcomeScreen.js     # ウェルカム画面
│   │   ├── QuestionScreen.js    # 質問画面
│   │   └── ResultScreen.js      # 結果画面
│   ├── analyzers/
│   │   ├── TripleOSAnalyzer.js  # Triple OS分析
│   │   ├── HexagramMapper.js    # 易卦マッピング
│   │   └── InteractionAnalyzer.js # 相互作用分析
│   └── utils/
│       ├── DataValidator.js     # データ検証
│       ├── Calculator.js        # 計算ユーティリティ
│       └── DOMHelper.js         # DOM操作ヘルパー
├── data/
│   ├── questions.json           # 36問の質問データ
│   └── hexagrams.json          # 64卦データ
└── assets/
    └── images/                  # 画像リソース
```

---

## 2. データフロー設計

### 2.1 状態管理
```javascript
// グローバル状態構造
const AppState = {
  currentScreen: 'welcome' | 'question' | 'result',
  questionIndex: 0,  // 0-35
  answers: [],       // ['A', 'B', 'C', 'D', 'E']の配列
  analysisResult: null,
  settings: {
    language: 'ja',
    theme: 'light'
  }
};
```

### 2.2 イベントフロー
```
[ユーザー操作] → [Event] → [Handler] → [State更新] → [View更新]

例：質問回答フロー
1. ユーザーが選択肢クリック
2. 'answer:selected' イベント発火
3. QuestionHandler が処理
4. State.answers[index] 更新
5. QuestionScreen.render() 実行
```

### 2.3 データ変換パイプライン
```javascript
// 回答 → スコア → 易卦 → 結果
[Raw Answers] 
    ↓ calculateScores()
[OS Scores: {engine: 0.7, interface: 0.6, safe: 0.8}]
    ↓ mapToHexagrams()
[Hexagram IDs: {engine: 1, interface: 11, safe: 2}]
    ↓ generateDescriptions()
[Final Result: Complete TripleOS Analysis]
```

---

## 3. コンポーネント設計

### 3.1 HTMLテンプレート構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HaQei Triple OS Analyzer</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- アプリケーションルート -->
    <div id="app">
        <!-- 動的にスクリーンが挿入される -->
    </div>
    
    <!-- JavaScriptモジュール -->
    <script type="module" src="js/app.js"></script>
</body>
</html>
```

### 3.2 スクリーンコンポーネント

#### WelcomeScreen
```javascript
class WelcomeScreen {
    constructor() {
        this.template = `
            <section class="screen welcome-screen">
                <header class="hero">
                    <h1>HaQei Triple OS Analyzer</h1>
                    <p class="subtitle">あなたの3つの仮想人格を発見する</p>
                </header>
                
                <div class="os-cards">
                    <article class="os-card engine">
                        <h2>Engine OS</h2>
                        <p>創造と推進の人格</p>
                    </article>
                    <article class="os-card interface">
                        <h2>Interface OS</h2>
                        <p>調和と協調の人格</p>
                    </article>
                    <article class="os-card safe">
                        <h2>Safe Mode OS</h2>
                        <p>安全と慎重の人格</p>
                    </article>
                </div>
                
                <button class="btn-primary" id="start-btn">
                    分析を開始する
                </button>
            </section>
        `;
    }
}
```

#### QuestionScreen
```javascript
class QuestionScreen {
    constructor() {
        this.currentQuestion = 0;
    }
    
    render(questionData) {
        return `
            <section class="screen question-screen">
                <header class="progress-header">
                    <div class="progress-bar">
                        <div class="progress-fill" 
                             style="width: ${(this.currentQuestion/36)*100}%">
                        </div>
                    </div>
                    <span class="progress-text">
                        ${this.currentQuestion + 1} / 36
                    </span>
                </header>
                
                <main class="question-content">
                    <h2 class="question-text">
                        ${questionData.text}
                    </h2>
                    
                    <div class="options-list">
                        ${this.renderOptions(questionData.options)}
                    </div>
                </main>
                
                <footer class="question-footer">
                    <button class="btn-secondary" 
                            id="prev-btn" 
                            ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        前へ
                    </button>
                    <button class="btn-primary" 
                            id="next-btn" 
                            disabled>
                        次へ
                    </button>
                </footer>
            </section>
        `;
    }
}
```

#### ResultScreen
```javascript
class ResultScreen {
    render(analysisResult) {
        return `
            <section class="screen result-screen">
                <header class="result-header">
                    <h1>あなたのTriple OS分析結果</h1>
                </header>
                
                <div class="os-results">
                    ${this.renderOSCard('engine', analysisResult.engine)}
                    ${this.renderOSCard('interface', analysisResult.interface)}
                    ${this.renderOSCard('safe', analysisResult.safeMode)}
                </div>
                
                <div class="interaction-analysis">
                    <h2>OS間の相互作用</h2>
                    <canvas id="radar-chart"></canvas>
                    <p>${analysisResult.interactions.description}</p>
                </div>
                
                <footer class="result-footer">
                    <button class="btn-primary" id="restart-btn">
                        もう一度分析する
                    </button>
                </footer>
            </section>
        `;
    }
}
```

---

## 4. 分析エンジン設計

### 4.1 TripleOSAnalyzer
```javascript
class TripleOSAnalyzer {
    constructor() {
        this.categories = {
            engine: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33],
            interface: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
            safe: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
        };
    }
    
    analyze(answers) {
        const scores = this.calculateScores(answers);
        const hexagrams = this.mapToHexagrams(scores);
        const interactions = this.analyzeInteractions(scores);
        
        return {
            engine: {
                score: scores.engine,
                hexagramId: hexagrams.engine,
                ...this.generateOSData('engine', scores.engine, hexagrams.engine)
            },
            interface: { /* 同様 */ },
            safeMode: { /* 同様 */ },
            interactions
        };
    }
    
    calculateScores(answers) {
        const scoreMap = { A: 5, B: 4, C: 3, D: 2, E: 1 };
        
        return {
            engine: this.calculateCategoryScore(answers, 'engine', scoreMap),
            interface: this.calculateCategoryScore(answers, 'interface', scoreMap),
            safe: this.calculateCategoryScore(answers, 'safe', scoreMap)
        };
    }
}
```

### 4.2 HexagramMapper
```javascript
class HexagramMapper {
    constructor(hexagramData) {
        this.hexagrams = hexagramData;
    }
    
    mapScoreToHexagram(score, pattern) {
        // スコア（0-1）を64分割して易卦にマッピング
        const index = Math.floor(score * 64);
        return this.hexagrams[Math.min(index, 63)];
    }
    
    getTrigramPair(hexagramId) {
        const hexagram = this.hexagrams.find(h => h.id === hexagramId);
        return {
            upper: hexagram.trigrams.upper,
            lower: hexagram.trigrams.lower
        };
    }
}
```

---

## 5. スタイル設計

### 5.1 CSS変数定義
```css
:root {
    /* カラーパレット */
    --color-primary: #4F7CAC;
    --color-secondary: #162447;
    --color-accent: #E43F6F;
    --color-success: #22C55E;
    --color-warning: #F59E0B;
    --color-error: #EF4444;
    
    /* スペーシング */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* タイポグラフィ */
    --font-family-base: 'Noto Sans JP', sans-serif;
    --font-family-mono: 'Roboto Mono', monospace;
    
    /* ブレークポイント */
    --breakpoint-mobile: 320px;
    --breakpoint-tablet: 768px;
    --breakpoint-desktop: 1024px;
}
```

### 5.2 レスポンシブグリッド
```css
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md);
}

.grid {
    display: grid;
    gap: var(--spacing-md);
}

/* モバイル */
@media (max-width: 767px) {
    .grid { grid-template-columns: 1fr; }
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
}

/* デスクトップ */
@media (min-width: 1024px) {
    .grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 6. セキュリティ設計

### 6.1 入力検証
```javascript
class DataValidator {
    static validateAnswer(answer) {
        const validAnswers = ['A', 'B', 'C', 'D', 'E'];
        return validAnswers.includes(answer);
    }
    
    static sanitizeInput(input) {
        return input
            .replace(/[<>]/g, '')
            .trim()
            .substring(0, 1000);
    }
}
```

### 6.2 CSP設定
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

---

## 7. パフォーマンス最適化

### 7.1 遅延読み込み
```javascript
// 結果画面で必要なChart.jsを遅延読み込み
async function loadChartLibrary() {
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
        
        return new Promise(resolve => {
            script.onload = resolve;
        });
    }
}
```

### 7.2 メモ化
```javascript
const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (!cache.has(key)) {
            cache.set(key, fn(...args));
        }
        return cache.get(key);
    };
};

const calculateScores = memoize(originalCalculateScores);
```

---

## 8. エラーハンドリング

### 8.1 グローバルエラーハンドラー
```javascript
class ErrorHandler {
    static init() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showUserFriendlyError();
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showUserFriendlyError();
        });
    }
    
    static showUserFriendlyError() {
        const errorUI = document.createElement('div');
        errorUI.className = 'error-notification';
        errorUI.textContent = '予期しないエラーが発生しました。ページを再読み込みしてください。';
        document.body.appendChild(errorUI);
    }
}
```

---

## 9. テスト戦略

### 9.1 単体テスト構造
```javascript
// __tests__/analyzers/TripleOSAnalyzer.test.js
describe('TripleOSAnalyzer', () => {
    test('正しくスコアを計算する', () => {
        const analyzer = new TripleOSAnalyzer();
        const answers = Array(36).fill('C'); // すべて中間値
        const scores = analyzer.calculateScores(answers);
        
        expect(scores.engine).toBe(0.5);
        expect(scores.interface).toBe(0.5);
        expect(scores.safe).toBe(0.5);
    });
});
```

### 9.2 E2Eテスト
```javascript
// e2e/complete-flow.test.js
describe('完全フロー', () => {
    test('36問回答して結果が表示される', async () => {
        await page.goto('http://localhost:8788');
        await page.click('#start-btn');
        
        // 36問回答
        for (let i = 0; i < 36; i++) {
            await page.click('[data-answer="C"]');
            await page.click('#next-btn');
        }
        
        // 結果確認
        await expect(page).toHaveSelector('.result-screen');
        await expect(page).toHaveText('Engine OS');
    });
});
```

---

## 10. デプロイメント設計

### 10.1 ビルドプロセス
```bash
# ビルドスクリプト
npm run build
# 1. JSファイル結合・最小化
# 2. CSS最小化
# 3. 画像最適化
# 4. dist/フォルダに出力
```

### 10.2 配信構成
```
dist/
├── index.html          # 最小化済み
├── app.min.js         # 結合・最小化済み
├── styles.min.css     # 最小化済み
└── data/
    └── combined.json  # 質問＋易卦データ結合
```

---

**承認者**: HaQei プロジェクトチーム  
**最終更新**: 2025年8月16日