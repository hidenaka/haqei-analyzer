// TransformationConditionCatalog.js - 変化条件カタログ
// 易経的変化が発生する詳細な条件の包括的定義

/**
 * 変化条件カタログ
 * 
 * 目的：
 * - 全変化条件の体系的整理
 * - 条件の詳細パラメータ定義
 * - 条件間の相互関係の明確化
 * - 実践的な条件評価の支援
 * 
 * 入力：
 * - conditionQuery: 条件検索クエリ
 * - contextData: 評価コンテキスト
 * 
 * 処理内容：
 * 1. 条件の検索と取得
 * 2. 条件の評価
 * 3. 複合条件の構築
 * 4. 優先順位の決定
 * 
 * 出力：
 * - conditions: 該当する条件リスト
 * - evaluations: 条件評価結果
 * - recommendations: 推奨事項
 * 
 * 副作用：
 * - カタログ更新
 * - 統計記録
 * 
 * 前提条件：
 * - ActionTriggeredTransformationEngineと連携
 * 
 * エラー処理：
 * - 不明な条件：デフォルト条件
 * - 評価エラー：フォールバック
 */

class TransformationConditionCatalog {
  constructor() {
    this.initializeCatalog();
  }

  initializeCatalog() {
    console.log("📚 Initializing Transformation Condition Catalog...");
    
    // カタログ構造の初期化
    this.catalog = this.buildComprehensiveCatalog();
    
    // インデックスの構築
    this.indices = this.buildIndices();
    
    // 統計システムの初期化
    this.statistics = this.initializeStatistics();
    
    // 検証システムの初期化
    this.validation = this.initializeValidation();
    
    console.log("✅ Transformation Condition Catalog initialized successfully");
    console.log(`📊 Total conditions: ${this.countTotalConditions()}`);
  }

