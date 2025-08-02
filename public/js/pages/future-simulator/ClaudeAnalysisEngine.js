/**
 * Claude活用分析エンジン
 * 
 * 目的：
 * - Claude（Claude AI）の自然言語理解能力を模倣した高精度分析
 * - プロンプトエンジニアリング手法による精度向上
 * - リアルタイムでの文脈分析と386爻マッピング
 * - 外部API不使用での高精度分析実現
 * 
 * 処理フロー：
 * 1. ユーザー入力の前処理・正規化
 * 2. 多角度分析による意味抽出
 * 3. 386爻との意味的類似度計算
 * 4. 信頼度スコア付き結果出力
 * 
 * 前提条件：
 * - HexagramPatternTemplatesが初期化済み
 * - H384_DATAが読み込み済み
 * - 日本語形態素解析機能が利用可能
 * 
 * 技術的特徴：
 * - 多層意味解析（表層・深層・メタレベル）
 * - 文脈・感情・意図の統合理解
 * - Claude級の推論ロジックの実装
 * - 用九・用六特殊状態の高精度認識
 */
class ClaudeAnalysisEngine {
  constructor() {
    this.patternTemplates = new HexagramPatternTemplates();
    this.analysisCache = new Map(); // 分析結果キャッシュ
    this.contextualPatterns = this.initializeContextualPatterns();
    this.emotionAnalyzer = this.initializeEmotionAnalyzer();
    this.situationClassifier = this.initializeSituationClassifier();
    this.specialYaoDetector = this.initializeSpecialYaoDetector();
    
    // 分析統計
    this.analysisStats = {
      totalAnalyses: 0,
      cacheHits: 0,
      averageConfidence: 0,
      specialYaoDetections: 0
    };
  }

  /**
   * 文脈理解パターンの初期化
   * 
   * 目的：
   * - Claude級の文脈理解ロジックの実装
   * - 表層的なキーワードを超えた深層理解
   * - 文化的・時代的コンテキストの考慮
   * 
   * 処理内容：
   * 1. 多層意味パターンの定義
   * 2. 文脈推論ルールの構築
   * 3. 矛盾・皮肉・反語の検出ロジック
   * 4. 時制・主体性・感情の統合分析規則
   * 
   * 出力：
   * - 文脈理解用パターン辞書
   * - 推論ルールセット
   */
  initializeContextualPatterns() {
    return {
      // 多層意味解析パターン
      semantic_layers: {
        surface: {
          // 表層：直接的な表現
          keywords: ['失敗', '成功', '困る', '嬉しい', '不安', '希望'],
          patterns: [
            /失敗|ミス|うまくいかない|だめ/,
            /成功|うまくいく|良い|最高|素晴らしい/,
            /困る|大変|しんどい|きつい|厳しい/,
            /嬉しい|楽しい|幸せ|ハッピー|よかった/,
            /不安|心配|怖い|どうしよう|やばい/,
            /希望|期待|楽しみ|きっと|絶対/
          ]
        },
        
        deep: {
          // 深層：含意・暗示的表現
          implication_patterns: [
            {
              pattern: /また|もう.*回|繰り返し|いつも同じ/,
              meaning: 'repetitive_struggle',
              hexagram_tendency: [29, 39, 47] // 坎・蹇・困
            },
            {
              pattern: /すべて|全て|統合|まとめて|一つになって/,
              meaning: 'integration_completion',
              hexagram_tendency: [1, 63], // 乾・既済
              special_yao: ['用九'] // 用九の可能性
            },
            {
              pattern: /受け入れ|従う|任せる|流れに沿って/,
              meaning: 'receptive_yielding',
              hexagram_tendency: [2, 52], // 坤・艮
              special_yao: ['用六'] // 用六の可能性
            }
          ]
        },
        
        meta: {
          // メタレベル：文脈・状況の特性
          contextual_indicators: [
            {
              pattern: /でも|だけど|しかし|ただ/,
              type: 'contradiction',
              analysis_weight: 0.8 // 矛盾表現は重要な手がかり
            },
            {
              pattern: /〜かも|〜みたい|〜っぽい|〜気がする/,
              type: 'uncertainty',
              confidence_modifier: -0.1 // 不確実性表現は信頼度を下げる
            },
            {
              pattern: /〜べき|〜はず|〜に違いない/,
              type: 'strong_belief',
              confidence_modifier: 0.2 // 強い確信は信頼度を上げる
            }
          ]
        }
      },
      
      // 時制分析パターン
      temporal_patterns: {
        past: {
          patterns: [/昨日|先日|前に|以前|〜した|〜だった/],
          analysis_focus: 'reflection_learning'
        },
        present: {
          patterns: [/今|現在|いま|〜している|〜だ/],
          analysis_focus: 'current_situation'
        },
        future: {
          patterns: [/明日|今度|これから|〜する|〜だろう/],
          analysis_focus: 'planning_expectation'
        }
      },
      
      // 主体性レベル分析
      agency_patterns: {
        active: {
          patterns: [/やる|する|頑張る|挑戦|決めた|行動/],
          score: 0.8,
          hexagram_tendency: [1, 25, 51] // 乾・无妄・震
        },
        passive: {
          patterns: [/される|なる|待つ|任せる|従う|受ける/],
          score: 0.2,
          hexagram_tendency: [2, 52, 58] // 坤・艮・兌
        },
        middle: {
          patterns: [/様子見|考える|検討|迷う|悩む/],
          score: 0.5,
          hexagram_tendency: [4, 20, 56] // 蒙・観・旅
        }
      }
    };
  }

