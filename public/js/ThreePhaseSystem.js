/**
 * 3フェーズ進爻・変爻システム
 * 初期卦・爻から3回の選択で2³=8パターンを生成
 */

// PhaseManager: 3フェーズの状態管理
class PhaseManager {
    constructor(initialHex, initialLine) {
        this.currentPhase = 0;
        this.maxPhases = 3;
        this.decisions = []; // 'jin' or 'heng' の記録
        this.states = [{
            hex: initialHex,
            line: initialLine,
            phase: 0
        }];
    }

    // 進爻: 爻位+1（同一卦）
    advanceLine(hex, line) {
        const nextLine = line < 6 ? line + 1 : 1; // 6爻を超えたら1に戻る
        return { hex: hex, line: nextLine };
    }

    // 変爻: 卦変更（爻位保持）- KingWenMapping使用
    changeHexagram(hex, line) {
        // KingWenMappingが利用可能な場合は使用
        if (typeof window !== 'undefined' && window.kingWenMapping) {
            const transformedHex = window.kingWenMapping.calculateTransformedHex(hex, line);
            return { hex: transformedHex || ((hex % 64) + 1), line: line };
        }
        
        // フォールバック: 簡易変爻計算
        const transformedHex = ((hex - 1 + line * 7) % 64) + 1;
        return { hex: transformedHex, line: line };
    }

    // 選択を記録して次の状態へ
    makeDecision(choice) {
        if (this.currentPhase >= this.maxPhases) return false;
        
        const currentState = this.states[this.states.length - 1];
        let nextState;
        
        if (choice === 'jin') {
            nextState = this.advanceLine(currentState.hex, currentState.line);
        } else if (choice === 'heng') {
            nextState = this.changeHexagram(currentState.hex, currentState.line);
        } else {
            throw new Error('Invalid choice: must be "jin" or "heng"');
        }
        
        nextState.phase = this.currentPhase + 1;
        this.decisions.push(choice);
        this.states.push(nextState);
        this.currentPhase++;
        
        return true;
    }

    // 現在の状態を取得
    getCurrentState() {
        return this.states[this.states.length - 1];
    }

    // リセット
    reset() {
        const initial = this.states[0];
        this.currentPhase = 0;
        this.decisions = [];
        this.states = [{
            hex: initial.hex,
            line: initial.line,
            phase: 0
        }];
    }

    // 8パターン全てを生成
    getAllPaths() {
        const patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
        const results = [];
        
        patterns.forEach(pattern => {
            const tempManager = new PhaseManager(this.states[0].hex, this.states[0].line);
            
            for (let char of pattern) {
                tempManager.makeDecision(char === 'J' ? 'jin' : 'heng');
            }
            
            results.push({
                pattern: pattern,
                patternDisplay: this.formatPattern(pattern),
                decisions: tempManager.decisions,
                finalState: tempManager.getCurrentState(),
                path: tempManager.states,
                description: this.generateDescription(pattern, tempManager.states)
            });
        });
        
        return results;
    }

    // パターンを読みやすい形式に
    formatPattern(pattern) {
        const mapping = { 'J': '進', 'H': '変' };
        return pattern.split('').map(c => mapping[c]).join('-');
    }

    // パターンの説明生成
    generateDescription(pattern, states) {
        const phases = [];
        for (let i = 1; i < states.length; i++) {
            const prev = states[i-1];
            const curr = states[i];
            const action = pattern[i-1] === 'J' ? '進爻' : '変爻';
            phases.push(`第${i}段階: ${action}で卦${curr.hex}・爻${curr.line}へ`);
        }
        return phases.join(' → ');
    }
}

// CombinationGenerator: 8通りの組み合わせ生成
class CombinationGenerator {
    constructor() {
        this.patterns = ['JJJ', 'JJH', 'JHJ', 'JHH', 'HJJ', 'HJH', 'HHJ', 'HHH'];
    }

    // 全組み合わせを生成
    generateAllCombinations(initialHex, initialLine) {
        const manager = new PhaseManager(initialHex, initialLine);
        return manager.getAllPaths();
    }

