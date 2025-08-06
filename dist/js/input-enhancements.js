/**
 * Input Field Enhancements for Future Simulator
 * 
 * ユーザーガイダンス強化とプリセット例文機能
 * 
 * Author: HAQEI Programmer Agent
 * Created: 2025-08-06
 * Version: 1.0.0-stable
 */

class InputEnhancements {
  constructor() {
    this.version = "1.0.0-stable";
    this.initialized = false;
    this.maxLength = 1000;
    
    console.log('📝 Input Enhancements initializing...');
  }

  /**
   * システム初期化
   */
  initialize() {
    if (this.initialized) {
      console.log('✅ Input Enhancements already initialized');
      return;
    }

    try {
      this.setupInputField();
      this.setupPresetExamples();
      this.setupCharacterCounter();
      this.setupClearButton();
      this.setupResultLevelControls();
      
      this.initialized = true;
      console.log('✅ Input Enhancements ready');
      
    } catch (error) {
      console.error('❌ Input Enhancements initialization failed:', error);
      throw error;
    }
  }

  /**
   * 入力フィールドの設定
   */
  setupInputField() {
    const worryInput = document.getElementById('worryInput');
    if (!worryInput) return;

    // 文字数カウンターの更新
    worryInput.addEventListener('input', (e) => {
      this.updateCharacterCount(e.target.value.length);
      this.toggleClearButton(e.target.value.length > 0);
      this.validateInput(e.target.value);
    });

    // フォーカス時のガイダンス表示
    worryInput.addEventListener('focus', () => {
      this.showInputGuidance();
    });

    // ペースト時の処理
    worryInput.addEventListener('paste', (e) => {
      setTimeout(() => {
        const text = e.target.value;
        this.updateCharacterCount(text.length);
        this.toggleClearButton(text.length > 0);
        this.validateInput(text);
      }, 10);
    });

    console.log('✅ Input field setup completed');
  }

