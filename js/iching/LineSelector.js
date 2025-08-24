/**
 * Line Selector Class
 * 爻位選択ルールを明確化した実装
 */

export class LineSelector {
    constructor() {
        // 層別定義（下層・中層・上層）
        this.layers = {
            lower: [1, 2],  // 下層：基礎・開始
            middle: [3, 4], // 中層：実行・展開
            upper: [5, 6]   // 上層：完成・終結
        };
        
        // テーマと層の対応マッピング
        this.themeLayerMapping = {
            '仕事': 'middle',     // 実行層
            '人間関係': 'middle', // 相互作用層
            '健康': 'lower',      // 基礎層
            '学習': 'lower',      // 成長開始層
            '財務': 'upper',      // 成果層
            'default': 'middle'   // デフォルト
        };
    }
    
    /**
     * 分析結果から開始爻位を選択
     * @param {Object} hexagram - 卦データ（未使用だが互換性のため保持）
     * @param {Object} textAnalysis - テキスト分析結果
     * @returns {number} 選択された爻位（1-6）
     */
    selectStartingLine(hexagram, textAnalysis) {
        // 1. テーマから基本層を決定
        const primaryTheme = textAnalysis.keyThemes?.[0]?.name || 'default';
        const baseLayer = this.themeLayerMapping[primaryTheme] || 
                         this.themeLayerMapping.default;
        
        // 2. 緊急度による層の調整
        let layerAdjustment = 0;
        if (textAnalysis.urgencyLevel === 'high') {
            layerAdjustment = 1;  // 上層へシフト
        } else if (textAnalysis.urgencyLevel === 'low') {
            layerAdjustment = -1; // 下層へシフト
        }
        
        // 3. 調整後の層から爻位候補を取得
        const possibleLines = this.getLayerLines(baseLayer, layerAdjustment);
        
        // 4. 感情強度による爻位の選択
        const emotionIntensity = textAnalysis.emotionalTone?.intensity || 0.5;
        const lineIndex = Math.floor(emotionIntensity * possibleLines.length);
        
        // 配列範囲を超えないように調整
        const selectedIndex = Math.min(lineIndex, possibleLines.length - 1);
        
        return possibleLines[selectedIndex];
    }
    
    /**
     * 層と調整値から実際の爻位配列を取得
     * @param {string} layer - 基本層（lower/middle/upper）
     * @param {number} adjustment - 調整値（-1/0/1）
     * @returns {number[]} 爻位の配列
     */
    getLayerLines(layer, adjustment = 0) {
        const layers = ['lower', 'middle', 'upper'];
        let currentIndex = layers.indexOf(layer);
        
        // 調整を適用（範囲を超えないように）
        currentIndex = Math.max(0, Math.min(2, currentIndex + adjustment));
        
        return this.layers[layers[currentIndex]];
    }
    
    /**
     * 複雑度に基づいて変爻数を決定
     * @param {Object} textAnalysis - テキスト分析結果
     * @returns {number} 変爻数（1-6）
     */
    determineChangeCount(textAnalysis) {
        const complexity = textAnalysis.complexityLevel;
        
        // 複雑度による基本的な変爻数
        if (complexity === 'low') return 1;
        if (complexity === 'medium') return 2;
        if (complexity === 'high') return 3;
        
        // 感情が混在している場合は変爻数を増やす
        if (textAnalysis.emotionalTone?.type === 'mixed') {
            const base = complexity === 'low' ? 2 : 3;
            return Math.min(4, base + Math.floor(Math.random() * 2));
        }
        
        // デフォルト
        return 2;
    }
    
    /**
     * 変爻させる爻位を選択
     * @param {number} hexNum - 卦番号
     * @param {Object} textAnalysis - テキスト分析結果
     * @param {number} count - 変爻数
     * @returns {number[]} 変爻する爻位の配列
     */
    selectLinesToChange(hexNum, textAnalysis, count = null) {
        const changeCount = count || this.determineChangeCount(textAnalysis);
        const startingLine = this.selectStartingLine({}, textAnalysis);
        
        const selectedLines = new Set([startingLine]);
        
        // 追加の変爻を選択（近接する爻を優先）
        while (selectedLines.size < changeCount && selectedLines.size < 6) {
            // 既存の変爻に近い爻を選択
            const candidates = [];
            
            for (const line of selectedLines) {
                if (line > 1 && !selectedLines.has(line - 1)) {
                    candidates.push(line - 1);
                }
                if (line < 6 && !selectedLines.has(line + 1)) {
                    candidates.push(line + 1);
                }
            }
            
            if (candidates.length === 0) {
                // 近接爻がない場合はランダムに選択
                for (let i = 1; i <= 6; i++) {
                    if (!selectedLines.has(i)) {
                        candidates.push(i);
                    }
                }
            }
            
            if (candidates.length > 0) {
                const nextLine = candidates[Math.floor(Math.random() * candidates.length)];
                selectedLines.add(nextLine);
            } else {
                break;
            }
        }
        
        return Array.from(selectedLines).sort((a, b) => a - b);
    }
    
    /**
     * 層の説明を取得
     * @param {string} layer - 層名
     * @returns {string} 層の説明
     */
    getLayerDescription(layer) {
        const descriptions = {
            lower: '基礎・開始の段階',
            middle: '実行・展開の段階',
            upper: '完成・終結の段階'
        };
        return descriptions[layer] || '変化の段階';
    }
    
    /**
     * 爻位の意味を取得
     * @param {number} lineNum - 爻位（1-6）
     * @returns {string} 爻位の意味
     */
    getLinePositionMeaning(lineNum) {
        const meanings = {
            1: '始まりの兆し',
            2: '内的な準備',
            3: '外への一歩',
            4: '外的な展開',
            5: '成熟と統合',
            6: '完成と転換'
        };
        return meanings[lineNum] || `第${lineNum}爻`;
    }
}