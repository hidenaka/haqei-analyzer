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
      ...options,
    };

    this.validationCache = new Map();
    this.validationResults = [];
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

      // MIME タイプ確認
      const mimeCheck = await this.checkMimeType(normalizedPath);
      result.mimeType = mimeCheck.mimeType;

      if (mimeCheck.error) {
        result.errors.push(mimeCheck.error);
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
            result.error = `不正な MIME タイプ: ${mimeType} (HTML として配信されています)`;
          } else {
            result.warning = `推奨されない MIME タイプ: ${mimeType}`;
          }
        }
      }

      return result;
    } catch (error) {
      return {
        mimeType: null,
        error: `MIME タイプ確認エラー: ${error.message}`,
        warning: null,
      };
    }
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
    };
  }
}

// グローバルに公開
window.ScriptPathValidator = ScriptPathValidator;
