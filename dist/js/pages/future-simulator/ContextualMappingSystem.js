/**
 * 文脈理解型マッピングシステム
 * 
 * 目的：
 * - 単純キーワードマッチングからの脱却
 * - 文脈・感情・意図の総合的理解
 * - Claude の推論能力を活用した高精度判定
 * - リアルタイム学習機能の実装
 * 
 * 分析手法：
 * 1. 多層意味解析（表層・深層・メタレベル）
 * 2. 感情・時制・主体性の統合分析
 * 3. 易経哲学に基づく状況理解
 * 4. 確率的マッピングと信頼度計算
 * 
 * 特徴：
 * - 用九・用六の特殊状態認識強化
 * - 矛盾表現・皮肉・反語の適切な処理
 * - 文化的コンテキストの考慮
 * 
 * 前提条件：
 * - ClaudeAnalysisEngineが初期化済み
 * - SmartTemplateOptimizerが利用可能（オプション）
 * - HexagramPatternTemplatesが読み込み済み
 * 
 * 技術的特徴：
 * - ベイジアン推論による確率的マッピング
 * - 動的重み調整機能
 * - 継続学習によるパフォーマンス向上
 * - 多候補生成と信頼度ランキング
 */
class ContextualMappingSystem {
  constructor() {
    this.claudeEngine = null; // ClaudeAnalysisEngineのインスタンス
    this.patternTemplates = new HexagramPatternTemplates();
    this.mappingHistory = new Map(); // マッピング履歴
    this.learningData = this.initializeLearningData();
    this.contextualRules = this.initializeContextualRules();
    this.bayesianMaps = this.initializeBayesianMaps();
    this.confidenceThresholds = this.initializeConfidenceThresholds();
    
    // パフォーマンス統計
    this.mappingStats = {
      totalMappings: 0,
      successfulMappings: 0,
      averageConfidence: 0,
      averageProcessingTime: 0,
      specialYaoDetections: 0,
      learningIterations: 0
    };
  }

  /**
   * システムの初期化
   * 
   * 目的：
   * - 依存関係の確立
   * - 基本データの読み込み
   * - 学習システムの準備
   * 
   * 処理内容：
   * 1. ClaudeAnalysisEngineとの連携
   * 2. テンプレートデータの確認
   * 3. 学習データの初期化
   * 4. システム状態の検証
   * 
   * 出力：
   * - 初期化成功・失敗の状態
   * 
   * エラー処理：
   * - 依存関係不足時の警告
   * - データ不整合時の修復試行
   */
  async initialize() {
    try {
      console.log('=== 文脈理解型マッピングシステム初期化 ===');
      
      // 1. 依存関係の確認
      if (typeof ClaudeAnalysisEngine !== 'undefined') {
        this.claudeEngine = new ClaudeAnalysisEngine();
        console.log('✓ ClaudeAnalysisEngine統合完了');
      } else {
        console.warn('⚠ ClaudeAnalysisEngine未検出 - 基本機能のみ利用');
      }
      
      // 2. テンプレートデータの検証
      const templateStats = this.patternTemplates.getStatistics();
      console.log(`✓ テンプレート読み込み: ${templateStats.totalDefined}個`);
      
      if (templateStats.totalDefined < 300) {
        console.warn('⚠ テンプレート数が不足しています');
      }
      
      // 3. 学習データの初期化
      await this.initializeLearningSystem();
      console.log('✓ 学習システム初期化完了');
      
      // 4. ベイジアンマップの構築
      await this.buildBayesianMaps();
      console.log('✓ ベイジアンマッピング準備完了');
      
      console.log('=== 初期化完了 ===\n');
      return true;
      
    } catch (error) {
      console.error('初期化エラー:', error);
      return false;
    }
  }

