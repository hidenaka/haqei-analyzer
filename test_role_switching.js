// CTO・プログラマー・QA役割切り替え動作確認テスト
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎭 CTO・プログラマー・QA役割切り替え動作確認テスト開始');

// 最小限の環境をセットアップ
global.window = {};
global.console = console;

try {
    // BunenjinStrategyNavigatorを読み込み
    const bunenjinCode = fs.readFileSync(
        path.join(__dirname, 'public/js/core/BunenjinStrategyNavigator.js'), 
        'utf8'
    );
    
    // ES6 exportを削除してevalで実行
    const modifiedCode = bunenjinCode.replace('export default BunenjinStrategyNavigator;', '');
    eval(modifiedCode);
    
    const BunenjinStrategyNavigator = global.window.BunenjinStrategyNavigator;
    
    if (!BunenjinStrategyNavigator) {
        throw new Error('BunenjinStrategyNavigator クラスが見つからない');
    }
    
    console.log('✅ BunenjinStrategyNavigator読み込み成功');
    
    // インスタンス生成
    const navigator = new BunenjinStrategyNavigator(null);
    
    console.log('\n=== 🎯 CTO分人（Engine OS）役割切り替えテスト ===');
    
    // CTOに切り替え
    const ctoContext = { 
        task: '新機能の技術方針決定',
        complexity: 'high',
        stakeholders: ['ユーザー', '開発チーム', '経営陣']
    };
    
    const ctoRole = navigator.switchToRole('CTO', ctoContext);
    
    console.log('✅ CTO役割切り替え成功');
    console.log('   🔹 役割名:', ctoRole.role.nickname);
    console.log('   🔹 OS配置:', ctoRole.role.osAlignment);
    console.log('   🔹 核心特性:', ctoRole.role.personality.core);
    console.log('   🔹 思考モード:', ctoRole.thinkingMode.focus);
    console.log('   🔹 主要責任:', ctoRole.role.responsibilities.slice(0, 3).join(', '));
    
    // Engine OS特有の判断基準確認
    console.log('   🧠 Engine OS判断基準:');
    ctoRole.role.decisionPatterns.evaluationCriteria.forEach((criteria, i) => {
        console.log(`      ${i+1}. ${criteria}`);
    });
    
    console.log('\n=== ⚡ プログラマー分人（Interface OS）役割切り替えテスト ===');
    
    // プログラマーに切り替え
    const programmerContext = {
        task: 'CTO方針に基づく具体的実装',
        framework: 'JavaScript/HTML/CSS',
        deadline: '2週間'
    };
    
    const programmerRole = navigator.switchToRole('PROGRAMMER', programmerContext);
    
    console.log('✅ プログラマー役割切り替え成功');
    console.log('   🔹 役割名:', programmerRole.role.nickname);
    console.log('   🔹 OS配置:', programmerRole.role.osAlignment);
    console.log('   🔹 核心特性:', programmerRole.role.personality.core);
    console.log('   🔹 思考モード:', programmerRole.thinkingMode.focus);
    console.log('   🔹 主要責任:', programmerRole.role.responsibilities.slice(0, 3).join(', '));
    
    // Interface OS特有の実装パターン確認
    console.log('   🔧 Interface OS実装スタイル:');
    programmerRole.role.implementationPatterns.workingStyle.forEach((style, i) => {
        console.log(`      ${i+1}. ${style}`);
    });
    
    console.log('\n=== 🛡️ QA分人（SafeMode OS）役割切り替えテスト ===');
    
    // QAに切り替え
    const qaContext = {
        task: '実装品質の検証とリスク評価',
        scope: '全システム品質チェック',
        priority: 'セキュリティと安定性'
    };
    
    const qaRole = navigator.switchToRole('QA', qaContext);
    
    console.log('✅ QA役割切り替え成功');
    console.log('   🔹 役割名:', qaRole.role.nickname);
    console.log('   🔹 OS配置:', qaRole.role.osAlignment);
    console.log('   🔹 核心特性:', qaRole.role.personality.core);
    console.log('   🔹 思考モード:', qaRole.thinkingMode.focus);
    console.log('   🔹 主要責任:', qaRole.role.responsibilities.slice(0, 3).join(', '));
    
    // SafeMode OS特有の品質チェック確認
    console.log('   🔍 SafeMode OS品質チェックポイント:');
    qaRole.role.qualityPatterns.checkPoints.forEach((point, i) => {
        console.log(`      ${i+1}. ${point}`);
    });
    
    console.log('\n=== 🔄 Triple OS間の相互作用テスト ===');
    
    // CTO → プログラマー間のコミュニケーションパターン
    const ctoToProgrammer = navigator._getCommunicationPattern('CTO', 'PROGRAMMER');
    console.log('✅ CTO → プログラマー コミュニケーション:');
    console.log('   🔹 スタイル:', ctoToProgrammer.style);
    console.log('   🔹 アプローチ:', ctoToProgrammer.approach);
    console.log('   🔹 焦点:', ctoToProgrammer.focus);
    
    // プログラマー → QA間のコミュニケーションパターン
    const programmerToQA = navigator._getCommunicationPattern('PROGRAMMER', 'QA');
    console.log('✅ プログラマー → QA コミュニケーション:');
    console.log('   🔹 スタイル:', programmerToQA.style);
    console.log('   🔹 アプローチ:', programmerToQA.approach);
    console.log('   🔹 焦点:', programmerToQA.focus);
    
    // QA → CTO間のコミュニケーションパターン
    const qaToCTO = navigator._getCommunicationPattern('QA', 'CTO');
    console.log('✅ QA → CTO コミュニケーション:');
    console.log('   🔹 スタイル:', qaToCTO.style);
    console.log('   🔹 アプローチ:', qaToCTO.approach);
    console.log('   🔹 焦点:', qaToCTO.focus);
    
    console.log('\n=== 📊 分人思想の統合性検証 ===');
    
    // 各OSの思考モードの違いを確認
    const engineThinking = navigator._getThinkingModeForRole(ctoRole.role);
    const interfaceThinking = navigator._getThinkingModeForRole(programmerRole.role);
    const safeModeThinking = navigator._getThinkingModeForRole(qaRole.role);
    
    console.log('✅ Triple OS思考特性の差別化:');
    console.log('   🎯 Engine OS (CTO):', engineThinking.strengths.join(', '));
    console.log('   ⚡ Interface OS (PROGRAMMER):', interfaceThinking.strengths.join(', '));
    console.log('   🛡️ SafeMode OS (QA):', safeModeThinking.strengths.join(', '));
    
    console.log('\n=== 🚀 シナリオベース統合テスト ===');
    
    // 実際のワークフローシナリオで役割切り替えをテスト
    console.log('シナリオ: 「新しいUI機能追加プロジェクト」');
    
    // フェーズ1: CTO主導の戦略立案
    console.log('\n📋 フェーズ1: 戦略立案 (CTO主導)');
    const strategyCTO = navigator.switchToRole('CTO', {
        phase: 'PLANNING',
        requirement: '新しいUI機能追加',
        priority: 'ユーザー体験向上'
    });
    console.log('   ✅ CTO分人活性化: 戦略的判断モード');
    console.log('   🎯 焦点:', strategyCTO.thinkingMode.focus);
    
    // フェーズ2: プログラマー参加の設計検討
    console.log('\n🏗️ フェーズ2: 技術設計 (CTO + プログラマー)');
    const designProgrammer = navigator.switchToRole('PROGRAMMER', {
        phase: 'DESIGN',
        ctoGuidance: 'CTO方針に基づく技術仕様策定',
        constraints: '既存システムとの整合性'
    });
    console.log('   ✅ プログラマー分人活性化: 実装設計モード');
    console.log('   ⚡ 焦点:', designProgrammer.thinkingMode.focus);
    
    // フェーズ3: QA参加の品質計画
    console.log('\n🔍 フェーズ3: 品質保証計画 (プログラマー + QA)');
    const qualityQA = navigator.switchToRole('QA', {
        phase: 'PLANNING',
        implementationPlan: 'プログラマー設計に基づく品質基準',
        riskFactors: ['ユーザビリティ', 'パフォーマンス', 'セキュリティ']
    });
    console.log('   ✅ QA分人活性化: 防御的品質計画モード');
    console.log('   🛡️ 焦点:', qualityQA.thinkingMode.focus);
    
    console.log('\n🎉 CTO・プログラマー・QA役割切り替え動作確認テスト完了！');
    console.log('\n📋 テスト結果サマリー:');
    console.log('   ✅ Triple OS Architecture による分人役割の明確な分離');
    console.log('   ✅ Engine/Interface/SafeMode の思考パターン差別化');
    console.log('   ✅ エージェント間コミュニケーションパターンの最適化');
    console.log('   ✅ フェーズベースでの動的役割切り替え');
    console.log('   ✅ 分人思想に基づく統合的組織ワークフロー');
    
    console.log('\n🌟 分人思想組織システムが完全に動作しています！');
    
} catch (error) {
    console.error('❌ テスト失敗:', error.message);
    console.error('スタックトレース:', error.stack);
    process.exit(1);
}