  /**
   * 包括的カタログの構築
   */
  buildComprehensiveCatalog() {
    return {
      // ========== 進爻条件カタログ ==========
      進爻: {
        description: "段階的前進・成長の条件",
        categories: {
          // 行動的条件
          behavioral: {
            継続的努力: {
              id: "shin_behavioral_001",
              name: "継続的努力",
              description: "同一方向への継続的な行動",
              parameters: {
                minDuration: 7, // 最小継続日数
                minFrequency: 0.7, // 最小頻度（0-1）
                consistencyThreshold: 0.8 // 一貫性閾値
              },
              evaluation: (context) => {
                const duration = context.actionHistory?.length || 0;
                const consistency = this.calculateConsistency(context.actionHistory);
                return {
                  satisfied: duration >= 7 && consistency >= 0.8,
                  score: (duration / 14) * consistency
                };
              },
              examples: [
                "毎日同じ時間に勉強を続ける",
                "定期的な運動習慣の維持",
                "コツコツとスキルを磨く"
              ]
            },
            
            段階的拡大: {
              id: "shin_behavioral_002",
              name: "段階的拡大",
              description: "少しずつ範囲や強度を増やす行動",
              parameters: {
                incrementRate: 0.1, // 増加率
                stabilityPeriod: 3, // 各段階の安定期間
                maxGrowthRate: 0.3 // 最大成長率
              },
              evaluation: (context) => {
                const growth = this.calculateGrowthRate(context);
                return {
                  satisfied: growth > 0.05 && growth < 0.3,
                  score: growth / 0.2
                };
              }
            },
            
            基礎固め: {
              id: "shin_behavioral_003",
              name: "基礎固め",
              description: "基本的なスキルや知識の強化",
              parameters: {
                fundamentalFocus: 0.8,
                repetitionCount: 10,
                masteryLevel: 0.7
              },
              evaluation: (context) => {
                const mastery = context.skillLevel?.fundamental || 0;
                return {
                  satisfied: mastery >= 0.7,
                  score: mastery
                };
              }
            }
          },
          
          // 心理的条件
          psychological: {
            内的動機: {
              id: "shin_psychological_001",
              name: "内的動機",
              description: "外部報酬に依存しない純粋な動機",
              parameters: {
                intrinsicRatio: 0.7,
                passionLevel: 0.6,
                autonomy: 0.8
              },
              evaluation: (context) => {
                const intrinsic = this.assessIntrinsicMotivation(context);
                return {
                  satisfied: intrinsic >= 0.7,
                  score: intrinsic
                };
              }
            },
            
            忍耐力: {
              id: "shin_psychological_002",
              name: "忍耐力",
              description: "困難に直面しても継続する精神力",
              parameters: {
                persistenceThreshold: 0.7,
                frustrationTolerance: 0.6,
                longTermVision: 0.8
              }
            },
            
            学習志向: {
              id: "shin_psychological_003",
              name: "学習志向",
              description: "新しい知識やスキルへの開放性",
              parameters: {
                curiosityLevel: 0.7,
                adaptability: 0.6,
                growthMindset: 0.8
              }
            }
          },
          
          // 環境的条件
          environmental: {
            安定環境: {
              id: "shin_environmental_001",
              name: "安定環境",
              description: "変化が少なく予測可能な環境",
              parameters: {
                volatilityIndex: 0.3, // 低いほど安定
                predictability: 0.8,
                supportLevel: 0.7
              }
            },
            
            段階的サポート: {
              id: "shin_environmental_002",
              name: "段階的サポート",
              description: "成長に応じた適切なサポート",
              parameters: {
                mentorshipQuality: 0.7,
                resourceAvailability: 0.8,
                feedbackFrequency: 0.6
              }
            },
            
            成長促進文化: {
              id: "shin_environmental_003",
              name: "成長促進文化",
              description: "継続的改善を重視する文化",
              parameters: {
                culturalSupport: 0.8,
                recognitionSystem: 0.7,
                collaborativeEnvironment: 0.7
              }
            }
          },
          
          // 時間的条件
          temporal: {
            適切なタイミング: {
              id: "shin_temporal_001",
              name: "適切なタイミング",
              description: "成長に最適な時期",
              parameters: {
                seasonalAlignment: 0.7,
                lifecyclePhase: "growth",
                energyLevel: 0.7
              }
            },
            
            継続可能期間: {
              id: "shin_temporal_002",
              name: "継続可能期間",
              description: "無理なく継続できる時間的余裕",
              parameters: {
                availableTime: 120, // 分/日
                commitmentPeriod: 30, // 日
                flexibilityBuffer: 0.2
              }
            }
          }
        }
      },
      
      // ========== 変爻条件カタログ ==========
      変爻: {
        description: "質的転換・状況変化の条件",
        categories: {
          // 行動的条件
          behavioral: {
            決定的行動: {
              id: "hen_behavioral_001",
              name: "決定的行動",
              description: "状況を大きく変える決断的行動",
              parameters: {
                decisivenessLevel: 0.8,
                impactMagnitude: 0.7,
                irreversibility: 0.6
              },
              evaluation: (context) => {
                const decisiveness = this.assessDecisiveness(context.action);
                const impact = this.estimateImpact(context);
                return {
                  satisfied: decisiveness >= 0.8 && impact >= 0.7,
                  score: (decisiveness + impact) / 2
                };
              },
              examples: [
                "重要な契約の締結",
                "転職の決断",
                "大きな投資の実行"
              ]
            },
            
            方向転換: {
              id: "hen_behavioral_002",
              name: "方向転換",
              description: "従来と異なる方向への転換",
              parameters: {
                directionChange: 90, // 度
                previousCommitment: 0.7,
                newPathClarity: 0.6
              }
            },
            
            リスクテイク: {
              id: "hen_behavioral_003",
              name: "リスクテイク",
              description: "計算されたリスクを取る行動",
              parameters: {
                riskLevel: 0.6,
                potentialGain: 0.8,
                preparedness: 0.7
              }
            }
          },
          
          // 心理的条件
          psychological: {
            危機感: {
              id: "hen_psychological_001",
              name: "危機感",
              description: "現状への強い危機意識",
              parameters: {
                urgencyLevel: 0.8,
                dissatisfaction: 0.7,
                changeReadiness: 0.6
              }
            },
            
            覚悟: {
              id: "hen_psychological_002",
              name: "覚悟",
              description: "変化を受け入れる心理的準備",
              parameters: {
                commitment: 0.8,
                acceptanceLevel: 0.7,
                mentalStrength: 0.7
              }
            },
            
            ビジョン明確化: {
              id: "hen_psychological_003",
              name: "ビジョン明確化",
              description: "新しい方向性の明確な認識",
              parameters: {
                visionClarity: 0.8,
                goalSpecificity: 0.7,
                pathVisibility: 0.6
              }
            }
          },
          
          // 環境的条件
          environmental: {
            転換点到達: {
              id: "hen_environmental_001",
              name: "転換点到達",
              description: "環境が自然な転換点に到達",
              parameters: {
                saturationLevel: 0.8,
                externalPressure: 0.7,
                opportunityWindow: true
              }
            },
            
            外部刺激: {
              id: "hen_environmental_002",
              name: "外部刺激",
              description: "変化を促す外部からの刺激",
              parameters: {
                stimulusIntensity: 0.7,
                noveltyLevel: 0.8,
                disruptionDegree: 0.6
              }
            },
            
            資源再配分: {
              id: "hen_environmental_003",
              name: "資源再配分",
              description: "リソースの大幅な再配分",
              parameters: {
                reallocationScale: 0.6,
                flexibilityDegree: 0.7,
                optimizationPotential: 0.8
              }
            }
          },
          
          // 関係性条件
          relational: {
            関係性の変化: {
              id: "hen_relational_001",
              name: "関係性の変化",
              description: "重要な関係性の質的変化",
              parameters: {
                relationshipShift: 0.7,
                emotionalImpact: 0.6,
                structuralChange: 0.8
              }
            },
            
            役割転換: {
              id: "hen_relational_002",
              name: "役割転換",
              description: "社会的役割の大きな変化",
              parameters: {
                roleShiftMagnitude: 0.7,
                identityImpact: 0.6,
                socialAcceptance: 0.5
              }
            }
          }
        }
      },
      
      // ========== 錯卦条件カタログ ==========
      錯卦: {
        description: "完全反転・対立的変化の条件",
        categories: {
          // 極限条件
          extreme: {
            価値観崩壊: {
              id: "saku_extreme_001",
              name: "価値観崩壊",
              description: "従来の価値観の完全な崩壊",
              parameters: {
                beliefShatteringLevel: 0.9,
                identityCrisis: 0.8,
                worldviewShift: 0.85
              },
              evaluation: (context) => {
                const shatteringLevel = this.assessBeliefShattering(context);
                return {
                  satisfied: shatteringLevel >= 0.9,
                  score: shatteringLevel
                };
              }
            },
            
            極限体験: {
              id: "saku_extreme_002",
              name: "極限体験",
              description: "通常の枠を超えた体験",
              parameters: {
                intensityLevel: 0.9,
                boundaryDissolution: 0.8,
                transformativeImpact: 0.9
              }
            },
            
            完全否定: {
              id: "saku_extreme_003",
              name: "完全否定",
              description: "過去の全面的な否定",
              parameters: {
                rejectionLevel: 0.9,
                completeness: 0.85,
                newBeginning: 0.8
              }
            }
          },
          
          // 対立条件
          opposition: {
            正反対の選択: {
              id: "saku_opposition_001",
              name: "正反対の選択",
              description: "従来と180度異なる選択",
              parameters: {
                oppositionDegree: 180,
                intentionality: 0.8,
                awareness: 0.7
              }
            },
            
            敵対的転換: {
              id: "saku_opposition_002",
              name: "敵対的転換",
              description: "味方から敵への転換",
              parameters: {
                allianceShift: -1.0,
                emotionalReversal: 0.8,
                strategicImplication: 0.9
              }
            }
          },
          
          // 破壊的条件
          destructive: {
            構造崩壊: {
              id: "saku_destructive_001",
              name: "構造崩壊",
              description: "既存構造の完全な崩壊",
              parameters: {
                structuralIntegrity: 0.1,
                cascadeEffect: 0.8,
                reconstructionNeed: 0.9
              }
            },
            
            アイデンティティ喪失: {
              id: "saku_destructive_002",
              name: "アイデンティティ喪失",
              description: "自己同一性の喪失と再構築",
              parameters: {
                identityCoherence: 0.2,
                egoDisolution: 0.8,
                rebuildingPotential: 0.7
              }
            }
          }
        }
      },
      
      // ========== 綜卦条件カタログ ==========
      綜卦: {
        description: "視点転換・立場交換の条件",
        categories: {
          // 視点条件
          perspective: {
            他者視点採用: {
              id: "sou_perspective_001",
              name: "他者視点採用",
              description: "相手の立場から見る能力",
              parameters: {
                empathyLevel: 0.8,
                perspectiveTaking: 0.7,
                cognitiveFlexibility: 0.7
              },
              evaluation: (context) => {
                const empathy = this.assessEmpathy(context);
                const flexibility = context.cognitiveFlexibility || 0.5;
                return {
                  satisfied: empathy >= 0.8 && flexibility >= 0.7,
                  score: (empathy + flexibility) / 2
                };
              }
            },
            
            逆転思考: {
              id: "sou_perspective_002",
              name: "逆転思考",
              description: "通常と逆の発想で考える",
              parameters: {
                reversalThinking: 0.7,
                creativityLevel: 0.6,
                unconventionality: 0.8
              }
            },
            
            メタ認知: {
              id: "sou_perspective_003",
              name: "メタ認知",
              description: "自分の思考を客観視する",
              parameters: {
                selfAwareness: 0.8,
                objectivity: 0.7,
                reflectionDepth: 0.7
              }
            }
          },
          
          // 役割条件
          role: {
            役割交換: {
              id: "sou_role_001",
              name: "役割交換",
              description: "通常と逆の役割を担う",
              parameters: {
                roleReversalDegree: 0.8,
                adaptationSpeed: 0.6,
                performanceLevel: 0.5
              }
            },
            
            立場逆転: {
              id: "sou_role_002",
              name: "立場逆転",
              description: "上下関係や力関係の逆転",
              parameters: {
                powerShift: -0.8,
                statusChange: 0.7,
                acceptanceLevel: 0.6
              }
            }
          },
          
          // 認知条件
          cognitive: {
            パラダイムシフト: {
              id: "sou_cognitive_001",
              name: "パラダイムシフト",
              description: "認識枠組みの根本的転換",
              parameters: {
                paradigmShift: 0.8,
                conceptualLeap: 0.7,
                integrationAbility: 0.6
              }
            },
            
            弁証法的思考: {
              id: "sou_cognitive_002",
              name: "弁証法的思考",
              description: "対立を統合する思考",
              parameters: {
                dialecticalThinking: 0.8,
                synthesisAbility: 0.7,
                complexityTolerance: 0.8
              }
            }
          }
        }
      },
      
      // ========== 互卦条件カタログ ==========
      互卦: {
        description: "内的本質・潜在性顕現の条件",
        categories: {
          // 内省条件
          introspective: {
            深層探求: {
              id: "go_introspective_001",
              name: "深層探求",
              description: "無意識層への深い探求",
              parameters: {
                introspectionDepth: 0.8,
                unconsciousAccess: 0.7,
                symbolRecognition: 0.6
              },
              evaluation: (context) => {
                const depth = this.assessIntrospectionDepth(context);
                return {
                  satisfied: depth >= 0.8,
                  score: depth
                };
              }
            },
            
            夢分析: {
              id: "go_introspective_002",
              name: "夢分析",
              description: "夢や象徴の深い理解",
              parameters: {
                dreamRecall: 0.6,
                symbolInterpretation: 0.7,
                patternRecognition: 0.8
              }
            },
            
            瞑想状態: {
              id: "go_introspective_003",
              name: "瞑想状態",
              description: "深い瞑想による内的覚醒",
              parameters: {
                meditationDepth: 0.8,
                awarenessLevel: 0.7,
                egoTranscendence: 0.6
              }
            }
          },
          
          // 潜在条件
          latent: {
            才能開花: {
              id: "go_latent_001",
              name: "才能開花",
              description: "隠れた才能の顕現",
              parameters: {
                latentPotential: 0.8,
                activationLevel: 0.7,
                expressionClarity: 0.6
              }
            },
            
            無意識的統合: {
              id: "go_latent_002",
              name: "無意識的統合",
              description: "意識下での統合プロセス",
              parameters: {
                integrationLevel: 0.7,
                unconsciousProcessing: 0.8,
                emergentQuality: 0.6
              }
            },
            
            本質回帰: {
              id: "go_latent_003",
              name: "本質回帰",
              description: "本来の自己への回帰",
              parameters: {
                authenticityLevel: 0.8,
                essenceConnection: 0.7,
                coreAlignment: 0.8
              }
            }
          },
          
          // 創発条件
          emergent: {
            シンクロニシティ: {
              id: "go_emergent_001",
              name: "シンクロニシティ",
              description: "意味ある偶然の一致",
              parameters: {
                synchronicityFrequency: 0.6,
                meaningfulness: 0.8,
                patternCoherence: 0.7
              }
            },
            
            直感的洞察: {
              id: "go_emergent_002",
              name: "直感的洞察",
              description: "論理を超えた直感的理解",
              parameters: {
                intuitionStrength: 0.8,
                insightClarity: 0.7,
                integrationSpeed: 0.6
              }
            }
          }
        }
      }
    };
  }

