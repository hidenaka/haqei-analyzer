/**
 * ErrorDetectionReporter - 404エラーとMIMEタイプエラーの検出・報告機能
 *
 * 機能:
 * - スクリプト読み込みエラーの自動検出
 * - 404エラーの詳細報告
 * - MIMEタイプエラーの検出と対処法提案
 * - エラーログの構造化と分析
 * - 開発者向けの詳細なデバッグ情報提供
 */

class ErrorDetectionReporter {
  constructor(options = {}) {
    this.options = {
      enableAutoDetection: options.enableAutoDetection !== false,
      enableConsoleReporting: options.enableConsoleReporting !== false,
      enableDetailedLogging: options.enableDetailedLogging !== false,
      maxErrorHistory: options.maxErrorHistory || 100,
      reportingLevel: options.reportingLevel || "detailed", // 'minimal', 'standard', 'detailed'
      ...options,
    };

    this.errorHistory = [];
    this.errorStats = {
      total: 0,
      byType: {},
      byPath: {},
      recentErrors: [],
    };

    this.mimeTypePatterns = {
      javascript: [
        "application/javascript",
        "text/javascript",
        "application/x-javascript",
      ],
      json: ["application/json", "text/json"],
      css: ["text/css"],
    };

    this.init();
  }

  /**
   * 初期化
   */
  init() {
    if (this.options.enableAutoDetection) {
      this.setupErrorListeners();
      this.setupScriptLoadMonitoring();
    }

    console.log("🔍 [ErrorReporter] エラー検出・報告システムを初期化しました");
  }

  /**
   * エラーリスナーの設定
   */
  setupErrorListeners() {
    // グローバルエラーハンドラー
    window.addEventListener("error", (event) => {
      this.handleScriptError(event);
    });

    // Promise rejection ハンドラー
    window.addEventListener("unhandledrejection", (event) => {
      this.handlePromiseRejection(event);
    });

    // リソース読み込みエラーハンドラー
    document.addEventListener(
      "error",
      (event) => {
        if (event.target && event.target.tagName === "SCRIPT") {
          this.handleScriptLoadError(event);
        }
      },
      true
    );
  }

