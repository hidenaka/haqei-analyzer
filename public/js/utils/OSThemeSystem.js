// OSThemeSystem.js - OS別テーマカラーシステム
// 64卦それぞれに対応したテーマカラーとスタイリング

class OSThemeSystem {
  constructor() {
    this.currentTheme = null;
    this.themeMap = this.initializeThemeMap();
  }
  
  /**
   * 64卦のテーマカラーマッピングを初期化
   */
  initializeThemeMap() {
    return {
      // 乾為天系 - 創造・リーダーシップ系
      1: { primary: '#FF6B35', secondary: '#F7931E', name: 'keniten', label: '乾為天' },
      14: { primary: '#FF4500', secondary: '#FF6347', name: 'daiyuu', label: '大有' },
      34: { primary: '#FF2D00', secondary: '#FF5733', name: 'daiso', label: '大壮' },
      43: { primary: '#FF1744', secondary: '#E91E63', name: 'ketsu', label: '夬' },
      
      // 坤為地系 - 受容・安定系
      2: { primary: '#8B4513', secondary: '#D2691E', name: 'konichi', label: '坤為地' },
      7: { primary: '#A0522D', secondary: '#CD853F', name: 'shi', label: '師' },
      15: { primary: '#654321', secondary: '#8B7355', name: 'ken', label: '謙' },
      16: { primary: '#8B6914', secondary: '#DAA520', name: 'yo', label: '豫' },
      
      // 水雷屯系 - 困難・成長系
      3: { primary: '#1E90FF', secondary: '#00BFFF', name: 'chun', label: '水雷屯' },
      17: { primary: '#4169E1', secondary: '#6495ED', name: 'zui', label: '沢雷随' },
      21: { primary: '#0000CD', secondary: '#4169E1', name: 'shiko', label: '火雷噬嗑' },
      51: { primary: '#1E3A8A', secondary: '#3B82F6', name: 'shin', label: '震為雷' },
      
      // 山水蒙系 - 学習・発展系
      4: { primary: '#32CD32', secondary: '#98FB98', name: 'mou', label: '山水蒙' },
      18: { primary: '#228B22', secondary: '#90EE90', name: 'ko', label: '山風盅' },
      26: { primary: '#006400', secondary: '#7CFC00', name: 'daikiku', label: '山天大畜' },
      41: { primary: '#2E7D32', secondary: '#66BB6A', name: 'son', label: '山沢損' },
      
      // 水天需系 - 待機・準備系
      5: { primary: '#87CEEB', secondary: '#ADD8E6', name: 'ju', label: '水天需' },
      9: { primary: '#4682B4', secondary: '#B0C4DE', name: 'shochiku', label: '風天小畜' },
      26: { primary: '#5F9EA0', secondary: '#AFEEEE', name: 'daikiku', label: '山天大畜' },
      11: { primary: '#00CED1', secondary: '#48D1CC', name: 'tai', label: '地天泰' },
      
      // 天水訟系 - 対立・調整系
      6: { primary: '#DC143C', secondary: '#F08080', name: 'sho', label: '天水訟' },
      10: { primary: '#B22222', secondary: '#CD5C5C', name: 'ri', label: '天沢履' },
      25: { primary: '#8B0000', secondary: '#A52A2A', name: 'mubou', label: '天雷無妄' },
      44: { primary: '#DC143C', secondary: '#FF6B6B', name: 'kou', label: '天風姤' },
      
      // 地水師系 - 組織・統制系
      7: { primary: '#2F4F4F', secondary: '#708090', name: 'shi', label: '地水師' },
      46: { primary: '#556B2F', secondary: '#8FBC8F', name: 'sho', label: '地風升' },
      24: { primary: '#191970', secondary: '#6A5ACD', name: 'fuku', label: '地雷復' },
      19: { primary: '#483D8B', secondary: '#9370DB', name: 'rin', label: '地沢臨' },
      
      // 水地比系 - 親和・協調系
      8: { primary: '#4169E1', secondary: '#7B68EE', name: 'hi', label: '水地比' },
      20: { primary: '#6A5ACD', secondary: '#9932CC', name: 'kan', label: '風地観' },
      23: { primary: '#8B008B', secondary: '#DA70D6', name: 'hakusan', label: '山地剥' },
      35: { primary: '#9400D3', secondary: '#BA55D3', name: 'shin', label: '火地晋' },
      
      // 風天小畜系 - 蓄積・準備系
      9: { primary: '#20B2AA', secondary: '#48D1CC', name: 'shochiku', label: '風天小畜' },
      37: { primary: '#008B8B', secondary: '#40E0D0', name: 'kaji', label: '風火家人' },
      42: { primary: '#5F9EA0', secondary: '#B0E0E6', name: 'eki', label: '風雷益' },
      57: { primary: '#4682B4', secondary: '#87CEEB', name: 'son', label: '巽為風' },
      
      // デフォルト・その他の卦
      12: { primary: '#696969', secondary: '#A9A9A9', name: 'hi', label: '天地否' },
      13: { primary: '#FF69B4', secondary: '#FFB6C1', name: 'dougen', label: '天火同人' },
      22: { primary: '#FF1493', secondary: '#FF69B4', name: 'hi', label: '山火賁' },
      27: { primary: '#32CD32', secondary: '#7FFF00', name: 'igan', label: '山雷頤' },
      28: { primary: '#FFD700', secondary: '#FFFF00', name: 'taikakako', label: '沢風大過' },
      29: { primary: '#00008B', secondary: '#0000FF', name: 'kan', label: '坎為水' },
      30: { primary: '#FF4500', secondary: '#FF6347', name: 'ri', label: '離為火' },
      31: { primary: '#DDA0DD', secondary: '#EE82EE', name: 'kan', label: '沢山咸' },
      32: { primary: '#7FFF00', secondary: '#ADFF2F', name: 'kou', label: '雷風恒' },
      33: { primary: '#D2691E', secondary: '#F4A460', name: 'ton', label: '天山遯' },
      36: { primary: '#8B0000', secondary: '#DC143C', name: 'meii', label: '地火明夷' },
      38: { primary: '#FF6347', secondary: '#FFA07A', name: 'kei', label: '火沢睽' },
      39: { primary: '#4169E1', secondary: '#6495ED', name: 'ken', label: '水山蹇' },
      40: { primary: '#32CD32', secondary: '#98FB98', name: 'kai', label: '雷水解' },
      45: { primary: '#9370DB', secondary: '#BA55D3', name: 'sui', label: '沢地萃' },
      47: { primary: '#2F4F4F', secondary: '#696969', name: 'kon', label: '沢水困' },
      48: { primary: '#008B8B', secondary: '#20B2AA', name: 'sei', label: '水風井' },
      49: { primary: '#FF4500', secondary: '#FF8C00', name: 'kakumei', label: '沢火革' },
      50: { primary: '#8B4513', secondary: '#D2691E', name: 'tei', label: '火風鼎' },
      52: { primary: '#2E8B57', secondary: '#3CB371', name: 'kon', label: '艮為山' },
      53: { primary: '#228B22', secondary: '#32CD32', name: 'zen', label: '風山漸' },
      54: { primary: '#FF1493', secondary: '#FF69B4', name: 'kibo', label: '雷沢帰妹' },
      55: { primary: '#FFD700', secondary: '#FFA500', name: 'raifuu', label: '雷火豊' },
      56: { primary: '#FF4500', secondary: '#FF6347', name: 'ryozan', label: '火山旅' },
      58: { primary: '#DA70D6', secondary: '#EE82EE', name: 'da', label: '兌為沢' },
      59: { primary: '#1E90FF', secondary: '#87CEFA', name: 'kan', label: '風水渙' },
      60: { primary: '#4682B4', secondary: '#5F9EA0', name: 'setsu', label: '水沢節' },
      61: { primary: '#FF69B4', secondary: '#FFB6C1', name: 'chujutsu', label: '風沢中孚' },
      62: { primary: '#2E8B57', secondary: '#90EE90', name: 'shouka', label: '雷山小過' },
      63: { primary: '#B22222', secondary: '#CD5C5C', name: 'kisai', label: '水火既済' },
      64: { primary: '#FF6347', secondary: '#FFA07A', name: 'misai', label: '火水未済' }
    };
  }
  
