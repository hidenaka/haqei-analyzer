# HAQEI Analyzer - シンプル10行サマリー実装方針

## 1. SummaryGenerator.js 修正方針

### 新しいメソッド: generateSimpleSummary()

```javascript
/**
 * シンプルな10行サマリーを生成
 * @param {Object} analysisData - Triple OS分析データ
 * @returns {Array} 10行のサマリー配列
 */
generateSimpleSummary(analysisData) {
    try {
        const { engineOS, interfaceOS, safeModeOS } = analysisData;
        
        // V3データから実用的情報を抽出
        const engineV3 = this.getV3DataForOS(engineOS.hexagramName, 'engineOS');
        const interfaceV3 = this.getV3DataForOS(interfaceOS.hexagramName, 'interfaceOS');
        const safeModeV3 = this.getV3DataForOS(safeModeOS.hexagramName, 'safeModeOS');
        
        const summary = [];
        
        // 1. 全体的特性
        summary.push(`あなたの人格は${engineOS.hexagramName}・${interfaceOS.hexagramName}・${safeModeOS.hexagramName}の組み合わせです`);
        
        // 2-3. Engine OS（内なる原動力）
        if (engineV3?.profile) {
            summary.push(`内なる原動力：${engineV3.profile.type} - ${engineV3.profile.description}`);
            summary.push(`活動的な時：${engineV3.normalState?.example || '創造的なエネルギーを発揮します'}`);
        }
        
        // 4-5. Interface OS（社会との接点）
        if (interfaceV3?.profile) {
            summary.push(`社会との関わり：${interfaceV3.profile.type} - ${interfaceV3.profile.description}`);
            summary.push(`コミュニケーション：${interfaceV3.howToTalk?.style || '自然な対話を重視します'}`);
        }
        
        // 6-7. SafeMode OS（心の防御機構）
        if (safeModeV3?.profile) {
            summary.push(`ストレス対処：${safeModeV3.profile.type} - ${safeModeV3.profile.description}`);
            summary.push(`緊急時の反応：${safeModeV3.stressResponse?.whatYouDo || '冷静に状況を分析します'}`);
        }
        
        // 8. 最適な環境
        const bestEnv = interfaceV3?.bestEnvironment?.where || '協調的で安定した環境';
        summary.push(`最適な環境：${bestEnv}`);
        
        // 9. 推奨アクション
        const action = engineV3?.maintenance?.tip || interfaceV3?.relationshipTips?.advice || '継続的な成長を心がけましょう';
        summary.push(`推奨アクション：${action}`);
        
        // 10. 回復・成長方法
        const recovery = safeModeV3?.howToRecover?.bestWay || '十分な休息と振り返りの時間を確保しましょう';
        summary.push(`回復・成長方法：${recovery}`);
        
        return summary;
        
    } catch (error) {
        console.error('❌ シンプルサマリー生成エラー:', error);
        return this.getFallbackSimpleSummary();
    }
}

/**
 * フォールバック用シンプルサマリー
 */
getFallbackSimpleSummary() {
    return [
        'あなたの人格は多面的で豊かな特性を持っています',
        '内なる原動力：創造的で前向きなエネルギーを持つタイプ',
        '活動的な時：新しいアイデアを生み出し、積極的に行動します',
        '社会との関わり：バランスの取れたコミュニケーション能力',
        'コミュニケーション：相手に配慮した自然な対話スタイル',
        'ストレス対処：冷静さを保ちながら柔軟に対応するタイプ',
        '緊急時の反応：問題解決に向けて組織的にアプローチします',
        '最適な環境：協調的で創造性を発揮できる環境',
        '推奨アクション：継続的な学習と新しい挑戦を取り入れましょう',
        '回復・成長方法：定期的な振り返りと十分な休息を確保しましょう'
    ];
}
```

## 2. BasicResultsTab.js 修正方針

### renderDetailedAnalysisSection()の簡略化

```javascript
/**
 * シンプルな10行サマリーセクションのレンダリング
 * @returns {string} HTML文字列
 */
renderSimpleSummarySection() {
    if (!this.summaryGenerator || !this.analysisData) {
        return '<div class="simple-summary-placeholder">サマリーの準備中...</div>';
    }

    const simpleSummary = this.summaryGenerator.generateSimpleSummary(this.analysisData);

    return `
        <div class="simple-summary-section">
            <div class="summary-header">
                <h2>📋 10行サマリー</h2>
                <p class="summary-subtitle">あなたの特性を活用するための実用的ガイド</p>
            </div>
            
            <div class="summary-list">
                ${simpleSummary.map((line, index) => `
                    <div class="summary-item" data-line="${index + 1}">
                        <span class="item-number">${index + 1}</span>
                        <p class="item-text">${line}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="summary-actions">
                <button class="action-btn primary" onclick="this.exportSummary()">
                    📄 サマリーをエクスポート
                </button>
                <button class="action-btn secondary" onclick="this.shareSummary()">
                    🔗 サマリーを共有
                </button>
            </div>
        </div>
    `;
}

/**
 * Triple OSカードの描画（簡略版）
 */
renderTripleOSCards() {
    const container = this.getContainer();
    if (!container) {
        console.error('❌ renderTripleOSCards: コンテナが見つかりません');
        return;
    }
    
    const { engineOS, interfaceOS, safeModeOS } = this.analysisData;
    
    // 4行要約は残す（簡潔な概要として）
    const fourLineSummary = this.summaryGenerator ? 
        this.summaryGenerator.generateFourLineSummary(this.analysisData) : null;

    container.innerHTML = `
        ${fourLineSummary ? this.renderSummarySection(fourLineSummary) : ''}
        <div class="os-cards-wrapper">
            ${this.renderEngineOSCard(engineOS)}
            ${this.renderInterfaceOSCard(interfaceOS)}
            ${this.renderSafeModeOSCard(safeModeOS)}
        </div>
        ${this.renderSimpleSummarySection()}
    `;
}
```

## 3. CSSスタイリング

```css
/* シンプルサマリー用CSS */
.simple-summary-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 12px;
    border: 1px solid #cbd5e1;
}

.summary-header h2 {
    color: #1e293b;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.summary-subtitle {
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
}

.summary-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.summary-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.summary-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-number {
    min-width: 24px;
    height: 24px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
    flex-shrink: 0;
}

.item-text {
    margin: 0;
    line-height: 1.5;
    color: #334155;
}

.summary-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
}

.action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.action-btn.primary {
    background: #3b82f6;
    color: white;
}

.action-btn.primary:hover {
    background: #2563eb;
}

.action-btn.secondary {
    background: #e2e8f0;
    color: #475569;
}

.action-btn.secondary:hover {
    background: #cbd5e1;
}
```

## 4. 実装手順

1. **SummaryGenerator.js**に`generateSimpleSummary()`メソッドを追加
2. **BasicResultsTab.js**の`renderDetailedAnalysisSection()`を`renderSimpleSummarySection()`に置き換え
3. アコーディオン関連のコードを削除
4. 新しいCSSスタイルを追加
5. エクスポート・共有機能の実装（オプション）

## 5. メリット

- **コード量**: 約400行→約100行（75%削減）
- **表示速度**: アコーディオン不要で高速表示
- **ユーザビリティ**: 一覧性が向上、すぐに活用可能な情報
- **保守性**: シンプルな構造で保守が容易

## 6. V3データ活用効率化

- 必要なフィールドのみ抽出
- フォールバック機能で安定性確保
- 実用的な情報に絞り込み