  /**
   * インデックスの構築
   */
  buildIndices() {
    const indices = {
      byId: new Map(),
      byCategory: new Map(),
      byParameter: new Map(),
      byKeyword: new Map()
    };
    
    // カタログを走査してインデックスを構築
    for (const [transformationType, typeData] of Object.entries(this.catalog)) {
      for (const [categoryName, categoryData] of Object.entries(typeData.categories)) {
        indices.byCategory.set(`${transformationType}_${categoryName}`, categoryData);
        
        for (const [conditionName, condition] of Object.entries(categoryData)) {
          // IDインデックス
          indices.byId.set(condition.id, {
            ...condition,
            transformationType,
            categoryName
          });
          
          // パラメータインデックス
          if (condition.parameters) {
            for (const paramName of Object.keys(condition.parameters)) {
              if (!indices.byParameter.has(paramName)) {
                indices.byParameter.set(paramName, []);
              }
              indices.byParameter.get(paramName).push(condition.id);
            }
          }
          
          // キーワードインデックス
          const keywords = this.extractKeywords(condition.name + " " + condition.description);
          for (const keyword of keywords) {
            if (!indices.byKeyword.has(keyword)) {
              indices.byKeyword.set(keyword, []);
            }
            indices.byKeyword.get(keyword).push(condition.id);
          }
        }
      }
    }
    
    return indices;
  }