  /**
   * スクリプト読み込み監視の設定
   */
  setupScriptLoadMonitoring() {
    // 既存のスクリプトタグを監視
    const scripts = document.querySelectorAll("script[src]");
    scripts.forEach((script) => {
      this.monitorScriptElement(script);
    });

    // 新しく追加されるスクリプトタグを監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "SCRIPT" && node.src) {
            this.monitorScriptElement(node);
          }
        });
      });
    });

    observer.observe(document.head, { childList: true });
    observer.observe(document.body, { childList: true });
  }

  /**
   * スクリプト要素の監視
   * @param {HTMLScriptElement} scriptElement - 監視するスクリプト要素
   */
  monitorScriptElement(scriptElement) {
    const src = scriptElement.src;
    const startTime = Date.now();

    scriptElement.addEventListener("load", () => {
      const loadTime = Date.now() - startTime;
      this.reportScriptLoadSuccess(src, loadTime);
    });

    scriptElement.addEventListener("error", (event) => {
      this.handleScriptElementError(event, src);
    });
  }

  /**
   * スクリプトエラーハンドラー
   * @param {ErrorEvent} event - エラーイベント
   */
  handleScriptError(event) {
    const errorInfo = {
      type: "script_error",
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    this.recordError(errorInfo);
    this.analyzeScriptError(errorInfo);
  }

  /**
   * Promise rejection ハンドラー
   * @param {PromiseRejectionEvent} event - Promise rejection イベント
   */
  handlePromiseRejection(event) {
    const errorInfo = {
      type: "promise_rejection",
      reason: event.reason,
      timestamp: new Date().toISOString(),
      stack: event.reason?.stack,
    };

    this.recordError(errorInfo);
    this.analyzePromiseRejection(errorInfo);
  }

  /**
   * スクリプト読み込みエラーハンドラー
   * @param {Event} event - エラーイベント
   */
  handleScriptLoadError(event) {
    const script = event.target;
    const src = script.src;

    const errorInfo = {
      type: "script_load_error",
      src: src,
      timestamp: new Date().toISOString(),
      element: script,
    };

    this.recordError(errorInfo);
    this.analyzeScriptLoadError(errorInfo);
  }

  /**
   * スクリプト要素エラーハンドラー
   * @param {Event} event - エラーイベント
   * @param {string} src - スクリプトのURL
   */
  handleScriptElementError(event, src) {
    const errorInfo = {
      type: "script_element_error",
      src: src,
      timestamp: new Date().toISOString(),
      event: event,
    };

    this.recordError(errorInfo);
    this.performDetailedErrorAnalysis(src);
  }

  /**
   * 詳細なエラー分析の実行
   * @param {string} scriptUrl - 分析するスクリプトのURL
   */
  async performDetailedErrorAnalysis(scriptUrl) {
    console.group(`🔍 [ErrorReporter] 詳細エラー分析: ${scriptUrl}`);

    try {
      // 1. ファイル存在確認
      const existsCheck = await this.checkFileExists(scriptUrl);
      console.log("📁 ファイル存在確認:", existsCheck);

      // 2. MIMEタイプ確認
      const mimeCheck = await this.checkMimeType(scriptUrl);
      console.log("🏷️ MIMEタイプ確認:", mimeCheck);

      // 3. ネットワーク状態確認
      const networkCheck = this.checkNetworkStatus();
      console.log("🌐 ネットワーク状態:", networkCheck);

      // 4. ブラウザ互換性確認
      const compatCheck = this.checkBrowserCompatibility();
      console.log("🌍 ブラウザ互換性:", compatCheck);

      // 5. 総合診断と推奨対処法
      const diagnosis = this.generateErrorDiagnosis({
        url: scriptUrl,
        exists: existsCheck,
        mime: mimeCheck,
        network: networkCheck,
        compat: compatCheck,
      });

      console.log("💡 診断結果と推奨対処法:", diagnosis);

      // 6. 構造化されたエラーレポート生成
      const report = this.generateStructuredErrorReport({
        url: scriptUrl,
        exists: existsCheck,
        mime: mimeCheck,
        network: networkCheck,
        compat: compatCheck,
        diagnosis: diagnosis,
      });

      this.reportError(report);
    } catch (analysisError) {
      console.error("❌ [ErrorReporter] 分析中にエラーが発生:", analysisError);
    }

    console.groupEnd();
  }

  /**
   * ファイル存在確認
   * @param {string} url - 確認するURL
   * @returns {Promise<Object>} 確認結果
   */
  async checkFileExists(url) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        cache: "no-cache",
      });

      return {
        exists: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        error: response.ok
          ? null
          : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      return {
        exists: false,
        status: null,
        statusText: null,
        headers: {},
        error: `ネットワークエラー: ${error.message}`,
        networkError: true,
      };
    }
  }

  /**
   * MIMEタイプ確認
   * @param {string} url - 確認するURL
   * @returns {Promise<Object>} 確認結果
   */
  async checkMimeType(url) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        cache: "no-cache",
      });

      const mimeType = response.headers.get("content-type");
      const extension = this.getFileExtension(url);

      const result = {
        mimeType: mimeType,
        extension: extension,
        isValid: false,
        issues: [],
        recommendations: [],
      };

      // 拡張子に基づく期待されるMIMEタイプ
      const expectedMimeTypes = this.getExpectedMimeTypes(extension);

      if (!mimeType) {
        result.issues.push("MIMEタイプが設定されていません");
        result.recommendations.push(
          "サーバーでMIMEタイプを適切に設定してください"
        );
      } else if (expectedMimeTypes.length > 0) {
        const isValidMime = expectedMimeTypes.some((expected) =>
          mimeType.toLowerCase().includes(expected.toLowerCase())
        );

        if (isValidMime) {
          result.isValid = true;
        } else {
          result.issues.push(
            `不適切なMIMEタイプ: ${mimeType} (期待値: ${expectedMimeTypes.join(
              ", "
            )})`
          );

          if (mimeType.includes("text/html")) {
            result.issues.push(
              "ファイルがHTMLとして配信されています（404エラーページの可能性）"
            );
            result.recommendations.push(
              "ファイルパスを確認し、正しいファイルが存在することを確認してください"
            );
          }

          result.recommendations.push(
            "サーバーのMIMEタイプ設定を確認してください"
          );
        }
      }

      return result;
    } catch (error) {
      return {
        mimeType: null,
        extension: this.getFileExtension(url),
        isValid: false,
        issues: [`MIMEタイプ確認エラー: ${error.message}`],
        recommendations: ["ネットワーク接続を確認してください"],
        networkError: true,
      };
    }
  }

  /**
   * ネットワーク状態確認
   * @returns {Object} ネットワーク状態
   */
  checkNetworkStatus() {
    return {
      online: navigator.onLine,
      connection: navigator.connection
        ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
          }
        : null,
      protocol: location.protocol,
      isLocalhost:
        location.hostname === "localhost" || location.hostname === "127.0.0.1",
      isFileProtocol: location.protocol === "file:",
    };
  }

  /**
   * ブラウザ互換性確認
   * @returns {Object} 互換性情報
   */
  checkBrowserCompatibility() {
    const ua = navigator.userAgent;

    return {
      userAgent: ua,
      isModernBrowser: "fetch" in window && "Promise" in window,
      supportsES6Modules: "noModule" in HTMLScriptElement.prototype,
      supportsES6: (() => {
        try {
          eval("const test = () => {};");
          return true;
        } catch (e) {
          return false;
        }
      })(),
      browser: this.detectBrowser(ua),
      recommendations: [],
    };
  }

  /**
   * ブラウザ検出
   * @param {string} userAgent - User Agent文字列
   * @returns {Object} ブラウザ情報
   */
  detectBrowser(userAgent) {
    const browsers = [
      { name: "Chrome", pattern: /Chrome\/(\d+)/ },
      { name: "Firefox", pattern: /Firefox\/(\d+)/ },
      { name: "Safari", pattern: /Safari\/(\d+)/ },
      { name: "Edge", pattern: /Edge\/(\d+)/ },
      { name: "IE", pattern: /MSIE (\d+)|Trident.*rv:(\d+)/ },
    ];

    for (const browser of browsers) {
      const match = userAgent.match(browser.pattern);
      if (match) {
        return {
          name: browser.name,
          version: match[1] || match[2],
          isSupported: this.isBrowserSupported(
            browser.name,
            match[1] || match[2]
          ),
        };
      }
    }

    return { name: "Unknown", version: "Unknown", isSupported: false };
  }

  /**
   * ブラウザサポート確認
   * @param {string} browserName - ブラウザ名
   * @param {string} version - バージョン
   * @returns {boolean} サポート状況
   */
  isBrowserSupported(browserName, version) {
    const minVersions = {
      Chrome: 60,
      Firefox: 55,
      Safari: 12,
      Edge: 79,
      IE: 0, // IE は基本的にサポート外
    };

    const minVersion = minVersions[browserName];
    return minVersion !== undefined && parseInt(version) >= minVersion;
  }

  /**
   * エラー診断の生成
   * @param {Object} analysisData - 分析データ
   * @returns {Object} 診断結果
   */
  generateErrorDiagnosis(analysisData) {
    const diagnosis = {
      primaryIssue: null,
      severity: "low",
      category: "unknown",
      solutions: [],
      preventionTips: [],
    };

    const { exists, mime, network, compat } = analysisData;

    // 主要な問題の特定
    if (!exists.exists) {
      if (exists.status === 404) {
        diagnosis.primaryIssue = "ファイルが見つかりません (404 Not Found)";
        diagnosis.severity = "high";
        diagnosis.category = "file_not_found";
        diagnosis.solutions = [
          "ファイルパスを確認してください",
          "ファイルが正しい場所に配置されているか確認してください",
          "ファイル名の大文字小文字を確認してください",
          "サーバーの設定を確認してください",
        ];
      } else if (exists.networkError) {
        diagnosis.primaryIssue = "ネットワーク接続エラー";
        diagnosis.severity = "high";
        diagnosis.category = "network_error";
        diagnosis.solutions = [
          "インターネット接続を確認してください",
          "サーバーが稼働しているか確認してください",
          "ファイアウォールの設定を確認してください",
        ];
      }
    } else if (mime && !mime.isValid) {
      diagnosis.primaryIssue = "MIMEタイプエラー";
      diagnosis.severity = "medium";
      diagnosis.category = "mime_type_error";
      diagnosis.solutions = [
        "サーバーのMIMEタイプ設定を確認してください",
        "HTTPサーバーを使用してファイルを配信してください",
        ".htaccessファイルでMIMEタイプを設定してください",
      ];
    }

    // ファイルプロトコルの警告
    if (network.isFileProtocol) {
      diagnosis.preventionTips.push(
        "file://プロトコルではなく、HTTPサーバーを使用することを推奨します"
      );
    }

    // ブラウザ互換性の警告
    if (!compat.isSupported) {
      diagnosis.preventionTips.push("より新しいブラウザの使用を推奨します");
    }

    return diagnosis;
  }

  /**
   * 構造化エラーレポートの生成
   * @param {Object} data - レポートデータ
   * @returns {Object} 構造化レポート
   */
  generateStructuredErrorReport(data) {
    return {
      timestamp: new Date().toISOString(),
      type: "detailed_error_analysis",
      url: data.url,
      summary: {
        fileExists: data.exists.exists,
        mimeTypeValid: data.mime.isValid,
        networkOnline: data.network.online,
        browserSupported: data.compat.browser.isSupported,
      },
      details: {
        fileCheck: data.exists,
        mimeCheck: data.mime,
        networkStatus: data.network,
        browserCompat: data.compat,
      },
      diagnosis: data.diagnosis,
      recommendations: this.generateRecommendations(data),
      debugInfo: this.generateDebugInfo(data),
    };
  }

  /**
   * 推奨対処法の生成
   * @param {Object} data - 分析データ
   * @returns {Array} 推奨対処法のリスト
   */
  generateRecommendations(data) {
    const recommendations = [];

    // 基本的な推奨事項
    recommendations.push({
      priority: "high",
      category: "development",
      title: "HTTPサーバーの使用",
      description: "ローカル開発時はHTTPサーバーを使用してください",
      commands: ["python -m http.server 8000", "npx http-server -p 8000"],
    });

    // 診断結果に基づく推奨事項
    if (data.diagnosis.category === "file_not_found") {
      recommendations.push({
        priority: "high",
        category: "file_management",
        title: "ファイルパスの確認",
        description: "ファイルの存在とパスを確認してください",
        steps: [
          "ファイルが正しい場所に存在するか確認",
          "パスの大文字小文字を確認",
          "相対パスと絶対パスの使い分けを確認",
        ],
      });
    }

    if (data.diagnosis.category === "mime_type_error") {
      recommendations.push({
        priority: "medium",
        category: "server_configuration",
        title: "MIMEタイプの設定",
        description:
          "サーバーでJavaScriptファイルの適切なMIMEタイプを設定してください",
        examples: [
          "Apache: AddType application/javascript .js",
          "Nginx: location ~* \\.js$ { add_header Content-Type application/javascript; }",
        ],
      });
    }

    return recommendations;
  }

  /**
   * デバッグ情報の生成
   * @param {Object} data - 分析データ
   * @returns {Object} デバッグ情報
   */
  generateDebugInfo(data) {
    return {
      timestamp: new Date().toISOString(),
      url: data.url,
      currentLocation: {
        href: location.href,
        protocol: location.protocol,
        hostname: location.hostname,
        pathname: location.pathname,
      },
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      errorHistory: this.getRecentErrors(5),
    };
  }

  /**
   * エラーの記録
   * @param {Object} errorInfo - エラー情報
   */
  recordError(errorInfo) {
    this.errorHistory.push(errorInfo);

    // 履歴サイズの制限
    if (this.errorHistory.length > this.options.maxErrorHistory) {
      this.errorHistory.shift();
    }

    // 統計の更新
    this.updateErrorStats(errorInfo);
  }

  /**
   * エラー統計の更新
   * @param {Object} errorInfo - エラー情報
   */
  updateErrorStats(errorInfo) {
    this.errorStats.total++;

    // タイプ別統計
    const type = errorInfo.type || "unknown";
    this.errorStats.byType[type] = (this.errorStats.byType[type] || 0) + 1;

    // パス別統計（該当する場合）
    if (errorInfo.src || errorInfo.filename) {
      const path = errorInfo.src || errorInfo.filename;
      this.errorStats.byPath[path] = (this.errorStats.byPath[path] || 0) + 1;
    }

    // 最近のエラー
    this.errorStats.recentErrors.push({
      type: type,
      timestamp: errorInfo.timestamp,
      message: errorInfo.message || errorInfo.reason || "Unknown error",
    });

    // 最近のエラー履歴の制限
    if (this.errorStats.recentErrors.length > 10) {
      this.errorStats.recentErrors.shift();
    }
  }

  /**
   * エラーレポート
   * @param {Object} report - レポート
   */
  reportError(report) {
    if (this.options.enableConsoleReporting) {
      this.logErrorReport(report);
    }

    // カスタムイベントの発火
    const event = new CustomEvent("errorDetected", {
      detail: report,
    });
    window.dispatchEvent(event);
  }

  /**
   * エラーレポートのログ出力
   * @param {Object} report - レポート
   */
  logErrorReport(report) {
    console.group(`🚨 [ErrorReporter] エラーレポート: ${report.url}`);

    console.log("📊 概要:", report.summary);

    if (report.diagnosis.primaryIssue) {
      console.error(`🎯 主要な問題: ${report.diagnosis.primaryIssue}`);
      console.log(`📈 重要度: ${report.diagnosis.severity}`);
    }

    if (report.diagnosis.solutions.length > 0) {
      console.group("💡 推奨解決策:");
      report.diagnosis.solutions.forEach((solution, index) => {
        console.log(`${index + 1}. ${solution}`);
      });
      console.groupEnd();
    }

    if (this.options.reportingLevel === "detailed") {
      console.log("🔍 詳細情報:", report.details);
      console.log("🛠️ 推奨対処法:", report.recommendations);
      console.log("🐛 デバッグ情報:", report.debugInfo);
    }

    console.groupEnd();
  }

  /**
   * スクリプト読み込み成功の報告
   * @param {string} src - スクリプトのURL
   * @param {number} loadTime - 読み込み時間
   */
  reportScriptLoadSuccess(src, loadTime) {
    if (this.options.enableDetailedLogging) {
      console.log(
        `✅ [ErrorReporter] スクリプト読み込み成功: ${src} (${loadTime}ms)`
      );
    }
  }

  /**
   * スクリプトエラーの分析
   * @param {Object} errorInfo - エラー情報
   */
  analyzeScriptError(errorInfo) {
    // 一般的なエラーパターンの分析
    const message = errorInfo.message.toLowerCase();

    if (message.includes("mime type")) {
      console.warn("⚠️ [ErrorReporter] MIMEタイプエラーを検出しました");
      this.suggestMimeTypeFix(errorInfo.filename);
    }

    if (message.includes("module") || message.includes("import")) {
      console.warn("⚠️ [ErrorReporter] ES6モジュールエラーを検出しました");
      this.suggestModuleFix();
    }
  }

  /**
   * Promise rejection の分析
   * @param {Object} errorInfo - エラー情報
   */
  analyzePromiseRejection(errorInfo) {
    const reason = String(errorInfo.reason).toLowerCase();

    if (reason.includes("fetch") || reason.includes("network")) {
      console.warn(
        "⚠️ [ErrorReporter] ネットワーク関連のPromise rejectionを検出しました"
      );
    }
  }

  /**
   * スクリプト読み込みエラーの分析
   * @param {Object} errorInfo - エラー情報
   */
  analyzeScriptLoadError(errorInfo) {
    console.warn(
      `⚠️ [ErrorReporter] スクリプト読み込みエラーを検出: ${errorInfo.src}`
    );

    // 自動的に詳細分析を実行
    setTimeout(() => {
      this.performDetailedErrorAnalysis(errorInfo.src);
    }, 100);
  }

  /**
   * MIMEタイプ修正の提案
   * @param {string} filename - ファイル名
   */
  suggestMimeTypeFix(filename) {
    console.group("💡 [ErrorReporter] MIMEタイプエラーの解決方法:");
    console.log("1. HTTPサーバーを使用してファイルを配信してください");
    console.log(
      "2. サーバーの設定でJavaScriptファイルのMIMEタイプを設定してください"
    );
    console.log("3. 開発時は以下のコマンドでHTTPサーバーを起動できます:");
    console.log("   - python -m http.server 8000");
    console.log("   - npx http-server -p 8000");
    console.groupEnd();
  }

  /**
   * モジュール修正の提案
   */
  suggestModuleFix() {
    console.group("💡 [ErrorReporter] ES6モジュールエラーの解決方法:");
    console.log('1. スクリプトタグに type="module" を追加してください');
    console.log(
      "2. または、ES6モジュール構文を削除してグローバル変数を使用してください"
    );
    console.log(
      "3. モジュールバンドラー（webpack, rollup等）の使用を検討してください"
    );
    console.groupEnd();
  }

  /**
   * 最近のエラーを取得
   * @param {number} count - 取得する件数
   * @returns {Array} 最近のエラー
   */
  getRecentErrors(count = 5) {
    return this.errorHistory.slice(-count);
  }

  /**
   * エラー統計を取得
   * @returns {Object} エラー統計
   */
  getErrorStats() {
    return { ...this.errorStats };
  }

  /**
   * 期待されるMIMEタイプを取得
   * @param {string} extension - ファイル拡張子
   * @returns {Array} 期待されるMIMEタイプのリスト
   */
  getExpectedMimeTypes(extension) {
    const ext = extension.toLowerCase();

    if (ext === ".js") return this.mimeTypePatterns.javascript;
    if (ext === ".json") return this.mimeTypePatterns.json;
    if (ext === ".css") return this.mimeTypePatterns.css;

    return [];
  }

  /**
   * ファイル拡張子を取得
   * @param {string} path - ファイルパス
   * @returns {string} 拡張子
   */
  getFileExtension(path) {
    const lastDot = path.lastIndexOf(".");
    return lastDot === -1 ? "" : path.substring(lastDot);
  }

  /**
   * エラー履歴をクリア
   */
  clearErrorHistory() {
    this.errorHistory = [];
    this.errorStats = {
      total: 0,
      byType: {},
      byPath: {},
      recentErrors: [],
    };
    console.log("🔄 [ErrorReporter] エラー履歴をクリアしました");
  }

  /**
   * 設定の更新
   * @param {Object} newOptions - 新しい設定
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    console.log("⚙️ [ErrorReporter] 設定を更新しました:", newOptions);
  }
}

// グローバルに公開
window.ErrorDetectionReporter = ErrorDetectionReporter;
