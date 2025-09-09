// 実装要件: 統計的偏り検出システム
class StatisticalBiasDetector {
    constructor(historySize = 100, biasThreshold = 0.3, chiSquareAlpha = 0.05, maxPositionRate = 0.3, specialLineCap = 0.01) {
        this.chiSquareAlpha = chiSquareAlpha;
        this.maxPositionRate = maxPositionRate;
        this.specialLineCap = specialLineCap; // 用九/用六 ≤1%
        this.history = [];  // 最近の選択履歴
        this.historySize = historySize;
        this.biasThreshold = biasThreshold;  // 30%超で偏り検出
        this.distribution = new Map();  // 爻IDごとのカウント
    }
    
    addSelection(selection) {
        // 入力検証
        if (!selection || typeof selection.lineId !== 'number' || typeof selection.position !== 'number') {
            console.error('Invalid selection object:', selection);
            return;
        }
        
        // 重複push防止: 同一選択の連続追加をチェック
        const lastSelection = this.history[this.history.length - 1];
        if (lastSelection && 
            lastSelection.lineId === selection.lineId && 
            lastSelection.position === selection.position &&
            lastSelection.hexagramId === selection.hexagramId) {
            console.warn('⚠️ 重複選択検出: 同一選択の連続追加をスキップ');
            return;
        }
        
        this.history.push(selection);
        this.distribution.set(selection.lineId, (this.distribution.get(selection.lineId) || 0) + 1);
        
        if (this.history.length > this.historySize) {
            const removed = this.history.shift();
            const currentCount = this.distribution.get(removed.lineId) || 1;
            if (currentCount <= 1) {
                this.distribution.delete(removed.lineId);
            } else {
                this.distribution.set(removed.lineId, currentCount - 1);
            }
        }
    }
    
    detectBias() {
        // χ²スキップ条件: サンプル数が不十分な場合
        if (this.history.length < 30) {
            return false;
        }
        
        const stats = this.getDistributionStats();
        const consecutive = this.detectConsecutiveBias();
        const positionBias = this.detectPositionBias();
        const specialBias = this.detectSpecialLineBias();
        
        // χ²検定は適切なサンプル数でのみ実行
        let chiSquarePosition = { p: 1, chi2: 0 };
        let chiSquareHexagram = { p: 1, chi2: 0 };
        
        // 位置レベルのχ²検定: 60件以上で実行（6カテゴリ×10サンプル）
        if (this.history.length >= 60) {
            chiSquarePosition = this.computeChiSquarePosition();
        }
        
        // 卦レベルのχ²検定: 320件以上で実行（64カテゴリ×5サンプル）
        if (this.history.length >= 320) {
            chiSquareHexagram = this.computeChiSquareHexagram();
        }
        
        const isBiased = stats.maxFreq > this.biasThreshold || 
                         chiSquarePosition.p <= this.chiSquareAlpha || 
                         chiSquareHexagram.p <= this.chiSquareAlpha || 
                         consecutive > 5 || 
                         positionBias || 
                         specialBias;
        
        if (isBiased) {
            console.warn(`⚠️ 偏り検出: ${JSON.stringify({stats, chiSquarePosition, chiSquareHexagram, consecutive, positionBias, specialBias})}`);
        }
        
        return isBiased;
    }
    
    computeChiSquarePosition() {
        // df=5 for 6 positions - 特殊行（lineId=385,386 または position=7）を厳密に除外
        const validHistory = this.history.filter(item => {
            const lineId = parseInt(item.lineId, 10);
            // 特殊行（用九=385, 用六=386）と position=7 を除外
            return lineId !== 385 && lineId !== 386 && 
                   item.position >= 1 && item.position <= 6;
        });
        
        if (validHistory.length < 30) {
            return { chi2: 0, p: 1, validSamples: validHistory.length, excludedCount: this.history.length - validHistory.length }; // サンプル不足
        }
        
        const observed = Array(6).fill(0);
        validHistory.forEach(item => observed[item.position - 1]++);
        const expected = validHistory.length / 6;
        let chi2 = 0;
        
        // 期待値が5未満の場合はχ²検定不適用
        if (expected < 5) {
            return { chi2: 0, p: 1, validSamples: validHistory.length, excludedCount: this.history.length - validHistory.length, warning: 'expected_too_small' };
        }
        
        observed.forEach(o => chi2 += Math.pow(o - expected, 2) / expected);
        const p = this.approximatePValue(chi2, 5);
        
        return {
            chi2, 
            p, 
            validSamples: validHistory.length, 
            excludedCount: this.history.length - validHistory.length,
            observed,
            expected
        };
    }

    computeChiSquareHexagram() {
        // df=63 for 64 hexagrams
        const observed = new Map();
        this.history.forEach(item => observed.set(item.hexagramId, (observed.get(item.hexagramId) || 0) + 1));
        const expected = this.history.length / 64;
        let chi2 = 0;
        for (let i = 1; i <= 64; i++) {
            const o = observed.get(i) || 0;
            chi2 += Math.pow(o - expected, 2) / expected;
        }
        const p = this.approximatePValue(chi2, 63);
        return {chi2, p};
    }

