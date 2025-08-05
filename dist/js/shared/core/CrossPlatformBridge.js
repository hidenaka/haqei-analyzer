// CrossPlatformBridge.js - os_analyzer.htmlとindex.htmlの連携機能
// HaQei分人思想フリーミアム戦略統合システム

class CrossPlatformBridge {
  constructor() {
    this.version = '1.0.0';
    this.storageManager = null;
    this.diagnosisDataFormat = null;
    
    this.init();
  }

  // 初期化
  init() {
    try {
      // StorageManagerの初期化
      if (typeof window !== 'undefined' && window.StorageManager) {
        this.storageManager = new window.StorageManager();
      }

      // DiagnosisDataFormatの初期化
      if (typeof window !== 'undefined' && window.DiagnosisDataFormat) {
        this.diagnosisDataFormat = new window.DiagnosisDataFormat();
      }

      console.log('🌉 CrossPlatformBridge initialized successfully');
    } catch (error) {
      console.error('❌ CrossPlatformBridge initialization failed:', error);
    }
  }

  // os_analyzer.htmlでの診断完了時に呼び出される
  async completeDiagnosis(analysisResult, rawAnswers, options = {}) {
    try {
      console.log('🎯 Completing diagnosis and preparing for cross-platform transfer...');

      if (!this.diagnosisDataFormat || !this.storageManager) {
        throw new Error('必要なコンポーネントが初期化されていません');
      }

      // 統一フォーマットで診断データを作成
      const diagnosisData = this.diagnosisDataFormat.createDiagnosisData(
        analysisResult, 
        rawAnswers, 
        {
          analysisType: 'tripleOS',
          source: 'os_analyzer',
          ...options
        }
      );

      // データを保存
      const saved = this.storageManager.saveUnifiedDiagnosisData(diagnosisData);
      if (!saved) {
        throw new Error('診断データの保存に失敗しました');
      }

      // バックアップも作成
      this.storageManager.backupDiagnosisData();

      // 転送可能なデータパッケージを準備
      const transferPackage = this.createTransferPackage(diagnosisData);

      console.log('✅ Diagnosis completed and data prepared for transfer');
      return {
        success: true,
        diagnosisData: diagnosisData,
        transferPackage: transferPackage,
        message: '診断が完了しました。結果をエクスポートまたは他のツールで活用できます。'
      };

    } catch (error) {
      console.error('❌ Diagnosis completion failed:', error);
      throw new Error(`診断の完了処理に失敗しました: ${error.message}`);
    }
  }

  // 転送パッケージの作成
  createTransferPackage(diagnosisData) {
    try {
      // 基本的な転送情報
      const transferPackage = {
        transferId: this.generateTransferId(),
        timestamp: new Date().toISOString(),
        source: 'os_analyzer',
        version: this.version,
        
        // 診断結果サマリー
        summary: {
          primaryOS: diagnosisData.basicProfile?.primaryHexagram?.name || '不明',
          analysisType: diagnosisData.metadata?.analysisType || 'tripleOS',
          qualityScore: diagnosisData.qualityMetrics?.dataCompleteness || 0,
          consistencyScore: diagnosisData.tripleOS?.consistencyScore || 0
        },

        // プレミアム版への誘導情報
        upgradeIncentive: {
          available: true,
          benefits: diagnosisData.strategicInsights?.premiumUpgradeValue || {},
          readyForUpgrade: this.isReadyForUpgrade(diagnosisData)
        },

        // 連携情報
        crossPlatformInfo: {
          compatibleWith: ['index.html', 'professional_report.html', 'future_simulator.html'],
          dataFormatVersion: diagnosisData.metadata?.version || '1.0.0',
          exportFormats: ['json', 'summary', 'csv']
        }
      };

      return transferPackage;

    } catch (error) {
      console.error('❌ Transfer package creation failed:', error);
      return null;
    }
  }

