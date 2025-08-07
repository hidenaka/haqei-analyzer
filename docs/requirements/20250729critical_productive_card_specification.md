# 批判的・生産的視点カード リッチテキスト表示仕様書

## 概要

HaQei Analyzerの測定結果に対して、批判的思考と生産的な成長視点を提供するカードコンポーネントの実装仕様書。

### 目的
- 測定結果への盲目的な受容を防ぎ、建設的な批判的思考を促進
- 具体的な成長アクションとシャドウ統合への道筋を提供
- 易経哲学に基づく深い自己洞察の実現

## 1. システム構成

### 1.1 既存システムとの統合ポイント

| コンポーネント | 役割 | 連動データ |
|---|---|---|
| `ShadowAnalyzer.js` | 批判的視点（シャドウ分析） | shadowAspects, selfInquiryQuestions, growthChallenges |
| `CriticalThinkingEngine.js` | 生産的視点（批判的思考支援） | questionTemplates, biasPatterns, actionQuestions |
| `hexagram_details.js` | 動的インサイト | potential_weaknesses, trigger_situations, defensive_patterns |
| `TripleOSResultsView.js` | 結果表示統合 | analysisResult, score連動表示 |

### 1.2 データフロー

```
[測定結果] → [ShadowAnalyzer] → [批判的視点データ]
              ↓
[測定結果] → [CriticalThinkingEngine] → [生産的視点データ]
              ↓
[hexagram_details] → [動的インサイト] → [統合表示]
```

## 2. データ構造仕様

### 2.1 批判的・生産的カードデータ構造

```javascript
const criticalProductiveCardData = {
  // 批判的視点 (ShadowAnalyzer)
  critical: {
    shadowAspects: {
      primary_shadow: "強みの影の具体的説明",
      behavioral_risks: "行動的リスクパターン",
      intensity_level: "高/中/低",
      likelihood: "発現可能性%"
    },
    blindSpotQuestions: [
      {
        type: "blind_spot",
        question: "盲点への気づき質問",
        purpose: "質問の目的説明"
      }
    ],
    growthChallenges: {
      primary_challenge: "主要な成長課題",
      development_areas: ["開発領域1", "開発領域2"],
      recommended_practices: ["推奨実践1", "推奨実践2"]
    }
  },
  
  // 生産的視点 (CriticalThinkingEngine)
  productive: {
    scoreBasedQuestions: [
      {
        category: "identity_fixation|environmental_limits|action_orientation",
        question: "スコア帯別の建設的質問",
        purpose: "質問の意図"
      }
    ],
    practicalSteps: [
      {
        step: 1,
        action: "観察",
        description: "具体的な実践内容"
      }
    ],
    integrationGuidance: {
      shadow_acceptance: "影の受容アプローチ",
      mindset_shift: "思考パターン変換",
      integration_timeline: "統合プロセスの時間軸"
    },
    biasRecognition: {
      common_biases: ["確証バイアス", "自己奉仕バイアス"],
      measurement_limits: "診断ツールの限界認識"
    }
  },
  
  // 動的インサイト (hexagram_details)
  dynamicInsights: {
    engineWeaknesses: ["potential_weaknesses配列"],
    triggerSituations: ["trigger_situations配列"], 
    defensivePatterns: ["defensive_patterns配列"],
    strengthToShadowMapping: "強みから影への変換ロジック"
  }
}
```

### 2.2 スコア帯別表示ロジック

| スコア帯 | 批判的視点 | 生産的視点 |
|---|---|---|
| **高スコア(70%+)** | アイデンティティ固着警告<br>環境限界の認識<br>シャドウ探求促進 | 他特性開発の推奨<br>柔軟性獲得プラン<br>統合的アプローチ |
| **中スコア(30-70%)** | 潜在可能性の探求<br>状況的分散の確認 | バランス調整指導<br>影の部分への気づき<br>発達可能性の提示 |
| **低スコア(30%未満)** | 隠れた可能性の発見<br>測定妥当性の検証<br>成長阻害要因の特定 | 自信構築支援<br>適切な活用方法<br>段階的発達プラン |

## 3. UI/UX仕様

### 3.1 HTML構造

