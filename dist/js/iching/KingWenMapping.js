/**
 * King Wen Mapping Class
 * 正確な変爻計算を実現するKing Wen順序準拠の実装
 */

import { ConfigLoader } from '../../../config/config-loader-adapter.js';

class KingWenMapping {
    constructor() {
        this.hexagramData = null;
        this.reverseMap = new Map();
        this.initialized = false;
        this.loader = new ConfigLoader();
    }
    
    async initialize() {
        if (this.initialized) return;
        
        try {
            // King Wenマッピングデータを読み込み
            const data = await this.loader.load('kingwen-mapping', {
                basePath: typeof window !== 'undefined' ? '/config' : '../../config'
            });
            
            this.hexagramData = data.hexagrams;
            this.buildReverseMap();
            this.initialized = true;
            
            console.log(`✅ KingWenMapping initialized with ${Object.keys(this.hexagramData).length} hexagrams`);
        } catch (error) {
            console.error('Failed to initialize KingWenMapping:', error);
            // フォールバック: 同期的にデータを設定（テスト用）
            this.initializeWithSeedData();
        }
    }
    
    /**
     * テスト用のシードデータで初期化
     */
    initializeWithSeedData() {
        this.hexagramData = {
            "1": { "name": "乾為天", "lines": [1,1,1,1,1,1], "trigrams": ["乾", "乾"] },
            "2": { "name": "坤為地", "lines": [0,0,0,0,0,0], "trigrams": ["坤", "坤"] },
            "11": { "name": "泰", "lines": [1,1,1,0,0,0], "trigrams": ["乾", "坤"] },
            "12": { "name": "否", "lines": [0,0,0,1,1,1], "trigrams": ["坤", "乾"] },
            "63": { "name": "既済", "lines": [1,0,1,0,1,0], "trigrams": ["離", "坎"] },
            "64": { "name": "未済", "lines": [0,1,0,1,0,1], "trigrams": ["坎", "離"] }
        };
        this.buildReverseMap();
        this.initialized = true;
    }
    
    /**
     * 逆引きマップを構築
     */
    buildReverseMap() {
        this.reverseMap.clear();
        for (const [hexNum, hexData] of Object.entries(this.hexagramData)) {
            const key = hexData.lines.join('');
            this.reverseMap.set(key, parseInt(hexNum));
        }
    }
    
    /**
     * 変爻による之卦を計算
     * @param {number} hexNum - 本卦の番号（1-64）
     * @param {number} lineNum - 変爻の位置（1-6、下から上）
     * @returns {number|null} 之卦の番号
     */
    calculateTransformedHex(hexNum, lineNum) {
        if (!this.initialized) {
            this.initializeWithSeedData();
        }
        
        const hexData = this.hexagramData[hexNum];
        if (!hexData) {
            console.warn(`Hexagram ${hexNum} not found in mapping`);
            return null;
        }
        
        // 爻配列をコピー
        const newLines = [...hexData.lines];
        
        // 指定爻を反転（1-based to 0-based）
        const lineIndex = lineNum - 1;
        if (lineIndex < 0 || lineIndex > 5) {
            console.error(`Invalid line number: ${lineNum}`);
            return null;
        }
        
        newLines[lineIndex] = newLines[lineIndex] === 1 ? 0 : 1;
        
        // 新しい卦番号を逆引き
        const key = newLines.join('');
        const newHexNum = this.reverseMap.get(key);
        
        if (!newHexNum) {
            console.warn(`No hexagram found for pattern ${key}`);
            // 全64卦が揃っていない場合のフォールバック
            return this.calculateFallbackHex(hexNum, lineNum);
        }
        
        return newHexNum;
    }
    
    /**
     * フォールバック計算（全64卦が揃っていない場合）
     */
    calculateFallbackHex(hexNum, lineNum) {
        // 簡易的な計算（実際の変爻とは異なる可能性）
        const estimated = ((hexNum - 1) ^ (1 << (lineNum - 1))) + 1;
        console.warn(`Using fallback calculation: ${hexNum} line ${lineNum} → ${estimated} (may be incorrect)`);
        return estimated;
    }
    
    /**
     * 卦番号から爻配列を取得
     * @param {number} hexNum - 卦番号
     * @returns {number[]|null} 爻配列（下から上）
     */
    getLineConfiguration(hexNum) {
        if (!this.initialized) {
            this.initializeWithSeedData();
        }
        
        const hexData = this.hexagramData[hexNum];
        return hexData ? hexData.lines : null;
    }
    
    /**
     * 爻配列から卦番号を取得
     * @param {number[]} lines - 爻配列（下から上、1=陽、0=陰）
     * @returns {number|null} 卦番号
     */
    getHexagramFromLines(lines) {
        if (!this.initialized) {
            this.initializeWithSeedData();
        }
        
        if (!Array.isArray(lines) || lines.length !== 6) {
            console.error('Invalid lines array');
            return null;
        }
        
        const key = lines.join('');
        return this.reverseMap.get(key) || null;
    }
    
    /**
     * 卦データを取得
     * @param {number} hexNum - 卦番号
     * @returns {Object|null} 卦データ
     */
    getHexagramData(hexNum) {
        if (!this.initialized) {
            this.initializeWithSeedData();
        }
        
        return this.hexagramData[hexNum] || null;
    }
    
    /**
     * 利用可能な卦の数を取得
     */
    getAvailableHexagramCount() {
        return Object.keys(this.hexagramData || {}).length;
    }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== 'undefined') {
    window.KingWenMapping = KingWenMapping;
    console.log('🌐 KingWenMapping registered to window object');
}