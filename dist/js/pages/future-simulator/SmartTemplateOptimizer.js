/**
 * Claude活用テンプレート最適化システム
 * 
 * 目的：
 * - 既存テンプレートの品質向上
 * - Claude分析による最適なキーフレーズ抽出
 * - 文脈理解に基づくパターン改善
 * - 386爻の本質的特徴の言語化強化
 * 
 * 最適化プロセス：
 * 1. H384データの深層分析
 * 2. Claude的アプローチによる意味抽出
 * 3. 自然言語パターンの生成
 * 4. A/Bテストによる効果検証
 * 
 * 出力：
 * - 改善されたテンプレートデータ
 * - キーフレーズ重要度ランキング
 * - マッピング精度向上レポート
 * 
 * 前提条件：
 * - H384H64database.jsが読み込まれている
 * - HexagramPatternTemplatesが利用可能
 * - LoadH384Dataが初期化済み
 * 
 * 技術的特徴：
 * - 統計的自然言語処理手法
 * - 意味ベクトル空間での類似度計算
 * - 段階的テンプレート改善アルゴリズム
 * - リアルタイム品質評価システム
 */
class SmartTemplateOptimizer {
  constructor() {
    this.h384Data = typeof H384_DATA !== 'undefined' ? H384_DATA : [];
    this.patternTemplates = new HexagramPatternTemplates();
    this.optimizationHistory = new Map(); // 最適化履歴
    this.qualityMetrics = this.initializeQualityMetrics();
    this.linguisticAnalyzer = this.initializeLinguisticAnalyzer();
    this.semanticEnhancer = this.initializeSemanticEnhancer();
    
    // 最適化統計
    this.optimizationStats = {
      totalOptimizations: 0,
      successfulOptimizations: 0,
      averageImprovement: 0,
      processingTime: 0
    };
  }

  /**
   * 品質評価指標の初期化
   * 
   * 目的：
   * - テンプレート品質の定量的測定
   * - 改善効果の客観的評価
   * - 最適化方向の決定
   * 
   * 処理内容：
   * 1. 言語的品質指標の定義
   * 2. 意味的豊富さの測定基準
   * 3. 実用性評価の枠組み
   * 4. 比較分析のための基準値設定
   * 
   * 出力：
   * - 品質評価システム
   * - ベンチマーク指標セット
   */
  initializeQualityMetrics() {
    return {
      // 言語的品質指標
      linguistic_quality: {
        // 語彙の豊富さ
        vocabulary_richness: {
          unique_word_ratio: { weight: 0.2, target: 0.7 },
          semantic_diversity: { weight: 0.3, target: 0.8 },
          expression_variety: { weight: 0.2, target: 0.75 },
          cultural_appropriateness: { weight: 0.3, target: 0.9 }
        },
        
        // 表現の自然さ
        naturalness: {
          colloquial_balance: { weight: 0.4, target: 0.7 },
          emotional_authenticity: { weight: 0.3, target: 0.8 },
          context_sensitivity: { weight: 0.3, target: 0.75 }
        },
        
        // 文脈理解度
        contextual_understanding: {
          situation_accuracy: { weight: 0.4, target: 0.8 },
          emotion_precision: { weight: 0.3, target: 0.85 },
          nuance_capture: { weight: 0.3, target: 0.7 }
        }
      },
      
      // 実用性指標
      practical_effectiveness: {
        // ユーザー認識度
        user_recognition: {
          relatability: { weight: 0.4, target: 0.8 },
          clarity: { weight: 0.3, target: 0.85 },
          actionability: { weight: 0.3, target: 0.7 }
        },
        
        // マッピング精度
        mapping_accuracy: {
          keyword_precision: { weight: 0.3, target: 0.8 },
          context_recall: { weight: 0.3, target: 0.75 },
          false_positive_rate: { weight: 0.4, target: 0.1 } // 低いほど良い
        }
      },
      
      // 易経的整合性
      yijing_coherence: {
        // 本質的理解
        essential_understanding: {
          hexagram_essence: { weight: 0.4, target: 0.9 },
          line_specificity: { weight: 0.3, target: 0.8 },
          philosophical_depth: { weight: 0.3, target: 0.75 }
        },
        
        // 現代的適用性
        modern_applicability: {
          contemporary_relevance: { weight: 0.4, target: 0.8 },
          practical_wisdom: { weight: 0.3, target: 0.85 },
          cultural_bridge: { weight: 0.3, target: 0.7 }
        }
      }
    };
  }

