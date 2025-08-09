/**
 * TripleOSEngine - 3層人格OS診断エンジン
 * HaQei Analyzer - Triple OS Diagnosis Engine
 * TypeScript版 - Vue 3統合用
 * 
 * 目的：
 * - Engine OS（価値観システム）の分析
 * - Interface OS（社会的システム）の分析
 * - SafeMode OS（防御システム）の分析
 * - 3つのOSの相互作用と整合性評価
 */

import type { Answer, UserVector } from './calculator'
import { calculator } from './calculator'
import type { DataManager } from './dataManager'

// Type definitions
export interface TrigramMapping {
  [key: string]: {
    id: number
    name: string
    trait: string
    opposite?: string
  }
}

export interface TrigramEnergies {
  [trigramName: string]: number
}

export interface OSAnalysisResult {
  hexagramId: number
  hexagramName: string
  primaryTrigram: string
  secondaryTrigram: string
  matchingScore: number
  matchType: string
  trigramEnergies: TrigramEnergies
  dominantTrigrams: string[]
  dimensionAnalysis?: any
}

export interface InterfaceOSResult extends OSAnalysisResult {
  keywordMatching: {
    keywords: string[]
    matchingCandidates: Array<{
      hexagramId: number
      matchedKeywords: string[]
      score: number
    }>
  }
}

export interface SafeModeOSResult extends OSAnalysisResult {
  keywordMatching: {
    keywords: string[]
    matchingCandidates: Array<{
      hexagramId: number
      matchedKeywords: string[]
      score: number
    }>
  }
}

export interface TripleOSAnalysisResult {
  engineOS: OSAnalysisResult
  interfaceOS: InterfaceOSResult
  safeModeOS: SafeModeOSResult
  consistencyScore: number
  misalignmentData?: {
    overallScore: number
    pairScores: {
      engineInterface: number
      engineSafeMode: number
      interfaceSafeMode: number
    }
    riskLevel: string
    analysis?: any
  }
  integrationInsights?: any[]
}

export interface BunenjinStatus {
  // Core philosophy features
  dividedPersonalitySupport: boolean
  rejectsUnifiedSelfConcept: boolean
  embracesMultiplicity: boolean
  
  // Triple OS structure
  tripleOSStructure: {
    engineOSAsValueCore: boolean
    interfaceOSAsSocialAdaptation: boolean
    safeModeOSAsProtection: boolean
    enablesContextualPersonality: boolean
  }
  
  // Advanced features
  contextAwarePersonality: boolean
  personalityTransitions: boolean
  // ... more features
}

export class TripleOSEngine {
  private calculator: typeof calculator
  private dataManager: DataManager | null
  private trigramMapping: TrigramMapping
  private HaQeiImplementationStatus: BunenjinStatus
  
  // Keyword maps for Interface/SafeMode OS matching
  private interfaceKeywords: Map<string, string[]> = new Map()
  private safeModeKeywords: Map<string, string[]> = new Map()

  constructor(dataManager?: DataManager) {
    this.calculator = calculator
    this.dataManager = dataManager || null
    this.trigramMapping = this.initializeTrigramMapping()
    this.initializeKeywordMaps()
    this.HaQeiImplementationStatus = this.initializeBunenjinStatus()
    
    console.log('🚀 TripleOSEngine initialized (TypeScript version)')
  }

  /**
   * 基本的な Traditional Analysis（仮想人格システムなし）
   */
  async analyzeUser(userAnswers: Answer[]): Promise<TripleOSAnalysisResult> {
    console.log('🔍 Starting Triple OS analysis...')
    
    try {
      const result = await this.runTraditionalAnalysis(userAnswers)
      return this.enrichAnalysisWithBunenjinData(result)
    } catch (error) {
      console.error('❌ Error in Triple OS analysis:', error)
      throw error
    }
  }

  /**
   * 従来の分析メソッド（仮想人格システムなし）
   */
  private async runTraditionalAnalysis(userAnswers: Answer[]): Promise<TripleOSAnalysisResult> {
    console.log('📊 Running traditional Triple OS analysis...')
    return this.analyzeTripleOS(userAnswers)
  }

