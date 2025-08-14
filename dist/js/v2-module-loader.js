/**
 * v2.2.0 ES Module Loader
 * v2.2.0 I Ching統合クラスを動的に読み込みwindowオブジェクトに登録
 */

// ES Moduleクラスの動的読み込みと初期化
(async function initializeV22Modules() {
    try {
        console.log('🚀 v2.2.0 Module Loader 初期化開始');
        
        // 1. ConfigLoaderの読み込み
        const { ConfigLoader } = await import('../config/config-loader-adapter.js');
        window.ConfigLoader = ConfigLoader;
        console.log('✅ ConfigLoader loaded');
        
        // 2. KingWenMappingの読み込み
        const { KingWenMapping } = await import('./iching/KingWenMapping.js');
        window.KingWenMapping = KingWenMapping;
        console.log('✅ KingWenMapping loaded');
        
        // 3. LineSelector, AdvanceProcessor, MultiLineInterpreterの読み込み
        const [
            { LineSelector },
            { AdvanceProcessor },
            { MultiLineInterpreter }
        ] = await Promise.all([
            import('./iching/LineSelector.js'),
            import('./iching/AdvanceProcessor.js'),
            import('./iching/MultiLineInterpreter.js')
        ]);
        
        window.LineSelector = LineSelector;
        window.AdvanceProcessor = AdvanceProcessor;
        window.MultiLineInterpreter = MultiLineInterpreter;
        
        console.log('✅ All v2.2.0 classes loaded successfully');
        
        // 4. グローバル初期化完了イベント発火
        const event = new CustomEvent('v22ModulesLoaded', {
            detail: {
                classes: ['ConfigLoader', 'KingWenMapping', 'LineSelector', 'AdvanceProcessor', 'MultiLineInterpreter'],
                loadedAt: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
        
        // 5. 既存のEightScenariosGeneratorがあれば自動初期化
        if (window.EightScenariosGenerator && window.haqeiScenariosGenerator) {
            try {
                await window.haqeiScenariosGenerator.initializeV22Components();
                console.log('✅ EightScenariosGenerator v2.2.0 auto-initialization complete');
            } catch (error) {
                console.warn('⚠️ EightScenariosGenerator auto-initialization failed:', error);
            }
        }
        
        console.log('🎯 v2.2.0 Module Loader 初期化完了');
        
    } catch (error) {
        console.error('❌ v2.2.0 Module Loader 初期化失敗:', error);
        
        // フォールバック: 従来のscriptタグでの読み込みを試行
        console.log('🔄 Fallback: Attempting legacy script loading...');
        window.v22ModulesLoadError = error;
    }
})();