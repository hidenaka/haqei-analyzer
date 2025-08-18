/**
 * phase-description.js - フェーズ説明文生成モジュール
 * HaQei Triple OS Analysis System
 */

'use strict';

/**
 * フェーズ説明文を生成する
 * @param {Object} hexagramData - 易卦データ
 * @param {Object} osData - OS分析データ
 * @param {string} phaseType - フェーズタイプ (current, future, potential, act)
 * @returns {Object} - 生成された説明文オブジェクト
 */
function generatePhaseDescription(hexagramData, osData, phaseType = 'current') {
  const t0 = performance.now();
  
  try {
    // 入力検証
    if (!hexagramData || !osData) {
      console.warn('Invalid input for phase description generation');
      return createFallbackDescription(phaseType);
    }
    
    // 基本情報の抽出
    const keywords = hexagramData.キーワード || [];
    const summary = hexagramData.現代解釈の要約 || '';
    const score = hexagramData.S7_総合評価スコア || 0;
    const osScore = osData.score || 0;
    
    // フェーズタイプに基づいた説明文の生成
    let description = '';
    let prediction = '';
    let action = '';
    
    switch (phaseType) {
      case 'current':
        description = generateCurrentPhaseText(keywords, summary, score);
        prediction = generatePredictionText(keywords, score, osScore);
        action = generateActionText(keywords, score, osScore);
        break;
      case 'future':
        description = generateFuturePhaseText(keywords, summary, score);
        prediction = generatePredictionText(keywords, score, osScore, true);
        action = generateActionText(keywords, score, osScore, true);
        break;
      case 'potential':
        description = generatePotentialPhaseText(keywords, summary, score);
        prediction = generatePredictionText(keywords, score, osScore, false, true);
        action = generateActionText(keywords, score, osScore, false, true);
        break;
      case 'act':
        description = generateActionPhaseText(keywords, summary, score);
        prediction = generatePredictionText(keywords, score, osScore, false, false, true);
        action = generateActionText(keywords, score, osScore, false, false, true);
        break;
      default:
        description = generateCurrentPhaseText(keywords, summary, score);
        prediction = generatePredictionText(keywords, score, osScore);
        action = generateActionText(keywords, score, osScore);
    }
    
    const result = {
      description,
      prediction,
      action,
      keywords: keywords.slice(0, 3),
      score: normalizeScore(score),
      osScore: normalizeScore(osScore),
      phaseType,
      generationTime: Math.round(performance.now() - t0)
    };
    
    console.log(`[PhaseDescription] generated(${phaseType})(ms)=`, result.generationTime);
    return result;
    
  } catch (e) {
    console.error(`Phase description generation error(${phaseType})`, e);
    return createFallbackDescription(phaseType);
  }
}

/**
 * 現在フェーズの説明文を生成
 */
function generateCurrentPhaseText(keywords, summary, score) {
  const keywordText = keywords.length > 0 ? keywords.slice(0, 3).join('、') : '特徴的な要素';
  return `現在のフェーズは「${keywordText}」を特徴としています。${summary.substring(0, 100)}...`;
}

/**
 * 未来フェーズの説明文を生成
 */
function generateFuturePhaseText(keywords, summary, score) {
  const keywordText = keywords.length > 0 ? keywords.slice(0, 3).join('、') : '特徴的な要素';
  return `将来のフェーズでは「${keywordText}」が重要になります。${summary.substring(0, 100)}...`;
}

/**
 * 潜在フェーズの説明文を生成
 */
function generatePotentialPhaseText(keywords, summary, score) {
  const keywordText = keywords.length > 0 ? keywords.slice(0, 3).join('、') : '潜在的な要素';
  return `潜在的なフェーズとして「${keywordText}」の可能性があります。${summary.substring(0, 100)}...`;
}

/**
 * 行動フェーズの説明文を生成
 */
function generateActionPhaseText(keywords, summary, score) {
  const keywordText = keywords.length > 0 ? keywords.slice(0, 3).join('、') : '行動要素';
  return `行動フェーズでは「${keywordText}」が鍵となります。${summary.substring(0, 100)}...`;
}

/**
 * 予測テキストを生成（予測トーンを含む）
 */
function generatePredictionText(keywords, score, osScore, isFuture = false, isPotential = false, isAction = false) {
  // 予測トーンを含む表現を使用
  const predictionPhrases = [
    '今後は〜が見込まれます',
    '将来的には〜になると予測されます',
    '〜の傾向が予測されます',
    '〜へと発展することが見込まれます',
    '〜という結果が予測されます'
  ];
  
  const randomIndex = Math.floor(Math.random() * predictionPhrases.length);
  const predictionPhrase = predictionPhrases[randomIndex];
  
  let keyword = keywords.length > 0 ? keywords[0] : '状況の変化';
  
  if (isFuture) {
    return predictionPhrase.replace('〜', `${keyword}による新たな展開`);
  } else if (isPotential) {
    return predictionPhrase.replace('〜', `${keyword}の潜在的な影響`);
  } else if (isAction) {
    return predictionPhrase.replace('〜', `${keyword}に基づく行動の結果`);
  } else {
    return predictionPhrase.replace('〜', `${keyword}を中心とした展開`);
  }
}

/**
 * 行動テキストを生成
 */
function generateActionText(keywords, score, osScore, isFuture = false, isPotential = false, isAction = false) {
  let keyword = keywords.length > 0 ? keywords[0] : '状況';
  
  if (isFuture) {
    return `${keyword}に対して準備を進めることが重要です。`;
  } else if (isPotential) {
    return `${keyword}の可能性を活かす行動を検討してください。`;
  } else if (isAction) {
    return `${keyword}を意識した具体的なステップを踏みましょう。`;
  } else {
    return `${keyword}を活かした行動が効果的です。`;
  }
}

/**
 * スコアを0-100の範囲に正規化
 */
function normalizeScore(score) {
  if (typeof score !== 'number') return 50;
  return Math.max(0, Math.min(100, score * 10));
}

/**
 * フォールバック説明文を生成
 */
function createFallbackDescription(phaseType) {
  return {
    description: `${phaseType}フェーズの説明`,
    prediction: '今後の展開が見込まれます', // 予測トーンを含む
    action: '状況に応じた行動をとることが推奨されます',
    keywords: ['分析', '理解', '行動'],
    score: 50,
    osScore: 50,
    phaseType,
    generationTime: 0
  };
}

// グローバル公開
window.generatePhaseDescription = generatePhaseDescription;