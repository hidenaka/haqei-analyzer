# Future Simulator コンテキスト分類システム 技術仕様書

**作成日**: 2025-07-31  
**対象ファイル**: `public/future_simulator.html`  
**実装範囲**: 2580行〜3150行 (コンテキスト分析・AI推測ロジック)

## 🎯 技術概要

### 現在のシステム構造
```javascript
// 現在の実装 (2580行〜)
function analyzeContextType(text) {
  const personalKeywords = ['私', '自分', '私の', '不安', ...];
  const socialKeywords = ['会社', 'チーム', '組織', ...];
  // 単純な2分類判定
}
```

### 新システム構造
```javascript
// 拡張後の実装
class EnhancedContextAnalyzer {
  // 8分類 + イレギュラー検出 + 動的キーワード生成
}
```

## 📋 詳細技術仕様

### 1. データ構造設計

#### コンテキスト分類定義
```javascript
const ENHANCED_CONTEXT_TYPES = {
  personal: {
    id: 'personal',
    name: '個人的問題',
    priority: 1,
    keywords: {
      primary: ['私', '自分', '私の', '個人的', '自己'],
      secondary: ['不安', '悩み', '感じる', '思う', '心配'],
      emotional: ['困っている', '迷っている', '自信がない', '焦っている']
    },
    patterns: [
      /私は.{0,10}[困悩迷]っ?ている/, 
      /自分.{0,5}[がの].{0,10}[不心焦]/,
      /どうすれば.{0,5}いい[のか]?/
    ],
    weight: 1.0,
    confidence_boost: 0.1
  },
  
  social: {
    id: 'social',
    name: '社会問題',
    priority: 2,
    keywords: {
      primary: ['社会', '政治', '経済', '国', '政府', '制度'],
      secondary: ['環境', '格差', '政策', '法律', '税金', '選挙'],
      crisis: ['危機', '問題', '課題', '改革', '変革', '解決']
    },
    patterns: [
      /[社政経]会.{0,10}[問題課題]/,
      /[国政府].{0,10}[政策法律]/,
      /[環経]境.{0,10}[問題破壊]/
    ],
    weight: 1.2,
    confidence_boost: 0.15
  },

  relationship: {
    id: 'relationship',
    name: '人間関係',
    priority: 1,
    keywords: {
      primary: ['家族', '恋人', '友人', '夫婦', '親子', '兄弟'],
      secondary: ['上司', '部下', '同僚', '先輩', '後輩', '仲間'],
      emotional: ['関係', '付き合い', '距離', '信頼', '愛情', '理解']
    },
    patterns: [
      /[家恋友][族人達].{0,10}[との].{0,10}[関付]/,
      /[上同][司僚].{0,10}[との].{0,10}[問題関係]/
    ],
    weight: 1.1,
    confidence_boost: 0.12
  },

  business: {
    id: 'business',
    name: 'ビジネス',
    priority: 1,
    keywords: {
      primary: ['仕事', '会社', '職場', '業務', 'キャリア'],
      secondary: ['転職', '昇進', '給料', '残業', 'プロジェクト'],
      strategic: ['戦略', '計画', '目標', '成果', '効率', '改善']
    },
    patterns: [
      /[仕職会][事場社].{0,10}[での].{0,10}[問題悩]/,
      /[転昇][職進].{0,10}[について考]/
    ],
    weight: 1.1,
    confidence_boost: 0.12
  },

  philosophical: {
    id: 'philosophical',
    name: '哲学的問題',
    priority: 3,
    keywords: {
      primary: ['人生', '生きる', '存在', '意味', '価値'],
      secondary: ['幸せ', '成功', '目的', '真理', '正義'],
      abstract: ['本質', '理念', '思想', '哲学', '宗教']
    },
    patterns: [
      /人生.{0,10}[の意味価値]/,
      /生きる.{0,10}[意味目的]/,
      /[何なぜ].{0,10}[のため存在]/
    ],
    weight: 1.3,
    confidence_boost: 0.2
  },

  technical: {
    id: 'technical',
    name: '技術的問題',
    priority: 2,
    keywords: {
      primary: ['技術', 'システム', '開発', '設計', '実装'],
      secondary: ['プログラム', 'データ', 'アルゴリズム', 'API'],
      academic: ['研究', '理論', '分析', '実験', '検証']
    },
    patterns: [
      /[技シ][術ステム].{0,10}[的な問題]/,
      /[開実][発装].{0,10}[について]/
    ],
    weight: 1.0,
    confidence_boost: 0.08
  },

  temporal: {
    id: 'temporal',
    name: '時間軸問題',
    priority: 2,
    keywords: {
      primary: ['将来', '未来', '過去', '今後', 'これから'],
      secondary: ['以前', '昔', '前', '後', '先'],
      temporal: ['時間', '期間', '長期', '短期', '永続']
    },
    patterns: [
      /[将未来来].{0,10}[について]/,
      /[過昔].{0,10}[のこと]/,
      /[今これ][後から].{0,10}[どう]/
    ],
    weight: 0.9,
    confidence_boost: 0.05
  },

  hybrid: {
    id: 'hybrid',
    name: '複合問題',
    priority: 4,
    keywords: {
      primary: [], // 複合判定のため基本キーワードなし
      secondary: [],
      patterns: [] // パターンマッチングで判定
    },
    weight: 1.0,
    confidence_boost: 0.0
  }
};
```

