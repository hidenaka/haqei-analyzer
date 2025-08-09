/**
 * VP View Fix - 根本的な表示問題の解決
 * MCPでの診断に基づく修正
 */

(function() {
    'use strict';
    
    console.log('🔧 VP View Fix activated');
    
    // DOMContentLoaded時に実行
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 Checking for view display issues...');
        
        // 定期的にチェック（最大20回）
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            // main-viewがアクティブかチェック
            const mainView = document.querySelector('#main-view.active');
            if (mainView) {
                console.log('🔍 Main view is active, checking container...');
                
                const mainContainer = mainView.querySelector('.vp-main-container');
                if (mainContainer) {
                    const computedStyle = window.getComputedStyle(mainContainer);
                    const opacity = computedStyle.opacity;
                    
                    console.log(`📊 Container opacity: ${opacity}`);
                    
                    if (opacity === '0' || computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                        console.log('🚨 Container is hidden! Forcing visibility...');
                        
                        // 強制的に表示
                        mainContainer.style.display = 'grid';
                        mainContainer.style.visibility = 'visible';
                        mainContainer.style.opacity = '1';
                        mainContainer.style.minHeight = '600px';
                        mainContainer.style.animation = 'none';
                        mainContainer.style.transition = 'none';
                        
                        // すべての子要素も表示
                        const allChildren = mainContainer.querySelectorAll('*');
                        allChildren.forEach(child => {
                            if (child.style.opacity === '0') {
                                child.style.opacity = '1';
                            }
                            if (child.style.visibility === 'hidden') {
                                child.style.visibility = 'visible';
                            }
                            if (child.style.display === 'none') {
                                child.style.display = '';
                            }
                        });
                        
                        console.log('✅ Container visibility forced!');
                        
                        // 成功したのでチェックを停止
                        clearInterval(checkInterval);
                    } else if (opacity === '1') {
                        console.log('✅ Container is already visible');
                        clearInterval(checkInterval);
                    }
                } else {
                    console.log('⚠️ Main container not found yet');
                }
            }
            
            // 最大試行回数に達した場合
            if (attempts >= maxAttempts) {
                console.log('⚠️ Max attempts reached');
                clearInterval(checkInterval);
            }
        }, 500); // 500msごとにチェック
    });
    
    // ページ読み込み完了時にも実行
    window.addEventListener('load', function() {
        console.log('🔧 Page fully loaded, final check...');
        
        // 最終チェック
        setTimeout(() => {
            const mainView = document.querySelector('#main-view.active');
            if (mainView) {
                const mainContainer = mainView.querySelector('.vp-main-container');
                if (mainContainer) {
                    const computedStyle = window.getComputedStyle(mainContainer);
                    if (computedStyle.opacity === '0') {
                        console.log('🚨 Final fix: Forcing container visibility');
                        mainContainer.style.cssText = `
                            display: grid !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            min-height: 600px !important;
                            animation: none !important;
                            transition: none !important;
                        `;
                    }
                }
            }
        }, 1000);
    });
    
    // グローバル関数として公開（デバッグ用）
    window.debugVPContainer = function() {
        const mainView = document.querySelector('#main-view');
        const mainContainer = document.querySelector('.vp-main-container');
        
        console.log('🔍 Debug VP Container:');
        console.table({
            'Main View': {
                exists: !!mainView,
                hasActiveClass: mainView?.classList.contains('active'),
                display: mainView ? window.getComputedStyle(mainView).display : 'N/A'
            },
            'Main Container': {
                exists: !!mainContainer,
                display: mainContainer ? window.getComputedStyle(mainContainer).display : 'N/A',
                visibility: mainContainer ? window.getComputedStyle(mainContainer).visibility : 'N/A',
                opacity: mainContainer ? window.getComputedStyle(mainContainer).opacity : 'N/A'
            }
        });
        
        return { mainView, mainContainer };
    };
})();