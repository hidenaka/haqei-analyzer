// HAQEI Dynamic Scenario Color System
// 8シナリオと八卦の動的マッピングシステム

class DynamicScenarioColorSystem {
    constructor() {
        this.version = "1.0.0";
        this.initialized = false;
        
        // 8シナリオ → 八卦マッピング（確定）
        this.scenarioTrigramMapping = {
            'proactive': 'qian',      // 積極的前進 → 乾（創造・天） → 金色
            'adaptive': 'kun',        // 適応的前進 → 坤（受容・地） → 茶色
            'transformative': 'zhen', // 段階的変革 → 震（動雷） → 紫色
            'decisive': 'li',         // 決断的変革 → 離（光明・火） → 朱色
            'strengthening': 'gen',   // 強化安定化 → 艮（山・停止） → 灰色
            'harmonizing': 'dui',     // 調和安定化 → 兌（沢・喜悦） → 空色
            'integrative': 'xun',     // 統合的発展 → 巽（風・順風） → 緑色
            'innovative': 'kan'       // 革新的探索 → 坎（水・険難） → 青色
        };
        
        // 三爻色定義（CSS themes.cssから）
        this.trigramColors = {
            'qian': { primary: '#FFD700', light: '#FFF8DC', dark: '#B8860B', icon: '☰', name: '乾' },
            'dui':  { primary: '#87CEEB', light: '#F0F8FF', dark: '#4682B4', icon: '☱', name: '兌' },
            'li':   { primary: '#FF4500', light: '#FFE4E1', dark: '#DC143C', icon: '☲', name: '離' },
            'zhen': { primary: '#8A2BE2', light: '#E6E6FA', dark: '#4B0082', icon: '☳', name: '震' },
            'xun':  { primary: '#32CD32', light: '#F0FFF0', dark: '#228B22', icon: '☴', name: '巽' },
            'kan':  { primary: '#1E90FF', light: '#F0F8FF', dark: '#0000CD', icon: '☵', name: '坎' },
            'gen':  { primary: '#708090', light: '#F8F8FF', dark: '#2F4F4F', icon: '☶', name: '艮' },
            'kun':  { primary: '#8B4513', light: '#F5F5DC', dark: '#A0522D', icon: '☷', name: '坤' }
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('🎨 DynamicScenarioColorSystem v1.0.0 初期化中...');
        this.initialized = true;
        console.log('✅ 8シナリオ→八卦マッピング完了');
    }
    
    // メイン機能：シナリオの動的色・アイコン取得
    getScenarioVisualization(scenario, hexagramData = null) {
        try {
            const approach = scenario.metadata?.approach || scenario.approach;
            let trigramKey = this.scenarioTrigramMapping[approach];
            
            // H384データベース情報がある場合は調整
            if (hexagramData && this.shouldAdjustByHexagram(hexagramData)) {
                trigramKey = this.adjustTrigramByHexagram(trigramKey, hexagramData);
            }
            
            // trigramKeyが未定義またはnullの場合のフォールバック
            if (!trigramKey || trigramKey === 'undefined') {
                trigramKey = '乾'; // デフォルトのtrigram
            }
            
            const trigramInfo = this.trigramColors[trigramKey];
            if (!trigramInfo) {
                // console.warn(`⚠️ Unknown trigram: ${trigramKey}, using default`); // ログを抑制
                return this.getDefaultVisualization();
            }
            
            return {
                color: trigramInfo.primary,
                lightColor: trigramInfo.light,
                darkColor: trigramInfo.dark,
                icon: trigramInfo.icon,
                traditional: trigramInfo.icon || '☯',  // ROOT CAUSE FIX: traditional プロパティ追加
                modern: this.getModernEmoji(approach) || '🎯',  // ROOT CAUSE FIX: modern プロパティ追加
                trigramName: trigramInfo.name,
                trigramKey: trigramKey,
                gradient: `linear-gradient(135deg, ${trigramInfo.primary}, ${trigramInfo.dark})`,
                cssClass: `trigram-${trigramKey}`,
                modernEmoji: this.getModernEmoji(approach),
                confidenceLevel: scenario.metadata?.confidence || 0.8
            };
            
        } catch (error) {
            console.error('❌ getScenarioVisualization error:', error);
            return this.getDefaultVisualization();
        }
    }
    
    // H384データベース情報による調整判定
    shouldAdjustByHexagram(hexagramData) {
        return hexagramData && (
            hexagramData.trigrams || 
            hexagramData.upperTrigram || 
            hexagramData.lowerTrigram ||
            hexagramData['上卦'] ||
            hexagramData['下卦'] ||
            hexagramData['卦名'] ||
            hexagramData.hexagramNumber
        );
    }
    
    // 実際の卦情報による三爻調整
    adjustTrigramByHexagram(baseTrigramKey, hexagramData) {
        try {
            // H384データベースから実卦情報を取得
            const realHexagramData = this.getH384HexagramData(hexagramData);
            
            if (realHexagramData) {
                // 上卦・下卦情報がある場合  
                if (realHexagramData.upperTrigram && realHexagramData.lowerTrigram) {
                    const upperKey = this.mapTrigramNameToKey(realHexagramData.upperTrigram);
                    const lowerKey = this.mapTrigramNameToKey(realHexagramData.lowerTrigram);
                    
                    // 上卦を優先、なければ下卦を使用
                    return upperKey || lowerKey || baseTrigramKey;
                }
                
                // 卦名から三爻を推定
                if (realHexagramData.hexagramName) {
                    const trigramFromName = this.extractTrigramFromHexagramName(realHexagramData.hexagramName);
                    if (trigramFromName) {
                        return trigramFromName;
                    }
                }
            }
            
            // フォールバック：元の処理
            if (hexagramData.trigrams && hexagramData.trigrams.length > 0) {
                const trigramKey = this.mapTrigramNameToKey(hexagramData.trigrams[0]);
                return trigramKey || baseTrigramKey;
            }
            
            return baseTrigramKey;
            
        } catch (error) {
            console.warn('⚠️ adjustTrigramByHexagram error:', error);
            return baseTrigramKey;
        }
    }
    
    // H384データベースから卦情報を取得
    getH384HexagramData(inputData) {
        try {
            // window.H384_DATAから検索
            if (typeof window !== 'undefined' && window.H384_DATA && Array.isArray(window.H384_DATA)) {
                let hexagramEntry = null;
                
                // 卦番号での検索
                if (inputData.hexagramNumber) {
                    hexagramEntry = window.H384_DATA.find(entry => 
                        entry['卦番号'] === inputData.hexagramNumber || 
                        entry['通し番号'] === inputData.hexagramNumber
                    );
                }
                
                // 卦名での検索
                if (!hexagramEntry && inputData.hexagramName) {
                    hexagramEntry = window.H384_DATA.find(entry => 
                        entry['卦名'] && entry['卦名'].includes(inputData.hexagramName)
                    );
                }
                
                // 卦名での検索（inputData自体が卦名の場合）
                if (!hexagramEntry && typeof inputData === 'string') {
                    hexagramEntry = window.H384_DATA.find(entry => 
                        entry['卦名'] && entry['卦名'].includes(inputData)
                    );
                }
                
                if (hexagramEntry) {
                    return {
                        hexagramName: hexagramEntry['卦名'],
                        hexagramNumber: hexagramEntry['卦番号'] || hexagramEntry['通し番号'],
                        upperTrigram: hexagramEntry['上卦'],
                        lowerTrigram: hexagramEntry['下卦'],
                        keywords: hexagramEntry['キーワード'],
                        modernInterpretation: hexagramEntry['現代解釈'],
                        guidance: hexagramEntry['指針'],
                        originalEntry: hexagramEntry
                    };
                }
            }
            
            return null;
            
        } catch (error) {
            console.warn('⚠️ getH384HexagramData error:', error);
            return null;
        }
    }
    
    // 卦名から三爻を抽出
    extractTrigramFromHexagramName(hexagramName) {
        const hexagramTrigramMap = {
            '乾': 'qian', '天': 'qian',
            '坤': 'kun',  '地': 'kun',
            '震': 'zhen', '雷': 'zhen',
            '巽': 'xun',  '風': 'xun',
            '坎': 'kan',  '水': 'kan',
            '離': 'li',   '火': 'li',
            '艮': 'gen',  '山': 'gen',
            '兌': 'dui',  '沢': 'dui', '澤': 'dui'
        };
        
        // 卦名から三爻名を検索
        for (const [trigramName, trigramKey] of Object.entries(hexagramTrigramMap)) {
            if (hexagramName.includes(trigramName)) {
                return trigramKey;
            }
        }
        
        return null;
    }
    
    // 三爻名→キー変換
    mapTrigramNameToKey(trigramName) {
        const nameMapping = {
            '乾': 'qian', '天': 'qian',
            '兌': 'dui',  '沢': 'dui',
            '離': 'li',   '火': 'li',
            '震': 'zhen', '雷': 'zhen',
            '巽': 'xun',  '風': 'xun',
            '坎': 'kan',  '水': 'kan',
            '艮': 'gen',  '山': 'gen',
            '坤': 'kun',  '地': 'kun'
        };
        
        return nameMapping[trigramName] || null;
    }
    
    // モダン絵文字マッピング
    getModernEmoji(approach) {
        const emojiMap = {
            'proactive': '🚀',      // 積極的前進
            'adaptive': '🌊',       // 適応的前進  
            'transformative': '🦋', // 段階的変革
            'decisive': '⚡',       // 決断的変革
            'strengthening': '🛡️',   // 強化安定化
            'harmonizing': '☯️',     // 調和安定化
            'integrative': '🔗',    // 統合的発展
            'innovative': '💎'      // 革新的探索
        };
        
        return emojiMap[approach] || '🎯';
    }
    
    // デフォルト可視化
    getDefaultVisualization() {
        return {
            color: '#757575',
            lightColor: '#f5f5f5',
            darkColor: '#424242',
            icon: '🎯',
            traditional: '☯',  // ROOT CAUSE FIX: traditional プロパティ追加
            modern: '🎯',      // ROOT CAUSE FIX: modern プロパティ追加
            trigramName: '一般',
            trigramKey: 'default',
            gradient: 'linear-gradient(135deg, #757575, #424242)',
            cssClass: 'trigram-default',
            modernEmoji: '🎯',
            confidenceLevel: 0.5
        };
    }
    
    // 8シナリオ全体の色分け取得
    getAllScenariosVisualization(scenarios, hexagramContext = null) {
        return scenarios.map((scenario, index) => ({
            ...scenario,
            visualization: this.getScenarioVisualization(scenario, hexagramContext),
            displayOrder: index + 1
        }));
    }
    
    // CSS変数動的設定
    applyScenariosColorsToDom(scenarios) {
        const root = document.documentElement;
        
        scenarios.forEach((scenario, index) => {
            const viz = scenario.visualization;
            if (!viz) return;
            
            // CSS変数設定
            root.style.setProperty(`--scenario-${index + 1}-color`, viz.color);
            root.style.setProperty(`--scenario-${index + 1}-light`, viz.lightColor);
            root.style.setProperty(`--scenario-${index + 1}-dark`, viz.darkColor);
            root.style.setProperty(`--scenario-${index + 1}-gradient`, viz.gradient);
        });
        
        console.log('🎨 シナリオ色をCSS変数に適用完了');
    }
    
    // デバッグ情報
    getSystemInfo() {
        return {
            version: this.version,
            initialized: this.initialized,
            mappingCount: Object.keys(this.scenarioTrigramMapping).length,
            colorCount: Object.keys(this.trigramColors).length,
            availableApproaches: Object.keys(this.scenarioTrigramMapping)
        };
    }
}

// グローバル初期化
if (typeof window !== 'undefined') {
    window.DynamicScenarioColorSystem = DynamicScenarioColorSystem;
    
    if (!window.haqeiColorSystem) {
        window.haqeiColorSystem = new DynamicScenarioColorSystem();
        console.log('🎨 HAQEI動的色システム初期化完了');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicScenarioColorSystem;
}