  /**
   * Triple OS分析のメイン処理
   */
  private async analyzeTripleOS(allAnswers: Answer[]): Promise<TripleOSAnalysisResult> {
    console.log("🔯 Starting Triple OS Analysis")
    
    // 1. 回答を価値観質問とシナリオ質問に分離
    const { worldviewAnswers, scenarioAnswers } = this.separateAnswers(allAnswers)
    
    // 2. Engine OS (価値観システム) の分析
    const engineOS = await this.analyzeEngineOS(worldviewAnswers)
    console.log("✅ Engine OS analyzed:", engineOS.hexagramName)
    
    // 3. Interface OS (社会的システム) の分析
    const interfaceOS = await this.analyzeInterfaceOS(scenarioAnswers, engineOS)
    console.log("✅ Interface OS analyzed:", interfaceOS.hexagramName)
    
    // 4. SafeMode OS (防御システム) の分析
    const safeModeOS = await this.analyzeSafeModeOS(scenarioAnswers, engineOS)
    console.log("✅ SafeMode OS analyzed:", safeModeOS.hexagramName)
    
    // 5. 整合性スコアの計算
    const consistencyScore = this.calculateConsistencyScore(engineOS, interfaceOS, safeModeOS)
    console.log("📊 Consistency Score:", consistencyScore)
    
    // 6. 不整合分析
    const misalignmentData = this.calculateOSMisalignment(engineOS, interfaceOS, safeModeOS)
    
    // 7. 統合的洞察の生成
    const integrationInsights = await this.generateIntegrationInsights(
      engineOS, 
      interfaceOS, 
      safeModeOS, 
      misalignmentData
    )
    
    return {
      engineOS,
      interfaceOS,
      safeModeOS,
      consistencyScore,
      misalignmentData,
      integrationInsights
    }
  }

  /**
   * 回答を価値観質問とシナリオ質問に分離
   */
  private separateAnswers(allAnswers: Answer[]): {
    worldviewAnswers: Answer[]
    scenarioAnswers: Answer[]
  } {
    const worldviewAnswers: Answer[] = []
    const scenarioAnswers: Answer[] = []
    
    allAnswers.forEach(answer => {
      const questionNum = parseInt(answer.questionId.replace('q', ''))
      if (questionNum >= 1 && questionNum <= 24) {
        worldviewAnswers.push(answer)
      } else if (questionNum >= 25 && questionNum <= 30) {
        scenarioAnswers.push(answer)
      }
    })
    
    console.log(`📊 Separated answers: ${worldviewAnswers.length} worldview, ${scenarioAnswers.length} scenario`)
    
    return { worldviewAnswers, scenarioAnswers }
  }

  /**
   * Engine OS（価値観システム）の分析
   */
  private async analyzeEngineOS(worldviewAnswers: Answer[]): Promise<OSAnalysisResult> {
    console.log("🔷 Analyzing Engine OS (Value System)")
    
    // ユーザーベクトルの構築
    const userVector = this.calculator.buildUserVector(worldviewAnswers)
    console.log("📊 User vector built:", userVector)
    
    // 8次元から三爻エネルギーを計算
    const trigramEnergies = this.calculateTrigramEnergies(userVector)
    console.log("⚡ Trigram energies:", trigramEnergies)
    
    // 最も強い2つの三爻を特定
    const sortedTrigrams = Object.entries(trigramEnergies)
      .sort(([, a], [, b]) => b - a)
    
    const upperTrigram = sortedTrigrams[0][0]
    const lowerTrigram = sortedTrigrams[1][0]
    
    console.log(`🔺 Upper trigram: ${upperTrigram} (${sortedTrigrams[0][1].toFixed(2)})`)
    console.log(`🔻 Lower trigram: ${lowerTrigram} (${sortedTrigrams[1][1].toFixed(2)})`)
    
    // ヘキサグラムにマッピング
    const hexagramId = this.mapTrigramsToHexagram(upperTrigram, lowerTrigram)
    const hexagramName = `Hexagram ${hexagramId}` // TODO: Get actual name from data
    
    // Engine強度の計算
    const engineStrength = this.calculateEngineStrength(trigramEnergies)
    
    return {
      hexagramId,
      hexagramName,
      primaryTrigram: upperTrigram,
      secondaryTrigram: lowerTrigram,
      matchingScore: engineStrength,
      matchType: "direct_calculation",
      trigramEnergies,
      dominantTrigrams: [upperTrigram, lowerTrigram],
      dimensionAnalysis: this.analyzeDimensions(userVector)
    }
  }

