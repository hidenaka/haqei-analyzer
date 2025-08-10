# 📋 保持価値コード仕様書 - 計画立案用 20250810

## 🎯 **概要**
HAQEIシステムの既存コードベースから保持すべき優秀な資産の技術仕様書。全体計画立案者向けの詳細技術情報。

---

# 1️⃣ **診断ロジック・コア（QuizController）**

## 基本構造
```javascript
class QuizController {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.personaEnhancer = new VirtualPersonaEnhancer();
        this.tripleOSAnalyzer = null;
    }
}
```

## 主要メソッド仕様

### 1.1 スコア計算エンジン
```javascript
calculateScores() {
    // 8次元スコア初期化
    const scores = {
        qian_creativity: 0,    // 乾_創造性
        zhen_action: 0,        // 震_行動性
        kan_exploration: 0,    // 坎_探求性
        gen_stability: 0,      // 艮_安定性
        kun_receptiveness: 0,  // 坤_受容性
        xun_adaptability: 0,   // 巽_適応性
        li_expression: 0,      // 離_表現性
        dui_harmony: 0         // 兌_調和性
    };
    
    // 各質問の回答からスコア集計
    QUESTIONS.forEach(question => {
        const answer = this.answers[question.id];
        if (answer) {
            const option = question.options.find(opt => opt.value === answer);
            if (option && option.scoring) {
                Object.entries(option.scoring).forEach(([dimension, score]) => {
                    scores[dimension] += score;
                });
            }
        }
    });
    
    return scores;
}
```

### 1.2 Triple OS判定エンジン
```javascript
// Engine OS: 最高スコア2つで決定
calculateEngineOS() {
    const scores = this.calculateScores();
    const sortedDimensions = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    
    const upperDimension = sortedDimensions[0][0];  // 1位
    const lowerDimension = sortedDimensions[1][0];  // 2位
    
    const upperTrigram = this.getTrigramFromDimension(upperDimension);
    const lowerTrigram = this.getTrigramFromDimension(lowerDimension);
    const hexagram = this.getHexagramFromTrigrams(upperTrigram, lowerTrigram);
    
    return {
        hexagramId: hexagram.id,
        hexagramName: hexagram.name,
        upperTrigram, lowerTrigram,
        primaryDimension: upperDimension,
        secondaryDimension: lowerDimension,
        score: sortedDimensions[0][1]
    };
}

// Interface OS: 3-4番目のスコアで決定
calculateInterfaceOS() {
    const scores = this.calculateScores();
    const sortedDimensions = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    
    const upperDimension = sortedDimensions[2][0];  // 3位
    const lowerDimension = sortedDimensions[3][0];  // 4位
    
    // 同様のhexagram生成ロジック
    return { /* Interface OS結果 */ };
}

// Safe Mode OS: 最低スコア2つで決定
calculateSafeModeOS() {
    // 最低スコア次元を特定してSafe Mode特性を分析
    return { /* Safe Mode OS結果 */ };
}
```

### 1.3 次元→三爻マッピング
```javascript
getTrigramFromDimension(dimension) {
    const trigramMap = {
        qian_creativity: "乾",      // 天
        zhen_action: "震",          // 雷  
        kan_exploration: "坎",      // 水
        gen_stability: "艮",        // 山
        kun_receptiveness: "坤",    // 地
        xun_adaptability: "巽",     // 風
        li_expression: "離",        // 火
        dui_harmony: "兌"           // 沢
    };
    return trigramMap[dimension] || "乾";
}
```

---

# 2️⃣ **HaQei哲学・易経統合システム**

## 2.1 Triple OS定義
```javascript
const TRIPLE_OS = {
    'Engine OS': {
        name: 'Engine OS',
        description: '論理的思考と実行力の中核システム',
        color: '#6366f1',
        trigrams: [1, 4, 6, 7], // 乾、震、坎、艮
        keywords: ['創造性', 'リーダーシップ', '行動力', '探求心', '安定性']
    },
    'Interface OS': {
        name: 'Interface OS', 
        description: 'コミュニケーションと表現の対人システム',
        color: '#8b5cf6',
        trigrams: [2, 3, 5, 8], // 兌、離、巽、坤
        keywords: ['調和性', 'コミュニケーション', '表現力', '適応性', '受容性']
    },
    'Safe Mode OS': {
        name: 'Safe Mode OS',
        description: '安定と調和を重視する保護システム',
        color: '#10b981',
        trigrams: [7, 8, 5, 6], // 艮、坤、巽、坎
        keywords: ['安定性', '受容性', '適応性', '慎重さ', '分析力']
    }
};
```

