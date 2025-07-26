/**
 * Animations Utilities
 * アニメーション関連のユーティリティ関数
 */

window.AnimationUtils = {
  /**
   * 要素のフェードイン
   * @param {Element} element - 対象要素
   * @param {number} duration - アニメーション時間（ミリ秒）
   * @returns {Promise}
   */
  fadeIn(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.display = 'block';
      
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  },

  /**
   * 要素のフェードアウト
   * @param {Element} element - 対象要素
   * @param {number} duration - アニメーション時間（ミリ秒）
   * @returns {Promise}
   */
  fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.display = 'none';
        resolve();
      }, duration);
    });
  },

  /**
   * スライドイン（上から）
   * @param {Element} element - 対象要素
   * @param {number} duration - アニメーション時間（ミリ秒）
   * @returns {Promise}
   */
  slideInFromTop(element, duration = 300) {
    return new Promise((resolve) => {
      element.style.transform = 'translateY(-20px)';
      element.style.opacity = '0';
      element.style.transition = `all ${duration}ms ease`;
      element.style.display = 'block';
      
      requestAnimationFrame(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  },

  /**
   * パルスエフェクト
   * @param {Element} element - 対象要素
   * @param {number} duration - パルス時間（ミリ秒）
   */
  pulse(element, duration = 1000) {
    element.style.animation = `pulse ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }
};