  /**
   * プリセット例文ボタンの設定
   */
  setupPresetExamples() {
    const presetButtons = document.querySelectorAll('.preset-example');
    const worryInput = document.getElementById('worryInput');
    
    if (!worryInput) return;

    presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const example = button.dataset.example;
        if (example) {
          // 例文を入力フィールドに設定
          worryInput.value = example;
          
          // UI更新
          this.updateCharacterCount(example.length);
          this.toggleClearButton(true);
          this.validateInput(example);
          
          // フィードバックアニメーション
          this.animateButtonFeedback(button);
          
          // 入力フィールドにフォーカス
          worryInput.focus();
          
          // スムーズスクロール
          worryInput.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      });
    });

    console.log('✅ Preset examples setup completed');
  }

  /**
   * 文字数カウンターの設定
   */
  setupCharacterCounter() {
    const charCount = document.getElementById('charCount');
    if (!charCount) return;

    // 初期表示
    this.updateCharacterCount(0);
    
    console.log('✅ Character counter setup completed');
  }

  /**
   * クリアボタンの設定
   */
  setupClearButton() {
    const clearBtn = document.getElementById('clearInput');
    const worryInput = document.getElementById('worryInput');
    
    if (!clearBtn || !worryInput) return;

    clearBtn.addEventListener('click', () => {
      worryInput.value = '';
      this.updateCharacterCount(0);
      this.toggleClearButton(false);
      worryInput.focus();
      
      // フィードバック
      this.showClearFeedback();
    });

    console.log('✅ Clear button setup completed');
  }

  /**
   * 結果表示レベルコントロールの設定
   */
  setupResultLevelControls() {
    const summaryBtn = document.getElementById('showSummary');
    const detailedBtn = document.getElementById('showDetailed');
    const completeBtn = document.getElementById('showComplete');
    const resultArea = document.getElementById('resultArea');
    
    if (!summaryBtn || !detailedBtn || !completeBtn || !resultArea) return;

    const buttons = [summaryBtn, detailedBtn, completeBtn];
    const levels = ['summary', 'detailed', 'complete'];
    
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // ボタンの状態更新
        buttons.forEach(btn => {
          btn.classList.remove('active');
          btn.classList.add('bg-gray-600', 'hover:bg-gray-500');
          btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
        });
        
        button.classList.add('active');
        button.classList.remove('bg-gray-600', 'hover:bg-gray-500');
        button.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
        
        // 表示レベルの更新
        this.setResultLevel(levels[index]);
        
        // アニメーション
        this.animateResultSections(levels[index]);
      });
    });

    console.log('✅ Result level controls setup completed');
  }

  /**
   * 文字数カウンターの更新
   */
  updateCharacterCount(count) {
    const charCount = document.getElementById('charCount');
    if (!charCount) return;

    charCount.textContent = `${count}/${this.maxLength}文字`;
    
    // 色の変更
    charCount.classList.remove('warning', 'danger');
    if (count > 800) {
      charCount.classList.add('warning');
    }
    if (count > 950) {
      charCount.classList.add('danger');
    }
  }

  /**
   * クリアボタンの表示/非表示
   */
  toggleClearButton(show) {
    const clearBtn = document.getElementById('clearInput');
    if (!clearBtn) return;

    clearBtn.classList.toggle('hidden', !show);
  }

  /**
   * 入力検証
   */
  validateInput(text) {
    const trimmedText = text.trim();
    
    // 最小文字数チェック
    if (trimmedText.length < 10) {
      this.showInputHint('10文字以上入力してください', 'warning');
      return false;
    }
    
    // 最大文字数チェック
    if (trimmedText.length > this.maxLength) {
      this.showInputHint('文字数が上限を超えています', 'error');
      return false;
    }
    
    // 質の高い入力のヒント
    if (trimmedText.length > 50 && this.hasEmotionalWords(trimmedText)) {
      this.showInputHint('感情の込もった良い入力です！', 'success');
    }
    
    return true;
  }

  /**
   * 感情的な言葉が含まれているかチェック
   */
  hasEmotionalWords(text) {
    const emotionalWords = [
      '不安', '心配', '焦る', '困る', '悩む', '迷う', '怖い', '嬉しい', 
      '楽しい', '悲しい', '怒る', 'やばい', 'まずい', 'やっぱり',
      'でも', 'だけど', 'しかし', 'ただ', 'ちょっと', 'けど'
    ];
    
    return emotionalWords.some(word => text.includes(word));
  }

  /**
   * 入力ヒントの表示
   */
  showInputHint(message, type = 'info') {
    const hintElement = document.createElement('div');
    hintElement.className = `input-hint ${type} fixed top-4 right-4 bg-opacity-90 p-3 rounded-lg text-sm font-medium z-50 transition-all duration-300`;
    
    // タイプ別スタイリング
    switch (type) {
      case 'success':
        hintElement.classList.add('bg-green-600', 'text-white');
        break;
      case 'warning':
        hintElement.classList.add('bg-yellow-600', 'text-white');
        break;
      case 'error':
        hintElement.classList.add('bg-red-600', 'text-white');
        break;
      default:
        hintElement.classList.add('bg-blue-600', 'text-white');
    }
    
    hintElement.textContent = message;
    document.body.appendChild(hintElement);
    
    // フェードイン
    setTimeout(() => {
      hintElement.style.opacity = '1';
      hintElement.style.transform = 'translateY(0)';
    }, 10);
    
    // 自動削除
    setTimeout(() => {
      hintElement.style.opacity = '0';
      hintElement.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (hintElement.parentNode) {
          hintElement.parentNode.removeChild(hintElement);
        }
      }, 300);
    }, 3000);
  }

  /**
   * 入力ガイダンスの表示
   */
  showInputGuidance() {
    // コンソールでのガイダンス表示（必要に応じてUI要素に拡張）
    console.log('💡 入力のコツ：');
    console.log('- ありのままの言葉で書いてください');
    console.log('- 感情や具体的な状況を含めると精度が上がります');
    console.log('- 箇条書きや話し言葉でも構いません');
  }

  /**
   * ボタンフィードバックアニメーション
   */
  animateButtonFeedback(button) {
    // スケールダウン → スケールアップ
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.15s ease';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
    
    // 色の変化
    const originalBg = button.style.backgroundColor;
    button.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
    
    setTimeout(() => {
      button.style.backgroundColor = originalBg;
    }, 500);
  }

  /**
   * クリアフィードバック
   */
  showClearFeedback() {
    this.showInputHint('入力をクリアしました', 'info');
  }

  /**
   * 結果表示レベルの設定
   */
  setResultLevel(level) {
    const resultArea = document.getElementById('resultArea');
    if (!resultArea) return;

    // 既存のレベルクラスを削除
    resultArea.classList.remove('show-summary', 'show-detailed', 'show-complete');
    
    // 新しいレベルを設定
    resultArea.classList.add(`show-${level}`);
    
    console.log(`📊 Result level set to: ${level}`);
  }

  /**
   * 結果セクションのアニメーション
   */
  animateResultSections(level) {
    const sections = document.querySelectorAll('.result-section');
    
    sections.forEach((section, index) => {
      section.classList.remove('visible');
      
      setTimeout(() => {
        const shouldShow = this.shouldShowSection(section, level);
        if (shouldShow) {
          section.classList.add('visible');
        }
      }, index * 100);
    });
  }

  /**
   * セクション表示判定
   */
  shouldShowSection(section, level) {
    if (level === 'summary') {
      return section.classList.contains('summary-level');
    } else if (level === 'detailed') {
      return section.classList.contains('summary-level') || 
             section.classList.contains('detailed-level');
    } else if (level === 'complete') {
      return true; // 完全版はすべて表示
    }
    return false;
  }

  /**
   * 動的プレースホルダー
   */
  startDynamicPlaceholder() {
    const worryInput = document.getElementById('worryInput');
    if (!worryInput) return;

    const placeholders = [
      '例：最近転職を考えているんだけど、今の会社を辞めるタイミングがわからない...',
      '例：恋人との関係がうまくいかない。最近喧嘩が多くて気持ちがすれ違ってる感じがする...',
      '例：将来のことを考えると不安で仕方ない。お金のこと、健康のこと、家族のこと...',
      '例：新しいことを始めたいけど、失敗するのが怖い。年齢的にもこれが最後のチャンスかも...',
      '例：仕事でのプレッシャーがきつくて、毎日残業続き。上司との関係もうまくいかない...'
    ];

    let currentIndex = 0;
    const originalPlaceholder = worryInput.placeholder;

    const rotatePlaceholder = () => {
      if (worryInput.value.length === 0) {
        worryInput.placeholder = placeholders[currentIndex];
        currentIndex = (currentIndex + 1) % placeholders.length;
      }
    };

    // 10秒ごとにプレースホルダーを変更
    setInterval(rotatePlaceholder, 10000);
  }
}

