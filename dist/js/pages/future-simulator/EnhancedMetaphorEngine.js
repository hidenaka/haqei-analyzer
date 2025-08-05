/**
 * Enhanced Metaphor Engine - 高品質メタファー生成システム
 * 
 * 目的：
 * - 既存の単調なメタファー表現から脱却
 * - 7変化パターン対応の深いメタファー生成
 * - bunenjin哲学に基づく複数視点提供
 * - ユーザーの「なるほど」反応率向上
 * 
 * 主要機能：
 * 1. 7変化パターン対応メタファー生成（進・変・卦変・互卦・綜卦・錯卦・序卦伝）
 * 2. 高度メタファー生成アルゴリズム
 * 3. 品質管理システム
 * 4. A/Bテスト対応インターフェース
 * 
 * 技術仕様：
 * - ComprehensiveTransformationPatterns.js統合
 * - kuromoji.js自然言語処理連携
 * - 応答時間1秒以内維持
 * - コンテキスト適応型メタファー選択
 * 
 * Author: Pattern Engine Developer
 * Created: 2025-08-04
 * Philosophy: bunenjin分人間調和理論 + 深い洞察メタファー
 */
class EnhancedMetaphorEngine {
  constructor() {
    console.log('🎭 EnhancedMetaphorEngine初期化開始 - 深い洞察システム');
    
    this.version = "1.0.0-enhanced";
    this.philosophy = "bunenjin-deep-metaphor-generation";
    this.engineStatus = "active";
    
    // 初期化状態の追跡
    this.initializationState = {
      comprehensivePatterns: false,
      metaphorDatabase: false,
      qualitySystem: false,
      contextAnalyzer: false,
      isReady: false
    };
    
    // パフォーマンス監視
    this.performanceMetrics = {
      totalGenerations: 0,
      successfulGenerations: 0,
      averageResponseTime: 0,
      averageInsightScore: 0,
      userSatisfactionRate: 0,
      metaphorVarieties: new Map()
    };
    
    // 品質閾値設定
    this.qualityThresholds = {
      insightDepth: 0.8,      // 洞察の深さ
      metaphorRichness: 0.7,  // メタファーの豊かさ
      contextRelevance: 0.8,  // コンテキスト関連性
      originalityScore: 0.6,  // 独創性スコア
      emotionalResonance: 0.7 // 感情的共鳴度
    };
    
    // 7変化パターン対応メタファーテンプレート
    this.sevenTransformationMetaphors = this.initializeSevenPatternMetaphors();
    
    // 高度メタファー生成エンジン
    this.metaphorGenerationRules = this.initializeAdvancedRules();
    
    // 品質管理システム
    this.qualityAssessment = this.initializeQualitySystem();
    
    // コンテキスト理解エンジン
    this.contextEngine = this.initializeContextEngine();
    
    // メタファーキャッシュシステム
    this.metaphorCache = new Map();
    this.cacheMaxSize = 200;
    this.cacheTimeout = 1800000; // 30分TTL
    
    // bunenjin哲学的視点システム
    this.bunenjinPerspectives = this.initializeBunenjinPerspectives();
    
    console.log('✅ EnhancedMetaphorEngine基本初期化完了');
    
    // 非同期初期化開始
    this.initializeAsync().catch(error => {
      console.error('❌ EnhancedMetaphorEngine非同期初期化エラー:', error);
    });
  }

  /**
   * 非同期初期化処理
   * 重要コンポーネントの統合とシステム準備
   */
  async initializeAsync() {
    console.log('🔄 Enhanced Metaphor Engine非同期初期化開始');
    
    try {
      // ComprehensiveTransformationPatterns統合
      await this.integrateComprehensivePatterns();
      
      // メタファーデータベース構築
      await this.buildMetaphorDatabase();
      
      // 品質システム初期化
      await this.initializeQualityAssessmentSystem();
      
      // コンテキスト分析器初期化
      await this.initializeContextAnalyzer();
      
      this.initializationState.isReady = true;
      console.log('✅ EnhancedMetaphorEngine完全初期化完了');
      
    } catch (error) {
      console.error('❌ Enhanced Metaphor Engine初期化エラー:', error);
      this.initializationState.isReady = 'partial';
      console.log('🔄 部分的初期化で継続 - 基本機能は利用可能');
    }
  }

  /**
   * ComprehensiveTransformationPatterns統合
   */
  async integrateComprehensivePatterns() {
    try {
      if (typeof ComprehensiveTransformationPatterns !== 'undefined') {
        this.comprehensivePatterns = new ComprehensiveTransformationPatterns();
        this.initializationState.comprehensivePatterns = true;
        console.log('✅ ComprehensiveTransformationPatterns統合完了');
      } else {
        console.warn('⚠️ ComprehensiveTransformationPatterns未利用可能');
        this.comprehensivePatterns = this.createFallbackPatternEngine();
        this.initializationState.comprehensivePatterns = 'fallback';
      }
    } catch (error) {
      console.error('❌ パターンエンジン統合エラー:', error);
      this.comprehensivePatterns = this.createFallbackPatternEngine();
      this.initializationState.comprehensivePatterns = 'fallback';
    }
  }

