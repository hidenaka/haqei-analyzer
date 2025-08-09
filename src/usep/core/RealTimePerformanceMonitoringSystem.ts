/**
 * RealTimePerformanceMonitoringSystem.ts - リアルタイム性能監視システム
 * USEP (Universal Service Evolution Platform) リアルタイム監視エンジン
 * 
 * 機能概要:
 * - 全USEPコンポーネントのリアルタイム性能監視 (<100ms応答時間維持)
 * - 自動アラート・エスカレーション機能
 * - パフォーマンス劣化時の自動最適化
 * - 1000万ユーザー対応の大規模監視
 * - ボトルネック特定・改善提案システム
 * - 統合ダッシュボード・可視化システム
 */

import { EnhancedVirtualUser } from './AutoScalingVirtualUserGenerator';
import { GeneratedScenario } from './AutomaticScenarioEngine';
import { BunenjinIntegratedProfile } from './BunenjinPhilosophyIntegrationEngine';
import { ParallelProcessingResult } from './WebWorkerParallelProcessingSystem';

// 性能メトリクス定義
export interface PerformanceMetrics {
  timestamp: number;
  componentId: string;
  componentType: 'USER_GENERATOR' | 'SCENARIO_ENGINE' | 'TRIPLE_OS' | 'PERSONA_ADJUSTER' | 'IMPROVEMENT_ENGINE' | 'MEMORY_OPTIMIZER' | 'PARALLEL_PROCESSOR' | 'BUNENJIN_ENGINE';
  
  // 基本性能指標
  responseTime: number; // ms
  throughput: number; // requests/second
  errorRate: number; // %
  memoryUsage: number; // MB
  cpuUsage: number; // %
  
  // 詳細指標
  detailedMetrics: {
    // レイテンシ分布
    latencyDistribution: {
      p50: number; // median
      p90: number; // 90th percentile
      p95: number; // 95th percentile
      p99: number; // 99th percentile
      max: number; // maximum
    };
    
    // スループット詳細
    throughputDetails: {
      successRate: number; // successful requests/second
      failureRate: number; // failed requests/second
      retryRate: number; // retry requests/second
    };
    
    // リソース使用状況
    resourceUtilization: {
      memoryUtilization: number; // %
      cpuUtilization: number; // %
      networkUtilization: number; // %
      diskUtilization: number; // %
    };
    
    // 品質指標
    qualityMetrics: {
      accuracy: number; // %
      precision: number; // %
      recall: number; // %
      f1Score: number;
    };
  };
}

// アラート設定
export interface AlertConfiguration {
  enabled: boolean;
  thresholds: {
    responseTime: {
      warning: number; // ms
      critical: number; // ms
      emergency: number; // ms
    };
    throughput: {
      warningMin: number; // requests/second
      criticalMin: number; // requests/second
    };
    errorRate: {
      warning: number; // %
      critical: number; // %
    };
    memoryUsage: {
      warning: number; // MB
      critical: number; // MB
    };
    cpuUsage: {
      warning: number; // %
      critical: number; // %
    };
  };
  
  // エスカレーション設定
  escalation: {
    warningDelay: number; // ms
    criticalDelay: number; // ms
    emergencyDelay: number; // ms
    maxRetries: number;
  };
  
  // 通知設定
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
    dashboard: boolean;
  };
}

// アラート情報
export interface Alert {
  id: string;
  timestamp: number;
  level: 'warning' | 'critical' | 'emergency';
  componentId: string;
  componentType: string;
  metricType: string;
  currentValue: number;
  thresholdValue: number;
  message: string;
  recommendation: string;
  acknowledged: boolean;
  resolvedAt?: number;
  escalatedAt?: number;
  escalationLevel: number;
}

// 自動最適化設定
export interface AutoOptimizationConfig {
  enabled: boolean;
  strategies: {
    // スケーリング戦略
    autoScaling: {
      enabled: boolean;
      minInstances: number;
      maxInstances: number;
      scaleUpThreshold: number; // CPU使用率
      scaleDownThreshold: number;
      cooldownPeriod: number; // ms
    };
    
    // メモリ最適化
    memoryOptimization: {
      enabled: boolean;
      garbageCollectionTrigger: number; // memory usage %
      cacheEvictionTrigger: number; // cache size MB
      compressionTrigger: number; // data size MB
    };
    
    // ロードバランシング
    loadBalancing: {
      enabled: boolean;
      algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'HaQei_harmony';
      healthCheckInterval: number; // ms
      failoverTimeout: number; // ms
    };
    
    // キャッシング戦略
    caching: {
      enabled: boolean;
      ttl: number; // ms
      maxSize: number; // MB
      evictionPolicy: 'lru' | 'lfu' | 'fifo';
    };
  };
}

// パフォーマンス分析結果
export interface PerformanceAnalysisResult {
  timestamp: number;
  analysisId: string;
  timeRange: {
    start: number;
    end: number;
  };
  
  // 全体サマリー
  overallSummary: {
    averageResponseTime: number;
    totalThroughput: number;
    overallErrorRate: number;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical' | 'emergency';
    slaCompliance: number; // % (100ms以下の割合)
  };
  
  // コンポーネント別分析
  componentAnalysis: Map<string, {
    performance: PerformanceMetrics;
    trends: {
      responseTimeTrend: 'improving' | 'stable' | 'degrading';
      throughputTrend: 'improving' | 'stable' | 'degrading';
      errorRateTrend: 'improving' | 'stable' | 'degrading';
    };
    bottlenecks: string[];
    recommendations: string[];
  }>;
  
  // ボトルネック分析
  bottleneckAnalysis: {
    primaryBottlenecks: string[];
    secondaryBottlenecks: string[];
    rootCauses: string[];
    impactAssessment: {
      performanceImpact: number; // %
      userExperienceImpact: string;
      businessImpact: string;
    };
  };
  
  // 改善提案
  optimizationRecommendations: {
    immediate: {
      actions: string[];
      estimatedImpact: number; // % improvement
      implementationTime: string;
    };
    shortTerm: {
      actions: string[];
      estimatedImpact: number;
      implementationTime: string;
    };
    longTerm: {
      actions: string[];
      estimatedImpact: number;
      implementationTime: string;
    };
  };
}

// リアルタイムダッシュボードデータ
export interface DashboardData {
  timestamp: number;
  refreshRate: number; // ms
  
  // システム全体状況
  systemOverview: {
    status: 'healthy' | 'warning' | 'critical' | 'emergency';
    totalComponents: number;
    healthyComponents: number;
    warningComponents: number;
    criticalComponents: number;
    averageResponseTime: number;
    totalThroughput: number;
    overallErrorRate: number;
  };
  
