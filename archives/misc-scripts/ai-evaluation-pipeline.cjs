// AI-オンリー評価パイプライン実装
// User Bot 1ペルソナ + UX Judge Bot 最小構成

const fs = require('fs');
const path = require('path');

// 設定
const CONFIG = {
  USER_BOT_TEMPERATURE: 0.7,
  JUDGE_BOT_TEMPERATURE: 0.2,
  SEED: 12345,
  TARGET_NV_AI: 65,
  LOGS_DIR: './logs'
};

// タスクデータ（9種類：3カテゴリ×3テキスト長）
const TASKS = [
  // 新規プロジェクト判断（3種）
  {
    id: "project-decision-short",
    input: "新しいWebサービス開発プロジェクトに参加するかどうか悩んでいます",
    category: "career"
  },
  {
    id: "project-decision-medium", 
    input: "現在の部署から新設のAI開発チームへの移籍の打診を受けています。技術的な挑戦はありますが、将来性と現在の安定性のどちらを取るべきか判断に迷っています",
    category: "career"
  },
  {
    id: "project-decision-long",
    input: "グローバル展開を目指すスタートアップから共同創業者としてのオファーを受けました。現在は大企業で安定した立場にありますが、20代最後のチャレンジとして起業への参画を検討しています。リスクは大きいですが、成功すれば大きなリターンが期待できます。家族もいる中での重大な決断です",
    category: "career"
  },
  
  // 人間関係（3種）
  {
    id: "relationship-short",
    input: "職場の同僚との関係性に悩んでいます",
    category: "relationship"  
  },
  {
    id: "relationship-medium",
    input: "長年の友人との価値観の違いが大きくなり、関係を続けるべきか距離を置くべか悩んでいます。お互いの成長方向が違ってきました",
    category: "relationship"
  },
  {
    id: "relationship-long", 
    input: "パートナーとの将来について真剣に考える時期になりました。結婚や同居を視野に入れていますが、お互いのキャリア志向や価値観、ライフスタイルの違いをどう調整していくか。また双方の家族との関係性も含めて、長期的な関係性をどう築いていくべきか模索しています",
    category: "relationship"
  },

  // キャリア変更（3種）
  {
    id: "career-change-short",
    input: "異業種への転職を考えています",  
    category: "career"
  },
  {
    id: "career-change-medium",
    input: "現在のエンジニア職からプロダクトマネージャーへのキャリアチェンジを検討中です。技術スキルを活かしながら、より事業寄りの仕事に挑戦したいと思っています",
    category: "career"
  },
  {
    id: "career-change-long",
    input: "15年間続けてきた金融業界から、社会課題解決を目的とするNPO分野への転職を検討しています。収入は大幅に下がる見込みですが、より意義のある仕事に従事したいという強い想いがあります。しかし住宅ローンや子供の教育費なども考慮すると、経済的リスクも無視できません。人生の後半戦をどう生きるかの重要な選択です",
    category: "career"
  }
];

// ペルソナ定義（6種類）
const PERSONAS = {
  "新人": {
    name: "新人",
    description: "入社1-2年目、技術経験浅い、慎重に判断したい",
    decision_style: "リスクを避けたい、チームワークを重視",
    expectations: "具体的で分かりやすい説明、安全な選択肢"
  },
  "実務マネージャ": {
    name: "実務マネージャ",
    description: "チーム管理経験5年以上、結果重視、効率を求める",
    decision_style: "ROI重視、迅速な判断、実用性優先",
    expectations: "数値・根拠に基づく判断材料、実行可能性"
  },
  "易経リテラシー高": {
    name: "易経リテラシー高",
    description: "易経の知識豊富、東洋哲学に精通、深い洞察を求める",
    decision_style: "象徴的意味を重視、長期的視点、調和を大切に",
    expectations: "古典に忠実な解釈、哲学的整合性、精神性"
  },
  "高ストレス": {
    name: "高ストレス",
    description: "プレッシャー下にある、不安感強い、確実性を求める",
    decision_style: "安心できる選択、リスク回避、慎重すぎる傾向",
    expectations: "不安解消、確実な成功パス、詳細な説明"
  },
  "時間圧迫": {
    name: "時間圧迫",
    description: "多忙、短時間で判断必要、効率重視",
    decision_style: "素早い決断、要点のみ重視、詳細は後回し",
    expectations: "簡潔な選択肢、即座に理解可能、行動指針明確"
  },
  "レッドチーム": {
    name: "レッドチーム",
    description: "懐疑的、批判的思考、システムの欠陥を探す",
    decision_style: "問題点指摘、代替案検討、根拠を疑う",
    expectations: "論理的一貫性、反証可能性、透明性"
  }
};