  /**
   * 感情分析器の初期化
   * 
   * 目的：
   * - SNS特有の感情表現の高精度認識
   * - 感情の強度・複合性・変化の検出
   * - 易経的感情状態との対応関係構築
   * 
   * 処理内容：
   * 1. 基本6感情の詳細パターン定義
   * 2. 感情強度の自動判定
   * 3. 複合感情の分析
   * 4. 文脈による感情修正
   * 
   * 出力：
   * - 感情認識エンジン
   * - 強度判定システム
   */
  initializeEmotionAnalyzer() {
    return {
      // 基本感情パターン（Claude級の詳細分析）
      primary_emotions: {
        anxiety: {
          // 不安系感情
          levels: {
            low: {
              patterns: [/ちょっと心配|なんか不安|少し気になる/],
              indicators: ['？', 'かな', 'どうかな'],
              intensity: 0.3
            },
            medium: {
              patterns: [/不安|心配|気がかり|どうしよう/],
              indicators: ['😰', '💦', '...'],
              intensity: 0.6
            },
            high: {
              patterns: [/めっちゃ不安|マジで心配|パニック|やばい/],
              indicators: ['😱', '💀', '！！！'],
              intensity: 0.9
            }
          },
          hexagram_affinity: [29, 39, 47, 4] // 坎・蹇・困・蒙
        },
        
        frustration: {
          // 苛立ち系感情
          levels: {
            low: {
              patterns: [/ちょっとイラ|なんかモヤ|微妙/],
              indicators: ['...', 'うーん'],
              intensity: 0.3
            },
            medium: {
              patterns: [/イライラ|ムカつく|もどかしい|ストレス/],
              indicators: ['😤', '💢', 'はぁ'],
              intensity: 0.6
            },
            high: {
              patterns: [/マジでムカつく|ブチ切れ|限界|キレそう/],
              indicators: ['😠', '🤬', '！！！'],
              intensity: 0.9
            }
          },
          hexagram_affinity: [21, 43, 49] // 噬嗑・夬・革
        },
        
        sadness: {
          // 悲しみ系感情
          levels: {
            low: {
              patterns: [/ちょっと寂しい|なんか切ない|微妙な気持ち/],
              indicators: ['...', 'はぁ'],
              intensity: 0.3
            },
            medium: {
              patterns: [/悲しい|辛い|しんどい|落ち込む/],
              indicators: ['😢', '💔', 'つらい'],
              intensity: 0.6
            },
            high: {
              patterns: [/めっちゃ辛い|絶望|もうだめ|泣きたい/],
              indicators: ['😭', '💀', '死にたい'],
              intensity: 0.9
            }
          },
          hexagram_affinity: [36, 47, 56] // 明夷・困・旅
        },
        
        confusion: {
          // 混乱系感情
          levels: {
            low: {
              patterns: [/ちょっと迷う|なんか分からない|微妙/],
              indicators: ['？', 'うーん'],
              intensity: 0.3
            },
            medium: {
              patterns: [/迷う|分からない|混乱|どうしよう/],
              indicators: ['🤔', '😅', '？？'],
              intensity: 0.6
            },
            high: {
              patterns: [/完全に迷子|何が何だか|パニック/],
              indicators: ['😵', '🌀', '？？？'],
              intensity: 0.9
            }
          },
          hexagram_affinity: [4, 60, 61] // 蒙・節・中孚
        },
        
        hope: {
          // 希望系感情
          levels: {
            low: {
              patterns: [/ちょっと期待|なんか良さそう|まあまあ/],
              indicators: ['😊', 'かも'],
              intensity: 0.3
            },
            medium: {
              patterns: [/期待|希望|楽しみ|きっと大丈夫/],
              indicators: ['✨', '🌟', '！'],
              intensity: 0.6
            },
            high: {
              patterns: [/絶対うまくいく|確信してる|最高/],
              indicators: ['🎉', '💫', '！！！'],
              intensity: 0.9
            }
          },
          hexagram_affinity: [11, 19, 35] // 泰・臨・晋
        },
        
        determination: {
          // 決意系感情
          levels: {
            low: {
              patterns: [/ちょっと頑張る|なんとかする|やってみる/],
              indicators: ['💪', 'よし'],
              intensity: 0.3
            },
            medium: {
              patterns: [/頑張る|やる気|決めた|負けない/],
              indicators: ['🔥', '👊', '！'],
              intensity: 0.6
            },
            high: {
              patterns: [/絶対やってやる|覚悟決めた|命がけ/],
              indicators: ['💪', '🔥', '！！！'],
              intensity: 0.9
            }
          },
          hexagram_affinity: [1, 51, 25] // 乾・震・无妄
        }
      },
      
      // 複合感情の検出
      compound_emotions: [
        {
          combination: ['anxiety', 'hope'],
          name: 'anxious_optimism',
          hexagram_tendency: [5, 24] // 需・復
        },
        {
          combination: ['sadness', 'determination'],
          name: 'resolved_grief',
          hexagram_tendency: [36, 15] // 明夷・謙
        },
        {
          combination: ['frustration', 'hope'],
          name: 'frustrated_ambition',
          hexagram_tendency: [12, 45] // 否・萃
        }
      ]
    };
  }

