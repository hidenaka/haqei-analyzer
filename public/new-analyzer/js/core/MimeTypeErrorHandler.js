/**
 * MimeTypeErrorHandler - MIME タイプエラーの統合処理システム
 *
 * 機能:
 * - MIME タイプエラーの分類とハンドリング
 * - エラーグループ化と統合レポート
 * - 開発環境向け最適化
 * - サーバー設定推奨事項の生成
 */

class MimeTypeErrorHandler {
  constructor(options = {}) {
    this.options = {
      developmentMode: options.developmentMode || false,
      verboseLogging: options.verboseLogging || true,
      groupSimilarErrors: options.groupSimilarErrors !== false,
      enableGracefulDegradation: options.enableGracefulDegradation !== false,
      maxErrorsToShow: options.maxErrorsToShow || 10,
      ...options
    };

    this.errorGroups = new Map();
    this.processedErrors = [];
    this.serverConfigDetected = null;
  }

  /**
   * MIME タイプエラーの処理とカテゴリ分類
   * @param {Object} error - エラーオブジェクト
   * @param {Object} context - エラーコンテキスト
   * @returns {Object} 処理結果
   */
  handleMimeTypeError(error, context = {}) {
    const categorizedError = this.categorizeError(error, context);
    
    if (this.options.groupSimilarErrors) {
      this.addToErrorGroup(categorizedError);
    }

    this.processedErrors.push(categorizedError);

    // 開発モードでは詳細ログを削減
    if (this.options.developmentMode) {
      this.handleDevelopmentModeError(categorizedError);
    } else {
      this.handleProductionModeError(categorizedError);
    }

    return {
      category: categorizedError.category,
      severity: categorizedError.severity,
      canContinue: categorizedError.canContinue,
      solutions: categorizedError.solutions
    };
  }

  /**
   * エラーのカテゴリ分類
   * @param {Object} error - 元のエラー
   * @param {Object} context - コンテキスト情報
   * @returns {Object} 分類済みエラー
   */
  categorizeError(error, context) {
    const categorized = {
      originalError: error,
      context,
      timestamp: new Date().toISOString(),
      category: 'UNKNOWN',
      severity: 'WARNING',
      canContinue: true,
      solutions: [],
      errorType: null
    };

    // エラータイプの判定
    if (error.message && error.message.includes('Failed to fetch')) {
      categorized.category = 'MISSING_FILE';
      categorized.severity = 'ERROR';
      categorized.canContinue = false;
      categorized.errorType = 'NETWORK_ERROR';
      categorized.solutions = this.generateMissingFileSolutions(context);
    } else if (error.message && error.message.includes('MIME タイプ') || 
               (error.actualMimeType && error.actualMimeType.includes('text/html'))) {
      categorized.category = 'INCORRECT_MIME_TYPE';
      categorized.severity = 'WARNING';
      categorized.canContinue = true;
      categorized.errorType = 'MIME_TYPE_MISMATCH';
      categorized.solutions = this.generateMimeTypeSolutions(error, context);
    } else if (error.message && error.message.includes('CORS')) {
      categorized.category = 'CORS_ERROR';
      categorized.severity = 'WARNING';
      categorized.canContinue = true;
      categorized.errorType = 'SECURITY_RESTRICTION';
      categorized.solutions = this.generateCorsSolutions(context);
    }

    return categorized;
  }

  /**
   * エラーグループへの追加
   * @param {Object} error - 分類済みエラー
   */
  addToErrorGroup(error) {
    const groupKey = `${error.category}_${error.errorType}`;
    
    if (!this.errorGroups.has(groupKey)) {
      this.errorGroups.set(groupKey, {
        category: error.category,
        errorType: error.errorType,
        severity: error.severity,
        count: 0,
        affectedFiles: [],
        commonSolution: error.solutions[0] || '',
        detailedSolutions: error.solutions,
        firstOccurrence: error.timestamp,
        lastOccurrence: error.timestamp
      });
    }

    const group = this.errorGroups.get(groupKey);
    group.count++;
    group.lastOccurrence = error.timestamp;
    
    if (error.context.url && !group.affectedFiles.includes(error.context.url)) {
      group.affectedFiles.push(error.context.url);
    }
  }

  /**
   * 開発モードでのエラー処理
   * @param {Object} error - 分類済みエラー
   */
  handleDevelopmentModeError(error) {
    if (error.category === 'INCORRECT_MIME_TYPE') {
      // 開発モードでは最初の数回だけ警告表示
      const groupKey = `${error.category}_${error.errorType}`;
      const group = this.errorGroups.get(groupKey);
      
      if (group && group.count <= 3) {
        console.warn(`⚠️ [Dev] MIME Type Issue (${group.count}/${group.affectedFiles.length} files):`, {
          file: error.context.url,
          actualMimeType: error.originalError.actualMimeType,
          recommendation: error.solutions[0]
        });
      }
    } else if (error.severity === 'ERROR') {
      console.error(`❌ [Dev] ${error.category}:`, error.originalError.message);
    }
  }

  /**
   * プロダクションモードでのエラー処理
   * @param {Object} error - 分類済みエラー
   */
  handleProductionModeError(error) {
    if (error.severity === 'ERROR') {
      console.error(`❌ ${error.category}:`, error.originalError.message);
    } else if (this.options.verboseLogging) {
      console.warn(`⚠️ ${error.category}:`, error.originalError.message);
    }
  }

  /**
   * ファイル不存在エラーの解決策生成
   * @param {Object} context - コンテキスト
   * @returns {Array} 解決策リスト
   */
  generateMissingFileSolutions(context) {
    return [
      'ファイルパスが正しいか確認してください',
      'ファイルが存在するか確認してください',
      'サーバーが適切に起動しているか確認してください',
      '相対パスの基準ディレクトリが正しいか確認してください'
    ];
  }

