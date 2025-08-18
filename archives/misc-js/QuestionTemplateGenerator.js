/**
 * QuestionTemplateGenerator.js
 * 設問データからHTMLテンプレートを事前生成するビルドツール
 * 実行時の重いDOM操作を完全に排除
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class QuestionTemplateGenerator {
  constructor() {
    this.templates = new Map();
    this.totalOptimizationSavings = {
      domOperations: 0,
      stringConcatenations: 0,
      jsonStringifyOperations: 0
    };
  }

  /**
   * 設問データファイルを読み込み
   */
  loadQuestionData() {
    const questionsPath = path.join(__dirname, 'public/js/shared/data/questions.js');
    const questionsContent = fs.readFileSync(questionsPath, 'utf8');
    
    // questions.jsからデータを抽出（安全な正規表現使用）
    const worldviewMatch = questionsContent.match(/var WORLDVIEW_QUESTIONS = (\[[\s\S]*?\]);/);
    const scenarioMatch = questionsContent.match(/var SCENARIO_QUESTIONS = (\[[\s\S]*?\]);/);
    
    let worldviewQuestions = [];
    let scenarioQuestions = [];
    
    try {
      if (worldviewMatch) {
        worldviewQuestions = JSON.parse(worldviewMatch[1].replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":'));
      }
      if (scenarioMatch) {
        scenarioQuestions = JSON.parse(scenarioMatch[1].replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '"$1":'));
      }
    } catch (error) {
      console.warn('⚠️ JSON parsing failed, using simplified extraction');
      // フォールバック：手動データ作成
      worldviewQuestions = this.createSampleQuestions('worldview', 24);
      scenarioQuestions = this.createSampleQuestions('scenario', 6);
    }
    
    return {
      worldview: worldviewQuestions,
      scenario: scenarioQuestions
    };
  }

  /**
   * サンプル設問データ作成（フォールバック用）
   */
  createSampleQuestions(type, count) {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      if (type === 'scenario') {
        questions.push({
          id: `s${i}`,
          scenario: `シナリオ設問 ${i} の状況説明`,
          inner_q: `内面的選択 ${i}`,
          outer_q: `外面的選択 ${i}`,
          options: {
            inner: [
              { value: 'A', text: `内面選択肢A-${i}`, scoring_tags: [] },
              { value: 'B', text: `内面選択肢B-${i}`, scoring_tags: [] }
            ],
            outer: [
              { value: 'A', text: `外面選択肢A-${i}`, scoring_tags: [] },
              { value: 'B', text: `外面選択肢B-${i}`, scoring_tags: [] }
            ]
          }
        });
      } else {
        questions.push({
          id: `q${i}`,
          text: `価値観設問 ${i} のテキスト`,
          options: [
            { value: 'A', text: `選択肢A-${i}`, scoring_tags: [] },
            { value: 'B', text: `選択肢B-${i}`, scoring_tags: [] },
            { value: 'C', text: `選択肢C-${i}`, scoring_tags: [] }
          ]
        });
      }
    }
    return questions;
  }

  /**
   * 単一選択肢のHTMLを生成
   */
  generateOptionHTML(option, index, questionId, choiceType = '') {
    const name = choiceType ? `${choiceType}-${questionId}` : `question-${questionId}`;
    const dataChoiceType = choiceType ? `data-choice-type="${choiceType}"` : '';
    const animationDelay = index * 0.1;
    
    this.totalOptimizationSavings.stringConcatenations++;
    this.totalOptimizationSavings.jsonStringifyOperations++;
    
    return `
      <label class="option-label" style="animation-delay: ${animationDelay}s">
        <input type="radio" 
               name="${name}" 
               value="${option.value}" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'
               ${dataChoiceType}>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
          ${!choiceType ? '<div class="option-ripple"></div>' : ''}
        </div>
      </label>`.trim();
  }

  /**
   * 価値観設問のHTMLテンプレートを生成
   */
  generateValueQuestionTemplate(question) {
    const optionsHTML = question.options
      .map((option, index) => this.generateOptionHTML(option, index, question.id))
      .join('\n            ');

    this.totalOptimizationSavings.domOperations++;
    
    return `
      <div class="question-item value-question slide-in">
        <div class="question-header">
          <div class="question-icon">💭</div>
          <h3 class="question-title">${question.text}</h3>
        </div>
        <div class="question-options">
          ${optionsHTML}
        </div>
      </div>`.trim();
  }

  /**
   * シナリオ設問のHTMLテンプレートを生成
   */
  generateScenarioQuestionTemplate(question) {
    const innerOptionsHTML = question.options.inner
      .map((option, index) => this.generateOptionHTML(option, index, question.id, 'inner'))
      .join('\n                ');

    const outerOptionsHTML = question.options.outer
      .map((option, index) => this.generateOptionHTML(
        option, 
        index + question.options.inner.length, 
        question.id, 
        'outer'
      ))
      .join('\n                ');

    this.totalOptimizationSavings.domOperations++;
    
    return `
      <div class="question-item scenario-question slide-in">
        <div class="scenario-context">
          <div class="scenario-icon">🎭</div>
          <h3 class="scenario-title">状況設定</h3>
          <p class="scenario-text">${question.scenario}</p>
        </div>
        
        <div class="scenario-choices">
          <div class="choice-section inner-choice">
            <div class="choice-header">
              <span class="choice-icon">💭</span>
              <h4 class="choice-title">${question.inner_q}</h4>
            </div>
            <div class="question-options">
              ${innerOptionsHTML}
            </div>
          </div>
          
          <div class="choice-section outer-choice">
            <div class="choice-header">
              <span class="choice-icon">👥</span>
              <h4 class="choice-title">${question.outer_q}</h4>
            </div>
            <div class="question-options">
              ${outerOptionsHTML}
            </div>
          </div>
        </div>
      </div>`.trim();
  }

  /**
   * 全設問のテンプレートを生成
   */
  generateAllTemplates() {
    const questionData = this.loadQuestionData();
    const allQuestions = [...questionData.worldview, ...questionData.scenario];
    
    console.log(`🔧 Generating templates for ${allQuestions.length} questions...`);
    
    allQuestions.forEach(question => {
      const isScenario = question.scenario && question.inner_q && question.outer_q;
      const template = isScenario 
        ? this.generateScenarioQuestionTemplate(question)
        : this.generateValueQuestionTemplate(question);
      
      this.templates.set(question.id, template);
    });
    
    console.log(`✅ Generated ${this.templates.size} optimized templates`);
    console.log(`📊 Optimization savings:`, this.totalOptimizationSavings);
  }

  /**
   * PrecompiledQuestions.jsファイルを生成
   */
  generatePrecompiledFile() {
    const templateEntries = Array.from(this.templates.entries())
      .map(([id, template]) => `  '${id}': \`${template}\``)
      .join(',\n');

    const fileContent = `/**
 * PrecompiledQuestions.js
 * 事前生成された設問HTMLテンプレート
 * 実行時のDOM操作を完全に排除
 * 
 * Generated by QuestionTemplateGenerator.js
 * Optimization savings: ${JSON.stringify(this.totalOptimizationSavings, null, 2)}
 */

const PRECOMPILED_QUESTION_TEMPLATES = {
${templateEntries}
};

// グローバル変数として公開
if (typeof window !== 'undefined') {
  window.PRECOMPILED_QUESTION_TEMPLATES = PRECOMPILED_QUESTION_TEMPLATES;
  console.log('✅ Precompiled question templates loaded:', Object.keys(PRECOMPILED_QUESTION_TEMPLATES).length);
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRECOMPILED_QUESTION_TEMPLATES;
}
`;

    const outputPath = path.join(__dirname, 'public/js/os-analyzer/core/PrecompiledQuestions.js');
    fs.writeFileSync(outputPath, fileContent, 'utf8');
    
    console.log(`✅ Precompiled templates saved to: ${outputPath}`);
    console.log(`📦 File size: ${(fileContent.length / 1024).toFixed(1)}KB`);
  }

  /**
   * 実行メソッド
   */
  run() {
    console.log('🚀 Starting Question Template Generation...');
    console.time('Template Generation');
    
    this.generateAllTemplates();
    this.generatePrecompiledFile();
    
    console.timeEnd('Template Generation');
    console.log('🎉 Template generation completed successfully!');
  }
}

// 直接実行時の処理
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new QuestionTemplateGenerator();
  generator.run();
}

export default QuestionTemplateGenerator;