### 2. イレギュラー検出システム

#### 検出器設計
```javascript
class IrregularPatternDetector {
  constructor() {
    this.patterns = {
      emotional_extreme: {
        too_emotional_positive: {
          pattern: /[！]{2,}|[？]{2,}|[最超].{0,5}[高良好]/g,
          weight: -0.1,
          message: '感情表現が強すぎる可能性があります'
        },
        too_emotional_negative: {
          pattern: /[死殺絶最].{0,5}[対悪険]/g,
          weight: -0.15,
          message: '極端な表現が含まれています'
        },
        too_cold: {
          pattern: /^[。、]*[である|だ|です|ます。、]*$/,
          weight: -0.05,
          message: '感情的ニュアンスが少ない可能性があります'
        }
      },

      language_patterns: {
        too_short: {
          condition: (text) => text.length < 10,
          weight: -0.2,
          message: '入力が短すぎます。詳細を追加すると精度が向上します'
        },
        too_long: {
          condition: (text) => text.length > 1000,
          weight: -0.1,
          message: '入力が長すぎます。要点を絞ると精度が向上します'
        },
        dialect_heavy: {
          pattern: /[だっ][べぺ]|やん|やね|だに|じゃけん/g,
          weight: -0.05,
          message: '方言が多く含まれています'
        },
        slang_heavy: {
          pattern: /やばい|まじ|うざい|きもい|むかつく/g,
          weight: -0.05,
          message: '俗語が多く含まれています'
        }
      },

      content_patterns: {
        too_abstract: {
          condition: (text) => {
            const abstractWords = ['存在', '本質', '真理', '意味', '価値', '理念'];
            const concreteWords = ['会社', '家', '人', '時間', 'お金', '仕事'];
            const abstractCount = abstractWords.filter(w => text.includes(w)).length;
            const concreteCount = concreteWords.filter(w => text.includes(w)).length;
            return abstractCount > 2 && concreteCount === 0;
          },
          weight: -0.1,
          message: '抽象的すぎます。具体例を追加すると精度が向上します'
        },
        too_concrete: {
          condition: (text) => {
            const properNouns = text.match(/[A-Z][a-z]+|[一-龯]{3,}/g) || [];
            return properNouns.length > text.length / 15;
          },
          weight: -0.08,
          message: '固有名詞が多すぎます。一般化すると精度が向上します'
        },
        time_unclear: {
          pattern: /いつも|よく|たまに|時々|.{0,5}[時期頃ころ]/g,
          weight: -0.03,
          message: '時間的な文脈が曖昧です'
        }
      }
    };
  }

  detect(text) {
    const flags = {
      emotional: [],
      language: [],
      content: [],
      total_weight_adjustment: 0,
      messages: []
    };

    // 感情パターン検出
    Object.entries(this.patterns.emotional_extreme).forEach(([key, pattern]) => {
      if (pattern.pattern && pattern.pattern.test(text)) {
        flags.emotional.push(key);
        flags.total_weight_adjustment += pattern.weight;
        flags.messages.push(pattern.message);
      }
    });

    // 言語パターン検出
    Object.entries(this.patterns.language_patterns).forEach(([key, pattern]) => {
      const detected = pattern.condition ? 
        pattern.condition(text) : 
        (pattern.pattern && pattern.pattern.test(text));
      
      if (detected) {
        flags.language.push(key);
        flags.total_weight_adjustment += pattern.weight;
        flags.messages.push(pattern.message);
      }
    });

    // 内容パターン検出
    Object.entries(this.patterns.content_patterns).forEach(([key, pattern]) => {
      const detected = pattern.condition ? 
        pattern.condition(text) : 
        (pattern.pattern && pattern.pattern.test(text));
      
      if (detected) {
        flags.content.push(key);
        flags.total_weight_adjustment += pattern.weight;
        flags.messages.push(pattern.message);
      }
    });

    return flags;
  }
}
```

