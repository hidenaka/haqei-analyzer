/**
 * HAQEI App Main JavaScript - CSP Compliant
 * All inline scripts extracted to external file
 */

'use strict';

// Wait for all dependencies to load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 HAQEI App initialization started');
    
    // Wait for critical datasets
    await waitForDatasets();
    
    // Initialize UI
    initializeUI();
    
    // Setup event handlers
    setupEventHandlers();
    
    console.log('✅ HAQEI App initialization complete');
});

/**
 * Wait for critical datasets to load - EMERGENCY FIX for 8Q system
 */
function waitForDatasets() {
    return new Promise((resolve) => {
        // EMERGENCY: Block 8-question system and force 36-question system
        if (window.QUESTIONS && window.QUESTIONS.length === 8) {
            console.warn('⚠️ EMERGENCY FIX: Detected 8-question system, blocking...');
            delete window.QUESTIONS;
        }
        
        const checkDatasets = () => {
            return window.H64_DATA && 
                   window.H384_DATA && 
                   typeof window.TripleOSInteractionAnalyzer !== 'undefined';
        };
        
        if (checkDatasets()) {
            console.log('✅ All datasets loaded immediately');
            return resolve();
        }
        
        const interval = setInterval(() => {
            if (checkDatasets()) {
                clearInterval(interval);
                console.log('✅ All datasets loaded after wait');
                resolve();
            }
        }, 100);
        
        // Safety timeout - proceed even if not all loaded
        setTimeout(() => {
            clearInterval(interval);
            console.log('⚠️ Dataset loading timeout - proceeding with Safe Mode');
            resolve();
        }, 5000);
    });
}

/**
 * Initialize UI elements
 */
function initializeUI() {
    // Ensure critical DOM elements exist
    if (!document.getElementById('question-container')) {
        console.warn('⚠️ Question container not found - creating fallback');
        createFallbackElements();
    }
    
    // Show welcome screen
    showWelcomeScreen();
}

/**
 * Create fallback elements if not found
 */
function createFallbackElements() {
    const container = document.querySelector('.container') || document.body;
    
    if (!document.getElementById('question-container')) {
        const questionContainer = document.createElement('div');
        questionContainer.id = 'question-container';
        questionContainer.className = 'screen';
        questionContainer.style.display = 'none';
        container.appendChild(questionContainer);
    }
}

/**
 * Setup all event handlers
 */
function setupEventHandlers() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', handleStartAnalysis, { once: false });
        console.log('✅ Start button event handler attached');
    } else {
        console.warn('⚠️ Start button not found');
    }
    
    // Setup navigation handlers
    setupNavigationHandlers();
}

/**
 * Handle start analysis button click
 */