  /**
   * 学習データの初期化
   * 
   * 目的：
   * - 継続学習のための基盤構築
   * - パターン認識の精度向上
   * - 動的重み調整の準備
   * 
   * 処理内容：
   * 1. 基本パターンデータの構築
   * 2. 成功・失敗事例の記録構造
   * 3. 重み調整アルゴリズムの準備
   * 4. フィードバックループの設定
   * 
   * 出力：
   * - 学習システムの基盤データ
   */
  initializeLearningData() {
    return {
      // パターン学習データ
      patterns: {
        successful_mappings: new Map(), // 成功したマッピングパターン
        failed_mappings: new Map(),     // 失敗したマッピングパターン
        user_corrections: new Map(),    // ユーザー修正データ
        confidence_history: []          // 信頼度履歴
      },
      
      // 重み学習データ
      weights: {
        feature_importance: {
          keyword_match: 0.3,
          emotion_match: 0.25,
          context_match: 0.2,
          temporal_match: 0.1,
          special_indicators: 0.15
        },
        
        hexagram_priors: new Map(), // 卦別の事前確率
        line_priors: new Map(),     // 爻位別の事前確率
        
        adjustment_history: []       // 重み調整履歴
      },
      
      // 文脈学習データ
      contextual: {
        phrase_patterns: new Map(),  // フレーズパターンと結果の関連
        semantic_clusters: new Map(), // 意味クラスターの学習
        cultural_adaptations: new Map() // 文化的適応の学習
      }
    };
  }

  /**
   * 文脈ルールの初期化
   * 
   * 目的：
   * - 高度な文脈理解ルールの定義
   * - 複雑な言語現象への対応
   * - Claude級の推論ロジック実装
   * 
   * 処理内容：
   * 1. 文脈推論ルールの定義
   * 2. 矛盾・皮肉・反語の処理
   * 3. 時制・主体性・感情の統合
   * 4. 特殊状況の認識ルール
   * 
   * 出力：
   * - 包括的文脈ルールシステム
   */
  initializeContextualRules() {
    return {
      // 高次文脈ルール
      advanced_rules: [
        {
          name: 'contradiction_resolution',
          description: '矛盾表現の適切な解釈',
          conditions: [
            { type: 'contradiction_markers', patterns: [/でも|だけど|しかし|ただ/] },
            { type: 'conflicting_emotions', threshold: 0.7 }
          ],
          processing: {
            strategy: 'prioritize_deeper_emotion',
            confidence_modifier: -0.1,
            special_handling: true
          }
        },
        
        {
          name: 'irony_sarcasm_detection',
          description: '皮肉・反語の検出と処理',
          conditions: [
            { type: 'excessive_positivity', threshold: 0.9 },
            { type: 'context_mismatch', threshold: 0.6 },
            { type: 'punctuation_emphasis', patterns: [/！{2,}|？{2,}/] }
          ],
          processing: {
            strategy: 'invert_surface_emotion',
            confidence_modifier: -0.2,
            require_confirmation: true
          }
        },
        
        {
          name: 'temporal_context_integration',
          description: '時制文脈の統合分析',
          conditions: [
            { type: 'mixed_tenses', threshold: 0.5 },
            { type: 'temporal_progression', patterns: [/前は.*今は.*これから/] }
          ],
          processing: {
            strategy: 'weight_by_recency',
            focus_on: 'present_future',
            confidence_modifier: 0.1
          }
        },
        
        {
          name: 'cultural_nuance_handling',
          description: '文化的ニュアンスの処理',
          conditions: [
            { type: 'honorific_usage', patterns: [/です|ます|ございます/] },
            { type: 'humble_expressions', patterns: [/恐縮|申し訳|すみません/] },
            { type: 'indirect_refusal', patterns: [/ちょっと|なかなか|微妙/] }
          ],
          processing: {
            strategy: 'interpret_cultural_context',
            confidence_modifier: 0.05,
            cultural_weight: 0.3
          }
        }
      ],
      
      // 特殊状況認識ルール
      special_situation_rules: [
        {
          name: 'integration_mastery',
          description: '統合・習得状態の認識',
          patterns: [
            /すべて.*統合|全て.*まとめ|完全.*理解/,
            /マスター|達人|完璧.*理解|究極/,
            /次元.*上|レベルアップ|進化.*完了/
          ],
          target: { hexagram: 1, line: '用九' },
          confidence_boost: 0.3
        },
        
        {
          name: 'receptive_completion',
          description: '受容・完成状態の認識',
          patterns: [
            /全て.*受け入れ|完全.*受容|すべて.*包み込/,
            /最高.*柔軟|究極.*適応|完璧.*調和/,
            /母性.*発揮|包容力.*完成/
          ],
          target: { hexagram: 2, line: '用六' },
          confidence_boost: 0.3
        },
        
        {
          name: 'cyclic_struggle',
          description: '循環的困難パターンの認識',
          patterns: [
            /また.*同じ|毎回.*失敗|繰り返し.*問題/,
            /[0-9]+回目|何度.*同じ|いつも.*パターン/,
            /ループ|堂々巡り|抜け出せない/
          ],
          target: { hexagram: 29, line: 3 },
          confidence_boost: 0.2
        }
      ],
      
      // 動的調整ルール
      dynamic_adjustment_rules: {
        confidence_decay: {
          rate: 0.95,
          min_threshold: 0.3,
          decay_condition: 'low_user_satisfaction'
        },
        
        weight_adaptation: {
          learning_rate: 0.01,
          momentum: 0.9,
          adaptation_trigger: 'feedback_received'
        },
        
        pattern_reinforcement: {
          success_boost: 1.1,
          failure_penalty: 0.9,
          reinforcement_threshold: 3
        }
      }
    };
  }

