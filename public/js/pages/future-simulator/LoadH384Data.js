/**
 * H384データベースからのテンプレート生成ユーティリティ
 * 
 * 目的：
 * - 既存のH384_DATAから386爻のテンプレートを自動生成
 * - データベースの情報をSNS文章生成用に変換
 * - キーワードと現代解釈を活用した感情マッピング
 * 
 * 前提条件：
 * - H384H64database.jsが読み込まれている
 * - HexagramPatternTemplatesクラスが利用可能
 */
class LoadH384Data {
  /**
   * H384データからテンプレートを生成
   * 
   * 目的：
   * - 386爻すべてのテンプレートを一括生成
   * - データベースの情報を適切に変換
   * 
   * 処理内容：
   * 1. H384_DATAの各エントリを処理
   * 2. 感情・状況タイプを推定
   * 3. SNSパターンを生成
   * 
   * 出力：
   * - 完全な386爻テンプレート
   */
  static generateTemplatesFromH384() {
    if (typeof H384_DATA === 'undefined') {
      throw new Error('H384_DATAが読み込まれていません');
    }

    const templates = {};
    
    // H384_DATAをループして処理
    H384_DATA.forEach(entry => {
      const hexNum = entry['卦番号'];
      const lineText = entry['爻'];
      
      // 卦が存在しない場合は初期化
      if (!templates[hexNum]) {
        templates[hexNum] = {
          name: entry['卦名'],
          theme: this.extractTheme(entry['卦名']),
          lines: {}
        };
      }
      
      // 爻番号を抽出（初九→1、九二→2、...、用九→'用九'）
      const lineNum = this.extractLineNumber(lineText);
      
      // テンプレート生成
      templates[hexNum].lines[lineNum] = this.createLineTemplateFromEntry(entry);
    });
    
    return templates;
  }

  /**
   * 卦名からテーマを抽出
   */
  static extractTheme(hexagramName) {
    const themeMap = {
      '乾為天': '創造と主導',
      '坤為地': '受容と従順',
      '水雷屯': '始まりの困難と成長',
      '山水蒙': '無知と学び',
      '水天需': '待機と準備',
      '天水訟': '対立と調和',
      '地水師': '統率と組織',
      '水地比': '親和と協調',
      // ... 他の卦も追加
    };
    
    return themeMap[hexagramName] || '変化と成長';
  }

  /**
   * 爻テキストから番号を抽出
   */
  static extractLineNumber(lineText) {
    const lineMap = {
      '初九': 1, '初六': 1,
      '九二': 2, '六二': 2,
      '九三': 3, '六三': 3,
      '九四': 4, '六四': 4,
      '九五': 5, '六五': 5,
      '上九': 6, '上六': 6,
      '用九': '用九',
      '用六': '用六'
    };
    
    return lineMap[lineText] || 1;
  }