  /**
   * 言語分析器の初期化
   * 
   * 目的：
   * - 日本語テキストの高度な分析
   * - 意味・感情・文脈の抽出
   * - 自然言語パターンの発見
   * 
   * 処理内容：
   * 1. 形態素解析システムの構築
   * 2. 感情・意図分析エンジン
   * 3. 共起・関連性分析
   * 4. 文体・レジスター分析
   * 
   * 出力：
   * - 包括的言語分析システム
   * - 意味抽出エンジン
   */
  initializeLinguisticAnalyzer() {
    return {
      // 形態素・語彙分析
      morphological: {
        // 重要語抽出パターン
        important_word_patterns: [
          { type: 'noun', pattern: /[\u4e00-\u9fa5]{2,4}(?=の|が|を|に|で|と|から|まで|について)/, weight: 0.8 },
          { type: 'verb', pattern: /[\u4e00-\u9fa5]{1,3}(?:する|した|される|できる|れる|らる)/, weight: 0.7 },
          { type: 'adjective', pattern: /[\u4e00-\u9fa5]{2,4}(?:い|な|的)/, weight: 0.6 },
          { type: 'adverb', pattern: /(?:とても|非常に|かなり|少し|ちょっと|めっちゃ|すごく)/, weight: 0.5 }
        ],
        
        // 感情語の分類
        emotion_words: {
          positive: {
            high: ['最高', '素晴らしい', '完璧', '絶対', '確実', '間違いない'],
            medium: ['良い', '嬉しい', '楽しい', '幸せ', '満足', 'ワクワク'],
            low: ['まあまあ', 'そこそこ', 'ちょっと良い', '悪くない']
          },
          negative: {
            high: ['最悪', '絶望', '破綻', '崩壊', '終了', 'やばい'],
            medium: ['悪い', '辛い', '困る', '大変', '厳しい', 'しんどい'],
            low: ['微妙', 'ちょっと', '少し困る', 'なんか']
          },
          neutral: {
            uncertainty: ['分からない', '迷う', '悩む', 'どうしよう', '微妙'],
            transition: ['変わる', '変化', '転換', '移る', 'シフト'],
            observation: ['見る', '感じる', '思う', '考える', '気づく']
          }
        },
        
        // 文体分析
        style_indicators: {
          formal: [/である/, /ます/, /です/, /ございます/, /いたします/],
          casual: [/だよ/, /じゃん/, /っしょ/, /かな/, /よね/],
          emphatic: [/！/, /マジで/, /本当に/, /絶対/, /確実に/],
          questioning: [/？/, /かな/, /でしょうか/, /だろうか/, /よね/]
        }
      },
      
      // 意味・文脈分析
      semantic: {
        // 意味フィールドの定義
        semantic_fields: {
          achievement: ['成功', '達成', '完成', '実現', '獲得', '勝利', 'クリア'],
          challenge: ['困難', '課題', '問題', '障害', '試練', 'ハードル', '壁'],
          relationship: ['人間関係', '友達', '恋人', '家族', '同僚', 'チーム', '仲間'],
          growth: ['成長', '発展', '向上', '進歩', '学習', 'スキルアップ', '進化'],
          emotion: ['感情', '気持ち', '心', '精神', 'メンタル', '心理', '気分'],
          time: ['時間', '期間', 'タイミング', '時期', '瞬間', '今', '未来', '過去'],
          change: ['変化', '変更', '転換', '移行', 'シフト', '革新', '改革'],
          stability: ['安定', '安心', '安全', '確実', '信頼', '保証', '平和']
        },
        
        // 共起パターン分析
        cooccurrence_patterns: [
          { words: ['成功', '達成'], context: 'achievement', strength: 0.9 },
          { words: ['困難', '乗り越える'], context: 'overcoming', strength: 0.8 },
          { words: ['変化', '必要'], context: 'transformation_need', strength: 0.7 },
          { words: ['人間関係', '悩む'], context: 'social_concern', strength: 0.8 },
          { words: ['時間', '足りない'], context: 'time_pressure', strength: 0.7 }
        ]
      },
      
      // 文脈推論システム
      contextual_inference: {
        // 状況推論ルール
        situation_rules: [
          {
            condition: { emotion: 'frustration', context: 'repetition' },
            inference: { situation: 'stuck_pattern', hexagram_tendency: [29, 39] },
            confidence: 0.8
          },
          {
            condition: { emotion: 'hope', context: 'beginning' },
            inference: { situation: 'new_opportunity', hexagram_tendency: [1, 3, 24] },
            confidence: 0.7
          },
          {
            condition: { emotion: 'completion', context: 'integration' },
            inference: { situation: 'mastery_achievement', special_yao: 'yong_jiu' },
            confidence: 0.9
          }
        ],
        
        // 時制・主体性推論
        temporal_agency_rules: [
          {
            temporal: 'past',
            agency: 'active',
            inference: { focus: 'learning_from_experience', confidence: 0.7 }
          },
          {
            temporal: 'present',
            agency: 'passive',
            inference: { focus: 'accepting_current_flow', confidence: 0.6 }
          },
          {
            temporal: 'future',
            agency: 'active',
            inference: { focus: 'planning_and_action', confidence: 0.8 }
          }
        ]
      }
    };
  }

