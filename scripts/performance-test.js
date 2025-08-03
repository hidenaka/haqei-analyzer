/**
 * HaQei Performance Test Suite
 * 
 * ウェブパフォーマンスの包括的テストスイート
 * Lighthouse、Core Web Vitals、カスタムメトリクスを測定
 * 
 * @version 1.0.0
 * @date 2025-08-03
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs').promises;
const path = require('path');

class PerformanceTestSuite {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:3000';
        this.outputDir = options.outputDir || './performance-reports';
        this.thresholds = {
            // Core Web Vitals 閾値
            LCP: 2500,  // Largest Contentful Paint (ms)
            FID: 100,   // First Input Delay (ms)
            CLS: 0.1,   // Cumulative Layout Shift
            
            // その他パフォーマンス指標
            FCP: 1800,  // First Contentful Paint (ms)
            TTI: 3800,  // Time to Interactive (ms)
            TBT: 200,   // Total Blocking Time (ms)
            SI: 3400,   // Speed Index (ms)
            
            // Lighthouse スコア
            performance: 90,
            accessibility: 95,
            bestPractices: 90,
            seo: 95
        };
        
        this.testPages = [
            { name: 'home', url: '' },
            { name: 'quick-analyzer', url: '/quick_analyzer.html' },
            { name: 'os-analyzer', url: '/os_analyzer.html' },
            { name: 'results', url: '/results.html' },
            { name: 'cockpit', url: '/cockpit.html' },
            { name: 'bunenjin-philosophy', url: '/bunenjin-philosophy.html' },
            { name: 'strategic-dashboard', url: '/strategic-dashboard.html' }
        ];
    }

    /**
     * 全体のパフォーマンステスト実行
     */
    async runAllTests() {
        console.log('🚀 Starting HaQei Performance Test Suite');
        console.log(`Base URL: ${this.baseUrl}`);
        console.log(`Output Directory: ${this.outputDir}`);
        
        // 出力ディレクトリ作成
        await this.ensureOutputDirectory();
        
        const results = {
            timestamp: new Date().toISOString(),
            baseUrl: this.baseUrl,
            thresholds: this.thresholds,
            pages: []
        };
        
        // 各ページのテスト実行
        for (const page of this.testPages) {
            console.log(`\n📊 Testing page: ${page.name}`);
            
            try {
                const pageResult = await this.testPage(page);
                results.pages.push(pageResult);
                
                // 個別レポート保存
                await this.savePageReport(page.name, pageResult);
                
            } catch (error) {
                console.error(`❌ Error testing ${page.name}:`, error.message);
                results.pages.push({
                    name: page.name,
                    url: page.url,
                    error: error.message,
                    status: 'failed'
                });
            }
        }
        
        // 総合レポート生成
        const summary = this.generateSummary(results);
        await this.saveSummaryReport(summary);
        
        // コンソール出力
        this.displaySummary(summary);
        
        return summary;
    }

    /**
     * 個別ページのパフォーマンステスト
     */
    async testPage(page) {
        const url = `${this.baseUrl}${page.url}`;
        
        // Lighthouse テスト実行
        const lighthouseResult = await this.runLighthouse(url);
        
        // カスタムメトリクス測定
        const customMetrics = await this.measureCustomMetrics(url);
        
        // 結果統合
        const result = {
            name: page.name,
            url: page.url,
            fullUrl: url,
            timestamp: new Date().toISOString(),
            lighthouse: lighthouseResult,
            customMetrics: customMetrics,
            status: 'completed'
        };
        
        // 閾値チェック
        result.thresholdCheck = this.checkThresholds(result);
        
        return result;
    }

    /**
     * Lighthouse 実行
     */
    async runLighthouse(url) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
        
        try {
            const { lhr } = await lighthouse(url, {
                port: new URL(browser.wsEndpoint()).port,
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
                settings: {
                    formFactor: 'desktop',
                    throttling: {
                        rttMs: 40,
                        throughputKbps: 10240,
                        cpuSlowdownMultiplier: 1,
                        requestLatencyMs: 0,
                        downloadThroughputKbps: 0,
                        uploadThroughputKbps: 0
                    },
                    screenEmulation: {
                        mobile: false,
                        width: 1350,
                        height: 940,
                        deviceScaleFactor: 1,
                        disabled: false
                    }
                }
            });
            
            const metrics = lhr.audits;
            
            return {
                scores: {
                    performance: Math.round(lhr.categories.performance.score * 100),
                    accessibility: Math.round(lhr.categories.accessibility.score * 100),
                    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
                    seo: Math.round(lhr.categories.seo.score * 100)
                },
                metrics: {
                    FCP: metrics['first-contentful-paint']?.numericValue || 0,
                    LCP: metrics['largest-contentful-paint']?.numericValue || 0,
                    TTI: metrics['interactive']?.numericValue || 0,
                    TBT: metrics['total-blocking-time']?.numericValue || 0,
                    CLS: metrics['cumulative-layout-shift']?.numericValue || 0,
                    SI: metrics['speed-index']?.numericValue || 0
                },
                opportunities: this.extractOpportunities(lhr.audits)
            };
            
        } finally {
            await browser.close();
        }
    }

    /**
     * カスタムメトリクス測定
     */
    async measureCustomMetrics(url) {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
        
        try {
            const page = await browser.newPage();
            
            // パフォーマンス監視開始
            await page.setCacheEnabled(false);
            
            const startTime = Date.now();
            
            // ページ読み込み
            const response = await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            const loadTime = Date.now() - startTime;
            
            // JavaScript 実行時間測定
            const jsExecutionTime = await page.evaluate(() => {
                const perfEntries = performance.getEntriesByType('navigation');
                if (perfEntries.length > 0) {
                    const entry = perfEntries[0];
                    return entry.loadEventEnd - entry.responseEnd;
                }
                return 0;
            });
            
            // DOM 要素数
            const domElements = await page.evaluate(() => {
                return document.querySelectorAll('*').length;
            });
            
            // 画像最適化チェック
            const imageMetrics = await page.evaluate(() => {
                const images = Array.from(document.querySelectorAll('img'));
                return {
                    total: images.length,
                    withAlt: images.filter(img => img.alt).length,
                    lazyLoaded: images.filter(img => img.loading === 'lazy').length
                };
            });
            
            // リソースサイズ
            const resourceMetrics = await page.evaluate(() => {
                const entries = performance.getEntriesByType('resource');
                let totalSize = 0;
                let jsSize = 0;
                let cssSize = 0;
                let imageSize = 0;
                
                entries.forEach(entry => {
                    if (entry.transferSize) {
                        totalSize += entry.transferSize;
                        
                        if (entry.name.includes('.js')) {
                            jsSize += entry.transferSize;
                        } else if (entry.name.includes('.css')) {
                            cssSize += entry.transferSize;
                        } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                            imageSize += entry.transferSize;
                        }
                    }
                });
                
                return {
                    total: totalSize,
                    javascript: jsSize,
                    css: cssSize,
                    images: imageSize
                };
            });
            
            return {
                loadTime,
                jsExecutionTime,
                domElements,
                imageMetrics,
                resourceMetrics,
                statusCode: response.status(),
                contentType: response.headers()['content-type'] || 'unknown'
            };
            
        } finally {
            await browser.close();
        }
    }

    /**
     * Lighthouse から改善提案を抽出
     */
    extractOpportunities(audits) {
        const opportunities = [];
        
        const importantAudits = [
            'unused-css-rules',
            'unused-javascript',
            'render-blocking-resources',
            'unminified-css',
            'unminified-javascript',
            'inefficient-animated-content',
            'legacy-javascript',
            'offscreen-images',
            'uses-webp-images',
            'uses-optimized-images'
        ];
        
        importantAudits.forEach(auditId => {
            const audit = audits[auditId];
            if (audit && audit.score !== null && audit.score < 1) {
                opportunities.push({
                    id: auditId,
                    title: audit.title,
                    description: audit.description,
                    score: Math.round(audit.score * 100),
                    savings: audit.details?.overallSavingsMs || 0
                });
            }
        });
        
        return opportunities.sort((a, b) => b.savings - a.savings);
    }

    /**
     * 閾値チェック
     */
    checkThresholds(result) {
        const checks = {};
        const metrics = result.lighthouse.metrics;
        const scores = result.lighthouse.scores;
        
        // Core Web Vitals
        checks.LCP = {
            value: metrics.LCP,
            threshold: this.thresholds.LCP,
            passed: metrics.LCP <= this.thresholds.LCP,
            rating: this.getCWVRating('LCP', metrics.LCP)
        };
        
        checks.CLS = {
            value: metrics.CLS,
            threshold: this.thresholds.CLS,
            passed: metrics.CLS <= this.thresholds.CLS,
            rating: this.getCWVRating('CLS', metrics.CLS)
        };
        
        // パフォーマンス指標
        checks.FCP = {
            value: metrics.FCP,
            threshold: this.thresholds.FCP,
            passed: metrics.FCP <= this.thresholds.FCP
        };
        
        checks.TTI = {
            value: metrics.TTI,
            threshold: this.thresholds.TTI,
            passed: metrics.TTI <= this.thresholds.TTI
        };
        
        // Lighthouse スコア
        checks.performanceScore = {
            value: scores.performance,
            threshold: this.thresholds.performance,
            passed: scores.performance >= this.thresholds.performance
        };
        
        checks.accessibilityScore = {
            value: scores.accessibility,
            threshold: this.thresholds.accessibility,
            passed: scores.accessibility >= this.thresholds.accessibility
        };
        
        // 全体の合格判定
        checks.overall = {
            passed: Object.values(checks).every(check => check.passed),
            passedCount: Object.values(checks).filter(check => check.passed).length,
            totalCount: Object.keys(checks).length
        };
        
        return checks;
    }

    /**
     * Core Web Vitals 評価
     */
    getCWVRating(metric, value) {
        const ratings = {
            LCP: { good: 2500, poor: 4000 },
            FID: { good: 100, poor: 300 },
            CLS: { good: 0.1, poor: 0.25 }
        };
        
        const thresholds = ratings[metric];
        if (!thresholds) return 'unknown';
        
        if (value <= thresholds.good) return 'good';
        if (value <= thresholds.poor) return 'needs-improvement';
        return 'poor';
    }

    /**
     * サマリー生成
     */
    generateSummary(results) {
        const summary = {
            timestamp: results.timestamp,
            baseUrl: results.baseUrl,
            totalPages: results.pages.length,
            passedPages: 0,
            failedPages: 0,
            averageScores: {
                performance: 0,
                accessibility: 0,
                bestPractices: 0,
                seo: 0
            },
            averageMetrics: {
                LCP: 0,
                FCP: 0,
                TTI: 0,
                CLS: 0
            },
            issues: [],
            recommendations: []
        };
        
        let totalScores = { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 };
        let totalMetrics = { LCP: 0, FCP: 0, TTI: 0, CLS: 0 };
        
        results.pages.forEach(page => {
            if (page.status === 'completed') {
                // 合格/不合格カウント
                if (page.thresholdCheck?.overall?.passed) {
                    summary.passedPages++;
                } else {
                    summary.failedPages++;
                }
                
                // スコア平均計算
                const scores = page.lighthouse.scores;
                totalScores.performance += scores.performance;
                totalScores.accessibility += scores.accessibility;
                totalScores.bestPractices += scores.bestPractices;
                totalScores.seo += scores.seo;
                
                // メトリクス平均計算
                const metrics = page.lighthouse.metrics;
                totalMetrics.LCP += metrics.LCP;
                totalMetrics.FCP += metrics.FCP;
                totalMetrics.TTI += metrics.TTI;
                totalMetrics.CLS += metrics.CLS;
                
                // 問題のあるページを記録
                if (!page.thresholdCheck?.overall?.passed) {
                    summary.issues.push({
                        page: page.name,
                        url: page.url,
                        failedChecks: Object.entries(page.thresholdCheck)
                            .filter(([key, check]) => key !== 'overall' && !check.passed)
                            .map(([key, check]) => ({ metric: key, ...check }))
                    });
                }
            } else {
                summary.failedPages++;
            }
        });
        
        const completedPages = summary.totalPages - summary.failedPages;
        
        if (completedPages > 0) {
            // 平均値計算
            Object.keys(totalScores).forEach(key => {
                summary.averageScores[key] = Math.round(totalScores[key] / completedPages);
            });
            
            Object.keys(totalMetrics).forEach(key => {
                summary.averageMetrics[key] = Math.round(totalMetrics[key] / completedPages);
            });
        }
        
        // 推奨事項生成
        summary.recommendations = this.generateRecommendations(summary);
        
        return summary;
    }

    /**
     * 推奨事項生成
     */
    generateRecommendations(summary) {
        const recommendations = [];
        
        // パフォーマンススコアが低い場合
        if (summary.averageScores.performance < 90) {
            recommendations.push({
                category: 'Performance',
                priority: 'high',
                issue: `平均パフォーマンススコアが${summary.averageScores.performance}点`,
                solution: 'JavaScript/CSSの最適化、画像圧縮、キャッシュ戦略の見直しを検討'
            });
        }
        
        // LCP が遅い場合
        if (summary.averageMetrics.LCP > 2500) {
            recommendations.push({
                category: 'Core Web Vitals',
                priority: 'high',
                issue: `LCP が${summary.averageMetrics.LCP}ms と閾値(2500ms)を超過`,
                solution: '重要なリソースのプリロード、画像最適化、サーバー応答時間改善'
            });
        }
        
        // CLS が高い場合
        if (summary.averageMetrics.CLS > 0.1) {
            recommendations.push({
                category: 'Core Web Vitals',
                priority: 'medium',
                issue: `CLS が${summary.averageMetrics.CLS} と閾値(0.1)を超過`,
                solution: '画像・動画のサイズ指定、Webフォントのfont-display設定'
            });
        }
        
        // アクセシビリティスコアが低い場合
        if (summary.averageScores.accessibility < 95) {
            recommendations.push({
                category: 'Accessibility',
                priority: 'medium',
                issue: `アクセシビリティスコアが${summary.averageScores.accessibility}点`,
                solution: 'alt属性追加、コントラスト比改善、キーボードナビゲーション対応'
            });
        }
        
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
     * ページ別レポート保存
     */
    async savePageReport(pageName, result) {
        const filename = `${pageName}-${new Date().toISOString().split('T')[0]}.json`;
        const filepath = path.join(this.outputDir, filename);
        
        await fs.writeFile(filepath, JSON.stringify(result, null, 2));
        console.log(`📄 Page report saved: ${filepath}`);
    }

    /**
     * サマリーレポート保存
     */
    async saveSummaryReport(summary) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `performance-summary-${timestamp}.json`;
        const filepath = path.join(this.outputDir, filename);
        
        await fs.writeFile(filepath, JSON.stringify(summary, null, 2));
        console.log(`📊 Summary report saved: ${filepath}`);
        
        // HTML レポートも生成
        const htmlReport = this.generateHTMLReport(summary);
        const htmlFilename = `performance-report-${timestamp}.html`;
        const htmlFilepath = path.join(this.outputDir, htmlFilename);
        
        await fs.writeFile(htmlFilepath, htmlReport);
        console.log(`🌐 HTML report saved: ${htmlFilepath}`);
    }

    /**
     * HTML レポート生成
     */
    generateHTMLReport(summary) {
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HaQei Performance Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 1rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .metric { background: #f9f9f9; padding: 1rem; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2rem; font-weight: bold; color: #4f46e5; }
        .metric-label { color: #666; font-size: 0.875rem; }
        .passed { color: #10b981; }
        .failed { color: #ef4444; }
        .issues { background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: 6px; margin: 1rem 0; }
        .recommendations { background: #f0f9ff; border: 1px solid #bae6fd; padding: 1rem; border-radius: 6px; margin: 1rem 0; }
        .issue-item, .rec-item { margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,255,255,0.5); border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HaQei Performance Test Report</h1>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value ${summary.passedPages === summary.totalPages ? 'passed' : 'failed'}">${summary.passedPages}/${summary.totalPages}</div>
                <div class="metric-label">Passed Pages</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.averageScores.performance}</div>
                <div class="metric-label">Avg Performance</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.averageMetrics.LCP}ms</div>
                <div class="metric-label">Avg LCP</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.averageMetrics.CLS}</div>
                <div class="metric-label">Avg CLS</div>
            </div>
        </div>
        
        ${summary.issues.length > 0 ? `
        <div class="issues">
            <h3>⚠️ Issues Found</h3>
            ${summary.issues.map(issue => `
                <div class="issue-item">
                    <strong>${issue.page}</strong>: ${issue.failedChecks.map(check => check.metric).join(', ')} failed threshold checks
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${summary.recommendations.length > 0 ? `
        <div class="recommendations">
            <h3>💡 Recommendations</h3>
            ${summary.recommendations.map(rec => `
                <div class="rec-item">
                    <strong>[${rec.priority.toUpperCase()}] ${rec.category}</strong>: ${rec.issue}<br>
                    <em>Solution: ${rec.solution}</em>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <p><strong>Generated:</strong> ${summary.timestamp}</p>
        <p><strong>Base URL:</strong> ${summary.baseUrl}</p>
    </div>
</body>
</html>
        `.trim();
    }

    /**
     * コンソール サマリー表示
     */
    displaySummary(summary) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 PERFORMANCE TEST SUMMARY');
        console.log('='.repeat(60));
        
        console.log(`\n📈 Overall Results:`);
        console.log(`   Pages Tested: ${summary.totalPages}`);
        console.log(`   Passed: ${summary.passedPages} ✅`);
        console.log(`   Failed: ${summary.failedPages} ❌`);
        
        console.log(`\n⚡ Average Scores:`);
        console.log(`   Performance: ${summary.averageScores.performance}/100`);
        console.log(`   Accessibility: ${summary.averageScores.accessibility}/100`);
        console.log(`   Best Practices: ${summary.averageScores.bestPractices}/100`);
        console.log(`   SEO: ${summary.averageScores.seo}/100`);
        
        console.log(`\n🎯 Core Web Vitals:`);
        console.log(`   LCP: ${summary.averageMetrics.LCP}ms (threshold: 2500ms)`);
        console.log(`   CLS: ${summary.averageMetrics.CLS} (threshold: 0.1)`);
        console.log(`   TTI: ${summary.averageMetrics.TTI}ms (threshold: 3800ms)`);
        
        if (summary.issues.length > 0) {
            console.log(`\n⚠️  Issues (${summary.issues.length}):`);
            summary.issues.forEach(issue => {
                console.log(`   - ${issue.page}: ${issue.failedChecks.length} failed checks`);
            });
        }
        
        if (summary.recommendations.length > 0) {
            console.log(`\n💡 Top Recommendations:`);
            summary.recommendations.slice(0, 3).forEach(rec => {
                console.log(`   [${rec.priority.toUpperCase()}] ${rec.issue}`);
            });
        }
        
        console.log('\n' + '='.repeat(60));
    }
}

// CLI実行時
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || 'http://localhost:3000';
    
    const testSuite = new PerformanceTestSuite({ baseUrl });
    
    testSuite.runAllTests()
        .then(summary => {
            process.exit(summary.failedPages > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ Performance test failed:', error);
            process.exit(1);
        });
}

module.exports = PerformanceTestSuite;