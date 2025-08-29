// public/js/tests/integration.smoke.js
// 最小統合テスト: 決定論、性能、5爻健全性

class SmokeTests {
    constructor() {
        this.textToBridge = new TextTo384LinesBridge(); // 仮定: グローバルまたはインポート
        this.testInputs = [
            'リーダーシップを発揮する', '決裁を下す', 'チームを導く', '戦略を立案する', '責任を負う',
            'プロジェクトを管理する', '判断を下す', '方向性を示す', '決定を迫られる', '指導する'
        ];
    }

    async runAllTests() {
        await this.textToBridge.initialize();
        const results = {
            determinism: this.testDeterminism(),
            performance: this.testPerformance(),
            position5Health: this.testPosition5Health()
        };
        this.displayResults(results);
        return Object.values(results).every(r => r.pass);
    }

    testDeterminism() {
        const results = [];
        this.testInputs.forEach(input => {
            const outputs = [];
            for (let i = 0; i < 10; i++) {
                outputs.push(this.textToBridge.mapTextTo384Lines(input));
            }
            const unique = new Set(outputs);
            results.push(unique.size === 1);
        });
        const pass = results.every(r => r);
        return {pass, consistency: (results.filter(r => r).length / results.length) * 100};
    }

    testPerformance() {
        const times = [];
        this.testInputs.forEach(input => {
            const start = performance.now();
            this.textToBridge.mapTextTo384Lines(input);
            times.push(performance.now() - start);
        });
        times.sort((a, b) => a - b);
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const p95 = times[Math.floor(times.length * 0.95)];
        const p99 = times[Math.floor(times.length * 0.99)];
        const pass = avg < 40 && p95 < 45 && p99 < 50;
        return {pass, avg, p95, p99};
    }

    testPosition5Health() {
        let position5Count = 0;
        this.testInputs.forEach(input => {
            for (let i = 0; i < 10; i++) {
                const result = this.textToBridge.mapTextTo384Lines(input);
                if (result.position === 5) position5Count++;
            }
        });
        const rate = position5Count / (this.testInputs.length * 10);
        const pass = rate > 0 && rate < 0.3; // ゼロでなく、過剰でない
        return {pass, rate};
    }

    displayResults(results) {
        alert(JSON.stringify(results, null, 2));
    }
}

// ブラウザ実行例
window.addEventListener('DOMContentLoaded', () => {
    window.smokeTests = new SmokeTests();
    // ボタンクリックで実行: smokeTests.runAllTests();
});