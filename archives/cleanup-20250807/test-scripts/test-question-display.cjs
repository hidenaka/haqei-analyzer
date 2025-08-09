/**
 * OS Analyzer 偶数番設問表示バグ検証
 * Node.js + JSDOM環境でのテスト
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// JSDOM環境の設定
const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Question Display Test</title>
    <style>
        .question-container { display: block; opacity: 1; visibility: visible; }
    </style>
</head>
<body>
    <div id="questions-container" style="display: flex;">
        <div id="virtual-viewport"></div>
    </div>
</body>
</html>
`, {
    url: 'http://localhost:8080',
    referrer: 'http://localhost:8080',
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000,
    pretendToBeVisual: true,
    resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.console = console;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;

// Performance API のモック
global.performance = {
    now: () => Date.now()
};

console.log('🧪 OS Analyzer 偶数番設問表示バグ検証テスト開始');

// 必要なコンポーネントの読み込み
function loadComponent(filepath) {
    try {
        const fullPath = path.join(__dirname, 'public', filepath);
        const code = fs.readFileSync(fullPath, 'utf8');
        
        // グローバルスコープで実行 - windowオブジェクトを明示的に設定
        const script = new dom.window.Function('window', 'document', 'console', 'HTMLElement', 'customElements', 'performance', code);
        script(dom.window, dom.window.document, console, dom.window.HTMLElement, dom.window.customElements, global.performance);
        
        console.log(`✅ Loaded: ${filepath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to load ${filepath}:`, error.message);
        return false;
    }
}

// コンポーネントの順次読み込み
const components = [
    'js/shared/core/BaseComponent.js',
    'js/shared/core/MicroStorageManager.js', 
    'js/shared/core/MicroDataManager.js',
    'js/shared/data/questions.js',
    'js/os-analyzer/core/PrecompiledQuestions.js',
    'js/os-analyzer/components/HaqeiQuestionElement.js',
    'js/os-analyzer/components/VirtualQuestionFlow.js'
];

let allLoaded = true;
for (const component of components) {
    if (!loadComponent(component)) {
        allLoaded = false;
        break;
    }
}

if (!allLoaded) {
    console.error('❌ コンポーネントの読み込みに失敗しました');
    process.exit(1);
}

// テスト実行
async function runQuestionDisplayTest() {
    console.log('\n📋 利用可能なコンポーネント確認:');
    console.log(`- BaseComponent: ${typeof global.window.BaseComponent !== 'undefined'}`);
    console.log(`- MicroStorageManager: ${typeof global.window.MicroStorageManager !== 'undefined'}`);
    console.log(`- VirtualQuestionFlow: ${typeof global.window.VirtualQuestionFlow !== 'undefined'}`);
    console.log(`- HaqeiQuestionElement: ${typeof global.window.HaqeiQuestionElement !== 'undefined'}`);
    console.log(`- WORLDVIEW_QUESTIONS: ${typeof global.window.WORLDVIEW_QUESTIONS !== 'undefined'}`);
    console.log(`- SCENARIO_QUESTIONS: ${typeof global.window.SCENARIO_QUESTIONS !== 'undefined'}`);

    if (!global.window.VirtualQuestionFlow) {
        console.error('❌ VirtualQuestionFlow が利用できません');
        return;
    }

    console.log('\n🔍 設問データ分析:');
    const allQuestions = [...global.window.WORLDVIEW_QUESTIONS, ...global.window.SCENARIO_QUESTIONS];
    console.log(`総設問数: ${allQuestions.length}`);
    
    // 偶数番と奇数番の設問を分類
    const evenQuestions = [];
    const oddQuestions = [];
    
    allQuestions.forEach(q => {
        const num = parseInt(q.id.replace('q', ''));
        if (num % 2 === 0) {
            evenQuestions.push(q);
        } else {
            oddQuestions.push(q);
        }
    });
    
    console.log(`奇数番設問: ${oddQuestions.length}個 (${oddQuestions.map(q => q.id).join(', ')})`);
    console.log(`偶数番設問: ${evenQuestions.length}個 (${evenQuestions.map(q => q.id).join(', ')})`);

    // VirtualQuestionFlow インスタンス作成
    console.log('\n🚀 VirtualQuestionFlow インスタンス作成...');
    const virtualFlow = new global.window.VirtualQuestionFlow('questions-container', {
        storageManager: new global.window.MicroStorageManager(),
        onProgress: (progress) => {
            console.log(`Progress: ${progress.toFixed(1)}%`);
        },
        onComplete: (answers) => {
            console.log(`Complete: ${answers.length} answers`);
        }
    });

    // 初期化
    console.log('🔧 VirtualQuestionFlow 初期化...');
    virtualFlow.init();

    console.log('\n📊 初期化後の状態:');
    console.log(`- 読み込み設問数: ${virtualFlow.questions.length}`);
    console.log(`- 現在の設問インデックス: ${virtualFlow.currentQuestionIndex}`);
    console.log(`- 可視範囲: ${virtualFlow.visibleRange.start}-${virtualFlow.visibleRange.end}`);
    console.log(`- アクティブ要素数: ${virtualFlow.activeElements.size}`);

    // 偶数番設問のテスト
    console.log('\n🧪 偶数番設問表示テスト開始');
    const testResults = [];

    for (const question of evenQuestions.slice(0, 5)) { // 最初の5個をテスト
        console.log(`\n--- ${question.id} テスト ---`);
        
        // 該当設問にジャンプ
        const questionIndex = virtualFlow.questions.findIndex(q => q.id === question.id);
        if (questionIndex < 0) {
            console.log(`❌ Question ${question.id} not found in loaded questions`);
            continue;
        }

        virtualFlow.currentQuestionIndex = questionIndex;
        virtualFlow.updateVisibleRange();

        // 少し待機してレンダリング完了を待つ
        await new Promise(resolve => setTimeout(resolve, 100));

        // DOM要素の確認
        const viewport = document.querySelector('#virtual-viewport');
        const questionElement = Array.from(viewport.children).find(el => 
            el.dataset && el.dataset.questionId === question.id
        );

        let testResult = {
            questionId: question.id,
            questionNumber: parseInt(question.id.replace('q', '')),
            isEven: true,
            elementExists: !!questionElement,
            isVisible: false,
            styles: {},
            shadowDOMPresent: false,
            issues: []
        };

        if (questionElement) {
            console.log(`✅ Element found for ${question.id}`);
            
            // スタイル確認
            const computedStyle = dom.window.getComputedStyle(questionElement);
            testResult.styles = {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                inlineDisplay: questionElement.style.display,
                inlineOpacity: questionElement.style.opacity
            };

            // 可視性判定
            testResult.isVisible = computedStyle.display !== 'none' && 
                                  computedStyle.opacity !== '0' && 
                                  computedStyle.visibility !== 'hidden';

            // Shadow DOM 確認
            testResult.shadowDOMPresent = !!questionElement.shadowRoot;
            
            console.log(`Display: ${testResult.styles.display}, Opacity: ${testResult.styles.opacity}`);
            console.log(`Visible: ${testResult.isVisible ? '✅' : '❌'}`);
            console.log(`Shadow DOM: ${testResult.shadowDOMPresent ? '✅' : '❌'}`);

            // 問題の特定
            if (!testResult.isVisible) {
                if (testResult.styles.display === 'none') {
                    testResult.issues.push('display: none が設定されている');
                }
                if (testResult.styles.opacity === '0') {
                    testResult.issues.push('opacity: 0 が設定されている');
                }
                if (testResult.styles.visibility === 'hidden') {
                    testResult.issues.push('visibility: hidden が設定されている');
                }
            }

            // クラス確認
            const classes = Array.from(questionElement.classList);
            console.log(`Classes: [${classes.join(', ')}]`);
            
        } else {
            console.log(`❌ Element not found for ${question.id}`);
            testResult.issues.push('DOM要素が作成されていない');
        }

        testResults.push(testResult);
    }

    // テスト結果の分析
    console.log('\n📊 テスト結果サマリー:');
    const visibleCount = testResults.filter(r => r.isVisible).length;
    const hiddenCount = testResults.length - visibleCount;
    
    console.log(`総テスト数: ${testResults.length}`);
    console.log(`表示成功: ${visibleCount}`);
    console.log(`表示失敗: ${hiddenCount}`);

    if (hiddenCount > 0) {
        console.log('\n❌ 表示に失敗した偶数番設問:');
        testResults.filter(r => !r.isVisible).forEach(result => {
            console.log(`  ${result.questionId}: ${result.issues.join(', ')}`);
        });

        console.log('\n🔍 問題分析:');
        
        // showCurrentQuestion メソッドの動作を詳細確認
        console.log('showCurrentQuestion メソッドの動作分析中...');
        
        // テスト用に奇数番設問も確認
        const oddTestQuestion = oddQuestions[0];
        if (oddTestQuestion) {
            console.log(`\n📋 奇数番設問 ${oddTestQuestion.id} との比較テスト:`);
            
            const oddIndex = virtualFlow.questions.findIndex(q => q.id === oddTestQuestion.id);
            virtualFlow.currentQuestionIndex = oddIndex;
            virtualFlow.updateVisibleRange();
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const oddElement = Array.from(viewport.children).find(el => 
                el.dataset && el.dataset.questionId === oddTestQuestion.id
            );
            
            if (oddElement) {
                const oddStyle = dom.window.getComputedStyle(oddElement);
                const oddVisible = oddStyle.display !== 'none' && 
                                 oddStyle.opacity !== '0' && 
                                 oddStyle.visibility !== 'hidden';
                                 
                console.log(`奇数番 ${oddTestQuestion.id}: ${oddVisible ? '表示成功' : '表示失敗'}`);
                console.log(`  display: ${oddStyle.display}, opacity: ${oddStyle.opacity}`);
            }
        }
    } else {
        console.log('✅ すべての偶数番設問が正常に表示されました');
    }

    // 詳細レポート出力
    console.log('\n📄 詳細テストレポート:');
    testResults.forEach(result => {
        console.log(`\n${result.questionId} (Q${result.questionNumber}):`);
        console.log(`  要素存在: ${result.elementExists ? '✅' : '❌'}`);
        console.log(`  表示状態: ${result.isVisible ? '✅' : '❌'}`);
        console.log(`  Shadow DOM: ${result.shadowDOMPresent ? '✅' : '❌'}`);
        if (result.issues.length > 0) {
            console.log(`  問題: ${result.issues.join(', ')}`);
        }
        console.log(`  スタイル: display=${result.styles.display}, opacity=${result.styles.opacity}`);
    });

    return testResults;
}

// テスト実行
runQuestionDisplayTest()
    .then(results => {
        console.log('\n✅ テスト完了');
        
        // 結果をファイルに保存
        const report = {
            timestamp: new Date().toISOString(),
            testType: 'even-question-display-verification',
            results: results,
            summary: {
                totalTested: results.length,
                visibleCount: results.filter(r => r.isVisible).length,
                hiddenCount: results.filter(r => !r.isVisible).length
            }
        };
        
        fs.writeFileSync('question-display-test-report.json', JSON.stringify(report, null, 2));
        console.log('📄 テストレポートを question-display-test-report.json に保存しました');
    })
    .catch(error => {
        console.error('❌ テスト実行エラー:', error);
        process.exit(1);
    });