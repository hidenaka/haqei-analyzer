#!/usr/bin/env node

/**
 * PDCA検証システム
 * 実装後に再度仮想ユーザーでテストし、改善効果を測定
 */

const fs = require('fs');
const path = require('path');
const HAQEIPDCASystem = require('./haqei-pdca-system');

class PDCAVerificationSystem {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'output', 'pdca');
    this.pdcaSystem = new HAQEIPDCASystem();
  }

  /**
   * 検証プロセス実行
   */
  async runVerification(sessionId) {
    console.log(`🔍 PDCA検証開始: ${sessionId}`);
    
    const sessionDir = path.join(this.outputDir, sessionId);
    if (!fs.existsSync(sessionDir)) {
      throw new Error(`セッションが見つかりません: ${sessionId}`);
    }

    // 元のセッションデータ読み込み
    const originalData = this.loadOriginalSession(sessionDir);
    
    // 実装後の再評価実行
    console.log('\n🎭 実装後の仮想ユーザー再評価...');
    const afterResults = await this.runPostImplementationEvaluation(originalData);
    
    // Before/After比較分析
    console.log('\n📊 Before/After比較分析...');
    const comparison = this.compareResults(originalData.evaluation, afterResults);
    
    // 改善効果測定
    const improvementMetrics = this.calculateImprovementMetrics(comparison);
    
    // 検証レポート生成
    const verificationReport = this.generateVerificationReport({
      sessionId,
      original: originalData,
      after: afterResults,
      comparison,
      metrics: improvementMetrics
    });

    // 結果保存
    const verificationDir = path.join(sessionDir, 'verification');
    if (!fs.existsSync(verificationDir)) {
      fs.mkdirSync(verificationDir);
    }

    const reportPath = path.join(verificationDir, 'verification-report.html');
    fs.writeFileSync(reportPath, verificationReport);
    
    const dataPath = path.join(verificationDir, 'verification-data.json');
    fs.writeFileSync(dataPath, JSON.stringify({
      after: afterResults,
      comparison,
      metrics: improvementMetrics,
      timestamp: new Date().toISOString()
    }, null, 2));

    console.log(`\n✅ 検証完了!`);
    console.log(`📊 検証レポート: ${reportPath}`);
    
    // 次のPDCAサイクル提案
    if (improvementMetrics.overallImprovement < 0.7) {
      console.log('\n🔄 追加改善の余地があります');
      console.log(`次のPDCAサイクル: npm run pdca:evaluate --site=${originalData.siteName}`);
    } else {
      console.log('\n🎉 大幅な改善が確認されました！');
      console.log('継続的な監視: 定期的な評価実行をお勧めします');
    }

    return {
      reportPath,
      metrics: improvementMetrics,
      needsMoreImprovement: improvementMetrics.overallImprovement < 0.7
    };
  }

  /**
   * 元セッションデータの読み込み
   */
  loadOriginalSession(sessionDir) {
    const evaluationPath = path.join(sessionDir, 'evaluation-results.json');
    const feedbackPath = path.join(sessionDir, 'feedback-analysis.json');
    const planPath = path.join(sessionDir, 'plan.json');
    
    return {
      evaluation: fs.existsSync(evaluationPath) ? JSON.parse(fs.readFileSync(evaluationPath, 'utf8')) : null,
      feedback: fs.existsSync(feedbackPath) ? JSON.parse(fs.readFileSync(feedbackPath, 'utf8')) : null,
      plan: fs.existsSync(planPath) ? JSON.parse(fs.readFileSync(planPath, 'utf8')) : null,
      siteName: fs.existsSync(planPath) ? JSON.parse(fs.readFileSync(planPath, 'utf8')).siteName : 'unknown'
    };
  }

  /**
   * 実装後の再評価実行
   */
  async runPostImplementationEvaluation(originalData) {
    // 同じ仮想ユーザーで再評価
    const plan = {
      ...originalData.plan,
      timestamp: new Date().toISOString(),
      note: 'Post-implementation verification run'
    };

    return await this.pdcaSystem.executeVirtualUserEvaluation(originalData.siteName, plan);
  }

  /**
   * Before/After結果比較
   */
  compareResults(beforeResults, afterResults) {
    const comparison = {
      userComparisons: [],
      metrics: {
        before: this.calculateAggregateMetrics(beforeResults),
        after: this.calculateAggregateMetrics(afterResults)
      }
    };

    // ユーザー別比較
    beforeResults.forEach(beforeUser => {
      const afterUser = afterResults.find(u => u.userId === beforeUser.userId);
      if (afterUser) {
        comparison.userComparisons.push({
          userId: beforeUser.userId,
          userName: beforeUser.userName,
          before: {
            completed: beforeUser.completed,
            rating: beforeUser.overallRating,
            timeSpent: beforeUser.timeSpent,
            problemCount: beforeUser.problems?.length || 0
          },
          after: {
            completed: afterUser.completed,
            rating: afterUser.overallRating,
            timeSpent: afterUser.timeSpent,
            problemCount: afterUser.problems?.length || 0
          },
          improvements: {
            ratingChange: (afterUser.overallRating || 0) - (beforeUser.overallRating || 0),
            timeReduction: (beforeUser.timeSpent || 0) - (afterUser.timeSpent || 0),
            problemReduction: (beforeUser.problems?.length || 0) - (afterUser.problems?.length || 0)
          }
        });
      }
    });

    return comparison;
  }

  /**
   * 集計メトリクス計算
   */
  calculateAggregateMetrics(results) {
    const completedResults = results.filter(r => r.completed && !r.error);
    
    if (completedResults.length === 0) {
      return {
        completionRate: 0,
        averageRating: 0,
        averageTime: 0,
        averageProblems: 0
      };
    }

    return {
      completionRate: completedResults.length / results.length,
      averageRating: completedResults.reduce((sum, r) => sum + (r.overallRating || 0), 0) / completedResults.length,
      averageTime: completedResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0) / completedResults.length,
      averageProblems: completedResults.reduce((sum, r) => sum + (r.problems?.length || 0), 0) / completedResults.length
    };
  }

  /**
   * 改善効果測定
   */
  calculateImprovementMetrics(comparison) {
    const before = comparison.metrics.before;
    const after = comparison.metrics.after;

    const metrics = {
      completionRateImprovement: after.completionRate - before.completionRate,
      ratingImprovement: after.averageRating - before.averageRating,
      timeReduction: (before.averageTime - after.averageTime) / before.averageTime,
      problemReduction: (before.averageProblems - after.averageProblems) / Math.max(before.averageProblems, 1),
      overallImprovement: 0
    };

    // 総合改善度計算（0-1のスコア）
    const improvements = [
      Math.max(0, metrics.completionRateImprovement), // 完了率向上
      Math.max(0, metrics.ratingImprovement / 5), // 評価向上（5点満点なので正規化）
      Math.max(0, metrics.timeReduction), // 時間短縮
      Math.max(0, metrics.problemReduction) // 問題減少
    ];

    metrics.overallImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;

    // 改善レベルの判定
    metrics.improvementLevel = this.categorizeImprovement(metrics.overallImprovement);

    return metrics;
  }

  /**
   * 改善レベルの分類
   */
  categorizeImprovement(score) {
    if (score >= 0.8) return { level: 'excellent', label: '素晴らしい改善', color: '#28a745' };
    if (score >= 0.6) return { level: 'good', label: '良好な改善', color: '#17a2b8' };
    if (score >= 0.4) return { level: 'moderate', label: '中程度の改善', color: '#ffc107' };
    if (score >= 0.2) return { level: 'slight', label: '軽微な改善', color: '#fd7e14' };
    return { level: 'minimal', label: '改善効果が少ない', color: '#dc3545' };
  }

  /**
   * 検証レポート生成
   */
  generateVerificationReport(data) {
    const { sessionId, original, after, comparison, metrics } = data;
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDCA検証レポート - ${sessionId}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border-radius: 10px; }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { padding: 20px; border-radius: 8px; text-align: center; color: white; }
        .metric-value { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { font-size: 0.9em; opacity: 0.9; }
        .improvement-indicator { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .positive { background: #d4edda; color: #155724; }
        .negative { background: #f8d7da; color: #721c24; }
        .neutral { background: #d1ecf1; color: #0c5460; }
        .user-comparison { margin: 15px 0; padding: 15px; border-left: 4px solid #28a745; background: #f8fff9; }
        .before-after { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .before, .after { padding: 15px; border-radius: 8px; }
        .before { background: #fff3cd; border-left: 4px solid #ffc107; }
        .after { background: #d4edda; border-left: 4px solid #28a745; }
        .chart-container { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .improvement-level { padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; color: white; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; font-weight: 600; }
        .progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden; margin: 5px 0; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 PDCA検証レポート</h1>
            <h2>実装効果測定結果</h2>
            <p>セッション: ${sessionId}</p>
            <p>検証日時: ${new Date().toLocaleString('ja-JP')}</p>
        </div>

        <div class="section">
            <div class="improvement-level" style="background-color: ${metrics.improvementLevel.color}">
                <h2>総合改善レベル: ${metrics.improvementLevel.label}</h2>
                <div class="metric-value">${Math.round(metrics.overallImprovement * 100)}%</div>
            </div>
        </div>

        <div class="section">
            <h2>📊 主要メトリクス改善度</h2>
            <div class="metrics-grid">
                <div class="metric-card" style="background: ${metrics.completionRateImprovement >= 0 ? '#28a745' : '#dc3545'}">
                    <div class="metric-value">${metrics.completionRateImprovement >= 0 ? '+' : ''}${Math.round(metrics.completionRateImprovement * 100)}%</div>
                    <div class="metric-label">完了率変化</div>
                </div>
                <div class="metric-card" style="background: ${metrics.ratingImprovement >= 0 ? '#28a745' : '#dc3545'}">
                    <div class="metric-value">${metrics.ratingImprovement >= 0 ? '+' : ''}${metrics.ratingImprovement.toFixed(1)}</div>
                    <div class="metric-label">評価改善 (5点満点)</div>
                </div>
                <div class="metric-card" style="background: ${metrics.timeReduction >= 0 ? '#28a745' : '#dc3545'}">
                    <div class="metric-value">${Math.round(metrics.timeReduction * 100)}%</div>
                    <div class="metric-label">時間短縮</div>
                </div>
                <div class="metric-card" style="background: ${metrics.problemReduction >= 0 ? '#28a745' : '#dc3545'}">
                    <div class="metric-value">${Math.round(metrics.problemReduction * 100)}%</div>
                    <div class="metric-label">問題減少</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>📈 Before / After 比較</h2>
            <div class="before-after">
                <div class="before">
                    <h3>実装前 (Before)</h3>
                    <p><strong>完了率:</strong> ${Math.round(comparison.metrics.before.completionRate * 100)}%</p>
                    <p><strong>平均評価:</strong> ${comparison.metrics.before.averageRating.toFixed(1)}/5.0</p>
                    <p><strong>平均時間:</strong> ${Math.round(comparison.metrics.before.averageTime / 1000)}秒</p>
                    <p><strong>平均問題数:</strong> ${comparison.metrics.before.averageProblems.toFixed(1)}件</p>
                </div>
                <div class="after">
                    <h3>実装後 (After)</h3>
                    <p><strong>完了率:</strong> ${Math.round(comparison.metrics.after.completionRate * 100)}%</p>
                    <p><strong>平均評価:</strong> ${comparison.metrics.after.averageRating.toFixed(1)}/5.0</p>
                    <p><strong>平均時間:</strong> ${Math.round(comparison.metrics.after.averageTime / 1000)}秒</p>
                    <p><strong>平均問題数:</strong> ${comparison.metrics.after.averageProblems.toFixed(1)}件</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>👥 ユーザー別改善結果</h2>
            ${comparison.userComparisons.map(user => `
                <div class="user-comparison">
                    <h3>${user.userName}</h3>
                    <table>
                        <tr>
                            <th>指標</th>
                            <th>実装前</th>
                            <th>実装後</th>
                            <th>変化</th>
                        </tr>
                        <tr>
                            <td>完了</td>
                            <td>${user.before.completed ? '✅' : '❌'}</td>
                            <td>${user.after.completed ? '✅' : '❌'}</td>
                            <td>${user.before.completed === user.after.completed ? '変化なし' : (user.after.completed ? '✅ 改善' : '❌ 悪化')}</td>
                        </tr>
                        <tr>
                            <td>評価</td>
                            <td>${user.before.rating?.toFixed(1) || 'N/A'}</td>
                            <td>${user.after.rating?.toFixed(1) || 'N/A'}</td>
                            <td>
                                <span class="improvement-indicator ${user.improvements.ratingChange > 0 ? 'positive' : user.improvements.ratingChange < 0 ? 'negative' : 'neutral'}">
                                    ${user.improvements.ratingChange > 0 ? '+' : ''}${user.improvements.ratingChange.toFixed(1)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>時間</td>
                            <td>${Math.round((user.before.timeSpent || 0) / 1000)}秒</td>
                            <td>${Math.round((user.after.timeSpent || 0) / 1000)}秒</td>
                            <td>
                                <span class="improvement-indicator ${user.improvements.timeReduction > 0 ? 'positive' : user.improvements.timeReduction < 0 ? 'negative' : 'neutral'}">
                                    ${user.improvements.timeReduction > 0 ? '-' : '+'}${Math.round(Math.abs(user.improvements.timeReduction) / 1000)}秒
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>問題数</td>
                            <td>${user.before.problemCount}件</td>
                            <td>${user.after.problemCount}件</td>
                            <td>
                                <span class="improvement-indicator ${user.improvements.problemReduction > 0 ? 'positive' : user.improvements.problemReduction < 0 ? 'negative' : 'neutral'}">
                                    ${user.improvements.problemReduction > 0 ? '-' : '+'}${Math.abs(user.improvements.problemReduction)}件
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>🎯 次のアクション提案</h2>
            ${metrics.overallImprovement >= 0.7 ? `
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; color: #155724;">
                    <h3>🎉 大成功！</h3>
                    <p>実装による改善効果が非常に高く確認されました。</p>
                    <ul>
                        <li>現在の改善を維持するための定期監視を設定</li>
                        <li>成功パターンを他の機能にも適用検討</li>
                        <li>ユーザーフィードバックの継続収集</li>
                    </ul>
                </div>
            ` : `
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; color: #856404;">
                    <h3>🔄 追加改善が必要</h3>
                    <p>改善効果は確認されましたが、さらなる向上の余地があります。</p>
                    <ul>
                        <li>問題が残っている部分の詳細分析</li>
                        <li>追加のPDCAサイクル実行を推奨</li>
                        <li>別のアプローチの検討</li>
                        <li>ユーザーセグメント別の対策検討</li>
                    </ul>
                </div>
            `}
        </div>

        <div class="section">
            <h2>📊 検証データサマリー</h2>
            <table>
                <tr><th>項目</th><th>値</th></tr>
                <tr><td>検証実行日時</td><td>${new Date().toLocaleString('ja-JP')}</td></tr>
                <tr><td>評価ユーザー数</td><td>${comparison.userComparisons.length}人</td></tr>
                <tr><td>総合改善スコア</td><td>${Math.round(metrics.overallImprovement * 100)}%</td></tr>
                <tr><td>改善レベル</td><td>${metrics.improvementLevel.label}</td></tr>
                <tr><td>次回推奨アクション</td><td>${metrics.overallImprovement >= 0.7 ? '定期監視' : '追加改善サイクル'}</td></tr>
            </table>
        </div>
    </div>
</body>
</html>`;
  }
}

// コマンドライン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  const sessionId = process.env.npm_config_session || args[0];
  
  if (!sessionId) {
    console.error('❌ セッションIDが必要です');
    console.log('使用例: npm run pdca:verify --session=pdca-os-analyzer-2025-01-10T...');
    process.exit(1);
  }
  
  const verification = new PDCAVerificationSystem();
  
  verification.runVerification(sessionId)
    .then(result => {
      console.log(`\n✅ 検証完了: ${result.metrics.improvementLevel.label}`);
      console.log(`📊 改善スコア: ${Math.round(result.metrics.overallImprovement * 100)}%`);
      console.log(`📄 レポート: file://${result.reportPath}`);
      
      if (result.needsMoreImprovement) {
        console.log('\n🔄 継続的改善を推奨します');
      } else {
        console.log('\n🎉 大幅な改善が確認されました！');
      }
    })
    .catch(error => {
      console.error('❌ 検証エラー:', error.message);
      process.exit(1);
    });
}

module.exports = PDCAVerificationSystem;