// スタイル拡張
const inputEnhancementStyles = `
  /* Input Enhancement Styles */
  .input-hint {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    transform: translateY(-10px);
    opacity: 0;
  }
  
  .preset-example {
    position: relative;
    overflow: hidden;
  }
  
  .preset-example::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  .preset-example:hover::before {
    left: 100%;
  }
  
  #charCount.warning {
    color: #f59e0b;
  }
  
  #charCount.danger {
    color: #ef4444;
    font-weight: 600;
  }
  
  .result-level-btn.active {
    background: linear-gradient(135deg, #10b981, #059669) !important;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }
  
  .result-level-btn.active span {
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  .result-section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  
  .result-section.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* 表示レベル制御 */
  .show-summary .result-section:not(.summary-level) {
    display: none;
  }
  
  .show-detailed .result-section.complete-level {
    display: none;
  }
  
  .show-complete .result-section {
    display: block;
  }
  
  /* アニメーション遅延 */
  .result-section:nth-child(1) { animation-delay: 0.1s; }
  .result-section:nth-child(2) { animation-delay: 0.2s; }
  .result-section:nth-child(3) { animation-delay: 0.3s; }
  .result-section:nth-child(4) { animation-delay: 0.4s; }
  
  /* レスポンシブ調整 */
  @media (max-width: 768px) {
    .preset-example {
      font-size: 0.75rem;
      padding: 0.5rem;
    }
    
    .input-hint {
      right: 1rem;
      left: 1rem;
      right: auto;
    }
  }
`;

// スタイルをDOMに追加
function addInputEnhancementStyles() {
  if (document.getElementById('input-enhancement-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'input-enhancement-styles';
  style.textContent = inputEnhancementStyles;
  document.head.appendChild(style);
}

// 自動初期化
document.addEventListener('DOMContentLoaded', () => {
  try {
    addInputEnhancementStyles();
    
    const inputEnhancements = new InputEnhancements();
    inputEnhancements.initialize();
    inputEnhancements.startDynamicPlaceholder();
    
    // グローバルに公開
    window.InputEnhancements = inputEnhancements;
    
  } catch (error) {
    console.error('❌ Failed to initialize Input Enhancements:', error);
  }
});

// Node.js環境での対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputEnhancements;
}