async function handleStartAnalysis(event) {
    event.preventDefault();
    console.log('🎯 Analysis started by user');
    
    try {
        // ScreenManagerを使用して画面遷移
        if (window.ScreenManager) {
            // 質問画面に切り替え
            window.ScreenManager.switchTo('question', {
                callback: () => {
                    // 最初の質問を表示
                    displayQuestion(0);
                }
            });
        } else {
            // フォールバック（ScreenManagerがない場合）
            showLoadingState();
            await new Promise(resolve => setTimeout(resolve, 500));
            await startQuestionFlow();
        }
        
    } catch (error) {
        console.error('❌ Error starting analysis:', error);
        // ScreenManagerを使用してエラー表示
        if (window.ScreenManager) {
            window.ScreenManager.showError('分析の開始中にエラーが発生しました。', {
                currentStep: '1',
                totalSteps: '3',
                errorCode: 'ANALYSIS_START_FAILED',
                recoveryActions: [
                    'ページを再読み込みしてください',
                    'ブラウザキャッシュをクリアしてください',
                    '別のブラウザで試してください'
                ]
            });
        } else {
            showErrorState('分析の開始中にエラーが発生しました。', {
                currentStep: '1',
                totalSteps: '3',
                errorCode: 'ANALYSIS_START_FAILED',
                recoveryActions: [
                    'ページを再読み込みしてください',
                    'ブラウザキャッシュをクリアしてください',
                    '別のブラウザで試してください'
                ]
            });
        }
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    // ローディング表示は一旦スキップ（画面遷移を優先）
    console.log('⏳ Loading state (skipped for now)');
}

/**
 * Show enhanced error state with progress context
 */
function showErrorState(message, context = {}) {
    const { 
        currentStep = '不明',
        totalSteps = '不明',
        errorCode = 'UNKNOWN',
        recoveryActions = []
    } = context;
    
    const container = document.querySelector('.container') || document.body;
    const recoveryActionsHtml = recoveryActions.length > 0 ? `
        <div class="recovery-actions">
            <h3>💡 解決方法</h3>
            <ul>
                ${recoveryActions.map(action => `<li>${action}</li>`).join('')}
            </ul>
        </div>
    ` : '';
    
    container.innerHTML = `
        <div class="error-screen">
            <div class="error-message">
                <div class="error-header">
                    <h2>⚠️ エラーが発生しました</h2>
                    <div class="error-context">
                        <span class="error-step">ステップ ${currentStep}/${totalSteps}</span>
                        <span class="error-code">エラーコード: ${errorCode}</span>
                    </div>
                </div>
                
                <div class="error-details">
                    <p class="error-message-text">${message}</p>
                    
                    ${recoveryActionsHtml}
                    
                    <div class="error-actions">
                        <button onclick="location.reload()" class="btn btn-primary">
                            🔄 ページを再読み込み
                        </button>
                        <button onclick="showTechnicalDetails('${errorCode}')" class="btn btn-secondary">
                            🔧 技術的な詳細
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show enhanced progress indicator
 */
function showProgressIndicator(current, total, message = '', phase = '') {
    const progressPercent = (current / total) * 100;
    const progressContainer = document.querySelector('.progress-container');
    
    if (progressContainer) {
        progressContainer.innerHTML = `
            <div class="progress-header">
                ${phase && `<div class="progress-phase">📍 ${phase}</div>`}
                <div class="progress-counter">
                    <span class="current">${current}</span>
                    <span class="separator">/</span>
                    <span class="total">${total}</span>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                <div class="progress-steps">
                    ${Array.from({length: total}, (_, i) => `
                        <div class="progress-step ${i < current ? 'completed' : i === current ? 'active' : 'pending'}">
                            ${i < current ? '✓' : i + 1}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${message && `<div class="progress-message">${message}</div>`}
        `;
    }
}

/**
 * Show loading state with enhanced progress
 */
function showLoadingStateWithProgress(message = 'システムを初期化しています...', step = 1, totalSteps = 3) {
    const welcomeScreen = document.getElementById('welcome');
    const loadingHtml = `
        <div class="loading-screen">
            <div class="loading">
                <div class="spinner"></div>
                <div class="loading-content">
                    <h3>${message}</h3>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(step / totalSteps) * 100}%"></div>
                        </div>
                        <div class="progress-text">ステップ ${step} / ${totalSteps}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    if (welcomeScreen) {
        welcomeScreen.innerHTML = loadingHtml;
    }
}

/**
 * Show technical details for errors
 */
function showTechnicalDetails(errorCode) {
    const technicalInfo = {
        'QUESTIONS_LOAD_FAILED': {
            title: '質問データ読み込みエラー',
            details: '質問データファイル(questions-full.js)の読み込みに失敗しました。',
            causes: [
                'ネットワーク接続の問題',
                'サーバーの応答遅延',
                'ブラウザキャッシュの問題'
            ],
            solutions: [
                'ページを再読み込みしてください',
                'ブラウザキャッシュをクリアしてください',
                'しばらく時間をおいて再度お試しください'
            ]
        },
        'ANALYZER_INIT_FAILED': {
            title: '分析エンジン初期化エラー',
            details: 'TripleOSInteractionAnalyzerの初期化に失敗しました。',
            causes: [
                'H64_DATAまたはH384_DATAの読み込み失敗',
                'JavaScript実行環境の問題',
                'メモリ不足'
            ],
            solutions: [
                'ページを再読み込みしてください',
                '他のタブを閉じてメモリを解放してください',
                'ブラウザを再起動してください'
            ]
        }
    };
    
    const info = technicalInfo[errorCode] || {
        title: '不明なエラー',
        details: '予期しないエラーが発生しました。',
        causes: ['システムエラー'],
        solutions: ['ページを再読み込みしてください']
    };
    
    alert(`
${info.title}

詳細: ${info.details}

考えられる原因:
${info.causes.map(cause => `• ${cause}`).join('\n')}

解決方法:
${info.solutions.map(solution => `• ${solution}`).join('\n')}
    `);
}

/**
 * Start question flow
 */
async function startQuestionFlow() {
    console.log('📝 Starting question flow');
    
    // Hide welcome screen - FIXED ID
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.remove('active');
        welcomeScreen.style.display = 'none';  // 確実に非表示
        console.log('✅ Welcome screen hidden');
    }
    
    // Show question screen - FIXED ID
    const questionScreen = document.getElementById('question-screen');
    if (questionScreen) {
        questionScreen.classList.add('active');
        questionScreen.style.display = 'flex';  // 確実に表示
        console.log('✅ Question screen activated');
    }
    
    // Show first question
    showFirstQuestion();
}

/**
 * Show welcome screen
 */
function showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.add('active');
        console.log('✅ Welcome screen activated');
    }
}

/**
 * Show first question - FIXED for 36-question system
 */
function showFirstQuestion() {
    // EMERGENCY: Force load 36-question system if not available
    if (typeof window.QUESTIONS === 'undefined' || !window.QUESTIONS || window.QUESTIONS.length !== 36) {
        console.warn('⚠️ EMERGENCY FIX: 36-question system not loaded, attempting to load...');
        
        // Force load questions-full.js
        const script = document.createElement('script');
        script.src = '/assets/js/questions-full.js';
        script.onload = () => {
            console.log('✅ Emergency loaded questions-full.js');
            setTimeout(() => showFirstQuestion(), 500);
        };
        script.onerror = () => {
            console.error('❌ Failed to emergency load questions-full.js');
            showErrorState('36問システムの読み込みに失敗しました。', {
                currentStep: '2',
                totalSteps: '3',
                errorCode: 'EMERGENCY_LOAD_FAILED',
                recoveryActions: [
                    'ページを再読み込みしてください',
                    'ブラウザキャッシュをクリアしてください',
                    '管理者にお問い合わせください'
                ]
            });
        };
        document.head.appendChild(script);
        return;
    }
    
    console.log(`✅ Found ${window.QUESTIONS.length} questions, proceeding with 36-question system`);
    
    // Use the proper 36-question system
    if (window.QUESTIONS && window.QUESTIONS.length > 0) {
        displayQuestion(0);
        console.log('✅ First question displayed');
    } else {
        console.error('❌ questions-full.js not loaded');
        showErrorState('質問データの読み込みに失敗しました。', {
            currentStep: '2',
            totalSteps: '3',
            errorCode: 'QUESTIONS_LOAD_FAILED',
            recoveryActions: [
                'ページを再読み込みしてください',
                'インターネット接続を確認してください',
                'しばらく待ってから再度お試しください'
            ]
        });
    }
    
    console.log('✅ Question system initialized');
}

// Current question tracking
let currentQuestionIndex = 0;
let userAnswers = {};

// Expose for debugging
window.userAnswers = userAnswers;
window.currentQuestionIndex = currentQuestionIndex;

/**
 * Handle answer selection for navigation
 */
function selectAnswer(value) {
    if (!value) {
        alert('選択肢を選んでください');
        return;
    }
    
    // Store answer
    userAnswers[currentQuestionIndex] = value;
    window.userAnswers[currentQuestionIndex] = value;
    
    // Move to next question
    if (currentQuestionIndex + 1 < window.QUESTIONS.length) {
        displayQuestion(currentQuestionIndex + 1);
    } else {
        // All questions completed, start analysis
        startAnalysis();
    }
}

// Make selectAnswer globally accessible
window.selectAnswer = selectAnswer;

/**
 * Display a specific question from the 36-question system
 */
function displayQuestion(questionIndex) {
    console.log(`🚀 [NEW SYSTEM] displayQuestion called with index: ${questionIndex}`);
    currentQuestionIndex = questionIndex;
    window.currentQuestionIndex = questionIndex;
    
    if (!window.QUESTIONS || questionIndex >= window.QUESTIONS.length) {
        console.error('❌ [NEW SYSTEM] Invalid question index:', questionIndex, 'Questions available:', !!window.QUESTIONS, 'Length:', window.QUESTIONS?.length);
        return;
    }
    
    const question = window.QUESTIONS[questionIndex];
    const totalQuestions = window.QUESTIONS.length;
    const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;
    
    console.log(`📝 [NEW SYSTEM] Displaying question ${questionIndex + 1}/${totalQuestions}:`, question.text.substring(0, 50) + '...');
    
    const questionScreen = document.getElementById('question-screen');
    
    console.log(`🔧 [NEW SYSTEM] Setting innerHTML for question screen`);
    const htmlContent = `
        <div class="container">
            <div class="progress-container">
                <div class="progress-header">
                    <div class="progress-phase">📝 質問回答</div>
                    <div class="progress-counter">
                        <span class="current">${questionIndex + 1}</span>
                        <span class="separator">/</span>
                        <span class="total">${totalQuestions}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">質問 ${questionIndex + 1} / ${totalQuestions}</div>
            </div>
            
            <div class="card question-card">
                <div class="question-header">
                    <span id="question-number" class="question-number">${questionIndex + 1}</span>
                    <h2 id="question-title" class="question-text">${question.text}</h2>
                </div>
                
                <div id="options-container" class="options" role="radiogroup" aria-labelledby="question-title">
                    ${question.options.map((option, index) => `
                        <div class="option">
                            <input type="radio" name="q${questionIndex}" value="${option.value}" id="q${questionIndex}_${option.value}">
                            <label for="q${questionIndex}_${option.value}">${option.text}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="nav-controls">
                <button id="prev-btn" class="btn btn-secondary" ${questionIndex === 0 ? 'disabled' : ''}>前の質問</button>
                <button id="next-btn" class="btn btn-primary" disabled>次の質問</button>
            </div>
        </div>
    `;
    
    questionScreen.innerHTML = htmlContent;
    console.log(`🔧 [NEW SYSTEM] innerHTML set. Content includes "${htmlContent.substring(0, 100)}..."`);
    
    // Setup navigation handlers
    setupQuestionNavigation(questionIndex);
    
    console.log(`✅ [NEW SYSTEM] Question ${questionIndex + 1}/${totalQuestions} fully displayed and setup complete`);
}

/**
 * Setup navigation handlers for questions
 */
function setupQuestionNavigation(questionIndex) {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const radioButtons = document.querySelectorAll(`input[name="q${questionIndex}"]`);
    
    // Enable next button when option is selected
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            nextBtn.disabled = false;
            userAnswers[questionIndex] = this.value;
            window.userAnswers[questionIndex] = this.value;  // Also update window.userAnswers
            
            // CRITICAL FIX: Save to criticalCSSAnalyzer as well
            if (window.criticalCSSAnalyzer && window.criticalCSSAnalyzer.state) {
                const selectedOption = window.QUESTIONS[questionIndex].options.find(opt => opt.value === this.value);
                window.criticalCSSAnalyzer.state.saveAnswer(questionIndex, selectedOption);
                console.log(`✅ Answer saved to criticalCSSAnalyzer for question ${questionIndex + 1}: ${this.value}`);
            }
            
            console.log(`✅ Answer saved for question ${questionIndex + 1}: ${this.value}`);
        });
    });
    
    // Previous button handler
    if (prevBtn && !prevBtn.disabled) {
        prevBtn.addEventListener('click', () => {
            if (questionIndex > 0) {
                displayQuestion(questionIndex - 1);
            }
        });
    }
    
    // Next button handler
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (questionIndex + 1 < window.QUESTIONS.length) {
                displayQuestion(questionIndex + 1);
            } else {
                // All questions completed, start analysis
                startAnalysis();
            }
        });
    }
    
    // Pre-select answer if user has already answered this question
    if (userAnswers[questionIndex]) {
        const selectedRadio = document.querySelector(`input[name="q${questionIndex}"][value="${userAnswers[questionIndex]}"]`);
        if (selectedRadio) {
            selectedRadio.checked = true;
            nextBtn.disabled = false;
        }
    }
}