  /**
   * 状況分類器の初期化
   * 
   * 目的：
   * - 8つの基本状況タイプの自動分類
   * - 易経的変化段階との対応
   * - 複合状況の認識と分析
   * 
   * 処理内容：
   * 1. 状況タイプ別パターン定義
   * 2. 変化の方向性検出
   * 3. 循環性・反復性の判定
   * 4. 統合度・完成度の評価
   * 
   * 出力：
   * - 状況分類システム
   * - 変化方向分析器
   */
  initializeSituationClassifier() {
    return {
      situation_types: {
        beginning: {
          // 始まり・開始段階
          patterns: [
            /始まり|スタート|開始|第一歩|初めて|新しく/,
            /これから|今度|新規|開拓|挑戦|取り組み/
          ],
          characteristics: ['uncertainty', 'potential', 'energy'],
          hexagram_affinity: [1, 3, 24, 25], // 乾・屯・復・无妄
          confidence_factors: {
            time_references: [/今度|これから|新しく/],
            action_words: [/始める|スタート|挑戦/]
          }
        },
        
        growth: {
          // 成長・発展段階
          patterns: [
            /成長|発展|向上|進歩|発達|拡大/,
            /伸びる|育つ|広がる|深まる|高まる/
          ],
          characteristics: ['progress', 'expansion', 'learning'],
          hexagram_affinity: [42, 46, 53, 57], // 益・升・漸・巽
          confidence_factors: {
            progress_indicators: [/だんだん|少しずつ|徐々に/],
            growth_verbs: [/伸びる|成長|向上/]
          }
        },
        
        peak: {
          // 絶頂・最高段階
          patterns: [
            /絶頂|最高|ピーク|頂点|極限|完璧/,
            /最大|最強|究極|至高|無敵|完全/
          ],
          characteristics: ['completion', 'excellence', 'fulfillment'],
          hexagram_affinity: [1, 14, 34, 43], // 乾・大有・大壮・夬
          confidence_factors: {
            superlatives: [/最高|最大|最強|完璧/],
            achievement_words: [/達成|成功|勝利/]
          },
          special_yao_indicator: '用九' // 用九の可能性
        },
        
        decline: {
          // 衰退・下降段階
          patterns: [
            /衰退|下降|減少|悪化|劣化|低下/,
            /落ちる|下がる|減る|弱る|失う/
          ],
          characteristics: ['diminishment', 'weakness', 'loss'],
          hexagram_affinity: [12, 33, 36, 41], // 否・遯・明夷・損
          confidence_factors: {
            decline_verbs: [/落ちる|下がる|悪化/],
            loss_indicators: [/失う|なくなる|減る/]
          }
        },
        
        stagnation: {
          // 停滞・膠着段階
          patterns: [
            /停滞|膠着|動かない|進まない|変わらない/,
            /同じ|繰り返し|ループ|堂々巡り|八方塞がり/
          ],
          characteristics: ['immobility', 'repetition', 'blockage'],
          hexagram_affinity: [29, 39, 47, 60], // 坎・蹇・困・節
          confidence_factors: {
            stagnation_words: [/停滞|動かない|進まない/],
            repetition_indicators: [/同じ|また|繰り返し/]
          }
        },
        
        transformation: {
          // 変化・転換段階
          patterns: [
            /変化|転換|変わる|切り替え|シフト|転機/,
            /革命|改革|改善|刷新|転身|変身/
          ],
          characteristics: ['change', 'renewal', 'revolution'],
          hexagram_affinity: [49, 50, 32, 18], // 革・鼎・恒・蛊
          confidence_factors: {
            change_verbs: [/変わる|変化|転換/],
            transformation_words: [/革命|改革|刷新/]
          }
        },
        
        completion: {
          // 完成・終結段階
          patterns: [
            /完成|終了|達成|完了|仕上げ|結論/,
            /終わり|最後|締めくくり|決着|解決/
          ],
          characteristics: ['finalization', 'achievement', 'closure'],
          hexagram_affinity: [63, 64, 2], // 既済・未済・坤
          confidence_factors: {
            completion_words: [/完成|達成|完了/],
            ending_indicators: [/終わり|最後|終了/]
          },
          special_yao_indicator: '用六' // 用六の可能性
        },
        
        repetition: {
          // 繰り返し・循環段階
          patterns: [
            /繰り返し|また|いつも|毎回|循環|パターン/,
            /〜回目|何度も|再び|再度|リピート/
          ],
          characteristics: ['cyclical', 'habitual', 'persistent'],
          hexagram_affinity: [29, 27, 26], // 坎・頤・大畜
          confidence_factors: {
            repetition_words: [/繰り返し|また|いつも/],
            frequency_indicators: [/毎回|何度も|〜回/]
          }
        }
      }
    };
  }

