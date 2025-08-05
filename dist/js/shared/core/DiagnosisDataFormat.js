// DiagnosisDataFormat.js - HaQei診断データ統一フォーマット定義
// 分人思想に基づくTriple OS分析結果の標準化されたデータ構造

class DiagnosisDataFormat {
  constructor() {
    this.version = '1.0.0';
    this.schema = this.defineSchema();
  }

  // 統一データフォーマットのスキーマ定義
  defineSchema() {
    return {
      // メタデータ
      metadata: {
        version: 'string', // データフォーマットバージョン
        analysisType: 'string', // 'tripleOS' | 'quickAnalysis' | 'professional'
        timestamp: 'string', // ISO 8601形式
        sessionId: 'string', // セッション識別子
        source: 'string' // 'os_analyzer' | 'quick_analyzer' | 'professional_report'
      },

      // 基本診断結果
      basicProfile: {
        primaryHexagram: {
          id: 'number', // 1-64
          name: 'string', // 八卦名（日本語）
          symbol: 'string', // ☰など
          element: 'string', // 五行
          trigrams: {
            upper: 'string',
            lower: 'string'
          }
        },
        personalityType: 'string', // MBTIタイプなど
        coreTraits: 'array', // 主要特性のリスト
        strengthsKeywords: 'array', // 強みキーワード
        challengesKeywords: 'array' // 課題キーワード
      },

      // Triple OS分析結果（os_analyzerの核心データ）
      tripleOS: {
        engineOS: {
          hexagramId: 'number',
          name: 'string',
          description: 'string',
          coreValues: 'array',
          motivation: 'string',
          decisionMaking: 'string',
          energySource: 'string',
          vector: 'object', // 8次元ベクトル
          similarity: 'number', // 類似度スコア
          activation: 'number' // 活性化度
        },
        interfaceOS: {
          hexagramId: 'number',
          name: 'string',
          description: 'string',
          socialStyle: 'string',
          communicationPattern: 'string',
          leadershipStyle: 'string',
          teamRole: 'string',
          conflictResolution: 'string'
        },
        safeModeOS: {
          hexagramId: 'number',
          name: 'string',
          description: 'string',
          stressResponse: 'string',
          copingMechanism: 'string',
          recoveryMethod: 'string',
          supportNeeds: 'string',
          warningSignals: 'array'
        },
        consistencyScore: 'number', // OS間の一貫性スコア
        integration: {
          summary: 'string',
          keyInsights: 'array',
          recommendations: 'array',
          strategicAdvice: 'string'
        }
      },

      // 分析に使用された回答データ
      responses: {
        worldviewAnswers: 'array', // 価値観設問への回答
        scenarioAnswers: 'array', // シナリオ設問への回答
        totalQuestions: 'number',
        completionRate: 'number' // 完答率
      },

      // 分析品質指標
      qualityMetrics: {
        dataCompleteness: 'number', // データ完全性（0-1）
        analysisConfidence: 'number', // 分析信頼度（0-1）
        vectorSimilarity: 'number', // ベクトル類似度
        validationScore: 'number' // 検証スコア
      },

      // 戦略的洞察（プレミアム機能への橋渡し）
      strategicInsights: {
        currentPosition: 'string', // 現在の立ち位置
        futureTrajectories: 'array', // 可能な未来の軌道
        strategicRecommendations: 'array', // 戦略的推奨事項
        premiumUpgradeValue: 'object' // プレミアム版の価値提示
      },

      // 互換性・連携データ
      compatibility: {
        mbtiMapping: 'string', // MBTI対応
        enneagramMapping: 'string', // エニアグラム対応
        strengthsFinderMapping: 'array', // ストレングスファインダー対応
        bigFiveMapping: 'object' // ビッグファイブ対応
      },

      // エクスポート・シェア用メタデータ
      sharing: {
        isExportable: 'boolean',
        shareableElements: 'array', // シェア可能な要素
        privacyLevel: 'string', // 'public' | 'private' | 'limited'
        exportFormats: 'array' // 対応エクスポート形式
      }
    };
  }

