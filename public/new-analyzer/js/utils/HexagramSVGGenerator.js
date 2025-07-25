// HexagramSVGGenerator.js - 卦のSVG生成システム
// 64卦のSVG構造を動的に生成し、線描画アニメーションを提供

class HexagramSVGGenerator {
  constructor() {
    this.hexagramStructures = this.initializeHexagramStructures();
  }
  
  /**
   * 64卦の構造データを初期化
   * 各卦は下から上へ6つの爻（線）で構成される
   * yang: 実線（陽爻）, yin: 破線（陰爻）
   */
  initializeHexagramStructures() {
    return {
      1: { lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yang'], name: '乾為天' },
      2: { lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yin'], name: '坤為地' },
      3: { lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yin'], name: '水雷屯' },
      4: { lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'], name: '山水蒙' },
      5: { lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yang'], name: '水天需' },
      6: { lines: ['yang', 'yang', 'yang', 'yin', 'yang', 'yang'], name: '天水訟' },
      7: { lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yin'], name: '地水師' },
      8: { lines: ['yin', 'yin', 'yin', 'yin', 'yang', 'yin'], name: '水地比' },
      9: { lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yang'], name: '風天小畜' },
      10: { lines: ['yang', 'yang', 'yin', 'yang', 'yang', 'yang'], name: '天沢履' },
      11: { lines: ['yang', 'yang', 'yang', 'yin', 'yin', 'yin'], name: '地天泰' },
      12: { lines: ['yin', 'yin', 'yin', 'yang', 'yang', 'yang'], name: '天地否' },
      13: { lines: ['yang', 'yin', 'yang', 'yang', 'yang', 'yang'], name: '天火同人' },
      14: { lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yang'], name: '火天大有' },
      15: { lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yin'], name: '地山謙' },
      16: { lines: ['yin', 'yin', 'yin', 'yang', 'yin', 'yin'], name: '雷地豫' },
      17: { lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yang'], name: '沢雷随' },
      18: { lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yang'], name: '山風蠱' },
      19: { lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yin'], name: '地沢臨' },
      20: { lines: ['yin', 'yin', 'yin', 'yin', 'yang', 'yang'], name: '風地観' },
      21: { lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'], name: '火雷噬嗑' },
      22: { lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yang'], name: '山火賁' },
      23: { lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yang'], name: '山地剥' },
      24: { lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yin'], name: '地雷復' },
      25: { lines: ['yang', 'yin', 'yin', 'yang', 'yang', 'yang'], name: '天雷無妄' },
      26: { lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yin'], name: '山天大畜' },
      27: { lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yang'], name: '山雷頤' },
      28: { lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yin'], name: '沢風大過' },
      29: { lines: ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'], name: '坎為水' },
      30: { lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'], name: '離為火' },
      31: { lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yin'], name: '沢山咸' },
      32: { lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yin'], name: '雷風恒' },
      33: { lines: ['yin', 'yin', 'yang', 'yang', 'yang', 'yang'], name: '天山遯' },
      34: { lines: ['yang', 'yang', 'yang', 'yang', 'yin', 'yin'], name: '雷天大壮' },
      35: { lines: ['yin', 'yin', 'yin', 'yang', 'yin', 'yang'], name: '火地晋' },
      36: { lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yin'], name: '地火明夷' },
      37: { lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'], name: '風火家人' },
      38: { lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'], name: '火沢睽' },
      39: { lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'], name: '水山蹇' },
      40: { lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yin'], name: '雷水解' },
      41: { lines: ['yang', 'yang', 'yin', 'yin', 'yin', 'yang'], name: '山沢損' },
      42: { lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yang'], name: '風雷益' },
      43: { lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yin'], name: '沢天夬' },
      44: { lines: ['yin', 'yang', 'yang', 'yang', 'yang', 'yang'], name: '天風姤' },
      45: { lines: ['yin', 'yin', 'yin', 'yin', 'yin', 'yang'], name: '沢地萃' },
      46: { lines: ['yang', 'yin', 'yin', 'yin', 'yin', 'yang'], name: '地風升' },
      47: { lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'], name: '沢水困' },
      48: { lines: ['yang', 'yin', 'yin', 'yin', 'yang', 'yin'], name: '水風井' },
      49: { lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yang'], name: '沢火革' },
      50: { lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yang'], name: '火風鼎' },
      51: { lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'], name: '震為雷' },
      52: { lines: ['yin', 'yin', 'yang', 'yin', 'yin', 'yang'], name: '艮為山' },
      53: { lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yang'], name: '風山漸' },
      54: { lines: ['yang', 'yin', 'yang', 'yin', 'yin', 'yang'], name: '雷沢帰妹' },
      55: { lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yin'], name: '雷火豊' },
      56: { lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yang'], name: '火山旅' },
      57: { lines: ['yang', 'yin', 'yang', 'yang', 'yin', 'yang'], name: '巽為風' },
      58: { lines: ['yang', 'yin', 'yin', 'yang', 'yin', 'yin'], name: '兌為沢' },
      59: { lines: ['yang', 'yin', 'yang', 'yin', 'yang', 'yin'], name: '風水渙' },
      60: { lines: ['yin', 'yang', 'yin', 'yin', 'yin', 'yang'], name: '水沢節' },
      61: { lines: ['yang', 'yang', 'yin', 'yin', 'yang', 'yang'], name: '風沢中孚' },
      62: { lines: ['yin', 'yin', 'yang', 'yang', 'yin', 'yin'], name: '雷山小過' },
      63: { lines: ['yang', 'yin', 'yang', 'yin', 'yang', 'yin'], name: '水火既済' },
      64: { lines: ['yin', 'yang', 'yin', 'yang', 'yin', 'yang'], name: '火水未済' }
    };
  }
  
  /**
   * 指定された卦のSVGを生成
   */
  generateSVG(hexagramId, options = {}) {
    const {
      width = 100,
      height = 200,
      strokeWidth = 3,
      lineSpacing = 25,
      startY = 30,
      className = 'hexagram-lines',
      animated = true
    } = options;
    
    const hexagramData = this.getHexagramStructure(hexagramId);
    if (!hexagramData) {
      console.warn(`Hexagram ${hexagramId} not found, using default`);
      return this.generateDefaultSVG(options);
    }
    
    const lines = hexagramData.lines.map((lineType, index) => 
      this.generateLine(lineType, index, {
        width,
        strokeWidth,
        lineSpacing,
        startY,
        animated
      })
    ).join('');
    
    return `
      <svg viewBox="0 0 ${width} ${height}" class="${className}" data-hexagram-id="${hexagramId}">
        <title>${hexagramData.name}</title>
        <desc>卦象：${hexagramData.name} (第${hexagramId}卦)</desc>
        ${lines}
      </svg>
    `;
  }
  
  /**
   * 個別の爻（線）を生成
   */
  generateLine(lineType, position, options = {}) {
    const {
      width = 100,
      strokeWidth = 3,
      lineSpacing = 25,
      startY = 30,
      animated = true
    } = options;
    
    const y = startY + (5 - position) * lineSpacing; // 下から上へ（伝統的な順序）
    const padding = width * 0.2; // 左右のパディング
    const lineStart = padding;
    const lineEnd = width - padding;
    const lineCenter = width / 2;
    const gapSize = width * 0.1; // 陰爻の隙間サイズ
    
    const animationProps = animated ? {
      'stroke-dasharray': '60',
      'stroke-dashoffset': '60',
      'class': `${lineType}-line animated-line`
    } : {
      'class': `${lineType}-line`
    };
    
    if (lineType === 'yang') {
      // 陽爻（実線）
      return `
        <line 
          x1="${lineStart}" 
          y1="${y}" 
          x2="${lineEnd}" 
          y2="${y}" 
          stroke="currentColor" 
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          ${Object.entries(animationProps).map(([key, value]) => `${key}="${value}"`).join(' ')}
        />
      `;
    } else {
      // 陰爻（破線）
      return `
        <line 
          x1="${lineStart}" 
          y1="${y}" 
          x2="${lineCenter - gapSize/2}" 
          y2="${y}" 
          stroke="currentColor" 
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          ${Object.entries(animationProps).map(([key, value]) => `${key}="${value}"`).join(' ')}
        />
        <line 
          x1="${lineCenter + gapSize/2}" 
          y1="${y}" 
          x2="${lineEnd}" 
          y2="${y}" 
          stroke="currentColor" 
          stroke-width="${strokeWidth}"
          stroke-linecap="round"
          ${Object.entries(animationProps).map(([key, value]) => `${key}="${value}"`).join(' ')}
        />
      `;
    }
  }
  
  /**
   * デフォルトSVGを生成（データが見つからない場合）
   */
  generateDefaultSVG(options = {}) {
    const { width = 100, height = 200, className = 'hexagram-lines' } = options;
    
    return `
      <svg viewBox="0 0 ${width} ${height}" class="${className}">
        <title>デフォルト卦</title>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
              fill="currentColor" font-size="12">卦</text>
      </svg>
    `;
  }
  
  /**
   * 卦の構造データを取得
   */
  getHexagramStructure(hexagramId) {
    return this.hexagramStructures[hexagramId] || null;
  }
  
  /**
   * アニメーション付きSVGを生成（背景用）
   */
  generateBackgroundSVG(hexagramId, options = {}) {
    const {
      opacity = 0.1,
      size = 300,
      className = 'hexagram-background'
    } = options;
    
    const svg = this.generateSVG(hexagramId, {
      width: size,
      height: size * 2,
      strokeWidth: 4,
      lineSpacing: size / 8,
      startY: size / 6,
      className: className,
      animated: true
    });
    
    return svg.replace('<svg', `<svg style="opacity: ${opacity}"`);
  }
  
  /**
   * 複数の卦を組み合わせたSVGを生成
   */
  generateCombinedSVG(hexagramIds, options = {}) {
    const {
      spacing = 120,
      containerWidth = hexagramIds.length * spacing
    } = options;
    
    const svgs = hexagramIds.map((id, index) => {
      const x = index * spacing;
      const svg = this.generateSVG(id, { ...options, animated: false });
      
      // SVGを指定位置に配置
      return `<g transform="translate(${x}, 0)">${
        svg.replace(/<svg[^>]*>|<\/svg>/g, '')
      }</g>`;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${containerWidth} 200" class="combined-hexagrams">
        ${svgs}
      </svg>
    `;
  }
  
  /**
   * 卦の名前を取得
   */
  getHexagramName(hexagramId) {
    const structure = this.getHexagramStructure(hexagramId);
    return structure ? structure.name : '未定義';
  }
  
  /**
   * 全ての卦のリストを取得
   */
  getAllHexagrams() {
    return Object.keys(this.hexagramStructures).map(id => ({
      id: parseInt(id),
      name: this.hexagramStructures[id].name,
      lines: this.hexagramStructures[id].lines
    }));
  }
  
  /**
   * SVGアニメーション用のCSSを生成
   */
  generateAnimationCSS() {
    return `
      .animated-line {
        animation: drawHexagramLine 1s ease-out forwards;
      }
      
      .yang-line:nth-child(1) { animation-delay: 0s; }
      .yang-line:nth-child(2) { animation-delay: 0.2s; }
      .yang-line:nth-child(3) { animation-delay: 0.4s; }
      .yang-line:nth-child(4) { animation-delay: 0.6s; }
      .yang-line:nth-child(5) { animation-delay: 0.8s; }
      .yang-line:nth-child(6) { animation-delay: 1s; }
      
      .yin-line:nth-child(1) { animation-delay: 0s; }
      .yin-line:nth-child(2) { animation-delay: 0.1s; }
      .yin-line:nth-child(3) { animation-delay: 0.2s; }
      .yin-line:nth-child(4) { animation-delay: 0.3s; }
      .yin-line:nth-child(5) { animation-delay: 0.4s; }
      .yin-line:nth-child(6) { animation-delay: 0.5s; }
      
      @keyframes drawHexagramLine {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      .hexagram-background {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        pointer-events: none;
      }
    `;
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.HexagramSVGGenerator = HexagramSVGGenerator;
}