## 2.2 VirtualPersonaEnhancer
```javascript
class VirtualPersonaEnhancer {
    constructor() {
        this.hexagrams = window.HEXAGRAMS || [];
        this.trigramSymbols = {
            1: "☰", // 乾（天）
            2: "☱", // 兌（沢）
            3: "☲", // 離（火）
            4: "☳", // 震（雷）
            5: "☴", // 巽（風）
            6: "☵", // 坎（水）
            7: "☶", // 艮（山）
            8: "☷"  // 坤（地）
        };
    }
    
    // 64卦からシンボル生成
    getSymbolForHexagram(hexagramId) {
        const hexagram = this.hexagrams.find(h => h.hexagram_id === hexagramId);
        // 卦IDからシンボル変換ロジック
    }
}
```

## 2.3 三爻親和性計算（五行理論）
```javascript
calculateTrigramCompatibility(trigram1, trigram2) {
    // 五行思想に基づく三爻の属性定義
    const trigramElements = {
        "乾": { element: "金", yang: 3, position: "天" },
        "兌": { element: "金", yang: 2, position: "沢" },
        "離": { element: "火", yang: 2, position: "火" },
        "震": { element: "木", yang: 1, position: "雷" },
        "巽": { element: "木", yang: 2, position: "風" },
        "坎": { element: "水", yang: 1, position: "水" },
        "艮": { element: "土", yang: 1, position: "山" },
        "坤": { element: "土", yang: 0, position: "地" }
    };
    
    // 五行相生相克理論
    const elementRelations = {
        "木": { generates: "火", destroys: "土" },
        "火": { generates: "土", destroys: "金" },
        "土": { generates: "金", destroys: "水" },
        "金": { generates: "水", destroys: "木" },
        "水": { generates: "木", destroys: "火" }
    };
    
    // 相性計算ロジック（相生・相克・同一要素）
    let compatibility = 0.5; // 基本値
    
    if (trigram1 === trigram2) {
        compatibility = 1.0; // 同一三爻
    } else if (elementRelations[elem1.element]?.generates === elem2.element) {
        compatibility = 0.8; // 相生関係
    } else if (elementRelations[elem1.element]?.destroys === elem2.element) {
        compatibility = 0.2; // 相克関係
    }
    
    return compatibility;
}
```

---

# 3️⃣ **データベース資産**

## 3.1 64卦データベース（HEXAGRAMS）
```javascript
window.HEXAGRAMS = [
    {
        hexagram_id: 1,
        name_jp: "乾為天",
        reading: "けんいてん",
        catchphrase: "天翔ける龍のような、天性のリーダー",
        upper_trigram_id: 1,
        lower_trigram_id: 1,
        description: "あなたの心の奥底には、天を翔ける龍のような壮大なエネルギーが宿っています。",
        keywords: "創造,リーダーシップ,力"
    },
    // ... 64卦分のデータ（完全実装済み）
];
```

## 3.2 シナリオ設問データ（SCENARIO_QUESTIONS）
```javascript
const SCENARIO_QUESTIONS = [
    {
        id: "q26",
        text: "信頼していた友人が、あなたの知らないところで批判的なことを言っていたことを知ってしまいました。",
        category: { title: "人間関係", description: "信頼関係の危機への対応" },
        options: [
            {
                value: "A",
                text: "直接本人に話して、はっきりさせる",
                scoring: {
                    "li_expression": 3.0,
                    "zhen_action": 2.0,
                    "dui_harmony": -1.5
                }
            }
            // ... 他の選択肢（A-E）
        ]
    }
    // Q26-Q30の5問（完全実装済み）
];
```

## 3.3 スコアリングシステム仕様
```javascript
// 各選択肢のスコア構造
option = {
    value: "A",
    text: "選択肢テキスト",
    scoring: {
        "qian_creativity": 2.5,      // -3.0 ～ +3.0 の範囲
        "zhen_action": 1.0,          // 正値: 強化、負値: 抑制
        "kan_exploration": -0.5      // 多次元同時評価可能
    }
}
```

---

# 4️⃣ **UI・表示システム**