  // 診断データの作成
  createDiagnosisData(analysisResult, rawAnswers = [], options = {}) {
    try {
      console.log('🏗️ Creating standardized diagnosis data...');

      const now = new Date().toISOString();
      const sessionId = this.generateSessionId();

      // 基本的な診断データ構造を作成
      const diagnosisData = {
        metadata: {
          version: this.version,
          analysisType: options.analysisType || 'tripleOS',
          timestamp: now,
          sessionId: sessionId,
          source: options.source || 'os_analyzer'
        },

        basicProfile: this.extractBasicProfile(analysisResult),
        tripleOS: this.extractTripleOSData(analysisResult),
        responses: this.processResponses(rawAnswers),
        qualityMetrics: this.calculateQualityMetrics(analysisResult, rawAnswers),
        strategicInsights: this.generateStrategicInsights(analysisResult),
        compatibility: this.mapCompatibility(analysisResult),
        sharing: this.defineSharing(options)
      };

      console.log('✅ Diagnosis data created successfully');
      return diagnosisData;

    } catch (error) {
      console.error('❌ Failed to create diagnosis data:', error);
      throw new Error(`診断データの作成に失敗しました: ${error.message}`);
    }
  }

  // 基本プロフィールの抽出
  extractBasicProfile(analysisResult) {
    const primaryOS = analysisResult.engineOS || analysisResult.primaryOS;
    
    return {
      primaryHexagram: {
        id: primaryOS?.hexagramId || primaryOS?.osId || 1,
        name: primaryOS?.name || '情報不足',
        symbol: this.getHexagramSymbol(primaryOS?.hexagramId || primaryOS?.osId),
        element: this.getElement(primaryOS?.hexagramId || primaryOS?.osId),
        trigrams: this.getTrigrams(primaryOS?.hexagramId || primaryOS?.osId)
      },
      personalityType: this.inferPersonalityType(analysisResult),
      coreTraits: this.extractCoreTraits(analysisResult),
      strengthsKeywords: this.extractStrengths(analysisResult),
      challengesKeywords: this.extractChallenges(analysisResult)
    };
  }

  // Triple OSデータの抽出
  extractTripleOSData(analysisResult) {
    return {
      engineOS: this.normalizeOSData(analysisResult.engineOS, 'engine'),
      interfaceOS: this.normalizeOSData(analysisResult.interfaceOS, 'interface'),
      safeModeOS: this.normalizeOSData(analysisResult.safeModeOS, 'safemode'),
      consistencyScore: analysisResult.consistencyScore || 0,
      integration: {
        summary: analysisResult.integration?.summary || '',
        keyInsights: analysisResult.integration?.keyInsights || [],
        recommendations: analysisResult.integration?.recommendations || [],
        strategicAdvice: analysisResult.integration?.strategicAdvice || ''
      }
    };
  }

  // OSデータの正規化
  normalizeOSData(osData, osType) {
    if (!osData) {
      return {
        hexagramId: 1,
        name: '情報不足',
        description: 'データが不足しています',
        ...this.getDefaultOSFields(osType)
      };
    }

    const baseData = {
      hexagramId: osData.hexagramId || osData.osId || 1,
      name: osData.name || '未定義',
      description: osData.description || osData.summary || ''
    };

    // OSタイプ別の特有フィールドを追加
    switch (osType) {
      case 'engine':
        return {
          ...baseData,
          coreValues: osData.coreValues || [],
          motivation: osData.motivation || '',
          decisionMaking: osData.decisionMaking || '',
          energySource: osData.energySource || '',
          vector: osData.userVector || osData.vector || {},
          similarity: osData.similarity || 0,
          activation: osData.activation || 0
        };

      case 'interface':
        return {
          ...baseData,
          socialStyle: osData.socialStyle || '',
          communicationPattern: osData.communicationPattern || '',
          leadershipStyle: osData.leadershipStyle || '',
          teamRole: osData.teamRole || '',
          conflictResolution: osData.conflictResolution || ''
        };

      case 'safemode':
        return {
          ...baseData,
          stressResponse: osData.stressResponse || '',
          copingMechanism: osData.copingMechanism || '',
          recoveryMethod: osData.recoveryMethod || '',
          supportNeeds: osData.supportNeeds || '',
          warningSignals: osData.warningSignals || []
        };

      default:
        return baseData;
    }
  }

  // デフォルトOSフィールドの取得
  getDefaultOSFields(osType) {
    const defaults = {
      engine: {
        coreValues: ['情報不足'],
        motivation: '情報不足',
        decisionMaking: '情報不足',
        energySource: '情報不足',
        vector: {},
        similarity: 0,
        activation: 0
      },
      interface: {
        socialStyle: '情報不足',
        communicationPattern: '情報不足',
        leadershipStyle: '情報不足',
        teamRole: '情報不足',
        conflictResolution: '情報不足'
      },
      safemode: {
        stressResponse: '情報不足',
        copingMechanism: '情報不足',
        recoveryMethod: '情報不足',
        supportNeeds: '情報不足',
        warningSignals: []
      }
    };

    return defaults[osType] || {};
  }

