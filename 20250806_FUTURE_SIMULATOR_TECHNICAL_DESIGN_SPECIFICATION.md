# Future Simulator 技術設計仕様書

**作成日**: 2025年8月6日  
**担当**: Requirements Analyst Agent (HAQEI)  
**バージョン**: 1.0.0  
**対象システム**: Future Simulator Complete Recovery

---

## 🏗️ システム設計概要

### アーキテクチャパターン
- **設計方針**: Waterfall approach with Critical Path optimization
- **実装戦略**: Fail-fast recovery + Progressive enhancement
- **品質保証**: Multi-layer validation + Error boundary isolation

### コンポーネント階層
```
Future Simulator System
├── Core Infrastructure Layer
│   ├── H384_DATABASE (Singleton, Conflict Resolution)
│   ├── Error Handler (Global, Graceful Degradation)  
│   └── Performance Monitor (Real-time, Threshold-Based)
├── UI Presentation Layer
│   ├── Input Form Controller (Always-visible, Responsive)
│   ├── Results Display Manager (Dynamic, Template-Based)
│   └── Enhancement Engine (Progressive, Optional)
└── Business Logic Layer
    ├── AI Analysis Engine (NLP-based, I Ching-integrated)
    ├── Scenario Generator (Template-driven, Context-aware)
    └── Data Export Manager (Multi-format, Secure)
```

---

## 🔧 詳細技術仕様

### 1. UI表示修正設計

#### 1.1 入力フォーム常時表示化
**問題**: `input-content` divが `display: none` で初期非表示
**解決策**: Multi-layered approach

```javascript
// Method 1: Direct CSS Override (Primary)
.input-content {
  display: block !important;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

// Method 2: JavaScript Failsafe (Secondary)  
class InputVisibilityController {
  constructor() {
    this.checkInterval = null;
    this.maxRetries = 10;
    this.retryCount = 0;
  }
  
  ensureInputVisibility() {
    const inputContent = document.getElementById('input-content');
    if (inputContent) {
      // Force display regardless of current state
      inputContent.style.display = 'block';
      inputContent.style.opacity = '1';
      inputContent.style.visibility = 'visible';
      
      console.log('✅ Input form visibility ensured');
      return true;
    }
    
    // Retry mechanism
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.ensureInputVisibility(), 100);
    }
    return false;
  }
}
```

#### 1.2 Progressive Content Load Override
**問題**: 非同期ローディングがUI表示を阻害
**解決策**: Synchronous fallback system

```javascript
class ProgressiveContentController {
  constructor() {
    this.forceMode = false;
    this.loadTimeout = 3000; // 3秒タイムアウト
  }
  
  initializeWithFallback() {
    // Try progressive loading
    const progressivePromise = this.startProgressiveContentLoad();
    
    // Failsafe timer
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        console.warn('⚠️ Progressive loading timeout - forcing display');
        this.forceDisplayAll();
        resolve('timeout');
      }, this.loadTimeout);
    });
    
    return Promise.race([progressivePromise, timeoutPromise]);
  }
  
  forceDisplayAll() {
    this.forceMode = true;
    const elements = [
      'input-content',
      'worryInput', 
      'aiGuessBtn'
    ];
    
    elements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = element.tagName === 'TEXTAREA' ? 'block' : 'block';
        element.style.opacity = '1';
        element.classList.remove('hidden');
      }
    });
  }
}
```

### 2. H384_DATABASE重複解決設計

#### 2.1 Wrapper Pattern Implementation
**問題**: 2つのファイルで同一クラス宣言
**解決策**: Compatibility wrapper with namespace isolation

