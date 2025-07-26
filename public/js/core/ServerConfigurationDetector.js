/**
 * ServerConfigurationDetector - サーバー設定検出と推奨事項生成システム
 *
 * 機能:
 * - サーバータイプの自動検出
 * - サーバー固有の設定推奨事項生成
 * - 環境別設定テンプレート提供
 * - 設定検証機能
 */

class ServerConfigurationDetector {
  constructor(options = {}) {
    this.options = {
      enableAutoDetection: options.enableAutoDetection !== false,
      includeConfigTemplates: options.includeConfigTemplates !== false,
      detectionTimeout: options.detectionTimeout || 3000,
      ...options
    };

    this.detectedServerType = null;
    this.serverInfo = null;
    this.configurationRecommendations = null;
  }

  /**
   * サーバータイプの自動検出
   * @returns {Promise<string>} 検出されたサーバータイプ
   */
  async detectServerType() {
    if (!this.options.enableAutoDetection) {
      return 'UNKNOWN';
    }

    try {
      // URLパターンでの検出
      const urlDetection = this.detectFromUrl();
      if (urlDetection !== 'UNKNOWN') {
        this.detectedServerType = urlDetection;
        return urlDetection;
      }

      // HTTPヘッダーでの検出
      const headerDetection = await this.detectFromHeaders();
      if (headerDetection !== 'UNKNOWN') {
        this.detectedServerType = headerDetection;
        return headerDetection;
      }

      // ファイルアクセステストでの検出
      const accessDetection = await this.detectFromAccessPatterns();
      if (accessDetection !== 'UNKNOWN') {
        this.detectedServerType = accessDetection;
        return accessDetection;
      }

      this.detectedServerType = 'UNKNOWN';
      return 'UNKNOWN';
    } catch (error) {
      console.warn('🔍 Server type detection failed:', error.message);
      this.detectedServerType = 'UNKNOWN';
      return 'UNKNOWN';
    }
  }

  /**
   * URLパターンからのサーバータイプ検出
   * @returns {string} サーバータイプ
   */
  detectFromUrl() {
    const currentUrl = window.location.href;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // 開発サーバーの典型的なポート
    if (port) {
      switch (port) {
        case '8000':
          return 'PYTHON_HTTP';
        case '3000':
          return 'NODE_EXPRESS';
        case '8080':
          return 'NODE_EXPRESS';
        case '80':
        case '443':
          return hostname === 'localhost' ? 'APACHE' : 'PRODUCTION';
        default:
          break;
      }
    }

    // ローカル開発環境の検出
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'DEVELOPMENT_SERVER';
    }

    // file://プロトコルの場合
    if (currentUrl.startsWith('file://')) {
      return 'FILE_PROTOCOL';
    }

