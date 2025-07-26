class EightDimensionAnalysisEngine {
    constructor() {
        // 各次元の定義と意味
        this.dimensions = {
            "dimension_1": { name: "自己認識", description: "自分自身をどれだけ深く理解しているか" },
            "dimension_2": { name: "他者理解", description: "他者の感情や動機をどれだけ正確に把握できるか" },
            "dimension_3": { name: "目標設定", description: "明確な目標を設定し、それに向かって計画を立てる能力" },
            "dimension_4": { name: "実行力", description: "計画を実行に移し、障害を乗り越える力" },
            "dimension_5": { name: "適応力", description: "変化する状況に柔軟に対応し、新しい環境に順応する能力" },
            "dimension_6": { name: "回復力", description: "困難や失敗から立ち直り、精神的な強さを保つ力" },
            "dimension_7": { name: "影響力", description: "他者にポジティブな影響を与え、協力を引き出す能力" },
            "dimension_8": { name: "創造性", description: "新しいアイデアを生み出し、既存の枠にとらわれない発想力" }
        };
    }

    /**
     * 8次元プロファイルデータに基づいて、各次元の質的な解釈を生成する
     * @param {Object} userVector - ユーザーの8次元プロファイルデータ (例: { dimension_1: 0.8, ... })
     * @returns {Object} 各次元の解釈を含むオブジェクト
     */
    analyzeDimensions(userVector) {
        const analysis = {};
        for (const key in this.dimensions) {
            if (userVector.hasOwnProperty(key)) {
                const value = userVector[key];
                const dimension = this.dimensions[key];
                analysis[key] = {
                    name: dimension.name,
                    description: dimension.description,
                    value: value,
                    interpretation: this._interpretValue(value, dimension.name)
                };
            }
        }
        return analysis;
    }

    /**
     * 数値スコアに基づいて質的な解釈を生成するヘルパーメソッド
     * @param {number} value - スコア (0.0 - 1.0)
     * @param {string} dimensionName - 次元名
     * @returns {string} 解釈テキスト
     */
    _interpretValue(value, dimensionName) {
        if (value >= 0.8) {
            return `${dimensionName}において非常に優れており、あなたの強力な強みです。この能力を最大限に活用することで、大きな成果を生み出すことができます。`;
        } else if (value >= 0.6) {
            return `${dimensionName}において高い能力を持っています。この領域をさらに伸ばすことで、あなたの可能性は大きく広がります。`;
        } else if (value >= 0.4) {
            return `${dimensionName}において平均的な能力を持っています。意識的に取り組むことで、さらに向上させることができます。`;
        } else {
            return `${dimensionName}は、あなたの成長のための重要な領域です。この能力を開発することで、新たな視点や機会を得られるでしょう。`;
        }
    }

    /**
     * 8次元プロファイルから全体的な強みと弱みを分析する
     * @param {Object} userVector - ユーザーの8次元プロファイルデータ
     * @returns {{strengths: string[], weaknesses: string[]}}
     */
    analyzeStrengthsWeaknesses(userVector) {
        const strengths = [];
        const weaknesses = [];

        for (const key in userVector) {
            if (userVector.hasOwnProperty(key) && this.dimensions.hasOwnProperty(key)) {
                const value = userVector[key];
                const dimensionName = this.dimensions[key].name;

                if (value >= 0.7) {
                    strengths.push(dimensionName);
                } else if (value <= 0.3) {
                    weaknesses.push(dimensionName);
                }
            }
        }

        return {
            strengths: strengths.length > 0 ? strengths : ["特筆すべき強みは見当たりません。"],
            weaknesses: weaknesses.length > 0 ? weaknesses : ["特筆すべき弱みは見当たりません。"]
        };
    }
}