class UserBot {
  constructor(persona, temperature = CONFIG.USER_BOT_TEMPERATURE) {
    this.persona = persona;
    this.temperature = temperature;
  }

  async evaluateScenarios(task, scenarios) {
    const prompt = this.buildUserPrompt(task, scenarios);
    
    // 実際のAI呼び出しの代わりにモック応答（実装時はAI APIに置き換え）
    const mockResponse = this.generateMockResponse(task, scenarios);
    
    // JSONL形式でログ保存
    this.saveLog('user-bot', {
      timestamp: new Date().toISOString(),
      persona: this.persona.name,
      task_id: task.id,
      response: mockResponse,
      prompt: prompt
    });
    
    return mockResponse;
  }

  buildUserPrompt(task, scenarios) {
    return `
あなたは${this.persona.description}です。
${this.persona.decision_style}という判断傾向があります。

タスク: ${task.input}

以下の8つのシナリオから1つを選択し、その理由を説明してください：
${scenarios.map((s, i) => `${i+1}. ${s.id}: ${s.title}`).join('\n')}

出力形式（JSON）:
{
  "persona": "${this.persona.name}",
  "task_id": "${task.id}",
  "input_text": "${task.input}",
  "picked_scenario_id": "選択したシナリオのID",
  "why": ["理由1", "理由2", "理由3"],
  "conflicts_or_questions": ["不明な点があれば"],
  "usefulness_rating": 1-5の数値,
  "time_to_decision_sec": 推定秒数
}
`;
  }

  generateMockResponse(task, scenarios) {
    // ペルソナ別の反応パターン
    const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const personaResponses = this.getPersonaSpecificResponse(task);
    
    return {
      persona: this.persona.name,
      task_id: task.id,
      input_text: task.input,
      picked_scenario_id: selectedScenario.id,
      why: personaResponses.why,
      conflicts_or_questions: personaResponses.conflicts,
      usefulness_rating: personaResponses.rating,
      time_to_decision_sec: personaResponses.time
    };
  }

  getPersonaSpecificResponse(task) {
    const personaName = this.persona.name;
    
    switch (personaName) {
      case "新人":
        return {
          why: ["この選択肢が最も安全そうだから", "チームとの協調を重視できるから", "段階的に進められそうだから"],
          conflicts: ["他の選択肢との具体的な違いが分からない", "失敗した時のリスクが心配"],
          rating: Math.floor(Math.random() * 2) + 3, // 3-4
          time: Math.floor(Math.random() * 60) + 120 // 120-180秒（慎重）
        };
        
      case "実務マネージャ":
        return {
          why: ["ROIが明確で実用性が高い", "実行可能性が具体的", "リスクとリターンのバランスが良い"],
          conflicts: ["数値的根拠がもう少し欲しい", "実装スケジュールが曖昧"],
          rating: Math.floor(Math.random() * 3) + 3, // 3-5
          time: Math.floor(Math.random() * 30) + 60 // 60-90秒（効率重視）
        };
        
      case "易経リテラシー高":
        return {
          why: ["卦の象徴的意味と合致している", "陰陽のバランスが取れている", "長期的な調和を重視している"],
          conflicts: ["古典易経との整合性に疑問", "現代的解釈が表面的"],
          rating: Math.floor(Math.random() * 2) + 2, // 2-3（厳格な評価）
          time: Math.floor(Math.random() * 90) + 150 // 150-240秒（深く考える）
        };
        
      case "高ストレス":
        return {
          why: ["最もリスクが少ない選択", "失敗の可能性が低い", "安心して進められる"],
          conflicts: ["本当に大丈夫か不安", "他に見落としはないか", "失敗した時の対策は？"],
          rating: Math.floor(Math.random() * 2) + 2, // 2-3（不安で低評価）
          time: Math.floor(Math.random() * 120) + 180 // 180-300秒（迷いが多い）
        };
        
      case "時間圧迫":
        return {
          why: ["シンプルで分かりやすい", "すぐに行動に移せる", "効率的な選択"],
          conflicts: ["もっと簡潔にまとめてほしい"],
          rating: Math.floor(Math.random() * 2) + 4, // 4-5（時間がないので満足）
          time: Math.floor(Math.random() * 30) + 30 // 30-60秒（急いでいる）
        };
        
      case "レッドチーム":
        return {
          why: ["論理的一貫性がある部分を評価", "根拠が一部明確", "批判的検討に耐える要素がある"],
          conflicts: ["根拠が不十分", "反対意見への配慮なし", "バイアスの可能性", "代替案の検討不足"],
          rating: Math.floor(Math.random() * 2) + 1, // 1-2（厳しい評価）
          time: Math.floor(Math.random() * 60) + 90 // 90-150秒（批判的分析）
        };
        
      default:
        return {
          why: ["選択理由1", "選択理由2", "選択理由3"],
          conflicts: ["疑問点"],
          rating: 3,
          time: 120
        };
    }
  }

