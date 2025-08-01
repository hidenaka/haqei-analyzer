/**
 * 手動テンプレート生成スクリプト
 * questions.jsの実際のデータを読み込んでPrecompiledQuestionsを再生成
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

class ManualTemplateGenerator {
  constructor() {
    this.templates = {};
  }

  // questions.jsを読み込んで評価
  loadQuestions() {
    const questionsPath = path.join(__dirname, 'public/js/shared/data/questions.js');
    const questionsContent = fs.readFileSync(questionsPath, 'utf8');
    
    // サンドボックス環境で実行
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(questionsContent, sandbox);
    
    return {
      worldview: sandbox.WORLDVIEW_QUESTIONS || [],
      scenario: sandbox.SCENARIO_QUESTIONS || []
    };
  }

  // 価値観設問のHTMLテンプレート生成
  generateValueQuestionTemplate(question) {
    const optionsHTML = question.options
      .map((option, index) => `
      <label class="option-label" style="animation-delay: ${index * 0.1}s">
        <input type="radio" 
               name="question-${question.id}" 
               value="${option.value}" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'>
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
          <div class="option-ripple"></div>
        </div>
      </label>`)
      .join('');

    return `<div class="question-item value-question slide-in">
        <div class="question-header">
          <div class="question-icon">💭</div>
          <h3 class="question-title">${question.text || question.title}</h3>
        </div>
        <div class="question-options">
          ${optionsHTML}
        </div>
      </div>`;
  }

  // シナリオ設問のHTMLテンプレート生成
  generateScenarioQuestionTemplate(question) {
    const innerOptionsHTML = (question.options.inner || [])
      .map((option, index) => `
      <label class="option-label" style="animation-delay: ${index * 0.1}s">
        <input type="radio" 
               name="inner-${question.id}" 
               value="${option.value}" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'
               data-choice-type="inner">
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
        </div>
      </label>`)
      .join('');

    const outerOptionsHTML = (question.options.outer || [])
      .map((option, index) => `
      <label class="option-label" style="animation-delay: ${(index + question.options.inner.length) * 0.1}s">
        <input type="radio" 
               name="outer-${question.id}" 
               value="${option.value}" 
               data-scoring='${JSON.stringify(option.scoring_tags || [])}'
               data-choice-type="outer">
        <div class="option-content">
          <div class="option-indicator"></div>
          <span class="option-text">${option.text}</span>
        </div>
      </label>`)
      .join('');

    return `<div class="question-item scenario-question slide-in">
        <div class="scenario-context">
          <div class="scenario-icon">🎭</div>
          <h3 class="scenario-title">${question.title || 'シナリオ設問'}</h3>
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
      </div>`;
  }

  generateTemplates() {
    const questions = this.loadQuestions();
    console.log(`🔧 Loaded ${questions.worldview.length} worldview questions`);
    console.log(`🔧 Loaded ${questions.scenario.length} scenario questions`);

    // 価値観設問のテンプレート生成
    questions.worldview.forEach(question => {
      const template = this.generateValueQuestionTemplate(question);
      this.templates[question.id] = template;
    });

    // シナリオ設問のテンプレート生成
    questions.scenario.forEach(question => {
      const template = this.generateScenarioQuestionTemplate(question);
      this.templates[question.id] = template;
    });

    console.log(`✅ Generated ${Object.keys(this.templates).length} templates`);
  }

  saveTemplates() {
    const templateEntries = Object.entries(this.templates)
      .map(([id, template]) => `  '${id}': \`${template}\``)
      .join(',\n');

    const fileContent = `/**
 * PrecompiledQuestions.js
 * 事前生成された設問HTMLテンプレート
 * 実行時のDOM操作を完全に排除
 * 
 * Generated by regenerate-templates-manual.cjs
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
    
    console.log(`✅ Saved to: ${outputPath}`);
    console.log(`📦 File size: ${(fileContent.length / 1024).toFixed(1)}KB`);
  }

  run() {
    console.log('🚀 Starting manual template generation...');
    this.generateTemplates();
    this.saveTemplates();
    console.log('🎉 Template generation completed!');
  }
}

// 実行
const generator = new ManualTemplateGenerator();
generator.run();