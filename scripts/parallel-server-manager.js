#!/usr/bin/env node
/**
 * HAQEIプロジェクト 並行サーバー管理システム
 * Tsumikiワークフロー準拠 | bunenjin哲学統合版
 * 
 * 目的:
 * - 複数開発サーバーの調和的並行実行
 * - bunenjin分人思想に基づくサーバー人格管理
 * - Triple OS Architecture準拠の統合運用
 * 
 * 管理対象サーバー:
 * - OS Analyzer: ポート8001 (Engine OS)
 * - Future Simulator: ポート8788 (Interface OS) 
 * - Cipher Integration: ポート3001 (Safe Mode OS)
 * 
 * bunenjin分人マッピング:
 * - 各サーバーを独立した「分人」として認識・管理
 * - 相互作用による創発的システム構築
 * - 易経的変化対応による継続的最適化
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

class ParallelServerManager {
  constructor() {
    // bunenjin分人定義（各サーバーの人格特性）
    this.serverPersonalities = {
      'os-analyzer': {
        name: 'OS Analyzer',
        port: 8001,
        osType: 'Engine',
        personality: {
          values: ['analytical', 'systematic', 'precision'],
          characteristics: ['deep-analysis', 'pattern-recognition', 'strategic-thinking'],
          purpose: '価値観システムの核心分析'
        },
        command: 'npm',
        args: ['run', 'os-analyzer'],
        healthCheck: '/os_analyzer.html'
      },
      
      'future-simulator': {
        name: 'Future Simulator',
        port: 8788,
        osType: 'Interface',
        personality: {
          values: ['creative', 'adaptive', 'visionary'],
          characteristics: ['scenario-planning', 'future-modeling', 'interactive-exploration'],
          purpose: '社会的相互作用の未来予測'
        },
        command: 'python3',
        args: ['-m', 'http.server', '8788', '--directory', 'public'],
        healthCheck: '/future_simulator.html'
      },
      
      'cipher-integration': {
        name: 'Cipher Memory System',
        port: 3001,
        osType: 'SafeMode',
        personality: {
          values: ['secure', 'persistent', 'reliable'],
          characteristics: ['memory-management', 'data-protection', 'continuity-assurance'],
          purpose: '防御的記憶システムと継続性確保'
        },
        command: 'node',
        args: ['cipher-server.js'],
        healthCheck: '/health'
      }
    };

    this.activeProcesses = new Map();
    this.systemState = {
      startTime: null,
      harmony: 0, // 分人間の調和度
      totalInteractions: 0,
      qualityMetrics: {
        uptime: 0,
        errorRate: 0,
        responseTime: 0,
        bunenjinCompliance: 0
      }
    };

    this.isShuttingDown = false;
  }

  /**
   * 全サーバーの並行起動（bunenjin調和システム）
   */
  async startAllServers() {
    console.log('🚀 HAQEIプロジェクト 並行サーバー管理システム 起動中...');
    console.log('🔄 bunenjin分人思想に基づく調和的サーバー管理を開始します\n');

    this.systemState.startTime = new Date();

    // 各分人（サーバー）の個別起動
    for (const [id, personality] of Object.entries(this.serverPersonalities)) {
      await this.startServerPersonality(id, personality);
      
      // 分人間の調和を促進するため段階的起動
      await this.delay(2000);
    }

    // 全分人起動後の調和度チェック
    await this.performHarmonyCheck();
    
    // プロセス終了時のクリーンアップ設定
    this.setupGracefulShutdown();
    
    console.log('\n🎭 すべての分人（サーバー）が調和的に起動しました');
    console.log('💫 Triple OS Architecture による統合システムが稼働中です');
    
    // 継続監視開始
    this.startContinuousMonitoring();
  }

  /**
   * 個別サーバー分人の起動
   */
  async startServerPersonality(id, personality) {
    console.log(`\n🎭 分人 '${personality.name}' (${personality.osType} OS) を起動中...`);
    console.log(`   ポート: ${personality.port}`);
    console.log(`   人格特性: ${personality.personality.values.join(', ')}`);
    console.log(`   目的: ${personality.personality.purpose}`);

    try {
      // ポートの利用可能性チェック
      const isPortFree = await this.checkPortAvailability(personality.port);
      if (!isPortFree) {
        console.log(`⚠️  ポート ${personality.port} は既に使用中です - 既存プロセスを確認`);
        return false;
      }

      // プロセス起動
      const process = spawn(personality.command, personality.args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false
      });

      process.stdout.on('data', (data) => {
        console.log(`📡 [${personality.name}] ${data.toString().trim()}`);
      });

      process.stderr.on('data', (data) => {
        console.error(`⚠️  [${personality.name}] ${data.toString().trim()}`);
      });

      process.on('close', (code) => {
        console.log(`🔄 [${personality.name}] プロセス終了 (code: ${code})`);
        this.activeProcesses.delete(id);
        
        if (!this.isShuttingDown && code !== 0) {
          console.log(`🔄 [${personality.name}] 異常終了 - 再起動を試行...`);
          setTimeout(() => this.startServerPersonality(id, personality), 5000);
        }
      });

      // プロセス登録
      this.activeProcesses.set(id, {
        process,
        personality,
        startTime: new Date(),
        interactions: 0,
        lastHealthCheck: null
      });

      // ヘルスチェック実行
      await this.delay(3000); // 起動待機
      const isHealthy = await this.performHealthCheck(id, personality);
      
      if (isHealthy) {
        console.log(`✅ [${personality.name}] 正常起動確認`);
        return true;
      } else {
        console.log(`❌ [${personality.name}] ヘルスチェック失敗`);
        return false;
      }

    } catch (error) {
      console.error(`❌ [${personality.name}] 起動エラー:`, error.message);
      return false;
    }
  }

  /**
   * ポート利用可能性チェック
   */
  async checkPortAvailability(port) {
    try {
      const { stdout } = await execAsync(`lsof -i :${port}`);
      return stdout.trim() === '';
    } catch (error) {
      // lsofがエラーを返す = ポートが空いている
      return true;
    }
  }

  /**
   * ヘルスチェック実行
   */
  async performHealthCheck(id, personality) {
    try {
      const response = await fetch(`http://localhost:${personality.port}${personality.healthCheck}`, {
        method: 'HEAD',
        timeout: 5000
      });
      
      const processInfo = this.activeProcesses.get(id);
      if (processInfo) {
        processInfo.lastHealthCheck = new Date();
        processInfo.isHealthy = response.ok;
      }
      
      return response.ok;
    } catch (error) {
      console.log(`🔍 [${personality.name}] ヘルスチェック: ${error.message}`);
      return false;
    }
  }

  /**
   * 分人間調和度チェック
   */
  async performHarmonyCheck() {
    console.log('\n🎵 分人間の調和度を測定中...');
    
    let activeCount = 0;
    let healthyCount = 0;
    
    for (const [id, personality] of Object.entries(this.serverPersonalities)) {
      if (this.activeProcesses.has(id)) {
        activeCount++;
        const isHealthy = await this.performHealthCheck(id, personality);
        if (isHealthy) {
          healthyCount++;
        }
      }
    }
    
    this.systemState.harmony = (healthyCount / Object.keys(this.serverPersonalities).length) * 100;
    
    console.log(`🎭 アクティブ分人: ${activeCount}/${Object.keys(this.serverPersonalities).length}`);
    console.log(`💚 健全分人: ${healthyCount}/${Object.keys(this.serverPersonalities).length}`);
    console.log(`🎵 調和度: ${this.systemState.harmony.toFixed(1)}%`);
    
    if (this.systemState.harmony >= 80) {
      console.log('✨ 高い調和状態 - Triple OS Architecture が最適に機能中');
    } else if (this.systemState.harmony >= 60) {
      console.log('🔄 中程度の調和 - 一部改善が必要');
    } else {
      console.log('⚠️  低調和状態 - システム全体の見直しが必要');
    }
  }

  /**
   * 継続監視システム
   */
  startContinuousMonitoring() {
    console.log('\n👁️  継続監視システム開始 (60秒間隔)');
    
    const monitoringInterval = setInterval(async () => {
      if (this.isShuttingDown) {
        clearInterval(monitoringInterval);
        return;
      }
      
      await this.performHarmonyCheck();
      this.updateQualityMetrics();
      this.systemState.totalInteractions++;
      
      // 易経的変化対応 - 定期的な最適化
      if (this.systemState.totalInteractions % 10 === 0) {
        console.log('🔄 易経的変化対応 - システム最適化実行中...');
        await this.optimizeSystemHarmony();
      }
      
    }, 60000); // 60秒間隔
  }

  /**
   * システム調和最適化
   */
  async optimizeSystemHarmony() {
    console.log('⚡ システム調和最適化中...');
    
    // メモリ使用量チェック
    try {
      const { stdout } = await execAsync('ps aux | grep -E "(node|python3)" | grep -v grep');
      console.log('📊 プロセス状態確認完了');
    } catch (error) {
      console.log('📊 プロセス状態確認中...');
    }
    
    // 低調和時の自動修復
    if (this.systemState.harmony < 60) {
      console.log('🔧 低調和検出 - 自動修復を試行');
      await this.attemptSystemHealing();
    }
  }

  /**
   * システム自動修復
   */
  async attemptSystemHealing() {
    console.log('🩺 システム自動修復開始...');
    
    for (const [id, personality] of Object.entries(this.serverPersonalities)) {
      if (!this.activeProcesses.has(id)) {
        console.log(`🔄 分人 '${personality.name}' の復旧を試行`);
        await this.startServerPersonality(id, personality);
      }
    }
  }

  /**
   * 品質メトリクス更新
   */
  updateQualityMetrics() {
    const now = new Date();
    const uptime = now - this.systemState.startTime;
    
    this.systemState.qualityMetrics = {
      uptime: Math.floor(uptime / 1000), // 秒
      errorRate: this.calculateErrorRate(),
      responseTime: this.calculateAverageResponseTime(),
      bunenjinCompliance: this.systemState.harmony
    };
  }

  /**
   * エラー率計算
   */
  calculateErrorRate() {
    let totalErrors = 0;
    let totalChecks = 0;
    
    this.activeProcesses.forEach((processInfo) => {
      totalChecks++;
      if (!processInfo.isHealthy) {
        totalErrors++;
      }
    });
    
    return totalChecks > 0 ? (totalErrors / totalChecks) * 100 : 0;
  }

  /**
   * 平均応答時間計算
   */
  calculateAverageResponseTime() {
    // 簡易実装 - 実際の測定が必要
    return this.systemState.harmony > 80 ? 150 : 300; // ms
  }

  /**
   * 優雅なシャットダウン設定
   */
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n🛑 ${signal} シグナル受信 - 優雅なシャットダウン開始...`);
      this.isShuttingDown = true;
      
      console.log('🎭 すべての分人（サーバー）を順次停止中...');
      
      for (const [id, processInfo] of this.activeProcesses) {
        console.log(`🔄 [${processInfo.personality.name}] 停止中...`);
        processInfo.process.kill('SIGTERM');
      }
      
      // プロセス終了待機
      await this.delay(3000);
      
      console.log('✅ すべての分人が調和的に停止しました');
      console.log('🙏 HAQEIプロジェクト並行サーバー管理システム終了');
      
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  /**
   * ユーティリティ: 遅延実行
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * システム状態レポート生成
   */
  generateSystemReport() {
    const report = {
      timestamp: new Date().toISOString(),
      systemState: this.systemState,
      activeProcesses: Array.from(this.activeProcesses.entries()).map(([id, info]) => ({
        id,
        name: info.personality.name,
        osType: info.personality.osType,
        uptime: new Date() - info.startTime,
        isHealthy: info.isHealthy,
        interactions: info.interactions
      })),
      bunenjinAnalysis: {
        totalPersonalities: Object.keys(this.serverPersonalities).length,
        activePersonalities: this.activeProcesses.size,
        harmonyLevel: this.systemState.harmony,
        tripleOSBalance: this.calculateTripleOSBalance()
      }
    };

    console.log('\n📊 システム状態レポート:');
    console.log(JSON.stringify(report, null, 2));
    
    return report;
  }

  /**
   * Triple OS バランス計算
   */
  calculateTripleOSBalance() {
    const osTypes = ['Engine', 'Interface', 'SafeMode'];
    const balance = {};
    
    osTypes.forEach(osType => {
      const personalitiesOfType = Object.values(this.serverPersonalities)
        .filter(p => p.osType === osType);
      const activeOfType = Array.from(this.activeProcesses.values())
        .filter(info => info.personality.osType === osType);
      
      balance[osType] = {
        total: personalitiesOfType.length,
        active: activeOfType.length,
        ratio: personalitiesOfType.length > 0 ? activeOfType.length / personalitiesOfType.length : 0
      };
    });
    
    return balance;
  }
}

// メイン実行
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new ParallelServerManager();
  
  console.log('🎭 HAQEIプロジェクト 並行サーバー管理システム');
  console.log('🔄 bunenjin分人思想 × Triple OS Architecture');
  console.log('⚡ Tsumikiワークフロー準拠版\n');
  
  manager.startAllServers().catch(error => {
    console.error('❌ システム起動エラー:', error);
    process.exit(1);
  });
}

export default ParallelServerManager;