  /**
   * ベイジアンマップの初期化
   * 
   * 目的：
   * - 確率的マッピングの基盤構築
   * - 多候補生成と信頼度計算
   * - 不確実性の適切な表現
   * 
   * 処理内容：
   * 1. 事前確率の設定
   * 2. 尤度関数の定義
   * 3. 事後確率計算アルゴリズム
   * 4. 信頼区間の計算
   * 
   * 出力：
   * - ベイジアン推論システム
   */
  initializeBayesianMaps() {
    return {
      // 事前確率（Prior Probabilities）
      priors: {
        hexagram_frequency: new Map([
          // 使用頻度の高い卦（実際のデータに基づく推定）
          [1, 0.08],   // 乾為天 - リーダーシップ・成功
          [2, 0.07],   // 坤為地 - 受容・協調
          [29, 0.06],  // 坎為水 - 困難・試練
          [30, 0.05],  // 離為火 - 明晰・情熱
          [11, 0.04],  // 泰 - 平和・調和
          [12, 0.04],  // 否 - 閉塞・困難
          // 他の卦は均等分布ベース
        ]),
        
        line_position_frequency: new Map([
          [1, 0.18], // 初爻 - 始まり
          [2, 0.16], // 二爻 - 発展
          [3, 0.17], // 三爻 - 困難・転換点
          [4, 0.16], // 四爻 - 選択・判断
          [5, 0.15], // 五爻 - 責任・中心
          [6, 0.13], // 上爻 - 完成・終結
          ['用九', 0.025], // 用九 - 特殊統合
          ['用六', 0.025]  // 用六 - 特殊受容
        ]),
        
        emotion_hexagram_correlation: new Map([
          // 感情と卦の相関関係
          ['anxiety', new Map([[29, 0.3], [39, 0.25], [47, 0.2], [4, 0.15]])],
          ['hope', new Map([[11, 0.3], [19, 0.25], [35, 0.2], [24, 0.15]])],
          ['frustration', new Map([[12, 0.3], [33, 0.25], [21, 0.2], [43, 0.15]])],
          ['determination', new Map([[1, 0.3], [51, 0.25], [25, 0.2], [34, 0.15]])],
          ['confusion', new Map([[4, 0.3], [60, 0.25], [61, 0.2], [20, 0.15]])],
          ['sadness', new Map([[36, 0.3], [47, 0.25], [56, 0.2], [28, 0.15]])]
        ])
      },
      
      // 尤度関数（Likelihood Functions）
      likelihood_functions: {
        keyword_match: {
          exact_match: 0.9,
          partial_match: 0.6,
          semantic_match: 0.4,
          no_match: 0.1
        },
        
        emotion_match: {
          perfect_alignment: 0.95,
          good_alignment: 0.7,
          moderate_alignment: 0.5,
          poor_alignment: 0.2,
          contradiction: 0.05
        },
        
        context_match: {
          high_relevance: 0.85,
          medium_relevance: 0.6,
          low_relevance: 0.3,
          irrelevant: 0.1
        },
        
        special_indicators: {
          strong_evidence: 0.9,
          moderate_evidence: 0.6,
          weak_evidence: 0.3,
          no_evidence: 0.1
        }
      },
      
      // 事後確率計算
      posterior_calculation: {
        normalization_required: true,
        confidence_threshold: 0.5,
        multi_modal_handling: 'weighted_average',
        uncertainty_estimation: 'entropy_based'
      },
      
      // 信頼区間設定
      confidence_intervals: {
        high_confidence: { min: 0.8, max: 1.0 },
        medium_confidence: { min: 0.6, max: 0.8 },
        low_confidence: { min: 0.4, max: 0.6 },
        very_low_confidence: { min: 0.0, max: 0.4 }
      }
    };
  }