  // index.htmlでの診断データ読み込み
  async loadDiagnosisForIndexPage() {
    try {
      console.log('📋 Loading diagnosis data for index page...');

      if (!this.storageManager) {
        throw new Error('StorageManagerが初期化されていません');
      }

      // 統一フォーマットの診断データを取得
      const diagnosisData = this.storageManager.getUnifiedDiagnosisData();
      if (!diagnosisData) {
        console.log('ℹ️ No diagnosis data found');
        return {
          hasData: false,
          message: 'まだ診断を実行していません。先にOS分析を完了してください。',
          recommendedAction: 'start_diagnosis'
        };
      }

      // データの品質確認
      const qualityCheck = this.assessDataQuality(diagnosisData);
      if (qualityCheck.score < 0.5) {
        console.warn('⚠️ Low quality diagnosis data detected');
        return {
          hasData: true,
          lowQuality: true,
          qualityIssues: qualityCheck.issues,
          message: '診断データの品質が不十分です。再診断をお勧めします。',
          recommendedAction: 'retake_diagnosis'
        };
      }

      // index.html用のデータ構造に変換
      const indexPageData = this.adaptDataForIndexPage(diagnosisData);

      console.log('✅ Diagnosis data loaded successfully for index page');
      return {
        hasData: true,
        diagnosisData: diagnosisData,
        indexPageData: indexPageData,
        qualityScore: qualityCheck.score,
        message: '診断データが正常に読み込まれました。',
        upgradeOptions: this.generateUpgradeOptions(diagnosisData)
      };

    } catch (error) {
      console.error('❌ Failed to load diagnosis data for index page:', error);
      return {
        hasData: false,
        error: error.message,
        message: 'データの読み込みに失敗しました。',
        recommendedAction: 'check_browser_storage'
      };
    }
  }

  // professional_report.htmlへのデータ転送準備
  prepareProfessionalReportData() {
    try {
      console.log('💼 Preparing data for professional report...');

      if (!this.storageManager) {
        throw new Error('StorageManagerが初期化されていません');
      }

      const diagnosisData = this.storageManager.getUnifiedDiagnosisData();
      if (!diagnosisData) {
        throw new Error('診断データが見つかりません');
      }

      // プロフェッショナルレポート用のデータ構造
      const professionalData = {
        // Gemini Pro API用の構造化データ
        profile: {
          primaryOS: diagnosisData.basicProfile?.primaryHexagram,
          tripleOS: diagnosisData.tripleOS,
          personalityType: diagnosisData.basicProfile?.personalityType,
          coreTraits: diagnosisData.basicProfile?.coreTraits || []
        },

        // 分析結果
        analysis: {
          qualityMetrics: diagnosisData.qualityMetrics,
          strategicInsights: diagnosisData.strategicInsights,
          compatibility: diagnosisData.compatibility
        },

        // 回答データ
        responses: diagnosisData.responses,

        // メタデータ
        metadata: {
          ...diagnosisData.metadata,
          preparedFor: 'professional_report',
          preparedAt: new Date().toISOString()
        }
      };

      // professional_report.html用のlocalStorageキーに保存
      const professionalKey = 'professional_report_data';
      this.storageManager.setItem(professionalKey, professionalData);

      console.log('✅ Professional report data prepared successfully');
      return {
        success: true,
        professionalData: professionalData,
        accessKey: professionalKey,
        message: 'プロフェッショナルレポート用のデータが準備されました。'
      };

    } catch (error) {
      console.error('❌ Professional report data preparation failed:', error);
      throw new Error(`プロフェッショナルレポートデータの準備に失敗しました: ${error.message}`);
    }
  }

  // index.html用データ構造への適応
  adaptDataForIndexPage(diagnosisData) {
    try {
      return {
        // ダッシュボード表示用
        dashboard: {
          primaryOS: {
            name: diagnosisData.basicProfile?.primaryHexagram?.name || '不明',
            id: diagnosisData.basicProfile?.primaryHexagram?.id || 1,
            symbol: diagnosisData.basicProfile?.primaryHexagram?.symbol || '☰'
          },
          tripleOS: {
            engine: diagnosisData.tripleOS?.engineOS?.name || '不明',
            interface: diagnosisData.tripleOS?.interfaceOS?.name || '不明',
            safeMode: diagnosisData.tripleOS?.safeModeOS?.name || '不明'
          },
          scores: {
            consistency: diagnosisData.tripleOS?.consistencyScore || 0,
            quality: diagnosisData.qualityMetrics?.dataCompleteness || 0,
            confidence: diagnosisData.qualityMetrics?.analysisConfidence || 0
          }
        },

        // 戦略的洞察
        insights: {
          currentPosition: diagnosisData.strategicInsights?.currentPosition || '',
          recommendations: diagnosisData.strategicInsights?.strategicRecommendations || [],
          futureTrajectories: diagnosisData.strategicInsights?.futureTrajectories || []
        },

        // 互換性情報
        compatibility: {
          mbti: diagnosisData.compatibility?.mbtiMapping || 'UNKNOWN',
          enneagram: diagnosisData.compatibility?.enneagramMapping || '不明',
          strengths: diagnosisData.compatibility?.strengthsFinderMapping || []
        },

        // プレミアム誘導情報
        premium: {
          eligible: this.isReadyForUpgrade(diagnosisData),
          value: diagnosisData.strategicInsights?.premiumUpgradeValue || {},
          pricing: { amount: 2980, currency: 'JPY' }
        }
      };

    } catch (error) {
      console.error('❌ Data adaptation for index page failed:', error);
      return null;
    }
  }

