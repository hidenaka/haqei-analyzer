/**
 * Multi Line Interpreter Class
 * 複数変爻時の統一解釈ルール実装
 */

export class MultiLineInterpreter {
    constructor() {
        // 変爻数による解釈ルール
        this.interpretationRules = {
            1: 'single',      // 単一爻辞中心
            2: 'dual',        // 主爻優先
            3: 'triple',      // 主爻優先
            4: 'hexagram',    // 卦辞中心
            5: 'hexagram',    // 卦辞中心
            6: 'total'        // 完全変化
        };
        
        // 主爻選択の優先順位
        this.mainLinePriority = {
            default: [5, 'lowest'],      // デフォルト：5爻優先、なければ最下位
            upperFirst: ['highest', 5],  // 上位優先
            balanced: ['middle']         // 中庸
        };
    }
    
    /**
     * 複数変爻の解釈を行う
     * @param {number} hexNum - 本卦の番号
     * @param {number[]} changedLines - 変爻の配列（ソート済み）
     * @param {number} toHex - 之卦の番号
     * @param {string} priorityMode - 主爻選択モード（オプション）
     * @returns {Object} 解釈結果
     */
    interpretMultipleChanges(hexNum, changedLines, toHex, priorityMode = 'default') {
        const changeCount = changedLines.length;
        const rule = this.interpretationRules[changeCount];
        
        switch (rule) {
            case 'single':
                return this.interpretSingleLine(hexNum, changedLines[0]);
                
            case 'dual':
            case 'triple':
                return this.interpretMainLine(hexNum, changedLines, toHex, priorityMode);
                
            case 'hexagram':
                return this.interpretHexagramFocus(hexNum, toHex, changedLines);
                
            case 'total':
                return this.interpretTotalTransformation(hexNum, toHex);
                
            default:
                return this.interpretMainLine(hexNum, changedLines, toHex, priorityMode);
        }
    }
    
    /**
     * 単一変爻の解釈
     * @param {number} hexNum - 本卦番号
     * @param {number} lineNum - 変爻位置
     * @returns {Object} 解釈結果
     */
    interpretSingleLine(hexNum, lineNum) {
        const lineData = this.getLineData(hexNum, lineNum);
        
        return {
            focus: 'line',
            primaryLine: lineNum,
            interpretation: `第${lineNum}爻が示す「${lineData.keyword}」が中心的メッセージ。`,
            detail: lineData.description,
            emphasis: 'この爻の指示に従うことが重要',
            guidance: this.generateLineGuidance(lineNum, lineData),
            confidence: 0.95  // 単一変爻は解釈の確実性が高い
        };
    }
    
    /**
     * 主爻を中心とした解釈（2-3本変爻）
     * @param {number} hexNum - 本卦番号
     * @param {number[]} changedLines - 変爻配列
     * @param {number} toHex - 之卦番号
     * @param {string} priorityMode - 優先モード
     * @returns {Object} 解釈結果
     */
    interpretMainLine(hexNum, changedLines, toHex, priorityMode = 'default') {
        // 主爻の決定
        const mainLine = this.selectMainLine(changedLines, priorityMode);
        const secondaryLines = changedLines.filter(l => l !== mainLine);
        
        const mainLineData = this.getLineData(hexNum, mainLine);
        const secondaryData = secondaryLines.map(l => this.getLineData(hexNum, l));
        
        return {
            focus: 'main_line_with_support',
            primaryLine: mainLine,
            secondaryLines: secondaryLines,
            interpretation: `第${mainLine}爻「${mainLineData.keyword}」を中心に、` +
                          `${secondaryLines.join('・')}爻が補助的に作用。`,
            mainMessage: mainLineData.description,
            supportMessages: secondaryData.map(d => d.description),
            toHex: toHex,
            emphasis: '主爻の方向性を軸に、他の爻が状況を修飾',
            guidance: this.generateMultiLineGuidance(mainLineData, secondaryData),
            confidence: 0.8
        };
    }
    
    /**
     * 卦全体の変化に焦点（4-5本変爻）
     * @param {number} hexNum - 本卦番号
     * @param {number} toHex - 之卦番号
     * @param {number[]} changedLines - 変爻配列
     * @returns {Object} 解釈結果
     */
    interpretHexagramFocus(hexNum, toHex, changedLines) {
        const fromHexData = this.getHexagramData(hexNum);
        const toHexData = this.getHexagramData(toHex);
        
        return {
            focus: 'hexagram_transition',
            fromHex: hexNum,
            toHex: toHex,
            changedLines: changedLines,
            interpretation: `${changedLines.length}本の変爻により、` +
                          `${fromHexData.name}から${toHexData.name}への大きな変化。` +
                          `本卦の全体的メッセージから之卦の方向性への移行が重要。`,
            fromMeaning: fromHexData.meaning,
            toMeaning: toHexData.meaning,
            transitionAdvice: this.generateTransitionAdvice(fromHexData, toHexData),
            linesSummary: '個々の爻辞は参考程度に留める',
            emphasis: '卦の大局的変化に注目',
            confidence: 0.7
        };
    }
    
