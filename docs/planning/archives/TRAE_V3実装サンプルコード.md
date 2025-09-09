# 🔥 V3データ実装 - 即実行可能なサンプルコード

## 📌 このファイルの使い方
BasicResultsTab.jsにコピー＆ペーストして使える実装済みコードです。

## 1️⃣ V3データ取得の実装（最初に追加）

```javascript
// BasicResultsTab.js の冒頭に追加

class BasicResultsTab extends BaseTabView {
    constructor() {
        super('basic-results');
        this.hexagramExtractor = null;
        this.analysisData = null;
        this.v3DataLoaded = false; // V3データ読み込みフラグ
        
        console.log('📊 BasicResultsTab初期化中...');
        
        // V3データの確認
        this.checkV3DataAvailability();
        
        // localStorageからデータ読み込み
        this.loadAnalysisData();
        this.initializeExtractor();
    }
    
    /**
     * V3データの利用可能性を確認
     */
    checkV3DataAvailability() {
        // グローバル変数として定義されているか確認
        if (typeof HexagramHumanTraitsV3 !== 'undefined') {
            this.v3DataLoaded = true;
            console.log('✅ V3データが利用可能です');
        } else {
            console.warn('⚠️ V3データが見つかりません。シンプル表示モードで動作します');
        }
    }
    
    /**
     * 卦名からV3データを取得
     */
    getV3DataForHexagram(hexagramName) {
        if (!this.v3DataLoaded) return null;
        
        try {
            const data = HexagramHumanTraitsV3[hexagramName];
            if (data) {
                console.log(`✅ V3データ取得成功: ${hexagramName}`, data);
                return data;
            } else {
                console.warn(`⚠️ V3データが見つかりません: ${hexagramName}`);
                return null;
            }
        } catch (error) {
            console.error('❌ V3データ取得エラー:', error);
            return null;
        }
    }
}
```

## 2️⃣ Engine OSカードの完全実装

```javascript
/**
 * Engine OSカードをV3データで描画
 */
renderEngineOSCard(osData) {
    // V3データの取得
    const v3Data = this.getV3DataForHexagram(osData.hexagramName || osData.name);
    
    // V3データがない場合はシンプル版を表示
    if (!v3Data || !v3Data.asEngineOS) {
        return this.renderSimpleEngineCard(osData);
    }
    
    const engine = v3Data.asEngineOS;
    
    return `
        <div class="os-card os-card-engine" data-hexagram="${osData.hexagramName}">
            <!-- ヘッダー部分 -->
            <div class="os-card-header">
                <div class="os-header-top">
                    <div class="os-icon">⚙️</div>
                    <div class="os-title">
                        <h3>Engine OS</h3>
                        <p class="os-subtitle">内なる原動力</p>
                    </div>
                    <div class="os-score">
                        <div class="score-value">${osData.score}</div>
                        <div class="score-label">pts</div>
                    </div>
                </div>
                <div class="hexagram-info">
                    <span class="hexagram-symbol">${v3Data.symbol}</span>
                    <span class="hexagram-name">${osData.hexagramName}</span>
                    <span class="hexagram-emoji">${v3Data.emoji}</span>
                </div>
            </div>
            
            <!-- プロファイルセクション -->
            <div class="os-section os-profile">
                <h4 class="section-title">🎯 基本プロファイル</h4>
                <div class="profile-content">
                    <div class="profile-type">${engine.profile.type}</div>
                    <div class="profile-description">${engine.profile.description}</div>
                    <div class="profile-metaphor">
                        <span class="metaphor-icon">💭</span>
                        <span class="metaphor-text">${engine.profile.metaphor}</span>
                    </div>
                </div>
            </div>
            
            <!-- 通常状態セクション -->
            <div class="os-section os-normal-state">
                <h4 class="section-title">⚡ 通常モード</h4>
                <div class="state-content">
                    <p class="state-description">${engine.normalState.whatHappens}</p>
                    <div class="state-example">
                        <span class="example-label">例：</span>
                        <span class="example-text">${engine.normalState.example}</span>
                    </div>
                    <div class="energy-display">
                        <span class="energy-label">エネルギーレベル：</span>
                        <span class="energy-bar">${engine.normalState.energyLevel}</span>
                    </div>
                </div>
            </div>
            
            <!-- スーパーモードセクション -->
            <div class="os-section os-super-mode">
                <h4 class="section-title">🚀 スーパーモード</h4>
                <div class="state-content super-mode-content">
                    <div class="trigger-condition">
                        <span class="trigger-label">発動条件：</span>
                        <span class="trigger-text">${engine.superMode.when}</span>
                    </div>
                    <p class="state-description">${engine.superMode.whatHappens}</p>
                    <div class="state-example">
                        <span class="example-label">例：</span>
                        <span class="example-text">${engine.superMode.example}</span>
                    </div>
                    <div class="energy-display energy-max">
                        <span class="energy-label">エネルギーレベル：</span>
                        <span class="energy-bar">${engine.superMode.energyLevel}</span>
                    </div>
                </div>
            </div>
            
            <!-- メンテナンスセクション -->
            <div class="os-section os-maintenance">
                <h4 class="section-title">🔧 メンテナンス方法</h4>
                <div class="maintenance-content">
                    <div class="maintenance-item">
                        <span class="maintenance-label">必要なもの：</span>
                        <span class="maintenance-text">${engine.maintenance.whatYouNeed}</span>
                    </div>
                    <div class="maintenance-item">
                        <span class="maintenance-label">充電方法：</span>
                        <span class="maintenance-text">${engine.maintenance.howToCharge}</span>
                    </div>
                    <div class="maintenance-warning">
                        <span class="warning-icon">⚠️</span>
                        <span class="warning-text">${engine.maintenance.warning}</span>
                    </div>
                    <div class="maintenance-tip">
                        <span class="tip-icon">💡</span>
                        <span class="tip-text">${engine.maintenance.tip}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * シンプル版Engine OSカード（フォールバック）
 */
