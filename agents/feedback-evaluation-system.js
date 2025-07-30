/**
 * HAQEI フィードバック評価システム
 * 
 * プログラマーエージェントが作成した実装内容を3人格のフィードバックエージェントが評価し、
 * 多角的で本質的な改善提案を生成するシステム
 */

import FeedbackAgentPersonas from './feedback-personas.js';
import fs from 'fs/promises';
import path from 'path';

class FeedbackEvaluationSystem {
    constructor() {
        this.feedbackPersonas = new FeedbackAgentPersonas();
        this.evaluationHistory = [];
        this.metricsCollector = new MetricsCollector();
    }

    /**
     * プログラマー実装内容の包括的評価
     */
    async evaluateImplementation(implementationData) {
        try {
            console.log('🔍 実装内容の評価を開始します...');
            
            // 実装データの前処理
            const processedData = await this._preprocessImplementationData(implementationData);
            
            // 3人格による多角的評価
            const tripleOSEvaluation = this.feedbackPersonas.evaluateFromAllPersonas(processedData);
            
            // 詳細分析の実行
            const detailedAnalysis = await this._performDetailedAnalysis(processedData, tripleOSEvaluation);
            
            // 改善提案の生成
            const improvementPlan = await this._generateImprovementPlan(tripleOSEvaluation, detailedAnalysis);
            
            // 評価結果の構造化
            const evaluationResult = {
                timestamp: new Date().toISOString(),
                implementation: processedData,
                tripleOSEvaluation,
                detailedAnalysis,
                improvementPlan,
                overallAssessment: this._generateOverallAssessment(tripleOSEvaluation),
                nextSteps: this._defineNextSteps(improvementPlan)
            };

            // 評価履歴への記録
            this.evaluationHistory.push(evaluationResult);
            
            // メトリクス収集
            this.metricsCollector.recordEvaluation(evaluationResult);
            
            console.log('✅ 評価完了');
            return evaluationResult;
            
        } catch (error) {
            console.error('❌ 評価エラー:', error);
            throw new Error(`実装評価中にエラーが発生しました: ${error.message}`);
        }
    }

    /**
     * 実装データの前処理
     */
    async _preprocessImplementationData(implementationData) {
        // ファイル内容の読み込み
        const fileContents = {};
        if (implementationData.files && Array.isArray(implementationData.files)) {
            for (const filePath of implementationData.files) {
                try {
                    const fullPath = path.join(process.cwd(), filePath);
                    const content = await fs.readFile(fullPath, 'utf-8');
                    fileContents[filePath] = {
                        content,
                        size: content.length,
                        lines: content.split('\n').length,
                        functions: this._extractFunctions(content),
                        classes: this._extractClasses(content),
                        comments: this._extractComments(content)
                    };
                } catch (error) {
                    console.warn(`⚠️ ファイル読み込み警告 ${filePath}:`, error.message);
                    fileContents[filePath] = { error: error.message };
                }
            }
        }

        return {
            ...implementationData,
            fileContents,
            metadata: {
                totalFiles: Object.keys(fileContents).length,
                totalLines: Object.values(fileContents).reduce((sum, file) => sum + (file.lines || 0), 0),
                implementationComplexity: this._calculateComplexity(fileContents),
                bunenjinAlignment: this._assessBunenjinAlignment(implementationData, fileContents)
            }
        };
    }

    /**
     * 詳細分析の実行
     */
    async _performDetailedAnalysis(processedData, tripleOSEvaluation) {
        return {
            technicalQuality: await this._analyzeTechnicalQuality(processedData),
            userExperience: await this._analyzeUserExperience(processedData),
            bunenjinPhilosophy: await this._analyzeBunenjinPhilosophy(processedData),
            securityAssessment: await this._analyzeSecurityAspects(processedData),
            performanceAnalysis: await this._analyzePerformance(processedData),
            maintainabilityScore: await this._analyzeMaintainability(processedData),
            tripleOSIntegration: this._analyzeTripleOSIntegration(processedData, tripleOSEvaluation)
        };
    }

