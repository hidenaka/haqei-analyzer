/**
 * TabNavigator.js - タブナビゲーション管理クラス
 * 6つのタブ間の切り替えとコンテンツ表示を管理
 */

class TabNavigator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tabs = new Map();
        this.activeTab = 'basic';
        this.tabButtons = new Map();
        this.tabViews = new Map();
        this.availableTabs = []; // 利用可能なタブを動的に管理
        
        this.init();
    }

    init() {
        this.detectAvailableTabs(); // 利用可能なタブを検出
        this.createTabStructure();
        this.setupEventListeners();
        this.updateNavigationVisibility(); // ナビゲーションの表示/非表示を制御
    }

    createTabStructure() {
        // 既存の要素をチェックして、なければ作成
        let tabNav = this.container.querySelector('.haqei-tab-navigation');
        let tabContent = this.container.querySelector('.haqei-tab-content');

        if (!tabNav) {
            // 利用可能なタブのみでナビゲーションバーを作成
            tabNav = document.createElement('div');
            tabNav.className = 'haqei-tab-navigation';
            
            const buttonsHTML = this.availableTabs.map((tab, index) => `
                <button class="haqei-tab-button ${index === 0 ? 'active' : ''}" data-tab="${tab.id}">
                    <span class="haqei-tab-icon">${tab.icon}</span>
                    <span class="haqei-tab-label">${tab.label}</span>
                </button>
            `).join('');
            
            tabNav.innerHTML = `<div class="haqei-tab-buttons">${buttonsHTML}</div>`;
            this.container.appendChild(tabNav);
        }

        if (!tabContent) {
            // 利用可能なタブのみでコンテンツエリアを作成
            tabContent = document.createElement('div');
            tabContent.className = 'haqei-tab-content';
            
            const panelsHTML = this.availableTabs.map((tab, index) => `
                <div class="haqei-tab-panel ${index === 0 ? 'active' : ''}" data-tab="${tab.id}" id="${tab.id === 'basic' ? 'basic-results' : tab.id}"></div>
            `).join('');
            
            tabContent.innerHTML = panelsHTML;
            this.container.appendChild(tabContent);
        }

        // ボタンとパネルの参照を保存
        this.container.querySelectorAll('.haqei-tab-button').forEach(button => {
            this.tabButtons.set(button.dataset.tab, button);
        });

        this.container.querySelectorAll('.haqei-tab-panel').forEach(panel => {
            this.tabs.set(panel.dataset.tab, panel);
        });
    }

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.haqei-tab-button')) {
                const button = e.target.closest('.haqei-tab-button');
                const tabId = button.dataset.tab;
                this.switchToTab(tabId);
            }
        });
    }

    switchToTab(tabId) {
        if (!this.tabs.has(tabId)) {
            console.warn(`Tab ${tabId} not found`);
            return;
        }

        // 現在のアクティブタブを非アクティブに
        if (this.activeTab) {
            this.tabButtons.get(this.activeTab)?.classList.remove('active');
            this.tabs.get(this.activeTab)?.classList.remove('active');
        }

        // 新しいタブをアクティブに
        this.tabButtons.get(tabId)?.classList.add('active');
        this.tabs.get(tabId)?.classList.add('active');
        this.activeTab = tabId;

        // タブビューをレンダリング
        if (this.tabViews && this.tabViews.has(tabId)) {
            const tabView = this.tabViews.get(tabId);
            const panel = this.tabs.get(tabId);
            if (tabView && panel) {
                tabView.render(panel);
                // onActivateメソッドを呼び出し
                if (typeof tabView.onActivate === 'function') {
                    tabView.onActivate();
                }
            }
        }

        // タブ切り替えイベントを発火
        this.container.dispatchEvent(new CustomEvent('tabChanged', {
            detail: { tabId, panel: this.tabs.get(tabId) }
        }));
    }

    getTabPanel(tabId) {
        return this.tabs.get(tabId);
    }

    registerTab(tabId, tabView) {
        const panel = this.getTabPanel(tabId);
        if (panel && tabView) {
            // タブビューを保存
            this.tabViews = this.tabViews || new Map();
            this.tabViews.set(tabId, tabView);
            
            // 初期レンダリング（アクティブタブのみ）
            if (this.activeTab === tabId || (!this.activeTab && tabId === 'basic')) {
                tabView.render(panel);
            }
        }
    }

    destroy() {
        this.tabs.clear();
        this.tabButtons.clear();
        this.activeTab = null;
    }

    /**
     * 利用可能なタブを検出（スクリプトタグの存在をチェック）
     */
    detectAvailableTabs() {
        const tabConfigs = [
            { id: 'basic', script: 'BasicResultsTab.js', icon: '📊', label: '基本結果' },
            { id: 'detailed', script: 'DetailedAnalysisTab.js', icon: '🔍', label: '詳細分析' },
            { id: 'insights', script: 'InsightsTab.js', icon: '💡', label: '洞察' },
            { id: 'scenarios', script: 'ScenariosTab.js', icon: '🎭', label: 'シナリオ' },
            { id: 'export', script: 'ExportTab.js', icon: '📤', label: 'エクスポート' }
        ];

        this.availableTabs = tabConfigs.filter(config => {
            // スクリプトタグが存在し、コメントアウトされていないかチェック
            const scripts = document.querySelectorAll('script[src*="' + config.script + '"]');
            return scripts.length > 0;
        });

        console.log('🔍 利用可能なタブ:', this.availableTabs.map(t => t.id));
    }

    /**
     * ナビゲーションの表示/非表示を制御
     */
    updateNavigationVisibility() {
        const tabNav = this.container.querySelector('.haqei-tab-navigation');
        if (!tabNav) return;

        // タブが1つ以下の場合はナビゲーションを非表示
        if (this.availableTabs.length <= 1) {
            tabNav.style.display = 'none';
            console.log('📱 タブが1つ以下のため、ナビゲーションを非表示にしました');
        } else {
            tabNav.style.display = 'block';
            console.log('📱 複数タブのため、ナビゲーションを表示します');
        }
    }
}

// グローバルスコープに公開
window.TabNavigator = TabNavigator;