  /**
   * OS（卦）に対応するテーマを取得
   */
  getThemeForOS(hexagramId) {
    const theme = this.themeMap[hexagramId];
    if (!theme) {
      console.warn(`Theme not found for hexagram ${hexagramId}, using default`);
      return {
        primary: '#6366F1',
        secondary: '#8B5CF6', 
        name: 'default',
        label: '未定義'
      };
    }
    return theme;
  }
  
  /**
   * テーマを適用
   */
  applyTheme(hexagramId) {
    const theme = this.getThemeForOS(hexagramId);
    this.currentTheme = theme;
    
    // body要素にテーマ属性を設定
    document.body.setAttribute('data-theme', theme.name);
    
    // CSS カスタムプロパティを設定
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-primary-rgb', this.hexToRgb(theme.primary));
    document.documentElement.style.setProperty('--theme-secondary-rgb', this.hexToRgb(theme.secondary));
    
    // テーマの明度に基づいてテキストカラーを調整
    const brightness = this.getBrightness(theme.primary);
    const textColor = brightness > 128 ? '#000000' : '#FFFFFF';
    document.documentElement.style.setProperty('--theme-text', textColor);
    
    console.log(`Applied theme: ${theme.name} (${theme.label}) - Primary: ${theme.primary}`);
    
    return theme;
  }
  
