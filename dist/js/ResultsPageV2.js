/**
 * Results Page v2.1 Implementation
 * Zone A-D統合実装
 * Based on 20250812_OS_ANALYZER_RESULTS_PAGE_V2.1_IMPLEMENTATION_READY.md
 */

class ResultsPageV2 {
    constructor() {
        // v2.1仕様のメトリクス計算
        this.metricsCalculator = new MetricsCalculator();
        
        // HERO文生成
        this.heroGenerator = new HeroGenerator();
        
        // Switch Lenses
        this.switchLensCalculator = new SwitchLensCalculator();
        
        // ペイロード生成
        this.payloadGenerator = new PayloadGenerator();
    }
    
    /**
     * 結果画面の初期化と表示
     */
    async render(tripleOSResults) {
        try {
            // メトリクス計算
            const metrics = this.metricsCalculator.calculate(tripleOSResults);
            
            // データ構造の準備
            const data = {
                scores: {
                    engine: tripleOSResults.engineOS?.strength / 100 || 0.5,
                    interface: tripleOSResults.interfaceOS?.strength / 100 || 0.5,
                    safe: tripleOSResults.safeModeOS?.strength / 100 || 0.5
                },
                metrics: metrics,
                tripleOS: tripleOSResults
            };
            
            // Zone A: Triple OSフィンガープリント
            await this.renderZoneA(data);
            
            // Zone B: 力学ステートメント
            this.renderZoneB(data);
            
            // Zone C: Switch Lenses
            this.renderZoneC(data);
            
            // Zone D: 不確かさとハンドオフ
            this.renderZoneD(data);
            
            // ペイロード生成と保存
            const payload = this.payloadGenerator.generate('full', data);
            this.savePayload(payload);
            
        } catch (error) {
            console.error('Results page rendering error:', error);
            this.showError(error);
        }
    }
    
    /**
     * Zone A: Triple OSフィンガープリント
     */
    async renderZoneA(data) {
        const container = document.getElementById('zone-a-container') || this.createZoneContainer('a');
        
        // HERO文生成
        const hero = this.heroGenerator.generate(data);
        
        container.innerHTML = `
            <div class="zone-a-hero">
                <!-- HERO文（18-28字） -->
                <h1 class="hero-text" style="
                    font-size: 2rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-align: center;
                    margin-bottom: 1.5rem;
                ">
                    ${hero.text}
                </h1>
                
                <!-- 三角マップ -->
                <div class="triangle-map-container" style="
                    width: 100%;
                    max-width: 500px;
                    height: 400px;
                    margin: 0 auto;
                    position: relative;
                ">
                    <canvas id="triple-os-triangle" style="width: 100%; height: 100%;"></canvas>
                </div>
                
                <!-- Whyバッジ（28-44字） -->
                <div class="why-badge" style="
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    border-radius: 20px;
                    padding: 0.5rem 1rem;
                    margin: 1rem auto;
                    max-width: 600px;
                    text-align: center;
                ">
                    <span class="calculation-basis" style="color: #94a3b8; font-size: 0.9rem;">
                        ${hero.why}
                    </span>
                </div>
                
                <!-- タグ表示（最大4個） -->
                <div class="tags-container" style="
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                ">
                    ${hero.tags.map(tag => `
                        <span class="tag" style="
                            background: rgba(139, 92, 246, 0.1);
                            color: #8b5cf6;
                            padding: 0.25rem 0.75rem;
                            border-radius: 12px;
                            font-size: 0.85rem;
                        ">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 三角マップ描画
        const fingerprint = new TripleOSFingerprint('triple-os-triangle');
        fingerprint.draw(data);
        
        // リサイズ対応
        window.addEventListener('resize', () => fingerprint.resize());
    }
    