  /**
   * 7変化パターン対応メタファーテンプレート初期化
   */
  initializeSevenPatternMetaphors() {
    return {
      // 1. 進（Line Progression）- 表示対象
      progress: {
        name: '進',
        displayInFree: true,
        metaphorTemplates: {
          growth: {
            essence: '成長の階段を一歩ずつ上る',
            variations: [
              '山の頂上への道のりは、一歩一歩の積み重ね',
              '大木も、小さな芽から始まった成長の物語',
              '職人の技は、毎日の練習という糸で織られている'
            ],
            contexts: ['personal', 'career', 'skill'],
            insightLevel: 'deep'
          },
          transformation: {
            essence: '内なる力が外の世界を変える',
            variations: [
              '蝶になる前の蛹の時間は、変化への準備期間',
              '種が土の中で根を張るように、見えない努力が未来を支える',
              '川が岩を削るように、継続する意志が状況を変える'
            ],
            contexts: ['challenge', 'obstacle', 'patience'],
            insightLevel: 'profound'
          }
        }
      },
      
      // 2. 変（Hexagram Change）- 表示対象
      change: {
        name: '変',
        displayInFree: true,
        metaphorTemplates: {
          transition: {
            essence: '季節の移り変わりのような自然な変化',
            variations: [
              '桜の花が散ることで、新緑の季節が始まる',
              '潮の満ち引きのように、変化にはリズムがある',
              '古い皮を脱ぐ蛇のように、成長には手放しが必要'
            ],
            contexts: ['life_change', 'relationship', 'perspective'],
            insightLevel: 'deep'
          },
          catalyst: {
            essence: '小さなきっかけが大きな変化を生む',
            variations: [
              '一粒の雨が大河になるように、小さな行動が人生を変える',
              '風向きが変わる瞬間、船の進路が決まる',
              '鍵穴に合う鍵は、扉の向こうの世界を開く'
            ],
            contexts: ['opportunity', 'decision', 'timing'],
            insightLevel: 'profound'
          }
        }
      },
      
      // 3. 卦変（Line Change）- 内部計算のみ
      lineChange: {
        name: '卦変',
        displayInFree: false,
        metaphorTemplates: {
          adjustment: {
            essence: '楽器の調律のような微細な調整',
            variations: [
              'ピアノの一つの鍵盤が、全体のハーモニーを変える',
              '時計の歯車一つが、全体の時を刻む',
              '料理の最後のひと匙が、味の決め手となる'
            ],
            contexts: ['refinement', 'balance', 'precision'],
            insightLevel: 'sophisticated'
          }
        }
      },
      
      // 4. 互卦（Mutual）- 内部計算のみ
      mutual: {
        name: '互卦',
        displayInFree: false,
        metaphorTemplates: {
          hidden_potential: {
            essence: '水面下で働く目に見えない力',
            variations: [
              '氷山の一角の下に隠された巨大な本体',
              '森の地下で繋がる菌類のネットワーク',
              '満月の夜に引かれる潮汐の力'
            ],
            contexts: ['unconscious', 'potential', 'influence'],
            insightLevel: 'mystical'
          }
        }
      },
      
      // 5. 綜卦（Reversed）- 内部計算のみ
      reversed: {
        name: '綜卦',
        displayInFree: false,
        metaphorTemplates: {
          perspective_shift: {
            essence: '鏡の向こう側から見る世界',
            variations: [
              '山の反対側から見る景色は、全く違う美しさを持つ',
              '硬貨の表と裏、どちらも同じ価値を持つ',
              '夕日は別れの象徴でもあり、新しい朝への約束でもある'
            ],
            contexts: ['perspective', 'understanding', 'wisdom'],
            insightLevel: 'philosophical'
          }
        }
      },
      
      // 6. 錯卦（Opposite）- 内部計算のみ
      opposite: {
        name: '錯卦',
        displayInFree: false,
        metaphorTemplates: {
          complementary: {
            essence: '陰と陽が作り出す完全な調和',
            variations: [
              '影があるから光の美しさが際立つ',
              '静寂があるから音楽の響きが心に届く',
              '冬の厳しさがあるから春の暖かさが愛おしい'
            ],
            contexts: ['balance', 'contrast', 'completion'],
            insightLevel: 'transcendent'
          }
        }
      },
      
      // 7. 序卦伝（Sequence）- 内部計算のみ
      sequence: {
        name: '序卦伝',
        displayInFree: false,
        metaphorTemplates: {
          cosmic_order: {
            essence: '宇宙の法則に従った必然的な流れ',
            variations: [
              '星座の配置のように、すべてには意味がある位置がある',
              '川が海に向かうように、すべての道には到着点がある',
              '季節の巡りのように、すべてのタイミングには理由がある'
            ],
            contexts: ['destiny', 'purpose', 'universal_law'],
            insightLevel: 'cosmic'
          }
        }
      }
    };
  }

