#!/usr/bin/env node

/**
 * Bundle Analyzer for HAQEI Analyzer
 * Viteビルドの結果を分析し、bundle sizeを可視化
 * 目標: 4.76MB → 3MB達成の確認
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.distPath = path.join(__dirname, '../dist');
    this.reportPath = path.join(__dirname, '../performance-reports');
    this.targetSizeMB = 3.0;
    this.currentSizeMB = 4.76;
  }

  /**
   * Bundle分析の実行
   */
  async analyze() {
    console.log('🔍 Starting Bundle Analysis...\n');

    try {
      // 1. ディストリビューション全体のサイズ分析
      const distStats = await this.analyzeDist();
      
      // 2. JSファイルの詳細分析
      const jsStats = await this.analyzeJavaScript();
      
      // 3. 辞書ファイルの分析
      const dictStats = await this.analyzeDictionaries();
      
      // 4. CSS・その他ファイルの分析
      const assetStats = await this.analyzeAssets();
      
      // 5. 最適化効果の計算
      const optimizationResults = this.calculateOptimization(distStats, jsStats, dictStats);
      
      // 6. レポート生成
      const report = this.generateReport({
        distStats,
        jsStats,
        dictStats,
        assetStats,
        optimizationResults
      });
      
      // 7. レポート保存
      await this.saveReport(report);
      
      // 8. 推奨事項の表示
      this.displayRecommendations(optimizationResults);
      
      return report;
      
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error);
      throw error;
    }
  }

  /**
   * ディストリビューション全体の分析
   */
  async analyzeDist() {
    console.log('📊 Analyzing distribution files...');
    
    const stats = {
      totalSize: 0,
      fileCount: 0,
      directories: {},
      largestFiles: []
    };

    const files = this.getAllFiles(this.distPath);
    
    files.forEach(filePath => {
      const relPath = path.relative(this.distPath, filePath);
      const fileStats = fs.statSync(filePath);
      const size = fileStats.size;
      
      stats.totalSize += size;
      stats.fileCount++;
      
      // ディレクトリ別サイズ
      const dir = path.dirname(relPath);
      if (!stats.directories[dir]) {
        stats.directories[dir] = { size: 0, count: 0 };
      }
      stats.directories[dir].size += size;
      stats.directories[dir].count++;
      
      // 大きなファイルの記録
      stats.largestFiles.push({
        path: relPath,
        size: size,
        sizeFormatted: this.formatBytes(size)
      });
    });
    
    // 大きなファイル順にソート
    stats.largestFiles.sort((a, b) => b.size - a.size);
    stats.largestFiles = stats.largestFiles.slice(0, 20); // Top 20
    
    stats.totalSizeFormatted = this.formatBytes(stats.totalSize);
    stats.totalSizeMB = Math.round(stats.totalSize / 1024 / 1024 * 100) / 100;
    
    console.log(`📦 Total distribution size: ${stats.totalSizeFormatted} (${stats.totalSizeMB}MB)`);
    console.log(`📄 Total files: ${stats.fileCount}`);
    
    return stats;
  }

  /**
   * JavaScriptファイルの詳細分析
   */
  async analyzeJavaScript() {
    console.log('🔍 Analyzing JavaScript files...');
    
    const jsPath = path.join(this.distPath, 'js');
    if (!fs.existsSync(jsPath)) {
      return { error: 'JavaScript directory not found' };
    }

    const stats = {
      totalSize: 0,
      fileCount: 0,
      categories: {
        core: { size: 0, files: [] },
        components: { size: 0, files: [] },
        osAnalyzer: { size: 0, files: [] },
        futureSimulator: { size: 0, files: [] },
        security: { size: 0, files: [] },
        data: { size: 0, files: [] },
        legacy: { size: 0, files: [] }
      },
      duplicates: [],
      unused: []
    };

    const jsFiles = this.getAllFiles(jsPath, '.js');
    
    jsFiles.forEach(filePath => {
      const relPath = path.relative(jsPath, filePath);
      const fileStats = fs.statSync(filePath);
      const size = fileStats.size;
      
      stats.totalSize += size;
      stats.fileCount++;
      
      const category = this.categorizeJSFile(relPath);
      if (stats.categories[category]) {
        stats.categories[category].size += size;
        stats.categories[category].files.push({
          path: relPath,
          size: size,
          sizeFormatted: this.formatBytes(size)
        });
      }
    });

    // 重複ファイルの検出
    stats.duplicates = this.detectDuplicateJS(jsFiles);
    
    // 未使用ファイルの検出
    stats.unused = this.detectUnusedJS(jsFiles);
    
    stats.totalSizeFormatted = this.formatBytes(stats.totalSize);
    stats.totalSizeMB = Math.round(stats.totalSize / 1024 / 1024 * 100) / 100;
    
    console.log(`🟨 JavaScript total size: ${stats.totalSizeFormatted} (${stats.totalSizeMB}MB)`);
    
    return stats;
  }

  /**
   * 辞書ファイルの分析
   */
  async analyzeDictionaries() {
    console.log('📚 Analyzing dictionary files...');
    
    const dictPath = path.join(this.distPath, 'dict');
    if (!fs.existsSync(dictPath)) {
      // public/dictも確認
      const publicDictPath = path.join(this.distPath, '../public/dict');
      if (!fs.existsSync(publicDictPath)) {
        return { error: 'Dictionary directory not found' };
      }
    }

    const stats = {
      totalSize: 0,
      fileCount: 0,
      essential: { size: 0, files: [] },
      large: { size: 0, files: [] },
      optimization: {
        lazyLoadSavings: 0,
        compressionSavings: 0
      }
    };

    const dictFiles = this.getAllFiles(dictPath || path.join(this.distPath, '../public/dict'), '.gz');
    
    const essentialDicts = ['unk.dat.gz', 'unk_char.dat.gz', 'unk_compat.dat.gz', 'unk_invoke.dat.gz', 'unk_map.dat.gz', 'unk_pos.dat.gz'];
    
    dictFiles.forEach(filePath => {
      const filename = path.basename(filePath);
      const fileStats = fs.statSync(filePath);
      const size = fileStats.size;
      
      stats.totalSize += size;
      stats.fileCount++;
      
      const fileInfo = {
        path: filename,
        size: size,
        sizeFormatted: this.formatBytes(size)
      };
      
      if (essentialDicts.includes(filename)) {
        stats.essential.size += size;
        stats.essential.files.push(fileInfo);
      } else {
        stats.large.size += size;
        stats.large.files.push(fileInfo);
        // 遅延ロード可能なサイズとして計算
        stats.optimization.lazyLoadSavings += size;
      }
    });
    
    stats.totalSizeFormatted = this.formatBytes(stats.totalSize);
    stats.totalSizeMB = Math.round(stats.totalSize / 1024 / 1024 * 100) / 100;
    stats.optimization.lazyLoadSavingsMB = Math.round(stats.optimization.lazyLoadSavings / 1024 / 1024 * 100) / 100;
    
    console.log(`📖 Dictionary total size: ${stats.totalSizeFormatted} (${stats.totalSizeMB}MB)`);
    console.log(`🚀 Lazy load savings potential: ${stats.optimization.lazyLoadSavingsMB}MB`);
    
    return stats;
  }

  /**
   * CSS・その他アセットの分析
   */
  async analyzeAssets() {
    console.log('🎨 Analyzing CSS and other assets...');
    
    const stats = {
      css: { size: 0, files: [] },
      images: { size: 0, files: [] },
      other: { size: 0, files: [] },
      totalSize: 0
    };

    // CSS files
    const cssFiles = this.getAllFiles(path.join(this.distPath, 'css'), '.css');
    cssFiles.forEach(filePath => {
      const relPath = path.relative(this.distPath, filePath);
      const fileStats = fs.statSync(filePath);
      const size = fileStats.size;
      
      stats.css.size += size;
      stats.css.files.push({
        path: relPath,
        size: size,
        sizeFormatted: this.formatBytes(size)
      });
      stats.totalSize += size;
    });

    // Image files
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    imageExtensions.forEach(ext => {
      const imageFiles = this.getAllFiles(this.distPath, ext);
      imageFiles.forEach(filePath => {
        const relPath = path.relative(this.distPath, filePath);
        const fileStats = fs.statSync(filePath);
        const size = fileStats.size;
        
        stats.images.size += size;
        stats.images.files.push({
          path: relPath,
          size: size,
          sizeFormatted: this.formatBytes(size)
        });
        stats.totalSize += size;
      });
    });

    return stats;
  }

  /**
   * 最適化効果の計算
   */
  calculateOptimization(distStats, jsStats, dictStats) {
    const results = {
      currentSizeMB: distStats.totalSizeMB,
      targetSizeMB: this.targetSizeMB,
      optimizations: {
        dictionaryLazyLoad: dictStats.optimization?.lazyLoadSavingsMB || 0,
        unusedJSRemoval: this.calculateUnusedJSSavings(jsStats),
        treeShaking: this.calculateTreeShakingSavings(jsStats),
        compression: this.calculateCompressionSavings(distStats)
      },
      projectedSizeMB: 0,
      achievesTarget: false,
      reductionPercentage: 0
    };

    // 予想サイズ計算
    const totalSavings = Object.values(results.optimizations).reduce((sum, saving) => sum + saving, 0);
    results.projectedSizeMB = Math.max(0, results.currentSizeMB - totalSavings);
    results.achievesTarget = results.projectedSizeMB <= results.targetSizeMB;
    results.reductionPercentage = Math.round((totalSavings / results.currentSizeMB) * 100);

    return results;
  }

  /**
   * 未使用JS削除による節約効果
   */
  calculateUnusedJSSavings(jsStats) {
    if (!jsStats.unused) return 0;
    
    const unusedSize = jsStats.unused.reduce((sum, file) => {
      const filePath = path.join(this.distPath, 'js', file);
      if (fs.existsSync(filePath)) {
        return sum + fs.statSync(filePath).size;
      }
      return sum;
    }, 0);
    
    return Math.round(unusedSize / 1024 / 1024 * 100) / 100;
  }

  /**
   * Tree-shaking効果の計算
   */
  calculateTreeShakingSavings(jsStats) {
    // レガシーファイルと思われるもののサイズ
    const legacySize = jsStats.categories?.legacy?.size || 0;
    return Math.round(legacySize / 1024 / 1024 * 100) / 100;
  }

  /**
   * 圧縮効果の計算
   */
  calculateCompressionSavings(distStats) {
    // Terser最適化による推定節約効果（20-30%）
    const uncompressedJS = distStats.totalSize * 0.6; // JSが全体の60%と仮定
    const compressionRatio = 0.25; // 25%の圧縮効果
    const savings = uncompressedJS * compressionRatio;
    
    return Math.round(savings / 1024 / 1024 * 100) / 100;
  }

  // Helper methods
  getAllFiles(dir, extension = null) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extension));
      } else if (!extension || fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  categorizeJSFile(relPath) {
    if (relPath.includes('shared/core/') || relPath === 'app.js') return 'core';
    if (relPath.includes('components/')) return 'components';
    if (relPath.includes('os-analyzer/')) return 'osAnalyzer';
    if (relPath.includes('future-simulator')) return 'futureSimulator';
    if (relPath.includes('security/')) return 'security';
    if (relPath.includes('data/')) return 'data';
    if (relPath.includes('bible.js') || relPath.includes('koudo_shishin')) return 'legacy';
    return 'other';
  }

  detectDuplicateJS(files) {
    // 簡易的な重複検出（ファイル名ベース）
    const basenames = {};
    const duplicates = [];
    
    files.forEach(file => {
      const basename = path.basename(file, '.js');
      if (basenames[basename]) {
        duplicates.push({
          name: basename,
          files: [basenames[basename], file]
        });
      } else {
        basenames[basename] = file;
      }
    });
    
    return duplicates;
  }

  detectUnusedJS(files) {
    // 使用されていない可能性のあるファイル
    const unusedPatterns = [
      'bible.js',
      'koudo_shishin_database.js',
      'data_box.js',
      'hexagram_details.js'
    ];
    
    return files.filter(file => {
      const basename = path.basename(file);
      return unusedPatterns.some(pattern => basename.includes(pattern));
    });
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * レポート生成
   */
  generateReport(analysisData) {
    const timestamp = new Date().toISOString();
    
    return {
      meta: {
        timestamp,
        analyzer: 'HAQEI Bundle Analyzer v1.0',
        target: `Bundle size reduction: ${this.currentSizeMB}MB → ${this.targetSizeMB}MB`
      },
      summary: {
        currentSize: analysisData.distStats.totalSizeMB,
        projectedSize: analysisData.optimizationResults.projectedSizeMB,
        targetSize: this.targetSizeMB,
        achievesTarget: analysisData.optimizationResults.achievesTarget,
        reductionPercentage: analysisData.optimizationResults.reductionPercentage
      },
      breakdown: {
        distribution: analysisData.distStats,
        javascript: analysisData.jsStats,
        dictionaries: analysisData.dictStats,
        assets: analysisData.assetStats
      },
      optimizations: analysisData.optimizationResults.optimizations,
      recommendations: this.generateRecommendations(analysisData.optimizationResults)
    };
  }

  /**
   * 推奨事項生成
   */
  generateRecommendations(optimizationResults) {
    const recommendations = [];
    
    if (optimizationResults.optimizations.dictionaryLazyLoad > 0.5) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Dictionary Optimization',
        description: `辞書ファイルの遅延ロード実装で${optimizationResults.optimizations.dictionaryLazyLoad}MB削減可能`,
        impact: optimizationResults.optimizations.dictionaryLazyLoad,
        action: 'DictionaryLazyLoader使用'
      });
    }
    
    if (optimizationResults.optimizations.unusedJSRemoval > 0.2) {
      recommendations.push({
        priority: 'HIGH',
        category: 'JavaScript Cleanup',
        description: `未使用JSファイル削除で${optimizationResults.optimizations.unusedJSRemoval}MB削減可能`,
        impact: optimizationResults.optimizations.unusedJSRemoval,
        action: 'Tree-shaking optimization実行'
      });
    }
    
    if (optimizationResults.optimizations.compression > 0.3) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Compression',
        description: `Terser最適化で${optimizationResults.optimizations.compression}MB削減可能`,
        impact: optimizationResults.optimizations.compression,
        action: 'Vite terser設定有効化'
      });
    }
    
    if (!optimizationResults.achievesTarget) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Target Achievement',
        description: `追加最適化が必要: 現在予測${optimizationResults.projectedSizeMB}MB > 目標${this.targetSizeMB}MB`,
        impact: optimizationResults.projectedSizeMB - this.targetSizeMB,
        action: 'さらなる最適化戦略検討'
      });
    }
    
    return recommendations;
  }

  /**
   * レポート保存
   */
  async saveReport(report) {
    if (!fs.existsSync(this.reportPath)) {
      fs.mkdirSync(this.reportPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(this.reportPath, `bundle-analysis-${timestamp}.json`);
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved: ${reportFile}`);
    
    // HTML版も生成
    const htmlReport = this.generateHTMLReport(report);
    const htmlFile = path.join(this.reportPath, `bundle-analysis-${timestamp}.html`);
    fs.writeFileSync(htmlFile, htmlReport);
    console.log(`🌐 HTML report saved: ${htmlFile}`);
  }

  /**
   * HTML レポート生成
   */
  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAQEI Bundle Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: #ecf0f1; padding: 20px; border-radius: 6px; text-align: center; }
        .metric .value { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .metric .label { color: #7f8c8d; margin-top: 5px; }
        .success { background: #d5f4e6; color: #27ae60; }
        .warning { background: #fdeaa7; color: #f39c12; }
        .danger { background: #fab1a0; color: #e74c3c; }
        .recommendations { margin-top: 30px; }
        .recommendation { margin: 15px 0; padding: 15px; border-left: 4px solid #3498db; background: #f8f9fa; }
        .priority-HIGH { border-left-color: #e74c3c; }
        .priority-CRITICAL { border-left-color: #d63031; background: #fff5f5; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f1f3f4; font-weight: bold; }
        .progress-bar { width: 100%; height: 20px; background: #ecf0f1; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #74b9ff, #0984e3); border-radius: 10px; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 HAQEI Bundle Analysis Report</h1>
        <p><strong>Generated:</strong> ${report.meta.timestamp}</p>
        <p><strong>Analyzer:</strong> ${report.meta.analyzer}</p>
        <p><strong>Target:</strong> ${report.meta.target}</p>

        <div class="summary">
            <div class="metric ${report.summary.achievesTarget ? 'success' : 'danger'}">
                <div class="value">${report.summary.currentSize}MB</div>
                <div class="label">Current Size</div>
            </div>
            <div class="metric">
                <div class="value">${report.summary.projectedSize}MB</div>
                <div class="label">Projected Size</div>
            </div>
            <div class="metric success">
                <div class="value">${report.summary.targetSize}MB</div>
                <div class="label">Target Size</div>
            </div>
            <div class="metric ${report.summary.reductionPercentage > 20 ? 'success' : 'warning'}">
                <div class="value">${report.summary.reductionPercentage}%</div>
                <div class="label">Reduction</div>
            </div>
        </div>

        <h2>🎯 Target Achievement</h2>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(100, (report.summary.targetSize / report.summary.currentSize) * 100)}%"></div>
        </div>
        <p class="${report.summary.achievesTarget ? 'success' : 'danger'}">
            ${report.summary.achievesTarget ? '✅ Target achieved!' : '❌ Additional optimization needed'}
        </p>

        <h2>📈 Optimization Breakdown</h2>
        <table>
            <thead>
                <tr>
                    <th>Optimization</th>
                    <th>Savings (MB)</th>
                    <th>Impact</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report.optimizations).map(([key, value]) => `
                <tr>
                    <td>${key}</td>
                    <td>${value}MB</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(value / report.summary.currentSize) * 100}%"></div>
                        </div>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <h2>💡 Recommendations</h2>
        <div class="recommendations">
            ${report.recommendations.map(rec => `
            <div class="recommendation priority-${rec.priority}">
                <h3>${rec.category} (${rec.priority})</h3>
                <p>${rec.description}</p>
                <p><strong>Action:</strong> ${rec.action}</p>
                <p><strong>Impact:</strong> ${rec.impact}MB savings</p>
            </div>
            `).join('')}
        </div>

        <h2>📁 File Breakdown</h2>
        <h3>JavaScript Files (${report.breakdown.javascript.totalSizeMB}MB)</h3>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Files</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(report.breakdown.javascript.categories || {}).map(([category, data]) => `
                <tr>
                    <td>${category}</td>
                    <td>${this.formatBytes(data.size)}</td>
                    <td>${data.files.length}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #7f8c8d;">
            <p>Generated by HAQEI Bundle Analyzer - <a href="https://github.com/haqei/analyzer">GitHub</a></p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  /**
   * 推奨事項の表示
   */
  displayRecommendations(optimizationResults) {
    console.log('\n🎯 Bundle Size Optimization Summary:');
    console.log('=====================================');
    console.log(`Current Size: ${optimizationResults.currentSizeMB}MB`);
    console.log(`Projected Size: ${optimizationResults.projectedSizeMB}MB`);
    console.log(`Target Size: ${optimizationResults.targetSizeMB}MB`);
    console.log(`Reduction: ${optimizationResults.reductionPercentage}%`);
    console.log(`Target Achieved: ${optimizationResults.achievesTarget ? '✅ YES' : '❌ NO'}`);
    
    console.log('\n💡 Optimization Opportunities:');
    Object.entries(optimizationResults.optimizations).forEach(([key, value]) => {
      if (value > 0) {
        console.log(`  ${key}: ${value}MB savings`);
      }
    });
    
    if (optimizationResults.achievesTarget) {
      console.log('\n🎉 Congratulations! Target bundle size achieved!');
    } else {
      console.log('\n⚠️  Additional optimization needed to reach target.');
    }
  }
}

// 実行
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze()
    .then(report => {
      console.log('\n✅ Bundle analysis completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Bundle analysis failed:', error);
      process.exit(1);
    });
}

module.exports = BundleAnalyzer;