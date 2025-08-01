// AnalysisView.js - 分析処理とアニメーションの同期管理システム

class AnalysisView extends BaseComponent {
    constructor(containerId, options) {
        super(containerId, options);
        this.analysisTask = options.analysisTask;
        this.onComplete = options.onComplete;
        this.analysisSteps = [
            '🔥 UltraAnalysisEngine起動中...',
            '📊 8次元データ強化処理中...',
            '🎭 仮想人格マトリックス構築中...',
            '🔯 易経64卦同期実行中...',
            '🧠 統合AI洞察生成中...',
            '💎 最高品質結果合成中...'
        ];
        this.currentStep = 0;
        this.intervalId = null;
    }

    async show() {
        super.show();
        this.render();
        this._startAnimation(); // アニメーションを開始

        if (this.analysisTask) {
            try {
                // 裏で非同期に分析処理を実行
                const data = await this.analysisTask();
                // 分析が終わったら、アニメーションを完了させる
                this._completeAnimation(data);
            } catch (error) {
                console.error("❌ Analysis task failed inside AnalysisView:", error);
                // エラーが発生した場合も、コールバックを呼んで処理を継続させる
                this.onComplete({ error: "分析処理に失敗しました。" });
            }
        }
    }
    
    hide() {
        clearInterval(this.intervalId);
        return super.hide();
    }

    render() {
        this.container.innerHTML = `
            <div class="analysis-view-content">
                <div class="analysis-spinner"></div>
                <h2 id="analysis-step-text">${this.analysisSteps[0]}</h2>
            </div>
        `;
    }

    _startAnimation() {
        const stepTextElement = document.getElementById('analysis-step-text');
        this.intervalId = setInterval(() => {
            this.currentStep = (this.currentStep + 1) % this.analysisSteps.length;
            if (stepTextElement) {
                stepTextElement.textContent = this.analysisSteps[this.currentStep];
            }
        }, 1500); // 1.5秒ごとにテキストを切り替え
    }

    _completeAnimation(data) {
        clearInterval(this.intervalId); // テキスト切り替えを停止
        const stepTextElement = document.getElementById('analysis-step-text');
        if (stepTextElement) {
            stepTextElement.textContent = "🎯 UltraAnalysisEngine分析完了！最高品質の結果を準備中...";
        }

        // 500ミリ秒待ってから、画面遷移のコールバックを呼ぶ
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(data);
            }
        }, 500);
    }
}