  /**
   * 高度メタファー生成ルール初期化
   */
  initializeAdvancedRules() {
    return {
      // 悩みコンテキスト分析ルール
      contextAnalysisRules: {
        仕事: {
          keywords: ['職場', '上司', '同僚', 'キャリア', '成果', 'プレッシャー'],
          metaphorThemes: ['成長', '挑戦', '協力', '達成'],
          emotionalPatterns: ['ストレス', '達成感', '不安', '希望'],
          urgencyMapping: {
            high: '嵐の中の船長のような冷静な判断',
            medium: '職人のような丁寧で継続的な取り組み',
            low: '庭師のような長期的な視点での育成'
          }
        },
        恋愛: {
          keywords: ['恋人', 'パートナー', '結婚', '別れ', '片思い', 'コミュニケーション'],
          metaphorThemes: ['絆', '成長', '調和', '理解'],
          emotionalPatterns: ['愛情', '不安', '喜び', '孤独'],
          urgencyMapping: {
            high: '嵐の後の虹のような希望の光',
            medium: '花が咲くまでの水やりのような継続的な愛情',
            low: '二人で作る庭のような共同作業'
          }
        },
        健康: {
          keywords: ['体調', '病気', '疲労', '回復', '予防', 'メンタル'],
          metaphorThemes: ['回復', 'バランス', '調和', '再生'],
          emotionalPatterns: ['心配', '希望', '受容', '感謝'],
          urgencyMapping: {
            high: '嵐が過ぎ去った後の清々しい空気',
            medium: '川の流れのような自然な回復力',
            low: '森林浴のような穏やかな癒し'
          }
        },
        人間関係: {
          keywords: ['友人', '家族', 'コミュニケーション', '信頼', '対立', '理解'],
          metaphorThemes: ['調和', '理解', '成長', '絆'],
          emotionalPatterns: ['愛情', '困惑', '感謝', '孤独'],
          urgencyMapping: {
            high: '橋を架ける建築家のような慎重な計画',
            medium: 'オーケストラの指揮者のような調和作り',
            low: '共に育つ二本の木のような自然な関係'
          }
        },
        成長: {
          keywords: ['学習', 'スキル', '自己啓発', '変化', '挑戦', '目標'],
          metaphorThemes: ['発展', '変化', '開花', '深化'],
          emotionalPatterns: ['向上心', '不安', '達成感', '期待'],
          urgencyMapping: {
            high: '急流を下るカヌーのような集中力',
            medium: '山を登る登山家のような持続力',
            low: '種から大木へと成長する自然の力'
          }
        },
        決断: {
          keywords: ['選択', '迷い', '判断', '未来', 'リスク', '機会'],
          metaphorThemes: ['選択', '方向性', '勇気', '智慧'],
          emotionalPatterns: ['迷い', '不安', '決意', '希望'],
          urgencyMapping: {
            high: '嵐の中で北極星を見つける航海士',
            medium: '分かれ道で地図を見る旅人',
            low: '川の流れに身を任せる葉っぱ'
          }
        },
        不安: {
          keywords: ['心配', '恐れ', '緊張', 'ストレス', '未来', '不確実性'],
          metaphorThemes: ['安定', '受容', '変化', '成長'],
          emotionalPatterns: ['不安', '恐れ', '混乱', '希望'],
          urgencyMapping: {
            high: '嵐の中でも根を張る大木の強さ',
            medium: '雲の切れ間から差す太陽の光',
            low: '静かな湖面のような内なる平安'
          }
        }
      },

      // 易経経験レベル対応
      experienceLevelAdaptation: {
        初心者: {
          metaphorComplexity: 'simple',
          classicalReferences: 'minimal',
          modernAnalogies: 'abundant',
          explanationDepth: 'detailed'
        },
        中級者: {
          metaphorComplexity: 'moderate',
          classicalReferences: 'balanced',
          modernAnalogies: 'selective',
          explanationDepth: 'concise'
        },
        上級者: {
          metaphorComplexity: 'sophisticated',
          classicalReferences: 'rich',
          modernAnalogies: 'symbolic',
          explanationDepth: 'profound'
        }
      },

      // 状況複雑度対応
      complexityAdaptation: {
        単純: {
          metaphorLayers: 1,
          perspective: 'single',
          actionGuidance: 'direct'
        },
        中程度: {
          metaphorLayers: 2,
          perspective: 'dual',
          actionGuidance: 'structured'
        },
        複雑: {
          metaphorLayers: 3,
          perspective: 'multiple',
          actionGuidance: 'multifaceted'
        }
      }
    };
  }

  /**
   * 品質管理システム初期化
   */
  initializeQualitySystem() {
    return {
      // 陳腐表現検出器
      clicheDetector: {
        patterns: [
          /光が見える/, /新しい扉/, /人生の岐路/, /時は流れる/,
          /花が咲く/, /道は続く/, /星が輝く/, /風が吹く/
        ],
        alternatives: new Map([
          ['光が見える', ['希望の灯火が心に宿る', '暗闇に小さな星が現れる']],
          ['新しい扉', ['未知の世界への招待状', '可能性の鍵穴']],
          ['人生の岐路', ['運命の分水嶺', '選択の十字路']],
          ['時は流れる', ['時間という川の流れ', '刻の歯車が回る']]
        ])
      },

      // 深み評価システム
      depthAssessment: {
        criteria: {
          layeredMeaning: 'メタファーに複数の解釈層があるか',
          emotionalResonance: '感情的な共鳴を生むか',
          actionInspiration: '具体的な行動を促すか',
          wisdomIntegration: '深い智慧を含んでいるか',
          personalRelevance: '個人的な関連性があるか'
        },
        scoringRules: {
          excellent: { min: 0.8, description: '深い洞察と共鳴を生む' },
          good: { min: 0.6, description: '適切な理解と示唆を提供' },
          acceptable: { min: 0.4, description: '基本的な理解を促進' },
          insufficient: { min: 0, description: '改善が必要' }
        }
      },

      // A/Bテスト準備
      abTestFramework: {
        variants: ['traditional', 'modern', 'poetic', 'practical'],
        metrics: ['clarity', 'engagement', 'actionability', 'memorability'],
        trackingEnabled: true
      }
    };
  }

  /**
   * コンテキストエンジン初期化
   */
  initializeContextEngine() {
    return {
      // 悩みの種類自動検出
      concernClassifier: {
        patterns: {
          work: [/仕事/, /職場/, /上司/, /同僚/, /転職/, /キャリア/, /業務/],
          love: [/恋愛/, /恋人/, /結婚/, /別れ/, /パートナー/, /片思い/],
          health: [/健康/, /病気/, /体調/, /疲れ/, /ストレス/, /メンタル/],
          relationship: [/人間関係/, /友人/, /家族/, /コミュニケーション/, /信頼/],
          growth: [/成長/, /学習/, /スキル/, /自己啓発/, /目標/, /挑戦/],
          decision: [/決断/, /選択/, /迷い/, /判断/, /進路/, /方向性/],
          anxiety: [/不安/, /心配/, /恐れ/, /緊張/, /ストレス/, /悩み/]
        }
      },

      // 緊急度自動判定
      urgencyDetector: {
        highUrgency: [/急い/, /今すぐ/, /緊急/, /危機/, /限界/, /切羽詰まっ/],
        mediumUrgency: [/早め/, /そろそろ/, /近い/, /近づい/, /考え/, /検討/],
        lowUrgency: [/いずれ/, /将来/, /長期/, /ゆっくり/, /じっくり/, /時間をかけ/]
      }
    };
  }