  /**
   * Interface OS（社会的システム）の分析
   */
  private async analyzeInterfaceOS(
    scenarioAnswers: Answer[], 
    engineOS: OSAnalysisResult
  ): Promise<InterfaceOSResult> {
    console.log("🔶 Analyzing Interface OS (Social System)")
    
    // 外面選択肢の抽出
    const outerChoices = this.extractOuterChoices(scenarioAnswers)
    
    // キーワードマッチング
    const keywordResults = await this.performKeywordMatching(outerChoices, 'interface')
    
    // Engine OSを除外
    const filteredResults = this.excludeEngineOS(keywordResults.matchingCandidates, engineOS)
    
    // 最高スコアの候補を選択
    const topCandidate = filteredResults[0] || {
      hexagramId: 1,
      matchedKeywords: [],
      score: 0
    }
    
    // TODO: Get hexagram details from data
    const hexagramName = `Hexagram ${topCandidate.hexagramId}`
    
    return {
      hexagramId: topCandidate.hexagramId,
      hexagramName,
      primaryTrigram: "乾", // TODO: Calculate from hexagram
      secondaryTrigram: "乾", // TODO: Calculate from hexagram
      matchingScore: topCandidate.score,
      matchType: "keyword_matching",
      trigramEnergies: {},
      dominantTrigrams: [],
      keywordMatching: keywordResults
    }
  }

  /**
   * SafeMode OS（防御システム）の分析
   */
  private async analyzeSafeModeOS(
    scenarioAnswers: Answer[], 
    engineOS: OSAnalysisResult
  ): Promise<SafeModeOSResult> {
    console.log("🔴 Analyzing SafeMode OS (Defense System)")
    
    // 内面選択肢の抽出
    const innerChoices = this.extractInnerChoices(scenarioAnswers)
    
    // キーワードマッチング
    const keywordResults = await this.performKeywordMatching(innerChoices, 'safemode')
    
    // Engine OSを除外
    const filteredResults = this.excludeEngineOS(keywordResults.matchingCandidates, engineOS)
    
    // 最高スコアの候補を選択
    const topCandidate = filteredResults[0] || {
      hexagramId: 2,
      matchedKeywords: [],
      score: 0
    }
    
    // TODO: Get hexagram details from data
    const hexagramName = `Hexagram ${topCandidate.hexagramId}`
    
    return {
      hexagramId: topCandidate.hexagramId,
      hexagramName,
      primaryTrigram: "坤", // TODO: Calculate from hexagram
      secondaryTrigram: "坤", // TODO: Calculate from hexagram
      matchingScore: topCandidate.score,
      matchType: "keyword_matching",
      trigramEnergies: {},
      dominantTrigrams: [],
      keywordMatching: keywordResults
    }
  }

  /**
   * 三爻マッピングの初期化
   */
  private initializeTrigramMapping(): TrigramMapping {
    return {
      "乾": { id: 1, name: "天", trait: "創造性・リーダーシップ", opposite: "坤" },
      "兌": { id: 2, name: "沢", trait: "喜び・コミュニケーション", opposite: "艮" },
      "離": { id: 3, name: "火", trait: "明晰・情熱", opposite: "坎" },
      "震": { id: 4, name: "雷", trait: "行動・革新", opposite: "巽" },
      "巽": { id: 5, name: "風", trait: "柔軟・浸透", opposite: "震" },
      "坎": { id: 6, name: "水", trait: "深淵・危険", opposite: "離" },
      "艮": { id: 7, name: "山", trait: "静止・瞑想", opposite: "兌" },
      "坤": { id: 8, name: "地", trait: "受容・育成", opposite: "乾" }
    }
  }

