class OSDetailEngine {
    constructor(dataManager) {
        if (!dataManager) {
            throw new Error("OSDetailEngineにはDataManagerインスタンスが必要です。");
        }
        this.dataManager = dataManager;
        this.detailsCache = new Map();
    }

    async loadHexagramDetails(hexagramId) {
        if (this.detailsCache.has(hexagramId)) {
            return this.detailsCache.get(hexagramId);
        }

        try {
            // HEXAGRAM_DETAILSから詳細データを取得
            const details = window.HEXAGRAM_DETAILS ? window.HEXAGRAM_DETAILS[hexagramId] : null;

            if (!details) {
                // フォールバックとしてDataManagerから基本データを取得
                console.warn(`[OSDetailEngine] ${hexagramId}番の詳細データが見つかりません。基本データでフォールバックします。`);
                const basicData = this.dataManager.getUnifiedHexagramData(hexagramId);
                if (!basicData) {
                    throw new Error(`${hexagramId}番の卦データが見つかりません。`);
                }
                this.detailsCache.set(hexagramId, basicData);
                return basicData;
            }

            this.detailsCache.set(hexagramId, details);
            return details;
        } catch (error) {
            console.error(`[OSDetailEngine] ${hexagramId}番の卦の詳細読み込みエラー:`, error);
            throw new Error(`卦の詳細データの読み込みに失敗しました: ${error.message}`);
        }
    }

    formatForDisplay(details) {
        if (!details) {
            return null;
        }

        try {
            return {
                name: details.name || "名称不明",
                catchphrase: details.catchphrase || "キャッチフレーズ不明",
                description: details.description || "説明不明",
                keywords: details.keywords || [],
                behavioralPatterns: details.behavioralPatterns || [],
                impression: details.impression || "",
                triggerSituations: details.triggerSituations || [],
                // 八卦の構成などをここに追加していく
            };
        } catch (error) {
            console.error("[OSDetailEngine] 表示用データフォーマットエラー:", error);
            return null;
        }
    }
}
