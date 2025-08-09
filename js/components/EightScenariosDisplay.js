/**
 * EightScenariosDisplay - 8つの未来シナリオの可視化表示
 * 3段階の選択過程を明確に表示し、易経的意味付けを含む
 */

console.log('🎯 EightScenariosDisplay Loading...');

(function(global) {
  'use strict';

  class EightScenariosDisplay {
    constructor() {
      this.name = 'EightScenariosDisplay';
      this.version = '2.0.0';
      this.container = null;
      this.scenarios = [];
      this.selectedScenario = null;
      this.threeStageProcess = null;
    }

    /**
     * 初期化
     */
    initialize(containerId) {
      console.log('🔄 EightScenariosDisplay initializing...');
      
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`❌ Container not found: ${containerId}`);
        return false;
      }

      this.setupStyles();
      console.log('✅ EightScenariosDisplay initialized');
      return true;
    }

    /**
     * スタイル設定
     */
    setupStyles() {
      // 動的スタイルの追加
      if (!document.getElementById('eight-scenarios-styles')) {
        const style = document.createElement('style');
        style.id = 'eight-scenarios-styles';
        style.textContent = `
          .eight-scenarios-container {
            padding: 2rem;
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
            border-radius: 16px;
            border: 1px solid rgba(99, 102, 241, 0.2);
          }
          
          .scenario-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .scenario-card {
            background: rgba(30, 41, 59, 0.8);
            border: 2px solid rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .scenario-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
            border-color: rgba(99, 102, 241, 0.6);
          }
          
          .scenario-card.selected {
            background: rgba(99, 102, 241, 0.2);
            border-color: #6366F1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          }
          
          .scenario-rank {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: bold;
          }
          
          .scenario-title {
            font-size: 1.125rem;
            font-weight: bold;
            color: #A5B4FC;
            margin-bottom: 0.75rem;
          }
          
          .scenario-path {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1rem 0;
            padding: 0.75rem;
            background: rgba(17, 24, 39, 0.5);
            border-radius: 8px;
          }
          
          .path-stage {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
          }
          
          .path-arrow {
            color: #6366F1;
            font-size: 1.25rem;
          }
          
          .stage-label {
            font-size: 0.75rem;
            color: #9CA3AF;
            margin-bottom: 0.25rem;
          }
          
          .stage-choice {
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            text-align: center;
          }
          
          .choice-conservative { background: rgba(59, 130, 246, 0.2); color: #60A5FA; }
          .choice-progressive { background: rgba(16, 185, 129, 0.2); color: #10B981; }
          .choice-collaborative { background: rgba(245, 158, 11, 0.2); color: #F59E0B; }
          .choice-independent { background: rgba(139, 92, 246, 0.2); color: #8B5CF6; }
          .choice-cautious { background: rgba(239, 68, 68, 0.2); color: #EF4444; }
          .choice-decisive { background: rgba(6, 182, 212, 0.2); color: #06B6D4; }
          
          .scenario-probability {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.75rem 0;
          }
          
          .probability-bar {
            flex: 1;
            height: 8px;
            background: rgba(55, 65, 81, 0.5);
            border-radius: 4px;
            overflow: hidden;
          }
          
          .probability-fill {
            height: 100%;
            background: linear-gradient(90deg, #3B82F6, #6366F1);
            border-radius: 4px;
            transition: width 0.3s ease;
          }
          
          .probability-text {
            font-size: 0.875rem;
            font-weight: bold;
            color: #A5B4FC;
            min-width: 45px;
            text-align: right;
          }
          
          .scenario-description {
            color: #D1D5DB;
            font-size: 0.875rem;
            line-height: 1.5;
            margin: 0.75rem 0;
          }
          
          .scenario-characteristics {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 0.75rem 0;
          }
          
          .characteristic-tag {
            padding: 0.25rem 0.5rem;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 6px;
            font-size: 0.75rem;
            color: #C7D2FE;
          }
          
          .scenario-iching {
            margin-top: 1rem;
            padding: 0.75rem;
            background: rgba(165, 180, 252, 0.1);
            border-left: 3px solid #6366F1;
            border-radius: 4px;
          }
          
          .iching-hexagram {
            font-weight: bold;
            color: #FDE047;
            margin-bottom: 0.25rem;
          }
          
          .iching-meaning {
            font-size: 0.875rem;
            color: #E5E7EB;
            font-style: italic;
          }
          
          .three-stage-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .three-stage-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #A5B4FC;
            margin-bottom: 0.5rem;
          }
          
          .three-stage-subtitle {
            color: #9CA3AF;
            font-size: 1rem;
          }
          
          .stage-selector {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 2rem 0;
            padding: 1rem;
            background: rgba(17, 24, 39, 0.5);
            border-radius: 12px;
          }
          
          .stage-option {
            padding: 1rem 1.5rem;
            background: rgba(55, 65, 81, 0.5);
            border: 2px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .stage-option:hover {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.5);
          }
          
          .stage-option.selected {
            background: rgba(99, 102, 241, 0.3);
            border-color: #6366F1;
          }
          
          .option-title {
            font-weight: bold;
            color: #E5E7EB;
            margin-bottom: 0.25rem;
          }
          
          .option-description {
            font-size: 0.875rem;
            color: #9CA3AF;
          }
        `;
        document.head.appendChild(style);
      }
    }

    /**
     * 8つのシナリオを表示
     */
    displayScenarios(scenarios, threeStageProcess) {
      if (!this.container) return;
      
      // 動的色システムを適用
      this.applyScenariosColors(scenarios);
      
      this.scenarios = scenarios;
      this.threeStageProcess = threeStageProcess;
      
      // コンテナをクリア
      this.container.innerHTML = '';
      
      // メインコンテナ作成
      const mainContainer = document.createElement('div');
      mainContainer.className = 'eight-scenarios-container';
      
      // ヘッダー追加
      mainContainer.appendChild(this.createHeader());
      
      // 3段階セレクター追加
      mainContainer.appendChild(this.createStageSelector());
      
      // シナリオグリッド追加
      mainContainer.appendChild(this.createScenarioGrid(scenarios));
      
      this.container.appendChild(mainContainer);
    }

    /**
     * ヘッダー作成
     */
    createHeader() {
      const header = document.createElement('div');
      header.className = 'three-stage-header';
      header.innerHTML = `
        <h2 class="three-stage-title">🎯 8つの未来シナリオ</h2>
        <p class="three-stage-subtitle">3段階の選択による可能性の全体像</p>
      `;
      return header;
    }

    /**
     * 3段階セレクター作成
     */
    createStageSelector() {
      const selector = document.createElement('div');
      selector.className = 'stage-selector';
      
      if (this.threeStageProcess && this.threeStageProcess.stages) {
        this.threeStageProcess.stages.forEach((stage, index) => {
          const stageDiv = document.createElement('div');
          stageDiv.innerHTML = `
            <h3 style="color: #A5B4FC; margin-bottom: 1rem;">${stage.title}</h3>
            <div style="display: flex; gap: 1rem;">
              ${stage.choices.map(choice => `
                <div class="stage-option" data-stage="${index}" data-choice="${choice.id}">
                  <div class="option-title">${choice.name}</div>
                  <div class="option-description">${choice.description}</div>
                  <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #10B981;">
                    適合度: ${choice.compatibility}%
                  </div>
                </div>
              `).join('')}
            </div>
          `;
          selector.appendChild(stageDiv);
        });
      }
      
      // イベントリスナー追加
      selector.addEventListener('click', (e) => {
        const option = e.target.closest('.stage-option');
        if (option) {
          this.handleStageSelection(option);
        }
      });
      
      return selector;
    }

    /**
     * シナリオグリッド作成
     */
    createScenarioGrid(scenarios) {
      const grid = document.createElement('div');
      grid.className = 'scenario-grid';
      
      scenarios.forEach((scenario, index) => {
        const card = this.createScenarioCard(scenario, index);
        grid.appendChild(card);
      });
      
      return grid;
    }

    /**
     * シナリオカード作成
     */
    createScenarioCard(scenario, index) {
      const card = document.createElement('div');
      card.className = 'scenario-card';
      card.dataset.scenarioId = scenario.id;
      
      // 動的色とアイコンの取得
      const visualization = this.getScenarioVisualization(scenario);
      
      // カード全体に色を適用
      card.style.borderLeft = `4px solid ${visualization.color}`;
      card.style.setProperty('--scenario-color', visualization.color);
      
      // ランク表示（確率に基づく）
      const rankClass = this.getRankClass(scenario.probability);
      const rank = scenario.probability > 70 ? 'S' : 
                   scenario.probability > 60 ? 'A' : 
                   scenario.probability > 50 ? 'B' : 
                   scenario.probability > 40 ? 'C' : 'D';
      
      card.innerHTML = `
        <div class="scenario-rank" style="${this.getRankStyle(scenario.probability)}">
          ${rank}ランク
        </div>
        
        <h3 class="scenario-title" style="color: ${visualization.color}">
          <span class="scenario-icon-set">
            <span class="traditional-icon">${visualization.traditional}</span>
            <span class="modern-emoji">${visualization.modern}</span>
          </span>
          シナリオ ${scenario.id}: ${scenario.title}
        </h3>
        
        <div class="scenario-trigram-info">
          <span class="trigram-name" style="color: ${visualization.lightColor || visualization.color}">${visualization.trigramName}</span>
        </div>
        
        <div class="scenario-path">
          ${this.createPathVisualization(scenario.path)}
        </div>
        
        <div class="scenario-probability">
          <div class="probability-bar">
            <div class="probability-fill" style="width: ${scenario.probability}%"></div>
          </div>
          <span class="probability-text">${scenario.probability}%</span>
        </div>
        
        <p class="scenario-description">
          ${scenario.description}
        </p>
        
        <div class="scenario-characteristics">
          ${scenario.characteristics.map(char => `
            <span class="characteristic-tag">${char}</span>
          `).join('')}
        </div>
        
        <div class="scenario-iching">
          <div class="iching-hexagram">
            ☯ ${scenario.iChingReference.hexagram}
          </div>
          <div class="iching-meaning">
            「${scenario.iChingReference.meaning}」
          </div>
        </div>
      `;
      
      // クリックイベント
      card.addEventListener('click', () => {
        this.selectScenario(scenario);
      });
      
      return card;
    }

    /**
     * パス可視化作成
     */
    createPathVisualization(path) {
      const stages = ['第一段階', '第二段階', '第三段階'];
      const choiceNames = {
        'conservative': '保守的',
        'progressive': '進歩的',
        'collaborative': '協調的',
        'independent': '独立的',
        'cautious': '慎重',
        'decisive': '決断的'
      };
      
      return path.map((choice, index) => `
        <div class="path-stage">
          <div class="stage-label">${stages[index]}</div>
          <div class="stage-choice choice-${choice}">
            ${choiceNames[choice]}
          </div>
        </div>
        ${index < path.length - 1 ? '<span class="path-arrow">→</span>' : ''}
      `).join('');
    }

    /**
     * ランクスタイル取得
     */
    getRankStyle(probability) {
      if (probability > 70) {
        return 'background: linear-gradient(135deg, #FDE047, #F59E0B);';
      } else if (probability > 60) {
        return 'background: linear-gradient(135deg, #10B981, #059669);';
      } else if (probability > 50) {
        return 'background: linear-gradient(135deg, #3B82F6, #2563EB);';
      } else if (probability > 40) {
        return 'background: linear-gradient(135deg, #F59E0B, #DC2626);';
      } else {
        return 'background: linear-gradient(135deg, #6B7280, #4B5563);';
      }
    }

    /**
     * 動的色システムを適用
     */
    applyScenariosColors(scenarios) {
      if (window.haqeiColorSystem && window.haqeiColorSystem.applyScenariosColorsToDom) {
        window.haqeiColorSystem.applyScenariosColorsToDom(scenarios);
        console.log('🎨 シナリオ色をCSS変数に適用完了');
      }
    }

    /**
     * シナリオの可視化情報を取得
     */
    getScenarioVisualization(scenario) {
      if (window.haqeiColorSystem) {
        const viz = window.haqeiColorSystem.getScenarioVisualization(scenario);
        return viz;
      }
      
      // フォールバック
      return {
        color: '#757575',
        lightColor: '#f5f5f5',
        darkColor: '#424242',
        traditional: '🎯',
        modern: '🎯',
        trigramName: '一般',
        trigramKey: 'default',
        gradient: 'linear-gradient(135deg, #757575, #424242)',
        cssClass: 'trigram-default'
      };
    }

    /**
     * ランククラス取得
     */
    getRankClass(probability) {
      if (probability > 70) return 'rank-s';
      if (probability > 60) return 'rank-a';
      if (probability > 50) return 'rank-b';
      if (probability > 40) return 'rank-c';
      return 'rank-d';
    }

    /**
     * ステージ選択処理
     */
    handleStageSelection(option) {
      // 選択状態の更新
      const stage = option.dataset.stage;
      const choice = option.dataset.choice;
      
      // 同じステージの他の選択肢をクリア
      document.querySelectorAll(`.stage-option[data-stage="${stage}"]`).forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // 選択したオプションをハイライト
      option.classList.add('selected');
      
      // 該当するシナリオをフィルタリング
      this.filterScenariosBySelection();
    }

    /**
     * 選択に基づくシナリオフィルタリング
     */
    filterScenariosBySelection() {
      const selectedChoices = [];
      
      // 選択された選択肢を取得
      document.querySelectorAll('.stage-option.selected').forEach(option => {
        selectedChoices.push({
          stage: parseInt(option.dataset.stage),
          choice: option.dataset.choice
        });
      });
      
      // シナリオカードをフィルタリング
      document.querySelectorAll('.scenario-card').forEach(card => {
        const scenarioId = parseInt(card.dataset.scenarioId);
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        
        if (scenario) {
          let matches = true;
          
          selectedChoices.forEach(selected => {
            if (scenario.path[selected.stage] !== selected.choice) {
              matches = false;
            }
          });
          
          if (matches) {
            card.style.display = 'block';
            card.style.opacity = '1';
          } else {
            card.style.opacity = '0.3';
          }
        }
      });
    }

    /**
     * シナリオ選択
     */
    selectScenario(scenario) {
      // 既存の選択をクリア
      document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('selected');
      });
      
      // 新しい選択を設定
      const selectedCard = document.querySelector(`[data-scenario-id="${scenario.id}"]`);
      if (selectedCard) {
        selectedCard.classList.add('selected');
      }
      
      this.selectedScenario = scenario;
      
      // カスタムイベント発火
      const event = new CustomEvent('scenarioSelected', {
        detail: scenario
      });
      this.container.dispatchEvent(event);
      
      console.log('📍 Selected scenario:', scenario);
    }

    /**
     * アニメーション開始
     */
    animateDisplay() {
      const cards = document.querySelectorAll('.scenario-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }, index * 100);
      });
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.EightScenariosDisplay = EightScenariosDisplay;
  }

  console.log('✅ EightScenariosDisplay loaded');
  
})(typeof window !== 'undefined' ? window : this);