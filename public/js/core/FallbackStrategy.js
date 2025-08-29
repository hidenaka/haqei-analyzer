class FallbackStrategy {
  async executeWithFallback(input) {
    try {
      // レベル1: フル機能（30ms目標）
      return await this.fullScoring(input);
    } catch (error) {
      console.warn('Falling back to simplified scoring:', error);
      
      try {
        // レベル2: 簡易スコアリング（10ms）
        return await this.simplifiedScoring(input);
      } catch (error2) {
        console.warn('Falling back to rule-based:', error2);
        
        // レベル3: ルールベース（5ms）
        return this.ruleBasedScoring(input);
      }
    }
  }
  
  async simplifiedScoring(input) {
    // キーワードマッチのみ
    const keywords = this.extractBasicKeywords(input);
    return this.matchKeywords(keywords);
  }
  
  ruleBasedScoring(input) {
    // 固定ルール
    if (input.includes('リーダー')) return { line_id: 1, confidence: 0.7 };
    if (input.includes('始まり')) return { line_id: 1, confidence: 0.6 };
    // ... その他のルール
    return { line_id: 1, confidence: 0.5 }; // デフォルト
  }
}

export default FallbackStrategy;