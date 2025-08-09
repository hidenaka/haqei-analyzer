/**
 * DataManager - データ管理クラス
 * 
 * 目的：
 * - ヘキサグラムデータの管理
 * - キーワードデータの管理
 * - その他の参照データの管理
 */

export interface HexagramData {
  id: number
  name: string
  upperTrigram: string
  lowerTrigram: string
  description?: string
  keywords?: string[]
}

export interface TrigramData {
  id: number
  name: string
  symbol: string
  trait: string
  element?: string
}

export class DataManager {
  private hexagrams: Map<number, HexagramData> = new Map()
  private trigrams: Map<string, TrigramData> = new Map()
  
  constructor() {
    this.initializeData()
  }

  /**
   * データの初期化
   */
  private initializeData(): void {
    // 基本的な八卦データ
    this.initializeTrigrams()
    
    // 64卦の基本データ（簡略版）
    this.initializeHexagrams()
  }

  /**
   * 八卦データの初期化
   */
  private initializeTrigrams(): void {
    const trigramData: TrigramData[] = [
      { id: 1, name: "乾", symbol: "☰", trait: "天", element: "創造性" },
      { id: 2, name: "兌", symbol: "☱", trait: "沢", element: "喜び" },
      { id: 3, name: "離", symbol: "☲", trait: "火", element: "明晰" },
      { id: 4, name: "震", symbol: "☳", trait: "雷", element: "行動" },
      { id: 5, name: "巽", symbol: "☴", trait: "風", element: "柔軟" },
      { id: 6, name: "坎", symbol: "☵", trait: "水", element: "深淵" },
      { id: 7, name: "艮", symbol: "☶", trait: "山", element: "静止" },
      { id: 8, name: "坤", symbol: "☷", trait: "地", element: "受容" }
    ]
    
    trigramData.forEach(data => {
      this.trigrams.set(data.name, data)
    })
  }

  /**
   * ヘキサグラムデータの初期化（簡略版）
   */
  private initializeHexagrams(): void {
    // 主要な卦のみ実装（完全版では64卦すべて）
    const hexagramData: HexagramData[] = [
      { 
        id: 1, 
        name: "乾為天", 
        upperTrigram: "乾", 
        lowerTrigram: "乾",
        keywords: ["創造性", "リーダーシップ", "強さ", "決断力"]
      },
      { 
        id: 2, 
        name: "坤為地", 
        upperTrigram: "坤", 
        lowerTrigram: "坤",
        keywords: ["受容性", "育成", "柔軟性", "協調性"]
      },
      { 
        id: 3, 
        name: "水雷屯", 
        upperTrigram: "坎", 
        lowerTrigram: "震",
        keywords: ["始まり", "困難", "成長", "忍耐"]
      },
      { 
        id: 4, 
        name: "山水蒙", 
        upperTrigram: "艮", 
        lowerTrigram: "坎",
        keywords: ["学習", "未熟", "指導", "啓発"]
      },
      // ... 他の60卦は省略
      { 
        id: 29, 
        name: "坎為水", 
        upperTrigram: "坎", 
        lowerTrigram: "坎",
        keywords: ["危険", "深淵", "洞察", "流動性"]
      },
      { 
        id: 30, 
        name: "離為火", 
        upperTrigram: "離", 
        lowerTrigram: "離",
        keywords: ["明晰", "情熱", "附着", "輝き"]
      }
    ]
    
    hexagramData.forEach(data => {
      this.hexagrams.set(data.id, data)
    })
  }

  /**
   * ヘキサグラムデータを取得
   */
  getHexagram(id: number): HexagramData | undefined {
    return this.hexagrams.get(id)
  }

  /**
   * 三爻データを取得
   */
  getTrigram(name: string): TrigramData | undefined {
    return this.trigrams.get(name)
  }

  /**
   * ヘキサグラム名を取得
   */
  getHexagramName(id: number): string {
    const hexagram = this.hexagrams.get(id)
    return hexagram ? hexagram.name : `卦${id}`
  }

  /**
   * 三爻の組み合わせからヘキサグラムIDを取得
   */
  getHexagramByTrigrams(upperTrigram: string, lowerTrigram: string): number {
    // 簡略化されたマッピング（実際は完全な対応表が必要）
    const mapping: { [key: string]: number } = {
      "乾乾": 1,
      "坤坤": 2,
      "坎震": 3,
      "艮坎": 4,
      // ... 他の組み合わせ
      "坎坎": 29,
      "離離": 30,
    }
    
    const key = upperTrigram + lowerTrigram
    return mapping[key] || 1
  }

  /**
   * すべてのヘキサグラムを取得
   */
  getAllHexagrams(): HexagramData[] {
    return Array.from(this.hexagrams.values())
  }

  /**
   * キーワードでヘキサグラムを検索
   */
  searchHexagramsByKeyword(keyword: string): HexagramData[] {
    const results: HexagramData[] = []
    
    this.hexagrams.forEach(hexagram => {
      if (hexagram.keywords?.some(k => k.includes(keyword))) {
        results.push(hexagram)
      }
    })
    
    return results
  }

  /**
   * ベクトルデータのプレースホルダー
   * TODO: 実際の64卦8次元ベクトルデータを実装
   */
  getHexagramVectors(): { [key: string]: { [dimension: string]: number } } {
    return {
      "1": {
        "乾_創造性": 100,
        "震_行動性": 80,
        "坎_探求性": 60,
        "艮_安定性": 40,
        "坤_受容性": 20,
        "巽_適応性": 30,
        "離_表現性": 70,
        "兌_調和性": 50
      },
      "2": {
        "乾_創造性": 20,
        "震_行動性": 30,
        "坎_探求性": 40,
        "艮_安定性": 60,
        "坤_受容性": 100,
        "巽_適応性": 80,
        "離_表現性": 50,
        "兌_調和性": 70
      },
      // ... 他の62卦
    }
  }
}

// Export singleton instance
export const dataManager = new DataManager()