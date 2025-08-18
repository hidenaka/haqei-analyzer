/**
 * phrasing.js - フォールバック表現とテキスト生成ユーティリティ
 * HaQei Triple OS Analysis System
 */

'use strict';

/**
 * システム全体で使用されるフォールバック表現
 * 各コンポーネントがエラー時や初期化前に使用
 */
const fallbackExpressions = {
  loading: '読み込み中...',
  processing: '処理中...',
  error: 'エラーが発生しました',
  noData: 'データがありません',
  incomplete: '不完全なデータ',
  defaultTitle: 'HaQei分析',
  defaultDescription: '分析結果の概要',
  defaultSummary: '分析結果の要約が表示されます',
  defaultInteraction: '相互作用の分析結果',
  defaultPrediction: '将来の予測は現在利用できません'
};

/**
 * テキスト生成ユーティリティ関数
 * @param {string} type - 生成するテキストのタイプ
 * @param {Object} data - テキスト生成に使用するデータ
 * @returns {string} - 生成されたテキスト
 */
function generateText(type, data = {}) {
  try {
    switch (type) {
      case 'greeting':
        return `こんにちは、${data.name || ''}さん`;
      case 'summary':
        return `分析結果: ${data.result || fallbackExpressions.defaultSummary}`;
      case 'interaction':
        return data.description || fallbackExpressions.defaultInteraction;
      case 'prediction':
        return data.forecast || fallbackExpressions.defaultPrediction;
      default:
        return fallbackExpressions.defaultDescription;
    }
  } catch (e) {
    console.error(`Text generation error(${type})`, e);
    return fallbackExpressions.error;
  }
}

// グローバル公開
window.fallbackExpressions = fallbackExpressions;
window.generateText = generateText;