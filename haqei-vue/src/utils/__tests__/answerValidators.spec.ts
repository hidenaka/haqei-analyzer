/**
 * 回答バリデーターのユニットテスト
 */

import { describe, it, expect } from 'vitest'
import {
  validateQuestionAnswer,
  validateScenarioAnswer,
  validateAnswerSet,
  validateEightDimensionVector,
  validateHexagramData,
  validateMatchResult,
  validateInput,
  sanitizeInput
} from '../answerValidators'

describe('validateQuestionAnswer', () => {
  it('有効な回答を検証できる', () => {
    const answer = {
      questionId: 'q1',
      selectedValue: 'A',
      timestamp: Date.now()
    }
    const result = validateQuestionAnswer(answer)
    expect(result.isValid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('questionIdがない場合エラーを返す', () => {
    const answer = {
      selectedValue: 'A',
      timestamp: Date.now()
    }
    const result = validateQuestionAnswer(answer)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('質問ID')
  })

  it('selectedValueがない場合エラーを返す', () => {
    const answer = {
      questionId: 'q1',
      timestamp: Date.now()
    }
    const result = validateQuestionAnswer(answer)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('選択された値')
  })
})

describe('validateScenarioAnswer', () => {
  it('通常の質問の回答を検証できる', () => {
    const answer = {
      questionId: 'q1',
      selectedValue: 'A',
      timestamp: Date.now()
    }
    const result = validateScenarioAnswer(answer)
    expect(result.isValid).toBe(true)
  })

  it('シナリオ質問の有効な回答を検証できる', () => {
    const answer = {
      questionId: 'q25',
      selectedValue: 'A|B',
      timestamp: Date.now()
    }
    const result = validateScenarioAnswer(answer)
    expect(result.isValid).toBe(true)
  })

  it('シナリオ質問で形式が不正な場合エラーを返す', () => {
    const answer = {
      questionId: 'q25',
      selectedValue: 'A',
      timestamp: Date.now()
    }
    const result = validateScenarioAnswer(answer)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('inner|outer')
  })
})

describe('validateAnswerSet', () => {
  it('有効な回答セットを検証できる', () => {
    const answers = [
      { questionId: 'q1', selectedValue: 'A', timestamp: Date.now() },
      { questionId: 'q2', selectedValue: 'B', timestamp: Date.now() }
    ]
    const result = validateAnswerSet(answers)
    expect(result.isValid).toBe(true)
  })

  it('空の配列の場合エラーを返す', () => {
    const result = validateAnswerSet([])
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('回答が1つもありません')
  })

  it('重複する質問IDがある場合エラーを返す', () => {
    const answers = [
      { questionId: 'q1', selectedValue: 'A', timestamp: Date.now() },
      { questionId: 'q1', selectedValue: 'B', timestamp: Date.now() }
    ]
    const result = validateAnswerSet(answers)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('重複する質問ID')
  })

  it('未完了の場合警告を含む', () => {
    const answers = [
      { questionId: 'q1', selectedValue: 'A', timestamp: Date.now() }
    ]
    const result = validateAnswerSet(answers)
    expect(result.isValid).toBe(true)
    expect(result.warnings).toBeDefined()
    expect(result.warnings![0]).toContain('未回答')
  })
})

describe('validateEightDimensionVector', () => {
  it('有効な8次元ベクトルを検証できる', () => {
    const vector = {
      '乾_創造性': 10,
      '震_行動性': 20,
      '坎_探求性': 15,
      '艮_安定性': 25,
      '坤_受容性': 30,
      '巽_適応性': 18,
      '離_表現性': 22,
      '兌_調和性': 12
    }
    const result = validateEightDimensionVector(vector)
    expect(result.isValid).toBe(true)
  })

  it('必要な次元が欠けている場合エラーを返す', () => {
    const vector = {
      '乾_創造性': 10,
      '震_行動性': 20
    }
    const result = validateEightDimensionVector(vector)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('必要な次元')
  })

  it('値が数値でない場合エラーを返す', () => {
    const vector = {
      '乾_創造性': 'invalid',
      '震_行動性': 20,
      '坎_探求性': 15,
      '艮_安定性': 25,
      '坤_受容性': 30,
      '巽_適応性': 18,
      '離_表現性': 22,
      '兌_調和性': 12
    }
    const result = validateEightDimensionVector(vector)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('数値ではありません')
  })
})

describe('validateHexagramData', () => {
  it('有効な64卦データを検証できる', () => {
    const hexagram = {
      hexagram_id: 1,
      name_jp: '乾',
      reading: 'けん',
      catchphrase: '天の創造力'
    }
    const result = validateHexagramData(hexagram)
    expect(result.isValid).toBe(true)
  })

  it('hexagram_idが範囲外の場合エラーを返す', () => {
    const hexagram = {
      hexagram_id: 65,
      name_jp: '乾',
      reading: 'けん',
      catchphrase: '天の創造力'
    }
    const result = validateHexagramData(hexagram)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('1から64')
  })
})

describe('validateInput', () => {
  it('有効な文字列を検証できる', () => {
    const result = validateInput('test', 'string')
    expect(result.isValid).toBe(true)
  })

  it('空白のみの文字列はエラーを返す', () => {
    const result = validateInput('   ', 'string')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('空白のみ')
  })

  it('有効なメールアドレスを検証できる', () => {
    const result = validateInput('test@example.com', 'email')
    expect(result.isValid).toBe(true)
  })

  it('無効なメールアドレスはエラーを返す', () => {
    const result = validateInput('invalid-email', 'email')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('メールアドレス')
  })
})

describe('sanitizeInput', () => {
  it('HTMLタグをエスケープできる', () => {
    const input = '<script>alert("XSS")</script>'
    const sanitized = sanitizeInput(input)
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;')
  })

  it('特殊文字をエスケープできる', () => {
    const input = '"Hello" & \'World\''
    const sanitized = sanitizeInput(input)
    expect(sanitized).toContain('&quot;')
    expect(sanitized).toContain('&#x27;')
  })
})