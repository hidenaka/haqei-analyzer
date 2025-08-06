import { describe, it, expect, beforeEach } from 'vitest'

// Mock hexagram database operations
const mockHexagramDatabase = {
  data: new Map(),
  
  init() {
    // Initialize with sample data
    for (let i = 1; i <= 64; i++) {
      this.data.set(i, {
        number: i,
        name: `Hexagram ${i}`,
        chinese: `第${i}卦`,
        trigrams: {
          upper: Math.floor((i - 1) / 8),
          lower: (i - 1) % 8
        },
        meaning: `Meaning for hexagram ${i}`,
        interpretation: `Interpretation for hexagram ${i}`,
        keywords: [`keyword${i}a`, `keyword${i}b`]
      })
    }
  },
  
  getHexagram(number: number) {
    if (number < 1 || number > 64) {
      throw new Error('Invalid hexagram number')
    }
    return this.data.get(number)
  },
  
  getAllHexagrams() {
    return Array.from(this.data.values())
  },
  
  searchByKeyword(keyword: string) {
    return Array.from(this.data.values()).filter(hex => 
      hex.keywords.some(k => k.includes(keyword.toLowerCase()))
    )
  },
  
  getByTrigrams(upper: number, lower: number) {
    if (upper < 0 || upper > 7 || lower < 0 || lower > 7) {
      throw new Error('Invalid trigram numbers')
    }
    const hexagramNumber = upper * 8 + lower + 1
    return this.getHexagram(hexagramNumber)
  },
  
  validateHexagramData(data: any) {
    const required = ['number', 'name', 'chinese', 'trigrams', 'meaning', 'interpretation', 'keywords']
    return required.every(field => data && data[field] !== undefined)
  }
}

describe('Hexagram Database', () => {
  beforeEach(() => {
    mockHexagramDatabase.init()
  })

  it('initializes with 64 hexagrams', () => {
    const allHexagrams = mockHexagramDatabase.getAllHexagrams()
    expect(allHexagrams).toHaveLength(64)
  })

  it('retrieves hexagram by number', () => {
    const hexagram = mockHexagramDatabase.getHexagram(1)
    
    expect(hexagram).toBeDefined()
    expect(hexagram.number).toBe(1)
    expect(hexagram.name).toBe('Hexagram 1')
    expect(hexagram.chinese).toBe('第1卦')
  })

  it('throws error for invalid hexagram numbers', () => {
    expect(() => mockHexagramDatabase.getHexagram(0)).toThrow('Invalid hexagram number')
    expect(() => mockHexagramDatabase.getHexagram(65)).toThrow('Invalid hexagram number')
    expect(() => mockHexagramDatabase.getHexagram(-1)).toThrow('Invalid hexagram number')
  })

  it('searches hexagrams by keyword', () => {
    const results = mockHexagramDatabase.searchByKeyword('keyword1a')
    
    expect(results).toHaveLength(1)
    expect(results[0].number).toBe(1)
  })

  it('returns empty array for non-existent keywords', () => {
    const results = mockHexagramDatabase.searchByKeyword('nonexistent')
    expect(results).toHaveLength(0)
  })

  it('retrieves hexagram by trigram combination', () => {
    const hexagram = mockHexagramDatabase.getByTrigrams(0, 0)
    
    expect(hexagram).toBeDefined()
    expect(hexagram.number).toBe(1)
    expect(hexagram.trigrams.upper).toBe(0)
    expect(hexagram.trigrams.lower).toBe(0)
  })

  it('throws error for invalid trigram numbers', () => {
    expect(() => mockHexagramDatabase.getByTrigrams(-1, 0)).toThrow('Invalid trigram numbers')
    expect(() => mockHexagramDatabase.getByTrigrams(0, 8)).toThrow('Invalid trigram numbers')
    expect(() => mockHexagramDatabase.getByTrigrams(8, 0)).toThrow('Invalid trigram numbers')
  })

  it('validates hexagram data structure', () => {
    const validData = {
      number: 1,
      name: 'Test',
      chinese: '測試',
      trigrams: { upper: 0, lower: 0 },
      meaning: 'Test meaning',
      interpretation: 'Test interpretation',
      keywords: ['test']
    }
    
    const invalidData = {
      number: 1,
      name: 'Test'
      // missing required fields
    }
    
    expect(mockHexagramDatabase.validateHexagramData(validData)).toBe(true)
    expect(mockHexagramDatabase.validateHexagramData(invalidData)).toBe(false)
    expect(mockHexagramDatabase.validateHexagramData(null)).toBe(false)
  })

  it('ensures all hexagrams have correct trigram mappings', () => {
    for (let i = 1; i <= 64; i++) {
      const hexagram = mockHexagramDatabase.getHexagram(i)
      const expectedUpper = Math.floor((i - 1) / 8)
      const expectedLower = (i - 1) % 8
      
      expect(hexagram.trigrams.upper).toBe(expectedUpper)
      expect(hexagram.trigrams.lower).toBe(expectedLower)
    }
  })

  it('verifies data consistency across all hexagrams', () => {
    const allHexagrams = mockHexagramDatabase.getAllHexagrams()
    
    allHexagrams.forEach((hexagram, index) => {
      expect(hexagram.number).toBe(index + 1)
      expect(mockHexagramDatabase.validateHexagramData(hexagram)).toBe(true)
      expect(hexagram.keywords).toHaveLength(2)
    })
  })
})