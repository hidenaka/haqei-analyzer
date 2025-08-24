/**
 * StorageManager.js - HAQEIデータ管理システム
 * localStorageとの完全な連携を実現
 */

class StorageManager {
    constructor() {
        this.prefix = 'haqei_';
        this.debugMode = true;
    }
    
    /**
     * 保存されている回答データを取得
     */
    getAnswers() {
        const keys = [
            'haqei_analyzer_answers',
            'haqei_answers',
            'haqei_scenario_answers'
        ];
        
        for (const key of keys) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (this.debugMode) console.log(`✅ Answers found in ${key}`);
                    return Array.isArray(parsed) ? parsed : parsed.answers || [];
                } catch (e) {
                    console.warn(`Parse error for ${key}:`, e);
                }
            }
        }
        
        if (this.debugMode) console.log('⚠️ No answers found in localStorage');
        return [];
    }
    
    /**
     * 分析結果を取得（複数の保存形式に対応）
     */
    getAnalysisResult() {
        // 可能性のあるすべてのキーをチェック
        const keys = [
            'haqei_analysis_result',
            'haqei_analyzer_analysis_result',
            'haqei_emergency_result',
            'haqei_results_latest_result'
        ];
        
        for (const key of keys) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    
                    // データ構造のバリエーションに対応
                    let result = null;
                    
                    // パターン1: { result: {...}, timestamp: ... }
                    if (parsed.result) {
                        result = parsed.result;
                    }
                    // パターン2: { value: {...} }
                    else if (parsed.value) {
                        result = typeof parsed.value === 'string' ? JSON.parse(parsed.value) : parsed.value;
                    }
                    // パターン3: 直接Triple OSデータ
                    else if (parsed.engineOS && parsed.interfaceOS && parsed.safeModeOS) {
                        result = parsed;
                    }
                    
                    if (result) {
                        if (this.debugMode) {
                            console.log(`✅ Analysis result found in ${key}`);
                            console.log('Data structure:', {
                                hasEngineOS: !!result.engineOS,
                                hasInterfaceOS: !!result.interfaceOS,
                                hasSafeModeOS: !!result.safeModeOS
                            });
                        }
                        return this.normalizeAnalysisResult(result);
                    }
                } catch (e) {
                    console.warn(`Parse error for ${key}:`, e);
                }
            }
        }
        
        // データが見つからない場合はデフォルトデータを返す
        if (this.debugMode) console.log('⚠️ No analysis result found, returning default data');
        return this.getDefaultAnalysisResult();
    }
    
    /**
     * インサイトデータを取得
     */
    getInsights() {
        const keys = [
            'haqei_insights',
            'haqei_analyzer_insights'
        ];
        
        for (const key of keys) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (this.debugMode) console.log(`✅ Insights found in ${key}`);
                    return parsed.insights || parsed;
                } catch (e) {
                    console.warn(`Parse error for ${key}:`, e);
                }
            }
        }
        
        return null;
    }
    
    /**
     * 分析結果を保存
     */
    saveAnalysisResult(result) {
        const data = {
            result: result,
            timestamp: Date.now(),
            version: '2025.08.19'
        };
        
        // 複数のキーに保存（互換性のため）
        localStorage.setItem('haqei_analysis_result', JSON.stringify(data));
        localStorage.setItem('haqei_analyzer_analysis_result', JSON.stringify(result));
        
        if (this.debugMode) console.log('✅ Analysis result saved to localStorage');
    }
    
    /**
     * インサイトを保存
     */
    saveInsights(insights) {
        const data = {
            insights: insights,
            timestamp: Date.now(),
            version: '2025.08.19'
        };
        
        localStorage.setItem('haqei_insights', JSON.stringify(data));
        
        if (this.debugMode) console.log('✅ Insights saved to localStorage');
    }
    
    /**
     * 分析履歴を取得
     */
    getAnalysisHistory() {
        try {
            const history = localStorage.getItem('haqei_analysis_history');
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.warn('Failed to load analysis history:', e);
            return [];
        }
    }
    
    /**
     * 分析履歴に結果を追加
     */
    addToAnalysisHistory(result) {
        try {
            const history = this.getAnalysisHistory();
            const historyItem = {
                ...result,
                timestamp: Date.now(),
                id: Date.now().toString()
            };
            
            history.unshift(historyItem);
            
            // 履歴は最大20件まで保持
            if (history.length > 20) {
                history.length = 20;
            }
            
            localStorage.setItem('haqei_analysis_history', JSON.stringify(history));
            
            if (this.debugMode) console.log('✅ Analysis result added to history');
        } catch (e) {
            console.warn('Failed to save analysis history:', e);
        }
    }
    
    /**
     * 前回の分析結果を取得
     */
    getPreviousAnalysisResult() {
        const history = this.getAnalysisHistory();
        return history.length >= 2 ? history[1] : null;
    }
    
    /**
     * データ構造を正規化
     */
    normalizeAnalysisResult(result) {
        // 各OSのデータを正規化
        const normalize = (os, defaultName) => {
            if (!os) return this.getDefaultOS(defaultName);
            
            return {
                name: os.name || defaultName,
                score: os.score || os.activation || 50,
                hexagram: os.hexagram || {
                    symbol: os.hexagramSymbol || '☰',
                    name: os.hexagramName || '未定義',
                    number: os.hexagramId || 1
                },
                traits: os.traits || os.characteristics || [],
                description: os.description || os.summary || ''
            };
        };
        
        return {
            engineOS: normalize(result.engineOS, 'Engine OS'),
            interfaceOS: normalize(result.interfaceOS, 'Interface OS'),
            safeModeOS: normalize(result.safeModeOS || result.platformOS, 'Safe Mode OS'),
            timestamp: result.timestamp || Date.now(),
            version: result.version || '2025.08.19'
        };
    }
    
    /**
     * デフォルトのOSデータ
     */
    getDefaultOS(name) {
        const defaults = {
            'Engine OS': {
                name: 'Engine OS',
                score: 75,
                hexagram: { symbol: '☰', name: '乾為天', number: 1 },
                traits: ['創造的', 'リーダーシップ', '革新的', '独立心'],
                description: 'あなたの内なる創造性とリーダーシップの源泉'
            },
            'Interface OS': {
                name: 'Interface OS',
                score: 82,
                hexagram: { symbol: '☱', name: '兌為澤', number: 58 },
                traits: ['協調的', 'コミュニケーション', '楽観的', '柔軟性'],
                description: '社会との調和を重視する対人関係のパターン'
            },
            'Safe Mode OS': {
                name: 'Safe Mode OS',
                score: 68,
                hexagram: { symbol: '☷', name: '坤為地', number: 2 },
                traits: ['安定志向', '慎重', '保守的', '支援的'],
                description: '心の安全を守る防御メカニズム'
            }
        };
        
        return defaults[name] || defaults['Engine OS'];
    }
    
    /**
     * デフォルトの分析結果全体
     */
    getDefaultAnalysisResult() {
        return {
            engineOS: this.getDefaultOS('Engine OS'),
            interfaceOS: this.getDefaultOS('Interface OS'),
            safeModeOS: this.getDefaultOS('Safe Mode OS'),
            timestamp: Date.now(),
            version: '2025.08.19'
        };
    }
    
    /**
     * すべてのHAQEI関連データを取得（デバッグ用）
     */
    getAllHaqeiData() {
        const allData = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('haqei')) {
                try {
                    const value = localStorage.getItem(key);
                    allData[key] = JSON.parse(value);
                } catch (e) {
                    allData[key] = value;
                }
            }
        }
        
        return allData;
    }
    
    /**
     * テストデータを生成して保存
     */
    generateTestData() {
        const testData = {
            engineOS: {
                name: 'クリエイティブ・エンジン',
                score: 85,
                hexagram: { symbol: '☰', name: '乾為天', number: 1 },
                traits: ['創造的', 'リーダーシップ', '革新的', '独立心', '先見性'],
                description: 'あなたは強い創造性とリーダーシップを持ち、新しいアイデアを生み出し、変革を推進する力があります。'
            },
            interfaceOS: {
                name: 'ハーモニー・インターフェース',
                score: 78,
                hexagram: { symbol: '☱', name: '兌為澤', number: 58 },
                traits: ['協調的', 'コミュニケーション', '楽観的', '柔軟性', '共感力'],
                description: '人との調和を大切にし、円滑なコミュニケーションで周囲との良好な関係を築きます。'
            },
            safeModeOS: {
                name: 'セキュリティ・ガーディアン',
                score: 72,
                hexagram: { symbol: '☷', name: '坤為地', number: 2 },
                traits: ['安定志向', '慎重', '保守的', '支援的', '忍耐力'],
                description: '心の安全を守り、リスクを適切に管理しながら、安定した基盤を提供します。'
            },
            timestamp: Date.now(),
            version: '2025.08.19'
        };
        
        this.saveAnalysisResult(testData);
        console.log('✅ Test data generated and saved');
        return testData;
    }
}

// グローバルに公開
window.StorageManager = StorageManager;