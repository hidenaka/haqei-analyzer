#!/usr/bin/env node

/**
 * Claude相談システム
 * PDCAで得られたフィードバックを基に、Claudeと対話的に改善策を検討
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ClaudeConsultationSystem {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'output', 'pdca');
    this.consultationTemplates = this.loadConsultationTemplates();
  }

  /**
   * 相談テンプレートの読み込み
   */
  loadConsultationTemplates() {
    return {
      improvement_planning: {
        title: "改善計画策定相談",
        prompt: `
HAQEIの仮想ユーザー評価結果を基に、改善計画を一緒に検討してください。

## 評価サマリー
{summary}

## 主要な問題点
{problems}

## 改善提案
{suggestions}

## 相談したいポイント
1. これらの改善提案の技術的実現可能性について
2. 実装の優先順位と段階的な進め方
3. HAQEIの哲学（HaQei、易経統合）を保ちながらのUI/UX改善方法
4. 開発工数の見積もりと現実的なスケジュール

どの改善案から着手すべきか、Claude の視点でアドバイスをください。
また、実装時の注意点や、より良い代替案があれば提案してください。
        `,
        followUpQuestions: [
          "提案された改善案の中で、最も効果的だと思うものはどれですか？",
          "技術的に実現困難な部分はありますか？",
          "HAQEIの哲学的側面を損なわずにUI改善する具体的な方法は？",
          "段階的実装のロードマップを作成してもらえますか？"
        ]
      },
      technical_implementation: {
        title: "技術実装方針相談",
        prompt: `
具体的な技術実装について相談させてください。

## 実装対象
{targetImprovements}

## 現在の技術スタック
- フロントエンド: Vanilla JS, HTML5, CSS3
- バックエンド: Node.js (ローカル開発)
- 依存関係: Chart.js, Playwright (テスト)
- 特殊要件: ローカルストレージ中心、CDN依存最小化

## 相談事項
1. 既存コードベースを壊さない実装方法
2. パフォーマンスへの影響を最小化する方法
3. テスト可能な設計にするための工夫
4. 段階的リリースのための機能フラグ設計

具体的な実装パターンやコード例を提示してもらえると助かります。
        `,
        followUpQuestions: [
          "既存のTripleOSEngineとの統合で注意すべき点は？",
          "新機能のテスト戦略はどうすべきでしょうか？",
          "パフォーマンス劣化を防ぐためのベストプラクティスは？",
          "段階的ロールアウトの具体的な手順は？"
        ]
      },
      ux_design_philosophy: {
        title: "UX設計と哲学的整合性相談",
        prompt: `
HAQEIのUX改善において、技術的な使いやすさと哲学的深さのバランスについて相談したいです。

## 現在の課題
{uxChallenges}

## HAQEIの哲学的基盤
- HaQei思想: 複数人格の客観的観察
- 易経統合: 古代の知恵と現代技術の融合
- Triple OS: Engine/Interface/SafeMode の3層構造
- 自己理解ツール: 占いではなく戦略的思考支援

## 相談ポイント
1. 非技術系ユーザーへの配慮と專門性の両立
2. 「分析される不安」を「自己探索の楽しさ」に変える方法
3. 段階的開示による複雑さの管理
4. 哲学的深さを保ちながらの親しみやすさ実現

UX設計において、どのような工夫が効果的でしょうか？
        `,
        followUpQuestions: [
          "初回ユーザーに最適なオンボーディング設計は？",
          "専門用語を分かりやすく伝える工夫は？",
          "ユーザーの心理的抵抗を和らげる表現方法は？",
          "段階的に深い機能を開放する設計パターンは？"
        ]
      }
    };
  }

  /**
   * 相談セッション開始
   */
  async startConsultation(sessionId, consultationType = 'improvement_planning') {
    console.log(`🤖 Claude相談セッション開始: ${consultationType}`);
    
    // PDCAセッションデータの読み込み
    const sessionDir = path.join(this.outputDir, sessionId);
    if (!fs.existsSync(sessionDir)) {
      throw new Error(`セッションが見つかりません: ${sessionId}`);
    }

    const feedbackData = this.loadSessionData(sessionDir);
    const template = this.consultationTemplates[consultationType];
    
    if (!template) {
      throw new Error(`未対応の相談タイプ: ${consultationType}`);
    }

    // 相談プロンプトの生成
    const consultationPrompt = this.generateConsultationPrompt(template, feedbackData);
    
    // 相談記録ディレクトリの作成
    const consultationDir = path.join(sessionDir, 'consultations');
    if (!fs.existsSync(consultationDir)) {
      fs.mkdirSync(consultationDir);
    }

    const consultationFile = path.join(consultationDir, `${consultationType}_${Date.now()}.md`);
    
    // Claude相談用ファイルの生成
    const consultationContent = this.generateConsultationFile(template, consultationPrompt, feedbackData);
    fs.writeFileSync(consultationFile, consultationContent);

    console.log(`📝 相談用ファイル生成: ${consultationFile}`);
    console.log('\n🎯 次のステップ:');
    console.log('1. 生成されたファイルの内容を確認');
    console.log('2. Claude Code を起動してこの内容で相談');
    console.log('3. 相談結果を実装計画に反映');
    console.log('\nClaude相談コマンド:');
    console.log(`npm run mcp:claude:unsafe`);
    console.log(`# または継続セッションなら: npm run mcp:resume:unsafe`);

    return {
      consultationFile,
      consultationType,
      template
    };
  }

  /**
   * セッションデータの読み込み
   */
  loadSessionData(sessionDir) {
    const feedbackPath = path.join(sessionDir, 'feedback-analysis.json');
    const actionPlanPath = path.join(sessionDir, 'action-plan.json');
    const evaluationPath = path.join(sessionDir, 'evaluation-results.json');

    return {
      feedback: fs.existsSync(feedbackPath) ? JSON.parse(fs.readFileSync(feedbackPath, 'utf8')) : null,
      actionPlan: fs.existsSync(actionPlanPath) ? JSON.parse(fs.readFileSync(actionPlanPath, 'utf8')) : null,
      evaluation: fs.existsSync(evaluationPath) ? JSON.parse(fs.readFileSync(evaluationPath, 'utf8')) : null
    };
  }

  /**
   * 相談プロンプトの生成
   */
  generateConsultationPrompt(template, data) {
    let prompt = template.prompt;

    // データを埋め込み
    if (data.feedback) {
      prompt = prompt.replace('{summary}', this.formatSummary(data.feedback.summary));
      prompt = prompt.replace('{problems}', this.formatProblems(data.feedback.commonProblems));
      prompt = prompt.replace('{suggestions}', this.formatSuggestions(data.feedback.prioritizedImprovements));
    }

    if (data.actionPlan) {
      prompt = prompt.replace('{targetImprovements}', this.formatTargetImprovements(data.actionPlan));
    }

    if (data.evaluation) {
      prompt = prompt.replace('{uxChallenges}', this.formatUXChallenges(data.evaluation));
    }

    return prompt;
  }

  /**
   * 相談用Markdownファイルの生成
   */
  generateConsultationFile(template, prompt, data) {
    const timestamp = new Date().toISOString();
    
    return `# ${template.title}

**相談日時**: ${new Date().toLocaleString('ja-JP')}  
**セッション**: HAQEI PDCA相談  

## 🎯 相談内容

${prompt}

## 📊 データ詳細

### 評価サマリー
${data.feedback ? `
- 評価ユーザー数: ${data.feedback.summary.totalUsers}人
- 完了率: ${Math.round((data.feedback.summary.completedUsers / data.feedback.summary.totalUsers) * 100)}%
- 平均評価: ${data.feedback.summary.averageRating.toFixed(1)}/5.0
- 平均時間: ${Math.round(data.feedback.summary.averageTime / 1000)}秒
` : 'データなし'}

### 主要問題
${data.feedback?.commonProblems.map((p, i) => `${i+1}. ${p.problem} (${p.count}人, ${Math.round(p.frequency*100)}%)`).join('\n') || 'なし'}

### 改善提案
${data.feedback?.prioritizedImprovements.map((imp, i) => `
**${i+1}. ${imp.description}**
- 優先度: ${imp.priority.toUpperCase()}
- カテゴリ: ${imp.category}
- 実装方法: ${imp.implementation}
- 期待効果: ${imp.expectedImpact}
`).join('\n') || 'なし'}

## 🤔 具体的な相談事項

${template.followUpQuestions.map((q, i) => `${i+1}. ${q}`).join('\n')}

## 📝 相談メモ欄

（Claude との相談内容をここに記録してください）

### 決定事項


### 次のアクション


### 実装計画


---

**相談完了後**: \`npm run pdca:implement --session=${path.basename(path.dirname(data.sessionDir || ''))}\` で実装フェーズに進んでください。
`;
  }

  /**
   * サマリーのフォーマット
   */
  formatSummary(summary) {
    return `
評価ユーザー: ${summary.totalUsers}人
完了率: ${Math.round((summary.completedUsers / summary.totalUsers) * 100)}%
平均評価: ${summary.averageRating.toFixed(1)}/5.0 
平均時間: ${Math.round(summary.averageTime / 1000)}秒
    `.trim();
  }

  /**
   * 問題点のフォーマット
   */
  formatProblems(problems) {
    return problems.map((p, i) => 
      `${i+1}. ${p.problem} (発生頻度: ${p.count}人/${Math.round(p.frequency*100)}%)`
    ).join('\n');
  }

  /**
   * 改善提案のフォーマット
   */
  formatSuggestions(suggestions) {
    return suggestions.map((s, i) => `
${i+1}. **${s.description}** [${s.priority.toUpperCase()}]
   実装: ${s.implementation}
   効果: ${s.expectedImpact}
    `).join('\n');
  }

  /**
   * 実装対象のフォーマット
   */
  formatTargetImprovements(actionPlan) {
    return actionPlan.claudeConsultationTopics
      .map(topic => `- ${topic.topic}: ${topic.details.map(d => d.description).join(', ')}`)
      .join('\n');
  }

  /**
   * UX課題のフォーマット
   */
  formatUXChallenges(evaluation) {
    const challenges = [];
    evaluation.forEach(result => {
      if (result.problems) {
        challenges.push(...result.problems);
      }
    });
    return [...new Set(challenges)].join('\n- ');
  }

  /**
   * 利用可能な相談タイプ一覧
   */
  listConsultationTypes() {
    console.log('📋 利用可能な相談タイプ:');
    Object.entries(this.consultationTemplates).forEach(([key, template]) => {
      console.log(`  ${key}: ${template.title}`);
    });
  }

  /**
   * 過去のセッション一覧
   */
  listAvailableSessions() {
    if (!fs.existsSync(this.outputDir)) {
      console.log('⚠️ PDCAセッションが見つかりません');
      return [];
    }

    const sessions = fs.readdirSync(this.outputDir)
      .filter(dir => dir.startsWith('pdca-'))
      .map(dir => {
        const sessionPath = path.join(this.outputDir, dir);
        const stats = fs.statSync(sessionPath);
        return {
          id: dir,
          created: stats.mtime,
          path: sessionPath
        };
      })
      .sort((a, b) => b.created - a.created);

    console.log('📋 利用可能なPDCAセッション:');
    sessions.forEach((session, i) => {
      console.log(`  ${i+1}. ${session.id} (${session.created.toLocaleString('ja-JP')})`);
    });

    return sessions;
  }
}

