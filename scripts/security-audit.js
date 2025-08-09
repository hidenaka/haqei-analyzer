/**
 * HaQei Security Audit Suite
 * 
 * 包括的セキュリティ監査ツール
 * OWASP準拠のセキュリティチェックとベストプラクティス検証
 * 
 * @version 1.0.0
 * @date 2025-08-03
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityAuditSuite {
    constructor(options = {}) {
        this.projectRoot = options.projectRoot || process.cwd();
        this.outputDir = options.outputDir || './security-reports';
        
        // セキュリティチェック項目
        this.securityChecks = {
            // ファイルセキュリティ
            filePermissions: true,
            sensitiveFiles: true,
            configFiles: true,
            
            // コードセキュリティ
            xssVulnerabilities: true,
            sqlInjection: true,
            pathTraversal: true,
            insecureStorage: true,
            
            // 依存関係セキュリティ
            dependencyVulnerabilities: true,
            outdatedPackages: true,
            
            // HTTPセキュリティ
            securityHeaders: true,
            httpsEnforcement: true,
            corsConfiguration: true,
            
            // データセキュリティ
            dataValidation: true,
            encryptionUsage: true,
            secretsExposure: true
        };
        
        // 危険なパターン
        this.dangerousPatterns = [
            // XSS脆弱性
            /innerHTML\s*=\s*[^;]+\+/g,
            /document\.write\s*\(/g,
            /eval\s*\(/g,
            /Function\s*\(/g,
            
            // 安全でないAPI使用
            /localStorage\.setItem\s*\([^,]+,\s*[^)]+password/gi,
            /sessionStorage\.setItem\s*\([^,]+,\s*[^)]+token/gi,
            
            // SQL Injection (Node.js向け)
            /query\s*\([^)]*\+[^)]*\)/g,
            /execute\s*\([^)]*\+[^)]*\)/g,
            
            // パストラバーサル
            /\.\.\//g,
            /path\.join\s*\([^)]*req\./g,
            
            // シークレット露出
            /API_KEY\s*=\s*['"`][^'"`]+['"`]/gi,
            /SECRET\s*=\s*['"`][^'"`]+['"`]/gi,
            /PASSWORD\s*=\s*['"`][^'"`]+['"`]/gi
        ];
        
        // 機密ファイルパターン
        this.sensitiveFilePatterns = [
            /\.env$/,
            /\.key$/,
            /\.pem$/,
            /\.p12$/,
            /config\.js$/,
            /secrets\./,
            /private/i,
            /\.backup$/,
            /\.bak$/
        ];
        
        // セキュリティヘッダー要件
        this.requiredHeaders = {
            'Content-Security-Policy': 'CSP設定が必要です',
            'X-Frame-Options': 'クリックジャッキング対策が必要です',
            'X-Content-Type-Options': 'MIME タイプスニッフィング対策が必要です',
            'Strict-Transport-Security': 'HTTPS強制が必要です',
            'Referrer-Policy': 'リファラー情報制御が必要です',
            'Permissions-Policy': 'ブラウザ機能制御が必要です'
        };
    }

    /**
     * 包括的セキュリティ監査実行
     */
    async runSecurityAudit() {
        console.log('🔒 Starting HaQei Security Audit Suite');
        console.log(`Project Root: ${this.projectRoot}`);
        console.log(`Output Directory: ${this.outputDir}`);
        
        // 出力ディレクトリ作成
        await this.ensureOutputDirectory();
        
        const auditResult = {
            timestamp: new Date().toISOString(),
            projectRoot: this.projectRoot,
            summary: {
                totalChecks: 0,
                passedChecks: 0,
                failedChecks: 0,
                warningChecks: 0,
                criticalIssues: 0,
                highIssues: 0,
                mediumIssues: 0,
                lowIssues: 0
            },
            categories: {},
            recommendations: [],
            criticalFindings: []
        };
        
        try {
            // セキュリティカテゴリーごとの監査実行
            console.log('\n📁 File Security Audit...');
            auditResult.categories.fileSecurity = await this.auditFileSecurity();
            
            console.log('\n💻 Code Security Audit...');
            auditResult.categories.codeSecurity = await this.auditCodeSecurity();
            
            console.log('\n📦 Dependency Security Audit...');
            auditResult.categories.dependencySecurity = await this.auditDependencySecurity();
            
            console.log('\n🌐 HTTP Security Audit...');
            auditResult.categories.httpSecurity = await this.auditHttpSecurity();
            
            console.log('\n🔐 Data Security Audit...');
            auditResult.categories.dataSecurity = await this.auditDataSecurity();
            
            // サマリー計算
            this.calculateSummary(auditResult);
            
            // 推奨事項生成
            auditResult.recommendations = this.generateRecommendations(auditResult);
            
            // レポート保存
            await this.saveAuditReport(auditResult);
            
            // コンソール表示
            this.displayAuditSummary(auditResult);
            
            return auditResult;
            
        } catch (error) {
            console.error('❌ Security audit failed:', error.message);
            throw error;
        }
    }

    /**
     * ファイルセキュリティ監査
     */
    async auditFileSecurity() {
        const results = {
            checks: [],
            issues: [],
            status: 'passed'
        };
        
        try {
            // 機密ファイル検出
            const sensitiveFiles = await this.findSensitiveFiles();
            if (sensitiveFiles.length > 0) {
                results.issues.push({
                    severity: 'high',
                    category: 'sensitive-files',
                    message: `機密ファイルが検出されました: ${sensitiveFiles.length}個`,
                    details: sensitiveFiles,
                    recommendation: '機密ファイルをGitignoreに追加し、リポジトリから除外してください'
                });
                results.status = 'failed';
            }
            
            // 設定ファイル検証
            const configIssues = await this.checkConfigFiles();
            if (configIssues.length > 0) {
                results.issues.push(...configIssues);
                results.status = 'failed';
            }
            
            // バックアップファイル検出
            const backupFiles = await this.findBackupFiles();
            if (backupFiles.length > 0) {
                results.issues.push({
                    severity: 'medium',
                    category: 'backup-files',
                    message: `バックアップファイルが検出されました: ${backupFiles.length}個`,
                    details: backupFiles,
                    recommendation: 'バックアップファイルを本番環境から除去してください'
                });
            }
            
            results.checks.push({
                name: 'Sensitive Files Check',
                status: sensitiveFiles.length === 0 ? 'passed' : 'failed',
                details: `検出されたファイル数: ${sensitiveFiles.length}`
            });
            
        } catch (error) {
            results.issues.push({
                severity: 'critical',
                category: 'audit-error',
                message: `ファイルセキュリティ監査エラー: ${error.message}`,
                recommendation: 'システム権限とファイルアクセスを確認してください'
            });
            results.status = 'error';
        }
        
        return results;
    }

    /**
     * コードセキュリティ監査
     */
    async auditCodeSecurity() {
        const results = {
            checks: [],
            issues: [],
            status: 'passed'
        };
        
        try {
            // JavaScriptファイル取得
            const jsFiles = await this.findJavaScriptFiles();
            
            for (const file of jsFiles) {
                const content = await fs.readFile(file, 'utf8');
                const relativePath = path.relative(this.projectRoot, file);
                
                // 危険なパターン検出
                for (const pattern of this.dangerousPatterns) {
                    const matches = content.match(pattern);
                    if (matches) {
                        results.issues.push({
                            severity: this.getSeverityForPattern(pattern),
                            category: 'code-vulnerability',
                            message: `危険なコードパターンが検出されました: ${relativePath}`,
                            details: {
                                file: relativePath,
                                pattern: pattern.toString(),
                                matches: matches.slice(0, 3) // 最初の3件のみ
                            },
                            recommendation: this.getRecommendationForPattern(pattern)
                        });
                        results.status = 'failed';
                    }
                }
                
                // XSS対策チェック
                if (content.includes('innerHTML')) {
                    const sanitizationCheck = this.checkXssSanitization(content);
                    if (!sanitizationCheck.isSafe) {
                        results.issues.push({
                            severity: 'high',
                            category: 'xss-vulnerability',
                            message: `XSS脆弱性の可能性: ${relativePath}`,
                            details: sanitizationCheck.details,
                            recommendation: 'DOMPurifyやtextContentを使用してXSS対策を実装してください'
                        });
                        results.status = 'failed';
                    }
                }
            }
            
            results.checks.push({
                name: 'Code Vulnerability Scan',
                status: results.issues.length === 0 ? 'passed' : 'failed',
                details: `スキャンしたファイル数: ${jsFiles.length}, 検出された問題: ${results.issues.length}`
            });
            
        } catch (error) {
            results.issues.push({
                severity: 'critical',
                category: 'audit-error',
                message: `コードセキュリティ監査エラー: ${error.message}`,
                recommendation: 'ファイルアクセス権限とプロジェクト構造を確認してください'
            });
            results.status = 'error';
        }
        
        return results;
    }

    /**
     * 依存関係セキュリティ監査
     */
    async auditDependencySecurity() {
        const results = {
            checks: [],
            issues: [],
            status: 'passed'
        };
        
        try {
            // package.json 確認
            const packageJsonPath = path.join(this.projectRoot, 'package.json');
            const vuePackageJsonPath = path.join(this.projectRoot, 'haqei-vue', 'package.json');
            
            // メインプロジェクト
            if (await this.fileExists(packageJsonPath)) {
                const vulnerabilities = await this.checkPackageVulnerabilities(packageJsonPath);
                if (vulnerabilities.length > 0) {
                    results.issues.push(...vulnerabilities);
                    results.status = 'failed';
                }
            }
            
            // Vue3プロジェクト
            if (await this.fileExists(vuePackageJsonPath)) {
                const vueVulnerabilities = await this.checkPackageVulnerabilities(vuePackageJsonPath);
                if (vueVulnerabilities.length > 0) {
                    results.issues.push(...vueVulnerabilities);
                    results.status = 'failed';
                }
            }
            
            // CDN依存関係チェック
            const cdnIssues = await this.checkCdnSecurity();
            results.issues.push(...cdnIssues);
            
            results.checks.push({
                name: 'Dependency Vulnerability Check',
                status: results.issues.length === 0 ? 'passed' : 'failed',
                details: `検出されたセキュリティ問題: ${results.issues.length}`
            });
            
        } catch (error) {
            results.issues.push({
                severity: 'medium',
                category: 'audit-error',
                message: `依存関係監査エラー: ${error.message}`,
                recommendation: 'npm audit コマンドを手動で実行してください'
            });
        }
        
        return results;
    }

    /**
     * HTTPセキュリティ監査
     */
    async auditHttpSecurity() {
        const results = {
            checks: [],
            issues: [],
            status: 'passed'
        };
        
        try {
            // セキュリティヘッダー設定チェック
            const headerIssues = await this.checkSecurityHeaders();
            results.issues.push(...headerIssues);
            
            // CORS設定チェック
            const corsIssues = await this.checkCorsConfiguration();
            results.issues.push(...corsIssues);
            
            // HTTPS設定チェック
            const httpsIssues = await this.checkHttpsConfiguration();
            results.issues.push(...httpsIssues);
            
            // CSP設定チェック
            const cspIssues = await this.checkContentSecurityPolicy();
            results.issues.push(...cspIssues);
            
            if (results.issues.length > 0) {
                results.status = 'failed';
            }
            
            results.checks.push({
                name: 'HTTP Security Headers Check',
                status: results.status,
                details: `検出されたHTTPセキュリティ問題: ${results.issues.length}`
            });
            
        } catch (error) {
            results.issues.push({
                severity: 'medium',
                category: 'audit-error',
                message: `HTTPセキュリティ監査エラー: ${error.message}`,
                recommendation: 'サーバー設定とセキュリティヘッダーを手動で確認してください'
            });
        }
        
        return results;
    }

    /**
     * データセキュリティ監査
     */
    async auditDataSecurity() {
        const results = {
            checks: [],
            issues: [],
            status: 'passed'
        };
        
        try {
            // localStorage/sessionStorage使用チェック
            const storageIssues = await this.checkStorageSecurity();
            results.issues.push(...storageIssues);
            
            // データ検証チェック
            const validationIssues = await this.checkDataValidation();
            results.issues.push(...validationIssues);
            
            // 暗号化使用チェック
            const encryptionIssues = await this.checkEncryptionUsage();
            results.issues.push(...encryptionIssues);
            
            // API キー露出チェック
            const apiKeyIssues = await this.checkApiKeySecurity();
            results.issues.push(...apiKeyIssues);
            
            if (results.issues.length > 0) {
                results.status = 'failed';
            }
            
            results.checks.push({
                name: 'Data Security Check',
                status: results.status,
                details: `検出されたデータセキュリティ問題: ${results.issues.length}`
            });
            
        } catch (error) {
            results.issues.push({
                severity: 'medium',
                category: 'audit-error',
                message: `データセキュリティ監査エラー: ${error.message}`,
                recommendation: 'データ処理とストレージの実装を手動で確認してください'
            });
        }
        
        return results;
    }

    /**
     * 機密ファイル検出
     */
    async findSensitiveFiles() {
        const sensitiveFiles = [];
        
        const scanDirectory = async (dir) => {
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        // 特定のディレクトリをスキップ
                        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                            await scanDirectory(fullPath);
                        }
                    } else {
                        // 機密ファイルパターンチェック
                        for (const pattern of this.sensitiveFilePatterns) {
                            if (pattern.test(entry.name)) {
                                sensitiveFiles.push({
                                    path: path.relative(this.projectRoot, fullPath),
                                    pattern: pattern.toString(),
                                    size: (await fs.stat(fullPath)).size
                                });
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                // アクセス権限エラー等はスキップ
            }
        };
        
        await scanDirectory(this.projectRoot);
        return sensitiveFiles;
    }

    /**
     * 設定ファイル検証
     */
    async checkConfigFiles() {
        const issues = [];
        
        // staging.config.js チェック
        const stagingConfigPath = path.join(this.projectRoot, 'staging.config.js');
        if (await this.fileExists(stagingConfigPath)) {
            const content = await fs.readFile(stagingConfigPath, 'utf8');
            
            // ハードコードされたシークレット検出
            if (content.includes('staging-anon-key') || content.includes('staging-service-key')) {
                issues.push({
                    severity: 'high',
                    category: 'hardcoded-secrets',
                    message: 'staging.config.js にハードコードされたAPIキーが含まれています',
                    details: { file: 'staging.config.js' },
                    recommendation: '本番環境では環境変数を使用し、ハードコードされた値を削除してください'
                });
            }
        }
        
        return issues;
    }

    /**
     * バックアップファイル検出
     */
    async findBackupFiles() {
        const backupFiles = [];
        const backupPatterns = [/\.bak$/, /\.backup$/, /\.old$/, /~$/];
        
        const scanDirectory = async (dir) => {
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        if (!['node_modules', '.git'].includes(entry.name)) {
                            await scanDirectory(fullPath);
                        }
                    } else {
                        for (const pattern of backupPatterns) {
                            if (pattern.test(entry.name)) {
                                backupFiles.push(path.relative(this.projectRoot, fullPath));
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                // アクセス権限エラー等はスキップ
            }
        };
        
        await scanDirectory(this.projectRoot);
        return backupFiles;
    }

    /**
     * JavaScriptファイル検出
     */
    async findJavaScriptFiles() {
        const jsFiles = [];
        
        const scanDirectory = async (dir) => {
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
                            await scanDirectory(fullPath);
                        }
                    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
                        jsFiles.push(fullPath);
                    }
                }
            } catch (error) {
                // アクセス権限エラー等はスキップ
            }
        };
        
        await scanDirectory(this.projectRoot);
        return jsFiles;
    }

    /**
     * パターンの重要度判定
     */
    getSeverityForPattern(pattern) {
        const patternStr = pattern.toString();
        
        if (patternStr.includes('eval') || patternStr.includes('Function')) {
            return 'critical';
        } else if (patternStr.includes('innerHTML') || patternStr.includes('password')) {
            return 'high';
        } else if (patternStr.includes('API_KEY') || patternStr.includes('SECRET')) {
            return 'critical';
        } else {
            return 'medium';
        }
    }

    /**
     * パターン別推奨事項
     */
    getRecommendationForPattern(pattern) {
        const patternStr = pattern.toString();
        
        if (patternStr.includes('innerHTML')) {
            return 'textContentまたはDOMPurifyを使用してXSS対策を実装してください';
        } else if (patternStr.includes('eval')) {
            return 'eval()の使用を避け、JSON.parse()やsafer-evalライブラリを検討してください';
        } else if (patternStr.includes('API_KEY')) {
            return 'API キーを環境変数に移動し、コードから削除してください';
        } else if (patternStr.includes('localStorage')) {
            return '機密情報をlocalStorageに保存せず、HTTPOnlyクッキーまたは暗号化を検討してください';
        } else {
            return 'セキュアなコーディングプラクティスを適用してください';
        }
    }

    /**
     * XSSサニタイゼーションチェック
     */
    checkXssSanitization(content) {
        const hasInnerHTML = content.includes('innerHTML');
        const hasSanitization = content.includes('DOMPurify') || 
                               content.includes('sanitize') ||
                               content.includes('textContent');
        
        return {
            isSafe: !hasInnerHTML || hasSanitization,
            details: {
                hasInnerHTML,
                hasSanitization,
                recommendation: 'DOMPurifyライブラリまたはtextContentを使用してください'
            }
        };
    }

    /**
     * パッケージ脆弱性チェック
     */
    async checkPackageVulnerabilities(packageJsonPath) {
        const issues = [];
        
        try {
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
            
            // 既知の脆弱なパッケージチェック（簡易版）
            const vulnerablePackages = {
                'lodash': '4.17.20', // 例：このバージョン以下は脆弱
                'moment': '2.29.1'
            };
            
            for (const [pkg, version] of Object.entries(dependencies)) {
                if (vulnerablePackages[pkg] && this.isOlderVersion(version, vulnerablePackages[pkg])) {
                    issues.push({
                        severity: 'high',
                        category: 'vulnerable-dependency',
                        message: `脆弱な依存関係が検出されました: ${pkg}@${version}`,
                        details: {
                            package: pkg,
                            currentVersion: version,
                            minimumSafeVersion: vulnerablePackages[pkg]
                        },
                        recommendation: `${pkg} を ${vulnerablePackages[pkg]} 以上にアップデートしてください`
                    });
                }
            }
            
        } catch (error) {
            issues.push({
                severity: 'medium',
                category: 'audit-error',
                message: `package.json の解析に失敗: ${error.message}`,
                recommendation: 'package.json の構文を確認してください'
            });
        }
        
        return issues;
    }

    /**
     * CDNセキュリティチェック
     */
    async checkCdnSecurity() {
        const issues = [];
        
        // HTMLファイルでのCDN使用チェック
        const htmlFiles = await this.findHtmlFiles();
        
        for (const file of htmlFiles) {
            const content = await fs.readFile(file, 'utf8');
            const relativePath = path.relative(this.projectRoot, file);
            
            // HTTP CDN使用チェック
            const httpCdnMatches = content.match(/src=["']http:\/\/[^"']*["']/g);
            if (httpCdnMatches) {
                issues.push({
                    severity: 'high',
                    category: 'insecure-cdn',
                    message: `安全でないHTTP CDNが検出されました: ${relativePath}`,
                    details: { file: relativePath, matches: httpCdnMatches },
                    recommendation: 'すべてのCDNリンクをHTTPSに変更してください'
                });
            }
            
            // SRI (Subresource Integrity) チェック
            const scriptTags = content.match(/<script[^>]*src=["'][^"']*["'][^>]*>/g);
            if (scriptTags) {
                for (const script of scriptTags) {
                    if (script.includes('cdn') && !script.includes('integrity=')) {
                        issues.push({
                            severity: 'medium',
                            category: 'missing-sri',
                            message: `SRI (Subresource Integrity) が設定されていません: ${relativePath}`,
                            details: { file: relativePath, script },    
                            recommendation: 'CDNスクリプトにintegrity属性を追加してください'
                        });
                    }
                }
            }
        }
        
        return issues;
    }

    /**
     * セキュリティヘッダーチェック
     */
    async checkSecurityHeaders() {
        const issues = [];
        
        // staging.config.js のヘッダー設定チェック
        const stagingConfigPath = path.join(this.projectRoot, 'staging.config.js');
        if (await this.fileExists(stagingConfigPath)) {
            const content = await fs.readFile(stagingConfigPath, 'utf8');
            
            for (const [header, description] of Object.entries(this.requiredHeaders)) {
                if (!content.includes(header)) {
                    issues.push({
                        severity: 'medium',
                        category: 'missing-security-header',
                        message: `セキュリティヘッダーが設定されていません: ${header}`,
                        details: { header, description },
                        recommendation: `staging.config.js に ${header} ヘッダーを追加してください`
                    });
                }
            }
        } else {
            issues.push({
                severity: 'high',
                category: 'missing-config',
                message: 'セキュリティ設定ファイルが見つかりません',
                recommendation: 'staging.config.js でセキュリティヘッダーを設定してください'
            });
        }
        
        return issues;
    }

    /**
     * CORS設定チェック
     */
    async checkCorsConfiguration() {
        const issues = [];
        
        const stagingConfigPath = path.join(this.projectRoot, 'staging.config.js');
        if (await this.fileExists(stagingConfigPath)) {
            const content = await fs.readFile(stagingConfigPath, 'utf8');
            
            // ワイルドカード CORS チェック
            if (content.includes("'*'") && content.includes('corsOrigins')) {
                issues.push({
                    severity: 'high',
                    category: 'insecure-cors',
                    message: 'CORSでワイルドカード(*)が使用されています',
                    recommendation: '具体的なドメインを指定してCORSを制限してください'
                });
            }
            
            // localhost CORS の本番環境チェック
            if (content.includes('localhost') && content.includes('corsOrigins')) {
                issues.push({
                    severity: 'medium',
                    category: 'development-cors',
                    message: '本番環境設定にlocalhost CORSが含まれています',
                    recommendation: '本番環境ではlocalhost CORSを削除してください'
                });
            }
        }
        
        return issues;
    }

    /**
     * HTTPS設定チェック
     */
    async checkHttpsConfiguration() {
        const issues = [];
        
        // HTML ファイルでの HTTP リンクチェック
        const htmlFiles = await this.findHtmlFiles();
        
        for (const file of htmlFiles) {
            const content = await fs.readFile(file, 'utf8');
            const relativePath = path.relative(this.projectRoot, file);
            
            // HTTP リンクチェック
            const httpLinks = content.match(/href=["']http:\/\/[^"']*["']/g);
            if (httpLinks) {
                issues.push({
                    severity: 'medium',
                    category: 'insecure-links',
                    message: `安全でないHTTPリンクが検出されました: ${relativePath}`,
                    details: { file: relativePath, links: httpLinks },
                    recommendation: 'すべてのリンクをHTTPSに変更してください'
                });
            }
        }
        
        return issues;
    }

    /**
     * Content Security Policy チェック
     */
    async checkContentSecurityPolicy() {
        const issues = [];
        
        const stagingConfigPath = path.join(this.projectRoot, 'staging.config.js');
        if (await this.fileExists(stagingConfigPath)) {
            const content = await fs.readFile(stagingConfigPath, 'utf8');
            
            // unsafe-inline チェック
            if (content.includes("'unsafe-inline'")) {
                issues.push({
                    severity: 'medium',
                    category: 'weak-csp',
                    message: "CSPで'unsafe-inline'が使用されています",
                    recommendation: "可能な限り'unsafe-inline'を避け、nonceまたはhashベースのCSPを使用してください"
                });
            }
            
            // unsafe-eval チェック
            if (content.includes("'unsafe-eval'")) {
                issues.push({
                    severity: 'high',
                    category: 'dangerous-csp',
                    message: "CSPで'unsafe-eval'が使用されています",
                    recommendation: "'unsafe-eval'を削除し、eval()の使用を避けてください"
                });
            }
        }
        
        return issues;
    }

    /**
     * ストレージセキュリティチェック
     */
    async checkStorageSecurity() {
        const issues = [];
        
        const jsFiles = await this.findJavaScriptFiles();
        
        for (const file of jsFiles) {
            const content = await fs.readFile(file, 'utf8');
            const relativePath = path.relative(this.projectRoot, file);
            
            // 機密情報のlocalStorage使用チェック
            const sensitiveStoragePatterns = [
                /localStorage\.setItem\s*\([^,]*(?:password|token|key|secret)/gi,
                /sessionStorage\.setItem\s*\([^,]*(?:password|token|key|secret)/gi
            ];
            
            for (const pattern of sensitiveStoragePatterns) {
                const matches = content.match(pattern);
                if (matches) {
                    issues.push({
                        severity: 'high',
                        category: 'insecure-storage',
                        message: `機密情報がWebStorageに保存されています: ${relativePath}`,
                        details: { file: relativePath, matches: matches.slice(0, 3) },
                        recommendation: '機密情報はHTTPOnlyクッキーまたは暗号化して保存してください'
                    });
                }
            }
        }
        
        return issues;
    }

    /**
     * データ検証チェック
     */
    async checkDataValidation() {
        const issues = [];
        
        const jsFiles = await this.findJavaScriptFiles();
        
        for (const file of jsFiles) {
            const content = await fs.readFile(file, 'utf8');
            const relativePath = path.relative(this.projectRoot, file);
            
            // 入力検証不足チェック
            if (content.includes('innerHTML') && !content.includes('sanitize') && !content.includes('DOMPurify')) {
                issues.push({
                    severity: 'high',
                    category: 'insufficient-validation',
                    message: `入力検証が不十分です: ${relativePath}`,
                    details: { file: relativePath },
                    recommendation: 'すべてのユーザー入力を適切にサニタイズしてください'
                });
            }
        }
        
        return issues;
    }

    /**
     * 暗号化使用チェック
     */
    async checkEncryptionUsage() {
        const issues = [];
        
        // 暗号化の適切な使用をチェック
        // これは簡易実装です
        
        return issues;
    }

    /**
     * API キーセキュリティチェック
     */
    async checkApiKeySecurity() {
        const issues = [];
        
        const jsFiles = await this.findJavaScriptFiles();
        
        for (const file of jsFiles) {
            const content = await fs.readFile(file, 'utf8');
            const relativePath = path.relative(this.projectRoot, file);
            
            // ハードコードされたAPI キー検出
            const apiKeyPatterns = [
                /const\s+\w*api\w*key\w*\s*=\s*['"`][A-Za-z0-9-_]{20,}['"`]/gi,
                /GEMINI_API_KEY\s*[:=]\s*['"`][A-Za-z0-9-_]{20,}['"`]/gi
            ];
            
            for (const pattern of apiKeyPatterns) {
                const matches = content.match(pattern);
                if (matches) {
                    issues.push({
                        severity: 'critical',
                        category: 'exposed-api-key',
                        message: `ハードコードされたAPI キーが検出されました: ${relativePath}`,
                        details: { file: relativePath },
                        recommendation: 'API キーを環境変数に移動し、コードから削除してください'
                    });
                }
            }
        }
        
        return issues;
    }

    /**
     * HTMLファイル検出
     */
    async findHtmlFiles() {
        const htmlFiles = [];
        
        const scanDirectory = async (dir) => {
            try {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    
                    if (entry.isDirectory()) {
                        if (!['node_modules', '.git'].includes(entry.name)) {
                            await scanDirectory(fullPath);
                        }
                    } else if (entry.name.endsWith('.html')) {
                        htmlFiles.push(fullPath);
                    }
                }
            } catch (error) {
                // アクセス権限エラー等はスキップ
            }
        };
        
        await scanDirectory(this.projectRoot);
        return htmlFiles;
    }

    /**
     * ファイル存在チェック
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
     * バージョン比較
     */
    isOlderVersion(current, minimum) {
        // 簡易バージョン比較
        const currentParts = current.replace(/[^0-9.]/g, '').split('.');
        const minimumParts = minimum.split('.');
        
        for (let i = 0; i < Math.max(currentParts.length, minimumParts.length); i++) {
            const currentPart = parseInt(currentParts[i] || '0');
            const minimumPart = parseInt(minimumParts[i] || '0');
            
            if (currentPart < minimumPart) return true;
            if (currentPart > minimumPart) return false;
        }
        
        return false;
    }

    /**
     * サマリー計算
     */
    calculateSummary(auditResult) {
        for (const category of Object.values(auditResult.categories)) {
            auditResult.summary.totalChecks += category.checks.length;
            
            for (const check of category.checks) {
                if (check.status === 'passed') {
                    auditResult.summary.passedChecks++;
                } else {
                    auditResult.summary.failedChecks++;
                }
            }
            
            for (const issue of category.issues) {
                switch (issue.severity) {
                    case 'critical':
                        auditResult.summary.criticalIssues++;
                        break;
                    case 'high':
                        auditResult.summary.highIssues++;
                        break;
                    case 'medium':
                        auditResult.summary.mediumIssues++;
                        break;
                    default:
                        auditResult.summary.lowIssues++;
                }
                
                if (issue.severity === 'critical' || issue.severity === 'high') {
                    auditResult.criticalFindings.push(issue);
                }
            }
        }
    }

    /**
     * 推奨事項生成
     */
    generateRecommendations(auditResult) {
        const recommendations = [];
        
        if (auditResult.summary.criticalIssues > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'immediate-action',
                title: '緊急対応が必要なセキュリティ問題',
                description: `${auditResult.summary.criticalIssues}個のクリティカルな問題が検出され ました。即座に対応が必要です。`,
                actions: [
                    'クリティカルな問題を最優先で修正する',
                    'セキュリティパッチを適用する',
                    '本番環境への影響を評価する'
                ]
            });
        }
        
        if (auditResult.summary.highIssues > 0) {
            recommendations.push({
                priority: 'high',
                category: 'security-hardening',
                title: 'セキュリティ強化の実施',
                description: `${auditResult.summary.highIssues}個の高リスク問題が検出されました。`,
                actions: [
                    'セキュリティヘッダーの適切な設定',
                    'XSS対策の強化',
                    '機密情報の適切な管理'
                ]
            });
        }
        
        // 一般的な推奨事項
        recommendations.push({
            priority: 'medium',
            category: 'best-practices',
            title: 'セキュリティベストプラクティスの実装',
            description: '継続的なセキュリティ向上のための推奨事項',
            actions: [
                '定期的なセキュリティ監査の実施',
                '依存関係の定期的な更新',
                'セキュリティトレーニングの実施',
                'インシデント対応計画の策定'
            ]
        });
        
        return recommendations;
    }

    /**
     * 出力ディレクトリ確保
     */
    async ensureOutputDirectory() {
        try {
            await fs.access(this.outputDir);
        } catch (error) {
            await fs.mkdir(this.outputDir, { recursive: true });
        }
    }

    /**
     * 監査レポート保存
     */
    async saveAuditReport(auditResult) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // JSON レポート
        const jsonFilename = `security-audit-${timestamp}.json`;
        const jsonFilepath = path.join(this.outputDir, jsonFilename);
        await fs.writeFile(jsonFilepath, JSON.stringify(auditResult, null, 2));
        console.log(`📄 JSON report saved: ${jsonFilepath}`);
        
        // HTML レポート
        const htmlReport = this.generateHtmlReport(auditResult);
        const htmlFilename = `security-audit-${timestamp}.html`;
        const htmlFilepath = path.join(this.outputDir, htmlFilename);
        await fs.writeFile(htmlFilepath, htmlReport);
        console.log(`🌐 HTML report saved: ${htmlFilepath}`);
    }

    /**
     * HTML レポート生成
     */
    generateHtmlReport(auditResult) {
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HaQei Security Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 1rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .metric { background: #f9f9f9; padding: 1rem; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 1.5rem; font-weight: bold; }
        .metric-label { color: #666; font-size: 0.875rem; margin-top: 0.5rem; }
        .critical { color: #dc3545; }
        .high { color: #fd7e14; }
        .medium { color: #ffc107; }
        .low { color: #198754; }
        .passed { color: #198754; }
        .failed { color: #dc3545; }
        .category { margin: 2rem 0; padding: 1rem; border: 1px solid #dee2e6; border-radius: 6px; }
        .category h3 { margin-top: 0; color: #495057; }
        .issue { margin: 1rem 0; padding: 1rem; border-left: 4px solid; border-radius: 4px; }
        .issue.critical { border-color: #dc3545; background: #f8d7da; }
        .issue.high { border-color: #fd7e14; background: #fff3cd; }
        .issue.medium { border-color: #ffc107; background: #fff3cd; }
        .issue.low { border-color: #198754; background: #d1edee; }
        .recommendations { background: #e7f3ff; border: 1px solid #b6d7ff; padding: 1rem; border-radius: 6px; margin: 2rem 0; }
        .rec-item { margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 4px; }
        pre { background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
        .badge.critical { background: #dc3545; color: white; }
        .badge.high { background: #fd7e14; color: white; }
        .badge.medium { background: #ffc107; color: black; }
        .badge.low { background: #198754; color: white; }
        .details { margin-top: 0.5rem; font-size: 0.875rem; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 HaQei Security Audit Report</h1>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value ${auditResult.summary.criticalIssues > 0 ? 'critical' : 'passed'}">${auditResult.summary.criticalIssues}</div>
                <div class="metric-label">Critical Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value ${auditResult.summary.highIssues > 0 ? 'high' : 'passed'}">${auditResult.summary.highIssues}</div>
                <div class="metric-label">High Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value medium">${auditResult.summary.mediumIssues}</div>
                <div class="metric-label">Medium Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value passed">${auditResult.summary.passedChecks}</div>
                <div class="metric-label">Passed Checks</div>
            </div>
        </div>
        
        ${auditResult.criticalFindings.length > 0 ? `
        <div class="category">
            <h3>🚨 Critical Findings - Immediate Action Required</h3>
            ${auditResult.criticalFindings.map(issue => `
                <div class="issue ${issue.severity}">
                    <span class="badge ${issue.severity}">${issue.severity}</span>
                    <strong>${issue.message}</strong>
                    <div class="details">
                        <strong>Category:</strong> ${issue.category}<br>
                        <strong>Recommendation:</strong> ${issue.recommendation}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${Object.entries(auditResult.categories).map(([categoryName, category]) => `
        <div class="category">
            <h3>${this.getCategoryIcon(categoryName)} ${this.getCategoryTitle(categoryName)}</h3>
            <p><strong>Status:</strong> <span class="${category.status}">${category.status.toUpperCase()}</span></p>
            <p><strong>Checks:</strong> ${category.checks.length}, <strong>Issues:</strong> ${category.issues.length}</p>
            
            ${category.issues.map(issue => `
                <div class="issue ${issue.severity}">
                    <span class="badge ${issue.severity}">${issue.severity}</span>
                    <strong>${issue.message}</strong>
                    <div class="details">
                        <strong>Recommendation:</strong> ${issue.recommendation}
                    </div>
                </div>
            `).join('')}
        </div>
        `).join('')}
        
        ${auditResult.recommendations.length > 0 ? `
        <div class="recommendations">
            <h3>💡 Security Recommendations</h3>
            ${auditResult.recommendations.map(rec => `
                <div class="rec-item">
                    <strong>[${rec.priority.toUpperCase()}] ${rec.title}</strong><br>
                    <p>${rec.description}</p>
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #dee2e6; color: #666; font-size: 0.875rem;">
            <p><strong>Generated:</strong> ${auditResult.timestamp}</p>
            <p><strong>Project:</strong> ${auditResult.projectRoot}</p>
        </div>
    </div>
</body>
</html>
        `.trim();
    }

    /**
     * カテゴリーアイコン取得
     */
    getCategoryIcon(categoryName) {
        const icons = {
            fileSecurity: '📁',
            codeSecurity: '💻',
            dependencySecurity: '📦',
            httpSecurity: '🌐',
            dataSecurity: '🔐'
        };
        return icons[categoryName] || '🔍';
    }

    /**
     * カテゴリータイトル取得
     */
    getCategoryTitle(categoryName) {
        const titles = {
            fileSecurity: 'File Security',
            codeSecurity: 'Code Security',
            dependencySecurity: 'Dependency Security',
            httpSecurity: 'HTTP Security',
            dataSecurity: 'Data Security'
        };
        return titles[categoryName] || categoryName;
    }

    /**
     * コンソール サマリー表示
     */
    displayAuditSummary(auditResult) {
        console.log('\n' + '='.repeat(60));
        console.log('🔒 SECURITY AUDIT SUMMARY');
        console.log('='.repeat(60));
        
        console.log(`\n📊 Overall Results:`);
        console.log(`   Total Checks: ${auditResult.summary.totalChecks}`);
        console.log(`   Passed: ${auditResult.summary.passedChecks} ✅`);
        console.log(`   Failed: ${auditResult.summary.failedChecks} ❌`);
        
        console.log(`\n🚨 Security Issues:`);
        console.log(`   Critical: ${auditResult.summary.criticalIssues} (immediate action required)`);
        console.log(`   High: ${auditResult.summary.highIssues} (urgent attention needed)`);
        console.log(`   Medium: ${auditResult.summary.mediumIssues} (should be addressed)`);
        console.log(`   Low: ${auditResult.summary.lowIssues} (good to fix)`);
        
        if (auditResult.criticalFindings.length > 0) {
            console.log(`\n🚨 CRITICAL FINDINGS:`);
            auditResult.criticalFindings.slice(0, 3).forEach((finding, index) => {
                console.log(`   ${index + 1}. ${finding.message}`);
                console.log(`      → ${finding.recommendation}`);
            });
        }
        
        if (auditResult.recommendations.length > 0) {
            console.log(`\n💡 Top Recommendations:`);
            auditResult.recommendations.slice(0, 3).forEach((rec, index) => {
                console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
            });
        }
        
        // セキュリティスコア計算
        const totalIssues = auditResult.summary.criticalIssues + auditResult.summary.highIssues + 
                           auditResult.summary.mediumIssues + auditResult.summary.lowIssues;
        const securityScore = Math.max(0, 100 - (auditResult.summary.criticalIssues * 30) - 
                                             (auditResult.summary.highIssues * 15) - 
                                             (auditResult.summary.mediumIssues * 5) - 
                                             (auditResult.summary.lowIssues * 1));
        
        console.log(`\n🎯 Security Score: ${securityScore}/100`);
        
        if (securityScore >= 90) {
            console.log('   Status: EXCELLENT 🟢 - Very secure application');
        } else if (securityScore >= 75) {
            console.log('   Status: GOOD 🟡 - Minor security improvements needed');
        } else if (securityScore >= 50) {
            console.log('   Status: FAIR 🟠 - Several security issues need attention');
        } else {
            console.log('   Status: POOR 🔴 - Immediate security improvements required');
        }
        
        console.log('\n' + '='.repeat(60));
    }
}

// CLI実行時
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    const projectRoot = args[0] || process.cwd();
    
    const auditSuite = new SecurityAuditSuite({ projectRoot });
    
    auditSuite.runSecurityAudit()
        .then(auditResult => {
            const exitCode = auditResult.summary.criticalIssues > 0 ? 2 :
                             auditResult.summary.highIssues > 0 ? 1 : 0;
            process.exit(exitCode);
        })
        .catch(error => {
            console.error('❌ Security audit failed:', error);
            process.exit(3);
        });
}

export default SecurityAuditSuite;