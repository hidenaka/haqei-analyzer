# 正統易経386爻システム技術仕様書

## 🎯 核心設計原則

### 易経的正統性の絶対保持
```javascript
/**
 * 正統386爻構成
 * - 通常爻: 64卦 × 6爻 = 384爻
 * - 特殊爻: 乾・用九 + 坤・用六 = 2爻
 * - 合計: 386爻（一意性保証）
 */
const AUTHENTIC_386_STRUCTURE = {
    normalLines: 384,    // 64hexagrams × 6lines
    specialLines: 2,     // YouKuu(乾用九) + YouRokuu(坤用六)
    total: 386
};
```

## 🔧 核心技術アーキテクチャ

### 1. AuthenticIChingEngine386 クラス設計
```javascript
class AuthenticIChingEngine386 {
    constructor() {
        this.hexagramDatabase = this.initializeAuthentic64Hexagrams();
        this.lineDatabase = this.initializeAuthentic386Lines();
        this.transformationMatrix = this.buildTransformationMatrix();
        this.youKuuConditions = this.defineYouKuuLogic();
        this.youRokuuConditions = this.defineYouRokuuLogic();
    }

    /**
     * テキスト→386爻マッピングの核心メソッド
     * @param {string} inputText - ユーザー入力テキスト
     * @returns {Object} 386爻システム完全結果
     */
    async analyzeTextTo386Lines(inputText) {
        // Step 1: 基本卦判定（64卦）
        const baseHexagram = await this.determineBaseHexagram(inputText);
        
        // Step 2: 爻位置特定（6爻+特殊条件）
        const linePosition = await this.identifyLinePosition(inputText, baseHexagram);
        
        // Step 3: 特殊条件判定（用九・用六）
        const specialCondition = await this.checkSpecialConditions(inputText, baseHexagram);
        
        // Step 4: 最終386爻確定
        return await this.finalizeAuthentic386Analysis(
            baseHexagram, linePosition, specialCondition, inputText
        );
    }
}
```

### 2. 用九・用六特殊ロジック実装
```javascript
class SpecialLineTransformationEngine {
    /**
     * 用九（乾為天・全陽動爻）の判定と処理
     */
    async processYouKuu(textAnalysis, hexagramState) {
        const youKuuConditions = {
            // 条件1: 乾卦であること
            isQianHexagram: hexagramState.number === 1,
            
            // 条件2: 全6爻が老陽（動爻）であること
            allLinesMoving: hexagramState.movingLines.length === 6,
            allYangLines: hexagramState.lines.every(line => line.type === 'oldYang'),
            
            // 条件3: エネルギー状態が極陽
            energyState: textAnalysis.yinYangBalance > 0.9,
            
            // 条件4: 創造力・主導性が極限状態
            creativityExtreme: textAnalysis.creativity > 0.85,
            leadershipExtreme: textAnalysis.leadership > 0.85
        };

        if (this.validateYouKuuConditions(youKuuConditions)) {
            return {
                specialLine: 'YouKuu',
                lineNumber: 385,  // 386爻システムでの通し番号
                interpretation: await this.generateYouKuuInterpretation(textAnalysis),
                transformation: await this.predictYouKuuTransformation(),
                rarity: 'extremely_rare',  // 発生確率 < 0.1%
                significance: 'maximum_transformation'
            };
        }
        return null;
    }

    /**
     * 用六（坤為地・全陰動爻）の判定と処理
     */
    async processYouRokuu(textAnalysis, hexagramState) {
        const youRokuuConditions = {
            // 条件1: 坤卦であること
            isKunHexagram: hexagramState.number === 2,
            
            // 条件2: 全6爻が老陰（動爻）であること
            allLinesMoving: hexagramState.movingLines.length === 6,
            allYinLines: hexagramState.lines.every(line => line.type === 'oldYin'),
            
            // 条件3: エネルギー状態が極陰
            energyState: textAnalysis.yinYangBalance < -0.9,
            
            // 条件4: 受容性・持続性が極限状態
            receptivityExtreme: textAnalysis.receptivity > 0.85,
            persistenceExtreme: textAnalysis.persistence > 0.85
        };

        if (this.validateYouRokuuConditions(youRokuuConditions)) {
            return {
                specialLine: 'YouRokuu',
                lineNumber: 386,  // 386爻システムでの通し番号
                interpretation: await this.generateYouRokuuInterpretation(textAnalysis),
                transformation: await this.predictYouRokuuTransformation(),
                rarity: 'extremely_rare',  // 発生確率 < 0.1%
                significance: 'maximum_transformation'
            };
        }
        return null;
    }
}
```

