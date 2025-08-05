/**
 * TouchGestureHandler.js
 * タッチジェスチャー管理クラス
 * スワイプ、タップ、長押しなどのジェスチャーを検出・処理
 */

class TouchGestureHandler {
  constructor(element, options = {}) {
    /**
     * 目的：
     * - タッチジェスチャーの検出と処理
     * - スワイプナビゲーションの実装
     * - タッチフィードバックの提供
     * 
     * 入力：
     * - element: 監視対象のDOM要素
     * - options: 設定オプション
     *   - swipeThreshold: スワイプ判定の最小距離（デフォルト: 50px）
     *   - swipeVelocity: スワイプ判定の最小速度（デフォルト: 0.3）
     *   - longPressDelay: 長押し判定時間（デフォルト: 500ms）
     * 
     * 処理内容：
     * 1. タッチイベントの登録
     * 2. ジェスチャーの検出
     * 3. コールバック関数の実行
     * 
     * 副作用：
     * - DOM要素へのイベントリスナー追加
     * - タッチ時の視覚的フィードバック
     */
    
    this.element = element;
    this.options = {
      swipeThreshold: 50,
      swipeVelocity: 0.3,
      longPressDelay: 500,
      preventScroll: false,
      ...options
    };
    
    // タッチ状態管理
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchEndTime = 0;
    this.isMoving = false;
    this.longPressTimer = null;
    
    // コールバック管理
    this.callbacks = {
      swipeLeft: null,
      swipeRight: null,
      swipeUp: null,
      swipeDown: null,
      tap: null,
      longPress: null,
      pinchIn: null,
      pinchOut: null
    };
    
    // マルチタッチ管理
    this.touches = new Map();
    this.initialPinchDistance = 0;
    
    // イベントバインディング
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    
    this.init();
  }
  
  /**
   * 初期化処理
   */
  init() {
    // パッシブリスナーのサポート確認
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    
    // タッチイベントの登録
    const listenerOptions = passiveSupported ? { passive: !this.options.preventScroll } : false;
    
    this.element.addEventListener('touchstart', this.handleTouchStart, listenerOptions);
    this.element.addEventListener('touchmove', this.handleTouchMove, listenerOptions);
    this.element.addEventListener('touchend', this.handleTouchEnd, listenerOptions);
    this.element.addEventListener('touchcancel', this.handleTouchCancel, listenerOptions);
    
    // マウスイベントもサポート（デバッグ用）
    if (this.options.supportMouse) {
      this.element.addEventListener('mousedown', this.handleMouseAsTouch);
      this.element.addEventListener('mousemove', this.handleMouseAsTouch);
      this.element.addEventListener('mouseup', this.handleMouseAsTouch);
    }
  }
  
  /**
   * タッチ開始ハンドラー
   */
  handleTouchStart(e) {
    const touch = e.touches[0];
    
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isMoving = false;
    
    // マルチタッチ対応
    if (e.touches.length > 1) {
      this.handleMultiTouch(e);
    }
    
    // 長押し検出タイマー開始
    this.longPressTimer = setTimeout(() => {
      if (!this.isMoving && this.callbacks.longPress) {
        this.callbacks.longPress({
          x: this.touchStartX,
          y: this.touchStartY,
          target: e.target
        });
        
        // 触覚フィードバック（対応デバイスのみ）
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }, this.options.longPressDelay);
    
    // 視覚的フィードバック
    this.addTouchFeedback(e.target);
  }
  
  /**
   * タッチ移動ハンドラー
   */
  handleTouchMove(e) {
    if (!this.touchStartTime) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    // 移動判定（5px以上で移動とみなす）
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      this.isMoving = true;
      this.clearLongPressTimer();
    }
    
    // マルチタッチ処理
    if (e.touches.length > 1) {
      this.handleMultiTouch(e);
    }
    
    // スクロール防止（オプション）
    if (this.options.preventScroll && this.isMoving) {
      e.preventDefault();
    }
  }
  
  /**
   * タッチ終了ハンドラー
   */
  handleTouchEnd(e) {
    if (!this.touchStartTime) return;
    
    this.clearLongPressTimer();
    
    // 最後のタッチ位置を記録
    const touch = e.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
    this.touchEndTime = Date.now();
    
    // ジェスチャー判定
    this.detectGesture();
    
    // 視覚的フィードバック削除
    this.removeTouchFeedback(e.target);
    
    // リセット
    this.resetTouch();
  }
  
  /**
   * タッチキャンセルハンドラー
   */
  handleTouchCancel(e) {
    this.clearLongPressTimer();
    this.removeTouchFeedback(e.target);
    this.resetTouch();
  }
  
  /**
   * ジェスチャー検出
   */
  detectGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const deltaTime = this.touchEndTime - this.touchStartTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;
    
    // タップ判定
    if (distance < 10 && deltaTime < 200) {
      if (this.callbacks.tap) {
        this.callbacks.tap({
          x: this.touchEndX,
          y: this.touchEndY,
          target: event.target
        });
      }
      return;
    }
    
    // スワイプ判定
    if (distance >= this.options.swipeThreshold && velocity >= this.options.swipeVelocity) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > absY) {
        // 水平スワイプ
        if (deltaX > 0 && this.callbacks.swipeRight) {
          this.callbacks.swipeRight({ distance: absX, velocity, deltaTime });
        } else if (deltaX < 0 && this.callbacks.swipeLeft) {
          this.callbacks.swipeLeft({ distance: absX, velocity, deltaTime });
        }
      } else {
        // 垂直スワイプ
        if (deltaY > 0 && this.callbacks.swipeDown) {
          this.callbacks.swipeDown({ distance: absY, velocity, deltaTime });
        } else if (deltaY < 0 && this.callbacks.swipeUp) {
          this.callbacks.swipeUp({ distance: absY, velocity, deltaTime });
        }
      }
    }
  }
  
  /**
   * マルチタッチ処理（ピンチジェスチャー）
   */
  handleMultiTouch(e) {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (this.initialPinchDistance === 0) {
        this.initialPinchDistance = distance;
      } else {
        const scale = distance / this.initialPinchDistance;
        
        if (scale > 1.2 && this.callbacks.pinchOut) {
          this.callbacks.pinchOut({ scale });
        } else if (scale < 0.8 && this.callbacks.pinchIn) {
          this.callbacks.pinchIn({ scale });
        }
      }
    }
  }
  
  /**
   * タッチフィードバック追加
   */
  addTouchFeedback(element) {
    element.classList.add('touch-active');
    element.style.transition = 'transform 0.1s ease';
    element.style.transform = 'scale(0.98)';
  }
  
  /**
   * タッチフィードバック削除
   */
  removeTouchFeedback(element) {
    element.classList.remove('touch-active');
    element.style.transform = '';
    
    // トランジション終了後にスタイルをクリア
    setTimeout(() => {
      element.style.transition = '';
    }, 100);
  }
  
  /**
   * 長押しタイマークリア
   */
  clearLongPressTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }
  
  /**
   * タッチ状態リセット
   */
  resetTouch() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchEndTime = 0;
    this.isMoving = false;
    this.initialPinchDistance = 0;
  }
  
  /**
   * コールバック登録
   */
  on(gesture, callback) {
    if (this.callbacks.hasOwnProperty(gesture)) {
      this.callbacks[gesture] = callback;
    } else {
      console.warn(`Unknown gesture: ${gesture}`);
    }
    return this;
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    
    this.clearLongPressTimer();
    this.callbacks = {};
    this.touches.clear();
  }
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TouchGestureHandler;
}