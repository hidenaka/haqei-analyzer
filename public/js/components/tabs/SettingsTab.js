/**
 * SettingsTab.js
 * アプリケーション設定、テーマ変更、言語設定を含む設定タブ
 */

class SettingsTab extends BaseTabView {
    constructor() {
        super('settings');
        this.settings = this.loadSettings();
        this.themes = {
            light: { name: 'ライト', icon: '☀️' },
            dark: { name: 'ダーク', icon: '🌙' },
            auto: { name: '自動', icon: '🔄' }
        };
        this.languages = {
            ja: { name: '日本語', flag: '🇯🇵' },
            en: { name: 'English', flag: '🇺🇸' },
            zh: { name: '中文', flag: '🇨🇳' }
        };
    }

    loadSettings() {
        const defaultSettings = {
            theme: 'auto',
            language: 'ja',
            notifications: true,
            autoSave: true,
            animationsEnabled: true,
            soundEnabled: false,
            dataRetention: 30,
            exportFormat: 'pdf',
            privacyMode: false,
            analyticsEnabled: true
        };
        
        try {
            const saved = localStorage.getItem('haqei_settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.warn('設定の読み込みに失敗しました:', error);
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('haqei_settings', JSON.stringify(this.settings));
            this.showNotification('設定が保存されました', 'success');
        } catch (error) {
            console.error('設定の保存に失敗しました:', error);
            this.showNotification('設定の保存に失敗しました', 'error');
        }
    }

    render() {
        return `
            <div class="settings-container">
                <div class="settings-header">
                    <h2>⚙️ 設定</h2>
                    <p>アプリケーションの動作をカスタマイズできます</p>
                </div>

                <div class="settings-content">
                    <!-- 外観設定 -->
                    <div class="settings-section">
                        <h3>🎨 外観</h3>
                        <div class="setting-group">
                            <label class="setting-label">テーマ</label>
                            <div class="theme-selector">
                                ${Object.entries(this.themes).map(([key, theme]) => `
                                    <button class="theme-option ${this.settings.theme === key ? 'active' : ''}" 
                                            data-theme="${key}">
                                        <span class="theme-icon">${theme.icon}</span>
                                        <span class="theme-name">${theme.name}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="setting-group">
                            <label class="setting-label">アニメーション</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="animations" 
                                       ${this.settings.animationsEnabled ? 'checked' : ''}>
                                <label for="animations" class="toggle-label"></label>
                            </div>
                        </div>
                    </div>

                    <!-- 言語設定 -->
                    <div class="settings-section">
                        <h3>🌐 言語</h3>
                        <div class="setting-group">
                            <label class="setting-label">表示言語</label>
                            <div class="language-selector">
                                ${Object.entries(this.languages).map(([key, lang]) => `
                                    <button class="language-option ${this.settings.language === key ? 'active' : ''}" 
                                            data-language="${key}">
                                        <span class="language-flag">${lang.flag}</span>
                                        <span class="language-name">${lang.name}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- 通知設定 -->
                    <div class="settings-section">
                        <h3>🔔 通知</h3>
                        <div class="setting-group">
                            <label class="setting-label">通知を有効にする</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="notifications" 
                                       ${this.settings.notifications ? 'checked' : ''}>
                                <label for="notifications" class="toggle-label"></label>
                            </div>
                        </div>

                        <div class="setting-group">
                            <label class="setting-label">サウンド</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="sound" 
                                       ${this.settings.soundEnabled ? 'checked' : ''}>
                                <label for="sound" class="toggle-label"></label>
                            </div>
                        </div>
                    </div>

                    <!-- データ設定 -->
                    <div class="settings-section">
                        <h3>💾 データ</h3>
                        <div class="setting-group">
                            <label class="setting-label">自動保存</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="autoSave" 
                                       ${this.settings.autoSave ? 'checked' : ''}>
                                <label for="autoSave" class="toggle-label"></label>
                            </div>
                        </div>

                        <div class="setting-group">
                            <label class="setting-label">データ保持期間（日）</label>
                            <div class="number-input">
                                <input type="number" id="dataRetention" 
                                       value="${this.settings.dataRetention}" 
                                       min="1" max="365">
                            </div>
                        </div>

                        <div class="setting-group">
                            <label class="setting-label">デフォルトエクスポート形式</label>
                            <select id="exportFormat" class="select-input">
                                <option value="pdf" ${this.settings.exportFormat === 'pdf' ? 'selected' : ''}>PDF</option>
                                <option value="json" ${this.settings.exportFormat === 'json' ? 'selected' : ''}>JSON</option>
                                <option value="csv" ${this.settings.exportFormat === 'csv' ? 'selected' : ''}>CSV</option>
                                <option value="html" ${this.settings.exportFormat === 'html' ? 'selected' : ''}>HTML</option>
                            </select>
                        </div>
                    </div>

                    <!-- プライバシー設定 -->
                    <div class="settings-section">
                        <h3>🔒 プライバシー</h3>
                        <div class="setting-group">
                            <label class="setting-label">プライバシーモード</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="privacyMode" 
                                       ${this.settings.privacyMode ? 'checked' : ''}>
                                <label for="privacyMode" class="toggle-label"></label>
                            </div>
                            <p class="setting-description">個人情報の記録を最小限に抑えます</p>
                        </div>

                        <div class="setting-group">
                            <label class="setting-label">分析データの収集</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="analytics" 
                                       ${this.settings.analyticsEnabled ? 'checked' : ''}>
                                <label for="analytics" class="toggle-label"></label>
                            </div>
                            <p class="setting-description">アプリの改善のため匿名データを収集します</p>
                        </div>
                    </div>

                    <!-- データ管理 -->
                    <div class="settings-section">
                        <h3>🗂️ データ管理</h3>
                        <div class="data-management">
                            <button class="action-button export-data" id="exportData">
                                📤 データをエクスポート
                            </button>
                            <button class="action-button import-data" id="importData">
                                📥 データをインポート
                            </button>
                            <button class="action-button clear-data warning" id="clearData">
                                🗑️ すべてのデータを削除
                            </button>
                        </div>
                    </div>

                    <!-- アプリ情報 -->
                    <div class="settings-section">
                        <h3>ℹ️ アプリ情報</h3>
                        <div class="app-info">
                            <div class="info-item">
                                <span class="info-label">バージョン:</span>
                                <span class="info-value">1.0.0</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">最終更新:</span>
                                <span class="info-value">${new Date().toLocaleDateString('ja-JP')}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">開発者:</span>
                                <span class="info-value">HAQEI Team</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-footer">
                    <button class="save-button" id="saveSettings">
                        💾 設定を保存
                    </button>
                    <button class="reset-button" id="resetSettings">
                        🔄 デフォルトに戻す
                    </button>
                </div>
            </div>

            <!-- 確認ダイアログ -->
            <div class="confirmation-dialog" id="confirmDialog" style="display: none;">
                <div class="dialog-content">
                    <h3 id="dialogTitle">確認</h3>
                    <p id="dialogMessage">この操作を実行しますか？</p>
                    <div class="dialog-buttons">
                        <button class="cancel-button" id="dialogCancel">キャンセル</button>
                        <button class="confirm-button" id="dialogConfirm">実行</button>
                    </div>
                </div>
            </div>

            <!-- 通知 -->
            <div class="notification" id="notification" style="display: none;">
                <span class="notification-message"></span>
            </div>
        `;
    }

    bindEvents() {
        const container = this.container;

        // テーマ選択
        container.querySelectorAll('.theme-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.changeTheme(theme);
            });
        });

        // 言語選択
        container.querySelectorAll('.language-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const language = e.currentTarget.dataset.language;
                this.changeLanguage(language);
            });
        });

        // トグルスイッチ
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const setting = e.target.id;
                this.settings[setting] = e.target.checked;
            });
        });

        // 数値入力
        container.querySelector('#dataRetention').addEventListener('change', (e) => {
            this.settings.dataRetention = parseInt(e.target.value);
        });

        // セレクト
        container.querySelector('#exportFormat').addEventListener('change', (e) => {
            this.settings.exportFormat = e.target.value;
        });

        // データ管理ボタン
        container.querySelector('#exportData').addEventListener('click', () => {
            this.exportUserData();
        });

        container.querySelector('#importData').addEventListener('click', () => {
            this.importUserData();
        });

        container.querySelector('#clearData').addEventListener('click', () => {
            this.showConfirmDialog(
                'データ削除の確認',
                'すべてのデータが削除されます。この操作は取り消せません。',
                () => this.clearAllData()
            );
        });

        // 設定保存・リセット
        container.querySelector('#saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        container.querySelector('#resetSettings').addEventListener('click', () => {
            this.showConfirmDialog(
                '設定リセットの確認',
                'すべての設定がデフォルト値に戻されます。',
                () => this.resetSettings()
            );
        });

        // ダイアログ
        container.querySelector('#dialogCancel').addEventListener('click', () => {
            this.hideConfirmDialog();
        });

        container.querySelector('#dialogConfirm').addEventListener('click', () => {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.hideConfirmDialog();
        });
    }

    changeTheme(theme) {
        this.settings.theme = theme;
        
        // テーマ選択の更新
        this.container.querySelectorAll('.theme-option').forEach(button => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });

        // テーマの適用
        this.applyTheme(theme);
        this.showNotification(`テーマを「${this.themes[theme].name}」に変更しました`, 'success');
    }

    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }

        root.setAttribute('data-theme', theme);
    }

    changeLanguage(language) {
        this.settings.language = language;
        
        // 言語選択の更新
        this.container.querySelectorAll('.language-option').forEach(button => {
            button.classList.toggle('active', button.dataset.language === language);
        });

        this.showNotification(`言語を「${this.languages[language].name}」に変更しました`, 'success');
    }

    exportUserData() {
        try {
            const data = {
                settings: this.settings,
                analysisHistory: JSON.parse(localStorage.getItem('haqei_analysis_history') || '[]'),
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `haqei_data_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            this.showNotification('データをエクスポートしました', 'success');
        } catch (error) {
            console.error('データエクスポートエラー:', error);
            this.showNotification('データのエクスポートに失敗しました', 'error');
        }
    }

    importUserData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.settings) {
                            this.settings = { ...this.settings, ...data.settings };
                            this.saveSettings();
                            this.refresh();
                        }
                        if (data.analysisHistory) {
                            localStorage.setItem('haqei_analysis_history', JSON.stringify(data.analysisHistory));
                        }
                        this.showNotification('データをインポートしました', 'success');
                    } catch (error) {
                        console.error('データインポートエラー:', error);
                        this.showNotification('データのインポートに失敗しました', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    clearAllData() {
        try {
            localStorage.clear();
            this.settings = this.loadSettings();
            this.refresh();
            this.showNotification('すべてのデータを削除しました', 'success');
        } catch (error) {
            console.error('データ削除エラー:', error);
            this.showNotification('データの削除に失敗しました', 'error');
        }
    }

    resetSettings() {
        this.settings = this.loadSettings();
        this.saveSettings();
        this.refresh();
        this.showNotification('設定をデフォルトに戻しました', 'success');
    }

    showConfirmDialog(title, message, callback) {
        const dialog = this.container.querySelector('#confirmDialog');
        const titleEl = dialog.querySelector('#dialogTitle');
        const messageEl = dialog.querySelector('#dialogMessage');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        this.confirmCallback = callback;
        
        dialog.style.display = 'flex';
    }

    hideConfirmDialog() {
        const dialog = this.container.querySelector('#confirmDialog');
        dialog.style.display = 'none';
        this.confirmCallback = null;
    }

    showNotification(message, type = 'info') {
        const notification = this.container.querySelector('#notification');
        const messageEl = notification.querySelector('.notification-message');
        
        messageEl.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    onShow() {
        super.onShow();
        // 現在のテーマを適用
        this.applyTheme(this.settings.theme);
    }

    refresh() {
        this.container.innerHTML = this.render();
        this.bindEvents();
    }
}

// グローバルに登録
window.SettingsTab = SettingsTab;