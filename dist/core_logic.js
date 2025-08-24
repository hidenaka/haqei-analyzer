/**
 * HAQEI Core Logic - 保持すべき診断ロジック
 * 既存コードから抽出した価値のあるロジック
 */

// ==========================================
// 1. 8次元スコアリングシステム
// ==========================================

const DIMENSIONS = {
    qian_creativity: '乾_創造性',
    zhen_action: '震_行動性', 
    kan_exploration: '坎_探求性',
    gen_stability: '艮_安定性',
    kun_receptiveness: '坤_受容性',
    xun_adaptability: '巽_適応性',
    li_expression: '離_表現性',
    dui_harmony: '兌_調和性'
};

// ==========================================
// 2. スコア計算エンジン（保持）
// ==========================================

function calculateScores(answers, questions) {
    // 8次元スコア初期化
    const scores = {
        qian_creativity: 0,
        zhen_action: 0,
        kan_exploration: 0,
        gen_stability: 0,
        kun_receptiveness: 0,
        xun_adaptability: 0,
        li_expression: 0,
        dui_harmony: 0
    };
    
    // 各質問の回答からスコア集計
    questions.forEach(question => {
        const answer = answers[question.id];
        if (answer) {
            const option = question.options.find(opt => opt.value === answer);
            if (option && option.scoring) {
                Object.entries(option.scoring).forEach(([dimension, score]) => {
                    if (scores.hasOwnProperty(dimension)) {
                        scores[dimension] += score;
                    }
                });
            }
        }
    });
    
    return scores;
}

// ==========================================
// 3. Triple OS判定ロジック（保持）
// ==========================================

function calculateEngineOS(scores) {
    // スコアをソートして最高の2つを取得
    const sortedDimensions = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);
    
    const upperDimension = sortedDimensions[0][0];
    const lowerDimension = sortedDimensions[1][0];
    
    return {
        primaryDimension: upperDimension,
        secondaryDimension: lowerDimension,
        score: sortedDimensions[0][1]
    };
}

function calculateInterfaceOS(scores) {
    // 3-4番目のスコアで決定
    const sortedDimensions = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);
    
    const upperDimension = sortedDimensions[2][0];
    const lowerDimension = sortedDimensions[3][0];
    
    return {
        primaryDimension: upperDimension,
        secondaryDimension: lowerDimension,
        score: sortedDimensions[2][1]
    };
}

function calculateSafeModeOS(scores) {
    // 最低スコアの次元を特定
    const sortedDimensions = Object.entries(scores)
        .sort((a, b) => a[1] - b[1]);
    
    const upperDimension = sortedDimensions[0][0];
    const lowerDimension = sortedDimensions[1][0];
    
    return {
        primaryDimension: upperDimension,
        secondaryDimension: lowerDimension,
        score: sortedDimensions[0][1]
    };
}

// ==========================================
// 4. 五行理論・三爻親和性（保持）
// ==========================================

const TRIGRAM_ELEMENTS = {
    "乾": { element: "金", yang: 3, position: "天" },
    "兌": { element: "金", yang: 2, position: "沢" },
    "離": { element: "火", yang: 2, position: "火" },
    "震": { element: "木", yang: 1, position: "雷" },
    "巽": { element: "木", yang: 2, position: "風" },
    "坎": { element: "水", yang: 1, position: "水" },
    "艮": { element: "土", yang: 1, position: "山" },
    "坤": { element: "土", yang: 0, position: "地" }
};

const ELEMENT_RELATIONS = {
    "木": { generates: "火", destroys: "土", generatedBy: "水", destroyedBy: "金" },
    "火": { generates: "土", destroys: "金", generatedBy: "木", destroyedBy: "水" },
    "土": { generates: "金", destroys: "水", generatedBy: "火", destroyedBy: "木" },
    "金": { generates: "水", destroys: "木", generatedBy: "土", destroyedBy: "火" },
    "水": { generates: "木", destroys: "火", generatedBy: "金", destroyedBy: "土" }
};

function calculateTrigramCompatibility(trigram1, trigram2) {
    const elem1 = TRIGRAM_ELEMENTS[trigram1];
    const elem2 = TRIGRAM_ELEMENTS[trigram2];
    
    if (!elem1 || !elem2) return 0.5;
    
    let compatibility = 0.5;
    
    if (trigram1 === trigram2) {
        compatibility = 1.0;
    }
    else if (ELEMENT_RELATIONS[elem1.element]?.generates === elem2.element) {
        compatibility = 0.8;
    }
    else if (ELEMENT_RELATIONS[elem1.element]?.generatedBy === elem2.element) {
        compatibility = 0.7;
    }
    else if (ELEMENT_RELATIONS[elem1.element]?.destroys === elem2.element) {
        compatibility = 0.2;
    }
    else if (ELEMENT_RELATIONS[elem1.element]?.destroyedBy === elem2.element) {
        compatibility = 0.3;
    }
    
    return compatibility;
}

// ==========================================
// 5. 次元→三爻マッピング（保持）
// ==========================================

function getTrigramFromDimension(dimension) {
    const trigramMap = {
        qian_creativity: "乾",
        zhen_action: "震",
        kan_exploration: "坎",
        gen_stability: "艮",
        kun_receptiveness: "坤",
        xun_adaptability: "巽",
        li_expression: "離",
        dui_harmony: "兌"
    };
    return trigramMap[dimension] || "乾";
}

// ==========================================
// エクスポート
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DIMENSIONS,
        calculateScores,
        calculateEngineOS,
        calculateInterfaceOS,
        calculateSafeModeOS,
        calculateTrigramCompatibility,
        getTrigramFromDimension,
        TRIGRAM_ELEMENTS,
        ELEMENT_RELATIONS
    };
}