    return 'UNKNOWN';
  }

  /**
   * HTTPヘッダーからのサーバータイプ検出
   * @returns {Promise<string>} サーバータイプ
   */
  async detectFromHeaders() {
    try {
      const testUrl = window.location.pathname;
      const response = await fetch(testUrl, {
        method: 'HEAD',
        cache: 'no-cache'
      });

      const serverHeader = response.headers.get('server');
      const poweredBy = response.headers.get('x-powered-by');

      if (serverHeader) {
        const server = serverHeader.toLowerCase();
        if (server.includes('apache')) {
          return 'APACHE';
        }
        if (server.includes('nginx')) {
          return 'NGINX';
        }
        if (server.includes('iis')) {
          return 'IIS';
        }
        if (server.includes('express')) {
          return 'NODE_EXPRESS';
        }
      }

      if (poweredBy) {
        const powered = poweredBy.toLowerCase();
        if (powered.includes('express')) {
          return 'NODE_EXPRESS';
        }
        if (powered.includes('asp.net')) {
          return 'IIS';
        }
      }

      return 'UNKNOWN';
    } catch (error) {
      return 'UNKNOWN';
    }
  }

  /**
   * アクセスパターンからの検出
   * @returns {Promise<string>} サーバータイプ
   */
  async detectFromAccessPatterns() {
    try {
      // 404ページの特徴を確認
      const testResponse = await fetch('/nonexistent-test-file-xyz.js', {
        method: 'HEAD',
        cache: 'no-cache'
      });

      if (!testResponse.ok) {
        const contentType = testResponse.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          // HTMLが返される = 通常のHTTPサーバー
          return 'HTTP_SERVER';
        }
      }

      return 'UNKNOWN';
    } catch (error) {
      return 'UNKNOWN';
    }
  }

  /**
   * サーバー固有の設定ガイド生成
   * @param {string} serverType - サーバータイプ
   * @returns {Object} 設定ガイド
   */
  generateConfigurationGuide(serverType) {
    const guides = {
      APACHE: {
        serverName: 'Apache HTTP Server',
        configFiles: ['.htaccess', 'httpd.conf'],
        mimeTypeConfig: {
          file: '.htaccess',
          content: `# MIME Type Configuration for JavaScript files
AddType application/javascript .js
AddType application/json .json

# Optional: Enable compression for JS files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>`
        },
        instructions: [
          'プロジェクトルートに.htaccessファイルを作成',
          '上記の設定を.htaccessファイルに追加',
          'Apacheサーバーを再起動 (必要に応じて)',
          'ブラウザキャッシュをクリアして確認'
        ],
        testCommands: [
          'curl -I http://localhost/path/to/script.js',
          'Content-Typeが "application/javascript" になっているか確認'
        ]
      },

      NGINX: {
        serverName: 'Nginx',
        configFiles: ['nginx.conf', 'sites-available/default'],
        mimeTypeConfig: {
          file: 'nginx.conf',
          content: `# MIME Type Configuration for JavaScript files
location ~* \\.js$ {
    add_header Content-Type application/javascript;
    add_header Cache-Control "public, max-age=31536000";
}

location ~* \\.json$ {
    add_header Content-Type application/json;
}`
        },
        instructions: [
          'Nginx設定ファイル (nginx.conf) を編集',
          'server ブロック内に上記の設定を追加',
          'nginx -t でファイル構文を確認',
          'sudo systemctl reload nginx でNginxを再読み込み'
        ],
        testCommands: [
          'nginx -t',
          'curl -I http://localhost/path/to/script.js'
        ]
      },

      NODE_EXPRESS: {
        serverName: 'Node.js Express',
        configFiles: ['app.js', 'server.js'],
        mimeTypeConfig: {
          file: 'app.js',
          content: `// MIME Type Configuration for Express.js
const express = require('express');
const path = require('path');
const app = express();

// Static files with proper MIME types
app.use(express.static('public', {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.extname(filePath) === '.json') {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// Alternative method using express.static options
app.use('/js', express.static('js', {
  'Content-Type': 'application/javascript'
}));`
        },
        instructions: [
          'Express.jsサーバーファイルを編集',
          'express.staticミドルウェアにsetHeadersオプションを追加',
          'サーバーを再起動',
          'ブラウザで確認'
        ],
        testCommands: [
          'npm restart',
          'curl -I http://localhost:3000/js/script.js'
        ]
      },

      PYTHON_HTTP: {
        serverName: 'Python HTTP Server',
        configFiles: ['server.py'],
        mimeTypeConfig: {
          file: 'server.py',
          content: `#!/usr/bin/env python3
# MIME Type Configuration for Python HTTP Server
import http.server
import mimetypes
import socketserver

# Add JavaScript MIME type
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/json', '.json')

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        httpd.serve_forever()`
        },
        instructions: [
          'カスタムPythonサーバーファイルを作成',
          'mimetypes.add_type()でMIMEタイプを設定',
          'python server.py でサーバーを起動',
          'ブラウザでJavaScriptファイルのMIMEタイプを確認'
        ],
        testCommands: [
          'python3 server.py',
          'curl -I http://localhost:8000/js/script.js'
        ]
      },

      FILE_PROTOCOL: {
        serverName: 'File Protocol (Direct file access)',
        configFiles: [],
        mimeTypeConfig: {
          file: null,
          content: '# File protocol does not support MIME type configuration'
        },
        instructions: [
          'HTTPサーバーを使用することを強く推奨',
          'python -m http.server 8000 を使用',
          'または npx http-server -p 8000 を使用',
          'file://プロトコルではMIMEタイプ設定不可'
        ],
        testCommands: [
          'python -m http.server 8000',
          'npx http-server -p 8000'
        ]
      },

      DEVELOPMENT_SERVER: {
        serverName: 'Development Server (Generic)',
        configFiles: [],
        mimeTypeConfig: {
          file: 'Various',
          content: '# Server-specific configuration required'
        },
        instructions: [
          'サーバータイプを特定してください',
          '適切な設定ファイルを確認',
          'JavaScriptファイルのMIMEタイプを application/javascript に設定',
          'サーバーを再起動'
        ],
        testCommands: [
          'curl -I http://localhost/js/script.js',
          'ブラウザの開発者ツールでレスポンスヘッダーを確認'
        ]
      }
    };

    return guides[serverType] || guides.DEVELOPMENT_SERVER;
  }

  /**
   * 現在の環境用設定推奨事項を取得
   * @returns {Promise<Object>} 設定推奨事項
   */
  async getCurrentEnvironmentRecommendations() {
    const serverType = await this.detectServerType();
    const configGuide = this.generateConfigurationGuide(serverType);

    this.configurationRecommendations = {
      detectedServerType: serverType,
      confidence: this.getDetectionConfidence(serverType),
      configurationGuide: configGuide,
      quickFixCommands: this.getQuickFixCommands(serverType),
      additionalNotes: this.getAdditionalNotes(serverType)
    };

    return this.configurationRecommendations;
  }

  /**
   * 検出信頼度の算出
   * @param {string} serverType - サーバータイプ
   * @returns {number} 信頼度 (0-100)
   */
  getDetectionConfidence(serverType) {
    switch (serverType) {
      case 'APACHE':
      case 'NGINX':
      case 'NODE_EXPRESS':
        return 85;
      case 'PYTHON_HTTP':
        return 75;
      case 'FILE_PROTOCOL':
        return 95;
      case 'DEVELOPMENT_SERVER':
        return 60;
      default:
        return 30;
    }
  }

  /**
   * クイックフィックスコマンドの生成
   * @param {string} serverType - サーバータイプ
   * @returns {Array} コマンドリスト
   */
  getQuickFixCommands(serverType) {
    switch (serverType) {
      case 'PYTHON_HTTP':
        return [
          'python3 -c "import mimetypes; mimetypes.add_type(\'application/javascript\', \'.js\')" && python3 -m http.server 8000'
        ];
      case 'FILE_PROTOCOL':
        return [
          'python3 -m http.server 8000',
          'npx http-server -p 8000'
        ];
      default:
        return [
          'サーバー設定ファイルを編集してMIMEタイプを追加',
          'サーバーを再起動'
        ];
    }
  }

  /**
   * 追加注意事項の生成
   * @param {string} serverType - サーバータイプ
   * @returns {Array} 注意事項リスト
   */
  getAdditionalNotes(serverType) {
    const commonNotes = [
      '変更後はブラウザキャッシュをクリアしてください',
      'Content-Type ヘッダーが正しく設定されているか確認してください'
    ];

    switch (serverType) {
      case 'FILE_PROTOCOL':
        return [
          'file://プロトコルではMIMEタイプの設定ができません',
          'セキュリティ上の理由でHTTPサーバーの使用を推奨します',
          ...commonNotes
        ];
      case 'DEVELOPMENT_SERVER':
        return [
          'サーバータイプの特定が必要です',
          'curl -I でレスポンスヘッダーを確認してください',
          ...commonNotes
        ];
      default:
        return commonNotes;
    }
  }

  /**
   * サーバー設定の検証
   * @returns {Promise<Object>} 検証結果
   */
  async validateServerConfiguration() {
    const testFile = 'js/core/ScriptPathValidator.js'; // 存在するファイルでテスト

    try {
      const response = await fetch(testFile, {
        method: 'HEAD',
        cache: 'no-cache'
      });

      const contentType = response.headers.get('content-type');
      const isValid = contentType && (
        contentType.includes('application/javascript') ||
        contentType.includes('text/javascript')
      );

      return {
        isConfigured: isValid,
        currentMimeType: contentType,
        expectedMimeType: 'application/javascript',
        testFile: testFile,
        status: response.status,
        recommendations: isValid ? [] : this.getQuickFixCommands(this.detectedServerType)
      };
    } catch (error) {
      return {
        isConfigured: false,
        error: error.message,
        recommendations: ['HTTPサーバーが正しく動作しているか確認してください']
      };
    }
  }

  /**
   * 設定状況の詳細レポート生成
   * @returns {Promise<Object>} 詳細レポート
   */
  async generateDetailedReport() {
    const serverType = await this.detectServerType();
    const configGuide = this.generateConfigurationGuide(serverType);
    const validation = await this.validateServerConfiguration();

    return {
      timestamp: new Date().toISOString(),
      detection: {
        serverType: serverType,
        confidence: this.getDetectionConfidence(serverType),
        detectionMethod: 'automatic'
      },
      currentConfiguration: {
        isValid: validation.isConfigured,
        mimeType: validation.currentMimeType,
        errors: validation.error ? [validation.error] : []
      },
      recommendations: {
        configurationGuide: configGuide,
        quickFixes: this.getQuickFixCommands(serverType),
        additionalNotes: this.getAdditionalNotes(serverType)
      },
      nextSteps: validation.isConfigured ? 
        ['設定は正常です。追加の対応は不要です。'] :
        validation.recommendations
    };
  }

  /**
   * 統計情報の取得
   * @returns {Object} 統計情報
   */
  getStatistics() {
    return {
      detectedServerType: this.detectedServerType,
      hasRecommendations: !!this.configurationRecommendations,
      serverInfo: this.serverInfo,
      lastDetectionAt: this.detectedServerType ? new Date().toISOString() : null
    };
  }
}

// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
    window.ServerConfigurationDetector = ServerConfigurationDetector;
}

console.log('✅ ServerConfigurationDetector loaded');