  // データ品質の評価
  assessDataQuality(diagnosisData) {
    try {
      let score = 0;
      let maxScore = 0;
      const issues = [];

      // メタデータの確認
      maxScore += 1;
      if (diagnosisData.metadata && diagnosisData.metadata.version) {
        score += 1;
      } else {
        issues.push('メタデータが不完全です');
      }

      // 基本プロフィールの確認
      maxScore += 2;
      if (diagnosisData.basicProfile && diagnosisData.basicProfile.primaryHexagram) {
        score += 2;
      } else {
        issues.push('基本プロフィールが不足しています');
      }

      // Triple OSの確認
      maxScore += 3;
      if (diagnosisData.tripleOS) {
        if (diagnosisData.tripleOS.engineOS) score += 1;
        if (diagnosisData.tripleOS.interfaceOS) score += 1;
        if (diagnosisData.tripleOS.safeModeOS) score += 1;
        
        if (score < maxScore) {
          issues.push('Triple OS分析が不完全です');
        }
      } else {
        issues.push('Triple OSデータが存在しません');
      }

      // 回答データの確認
      maxScore += 1;
      if (diagnosisData.responses && diagnosisData.responses.totalQuestions > 20) {
        score += 1;
      } else {
        issues.push('回答データが不足しています');
      }

      const finalScore = maxScore > 0 ? (score / maxScore) : 0;

      return {
        score: finalScore,
        issues: issues,
        isHighQuality: finalScore >= 0.8,
        isAcceptable: finalScore >= 0.5
      };

    } catch (error) {
      console.error('❌ Data quality assessment failed:', error);
      return {
        score: 0,
        issues: ['品質評価に失敗しました'],
        isHighQuality: false,
        isAcceptable: false
      };
    }
  }

  // プレミアム版アップグレード可能性の判定
  isReadyForUpgrade(diagnosisData) {
    try {
      const qualityCheck = this.assessDataQuality(diagnosisData);
      const hasEngineOS = diagnosisData.tripleOS?.engineOS?.hexagramId;
      const hasBasicProfile = diagnosisData.basicProfile?.primaryHexagram?.id;

      return qualityCheck.isAcceptable && hasEngineOS && hasBasicProfile;

    } catch (error) {
      console.warn('⚠️ Upgrade readiness check failed:', error);
      return false;
    }
  }

  // アップグレードオプションの生成
  generateUpgradeOptions(diagnosisData) {
    try {
      const canUpgrade = this.isReadyForUpgrade(diagnosisData);
      
      if (!canUpgrade) {
        return {
          available: false,
          reason: 'より詳細な診断データが必要です',
          recommendation: 'OS分析を完了してください'
        };
      }

      const engineOS = diagnosisData.tripleOS?.engineOS;
      const upgradeValue = diagnosisData.strategicInsights?.premiumUpgradeValue || {};

      return {
        available: true,
        personalizedOffer: {
          targetOS: engineOS?.name || '不明',
          specificBenefits: [
            `${engineOS?.name || 'あなたの人格OS'}に特化した実践戦略`,
            'Gemini Pro AIによる高精度分析',
            '3ヶ月実行ロードマップ',
            '継続サポートシステム'
          ]
        },
        pricing: upgradeValue.pricing || { amount: 2980, currency: 'JPY' },
        valueProposition: upgradeValue.differentiators || [
          '無料版は「分析」、有料版は「実践戦略」',
          '無料版は「知る」、有料版は「行動する」',
          '無料版は「理解」、有料版は「変化」'
        ],
        nextSteps: [
          'professional_report.htmlで詳細分析を受ける',
          'future_simulator.htmlで戦略シミュレーションを実行する',
          'cockpit.htmlで統合管理を開始する'
        ]
      };

    } catch (error) {
      console.error('❌ Upgrade options generation failed:', error);
      return { available: false, reason: 'エラーが発生しました' };
    }
  }

