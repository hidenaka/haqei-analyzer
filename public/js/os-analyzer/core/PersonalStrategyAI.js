// PersonalStrategyAI.js - パーソナル戦略生成AI
// HaQei Analyzer - Personal Strategy AI Generation System

class PersonalStrategyAI {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.promptTemplates = this._initializePromptTemplates();
        this.qualityConstraints = this._initializeQualityConstraints();
        
        console.log("🤖 [PersonalStrategyAI] AI戦略生成システム初期化完了");
    }

    // プロンプトテンプレートの初期化
    _initializePromptTemplates() {
        return {
            ROOT_STRENGTH: `以下の人格分析データを基に、この人の根源的な強みを一人称で説明してください。

### 分析データ:
- エンジンOS: {engineOS.osName}
- 核心的動機: {hexagramDetails.engine.core_drive}
- 潜在的強み: {hexagramDetails.engine.potential_strengths}
- 8次元特性: {vector8D}

### 出力形式:
私の根源的な強みは[具体的な強み]です。これは[理由・背景]から来ており、特に[具体的な状況・場面]で力を発揮します。この強みを活かすことで、[実現可能な成果・影響]を生み出すことができます。

### 制約:
- 一人称（私は...）で記述
- 具体的で実感できる表現
- 200-300文字
- 励ましと理解を込めたトーン`,

            OPTIMAL_ROLE: `以下の人格分析データを基に、この人が最も輝ける役回り・役割を一人称で提案してください。

### 分析データ:
- インターフェースOS: {interfaceOS.osName}
- 外見的特徴: {hexagramDetails.interface.how_it_appears}
- 行動パターン: {hexagramDetails.interface.behavioral_patterns}
- 他者への印象: {hexagramDetails.interface.impression_on_others}

### 出力形式:
私が最も輝ける役回りは[具体的な役割・立場]です。なぜなら私は[その役割に適した特性]を持っており、[具体的な場面・状況]で自然にその力を発揮できるからです。逆に[苦手な環境・役割]は避け、[推奨される環境・条件]を選ぶことで、本来の力を存分に発揮できます。

### 制約:
- 具体的な職種・役割名を含む
- 適している理由を明確に説明
- 避けるべき環境も言及
- 実行可能なアドバイス
- 200-300文字`,

            DEFENSIVE_PATTERN: `以下の人格分析データを基に、この人がなぜ時々「らしくない」振る舞いをしてしまうのかを一人称で優しく解説してください。

### 分析データ:
- セーフモードOS: {safeModeOS.osName}
- 発動トリガー: {hexagramDetails.safe_mode.trigger_situations}
- 防御行動: {hexagramDetails.safe_mode.defensive_patterns}
- 内面状態: {hexagramDetails.safe_mode.internal_state}

### 出力形式:
私が時々らしくない振る舞いをしてしまうのは、[発動条件]が起きた時に[セーフモード名]が自動的に作動するからです。この時の私は[内面的な状態]になり、無意識に[具体的な行動パターン]を取ってしまいます。これは[その行動の目的・意図]であり、決して悪いことではありません。ただし、[望ましくない結果]を招くこともあるため、[対処法・予防策]を意識することが大切です。

### 制約:
- 批判的でない、理解ある語調
- 防御の必要性を認める
- 具体的なトリガーの説明
- 自己受容を促す表現
- 250-350文字`,
            
            SAFEMODE_INTEGRATION: `以下の分析データを基に、防御システムとの健全な付き合い方について一人称でアドバイスしてください。

### 分析データ:
- エンジンOS: {engineOS.osName}
- インターフェースOS: {interfaceOS.osName}
- セーフモードOS: {safeModeOS.osName}
- 発動パターン: {safemodeTriggers}
- 回復方法: {recoveryMethods}

### 出力形式:
私の防御システムは、実は私を守るための大切な機能です。

**早期発見のサイン**: [具体的な前兆・症状]に気づいたら、それは防御システムが作動し始めているサインです。

**健全な対処法**: 
1. [即座にできる対処法]
2. [中期的な改善策]
3. [長期的な統合方法]

**自己統合への道**: エンジンOSの[強み]とインターフェースOSの[特性]を活かしながら、セーフモードOSを[統合的な活用法]として捉えることで、より健全な自己表現が可能になります。

### 制約:
- 防御システムを「悪者」にしない
- 具体的で実践可能な対処法
- 3つのOSの統合的視点
- 希望に満ちた表現
- 300-400文字`,

            PRACTICAL_ADVICE: `以下の3OS統合分析データを基に、この人が日常生活で実践できる具体的なアドバイスを一人称で提供してください。

### 分析データ:
- エンジンOS: {engineOS.osName} (強み: {hexagramDetails.engine.potential_strengths})
- インターフェースOS: {interfaceOS.osName} (適性: {hexagramDetails.interface.behavioral_patterns})
- セーフモードOS: {safeModeOS.osName} (注意点: {hexagramDetails.safe_mode.trigger_situations})
- ユーザーの悩み: {userConcern}

### 出力形式:
私の3つのOSを統合して考えると、日常では次のことを意識すると良いでしょう。

**エネルギー管理**: [エンジンOSの活かし方]
**環境選択**: [インターフェースOSに適した環境・役割]
**ストレス対処**: [セーフモード発動を防ぐ/健全に対処する方法]

特に[ユーザーの悩みに対する具体的アドバイス]することをお勧めします。これにより[期待される改善・成果]が見込めます。

### 制約:
- 明日から実行できる具体的な行動
- 3OSの統合的な視点
- ユーザーの悩みへの直接的な対処法
- 希望的で実現可能な内容
- 300-400文字`
        };
    }

    // 品質制約の初期化
    _initializeQualityConstraints() {
        return {
            persona: "賢明で、共感的な相談役",
            tone: "一人称での語りかけ",
            avoidPatterns: ["べきである", "すべき", "かもしれません"],
            requirePatterns: ["私は", "私の", "私が"],
            maxLength: 400,
            minLength: 200
        };
    }

    // メイン戦略生成メソッド
    async generateStrategySummary(analysisData) {
        console.log("🎯 [PersonalStrategyAI] 4つの核心質問への回答生成開始", analysisData);

        try {
            // Phase 2: 5つの核心質問への回答を並列生成（セーフモード統合追加）
            const [rootStrength, optimalRole, defensivePattern, practicalAdvice, safemodeIntegration] = await Promise.all([
                this._generateRootStrength(analysisData),
                this._generateOptimalRole(analysisData),
                this._generateDefensivePattern(analysisData),
                this._generatePracticalAdvice(analysisData),
                this._generateSafemodeIntegration(analysisData) // Phase 2追加
            ]);

            const strategySummary = {
                rootStrength,
                optimalRole,
                defensivePattern,
                practicalAdvice,
                safemodeIntegration, // Phase 2追加
                generatedAt: new Date().toISOString(),
                version: "1.1" // Phase 2でバージョンアップ
            };

            console.log("✅ [PersonalStrategyAI] 戦略生成完了", strategySummary);
            return strategySummary;

        } catch (error) {
            console.error("❌ [PersonalStrategyAI] 戦略生成エラー:", error);
            return this._generateFallbackStrategy(analysisData);
        }
    }

    // 1. 根源的な強み発見
    async _generateRootStrength(analysisData) {
        console.log("💎 [PersonalStrategyAI] 根源的強み生成中...");

        const prompt = this._interpolateTemplate(
            this.promptTemplates.ROOT_STRENGTH, 
            analysisData
        );

        // AI生成のシミュレーション（実際のAI APIに置き換え可能）
        const response = await this._simulateAIGeneration(prompt, {
            focus: "strength",
            tone: "empowering",
            length: 250
        });

        return this._validateAndCleanResponse(response, "rootStrength");
    }

    // 2. 最適な役回り提案
    async _generateOptimalRole(analysisData) {
        console.log("🎯 [PersonalStrategyAI] 最適役回り生成中...");

        const prompt = this._interpolateTemplate(
            this.promptTemplates.OPTIMAL_ROLE, 
            analysisData
        );

        const response = await this._simulateAIGeneration(prompt, {
            focus: "role",
            tone: "guiding",
            length: 280
        });

        return this._validateAndCleanResponse(response, "optimalRole");
    }

    // 3. 防御パターン解説
    async _generateDefensivePattern(analysisData) {
        console.log("🔍 [PersonalStrategyAI] 防御パターン解説生成中...");

        const prompt = this._interpolateTemplate(
            this.promptTemplates.DEFENSIVE_PATTERN, 
            analysisData
        );

        const response = await this._simulateAIGeneration(prompt, {
            focus: "understanding",
            tone: "compassionate",
            length: 300
        });

        return this._validateAndCleanResponse(response, "defensivePattern");
    }

    // 4. 実践的アドバイス
    async _generatePracticalAdvice(analysisData) {
        console.log("⚡ [PersonalStrategyAI] 実践的アドバイス生成中...");

        const prompt = this._interpolateTemplate(
            this.promptTemplates.PRACTICAL_ADVICE, 
            analysisData
        );

        const response = await this._simulateAIGeneration(prompt, {
            focus: "actionable",
            tone: "supportive",
            length: 350
        });

        return this._validateAndCleanResponse(response, "practicalAdvice");
    }

    // 5. Phase 2: セーフモード統合アドバイス
    async _generateSafemodeIntegration(analysisData) {
        console.log("🛡️ [PersonalStrategyAI] セーフモード統合アドバイス生成中...");

        const prompt = this._interpolateTemplate(
            this.promptTemplates.SAFEMODE_INTEGRATION, 
            analysisData
        );

        const response = await this._simulateAIGeneration(prompt, {
            focus: "integration",
            tone: "empowering",
            length: 350
        });

        return this._validateAndCleanResponse(response, "safemodeIntegration");
    }

    // プロンプトテンプレートの変数補間
    _interpolateTemplate(template, analysisData) {
        let interpolated = template;

        // 基本的な置換パターン
        const replacements = {
            'engineOS.osName': analysisData.engineOS?.osName || '不明なエンジンOS',
            'interfaceOS.osName': analysisData.interfaceOS?.osName || '不明なインターフェースOS',
            'safeModeOS.osName': analysisData.safeModeOS?.osName || '不明なセーフモードOS',
            'userConcern': analysisData.userConcern || '自己理解を深めたい'
        };

        // hexagramDetailsの動的補間
        const engineDetails = this._getHexagramDetails(analysisData.engineOS?.hexagramId);
        const interfaceDetails = this._getHexagramDetails(analysisData.interfaceOS?.hexagramId);
        const safeModeDetails = this._getHexagramDetails(analysisData.safeModeOS?.hexagramId);

        if (engineDetails) {
            replacements['hexagramDetails.engine.core_drive'] = engineDetails.engine?.core_drive || '創造性を発揮すること';
            replacements['hexagramDetails.engine.potential_strengths'] = this._formatArray(engineDetails.engine?.potential_strengths);
        }

        if (interfaceDetails) {
            replacements['hexagramDetails.interface.how_it_appears'] = interfaceDetails.interface?.how_it_appears || '堂々とした振る舞い';
            replacements['hexagramDetails.interface.behavioral_patterns'] = this._formatArray(interfaceDetails.interface?.behavioral_patterns);
            replacements['hexagramDetails.interface.impression_on_others'] = interfaceDetails.interface?.impression_on_others || '信頼できる人';
        }

        if (safeModeDetails) {
            replacements['hexagramDetails.safe_mode.trigger_situations'] = this._formatArray(safeModeDetails.safe_mode?.trigger_situations);
            replacements['hexagramDetails.safe_mode.defensive_patterns'] = this._formatArray(safeModeDetails.safe_mode?.defensive_patterns);
            replacements['hexagramDetails.safe_mode.internal_state'] = safeModeDetails.safe_mode?.internal_state || '自分を守ろうとする気持ち';
        }

        // 8次元ベクトルの補間
        replacements['vector8D'] = this._formatVector8D(analysisData.engineOS?.vector);

        // Phase 2: セーフモード統合用データの補間
        replacements['safemodeTriggers'] = this._formatSafemodeTriggers(analysisData);
        replacements['recoveryMethods'] = this._formatRecoveryMethods(analysisData);

        // 実際の置換実行
        Object.entries(replacements).forEach(([key, value]) => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            interpolated = interpolated.replace(regex, value);
        });

        return interpolated;
    }

    // AI生成のシミュレーション（Phase 2では実AI APIに置換可能）
    async _simulateAIGeneration(prompt, options = {}) {
        // 実際の開発では、OpenAI API、Claude API、または独自LLMを使用
        console.log("🤖 [PersonalStrategyAI] AI生成シミュレーション実行中...", options);

        // 遅延でリアルなAI生成感を演出
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // サンプル応答の生成（実際のAI APIの代替）
        return this._generateSampleResponse(options);
    }

    // サンプル応答生成（開発・テスト用）
    _generateSampleResponse(options) {
        const sampleResponses = {
            strength: [
                "私の根源的な強みは、どんな困難な状況でも新しい解決策を見つけ出す創造力です。これは生来の好奇心と諦めない精神から来ており、特にチームが行き詰まった時や前例のない課題に直面した時に力を発揮します。この強みを活かすことで、組織に革新的な変化をもたらし、周囲の人々に新たな可能性を示すことができます。",
                "私の根源的な強みは、人の心に寄り添い、その人が本当に求めているものを理解する共感力です。これは幼い頃から人の感情に敏感だった経験から育まれており、特に対立や混乱の中にいる人たちの橋渡し役となる時に最も輝きます。この強みにより、職場や家庭で真の調和を生み出し、皆が安心できる環境を作ることができます。"
            ],
            role: [
                "私が最も輝ける役回りは、プロジェクトリーダーや企画責任者です。なぜなら私は全体を俯瞰しながら細部にも気を使い、チームメンバーそれぞれの長所を引き出す能力を持っているからです。逆に単調な作業の繰り返しや他人の指示を待つだけの環境は避け、自主性と創造性が求められる職場を選ぶことで、本来の力を存分に発揮できます。",
                "私が最も輝ける役回りは、カウンセラーやコーチ、メンター的な立場です。なぜなら私は人の話を深く聞き、その人の潜在能力を見抜いて適切な助言をする直感力を持っているからです。逆に競争が激しく結果だけを重視する環境は避け、人の成長を支援できる教育現場や福祉分野を選ぶことで、真の使命を果たすことができます。"
            ],
            understanding: [
                "私が時々らしくない振る舞いをしてしまうのは、過度なプレッシャーや批判を受けた時に「完璧主義モード」が自動的に作動するからです。この時の私は「絶対に失敗してはいけない」という恐怖に支配され、無意識に他人を遠ざけ、一人で全てを抱え込もうとしてしまいます。これは自分を守るための大切な機能ですが、孤立や燃え尽きを招くこともあるため、完璧でなくても大丈夫だと自分に言い聞かせることが重要です。",
                "私が時々らしくない振る舞いをしてしまうのは、対立や争いの場面に遭遇した時に「調和維持モード」が過剰に働くからです。この時の私は「みんなが仲良くしなければ」という強迫観念に囚われ、自分の意見を完全に封印して、ただひたすら場を取り繕おうとしてしまいます。これは平和を愛する美しい心の表れですが、自分らしさを失う原因にもなるため、時には健全な議論も必要だと受け入れることが大切です。"
            ],
            actionable: [
                "私の3つのOSを統合して考えると、日常では次のことを意識すると良いでしょう。**エネルギー管理**: 朝の30分を創作活動に充て、新しいアイデアを形にする時間を作る。**環境選択**: 自分の提案が尊重され、責任を持って実行できる職場や活動を選ぶ。**ストレス対処**: 完璧を求めすぎた時は深呼吸をし、「今日できる範囲で十分」と自分を労う。特に新しい挑戦を恐れず、小さな一歩から始めることをお勧めします。これにより自信と実績の好循環が生まれます。",
                "私の3つのOSを統合して考えると、日常では次のことを意識すると良いでしょう。**エネルギー管理**: 人との対話を通じて相手の本音を引き出し、共に成長を感じられる関係を築く。**環境選択**: 競争より協調が重視され、長期的な信頼関係を大切にする組織を選ぶ。**ストレス対処**: 対立を避けすぎた時は「私の意見も価値がある」と自分に言い聞かせ、少しずつ自己主張の練習をする。特に相手の立場を理解した上で、建設的な提案をすることをお勧めします。これにより真の調和と成長が実現できます。"
            ]
        };

        const responseType = options.focus || 'strength';
        const responses = sampleResponses[responseType] || sampleResponses.strength;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // 応答の検証とクリーニング
    _validateAndCleanResponse(response, type) {
        if (!response) {
            return this._getFallbackResponse(type);
        }

        // 一人称チェック
        if (!response.includes('私は') && !response.includes('私の') && !response.includes('私が')) {
            console.warn(`⚠️ [PersonalStrategyAI] ${type}応答に一人称が不足`);
        }

        // 文字数チェック
        if (response.length < this.qualityConstraints.minLength) {
            console.warn(`⚠️ [PersonalStrategyAI] ${type}応答が短すぎます`);
        }

        // 品質向上処理
        let cleaned = response
            .replace(/あなたは/g, '私は')
            .replace(/あなたの/g, '私の')
            .replace(/あなたが/g, '私が')
            .trim();

        return {
            text: cleaned,
            type: type,
            wordCount: cleaned.length,
            quality: this._assessQuality(cleaned),
            generatedAt: new Date().toISOString()
        };
    }

    // 品質評価
    _assessQuality(text) {
        let score = 100;

        // 一人称チェック
        if (!text.includes('私')) score -= 20;

        // 具体性チェック
        if (!text.match(/[具体的|特に|例えば]/)) score -= 10;

        // 実行可能性チェック
        if (!text.match(/[することで|により|ことができ]/)) score -= 10;

        return Math.max(score, 0);
    }

    // フォールバック戦略生成（Triple OS哲学統合版）
    _generateFallbackStrategy(analysisData) {
        console.warn("⚠️ [PersonalStrategyAI] Triple OS哲学統合フォールバック戦略を生成中...");

        // 分析データからTriple OS要素を抽出
        const tripleOSContext = this._extractTripleOSContext(analysisData);
        
        return {
            rootStrength: {
                text: this._generateTripleOSRootStrength(tripleOSContext),
                type: "rootStrength",
                quality: 80, // Triple OS統合で品質向上
                fallback: true,
                triple_os_enhanced: true
            },
            optimalRole: {
                text: this._generateTripleOSOptimalRole(tripleOSContext),
                type: "optimalRole",
                quality: 80,
                fallback: true,
                triple_os_enhanced: true
            },
            defensivePattern: {
                text: this._generateTripleOSDefensivePattern(tripleOSContext),
                type: "defensivePattern",
                quality: 80,
                fallback: true,
                triple_os_enhanced: true
            },
            practicalAdvice: {
                text: this._generateTripleOSPracticalAdvice(tripleOSContext),
                type: "practicalAdvice",
                quality: 80,
                fallback: true,
                triple_os_enhanced: true
            },
            safemodeIntegration: { // Phase 2追加
                text: this._generateTripleOSSafemodeIntegration(tripleOSContext),
                type: "safemodeIntegration",
                quality: 80,
                fallback: true,
                triple_os_enhanced: true
            }
        };
    }

    // Triple OS哲学コンテキストの抽出
    _extractTripleOSContext(analysisData) {
        const context = {
            hasEngineOS: !!(analysisData?.engineOS),
            hasInterfaceOS: !!(analysisData?.interfaceOS),
            hasSafeModeOS: !!(analysisData?.safeModeOS),
            multiplePersonalities: false,
            strategicNavigation: true // Triple OS哲学の核心
        };

        // 複数分人の存在を確認
        if (context.hasEngineOS && context.hasInterfaceOS && context.hasSafeModeOS) {
            context.multiplePersonalities = true;
            context.primaryOS = analysisData.engineOS?.osName || '創造探求系';
            context.socialOS = analysisData.interfaceOS?.osName || '調和共生系';
            context.protectiveOS = analysisData.safeModeOS?.osName || '保護安定系';
        }

        return context;
    }

    // Triple OS統合版根源的強み
    _generateTripleOSRootStrength(context) {
        if (context.multiplePersonalities) {
            return `私の根源的な強みは、${context.primaryOS}、${context.socialOS}、${context.protectiveOS}という複数の分人を適切に使い分けられることです。これらの異なる側面を状況に応じて選択し、統合することで、単一の「真の自己」を探すよりもはるかに柔軟で豊かな人生を実現できます。この分人の多様性こそが、私の最大の資産です。`;
        } else {
            return `私の根源的な強みは、複数の自分を受け入れ、状況に応じて適切な面を表現できることです。分人思想の理解により、固定的な「本当の自分」にとらわれず、戦略的に人生をナビゲートしていく柔軟性を持っています。この多面性こそが、現代社会を生き抜く重要な能力です。`;
        }
    }

    // Triple OS統合版最適役回り
    _generateTripleOSOptimalRole(context) {
        if (context.multiplePersonalities) {
            return `私が最も輝ける役回りは、状況適応型リーダーや多面的コンサルタントです。${context.primaryOS}で創造的な問題解決を行い、${context.socialOS}で人間関係を円滑にし、${context.protectiveOS}でリスク管理をする。この分人の使い分けにより、従来の固定的な役割を超えた価値を提供できます。単一の専門性よりも、複数の分人を統合した総合力が求められる環境で真価を発揮します。`;
        } else {
            return `私が最も輝ける役回りは、変化に対応できる多面的なサポーターです。分人思想を理解している私は、相手や状況に応じて最適な自分を選択し、真に必要な支援を提供できます。「一貫した自分」という呪縛から解放されているため、柔軟で実効性の高い貢献ができる環境で力を発揮します。`;
        }
    }

    // Triple OS統合版防御パターン解説
    _generateTripleOSDefensivePattern(context) {
        if (context.multiplePersonalities) {
            return `私が時々らしくない振る舞いをするのは、${context.protectiveOS}が自動的に作動するからです。これは欠点ではなく、分人思想で言う自然な分人切り替えです。ストレス状況では保護モードの分人が前面に出てきますが、これは私を守る大切な機能。問題は「らしくない」と自分を責めることで、実際は状況に応じた適切な分人選択なのです。この理解により、自己受容が深まります。`;
        } else {
            return `私が時々らしくない振る舞いをするのは、分人思想で説明できる自然な現象です。人は誰でも複数の分人を持っており、状況によって異なる面が現れます。これを「本当の自分ではない」と否定するのではなく、「状況に応じた分人の選択」として受け入れることで、心の負担が軽くなり、より戦略的に自分をコントロールできるようになります。`;
        }
    }

    // Triple OS統合版実践的アドバイス
    _generateTripleOSPracticalAdvice(context) {
        if (context.multiplePersonalities) {
            return `私の${context.primaryOS}、${context.socialOS}、${context.protectiveOS}を統合して考えると、日常では「分人の意識的選択」を実践すると良いでしょう。**分人マネジメント**: 朝に今日使う分人を意識的に選択する。**環境設計**: それぞれの分人が活躍できる場面を意図的に作る。**統合戦略**: 複数の分人の強みを組み合わせた独自のアプローチを開発する。分人思想により、「自分らしさ」の呪縛から解放され、戦略的人生設計が可能になります。`;
        } else {
            return `分人思想を活かした日常実践をお勧めします。**分人の観察**: 自分の中の異なる面を客観視し、それぞれの特性を理解する。**戦略的選択**: 状況に応じて最適な分人を意識的に選ぶ。**自己受容**: 「一貫した自分」を求めず、多面性を資産として活用する。これにより、従来の自己啓発とは異なる、より実践的で持続可能な成長が実現できます。`;
        }
    }

    // Phase 2: Triple OS統合版セーフモード統合
    _generateTripleOSSafemodeIntegration(context) {
        if (context.multiplePersonalities) {
            return `私の防御システムである${context.protectiveOS}は、実は私を守るための重要な分人です。**早期発見のサイン**: ${context.primaryOS}と${context.socialOS}の間に大きなズレを感じた時、それは防御システムが作動し始めているサインです。**健全な対処法**: 1. まず防御モードの分人を認識し、感謝する 2. なぜこの分人が出てきたのか、状況を客観視する 3. 必要に応じて環境を調整し、より適切な分人を選択する。**自己統合への道**: すべての分人を「私の一部」として受け入れることで、状況に応じた最適な自己表現が可能になります。`;
        } else {
            return `私の防御システムは、分人思想で理解すると「保護的な分人」の表れです。**早期発見のサイン**: いつもと違う行動パターンに気づいたら、それは別の分人が前面に出ているサインかもしれません。**健全な対処法**: 1. 今どの分人が活動しているかを観察する 2. その分人が何を守ろうとしているかを理解する 3. 状況に応じて、より建設的な分人を意識的に選択する。**統合への道**: すべての分人には存在理由があります。それを理解し、活用することで、より豊かな人生が実現できます。`;
        }
    }

    // ヘルパーメソッド群
    _getHexagramDetails(hexagramId) {
        if (!this.dataManager || !hexagramId) return null;
        return this.dataManager.getHexagramDetails(hexagramId);
    }

    _formatArray(array) {
        if (!Array.isArray(array)) return '情報なし';
        return array.join('、');
    }

    _formatVector8D(vector) {
        if (!vector) return '基本的な人格特性';
        
        const dimensions = Object.entries(vector)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([key, value]) => {
                const name = key.split('_')[1] || key;
                return `${name}: ${Math.round(value * 10)}/10`;
            });
        
        return dimensions.join(', ');
    }

    // Phase 2: セーフモードトリガーのフォーマット
    _formatSafemodeTriggers(analysisData) {
        const triggers = [];
        
        // 基本的なトリガー
        if (analysisData.safeModeOS?.hexagramId) {
            triggers.push('価値観と環境の不一致');
            triggers.push('過度のストレスや圧力');
            triggers.push('本音と建前の乖離');
        }
        
        // セーフモード質問への回答から抽出
        if (analysisData.safemodeResponses) {
            if (analysisData.safemodeResponses.impulse > 2) triggers.push('衝動的な行動への欲求');
            if (analysisData.safemodeResponses.physical > 2) triggers.push('心身の疲労');
            if (analysisData.safemodeResponses.blame > 2) triggers.push('他責思考の増加');
        }
        
        return triggers.length > 0 ? triggers.join('、') : '過度なストレス状況';
    }

    // Phase 2: 回復方法のフォーマット
    _formatRecoveryMethods(analysisData) {
        const methods = [];
        
        // 基本的な回復方法
        methods.push('十分な休息とセルフケア');
        methods.push('信頼できる人との対話');
        
        // 8次元ベクトルから回復方法を提案
        if (analysisData.engineOS?.vector) {
            const vector = analysisData.engineOS.vector;
            if (vector['坎_探求性'] > 0.7) methods.push('内省と自己分析');
            if (vector['兌_調和性'] > 0.7) methods.push('人とのつながりを深める');
            if (vector['乾_創造性'] > 0.7) methods.push('新しい価値観の探求');
        }
        
        return methods.length > 0 ? methods.join('、') : '休息と内省、そして段階的な回復';
    }

    _getFallbackResponse(type) {
        const fallbacks = {
            rootStrength: "私には独特の視点と粘り強さがあります。",
            optimalRole: "私は信頼できるチームメンバーとして力を発揮できます。",
            defensivePattern: "私の防御反応は、自分を守るための自然な機能です。",
            practicalAdvice: "自分のペースを大切にし、着実に歩むことが重要です。",
            safemodeIntegration: "私の防御システムは、私を守るための大切な機能です。これを理解し、受け入れることで、より健全な自己表現が可能になります。" // Phase 2追加
        };

        return {
            text: fallbacks[type] || "私には独自の価値があります。",
            type: type,
            quality: 50,
            fallback: true
        };
    }

    // 公開メソッド: 戦略の再生成
    async regenerateStrategy(analysisData, focusArea = null) {
        if (focusArea) {
            switch(focusArea) {
                case 'rootStrength':
                    return await this._generateRootStrength(analysisData);
                case 'optimalRole':
                    return await this._generateOptimalRole(analysisData);
                case 'defensivePattern':
                    return await this._generateDefensivePattern(analysisData);
                case 'practicalAdvice':
                    return await this._generatePracticalAdvice(analysisData);
                case 'safemodeIntegration': // Phase 2追加
                    return await this._generateSafemodeIntegration(analysisData);
                default:
                    return await this.generateStrategySummary(analysisData);
            }
        }
        return await this.generateStrategySummary(analysisData);
    }
}

// クラスをグローバルスコープに登録
if (typeof window !== 'undefined') {
    window.PersonalStrategyAI = PersonalStrategyAI;
}