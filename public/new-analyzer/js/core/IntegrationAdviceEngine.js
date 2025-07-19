import { CompatibilityType } from '../data/compatibility_definition.js';

class IntegrationAdviceEngine {
    constructor(dataManager, internalCompatibilityEngine) {
        if (!dataManager || !internalCompatibilityEngine) {
            throw new Error("IntegrationAdviceEngineにはDataManagerとInternalCompatibilityEngineインスタンスが必要です。");
        }
        this.dataManager = dataManager;
        this.internalCompatibilityEngine = internalCompatibilityEngine;
    }

    /**
     * 3つのOSの組み合わせに基づいて統合的なアドバイスを生成する
     * @param {number} engineOsId - エンジンOSの卦ID
     * @param {number} interfaceOsId - インターフェースOSの卦ID
     * @param {number} safeModeOsId - セーフモードOSの卦ID
     * @returns {Object} 統合アドバイス
     */
    generateAdvice(engineOsId, interfaceOsId, safeModeOsId) {
        const compatibility = this.internalCompatibilityEngine.analyzeTripleOSCompatibility(
            engineOsId, interfaceOsId, safeModeOsId
        );

        const engineDetails = this.dataManager.getDetailedHexagramInfo(engineOsId);
        const interfaceDetails = this.dataManager.getDetailedHexagramInfo(interfaceOsId);
        const safeModeDetails = this.dataManager.getDetailedHexagramInfo(safeModeOsId);

        let overallGuidance = "";
        let specificStrategies = [];
        let growthOpportunities = [];

        // 全体的な相性タイプに基づくガイダンス
        const types = [compatibility.engineInterface.type, compatibility.engineSafeMode.type, compatibility.interfaceSafeMode.type];
        const hasSynergy = types.includes(CompatibilityType.SYNERGY);
        const hasConflict = types.includes(CompatibilityType.CONFLICT);
        const hasTension = types.includes(CompatibilityType.TENSION);
        const hasChaos = types.includes(CompatibilityType.CHAOS);

        if (hasSynergy && !hasConflict && !hasTension && !hasChaos) {
            overallGuidance = "あなたの3つのOSは非常に高いレベルで調和しており、内的なエネルギーがスムーズに流れています。この強固な基盤を活かし、大胆な挑戦をすることで、さらなる自己実現が可能です。";
            specificStrategies.push("• 自分の直感を信じ、積極的に行動を起こしましょう。成功体験がさらなる自信につながります。");
            growthOpportunities.push("• 新しい環境や未知の領域に飛び込み、適応力を試すことで、あなたの潜在能力がさらに開花します。");
        } else if (hasConflict || hasChaos) {
            overallGuidance = "OS間に顕著な葛藤や混沌が見られます。これは内的なエネルギーの消耗につながり、ストレスの原因となる可能性があります。しかし、この矛盾を理解し、適切に対処することで、あなたはより深く、多面的な人格へと成長できます。";
            specificStrategies.push("• 葛藤の原因となっているOS間の特性を深く理解し、それぞれの役割を再定義しましょう。");
            specificStrategies.push("• 意識的にリラックスする時間を作り、内的なエネルギーの回復に努めましょう。");
            growthOpportunities.push("• 自分の弱みや苦手な側面から目を背けず、それらを統合するプロセスを通じて、真の強さを獲得できます。");
        } else if (hasTension) {
            overallGuidance = "OS間に適度な緊張関係があります。これは成長の原動力となり得ますが、放置すると葛藤に発展する可能性もあります。この緊張を建設的に活用することが重要です。";
            specificStrategies.push("• 異なるOSの視点から物事を捉える練習をしましょう。多角的な視点が問題解決の鍵となります。");
            specificStrategies.push("• 自分の内なる声に耳を傾け、それぞれのOSが何を求めているのかを理解しましょう。");
            growthOpportunities.push("• 困難な状況に直面した時こそ、あなたの真価が問われます。この緊張を乗り越えることで、あなたは大きく成長します。");
        } else {
            overallGuidance = "あなたの3つのOSは概ね調和していますが、さらなる統合と成長の可能性があります。";
            specificStrategies.push("• 各OSの強みをさらに伸ばし、弱点を補完し合う方法を探りましょう。");
            specificStrategies.push("• 日常生活の中で、意識的に異なるOSの側面を使い分ける練習をしましょう。");
            growthOpportunities.push("• 自己理解を深めることで、あなたの人生はより豊かになります。");
        }

        // 各OSの詳細情報に基づくアドバイス
        specificStrategies.push(`• エンジンOS「${engineDetails.name}」の核となる動機を理解し、それに沿った行動を心がけましょう。`);
        specificStrategies.push(`• インターフェースOS「${interfaceDetails.name}」の行動パターンを意識し、対人関係での表現を調整しましょう。`);
        specificStrategies.push(`• セーフモードOS「${safeModeDetails.name}」の発動状況を把握し、健全な防御メカニズムを構築しましょう。`);

        return {
            overallGuidance,
            specificStrategies,
            growthOpportunities,
            compatibilityDetails: compatibility
        };
    }

    /**
     * 成長プランを生成する
     * @param {number} engineOsId
     * @param {number} interfaceOsId
     * @param {number} safeModeOsId
     * @returns {Object} 成長プラン
     */
    generateGrowthPlan(engineOsId, interfaceOsId, safeModeOsId) {
        const advice = this.generateAdvice(engineOsId, interfaceOsId, safeModeOsId);
        const engineDetails = this.dataManager.getDetailedHexagramInfo(engineOsId);
        const interfaceDetails = this.dataManager.getDetailedHexagramInfo(interfaceOsId);
        const safeModeDetails = this.dataManager.getDetailedHexagramInfo(safeModeOsId);

        const shortTerm = [
            `• 毎日5分、自分のエンジンOS「${engineDetails.name}」の核となる動機について瞑想する。`,
            `• インターフェースOS「${interfaceDetails.name}」の行動パターンを意識し、今日の対人関係で一つ実践してみる。`,
            `• ストレスを感じた時、セーフモードOS「${safeModeDetails.name}」がどのように反応するかを観察し、記録する。`
        ];

        const mediumTerm = [
            `• エンジンOSの強みを活かせる新しい趣味や活動を始める（3ヶ月以内）。`,
            `• インターフェースOSの行動パターンを意識的に変える練習をする（例：普段話さないタイプの人と交流する）。`,
            `• セーフモードOSの防御パターンを健全なものに置き換えるための具体的な行動計画を立てる。`
        ];

        const longTerm = [
            `• 3つのOSが完全に統合された理想の自分を具体的に描き、その実現に向けた長期目標を設定する。`,
            `• 内的矛盾を乗り越え、より深い自己理解と受容を達成するための学習を続ける。`,
            `• 自分のOS特性を活かして、社会や他者に貢献できる方法を模索する。`
        ];

        return {
            shortTerm,
            mediumTerm,
            longTerm,
            overallAdvice: advice.overallGuidance
        };
    }
}