### 3. パフォーマンス最適化

#### メモリ効率化
```javascript
class OptimizedContextAnalyzer {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    
    // キャッシュシステム
    this.keywordCache = new Map();
    this.analysisCache = new Map();
    this.maxCacheSize = 1000;
    
    // プリコンパイル正規表現
    this.precompiledPatterns = this.compilePatterns();
  }

  compilePatterns() {
    const compiled = {};
    Object.entries(ENHANCED_CONTEXT_TYPES).forEach(([type, config]) => {
      if (config.patterns) {
        compiled[type] = config.patterns.map(pattern => 
          typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern
        );
      }
    });
    return compiled;
  }

  // LRUキャッシュ実装
  getFromCache(key, generator) {
    if (this.keywordCache.has(key)) {
      const value = this.keywordCache.get(key);
      this.keywordCache.delete(key);
      this.keywordCache.set(key, value); // 最近使用されたものを末尾に
      return value;
    }

    const value = generator();
    
    if (this.keywordCache.size >= this.maxCacheSize) {
      const firstKey = this.keywordCache.keys().next().value;
      this.keywordCache.delete(firstKey);
    }
    
    this.keywordCache.set(key, value);
    return value;
  }
}
```

## 🔧 実装統合手順

### Step 1: 既存関数の置き換え
```javascript
// 置き換え対象: analyzeContextType() (2580行〜)
// 新実装: EnhancedContextAnalyzer.classifyContext()

// 置き換え対象: localAnalysis() (3040行〜)  
// 新実装: EnhancedContextAnalyzer.performEnhancedAnalysis()
```

### Step 2: データ統合
```javascript
// 既存のH384_DATA、futureThemeMapとの統合
// 新しいコンテキスト情報の追加
```

### Step 3: UI統合
```javascript
// showContextConfirmModal()の拡張
// 8分類対応とイレギュラー警告表示
```

## 📊 テスト仕様

### 単体テスト
```javascript
const testCases = [
  {
    input: "会社での人間関係に悩んでいます",
    expected: { primary: 'relationship', secondary: ['business'] }
  },
  {
    input: "社会の格差問題について考えています", 
    expected: { primary: 'social', confidence: 0.9 }
  },
  {
    input: "人生の意味がわからない",
    expected: { primary: 'philosophical', confidence: 0.85 }
  }
];
```

### パフォーマンステスト
- 1000文字入力: 3秒以内
- 10文字入力: 1秒以内  
- メモリ使用量: 50MB以内

---

**実装注意事項**:
1. 既存機能の互換性を保持
2. 段階的実装でデグレードを防止
3. パフォーマンス監視を継続
4. ユーザーフィードバックに基づく調整