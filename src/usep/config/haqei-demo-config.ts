/**
 * HaQei Demo Configuration
 * 
 * HaQeiシステム検証用のデモ設定
 */

import { ServiceConfig } from '../core/VirtualUserGenerator';
import { PersonaDimension } from '../core/PersonaDimensions';

/**
 * HaQeiデモサービス設定
 */
export const haqeiDemoConfig: ServiceConfig = {
  type: 'haqei',
  name: 'HaQei Analyzer Demo',
  features: [
    'landing-page',
    'quick-analysis',
    'detailed-analysis',
    'future-simulator',
    'os-analysis',
    'strategic-cockpit',
    'bunenjin-navigation',
    'iching-integration'
  ],
  customSettings: {
    tripleOSEnabled: true,
    bunenjinPhilosophy: true,
    ichingSystem: true,
    sevenStageNavigation: true,
    gapVisualization: true
  }
};

/**
 * HaQei向けペルソナプロファイル
 */
export const haqeiPersonaProfiles = [
  {
    name: '戦略思考型経営者',
    weight: 0.2,
    dimensions: {
      demographics: {
        age: { min: 35, max: 55, mean: 45 },
        education: 'high',
        occupation: 'executive'
      },
      psychographics: {
        motivations: ['strategy', 'growth', 'innovation'],
        personality: {
          openness: 0.8,
          conscientiousness: 0.9,
          extraversion: 0.7,
          agreeableness: 0.6,
          neuroticism: 0.3
        }
      },
      behavioral: {
        digitalNative: 0.6,
        riskTolerance: 0.7,
        decisionSpeed: 0.8
      },
      contextual: {
        techExpectation: 'enthusiastic',
        timeAvailability: 'moderate',
        devicePreference: 'desktop'
      }
    }
  },
  {
    name: 'イノベーター起業家',
    weight: 0.15,
    dimensions: {
      demographics: {
        age: { min: 25, max: 40, mean: 32 },
        education: 'high',
        occupation: 'entrepreneur'
      },
      psychographics: {
        motivations: ['innovation', 'disruption', 'growth'],
        personality: {
          openness: 0.95,
          conscientiousness: 0.7,
          extraversion: 0.8,
          agreeableness: 0.5,
          neuroticism: 0.4
        }
      },
      behavioral: {
        digitalNative: 0.9,
        riskTolerance: 0.9,
        decisionSpeed: 0.9
      }
    }
  },
  {
    name: '分析重視コンサルタント',
    weight: 0.25,
    dimensions: {
      demographics: {
        age: { min: 28, max: 45, mean: 35 },
        education: 'high',
        occupation: 'consultant'
      },
      psychographics: {
        motivations: ['analysis', 'optimization', 'insight'],
        personality: {
          openness: 0.7,
          conscientiousness: 0.95,
          extraversion: 0.6,
          agreeableness: 0.7,
          neuroticism: 0.2
        }
      }
    }
  },
  {
    name: '自己探求型プロフェッショナル',
    weight: 0.2,
    dimensions: {
      demographics: {
        age: { min: 30, max: 50, mean: 38 },
        education: 'medium-high',
        occupation: 'professional'
      },
      psychographics: {
        motivations: ['self-discovery', 'balance', 'wisdom'],
        personality: {
          openness: 0.85,
          conscientiousness: 0.8,
          extraversion: 0.5,
          agreeableness: 0.8,
          neuroticism: 0.3
        }
      }
    }
  },
  {
    name: '慎重派マネージャー',
    weight: 0.2,
    dimensions: {
      demographics: {
        age: { min: 35, max: 55, mean: 45 },
        education: 'medium',
        occupation: 'manager'
      },
      psychographics: {
        motivations: ['stability', 'risk-avoidance', 'clarity'],
        personality: {
          openness: 0.4,
          conscientiousness: 0.9,
          extraversion: 0.5,
          agreeableness: 0.7,
          neuroticism: 0.5
        }
      },
      behavioral: {
        digitalNative: 0.4,
        riskTolerance: 0.3,
        decisionSpeed: 0.4
      }
    }
  }
];

/**
 * HaQei特有のタッチポイント設定
 */
export const haqeiTouchPoints = [
  {
    id: 'landing-hero',
    name: 'ランディングページ',
    criticalityLevel: 0.9,
    haqeiSpecific: {
      bunenjinResonance: true,
      tripleOSIntroduction: true
    }
  },
  {
    id: 'quick-analysis-start',
    name: 'クイック分析開始',
    criticalityLevel: 0.95,
    haqeiSpecific: {
      simplifiedEntry: true,
      immediateValue: true
    }
  },
  {
    id: 'hexagram-generation',
    name: '卦生成プロセス',
    criticalityLevel: 0.85,
    haqeiSpecific: {
      ichingAccuracy: true,
      visualPresentation: true
    }
  },
  {
    id: 'os-analysis-reveal',
    name: 'OS分析表示',
    criticalityLevel: 0.9,
    haqeiSpecific: {
      tripleOSVisualization: true,
      gapHighlight: true
    }
  },
  {
    id: 'future-simulator-entry',
    name: '未来シミュレーター',
    criticalityLevel: 0.8,
    haqeiSpecific: {
      scenarioGeneration: true,
      actionableInsights: true
    }
  }
];

/**
 * 成功メトリクス定義
 */
export const haqeiSuccessMetrics = {
  conversionGoals: {
    quickAnalysisCompletion: 0.7,
    detailedAnalysisEntry: 0.4,
    futureSimulatorUsage: 0.25,
    returnVisit: 0.3
  },
  satisfactionThresholds: {
    minimum: 0.6,
    target: 0.8,
    excellent: 0.9
  },
  engagementMetrics: {
    averageSessionDuration: 600000, // 10分
    pagesPerSession: 5,
    interactionsPerSession: 15
  }
};

/**
 * デモシナリオ設定
 */
export const demoScenarios = {
  small: {
    userCount: 10,
    description: 'クイック検証用',
    duration: '1-2分'
  },
  medium: {
    userCount: 100,
    description: '基本検証用',
    duration: '5-10分'
  },
  large: {
    userCount: 1000,
    description: '本格検証用',
    duration: '30-60分'
  }
};

/**
 * レポート設定
 */
export const reportConfig = {
  includeVisualizations: true,
  detailLevel: 'comprehensive',
  focusAreas: [
    'conversion-funnel',
    'user-satisfaction',
    'pain-points',
    'improvement-opportunities',
    'haqei-specific-insights'
  ],
  exportFormats: ['json', 'html', 'csv']
};