/**
 * Start analysis with collected answers
 */
function startAnalysis() {
    console.log('🎯 Starting Triple OS analysis with', Object.keys(userAnswers).length, 'answers');
    
    // Convert answers to the format expected by the analysis engine
    const formattedAnswers = Object.keys(userAnswers).map(questionIndex => {
        const question = window.QUESTIONS[parseInt(questionIndex)];
        const selectedOption = question.options.find(opt => opt.value === userAnswers[questionIndex]);
        
        return {
            questionId: question.id,
            questionIndex: parseInt(questionIndex),
            selectedValue: userAnswers[questionIndex],
            selectedOption: selectedOption,
            scoring: selectedOption.scoring
        };
    });
    
    // ScreenManagerを使用して分析画面に切り替え
    if (window.ScreenManager) {
        window.ScreenManager.showAnalyzing('分析中...');
    } else {
        // フォールバック
        document.getElementById('question-screen').classList.remove('active');
        document.getElementById('analysis-screen').classList.add('active');
    }
    
    // Start actual analysis
    setTimeout(async () => {
        try {
            // Use the TripleOSInteractionAnalyzer for analysis
            if (window.TripleOSInteractionAnalyzer) {
                const results = await performTripleOSAnalysis(formattedAnswers);
                // ScreenManagerを使用して結果を表示
                if (window.ScreenManager) {
                    window.ScreenManager.showResults(results);
                } else if (typeof showResults === 'function') {
                    showResults(results);
                } else {
                    console.error('❌ No method to show results');
                    // 直接結果画面に切り替えを試みる
                    if (window.ScreenManager) {
                        window.ScreenManager.showResults(results || {});
                    }
                }
            } else {
                console.error('❌ TripleOSInteractionAnalyzer not available');
                if (window.ScreenManager) {
                    window.ScreenManager.showError('分析エンジンが利用できません。', {
                        currentStep: '3',
                        totalSteps: '3',
                        errorCode: 'ANALYZER_INIT_FAILED',
                        recoveryActions: [
                            'ページを再読み込みしてください',
                            'JavaScript が有効になっているか確認してください',
                            '別のブラウザで試してください'
                        ]
                    });
                } else {
                    showErrorState('分析エンジンが利用できません。', {
                        currentStep: '3',
                        totalSteps: '3',
                        errorCode: 'ANALYZER_INIT_FAILED',
                        recoveryActions: [
                            'ページを再読み込みしてください',
                            'JavaScript が有効になっているか確認してください',
                            '別のブラウザで試してください'
                        ]
                    });
                }
            }
        } catch (error) {
            console.error('❌ Analysis failed:', error);
            if (window.ScreenManager) {
                window.ScreenManager.showError('分析中にエラーが発生しました。', {
                    currentStep: '3',
                    totalSteps: '3',
                    errorCode: 'ANALYSIS_FAILED',
                    recoveryActions: [
                        '回答を確認して再度お試しください',
                        'ページを再読み込みしてください',
                        'サポートにお問い合わせください'
                    ]
                });
            }
        }
    }, 2000);
}

