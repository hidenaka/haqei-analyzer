/**
 * 契約統合モジュール - 契約A/B保存・読み込み機能
 * DataPersistenceManagerと連携してデータ永続化を実現
 */

// 契約B保存用のグローバル関数
window.saveFuturePathsContract = async function(scenarios) {
    try {
        // 契約B形式に変換
        const contractB = {
            paths: scenarios.map((scenario, index) => ({
                id: scenario.id || `P${index + 1}`,
                title: scenario.title || scenario.name || '',
                analysis: scenario.analysis || scenario.description || '',
                advice: scenario.advice || scenario.recommendation || '',
                hexagram: {
                    id: scenario.hexagramId || scenario.hexagram?.id || 1,
                    name: scenario.hexagramName || scenario.hexagram?.name || '乾為天',
                    symbol: scenario.symbol || scenario.hexagram?.symbol || '☰☰'
                },
                risk: scenario.risk || 0.5,
                potential: scenario.potential || 0.5,
                recommendation: scenario.recommendation_score || 0.5,
                rationale: scenario.rationale || '',
                milestones: scenario.milestones || ['Step 1', 'Step 2', 'Step 3']
            })),
            created_at: new Date().toISOString()
        };
        
        // DataPersistenceManagerのインスタンスを取得または作成
        if (!window.dataPersistenceManager) {
            window.dataPersistenceManager = new DataPersistenceManager();
        }
        
        // 契約B保存
        const success = await window.dataPersistenceManager.saveContractB(contractB);
        
        if (success) {
            console.log('✅ Future Paths契約保存成功');
            // 保存成功通知を表示
            showNotification('シナリオ分析結果を保存しました', 'success');
        }
        
        return success;
    } catch (error) {
        console.error('契約B保存エラー:', error);
        showNotification('保存に失敗しました', 'error');
        return false;
    }
};

// 契約A保存用のグローバル関数（OS Analyzer用）
window.saveTripleOSContract = async function(osData) {
    try {
        // 契約A形式に変換
        const contractA = {
            version: "1.0",
            engine_os: {
                id: osData.engineOS?.id || 1,
                name: osData.engineOS?.name || '乾為天',
                score: osData.engineOS?.score || 0.5
            },
            interface_os: {
                id: osData.interfaceOS?.id || 2,
                name: osData.interfaceOS?.name || '坤為地',
                score: osData.interfaceOS?.score || 0.5
            },
            safe_mode_os: {
                id: osData.safeModeOS?.id || 29,
                name: osData.safeModeOS?.name || '坎為水',
                score: osData.safeModeOS?.score || 0.5
            },
            synergy: osData.synergy || {
                matrix: [[0, 0, 0]],
                notes: ''
            },
            strengths: osData.strengths || [],
            risks: osData.risks || [],
            raw_answers: osData.answers || {},
            created_at: new Date().toISOString()
        };
        
        // DataPersistenceManagerのインスタンスを取得または作成
        if (!window.dataPersistenceManager) {
            window.dataPersistenceManager = new DataPersistenceManager();
        }
        
        // 契約A保存
        const success = await window.dataPersistenceManager.saveContractA(contractA);
        
        if (success) {
            console.log('✅ Triple OS契約保存成功');
            showNotification('OS分析結果を保存しました', 'success');
        }
        
        return success;
    } catch (error) {
        console.error('契約A保存エラー:', error);
        showNotification('保存に失敗しました', 'error');
        return false;
    }
};

// 通知表示関数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 契約読み込み関数
window.loadContracts = async function() {
    try {
        if (!window.dataPersistenceManager) {
            window.dataPersistenceManager = new DataPersistenceManager();
        }
        
        const [contractA, contractB] = await Promise.all([
            window.dataPersistenceManager.loadContractA(),
            window.dataPersistenceManager.loadContractB()
        ]);
        
        return {
            tripleOS: contractA,
            futurePaths: contractB
        };
    } catch (error) {
        console.error('契約読み込みエラー:', error);
        return {
            tripleOS: null,
            futurePaths: null
        };
    }
};

console.log('✅ 契約統合モジュール読み込み完了');