  /**
   * 統計システムの初期化
   */
  initializeStatistics() {
    return {
      usage: new Map(), // 条件の使用頻度
      satisfaction: new Map(), // 条件の満足度
      combinations: new Map(), // 条件の組み合わせ頻度
      
      record: (conditionId, satisfied, score) => {
        // 使用頻度の記録
        const currentUsage = this.statistics.usage.get(conditionId) || 0;
        this.statistics.usage.set(conditionId, currentUsage + 1);
        
        // 満足度の記録
        if (!this.statistics.satisfaction.has(conditionId)) {
          this.statistics.satisfaction.set(conditionId, {
            total: 0,
            satisfied: 0,
            averageScore: 0
          });
        }
        
        const stats = this.statistics.satisfaction.get(conditionId);
        stats.total++;
        if (satisfied) stats.satisfied++;
        stats.averageScore = (stats.averageScore * (stats.total - 1) + score) / stats.total;
      }
    };
  }

  /**
   * 検証システムの初期化
   */
  initializeValidation() {
    return {
      validateCondition: (condition) => {
        const errors = [];
        
        if (!condition.id) errors.push("ID is required");
        if (!condition.name) errors.push("Name is required");
        if (!condition.parameters) errors.push("Parameters are required");
        if (!condition.evaluation) errors.push("Evaluation function is required");
        
        return {
          valid: errors.length === 0,
          errors
        };
      },
      
      validateContext: (context) => {
        const required = ['action', 'currentState'];
        const missing = required.filter(field => !context[field]);
        
        return {
          valid: missing.length === 0,
          missing
        };
      }
    };
  }

