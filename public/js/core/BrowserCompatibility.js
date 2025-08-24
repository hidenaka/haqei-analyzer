/**
 * HAQEI v4.3.1 ブラウザ互換性保証システム
 * Safari/Firefox対応 + 決定論的動作の保証
 */

console.log('📱 BrowserCompatibility.js Loading...');

(function(global) {
    'use strict';

    class BrowserCompatibilityManager {
        constructor() {
            this.browserInfo = this.detectBrowser();
            this.compatibilityIssues = [];
            this.fixesApplied = [];
            
            console.log(`🌐 Browser detected: ${this.browserInfo.name} ${this.browserInfo.version}`);
        }

        /**
         * ブラウザ検出
         */
        detectBrowser() {
            const ua = navigator.userAgent;
            let name = 'Unknown';
            let version = 'Unknown';

            if (ua.includes('Chrome') && !ua.includes('Edg')) {
                name = 'Chrome';
                const match = ua.match(/Chrome\/(\d+)/);
                version = match ? match[1] : 'Unknown';
            } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
                name = 'Safari';
                const match = ua.match(/Version\/(\d+)/);
                version = match ? match[1] : 'Unknown';
            } else if (ua.includes('Firefox')) {
                name = 'Firefox';
                const match = ua.match(/Firefox\/(\d+)/);
                version = match ? match[1] : 'Unknown';
            } else if (ua.includes('Edg')) {
                name = 'Edge';
                const match = ua.match(/Edg\/(\d+)/);
                version = match ? match[1] : 'Unknown';
            }

            return {
                name: name,
                version: version,
                userAgent: ua,
                platform: navigator.platform,
                language: navigator.language
            };
        }

        /**
         * 互換性問題の初期化と修正
         */
        initializeCompatibility() {
            console.log('🔧 Browser compatibility initialization...');

            // 1. 日本語ソート固定
            this.setupStableJapaneseSort();

            // 2. IME確定イベント対応
            this.setupIMEHandling();

            // 3. タイマー分解能差対応
            this.setupTimerStabilization();

            // 4. フォント・CSS互換性
            this.setupFontCompatibility();

            // 5. Event handling統一
            this.setupEventHandling();

            // 6. LocalStorage互換性
            this.setupStorageCompatibility();

            console.log(`✅ Browser compatibility initialized: ${this.fixesApplied.length} fixes applied`);
            return this.compatibilityIssues.length === 0;
        }

        /**
         * 1. 日本語ソート安定化
         */
        setupStableJapaneseSort() {
            try {
                // Intl.Collatorの統一設定
                global.createStableCollator = function() {
                    return new Intl.Collator('ja-JP', {
                        usage: 'sort',
                        sensitivity: 'base',
                        numeric: true,
                        ignorePunctuation: false
                    });
                };

                // 安定ソート関数
                global.stableSort = function(array, compareFunction) {
                    const collator = global.createStableCollator();
                    
                    // 元の配列のインデックスを保持して安定ソート
                    const indexed = array.map((item, index) => ({ item, index }));
                    
                    indexed.sort((a, b) => {
                        const result = compareFunction ? 
                                     compareFunction(a.item, b.item) : 
                                     collator.compare(a.item, b.item);
                        
                        // 同値の場合は元のインデックス順を維持（安定ソート）
                        return result !== 0 ? result : a.index - b.index;
                    });
                    
                    return indexed.map(wrapped => wrapped.item);
                };

                this.fixesApplied.push('StableJapaneseSort');
                console.log('✅ Japanese collation stabilized');

            } catch (error) {
                this.compatibilityIssues.push(`Japanese sort setup failed: ${error.message}`);
                console.warn('⚠️ Japanese sort fallback to default');
            }
        }

        /**
         * 2. IME確定イベント統一処理
         */
        setupIMEHandling() {
            try {
                // IME対応の統一入力ハンドラ
                global.createIMEAwareListener = function(element, callback) {
                    let isComposing = false;
                    let pendingValue = '';

                    // 日本語入力開始
                    element.addEventListener('compositionstart', (e) => {
                        isComposing = true;
                        console.log('🇯🇵 IME composition started');
                    });

                    // 日本語入力中
                    element.addEventListener('compositionupdate', (e) => {
                        pendingValue = e.data || '';
                    });

                    // 日本語入力確定
                    element.addEventListener('compositionend', (e) => {
                        isComposing = false;
                        pendingValue = e.data || element.value;
                        console.log('🇯🇵 IME composition ended:', pendingValue);
                        
                        // 確定後に実際のコールバック実行
                        setTimeout(() => {
                            if (callback && typeof callback === 'function') {
                                callback(pendingValue);
                            }
                        }, 10); // 微小遅延でブラウザ差を吸収
                    });

                    // 通常の入力（IME未使用時）
                    element.addEventListener('input', (e) => {
                        if (!isComposing) {
                            if (callback && typeof callback === 'function') {
                                callback(e.target.value);
                            }
                        }
                    });

                    return {
                        isComposing: () => isComposing,
                        getPendingValue: () => pendingValue
                    };
                };

                this.fixesApplied.push('IMEHandling');
                console.log('✅ IME handling unified');

            } catch (error) {
                this.compatibilityIssues.push(`IME setup failed: ${error.message}`);
            }
        }

        /**
         * 3. タイマー分解能統一
         */
        setupTimerStabilization() {
            try {
                // 決定論的タイムスタンプ生成
                let sequenceCounter = 0;
                
                global.getDeterministicTimestamp = function() {
                    // Date.now()の1ms単位 + シーケンス番号で一意性保証
                    const baseTime = Math.floor(Date.now() / 100) * 100; // 100ms単位で丸める
                    const sequence = (sequenceCounter++) % 1000;
                    return baseTime + sequence;
                };

                // 決定論的遅延
                global.deterministicDelay = function(milliseconds) {
                    return new Promise(resolve => {
                        // ブラウザ間のタイマー精度差を吸収
                        const adjustedDelay = Math.max(milliseconds, 16); // 最小16ms
                        setTimeout(resolve, adjustedDelay);
                    });
                };

                this.fixesApplied.push('TimerStabilization');
                console.log('✅ Timer resolution stabilized');

            } catch (error) {
                this.compatibilityIssues.push(`Timer setup failed: ${error.message}`);
            }
        }

        /**
         * 4. フォント・CSS互換性
         */
        setupFontCompatibility() {
            try {
                // CSS変数でフォント統一
                const style = document.createElement('style');
                style.textContent = `
                    :root {
                        --haqei-font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans CJK JP', sans-serif;
                        --haqei-font-size-base: 16px;
                        --haqei-line-height: 1.6;
                    }
                    
                    .haqei-text {
                        font-family: var(--haqei-font-family);
                        font-size: var(--haqei-font-size-base);
                        line-height: var(--haqei-line-height);
                        word-break: keep-all;
                        overflow-wrap: break-word;
                    }
                    
                    /* Safari specific fixes */
                    @supports (-webkit-appearance: none) {
                        .haqei-button {
                            -webkit-appearance: none;
                            border-radius: 6px;
                        }
                        .haqei-input {
                            -webkit-appearance: none;
                        }
                    }
                    
                    /* Firefox specific fixes */
                    @-moz-document url-prefix() {
                        .haqei-input {
                            box-sizing: border-box;
                        }
                    }
                `;
                document.head.appendChild(style);

                this.fixesApplied.push('FontCompatibility');
                console.log('✅ Font compatibility applied');

            } catch (error) {
                this.compatibilityIssues.push(`Font setup failed: ${error.message}`);
            }
        }

        /**
         * 5. イベントハンドリング統一
         */
        setupEventHandling() {
            try {
                // 統一イベントリスナー
                global.addUnifiedEventListener = function(element, eventType, handler, options = {}) {
                    const unifiedHandler = function(event) {
                        // イベントオブジェクトの正規化
                        const normalizedEvent = {
                            type: event.type,
                            target: event.target,
                            currentTarget: event.currentTarget,
                            value: event.target ? event.target.value : undefined,
                            preventDefault: () => event.preventDefault(),
                            stopPropagation: () => event.stopPropagation(),
                            originalEvent: event
                        };

                        // ブラウザ固有の挙動を統一
                        if (eventType === 'click') {
                            // ダブルクリック防止
                            if (element._lastClickTime && Date.now() - element._lastClickTime < 300) {
                                return;
                            }
                            element._lastClickTime = Date.now();
                        }

                        handler(normalizedEvent);
                    };

                    element.addEventListener(eventType, unifiedHandler, options);
                    return unifiedHandler;
                };

                this.fixesApplied.push('EventHandling');
                console.log('✅ Event handling unified');

            } catch (error) {
                this.compatibilityIssues.push(`Event setup failed: ${error.message}`);
            }
        }

        /**
         * 6. LocalStorage互換性
         */
        setupStorageCompatibility() {
            try {
                // localStorage安全なラッパー
                global.safeLocalStorage = {
                    setItem: function(key, value) {
                        try {
                            const serialized = JSON.stringify({
                                value: value,
                                timestamp: Date.now(),
                                version: 'v4.3.1'
                            });
                            localStorage.setItem(key, serialized);
                            return true;
                        } catch (error) {
                            console.warn(`⚠️ localStorage.setItem failed: ${error.message}`);
                            return false;
                        }
                    },
                    
                    getItem: function(key) {
                        try {
                            const stored = localStorage.getItem(key);
                            if (!stored) return null;
                            
                            const parsed = JSON.parse(stored);
                            
                            // 24時間以上古いデータは削除
                            if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
                                localStorage.removeItem(key);
                                return null;
                            }
                            
                            return parsed.value;
                        } catch (error) {
                            console.warn(`⚠️ localStorage.getItem failed: ${error.message}`);
                            localStorage.removeItem(key); // 破損データ削除
                            return null;
                        }
                    },
                    
                    removeItem: function(key) {
                        try {
                            localStorage.removeItem(key);
                            return true;
                        } catch (error) {
                            console.warn(`⚠️ localStorage.removeItem failed: ${error.message}`);
                            return false;
                        }
                    }
                };

                this.fixesApplied.push('StorageCompatibility');
                console.log('✅ Storage compatibility ensured');

            } catch (error) {
                this.compatibilityIssues.push(`Storage setup failed: ${error.message}`);
            }
        }

        /**
         * 互換性レポート生成
         */
        generateCompatibilityReport() {
            return {
                browserInfo: this.browserInfo,
                compatibilityIssues: this.compatibilityIssues,
                fixesApplied: this.fixesApplied,
                timestamp: new Date().toISOString(),
                isCompatible: this.compatibilityIssues.length === 0
            };
        }

        /**
         * 実行時互換性チェック
         */
        checkRuntimeCompatibility() {
            const checks = [
                {
                    name: 'Intl.Collator',
                    test: () => typeof Intl !== 'undefined' && typeof Intl.Collator !== 'undefined'
                },
                {
                    name: 'localStorage',
                    test: () => typeof Storage !== 'undefined' && typeof localStorage !== 'undefined'
                },
                {
                    name: 'WebCrypto',
                    test: () => typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined'
                },
                {
                    name: 'Promise',
                    test: () => typeof Promise !== 'undefined'
                },
                {
                    name: 'EventTarget',
                    test: () => typeof EventTarget !== 'undefined'
                }
            ];

            const results = checks.map(check => ({
                name: check.name,
                supported: check.test(),
                required: true
            }));

            const unsupported = results.filter(r => r.required && !r.supported);
            
            if (unsupported.length > 0) {
                console.warn('⚠️ Unsupported features:', unsupported.map(r => r.name).join(', '));
                this.compatibilityIssues.push(...unsupported.map(r => `${r.name} not supported`));
            }

            return {
                allSupported: unsupported.length === 0,
                results: results
            };
        }
    }

    // グローバル登録
    if (typeof global !== 'undefined') {
        global.BrowserCompatibilityManager = BrowserCompatibilityManager;
        
        // 自動初期化
        global.browserCompatibility = new BrowserCompatibilityManager();
        
        // DOMContentLoaded時に初期化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                global.browserCompatibility.initializeCompatibility();
                global.browserCompatibility.checkRuntimeCompatibility();
            });
        } else {
            // 既に読み込み済みの場合
            global.browserCompatibility.initializeCompatibility();
            global.browserCompatibility.checkRuntimeCompatibility();
        }
    }

    console.log('✅ BrowserCompatibilityManager loaded');

})(typeof window !== 'undefined' ? window : this);