```javascript
// h384-compatibility-wrapper.js の完全再設計
(function() {
  'use strict';
  
  // Namespace pollution prevention
  const HAQEI_NAMESPACE = window.HAQEI_NAMESPACE || {};
  
  // Check if H384_DATABASE already exists
  if (window.H384_DATABASE) {
    console.log('🔄 H384_DATABASE already exists - creating compatibility layer');
    
    // Create compatibility proxy
    class H384DatabaseProxy {
      constructor() {
        this.originalInstance = new window.H384_DATABASE();
        this.proxyVersion = '1.0.1-compatibility';
        this.namespace = 'FUTURE_SIMULATOR';
      }
      
      // Proxy all methods to original instance
      initialize(...args) {
        return this.originalInstance.initialize(...args);
      }
      
      getHexagramData(...args) {
        return this.originalInstance.getHexagramData(...args);
      }
      
      // Add future simulator specific methods
      getFutureScenarioData(hexagramId) {
        const baseData = this.originalInstance.getHexagramData(hexagramId);
        return this.enhanceForFutureSimulator(baseData);
      }
      
      enhanceForFutureSimulator(data) {
        return {
          ...data,
          futureScenarios: this.generateScenarioTemplates(data),
          emotionalContext: this.extractEmotionalContext(data),
          actionSuggestions: this.generateActionSuggestions(data)
        };
      }
    }
    
    // Replace with proxy for Future Simulator
    HAQEI_NAMESPACE.H384_DATABASE_FUTURE = H384DatabaseProxy;
  } else {
    console.log('📦 H384_DATABASE not found - will be loaded from core');
    // Original will be loaded normally
  }
  
  window.HAQEI_NAMESPACE = HAQEI_NAMESPACE;
})();
```

#### 2.2 Loading Order Optimization
**問題**: スクリプト読み込み順序による競合
**解決策**: Dependency injection pattern

```html
<!-- Optimized loading order -->
<script>
  // Pre-loading conflict resolution
  window.HAQEI_LOADING_ORDER = {
    stage: 'pre-core',
    conflicts: [],
    resolution: 'proxy-pattern'
  };
</script>

<!-- Core system first -->
<script src="./js/core/H384_DATABASE.js" defer></script>

<!-- Compatibility layer second -->
<script src="./js/h384-compatibility-wrapper.js" defer></script>

<!-- Future simulator specific last -->
<script src="./js/future-simulator-ui-enhancements.js" defer></script>
```

### 3. AI分析処理実装設計

#### 3.1 テキスト分析エンジン
**要求**: 入力テキストから意味のある分析結果を生成
**実装**: Multi-stage analysis pipeline

```javascript
class AIAnalysisEngine {
  constructor() {
    this.sentimentAnalyzer = new SimpleSentimentAnalyzer();
    this.keywordExtractor = new KeywordExtractor();
    this.iChingMapper = new IChingHexagramMapper();
    this.scenarioGenerator = new ScenarioGenerator();
  }
  
  async performComprehensiveAnalysis(inputText) {
    console.log('🔍 Starting comprehensive analysis...');
    
    // Stage 1: Text preprocessing
    const cleanText = this.preprocessText(inputText);
    
    // Stage 2: Emotional analysis
    const emotionData = await this.sentimentAnalyzer.analyze(cleanText);
    
    // Stage 3: Keyword extraction
    const keywords = this.keywordExtractor.extract(cleanText);
    
    // Stage 4: I Ching mapping
    const hexagram = this.iChingMapper.mapToHexagram(emotionData, keywords);
    
    // Stage 5: Scenario generation
    const scenarios = await this.scenarioGenerator.generate({
      text: cleanText,
      emotion: emotionData,
      keywords: keywords,
      hexagram: hexagram
    });
    
    return {
      originalText: inputText,
      cleanText: cleanText,
      emotion: emotionData,
      keywords: keywords,
      hexagram: hexagram,
      scenarios: scenarios,
      analysisTimestamp: new Date().toISOString(),
      confidence: this.calculateConfidence(emotionData, keywords)
    };
  }
  
  preprocessText(text) {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
      .toLowerCase();
  }
  
  calculateConfidence(emotionData, keywords) {
    const emotionConfidence = emotionData.confidence || 0.5;
    const keywordQuality = keywords.length > 0 ? Math.min(keywords.length / 5, 1) : 0.3;
    return (emotionConfidence + keywordQuality) / 2;
  }
}
```

#### 3.2 シンプル感情分析
**技術**: Rule-based approach with Japanese support

