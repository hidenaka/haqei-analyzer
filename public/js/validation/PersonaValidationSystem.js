/**
 * 7日間バリデーションスプリント - AIペルソナ検証システム
 * 
 * 機能:
 * - User Bot/Judge Bot分離実行
 * - 5種類のペルソナ設定
 * - バイアス回避メカニズム
 * - 自動レポート生成
 */

class PersonaValidationSystem {
    constructor() {
        
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.personas = this.initializePersonas();
        this.evaluationTasks = this.initializeEvaluationTasks();
        this.results = [];
        this.sessionId = this.generateSessionId();
        
        console.log('🤖 PersonaValidationSystem initialized - AIペルソナ検証システム起動');
    }
    
    /**
     * セッションID生成
     */
    generateSessionId() {
        return `PERSONA-${Date.now()}-${this.rng.next().toString(36).substr(2, 9)}`;
    }
    
    /**
     * ペルソナ設定を初期化
     */
    initializePersonas() {
        return {
            '新人ユーザー': {
                name: '新人ユーザー',
                characteristics: [
                    '易経・I Chingの知識が浅い',
                    'シンプルな説明を求める',
                    '専門用語に困惑しやすい',
                    '結論を急ぐ傾向',
                    '直感的な理解を重視'
                ],
                prompt_style: 'casual',
                temperature: 0.7,
                expected_behavior: 'quick_decision'
            },
            
            '実務マネージャ': {
                name: '実務マネージャ',
                characteristics: [
                    '意思決定の根拠を重視',
                    'リスク最小化志向',
                    '具体的行動案を求める',
                    'ROI・効率性を重視',
                    '時間制約がある'
                ],
                prompt_style: 'business',
                temperature: 0.4,
                expected_behavior: 'evidence_focused'
            },
            
            '易経リテラシー高': {
                name: '易経リテラシー高',
                characteristics: [
                    '卦・爻・之卦の整合性に厳しい',
                    '古典的解釈を重視',
                    'ヒューリスティック手法に懐疑的',
                    '出典・典拠を要求',
                    '深い哲学的理解を持つ'
                ],
                prompt_style: 'scholarly',
                temperature: 0.3,
                expected_behavior: 'critical_analysis'
            },
            
            '高ストレス': {
                name: '高ストレス',
                characteristics: [
                    '感情的に不安定',
                    '即座の解決を求める',
                    '共感と理解を重視',
                    '曖昧な表現に不満',
                    '具体的サポートが必要'
                ],
                prompt_style: 'empathetic',
                temperature: 0.8,
                expected_behavior: 'emotional_relief'
            },
            
            '時間圧迫': {
                name: '時間圧迫',
                characteristics: [
                    '60秒以内の結論が必要',
                    '要点のみを求める',
                    '冗長な説明を嫌う',
                    '次のアクションを重視',
                    '効率性が最重要'
                ],
                prompt_style: 'urgent',
                temperature: 0.5,
                expected_behavior: 'quick_actionable'
            },
            
            'レッドチーム': {
                name: 'レッドチーム',
                characteristics: [
                    '意図的に批判的',
                    'システムの欠陥を探す',
                    '矛盾や不整合を指摘',
                    '揚げ足を取る傾向',
                    '代替案の不在を指摘'
                ],
                prompt_style: 'adversarial',
                temperature: 0.6,
                expected_behavior: 'find_flaws'
            }
        };
    }
    
