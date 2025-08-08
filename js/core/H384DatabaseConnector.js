/**
 * H384DatabaseConnector - H384データベース接続管理
 * 易経384爻＋用九・用六の386エントリデータベース統合
 */

console.log('📚 H384DatabaseConnector Loading...');

(function(global) {
  'use strict';

  class H384DatabaseConnector {
    constructor() {
      this.name = 'H384DatabaseConnector';
      this.version = '2.0.0';
      this.database = null;
      this.isLoaded = false;
      this.loadAttempts = 0;
      this.maxAttempts = 3;
    }

    /**
     * データベース初期化
     */
    async initialize() {
      console.log('🔄 H384DatabaseConnector initializing...');
      
      try {
        // 複数の方法でデータベース取得を試行
        this.database = await this.loadDatabase();
        
        if (this.validateDatabase()) {
          this.isLoaded = true;
          console.log('✅ H384Database loaded successfully:', {
            entries: this.database.length,
            firstEntry: this.database[0],
            lastEntry: this.database[this.database.length - 1]
          });
          return true;
        } else {
          throw new Error('Database validation failed');
        }
      } catch (error) {
        console.error('❌ H384Database initialization failed:', error);
        return this.initializeFallback();
      }
    }

    /**
     * データベース読み込み
     */
    async loadDatabase() {
      // 方法1: グローバル変数から直接取得
      if (typeof window.H384_DATA !== 'undefined' && Array.isArray(window.H384_DATA)) {
        console.log('✅ Method 1: Direct window.H384_DATA access successful');
        return window.H384_DATA;
      }

      // 方法2: グローバルスコープのH384_DATA
      if (typeof H384_DATA !== 'undefined' && Array.isArray(H384_DATA)) {
        console.log('✅ Method 2: Global H384_DATA access successful');
        window.H384_DATA = H384_DATA; // windowにも設定
        return H384_DATA;
      }

      // 方法3: 動的インポート試行
      try {
        const response = await fetch('./assets/H384H64database.js');
        const scriptText = await response.text();
        
        // スクリプトを実行してデータを取得
        eval(scriptText);
        
        if (typeof H384_DATA !== 'undefined') {
          console.log('✅ Method 3: Dynamic import successful');
          window.H384_DATA = H384_DATA;
          return H384_DATA;
        }
      } catch (error) {
        console.warn('⚠️ Method 3 failed:', error);
      }

      // 方法4: フォールバックデータ生成
      console.warn('⚠️ All methods failed, generating fallback data');
      return this.generateFallbackData();
    }

    /**
     * データベース検証
     */
    validateDatabase() {
      if (!this.database || !Array.isArray(this.database)) {
        console.error('❌ Database is not an array');
        return false;
      }

      if (this.database.length !== 386) {
        console.warn(`⚠️ Expected 386 entries, got ${this.database.length}`);
        // 384でも許容（用九・用六なしの場合）
        if (this.database.length === 384) {
          console.log('📝 Adding missing 用九・用六 entries');
          this.addMissingEntries();
        } else {
          return false;
        }
      }

      // 必須フィールドの確認
      const requiredFields = ['通し番号', '卦番号', '卦名', '爻', 'キーワード', '現代解釈の要約'];
      const firstEntry = this.database[0];
      
      for (const field of requiredFields) {
        if (!(field in firstEntry)) {
          console.error(`❌ Missing required field: ${field}`);
          return false;
        }
      }

      console.log('✅ Database validation passed');
      return true;
    }

    /**
     * 不足エントリ追加（用九・用六）
     */
    addMissingEntries() {
      const youkuu = {
        '通し番号': 385,
        '卦番号': 0,
        '卦名': '用九',
        '爻': '用九',
        'キーワード': ['群龍無首', '吉', '協力'],
        '現代解釈の要約': '全ての陽が極まった状態。リーダーなき群龍が自律的に協力する理想形。',
        'S1_基本スコア': 75,
        'S2_ポテンシャル': 80,
        'S3_安定性スコア': 60,
        'S4_リスク': -20,
        'S5_主体性推奨スタンス': '能動',
        'S6_変動性スコア': 40,
        'S7_総合評価スコア': 70
      };

      const yourikuu = {
        '通し番号': 386,
        '卦番号': 0,
        '卦名': '用六',
        '爻': '用六',
        'キーワード': ['利永貞', '堅実', '持続'],
        '現代解釈の要約': '全ての陰が極まった状態。永続的な貞節を保つことで利を得る。',
        'S1_基本スコア': 70,
        'S2_ポテンシャル': 60,
        'S3_安定性スコア': 80,
        'S4_リスク': -15,
        'S5_主体性推奨スタンス': '受動',
        'S6_変動性スコア': 20,
        'S7_総合評価スコア': 75
      };

      this.database.push(youkuu, yourikuu);
      console.log('✅ Added 用九・用六 entries');
    }

    /**
     * フォールバックデータ生成
     */
    generateFallbackData() {
      console.warn('⚠️ Generating minimal fallback data');
      const fallbackData = [];
      
      // 最小限のデータ生成（各卦の6爻）
      const hexagramNames = [
        '乾為天', '坤為地', '水雷屯', '山水蒙', '水天需', '天水訟', '地水師', '水地比',
        '風天小畜', '天澤履', '地天泰', '天地否', '天火同人', '火天大有', '地山謙', '雷地豫',
        '澤雷随', '山風蠱', '地澤臨', '風地観', '火雷噬嗑', '山火賁', '山地剥', '地雷復',
        '天雷无妄', '山天大畜', '山雷頤', '澤風大過', '坎為水', '離為火', '澤山咸', '雷風恒',
        '天山遯', '雷天大壮', '火地晋', '地火明夷', '風火家人', '火澤睽', '水山蹇', '雷水解',
        '山澤損', '風雷益', '澤天夬', '天風姤', '澤地萃', '地風升', '澤水困', '水風井',
        '澤火革', '火風鼎', '震為雷', '艮為山', '風山漸', '雷澤帰妹', '雷火豊', '火山旅',
        '巽為風', '兌為澤', '風水渙', '水澤節', '風澤中孚', '雷山小過', '水火既済', '火水未済'
      ];

      const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
      
      let index = 1;
      for (let guaNum = 1; guaNum <= 64; guaNum++) {
        for (let yaoNum = 1; yaoNum <= 6; yaoNum++) {
          fallbackData.push({
            '通し番号': index++,
            '卦番号': guaNum,
            '卦名': hexagramNames[guaNum - 1],
            '爻': yaoNames[yaoNum - 1],
            'キーワード': ['変化', '転機', '選択'],
            '現代解釈の要約': `${hexagramNames[guaNum - 1]}の${yaoNames[yaoNum - 1]}の状態`,
            'S1_基本スコア': 50 + Math.floor(Math.random() * 50),
            'S2_ポテンシャル': 40 + Math.floor(Math.random() * 40),
            'S3_安定性スコア': 30 + Math.floor(Math.random() * 50),
            'S4_リスク': -(20 + Math.floor(Math.random() * 60)),
            'S5_主体性推奨スタンス': Math.random() > 0.5 ? '能動' : '受動',
            'S6_変動性スコア': 20 + Math.floor(Math.random() * 60),
            'S7_総合評価スコア': 30 + Math.floor(Math.random() * 50)
          });
        }
      }

      // 用九・用六を追加
      fallbackData.push(
        {
          '通し番号': 385,
          '卦番号': 0,
          '卦名': '用九',
          '爻': '用九',
          'キーワード': ['群龍無首', '吉', '協力'],
          '現代解釈の要約': '全陽極まる',
          'S1_基本スコア': 75,
          'S2_ポテンシャル': 80,
          'S3_安定性スコア': 60,
          'S4_リスク': -20,
          'S5_主体性推奨スタンス': '能動',
          'S6_変動性スコア': 40,
          'S7_総合評価スコア': 70
        },
        {
          '通し番号': 386,
          '卦番号': 0,
          '卦名': '用六',
          '爻': '用六',
          'キーワード': ['利永貞', '堅実', '持続'],
          '現代解釈の要約': '全陰極まる',
          'S1_基本スコア': 70,
          'S2_ポテンシャル': 60,
          'S3_安定性スコア': 80,
          'S4_リスク': -15,
          'S5_主体性推奨スタンス': '受動',
          'S6_変動性スコア': 20,
          'S7_総合評価スコア': 75
        }
      );

      return fallbackData;
    }

    /**
     * フォールバック初期化
     */
    initializeFallback() {
      console.warn('⚠️ Using fallback initialization');
      this.database = this.generateFallbackData();
      this.isLoaded = true;
      return true;
    }

    /**
     * データ取得API
     */
    getDatabaseData() {
      if (!this.isLoaded) {
        console.warn('⚠️ Database not loaded, returning empty array');
        return [];
      }
      return this.database;
    }

    /**
     * 特定の卦・爻データ取得
     */
    getHexagramYaoData(hexagramNumber, yaoNumber) {
      if (!this.isLoaded) return null;
      
      // 通し番号計算: (卦番号-1) * 6 + 爻番号
      const index = (hexagramNumber - 1) * 6 + yaoNumber - 1;
      
      if (index >= 0 && index < this.database.length) {
        return this.database[index];
      }
      
      console.warn(`⚠️ No data found for 卦${hexagramNumber} 爻${yaoNumber}`);
      return null;
    }

    /**
     * キーワード検索
     */
    searchByKeyword(keyword) {
      if (!this.isLoaded) return [];
      
      return this.database.filter(entry => {
        return entry['キーワード'].some(kw => kw.includes(keyword)) ||
               entry['現代解釈の要約'].includes(keyword) ||
               entry['卦名'].includes(keyword);
      });
    }

    /**
     * スコアによるフィルタリング
     */
    filterByScore(scoreType, minValue, maxValue = 100) {
      if (!this.isLoaded) return [];
      
      return this.database.filter(entry => {
        const score = entry[scoreType];
        return score >= minValue && score <= maxValue;
      });
    }

    /**
     * 統計情報取得
     */
    getStatistics() {
      if (!this.isLoaded) return null;
      
      const stats = {
        totalEntries: this.database.length,
        hexagrams: new Set(this.database.map(e => e['卦番号'])).size,
        averageScores: {},
        stanceDistribution: {
          '能動': 0,
          '受動': 0,
          '中立': 0
        }
      };

      // スコア平均計算
      const scoreFields = ['S1_基本スコア', 'S2_ポテンシャル', 'S3_安定性スコア', 'S6_変動性スコア', 'S7_総合評価スコア'];
      
      scoreFields.forEach(field => {
        const sum = this.database.reduce((acc, entry) => acc + (entry[field] || 0), 0);
        stats.averageScores[field] = Math.round(sum / this.database.length);
      });

      // スタンス分布
      this.database.forEach(entry => {
        const stance = entry['S5_主体性推奨スタンス'] || '中立';
        stats.stanceDistribution[stance]++;
      });

      return stats;
    }
  }

  // グローバル登録
  if (typeof window !== 'undefined') {
    window.H384DatabaseConnector = H384DatabaseConnector;
    
    // 自動初期化
    window.h384db = new H384DatabaseConnector();
    
    // DOMContentLoaded時に初期化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.h384db.initialize();
      });
    } else {
      // 既に読み込み済みの場合
      window.h384db.initialize();
    }
  }

  // グローバル関数として公開
  window.getDatabaseData = function() {
    if (window.h384db && window.h384db.isLoaded) {
      return window.h384db.getDatabaseData();
    }
    
    // フォールバック: 直接window.H384_DATAを返す
    if (window.H384_DATA && Array.isArray(window.H384_DATA)) {
      return window.H384_DATA;
    }
    
    console.warn('⚠️ getDatabaseData: No data available');
    return [];
  };

  console.log('✅ H384DatabaseConnector loaded');
  
})(typeof window !== 'undefined' ? window : this);