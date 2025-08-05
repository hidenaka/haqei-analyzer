// デバッグスクリプト - 偶数番設問の表示問題を調査
console.log('🔍 偶数番設問デバッグ開始');

// 現在のVirtualQuestionFlowインスタンスを取得
setTimeout(() => {
    if (window.app && window.app.questionFlow) {
        const flow = window.app.questionFlow;
        
        console.log('📊 現在の状態:', {
            currentIndex: flow.currentQuestionIndex,
            activeElements: flow.activeElements.size,
            questions: flow.questions.length
        });
        
        // すべてのアクティブ要素の状態を確認
        console.log('\n🔍 アクティブ要素の詳細:');
        for (const [index, element] of flow.activeElements) {
            const computedStyle = window.getComputedStyle(element);
            const question = flow.questions[index];
            console.log(`${index}: ${question.id}`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                className: element.className,
                hasActiveClass: element.classList.contains('active-question'),
                actualStyleDisplay: element.style.display
            });
        }
        
        // 現在表示されているべき要素の詳細確認
        const currentEl = flow.activeElements.get(flow.currentQuestionIndex);
        if (currentEl) {
            console.log('\n✨ 現在の要素の詳細:', {
                index: flow.currentQuestionIndex,
                id: currentEl.dataset.questionId,
                shadowRoot: !!currentEl.shadowRoot,
                offsetHeight: currentEl.offsetHeight,
                offsetWidth: currentEl.offsetWidth,
                getBoundingClientRect: currentEl.getBoundingClientRect()
            });
            
            // Shadow DOM内の確認
            if (currentEl.shadowRoot) {
                const container = currentEl.shadowRoot.querySelector('.question-container');
                if (container) {
                    const containerStyle = window.getComputedStyle(container);
                    console.log('Shadow DOM container:', {
                        display: containerStyle.display,
                        opacity: containerStyle.opacity
                    });
                }
            }
        }
        
        // 偶数番の設問を強制的に表示してみる
        console.log('\n🔧 偶数番設問の強制表示テスト:');
        const testIndex = 1; // q2
        const testEl = flow.activeElements.get(testIndex);
        if (testEl) {
            // 既存のスタイルをクリア
            testEl.removeAttribute('style');
            // 新しいスタイルを設定
            testEl.style.display = 'block';
            testEl.style.opacity = '1';
            testEl.style.visibility = 'visible';
            
            setTimeout(() => {
                const finalStyle = window.getComputedStyle(testEl);
                console.log('強制表示後の状態:', {
                    display: finalStyle.display,
                    opacity: finalStyle.opacity,
                    visibility: finalStyle.visibility
                });
            }, 100);
        }
        
    } else {
        console.error('❌ VirtualQuestionFlowインスタンスが見つかりません');
    }
}, 2000);