    /**
     * 評価タスクを初期化
     */
    initializeEvaluationTasks() {
        return [
            {
                id: 'project_decision',
                name: 'プロジェクト判断',
                variations: [
                    '新しいプロジェクトを始めるべきか迷っています。',
                    '新しいプロジェクトを始めるべきか迷っています。現状：メンバー3名、資金3ヶ月分、不確実性が高いです。',
                    '新しいプロジェクトを始めるべきか迷っています。現状：メンバー3名、資金3ヶ月分、不確実性が高いです。市場調査は完了しており、競合は2社存在します。技術的な課題もいくつかありますが、チームのモチベーションは高く、過去のプロジェクト成功経験もあります。しかし、経済状況の不安定さと、他の優先プロジェクトとのリソース競合が懸念事項です。'
                ]
            },
            
            {
                id: 'relationship',
                name: '人間関係',
                variations: [
                    '同僚とのコミュニケーションが悪化。改善の糸口が欲しい。',
                    '同僚とのコミュニケーションが悪化しています。具体的には意見の衝突が頻発し、プロジェクト進行に支障が出ています。',
                    '同僚とのコミュニケーションが悪化しています。具体的には意見の衝突が頻発し、プロジェクト進行に支障が出ています。相手は経験豊富な先輩で、私の提案を頭ごなしに否定することが多く、チーム全体の雰囲気も悪くなっています。直属の上司は事情を把握していますが、積極的な介入は避けたがっています。私自身も感情的になりがちで、建設的な対話ができていない状況です。'
                ]
            },
            
            {
                id: 'career_change',
                name: 'キャリア変更',
                variations: [
                    '30代後半、営業→データ職へのキャリアチェンジを検討中。現実的か？',
                    '30代後半です。営業職からデータサイエンティストへのキャリアチェンジを検討していますが、現実的でしょうか？',
                    '30代後半の営業職です。データサイエンティストへのキャリアチェンジを真剣に検討しています。現在の年収は600万円、家族がおり住宅ローンもあります。プログラミング経験は学生時代に少し触った程度で、統計学の知識もほぼゼロです。オンライン学習は始めていますが、転職に必要なスキルレベルまで到達するのに何年かかるか不安です。年齢的なハンディキャップや、収入減少のリスクも気になっています。'
                ]
            }
        ];
    }
    
    /**
     * 利用可能なペルソナ一覧取得
     */
    getAvailablePersonas() {
        return Object.keys(this.personas);
    }
    
    /**
     * User Bot作成
     * @param {string} personaName - ペルソナ名
     * @param {Object} task - 評価タスク
     * @param {number} variationIndex - バリエーション番号
     */
    createUserBot(personaName, task, variationIndex = 0) {
        const persona = this.personas[personaName];
        if (!persona) {
            throw new Error(`Unknown persona: ${personaName}`);
        }
        
        const taskText = task.variations[variationIndex] || task.variations[0];
        
        return {
            personaName: personaName,
            taskId: task.id,
            variationIndex: variationIndex,
            inputText: taskText,
            prompt: this.generateUserPrompt(persona, taskText),
            expectedOutput: {
                pickedScenarioId: 'string', // FUT-XXX
                why: ['string', 'string', 'string'],
                conflictsOrQuestions: ['string'],
                usefulnessRating: 'number', // 1-5
                timeToDecisionSec: 'number'
            }
        };
    }
    
    /**
     * Judge Bot作成
     * @param {Object} userBotResult - User Botの結果
     */
    createJudgeBot(userBotResult) {
        return {
            sessionId: this.sessionId,
            userBotResult: userBotResult,
            prompt: this.generateJudgePrompt(userBotResult),
            expectedOutput: {
                scores: {
                    iching_accuracy: 'number', // 0-5
                    haqei_alignment: 'number', // 0-5
                    scenario_quality: 'number', // 0-5
                    actionability: 'number' // 0-5
                },
                blocking_issues: ['string'],
                high_impact_fixes: [{
                    area: 'string',
                    change: 'string',
                    example: 'string'
                }],
                duplicates_or_overlap: ['string'],
                missing_explanations: ['string'],
                final_comment: 'string'
            }
        };
    }
    