  /**
   * H384エントリから爻テンプレートを生成
   */
  static createLineTemplateFromEntry(entry) {
    // 感情を推定
    const emotions = this.estimateEmotions(entry);
    const emotionWeight = this.calculateEmotionWeight(emotions, entry);
    
    // 状況タイプを判定
    const situationType = this.determineSituationType(entry);
    
    // SNSパターンを生成
    const snsPatterns = this.generateSNSPatterns(entry);
    
    return {
      hexagram: entry['卦番号'],
      line: this.extractLineNumber(entry['爻']),
      situation: entry['爻'] + ' - ' + entry['キーワード'].join('・'),
      essence: {
        type: situationType,
        state: entry['現代解釈の要約'],
        challenge: this.extractChallenge(entry),
        opportunity: this.extractOpportunity(entry)
      },
      emotions: emotions,
      emotionWeight: emotionWeight,
      keyPhrases: entry['キーワード'],
      snsPatterns: snsPatterns,
      tripleOS: this.calculateTripleOSFromScores(entry),
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
        source: 'H384_DATA'
      }
    };
  }

  /**
   * エントリから感情を推定
   */
  static estimateEmotions(entry) {
    const emotions = [];
    const interpretation = entry['現代解釈の要約'];
    const keywords = entry['キーワード'];
    
    // キーワードと解釈から感情を推定
    if (keywords.includes('リスク') || interpretation.includes('危険') || interpretation.includes('困難')) {
      emotions.push('anxiety');
    }
    if (keywords.includes('吉') || interpretation.includes('成功') || interpretation.includes('良い')) {
      emotions.push('hope');
    }
    if (keywords.includes('凶') || interpretation.includes('失敗') || interpretation.includes('悪い')) {
      emotions.push('sadness');
    }
    if (interpretation.includes('決断') || keywords.includes('リーダー')) {
      emotions.push('determination');
    }
    if (interpretation.includes('迷い') || interpretation.includes('不明')) {
      emotions.push('confusion');
    }
    if (interpretation.includes('苛立ち') || interpretation.includes('不満')) {
      emotions.push('frustration');
    }
    
    // 最低1つは感情を含める
    if (emotions.length === 0) {
      emotions.push('hope');
    }
    
    // 最大3つまで
    return emotions.slice(0, 3);
  }

  /**
   * 感情の重みを計算
   */
  static calculateEmotionWeight(emotions, entry) {
    const weight = {};
    const totalEmotions = emotions.length;
    
    // 基本スコアに基づいて主要感情の重みを決定
    const baseScore = entry['S1_基本スコア'];
    
    emotions.forEach((emotion, index) => {
      if (index === 0) {
        // 主要感情
        weight[emotion] = baseScore > 50 ? 0.5 : 0.4;
      } else if (index === 1) {
        // 副次感情
        weight[emotion] = 0.3;
      } else {
        // その他
        weight[emotion] = 0.2;
      }
    });
    
    return weight;
  }

  /**
   * 状況タイプを判定
   */
  static determineSituationType(entry) {
    const interpretation = entry['現代解釈の要約'];
    const score = entry['S1_基本スコア'];
    
    if (interpretation.includes('始まり') || interpretation.includes('初期')) {
      return 'beginning';
    }
    if (interpretation.includes('成長') || interpretation.includes('発展')) {
      return 'growth';
    }
    if (interpretation.includes('絶頂') || interpretation.includes('最高')) {
      return 'peak';
    }
    if (interpretation.includes('衰退') || interpretation.includes('下降')) {
      return 'decline';
    }
    if (interpretation.includes('停滞') || interpretation.includes('膠着')) {
      return 'stagnation';
    }
    if (interpretation.includes('変化') || interpretation.includes('転換')) {
      return 'transformation';
    }
    if (interpretation.includes('完成') || interpretation.includes('終結')) {
      return 'completion';
    }
    if (interpretation.includes('繰り返し') || interpretation.includes('循環')) {
      return 'repetition';
    }
    
    // スコアベースのフォールバック
    if (score >= 75) return 'peak';
    if (score <= 25) return 'decline';
    return 'transformation';
  }

  /**
   * SNSパターンを生成
   */
  static generateSNSPatterns(entry) {
    const basePatterns = this.generateBasePatterns(entry);
    
    return {
      young: this.adjustForPersona(basePatterns, 'young'),
      adult: this.adjustForPersona(basePatterns, 'adult'),
      senior: this.adjustForPersona(basePatterns, 'senior')
    };
  }

  /**
   * 基本パターンの生成
   */
  static generateBasePatterns(entry) {
    const patterns = [];
    const interpretation = entry['現代解釈の要約'];
    const keywords = entry['キーワード'];
    
    // キーワードを使った短文生成
    if (keywords.length > 0) {
      patterns.push(keywords.slice(0, 2).join('で') + 'な感じ');
      patterns.push('今まさに' + keywords[0] + 'の時期');
    }
    
    // 解釈を簡略化したパターン
    const shortInterpretation = interpretation.substring(0, 30) + '...';
    patterns.push(shortInterpretation);
    
    // 感情的な表現
    if (entry['S1_基本スコア'] >= 75) {
      patterns.push('調子いい！最高の状態');
    } else if (entry['S1_基本スコア'] <= 25) {
      patterns.push('厳しい状況...でも諦めない');
    } else {
      patterns.push('まあまあかな、様子見');
    }
    
    return patterns;
  }

  /**
   * ペルソナに応じた調整
   */
  static adjustForPersona(patterns, persona) {
    return patterns.map(pattern => {
      switch (persona) {
        case 'young':
          return this.makeYoung(pattern);
        case 'adult':
          return this.makeAdult(pattern);
        case 'senior':
          return this.makeSenior(pattern);
        default:
          return pattern;
      }
    }).slice(0, 2); // 各ペルソナ2パターンまで
  }

  /**
   * 若年層向け変換
   */
  static makeYoung(text) {
    return text
      .replace(/です|ます/g, '')
      .replace(/である/g, 'だよ')
      .replace(/。/g, '！')
      + (Math.random() > 0.5 ? '😊' : '');
  }

  /**
   * 社会人向け変換
   */
  static makeAdult(text) {
    return text
      .replace(/だよ/g, 'です')
      .replace(/！/g, '。')
      .replace(/😊|😅|💦/g, '');
  }

  /**
   * シニア向け変換
   */
  static makeSenior(text) {
    return '人生経験から、' + text.replace(/！/g, '。');
  }

  /**
   * 課題の抽出
   */
  static extractChallenge(entry) {
    const risk = entry['S4_リスク'];
    const interpretation = entry['現代解釈の要約'];
    
    if (risk <= -65) {
      return '深刻なリスクと困難';
    } else if (risk <= -45) {
      return '注意が必要な課題';
    } else {
      // 解釈から抽出
      if (interpretation.includes('困難')) return '困難への対処';
      if (interpretation.includes('リスク')) return 'リスク管理';
      return '慎重な判断';
    }
  }

  /**
   * 機会の抽出
   */
  static extractOpportunity(entry) {
    const potential = entry['S2_ポテンシャル'];
    const interpretation = entry['現代解釈の要約'];
    
    if (potential >= 70) {
      return '大きな成長の可能性';
    } else if (potential >= 50) {
      return '着実な前進の機会';
    } else {
      // 解釈から抽出
      if (interpretation.includes('学び')) return '学習と成長';
      if (interpretation.includes('協力')) return '協働の機会';
      return '内省と準備';
    }
  }

  /**
   * Triple OSスコアの計算
   */
  static calculateTripleOSFromScores(entry) {
    // S5_主体性推奨スタンスから推定
    const stance = entry['S5_主体性推奨スタンス'];
    const stability = entry['S3_安定性スコア'];
    const volatility = entry['S6_変動性スコア'];
    
    let engineOS = 0.33;
    let interfaceOS = 0.33;
    let safeModeOS = 0.34;
    
    // スタンスによる調整
    if (stance === '能動') {
      engineOS += 0.2;
      interfaceOS += 0.1;
      safeModeOS -= 0.3;
    } else if (stance === '受動') {
      engineOS -= 0.1;
      interfaceOS -= 0.1;
      safeModeOS += 0.2;
    }
    
    // 安定性による調整
    if (stability >= 60) {
      safeModeOS += 0.1;
    } else if (stability <= 30) {
      engineOS += 0.1;
    }
    
    // 変動性による調整
    if (volatility >= 60) {
      interfaceOS += 0.1;
    }
    
    // 正規化
    const total = engineOS + interfaceOS + safeModeOS;
    
    return {
      engineOS: Math.max(0, Math.min(1, engineOS / total)),
      interfaceOS: Math.max(0, Math.min(1, interfaceOS / total)),
      safeModeOS: Math.max(0, Math.min(1, safeModeOS / total))
    };
  }
}

// グローバルスコープにエクスポート
if (typeof window !== 'undefined') {
  window.LoadH384Data = LoadH384Data;
}