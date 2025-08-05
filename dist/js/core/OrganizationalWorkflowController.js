// OrganizationalWorkflowController.js - 組織ワークフロー統制システム
// HaQei Analyzer - Organizational Workflow Controller with Bunenjin Strategy

class OrganizationalWorkflowController extends BaseComponent {
    constructor(containerId, options = {}) {
        super(containerId, options);
        this.navigator = null;
        this.currentProject = null;
        this.workflowHistory = [];
        this.agentCommunications = [];
        this.decisionLog = [];
        
        console.log("🎮 [OrganizationalWorkflowController] ワークフロー統制システム初期化");
    }

    get defaultOptions() {
        return {
            ...super.defaultOptions,
            autoPhaseTransition: false,
            communicationLogging: true,
            realTimeUpdates: true
        };
    }

    async init() {
        await this.initializeNavigator();
        this.render();
        this.bindEvents();
        this.startMonitoring();
    }

    async initializeNavigator() {
        try {
            // DataManagerが利用可能な場合に使用
            const dataManager = window.DataManager ? new window.DataManager() : null;
            this.navigator = new BunenjinStrategyNavigator(dataManager);
            
            console.log("✅ [WorkflowController] BunenjinStrategyNavigator初期化完了");
        } catch (error) {
            console.error("❌ [WorkflowController] Navigator初期化エラー:", error);
            throw error;
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="workflow-controller">
                <!-- ヘッダー: 現在のフェーズとステータス -->
                <div class="workflow-header">
                    <div class="phase-indicator">
                        <div class="phase-title" id="current-phase">プランニング待機中</div>
                        <div class="phase-progress">
                            <div class="progress-bar" id="phase-progress-bar"></div>
                        </div>
                    </div>
                    <div class="workflow-controls">
                        <button class="btn btn-primary" id="start-workflow-btn">
                            ワークフロー開始
                        </button>
                        <button class="btn btn-secondary" id="transition-phase-btn" disabled>
                            次フェーズへ
                        </button>
                    </div>
                </div>

                <!-- エージェント状態パネル -->
                <div class="agents-panel">
                    <h3 class="section-title">分人エージェント状態</h3>
                    <div class="agents-grid">
                        ${this.renderAgentCard('CTO', 'Engine OS', '戦略・判断', '待機中')}
                        ${this.renderAgentCard('PROGRAMMER', 'Interface OS', '実装・構築', '待機中')}
                        ${this.renderAgentCard('QA', 'SafeMode OS', '品質・保証', '待機中')}
                        ${this.renderAgentCard('DOCUMENT_WRITER', 'Interface OS', 'ドキュメント・解説', '待機中')}
                    </div>
                </div>

                <!-- プロジェクト設定パネル -->
                <div class="project-panel" id="project-panel">
                    <h3 class="section-title">プロジェクト設定</h3>
                    <div class="project-form">
                        <div class="form-group">
                            <label for="project-name">プロジェクト名</label>
                            <input type="text" id="project-name" class="form-input" 
                                   placeholder="例: HAQEIシステム機能追加">
                        </div>
                        <div class="form-group">
                            <label for="project-description">要件・目標</label>
                            <textarea id="project-description" class="form-textarea" rows="4"
                                      placeholder="実装したい機能や達成したい目標を詳しく記載してください"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="project-priority">優先度</label>
                            <select id="project-priority" class="form-select">
                                <option value="high">高 - 緊急対応</option>
                                <option value="medium" selected>中 - 通常対応</option>
                                <option value="low">低 - 長期計画</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- コミュニケーションログ -->
                <div class="communication-panel">
                    <h3 class="section-title">エージェント間コミュニケーション</h3>
                    <div class="communication-log" id="communication-log">
                        <div class="log-empty">ワークフロー開始後にコミュニケーションが表示されます</div>
                    </div>
                </div>

                <!-- 意思決定パネル -->
                <div class="decision-panel">
                    <h3 class="section-title">分人統合による意思決定</h3>
                    <div class="decision-log" id="decision-log">
                        <div class="log-empty">決定事項はここに記録されます</div>
                    </div>
                </div>

                <!-- ワークフロー履歴 -->
                <div class="history-panel">
                    <h3 class="section-title">ワークフロー履歴</h3>
                    <div class="workflow-timeline" id="workflow-timeline">
                        <div class="timeline-empty">履歴はワークフロー実行後に表示されます</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAgentCard(role, osType, responsibility, status) {
        const statusClass = status === '待機中' ? 'idle' : 
                           status === '作業中' ? 'active' : 
                           status === '完了' ? 'completed' : 'idle';

        return `
            <div class="agent-card ${statusClass}" data-role="${role}">
                <div class="agent-header">
                    <div class="agent-icon">${this.getAgentIcon(role)}</div>
                    <div class="agent-info">
                        <div class="agent-role">${role}</div>
                        <div class="agent-os">${osType}</div>
                    </div>
                </div>
                <div class="agent-responsibility">${responsibility}</div>
                <div class="agent-status" id="status-${role.toLowerCase()}">
                    <span class="status-indicator"></span>
                    ${status}
                </div>
                <div class="agent-actions" id="actions-${role.toLowerCase()}">
                    <!-- 動的に追加される -->
                </div>
            </div>
        `;
    }

    getAgentIcon(role) {
        const icons = {
            'CTO': '🎯',
            'PROGRAMMER': '⚡',
            'QA': '🛡️',
            'DOCUMENT_WRITER': '📚'
        };
        return icons[role] || '🤖';
    }

    bindEvents() {
        // ワークフロー開始
        document.getElementById('start-workflow-btn')?.addEventListener('click', () => {
            this.startWorkflow();
        });

        // フェーズ遷移
        document.getElementById('transition-phase-btn')?.addEventListener('click', () => {
            this.transitionToNextPhase();
        });

        // エージェントカードのクリック
        this.container.querySelectorAll('.agent-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const role = e.currentTarget.dataset.role;
                this.showAgentDetails(role);
            });
        });
    }

    // === ワークフロー制御メソッド ===

    async startWorkflow() {
        try {
            console.log("🚀 [WorkflowController] ワークフロー開始処理");

            // プロジェクト要件を収集
            const requirements = this.collectProjectRequirements();
            if (!this.validateRequirements(requirements)) {
                this.showError("プロジェクト要件を正しく入力してください");
                return;
            }

            // ワークフロー開始
            const workflowResult = await this.navigator.initiateWorkflow(requirements);
            
            this.currentProject = {
                ...requirements,
                startTime: new Date(),
                workflowResult
            };

            // UI更新
            this.updatePhaseDisplay(workflowResult.phase);
            this.updateAgentStates(workflowResult.leadAgent, workflowResult.analysis);
            this.addToWorkflowHistory('WORKFLOW_STARTED', workflowResult);

            // CTOエージェントによる初期分析の表示
            this.displayInitialAnalysis(workflowResult.analysis);

            // ボタン状態更新
            document.getElementById('start-workflow-btn').disabled = true;
            document.getElementById('transition-phase-btn').disabled = false;

            this.showSuccess(`ワークフロー開始: ${workflowResult.phase}フェーズ`);

        } catch (error) {
            console.error("❌ [WorkflowController] ワークフロー開始エラー:", error);
            this.showError(`ワークフロー開始に失敗しました: ${error.message}`);
        }
    }

    async transitionToNextPhase() {
        try {
            if (!this.navigator || !this.currentProject) {
                this.showError("ワークフローが開始されていません");
                return;
            }

            const nextPhase = this.getNextPhase(this.navigator.currentPhase);
            if (!nextPhase) {
                await this.generateAndDisplayFinalReport();
                this.showSuccess("ワークフロー完了！最終報告書を生成しました。");
                return;
            }

            console.log(`🔄 [WorkflowController] フェーズ遷移: ${nextPhase}`);

            const transitionResult = await this.navigator.transitionPhase(nextPhase, {
                project: this.currentProject,
                timestamp: new Date()
            });

            if (!transitionResult.success) {
                this.showWarning(`フェーズ遷移できません: ${transitionResult.reason}`);
                this.displayPendingTasks(transitionResult.pendingTasks);
                return;
            }

            // UI更新
            this.updatePhaseDisplay(transitionResult.phase);
            this.updateActiveAgents(transitionResult.activeAgents);
            this.addToWorkflowHistory('PHASE_TRANSITION', transitionResult);

            // エージェント間コミュニケーション開始
            this.initiatePhaseSpecificCommunication(transitionResult);

            this.showSuccess(`${transitionResult.phase}フェーズに移行しました`);

        } catch (error) {
            console.error("❌ [WorkflowController] フェーズ遷移エラー:", error);
            this.showError(`フェーズ遷移に失敗しました: ${error.message}`);
        }
    }

    // === エージェント間コミュニケーション ===

    async initiatePhaseSpecificCommunication(phaseResult) {
        const { phase, activeAgents, leadAgent } = phaseResult;
        
        // フェーズ別のコミュニケーションパターン
        switch (phase) {
            case 'DESIGN':
                await this.facilitateCommunication('CTO', 'PROGRAMMER', 
                    `設計フェーズ開始。以下の要件に基づいてアーキテクチャ設計を行ってください：\n${this.currentProject.description}`);
                break;
                
            case 'IMPLEMENTATION':
                await this.facilitateCommunication('PROGRAMMER', 'QA',
                    "実装フェーズ開始。並行してテスト戦略の準備をお願いします。");
                break;
                
            case 'TESTING':
                await this.facilitateCommunication('QA', 'PROGRAMMER',
                    "テストフェーズ開始。実装の品質チェックを開始します。");
                break;
                
            case 'DEPLOYMENT':
                await this.facilitateCommunication('CTO', 'QA',
                    "デプロイ前最終チェック。品質基準を満たしているか確認してください。");
                break;
                
            case 'DOCUMENTATION':
                await this.facilitateCommunication('CTO', 'DOCUMENT_WRITER',
                    "ドキュメント作成フェーズ開始。全フェーズの成果物をまとめて包括的な報告書を作成してください。");
                await this.facilitateCommunication('PROGRAMMER', 'DOCUMENT_WRITER',
                    "実装の詳細とコード構造について説明します。技術仕様書の作成をお願いします。");
                await this.facilitateCommunication('QA', 'DOCUMENT_WRITER',
                    "品質テスト結果とメトリクスをまとめました。ユーザーガイドに含めてください。");
                break;
        }
    }

    async facilitateCommunication(fromRole, toRole, message) {
        try {
            const communication = await this.navigator.facilitateAgentCommunication(
                fromRole, toRole, message, 'phase_coordination'
            );

            this.agentCommunications.push(communication);
            this.displayCommunication(communication);

            console.log(`💬 [WorkflowController] コミュニケーション記録: ${fromRole} → ${toRole}`);

        } catch (error) {
            console.error("❌ [WorkflowController] コミュニケーションエラー:", error);
        }
    }

    // === 意思決定サポート ===

    async makeDecision(decisionItem, involvedAgents = ['CTO', 'PROGRAMMER', 'QA']) {
        try {
            console.log("🤝 [WorkflowController] 意思決定プロセス開始");

            const decisionResult = await this.navigator.facilitateConsensusBuilding(
                decisionItem, involvedAgents
            );

            this.decisionLog.push({
                ...decisionResult,
                timestamp: new Date(),
                project: this.currentProject?.name
            });

            this.displayDecision(decisionResult);
            
            return decisionResult;

        } catch (error) {
            console.error("❌ [WorkflowController] 意思決定エラー:", error);
            throw error;
        }
    }

    // === UI更新メソッド ===

    updatePhaseDisplay(phase) {
        const phaseElement = document.getElementById('current-phase');
        if (phaseElement) {
            phaseElement.textContent = `${phase}フェーズ実行中`;
        }

        // プログレスバー更新
        const progressBar = document.getElementById('phase-progress-bar');
        if (progressBar) {
            const progress = this.calculateWorkflowProgress(phase);
            progressBar.style.width = `${progress}%`;
        }
    }

    updateAgentStates(leadAgent, context) {
        // 全エージェントの状態をリセット
        ['cto', 'programmer', 'qa', 'document_writer'].forEach(role => {
            const statusElement = document.getElementById(`status-${role}`);
            if (statusElement) {
                statusElement.innerHTML = '<span class="status-indicator"></span>待機中';
                statusElement.parentElement.className = 'agent-card idle';
            }
        });

        // リードエージェントを作業中に
        if (leadAgent) {
            const leadRole = leadAgent.role.name.toLowerCase().replace(/\s+/g, '');
            const roleKey = leadRole.includes('cto') ? 'cto' : 
                           leadRole.includes('programmer') ? 'programmer' : 
                           leadRole.includes('qa') ? 'qa' : 
                           leadRole.includes('documentation') ? 'document_writer' : 'cto';
            
            const statusElement = document.getElementById(`status-${roleKey}`);
            if (statusElement) {
                statusElement.innerHTML = '<span class="status-indicator"></span>作業中';
                statusElement.parentElement.className = 'agent-card active';
            }
        }
    }

    updateActiveAgents(activeAgents) {
        // 全エージェントをリセット
        ['cto', 'programmer', 'qa', 'document_writer'].forEach(role => {
            const card = this.container.querySelector(`[data-role="${role.toUpperCase()}"]`);
            if (card) {
                card.className = 'agent-card idle';
            }
        });

        // アクティブエージェントを更新
        activeAgents.forEach(agent => {
            const role = agent.role.name;
            const roleKey = role.includes('CTO') ? 'CTO' : 
                           role.includes('Implementation') ? 'PROGRAMMER' : 
                           role.includes('Quality') ? 'QA' : 
                           role.includes('Documentation') ? 'DOCUMENT_WRITER' : 'CTO';
            
            const card = this.container.querySelector(`[data-role="${roleKey}"]`);
            if (card) {
                card.className = 'agent-card active';
            }
        });
    }

    displayCommunication(communication) {
        const logContainer = document.getElementById('communication-log');
        if (!logContainer) return;

        // 空のメッセージを削除
        const emptyMessage = logContainer.querySelector('.log-empty');
        if (emptyMessage) emptyMessage.remove();

        const communicationElement = document.createElement('div');
        communicationElement.className = 'communication-item';
        communicationElement.innerHTML = `
            <div class="communication-header">
                <span class="from-agent">${communication.from}</span>
                <span class="communication-arrow">→</span>
                <span class="to-agent">${communication.to}</span>
                <span class="communication-time">${this.formatTime(communication.timestamp)}</span>
            </div>
            <div class="communication-message">${communication.message}</div>
            <div class="communication-response">
                <strong>Response:</strong> ${communication.response}
            </div>
        `;

        logContainer.appendChild(communicationElement);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    displayDecision(decisionResult) {
        const logContainer = document.getElementById('decision-log');
        if (!logContainer) return;

        // 空のメッセージを削除
        const emptyMessage = logContainer.querySelector('.log-empty');
        if (emptyMessage) emptyMessage.remove();

        const decisionElement = document.createElement('div');
        decisionElement.className = 'decision-item';
        decisionElement.innerHTML = `
            <div class="decision-header">
                <span class="decision-title">意思決定: ${decisionResult.decision}</span>
                <span class="consensus-level">合意度: ${Math.round(decisionResult.consensusLevel * 100)}%</span>
            </div>
            <div class="decision-details">
                <div class="decision-recommendation">
                    <strong>推奨アクション:</strong> ${decisionResult.recommendedAction}
                </div>
                <div class="triple-os-analysis">
                    <div class="os-perspective">
                        <strong>戦略的価値 (Engine):</strong> ${decisionResult.integratedDecision.strategicValue}
                    </div>
                    <div class="os-perspective">
                        <strong>実装可能性 (Interface):</strong> ${decisionResult.integratedDecision.implementationFeasibility}
                    </div>
                    <div class="os-perspective">
                        <strong>リスクレベル (SafeMode):</strong> ${decisionResult.integratedDecision.riskLevel}
                    </div>
                </div>
            </div>
        `;

        logContainer.appendChild(decisionElement);
    }

    // === ユーティリティメソッド ===

    collectProjectRequirements() {
        return {
            name: document.getElementById('project-name')?.value || '',
            description: document.getElementById('project-description')?.value || '',
            priority: document.getElementById('project-priority')?.value || 'medium'
        };
    }

    validateRequirements(requirements) {
        return requirements.name.trim().length > 0 && 
               requirements.description.trim().length > 0;
    }

    getNextPhase(currentPhase) {
        const phases = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT', 'DOCUMENTATION'];
        const currentIndex = phases.indexOf(currentPhase);
        return phases[currentIndex + 1] || null;
    }

    calculateWorkflowProgress(phase) {
        const phases = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT', 'DOCUMENTATION'];
        const currentIndex = phases.indexOf(phase);
        return ((currentIndex + 1) / phases.length) * 100;
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    addToWorkflowHistory(eventType, data) {
        this.workflowHistory.push({
            eventType,
            timestamp: new Date(),
            data
        });
    }

    // === モニタリング ===

    startMonitoring() {
        // 定期的なワークフロー状態監視
        setInterval(() => {
            if (this.navigator && this.currentProject) {
                const metrics = this.navigator.getWorkflowMetrics();
                this.updateMetricsDisplay(metrics);
            }
        }, 5000); // 5秒間隔
    }

    updateMetricsDisplay(metrics) {
        // メトリクス表示の更新（実装詳細は省略）
        console.log("📊 [WorkflowController] メトリクス更新:", metrics);
    }

    // === 通知メソッド ===

    showSuccess(message) {
        console.log(`✅ [WorkflowController] ${message}`);
        // 実際の実装では toast 通知などを表示
    }

    showError(message) {
        console.error(`❌ [WorkflowController] ${message}`);
        // 実際の実装では error 通知などを表示
    }

    showWarning(message) {
        console.warn(`⚠️ [WorkflowController] ${message}`);
        // 実際の実装では warning 通知などを表示
    }

    showAgentDetails(role) {
        console.log(`🔍 [WorkflowController] エージェント詳細表示: ${role}`);
        // エージェントの詳細パネル表示
    }

    displayInitialAnalysis(analysis) {
        console.log("📋 [WorkflowController] 初期分析結果:", analysis);
        // 初期分析結果の表示
    }

    displayPendingTasks(pendingTasks) {
        console.log("📝 [WorkflowController] 未完了タスク:", pendingTasks);
        // 未完了タスクの表示
    }

    // === 最終報告書生成・表示 ===

    async generateAndDisplayFinalReport() {
        try {
            console.log("📋 [WorkflowController] 最終報告書生成開始");

            // 全フェーズの成果物を収集
            const allDeliverables = await this.collectAllDeliverables();
            
            // DOCUMENT_WRITERエージェントによる最終報告書生成
            const finalReportResult = await this.navigator.generateFinalReport(
                this.currentProject, 
                allDeliverables
            );

            // 最終報告書を表示
            this.displayFinalReport(finalReportResult.report);
            
            // 完了記録
            this.addToWorkflowHistory('FINAL_REPORT_GENERATED', finalReportResult);

            console.log("✅ [WorkflowController] 最終報告書生成完了");

        } catch (error) {
            console.error("❌ [WorkflowController] 最終報告書生成エラー:", error);
            this.showError(`最終報告書生成に失敗しました: ${error.message}`);
        }
    }

    async collectAllDeliverables() {
        const phases = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT'];
        const allDeliverables = {};

        for (const phase of phases) {
            const deliverables = await this.navigator.generatePhaseDeliverables(phase, {
                requirements: this.currentProject.description,
                analysis: this.currentProject.workflowResult?.analysis || {}
            });
            allDeliverables[phase] = deliverables;
        }

        return allDeliverables;
    }

    displayFinalReport(report) {
        // 新しいウィンドウまたはモーダルで最終報告書を表示
        const reportWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        
        const reportHTML = `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>プロジェクト完了報告書 - ${report.projectName}</title>
                <style>
                    body { 
                        font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif; 
                        margin: 20px; 
                        line-height: 1.6; 
                        color: #333;
                    }
                    .header { 
                        border-bottom: 3px solid #4a90e2; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px; 
                    }
                    .section { 
                        margin-bottom: 30px; 
                        padding: 20px; 
                        border-left: 4px solid #e2e2e2; 
                    }
                    .section h2 { 
                        color: #4a90e2; 
                        border-bottom: 2px solid #f0f0f0; 
                        padding-bottom: 10px; 
                    }
                    .metric { 
                        background: #f8f9fa; 
                        padding: 10px; 
                        margin: 10px 0; 
                        border-radius: 5px; 
                    }
                    .achievement { 
                        background: #e8f5e8; 
                        padding: 15px; 
                        margin: 10px 0; 
                        border-radius: 5px; 
                        border-left: 4px solid #28a745; 
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 50px; 
                        padding-top: 20px; 
                        border-top: 2px solid #e2e2e2; 
                        color: #666; 
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎯 プロジェクト完了報告書</h1>
                    <h2>${report.projectName}</h2>
                    <p><strong>生成日時:</strong> ${new Date(report.generationTime).toLocaleString('ja-JP')}</p>
                    <p><strong>レポートID:</strong> ${report.reportId}</p>
                </div>

                <div class="section">
                    <h2>📋 エグゼクティブサマリー</h2>
                    <p><strong>プロジェクト概要:</strong> ${report.executiveSummary.projectOverview}</p>
                    <div class="achievement">
                        <h3>主要な達成事項:</h3>
                        <ul>
                            ${report.executiveSummary.keyAchievements.map(achievement => 
                                `<li>${achievement}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <h2>⚡ 技術実装詳細</h2>
                    <div class="metric">
                        <h3>主要機能:</h3>
                        <ul>
                            ${report.technicalImplementation.keyFeatures.map(feature => 
                                `<li>${feature}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="metric">
                        <h3>技術的決定事項:</h3>
                        <ul>
                            ${report.technicalImplementation.technicalDecisions.map(decision => 
                                `<li>${decision}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <h2>🛡️ 品質・テスト結果</h2>
                    <div class="metric">
                        <p><strong>ユニットテストカバレッジ:</strong> ${report.qualityAssurance.testingSummary.unitTestCoverage}</p>
                        <p><strong>統合テスト:</strong> ${report.qualityAssurance.testingSummary.integrationTests}</p>
                        <p><strong>ユーザー受入テスト:</strong> ${report.qualityAssurance.testingSummary.userAcceptanceTests}</p>
                    </div>
                    <div class="metric">
                        <h3>品質メトリクス:</h3>
                        <p><strong>コード品質:</strong> ${report.qualityAssurance.qualityMetrics.codeQuality}</p>
                        <p><strong>セキュリティ:</strong> ${report.qualityAssurance.qualityMetrics.security}</p>
                        <p><strong>パフォーマンス:</strong> ${report.qualityAssurance.qualityMetrics.performance}</p>
                    </div>
                </div>

                <div class="section">
                    <h2>📚 ユーザーガイド</h2>
                    <div class="metric">
                        <h3>利用開始手順:</h3>
                        <p><strong>インストール:</strong> ${report.userGuide.gettingStarted.installation}</p>
                        <p><strong>初期設定:</strong> ${report.userGuide.gettingStarted.initialSetup}</p>
                        <p><strong>基本的な使用方法:</strong> ${report.userGuide.gettingStarted.basicUsage}</p>
                    </div>
                </div>

                <div class="section">
                    <h2>🔍 プロジェクト分析</h2>
                    <div class="achievement">
                        <h3>学んだ教訓:</h3>
                        <ul>
                            ${report.projectAnalysis.lessonsLearned.map(lesson => 
                                `<li>${lesson}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="metric">
                        <h3>改善提案:</h3>
                        <ul>
                            ${report.projectAnalysis.improvements.map(improvement => 
                                `<li>${improvement}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <h2>🚀 次のステップ</h2>
                    <div class="metric">
                        <h3>拡張提案:</h3>
                        <ul>
                            ${report.nextSteps.enhancementSuggestions.map(enhancement => 
                                `<li>${enhancement}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>

                <div class="footer">
                    <p>📝 このレポートは HAQEI Analyzer エージェント組織システムにより生成されました</p>
                    <p>🤖 分人思想 × Triple OS Architecture × AI協調システム</p>
                </div>
            </body>
            </html>
        `;

        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    }
}

// グローバルスコープで利用可能にする
if (typeof window !== "undefined") {
    window.OrganizationalWorkflowController = OrganizationalWorkflowController;
}