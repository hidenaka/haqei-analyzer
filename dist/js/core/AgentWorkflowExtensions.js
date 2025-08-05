// AgentWorkflowExtensions.js - エージェントワークフロー拡張機能
// OrganizationalWorkflowControllerの4エージェント対応拡張

const AgentWorkflowExtensions = {
    
    // 4エージェント対応のエージェント状態管理
    updateAgentStatesExtended(leadAgent, context) {
        // 全エージェントの状態をリセット
        ['cto', 'programmer', 'qa', 'document_writer'].forEach(role => {
            const statusElement = document.getElementById(`status-${role}`);
            if (statusElement) {
                statusElement.innerHTML = '<span class="status-indicator"></span>待機中';
                const card = statusElement.closest('.agent-card');
                if (card) card.className = 'agent-card idle';
            }
        });

        // リードエージェントを作業中に
        if (leadAgent) {
            const leadRole = leadAgent.role.name.toLowerCase().replace(/\s+/g, '');
            const roleKey = leadRole.includes('cto') ? 'cto' : 
                           leadRole.includes('programmer') ? 'programmer' : 
                           leadRole.includes('qa') ? 'qa' : 
                           leadRole.includes('document') ? 'document_writer' : 'cto';
            
            const statusElement = document.getElementById(`status-${roleKey}`);
            if (statusElement) {
                statusElement.innerHTML = '<span class="status-indicator"></span>作業中';
                const card = statusElement.closest('.agent-card');
                if (card) card.className = 'agent-card active';
            }
        }
    },
    
    // 4エージェント対応のアクティブエージェント管理
    updateActiveAgentsExtended(activeAgents) {
        // 全エージェントをリセット
        ['CTO', 'PROGRAMMER', 'QA', 'DOCUMENT_WRITER'].forEach(role => {
            const card = this.container.querySelector(`[data-role="${role}"]`);
            if (card) {
                card.className = 'agent-card idle';
            }
        });

        // アクティブエージェントを更新
        activeAgents.forEach(agent => {
            const role = agent.role.name;
            const roleKey = role.includes('CTO') ? 'CTO' : 
                           role.includes('Implementation') ? 'PROGRAMMER' : 
                           role.includes('QA') ? 'QA' : 
                           role.includes('Documentation') ? 'DOCUMENT_WRITER' : 'CTO';
            
            const card = this.container.querySelector(`[data-role="${roleKey}"]`);
            if (card) {
                card.className = 'agent-card active';
            }
        });
    },
    
    // DOCUMENTATIONフェーズ対応のコミュニケーション
    async initiateDocumentationCommunication(phaseResult) {
        const { phase, activeAgents, leadAgent } = phaseResult;
        
        if (phase === 'DOCUMENTATION') {
            // ドキュメント作成エージェントが各エージェントから情報収集
            await this.facilitateCommunication('DOCUMENT_WRITER', 'CTO',
                "プロジェクトの戦略と決定事項を教えてください。非エンジニア向けに説明します。");
                
            await this.facilitateCommunication('DOCUMENT_WRITER', 'PROGRAMMER',
                "実装内容の詳細と使用方法を教えてください。分かりやすく説明したいと思います。");
                
            await this.facilitateCommunication('DOCUMENT_WRITER', 'QA',
                "品質結果とユーザーが注意すべき点を教えてください。");
        }
    },
    
    // 成果物トラッキング表示
    displayDeliverables(phase, deliverables) {
        const container = document.getElementById('deliverables-timeline');
        if (!container) return;
        
        // 空のメッセージを削除
        const emptyMessage = container.querySelector('.timeline-empty');
        if (emptyMessage) emptyMessage.remove();
        
        const deliverableElement = document.createElement('div');
        deliverableElement.className = 'deliverable-item';
        deliverableElement.innerHTML = `
            <div class="deliverable-header">
                <span class="phase-name">${phase}フェーズ</span>
                <span class="deliverable-time">${this.formatTime(deliverables.timestamp)}</span>
            </div>
            <div class="deliverable-content">
                ${this.renderDeliverableArtifacts(deliverables.artifacts)}
            </div>
        `;
        
        container.appendChild(deliverableElement);
        container.scrollTop = container.scrollHeight;
    },
    
    // 成果物の表示形式
    renderDeliverableArtifacts(artifacts) {
        if (!artifacts) return '<div class="artifact-item">成果物準備中...</div>';
        
        return Object.entries(artifacts).map(([key, value]) => `
            <div class="artifact-item">
                <strong>${this.translateArtifactKey(key)}:</strong> ${value}
            </div>
        `).join('');
    },
    
    // 成果物キーの日本語翻訳
    translateArtifactKey(key) {
        const translations = {
            'requirementsDocument': '要件書',
            'technicalStrategy': '技術戦略',
            'architecturalDesign': 'アーキテクチャ設計',
            'sourceCode': 'ソースコード',
            'testResults': 'テスト結果',
            'deploymentPackage': 'デプロイパッケージ',
            'userManual': 'ユーザーマニュアル',
            'technicalReport': '技術レポート'
        };
        return translations[key] || key;
    },
    
    // 最終報告書の表示
    displayFinalReport(documentationResult) {
        const reportPanel = document.getElementById('final-report-panel');
        const reportContent = document.getElementById('final-report-content');
        
        if (!reportPanel || !reportContent) return;
        
        // 最終報告書パネルを表示
        reportPanel.style.display = 'block';
        
        // 報告書内容を表示
        reportContent.innerHTML = `
            <div class="report-section">
                <h4>📋 プロジェクト概要</h4>
                <div class="report-text">${documentationResult.executiveSummary.projectOverview}</div>
            </div>
            
            <div class="report-section">
                <h4>🎯 主要成果</h4>
                <ul class="achievement-list">
                    ${documentationResult.executiveSummary.keyAchievements.map(achievement => 
                        `<li>${achievement}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="report-section">
                <h4>📊 品質評価</h4>
                <div class="quality-metrics">
                    <div class="metric-item">
                        <span class="metric-label">総合品質スコア:</span>
                        <span class="metric-value">${documentationResult.qualityReport.overallScore}%</span>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h4>📖 ユーザーガイド</h4>
                <div class="user-guide-summary">
                    ${documentationResult.userManual.gettingStarted.overview}
                </div>
            </div>
            
            <div class="report-section">
                <h4>🔧 トラブルシューティング</h4>
                <div class="troubleshooting-summary">
                    ${documentationResult.troubleshootingGuide.commonIssues.length}件の一般的な問題と解決策を用意
                </div>
            </div>
            
            <div class="report-section">
                <h4>🚀 次のステップ</h4>
                <div class="next-steps">
                    ${documentationResult.nextStepsRecommendation}
                </div>
            </div>
        `;
    },
    
    // 最終報告書のダウンロード
    downloadFinalReport() {
        const reportContent = document.getElementById('final-report-content');
        if (!reportContent) return;
        
        const reportHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>プロジェクト最終報告書</title>
    <style>
        body { font-family: 'Hiragino Sans', 'メイリオ', sans-serif; line-height: 1.6; margin: 40px; }
        .report-section { margin-bottom: 30px; }
        h4 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 5px; }
        .achievement-list { list-style-type: none; padding: 0; }
        .achievement-list li { padding: 5px 0; padding-left: 20px; position: relative; }
        .achievement-list li:before { content: "✓"; color: #28a745; font-weight: bold; position: absolute; left: 0; }
        .metric-item { display: flex; justify-content: space-between; padding: 5px 0; }
        .metric-value { font-weight: bold; color: #007acc; }
    </style>
</head>
<body>
    <h1>🎯 プロジェクト最終報告書</h1>
    <p><strong>作成日:</strong> ${new Date().toLocaleDateString('ja-JP')}</p>
    ${reportContent.innerHTML}
</body>
</html>
        `;
        
        const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_final_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // プロジェクトサマリーのエクスポート
    exportProjectSummary() {
        const projectData = {
            name: this.currentProject?.name || '未定義プロジェクト',
            startTime: this.currentProject?.startTime,
            completionTime: new Date(),
            phases: this.workflowHistory.map(entry => ({
                phase: entry.data.phase,
                timestamp: entry.timestamp,
                leadAgent: entry.data.leadAgent?.role?.name
            })),
            communications: this.agentCommunications.length,
            decisions: this.decisionLog.length
        };
        
        const summaryText = `
プロジェクトサマリー
==================

プロジェクト名: ${projectData.name}
開始時刻: ${projectData.startTime ? new Date(projectData.startTime).toLocaleString('ja-JP') : '不明'}
完了時刻: ${projectData.completionTime.toLocaleString('ja-JP')}

フェーズ履歴:
${projectData.phases.map(phase => 
    `- ${phase.phase}: ${new Date(phase.timestamp).toLocaleString('ja-JP')} (担当: ${phase.leadAgent})`
).join('\n')}

統計:
- エージェント間コミュニケーション: ${projectData.communications}回
- 意思決定: ${projectData.decisions}回

このサマリーは HAQEI Analyzer エージェント組織システムによって自動生成されました。
        `;
        
        const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_summary_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // 6フェーズ対応の進行度計算
    calculateExtendedWorkflowProgress(phase) {
        const phases = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT', 'DOCUMENTATION'];
        const currentIndex = phases.indexOf(phase);
        return ((currentIndex + 1) / phases.length) * 100;
    },
    
    // 6フェーズ対応の次フェーズ取得
    getExtendedNextPhase(currentPhase) {
        const phases = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT', 'DOCUMENTATION'];
        const currentIndex = phases.indexOf(currentPhase);
        return phases[currentIndex + 1] || null;
    }
};

// OrganizationalWorkflowControllerに拡張機能を追加
if (typeof window !== "undefined" && window.OrganizationalWorkflowController) {
    Object.assign(window.OrganizationalWorkflowController.prototype, AgentWorkflowExtensions);
}

export default AgentWorkflowExtensions;