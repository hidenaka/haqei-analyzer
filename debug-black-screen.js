// Black Screen Debug Script
// 黒い画面問題を直接解決するためのデバッグスクリプト

console.log('🔍 Black Screen Debug Started...');

// 1. Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebug);
} else {
    initDebug();
}

function initDebug() {
    console.log('📋 Checking critical elements...');
    
    // Check for critical containers
    const checks = {
        'future-simulator': document.getElementById('future-simulator'),
        'text-input': document.getElementById('text-input'),
        'analyze-btn': document.getElementById('analyze-btn'),
        'loading-indicator': document.getElementById('loading-indicator'),
        'result-container': document.getElementById('result-container')
    };
    
    Object.entries(checks).forEach(([id, element]) => {
        if (element) {
            console.log(`✅ #${id} found`);
            // Make sure it's visible
            if (element.style.display === 'none' || element.style.visibility === 'hidden') {
                console.warn(`⚠️ #${id} is hidden!`);
                element.style.display = 'block';
                element.style.visibility = 'visible';
            }
        } else {
            console.error(`❌ #${id} NOT found`);
        }
    });
    
    // Check for critical classes
    const classChecks = [
        'BinaryTreeFutureEngine',
        'AuthenticIChingEngine',
        'TextToIChingEngine',
        'EightScenariosGenerator'
    ];
    
    classChecks.forEach(className => {
        if (window[className]) {
            console.log(`✅ ${className} loaded`);
        } else {
            console.error(`❌ ${className} NOT loaded`);
        }
    });
    
    // Check body background
    const bodyStyle = window.getComputedStyle(document.body);
    console.log('Body background:', bodyStyle.backgroundColor);
    if (bodyStyle.backgroundColor === 'rgb(0, 0, 0)' || bodyStyle.backgroundColor === 'black') {
        console.warn('⚠️ Body has black background - fixing...');
        document.body.style.backgroundColor = '#f5f5f5';
    }
    
    // Check for loading overlay blocking content
    const loadingOverlays = document.querySelectorAll('.loading, .overlay, .modal-backdrop');
    loadingOverlays.forEach(overlay => {
        if (overlay.style.display !== 'none') {
            console.warn('⚠️ Found blocking overlay:', overlay.className);
            overlay.style.display = 'none';
        }
    });
    
    // Force create basic UI if missing
    const container = document.getElementById('future-simulator');
    if (container && !document.getElementById('text-input')) {
        console.warn('⚠️ UI elements missing - creating emergency UI...');
        
        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2>🔮 未来分岐図シミュレーター (Emergency Mode)</h2>
                <div style="margin: 20px 0;">
                    <label for="emergency-input">テキストを入力:</label>
                    <textarea id="emergency-input" 
                             style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ccc;"
                             placeholder="分析したいテキストを入力してください..."></textarea>
                </div>
                <button id="emergency-analyze" 
                        style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    分析開始
                </button>
                <div id="emergency-result" style="margin-top: 20px;"></div>
            </div>
        `;
        
        // Add basic functionality
        document.getElementById('emergency-analyze').addEventListener('click', function() {
            const text = document.getElementById('emergency-input').value;
            if (!text) {
                alert('テキストを入力してください');
                return;
            }
            
            const resultDiv = document.getElementById('emergency-result');
            resultDiv.innerHTML = '<p>分析中...</p>';
            
            // Try to use existing engines
            if (window.BinaryTreeFutureEngine) {
                try {
                    const engine = new window.BinaryTreeFutureEngine();
                    const result = engine.generateFutureBranches(text);
                    resultDiv.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                } catch (e) {
                    resultDiv.innerHTML = '<p style="color: red;">エラー: ' + e.message + '</p>';
                }
            } else {
                resultDiv.innerHTML = '<p style="color: orange;">エンジンが読み込まれていません。ページをリロードしてください。</p>';
            }
        });
        
        console.log('✅ Emergency UI created');
    }
    
    // Check for JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('🔴 JavaScript Error:', e.message, 'at', e.filename, ':', e.lineno);
    });
    
    // Final visibility check
    setTimeout(() => {
        if (document.body.style.display === 'none' || document.body.style.visibility === 'hidden') {
            console.warn('⚠️ Body is hidden - forcing visibility');
            document.body.style.display = 'block';
            document.body.style.visibility = 'visible';
        }
        
        const mainContainer = document.getElementById('future-simulator');
        if (mainContainer) {
            mainContainer.style.display = 'block';
            mainContainer.style.visibility = 'visible';
            mainContainer.style.opacity = '1';
            console.log('✅ Main container made visible');
        }
    }, 1000);
    
    console.log('🔍 Debug complete - check console for issues');
}