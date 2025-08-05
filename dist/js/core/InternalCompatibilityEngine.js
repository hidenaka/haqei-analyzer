import { CompatibilityType } from '../data/compatibility_definition.js';

class InternalCompatibilityEngine {
    constructor(dataManager) {
        if (!dataManager) {
            throw new Error("InternalCompatibilityEngineにはDataManagerインスタンスが必要です。");
        }
        this.dataManager = dataManager;
    }

    /**
     * 2つのOS間の相性を評価する
     * @param {number} os1Id - 最初のOSの卦ID
     * @param {number} os2Id - 2番目のOSの卦ID
     * @returns {CompatibilityEntry | null}
     */
    analyzeCompatibility(os1Id, os2Id) {
        try {
            // CompatibilityMatrixから相性データを取得
            const matrix = window.COMPATIBILITY_MATRIX;
            if (!matrix || !matrix[os1Id] || !matrix[os1Id][os2Id]) {
                console.warn(`[InternalCompatibilityEngine] 相性データが見つかりません: ${os1Id}-${os2Id}`);
                // データが見つからない場合はデフォルト値を返すか、エラーをスローする
                return {
                    synergy: 0.5, harmony: 0.5, tension: 0.5, conflict: 0.5, chaos: 0.5,
                    type: CompatibilityType.HARMONY,
                    summary: "データ不足のため一般的な相性です。",
                    advice: ""
                };
            }
            return matrix[os1Id][os2Id];
        } catch (error) {
            console.error(`[InternalCompatibilityEngine] 相性分析エラー (${os1Id}-${os2Id}):`, error);
            // 「健全なクラッシュ」の概念を適用：エラーが発生してもシステム全体を停止させず、
            // 適切なフォールバック値やエラー情報を提供して処理を続行させる。
            return {
                synergy: 0.0, harmony: 0.0, tension: 1.0, conflict: 1.0, chaos: 1.0,
                type: CompatibilityType.CONFLICT,
                summary: `相性分析中にエラーが発生しました: ${error.message}`,
                advice: "システムエラーが発生しました。管理者に連絡してください。"
            };
        }
    }

    /**
     * エンジンOSとインターフェースOSの関係性を分析する
     * @param {number} engineOsId
     * @param {number} interfaceOsId
     * @returns {CompatibilityEntry}
     */
    analyzeEngineInterface(engineOsId, interfaceOsId) {
        return this.analyzeCompatibility(engineOsId, interfaceOsId);
    }

    /**
     * エンジンOSとセーフモードOSの関係性を分析する
     * @param {number} engineOsId
     * @param {number} safeModeOsId
     * @returns {CompatibilityEntry}
     */
    analyzeEngineSafeMode(engineOsId, safeModeOsId) {
        return this.analyzeCompatibility(engineOsId, safeModeOsId);
    }

    /**
     * インターフェースOSとセーフモードOSの関係性を分析する
     * @param {number} interfaceOsId
     * @param {number} safeModeOsId
     * @returns {CompatibilityEntry}
     */
    analyzeInterfaceSafeMode(interfaceOsId, safeModeOsId) {
        return this.analyzeCompatibility(interfaceOsId, safeModeOsId);
    }

    /**
     * 3つのOS間の全体的な相性を分析し、統合的な洞察を提供する
     * @param {number} engineOsId
     * @param {number} interfaceOsId
     * @param {number} safeModeOsId
     * @returns {{engineInterface: CompatibilityEntry, engineSafeMode: CompatibilityEntry, interfaceSafeMode: CompatibilityEntry, overallSummary: string, overallAdvice: string}}
     */
    analyzeTripleOSCompatibility(engineOsId, interfaceOsId, safeModeOsId) {
        const engineInterface = this.analyzeEngineInterface(engineOsId, interfaceOsId);
        const engineSafeMode = this.analyzeEngineSafeMode(engineOsId, safeModeOsId);
        const interfaceSafeMode = this.analyzeInterfaceSafeMode(interfaceOsId, safeModeOsId);

        // ここで3つの相性結果を統合し、全体的なサマリーとアドバイスを生成するロジックを実装
        // これは複雑なため、初期段階ではシンプルな統合に留める
        let overallSummary = "";
        let overallAdvice = "";

        const types = [engineInterface.type, engineSafeMode.type, interfaceSafeMode.type];

        if (types.every(type => type === CompatibilityType.SYNERGY || type === CompatibilityType.HARMONY)) {
            overallSummary = "3つのOSは非常に調和しており、高い生産性と安定性をもたらします。";
            overallAdvice = "このバランスを維持し、さらなる成長のために積極的に挑戦してください。";
        } else if (types.some(type => type === CompatibilityType.CONFLICT || type === CompatibilityType.CHAOS)) {
            overallSummary = "OS間に顕著な葛藤や混沌が見られます。内的な摩擦がエネルギーを消耗する可能性があります。";
            overallAdvice = "各OSの特性を深く理解し、対立の原因を探り、意識的な統合を試みてください。必要であれば専門家のサポートも検討しましょう。";
        } else if (types.some(type => type === CompatibilityType.TENSION)) {
            overallSummary = "OS間に適度な緊張関係があります。これは成長の原動力となり得ます。";
            overallAdvice = "この緊張を建設的に活用し、自己成長の機会として捉えましょう。対話と理解を深めることが重要です。";
        } else {
            overallSummary = "3つのOSは概ね調和していますが、一部に改善の余地があります。";
            overallAdvice = "各OSの強みを活かしつつ、弱点を補完し合う方法を探りましょう。";
        }

        return {
            engineInterface,
            engineSafeMode,
            interfaceSafeMode,
            overallSummary,
            overallAdvice
        };
    }
}