renderSimpleEngineCard(osData) {
    return `
        <div class="os-card os-card-engine os-card-simple">
            <div class="os-card-header">
                <h3>⚙️ Engine OS</h3>
                <div class="os-score">${osData.score} pts</div>
            </div>
            <div class="os-content">
                <p class="hexagram-name">${osData.hexagramName || osData.name}</p>
                <p class="os-description">論理的思考と問題解決</p>
            </div>
        </div>
    `;
}
```

## 3️⃣ Interface OSカードの完全実装

```javascript
/**
 * Interface OSカードをV3データで描画
 */
renderInterfaceOSCard(osData) {
    const v3Data = this.getV3DataForHexagram(osData.hexagramName || osData.name);
    
    if (!v3Data || !v3Data.asInterfaceOS) {
        return this.renderSimpleInterfaceCard(osData);
    }
    
    const interfaceOS = v3Data.asInterfaceOS;
    
    return `
        <div class="os-card os-card-interface" data-hexagram="${osData.hexagramName}">
            <!-- ヘッダー部分 -->
            <div class="os-card-header">
                <div class="os-header-top">
                    <div class="os-icon">🎨</div>
                    <div class="os-title">
                        <h3>Interface OS</h3>
                        <p class="os-subtitle">社会での顔</p>
                    </div>
                    <div class="os-score">
                        <div class="score-value">${osData.score}</div>
                        <div class="score-label">pts</div>
                    </div>
                </div>
                <div class="hexagram-info">
                    <span class="hexagram-symbol">${v3Data.symbol}</span>
                    <span class="hexagram-name">${osData.hexagramName}</span>
                    <span class="hexagram-emoji">${v3Data.emoji}</span>
                </div>
            </div>
            
            <!-- プロファイルセクション -->
            <div class="os-section os-profile">
                <h4 class="section-title">🎯 基本プロファイル</h4>
                <div class="profile-content">
                    <div class="profile-type">${interfaceOS.profile.type}</div>
                    <div class="profile-description">${interfaceOS.profile.description}</div>
                    <div class="profile-metaphor">
                        <span class="metaphor-icon">💭</span>
                        <span class="metaphor-text">${interfaceOS.profile.metaphor}</span>
                    </div>
                </div>
            </div>
            
            <!-- コミュニケーションスタイル -->
            <div class="os-section os-communication">
                <h4 class="section-title">💬 コミュニケーションスタイル</h4>
                <div class="communication-content">
                    <div class="talk-style">
                        <span class="style-label">話し方：</span>
                        <span class="style-text">${interfaceOS.howToTalk.style}</span>
                    </div>
                    <div class="talk-example">
                        <span class="example-label">例：</span>
                        <span class="example-text">"${interfaceOS.howToTalk.example}"</span>
                    </div>
                    <div class="communication-skills">
                        <div class="skill-good">
                            <span class="badge badge-success">得意</span>
                            <span class="skill-text">${interfaceOS.howToTalk.goodAt}</span>
                        </div>
                        <div class="skill-bad">
                            <span class="badge badge-warning">苦手</span>
                            <span class="skill-text">${interfaceOS.howToTalk.notGoodAt}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 最適環境セクション -->
            <div class="os-section os-environment">
                <h4 class="section-title">🌟 活躍できる環境</h4>
                <div class="environment-content">
                    <div class="environment-item">
                        <span class="env-label">場所：</span>
                        <span class="env-text">${interfaceOS.bestEnvironment.where}</span>
                    </div>
                    <div class="environment-item">
                        <span class="env-label">具体例：</span>
                        <span class="env-text">${interfaceOS.bestEnvironment.example}</span>
                    </div>
                    <div class="environment-item">
                        <span class="env-label">最適な仲間：</span>
                        <span class="env-text">${interfaceOS.bestEnvironment.withWho}</span>
                    </div>
                    <div class="environment-warning">
                        <span class="warning-icon">⚠️</span>
                        <span class="warning-label">避けるべき環境：</span>
                        <span class="warning-text">${interfaceOS.bestEnvironment.avoid}</span>
                    </div>
                </div>
            </div>
            
            <!-- 人間関係のヒント -->
            <div class="os-section os-relationship">
                <h4 class="section-title">🤝 人間関係のヒント</h4>
                <div class="relationship-content">
                    <div class="relationship-item">
                        <span class="rel-label">強み：</span>
                        <span class="rel-text">${interfaceOS.relationshipTips.strength}</span>
                    </div>
                    <div class="relationship-item">
                        <span class="rel-label">弱点：</span>
                        <span class="rel-text">${interfaceOS.relationshipTips.weakness}</span>
                    </div>
                    <div class="relationship-advice">
                        <span class="advice-icon">💡</span>
                        <span class="advice-text">${interfaceOS.relationshipTips.advice}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
```

## 4️⃣ SafeMode OSカードの完全実装

```javascript
/**
 * SafeMode OSカードをV3データで描画
 */
renderSafeModeOSCard(osData) {
    const v3Data = this.getV3DataForHexagram(osData.hexagramName || osData.name);
    
    if (!v3Data || !v3Data.asSafeModeOS) {
        return this.renderSimpleSafeModeCard(osData);
    }
    
    const safeMode = v3Data.asSafeModeOS;
    
    return `
        <div class="os-card os-card-safemode" data-hexagram="${osData.hexagramName}">
            <!-- ヘッダー部分 -->
            <div class="os-card-header">
                <div class="os-header-top">
                    <div class="os-icon">🛡️</div>
                    <div class="os-title">
                        <h3>SafeMode OS</h3>
                        <p class="os-subtitle">心の守り方</p>
                    </div>
                    <div class="os-score">
                        <div class="score-value">${osData.score}</div>
                        <div class="score-label">pts</div>
                    </div>
                </div>
                <div class="hexagram-info">
                    <span class="hexagram-symbol">${v3Data.symbol}</span>
                    <span class="hexagram-name">${osData.hexagramName}</span>
                    <span class="hexagram-emoji">${v3Data.emoji}</span>
                </div>
            </div>
            
            <!-- プロファイルセクション -->
            <div class="os-section os-profile">
                <h4 class="section-title">🎯 防御プロファイル</h4>
                <div class="profile-content">
                    <div class="profile-type">${safeMode.profile.type}</div>
                    <div class="profile-description">${safeMode.profile.description}</div>
                    <div class="profile-metaphor">
                        <span class="metaphor-icon">💭</span>
                        <span class="metaphor-text">${safeMode.profile.metaphor}</span>
                    </div>
                </div>
            </div>
            
            <!-- ストレス反応セクション -->
            <div class="os-section os-stress">
                <h4 class="section-title">😰 ストレス時の反応</h4>
                <div class="stress-content">
                    <div class="stress-action">
                        <span class="action-label">行動パターン：</span>
                        <span class="action-text">${safeMode.stressResponse.whatYouDo}</span>
                    </div>
                    <div class="stress-example">
                        <span class="example-label">例：</span>
                        <span class="example-text">${safeMode.stressResponse.example}</span>
                    </div>
                    <div class="stress-evaluation">
                        <div class="eval-good">
                            <span class="badge badge-success">良い点</span>
                            <span class="eval-text">${safeMode.stressResponse.goodPoint}</span>
                        </div>
                        <div class="eval-bad">
                            <span class="badge badge-warning">注意点</span>
                            <span class="eval-text">${safeMode.stressResponse.badPoint}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 緊急モードセクション -->
            <div class="os-section os-emergency">
                <h4 class="section-title">🚨 緊急モード</h4>
                <div class="emergency-content">
                    <div class="emergency-action">
                        <span class="action-label">緊急時の行動：</span>
                        <span class="action-text">${safeMode.emergencyMode.whatHappens}</span>
                    </div>
                    <div class="emergency-example">
                        <span class="example-label">例：</span>
                        <span class="example-text">${safeMode.emergencyMode.example}</span>
                    </div>
                    <div class="recovery-info">
                        <div class="recovery-method">
                            <span class="recovery-label">回復方法：</span>
                            <span class="recovery-text">${safeMode.emergencyMode.recovery}</span>
                        </div>
                        <div class="recovery-time">
                            <span class="time-icon">⏱️</span>
                            <span class="time-label">回復期間：</span>
                            <span class="time-text">${safeMode.emergencyMode.timeToRecover}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 回復方法セクション -->
            <div class="os-section os-recovery">
                <h4 class="section-title">🌱 回復方法</h4>
                <div class="recovery-content">
                    <div class="recovery-item">
                        <span class="recovery-label">最適な回復法：</span>
                        <span class="recovery-text">${safeMode.howToRecover.bestWay}</span>
                    </div>
                    <div class="recovery-item">
                        <span class="recovery-label">具体例：</span>
                        <span class="recovery-text">${safeMode.howToRecover.example}</span>
                    </div>
                    <div class="recovery-item">
                        <span class="recovery-label">理想的な環境：</span>
                        <span class="recovery-text">${safeMode.howToRecover.environment}</span>
                    </div>
                    <div class="recovery-support">
                        <span class="support-icon">🤲</span>
                        <span class="support-label">必要なサポート：</span>
                        <span class="support-text">${safeMode.howToRecover.support}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
```

## 5️⃣ OSバランスセクションの実装

```javascript
/**
 * OSバランス分析セクションを描画
 */
renderOSBalanceSection(engineData, interfaceData, safeModeData) {
    const engineV3 = this.getV3DataForHexagram(engineData.hexagramName);
    const interfaceV3 = this.getV3DataForHexagram(interfaceData.hexagramName);
    const safeModeV3 = this.getV3DataForHexagram(safeModeData.hexagramName);
    
    // V3データがない場合は表示しない
    if (!engineV3 || !interfaceV3 || !safeModeV3) {
        return '';
    }
    
    return `
        <div class="os-balance-section">
            <h2 class="balance-title">⚖️ Triple OSバランス分析</h2>
            
            <!-- バランスチャート -->
            <div class="balance-chart-container">
                <canvas id="balance-chart"></canvas>
                <div class="current-balance">
                    <h4>現在のバランス</h4>
                    <div class="balance-scores">
                        <div class="balance-score">
                            <span class="os-name">Engine OS:</span>
                            <span class="os-value">${engineData.score}%</span>
                        </div>
                        <div class="balance-score">
                            <span class="os-name">Interface OS:</span>
                            <span class="os-value">${interfaceData.score}%</span>
                        </div>
                        <div class="balance-score">
                            <span class="os-name">SafeMode OS:</span>
                            <span class="os-value">${safeModeData.score}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 理想バランス -->
            <div class="ideal-balance-container">
                <h3>🎯 あなたの理想的なバランス</h3>
                <div class="ideal-balance-grid">
                    <div class="ideal-balance-card">
                        <h4>${engineV3.nickname}の理想バランス</h4>
                        <p class="balance-ratio">${engineV3.osBalance.idealBalance}</p>
                    </div>
                </div>
            </div>
            
            <!-- バランス診断 -->
            <div class="balance-diagnosis">
                <h3>📊 バランス診断結果</h3>
                <div class="diagnosis-grid">
                    <div class="diagnosis-card when-balanced">
                        <h4>✨ バランスが取れている時</h4>
                        <p>${engineV3.osBalance.whenBalanced}</p>
                    </div>
                    <div class="diagnosis-card when-imbalanced">
                        <h4>⚠️ バランスが崩れている時</h4>
                        <p>${engineV3.osBalance.whenImbalanced}</p>
                    </div>
                </div>
            </div>
            
            <!-- 改善アドバイス -->
            <div class="balance-advice">
                <h3>💡 バランス改善のアドバイス</h3>
                <div class="advice-cards">
                    <div class="advice-card">
                        <div class="advice-icon">⚙️</div>
                        <div class="advice-content">
                            <h4>Engine OSの調整</h4>
                            <p>${engineV3.osBalance.tip}</p>
                        </div>
                    </div>
                    <div class="advice-card">
                        <div class="advice-icon">🎨</div>
                        <div class="advice-content">
                            <h4>Interface OSの調整</h4>
                            <p>${interfaceV3.osBalance.tip}</p>
                        </div>
                    </div>
                    <div class="advice-card">
                        <div class="advice-icon">🛡️</div>
                        <div class="advice-content">
                            <h4>SafeMode OSの調整</h4>
                            <p>${safeModeV3.osBalance.tip}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
```

## 6️⃣ メインのrenderメソッド更新

```javascript
/**
 * タブのコンテンツを描画（メインメソッド）
 */
render() {
    const container = this.getContainer();
    if (!container) {
        console.error('❌ コンテナが見つかりません');
        return;
    }
    
    // 分析データの確認
    if (!this.analysisData) {
        container.innerHTML = '<div class="no-data">分析データがありません</div>';
        return;
    }
    
    // Triple OSデータの取得
    const engineOS = this.analysisData.engineOS || this.analysisData.tripleOS?.engine;
    const interfaceOS = this.analysisData.interfaceOS || this.analysisData.tripleOS?.interface;
    const safeModeOS = this.analysisData.safeModeOS || this.analysisData.tripleOS?.safeMode;
    
    // HTML生成
    container.innerHTML = `
        <div class="basic-results-container">
            <!-- ヘッダー -->
            <div class="results-header">
                <h2>🎯 あなたのTriple OS分析結果</h2>
                <p class="results-subtitle">
                    内なる3つのシステムの現在の状態と、易経の知恵による解釈をご覧ください
                </p>
            </div>
            
            <!-- Triple OSカード -->
            <div class="triple-os-cards">
                <h3 class="section-title">🔮 Triple OS 現在の状態</h3>
                <div class="os-cards-grid">
                    ${this.renderEngineOSCard(engineOS)}
                    ${this.renderInterfaceOSCard(interfaceOS)}
                    ${this.renderSafeModeOSCard(safeModeOS)}
                </div>
            </div>
            
            <!-- OSバランス分析 -->
            ${this.renderOSBalanceSection(engineOS, interfaceOS, safeModeOS)}
            
            <!-- 推奨アクション -->
            <div class="recommended-actions">
                <h3>🎯 推奨アクション</h3>
                <div class="action-cards">
                    ${this.renderActionItems()}
                </div>
            </div>
        </div>
    `;
    
    // チャートの初期化（必要に応じて）
    this.initializeCharts();
    
    // イベントリスナーの設定
    this.setupEventListeners();
    
    console.log('✅ BasicResultsTab描画完了');
}
```

## 7️⃣ HTML読み込み部分の追加

```html
<!-- results.html のheadタグ内に追加 -->
<script src="js/data/hexagram-human-traits-v3.js"></script>

<!-- または動的読み込み -->
<script>
// V3データの動的読み込み
(function() {
    const script = document.createElement('script');
    script.src = 'js/data/hexagram-human-traits-v3.js';
    script.onload = function() {
        console.log('✅ V3データ読み込み完了');
    };
    script.onerror = function() {
        console.error('❌ V3データ読み込み失敗');
    };
    document.head.appendChild(script);
})();
</script>
```

## 8️⃣ デバッグ用コード

```javascript
// コンソールでV3データの動作確認
console.log('V3データテスト開始');

// V3データが読み込まれているか確認
if (typeof HexagramHumanTraitsV3 !== 'undefined') {
    console.log('✅ V3データ読み込み済み');
    console.log('利用可能な卦:', Object.keys(HexagramHumanTraitsV3));
    
    // サンプルデータの表示
    const sample = HexagramHumanTraitsV3['乾為天'];
    console.log('乾為天のデータ:', sample);
    console.log('Engine OSデータ:', sample.asEngineOS);
} else {
    console.error('❌ V3データが見つかりません');
}

// BasicResultsTabのインスタンスでテスト
if (window.basicResultsTab) {
    const testData = window.basicResultsTab.getV3DataForHexagram('乾為天');
    console.log('BasicResultsTabからの取得:', testData);
}
```

## 📌 実装の注意点

1. **エラーハンドリング**: V3データがない場合は必ずフォールバック
2. **パフォーマンス**: 大量のDOM操作を避ける
3. **レスポンシブ**: モバイル表示を常に確認
4. **段階実装**: 一度に全部ではなく、OSごとに確認しながら実装

---

**このファイルの使い方**:
1. 各セクションのコードをコピー
2. BasicResultsTab.jsの該当箇所にペースト
3. console.logで動作確認
4. CSSを適用して見た目を調整

**作成日**: 2025-08-21  
**対象**: TRAE（実装担当者）