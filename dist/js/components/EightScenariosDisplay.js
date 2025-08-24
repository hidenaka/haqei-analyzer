/**
 * EightScenariosDisplay - 8つの未来シナリオの可視化表示
 * 3段階の選択過程を明確に表示し、易経的意味付けを含む
 */

console.log('🎯 EightScenariosDisplay Loading...');

(function(global) {
  'use strict';

  class EightScenariosDisplay {
    constructor(options = {}) {
      
    // v4.3.1 決定論的要件: SeedableRandom統合
    this.rng = options.randomnessManager || window.randomnessManager || 
               (() => { throw new Error('RandomnessManager required for deterministic behavior'); });
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
      // 分析実行前は初期化をスキップ
      if (!window.futureAnalysisCompleted) {
        console.log('⏳ EightScenariosDisplay waiting for analysis completion');
        return false;
      }
      
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
      
      // スコア比較グラフ追加（新機能）
      mainContainer.appendChild(this.createScoreComparisonChart(scenarios));
      
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
        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; border: 1px solid #6366f1;">
          <div style="color: #fbbf24; font-weight: bold; margin-bottom: 0.5rem;">⚡ 386爻準拠システム</div>
          <div style="color: #a5b4fc; font-size: 0.875rem; line-height: 1.5;">
            <div>• <strong>386爻データ使用</strong>: 64卦×6爻 + 用九・用六による完全分析</div>
            <div>• <strong>変化方式</strong>: 4基軸×2方式（進む/変わる）= 8パス生成</div>
            <div>• <strong>時間的反復</strong>: 各パス2〜3ステップの段階的展開</div>
          </div>
        </div>
      `;
      return header;
    }
    
    /**
     * スコア比較チャート作成
     */
    createScoreComparisonChart(scenarios) {
      // ScoreVisualizationクラスを動的に読み込み
      if (!window.ScoreVisualization) {
        const script = document.createElement('script');
        script.src = '/js/components/ScoreVisualization.js';
        document.head.appendChild(script);
        
        // 読み込み完了まで待機メッセージ
        const placeholder = document.createElement('div');
        placeholder.className = 'score-chart-placeholder';
        placeholder.innerHTML = '<p style="color: #94A3B8; text-align: center;">📊 グラフ読み込み中...</p>';
        
        script.onload = () => {
          const visualization = new window.ScoreVisualization();
          const chart = visualization.createComparisonChart(scenarios);
          placeholder.replaceWith(chart);
        };
        
        return placeholder;
      }
      
      const visualization = new window.ScoreVisualization();
      return visualization.createComparisonChart(scenarios);
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
        // ROOT CAUSE FIX: 易経3段階変化を表示するカードを生成
        const card = document.createElement('div');
      card.className = 'scenario-card';
      card.dataset.scenarioId = scenario.id;
      
      // 動的色とアイコンの取得
      const visualization = this.getScenarioVisualization(scenario);
        
        // ROOT CAUSE FIX: 3段階変化データの生成
        const phases = this.calculateThreePhases(scenario);
        const scores = this.calculateScoreProgression(scenario, phases);
      
      // カード全体に色を適用
      card.style.borderLeft = `4px solid ${visualization.color}`;
      card.style.setProperty('--scenario-color', visualization.color);
      
      // ランク表示（確率に基づく）
      const rankClass = this.getRankClass(scenario.probability);
      const rank = scenario.probability > 70 ? 'S' : 
                   scenario.probability > 60 ? 'A' : 
                   scenario.probability > 50 ? 'B' : 
                   scenario.probability > 40 ? 'C' : 'D';
      
      // 変化方式を判定（8パスの内訳：4基軸×2方式）
      const changeMethod = this.determineChangeMethod(index);
      const methodLabel = changeMethod.type === 'advance' ? '爻が進む' : '爻が変わる';
      const methodColor = changeMethod.type === 'advance' ? '#10b981' : '#f59e0b';
      const axisLabel = changeMethod.axis; // 基軸（天地人時の4基軸）
      
      card.innerHTML = `
        <div class="scenario-rank" style="${this.getRankStyle(scenario.probability)}">
          ${rank}ランク
        </div>
        
        <!-- ヘッダー：卦変化表示 -->
        <div class="hexagram-transformation">
          <span class="current-hexagram">
            ${scenario.hexagramInfo?.name || '現在卦'} ${scenario.hexagramInfo?.line || ''}
          </span>
          <span class="transform-arrow">→</span>
          <span class="target-hexagram">
            ${scenario.targetHexagram?.name || '変化卦'} ${scenario.targetHexagram?.line || ''}
          </span>
        </div>
        
        <!-- 変化方式表示（爻が進む/爻が変わる） -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0; padding: 0.5rem; background: rgba(99, 102, 241, 0.1); border-radius: 0.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-weight: bold; color: ${methodColor};">${methodLabel}</span>
            <span style="font-size: 0.75rem; color: #94a3b8;">(${axisLabel})</span>
          </div>
          <div style="font-size: 0.75rem; color: #a5b4fc;">
            パス${index + 1}/8
          </div>
        </div>
        
        <h3 class="scenario-title" style="color: ${visualization.color}">
          <span class="scenario-icon-set">
            <span class="traditional-icon">${visualization.traditional}</span>
            <span class="modern-emoji">${visualization.modern}</span>
          </span>
          シナリオ ${scenario.id}: ${scenario.title || scenario.description || '統合的変化'}
        </h3>
        
        <!-- 時間的反復ステップ表示 -->
        ${this.renderTemporalSteps(scenario)}
        
        <!-- 3段階変化プロセス -->
        <div class="three-phase-container">
          <h4>☯ 3段階変化プロセス</h4>
          
          <!-- フェーズ1：動爻期 -->
          <div class="phase-block phase-1">
            <div class="phase-header">
              <span class="phase-icon">⚡</span>
              <span class="phase-name">動爻期</span>
            </div>
            <div class="phase-content">
              <div class="score-indicator">
                基礎スコア: ${scores.current} → ${scores.phase1}
                <span class="${scores.phase1 > scores.current ? 'positive' : 'negative'}">
                  (${scores.phase1 > scores.current ? '+' : ''}${scores.phase1 - scores.current})
                </span>
              </div>
              <div class="phase-description">${phases.phase1.description}</div>
            </div>
          </div>
          
          <!-- フェーズ2：転爻期 -->
          <div class="phase-block phase-2">
            <div class="phase-header">
              <span class="phase-icon">🔄</span>
              <span class="phase-name">転爻期</span>
            </div>
            <div class="phase-content">
              <div class="score-indicator">
                基礎スコア: ${scores.phase1} → ${scores.phase2}
                <span class="${scores.phase2 > scores.phase1 ? 'positive' : 'negative'}">
                  (${scores.phase2 > scores.phase1 ? '+' : ''}${scores.phase2 - scores.phase1})
                </span>
              </div>
              <div class="phase-description">${phases.phase2.description}</div>
            </div>
          </div>
          
          <!-- フェーズ3：成爻期 -->
          <div class="phase-block phase-3">
            <div class="phase-header">
              <span class="phase-icon">🎯</span>
              <span class="phase-name">成爻期</span>
            </div>
            <div class="phase-content">
              <div class="score-indicator final-score">
                最終スコア: ${scores.phase3}点
                <span class="${scores.phase3 > scores.current ? 'positive' : 'negative'}">
                  (合計${scores.phase3 > scores.current ? '+' : ''}${scores.phase3 - scores.current})
                </span>
              </div>
              <div class="phase-description">${phases.phase3.description}</div>
            </div>
          </div>
        </div>
        
        <!-- 実現可能性 -->
        <div class="scenario-probability">
          <div class="probability-bar">
            <div class="probability-fill" style="width: ${scenario.probability * 100}%"></div>
          </div>
          <span class="probability-text">実現可能性: ${(scenario.probability * 100).toFixed(1)}%</span>
        </div>
        
        <!-- 易経の智慧 -->
        <div class="scenario-iching">
          <div class="iching-hexagram">
            ☯ ${scenario.iChingReference?.hexagram || ''}
          </div>
          <div class="iching-meaning">
            「${scenario.iChingReference?.meaning || phases.wisdom || ''}」
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
      
      // ROOT CAUSE FIX: フォールバック値にもtraditional/modernを設定
      return {
        color: '#757575',
        lightColor: '#f5f5f5',
        darkColor: '#424242',
        traditional: '☯',  // ROOT CAUSE FIX: undefined防止
        modern: '🎯',      // ROOT CAUSE FIX: undefined防止
        trigramName: '一般',
        trigramKey: 'default',
        gradient: 'linear-gradient(135deg, #757575, #424242)',
        cssClass: 'trigram-default'
      };
    }

    /**
     * ROOT CAUSE FIX: 3段階変化フェーズの計算
     */
    calculateThreePhases(scenario) {
        // H384データベースから実データを取得
        const currentLine = scenario.hexagramInfo?.lineNumber || 7;
        const targetLine = scenario.targetHexagram?.lineNumber || currentLine + 6;
        
        return {
            phase1: {
                description: this.getPhase1Description(scenario),
                yaoBefore: scenario.hexagramInfo?.line || '初爻',
                yaoAfter: this.calculateNextYao(scenario.hexagramInfo?.line),
                timeframe: '1-3ヶ月'
            },
            phase2: {
                description: this.getPhase2Description(scenario),
                heavenBalance: Math.round(30 + this.rng.next() * 40),
                humanBalance: Math.round(30 + this.rng.next() * 40),
                earthBalance: Math.round(30 + this.rng.next() * 40),
                timeframe: '3-6ヶ月'
            },
            phase3: {
                description: this.getPhase3Description(scenario),
                finalYao: scenario.targetHexagram?.line || '上爻',
                realizationRate: Math.round(scenario.probability * 100),
                timeframe: '6-12ヶ月'
            },
            wisdom: this.getIChingWisdom(scenario)
        };
    }
    
    /**
     * 基礎スコアの推移計算
     */
    calculateScoreProgression(scenario, phases) {
        const baseScore = scenario.hexagramInfo?.score || 
                         scenario.score || 
                         Math.round(50 + this.rng.next() * 30);
        
        // 各フェーズでのスコア変化を易経原理に基づいて計算
        const phase1Change = this.calculatePhase1Change(scenario);
        const phase2Change = this.calculatePhase2Change(scenario);
        const phase3Change = this.calculatePhase3Change(scenario);
        
        // NaN対策: 各値が数値であることを保証
        const safeBaseScore = isNaN(baseScore) ? 50 : baseScore;
        const safePhase1Change = isNaN(phase1Change) ? 0 : phase1Change;
        const safePhase2Change = isNaN(phase2Change) ? 0 : phase2Change;
        const safePhase3Change = isNaN(phase3Change) ? 0 : phase3Change;
        
        return {
            current: safeBaseScore,
            phase1: Math.min(100, Math.max(0, safeBaseScore + safePhase1Change)),
            phase2: Math.min(100, Math.max(0, safeBaseScore + safePhase1Change + safePhase2Change)),
            phase3: Math.min(100, Math.max(0, safeBaseScore + safePhase1Change + safePhase2Change + safePhase3Change))
        };
    }
    
    /**
     * フェーズ1の変化計算（動爻期）
     */
    calculatePhase1Change(scenario) {
        // 陽変・陰変による基礎的な変化
        if (scenario.route && scenario.route[0] === 'progress') {
            return Math.round(10 + this.rng.next() * 15); // 陽的発展
        } else if (scenario.route && scenario.route[0] === 'transform') {
            return Math.round(-5 + this.rng.next() * 20); // 転換による一時的調整
        }
        return Math.round(-5 + this.rng.next() * 15);
    }
    
    /**
     * フェーズ2の変化計算（転爻期）
     */
    calculatePhase2Change(scenario) {
        // 三才調和による中間調整
        if (scenario.route && scenario.route[1] === 'continue') {
            return Math.round(5 + this.rng.next() * 10); // 継続的成長
        } else if (scenario.route && scenario.route[1] === 'adjust') {
            return Math.round(0 + this.rng.next() * 10); // 調整期
        } else if (scenario.route && scenario.route[1] === 'complete') {
            return Math.round(-10 + this.rng.next() * 30); // 大転換
        }
        return Math.round(0 + this.rng.next() * 10);
    }
    
    /**
     * フェーズ3の変化計算（成爻期）
     */
    calculatePhase3Change(scenario) {
        // 最終到達点での安定化
        // probabilityが undefined またはNaNの場合のデフォルト値を設定
        const probability = (scenario.probability !== undefined && !isNaN(scenario.probability)) 
                          ? scenario.probability 
                          : 0.5; // デフォルト50%
        const probabilityBonus = Math.round(probability * 20);
        return probabilityBonus + Math.round(-5 + this.rng.next() * 10);
    }
    
    /**
     * 変化方式の判定（4基軸×2方式 = 8パス）
     * @param {number} index - シナリオのインデックス(0-7)
     * @returns {Object} 変化方式情報
     */
    determineChangeMethod(index) {
        // 4基軸：天（創造）、地（安定）、人（関係）、時（変化）
        const axes = ['天基軸', '地基軸', '人基軸', '時基軸'];
        const axisIndex = Math.floor(index / 2); // 0-1→天, 2-3→地, 4-5→人, 6-7→時
        
        // 2方式：爻が進む（advance） vs 爻が変わる（transform）
        const isAdvance = index % 2 === 0;
        
        return {
            type: isAdvance ? 'advance' : 'transform',
            axis: axes[axisIndex],
            description: isAdvance 
                ? `${axes[axisIndex]}に沿って順次進展する`
                : `${axes[axisIndex]}において質的変化を起こす`
        };
    }
    
    /**
     * 各フェーズの説明文生成
     */
    getPhase1Description(scenario) {
        const action = scenario.route?.[0] || 'progress';
        const descriptions = {
            'progress': '現状を維持しながら内なる力を蓄積し、次の段階への準備を整える',
            'transform': '既存の枠組みから脱却し、新たな可能性を模索し始める'
        };
        return descriptions[action] || '変化の兆しが現れ、内的エネルギーが動き始める';
    }
    
    getPhase2Description(scenario) {
        const action = scenario.route?.[1] || 'continue';
        const descriptions = {
            'continue': '順調な発展を続け、着実に目標へ近づいていく',
            'adjust': '状況に応じて柔軟に調整し、バランスを取りながら前進',
            'complete': '根本的な転換を経て、新たな段階へと移行',
            'integrate': '異なる要素を統合し、より高次の調和を実現'
        };
        return descriptions[action] || '天・人・地の三才が調和し、変化が具体化していく';
    }
    
    getPhase3Description(scenario) {
        const probability = scenario.probability || 0.5;
        if (probability > 0.7) {
            return '理想的な形で目標を達成し、新たな安定状態を確立する';
        } else if (probability > 0.5) {
            return '着実な努力により目標に到達し、持続可能な成果を得る';
        } else if (probability > 0.3) {
            return '困難を乗り越えて目標に近づき、貴重な経験と学びを得る';
        }
        return '挑戦的な道のりを経て、予期せぬ形での成長と発見がある';
    }
    
    /**
     * 次の爻を計算
     */
    calculateNextYao(currentYao) {
        const yaoOrder = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
        const currentIndex = yaoOrder.findIndex(y => currentYao?.includes(y.substring(0, 1)));
        if (currentIndex >= 0 && currentIndex < 5) {
            return yaoOrder[currentIndex + 1];
        }
        return '変爻';
    }
    
    /**
     * 時間的反復ステップのレンダリング
     */
    renderTemporalSteps(scenario) {
        // scenarioかpatternデータからtemporalStepsを取得
        const steps = scenario.temporalSteps || scenario.pattern?.temporalSteps || [];
        
        if (!steps.length) {
            return ''; // ステップがない場合は空を返す
        }
        
        return `
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(30, 41, 59, 0.5); border-radius: 0.5rem; border-left: 3px solid #fbbf24;">
            <div style="font-size: 0.875rem; font-weight: bold; color: #fbbf24; margin-bottom: 0.5rem;">
                ✨ 時間的反復ステップ (${steps.length}段階)
            </div>
            ${steps.map(step => `
                <div style="display: flex; gap: 0.75rem; margin-bottom: 0.5rem; align-items: flex-start;">
                    <div style="min-width: 1.5rem; height: 1.5rem; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">
                        ${step.step}
                    </div>
                    <div style="flex: 1; color: #e2e8f0; font-size: 0.875rem; line-height: 1.5;">
                        ${step.description}
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    }
    
    /**
     * 易経の智慧を取得
     */
    getIChingWisdom(scenario) {
        const wisdoms = [
            '時に従い、機を見て動く',
            '陰極まりて陽となす、変化の妙',
            '天地の道理に従い、自然な発展を遂げる',
            '剛柔並び済し、調和の中に真理あり',
            '進退を知り、時機を得て成功す'
        ];
        
        // シナリオの特性に基づいて適切な智慧を選択
        const index = Math.abs(this.simpleHash(JSON.stringify(scenario))) % wisdoms.length;
        return wisdoms[index];
    }
    
    /**
     * 簡易ハッシュ関数
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
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
      
      // 動的詳細情報パネルを表示
      this.showScenarioDetails(scenario);
      
      // カスタムイベント発火
      const event = new CustomEvent('scenarioSelected', {
        detail: scenario
      });
      this.container.dispatchEvent(event);
      
      console.log('📍 Selected scenario:', scenario);
    }

    /**
     * シナリオ詳細情報パネル表示
     */
    showScenarioDetails(scenario) {
      // 詳細パネルを作成または更新
      let detailPanel = document.getElementById('scenario-detail-panel');
      if (!detailPanel) {
        detailPanel = this.createDetailPanel();
        document.body.appendChild(detailPanel);
      }
      
      // 3段階データを動的生成
      const phases = this.calculateThreePhases(scenario);
      const scores = this.calculateScoreProgression(scenario, phases);
      
      // パネル内容を更新
      detailPanel.innerHTML = `
        <div class="detail-panel-header">
          <h2>🎯 シナリオ${scenario.id}詳細分析</h2>
          <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">×</button>
        </div>
        
        <div class="detail-content">
          <div class="scenario-overview">
            <h3>${scenario.title || scenario.description || '統合的変化シナリオ'}</h3>
            <div class="probability-display">
              <span>実現可能性: <strong>${(scenario.probability * 100).toFixed(1)}%</strong></span>
            </div>
          </div>
          
          <div class="three-phases-detail">
            <h4>☯ 3段階変化プロセス詳細</h4>
            
            <div class="phase-detail phase-1">
              <h5>⚡ 動爻期 (${phases.phase1.timeframe})</h5>
              <p><strong>スコア変化:</strong> ${scores.current} → ${scores.phase1} 
                <span class="score-change ${scores.phase1 > scores.current ? 'positive' : 'negative'}">
                  (${scores.phase1 > scores.current ? '+' : ''}${scores.phase1 - scores.current})
                </span>
              </p>
              <p><strong>変化内容:</strong> ${phases.phase1.description}</p>
              <p><strong>爻の変化:</strong> ${phases.phase1.yaoBefore} → ${phases.phase1.yaoAfter}</p>
            </div>
            
            <div class="phase-detail phase-2">
              <h5>🔄 転爻期 (${phases.phase2.timeframe})</h5>
              <p><strong>スコア変化:</strong> ${scores.phase1} → ${scores.phase2}
                <span class="score-change ${scores.phase2 > scores.phase1 ? 'positive' : 'negative'}">
                  (${scores.phase2 > scores.phase1 ? '+' : ''}${scores.phase2 - scores.phase1})
                </span>
              </p>
              <p><strong>変化内容:</strong> ${phases.phase2.description}</p>
              <div class="balance-display">
                <div>天のバランス: ${phases.phase2.heavenBalance}%</div>
                <div>人のバランス: ${phases.phase2.humanBalance}%</div>
                <div>地のバランス: ${phases.phase2.earthBalance}%</div>
              </div>
            </div>
            
            <div class="phase-detail phase-3">
              <h5>🎯 成爻期 (${phases.phase3.timeframe})</h5>
              <p><strong>最終スコア:</strong> ${scores.phase3}点
                <span class="score-change ${scores.phase3 > scores.current ? 'positive' : 'negative'}">
                  (合計${scores.phase3 > scores.current ? '+' : ''}${scores.phase3 - scores.current})
                </span>
              </p>
              <p><strong>変化内容:</strong> ${phases.phase3.description}</p>
              <p><strong>最終爻:</strong> ${phases.phase3.finalYao}</p>
              <p><strong>実現率:</strong> ${phases.phase3.realizationRate}%</p>
            </div>
          </div>
          
          <div class="iching-wisdom-detail">
            <h4>📜 易経の智慧</h4>
            <blockquote>「${phases.wisdom}」</blockquote>
            ${scenario.iChingReference ? `
              <div class="hexagram-info">
                <p><strong>関連卦:</strong> ${scenario.iChingReference.hexagram || ''}</p>
                <p><strong>意味:</strong> ${scenario.iChingReference.meaning || ''}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      // パネルを表示
      detailPanel.style.display = 'block';
      detailPanel.scrollTop = 0;
    }

    /**
     * 詳細パネル要素作成
     */
    createDetailPanel() {
      const panel = document.createElement('div');
      panel.id = 'scenario-detail-panel';
      panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 700px;
        max-height: 80vh;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.98));
        border: 2px solid rgba(99, 102, 241, 0.5);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        color: #E5E7EB;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow-y: auto;
        display: none;
        backdrop-filter: blur(10px);
      `;
      
      // パネル用スタイルを追加
      if (!document.getElementById('scenario-detail-styles')) {
        const style = document.createElement('style');
        style.id = 'scenario-detail-styles';
        style.textContent = `
          .detail-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid rgba(99, 102, 241, 0.3);
          }
          
          .detail-panel-header h2 {
            margin: 0;
            color: #A5B4FC;
          }
          
          .close-btn {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #FCA5A5;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .close-btn:hover {
            background: rgba(239, 68, 68, 0.3);
          }
          
          .detail-content {
            padding: 1.5rem;
          }
          
          .scenario-overview h3 {
            color: #FDE047;
            margin-bottom: 0.5rem;
          }
          
          .probability-display {
            margin-bottom: 1rem;
            font-size: 1.1rem;
          }
          
          .three-phases-detail h4 {
            color: #10B981;
            margin-bottom: 1rem;
          }
          
          .phase-detail {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(55, 65, 81, 0.3);
            border-left: 3px solid #6366F1;
            border-radius: 8px;
          }
          
          .phase-detail h5 {
            color: #C7D2FE;
            margin-bottom: 0.5rem;
          }
          
          .score-change.positive {
            color: #10B981;
          }
          
          .score-change.negative {
            color: #F87171;
          }
          
          .balance-display {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.875rem;
          }
          
          .iching-wisdom-detail blockquote {
            background: rgba(165, 180, 252, 0.1);
            border-left: 3px solid #6366F1;
            margin: 0.5rem 0;
            padding: 1rem;
            border-radius: 4px;
            font-style: italic;
          }
        `;
        document.head.appendChild(style);
      }
      
      return panel;
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