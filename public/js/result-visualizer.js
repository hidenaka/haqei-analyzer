/**
 * T07: 結果可視化強化
 * 宮名/position/hexagram表示
 * PatternMapper統合
 */

'use strict';

class ResultVisualizer {
    constructor() {
        this.patternMapper = null;
        this.initPatternMapper();
    }
    
    async initPatternMapper() {
        // PatternMapperが利用可能か確認
        if (typeof PatternMapper !== 'undefined') {
            this.patternMapper = new PatternMapper();
            console.log('✅ PatternMapper initialized for ResultVisualizer');
        } else {
            console.warn('⚠️ PatternMapper not available, using fallback');
        }
    }
    
    /**
     * 36問の回答から8つの二値回答に変換
     * Engine OS (Q1-Q12) → 2ビット
     * Interface OS (Q13-Q24) → 2ビット
     * Safe Mode OS (Q25-Q36) → 4ビット
     */
    convertToEightAnswers(tripleOSResults) {
        const eightAnswers = [];
        
        // Engine OS から2ビット抽出
        const engineStrength = tripleOSResults.engineOS?.strength || 50;
        eightAnswers.push(engineStrength > 60); // 高創造性
        eightAnswers.push(engineStrength > 40); // 高行動性
        
        // Interface OS から2ビット抽出
        const interfaceStrength = tripleOSResults.interfaceOS?.strength || 50;
        eightAnswers.push(interfaceStrength > 60); // 高調和性
        eightAnswers.push(interfaceStrength > 40); // 高表現性
        
        // Safe Mode OS から4ビット抽出
        const safeModeStrength = tripleOSResults.safeModeOS?.strength || 50;
        eightAnswers.push(safeModeStrength > 70); // 非常に高い安定性
        eightAnswers.push(safeModeStrength > 50); // 高い安定性
        eightAnswers.push(safeModeStrength > 30); // 中程度の安定性
        eightAnswers.push(safeModeStrength > 10); // 基本的な安定性
        
        return eightAnswers;
    }
    
    /**
     * PatternMapperを使用して詳細な卦情報を取得
     */
    getHexagramDetails(tripleOSResults) {
        if (!this.patternMapper) {
            return this.getFallbackHexagramDetails(tripleOSResults);
        }
        
        try {
            // 36問の結果を8つの二値に変換
            const eightAnswers = this.convertToEightAnswers(tripleOSResults);
            
            // PatternMapperで卦情報取得
            const mappingResult = this.patternMapper.mapToHexagram(eightAnswers);
            
            if (!mappingResult.success) {
                console.warn('PatternMapper failed:', mappingResult.error);
                return this.getFallbackHexagramDetails(tripleOSResults);
            }
            
            return {
                patternId: mappingResult.patternId,
                hexagramNumber: mappingResult.hexagramNumber,
                palace: mappingResult.palace,
                hexagramName: this.getHexagramName(mappingResult.hexagramNumber),
                success: true
            };
            
        } catch (error) {
            console.error('Error in getHexagramDetails:', error);
            return this.getFallbackHexagramDetails(tripleOSResults);
        }
    }
    
    /**
     * フォールバック：既存の卦情報から推定
     */
    getFallbackHexagramDetails(tripleOSResults) {
        const hexagramId = tripleOSResults.engineOS?.hexagramId || 1;
        const palaceIndex = Math.floor((hexagramId - 1) / 8);
        const positionInPalace = ((hexagramId - 1) % 8) + 1;
        
        const palaceNames = ['乾宮', '兌宮', '離宮', '震宮', '巽宮', '坎宮', '艮宮', '坤宮'];
        
        return {
            patternId: hexagramId.toString().padStart(3, '0'),
            hexagramNumber: hexagramId,
            palace: {
                index: palaceIndex,
                name: palaceNames[palaceIndex],
                position: positionInPalace
            },
            hexagramName: this.getHexagramName(hexagramId),
            success: true
        };
    }
    
    /**
     * 卦番号から卦名を取得
     */
    getHexagramName(hexagramNumber) {
        const hexagramNames = {
            1: '乾為天', 2: '坤為地', 3: '水雷屯', 4: '山水蒙',
            5: '水天需', 6: '天水訟', 7: '地水師', 8: '水地比',
            9: '風天小畜', 10: '天沢履', 11: '地天泰', 12: '天地否',
            13: '天火同人', 14: '火天大有', 15: '地山謙', 16: '雷地豫',
            17: '沢雷随', 18: '山風蠱', 19: '地沢臨', 20: '風地観',
            21: '火雷噬嗑', 22: '山火賁', 23: '山地剝', 24: '地雷復',
            25: '天雷無妄', 26: '山天大畜', 27: '山雷頤', 28: '沢風大過',
            29: '坎為水', 30: '離為火', 31: '沢山咸', 32: '雷風恒',
            33: '天山遯', 34: '雷天大壮', 35: '火地晋', 36: '地火明夷',
            37: '風火家人', 38: '火沢睽', 39: '水山蹇', 40: '雷水解',
            41: '山沢損', 42: '風雷益', 43: '沢天夬', 44: '天風姤',
            45: '沢地萃', 46: '地風升', 47: '沢水困', 48: '水風井',
            49: '沢火革', 50: '火風鼎', 51: '震為雷', 52: '艮為山',
            53: '風山漸', 54: '雷沢帰妹', 55: '雷火豊', 56: '火山旅',
            57: '巽為風', 58: '兌為沢', 59: '風水渙', 60: '水沢節',
            61: '風沢中孚', 62: '雷山小過', 63: '水火既済', 64: '火水未済'
        };
        
        return hexagramNames[hexagramNumber] || `第${hexagramNumber}卦`;
    }
    