  /**
   * 信頼度閾値の初期化
   * 
   * 目的：
   * - 品質保証基準の設定
   * - 段階的信頼度評価
   * - エラー防止機能
   */
  initializeConfidenceThresholds() {
    return {
      // 基本閾値
      basic: {
        minimum_acceptable: 0.4,
        good_quality: 0.6,
        high_quality: 0.8,
        excellent_quality: 0.9
      },
      
      // 特殊爻の閾値（より厳格）
      special_yao: {
        minimum_acceptable: 0.7,
        good_quality: 0.8,
        high_quality: 0.9,
        excellent_quality: 0.95
      },
      
      // 状況別調整
      situational_adjustments: {
        complex_input: -0.1,        // 複雑な入力
        contradictory_signals: -0.2, // 矛盾する信号
        clear_indicators: 0.1,      // 明確な指標
        multiple_confirmations: 0.2  // 複数の確認
      }
    };
  }

  /**
   * メイン分析・マッピング関数
   * 
   * 目的：
   * - ユーザー入力の包括的分析
   * - 386爻への高精度マッピング
   * - 信頼度付き複数候補の生成
   * 
   * 入力：
   * - userInput: ユーザーの自然言語入力
   * - options: 分析オプション
   * 
   * 処理内容：
   * 1. Claude分析エンジンとの統合分析
   * 2. 文脈ルールの適用
   * 3. ベイジアン推論による確率計算
   * 4. 信頼度評価と候補選択
   * 5. 学習データの更新
   * 
   * 出力：
   * - 詳細なマッピング結果
   * - 複数候補と信頼度
   * - 分析根拠と推論過程
   * 
   * エラー処理：
   * - 分析失敗時のフォールバック
   * - 低信頼度時の警告
   * - システムエラーの適切な処理
   */
  async performContextualMapping(userInput, options = {}) {
    const startTime = performance.now();
    
    try {
      console.log(`\n=== 文脈マッピング開始 ===`);
      console.log(`入力: "${userInput}"`);
      
      const mappingResult = {
        input: userInput,
        timestamp: new Date().toISOString(),
        processingTime: 0,
        
        // 分析結果
        claudeAnalysis: null,
        contextualAnalysis: null,
        bayesianAnalysis: null,
        
        // マッピング結果
        candidates: [],
        primaryResult: null,
        confidence: 0,
        
        // メタデータ
        reasoning: [],
        warnings: [],
        learningData: null
      };
      
      // 1. Claude分析エンジンによる基本分析
      if (this.claudeEngine) {
        mappingResult.claudeAnalysis = await this.claudeEngine.analyzeUserInput(userInput, options);
        console.log(`✓ Claude分析完了 (信頼度: ${(mappingResult.claudeAnalysis.confidence * 100).toFixed(1)}%)`);
      } else {
        console.log('⚠ Claude分析スキップ（エンジン未初期化）');
      }
      
      // 2. 文脈ルールの適用
      mappingResult.contextualAnalysis = await this.applyContextualRules(
        userInput, 
        mappingResult.claudeAnalysis,
        options
      );
      console.log(`✓ 文脈分析完了`);
      
      // 3. ベイジアン推論による確率計算
      mappingResult.bayesianAnalysis = await this.performBayesianInference(
        mappingResult.claudeAnalysis,
        mappingResult.contextualAnalysis,
        options
      );
      console.log(`✓ ベイジアン分析完了`);
      
      // 4. 候補生成と信頼度計算
      mappingResult.candidates = this.generateMappingCandidates(mappingResult);
      console.log(`✓ ${mappingResult.candidates.length}個の候補生成`);
      
      // 5. 最終結果の決定
      mappingResult.primaryResult = this.selectPrimaryResult(mappingResult.candidates);
      mappingResult.confidence = mappingResult.primaryResult?.confidence || 0;
      
      // 6. 推論過程の記録
      mappingResult.reasoning = this.generateMappingReasoning(mappingResult);
      
      // 7. 品質検証と警告
      mappingResult.warnings = this.generateQualityWarnings(mappingResult);
      
      // 8. 学習データの記録
      mappingResult.learningData = this.recordLearningData(mappingResult);
      
      // 9. 統計更新
      const endTime = performance.now();
      mappingResult.processingTime = endTime - startTime;
      this.updateMappingStats(mappingResult);
      
      console.log(`=== マッピング完了 ===`);
      console.log(`結果: ${mappingResult.primaryResult?.hexagram}卦 ${mappingResult.primaryResult?.line}爻`);
      console.log(`信頼度: ${(mappingResult.confidence * 100).toFixed(1)}%`);
      console.log(`処理時間: ${mappingResult.processingTime.toFixed(1)}ms\n`);
      
      return mappingResult;
      
    } catch (error) {
      console.error('マッピングエラー:', error);
      return this.generateErrorMappingResult(userInput, error);
    }
  }

