# Future Simulator 状況卦出力精度向上 実装計画書

**作成日**: 2025-07-31  
**プロジェクト**: HAQEI Analyzer Future Simulator  
**担当**: Claude Code Assistant  
**目的**: 状況卦推測精度を60-70%から85-95%へ向上、イレギュラーケース対応強化

## 🎯 概要

### 現状の問題点
- **限定的コンテキスト分類**: personal/socialの2分類のみ
- **固定キーワード依存**: 動的な語彙拡張なし
- **イレギュラー対応不足**: 社会問題、哲学的問題、専門用語等に未対応
- **精度不足**: 60-70%の推測精度

### 改善目標
- **8分類コンテキストシステム**: 包括的な問題領域対応
- **動的キーワード生成**: 語幹解析・関連語展開
- **イレギュラー検出**: 99%のケースで適切な分析
- **精度向上**: 85-95%の推測精度達成

## 📋 実装詳細仕様

### Phase 1: コンテキスト分類システム拡張

#### 新しい8分類システム
```javascript
const CONTEXT_TYPES = {
  personal: {
    name: '個人的問題',
    keywords: ['私', '自分', '不安', '悩み', '感じる', '思う', '心配', '困っている'],
    weight: 1.0,
    description: '個人の内面・感情・価値観に関する問題'
  },
  social: {
    name: '社会問題',
    keywords: ['社会', '政治', '経済', '環境', '格差', '制度', '政策', '国', '地域'],
    weight: 1.2,
    description: '社会問題・政治・経済・環境問題'
  },
  relationship: {
    name: '人間関係',
    keywords: ['家族', '恋人', '友人', '上司', '部下', '同僚', '関係', '人付き合い'],
    weight: 1.1,
    description: '人間関係・家族・恋愛・友人関係'
  },
  business: {
    name: 'ビジネス',
    keywords: ['仕事', '会社', 'キャリア', '転職', '昇進', '業務', 'プロジェクト', '組織'],
    weight: 1.1,
    description: '仕事・キャリア・組織・経営問題'
  },
  philosophical: {
    name: '哲学的問題',
    keywords: ['人生', '意味', '価値', '存在', '生きる', '死', '幸せ', '正義', '真理'],
    weight: 1.3,
    description: '人生観・価値観・存在意義・哲学的問題'
  },
  technical: {
    name: '技術的問題',
    keywords: ['技術', '専門', '研究', '開発', '実装', '設計', 'システム', '理論'],
    weight: 1.0,
    description: '技術的問題・専門領域・学術的課題'
  },
  temporal: {
    name: '時間軸問題',
    keywords: ['将来', '過去', '今後', '以前', 'これから', '昔', '未来', '歴史'],
    weight: 0.9,
    description: '時間軸が曖昧・過去/現在/未来の複合問題'
  },
  hybrid: {
    name: '複合問題',
    keywords: [], // 他の分類で閾値を超えない場合の最終分類
    weight: 1.0,
    description: '複数領域にまたがる複合的問題'
  }
};
```

#### 拡張キーワードシステム
```javascript
const EXTENDED_KEYWORDS = {
  social_detailed: {
    politics: ['選挙', '政策', '国政', '地方政治', '政党', '民主主義', '独裁', '法律'],
    economy: ['インフレ', 'デフレ', '景気', '格差', '雇用', '失業', '賃金', '税金'],
    environment: ['気候変動', '温暖化', '持続可能性', 'エネルギー', '汚染', '生態系'],
    society: ['少子高齢化', '格差社会', 'ダイバーシティ', '教育', '医療', '福祉']
  },
  emotional_gradation: {
    anxiety: ['不安', '心配', '焦り', '恐れ', '危惧', 'びくびく', 'ドキドキ'],
    sadness: ['悲しい', '辛い', '苦しい', '落ち込む', '憂鬱', 'しんどい'],
    anger: ['怒り', 'イライラ', '腹立つ', 'ムカつく', '憤り', '激怒'],
    joy: ['嬉しい', '楽しい', '幸せ', '満足', '充実', 'ワクワク']
  }
};
```

### Phase 2: イレギュラー検出システム

#### 検出パターン
```javascript
const IRREGULAR_PATTERNS = {
  emotion_extreme: {
    too_emotional: (text) => {
      const emotionalWords = ['！！', '？？', '絶対', '必ず', '死ぬ', '殺す'];
      return emotionalWords.filter(word => text.includes(word)).length > 2;
    },
    too_cold: (text) => {
      const coldPatterns = /^[。、]*[である|だ|です|ます]+[。、]*$/;
      return text.length > 50 && coldPatterns.test(text);
    }
  },
  language_patterns: {
    too_short: (text) => text.length < 10,
    too_long: (text) => text.length > 1000,
    dialect_heavy: (text) => {
      const dialectWords = ['だべ', 'やん', 'やね', 'だっぺ', 'だに'];
      return dialectWords.filter(word => text.includes(word)).length > 1;
    },
    technical_heavy: (text) => {
      const techWords = ['API', 'システム', 'アルゴリズム', 'データベース'];
      return techWords.filter(word => text.includes(word)).length > 3;
    }
  },
  content_patterns: {
    too_abstract: (text) => {
      const abstractWords = ['存在', '本質', '真理', '意味', '価値'];
      const concreteWords = ['会社', '家', '人', '時間', 'お金'];
      return abstractWords.filter(w => text.includes(w)).length > 2 &&
             concreteWords.filter(w => text.includes(w)).length === 0;
    },
    too_concrete: (text) => {
      const properNouns = text.match(/[A-Z][a-z]+|[一-龯]{2,}/g) || [];
      return properNouns.length > text.length / 20;
    }
  }
};
```