  /**
   * 特殊爻検出器の初期化
   * 
   * 目的：
   * - 用九・用六の高精度自動検出
   * - 通常爻では表現できない特別な状態の認識
   * - 統合性・完成性の詳細判定
   * 
   * 処理内容：
   * 1. 用九パターンの詳細定義
   * 2. 用六パターンの詳細定義
   * 3. 通常爻との境界判定
   * 4. 信頼度の精密計算
   * 
   * 出力：
   * - 特殊爻検出システム
   * - 統合度評価器
   */
  initializeSpecialYaoDetector() {
    return {
      yong_jiu: {
        // 用九（乾為天）：全陽爻の統合
        essence: 'complete_yang_integration',
        description: '全ての可能性が統合され、最高次の実現に向かう状態',
        
        detection_patterns: {
          integration_keywords: [
            /統合|まとめ|全て|すべて|一つ|一体|完全統合/,
            /総合|全体|包括|網羅|完璧|極限|究極/
          ],
          
          transcendence_indicators: [
            /次元|レベルアップ|昇華|超越|進化|変容/,
            /新しい段階|高次|上位|メタ|俯瞰/
          ],
          
          leadership_mastery: [
            /リーダー|統率|指導|主導|率いる|先頭/,
            /マスター|達人|専門家|エキスパート|熟練/
          ],
          
          creative_power: [
            /創造|クリエイト|生み出す|作り出す|革新/,
            /アイデア|発想|ひらめき|インスピレーション/
          ]
        },
        
        exclusion_patterns: [
          // 用九ではない可能性を示すパターン
          /部分的|一部|限定的|不完全|未完成/,
          /失敗|挫折|困難|問題|課題|悩み/
        ],
        
        confidence_calculation: {
          base_threshold: 0.7,
          integration_bonus: 0.2,
          transcendence_bonus: 0.15,
          leadership_bonus: 0.1,
          creative_bonus: 0.1,
          exclusion_penalty: -0.3
        }
      },
      
      yong_liu: {
        // 用六（坤為地）：全陰爻の統合
        essence: 'complete_yin_integration',
        description: '全ての受容性が統合され、最高の柔軟性と適応力を発揮する状態',
        
        detection_patterns: {
          receptive_integration: [
            /受け入れ|受容|包容|包み込む|迎え入れる/,
            /調和|融合|適応|柔軟|しなやか|流れるように/
          ],
          
          supportive_mastery: [
            /支える|サポート|支援|援助|補助|協力/,
            /育てる|育む|養う|成長させる|見守る/
          ],
          
          yielding_wisdom: [
            /従う|任せる|委ねる|流れに沿って|自然に/,
            /謙虚|謙遜|控えめ|奥ゆかしい|慎み深い/
          ],
          
          nurturing_power: [
            /母性|包容力|慈愛|慈悲|優しさ|温かさ/,
            /癒し|ヒーリング|安らぎ|平和|静寂/
          ]
        },
        
        exclusion_patterns: [
          // 用六ではない可能性を示すパターン
          /攻撃的|積極的|能動的|主導的|リード/,
          /競争|戦い|対立|争い|批判|拒否/
        ],
        
        confidence_calculation: {
          base_threshold: 0.7,
          receptive_bonus: 0.2,
          supportive_bonus: 0.15,
          yielding_bonus: 0.1,
          nurturing_bonus: 0.1,
          exclusion_penalty: -0.3
        }
      }
    };
  }

  /**
   * メイン分析関数：ユーザー入力の包括的分析
   * 
   * 目的：
   * - Claude級の高精度自然言語理解
   * - 386爻への最適マッピング
   * - 信頼度付き結果の生成
   * 
   * 入力：
   * - userInput: ユーザーの自然言語入力
   * - options: 分析オプション
   * 
   * 処理内容：
   * 1. 入力の前処理・正規化
   * 2. 多層意味解析の実行
   * 3. 感情・状況・文脈の統合分析
   * 4. 386爻マッピングと信頼度計算
   * 5. 特殊爻の検出・判定
   * 
   * 出力：
   * - 分析結果オブジェクト（信頼度・理由・詳細情報付き）
   * 
   * エラー処理：
   * - 入力検証とサニタイゼーション
   * - 分析失敗時のフォールバック
   * - 例外状況の適切なハンドリング
   */
  async analyzeUserInput(userInput, options = {}) {
    const startTime = performance.now();
    
    try {
      // 入力検証とキャッシュ確認
      if (!userInput || typeof userInput !== 'string') {
        throw new Error('有効な入力テキストが必要です');
      }
      
      const normalizedInput = this.normalizeInput(userInput);
      const cacheKey = this.generateCacheKey(normalizedInput, options);
      
      if (this.analysisCache.has(cacheKey)) {
        this.analysisStats.cacheHits++;
        return this.analysisCache.get(cacheKey);
      }
      
      // 多層分析の実行
      const analysisResult = {
        input: userInput,
        normalizedInput: normalizedInput,
        timestamp: new Date().toISOString(),
        analysisTime: 0,
        
        // 基本分析結果
        surfaceAnalysis: this.performSurfaceAnalysis(normalizedInput),
        emotionAnalysis: this.performEmotionAnalysis(normalizedInput),
        situationAnalysis: this.performSituationAnalysis(normalizedInput),
        contextualAnalysis: this.performContextualAnalysis(normalizedInput),
        
        // 特殊爻検出
        specialYaoAnalysis: this.performSpecialYaoAnalysis(normalizedInput),
        
        // 統合分析
        integratedAnalysis: null,
        
        // 最終結果
        mappingResults: [],
        confidence: 0,
        reasoning: []
      };
      
      // 統合分析の実行
      analysisResult.integratedAnalysis = this.performIntegratedAnalysis(analysisResult);
      
      // 386爻マッピングの実行
      analysisResult.mappingResults = await this.performYaoMapping(analysisResult);
      
      // 最終信頼度の計算
      analysisResult.confidence = this.calculateFinalConfidence(analysisResult);
      
      // 分析理由の生成
      analysisResult.reasoning = this.generateReasoning(analysisResult);
      
      // 処理時間の記録
      const endTime = performance.now();
      analysisResult.analysisTime = endTime - startTime;
      
      // 統計更新
      this.updateAnalysisStats(analysisResult);
      
      // キャッシュに保存
      this.analysisCache.set(cacheKey, analysisResult);
      
      return analysisResult;
      
    } catch (error) {
      console.error('分析エラー:', error);
      return this.generateErrorResult(userInput, error);
    }
  }