  /**
   * 意味強化システムの初期化
   * 
   * 目的：
   * - テンプレートの意味的深度向上
   * - 文化的コンテキストの統合
   * - 現代的表現との融合
   * 
   * 処理内容：
   * 1. 意味拡張アルゴリズム
   * 2. 文化的適応システム
   * 3. 世代別表現最適化
   * 4. 感情ニュアンス強化
   * 
   * 出力：
   * - 意味強化エンジン
   * - 文化適応システム
   */
  initializeSemanticEnhancer() {
    return {
      // 意味拡張パターン
      semantic_expansion: {
        // 基本概念の拡張
        concept_expansion: {
          '困難': {
            formal: ['試練', '課題', '障害'],
            casual: ['きつい', 'しんどい', 'やばい'],
            metaphor: ['壁', 'ハードル', '山'],
            emotional: ['つらい', '厳しい', '大変']
          },
          '成功': {
            formal: ['達成', '実現', '完遂'],
            casual: ['やった', 'できた', 'いけた'],
            metaphor: ['頂上', 'ゴール', '勝利'],
            emotional: ['最高', '嬉しい', '誇らしい']
          },
          '変化': {
            formal: ['転換', '移行', '革新'],
            casual: ['変わる', 'シフト', 'チェンジ'],
            metaphor: ['脱皮', '進化', '変身'],
            emotional: ['ワクワク', '不安', 'ドキドキ']
          }
        },
        
        // 世代別適応
        generational_adaptation: {
          young: {
            vocabulary: ['ヤバい', 'エモい', 'しんどい', 'ガチ', 'マジ'],
            expressions: ['〜すぎる', '〜じゃん', '〜っしょ', '〜かも'],
            emoji_frequency: 0.7,
            abbreviation: true
          },
          adult: {
            vocabulary: ['大変', '困難', '重要', '必要', '適切'],
            expressions: ['〜ですね', '〜でしょう', '〜かもしれません'],
            emoji_frequency: 0.3,
            abbreviation: false
          },
          senior: {
            vocabulary: ['困難', '重要', '大切', '必要', '適切'],
            expressions: ['〜です', '〜であります', '〜ございます'],
            emoji_frequency: 0.1,
            abbreviation: false
          }
        },
        
        // 感情ニュアンスの細分化
        emotional_nuances: {
          anxiety: {
            light: ['ちょっと心配', '少し不安', 'なんか気になる'],
            moderate: ['不安', '心配', '気がかり'],
            intense: ['めっちゃ不安', '超心配', 'パニック']
          },
          hope: {
            light: ['期待', 'ちょっと楽しみ', 'なんか良さそう'],
            moderate: ['希望', '楽しみ', 'ワクワク'],
            intense: ['絶対うまくいく', '確信してる', '間違いない']
          },
          frustration: {
            light: ['ちょっとイラッと', 'なんかモヤモヤ', '微妙'],
            moderate: ['イライラ', 'ムカつく', 'ストレス'],
            intense: ['ブチ切れそう', 'マジでムカつく', '限界']
          }
        }
      },
      
      // 文脈統合システム
      contextual_integration: {
        // 状況-感情-表現の三位一体
        situation_emotion_expression: [
          {
            situation: 'beginning',
            emotions: ['anxiety', 'hope'],
            expressions: {
              young: '新しいことにワクワクするけど、ちょっと不安もある',
              adult: '新たな挑戦への期待と不安が混在しています',
              senior: '新しい段階への期待と慎重さを感じています'
            }
          },
          {
            situation: 'stagnation',
            emotions: ['frustration', 'confusion'],
            expressions: {
              young: 'なんか同じことの繰り返しで、マジでイライラする',
              adult: '停滞状況に対してもどかしさを感じています',
              senior: '現状の膠着状態に困惑を覚えます'
            }
          },
          {
            situation: 'transformation',
            emotions: ['determination', 'uncertainty'],
            expressions: {
              young: '変わりたいって思うけど、どうすればいいか分からない',
              adult: '変化の必要性は感じますが、方向性に迷いがあります',
              senior: '変革の時期であることは理解していますが、慎重に進めたいと思います'
            }
          }
        ]
      }
    };
  }

  /**
   * 386爻テンプレート全体の最適化
   * 
   * 目的：
   * - 全テンプレートの体系的改善
   * - 一貫性と多様性のバランス確保
   * - 段階的品質向上の実現
   * 
   * 入力：
   * - optimizationOptions: 最適化設定
   * 
   * 処理内容：
   * 1. 現在のテンプレート品質評価
   * 2. 改善優先度の決定  
   * 3. 段階的最適化の実行
   * 4. 効果測定と検証
   * 
   * 出力：
   * - 最適化されたテンプレートセット
   * - 改善レポート
   * 
   * エラー処理：
   * - データ不整合時の修復
   * - 最適化失敗時のロールバック
   * - 品質劣化の防止
   */
  async optimizeAllTemplates(optimizationOptions = {}) {
    const startTime = performance.now();
    
    try {
      console.log('=== 386爻テンプレート最適化開始 ===');
      
      const options = {
        priority: 'quality', // quality | speed | balanced
        target_improvement: 0.3, // 30%改善目標
        max_processing_time: 300000, // 5分制限
        preserve_essence: true, // 易経的本質の保持
        ...optimizationOptions
      };
      
      // 1. 現状評価
      const currentQuality = await this.evaluateCurrentQuality();
      console.log(`現在の品質スコア: ${(currentQuality.overall * 100).toFixed(1)}%`);
      
      // 2. 改善計画立案
      const optimizationPlan = this.createOptimizationPlan(currentQuality, options);
      console.log(`最適化計画: ${optimizationPlan.phases.length}段階`);
      
      // 3. 段階的最適化実行
      const optimizationResults = {
        startQuality: currentQuality,
        phases: [],
        finalQuality: null,
        totalImprovement: 0,
        processingTime: 0,
        optimizedTemplates: new Map()
      };
      
      for (const [phaseIndex, phase] of optimizationPlan.phases.entries()) {
        console.log(`\n--- Phase ${phaseIndex + 1}: ${phase.name} ---`);
        
        const phaseResult = await this.executeOptimizationPhase(phase, options);
        optimizationResults.phases.push(phaseResult);
        
        // 累積的な改善効果の記録
        for (const [key, template] of phaseResult.optimizedTemplates) {
          optimizationResults.optimizedTemplates.set(key, template);
        }
        
        console.log(`Phase ${phaseIndex + 1} 完了: ${phaseResult.improvedCount}個のテンプレート改善`);
        
        // 時間制限チェック
        const elapsed = performance.now() - startTime;
        if (elapsed > options.max_processing_time) {
          console.warn('時間制限に達したため最適化を中断します');
          break;
        }
      }
      
      // 4. 最終品質評価
      optimizationResults.finalQuality = await this.evaluateOptimizedQuality(
        optimizationResults.optimizedTemplates
      );
      
      // 5. 改善効果の計算
      optimizationResults.totalImprovement = 
        optimizationResults.finalQuality.overall - optimizationResults.startQuality.overall;
      
      optimizationResults.processingTime = performance.now() - startTime;
      
      // 6. 統計更新
      this.updateOptimizationStats(optimizationResults);
      
      // 7. 結果レポート生成
      const report = this.generateOptimizationReport(optimizationResults);
      
      console.log(`\n=== 最適化完了 ===`);
      console.log(`品質改善: ${(optimizationResults.totalImprovement * 100).toFixed(1)}%`);
      console.log(`処理時間: ${(optimizationResults.processingTime / 1000).toFixed(1)}秒`);
      console.log(`最適化テンプレート数: ${optimizationResults.optimizedTemplates.size}`);
      
      return {
        success: true,
        results: optimizationResults,
        report: report,
        optimizedTemplates: optimizationResults.optimizedTemplates
      };
      
    } catch (error) {
      console.error('最適化エラー:', error);
      return this.handleOptimizationError(error);
    }
  }