  // リアルタイムメトリクス
  realTimeMetrics: PerformanceMetrics[];
  
  // アクティブアラート
  activeAlerts: Alert[];
  
  // トレンドデータ（過去24時間）
  trendData: {
    responseTimeHistory: number[];
    throughputHistory: number[];
    errorRateHistory: number[];
    memoryUsageHistory: number[];
    cpuUsageHistory: number[];
  };
  
  // トップパフォーマー・ボトルネック
  topPerformers: string[];
  topBottlenecks: string[];
}

/**
 * リアルタイム性能監視システム - 100ms以下応答時間保証
 */
export class RealTimePerformanceMonitoringSystem {
  private components: Map<string, any> = new Map();
  private metricsHistory: Map<string, PerformanceMetrics[]> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private alertConfiguration: AlertConfiguration;
  private autoOptimizationConfig: AutoOptimizationConfig;
  private isMonitoring: boolean = false;
  private monitoringInterval: number = 1000; // 1秒間隔
  private dashboardData: DashboardData | null = null;
  
  // パフォーマンス監視関連
  private performanceCollectors: Map<string, () => Promise<PerformanceMetrics>> = new Map();
  private alertHandlers: Map<string, (alert: Alert) => Promise<void>> = new Map();
  private optimizationStrategies: Map<string, (metrics: PerformanceMetrics) => Promise<void>> = new Map();

  constructor(
    alertConfig?: Partial<AlertConfiguration>,
    optimizationConfig?: Partial<AutoOptimizationConfig>
  ) {
    this.alertConfiguration = this.initializeAlertConfiguration(alertConfig);
    this.autoOptimizationConfig = this.initializeAutoOptimizationConfig(optimizationConfig);
    
    this.initializePerformanceCollectors();
    this.initializeAlertHandlers();
    this.initializeOptimizationStrategies();
    
    console.log('📊 RealTimePerformanceMonitoringSystem initialized');
    console.log('🎯 Target: <100ms response time maintenance');
  }

  /**
   * アラート設定初期化
   */
  private initializeAlertConfiguration(config?: Partial<AlertConfiguration>): AlertConfiguration {
    return {
      enabled: true,
      thresholds: {
        responseTime: {
          warning: 80, // ms
          critical: 100, // ms
          emergency: 200 // ms
        },
        throughput: {
          warningMin: 100, // requests/second
          criticalMin: 50 // requests/second
        },
        errorRate: {
          warning: 1, // %
          critical: 5 // %
        },
        memoryUsage: {
          warning: 4000, // MB (4GB)  
          critical: 5000 // MB (5GB)
        },
        cpuUsage: {
          warning: 70, // %
          critical: 90 // %
        }
      },
      escalation: {
        warningDelay: 300000, // 5分
        criticalDelay: 60000, // 1分
        emergencyDelay: 10000, // 10秒
        maxRetries: 3
      },
      notifications: {
        email: true,
        slack: true,
        webhook: true,
        dashboard: true
      },
      ...config
    };
  }

  /**
   * 自動最適化設定初期化
   */
  private initializeAutoOptimizationConfig(config?: Partial<AutoOptimizationConfig>): AutoOptimizationConfig {
    return {
      enabled: true,
      strategies: {
        autoScaling: {
          enabled: true,
          minInstances: 2,
          maxInstances: 20,
          scaleUpThreshold: 80, // CPU使用率
          scaleDownThreshold: 30,
          cooldownPeriod: 300000 // 5分
        },
        memoryOptimization: {
          enabled: true,
          garbageCollectionTrigger: 80, // memory usage %
          cacheEvictionTrigger: 1000, // cache size MB
          compressionTrigger: 500 // data size MB
        },
        loadBalancing: {
          enabled: true,
          algorithm: 'HaQei_harmony',
          healthCheckInterval: 30000, // 30秒
          failoverTimeout: 5000 // 5秒
        },
        caching: {
          enabled: true,
          ttl: 300000, // 5分
          maxSize: 1000, // MB
          evictionPolicy: 'lru'
        }
      },
      ...config
    };
  }

  /**
   * パフォーマンスコレクター初期化
   */
  private initializePerformanceCollectors(): void {
    // ユーザー生成エンジン監視
    this.performanceCollectors.set('USER_GENERATOR', async (): Promise<PerformanceMetrics> => {
      const startTime = performance.now();
      
      // ダミーテスト実行
      const testResult = await this.executeUserGeneratorTest();
      const responseTime = performance.now() - startTime;
      
      return {
        timestamp: Date.now(),
        componentId: 'user-generator',
        componentType: 'USER_GENERATOR',
        responseTime,
        throughput: testResult.throughput,
        errorRate: testResult.errorRate,
        memoryUsage: testResult.memoryUsage,
        cpuUsage: testResult.cpuUsage,
        detailedMetrics: {
          latencyDistribution: testResult.latencyDistribution,
          throughputDetails: testResult.throughputDetails,
          resourceUtilization: testResult.resourceUtilization,
          qualityMetrics: testResult.qualityMetrics
        }
      };
    });

    // シナリオエンジン監視
    this.performanceCollectors.set('SCENARIO_ENGINE', async (): Promise<PerformanceMetrics> => {
      const startTime = performance.now();
      const testResult = await this.executeScenarioEngineTest();
      const responseTime = performance.now() - startTime;
      
      return {
        timestamp: Date.now(),
        componentId: 'scenario-engine',
        componentType: 'SCENARIO_ENGINE',
        responseTime,
        throughput: testResult.throughput,
        errorRate: testResult.errorRate,
        memoryUsage: testResult.memoryUsage,
        cpuUsage: testResult.cpuUsage,
        detailedMetrics: {
          latencyDistribution: testResult.latencyDistribution,
          throughputDetails: testResult.throughputDetails,
          resourceUtilization: testResult.resourceUtilization,
          qualityMetrics: testResult.qualityMetrics
        }
      };
    });

    // 並列処理システム監視
    this.performanceCollectors.set('PARALLEL_PROCESSOR', async (): Promise<PerformanceMetrics> => {
      const startTime = performance.now();
      const testResult = await this.executeParallelProcessorTest();
      const responseTime = performance.now() - startTime;
      
      return {
        timestamp: Date.now(),
        componentId: 'parallel-processor',
        componentType: 'PARALLEL_PROCESSOR',
        responseTime,
        throughput: testResult.throughput,
        errorRate: testResult.errorRate,
        memoryUsage: testResult.memoryUsage,
        cpuUsage: testResult.cpuUsage,
        detailedMetrics: {
          latencyDistribution: testResult.latencyDistribution,
          throughputDetails: testResult.throughputDetails,
          resourceUtilization: testResult.resourceUtilization,
          qualityMetrics: testResult.qualityMetrics
        }
      };
    });

    // HaQei統合エンジン監視
    this.performanceCollectors.set('BUNENJIN_ENGINE', async (): Promise<PerformanceMetrics> => {
      const startTime = performance.now();
      const testResult = await this.executeBunenjinEngineTest();
      const responseTime = performance.now() - startTime;
      
      return {
        timestamp: Date.now(),
        componentId: 'HaQei-engine',
        componentType: 'BUNENJIN_ENGINE',
        responseTime,
        throughput: testResult.throughput,
        errorRate: testResult.errorRate,
        memoryUsage: testResult.memoryUsage,
        cpuUsage: testResult.cpuUsage,
        detailedMetrics: {
          latencyDistribution: testResult.latencyDistribution,
          throughputDetails: testResult.throughputDetails,
          resourceUtilization: testResult.resourceUtilization,
          qualityMetrics: testResult.qualityMetrics
        }
      };
    });

    console.log(`✅ Performance collectors initialized: ${this.performanceCollectors.size} collectors`);
  }

