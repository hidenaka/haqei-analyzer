const HEXAGRAM_DETAILS = {
    1: {
        name_jp: "乾為天（けんいてん）",
        catchphrase: "天の創造性。無限の可能性を秘めたリーダー。",
        description: "純粋な陽のエネルギーで構成され、創造、リーダーシップ、無限の可能性を象徴します。自ら道を切り開き、他者を導く力強い存在ですが、時にそのエネルギーが強すぎて傲慢に見えることもあります。",
        keywords: ["創造", "リーダーシップ", "父性", "無限", "行動", "決断力"],
        
        // --- Engine OSとしての側面 ---
        engine: {
            strength_meter: 95, // 0-100
            core_drive: "新しいものを創造し、世界に影響を与えること。",
            potential_strengths: [
                "卓越したリーダーシップとカリスマ性",
                "困難な状況を打開する強力な実行力",
                "常に新しい可能性を追求する創造性"
            ],
            potential_weaknesses: [
                "自己中心的で、他者の意見を聞かない傾向",
                "完璧主義で、自分にも他人にも厳しすぎる",
                "休息を取らず、燃え尽きてしまうリスク"
            ]
        },

        // --- Interface OSとしての側面 ---
        interface: {
            how_it_appears: "自信に満ち、堂々とした振る舞い。常にグループの中心にいる。",
            behavioral_patterns: [
                "会議や議論で積極的に意見を述べ、場をリードする",
                "誰もやりたがらない困難なタスクに率先して取り組む",
                "明確なビジョンを語り、周囲を巻き込む"
            ],
            impression_on_others: "頼りになるリーダーだが、少し近寄りがたい。ワンマンに見えることもある。"
        },

        // --- Safe Mode OSとしての側面 ---
        safe_mode: {
            trigger_situations: [
                "自分の権威や能力が脅かされたと感じた時",
                "計画が思い通りに進まず、コントロールを失ったと感じた時",
                "強いストレスやプレッシャーに長期間さらされた時"
            ],
            defensive_patterns: [
                "独断で物事を決定し、他者の介入を拒絶する",
                "過度に批判的になり、他者の欠点を厳しく指摘する",
                "自分の殻に閉じこもり、一切の助言を無視する"
            ],
            internal_state: "「なぜ誰も理解できないんだ」という孤独感と、「全て自分でやらなければ」という過剰な責任感。"
        },

        // --- 八卦の構成 ---
        trigrams: {
            upper: { name: "乾", symbol: "☰", description: "天、創造性、父性" },
            lower: { name: "乾", symbol: "☰", description: "天、行動、決断力" }
        }
    }
    // ... 他の63卦のデータもここに追加
};

if (typeof window !== 'undefined') {
    window.HEXAGRAM_DETAILS = HEXAGRAM_DETAILS;
}
