/**
 * Calculator - 計算・分析ロジック用クラス
 * HaQei Analyzer - 8D Calculation Engine
 * TypeScript版 - Vue 3統合用
 * 
 * 目的：
 * - 8次元ベクトル計算とコサイン類似度分析
 * - 易経深化ロジックと統計的妥当性チェック
 * - Triple OS候補分析と透明性レポート生成
 */

import type { Answer, ScoringTag } from '@/data/types'
import { useStatisticalEngine } from '@/utils/statisticalEngine'

// Type definitions
export interface UserVector {
  [key: string]: number
}

export interface OSVector {
  [key: string]: number
}

export interface OSCandidate {
  osId: number
  score: number
  similarity: number
  activation: number
  corrected: boolean
  confidence: number
}

export interface LinePositionInfo {
  name: string
  meaning: string
  character: string
  socialPosition: string
  advice: string
  yinYangPreference: string
  stage: string
  keyword: string
}

export interface LineRelationship {
  positions: number[]
  names: string[]
  lines: number[]
  relationship: string
  meaning: string
}

export interface LineRelationshipAnalysis {
  correspondence: LineRelationship[]
  adjacency: LineRelationship[]
  centrality: {
    lowerCentral: {
      position: number
      name: string
      line: number
      isCorrectPosition: boolean
      meaning: string
    }
    upperCentral: {
      position: number
      name: string
      line: number
      isCorrectPosition: boolean
      meaning: string
    }
  }
  correctness: Array<{
    position: number
    line: number
    isCorrectPosition: boolean
    expectedLine: number
    positionType: string
    status: string
  }>
}

export interface CalculationRecord {
  timestamp: string
  method: string
  weights: {
    similarity: number
    activation: number
  }
  systemType: string
  rawComponents?: {
    similarity: number
    activation: number
    rawFinalScore: number
  }
  validation?: {
    wasValid: boolean
    originalScore: number
    correctedScore: number
    warnings: string[]
    boundaryType: string
    confidence: number
  }
  finalScore?: number
  error?: string
}

export interface AnalysisResult {
  candidates: OSCandidate[]
  statistics: {
    totalProcessed: number
    validCandidates: number
    correctedScores: number
    errors: string[]
  }
  validation: {
    outliers: number[]
    cleanedScoreCount: number
    method: string
  } | null
  quality: any
  transparencyReport: any
}

export class Calculator {
  private dimensionKeys: string[] = [
    "乾_創造性",
    "震_行動性",
    "坎_探求性",
    "艮_安定性",
    "坤_受容性",
    "巽_適応性",
    "離_表現性",
    "兌_調和性",
  ]

  private statisticalEngine: any
  private calculationHistory: CalculationRecord[] = []

  constructor() {
    // 統計エンジンの初期化（別途実装が必要な場合）
    this.statisticalEngine = null // TODO: Implement statistical engine
    console.log("📊 Calculator initialized with statistical validation:", !!this.statisticalEngine)
  }

  /**
   * ユーザー回答から8次元ベクトルを構築（易経深化ロジック統合版）
   * 
   * 目的：
   * - ユーザーの回答を8次元の数値ベクトルに変換
   * - 易経の深化ロジックを適用して精度向上
   * 
   * 入力：
   * - answers: Answer[] - ユーザーの回答配列
   * 
   * 処理内容：
   * 1. 各回答のスコアリングタグを集計
   * 2. 易経深化ロジック（対立・補完関係）を適用
   * 3. 爻辞レベルによる係数調整
   * 
   * 出力：
   * - UserVector - 8次元の数値ベクトル
   * 
   * 副作用：
   * - コンソールログ出力
   * 
   * 前提条件：
   * - answersが有効なAnswer配列であること
   * - scoring_tagsが正しい形式であること
   */
  buildUserVector(answers: Answer[]): UserVector {
    const userVector: UserVector = {}
    
    // 8次元を初期化
    this.dimensionKeys.forEach((key) => {
      userVector[key] = 0
    })

    // answersが配列でない場合のハンドリング
    if (!Array.isArray(answers)) {
      console.warn("⚠️ buildUserVector: answers is not an array")
      return userVector
    }

    // 回答からスコアを加算（易経深化ロジック適用）
    answers.forEach((answer) => {
      if (answer && answer.scoring_tags && Array.isArray(answer.scoring_tags)) {
        // 基本スコアリング
        answer.scoring_tags.forEach((tag: ScoringTag) => {
          if (tag && typeof tag.key === "string" && typeof tag.value === "number") {
            if (Object.prototype.hasOwnProperty.call(userVector, tag.key)) {
              userVector[tag.key] += tag.value
            }
          }
        })

        // 易経深化ロジック適用
        this.applyIChingDeepLogic(answer, userVector)
      }
    })

    console.log("📊 Built user vector with I-Ching logic:", userVector)
    return userVector
  }