  saveLog(type, data) {
    const logFile = path.join(CONFIG.LOGS_DIR, `${type}-${new Date().getDate().toString().padStart(2, '0')}.jsonl`);
    fs.appendFileSync(logFile, JSON.stringify(data) + '\n');
  }
}

class UXJudgeBot {
  constructor(temperature = CONFIG.JUDGE_BOT_TEMPERATURE) {
    this.temperature = temperature;
  }

  async evaluateUserExperience(userResponse, scenarios) {
    const prompt = this.buildJudgePrompt(userResponse, scenarios);
    
    // 実際のAI呼び出しの代わりにモック応答
    const mockJudgment = this.generateMockJudgment(userResponse, scenarios);
    
    // ログ保存
    this.saveLog('ux-judge', {
      timestamp: new Date().toISOString(),
      user_response_id: `${userResponse.persona}-${userResponse.task_id}`,
      judgment: mockJudgment,
      prompt: prompt
    });
    
    return mockJudgment;
  }

  buildJudgePrompt(userResponse, scenarios) {
    return `
以下のUser Bot応答を、UXの観点から評価してください：

User応答:
- ペルソナ: ${userResponse.persona}
- 選択: ${userResponse.picked_scenario_id}
- 満足度: ${userResponse.usefulness_rating}/5
- 理由: ${userResponse.why.join(', ')}
- 疑問: ${userResponse.conflicts_or_questions.join(', ')}

評価観点:
1. scenario_quality: シナリオの品質・差別化
2. actionability: 行動可能性・具体性
3. clarity: 分かりやすさ・理解しやすさ

出力形式（JSON）:
{
  "scores": {
    "scenario_quality": 0-5,
    "actionability": 0-5, 
    "clarity": 0-5
  },
  "blocking_issues": ["重大な問題"],
  "high_impact_fixes": [{
    "area": "UI/Copy/Logic",
    "change": "改善内容",
    "example": "具体例"
  }]
}
`;
  }

  generateMockJudgment(userResponse, scenarios) {
    // 満足度に基づいて判定を調整
    const baseLine = userResponse.usefulness_rating >= 4 ? 4 : 3;
    
    return {
      scores: {
        scenario_quality: Math.min(5, baseLine + Math.floor(Math.random() * 2)),
        actionability: Math.min(5, baseLine + Math.floor(Math.random() * 2)),
        clarity: Math.min(5, baseLine + Math.floor(Math.random() * 2))
      },
      blocking_issues: userResponse.usefulness_rating < 3 ? 
        ["シナリオ間の差別化不足", "行動指針が曖昧"] : [],
      high_impact_fixes: [{
        area: "UI",
        change: "Top3のみ先出し表示",
        example: "「上位3つの選択肢」→「さらに表示」で残り5つ展開"
      }, {
        area: "Copy",
        change: "非決定論表現の徹底",
        example: "「〜すべきです」→「〜という選択肢があります」"
      }]
    };
  }

  saveLog(type, data) {
    const logFile = path.join(CONFIG.LOGS_DIR, `${type}-${new Date().getDate().toString().padStart(2, '0')}.jsonl`);
    fs.appendFileSync(logFile, JSON.stringify(data) + '\n');
  }
}

class Aggregator {
  constructor() {
    this.results = [];
  }