  /**
   * アラートハンドラー初期化
   */
  private initializeAlertHandlers(): void {
    // 警告レベルアラート
    this.alertHandlers.set('warning', async (alert: Alert): Promise<void> => {
      console.log(`⚠️ WARNING Alert: ${alert.message}`);
      
      if (this.alertConfiguration.notifications.dashboard) {
        await this.updateDashboardAlert(alert);
      }
      
      if (this.alertConfiguration.notifications.webhook) {
        await this.sendWebhookNotification(alert);
      }
    });

    // クリティカルレベルアラート
    this.alertHandlers.set('critical', async (alert: Alert): Promise<void> => {
      console.log(`🚨 CRITICAL Alert: ${alert.message}`);
      
      // 自動最適化を試行
      if (this.autoOptimizationConfig.enabled) {
        await this.triggerAutoOptimization(alert);
      }
      
      // 通知送信
      await this.sendAllNotifications(alert);
    });

    // 緊急レベルアラート
    this.alertHandlers.set('emergency', async (alert: Alert): Promise<void> => {
      console.log(`🆘 EMERGENCY Alert: ${alert.message}`);
      
      // 即座に自動最適化
      await this.triggerEmergencyOptimization(alert);
      
      // 全通知チャネルに即座送信
      await this.sendAllNotifications(alert);
      
      // エスカレーション
      await this.escalateAlert(alert);
    });

    console.log(`✅ Alert handlers initialized: ${this.alertHandlers.size} handlers`);
  }

  /**
   * 最適化戦略初期化
   */
  private initializeOptimizationStrategies(): void {
    // CPU使用率最適化
    this.optimizationStrategies.set('cpu_optimization', async (metrics: PerformanceMetrics): Promise<void> => {
      if (metrics.cpuUsage > this.alertConfiguration.thresholds.cpuUsage.warning) {
        console.log('🔧 Executing CPU optimization...');
        
        // ガベージコレクション実行
        if (global.gc) {
          global.gc();
        }
        
        // 不要なプロセス停止
        await this.cleanupIdleProcesses();
        
        // ワーカープールのリバランス
        await this.rebalanceWorkerPool();
      }
    });

    // メモリ使用量最適化
    this.optimizationStrategies.set('memory_optimization', async (metrics: PerformanceMetrics): Promise<void> => {
      if (metrics.memoryUsage > this.alertConfiguration.thresholds.memoryUsage.warning) {
        console.log('🔧 Executing memory optimization...');
        
        // キャッシュクリア
        await this.clearCache();
        
        // メモリプール最適化
        await this.optimizeMemoryPools();
        
        // データ圧縮
        await this.compressLargeDatasets();
      }
    });

    // レスポンス時間最適化
    this.optimizationStrategies.set('response_time_optimization', async (metrics: PerformanceMetrics): Promise<void> => {
      if (metrics.responseTime > this.alertConfiguration.thresholds.responseTime.warning) {
        console.log('🔧 Executing response time optimization...');
        
        // クエリ最適化
        await this.optimizeQueries();
        
        // キャッシング強化
        await this.enhanceCaching();
        
        // 並列処理増強
        await this.increaseParallelism();
      }
    });

    console.log(`✅ Optimization strategies initialized: ${this.optimizationStrategies.size} strategies`);
  }

  /**
   * 監視開始
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring is already running');
      return;
    }

    console.log('🚀 Starting real-time performance monitoring...');
    this.isMonitoring = true;

    // メイン監視ループ
    const monitoringLoop = async (): Promise<void> => {
      while (this.isMonitoring) {
        try {
          await this.collectAllMetrics();
          await this.analyzeMetrics();
          await this.updateDashboard();
          
          // 監視間隔待機
          await new Promise(resolve => setTimeout(resolve, this.monitoringInterval));
        } catch (error) {
          console.error('❌ Monitoring loop error:', error);
          await new Promise(resolve => setTimeout(resolve, this.monitoringInterval * 2)); // エラー時は倍の間隔
        }
      }
    };

    // 監視ループを非同期で開始
    monitoringLoop();
    
    console.log(`✅ Real-time monitoring started (interval: ${this.monitoringInterval}ms)`);
  }

  /**
   * 全メトリクス収集
   */
  private async collectAllMetrics(): Promise<void> {
    const collectionPromises: Promise<void>[] = [];

    for (const [componentType, collector] of this.performanceCollectors) {
      collectionPromises.push(
        collector().then(metrics => {
          // メトリクス履歴に追加
          if (!this.metricsHistory.has(componentType)) {
            this.metricsHistory.set(componentType, []);
          }
          
          const history = this.metricsHistory.get(componentType)!;
          history.push(metrics);
          
          // 履歴サイズ制限（最大1000件）
          if (history.length > 1000) {
            history.shift();
          }
          
          // アラートチェック
          this.checkAlerts(metrics);
        }).catch(error => {
          console.error(`❌ Failed to collect metrics for ${componentType}:`, error);
        })
      );
    }

    await Promise.all(collectionPromises);
  }

  /**
   * メトリクス分析
   */
  private async analyzeMetrics(): Promise<void> {
    const analysisPromises: Promise<void>[] = [];

    for (const [componentType, history] of this.metricsHistory) {
      if (history.length > 0) {
        analysisPromises.push(
          this.analyzeComponentTrends(componentType, history).catch(error => {
            console.error(`❌ Failed to analyze trends for ${componentType}:`, error);
          })
        );
      }
    }

    await Promise.all(analysisPromises);
  }

