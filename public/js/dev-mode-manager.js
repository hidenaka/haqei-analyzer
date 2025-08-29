/**
 * HAQEI開発モードマネージャー
 * 開発効率化のためのモックデータ管理システム
 */

class DevModeManager {
    constructor() {
        this.isDevelopment = this.checkDevelopmentMode();
        this.mockProfiles = {
            // バランス型プロファイル
            balanced: {
                name: "バランス型",
                engineOS: {
                    score: 75,
                    hexagram: 1,  // 乾為天
                    traits: ['創造性', 'リーダーシップ', '独創性'],
                    description: 'バランスの取れた創造的な思考'
                },
                interfaceOS: {
                    score: 72,
                    hexagram: 11, // 地天泰
                    traits: ['協調性', 'コミュニケーション', '柔軟性'],
                    description: '調和的な対人関係'
                },
                safeModeOS: {
                    score: 70,
                    hexagram: 52, // 艮為山
                    traits: ['慎重', '安定志向', '守備的'],
                    description: '適度な慎重さ'
                }
            },
            
            // 革新型プロファイル
            innovative: {
                name: "革新型",
                engineOS: {
                    score: 92,
                    hexagram: 49, // 沢火革
                    traits: ['革新', '変革', '挑戦'],
                    description: '強い革新志向'
                },
                interfaceOS: {
                    score: 65,
                    hexagram: 31, // 沢山咸
                    traits: ['感受性', '直感', '共感'],
                    description: '直感的な対人関係'
                },
                safeModeOS: {
                    score: 45,
                    hexagram: 38, // 火沢睽
                    traits: ['リスクテイカー', '大胆', '冒険的'],
                    description: 'リスクを恐れない姿勢'
                }
            },
            
            // 安定型プロファイル
            stable: {
                name: "安定型",
                engineOS: {
                    score: 60,
                    hexagram: 2,  // 坤為地
                    traits: ['受容性', '包容力', '継続性'],
                    description: '着実な実行力'
                },
                interfaceOS: {
                    score: 85,
                    hexagram: 37, // 風火家人
                    traits: ['調和', '協力', '信頼構築'],
                    description: '高い協調性'
                },
                safeModeOS: {
                    score: 88,
                    hexagram: 12, // 天地否
                    traits: ['慎重', '保守的', '安全重視'],
                    description: '強い安全志向'
                }
            },
            
            // ストレス状態プロファイル
            stressed: {
                name: "ストレス状態",
                engineOS: {
                    score: 45,
                    hexagram: 47, // 沢水困
                    traits: ['困難', '停滞', '葛藤'],
                    description: '目標達成の困難'
                },
                interfaceOS: {
                    score: 38,
                    hexagram: 39, // 水山蹇
                    traits: ['孤立', '不信', '防御的'],
                    description: '対人関係の困難'
                },
                safeModeOS: {
                    score: 95,
                    hexagram: 29, // 坎為水
                    traits: ['過度の警戒', '不安', '回避'],
                    description: '過剰な防御反応'
                }
            }
        };
    }
    
    /**
     * 開発モードかどうかチェック
     */
    checkDevelopmentMode() {
        // URLパラメータ、ローカルホスト、または環境変数で判定
        const urlParams = new URLSearchParams(window.location.search);
        const isDevParam = urlParams.get('dev') === 'true';
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
        const isDevStorage = localStorage.getItem('haqei_dev_mode') === 'true';
        
        return isDevParam || isLocalhost || isDevStorage;
    }
    
    /**
     * 開発モードを有効化
     */
    enableDevMode() {
        localStorage.setItem('haqei_dev_mode', 'true');
        this.isDevelopment = true;
        console.log('🔧 開発モードを有効化しました');
        this.showDevPanel();
    }
    
    /**
     * 開発モードを無効化
     */
    disableDevMode() {
        localStorage.removeItem('haqei_dev_mode');
        localStorage.removeItem('osAnalysisResult');
        this.isDevelopment = false;
        console.log('✅ 開発モードを無効化しました');
        this.hideDevPanel();
    }
    
    /**
     * モックデータを設定
     */
    setMockData(profileType = 'balanced') {
        if (!this.isDevelopment) {
            console.warn('開発モードが無効です');
            return false;
        }
        
        const profile = this.mockProfiles[profileType];
        if (!profile) {
            console.error('指定されたプロファイルが存在しません:', profileType);
            return false;
        }
        
        // 36問の回答データも生成
        const answers = this.generateAnswers(profileType);
        
        // LocalStorageに保存
        localStorage.setItem('osAnalysisResult', JSON.stringify(profile));
        localStorage.setItem('osAnalysisAnswers', JSON.stringify(answers));
        localStorage.setItem('currentMockProfile', profileType);
        
        console.log(`✅ モックデータ設定完了: ${profile.name}`);
        return true;
    }
    