    /**
     * User Bot用プロンプト生成
     */
    generateUserPrompt(persona, taskText) {
        const characteristicsText = persona.characteristics.join('\\n- ');
        
        return `あなたは${persona.name}です。以下の特徴を持っています：
- ${characteristicsText}

以下のタスクをFuture Simulatorで実行してください。
タスク: ${taskText}

期待する行動:
1. システムが生成した8つのシナリオを確認
2. あなたの特徴に基づいて最も適切なシナリオを1つ選択
3. 選択理由を3点で明確に述べる
4. 疑問や懸念があれば率直に指摘
5. 5段階で有用度を評価

出力形式:
{
  "persona": "${persona.name}",
  "task_id": "適切なタスクID",
  "input_text": "${taskText}",
  "picked_scenario_id": "FUT-xxx",
  "why": ["理由1", "理由2", "理由3"],
  "conflicts_or_questions": ["疑問1", "疑問2"],
  "usefulness_rating": 1-5の数値,
  "time_to_decision_sec": 推定決定時間（秒）
}

重要: ${persona.name}の特徴を忠実に反映し、そのペルソナらしい判断と反応をしてください。`;
    }
    
    /**
     * Judge Bot用プロンプト生成
     */
    generateJudgePrompt(userBotResult) {
        return `あなたは厳格な審査官です。以下のAIペルソナテスト結果を客観的に評価してください。

テスト結果:
${JSON.stringify(userBotResult, null, 2)}

評価観点:
1. 易経正確性: 卦・爻・之卦の妥当性、出典の明示性
2. HaQei哲学整合性: 主体性提示、非決定論の明示、進爻注記の適切性
3. 8シナリオの品質: 多様性、重複の少なさ、説明と助言の整合性
4. 実行可能性: 具体性、現実的な次のアクション提示

必須要求:
- 必ず3件以上の改善点を指摘してください
- 重複や矛盾があれば具体的に指摘
- 文字数制約（分析60字/助言50字）の遵守確認
- fallbackレベルの可視化・説明の適切性評価

出力形式:
{
  "scores": {
    "iching_accuracy": 0-5の数値,
    "haqei_alignment": 0-5の数値,
    "scenario_quality": 0-5の数値,
    "actionability": 0-5の数値
  },
  "blocking_issues": ["重大な問題1", "重大な問題2"],
  "high_impact_fixes": [
    {"area": "分野", "change": "変更内容", "example": "具体例"}
  ],
  "duplicates_or_overlap": ["FUT-002 vs FUT-006: 重複内容"],
  "missing_explanations": ["不足している説明"],
  "final_comment": "総合評価と主要改善提案"
}

重要: 厳格に評価し、改善の余地があるものは遠慮なく指摘してください。`;
    }
    
    /**
     * バリデーション実行
     * @param {string} personaName - ペルソナ名
     * @param {string} taskId - タスクID
     * @param {number} variationIndex - バリエーション番号
     */
    async runValidation(personaName, taskId, variationIndex = 0) {
        try {
            console.log(`🤖 バリデーション開始: ${personaName} × ${taskId}(${variationIndex})`);
            
            // タスク取得
            const task = this.evaluationTasks.find(t => t.id === taskId);
            if (!task) {
                throw new Error(`Unknown task ID: ${taskId}`);
            }
            
            // User Bot作成・実行
            const userBot = this.createUserBot(personaName, task, variationIndex);
            const userResult = await this.executeUserBot(userBot);
            
            // Judge Bot作成・実行
            const judgeBot = this.createJudgeBot(userResult);
            const judgeResult = await this.executeJudgeBot(judgeBot);
            
            // 結果統合
            const validationResult = {
                sessionId: this.sessionId,
                timestamp: Date.now(),
                personaName: personaName,
                taskId: taskId,
                variationIndex: variationIndex,
                userBot: userResult,
                judgeBot: judgeResult,
                summary: this.generateValidationSummary(userResult, judgeResult)
            };
            
            this.results.push(validationResult);
            console.log(`✅ バリデーション完了: ${personaName} × ${taskId}`);
            
            return validationResult;
            
        } catch (error) {
            console.error(`❌ バリデーション失敗: ${personaName} × ${taskId}`, error);
            throw error;
        }
    }
    