    approximatePValue(chi2, df) {
        // Simple approximation
        return Math.exp(-chi2 / 2) * Math.pow(chi2 / 2, (df / 2) - 1);
    }

    detectConsecutiveBias() {
        let maxConsecutive = 0, current = 1;
        for (let i = 1; i < this.history.length; i++) {
            if (this.history[i].lineId === this.history[i-1].lineId) {
                current++;
                maxConsecutive = Math.max(maxConsecutive, current);
            } else {
                current = 1;
            }
        }
        return maxConsecutive;
    }

    detectPositionBias() {
        // 特殊行（lineId=385,386 または position=7）を厳密に除外して位置偏りを検出
        const validHistory = this.history.filter(item => {
            const lineId = parseInt(item.lineId, 10);
            // 特殊行（用九=385, 用六=386）と position=7 を除外
            return lineId !== 385 && lineId !== 386 && 
                   item.position >= 1 && item.position <= 6;
        });
        
        if (validHistory.length === 0) {
            console.warn('⚠️ 位置偏り検出: 有効なサンプルが0件（全て特殊行）');
            return false;
        }
        
        const positions = Array(6).fill(0);
        validHistory.forEach(item => positions[item.position - 1]++);
        
        // 各位置の使用率を計算し、閾値を超える位置があるかチェック
        const positionRates = positions.map(count => count / validHistory.length);
        const maxRate = Math.max(...positionRates);
        const biasedPosition = positionRates.findIndex(rate => rate > this.maxPositionRate);
        
        if (biasedPosition !== -1) {
            console.warn(`⚠️ 位置偏り検出: ${biasedPosition + 1}爻が${(positionRates[biasedPosition] * 100).toFixed(1)}% (閾値: ${(this.maxPositionRate * 100)}%) - 有効サンプル: ${validHistory.length}/${this.history.length}`);
            return true;
        }
        
        return false;
    }

    detectSpecialLineBias() {
        if (this.history.length === 0) return false;
        
        // 用九(385)と用六(386)の特殊行判定 - 厳密な数値比較
        const specialLines = [385, 386];
        const specialCount = this.history.filter(item => {
            const lineId = parseInt(item.lineId, 10);
            return specialLines.includes(lineId);
        }).length;
        
        const specialRate = specialCount / this.history.length;
        
        // 特殊行が設定閾値を超える場合は偏りとして検出
        const isSpecialBiased = specialRate > this.specialLineCap;
        
        if (isSpecialBiased) {
            console.warn(`⚠️ 特殊行偏り検出: 用九/用六が${(specialRate * 100).toFixed(2)}% (閾値: ${(this.specialLineCap * 100)}%) - 検出数: ${specialCount}/${this.history.length}`);
        }
        
        return isSpecialBiased;
    }

    getDistributionStats() {
        // 特殊行除外の統計情報を含む詳細レポート
        const validHistory = this.history.filter(item => {
            const lineId = parseInt(item.lineId, 10);
            return lineId !== 385 && lineId !== 386 && 
                   item.position >= 1 && item.position <= 6;
        });
        
        const specialCount = this.history.length - validHistory.length;
        
        const stats = {
            total: this.history.length,
            validSamples: validHistory.length,
            excludedSpecialLines: specialCount,
            specialLineRate: this.history.length > 0 ? specialCount / this.history.length : 0,
            unique: this.distribution.size,
            maxFreq: 0,
            biasedItems: [],
            positionDistribution: Array(6).fill(0)
        };
        
        // 有効サンプルでの位置分布を計算
        validHistory.forEach(item => {
            if (item.position >= 1 && item.position <= 6) {
                stats.positionDistribution[item.position - 1]++;
            }
        });
        
        this.distribution.forEach((count, id) => {
            const freq = count / stats.total;
            if (freq > this.biasThreshold) {
                stats.biasedItems.push({id, freq});
            }
            stats.maxFreq = Math.max(stats.maxFreq, freq);
        });
        
        return stats;
    }
    
    getReport() {
        return {
            stats: this.getDistributionStats(),
            chiSquarePosition: this.computeChiSquarePosition(),
            chiSquareHexagram: this.computeChiSquareHexagram(),
            consecutive: this.detectConsecutiveBias(),
            positionBias: this.detectPositionBias(),
            specialBias: this.detectSpecialLineBias()
        };
    }

    reset() {
        this.history = [];
        this.distribution.clear();
    }
}

// DeterminismGuarantorとの統合例
// UI統合例 (future_simulator.htmlで使用)
// biasDetector.detectBias() でチェック
// biasDetector.getReport() でレポート取得

window.addEventListener('DOMContentLoaded', () => {
    window.biasDetector = new StatisticalBiasDetector();
    // 選択時に追加: biasDetector.addSelection(selectedLineId);
    // 定期チェック: setInterval(() => biasDetector.detectBias(), 60000);
});