```html
<div class="critical-productive-card" data-score-range="high|medium|low">
  <!-- ヘッダー部 -->
  <div class="card-header">
    <h3 class="card-title">🧠 批判的・生産的視点</h3>
    <div class="score-indicator" data-score="{score}%">
      <span class="score-value">{score}%</span>
      <span class="score-label">{osName}</span>
    </div>
  </div>
  
  <!-- 批判的視点セクション -->
  <div class="critical-section collapsible" data-expanded="false">
    <div class="section-header" onclick="toggleSection(this)">
      <h4>🌑 批判的視点 <span class="expand-indicator">▼</span></h4>
    </div>
    <div class="section-content">
      <div class="shadow-analysis">
        <h5>影の側面</h5>
        <div class="shadow-item" data-intensity="{intensity}">
          <p class="primary-shadow">{primary_shadow}</p>
          <div class="behavioral-risks">{behavioral_risks}</div>
          <div class="likelihood-meter">
            <span class="likelihood-label">発現可能性</span>
            <div class="likelihood-bar" style="width: {likelihood}%"></div>
            <span class="likelihood-value">{likelihood}%</span>
          </div>
        </div>
      </div>
      
      <div class="blind-spot-questions">
        <h5>盲点への気づき</h5>
        <div class="question-list">
          <!-- 動的生成される質問項目 -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- 生産的視点セクション -->
  <div class="productive-section collapsible" data-expanded="true">
    <div class="section-header" onclick="toggleSection(this)">
      <h4>🌱 生産的視点 <span class="expand-indicator">▲</span></h4>
    </div>
    <div class="section-content">
      <div class="action-questions">
        <h5>建設的な問いかけ</h5>
        <div class="question-cards">
          <!-- スコア帯別の質問カード -->
        </div>
      </div>
      
      <div class="practical-steps">
        <h5>実践的ステップ</h5>
        <div class="steps-timeline">
          <!-- 5段階の実践ステップ -->
        </div>
      </div>
      
      <div class="integration-guidance">
        <h5>統合ガイダンス</h5>
        <div class="mindset-shift">
          <div class="from-to-display">
            <div class="from">From: 固定的思考</div>
            <div class="arrow">→</div>
            <div class="to">To: 成長的思考</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 動的インサイトセクション -->
  <div class="dynamic-insights-section collapsible" data-expanded="false">
    <div class="section-header" onclick="toggleSection(this)">
      <h4>💡 動的インサイト <span class="expand-indicator">▼</span></h4>
    </div>
    <div class="section-content">
      <div class="hexagram-insights">
        <!-- hexagram_detailsベースの動的コンテンツ -->
      </div>
    </div>
  </div>
</div>
```

### 3.2 CSS仕様

```css
.critical-productive-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
  border-left: 4px solid var(--primary-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.critical-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.productive-section {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.dynamic-insights-section {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  color: white;
  border-radius: 8px;
}

.section-header {
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.section-header:hover {
  background-color: rgba(255,255,255,0.1);
}

.section-content {
  padding: 0 20px 20px;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.collapsible[data-expanded="false"] .section-content {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 20px;
}

.collapsible[data-expanded="true"] .section-content {
  max-height: 1000px;
  opacity: 1;
}

.likelihood-meter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.likelihood-bar {
  height: 8px;
  background: linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.question-cards {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.question-card {
  background: rgba(255,255,255,0.1);
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid rgba(255,255,255,0.3);
}

.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
}

.step-number {
  background: rgba(255,255,255,0.2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.from-to-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  margin: 12px 0;
}

.arrow {
  font-size: 20px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .critical-productive-card {
    padding: 16px;
    margin: 12px 0;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .from-to-display {
    flex-direction: column;
    gap: 8px;
  }
  
  .arrow {
    transform: rotate(90deg);
  }
}
```

## 4. JavaScript実装仕様

### 4.1 コンポーネントクラス構造

```javascript
class CriticalProductiveCard {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.shadowAnalyzer = options.shadowAnalyzer;
    this.criticalThinkingEngine = options.criticalThinkingEngine;
    this.hexagramDetails = options.hexagramDetails;
    this.analysisResult = options.analysisResult;
  }

  async render() {
    // メインレンダリングロジック
  }

  _generateCriticalContent(osData, score) {
    // ShadowAnalyzerとの連携
  }

  _generateProductiveContent(osData, score) {
    // CriticalThinkingEngineとの連携
  }

  _generateDynamicInsights(osData) {
    // hexagram_detailsとの連携
  }
}
```

### 4.2 データ処理フロー

1. **初期化**: 分析結果とスコアを受け取り
2. **批判的視点生成**: ShadowAnalyzer.analyzeShadow()を呼び出し
3. **生産的視点生成**: CriticalThinkingEngine.generateQuestions()を呼び出し
4. **動的インサイト抽出**: hexagram_detailsから関連データを取得
5. **統合表示**: 全データを統合してリッチテキスト表示

## 5. 実装優先度

### Phase 1 (最優先)
- [ ] 基本的なカード構造とスタイリング
- [ ] ShadowAnalyzer・CriticalThinkingEngineとの連携
- [ ] スコア帯別の基本的リッチテキスト生成
- [ ] TripleOSResultsViewへの統合

### Phase 2 (次期)
- [ ] hexagram_detailsからの動的インサイト追加
- [ ] 折りたたみ/展開機能の実装
- [ ] 質問カードのインタラクティブ機能
- [ ] レスポンシブデザインの最適化

### Phase 3 (将来)
- [ ] ユーザー反応の収集・学習機能
- [ ] パーソナライズされたコンテンツ生成
- [ ] 長期的成長追跡との連携
- [ ] A/Bテスト機能

## 6. 技術的考慮事項

### 6.1 パフォーマンス
- 動的コンテンツ生成の最適化
- 大量データの遅延読み込み
- メモリ使用量の監視

### 6.2 アクセシビリティ
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 色覚異常者への配慮

### 6.3 エラーハンドリング
- データ取得失敗時のフォールバック
- ユーザーフレンドリーなエラーメッセージ
- ログ記録とデバッグ支援

## 7. テスト仕様

### 7.1 単体テスト
- データ変換ロジックの検証
- 各セクションのレンダリング確認
- エラーハンドリングの動作確認

### 7.2 統合テスト  
- ShadowAnalyzer・CriticalThinkingEngineとの連携確認
- TripleOSResultsViewでの表示確認
- 各種スコア帯でのデータ表示確認

### 7.3 E2Eテスト
- ユーザーインタラクションの確認
- レスポンシブデザインの確認
- 全体的なUXの検証

---

**更新履歴:**
- 2025-07-28: 初版作成
- 作成者: HaQei-strategy-navigator
- レビュー: pending