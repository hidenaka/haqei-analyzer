#!/usr/bin/env tsx
/**
 * HAQEI Supabase データマイグレーション実行スクリプト
 * 
 * 目的：
 * - CLI形式でのデータ移行実行
 * - 詳細な進捗レポート機能
 * - ロールバック機能の提供
 * - バッチ処理対応
 * - TypeScript型安全性確保
 * 
 * 実行方法：
 * ```bash
 * npm run migrate:to-supabase
 * # または
 * npx tsx src/scripts/migrateToSupabase.ts --mode=production
 * ```
 * 
 * 更新: 2025-08-03 - TASK-038実装
 */

import { createApp } from 'vue'
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import fs from 'fs/promises'
import path from 'path'
import { useSupabaseMigration, type MigrationResult, type LocalDataScan } from '@/services/supabaseMigration'
import { getSupabaseClient, testSupabaseConnection } from '@/services/supabase'

// CLI設定
program
  .name('haqei-migrate')
  .description('HAQEI localStorage → Supabase データマイグレーションツール')
  .version('1.0.0')
  .option('-m, --mode <mode>', 'モード設定 (development|production)', 'development')
  .option('-f, --force', '確認なしで実行', false)
  .option('-b, --backup-only', 'バックアップのみ実行', false)
  .option('-r, --restore <backupKey>', 'バックアップから復元', '')
  .option('-c, --cleanup', '移行後にローカルデータをクリーンアップ', false)
  .option('--dry-run', 'ドライラン（実際の移行は行わない）', false)
  .option('--verbose', '詳細ログ出力', false)

interface MigrationOptions {
  mode: 'development' | 'production'
  force: boolean
  backupOnly: boolean
  restore: string
  cleanup: boolean
  dryRun: boolean
  verbose: boolean
}

/**
 * マイグレーション進捗レポート出力
 */
class MigrationReporter {
  private logFile: string
  private startTime: Date
  private verbose: boolean

  constructor(verbose = false) {
    this.verbose = verbose
    this.startTime = new Date()
    this.logFile = path.join(process.cwd(), 'logs', `migration-${Date.now()}.log`)
  }

  async initializeLogFile() {
    const logsDir = path.dirname(this.logFile)
    try {
      await fs.mkdir(logsDir, { recursive: true })
      await this.writeLog('=== HAQEI Supabase Migration Started ===')
      await this.writeLog(`Start Time: ${this.startTime.toISOString()}`)
      await this.writeLog(`Mode: ${process.env.NODE_ENV || 'development'}`)
    } catch (error) {
      console.warn(chalk.yellow('⚠️ Could not create log file, continuing without file logging'))
    }
  }

  async writeLog(message: string) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}\n`
    
    try {
      await fs.appendFile(this.logFile, logEntry)
    } catch {
      // Log file writing failed, continue silently
    }
    
    if (this.verbose) {
      console.log(chalk.gray(logEntry.trim()))
    }
  }

  info(message: string) {
    console.log(chalk.blue('ℹ️ '), message)
    this.writeLog(`INFO: ${message}`)
  }

  success(message: string) {
    console.log(chalk.green('✅'), message)
    this.writeLog(`SUCCESS: ${message}`)
  }

  warning(message: string) {
    console.log(chalk.yellow('⚠️ '), message)
    this.writeLog(`WARNING: ${message}`)
  }

  error(message: string) {
    console.log(chalk.red('❌'), message)
    this.writeLog(`ERROR: ${message}`)
  }

  printSeparator() {
    console.log(chalk.gray('─'.repeat(60)))
  }

  async generateReport(result: MigrationResult) {
    this.printSeparator()
    console.log(chalk.bold.cyan('📊 Migration Report'))
    this.printSeparator()

    const duration = Math.round(result.duration / 1000)
    
    console.log(`⏱️  Duration: ${duration}s`)
    console.log(`📈 Status: ${result.success ? chalk.green('SUCCESS') : chalk.red('FAILED')}`)
    
    if (result.success) {
      console.log(`👤 Users migrated: ${chalk.cyan(result.migratedItems.users)}`)
      console.log(`📊 Sessions migrated: ${chalk.cyan(result.migratedItems.sessions)}`)
      console.log(`❓ Responses migrated: ${chalk.cyan(result.migratedItems.responses)}`)
      console.log(`🎯 Triple OS profiles migrated: ${chalk.cyan(result.migratedItems.tripleOS)}`)
    }
    
    if (result.skippedItems > 0) {
      console.log(`⏭️  Skipped items: ${chalk.yellow(result.skippedItems)}`)
    }
    
    if (result.errors.length > 0) {
      console.log(`🚨 Errors (${result.errors.length}):`)
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${chalk.red(error)}`)
      })
    }
    
    if (result.backupPath) {
      console.log(`💾 Backup: ${chalk.blue(result.backupPath)}`)
    }

    this.printSeparator()

    // 詳細レポートをファイルに保存
    const reportPath = path.join(process.cwd(), 'logs', `migration-report-${Date.now()}.json`)
    try {
      await fs.writeFile(reportPath, JSON.stringify({
        ...result,
        executedAt: new Date().toISOString(),
        logFile: this.logFile
      }, null, 2))
      
      console.log(`📄 Detailed report saved: ${chalk.blue(reportPath)}`)
    } catch (error) {
      this.warning('Could not save detailed report to file')
    }
  }
}

