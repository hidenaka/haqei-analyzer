/**
 * T05: 512パターン&宮マッピング実装
 * 8問の2択（Yes/No）から512パターン（0-511）を生成し、
 * 64卦と8宮にマッピングする
 * Fail-Closedパターンで安全性を確保
 */

(function(global) {
    'use strict';

    class PatternMapper {
        constructor() {
            this.version = '1.0.0';
            this.initialized = false;
            this.eightPalacesData = null;
            this.patternCache = new Map();
            
            // Fail-Closed: データが読み込めなかった場合のデフォルト
            this.defaultPattern = {
                patternId: "000",
                decimalId: 0,
                hexagramId: 1,
                palace: "乾宮",
                position: 0,
                error: null
            };
            
            this.initialize();
        }

        /**
         * 初期化: 8宮データを読み込み
         */
        async initialize() {
            try {
                // Node.js環境かブラウザ環境かを判定
                if (typeof window !== 'undefined' && window.fetch) {
                    // ブラウザ環境
                    const response = await window.fetch('/assets/eight_palaces.v1.json');
                    if (!response.ok) {
                        throw new Error(`Failed to load eight palaces data: ${response.status}`);
                    }
                    this.eightPalacesData = await response.json();
                } else if (typeof require !== 'undefined') {
                    // Node.js環境
                    const fs = require('fs');
                    const path = require('path');
                    // __dirnameが存在しない場合はプロジェクトルートからの相対パスを使用
                    const projectRoot = path.resolve(process.cwd());
                    const filePath = path.join(projectRoot, 'public/assets/eight_palaces.v1.json');
                    const content = fs.readFileSync(filePath, 'utf8');
                    this.eightPalacesData = JSON.parse(content);
                } else {
                    throw new Error('Unable to load eight palaces data in current environment');
                }
                
                // データ検証
                if (!this.validateEightPalacesData()) {
                    throw new Error('Invalid eight palaces data structure');
                }
                
                this.initialized = true;
                console.log('✅ PatternMapper initialized with eight palaces data');
                
            } catch (error) {
                console.error('❌ PatternMapper initialization failed:', error);
                // Fail-Closed: エラー時は安全なデフォルト状態を維持
                this.initialized = false;
            }
        }

        /**
         * 8宮データの妥当性検証
         */
        validateEightPalacesData() {
            if (!this.eightPalacesData || !this.eightPalacesData.palaces) {
                return false;
            }
            
            const palaces = Object.values(this.eightPalacesData.palaces);
            
            // 8宮が存在し、各宮に8つの卦があることを確認
            if (palaces.length !== 8) {
                console.error('Invalid palace count:', palaces.length);
                return false;
            }
            
            for (const palace of palaces) {
                if (!palace.hexagrams || palace.hexagrams.length !== 8) {
                    console.error('Invalid hexagram count in palace:', palace);
                    return false;
                }
            }
            
            // 64卦の完全性チェック
            const allHexagrams = new Set();
            palaces.forEach(palace => {
                palace.hexagrams.forEach(hex => allHexagrams.add(hex));
            });
            
            if (allHexagrams.size !== 64) {
                console.error('Incomplete hexagram coverage:', allHexagrams.size);
                return false;
            }
            
            return true;
        }

        /**
         * 8問の回答から3桁の8進数パターンIDを生成
         * @param {Array<boolean|number>} answers - 8個の回答 (true/false or 1/0)
         * @returns {string} 3桁の8進数文字列 ("000" - "777")
         */
        generatePatternId(answers) {
            // 入力検証
            if (!Array.isArray(answers) || answers.length !== 8) {
                console.error('Invalid answers array:', answers);
                return "000"; // Fail-Closed: デフォルトパターン
            }
            
            // 各回答を0/1に正規化
            const normalized = answers.map((answer, index) => {
                if (typeof answer === 'boolean') {
                    return answer ? 1 : 0;
                } else if (answer === 1 || answer === 0) {
                    return answer;
                } else {
                    console.warn(`Invalid answer at position ${index}:`, answer);
                    return 0; // Fail-Closed: 不正な値は0として扱う
                }
            });
            
            // 2進数から10進数へ変換（最初の回答が最上位ビット）
            const decimal = normalized.reduce((acc, bit, index) => {
                return acc + (bit << (7 - index));
            }, 0);
            
            // 10進数を8進数文字列に変換（3桁固定）
            const octal = decimal.toString(8).padStart(3, '0');
            
            return octal;
        }

        /**
         * パターンIDから10進数IDを取得
         * @param {string} patternId - 3桁の8進数文字列
         * @returns {number} 0-511の10進数
         */
        patternIdToDecimal(patternId) {
            // 入力検証
            if (typeof patternId !== 'string' || !/^[0-7]{3}$/.test(patternId)) {
                console.error('Invalid pattern ID:', patternId);
                return 0; // Fail-Closed
            }
            
            return parseInt(patternId, 8);
        }

        /**
         * 512パターンから64卦へのマッピング
         * @param {number} decimalId - 0-511の10進数
         * @returns {number} 1-64の卦番号
         */
        mapToHexagram(decimalId) {
            // 入力検証
            if (!Number.isInteger(decimalId) || decimalId < 0 || decimalId > 511) {
                console.error('Invalid decimal ID:', decimalId);
                return 1; // Fail-Closed: デフォルト卦（乾為天）
            }
            
            // 512パターンを64卦にマッピング（8パターンごとに1卦）
            // 0-7 → 卦1, 8-15 → 卦2, ..., 504-511 → 卦64
            const hexagramId = Math.floor(decimalId / 8) + 1;
            
            return hexagramId;
        }

        /**
         * 卦番号から所属する宮と位置を取得
         * @param {number} hexagramId - 1-64の卦番号
         * @returns {Object} {palace: string, position: number}
         */
        findPalaceInfo(hexagramId) {
            if (!this.initialized || !this.eightPalacesData) {
                console.warn('Eight palaces data not initialized');
                return { palace: "乾宮", position: 0 }; // Fail-Closed
            }
            
            // 入力検証
            if (!Number.isInteger(hexagramId) || hexagramId < 1 || hexagramId > 64) {
                console.error('Invalid hexagram ID:', hexagramId);
                return { palace: "乾宮", position: 0 }; // Fail-Closed
            }
            
            // 8宮データから該当する宮を検索
            for (const [palaceName, palaceData] of Object.entries(this.eightPalacesData.palaces)) {
                const position = palaceData.hexagrams.indexOf(hexagramId);
                if (position !== -1) {
                    return {
                        palace: palaceName,
                        position: position,
                        element: palaceData.element,
                        direction: palaceData.direction
                    };
                }
            }
            
            // 見つからない場合（データ不整合）
            console.error('Hexagram not found in any palace:', hexagramId);
            return { palace: "乾宮", position: 0 }; // Fail-Closed
        }

        /**
         * 完全なパターン分析
         * @param {Array<boolean|number>} answers - 8個の回答
         * @returns {Object} 完全な分析結果
         */
        analyzePattern(answers) {
            try {
                // キャッシュチェック
                const cacheKey = answers.map(a => a ? '1' : '0').join('');
                if (this.patternCache.has(cacheKey)) {
                    return this.patternCache.get(cacheKey);
                }
                
                // パターンID生成
                const patternId = this.generatePatternId(answers);
                const decimalId = this.patternIdToDecimal(patternId);
                
                // 卦へのマッピング
                const hexagramId = this.mapToHexagram(decimalId);
                
                // 宮情報の取得
                const palaceInfo = this.findPalaceInfo(hexagramId);
                
                // 結果の構築
                const result = {
                    patternId: patternId,
                    decimalId: decimalId,
                    binaryPattern: answers.map(a => a ? 1 : 0).join(''),
                    hexagramId: hexagramId,
                    palace: palaceInfo.palace,
                    palacePosition: palaceInfo.position,
                    element: palaceInfo.element || null,
                    direction: palaceInfo.direction || null,
                    patternGroup: Math.floor(decimalId / 64), // 0-7のグループ
                    subPattern: decimalId % 8, // グループ内のサブパターン
                    timestamp: new Date().toISOString(),
                    error: null
                };
                
                // キャッシュに保存（サイズ制限付き）
                if (this.patternCache.size >= 100) {
                    // 最も古いエントリを削除
                    const firstKey = this.patternCache.keys().next().value;
                    this.patternCache.delete(firstKey);
                }
                this.patternCache.set(cacheKey, result);
                
                return result;
                
            } catch (error) {
                console.error('Pattern analysis error:', error);
                // Fail-Closed: エラー時は安全なデフォルト結果を返す
                return {
                    ...this.defaultPattern,
                    error: error.message
                };
            }
        }

        /**
         * パターングループの統計情報
         * @param {number} patternGroup - 0-7のグループ番号
         * @returns {Object} グループの統計情報
         */
        getPatternGroupStats(patternGroup) {
            if (!Number.isInteger(patternGroup) || patternGroup < 0 || patternGroup > 7) {
                console.error('Invalid pattern group:', patternGroup);
                return null;
            }
            
            const startId = patternGroup * 64;
            const endId = startId + 63;
            const hexagramStart = Math.floor(startId / 8) + 1;
            const hexagramEnd = Math.floor(endId / 8) + 1;
            
            return {
                group: patternGroup,
                patternRange: `${startId.toString(8).padStart(3, '0')}-${endId.toString(8).padStart(3, '0')}`,
                decimalRange: `${startId}-${endId}`,
                hexagramRange: `${hexagramStart}-${hexagramEnd}`,
                totalPatterns: 64
            };
        }

        /**
         * デバッグ情報の出力
         */
        debugInfo() {
            console.group('🔍 PatternMapper Debug Info');
            console.log('Version:', this.version);
            console.log('Initialized:', this.initialized);
            console.log('Eight Palaces Loaded:', this.eightPalacesData !== null);
            console.log('Pattern Cache Size:', this.patternCache.size);
            
            if (this.eightPalacesData) {
                const palaces = Object.keys(this.eightPalacesData.palaces);
                console.log('Palaces:', palaces);
                
                // 各宮の最初の卦を表示
                palaces.forEach(palace => {
                    const firstHex = this.eightPalacesData.palaces[palace].hexagrams[0];
                    console.log(`  ${palace}: First hexagram = ${firstHex}`);
                });
            }
            
            console.groupEnd();
        }
    }

    // グローバルに公開
    if (typeof window !== 'undefined') {
        window.PatternMapper = PatternMapper;
    }
    
    // AMD/CommonJS/Node.js サポート
    if (typeof define === 'function' && define.amd) {
        define([], function() { return PatternMapper; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = PatternMapper;
    }
    
})(this);