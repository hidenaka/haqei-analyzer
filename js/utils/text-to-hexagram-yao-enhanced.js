/**
 * Enhanced Text to Hexagram + Yao Analyzer
 * 各卦の爻辞に基づく正確な判定
 * 
 * CLAUDE.md準拠：指示範囲厳守、H384データ活用
 */

window.TextToHexagramYaoEnhanced = {
  
  // 64卦×6爻の完全な爻辞データベース
  hexagramLines: null,
  
  /**
   * 初期化：爻辞データ読み込み
   */
  async init() {
    try {
      const response = await fetch('/data/enhanced_hexagrams_complete.json');
      const data = await response.json();
      
      // 卦ごとの爻辞データを構築
      this.hexagramLines = {};
      data.forEach(hexagram => {
        this.hexagramLines[hexagram.hexagram_id] = {
          name: hexagram.name_jp,
          lines: hexagram.six_lines || []
        };
      });
      
      console.log('✅ 爻辞データベース読み込み完了');
      return true;
    } catch (error) {
      console.error('❌ 爻辞データ読み込みエラー:', error);
      // フォールバックデータ（乾為天のみ）
      this.hexagramLines = {
        1: {
          name: "乾為天",
          lines: [
            { position: 1, name: "初九", text: "潜龍勿用", meaning: "時期尚早、潜在力の蓄積期間" },
            { position: 2, name: "九二", text: "見龍在田", meaning: "才能が現れ始める" },
            { position: 3, name: "九三", text: "君子終日乾乾", meaning: "一日中努力し警戒を怠らず" },
            { position: 4, name: "九四", text: "或躍在淵", meaning: "躍進か慎重かの選択時期" },
            { position: 5, name: "九五", text: "飛龍在天", meaning: "最高の活躍時期" },
            { position: 6, name: "上九", text: "亢龍有悔", meaning: "過度の高ぶりは後悔を招く" }
          ]
        }
      };
      return false;
    }
  },
  
  /**
   * テキストから卦と爻を精密判定
   */
  analyze(text) {
    // 1. まず卦を判定
    const hexagramId = this.determineHexagram(text);
    
    // 2. その卦の文脈で爻を判定
    const yaoPosition = this.determineYaoForHexagram(text, hexagramId);
    
    // 3. 爻辞データを取得
    const lineData = this.getLineData(hexagramId, yaoPosition);
    
    return {
      hexagramId: hexagramId,
      hexagramName: this.hexagramLines[hexagramId]?.name || `卦${hexagramId}`,
      yaoPosition: yaoPosition,
      yaoName: lineData?.name || `第${yaoPosition}爻`,
      yaoText: lineData?.text || "",
      yaoMeaning: lineData?.meaning || "",
      personalityTrait: lineData?.personality_trait || "",
      transformationPotential: lineData?.transformation_potential || "",
      confidence: this.calculateConfidence(text, hexagramId, yaoPosition)
    };
  },
  
  /**
   * 卦の判定（改良版）
   */
  determineHexagram(text) {
    const scores = {};
    
    // キーワードベースの卦判定
    const hexagramPatterns = {
      1: /創造|リーダー|強い|龍|天|始める|開拓/,  // 乾為天
      2: /受容|母|地|育む|支える|包容/,           // 坤為地
      3: /困難|始まり|産みの苦しみ|混沌/,        // 水雷屯
      4: /学ぶ|教育|未熟|啓蒙|教わる/,           // 山水蒙
      5: /待つ|待機|準備|忍耐/,                  // 水天需
      6: /争い|訴訟|対立|議論/,                  // 天水訟
      7: /組織|軍隊|規律|統率/,                  // 地水師
      8: /親密|協力|結束|仲間/,                  // 水地比
      29: /困難|危険|陥る|深い/,                 // 坎為水
      30: /明るい|火|輝き|情熱/,                 // 離為火
      31: /感応|共感|感じる|デリケート/,         // 沢山咸
      47: /困窮|逆境|苦しい|貧しい/,             // 沢水困
      49: /革命|改革|変革|刷新/,                 // 沢火革
      52: /静止|止まる|瞑想|山/,                 // 艮為山
      58: /喜び|楽しい|悦ぶ|沢/,                 // 兌為沢
      60: /節度|節制|ルール|制限/,               // 水沢節
      63: /完成|達成|終わり|済む/,               // 水火既済
      64: /未完成|継続|まだ|途中/                // 火水未済
    };
    
    // パターンマッチングでスコア計算
    for (const [id, pattern] of Object.entries(hexagramPatterns)) {
      if (pattern.test(text)) {
        scores[id] = (scores[id] || 0) + 10;
      }
    }
    
    // 感情分析による追加判定
    if (/不安|心配/.test(text)) scores[29] = (scores[29] || 0) + 5;
    if (/喜|嬉|楽/.test(text)) scores[58] = (scores[58] || 0) + 5;
    if (/怒|イライラ/.test(text)) scores[51] = (scores[51] || 0) + 5;
    if (/静|落ち着/.test(text)) scores[52] = (scores[52] || 0) + 5;
    
    // 最高スコアの卦を選択（デフォルトは1）
    const hexagramId = parseInt(
      Object.entries(scores)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 1
    );
    
    return hexagramId;
  },
  
  /**
   * 特定の卦における爻位置の判定
   */
  determineYaoForHexagram(text, hexagramId) {
    // 卦ごとの爻判定ロジック
    const yaoScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    
    // 各卦の爻辞データを取得
    const hexagramData = this.hexagramLines[hexagramId];
    if (!hexagramData || !hexagramData.lines) {
      // データがない場合は汎用ロジックを使用
      return this.determineYaoGeneric(text);
    }
    
    // 卦固有の爻辞に基づく判定
    switch(hexagramId) {
      case 1: // 乾為天
        if (/潜在|隠れ|まだ|準備/.test(text)) yaoScores[1] += 10; // 潜龍勿用
        if (/現れ|見え始め|芽生え/.test(text)) yaoScores[2] += 10; // 見龍在田
        if (/努力|頑張|警戒|注意/.test(text)) yaoScores[3] += 10; // 終日乾乾
        if (/迷い|選択|躊躇|決断/.test(text)) yaoScores[4] += 10; // 或躍在淵
        if (/飛躍|成功|リーダー|頂点/.test(text)) yaoScores[5] += 10; // 飛龍在天
        if (/行き過ぎ|傲慢|後悔|極限/.test(text)) yaoScores[6] += 10; // 亢龍有悔
        break;
        
      case 2: // 坤為地
        if (/霜|兆し|変化の前兆/.test(text)) yaoScores[1] += 10; // 履霜堅冰至
        if (/素直|正しい|自然/.test(text)) yaoScores[2] += 10; // 直方大
        if (/含む|秘める|内在/.test(text)) yaoScores[3] += 10; // 含章可貞
        if (/慎重|控えめ|閉じる/.test(text)) yaoScores[4] += 10; // 括嚢
        if (/中央|バランス|品格/.test(text)) yaoScores[5] += 10; // 黄裳元吉
        if (/戦|争い|極限の対立/.test(text)) yaoScores[6] += 10; // 龍戦於野
        break;
        
      case 3: // 水雷屯
        if (/困難な始まり|混沌/.test(text)) yaoScores[1] += 10;
        if (/助けを求める|協力/.test(text)) yaoScores[2] += 10;
        if (/苦しい選択|進退窮まる/.test(text)) yaoScores[3] += 10;
        if (/婚姻|結合|パートナー/.test(text)) yaoScores[4] += 10;
        if (/小さな成功|徐々に/.test(text)) yaoScores[5] += 10;
        if (/涙|悲しみ|困難の極み/.test(text)) yaoScores[6] += 10;
        break;
        
      case 4: // 山水蒙
        if (/教育|学び始め/.test(text)) yaoScores[1] += 10;
        if (/包容|受け入れる/.test(text)) yaoScores[2] += 10;
        if (/依存|頼りすぎ/.test(text)) yaoScores[3] += 10;
        if (/困窮|孤立/.test(text)) yaoScores[4] += 10;
        if (/童心|純粋|素直な学び/.test(text)) yaoScores[5] += 10;
        if (/撃つ|防御|守る/.test(text)) yaoScores[6] += 10;
        break;
        
      case 5: // 水天需
        if (/待機|郊外|少し待つ/.test(text)) yaoScores[1] += 10;
        if (/砂|中間地点/.test(text)) yaoScores[2] += 10;
        if (/泥|困難な待機/.test(text)) yaoScores[3] += 10;
        if (/血|危険な状況/.test(text)) yaoScores[4] += 10;
        if (/酒食|楽しみながら待つ/.test(text)) yaoScores[5] += 10;
        if (/穴|落とし穴|予期せぬ/.test(text)) yaoScores[6] += 10;
        break;
        
      case 29: // 坎為水
        if (/習坎|繰り返す困難/.test(text)) yaoScores[1] += 10;
        if (/坎に陥る|危険の中/.test(text)) yaoScores[2] += 10;
        if (/来たり往く|進退困難/.test(text)) yaoScores[3] += 10;
        if (/樽酒|簡素な供物/.test(text)) yaoScores[4] += 10;
        if (/坎満たず|未完の危険/.test(text)) yaoScores[5] += 10;
        if (/縄|束縛|監禁/.test(text)) yaoScores[6] += 10;
        break;
        
      case 30: // 離為火
        if (/錯然|混乱した始まり/.test(text)) yaoScores[1] += 10;
        if (/黄離|黄色い光|吉/.test(text)) yaoScores[2] += 10;
        if (/日昃|夕暮れ|衰退/.test(text)) yaoScores[3] += 10;
        if (/突如|急激な変化/.test(text)) yaoScores[4] += 10;
        if (/涙|悲しみだが吉/.test(text)) yaoScores[5] += 10;
        if (/王|征伐|制裁/.test(text)) yaoScores[6] += 10;
        break;
        
      case 31: // 沢山咸
        if (/親指|わずかな感応/.test(text)) yaoScores[1] += 10;
        if (/ふくらはぎ|動こうとする/.test(text)) yaoScores[2] += 10;
        if (/もも|衝動的/.test(text)) yaoScores[3] += 10;
        if (/心の動揺|落ち着かない/.test(text)) yaoScores[4] += 10;
        if (/背中|深い感応/.test(text)) yaoScores[5] += 10;
        if (/口|言葉|表現/.test(text)) yaoScores[6] += 10;
        break;
        
      case 47: // 沢水困
        if (/臀部|座り込む|動けない/.test(text)) yaoScores[1] += 10;
        if (/酒食に困る|物質的困窮/.test(text)) yaoScores[2] += 10;
        if (/石|障害物|進めない/.test(text)) yaoScores[3] += 10;
        if (/来たるも遅い|援助の遅れ/.test(text)) yaoScores[4] += 10;
        if (/鼻|切られる|苦痛/.test(text)) yaoScores[5] += 10;
        if (/葛藤|絡まる|複雑/.test(text)) yaoScores[6] += 10;
        break;
        
      case 49: // 沢火革
        if (/黄牛の革|慎重な変革/.test(text)) yaoScores[1] += 10;
        if (/己の日|適切な時期/.test(text)) yaoScores[2] += 10;
        if (/三度|繰り返し|確実/.test(text)) yaoScores[3] += 10;
        if (/改命|運命を変える/.test(text)) yaoScores[4] += 10;
        if (/虎変|大きな変化/.test(text)) yaoScores[5] += 10;
        if (/豹変|表面的変化/.test(text)) yaoScores[6] += 10;
        break;
        
      case 52: // 艮為山
        if (/足指|動きの始まり/.test(text)) yaoScores[1] += 10;
        if (/ふくらはぎ|中間/.test(text)) yaoScores[2] += 10;
        if (/腰|中心|要/.test(text)) yaoScores[3] += 10;
        if (/身体|全体/.test(text)) yaoScores[4] += 10;
        if (/顎|言葉|秩序/.test(text)) yaoScores[5] += 10;
        if (/敦艮|厚い静止/.test(text)) yaoScores[6] += 10;
        break;
        
      case 58: // 兌為沢
        if (/和兌|和やかな喜び/.test(text)) yaoScores[1] += 10;
        if (/孚兌|誠実な喜び/.test(text)) yaoScores[2] += 10;
        if (/来兌|来る喜び/.test(text)) yaoScores[3] += 10;
        if (/商兌|計算された喜び/.test(text)) yaoScores[4] += 10;
        if (/孚于剝|信頼が剥がれる/.test(text)) yaoScores[5] += 10;
        if (/引兌|引きずる喜び/.test(text)) yaoScores[6] += 10;
        break;
        
      case 60: // 水沢節
        if (/門を出ない|内に留まる/.test(text)) yaoScores[1] += 10;
        if (/門から出ない|機を逸する/.test(text)) yaoScores[2] += 10;
        if (/節度なし|過度/.test(text)) yaoScores[3] += 10;
        if (/安節|安らかな節度/.test(text)) yaoScores[4] += 10;
        if (/甘節|心地よい節度/.test(text)) yaoScores[5] += 10;
        if (/苦節|苦しい節度/.test(text)) yaoScores[6] += 10;
        break;
        
      case 63: // 水火既済
        if (/濡れた尾|慎重な始まり/.test(text)) yaoScores[1] += 10;
        if (/婦人の簾|内側に留まる/.test(text)) yaoScores[2] += 10;
        if (/高宗|大事業|征伐/.test(text)) yaoScores[3] += 10;
        if (/ぼろ|破れ|注意/.test(text)) yaoScores[4] += 10;
        if (/牛を殺す|大きな犠牲/.test(text)) yaoScores[5] += 10;
        if (/濡れた首|危険/.test(text)) yaoScores[6] += 10;
        break;
        
      case 64: // 火水未済
        if (/濡れた尾|失敗の始まり/.test(text)) yaoScores[1] += 10;
        if (/車輪を引く|努力/.test(text)) yaoScores[2] += 10;
        if (/未済の征|時期尚早/.test(text)) yaoScores[3] += 10;
        if (/貞吉|正しい道/.test(text)) yaoScores[4] += 10;
        if (/君子の光|徳の輝き/.test(text)) yaoScores[5] += 10;
        if (/酒を飲む|完成の祝い/.test(text)) yaoScores[6] += 10;
        break;
        
      default:
        // その他の卦は汎用パターンマッチング
        return this.determineYaoGeneric(text);
    }
    
    // 共通の時期・段階による追加判定
    if (/初め|最初|スタート|始まり/.test(text)) yaoScores[1] += 3;
    if (/少し|やや|徐々に|次第に/.test(text)) yaoScores[2] += 3;
    if (/困難|苦労|壁|転機/.test(text)) yaoScores[3] += 3;
    if (/外|社会|他人|関係/.test(text)) yaoScores[4] += 3;
    if (/中心|核心|本質|要/.test(text)) yaoScores[5] += 3;
    if (/終|極|限界|完了/.test(text)) yaoScores[6] += 3;
    
    // 発展段階による追加判定
    const stage = this.detectDevelopmentStage(text);
    if (stage === 'beginning') { yaoScores[1] += 3; yaoScores[2] += 2; }
    if (stage === 'developing') { yaoScores[3] += 3; yaoScores[4] += 2; }
    if (stage === 'mature') { yaoScores[5] += 3; yaoScores[6] += 1; }
    if (stage === 'ending') { yaoScores[6] += 5; }
    
    // 最高スコアの爻を選択
    const yaoPosition = parseInt(
      Object.entries(yaoScores)
        .sort(([,a], [,b]) => b - a)[0][0]
    );
    
    return yaoPosition;
  },
  
  /**
   * 汎用的な爻位置判定（卦固有データがない場合）
   */
  determineYaoGeneric(text) {
    const yaoScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    
    // 汎用パターンマッチング
    if (/初め|最初|スタート|始まり/.test(text)) yaoScores[1] += 8;
    if (/準備|計画|内部/.test(text)) yaoScores[2] += 8;
    if (/困難|転機|岐路/.test(text)) yaoScores[3] += 8;
    if (/外部|社会|関係/.test(text)) yaoScores[4] += 8;
    if (/中心|リーダー|完成/.test(text)) yaoScores[5] += 8;
    if (/終わり|極限|次へ/.test(text)) yaoScores[6] += 8;
    
    // 発展段階による判定
    const stage = this.detectDevelopmentStage(text);
    if (stage === 'beginning') { yaoScores[1] += 5; yaoScores[2] += 3; }
    if (stage === 'developing') { yaoScores[3] += 5; yaoScores[4] += 3; }
    if (stage === 'mature') { yaoScores[5] += 5; }
    if (stage === 'ending') { yaoScores[6] += 5; }
    
    return parseInt(
      Object.entries(yaoScores)
        .sort(([,a], [,b]) => b - a)[0][0]
    );
  },
  
  /**
   * 発展段階の検出
   */
  detectDevelopmentStage(text) {
    if (/始め|初|新|スタート/.test(text)) return 'beginning';
    if (/途中|進行中|まだ/.test(text)) return 'developing';
    if (/成熟|完成間近|ほぼ/.test(text)) return 'mature';
    if (/終|完了|限界/.test(text)) return 'ending';
    return 'developing';
  },
  
  /**
   * 爻辞データ取得
   */
  getLineData(hexagramId, yaoPosition) {
    const hexagram = this.hexagramLines[hexagramId];
    if (!hexagram || !hexagram.lines) return null;
    
    return hexagram.lines.find(line => line.position === yaoPosition);
  },
  
  /**
   * 判定の信頼度計算
   */
  calculateConfidence(text, hexagramId, yaoPosition) {
    let confidence = 50; // 基準値
    
    // テキスト長による調整
    if (text.length > 50) confidence += 10;
    if (text.length > 100) confidence += 10;
    
    // 明確なキーワードがある場合
    if (/明確に|はっきり|確実に/.test(text)) confidence += 15;
    
    // 曖昧な表現の場合
    if (/かも|たぶん|よくわからない/.test(text)) confidence -= 10;
    
    // 爻辞データが存在する場合
    if (this.getLineData(hexagramId, yaoPosition)) confidence += 20;
    
    return Math.min(Math.max(confidence, 0), 100);
  }
};

// Node.js環境対応
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  global.TextToHexagramYaoEnhanced = TextToHexagramYaoEnhanced;
}

// 初期化
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    TextToHexagramYaoEnhanced.init();
    console.log('✅ Enhanced Text to Hexagram+Yao loaded');
  });
}