/**
 * ローカルデータスキャン結果の表示
 */
function displayScanResults(scan: LocalDataScan) {
  console.log(chalk.bold.cyan('🔍 Local Data Scan Results'))
  console.log('─'.repeat(40))
  
  if (!scan.hasLegacyData) {
    console.log(chalk.yellow('📭 No legacy data found'))
    return
  }
  
  console.log(`📦 Total items: ${chalk.cyan(scan.totalItems)}`)
  console.log(`💾 Estimated size: ${chalk.cyan(Math.round(scan.estimatedSize / 1024))}KB`)
  
  if (scan.lastModified) {
    console.log(`🕐 Last modified: ${chalk.cyan(scan.lastModified.toLocaleString())}`)
  }
  
  console.log('\n📋 Data breakdown:')
  console.log(`   👤 Users: ${scan.dataTypes.users}`)
  console.log(`   📊 Sessions: ${scan.dataTypes.sessions}`)
  console.log(`   ❓ Responses: ${scan.dataTypes.responses}`)
  console.log(`   🎯 Triple OS: ${scan.dataTypes.tripleOS}`)
  console.log(`   ⚙️  Settings: ${scan.dataTypes.settings}`)
}

/**
 * Supabase接続テスト
 */
async function testConnection(reporter: MigrationReporter): Promise<boolean> {
  const spinner = ora('Testing Supabase connection...').start()
  
  try {
    const result = await testSupabaseConnection()
    
    if (result.success) {
      spinner.succeed('Supabase connection successful')
      reporter.success('Supabase connection test passed')
      
      if (Object.values(result.details).every(Boolean)) {
        reporter.success('All database systems operational')
      } else {
        reporter.warning('Some database systems unavailable')
        console.log('   Details:', result.details)
      }
      
      return true
    } else {
      spinner.fail('Supabase connection failed')
      reporter.error('Supabase connection test failed')
      return false
    }
  } catch (error) {
    spinner.fail('Connection test error')
    reporter.error(`Connection test error: ${error}`)
    return false
  }
}

/**
 * ユーザー確認プロンプト
 */
async function getUserConfirmation(scan: LocalDataScan, options: MigrationOptions): Promise<boolean> {
  if (options.force) {
    return true
  }

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: `Migrate ${scan.totalItems} items from localStorage to Supabase?`,
      default: false
    }
  ])

  return answers.proceed
}

/**
 * バックアップ復元の実行
 */
async function executeRestore(backupKey: string, reporter: MigrationReporter): Promise<boolean> {
  reporter.info(`Starting restore from backup: ${backupKey}`)
  
  const app = createApp({})
  const migration = useSupabaseMigration()
  
  const spinner = ora('Restoring from backup...').start()
  
  try {
    const success = await migration.restoreFromBackup(backupKey)
    
    if (success) {
      spinner.succeed('Backup restoration completed')
      reporter.success('Data restored successfully from backup')
      return true
    } else {
      spinner.fail('Backup restoration failed')
      reporter.error('Failed to restore from backup')
      return false
    }
  } catch (error) {
    spinner.fail('Restoration error')
    reporter.error(`Restoration error: ${error}`)
    return false
  }
}

/**
 * メインマイグレーション実行
 */
