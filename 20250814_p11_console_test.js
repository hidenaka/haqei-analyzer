/**
 * P1-1: コンソール即席テスト（20秒）
 * triple-os-storage.jsの動作確認
 */

// テストデータ
const testPayload = {
    engineOS: "探求型",
    interfaceOS: "調整型",
    safeModeOS: "防衛型",
    source: "console-test"
};

console.log('🧪 P1-1: Triple OS Storage Console Test');

// 1. 保存テスト（モジュールが正しく読み込まれている前提）
if (typeof window !== 'undefined') {
    console.error('❌ This test should be run in a browser console, not Node.js');
} else {
    console.log('✅ Node.js environment detected');
    
    // モジュール読み込み
    import('./public/js/triple-os-storage.js').then(module => {
        const { saveTripleOSResults, readTripleOSRaw, clearTripleOS, TRIPLE_OS_KEY } = module;
        
        console.log('✅ Module imported successfully');
        
        // 2. 既存データクリア
        console.log('🧹 Clearing existing data...');
        clearTripleOS();
        
        // 3. 保存テスト
        console.log('💾 Testing save...');
        try {
            const saved = saveTripleOSResults(testPayload, { ttlHours: 24 });
            console.log('✅ Save successful:', saved);
        } catch (error) {
            console.error('❌ Save failed:', error);
            return;
        }
        
        // 4. 読み取りテスト
        console.log('📖 Testing read...');
        const read = readTripleOSRaw();
        console.log('✅ Read result:', read);
        
        // 5. バリデーション
        console.log('✅ Validation:');
        console.log('  - engineOS:', read?.engineOS === testPayload.engineOS);
        console.log('  - interfaceOS:', read?.interfaceOS === testPayload.interfaceOS);
        console.log('  - safeModeOS:', read?.safeModeOS === testPayload.safeModeOS);
        console.log('  - version:', read?.version === 'v1');
        console.log('  - dates valid:', new Date(read?.createdAt) < new Date(read?.expiresAt));
        
        console.log('🎉 Console test completed');
        
    }).catch(error => {
        console.error('❌ Module import failed:', error);
    });
}

// ブラウザコンソール用のテスト関数
if (typeof window !== 'undefined') {
    window.testTripleOSStorage = function() {
        console.log('🧪 Browser Console Test for Triple OS Storage');
        
        // LocalStorage direct test
        const testData = {
            version: "v1",
            engineOS: "探求型",
            interfaceOS: "調整型", 
            safeModeOS: "防衛型",
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            source: "console-test",
            notes: ""
        };
        
        // Save test
        localStorage.setItem('haqei.tripleOS.v1', JSON.stringify(testData));
        console.log('✅ Direct localStorage save');
        
        // Read test  
        const retrieved = JSON.parse(localStorage.getItem('haqei.tripleOS.v1'));
        console.log('✅ Direct localStorage read:', retrieved);
        
        // Validation
        console.log('✅ Validation:');
        console.log('  - Data matches:', JSON.stringify(testData) === JSON.stringify(retrieved));
        console.log('  - Date format valid:', !isNaN(Date.parse(retrieved.createdAt)));
        console.log('  - Expiry valid:', new Date(retrieved.expiresAt) > new Date(retrieved.createdAt));
        
        return retrieved;
    };
    
    console.log('📝 Run window.testTripleOSStorage() in browser console to test');
}