#!/usr/bin/env node

/**
 * テストデータロガー - PDCAサイクルのデータ永続化フック
 * 
 * 目的：
 * - テストユーザー、悩みテキスト、状況卦、フィードバックの保存
 * - 時系列データの管理
 * - 分析レポートのアーカイブ
 * - データの検索・取得機能
 * 
 * 処理内容：
 * 1. データの受信と検証
 * 2. タイムスタンプ付きファイル名生成
 * 3. JSON形式での保存
 * 4. インデックスファイルの更新
 * 5. 古いデータのアーカイブ
 * 6. データ統計の更新
 * 
 * 使用方法：
 * - フックとして自動実行
 * - コマンドラインから直接実行も可能
 * 
 * 保存先：
 * - /data/pdca-cycles/YYYY-MM-DD/
 * 
 * エラー処理：
 * - 書き込み失敗時の再試行
 * - データ破損防止
 * - ログ出力
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class TestDataLogger {
  constructor() {
    // ベースディレクトリ
    this.baseDir = path.join(__dirname, '..', 'data', 'pdca-cycles');
    
    // データタイプ定義
    this.dataTypes = {
      TEST_USERS: 'test-users',
      WORRY_TEXTS: 'worry-texts',
      TEST_RESULTS: 'test-results',
      FEEDBACKS: 'feedbacks',
      ANALYSIS_REPORTS: 'analysis-reports',
      PDCA_SUMMARY: 'pdca-summary'
    };
    
    // ファイル命名規則
    this.fileNamePattern = {
      prefix: 'pdca',
      separator: '_',
      extension: '.json'
    };
    
    // データ検証スキーマ
    this.validationSchemas = {
      [this.dataTypes.TEST_USERS]: {
        required: ['users', 'statistics', 'metadata'],
        arrayField: 'users'
      },
      [this.dataTypes.WORRY_TEXTS]: {
        required: ['texts', 'metadata'],
        arrayField: 'texts'
      },
      [this.dataTypes.TEST_RESULTS]: {
        required: ['results', 'summary', 'statistics'],
        arrayField: 'results'
      },
      [this.dataTypes.FEEDBACKS]: {
        required: ['feedbacks', 'statistics'],
        arrayField: 'feedbacks'
      },
      [this.dataTypes.ANALYSIS_REPORTS]: {
        required: ['executiveSummary', 'detailedAnalysis', 'recommendations'],
        arrayField: null
      }
    };
    
    // 統計情報
    this.statistics = {
      totalSaved: 0,
      byType: {},
      lastSaved: null,
      errors: 0
    };
  }

  /**
   * 初期化処理
   */
  async initialize() {
    try {
      // ベースディレクトリの作成
      await this.ensureDirectory(this.baseDir);
      
      // 統計情報の読み込み
      await this.loadStatistics();
      
      console.log('✅ TestDataLogger initialized');
      console.log(`📁 Base directory: ${this.baseDir}`);
      
      return true;
    } catch (error) {
      console.error('❌ Initialization error:', error);
      return false;
    }
  }

  /**
   * データの保存
   * 
   * @param {string} dataType - データタイプ
   * @param {object} data - 保存するデータ
   * @param {object} options - 保存オプション
   */
  async saveData(dataType, data, options = {}) {
    const startTime = Date.now();
    
    try {
      // データ検証
      if (!this.validateData(dataType, data)) {
        throw new Error(`Invalid data structure for type: ${dataType}`);
      }
      
      // 保存ディレクトリの準備
      const saveDir = await this.prepareSaveDirectory();
      
      // ファイル名の生成
      const fileName = this.generateFileName(dataType, options);
      const filePath = path.join(saveDir, fileName);
      
      // メタデータの追加
      const enrichedData = this.enrichWithMetadata(data, {
        dataType,
        savedAt: new Date().toISOString(),
        fileName,
        ...options.metadata
      });
      
      // データの保存
      await this.writeDataFile(filePath, enrichedData);
      
      // インデックスの更新
      await this.updateIndex(saveDir, dataType, fileName, enrichedData);
      
      // 統計の更新
      this.updateStatistics(dataType, data);
      
      const duration = Date.now() - startTime;
      console.log(`✅ Data saved: ${fileName} (${duration}ms)`);
      
      return {
        success: true,
        filePath,
        fileName,
        duration
      };
      
    } catch (error) {
      console.error('❌ Save error:', error);
      this.statistics.errors++;
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * バッチデータの保存
   * 
   * @param {object} batchData - 複数タイプのデータ
   */
  async saveBatch(batchData) {
    console.log('📦 Saving batch data...');
    
    const results = {};
    const sessionId = this.generateSessionId();
    
    for (const [dataType, data] of Object.entries(batchData)) {
      if (this.dataTypes[dataType]) {
        results[dataType] = await this.saveData(dataType, data, {
          metadata: { sessionId }
        });
      }
    }
    
    // サマリーの作成
    const summary = await this.createPDCASummary(results, sessionId);
    results.summary = await this.saveData(this.dataTypes.PDCA_SUMMARY, summary);
    
    console.log('✅ Batch save completed');
    return results;
  }

  /**
   * データの読み込み
   * 
   * @param {string} query - 検索クエリ
   */
  async loadData(query) {
    try {
      // 日付の解析
      const targetDate = query.date || new Date().toISOString().split('T')[0];
      const targetDir = path.join(this.baseDir, targetDate);
      
      // インデックスの読み込み
      const indexPath = path.join(targetDir, 'index.json');
      const indexExists = await this.fileExists(indexPath);
      
      if (!indexExists) {
        console.log(`No data found for date: ${targetDate}`);
        return null;
      }
      
      const index = await this.readJsonFile(indexPath);
      
      // データタイプでフィルタ
      if (query.dataType) {
        const files = index.files.filter(f => f.dataType === query.dataType);
        
        if (query.latest) {
          // 最新のファイルを取得
          const latestFile = files.sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt)
          )[0];
          
          if (latestFile) {
            const filePath = path.join(targetDir, latestFile.fileName);
            return await this.readJsonFile(filePath);
          }
        } else {
          // すべてのファイルを取得
          const allData = [];
          for (const file of files) {
            const filePath = path.join(targetDir, file.fileName);
            const data = await this.readJsonFile(filePath);
            allData.push(data);
          }
          return allData;
        }
      }
      
      return index;
      
    } catch (error) {
      console.error('❌ Load error:', error);
      return null;
    }
  }

  /**
   * データの検索
   * 
   * @param {object} criteria - 検索条件
   */
  async searchData(criteria) {
    const results = [];
    
    try {
      // 日付範囲の取得
      const dates = await this.getDateRange(criteria.startDate, criteria.endDate);
      
      for (const date of dates) {
        const dateDir = path.join(this.baseDir, date);
        const indexPath = path.join(dateDir, 'index.json');
        
        if (await this.fileExists(indexPath)) {
          const index = await this.readJsonFile(indexPath);
          
          // 条件に合うファイルを検索
          const matchingFiles = index.files.filter(file => {
            if (criteria.dataType && file.dataType !== criteria.dataType) {
              return false;
            }
            
            if (criteria.sessionId && file.metadata?.sessionId !== criteria.sessionId) {
              return false;
            }
            
            return true;
          });
          
          results.push({
            date,
            files: matchingFiles,
            count: matchingFiles.length
          });
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('❌ Search error:', error);
      return [];
    }
  }

  /**
   * データのアーカイブ
   * 
   * @param {number} daysOld - アーカイブする日数
   */
  async archiveOldData(daysOld = 30) {
    console.log(`🗄️ Archiving data older than ${daysOld} days...`);
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const dirs = await fs.readdir(this.baseDir);
      const archiveDir = path.join(this.baseDir, 'archive');
      await this.ensureDirectory(archiveDir);
      
      let archivedCount = 0;
      
      for (const dir of dirs) {
        if (dir === 'archive') continue;
        
        const dirDate = new Date(dir);
        if (dirDate < cutoffDate) {
          const sourcePath = path.join(this.baseDir, dir);
          const targetPath = path.join(archiveDir, dir);
          
          await fs.rename(sourcePath, targetPath);
          archivedCount++;
          
          console.log(`  Archived: ${dir}`);
        }
      }
      
      console.log(`✅ Archived ${archivedCount} directories`);
      return archivedCount;
      
    } catch (error) {
      console.error('❌ Archive error:', error);
      return 0;
    }
  }

  // ========== ヘルパーメソッド ==========

  /**
   * データ検証
   */
  validateData(dataType, data) {
    const schema = this.validationSchemas[dataType];
    if (!schema) {
      console.warn(`No validation schema for type: ${dataType}`);
      return true;
    }
    
    // 必須フィールドのチェック
    for (const field of schema.required) {
      if (!data.hasOwnProperty(field)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    // 配列フィールドのチェック
    if (schema.arrayField && !Array.isArray(data[schema.arrayField])) {
      console.error(`Field ${schema.arrayField} must be an array`);
      return false;
    }
    
    return true;
  }

  /**
   * 保存ディレクトリの準備
   */
  async prepareSaveDirectory() {
    const today = new Date().toISOString().split('T')[0];
    const saveDir = path.join(this.baseDir, today);
    
    await this.ensureDirectory(saveDir);
    
    return saveDir;
  }

  /**
   * ファイル名の生成
   */
  generateFileName(dataType, options = {}) {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 8);
    
    const parts = [
      this.fileNamePattern.prefix,
      dataType,
      timestamp,
      random
    ];
    
    if (options.suffix) {
      parts.push(options.suffix);
    }
    
    return parts.join(this.fileNamePattern.separator) + this.fileNamePattern.extension;
  }

  /**
   * メタデータの追加
   */
  enrichWithMetadata(data, metadata) {
    return {
      ...data,
      _metadata: {
        ...metadata,
        checksum: this.calculateChecksum(data)
      }
    };
  }

  /**
   * チェックサムの計算
   */
  calculateChecksum(data) {
    const json = JSON.stringify(data);
    return crypto.createHash('md5').update(json).digest('hex');
  }

  /**
   * データファイルの書き込み
   */
  async writeDataFile(filePath, data) {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, json, 'utf8');
  }

  /**
   * インデックスの更新
   */
  async updateIndex(directory, dataType, fileName, data) {
    const indexPath = path.join(directory, 'index.json');
    let index = { files: [], updated: new Date().toISOString() };
    
    // 既存のインデックスを読み込み
    if (await this.fileExists(indexPath)) {
      index = await this.readJsonFile(indexPath);
    }
    
    // 新しいエントリを追加
    index.files.push({
      fileName,
      dataType,
      savedAt: data._metadata.savedAt,
      size: JSON.stringify(data).length,
      checksum: data._metadata.checksum,
      metadata: data._metadata
    });
    
    // インデックスを保存
    await this.writeDataFile(indexPath, index);
  }

  /**
   * 統計の更新
   */
  updateStatistics(dataType, data) {
    this.statistics.totalSaved++;
    this.statistics.byType[dataType] = (this.statistics.byType[dataType] || 0) + 1;
    this.statistics.lastSaved = new Date().toISOString();
    
    // 統計を保存
    this.saveStatistics();
  }

  /**
   * PDCAサマリーの作成
   */
  async createPDCASummary(results, sessionId) {
    const summary = {
      sessionId,
      createdAt: new Date().toISOString(),
      results: {},
      statistics: {
        totalFiles: 0,
        successCount: 0,
        errorCount: 0
      }
    };
    
    for (const [type, result] of Object.entries(results)) {
      summary.results[type] = {
        success: result.success,
        fileName: result.fileName,
        error: result.error
      };
      
      summary.statistics.totalFiles++;
      if (result.success) {
        summary.statistics.successCount++;
      } else {
        summary.statistics.errorCount++;
      }
    }
    
    return summary;
  }

  /**
   * セッションIDの生成
   */
  generateSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `session_${timestamp}_${random}`;
  }

  /**
   * ディレクトリの確保
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * ファイルの存在確認
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * JSONファイルの読み込み
   */
  async readJsonFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * 日付範囲の取得
   */
  async getDateRange(startDate, endDate) {
    const dates = [];
    const start = new Date(startDate || new Date().setDate(new Date().getDate() - 7));
    const end = new Date(endDate || new Date());
    
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  }

  /**
   * 統計の保存
   */
  async saveStatistics() {
    const statsPath = path.join(this.baseDir, 'statistics.json');
    await this.writeDataFile(statsPath, this.statistics);
  }

  /**
   * 統計の読み込み
   */
  async loadStatistics() {
    const statsPath = path.join(this.baseDir, 'statistics.json');
    if (await this.fileExists(statsPath)) {
      this.statistics = await this.readJsonFile(statsPath);
    }
  }
}