```javascript
class SimpleSentimentAnalyzer {
  constructor() {
    this.positiveWords = [
      '嬉しい', '楽しい', '幸せ', '良い', '素晴らしい', '最高', '成功',
      'happy', 'good', 'great', 'excellent', 'amazing', 'wonderful'
    ];
    
    this.negativeWords = [
      '悲しい', '辛い', '困る', '不安', '心配', '問題', '失敗',
      'sad', 'bad', 'terrible', 'awful', 'worried', 'anxious', 'problem'
    ];
    
    this.neutralWords = [
      '普通', '一般的', '標準', '通常', '平均', '中間',
      'normal', 'average', 'standard', 'typical', 'usual'
    ];
  }
  
  analyze(text) {
    const words = text.split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    
    words.forEach(word => {
      if (this.positiveWords.some(pw => word.includes(pw))) {
        positiveScore++;
      } else if (this.negativeWords.some(nw => word.includes(nw))) {
        negativeScore++;
      } else if (this.neutralWords.some(neutw => word.includes(neutw))) {
        neutralScore++;
      }
    });
    
    const total = positiveScore + negativeScore + neutralScore;
    const confidence = total > 0 ? total / words.length : 0.5;
    
    // Determine primary emotion
    let primaryEmotion;
    let score;
    
    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      primaryEmotion = 'positive';
      score = positiveScore / (total || 1);
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      primaryEmotion = 'negative'; 
      score = negativeScore / (total || 1);
    } else {
      primaryEmotion = 'neutral';
      score = 0.5;
    }
    
    return {
      primaryEmotion: primaryEmotion,
      score: score,
      confidence: confidence,
      breakdown: {
        positive: positiveScore,
        negative: negativeScore,
        neutral: neutralScore
      }
    };
  }
}
```

### 4. 8つのシナリオ生成設計

#### 4.1 シナリオテンプレートシステム
**要求**: 入力内容に応じた動的シナリオ生成
**実装**: Template-based generation with context awareness

```javascript
class ScenarioGenerator {
  constructor() {
    this.templates = {
      positive: {
        immediate: [
          '{keyword}を活かした即座の成功への道筋が見えてきます',
          '{keyword}に関連する新しい機会が今日中に現れる可能性があります',
          '{keyword}を中心とした前向きな変化が始まろうとしています'
        ],
        shortTerm: [
          '1-2週間以内に{keyword}分野で具体的な進展が期待できます',
          '{keyword}への取り組みが周囲の評価を高める結果を生むでしょう'
        ],
        longTerm: [
          '{keyword}を基盤とした長期的な成功パターンが構築されます',
          '1年後、{keyword}があなたの人生の重要な柱となっているでしょう'
        ]
      },
      
      negative: {
        warning: [
          '{keyword}に関して注意すべき状況が近づいています',
          '{keyword}の扱い方を見直す必要があります'
        ],
        challenge: [
          '{keyword}をめぐる困難な選択を迫られる可能性があります',
          '{keyword}に対する新しいアプローチが求められるでしょう'
        ]
      },
      
      neutral: {
        balance: [
          '{keyword}について冷静な判断が必要な時期です',
          '{keyword}に関する現実的な評価と対策を立てる時です'
        ],
        transition: [
          '{keyword}を中心とした生活の変化期に入ります',
          '{keyword}への新しい視点が求められています'
        ]
      }
    };
  }
  
  async generate(analysisData) {
    const { emotion, keywords, hexagram } = analysisData;
    const primaryKeyword = keywords[0] || '状況';
    
    // Generate 8 scenarios based on I Ching structure
    const scenarios = [];
    
    // 4 primary scenarios based on emotion
    if (emotion.primaryEmotion === 'positive') {
      scenarios.push(...this.generateFromTemplates('positive', primaryKeyword, 4));
    } else if (emotion.primaryEmotion === 'negative') {
      scenarios.push(...this.generateFromTemplates('negative', primaryKeyword, 4));
    } else {
      scenarios.push(...this.generateFromTemplates('neutral', primaryKeyword, 4));
    }
    
    // 4 complementary scenarios (opposite perspective)
    const complementaryEmotion = this.getComplementaryEmotion(emotion.primaryEmotion);
    scenarios.push(...this.generateFromTemplates(complementaryEmotion, primaryKeyword, 4));
    
    // Enhance with I Ching wisdom
    return scenarios.map((scenario, index) => ({
      id: `scenario_${index + 1}`,
      title: `未来パターン ${index + 1}`,
      content: scenario,
      hexagramReference: hexagram ? hexagram.number : null,
      probability: this.calculateProbability(emotion, index),
      timeframe: this.determineTimeframe(index),
      actionSuggestion: this.generateActionSuggestion(scenario, keywords)
    }));
  }
  
  generateFromTemplates(emotionType, keyword, count) {
    const templates = this.templates[emotionType];
    const allTemplates = Object.values(templates).flat();
    
    return this.shuffleArray(allTemplates)
      .slice(0, count)
      .map(template => template.replace(/\{keyword\}/g, keyword));
  }
  
  getComplementaryEmotion(primary) {
    const complementMap = {
      'positive': 'negative',
      'negative': 'positive', 
      'neutral': 'neutral'
    };
    return complementMap[primary] || 'neutral';
  }
  
  calculateProbability(emotion, index) {
    const baseProb = 0.6;
    const emotionModifier = emotion.confidence * 0.3;
    const indexModifier = (8 - index) * 0.05; // Earlier scenarios slightly more probable
    
    return Math.min(0.95, Math.max(0.1, baseProb + emotionModifier + indexModifier));
  }
  
  determineTimeframe(index) {
    const timeframes = [
      '今日-明日', '今週中', '1-2週間', '1ヶ月以内',
      '2-3ヶ月', '半年以内', '1年以内', '長期的'
    ];
    return timeframes[index] || '未定';
  }
  
  generateActionSuggestion(scenario, keywords) {
    const actions = [
      '積極的に行動する',
      '慎重に準備を進める', 
      '周囲との相談を重視する',
      '新しい視点を取り入れる',
      '基本に立ち返る',
      '創造的な解決策を探る',
      '忍耐強く待つ',
      'バランスを保つ'
    ];
    
    return actions[Math.floor(Math.random() * actions.length)];
  }
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
```