  /**
   * 現在のテーマを取得
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * テーマのグラデーションを生成
   */
  getThemeGradient(hexagramId, direction = '135deg') {
    const theme = this.getThemeForOS(hexagramId);
    return `linear-gradient(${direction}, ${theme.primary}, ${theme.secondary})`;
  }
  
  /**
   * テーマカラーのバリエーションを生成
   */
  getThemeVariations(hexagramId) {
    const theme = this.getThemeForOS(hexagramId);
    return {
      light: this.lightenColor(theme.primary, 20),
      dark: this.darkenColor(theme.primary, 20),
      alpha50: this.addAlpha(theme.primary, 0.5),
      alpha20: this.addAlpha(theme.primary, 0.2),
      alpha10: this.addAlpha(theme.primary, 0.1)
    };
  }
  
  /**
   * Hex カラーを RGB に変換
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  }
  
  /**
   * カラーの明度を計算
   */
  getBrightness(hex) {
    const rgb = this.hexToRgb(hex).split(', ').map(Number);
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  }
  
  /**
   * カラーを明るくする
   */
  lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  
  /**
   * カラーを暗くする
   */
  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }
  
  /**
   * カラーにアルファ値を追加
   */
  addAlpha(hex, alpha) {
    const rgb = this.hexToRgb(hex);
    return `rgba(${rgb}, ${alpha})`;
  }
  
  /**
   * 全テーマ一覧を取得
   */
  getAllThemes() {
    return this.themeMap;
  }
  
  /**
   * テーマをリセット
   */
  resetTheme() {
    document.body.removeAttribute('data-theme');
    
    const customProperties = [
      '--theme-primary',
      '--theme-secondary', 
      '--theme-primary-rgb',
      '--theme-secondary-rgb',
      '--theme-text'
    ];
    
    customProperties.forEach(prop => {
      document.documentElement.style.removeProperty(prop);
    });
    
    this.currentTheme = null;
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.OSThemeSystem = OSThemeSystem;
}