  /**
   * 文脈ルールの適用
   * 
   * 目的：
   * - 高度な文脈理解ルールの実行
   * - 矛盾・皮肉・反語の処理
   * - 文化的コンテキストの統合
   * 
   * 処理内容：
   * 1. 高次文脈ルールの適用
   * 2. 特殊状況の認識
   * 3. 動的調整の実行
   * 4. 文脈統合スコアの計算
   * 
   * 出力：
   * - 文脈分析結果
   * - 調整済み重み
   * - 特殊処理フラグ
   */
  async applyContextualRules(userInput, claudeAnalysis, options) {
    const contextualResult = {
      appliedRules: [],
      adjustments: {},
      specialHandling: false,
      culturalContext: null,
      confidenceModifiers: [],
      overallAdjustment: 0
    };
    
    // 1. 高次文脈ルールの適用
    for (const rule of this.contextualRules.advanced_rules) {
      const ruleMatch = this.evaluateContextualRule(rule, userInput, claudeAnalysis);
      
      if (ruleMatch.applies) {
        contextualResult.appliedRules.push({
          name: rule.name,
          description: rule.description,
          confidence: ruleMatch.confidence,
          adjustments: ruleMatch.adjustments
        });
        
        // 信頼度修正の適用
        if (rule.processing.confidence_modifier) {
          contextualResult.confidenceModifiers.push({
            rule: rule.name,
            modifier: rule.processing.confidence_modifier,
            reason: rule.description
          });
        }
        
        // 特殊処理フラグの設定
        if (rule.processing.special_handling) {
          contextualResult.specialHandling = true;
        }
      }
    }
    
    // 2. 特殊状況ルールの適用
    for (const specialRule of this.contextualRules.special_situation_rules) {
      const specialMatch = this.evaluateSpecialSituationRule(specialRule, userInput);
      
      if (specialMatch.applies) {
        contextualResult.appliedRules.push({
          name: specialRule.name,
          description: specialRule.description,
          target: specialRule.target,
          confidenceBoost: specialRule.confidence_boost
        });
        
        contextualResult.confidenceModifiers.push({
          rule: specialRule.name,
          modifier: specialRule.confidence_boost,
          reason: '特殊状況認識'
        });
      }
    }
    
    // 3. 全体調整値の計算
    contextualResult.overallAdjustment = contextualResult.confidenceModifiers
      .reduce((sum, mod) => sum + mod.modifier, 0);
    
    return contextualResult;
  }