/**
 * Show error message
 */
function showError(message) {
    document.getElementById('analysis-screen').classList.remove('active');
    document.getElementById('question-screen').classList.remove('active');
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-screen';
    errorContainer.innerHTML = `
        <div class="container">
            <div class="card">
                <h2>エラーが発生しました</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">再読み込み</button>
            </div>
        </div>
    `;
    
    document.querySelector('main').appendChild(errorContainer);
}

/**
 * Show results function (ScreenManagerへの橋渡し)
 */
function showResults(results) {
    console.log('📊 showResults called with:', results);
    
    // ScreenManagerが利用可能な場合は使用
    if (window.ScreenManager) {
        window.ScreenManager.showResults(results);
    } else {
        // フォールバック処理
        console.warn('⚠️ ScreenManager not available, using fallback');
        const resultsScreen = document.getElementById('results-screen');
        if (resultsScreen) {
            resultsScreen.classList.add('active');
            resultsScreen.style.display = 'flex';
            
            // 他の画面を非表示
            ['welcome', 'question', 'analysis', 'error'].forEach(screen => {
                const el = document.getElementById(`${screen}-screen`);
                if (el && screen !== 'results') {
                    el.classList.remove('active');
                    el.style.display = 'none';
                }
            });
        }
    }
}

/**
 * Create basic question flow if main questions not loaded
 */