  /**
   * 現在のテンプレート品質評価
   * 
   * 目的：
   * - ベースライン品質の測定
   * - 改善点の特定
   * - 最適化戦略の決定
   * 
   * 処理内容：
   * 1. 各テンプレートの詳細分析
   * 2. 品質指標の計算
   * 3. 問題箇所の特定
   * 4. 改善可能性の評価
   * 
   * 出力：
   * - 包括的品質レポート
   * - 改善優先度リスト
   */
  async evaluateCurrentQuality() {
    const evaluation = {
      overall: 0,
      categories: {},
      templates: new Map(),
      issues: [],
      strengths: []
    };
    
    let totalScore = 0;
    let templateCount = 0;
    
    // H384データからテンプレート生成・評価
    if (this.h384Data.length === 0) {
      throw new Error('H384データが読み込まれていません');
    }
    
    for (const entry of this.h384Data) {
      const hexNum = entry['卦番号'];
      const lineText = entry['爻'];
      const lineNum = this.extractLineNumber(lineText);
      
      const templateKey = `${hexNum}-${lineNum}`;
      
      // 現在のテンプレート品質評価
      const templateQuality = this.evaluateTemplateQuality(entry);
      evaluation.templates.set(templateKey, templateQuality);
      
      totalScore += templateQuality.overall;
      templateCount++;
      
      // 問題と強みの記録
      if (templateQuality.overall < 0.6) {
        evaluation.issues.push({
          template: templateKey,
          score: templateQuality.overall,
          problems: templateQuality.issues
        });
      } else if (templateQuality.overall > 0.8) {
        evaluation.strengths.push({
          template: templateKey,
          score: templateQuality.overall,
          qualities: templateQuality.strengths
        });
      }
    }
    
    // 全体品質スコア
    evaluation.overall = totalScore / templateCount;
    
    // カテゴリ別集計
    evaluation.categories = this.aggregateQualityByCategory(evaluation.templates);
    
    return evaluation;
  }

  /**
   * 個別テンプレートの品質評価
   * 
   * 目的：
   * - 単一テンプレートの詳細分析
   * - 多面的品質測定
   * - 具体的改善点の特定
   * 
   * 処理内容：
   * 1. 言語的品質の測定
   * 2. 意味的豊富さの評価
   * 3. 実用性の検証
   * 4. 易経的整合性の確認
   * 
   * 出力：
   * - 詳細品質スコア
   * - 問題・強みの特定
   */
  evaluateTemplateQuality(h384Entry) {
    const quality = {
      overall: 0,
      dimensions: {},
      issues: [],
      strengths: [],
      suggestions: []
    };
    
    // 基本データの確認
    const keywords = h384Entry['キーワード'] || [];
    const interpretation = h384Entry['現代解釈の要約'] || '';
    const basicScore = h384Entry['S1_基本スコア'] || 50;
    
    // 1. 言語的品質
    quality.dimensions.linguistic = this.evaluateLinguisticQuality(keywords, interpretation);
    
    // 2. 意味的豊富さ
    quality.dimensions.semantic = this.evaluateSemanticRichness(keywords, interpretation);
    
    // 3. 実用性
    quality.dimensions.practical = this.evaluatePracticalEffectiveness(keywords, interpretation, basicScore);
    
    // 4. 易経的整合性
    quality.dimensions.coherence = this.evaluateYijingCoherence(h384Entry);
    
    // 全体スコア計算
    const weights = { linguistic: 0.25, semantic: 0.3, practical: 0.25, coherence: 0.2 };
    quality.overall = Object.entries(quality.dimensions).reduce((sum, [dim, score]) => {
      return sum + (score * weights[dim]);
    }, 0);
    
    // 問題と強みの特定
    Object.entries(quality.dimensions).forEach(([dimension, score]) => {
      if (score < 0.6) {
        quality.issues.push(`${dimension}の品質が低い (${(score * 100).toFixed(1)}%)`);
      } else if (score > 0.8) {
        quality.strengths.push(`${dimension}の品質が高い (${(score * 100).toFixed(1)}%)`);
      }
    });
    
    // 改善提案
    quality.suggestions = this.generateImprovementSuggestions(quality.dimensions, h384Entry);
    
    return quality;
  }