  /**
   * 易経深化ロジック適用
   * 
   * 目的：
   * - 対立関係・補完関係による相互影響を計算
   * - 爻辞レベルによる係数調整を適用
   * 
   * 処理内容：
   * 1. 対立関係の負の影響を計算
   * 2. 補完関係の正の影響を計算
   * 3. 爻辞レベルによる全体的な調整
   */
  private applyIChingDeepLogic(answer: Answer, userVector: UserVector): void {
    if (!answer.scoring_tags) return

    answer.scoring_tags.forEach((tag: ScoringTag) => {
      if (!tag || !tag.key || typeof tag.value !== "number") return

      // 対立関係の処理
      if (tag.type === "conflicting") {
        // TODO: Implement opposing relationships logic
        console.log(`🔯 Conflicting tag: ${tag.key}`)
      }

      // 補完関係の処理
      if (tag.type === "complementary") {
        // TODO: Implement complementary relationships logic
        console.log(`🔯 Complementary tag: ${tag.key}`)
      }

      // 爻辞レベルによる修正
      if (answer.koui_level) {
        const kouiMultiplier = this.getKouiMultiplier(answer.koui_level)
        if (userVector.hasOwnProperty(tag.key)) {
          const originalValue = userVector[tag.key]
          const adjustment = tag.value * (kouiMultiplier - 1.0)
          userVector[tag.key] += adjustment
          console.log(`🔯 Koui level ${answer.koui_level} adjustment: ${tag.key} ${originalValue} → ${userVector[tag.key]}`)
        }
      }
    })
  }

  /**
   * 爻辞レベルに基づく係数取得
   */
  private getKouiMultiplier(kouiLevel: number): number {
    // 易経の爻の特性に基づく係数
    const multipliers: { [key: number]: number } = {
      1: 0.9,  // 初爻：慎重、控えめな効果
      2: 1.1,  // 二爻：協力的、バランス良い効果  
      3: 0.8,  // 三爻：危険段階、効果減少
      4: 1.2,  // 四爻：責任段階、効果増大
      5: 1.3,  // 五爻：統率段階、最大効果
      6: 1.0   // 上爻：完成段階、標準効果
    }
    return multipliers[kouiLevel] || 1.0
  }

  /**
   * 六爻の位置的意味を取得
   */
  getLinePositionMeaning(position: number): LinePositionInfo | null {
    const linePositions: { [key: number]: LinePositionInfo } = {
      1: { // 初爻
        name: "初爻",
        meaning: "始まり・基礎・潜伏期",
        character: "潜龍勿用",
        socialPosition: "庶民・初心者",
        advice: "慎重に準備し、時機を待つ",
        yinYangPreference: "陽爻が正位",
        stage: "準備段階",
        keyword: "慎重"
      },
      2: { // 二爻
        name: "二爻",
        meaning: "発展・臣位・行動期",
        character: "見龍在田",
        socialPosition: "臣下・補佐役",
        advice: "協力と連携を重視する",
        yinYangPreference: "陰爻が正位",
        stage: "実践段階",
        keyword: "協力"
      },
      3: { // 三爻
        name: "三爻",
        meaning: "転換・進退・困難期",
        character: "君子終日乾乾",
        socialPosition: "中間管理職",
        advice: "注意深く判断し、過度な行動は慎む",
        yinYangPreference: "陽爻が正位",
        stage: "試練段階",
        keyword: "注意"
      },
      4: { // 四爻
        name: "四爻",
        meaning: "進展・近臣・責任期",
        character: "或躍在淵",
        socialPosition: "側近・重臣",
        advice: "責任を持ってリーダーを支える",
        yinYangPreference: "陰爻が正位",
        stage: "責任段階",
        keyword: "支援"
      },
      5: { // 五爻
        name: "五爻",
        meaning: "成熟・君位・統率期",
        character: "飛龍在天",
        socialPosition: "君主・リーダー",
        advice: "高い徳性と決断力で導く",
        yinYangPreference: "陽爻が正位",
        stage: "統率段階",
        keyword: "指導"
      },
      6: { // 上爻
        name: "上爻",
        meaning: "完成・退隠・変化期",
        character: "亢龍有悔",
        socialPosition: "長老・賢者",
        advice: "謙虚さを保ち、次世代に道を譲る",
        yinYangPreference: "陰爻が正位",
        stage: "完成段階",
        keyword: "謙虚"
      }
    }

    return linePositions[position] || null
  }