  /**
   * ベイジアン推論の実行
   * 
   * 目的：
   * - 確率的マッピングの計算
   * - 不確実性の適切な表現
   * - 多候補生成と信頼度評価
   * 
   * 処理内容：
   * 1. 事前確率の取得
   * 2. 尤度の計算
   * 3. 事後確率の算出
   * 4. 正規化と信頼区間計算
   * 
   * 出力：
   * - 全386爻の事後確率
   * - 信頼区間情報
   * - 不確実性指標
   */
  async performBayesianInference(claudeAnalysis, contextualAnalysis, options) {
    const bayesianResult = {
      posteriorProbabilities: new Map(),
      uncertaintyMeasures: {},
      evidenceWeights: {},
      normalizedScores: new Map()
    };
    
    // 1. 証拠の重み計算
    bayesianResult.evidenceWeights = this.calculateEvidenceWeights(
      claudeAnalysis, 
      contextualAnalysis
    );
    
    // 2. 各爻に対する事後確率計算
    for (let hexNum = 1; hexNum <= 64; hexNum++) {
      for (let lineNum = 1; lineNum <= 6; lineNum++) {
        const yaoCandidateKey = `${hexNum}-${lineNum}`;
        const posterior = this.calculatePosteriorProbability(
          hexNum, 
          lineNum, 
          claudeAnalysis, 
          contextualAnalysis,
          bayesianResult.evidenceWeights
        );
        
        bayesianResult.posteriorProbabilities.set(yaoCandidateKey, posterior);
      }
    }
    
    // 3. 特殊爻の計算
    const yongJiuPosterior = this.calculateSpecialYaoPosterior(
      1, '用九', claudeAnalysis, contextualAnalysis, bayesianResult.evidenceWeights
    );
    bayesianResult.posteriorProbabilities.set('1-用九', yongJiuPosterior);
    
    const yongLiuPosterior = this.calculateSpecialYaoPosterior(
      2, '用六', claudeAnalysis, contextualAnalysis, bayesianResult.evidenceWeights
    );
    bayesianResult.posteriorProbabilities.set('2-用六', yongLiuPosterior);
    
    // 4. 正規化
    bayesianResult.normalizedScores = this.normalizePosteriorProbabilities(
      bayesianResult.posteriorProbabilities
    );
    
    // 5. 不確実性の計算
    bayesianResult.uncertaintyMeasures = this.calculateUncertaintyMeasures(
      bayesianResult.normalizedScores
    );
    
    return bayesianResult;
  }

  /**
   * マッピング候補の生成
   * 
   * 目的：
   * - 複数の高品質候補の選択
   * - 信頼度付きランキング
   * - 多様性の確保
   * 
   * 処理内容：
   * 1. 上位候補の抽出
   * 2. 多様性チェック
   * 3. 信頼度調整
   * 4. 最終候補リストの作成
   * 
   * 出力：
   * - 信頼度順候補リスト
   * - 各候補の詳細情報
   */
  generateMappingCandidates(mappingResult) {
    const candidates = [];
    
    // 1. ベイジアン分析からの候補抽出
    const sortedProbabilities = Array.from(mappingResult.bayesianAnalysis.normalizedScores.entries())
      .sort((a, b) => b[1].probability - a[1].probability)
      .slice(0, 10); // 上位10候補
    
    // 2. 各候補の詳細情報生成
    for (const [yaoKey, probData] of sortedProbabilities) {
      const [hexNum, lineNum] = yaoKey.split('-');
      const candidate = {
        hexagram: parseInt(hexNum),
        line: lineNum === '用九' || lineNum === '用六' ? lineNum : parseInt(lineNum),
        probability: probData.probability,
        confidence: this.calculateCandidateConfidence(yaoKey, mappingResult),
        reasoning: this.generateCandidateReasoning(yaoKey, mappingResult),
        sources: this.identifyCandidateSources(yaoKey, mappingResult),
        isSpecialYao: lineNum === '用九' || lineNum === '用六',
        qualityScore: probData.quality || 0.5
      };
      
      candidates.push(candidate);
    }
    
    // 3. 信頼度による最終フィルタリング
    const minConfidence = this.confidenceThresholds.basic.minimum_acceptable;
    const filteredCandidates = candidates.filter(c => c.confidence >= minConfidence);
    
    // 4. 多様性確保（同一卦の候補数制限）
    const diverseCandidates = this.ensureCandidateDiversity(filteredCandidates);
    
    return diverseCandidates.slice(0, 5); // 最大5候補
  }