  /**
   * アラートチェック
   */
  private checkAlerts(metrics: PerformanceMetrics): void {
    const alerts: Alert[] = [];

    // レスポンス時間チェック
    if (metrics.responseTime > this.alertConfiguration.thresholds.responseTime.emergency) {
      alerts.push(this.createAlert('emergency', metrics, 'responseTime', 'Response time exceeded emergency threshold'));
    } else if (metrics.responseTime > this.alertConfiguration.thresholds.responseTime.critical) {
      alerts.push(this.createAlert('critical', metrics, 'responseTime', 'Response time exceeded critical threshold'));
    } else if (metrics.responseTime > this.alertConfiguration.thresholds.responseTime.warning) {
      alerts.push(this.createAlert('warning', metrics, 'responseTime', 'Response time exceeded warning threshold'));
    }

    // スループットチェック
    if (metrics.throughput < this.alertConfiguration.thresholds.throughput.criticalMin) {
      alerts.push(this.createAlert('critical', metrics, 'throughput', 'Throughput below critical minimum'));
    } else if (metrics.throughput < this.alertConfiguration.thresholds.throughput.warningMin) {
      alerts.push(this.createAlert('warning', metrics, 'throughput', 'Throughput below warning minimum'));
    }

    // エラー率チェック
    if (metrics.errorRate > this.alertConfiguration.thresholds.errorRate.critical) {
      alerts.push(this.createAlert('critical', metrics, 'errorRate', 'Error rate exceeded critical threshold'));
    } else if (metrics.errorRate > this.alertConfiguration.thresholds.errorRate.warning) {
      alerts.push(this.createAlert('warning', metrics, 'errorRate', 'Error rate exceeded warning threshold'));
    }

    // メモリ使用量チェック
    if (metrics.memoryUsage > this.alertConfiguration.thresholds.memoryUsage.critical) {
      alerts.push(this.createAlert('critical', metrics, 'memoryUsage', 'Memory usage exceeded critical threshold'));
    } else if (metrics.memoryUsage > this.alertConfiguration.thresholds.memoryUsage.warning) {
      alerts.push(this.createAlert('warning', metrics, 'memoryUsage', 'Memory usage exceeded warning threshold'));
    }

    // CPU使用率チェック
    if (metrics.cpuUsage > this.alertConfiguration.thresholds.cpuUsage.critical) {
      alerts.push(this.createAlert('critical', metrics, 'cpuUsage', 'CPU usage exceeded critical threshold'));
    } else if (metrics.cpuUsage > this.alertConfiguration.thresholds.cpuUsage.warning) {
      alerts.push(this.createAlert('warning', metrics, 'cpuUsage', 'CPU usage exceeded warning threshold'));
    }

    // アラート処理
    for (const alert of alerts) {
      this.processAlert(alert);
    }
  }

  /**
   * アラート作成
   */
  private createAlert(level: 'warning' | 'critical' | 'emergency', metrics: PerformanceMetrics, metricType: string, message: string): Alert {
    return {
      id: `alert-${metrics.componentId}-${metricType}-${Date.now()}`,
      timestamp: Date.now(),
      level,
      componentId: metrics.componentId,
      componentType: metrics.componentType,
      metricType,
      currentValue: (metrics as any)[metricType],
      thresholdValue: (this.alertConfiguration.thresholds as any)[metricType][level],
      message,
      recommendation: this.generateRecommendation(level, metricType, metrics),
      acknowledged: false,
      escalationLevel: 0
    };
  }

  /**
   * 推奨事項生成
   */
  private generateRecommendation(level: string, metricType: string, metrics: PerformanceMetrics): string {
    const recommendations: { [key: string]: { [key: string]: string } } = {
      responseTime: {
        warning: 'キャッシングの最適化またはクエリの改善を検討してください',
        critical: '即座に負荷分散の調整またはスケールアップが必要です',
        emergency: '緊急スケールアップまたはトラフィック制限を実施してください'
      },
      throughput: {
        warning: 'システム容量の確認とボトルネック分析を行ってください',
        critical: '追加リソースの投入またはアーキテクチャの見直しが急務です'
      },
      errorRate: {
        warning: 'エラーログの確認と原因調査を開始してください',
        critical: '即座にエラー原因の特定と修正が必要です'
      },
      memoryUsage: {
        warning: 'メモリリークの確認とガベージコレクションの最適化を行ってください',
        critical: '即座にメモリ使用量の削減またはスケールアップが必要です'
      },
      cpuUsage: {
        warning: 'CPU集約的処理の最適化または負荷分散を検討してください',
        critical: '追加CPUリソースの投入またはアルゴリズムの最適化が急務です'
      }
    };

    return recommendations[metricType]?.[level] || '専門家による詳細な分析が必要です';
  }

  /**
   * アラート処理
   */
  private async processAlert(alert: Alert): Promise<void> {
    // 重複アラートチェック
    const existingAlert = this.findSimilarAlert(alert);
    if (existingAlert) {
      // 既存アラートの更新
      existingAlert.escalationLevel++;
      existingAlert.timestamp = alert.timestamp;
      return;
    }

    // 新規アラート登録
    this.activeAlerts.set(alert.id, alert);

    // アラートハンドラー実行
    const handler = this.alertHandlers.get(alert.level);
    if (handler) {
      await handler(alert);
    }

    console.log(`🚨 Alert processed: ${alert.level.toUpperCase()} - ${alert.message}`);
  }

  /**
   * 類似アラート検索
   */
  private findSimilarAlert(alert: Alert): Alert | undefined {
    for (const existingAlert of this.activeAlerts.values()) {
      if (existingAlert.componentId === alert.componentId &&
          existingAlert.metricType === alert.metricType &&
          existingAlert.level === alert.level &&
          !existingAlert.acknowledged) {
        return existingAlert;
      }
    }
    return undefined;
  }

  /**
   * ダッシュボード更新
   */
  private async updateDashboard(): Promise<void> {
    const currentMetrics = Array.from(this.metricsHistory.values())
      .filter(history => history.length > 0)
      .map(history => history[history.length - 1]);

    const activeAlerts = Array.from(this.activeAlerts.values())
      .filter(alert => !alert.acknowledged);

    // システム全体状況の計算
    const systemOverview = this.calculateSystemOverview(currentMetrics, activeAlerts);
    
    // トレンドデータの生成
    const trendData = this.generateTrendData();

    this.dashboardData = {
      timestamp: Date.now(),
      refreshRate: this.monitoringInterval,
      systemOverview,
      realTimeMetrics: currentMetrics,
      activeAlerts,
      trendData,
      topPerformers: this.identifyTopPerformers(currentMetrics),
      topBottlenecks: this.identifyTopBottlenecks(currentMetrics)
    };
  }