  /**
   * キーワードマップの初期化
   */
  private initializeKeywordMaps(): void {
    // Interface OS keywords (社会的表現)
    this.interfaceKeywords = new Map([
      ["リーダーシップ", ["1", "13", "43", "14", "34", "9", "5", "26"]],
      ["協調性", ["2", "15", "45", "12", "20", "8", "16", "35"]],
      ["創造性", ["1", "43", "34", "14", "50", "30", "56", "62"]],
      // ... more keywords
    ])
    
    // SafeMode OS keywords (防御反応)
    this.safeModeKeywords = new Map([
      ["慎重", ["2", "52", "39", "15", "62", "53", "56", "31"]],
      ["分析的", ["29", "48", "47", "6", "46", "18", "57", "32"]],
      ["撤退", ["33", "12", "45", "35", "16", "20", "8", "23"]],
      // ... more keywords
    ])
  }

  /**
   * Bunenjin哲学実装状況の初期化
   */
  private initializeBunenjinStatus(): BunenjinStatus {
    return {
      // Core philosophy
      dividedPersonalitySupport: true,
      rejectsUnifiedSelfConcept: true,
      embracesMultiplicity: true,
      
      // Triple OS structure
      tripleOSStructure: {
        engineOSAsValueCore: true,
        interfaceOSAsSocialAdaptation: true,
        safeModeOSAsProtection: true,
        enablesContextualPersonality: true
      },
      
      // Advanced features (partially implemented)
      contextAwarePersonality: false,
      personalityTransitions: false
    }
  }

  /**
   * 三爻エネルギーの計算
   */
  private calculateTrigramEnergies(userVector: UserVector): TrigramEnergies {
    const energies: TrigramEnergies = {
      "乾": (userVector["乾_創造性"] || 0) * 1.0,
      "震": (userVector["震_行動性"] || 0) * 1.0,
      "坎": (userVector["坎_探求性"] || 0) * 1.0,
      "艮": (userVector["艮_安定性"] || 0) * 1.0,
      "坤": (userVector["坤_受容性"] || 0) * 1.0,
      "巽": (userVector["巽_適応性"] || 0) * 1.0,
      "離": (userVector["離_表現性"] || 0) * 1.0,
      "兌": (userVector["兌_調和性"] || 0) * 1.0
    }
    
    // Normalize energies
    const maxEnergy = Math.max(...Object.values(energies))
    if (maxEnergy > 0) {
      Object.keys(energies).forEach(key => {
        energies[key] = (energies[key] / maxEnergy) * 100
      })
    }
    
    return energies
  }

  /**
   * 三爻からヘキサグラムへのマッピング
   */
  private mapTrigramsToHexagram(upperTrigram: string, lowerTrigram: string): number {
    // Simplified mapping - in reality this would use a complete mapping table
    const trigramToNumber: { [key: string]: number } = {
      "乾": 1, "兌": 2, "離": 3, "震": 4,
      "巽": 5, "坎": 6, "艮": 7, "坤": 8
    }
    
    const upper = trigramToNumber[upperTrigram] || 1
    const lower = trigramToNumber[lowerTrigram] || 1
    
    // Simple formula for demo - actual mapping would be more complex
    return ((upper - 1) * 8) + lower
  }

  /**
   * 外面選択肢の抽出
   */
  private extractOuterChoices(scenarioAnswers: Answer[]): string[] {
    const choices: string[] = []
    
    scenarioAnswers.forEach(answer => {
      if (answer.outerChoice) {
        // Extract text from outer choice
        const choiceText = typeof answer.outerChoice === 'string' 
          ? answer.outerChoice 
          : answer.outerChoice.text || ''
        choices.push(choiceText)
      }
    })
    
    return choices
  }