  /**
   * 爻の相互関係を分析
   */
  analyzeLineRelationships(hexagramLines: number[]): LineRelationshipAnalysis | { error: string } {
    if (!Array.isArray(hexagramLines) || hexagramLines.length !== 6) {
      console.warn("⚠️ Invalid hexagram lines for relationship analysis")
      return { error: "Invalid hexagram lines" }
    }

    const relationships: LineRelationshipAnalysis = {
      correspondence: this.analyzeCorrespondence(hexagramLines),
      adjacency: this.analyzeAdjacency(hexagramLines),
      centrality: this.analyzeCentrality(hexagramLines),
      correctness: this.analyzeCorrectness(hexagramLines)
    }

    return relationships
  }

  /**
   * 応の関係（初応四、二応五、三応上）を分析
   */
  private analyzeCorrespondence(lines: number[]): LineRelationship[] {
    const correspondencePairs = [
      { positions: [1, 4], names: ["初爻", "四爻"] },
      { positions: [2, 5], names: ["二爻", "五爻"] },
      { positions: [3, 6], names: ["三爻", "上爻"] }
    ]

    return correspondencePairs.map(pair => {
      const pos1 = pair.positions[0] - 1 // 配列インデックス
      const pos2 = pair.positions[1] - 1
      const line1 = lines[pos1]
      const line2 = lines[pos2]
      
      const isCorresponding = line1 !== line2 // 陰陽が異なる場合は応
      const relationship = isCorresponding ? "応" : "敵"
      
      return {
        positions: pair.positions,
        names: pair.names,
        lines: [line1, line2],
        relationship: relationship,
        meaning: this.getCorrespondenceMeaning(pair.positions, relationship)
      }
    })
  }

  /**
   * 比の関係（隣接爻位）を分析
   */
  private analyzeAdjacency(lines: number[]): LineRelationship[] {
    const adjacentPairs = [
      { positions: [1, 2], names: ["初爻", "二爻"] },
      { positions: [2, 3], names: ["二爻", "三爻"] },
      { positions: [3, 4], names: ["三爻", "四爻"] },
      { positions: [4, 5], names: ["四爻", "五爻"] },
      { positions: [5, 6], names: ["五爻", "上爻"] }
    ]

    return adjacentPairs.map(pair => {
      const pos1 = pair.positions[0] - 1
      const pos2 = pair.positions[1] - 1
      const line1 = lines[pos1]
      const line2 = lines[pos2]
      
      const isComplementary = line1 !== line2 // 陰陽が異なる場合は相補的
      const relationship = isComplementary ? "相補比" : "同気比"
      
      return {
        positions: pair.positions,
        names: pair.names,
        lines: [line1, line2],
        relationship: relationship,
        meaning: this.getAdjacencyMeaning(pair.positions, relationship)
      }
    })
  }

  /**
   * 中の位（二爻・五爻）を分析
   */
  private analyzeCentrality(lines: number[]): LineRelationshipAnalysis['centrality'] {
    return {
      lowerCentral: {
        position: 2,
        name: "二爻",
        line: lines[1],
        isCorrectPosition: lines[1] === 0, // 陰爻が正位
        meaning: "下卦の中心、協調性を表す"
      },
      upperCentral: {
        position: 5,
        name: "五爻",
        line: lines[4],
        isCorrectPosition: lines[4] === 1, // 陽爻が正位
        meaning: "上卦の中心、指導性を表す"
      }
    }
  }

  /**
   * 正位（奇数位に陽爻、偶数位に陰爻）を分析
   */
  private analyzeCorrectness(lines: number[]): LineRelationshipAnalysis['correctness'] {
    return lines.map((line, index) => {
      const position = index + 1
      const isOddPosition = position % 2 === 1
      const isCorrectPosition = (isOddPosition && line === 1) || (!isOddPosition && line === 0)
      
      return {
        position: position,
        line: line,
        isCorrectPosition: isCorrectPosition,
        expectedLine: isOddPosition ? 1 : 0,
        positionType: isOddPosition ? "陽位" : "陰位",
        status: isCorrectPosition ? "正位" : "不正位"
      }
    })
  }

