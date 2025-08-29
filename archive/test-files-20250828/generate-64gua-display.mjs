import { readFile } from 'fs/promises';

async function generate64GuaDisplay() {
  try {
    // V3データベースファイルを読み込む
    const v3Content = await readFile('./public/js/data/hexagram-human-traits-v3.js', 'utf-8');
    
    // windowオブジェクトを模擬
    const window = {};
    eval(v3Content);
    
    const v3Data = window.HexagramHumanTraitsV3;
    
    console.log('=== 64卦完全リスト生成 ===\n');
    
    // 64卦のJavaScriptオブジェクトを生成
    let jsContent = 'const all64Hexagrams = [\n';
    
    Object.entries(v3Data).forEach(([name, data], index) => {
      jsContent += `  {
    id: ${data.id},
    name: "${name}",
    symbol: "${data.symbol}",
    element: "${data.element}",
    nickname: "${data.nickname}",
    emoji: "${data.emoji}"
  }${index < 63 ? ',' : ''}\n`;
    });
    
    jsContent += '];\n';
    
    // HTMLセクションを生成
    let htmlContent = `
<!-- 64卦完全表示セクション -->
<section class="hexagram-64-section">
    <div class="hexagram-64-container">
        <div class="hexagram-64-header">
            <h2 class="hexagram-64-title">
                <span style="font-size: 1.5rem;">☰☱☲☳☴☵☶☷</span><br>
                易経六十四卦
            </h2>
            <p class="hexagram-64-subtitle">
                The Complete 64 Hexagrams of I Ching<br>
                あなたの特性を構成する3つの卦
            </p>
        </div>
        
        <div class="hexagram-grid">
`;

    // 8x8のグリッドで表示
    Object.entries(v3Data).forEach(([name, data]) => {
      const isSelected = false; // 後で動的に判定
      htmlContent += `            <div class="hexagram-item" data-name="${name}" data-id="${data.id}">
                <div class="hexagram-symbol">${data.symbol}</div>
                <div class="hexagram-number">${data.id}</div>
                <div class="hexagram-name">${name}</div>
                <div class="hexagram-nickname">${data.nickname}</div>
            </div>\n`;
    });

    htmlContent += `        </div>
        
        <div class="hexagram-legend">
            <div class="legend-item">
                <span class="legend-dot engine"></span>
                <span>原動力 (Engine OS)</span>
            </div>
            <div class="legend-item">
                <span class="legend-dot interface"></span>
                <span>人との関わり (Interface OS)</span>
            </div>
            <div class="legend-item">
                <span class="legend-dot safemode"></span>
                <span>ストレス対処 (SafeMode OS)</span>
            </div>
        </div>
    </div>
</section>`;

    // CSSスタイル
    const cssContent = `
/* 64卦表示セクション */
.hexagram-64-section {
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
    color: white;
    padding: var(--spacing-2xl) var(--spacing-lg);
    position: relative;
}

.hexagram-64-container {
    max-width: 1200px;
    margin: 0 auto;
}

.hexagram-64-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
}

.hexagram-64-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 var(--spacing-md) 0;
    color: white;
}

.hexagram-64-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    line-height: 1.6;
}

.hexagram-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 2px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px;
    border-radius: 12px;
    margin-bottom: var(--spacing-xl);
}

.hexagram-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--spacing-sm);
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.hexagram-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
    z-index: 10;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.hexagram-item.selected-engine {
    background: linear-gradient(135deg, var(--engine-color) 0%, var(--engine-dark) 100%);
    border-color: var(--engine-color);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.hexagram-item.selected-interface {
    background: linear-gradient(135deg, var(--interface-color) 0%, var(--interface-dark) 100%);
    border-color: var(--interface-color);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.hexagram-item.selected-safemode {
    background: linear-gradient(135deg, var(--safemode-color) 0%, var(--safemode-dark) 100%);
    border-color: var(--safemode-color);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.hexagram-symbol {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    font-weight: bold;
}

.hexagram-number {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 0.25rem;
}

.hexagram-name {
    font-size: 0.65rem;
    line-height: 1.2;
    margin-bottom: 0.25rem;
}

.hexagram-nickname {
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
}

.hexagram-legend {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-lg);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.legend-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
}

.legend-dot.engine {
    background: var(--engine-color);
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.legend-dot.interface {
    background: var(--interface-color);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.legend-dot.safemode {
    background: var(--safemode-color);
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .hexagram-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .hexagram-symbol {
        font-size: 1.2rem;
    }
    
    .hexagram-name {
        font-size: 0.55rem;
    }
}`;

    console.log('生成完了！');
    console.log('\n=== JavaScriptオブジェクト ===');
    console.log(jsContent.substring(0, 500) + '...');
    console.log('\n=== HTMLセクション ===');
    console.log(htmlContent.substring(0, 500) + '...');
    console.log('\n=== CSSスタイル ===');
    console.log(cssContent.substring(0, 500) + '...');
    
    return { jsContent, htmlContent, cssContent };
    
  } catch (error) {
    console.error('エラー:', error);
  }
}

generate64GuaDisplay();