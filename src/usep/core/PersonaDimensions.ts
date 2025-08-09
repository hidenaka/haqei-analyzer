/**
 * PersonaDimensions - 多次元ペルソナ定義システム
 * 
 * 目的：
 * - 7次元の包括的なペルソナ特性定義
 * - サービスタイプ別の特化次元管理
 * - 統計的に妥当な分布の保証
 * - 継続学習による次元の進化
 */

/**
 * ペルソナ次元インターフェース
 */
export interface PersonaDimension {
  name: string;
  type: 'categorical' | 'numerical' | 'boolean' | 'composite';
  description: string;
  required: boolean;
  
  // カテゴリカル型の属性
  values?: any[];
  distribution?: any;
  
  // 数値型の属性
  min?: number;
  max?: number;
  
  // ブール型の属性
  probability?: number;
  
  // 複合型の属性
  components?: PersonaDimension[];
}

/**
 * PersonaDimensions - 次元定義管理クラス
 */
export class PersonaDimensions {
  private baseDimensions: PersonaDimension[];
  private serviceSpecificDimensions: Map<string, PersonaDimension[]>;
  private evolutionHistory: any[];

  constructor() {
    this.baseDimensions = this.initializeBaseDimensions();
    this.serviceSpecificDimensions = new Map();
    this.evolutionHistory = [];
    this.initializeServiceDimensions();
  }

