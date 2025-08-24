/**
 * Future Branching Core System
 * 未来分岐図コアシステム
 * Based on FUTURE_BRANCHING_VISUAL_DESIGN_20250807.md
 */

class FutureBranchingSystem {
  constructor() {
    
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
    this.currentState = null;
    this.choices = [];
    this.outcomes = [];
    this.selectedChoice = null;
    this.layoutType = 'classic'; // classic, timeline, radial
    this.animationEnabled = true;
    this.votingData = {};
    this.personaTemplates = this.initPersonaTemplates();
  }

  /**
   * Initialize persona templates
   */
  initPersonaTemplates() {
    return {
      careerSeeker: {
        id: 'career-seeker',
        name: 'キャリア迷子（25-35歳）',
        icon: '💼',
        scenarios: [
          {
            current: '毎朝満員電車に揺られて、本当にこのままでいいの？',
            choices: [
              { type: 'safe', label: '現職継続', outcome: '安定だけど成長停滞' },
              { type: 'adventure', label: '転職挑戦', outcome: 'リスクあるけど新たな可能性' },
              { type: 'creative', label: '独立起業', outcome: '最大リスク、最大リターン' }
            ]
          }
        ]
      },
      loveWorrier: {
        id: 'love-worrier',
        name: '恋愛悩み（20-30歳）',
        icon: '💕',
        scenarios: [
          {
            current: '彼との関係、このまま続けるべき？',
            choices: [
              { type: 'safe', label: '関係継続', outcome: '安定だけどマンネリ' },
              { type: 'adventure', label: '距離を置く', outcome: '客観視で関係改善の可能性' },
              { type: 'creative', label: '別れを選ぶ', outcome: '痛みの後に新たな出会い' }
            ]
          }
        ]
      },
      healthSeeker: {
        id: 'health-seeker',
        name: '健康改善希望（30-50歳）',
        icon: '🌱',
        scenarios: [
          {
            current: 'ストレスと疲労で体調不良が続いている',
            choices: [
              { type: 'safe', label: '生活習慣改善', outcome: '徐々に体調回復' },
              { type: 'adventure', label: '転職・環境変化', outcome: 'ストレス源から解放' },
              { type: 'creative', label: 'ライフスタイル革命', outcome: '人生全体の質向上' }
            ]
          }
        ]
      }
    };
  }