  /**
   * MIME タイプエラーの解決策生成
   * @param {Object} error - エラー情報
   * @param {Object} context - コンテキスト
   * @returns {Array} 解決策リスト
   */
  generateMimeTypeSolutions(error, context) {
    const solutions = [
      'HTTPサーバーを使用してファイルを配信してください (例: python -m http.server 8000)',
      'サーバーのMIMEタイプ設定を確認してください',
      '.htaccessファイルで "AddType application/javascript .js" を設定してください'
    ];

    // サーバー固有の解決策
    if (context.serverType) {
      solutions.push(...this.generateServerSpecificSolutions(context.serverType));
    }

    return solutions;
  }

  /**
   * CORS エラーの解決策生成
   * @param {Object} context - コンテキスト
   * @returns {Array} 解決策リスト
   */
  generateCorsSolutions(context) {
    return [
      '同一オリジンからファイルを配信してください',
      'サーバーで適切なCORSヘッダーを設定してください',
      'HTTPサーバーを使用してファイルを配信してください'
    ];
  }

  /**
   * サーバー固有の解決策生成
   * @param {string} serverType - サーバータイプ
   * @returns {Array} 解決策リスト
   */
  generateServerSpecificSolutions(serverType) {
    switch (serverType) {
      case 'APACHE':
        return [
          '.htaccessに "AddType application/javascript .js" を追加',
          'httpd.confでMIMEタイプを設定'
        ];
      case 'NGINX':
        return [
          'nginx.confで "location ~* \\.js$ { add_header Content-Type application/javascript; }" を設定'
        ];
      case 'NODE_EXPRESS':
        return [
          'express.staticの設定でMIMEタイプを指定',
          'serveStaticミドルウェアでMIMEタイプを設定'
        ];
      case 'PYTHON_HTTP':
        return [
          'mimetypes.add_type("application/javascript", ".js") を追加'
        ];
      default:
        return [];
    }
  }

  /**
   * エラー統合レポートの生成
   * @returns {Object} 統合レポート
   */
  generateErrorSummaryReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: this.processedErrors.length,
      totalGroups: this.errorGroups.size,
      severity: {
        error: 0,
        warning: 0,
        info: 0
      },
      categories: {},
      recommendations: [],
      canContinue: true
    };

    // エラーグループごとの統計
    for (const [groupKey, group] of this.errorGroups) {
      report.severity[group.severity.toLowerCase()]++;
      
      if (!report.categories[group.category]) {
        report.categories[group.category] = {
          count: 0,
          affectedFiles: [],
          solutions: []
        };
      }
      
      report.categories[group.category].count += group.count;
      report.categories[group.category].affectedFiles.push(...group.affectedFiles);
      report.categories[group.category].solutions = group.detailedSolutions;
    }

    // 推奨アクション
    if (report.categories.INCORRECT_MIME_TYPE) {
      report.recommendations.push({
        priority: 'HIGH',
        action: 'サーバーのMIMEタイプ設定を修正',
        reason: `${report.categories.INCORRECT_MIME_TYPE.count}個のファイルで不正なMIMEタイプが検出されました`
      });
    }

    if (report.categories.MISSING_FILE) {
      report.recommendations.push({
        priority: 'CRITICAL',
        action: '不存在ファイルの確認と修正',
        reason: `${report.categories.MISSING_FILE.count}個のファイルが見つかりません`
      });
      report.canContinue = false;
    }

    return report;
  }

  /**
   * コンソールフレンドリーなサマリー出力
   */
  logErrorSummary() {
    const report = this.generateErrorSummaryReport();
    
    if (report.totalErrors === 0) {
      console.log('✅ MIME タイプ検証: 問題なし');
      return;
    }

    console.group(`📊 MIME Type Validation Summary (${report.totalErrors} issues)`);
    
    // 重要度別表示
    if (report.severity.error > 0) {
      console.error(`❌ Critical errors: ${report.severity.error}`);
    }
    if (report.severity.warning > 0) {
      console.warn(`⚠️ Warnings: ${report.severity.warning}`);
    }

    // カテゴリ別表示
    for (const [category, details] of Object.entries(report.categories)) {
      console.group(`📁 ${category} (${details.count} issues)`);
      console.log(`Files affected: ${details.affectedFiles.length}`);
      if (details.affectedFiles.length <= 5) {
        details.affectedFiles.forEach(file => console.log(`  - ${file}`));
      } else {
        details.affectedFiles.slice(0, 3).forEach(file => console.log(`  - ${file}`));
        console.log(`  ... and ${details.affectedFiles.length - 3} more`);
      }
      console.groupEnd();
    }

    // 推奨アクション
    if (report.recommendations.length > 0) {
      console.group('💡 Recommended Actions');
      report.recommendations.forEach(rec => {
        const icon = rec.priority === 'CRITICAL' ? '🔥' : '⚡';
        console.log(`${icon} ${rec.action}: ${rec.reason}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * 統計情報の取得
   * @returns {Object} 統計情報
   */
  getStatistics() {
    return {
      totalErrorsProcessed: this.processedErrors.length,
      errorGroups: this.errorGroups.size,
      canContinueExecution: this.processedErrors.every(e => e.canContinue),
      developmentMode: this.options.developmentMode,
      lastProcessedAt: this.processedErrors.length > 0 ? 
        this.processedErrors[this.processedErrors.length - 1].timestamp : null
    };
  }

  /**
   * エラーハンドラーのリセット
   */
  reset() {
    this.errorGroups.clear();
    this.processedErrors = [];
    this.serverConfigDetected = null;
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
    window.MimeTypeErrorHandler = MimeTypeErrorHandler;
}

console.log('✅ MimeTypeErrorHandler loaded');