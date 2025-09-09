# 九宮構成実装作業指示書

## 1. 実装概要
詳細分析タブの10項目アコーディオンを、九宮構成（3×3グリッド）に段階的に置き換える。
**重要**: 既存機能を壊さないよう、URLパラメータで切り替え可能にする。

## 2. 実装ファイル

### A. SummaryGenerator.js修正
```javascript
// 415行目付近に追加
generateNinePhaseAnalysis(hexagramData) {
    const v3Data = window.HexagramHumanTraitsV3?.[hexagramData.number] || {};
    
    return {
        // 中宮（核心）
        center: {
            title: "核心性質",
            content: v3Data.coreNature || "データなし"
        },
        // 八方位
        phases: [
            { title: "使命と才能", content: v3Data.mission || "" },
            { title: "思考パターン", content: v3Data.thinkingPattern || "" },
            { title: "感情の特徴", content: v3Data.emotionalPattern || "" },
            { title: "行動スタイル", content: v3Data.actionStyle || "" },
            { title: "人間関係", content: v3Data.relationships || "" },
            { title: "成長の鍵", content: v3Data.growthKey || "" },
            { title: "潜在リスク", content: v3Data.risks || "" },
            { title: "開花の時期", content: v3Data.timing || "" }
        ]
    };
}
```

### B. BasicResultsTab.js修正

1. **837行目のrenderDetailedAnalysisSection修正**:
```javascript
renderDetailedAnalysisSection() {
    // URLパラメータチェック追加
    const urlParams = new URLSearchParams(window.location.search);
    const useNinePhase = urlParams.get('ninePhase') === 'true';
    
    if (useNinePhase) {
        return this.renderNinePhaseSection();
    }
    
    // 既存のアコーディオン実装（変更なし）
    const analysis = this.summaryData?.detailedAnalysis || {};
    // ... 既存コード継続
}
```

2. **新メソッド追加（868行目付近）**:
```javascript
renderNinePhaseSection() {
    const generator = new SummaryGenerator();
    const hexagramData = {
        number: parseInt(this.summaryData?.mainHexagram?.number || 1)
    };
    const ninePhase = generator.generateNinePhaseAnalysis(hexagramData);
    
    return `
        <div class="nine-phase-grid">
            <style>
                .nine-phase-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    padding: 20px;
                }
                .phase-item {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    border: 1px solid #dee2e6;
                }
                .phase-center {
                    grid-column: 2;
                    grid-row: 2;
                    background: #e3f2fd;
                    border: 2px solid #2196f3;
                }
                .phase-title {
                    font-weight: bold;
                    color: #495057;
                    margin-bottom: 8px;
                }
                .phase-content {
                    color: #6c757d;
                    font-size: 14px;
                }
            </style>
            
            ${ninePhase.phases.slice(0, 4).map((phase, i) => `
                <div class="phase-item">
                    <div class="phase-title">${phase.title}</div>
                    <div class="phase-content">${phase.content}</div>
                </div>
                ${i === 0 ? `
                    <div class="phase-item phase-center">
                        <div class="phase-title">${ninePhase.center.title}</div>
                        <div class="phase-content">${ninePhase.center.content}</div>
                    </div>
                ` : ''}
            `).join('')}
            ${ninePhase.phases.slice(4).map(phase => `
                <div class="phase-item">
                    <div class="phase-title">${phase.title}</div>
                    <div class="phase-content">${phase.content}</div>
                </div>
            `).join('')}
        </div>
    `;
}
```

## 3. テスト手順

1. **既存機能確認**:
```bash
# サーバー起動
python3 -m http.server 8000
# ブラウザで http://localhost:8000/public/results.html
```

2. **九宮構成確認**:
```
http://localhost:8000/public/results.html?ninePhase=true
```

3. **動作確認項目**:
- 通常URL: アコーディオン表示（10項目）
- ?ninePhase=true: 九宮グリッド表示（3×3）
- エラーなし確認: コンソールログ確認

## 4. 注意事項
- HexagramHumanTraitsV3が読み込まれていることを確認
- 既存のアコーディオン機能は一切変更しない
- CSSはインラインで記述（外部CSS不要）

## 5. 完了基準
- URLパラメータで表示切り替え可能
- エラーなし
- 両方の表示が正常動作