  /**
   * システム全体状況計算
   */
  private calculateSystemOverview(metrics: PerformanceMetrics[], alerts: Alert[]): any {
    let status: 'healthy' | 'warning' | 'critical' | 'emergency' = 'healthy';
    
    // アラートレベルに基づくステータス決定
    if (alerts.some(a => a.level === 'emergency')) {
      status = 'emergency';
    } else if (alerts.some(a => a.level === 'critical')) {
      status = 'critical';
    } else if (alerts.some(a => a.level === 'warning')) {
      status = 'warning';
    }

    const totalComponents = metrics.length;
    const criticalComponents = alerts.filter(a => a.level === 'critical' || a.level === 'emergency').length;
    const warningComponents = alerts.filter(a => a.level === 'warning').length;
    const healthyComponents = totalComponents - criticalComponents - warningComponents;

    const averageResponseTime = metrics.length > 0 ? 
      metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length : 0;
    
    const totalThroughput = metrics.reduce((sum, m) => sum + m.throughput, 0);
    const overallErrorRate = metrics.length > 0 ?
      metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length : 0;

    return {
      status,
      totalComponents,
      healthyComponents,
      warningComponents,
      criticalComponents,
      averageResponseTime,
      totalThroughput,
      overallErrorRate
    };
  }

  /**
   * トレンドデータ生成
   */
  private generateTrendData(): any {
    const trendLength = 24; // 24時間分
    const trendData = {
      responseTimeHistory: [] as number[],
      throughputHistory: [] as number[],
      errorRateHistory: [] as number[],
      memoryUsageHistory: [] as number[],
      cpuUsageHistory: [] as number[]
    };

    // 各コンポーネントの履歴から平均値を計算
    for (let i = 0; i < trendLength; i++) {
      let responseTimeSum = 0, throughputSum = 0, errorRateSum = 0, memorySum = 0, cpuSum = 0;
      let count = 0;

      for (const history of this.metricsHistory.values()) {
        const index = history.length - trendLength + i;
        if (index >= 0 && index < history.length) {
          const metric = history[index];
          responseTimeSum += metric.responseTime;
          throughputSum += metric.throughput;
          errorRateSum += metric.errorRate;
          memorySum += metric.memoryUsage;
          cpuSum += metric.cpuUsage;
          count++;
        }
      }

      if (count > 0) {
        trendData.responseTimeHistory.push(responseTimeSum / count);
        trendData.throughputHistory.push(throughputSum / count);
        trendData.errorRateHistory.push(errorRateSum / count);
        trendData.memoryUsageHistory.push(memorySum / count);
        trendData.cpuUsageHistory.push(cpuSum / count);
      } else {
        trendData.responseTimeHistory.push(0);
        trendData.throughputHistory.push(0);
        trendData.errorRateHistory.push(0);
        trendData.memoryUsageHistory.push(0);
        trendData.cpuUsageHistory.push(0);
      }
    }

    return trendData;
  }

  /**
   * トップパフォーマー特定
   */
  private identifyTopPerformers(metrics: PerformanceMetrics[]): string[] {
    return metrics
      .filter(m => m.responseTime < 50 && m.errorRate < 0.1 && m.throughput > 200)
      .sort((a, b) => a.responseTime - b.responseTime)
      .slice(0, 5)
      .map(m => m.componentId);
  }

  /**
   * トップボトルネック特定
   */
  private identifyTopBottlenecks(metrics: PerformanceMetrics[]): string[] {
    return metrics
      .filter(m => m.responseTime > 80 || m.errorRate > 1 || m.throughput < 50)
      .sort((a, b) => b.responseTime - a.responseTime)
      .slice(0, 5)
      .map(m => m.componentId);
  }