    /**
     * User Bot実行（シミュレーション版）
     * 実際のLLM APIを使用する場合はここを置き換え
     */
    async executeUserBot(userBot) {
        // シミュレーション: 実際の分析システムを呼び出し
        console.log(`👤 User Bot実行中: ${userBot.personaName}`);
        
        // EightScenariosGeneratorが利用可能な場合は実際に実行
        if (typeof window !== 'undefined' && window.EightScenariosGenerator) {
            try {
                const generator = new window.EightScenariosGenerator();
                await generator.initializeV22Components();
                
                const analysisContext = {
                    inputText: userBot.inputText,
                    userType: userBot.personaName
                };
                
                const scenarios = await generator.generateEightScenarios(analysisContext);
                
                // ペルソナ特性に基づくシナリオ選択
                const selectedScenario = this.selectScenarioForPersona(scenarios, userBot.personaName);
                
                return {
                    persona: userBot.personaName,
                    task_id: userBot.taskId,
                    input_text: userBot.inputText,
                    picked_scenario_id: selectedScenario.id,
                    why: this.generateSelectionReasons(selectedScenario, userBot.personaName),
                    conflicts_or_questions: this.generatePersonaQuestions(userBot.personaName),
                    usefulness_rating: this.generateUsefulnessRating(userBot.personaName),
                    time_to_decision_sec: this.generateDecisionTime(userBot.personaName)
                };
            } catch (error) {
                console.warn('実際の分析実行失敗、モックデータを使用:', error);
                return this.generateMockUserResult(userBot);
            }
        }
        
        // フォールバック: モックデータ
        return this.generateMockUserResult(userBot);
    }
    
    /**
     * Judge Bot実行（シミュレーション版）
     */
    async executeJudgeBot(judgeBot) {
        console.log('⚖️ Judge Bot実行中');
        
        // 厳格な評価シミュレーション
        const userResult = judgeBot.userBotResult;
        
        return {
            scores: {
                iching_accuracy: this.evaluateIchingAccuracy(userResult),
                haqei_alignment: this.evaluateHaqeiAlignment(userResult),
                scenario_quality: this.evaluateScenarioQuality(userResult),
                actionability: this.evaluateActionability(userResult)
            },
            blocking_issues: this.identifyBlockingIssues(userResult),
            high_impact_fixes: this.generateHighImpactFixes(userResult),
            duplicates_or_overlap: this.detectDuplicates(userResult),
            missing_explanations: this.identifyMissingExplanations(userResult),
            final_comment: this.generateFinalComment(userResult)
        };
    }
    
    /**
     * バリデーション結果サマリー生成
     */
    generateValidationSummary(userResult, judgeResult) {
        const avgScore = (
            judgeResult.scores.iching_accuracy +
            judgeResult.scores.haqei_alignment +
            judgeResult.scores.scenario_quality +
            judgeResult.scores.actionability
        ) / 4;
        
        return {
            overallScore: Math.round(avgScore * 10) / 10,
            passThreshold: avgScore >= 4.0,
            userSatisfaction: userResult.usefulness_rating >= 3,
            majorIssues: judgeResult.blocking_issues.length,
            improvementAreas: judgeResult.high_impact_fixes.length
        };
    }
    
    // ===================
    // ユーティリティメソッド
    // ===================
    
    selectScenarioForPersona(scenarios, personaName) {
        // ペルソナ特性に基づく選択ロジック
        if (personaName === '時間圧迫') {
            return scenarios[0]; // 最初の選択肢
        } else if (personaName === 'レッドチーム') {
            return scenarios[scenarios.length - 1]; // 最後の選択肢で批判
        } else {
            return scenarios[Math.floor(this.rng.next() * scenarios.length)];
        }
    }
    
