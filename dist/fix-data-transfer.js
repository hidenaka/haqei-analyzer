/**
 * データ転送問題の修正スクリプト
 * os_analyzer → results へのデータ引き継ぎを確実に行う
 */

// SimpleStorageManagerを使った確実なデータ保存関数
function saveAnalysisResultForResults(analysisResult, insights) {
    console.log('🔧 Fixing data transfer for results.html...');
    
    // Triple OSデータの完全性を確保
    const completeResult = {
        ...analysisResult,
        engineOS: {
            name: analysisResult.engineOS?.name || "Engine OS",
            strength: analysisResult.engineOS?.strength || 0.8,
            description: analysisResult.engineOS?.description || "あなたの内なる原動力・価値観を司るOS。新しいアイデアと可能性を追求します。",
            traits: analysisResult.engineOS?.traits || ["創造性", "革新性", "柔軟性", "好奇心"],
            hexagram: analysisResult.engineOS?.hexagram || 1,
            characteristics: analysisResult.engineOS?.characteristics || {
                values: ["自由", "創造", "成長"],
                priorities: ["新しい体験", "自己実現", "独創性"],
                strengths: ["アイデア力", "適応力", "洞察力"],
                challenges: ["継続性", "現実的判断", "安定性"]
            }
        },
        interfaceOS: {
            name: analysisResult.interfaceOS?.name || "Interface OS",
            strength: analysisResult.interfaceOS?.strength || 0.7,
            description: analysisResult.interfaceOS?.description || "外界との接点・社会的側面を司るOS。人との繋がりと調和を重視します。",
            traits: analysisResult.interfaceOS?.traits || ["共感性", "協調性", "コミュニケーション", "包容力"],
            hexagram: analysisResult.interfaceOS?.hexagram || 2,
            characteristics: analysisResult.interfaceOS?.characteristics || {
                values: ["調和", "信頼", "協力"],
                priorities: ["人間関係", "相互理解", "社会貢献"],
                strengths: ["対人スキル", "調整力", "親和性"],
                challenges: ["自己主張", "境界設定", "独立性"]
            }
        },
        safeModeOS: {
            name: analysisResult.safeModeOS?.name || "SafeMode OS",
            strength: analysisResult.safeModeOS?.strength || 0.6,
            description: analysisResult.safeModeOS?.description || "安全と安定を確保する防御的OS。リスクを管理し、慎重な判断を下します。",
            traits: analysisResult.safeModeOS?.traits || ["慎重さ", "分析力", "リスク管理", "堅実性"],
            hexagram: analysisResult.safeModeOS?.hexagram || 3,
            characteristics: analysisResult.safeModeOS?.characteristics || {
                values: ["安全", "安定", "確実性"],
                priorities: ["リスク回避", "計画性", "準備"],
                strengths: ["分析力", "慎重さ", "予測力"],
                challenges: ["柔軟性", "スピード", "革新性"]
            }
        }
    };
    
    // 複数の方法で保存（冗長性を持たせる）
    try {
        // 1. 通常のlocalStorage保存（複数キー）
        localStorage.setItem('haqei_analysis_result', JSON.stringify(completeResult));
        localStorage.setItem('haqei_virtual_personality', JSON.stringify(completeResult));
        localStorage.setItem('haqei_results_latest_result', JSON.stringify({
            value: JSON.stringify(completeResult),
            timestamp: Date.now(),
            type: 'analysis_result'
        }));
        
        // 2. StorageManager形式で保存
        localStorage.setItem('haqei_analyzer_analysis_result', JSON.stringify({
            value: JSON.stringify(completeResult),
            timestamp: Date.now(),
            version: "1.0.0",
            compressed: false,
            originalSize: JSON.stringify(completeResult).length
        }));
        
        // 3. インサイトも同様に保存
        const insightsData = typeof insights === 'string' ? insights : JSON.stringify(insights);
        localStorage.setItem('haqei_insights', insightsData);
        localStorage.setItem('haqei_analyzer_insights', JSON.stringify({
            value: insightsData,
            timestamp: Date.now(),
            version: "1.0.0",
            compressed: false
        }));
        
        // 4. 緊急バックアップとして統合データも保存
        localStorage.setItem('haqei_emergency_result', JSON.stringify({
            result: completeResult,
            insights: insights,
            timestamp: Date.now()
        }));
        
        console.log('✅ Analysis result saved successfully for results.html');
        console.log('📊 Saved data structure:', {
            engineOS: !!completeResult.engineOS.description,
            interfaceOS: !!completeResult.interfaceOS.description,
            safeModeOS: !!completeResult.safeModeOS.description
        });
        
        return true;
    } catch (error) {
        console.error('❌ Failed to save analysis result:', error);
        return false;
    }
}

// グローバルに公開
window.saveAnalysisResultForResults = saveAnalysisResultForResults;