  // 回答データの処理
  processResponses(rawAnswers) {
    const worldviewAnswers = rawAnswers.filter(a => this.isWorldviewQuestion(a));
    const scenarioAnswers = rawAnswers.filter(a => this.isScenarioQuestion(a));

    return {
      worldviewAnswers: worldviewAnswers,
      scenarioAnswers: scenarioAnswers,
      totalQuestions: rawAnswers.length,
      completionRate: this.calculateCompletionRate(rawAnswers)
    };
  }

  // 品質指標の計算
  calculateQualityMetrics(analysisResult, rawAnswers) {
    return {
      dataCompleteness: this.calculateDataCompleteness(analysisResult, rawAnswers),
      analysisConfidence: this.calculateAnalysisConfidence(analysisResult),
      vectorSimilarity: analysisResult.engineOS?.similarity || 0,
      validationScore: this.calculateValidationScore(analysisResult)
    };
  }

  // 戦略的洞察の生成
  generateStrategicInsights(analysisResult) {
    return {
      currentPosition: this.analyzeCurrentPosition(analysisResult),
      futureTrajectories: this.generateFutureTrajectories(analysisResult),
      strategicRecommendations: this.generateRecommendations(analysisResult),
      premiumUpgradeValue: this.definePremiumValue(analysisResult)
    };
  }

  // プレミアム版の価値提示
  definePremiumValue(analysisResult) {
    const engineOS = analysisResult.engineOS || analysisResult.primaryOS;
    const hexagramId = engineOS?.hexagramId || engineOS?.osId || 1;

    return {
      personalizedReport: {
        available: true,
        description: `あなたの${engineOS?.name || '人格OS'}に特化した詳細戦略レポート`,
        features: [
          '具体的な行動計画（最初の三手）',
          'リスク管理戦略（守りの戦略）',
          '3ヶ月実行ロードマップ',
          '継続サポートシステム'
        ]
      },
      aiConsultation: {
        available: true,
        description: 'Gemini Pro APIによる高精度パーソナライズド分析',
        valueProposition: '一般的な診断を超えた、あなた専用の人生戦略設計'
      },
      pricing: {
        amount: 2980,
        currency: 'JPY',
        description: '6ヶ月間のサポート付き'
      },
      differentiators: [
        '無料版は「分析」、有料版は「実践戦略」',
        '無料版は「知る」、有料版は「行動する」',
        '無料版は「理解」、有料版は「変化」'
      ]
    };
  }

  // 互換性マッピング
  mapCompatibility(analysisResult) {
    const engineOS = analysisResult.engineOS || analysisResult.primaryOS;
    const hexagramId = engineOS?.hexagramId || engineOS?.osId || 1;

    return {
      mbtiMapping: this.mapToMBTI(hexagramId),
      enneagramMapping: this.mapToEnneagram(hexagramId),
      strengthsFinderMapping: this.mapToStrengthsFinder(hexagramId),
      bigFiveMapping: this.mapToBigFive(hexagramId)
    };
  }

  // シェア設定の定義
  defineSharing(options) {
    return {
      isExportable: true,
      shareableElements: [
        'basicProfile',
        'tripleOS.summary',
        'strategicInsights.currentPosition'
      ],
      privacyLevel: options.privacyLevel || 'private',
      exportFormats: ['json', 'pdf', 'summary']
    };
  }

