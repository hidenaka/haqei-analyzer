class HexagramContentLoader {
    constructor(dataManager) {
        if (!dataManager) {
            throw new Error("HexagramContentLoaderにはDataManagerインスタンスが必要です。");
        }
        this.dataManager = dataManager;
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    async load(hexagramId) {
        if (this.cache.has(hexagramId)) {
            console.log(`[HexagramContentLoader] Cache hit for hexagram ${hexagramId}`);
            return this.cache.get(hexagramId);
        }

        if (this.pendingRequests.has(hexagramId)) {
            console.log(`[HexagramContentLoader] Joining pending request for hexagram ${hexagramId}`);
            return this.pendingRequests.get(hexagramId);
        }

        console.log(`[HexagramContentLoader] Fetching details for hexagram ${hexagramId}`);
        const requestPromise = this._fetchHexagramDetails(hexagramId);
        this.pendingRequests.set(hexagramId, requestPromise);

        try {
            const details = await requestPromise;
            this.cache.set(hexagramId, details);
            return details;
        } finally {
            this.pendingRequests.delete(hexagramId);
        }
    }

    async _fetchHexagramDetails(hexagramId) {
        try {
            // 現在はDataManagerから直接データを取得
            // 将来的にはここで非同期のフェッチ処理（例: fetch(./data/details/${hexagramId}.json)）を行う
            const hexagramData = this.dataManager.getUnifiedHexagramData(hexagramId);
            if (!hexagramData) {
                throw new Error(`データが見つかりません。`);
            }

            // ダミーの詳細情報を付与
            return {
                ...hexagramData,
                detailedDescription: `これは${hexagramData.name}の非常に詳細な説明です。この内容は将来的に外部ファイルから動的に読み込まれます。`,
                historicalExamples: [
                    { name: "歴史上の人物A", story: `${hexagramData.name}のエネルギーを体現したエピソード...` },
                    { name: "歴史上の人物B", story: `別の${hexagramData.name}の側面を示したエピソード...` },
                ],
            };
        } catch (error) {
            console.error(`[HexagramContentLoader] ${hexagramId}番の卦の詳細取得エラー:`, error);
            throw error;
        }
    }

    invalidateCache(hexagramId) {
        if (this.cache.has(hexagramId)) {
            this.cache.delete(hexagramId);
            console.log(`[HexagramContentLoader] Cache invalidated for hexagram ${hexagramId}`);
        }
    }

    clearCache() {
        this.cache.clear();
        console.log("[HexagramContentLoader] All cache cleared");
    }
}
