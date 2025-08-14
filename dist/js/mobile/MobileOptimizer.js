/**
 * Mobile Optimizer - Comprehensive Mobile Experience Enhancement
 * モバイル体験の包括的最適化システム
 * 
 * @class MobileOptimizer
 * @version 1.0.0
 * @date 2025-08-12
 */

class MobileOptimizer {
    constructor() {
        this.deviceInfo = null;
        this.touchSupport = false;
        this.orientationSupport = false;
        this.performanceMode = 'auto';
        this.gestureManager = null;
        this.viewportManager = null;
        
        // モバイルブレークポイント定義
        this.breakpoints = {
            xs: 320,   // iPhone SE
            sm: 375,   // iPhone 12/13/14
            md: 414,   // iPhone Plus/Max
            lg: 768,   // iPad Mini
            xl: 1024,  // iPad
            xxl: 1440  // Desktop
        };
        
        // デバイス固有設定
        this.deviceProfiles = {
            'iPhone SE': { width: 320, height: 568, density: 2 },
            'iPhone 12': { width: 390, height: 844, density: 3 },
            'iPhone 14 Pro': { width: 393, height: 852, density: 3 },
            'iPhone 14 Plus': { width: 428, height: 926, density: 3 },
            'iPad Mini': { width: 768, height: 1024, density: 2 },
            'iPad Air': { width: 820, height: 1180, density: 2 }
        };
        
        // パフォーマンス設定
        this.performanceSettings = {
            low: {
                animations: false,
                transitions: false,
                backgroundEffects: false,
                heavyInteractions: false
            },
            medium: {
                animations: true,
                transitions: true,
                backgroundEffects: false,
                heavyInteractions: false
            },
            high: {
                animations: true,
                transitions: true,
                backgroundEffects: true,
                heavyInteractions: true
            }
        };
        
        this.init();
    }
    
    /**
     * 初期化
     */
    async init() {
        console.log('Mobile Optimizer initializing...');
        
        // デバイス情報検出
        this.detectDevice();
        
        // タッチサポート確認
        this.detectTouchSupport();
        
        // ビューポート管理初期化
        this.initializeViewportManager();
        
        // ジェスチャー管理初期化
        this.initializeGestureManager();
        
        // パフォーマンス最適化
        this.optimizePerformance();
        
        // イベントリスナー設定
        this.setupEventListeners();
        
        // 初期レイアウト調整
        this.adjustInitialLayout();
        
        console.log('Mobile Optimizer initialized:', {
            device: this.deviceInfo,
            touchSupport: this.touchSupport,
            performanceMode: this.performanceMode
        });
    }
    
    /**
     * デバイス情報を検出
     */
    detectDevice() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        this.deviceInfo = {
            userAgent: userAgent,
            platform: platform,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            devicePixelRatio: devicePixelRatio,
            isIOS: /iPad|iPhone|iPod/.test(userAgent),
            isAndroid: /Android/.test(userAgent),
            isMobile: /Mobi|Android/i.test(userAgent),
            isTablet: /(iPad|Android(?!.*Mobile))/.test(userAgent),
            orientation: window.screen.orientation?.type || 'unknown',
            connectionType: navigator.connection?.effectiveType || 'unknown',
            memorySize: navigator.deviceMemory || 'unknown',
            cores: navigator.hardwareConcurrency || 'unknown'
        };
        
        // デバイス固有の検出
        this.deviceInfo.deviceName = this.identifySpecificDevice();
        this.deviceInfo.category = this.categorizeDevice();
        