    /**
     * Zone B: 相互作用の力学
     */
    renderZoneB(data) {
        const container = document.getElementById('zone-b-container') || this.createZoneContainer('b');
        
        // 力学ステートメント生成（最大2件×42字）
        const insights = this.generateInsightPrimitives(data);
        
        container.innerHTML = `
            <div class="zone-b-dynamics">
                <h3 style="color: #cbd5e1; margin-bottom: 1rem;">相互作用の力学</h3>
                
                <!-- 力学ステートメント -->
                <div class="insight-primitives" style="
                    display: grid;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                ">
                    ${insights.slice(0, 2).map(insight => `
                        <div style="
                            background: rgba(99, 102, 241, 0.05);
                            padding: 1rem;
                            border-radius: 8px;
                            border-left: 3px solid ${insight.color};
                        ">
                            <p style="color: #e5e7eb; margin: 0;">
                                ${insight.text}
                            </p>
                        </div>
                    `).join('')}
                </div>
                
                <!-- 8軸ミニバー（アコーディオン） -->
                <details class="bagua-details" style="
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 8px;
                    padding: 0.5rem;
                ">
                    <summary style="cursor: pointer; color: #94a3b8; padding: 0.5rem;">
                        詳細な8次元分析を見る
                    </summary>
                    <div class="bagua-bars" style="padding: 1rem;">
                        ${this.render8DimensionBars(data)}
                    </div>
                </details>
            </div>
        `;
    }
    
