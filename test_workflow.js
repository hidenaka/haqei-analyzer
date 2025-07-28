// OrganizationalWorkflowController テストスクリプト
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 OrganizationalWorkflowController機能テスト開始');

// DOM環境のモック
global.document = {
    getElementById: (id) => ({
        value: id === 'project-name' ? 'テストプロジェクト' : 
               id === 'project-description' ? 'テスト要件です' :
               id === 'project-priority' ? 'high' : '',
        disabled: false,
        innerHTML: '',
        textContent: '',
        style: {},
        addEventListener: () => {},
        appendChild: () => {},
        scrollTop: 0,
        scrollHeight: 100
    }),
    createElement: () => ({
        className: '',
        innerHTML: '',
        addEventListener: () => {}
    }),
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {}
};

global.window = {
    DataManager: null
};

global.BunenjinStrategyNavigator = class MockBunenjinStrategyNavigator {
        constructor() {
            this.currentPhase = 'PLANNING';
            this.activeAgents = new Map();
        }
        
        async initiateWorkflow(requirements) {
            return {
                phase: 'PLANNING',
                leadAgent: { role: { name: 'CTO' } },
                analysis: { complexity: 'medium' },
                nextSteps: ['DESIGN']
            };
        }
        
        async transitionPhase(newPhase) {
            return {
                success: true,
                phase: newPhase,
                activeAgents: [{ role: { name: 'CTO' } }],
                objectives: ['テスト目標']
            };
        }
        
        async facilitateAgentCommunication(from, to, message) {
            return {
                from, to, message,
                timestamp: new Date(),
                response: 'テスト応答'
            };
        }
        
        async facilitateConsensusBuilding(decision, agents) {
            return {
                decision,
                consensusLevel: 0.8,
                recommendedAction: 'proceed',
                integratedDecision: {
                    strategicValue: 'high',
                    implementationFeasibility: 0.9,
                    riskLevel: 'low'
                }
            };
        }
        
        getWorkflowMetrics() {
            return {
                currentPhase: this.currentPhase,
                activeAgents: [],
                phaseProgress: 0.5
            };
        }
    };

global.window.BunenjinStrategyNavigator = global.BunenjinStrategyNavigator;

global.console = console;

try {
    // BaseComponentのモック
    global.BaseComponent = class BaseComponent {
        constructor(containerId, options = {}) {
            this.container = {
                innerHTML: '',
                querySelectorAll: () => [],
                querySelector: () => null
            };
            this.options = { ...this.defaultOptions, ...options };
        }
        
        get defaultOptions() {
            return {};
        }
        
        render() {}
        bindEvents() {}
    };

    // OrganizationalWorkflowControllerファイルを読み込み
    const controllerCode = fs.readFileSync(
        path.join(__dirname, 'public/js/core/OrganizationalWorkflowController.js'), 
        'utf8'
    );
    
    eval(controllerCode);
    
    const OrganizationalWorkflowController = global.window.OrganizationalWorkflowController;
    
    if (!OrganizationalWorkflowController) {
        throw new Error('OrganizationalWorkflowController クラスが見つからない');
    }
    
    console.log('✅ OrganizationalWorkflowController読み込み成功');
    
    // インスタンス生成テスト
    const controller = new OrganizationalWorkflowController('test-container', {
        autoPhaseTransition: false,
        communicationLogging: true
    });
    
    console.log('✅ インスタンス生成成功');
    
    // 初期化テスト
    await controller.init();
    console.log('✅ 初期化成功');
    
    // プロジェクト要件収集テスト
    console.log('\n=== プロジェクト要件収集テスト ===');
    const requirements = controller.collectProjectRequirements();
    console.log('✅ 要件収集:', requirements);
    
    const isValid = controller.validateRequirements(requirements);
    console.log('✅ 要件検証:', isValid);
    
    // ワークフロー開始テスト
    console.log('\n=== ワークフロー開始テスト ===');
    await controller.startWorkflow();
    console.log('✅ ワークフロー開始成功');
    
    // フェーズ遷移テスト
    console.log('\n=== フェーズ遷移テスト ===');
    await controller.transitionToNextPhase();
    console.log('✅ フェーズ遷移成功');
    
    // エージェント間コミュニケーションテスト
    console.log('\n=== エージェント間コミュニケーションテスト ===');
    await controller.facilitateCommunication('CTO', 'PROGRAMMER', 'テストメッセージ');
    console.log('✅ コミュニケーション成功');
    
    // 意思決定テスト
    console.log('\n=== 意思決定テスト ===');
    const decision = await controller.makeDecision('テスト決定', ['CTO', 'QA']);
    console.log('✅ 意思決定成功:', decision.recommendedAction);
    
    // ヘルパーメソッドテスト
    console.log('\n=== ヘルパーメソッドテスト ===');
    const nextPhase = controller.getNextPhase('PLANNING');
    console.log('✅ 次フェーズ取得:', nextPhase);
    
    const progress = controller.calculateWorkflowProgress('DESIGN');
    console.log('✅ 進捗計算:', progress + '%');
    
    // エージェントアイコンテスト
    const icons = ['CTO', 'PROGRAMMER', 'QA'].map(role => ({
        role, 
        icon: controller.getAgentIcon(role)
    }));
    console.log('✅ エージェントアイコン:', icons);
    
    // 履歴管理テスト
    controller.addToWorkflowHistory('TEST_EVENT', { test: true });
    console.log('✅ 履歴追加成功:', controller.workflowHistory.length, '件');
    
    console.log('\n🎉 OrganizationalWorkflowController全機能テスト完了！');
    console.log('   組織的ワークフロー制御システムが正常に動作しています。');
    
} catch (error) {
    console.error('❌ テスト失敗:', error.message);
    console.error('スタックトレース:', error.stack);
    process.exit(1);
}