        // body要素にデバイスクラス追加
        document.body.classList.add(`device-${this.deviceInfo.category}`);
        if (this.deviceInfo.isIOS) document.body.classList.add('ios');
        if (this.deviceInfo.isAndroid) document.body.classList.add('android');
    }
    
    /**
     * 特定デバイスを識別
     */
    identifySpecificDevice() {
        const { screenWidth, screenHeight, devicePixelRatio } = this.deviceInfo;
        
        for (const [deviceName, profile] of Object.entries(this.deviceProfiles)) {
            if (Math.abs(screenWidth - profile.width) <= 2 && 
                Math.abs(devicePixelRatio - profile.density) <= 0.1) {
                return deviceName;
            }
        }
        
        return 'Unknown';
    }
    
    /**
     * デバイスカテゴリを分類
     */
    categorizeDevice() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.xs) return 'xs-mobile';
        if (width <= this.breakpoints.sm) return 'sm-mobile';
        if (width <= this.breakpoints.md) return 'md-mobile';
        if (width <= this.breakpoints.lg) return 'tablet';
        if (width <= this.breakpoints.xl) return 'large-tablet';
        
        return 'desktop';
    }
    
    /**
     * タッチサポートを検出
     */
    detectTouchSupport() {
        this.touchSupport = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
        
        if (this.touchSupport) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('no-touch');
        }
        
        // マウス・タッチの併用デバイス検出
        if (this.touchSupport && window.matchMedia('(pointer: fine)').matches) {
            document.body.classList.add('hybrid-device');
        }
    }
    
    /**
     * ビューポート管理を初期化
     */
    initializeViewportManager() {
        this.viewportManager = {
            initialHeight: window.innerHeight,
            currentHeight: window.innerHeight,
            isKeyboardOpen: false,
            
            // iOS Safari アドレスバー対応
            handleIOSViewport() {
                if (this.deviceInfo?.isIOS) {
                    // 100vh問題の解決
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                    
                    // SafeAreaサポート
                    if (CSS.supports('padding: env(safe-area-inset-top)')) {
                        document.body.classList.add('safe-area-supported');
                    }
                }
            },
            
            // キーボード表示検出
            detectKeyboard() {
                const currentHeight = window.innerHeight;
                const heightDifference = this.initialHeight - currentHeight;
                const threshold = 150; // 150px以上の変化でキーボード判定
                
                const wasKeyboardOpen = this.isKeyboardOpen;
                this.isKeyboardOpen = heightDifference > threshold;
                
                if (this.isKeyboardOpen !== wasKeyboardOpen) {
                    document.body.classList.toggle('keyboard-open', this.isKeyboardOpen);
                    
                    // カスタムイベント発火
                    const event = new CustomEvent('keyboardToggle', {
                        detail: { isOpen: this.isKeyboardOpen, heightDifference }
                    });
                    document.dispatchEvent(event);
                }
                
                this.currentHeight = currentHeight;
            }
        };
        
        this.viewportManager.handleIOSViewport.bind(this)();
    }
    
    /**
     * ジェスチャー管理を初期化
     */
    initializeGestureManager() {
        if (!this.touchSupport) return;
        
        this.gestureManager = {
            swipeThreshold: 50,
            tapThreshold: 300,
            doubleTapThreshold: 300,
            
            touches: [],
            lastTap: 0,
            
            // スワイプ検出
            detectSwipe(startTouch, endTouch) {
                const deltaX = endTouch.clientX - startTouch.clientX;
                const deltaY = endTouch.clientY - startTouch.clientY;
                
                if (Math.abs(deltaX) > this.swipeThreshold) {
                    const direction = deltaX > 0 ? 'right' : 'left';
                    this.dispatchGestureEvent('swipe', { direction, deltaX, deltaY });
                }
                
                if (Math.abs(deltaY) > this.swipeThreshold) {
                    const direction = deltaY > 0 ? 'down' : 'up';
                    this.dispatchGestureEvent('swipe', { direction, deltaX, deltaY });
                }
            },
            
            // ダブルタップ検出
            detectDoubleTap(touch) {
                const now = Date.now();
                if (now - this.lastTap < this.doubleTapThreshold) {
                    this.dispatchGestureEvent('doubletap', { 
                        x: touch.clientX, 
                        y: touch.clientY 
                    });
                }
                this.lastTap = now;
            },
            
            // ジェスチャーイベント発火
            dispatchGestureEvent(type, detail) {
                const event = new CustomEvent(`gesture-${type}`, { detail });
                document.dispatchEvent(event);
            }
        };
        
        // タッチイベントリスナー設定
        this.setupTouchEventListeners();
    }
    
    /**
     * タッチイベントリスナーを設定
     */
    setupTouchEventListeners() {
        let startTouch = null;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startTouch = e.touches[0];
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (startTouch && e.changedTouches.length === 1) {
                const endTouch = e.changedTouches[0];
                const touchDuration = Date.now() - startTouch.timestamp;
                
                // タップ検出
                if (touchDuration < this.gestureManager.tapThreshold) {
                    this.gestureManager.detectDoubleTap(endTouch);
                }
                
                // スワイプ検出
                this.gestureManager.detectSwipe(startTouch, endTouch);
                
                startTouch = null;
            }
        }, { passive: true });
        
        // ピンチズーム無効化（必要に応じて）
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault(); // ピンチズーム防止
            }
        }, { passive: false });
    }
    
    /**
     * パフォーマンス最適化
     */
    optimizePerformance() {
        // デバイス性能に基づくモード選択
        const { connectionType, memorySize, cores } = this.deviceInfo;
        
        if (memorySize <= 2 || cores <= 2 || connectionType === 'slow-2g') {
            this.performanceMode = 'low';
        } else if (memorySize <= 4 || cores <= 4 || ['2g', '3g'].includes(connectionType)) {
            this.performanceMode = 'medium';
        } else {
            this.performanceMode = 'high';
        }
        
        // パフォーマンス設定を適用
        this.applyPerformanceSettings();
        
        // CSSカスタムプロパティで設定を公開
        const settings = this.performanceSettings[this.performanceMode];
        Object.entries(settings).forEach(([key, value]) => {
            document.documentElement.style.setProperty(
                `--mobile-${key}`, 
                value ? '1' : '0'
            );
        });
    }
    
    /**
     * パフォーマンス設定を適用
     */
    applyPerformanceSettings() {
        const settings = this.performanceSettings[this.performanceMode];
        
        // アニメーション制御
        if (!settings.animations) {
            document.body.classList.add('reduce-animations');
        }
        
        // 背景エフェクト制御
        if (!settings.backgroundEffects) {
            document.body.classList.add('reduce-effects');
        }
        
        // 重いインタラクション制御
        if (!settings.heavyInteractions) {
            document.body.classList.add('reduce-interactions');
        }
        
        console.log(`Performance mode: ${this.performanceMode}`, settings);
    }
    
    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // リサイズイベント（デバウンス付き）
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // オリエンテーション変更
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                this.handleOrientationChange();
            });
        } else {
            window.addEventListener('orientationchange', () => {
                this.handleOrientationChange();
            });
        }
        
        // ページ表示状態
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // ネットワーク状態（対応ブラウザのみ）
        if (navigator.connection) {
            navigator.connection.addEventListener('change', () => {
                this.handleNetworkChange();
            });
        }
        
        // フォーカス管理
        window.addEventListener('focus', () => this.handleFocus(true));
        window.addEventListener('blur', () => this.handleFocus(false));
    }
    
    /**
     * リサイズハンドラー
     */
    handleResize() {
        // ビューポート高さ更新（iOS対応）
        if (this.deviceInfo.isIOS) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        // キーボード検出
        this.viewportManager.detectKeyboard();
        
        // デバイスカテゴリ更新
        const newCategory = this.categorizeDevice();
        if (newCategory !== this.deviceInfo.category) {
            document.body.classList.remove(`device-${this.deviceInfo.category}`);
            document.body.classList.add(`device-${newCategory}`);
            this.deviceInfo.category = newCategory;
        }
        
        // カスタムイベント発火
        const event = new CustomEvent('mobileResize', {
            detail: { 
                width: window.innerWidth, 
                height: window.innerHeight,
                category: this.deviceInfo.category
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * オリエンテーション変更ハンドラー
     */
    handleOrientationChange() {
        const newOrientation = screen.orientation?.type || 
            (window.innerHeight > window.innerWidth ? 'portrait-primary' : 'landscape-primary');
        
        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(newOrientation.includes('portrait') ? 'portrait' : 'landscape');
        
        // オリエンテーション変更後のレイアウト調整（遅延実行）
        setTimeout(() => {
            this.adjustLayoutForOrientation(newOrientation);
        }, 100);
        
        console.log('Orientation changed:', newOrientation);
    }
    
    /**
     * オリエンテーション用レイアウト調整
     */
    adjustLayoutForOrientation(orientation) {
        const isLandscape = orientation.includes('landscape');
        
        // Zone Dコンポーネントの調整
        const zoneDContainer = document.querySelector('.zone-d-integration');
        if (zoneDContainer) {
            zoneDContainer.classList.toggle('landscape-mode', isLandscape);
        }
        
        // 質問画面の調整
        const questionContainer = document.querySelector('.question-container');
        if (questionContainer && isLandscape) {
            questionContainer.style.maxHeight = '80vh';
            questionContainer.style.overflowY = 'auto';
        }
    }
    
    /**
     * 表示状態変更ハンドラー
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // バックグラウンドに移行：重いアニメーションを停止
            document.body.classList.add('background-mode');
        } else {
            // フォアグラウンドに復帰：アニメーションを再開
            document.body.classList.remove('background-mode');
            
            // レイアウトの再確認
            setTimeout(() => this.handleResize(), 100);
        }
    }
    
    /**
     * ネットワーク状態変更ハンドラー
     */
    handleNetworkChange() {
        const connection = navigator.connection;
        const connectionType = connection.effectiveType;
        
        // 接続状況に応じてパフォーマンスモードを調整
        if (['slow-2g', '2g'].includes(connectionType)) {
            this.performanceMode = 'low';
        } else if (connectionType === '3g') {
            this.performanceMode = 'medium';
        } else {
            this.performanceMode = 'high';
        }
        
        this.applyPerformanceSettings();
        console.log('Network changed:', connectionType, 'Performance mode:', this.performanceMode);
    }
    
    /**
     * フォーカス状態ハンドラー
     */
    handleFocus(hasFocus) {
        if (hasFocus) {
            document.body.classList.remove('app-blurred');
        } else {
            document.body.classList.add('app-blurred');
        }
    }
    
    /**
     * 初期レイアウト調整
     */
    adjustInitialLayout() {
        // フォントサイズ調整
        this.adjustFontSizes();
        
        // タッチターゲット調整
        this.adjustTouchTargets();
        
        // スクロール最適化
        this.optimizeScrolling();
        
        // 入力フィールド最適化
        this.optimizeInputFields();
    }
    
    /**
     * フォントサイズ調整
     */
    adjustFontSizes() {
        const category = this.deviceInfo.category;
        const baseFontSize = {
            'xs-mobile': '14px',
            'sm-mobile': '15px',
            'md-mobile': '16px',
            'tablet': '16px',
            'large-tablet': '17px',
            'desktop': '16px'
        };
        
        document.documentElement.style.setProperty(
            '--mobile-base-font-size', 
            baseFontSize[category] || '16px'
        );
    }
    
    /**
     * タッチターゲット調整
     */
    adjustTouchTargets() {
        if (!this.touchSupport) return;
        
        const minTouchTarget = 44; // iOSガイドライン
        
        // 小さなボタンやリンクを調整
        const interactiveElements = document.querySelectorAll(
            'button, a, input[type="button"], input[type="submit"], .clickable'
        );
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width < minTouchTarget || rect.height < minTouchTarget) {
                element.classList.add('touch-target-enhanced');
            }
        });
    }
    
    /**
     * スクロール最適化
     */
    optimizeScrolling() {
        // iOS慣性スクロール
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // スクロール可能要素の調整
        const scrollableElements = document.querySelectorAll('.scrollable, .overflow-auto');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }
    
    /**
     * 入力フィールド最適化
     */
    optimizeInputFields() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // iOS自動ズーム防止
            if (this.deviceInfo.isIOS) {
                if (input.style.fontSize && parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            }
            
            // 仮想キーボード最適化
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            });
        });
    }
    
    /**
     * Zone D モバイル最適化
     */
    optimizeZoneD() {
        const zoneDContainer = document.querySelector('.zone-d-integration');
        if (!zoneDContainer) return;
        
        // モバイルクラス追加
        zoneDContainer.classList.add('mobile-optimized');
        
        // コンポーネント間隔調整
        const components = zoneDContainer.querySelectorAll('.confidence-section, .feedback-section, .handoff-section');
        components.forEach(component => {
            component.classList.add('mobile-component');
        });
        
        // ハンドオフカードの調整
        const destinationCards = zoneDContainer.querySelectorAll('.destination-card');
        destinationCards.forEach(card => {
            card.classList.add('mobile-card');
        });
    }
    
    /**
     * デバイス情報を取得
     */
    getDeviceInfo() {
        return this.deviceInfo;
    }
    
    /**
     * パフォーマンスモードを設定
     */
    setPerformanceMode(mode) {
        if (this.performanceSettings[mode]) {
            this.performanceMode = mode;
            this.applyPerformanceSettings();
            console.log('Performance mode changed:', mode);
        }
    }
    
    /**
     * クリーンアップ
     */
    destroy() {
        // イベントリスナーの削除は省略（通常はページ終了時のみ）
        console.log('Mobile Optimizer destroyed');
    }
    
    /**
     * ユーティリティ: デバウンス
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// グローバル初期化
if (typeof window !== 'undefined') {
    window.mobileOptimizer = new MobileOptimizer();
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileOptimizer;
}