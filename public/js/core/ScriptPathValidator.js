/**
 * ScriptPathValidator - スクリプトファイルのパス検証機能
 *
 * 機能:
 * - スクリプトファイルの存在確認
 * - パスの正規化
 * - 相対パス/絶対パスの検証
 * - MIME タイプの確認
 */

class ScriptPathValidator {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || "",
      timeout: options.timeout || 5000,
      allowedExtensions: options.allowedExtensions || [".js", ".json"],
      strictMode: options.strictMode !== false, // デフォルトで strict mode
      developmentMode: options.developmentMode || false,
      enableGracefulDegradation: options.enableGracefulDegradation !== false,
      enableErrorGrouping: options.enableErrorGrouping !== false,
      maxConcurrentValidations: options.maxConcurrentValidations || 5,
      ...options,
    };

    this.validationCache = new Map();
    this.validationResults = [];
    this.mimeTypeErrorHandler = null;
    this.serverConfigDetector = null;
    this.pendingValidations = new Set();

    // エラーハンドラーの初期化
    this.initializeEnhancedComponents();
  }

  /**
   * 拡張コンポーネントの初期化
   */
  initializeEnhancedComponents() {
    if (typeof window !== 'undefined' && window.MimeTypeErrorHandler) {
      this.mimeTypeErrorHandler = new window.MimeTypeErrorHandler({
        developmentMode: this.options.developmentMode,
        groupSimilarErrors: this.options.enableErrorGrouping,
        enableGracefulDegradation: this.options.enableGracefulDegradation
      });
    }

    if (typeof window !== 'undefined' && window.ServerConfigurationDetector) {
      this.serverConfigDetector = new window.ServerConfigurationDetector({
        enableAutoDetection: true,
        includeConfigTemplates: true
      });
    }
  }

  /**
   * スクリプトパスの検証
   * @param {string} scriptPath - 検証するスクリプトパス
   * @param {Object} options - 検証オプション
   * @returns {Promise<Object>} 検証結果
   */
  async validateScriptPath(scriptPath, options = {}) {
    const startTime = Date.now();

    try {
      // キャッシュチェック
      if (this.validationCache.has(scriptPath)) {
        const cached = this.validationCache.get(scriptPath);
        console.log(`🔍 [PathValidator] キャッシュから取得: ${scriptPath}`);
        return cached;
      }

      console.log(`🔍 [PathValidator] パス検証開始: ${scriptPath}`);

      const result = {
        path: scriptPath,
        isValid: false,
        exists: false,
        accessible: false,
        mimeType: null,
        size: null,
        lastModified: null,
        errors: [],
        warnings: [],
        validationTime: 0,
        timestamp: new Date().toISOString(),
      };

      // 基本的なパス検証
      const pathValidation = this.validatePathFormat(scriptPath);
      if (!pathValidation.isValid) {
        result.errors.push(...pathValidation.errors);
        result.warnings.push(...pathValidation.warnings);
        this.validationCache.set(scriptPath, result);
        return result;
      }

      // 正規化されたパスを取得
      const normalizedPath = this.normalizePath(scriptPath);
      result.normalizedPath = normalizedPath;

      // ファイル存在確認
      const existsCheck = await this.checkFileExists(normalizedPath);
      result.exists = existsCheck.exists;
      result.accessible = existsCheck.accessible;

      if (existsCheck.error) {
        result.errors.push(existsCheck.error);
      }

      if (!result.exists) {
        result.errors.push(`ファイルが存在しません: ${scriptPath}`);
        result.validationTime = Date.now() - startTime;
        this.validationCache.set(scriptPath, result);
        return result;
      }

      // MIME タイプ確認 (拡張機能付き)
      const mimeCheck = await this.checkMimeTypeEnhanced(normalizedPath);
      result.mimeType = mimeCheck.mimeType;
      result.mimeTypeValidation = mimeCheck.validation;

      if (mimeCheck.error) {
        result.errors.push(mimeCheck.error);
        
        // 拡張エラーハンドラーでの処理
        if (this.mimeTypeErrorHandler) {
          const handlingResult = this.mimeTypeErrorHandler.handleMimeTypeError(
            mimeCheck.error,
            { url: scriptPath, mimeType: mimeCheck.mimeType }
          );
          result.canContinue = handlingResult.canContinue;
          result.errorCategory = handlingResult.category;
        }
      }

      if (mimeCheck.warning) {
        result.warnings.push(mimeCheck.warning);
      }

      // ファイル情報取得
      const fileInfo = await this.getFileInfo(normalizedPath);
      if (fileInfo) {
        result.size = fileInfo.size;
        result.lastModified = fileInfo.lastModified;
      }

      // 総合判定
      result.isValid =
        result.exists && result.accessible && result.errors.length === 0;
      result.validationTime = Date.now() - startTime;

      // キャッシュに保存
      this.validationCache.set(scriptPath, result);
      this.validationResults.push(result);

      console.log(
        `✅ [PathValidator] 検証完了: ${scriptPath} (${result.validationTime}ms)`
      );
      return result;
    } catch (error) {
      const result = {
        path: scriptPath,
        isValid: false,
        exists: false,
        accessible: false,
        errors: [`検証中にエラーが発生: ${error.message}`],
        warnings: [],
        validationTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };

      console.error(`❌ [PathValidator] 検証エラー: ${scriptPath}`, error);
      this.validationCache.set(scriptPath, result);
      return result;
    }
  }

  /**
   * パス形式の検証
   * @param {string} path - 検証するパス
   * @returns {Object} 検証結果
   */
  validatePathFormat(path) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // 基本的なパス検証
    if (!path || typeof path !== "string") {
      result.isValid = false;
      result.errors.push("パスが指定されていないか、文字列ではありません");
      return result;
    }

    // 空文字チェック
    if (path.trim() === "") {
      result.isValid = false;
      result.errors.push("パスが空文字です");
      return result;
    }

    // 拡張子チェック
    const extension = this.getFileExtension(path);
    if (!this.options.allowedExtensions.includes(extension)) {
      if (this.options.strictMode) {
        result.isValid = false;
        result.errors.push(`許可されていない拡張子です: ${extension}`);
      } else {
        result.warnings.push(`推奨されない拡張子です: ${extension}`);
      }
    }

    // 危険な文字のチェック
    const dangerousChars = ["<", ">", '"', "|", "?", "*"];
    const hasDangerousChars = dangerousChars.some((char) =>
      path.includes(char)
    );
    if (hasDangerousChars) {
      result.isValid = false;
      result.errors.push("パスに危険な文字が含まれています");
    }

    // 相対パスの深度チェック
    const pathDepth = path.split("/").length;
    if (pathDepth > 10) {
      result.warnings.push("パスの階層が深すぎる可能性があります");
    }

    return result;
  }

  /**
   * パスの正規化
   * @param {string} path - 正規化するパス
   * @returns {string} 正規化されたパス
   */
  normalizePath(path) {
    // 基本的な正規化
    let normalized = path.replace(/\\/g, "/"); // バックスラッシュをスラッシュに変換
    normalized = normalized.replace(/\/+/g, "/"); // 連続するスラッシュを単一に
    normalized = normalized.replace(/\/\.\//g, "/"); // ./を削除

    // ../ の処理
    const parts = normalized.split("/");
    const stack = [];

    for (const part of parts) {
      if (part === "..") {
        if (stack.length > 0 && stack[stack.length - 1] !== "..") {
          stack.pop();
        } else {
          stack.push(part);
        }
      } else if (part !== "" && part !== ".") {
        stack.push(part);
      }
    }

    normalized = stack.join("/");

    // ベースURLとの結合
    if (this.options.baseUrl && !this.isAbsolutePath(normalized)) {
      normalized = this.options.baseUrl + "/" + normalized;
      normalized = normalized.replace(/\/+/g, "/");
    }

    return normalized;
  }

  /**
   * ファイル存在確認
   * @param {string} path - 確認するパス
   * @returns {Promise<Object>} 存在確認結果
   */
  async checkFileExists(path) {
    try {
      const response = await fetch(path, {
        method: "HEAD",
        cache: "no-cache",
      });

      return {
        exists: response.ok,
        accessible: response.ok,
        status: response.status,
        statusText: response.statusText,
        error: response.ok
          ? null
          : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      return {
        exists: false,
        accessible: false,
        status: null,
        statusText: null,
        error: `ネットワークエラー: ${error.message}`,
      };
    }
  }

  /**
   * MIME タイプ確認
   * @param {string} path - 確認するパス
   * @returns {Promise<Object>} MIME タイプ確認結果
   */
  async checkMimeType(path) {
    try {
      const response = await fetch(path, {
        method: "HEAD",
        cache: "no-cache",
      });

      if (!response.ok) {
        return {
          mimeType: null,
          error: `ファイルにアクセスできません: HTTP ${response.status}`,
        };
      }

      const mimeType = response.headers.get("content-type");
      const result = {
        mimeType: mimeType,
        error: null,
        warning: null,
      };

      // JavaScript ファイルの MIME タイプ検証
      const extension = this.getFileExtension(path);
      if (extension === ".js") {
        const validJsMimeTypes = [
          "application/javascript",
          "text/javascript",
          "application/x-javascript",
        ];

        if (!mimeType) {
          result.warning = "MIME タイプが設定されていません";
        } else if (
          !validJsMimeTypes.some((valid) => mimeType.includes(valid))
        ) {
          if (mimeType.includes("text/html")) {
            result.error = {
              message: `不正な MIME タイプ: ${mimeType} (HTML として配信されています)`,
              actualMimeType: mimeType,
              expectedMimeType: 'application/javascript',
              errorType: 'INCORRECT_MIME_TYPE'
            };
          } else {
            result.warning = `推奨されない MIME タイプ: ${mimeType}`;
          }
        }
      }

      return result;
    } catch (error) {
      return {
        mimeType: null,
        error: {
          message: `MIME タイプ確認エラー: ${error.message}`,
          errorType: 'NETWORK_ERROR'
        },
        warning: null,
      };
    }
  }

  /**
   * 拡張MIME タイプ確認 (エラーハンドリング強化版)
   * @param {string} path - 確認するパス
   * @returns {Promise<Object>} 拡張MIME タイプ確認結果
   */
  async checkMimeTypeEnhanced(path) {
    const basicResult = await this.checkMimeType(path);
    
    const enhanced = {
      ...basicResult,
      validation: {
        isValid: !basicResult.error,
        category: 'UNKNOWN',
        severity: 'INFO',
        canContinueExecution: true,
        recommendations: []
      }
    };

    // エラー分析とカテゴリ分類
    if (basicResult.error) {
      if (typeof basicResult.error === 'string') {
        // 古い形式のエラーを新形式に変換
        if (basicResult.error.includes('不正な MIME タイプ')) {
          enhanced.error = {
            message: basicResult.error,
            actualMimeType: basicResult.mimeType,
            expectedMimeType: 'application/javascript',
            errorType: 'INCORRECT_MIME_TYPE'
          };
        } else {
          enhanced.error = {
            message: basicResult.error,
            errorType: 'NETWORK_ERROR'
          };
        }
      }

      // バリデーション情報の設定
      const error = enhanced.error;
      enhanced.validation.category = error.errorType;
      enhanced.validation.severity = error.errorType === 'NETWORK_ERROR' ? 'ERROR' : 'WARNING';
      enhanced.validation.canContinueExecution = error.errorType !== 'NETWORK_ERROR';
      
      // 推奨事項の生成
      if (error.errorType === 'INCORRECT_MIME_TYPE') {
        enhanced.validation.recommendations = [
          'HTTPサーバーを使用してファイルを配信する',
          'サーバーのMIME タイプ設定を確認する',
          '適切なMIMEタイプ (application/javascript) を設定する'
        ];
      } else {
        enhanced.validation.recommendations = [
          'ファイルパスが正しいか確認する',
          'サーバーが正しく動作しているか確認する'
        ];
      }
    } else {
      enhanced.validation.category = 'VALID';
      enhanced.validation.severity = 'INFO';
    }

    return enhanced;
  }

  /**
   * ファイル情報取得
   * @param {string} path - 情報を取得するパス
   * @returns {Promise<Object|null>} ファイル情報
   */
  async getFileInfo(path) {
    try {
      const response = await fetch(path, {
        method: "HEAD",
        cache: "no-cache",
      });

      if (!response.ok) {
        return null;
      }

      return {
        size: response.headers.get("content-length"),
        lastModified: response.headers.get("last-modified"),
        etag: response.headers.get("etag"),
      };
    } catch (error) {
      console.warn(`⚠️ [PathValidator] ファイル情報取得エラー: ${path}`, error);
      return null;
    }
  }

  /**
   * 複数のスクリプトパスを一括検証
   * @param {string[]} paths - 検証するパスの配列
   * @returns {Promise<Object[]>} 検証結果の配列
   */
  async validateMultiplePaths(paths) {
    console.log(`🔍 [PathValidator] 一括検証開始: ${paths.length}個のパス`);

    const results = await Promise.all(
      paths.map((path) => this.validateScriptPath(path))
    );

    const summary = this.generateValidationSummary(results);
    console.log(`✅ [PathValidator] 一括検証完了:`, summary);

    return results;
  }

  /**
   * 検証結果のサマリー生成
   * @param {Object[]} results - 検証結果の配列
   * @returns {Object} サマリー
   */
  generateValidationSummary(results) {
    const summary = {
      total: results.length,
      valid: 0,
      invalid: 0,
      warnings: 0,
      errors: 0,
      totalValidationTime: 0,
      issues: [],
    };

    results.forEach((result) => {
      if (result.isValid) {
        summary.valid++;
      } else {
        summary.invalid++;
      }

      summary.warnings += result.warnings.length;
      summary.errors += result.errors.length;
      summary.totalValidationTime += result.validationTime;

      if (result.errors.length > 0 || result.warnings.length > 0) {
        summary.issues.push({
          path: result.path,
          errors: result.errors,
          warnings: result.warnings,
        });
      }
    });

    return summary;
  }

  /**
   * ユーティリティメソッド: ファイル拡張子取得
   * @param {string} path - パス
   * @returns {string} 拡張子
   */
  getFileExtension(path) {
    const lastDot = path.lastIndexOf(".");
    return lastDot === -1 ? "" : path.substring(lastDot);
  }

  /**
   * ユーティリティメソッド: 絶対パス判定
   * @param {string} path - パス
   * @returns {boolean} 絶対パスかどうか
   */
  isAbsolutePath(path) {
    return (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("/") ||
      /^[a-zA-Z]:/.test(path)
    ); // Windows drive letter
  }

  /**
   * キャッシュクリア
   */
  clearCache() {
    this.validationCache.clear();
    this.validationResults = [];
    console.log("🔄 [PathValidator] キャッシュをクリアしました");
  }

  /**
   * 検証統計の取得
   * @returns {Object} 統計情報
   */
  getValidationStats() {
    return {
      cacheSize: this.validationCache.size,
      totalValidations: this.validationResults.length,
      averageValidationTime:
        this.validationResults.length > 0
          ? this.validationResults.reduce(
              (sum, r) => sum + r.validationTime,
              0
            ) / this.validationResults.length
          : 0,
      errorHandlerStats: this.mimeTypeErrorHandler ? 
        this.mimeTypeErrorHandler.getStatistics() : null,
      serverDetectionStats: this.serverConfigDetector ?
        this.serverConfigDetector.getStatistics() : null
    };
  }

  /**
   * 拡張バリデーション統合レポート生成
   * @returns {Promise<Object>} 統合レポート
   */
  async generateEnhancedValidationReport() {
    const stats = this.getValidationStats();
    const report = {
      timestamp: new Date().toISOString(),
      validationStats: stats,
      errorSummary: null,
      serverRecommendations: null,
      systemStatus: {
        canContinue: true,
        criticalErrors: 0,
        warnings: 0,
        recommendations: []
      }
    };

    // エラーサマリー
    if (this.mimeTypeErrorHandler) {
      report.errorSummary = this.mimeTypeErrorHandler.generateErrorSummaryReport();
      report.systemStatus.canContinue = report.errorSummary.canContinue;
      report.systemStatus.criticalErrors = report.errorSummary.severity.error;
      report.systemStatus.warnings = report.errorSummary.severity.warning;
      report.systemStatus.recommendations.push(...report.errorSummary.recommendations);
    }

    // サーバー推奨事項
    if (this.serverConfigDetector) {
      try {
        report.serverRecommendations = await this.serverConfigDetector.generateDetailedReport();
      } catch (error) {
        console.warn('🔍 Server configuration report generation failed:', error.message);
      }
    }

    return report;
  }

  /**
   * 開発者向けトラブルシューティングガイド生成
   * @returns {Object} トラブルシューティングガイド
   */
  generateTroubleshootingGuide() {
    return {
      mimeTypeIssues: {
        title: 'MIME Type Problems',
        symptoms: [
          'JavaScript files served as text/html',
          'Scripts not executing properly',
          'Console warnings about MIME types'
        ],
        solutions: [
          {
            method: 'HTTP Server',
            command: 'python3 -m http.server 8000',
            description: 'Use proper HTTP server instead of file:// protocol'
          },
          {
            method: 'Apache Configuration',
            file: '.htaccess',
            content: 'AddType application/javascript .js',
            description: 'Configure Apache to serve JS files with correct MIME type'
          },
          {
            method: 'Nginx Configuration',
            file: 'nginx.conf',
            content: 'location ~* \\.js$ { add_header Content-Type application/javascript; }',
            description: 'Configure Nginx for proper MIME types'
          }
        ]
      },
      commonProblems: {
        title: 'Common Development Issues',
        fileNotFound: {
          symptoms: ['404 errors', 'Failed to fetch'],
          solutions: ['Check file paths', 'Verify server is running', 'Check relative path base']
        },
        corsIssues: {
          symptoms: ['CORS policy errors', 'Cross-origin requests blocked'],
          solutions: ['Use same-origin requests', 'Configure CORS headers', 'Use HTTP server']
        },
        cacheProblems: {
          symptoms: ['Old files loading', 'Changes not reflected'],
          solutions: ['Clear browser cache', 'Use cache-busting parameters', 'Disable cache during development']
        }
      },
      quickDiagnostics: {
        title: 'Quick Diagnostic Steps',
        steps: [
          'Check browser console for errors',
          'Verify file paths and existence',
          'Test with curl -I to check headers',
          'Confirm server is running on expected port',
          'Clear browser cache and try again'
        ]
      }
    };
  }
}

// グローバルに公開
window.ScriptPathValidator = ScriptPathValidator;