    /**
     * 完全変化の解釈（6本全変爻）
     * @param {number} hexNum - 本卦番号
     * @param {number} toHex - 之卦番号
     * @returns {Object} 解釈結果
     */
    interpretTotalTransformation(hexNum, toHex) {
        const fromHexData = this.getHexagramData(hexNum);
        const toHexData = this.getHexagramData(toHex);
        
        return {
            focus: 'complete_reversal',
            fromHex: hexNum,
            toHex: toHex,
            interpretation: '全爻が変化する完全な転換。' +
                          `${fromHexData.name}から${toHexData.name}への根本的な反転。` +
                          '現状の完全な逆転・革命的変化を示す。',
            warning: '極めて稀な状況。慎重な判断が必要。',
            guidance: '根本的な価値観や方向性の見直しが求められています',
            philosophicalMeaning: this.getPhilosophicalMeaning(hexNum, toHex),
            emphasis: '根本的な価値観・方向性の転換',
            confidence: 0.9  // 全変爻は明確な意味を持つ
        };
    }
    
    /**
     * 主爻を選択
     * @param {number[]} changedLines - 変爻配列
     * @param {string} priorityMode - 優先モード
     * @returns {number} 主爻
     */
    selectMainLine(changedLines, priorityMode = 'default') {
        const priority = this.mainLinePriority[priorityMode] || this.mainLinePriority.default;
        
        for (const rule of priority) {
            if (rule === 5 && changedLines.includes(5)) {
                return 5;  // 5爻（君位）優先
            }
            if (rule === 'lowest') {
                return Math.min(...changedLines);
            }
            if (rule === 'highest') {
                return Math.max(...changedLines);
            }
            if (rule === 'middle') {
                const mid = Math.floor(changedLines.length / 2);
                return changedLines[mid];
            }
        }
        
        return changedLines[0];  // フォールバック
    }
    
    /**
     * 爻データを取得
     * @param {number} hexNum - 卦番号
     * @param {number} lineNum - 爻位
     * @returns {Object} 爻データ
     */
    getLineData(hexNum, lineNum) {
        // H384データベースが利用可能な場合
        if (typeof window !== 'undefined' && window.H384_DATA) {
            const data = window.H384_DATA.find(item =>
                item['卦番号'] === hexNum && item['爻位'] === lineNum
            );
            if (data) {
                return {
                    keyword: data['キーワード'] || `第${lineNum}爻`,
                    description: data['現代解釈の要約'] || '変化の兆し',
                    action: data['行動指針'] || '慎重に進む'
                };
            }
        }
        
        // フォールバックデータ
        return {
            keyword: this.getDefaultLineKeyword(lineNum),
            description: this.getDefaultLineDescription(hexNum, lineNum),
            action: this.getDefaultLineAction(lineNum)
        };
    }
    
    /**
     * 卦データを取得
     * @param {number} hexNum - 卦番号
     * @returns {Object} 卦データ
     */
    getHexagramData(hexNum) {
        // 簡易的な卦データ（実際はデータベースから取得）
        const hexNames = {
            1: '乾為天', 2: '坤為地', 11: '地天泰', 12: '天地否',
            63: '水火既済', 64: '火水未済'
        };
        
        return {
            name: hexNames[hexNum] || `第${hexNum}卦`,
            meaning: this.getHexagramMeaning(hexNum)
        };
    }
    
    /**
     * デフォルトの爻キーワード
     */
    getDefaultLineKeyword(lineNum) {
        const keywords = {
            1: '潜在', 2: '内省', 3: '決断',
            4: '進展', 5: '統率', 6: '極限'
        };
        return keywords[lineNum] || `第${lineNum}爻`;
    }
    
    /**
     * デフォルトの爻説明
     */
    getDefaultLineDescription(hexNum, lineNum) {
        return `卦${hexNum}の第${lineNum}爻における変化の意味`;
    }
    
    /**
     * デフォルトの行動指針
     */
    getDefaultLineAction(lineNum) {
        const actions = {
            1: '慎重に準備を進める',
            2: '内面を見つめ直す',
            3: '勇気を持って踏み出す',
            4: '着実に前進する',
            5: '全体を統括する',
            6: '新たな転換に備える'
        };
        return actions[lineNum] || '状況を見極めて行動する';
    }
    
    /**
     * 卦の意味を取得
     */
    getHexagramMeaning(hexNum) {
        const meanings = {
            1: '創造と力強さ',
            2: '受容と柔軟性',
            11: '調和と繁栄',
            12: '停滞と困難',
            63: '完成と安定',
            64: '未完と可能性'
        };
        return meanings[hexNum] || '変化と発展';
    }
    
    /**
     * 爻に基づくガイダンス生成
     */
    generateLineGuidance(lineNum, lineData) {
        return `${lineData.keyword}の段階において、${lineData.action}ことが重要です。`;
    }
    
    /**
     * 複数爻のガイダンス生成
     */
    generateMultiLineGuidance(mainData, secondaryData) {
        const secondary = secondaryData.map(d => d.keyword).join('・');
        return `${mainData.keyword}を中心に、${secondary}の要素も考慮しながら進めましょう。`;
    }
    
    /**
     * 転換のアドバイス生成
     */
    generateTransitionAdvice(fromData, toData) {
        return `${fromData.meaning}から${toData.meaning}への移行期にあります。` +
               '大きな視点で変化を受け入れることが大切です。';
    }
    
    /**
     * 哲学的意味の取得
     */
    getPhilosophicalMeaning(fromHex, toHex) {
        if (fromHex === 1 && toHex === 2) {
            return '純陽から純陰への完全な転換。積極性から受容性への根本的な変化。';
        }
        if (fromHex === 2 && toHex === 1) {
            return '純陰から純陽への完全な転換。受容性から積極性への根本的な変化。';
        }
        return '陰陽の完全な反転。物事の根本的な転換期。';
    }
}