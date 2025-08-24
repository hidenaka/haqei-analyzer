/**
 * Advance Processor Class
 * 進爻処理の明確な定義と実装
 */

export class AdvanceProcessor {
    constructor() {
        // 進爻の哲学的定義
        this.philosophy = {
            definition: '同一卦内での成熟・発展段階の進行',
            interpretation: '現在の状況が質的に変化せず、段階的に深化する過程',
            limitation: '第6爻に達した場合、それ以上の進爻は不可'
        };
        
        // 各爻の段階名
        this.stageNames = {
            1: '萌芽期',
            2: '基礎形成期',
            3: '実行開始期',
            4: '展開期',
            5: '成熟期',
            6: '完成期'
        };
        
        // 易経的な段階名（オプション）
        this.ichingStageNames = {
            1: '潜龍（始まりの兆し）',
            2: '見龍（表面化の始まり）',
            3: '君子（実行の段階）',
            4: '躍龍（飛躍への準備）',
            5: '飛龍（最高の位置）',
            6: '亢龍（極みと転換）'
        };
    }
    
    /**
     * 進爻が可能かどうかを判定
     * @param {number} currentLine - 現在の爻位（1-6）
     * @returns {boolean} 進爻可能かどうか
     */
    canAdvance(currentLine) {
        return currentLine >= 1 && currentLine < 6;
    }
    
    /**
     * 進爻チェーンを生成
     * @param {number} hexNum - 卦番号
     * @param {number} startLine - 開始爻位（1-6）
     * @param {number} steps - ステップ数
     * @returns {Array} 進爻チェーン
     */
    generateAdvanceChain(hexNum, startLine, steps) {
        const chain = [];
        let currentLine = startLine;
        
        for (let i = 0; i < steps; i++) {
            if (!this.canAdvance(currentLine)) {
                // 6爻に達したら進爻停止
                console.log(`Line ${currentLine} is the top line. Advance stops.`);
                break;
            }
            
            const nextLine = currentLine + 1;
            
            chain.push({
                type: 'advance',
                from: {
                    hex: hexNum,
                    line: currentLine,
                    stage: this.getStageName(currentLine)
                },
                to: {
                    hex: hexNum,
                    line: nextLine,
                    stage: this.getStageName(nextLine)
                },
                description: this.generateAdvanceDescription(hexNum, currentLine, nextLine),
                philosophy: '段階的成熟',
                keywords: [
                    this.getStageName(currentLine),
                    this.getStageName(nextLine),
                    '発展',
                    '成熟'
                ]
            });
            
            currentLine = nextLine;
        }
        
        return chain;
    }
    
    /**
     * 段階名を取得
     * @param {number} lineNum - 爻位（1-6）
     * @param {boolean} useIching - 易経的な名称を使用するか
     * @returns {string} 段階名
     */
    getStageName(lineNum, useIching = false) {
        if (useIching) {
            return this.ichingStageNames[lineNum] || `第${lineNum}爻`;
        }
        return this.stageNames[lineNum] || `第${lineNum}段階`;
    }
    
    /**
     * 進爻の説明文を生成
     * @param {number} hexNum - 卦番号
     * @param {number} fromLine - 開始爻位
     * @param {number} toLine - 終了爻位
     * @returns {string} 説明文
     */
    generateAdvanceDescription(hexNum, fromLine, toLine) {
        const fromStage = this.getStageName(fromLine);
        const toStage = this.getStageName(toLine);
        const fromIching = this.getStageName(fromLine, true);
        const toIching = this.getStageName(toLine, true);
        
        // H384データがあれば使用（フォールバック付き）
        const fromLineData = this.getLineData(hexNum, fromLine);
        const toLineData = this.getLineData(hexNum, toLine);
        
        if (fromLineData && toLineData) {
            return `${fromLineData.stage}から${toLineData.stage}へと発展。` +
                   `${fromLineData.keyword}の段階を経て、${toLineData.keyword}へと成熟します。`;
        }
        
        // フォールバック説明
        return `${fromStage}から${toStage}へと発展。${fromIching}の段階から${toIching}へと成熟していきます。`;
    }
    
    /**
     * H384データから爻データを取得（モック実装）
     * @param {number} hexNum - 卦番号
     * @param {number} lineNum - 爻位
     * @returns {Object|null} 爻データ
     */
    getLineData(hexNum, lineNum) {
        // H384データベースが利用可能な場合はそこから取得
        if (typeof window !== 'undefined' && window.H384_DATA) {
            const data = window.H384_DATA.find(item =>
                item['卦番号'] === hexNum && item['爻位'] === lineNum
            );
            if (data) {
                return {
                    stage: this.getStageName(lineNum),
                    keyword: data['キーワード'] || `第${lineNum}爻`,
                    description: data['現代解釈の要約'] || '変化の段階'
                };
            }
        }
        
        // フォールバックデータ
        return {
            stage: this.getStageName(lineNum),
            keyword: this.getDefaultKeyword(lineNum),
            description: this.getDefaultDescription(lineNum)
        };
    }
    
    /**
     * デフォルトのキーワードを取得
     * @param {number} lineNum - 爻位
     * @returns {string} キーワード
     */
    getDefaultKeyword(lineNum) {
        const keywords = {
            1: '始動',
            2: '蓄積',
            3: '行動',
            4: '展開',
            5: '統合',
            6: '完成'
        };
        return keywords[lineNum] || '変化';
    }
    
    /**
     * デフォルトの説明を取得
     * @param {number} lineNum - 爻位
     * @returns {string} 説明
     */
    getDefaultDescription(lineNum) {
        const descriptions = {
            1: '物事の始まりの段階。潜在的な可能性が芽生える',
            2: '基礎を固める段階。内的な力を蓄える',
            3: '外に向かって行動を起こす段階。初めての試み',
            4: '本格的な展開の段階。外部との相互作用',
            5: '成熟と統合の段階。最高の位置での調和',
            6: '完成と新たな転換の段階。極みからの変化'
        };
        return descriptions[lineNum] || '変化と発展の段階';
    }
    
    /**
     * 進爻の可能性を評価
     * @param {number} hexNum - 卦番号
     * @param {number} currentLine - 現在の爻位
     * @returns {Object} 評価結果
     */
    evaluateAdvancePotential(hexNum, currentLine) {
        const canAdvance = this.canAdvance(currentLine);
        const remainingSteps = canAdvance ? 6 - currentLine : 0;
        
        return {
            possible: canAdvance,
            currentStage: this.getStageName(currentLine),
            remainingSteps: remainingSteps,
            nextStage: canAdvance ? this.getStageName(currentLine + 1) : null,
            recommendation: this.getAdvanceRecommendation(currentLine)
        };
    }
    
    /**
     * 進爻に関する推奨事項を取得
     * @param {number} currentLine - 現在の爻位
     * @returns {string} 推奨事項
     */
    getAdvanceRecommendation(currentLine) {
        if (currentLine === 6) {
            return '既に完成期にあります。新たな始まりを考える時期です。';
        } else if (currentLine === 5) {
            return '成熟期にあります。完成に向けて最後の調整を行いましょう。';
        } else if (currentLine >= 3) {
            return '実行・展開期にあります。着実に前進を続けましょう。';
        } else {
            return '基礎段階にあります。しっかりと土台を築きましょう。';
        }
    }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== 'undefined') {
    window.AdvanceProcessor = AdvanceProcessor;
    console.log('🌐 AdvanceProcessor registered to window object');
}