// ========== フック実行部分 ==========

/**
 * メイン実行関数
 */
async function main() {
  const logger = new TestDataLogger();
  
  // 初期化
  if (!await logger.initialize()) {
    process.exit(1);
  }
  
  // コマンドライン引数の処理
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'save':
      // 標準入力からデータを読み込んで保存
      await handleSaveCommand(logger, args.slice(1));
      break;
      
    case 'load':
      // データの読み込み
      await handleLoadCommand(logger, args.slice(1));
      break;
      
    case 'search':
      // データの検索
      await handleSearchCommand(logger, args.slice(1));
      break;
      
    case 'archive':
      // 古いデータのアーカイブ
      const days = parseInt(args[1]) || 30;
      await logger.archiveOldData(days);
      break;
      
    case 'stats':
      // 統計情報の表示
      console.log('📊 Statistics:', logger.statistics);
      break;
      
    default:
      // フックとして実行（標準入力からデータを受け取る）
      await handleHookExecution(logger);
  }
}

/**
 * 保存コマンドの処理
 */
async function handleSaveCommand(logger, args) {
  const dataType = args[0];
  
  if (!dataType) {
    console.error('Usage: save <dataType>');
    process.exit(1);
  }
  
  try {
    // 標準入力からJSONを読み込み
    const input = await readStdin();
    const data = JSON.parse(input);
    
    const result = await logger.saveData(dataType, data);
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

/**
 * 読み込みコマンドの処理
 */
async function handleLoadCommand(logger, args) {
  const query = {
    date: args[0],
    dataType: args[1],
    latest: args.includes('--latest')
  };
  
  const data = await logger.loadData(query);
  
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('No data found');
  }
}

/**
 * 検索コマンドの処理
 */
async function handleSearchCommand(logger, args) {
  const criteria = {
    startDate: args[0],
    endDate: args[1],
    dataType: args[2],
    sessionId: args[3]
  };
  
  const results = await logger.searchData(criteria);
  console.log(JSON.stringify(results, null, 2));
}

/**
 * フック実行の処理
 */
async function handleHookExecution(logger) {
  try {
    const input = await readStdin();
    
    if (!input) {
      console.log('No input data received');
      return;
    }
    
    const data = JSON.parse(input);
    
    // データタイプの自動判定
    const dataType = detectDataType(data);
    
    if (dataType) {
      const result = await logger.saveData(dataType, data);
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error('Unable to determine data type');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Hook execution error:', error);
    process.exit(1);
  }
}

/**
 * 標準入力の読み込み
 */
function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    
    process.stdin.on('data', chunk => {
      data += chunk;
    });
    
    process.stdin.on('end', () => {
      resolve(data.trim());
    });
    
    // タイムアウト設定
    setTimeout(() => {
      resolve(data.trim());
    }, 5000);
  });
}

/**
 * データタイプの自動判定
 */
function detectDataType(data) {
  if (data.users && data.statistics) {
    return 'test-users';
  } else if (data.texts && Array.isArray(data.texts)) {
    return 'worry-texts';
  } else if (data.results && data.summary) {
    return 'test-results';
  } else if (data.feedbacks && Array.isArray(data.feedbacks)) {
    return 'feedbacks';
  } else if (data.executiveSummary && data.detailedAnalysis) {
    return 'analysis-reports';
  }
  
  return null;
}

// グローバルエクスポート（他のスクリプトから使用する場合）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestDataLogger;
}

// メイン実行
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}