  // データエクスポート（ユーザー向け）
  async exportDiagnosisData(format = 'json') {
    try {
      console.log(`📤 Exporting diagnosis data in ${format} format...`);

      if (!this.storageManager) {
        throw new Error('StorageManagerが初期化されていません');
      }

      const exportedData = this.storageManager.exportDiagnosisData(format);
      if (!exportedData) {
        throw new Error('エクスポートするデータがありません');
      }

      // ファイル名の生成
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `haqei_diagnosis_${timestamp}.${this.getFileExtension(format)}`;

      console.log('✅ Diagnosis data exported successfully');
      return {
        success: true,
        data: exportedData,
        filename: filename,
        format: format,
        size: exportedData.length,
        message: 'データのエクスポートが完了しました。'
      };

    } catch (error) {
      console.error('❌ Diagnosis data export failed:', error);
      throw new Error(`データのエクスポートに失敗しました: ${error.message}`);
    }
  }

  // データインポート（ユーザー向け）
  async importDiagnosisData(jsonData) {
    try {
      console.log('📥 Importing diagnosis data...');

      if (!this.storageManager) {
        throw new Error('StorageManagerが初期化されていません');
      }

      const importResult = this.storageManager.importDiagnosisData(jsonData);
      
      console.log('✅ Diagnosis data imported successfully');
      return {
        success: true,
        importResult: importResult,
        message: 'データのインポートが完了しました。',
        nextSteps: [
          'index.htmlで統合結果を確認する',
          'professional_report.htmlで詳細分析を受ける'
        ]
      };

    } catch (error) {
      console.error('❌ Diagnosis data import failed:', error);
      throw new Error(`データのインポートに失敗しました: ${error.message}`);
    }
  }

  // プラットフォーム間の連携状態確認
  checkCrossPlatformStatus() {
    try {
      const summary = this.storageManager?.getDiagnosisDataSummary();
      
      return {
        hasData: !!summary,
        platforms: {
          os_analyzer: summary ? 'データあり' : 'データなし',
          index_html: summary?.canUpgrade ? '利用可能' : '要診断',
          professional_report: summary?.canUpgrade ? '利用可能' : '要診断',
          future_simulator: summary ? '利用可能' : '要診断'
        },
        dataQuality: summary?.qualityScore || 0,
        lastUpdate: summary?.timestamp || null,
        recommendations: this.generateCrossPlatformRecommendations(summary)
      };

    } catch (error) {
      console.error('❌ Cross-platform status check failed:', error);
      return {
        hasData: false,
        error: error.message,
        platforms: {},
        recommendations: ['システムの再初期化を試してください']
      };
    }
  }

  // プラットフォーム間連携の推奨事項生成
  generateCrossPlatformRecommendations(summary) {
    const recommendations = [];

    if (!summary) {
      recommendations.push('まずはOS分析診断を完了してください');
      recommendations.push('os_analyzer.htmlで詳細分析を実行してください');
    } else {
      if (summary.qualityScore < 0.7) {
        recommendations.push('診断の品質向上のため、再診断をお勧めします');
      }
      
      if (summary.canUpgrade) {
        recommendations.push('プロフェッショナルレポートで詳細戦略を取得してください');
        recommendations.push('未来シミュレーターで戦略的選択を探索してください');
      }
      
      recommendations.push('統合ダッシュボードで全体状況を確認してください');
    }

    return recommendations;
  }

  // ヘルパーメソッド
  generateTransferId() {
    return `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getFileExtension(format) {
    const extensions = {
      json: 'json',
      summary: 'txt',
      csv: 'csv'
    };
    return extensions[format] || 'txt';
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
  window.CrossPlatformBridge = CrossPlatformBridge;
}

console.log('✅ CrossPlatformBridge loaded - Unified data transfer system for HaQei platforms');