  // =============== 公開API ===============

  /**
   * 条件の検索
   */
  searchConditions(query) {
    const results = [];
    
    // キーワード検索
    if (query.keyword) {
      const keywordResults = this.indices.byKeyword.get(query.keyword) || [];
      for (const conditionId of keywordResults) {
        const condition = this.indices.byId.get(conditionId);
        if (condition) results.push(condition);
      }
    }
    
    // 変化タイプでフィルタ
    if (query.transformationType) {
      return results.filter(c => c.transformationType === query.transformationType);
    }
    
    // カテゴリでフィルタ
    if (query.category) {
      return results.filter(c => c.categoryName === query.category);
    }
    
    return results;
  }

  /**
   * 条件の評価
   */
  evaluateCondition(conditionId, context) {
    const condition = this.indices.byId.get(conditionId);
    if (!condition) {
      return {
        error: "Condition not found",
        satisfied: false,
        score: 0
      };
    }
    
    try {
      const result = condition.evaluation(context);
      
      // 統計記録
      this.statistics.record(conditionId, result.satisfied, result.score);
      
      return {
        conditionId,
        conditionName: condition.name,
        ...result
      };
    } catch (error) {
      console.error(`Error evaluating condition ${conditionId}:`, error);
      return {
        error: error.message,
        satisfied: false,
        score: 0
      };
    }
  }