### 3. 386爻変化マトリックス実装
```javascript
class Authentic386TransformationMatrix {
    constructor() {
        this.transformationPatterns = this.buildComprehensiveMatrix();
    }

    /**
     * 386爻完全変化マトリックス構築
     */
    buildComprehensiveMatrix() {
        const matrix = {};
        
        // 通常384爻の変化パターン
        for (let hexagram = 1; hexagram <= 64; hexagram++) {
            for (let line = 1; line <= 6; line++) {
                const lineId = this.calculateLineId(hexagram, line);
                matrix[lineId] = this.generateTransformationOptions(hexagram, line);
            }
        }
        
        // 特殊2爻（用九・用六）の変化パターン
        matrix[385] = this.generateYouKuuTransformations();    // 用九
        matrix[386] = this.generateYouRokuuTransformations();  // 用六
        
        return matrix;
    }

    /**
     * 未来分岐生成（8分岐推奨システム）
     */
    async generateFutureBranches(currentLineId, contextAnalysis) {
        const baseTransformations = this.transformationPatterns[currentLineId];
        
        // 8分岐システム（八卦基準）
        const eightBranches = [
            this.generateBranch('qian', baseTransformations, contextAnalysis),    // 乾
            this.generateBranch('dui', baseTransformations, contextAnalysis),     // 兌
            this.generateBranch('li', baseTransformations, contextAnalysis),      // 離
            this.generateBranch('zhen', baseTransformations, contextAnalysis),    // 震
            this.generateBranch('xun', baseTransformations, contextAnalysis),     // 巽
            this.generateBranch('kan', baseTransformations, contextAnalysis),     // 坎
            this.generateBranch('gen', baseTransformations, contextAnalysis),     // 艮
            this.generateBranch('kun', baseTransformations, contextAnalysis)      // 坤
        ];

        return {
            branchType: 'eightTrigrams',
            branches: await Promise.all(eightBranches),
            confidence: this.calculateBranchConfidence(eightBranches),
            authenticity: this.validateIChingAuthenticity(eightBranches)
        };
    }
}
```

### 4. テキスト解析→386爻マッピングエンジン
```javascript
class TextTo386MappingEngine {
    /**
     * 多層文脈解析システム
     */
    async performAdvancedTextAnalysis(inputText) {
        return {
            // Layer 1: 基本的感情・エネルギー分析
            emotionalLayer: await this.analyzeEmotionalContent(inputText),
            energyLayer: await this.analyzeEnergyPatterns(inputText),
            
            // Layer 2: 状況・関係性分析
            situationalLayer: await this.analyzeSituationalContext(inputText),
            relationshipLayer: await this.analyzeRelationshipDynamics(inputText),
            
            // Layer 3: 意図・目標分析
            intentionalLayer: await this.analyzeUserIntentions(inputText),
            goalLayer: await this.analyzeGoalOrientation(inputText),
            
            // Layer 4: 深層哲学・価値観分析
            philosophicalLayer: await this.analyzePhilosophicalAlignment(inputText),
            valueLayer: await this.analyzeCoreValues(inputText),
            
            // Layer 5: 時間・変化分析
            temporalLayer: await this.analyzeTemporalOrientation(inputText),
            changeLayer: await this.analyzeChangeReadiness(inputText)
        };
    }

    /**
     * 386爻最適マッピング
     */
    async mapTo386Lines(textAnalysis) {
        // Step 1: 64卦候補選出（上位3-5卦）
        const hexagramCandidates = await this.selectHexagramCandidates(textAnalysis);
        
        // Step 2: 各候補の6爻分析
        const lineCandidates = [];
        for (const hexagram of hexagramCandidates) {
            for (let line = 1; line <= 6; line++) {
                const lineScore = await this.calculateLineRelevance(
                    textAnalysis, hexagram, line
                );
                lineCandidates.push({
                    hexagram: hexagram.number,
                    line: line,
                    lineId: this.calculateLineId(hexagram.number, line),
                    relevanceScore: lineScore,
                    confidence: lineScore.confidence
                });
            }
        }
        
        // Step 3: 特殊条件（用九・用六）チェック
        const specialConditions = await this.checkSpecialConditions(textAnalysis);
        if (specialConditions.youKuuQualified) {
            lineCandidates.push({
                hexagram: 1,
                line: 'YouKuu',
                lineId: 385,
                relevanceScore: specialConditions.youKuuScore,
                confidence: specialConditions.youKuuConfidence,
                isSpecial: true
            });
        }
        if (specialConditions.youRokuuQualified) {
            lineCandidates.push({
                hexagram: 2,
                line: 'YouRokuu', 
                lineId: 386,
                relevanceScore: specialConditions.youRokuuScore,
                confidence: specialConditions.youRokuuConfidence,
                isSpecial: true
            });
        }
        
        // Step 4: 最適候補選出
        return lineCandidates
            .sort((a, b) => b.relevanceScore.total - a.relevanceScore.total)
            .slice(0, 8);  // 上位8候補（8分岐システム）
    }
}
```

