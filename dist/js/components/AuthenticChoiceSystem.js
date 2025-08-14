/**
 * 正統易経選択システム - AuthenticChoiceSystem.js
 * 
 * 今の状況のテーマに基づく正確な選択システム
 * - 今の状況のテーマで進む vs 違うテーマを選択する
 * - 本卦→之卦の変化予測
 * - HaQei分人間対応選択
 * - リスク・ポテンシャル分析
 * 
 * Author: HAQEI I Ching Expert Agent
 * Created: 2025-08-04
 */

class AuthenticChoiceSystem {
  constructor(container, iChingEngine) {
    this.container = container;
    this.engine = iChingEngine;
    this.currentChoices = null;
    this.selectedPath = null;
    
    this.initializeChoiceSystem();
    
    console.log("🎭 正統易経選択システム初期化完了");
  }

  /**
   * 選択システムの初期化
   */
  initializeChoiceSystem() {
    this.container.innerHTML = this.createChoiceStructure();
    this.attachEventListeners();
  }

  /**
   * 選択システムの構造作成
   */
  createChoiceStructure() {
    return `
      <div class="authentic-choice-container">
        <!-- ヘッダー -->
        <div class="choice-header">
          <h2 class="choice-title">
            <span class="icon">🎭</span>
            易経の分岐点
          </h2>
          <div class="choice-subtitle">
            今の状況のテーマに、あなたはどう応えますか？
          </div>
        </div>

        <!-- 現在の状況テーマ表示 -->
        <div class="current-line-display" id="currentLineDisplay">
          <!-- 動的に生成 -->
        </div>

        <!-- 選択肢表示 -->
        <div class="choice-options" id="choiceOptions">
          <!-- 動的に生成 -->
        </div>

        <!-- 変化予測表示 -->
        <div class="transformation-preview" id="transformationPreview" style="display: none;">
          <!-- 動的に生成 -->
        </div>

        <!-- HaQei分人間分析 -->
        <div class="HaQei-choice-analysis" id="HaQeiChoiceAnalysis" style="display: none;">
          <!-- 動的に生成 -->
        </div>

        <!-- 選択確定ボタン -->
        <div class="choice-confirmation" id="choiceConfirmation" style="display: none;">
          <button class="confirm-button" id="confirmChoiceBtn">
            この道を選択する
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 選択肢の生成と表示
   */
  generateChoices(currentPosition) {
    console.log("🎯 選択肢生成開始:", currentPosition);
    
    try {
      // AuthenticIChingEngineから選択肢を生成
      this.currentChoices = this.engine.generateAuthenticChoices(
        currentPosition.卦番号,
        this.parseLinePosition(currentPosition.爻)
      );
      
      this.displayCurrentLine(this.currentChoices.situation);
      this.displayChoiceOptions(this.currentChoices);
      
      console.log("✅ 選択肢生成完了:", this.currentChoices);
      
    } catch (error) {
      console.error("❌ 選択肢生成エラー:", error);
      this.displayErrorState();
    }
  }

  /**
   * 現在の状況テーマ表示
   */
  displayCurrentLine(situation) {
    const currentLineElement = document.getElementById('currentLineDisplay');
    
    currentLineElement.innerHTML = `
      <div class="line-situation fade-in">
        <div class="situation-header">
          <h3>現在の状況</h3>
          <div class="hexagram-info">
            <span class="hexagram-number">第${situation.hexagram}卦</span>
            <span class="hexagram-name">${situation.hexagramName}</span>
            <span class="line-position">${situation.lineText}</span>
          </div>
        </div>
        
        <div class="situation-content">
          <div class="line-meaning">
            <h4>今の状況のテーマ</h4>
            <div class="meaning-text">
              ${situation.meaning}
            </div>
          </div>
          
          <div class="situation-keywords">
            <h4>関連キーワード</h4>
            <div class="keyword-tags">
              ${situation.keywords.map(keyword => 
                `<span class="keyword-tag">${keyword}</span>`
              ).join('')}
            </div>
          </div>
        </div>
        
        <div class="choice-question">
          <h3>🤔 このテーマに、あなたはどう応えますか？</h3>
        </div>
      </div>
    `;
  }

  /**
   * 選択肢の表示
   */
  displayChoiceOptions(choices) {
    const optionsElement = document.getElementById('choiceOptions');
    
    optionsElement.innerHTML = `
      <div class="choice-cards">
        <!-- 選択A: 今の状況のテーマで進む道 -->
        <div class="choice-card path-a" data-path="pathA">
          <div class="card-header">
            <h3>🛤️ ${choices.pathA.title}</h3>
            <div class="path-type">今の状況のテーマで進む</div>
          </div>
          
          <div class="card-content">
            <div class="path-description">
              <p>${choices.pathA.description}</p>
            </div>
            
            <div class="path-action">
              <h4>具体的な行動</h4>
              <p>${choices.pathA.action}</p>
            </div>
            
            <div class="outcome-preview">
              <h4>予想される展開</h4>
              <div class="outcome-stats">
                <div class="stat-item positive">
                  <span class="stat-label">リスク</span>
                  <span class="stat-value">${choices.pathA.outcome.risk}</span>
                </div>
                <div class="stat-item positive">
                  <span class="stat-label">可能性</span>
                  <span class="stat-value">${choices.pathA.outcome.potential}</span>
                </div>
              </div>
              
              <div class="transformation-hint">
                <span class="from-hex">${choices.situation.hexagramName}</span>
                <span class="arrow">→</span>
                <span class="to-hex">${choices.pathA.outcome.transformation?.toHexagram?.name || '変化予測中'}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="select-path-btn" data-path="pathA">
              この道を詳しく見る
            </button>
          </div>
        </div>

        <!-- 選択B: 別の角度から考える道 -->
        <div class="choice-card path-b" data-path="pathB">
          <div class="card-header">
            <h3>⚡ ${choices.pathB.title}</h3>
            <div class="path-type">違うテーマを選択する</div>
          </div>
          
          <div class="card-content">
            <div class="path-description">
              <p>${choices.pathB.description}</p>
            </div>
            
            <div class="path-action">
              <h4>具体的な行動</h4>
              <p>${choices.pathB.action}</p>
            </div>
            
            <div class="outcome-preview">
              <h4>予想される展開</h4>
              <div class="outcome-stats">
                <div class="stat-item warning">
                  <span class="stat-label">リスク</span>
                  <span class="stat-value">${choices.pathB.outcome.risk}</span>
                </div>
                <div class="stat-item warning">
                  <span class="stat-label">可能性</span>
                  <span class="stat-value">${choices.pathB.outcome.potential}</span>
                </div>
              </div>
              
              <div class="transformation-hint">
                <span class="from-hex">${choices.situation.hexagramName}</span>
                <span class="arrow">→</span>
                <span class="to-hex">${choices.pathB.outcome.transformation?.toHexagram?.name || '変化予測中'}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="select-path-btn" data-path="pathB">
              この道を詳しく見る
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 選択された道の詳細表示
   */
  displayPathDetails(pathKey) {
    console.log("🔍 道の詳細表示:", pathKey);
    
    this.selectedPath = pathKey;
    const selectedChoice = this.currentChoices[pathKey];
    
    // 選択されたカードをハイライト
    this.highlightSelectedCard(pathKey);
    
    // 変化予測の表示
    this.displayTransformationPreview(selectedChoice);
    
    // HaQei分析の表示
    this.displayHaQeiChoiceAnalysis(selectedChoice);
    
    // 確認ボタンの表示
    this.showConfirmationButton();
  }

  /**
   * 選択されたカードのハイライト
   */
  highlightSelectedCard(pathKey) {
    // すべてのカードからハイライトを削除
    const allCards = this.container.querySelectorAll('.choice-card');
    allCards.forEach(card => {
      card.classList.remove('selected');
    });
    
    // 選択されたカードをハイライト
    const selectedCard = this.container.querySelector(`[data-path="${pathKey}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
  }

  /**
   * 変化予測の表示
   */
  displayTransformationPreview(selectedChoice) {
    const previewElement = document.getElementById('transformationPreview');
    const transformation = selectedChoice.outcome.transformation;
    
    if (!transformation) {
      previewElement.style.display = 'none';
      return;
    }
    
    previewElement.innerHTML = `
      <div class="transformation-content">
        <h3>🔮 変化の予測</h3>
        
        <div class="transformation-visual">
          <div class="transformation-stages">
            <div class="stage current">
              <div class="hexagram-display">
                <div class="hex-name">${transformation.fromHexagram.name}</div>
                <div class="hex-binary">${this.formatBinary(transformation.fromHexagram.binary)}</div>
                <div class="stage-label">現在の状況</div>
              </div>
            </div>
            
            <div class="transformation-arrow">
              <div class="changing-info">
                <div class="changing-lines">
                  ${transformation.changingLines.map(line => 
                    `<span class="changing-line">第${line}爻変化</span>`
                  ).join('')}
                </div>
                <div class="arrow-symbol">⟶</div>
              </div>
            </div>
            
            <div class="stage future">
              <div class="hexagram-display">
                <div class="hex-name">${transformation.toHexagram.name}</div>
                <div class="hex-binary">${this.formatBinary(transformation.toHexagram.binary)}</div>
                <div class="stage-label">変化後の状況</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="transformation-details">
          <div class="transformation-nature">
            <h4>変化の性質</h4>
            <p>${transformation.transformationNature?.description || '変化の性質を分析中...'}</p>
          </div>
          
          <div class="transformation-timeline">
            <h4>変化の時間軸</h4>
            <div class="timeline-phases">
              ${transformation.timeline?.phases?.map(phase => `
                <div class="timeline-phase">
                  <span class="phase-name">${phase.name}</span>
                  <span class="phase-duration">${phase.duration}</span>
                </div>
              `).join('') || '<div class="timeline-phase">時間軸を分析中...</div>'}
            </div>
          </div>
        </div>
        
        <div class="transformation-guidance">
          <h4>変化への指針</h4>
          <div class="guidance-content">
            <p>${transformation.guidance || selectedChoice.outcome.guidance || 'この道を進む場合の具体的な指針を準備中...'}</p>
          </div>
        </div>
      </div>
    `;
    
    previewElement.style.display = 'block';
  }

  /**
   * HaQei選択分析の表示
   */
  displayHaQeiChoiceAnalysis(selectedChoice) {
    const analysisElement = document.getElementById('HaQeiChoiceAnalysis');
    const HaQeiGuidance = selectedChoice.HaQeiGuidance;
    
    if (!HaQeiGuidance) {
      analysisElement.style.display = 'none';
      return;
    }
    
    analysisElement.innerHTML = `
      <div class="HaQei-choice-content">
        <h3>👥 HaQei分人間選択分析</h3>
        <div class="HaQei-subtitle">
          この選択に対する、あなたの各分人の反応
        </div>
        
        <div class="persona-choice-reactions">
          ${Object.entries(HaQeiGuidance).filter(([key]) => key !== 'integration').map(([personaKey, guidance]) => `
            <div class="persona-reaction">
              <div class="persona-header">
                <h4>${this.getPersonaTitle(personaKey)}</h4>
                <div class="persona-icon">${this.getPersonaIcon(personaKey)}</div>
              </div>
              <div class="persona-response">
                <div class="response-section">
                  <strong>この分人の視点：</strong>
                  <p>${guidance.perspective || 'この選択に対する見解を分析中...'}</p>
                </div>
                <div class="response-section">
                  <strong>推奨される行動：</strong>
                  <p>${guidance.action || '具体的な行動指針を準備中...'}</p>
                </div>
                <div class="response-section">
                  <strong>注意すべき点：</strong>
                  <p>${guidance.caution || '注意点を確認中...'}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="integration-guidance">
          <h4>🌟 分人間統合ガイダンス</h4>
          <div class="integration-content">
            <p>${HaQeiGuidance.integration?.guidance || 'この選択において、あなたの異なる分人がどのように協力し合うかを分析中...'}</p>
          </div>
        </div>
      </div>
    `;
    
    analysisElement.style.display = 'block';
  }

  /**
   * 分人のタイトルを取得
   */
  getPersonaTitle(personaKey) {
    const titles = {
      analyticalSelf: '分析的な分人',
      emotionalSelf: '感情的な分人',
      socialSelf: '社会的な分人',
      spiritualSelf: '精神的な分人'
    };
    return titles[personaKey] || personaKey;
  }

  /**
   * 分人のアイコンを取得
   */
  getPersonaIcon(personaKey) {
    const icons = {
      analyticalSelf: '🧠',
      emotionalSelf: '❤️',
      socialSelf: '👥',
      spiritualSelf: '🌟'
    };
    return icons[personaKey] || '🎭';
  }

  /**
   * 確認ボタンの表示
   */
  showConfirmationButton() {
    const confirmationElement = document.getElementById('choiceConfirmation');
    confirmationElement.style.display = 'block';
  }

  /**
   * 選択の確定
   */
  confirmChoice() {
    if (!this.selectedPath || !this.currentChoices) {
      console.warn("⚠️ 選択が完了していません");
      return null;
    }
    
    const confirmedChoice = {
      selectedPath: this.selectedPath,
      choiceData: this.currentChoices[this.selectedPath],
      timestamp: new Date().toISOString(),
      situation: this.currentChoices.situation
    };
    
    console.log("✅ 選択確定:", confirmedChoice);
    
    // 選択確定のイベントを発火
    this.dispatchChoiceConfirmed(confirmedChoice);
    
    return confirmedChoice;
  }

  /**
   * 選択確定イベントの発火
   */
  dispatchChoiceConfirmed(confirmedChoice) {
    const event = new CustomEvent('choiceConfirmed', {
      detail: confirmedChoice,
      bubbles: true
    });
    
    this.container.dispatchEvent(event);
  }

  /**
   * バイナリ表現のフォーマット
   */
  formatBinary(binary) {
    if (!binary || !Array.isArray(binary)) return '';
    
    return binary.map(bit => bit === 1 ? '━━━' : '━ ━').reverse().join('<br>');
  }

  /**
   * 爻位置の解析
   */
  parseLinePosition(lineText) {
    const lineMap = {
      '初九': 1, '初六': 1,
      '九二': 2, '六二': 2,
      '九三': 3, '六三': 3,
      '九四': 4, '六四': 4,
      '九五': 5, '六五': 5,
      '上九': 6, '上六': 6
    };
    
    return lineMap[lineText] || 1;
  }

  /**
   * エラー状態の表示
   */
  displayErrorState() {
    const optionsElement = document.getElementById('choiceOptions');
    optionsElement.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>選択肢の生成に失敗しました</h3>
        <p>システムエラーが発生しました。しばらく待ってから再試行してください。</p>
        <button class="retry-button" onclick="location.reload()">
          再試行
        </button>
      </div>
    `;
  }

  /**
   * イベントリスナーの設定
   */
  attachEventListeners() {
    this.container.addEventListener('click', (e) => {
      // 道の選択ボタン
      if (e.target.classList.contains('select-path-btn')) {
        const pathKey = e.target.dataset.path;
        this.displayPathDetails(pathKey);
      }
      
      // 選択確定ボタン
      if (e.target.id === 'confirmChoiceBtn') {
        this.confirmChoice();
      }
    });
  }

  /**
   * パブリックAPI
   */
  getCurrentChoices() {
    return this.currentChoices;
  }

  getSelectedPath() {
    return this.selectedPath;
  }

  reset() {
    this.currentChoices = null;
    this.selectedPath = null;
    this.initializeChoiceSystem();
  }
}

// グローバルエクスポート
if (typeof window !== 'undefined') {
  window.AuthenticChoiceSystem = AuthenticChoiceSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticChoiceSystem;
}

console.log("🎭 AuthenticChoiceSystem.js 読み込み完了");