// コマンドライン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const consultation = new ClaudeConsultationSystem();

  switch (command) {
    case 'list-sessions':
      consultation.listAvailableSessions();
      break;
      
    case 'list-types':
      consultation.listConsultationTypes();
      break;
      
    case 'start': {
      const sessionId = process.env.npm_config_session || args[1];
      const consultationType = process.env.npm_config_type || args[2] || 'improvement_planning';
      
      if (!sessionId) {
        console.error('❌ セッションIDが必要です');
        console.log('使用例: npm run pdca:discuss --session=pdca-os-analyzer-2025-01-10T...');
        consultation.listAvailableSessions();
        process.exit(1);
      }
      
      consultation.startConsultation(sessionId, consultationType)
        .then(result => {
          console.log(`\n✅ 相談セッション準備完了: ${result.consultationType}`);
          console.log(`📄 相談ファイル: ${result.consultationFile}`);
          console.log('\n🚀 次のステップでClaude相談を開始してください!');
        })
        .catch(error => {
          console.error('❌ エラー:', error.message);
          process.exit(1);
        });
      break;
    }
      
    default:
      console.log('🤖 Claude相談システム');
      console.log('\n使用方法:');
      console.log('  npm run pdca:discuss --session=<session-id> --type=<consultation-type>');
      console.log('\nコマンド:');
      console.log('  list-sessions  - 利用可能なPDCAセッション一覧');
      console.log('  list-types     - 相談タイプ一覧');
      console.log('  start          - 相談セッション開始');
      consultation.listConsultationTypes();
  }
}

module.exports = ClaudeConsultationSystem;