  /**
   * 基本次元の初期化
   */
  private initializeBaseDimensions(): PersonaDimension[] {
    return [
      // 1. Demographic（人口統計学的次元）
      {
        name: 'demographics',
        type: 'composite',
        description: '基本的な人口統計学的属性',
        required: true,
        components: [
          {
            name: 'age',
            type: 'numerical',
            description: '年齢',
            required: true,
            min: 18,
            max: 80,
            distribution: 'normal'
          },
          {
            name: 'gender',
            type: 'categorical',
            description: '性別',
            required: true,
            values: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
            distribution: [0.45, 0.45, 0.08, 0.02]
          },
          {
            name: 'occupation',
            type: 'categorical',
            description: '職業',
            required: true,
            values: [
              'tech', 'creative', 'business', 'education', 'healthcare',
              'service', 'manufacturing', 'student', 'retired', 'other'
            ],
            distribution: [0.15, 0.10, 0.20, 0.10, 0.10, 0.15, 0.05, 0.08, 0.05, 0.02]
          },
          {
            name: 'education',
            type: 'categorical',
            description: '教育レベル',
            required: true,
            values: ['highschool', 'bachelor', 'master', 'phd', 'other'],
            distribution: [0.30, 0.40, 0.20, 0.05, 0.05]
          },
          {
            name: 'income',
            type: 'categorical',
            description: '収入レベル',
            required: true,
            values: ['low', 'middle', 'high', 'very-high'],
            distribution: [0.25, 0.50, 0.20, 0.05]
          },
          {
            name: 'location',
            type: 'categorical',
            description: '居住地域',
            required: true,
            values: ['urban', 'suburban', 'rural'],
            distribution: [0.50, 0.35, 0.15]
          }
        ]
      },
      
      // 2. Psychological（心理学的次元）
      {
        name: 'psychographics',
        type: 'composite',
        description: '心理学的特性・価値観',
        required: true,
        components: [
          {
            name: 'personality',
            type: 'composite',
            description: 'Big Five性格特性',
            required: true,
            components: [
              {
                name: 'openness',
                type: 'numerical',
                description: '開放性',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'conscientiousness',
                type: 'numerical',
                description: '誠実性',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'extraversion',
                type: 'numerical',
                description: '外向性',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'agreeableness',
                type: 'numerical',
                description: '協調性',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'neuroticism',
                type: 'numerical',
                description: '神経症傾向',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              }
            ]
          },
          {
            name: 'values',
            type: 'composite',
            description: '価値観マトリックス',
            required: true,
            components: [
              {
                name: 'achievement',
                type: 'numerical',
                description: '達成志向',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'security',
                type: 'numerical',
                description: '安定志向',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'social',
                type: 'numerical',
                description: '社会志向',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              },
              {
                name: 'independence',
                type: 'numerical',
                description: '独立志向',
                required: true,
                min: 0,
                max: 1,
                distribution: 'normal'
              }
            ]
          },
          {
            name: 'motivations',
            type: 'categorical',
            description: '主要動機',
            required: true,
            values: ['intrinsic', 'extrinsic', 'balanced'],
            distribution: [0.30, 0.30, 0.40]
          }
        ]
      },
      
      // 3. Behavioral（行動特性次元）
      {
        name: 'behavioral',
        type: 'composite',
        description: '行動パターン・傾向',
        required: true,
        components: [
          {
            name: 'digitalNative',
            type: 'numerical',
            description: 'デジタル習熟度',
            required: true,
            min: 0,
            max: 1,
            distribution: 'skewed'
          },
          {
            name: 'decisionMaking',
            type: 'categorical',
            description: '意思決定スタイル',
            required: true,
            values: ['logical', 'emotional', 'balanced', 'impulsive'],
            distribution: [0.25, 0.25, 0.40, 0.10]
          },
          {
            name: 'feedbackStyle',
            type: 'categorical',
            description: 'フィードバック傾向',
            required: true,
            values: ['critical', 'supportive', 'constructive', 'passive'],
            distribution: [0.20, 0.25, 0.45, 0.10]
          },
          {
            name: 'engagementLevel',
            type: 'categorical',
            description: 'エンゲージメントレベル',
            required: true,
            values: ['low', 'medium', 'high', 'very-high'],
            distribution: [0.20, 0.50, 0.25, 0.05]
          },
          {
            name: 'riskTolerance',
            type: 'numerical',
            description: 'リスク許容度',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          }
        ]
      },
      
      // 4. Contextual（文脈的次元）
      {
        name: 'contextual',
        type: 'composite',
        description: '現在の状況・文脈',
        required: true,
        components: [
          {
            name: 'currentLifeStage',
            type: 'categorical',
            description: '人生段階',
            required: true,
            values: [
              'student', 'early-career', 'mid-career', 'senior-career',
              'transition', 'parenting', 'empty-nest', 'retirement'
            ],
            distribution: [0.10, 0.20, 0.25, 0.15, 0.10, 0.10, 0.05, 0.05]
          },
          {
            name: 'stressLevel',
            type: 'categorical',
            description: 'ストレスレベル',
            required: true,
            values: ['low', 'medium', 'high', 'extreme'],
            distribution: [0.25, 0.50, 0.20, 0.05]
          },
          {
            name: 'timeAvailability',
            type: 'categorical',
            description: '時間的余裕',
            required: true,
            values: ['very-busy', 'busy', 'moderate', 'plenty'],
            distribution: [0.15, 0.45, 0.30, 0.10]
          },
          {
            name: 'techExpectation',
            type: 'categorical',
            description: 'テクノロジーへの期待',
            required: true,
            values: ['skeptical', 'cautious', 'optimistic', 'enthusiastic'],
            distribution: [0.10, 0.40, 0.35, 0.15]
          }
        ]
      },
      
      // 5. Cultural（文化的次元）
      {
        name: 'cultural',
        type: 'composite',
        description: '文化的背景・世代',
        required: true,
        components: [
          {
            name: 'generation',
            type: 'categorical',
            description: '世代',
            required: true,
            values: ['gen-z', 'millennial', 'gen-x', 'baby-boomer'],
            distribution: [0.20, 0.35, 0.30, 0.15]
          },
          {
            name: 'culturalBackground',
            type: 'categorical',
            description: '文化的背景',
            required: true,
            values: ['traditional', 'modern', 'progressive', 'mixed'],
            distribution: [0.20, 0.40, 0.25, 0.15]
          },
          {
            name: 'lifestyle',
            type: 'categorical',
            description: 'ライフスタイル',
            required: true,
            values: ['minimalist', 'balanced', 'maximalist', 'sustainable'],
            distribution: [0.15, 0.50, 0.20, 0.15]
          }
        ]
      },
      
      // 6. Experiential（経験的次元）
      {
        name: 'experiential',
        type: 'composite',
        description: '過去の経験・スキル',
        required: true,
        components: [
          {
            name: 'selfDevelopmentHistory',
            type: 'categorical',
            description: '自己啓発経験',
            required: true,
            values: ['extensive', 'moderate', 'minimal', 'none'],
            distribution: [0.15, 0.40, 0.35, 0.10]
          },
          {
            name: 'skepticismLevel',
            type: 'numerical',
            description: '懐疑度',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          },
          {
            name: 'aiAcceptance',
            type: 'categorical',
            description: 'AI受容度',
            required: true,
            values: ['resistant', 'cautious', 'accepting', 'embracing'],
            distribution: [0.10, 0.35, 0.40, 0.15]
          },
          {
            name: 'previousSimilarServices',
            type: 'numerical',
            description: '類似サービス利用経験数',
            required: true,
            min: 0,
            max: 10,
            distribution: 'skewed'
          }
        ]
      },
      
      // 7. Situational（状況的次元）
      {
        name: 'situational',
        type: 'composite',
        description: '現在の具体的状況',
        required: true,
        components: [
          {
            name: 'problemUrgency',
            type: 'categorical',
            description: '問題の緊急性',
            required: true,
            values: ['immediate', 'soon', 'eventually', 'exploring'],
            distribution: [0.10, 0.30, 0.40, 0.20]
          },
          {
            name: 'solutionPreference',
            type: 'categorical',
            description: '解決手法の好み',
            required: true,
            values: ['logical', 'intuitive', 'experiential', 'collaborative'],
            distribution: [0.30, 0.25, 0.25, 0.20]
          },
          {
            name: 'investmentWillingness',
            type: 'categorical',
            description: '投資意欲',
            required: true,
            values: ['free-only', 'low', 'medium', 'high'],
            distribution: [0.30, 0.35, 0.25, 0.10]
          },
          {
            name: 'currentMood',
            type: 'categorical',
            description: '現在の気分',
            required: true,
            values: ['frustrated', 'curious', 'hopeful', 'determined'],
            distribution: [0.20, 0.35, 0.30, 0.15]
          }
        ]
      }
    ];
  }