  /**
   * 主要結果の選択
   * 
   * 目的：
   * - 最も適切な単一結果の決定
   * - 品質保証基準の適用
   * - エラー処理の実装
   */
  selectPrimaryResult(candidates) {
    if (candidates.length === 0) {
      return null;
    }
    
    // 信頼度とベイジアン確率の複合評価
    const scoredCandidates = candidates.map(candidate => ({
      ...candidate,
      compositeScore: (candidate.confidence * 0.6) + (candidate.probability * 0.4)
    }));
    
    // 最高スコアの候補を選択
    const primaryResult = scoredCandidates.reduce((best, current) => 
      current.compositeScore > best.compositeScore ? current : best
    );
    
    return primaryResult;
  }

  /**
   * 事後確率の計算
   * 
   * 目的：
   * - ベイジアン推論による確率計算
   * - 複数証拠の統合
   * - 不確実性の適切な表現
   */
  calculatePosteriorProbability(hexNum, lineNum, claudeAnalysis, contextualAnalysis, evidenceWeights) {
    // 事前確率の取得
    const hexPrior = this.bayesianMaps.priors.hexagram_frequency.get(hexNum) || 0.015; // デフォルト値
    const linePrior = this.bayesianMaps.priors.line_position_frequency.get(lineNum) || 0.16;
    const prior = hexPrior * linePrior;
    
    // 尤度の計算
    let likelihood = 1.0;
    
    // キーワードマッチの尤度
    if (claudeAnalysis && claudeAnalysis.surfaceAnalysis) {
      const keywordLikelihood = this.calculateKeywordLikelihood(
        hexNum, lineNum, claudeAnalysis.surfaceAnalysis
      );
      likelihood *= Math.pow(keywordLikelihood, evidenceWeights.keyword || 0.3);
    }
    
    // 感情マッチの尤度
    if (claudeAnalysis && claudeAnalysis.emotionAnalysis) {
      const emotionLikelihood = this.calculateEmotionLikelihood(
        hexNum, claudeAnalysis.emotionAnalysis
      );
      likelihood *= Math.pow(emotionLikelihood, evidenceWeights.emotion || 0.25);
    }
    
    // 文脈マッチの尤度
    if (contextualAnalysis) {
      const contextLikelihood = this.calculateContextLikelihood(
        hexNum, lineNum, contextualAnalysis
      );
      likelihood *= Math.pow(contextLikelihood, evidenceWeights.context || 0.2);
    }
    
    // 事後確率 = 事前確率 × 尤度
    const posterior = prior * likelihood;
    
    return {
      probability: posterior,
      prior: prior,
      likelihood: likelihood,
      evidence_weights: evidenceWeights
    };
  }

  /**
   * 学習システムの初期化
   * 
   * 目的：
   * - 継続学習機能の準備
   * - フィードバック機構の構築
   * - 性能改善の自動化
   */
  async initializeLearningSystem() {
    // 学習データの読み込み（既存データがある場合）
    const savedLearningData = localStorage.getItem('contextual_mapping_learning_data');
    if (savedLearningData) {
      try {
        const parsedData = JSON.parse(savedLearningData);
        this.learningData = { ...this.learningData, ...parsedData };
        console.log('✓ 既存学習データを読み込みました');
      } catch (error) {
        console.warn('学習データの読み込みに失敗:', error);
      }
    }
    
    // 学習履歴の初期化
    if (!this.learningData.patterns.confidence_history.length) {
      this.learningData.patterns.confidence_history = [];
    }
    
    console.log('✓ 学習システム初期化完了');
  }

  /**
   * ベイジアンマップの構築
   * 
   * 目的：
   * - 統計的マッピングモデルの構築
   * - 事前分布の最適化
   * - 相関関係の学習
   */
  async buildBayesianMaps() {
    // H384データからの統計情報抽出
    if (typeof H384_DATA !== 'undefined' && H384_DATA.length > 0) {
      this.extractStatisticsFromH384Data();
      console.log('✓ H384データから統計情報を抽出');
    }
    
    // 既存マッピング履歴からの学習
    if (this.mappingHistory.size > 0) {
      this.updateBayesianMapsFromHistory();
      console.log('✓ 履歴データからベイジアンマップを更新');
    }
  }