## 🎯 未来分岐システム設計仕様

### 8分岐システム（標準・推奨）
```javascript
const EIGHT_BRANCH_SYSTEM = {
    basis: 'eight_trigrams',
    branches: [
        { name: '乾', direction: 'creative_leadership', energy: 'pure_yang' },
        { name: '兌', direction: 'joyful_expression', energy: 'young_yin' },
        { name: '離', direction: 'illuminating_clarity', energy: 'middle_yang' },
        { name: '震', direction: 'initiating_action', energy: 'young_yang' },
        { name: '巽', direction: 'gentle_penetration', energy: 'old_yin' },
        { name: '坎', direction: 'adaptive_flow', energy: 'middle_yin' },
        { name: '艮', direction: 'stable_foundation', energy: 'young_yin' },
        { name: '坤', direction: 'receptive_support', energy: 'pure_yin' }
    ],
    cognitive_load: 'optimal',
    decision_utility: 'high',
    iching_authenticity: 'perfect'
};
```

### 動的分岐数調整システム
```javascript
class DynamicBranchingSystem {
    /**
     * 状況複雑度に基づく分岐数自動調整
     */
    async determineBranchCount(contextAnalysis, userPreference) {
        const complexityScore = this.calculateComplexity(contextAnalysis);
        
        if (complexityScore < 0.3) {
            return { count: 4, type: 'simple_quaternary', basis: 'four_directions' };
        } else if (complexityScore < 0.7) {
            return { count: 8, type: 'standard_octary', basis: 'eight_trigrams' };
        } else if (complexityScore < 0.9) {
            return { count: 16, type: 'detailed_analysis', basis: 'trigram_combinations' };
        } else {
            return { count: 32, type: 'comprehensive', basis: 'hexagram_partial' };
        }
    }
}
```

## 📊 品質保証・検証システム

### 易経的正統性検証
```javascript
class AuthenticityValidationEngine {
    /**
     * 古典準拠性検証
     */
    async validateClassicalCompliance(result) {
        const validations = {
            // 卦象の正確性
            hexagramSymbolism: await this.validateHexagramSymbols(result.hexagram),
            
            // 爻辞の正確性
            lineTextAccuracy: await this.validateLineTexts(result.lineAnalysis),
            
            // 変化の論理性
            transformationLogic: await this.validateTransformationLogic(result.changes),
            
            // 序卦伝準拠性
            sequenceCompliance: await this.validateSequenceLogic(result.sequence),
            
            // 時中概念の適用
            timingPrincipleApplication: await this.validateTimingPrinciples(result.timing)
        };
        
        return {
            overallScore: this.calculateOverallAuthenticity(validations),
            detailedScores: validations,
            recommendations: this.generateImprovementRecommendations(validations)
        };
    }
}
```

## 🚀 実装アーキテクチャ

### モジュール構成
```
src/authentic-iching/
├── core/
│   ├── AuthenticIChingEngine386.js     # 核心エンジン
│   ├── SpecialLineProcessor.js          # 用九・用六処理
│   └── TransformationMatrix386.js      # 386爻変化マトリックス
├── analysis/
│   ├── TextAnalysisEngine.js           # テキスト解析
│   ├── ContextMappingEngine.js         # 文脈マッピング
│   └── LineIdentificationEngine.js    # 爻特定エンジン
├── prediction/
│   ├── FutureBranchingEngine.js        # 未来分岐生成
│   ├── ChangeSequenceEngine.js         # 変化シーケンス
│   └── ScenarioGenerationEngine.js    # シナリオ生成
├── validation/
│   ├── AuthenticityValidator.js        # 正統性検証
│   ├── ClassicalComplianceCheck.js    # 古典準拠チェック
│   └── QualityAssuranceEngine.js     # 品質保証
└── data/
    ├── authentic386Database.js         # 386爻完全データ
    ├── classicalTexts.js              # 古典テキスト
    └── transformationPatterns.js      # 変化パターン
```

この技術仕様書に基づいて、真に正統な386爻システムの完全実装が可能になります。