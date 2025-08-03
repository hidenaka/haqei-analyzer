/**
 * PersonalityConstructionView.js
 * 
 * 仮想人格構築演出システム - Phase 3 UI/UX Enhancement
 * 
 * 説明: ユーザーの診断結果から仮想人格を段階的に構築する演出を提供
 * 従来の静的な結果表示から、動的で物語的な仮想人格構築体験への革新
 * 
 * 作成: 2025年7月31日
 * Phase: 3.1 仮想人格構築演出システム
 */

class PersonalityConstructionView extends BaseComponent {
    constructor(containerId) {
        super(containerId);
        
        // 構築フェーズの定義
        this.constructionPhases = [
            {
                id: 'analysis',
                name: 'データ分析中...',
                description: '診断結果を詳細に分析しています',
                duration: 2000,
                progress: 15
            },
            {
                id: 'engine_os',
                name: '価値観OSを構築中...',
                description: 'Engine OS (価値観OS) の人格を形成しています',
                duration: 3000,
                progress: 35
            },
            {
                id: 'interface_os',
                name: '社会的OSを構築中...',
                description: 'Interface OS (社会的OS) の人格を形成しています',
                duration: 3000,
                progress: 55
            },
            {
                id: 'safemode_os',
                name: '防御OSを構築中...',
                description: 'SafeMode OS (防御OS) の人格を形成しています',
                duration: 3000,
                progress: 75
            },
            {
                id: 'relationships',
                name: '関係性を分析中...',
                description: '3つのOS間の複雑な相互関係を構築しています',
                duration: 2500,
                progress: 90
            },
            {
                id: 'metaphor',
                name: '易経メタファーを生成中...',
                description: '易経の智慧による物語的解説を作成しています',
                duration: 2000,
                progress: 95
            },
            {
                id: 'integration',
                name: '統合解説を作成中...',
                description: '最終的な統合レポートを生成しています',
                duration: 1500,
                progress: 100
            }
        ];
        
        this.currentPhaseIndex = 0;
        this.isConstructing = false;
        this.virtualPersonality = null;
        this.animationSpeed = 1.0; // アニメーション速度調整
        
        console.log('🎭 PersonalityConstructionView initialized');
    }
    