  /**
   * H384データからの統計抽出
   */
  extractStatisticsFromH384Data() {
    const hexagramCounts = new Map();
    const emotionPatterns = new Map();
    
    H384_DATA.forEach(entry => {
      const hexNum = entry['卦番号'];
      const keywords = entry['キーワード'] || [];
      const interpretation = entry['現代解釈の要約'] || '';
      
      // 卦の出現頻度
      hexagramCounts.set(hexNum, (hexagramCounts.get(hexNum) || 0) + 1);
      
      // 感情パターンの抽出
      const detectedEmotions = this.detectEmotionsInText(interpretation);
      detectedEmotions.forEach(emotion => {
        if (!emotionPatterns.has(emotion)) {
          emotionPatterns.set(emotion, new Map());
        }
        const emotionHexMap = emotionPatterns.get(emotion);
        emotionHexMap.set(hexNum, (emotionHexMap.get(hexNum) || 0) + 1);
      });
    });
    
    // 事前確率の更新
    const total = H384_DATA.length;
    hexagramCounts.forEach((count, hexNum) => {
      this.bayesianMaps.priors.hexagram_frequency.set(hexNum, count / total);
    });
    
    // 感情-卦相関の更新
    emotionPatterns.forEach((hexMap, emotion) => {
      const sortedCorrelations = Array.from(hexMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([hex, count]) => [hex, count / total]);
      
      this.bayesianMaps.priors.emotion_hexagram_correlation.set(
        emotion, 
        new Map(sortedCorrelations)
      );
    });
  }

  /**
   * 統計情報の取得
   * 
   * 目的：
   * - システム性能の監視
   * - 改善効果の測定
   * - 品質管理情報の提供
   */
  getMappingStatistics() {
    return {
      ...this.mappingStats,
      successRate: this.mappingStats.successfulMappings / (this.mappingStats.totalMappings || 1),
      specialYaoDetectionRate: this.mappingStats.specialYaoDetections / (this.mappingStats.totalMappings || 1),
      learningProgress: this.mappingStats.learningIterations,
      historySize: this.mappingHistory.size
    };
  }

  // ===== ユーティリティメソッド =====

  /**
   * 統計更新
   */
  updateMappingStats(mappingResult) {
    this.mappingStats.totalMappings++;
    
    if (mappingResult.confidence >= this.confidenceThresholds.basic.good_quality) {
      this.mappingStats.successfulMappings++;
    }
    
    if (mappingResult.primaryResult?.isSpecialYao) {
      this.mappingStats.specialYaoDetections++;
    }
    
    // 平均信頼度の更新
    const totalConf = this.mappingStats.averageConfidence * (this.mappingStats.totalMappings - 1);
    this.mappingStats.averageConfidence = (totalConf + mappingResult.confidence) / this.mappingStats.totalMappings;
    
    // 平均処理時間の更新
    const totalTime = this.mappingStats.averageProcessingTime * (this.mappingStats.totalMappings - 1);
    this.mappingStats.averageProcessingTime = (totalTime + mappingResult.processingTime) / this.mappingStats.totalMappings;
  }

  /**
   * エラー結果の生成
   */
  generateErrorMappingResult(userInput, error) {
    return {
      input: userInput,
      error: true,
      errorMessage: error.message,
      timestamp: new Date().toISOString(),
      candidates: [{
        hexagram: 4, // 蒙（無知・学び）
        line: 1,
        probability: 0.3,
        confidence: 0.3,
        reasoning: ['システムエラーによるフォールバック'],
        sources: ['error_fallback'],
        isSpecialYao: false
      }],
      primaryResult: {
        hexagram: 4,
        line: 1,
        confidence: 0.3,
        compositeScore: 0.3
      },
      confidence: 0.3,
      reasoning: ['分析エラーのため基本結果を返しました'],
      warnings: ['システムエラーが発生しました']
    };
  }

  /**
   * テキストから感情検出
   */
  detectEmotionsInText(text) {
    const emotions = [];
    const emotionPatterns = {
      anxiety: /不安|心配|気がかり|どうしよう/,
      hope: /希望|期待|楽しみ|きっと/,
      frustration: /イライラ|ムカつく|もどかしい/,
      determination: /頑張|決意|覚悟|やる気/,
      confusion: /迷|悩|分からない|混乱/,
      sadness: /悲し|辛い|落ち込|寂し/
    };
    
    Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
      if (pattern.test(text)) {
        emotions.push(emotion);
      }
    });
    
    return emotions;
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.ContextualMappingSystem = ContextualMappingSystem;
}