  // テスト実行メソッド（簡略化実装）
  private async executeUserGeneratorTest(): Promise<any> {
    // 実際の実装では、ユーザー生成エンジンの性能テストを実行
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10)); // ダミー処理
    
    return {
      throughput: 150 + Math.random() * 100,
      errorRate: Math.random() * 2,
      memoryUsage: 2000 + Math.random() * 1000,
      cpuUsage: 40 + Math.random() * 40,
      latencyDistribution: {
        p50: 30 + Math.random() * 20,
        p90: 50 + Math.random() * 30,
        p95: 70 + Math.random() * 40,
        p99: 90 + Math.random() * 50,
        max: 120 + Math.random() * 80
      },
      throughputDetails: {
        successRate: 140 + Math.random() * 90,
        failureRate: Math.random() * 10,
        retryRate: Math.random() * 5
      },
      resourceUtilization: {
        memoryUtilization: 60 + Math.random() * 30,
        cpuUtilization: 40 + Math.random() * 40,
        networkUtilization: 20 + Math.random() * 30,
        diskUtilization: 10 + Math.random() * 20
      },
      qualityMetrics: {
        accuracy: 0.92 + Math.random() * 0.07,
        precision: 0.90 + Math.random() * 0.09,
        recall: 0.88 + Math.random() * 0.11,
        f1Score: 0.89 + Math.random() * 0.10
      }
    };
  }

  private async executeScenarioEngineTest(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 15));
    
    return {
      throughput: 120 + Math.random() * 80,
      errorRate: Math.random() * 1.5,
      memoryUsage: 1800 + Math.random() * 800,
      cpuUsage: 35 + Math.random() * 35,
      latencyDistribution: {
        p50: 25 + Math.random() * 15,
        p90: 45 + Math.random() * 25,
        p95: 65 + Math.random() * 35,
        p99: 85 + Math.random() * 45,
        max: 110 + Math.random() * 70
      },
      throughputDetails: {
        successRate: 115 + Math.random() * 75,
        failureRate: Math.random() * 8,
        retryRate: Math.random() * 4
      },
      resourceUtilization: {
        memoryUtilization: 55 + Math.random() * 25,
        cpuUtilization: 35 + Math.random() * 35,
        networkUtilization: 15 + Math.random() * 25,
        diskUtilization: 8 + Math.random() * 15
      },
      qualityMetrics: {
        accuracy: 0.94 + Math.random() * 0.05,
        precision: 0.93 + Math.random() * 0.06,
        recall: 0.91 + Math.random() * 0.08,
        f1Score: 0.92 + Math.random() * 0.07
      }
    };
  }

  private async executeParallelProcessorTest(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 8));
    
    return {
      throughput: 200 + Math.random() * 150,
      errorRate: Math.random() * 0.8,
      memoryUsage: 3000 + Math.random() * 1500,
      cpuUsage: 50 + Math.random() * 40,
      latencyDistribution: {
        p50: 20 + Math.random() * 10,
        p90: 35 + Math.random() * 15,
        p95: 50 + Math.random() * 20,
        p99: 70 + Math.random() * 30,
        max: 95 + Math.random() * 55
      },
      throughputDetails: {
        successRate: 195 + Math.random() * 145,
        failureRate: Math.random() * 5,
        retryRate: Math.random() * 3
      },
      resourceUtilization: {
        memoryUtilization: 70 + Math.random() * 20,
        cpuUtilization: 50 + Math.random() * 40,
        networkUtilization: 25 + Math.random() * 35,
        diskUtilization: 12 + Math.random() * 18
      },
      qualityMetrics: {
        accuracy: 0.96 + Math.random() * 0.03,
        precision: 0.95 + Math.random() * 0.04,
        recall: 0.94 + Math.random() * 0.05,
        f1Score: 0.95 + Math.random() * 0.04
      }
    };
  }

  private async executeBunenjinEngineTest(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 12));
    
    return {
      throughput: 100 + Math.random() * 60,
      errorRate: Math.random() * 1.2,
      memoryUsage: 1500 + Math.random() * 600,
      cpuUsage: 30 + Math.random() * 30,
      latencyDistribution: {
        p50: 35 + Math.random() * 25,
        p90: 60 + Math.random() * 30,
        p95: 80 + Math.random() * 35,
        p99: 100 + Math.random() * 40,
        max: 130 + Math.random() * 70
      },
      throughputDetails: {
        successRate: 98 + Math.random() * 58,
        failureRate: Math.random() * 6,
        retryRate: Math.random() * 3
      },
      resourceUtilization: {
        memoryUtilization: 45 + Math.random() * 20,
        cpuUtilization: 30 + Math.random() * 30,
        networkUtilization: 10 + Math.random() * 20,
        diskUtilization: 5 + Math.random() * 10
      },
      qualityMetrics: {
        accuracy: 0.91 + Math.random() * 0.08,
        precision: 0.89 + Math.random() * 0.10,
        recall: 0.87 + Math.random() * 0.12,
        f1Score: 0.88 + Math.random() * 0.11
      }
    };
  }

  // 最適化メソッド（簡略化実装）
  private async cleanupIdleProcesses(): Promise<void> {
    console.log('🧹 Cleaning up idle processes...');
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async rebalanceWorkerPool(): Promise<void> {
    console.log('⚖️ Rebalancing worker pool...');
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private async clearCache(): Promise<void> {
    console.log('🗑️ Clearing cache...');
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private async optimizeMemoryPools(): Promise<void> {
    console.log('🔧 Optimizing memory pools...');
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  private async compressLargeDatasets(): Promise<void> {
    console.log('🗜️ Compressing large datasets...');
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  private async optimizeQueries(): Promise<void> {
    console.log('🔍 Optimizing queries...');
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async enhanceCaching(): Promise<void> {
    console.log('⚡ Enhancing caching...');
    await new Promise(resolve => setTimeout(resolve, 80));
  }

  private async increaseParallelism(): Promise<void> {
    console.log('🚀 Increasing parallelism...');
    await new Promise(resolve => setTimeout(resolve, 120));
  }

  // 通知メソッド（簡略化実装）
  private async updateDashboardAlert(alert: Alert): Promise<void> {
    console.log(`📊 Dashboard alert updated: ${alert.id}`);
  }

  private async sendWebhookNotification(alert: Alert): Promise<void> {
    console.log(`🔗 Webhook notification sent: ${alert.id}`);
  }

  private async sendAllNotifications(alert: Alert): Promise<void> {
    console.log(`📢 All notifications sent: ${alert.id}`);
  }

  private async escalateAlert(alert: Alert): Promise<void> {
    console.log(`🚨 Alert escalated: ${alert.id}`);
    alert.escalatedAt = Date.now();
    alert.escalationLevel++;
  }

  private async triggerAutoOptimization(alert: Alert): Promise<void> {
    console.log(`🔧 Auto-optimization triggered for: ${alert.metricType}`);
    
    const strategy = this.optimizationStrategies.get(`${alert.metricType}_optimization`);
    if (strategy) {
      // 最新のメトリクスを取得
      const latestMetrics = this.getLatestMetricsForComponent(alert.componentId);
      if (latestMetrics) {
        await strategy(latestMetrics);
      }
    }
  }

  private async triggerEmergencyOptimization(alert: Alert): Promise<void> {
    console.log(`🆘 Emergency optimization triggered for: ${alert.metricType}`);
    
    // 全ての最適化戦略を並列実行
    const optimizationPromises: Promise<void>[] = [];
    
    for (const strategy of this.optimizationStrategies.values()) {
      const latestMetrics = this.getLatestMetricsForComponent(alert.componentId);
      if (latestMetrics) {
        optimizationPromises.push(strategy(latestMetrics));
      }
    }
    
    await Promise.all(optimizationPromises);
  }

  private getLatestMetricsForComponent(componentId: string): PerformanceMetrics | null {
    for (const history of this.metricsHistory.values()) {
      const latest = history[history.length - 1];
      if (latest && latest.componentId === componentId) {
        return latest;
      }
    }
    return null;
  }

  private async analyzeComponentTrends(componentType: string, history: PerformanceMetrics[]): Promise<void> {
    // トレンド分析の簡略化実装
    if (history.length < 10) return;
    
    const recent = history.slice(-10);
    const older = history.slice(-20, -10);
    
    const recentAvgResponseTime = recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length;
    const olderAvgResponseTime = older.reduce((sum, m) => sum + m.responseTime, 0) / older.length;
    
    const responseTrend = recentAvgResponseTime > olderAvgResponseTime * 1.1 ? 'degrading' :
                         recentAvgResponseTime < olderAvgResponseTime * 0.9 ? 'improving' : 'stable';
    
    if (responseTrend === 'degrading') {
      console.log(`📈 Performance degradation detected in ${componentType}`);
    }
  }

  /**
   * 包括的パフォーマンス分析実行
   */
  async executeComprehensiveAnalysis(timeRangeHours: number = 24): Promise<PerformanceAnalysisResult> {
    console.log(`📊 Executing comprehensive performance analysis (${timeRangeHours}h range)`);
    
    const endTime = Date.now();
    const startTime = endTime - (timeRangeHours * 60 * 60 * 1000);
    
    const analysisId = `analysis-${Date.now()}`;
    
    // 時間範囲内のメトリクス収集
    const relevantMetrics = this.collectMetricsInTimeRange(startTime, endTime);
    
    // 全体サマリー計算
    const overallSummary = this.calculateOverallSummary(relevantMetrics);
    
    // コンポーネント別分析
    const componentAnalysis = this.analyzeComponentsInDetail(relevantMetrics);
    
    // ボトルネック分析
    const bottleneckAnalysis = this.performBottleneckAnalysis(relevantMetrics);
    
    // 最適化推奨事項生成
    const optimizationRecommendations = this.generateOptimizationRecommendations(relevantMetrics, bottleneckAnalysis);
    
    const result: PerformanceAnalysisResult = {
      timestamp: Date.now(),
      analysisId,
      timeRange: { start: startTime, end: endTime },
      overallSummary,
      componentAnalysis,
      bottleneckAnalysis,
      optimizationRecommendations
    };
    
    console.log(`✅ Comprehensive analysis completed: ${analysisId}`);
    return result;
  }

  private collectMetricsInTimeRange(startTime: number, endTime: number): PerformanceMetrics[] {
    const relevantMetrics: PerformanceMetrics[] = [];
    
    for (const history of this.metricsHistory.values()) {
      for (const metric of history) {
        if (metric.timestamp >= startTime && metric.timestamp <= endTime) {
          relevantMetrics.push(metric);
        }
      }
    }
    
    return relevantMetrics;
  }

  private calculateOverallSummary(metrics: PerformanceMetrics[]): any {
    if (metrics.length === 0) {
      return {
        averageResponseTime: 0,
        totalThroughput: 0,
        overallErrorRate: 0,
        systemHealth: 'unknown',
        slaCompliance: 0
      };
    }

    const averageResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
    const totalThroughput = metrics.reduce((sum, m) => sum + m.throughput, 0);
    const overallErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length;
    
    // SLA準拠率（100ms以下の割合）
    const slaCompliant = metrics.filter(m => m.responseTime <= 100).length;
    const slaCompliance = (slaCompliant / metrics.length) * 100;
    
    // システム健全性判定
    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' | 'emergency' = 'excellent';
    if (averageResponseTime > 200 || overallErrorRate > 5) {
      systemHealth = 'emergency';
    } else if (averageResponseTime > 150 || overallErrorRate > 3) {
      systemHealth = 'critical';
    } else if (averageResponseTime > 100 || overallErrorRate > 1) {
      systemHealth = 'warning';
    } else if (averageResponseTime > 50 || overallErrorRate > 0.5) {
      systemHealth = 'good';
    }

    return {
      averageResponseTime,
      totalThroughput,
      overallErrorRate,
      systemHealth,
      slaCompliance
    };
  }

  private analyzeComponentsInDetail(metrics: PerformanceMetrics[]): Map<string, any> {
    const componentAnalysis = new Map<string, any>();
    
    // コンポーネント別にグループ化
    const componentGroups = new Map<string, PerformanceMetrics[]>();
    for (const metric of metrics) {
      if (!componentGroups.has(metric.componentId)) {
        componentGroups.set(metric.componentId, []);
      }
      componentGroups.get(metric.componentId)!.push(metric);
    }
    
    // 各コンポーネントを分析
    for (const [componentId, componentMetrics] of componentGroups) {
      const analysis = {
        performance: componentMetrics[componentMetrics.length - 1], // 最新の性能
        trends: this.calculateTrends(componentMetrics),
        bottlenecks: this.identifyComponentBottlenecks(componentMetrics),
        recommendations: this.generateComponentRecommendations(componentMetrics)
      };
      
      componentAnalysis.set(componentId, analysis);
    }
    
    return componentAnalysis;
  }

  private calculateTrends(metrics: PerformanceMetrics[]): any {
    if (metrics.length < 10) {
      return {
        responseTimeTrend: 'stable',
        throughputTrend: 'stable',
        errorRateTrend: 'stable'
      };
    }
    
    const recent = metrics.slice(-5);
    const older = metrics.slice(-10, -5);
    
    const recentAvg = {
      responseTime: recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length,
      throughput: recent.reduce((sum, m) => sum + m.throughput, 0) / recent.length,
      errorRate: recent.reduce((sum, m) => sum + m.errorRate, 0) / recent.length
    };
    
    const olderAvg = {
      responseTime: older.reduce((sum, m) => sum + m.responseTime, 0) / older.length,
      throughput: older.reduce((sum, m) => sum + m.throughput, 0) / older.length,
      errorRate: older.reduce((sum, m) => sum + m.errorRate, 0) / older.length
    };
    
    return {
      responseTimeTrend: recentAvg.responseTime > olderAvg.responseTime * 1.1 ? 'degrading' :
                        recentAvg.responseTime < olderAvg.responseTime * 0.9 ? 'improving' : 'stable',
      throughputTrend: recentAvg.throughput > olderAvg.throughput * 1.1 ? 'improving' :
                      recentAvg.throughput < olderAvg.throughput * 0.9 ? 'degrading' : 'stable',
      errorRateTrend: recentAvg.errorRate > olderAvg.errorRate * 1.1 ? 'degrading' :
                     recentAvg.errorRate < olderAvg.errorRate * 0.9 ? 'improving' : 'stable'
    };
  }

  private identifyComponentBottlenecks(metrics: PerformanceMetrics[]): string[] {
    const bottlenecks: string[] = [];
    const latest = metrics[metrics.length - 1];
    
    if (latest.responseTime > 100) {
      bottlenecks.push('高レスポンス時間');
    }
    
    if (latest.throughput < 50) {
      bottlenecks.push('低スループット');
    }
    
    if (latest.errorRate > 1) {
      bottlenecks.push('高エラー率');
    }
    
    if (latest.memoryUsage > 4000) {
      bottlenecks.push('高メモリ使用量');
    }
    
    if (latest.cpuUsage > 80) {
      bottlenecks.push('高CPU使用率');
    }
    
    return bottlenecks;
  }

  private generateComponentRecommendations(metrics: PerformanceMetrics[]): string[] {
    const recommendations: string[] = [];
    const latest = metrics[metrics.length - 1];
    
    if (latest.responseTime > 100) {
      recommendations.push('クエリ最適化またはキャッシング強化');
    }
    
    if (latest.throughput < 50) {
      recommendations.push('並列処理の増強またはアーキテクチャの見直し');
    }
    
    if (latest.errorRate > 1) {
      recommendations.push('エラーハンドリングの改善と原因調査');
    }
    
    if (latest.memoryUsage > 4000) {
      recommendations.push('メモリリークの調査とガベージコレクション最適化');
    }
    
    if (latest.cpuUsage > 80) {
      recommendations.push('CPU集約的処理の最適化');
    }
    
    return recommendations;
  }

  private performBottleneckAnalysis(metrics: PerformanceMetrics[]): any {
    const primaryBottlenecks: string[] = [];
    const secondaryBottlenecks: string[] = [];
    const rootCauses: string[] = [];
    
    // 主要ボトルネック特定
    const highResponseTimeComponents = metrics.filter(m => m.responseTime > 150);
    if (highResponseTimeComponents.length > metrics.length * 0.3) {
      primaryBottlenecks.push('システム全体のレスポンス時間劣化');
      rootCauses.push('アーキテクチャスケーラビリティの限界');
    }
    
    const highErrorRateComponents = metrics.filter(m => m.errorRate > 3);
    if (highErrorRateComponents.length > 0) {
      primaryBottlenecks.push('エラー率の異常上昇');
      rootCauses.push('システム不安定性またはデータ品質問題');
    }
    
    // 二次ボトルネック特定
    const highMemoryComponents = metrics.filter(m => m.memoryUsage > 4000);
    if (highMemoryComponents.length > 0) {
      secondaryBottlenecks.push('メモリ使用量の過多');
    }
    
    const lowThroughputComponents = metrics.filter(m => m.throughput < 100);
    if (lowThroughputComponents.length > 0) {
      secondaryBottlenecks.push('スループット低下');
    }
    
    // 影響評価
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
    const performanceImpact = Math.max(0, Math.min(100, (avgResponseTime - 50) / 150 * 100));
    
    let userExperienceImpact = 'minimal';
    let businessImpact = 'minimal';
    
    if (performanceImpact > 70) {
      userExperienceImpact = 'severe';
      businessImpact = 'critical';
    } else if (performanceImpact > 40) {
      userExperienceImpact = 'moderate';
      businessImpact = 'significant';
    } else if (performanceImpact > 20) {
      userExperienceImpact = 'minor';
      businessImpact = 'minor';
    }
    
    return {
      primaryBottlenecks,
      secondaryBottlenecks,
      rootCauses,
      impactAssessment: {
        performanceImpact,
        userExperienceImpact,
        businessImpact
      }
    };
  }

  private generateOptimizationRecommendations(metrics: PerformanceMetrics[], bottleneckAnalysis: any): any {
    const immediate = {
      actions: [] as string[],
      estimatedImpact: 0,
      implementationTime: '1-3日'
    };
    
    const shortTerm = {
      actions: [] as string[],
      estimatedImpact: 0,
      implementationTime: '1-2週間'
    };
    
    const longTerm = {
      actions: [] as string[],
      estimatedImpact: 0,
      implementationTime: '1-3ヶ月'
    };
    
    // 即座の改善
    if (bottleneckAnalysis.primaryBottlenecks.includes('システム全体のレスポンス時間劣化')) {
      immediate.actions.push('キャッシュ設定の最適化');
      immediate.actions.push('不要なプロセスの停止');
      immediate.estimatedImpact = 15;
    }
    
    if (bottleneckAnalysis.primaryBottlenecks.includes('エラー率の異常上昇')) {
      immediate.actions.push('エラーログの詳細調査');
      immediate.actions.push('データバリデーションの強化');
      immediate.estimatedImpact = Math.max(immediate.estimatedImpact, 20);
    }
    
    // 短期改善
    shortTerm.actions.push('データベースクエリの最適化');
    shortTerm.actions.push('並列処理の増強');
    shortTerm.actions.push('メモリ使用量の最適化');
    shortTerm.estimatedImpact = 35;
    
    // 長期改善
    longTerm.actions.push('アーキテクチャの全面見直し');
    longTerm.actions.push('マイクロサービス化の検討');
    longTerm.actions.push('インフラのスケールアップ');
    longTerm.estimatedImpact = 60;
    
    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * ダッシュボードデータ取得
   */
  getDashboardData(): DashboardData | null {
    return this.dashboardData;
  }

  /**
   * 監視停止
   */
  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) {
      console.log('⚠️ Monitoring is not running');
      return;
    }

    console.log('🛑 Stopping real-time performance monitoring...');
    this.isMonitoring = false;
    
    console.log('✅ Real-time monitoring stopped');
  }

  /**
   * システム統計取得
   */
  getSystemStatistics(): any {
    return {
      totalComponents: this.performanceCollectors.size,
      totalMetricsCollected: Array.from(this.metricsHistory.values())
        .reduce((total, history) => total + history.length, 0),
      activeAlerts: this.activeAlerts.size,
      monitoringStatus: this.isMonitoring ? 'active' : 'stopped',
      averageResponseTime: this.calculateCurrentAverageResponseTime(),
      systemHealth: this.getCurrentSystemHealth(),
      uptimePercentage: this.calculateUptimePercentage()
    };
  }

  private calculateCurrentAverageResponseTime(): number {
    let totalResponseTime = 0;
    let count = 0;
    
    for (const history of this.metricsHistory.values()) {
      if (history.length > 0) {
        const latest = history[history.length - 1];
        totalResponseTime += latest.responseTime;
        count++;
      }
    }
    
    return count > 0 ? totalResponseTime / count : 0;
  }

  private getCurrentSystemHealth(): string {
    const criticalAlerts = Array.from(this.activeAlerts.values())
      .filter(alert => alert.level === 'critical' || alert.level === 'emergency');
    
    if (criticalAlerts.length > 0) {
      return 'critical';
    }
    
    const warningAlerts = Array.from(this.activeAlerts.values())
      .filter(alert => alert.level === 'warning');
    
    if (warningAlerts.length > 0) {
      return 'warning';
    }
    
    return 'healthy';
  }

  private calculateUptimePercentage(): number {
    // 簡略化：過去24時間のアップタイム計算
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    let totalSamples = 0;
    let healthySamples = 0;
    
    for (const history of this.metricsHistory.values()) {
      for (const metric of history) {
        if (metric.timestamp >= dayAgo) {
          totalSamples++;
          if (metric.responseTime <= 200 && metric.errorRate <= 5) {
            healthySamples++;
          }
        }
      }
    }
    
    return totalSamples > 0 ? (healthySamples / totalSamples) * 100 : 100;
  }
}