    /**
     * 仮想人格構築プロセスのメイン実行
     * データ構造の安全性を確保した上で演出を実行
     * @param {Object} virtualPersonality - 構築対象の仮想人格データ
     * @param {Object} options - 演出オプション
     */
    async showConstructionProcess(virtualPersonality, options = {}) {
        if (this.isConstructing) {
            console.warn('⚠️ Construction already in progress');
            return;
        }
        
        try {
            this.isConstructing = true;
            this.constructionStartTime = Date.now();
            
            // 入力データの検証と正規化
            this.virtualPersonality = this.validateAndNormalizePersonalityData(virtualPersonality);
            this.animationSpeed = Math.max(0.1, Math.min(5.0, options.speed || 1.0)); // 0.1-5.0 の範囲に制限
            
            console.log('🚀 Starting personality construction visualization');
            console.log('🔍 Input validation completed:', {
                hasVirtualPersonality: !!this.virtualPersonality,
                animationSpeed: this.animationSpeed,
                hasEngineOS: !!(this.virtualPersonality?.engineOS),
                hasInterfaceOS: !!(this.virtualPersonality?.interfaceOS),
                hasSafeModeOS: !!(this.virtualPersonality?.safeModeOS)
            });
            
            // 構築画面の初期化
            await this.initializeConstructionUI();
            
            // フェーズ進行の実行
            await this.showPhaseProgress();
            
            // OS誕生シーケンスの表示
            await this.showOSBirthSequence();
            
            // 関係性形成の可視化
            await this.showRelationshipFormation();
            
            // メタファー生成の演出
            await this.showMetaphorGeneration();
            
            // 完了演出
            await this.showConstructionComplete();
            
            console.log('✅ Personality construction visualization completed');
            
        } catch (error) {
            console.error('❌ Construction visualization failed:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                virtualPersonality: this.virtualPersonality,
                currentPhase: this.currentPhaseIndex
            });
            await this.showConstructionError(error);
        } finally {
            this.isConstructing = false;
        }
    }
    
    /**
     * 構築UI初期化
     */
    async initializeConstructionUI() {
        const html = `
            <div class="personality-construction-container">
                <div class="construction-header">
                    <h2 class="construction-title">
                        <span class="title-icon">🎭</span>
                        あなたの仮想人格を構築中
                    </h2>
                    <p class="construction-subtitle">
                        診断結果から、あなただけの3つのOS人格を形成します
                    </p>
                </div>
                
                <div class="phase-indicator">
                    <div class="current-phase">
                        <span class="phase-name">準備中...</span>
                        <div class="phase-description">
                            システムを初期化しています
                        </div>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                            <div class="progress-text">0%</div>
                        </div>
                    </div>
                </div>
                
                <div class="construction-visual">
                    <div class="os-birth-stage">
                        <div class="os-node engine-node" data-os="engine">
                            <div class="os-avatar">
                                <div class="avatar-icon">🧠</div>
                            </div>
                            <div class="os-label">Engine OS</div>
                            <div class="os-status">待機中</div>
                        </div>
                        
                        <div class="os-node interface-node" data-os="interface">
                            <div class="os-avatar">
                                <div class="avatar-icon">🤝</div>
                            </div>
                            <div class="os-label">Interface OS</div>
                            <div class="os-status">待機中</div>
                        </div>
                        
                        <div class="os-node safemode-node" data-os="safemode">
                            <div class="os-avatar">
                                <div class="avatar-icon">🛡️</div>
                            </div>
                            <div class="os-label">SafeMode OS</div>
                            <div class="os-status">待機中</div>
                        </div>
                    </div>
                    
                    <div class="relationship-canvas">
                        <svg class="connection-lines" width="100%" height="200">
                            <!-- 動的な関係性ライン -->
                        </svg>
                    </div>
                    
                    <div class="metaphor-preview">
                        <div class="hexagram-display">
                            <div class="hexagram-symbol">☰</div>
                            <div class="hexagram-name">構築中...</div>
                        </div>
                    </div>
                </div>
                
                <div class="construction-log">
                    <div class="log-header">
                        <span class="log-icon">📋</span>
                        構築ログ
                    </div>
                    <div class="log-content">
                        <div class="log-entry">
                            <span class="log-time">${new Date().toLocaleTimeString()}</span>
                            <span class="log-message">仮想人格構築システム初期化完了</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // CSS アニメーション初期化
        await this.initializeAnimations();
        
        // 少し待機してからフェーズ開始
        await this.sleep(500);
    }
    
    /**
     * フェーズ進行の表示
     */
    async showPhaseProgress() {
        for (let i = 0; i < this.constructionPhases.length; i++) {
            const phase = this.constructionPhases[i];
            this.currentPhaseIndex = i;
            
            await this.executePhase(phase);
        }
    }
    
    /**
     * 個別フェーズの実行
     * @param {Object} phase - フェーズ情報
     */
    async executePhase(phase) {
        // フェーズ表示の更新
        const phaseNameEl = this.container.querySelector('.phase-name');
        const phaseDescEl = this.container.querySelector('.phase-description');
        const progressFill = this.container.querySelector('.progress-fill');
        const progressText = this.container.querySelector('.progress-text');
        
        if (phaseNameEl) phaseNameEl.textContent = phase.name;
        if (phaseDescEl) phaseDescEl.textContent = phase.description;
        
        // ログエントリー追加
        this.addLogEntry(`${phase.name} 開始`);
        
        // プログレスバーアニメーション
        if (progressFill && progressText) {
            await this.animateProgress(phase.progress);
        }
        
        // フェーズ固有の処理
        await this.executePhaseSpecificAnimation(phase);
        
        // フェーズ完了待機
        await this.sleep(phase.duration / this.animationSpeed);
        
        this.addLogEntry(`${phase.name} 完了`);
    }
    
    /**
     * フェーズ固有のアニメーション実行
     * @param {Object} phase - フェーズ情報
     */
    async executePhaseSpecificAnimation(phase) {
        const animationMap = {
            'analysis': this.animateDataAnalysis.bind(this),
            'engine_os': this.animateEngineOSBirth.bind(this),
            'interface_os': this.animateInterfaceOSBirth.bind(this),
            'safemode_os': this.animateSafeModeOSBirth.bind(this),
            'relationships': this.animateRelationshipBuilding.bind(this),
            'metaphor': this.animateMetaphorGeneration.bind(this),
            'integration': this.animateIntegration.bind(this)
        };
        
        const animationFunction = animationMap[phase.id];
        if (animationFunction) {
            await animationFunction();
        }
    }
    
    /**
     * データ分析アニメーション
     */
    async animateDataAnalysis() {
        // 診断データの分析視覚化
        const logContent = this.container.querySelector('.log-content');
        
        const analysisSteps = [
            '診断回答データを解析中...',
            '価値観パターンを特定中...',
            '社会的傾向を分析中...',
            '防御機制を評価中...',
            'OS構築パラメータを算出中...'
        ];
        
        for (const step of analysisSteps) {
            this.addLogEntry(step);
            await this.sleep(300 / this.animationSpeed);
        }
    }
    
    /**
     * Engine OS 誕生アニメーション
     * データ構造の安全性チェックを強化
     */
    async animateEngineOSBirth() {
        try {
            const engineNode = this.container.querySelector('.engine-node');
            
            // DOM要素の存在確認
            if (!engineNode) {
                console.warn('⚠️ Engine node not found, using fallback animation');
                this.addLogEntry('Engine OS [システム] を構築中');
                this.addLogEntry('- 価値観: 基本価値観システム');
                return;
            }
        
        const engineStatus = engineNode.querySelector('.os-status');
        
        // ノードのアクティベーション
        engineNode.classList.add('activating');
        if (engineStatus) {
            engineStatus.textContent = '起動中...';
        }
        
        await this.sleep(500 / this.animationSpeed);
        
        // 人格データの安全な注入
        if (this.virtualPersonality && this.virtualPersonality.engineOS) {
            const engineOS = this.virtualPersonality.engineOS;
            
            // データ構造の安全な検証
            const osName = engineOS.osName || 'Engine OS';
            const characteristics = engineOS.characteristics || {};
            const primaryTraits = this.safeGetPrimaryTraits(characteristics.primary_traits, 'engine');
            const activation = typeof engineOS.activation === 'number' ? engineOS.activation : 0.5;
            
            this.addLogEntry(`Engine OS [${osName}] を構築中`);
            this.addLogEntry(`- 価値観: ${Array.isArray(primaryTraits) ? primaryTraits.join(', ') : String(primaryTraits)}`);
            this.addLogEntry(`- 活性度: ${(activation * 100).toFixed(1)}%`);
            
            await this.sleep(800 / this.animationSpeed);
            
            engineNode.classList.remove('activating');
            engineNode.classList.add('active');
            if (engineStatus) {
                engineStatus.textContent = '構築完了';
            }
        } else {
            // フォールバック処理
            this.addLogEntry('Engine OS [基本システム] を構築中');
            this.addLogEntry('- 価値観: 基本価値観システム');
            this.addLogEntry('- 活性度: 50.0%');
            
            await this.sleep(800 / this.animationSpeed);
            
            engineNode.classList.remove('activating');
            engineNode.classList.add('active');
            if (engineStatus) {
                engineStatus.textContent = '構築完了';
            }
        }
        } catch (error) {
            console.error('❌ Error in animateEngineOSBirth:', error);
            this.addLogEntry('⚠️ Engine OS 構築エラー - フォールバックモードで継続');
        }
    }
    
    /**
     * Interface OS 誕生アニメーション
     * データ構造の安全性チェックを強化
     */
    async animateInterfaceOSBirth() {
        try {
            const interfaceNode = this.container.querySelector('.interface-node');
        
        // DOM要素の存在確認
        if (!interfaceNode) {
            console.warn('⚠️ Interface node not found, using fallback animation');
            this.addLogEntry('Interface OS [システム] を構築中');
            this.addLogEntry('- 社会的特性: 基本社会システム');
            return;
        }
        
        const interfaceStatus = interfaceNode.querySelector('.os-status');
        
        interfaceNode.classList.add('activating');
        if (interfaceStatus) {
            interfaceStatus.textContent = '起動中...';
        }
        
        await this.sleep(500 / this.animationSpeed);
        
        // データの安全な処理
        if (this.virtualPersonality && this.virtualPersonality.interfaceOS) {
            const interfaceOS = this.virtualPersonality.interfaceOS;
            
            // データ構造の安全な検証
            const osName = interfaceOS.osName || 'Interface OS';
            const characteristics = interfaceOS.characteristics || {};
            const primaryTraits = this.safeGetPrimaryTraits(characteristics.primary_traits, 'interface');
            const activation = typeof interfaceOS.activation === 'number' ? interfaceOS.activation : 0.5;
            
            this.addLogEntry(`Interface OS [${osName}] を構築中`);
            this.addLogEntry(`- 社会的特性: ${Array.isArray(primaryTraits) ? primaryTraits.join(', ') : String(primaryTraits)}`);
            this.addLogEntry(`- 活性度: ${(activation * 100).toFixed(1)}%`);
            
            await this.sleep(800 / this.animationSpeed);
            
            interfaceNode.classList.remove('activating');
            interfaceNode.classList.add('active');
            if (interfaceStatus) {
                interfaceStatus.textContent = '構築完了';
            }
        } else {
            // フォールバック処理
            this.addLogEntry('Interface OS [基本システム] を構築中');
            this.addLogEntry('- 社会的特性: 基本社会システム');
            this.addLogEntry('- 活性度: 50.0%');
            
            await this.sleep(800 / this.animationSpeed);
            
            interfaceNode.classList.remove('activating');
            interfaceNode.classList.add('active');
            if (interfaceStatus) {
                interfaceStatus.textContent = '構築完了';
            }
        }
        } catch (error) {
            console.error('❌ Error in animateInterfaceOSBirth:', error);
            this.addLogEntry('⚠️ Interface OS 構築エラー - フォールバックモードで継続');
        }
    }
    
    /**
     * SafeMode OS 誕生アニメーション
     * データ構造の安全性チェックを強化
     */
    async animateSafeModeOSBirth() {
        try {
            const safemodeNode = this.container.querySelector('.safemode-node');
        
        // DOM要素の存在確認
        if (!safemodeNode) {
            console.warn('⚠️ SafeMode node not found, using fallback animation');
            this.addLogEntry('SafeMode OS [システム] を構築中');
            this.addLogEntry('- 防御特性: 基本防御システム');
            return;
        }
        
        const safemodeStatus = safemodeNode.querySelector('.os-status');
        
        safemodeNode.classList.add('activating');
        if (safemodeStatus) {
            safemodeStatus.textContent = '起動中...';
        }
        
        await this.sleep(500 / this.animationSpeed);
        
        // データの安全な処理
        if (this.virtualPersonality && this.virtualPersonality.safeModeOS) {
            const safeModeOS = this.virtualPersonality.safeModeOS;
            
            // データ構造の安全な検証
            const osName = safeModeOS.osName || 'SafeMode OS';
            const characteristics = safeModeOS.characteristics || {};
            const primaryTraits = this.safeGetPrimaryTraits(characteristics.primary_traits, 'safemode');
            const activation = typeof safeModeOS.activation === 'number' ? safeModeOS.activation : 0.5;
            
            this.addLogEntry(`SafeMode OS [${osName}] を構築中`);
            this.addLogEntry(`- 防御特性: ${Array.isArray(primaryTraits) ? primaryTraits.join(', ') : String(primaryTraits)}`);
            this.addLogEntry(`- 活性度: ${(activation * 100).toFixed(1)}%`);
            
            await this.sleep(800 / this.animationSpeed);
            
            safemodeNode.classList.remove('activating');
            safemodeNode.classList.add('active');
            if (safemodeStatus) {
                safemodeStatus.textContent = '構築完了';
            }
        } else {
            // フォールバック処理
            this.addLogEntry('SafeMode OS [基本システム] を構築中');
            this.addLogEntry('- 防御特性: 基本防御システム');
            this.addLogEntry('- 活性度: 50.0%');
            
            await this.sleep(800 / this.animationSpeed);
            
            safemodeNode.classList.remove('activating');
            safemodeNode.classList.add('active');
            if (safemodeStatus) {
                safemodeStatus.textContent = '構築完了';
            }
        }
        } catch (error) {
            console.error('❌ Error in animateSafeModeOSBirth:', error);
            this.addLogEntry('⚠️ SafeMode OS 構築エラー - フォールバックモードで継続');
        }
    }
    
    /**
     * 関係性構築アニメーション
     */
    async animateRelationshipBuilding() {
        this.addLogEntry('OS間の関係性ネットワークを構築中...');
        
        // 接続線の描画アニメーション
        const svg = this.container.querySelector('.connection-lines');
        
        if (svg) {
            // Engine ↔ Interface
            await this.drawConnectionLine(svg, 'engine-interface', '#e74c3c', '#3498db');
            await this.sleep(300 / this.animationSpeed);
            
            // Interface ↔ SafeMode
            await this.drawConnectionLine(svg, 'interface-safemode', '#3498db', '#f39c12');
            await this.sleep(300 / this.animationSpeed);
            
            // SafeMode ↔ Engine
            await this.drawConnectionLine(svg, 'safemode-engine', '#f39c12', '#e74c3c');
            await this.sleep(300 / this.animationSpeed);
        }
        
        this.addLogEntry('関係性マトリックス計算完了');
        this.addLogEntry('内部対話システム初期化完了');
    }
    
    /**
     * メタファー生成アニメーション
     */
    async animateMetaphorGeneration() {
        const hexagramDisplay = this.container.querySelector('.hexagram-display');
        const hexagramSymbol = hexagramDisplay.querySelector('.hexagram-symbol');
        const hexagramName = hexagramDisplay.querySelector('.hexagram-name');
        
        this.addLogEntry('易経メタファー生成開始...');
        
        // 卦の記号をランダムに変化させる演出
        const hexagramSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
        
        for (let i = 0; i < 8; i++) {
            hexagramSymbol.textContent = hexagramSymbols[Math.floor(Math.random() * hexagramSymbols.length)];
            await this.sleep(150 / this.animationSpeed);
        }
        
        // 最終的な卦の安全な決定
        let finalHexagram = '☰'; // デフォルト
        let hexagramNameText = '乾（創造）';
        
        if (this.virtualPersonality && this.virtualPersonality.personalityState) {
            // personalityStateの安全なアクセス
            const personalityState = this.virtualPersonality.personalityState || {};
            const dominantOS = personalityState.currentDominantOS || 'engine';
            
            // 主導 OS に基づいた卦の決定
            if (dominantOS === 'engine') {
                finalHexagram = '☰';
                hexagramNameText = '乾（創造）';
            } else if (dominantOS === 'interface') {
                finalHexagram = '☱';
                hexagramNameText = '兑（喜び）';
            } else if (dominantOS === 'safemode') {
                finalHexagram = '☶';
                hexagramNameText = '艮（静止）';
            }
            
            this.addLogEntry(`主要卦: ${hexagramNameText}`);
            this.addLogEntry('個人的物語テンプレート生成完了');
        } else {
            // フォールバック: ランダムな卦を生成
            const randomHexagrams = [
                { symbol: '☰', name: '乾（創造）' },
                { symbol: '☱', name: '兑（喜び）' },
                { symbol: '☶', name: '艮（静止）' },
                { symbol: '☲', name: '離（明晰）' }
            ];
            const selected = randomHexagrams[Math.floor(Math.random() * randomHexagrams.length)];
            finalHexagram = selected.symbol;
            hexagramNameText = selected.name;
            
            this.addLogEntry(`主要卦: ${hexagramNameText} (ランダム生成)`);
            this.addLogEntry('基本物語テンプレート生成完了');
        }
        
        // DOM要素の安全な更新
        if (hexagramSymbol) {
            hexagramSymbol.textContent = finalHexagram;
        }
        if (hexagramName) {
            hexagramName.textContent = hexagramNameText;
        }
    }
    
    /**
     * 統合アニメーション
     */
    async animateIntegration() {
        this.addLogEntry('最終統合処理を実行中...');
        this.addLogEntry('OS間バランス調整完了');
        this.addLogEntry('メタファーストーリー統合完了');
        this.addLogEntry('実践的行動指針生成完了');
    }
    
    /**
     * 関係性形成の可視化（Phase 6: OS間関係性形成）
     * 仮想人格の3つのOS間の複雑な相互関係を構築・可視化
     */
    async showRelationshipFormation() {
        console.log('🔗 Starting OS relationship formation visualization...');
        
        try {
            // MCP フック: 関係性形成開始ログ
            if (typeof window !== 'undefined' && window.mcpHooks) {
                window.mcpHooks.logPhase('relationship-formation-start', {
                    virtualPersonality: this.virtualPersonality,
                    timestamp: Date.now(),
                    phase: 'OS間関係性形成開始'
                });
            }
            
            this.addLogEntry('🔗 OS間関係性ネットワークを構築中...');
            this.addLogEntry('相互作用パターンを分析しています...');
            
            // Stage 1: 関係性マトリックス計算
            await this.calculateRelationshipMatrix();
            
            // Stage 2: 動的関係性可視化
            await this.visualizeOSRelationships();
            
            // Stage 3: 内部対話システム構築
            await this.buildInternalDialogueSystem();
            
            // Stage 4: 関係性バランス調整
            await this.adjustRelationshipBalance();
            
            // Stage 5: 統合ネットワーク完成
            await this.finalizeRelationshipNetwork();
            
            // MCP フック: 関係性形成完了ログ
            if (typeof window !== 'undefined' && window.mcpHooks) {
                window.mcpHooks.logPhase('relationship-formation-complete', {
                    virtualPersonality: this.virtualPersonality,
                    relationshipData: this.getRelationshipSummary(),
                    timestamp: Date.now(),
                    phase: 'OS間関係性形成完了'
                });
            }
            
            this.addLogEntry('✅ OS間関係性ネットワーク構築完了');
            this.addLogEntry('🎭 仮想人格の内部対話システム稼働開始');
            
            console.log('✅ OS relationship formation completed successfully');
            
        } catch (error) {
            console.error('❌ Error in showRelationshipFormation:', error);
            
            // MCP フック: エラーログ
            if (typeof window !== 'undefined' && window.mcpHooks) {
                window.mcpHooks.logError('relationship-formation-error', {
                    error: error.message,
                    stack: error.stack,
                    timestamp: Date.now()
                });
            }
            
            this.addLogEntry('⚠️ 関係性形成中にエラーが発生しました');
            this.addLogEntry('🔄 フォールバックモードで関係性システムを初期化中...');
            
            // フォールバック処理
            await this.fallbackRelationshipFormation();
        }
    }
    
    /**
     * 関係性マトリックス計算
     * OS間の相互作用強度を数値化して算出
     */
    async calculateRelationshipMatrix() {
        this.addLogEntry('📊 関係性マトリックスを計算中...');
        
        // OS間の相互作用強度を計算
        const matrix = {
            engineToInterface: this.calculateOSInteraction('engine', 'interface'),
            interfaceToSafemode: this.calculateOSInteraction('interface', 'safemode'),
            safemodeToEngine: this.calculateOSInteraction('safemode', 'engine'),
            engineToSafemode: this.calculateOSInteraction('engine', 'safemode'),
            interfaceToEngine: this.calculateOSInteraction('interface', 'engine'),
            safemodeToInterface: this.calculateOSInteraction('safemode', 'interface')
        };
        
        // マトリックス結果をログ出力
        Object.entries(matrix).forEach(([relationship, strength]) => {
            const percentage = (strength * 100).toFixed(1);
            this.addLogEntry(`  ${this.formatRelationshipName(relationship)}: ${percentage}%`);
        });
        
        // 内部データとして保存
        this.relationshipMatrix = matrix;
        
        await this.sleep(600 / this.animationSpeed);
    }
    
    /**
     * 動的関係性可視化
     * OS間の関係性を視覚的に表現
     */
    async visualizeOSRelationships() {
        this.addLogEntry('🎨 関係性ネットワークを可視化中...');
        
        const svg = this.container.querySelector('.connection-lines');
        
        if (svg) {
            // 既存の接続線をクリア
            svg.innerHTML = '';
            
            // 関係性の強度に基づいて接続線を描画
            const relationships = [
                { from: 'engine', to: 'interface', strength: this.relationshipMatrix?.engineToInterface || 0.7, color: '#e74c3c' },
                { from: 'interface', to: 'safemode', strength: this.relationshipMatrix?.interfaceToSafemode || 0.6, color: '#3498db' },
                { from: 'safemode', to: 'engine', strength: this.relationshipMatrix?.safemodeToEngine || 0.8, color: '#f39c12' }
            ];
            
            for (const rel of relationships) {
                await this.drawDynamicConnectionLine(svg, rel);
                await this.sleep(400 / this.animationSpeed);
                
                this.addLogEntry(`  ${rel.from} → ${rel.to}: 接続強度 ${(rel.strength * 100).toFixed(1)}%`);
            }
        } else {
            // SVGが利用できない場合のテキスト表示
            this.addLogEntry('  Engine ↔ Interface: 相互補完関係');
            this.addLogEntry('  Interface ↔ SafeMode: 調整関係');
            this.addLogEntry('  SafeMode ↔ Engine: 保護関係');
        }
        
        await this.sleep(800 / this.animationSpeed);
    }
    
    /**
     * 内部対話システム構築
     * OS間の内部対話メカニズムを初期化
     */
    async buildInternalDialogueSystem() {
        this.addLogEntry('💬 内部対話システムを構築中...');
        
        // 対話パターンの定義
        const dialoguePatterns = [
            'Engine ↔ Interface: 価値観と社会性の調和',
            'Interface ↔ SafeMode: 社交性と安全性のバランス',
            'SafeMode ↔ Engine: 保護機能と創造性の協調',
            'Engine ↔ Interface ↔ SafeMode: 三者間協議システム'
        ];
        
        for (const pattern of dialoguePatterns) {
            this.addLogEntry(`  ${pattern}`);
            await this.sleep(300 / this.animationSpeed);
        }
        
        this.addLogEntry('🧠 認知的協調メカニズム初期化完了');
        await this.sleep(500 / this.animationSpeed);
    }
    
    /**
     * 関係性バランス調整
     * 3つのOS間の力関係を調整
     */
    async adjustRelationshipBalance() {
        this.addLogEntry('⚖️ OS間バランスを調整中...');
        
        // 現在のバランス状態を計算
        let balance = { engine: 0.33, interface: 0.33, safemode: 0.34 };
        
        if (this.virtualPersonality && this.virtualPersonality.personalityState) {
            balance = this.virtualPersonality.personalityState.balance || balance;
        }
        
        // バランス情報をログ出力
        Object.entries(balance).forEach(([osType, value]) => {
            const percentage = (value * 100).toFixed(1);
            this.addLogEntry(`  ${osType.toUpperCase()} OS: ${percentage}%`);
        });
        
        // 主導OSの決定
        const dominantOS = Object.entries(balance).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        this.addLogEntry(`🎯 主導OS: ${dominantOS.toUpperCase()}`);
        
        await this.sleep(700 / this.animationSpeed);
    }
    
    /**
     * 統合ネットワーク完成
     * 関係性ネットワークの最終統合
     */
    async finalizeRelationshipNetwork() {
        this.addLogEntry('🌐 統合ネットワークを完成中...');
        
        // 全OSノードに統合完了エフェクト
        const allNodes = this.container.querySelectorAll('.os-node');
        allNodes.forEach(node => {
            node.classList.add('network-integrated');
        });
        
        this.addLogEntry('🔄 フィードバックループ確立完了');
        this.addLogEntry('🚀 動的適応システム稼働開始');
        this.addLogEntry('✨ 仮想人格の自己進化機能アクティブ');
        
        await this.sleep(1000 / this.animationSpeed);
    }
    
    /**
     * OS間相互作用の計算
     * @param {string} fromOS - 送信側OS
     * @param {string} toOS - 受信側OS
     * @returns {number} 相互作用強度 (0-1)
     */
    calculateOSInteraction(fromOS, toOS) {
        // 基本的な相互作用パターン
        const baseInteractions = {
            'engine-interface': 0.75,
            'interface-safemode': 0.65,
            'safemode-engine': 0.80,
            'engine-safemode': 0.60,
            'interface-engine': 0.70,
            'safemode-interface': 0.55
        };
        
        const key = `${fromOS}-${toOS}`;
        let baseStrength = baseInteractions[key] || 0.5;
        
        // 仮想人格データがある場合は活性度に基づいて調整
        if (this.virtualPersonality) {
            const fromOSData = this.virtualPersonality[`${fromOS}OS`];
            const toOSData = this.virtualPersonality[`${toOS}OS`];
            
            if (fromOSData && toOSData) {
                const fromActivation = fromOSData.activation || 0.5;
                const toActivation = toOSData.activation || 0.5;
                
                // 両OSの活性度を考慮した調整
                const activationFactor = (fromActivation + toActivation) / 2;
                baseStrength = baseStrength * 0.7 + activationFactor * 0.3;
            }
        }
        
        return Math.max(0.1, Math.min(1.0, baseStrength));
    }
    
    /**
     * 動的接続線の描画
     * @param {SVGElement} svg - SVG要素
     * @param {Object} relationship - 関係性情報
     */
    async drawDynamicConnectionLine(svg, relationship) {
        try {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            
            // 線の属性設定（簡略化）
            line.setAttribute('x1', '50');
            line.setAttribute('y1', '50');
            line.setAttribute('x2', '150');
            line.setAttribute('y2', '50');
            line.setAttribute('stroke', relationship.color);
            line.setAttribute('stroke-width', Math.max(1, relationship.strength * 4));
            line.setAttribute('opacity', relationship.strength);
            
            // アニメーション効果
            line.style.strokeDasharray = '5,5';
            line.style.animation = 'connectionPulse 2s infinite';
            
            svg.appendChild(line);
            
        } catch (error) {
            console.warn('⚠️ SVG line drawing failed:', error);
        }
    }
    
    /**
     * 関係性名のフォーマット
     * @param {string} relationshipKey - 関係性キー
     * @returns {string} フォーマットされた関係性名
     */
    formatRelationshipName(relationshipKey) {
        const nameMap = {
            'engineToInterface': 'Engine → Interface',
            'interfaceToSafemode': 'Interface → SafeMode',
            'safemodeToEngine': 'SafeMode → Engine',
            'engineToSafemode': 'Engine → SafeMode',
            'interfaceToEngine': 'Interface → Engine',
            'safemodeToInterface': 'SafeMode → Interface'
        };
        
        return nameMap[relationshipKey] || relationshipKey;
    }
    
    /**
     * 関係性サマリーの取得
     * @returns {Object} 関係性サマリー
     */
    getRelationshipSummary() {
        return {
            matrix: this.relationshipMatrix || {},
            timestamp: Date.now(),
            systemStatus: 'active',
            integrationLevel: 'complete'
        };
    }
    
    /**
     * フォールバック関係性形成
     * エラー時の簡易関係性システム初期化
     */
    async fallbackRelationshipFormation() {
        this.addLogEntry('🔄 簡易関係性システムを初期化中...');
        
        const basicRelationships = [
            'Engine OS ↔ Interface OS: 基本連携',
            'Interface OS ↔ SafeMode OS: 基本調整',
            'SafeMode OS ↔ Engine OS: 基本保護'
        ];
        
        for (const relationship of basicRelationships) {
            this.addLogEntry(`  ${relationship}`);
            await this.sleep(200 / this.animationSpeed);
        }
        
        this.addLogEntry('✅ 基本関係性ネットワーク構築完了');
        await this.sleep(500 / this.animationSpeed);
    }
    
    /**
     * 構築完了演出
     */
    async showConstructionComplete() {
        const phaseNameEl = this.container.querySelector('.phase-name');
        const phaseDescEl = this.container.querySelector('.phase-description');
        
        if (phaseNameEl) phaseNameEl.textContent = '🎉 仮想人格構築完了！';
        if (phaseDescEl) phaseDescEl.textContent = 'あなたの仮想人格が完成しました';
        
        this.addLogEntry('='.repeat(50));
        this.addLogEntry('🎭 仮想人格構築プロセス完了');
        
        // 人格情報の安全な表示
        if (this.virtualPersonality) {
            const personalityId = this.virtualPersonality.id || 'unknown';
            const metadata = this.virtualPersonality.personalityMetadata || {};
            const personalityState = this.virtualPersonality.personalityState || {};
            const personalityType = metadata.personalityType || '統合型';
            const dominantOS = personalityState.currentDominantOS || 'バランス型';
            
            this.addLogEntry(`人格ID: ${personalityId}`);
            this.addLogEntry(`人格タイプ: ${personalityType}`);
            this.addLogEntry(`主導OS: ${dominantOS}`);
        } else {
            // フォールバック情報
            this.addLogEntry('人格ID: system-generated');
            this.addLogEntry('人格タイプ: 基本統合型');
            this.addLogEntry('主導OS: バランス型');
        }
        
        this.addLogEntry('='.repeat(50));
        
        // 完了時の全体ハイライト
        const container = this.container.querySelector('.personality-construction-container');
        if (container) {
            container.classList.add('construction-complete');
        }
        
        // イベント発火
        this.dispatchEvent('constructionComplete', {
            virtualPersonality: this.virtualPersonality,
            duration: Date.now() - this.constructionStartTime
        });
    }
    
    /**
     * エラー表示
     * @param {Error} error - エラー情報
     */
    async showConstructionError(error) {
        const phaseNameEl = this.container.querySelector('.phase-name');
        const phaseDescEl = this.container.querySelector('.phase-description');
        
        if (phaseNameEl) phaseNameEl.textContent = '❌ 構築エラー';
        if (phaseDescEl) phaseDescEl.textContent = 'エラーが発生しました';
        
        this.addLogEntry(`ERROR: ${error.message}`);
        this.addLogEntry('構築プロセスを中断しました');
    }
    
    // ユーティリティメソッド
    
    /**
     * プログレスバーアニメーション
     * @param {number} targetProgress - 目標進捗（0-100）
     */
    async animateProgress(targetProgress) {
        const progressFill = this.container.querySelector('.progress-fill');
        const progressText = this.container.querySelector('.progress-text');
        
        if (!progressFill || !progressText) return;
        
        const currentProgress = parseInt(progressFill.style.width) || 0;
        const steps = Math.abs(targetProgress - currentProgress);
        const stepSize = (targetProgress - currentProgress) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const progress = currentProgress + (stepSize * i);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            
            await this.sleep(20 / this.animationSpeed);
        }
    }
    
    /**
     * ログエントリー追加
     * @param {string} message - ログメッセージ
     */
    addLogEntry(message) {
        const logContent = this.container.querySelector('.log-content');
        if (!logContent) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="log-time">${timestamp}</span>
            <span class="log-message">${message}</span>
        `;
        
        logContent.appendChild(logEntry);
        
        // 自動スクロール
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    /**
     * 接続線描画
     * @param {SVGElement} svg - SVG要素
     * @param {string} connectionId - 接続ID
     * @param {string} fromColor - 開始色
     * @param {string} toColor - 終了色
     */
    async drawConnectionLine(svg, connectionId, fromColor, toColor) {
        // 実装は省略（SVG描画ロジック）
        console.log(`Drawing connection: ${connectionId}`);
    }
    
    /**
     * アニメーション初期化
     */
    async initializeAnimations() {
        // CSS アニメーションクラスの初期設定
        const style = document.createElement('style');
        style.textContent = `
            .personality-construction-container {
                opacity: 0;
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .os-node.activating {
                animation: pulse 1s infinite;
            }
            
            .os-node.active {
                animation: glow 2s ease-in-out infinite alternate;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes glow {
                from { box-shadow: 0 0 5px rgba(79, 195, 247, 0.5); }
                to { box-shadow: 0 0 20px rgba(79, 195, 247, 0.8); }
            }
            
            .construction-complete {
                animation: completionFlash 3s ease-in-out;
            }
            
            @keyframes completionFlash {
                0%, 100% { background: rgba(255, 255, 255, 0.05); }
                50% { background: rgba(76, 175, 80, 0.2); }
            }
            
            .os-node.network-integrated {
                animation: networkGlow 3s ease-in-out infinite alternate;
                border: 2px solid rgba(52, 152, 219, 0.6);
            }
            
            @keyframes networkGlow {
                0% { 
                    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
                    transform: scale(1);
                }
                100% { 
                    box-shadow: 0 0 25px rgba(52, 152, 219, 0.8);
                    transform: scale(1.02);
                }
            }
            
            @keyframes connectionPulse {
                0%, 100% { 
                    stroke-dashoffset: 0;
                    opacity: 0.6;
                }
                50% { 
                    stroke-dashoffset: 10;
                    opacity: 1;
                }
            }
            
            .relationship-canvas svg line {
                animation: connectionPulse 2s infinite;
                filter: drop-shadow(0 0 3px currentColor);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * OS誕生シーケンスの表示
     * 
     * 目的：
     * - 3つのOSの順次的な「誕生」を可視化
     * - 各OSの初期化プロセスをアニメーション表示
     * 
     * 処理内容：
     * 1. OS誕生の順序を決定
     * 2. 各OSを順次アクティベート
     * 3. 特性データの表示
     * 4. 統合プロセスの開始
     * 
     * フォールバック実装を含む
     */
    async showOSBirthSequence() {
        console.log('👶 Starting OS birth sequence...');
        
        // 簡略化された基本実装
        try {
            this.addLogEntry('🎭 OS人格システム初期化中...');
            
            const osTypes = ['Engine', 'Interface', 'SafeMode'];
            
            for (const osType of osTypes) {
                this.addLogEntry(`${osType} OS 初期化中...`);
                await this.sleep(500 / (this.animationSpeed || 1));
                this.addLogEntry(`✅ ${osType} OS 初期化完了`);
            }
            
            this.addLogEntry('🔗 OS間統合処理中...');
            await this.sleep(800 / (this.animationSpeed || 1));
            this.addLogEntry('✅ 仮想人格統合完了');
            
            console.log('✅ OS birth sequence completed');
            
        } catch (error) {
            console.error('❌ Error in showOSBirthSequence:', error);
            this.addLogEntry('⚠️ OS初期化エラー、フォールバックモードで継続');
        }
    }
    
    /**
     * 元のOS誕生シーケンスの表示（バックアップ）
     */
    async showOSBirthSequenceOriginal() {
        console.log('👶 Starting original OS birth sequence...');
        
        try {
            // OS誕生の順序（通常は Engine → Interface → SafeMode）
            const birthOrder = ['engine', 'interface', 'safemode'];
            
            for (const osType of birthOrder) {
                console.log(`🌱 Birthing ${osType} OS...`);
                
                // OS誕生アニメーション
                await this.animateOSBirth(osType);
                
                // 待機時間
                await this.sleep(1000 / this.animationSpeed);
            }
            
            // 統合シーケンス
            console.log('🔗 Starting OS integration sequence...');
            await this.animateOSIntegration();
            
            console.log('✅ OS birth sequence completed');
            
        } catch (error) {
            console.error('❌ Error in OS birth sequence:', error);
            
            // フォールバック: 簡略化されたシーケンス
            await this.showSimplifiedBirthSequence();
        }
    }

    /**
     * 個別OSの誕生アニメーション
     * @param {string} osType - OS種別
     */
    async animateOSBirth(osType) {
        try {
            const osNode = this.container.querySelector(`.${osType}-node`);
            if (!osNode) {
                console.warn(`⚠️ OS node not found: ${osType}`);
                return;
            }

        // 誕生演出
        osNode.classList.add('being-born');
        
        // ログエントリー追加
        this.addLogEntry(`${osType.toUpperCase()} OS が誕生しています...`);
        
        // アニメーション効果
        await this.sleep(800 / this.animationSpeed);
        
        // OS固有データの安全な表示
        if (this.virtualPersonality) {
            const osData = this.virtualPersonality[`${osType}OS`];
            if (osData) {
                const osName = osData.osName || 'Unknown';
                const characteristics = osData.characteristics || {};
                const primaryTraits = characteristics.primary_traits;
                let traitsText = 'N/A';
                
                // primary_traitsの安全な処理
                const safeTraits = this.safeGetPrimaryTraits(primaryTraits, osType);
                traitsText = Array.isArray(safeTraits) ? safeTraits.join(', ') : String(safeTraits);
                
                this.addLogEntry(`${osType.toUpperCase()} OS: ${osName}`);
                this.addLogEntry(`主要特性: ${traitsText}`);
                this.addLogEntry(`活性レベル: ${Math.round((osData.activation || 0.5) * 100)}%`);
            } else {
                // OSデータが存在しない場合のフォールバック
                this.addLogEntry(`${osType.toUpperCase()} OS: 基本システム`);
                this.addLogEntry('主要特性: システム特性');
                this.addLogEntry('活性レベル: 50%');
            }
        } else {
            // virtualPersonalityが存在しない場合のフォールバック
            this.addLogEntry(`${osType.toUpperCase()} OS: 基本システム`);
            this.addLogEntry('主要特性: システム特性');
            this.addLogEntry('活性レベル: 50%');
        }
        
        // 誕生完了
        osNode.classList.remove('being-born');
        osNode.classList.add('born');
        
        this.addLogEntry(`✅ ${osType.toUpperCase()} OS 誕生完了`);
        } catch (error) {
            console.error(`❌ Error in animateOSBirth for ${osType}:`, error);
            this.addLogEntry(`⚠️ ${osType.toUpperCase()} OS 構築エラー - フォールバックモードで継続`);
        }
    }

    /**
     * OS統合アニメーション
     */
    async animateOSIntegration() {
        this.addLogEntry('🔗 3つのOSを統合中...');
        
        // 全OSノードに統合エフェクト
        const allNodes = this.container.querySelectorAll('.os-node');
        allNodes.forEach(node => {
            node.classList.add('integrating');
        });
        
        await this.sleep(1500 / this.animationSpeed);
        
        // 統合完了
        allNodes.forEach(node => {
            node.classList.remove('integrating');
            node.classList.add('integrated');
        });
        
        this.addLogEntry('✅ OS統合完了 - 仮想人格誕生！');
    }

    /**
     * 簡略化された誕生シーケンス（フォールバック）
     */
    async showSimplifiedBirthSequence() {
        console.log('🔄 Showing simplified birth sequence...');
        
        this.addLogEntry('⚡ 高速OS初期化モード');
        
        const osTypes = ['engine', 'interface', 'safemode'];
        
        for (const osType of osTypes) {
            this.addLogEntry(`${osType.toUpperCase()} OS 初期化中...`);
            await this.sleep(300 / this.animationSpeed);
            this.addLogEntry(`✅ ${osType.toUpperCase()} OS 準備完了`);
        }
        
        this.addLogEntry('🎭 仮想人格構築完了');
    }

    /**
     * 待機ユーティリティ
     * @param {number} ms - 待機時間（ミリ秒）
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * イベント発火
     * @param {string} eventName - イベント名
     * @param {Object} detail - イベント詳細
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        this.container.dispatchEvent(event);
    }

    /**
     * メタファー生成の視覚化
     */
    async showMetaphorGeneration() {
        console.log('🔮 Starting metaphor generation visualization...');
        
        try {
            // MCPフック実行
            if (window.mcpHooks && typeof window.mcpHooks.logPhase === 'function') {
                window.mcpHooks.logPhase('metaphor-generation', { 
                    phase: 'メタファー生成開始',
                    virtualPersonalityId: this.virtualPersonality?.id
                });
            }

            // メタファー生成コンテナの作成
            const metaphorContainer = document.createElement('div');
            metaphorContainer.className = 'metaphor-generation-container';
            metaphorContainer.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                opacity: 0;
                transition: all ${1000 / this.animationSpeed}ms ease;
                z-index: 1000;
                min-width: 300px;
            `;

            // メタファー生成ステップの表示
            const steps = [
                { icon: '🌟', text: '易経の智慧を統合中...', delay: 0 },
                { icon: '🎭', text: '人格メタファーを生成中...', delay: 800 },
                { icon: '🔗', text: 'OS関係性を分析中...', delay: 1600 },
                { icon: '✨', text: 'パーソナライズされた洞察を作成中...', delay: 2400 }
            ];

            // メタファー生成の演出
            for (const step of steps) {
                await this.sleep(step.delay / this.animationSpeed);
                
                const stepElement = document.createElement('div');
                stepElement.style.cssText = `
                    font-size: 18px;
                    margin: 10px 0;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 500ms ease;
                `;
                stepElement.innerHTML = `${step.icon} ${step.text}`;
                
                metaphorContainer.appendChild(stepElement);
                this.container.appendChild(metaphorContainer);
                
                // コンテナのフェードイン
                if (metaphorContainer.style.opacity === '0') {
                    setTimeout(() => {
                        metaphorContainer.style.opacity = '1';
                        metaphorContainer.style.transform = 'translate(-50%, -50%) scale(1)';
                    }, 50);
                }
                
                // ステップのアニメーション
                setTimeout(() => {
                    stepElement.style.opacity = '1';
                    stepElement.style.transform = 'translateY(0)';
                }, 100);
                
                await this.sleep(600 / this.animationSpeed);
            }

            // フォールバックメタファー表示
            await this.displayFallbackMetaphor(metaphorContainer);

            // 完了演出
            await this.sleep(1000 / this.animationSpeed);
            
            const completionElement = document.createElement('div');
            completionElement.style.cssText = `
                font-size: 20px;
                color: #4CAF50;
                margin-top: 15px;
                font-weight: bold;
            `;
            completionElement.innerHTML = '🎯 メタファー生成完了！';
            metaphorContainer.appendChild(completionElement);

            await this.sleep(1500 / this.animationSpeed);

            // フェードアウト
            metaphorContainer.style.opacity = '0';
            metaphorContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                if (metaphorContainer.parentNode) {
                    metaphorContainer.parentNode.removeChild(metaphorContainer);
                }
            }, 500);

            // MCPフック完了通知
            if (window.mcpHooks && typeof window.mcpHooks.logPhase === 'function') {
                window.mcpHooks.logPhase('metaphor-generation-complete', { 
                    phase: 'メタファー生成完了',
                    success: true
                });
            }

            console.log('✅ Metaphor generation visualization completed');

        } catch (error) {
            console.error('❌ Error in metaphor generation visualization:', error);
            
            // エラー時のフォールバック表示
            await this.showSimpleMetaphorGeneration();
            
            if (window.mcpHooks && typeof window.mcpHooks.logError === 'function') {
                window.mcpHooks.logError('metaphor-generation-error', {
                    error: error.message,
                    phase: 'メタファー生成'
                });
            }
        }
    }

    /**
     * フォールバックメタファー表示
     */
    async displayFallbackMetaphor(container) {
        const fallbackDisplay = document.createElement('div');
        fallbackDisplay.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            text-align: left;
        `;
        
        fallbackDisplay.innerHTML = `
            <div style="color: #FFD700; font-weight: bold; margin-bottom: 10px;">
                🎭 あなたの人格メタファー
            </div>
            <div style="margin-bottom: 8px;">
                💎 複数の側面を持つ多面的な人格
            </div>
            <div style="font-size: 14px; color: #E0E0E0;">
                分人思想に基づく、状況に応じて異なる側面を表現する豊かな人格
            </div>
        `;
        
        container.appendChild(fallbackDisplay);
        await this.sleep(1000 / this.animationSpeed);
    }

    /**
     * シンプルなメタファー生成表示（エラー時）
     */
    async showSimpleMetaphorGeneration() {
        const simpleContainer = document.createElement('div');
        simpleContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        `;
        simpleContainer.innerHTML = '🔮 メタファー生成完了';
        
        this.container.appendChild(simpleContainer);
        await this.sleep(1500 / this.animationSpeed);
        
        if (simpleContainer.parentNode) {
            simpleContainer.parentNode.removeChild(simpleContainer);
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalityConstructionView;
}

console.log('🎭 PersonalityConstructionView class loaded successfully');

// クラスにデータ検証メソッドを追加
PersonalityConstructionView.prototype.validateAndNormalizePersonalityData = function(virtualPersonality) {
    console.log('🔍 Validating and normalizing personality data...');
    
    // null/undefined チェック
    if (!virtualPersonality || typeof virtualPersonality !== 'object') {
        console.warn('⚠️ Invalid virtualPersonality data, using fallback');
        return this.createFallbackPersonalityData();
    }
    
    // 正規化されたデータを作成
    const normalized = {
        id: virtualPersonality.id || 'system-generated-' + Date.now(),
        engineOS: this.normalizeOSData(virtualPersonality.engineOS, 'engine'),
        interfaceOS: this.normalizeOSData(virtualPersonality.interfaceOS, 'interface'),
        safeModeOS: this.normalizeOSData(virtualPersonality.safeModeOS, 'safemode'),
        personalityState: {
            currentDominantOS: virtualPersonality.personalityState?.currentDominantOS || 'engine',
            balance: virtualPersonality.personalityState?.balance || { engine: 0.33, interface: 0.33, safemode: 0.34 },
            ...virtualPersonality.personalityState
        },
        personalityMetadata: {
            personalityType: virtualPersonality.personalityMetadata?.personalityType || '統合型',
            createdAt: virtualPersonality.personalityMetadata?.createdAt || new Date().toISOString(),
            ...virtualPersonality.personalityMetadata
        }
    };
    
    console.log('✅ Data normalization completed');
    return normalized;
};

PersonalityConstructionView.prototype.normalizeOSData = function(osData, osType) {
    const defaultTraits = {
        engine: ['創造性', '論理性', '価値判断'],
        interface: ['協調性', '社交性', '適応性'],
        safemode: ['保護性', '慎重性', '安定性']
    };
    
    const defaultNames = {
        engine: 'Engine OS',
        interface: 'Interface OS',
        safemode: 'SafeMode OS'
    };
    
    if (!osData || typeof osData !== 'object') {
        return {
            osName: defaultNames[osType],
            characteristics: {
                primary_traits: defaultTraits[osType]
            },
            activation: 0.5
        };
    }
    
    return {
        osName: osData.osName || defaultNames[osType],
        characteristics: {
            primary_traits: osData.characteristics?.primary_traits || defaultTraits[osType],
            ...osData.characteristics
        },
        activation: typeof osData.activation === 'number' ? osData.activation : 0.5,
        ...osData
    };
};

PersonalityConstructionView.prototype.createFallbackPersonalityData = function() {
    console.log('🔄 Creating fallback personality data');
    
    return {
        id: 'fallback-' + Date.now(),
        engineOS: this.normalizeOSData(null, 'engine'),
        interfaceOS: this.normalizeOSData(null, 'interface'),
        safeModeOS: this.normalizeOSData(null, 'safemode'),
        personalityState: {
            currentDominantOS: 'engine',
            balance: { engine: 0.4, interface: 0.3, safemode: 0.3 }
        },
        personalityMetadata: {
            personalityType: '基本統合型',
            createdAt: new Date().toISOString(),
            fallbackMode: true
        }
    };
};

/**
 * primary_traitsの安全な取得
 * @param {any} primaryTraits - 取得対象のprimary_traits
 * @param {string} osType - OS種別（フォールバック用）
 * @returns {Array} 安全に処理されたprimary_traits配列
 */
PersonalityConstructionView.prototype.safeGetPrimaryTraits = function(primaryTraits, osType) {
    // デフォルト特性の定義
    const defaultTraits = {
        'engine': ['創造性', '論理性', '価値判断'],
        'interface': ['協調性', '社交性', '適応性'],
        'safemode': ['保護性', '慎重性', '安定性']
    };
    
    // 既に配列で有効な場合
    if (Array.isArray(primaryTraits) && primaryTraits.length > 0) {
        return primaryTraits;
    }
    
    // 文字列の場合は配列に変換
    if (typeof primaryTraits === 'string' && primaryTraits.trim()) {
        return [primaryTraits.trim()];
    }
    
    // オブジェクトの場合は値を配列にする
    if (typeof primaryTraits === 'object' && primaryTraits !== null) {
        const values = Object.values(primaryTraits).filter(v => v && typeof v === 'string');
        if (values.length > 0) {
            return values;
        }
    }
    
    // すべて失敗した場合はOS種別のデフォルトを返す
    return defaultTraits[osType] || ['システム特性'];
};

/**
 * デバッグ用：安全性テスト関数
 */
PersonalityConstructionView.prototype.testSafety = function() {
    console.log('🧪 Testing data safety mechanisms...');
    
    // 様々なprimary_traitsのテストケース
    const testCases = [
        { input: ['正常', 'データ'], expected: 'Array' },
        { input: 'string data', expected: 'Array' },
        { input: { a: 'object', b: 'data' }, expected: 'Array' },
        { input: null, expected: 'Array' },
        { input: undefined, expected: 'Array' },
        { input: [], expected: 'Array' },
        { input: '', expected: 'Array' }
    ];
    
    testCases.forEach((test, index) => {
        const result = this.safeGetPrimaryTraits(test.input, 'engine');
        const isValid = Array.isArray(result) && result.length > 0;
        console.log(`Test ${index + 1}: ${isValid ? '✅' : '❌'} Input:`, test.input, '→ Output:', result);
    });
    
    console.log('🎯 Safety test completed');
};

console.log('🔍 Data validation methods added to PersonalityConstructionView');