/**
 * offline-kuromoji-integration.js - Integration Patch for Future Simulator
 * HAQEI Future Simulator - Offline Dictionary Integration
 * 
 * 目的:
 * - future_simulator.htmlとオフライン辞書システムの統合
 * - 既存コードとの互換性確保
 * - グローバル変数の適切な管理
 * 
 * 使用方法:
 * future_simulator.htmlで読み込み、initializeOfflineFirstKuromoji()を呼び出し
 */

// グローバル変数の拡張
if (typeof window !== 'undefined') {
  window.offlineKuromojiInitializer = null;
}

/**
 * オフライン優先kuromoji初期化（メイン関数）
 * future_simulator.htmlから呼び出される
 */
async function initializeOfflineFirstKuromoji() {
  try {
    console.log('🚀 Offline-First Kuromoji initialization starting...');
    
    // OfflineKuromojiInitializerが利用可能かチェック
    if (typeof OfflineKuromojiInitializer === 'undefined') {
      console.warn('⚠️ OfflineKuromojiInitializer not loaded, falling back to legacy system');
      return await initializeKuromojiWithFallback();
    }
    
    // オフライン初期化システムの作成
    if (!window.offlineKuromojiInitializer) {
      window.offlineKuromojiInitializer = new OfflineKuromojiInitializer();
    }
    
    // 初期化の実行
    const tokenizer = await window.offlineKuromojiInitializer.initialize({
      showProgress: true
    });
    
    if (tokenizer) {
      // グローバル変数に設定
      window.kuromojiTokenizer = tokenizer;
      
      const status = window.offlineKuromojiInitializer.getStatus();
      console.log('✅ Offline-first kuromoji initialization completed:', status);
      
      // ユーザーへの通知
      if (typeof showNotification === 'function') {
        showNotification(
          '🧠 AI言語解析エンジンが準備完了しました',
          `${status.tokenizerSource} 辞書を使用しています`,
          'success'
        );
      }
      
      return tokenizer;
    } else {
      throw new Error('Tokenizer initialization failed');
    }
    
  } catch (error) {
    console.error('❌ Offline-first initialization failed:', error);
    
    // レガシーシステムへのフォールバック
    console.log('🔄 Falling back to legacy kuromoji initialization...');
    
    if (typeof initializeKuromojiWithFallback === 'function') {
      return await initializeKuromojiWithFallback();
    } else {
      // 最終フォールバック
      return await createEmergencyTokenizer();
    }
  }
}

/**
 * 緊急時の最小限トークナイザー作成
 */
async function createEmergencyTokenizer() {
  console.log('🚨 Creating emergency tokenizer as final fallback');
  
  const emergencyTokenizer = {
    tokenize: (text) => {
      // 基本的な文字分割
      const words = text.match(/[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF\\w]+/g) || [];
      return words.map((word, index) => ({
        surface_form: word,
        pos: '名詞',
        pos_detail_1: '*',
        pos_detail_2: '*',
        pos_detail_3: '*',
        conjugated_type: '*',
        conjugated_form: '*',
        basic_form: word,
        reading: word,
        pronunciation: word,
        word_id: index,
        word_type: 'UNKNOWN',
        word_position: index
      }));
    },
    isEmergency: true,
    source: 'emergency'
  };
  
  window.kuromojiTokenizer = emergencyTokenizer;
  console.log('✅ Emergency tokenizer created');
  
  return emergencyTokenizer;
}

/**
 * 辞書システムの状態確認
 */
function getDictionarySystemStatus() {
  const status = {
    hasOfflineSystem: typeof OfflineKuromojiInitializer !== 'undefined',
    hasInitializer: !!window.offlineKuromojiInitializer,
    hasTokenizer: !!window.kuromojiTokenizer,
    tokenizerType: 'none'
  };
  
  if (window.kuromojiTokenizer) {
    if (window.kuromojiTokenizer.isEmergency) {
      status.tokenizerType = 'emergency';
    } else if (window.kuromojiTokenizer.isFallback) {
      status.tokenizerType = 'fallback';
    } else if (window.kuromojiTokenizer.isLocal) {
      status.tokenizerType = 'local';
    } else {
      status.tokenizerType = 'cdn';
    }
  }
  
  if (window.offlineKuromojiInitializer) {
    const initializerStatus = window.offlineKuromojiInitializer.getStatus();
    status.initializerStatus = initializerStatus;
  }
  
  return status;
}

/**
 * ユーザー向け通知システム（簡易版）
 */
function showNotification(title, message, type = 'info') {
  console.log(`📢 ${title}: ${message}`);
  
  // 簡易的なトースト通知（CSSが必要）
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class=\"notification-content\">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  `;
  
  document.body.appendChild(notification);
  
  // 5秒後に自動削除
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// グローバル関数としてエクスポート
if (typeof window !== 'undefined') {
  window.initializeOfflineFirstKuromoji = initializeOfflineFirstKuromoji;
  window.getDictionarySystemStatus = getDictionarySystemStatus;
  window.showNotification = showNotification;
}

console.log('🔧 Offline Kuromoji Integration loaded');