// BunenjinStrategyNavigator テストスクリプト
const fs = require('fs');
const path = require('path');

console.log('🧪 BunenjinStrategyNavigator機能テスト開始');

// window オブジェクトのモック
global.window = {};
global.console = console;

try {
    // BunenjinStrategyNavigatorファイルを読み込み
    const bunenjinCode = fs.readFileSync(path.join(__dirname, 'public/js/core/BunenjinStrategyNavigator.js'), 'utf8');
    
    // ES6 exportを削除してevalで実行
    const modifiedCode = bunenjinCode.replace('export default BunenjinStrategyNavigator;', '');
    eval(modifiedCode);
    
    const BunenjinStrategyNavigator = global.window.BunenjinStrategyNavigator;
    
    if (!BunenjinStrategyNavigator) {
        throw new Error('BunenjinStrategyNavigator クラスが見つからない');
    }
    
    console.log('✅ クラス読み込み成功');
    
    // インスタンス生成テスト
    const mockDataManager = { getData: () => ({}) };
    const navigator = new BunenjinStrategyNavigator(mockDataManager);
    
    console.log('✅ インスタンス生成成功');
    
    // 役割切り替えテスト
    console.log('\n=== 役割切り替えテスト ===');
    const ctoRole = navigator.switchToRole('CTO', { test: true });
    console.log('✅ CTO役割切り替え成功:', ctoRole.role.nickname);
    console.log('   OS配置:', ctoRole.role.osAlignment);
    
    const progRole = navigator.switchToRole('PROGRAMMER', { test: true });
    console.log('✅ プログラマー役割切り替え成功:', progRole.role.nickname);
    console.log('   OS配置:', progRole.role.osAlignment);
    
    const qaRole = navigator.switchToRole('QA', { test: true });
    console.log('✅ QA役割切り替え成功:', qaRole.role.nickname);
    console.log('   OS配置:', qaRole.role.osAlignment);
    
    // ワークフロー状態テスト
    console.log('\n=== ワークフロー状態テスト ===');
    console.log('✅ 利用可能フェーズ:', Object.keys(navigator.workflowStates));
    console.log('✅ 現在フェーズ:', navigator.currentPhase);
    
    // Triple OS思考モードテスト
    console.log('\n=== Triple OS思考モードテスト ===');
    const engineMode = navigator._getThinkingModeForRole(ctoRole.role);
    console.log('✅ Engine OS思考モード:', engineMode.focus);
    
    const interfaceMode = navigator._getThinkingModeForRole(progRole.role);
    console.log('✅ Interface OS思考モード:', interfaceMode.focus);
    
    const safeModeMode = navigator._getThinkingModeForRole(qaRole.role);
    console.log('✅ SafeMode OS思考モード:', safeModeMode.focus);
    
    // コミュニケーションパターンテスト
    console.log('\n=== コミュニケーションパターンテスト ===');
    const ctoToProg = navigator._getCommunicationPattern('CTO', 'PROGRAMMER');
    console.log('✅ CTO→プログラマー:', ctoToProg.style);
    
    const progToQA = navigator._getCommunicationPattern('PROGRAMMER', 'QA');
    console.log('✅ プログラマー→QA:', progToQA.style);
    
    const qaToCTO = navigator._getCommunicationPattern('QA', 'CTO');
    console.log('✅ QA→CTO:', qaToCTO.style);
    
    // メトリクス取得テスト
    console.log('\n=== メトリクステスト ===');
    const metrics = navigator.getWorkflowMetrics();
    console.log('✅ メトリクス取得成功');
    console.log('   現在フェーズ:', metrics.currentPhase);
    console.log('   アクティブエージェント:', metrics.activeAgents);
    
    console.log('\n🎉 BunenjinStrategyNavigator全機能テスト完了！');
    console.log('   すべての核心機能が正常に動作しています。');
    
} catch (error) {
    console.error('❌ テスト失敗:', error.message);
    console.error('スタックトレース:', error.stack);
    process.exit(1);
}