    /**
     * 結果画面に卦情報を表示
     */
    displayHexagramInfo(tripleOSResults) {
        const hexagramDetails = this.getHexagramDetails(tripleOSResults);
        
        // 卦情報表示用HTML生成
        const hexagramInfoHTML = `
            <div class="hexagram-detailed-info">
                <div class="hexagram-main">
                    <h3 class="hexagram-title">
                        ${hexagramDetails.hexagramName}
                        <span class="hexagram-number">第${hexagramDetails.hexagramNumber}卦</span>
                    </h3>
                    <div class="pattern-id">
                        パターンID: <code>${hexagramDetails.patternId}</code>
                    </div>
                </div>
                
                <div class="palace-info">
                    <div class="palace-name">
                        <span class="label">所属宮:</span>
                        <span class="value">${hexagramDetails.palace.name}</span>
                    </div>
                    <div class="palace-position">
                        <span class="label">宮内位置:</span>
                        <span class="value">第${hexagramDetails.palace.position}位</span>
                    </div>
                </div>
                
                <div class="hexagram-visual">
                    ${this.drawHexagramSVG(hexagramDetails.hexagramNumber)}
                </div>
            </div>
        `;
        
        // 結果画面の適切な場所に挿入
        const targetElement = document.getElementById('hexagram-display') || 
                            document.querySelector('.results-header') ||
                            document.querySelector('.summary-view');
        
        if (targetElement) {
            // 既存の卦表示があれば置き換え、なければ追加
            const existingDisplay = targetElement.querySelector('.hexagram-detailed-info');
            if (existingDisplay) {
                existingDisplay.outerHTML = hexagramInfoHTML;
            } else {
                targetElement.insertAdjacentHTML('afterbegin', hexagramInfoHTML);
            }
        }
        
        return hexagramDetails;
    }
    
    /**
     * SVGで卦を描画
     */
    drawHexagramSVG(hexagramNumber) {
        const binary = (hexagramNumber - 1).toString(2).padStart(6, '0');
        const lines = [];
        
        for (let i = 5; i >= 0; i--) {
            const isYang = binary[i] === '1';
            const y = 20 + (5 - i) * 15;
            
            if (isYang) {
                // 陽爻（実線）
                lines.push(`<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="#333" stroke-width="3"/>`);
            } else {
                // 陰爻（破線）
                lines.push(`<line x1="10" y1="${y}" x2="35" y2="${y}" stroke="#333" stroke-width="3"/>`);
                lines.push(`<line x1="65" y1="${y}" x2="90" y2="${y}" stroke="#333" stroke-width="3"/>`);
            }
        }
        
        return `
            <svg width="100" height="120" xmlns="http://www.w3.org/2000/svg">
                ${lines.join('\n')}
            </svg>
        `;
    }
    
    /**
     * 詳細な分析情報を追加
     */
    enhanceResultsWithPalaceAnalysis(tripleOSResults) {
        const hexagramDetails = this.getHexagramDetails(tripleOSResults);
        
        // 宮の特性による追加分析
        const palaceCharacteristics = {
            '乾宮': '創造性と革新性に優れ、リーダーシップを発揮',
            '兌宮': '調和と喜びを重視し、人間関係を大切にする',
            '離宮': '明晰な知性と表現力で周囲を照らす',
            '震宮': '行動力と決断力で道を切り開く',
            '巽宮': '柔軟性と適応力で変化に対応',
            '坎宮': '深い洞察力と探求心で本質を見抜く',
            '艮宮': '安定性と継続力で確実に成果を上げる',
            '坤宮': '包容力と受容性で全体を支える'
        };
        
        const palaceAnalysis = {
            palace: hexagramDetails.palace.name,
            position: hexagramDetails.palace.position,
            characteristic: palaceCharacteristics[hexagramDetails.palace.name] || '独自の特性を持つ',
            strengthLevel: this.calculateStrengthLevel(hexagramDetails.palace.position)
        };
        
        return {
            ...tripleOSResults,
            hexagramDetails,
            palaceAnalysis
        };
    }
    
    /**
     * 宮内位置による強度レベル計算
     */
    calculateStrengthLevel(position) {
        // 1-2: 初期段階, 3-4: 発展段階, 5-6: 成熟段階, 7-8: 完成段階
        if (position <= 2) return '初期段階 - 潜在力を秘めた状態';
        if (position <= 4) return '発展段階 - 成長と拡大の時期';
        if (position <= 6) return '成熟段階 - 能力が開花する時期';
        return '完成段階 - 統合と昇華の境地';
    }
}

// グローバルに公開
window.ResultVisualizer = ResultVisualizer;

// 自動初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.resultVisualizer = new ResultVisualizer();
    });
} else {
    window.resultVisualizer = new ResultVisualizer();
}