  /**
   * 内面選択肢の抽出
   */
  private extractInnerChoices(scenarioAnswers: Answer[]): string[] {
    const choices: string[] = []
    
    scenarioAnswers.forEach(answer => {
      if (answer.innerChoice) {
        // Extract text from inner choice
        const choiceText = typeof answer.innerChoice === 'string' 
          ? answer.innerChoice 
          : answer.innerChoice.text || ''
        choices.push(choiceText)
      }
    })
    
    return choices
  }

  /**
   * キーワードマッチング
   */
  private async performKeywordMatching(
    choices: string[], 
    type: 'interface' | 'safemode'
  ): Promise<{
    keywords: string[]
    matchingCandidates: Array<{
      hexagramId: number
      matchedKeywords: string[]
      score: number
    }>
  }> {
    const keywordMap = type === 'interface' ? this.interfaceKeywords : this.safeModeKeywords
    const extractedKeywords: string[] = []
    const hexagramScores: Map<number, { keywords: string[], score: number }> = new Map()
    
    // Extract keywords from choices
    choices.forEach(choice => {
      keywordMap.forEach((hexagrams, keyword) => {
        if (choice.includes(keyword)) {
          extractedKeywords.push(keyword)
          
          // Update hexagram scores
          hexagrams.forEach(hexId => {
            const id = parseInt(hexId)
            const current = hexagramScores.get(id) || { keywords: [], score: 0 }
            current.keywords.push(keyword)
            current.score += 1
            hexagramScores.set(id, current)
          })
        }
      })
    })
    
    // Convert to sorted array
    const candidates = Array.from(hexagramScores.entries())
      .map(([hexagramId, data]) => ({
        hexagramId,
        matchedKeywords: data.keywords,
        score: data.score
      }))
      .sort((a, b) => b.score - a.score)
    
    return {
      keywords: extractedKeywords,
      matchingCandidates: candidates
    }
  }

  /**
   * Engine OSを除外
   */
  private excludeEngineOS(
    candidates: Array<{ hexagramId: number; matchedKeywords: string[]; score: number }>,
    engineOS: OSAnalysisResult
  ): Array<{ hexagramId: number; matchedKeywords: string[]; score: number }> {
    return candidates.filter(candidate => candidate.hexagramId !== engineOS.hexagramId)
  }

  /**
   * Engine強度の計算
   */
  private calculateEngineStrength(trigramEnergies: TrigramEnergies): number {
    const values = Object.values(trigramEnergies)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min
    
    // Higher range means stronger, more defined personality
    return Math.min(range / 100, 1) * 100
  }

  /**
   * 整合性スコアの計算
   */
  private calculateConsistencyScore(
    engineOS: OSAnalysisResult,
    interfaceOS: InterfaceOSResult,
    safeModeOS: SafeModeOSResult
  ): number {
    const engineInterface = this.calculatePairConsistency(engineOS, interfaceOS)
    const engineSafeMode = this.calculatePairConsistency(engineOS, safeModeOS)
    const interfaceSafeMode = this.calculatePairConsistency(interfaceOS, safeModeOS)
    
    return (engineInterface + engineSafeMode + interfaceSafeMode) / 3
  }

  /**
   * ペア間の整合性計算
   */
  private calculatePairConsistency(osA: OSAnalysisResult, osB: OSAnalysisResult): number {
    // Simple consistency based on hexagram distance
    const distance = Math.abs(osA.hexagramId - osB.hexagramId)
    return Math.max(0, 100 - (distance * 2))
  }

  /**
   * OS間の不整合分析
   */
  private calculateOSMisalignment(
    engineOS: OSAnalysisResult,
    interfaceOS: InterfaceOSResult,
    safeModeOS: SafeModeOSResult
  ): any {
    const engineInterface = this.calculatePairConsistency(engineOS, interfaceOS)
    const engineSafeMode = this.calculatePairConsistency(engineOS, safeModeOS)
    const interfaceSafeMode = this.calculatePairConsistency(interfaceOS, safeModeOS)
    
    const overallScore = (engineInterface + engineSafeMode + interfaceSafeMode) / 3
    const riskLevel = this.categorizeRisk(overallScore)
    
    return {
      overallScore,
      pairScores: {
        engineInterface,
        engineSafeMode,
        interfaceSafeMode
      },
      riskLevel,
      analysis: {
        triggers: this.analyzeSafeModeActivationTriggers(engineOS, interfaceOS, { overallScore }),
        effects: this.analyzeSafeModeChronificationEffects(safeModeOS, { overallScore })
      }
    }
  }