  /**
   * 応の関係の意味を取得
   */
  private getCorrespondenceMeaning(positions: number[], relationship: string): string {
    const meanings: { [key: string]: { [rel: string]: string } } = {
      "1,4": {
        "応": "基礎と責任の調和。初心者とリーダーの良い関係",
        "敵": "基礎と責任の対立。方向性の不一致"
      },
      "2,5": {
        "応": "臣と君の理想的関係。協力と指導のバランス",
        "敵": "臣と君の対立。権力争いや不信"
      },
      "3,6": {
        "応": "困難と智慧の結合。試練を智慧で乗り越える",
        "敵": "困難と智慧の分離。混乱と迷い"
      }
    }
    
    const key = positions.join(",")
    return meanings[key]?.[relationship] || "一般的な応の関係"
  }

  /**
   * 比の関係の意味を取得
   */
  private getAdjacencyMeaning(positions: number[], relationship: string): string {
    const meanings: { [key: string]: string } = {
      "相補比": "隣接する陰陽が互いを補完し合う良い関係",
      "同気比": "同じ性質の爻が並び、協力または競合する関係"
    }
    
    return meanings[relationship] || "一般的な比の関係"
  }

  /**
   * 爻辞レベル適用の精度を向上させるメソッド
   */
  applyLineApplicationAccuracy(hexagramLines: number[], userVector: UserVector): {
    enhancedVector: UserVector
    lineAnalysis: LineRelationshipAnalysis
    adjustments: {
      positionAdjustments: boolean
      correspondenceAdjustments: boolean
      centralityAdjustments: boolean
    }
  } | { error: string } {
    if (!Array.isArray(hexagramLines) || hexagramLines.length !== 6) {
      console.warn("⚠️ Invalid hexagram lines for line application")
      return { error: "Invalid hexagram lines" }
    }

    const lineAnalysis = this.analyzeLineRelationships(hexagramLines)
    if ('error' in lineAnalysis) {
      return { error: lineAnalysis.error }
    }

    const enhancedVector = { ...userVector }

    // 1. 爻位の位置的意味に基づく調整
    hexagramLines.forEach((line, index) => {
      const position = index + 1
      const lineInfo = this.getLinePositionMeaning(position)
      
      if (lineInfo) {
        const adjustmentFactor = this.calculateLineAdjustmentFactor(position, line, lineInfo)
        
        // 各次元に爻位の特性を反映
        this.dimensionKeys.forEach(key => {
          const positionInfluence = this.getPositionInfluenceOnDimension(position, key)
          enhancedVector[key] += (enhancedVector[key] || 0) * adjustmentFactor * positionInfluence
        })

        console.log(`🔯 Line ${position} (${lineInfo.name}) adjustment applied: factor=${adjustmentFactor.toFixed(3)}`)
      }
    })

    // 2. 応の関係に基づく調整
    if (lineAnalysis.correspondence) {
      lineAnalysis.correspondence.forEach(corr => {
        if (corr.relationship === "応") {
          const harmonicBonus = this.calculateHarmonicBonus(corr)
          this.dimensionKeys.forEach(key => {
            enhancedVector[key] += harmonicBonus
          })
          console.log(`🔯 Correspondence harmony bonus applied: ${harmonicBonus.toFixed(3)}`)
        }
      })
    }

    // 3. 中正に基づる調整
    if (lineAnalysis.centrality) {
      const centralityBonus = this.calculateCentralityBonus(lineAnalysis.centrality)
      this.dimensionKeys.forEach(key => {
        enhancedVector[key] += centralityBonus
      })
      console.log(`🔯 Centrality bonus applied: ${centralityBonus.toFixed(3)}`)
    }

    return {
      enhancedVector: enhancedVector,
      lineAnalysis: lineAnalysis,
      adjustments: {
        positionAdjustments: true,
        correspondenceAdjustments: true,
        centralityAdjustments: true
      }
    }
  }

