import { CompatibilityType } from './compatibility_definition.js';

// 64x64の相性マトリックスを生成する
function generateCompatibilityMatrix() {
    const matrix = {};
    const defaultScore = 0.5;

    for (let i = 1; i <= 64; i++) {
        matrix[i] = {};
        for (let j = 1; j <= 64; j++) {
            matrix[i][j] = {
                synergy: defaultScore,
                harmony: defaultScore,
                tension: defaultScore,
                conflict: defaultScore,
                chaos: defaultScore,
                type: CompatibilityType.HARMONY, // デフォルトは調和
                summary: "",
                advice: ""
            };
        }
    }
    return matrix;
}

// 特定のエントリを更新するためのヘルパー関数
function updateCompatibilityEntry(matrix, id1, id2, data) {
    if (matrix[id1] && matrix[id1][id2]) {
        matrix[id1][id2] = { ...matrix[id1][id2], ...data };
    }
    // 対称的な関係を保証
    if (matrix[id2] && matrix[id2][id1]) {
        matrix[id2][id1] = { ...matrix[id2][id1], ...data };
    }
}

const COMPATIBILITY_MATRIX = generateCompatibilityMatrix();

// --- サンプルデータ入力 ---
// 例：乾為天(1)と坤為地(2)の相性
updateCompatibilityEntry(COMPATIBILITY_MATRIX, 1, 2, {
    synergy: 0.9,
    harmony: 0.8,
    tension: 0.3,
    conflict: 0.1,
    chaos: 0.2,
    type: CompatibilityType.SYNERGY,
    summary: "天と地。創造と受容の完璧な補完関係。非常に強力なシナジーを生み出す。",
    advice: "リーダー（乾）はビジョンを示し、サポーター（坤）はそれを現実化する。互いの役割を尊重することが成功の鍵。"
});

// 例：水雷屯(3)と山水蒙(4)の相性 (HARMONY)
updateCompatibilityEntry(COMPATIBILITY_MATRIX, 3, 4, {
    synergy: 0.6,
    harmony: 0.7,
    tension: 0.4,
    conflict: 0.2,
    chaos: 0.3,
    type: CompatibilityType.HARMONY,
    summary: "困難な始まりと未熟な状態。共に学び、成長することで安定した関係を築ける。",
    advice: "互いの未熟さを認め、助け合いながら進むことで、着実な発展が期待できる。"
});

// 例：訟(6)と師(7)の相性 (TENSION)
updateCompatibilityEntry(COMPATIBILITY_MATRIX, 6, 7, {
    synergy: 0.3,
    harmony: 0.4,
    tension: 0.7,
    conflict: 0.5,
    chaos: 0.4,
    type: CompatibilityType.TENSION,
    summary: "争いと統率。異なる目的やアプローチが緊張を生むが、適切に管理すれば成長の機会となる。",
    advice: "対立を避けず、建設的な議論を通じて解決策を探る。共通の目標を見出すことが重要。"
});

// 例：否(12)と泰(11)の相性 (CONFLICT)
updateCompatibilityEntry(COMPATIBILITY_MATRIX, 12, 11, {
    synergy: 0.1,
    harmony: 0.2,
    tension: 0.8,
    conflict: 0.9,
    chaos: 0.6,
    type: CompatibilityType.CONFLICT,
    summary: "閉塞と平和。根本的な価値観や方向性の違いから、衝突が避けられない関係。",
    advice: "互いの違いを無理に埋めようとせず、距離を置くことも選択肢。あるいは、明確な役割分担で衝突を最小限に抑える。"
});

// 例：沢火革(49)と火風鼎(50)の相性 (CHAOS)
updateCompatibilityEntry(COMPATIBILITY_MATRIX, 49, 50, {
    synergy: 0.4,
    harmony: 0.3,
    tension: 0.6,
    conflict: 0.7,
    chaos: 0.9,
    type: CompatibilityType.CHAOS,
    summary: "変革と安定。予測不能な変化と、それを固定しようとする力がぶつかり合い、混沌とした状態になりやすい。",
    advice: "変化を受け入れつつも、核となる安定を保つ努力が必要。柔軟な対応と、予期せぬ事態への準備が求められる。"
});


// グローバルスコープで利用可能にする
if (typeof window !== 'undefined') {
    window.COMPATIBILITY_MATRIX = COMPATIBILITY_MATRIX;
}
