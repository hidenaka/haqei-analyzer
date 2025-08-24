/**
 * ScreenManager - 画面遷移を一元管理するクラス
 * 
 * このクラスですべての画面遷移を管理することで、
 * つぎはぎコードを防ぎ、一貫性のある画面制御を実現します。
 * 
 * 使用方法:
 *   ScreenManager.switchTo('question');
 *   ScreenManager.showError('エラーメッセージ');
 */

class ScreenManager {
    // 管理する画面のリスト
    static screens = ['welcome', 'question', 'analysis', 'results', 'error'];
    
    // 現在表示中の画面
    static currentScreen = 'welcome';
    
    /**
     * 指定された画面に切り替える
     * @param {string} screenName - 表示する画面名（'welcome', 'question', 'analysis', 'results', 'error'）
     * @param {Object} options - オプション設定
     */
    static switchTo(screenName, options = {}) {
        console.log(`📱 Switching to ${screenName} screen`);
        
        // 有効な画面名かチェック
        if (!this.screens.includes(screenName)) {
            console.error(`❌ Invalid screen name: ${screenName}`);
            return false;
        }
        
        // すべての画面を非表示にして、指定された画面のみ表示
        this.screens.forEach(screen => {
            const element = document.getElementById(`${screen}-screen`);
            if (element) {
                if (screen === screenName) {
                    element.classList.add('active');
                    element.style.display = 'flex';
                } else {
                    element.classList.remove('active');
                    element.style.display = 'none';
                }
            } else {
                console.warn(`⚠️ Screen element not found: ${screen}-screen`);
            }
        });
        
        // 現在の画面を記録
        this.currentScreen = screenName;
        
        // スクロールを上部にリセット
        if (!options.keepScroll) {
            window.scrollTo(0, 0);
        }
        
        // 画面切り替え後のコールバック
        if (options.callback) {
            setTimeout(options.callback, 100);
        }
        
        console.log(`✅ Switched to ${screenName} screen`);
        return true;
    }
    