  /**
   * サービス特化次元の初期化
   */
  private initializeServiceDimensions(): void {
    // HaQei特化次元
    this.serviceSpecificDimensions.set('haqei', [
      {
        name: 'haqeiSpecific',
        type: 'composite',
        description: 'HaQei特化属性',
        required: true,
        components: [
          {
            name: 'easternPhilosophyInterest',
            type: 'numerical',
            description: '東洋哲学への関心',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          },
          {
            name: 'selfAnalysisDepth',
            type: 'categorical',
            description: '自己分析の深さ',
            required: true,
            values: ['surface', 'moderate', 'deep', 'philosophical'],
            distribution: [0.20, 0.40, 0.30, 0.10]
          },
          {
            name: 'strategicThinkingLevel',
            type: 'numerical',
            description: '戦略的思考レベル',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          },
          {
            name: 'changeReadiness',
            type: 'numerical',
            description: '変化への準備度',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          }
        ]
      }
    ]);

    // Eコマース特化次元
    this.serviceSpecificDimensions.set('ecommerce', [
      {
        name: 'ecommerceSpecific',
        type: 'composite',
        description: 'Eコマース特化属性',
        required: true,
        components: [
          {
            name: 'shoppingFrequency',
            type: 'categorical',
            description: '買い物頻度',
            required: true,
            values: ['rare', 'occasional', 'regular', 'frequent'],
            distribution: [0.15, 0.35, 0.35, 0.15]
          },
          {
            name: 'brandLoyalty',
            type: 'numerical',
            description: 'ブランドロイヤリティ',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          },
          {
            name: 'priceSensitivity',
            type: 'numerical',
            description: '価格感度',
            required: true,
            min: 0,
            max: 1,
            distribution: 'skewed'
          }
        ]
      }
    ]);

    // SaaS特化次元
    this.serviceSpecificDimensions.set('saas', [
      {
        name: 'saasSpecific',
        type: 'composite',
        description: 'SaaS特化属性',
        required: true,
        components: [
          {
            name: 'techSavviness',
            type: 'numerical',
            description: '技術精通度',
            required: true,
            min: 0,
            max: 1,
            distribution: 'normal'
          },
          {
            name: 'featureComplexityPreference',
            type: 'categorical',
            description: '機能複雑性の好み',
            required: true,
            values: ['simple', 'balanced', 'advanced'],
            distribution: [0.30, 0.50, 0.20]
          },
          {
            name: 'integrationNeeds',
            type: 'categorical',
            description: '統合ニーズ',
            required: true,
            values: ['standalone', 'moderate', 'extensive'],
            distribution: [0.25, 0.50, 0.25]
          }
        ]
      }
    ]);
  }