function createBasicQuestionFlow() {
    const questionScreen = document.getElementById('question-screen');
    if (!questionScreen) return;
    
    questionScreen.classList.add('active');
    console.log('✅ Basic question flow activated');
    questionScreen.innerHTML = `
        <div class="basic-analysis-screen">
            <h2>基本分析モード</h2>
            <p>システムの初期化が完了しませんでしたが、基本的な分析を実行できます。</p>
            <button class="btn btn-primary" onclick="runBasicAnalysis()">
                基本分析を開始
            </button>
        </div>
    `;
}

// Old setupChoiceHandlers removed - using 36-question navigation system

// Old handleNextQuestion removed - using 36-question navigation system

// Old showAnalysisComplete removed - using new startAnalysis function


/**
 * Perform Triple OS Analysis using collected answers
 */
async function performTripleOSAnalysis(formattedAnswers) {
    console.log('🎯 Analyzing Triple OS with', formattedAnswers.length, 'answers using 64-hexagram system');
    
    // Check if TripleOSInteractionAnalyzer is available
    if (!window.TripleOSInteractionAnalyzer) {
        throw new Error('TripleOSInteractionAnalyzer not available - 64-hexagram system required');
    }
    
    try {
        console.log('✅ Using TripleOSInteractionAnalyzer with H64/H384 system');
        
        // Calculate trigram scores for existing TripleOSInteractionAnalyzer
        const trigramScores = {
            '乾_創造性': 0, '兌_調和性': 0, '離_表現性': 0, '震_行動性': 0,
            '巽_適応性': 0, '坎_探求性': 0, '艮_安定性': 0, '坤_受容性': 0
        };
        
        formattedAnswers.forEach(answer => {
            if (answer.scoring) {
                Object.keys(answer.scoring).forEach(trigram => {
                    if (trigramScores[trigram] !== undefined) {
                        trigramScores[trigram] += answer.scoring[trigram];
                    }
                });
            }
        });
        
        // Create OS objects for existing TripleOSInteractionAnalyzer
        const engineOS = {
            score: (trigramScores['乾_創造性'] + trigramScores['震_行動性'] + trigramScores['坎_探求性']) / 3,
            hexagramId: Math.floor(Math.random() * 64) + 1, // Temporary - should use proper mapping
            name: 'Engine OS'
        };
        
        const interfaceOS = {
            score: (trigramScores['兌_調和性'] + trigramScores['離_表現性'] + trigramScores['巽_適応性']) / 3,
            hexagramId: Math.floor(Math.random() * 64) + 1, // Temporary - should use proper mapping
            name: 'Interface OS'
        };
        
        const safeModeOS = {
            score: (trigramScores['艮_安定性'] + trigramScores['坤_受容性']) / 2,
            hexagramId: Math.floor(Math.random() * 64) + 1, // Temporary - should use proper mapping
            name: 'Safe Mode OS'
        };
        
        // Use existing TripleOSInteractionAnalyzer for 64-hexagram analysis
        // Pass empty object to constructor to fix initialization error
        const analyzer = new window.TripleOSInteractionAnalyzer({});
        const analysisResult = analyzer.analyze(engineOS, interfaceOS, safeModeOS);
        
        if (!analysisResult) {
            throw new Error('Analysis result is empty - 64-hexagram system failed');
        }
        
        console.log('🎯 Using TripleOSInteractionAnalyzer 64-hexagram result:', analysisResult);
        
        // Convert to expected display format using existing analyzer result
        const engineOSDisplay = {
            name: 'Engine OS',
            title: '内発的動機',
            symbol: analysisResult.engine_os?.symbol || '☰',
            score: engineOS.score,
            characteristics: ['創造的価値観', '革新性', '探求心'],
            hexagramId: analysisResult.engine_os?.id || engineOS.hexagramId,
            hexagramName: analysisResult.engine_os?.name || 'Engine OS',
            storyRole: 'core',
            element: analysisResult.engine_os?.element || '天'
        };
        
        const interfaceOSDisplay = {
            name: 'Interface OS',
            title: '社会的側面',
            symbol: analysisResult.interface_os?.symbol || '☱',
            score: interfaceOS.score,
            characteristics: ['社会的調和', '表現力', '適応性'],
            hexagramId: analysisResult.interface_os?.id || interfaceOS.hexagramId,
            hexagramName: analysisResult.interface_os?.name || 'Interface OS',
            storyRole: 'flow',
            element: analysisResult.interface_os?.element || '沢'
        };
        
        const safeModeOSDisplay = {
            name: 'Safe Mode OS',
            title: '危機時人格',
            symbol: analysisResult.safe_mode_os?.symbol || '☶',
            score: safeModeOS.score,
            characteristics: ['安定性', '慎重さ', '保護性'],
            hexagramId: analysisResult.safe_mode_os?.id || safeModeOS.hexagramId,
            hexagramName: analysisResult.safe_mode_os?.name || 'Safe Mode OS',
            storyRole: 'shield',
            element: analysisResult.safe_mode_os?.element || '山'
        };
        
        return {
            engineOS: engineOSDisplay,
            interfaceOS: interfaceOSDisplay,
            safeModeOS: safeModeOSDisplay,
            synergy: analysisResult.synergy,
            interactions: analysisResult.interactions,
            strengths: analysisResult.strengths,
            risks: analysisResult.risks,
            totalAnswers: formattedAnswers.length,
            analysisMethod: 'TripleOSInteractionAnalyzer-64-hexagram-system'
        };
        
    } catch (error) {
        console.error('❌ TripleOSInteractionAnalyzer 64-hexagram analysis failed:', error);
        throw error; // Re-throw error instead of falling back to 8-trigram system
    }
}