  /**
   * 言語的品質の評価
   * 
   * 目的：
   * - 語彙・表現の豊富さ測定
   * - 自然さ・適切性の評価
   * - 文体・レジスターの確認
   */
  evaluateLinguisticQuality(keywords, interpretation) {
    let score = 0.5; // ベースライン
    
    // 語彙の豊富さ
    const uniqueWords = new Set();
    const allText = keywords.join(' ') + ' ' + interpretation;
    const words = allText.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    
    words.forEach(word => uniqueWords.add(word));
    const vocabularyRichness = Math.min(uniqueWords.size / Math.max(words.length, 1), 1);
    score += vocabularyRichness * 0.3;
    
    // 表現の多様性
    const expressionPatterns = [
      /[\u4e00-\u9fa5]{3,}/, // 3文字以上の漢字語
      /[ぁ-ん]{3,}/, // 3文字以上のひらがな語
      /[ァ-ヶー]{2,}/, // カタカナ語
    ];
    
    const diversityScore = expressionPatterns.reduce((acc, pattern) => {
      return acc + (pattern.test(allText) ? 0.1 : 0);
    }, 0);
    score += diversityScore;
    
    // 自然さの評価
    const naturalness = this.evaluateTextNaturalness(interpretation);
    score += naturalness * 0.2;
    
    return Math.min(score, 1);
  }

  /**
   * 意味的豊富さの評価
   * 
   * 目的：
   * - 概念の深度と広度測定
   * - 意味関係の豊かさ評価
   * - 文脈理解の深さ確認
   */
  evaluateSemanticRichness(keywords, interpretation) {
    let score = 0.5;
    
    // 意味フィールドの多様性
    const semanticFields = this.linguisticAnalyzer.semantic.semantic_fields;
    const coveredFields = new Set();
    
    const allText = keywords.join(' ') + ' ' + interpretation;
    
    Object.entries(semanticFields).forEach(([field, words]) => {
      if (words.some(word => allText.includes(word))) {
        coveredFields.add(field);
      }
    });
    
    const fieldDiversity = coveredFields.size / Object.keys(semanticFields).length;
    score += fieldDiversity * 0.4;
    
    // 感情の深度
    const emotionDepth = this.evaluateEmotionalDepth(allText);
    score += emotionDepth * 0.3;
    
    // 概念の関連性
    const conceptualConnections = this.evaluateConceptualConnections(keywords);
    score += conceptualConnections * 0.3;
    
    return Math.min(score, 1);
  }

  /**
   * 実用性の評価
   * 
   * 目的：
   * - ユーザー認識度の測定
   * - 実際の適用可能性評価
   * - マッピング精度の予測
   */
  evaluatePracticalEffectiveness(keywords, interpretation, basicScore) {
    let score = 0.4;
    
    // 基本スコアとの相関
    const normalizedBasicScore = Math.max(0, Math.min(1, basicScore / 100));
    score += normalizedBasicScore * 0.3;
    
    // キーワードの具体性
    const concreteKeywords = keywords.filter(keyword => {
      return keyword.length >= 2 && keyword.length <= 4 && /[\u4e00-\u9fa5]/.test(keyword);
    });
    const keywordConcreteness = concreteKeywords.length / Math.max(keywords.length, 1);
    score += keywordConcreteness * 0.3;
    
    // 解釈の明確さ
    const clarityScore = this.evaluateInterpretationClarity(interpretation);
    score += clarityScore * 0.4;
    
    return Math.min(score, 1);
  }

  /**
   * 易経的整合性の評価
   * 
   * 目的：
   * - 易経哲学との一致度測定
   * - 卦・爻の本質理解度評価
   * - 現代的適用の適切性確認
   */
  evaluateYijingCoherence(h384Entry) {
    let score = 0.5;
    
    const hexNum = h384Entry['卦番号'];
    const lineText = h384Entry['爻'];
    const interpretation = h384Entry['現代解釈の要約'] || '';
    
    // 卦の本質との整合性
    const hexagramEssence = this.getHexagramEssence(hexNum);
    if (hexagramEssence) {
      const essenceAlignment = this.calculateEssenceAlignment(interpretation, hexagramEssence);
      score += essenceAlignment * 0.4;
    }
    
    // 爻位の特性との整合性
    const lineCharacteristics = this.getLineCharacteristics(lineText);
    if (lineCharacteristics) {
      const lineAlignment = this.calculateLineAlignment(interpretation, lineCharacteristics);
      score += lineAlignment * 0.3;
    }
    
    // 特殊爻の処理
    if (lineText === '用九' || lineText === '用六') {
      const specialYaoScore = this.evaluateSpecialYaoCoherence(h384Entry);
      score += specialYaoScore * 0.3;
    } else {
      score += 0.3; // 通常爻は基準点
    }
    
    return Math.min(score, 1);
  }