### 5. イベントハンドラー設計

#### 5.1 選択カードクリック処理
**要求**: カード選択時の動的UI更新
**実装**: Event delegation with state management

```javascript
class ScenarioCardController {
  constructor() {
    this.selectedCards = new Set();
    this.cardStates = new Map();
    this.selectionLimit = 3; // 最大3つまで選択可能
  }
  
  initializeEventListeners() {
    // Event delegation for dynamic card elements
    document.addEventListener('click', (event) => {
      if (event.target.matches('.scenario-card, .scenario-card *')) {
        const card = event.target.closest('.scenario-card');
        if (card) {
          this.handleCardClick(card, event);
        }
      }
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const focusedCard = document.activeElement.closest('.scenario-card');
        if (focusedCard) {
          event.preventDefault();
          this.handleCardClick(focusedCard, event);
        }
      }
    });
  }
  
  handleCardClick(card, event) {
    const cardId = card.dataset.scenarioId;
    
    if (this.selectedCards.has(cardId)) {
      // Deselect card
      this.deselectCard(card, cardId);
    } else {
      // Select card (if under limit)
      if (this.selectedCards.size < this.selectionLimit) {
        this.selectCard(card, cardId);
      } else {
        this.showSelectionLimitMessage();
      }
    }
    
    this.updateSelectionUI();
    this.triggerAnalytics('card_interaction', { cardId, selected: this.selectedCards.has(cardId) });
  }
  
  selectCard(card, cardId) {
    this.selectedCards.add(cardId);
    card.classList.add('selected');
    card.classList.add('animate-selection');
    card.setAttribute('aria-selected', 'true');
    
    // Visual feedback
    this.addSelectionEffects(card);
    
    // Store selection timestamp
    this.cardStates.set(cardId, {
      selectedAt: new Date().toISOString(),
      element: card
    });
    
    console.log(`✅ Card selected: ${cardId}`);
  }
  
  deselectCard(card, cardId) {
    this.selectedCards.delete(cardId);
    card.classList.remove('selected');
    card.classList.remove('animate-selection');
    card.setAttribute('aria-selected', 'false');
    
    // Remove visual effects
    this.removeSelectionEffects(card);
    
    this.cardStates.delete(cardId);
    
    console.log(`❌ Card deselected: ${cardId}`);
  }
  
  addSelectionEffects(card) {
    // Add glow effect
    card.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
    card.style.borderColor = '#6366f1';
    card.style.transform = 'scale(1.02)';
    
    // Add checkmark icon
    const checkmark = document.createElement('div');
    checkmark.className = 'selection-checkmark';
    checkmark.innerHTML = '✓';
    checkmark.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    `;
    card.appendChild(checkmark);
  }
  
  removeSelectionEffects(card) {
    card.style.boxShadow = '';
    card.style.borderColor = '';
    card.style.transform = '';
    
    const checkmark = card.querySelector('.selection-checkmark');
    if (checkmark) {
      checkmark.remove();
    }
  }
  
  updateSelectionUI() {
    // Update selection counter
    const counter = document.getElementById('selection-counter');
    if (counter) {
      counter.textContent = `選択中: ${this.selectedCards.size}/${this.selectionLimit}`;
    }
    
    // Show/hide export button
    const exportBtn = document.getElementById('export-selection-btn');
    if (exportBtn) {
      exportBtn.style.display = this.selectedCards.size > 0 ? 'block' : 'none';
    }
    
    // Update action suggestions
    this.updateActionSuggestions();
  }
  
  updateActionSuggestions() {
    if (this.selectedCards.size === 0) return;
    
    const suggestions = document.getElementById('action-suggestions');
    if (suggestions) {
      const selectedScenarios = Array.from(this.selectedCards);
      const actionHTML = this.generateActionSuggestions(selectedScenarios);
      suggestions.innerHTML = actionHTML;
      suggestions.classList.remove('hidden');
    }
  }
  
  generateActionSuggestions(selectedCardIds) {
    return `
      <div class="action-suggestions-panel">
        <h3>選択されたシナリオに基づく推奨アクション</h3>
        <ul class="action-list">
          ${selectedCardIds.map(id => `
            <li>シナリオ${id}: ${this.getActionForScenario(id)}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  getActionForScenario(cardId) {
    // Simple action mapping - in production, this would be more sophisticated
    const actions = {
      '1': '積極的な行動を開始する',
      '2': '周囲との協調を重視する',
      '3': '慎重な準備を進める',
      '4': '新しい学習を始める'
    };
    return actions[cardId] || '状況を注意深く観察する';
  }
  
  showSelectionLimitMessage() {
    // Show temporary message
    const message = document.createElement('div');
    message.className = 'selection-limit-message';
    message.textContent = '最大3つまで選択できます';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ef4444;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      animation: fadeInOut 2s ease-in-out;
    `;
    
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }
  
  triggerAnalytics(event, data) {
    // Analytics integration point
    console.log(`📊 Analytics: ${event}`, data);
    
    // In production, send to analytics service
    if (window.gtag) {
      window.gtag('event', event, {
        custom_parameter_1: data.cardId,
        custom_parameter_2: data.selected
      });
    }
  }
  
  getSelectedScenarios() {
    return Array.from(this.selectedCards).map(cardId => {
      const state = this.cardStates.get(cardId);
      return {
        id: cardId,
        selectedAt: state?.selectedAt,
        element: state?.element
      };
    });
  }
}
```

### 6. データエクスポート機能設計

#### 6.1 Multi-format Export System
**要求**: JSON/CSV形式でのデータ出力
**実装**: Client-side generation with privacy protection

```javascript
class DataExportManager {
  constructor() {
    this.exportFormats = ['json', 'csv', 'txt'];
    this.privacyLevel = 'standard'; // 'minimal', 'standard', 'full'
  }
  
  async exportAnalysisResults(analysisData, selectedScenarios, format = 'json') {
    console.log(`📤 Exporting data in ${format} format...`);
    
    // Prepare export data
    const exportData = this.prepareExportData(analysisData, selectedScenarios);
    
    // Apply privacy filters
    const filteredData = this.applyPrivacyFilters(exportData);
    
    // Generate file content
    let fileContent;
    let fileName;
    let mimeType;
    
    switch (format.toLowerCase()) {
      case 'json':
        fileContent = JSON.stringify(filteredData, null, 2);
        fileName = `future_analysis_${this.getTimestamp()}.json`;
        mimeType = 'application/json';
        break;
        
      case 'csv':
        fileContent = this.convertToCSV(filteredData);
        fileName = `future_analysis_${this.getTimestamp()}.csv`;
        mimeType = 'text/csv';
        break;
        
      case 'txt':
        fileContent = this.convertToText(filteredData);
        fileName = `future_analysis_${this.getTimestamp()}.txt`;
        mimeType = 'text/plain';
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    // Generate and download file
    this.downloadFile(fileContent, fileName, mimeType);
    
    // Log export event
    this.logExportEvent(format, filteredData);
    
    return {
      success: true,
      fileName: fileName,
      format: format,
      size: fileContent.length
    };
  }
  
  prepareExportData(analysisData, selectedScenarios) {
    return {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        source: 'HAQEI Future Simulator',
        privacyLevel: this.privacyLevel
      },
      
      inputAnalysis: {
        originalText: analysisData.originalText,
        processedText: analysisData.cleanText,
        textLength: analysisData.originalText.length,
        analysisTimestamp: analysisData.analysisTimestamp
      },
      
      emotionalAnalysis: {
        primaryEmotion: analysisData.emotion.primaryEmotion,
        emotionScore: analysisData.emotion.score,
        confidence: analysisData.emotion.confidence,
        breakdown: analysisData.emotion.breakdown
      },
      
      keywordAnalysis: {
        extractedKeywords: analysisData.keywords,
        keywordCount: analysisData.keywords.length,
        primaryKeyword: analysisData.keywords[0] || null
      },
      
      iChingAnalysis: {
        hexagram: analysisData.hexagram ? {
          number: analysisData.hexagram.number,
          name: analysisData.hexagram.name,
          description: analysisData.hexagram.description
        } : null
      },
      
      futureScenarios: {
        totalGenerated: analysisData.scenarios.length,
        scenarios: analysisData.scenarios.map(scenario => ({
          id: scenario.id,
          title: scenario.title,
          content: scenario.content,
          probability: scenario.probability,
          timeframe: scenario.timeframe,
          actionSuggestion: scenario.actionSuggestion
        }))
      },
      
      userSelections: {
        selectedCount: selectedScenarios.length,
        selections: selectedScenarios.map(selection => ({
          scenarioId: selection.id,
          selectedAt: selection.selectedAt
        }))
      },
      
      recommendations: this.generateRecommendations(analysisData, selectedScenarios)
    };
  }
  
  applyPrivacyFilters(data) {
    const filtered = JSON.parse(JSON.stringify(data)); // Deep clone
    
    switch (this.privacyLevel) {
      case 'minimal':
        // Remove sensitive text content
        filtered.inputAnalysis.originalText = '[REDACTED]';
        filtered.inputAnalysis.processedText = '[REDACTED]';
        break;
        
      case 'standard':
        // Hash sensitive content
        filtered.inputAnalysis.originalText = this.hashText(data.inputAnalysis.originalText);
        filtered.inputAnalysis.processedText = this.hashText(data.inputAnalysis.processedText);
        break;
        
      case 'full':
        // Keep all data
        break;
    }
    
    return filtered;
  }
  
  convertToCSV(data) {
    const rows = [];
    
    // Headers
    rows.push([
      'Category',
      'Metric',
      'Value',
      'Timestamp'
    ]);
    
    // Export metadata
    rows.push(['Metadata', 'Export Time', data.exportMetadata.exportedAt, '']);
    rows.push(['Metadata', 'Version', data.exportMetadata.version, '']);
    
    // Emotional analysis
    rows.push(['Emotion', 'Primary Emotion', data.emotionalAnalysis.primaryEmotion, '']);
    rows.push(['Emotion', 'Score', data.emotionalAnalysis.emotionScore, '']);
    rows.push(['Emotion', 'Confidence', data.emotionalAnalysis.confidence, '']);
    
    // Keywords
    data.keywordAnalysis.extractedKeywords.forEach((keyword, index) => {
      rows.push(['Keyword', `Keyword ${index + 1}`, keyword, '']);
    });
    
    // Scenarios
    data.futureScenarios.scenarios.forEach((scenario, index) => {
      rows.push(['Scenario', `${scenario.title}`, scenario.content, '']);
      rows.push(['Scenario', `${scenario.title} - Probability`, scenario.probability, '']);
      rows.push(['Scenario', `${scenario.title} - Timeframe`, scenario.timeframe, '']);
    });
    
    // User selections
    data.userSelections.selections.forEach((selection, index) => {
      rows.push(['Selection', `Selected Scenario ${index + 1}`, selection.scenarioId, selection.selectedAt]);
    });
    
    // Convert to CSV string
    return rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }
  
  convertToText(data) {
    const sections = [];
    
    sections.push('='.repeat(60));
    sections.push('HAQEI Future Simulator - Analysis Report');
    sections.push('='.repeat(60));
    sections.push('');
    
    sections.push(`Generated: ${data.exportMetadata.exportedAt}`);
    sections.push(`Version: ${data.exportMetadata.version}`);
    sections.push('');
    
    sections.push('EMOTIONAL ANALYSIS');
    sections.push('-'.repeat(30));
    sections.push(`Primary Emotion: ${data.emotionalAnalysis.primaryEmotion}`);
    sections.push(`Emotion Score: ${data.emotionalAnalysis.emotionScore.toFixed(2)}`);
    sections.push(`Confidence: ${data.emotionalAnalysis.confidence.toFixed(2)}`);
    sections.push('');
    
    sections.push('KEYWORDS');
    sections.push('-'.repeat(30));
    data.keywordAnalysis.extractedKeywords.forEach((keyword, index) => {
      sections.push(`${index + 1}. ${keyword}`);
    });
    sections.push('');
    
    sections.push('FUTURE SCENARIOS');
    sections.push('-'.repeat(30));
    data.futureScenarios.scenarios.forEach((scenario, index) => {
      sections.push(`${index + 1}. ${scenario.title}`);
      sections.push(`   Content: ${scenario.content}`);
      sections.push(`   Probability: ${(scenario.probability * 100).toFixed(1)}%`);
      sections.push(`   Timeframe: ${scenario.timeframe}`);
      sections.push(`   Action: ${scenario.actionSuggestion}`);
      sections.push('');
    });
    
    if (data.userSelections.selections.length > 0) {
      sections.push('USER SELECTIONS');
      sections.push('-'.repeat(30));
      data.userSelections.selections.forEach((selection, index) => {
        sections.push(`${index + 1}. Scenario ${selection.scenarioId}`);
        sections.push(`   Selected at: ${selection.selectedAt}`);
      });
      sections.push('');
    }
    
    sections.push('RECOMMENDATIONS');
    sections.push('-'.repeat(30));
    data.recommendations.forEach((rec, index) => {
      sections.push(`${index + 1}. ${rec}`);
    });
    
    return sections.join('\n');
  }
  
  downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  
  generateRecommendations(analysisData, selectedScenarios) {
    const recommendations = [];
    
    // Based on emotional analysis
    if (analysisData.emotion.primaryEmotion === 'negative') {
      recommendations.push('ネガティブな感情を認識し、サポートシステムを活用することを検討してください');
    } else if (analysisData.emotion.primaryEmotion === 'positive') {
      recommendations.push('ポジティブなエネルギーを活かして、新しいチャレンジに挑戦する好機です');
    }
    
    // Based on selections
    if (selectedScenarios.length > 0) {
      recommendations.push(`選択された${selectedScenarios.length}つのシナリオに対して具体的な行動計画を立てることをお勧めします`);
    }
    
    // General wisdom
    recommendations.push('定期的な自己反省と状況の見直しを続けることで、より良い未来を創造できます');
    
    return recommendations;
  }
  
  hashText(text) {
    // Simple hash for privacy (in production, use proper hashing)
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `[HASH:${Math.abs(hash).toString(16)}]`;
  }
  
  getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  }
  
  logExportEvent(format, data) {
    console.log(`📤 Export completed:`, {
      format: format,
      dataSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString()
    });
    
    // Analytics integration
    if (window.gtag) {
      window.gtag('event', 'data_export', {
        export_format: format,
        data_size: JSON.stringify(data).length
      });
    }
  }
}
```

---

## 🎯 統合実装戦略

### Integration Points
1. **HTML修正**: Progressive content load override
2. **JavaScript統合**: All new classes integrated into main Future Simulator
3. **CSS Enhancement**: Selection animations and responsive design
4. **Error Handling**: Comprehensive error boundaries
5. **Performance**: Lazy loading and caching strategies

### Testing Strategy
1. **Unit Tests**: Each class individually tested
2. **Integration Tests**: Component interaction verification
3. **User Acceptance Tests**: Real user scenario validation
4. **Performance Tests**: Load time and responsiveness measurement
5. **Browser Compatibility**: Cross-browser functionality verification

### Deployment Checklist
- [ ] All console errors eliminated
- [ ] UI components fully functional
- [ ] Data export working in all formats
- [ ] Mobile responsiveness verified
- [ ] Accessibility standards met
- [ ] Performance benchmarks achieved

---

**次のステップ**: 実装ガイドラインと品質保証計画の策定