  /**
   * 複数条件の評価
   */
  evaluateMultipleConditions(conditionIds, context) {
    const results = [];
    
    for (const conditionId of conditionIds) {
      results.push(this.evaluateCondition(conditionId, context));
    }
    
    return {
      results,
      summary: {
        total: results.length,
        satisfied: results.filter(r => r.satisfied).length,
        averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length
      }
    };
  }

  /**
   * 推奨条件の取得
   */
  getRecommendedConditions(context) {
    const recommendations = [];
    
    // 各変化タイプから関連性の高い条件を選択
    for (const [transformationType, typeData] of Object.entries(this.catalog)) {
      const typeConditions = [];
      
      for (const [categoryName, categoryData] of Object.entries(typeData.categories)) {
        for (const [conditionName, condition] of Object.entries(categoryData)) {
          // 評価を実行
          const evaluation = this.evaluateCondition(condition.id, context);
          
          if (evaluation.score > 0.5) {
            typeConditions.push({
              ...condition,
              transformationType,
              categoryName,
              evaluation
            });
          }
        }
      }
      
      // スコア順でソート
      typeConditions.sort((a, b) => b.evaluation.score - a.evaluation.score);
      
      // 上位3つを推奨
      recommendations.push(...typeConditions.slice(0, 3));
    }
    
    return recommendations;
  }

  /**
   * 条件の詳細取得
   */
  getConditionDetails(conditionId) {
    const condition = this.indices.byId.get(conditionId);
    if (!condition) return null;
    
    const stats = this.statistics.satisfaction.get(conditionId);
    
    return {
      ...condition,
      statistics: stats ? {
        usage: this.statistics.usage.get(conditionId) || 0,
        satisfactionRate: stats.satisfied / stats.total,
        averageScore: stats.averageScore
      } : null,
      relatedConditions: this.findRelatedConditions(conditionId)
    };
  }

  /**
   * 条件の組み合わせ生成
   */
  generateConditionCombinations(transformationType, context) {
    const combinations = [];
    const conditions = this.getConditionsByType(transformationType);
    
    // 2つの組み合わせを生成
    for (let i = 0; i < conditions.length; i++) {
      for (let j = i + 1; j < conditions.length; j++) {
        const combo = {
          conditions: [conditions[i], conditions[j]],
          combinedScore: this.calculateCombinedScore(
            conditions[i],
            conditions[j],
            context
          )
        };
        
        if (combo.combinedScore > 0.6) {
          combinations.push(combo);
        }
      }
    }
    
    // スコア順でソート
    combinations.sort((a, b) => b.combinedScore - a.combinedScore);
    
    return combinations.slice(0, 5); // 上位5つ
  }

  // =============== ヘルパーメソッド ===============

  /**
   * 総条件数のカウント
   */
  countTotalConditions() {
    let count = 0;
    
    for (const typeData of Object.values(this.catalog)) {
      for (const categoryData of Object.values(typeData.categories)) {
        count += Object.keys(categoryData).length;
      }
    }
    
    return count;
  }

  /**
   * キーワード抽出
   */
  extractKeywords(text) {
    return text.match(/[\u4e00-\u9faf]{2,}/g) || [];
  }

  /**
   * 一貫性の計算
   */
  calculateConsistency(actionHistory) {
    if (!actionHistory || actionHistory.length < 2) return 0;
    
    let consistencyScore = 0;
    for (let i = 1; i < actionHistory.length; i++) {
      const similarity = this.calculateSimilarity(
        actionHistory[i - 1],
        actionHistory[i]
      );
      consistencyScore += similarity;
    }
    
    return consistencyScore / (actionHistory.length - 1);
  }

  /**
   * 成長率の計算
   */
  calculateGrowthRate(context) {
    if (!context.metrics || context.metrics.length < 2) return 0;
    
    const recent = context.metrics[context.metrics.length - 1];
    const previous = context.metrics[context.metrics.length - 2];
    
    return (recent - previous) / previous;
  }

  /**
   * 内発的動機の評価
   */
  assessIntrinsicMotivation(context) {
    const factors = {
      autonomy: context.autonomyLevel || 0.5,
      mastery: context.masteryDesire || 0.5,
      purpose: context.purposeClarity || 0.5
    };
    
    return (factors.autonomy + factors.mastery + factors.purpose) / 3;
  }