    /**
     * プロファイルに応じた36問の回答を生成
     */
    generateAnswers(profileType) {
        const rng = window.seedableRandom || { next: () => 0.5 }; // 決定論RNG使用
        const answerPatterns = {
            balanced: () => 3 + Math.floor(rng.next() * 3), // 3-5
            innovative: () => rng.next() > 0.7 ? 5 : 4,     // 主に4-5
            stable: () => rng.next() > 0.3 ? 2 : 3,         // 主に2-3
            stressed: () => rng.next() > 0.5 ? 1 : 2        // 主に1-2
        };
        
        const pattern = answerPatterns[profileType] || answerPatterns.balanced;
        const answers = {};
        
        for (let i = 1; i <= 36; i++) {
            answers[`q${i}`] = pattern();
        }
        
        return answers;
    }
    
    /**
     * 開発パネルを表示
     */
    showDevPanel() {
        if (!this.isDevelopment) return;
        
        // 既存のパネルがあれば削除
        const existing = document.getElementById('dev-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'dev-panel';
        panel.innerHTML = `
            <style>
                #dev-panel {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(15, 23, 42, 0.95);
                    border: 2px solid #3b82f6;
                    border-radius: 12px;
                    padding: 20px;
                    z-index: 10000;
                    color: white;
                    font-family: monospace;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                    max-width: 300px;
                }
                
                #dev-panel h3 {
                    margin: 0 0 15px 0;
                    color: #3b82f6;
                    font-size: 14px;
                }
                
                #dev-panel .dev-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                #dev-panel button {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s;
                }
                
                #dev-panel button:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }
                
                #dev-panel select {
                    background: #1e293b;
                    color: white;
                    border: 1px solid #3b82f6;
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 12px;
                }
                
                #dev-panel .status {
                    margin-top: 10px;
                    padding: 8px;
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 6px;
                    font-size: 11px;
                }
                
                #dev-panel .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: transparent;
                    color: #64748b;
                    padding: 4px 8px;
                    font-size: 16px;
                }
                
                #dev-panel .close-btn:hover {
                    color: #e2e8f0;
                    background: transparent;
                }
            </style>
            
            <button class="close-btn" onclick="devMode.hideDevPanel()">×</button>
            <h3>🔧 開発モード</h3>
            
            <div class="dev-controls">
                <select id="profile-selector">
                    <option value="balanced">バランス型</option>
                    <option value="innovative">革新型</option>
                    <option value="stable">安定型</option>
                    <option value="stressed">ストレス状態</option>
                </select>
                
                <button onclick="devMode.applyProfile()">
                    プロファイル適用
                </button>
                
                <button onclick="devMode.clearData()">
                    データクリア
                </button>
                
                <button onclick="devMode.reloadPage()">
                    ページリロード
                </button>
                
                <button onclick="devMode.goToAnalyzer()">
                    OSアナライザーへ
                </button>
                
                <button onclick="devMode.disableDevMode()">
                    開発モード終了
                </button>
            </div>
            
            <div class="status" id="dev-status">
                現在のプロファイル: ${localStorage.getItem('currentMockProfile') || 'なし'}
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    /**
     * 開発パネルを非表示
     */
    hideDevPanel() {
        const panel = document.getElementById('dev-panel');
        if (panel) panel.remove();
    }
    
    /**
     * プロファイルを適用
     */
    applyProfile() {
        const selector = document.getElementById('profile-selector');
        const profileType = selector.value;
        this.setMockData(profileType);
        this.updateStatus(`プロファイル適用: ${this.mockProfiles[profileType].name}`);
    }
    
    /**
     * データをクリア
     */
    clearData() {
        localStorage.removeItem('osAnalysisResult');
        localStorage.removeItem('osAnalysisAnswers');
        localStorage.removeItem('currentMockProfile');
        this.updateStatus('データをクリアしました');
    }
    
    /**
     * ページをリロード
     */
    reloadPage() {
        window.location.reload();
    }
    
    /**
     * OSアナライザーへ遷移
     */
    goToAnalyzer() {
        window.location.href = '/os_analyzer.html';
    }
    
    /**
     * ステータス更新
     */
    updateStatus(message) {
        const status = document.getElementById('dev-status');
        if (status) {
            status.textContent = message;
            status.style.background = 'rgba(16, 185, 129, 0.2)';
            setTimeout(() => {
                status.style.background = 'rgba(59, 130, 246, 0.1)';
            }, 2000);
        }
    }
}

// グローバルに公開
window.devMode = new DevModeManager();

// 開発モードの場合、自動的にパネル表示
if (window.devMode.isDevelopment) {
    document.addEventListener('DOMContentLoaded', () => {
        window.devMode.showDevPanel();
        console.log('🔧 開発モード有効 - 右下のパネルから操作可能');
    });
}

// コンソールコマンドも提供
console.log('💡 開発モードコマンド:');
console.log('  devMode.enableDevMode() - 開発モード有効化');
console.log('  devMode.setMockData("balanced") - モックデータ設定');
console.log('  devMode.clearData() - データクリア');