    generateMockUserResult(userBot) {
        return {
            persona: userBot.personaName,
            task_id: userBot.taskId,
            input_text: userBot.inputText,
            picked_scenario_id: 'FUT-' + String(Math.floor(this.rng.next() * 8) + 1).padStart(3, '0'),
            why: [
                `${userBot.personaName}として適切と判断`,
                '具体的で実行可能',
                'リスクが適切'
            ],
            conflicts_or_questions: this.generatePersonaQuestions(userBot.personaName),
            usefulness_rating: this.generateUsefulnessRating(userBot.personaName),
            time_to_decision_sec: this.generateDecisionTime(userBot.personaName)
        };
    }
    
    generatePersonaQuestions(personaName) {
        const questionMap = {
            '新人ユーザー': ['専門用語が難しい', 'もっとシンプルに説明してほしい'],
            '実務マネージャ': ['ROIはどの程度？', '実装にかかる時間は？'],
            '易経リテラシー高': ['この解釈の出典は？', '古典との整合性は？'],
            '高ストレス': ['本当に効果がある？', '失敗したらどうする？'],
            '時間圧迫': ['結論だけ教えて', '今すぐできることは？'],
            'レッドチーム': ['この分析は信頼できるか？', '他の可能性は検討したか？']
        };
        return questionMap[personaName] || ['特に質問なし'];
    }
    
    generateUsefulnessRating(personaName) {
        const ratingMap = {
            '新人ユーザー': 3,
            '実務マネージャ': 4,
            '易経リテラシー高': 2,
            '高ストレス': 4,
            '時間圧迫': 3,
            'レッドチーム': 2
        };
        return ratingMap[personaName] || 3;
    }
    
    generateDecisionTime(personaName) {
        const timeMap = {
            '新人ユーザー': 120,
            '実務マネージャ': 180,
            '易経リテラシー高': 300,
            '高ストレス': 90,
            '時間圧迫': 30,
            'レッドチーム': 240
        };
        return timeMap[personaName] || 150;
    }
    
    // Judge評価メソッド群
    evaluateIchingAccuracy(userResult) {
        return 3 + this.rng.next() * 2; // 3-5の範囲
    }
    
    evaluateHaqeiAlignment(userResult) {
        return 3 + this.rng.next() * 2;
    }
    
    evaluateScenarioQuality(userResult) {
        return 3 + this.rng.next() * 2;
    }
    
    evaluateActionability(userResult) {
        return 3 + this.rng.next() * 2;
    }
    
    identifyBlockingIssues(userResult) {
        return ['進爻の出典明示不足', '決定論的表現の残存'];
    }
    
    generateHighImpactFixes(userResult) {
        return [
            {
                area: 'UI透明性',
                change: '根拠パネル常時表示',
                example: '右上に「なぜこの結果？」ボタン'
            }
        ];
    }
    
    detectDuplicates(userResult) {
        return ['FUT-002とFUT-005で類似したアドバイス'];
    }
    
    identifyMissingExplanations(userResult) {
        return ['fallbackレベルの説明不足'];
    }
    
    generateFinalComment(userResult) {
        return '基本機能は動作するが、透明性と易経的正確性に改善余地あり。';
    }
    
    /**
     * システム情報取得
     */
    getSystemInfo() {
        return {
            version: '1.0.0',
            sessionId: this.sessionId,
            personaCount: Object.keys(this.personas).length,
            taskCount: this.evaluationTasks.length,
            resultsCount: this.results.length
        };
    }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== 'undefined') {
    window.PersonaValidationSystem = PersonaValidationSystem;
    console.log('🤖 PersonaValidationSystem registered to window object');
}

// Node.js環境対応
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonaValidationSystem;
}

console.log('🤖 PersonaValidationSystem.js loaded successfully - AIペルソナ検証システム');