  async runEvaluation(iterations = 1) {
    const totalEvaluations = Object.keys(PERSONAS).length * TASKS.length * iterations;
    console.log(`=== AI-オンリー評価パイプライン実行 ===`);
    console.log(`6ペルソナ × 9タスク × ${iterations}回 = ${totalEvaluations}評価`);
    
    // モックシナリオデータ
    const scenarios = this.getMockScenarios();
    let evaluationCount = 0;
    
    for (let iteration = 1; iteration <= iterations; iteration++) {
      console.log(`\n--- Iteration ${iteration}/${iterations} ---`);
      
      for (const personaName of Object.keys(PERSONAS)) {
        console.log(`\n${personaName}ペルソナ:`);
        
        for (const task of TASKS) {
          evaluationCount++;
          console.log(`  [${evaluationCount}/${totalEvaluations}] ${task.id}`);
          
          // User Bot実行
          const userBot = new UserBot(PERSONAS[personaName]);
          const userResponse = await userBot.evaluateScenarios(task, scenarios);
          
          // Judge Bot実行  
          const judgeBot = new UXJudgeBot();
          const judgment = await judgeBot.evaluateUserExperience(userResponse, scenarios);
          
          console.log(`    → ${userResponse.picked_scenario_id}, 満足度${userResponse.usefulness_rating}/5, 行動可能性${judgment.scores.actionability}/5`);
          
          this.results.push({
            iteration: iteration,
            persona: personaName,
            task_id: task.id,
            user: userResponse,
            judge: judgment,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return this.calculateMetrics();
  }

  calculateMetrics() {
    const userResponses = this.results.map(r => r.user);
    const judgeResponses = this.results.map(r => r.judge);
    
    // NV_AI計算（★3以上の比率）
    const satisfiedUsers = userResponses.filter(r => r.usefulness_rating >= 3);
    const nvAI = Math.round((satisfiedUsers.length / userResponses.length) * 100);
    
    // Actionability平均
    const avgActionability = judgeResponses.reduce((sum, j) => sum + j.scores.actionability, 0) / judgeResponses.length;
    
    // ペルソナ別分析
    const personaAnalysis = {};
    Object.keys(PERSONAS).forEach(personaName => {
      const personaResults = this.results.filter(r => r.persona === personaName);
      const personaUserResponses = personaResults.map(r => r.user);
      const personaSatisfied = personaUserResponses.filter(r => r.usefulness_rating >= 3);
      
      personaAnalysis[personaName] = {
        nv_ai: Math.round((personaSatisfied.length / personaUserResponses.length) * 100),
        avg_satisfaction: Math.round((personaUserResponses.reduce((sum, r) => sum + r.usefulness_rating, 0) / personaUserResponses.length) * 10) / 10,
        sample_size: personaUserResponses.length
      };
    });
    
    // 合否判定
    const pass = nvAI >= CONFIG.TARGET_NV_AI && avgActionability >= 4.0;
    
    const metrics = {
      nv_ai: nvAI,
      avg_actionability: Math.round(avgActionability * 10) / 10,
      avg_satisfaction: Math.round((userResponses.reduce((sum, r) => sum + r.usefulness_rating, 0) / userResponses.length) * 10) / 10,
      persona_analysis: personaAnalysis,
      pass: pass,
      target_nv_ai: CONFIG.TARGET_NV_AI,
      total_evaluations: this.results.length,
      timestamp: new Date().toISOString()
    };
    
    console.log(`\n=== 評価結果 ===`);
    console.log(`総合 NV_AI: ${metrics.nv_ai}% (目標: ${CONFIG.TARGET_NV_AI}%)`);
    console.log(`行動可能性: ${metrics.avg_actionability}/5.0 (目標: ≥4.0)`);
    console.log(`総評価数: ${metrics.total_evaluations}`);
    
    console.log(`\n=== ペルソナ別分析 ===`);
    Object.entries(personaAnalysis).forEach(([persona, analysis]) => {
      const status = analysis.nv_ai >= CONFIG.TARGET_NV_AI ? '✅' : '❌';
      console.log(`${persona}: NV_AI ${analysis.nv_ai}%, 満足度 ${analysis.avg_satisfaction}/5.0 ${status}`);
    });
    
    console.log(`\n総合判定: ${pass ? '✅ PASS' : '❌ FAIL'}`);
    
    // 結果保存
    this.saveReport(metrics);
    
    return metrics;
  }

  getMockScenarios() {
    return [
      { id: "FUT-001", title: "積極的にプロジェクトをリードする" },
      { id: "FUT-002", title: "チームメンバーとして着実に貢献する" },
      { id: "FUT-003", title: "技術習得に集中しながら参加する" },
      { id: "FUT-004", title: "リスクを慎重に評価してから決定する" },
      { id: "FUT-005", title: "他の案件と並行して検討する" },
      { id: "FUT-006", title: "短期間の試験参加で様子を見る" },
      { id: "FUT-007", title: "メンター制度を活用して参加する" },
      { id: "FUT-008", title: "参加を見送って他の機会を待つ" }
    ];
  }

  saveReport(metrics) {
    const reportFile = path.join(CONFIG.LOGS_DIR, `daily-report-${new Date().getDate().toString().padStart(2, '0')}.json`);
    const report = {
      ...metrics,
      details: this.results,
      config: CONFIG
    };
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📊 レポート保存: ${reportFile}`);
  }
}

// 実行
async function main() {
  // ログディレクトリ確保
  if (!fs.existsSync(CONFIG.LOGS_DIR)) {
    fs.mkdirSync(CONFIG.LOGS_DIR, { recursive: true });
  }
  
  const aggregator = new Aggregator();
  const metrics = await aggregator.runEvaluation(1); // 1回実行（6ペルソナ×9タスク=54評価）
  
  return metrics;
}

if (require.main === module) {
  main().then(metrics => {
    process.exit(metrics.pass ? 0 : 1);
  });
}

module.exports = { UserBot, UXJudgeBot, Aggregator, CONFIG };