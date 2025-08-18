/**
 * phase-description.test.js - フェーズ説明文生成モジュールのテスト
 */

import { generatePhaseDescription } from '../core/phase-description.js';

test('予測トーン', () => {
  const hexagramData = {
    キーワード: ['交流', '発展', '協力'],
    現代解釈の要約: 'これは現代的な解釈の要約です。',
    S7_総合評価スコア: 32
  };
  
  const osData = { score: 10 };
  
  const result = generatePhaseDescription(hexagramData, osData, 'act');
  
  // 予測トーンを含むことを検証
  expect(result.prediction).toMatch(/予測|見込まれ/);
});

test('フォールバック説明文の生成', () => {
  // 無効な入力でフォールバックが生成されることを検証
  const result = generatePhaseDescription(null, null, 'current');
  
  expect(result).toBeDefined();
  expect(result.description).toBeDefined();
  expect(result.prediction).toMatch(/予測|見込まれ/);
});

test('パフォーマンス計測', () => {
  const hexagramData = {
    キーワード: ['交流', '発展', '協力'],
    現代解釈の要約: 'これは現代的な解釈の要約です。',
    S7_総合評価スコア: 32
  };
  
  const osData = { score: 10 };
  
  const result = generatePhaseDescription(hexagramData, osData, 'current');
  
  // パフォーマンス計測が含まれていることを検証
  expect(result.generationTime).toBeGreaterThanOrEqual(0);
});

test('異なるフェーズタイプの生成', () => {
  const hexagramData = {
    キーワード: ['交流', '発展', '協力'],
    現代解釈の要約: 'これは現代的な解釈の要約です。',
    S7_総合評価スコア: 32
  };
  
  const osData = { score: 10 };
  
  const current = generatePhaseDescription(hexagramData, osData, 'current');
  const future = generatePhaseDescription(hexagramData, osData, 'future');
  const potential = generatePhaseDescription(hexagramData, osData, 'potential');
  const act = generatePhaseDescription(hexagramData, osData, 'act');
  
  // 各フェーズタイプで異なる説明文が生成されることを検証
  expect(current.description).not.toEqual(future.description);
  expect(current.description).not.toEqual(potential.description);
  expect(current.description).not.toEqual(act.description);
  
  // すべてのフェーズタイプで予測トーンを含むことを検証
  expect(current.prediction).toMatch(/予測|見込まれ/);
  expect(future.prediction).toMatch(/予測|見込まれ/);
  expect(potential.prediction).toMatch(/予測|見込まれ/);
  expect(act.prediction).toMatch(/予測|見込まれ/);
});