  /**
   * 爻位の調整係数を計算
   */
  private calculateLineAdjustmentFactor(position: number, line: number, lineInfo: LinePositionInfo): number {
    // 正位かどうかによる基本調整
    const isOddPosition = position % 2 === 1
    const isCorrectPosition = (isOddPosition && line === 1) || (!isOddPosition && line === 0)
    
    let baseFactor = isCorrectPosition ? 1.1 : 0.9 // 正位は1.1倍、不正位は0.9倍

    // 爻位の重要度による調整
    const importanceFactors: { [key: number]: number } = {
      2: 1.2, // 二爻（下卦の中）
      5: 1.3, // 五爻（上卦の中、君位）
      1: 1.0, // 初爻
      3: 0.9, // 三爻（困難の位）
      4: 1.1, // 四爻
      6: 1.0  // 上爻
    }

    return baseFactor * (importanceFactors[position] || 1.0)
  }

  /**
   * 爻位が各次元に与える影響度を計算
   */
  private getPositionInfluenceOnDimension(position: number, dimensionKey: string): number {
    // 爻位と八卦次元の相関関係マップ
    const influences: { [pos: number]: { [key: string]: number } } = {
      1: { // 初爻 - 基礎・慎重
        "艮_安定性": 0.3,
        "坤_受容性": 0.2,
        "坎_探求性": 0.1,
        "震_行動性": 0.05,
        "乾_創造性": 0.1,
        "巽_適応性": 0.1,
        "離_表現性": 0.05,
        "兌_調和性": 0.1
      },
      2: { // 二爻 - 協力・実践
        "坤_受容性": 0.3,
        "兌_調和性": 0.25,
        "巽_適応性": 0.2,
        "坎_探求性": 0.1,
        "艮_安定性": 0.1,
        "離_表現性": 0.05,
        "震_行動性": 0.05,
        "乾_創造性": 0.05
      },
      3: { // 三爻 - 困難・注意
        "坎_探求性": 0.3,
        "震_行動性": 0.2,
        "離_表現性": 0.15,
        "艮_安定性": 0.1,
        "巽_適応性": 0.1,
        "乾_創造性": 0.1,
        "坤_受容性": 0.03,
        "兌_調和性": 0.02
      },
      4: { // 四爻 - 責任・支援
        "巽_適応性": 0.3,
        "坤_受容性": 0.25,
        "兌_調和性": 0.2,
        "離_表現性": 0.1,
        "艮_安定性": 0.1,
        "坎_探求性": 0.03,
        "震_行動性": 0.01,
        "乾_創造性": 0.01
      },
      5: { // 五爻 - 指導・統率
        "乾_創造性": 0.35,
        "離_表現性": 0.25,
        "震_行動性": 0.2,
        "坎_探求性": 0.1,
        "兌_調和性": 0.05,
        "巽_適応性": 0.03,
        "艮_安定性": 0.01,
        "坤_受容性": 0.01
      },
      6: { // 上爻 - 完成・謙虚
        "艮_安定性": 0.3,
        "坤_受容性": 0.25,
        "兌_調和性": 0.2,
        "巽_適応性": 0.1,
        "離_表現性": 0.08,
        "坎_探求性": 0.05,
        "震_行動性": 0.01,
        "乾_創造性": 0.01
      }
    }

    return influences[position]?.[dimensionKey] || 0.1
  }

  /**
   * 応の関係による調和ボーナスを計算
   */
  private calculateHarmonicBonus(correspondence: LineRelationship): number {
    // 応の関係によるボーナスは関係の重要度によって変化
    const bonusMap: { [key: string]: number } = {
      "1,4": 0.05, // 初応四
      "2,5": 0.08, // 二応五（最重要）
      "3,6": 0.06  // 三応上
    }
    
    const key = correspondence.positions.join(",")
    return bonusMap[key] || 0.05
  }

  /**
   * 中正による調整ボーナスを計算
   */
  private calculateCentralityBonus(centrality: LineRelationshipAnalysis['centrality']): number {
    let bonus = 0
    
    // 二爻が正位（陰爻）の場合
    if (centrality.lowerCentral.isCorrectPosition) {
      bonus += 0.03
    }
    
    // 五爻が正位（陽爻）の場合
    if (centrality.upperCentral.isCorrectPosition) {
      bonus += 0.05 // 五爻の方が重要
    }
    
    return bonus
  }