async function executeMigration(options: MigrationOptions, reporter: MigrationReporter): Promise<MigrationResult> {
  const app = createApp({})
  const migration = useSupabaseMigration()
  
  // ステップ1: ローカルデータスキャン
  reporter.info('Scanning local data...')
  const scan = await migration.scanLocalData()
  displayScanResults(scan)
  
  if (!scan.hasLegacyData) {
    reporter.info('No data to migrate')
    return {
      success: true,
      migratedItems: { users: 0, sessions: 0, responses: 0, tripleOS: 0 },
      skippedItems: 0,
      errors: [],
      duration: 0
    }
  }
  
  // バックアップのみモード
  if (options.backupOnly) {
    reporter.info('Creating backup only...')
    const spinner = ora('Creating backup...').start()
    
    try {
      const backupKey = await migration.createBackup()
      spinner.succeed(`Backup created: ${backupKey}`)
      reporter.success(`Backup created successfully: ${backupKey}`)
      
      return {
        success: true,
        migratedItems: { users: 0, sessions: 0, responses: 0, tripleOS: 0 },
        skippedItems: scan.totalItems,
        errors: [],
        backupPath: backupKey,
        duration: 0
      }
    } catch (error) {
      spinner.fail('Backup creation failed')
      reporter.error(`Backup creation failed: ${error}`)
      throw error
    }
  }
  
  // ユーザー確認
  const shouldProceed = await getUserConfirmation(scan, options)
  if (!shouldProceed) {
    reporter.info('Migration cancelled by user')
    process.exit(0)
  }
  
  // ドライランモード
  if (options.dryRun) {
    reporter.info('Dry run mode - no actual migration will be performed')
    return {
      success: true,
      migratedItems: scan.dataTypes,
      skippedItems: 0,
      errors: [],
      duration: 0
    }
  }
  
  // 実際のマイグレーション実行
  reporter.info('Starting migration...')
  
  // 進捗表示の設定
  const progressSpinner = ora('Initializing migration...').start()
  
  // 進捗状態の監視
  const progressInterval = setInterval(() => {
    const status = migration.migrationStatus
    const progress = Math.round(status.progress)
    const currentStep = status.currentStep
    
    progressSpinner.text = `Migration in progress... ${progress}% (${currentStep})`
    
    if (status.estimatedTimeRemaining) {
      progressSpinner.text += ` - ${status.estimatedTimeRemaining}s remaining`
    }
  }, 1000)
  
  try {
    const result = await migration.runCompleteMigration()
    clearInterval(progressInterval)
    
    if (result.success) {
      progressSpinner.succeed('Migration completed successfully')
      reporter.success('Migration completed successfully')
    } else {
      progressSpinner.fail('Migration failed')
      reporter.error('Migration failed')
    }
    
    return result
  } catch (error) {
    clearInterval(progressInterval)
    progressSpinner.fail('Migration error')
    reporter.error(`Migration error: ${error}`)
    throw error
  }
}

/**
 * メイン実行関数
 */
async function main() {
  const options = program.parse().opts() as MigrationOptions
  const reporter = new MigrationReporter(options.verbose)
  
  // ロゴ表示
  console.log(chalk.bold.cyan(`
╭─────────────────────────────────────────╮
│           HAQEI Data Migration          │
│         localStorage → Supabase         │
╰─────────────────────────────────────────╯
  `))
  
  await reporter.initializeLogFile()
  
  try {
    // 復元モード
    if (options.restore) {
      const success = await executeRestore(options.restore, reporter)
      process.exit(success ? 0 : 1)
    }
    
    // Supabase接続テスト
    const connectionOk = await testConnection(reporter)
    if (!connectionOk) {
      reporter.error('Cannot proceed without Supabase connection')
      process.exit(1)
    }
    
    // マイグレーション実行
    const result = await executeMigration(options, reporter)
    
    // レポート生成
    await reporter.generateReport(result)
    
    // クリーンアップ
    if (options.cleanup && result.success) {
      const app = createApp({})
      const migration = useSupabaseMigration()
      
      const shouldCleanup = options.force || (await inquirer.prompt([{
        type: 'confirm',
        name: 'cleanup',
        message: 'Clean up local data after successful migration?',
        default: false
      }])).cleanup
      
      if (shouldCleanup) {
        await migration.cleanupLocalData()
        reporter.success('Local data cleaned up')
      }
    }
    
    process.exit(result.success ? 0 : 1)
    
  } catch (error) {
    reporter.error(`Fatal error: ${error}`)
    console.error('\n', chalk.red('💥 Migration failed with fatal error:'))
    console.error(chalk.red(error))
    process.exit(1)
  }
}

// CLI実行
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('💥 Unhandled error:'), error)
    process.exit(1)
  })
}

export { main as runMigration }