  /**
   * Initialize the branching system
   */
  async init(container) {
    this.container = container;
    console.log('🌟 Initializing Future Branching System...');
    
    try {
      // Set up initial state
      this.setupContainer();
      this.bindEvents();
      
      // Load saved data if exists
      await this.loadSavedData();
      
      console.log('✅ Future Branching System initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Setup container structure
   */
  setupContainer() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    this.container.classList.add('future-branching-container');
    this.container.innerHTML = `
      <div class="branching-header mb-4">
        <h2 class="text-2xl font-bold text-center mb-2">🌟 未来分岐ビジュアライザー</h2>
        <p class="text-center text-secondary">あなたの選択が導く可能性を可視化</p>
      </div>
      
      <div class="layout-selector mb-4 text-center">
        <button class="layout-btn" data-layout="classic">クラシック</button>
        <button class="layout-btn" data-layout="timeline">タイムライン</button>
        <button class="layout-btn" data-layout="radial">放射状</button>
      </div>
      
      <div class="persona-selector mb-4 text-center">
        <span class="text-sm text-secondary mr-2">ペルソナ選択:</span>
        <select id="persona-select" class="haqei-input inline-block w-auto">
          <option value="">カスタム</option>
          <option value="career-seeker">キャリア迷子</option>
          <option value="love-worrier">恋愛悩み</option>
          <option value="health-seeker">健康改善</option>
        </select>
      </div>
      
      <div id="branching-diagram" class="branching-diagram layout-classic">
        <!-- Dynamic content will be inserted here -->
      </div>
      
      <div class="voting-section mt-4" style="display: none;">
        <h3 class="text-lg font-semibold mb-2">みんなの選択</h3>
        <div id="voting-results"></div>
      </div>
    `;

    // Style layout buttons
    const layoutBtns = this.container.querySelectorAll('.layout-btn');
    layoutBtns.forEach(btn => {
      btn.style.cssText = `
        background: #2563eb;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        margin: 0 0.25rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#1d4ed8';
        btn.style.transform = 'translateY(-2px)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#2563eb';
        btn.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Layout selector
    const layoutBtns = this.container.querySelectorAll('.layout-btn');
    layoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.changeLayout(e.target.dataset.layout);
      });
    });

    // Persona selector
    const personaSelect = this.container.querySelector('#persona-select');
    if (personaSelect) {
      personaSelect.addEventListener('change', (e) => {
        this.loadPersonaScenario(e.target.value);
      });
    }
  }

  /**
   * Create branching visualization
   */
  createBranching(data) {
    const diagram = this.container.querySelector('#branching-diagram');
    if (!diagram) return;

    this.currentState = data.current;
    this.choices = data.choices || [];
    this.outcomes = data.outcomes || [];

    switch (this.layoutType) {
      case 'timeline':
        this.renderTimelineLayout(diagram);
        break;
      case 'radial':
        this.renderRadialLayout(diagram);
        break;
      default:
        this.renderClassicLayout(diagram);
    }

    // Apply animations
    if (this.animationEnabled) {
      this.applyAnimations();
    }
  }

  /**
   * Render classic layout
   */
  renderClassicLayout(diagram) {
    diagram.className = 'branching-diagram layout-classic';
    
    let html = `
      <!-- Current State -->
      <div class="current-row">
        <div class="branching-node current-state animate-current">
          <span class="node-icon icon-current"></span>
          <h3 class="text-lg font-semibold mb-2">現在の状況</h3>
          <p>${this.currentState || 'あなたの現在の状況を入力してください'}</p>
        </div>
      </div>
      
      <!-- Connection Lines -->
      <div style="height: 40px; position: relative;">
        <svg width="100%" height="40" style="position: absolute; top: 0; left: 0;">
          <line x1="50%" y1="0" x2="16.66%" y2="40" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
          <line x1="50%" y1="0" x2="50%" y2="40" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
          <line x1="50%" y1="0" x2="83.33%" y2="40" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        </svg>
      </div>
      
      <!-- Choices -->
      <div class="choices-row">`;
    
    this.choices.forEach((choice, index) => {
      const choiceClass = this.getChoiceClass(choice.type);
      const iconClass = this.getIconClass(choice.type);
      
      html += `
        <div class="branching-node ${choiceClass} animate-choice choice-selector" data-choice="${index}">
          <span class="node-icon ${iconClass}"></span>
          <h4 class="font-semibold mb-1">${choice.label}</h4>
          <p class="text-sm">${choice.description || ''}</p>
          ${this.votingData[index] ? `
            <div class="voting-display">${this.votingData[index]}%</div>
            <div class="voting-bar">
              <div class="voting-bar-fill" style="width: ${this.votingData[index]}%"></div>
            </div>
          ` : ''}
        </div>`;
    });
    
    html += `</div>
      
      <!-- Outcomes -->
      <div class="outcomes-row mt-4">`;
    
    this.outcomes.forEach((outcome, index) => {
      const outcomeClass = this.getOutcomeClass(outcome.type);
      const iconClass = outcome.icon || 'icon-success';
      
      html += `
        <div class="branching-node ${outcomeClass} animate-outcome" style="animation-delay: ${0.5 + index * 0.1}s">
          <span class="node-icon ${iconClass}"></span>
          <h4 class="font-semibold mb-1">${outcome.label}</h4>
          <p class="text-sm">${outcome.description}</p>
          <div class="text-xs mt-2 opacity-75">${outcome.timeframe || '3ヶ月後'}</div>
        </div>`;
    });
    
    html += `</div>`;
    
    diagram.innerHTML = html;
    
    // Add choice selection events
    this.bindChoiceEvents();
  }

  /**
   * Render timeline layout
   */
  renderTimelineLayout(diagram) {
    diagram.className = 'branching-diagram layout-timeline';
    
    const stages = [
      { label: '現在', nodes: [this.currentState] },
      { label: '選択', nodes: this.choices },
      { label: '1ヶ月後', nodes: this.getOutcomesForTime('1month') },
      { label: '3ヶ月後', nodes: this.getOutcomesForTime('3months') },
      { label: '1年後', nodes: this.getOutcomesForTime('1year') }
    ];
    
    let html = '';
    
    stages.forEach((stage, stageIndex) => {
      html += `
        <div class="timeline-stage">
          <div class="timeline-label">${stage.label}</div>
          <div class="timeline-choices">`;
      
      stage.nodes.forEach((node, nodeIndex) => {
        if (typeof node === 'string') {
          // Current state
          html += `
            <div class="branching-node current-state" style="animation-delay: ${stageIndex * 0.2}s">
              <p>${node}</p>
            </div>`;
        } else {
          // Choices or outcomes
          const nodeClass = node.type ? this.getChoiceClass(node.type) : 'outcome-neutral';
          html += `
            <div class="branching-node ${nodeClass} animate-choice" style="animation-delay: ${stageIndex * 0.2 + nodeIndex * 0.1}s">
              <h4 class="font-semibold">${node.label}</h4>
              <p class="text-sm">${node.description || ''}</p>
            </div>`;
        }
      });
      
      html += `</div></div>`;
    });
    
    diagram.innerHTML = html;
  }

  /**
   * Render radial layout
   */
  renderRadialLayout(diagram) {
    diagram.className = 'branching-diagram layout-radial';
    
    let html = `
      <!-- Center Node -->
      <div class="center-node">
        <div class="branching-node current-state animate-current">
          <span class="node-icon icon-current"></span>
          <h3 class="text-lg font-semibold">現在</h3>
          <p class="text-sm">${this.currentState}</p>
        </div>
      </div>`;
    
    // Add choice nodes in radial positions
    this.choices.forEach((choice, index) => {
      const angle = (index * 120) * Math.PI / 180;
      const radius = 200;
      const x = Math.cos(angle - Math.PI/2) * radius;
      const y = Math.sin(angle - Math.PI/2) * radius;
      
      const choiceClass = this.getChoiceClass(choice.type);
      const iconClass = this.getIconClass(choice.type);
      
      html += `
        <div class="choice-node animate-choice" style="transform: translate(${x}px, ${y}px); animation-delay: ${index * 0.2}s">
          <div class="branching-node ${choiceClass} choice-selector" data-choice="${index}">
            <span class="node-icon ${iconClass}"></span>
            <h4 class="font-semibold">${choice.label}</h4>
          </div>
        </div>`;
    });
    
    diagram.innerHTML = html;
  }

  /**
   * Get choice class based on type
   */
  getChoiceClass(type) {
    const classMap = {
      'safe': 'choice-safe',
      'adventure': 'choice-adventure',
      'creative': 'choice-creative'
    };
    return classMap[type] || 'choice-safe';
  }

  /**
   * Get icon class based on type
   */
  getIconClass(type) {
    const iconMap = {
      'safe': 'icon-safe',
      'adventure': 'icon-adventure',
      'creative': 'icon-creative'
    };
    return iconMap[type] || 'icon-current';
  }

  /**
   * Get outcome class based on type
   */
  getOutcomeClass(type) {
    const classMap = {
      'positive': 'outcome-positive',
      'neutral': 'outcome-neutral',
      'challenging': 'outcome-challenging'
    };
    return classMap[type] || 'outcome-neutral';
  }

  /**
   * Apply animations
   */
  applyAnimations() {
    const nodes = this.container.querySelectorAll('.branching-node');
    nodes.forEach((node, index) => {
      node.style.opacity = '0';
      setTimeout(() => {
        node.style.opacity = '1';
        node.classList.add('fade-in');
      }, index * 100);
    });
  }

  /**
   * Bind choice selection events
   */
  bindChoiceEvents() {
    const choices = this.container.querySelectorAll('.choice-selector');
    choices.forEach(choice => {
      choice.addEventListener('click', (e) => {
        this.selectChoice(e.currentTarget.dataset.choice);
      });
    });
  }

  /**
   * Select a choice
   */
  selectChoice(choiceIndex) {
    const choices = this.container.querySelectorAll('.choice-selector');
    
    choices.forEach((choice, index) => {
      if (index === parseInt(choiceIndex)) {
        choice.classList.add('selected');
        choice.classList.remove('unselected');
        this.selectedChoice = index;
      } else {
        choice.classList.remove('selected');
        choice.classList.add('unselected');
      }
    });
    
    // Trigger outcome highlight
    this.highlightOutcome(choiceIndex);
    
    // Update voting (mock)
    this.updateVoting(choiceIndex);
  }

  /**
   * Highlight outcome based on choice
   */
  highlightOutcome(choiceIndex) {
    const outcomes = this.container.querySelectorAll('.outcomes-row .branching-node');
    outcomes.forEach((outcome, index) => {
      if (index === parseInt(choiceIndex)) {
        outcome.classList.add('pulse-effect');
      } else {
        outcome.classList.remove('pulse-effect');
      }
    });
  }

  /**
   * Change layout type
   */
  changeLayout(type) {
    this.layoutType = type;
    
    // Update button states
    const buttons = this.container.querySelectorAll('.layout-btn');
    buttons.forEach(btn => {
      if (btn.dataset.layout === type) {
        btn.style.background = '#1d4ed8';
      } else {
        btn.style.background = '#2563eb';
      }
    });
    
    // Re-render with new layout
    if (this.currentState) {
      this.createBranching({
        current: this.currentState,
        choices: this.choices,
        outcomes: this.outcomes
      });
    }
  }

  /**
   * Load persona scenario
   */
  loadPersonaScenario(personaId) {
    if (!personaId) {
      // Custom scenario
      this.showCustomInput();
      return;
    }
    
    const persona = this.personaTemplates[personaId];
    if (persona && persona.scenarios[0]) {
      const scenario = persona.scenarios[0];
      
      // Transform choices to our format
      const choices = scenario.choices.map(c => ({
        type: c.type,
        label: c.label,
        description: c.outcome
      }));
      
      // Create outcomes based on choices
      const outcomes = scenario.choices.map(c => ({
        type: c.type === 'safe' ? 'neutral' : c.type === 'creative' ? 'positive' : 'challenging',
        label: c.outcome,
        description: this.generateOutcomeDescription(c.type),
        timeframe: '3ヶ月後'
      }));
      
      this.createBranching({
        current: scenario.current,
        choices: choices,
        outcomes: outcomes
      });
      
      // Show voting section
      this.showVotingSection();
    }
  }

  /**
   * Generate outcome description
   */
  generateOutcomeDescription(type) {
    const descriptions = {
      'safe': '着実な前進。リスクは最小限に抑えられました。',
      'adventure': '新しい挑戦により、予想外の成長を遂げました。',
      'creative': '創造的な選択が、大きな変革をもたらしました。'
    };
    return descriptions[type] || '';
  }

  /**
   * Show custom input
   */
  showCustomInput() {
    const diagram = this.container.querySelector('#branching-diagram');
    diagram.innerHTML = `
      <div class="custom-input-section">
        <h3 class="text-lg font-semibold mb-3">カスタムシナリオ作成</h3>
        
        <div class="mb-3">
          <label class="block text-sm mb-1">現在の状況</label>
          <textarea id="custom-current" class="haqei-input" rows="3" 
            placeholder="例: 毎日同じルーティンで、何か変化が欲しいと感じている"></textarea>
        </div>
        
        <div class="mb-3">
          <label class="block text-sm mb-1">選択肢1 (安全)</label>
          <input type="text" id="custom-choice-1" class="haqei-input" 
            placeholder="例: 現状維持">
        </div>
        
        <div class="mb-3">
          <label class="block text-sm mb-1">選択肢2 (挑戦)</label>
          <input type="text" id="custom-choice-2" class="haqei-input" 
            placeholder="例: 新しいスキル習得">
        </div>
        
        <div class="mb-3">
          <label class="block text-sm mb-1">選択肢3 (創造)</label>
          <input type="text" id="custom-choice-3" class="haqei-input" 
            placeholder="例: 独自のプロジェクト開始">
        </div>
        
        <button id="create-custom" class="haqei-button">シナリオ作成</button>
      </div>
    `;
    
    // Bind create button
    const createBtn = diagram.querySelector('#create-custom');
    createBtn.addEventListener('click', () => {
      this.createCustomScenario();
    });
  }

  /**
   * Create custom scenario
   */
  createCustomScenario() {
    const current = document.getElementById('custom-current').value;
    const choice1 = document.getElementById('custom-choice-1').value;
    const choice2 = document.getElementById('custom-choice-2').value;
    const choice3 = document.getElementById('custom-choice-3').value;
    
    if (!current || !choice1 || !choice2 || !choice3) {
      alert('すべての項目を入力してください');
      return;
    }
    
    const choices = [
      { type: 'safe', label: choice1, description: '安定した選択' },
      { type: 'adventure', label: choice2, description: '挑戦的な選択' },
      { type: 'creative', label: choice3, description: '創造的な選択' }
    ];
    
    const outcomes = [
      { type: 'neutral', label: '着実な成果', description: '予想通りの結果が得られました', timeframe: '3ヶ月後' },
      { type: 'challenging', label: '成長の機会', description: '困難もありますが、大きく成長しました', timeframe: '3ヶ月後' },
      { type: 'positive', label: '大きな成功', description: '想像以上の成果を達成しました', timeframe: '3ヶ月後' }
    ];
    
    this.createBranching({
      current: current,
      choices: choices,
      outcomes: outcomes
    });
    
    this.showVotingSection();
  }

  /**
   * Show voting section
   */
  showVotingSection() {
    const votingSection = this.container.querySelector('.voting-section');
    if (votingSection) {
      votingSection.style.display = 'block';
      this.initializeVoting();
    }
  }

  /**
   * Initialize voting
   */
  initializeVoting() {
    // Mock voting data
    this.votingData = {
      0: Math.floor(this.rng.next() * 40) + 20,
      1: Math.floor(this.rng.next() * 40) + 20,
      2: Math.floor(this.rng.next() * 40) + 20
    };
    
    // Normalize to 100%
    const total = Object.values(this.votingData).reduce((a, b) => a + b, 0);
    Object.keys(this.votingData).forEach(key => {
      this.votingData[key] = Math.round((this.votingData[key] / total) * 100);
    });
    
    this.updateVotingDisplay();
  }

  /**
   * Update voting display
   */
  updateVotingDisplay() {
    const votingResults = this.container.querySelector('#voting-results');
    if (!votingResults) return;
    
    let html = '<div class="voting-results-grid">';
    
    this.choices.forEach((choice, index) => {
      const percentage = this.votingData[index] || 0;
      html += `
        <div class="voting-item mb-2">
          <div class="flex justify-between mb-1">
            <span>${choice.label}</span>
            <span class="font-semibold">${percentage}%</span>
          </div>
          <div class="voting-bar">
            <div class="voting-bar-fill" style="width: ${percentage}%"></div>
          </div>
        </div>`;
    });
    
    html += '</div>';
    votingResults.innerHTML = html;
  }

  /**
   * Update voting (mock)
   */
  updateVoting(choiceIndex) {
    // Simulate vote
    this.votingData[choiceIndex] = (this.votingData[choiceIndex] || 0) + 1;
    
    // Recalculate percentages
    const total = Object.values(this.votingData).reduce((a, b) => a + b, 0);
    Object.keys(this.votingData).forEach(key => {
      this.votingData[key] = Math.round((this.votingData[key] / total) * 100);
    });
    
    this.updateVotingDisplay();
  }

  /**
   * Get outcomes for specific time
   */
  getOutcomesForTime(time) {
    // Mock data for timeline
    const timeOutcomes = {
      '1month': [
        { label: '初期変化', description: '小さな変化が始まる' },
        { label: '適応期', description: '新しい環境に慣れ始める' },
        { label: '探索期', description: '可能性を探る' }
      ],
      '3months': [
        { label: '成果出現', description: '具体的な成果が見え始める' },
        { label: '挑戦継続', description: '困難を乗り越えながら前進' },
        { label: '創造開花', description: '独自の価値が形になる' }
      ],
      '1year': [
        { label: '安定成長', description: '着実な成長を実現' },
        { label: '大きな飛躍', description: '予想を超える成果' },
        { label: '新境地開拓', description: '全く新しい道を切り開く' }
      ]
    };
    
    return timeOutcomes[time] || [];
  }

  /**
   * Load saved data
   */
  async loadSavedData() {
    try {
      const saved = localStorage.getItem('futureBranchingData');
      if (saved) {
        const data = JSON.parse(saved);
        this.votingData = data.votingData || {};
      }
    } catch (error) {
      console.log('No saved data found');
    }
  }

  /**
   * Save data
   */
  saveData() {
    try {
      const data = {
        votingData: this.votingData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('futureBranchingData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }
}

// Export for use
window.FutureBranchingSystem = FutureBranchingSystem;