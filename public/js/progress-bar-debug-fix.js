/**
 * Progress Bar Debug Fix - 進捗バーのデバッグと修正
 * 進捗バーが表示されない問題を特定・修正
 */

// 進捗バーの状態をチェックして修正する関数
function debugAndFixProgressBar() {
    console.log('🔧 Starting progress bar debug and fix...');
    
    // 進捗バー要素を検索
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-bar-fill');
    
    console.log('🔍 Progress bar elements found:', {
        container: !!progressContainer,
        bar: !!progressBar,
        fill: !!progressFill
    });
    
    if (progressContainer) {
        console.log('📊 Progress container styles:');
        const containerStyles = window.getComputedStyle(progressContainer);
        console.log('- Display:', containerStyles.display);
        console.log('- Visibility:', containerStyles.visibility);
        console.log('- Opacity:', containerStyles.opacity);
        console.log('- Position:', containerStyles.position);
        console.log('- Z-index:', containerStyles.zIndex);
        console.log('- Width:', containerStyles.width);
        console.log('- Height:', containerStyles.height);
        
        // 強制修正
        progressContainer.style.display = 'block';
        progressContainer.style.visibility = 'visible';
        progressContainer.style.opacity = '1';
        progressContainer.style.position = 'relative';
        progressContainer.style.zIndex = '999999';
        progressContainer.style.background = 'rgba(26, 26, 26, 0.95)';
        progressContainer.style.padding = '20px';
        progressContainer.style.margin = '0 0 20px 0';
        progressContainer.style.borderRadius = '12px';
        progressContainer.style.border = '2px solid #ff0000'; // デバッグ用
        
        console.log('✅ Progress container fixed');
    } else {
        console.error('❌ Progress container not found!');
        
        // 進捗バーが存在しない場合は手動で作成
        const questionsContainer = document.getElementById('questions-container');
        if (questionsContainer) {
            const progressHTML = `
                <div class="progress-container" style="
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    background: rgba(26, 26, 26, 0.95);
                    padding: 20px;
                    margin: 0 0 20px 0;
                    border-radius: 12px;
                    border: 2px solid #ff0000;
                    z-index: 999999;
                ">
                    <div class="progress-bar" style="
                        display: block !important;
                        background: #3a3a3a;
                        height: 12px;
                        border-radius: 6px;
                        overflow: hidden;
                        margin-bottom: 12px;
                        border: 1px solid #00ff00;
                    ">
                        <div class="progress-bar-fill" style="
                            display: block !important;
                            background: linear-gradient(90deg, #6366f1, #8b5cf6);
                            height: 100%;
                            width: 0%;
                            transition: width 0.3s ease;
                            border: 1px solid #0000ff;
                        "></div>
                    </div>
                    <div style="color: white; text-align: center; font-size: 14px; display: none;">
                        <!-- Emergency message removed for clean UI -->
                    </div>
                </div>
            `;
            
            questionsContainer.insertAdjacentHTML('afterbegin', progressHTML);
            console.log('🚨 Emergency progress bar created');
        }
    }
    
    if (progressBar) {
        console.log('📊 Progress bar styles:');
        const barStyles = window.getComputedStyle(progressBar);
        console.log('- Display:', barStyles.display);
        console.log('- Background:', barStyles.background);
        console.log('- Height:', barStyles.height);
        
        // 強制修正
        progressBar.style.display = 'block';
        progressBar.style.visibility = 'visible';
        progressBar.style.opacity = '1';
        progressBar.style.background = '#3a3a3a';
        progressBar.style.height = '12px';
        progressBar.style.borderRadius = '6px';
        progressBar.style.overflow = 'hidden';
        progressBar.style.border = '1px solid #00ff00'; // デバッグ用
        
        console.log('✅ Progress bar fixed');
    }
    
    if (progressFill) {
        console.log('📊 Progress fill styles:');
        const fillStyles = window.getComputedStyle(progressFill);
        console.log('- Display:', fillStyles.display);
        console.log('- Width:', fillStyles.width);
        console.log('- Background:', fillStyles.background);
        
        // 強制修正
        progressFill.style.display = 'block';
        progressFill.style.visibility = 'visible';
        progressFill.style.opacity = '1';
        progressFill.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
        progressFill.style.height = '100%';
        progressFill.style.minWidth = '5%'; // 最低限の表示
        progressFill.style.border = '1px solid #0000ff'; // デバッグ用
        
        console.log('✅ Progress fill fixed');
    }
    
    // DOM全体をスキャンして隠れている進捗バーを探す
    console.log('🔍 Scanning for hidden progress elements...');
    const allElements = document.querySelectorAll('*');
    let hiddenProgressElements = [];
    
    allElements.forEach(element => {
        if (element.className && 
            (element.className.includes('progress') || 
             element.id && element.id.includes('progress'))) {
            
            const styles = window.getComputedStyle(element);
            if (styles.display === 'none' || 
                styles.visibility === 'hidden' || 
                styles.opacity === '0') {
                hiddenProgressElements.push({
                    element: element,
                    className: element.className,
                    id: element.id,
                    display: styles.display,
                    visibility: styles.visibility,
                    opacity: styles.opacity
                });
            }
        }
    });
    
    console.log('🔍 Hidden progress elements found:', hiddenProgressElements.length);
    hiddenProgressElements.forEach((item, index) => {
        console.log(`Hidden element ${index + 1}:`, item);
    });
    
    console.log('✅ Progress bar debug and fix completed');
}

// 進捗バーの更新をテストする関数
function testProgressBarUpdate() {
    console.log('🧪 Testing progress bar update...');
    
    const progressFill = document.querySelector('.progress-bar-fill');
    if (progressFill) {
        // テスト用に進捗を50%に設定
        progressFill.style.width = '50%';
        console.log('✅ Progress set to 50% for testing');
        
        // 2秒後に75%に変更
        setTimeout(() => {
            progressFill.style.width = '75%';
            console.log('✅ Progress updated to 75%');
        }, 2000);
    } else {
        console.error('❌ Progress fill element not found for testing');
    }
}

// DOM読み込み完了後に実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(debugAndFixProgressBar, 500);
        setTimeout(testProgressBarUpdate, 2000);
    });
} else {
    // すでに読み込み完了している場合
    setTimeout(debugAndFixProgressBar, 100);
    setTimeout(testProgressBarUpdate, 1000);
}

// 定期的なチェック（本番では無効化）
/*
setInterval(() => {
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        const styles = window.getComputedStyle(progressContainer);
        if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
            console.warn('⚠️ Progress bar became hidden, fixing...');
            debugAndFixProgressBar();
        }
    }
}, 5000);
*/

// グローバル関数として公開
window.debugProgressBar = debugAndFixProgressBar;
window.testProgressBar = testProgressBarUpdate;

console.log('🔧 Progress bar debug fix script loaded');