/**
 * phase-description.test.js - フェーズ説明文生成モジュールのテスト
 * HaQei Triple OS Analysis System
 */

'use strict';

import { generatePhaseDescription } from '../js/core/phase-description.js';
import { fallbackExpressions } from '../js/core/phrasing.js';

describe('PhaseDescription', () => {
  // モックデータ
  const mockHexagramData = {
    キーワード: ['創造', '行動', '発展'],
    現代解釈の要約: 'これは現代的な解釈のサンプルテキストです。',
    S7_総合評価スコア: 0.75
  };
  
  const mockOSData = {
    score: 0.8
  };
  
  test('generatePhaseDescription returns valid object for current phase', () => {
    const result = generatePhaseDescription(mockHexagramData, mockOSData, 'current');
    
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.action).toBeDefined();
    expect(result.keywords).toEqual(['創造', '行動', '発展']);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.phaseType).toBe('current');
  });
  
  test('generatePhaseDescription returns valid object for future phase', () => {
    const result = generatePhaseDescription(mockHexagramData, mockOSData, 'future');
    
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.action).toBeDefined();
    expect(result.phaseType).toBe('future');
  });
  
  test('generatePhaseDescription handles invalid input', () => {
    const result = generatePhaseDescription(null, null, 'current');
    
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.keywords).toEqual([]);
    expect(result.score).toBe(0);
  });
  
  test('generatePhaseDescription handles errors gracefully', () => {
    // 意図的にエラーを発生させるモックデータ
    const badData = {
      キーワード: null,
      現代解釈の要約: null,
      S7_総合評価スコア: 'not a number'
    };
    
    const result = generatePhaseDescription(badData, mockOSData, 'current');
    
    expect(result).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.score).toBe(0);
  });
});