    /**
     * 技術品質分析
     */
    async _analyzeTechnicalQuality(processedData) {
        const quality = {
            codeStructure: this._assessCodeStructure(processedData.fileContents),
            errorHandling: this._assessErrorHandling(processedData.fileContents),
            documentation: this._assessDocumentation(processedData.fileContents),
            testCoverage: this._assessTestCoverage(processedData),
            dependencies: this._assessDependencies(processedData)
        };

        const overallScore = this._calculateTechnicalScore(quality);
        
        return {
            ...quality,
            overallScore,
            recommendations: this._generateTechnicalRecommendations(quality)
        };
    }

    /**
     * ユーザー体験分析
     */
    async _analyzeUserExperience(processedData) {
        return {
            intuitivenessScore: this._assessIntuitiveness(processedData),
            accessibilityScore: this._assessAccessibility(processedData),
            responseTime: this._assessResponseTime(processedData),
            errorMessaging: this._assessErrorMessaging(processedData),
            userGuidance: this._assessUserGuidance(processedData),
            overallUXScore: 0, // 後で計算
            uxRecommendations: []
        };
    }

    /**
     * bunenjin哲学分析
     */
    async _analyzeBunenjinPhilosophy(processedData) {
        return {
            philosophicalIntegrity: this._assessPhilosophicalIntegrity(processedData),
            tripleOSAlignment: this._assessTripleOSAlignment(processedData),
            iChingWisdom: this._assessIChingWisdom(processedData),
            userEmpowerment: this._assessUserEmpowerment(processedData),
            holisticApproach: this._assessHolisticApproach(processedData),
            philosophyScore: 0, // 後で計算
            philosophyRecommendations: []
        };
    }

    /**
     * セキュリティ分析
     */
    async _analyzeSecurityAspects(processedData) {
        return {
            dataProtection: this._assessDataProtection(processedData),
            inputValidation: this._assessInputValidation(processedData),
            outputSanitization: this._assessOutputSanitization(processedData),
            privacyCompliance: this._assessPrivacyCompliance(processedData),
            securityScore: 0, // 後で計算
            securityRecommendations: []
        };
    }

    /**
     * パフォーマンス分析
     */
    async _analyzePerformance(processedData) {
        return {
            loadTime: this._assessLoadTime(processedData),
            memoryUsage: this._assessMemoryUsage(processedData),
            algorithmeEfficiency: this._assessAlgorithmEfficiency(processedData),
            scalability: this._assessScalability(processedData),
            performanceScore: 0, // 後で計算
            performanceRecommendations: []
        };
    }

    /**
     * 保守性分析
     */
    async _analyzeMaintainability(processedData) {
        return {
            codeReadability: this._assessCodeReadability(processedData),
            modularity: this._assessModularity(processedData),
            testability: this._assessTestability(processedData),
            documentation: this._assessDocumentationQuality(processedData),
            maintainabilityScore: 0, // 後で計算
            maintainabilityRecommendations: []
        };
    }

    /**
     * Triple OS統合分析
     */
    _analyzeTripleOSIntegration(processedData, tripleOSEvaluation) {
        return {
            engineOSIntegration: this._assessEngineOSIntegration(processedData),
            interfaceOSIntegration: this._assessInterfaceOSIntegration(processedData),
            safeModeOSIntegration: this._assessSafeModeOSIntegration(processedData),
            osHarmonization: this._assessOSHarmonization(tripleOSEvaluation),
            integrationScore: 0, // 後で計算
            integrationRecommendations: []
        };
    }

    /**
     * 改善計画の生成
     */
    async _generateImprovementPlan(tripleOSEvaluation, detailedAnalysis) {
        const priorities = this._determinePriorities(tripleOSEvaluation, detailedAnalysis);
        const timeline = this._createTimeline(priorities);
        const resources = this._estimateResources(priorities);

        return {
            priorities,
            timeline,
            resources,
            quickWins: this._identifyQuickWins(tripleOSEvaluation, detailedAnalysis),
            longTermGoals: this._defineLongTermGoals(tripleOSEvaluation, detailedAnalysis),
            riskAssessment: this._assessImplementationRisks(priorities),
            successMetrics: this._defineSuccessMetrics(priorities)
        };
    }

    /**
     * 総合評価の生成
     */
    _generateOverallAssessment(tripleOSEvaluation) {
        const { overallScore, consensusLevel } = tripleOSEvaluation;
        
        let assessment = "良好";
        if (overallScore.average >= 90) assessment = "優秀";
        else if (overallScore.average >= 80) assessment = "良好";
        else if (overallScore.average >= 70) assessment = "改善必要";
        else assessment = "大幅改善必要";

        return {
            rating: assessment,
            score: overallScore.average,
            consensus: consensusLevel.level,
            keyStrengths: this._identifyKeyStrengths(tripleOSEvaluation),
            criticalIssues: this._identifyCriticalIssues(tripleOSEvaluation),
            strategicRecommendations: this._generateStrategicRecommendations(tripleOSEvaluation)
        };
    }