    // パターンの意味を解釈
    interpretPattern(pattern) {
        const interpretations = {
            'JJJ': '一貫してテーマを深める道',
            'JJH': '深めた後に転換する道',
            'JHJ': '転換後に新テーマを深める道',
            'JHH': '早期転換から更に変化する道',
            'HJJ': '転換後に着実に進む道',
            'HJH': '変化と深化を繰り返す道',
            'HHJ': '連続転換後に定着する道',
            'HHH': '常に新しい方向を探る道'
        };
        return interpretations[pattern] || '独自の道';
    }
}

// ChoicePresenter: 選択肢の生成と表示
class ChoicePresenter {
    constructor() {
        this.h384Data = null;
        this.loadH384Data();
    }

    // H384データベースからキーワード取得
    loadH384Data() {
        if (typeof H384_DATA !== 'undefined') {
            this.h384Data = H384_DATA;
        }
    }

    // キーワード取得
    getKeywords(hex, line) {
        if (this.h384Data) {
            // 通し番号計算: (卦番号-1)*6 + 爻位
            const index = (hex - 1) * 6 + line - 1;
            const data = this.h384Data[index];
            if (data) {
                return {
                    keyword: data['キーワード'][0] || '変化',
                    theme: data['現代解釈の要約'] || '新たな展開'
                };
            }
        }
        
        // フォールバック
        return {
            keyword: `卦${hex}爻${line}`,
            theme: '状況の展開'
        };
    }

    // 選択肢を表示用に整形
    presentChoices(hex, line, phase) {
        const keywords = this.getKeywords(hex, line);
        const manager = new PhaseManager(hex, line);
        
        return {
            phase: phase + 1,
            current: {
                hex: hex,
                line: line,
                keyword: keywords.keyword,
                theme: keywords.theme,
                display: `卦${hex}・爻${line}「${keywords.keyword}」`
            },
            jin: {
                action: '進爻：テーマに沿って進む',
                description: `「${keywords.keyword}」のテーマを深める`,
                next: manager.advanceLine(hex, line),
                nextKeywords: this.getKeywords(manager.advanceLine(hex, line).hex, manager.advanceLine(hex, line).line)
            },
            heng: {
                action: '変爻：新しい方向へ転換',
                description: `「${keywords.keyword}」から新たな展開へ`,
                next: manager.changeHexagram(hex, line),
                nextKeywords: this.getKeywords(manager.changeHexagram(hex, line).hex, manager.changeHexagram(hex, line).line)
            }
        };
    }

    // 最終結果の解釈
    interpretFinalState(path, pattern) {
        const finalState = path[path.length - 1];
        const keywords = this.getKeywords(finalState.hex, finalState.line);
        const generator = new CombinationGenerator();
        
        return {
            pattern: pattern,
            interpretation: generator.interpretPattern(pattern),
            finalHex: finalState.hex,
            finalLine: finalState.line,
            finalKeyword: keywords.keyword,
            finalTheme: keywords.theme,
            journey: path.map((state, i) => {
                const kw = this.getKeywords(state.hex, state.line);
                return {
                    phase: i,
                    hex: state.hex,
                    line: state.line,
                    keyword: kw.keyword
                };
            })
        };
    }
}

// エクスポート（グローバル変数として公開）
if (typeof window !== 'undefined') {
    window.PhaseManager = PhaseManager;
    window.CombinationGenerator = CombinationGenerator;
    window.ChoicePresenter = ChoicePresenter;
    
    // システム初期化
    window.initThreePhaseSystem = function(initialHex = 1, initialLine = 1) {
        const manager = new PhaseManager(initialHex, initialLine);
        const generator = new CombinationGenerator();
        const presenter = new ChoicePresenter();
        
        return {
            manager: manager,
            generator: generator,
            presenter: presenter,
            
            // 現在の選択肢を取得
            getCurrentChoices: function() {
                const state = manager.getCurrentState();
                return presenter.presentChoices(state.hex, state.line, manager.currentPhase);
            },
            
            // 選択を実行
            makeChoice: function(choice) {
                return manager.makeDecision(choice);
            },
            
            // 8パターン全てを取得
            getAllScenarios: function() {
                const combinations = generator.generateAllCombinations(initialHex, initialLine);
                return combinations.map(combo => {
                    return presenter.interpretFinalState(combo.path, combo.pattern);
                });
            },
            
            // リセット
            reset: function() {
                manager.reset();
            }
        };
    };
    
    console.log('✅ ThreePhaseSystem loaded successfully');
}

// Node.js環境でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhaseManager, CombinationGenerator, ChoicePresenter };
}