  /**
   * 基本次元の取得
   */
  getBaseDimensions(): PersonaDimension[] {
    return [...this.baseDimensions];
  }

  /**
   * サービス特化次元の取得
   */
  getServiceSpecificDimensions(serviceType: string): PersonaDimension[] {
    return this.serviceSpecificDimensions.get(serviceType) || [];
  }

  /**
   * 全次元の取得
   */
  getAllDimensions(serviceType?: string): PersonaDimension[] {
    const base = this.getBaseDimensions();
    if (serviceType) {
      const specific = this.getServiceSpecificDimensions(serviceType);
      return [...base, ...specific];
    }
    return base;
  }

  /**
   * パターンの進化
   */
  async evolvePatterns(insights: any): Promise<void> {
    console.log('📈 次元パターンを進化中...');
    
    // 進化履歴の記録
    this.evolutionHistory.push({
      timestamp: new Date(),
      insights: insights,
      appliedChanges: []
    });

    // 分布の調整
    this.adjustDistributions(insights);
    
    // 新しい値の追加
    this.addNewValues(insights);
    
    // 相関関係の学習
    this.learnCorrelations(insights);
  }

  /**
   * 分布の調整
   */
  private adjustDistributions(insights: any): void {
    // インサイトに基づいて分布を調整
    if (insights.demographicSkew) {
      this.adjustDemographicDistributions(insights.demographicSkew);
    }
  }

  /**
   * 人口統計分布の調整
   */
  private adjustDemographicDistributions(skew: any): void {
    // 年齢分布の調整例
    const ageDimension = this.findDimensionByPath('demographics.age');
    if (ageDimension && skew.ageSkew) {
      // 実際の分布調整ロジック
    }
  }

  /**
   * 新しい値の追加
   */
  private addNewValues(insights: any): void {
    // 新しいカテゴリ値の発見と追加
    if (insights.newCategories) {
      insights.newCategories.forEach((category: any) => {
        this.addCategoryValue(category.dimension, category.value);
      });
    }
  }

  /**
   * カテゴリ値の追加
   */
  private addCategoryValue(dimensionPath: string, newValue: string): void {
    const dimension = this.findDimensionByPath(dimensionPath);
    if (dimension && dimension.type === 'categorical' && dimension.values) {
      if (!dimension.values.includes(newValue)) {
        dimension.values.push(newValue);
        // 分布の再計算
        if (dimension.distribution) {
          const equalWeight = 1 / dimension.values.length;
          dimension.distribution = dimension.values.map(() => equalWeight);
        }
      }
    }
  }

  /**
   * 相関関係の学習
   */
  private learnCorrelations(insights: any): void {
    // 次元間の相関関係を学習し、一貫性ルールを更新
    if (insights.correlations) {
      // 実装省略（相関学習ロジック）
    }
  }

  /**
   * パスによる次元の検索
   */
  private findDimensionByPath(path: string): PersonaDimension | null {
    const parts = path.split('.');
    let current: any = this.baseDimensions;
    
    for (const part of parts) {
      const found = current.find((d: PersonaDimension) => d.name === part);
      if (!found) return null;
      
      if (found.type === 'composite' && found.components) {
        current = found.components;
      } else {
        return found;
      }
    }
    
    return null;
  }

  /**
   * 統計情報の取得
   */
  getStatistics(): any {
    const totalDimensions = this.countDimensions(this.baseDimensions);
    const serviceTypes = Array.from(this.serviceSpecificDimensions.keys());
    
    return {
      baseDimensions: totalDimensions,
      serviceTypes: serviceTypes.length,
      evolutionHistory: this.evolutionHistory.length,
      lastEvolution: this.evolutionHistory[this.evolutionHistory.length - 1]?.timestamp
    };
  }

  /**
   * 次元数のカウント
   */
  private countDimensions(dimensions: PersonaDimension[]): number {
    let count = 0;
    
    dimensions.forEach(dim => {
      count++;
      if (dim.type === 'composite' && dim.components) {
        count += this.countDimensions(dim.components);
      }
    });
    
    return count;
  }
}

export default PersonaDimensions;