## 4.1 結果表示（4タブ構成）
```javascript
// メイン結果表示
displayResults(engineOS, interfaceOS, safeModeOS) {
    // 分析画面の表示
    document.getElementById('analysis-screen').style.display = 'block';
    document.getElementById('question-screen').style.display = 'none';
    
    // 基本分析（デフォルト表示）
    this.displayBasicAnalysis(engineOS, interfaceOS, safeModeOS);
    
    // タブ切り替えイベント設定
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            this.switchTab(tabName, engineOS, interfaceOS, safeModeOS);
        });
    });
}

// タブ切り替えロジック
switchTab(tabName, engineOS, interfaceOS, safeModeOS) {
    switch(tabName) {
        case 'basic':
            this.displayBasicAnalysis(engineOS, interfaceOS, safeModeOS);
            break;
        case 'synergy':
            this.displaySynergyAnalysis(engineOS, interfaceOS, safeModeOS);
            break;
        case 'transparency':
            this.displayTransparencyLayer(engineOS, interfaceOS, safeModeOS);
            break;
        case 'practical':
            this.displayPracticalGuides(engineOS, interfaceOS, safeModeOS);
            break;
    }
}
```

## 4.2 実践活用ガイド（完全実装済み）
```javascript
displayPracticalGuides(engineOS, interfaceOS, safeModeOS) {
    // 4つのガイドカテゴリを表示
    this.displayDailyPracticalGuide(engineOS, interfaceOS, safeModeOS);
    this.displayRelationshipStrategies(engineOS, interfaceOS, safeModeOS);
    this.displayCareerApplications(engineOS, interfaceOS, safeModeOS);
    this.displayStressManagement(engineOS, interfaceOS, safeModeOS);
}

// 各ガイドの具体的実装
displayDailyPracticalGuide(engineOS, interfaceOS, safeModeOS) {
    // Triple OS特性に基づく毎日の活用法を生成
    const content = `
        <div class="practical-section">
            <h3>📅 毎日の活用ガイド</h3>
            <div class="time-based-guide">
                <div class="morning-guide">🌅 朝のエネルギー活用法</div>
                <div class="work-guide">🏢 仕事での活用法</div>
                <div class="evening-guide">🌙 夜のリセット法</div>
            </div>
        </div>
    `;
    // DOM更新処理
}
```

## 4.3 CSSスタイリング仕様
```css
/* メインカラーパレット */
:root {
    --primary-600: #6366f1;
    --primary-700: #5b52f0;
    --surface-800: #1e293b;
    --surface-700: #334155;
}

/* カード式レイアウト */
.card {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border-radius: 20px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

/* タブシステム */
.tab-button {
    transition: all 0.3s ease;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
}

.tab-button.active {
    background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    color: white;
}
```

---

# 5️⃣ **技術アーキテクチャ**

## データフロー
```
質問回答 → calculateScores() → 8次元スコア
    ↓
8次元スコア → calculateEngineOS/Interface/SafeModeOS() → Triple OS
    ↓
Triple OS → displayResults() → 4タブUI表示
    ↓
64卦DB + HaQei哲学 → 個人分析結果
```

## 依存関係
```javascript
QuizController
├── VirtualPersonaEnhancer
├── HEXAGRAMS (64卦データベース)
├── QUESTIONS (質問データ)
└── UI Display Methods

VirtualPersonaEnhancer
├── HEXAGRAMS
├── 五行理論計算
└── 三爻親和性システム
```

---

# 6️⃣ **保持理由と価値**

## 技術的価値
- **診断ロジック**: 易経理論に基づく精密な心理分析エンジン
- **HaQei統合**: 独自哲学と古典理論の完全融合
- **UI品質**: モダンなデザインと優れたUX
- **データ完全性**: 64卦・8次元の理論的正確性

## ビジネス価値
- **差別化要因**: 他社にない独自の分析手法
- **完成度**: 即座に利用可能な高品質システム
- **拡張性**: 新機能追加に対応可能な設計
- **保守性**: 明確な構造とドキュメント化

---

# 7️⃣ **計画立案への提言**

## 完全保持推奨コンポーネント
1. **QuizController（診断エンジン）**: 100%保持
2. **HaQei哲学システム**: 100%保持  
3. **64卦データベース**: 100%保持
4. **UI・表示系**: 95%保持（軽微調整のみ）
5. **シナリオ設問**: 100%保持

## 再構築必要部分
- **価値観設問（WORLDVIEW_QUESTIONS）**: 30問バランス調整版の新規作成のみ

## 推奨開発方針
**「手術的再構築」**: 90%保持 + 10%新規作成 = 効率的完成