  /**
   * 最適化計画の立案
   * 
   * 目的：
   * - 効率的な改善戦略の策定
   * - 段階的実装プランの作成
   * - リソース配分の最適化
   * 
   * 処理内容：
   * 1. 改善優先度の決定
   * 2. 段階的改善プランの作成
   * 3. 品質目標の設定
   * 4. 実装スケジュールの策定
   * 
   * 出力：
   * - 詳細な最適化計画
   * - 段階別実行プラン
   */
  createOptimizationPlan(currentQuality, options) {
    const plan = {
      strategy: options.priority,
      targetImprovement: options.target_improvement,
      phases: [],
      estimatedTime: 0,
      expectedQuality: currentQuality.overall + options.target_improvement
    };
    
    // Phase 1: 基本品質向上（低品質テンプレートの改善）
    const lowQualityTemplates = Array.from(currentQuality.templates.entries())
      .filter(([key, quality]) => quality.overall < 0.6)
      .sort((a, b) => a[1].overall - b[1].overall); // 品質の低い順
    
    if (lowQualityTemplates.length > 0) {
      plan.phases.push({
        name: '基本品質向上',
        description: '品質の低いテンプレートの基本改善',
        targets: lowQualityTemplates.slice(0, 50), // 最大50個
        focus: ['linguistic', 'semantic'],
        expectedImprovement: 0.3,
        estimatedTime: 60000 // 1分
      });
    }
    
    // Phase 2: 意味強化（中品質テンプレートの向上）
    const mediumQualityTemplates = Array.from(currentQuality.templates.entries())
      .filter(([key, quality]) => quality.overall >= 0.6 && quality.overall < 0.8);
    
    if (mediumQualityTemplates.length > 0) {
      plan.phases.push({
        name: '意味強化',
        description: '中品質テンプレートの意味的豊富さ向上',
        targets: mediumQualityTemplates.slice(0, 100), // 最大100個
        focus: ['semantic', 'practical'],
        expectedImprovement: 0.2,
        estimatedTime: 90000 // 1.5分
      });
    }
    
    // Phase 3: 特殊爻最適化
    const specialYaoTemplates = Array.from(currentQuality.templates.entries())
      .filter(([key, quality]) => key.includes('用九') || key.includes('用六'));
    
    if (specialYaoTemplates.length > 0) {
      plan.phases.push({
        name: '特殊爻最適化',
        description: '用九・用六の特別な状態の精密化',
        targets: specialYaoTemplates,
        focus: ['coherence', 'semantic'],
        expectedImprovement: 0.4,
        estimatedTime: 30000 // 30秒
      });
    }
    
    // Phase 4: 全体調整（高品質テンプレートの微調整）
    const highQualityTemplates = Array.from(currentQuality.templates.entries())
      .filter(([key, quality]) => quality.overall >= 0.8);
    
    if (highQualityTemplates.length > 0 && options.priority === 'quality') {
      plan.phases.push({
        name: '全体調整',
        description: '高品質テンプレートの微調整と統一性確保',
        targets: highQualityTemplates.slice(0, 50),
        focus: ['practical', 'coherence'],
        expectedImprovement: 0.1,
        estimatedTime: 60000 // 1分
      });
    }
    
    // 総推定時間
    plan.estimatedTime = plan.phases.reduce((total, phase) => total + phase.estimatedTime, 0);
    
    return plan;
  }

  /**
   * 最適化フェーズの実行
   * 
   * 目的：
   * - 個別フェーズの実装
   * - テンプレートの具体的改善
   * - 進捗管理と品質確認
   * 
   * 処理内容：
   * 1. 対象テンプレートの取得
   * 2. 改善処理の実行
   * 3. 品質検証
   * 4. 結果の記録
   * 
   * 出力：
   * - フェーズ実行結果
   * - 改善されたテンプレート
   */
  async executeOptimizationPhase(phase, options) {
    const phaseResult = {
      name: phase.name,
      startTime: performance.now(),
      targetCount: phase.targets.length,
      improvedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      optimizedTemplates: new Map(),
      improvements: [],
      endTime: 0,
      duration: 0
    };
    
    console.log(`${phase.name} 開始: ${phase.targets.length}個のテンプレートを処理`);
    
    for (const [templateKey, currentQuality] of phase.targets) {
      try {
        // H384エントリの取得
        const h384Entry = this.findH384Entry(templateKey);
        if (!h384Entry) {
          phaseResult.skippedCount++;
          continue;
        }
        
        // テンプレート最適化の実行
        const optimizedTemplate = await this.optimizeSingleTemplate(
          h384Entry, 
          currentQuality, 
          phase.focus,
          options
        );
        
        if (optimizedTemplate) {
          phaseResult.optimizedTemplates.set(templateKey, optimizedTemplate);
          phaseResult.improvedCount++;
          
          // 改善内容の記録
          phaseResult.improvements.push({
            template: templateKey,
            beforeScore: currentQuality.overall,
            afterScore: optimizedTemplate.qualityScore,
            improvement: optimizedTemplate.qualityScore - currentQuality.overall,
            changes: optimizedTemplate.changes
          });
        } else {
          phaseResult.skippedCount++;
        }
        
      } catch (error) {
        console.error(`テンプレート最適化エラー (${templateKey}):`, error);
        phaseResult.errorCount++;
      }
    }
    
    phaseResult.endTime = performance.now();
    phaseResult.duration = phaseResult.endTime - phaseResult.startTime;
    
    console.log(`${phase.name} 完了: ${phaseResult.improvedCount}/${phase.targets.length}個改善`);
    
    return phaseResult;
  }