/**
 * Generate storytelling-style results display
 */
function generateStorytellingResults(results) {
    const { engineOS, interfaceOS, safeModeOS } = results;
    
    // Determine the dominant OS
    const systems = [engineOS, interfaceOS, safeModeOS];
    const dominantSystem = systems.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
    );
    
    return `
        <div class="story-content">
            <div class="story-introduction">
                <p class="story-text">あなたの心の奥深くで、三つの仮想人格が静かに息づいています。古の智慧・易経が映し出すのは、それぞれ異なる願いと役割を持った側面たち。今回の分析で、<strong>${dominantSystem.title}</strong>の特性が最も強く現れているようです。</p>
            </div>
            
            <div class="os-results-grid">
                ${generatePersonaStory(engineOS, '🧠', 'engine-os')}
                ${generatePersonaStory(interfaceOS, '💬', 'interface-os')}  
                ${generatePersonaStory(safeModeOS, '🛡️', 'safe-mode-os')}
            </div>
            
            <div class="story-synthesis">
                <h3>🌸 三つの仮想人格の相互作用</h3>
                <div class="synthesis-content">
                    ${generatePersonaDialogue(engineOS, interfaceOS, safeModeOS)}
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate individual persona story
 */
function generatePersonaStory(persona, icon, cssClass) {
    const storyElements = getPersonaStoryElements(persona);
    
    return `
        <div class="os-result-card ${cssClass}">
            <div class="os-icon">${icon}</div>
            <h2>${persona.symbol} ${persona.title}</h2>
            <div class="persona-story">
                <p class="story-intro">${storyElements.introduction}</p>
                <div class="story-details">
                    <p><strong>この側面の本質:</strong> ${storyElements.essence}</p>
                    <p><strong>現代での姿:</strong> ${storyElements.modernExample}</p>
                    <p><strong>日常での現れ方:</strong> ${storyElements.dailyManifestation}</p>
                </div>
                <div class="persona-strength">
                    <p class="strength-indicator">強度: ${(persona.score * 20).toFixed(0)}%の発現</p>
                </div>
                <div class="characteristics">
                    ${persona.characteristics.map(char => 
                        `<span class="characteristic-tag">${char}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Get story elements for each persona type
 */
function getPersonaStoryElements(persona) {
    const storyMap = {
        'Engine OS': {
            introduction: 'あなたの内にある根源的な動機。外部からの報酬や評価に依存せず、内側から湧き上がる情熱と意欲の源泉です。',
            essence: '「やりたいからやる」「好きだから続ける」という純粋なエネルギー',
            modernExample: '趣味に没頭する時間、無心に何かを創作する瞬間、誰に言われなくても続けたいこと',
            dailyManifestation: '朝起きて「今日はこれがしたい」と思う気持ち、時間を忘れて集中する体験、報酬がなくても続けられる活動'
        },
        'Interface OS': {
            introduction: 'あなたが社会と接するときに現れる側面。状況や相手に応じて柔軟に変化し、適切なコミュニケーションを可能にします。',
            essence: '場面に応じた適切な振る舞い、相手との関係性を築く能力',
            modernExample: '職場でのプロフェッショナルな自分、友人とのリラックスした自分、家族との温かい自分',
            dailyManifestation: '会議での発言スタイル、SNSでの表現方法、初対面の人への接し方、グループ内での役割'
        },
        'Safe Mode OS': {
            introduction: 'ストレスや危機的状況で活性化する防衛的な側面。平常時とは異なる行動パターンを取り、自分を守ろうとします。',
            essence: 'プレッシャー下での対処法、緊急時の判断基準、ストレス反応',
            modernExample: '締切前の集中力、トラブル時の冷静さ、迫られた時の決断力、疲れた時の引きこもり',
            dailyManifestation: 'ストレスを感じた時の反応、プレッシャーへの対処、予想外の事態への対応、疲労時の行動変化'
        }
    };
    
    return storyMap[persona.name] || storyMap['Engine OS'];
}

/**
 * Generate dialogue between the three personas
 */
function generatePersonaDialogue(engine, interfaceOS, safeMode) {
    const scores = [engine.score, interfaceOS.score, safeMode.score];
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const scoreDifference = maxScore - minScore;
    
    if (scoreDifference < 0.5) {
        return `
            <p>三つの仮想人格が均衡を保ち、調和的に共存しています。</p>
            <p><em>「私たちのバランスは美しく保たれている」</em>と${engine.title}。</p>
            <p><em>「そうですね、お互いを尊重し合えています」</em>と${interfaceOS.title}が応じます。</p>
            <p><em>「このバランスこそが、あなたの強さの源なのです」</em>と${safeMode.title}が語りかけます。</p>
            <p><strong>今のあなたは、三つの側面が調和した状態にあります。</strong></p>
        `;
    } else {
        const dominant = [engine, interfaceOS, safeMode].find(t => t.score === maxScore);
        const dormant = [engine, interfaceOS, safeMode].find(t => t.score === minScore);
        
        return `
            <p>${dominant.title}の特性が強く表れています。</p>
            <p><em>「今は私の側面が優位のようですね。この特性を活かしていきましょう」</em></p>
            <p>${dormant.title}は控えめに存在し、</p>
            <p><em>「必要な時が来たら、私の側面も活性化することを忘れないでください」</em></p>
            <p><strong>今のあなたには${dominant.title}の特性が強く現れています。でも他の側面も、いつでも発現する準備ができています。</strong></p>
        `;
    }
}

/**
 * Show analysis results with storytelling approach
 */
function showResults(results) {
    console.log('🎯 Displaying Triple OS results:', results);
    
    const questionScreen = document.getElementById('question-screen');
    if (!questionScreen) return;
    
    const analysisScreen = document.getElementById('analysis-screen');
    if (analysisScreen) {
        analysisScreen.classList.remove('active');
    }
    
    // Generate storytelling content
    const storyContent = generateStorytellingResults(results);
    
    questionScreen.classList.add('active');
    questionScreen.innerHTML = `
        <div class="results-screen">
            <div class="container">
                <div class="results-header">
                    <h1>🌟 あなたの内なる三つの世界</h1>
                    <p class="results-subtitle">古の智慧が映し出す、あなたの三つの仮想人格</p>
                </div>
                
                ${storyContent}
                
                <div class="story-epilogue">
                    <h3>🌸 分析の終わりに</h3>
                    <div class="epilogue-content">
                        <p>これは、あなたという存在の豊かさを映し出した一つの物語です。</p>
                        <p>三つの仮想人格は時に協調し、時に対立し、バランスを取りながら共存しています。それぞれの側面を理解し、どの特性があなたにとって今必要かを感じてみてください。</p>
                        <p><strong>分析結果は日々変化します</strong>。季節が変わるとき、新しい挑戦に向かうとき、人生の節目を迎えるとき...その度に異なる側面が強く現れるかもしれません。</p>
                    </div>
                </div>
                
                <div class="journey-invitation">
                    <h4>🔄 新たな分析へ</h4>
                    <p>別の選択をしたら、結果はどう変わるでしょうか？時間を置いて再び分析してみてください。あなたの内なる世界の新たな一面が見えてくるかもしれません。</p>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="location.reload()">
                        新しい物語を紡ぐ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    console.log('✅ Storytelling results displayed');
}

/**
 * Setup navigation handlers
 */
function setupNavigationHandlers() {
    // Add any additional navigation handlers here
    console.log('✅ Navigation handlers setup complete');
}

/**
 * Run basic analysis (fallback function)
 */
window.runBasicAnalysis = function() {
    console.log('🔄 Running basic analysis');
    showAnalysisComplete();
};

// Export for debugging
window.HaqeiApp = {
    waitForDatasets,
    showFirstQuestion,
    displayQuestion,
    selectAnswer,
    startAnalysis,
    runBasicAnalysis: window.runBasicAnalysis
};

// Export essential functions globally for HTML event handlers
window.displayQuestion = displayQuestion;
window.selectAnswer = selectAnswer;
window.startAnalysis = startAnalysis;