### Phase 3: 動的キーワード生成システム

#### 語幹解析システム
```javascript
class DynamicKeywordGenerator {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    this.stemCache = new Map();
  }

  generateRelatedWords(keyword) {
    if (this.stemCache.has(keyword)) {
      return this.stemCache.get(keyword);
    }

    const tokens = this.tokenizer.tokenize(keyword);
    const relatedWords = [];
    
    tokens.forEach(token => {
      // 語幹から派生語を生成
      const stem = token.basic_form;
      const variations = this.generateVariations(stem, token.pos);
      relatedWords.push(...variations);
    });

    this.stemCache.set(keyword, relatedWords);
    return relatedWords;
  }

  generateVariations(stem, pos) {
    const variations = [stem];
    
    switch (pos) {
      case '名詞':
        variations.push(stem + 'の', stem + 'に', stem + 'を', stem + 'が');
        break;
      case '動詞':
        variations.push(stem + 'る', stem + 'た', stem + 'て', stem + 'ない');
        break;
      case '形容詞':
        variations.push(stem + 'い', stem + 'く', stem + 'な');
        break;
    }
    
    return variations;
  }
}
```

### Phase 4: 統合判定エンジン

#### 多層判定システム
```javascript
class EnhancedContextAnalyzer {
  constructor(kuromojiTokenizer) {
    this.tokenizer = kuromojiTokenizer;
    this.keywordGenerator = new DynamicKeywordGenerator(kuromojiTokenizer);
    this.irregularDetector = new IrregularPatternDetector();
  }

  async performEnhancedAnalysis(inputText, h384Data, futureThemeMap) {
    // Layer 1: 基本コンテキスト分類
    const contextClassification = this.classifyContext(inputText);
    
    // Layer 2: イレギュラー検出
    const irregularFlags = this.irregularDetector.detect(inputText);
    
    // Layer 3: 文脈深度分析
    const contextDepth = this.analyzeContextDepth(inputText);
    
    // Layer 4: 最適卦選定
    const bestMatch = await this.findBestMatch(
      inputText, h384Data, futureThemeMap, 
      contextClassification, irregularFlags, contextDepth
    );

    return {
      hexagram: bestMatch.hexagram,
      line: bestMatch.line,
      confidence: bestMatch.confidence,
      reasoning: this.generateReasoning(bestMatch, contextClassification, irregularFlags),
      alternatives: bestMatch.alternatives,
      contextType: contextClassification.primary,
      irregularFlags: irregularFlags,
      inputAdvice: this.generateInputAdvice(irregularFlags)
    };
  }
}
```

## 🚀 実装チェックリスト

### Phase 1: 基盤システム ✅
- [ ] 8分類コンテキストシステム実装
- [ ] 拡張キーワードデータベース作成
- [ ] 基本分類ロジック実装

### Phase 2: 検出システム 🔄
- [ ] イレギュラーパターン検出器実装
- [ ] 感情極端パターン検出
- [ ] 言語パターン異常検出

### Phase 3: 生成システム 🔄
- [ ] 動的キーワード生成器実装
- [ ] 語幹解析システム統合
- [ ] キャッシュシステム実装

### Phase 4: 統合システム 🔄
- [ ] 多層判定エンジン実装
- [ ] スコアリング統合システム
- [ ] 代替候補生成システム

### Phase 5: UX改善 ⏳
- [ ] 推測根拠詳細表示
- [ ] 入力改善提案機能
- [ ] リアルタイム候補表示

## 📊 品質指標

### パフォーマンス要件
- **応答時間**: 3秒以内
- **メモリ使用量**: 50MB以内
- **CPU使用率**: 30%以内

### 精度指標
- **基本ケース**: 95%以上
- **イレギュラーケース**: 85%以上
- **全体平均**: 90%以上

### 安定性指標
- **エラー率**: 1%以下
- **フォールバック成功率**: 99%以上
- **システム可用性**: 99.9%以上

## 🔧 IDE処理落ち対策

### 作業継続のための必須情報
1. **現在実装中のファイル**: `public/future_simulator.html`
2. **主要関数**: `analyzeContextType()`, `callAIAssistant()`, `localAnalysis()`
3. **データ構造**: `CONTEXT_TYPES`, `EXTENDED_KEYWORDS`, `IRREGULAR_PATTERNS`
4. **統合ポイント**: 2580行周辺のコンテキスト分析、3040行周辺のローカル分析

### 作業再開手順
1. Cipherサーバー起動確認: `node cipher-server.js`
2. Future Simulator専用環境確認: `./portable-future-simulator.sh`
3. 現在のTodoList確認
4. 最新のGitコミットから作業継続

### バックアップファイル
- **実装前状態**: Git commit 作業開始前
- **段階的保存**: 各Phase完了時にコミット
- **設定ファイル**: `.claude/` ディレクトリ

---

**重要**: この計画書はIDE処理落ち時の作業再開用として詳細に記載。実装時は段階的に進め、各Phaseでテストと検証を実施する。