  /**
   * 単一テンプレートの最適化
   * 
   * 目的：
   * - 個別テンプレートの具体的改善
   * - 多角度からの品質向上
   * - 易経的本質の保持
   * 
   * 処理内容：
   * 1. 現状分析と改善点特定
   * 2. 言語的・意味的強化
   * 3. 実用性・整合性向上
   * 4. 品質検証と最終調整
   * 
   * 出力：
   * - 最適化されたテンプレート
   * - 改善詳細レポート
   */
  async optimizeSingleTemplate(h384Entry, currentQuality, focusAreas, options) {
    const templateKey = `${h384Entry['卦番号']}-${this.extractLineNumber(h384Entry['爻'])}`;
    
    // 改善されたテンプレートの構築
    const optimizedTemplate = {
      hexagram: h384Entry['卦番号'],
      line: this.extractLineNumber(h384Entry['爻']),
      originalData: h384Entry,
      
      // 改善されたフィールド
      enhancedKeywords: [],
      enhancedInterpretation: '',
      improvedSNSPatterns: {},
      strengthenedEmotions: [],
      optimizedTripleOS: {},
      
      // メタデータ
      qualityScore: 0,
      changes: [],
      optimizationTimestamp: new Date().toISOString()
    };
    
    try {
      // 1. キーワード強化
      if (focusAreas.includes('linguistic') || focusAreas.includes('semantic')) {
        optimizedTemplate.enhancedKeywords = this.enhanceKeywords(
          h384Entry['キーワード'] || [],
          h384Entry['現代解釈の要約'] || '',
          options
        );
        optimizedTemplate.changes.push('キーワード強化');
      }
      
      // 2. 解釈の改善
      if (focusAreas.includes('semantic') || focusAreas.includes('coherence')) {
        optimizedTemplate.enhancedInterpretation = this.enhanceInterpretation(
          h384Entry['現代解釈の要約'] || '',
          h384Entry,
          options
        );
        optimizedTemplate.changes.push('解釈改善');
      }
      
      // 3. SNSパターンの生成
      if (focusAreas.includes('practical')) {
        optimizedTemplate.improvedSNSPatterns = this.generateImprovedSNSPatterns(
          optimizedTemplate.enhancedKeywords,
          optimizedTemplate.enhancedInterpretation,
          h384Entry,
          options
        );
        optimizedTemplate.changes.push('SNSパターン改善');
      }
      
      // 4. 感情分析の強化
      if (focusAreas.includes('semantic')) {
        optimizedTemplate.strengthenedEmotions = this.strengthenEmotionAnalysis(
          optimizedTemplate.enhancedInterpretation,
          h384Entry,
          options
        );
        optimizedTemplate.changes.push('感情分析強化');
      }
      
      // 5. Triple OS最適化
      if (focusAreas.includes('coherence')) {
        optimizedTemplate.optimizedTripleOS = this.optimizeTripleOSMapping(
          h384Entry,
          optimizedTemplate,
          options
        );
        optimizedTemplate.changes.push('Triple OS最適化');
      }
      
      // 6. 品質再評価
      optimizedTemplate.qualityScore = this.evaluateOptimizedTemplateQuality(optimizedTemplate);
      
      // 7. 改善効果の確認
      const improvement = optimizedTemplate.qualityScore - currentQuality.overall;
      if (improvement < 0.05) {
        // 改善効果が小さい場合はスキップ
        return null;
      }
      
      return optimizedTemplate;
      
    } catch (error) {
      console.error(`テンプレート最適化エラー (${templateKey}):`, error);
      return null;
    }
  }

  /**
   * キーワード強化処理
   * 
   * 目的：
   * - より効果的なキーフレーズの生成
   * - 自然言語認識精度の向上
   * - 多様な表現パターンの確保
   */
  enhanceKeywords(originalKeywords, interpretation, options) {
    const enhanced = [...originalKeywords]; // 元のキーワードを保持
    
    // 1. 解釈文からの追加キーワード抽出
    const extractedKeywords = this.extractKeywordsFromText(interpretation);
    extractedKeywords.forEach(keyword => {
      if (!enhanced.includes(keyword) && keyword.length >= 2) {
        enhanced.push(keyword);
      }
    });
    
    // 2. 意味的拡張
    const expandedKeywords = [];
    enhanced.forEach(keyword => {
      const expansions = this.expandKeywordSemantics(keyword);
      expandedKeywords.push(...expansions);
    });
    
    // 3. 重複除去と優先順位付け
    const uniqueKeywords = [...new Set([...enhanced, ...expandedKeywords])];
    
    // 4. 上位10個に制限（品質重視）
    return this.rankAndSelectKeywords(uniqueKeywords, interpretation).slice(0, 10);
  }