  // データの検証
  validateDiagnosisData(data) {
    const validationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // 必須フィールドの確認
      if (!data.metadata || !data.metadata.version) {
        validationResult.errors.push('メタデータが不足しています');
        validationResult.isValid = false;
      }

      if (!data.basicProfile || !data.basicProfile.primaryHexagram) {
        validationResult.errors.push('基本プロフィールが不足しています');
        validationResult.isValid = false;
      }

      if (!data.tripleOS || !data.tripleOS.engineOS) {
        validationResult.errors.push('Triple OSデータが不足しています');
        validationResult.isValid = false;
      }

      // データ品質の確認
      if (data.qualityMetrics && data.qualityMetrics.dataCompleteness < 0.5) {
        validationResult.warnings.push('データの完全性が低い可能性があります');
      }

      return validationResult;

    } catch (error) {
      validationResult.isValid = false;
      validationResult.errors.push(`検証中にエラーが発生しました: ${error.message}`);
      return validationResult;
    }
  }

  // ヘルパーメソッド群
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isWorldviewQuestion(answer) {
    return answer.questionId && answer.questionId.match(/^q([1-9]|1[0-9]|2[0-4])$/);
  }

  isScenarioQuestion(answer) {
    return answer.questionId && answer.questionId.match(/^q(2[5-9]|30)$/);
  }

  calculateCompletionRate(answers) {
    const expectedQuestions = 30; // 24価値観 + 6シナリオ
    return Math.min(answers.length / expectedQuestions, 1);
  }

  calculateDataCompleteness(analysisResult, rawAnswers) {
    let score = 0;
    if (analysisResult.engineOS) score += 0.4;
    if (analysisResult.interfaceOS) score += 0.3;
    if (analysisResult.safeModeOS) score += 0.3;
    return score;
  }

  calculateAnalysisConfidence(analysisResult) {
    const similarity = analysisResult.engineOS?.similarity || 0;
    const consistency = analysisResult.consistencyScore || 0;
    return (similarity + consistency) / 2;
  }

  calculateValidationScore(analysisResult) {
    // 複数の指標を組み合わせて総合的な検証スコアを算出
    let score = 0;
    
    if (analysisResult.engineOS?.similarity > 0.7) score += 0.3;
    if (analysisResult.consistencyScore > 0.6) score += 0.3;
    if (analysisResult.integration?.keyInsights?.length > 0) score += 0.2;
    if (analysisResult.tripleOS || (analysisResult.engineOS && analysisResult.interfaceOS && analysisResult.safeModeOS)) score += 0.2;
    
    return score;
  }

  // 八卦関連ヘルパー
  getHexagramSymbol(hexagramId) {
    const symbols = {
      1: '☰', 2: '☱', 3: '☲', 4: '☳', 5: '☴', 6: '☵', 7: '☶', 8: '☷'
    };
    return symbols[hexagramId] || '☰';
  }

  getElement(hexagramId) {
    const elements = {
      1: '金', 2: '金', 3: '火', 4: '木', 5: '木', 6: '水', 7: '土', 8: '土'
    };
    return elements[hexagramId] || '土';
  }

  getTrigrams(hexagramId) {
    // 簡略化された三爻マッピング
    const trigrams = {
      1: { upper: '乾', lower: '乾' },
      2: { upper: '兌', lower: '兌' },
      3: { upper: '離', lower: '離' },
      4: { upper: '震', lower: '震' },
      5: { upper: '巽', lower: '巽' },
      6: { upper: '坎', lower: '坎' },
      7: { upper: '艮', lower: '艮' },
      8: { upper: '坤', lower: '坤' }
    };
    return trigrams[hexagramId] || { upper: '乾', lower: '乾' };
  }

  // 簡略化されたマッピング関数群
  extractCoreTraits(analysisResult) {
    const traits = [];
    if (analysisResult.engineOS?.name) traits.push(analysisResult.engineOS.name);
    if (analysisResult.interfaceOS?.name) traits.push(analysisResult.interfaceOS.name);
    if (analysisResult.safeModeOS?.name) traits.push(analysisResult.safeModeOS.name);
    return traits.length > 0 ? traits : ['分析要素不足'];
  }

  extractStrengths(analysisResult) {
    return ['リーダーシップ', '創造性', '適応力']; // プレースホルダー
  }

  extractChallenges(analysisResult) {
    return ['完璧主義', 'ストレス管理', '時間管理']; // プレースホルダー
  }

  inferPersonalityType(analysisResult) {
    return 'ENFP'; // プレースホルダー - 実際は複雑なマッピングが必要
  }

  analyzeCurrentPosition(analysisResult) {
    return '探求期 - 新しい可能性を模索している段階';
  }

  generateFutureTrajectories(analysisResult) {
    return [
      '専門性を深める道',
      '新しい領域への挑戦',
      'チームリーダーとしての成長'
    ];
  }

  generateRecommendations(analysisResult) {
    return [
      '強みを活かせる環境を選択する',
      'ストレス管理の仕組みを構築する',
      '継続的な学習習慣を確立する'
    ];
  }

  // 他システムとのマッピング（プレースホルダー）
  mapToMBTI(hexagramId) { return 'ENFP'; }
  mapToEnneagram(hexagramId) { return 'タイプ7'; }
  mapToStrengthsFinder(hexagramId) { return ['戦略性', '着想', '活発性']; }
  mapToBigFive(hexagramId) {
    return {
      openness: 0.8,
      conscientiousness: 0.6,
      extraversion: 0.7,
      agreeableness: 0.6,
      neuroticism: 0.4
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.DiagnosisDataFormat = DiagnosisDataFormat;
}

console.log('✅ DiagnosisDataFormat loaded - Unified data structure for HaQei diagnosis');