  /**
   * シナリオ回答から8次元ベクトルを構築（状況卦修正適用）
   */
  buildScenarioVector(scenarioAnswers: Answer[], vectorType: 'interface' | 'engine' = 'interface'): UserVector {
    const scenarioVector: UserVector = {}
    
    // 8次元を初期化
    this.dimensionKeys.forEach((key) => {
      scenarioVector[key] = 0
    })

    if (!Array.isArray(scenarioAnswers)) {
      console.warn("⚠️ buildScenarioVector: scenarioAnswers is not an array")
      return scenarioVector
    }

    // シナリオ回答からスコアを加算
    scenarioAnswers.forEach((answer) => {
      if (!answer || !answer.questionId) return

      // 質問IDから状況卦を取得
      const questionId = answer.questionId
      const situationHexagram = this.getSituationHexagramByQuestionId(questionId)

      // 内面・外面選択肢を処理
      const choices = vectorType === 'interface' ? 
        (answer.outerChoice ? [answer.outerChoice] : []) :
        (answer.innerChoice ? [answer.innerChoice] : [])

      choices.forEach((choice: any) => {
        if (choice && choice.scoring_tags && Array.isArray(choice.scoring_tags)) {
          choice.scoring_tags.forEach((tag: ScoringTag) => {
            if (tag && typeof tag.key === "string" && typeof tag.value === "number") {
              if (Object.prototype.hasOwnProperty.call(scenarioVector, tag.key)) {
                let adjustedValue = tag.value

                // 状況卦による修正適用
                if (situationHexagram) {
                  // TODO: Implement situational modifier
                  console.log(`🔯 Situational modifier for ${questionId} (${situationHexagram})`)
                }

                scenarioVector[tag.key] += adjustedValue
              }
            }
          })

          // 易経深化ロジック適用
          this.applyIChingDeepLogic(choice, scenarioVector)
        }
      })
    })

    console.log(`📊 Built ${vectorType} scenario vector:`, scenarioVector)
    return scenarioVector
  }

  /**
   * 質問IDから状況卦を取得
   */
  private getSituationHexagramByQuestionId(questionId: string): string | null {
    // TODO: Implement situational hexagram lookup
    return null
  }

  /**
   * 8次元ベクトル正規化
   */
  normalizeVectors(userVector: UserVector, osVector: OSVector): {
    normalizedUser: UserVector
    normalizedOS: OSVector
  } {
    const normalizedUser: UserVector = {}
    const normalizedOS: OSVector = {}

    this.dimensionKeys.forEach((key) => {
      normalizedUser[key] = userVector[key] || 0
      normalizedOS[key] = osVector[key] || 0
    })

    return { normalizedUser, normalizedOS }
  }

  /**
   * コサイン類似度計算
   */
  calculateCosineSimilarity(vectorA: UserVector, vectorB: OSVector): number {
    const { normalizedUser: vecA, normalizedOS: vecB } = this.normalizeVectors(
      vectorA,
      vectorB
    )

    let dotProduct = 0
    let magnitudeA = 0
    let magnitudeB = 0

    Object.keys(vecA).forEach((key) => {
      dotProduct += vecA[key] * vecB[key]
      magnitudeA += vecA[key] * vecA[key]
      magnitudeB += vecB[key] * vecB[key]
    })

    magnitudeA = Math.sqrt(magnitudeA)
    magnitudeB = Math.sqrt(magnitudeB)

    if (magnitudeA === 0 || magnitudeB === 0) return 0

    return dotProduct / (magnitudeA * magnitudeB)
  }

  /**
   * H64_8D_VECTORSのオブジェクト形式を配列に変換
   */
  convertToVectorArray(hexagramData: any): number[] {
    // 引数が不正な場合は全て0の配列を返す
    if (!hexagramData || typeof hexagramData !== "object") {
      console.warn("⚠️ Invalid hexagramData, returning zero vector array")
      return [0, 0, 0, 0, 0, 0, 0, 0]
    }
    return this.dimensionKeys.map((key) => hexagramData[key] ?? 0)
  }