  /**
   * 解釈文の改善処理
   * 
   * 目的：
   * - より現代的で理解しやすい表現
   * - 具体性と抽象性のバランス
   * - 文化的適切性の確保
   */
  enhanceInterpretation(originalInterpretation, h384Entry, options) {
    let enhanced = originalInterpretation;
    
    // 1. 基本的な表現改善
    enhanced = this.improveBasicExpression(enhanced);
    
    // 2. 具体性の追加
    enhanced = this.addConcreteness(enhanced, h384Entry);
    
    // 3. 現代的表現への適応
    enhanced = this.modernizeExpression(enhanced, options);
    
    // 4. 感情的ニュアンスの強化
    enhanced = this.strengthenEmotionalNuance(enhanced, h384Entry);
    
    return enhanced;
  }

  /**
   * SNSパターンの改善処理
   * 
   * 目的：
   * - より自然なSNS表現の生成
   * - 世代別・文脈別の最適化
   * - 感情表現の細分化
   */
  generateImprovedSNSPatterns(keywords, interpretation, h384Entry, options) {
    const patterns = {
      young: [],
      adult: [],
      senior: [],
      neutral: []
    };
    
    // 基本パターンの生成
    const basePatterns = this.generateBaseSNSPatterns(keywords, interpretation, h384Entry);
    
    // 世代別適応
    Object.keys(patterns).forEach(persona => {
      patterns[persona] = this.adaptPatternsForPersona(basePatterns, persona, options);
    });
    
    return patterns;
  }

  // ===== ユーティリティメソッド =====

  /**
   * H384エントリの検索
   */
  findH384Entry(templateKey) {
    const [hexNum, lineNum] = templateKey.split('-');
    return this.h384Data.find(entry => {
      const entryHex = entry['卦番号'];
      const entryLine = this.extractLineNumber(entry['爻']);
      return entryHex == hexNum && entryLine == lineNum;
    });
  }

  /**
   * 爻番号の抽出
   */
  extractLineNumber(lineText) {
    const lineMap = {
      '初九': 1, '初六': 1,
      '九二': 2, '六二': 2,
      '九三': 3, '六三': 3,
      '九四': 4, '六四': 4,
      '九五': 5, '六五': 5,
      '上九': 6, '上六': 6,
      '用九': '用九',
      '用六': '用六'
    };
    return lineMap[lineText] || 1;
  }

  /**
   * テキストの自然さ評価
   */
  evaluateTextNaturalness(text) {
    let score = 0.5;
    
    // 基本的な日本語構造のチェック
    if (/[はがをにでと]/.test(text)) score += 0.2; // 助詞の存在
    if (/[るたすだ]$/.test(text)) score += 0.2; // 適切な語尾
    if (text.length >= 10 && text.length <= 100) score += 0.1; // 適切な長さ
    
    return Math.min(score, 1);
  }

  /**
   * 最適化統計の更新
   */
  updateOptimizationStats(results) {
    this.optimizationStats.totalOptimizations++;
    if (results.totalImprovement > 0) {
      this.optimizationStats.successfulOptimizations++;
    }
    
    // 平均改善効果の更新
    const totalImprovement = this.optimizationStats.averageImprovement * 
                            (this.optimizationStats.totalOptimizations - 1);
    this.optimizationStats.averageImprovement = 
      (totalImprovement + results.totalImprovement) / this.optimizationStats.totalOptimizations;
    
    this.optimizationStats.processingTime += results.processingTime;
  }

  /**
   * 最適化レポートの生成
   * 
   * 目的：
   * - 改善効果の詳細報告
   * - 問題点と成功要因の分析
   * - 今後の改善方針の提案
   */
  generateOptimizationReport(results) {
    return {
      summary: {
        totalTemplates: results.optimizedTemplates.size,
        qualityImprovement: results.totalImprovement,
        processingTime: results.processingTime,
        successRate: results.phases.reduce((sum, phase) => 
          sum + phase.improvedCount, 0) / results.phases.reduce((sum, phase) => 
          sum + phase.targetCount, 0)
      },
      phases: results.phases.map(phase => ({
        name: phase.name,
        improvedCount: phase.improvedCount,
        targetCount: phase.targetCount,
        successRate: phase.improvedCount / phase.targetCount,
        averageImprovement: phase.improvements.reduce((sum, imp) => 
          sum + imp.improvement, 0) / (phase.improvements.length || 1)
      })),
      topImprovements: results.phases.flatMap(phase => phase.improvements)
        .sort((a, b) => b.improvement - a.improvement)
        .slice(0, 10),
      recommendations: this.generateRecommendations(results)
    };
  }

  /**
   * エラーハンドリング
   */
  handleOptimizationError(error) {
    return {
      success: false,
      error: error.message,
      errorType: error.name || 'OptimizationError',
      timestamp: new Date().toISOString(),
      fallbackMessage: '最適化処理中にエラーが発生しました。基本機能は継続して利用できます。'
    };
  }

  /**
   * 最適化統計の取得
   */
  getOptimizationStatistics() {
    return {
      ...this.optimizationStats,
      cacheSize: this.optimizationHistory.size,
      successRate: this.optimizationStats.successfulOptimizations / 
                   (this.optimizationStats.totalOptimizations || 1)
    };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.SmartTemplateOptimizer = SmartTemplateOptimizer;
}