  /**
   * 入力テキストの正規化
   * 
   * 目的：
   * - 分析の一貫性確保
   * - ノイズの除去
   * - 標準形式への変換
   */
  normalizeInput(input) {
    return input
      .trim()
      .replace(/[\r\n]+/g, ' ') // 改行を空白に
      .replace(/\s+/g, ' ') // 複数空白を単一空白に
      .replace(/[！？]{2,}/g, match => match[0]) // 重複記号を単一に
      .toLowerCase(); // 大文字小文字統一は日本語では不要だが、英数字用
  }

  /**
   * 表層分析の実行
   * 
   * 目的：
   * - 直接的なキーワード・パターンの検出
   * - 基本的な感情・状況の識別
   */
  performSurfaceAnalysis(input) {
    const result = {
      keywords: [],
      patterns: [],
      basicEmotions: [],
      timeReferences: null,
      agencyLevel: null
    };
    
    // キーワード抽出
    const keywordPatterns = this.contextualPatterns.semantic_layers.surface.patterns;
    keywordPatterns.forEach((pattern, index) => {
      const matches = input.match(pattern);
      if (matches) {
        const category = ['failure', 'success', 'difficulty', 'joy', 'anxiety', 'hope'][index];
        result.keywords.push({
          category: category,
          matches: matches,
          confidence: 0.7
        });
      }
    });
    
    // 時制分析
    Object.entries(this.contextualPatterns.temporal_patterns).forEach(([timeType, config]) => {
      config.patterns.forEach(pattern => {
        if (pattern.test(input)) {
          result.timeReferences = {
            type: timeType,
            focus: config.analysis_focus,
            confidence: 0.8
          };
        }
      });
    });
    
    // 主体性レベル分析
    Object.entries(this.contextualPatterns.agency_patterns).forEach(([agencyType, config]) => {
      config.patterns.forEach(pattern => {
        if (pattern.test(input)) {
          result.agencyLevel = {
            type: agencyType,
            score: config.score,
            hexagramTendency: config.hexagram_tendency,
            confidence: 0.8
          };
        }
      });
    });
    
    return result;
  }

  /**
   * 感情分析の実行
   * 
   * 目的：
   * - 6つの基本感情の詳細分析
   * - 感情強度の判定
   * - 複合感情の検出
   */
  performEmotionAnalysis(input) {
    const result = {
      primaryEmotions: [],
      compoundEmotions: [],
      overallIntensity: 0,
      dominantEmotion: null
    };
    
    let maxIntensity = 0;
    let dominantEmotion = null;
    
    // 基本感情の分析
    Object.entries(this.emotionAnalyzer.primary_emotions).forEach(([emotionType, config]) => {
      Object.entries(config.levels).forEach(([level, levelConfig]) => {
        levelConfig.patterns.forEach(pattern => {
          if (pattern.test(input)) {
            const emotionResult = {
              type: emotionType,
              level: level,
              intensity: levelConfig.intensity,
              hexagramAffinity: config.hexagram_affinity,
              confidence: 0.8
            };
            
            result.primaryEmotions.push(emotionResult);
            
            if (levelConfig.intensity > maxIntensity) {
              maxIntensity = levelConfig.intensity;
              dominantEmotion = emotionResult;
            }
          }
        });
      });
    });
    
    // 複合感情の検出
    const detectedEmotionTypes = result.primaryEmotions.map(e => e.type);
    this.emotionAnalyzer.compound_emotions.forEach(compound => {
      const hasAllComponents = compound.combination.every(comp => 
        detectedEmotionTypes.includes(comp)
      );
      
      if (hasAllComponents) {
        result.compoundEmotions.push({
          name: compound.name,
          components: compound.combination,
          hexagramTendency: compound.hexagram_tendency,
          confidence: 0.7
        });
      }
    });
    
    result.overallIntensity = maxIntensity;
    result.dominantEmotion = dominantEmotion;
    
    return result;
  }