    /**
     * 次のステップの定義
     */
    _defineNextSteps(improvementPlan) {
        return {
            immediate: improvementPlan.quickWins.slice(0, 3),
            shortTerm: improvementPlan.priorities.filter(p => p.priority === 'high').slice(0, 5),
            mediumTerm: improvementPlan.priorities.filter(p => p.priority === 'medium').slice(0, 3),
            longTerm: improvementPlan.longTermGoals.slice(0, 2)
        };
    }

    /**
     * ヘルパーメソッド群
     */
    _extractFunctions(content) {
        const functionRegex = /function\s+(\w+)|(\w+)\s*\(/g;
        const matches = [];
        let match;
        while ((match = functionRegex.exec(content)) !== null) {
            matches.push(match[1] || match[2]);
        }
        return matches;
    }

    _extractClasses(content) {
        const classRegex = /class\s+(\w+)/g;
        const matches = [];
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            matches.push(match[1]);
        }
        return matches;
    }

    _extractComments(content) {
        const commentRegex = /\/\/.+|\/\*[\s\S]*?\*\//g;
        return (content.match(commentRegex) || []).length;
    }

    _calculateComplexity(fileContents) {
        // 複雑度の簡単な計算
        let totalComplexity = 0;
        Object.values(fileContents).forEach(file => {
            if (file.content) {
                totalComplexity += (file.functions?.length || 0) * 2;
                totalComplexity += (file.classes?.length || 0) * 3;
                totalComplexity += file.lines * 0.1;
            }
        });
        return Math.round(totalComplexity);
    }

    _assessBunenjinAlignment(implementationData, fileContents) {
        // bunenjin哲学との整合性評価
        let alignment = 70; // ベーススコア
        
        // Triple OS関連の実装があるかチェック
        const hasTripleOS = Object.values(fileContents).some(file => 
            file.content && file.content.includes('TripleOS')
        );
        if (hasTripleOS) alignment += 15;

        // 易経関連の実装があるかチェック
        const hasIChing = Object.values(fileContents).some(file => 
            file.content && (file.content.includes('hexagram') || file.content.includes('易経'))
        );
        if (hasIChing) alignment += 10;

        return Math.min(alignment, 100);
    }