  /**
   * 配列形式のコサイン類似度
   */
  calculateCosineSimilarityArray(vectorA: number[], vectorB: number[]): number {
    if (
      !Array.isArray(vectorA) ||
      !Array.isArray(vectorB) ||
      vectorA.length !== 8 ||
      vectorB.length !== 8
    ) {
      console.warn("⚠️ Invalid input vectors for cosine similarity (array)")
      return 0
    }
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0)
    const magnitudeA = Math.sqrt(
      vectorA.reduce((sum, val) => sum + val * val, 0)
    )
    const magnitudeB = Math.sqrt(
      vectorB.reduce((sum, val) => sum + val * val, 0)
    )
    if (magnitudeA === 0 || magnitudeB === 0) {
      console.warn("⚠️ Zero magnitude in cosine similarity (array)")
      return 0
    }
    return dotProduct / (magnitudeA * magnitudeB)
  }

  /**
   * マグニチュード活性化スコア計算
   */
  calculateActivationScore(vectorA: UserVector, vectorB: OSVector): number {
    const { normalizedUser: vecA, normalizedOS: vecB } = this.normalizeVectors(
      vectorA,
      vectorB
    )

    let magnitudeA = 0
    let magnitudeB = 0

    Object.keys(vecA).forEach((key) => {
      magnitudeA += vecA[key] * vecA[key]
      magnitudeB += vecB[key] * vecB[key]
    })

    magnitudeA = Math.sqrt(magnitudeA)
    magnitudeB = Math.sqrt(magnitudeB)

    if (magnitudeA === 0 || magnitudeB === 0) return 0

    const magnitudeRatio =
      Math.min(magnitudeA, magnitudeB) / Math.max(magnitudeA, magnitudeB)
    return Math.pow(magnitudeRatio, 0.5)
  }

  /**
   * 最終スコア計算（70:30重み付け + 統計的妥当性チェック）
   */
  calculateFinalScore(userVector: UserVector, osVector: OSVector, systemType: string = 'general'): number {
    // 計算透明性のための記録
    const calculationRecord: CalculationRecord = {
      timestamp: new Date().toISOString(),
      method: "Weighted Cosine Similarity + Activation Score",
      weights: { similarity: 0.7, activation: 0.3 },
      systemType: systemType
    }

    try {
      const similarityScore = this.calculateCosineSimilarity(userVector, osVector)
      const activationScore = this.calculateActivationScore(userVector, osVector)

      // 基本計算
      const rawScore = similarityScore * 0.7 + activationScore * 0.3
      
      calculationRecord.rawComponents = {
        similarity: similarityScore,
        activation: activationScore,
        rawFinalScore: rawScore
      }

      // 統計的妥当性チェック
      let finalScore = rawScore
      if (this.statisticalEngine) {
        const validation = this.statisticalEngine.validateScore(rawScore, systemType)
        finalScore = validation.correctedScore
        
        calculationRecord.validation = {
          wasValid: validation.isValid,
          originalScore: validation.originalScore,
          correctedScore: validation.correctedScore,
          warnings: validation.warnings,
          boundaryType: validation.boundaryType,
          confidence: validation.confidence
        }

        // 修正があった場合はログ出力
        if (!validation.isValid) {
          console.log(`📊 Score corrected: ${rawScore.toFixed(6)} → ${finalScore.toFixed(3)} (${validation.warnings.join(', ')})`)
        }
      }

      calculationRecord.finalScore = finalScore
      this.calculationHistory.push(calculationRecord)

      return finalScore

    } catch (error: any) {
      console.error("❌ Error in calculateFinalScore:", error)
      calculationRecord.error = error.message
      this.calculationHistory.push(calculationRecord)
      
      // フォールバック値（中央値）
      return 0.5
    }
  }

  /**
   * OS候補分析（統計的妥当性チェック強化版）
   */
  analyzeOSCandidates(userVector: UserVector, vectorsData: { [key: string]: OSVector }, systemType: string = 'general'): AnalysisResult {
    console.log("🔍 OS候補分析開始 (統計的妥当性チェック付き)")
    
    // 入力検証
    if (!userVector || typeof userVector !== 'object') {
      console.error("❌ Invalid userVector:", userVector)
      throw new Error("ユーザーベクターが無効です")
    }
    
    if (!vectorsData || typeof vectorsData !== 'object') {
      console.error("❌ Invalid vectorsData:", vectorsData)
      throw new Error("ベクターデータが無効です")
    }
    
    const vectorKeys = Object.keys(vectorsData)
    if (vectorKeys.length === 0) {
      console.error("❌ Empty vectorsData")
      throw new Error("ベクターデータが空です")
    }
    
    console.log(`📊 分析対象: ${vectorKeys.length}個のヘキサグラム`)
    console.log("📊 ユーザーベクター:", userVector)

    const candidates: OSCandidate[] = []
    const statisticalSummary = {
      totalProcessed: 0,
      validCandidates: 0,
      correctedScores: 0,
      errors: [] as string[]
    }

    Object.keys(vectorsData).forEach((osId) => {
      const osVector = vectorsData[osId]
      statisticalSummary.totalProcessed++
      
      // 各ベクターの妥当性チェック
      if (!osVector || typeof osVector !== 'object') {
        console.warn(`⚠️ Invalid osVector for ID ${osId}:`, osVector)
        statisticalSummary.errors.push(`Invalid vector for ID ${osId}`)
        return
      }
      
      try {
        const finalScore = this.calculateFinalScore(userVector, osVector, systemType)
        const similarity = this.calculateCosineSimilarity(userVector, osVector)
        const activation = this.calculateActivationScore(userVector, osVector)
        
        // スコアの妥当性チェック
        if (isNaN(finalScore) || isNaN(similarity) || isNaN(activation)) {
          console.warn(`⚠️ Invalid scores for ID ${osId}: final=${finalScore}, sim=${similarity}, act=${activation}`)
          statisticalSummary.errors.push(`Invalid scores for ID ${osId}`)
          return
        }

        // 最新の計算履歴から統計情報を取得
        const lastCalculation = this.calculationHistory[this.calculationHistory.length - 1]
        const wasCorrected = lastCalculation?.validation?.wasValid === false
        
        if (wasCorrected) {
          statisticalSummary.correctedScores++
        }
        
        candidates.push({
          osId: parseInt(osId),
          score: finalScore,
          similarity: similarity,
          activation: activation,
          corrected: wasCorrected,
          confidence: lastCalculation?.validation?.confidence || 0.95
        })
        
        statisticalSummary.validCandidates++
        
      } catch (scoreError: any) {
        console.error(`❌ Score calculation error for ID ${osId}:`, scoreError)
        statisticalSummary.errors.push(`Calculation error for ID ${osId}: ${scoreError.message}`)
      }
    })

    if (candidates.length === 0) {
      console.error("❌ No valid candidates generated")
      throw new Error("有効な候補が生成されませんでした")
    }

    // スコア群の統計的検証
    const allScores = candidates.map(c => c.score)
    let statisticalValidation = null
    
    if (this.statisticalEngine) {
      const outlierAnalysis = this.statisticalEngine.detectOutliers(allScores)
      statisticalValidation = {
        outliers: outlierAnalysis.outliers,
        cleanedScoreCount: outlierAnalysis.cleanedValues.length,
        method: outlierAnalysis.method
      }
      
      if (outlierAnalysis.outliers.length > 0) {
        console.log(`📊 Detected ${outlierAnalysis.outliers.length} score outliers:`, outlierAnalysis.outliers)
      }
    }

    // スコア順でソート、上位4候補を返す
    const sortedCandidates = candidates.sort((a, b) => b.score - a.score).slice(0, 4)
    
    // 統計的信頼性の評価
    const qualityAssessment = this.statisticalEngine ? 
      this.statisticalEngine.assessDataQuality({
        validatedScores: candidates.reduce((acc, c) => {
          acc[c.osId] = c.score
          return acc
        }, {} as { [key: number]: number }),
        corrections: statisticalSummary.correctedScores
      }) : null

    console.log(`✅ OS候補分析完了: ${sortedCandidates.length}個の候補`)
    console.log("📊 統計サマリー:", statisticalSummary)
    if (qualityAssessment) {
      console.log("📊 品質評価:", qualityAssessment)
    }
    console.log("📊 トップ候補:", sortedCandidates.map(c => 
      `ID=${c.osId}, Score=${this.statisticalEngine ? 
        this.statisticalEngine.formatPercentage(c.score) : 
        (c.score * 100).toFixed(1) + '%'}`
    ))
    
    return {
      candidates: sortedCandidates,
      statistics: statisticalSummary,
      validation: statisticalValidation,
      quality: qualityAssessment,
      transparencyReport: this.generateTransparencyReport()
    }
  }

  /**
   * 透明性レポートの生成
   */
  generateTransparencyReport(): any {
    if (!this.statisticalEngine) {
      return {
        message: "統計エンジンが利用できません",
        calculationHistory: this.calculationHistory.slice(-5) // 直近5件
      }
    }

    const recentCalculations = this.calculationHistory.slice(-10)
    const correctionRate = recentCalculations.filter(c => c.validation?.wasValid === false).length / recentCalculations.length
    
    return this.statisticalEngine.generateTransparencyReport({
      sampleSize: recentCalculations.length,
      correctionRate: correctionRate,
      validation: {
        totalCalculations: this.calculationHistory.length,
        recentCorrections: correctionRate,
        lastCalculation: recentCalculations[recentCalculations.length - 1]
      }
    })
  }
}

// Export a singleton instance for Vue 3 usage
export const calculator = new Calculator()