  /**
   * 決定性の評価
   */
  assessDecisiveness(action) {
    const decisiveKeywords = ["決定", "決断", "断行", "実行", "完全に"];
    let score = 0.5;
    
    for (const keyword of decisiveKeywords) {
      if (action.includes(keyword)) {
        score += 0.1;
      }
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 影響の推定
   */
  estimateImpact(context) {
    const factors = {
      scope: context.impactScope || 0.5,
      duration: context.impactDuration || 0.5,
      intensity: context.impactIntensity || 0.5
    };
    
    return (factors.scope + factors.duration + factors.intensity) / 3;
  }

  /**
   * 信念崩壊の評価
   */
  assessBeliefShattering(context) {
    if (!context.beliefSystem) return 0;
    
    const challenged = context.challengedBeliefs || 0;
    const total = context.totalBeliefs || 1;
    
    return challenged / total;
  }

  /**
   * 共感の評価
   */
  assessEmpathy(context) {
    const indicators = {
      perspectiveTaking: context.perspectiveTaking || 0.5,
      emotionalResonance: context.emotionalResonance || 0.5,
      compassion: context.compassionLevel || 0.5
    };
    
    return (indicators.perspectiveTaking + 
            indicators.emotionalResonance + 
            indicators.compassion) / 3;
  }

  /**
   * 内省深度の評価
   */
  assessIntrospectionDepth(context) {
    const factors = {
      selfAwareness: context.selfAwareness || 0.5,
      reflectionTime: Math.min((context.reflectionMinutes || 0) / 60, 1),
      insightQuality: context.insightQuality || 0.5
    };
    
    return (factors.selfAwareness + factors.reflectionTime + factors.insightQuality) / 3;
  }

  /**
   * 類似性計算
   */
  calculateSimilarity(action1, action2) {
    const keywords1 = this.extractKeywords(action1);
    const keywords2 = this.extractKeywords(action2);
    
    const common = keywords1.filter(k => keywords2.includes(k));
    return common.length / Math.max(keywords1.length, keywords2.length, 1);
  }

  /**
   * 関連条件の検索
   */
  findRelatedConditions(conditionId) {
    const condition = this.indices.byId.get(conditionId);
    if (!condition) return [];
    
    const related = [];
    
    // 同じカテゴリの条件
    const categoryKey = `${condition.transformationType}_${condition.categoryName}`;
    const categoryConditions = this.indices.byCategory.get(categoryKey);
    
    if (categoryConditions) {
      for (const [name, cond] of Object.entries(categoryConditions)) {
        if (cond.id !== conditionId) {
          related.push({
            id: cond.id,
            name: cond.name,
            relationship: "same_category"
          });
        }
      }
    }
    
    return related.slice(0, 5);
  }

  /**
   * タイプ別条件の取得
   */
  getConditionsByType(transformationType) {
    const conditions = [];
    const typeData = this.catalog[transformationType];
    
    if (!typeData) return conditions;
    
    for (const categoryData of Object.values(typeData.categories)) {
      conditions.push(...Object.values(categoryData));
    }
    
    return conditions;
  }

  /**
   * 複合スコアの計算
   */
  calculateCombinedScore(condition1, condition2, context) {
    const eval1 = this.evaluateCondition(condition1.id, context);
    const eval2 = this.evaluateCondition(condition2.id, context);
    
    // 相乗効果を考慮
    const synergyBonus = this.calculateSynergy(condition1, condition2);
    
    return (eval1.score + eval2.score) / 2 * (1 + synergyBonus);
  }

  /**
   * シナジー計算
   */
  calculateSynergy(condition1, condition2) {
    // 同じカテゴリなら相乗効果
    if (condition1.categoryName === condition2.categoryName) {
      return 0.2;
    }
    
    // 補完的な条件なら相乗効果
    const complementary = [
      ["behavioral", "psychological"],
      ["environmental", "temporal"],
      ["introspective", "emergent"]
    ];
    
    for (const [cat1, cat2] of complementary) {
      if ((condition1.categoryName === cat1 && condition2.categoryName === cat2) ||
          (condition1.categoryName === cat2 && condition2.categoryName === cat1)) {
        return 0.3;
      }
    }
    
    return 0.1; // 基本的な相乗効果
  }
}

// グローバル変数として登録
if (typeof window !== "undefined") {
  window.TransformationConditionCatalog = TransformationConditionCatalog;
  console.log("✅ Transformation Condition Catalog loaded successfully");
}

// Node.js環境での使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = TransformationConditionCatalog;
}