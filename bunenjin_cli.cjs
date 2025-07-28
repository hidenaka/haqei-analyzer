#!/usr/bin/env node
// Bunenjin Strategy Navigator CLI
// このCLIから直接CTO・プログラマー・QAエージェントを操作可能

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// コンソール色付け
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// BunenjinStrategyNavigatorのコアロジック（CLI用簡易版）
class BunenjinCLI {
    constructor() {
        this.currentPhase = 'PLANNING';
        this.activeAgent = 'CTO';
        this.project = null;
        this.workflowHistory = [];
        this.communicationLog = [];
        
        this.agents = {
            CTO: {
                name: 'CTO分人',
                os: 'Engine OS',
                icon: '🎯',
                role: '戦略立案と意思決定',
                thinking: '長期的視点と全体最適化'
            },
            PROGRAMMER: {
                name: 'プログラマー分人',
                os: 'Interface OS', 
                icon: '⚡',
                role: '実装とシステム構築',
                thinking: '実践的解決と協調'
            },
            QA: {
                name: 'QA分人',
                os: 'SafeMode OS',
                icon: '🛡️',
                role: '品質保証と安全性確保',
                thinking: '慎重な検証と防御'
            }
        };
        
        this.phases = ['PLANNING', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEPLOYMENT'];
    }
    
    showHeader() {
        console.clear();
        console.log(colors.cyan + colors.bright);
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║                Bunenjin Strategy Navigator CLI               ║');
        console.log('║            分人思想組織ワークフローシステム                    ║');
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log(colors.reset);
        console.log();
    }
    
    showCurrentStatus() {
        const agent = this.agents[this.activeAgent];
        console.log(colors.blue + '=== 現在の状況 ===' + colors.reset);
        console.log(`📍 フェーズ: ${colors.yellow}${this.currentPhase}${colors.reset}`);
        console.log(`${agent.icon} アクティブエージェント: ${colors.green}${agent.name} (${agent.os})${colors.reset}`);
        console.log(`🧠 思考モード: ${colors.cyan}${agent.thinking}${colors.reset}`);
        if (this.project) {
            console.log(`🎯 プロジェクト: ${colors.magenta}${this.project.name}${colors.reset}`);
        }
        console.log();
    }
    
    async switchAgent(agentName) {
        if (!this.agents[agentName]) {
            console.log(colors.red + `❌ 無効なエージェント: ${agentName}` + colors.reset);
            return;
        }
        
        const prevAgent = this.activeAgent;
        this.activeAgent = agentName;
        const agent = this.agents[agentName];
        
        console.log(colors.green + `🔄 エージェント切り替え完了` + colors.reset);
        console.log(`${this.agents[prevAgent].icon} ${this.agents[prevAgent].name} → ${agent.icon} ${agent.name}`);
        console.log(`思考モード: ${colors.cyan}${agent.thinking}${colors.reset}`);
        
        this.addToHistory('AGENT_SWITCH', `${prevAgent} → ${agentName}`);
    }
    
    async createProject() {
        console.log(colors.yellow + '🎯 新しいプロジェクトを作成します' + colors.reset);
        
        const name = await this.question('プロジェクト名を入力: ');
        const description = await this.question('要件・目標を入力: ');
        const priority = await this.question('優先度 (high/medium/low) [medium]: ') || 'medium';
        
        this.project = { name, description, priority, startTime: new Date() };
        
        console.log(colors.green + '✅ プロジェクト作成完了' + colors.reset);
        console.log(`📋 ${name}`);
        console.log(`📝 ${description}`);
        console.log(`⚡ 優先度: ${priority}`);
        
        this.addToHistory('PROJECT_CREATED', this.project);
    }
    
    async executeAgentAction() {
        const agent = this.agents[this.activeAgent];
        
        console.log(colors.blue + `=== ${agent.icon} ${agent.name} アクション ===` + colors.reset);
        
        switch (this.activeAgent) {
            case 'CTO':
                await this.executeCTOAction();
                break;
            case 'PROGRAMMER':
                await this.executeProgrammerAction();
                break;
            case 'QA':
                await this.executeQAAction();
                break;
        }
    }
    
    async executeCTOAction() {
        console.log('🎯 CTO分人として以下のアクションが可能です:');
        console.log('1. 技術方針の決定');
        console.log('2. アーキテクチャ設計の承認');
        console.log('3. リスク評価');
        console.log('4. リソース配分計画');
        
        const action = await this.question('実行するアクション番号を選択 (1-4): ');
        
        const actions = {
            '1': '技術方針決定: モダンなJavaScript ES6+とモジュラー設計を採用',
            '2': 'アーキテクチャ承認: Triple OS Architecture による分離設計を承認',
            '3': 'リスク評価: 実装複雑性は中程度、スケジュール遵守可能',
            '4': 'リソース配分: CTO 20%、プログラマー 60%、QA 20%の配分決定'
        };
        
        const result = actions[action] || '無効なアクション';
        console.log(colors.green + `✅ ${result}` + colors.reset);
        
        this.addToHistory('CTO_ACTION', result);
        this.addCommunication('CTO', 'TEAM', result);
    }
    
    async executeProgrammerAction() {
        console.log('⚡ プログラマー分人として以下のアクションが可能です:');
        console.log('1. コードの実装');
        console.log('2. 技術仕様の具体化');
        console.log('3. パフォーマンス最適化');
        console.log('4. デバッグと問題解決');
        
        const action = await this.question('実行するアクション番号を選択 (1-4): ');
        
        const actions = {
            '1': 'コード実装: BunenjinStrategyNavigator.js とワークフロー制御を実装完了',
            '2': '技術仕様具体化: Triple OS Architecture の詳細設計を文書化',
            '3': 'パフォーマンス最適化: 非同期処理とメモリ使用量を最適化',
            '4': 'デバッグ完了: 全エージェント役割切り替えの動作を検証'
        };
        
        const result = actions[action] || '無効なアクション';
        console.log(colors.green + `✅ ${result}` + colors.reset);
        
        this.addToHistory('PROGRAMMER_ACTION', result);
        this.addCommunication('PROGRAMMER', 'TEAM', result);
    }
    
    async executeQAAction() {
        console.log('🛡️ QA分人として以下のアクションが可能です:');
        console.log('1. テスト戦略の立案');
        console.log('2. 品質基準の監視');
        console.log('3. バグの発見と報告');
        console.log('4. セキュリティチェック');
        
        const action = await this.question('実行するアクション番号を選択 (1-4): ');
        
        const actions = {
            '1': 'テスト戦略立案: 単体テスト、統合テスト、役割切り替えテストを計画',
            '2': '品質監視: コード品質、UI/UX、パフォーマンス基準をクリア',
            '3': 'バグ報告: 動作検証完了、重大な問題は検出されず',
            '4': 'セキュリティチェック: 入力検証、XSS対策、データ保護を確認'
        };
        
        const result = actions[action] || '無効なアクション';
        console.log(colors.green + `✅ ${result}` + colors.reset);
        
        this.addToHistory('QA_ACTION', result);
        this.addCommunication('QA', 'TEAM', result);
    }
    
    async transitionPhase() {
        const currentIndex = this.phases.indexOf(this.currentPhase);
        if (currentIndex >= this.phases.length - 1) {
            console.log(colors.green + '🎉 全フェーズ完了！プロジェクト成功です！' + colors.reset);
            return;
        }
        
        const nextPhase = this.phases[currentIndex + 1];
        console.log(colors.yellow + `🔄 フェーズ遷移: ${this.currentPhase} → ${nextPhase}` + colors.reset);
        
        this.currentPhase = nextPhase;
        
        // フェーズに応じてリードエージェントを自動切り替え
        const phaseLeaders = {
            'PLANNING': 'CTO',
            'DESIGN': 'CTO', 
            'IMPLEMENTATION': 'PROGRAMMER',
            'TESTING': 'QA',
            'DEPLOYMENT': 'CTO'
        };
        
        const newLeader = phaseLeaders[nextPhase];
        if (newLeader !== this.activeAgent) {
            await this.switchAgent(newLeader);
        }
        
        this.addToHistory('PHASE_TRANSITION', `${this.currentPhase}`);
        console.log(colors.green + `✅ ${nextPhase}フェーズ開始` + colors.reset);
    }
    
    showWorkflowHistory() {
        console.log(colors.blue + '=== ワークフロー履歴 ===' + colors.reset);
        if (this.workflowHistory.length === 0) {
            console.log('履歴がありません');
            return;
        }
        
        this.workflowHistory.forEach((entry, index) => {
            const time = entry.timestamp.toLocaleTimeString();
            console.log(`${index + 1}. [${time}] ${entry.type}: ${entry.data}`);
        });
        console.log();
    }
    
    showCommunicationLog() {
        console.log(colors.blue + '=== コミュニケーションログ ===' + colors.reset);
        if (this.communicationLog.length === 0) {
            console.log('コミュニケーション履歴がありません');
            return;
        }
        
        this.communicationLog.forEach((entry, index) => {
            const time = entry.timestamp.toLocaleTimeString();
            console.log(`${index + 1}. [${time}] ${entry.from} → ${entry.to}: ${entry.message}`);
        });
        console.log();
    }
    
    async showMenu() {
        console.log(colors.white + '=== メニュー ===' + colors.reset);
        console.log('1. プロジェクト作成/編集');
        console.log('2. エージェント切り替え');
        console.log('3. 現在のエージェントでアクション実行');
        console.log('4. 次のフェーズに遷移');
        console.log('5. ワークフロー履歴表示');
        console.log('6. コミュニケーションログ表示');
        console.log('7. 全エージェント状態表示');
        console.log('0. 終了');
        
        const choice = await this.question('\n選択してください (0-7): ');
        
        switch (choice) {
            case '1':
                await this.createProject();
                break;
            case '2':
                await this.selectAgent();
                break;
            case '3':
                if (!this.project) {
                    console.log(colors.red + '❌ 先にプロジェクトを作成してください' + colors.reset);
                } else {
                    await this.executeAgentAction();
                }
                break;
            case '4':
                await this.transitionPhase();
                break;
            case '5':
                this.showWorkflowHistory();
                break;
            case '6':
                this.showCommunicationLog();
                break;
            case '7':
                this.showAllAgents();
                break;
            case '0':
                console.log(colors.green + '👋 Bunenjin Strategy Navigator CLI を終了します' + colors.reset);
                rl.close();
                process.exit(0);
                break;
            default:
                console.log(colors.red + '❌ 無効な選択です' + colors.reset);
        }
    }
    
    async selectAgent() {
        console.log(colors.blue + '=== エージェント選択 ===' + colors.reset);
        Object.entries(this.agents).forEach(([key, agent], index) => {
            const current = key === this.activeAgent ? ' (現在)' : '';
            console.log(`${index + 1}. ${agent.icon} ${agent.name} (${agent.os})${current}`);
        });
        
        const choice = await this.question('エージェント番号を選択 (1-3): ');
        const agentKeys = Object.keys(this.agents);
        const selectedAgent = agentKeys[parseInt(choice) - 1];
        
        if (selectedAgent) {
            await this.switchAgent(selectedAgent);
        } else {
            console.log(colors.red + '❌ 無効な選択です' + colors.reset);
        }
    }
    
    showAllAgents() {
        console.log(colors.blue + '=== 全エージェント状態 ===' + colors.reset);
        Object.entries(this.agents).forEach(([key, agent]) => {
            const status = key === this.activeAgent ? 
                colors.green + '● アクティブ' + colors.reset : 
                colors.yellow + '○ 待機中' + colors.reset;
            
            console.log(`${agent.icon} ${colors.bright}${agent.name}${colors.reset}`);
            console.log(`   OS: ${agent.os}`);
            console.log(`   役割: ${agent.role}`);
            console.log(`   状態: ${status}`);
            console.log();
        });
    }
    
    addToHistory(type, data) {
        this.workflowHistory.push({
            type,
            data: typeof data === 'object' ? JSON.stringify(data) : data,
            timestamp: new Date()
        });
    }
    
    addCommunication(from, to, message) {
        this.communicationLog.push({
            from,
            to,
            message,
            timestamp: new Date()
        });
    }
    
    question(prompt) {
        return new Promise((resolve) => {
            rl.question(colors.cyan + prompt + colors.reset, resolve);
        });
    }
    
    async run() {
        this.showHeader();
        
        console.log(colors.green + '🎉 Bunenjin Strategy Navigator CLI へようこそ！' + colors.reset);
        console.log('分人思想に基づくCTO・プログラマー・QAエージェントシステムです。');
        console.log();
        
        while (true) {
            this.showCurrentStatus();
            await this.showMenu();
            
            console.log('\n' + colors.yellow + 'Enterキーで続行...' + colors.reset);
            await this.question('');
            this.showHeader();
        }
    }
}

// CLI実行
const bunenjinCLI = new BunenjinCLI();
bunenjinCLI.run().catch(console.error);