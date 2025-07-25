// AnalysisView.js - 分析処理とアニメーションの同期管理システム

class AnalysisView extends BaseComponent {
    constructor(containerId, options) {
        super(containerId, options);
        this.analysisTask = options.analysisTask;
        this.onComplete = options.onComplete;
        this.analysisSteps = [
            '価値観データを8次元で解析中...',
            '64卦の特性マトリックスを計算中...',
            'コサイン類似度を算出中...',
            '最適な人格OSを特定中...',
            '深い洞察を生成中...'
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
            stepTextElement.textContent = "分析完了。結果を生成しています...";
        }

        // 500ミリ秒待ってから、画面遷移のコールバックを呼ぶ
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(data);
            }
        }, 500);
    }
}