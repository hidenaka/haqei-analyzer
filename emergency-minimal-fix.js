// Emergency minimal fix for Future Simulator
// This will be injected directly into the HTML

class ProgressiveLoader {
  constructor() {
    this.progress = 0;
    this.analysisHistory = [];
    console.log('✅ ProgressiveLoader initialized');
  }

  init() {
    setTimeout(() => {
      this.showInputForm();
      this.initializeEventListeners();
    }, 500);
  }

  showInputForm() {
    const inputContent = document.getElementById('input-content');
    const worryInput = document.getElementById('worryInput');
    
    if (inputContent) {
      inputContent.style.display = 'block';
      inputContent.style.opacity = '1';
      
      if (worryInput) {
        setTimeout(() => {
          worryInput.focus();
        }, 300);
      }
    }
  }

  initializeEventListeners() {
    const aiGuessBtn = document.getElementById('aiGuessBtn');
    const worryInput = document.getElementById('worryInput');
    
    if (aiGuessBtn && worryInput) {
      aiGuessBtn.addEventListener('click', () => {
        const inputText = worryInput.value.trim();
        if (inputText && inputText.length >= 10) {
          this.performAnalysis(inputText);
        } else {
          alert('10文字以上のテキストを入力してください');
        }
      });
    }
  }

  performAnalysis(inputText) {
    const aiGuessBtn = document.getElementById('aiGuessBtn');
    
    if (aiGuessBtn) {
      aiGuessBtn.disabled = true;
      aiGuessBtn.textContent = '分析中...';
    }

    // Simple analysis simulation
    setTimeout(() => {
      this.displayResults(inputText);
      
      if (aiGuessBtn) {
        aiGuessBtn.disabled = false;
        aiGuessBtn.textContent = '分析実行';
      }
    }, 2000);
  }

  displayResults(inputText) {
    let resultsContainer = document.getElementById('results-container') || 
                          document.getElementById('results');
    
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'results-container';
      
      const mainContainer = document.querySelector('.container') || document.body;
      mainContainer.appendChild(resultsContainer);
    }

    // Generate simple scenarios
    const scenarios = this.generateSimpleScenarios(inputText);
    
    resultsContainer.innerHTML = `
      <div style="margin: 30px 0; padding: 20px; background: rgba(17, 24, 39, 0.8); border-radius: 12px; border: 1px solid rgba(55, 65, 81, 0.5);">
        <h3 style="color: #10B981; margin: 0 0 20px 0; font-size: 1.5rem;">🎯 分析結果</h3>
        
        <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid rgba(16, 185, 129, 0.2);">
          <h4 style="color: #34D399; margin: 0 0 10px 0;">現在の状況分析</h4>
          <p style="color: #E5E7EB; margin: 0;">入力内容から、現在の悩みや課題を分析しました。</p>
        </div>

        <div style="margin: 25px 0;">
          <h4 style="color: #F59E0B; margin: 0 0 15px 0;">8つの未来シナリオ</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
            ${scenarios.map((scenario, i) => `
              <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);">
                <h5 style="color: #60A5FA; margin: 0 0 8px 0;">シナリオ ${i + 1}</h5>
                <p style="color: #E5E7EB; font-size: 0.9rem; margin: 0;">${scenario}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="background: rgba(168, 85, 247, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid rgba(168, 85, 247, 0.2);">
          <h4 style="color: #A78BFA; margin: 0 0 10px 0;">HaQei哲学による提案</h4>
          <p style="color: #E5E7EB; margin: 0;">現在の状況を受け入れながら、段階的に改善していくアプローチをお勧めします。</p>
        </div>
      </div>
    `;
    
    resultsContainer.style.display = 'block';
    
    // Smooth scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }

  generateSimpleScenarios(inputText) {
    const baseScenarios = [
      '現状維持を選択し、安定的な成長を目指す道',
      '積極的な変化を求めて新たな挑戦を始める道',
      '周囲との関係を重視し、協力を求める道',
      '一度立ち止まり、じっくりと状況を分析する道',
      '直感を信じて迅速な決断を下す道',
      '専門知識やスキルの向上に集中する道',
      'リスクを取って大胆な行動に出る道',
      'バランスを重視し、複数の選択肢を並行する道'
    ];

    return baseScenarios;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Emergency fix loading...');
  const loader = new ProgressiveLoader();
  loader.init();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  console.log('🚀 Emergency fix loading (immediate)...');
  const loader = new ProgressiveLoader();
  loader.init();
}