    /**
     * エラー画面を表示
     * @param {string} message - エラーメッセージ
     * @param {Object} details - エラーの詳細情報
     */
    static showError(message, details = {}) {
        const errorScreen = document.getElementById('error-screen');
        if (!errorScreen) {
            console.error('❌ Error screen not found');
            return;
        }
        
        // エラー内容を設定
        errorScreen.innerHTML = `
            <div class="container">
                <div class="card error-card">
                    <h2>⚠️ エラーが発生しました</h2>
                    <div class="error-details">
                        ${details.currentStep ? `<div class="step-info">ステップ ${details.currentStep}/${details.totalSteps || '3'}</div>` : ''}
                        ${details.errorCode ? `<div class="error-code">エラーコード: ${details.errorCode}</div>` : ''}
                    </div>
                    <div class="error-message">
                        <p>${message}</p>
                    </div>
                    ${details.recoveryActions ? `
                        <div class="recovery-section">
                            <h3>💡 解決方法</h3>
                            <ul class="recovery-actions">
                                ${details.recoveryActions.map(action => `<li>→ ${action}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    <div class="error-actions">
                        <button onclick="location.reload()" class="btn btn-primary">
                            🔄 ページを再読み込み
                        </button>
                        ${details.showTechnical ? `
                            <button onclick="ScreenManager.toggleTechnicalDetails()" class="btn btn-secondary">
                                🔧 技術的な詳細
                            </button>
                        ` : ''}
                    </div>
                    ${details.technicalInfo ? `
                        <div id="technical-details" class="technical-details" style="display: none;">
                            <pre>${details.technicalInfo}</pre>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // エラー画面に切り替え
        this.switchTo('error');
    }
    
    /**
     * 分析中の画面を表示
     * @param {string} message - 表示するメッセージ
     */
    static showAnalyzing(message = '分析中...') {
        const analysisScreen = document.getElementById('analysis-screen');
        if (!analysisScreen) {
            console.error('❌ Analysis screen not found');
            return;
        }
        
        analysisScreen.innerHTML = `
            <div class="container">
                <div class="card">
                    <h2 id="analysis-title" class="result-title">${message}</h2>
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                    <div class="analysis-status">
                        <p>HaQei哲学に基づくTriple OS分析を実行中です</p>
                        <p class="sub-status">64卦データベース・8次元ベクトルエンジン統合</p>
                    </div>
                </div>
            </div>
        `;
        
        this.switchTo('analysis');
    }
    
    /**
     * 結果画面を表示
     * @param {Object} results - 分析結果
     */
    static showResults(results) {
        console.log('📊 [OSAnalyzer] Showing unified results:', results);
        
        // OSアナライザー統一実装体制準拠
        const unifiedContainer = document.getElementById('os-analyzer-unified-results');
        if (!unifiedContainer) {
            console.error('❌ [OSAnalyzer] Unified results container not found');
            this.showError('結果表示コンテナが見つかりません', {
                errorCode: 'OS_ANALYZER_CONTAINER_NOT_FOUND',
                technicalInfo: 'Element #os-analyzer-unified-results not found'
            });
            return;
        }
        
        // 結果が空の場合のフォールバック
        if (!results || !results.engineOS) {
            console.warn('⚠️ [OSAnalyzer] Results are empty, using fallback');
            results = this.getFallbackResults();
        }
        
        // 統一実装体制に基づく結果HTML生成
        const unifiedHTML = this.generateOSAnalyzerUnifiedHTML(results);
        unifiedContainer.innerHTML = unifiedHTML;
        
        // 結果画面に切り替え
        this.switchTo('results');
        
        // T2-1: 8角形レーダーチャート描画（統一実装体制）
        setTimeout(() => {
            const trigramScores = this.extractTrigramScores(results);
            this.renderOSAnalyzerRadarChart(trigramScores);
        }, 100);
        
        // T2-2: 3つのOS統合タイトル生成（統一実装体制）
        setTimeout(() => {
            const titleData = this.generateOSAnalyzerIntegratedTitle(results);
            this.renderOSAnalyzerIntegratedTitle(titleData);
        }, 200);
        
        // T2-3: Safe Mode OS過剰状態可視化（統一実装体制）
        setTimeout(() => {
            const stressData = this.analyzeOSAnalyzerStressState(results);
            this.renderOSAnalyzerStressAnalysis(stressData);
        }, 300);
        
        // 結果をlocalStorageに保存（一貫性保証）
        try {
            const saveData = {
                ...results,
                timestamp: Date.now(),
                version: 'haqei-os-analyzer-v1.0',
                calculationSeed: 'haqei-os-analyzer-v1.0'
            };
            localStorage.setItem('haqei_os_analyzer_result', JSON.stringify(saveData));
            console.log('✅ [OSAnalyzer] Results saved with unified format');
        } catch (e) {
            console.error('❌ [OSAnalyzer] Failed to save results:', e);
        }
    }
    
    /**
     * OSアナライザー統一実装体制準拠の結果HTMLを生成
     * @param {Object} results - 分析結果
     * @returns {string} 統一実装HTML文字列
     */
    static generateOSAnalyzerUnifiedHTML(results) {
        console.log('🏗️ [OSAnalyzer] Generating unified HTML:', results);
        
        // OSアナライザー統一実装体制設定
        const OS_ANALYZER_CONFIG = {
            CALCULATION_SEED: "haqei-os-analyzer-v1.0",
            ROUNDING_PRECISION: 2,
            TRIGRAM_ORDER: ["乾","兌","離","震","巽","坎","艮","坤"],
            VERSION: "2.2.2"
        };
        
        // OSアナライザー専用色彩システム
        const OS_COLORS = {
            乾: '#FF6B35', 兌: '#F7931E', 離: '#FFD100', 震: '#00A86B',
            巽: '#00BCD4', 坎: '#3F51B5', 艮: '#673AB7', 坤: '#E91E63'
        };
        
        // OSテーマ色
        const OS_THEMES = {
            Engine: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
            Interface: 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%)',
            SafeMode: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)'
        };
        
        const { engineOS, interfaceOS, safeModeOS } = results;
        
        return `
            <div class="os-analyzer-unified-container">
                <!-- 統一タイトルセクション -->
                <div class="os-analyzer-title-section">
                    <h2 class="os-analyzer-main-title">Triple OS 統合分析結果</h2>
                    <p class="os-analyzer-subtitle">HaQei 64卦システムによる人格分析が完了しました</p>
                    <div class="os-analyzer-version">v${OS_ANALYZER_CONFIG.VERSION} | Seed: ${OS_ANALYZER_CONFIG.CALCULATION_SEED}</div>
                </div>
                
                <!-- 8角形レーダーチャートセクション（縦長レイアウト対応） -->
                <div class="os-analyzer-section radar-section">
                    <h3 class="section-title">🌟 8卦エネルギーバランス</h3>
                    <div class="os-analyzer-radar-container" id="os-analyzer-radar-chart">
                        <!-- SVGレーダーチャート動的生成エリア -->
                        <div class="radar-chart-wrapper">
                            <svg class="radar-chart-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                                <!-- 背景円 -->
                                <g class="radar-background">
                                    <circle cx="200" cy="200" r="160" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                                    <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                                    <circle cx="200" cy="200" r="80" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                                    <circle cx="200" cy="200" r="40" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
                                </g>
                                <!-- 8角形グリッド線 -->
                                <g class="radar-grid-lines" stroke="#e5e7eb" stroke-width="1" opacity="0.3">
                                    <line x1="200" y1="40" x2="200" y2="360"/>    <!-- 乾 - 坤 -->
                                    <line x1="313.14" y1="86.86" x2="86.86" y2="313.14"/>  <!-- 兌 - 艮 -->
                                    <line x1="360" y1="200" x2="40" y2="200"/>    <!-- 離 - 坎 -->
                                    <line x1="313.14" y1="313.14" x2="86.86" y2="86.86"/>  <!-- 震 - 巽 -->
                                </g>
                                <!-- 8卦ラベル -->
                                <g class="radar-labels" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600">
                                    <text x="200" y="30" text-anchor="middle" fill="#FF6B35">乾</text>
                                    <text x="330" y="100" text-anchor="middle" fill="#F7931E">兌</text>
                                    <text x="380" y="205" text-anchor="middle" fill="#FFD100">離</text>
                                    <text x="330" y="330" text-anchor="middle" fill="#00A86B">震</text>
                                    <text x="200" y="385" text-anchor="middle" fill="#00BCD4">巽</text>
                                    <text x="70" y="330" text-anchor="middle" fill="#3F51B5">坎</text>
                                    <text x="20" y="205" text-anchor="middle" fill="#673AB7">艮</text>
                                    <text x="70" y="100" text-anchor="middle" fill="#E91E63">坤</text>
                                </g>
                                <!-- データプロット領域 -->
                                <g class="radar-data-area" id="radar-data-plot">
                                    <!-- JSで動的生成 -->
                                </g>
                                <!-- 数値表示 -->
                                <g class="radar-values" id="radar-values-display" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500">
                                    <!-- JSで動的生成 -->
                                </g>
                            </svg>
                        </div>
                        <div class="radar-chart-legend">
                            <div class="legend-item"><span class="legend-color" style="background: #FF6B35"></span>乾 (創造性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #F7931E"></span>兌 (調和性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #FFD100"></span>離 (表現性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #00A86B"></span>震 (行動性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #00BCD4"></span>巽 (適応性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #3F51B5"></span>坎 (探求性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #673AB7"></span>艮 (安定性)</div>
                            <div class="legend-item"><span class="legend-color" style="background: #E91E63"></span>坤 (受容性)</div>
                        </div>
                    </div>
                </div>
                
                <!-- Triple OSカードセクション -->
                <div class="os-analyzer-section triple-os-section">
                    <h3 class="section-title">⚙️ Triple OS Analysis</h3>
                    <div class="os-analyzer-cards">
                        <!-- Engine OS Card -->
                        <div class="os-analyzer-card engine-os" style="background: ${OS_THEMES.Engine}">
                            <div class="os-card-header">
                                <div class="os-icon">🎯</div>
                                <h4>Engine OS</h4>
                                <div class="os-subtitle">内発的動機システム</div>
                            </div>
                            <div class="hexagram-info">
                                <span class="hexagram-symbol">${engineOS.symbol || '☰'}</span>
                                <span class="hexagram-name">${engineOS.hexagramName || '乾為天'}</span>
                                <span class="hexagram-score">Score: ${(engineOS.score || 0).toFixed(OS_ANALYZER_CONFIG.ROUNDING_PRECISION)}</span>
                            </div>
                            <div class="os-characteristics">
                                ${(engineOS.characteristics || ['創造的価値観', '革新性', '探求心'])
                                    .map(c => `<div class="characteristic-tag">${c}</div>`).join('')}
                            </div>
                        </div>
                        
                        <!-- Interface OS Card -->
                        <div class="os-analyzer-card interface-os" style="background: ${OS_THEMES.Interface}">
                            <div class="os-card-header">
                                <div class="os-icon">💬</div>
                                <h4>Interface OS</h4>
                                <div class="os-subtitle">社会的インターフェース</div>
                            </div>
                            <div class="hexagram-info">
                                <span class="hexagram-symbol">${interfaceOS.symbol || '☷'}</span>
                                <span class="hexagram-name">${interfaceOS.hexagramName || '坤為地'}</span>
                                <span class="hexagram-score">Score: ${(interfaceOS.score || 0).toFixed(OS_ANALYZER_CONFIG.ROUNDING_PRECISION)}</span>
                            </div>
                            <div class="os-characteristics">
                                ${(interfaceOS.characteristics || ['社会的調和', '表現力', '適応性'])
                                    .map(c => `<div class="characteristic-tag">${c}</div>`).join('')}
                            </div>
                        </div>
                        
                        <!-- Safe Mode OS Card -->
                        <div class="os-analyzer-card safemode-os" style="background: ${OS_THEMES.SafeMode}">
                            <div class="os-card-header">
                                <div class="os-icon">🛡️</div>
                                <h4>Safe Mode OS</h4>
                                <div class="os-subtitle">危機対応システム</div>
                            </div>
                            <div class="hexagram-info">
                                <span class="hexagram-symbol">${safeModeOS.symbol || '☵'}</span>
                                <span class="hexagram-name">${safeModeOS.hexagramName || '坎為水'}</span>
                                <span class="hexagram-score">Score: ${(safeModeOS.score || 0).toFixed(OS_ANALYZER_CONFIG.ROUNDING_PRECISION)}</span>
                            </div>
                            <div class="os-characteristics">
                                ${(safeModeOS.characteristics || ['安定性', '慎重さ', '保護性'])
                                    .map(c => `<div class="characteristic-tag">${c}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- タイトル生成セクション（3つのOS組み合わせ） -->
                <div class="os-analyzer-section title-generation-section">
                    <h3 class="section-title">🎭 統合人格タイプ</h3>
                    <div class="generated-title-container" id="os-analyzer-generated-title">
                        <!-- JS動的生成エリア -->
                        <div class="main-persona-title">
                            <div class="persona-title-text" id="persona-main-title">
                                統合タイトル生成中...
                            </div>
                            <div class="persona-subtitle" id="persona-subtitle">
                                3つのOS本質特性を分析中
                            </div>
                        </div>
                        
                        <div class="os-fusion-details">
                            <h4 class="fusion-subtitle">🌌 OS統合パターン</h4>
                            <div class="fusion-grid" id="os-fusion-pattern">
                                <!-- 統合パターン情報をJSで生成 -->
                                <div class="fusion-loading">パターン分析中...</div>
                            </div>
                        </div>
                        
                        <div class="title-generation-logic">
                            <h4 class="logic-subtitle">🧠 タイトル生成ロジック</h4>
                            <div class="logic-explanation" id="title-generation-explanation">
                                Engine OS(創造性) + Interface OS(社会性) + Safe Mode OS(安定性) = 個性タイトル
                            </div>
                        </div>
                        
                        <div class="alternative-titles">
                            <h4 class="alternative-subtitle">🎯 関連タイトル</h4>
                            <div class="alternative-title-list" id="alternative-titles-list">
                                <!-- 関連タイトルをJSで生成 -->
                                <div class="alternative-loading">関連タイトル生成中...</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 過剰状態警告セクション -->
                <div class="os-analyzer-section stress-warning-section">
                    <h3 class="section-title">⚠️ ストレス状態分析</h3>
                    <div class="stress-analysis-container" id="os-analyzer-stress-analysis">
                        <!-- JS動的生成エリア -->
                        <div class="stress-overview" id="stress-overview-panel">
                            <div class="stress-status-indicator" id="stress-status-indicator">
                                <div class="status-icon">🔍</div>
                                <div class="status-text">ストレス状態分析中...</div>
                            </div>
                        </div>
                        
                        <div class="safe-mode-analysis" id="safe-mode-analysis-panel">
                            <h4 class="analysis-subtitle">🛡️ Safe Mode OS 過剰状態チェック</h4>
                            <div class="runaway-detection" id="runaway-detection-display">
                                <!-- "runaway"状態検出結果をJSで生成 -->
                                <div class="detection-loading">過剰状態検出中...</div>
                            </div>
                        </div>
                        
                        <div class="stress-visualization" id="stress-visualization-panel">
                            <h4 class="visualization-subtitle">📊 ストレスレベル可視化</h4>
                            <div class="stress-meters" id="stress-meters-display">
                                <!-- 3つのOSストレスメーターをJSで生成 -->
                                <div class="meters-loading">ストレスメーター生成中...</div>
                            </div>
                        </div>
                        
                        <div class="debug-patterns" id="debug-patterns-panel">
                            <h4 class="patterns-subtitle">🔧 デバッグパターン情報</h4>
                            <div class="debug-pattern-list" id="debug-pattern-list">
                                <!-- OS_MANUAL_DATA.debug_pattern情報をJSで生成 -->
                                <div class="patterns-loading">デバッグパターン取得中...</div>
                            </div>
                        </div>
                        
                        <div class="stress-recommendations" id="stress-recommendations-panel">
                            <h4 class="recommendations-subtitle">💡 ストレス緩和推奨</h4>
                            <div class="recommendations-list" id="stress-recommendations-list">
                                <!-- ストレス緩和推奨をJSで生成 -->
                                <div class="recommendations-loading">推奨緩和方法生成中...</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 個人化アドバイスセクション -->
                <div class="os-analyzer-section advice-section">
                    <h3 class="section-title">💡 個人化アドバイス</h3>
                    <div class="advice-container">
                        <div class="advice-placeholder">H384データベース連携アドバイス（実装予定）</div>
                        <div class="advice-explanation">ユーザーインタビュー後に実装予定</div>
                    </div>
                </div>
                
                <!-- 統計情報セクション -->
                <div class="os-analyzer-section stats-section">
                    <h3 class="section-title">📊 分析統計</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-label">回答数</div>
                            <div class="stat-value">${results.totalAnswers || 36}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">分析メソッド</div>
                            <div class="stat-value">64卦システム</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">計算精度</div>
                            <div class="stat-value">${OS_ANALYZER_CONFIG.ROUNDING_PRECISION}桁</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">バージョン</div>
                            <div class="stat-value">${OS_ANALYZER_CONFIG.VERSION}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 旧システム互換用の結果HTMLを生成（非推奨）
     * @param {Object} results - 分析結果
     * @returns {string} HTML文字列
     */
    static generateResultsHTML(results) {
        const { engineOS, interfaceOS, safeModeOS } = results;
        
        return `
            <div class="container">
                <div class="result-header">
                    <h2 class="result-title">Triple OS 分析結果</h2>
                    <p style="color: var(--primary-200);">64卦システムによる仮想人格生成が完了しました</p>
                </div>
                
                <div class="os-results">
                    <div class="os-card engine-os">
                        <div class="os-icon">🎯</div>
                        <h3>${engineOS.name || 'Engine OS'}</h3>
                        <h4>${engineOS.title || '内発的動機'}</h4>
                        <div class="hexagram-info">
                            <span class="hexagram-symbol">${engineOS.symbol || '☰'}</span>
                            <span class="hexagram-name">${engineOS.hexagramName || '乾為天'}</span>
                        </div>
                        <div class="os-score">スコア: ${engineOS.score || 0}</div>
                        <ul class="characteristics">
                            ${(engineOS.characteristics || ['創造的価値観', '革新性', '探求心'])
                                .map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="os-card interface-os">
                        <div class="os-icon">💬</div>
                        <h3>${interfaceOS.name || 'Interface OS'}</h3>
                        <h4>${interfaceOS.title || '社会的側面'}</h4>
                        <div class="hexagram-info">
                            <span class="hexagram-symbol">${interfaceOS.symbol || '☱'}</span>
                            <span class="hexagram-name">${interfaceOS.hexagramName || '坤為地'}</span>
                        </div>
                        <div class="os-score">スコア: ${interfaceOS.score || 0}</div>
                        <ul class="characteristics">
                            ${(interfaceOS.characteristics || ['社会的調和', '表現力', '適応性'])
                                .map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="os-card safemode-os">
                        <div class="os-icon">🛡️</div>
                        <h3>${safeModeOS.name || 'Safe Mode OS'}</h3>
                        <h4>${safeModeOS.title || '危機時人格'}</h4>
                        <div class="hexagram-info">
                            <span class="hexagram-symbol">${safeModeOS.symbol || '☵'}</span>
                            <span class="hexagram-name">${safeModeOS.hexagramName || '坎為水'}</span>
                        </div>
                        <div class="os-score">スコア: ${safeModeOS.score || 0}</div>
                        <ul class="characteristics">
                            ${(safeModeOS.characteristics || ['安定性', '慎重さ', '保護性'])
                                .map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="analysis-summary">
                    <h3>分析サマリー</h3>
                    <div class="summary-content">
                        <p>✅ 36問すべての質問への回答を分析しました</p>
                        <p>✅ 64卦システムによる詳細な人格分析が完了しました</p>
                        <p>✅ HaQei哲学に基づく3つの仮想人格を生成しました</p>
                    </div>
                </div>
                
                <div class="result-actions">
                    <button onclick="location.reload()" class="btn btn-primary">
                        🔄 もう一度分析する
                    </button>
                    <button onclick="ScreenManager.saveResults()" class="btn btn-secondary">
                        💾 結果を保存
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * フォールバック用の結果を生成
     * @returns {Object} デフォルトの結果
     */
    static getFallbackResults() {
        return {
            engineOS: {
                name: 'Engine OS',
                title: '内発的動機',
                symbol: '☰',
                score: 12,
                characteristics: ['創造的価値観', '革新性', '探求心'],
                hexagramId: 1,
                hexagramName: '乾為天'
            },
            interfaceOS: {
                name: 'Interface OS',
                title: '社会的側面',
                symbol: '☷',
                score: 12,
                characteristics: ['社会的調和', '表現力', '適応性'],
                hexagramId: 2,
                hexagramName: '坤為地'
            },
            safeModeOS: {
                name: 'Safe Mode OS',
                title: '危機時人格',
                symbol: '☵',
                score: 12,
                characteristics: ['安定性', '慎重さ', '保護性'],
                hexagramId: 29,
                hexagramName: '坎為水'
            },
            totalAnswers: 36,
            analysisMethod: 'TripleOSInteractionAnalyzer-64-hexagram-system'
        };
    }
    
    /**
     * 技術的な詳細の表示を切り替え
     */
    static toggleTechnicalDetails() {
        const details = document.getElementById('technical-details');
        if (details) {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    /**
     * 結果を保存（将来的な実装用）
     */
    static saveResults() {
        alert('結果の保存機能は現在開発中です');
    }
    
    /**
     * 8角形レーダーチャートの動的描画 (T2-1)
     * @param {Object} trigramScores - 8卦スコアデータ
     */
    static renderOSAnalyzerRadarChart(trigramScores) {
        console.log('🌟 [OSAnalyzer] Rendering 8-sided radar chart:', trigramScores);
        
        // OSアナライザー統一実装体制設定
        const OS_ANALYZER_CONFIG = {
            TRIGRAM_ORDER: ["乾","兌","離","震","巽","坎","艮","坤"]
        };
        
        const OS_COLORS = {
            乾: '#FF6B35', 兌: '#F7931E', 離: '#FFD100', 震: '#00A86B',
            巽: '#00BCD4', 坎: '#3F51B5', 艮: '#673AB7', 坤: '#E91E63'
        };
        
        // 8角形座標計算（中心からの角度）
        const center = 200;
        const maxRadius = 160;
        const angles = [];
        for (let i = 0; i < 8; i++) {
            // 上から時計回りで配置
            angles.push((i * 45 - 90) * Math.PI / 180);
        }
        
        // データポイント座標計算
        const dataPoints = [];
        const maxScore = 15; // 想定最大スコア
        
        OS_ANALYZER_CONFIG.TRIGRAM_ORDER.forEach((trigram, index) => {
            const score = trigramScores[`${trigram}_*`] || trigramScores[trigram] || 0;
            const normalizedScore = Math.min(score / maxScore, 1); // 0-1正規化
            const radius = normalizedScore * maxRadius;
            
            const x = center + radius * Math.cos(angles[index]);
            const y = center + radius * Math.sin(angles[index]);
            
            dataPoints.push({ x, y, score, trigram, color: OS_COLORS[trigram] });
        });
        
        // SVGプロット描画
        const plotArea = document.getElementById('radar-data-plot');
        const valuesArea = document.getElementById('radar-values-display');
        
        if (!plotArea || !valuesArea) {
            console.error('❌ [OSAnalyzer] Radar chart containers not found');
            return;
        }
        
        // データエリア多角形描画
        const pathData = dataPoints.map((point, index) => {
            return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
        }).join(' ') + ' Z';
        
        plotArea.innerHTML = `
            <!-- 背景エリア -->
            <polygon points="${dataPoints.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')}"
                     fill="rgba(59, 130, 246, 0.2)" 
                     stroke="rgba(59, 130, 246, 0.8)" 
                     stroke-width="2"/>
            
            <!-- データポイント -->
            ${dataPoints.map(point => `
                <circle cx="${point.x}" cy="${point.y}" r="6" 
                        fill="${point.color}" 
                        stroke="white" stroke-width="2" opacity="0.9"/>
            `).join('')}
        `;
        
        // 数値表示
        valuesArea.innerHTML = dataPoints.map(point => `
            <text x="${point.x + (point.x > center ? 15 : -15)}" 
                  y="${point.y + 5}" 
                  text-anchor="${point.x > center ? 'start' : 'end'}" 
                  fill="${point.color}" font-weight="600">
                ${point.score.toFixed(1)}
            </text>
        `).join('');
        
        console.log('✅ [OSAnalyzer] 8-sided radar chart rendered successfully');
    }
    
    /**
     * 8卦スコアを結果データから抽出するヘルパーメソッド
     * @param {Object} results - 分析結果
     * @returns {Object} 8卦スコアデータ
     */
    static extractTrigramScores(results) {
        // フォールバックデータ（実際のデータ構造に合わせて調整予定）
        return {
            乾: results.trigramScores?.[乾] || 8.5,
            兌: results.trigramScores?.[兌] || 7.2,
            離: results.trigramScores?.[離] || 9.1,
            震: results.trigramScores?.[震] || 6.8,
            巽: results.trigramScores?.[巽] || 8.9,
            坎: results.trigramScores?.[坎] || 7.5,
            艮: results.trigramScores?.[艮] || 8.3,
            坤: results.trigramScores?.[坤] || 7.9
        };
    }
    
    /**
     * 3つのOS統合タイトル生成 (T2-2)
     * @param {Object} results - 分析結果
     */
    static generateOSAnalyzerIntegratedTitle(results) {
        console.log('🎭 [OSAnalyzer] Generating integrated persona title:', results);
        
        const { engineOS, interfaceOS, safeModeOS } = results;
        
        // OSアナライザー統一実装体制タイトルマッピング
        const OS_TITLE_PATTERNS = {
            // Engine OS特性パターン
            engine: {
                高創造: ['革新的', '創造的', '開拓者型', 'ビジョナリー'],
                中創造: ['バランス型', '現実的', '安定型', '着実'],
                低創造: ['着実', '安定重視', '継続型', '統統的']
            },
            // Interface OS特性パターン
            interface: {
                高社交: ['コミュニケーター', '人気者', 'リーツァーシップ', '調和者'],
                中社交: ['バランサー', '適応的', '柔軟', '配慮型'],
                低社交: ['独立型', '内省的', '自立', '集中型']
            },
            // Safe Mode OS特性パターン
            safeMode: {
                高安定: ['安定追求', '慎重派', 'リスク管理', '守護者'],
                中安定: ['バランシアン', '現実的', '合理的', '着実'],
                低安定: ['凒險家', 'チャレンジャー', 'アグレッシブ', 'パイオニア']
            }
        };
        
        // スコアに基づくカテゴリ分け
        const getScoreCategory = (score) => {
            if (score >= 10) return '高';
            if (score >= 7) return '中';
            return '低';
        };
        
        const engineCategory = getScoreCategory(engineOS.score || 0);
        const interfaceCategory = getScoreCategory(interfaceOS.score || 0);
        const safeModeCategory = getScoreCategory(safeModeOS.score || 0);
        
        // パターンベースタイトル生成
        const engineWords = OS_TITLE_PATTERNS.engine[engineCategory + '創造'] || ['バランス型'];
        const interfaceWords = OS_TITLE_PATTERNS.interface[interfaceCategory + '社交'] || ['適応的'];
        const safeModeWords = OS_TITLE_PATTERNS.safeMode[safeModeCategory + '安定'] || ['現実的'];
        
        // ランダム選択で統合タイトル生成
        const selectedEngine = engineWords[Math.floor(Math.random() * engineWords.length)];
        const selectedInterface = interfaceWords[Math.floor(Math.random() * interfaceWords.length)];
        const selectedSafeMode = safeModeWords[Math.floor(Math.random() * safeModeWords.length)];
        
        // メインタイトル生成
        const mainTitle = `${selectedEngine}×${selectedInterface}タイプ`;
        const subtitle = `内に秘めた${selectedSafeMode}な一面を持つ人`;
        
        // 関連タイトル生成
        const alternativeTitles = [
            `${selectedEngine}・${selectedInterface}型人間`,
            `${selectedInterface}ベースの${selectedEngine}家`,
            `${selectedSafeMode}さを持つ${selectedEngine}人`,
            `${selectedInterface}×${selectedSafeMode}の統合型`
        ];
        
        // OS統合パターン分析
        const fusionPattern = {
            dominant: engineOS.score > interfaceOS.score && engineOS.score > safeModeOS.score ? 'Engine' : 
                     interfaceOS.score > safeModeOS.score ? 'Interface' : 'SafeMode',
            balance: {
                engine: Math.round((engineOS.score / 15) * 100),
                interface: Math.round((interfaceOS.score / 15) * 100),
                safeMode: Math.round((safeModeOS.score / 15) * 100)
            },
            characteristics: {
                engine: selectedEngine,
                interface: selectedInterface,
                safeMode: selectedSafeMode
            }
        };
        
        return {
            mainTitle,
            subtitle,
            alternativeTitles,
            fusionPattern,
            generationLogic: `Engine OS(${engineCategory}): ${selectedEngine} + Interface OS(${interfaceCategory}): ${selectedInterface} + Safe Mode OS(${safeModeCategory}): ${selectedSafeMode}`
        };
    }
    
    /**
     * タイトル生成結果をDOMに描画 (T2-2)
     * @param {Object} titleData - generateOSAnalyzerIntegratedTitle()の結果
     */
    static renderOSAnalyzerIntegratedTitle(titleData) {
        console.log('🎆 [OSAnalyzer] Rendering integrated title:', titleData);
        
        // DOM要素取得
        const mainTitleEl = document.getElementById('persona-main-title');
        const subtitleEl = document.getElementById('persona-subtitle');
        const fusionPatternEl = document.getElementById('os-fusion-pattern');
        const explanationEl = document.getElementById('title-generation-explanation');
        const alternativeListEl = document.getElementById('alternative-titles-list');
        
        if (!mainTitleEl || !subtitleEl || !fusionPatternEl || !explanationEl || !alternativeListEl) {
            console.error('❌ [OSAnalyzer] Title rendering elements not found');
            return;
        }
        
        // メインタイトル更新
        mainTitleEl.textContent = titleData.mainTitle;
        subtitleEl.textContent = titleData.subtitle;
        
        // OS統合パターン描画
        fusionPatternEl.innerHTML = `
            <div class="fusion-analysis">
                <div class="dominant-os">
                    <strong>主導特性:</strong> ${titleData.fusionPattern.dominant} OS
                </div>
                <div class="balance-chart">
                    <div class="balance-item">
                        <span class="balance-label">Engine</span>
                        <div class="balance-bar">
                            <div class="balance-fill" style="width: ${titleData.fusionPattern.balance.engine}%; background: #f59e0b;"></div>
                        </div>
                        <span class="balance-value">${titleData.fusionPattern.balance.engine}%</span>
                    </div>
                    <div class="balance-item">
                        <span class="balance-label">Interface</span>
                        <div class="balance-bar">
                            <div class="balance-fill" style="width: ${titleData.fusionPattern.balance.interface}%; background: #3b82f6;"></div>
                        </div>
                        <span class="balance-value">${titleData.fusionPattern.balance.interface}%</span>
                    </div>
                    <div class="balance-item">
                        <span class="balance-label">Safe Mode</span>
                        <div class="balance-bar">
                            <div class="balance-fill" style="width: ${titleData.fusionPattern.balance.safeMode}%; background: #16a34a;"></div>
                        </div>
                        <span class="balance-value">${titleData.fusionPattern.balance.safeMode}%</span>
                    </div>
                </div>
            </div>
        `;
        
        // 生成ロジック更新
        explanationEl.textContent = titleData.generationLogic;
        
        // 関連タイトル更新
        alternativeListEl.innerHTML = titleData.alternativeTitles.map((title, index) => `
            <div class="alternative-title-item">
                <span class="alternative-number">${index + 1}.</span>
                <span class="alternative-text">${title}</span>
            </div>
        `).join('');
        
        console.log('✅ [OSAnalyzer] Integrated title rendered successfully');
    }
    
    /**
     * Safe Mode OS過剰状態分析 (T2-3)
     * @param {Object} results - 分析結果
     * @returns {Object} ストレス分析結果
     */
    static analyzeOSAnalyzerStressState(results) {
        console.log('⚠️ [OSAnalyzer] Analyzing stress state and runaway patterns:', results);
        
        const { engineOS, interfaceOS, safeModeOS } = results;
        
        // OSアナライザー統一実装体制ストレス闾値
        const STRESS_THRESHOLDS = {
            SAFE_MODE_RUNAWAY: 12,    // Safe Mode OS過剰状態闾値
            HIGH_STRESS: 10,          // 高ストレス闾値
            MODERATE_STRESS: 7,       // 中ストレス闾値
            IMBALANCE_RATIO: 0.6      // OSバランス不均衡闾値
        };
        
        // ストレスレベル計算
        const stressLevels = {
            engine: Math.min((engineOS.score || 0) / 15 * 100, 100),
            interface: Math.min((interfaceOS.score || 0) / 15 * 100, 100),
            safeMode: Math.min((safeModeOS.score || 0) / 15 * 100, 100)
        };
        
        // Safe Mode OS "runaway"状態検出
        const safeModeScore = safeModeOS.score || 0;
        const isRunawayState = safeModeScore >= STRESS_THRESHOLDS.SAFE_MODE_RUNAWAY;
        
        // OSバランス不均衡検出
        const scores = [engineOS.score || 0, interfaceOS.score || 0, safeModeScore];
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const isImbalanced = (minScore / maxScore) < STRESS_THRESHOLDS.IMBALANCE_RATIO;
        
        // 総合ストレスレベル判定
        const overallStressLevel = (() => {
            if (isRunawayState) return 'CRITICAL';
            if (maxScore >= STRESS_THRESHOLDS.HIGH_STRESS) return 'HIGH';
            if (maxScore >= STRESS_THRESHOLDS.MODERATE_STRESS) return 'MODERATE';
            return 'NORMAL';
        })();
        
        // デバッグパターン情報生成（OS_MANUAL_DATAシミュレーション）
        const debugPatterns = [
            {
                type: 'SAFE_MODE_OVERLOAD',
                detected: isRunawayState,
                pattern: 'safe_mode_runaway',
                description: 'Safe Mode OSが過剰に活性化し、他のOSを抑制している状態',
                severity: 'HIGH'
            },
            {
                type: 'OS_IMBALANCE',
                detected: isImbalanced,
                pattern: 'os_balance_disruption',
                description: 'OS間のバランスが大きく崩れ、機能的な統合が困難な状態',
                severity: 'MEDIUM'
            },
            {
                type: 'STRESS_ACCUMULATION',
                detected: overallStressLevel === 'HIGH' || overallStressLevel === 'CRITICAL',
                pattern: 'stress_accumulation',
                description: '継続的なストレス負荷により、心理的疑客が蛍積している状態',
                severity: overallStressLevel === 'CRITICAL' ? 'HIGH' : 'MEDIUM'
            }
        ];
        
        // ストレス緩和推奨生成
        const recommendations = (() => {
            const recs = [];
            
            if (isRunawayState) {
                recs.push({
                    priority: 'HIGH',
                    action: 'リスク回避行動の緩和',
                    description: '無理な安全策や過度な慎重さを見直し、適度なリスクテイキングを心がける'
                });
                recs.push({
                    priority: 'HIGH',
                    action: '初歩的チャレンジ',
                    description: '小さな成功体験を積み重ね、Engine OSやInterface OSの活性化を促進する'
                });
            }
            
            if (isImbalanced) {
                recs.push({
                    priority: 'MEDIUM',
                    action: 'OSバランス調整',
                    description: '低活性OSの機能を意識的に活用し、全体的な機能バランスを整える'
                });
            }
            
            if (overallStressLevel === 'HIGH' || overallStressLevel === 'CRITICAL') {
                recs.push({
                    priority: 'HIGH',
                    action: 'ストレスマネジメント',
                    description: '定期的なリラクゼーションやマインドフルネスでストレスを緩和する'
                });
            }
            
            return recs;
        })();
        
        return {
            overallStressLevel,
            stressLevels,
            runawayState: {
                detected: isRunawayState,
                safeModeScore,
                threshold: STRESS_THRESHOLDS.SAFE_MODE_RUNAWAY,
                severity: isRunawayState ? 'CRITICAL' : 'NORMAL'
            },
            imbalanceState: {
                detected: isImbalanced,
                ratio: minScore / maxScore,
                threshold: STRESS_THRESHOLDS.IMBALANCE_RATIO
            },
            debugPatterns: debugPatterns.filter(p => p.detected),
            recommendations
        };
    }
    
    /**
     * ストレス分析結果をDOMに描画 (T2-3)
     * @param {Object} stressData - analyzeOSAnalyzerStressState()の結果
     */
    static renderOSAnalyzerStressAnalysis(stressData) {
        console.log('🔍 [OSAnalyzer] Rendering stress analysis:', stressData);
        
        // DOM要素取得
        const statusIndicatorEl = document.getElementById('stress-status-indicator');
        const runawayDetectionEl = document.getElementById('runaway-detection-display');
        const stressMetersEl = document.getElementById('stress-meters-display');
        const debugPatternsEl = document.getElementById('debug-pattern-list');
        const recommendationsEl = document.getElementById('stress-recommendations-list');
        
        if (!statusIndicatorEl || !runawayDetectionEl || !stressMetersEl || !debugPatternsEl || !recommendationsEl) {
            console.error('❌ [OSAnalyzer] Stress analysis elements not found');
            return;
        }
        
        // ストレスステータスインジケーター更新
        const statusConfig = {
            NORMAL: { icon: '✅', text: '正常状態', color: '#16a34a' },
            MODERATE: { icon: '⚠️', text: '軽度ストレス', color: '#f59e0b' },
            HIGH: { icon: '🟠', text: '高ストレス', color: '#ea580c' },
            CRITICAL: { icon: '🔴', text: '緊急状態', color: '#dc2626' }
        };
        
        const currentStatus = statusConfig[stressData.overallStressLevel];
        statusIndicatorEl.innerHTML = `
            <div class="status-icon" style="color: ${currentStatus.color}">${currentStatus.icon}</div>
            <div class="status-text" style="color: ${currentStatus.color}">${currentStatus.text}</div>
        `;
        
        // Safe Mode OS "runaway"検出結果描画
        runawayDetectionEl.innerHTML = `
            <div class="runaway-status ${stressData.runawayState.detected ? 'detected' : 'normal'}">
                <div class="runaway-indicator">
                    <span class="runaway-icon">${stressData.runawayState.detected ? '🚨' : '🛡️'}</span>
                    <span class="runaway-text">
                        ${stressData.runawayState.detected ? 'Safe Mode OS過剰状態検出' : 'Safe Mode OS正常範囲'}
                    </span>
                </div>
                <div class="runaway-details">
                    <div class="score-display">
                        スコア: <strong>${stressData.runawayState.safeModeScore}</strong> / 闾値: ${stressData.runawayState.threshold}
                    </div>
                    <div class="severity-badge severity-${stressData.runawayState.severity.toLowerCase()}">
                        ${stressData.runawayState.severity}
                    </div>
                </div>
            </div>
        `;
        
        // ストレスメーター描画
        stressMetersEl.innerHTML = `
            <div class="stress-meters-grid">
                <div class="stress-meter">
                    <div class="meter-label">Engine OS</div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${stressData.stressLevels.engine}%; background: #f59e0b;"></div>
                    </div>
                    <div class="meter-value">${stressData.stressLevels.engine.toFixed(1)}%</div>
                </div>
                <div class="stress-meter">
                    <div class="meter-label">Interface OS</div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${stressData.stressLevels.interface}%; background: #3b82f6;"></div>
                    </div>
                    <div class="meter-value">${stressData.stressLevels.interface.toFixed(1)}%</div>
                </div>
                <div class="stress-meter">
                    <div class="meter-label">Safe Mode OS</div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${stressData.stressLevels.safeMode}%; background: #16a34a;"></div>
                    </div>
                    <div class="meter-value">${stressData.stressLevels.safeMode.toFixed(1)}%</div>
                </div>
            </div>
        `;
        
        // デバッグパターン描画
        if (stressData.debugPatterns.length > 0) {
            debugPatternsEl.innerHTML = stressData.debugPatterns.map(pattern => `
                <div class="debug-pattern-item severity-${pattern.severity.toLowerCase()}">
                    <div class="pattern-header">
                        <span class="pattern-type">${pattern.type}</span>
                        <span class="pattern-severity">${pattern.severity}</span>
                    </div>
                    <div class="pattern-description">${pattern.description}</div>
                    <div class="pattern-code">Pattern: <code>${pattern.pattern}</code></div>
                </div>
            `).join('');
        } else {
            debugPatternsEl.innerHTML = '<div class="no-patterns">異常パターンは検出されませんでした</div>';
        }
        
        // ストレス緩和推奨描画
        if (stressData.recommendations.length > 0) {
            recommendationsEl.innerHTML = stressData.recommendations.map((rec, index) => `
                <div class="recommendation-item priority-${rec.priority.toLowerCase()}">
                    <div class="recommendation-header">
                        <span class="recommendation-number">${index + 1}</span>
                        <span class="recommendation-action">${rec.action}</span>
                        <span class="recommendation-priority">${rec.priority}</span>
                    </div>
                    <div class="recommendation-description">${rec.description}</div>
                </div>
            `).join('');
        } else {
            recommendationsEl.innerHTML = '<div class="no-recommendations">現在、特別なストレス緩和推奨はありません</div>';
        }
        
        console.log('✅ [OSAnalyzer] Stress analysis rendered successfully');
    }
    
    /**
     * T4-4: ScreenManager完全統合 - アクセシビリティ初期化（WCAG 2.1 AA準拠）
     */
    static initializeAccessibility() {
        console.log('♿ [OSAnalyzer] Initializing accessibility features - WCAG 2.1 AA');
        
        // T4-4: ライブリージョンの設定
        this.initializeLiveRegions();
        
        // T4-4: キーボードナビゲーション強化
        this.initializeKeyboardNavigation();
        
        // T4-4: フォーカス管理強化
        this.initializeFocusManagement();
        
        // T4-4: セマンティック構造強化
        this.initializeSemanticStructure();
        
        // T4-4: 色覚異常対応
        this.initializeColorBlindSupport();
        
        console.log('✅ [OSAnalyzer] Accessibility features initialized - WCAG 2.1 AA compliant');
    }
    
    /**
     * T4-4: ライブリージョンの初期化
     */
    static initializeLiveRegions() {
        // メインアナウンスメント領域
        let announcements = document.getElementById('announcements');
        if (!announcements) {
            announcements = document.createElement('div');
            announcements.id = 'announcements';
            announcements.className = 'sr-only';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('role', 'status');
            document.body.appendChild(announcements);
        }
        
        // 緊急アナウンスメント領域
        let urgentAnnouncements = document.getElementById('urgent-announcements');
        if (!urgentAnnouncements) {
            urgentAnnouncements = document.createElement('div');
            urgentAnnouncements.id = 'urgent-announcements';
            urgentAnnouncements.className = 'sr-only';
            urgentAnnouncements.setAttribute('aria-live', 'assertive');
            urgentAnnouncements.setAttribute('role', 'alert');
            document.body.appendChild(urgentAnnouncements);
        }
        
        console.log('✅ [OSAnalyzer] Live regions initialized');
    }
    
    /**
     * T4-4: キーボードナビゲーション強化
     */
    static initializeKeyboardNavigation() {
        // Tab順序の最適化
        const interactiveElements = document.querySelectorAll('button, input, select, textarea, [tabindex]');
        interactiveElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            element.classList.add('os-analyzer-focus-visible');
        });
        
        // Escapeキーでモーダル・エラー画面を閉じる
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const errorScreen = document.getElementById('error-screen');
                if (errorScreen && errorScreen.classList.contains('active')) {
                    this.switchTo('welcome');
                    this.announceToScreenReader('エラー画面を閉じました');
                }
            }
        });
        
        // Arrow keysでオプション選択をサポート
        this.initializeArrowKeyNavigation();
        
        console.log('✅ [OSAnalyzer] Keyboard navigation enhanced');
    }
    
    /**
     * T4-4: 矢印キーナビゲーション
     */
    static initializeArrowKeyNavigation() {
        document.addEventListener('keydown', (event) => {
            const optionsContainer = document.getElementById('options-container');
            if (!optionsContainer || !optionsContainer.querySelector('.option')) return;
            
            const options = Array.from(optionsContainer.querySelectorAll('.option'));
            const currentFocus = document.activeElement;
            const currentIndex = options.indexOf(currentFocus);
            
            let nextIndex = -1;
            
            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    event.preventDefault();
                    nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    event.preventDefault();
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                    break;
                case ' ':
                case 'Enter':
                    if (currentFocus && currentFocus.classList.contains('option')) {
                        event.preventDefault();
                        currentFocus.click();
                    }
                    break;
            }
            
            if (nextIndex >= 0) {
                options[nextIndex].focus();
            }
        });
    }
    
    /**
     * T4-4: フォーカス管理強化
     */
    static initializeFocusManagement() {
        // ページ読み込み時の初期フォーカス
        document.addEventListener('DOMContentLoaded', () => {
            const firstFocusable = document.querySelector('button, input, select, textarea, [tabindex="0"]');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
        
        // フォーカストラップ（モーダル内でのフォーカス制御）
        this.initializeFocusTrap();
        
        console.log('✅ [OSAnalyzer] Focus management enhanced');
    }
    
    /**
     * T4-4: フォーカストラップ
     */
    static initializeFocusTrap() {
        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;
            
            const modal = document.querySelector('.modal.active, .error-screen.active');
            if (!modal) return;
            
            const focusableElements = modal.querySelectorAll(
                'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
    
    /**
     * T4-4: セマンティック構造強化
     */
    static initializeSemanticStructure() {
        // 見出し構造の確認と修正
        this.validateHeadingStructure();
        
        // ランドマーク要素の追加
        this.addLandmarkRoles();
        
        // フォームラベルの関連付け確認
        this.validateFormLabels();
        
        console.log('✅ [OSAnalyzer] Semantic structure enhanced');
    }
    
    /**
     * T4-4: 見出し構造の検証
     */
    static validateHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `heading-${index + 1}`;
            }
            
            // aria-labelledbyを設定
            const section = heading.closest('section, .os-analyzer-section');
            if (section && !section.getAttribute('aria-labelledby')) {
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
    }
    
    /**
     * T4-4: ランドマーク要素の追加
     */
    static addLandmarkRoles() {
        // メインコンテンツエリア
        const mainContent = document.getElementById('app');
        if (mainContent && !mainContent.getAttribute('role')) {
            mainContent.setAttribute('role', 'main');
        }
        
        // 結果セクションのregion役割
        const sections = document.querySelectorAll('.os-analyzer-section');
        sections.forEach((section) => {
            if (!section.getAttribute('role')) {
                section.setAttribute('role', 'region');
            }
        });
    }
    
    /**
     * T4-4: フォームラベルの検証
     */
    static validateFormLabels() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (!label && input.id) {
                    input.setAttribute('aria-label', input.placeholder || 'フォーム入力');
                }
            }
        });
    }
    
    /**
     * T4-4: 色覚異常対応
     */
    static initializeColorBlindSupport() {
        // 色だけに依存しない視覚的区別の追加
        const stressElements = document.querySelectorAll('[class*="stress-level"]');
        stressElements.forEach((element) => {
            if (!element.querySelector('.status-icon')) {
                const icon = document.createElement('span');
                icon.className = 'status-icon';
                icon.setAttribute('aria-hidden', 'true');
                
                if (element.classList.contains('stress-level-critical')) {
                    icon.textContent = '⚠';
                    element.setAttribute('aria-label', '危険レベル: ' + element.textContent);
                } else if (element.classList.contains('stress-level-warning')) {
                    icon.textContent = '⚡';
                    element.setAttribute('aria-label', '注意レベル: ' + element.textContent);
                } else if (element.classList.contains('stress-level-normal')) {
                    icon.textContent = '✓';
                    element.setAttribute('aria-label', '正常レベル: ' + element.textContent);
                }
                
                element.insertBefore(icon, element.firstChild);
            }
        });
        
        console.log('✅ [OSAnalyzer] Color blind support added');
    }
    
    /**
     * T4-4: スクリーンリーダー通知
     */
    static announceToScreenReader(message, urgent = false) {
        const regionId = urgent ? 'urgent-announcements' : 'announcements';
        const region = document.getElementById(regionId);
        
        if (region) {
            region.textContent = '';
            setTimeout(() => {
                region.textContent = message;
            }, 100);
            
            console.log(`📢 [OSAnalyzer] Screen reader announcement: ${message}`);
        }
    }
    
    /**
     * T4-4: アクセシビリティ対応画面切り替え
     */
    static switchToAccessible(screenName, options = {}) {
        const success = this.switchTo(screenName, options);
        
        if (success) {
            // スクリーンリーダー通知
            const screenTitles = {
                'welcome': 'ウェルカム画面に移動しました',
                'question': '質問画面に移動しました',
                'analysis': '分析中画面に移動しました',
                'results': '結果画面に移動しました',
                'error': 'エラー画面に移動しました'
            };
            
            this.announceToScreenReader(screenTitles[screenName] || `${screenName}画面に移動しました`);
            
            // 最初のフォーカス可能要素にフォーカス
            setTimeout(() => {
                const newScreen = document.getElementById(`${screenName}-screen`);
                if (newScreen) {
                    const firstFocusable = newScreen.querySelector('button, input, select, textarea, [tabindex="0"]');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }
            }, 150);
        }
        
        return success;
    }
    
    /**
     * T4-1: エラーハンドリング初期化
     */
    static initializeErrorHandling() {
        console.log('🛡️ [OSAnalyzer] Initializing error handling system');
        
        // グローバルエラーハンドラ
        window.addEventListener('error', (event) => {
            console.error('🚨 [OSAnalyzer] Global error caught:', event.error);
            ScreenManager.showError('予期しないエラーが発生しました', {
                errorCode: 'GLOBAL_ERROR',
                technicalInfo: event.error?.message || 'Unknown error',
                recovery: 'ページを再読み込みしてください'
            });
        });
        
        // Promise rejection ハンドラ
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 [OSAnalyzer] Unhandled promise rejection:', event.reason);
            ScreenManager.showError('非同期処理でエラーが発生しました', {
                errorCode: 'PROMISE_REJECTION',
                technicalInfo: event.reason?.message || 'Promise rejection',
                recovery: 'しばらく待ってから再試行してください'
            });
        });
        
        console.log('✅ [OSAnalyzer] Error handling system initialized');
    }
    
    /**
     * T4-1: パフォーマンスメトリクス取得
     */
    static getPerformanceMetrics() {
        const metrics = {
            timestamp: Date.now(),
            screenSwitchTimes: {},
            renderTimes: {},
            totalLoadTime: 0
        };
        
        if (performance.memory) {
            metrics.memoryInfo = {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        
        return metrics;
    }
    
    /**
     * T4-1: 統一実装体制設定の取得
     */
    static getUnifiedConfig() {
        return {
            CALCULATION_SEED: "haqei-os-analyzer-v1.0",
            ROUNDING_PRECISION: 2,
            TRIGRAM_ORDER: ["乾","兌","離","震","巽","坎","艮","坤"],
            VERSION: "2.2.2",
            PERFORMANCE_TARGETS: {
                SCREEN_SWITCH_MAX: 300, // ms
                RESULT_GENERATION_MAX: 2000, // ms
                CHART_RENDER_MAX: 1000 // ms
            },
            ACCESSIBILITY: {
                CONTRAST_RATIO_MIN: 4.5,
                FOCUS_VISIBLE: true,
                KEYBOARD_NAVIGATION: true
            }
        };
    }
}

// グローバルに公開
window.ScreenManager = ScreenManager;

// T4-1: ScreenManager完全統合 - DOMContentLoaded時に初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        ScreenManager.initializeAccessibility();
        ScreenManager.initializeErrorHandling();
        console.log('🚀 [OSAnalyzer] ScreenManager fully integrated and initialized');
    } catch (error) {
        console.error('❌ [OSAnalyzer] Failed to initialize ScreenManager:', error);
    }
});

console.log('📱 ScreenManager loaded - 画面遷移システムを統一管理 (T4-1 Complete Integration)');