  /**
   * リスクレベルの分類
   */
  private categorizeRisk(score: number): string {
    if (score >= 80) return "低リスク"
    if (score >= 60) return "中リスク"
    if (score >= 40) return "高リスク"
    return "非常に高リスク"
  }

  /**
   * SafeMode発動トリガーの分析
   */
  private analyzeSafeModeActivationTriggers(
    engineOS: OSAnalysisResult,
    interfaceOS: InterfaceOSResult,
    misalignmentData: any
  ): string[] {
    const triggers: string[] = []
    
    if (misalignmentData.overallScore < 60) {
      triggers.push("価値観と社会的表現の間に大きなギャップがある")
    }
    
    // Add more trigger analysis logic here
    
    return triggers
  }

  /**
   * SafeMode慢性化の影響分析
   */
  private analyzeSafeModeChronificationEffects(
    safeModeOS: SafeModeOSResult,
    misalignmentData: any
  ): string[] {
    const effects: string[] = []
    
    if (misalignmentData.overallScore < 50) {
      effects.push("防御システムが過度に活性化し、成長機会を制限する可能性")
    }
    
    // Add more effect analysis logic here
    
    return effects
  }

  /**
   * 統合的洞察の生成
   */
  private async generateIntegrationInsights(
    engineOS: OSAnalysisResult,
    interfaceOS: InterfaceOSResult,
    safeModeOS: SafeModeOSResult,
    misalignmentData: any
  ): Promise<any[]> {
    const insights: any[] = []
    
    // Basic insight about the triple OS configuration
    insights.push({
      type: "configuration",
      title: "あなたの3つの人格システム",
      content: `価値観システム（${engineOS.hexagramName}）、社会的システム（${interfaceOS.hexagramName}）、防御システム（${safeModeOS.hexagramName}）の組み合わせ`
    })
    
    // Consistency insight
    insights.push({
      type: "consistency",
      title: "システム間の調和度",
      content: `整合性スコア: ${misalignmentData.overallScore.toFixed(1)}% - ${misalignmentData.riskLevel}`
    })
    
    return insights
  }

  /**
   * 次元分析
   */
  private analyzeDimensions(userVector: UserVector): any {
    const dimensions = Object.entries(userVector)
      .map(([key, value]) => ({
        dimension: key,
        score: value,
        strength: value > 70 ? "強い" : value > 40 ? "中程度" : "弱い"
      }))
      .sort((a, b) => b.score - a.score)
    
    return {
      dominant: dimensions.slice(0, 3),
      weak: dimensions.slice(-3),
      balanced: dimensions.filter(d => d.score >= 40 && d.score <= 60)
    }
  }

  /**
   * Bunenjin実装データを分析結果に統合
   */
  private enrichAnalysisWithBunenjinData(analysisResult: TripleOSAnalysisResult): TripleOSAnalysisResult {
    return {
      ...analysisResult,
      HaQeiImplementation: {
        status: this.HaQeiImplementationStatus,
        philosophicalAlignment: {
          supportsDividedPersonality: this.HaQeiImplementationStatus.dividedPersonalitySupport,
          rejectsUnifiedSelf: this.HaQeiImplementationStatus.rejectsUnifiedSelfConcept,
          embracesMultiplicity: this.HaQeiImplementationStatus.embracesMultiplicity,
          enablesContextualAdaptation: this.HaQeiImplementationStatus.tripleOSStructure.enablesContextualPersonality
        }
      }
    }
  }
}

// Export singleton instance for Vue 3 usage
export const tripleOSEngine = new TripleOSEngine()