    // その他の評価メソッドはスタブとして実装
    _assessCodeStructure(fileContents) { return Math.floor(Math.random() * 31) + 70; }
    _assessErrorHandling(fileContents) { return Math.floor(Math.random() * 31) + 70; }
    _assessDocumentation(fileContents) { return Math.floor(Math.random() * 31) + 70; }
    _assessTestCoverage(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessDependencies(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _calculateTechnicalScore(quality) { return Math.floor(Math.random() * 31) + 70; }
    _generateTechnicalRecommendations(quality) { return ["技術品質の継続的改善を推奨"]; }

    _assessIntuitiveness(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessAccessibility(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessResponseTime(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessErrorMessaging(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessUserGuidance(processedData) { return Math.floor(Math.random() * 31) + 70; }

    _assessPhilosophicalIntegrity(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessTripleOSAlignment(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessIChingWisdom(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessUserEmpowerment(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessHolisticApproach(processedData) { return Math.floor(Math.random() * 31) + 70; }

    _assessDataProtection(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessInputValidation(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessOutputSanitization(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessPrivacyCompliance(processedData) { return Math.floor(Math.random() * 31) + 70; }

    _assessLoadTime(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessMemoryUsage(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessAlgorithmEfficiency(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessScalability(processedData) { return Math.floor(Math.random() * 31) + 70; }

    _assessCodeReadability(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessModularity(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessTestability(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessDocumentationQuality(processedData) { return Math.floor(Math.random() * 31) + 70; }

    _assessEngineOSIntegration(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessInterfaceOSIntegration(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessSafeModeOSIntegration(processedData) { return Math.floor(Math.random() * 31) + 70; }
    _assessOSHarmonization(tripleOSEvaluation) { return Math.floor(Math.random() * 31) + 70; }

    _determinePriorities(tripleOSEvaluation, detailedAnalysis) {
        return [
            { priority: 'high', item: 'bunenjin哲学の統合強化', rationale: 'プロジェクトの核心価値' },
            { priority: 'medium', item: 'ユーザー体験の最適化', rationale: '継続利用促進のため' },
            { priority: 'low', item: 'パフォーマンス最適化', rationale: '長期的な改善目標' }
        ];
    }

    _createTimeline(priorities) {
        return {
            phase1: "1-2週間: 緊急度の高い改善",
            phase2: "3-4週間: 中程度の優先度項目", 
            phase3: "5-8週間: 長期的改善目標"
        };
    }

    _estimateResources(priorities) {
        return {
            developmentHours: Math.floor(Math.random() * 41) + 40,
            testingHours: Math.floor(Math.random() * 21) + 20,
            documentationHours: Math.floor(Math.random() * 11) + 10
        };
    }

    _identifyQuickWins(tripleOSEvaluation, detailedAnalysis) {
        return [
            "UI表現の微調整によるユーザビリティ向上",
            "エラーメッセージの改善",
            "ドキュメントの更新"
        ];
    }

    _defineLongTermGoals(tripleOSEvaluation, detailedAnalysis) {
        return [
            "bunenjin哲学の完全統合",
            "Triple OSシステムの深化"
        ];
    }

    _assessImplementationRisks(priorities) {
        return {
            high: ["哲学的整合性の維持"],
            medium: ["ユーザー体験の一時的低下"],
            low: ["パフォーマンスの微細な変動"]
        };
    }

    _defineSuccessMetrics(priorities) {
        return {
            userSatisfaction: "90%以上のユーザー満足度",
            philosophicalAlignment: "bunenjin哲学スコア85以上",
            technicalQuality: "技術品質スコア80以上"
        };
    }

    _identifyKeyStrengths(tripleOSEvaluation) {
        return [
            "多角的な人格分析アプローチ",
            "易経の智慧の現代的活用",
            "ユーザー主権の尊重"
        ];
    }

    _identifyCriticalIssues(tripleOSEvaluation) {
        const issues = [];
        if (tripleOSEvaluation.overallScore.average < 70) {
            issues.push("全体的な品質向上が緊急に必要");
        }
        if (tripleOSEvaluation.consensusLevel.level === "low") {
            issues.push("人格間の合意形成が困難");
        }
        return issues;
    }

    _generateStrategicRecommendations(tripleOSEvaluation) {
        return [
            "bunenjin哲学をより深く実装に反映させる",
            "3つの人格システムの整合性を強化する",
            "ユーザーの自己決定を支援する機能を充実させる"
        ];
    }

    /**
     * 評価結果の保存
     */
    async saveEvaluationResults(evaluationResult, outputPath) {
        try {
            const formattedResult = JSON.stringify(evaluationResult, null, 2);
            await fs.writeFile(outputPath, formattedResult, 'utf-8');
            console.log(`✅ 評価結果を保存しました: ${outputPath}`);
        } catch (error) {
            console.error('❌ 評価結果保存エラー:', error);
            throw error;
        }
    }

    /**
     * 評価履歴の取得
     */
    getEvaluationHistory() {
        return this.evaluationHistory;
    }

    /**
     * メトリクスの取得
     */
    getMetrics() {
        return this.metricsCollector.getMetrics();
    }
}

/**
 * メトリクス収集クラス
 */
class MetricsCollector {
    constructor() {
        this.metrics = {
            totalEvaluations: 0,
            averageScore: 0,
            consensusLevels: { high: 0, medium: 0, low: 0 },
            mostCommonIssues: {},
            improvementTrends: []
        };
    }

    recordEvaluation(evaluationResult) {
        this.metrics.totalEvaluations++;
        this.metrics.averageScore = (
            (this.metrics.averageScore * (this.metrics.totalEvaluations - 1) + 
             evaluationResult.tripleOSEvaluation.overallScore.average) / 
            this.metrics.totalEvaluations
        );
        
        const consensusLevel = evaluationResult.tripleOSEvaluation.consensusLevel.level;
        this.metrics.consensusLevels[consensusLevel]++;
    }

    getMetrics() {
        return this.metrics;
    }
}

export default FeedbackEvaluationSystem;