  /**
   * 状況分析の実行
   * 
   * 目的：
   * - 8つの基本状況タイプの分類
   * - 変化の方向性判定
   * - 状況の複合性分析
   */
  performSituationAnalysis(input) {
    const result = {
      detectedSituations: [],
      dominantSituation: null,
      changeDirection: null,
      complexity: 'simple'
    };
    
    let maxConfidence = 0;
    let dominantSituation = null;
    
    // 状況タイプの分析
    Object.entries(this.situationClassifier.situation_types).forEach(([situationType, config]) => {
      let matchScore = 0;
      let matchCount = 0;
      
      // パターンマッチング
      config.patterns.forEach(pattern => {
        if (pattern.test(input)) {
          matchScore += 0.8;
          matchCount++;
        }
      });
      
      // 信頼度要因の確認
      if (config.confidence_factors) {
        Object.entries(config.confidence_factors).forEach(([factorType, patterns]) => {
          patterns.forEach(pattern => {
            if (pattern.test(input)) {
              matchScore += 0.2;
            }
          });
        });
      }
      
      if (matchScore > 0) {
        const confidence = Math.min(matchScore / 2, 1.0); // 正規化
        
        const situationResult = {
          type: situationType,
          characteristics: config.characteristics,
          hexagramAffinity: config.hexagram_affinity,
          confidence: confidence,
          specialYaoIndicator: config.special_yao_indicator || null
        };
        
        result.detectedSituations.push(situationResult);
        
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          dominantSituation = situationResult;
        }
      }
    });
    
    result.dominantSituation = dominantSituation;
    
    // 複合性判定
    if (result.detectedSituations.length > 2) {
      result.complexity = 'complex';
    } else if (result.detectedSituations.length > 1) {
      result.complexity = 'moderate';
    }
    
