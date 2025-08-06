import { describe, it, expect } from 'vitest'

// Mock data validation utilities
const mockDataValidation = {
  validateHexagramData: (data: any) => {
    if (!data || typeof data !== 'object') return false
    if (!data.number || data.number < 1 || data.number > 64) return false
    if (!data.name || typeof data.name !== 'string') return false
    return true
  },
  
  validateUserInput: (input: any) => {
    if (input === null || input === undefined) return false
    if (typeof input === 'string' && input.trim().length === 0) return false
    return true
  },
  
  sanitizeInput: (input: string) => {
    if (typeof input !== 'string') return ''
    return input.replace(/[<>\"'&]/g, '').trim()
  },
  
  validateEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

describe('Data Validation Utils', () => {
  it('validates hexagram data structure', () => {
    const validData = { number: 1, name: 'Test Hexagram', meaning: 'Test' }
    const invalidData1 = { number: 65, name: 'Invalid' }
    const invalidData2 = { number: 1 }
    
    expect(mockDataValidation.validateHexagramData(validData)).toBe(true)
    expect(mockDataValidation.validateHexagramData(invalidData1)).toBe(false)
    expect(mockDataValidation.validateHexagramData(invalidData2)).toBe(false)
    expect(mockDataValidation.validateHexagramData(null)).toBe(false)
  })

  it('validates user input', () => {
    expect(mockDataValidation.validateUserInput('valid input')).toBe(true)
    expect(mockDataValidation.validateUserInput(123)).toBe(true)
    expect(mockDataValidation.validateUserInput(true)).toBe(true)
    expect(mockDataValidation.validateUserInput('')).toBe(false)
    expect(mockDataValidation.validateUserInput('   ')).toBe(false)
    expect(mockDataValidation.validateUserInput(null)).toBe(false)
    expect(mockDataValidation.validateUserInput(undefined)).toBe(false)
  })

  it('sanitizes input strings', () => {
    expect(mockDataValidation.sanitizeInput('normal text')).toBe('normal text')
    expect(mockDataValidation.sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script')
    expect(mockDataValidation.sanitizeInput('  trimmed  ')).toBe('trimmed')
    expect(mockDataValidation.sanitizeInput(123 as any)).toBe('')
  })

  it('validates email addresses', () => {
    expect(mockDataValidation.validateEmail('test@example.com')).toBe(true)
    expect(mockDataValidation.validateEmail('user.name@domain.co.jp')).toBe(true)
    expect(mockDataValidation.validateEmail('invalid.email')).toBe(false)
    expect(mockDataValidation.validateEmail('@example.com')).toBe(false)
    expect(mockDataValidation.validateEmail('test@')).toBe(false)
  })
})