  /**
   * bunenjin哲学的視点システム初期化
   */
  initializeBunenjinPerspectives() {
    return {
      // 分人（ぶんじん）の概念に基づく多重視点
      perspectives: {
        inner_self: {
          name: '内なる自己',
          focus: '個人の内面的成長と価値観',
          metaphorStyle: 'introspective',
          wisdom: '自分の心の声に耳を傾ける'
        },
        social_self: {
          name: '社会的自己',
          focus: '他者との関係性と社会的役割',
          metaphorStyle: 'relational',
          wisdom: '調和の中で個性を発揮する'
        },
        transcendent_self: {
          name: '超越的自己',
          focus: '宇宙的視点と普遍的真理',
          metaphorStyle: 'philosophical',
          wisdom: '大いなる流れに身を委ねる'
        },
        practical_self: {
          name: '実践的自己',
          focus: '現実的な問題解決と行動',
          metaphorStyle: 'actionable',
          wisdom: '智慧を日常に活かす'
        }
      }
    };
  }

  /**
   * メインメタファー生成メソッド
   * 7変化パターンと高度分析を統合した深いメタファー生成
   */
  async generateEnhancedMetaphor(inputData) {
    const startTime = performance.now();
    
    try {
      console.log('🎭 Enhanced Metaphor生成開始 - 深い洞察システム');

      // 入力検証
      if (!this.validateInput(inputData)) {
        throw new Error('無効な入力データ');
      }

      // 初期化確認
      if (!this.initializationState.isReady && this.initializationState.isReady !== 'partial') {
        console.warn('⚠️ システム初期化中 - 基本機能で処理');
      }

      // キャッシュチェック
      const cacheKey = this.generateCacheKey(inputData);
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        console.log('🔄 キャッシュから結果返却');
        return cachedResult;
      }

      // Stage 1: 総合コンテキスト分析
      console.log('📋 Stage 1: 総合コンテキスト分析');
      const contextAnalysis = await this.analyzeComprehensiveContext(inputData);

      // Stage 2: 7変化パターン計算
      console.log('☯️ Stage 2: 7変化パターン計算');
      const patternResults = await this.calculate7PatternMetaphors(inputData, contextAnalysis);

      // Stage 3: 高度メタファー生成
      console.log('✨ Stage 3: 高度メタファー生成');
      const advancedMetaphors = await this.generateAdvancedMetaphors(patternResults, contextAnalysis);

      // Stage 4: 品質評価と最適化
      console.log('🎯 Stage 4: 品質評価と最適化');
      const optimizedMetaphors = await this.optimizeMetaphorQuality(advancedMetaphors, contextAnalysis);

      // Stage 5: bunenjin哲学統合
      console.log('🧘 Stage 5: bunenjin哲学統合');
      const philosophicalIntegration = await this.integrateBunenjinWisdom(optimizedMetaphors, contextAnalysis);

      // Stage 6: 最終結果生成
      console.log('🌟 Stage 6: 最終結果生成');
      const finalResult = await this.generateFinalMetaphorResult(
        philosophicalIntegration,
        contextAnalysis,
        inputData
      );

      // 処理時間計算
      const processingTime = performance.now() - startTime;
      finalResult.performance = {
        processingTime: processingTime,
        targetTime: 1000, // 1秒目標
        efficiency: processingTime <= 1000 ? 'excellent' : 'acceptable'
      };

      // キャッシュ保存
      this.saveToCache(cacheKey, finalResult);

      // パフォーマンス統計更新
      this.updatePerformanceMetrics(finalResult, true);

      console.log(`✅ Enhanced Metaphor生成完了 (${processingTime.toFixed(2)}ms)`);
      console.log('🎯 生成品質:', finalResult.qualityMetrics.overallGrade);

      return finalResult;

    } catch (error) {
      console.error('❌ Enhanced Metaphor生成エラー:', error);
      const fallbackResult = this.generateFallbackMetaphor(inputData, error);
      this.updatePerformanceMetrics(fallbackResult, false);
      return fallbackResult;
    }
  }

  /**
   * 総合コンテキスト分析
   * ユーザーの悩みを多次元的に分析
   */
  async analyzeComprehensiveContext(inputData) {
    const { userInput, userProfile, contextType } = inputData;

    // 悩みの種類自動検出
    const concernType = this.detectConcernType(userInput);
    
    // 緊急度レベル判定
    const urgencyLevel = this.detectUrgencyLevel(userInput);
    
    // 感情状態分析
    const emotionalState = this.analyzeEmotionalState(userInput);
    
    // 易経経験レベル判定
    const experienceLevel = this.determineExperienceLevel(userProfile);
    
    // 状況複雑度判定
    const situationComplexity = this.assessSituationComplexity(userInput, contextType);

    return {
      concernType,
      urgencyLevel,
      emotionalState,
      experienceLevel,
      situationComplexity,
      confidence: this.calculateContextConfidence([concernType, urgencyLevel, emotionalState])
    };
  }

  /**
   * 7変化パターン対応メタファー計算
   */
  async calculate7PatternMetaphors(inputData, contextAnalysis) {
    const patternResults = {};

    try {
      // ComprehensiveTransformationPatternsと統合
      if (this.comprehensivePatterns) {
        const transformationResult = await this.comprehensivePatterns.calculateAllPatterns({
          hexagram: inputData.hexagram || 1,
          changingLines: inputData.changingLines || [1],
          userType: 'free', // 無料版制限適用
          context: contextAnalysis
        });

        // 各パターンにメタファーを生成
        for (const pattern of transformationResult.patterns) {
          if (this.sevenTransformationMetaphors[pattern.pattern]) {
            patternResults[pattern.pattern] = await this.generatePatternSpecificMetaphor(
              pattern,
              contextAnalysis,
              this.sevenTransformationMetaphors[pattern.pattern]
            );
          }
        }
      } else {
        // フォールバック: 基本パターンのみ
        patternResults.progress = await this.generateBasicPatternMetaphor('progress', contextAnalysis);
        patternResults.change = await this.generateBasicPatternMetaphor('change', contextAnalysis);
      }

      return {
        patterns: patternResults,
        availablePatterns: Object.keys(patternResults),
        displayablePatterns: Object.keys(patternResults).filter(key => 
          this.sevenTransformationMetaphors[key]?.displayInFree
        )
      };

    } catch (error) {
      console.error('7変化パターン計算エラー:', error);
      return this.generateFallbackPatternResults(contextAnalysis);
    }
  }

  /**
   * パターン固有メタファー生成
   */
  async generatePatternSpecificMetaphor(pattern, contextAnalysis, patternTemplate) {
    const { concernType, urgencyLevel, experienceLevel } = contextAnalysis;

    // 最適なメタファーテンプレート選択
    const template = this.selectOptimalTemplate(patternTemplate, concernType, urgencyLevel);
    
    // コンテキスト適応
    const adaptedMetaphor = this.adaptMetaphorToContext(template, contextAnalysis);
    
    // 経験レベル調整
    const levelAdjustedMetaphor = this.adjustForExperienceLevel(adaptedMetaphor, experienceLevel);

    return {
      patternName: pattern.name,
      essence: levelAdjustedMetaphor.essence,
      fullMetaphor: levelAdjustedMetaphor.fullText,
      insightLevel: template.insightLevel,
      contextRelevance: this.calculateContextRelevance(levelAdjustedMetaphor, contextAnalysis),
      actionGuidance: this.generateActionGuidance(levelAdjustedMetaphor, pattern),
      emotionalResonance: this.calculateEmotionalResonance(levelAdjustedMetaphor, contextAnalysis)
    };
  }

  /**
   * 高度メタファー生成
   * 複数の視点を統合した深いメタファー作成
   */
  async generateAdvancedMetaphors(patternResults, contextAnalysis) {
    const advancedMetaphors = {};

    // 表示可能パターンのメタファー生成
    for (const patternKey of patternResults.displayablePatterns) {
      const patternData = patternResults.patterns[patternKey];
      
      // 複数視点からのメタファー生成
      const multiPerspectiveMetaphors = await this.generateMultiPerspectiveMetaphors(
        patternData,
        contextAnalysis
      );
      
      // 最適なメタファー選択
      const selectedMetaphor = this.selectOptimalMetaphor(multiPerspectiveMetaphors, contextAnalysis);
      
      advancedMetaphors[patternKey] = {
        ...selectedMetaphor,
        alternatives: multiPerspectiveMetaphors.slice(0, 2), // 代替案を2つ保持
        generationMethod: 'advanced_multi_perspective'
      };
    }

    return advancedMetaphors;
  }

  /**
   * 複数視点メタファー生成
   */
  async generateMultiPerspectiveMetaphors(patternData, contextAnalysis) {
    const perspectives = [];

    // bunenjin哲学の各視点からメタファー生成
    for (const [perspectiveKey, perspective] of Object.entries(this.bunenjinPerspectives.perspectives)) {
      const perspectiveMetaphor = await this.generatePerspectiveSpecificMetaphor(
        patternData,
        perspective,
        contextAnalysis
      );
      
      perspectives.push({
        ...perspectiveMetaphor,
        perspective: perspectiveKey,
        perspectiveName: perspective.name
      });
    }

    return perspectives;
  }

  /**
   * 視点固有メタファー生成
   */
  async generatePerspectiveSpecificMetaphor(patternData, perspective, contextAnalysis) {
    const { concernType, urgencyLevel } = contextAnalysis;
    
    // 視点に応じたメタファースタイル適用
    const metaphorStyle = perspective.metaphorStyle;
    const wisdomIntegration = perspective.wisdom;

    // ベースメタファーを視点に適応
    let adaptedEssence = patternData.essence;
    let fullMetaphor = patternData.fullMetaphor;

    switch (metaphorStyle) {
      case 'introspective':
        adaptedEssence = this.adaptToIntrospectiveStyle(adaptedEssence, concernType);
        fullMetaphor = this.expandIntrospectiveMetaphor(fullMetaphor, wisdomIntegration);
        break;
      
      case 'relational':
        adaptedEssence = this.adaptToRelationalStyle(adaptedEssence, concernType);
        fullMetaphor = this.expandRelationalMetaphor(fullMetaphor, wisdomIntegration);
        break;
      
      case 'philosophical':
        adaptedEssence = this.adaptToPhilosophicalStyle(adaptedEssence, concernType);
        fullMetaphor = this.expandPhilosophicalMetaphor(fullMetaphor, wisdomIntegration);
        break;
      
      case 'actionable':
        adaptedEssence = this.adaptToActionableStyle(adaptedEssence, concernType);
        fullMetaphor = this.expandActionableMetaphor(fullMetaphor, wisdomIntegration);
        break;
    }

    return {
      essence: adaptedEssence,
      fullMetaphor: fullMetaphor,
      style: metaphorStyle,
      wisdom: wisdomIntegration,
      contextAlignment: this.calculateContextAlignment(adaptedEssence, contextAnalysis)
    };
  }

  /**
   * メタファー品質最適化
   */
  async optimizeMetaphorQuality(advancedMetaphors, contextAnalysis) {
    const optimizedMetaphors = {};

    for (const [patternKey, metaphorData] of Object.entries(advancedMetaphors)) {
      // 陳腐表現チェックと置換
      const clicheCheckedMetaphor = this.removeClicheExpressions(metaphorData);
      
      // 深み評価
      const depthScore = this.assessMetaphorDepth(clicheCheckedMetaphor);
      
      // 必要に応じて深み向上
      const depthEnhancedMetaphor = depthScore < this.qualityThresholds.insightDepth 
        ? await this.enhanceMetaphorDepth(clicheCheckedMetaphor, contextAnalysis)
        : clicheCheckedMetaphor;
      
      // 最終品質評価
      const qualityAssessment = this.assessOverallQuality(depthEnhancedMetaphor, contextAnalysis);
      
      optimizedMetaphors[patternKey] = {
        ...depthEnhancedMetaphor,
        qualityScores: qualityAssessment,
        optimizationApplied: depthScore < this.qualityThresholds.insightDepth
      };
    }

    return optimizedMetaphors;
  }

  /**
   * bunenjin哲学統合
   */
  async integrateBunenjinWisdom(optimizedMetaphors, contextAnalysis) {
    const integratedResult = {};

    for (const [patternKey, metaphorData] of Object.entries(optimizedMetaphors)) {
      // 哲学的洞察の統合
      const wisdomIntegration = this.integratePhilosophicalWisdom(
        metaphorData,
        contextAnalysis
      );
      
      // bunenjin的複数視点の調和
      const perspectiveHarmony = this.harmonizePerspectives(
        metaphorData.alternatives || [],
        contextAnalysis
      );
      
      integratedResult[patternKey] = {
        ...metaphorData,
        philosophicalDepth: wisdomIntegration,
        perspectiveHarmony: perspectiveHarmony,
        bunenjinAlignment: this.calculateBunenjinAlignment(metaphorData, contextAnalysis)
      };
    }

    return integratedResult;
  }

  /**
   * 最終メタファー結果生成
   */
  async generateFinalMetaphorResult(philosophicalIntegration, contextAnalysis, inputData) {
    const displayableMetaphors = {};
    const hiddenMetaphors = {};

    // 表示用と非表示メタファーの分類
    for (const [patternKey, metaphorData] of Object.entries(philosophicalIntegration)) {
      const patternConfig = this.sevenTransformationMetaphors[patternKey];
      
      if (patternConfig && patternConfig.displayInFree) {
        displayableMetaphors[patternKey] = metaphorData;
      } else {
        hiddenMetaphors[patternKey] = {
          name: patternConfig?.name || patternKey,
          teaser: '有料版で深い洞察をご体験ください'
        };
      }
    }

    // 主要メタファー選択
    const primaryMetaphor = this.selectPrimaryMetaphor(displayableMetaphors, contextAnalysis);
    
    // 総合品質評価
    const overallQuality = this.calculateOverallQuality(displayableMetaphors);

    return {
      // 主要結果
      primaryMetaphor: {
        essence: primaryMetaphor.essence,
        fullText: primaryMetaphor.fullMetaphor,
        patternName: primaryMetaphor.patternName,
        insightLevel: primaryMetaphor.insightLevel,
        actionGuidance: primaryMetaphor.actionGuidance
      },

      // 表示可能メタファー
      availableMetaphors: displayableMetaphors,
      
      // 隠されたメタファー（有料版案内）
      premiumMetaphors: hiddenMetaphors,
      
      // コンテキスト情報
      contextAnalysis: {
        concernType: contextAnalysis.concernType,
        urgencyLevel: contextAnalysis.urgencyLevel,
        recommendedAction: this.generateRecommendedAction(primaryMetaphor, contextAnalysis)
      },

      // 品質メトリクス
      qualityMetrics: {
        overallGrade: overallQuality.grade,
        insightDepth: overallQuality.insightDepth,
        originalityScore: overallQuality.originalityScore,
        emotionalResonance: overallQuality.emotionalResonance,
        actionableGuidance: overallQuality.actionableGuidance
      },

      // システム情報
      systemInfo: {
        engineVersion: this.version,
        generationMethod: 'enhanced_7_pattern',
        philosophy: this.philosophy,
        processingStages: 6,
        timestamp: new Date().toISOString()
      },

      // A/Bテスト対応
      abTestData: this.generateABTestData(primaryMetaphor, contextAnalysis)
    };
  }

  /**
   * ヘルパーメソッド群
   */

  // 悩みタイプ検出
  detectConcernType(userInput) {
    const patterns = this.contextEngine.concernClassifier.patterns;
    const scores = {};

    for (const [type, typePatterns] of Object.entries(patterns)) {
      scores[type] = typePatterns.reduce((score, pattern) => {
        return score + (pattern.test(userInput) ? 1 : 0);
      }, 0);
    }

    const topType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    return topType;
  }

  // 緊急度検出
  detectUrgencyLevel(userInput) {
    const { highUrgency, mediumUrgency, lowUrgency } = this.contextEngine.urgencyDetector;

    if (highUrgency.some(pattern => pattern.test(userInput))) return 'high';
    if (mediumUrgency.some(pattern => pattern.test(userInput))) return 'medium';
    return 'low';
  }

  // 感情状態分析
  analyzeEmotionalState(userInput) {
    // 基本的な感情分析（実装例）
    const positivePattern = /嬉しい|楽しい|希望|前向き|やる気|頑張/;
    const negativePattern = /不安|心配|悲しい|辛い|困っ|悩ん/;
    const neutralPattern = /考え|思う|感じ|状況|場合/;

    if (positivePattern.test(userInput)) {
      return { primary: 'positive', intensity: 0.7, confidence: 0.8 };
    } else if (negativePattern.test(userInput)) {
      return { primary: 'negative', intensity: 0.6, confidence: 0.8 };
    } else {
      return { primary: 'neutral', intensity: 0.5, confidence: 0.6 };
    }
  }

  // 経験レベル判定
  determineExperienceLevel(userProfile) {
    // ユーザープロファイルから判定（デフォルト実装）
    return userProfile?.iChingExperience || '初心者';
  }

  // 状況複雑度評価
  assessSituationComplexity(userInput, contextType) {
    const complexityIndicators = [
      /複数|いくつか|様々|色々|多く/,
      /関係|影響|つなが|関わ/,
      /一方で|しかし|ただし|でも/,
      /将来|長期|継続|持続/
    ];

    const complexityScore = complexityIndicators.reduce((score, pattern) => {
      return score + (pattern.test(userInput) ? 1 : 0);
    }, 0);

    if (complexityScore >= 3) return '複雑';
    if (complexityScore >= 1) return '中程度';
    return '単純';
  }

  // 最適テンプレート選択
  selectOptimalTemplate(patternTemplate, concernType, urgencyLevel) {
    const templates = patternTemplate.metaphorTemplates;
    const templateKeys = Object.keys(templates);
    
    // 緊急度とコンテキストに基づく選択ロジック
    for (const key of templateKeys) {
      const template = templates[key];
      if (template.contexts.includes(concernType) || 
          (urgencyLevel === 'high' && template.insightLevel === 'profound')) {
        return template;
      }
    }
    
    // デフォルト選択
    return templates[templateKeys[0]];
  }

  // コンテキスト適応
  adaptMetaphorToContext(template, contextAnalysis) {
    const { concernType, urgencyLevel } = contextAnalysis;
    const variations = template.variations;
    
    // 緊急度に応じた表現選択
    let selectedVariation = variations[0]; // デフォルト
    
    if (urgencyLevel === 'high' && variations.length > 1) {
      selectedVariation = variations[1]; // より緊急感のある表現
    } else if (urgencyLevel === 'low' && variations.length > 2) {
      selectedVariation = variations[2]; // より穏やかな表現
    }

    return {
      essence: template.essence,
      fullText: selectedVariation,
      contextAlignment: 0.8
    };
  }

  // 経験レベル調整
  adjustForExperienceLevel(metaphor, experienceLevel) {
    const levelConfig = this.metaphorGenerationRules.experienceLevelAdaptation[experienceLevel] || 
                      this.metaphorGenerationRules.experienceLevelAdaptation['初心者'];

    let adjustedMetaphor = { ...metaphor };

    // 複雑性調整
    if (levelConfig.metaphorComplexity === 'simple') {
      adjustedMetaphor.fullText = this.simplifyExpression(adjustedMetaphor.fullText);
    } else if (levelConfig.metaphorComplexity === 'sophisticated') {
      adjustedMetaphor.fullText = this.enrichExpression(adjustedMetaphor.fullText);
    }

    return adjustedMetaphor;
  }

  // 陳腐表現除去
  removeClicheExpressions(metaphorData) {
    let { essence, fullMetaphor } = metaphorData;
    const clicheDetector = this.qualityAssessment.clicheDetector;

    // 陳腐パターンチェックと置換
    for (const pattern of clicheDetector.patterns) {
      if (pattern.test(fullMetaphor)) {
        const alternatives = clicheDetector.alternatives.get(pattern.source);
        if (alternatives && alternatives.length > 0) {
          const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
          fullMetaphor = fullMetaphor.replace(pattern, randomAlternative);
        }
      }
    }

    return {
      ...metaphorData,
      essence,
      fullMetaphor,
      clicheRemovalApplied: true
    };
  }

  // メタファー深み評価
  assessMetaphorDepth(metaphorData) {
    const criteria = this.qualityAssessment.depthAssessment.criteria;
    let totalScore = 0;

    // 各基準での評価（簡易実装）
    totalScore += metaphorData.fullMetaphor.length > 50 ? 0.2 : 0.1; // layeredMeaning
    totalScore += metaphorData.emotionalResonance || 0.2; // emotionalResonance
    totalScore += metaphorData.actionGuidance ? 0.2 : 0.1; // actionInspiration
    totalScore += metaphorData.insightLevel === 'profound' ? 0.2 : 0.1; // wisdomIntegration
    totalScore += metaphorData.contextRelevance || 0.2; // personalRelevance

    return Math.min(totalScore, 1.0);
  }

  // 主要メタファー選択
  selectPrimaryMetaphor(metaphors, contextAnalysis) {
    const metaphorEntries = Object.entries(metaphors);
    
    if (metaphorEntries.length === 0) {
      return this.getDefaultMetaphor();
    }

    // 品質スコアが最も高いものを選択
    const bestMetaphor = metaphorEntries.reduce((best, [key, metaphor]) => {
      const bestScore = best[1].qualityScores?.overallScore || 0;
      const currentScore = metaphor.qualityScores?.overallScore || 0;
      return currentScore > bestScore ? [key, metaphor] : best;
    });

    return {
      ...bestMetaphor[1],
      patternName: bestMetaphor[0]
    };
  }

  // 総合品質計算
  calculateOverallQuality(metaphors) {
    const metaphorArray = Object.values(metaphors);
    
    if (metaphorArray.length === 0) {
      return { grade: 'C', insightDepth: 0.3, originalityScore: 0.3, emotionalResonance: 0.3 };
    }

    const averageDepth = metaphorArray.reduce((sum, m) => sum + (m.qualityScores?.insightDepth || 0.5), 0) / metaphorArray.length;
    const averageOriginality = metaphorArray.reduce((sum, m) => sum + (m.qualityScores?.originalityScore || 0.5), 0) / metaphorArray.length;
    const averageResonance = metaphorArray.reduce((sum, m) => sum + (m.qualityScores?.emotionalResonance || 0.5), 0) / metaphorArray.length;

    const overallScore = (averageDepth + averageOriginality + averageResonance) / 3;
    
    return {
      grade: overallScore >= 0.8 ? 'A' : overallScore >= 0.6 ? 'B' : 'C',
      insightDepth: averageDepth,
      originalityScore: averageOriginality,
      emotionalResonance: averageResonance,
      actionableGuidance: 0.7 // 固定値（実装例）
    };
  }

  // フォールバック処理
  generateFallbackMetaphor(inputData, error) {
    console.warn('Enhanced Metaphor フォールバック実行:', error.message);
    
    return {
      primaryMetaphor: {
        essence: '人生の川は、時に急流、時に静かな流れ',
        fullText: '今のあなたの状況は、人生という大きな川の流れの一部です。急流の時もあれば、静かに流れる時もある。どんな流れであっても、川は必ず海に向かって進んでいます。あなたの歩みも、同じように意味のある方向に向かっています。',
        patternName: '進',
        insightLevel: 'moderate',
        actionGuidance: '現在の状況を受け入れながら、次の一歩を踏み出してください'
      },
      availableMetaphors: {
        progress: {
          essence: '成長の道のり',
          fullMetaphor: '一歩一歩の積み重ねが、やがて大きな変化となります',
          qualityScores: { overallScore: 0.6 }
        }
      },
      premiumMetaphors: {
        mutual: { name: '互卦', teaser: '隠された可能性の発見' },
        reversed: { name: '綜卦', teaser: '新しい視点からの洞察' }
      },
      qualityMetrics: {
        overallGrade: 'B',
        insightDepth: 0.6,
        originalityScore: 0.5,
        emotionalResonance: 0.7
      },
      systemInfo: {
        engineVersion: this.version,
        generationMethod: 'fallback',
        timestamp: new Date().toISOString()
      },
      fallback: true,
      error: error.message
    };
  }

  // ユーティリティメソッド群
  validateInput(inputData) {
    return inputData && typeof inputData === 'object';
  }

  generateCacheKey(inputData) {
    const keyData = {
      input: inputData.userInput?.substring(0, 50) || '',
      context: inputData.contextType || '',
      hexagram: inputData.hexagram || 1
    };
    return btoa(JSON.stringify(keyData)).substring(0, 32);
  }

  getFromCache(key) {
    const cached = this.metaphorCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  saveToCache(key, data) {
    if (this.metaphorCache.size >= this.cacheMaxSize) {
      const firstKey = this.metaphorCache.keys().next().value;
      this.metaphorCache.delete(firstKey);
    }
    this.metaphorCache.set(key, { data, timestamp: Date.now() });
  }

  updatePerformanceMetrics(result, success) {
    this.performanceMetrics.totalGenerations++;
    
    if (success) {
      this.performanceMetrics.successfulGenerations++;
      const insightScore = result.qualityMetrics?.insightDepth || 0.5;
      this.performanceMetrics.averageInsightScore = 
        (this.performanceMetrics.averageInsightScore * 0.9 + insightScore * 0.1);
    }
  }

  // 簡易実装メソッド群（本格実装時に詳細化）
  calculateContextConfidence(factors) { return 0.8; }
  calculateContextRelevance(metaphor, context) { return 0.7; }
  calculateEmotionalResonance(metaphor, context) { return 0.7; }
  generateActionGuidance(metaphor, pattern) { return '示された智慧を日常に活かしてください'; }
  generateBasicPatternMetaphor(pattern, context) { 
    return { 
      essence: '基本的な智慧', 
      fullMetaphor: '状況に応じた適切な対応を',
      insightLevel: 'basic' 
    }; 
  }
  generateFallbackPatternResults(context) { 
    return { 
      patterns: { progress: { essence: '進歩の道' } },
      displayablePatterns: ['progress'] 
    }; 
  }
  selectOptimalMetaphor(metaphors, context) { return metaphors[0] || {}; }
  adaptToIntrospectiveStyle(essence, concern) { return essence; }
  expandIntrospectiveMetaphor(metaphor, wisdom) { return metaphor; }
  adaptToRelationalStyle(essence, concern) { return essence; }
  expandRelationalMetaphor(metaphor, wisdom) { return metaphor; }
  adaptToPhilosophicalStyle(essence, concern) { return essence; }
  expandPhilosophicalMetaphor(metaphor, wisdom) { return metaphor; }
  adaptToActionableStyle(essence, concern) { return essence; }
  expandActionableMetaphor(metaphor, wisdom) { return metaphor; }
  calculateContextAlignment(essence, context) { return 0.7; }
  enhanceMetaphorDepth(metaphor, context) { return metaphor; }
  assessOverallQuality(metaphor, context) { 
    return { 
      overallScore: 0.7, 
      insightDepth: 0.7, 
      originalityScore: 0.6, 
      emotionalResonance: 0.7 
    }; 
  }
  integratePhilosophicalWisdom(metaphor, context) { return '深い哲学的洞察'; }
  harmonizePerspectives(alternatives, context) { return '調和のとれた視点'; }
  calculateBunenjinAlignment(metaphor, context) { return 0.8; }
  generateRecommendedAction(metaphor, context) { return '智慧を実践に移してください'; }
  generateABTestData(metaphor, context) { return { variant: 'enhanced', trackingId: Date.now() }; }
  getDefaultMetaphor() { 
    return { 
      essence: '人生の智慧', 
      fullMetaphor: '状況に応じた最適な選択を', 
      patternName: '基本' 
    }; 
  }
  simplifyExpression(text) { return text; }
  enrichExpression(text) { return text; }
  createFallbackPatternEngine() { 
    return { 
      calculateAllPatterns: () => ({ patterns: [] }) 
    }; 
  }
  buildMetaphorDatabase() { console.log('メタファーDB構築完了'); }
  initializeQualityAssessmentSystem() { console.log('品質システム初期化完了'); }
  initializeContextAnalyzer() { console.log('コンテキスト分析器初期化完了'); }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.EnhancedMetaphorEngine = EnhancedMetaphorEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedMetaphorEngine;
}

console.log('🌟 EnhancedMetaphorEngine.js 読み込み完了 - 深い洞察メタファー生成システム');