    /**
     * Zone C: 条件反転（Switch Lenses）
     */
    renderZoneC(data) {
        const container = document.getElementById('zone-c-container') || this.createZoneContainer('c');
        
        container.innerHTML = `
            <div class="zone-c-switches">
                <h3 style="color: #cbd5e1; margin-bottom: 1rem;">条件による変化シミュレーション</h3>
                
                <!-- スライダー -->
                <div class="condition-sliders" style="display: grid; gap: 1.5rem;">
                    <!-- 不確実性 -->
                    <div class="slider-container">
                        <label style="color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>不確実性</span>
                            <span id="uncertainty-value">50%</span>
                        </label>
                        <input type="range" id="uncertainty-slider" 
                               min="0" max="100" value="50"
                               style="width: 100%;">
                        <div class="prediction" style="
                            color: #cbd5e1;
                            font-size: 0.85rem;
                            margin-top: 0.5rem;
                            padding: 0.5rem;
                            background: rgba(99, 102, 241, 0.05);
                            border-radius: 4px;
                        ">
                            <span id="uncertainty-prediction">
                                通常の不確実性では、バランスを保ちます
                            </span>
                        </div>
                    </div>
                    
                    <!-- 時間圧力 -->
                    <div class="slider-container">
                        <label style="color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>時間圧力</span>
                            <span id="time-pressure-value">50%</span>
                        </label>
                        <input type="range" id="time-pressure-slider" 
                               min="0" max="100" value="50"
                               style="width: 100%;">
                        <div class="prediction" style="
                            color: #cbd5e1;
                            font-size: 0.85rem;
                            margin-top: 0.5rem;
                            padding: 0.5rem;
                            background: rgba(99, 102, 241, 0.05);
                            border-radius: 4px;
                        ">
                            <span id="time-pressure-prediction">
                                適度な時間制約は、効率的な行動を促します
                            </span>
                        </div>
                    </div>
                    
                    <!-- 社会的リスク -->
                    <div class="slider-container">
                        <label style="color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>社会的リスク</span>
                            <span id="social-risk-value">50%</span>
                        </label>
                        <input type="range" id="social-risk-slider" 
                               min="0" max="100" value="50"
                               style="width: 100%;">
                        <div class="prediction" style="
                            color: #cbd5e1;
                            font-size: 0.85rem;
                            margin-top: 0.5rem;
                            padding: 0.5rem;
                            background: rgba(99, 102, 241, 0.05);
                            border-radius: 4px;
                        ">
                            <span id="social-risk-prediction">
                                一般的な社会場面では、適度な調整で対応します
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // スライダーイベント設定
        this.setupSwitchLenses(data);
    }
    
    /**
     * Zone D: 不確かさの自覚とハンドオフ
     */
    renderZoneD(data) {
        const container = document.getElementById('zone-d-container') || this.createZoneContainer('d');
        
        const confidence = data.metrics.confidence || 0.5;
        const confidencePercent = Math.round(confidence * 100);
        
        container.innerHTML = `
            <div class="zone-d-handoff">
                <h3 style="color: #cbd5e1; margin-bottom: 1rem;">測定精度と次のステップ</h3>
                
                <!-- Confidence表示 -->
                <div class="confidence-meter" style="
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: #94a3b8;">測定確度</span>
                        <span style="color: ${this.getConfidenceColor(confidence)}; font-weight: bold;">
                            ${confidencePercent}%
                        </span>
                    </div>
                    <div style="
                        background: rgba(99, 102, 241, 0.1);
                        border-radius: 4px;
                        height: 8px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${confidencePercent}%;
                            height: 100%;
                            background: ${this.getConfidenceColor(confidence)};
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                </div>
                
                <!-- Blindspots表示 -->
                ${data.metrics.blindspots ? `
                    <div class="blindspots" style="
                        background: rgba(245, 158, 11, 0.05);
                        border: 1px solid rgba(245, 158, 11, 0.2);
                        border-radius: 8px;
                        padding: 1rem;
                        margin-bottom: 1rem;
                    ">
                        <h4 style="color: #f59e0b; margin-bottom: 0.5rem;">曖昧な領域</h4>
                        <ul style="color: #e5e7eb; margin: 0; padding-left: 1.5rem;">
                            ${data.metrics.blindspots.map(spot => `<li>${spot}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- 反例入力 -->
                <div style="margin-bottom: 1rem;">
                    <label style="color: #94a3b8; display: block; margin-bottom: 0.5rem;">
                        異なると感じる点があれば教えてください（100字以内）
                    </label>
                    <textarea id="user-disagreement" 
                              placeholder="例：対人が弱いとあるが、親密な場では積極的"
                              maxlength="100"
                              style="
                                  width: 100%;
                                  height: 60px;
                                  background: rgba(15, 23, 42, 0.6);
                                  border: 1px solid rgba(99, 102, 241, 0.2);
                                  border-radius: 4px;
                                  color: #e5e7eb;
                                  padding: 0.5rem;
                                  resize: none;
                              "></textarea>
                </div>
                
                <!-- ペイロードエクスポート -->
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="resultsPageV2.exportPayload('json')" style="
                        padding: 0.75rem 1.5rem;
                        background: rgba(99, 102, 241, 0.1);
                        border: 1px solid rgba(99, 102, 241, 0.3);
                        border-radius: 8px;
                        color: #6366f1;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        JSONダウンロード
                    </button>
                    
                    <button onclick="resultsPageV2.copyPayload()" style="
                        padding: 0.75rem 1.5rem;
                        background: rgba(139, 92, 246, 0.1);
                        border: 1px solid rgba(139, 92, 246, 0.3);
                        border-radius: 8px;
                        color: #8b5cf6;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        クリップボードにコピー
                    </button>
                </div>
            </div>
        `;
    }
    
    // ========== ヘルパーメソッド ==========
    
    createZoneContainer(zone) {
        const container = document.createElement('div');
        container.id = `zone-${zone}-container`;
        container.className = `zone-container zone-${zone}`;
        container.style.cssText = `
            margin: 2rem 0;
            padding: 1.5rem;
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 12px;
        `;
        
        const resultsContent = document.querySelector('#results-screen .results-content') ||
                              document.querySelector('.results-content');
        if (resultsContent) {
            resultsContent.appendChild(container);
        }
        
        return container;
    }
    
    generateInsightPrimitives(data) {
        const insights = [];
        const { synergy_edges, tension } = data.metrics;
        
        // Engine-Interface相互作用
        if (synergy_edges.EI > 0.6) {
            insights.push({
                text: '創造性と対人調整が高いシナジーを生み出しています',
                color: '#6366f1'
            });
        } else if (synergy_edges.EI < 0.3) {
            insights.push({
                text: '内的創造性と外的表現の間にギャップが存在します',
                color: '#f59e0b'
            });
        }
        
        // Interface-Safe相互作用
        if (synergy_edges.IS > 0.6) {
            insights.push({
                text: '対人配慮とリスク回避が協調的に機能しています',
                color: '#8b5cf6'
            });
        }
        
        // Engine-Safe相互作用
        if (synergy_edges.ES < 0.3 && tension > 0.5) {
            insights.push({
                text: '創造的衝動と安全志向の間に緊張が生じやすい',
                color: '#ef4444'
            });
        }
        
        // デフォルト
        if (insights.length === 0) {
            insights.push({
                text: '3つのOSがバランスよく機能しています',
                color: '#10b981'
            });
        }
        
        return insights;
    }
    
    render8DimensionBars(data) {
        const dimensions = [
            { name: '乾_創造性', value: 0.7, color: '#E74C3C' },
            { name: '震_行動性', value: 0.5, color: '#F39C12' },
            { name: '坎_探求性', value: 0.8, color: '#3498DB' },
            { name: '兌_調和性', value: 0.6, color: '#2ECC71' },
            { name: '離_表現性', value: 0.4, color: '#E67E22' },
            { name: '巽_適応性', value: 0.7, color: '#9B59B6' },
            { name: '艮_安定性', value: 0.5, color: '#1ABC9C' },
            { name: '坤_受容性', value: 0.6, color: '#34495E' }
        ];
        
        return dimensions.map(dim => `
            <div style="margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <span style="color: #94a3b8; font-size: 0.85rem;">${dim.name}</span>
                    <span style="color: #cbd5e1; font-size: 0.85rem;">${Math.round(dim.value * 100)}%</span>
                </div>
                <div style="
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 2px;
                    height: 4px;
                    overflow: hidden;
                ">
                    <div style="
                        width: ${dim.value * 100}%;
                        height: 100%;
                        background: ${dim.color};
                    "></div>
                </div>
            </div>
        `).join('');
    }
    
    setupSwitchLenses(data) {
        const sliders = {
            uncertainty: document.getElementById('uncertainty-slider'),
            timePressure: document.getElementById('time-pressure-slider'),
            socialRisk: document.getElementById('social-risk-slider')
        };
        
        Object.entries(sliders).forEach(([type, slider]) => {
            if (!slider) return;
            
            slider.addEventListener('input', (e) => {
                const value = e.target.value / 100;
                
                // 値表示更新
                document.getElementById(`${type.replace(/([A-Z])/g, '-$1').toLowerCase()}-value`).textContent = 
                    `${e.target.value}%`;
                
                // 予測更新
                const prediction = this.switchLensCalculator.getPrediction(type, value);
                document.getElementById(`${type.replace(/([A-Z])/g, '-$1').toLowerCase()}-prediction`).textContent = 
                    prediction;
                
                // 三角マップ更新
                this.updateTriangleMap(data);
            });
        });
    }
    
    updateTriangleMap(data) {
        const U = document.getElementById('uncertainty-slider').value / 100;
        const T = document.getElementById('time-pressure-slider').value / 100;
        const R = document.getElementById('social-risk-slider').value / 100;
        
        const adjusted = this.switchLensCalculator.calculate(U, T, R, data.scores);
        
        const fingerprint = new TripleOSFingerprint('triple-os-triangle');
        fingerprint.animateTransition(data.scores, adjusted);
    }
    
    getConfidenceColor(confidence) {
        if (confidence >= 0.75) return '#16A085';
        if (confidence >= 0.5) return '#F39C12';
        return '#E74C3C';
    }
    
    savePayload(payload) {
        localStorage.setItem('os_analyzer_payload', JSON.stringify(payload));
        localStorage.setItem('os_analyzer_timestamp', new Date().toISOString());
    }
    
    exportPayload(format) {
        const payload = localStorage.getItem('os_analyzer_payload');
        if (!payload) return;
        
        if (format === 'json') {
            const blob = new Blob([payload], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `os_analyzer_${new Date().toISOString()}.json`;
            a.click();
        }
    }
    
    copyPayload() {
        const payload = localStorage.getItem('os_analyzer_payload');
        if (!payload) return;
        
        navigator.clipboard.writeText(payload).then(() => {
            alert('ペイロードをクリップボードにコピーしました');
        });
    }
    
    showError(error) {
        console.error('Results page error:', error);
        // エラー表示実装
    }
}

// グローバルインスタンス作成
const resultsPageV2 = new ResultsPageV2();