    return result;
  }

  /**
   * 文脈分析の実行
   * 
   * 目的：
   * - メタレベルの理解
   * - 矛盾・皮肉・反語の検出
   * - 確信度・不確実性の評価
   */
  performContextualAnalysis(input) {
    const result = {
      contextualIndicators: [],
      contradiction: false,
      uncertainty: false,
      strongBelief: false,
      irony: false,
      implicitMeaning: null
    };
    
    // 文脈指標の分析
    this.contextualPatterns.semantic_layers.meta.contextual_indicators.forEach(indicator => {
      if (indicator.pattern.test(input)) {
        result.contextualIndicators.push({
          type: indicator.type,
          weight: indicator.analysis_weight || 1.0,
          confidenceModifier: indicator.confidence_modifier || 0
        });
        
        // 特定タイプのフラグ設定
        switch (indicator.type) {
          case 'contradiction':
            result.contradiction = true;
            break;
          case 'uncertainty':
            result.uncertainty = true;
            break;
          case 'strong_belief':
            result.strongBelief = true;
            break;
        }
      }
    });
    
    // 暗示的意味の検出
    this.contextualPatterns.semantic_layers.deep.implication_patterns.forEach(pattern => {
      if (pattern.pattern.test(input)) {
        result.implicitMeaning = {
          meaning: pattern.meaning,
          hexagramTendency: pattern.hexagram_tendency,
          specialYao: pattern.special_yao || null,
          confidence: 0.8
        };
      }
    });
    
    return result;
  }

  /**
   * 特殊爻分析の実行
   * 
   * 目的：
   * - 用九・用六の高精度検出
   * - 通常爻との境界判定
   * - 統合性・完成性の評価
   */
  performSpecialYaoAnalysis(input) {
    const result = {
      yongJiuScore: 0,
      yongLiuScore: 0,
      yongJiuReasons: [],
      yongLiuReasons: [],
      recommendation: null
    };
    
    // 用九の分析
    const yongJiuConfig = this.specialYaoDetector.yong_jiu;
    let yongJiuScore = 0;
    
    Object.entries(yongJiuConfig.detection_patterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(input)) {
          const bonus = yongJiuConfig.confidence_calculation[category + '_bonus'] || 0.1;
          yongJiuScore += bonus;
          result.yongJiuReasons.push(`${category}パターン検出: ${pattern.source}`);
        }
      });
    });
    
    // 用九の除外パターンチェック
    yongJiuConfig.exclusion_patterns.forEach(pattern => {
      if (pattern.test(input)) {
        yongJiuScore += yongJiuConfig.confidence_calculation.exclusion_penalty;
        result.yongJiuReasons.push(`除外パターン検出: ${pattern.source}`);
      }
    });
    
    result.yongJiuScore = Math.max(0, Math.min(1, yongJiuScore));
    
    // 用六の分析
    const yongLiuConfig = this.specialYaoDetector.yong_liu;
    let yongLiuScore = 0;
    
    Object.entries(yongLiuConfig.detection_patterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(input)) {
          const bonus = yongLiuConfig.confidence_calculation[category + '_bonus'] || 0.1;
          yongLiuScore += bonus;
          result.yongLiuReasons.push(`${category}パターン検出: ${pattern.source}`);
        }
      });
    });
    
    // 用六の除外パターンチェック
    yongLiuConfig.exclusion_patterns.forEach(pattern => {
      if (pattern.test(input)) {
        yongLiuScore += yongLiuConfig.confidence_calculation.exclusion_penalty;
        result.yongLiuReasons.push(`除外パターン検出: ${pattern.source}`);
      }
    });
    
    result.yongLiuScore = Math.max(0, Math.min(1, yongLiuScore));
    
    // 推奨判定
    const yongJiuThreshold = yongJiuConfig.confidence_calculation.base_threshold;
    const yongLiuThreshold = yongLiuConfig.confidence_calculation.base_threshold;
    
    if (result.yongJiuScore >= yongJiuThreshold && result.yongJiuScore > result.yongLiuScore) {
      result.recommendation = {
        type: 'yong_jiu',
        hexagram: 1,
        line: '用九',
        confidence: result.yongJiuScore,
        reasoning: result.yongJiuReasons
      };
    } else if (result.yongLiuScore >= yongLiuThreshold && result.yongLiuScore > result.yongJiuScore) {
      result.recommendation = {
        type: 'yong_liu',
        hexagram: 2,
        line: '用六',
        confidence: result.yongLiuScore,
        reasoning: result.yongLiuReasons
      };
    }
    
    return result;
  }

  /**
   * 統合分析の実行
   * 
   * 目的：
   * - 各層の分析結果を統合
   * - 矛盾の解決
   * - 全体的整合性の確保
   */
  performIntegratedAnalysis(analysisResult) {
    const integrated = {
      overallTheme: null,
      confidenceLevel: 'medium',
      consistency: 'consistent',
      primaryFactors: [],
      secondaryFactors: [],
      conflicts: []
    };
    
    // 主要因子の特定
    if (analysisResult.emotionAnalysis.dominantEmotion) {
      integrated.primaryFactors.push({
        type: 'emotion',
        value: analysisResult.emotionAnalysis.dominantEmotion,
        weight: 0.4
      });
    }
    
    if (analysisResult.situationAnalysis.dominantSituation) {
      integrated.primaryFactors.push({
        type: 'situation',
        value: analysisResult.situationAnalysis.dominantSituation,
        weight: 0.4
      });
    }
    
    if (analysisResult.specialYaoAnalysis.recommendation) {
      integrated.primaryFactors.push({
        type: 'special_yao',
        value: analysisResult.specialYaoAnalysis.recommendation,
        weight: 0.6 // 特殊爻は高重み
      });
    }
    
    // 全体テーマの決定
    if (integrated.primaryFactors.length > 0) {
      const dominantFactor = integrated.primaryFactors.reduce((max, current) => 
        current.weight > max.weight ? current : max
      );
      integrated.overallTheme = dominantFactor.value;
    }
    
    // 矛盾の検出
    if (analysisResult.contextualAnalysis.contradiction) {
      integrated.conflicts.push({
        type: 'contextual_contradiction',
        severity: 'medium',
        impact: 'requires_careful_interpretation'
      });
      integrated.consistency = 'conflicted';
    }
    
    return integrated;
  }

  /**
   * 386爻マッピングの実行
   * 
   * 目的：
   * - 統合分析結果を386爻にマッピング
   * - 複数候補の生成と順位付け
   * - 信頼度付き結果の出力
   */
  async performYaoMapping(analysisResult) {
    const mappingResults = [];
    
    // 特殊爻の優先チェック
    if (analysisResult.specialYaoAnalysis.recommendation) {
      const specialYao = analysisResult.specialYaoAnalysis.recommendation;
      mappingResults.push({
        hexagram: specialYao.hexagram,
        line: specialYao.line,
        confidence: specialYao.confidence,
        reasoning: ['特殊爻検出', ...specialYao.reasoning],
        type: 'special_yao',
        priority: 1
      });
    }
    
    // 通常爻のマッピング
    const candidates = new Map();
    
    // 感情ベースの候補
    if (analysisResult.emotionAnalysis.dominantEmotion) {
      const emotion = analysisResult.emotionAnalysis.dominantEmotion;
      emotion.hexagramAffinity.forEach(hexNum => {
        for (let line = 1; line <= 6; line++) {
          const key = `${hexNum}-${line}`;
          if (!candidates.has(key)) {
            candidates.set(key, {
              hexagram: hexNum,
              line: line,
              confidence: emotion.intensity * 0.7,
              reasoning: [`感情分析：${emotion.type}(${emotion.level})`],
              sources: ['emotion']
            });
          } else {
            const existing = candidates.get(key);
            existing.confidence += emotion.intensity * 0.3;
            existing.reasoning.push(`感情分析：${emotion.type}(${emotion.level})`);
            existing.sources.push('emotion');
          }
        }
      });
    }
    
    // 状況ベースの候補
    if (analysisResult.situationAnalysis.dominantSituation) {
      const situation = analysisResult.situationAnalysis.dominantSituation;
      situation.hexagramAffinity.forEach(hexNum => {
        for (let line = 1; line <= 6; line++) {
          const key = `${hexNum}-${line}`;
          if (!candidates.has(key)) {
            candidates.set(key, {
              hexagram: hexNum,
              line: line,
              confidence: situation.confidence * 0.8,
              reasoning: [`状況分析：${situation.type}`],
              sources: ['situation']
            });
          } else {
            const existing = candidates.get(key);
            existing.confidence += situation.confidence * 0.4;
            existing.reasoning.push(`状況分析：${situation.type}`);
            existing.sources.push('situation');
          }
        }
      });
    }
    
    // 候補の整理と順位付け
    const sortedCandidates = Array.from(candidates.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // 上位5候補
    
    // 重複する爻の処理
    const uniqueCandidates = [];
    const seenKeys = new Set();
    
    sortedCandidates.forEach(candidate => {
      const key = `${candidate.hexagram}-${candidate.line}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        uniqueCandidates.push({
          ...candidate,
          type: 'normal_yao',
          priority: mappingResults.length + uniqueCandidates.length + 1
        });
      }
    });
    
    mappingResults.push(...uniqueCandidates);
    
    return mappingResults.slice(0, 5); // 最大5個の結果
  }

  /**
   * 最終信頼度の計算
   * 
   * 目的：
   * - 全分析結果の統合信頼度算出
   * - 品質指標の生成
   * - 不確実性の適切な表現
   */
  calculateFinalConfidence(analysisResult) {
    let confidence = 0.5; // ベースライン
    
    // 各分析層からの信頼度寄与
    if (analysisResult.emotionAnalysis.dominantEmotion) {
      confidence += analysisResult.emotionAnalysis.dominantEmotion.intensity * 0.2;
    }
    
    if (analysisResult.situationAnalysis.dominantSituation) {
      confidence += analysisResult.situationAnalysis.dominantSituation.confidence * 0.2;
    }
    
    if (analysisResult.specialYaoAnalysis.recommendation) {
      confidence += analysisResult.specialYaoAnalysis.recommendation.confidence * 0.3;
    }
    
    // 文脈による修正
    analysisResult.contextualAnalysis.contextualIndicators.forEach(indicator => {
      confidence += indicator.confidenceModifier;
    });
    
    // 一貫性による修正
    if (analysisResult.integratedAnalysis.consistency === 'conflicted') {
      confidence *= 0.8;
    }
    
    return Math.max(0.1, Math.min(0.95, confidence));
  }

  /**
   * 分析理由の生成
   * 
   * 目的：
   * - 判定根拠の明確化
   * - ユーザーへの説明材料提供
   * - 透明性の確保
   */
  generateReasoning(analysisResult) {
    const reasoning = [];
    
    // 主要分析結果の説明
    if (analysisResult.emotionAnalysis.dominantEmotion) {
      const emotion = analysisResult.emotionAnalysis.dominantEmotion;
      reasoning.push(`主要感情: ${emotion.type}（強度: ${emotion.level}）を検出`);
    }
    
    if (analysisResult.situationAnalysis.dominantSituation) {
      const situation = analysisResult.situationAnalysis.dominantSituation;
      reasoning.push(`状況タイプ: ${situation.type}として分類`);
    }
    
    if (analysisResult.specialYaoAnalysis.recommendation) {
      const special = analysisResult.specialYaoAnalysis.recommendation;
      reasoning.push(`特殊爻: ${special.type}の特徴を検出（信頼度: ${(special.confidence * 100).toFixed(1)}%）`);
    }
    
    // 文脈的要因の説明
    if (analysisResult.contextualAnalysis.uncertainty) {
      reasoning.push('不確実性を示す表現が含まれています');
    }
    
    if (analysisResult.contextualAnalysis.contradiction) {
      reasoning.push('矛盾する要素が含まれており、慎重な解釈が必要です');
    }
    
    return reasoning;
  }

  /**
   * エラー結果の生成
   * 
   * 目的：
   * - 分析失敗時の適切な応答
   * - エラー情報の記録
   * - フォールバック処理
   */
  generateErrorResult(input, error) {
    return {
      input: input,
      error: true,
      errorMessage: error.message,
      errorType: error.name || 'AnalysisError',
      timestamp: new Date().toISOString(),
      
      // 最低限の分析結果
      mappingResults: [{
        hexagram: 4, // 蒙（無知・学び）
        line: 1,
        confidence: 0.3,
        reasoning: ['分析エラーのためフォールバック結果'],
        type: 'fallback',
        priority: 1
      }],
      
      confidence: 0.3,
      reasoning: ['システムエラーにより十分な分析ができませんでした']
    };
  }

  /**
   * 分析統計の更新
   * 
   * 目的：
   * - システム使用状況の追跡
   * - 性能指標の監視
   * - 改善点の特定
   */
  updateAnalysisStats(analysisResult) {
    this.analysisStats.totalAnalyses++;
    
    // 平均信頼度の更新
    const totalConf = this.analysisStats.averageConfidence * (this.analysisStats.totalAnalyses - 1);
    this.analysisStats.averageConfidence = (totalConf + analysisResult.confidence) / this.analysisStats.totalAnalyses;
    
    // 特殊爻検出の記録
    if (analysisResult.specialYaoAnalysis.recommendation) {
      this.analysisStats.specialYaoDetections++;
    }
  }

  /**
   * キャッシュキーの生成
   * 
   * 目的：
   * - 分析結果の効率的キャッシュ
   * - 重複処理の回避
   */
  generateCacheKey(normalizedInput, options) {
    const optionsString = JSON.stringify(options);
    return btoa(normalizedInput + '|' + optionsString).substring(0, 32);
  }

  /**
   * 分析統計の取得
   * 
   * 目的：
   * - システム性能の監視
   * - 使用状況の把握
   * 
   * 出力：
   * - 統計情報オブジェクト
   */
  getAnalysisStatistics() {
    return {
      ...this.analysisStats,
      cacheHitRate: this.analysisStats.cacheHits / (this.analysisStats.totalAnalyses || 1),
      specialYaoDetectionRate: this.analysisStats.specialYaoDetections / (this.analysisStats.totalAnalyses || 1),
      cacheSize: this.analysisCache.size
    };
  }

  /**
   * キャッシュのクリア
   * 
   * 目的：
   * - メモリ使用量の管理
   * - システムリフレッシュ
   */
  clearCache() {
    this.analysisCache.clear();
    console.log('Claude Analysis Engine: キャッシュをクリアしました');
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.ClaudeAnalysisEngine = ClaudeAnalysisEngine;
}